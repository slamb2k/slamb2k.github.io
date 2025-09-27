#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'blog');

// Function to get file hash
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// Get all PNG files
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));
console.log(`Found ${files.length} PNG files`);

// Create a map of hash to files
const hashToFiles = {};
files.forEach(file => {
  const filePath = path.join(imagesDir, file);
  const hash = getFileHash(filePath);
  if (!hashToFiles[hash]) {
    hashToFiles[hash] = [];
  }
  hashToFiles[hash].push(file);
});

// Find duplicates and keep the one with the shortest name (usually the first/original)
let totalSaved = 0;
let duplicatesRemoved = 0;
const filesToDelete = [];

Object.entries(hashToFiles).forEach(([hash, fileList]) => {
  if (fileList.length > 1) {
    // Sort by name length to keep the shortest/simplest name
    fileList.sort((a, b) => a.length - b.length);
    const keepFile = fileList[0];
    console.log(`\nDuplicate set (keeping ${keepFile}):`);

    for (let i = 1; i < fileList.length; i++) {
      const deleteFile = fileList[i];
      const filePath = path.join(imagesDir, deleteFile);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`  - Will delete: ${deleteFile} (${sizeKB}KB)`);
      totalSaved += stats.size;
      duplicatesRemoved++;
      filesToDelete.push(deleteFile);
    }
  }
});

console.log(`\n=== Summary ===`);
console.log(`Unique images: ${Object.keys(hashToFiles).length}`);
console.log(`Duplicate images to remove: ${duplicatesRemoved}`);
console.log(`Space to be saved: ${Math.round(totalSaved / 1024 / 1024)}MB`);

// Ask for confirmation
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nProceed with deletion? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    filesToDelete.forEach(file => {
      const filePath = path.join(imagesDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${file}`);
    });
    console.log(`\n✅ Removed ${duplicatesRemoved} duplicate images, saved ${Math.round(totalSaved / 1024 / 1024)}MB`);
  } else {
    console.log('Deletion cancelled');
  }
  rl.close();
});