const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
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

// Configure CORS for Socket.io
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
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

// In-memory storage (upgrade to Redis later for production scaling)
const rooms = new Map(); // roomId -> { id, name, players, gm, settings, chatHistory }
const players = new Map(); // socketId -> { id, name, roomId, isGM }

// Room management functions
function createRoom(roomName, gmName, gmSocketId) {
  const roomId = uuidv4();
  const gmPlayerId = uuidv4();
  
  const room = {
    id: roomId,
    name: roomName,
    gm: {
      id: gmPlayerId,
      name: gmName,
      socketId: gmSocketId
    },
    players: new Map(),
    settings: {
      maxPlayers: 6,
      isPrivate: false,
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
  
  return room;
}

function joinRoom(roomId, playerName, socketId) {
  const room = rooms.get(roomId);
  if (!room) return null;
  
  if (room.players.size >= room.settings.maxPlayers) {
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
    // Notify all players
    return { type: 'room_closed', room };
  } else {
    // Regular player left
    room.players.delete(player.id);
    players.delete(socketId);
    return { type: 'player_left', room, player };
  }
}

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/rooms', (req, res) => {
  const publicRooms = Array.from(rooms.values())
    .filter(room => !room.settings.isPrivate)
    .map(room => ({
      id: room.id,
      name: room.name,
      playerCount: room.players.size + 1, // +1 for GM
      maxPlayers: room.settings.maxPlayers + 1,
      gm: room.gm.name,
      createdAt: room.createdAt
    }));
  
  res.json(publicRooms);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Create a new room
  socket.on('create_room', (data) => {
    const { roomName, gmName } = data;
    
    if (!roomName || !gmName) {
      socket.emit('error', { message: 'Room name and GM name are required' });
      return;
    }
    
    const room = createRoom(roomName, gmName, socket.id);
    socket.join(room.id);
    
    socket.emit('room_created', {
      room: {
        id: room.id,
        name: room.name,
        gm: room.gm,
        players: Array.from(room.players.values()),
        settings: room.settings
      }
    });
    
    console.log(`Room created: ${room.name} (${room.id}) by ${gmName}`);
  });
  
  // Join an existing room
  socket.on('join_room', (data) => {
    const { roomId, playerName } = data;
    
    if (!roomId || !playerName) {
      socket.emit('error', { message: 'Room ID and player name are required' });
      return;
    }
    
    const result = joinRoom(roomId, playerName, socket.id);
    
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
});
