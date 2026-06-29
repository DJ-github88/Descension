/**
 * CI-Runnable Integration Tests
 * 
 * Replaces the manual tests/integration-test.js script.
 * Runs in Mocha/Chai and starts/stops the real server programmatically.
 */

const { expect } = require('chai');
const io = require('socket.io-client');
const axios = require('axios');

const TEST_PORT = 3099;
const TEST_URL = `http://localhost:${TEST_PORT}`;

describe('Mythrill VTT Integration Tests (CI-runnable)', function () {
  this.timeout(15000);

  let serverInstance = null;
  let client1 = null;
  let client2 = null;

  before(async () => {
    // 1. Clear local module cache to force re-evaluation of all server modules
    Object.keys(require.cache).forEach((key) => {
      if (key.includes('server') && !key.includes('node_modules')) {
        delete require.cache[key];
      }
    });

    // 2. Require and manually override service methods after cache clearing
    const firebaseService = require('../services/firebaseService');
    const tierService = require('../services/tierService');

    firebaseService.verifyIdToken = async (token) => {
      if (token === 'valid-test-token') {
        return { uid: 'test-user-123', email: 'test-user@mythrill.com' };
      }
      return null;
    };

    tierService.canCreateRoom = async () => ({ 
      allowed: true, 
      limits: { roomLimit: 5, characterLimit: 15, maxPlayersPerRoom: 6 } 
    });

    tierService.canJoinRoom = async () => ({ 
      allowed: true, 
      effectiveMax: 6 
    });

    // Start server programmatically on test port
    process.env.PORT = TEST_PORT;
    
    const serverModule = require('../server.js');
    serverInstance = serverModule.server;

    // Wait until server starts listening
    if (!serverInstance.listening) {
      await new Promise((resolve) => {
        serverInstance.once('listening', resolve);
      });
    }
  });

  after(async () => {
    // Disconnect clients
    if (client1 && client1.connected) client1.disconnect();
    if (client2 && client2.connected) client2.disconnect();

    // Close server
    if (serverInstance && serverInstance.listening) {
      await new Promise((resolve) => {
        serverInstance.close(resolve);
      });
    }
  });

  it('verifies socket connection and ping/pong', async () => {
    client1 = io(TEST_URL, {
      transports: ['websocket'],
      forceNew: true,
      auth: { token: 'valid-test-token' }
    });

    await new Promise((resolve, reject) => {
      client1.on('connect', resolve);
      client1.on('connect_error', (err) => reject(new Error(`Connection error: ${err.message}`)));
    });

    expect(client1.connected).to.be.true;

    // Emit ping and wait for pong event
    const pongData = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Ping timeout')), 3000);
      client1.once('pong', (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
      client1.emit('ping');
    });

    expect(pongData).to.exist;
    expect(pongData.timestamp).to.be.a('number');
  });

  it('verifies HTTP /health endpoint', async () => {
    const res = await axios.get(`${TEST_URL}/health`);
    expect(res.status).to.equal(200);
    expect(res.data.status).to.equal('ok');
  });

  it('verifies Room Creation and Join flow', async () => {
    let roomId = null;

    const roomCreated = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Room creation timeout')), 5000);
      client1.once('room_created', (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
      client1.once('room_error', (err) => {
        clearTimeout(timeout);
        reject(new Error(err.error));
      });
    });

    client1.emit('create_room', {
      roomName: 'Tavern Brawl',
      gmName: 'GM Bob',
      password: '',
      playerColor: '#d4af37'
    });

    const data = await roomCreated;
    expect(data.room).to.exist;
    expect(data.room.name).to.equal('Tavern Brawl');
    expect(data.room.gm.name).to.equal('GM Bob');
    
    roomId = data.room.id;

    // Test API room list endpoint
    const res = await axios.get(`${TEST_URL}/api/rooms`);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');

    // Chat system verification
    const chatReceived = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Chat timeout')), 5000);
      client1.once('chat_message', (chat) => {
        clearTimeout(timeout);
        resolve(chat);
      });
    });

    client1.emit('chat_message', {
      roomId,
      message: 'Hello VTT!',
      type: 'chat'
    });

    const chat = await chatReceived;
    expect(chat.content).to.equal('Hello VTT!');

    // Multi-client connection and join
    client2 = io(TEST_URL, {
      transports: ['websocket'],
      forceNew: true,
      auth: { token: 'valid-test-token' }
    });

    await new Promise((resolve) => client2.on('connect', resolve));
    expect(client2.connected).to.be.true;

    // Client 2 join room
    const client2Joined = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Client 2 join timeout')), 5000);
      client2.once('room_joined', (res) => {
        clearTimeout(timeout);
        resolve(res);
      });
    });

    client2.emit('join_room', {
      roomId,
      playerName: 'Legolas',
      password: '',
      playerColor: '#00ff00'
    });

    const joinData = await client2Joined;
    expect(joinData.room.id).to.equal(roomId);

    // Client 2 leave room
    client2.emit('leave_room');
    await new Promise((resolve) => setTimeout(resolve, 300));
    client2.disconnect();

    // Client 1 leave room
    client1.emit('leave_room');
    await new Promise((resolve) => setTimeout(resolve, 300));
    client1.disconnect();
  });
});
