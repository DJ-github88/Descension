const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Firebase service for persistence
const firebaseService = require('./services/firebaseService');

const app = express();
const server = http.createServer(app);

// Configure CORS origins
const allowedOrigins = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT
  ? [
      "https://windtunnel.netlify.app",
      "https://your-custom-domain.com"
    ]
  : [
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ];

console.log('CORS Origins:', allowedOrigins);
console.log('Environment:', process.env.NODE_ENV);
console.log('Railway Environment:', process.env.RAILWAY_ENVIRONMENT);

// Configure CORS for Socket.io with more permissive settings
const io = socketIo(server, {
  cors: {
    origin: "*", // Temporarily allow all origins for debugging
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  },
  allowEIO3: true // Allow Engine.IO v3 clients
});

// Middleware
app.use(cors({
  origin: "*", // Temporarily allow all origins for debugging
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: allowedOrigins
  });
});

// List public rooms endpoint
app.get('/rooms', (req, res) => {
  res.json(getPublicRooms());
});

// Hybrid room system - in-memory for active sessions + Firebase for persistence
const rooms = new Map(); // roomId -> { id, name, players, gm, settings, chatHistory }
const players = new Map(); // socketId -> { id, name, roomId, isGM }

console.log('Mythrill VTT Server - Hybrid room system initialized');

// Load persistent rooms from Firebase on startup
const loadPersistentRooms = async () => {
  try {
    const persistentRooms = await firebaseService.loadPersistentRooms();
    for (const roomData of persistentRooms) {
      // Mark as inactive since no one is connected yet
      roomData.isActive = false;
      rooms.set(roomData.id, roomData);
      console.log(`📂 Loaded persistent room: ${roomData.name} (${roomData.id})`);
    }
    console.log(`✅ Loaded ${persistentRooms.length} persistent rooms`);
  } catch (error) {
    console.error('❌ Error loading persistent rooms:', error);
  }
};

// Initialize persistent rooms
loadPersistentRooms();

// Room management functions
async function createRoom(roomName, gmName, gmSocketId, password, persistToFirebase = true) {
  const roomId = uuidv4();
  const gmPlayerId = uuidv4();

  const room = {
    id: roomId,
    name: roomName,
    password: password, // Store the password
    gm: {
      id: gmPlayerId,
      name: gmName,
      socketId: gmSocketId
    },
    players: new Map(),
    settings: {
      maxPlayers: 6,
      isPrivate: true, // All rooms are now private with passwords
      allowSpectators: true
    },
    chatHistory: [],
    gameState: {
      // This will hold synchronized game data
      characters: {},
      combat: {
        isActive: false,
        currentTurn: null,
        turnOrder: [],
        round: 0
      },
      mapData: {
        backgrounds: [],
        activeBackgroundId: null,
        cameraPosition: { x: 0, y: 0 },
        zoomLevel: 1.0
      },
      tokens: {},
      fogOfWar: {}
    },
    createdAt: new Date(),
    isActive: true, // Mark as active when created
    lastActivity: new Date()
  };

  rooms.set(roomId, room);
  // Don't automatically add GM to players map - let the join process handle it

  // Persist to Firebase if enabled
  if (persistToFirebase) {
    try {
      await firebaseService.saveRoomData(roomId, room);
      await firebaseService.setRoomActiveStatus(roomId, true);
      console.log(`💾 Room persisted to Firebase: ${roomName} (${roomId})`);
    } catch (error) {
      console.error('❌ Failed to persist room to Firebase:', error);
    }
  }

  console.log(`Room created: ${room.name} (${room.id}) - Total rooms: ${rooms.size}`);
  return room;
}

