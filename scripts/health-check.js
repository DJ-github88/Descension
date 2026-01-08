/**
 * Health Check Script
 * Validates that your server is healthy and ready for users
 * 
 * Usage: node scripts/health-check.js [--server=http://localhost:3001]
 */

const http = require('http');
const { URL } = require('url');

// Parse command line arguments
const args = process.argv.slice(2);
let serverUrl = 'http://localhost:3001';

args.forEach(arg => {
  if (arg.startsWith('--server=')) {
    serverUrl = arg.split('=')[1];
  }
});

const url = new URL(serverUrl);
const checks = [];

// Make HTTP request
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = http.request({
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: path,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      const duration = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 400,
            statusCode: res.statusCode,
            duration,
            data: json
          });
        } catch {
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 400,
            statusCode: res.statusCode,
            duration,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Run health checks
async function runHealthChecks() {
  console.log('🏥 Running Health Checks');
  console.log(`   Server: ${serverUrl}`);
  console.log('');
  
  // Check 1: Health endpoint
  try {
    const health = await makeRequest('/health');
    checks.push({
      name: 'Health Endpoint',
      status: health.success && health.data.status === 'OK' ? '✅ PASS' : '❌ FAIL',
      details: `Status: ${health.data.status || 'Unknown'}, Response time: ${health.duration}ms`
    });
  } catch (error) {
    checks.push({
      name: 'Health Endpoint',
      status: '❌ FAIL',
      details: `Error: ${error.message}`
    });
  }
  
  // Check 2: Metrics endpoint
  try {
    const metrics = await makeRequest('/metrics');
    checks.push({
      name: 'Metrics Endpoint',
      status: metrics.success ? '✅ PASS' : '❌ FAIL',
      details: `Response time: ${metrics.duration}ms`
    });
    
    if (metrics.success && metrics.data) {
      console.log('   📊 Current Metrics:');
      console.log(`      Rooms: ${metrics.data.rooms?.total || 0} (${metrics.data.rooms?.active || 0} active)`);
      console.log(`      Players: ${metrics.data.players?.total || 0}`);
      console.log(`      Active Requests: ${metrics.data.performance?.activeRequests || 0}`);
      if (metrics.data.errors) {
        console.log(`      Recent Errors: ${metrics.data.errors.total || 0}`);
      }
      console.log('');
    }
  } catch (error) {
    checks.push({
      name: 'Metrics Endpoint',
      status: '❌ FAIL',
      details: `Error: ${error.message}`
    });
  }
  
  // Check 3: Logs endpoint
  try {
    const logs = await makeRequest('/debug/logs?limit=5');
    checks.push({
      name: 'Logs Endpoint',
      status: logs.success ? '✅ PASS' : '❌ FAIL',
      details: `Response time: ${logs.duration}ms, Logs available: ${logs.data?.count || 0}`
    });
  } catch (error) {
    checks.push({
      name: 'Logs Endpoint',
      status: '❌ FAIL',
      details: `Error: ${error.message}`
    });
  }
  
  // Check 4: Response time
  try {
    const health = await makeRequest('/health');
    const responseTime = health.duration;
    checks.push({
      name: 'Response Time',
      status: responseTime < 100 ? '✅ PASS' : responseTime < 500 ? '⚠️  WARN' : '❌ FAIL',
      details: `${responseTime}ms (target: <100ms, acceptable: <500ms)`
    });
  } catch (error) {
    checks.push({
      name: 'Response Time',
      status: '❌ FAIL',
      details: `Error: ${error.message}`
    });
  }
  
  // Print results
  console.log('📋 Health Check Results:');
  console.log('═'.repeat(50));
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}`);
    console.log(`   ${check.details}`);
    console.log('');
  });
  
  // Summary
  const passed = checks.filter(c => c.status.includes('✅')).length;
  const failed = checks.filter(c => c.status.includes('❌')).length;
  const warnings = checks.filter(c => c.status.includes('⚠️')).length;
  
  console.log('📊 Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('');
  
  if (failed === 0 && warnings === 0) {
    console.log('🎉 All checks passed! Server is healthy.');
    process.exit(0);
  } else if (failed === 0) {
    console.log('⚠️  Some warnings, but server is functional.');
    process.exit(0);
  } else {
    console.log('🚨 Some checks failed. Review issues before launch.');
    process.exit(1);
  }
}

// Run checks
runHealthChecks().catch(error => {
  console.error('Health check failed:', error);
  process.exit(1);
});

