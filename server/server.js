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

  // Add GM to players tracking immediately when room is created
  players.set(gmSocketId, {
    id: gmPlayerId,
    name: gmName,
    roomId: roomId,
    isGM: true,
    color: playerColor
  });

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

function joinRoom(roomId, playerName, socketId, password, playerColor = '#4a90e2') {
  console.log('joinRoom called with:', { roomId, playerName, socketId, playerColor });
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
    joinedAt: new Date()
  };

  room.players.set(playerId, player);
  players.set(socketId, {
    id: playerId,
    name: playerName,
    roomId: roomId,
    isGM: false,
    color: playerColor || '#4a90e2' // Ensure color is always set
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

    const result = joinRoom(roomId, playerName, socket.id, password, data.playerColor);

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
      console.log(`📢 Broadcasting player_joined event to room ${roomId} for player:`, player.name);
      console.log(`📢 Current players in room before broadcast:`, Array.from(room.players.values()).map(p => p.name));
      socket.to(roomId).emit('player_joined', {
        player: player,
        playerCount: room.players.size + (room.isActive !== false ? 1 : 0) // +1 for GM only if GM is online
      });

      console.log(`✅ ${playerName} joined room: ${room.name} (Total players: ${room.players.size + 1})`);
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

    // Send current tokens to the new player
    if (room.gameState.tokens && Object.keys(room.gameState.tokens).length > 0) {
      console.log(`🎭 Syncing ${Object.keys(room.gameState.tokens).length} tokens to ${playerName}`);
      socket.emit('sync_tokens', {
        tokens: room.gameState.tokens
      });
    }

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
      // Update existing token
      room.gameState.tokens[tokenKey] = {
        ...existingToken,
        position: data.position,
        lastMovedBy: player.id,
        lastMovedByName: player.name,
        lastMovedAt: new Date()
      };

      // Broadcast token movement to all other players in the room
      socket.to(player.roomId).emit('token_moved', {
        tokenId: tokenKey,
        creatureId: existingToken.creatureId,
        position: data.position,
        playerId: player.id,
        playerName: player.name,
        timestamp: new Date()
      });

      console.log(`🎯 Token ${tokenKey} (creature: ${existingToken.creatureId}) moved by ${player.name} to`, data.position);
    } else {
      console.warn(`⚠️ Token ${data.tokenId} not found in room ${room.name} for movement`);
      socket.emit('error', { message: 'Token not found' });
    }
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
          playerCount: result.room.players.size + (result.room.isActive !== false ? 1 : 0) // +1 for GM only if GM is online
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

    // Clean up any orphaned player tracking
    console.log(`🧹 Cleaning up player tracking for socket ${socket.id}`);
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
