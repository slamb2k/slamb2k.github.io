#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../src/content/blog');

// Get all MDX files
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Track images we've seen in this file
  const seenImages = new Set();
  const lines = content.split('\n');
  const newLines = [];
  let duplicatesRemoved = 0;

  for (let line of lines) {
    // Check if line contains an image markdown
    const imageMatch = line.match(/!\[.*?\]\((\/images\/blog\/[^)]+)\)/);

    if (imageMatch) {
      const imagePath = imageMatch[1];

      // If we've seen this exact image path before in this file, skip the line
      // unless it's part of a paragraph (not on its own line)
      if (seenImages.has(imagePath)) {
        // Check if the image is inline with text (part of a paragraph)
        const hasTextBefore = line.indexOf('![') > 0;
        const hasTextAfter =
          line.indexOf(')') < line.length - 1 &&
          !line.substring(line.indexOf(')') + 1).match(/^\s*$/);

        if (hasTextBefore || hasTextAfter) {
          // It's inline with text, remove just the image reference but keep the text
          const cleanedLine = line.replace(/!\[.*?\]\([^)]+\)/g, '');
          if (cleanedLine.trim()) {
            newLines.push(cleanedLine);
          }
        }
        // Otherwise skip the entire line (it's a standalone duplicate image)
        duplicatesRemoved++;
      } else {
        // First occurrence of this image, keep it
        seenImages.add(imagePath);
        newLines.push(line);
      }
    } else {
      // Not an image line, keep it
      newLines.push(line);
    }
  }

  if (duplicatesRemoved > 0) {
    // Write the cleaned content back
    const newContent = newLines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Fixed ${file}: Removed ${duplicatesRemoved} duplicate image references`);
  }
});

console.log('✅ Duplicate image cleanup complete');
