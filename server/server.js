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

// Smart Enhanced Services: Initialize but use conditionally
const deltaSync = require('./services/deltaSync');
const EventBatcher = require('./services/eventBatcher');
const optimizedFirebase = require('./services/optimizedFirebase');
const memoryManager = require('./services/memoryManager');
const lagCompensation = require('./services/lagCompensation');
const RealtimeSyncEngine = require('./services/realtimeSync');

// DISABLED: Infrastructure services causing performance issues
// const ErrorHandler = require('./services/errorHandler');
// const PerformanceMonitor = require('./services/performanceMonitor');

const app = express();
const server = http.createServer(app);

// Configure CORS origins
const allowedOrigins = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT
  ? [
      "https://windtunnel.netlify.app",
      "https://mythrill.netlify.app",
      "https://your-custom-domain.com"
    ]
  : [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002"
    ];

console.log('CORS Origins:', allowedOrigins);
console.log('Environment:', process.env.NODE_ENV);
console.log('Railway Environment:', process.env.RAILWAY_ENVIRONMENT);

// Configure CORS for Socket.io with proper origins
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  },
  allowEIO3: true // Allow Engine.IO v3 clients
});

// DISABLED: Enhanced multiplayer services causing lag and socket errors
// const eventBatcher = new EventBatcher(io);
// const realtimeSync = new RealtimeSyncEngine(eventBatcher, deltaSync, optimizedFirebase);

// DISABLED: Infrastructure services causing performance issues
// const errorHandler = new ErrorHandler();
// const performanceMonitor = new PerformanceMonitor();

// Minimal error handling only
const errorHandler = {
  handleError: async (error, context) => {
    console.error('Error:', error.message, context);
    return { message: error.message };
  }
};

// Minimal performance tracking only
const performanceMonitor = {
  trackRequest: () => {}, // No-op
  trackWebSocketEvent: () => {}, // No-op
  getPerformanceSummary: () => ({ status: 'disabled' }),
  getOptimizationRecommendations: () => []
};

// Make minimal services globally available
global.errorHandler = errorHandler;
global.performanceMonitor = performanceMonitor;
// global.memoryManager = memoryManager; // DISABLED

// Initialize enhanced services
const eventBatcher = new EventBatcher(io);
const realtimeSync = new RealtimeSyncEngine(eventBatcher, deltaSync, optimizedFirebase);

console.log('🚀 Smart enhanced multiplayer services initialized (role-aware optimization)');

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Performance tracking middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const success = res.statusCode < 400;
    performanceMonitor.trackRequest(req.path, duration, success);
  });

  next();
});

// DISABLED: Enhanced health check causing 500 errors
// app.get('/health', (req, res) => {
//   try {
//     const performanceSummary = performanceMonitor.getPerformanceSummary();
//     const errorStats = errorHandler.getErrorStats();
//     res.json({
//       status: 'OK',
//       timestamp: new Date().toISOString(),
//       environment: process.env.NODE_ENV || 'development',
//       corsOrigins: allowedOrigins,
//       performance: {
//         cpu: performanceSummary.cpu.latest?.usage || 0,
//         memory: performanceSummary.memory.latest?.systemPercent || 0,
//         eventLoop: performanceSummary.eventLoop.latest?.delay || 0
//       },
//       errors: {
//         total: errorStats.total,
//         byType: errorStats.byType
//       },
//       uptime: process.uptime()
//     });
//   } catch (error) {
//     console.error('Health check error:', error);
//     res.status(500).json({ status: 'ERROR', message: 'Health check failed' });
//   }
// });

// List public rooms endpoint
app.get('/rooms', (req, res) => {
  res.json(getPublicRooms());
});

