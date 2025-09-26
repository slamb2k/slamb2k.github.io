# Vercel Deployment Guide

This portfolio is configured for deployment on Vercel through GitHub Actions CI/CD, providing controlled deployments, preview URLs, and global CDN distribution.

## CI/CD Deployment

Deployments to Vercel are managed through GitHub Actions rather than Vercel's automatic Git integration. This provides:

- Better control over when deployments occur
- Integration with existing CI/CD pipeline
- Deployment only after all tests pass
- Consistent deployment process

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

1. **Create Vercel Project:**

   ```bash
   npm i -g vercel
   vercel
   ```

   - Follow the CLI prompts
   - Select the appropriate scope/team
   - Configure project settings
   - **Important:** When asked about linking to existing Git repo, select "No" (we're using CI/CD instead)

2. **Get Vercel Token:**

   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Create a new token with appropriate scope
   - Copy the token value

3. **Add Token to GitHub Secrets:**

   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VERCEL_TOKEN`
   - Value: Your Vercel token

4. **Get Project and Org IDs:**

   ```bash
   vercel project ls
   ```

   Note the project ID and org ID for the `.vercel/project.json` file

5. **Environment Variables (if needed):**
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

- Every pull request gets a unique preview URL via GitHub Actions
- Preview URLs are automatically posted as PR comments
- Preview deployments run after PR creation/updates
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

GitHub Actions handles the complete deployment pipeline:

1. **On Pull Request:**

   - Runs tests and linting
   - Performs type checking
   - Checks bundle size
   - Deploys preview to Vercel
   - Comments preview URL on PR

2. **On Merge to Main:**
   - Runs full test suite
   - Builds production artifacts
   - Deploys to Vercel production
   - Comments deployment URL on commit

### GitHub Actions Jobs

- `deploy-vercel`: Production deployment (main branch only)
- `deploy-vercel-preview`: Preview deployment (PRs only)

### Required GitHub Secrets

- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID (if using team)
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### Disabling Vercel Auto-Deploy

The `vercel.json` includes `"github": { "enabled": false }` to disable Vercel's automatic Git deployments, ensuring deployments only happen through CI/CD.
