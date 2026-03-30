#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Building with dynamic version information...');

// Change to vtt-react directory
const vttReactDir = path.join(__dirname, '..', 'vtt-react');
process.chdir(vttReactDir);

// Get git information
function getGitInfo() {
  try {
    const commitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const buildTime = new Date().toISOString();
    
    return {
      commitSha,
      branch,
      buildTime
    };
  } catch (error) {
    console.warn('⚠️  Could not get git info, using fallbacks:', error.message);
    return {
      commitSha: 'unknown',
      branch: 'unknown', 
      buildTime: new Date().toISOString()
    };
  }
}

// Get package version
function getPackageVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version || '0.1.3';
  } catch (error) {
    console.warn('⚠️  Could not read package version, using fallback');
    return '0.1.3';
  }
}

// Main build process
function main() {
  const gitInfo = getGitInfo();
  const version = getPackageVersion();
  
  console.log('📊 Version Information:');
  console.log(`   Version: ${version}`);
  console.log(`   Commit: ${gitInfo.commitSha.substring(0, 7)}`);
  console.log(`   Branch: ${gitInfo.branch}`);
  console.log(`   Build Time: ${gitInfo.buildTime}`);
  
  // Set environment variables
  const env = {
    ...process.env,
    GENERATE_SOURCEMAP: 'false',
    CI: 'true',
    NODE_OPTIONS: '--max-old-space-size=8192',
    REACT_APP_BUILD_MODE: 'production',
    REACT_APP_ENV: 'production',
    REACT_APP_VERSION: version,
    REACT_APP_COMMIT_SHA: gitInfo.commitSha,
    REACT_APP_BRANCH: gitInfo.branch,
    REACT_APP_BUILD_TIME: gitInfo.buildTime,
    INLINE_RUNTIME_CHUNK: 'false',
    BROWSERSLIST_ENV: 'production'
  };
  
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  try {
    if (fs.existsSync('build')) {
      fs.rmSync('build', { recursive: true, force: true });
    }
  } catch (error) {
    console.warn('⚠️  Could not clean build directory:', error.message);
  }
  
  // Run build
  console.log('🏗️  Building application...');
  try {
    execSync('npm run build', { 
      stdio: 'inherit',
      env
    });
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getGitInfo, getPackageVersion };
