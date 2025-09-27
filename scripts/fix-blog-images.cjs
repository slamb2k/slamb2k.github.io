#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const contentDir = path.join(__dirname, '..', 'src', 'content', 'blog');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'blog');

// Function to get file hash
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// Step 1: Remove duplicates
console.log('=== Step 1: Removing duplicate images ===');
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));
console.log(`Found ${files.length} PNG files`);

const hashToFiles = {};
files.forEach(file => {
  const filePath = path.join(imagesDir, file);
  const hash = getFileHash(filePath);
  if (!hashToFiles[hash]) {
    hashToFiles[hash] = [];
  }
  hashToFiles[hash].push(file);
});

// Keep the shortest filename for each duplicate set
const imagesToKeep = new Map(); // hash -> filename
const imagesToDelete = [];

Object.entries(hashToFiles).forEach(([hash, fileList]) => {
  // Sort by name length to keep the shortest/simplest name
  fileList.sort((a, b) => a.length - b.length);
  const keepFile = fileList[0];
  imagesToKeep.set(hash, keepFile);

  if (fileList.length > 1) {
    for (let i = 1; i < fileList.length; i++) {
      imagesToDelete.push(fileList[i]);
    }
  }
});

// Delete duplicates
let totalDeleted = 0;
imagesToDelete.forEach(file => {
  const filePath = path.join(imagesDir, file);
  fs.unlinkSync(filePath);
  totalDeleted++;
});

console.log(`Deleted ${totalDeleted} duplicate images`);

// Step 2: Update MDX files to use correct image names
console.log('\n=== Step 2: Updating MDX files to use correct images ===');

const mdxFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));
let totalUpdates = 0;

mdxFiles.forEach(mdxFile => {
  const filePath = path.join(contentDir, mdxFile);
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = false;

  // Find all image references
  const imagePattern = /\/images\/blog\/([^)"']+\.png)/g;
  let match;
  const replacements = [];

  while ((match = imagePattern.exec(content)) !== null) {
    const imageName = match[1];
    const imagePath = path.join(imagesDir, imageName);

    // Check if this exact image exists
    if (!fs.existsSync(imagePath)) {
      // Try to find a matching image by checking hashes
      let foundReplacement = false;

      // Check if this was a duplicate that got removed
      for (const [hash, keepFile] of imagesToKeep) {
        // Check if the pattern matches
        const basePattern = imageName.replace(/-\d+\.png$/, '');
        if (keepFile.startsWith(basePattern)) {
          replacements.push({
            from: `/images/blog/${imageName}`,
            to: `/images/blog/${keepFile}`,
          });
          foundReplacement = true;
          break;
        }
      }

      if (!foundReplacement) {
        console.log(`  Warning: No matching image found for ${imageName} in ${mdxFile}`);
      }
    }
  }

  // Apply replacements
  replacements.forEach(({ from, to }) => {
    content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
    updated = true;
    totalUpdates++;
  });

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`  Updated ${mdxFile} with ${replacements.length} image fixes`);
  }
});

console.log(`\n=== Summary ===`);
console.log(`Removed ${totalDeleted} duplicate images`);
console.log(`Updated ${totalUpdates} image references in MDX files`);

// Check final size
const remainingFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));
let totalSize = 0;
remainingFiles.forEach(file => {
  const stats = fs.statSync(path.join(imagesDir, file));
  totalSize += stats.size;
});

console.log(`Remaining images: ${remainingFiles.length}`);
console.log(`Total size: ${Math.round((totalSize / 1024 / 1024) * 10) / 10}MB`);
