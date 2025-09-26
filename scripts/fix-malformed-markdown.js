#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Get all MDX files
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

console.log(`Checking ${files.length} MDX files for malformed markdown...`);

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let fixedCount = 0;

  // Fix pattern: (url "title")][text](url)
  // Should be: ![text](url)
  const malformedImagePattern = /\([^)]+\s+"[^"]+"\)\]\[[^\]]+\]\([^)]+\)/g;

  content = content.replace(malformedImagePattern, match => {
    // Extract the second URL (the actual full-size image)
    const secondUrlMatch = match.match(/\]\([^)]+\)\(([^)]+)\)$/);
    let url;

    if (secondUrlMatch) {
      url = secondUrlMatch[1];
    } else {
      // Try to extract from the pattern ][text](url)
      const urlMatch = match.match(/\]\[[^\]]+\]\(([^)]+)\)/);
      url = urlMatch ? urlMatch[1] : '';
    }

    // Extract alt text from the pattern
    const altMatch = match.match(/\]\[([^\]]+)\]\(/);
    const altText = altMatch ? altMatch[1] : 'Image';

    if (url) {
      fixedCount++;
      return `![${altText}](${url})`;
    }
    return match;
  });

  // Fix remaining patterns: (url "title") without the rest
  const leftoverPattern = /\(https?:\/\/[^)]+\s+"[^"]+"\)(?!\])/g;

  content = content.replace(leftoverPattern, match => {
    // Extract URL and title
    const urlMatch = match.match(/\((https?:\/\/[^)]+)\s+"([^"]+)"\)/);
    if (urlMatch) {
      const url = urlMatch[1];
      const title = urlMatch[2];
      fixedCount++;
      return `[${title}](${url})`;
    }
    return match;
  });

  // Replace non-breaking spaces with regular spaces
  const nbspCount = (content.match(/\u00A0/g) || []).length;
  if (nbspCount > 0) {
    content = content.replace(/\u00A0/g, ' ');
    fixedCount += nbspCount;
    console.log(`  Replaced ${nbspCount} non-breaking spaces in ${file}`);
  }

  // Fix lines that are too long (split at sentence boundaries)
  const lines = content.split('\n');
  const fixedLines = [];

  lines.forEach(line => {
    if (line.length > 500 && !line.startsWith('```') && !line.startsWith('|')) {
      // Split long paragraphs at sentence boundaries
      const sentences = line.match(/[^.!?]+[.!?]+/g) || [line];
      let currentLine = '';

      sentences.forEach(sentence => {
        if (currentLine.length + sentence.length > 400) {
          if (currentLine) {
            fixedLines.push(currentLine.trim());
            currentLine = sentence.trim();
          } else {
            fixedLines.push(sentence.trim());
          }
        } else {
          currentLine += sentence;
        }
      });

      if (currentLine) {
        fixedLines.push(currentLine.trim());
      }
      fixedCount++;
    } else {
      fixedLines.push(line);
    }
  });

  content = fixedLines.join('\n');

  if (fixedCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed ${fixedCount} issues in ${file}`);
    totalFixed += fixedCount;
  }
});

console.log(`\n✅ Fixed ${totalFixed} markdown issues total!`);
