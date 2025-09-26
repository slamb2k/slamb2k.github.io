# Vercel Deployment Guide

This portfolio is configured for deployment on Vercel, providing automatic deployments, preview URLs, and global CDN distribution.

## Automatic Deployment

The project is configured to automatically deploy to Vercel when changes are pushed to the main branch.

### Configuration Files

1. **`vercel.json`** - Vercel configuration file that specifies:

   - Build command: `npm run build:prod`
   - Output directory: `dist`
   - Framework: Vite
   - SPA routing configuration (all routes serve index.html)
   - Cache headers for optimized performance
   - Asset caching strategies

2. **`.vercelignore`** - Specifies files to exclude from deployment

## Setup Instructions

### Initial Setup

1. **Connect to Vercel:**

   ```bash
   npm i -g vercel
   vercel
   ```

2. **Link to existing project or create new:**

   - Follow the CLI prompts
   - Select the appropriate scope/team
   - Configure project settings

3. **Environment Variables (if needed):**
   - Set via Vercel Dashboard → Project Settings → Environment Variables
   - Or use Vercel CLI: `vercel env add`

### Manual Deployment

For manual deployments (useful for testing):

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Features

### Preview Deployments

- Every pull request gets a unique preview URL
- Preview URLs are automatically posted as PR comments
- Allows testing changes before merging

### Performance Optimization

The configuration includes:

- **Asset Caching:** Long cache times for static assets (1 year)
- **Image Caching:** Optimized caching for WebP images
- **PDF Caching:** Shorter cache time for frequently updated PDFs
- **SPA Routing:** All routes properly handled for client-side routing

### Custom Domain

To add a custom domain:

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Build Process

The build process on Vercel:

1. Installs dependencies: `npm ci`
2. Runs TypeScript compilation
3. Builds with Vite: `npm run build:prod`
4. Outputs to `dist/` directory
5. Deploys globally to Vercel's CDN

## Monitoring

- **Analytics:** Available in Vercel Dashboard
- **Build Logs:** Accessible for debugging deployment issues
- **Performance Metrics:** Real User Monitoring (RUM) available

## Rollback

To rollback to a previous deployment:

1. Go to Vercel Dashboard → Deployments
2. Find the desired deployment
3. Click "..." → "Promote to Production"

## Troubleshooting

### Build Failures

1. Check build logs in Vercel Dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation: `npm run build:prod` locally

### 404 Errors

The `vercel.json` includes SPA routing configuration. All routes should serve `index.html`.

### Cache Issues

Force cache refresh by:

- Updating asset filenames (Vite handles this automatically with hashing)
- Modifying cache headers in `vercel.json`

## CI/CD Integration

While deployment is handled by Vercel, GitHub Actions still:

- Runs tests and linting
- Performs type checking
- Checks bundle size
- Creates build artifacts

This ensures code quality before automatic deployment to Vercel.