// Debug endpoint to check room state
app.get('/debug/rooms', (req, res) => {
  const roomsDebug = Array.from(rooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    gm: room.gm,
    playerCount: room.players.size,
    players: Array.from(room.players.values()),
    isActive: room.isActive,
    gmDisconnectedAt: room.gmDisconnectedAt
  }));

  const playersDebug = Array.from(players.entries()).map(([socketId, player]) => ({
    socketId,
    ...player
  }));

  res.json({
    rooms: roomsDebug,
    players: playersDebug,
    totalRooms: rooms.size,
    totalPlayers: players.size
  });
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
async function createRoom(roomName, gmName, gmSocketId, password, playerColor = '#4a90e2', persistToFirebase = true) {
  const roomId = uuidv4();
  const gmPlayerId = uuidv4();

  const room = {
    id: roomId,
    name: roomName,
    password: password, // Store the password
    gm: {
      id: gmPlayerId,
      name: gmName,
      socketId: gmSocketId,
      isGM: true, // Mark GM status
      color: playerColor || '#d4af37' // Gold default for GM
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

  // SMART ENHANCED SERVICES: GM-optimized, player-friendly
  try {
    // Initialize core services for room management
    deltaSync.initializeRoom(roomId, room.gameState);
    eventBatcher.initializeRoom(roomId);

    // Only initialize heavy services for GM optimization
    if (room.gm) {
      realtimeSync.initializeRoom(roomId, room.gameState);
      memoryManager.trackObject(roomId, 'room', room, roomId);
      lagCompensation.initializeClient(gmSocketId, roomId);
      console.log('🎯 Enhanced services initialized for GM optimization');
    }
  } catch (error) {
    console.warn('⚠️ Enhanced services initialization failed, continuing with basic functionality:', error);
  }

  // Add GM to players tracking immediately when room is created
  players.set(gmSocketId, {
    id: gmPlayerId,
    name: gmName,
    roomId: roomId,
    isGM: true,
    color: playerColor
  });

  // DISABLED: Enhanced services causing lag
  // memoryManager.trackPlayerSession(gmSocketId, {
  //   id: gmPlayerId,
  //   name: gmName
  // }, roomId);

  // DISABLED: Optimized Firebase causing performance issues
  // if (persistToFirebase) {
  //   try {
  //     await optimizedFirebase.saveRoomData(roomId, room, 'high');
  //     console.log(`💾 Room persisted to optimized Firebase: ${roomName} (${roomId})`);
  //   } catch (error) {
  //     console.error('❌ Failed to persist room to Firebase:', error);
  //   }
  // }

  console.log(`🚀 Enhanced room created: ${room.name} (${room.id}) - Total rooms: ${rooms.size}`);
  return room;
}

function joinRoom(roomId, playerName, socketId, password, playerColor = '#4a90e2', character = null) {
  console.log('joinRoom called with:', { roomId, playerName, socketId, playerColor, hasCharacter: !!character });
  const room = rooms.get(roomId);

  if (!room) {
    console.log('Room not found:', roomId, 'Available rooms:', Array.from(rooms.keys()));
    return null;
  }

  // Check if room is active (GM hasn't left)
  if (!room.isActive) {
    console.log('Room is inactive (GM has left):', room.name);
    return { error: 'Room is inactive - the GM has left' };
  }

  console.log('Room found:', room.name, 'Checking password...');

  // Check password - handle both empty and non-empty passwords
  const roomPassword = room.password || '';
  const providedPassword = password || '';

  if (roomPassword !== providedPassword) {
    console.log('Password mismatch. Expected:', roomPassword ? '[HIDDEN]' : 'EMPTY', 'Received:', providedPassword ? '[HIDDEN]' : 'EMPTY');
    return { error: 'Incorrect password' };
  }

  // Check if this is the GM joining their own room
  if (room.gm.name === playerName) {
    console.log('GM attempting to join their own room:', room.name);

    // Check if GM is already tracked (they should be from room creation)
    const existingGMPlayer = players.get(socketId);
    if (existingGMPlayer && existingGMPlayer.isGM) {
      console.log('GM already tracked, skipping duplicate join');
      return { room, player: room.gm, isGMReconnect: true };
    }

    room.isActive = true;
    room.gmDisconnectedAt = null;

    // Update the GM's socket ID and color if provided
    room.gm.socketId = socketId;
    if (playerColor) {
      room.gm.color = playerColor; // Update GM color if new one provided
    }
    
    // Update GM's character data if provided
    if (character) {
      room.gm.character = character;
      console.log(`👑 Updated GM character data:`, {
        hasTokenSettings: !!character.tokenSettings,
        hasLore: !!character.lore,
        hasCharacterImage: !!character.lore?.characterImage
      });
    }

    // Only add to players tracking if not already there
    if (!players.has(socketId)) {
      players.set(socketId, {
        id: room.gm.id,
        name: playerName,
        roomId: roomId,
        isGM: true,
        color: room.gm.color || playerColor || '#d4af37'
      });
    } else {
      // Update existing player tracking with latest color
      const existingPlayer = players.get(socketId);
      existingPlayer.color = room.gm.color || playerColor || '#d4af37';
    }
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
    color: playerColor || '#4a90e2', // Ensure color is always set
    joinedAt: new Date(),
    character: character || null // Include character data if provided
  };

  room.players.set(playerId, player);
  players.set(socketId, {
    id: playerId,
    name: playerName,
    roomId: roomId,
    isGM: false,
    color: playerColor || '#4a90e2' // Ensure color is always set
  });

  // DISABLED: Enhanced services causing lag and socket errors
  // try {
  //   lagCompensation.initializeClient(socketId, roomId);
  //   memoryManager.trackPlayerSession(socketId, {
  //     id: playerId,
  //     name: playerName
  //   }, roomId);
  //   if (room.players.size === 1 && !realtimeSync.isRoomInitialized(roomId)) {
  //     realtimeSync.initializeRoom(roomId, room.gameState);
  //   }
  // } catch (error) {
  //   console.warn('⚠️ Enhanced services initialization failed for player, continuing with basic functionality:', error);
  // }

  // Add player to Firebase room members if this is a persistent room
  if (room.persistentRoomId) {
    try {
      // Note: This would require user authentication, but for now we'll handle it differently
      // The client-side should handle Firebase room membership when authenticated
      console.log(`📝 Player ${playerName} should be added to Firebase room ${room.persistentRoomId} members`);
    } catch (error) {
      console.warn('Failed to add player to Firebase room members:', error);
    }
  }

  console.log(`🚀 Enhanced player ${playerName} joined room: ${room.name} - Room players: ${room.players.size + 1}`);
  return { room, player };
}

function leaveRoom(socketId) {
  const player = players.get(socketId);
  if (!player) return null;

  const room = rooms.get(player.roomId);
  if (!room) return null;

  if (player.isGM) {
    // GM left - immediately close the room
    console.log(`GM left room, closing immediately: ${room.name} (${room.id})`);
    room.isActive = false;
    room.gmDisconnectedAt = Date.now();
    players.delete(socketId);

    // Remove the room immediately
    rooms.delete(player.roomId);
    console.log(`Room closed: ${room.name} (${room.id})`);

    return { type: 'room_closed', room };
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
      playerCount: room.players.size + (room.isActive !== false ? 1 : 0), // +1 for GM only if GM is online
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

// Performance metrics endpoint (simplified - enhanced services disabled)
app.get('/metrics', (req, res) => {
  try {
    res.json({
      performance: { status: 'enhanced services disabled for performance' },
      recommendations: [],
      errors: { status: 'basic error handling only' },
      rooms: {
        total: rooms.size,
        active: Array.from(rooms.values()).filter(r => r.isActive).length
      },
      players: {
        total: players.size
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Metrics endpoint error:', error);
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Create a new room with enhanced error handling
  socket.on('create_room', async (data) => {
    const startTime = Date.now();

    try {
      console.log('🎮 Received create_room request:', data);
      const { roomName, gmName, password } = data;

      if (!roomName || !gmName) {
        console.log('❌ Missing required fields:', { roomName, gmName, password: password ? '[HIDDEN]' : 'EMPTY' });
        socket.emit('error', { message: 'Room name and GM name are required' });
        return;
      }

      const room = await createRoom(roomName, gmName, socket.id, password, data.playerColor);
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

      // Broadcast room list update to all connected clients
      const publicRooms = getPublicRooms();
      console.log('Broadcasting room list update:', publicRooms);
      io.emit('room_list_updated', publicRooms);

      // Auto-invite party members if provided
      if (data.partyMembers && Array.isArray(data.partyMembers) && data.partyMembers.length > 0) {
        console.log('🎉 Auto-inviting party members to room:', data.partyMembers.map(m => m.name));

        // Send invitations to each party member
        data.partyMembers.forEach(member => {
          // Find the online user by character name
          const targetUser = Array.from(onlineUsers.values()).find(
            u => u.characterName === member.name
          );

          if (targetUser) {
            const inviteId = uuidv4();
            const invitation = {
              id: inviteId,
              roomId: room.id,
              roomName: room.name,
              gmName: gmName,
              gmUserId: room.gm.id,
              expiresAt: Date.now() + 60000 // 1 minute
            };

            // Send invitation to target user
            io.to(targetUser.socketId).emit('room_invitation', invitation);
            console.log('📨 Party auto-invite sent:', gmName, '->', member.name, 'for room:', room.name);
          } else {
            console.log('⚠️ Party member not online:', member.name);
          }
        });
      }

      // Performance tracking disabled

    } catch (error) {
      console.error('Error creating room:', error);

      // Basic error handling only
      console.error('Create room error details:', error);

      socket.emit('error', {
        message: 'Failed to create room',
        details: error.message || 'Unknown error'
      });

      // Performance tracking disabled
    }
  });
  
  // Join an existing room
  socket.on('join_room', (data) => {
    console.log('🚪 Received join_room request:', data);
    const { roomId, playerName, password, character } = data;

    // Enhanced parameter validation with detailed logging
    if (!roomId || !playerName) {
      console.log('❌ Missing required fields for join:', {
        roomId: roomId || 'MISSING',
        playerName: playerName || 'MISSING',
        password: password ? '[HIDDEN]' : 'EMPTY',
        socketId: socket.id
      });
      socket.emit('error', { message: 'Room ID and player name are required' });
      return;
    }

    // Additional validation for empty strings
    if (!roomId.trim() || !playerName.trim()) {
      console.log('❌ Empty required fields for join:', {
        roomId: roomId.trim() || 'EMPTY',
        playerName: playerName.trim() || 'EMPTY',
        password: password && password.trim() ? '[HIDDEN]' : 'EMPTY',
        socketId: socket.id
      });
      socket.emit('error', { message: 'Room ID and player name cannot be empty' });
      return;
    }

    console.log('Attempting to join room:', roomId, 'Total rooms available:', rooms.size);
    console.log('Available room IDs:', Array.from(rooms.keys()));

    const result = joinRoom(roomId, playerName, socket.id, password, data.playerColor, character);

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

      // Notify ALL players in the room (including the one who just joined)
      console.log(`📢 Broadcasting player_joined event to room ${roomId} for player:`, player.name);
      console.log(`📢 Current players in room before broadcast:`, Array.from(room.players.values()).map(p => p.name));

      // Calculate accurate player count: GM + regular players
      const totalPlayerCount = room.players.size + 1; // +1 for GM

      // Broadcast to ALL players in the room (including the new player)
      // Include full character data in the broadcast
      io.to(roomId).emit('player_joined', {
        player: {
          ...player,
          character: player.character || null // Ensure character data is included
        },
        playerCount: totalPlayerCount,
        playerName: player.name
      });
      
      // Log character data for debugging
      console.log(`📤 Broadcasting player_joined for ${player.name}:`, {
        hasCharacter: !!player.character,
        hasTokenSettings: !!player.character?.tokenSettings,
        hasLore: !!player.character?.lore,
        hasCharacterImage: !!player.character?.lore?.characterImage
      });

      // Also send a separate player count update to ensure all clients have the correct count
      io.to(roomId).emit('player_count_updated', {
        playerCount: totalPlayerCount
      });

      console.log(`✅ ${playerName} joined room: ${room.name} (Total players: ${totalPlayerCount})`);
    }

    // Send current grid items to the newly joined player
    if (room.gameState.gridItems && Object.keys(room.gameState.gridItems).length > 0) {
      console.log(`📦 Sending ${Object.keys(room.gameState.gridItems).length} grid items to ${playerName}`);
      socket.emit('sync_grid_items', {
        gridItems: room.gameState.gridItems
      });
    }

    // Send current tokens to the newly joined player
    if (room.gameState.tokens && Object.keys(room.gameState.tokens).length > 0) {
      console.log(`🎭 Sending ${Object.keys(room.gameState.tokens).length} tokens to ${playerName}`);
      socket.emit('sync_tokens', {
        tokens: room.gameState.tokens
      });
    }

    // Send current character tokens to the newly joined player
    if (room.gameState.characterTokens && Object.keys(room.gameState.characterTokens).length > 0) {
      console.log(`🎭 Sending ${Object.keys(room.gameState.characterTokens).length} character tokens to ${playerName}`);
      socket.emit('sync_character_tokens', {
        characterTokens: room.gameState.characterTokens
      });
    }

    // Send map data (terrain, fog, walls, etc.) to the newly joined player
    if (room.gameState.mapData && Object.keys(room.gameState.mapData).length > 0) {
      console.log(`🗺️ Sending map data to ${playerName}`);
      socket.emit('map_updated', {
        mapData: {
          ...room.gameState.mapData,
          fogOfWar: room.gameState.fogOfWar,
          fogOfWarPaths: room.gameState.mapData?.fogOfWarPaths,
          fogErasePaths: room.gameState.mapData?.fogErasePaths,
          terrainData: room.gameState.mapData?.terrainData,
          wallData: room.gameState.mapData?.wallData,
          drawingLayers: room.gameState.mapData?.drawingLayers,
          drawingPaths: room.gameState.mapData?.drawingPaths,
          exploredAreas: room.gameState.mapData?.exploredAreas || {} // CRITICAL FIX: Include explored areas for fog memory
        },
        updatedBy: room.gm.id,
        updatedByName: room.gm.name,
        timestamp: new Date()
      });
    }

    // Removed: Duplicate token syncing code

    // Broadcast room list update to all connected clients
    io.emit('room_list_updated', getPublicRooms());
  });
  
  // Handle chat messages
  socket.on('chat_message', async (data) => {
    console.log('💬 Received chat message:', data, 'from socket:', socket.id);
    const player = players.get(socket.id);
    if (!player) {
      console.log('❌ Chat message from player not in room');
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      console.log('❌ Chat message but room not found');
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    console.log('💬 Processing chat message from', player.name, 'in room', room.name);

    // Get player color with improved lookup logic
    let playerColor = player.color || '#4a90e2'; // Use color from players tracking first

    if (player.isGM) {
      // For GM, use the color from room.gm or fallback to player tracking
      playerColor = room.gm.color || player.color || '#d4af37'; // Gold default for GM
      console.log('💬 Using GM color:', playerColor);
    } else {
      // For regular players, check room.players Map for most up-to-date color
      const roomPlayer = room.players.get(player.id);
      if (roomPlayer && roomPlayer.color) {
        playerColor = roomPlayer.color;
        console.log('💬 Using room player color:', playerColor, 'for player:', player.name);
      } else {
        console.log('💬 Using tracked player color:', playerColor, 'for player:', player.name);
      }
    }

    const message = {
      id: uuidv4(),
      playerId: player.id,
      playerName: player.name,
      playerColor: playerColor,
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
    console.log(`📢 Broadcasting chat message to room ${player.roomId}:`, message.content);
    io.to(player.roomId).emit('chat_message', message);

    console.log(`✅ Chat message from ${player.name} in room ${room.name}: ${data.message}`);
  });

  // Handle dialogue messages
  socket.on('dialogue_message', async (data) => {
    console.log('🎭 Received dialogue message:', data, 'from socket:', socket.id);
    const player = players.get(socket.id);
    if (!player) {
      console.log('❌ Dialogue message from player not in room');
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      console.log('❌ Dialogue message but room not found');
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Enhance dialogue data with player information
    const enhancedDialogueData = {
      ...data.dialogueData,
      playerId: player.id,
      playerName: player.name,
      isGM: player.isGM,
      timestamp: new Date().toISOString()
    };

    // Broadcast to all players in the room
    console.log(`🎭 Broadcasting dialogue message to room ${player.roomId} from ${player.name}`);
    io.to(player.roomId).emit('dialogue_message', {
      dialogueData: enhancedDialogueData,
      type: 'dialogue'
    });

    console.log(`✅ Dialogue message from ${player.name} in room ${room.name}`);
  });

  // Smart token movement with role-aware optimization
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

    // Only apply enhanced services for GMs to prevent player lag
    let inputResult = null;
    if (player.isGM) {
      // Update player activity for memory management (GM only)
      memoryManager.updatePlayerActivity(socket.id);

      // Process input with lag compensation (GM only)
      inputResult = lagCompensation.processClientInput(socket.id, {
        type: 'token_move',
        data: data,
        timestamp: Date.now()
      });
    }

    // Initialize tokens if needed
    if (!room.gameState.tokens) {
      room.gameState.tokens = {};
    }

    // Find token by either tokenId or creatureId for backward compatibility
    let tokenKey = data.tokenId;
    let existingToken = room.gameState.tokens[tokenKey];

    if (!existingToken) {
      // Try to find by creatureId if direct lookup failed
      tokenKey = Object.keys(room.gameState.tokens).find(key =>
        room.gameState.tokens[key].creatureId === data.tokenId
      );
      existingToken = tokenKey ? room.gameState.tokens[tokenKey] : null;
    }

    if (existingToken) {
      // Update existing token with enhanced data
      const updatedToken = {
        ...existingToken,
        position: data.position,
        lastMovedBy: player.id,
        lastMovedByName: player.name,
        lastMovedAt: new Date(),
        velocity: data.velocity || null, // For prediction
        sequence: inputResult?.sequence || 0
      };

      room.gameState.tokens[tokenKey] = updatedToken;

      // Create delta update for efficient synchronization (GM optimization only)
      let deltaUpdate = null;
      if (player.isGM) {
        deltaUpdate = await deltaSync.createStateUpdate(
          player.roomId,
          room.gameState,
          {
            type: 'token_movement',
            tokenId: tokenKey,
            playerId: player.id,
            isDragging: data.isDragging
          }
        );
      }

      // Enhanced throttling with conflict detection
      const broadcastKey = `${player.roomId}_${tokenKey}`;
      const now = Date.now();
      if (!global.lastTokenBroadcast) global.lastTokenBroadcast = new Map();
      if (!global.tokenMovementConflicts) global.tokenMovementConflicts = new Map();

      const lastBroadcast = global.lastTokenBroadcast.get(broadcastKey) || 0;
      const throttleTime = data.isDragging ? 33 : 100; // Increased to ~30fps for dragging, ~10fps for final positions

      // Check for potential conflicts (multiple rapid movements)
      const conflictKey = `${tokenKey}_${player.id}`;
      const lastMovement = global.tokenMovementConflicts.get(conflictKey) || 0;

      if (now - lastMovement < 50) {
        console.log(`🚫 Potential movement conflict detected for token ${tokenKey} by player ${player.name}`);
        // Still process but don't broadcast immediately
        return;
      }

      global.tokenMovementConflicts.set(conflictKey, now);

      if (now - lastBroadcast > throttleTime) {
        global.lastTokenBroadcast.set(broadcastKey, now);

        // Send token movement with optimized data for players
        const tokenMoveData = {
          tokenId: tokenKey,
          creatureId: existingToken.creatureId,
          position: data.position,
          playerId: player.id,
          playerName: player.name,
          isDragging: data.isDragging || false,
          serverTimestamp: now
        };

        // Add enhanced data only for GM optimization
        if (player.isGM && inputResult) {
          tokenMoveData.velocity = data.velocity;
          tokenMoveData.sequence = inputResult.sequence;
        }

        // Broadcast to room (includes sender since they're in the room)
        // NOTE: io.to() already includes the sender, so no need for duplicate socket.emit()
        io.to(player.roomId).emit('token_moved', tokenMoveData);
      }

      // DISABLED: Optimized Firebase causing performance issues
      // if (!data.isDragging) {
      //   try {
      //     await optimizedFirebase.updateGameState(player.roomId, room.gameState, deltaUpdate?.delta);
      //     // Token position persisted (log removed for performance)
      //   } catch (error) {
      //     console.error('Failed to persist token position:', error);
      //   }
      // }

      // Token movement processed successfully
    } else {
      console.warn(`⚠️ Token ${data.tokenId} not found in room ${room.name} for movement`);
      socket.emit('error', { message: 'Token not found' });
    }
  });

  // Handle character movement synchronization
  socket.on('character_moved', async (data) => {
    try {
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

      // Validate data
      if (!data || !data.position || typeof data.position.x !== 'number' || typeof data.position.y !== 'number') {
        console.error('Invalid character movement data:', data);
        socket.emit('error', { message: 'Invalid movement data' });
        return;
      }

      // Initialize character tokens if needed
      if (!room.gameState.characterTokens) {
        room.gameState.characterTokens = {};
      }

      // Update character token position in room state
      if (room.gameState.characterTokens[player.id]) {
        room.gameState.characterTokens[player.id].position = data.position;
        room.gameState.characterTokens[player.id].lastMovedAt = new Date();
        room.gameState.characterTokens[player.id].lastMovedBy = player.id;
      }

      // Persist to Firebase for final positions (not during dragging)
      if (!data.isDragging) {
        try {
          await firebaseService.updateRoomGameState(player.roomId, room.gameState);
        } catch (error) {
          console.error('Failed to persist character token movement:', error);
        }
      }

      // Throttle character movement broadcasts to prevent player lag (more aggressive)
      const broadcastKey = `${player.roomId}_character_${player.id}`;
      const now = Date.now();
      if (!global.lastCharacterBroadcast) global.lastCharacterBroadcast = new Map();
      const lastBroadcast = global.lastCharacterBroadcast.get(broadcastKey) || 0;
      const throttleTime = data.isDragging ? 50 : 16; // Faster updates: ~20fps for dragging, immediate for final positions

      if (now - lastBroadcast > throttleTime || !data.isDragging) {
        global.lastCharacterBroadcast.set(broadcastKey, now);

        // Broadcast character movement to ALL players in the room (including mover for confirmation)
        const movementData = {
          position: data.position,
          playerId: player.id,
          playerName: player.name,
          isDragging: data.isDragging || false,
          timestamp: new Date(),
          serverTimestamp: now
        };

        // Broadcast to room (includes sender since they're in the room)
        // NOTE: io.to() already includes the sender, so no need for duplicate socket.emit()
        io.to(player.roomId).emit('character_moved', movementData);

        console.log(`🚶 Character moved by ${player.name} to`, data.position, data.isDragging ? '(dragging)' : '(final)');
      }
    } catch (error) {
      console.error('Error handling character movement:', error);
      socket.emit('error', { message: 'Failed to process character movement' });
    }
  });

  // Handle character token creation
  socket.on('character_token_created', async (data) => {
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

    // Initialize character tokens if needed
    if (!room.gameState.characterTokens) {
      room.gameState.characterTokens = {};
    }

    // Create character token data
    const characterTokenData = {
      id: data.tokenId,
      playerId: player.id,
      playerName: player.name,
      position: data.position,
      createdAt: new Date()
    };

    room.gameState.characterTokens[player.id] = characterTokenData;

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist character token creation:', error);
    }

    // Broadcast character token creation to ALL players in the room
    io.to(player.roomId).emit('character_token_created', {
      tokenId: data.tokenId,
      playerId: player.id,
      playerName: player.name,
      position: data.position,
      timestamp: new Date()
    });

    console.log(`🎭 Character token created by ${player.name} at`, data.position);
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

    // CRITICAL FIX: If this is the GM updating their character, also update room.gm.character
    if (player.isGM && room.gm && room.gm.id === player.id) {
      room.gm.character = {
        ...room.gm.character,
        ...data.character,
        // Preserve GM-specific fields
        name: data.character.name || room.gm.character?.name || room.gm.name
      };
      console.log(`👑 Updated GM character data in room:`, {
        hasTokenSettings: !!room.gm.character.tokenSettings,
        hasLore: !!room.gm.character.lore,
        hasCharacterImage: !!room.gm.character.lore?.characterImage,
        health: room.gm.character.health,
        mana: room.gm.character.mana,
        actionPoints: room.gm.character.actionPoints
      });
    }

    // CRITICAL FIX: If this is a regular player updating their character, also update room.players
    if (!player.isGM && room.players) {
      const roomPlayer = room.players.get(player.id);
      if (roomPlayer) {
        roomPlayer.character = {
          ...roomPlayer.character,
          ...data.character,
          // Preserve player-specific fields
          name: data.character.name || roomPlayer.character?.name || roomPlayer.name
        };
        console.log(`👥 Updated player character data in room:`, {
          playerId: player.id,
          playerName: roomPlayer.name,
          health: roomPlayer.character.health,
          mana: roomPlayer.character.mana,
          actionPoints: roomPlayer.character.actionPoints
        });
      }
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist character update:', error);
    }

    // Broadcast character update to all players in the room
    // Include playerId so clients know which player's character was updated
    io.to(player.roomId).emit('character_updated', {
      characterId: data.characterId,
      character: {
        ...data.character,
        playerId: player.id // Include playerId for client-side identification
      },
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`Character ${data.characterId} updated by ${player.name}`);
  });

  // Handle character equipment updates
  socket.on('character_equipment_updated', async (data) => {
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

    // Update character equipment in room game state
    if (!room.gameState.characters) {
      room.gameState.characters = {};
    }

    // Update or create character data
    if (!room.gameState.characters[data.characterId]) {
      room.gameState.characters[data.characterId] = {};
    }

    room.gameState.characters[data.characterId] = {
      ...room.gameState.characters[data.characterId],
      equipment: data.equipment,
      stats: data.stats,
      lastEquipmentUpdate: {
        slot: data.slot,
        item: data.item,
        updatedBy: player.id,
        updatedAt: new Date()
      }
    };

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist equipment update:', error);
    }

    // Broadcast equipment update to all players in the room
    io.to(player.roomId).emit('character_equipment_updated', {
      characterId: data.characterId,
      slot: data.slot,
      item: data.item,
      equipment: data.equipment,
      stats: data.stats,
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`Equipment updated for character ${data.characterId} by ${player.name}: ${data.slot} -> ${data.item?.name || 'unequipped'}`);
  });

  // Handle map/background changes
  socket.on('map_update', async (data) => {
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

    // Update map data in room game state
    if (data.mapUpdates) {
      if (data.mapUpdates.fogOfWar !== undefined) {
        room.gameState.fogOfWar = data.mapUpdates.fogOfWar;
      }
      if (data.mapUpdates.fogOfWarPaths !== undefined) {
        if (!room.gameState.mapData) {
          room.gameState.mapData = {};
        }
        room.gameState.mapData.fogOfWarPaths = data.mapUpdates.fogOfWarPaths;
      }
      if (data.mapUpdates.fogErasePaths !== undefined) {
        if (!room.gameState.mapData) {
          room.gameState.mapData = {};
        }
        room.gameState.mapData.fogErasePaths = data.mapUpdates.fogErasePaths;
      }
      if (data.mapUpdates.terrainData !== undefined) {
        if (!room.gameState.mapData) {
          room.gameState.mapData = {};
        }
        room.gameState.mapData.terrainData = data.mapUpdates.terrainData;
      }
      if (data.mapUpdates.wallData !== undefined) {
        if (!room.gameState.mapData) {
          room.gameState.mapData = {};
        }
        room.gameState.mapData.wallData = data.mapUpdates.wallData;
      }
      if (data.mapUpdates.drawingLayers !== undefined) {
        if (!room.gameState.mapData) {
          room.gameState.mapData = {};
        }
        room.gameState.mapData.drawingLayers = data.mapUpdates.drawingLayers;
      }
      if (data.mapUpdates.drawingPaths !== undefined) {
        if (!room.gameState.mapData) {
          room.gameState.mapData = {};
        }
        room.gameState.mapData.drawingPaths = data.mapUpdates.drawingPaths;
      }
      // CRITICAL FIX: Handle explored areas sync for fog of war memory
      if (data.mapUpdates.exploredAreas !== undefined) {
        if (!room.gameState.mapData) {
          room.gameState.mapData = {};
        }
        room.gameState.mapData.exploredAreas = data.mapUpdates.exploredAreas;
      }
    } else if (data.mapData) {
      // Legacy support for old format
      room.gameState.mapData = {
        ...room.gameState.mapData,
        ...data.mapData,
        lastUpdatedBy: player.id,
        lastUpdatedAt: new Date()
      };
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist map update:', error);
    }

    // Broadcast map update to all players in the room (including sender for confirmation)
    io.to(player.roomId).emit('map_updated', {
      mapData: {
        ...room.gameState.mapData,
        fogOfWar: room.gameState.fogOfWar,
        fogOfWarPaths: room.gameState.mapData?.fogOfWarPaths,
        fogErasePaths: room.gameState.mapData?.fogErasePaths,
        terrainData: room.gameState.mapData?.terrainData,
        wallData: room.gameState.mapData?.wallData,
        drawingLayers: room.gameState.mapData?.drawingLayers,
        drawingPaths: room.gameState.mapData?.drawingPaths,
        exploredAreas: room.gameState.mapData?.exploredAreas || {}, // CRITICAL FIX: Include explored areas for fog memory
        ...(data.mapUpdates || data.mapData || {})
      },
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`Map updated by ${player.isGM ? 'GM' : 'Player'} ${player.name}`);
  });

  // Handle area remove operations
  socket.on('area_remove', async (data) => {
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

    // Only GM can remove objects
    if (!player.isGM) {
      socket.emit('error', { message: 'Only the GM can remove objects' });
      return;
    }

    // Broadcast area remove to all players in the room
    io.to(player.roomId).emit('area_remove', {
      removeType: data.removeType,
      selectedObjects: data.selectedObjects,
      removedBy: player.id,
      removedByName: player.name,
      timestamp: new Date()
    });

    console.log(`Area remove by GM ${player.name}: ${data.removeType}`);
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
  socket.on('item_dropped', async (data) => {
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

    // Initialize grid items if needed
    if (!room.gameState.gridItems) {
      room.gameState.gridItems = {};
    }

    // Create unique item ID to prevent conflicts
    const gridItemId = data.item.id || `griditem_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Store grid item with comprehensive data
    const gridItemData = {
      ...data.item,
      id: gridItemId,
      position: data.position,
      gridPosition: data.gridPosition,
      droppedBy: player.id,
      droppedByName: player.name,
      droppedAt: new Date()
    };

    room.gameState.gridItems[gridItemId] = gridItemData;

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist item drop:', error);
    }

    // Broadcast item drop to ALL players in the room (including dropper for confirmation)
    io.to(player.roomId).emit('item_dropped', {
      item: { ...data.item, id: gridItemId },
      position: data.position,
      gridPosition: data.gridPosition,
      playerId: player.id,
      playerName: player.name,
      timestamp: new Date(),
      isSync: false // Mark as new drop, not sync
    });

    console.log(`📦 Item ${data.item.name} (${gridItemId}) dropped by ${player.name} at`, data.position);
  });

  // Handle token creation
  socket.on('token_created', async (data) => {
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

    // Initialize tokens object if it doesn't exist
    if (!room.gameState.tokens) {
      room.gameState.tokens = {};
    }

    // Create a unique token ID to prevent conflicts
    const tokenId = data.token.id || `token_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Store token with comprehensive data
    const tokenData = {
      id: tokenId,
      creatureId: data.creature.id,
      position: data.position,
      creature: data.creature, // Include full creature data for sync
      createdBy: player.id,
      createdByName: player.name,
      createdAt: new Date(),
      lastMovedBy: null,
      lastMovedAt: null
    };

    room.gameState.tokens[tokenId] = tokenData;

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist token creation:', error);
    }

    // Broadcast token creation to ALL players in the room (including creator for confirmation)
    io.to(player.roomId).emit('token_created', {
      creature: data.creature,
      token: { ...data.token, id: tokenId },
      position: data.position,
      playerId: player.id,
      playerName: player.name,
      timestamp: new Date(),
      isSync: false // Mark as new creation, not sync
    });

    console.log(`🎭 Token ${data.creature.name} (${tokenId}) created by ${player.name} at`, data.position);
  });

  // REMOVED: Duplicate character_token_created handler - handled above

  // Handle item looting
  socket.on('item_looted', async (data) => {
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

    let itemRemoved = false;

    // Remove item from room game state if it was a grid item
    if (data.gridItemId && room.gameState.gridItems) {
      const gridItem = room.gameState.gridItems[data.gridItemId];
      if (gridItem) {
        console.log(`🎁 Removing looted item ${data.gridItemId} from server state`);
        delete room.gameState.gridItems[data.gridItemId];
        itemRemoved = true;

        // Persist the removal to Firebase
        try {
          await firebaseService.updateRoomGameState(player.roomId, room.gameState);
        } catch (error) {
          console.error('Failed to persist item removal:', error);
        }
      } else {
        console.warn(`⚠️ Grid item ${data.gridItemId} not found for looting`);
      }
    }

    // Broadcast loot event to all players in the room (including the looter for confirmation)
    io.to(player.roomId).emit('item_looted', {
      item: data.item,
      quantity: data.quantity,
      source: data.source,
      looter: data.looter,
      gridItemId: data.gridItemId,
      playerId: player.id,
      playerName: player.name,
      timestamp: new Date(),
      itemRemoved: itemRemoved // Indicate if item was successfully removed
    });

    console.log(`🎁 ${data.item.name} (x${data.quantity}) looted by ${player.name} from ${data.source}${itemRemoved ? ' (removed from grid)' : ''}`);
  });

  // Handle full game state synchronization request
  socket.on('request_full_sync', () => {
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

    console.log(`🔄 Full sync requested by ${player.name} in room ${room.name}`);

    // Send complete game state to the requesting player
    socket.emit('full_game_state_sync', {
      tokens: room.gameState.tokens || {},
      gridItems: room.gameState.gridItems || {},
      characters: room.gameState.characters || {},
      mapData: room.gameState.mapData || {},
      combat: room.gameState.combat || {},
      timestamp: new Date()
    });
  });

  // Handle state conflict resolution
  socket.on('resolve_state_conflict', async (data) => {
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

    console.log(`⚖️ State conflict resolution by ${player.name}:`, data.conflictType);

    // Handle different types of conflicts
    switch (data.conflictType) {
      case 'token_position':
        // GM or token owner has authority
        if (player.isGM || data.tokenOwnerId === player.id) {
          if (room.gameState.tokens[data.tokenId]) {
            room.gameState.tokens[data.tokenId].position = data.resolvedPosition;
            room.gameState.tokens[data.tokenId].lastMovedBy = player.id;
            room.gameState.tokens[data.tokenId].lastMovedAt = new Date();

            // Broadcast resolved position
            io.to(player.roomId).emit('token_moved', {
              tokenId: data.tokenId,
              position: data.resolvedPosition,
              playerId: player.id,
              playerName: player.name,
              timestamp: new Date(),
              isResolution: true
            });
          }
        }
        break;

      case 'item_existence':
        // GM has authority over item existence
        if (player.isGM) {
          if (data.shouldExist && !room.gameState.gridItems[data.itemId]) {
            room.gameState.gridItems[data.itemId] = data.itemData;
          } else if (!data.shouldExist && room.gameState.gridItems[data.itemId]) {
            delete room.gameState.gridItems[data.itemId];
          }

          // Broadcast resolution
          io.to(player.roomId).emit('item_conflict_resolved', {
            itemId: data.itemId,
            shouldExist: data.shouldExist,
            itemData: data.shouldExist ? data.itemData : null,
            resolvedBy: player.name,
            timestamp: new Date()
          });
        }
        break;
    }

    // Persist resolved state
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist conflict resolution:', error);
    }
  });

  // Handle player color updates
  socket.on('update_player_color', (data) => {
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

    const newColor = data.color || '#4a90e2';

    // Update player tracking
    player.color = newColor;

    // Update room data
    if (player.isGM) {
      room.gm.color = newColor;
    } else {
      const roomPlayer = room.players.get(player.id);
      if (roomPlayer) {
        roomPlayer.color = newColor;
      }
    }

    // Broadcast color update to all players in the room
    io.to(player.roomId).emit('player_color_updated', {
      playerId: player.id,
      playerName: player.name,
      color: newColor,
      isGM: player.isGM,
      timestamp: new Date()
    });

    console.log(`🎨 Player ${player.name} updated color to ${newColor}`);
  });

  // Handle heartbeat/ping for connection monitoring
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date() });
  });

  // Handle client health check
  socket.on('health_check', () => {
    const player = players.get(socket.id);
    const room = player ? rooms.get(player.roomId) : null;

    socket.emit('health_response', {
      status: 'ok',
      playerId: player?.id,
      roomId: player?.roomId,
      roomName: room?.name,
      timestamp: new Date()
    });
  });

  // ========== ENHANCED MULTIPLAYER EVENT HANDLERS ==========

  // Handle character sheet updates with real-time sync
  socket.on('character_update', async (data) => {
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

    // DISABLED: Enhanced services causing lag
    // memoryManager.updatePlayerActivity(socket.id);

    // DISABLED: Lag compensation causing performance issues
    // const inputResult = lagCompensation.processClientInput(socket.id, {
    //   type: 'character_update',
    //   data: data,
    //   timestamp: Date.now()
    // });

    // DISABLED: Real-time sync causing socket errors
    // const success = realtimeSync.updateCharacter(
    //   player.roomId,
    //   data.characterId,
    //   data.updates,
    //   player.id
    // );

    if (success) {
      console.log(`👤 Character ${data.characterId} updated by ${player.name}`);
    } else {
      socket.emit('error', { message: 'Failed to update character' });
    }
  });

  // Handle inventory updates with real-time sync
  socket.on('inventory_update', async (data) => {
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

    // Update player activity
    memoryManager.updatePlayerActivity(socket.id);

    // Process with lag compensation
    const inputResult = lagCompensation.processClientInput(socket.id, {
      type: 'inventory_change',
      data: data,
      timestamp: Date.now()
    });

    // Update inventory via real-time sync
    const success = realtimeSync.updateInventory(
      player.roomId,
      data.playerId || player.id,
      data.inventoryData,
      data.changeType || 'full'
    );

    if (success) {
      console.log(`🎒 Inventory updated for ${player.name}: ${data.changeType}`);
    } else {
      socket.emit('error', { message: 'Failed to update inventory' });
    }
  });

  // Handle combat state updates (GM only)
  socket.on('combat_update', async (data) => {
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

    // Only GM can update combat state
    if (!player.isGM) {
      socket.emit('error', { message: 'Only GM can update combat state' });
      return;
    }

    // Update combat via real-time sync
    const success = realtimeSync.updateCombat(
      player.roomId,
      data.combatUpdates,
      player.id
    );

    if (success) {
      console.log(`⚔️ Combat updated by GM ${player.name}`);
    } else {
      socket.emit('error', { message: 'Failed to update combat state' });
    }
  });

  // Handle map state updates (GM only)
  socket.on('map_update', async (data) => {
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

    // Only GM can update map state
    if (!player.isGM) {
      socket.emit('error', { message: 'Only GM can update map state' });
      return;
    }

    // Update map via real-time sync
    const success = realtimeSync.updateMap(
      player.roomId,
      data.mapUpdates,
      player.id
    );

    if (success) {
      console.log(`🗺️ Map updated by GM ${player.name}`);
    } else {
      socket.emit('error', { message: 'Failed to update map state' });
    }
  });

  // Handle UI state synchronization
  socket.on('ui_update', async (data) => {
    const player = players.get(socket.id);
    if (!player) return; // UI updates are optional

    const room = rooms.get(player.roomId);
    if (!room) return;

    // DISABLED: Real-time sync causing socket errors
    // realtimeSync.updateUI(player.roomId, player.id, data.uiUpdates);
  });

  // DISABLED: Enhanced services causing lag
  socket.on('network_metrics', (metrics) => {
    // lagCompensation.updateNetworkMetrics(socket.id, metrics);
    // eventBatcher.updateClientMetrics(socket.id, metrics);
    // No-op - enhanced services disabled
  });

  // Handle ping for latency measurement
  socket.on('ping', (timestamp) => {
    socket.emit('pong', timestamp);
  });

  // Handle party member synchronization
  socket.on('party_member_added', (data) => {
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

    console.log(`🎭 Broadcasting party member addition: ${data.member.name} to room ${room.name}`);

    // Broadcast to all other players in the room (not the sender)
    socket.to(player.roomId).emit('party_member_added', {
      member: data.member,
      addedBy: player.name
    });
  });

  // Handle player kick (GM only)
  socket.on('kick_player', (data) => {
    const gmPlayer = players.get(socket.id);
    if (!gmPlayer || !gmPlayer.isGM) {
      socket.emit('error', { message: 'Only GM can kick players' });
      return;
    }

    const room = rooms.get(gmPlayer.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Find the player to kick
    const playerToKick = Array.from(players.values()).find(p => p.id === data.playerId);
    if (!playerToKick) {
      socket.emit('error', { message: 'Player not found' });
      return;
    }

    // Remove player from room
    room.players.delete(playerToKick.id);
    players.delete(playerToKick.socketId);

    // Notify the kicked player
    io.to(playerToKick.socketId).emit('player_kicked', {
      reason: data.reason || 'Kicked by GM'
    });

    // Notify other players
    socket.to(gmPlayer.roomId).emit('player_left', {
      player: {
        id: playerToKick.id,
        name: playerToKick.name
      },
      playerCount: room.players.size + 1, // +1 for GM
      reason: 'kicked'
    });

    console.log(`👮 GM ${gmPlayer.name} kicked player ${playerToKick.name} from room ${room.name}`);
  });

  // ========== END ENHANCED MULTIPLAYER HANDLERS ==========

  // ========== GLOBAL CHAT & PRESENCE HANDLERS ==========

  // Track online users globally (not just in rooms)
  const onlineUsers = global.onlineUsers || new Map();
  global.onlineUsers = onlineUsers;

  // User comes online with character data
  socket.on('user_online', (userData) => {
    console.log('👤 User online:', userData.characterName);

    // Store user data with socket ID
    onlineUsers.set(userData.userId, {
      ...userData,
      socketId: socket.id,
      connectedAt: new Date()
    });

    // Broadcast to all connected clients
    io.emit('user_status_changed', {
      userId: userData.userId,
      ...userData,
      status: 'online'
    });
  });

  // User updates session (local/multiplayer)
  socket.on('update_session', (sessionData) => {
    const user = Array.from(onlineUsers.values()).find(u => u.socketId === socket.id);
    if (user) {
      // Update user's session data
      onlineUsers.set(user.userId, {
        ...user,
        ...sessionData
      });

      // Broadcast update
      io.emit('user_status_changed', {
        userId: user.userId,
        ...user,
        ...sessionData
      });

      console.log('📍 Session updated:', user.characterName, sessionData.sessionType);
    }
  });

  // User goes offline
  socket.on('user_offline', (userId) => {
    const user = onlineUsers.get(userId);
    if (user) {
      onlineUsers.delete(userId);

      // Broadcast offline status
      io.emit('user_status_changed', {
        userId,
        status: 'offline'
      });

      console.log('👋 User offline:', user.characterName);
    }
  });

  // Global chat message
  socket.on('global_chat_message', async (message) => {
    console.log('💬 Global chat:', message.senderName, '-', message.content);

    // Add server timestamp
    const enhancedMessage = {
      ...message,
      serverTimestamp: new Date().toISOString()
    };

    // Broadcast to all connected clients
    io.emit('global_chat_message', enhancedMessage);

    // TODO: Store in Firebase for persistence
    // await firebaseService.saveGlobalChatMessage(enhancedMessage);
  });

  // Whisper message to specific user
  socket.on('whisper_message', (message) => {
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

    // Find target player in the room
    let targetPlayer = null;
    if (room.gm && room.gm.id === message.recipientId) {
      targetPlayer = room.gm;
    } else {
      targetPlayer = Array.from(room.players.values()).find(p => p.id === message.recipientId);
    }

    if (targetPlayer && targetPlayer.socketId) {
      // Get sender's character data for the whisper
      const senderCharacter = player.isGM ? room.gm.character : (player.character || room.gm.character);
      const recipientCharacter = targetPlayer.isGM ? room.gm.character : (targetPlayer.character || room.gm.character);
      
      // CRITICAL FIX: Get proper names from character data or player data
      const senderName = senderCharacter?.name || player.name;
      const recipientName = recipientCharacter?.name || targetPlayer.name;
      
      // Send to target user with full sender and recipient information
      io.to(targetPlayer.socketId).emit('whisper_received', {
        ...message,
        senderId: player.id,
        senderName: senderName,
        senderClass: senderCharacter?.class || 'Unknown',
        senderLevel: senderCharacter?.level || 1,
        recipientId: targetPlayer.id,
        recipientName: recipientName,
        recipientClass: recipientCharacter?.class || 'Unknown',
        recipientLevel: recipientCharacter?.level || 1,
        serverTimestamp: new Date().toISOString()
      });

      // CRITICAL FIX: Also send confirmation back to sender with correct recipient name
      socket.emit('whisper_sent', {
        ...message,
        senderId: player.id,
        senderName: senderName,
        senderClass: senderCharacter?.class || 'Unknown',
        senderLevel: senderCharacter?.level || 1,
        recipientId: targetPlayer.id,
        recipientName: recipientName,
        recipientClass: recipientCharacter?.class || 'Unknown',
        recipientLevel: recipientCharacter?.level || 1,
        serverTimestamp: new Date().toISOString()
      });

      console.log('🤫 Whisper:', senderName, '->', recipientName);
    } else {
      // User not online, send error back
      socket.emit('error', {
        message: 'User is not online',
        type: 'whisper_failed'
      });
    }
  });

  // Send room invitation
  socket.on('send_room_invite', ({ targetUserId, roomId, roomName, gmName }) => {
    const gmPlayer = players.get(socket.id);

    // Validate sender is GM of the room
    const room = rooms.get(roomId);
    if (!room || room.gm.socketId !== socket.id) {
      socket.emit('error', { message: 'Not authorized to send invites' });
      return;
    }

    // Find target user
    const targetUser = onlineUsers.get(targetUserId);
    if (!targetUser || !targetUser.socketId) {
      socket.emit('error', { message: 'User not online' });
      return;
    }

    // Check if user is already in the room
    if (targetUser.roomId === roomId) {
      socket.emit('error', { message: 'User is already in this room' });
      return;
    }

    // Create invitation
    const inviteId = uuidv4();
    const invitation = {
      id: inviteId,
      roomId,
      roomName,
      gmName,
      gmUserId: gmPlayer.id,
      expiresAt: Date.now() + 60000 // 1 minute
    };

    // Send invitation to target user
    io.to(targetUser.socketId).emit('room_invitation', invitation);

    console.log('📨 Room invite sent:', gmName, '->', targetUser.characterName, 'for room:', roomName);
  });

  // Respond to room invitation
  socket.on('respond_to_invite', async ({ inviteId, accepted, roomId, password }) => {
    if (!accepted) {
      console.log('❌ Invitation declined:', inviteId);
      return;
    }

    // User accepted - join them to the room
    const user = Array.from(onlineUsers.values()).find(u => u.socketId === socket.id);
    if (!user) {
      socket.emit('error', { message: 'User data not found' });
      return;
    }

    // Join the room (reuse existing join logic)
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room no longer exists' });
      return;
    }

    // Join room with user's character name
    const joinData = {
      roomId,
      playerName: user.characterName,
      password: password || room.password,
      playerColor: '#4a90e2'
    };

    // Trigger join room logic
    socket.emit('auto_join_room', joinData);

    console.log('✅ Invitation accepted:', user.characterName, 'joining room:', room.name);
  });

  // ========== END GLOBAL CHAT & PRESENCE HANDLERS ==========

  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log(`Player disconnected: ${socket.id}`);

    // Clean up online user presence
    const user = Array.from(onlineUsers.values()).find(u => u.socketId === socket.id);
    if (user) {
      onlineUsers.delete(user.userId);

      // Broadcast offline status
      io.emit('user_status_changed', {
        userId: user.userId,
        status: 'offline'
      });

      console.log('👋 User disconnected and marked offline:', user.characterName);
    }

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
        // Calculate accurate player count: GM + remaining regular players
        const totalPlayerCount = result.room.players.size + 1; // +1 for GM

        // Notify ALL remaining players in the room
        io.to(result.room.id).emit('player_left', {
          player: result.player,
          playerCount: totalPlayerCount,
          playerName: result.player.name
        });

        // Also send a separate player count update
        io.to(result.room.id).emit('player_count_updated', {
          playerCount: totalPlayerCount
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

    // Enhanced cleanup for all services
    memoryManager.markPlayerDisconnected(socket.id);
    lagCompensation.cleanupClient(socket.id);
    eventBatcher.cleanupClient(socket.id);

    console.log(`🧹 Enhanced cleanup completed for socket ${socket.id}`);
  });
});

// Cleanup throttling maps periodically to prevent memory buildup
const throttleCleanupInterval = setInterval(() => {
  const now = Date.now();
  const THROTTLE_ENTRY_LIFETIME = 30000; // 30 seconds

  // Clean up token broadcast throttling
  if (global.lastTokenBroadcast) {
    for (const [key, timestamp] of global.lastTokenBroadcast.entries()) {
      if (now - timestamp > THROTTLE_ENTRY_LIFETIME) {
        global.lastTokenBroadcast.delete(key);
      }
    }
  }

  // Clean up character broadcast throttling
  if (global.lastCharacterBroadcast) {
    for (const [key, timestamp] of global.lastCharacterBroadcast.entries()) {
      if (now - timestamp > THROTTLE_ENTRY_LIFETIME) {
        global.lastCharacterBroadcast.delete(key);
      }
    }
  }
}, 10000); // Clean up every 10 seconds

// Store interval ID for proper cleanup on server shutdown
global.throttleCleanupInterval = throttleCleanupInterval;

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Mythrill server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Socket.IO server initialized`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`🔒 CORS Origins: ${JSON.stringify(allowedOrigins)}`);
  console.log(`📅 Server started at: ${new Date().toISOString()}`);
});