function joinRoom(roomId, playerName, socketId, password) {
  console.log('joinRoom called with:', { roomId, playerName, socketId });
  const room = rooms.get(roomId);

  if (!room) {
    console.log('Room not found:', roomId, 'Available rooms:', Array.from(rooms.keys()));
    return null;
  }

  console.log('Room found:', room.name, 'Checking password...');

  // Check password
  if (room.password !== password) {
    console.log('Password mismatch. Expected:', room.password, 'Received:', password);
    return { error: 'Incorrect password' };
  }

  // Check if this is the GM joining their own room
  if (room.gm.name === playerName) {
    console.log('GM joining their own room:', room.name);
    room.isActive = true;
    room.gmDisconnectedAt = null;
    players.set(socketId, {
      id: room.gm.id,
      name: playerName,
      roomId: roomId,
      isGM: true
    });
    return { room, player: room.gm, isGMReconnect: true };
  }

  if (room.players.size >= room.settings.maxPlayers) {
    console.log('Room is full:', room.players.size, '>=', room.settings.maxPlayers);
    return { error: 'Room is full' };
  }
  
  const playerId = uuidv4();
  const player = {
    id: playerId,
    name: playerName,
    socketId: socketId,
    isGM: false,
    joinedAt: new Date()
  };
  
  room.players.set(playerId, player);
  players.set(socketId, {
    id: playerId,
    name: playerName,
    roomId: roomId,
    isGM: false
  });

  console.log(`Player ${playerName} joined room: ${room.name} - Room players: ${room.players.size + 1}`);
  return { room, player };
}

