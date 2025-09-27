#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

// Map of HTML entities to their actual characters
const entities = {
  '&hellip;': '...',
  '&ndash;': '–',
  '&mdash;': '—',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&euro;': '€',
  '&pound;': '£',
};

// Get all MDX files
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

console.log(`Checking ${files.length} MDX files for HTML entities...`);

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let fixedCount = 0;

  // Replace each HTML entity
  Object.entries(entities).forEach(([entity, replacement]) => {
    const regex = new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = (content.match(regex) || []).length;
    if (matches > 0) {
      content = content.replace(regex, replacement);
      fixedCount += matches;
    }
  });

  if (fixedCount > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed ${fixedCount} HTML entities in ${file}`);
    totalFixed += fixedCount;
  }
});

console.log(`\n✅ Fixed ${totalFixed} HTML entities total!`);
