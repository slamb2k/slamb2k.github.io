#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Get all MDX files
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

console.log(`Found ${files.length} MDX files to check...`);

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix broken image syntax: !(url) -> ![](url)
  const brokenImagePattern = /!\(([^)]+)\)/g;
  let matches = content.match(brokenImagePattern);

  if (matches && matches.length > 0) {
    console.log(`\nFixing ${matches.length} images in ${file}`);

    content = content.replace(brokenImagePattern, (match, url) => {
      // Extract filename for alt text
      const filename = path
        .basename(url, path.extname(url))
        .replace(/-\d+$/, '') // Remove timestamp
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words

      console.log(`  Fixed: ${match} -> ![${filename}](${url})`);
      return `![${filename}](${url})`;
    });

    // Write the fixed content back
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ Saved ${file}`);
  }
});

console.log('\n✅ Image fix complete!');
