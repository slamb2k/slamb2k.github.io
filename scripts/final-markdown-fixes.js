#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Get all MDX files
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

console.log(`Checking ${files.length} MDX files for final markdown fixes...`);

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let fixedCount = 0;

  // Fix pattern: ![alt][alt](url) -> should be ![alt](url)
  const doubleAltPattern = /!\[([^\]]+)\]\[[^\]]+\]\(([^)]+)\)/g;

  content = content.replace(doubleAltPattern, (match, altText, url) => {
    fixedCount++;
    return `![${altText}](${url})`;
  });

  // Fix images broken across lines - join them first
  const brokenImagePattern = /!\[[^\]]*\]\([^)]*\n[^)]*\)/g;

  content = content.replace(brokenImagePattern, match => {
    fixedCount++;
    // Remove newlines within the image markdown
    return match.replace(/\n/g, '');
  });

  // Fix any remaining line breaks in middle of URLs
  const urlLineBreakPattern = /\(https?:\/\/[^\s)]*\n[^\s)]*\)/g;

  content = content.replace(urlLineBreakPattern, match => {
    fixedCount++;
    return match.replace(/\n/g, '');
  });

  // Fix any remaining line breaks in middle of markdown links
  const linkLineBreakPattern = /\[[^\]]*\]\([^\)]*\n[^\)]*\)/g;

  content = content.replace(linkLineBreakPattern, match => {
    fixedCount++;
    return match.replace(/\n/g, '');
  });

  if (fixedCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed ${fixedCount} issues in ${file}`);
    totalFixed += fixedCount;
  }
});

console.log(`\n✅ Fixed ${totalFixed} final markdown issues total!`);
