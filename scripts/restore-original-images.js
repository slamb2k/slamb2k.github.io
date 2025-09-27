import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse WordPress XML
const xmlContent = fs.readFileSync(
  '/home/slamb2k/Downloads/simonlambcodes.WordPress.2025-09-26.xml',
  'utf-8'
);
const parser = new xml2js.Parser();

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;

    protocol
      .get(url, response => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', err => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

async function extractPostImages() {
  const result = await parser.parseStringPromise(xmlContent);
  const items = result.rss.channel[0].item;

  // Create a map of post title/slug to images
  const postImageMap = {};

  for (const item of items) {
    if (
      item['wp:post_type'] &&
      item['wp:post_type'][0] === 'post' &&
      item['wp:status'][0] === 'publish'
    ) {
      const title = item.title[0];
      const link = item.link[0];
      const content = item['content:encoded'] ? item['content:encoded'][0] : '';

      // Extract slug from link
      const slugMatch = link.match(/\/([^\/]+)\/?$/);
      const slug = slugMatch ? slugMatch[1] : '';

      // Find all images in content
      const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
      const images = [];
      let match;

      while ((match = imgRegex.exec(content)) !== null) {
        images.push(match[1]);
      }

      if (images.length > 0) {
        postImageMap[slug] = {
          title,
          images,
          content,
        };
        console.log(`Found ${images.length} images for post: ${slug}`);
      }
    }
  }

  return postImageMap;
}

async function updateMdxFiles(postImageMap) {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const publicImagesDir = path.join(__dirname, '../public/images/blog');

  // Ensure images directory exists
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  const mdxFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

  for (const file of mdxFiles) {
    const filePath = path.join(blogDir, file);
    const fileSlug = file.replace('.mdx', '');

    // Check if we have original images for this post
    const postData = postImageMap[fileSlug];
    if (!postData) {
      console.log(`No original images found for: ${fileSlug}`);
      continue;
    }

    console.log(`\nProcessing ${fileSlug}...`);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Find all current image references in the MDX
    const mdxImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const mdxImages = [];
    let match;

    while ((match = mdxImageRegex.exec(content)) !== null) {
      mdxImages.push({
        full: match[0],
        alt: match[1],
        url: match[2],
        index: match.index,
      });
    }

    // Download and replace images
    for (let i = 0; i < mdxImages.length && i < postData.images.length; i++) {
      const originalUrl = postData.images[i];
      const extension = path.extname(originalUrl.split('?')[0]) || '.png';
      const newFileName = `${fileSlug}-${Date.now()}-${i}${extension}`;
      const localPath = `/images/blog/${newFileName}`;
      const fullPath = path.join(publicImagesDir, newFileName);

      try {
        console.log(`  Downloading image ${i + 1}/${mdxImages.length}: ${originalUrl}`);
        await downloadImage(originalUrl, fullPath);

        // Replace in content
        const oldImageRef = mdxImages[i].full;
        const newImageRef = `![${mdxImages[i].alt}](${localPath})`;
        content = content.replace(oldImageRef, newImageRef);

        console.log(`  ✓ Replaced with: ${localPath}`);
      } catch (err) {
        console.log(`  ✗ Failed to download: ${err.message}`);
      }
    }

    // Write updated content
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Updated ${fileSlug}`);
  }
}

// Main execution
console.log('Extracting images from WordPress XML...');
extractPostImages()
  .then(postImageMap => {
    console.log(`\nFound ${Object.keys(postImageMap).length} posts with images`);
    return updateMdxFiles(postImageMap);
  })
  .then(() => {
    console.log('\n✅ Image restoration complete!');
  })
  .catch(err => {
    console.error('Error:', err);
  });
