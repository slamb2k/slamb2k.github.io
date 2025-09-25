#!/usr/bin/env node

/**
 * Simplified build script
 * Just runs TypeScript compilation and Vite build
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

function runBuild() {
  console.log(`🚀 Starting production build...`);

  try {
    // Run TypeScript compilation
    console.log('📦 Running TypeScript compilation...');
    execSync('npx tsc -b', {
      stdio: 'inherit',
      cwd: rootDir,
    });

    // Run Vite build in production mode
    console.log('📦 Building with Vite...');
    execSync('npx vite build', {
      stdio: 'inherit',
      cwd: rootDir,
    });

    console.log('✅ Build completed successfully');
    console.log('📂 Output directory: dist/');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run the build
runBuild();
