#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Get all MDX files
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

console.log(`Checking ${files.length} MDX files for remaining patterns...`);

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let fixedCount = 0;

  // Fix pattern: (/images/...)**![...](...)**
  // This is a duplicate image that should be removed
  // Keep only the second image (the markdown formatted one)
  const duplicateImagePattern = /\(\/images\/[^)]+\)\*\*!\[[^\]]*\]\(\/images\/[^)]+\)\*\*/g;

  content = content.replace(duplicateImagePattern, match => {
    // Extract the markdown image part (after **)
    const markdownMatch = match.match(/\*\*(!\[[^\]]*\]\(\/images\/[^)]+\))\*\*/);
    if (markdownMatch) {
      fixedCount++;
      return markdownMatch[1]; // Return just the markdown image without the ** and the preceding (url)
    }
    return match;
  });

  // Fix orphaned ! on a line followed by [text](url) on next line
  const lines = content.split('\n');
  const fixedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // Check if current line ends with ! and next line starts with [
    if (line.trim() === '!' && nextLine && nextLine.trim().startsWith('[')) {
      // Combine them into proper image syntax
      fixedLines.push(`!${nextLine.trim()}`);
      i++; // Skip the next line since we've merged it
      fixedCount++;
    } else if (line.trim().endsWith(' !') && nextLine && nextLine.trim().startsWith('[')) {
      // Handle case where ! is at end of a line with other text
      const lineWithoutExclamation = line.substring(0, line.lastIndexOf('!'));
      fixedLines.push(lineWithoutExclamation);
      fixedLines.push(`!${nextLine.trim()}`);
      i++; // Skip the next line
      fixedCount++;
    } else {
      fixedLines.push(line);
    }
  }

  if (fixedCount > 0) {
    content = fixedLines.join('\n');
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed ${fixedCount} patterns in ${file}`);
    totalFixed += fixedCount;
  }
});

console.log(`\n✅ Fixed ${totalFixed} remaining patterns total!`);
