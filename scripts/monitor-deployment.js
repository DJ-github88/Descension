#!/usr/bin/env node

/**
 * Deployment Monitoring Script (Node.js version for Windows)
 * Continuously monitor deployment status and health
 */

const https = require('https');
const { execSync } = require('child_process');

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://abcdfasdsad.netlify.app';
const CHECK_INTERVAL = 30; // seconds
const MAX_WAIT_TIME = 600; // 10 minutes
const HEALTH_CHECK_TIMEOUT = 10000; // 10 seconds

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

function showUsage() {
  log('📊 Deployment Monitoring Script', 'blue');
  console.log('');
  console.log('Usage: node monitor-deployment.js [OPTIONS]');
  console.log('');
  console.log('Options:');
  console.log('  -u, --url URL        Site URL to monitor (default: ' + SITE_URL + ')');
  console.log('  -i, --interval SEC   Check interval in seconds (default: ' + CHECK_INTERVAL + ')');
  console.log('  -t, --timeout SEC    Max wait time in seconds (default: ' + MAX_WAIT_TIME + ')');
  console.log('  -o, --once          Run check once and exit');
  console.log('  -h, --help          Show this help');
  console.log('');
  console.log('Environment Variables:');
  console.log('  SITE_URL            Override default site URL');
}

function makeRequest(url, timeout = HEALTH_CHECK_TIMEOUT) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout }, (response) => {
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

async function checkSiteHealth(url) {
  log('🏥 Checking site health...', 'blue');
  
  try {
    const response = await makeRequest(url);
    
    if (response.statusCode === 200) {
      log('✅ Site is responding (200 OK)', 'green');
      return { healthy: true, data: response.data };
    } else {
      log(`❌ Site returned status code: ${response.statusCode}`, 'red');
      return { healthy: false, data: response.data };
    }
  } catch (error) {
    log(`❌ Site health check failed: ${error.message}`, 'red');
    return { healthy: false, error: error.message };
  }
}

function extractVersionInfo(html) {
  if (!html) return {};
  
  // Extract version info from HTML content
  const commitMatch = html.match(/REACT_APP_COMMIT_SHA['"]\s*:\s*['"]([^'"]+)['"]/);
  const branchMatch = html.match(/REACT_APP_BRANCH['"]\s*:\s*['"]([^'"]+)['"]/);
  const versionMatch = html.match(/REACT_APP_VERSION['"]\s*:\s*['"]([^'"]+)['"]/);
  const buildTimeMatch = html.match(/REACT_APP_BUILD_TIME['"]\s*:\s*['"]([^'"]+)['"]/);
  
  return {
    commit: commitMatch ? commitMatch[1] : 'unknown',
    branch: branchMatch ? branchMatch[1] : 'unknown',
    version: versionMatch ? versionMatch[1] : 'unknown',
    buildTime: buildTimeMatch ? buildTimeMatch[1] : 'unknown'
  };
}

function formatTimestamp() {
  return new Date().toLocaleString();
}

async function monitorDeployment(url, interval, maxWait, once) {
  const startTime = Date.now();
  let checkCount = 0;
  
  log('🔍 Starting deployment monitoring...', 'blue');
  log(`📍 Site URL: ${url}`, 'blue');
  log(`⏱️  Check interval: ${interval}s`, 'blue');
  log(`⏰ Max wait time: ${maxWait}s`, 'blue');
  console.log('');
  
  // Get local git info
  const localCommit = getCurrentCommit();
  const localBranch = getCurrentBranch();
  
  log('📋 Local Information:', 'bold');
  log(`   Branch: ${localBranch}`, 'yellow');
  log(`   Commit: ${localCommit.substring(0, 7)}`, 'yellow');
  console.log('');
  
  while (true) {
    checkCount++;
    const currentTime = Date.now();
    const elapsed = Math.floor((currentTime - startTime) / 1000);
    
    log(`[${formatTimestamp()}] Check #${checkCount} (${elapsed}s elapsed)`, 'blue');
    
    // Health check
    const healthResult = await checkSiteHealth(url);
    
    if (healthResult.healthy) {
      // Extract deployment info
      const deploymentInfo = extractVersionInfo(healthResult.data);
      
      log('📊 Deployed Version:', 'blue');
      log(`      Version: ${deploymentInfo.version}`, 'yellow');
      log(`      Branch: ${deploymentInfo.branch}`, 'yellow');
      log(`      Commit: ${deploymentInfo.commit.substring(0, 7)}`, 'yellow');
      log(`      Build: ${deploymentInfo.buildTime}`, 'yellow');
      
      // Compare with local
      if (deploymentInfo.commit !== 'unknown' && deploymentInfo.commit === localCommit) {
        log('🎉 Deployment matches local commit!', 'green');
        log('✅ Monitoring complete - deployment is up to date', 'green');
        process.exit(0);
      } else {
        log('⏳ Deployment in progress (commit mismatch)', 'yellow');
        log(`      Local:    ${localCommit.substring(0, 7)}`);
        log(`      Deployed: ${deploymentInfo.commit.substring(0, 7)}`);
      }
    }
    
    // Check if we should exit
    if (once) {
      log('📋 Single check complete', 'blue');
      process.exit(0);
    }
    
    // Check timeout
    if (elapsed >= maxWait) {
      log(`⏰ Timeout reached (${maxWait}s)`, 'red');
      log('💡 Deployment may still be in progress', 'yellow');
      process.exit(1);
    }
    
    log(`⏳ Waiting ${interval}s for next check...`, 'blue');
    console.log('');
    
    // Wait for next check
    await new Promise(resolve => setTimeout(resolve, interval * 1000));
  }
}

function main() {
  const args = process.argv.slice(2);
  let url = SITE_URL;
  let interval = CHECK_INTERVAL;
  let maxWait = MAX_WAIT_TIME;
  let once = false;
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-u':
      case '--url':
        url = args[++i];
        break;
      case '-i':
      case '--interval':
        interval = parseInt(args[++i]);
        break;
      case '-t':
      case '--timeout':
        maxWait = parseInt(args[++i]);
        break;
      case '-o':
      case '--once':
        once = true;
        break;
      case '-h':
      case '--help':
        showUsage();
        process.exit(0);
        break;
      default:
        log(`❌ Unknown option: ${args[i]}`, 'red');
        showUsage();
        process.exit(1);
    }
  }
  
  // Validate URL
  if (!url) {
    log('❌ Error: No site URL specified', 'red');
    showUsage();
    process.exit(1);
  }
  
  // Start monitoring
  monitorDeployment(url, interval, maxWait, once).catch((error) => {
    log(`💥 Monitoring failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

// Run main function if script is executed directly
if (require.main === module) {
  main();
}

module.exports = { monitorDeployment, checkSiteHealth, extractVersionInfo };
