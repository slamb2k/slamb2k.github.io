# Deployment Guide

This guide covers deploying the component-forge portfolio template to various hosting platforms, including build optimization, environment configuration, and CI/CD setup.

## Table of Contents

- [Build Process](#build-process)
- [Environment Configuration](#environment-configuration)
- [Platform Deployment](#platform-deployment)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [AWS S3](#aws-s3)
  - [Docker](#docker)
- [CI/CD Setup](#cicd-setup)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Troubleshooting](#troubleshooting)

## Build Process

### Production Build

The build process creates an optimized production bundle:

```bash
npm run build
```

This command:

1. Runs TypeScript compilation (`tsc`)
2. Creates optimized Vite build
3. Generates static assets with hashing
4. Creates source maps for debugging
5. Optimizes images and fonts
6. Generates manifest files

### Build Verification

Always verify your build before deployment:

```bash
# Build the project
npm run build

# Preview the production build locally
npm run preview

# Run production build tests
npm run test:production

# Check bundle size
npm run analyze
```

### Build Configuration

Key build settings in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/', // Adjust for subdirectory deployment
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable for debugging
    minify: 'terser', // Aggressive minification
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});
```

## Environment Configuration

### Environment Files

Create environment-specific configuration files:

```bash
# Development
.env.local

# Staging
.env.staging

# Production
.env.production
```

### Required Environment Variables

```bash
# Basic Configuration
VITE_APP_TITLE="Your Portfolio"
VITE_APP_DESCRIPTION="Your portfolio description"
VITE_APP_URL="https://yourdomain.com"

# Feature Flags
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_CONTACT_FORM=true
VITE_FEATURE_PERFORMANCE_MONITORING=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
VITE_PLAUSIBLE_DOMAIN="yourdomain.com"

# Contact Form (Optional)
VITE_CONTACT_FORM_ENDPOINT="https://api.example.com/contact"
VITE_RECAPTCHA_SITE_KEY="your_recaptcha_key"

# Performance Monitoring (Optional)
VITE_SENTRY_DSN="your_sentry_dsn"
VITE_WEB_VITALS_ENDPOINT="https://api.example.com/vitals"
```

### Environment Validation

The app validates environment variables at build time:

```typescript
// src/config/environment.ts
const config = {
  app: {
    title: process.env.VITE_APP_TITLE || 'Portfolio',
    description: process.env.VITE_APP_DESCRIPTION || 'My Portfolio',
    url: process.env.VITE_APP_URL || 'http://localhost:5173',
  },
  features: {
    analytics: process.env.VITE_FEATURE_ANALYTICS === 'true',
    contactForm: process.env.VITE_FEATURE_CONTACT_FORM === 'true',
    performanceMonitoring: process.env.VITE_FEATURE_PERFORMANCE_MONITORING === 'true',
  },
};

export default config;
```

## Platform Deployment

### Vercel

**Recommended for React applications with excellent DX.**

#### Quick Deploy

1. **Connect Repository**

   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project settings

2. **Build Configuration**

   ```json
   {
     "framework": "vite",
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install",
     "devCommand": "npm run dev"
   }
   ```

3. **Environment Variables**
   - Add environment variables in Vercel dashboard
   - Use different values for preview vs production

#### Advanced Vercel Configuration

Create `vercel.json`:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify

**Great for JAMstack with powerful build features.**

#### Deploy Steps

1. **Connect Repository**

   - Link GitHub repository in Netlify dashboard
   - Configure build settings

2. **Build Settings**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Set in Netlify dashboard under Site settings > Environment variables

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Performance optimization
[build.processing]
  skip_processing = false
[build.processing.css]
  bundle = true
  minify = true
[build.processing.js]
  bundle = true
  minify = true
[build.processing.html]
  pretty_urls = true
[build.processing.images]
  compress = true
```

### GitHub Pages

**Free hosting for public repositories.**

#### Setup Steps

1. **Enable GitHub Pages**

   - Repository Settings > Pages
   - Source: GitHub Actions

2. **GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_APP_URL: https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

3. **Update Base URL**

For subdirectory deployment, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
  // ... rest of config
});
```

### AWS S3

**Scalable hosting with CDN integration.**

#### Manual Deployment

1. **Build the Project**

   ```bash
   npm run build
   ```

2. **Upload to S3**

   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure S3 Bucket**
   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html` (for SPA routing)

#### Automated Deployment

Create `.github/workflows/aws-deploy.yml`:

```yaml
name: Deploy to AWS S3

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

### Docker

**Containerized deployment for any platform.**

#### Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Build and Run

```bash
# Build Docker image
docker build -t portfolio-app .

# Run container
docker run -p 8080:80 portfolio-app

# Or use Docker Compose
docker-compose up -d
```

## CI/CD Setup

### GitHub Actions Workflow

Comprehensive CI/CD pipeline:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

      - name: Build
        run: npm run build

      - name: Bundle size check
        run: npm run bundle-analyzer

  accessibility:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Accessibility audit
        run: npm run test:accessibility

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, accessibility]
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      # ... deployment steps for staging

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, accessibility]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      # ... deployment steps for production
```

### Environment-Specific Deployments

#### Staging Environment

```bash
# Staging deployment
VITE_APP_URL="https://staging.yourdomain.com"
VITE_FEATURE_ANALYTICS=false
VITE_FEATURE_PERFORMANCE_MONITORING=true
```

#### Production Environment

```bash
# Production deployment
VITE_APP_URL="https://yourdomain.com"
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_PERFORMANCE_MONITORING=true
```

## Performance Optimization

### Build Optimizations

1. **Code Splitting**

   ```typescript
   // Lazy load routes
   const AboutPage = lazy(() => import('@/pages/AboutPage'));
   const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
   ```

2. **Asset Optimization**

   ```typescript
   // Optimize images
   import { OptimizedImage } from '@/components/ui';

   <OptimizedImage
     src="/hero-image.jpg"
     alt="Hero image"
     width={1200}
     height={600}
     quality={85}
   />
   ```

3. **Bundle Analysis**
   ```bash
   npm run build:analyze
   ```

### Performance Monitoring

```typescript
// Web Vitals reporting
import { reportWebVitals } from '@/utils/performance';

reportWebVitals(metric => {
  // Send to analytics
  if (config.features.analytics) {
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
    });
  }
});
```

## Security Considerations

### Content Security Policy

Configure CSP headers:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com;
```

### Environment Variable Security

- Never commit `.env` files to Git
- Use platform-specific environment variable management
- Validate environment variables at build time
- Use different keys for different environments

### Build Security

```bash
# Audit dependencies
npm audit

# Check for security vulnerabilities
npm audit --audit-level high

# Update dependencies
npm update
```

## Monitoring and Analytics

### Analytics Setup

#### Google Analytics 4

```typescript
// src/utils/analytics.ts
import { config } from '@/config';

export const initAnalytics = () => {
  if (config.features.analytics && config.analytics.googleAnalyticsId) {
    // Initialize GA4
    gtag('config', config.analytics.googleAnalyticsId, {
      page_title: config.app.title,
      page_location: window.location.href,
    });
  }
};

export const trackEvent = (eventName: string, parameters: Record<string, any>) => {
  if (config.features.analytics) {
    gtag('event', eventName, parameters);
  }
};
```

#### Plausible Analytics

```typescript
// Alternative to Google Analytics
export const initPlausible = () => {
  if (config.analytics.plausibleDomain) {
    const script = document.createElement('script');
    script.src = 'https://plausible.io/js/plausible.js';
    script.dataset.domain = config.analytics.plausibleDomain;
    document.head.appendChild(script);
  }
};
```

### Error Monitoring

#### Sentry Integration

```typescript
import * as Sentry from '@sentry/react';

if (config.sentry.dsn) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.environment,
    tracesSampleRate: 1.0,
  });
}
```

### Performance Monitoring

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // Send to your analytics service
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' },
  });
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Troubleshooting

### Common Build Issues

#### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix common issues
npm run lint:fix
```

#### Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Bundle Size Issues

```bash
# Analyze bundle
npm run build:analyze

# Check for duplicate dependencies
npx npm-check-duplicates
```

### Deployment Issues

#### Routing Problems

Ensure your hosting platform serves `index.html` for all routes:

**Nginx:**

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**

```apache
RewriteEngine On
RewriteRule ^(?!.*\.).*$ /index.html [L]
```

#### Environment Variable Issues

1. Check variable names (must start with `VITE_`)
2. Verify environment-specific files are loaded
3. Validate at build time, not runtime

#### CORS Issues

Configure API endpoints to allow your domain:

```http
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Performance Issues

#### Slow Build Times

```bash
# Use build cache
npm run build -- --cache

# Parallel processing
npm run build -- --parallel
```

#### Runtime Performance

1. Check bundle size with `npm run build:analyze`
2. Implement code splitting for large routes
3. Use `React.memo` for expensive components
4. Optimize images and fonts

### Support

For deployment issues:

1. Check platform-specific documentation
2. Review build logs for error messages
3. Test locally with `npm run preview`
4. Verify environment variables are set correctly
5. Check browser console for client-side errors

---

This deployment guide covers the most common scenarios. For specific platform requirements or advanced configurations, consult the respective platform documentation.
