export default {
  ci: {
    collect: {
      // Collect lighthouse data for built static site
      staticDistDir: './dist',
      url: ['http://localhost/'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        // Simulate real device conditions
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      },
    },
    assert: {
      // Don't use preset - define only what we need
      assertions: {
        // Performance budgets
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],

        // Core Web Vitals - Adjusted for React SPA with MDX
        'first-contentful-paint': ['warn', { maxNumericValue: 4000 }], // 4s for FCP
        'largest-contentful-paint': ['warn', { maxNumericValue: 5000 }], // 5s for LCP
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 800 }], // 800ms TBT

        // Resource budgets - Adjusted for modern React app with blog
        'resource-summary:total:size': ['warn', { maxNumericValue: 3000000 }], // 3MB total
        'resource-summary:script:size': ['warn', { maxNumericValue: 1000000 }], // 1MB scripts
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 200000 }], // 200KB styles
        'resource-summary:image:size': ['warn', { maxNumericValue: 2000000 }], // 2MB images

        // Performance metrics - Realistic for React SPA
        'speed-index': ['warn', { maxNumericValue: 5000 }], // 5s speed index
        interactive: ['warn', { maxNumericValue: 6000 }], // 6s TTI

        // Critical accessibility requirements only
        'document-title': 'error',
        'html-has-lang': 'error',
        'button-name': 'warn',
        'link-name': 'warn',
        'image-alt': 'warn',

        // Critical best practices only
        'no-vulnerable-libraries': 'error',
        charset: 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
      // Optional: Upload to LHCI server if configured
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: 'your-token',
    },
    server: {
      // Configuration for starting a local server
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lhci.db',
      },
    },
  },
};
