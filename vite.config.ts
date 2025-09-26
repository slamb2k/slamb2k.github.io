import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    {
      enforce: 'pre' as const,
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Generate source maps for better debugging
    sourcemap: mode === 'development',
    // Optimize chunk splitting for production
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Don't bundle MDX files into vendor chunks
          if (id.includes('.mdx')) {
            return; // Let Rollup handle MDX files automatically for code-splitting
          }

          if (id.includes('node_modules')) {
            // Core React - always needed
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router')) {
              return 'react-core';
            }

            // React ecosystem - often needed but not always
            if (id.includes('react')) {
              return 'react-ecosystem';
            }

            // Animation libraries - lazy load when possible
            if (id.includes('framer-motion')) {
              return 'animation';
            }

            // Icons - lazy load
            if (id.includes('lucide-react')) {
              return 'icons';
            }

            // i18n - needed for most pages
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }

            // MDX runtime - only needed for blog posts
            if (id.includes('@mdx-js')) {
              return 'mdx-runtime';
            }

            // Syntax highlighting - only for blog posts with code
            if (id.includes('prism') || id.includes('refractor') || id.includes('parse-entities')) {
              return 'syntax-highlighting';
            }

            // UI components libraries
            if (id.includes('@radix-ui') || id.includes('cmdk')) {
              return 'ui-libs';
            }

            // 3D libraries - only if used
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-3d';
            }

            // All other vendor code
            return 'vendor';
          }

          // Group application code by feature
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
          if (id.includes('/components/generated/')) {
            return 'generated-components';
          }
          if (id.includes('/components/mdx/')) {
            return 'mdx-components';
          }
          if (id.includes('/hooks/')) {
            return 'hooks';
          }
          if (id.includes('/utils/')) {
            return 'utils';
          }
        },
        // Optimize chunk names for better caching
        chunkFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId : '';
          // Special naming for MDX files to make them cacheable
          if (facadeModuleId.includes('.mdx')) {
            const name = path.basename(facadeModuleId, '.mdx');
            return `blog/[name]-[hash].js`;
          }
          return 'assets/[name]-[hash].js';
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Performance optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
        passes: 2, // Run compress passes twice for better optimization
      },
      mangle: {
        safari10: true, // Work around Safari 10 bugs
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Set appropriate chunk size limits
    chunkSizeWarningLimit: 200, // 200kb warning for individual chunks
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Better tree shaking
    modulePreload: {
      polyfill: false, // Don't polyfill module preload for modern browsers
    },
  },
  // Performance optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-i18next', 'i18next'],
    exclude: [
      '@mdx-js/react', // Exclude MDX from pre-bundling to allow code splitting
    ],
  },
}));
