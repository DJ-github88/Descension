const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const { io } = require('socket.io-client');

const SERVER_PORT = 3015;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
const TEST_TIMEOUT_MS = 10000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForHealth(url, timeoutMs = 20000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const probe = () => {
      const req = http.get(`${url}/health`, (res) => {
        if (res.statusCode === 200) {
          res.resume();
          resolve();
          return;
        }
        res.resume();
        retry();
      });

      req.on('error', retry);

      function retry() {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for server health at ${url}/health`));
          return;
        }
        setTimeout(probe, 300);
      }
    };

    probe();
  });
}

function onceWithTimeout(socket, eventName, timeoutMs = TEST_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(eventName, handler);
      reject(new Error(`Timeout waiting for socket event: ${eventName}`));
    }, timeoutMs);

    const handler = (payload) => {
      clearTimeout(timer);
      resolve(payload);
    };

    socket.once(eventName, handler);
  });
}

function connectClient(name) {
  return new Promise((resolve, reject) => {
    const socket = io(SERVER_URL, {
      transports: ['websocket'],
      timeout: TEST_TIMEOUT_MS
    });

    const timer = setTimeout(() => {
      socket.disconnect();
      reject(new Error(`Timeout connecting client: ${name}`));
    }, TEST_TIMEOUT_MS);

    socket.once('connect', () => {
      clearTimeout(timer);
      resolve(socket);
    });

    socket.once('connect_error', (err) => {
      clearTimeout(timer);
      reject(new Error(`Connect error for ${name}: ${err.message}`));
    });
  });
}

async function run() {
  const serverProcess = spawn('node', [path.resolve(__dirname, '../server/server.js')], {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: String(SERVER_PORT)
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (chunk) => process.stdout.write(`[server] ${chunk}`));
  serverProcess.stderr.on('data', (chunk) => process.stderr.write(`[server:err] ${chunk}`));

  let gm;
  let playerA;
  let playerB;

  try {
    await waitForHealth(SERVER_URL);
    console.log('✅ Server is healthy');

    gm = await connectClient('GM');
    playerA = await connectClient('PlayerA');
    playerB = await connectClient('PlayerB');
    console.log('✅ Clients connected');

    const roomName = `Chat Verify ${Date.now()}`;
    const roomPassword = 'pw123';

    const gmRoomJoinedPromise = onceWithTimeout(gm, 'room_joined');
    gm.emit('create_room', {
      roomName,
      gmName: 'GM',
      password: roomPassword,
      playerColor: '#d4af37'
    });
    const gmJoined = await gmRoomJoinedPromise;
    const roomId = gmJoined.room.id;
    const gmId = gmJoined.player.id;
    console.log(`✅ GM created room ${roomId}`);

    const aRoomJoinedPromise = onceWithTimeout(playerA, 'room_joined');
    playerA.emit('join_room', {
      roomId,
      playerName: 'PlayerA',
      password: roomPassword,
      playerColor: '#4a90e2'
    });
    const aJoined = await aRoomJoinedPromise;
    const playerAId = aJoined.player.id;
    console.log(`✅ PlayerA joined as ${playerAId}`);

    const bRoomJoinedPromise = onceWithTimeout(playerB, 'room_joined');
    playerB.emit('join_room', {
      roomId,
      playerName: 'PlayerB',
      password: roomPassword,
      playerColor: '#7bc96f'
    });
    const bJoined = await bRoomJoinedPromise;
    const playerBId = bJoined.player.id;
    console.log(`✅ PlayerB joined as ${playerBId}`);

    await sleep(250);

    // Scenario 1: GM -> PlayerA whisper
    const gmSentAckPromise = onceWithTimeout(gm, 'whisper_sent');
    const aReceivedWhisperPromise = onceWithTimeout(playerA, 'whisper_received');
    gm.emit('whisper_message', {
      recipientId: playerAId,
      senderId: gmId,
      senderName: 'GM',
      content: 'gm_to_playerA'
    });

    const [gmSentAck, aWhisperIn] = await Promise.all([gmSentAckPromise, aReceivedWhisperPromise]);
    if (gmSentAck.content !== 'gm_to_playerA' || aWhisperIn.content !== 'gm_to_playerA') {
      throw new Error('Scenario 1 failed: GM->PlayerA whisper payload mismatch');
    }
    console.log('✅ Scenario 1 passed: GM -> PlayerA whisper delivered');

    // Scenario 2: PlayerA -> GM whisper
    const aSentAckPromise = onceWithTimeout(playerA, 'whisper_sent');
    const gmReceivedWhisperPromise = onceWithTimeout(gm, 'whisper_received');
    playerA.emit('whisper_message', {
      recipientId: gmId,
      senderId: playerAId,
      senderName: 'PlayerA',
      content: 'playerA_to_gm'
    });

    const [aSentAck, gmWhisperIn] = await Promise.all([aSentAckPromise, gmReceivedWhisperPromise]);
    if (aSentAck.content !== 'playerA_to_gm' || gmWhisperIn.content !== 'playerA_to_gm') {
      throw new Error('Scenario 2 failed: PlayerA->GM whisper payload mismatch');
    }
    console.log('✅ Scenario 2 passed: PlayerA -> GM whisper delivered');

    // Scenario 3: Party chat from PlayerA visible to peers (using new "chat" type for compatibility)
    const gmPartyPromise = onceWithTimeout(gm, 'chat_message');
    const bPartyPromise = onceWithTimeout(playerB, 'chat_message');

    playerA.emit('chat_message', {
      id: `msg_${Date.now()}_3`,
      messageId: `msg_${Date.now()}_party_3`,
      senderId: playerAId,
      senderName: 'PlayerA',
      content: 'party_from_playerA_compat',
      type: 'chat',
      channel: 'party'
    });

    const [gmPartyMsg, bPartyMsg] = await Promise.all([gmPartyPromise, bPartyPromise]);
    if (gmPartyMsg.content !== 'party_from_playerA_compat' || gmPartyMsg.type !== 'party') {
      throw new Error(`Scenario 3 failed: party message (compat) mismatch. Received type: ${gmPartyMsg.type}`);
    }
    console.log('✅ Scenario 3 passed: party message (compat) delivered to peers and mapped to "party" type');

    await sleep(250);

    // Scenario 4: Party chat from PlayerB without MUST-BE-ONE-OF types (testing fallback/omission)
    const gmPartyPromise4 = onceWithTimeout(gm, 'chat_message');
    const aPartyPromise4 = onceWithTimeout(playerA, 'chat_message');

    playerB.emit('chat_message', {
      id: `msg_${Date.now()}_4`,
      messageId: `msg_${Date.now()}_party_4`,
      senderId: playerBId,
      senderName: 'PlayerB',
      content: 'party_from_playerB_notype'
      // type omitted entirely
    });

    const [gmPartyMsg4, aPartyMsg4] = await Promise.all([gmPartyPromise4, aPartyPromise4]);
    if (gmPartyMsg4.content !== 'party_from_playerB_notype' || gmPartyMsg4.type !== 'party') {
      throw new Error(`Scenario 4 failed: party message (no-type) mismatch. Received type: ${gmPartyMsg4.type}`);
    }
    console.log('✅ Scenario 4 passed: party message (no-type) delivered and default-routed correctly');

    console.log('\n🎉 Chat routing verification passed:');
    console.log('   - GM -> Player whisper: PASS');
    console.log('   - Player -> GM whisper: PASS');
    console.log('   - Party chat (compat mode): PASS');
    console.log('   - Party chat (no-type mode): PASS');
    console.log('   - Sender-side party visibility remains a client optimistic-append concern.');
  } finally {
    try { gm && gm.disconnect(); } catch (e) { }
    try { playerA && playerA.disconnect(); } catch (e) { }
    try { playerB && playerB.disconnect(); } catch (e) { }

    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill('SIGTERM');
      await sleep(400);
      if (!serverProcess.killed) {
        serverProcess.kill('SIGKILL');
      }
    }
  }
}

run().catch((error) => {
  console.error('❌ Chat routing verification failed:', error.message);
  process.exit(1);
});
