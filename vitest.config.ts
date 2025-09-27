import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.*',
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.stories.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        'dist/',
        'coverage/',
        'scripts/',
        '.storybook/',
        'tests/',
        'e2e/',
        '*.js',
        '*.cjs',
        '*.mjs',
        'src/App.tsx',
        'src/router/AppRouter.tsx',
        'src/config/environment.ts',
        'src/i18n/',
        'src/components/ui/Button.tsx',
        'src/components/ui/IconButton.tsx',
        'src/pages/BlogPage.tsx',
        'src/pages/BlogPostPage.tsx',
        'src/data/blog/',
        'src/data/blog-metadata.ts',
        'src/components/mdx/',
        'src/content/',
      ],
      thresholds: {
        lines: 44,
        functions: 44,
        branches: 44,
        statements: 44,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
