#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse WordPress XML
const xmlContent = fs.readFileSync(
  '/home/slamb2k/Downloads/simonlambcodes.WordPress.2025-09-26.xml',
  'utf-8'
);

const parser = new xml2js.Parser();

// HTML entities to decode
function decodeHtmlEntities(text) {
  if (!text) return text;
  return text
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');
}

// Extract link text from WordPress content
function extractLinkText(content) {
  const linkMap = {};
  const linkRegex = /<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim(); // Remove any nested HTML
    if (text && text !== url) {
      linkMap[url] = text;
    }
  }

  return linkMap;
}

// Convert WordPress HTML content to clean MDX
function convertToMdx(content) {
  if (!content) return '';

  let mdx = content;

  // Remove style attributes
  mdx = mdx.replace(/\s*style=["'][^"']*["']/gi, '');
  mdx = mdx.replace(/\s*(width|height|border)=["'][^"']*["']/gi, '');

  // Convert HTML headers to Markdown
  mdx = mdx.replace(/<h1[^>]*>([^<]+)<\/h1>/gi, '# $1\n');
  mdx = mdx.replace(/<h2[^>]*>([^<]+)<\/h2>/gi, '## $1\n');
  mdx = mdx.replace(/<h3[^>]*>([^<]+)<\/h3>/gi, '### $1\n');
  mdx = mdx.replace(/<h4[^>]*>([^<]+)<\/h4>/gi, '#### $1\n');

  // Convert strong/bold
  mdx = mdx.replace(/<strong>([^<]+)<\/strong>/gi, '**$1**');
  mdx = mdx.replace(/<b>([^<]+)<\/b>/gi, '**$1**');

  // Convert emphasis/italic
  mdx = mdx.replace(/<em>([^<]+)<\/em>/gi, '*$1*');
  mdx = mdx.replace(/<i>([^<]+)<\/i>/gi, '*$1*');

  // Convert code blocks
  mdx = mdx.replace(/<pre[^>]*><code[^>]*>([^<]+)<\/code><\/pre>/gi, '```\n$1\n```\n');
  mdx = mdx.replace(/<code>([^<]+)<\/code>/gi, '`$1`');

  // Add proper paragraph breaks
  mdx = mdx.replace(/<\/p>\s*<p>/gi, '</p>\n\n<p>');
  mdx = mdx.replace(/<p>/gi, '\n');
  mdx = mdx.replace(/<\/p>/gi, '\n');

  // Convert line breaks
  mdx = mdx.replace(/<br\s*\/?>/gi, '\n');

  // Clean up lists
  mdx = mdx.replace(/<ul>/gi, '\n');
  mdx = mdx.replace(/<\/ul>/gi, '\n');
  mdx = mdx.replace(/<li>/gi, '- ');
  mdx = mdx.replace(/<\/li>/gi, '\n');

  // Clean up multiple newlines
  mdx = mdx.replace(/\n{3,}/g, '\n\n');

  return mdx.trim();
}

async function fixBlogPost(slug, wordpressContent, wordpressTitle) {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const filePath = path.join(blogDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  MDX file not found: ${slug}`);
    return;
  }

  console.log(`\n📝 Processing: ${slug}`);

  let mdxContent = fs.readFileSync(filePath, 'utf-8');
  let hasChanges = false;

  // Fix title encoding
  if (wordpressTitle) {
    const cleanTitle = decodeHtmlEntities(wordpressTitle);
    const titleRegex = /title:\s*["']([^"']+)["']/;
    const currentTitle = mdxContent.match(titleRegex)?.[1];

    if (currentTitle && currentTitle !== cleanTitle) {
      console.log(`  ✓ Fixed title: "${currentTitle}" → "${cleanTitle}"`);
      mdxContent = mdxContent.replace(titleRegex, `title: "${cleanTitle}"`);
      hasChanges = true;
    }
  }

  // Extract link text mapping from WordPress content
  const linkMap = extractLinkText(wordpressContent);

  // Fix malformed links in MDX
  for (const [url, text] of Object.entries(linkMap)) {
    // Look for links with incorrect text
    const badLinkRegex = new RegExp(
      `\\[([^\\]]+)\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`,
      'gi'
    );
    const matches = mdxContent.match(badLinkRegex);

    if (matches) {
      matches.forEach(match => {
        const currentText = match.match(/\[([^\]]+)\]/)?.[1];
        if (currentText && currentText !== text && !currentText.includes(' ')) {
          // Only fix if current text looks like a malformed ID
          const fixedLink = `[${text}](${url})`;
          mdxContent = mdxContent.replace(match, fixedLink);
          console.log(`  ✓ Fixed link text: [${currentText}] → [${text}]`);
          hasChanges = true;
        }
      });
    }
  }

  // Fix HTML entities in content
  const contentStart = mdxContent.indexOf('---', 10) + 3;
  const frontmatter = mdxContent.substring(0, contentStart);
  let content = mdxContent.substring(contentStart);

  const originalContent = content;
  content = decodeHtmlEntities(content);

  if (content !== originalContent) {
    console.log(`  ✓ Fixed HTML entities`);
    mdxContent = frontmatter + content;
    hasChanges = true;
  }

  // Fix code blocks from gists
  if (content.includes('gist.github.com')) {
    const gistRegex = /https:\/\/gist\.github\.com\/[^/]+\/([a-f0-9]+)\.js/g;
    const gistMatches = content.match(gistRegex);
    if (gistMatches) {
      console.log(`  ✓ Found ${gistMatches.length} gist embed(s) to convert`);
      // Note: We'd need to fetch the actual gist content to properly convert
      // For now, just flag it
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, mdxContent, 'utf-8');
    console.log(`  ✅ Updated ${slug}.mdx`);
  } else {
    console.log(`  ℹ️  No changes needed`);
  }

  return hasChanges;
}

async function main() {
  console.log('🔍 Analyzing WordPress XML for blog formatting issues...\n');

  const result = await parser.parseStringPromise(xmlContent);
  const items = result.rss.channel[0].item;

  const posts = items.filter(
    item => item['wp:post_type']?.[0] === 'post' && item['wp:status']?.[0] === 'publish'
  );

  console.log(`Found ${posts.length} published posts to check\n`);

  let fixedCount = 0;

  // Focus on specific problematic posts first
  const priorityPosts = [
    'crossing-the-stream-analytics',
    'vsts-and-visual-studio-2017-unable-to-determine-the-location-of-vstest-console-exe',
  ];

  for (const post of posts) {
    const link = post.link[0];
    const title = post.title[0];
    const content = post['content:encoded']?.[0] || '';

    // Extract slug from URL
    const slugMatch = link.match(/\/([^/]+)\/?$/);
    const slug = slugMatch ? slugMatch[1] : null;

    if (!slug) continue;

    // Process priority posts first
    if (priorityPosts.includes(slug)) {
      const fixed = await fixBlogPost(slug, content, title);
      if (fixed) fixedCount++;
    }
  }

  // Then process remaining posts
  for (const post of posts) {
    const link = post.link[0];
    const title = post.title[0];
    const content = post['content:encoded']?.[0] || '';

    const slugMatch = link.match(/\/([^/]+)\/?$/);
    const slug = slugMatch ? slugMatch[1] : null;

    if (!slug || priorityPosts.includes(slug)) continue;

    const fixed = await fixBlogPost(slug, content, title);
    if (fixed) fixedCount++;
  }

  console.log(`\n✅ Fixed ${fixedCount} blog posts`);
}

main().catch(console.error);
