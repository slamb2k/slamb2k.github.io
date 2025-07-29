# Environment Configuration Guide

This document explains how to configure the application for different environments and manage feature flags, API endpoints, and build-time settings.

## Overview

The application uses a comprehensive environment configuration system that supports:

- Multiple environments (development, staging, production)
- Feature flags for controlling functionality
- API endpoint configuration
- Build-time and runtime settings
- Debug and development tools
- Analytics and external service integration

## Environment Files

### File Structure

```
.env.example          # Template with all available variables
.env.development      # Development environment settings
.env.staging          # Staging environment settings
.env.production       # Production environment settings
.env.local            # Local overrides (gitignored)
.env.build            # Build-time variables (auto-generated)
```

### Environment Precedence

Vite loads environment files in this order (higher priority overwrites lower):

1. `.env.local`
2. `.env.[NODE_ENV].local`
3. `.env.[NODE_ENV]`
4. `.env`

## Configuration Variables

### Core Environment

```bash
VITE_NODE_ENV=development|staging|production
```

### API Configuration

```bash
VITE_API_BASE_URL=https://api.example.com/api
VITE_API_TIMEOUT=30000
```

### Feature Flags

```bash
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_CONTACT_FORM=true
VITE_FEATURE_BLOG=false
VITE_FEATURE_PORTFOLIO_CMS=false
VITE_FEATURE_DARK_MODE_TOGGLE=false
```

### Analytics & Tracking

```bash
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_PLAUSIBLE_DOMAIN=example.com
VITE_HOTJAR_ID=12345
```

### Contact & Social

```bash
VITE_CONTACT_EMAIL=hello@example.com
VITE_CONTACT_PHONE=+1234567890
VITE_GITHUB_USERNAME=username
VITE_LINKEDIN_USERNAME=username
VITE_TWITTER_USERNAME=username
```

### External Services

```bash
VITE_CONTACT_FORM_ENDPOINT=https://forms.example.com/submit
VITE_NEWSLETTER_ENDPOINT=https://newsletter.example.com/subscribe
VITE_CMS_API_URL=https://cms.example.com/api
```

### Build Configuration

```bash
VITE_BUILD_VERSION=1.0.0
VITE_BUILD_DATE=2024-01-01T00:00:00.000Z
VITE_SENTRY_DSN=https://sentry.example.com
```

### Development Tools

```bash
VITE_DEBUG_MODE=true
VITE_SHOW_PERFORMANCE_METRICS=true
```

## Usage in Code

### Basic Configuration Access

```tsx
import { useConfig } from '@/hooks/useConfig';

function MyComponent() {
  const config = useConfig();

  return (
    <div>
      <p>Environment: {config.environment}</p>
      <p>API URL: {config.api.baseUrl}</p>
    </div>
  );
}
```

### Feature Flag Usage

```tsx
import { useFeatureFlag } from '@/hooks/useConfig';

function MyComponent() {
  const analyticsEnabled = useFeatureFlag('analytics');

  if (analyticsEnabled) {
    // Initialize analytics
  }

  return <div>Analytics: {analyticsEnabled ? 'On' : 'Off'}</div>;
}
```

### Environment-Specific Logic

```tsx
import { useIsDevelopment, useIsProduction } from '@/hooks/useConfig';

function MyComponent() {
  const isDev = useIsDevelopment();
  const isProd = useIsProduction();

  return (
    <div>
      {isDev && <DebugInfo />}
      {isProd && <AnalyticsScript />}
    </div>
  );
}
```

### Direct Configuration Import

```tsx
import { config, isFeatureEnabled, debugLog } from '@/config/environment';

// Check feature flags
if (isFeatureEnabled('analytics')) {
  // Initialize analytics
}

// Debug logging (only logs in debug mode)
debugLog('Component rendered', { props });

// Access configuration directly
const apiUrl = config.api.baseUrl;
```

## Build Scripts

### Environment-Specific Builds

