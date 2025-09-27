import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images/blog');

async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const basename = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);

  try {
    // Get file size before optimization
    const statsBefore = fs.statSync(imagePath);
    const sizeBefore = (statsBefore.size / 1024).toFixed(2);

    if (ext === '.png') {
      // Convert PNG to WebP for better compression
      const webpPath = path.join(dir, `${basename}.webp`);

      // First optimize the PNG
      await execPromise(`pngquant --quality=65-80 --force --output "${imagePath}" "${imagePath}"`);

      // Also create a WebP version
      await execPromise(`cwebp -q 80 "${imagePath}" -o "${webpPath}"`);

      console.log(`  ✓ Optimized PNG: ${path.basename(imagePath)} (${sizeBefore}KB → smaller)`);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      // Optimize JPEG
      await execPromise(`jpegoptim --max=80 --strip-all --overwrite "${imagePath}"`);

      // Also create a WebP version
      const webpPath = path.join(dir, `${basename}.webp`);
      await execPromise(`cwebp -q 80 "${imagePath}" -o "${webpPath}"`);

      const statsAfter = fs.statSync(imagePath);
      const sizeAfter = (statsAfter.size / 1024).toFixed(2);

      console.log(
        `  ✓ Optimized JPEG: ${path.basename(imagePath)} (${sizeBefore}KB → ${sizeAfter}KB)`
      );
    }

    // Resize if too large (max width 1200px)
    await execPromise(`mogrify -resize "1200>" "${imagePath}"`);
  } catch (err) {
    console.log(`  ✗ Failed to optimize ${path.basename(imagePath)}: ${err.message}`);
  }
}

async function main() {
  console.log('🖼️  Optimizing blog images...\n');

  // Check if required tools are installed
  try {
    await execPromise('which pngquant');
    await execPromise('which jpegoptim');
    await execPromise('which cwebp');
    await execPromise('which mogrify');
  } catch (err) {
    console.log('⚠️  Installing required image optimization tools...');
    try {
      await execPromise(
        'sudo apt-get update && sudo apt-get install -y pngquant jpegoptim webp imagemagick'
      );
    } catch (installErr) {
      console.log('❌ Failed to install tools. Please install manually:');
      console.log('   sudo apt-get install pngquant jpegoptim webp imagemagick');
      process.exit(1);
    }
  }

  // Get all image files
  const files = fs
    .readdirSync(imagesDir)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .map(f => path.join(imagesDir, f));

  console.log(`Found ${files.length} images to optimize\n`);

  // Process each image
  for (const file of files) {
    await optimizeImage(file);
  }

  // Report on WebP files created
  const webpFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.webp'));
  console.log(`\n✅ Optimization complete!`);
  console.log(`   - ${files.length} images optimized`);
  console.log(`   - ${webpFiles.length} WebP versions created`);

  // Calculate total size savings
  const totalSize = files.reduce((sum, f) => {
    try {
      return sum + fs.statSync(f).size;
    } catch {
      return sum;
    }
  }, 0);

  console.log(`   - Total size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
}

main().catch(console.error);
