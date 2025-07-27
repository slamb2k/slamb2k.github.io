import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Generate source maps for better debugging
    sourcemap: mode === 'development',
    // Enable bundle analysis in analyze mode
    rollupOptions: {
      output: {
        // Generate bundle stats for analysis
        ...(mode === 'analyze' && {
          manualChunks: id => {
            if (id.includes('node_modules')) {
              // Group vendor dependencies
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('framer-motion')) {
                return 'animation-vendor';
              }
              if (id.includes('lucide-react')) {
                return 'icons-vendor';
              }
              return 'vendor';
            }
            // Group application code by feature
            if (id.includes('/components/ui/')) {
              return 'ui-components';
            }
            if (id.includes('/components/generated/')) {
              return 'generated-components';
            }
            if (id.includes('/hooks/')) {
              return 'hooks';
            }
          },
        }),
      },
    },
    // Performance budgets
    chunkSizeWarningLimit: 500, // 500kb warning
  },
  // Performance optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
  },
}));