```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

### Build Information

The build script automatically adds build-time information:

- Git commit hash
- Build timestamp
- Git branch
- Package version

## Environment Setup

### Development Setup

1. Copy `.env.example` to `.env.local`
2. Fill in required values:
   ```bash
   cp .env.example .env.local
   ```
3. Edit `.env.local` with your local settings
4. Start development server:
   ```bash
   npm run dev
   ```

### Production Deployment

1. Set environment variables in deployment platform
2. Use production build script:
   ```bash
   npm run build:prod
   ```
3. Deploy `dist/` directory

### Staging Environment

1. Configure staging environment variables
2. Build with staging configuration:
   ```bash
   npm run build:staging
   ```
3. Deploy to staging server

## Feature Flag Management

### Adding New Feature Flags

1. Add to environment files:

   ```bash
   VITE_FEATURE_NEW_FEATURE=false
   ```

2. Update TypeScript types in `src/config/environment.ts`:

   ```tsx
   export interface FeatureFlags {
     // ... existing flags
     newFeature: boolean;
   }
   ```

3. Add to configuration creation:

   ```tsx
   features: {
     // ... existing features
     newFeature: getEnvBoolean('VITE_FEATURE_NEW_FEATURE'),
   }
   ```

4. Use in components:
   ```tsx
   const newFeatureEnabled = useFeatureFlag('newFeature');
   ```

### Feature Flag Best Practices

- Default to `false` for new features
- Use descriptive names: `VITE_FEATURE_CONTACT_FORM` not `VITE_CONTACT`
- Enable gradually: dev → staging → production
- Remove flags after feature is stable
- Document feature flag purpose and impact

## Configuration Validation

The system includes automatic configuration validation:

```tsx
import { validateConfig } from '@/config/environment';

const validation = validateConfig();
if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
}
```

### Common Validation Issues

- Missing required fields (email, GitHub username)
- Invalid API URLs
- Analytics enabled without provider configuration
- Contact form enabled without endpoint
- Invalid timeout values

## Security Considerations

### Environment Variables

- **Never commit `.env.local`** (already in `.gitignore`)
- Use `VITE_` prefix for client-side variables only
- Sensitive values should be server-side only
- Rotate API keys and tokens regularly

### Production Checklist

- [ ] Debug mode disabled (`VITE_DEBUG_MODE=false`)
- [ ] Performance metrics disabled in production
- [ ] Valid API endpoints configured
- [ ] Analytics properly configured
- [ ] Error reporting configured (Sentry)
- [ ] Contact form endpoints secured
- [ ] CORS properly configured for API

## Troubleshooting

### Environment Variables Not Loading

1. Check variable name has `VITE_` prefix
2. Restart development server after changes
3. Check file is in correct location
4. Verify no syntax errors in `.env` file

### Configuration Validation Errors

1. Run validation to see specific errors:

   ```tsx
   import { validateConfig } from '@/config/environment';
   console.log(validateConfig());
   ```

2. Check required fields are populated
3. Verify API URLs are valid
4. Ensure feature flag dependencies are met

### Build-Time vs Runtime

- **Build-time**: Variables baked into bundle, cannot change after build
- **Runtime**: Could be changed by server configuration (not implemented)
- Use build-time for most settings (current implementation)
- Consider runtime config for deployment flexibility

## Development Tools

### Environment Info Component

Shows current configuration in development:

```tsx
import { EnvironmentInfo } from '@/components/debug';

// Automatically shown in development
// Manually added to components for debugging
<EnvironmentInfo />;
```

### Debug Logging

```tsx
import { debugLog, debugWarn, debugError } from '@/config/environment';

// Only logs when VITE_DEBUG_MODE=true
debugLog('User action', { action: 'click', element: 'button' });
debugWarn('Performance issue', { renderTime: 1000 });
debugError('API error', { status: 500, message: 'Server error' });
```

## Migration Guide

### From Hardcoded to Environment Configuration

1. Identify hardcoded values (URLs, flags, settings)
2. Add environment variables for each value
3. Update TypeScript types
4. Replace hardcoded values with configuration
5. Test in all environments
6. Update documentation

### Example Migration

Before:

```tsx
const apiUrl = 'https://api.example.com';
const showAnalytics = true;
```

After:

```tsx
import { useConfig } from '@/hooks/useConfig';

const config = useConfig();
const apiUrl = config.api.baseUrl;
const showAnalytics = config.features.analytics;
```
