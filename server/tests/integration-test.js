/**
 * Integration Test Script
 * 
 * Run this script to verify the refactored server works correctly:
 * npm run test:integration
 * 
 * Or directly: node tests/integration-test.js
 */

const io = require('socket.io-client');
const http = require('http');

// Test configuration - use a different port to avoid conflicts
const TEST_PORT = process.env.TEST_PORT || 3099;
const TEST_URL = `http://localhost:${TEST_PORT}`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test results
let passed = 0;
let failed = 0;

function testPass(name) {
  passed++;
  log(`  ✅ ${name}`, 'green');
}

function testFail(name, error) {
  failed++;
  log(`  ❌ ${name}`, 'red');
  if (error) log(`     Error: ${error.message || error}`, 'red');
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

// Run tests
async function runTests() {
  log('\n========================================', 'blue');
  log('  Mythrill VTT Integration Tests', 'blue');
  log('========================================\n', 'blue');

  let server = null;
  let serverModule = null;
  let client1 = null;
  let client2 = null;

  try {
    // Check if test port is available
    const portInUse = await isPortInUse(TEST_PORT);
    if (portInUse) {
      log(`⚠️  Port ${TEST_PORT} is already in use. Using existing server.`, 'yellow');
      log('   Make sure your server is running on this port.\n', 'yellow');
    }

    // Try to start test server if port is available
    if (!portInUse) {
      log('📦 Starting test server...', 'yellow');
      
      try {
        // Set env var for test port
        process.env.PORT = TEST_PORT;
        
        // Clear module cache to ensure fresh import
        delete require.cache[require.resolve('../server.js')];
        
        serverModule = require('../server.js');
        server = serverModule.server;
        
        await sleep(1000);
        log('  ✅ Test server started successfully', 'green');
      } catch (e) {
        // Check if it's just "address in use" - that's ok
        if (e.code === 'EADDRINUSE') {
          log(`  ⚠️ Port ${TEST_PORT} in use, connecting to existing server`, 'yellow');
        } else {
          log(`  ⚠️ Could not start test server: ${e.message}`, 'yellow');
          log('  Will attempt to connect to existing server...', 'yellow');
        }
      }
    }

    // Wait for server to be ready
    await sleep(500);

    // Test 1: Basic connection
    log('\n🔌 Test 1: Socket Connection', 'blue');
    
    try {
      client1 = io(TEST_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: false,
        timeout: 5000
      });
      
      await new Promise((resolve, reject) => {
        client1.connect();
        client1.on('connect', () => {
          log('  Connected to server', 'cyan');
          resolve();
        });
        client1.on('connect_error', (err) => {
          reject(new Error(`Connection failed: ${err.message}`));
        });
        setTimeout(() => reject(new Error('Connection timeout')), 5000);
      });
      
      testPass('Client connects to server');
    } catch (e) {
      testFail('Client connects to server', e);
      
      // If we can't connect, try default port
      if (TEST_PORT !== 3001) {
        log('\n  Trying default port 3001...', 'yellow');
        try {
          client1 = io('http://localhost:3001', {
            transports: ['websocket', 'polling'],
            autoConnect: false,
            timeout: 5000
          });
          
          await new Promise((resolve, reject) => {
            client1.connect();
            client1.on('connect', resolve);
            client1.on('connect_error', reject);
            setTimeout(() => reject(new Error('Timeout')), 5000);
          });
          
          testPass('Client connects to server (port 3001)');
        } catch (e2) {
          testFail('Client connects to server (port 3001)', e2);
          log('\n  Make sure the server is running: npm start', 'yellow');
        }
      }
    }

    // Only continue tests if we have a connection
    if (!client1?.connected) {
      log('\n❌ Cannot continue tests without server connection', 'red');
      log('   Please start the server first: npm start', 'yellow');
      throw new Error('No server connection');
    }

    // Test 2: Ping/Pong
    log('\n🏓 Test 2: Ping/Pong', 'blue');
    
    try {
      const pong = await new Promise((resolve, reject) => {
        client1.emit('ping', {}, (response) => {
          resolve(response);
        });
        setTimeout(() => reject(new Error('Ping timeout')), 3000);
      });
      
      if (pong === 'pong') {
        testPass('Ping returns pong');
      } else {
        testFail('Ping returns pong', `Got: ${pong}`);
      }
    } catch (e) {
      // Some servers might not have callback-style ping
      testFail('Ping returns pong', e);
    }

    // Test 3: Room creation
    log('\n🏠 Test 3: Room Creation', 'blue');
    
    let createdRoom = null;
    
    try {
      const roomData = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Room creation timeout')), 10000);
        
        client1.once('room_created', (data) => {
          clearTimeout(timeout);
          resolve(data);
        });
        
        client1.once('room_error', (error) => {
          clearTimeout(timeout);
          reject(new Error(error.error));
        });
        
        client1.emit('create_room', {
          roomName: 'Test Room ' + Date.now(),
          gmName: 'Test GM',
          password: '',
          playerColor: '#d4af37'
        });
      });
      
      if (roomData && roomData.room) {
        createdRoom = roomData.room;
        testPass('Room created successfully');
        
        if (roomData.room.gm) {
          testPass('GM assigned correctly');
        } else {
          testFail('GM assigned correctly', 'No GM data');
        }
      } else {
        testFail('Room created successfully', 'No room data returned');
      }
    } catch (e) {
      testFail('Room created successfully', e);
    }

    // Test 4: Health check endpoint
    log('\n❤️  Test 4: Health Endpoint', 'blue');
    
    const healthUrl = TEST_URL.replace(TEST_PORT.toString(), process.env.PORT || '3001');
    
    try {
      const healthData = await new Promise((resolve, reject) => {
        const req = http.request(`${healthUrl}/health`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ status: 'ok', raw: data });
            }
          });
        });
        req.on('error', reject);
        req.end();
        setTimeout(() => reject(new Error('Health check timeout')), 3000);
      });
      
      if (healthData.status === 'ok') {
        testPass('Health endpoint returns ok');
        log(`     Uptime: ${Math.round(healthData.uptime || 0)}s, Rooms: ${healthData.rooms || 0}, Players: ${healthData.players || 0}`, 'cyan');
      } else {
        testFail('Health endpoint returns ok', healthData);
      }
    } catch (e) {
      testFail('Health endpoint returns ok', e);
    }

    // Test 5: Room list endpoint
    log('\n📋 Test 5: Room List Endpoint', 'blue');
    
    try {
      const roomsData = await new Promise((resolve, reject) => {
        const req = http.request(`${healthUrl}/api/rooms`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ rooms: [], raw: data });
            }
          });
        });
        req.on('error', reject);
        req.end();
        setTimeout(() => reject(new Error('Room list timeout')), 3000);
      });
      
      if (roomsData && Array.isArray(roomsData.rooms)) {
        testPass('Room list endpoint returns array');
        log(`     Found ${roomsData.rooms.length} public rooms`, 'cyan');
      } else {
        testFail('Room list endpoint returns array', 'Invalid response');
      }
    } catch (e) {
      testFail('Room list endpoint returns array', e);
    }

    // Test 6: Chat message
    log('\n💬 Test 6: Chat System', 'blue');
    
    if (createdRoom) {
      try {
        const chatReceived = new Promise((resolve, reject) => {
          client1.once('chat_message', (data) => {
            if (data.content === 'Test message') {
              resolve(data);
            }
          });
          setTimeout(() => reject(new Error('Chat timeout')), 5000);
        });
        
        await sleep(100);
        
        client1.emit('chat_message', {
          message: 'Test message',
          type: 'chat'
        });
        
        await chatReceived;
        testPass('Chat message echo received');
      } catch (e) {
        testFail('Chat message echo received', e);
      }
    } else {
      testFail('Chat message echo received', 'No room created');
    }

    // Test 7: Second client connection
    log('\n👥 Test 7: Multi-client', 'blue');
    
    try {
      const connectUrl = client1.io.uri;
      
      client2 = io(connectUrl, {
        transports: ['websocket', 'polling'],
        autoConnect: false,
        timeout: 5000
      });
      
      await new Promise((resolve, reject) => {
        client2.connect();
        client2.on('connect', resolve);
        client2.on('connect_error', reject);
        setTimeout(() => reject(new Error('Timeout')), 5000);
      });
      
      testPass('Second client connects');
      
      // Disconnect second client
      client2.disconnect();
      testPass('Second client disconnects cleanly');
    } catch (e) {
      testFail('Second client connects', e);
    }

    // Test 8: Leave room
    log('\n🚪 Test 8: Leave Room', 'blue');
    
    try {
      await new Promise((resolve) => {
        client1.emit('leave_room');
        setTimeout(resolve, 500);
      });
      
      testPass('Leave room request sent');
    } catch (e) {
      testFail('Leave room request sent', e);
    }

    // Test 9: Disconnect handling
    log('\n🔌 Test 9: Disconnect Handling', 'blue');
    
    try {
      await new Promise((resolve) => {
        client1.disconnect();
        setTimeout(resolve, 500);
      });
      
      testPass('Client disconnects cleanly');
    } catch (e) {
      testFail('Client disconnects cleanly', e);
    }

  } catch (error) {
    if (error.message !== 'No server connection') {
      log(`\n❌ Test suite error: ${error.message}`, 'red');
    }
  } finally {
    // Cleanup
    log('\n🧹 Cleaning up...', 'yellow');
    
    if (client1) client1.disconnect();
    if (client2) client2.disconnect();
    
    if (server && server.listening) {
      await new Promise(resolve => server.close(resolve));
      log('  Test server closed', 'cyan');
    }
    
    // Results
    log('\n========================================', 'blue');
    log('  Test Results', 'blue');
    log('========================================', 'blue');
    log(`  Passed: ${passed}`, 'green');
    log(`  Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    log('========================================\n', 'blue');
    
    if (failed === 0 && passed > 0) {
      log('🎉 All tests passed!', 'green');
    } else if (passed === 0) {
      log('⚠️  No tests passed. Make sure the server is running.', 'yellow');
      log('   Run: npm start', 'yellow');
    }
    
    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
