#!/usr/bin/env node

/**
 * Force Netlify Deployment Script
 * Triggers a manual deployment to Netlify
 */

const https = require('https');
const { execSync } = require('child_process');

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
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    log('❌ Failed to get current commit hash', 'red');
    return 'unknown';
  }
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    log('❌ Failed to get current branch', 'red');
    return 'unknown';
  }
}

async function checkNetlifyStatus() {
  log('🔍 Investigating Netlify deployment status...', 'blue');
  
  const currentCommit = getCurrentCommit();
  const currentBranch = getCurrentBranch();
  
  log('📋 Current Local State:', 'bold');
  log(`   Branch: ${currentBranch}`, 'yellow');
  log(`   Commit: ${currentCommit}`, 'yellow');
  log(`   Time: ${new Date().toISOString()}`, 'yellow');
  
  // Check what's actually deployed
  log('🌐 Checking deployed content...', 'blue');
  
  try {
    const response = await new Promise((resolve, reject) => {
      const request = https.get('https://windtunnel.netlify.app', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      });
      request.on('error', reject);
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
    
    log(`📊 Netlify Response: ${response.statusCode}`, response.statusCode === 200 ? 'green' : 'red');
    
    // Check for version information in the response
    const hasVersionInfo = response.data.includes('REACT_APP_COMMIT_SHA') || 
                          response.data.includes('versionInfo') ||
                          response.data.includes('version-display');
    
    const hasRecentContent = response.data.includes('CharacterManagement') ||
                            response.data.includes('AccountDashboard') ||
                            response.data.length > 1000;
    
    log('🔍 Content Analysis:', 'blue');
    log(`   Has Version Info: ${hasVersionInfo ? '✅ Yes' : '❌ No'}`, hasVersionInfo ? 'green' : 'red');
    log(`   Has Recent Content: ${hasRecentContent ? '✅ Yes' : '❌ No'}`, hasRecentContent ? 'green' : 'red');
    log(`   Content Length: ${response.data.length} characters`, 'yellow');
    
    if (!hasRecentContent) {
      log('🚨 PROBLEM IDENTIFIED: Netlify is serving old/minimal content!', 'red');
      log('💡 This suggests Netlify is not building from the latest repository state.', 'yellow');
    }
    
    return { hasVersionInfo, hasRecentContent, contentLength: response.data.length };
    
  } catch (error) {
    log(`❌ Failed to check Netlify content: ${error.message}`, 'red');
    return { error: error.message };
  }
}

async function suggestFixes() {
  log('🔧 SUGGESTED FIXES:', 'bold');
  log('', 'reset');
  
  log('1. 🔗 Check Netlify Site Settings:', 'blue');
  log('   • Go to https://app.netlify.com', 'yellow');
  log('   • Find your windtunnel site', 'yellow');
  log('   • Check Site Settings > Build & Deploy', 'yellow');
  log('   • Verify Repository is connected to DJ-github88/Descension', 'yellow');
  log('   • Verify Branch is set to "master"', 'yellow');
  log('', 'reset');
  
  log('2. 🔄 Force Manual Deploy:', 'blue');
  log('   • In Netlify dashboard: Deploys > Trigger Deploy > Deploy Site', 'yellow');
  log('   • This will force a fresh build from the latest commit', 'yellow');
  log('', 'reset');
  
  log('3. 🧹 Clear Build Cache:', 'blue');
  log('   • In Netlify dashboard: Site Settings > Build & Deploy > Clear Cache', 'yellow');
  log('   • Then trigger a new deploy', 'yellow');
  log('', 'reset');
  
  log('4. 🔧 Check Build Command:', 'blue');
  log('   • Verify build command is: rm -rf node_modules && rm -rf build && rm -rf .cache && npm ci --force && npm run build:netlify', 'yellow');
  log('   • Verify base directory is: vtt-react', 'yellow');
  log('   • Verify publish directory is: build', 'yellow');
  log('', 'reset');
  
  log('5. 🚨 Emergency Fix - Manual Upload:', 'blue');
  log('   • Run: npm run build:netlify', 'yellow');
  log('   • Manually drag the build folder to Netlify deploy area', 'yellow');
  log('', 'reset');
}

async function main() {
  log('🚨 NETLIFY DEPLOYMENT INVESTIGATION', 'bold');
  log('=====================================', 'blue');
  log('', 'reset');
  
  const status = await checkNetlifyStatus();
  
  log('', 'reset');
  await suggestFixes();
  
  log('', 'reset');
  log('🎯 NEXT STEPS:', 'bold');
  log('1. Check Netlify dashboard for deployment history', 'yellow');
  log('2. Verify repository connection', 'yellow');
  log('3. Force a manual deployment', 'yellow');
  log('4. Monitor deployment logs', 'yellow');
  log('', 'reset');
  
  if (!status.hasRecentContent) {
    log('🚨 URGENT: Netlify is definitely not deploying your latest code!', 'red');
    process.exit(1);
  } else {
    log('✅ Netlify appears to be working correctly', 'green');
    process.exit(0);
  }
}

// Run the investigation
main().catch(error => {
  log(`💥 Investigation failed: ${error.message}`, 'red');
  process.exit(1);
});