function leaveRoom(socketId) {
  const player = players.get(socketId);
  if (!player) return null;

  const room = rooms.get(player.roomId);
  if (!room) return null;

  if (player.isGM) {
    // GM left - mark room as temporarily inactive but don't delete it immediately
    // This allows the GM to reconnect without losing the room
    console.log(`GM temporarily left room: ${room.name} (${room.id})`);
    room.isActive = false;
    room.gmDisconnectedAt = Date.now();
    players.delete(socketId);

    // Set a timeout to close the room if GM doesn't reconnect within 5 minutes
    setTimeout(() => {
      const currentRoom = rooms.get(player.roomId);
      if (currentRoom && !currentRoom.isActive && currentRoom.gmDisconnectedAt === room.gmDisconnectedAt) {
        console.log(`GM didn't reconnect, closing room: ${currentRoom.name} (${currentRoom.id})`);
        rooms.delete(player.roomId);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return { type: 'gm_disconnected', room };
  } else {
    // Regular player left
    console.log(`Player ${player.name} left room: ${room.name}`);
    room.players.delete(player.id);
    players.delete(socketId);
    return { type: 'player_left', room, player };
  }
}

// Helper function to get available room list
function getPublicRooms() {
  return Array.from(rooms.values())
    .filter(room => {
      // Show active rooms and rooms where GM is temporarily disconnected (but not permanently closed)
      return room.isActive !== false || (room.isActive === false && room.gmDisconnectedAt);
    })
    .map(room => ({
      id: room.id,
      name: room.name,
      playerCount: room.players.size + 1, // +1 for GM
      maxPlayers: room.settings.maxPlayers + 1,
      gm: room.gm.name,
      createdAt: room.createdAt,
      hasPassword: true, // All rooms now have passwords
      gmOnline: room.isActive !== false // Indicate if GM is currently online
    }));
}

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/rooms', (req, res) => {
  res.json(getPublicRooms());
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Create a new room
  socket.on('create_room', async (data) => {
    console.log('🎮 Received create_room request:', data);
    const { roomName, gmName, password } = data;

    if (!roomName || !gmName || !password) {
      console.log('❌ Missing required fields:', { roomName, gmName, password });
      socket.emit('error', { message: 'Room name, GM name, and password are required' });
      return;
    }

    try {
      const room = await createRoom(roomName, gmName, socket.id, password);
      socket.join(room.id);

      console.log('Room created successfully:', room.id, 'Total rooms:', rooms.size);

      socket.emit('room_created', {
        room: {
          id: room.id,
          name: room.name,
          gm: room.gm,
          players: Array.from(room.players.values()),
          settings: room.settings
        }
      });
    } catch (error) {
      console.error('Error creating room:', error);
      socket.emit('error', { message: 'Failed to create room' });
    }

    // Broadcast room list update to all connected clients
    const publicRooms = getPublicRooms();
    console.log('Broadcasting room list update:', publicRooms);
    io.emit('room_list_updated', publicRooms);
  });
  
  // Join an existing room
  socket.on('join_room', (data) => {
    console.log('🚪 Received join_room request:', data);
    const { roomId, playerName, password } = data;

    if (!roomId || !playerName || !password) {
      console.log('❌ Missing required fields for join:', { roomId, playerName, password });
      socket.emit('error', { message: 'Room ID, player name, and password are required' });
      return;
    }

    console.log('Attempting to join room:', roomId, 'Total rooms available:', rooms.size);
    console.log('Available room IDs:', Array.from(rooms.keys()));

    const result = joinRoom(roomId, playerName, socket.id, password);

    if (!result) {
      console.log('❌ Room not found for join request:', roomId);
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (result.error) {
      console.log('❌ Join room error:', result.error);
      socket.emit('error', { message: result.error });
      return;
    }
    
    const { room, player, isGMReconnect } = result;
    socket.join(roomId);

    if (isGMReconnect) {
      // GM reconnected - notify all players
      socket.emit('room_joined', {
        room: {
          id: room.id,
          name: room.name,
          gm: room.gm,
          players: Array.from(room.players.values()),
          settings: room.settings
        },
        player: player,
        chatHistory: room.chatHistory,
        isGMReconnect: true
      });

      // Notify other players that GM reconnected
      socket.to(roomId).emit('gm_reconnected', {
        message: 'The GM has reconnected!'
      });

      console.log(`GM ${playerName} reconnected to room: ${room.name}`);
    } else {
      // Regular player join
      socket.emit('room_joined', {
        room: {
          id: room.id,
          name: room.name,
          gm: room.gm,
          players: Array.from(room.players.values()),
          settings: room.settings
        },
        player: player,
        chatHistory: room.chatHistory
      });

      // Notify other players in the room
      socket.to(roomId).emit('player_joined', {
        player: player,
        playerCount: room.players.size + 1
      });

      console.log(`${playerName} joined room: ${room.name}`);
    }

    // Broadcast room list update to all connected clients
    io.emit('room_list_updated', getPublicRooms());
  });
  
  // Handle chat messages
  socket.on('chat_message', async (data) => {
    const player = players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const message = {
      id: uuidv4(),
      playerId: player.id,
      playerName: player.name,
      isGM: player.isGM,
      content: data.message,
      timestamp: new Date(),
      type: data.type || 'chat' // 'chat', 'system', 'roll', etc.
    };

    // Store in room history
    room.chatHistory.push(message);

    // Keep only last 100 messages
    if (room.chatHistory.length > 100) {
      room.chatHistory = room.chatHistory.slice(-100);
    }

    // Persist chat message to Firebase
    try {
      await firebaseService.addChatMessage(player.roomId, message);
    } catch (error) {
      console.error('Failed to persist chat message:', error);
    }

    // Broadcast to all players in the room
    io.to(player.roomId).emit('chat_message', message);

    console.log(`Chat message from ${player.name} in room ${room.name}: ${data.message}`);
  });

  // Handle token movement synchronization
  socket.on('token_moved', async (data) => {
    const player = players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Update room game state
    if (!room.gameState.tokens) {
      room.gameState.tokens = {};
    }

    room.gameState.tokens[data.tokenId] = {
      ...room.gameState.tokens[data.tokenId],
      position: data.position,
      lastMovedBy: player.id,
      lastMovedAt: new Date()
    };

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist token movement:', error);
    }

    // Broadcast token movement to all other players in the room
    socket.to(player.roomId).emit('token_moved', {
      tokenId: data.tokenId,
      position: data.position,
      playerId: player.id,
      playerName: player.name,
      timestamp: new Date()
    });

    console.log(`Token ${data.tokenId} moved by ${player.name} to`, data.position);
  });

  // Handle character sheet updates
  socket.on('character_updated', async (data) => {
    const player = players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Update character in room game state
    if (!room.gameState.characters) {
      room.gameState.characters = {};
    }

    room.gameState.characters[data.characterId] = {
      ...data.character,
      lastUpdatedBy: player.id,
      lastUpdatedAt: new Date()
    };

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist character update:', error);
    }

    // Broadcast character update to all players in the room
    io.to(player.roomId).emit('character_updated', {
      characterId: data.characterId,
      character: data.character,
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`Character ${data.characterId} updated by ${player.name}`);
  });

  // Handle map/background changes
  socket.on('map_updated', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can update the map' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Update map data in room game state
    room.gameState.mapData = {
      ...room.gameState.mapData,
      ...data.mapData,
      lastUpdatedBy: player.id,
      lastUpdatedAt: new Date()
    };

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist map update:', error);
    }

    // Broadcast map update to all players in the room
    socket.to(player.roomId).emit('map_updated', {
      mapData: data.mapData,
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`Map updated by GM ${player.name}`);
  });

  // Handle combat state changes
  socket.on('combat_updated', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can update combat state' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Update combat state in room game state
    room.gameState.combat = {
      ...room.gameState.combat,
      ...data.combat,
      lastUpdatedBy: player.id,
      lastUpdatedAt: new Date()
    };

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist combat update:', error);
    }

    // Broadcast combat update to all players in the room
    io.to(player.roomId).emit('combat_updated', {
      combat: data.combat,
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`Combat state updated by GM ${player.name}`);
  });

  // Handle dice roll synchronization
  socket.on('dice_rolled', async (data) => {
    const player = players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const rollData = {
      id: uuidv4(),
      playerId: player.id,
      playerName: player.name,
      isGM: player.isGM,
      dice: data.dice,
      results: data.results,
      total: data.total,
      purpose: data.purpose || 'general',
      timestamp: new Date()
    };

    // Add to chat as a roll message
    const rollMessage = {
      id: uuidv4(),
      playerId: player.id,
      playerName: player.name,
      isGM: player.isGM,
      content: `Rolled ${data.dice.join(', ')}: ${data.results.join(', ')} (Total: ${data.total})`,
      timestamp: new Date(),
      type: 'roll',
      rollData: rollData
    };

    room.chatHistory.push(rollMessage);

    // Keep only last 100 messages
    if (room.chatHistory.length > 100) {
      room.chatHistory = room.chatHistory.slice(-100);
    }

    // Persist chat message to Firebase
    try {
      await firebaseService.addChatMessage(player.roomId, rollMessage);
    } catch (error) {
      console.error('Failed to persist dice roll:', error);
    }

    // Broadcast dice roll to all players in the room
    io.to(player.roomId).emit('dice_rolled', rollData);
    io.to(player.roomId).emit('chat_message', rollMessage);

    console.log(`${player.name} rolled dice: ${data.results.join(', ')} (Total: ${data.total})`);
  });

  // Handle item drops on grid
  socket.on('item_dropped', (data) => {
    const player = players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Broadcast item drop to all players in the room
    io.to(player.roomId).emit('item_dropped', {
      item: data.item,
      position: data.position,
      playerId: player.id,
      playerName: player.name,
      timestamp: new Date()
    });

    console.log(`Item ${data.item.name} dropped by ${player.name} at`, data.position);
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log(`Player disconnected: ${socket.id}`);

    const result = leaveRoom(socket.id);
    if (result) {
      if (result.type === 'room_closed') {
        // Notify all players that room was closed
        io.to(result.room.id).emit('room_closed', {
          message: 'The GM has left. Room is now closed.'
        });

        // Mark room as inactive in Firebase
        try {
          await firebaseService.setRoomActiveStatus(result.room.id, false);
        } catch (error) {
          console.error('Failed to mark room as inactive:', error);
        }

        console.log(`Room closed: ${result.room.name}`);
      } else if (result.type === 'gm_disconnected') {
        // GM temporarily disconnected - notify players but keep room alive
        socket.to(result.room.id).emit('gm_disconnected', {
          message: 'The GM has temporarily disconnected. Waiting for reconnection...'
        });

        console.log(`GM temporarily disconnected from: ${result.room.name}`);
      } else if (result.type === 'player_left') {
        // Notify remaining players
        socket.to(result.room.id).emit('player_left', {
          player: result.player,
          playerCount: result.room.players.size + 1
        });

        // Update room data in Firebase
        try {
          await firebaseService.saveRoomData(result.room.id, result.room);
        } catch (error) {
          console.error('Failed to update room data:', error);
        }
      }

      // Broadcast updated room list
      io.emit('room_list_updated', getPublicRooms());
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Mythrill server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Socket.IO server initialized`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🔒 CORS Origins: ${JSON.stringify(allowedOrigins)}`);
  console.log(`📅 Server started at: ${new Date().toISOString()}`);
});
