#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseStringPromise } from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the original WordPress XML to extract proper link text
const xmlPath = '/home/slamb2k/Downloads/simonlambcodes.WordPress.2025-09-26.xml';
const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

async function extractLinksFromXML() {
  console.log('Reading WordPress XML to extract original link text...');
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
  const result = await parseStringPromise(xmlContent);

  const channel = result.rss.channel[0];
  const posts = channel.item.filter(
    item => item['wp:post_type']?.[0] === 'post' && item['wp:status']?.[0] === 'publish'
  );

  const linkMap = new Map();

  posts.forEach(post => {
    const content = post['content:encoded']?.[0] || '';

    // Extract all <a href> tags with their text
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[1];
      const text = match[2].trim();

      // Store the link text for this URL (prefer longer text if we have duplicates)
      if (!linkMap.has(url) || text.length > linkMap.get(url).length) {
        linkMap.set(url, text);
      }
    }
  });

  return linkMap;
}

async function fixBrokenLinks() {
  const linkMap = await extractLinksFromXML();
  console.log(`Found ${linkMap.size} unique links in WordPress XML\n`);

  // Get all MDX files
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

  console.log(`Checking ${files.length} MDX files for broken links...`);

  let totalFixed = 0;

  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let fixedCount = 0;

    // Pattern 1: Bare URLs in parentheses without link text (e.g., (http://example.com))
    const brokenLinkPattern = /\(https?:\/\/[^\s)]+\)/g;

    content = content.replace(brokenLinkPattern, match => {
      const url = match.slice(1, -1); // Remove parentheses

      // Look up the original link text
      let linkText = linkMap.get(url);

      if (!linkText) {
        // Try to generate sensible link text from the URL
        try {
          const urlObj = new URL(url);
          const pathname = urlObj.pathname;

          if (pathname && pathname !== '/') {
            // Use the last part of the path as link text
            const parts = pathname.split('/').filter(p => p);
            linkText = parts[parts.length - 1]
              .replace(/[-_]/g, ' ')
              .replace(/\.\w+$/, '') // Remove file extension
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          } else {
            // Use domain as link text
            linkText = urlObj.hostname.replace('www.', '');
          }
        } catch (e) {
          linkText = 'Link';
        }
      }

      fixedCount++;
      return `[${linkText}](${url})`;
    });

    // Pattern 2: Fix any standalone URLs that should be links
    const standaloneUrlPattern = /(?<!\(|")(https?:\/\/[^\s,;)]+)(?!["\)])/g;

    content = content.replace(standaloneUrlPattern, (match, url) => {
      // Skip if it's already in a markdown link
      const beforeIndex = content.lastIndexOf('[', content.indexOf(match));
      const afterIndex = content.indexOf(']', content.indexOf(match));
      if (beforeIndex > -1 && afterIndex > -1 && afterIndex > beforeIndex) {
        return match; // Already in a link, skip
      }

      let linkText = linkMap.get(url);

      if (!linkText) {
        try {
          const urlObj = new URL(url);
          linkText = urlObj.hostname.replace('www.', '');
        } catch (e) {
          linkText = 'Link';
        }
      }

      fixedCount++;
      return `[${linkText}](${url})`;
    });

    if (fixedCount > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`  Fixed ${fixedCount} links in ${file}`);
      totalFixed += fixedCount;
    }
  });

  console.log(`\n✅ Fixed ${totalFixed} broken links total!`);
}

fixBrokenLinks().catch(console.error);
