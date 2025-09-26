# Blog Publishing Guide

This guide provides comprehensive instructions for creating, managing, and publishing blog posts using the MDX format in this portfolio site.

## Table of Contents

- [MDX Format Overview](#mdx-format-overview)
- [Creating a New Blog Post](#creating-a-new-blog-post)
- [Content Guidelines](#content-guidelines)
- [Image Management](#image-management)
- [SEO and Metadata](#seo-and-metadata)
- [Testing Your Post](#testing-your-post)
- [Publishing Workflow](#publishing-workflow)

## MDX Format Overview

MDX combines Markdown with JSX, allowing you to write content with embedded React components. All blog posts are stored in `/src/content/blog/` as `.mdx` files.

### Basic MDX Structure

```mdx
---
title: 'Your Post Title'
date: 'YYYY-MM-DD'
excerpt: 'A brief description of your post (max 200 chars)'
tags: ['tag1', 'tag2', 'tag3']
readingTime: 5
featuredImage: '/images/blog/featured-image.jpg'
---

# Your Post Title

Your content here...

<CustomComponent />

More content...
```

## Creating a New Blog Post

### 1. File Naming Convention

Use kebab-case for file names:

- ✅ `my-awesome-post.mdx`
- ✅ `2025-01-guide-to-devops.mdx`
- ❌ `My Awesome Post.mdx`
- ❌ `my_awesome_post.mdx`

### 2. Required Frontmatter Fields

```yaml
---
title: 'Post Title' # Required: The display title
date: '2025-01-26' # Required: Publication date (YYYY-MM-DD)
excerpt: 'Brief description' # Required: Shows in post lists
tags: ['DevOps', 'Azure'] # Required: At least one tag
readingTime: 5 # Required: Estimated reading time in minutes
---
```

### 3. Optional Frontmatter Fields

```yaml
---
featuredImage: '/images/blog/hero.jpg' # Hero image for the post
author: 'Simon Lamb' # Override default author
series: 'DevOps Journey' # Part of a series
draft: true # Hide from production
canonical: 'https://original-url.com' # If republished from elsewhere
---
```

## Content Guidelines

### Writing Style

1. **Be Technical but Accessible**

   - Explain complex concepts clearly
   - Define acronyms on first use
   - Include practical examples

2. **Structure for Readability**

   - Use clear headings (H2, H3)
   - Keep paragraphs concise (3-5 sentences)
   - Use bullet points for lists
   - Include code examples where relevant

3. **Engage Your Audience**
   - Start with the problem or context
   - Provide actionable insights
   - End with key takeaways or next steps

### Code Blocks

Use fenced code blocks with language specification:

````markdown
```typescript
interface BlogPost {
  title: string;
  date: string;
  content: string;
}
```
````

Supported languages:

- `typescript`, `javascript`, `tsx`, `jsx`
- `python`, `bash`, `shell`, `powershell`
- `yaml`, `json`, `xml`, `html`, `css`
- `csharp`, `java`, `go`, `rust`
- `sql`, `dockerfile`, `terraform`

### Embedding Components

You can import and use React components:

```mdx
import { Alert } from '@/components/ui/Alert';
import CodeDemo from '@/components/blog/CodeDemo';

<Alert type="info">This is an important note for readers!</Alert>

<CodeDemo language="typescript" code={myCode} title="Example Implementation" />
```

## Image Management

### Image Storage

Store images in `/public/images/blog/`:

- Use descriptive names: `devops-pipeline-diagram.png`
- Optimize images before upload (max 1MB per image)
- Prefer WebP format for better performance
- Use PNG for diagrams, JPG for photos

### Referencing Images

```mdx
![Alt text for accessibility](/images/blog/image-name.png)

<!-- With custom sizing -->

<img src="/images/blog/diagram.png" alt="Architecture diagram" style={{ maxWidth: '600px' }} />
```

### Image Optimization

Before adding images:

1. Resize to appropriate dimensions (max 1920px width)
2. Compress using tools like TinyPNG or Squoosh
3. Use appropriate format:
   - WebP: Best for most images
   - PNG: Diagrams with text
   - JPG: Photos without transparency
   - SVG: Icons and simple graphics

## SEO and Metadata

### Title Optimization

- Keep titles under 60 characters
- Include primary keyword
- Make it compelling and clear

```yaml
title: 'Mastering Azure DevOps: A Complete Guide for 2025'
```

### Excerpt Best Practices

- Summarize the main value proposition
- Include primary keywords naturally
- Keep under 160 characters

```yaml
excerpt: 'Learn how to implement Azure DevOps practices for enterprise-scale applications with real-world examples and best practices.'
```

### Tag Strategy

Use a mix of:

- Technology tags: `Azure`, `DevOps`, `Docker`
- Topic tags: `Tutorial`, `Best Practices`, `Architecture`
- Level tags: `Beginner`, `Advanced`

Common tags in use:

- Development: `DevOps`, `CI/CD`, `Testing`, `Architecture`
- Cloud: `Azure`, `AWS`, `Kubernetes`, `Docker`
- AI/ML: `Machine Learning`, `AI`, `LLM`, `GenAI`
- Languages: `.NET`, `Python`, `TypeScript`, `Go`
- Concepts: `Security`, `Performance`, `Scalability`

## Testing Your Post

### Local Development

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/blog`

3. Check:
   - ✅ Post appears in the list
   - ✅ Metadata displays correctly
   - ✅ Images load properly
   - ✅ Code blocks have syntax highlighting
   - ✅ Links work correctly
   - ✅ Reading time is accurate

### Content Checklist

Before publishing:

- [ ] Spell check completed
- [ ] Grammar reviewed
- [ ] Code examples tested
- [ ] Images optimized
- [ ] Links verified
- [ ] Mobile layout checked
- [ ] Frontmatter validated

## Publishing Workflow

### 1. Create Feature Branch

```bash
git checkout -b blog/your-post-title
```

### 2. Add Your Post

```bash
# Create your MDX file
touch src/content/blog/your-post-title.mdx

# Add images if needed
cp your-image.png public/images/blog/
```

### 3. Test Locally

```bash
npm run dev
# Review at http://localhost:5173/blog
```

### 4. Commit Changes

```bash
git add .
git commit -m "blog: add post about [topic]"
```

### 5. Create Pull Request

```bash
git push origin blog/your-post-title
gh pr create --title "Blog: [Your Post Title]" --body "Add new blog post about [topic]"
```

### 6. Deploy

After PR is merged to main:

```bash
git checkout main
git pull origin main
npm run build
npm run deploy  # Deploys to GitHub Pages
```

## Advanced Features

### Series Posts

For multi-part posts:

```yaml
---
title: 'DevOps Journey Part 1: Getting Started'
series: 'DevOps Journey'
seriesPart: 1
seriesTotal: 5
---
```

### Draft Posts

To hide posts from production:

```yaml
---
draft: true # Won't appear in production build
---
```

### Custom Components

Create reusable components in `/src/components/blog/`:

```typescript
// src/components/blog/Callout.tsx
export const Callout = ({ type, children }) => (
  <div className={`callout callout-${type}`}>
    {children}
  </div>
);
```

Use in MDX:

```mdx
import { Callout } from '@/components/blog/Callout';

<Callout type="warning">Important information here!</Callout>
```

### Table of Contents

For long posts, add a TOC:

```mdx
## Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)
- [Section 3](#section-3)

## Section 1 {#section-1}

Content...

## Section 2 {#section-2}

Content...
```

## Migration from WordPress

If you have existing WordPress content:

1. Export your WordPress content as XML
2. Run the migration script:
   ```bash
   npm run migrate:wordpress
   ```
3. Review and clean up generated MDX files
4. Update image paths and optimize images
5. Add missing metadata if needed

## Troubleshooting

### Common Issues

**Post not appearing:**

- Check date is not in the future
- Ensure `draft: false` or remove draft field
- Verify file has `.mdx` extension

**Images not loading:**

- Check path starts with `/images/blog/`
- Verify image exists in `public/images/blog/`
- Ensure image file name matches exactly (case-sensitive)

**Build errors:**

- Validate frontmatter YAML syntax
- Check for unclosed JSX tags
- Ensure imported components exist

**Formatting issues:**

- Use proper Markdown syntax
- Close all HTML/JSX tags
- Escape special characters in code blocks

## Best Practices Summary

1. **Write valuable content** that helps your audience
2. **Use clear structure** with proper headings
3. **Include practical examples** and code snippets
4. **Optimize all images** before uploading
5. **Test thoroughly** before publishing
6. **Tag appropriately** for discoverability
7. **Keep posts focused** on a single topic
8. **Update regularly** to keep content fresh

## Resources

- [MDX Documentation](https://mdxjs.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Frontmatter Syntax](https://jekyllrb.com/docs/front-matter/)
- [React Components in MDX](https://mdxjs.com/docs/using-mdx/#components)

---

Last updated: January 2025
