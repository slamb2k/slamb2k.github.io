#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'src', 'content', 'blog');
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'blog');

// Get all MDX files
const mdxFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

// Find all image references in MDX files
const usedImages = new Set();

mdxFiles.forEach(file => {
  const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');

  // Find all image references (multiple patterns)
  const patterns = [
    /!\[.*?\]\(\/images\/blog\/([^)]+)\)/g, // Markdown images
    /src="\/images\/blog\/([^"]+)"/g, // HTML img src
    /src='\/images\/blog\/([^']+)'/g, // HTML img src with single quotes
    /\/images\/blog\/([^\s"')]+)/g, // Any reference
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      usedImages.add(match[1]);
    }
  });
});

console.log(`Found ${usedImages.size} images referenced in MDX files`);

// Get all image files
const allImages = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));
console.log(`Found ${allImages.length} images in public/images/blog/`);

// Find unused images
const unusedImages = allImages.filter(img => !usedImages.has(img));
console.log(`Found ${unusedImages.length} unused images\n`);

if (unusedImages.length > 0) {
  let totalSize = 0;
  console.log('Unused images:');
  unusedImages.forEach(img => {
    const filePath = path.join(imagesDir, img);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`  - ${img} (${sizeKB}KB)`);
    totalSize += stats.size;
  });

  console.log(
    `\nTotal size of unused images: ${Math.round((totalSize / 1024 / 1024) * 10) / 10}MB`
  );

  // Ask for confirmation
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('\nDelete unused images? (y/n): ', answer => {
    if (answer.toLowerCase() === 'y') {
      unusedImages.forEach(img => {
        fs.unlinkSync(path.join(imagesDir, img));
        console.log(`Deleted: ${img}`);
      });
      console.log(
        `\n✅ Removed ${unusedImages.length} unused images, saved ${Math.round((totalSize / 1024 / 1024) * 10) / 10}MB`
      );
    } else {
      console.log('Deletion cancelled');
    }
    rl.close();
  });
} else {
  console.log('✅ No unused images found');
}
