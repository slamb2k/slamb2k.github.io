#!/usr/bin/env node

/**
 * Build script with environment-specific configuration
 * Sets build-time environment variables and runs the build process
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

function getBuildInfo() {
  try {
    // Get git commit hash
    const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    
    // Get git branch
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    
    // Get build timestamp
    const buildDate = new Date().toISOString();
    
    // Get package version
    const packageJson = JSON.parse(execSync('cat package.json', { encoding: 'utf8' }));
    const version = packageJson.version;
    
    return {
      version: `${version}-${gitHash}`,
      buildDate,
      gitHash,
      gitBranch,
    };
  } catch (error) {
    console.warn('Failed to get build info from git:', error.message);
    return {
      version: 'unknown',
      buildDate: new Date().toISOString(),
      gitHash: 'unknown',
      gitBranch: 'unknown',
    };
  }
}

function createBuildEnvFile(environment, buildInfo) {
  const envContent = `# Build-time environment variables
# Generated automatically by build script
VITE_BUILD_VERSION=${buildInfo.version}
VITE_BUILD_DATE=${buildInfo.buildDate}
VITE_BUILD_GIT_HASH=${buildInfo.gitHash}
VITE_BUILD_GIT_BRANCH=${buildInfo.gitBranch}
VITE_BUILD_ENVIRONMENT=${environment}
`;

  const envPath = join(rootDir, '.env.build');
  writeFileSync(envPath, envContent);
  console.log(`✓ Created build environment file: ${envPath}`);
  console.log(`  Version: ${buildInfo.version}`);
  console.log(`  Date: ${buildInfo.buildDate}`);
  console.log(`  Git: ${buildInfo.gitHash} (${buildInfo.gitBranch})`);
}

function runBuild(environment) {
  console.log(`🚀 Starting build for ${environment} environment...`);
  
  const buildInfo = getBuildInfo();
  createBuildEnvFile(environment, buildInfo);
  
  try {
    // Set NODE_ENV for the build process
    const nodeEnv = environment === 'development' ? 'development' : 'production';
    
    // Run the build command with environment
    const buildCommand = `NODE_ENV=${nodeEnv} npm run build`;
    console.log(`📦 Running: ${buildCommand}`);
    
    execSync(buildCommand, { 
      stdio: 'inherit',
      cwd: rootDir,
      env: {
        ...process.env,
        NODE_ENV: nodeEnv,
        VITE_BUILD_VERSION: buildInfo.version,
        VITE_BUILD_DATE: buildInfo.buildDate,
      }
    });
    
    console.log(`✅ Build completed successfully for ${environment}`);
    console.log(`📂 Output directory: dist/`);
    
  } catch (error) {
    console.error(`❌ Build failed:`, error.message);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'production';
  
  const validEnvironments = ['development', 'staging', 'production'];
  
  if (!validEnvironments.includes(environment)) {
    console.error(`❌ Invalid environment: ${environment}`);
    console.error(`   Valid options: ${validEnvironments.join(', ')}`);
    process.exit(1);
  }
  
  runBuild(environment);
}

// Run the script
main();