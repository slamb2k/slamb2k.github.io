#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Get all MDX files
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

console.log(`Checking ${files.length} MDX files for broken image patterns...`);

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let fixedCount = 0;

  // Pattern: (/images/blog/xxx.png "image")](/images/blog/yyy.png)
  // This is malformed - should just be ![alt text](/images/blog/yyy.png)
  const brokenPattern = /\(\/images\/blog\/[^)]+\s+"[^"]*"\)\]\(\/images\/blog\/[^)]+\)/g;

  content = content.replace(brokenPattern, match => {
    // Extract the second image URL (the one that should be kept)
    const secondUrlMatch = match.match(/\]\((\/images\/blog\/[^)]+)\)$/);
    if (secondUrlMatch) {
      const imageUrl = secondUrlMatch[1];
      const filename = path
        .basename(imageUrl, path.extname(imageUrl))
        .replace(/-\d+$/, '') // Remove timestamp
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      fixedCount++;
      return `![${filename}](${imageUrl})`;
    }
    return match;
  });

  // Also fix any remaining broken patterns like: (/images/blog/xxx.png "image")
  const leftoverPattern = /\(\/images\/blog\/[^)]+\s+"[^"]*"\)/g;

  content = content.replace(leftoverPattern, match => {
    // Extract the image URL
    const urlMatch = match.match(/\((\/images\/blog\/[^)]+)\s+/);
    if (urlMatch) {
      const imageUrl = urlMatch[1];
      const filename = path
        .basename(imageUrl, path.extname(imageUrl))
        .replace(/-\d+$/, '')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      fixedCount++;
      return `![${filename}](${imageUrl})`;
    }
    return match;
  });

  if (fixedCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed ${fixedCount} broken image patterns in ${file}`);
  }
});

console.log('\n✅ Image pattern fix complete!');
