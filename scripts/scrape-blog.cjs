#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Blog post URLs from sitemap
const BLOG_URLS = [
  'https://simonlamb.codes/2018/06/08/weird-issue-when-service-connections-are-parameterized-in-task-groups/',
  'https://simonlamb.codes/2017/11/07/the-sdk-microsoft-docker-sdk-specified-could-not-be-found-and-other-netcoredocker-fun/',
  'https://simonlamb.codes/2017/08/07/mobile-devops-hypothesis-driven-development-and-visual-studio-mobile-center/',
  'https://simonlamb.codes/2017/05/05/vsts-build-tasks-mobile-center-build/',
  'https://simonlamb.codes/2016/04/14/the-well-technically-podcast-episode-1-buckleup/',
];

// Create directories
async function ensureDirectories() {
  const dirs = ['public/blog-media', 'src/data/blog/posts', 'src/data/blog/metadata'];

  for (const dir of dirs) {
    await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
  }
}

// Fetch URL content
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol
      .get(url, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return fetchUrl(res.headers.location).then(resolve).catch(reject);
        }

        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

// Download image
async function downloadImage(imageUrl, filename) {
  const protocol = imageUrl.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    protocol
      .get(imageUrl, response => {
        if (response.statusCode === 200) {
          const chunks = [];
          response.on('data', chunk => chunks.push(chunk));
          response.on('end', async () => {
            const buffer = Buffer.concat(chunks);
            const filepath = path.join(process.cwd(), 'public/blog-media', filename);
            await fs.writeFile(filepath, buffer);
            resolve(`/blog-media/${filename}`);
          });
        } else {
          reject(new Error(`Failed to download ${imageUrl}: ${response.statusCode}`));
        }
      })
      .on('error', reject);
  });
}

// Extract blog post data from HTML
function extractPostData(html, url) {
  // Extract title
  const titleMatch =
    html.match(/<h1[^>]*class="entry-title"[^>]*>([^<]+)<\/h1>/i) ||
    html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch
    ? titleMatch[1]
        .trim()
        .replace(/&#8211;/g, '–')
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
    : '';

  // Extract date
  const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"/) || html.match(/datetime="([^"]+)"/);
  const publishedAt = dateMatch ? dateMatch[1] : new Date().toISOString();

  // Extract content
  const contentMatch = html.match(/<div[^>]*class="entry-content"[^>]*>([\s\S]*?)<\/div>/i);
  let content = contentMatch ? contentMatch[1] : '';

  // Clean up content
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Extract images from content
  const images = [];
  const imageMatches = content.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/gi);
  for (const match of imageMatches) {
    images.push(match[1]);
  }

  // Extract featured image
  const featuredImageMatch =
    html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/) ||
    html.match(/<img[^>]*class="[^"]*featured[^"]*"[^>]*src="([^"]+)"/);
  const featuredImage = featuredImageMatch ? featuredImageMatch[1] : images[0];

  // Extract excerpt
  const excerptMatch =
    html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/) ||
    html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/);
  const excerpt = excerptMatch
    ? excerptMatch[1]
    : content.substring(0, 200).replace(/<[^>]*>/g, '');

  // Generate slug from URL
  const urlParts = new URL(url);
  const slug = urlParts.pathname
    .replace(/^\/|\/$/g, '')
    .split('/')
    .pop();

  return {
    title,
    publishedAt,
    content,
    images,
    featuredImage,
    excerpt,
    slug,
    originalUrl: url,
  };
}

// Process single blog post
async function processBlogPost(url, index) {
  console.log(`Processing ${index + 1}/${BLOG_URLS.length}: ${url}`);

  try {
    const html = await fetchUrl(url);
    const postData = extractPostData(html, url);

    // Generate ID from slug
    const id = postData.slug || `post-${index}`;

    // Download images
    const localImages = [];
    for (const imageUrl of postData.images) {
      try {
        const imageName = path.basename(new URL(imageUrl).pathname);
        const localPath = await downloadImage(imageUrl, `${id}-${imageName}`);
        localImages.push(localPath);

        // Update content to use local images
        postData.content = postData.content.replace(imageUrl, localPath);
      } catch (err) {
        console.error(`Failed to download image ${imageUrl}:`, err.message);
      }
    }

    // Download featured image
    if (postData.featuredImage) {
      try {
        const imageName = path.basename(new URL(postData.featuredImage).pathname);
        const localPath = await downloadImage(
          postData.featuredImage,
          `${id}-featured-${imageName}`
        );
        postData.featuredImage = localPath;
      } catch (err) {
        console.error(`Failed to download featured image:`, err.message);
      }
    }

    // Create blog post data
    const blogPost = {
      id,
      slug: postData.slug,
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      publishedAt: postData.publishedAt,
      author: 'Simon Lamb',
      featuredImage: postData.featuredImage,
      images: localImages,
      originalUrl: url,
      readingTime: Math.ceil(postData.content.split(/\s+/).length / 200),
    };

    // Save post data
    const postPath = path.join(process.cwd(), 'src/data/blog/posts', `${id}.json`);
    await fs.writeFile(postPath, JSON.stringify(blogPost, null, 2));

    console.log(`✓ Saved ${id}`);
    return blogPost;
  } catch (error) {
    console.error(`Failed to process ${url}:`, error);
    return null;
  }
}

// Main scraper function
async function scrapeBlog() {
  console.log('Starting blog scraping...\n');

  await ensureDirectories();

  const posts = [];
  for (let i = 0; i < BLOG_URLS.length; i++) {
    const post = await processBlogPost(BLOG_URLS[i], i);
    if (post) {
      posts.push(post);
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Save metadata
  const metadata = {
    totalPosts: posts.length,
    posts: posts.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      publishedAt: p.publishedAt,
      featuredImage: p.featuredImage,
      readingTime: p.readingTime,
    })),
    lastUpdated: new Date().toISOString(),
  };

  const metadataPath = path.join(process.cwd(), 'src/data/blog/metadata/index.json');
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`\n✅ Scraping complete! Processed ${posts.length} blog posts.`);
}

// Run the scraper
scrapeBlog().catch(console.error);
