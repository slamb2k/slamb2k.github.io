#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseStringPromise } from 'xml2js';
import TurndownService from 'turndown';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Add custom rules for better WordPress content handling
turndownService.addRule('wp-code', {
  filter: ['pre'],
  replacement: function (content, node) {
    const language = node.getAttribute('class')?.match(/language-(\w+)/)?.[1] || '';
    return '\n```' + language + '\n' + content + '\n```\n';
  },
});

// Helper function to sanitize filename
function sanitizeFilename(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper function to extract and download images
async function processImages(content, postSlug) {
  const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  const wpImageRegex = /https?:\/\/[^"\s]+\.(jpg|jpeg|png|gif|webp|svg)/gi;

  let processedContent = content;
  const images = [];
  let match;

  // Find all images
  while ((match = wpImageRegex.exec(content)) !== null) {
    images.push(match[0]);
  }

  // Process each image
  for (const imageUrl of images) {
    try {
      const urlObj = new URL(imageUrl);
      const ext = path.extname(urlObj.pathname) || '.jpg';
      const imageName = `${postSlug}-${Date.now()}${ext}`;
      const localPath = `/images/blog/${imageName}`;
      const fullPath = path.join(__dirname, '..', 'public', 'images', 'blog', imageName);

      // Create directory if it doesn't exist
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Download image
      console.log(`  Downloading image: ${imageUrl}`);
      try {
        execSync(`curl -L -o "${fullPath}" "${imageUrl}"`, { stdio: 'pipe' });
        processedContent = processedContent.replace(imageUrl, localPath);
      } catch (downloadError) {
        console.log(`  Failed to download: ${imageUrl}`);
      }
    } catch (error) {
      console.log(`  Error processing image: ${imageUrl}`, error.message);
    }
  }

  return processedContent;
}

// Helper function to convert WordPress content to MDX
async function convertToMDX(post, categories, tags) {
  const title = post.title?.[0] || 'Untitled';
  const slug = sanitizeFilename(post['wp:post_name']?.[0] || title);
  const date = post['wp:post_date']?.[0] || new Date().toISOString();
  const content = post['content:encoded']?.[0] || '';
  const excerpt =
    post['excerpt:encoded']?.[0]?.replace(/<[^>]*>/g, '').trim() || post.description?.[0] || '';

  // Get categories and tags for this post
  const postCategories =
    post.category?.filter(cat => cat.$.domain === 'category').map(cat => cat._) || [];
  const postTags =
    post.category?.filter(cat => cat.$.domain === 'post_tag').map(cat => cat._) || [];

  // Clean up excerpt
  const cleanExcerpt = excerpt
    .replace(/\[.*?\]/g, '') // Remove shortcodes
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
    .substring(0, 200); // Limit length

  // Process images in content
  const contentWithLocalImages = await processImages(content, slug);

  // Convert HTML to Markdown
  let markdownContent = turndownService.turndown(contentWithLocalImages);

  // Clean up the markdown
  markdownContent = markdownContent
    .replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gi, '$1') // Remove WordPress captions
    .replace(/\[.*?\]/g, '') // Remove other shortcodes
    .replace(/\n{3,}/g, '\n\n') // Reduce excessive newlines
    .trim();

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = markdownContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Create MDX content
  const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date.split(' ')[0]}"
excerpt: "${cleanExcerpt.replace(/"/g, '\\"')}"
tags: [${[...postCategories, ...postTags].map(t => `"${t}"`).join(', ')}]
readingTime: ${readingTime}
legacy: true
originalUrl: "${post.link?.[0] || ''}"
---

# ${title}

${markdownContent}
`;

  return { slug, content: mdxContent };
}

async function main() {
  const xmlPath = '/home/slamb2k/Downloads/simonlambcodes.WordPress.2025-09-26.xml';
  const outputDir = path.join(__dirname, '..', 'src', 'content', 'blog');

  console.log('Reading WordPress export file...');
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8');

  console.log('Parsing XML...');
  const result = await parseStringPromise(xmlContent);

  const channel = result.rss.channel[0];
  const categories = channel['wp:category'] || [];
  const tags = channel['wp:tag'] || [];

  // Filter for actual blog posts
  const posts = channel.item.filter(
    item => item['wp:post_type']?.[0] === 'post' && item['wp:status']?.[0] === 'publish'
  );

  console.log(`Found ${posts.length} published blog posts`);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Create image directory
  const imageDir = path.join(__dirname, '..', 'public', 'images', 'blog');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  // Convert each post
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`\nProcessing post ${i + 1}/${posts.length}: ${post.title?.[0] || 'Untitled'}`);

    try {
      const { slug, content } = await convertToMDX(post, categories, tags);
      const outputPath = path.join(outputDir, `${slug}.mdx`);

      fs.writeFileSync(outputPath, content);
      console.log(`  ✓ Created: ${slug}.mdx`);
    } catch (error) {
      console.error(`  ✗ Error processing post:`, error.message);
    }
  }

  console.log('\n✅ Migration complete!');
  console.log(`Created ${posts.length} MDX files in ${outputDir}`);
}

main().catch(console.error);
