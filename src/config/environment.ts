/**
 * Environment Configuration
 * Centralized configuration management for environment-specific settings
 */

export type Environment = 'development' | 'staging' | 'production';

export interface FeatureFlags {
  analytics: boolean;
  contactForm: boolean;
  blog: boolean;
  portfolioCms: boolean;
  darkModeToggle: boolean;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  plausibleDomain?: string;
  hotjarId?: string;
}

export interface ContactConfig {
  email: string;
  phone?: string;
  formEndpoint?: string;
  newsletterEndpoint?: string;
}

export interface SocialConfig {
  githubUsername: string;
  linkedinUsername?: string;
  twitterUsername?: string;
}

export interface BuildConfig {
  version: string;
  buildDate: string;
  sentryDsn?: string;
}

export interface DevelopmentConfig {
  debugMode: boolean;
  showPerformanceMetrics: boolean;
}

export interface AppConfig {
  environment: Environment;
  features: FeatureFlags;
  api: ApiConfig;
  analytics: AnalyticsConfig;
  contact: ContactConfig;
  social: SocialConfig;
  build: BuildConfig;
  development: DevelopmentConfig;
}

/**
 * Get environment variable with type safety and defaults
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Create application configuration from environment variables
 */
export function createConfig(): AppConfig {
  // Simple environment detection: development for local, production for deployed
  const environment = (
    import.meta.env.MODE === 'development' ? 'development' : 'production'
  ) as Environment;

  return {
    environment,

    features: {
      analytics: getEnvBoolean('VITE_FEATURE_ANALYTICS'),
      contactForm: getEnvBoolean('VITE_FEATURE_CONTACT_FORM', true),
      blog: getEnvBoolean('VITE_FEATURE_BLOG'),
      portfolioCms: getEnvBoolean('VITE_FEATURE_PORTFOLIO_CMS'),
      darkModeToggle: getEnvBoolean('VITE_FEATURE_DARK_MODE_TOGGLE'),
    },

    api: {
      baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3001/api'),
      timeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
    },

    analytics: {
      googleAnalyticsId: getEnvVar('VITE_GOOGLE_ANALYTICS_ID') || undefined,
      plausibleDomain: getEnvVar('VITE_PLAUSIBLE_DOMAIN') || undefined,
      hotjarId: getEnvVar('VITE_HOTJAR_ID') || undefined,
    },

    contact: {
      email: getEnvVar('VITE_CONTACT_EMAIL', 'hello@example.com'),
      phone: getEnvVar('VITE_CONTACT_PHONE') || undefined,
      formEndpoint: getEnvVar('VITE_CONTACT_FORM_ENDPOINT') || undefined,
      newsletterEndpoint: getEnvVar('VITE_NEWSLETTER_ENDPOINT') || undefined,
    },

    social: {
      githubUsername: getEnvVar('VITE_GITHUB_USERNAME', 'slamb2k'),
      linkedinUsername: getEnvVar('VITE_LINKEDIN_USERNAME') || undefined,
      twitterUsername: getEnvVar('VITE_TWITTER_USERNAME') || undefined,
    },

    build: {
      version: getEnvVar('VITE_BUILD_VERSION', 'dev'),
      buildDate: getEnvVar('VITE_BUILD_DATE', new Date().toISOString()),
      sentryDsn: getEnvVar('VITE_SENTRY_DSN') || undefined,
    },

    development: {
      debugMode: getEnvBoolean('VITE_DEBUG_MODE'),
      showPerformanceMetrics: getEnvBoolean('VITE_SHOW_PERFORMANCE_METRICS'),
    },
  };
}

/**
 * Application configuration instance
 */
export const config = createConfig();

/**
 * Utility functions for checking environment
 */
export const isDevelopment = config.environment === 'development';
export const isStaging = config.environment === 'staging';
export const isProduction = config.environment === 'production';

/**
 * Feature flag utilities
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return config.features[feature];
}

/**
 * Debug utilities
 */
export function debugLog(...args: unknown[]): void {
  if (config.development.debugMode) {
    console.log('[DEBUG]', ...args);
  }
}

export function debugWarn(...args: unknown[]): void {
  if (config.development.debugMode) {
    console.warn('[DEBUG]', ...args);
  }
}

export function debugError(...args: unknown[]): void {
  if (config.development.debugMode) {
    console.error('[DEBUG]', ...args);
  }
}

/**
 * Configuration validation
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate required configuration
  if (!config.contact.email) {
    errors.push('Contact email is required');
  }

  if (!config.social.githubUsername) {
    errors.push('GitHub username is required');
  }

  if (
    config.features.analytics &&
    !config.analytics.googleAnalyticsId &&
    !config.analytics.plausibleDomain
  ) {
    errors.push('Analytics is enabled but no analytics provider is configured');
  }

  if (config.features.contactForm && !config.contact.formEndpoint) {
    errors.push('Contact form is enabled but no form endpoint is configured');
  }

  // Validate API configuration
  try {
    new URL(config.api.baseUrl);
  } catch {
    errors.push('Invalid API base URL');
  }

  if (config.api.timeout <= 0) {
    errors.push('API timeout must be positive');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
