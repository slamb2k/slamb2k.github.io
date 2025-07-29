import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock import.meta.env
const mockEnv = {
  VITE_NODE_ENV: 'test',
  VITE_API_BASE_URL: 'https://api.test.com',
  VITE_API_TIMEOUT: '15000',
  VITE_FEATURE_ANALYTICS: 'true',
  VITE_FEATURE_CONTACT_FORM: 'false',
  VITE_CONTACT_EMAIL: 'test@example.com',
  VITE_GITHUB_USERNAME: 'testuser',
  VITE_DEBUG_MODE: 'true',
  VITE_BUILD_VERSION: '1.0.0',
  VITE_GOOGLE_ANALYTICS_ID: 'GA-TEST-123',
};

// Mock import.meta
vi.stubGlobal('import', {
  meta: {
    env: mockEnv,
  },
});

describe('Environment Configuration', () => {
  let createConfig: any;
  let validateConfig: any;
  let isFeatureEnabled: any;
  let debugLog: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    // Reset console.log mock
    vi.spyOn(console, 'log').mockImplementation(() => {});

    // Re-import the module fresh each time
    const module = await import('./environment');
    createConfig = module.createConfig;
    validateConfig = module.validateConfig;
    isFeatureEnabled = module.isFeatureEnabled;
    debugLog = module.debugLog;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createConfig', () => {
    it('should create configuration from environment variables', () => {
      const config = createConfig();

      expect(config.environment).toBe('test');
      expect(config.api.baseUrl).toBe('https://api.test.com');
      expect(config.api.timeout).toBe(15000);
      expect(config.features.analytics).toBe(true);
      expect(config.features.contactForm).toBe(false);
      expect(config.contact.email).toBe('test@example.com');
      expect(config.social.githubUsername).toBe('testuser');
      expect(config.development.debugMode).toBe(true);
      expect(config.build.version).toBe('1.0.0');
      expect(config.analytics.googleAnalyticsId).toBe('GA-TEST-123');
    });

    it('should use default values when environment variables are missing', () => {
      // Mock empty environment
      vi.stubGlobal('import', {
        meta: {
          env: {},
        },
      });

      const config = createConfig();

      expect(config.environment).toBe('development');
      expect(config.api.baseUrl).toBe('http://localhost:3001/api');
      expect(config.api.timeout).toBe(30000);
      expect(config.features.contactForm).toBe(true); // Default true
      expect(config.features.analytics).toBe(false); // Default false
      expect(config.contact.email).toBe('hello@example.com');
      expect(config.social.githubUsername).toBe('slamb2k');
      expect(config.development.debugMode).toBe(false);
    });

    it('should handle boolean conversion correctly', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_FEATURE_ANALYTICS: '1',
            VITE_FEATURE_CONTACT_FORM: 'false',
            VITE_DEBUG_MODE: 'true',
            VITE_SHOW_PERFORMANCE_METRICS: '0',
          },
        },
      });

      const config = createConfig();

      expect(config.features.analytics).toBe(true);
      expect(config.features.contactForm).toBe(false);
      expect(config.development.debugMode).toBe(true);
      expect(config.development.showPerformanceMetrics).toBe(false);
    });

    it('should handle number conversion correctly', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_API_TIMEOUT: '5000',
          },
        },
      });

      const config = createConfig();

      expect(config.api.timeout).toBe(5000);
    });

    it('should handle invalid number conversion with defaults', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_API_TIMEOUT: 'invalid',
          },
        },
      });

      const config = createConfig();

      expect(config.api.timeout).toBe(30000); // Should use default
    });
  });

  describe('validateConfig', () => {
    it('should validate valid configuration', () => {
      const result = validateConfig();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_CONTACT_EMAIL: '',
            VITE_GITHUB_USERNAME: '',
          },
        },
      });

      const result = validateConfig();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Contact email is required');
      expect(result.errors).toContain('GitHub username is required');
    });

    it('should detect invalid API configuration', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_API_BASE_URL: 'invalid-url',
            VITE_API_TIMEOUT: '-1000',
          },
        },
      });

      const result = validateConfig();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid API base URL');
      expect(result.errors).toContain('API timeout must be positive');
    });

    it('should detect analytics configuration issues', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_FEATURE_ANALYTICS: 'true',
            VITE_GOOGLE_ANALYTICS_ID: '',
            VITE_PLAUSIBLE_DOMAIN: '',
          },
        },
      });

      const result = validateConfig();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Analytics is enabled but no analytics provider is configured'
      );
    });

    it('should detect contact form configuration issues', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_FEATURE_CONTACT_FORM: 'true',
            VITE_CONTACT_FORM_ENDPOINT: '',
          },
        },
      });

      const result = validateConfig();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Contact form is enabled but no form endpoint is configured');
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return correct feature flag status', () => {
      expect(isFeatureEnabled('analytics')).toBe(true);
      expect(isFeatureEnabled('contactForm')).toBe(false);
    });
  });

  describe('debugLog', () => {
    it('should log when debug mode is enabled', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      debugLog('Test message', { data: 'test' });

      expect(consoleSpy).toHaveBeenCalledWith('[DEBUG]', 'Test message', { data: 'test' });
    });

    it('should not log when debug mode is disabled', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_DEBUG_MODE: 'false',
          },
        },
      });

      const consoleSpy = vi.spyOn(console, 'log');

      debugLog('Test message');

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});
