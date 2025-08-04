const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

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
  const publicRooms = Array.from(rooms.values())
    .filter(room => !room.settings.isPrivate)
    .map(room => ({
      id: room.id,
      name: room.name,
      playerCount: room.players.size + 1, // +1 for GM
      maxPlayers: room.settings.maxPlayers
    }));

  res.json(publicRooms);
});

// Persistent storage with file backup
const ROOMS_FILE = path.join(__dirname, 'rooms.json');
const rooms = new Map(); // roomId -> { id, name, players, gm, settings, chatHistory }
const players = new Map(); // socketId -> { id, name, roomId, isGM }

// Load rooms from file on startup
function loadRooms() {
  try {
    if (fs.existsSync(ROOMS_FILE)) {
      const data = fs.readFileSync(ROOMS_FILE, 'utf8');
      const roomsData = JSON.parse(data);

      // Convert back to Map and restore player Maps
      Object.entries(roomsData).forEach(([roomId, roomData]) => {
        // Convert players object back to Map
        const playersMap = new Map();
        if (roomData.players && typeof roomData.players === 'object') {
          Object.entries(roomData.players).forEach(([playerId, playerData]) => {
            playersMap.set(playerId, playerData);
          });
        }

        rooms.set(roomId, {
          ...roomData,
          players: playersMap
        });
      });

      console.log(`Loaded ${rooms.size} rooms from storage`);
    }
  } catch (error) {
    console.error('Error loading rooms:', error);
  }
}

// Save rooms to file
function saveRooms() {
  try {
    const roomsData = {};

    // Convert Map to object for JSON serialization
    rooms.forEach((room, roomId) => {
      // Convert players Map to object
      const playersObj = {};
      room.players.forEach((player, playerId) => {
        playersObj[playerId] = player;
      });

      roomsData[roomId] = {
        ...room,
        players: playersObj
      };
    });

    fs.writeFileSync(ROOMS_FILE, JSON.stringify(roomsData, null, 2));
    console.log(`Saved ${rooms.size} rooms to storage`);
  } catch (error) {
    console.error('Error saving rooms:', error);
  }
}

// Load rooms on startup
loadRooms();

// Room management functions
function createRoom(roomName, gmName, gmSocketId, password) {
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
      combat: null,
      mapData: null
    },
    createdAt: new Date()
  };

  rooms.set(roomId, room);
  players.set(gmSocketId, {
    id: gmPlayerId,
    name: gmName,
    roomId: roomId,
    isGM: true
  });

  saveRooms(); // Persist to file
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

  saveRooms(); // Persist to file
  return { room, player };
}

function leaveRoom(socketId) {
  const player = players.get(socketId);
  if (!player) return null;
  
  const room = rooms.get(player.roomId);
  if (!room) return null;
  
  if (player.isGM) {
    // GM left - close the room
    rooms.delete(player.roomId);
    saveRooms(); // Persist to file
    // Notify all players
    return { type: 'room_closed', room };
  } else {
    // Regular player left
    room.players.delete(player.id);
    players.delete(socketId);
    saveRooms(); // Persist to file
    return { type: 'player_left', room, player };
  }
}

// Helper function to get public room list
function getPublicRooms() {
  return Array.from(rooms.values())
    .map(room => ({
      id: room.id,
      name: room.name,
      playerCount: room.players.size + 1, // +1 for GM
      maxPlayers: room.settings.maxPlayers + 1,
      gm: room.gm.name,
      createdAt: room.createdAt,
      hasPassword: true // All rooms now have passwords
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
  socket.on('create_room', (data) => {
    console.log('Received create_room request:', data);
    const { roomName, gmName, password } = data;

    if (!roomName || !gmName || !password) {
      console.log('Missing required fields:', { roomName, gmName, password });
      socket.emit('error', { message: 'Room name, GM name, and password are required' });
      return;
    }

    const room = createRoom(roomName, gmName, socket.id, password);
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

    console.log(`Room created: ${room.name} (${room.id}) by ${gmName}`);
  });
  
  // Join an existing room
  socket.on('join_room', (data) => {
    console.log('Received join_room request:', data);
    const { roomId, playerName, password } = data;

    if (!roomId || !playerName || !password) {
      console.log('Missing required fields for join:', { roomId, playerName, password });
      socket.emit('error', { message: 'Room ID, player name, and password are required' });
      return;
    }

    console.log('Attempting to join room:', roomId, 'Total rooms available:', rooms.size);
    console.log('Available room IDs:', Array.from(rooms.keys()));

    const result = joinRoom(roomId, playerName, socket.id, password);
    
    if (!result) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    if (result.error) {
      socket.emit('error', { message: result.error });
      return;
    }
    
    const { room, player } = result;
    socket.join(roomId);
    
    // Notify the new player
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

    // Broadcast room list update to all connected clients
    io.emit('room_list_updated', getPublicRooms());

    console.log(`${playerName} joined room: ${room.name}`);
  });
  
  // Handle chat messages
  socket.on('chat_message', (data) => {
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
    
    // Broadcast to all players in the room
    io.to(player.roomId).emit('chat_message', message);
  });

  // Handle token movement synchronization
  socket.on('token_moved', (data) => {
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

    // TODO: Add permission checks here - for now, allow all movements
    // In the future, check if player owns the token or has GM permissions

    // Broadcast token movement to all other players in the room
    socket.to(player.roomId).emit('token_moved', {
      tokenId: data.tokenId,
      position: data.position,
      playerId: player.id,
      playerName: player.name
    });

    console.log(`Token ${data.tokenId} moved by ${player.name} to`, data.position);
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
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    const result = leaveRoom(socket.id);
    if (result) {
      if (result.type === 'room_closed') {
        // Notify all players that room was closed
        io.to(result.room.id).emit('room_closed', {
          message: 'The GM has left. Room is now closed.'
        });
      } else if (result.type === 'player_left') {
        // Notify remaining players
        socket.to(result.room.id).emit('player_left', {
          player: result.player,
          playerCount: result.room.players.size + 1
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Mythrill server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Socket.IO server initialized`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`CORS Origins: ${JSON.stringify(allowedOrigins)}`);
});
