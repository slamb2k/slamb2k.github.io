#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Get all MDX files
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

console.log(`Checking ${files.length} MDX files for ALL broken image patterns...`);

let totalFixed = 0;
let filesFixed = 0;

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let fixedCount = 0;

  // Pattern 1: [text width x height](url1)][text](url2) - Keep the full-size image (url2)
  // This is the most common pattern from WordPress migration
  const brokenImagePattern1 = /\[[^\]]+\s+\d+x\d+\]\([^)]+\)\]\[[^\]]+\]\([^)]+\)/g;

  content = content.replace(brokenImagePattern1, match => {
    // Extract the second URL (the full-size image) and alt text
    const secondUrlMatch = match.match(/\]\[([^\]]+)\]\(([^)]+)\)$/);
    if (secondUrlMatch) {
      const altText = secondUrlMatch[1];
      const imageUrl = secondUrlMatch[2];
      fixedCount++;

      // Check if it's an external URL that likely doesn't exist anymore
      if (
        imageUrl.startsWith('http://welltechnically.com') ||
        imageUrl.startsWith('https://welltechnically.com')
      ) {
        // For external URLs that are likely broken, we'll remove the image entirely
        // and add a note
        return `[Image: ${altText}]`;
      } else {
        return `![${altText}](${imageUrl})`;
      }
    }
    return match;
  });

  // Pattern 2: [text](url1)][text](url2) - without dimensions
  // Keep the second URL which is typically the full-size image
  const brokenImagePattern2 = /(?<!\!)\[[^\]]+\]\([^)]+\)\]\[[^\]]+\]\([^)]+\)/g;

  content = content.replace(brokenImagePattern2, match => {
    // Make sure this isn't already a proper image (starting with !)
    if (match.startsWith('!')) return match;

    // Extract the second URL and alt text
    const secondPartMatch = match.match(/\]\[([^\]]+)\]\(([^)]+)\)$/);
    if (secondPartMatch) {
      const altText = secondPartMatch[1];
      const imageUrl = secondPartMatch[2];

      // Check if this looks like an image URL
      if (imageUrl.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
        fixedCount++;

        // Check if it's an external URL that likely doesn't exist anymore
        if (
          imageUrl.startsWith('http://welltechnically.com') ||
          imageUrl.startsWith('https://welltechnically.com')
        ) {
          return `[Image: ${altText}]`;
        } else {
          return `![${altText}](${imageUrl})`;
        }
      }
    }
    return match;
  });

  // Pattern 3: Just [text width x height](url) without the second part
  // Convert to proper image syntax
  const singleBrokenPattern =
    /(?<!\!)\[([^\]]+)\s+\d+x\d+\]\(([^)]+\.(png|jpg|jpeg|gif|webp|svg))\)/gi;

  content = content.replace(singleBrokenPattern, (match, altText, imageUrl) => {
    fixedCount++;

    // Check if it's an external URL that likely doesn't exist anymore
    if (
      imageUrl.startsWith('http://welltechnically.com') ||
      imageUrl.startsWith('https://welltechnically.com')
    ) {
      return `[Image: ${altText}]`;
    } else {
      return `![${altText}](${imageUrl})`;
    }
  });

  if (fixedCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed ${fixedCount} image patterns in ${file}`);
    totalFixed += fixedCount;
    filesFixed++;
  }
});

console.log(`\n✅ Fixed ${totalFixed} image patterns across ${filesFixed} files!`);
