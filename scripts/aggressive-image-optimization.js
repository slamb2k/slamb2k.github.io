#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images/blog');
const MAX_WIDTH = 800; // Aggressive max width for blog images
const JPEG_QUALITY = 75; // Lower quality for smaller files

async function convertToJpeg(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const basename = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);
  const jpegPath = path.join(dir, `${basename}.jpg`);

  // Skip if already JPEG
  if (ext === '.jpg' || ext === '.jpeg') {
    return imagePath;
  }

  try {
    // Convert to JPEG with aggressive compression
    await execPromise(`convert "${imagePath}" -quality ${JPEG_QUALITY} -strip "${jpegPath}"`);

    // Remove original PNG/other format
    fs.unlinkSync(imagePath);

    console.log(`  ✓ Converted to JPEG: ${basename}${ext} → ${basename}.jpg`);
    return jpegPath;
  } catch (err) {
    console.log(`  ✗ Failed to convert ${basename}${ext}: ${err.message}`);
    return imagePath;
  }
}

async function optimizeImage(imagePath) {
  const statsBefore = fs.statSync(imagePath);
  const sizeBefore = (statsBefore.size / 1024).toFixed(2);

  try {
    // First resize if needed (max 800px width)
    await execPromise(`mogrify -resize "${MAX_WIDTH}>" "${imagePath}"`);

    // Apply aggressive compression
    const ext = path.extname(imagePath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      // Progressive JPEG with aggressive quality
      await execPromise(`mogrify -interlace Plane -quality ${JPEG_QUALITY} -strip "${imagePath}"`);
    } else if (ext === '.png') {
      // For any remaining PNGs, use aggressive compression
      try {
        await execPromise(`pngquant --quality=50-70 --force --output "${imagePath}" "${imagePath}"`);
      } catch {
        // Fallback to ImageMagick if pngquant not available
        await execPromise(`mogrify -quality 70 -strip "${imagePath}"`);
      }
    }

    const statsAfter = fs.statSync(imagePath);
    const sizeAfter = (statsAfter.size / 1024).toFixed(2);
    const reduction = ((1 - statsAfter.size / statsBefore.size) * 100).toFixed(1);

    console.log(
      `  ✓ Optimized: ${path.basename(imagePath)} (${sizeBefore}KB → ${sizeAfter}KB, -${reduction}%)`
    );

    return statsAfter.size;
  } catch (err) {
    console.log(`  ✗ Failed to optimize ${path.basename(imagePath)}: ${err.message}`);
    return statsBefore.size;
  }
}

async function updateMdxReferences() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const mdxFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));
  let updateCount = 0;

  for (const file of mdxFiles) {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let hasChanges = false;

    // Replace .png references with .jpg where we converted
    const pngRegex = /\/images\/blog\/([^)]+)\.png/g;
    content = content.replace(pngRegex, (match, basename) => {
      const jpegPath = path.join(imagesDir, `${basename}.jpg`);
      if (fs.existsSync(jpegPath)) {
        hasChanges = true;
        return `/images/blog/${basename}.jpg`;
      }
      return match;
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf-8');
      updateCount++;
    }
  }

  if (updateCount > 0) {
    console.log(`\n✓ Updated ${updateCount} MDX files with new image references`);
  }
}

async function removeUnusedImages() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const mdxFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

  // Collect all referenced images
  const referencedImages = new Set();

  for (const file of mdxFiles) {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Find all image references
    const imageRegex = /\/images\/blog\/([^)]+)/g;
    let match;
    while ((match = imageRegex.exec(content)) !== null) {
      referencedImages.add(match[1]);
    }
  }

  // Find and remove unused images
  const allImages = fs.readdirSync(imagesDir);
  let removedCount = 0;
  let removedSize = 0;

  for (const image of allImages) {
    if (!referencedImages.has(image)) {
      const imagePath = path.join(imagesDir, image);
      const stats = fs.statSync(imagePath);
      removedSize += stats.size;
      fs.unlinkSync(imagePath);
      removedCount++;
      console.log(`  ✓ Removed unused: ${image}`);
    }
  }

  if (removedCount > 0) {
    console.log(`\n✓ Removed ${removedCount} unused images (${(removedSize / (1024 * 1024)).toFixed(2)}MB)`);
  }

  return removedSize;
}

async function main() {
  console.log('🚀 Aggressive Image Optimization Starting...\n');
  console.log('Settings:');
  console.log(`  - Max width: ${MAX_WIDTH}px`);
  console.log(`  - JPEG quality: ${JPEG_QUALITY}%`);
  console.log(`  - Converting PNGs to JPEG where possible\n`);

  // Check if ImageMagick is installed
  try {
    await execPromise('which convert && which mogrify');
  } catch (err) {
    console.log('❌ ImageMagick is required but not installed');
    console.log('   Please install: sudo apt-get install imagemagick');
    process.exit(1);
  }

  // Step 1: Remove unused images
  console.log('📦 Step 1: Removing unused images...');
  const removedSize = await removeUnusedImages();

  // Step 2: Convert PNGs to JPEGs
  console.log('\n🔄 Step 2: Converting PNGs to JPEGs...');
  const pngFiles = fs
    .readdirSync(imagesDir)
    .filter(f => f.endsWith('.png'))
    .map(f => path.join(imagesDir, f));

  for (const file of pngFiles) {
    await convertToJpeg(file);
  }

  // Step 3: Update MDX references
  console.log('\n📝 Step 3: Updating MDX references...');
  await updateMdxReferences();

  // Step 4: Optimize all remaining images
  console.log('\n🗜️ Step 4: Optimizing all images...');
  const allImages = fs
    .readdirSync(imagesDir)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .map(f => path.join(imagesDir, f));

  let totalSizeBefore = 0;
  let totalSizeAfter = 0;

  for (const file of allImages) {
    const statsBefore = fs.statSync(file);
    totalSizeBefore += statsBefore.size;
    const sizeAfter = await optimizeImage(file);
    totalSizeAfter += sizeAfter;
  }

  // Final report
  console.log('\n' + '='.repeat(50));
  console.log('✅ Optimization Complete!\n');
  console.log('Results:');
  console.log(`  - Images processed: ${allImages.length}`);
  console.log(`  - Unused images removed: ${(removedSize / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`  - Size before: ${(totalSizeBefore / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`  - Size after: ${(totalSizeAfter / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`  - Total reduction: ${((1 - totalSizeAfter / totalSizeBefore) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));
}

main().catch(console.error);