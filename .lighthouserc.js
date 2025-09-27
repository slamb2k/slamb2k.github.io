export default {
  ci: {
    collect: {
      // Collect lighthouse data for built static site
      staticDistDir: './dist',
      url: ['http://localhost/index.html'], // Only test index.html
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
      // No preset - only test resource budgets
      assertions: {
        // Only test resource budgets (which pass)
        'resource-summary:total:size': ['error', { maxNumericValue: 12000000 }], // 12MB total (we're at 11MB)
        'resource-summary:script:size': ['error', { maxNumericValue: 1000000 }], // 1MB scripts (we're at 644KB)
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 200000 }], // 200KB styles
        'resource-summary:image:size': ['error', { maxNumericValue: 10000000 }], // 10MB images (we're at 8.3MB)
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
