/**
 * Simple Load Test Script
 * Tests your server's ability to handle concurrent connections
 * 
 * Usage: node scripts/load-test.js [options]
 * Options:
 *   --connections=10    Number of concurrent connections
 *   --duration=30      Test duration in seconds
 *   --server=http://localhost:3001  Server URL
 */

const http = require('http');
const { URL } = require('url');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  connections: 10,
  duration: 30,
  server: 'http://localhost:3001'
};

args.forEach(arg => {
  if (arg.startsWith('--connections=')) {
    options.connections = parseInt(arg.split('=')[1]);
  } else if (arg.startsWith('--duration=')) {
    options.duration = parseInt(arg.split('=')[1]);
  } else if (arg.startsWith('--server=')) {
    options.server = arg.split('=')[1];
  }
});

const serverUrl = new URL(options.server);
const stats = {
  total: 0,
  success: 0,
  errors: 0,
  responseTimes: [],
  errorMessages: []
};

console.log('🚀 Starting Load Test');
console.log(`   Server: ${options.server}`);
console.log(`   Connections: ${options.connections}`);
console.log(`   Duration: ${options.duration}s`);
console.log('');

// Make a single request
function makeRequest() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = http.request({
      hostname: serverUrl.hostname,
      port: serverUrl.port || (serverUrl.protocol === 'https:' ? 443 : 80),
      path: '/health',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      const duration = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        stats.total++;
        if (res.statusCode >= 200 && res.statusCode < 400) {
          stats.success++;
          stats.responseTimes.push(duration);
        } else {
          stats.errors++;
          stats.errorMessages.push(`HTTP ${res.statusCode}`);
        }
        resolve({ duration, statusCode: res.statusCode });
      });
    });
    
    req.on('error', (error) => {
      stats.total++;
      stats.errors++;
      stats.errorMessages.push(error.message);
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      stats.total++;
      stats.errors++;
      stats.errorMessages.push('Request timeout');
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Create concurrent connections
async function runLoadTest() {
  const startTime = Date.now();
  const endTime = startTime + (options.duration * 1000);
  const connections = [];
  
  // Create connection pool
  for (let i = 0; i < options.connections; i++) {
    connections.push((async () => {
      while (Date.now() < endTime) {
        try {
          await makeRequest();
          // Small delay to prevent overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          // Error already logged in makeRequest
        }
      }
    })());
  }
  
  // Wait for all connections to complete
  await Promise.all(connections);
  
  // Calculate statistics
  const totalDuration = (Date.now() - startTime) / 1000;
  const avgResponseTime = stats.responseTimes.length > 0
    ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length
    : 0;
  const minResponseTime = stats.responseTimes.length > 0
    ? Math.min(...stats.responseTimes)
    : 0;
  const maxResponseTime = stats.responseTimes.length > 0
    ? Math.max(...stats.responseTimes)
    : 0;
  
  // Sort response times for percentile calculation
  const sortedTimes = [...stats.responseTimes].sort((a, b) => a - b);
  const p95 = sortedTimes.length > 0
    ? sortedTimes[Math.floor(sortedTimes.length * 0.95)]
    : 0;
  const p99 = sortedTimes.length > 0
    ? sortedTimes[Math.floor(sortedTimes.length * 0.99)]
    : 0;
  
  const successRate = stats.total > 0
    ? ((stats.success / stats.total) * 100).toFixed(2)
    : 0;
  const requestsPerSecond = (stats.total / totalDuration).toFixed(2);
  
  // Print results
  console.log('📊 Load Test Results');
  console.log('═'.repeat(50));
  console.log(`Total Requests:     ${stats.total}`);
  console.log(`Successful:         ${stats.success} (${successRate}%)`);
  console.log(`Errors:             ${stats.errors}`);
  console.log(`Requests/Second:    ${requestsPerSecond}`);
  console.log('');
  console.log('Response Times:');
  console.log(`  Average:          ${avgResponseTime.toFixed(2)}ms`);
  console.log(`  Min:               ${minResponseTime}ms`);
  console.log(`  Max:               ${maxResponseTime}ms`);
  console.log(`  95th Percentile:  ${p95}ms`);
  console.log(`  99th Percentile:  ${p99}ms`);
  console.log('');
  
  if (stats.errorMessages.length > 0) {
    console.log('Error Summary:');
    const errorCounts = {};
    stats.errorMessages.forEach(msg => {
      errorCounts[msg] = (errorCounts[msg] || 0) + 1;
    });
    Object.entries(errorCounts).forEach(([msg, count]) => {
      console.log(`  ${msg}: ${count}`);
    });
  }
  
  console.log('');
  console.log('💡 Interpretation:');
  if (successRate >= 99) {
    console.log('   ✅ Excellent - Server handling load well');
  } else if (successRate >= 95) {
    console.log('   ⚠️  Good - Some errors, but acceptable');
  } else {
    console.log('   🚨 Poor - Too many errors, investigate issues');
  }
  
  if (avgResponseTime < 100) {
    console.log('   ✅ Response times are fast');
  } else if (avgResponseTime < 500) {
    console.log('   ⚠️  Response times are acceptable');
  } else {
    console.log('   🚨 Response times are slow - optimize server');
  }
}

// Run the test
runLoadTest().catch(error => {
  console.error('Load test failed:', error);
  process.exit(1);
});

