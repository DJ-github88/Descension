#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if the deployed version matches the expected commit
 */

const https = require('https');
const { execSync } = require('child_process');

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://mythrill.netlify.app';
const TIMEOUT = 30000; // 30 seconds

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getCurrentCommit() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    log('❌ Failed to get current commit hash', 'red');
    return null;
  }
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (error) {
    log('❌ Failed to get current branch', 'red');
    return null;
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: TIMEOUT }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          data: data
        });
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkSiteHealth() {
  log('🏥 Checking site health...', 'blue');
  
  try {
    const response = await makeRequest(SITE_URL);
    
    if (response.statusCode === 200) {
      log('✅ Site is responding (200 OK)', 'green');
      return true;
    } else {
      log(`❌ Site returned status code: ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Site health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkVersionInfo() {
  log('🔍 Checking version information...', 'blue');
  
  try {
    const response = await makeRequest(SITE_URL);
    
    if (response.statusCode !== 200) {
      log('❌ Cannot check version - site not responding', 'red');
      return false;
    }
    
    // Look for version info in the HTML
    const html = response.data;
    
    // Extract version info from script tags or meta tags
    const commitMatch = html.match(/REACT_APP_COMMIT_SHA['"]\s*:\s*['"]([^'"]+)['"]/);
    const branchMatch = html.match(/REACT_APP_BRANCH['"]\s*:\s*['"]([^'"]+)['"]/);
    const versionMatch = html.match(/REACT_APP_VERSION['"]\s*:\s*['"]([^'"]+)['"]/);
    
    const deployedCommit = commitMatch ? commitMatch[1] : null;
    const deployedBranch = branchMatch ? branchMatch[1] : null;
    const deployedVersion = versionMatch ? versionMatch[1] : null;
    
    log('📊 Deployment Information:', 'bold');
    log(`   Version: ${deployedVersion || 'Unknown'}`, 'yellow');
    log(`   Branch: ${deployedBranch || 'Unknown'}`, 'yellow');
    log(`   Commit: ${deployedCommit || 'Unknown'}`, 'yellow');
    
    return {
      commit: deployedCommit,
      branch: deployedBranch,
      version: deployedVersion
    };
    
  } catch (error) {
    log(`❌ Version check failed: ${error.message}`, 'red');
    return false;
  }
}

async function verifyDeployment() {
  log('🚀 Starting deployment verification...', 'bold');
  log(`📍 Site URL: ${SITE_URL}`, 'blue');
  
  const currentCommit = getCurrentCommit();
  const currentBranch = getCurrentBranch();
  
  if (!currentCommit || !currentBranch) {
    log('❌ Cannot get local git information', 'red');
    process.exit(1);
  }
  
  log('📋 Local Information:', 'bold');
  log(`   Branch: ${currentBranch}`, 'yellow');
  log(`   Commit: ${currentCommit}`, 'yellow');
  
  // Check site health
  const isHealthy = await checkSiteHealth();
  if (!isHealthy) {
    log('❌ Deployment verification failed - site not healthy', 'red');
    process.exit(1);
  }
  
  // Check version information
  const deploymentInfo = await checkVersionInfo();
  if (!deploymentInfo) {
    log('❌ Deployment verification failed - cannot get version info', 'red');
    process.exit(1);
  }
  
  // Compare versions
  log('🔄 Comparing versions...', 'blue');
  
  let allMatch = true;
  
  if (deploymentInfo.commit && deploymentInfo.commit !== currentCommit) {
    log(`❌ Commit mismatch:`, 'red');
    log(`   Local:    ${currentCommit}`, 'red');
    log(`   Deployed: ${deploymentInfo.commit}`, 'red');
    allMatch = false;
  } else if (deploymentInfo.commit) {
    log(`✅ Commit matches: ${currentCommit.substring(0, 7)}`, 'green');
  }
  
  if (deploymentInfo.branch && deploymentInfo.branch !== currentBranch) {
    log(`❌ Branch mismatch:`, 'red');
    log(`   Local:    ${currentBranch}`, 'red');
    log(`   Deployed: ${deploymentInfo.branch}`, 'red');
    allMatch = false;
  } else if (deploymentInfo.branch) {
    log(`✅ Branch matches: ${currentBranch}`, 'green');
  }
  
  if (allMatch) {
    log('🎉 Deployment verification successful!', 'green');
    log('✅ All versions match - deployment is up to date', 'green');
    process.exit(0);
  } else {
    log('❌ Deployment verification failed!', 'red');
    log('💡 Possible solutions:', 'yellow');
    log('   1. Wait a few minutes for deployment to complete', 'yellow');
    log('   2. Check Netlify build logs for errors', 'yellow');
    log('   3. Force a new deployment by pushing a commit', 'yellow');
    log('   4. Clear Netlify cache and rebuild', 'yellow');
    process.exit(1);
  }
}

// Run verification
verifyDeployment().catch((error) => {
  log(`💥 Verification script failed: ${error.message}`, 'red');
  process.exit(1);
});
