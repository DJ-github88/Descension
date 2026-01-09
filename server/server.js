const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// LAUNCH READINESS: Validate environment variables on startup (non-blocking)
if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
  try {
    const path = require('path');
    const { validateEnvironment } = require(path.resolve(process.cwd(), 'scripts/validate-env'));
    if (!validateEnvironment()) {
      console.error('❌ Environment validation failed. Server will not start.');
      process.exit(1);
    }
  } catch (error) {
    console.warn('⚠️  Could not validate environment variables:', error.message);
    // Don't exit in case validation script has issues - allow server to start with warnings
  }
}

// Firebase service for persistence
const firebaseService = require('./services/firebaseService');

// Smart Enhanced Services: Initialize but use conditionally
const deltaSync = require('./services/deltaSync');
const EventBatcher = require('./services/eventBatcher');
const optimizedFirebase = require('./services/optimizedFirebase');
const memoryManager = require('./services/memoryManager');
const lagCompensation = require('./services/lagCompensation');
const RealtimeSyncEngine = require('./services/realtimeSync');
const { createValidationMiddleware } = require('./services/validationService');
const rateLimitService = require('./services/rateLimitService');
const { sanitizeChatMessage, sanitizeRoomName, sanitizePlayerName, createSanitizationMiddleware } = require('./services/sanitizationService');

// Observability services (lightweight, performance-optimized)
const logger = require('./services/logger');
const requestTracer = require('./services/requestTracer');
const ErrorHandler = require('./services/errorHandler');

const app = express();
const server = http.createServer(app);

// Configure CORS origins from environment variables
const getAllowedOrigins = () => {
  // SECURITY: Use environment variable if set
  if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    // Always include Netlify domains for multiplayer functionality
    const requiredOrigins = ['https://mythrill.netlify.app', 'https://windtunnel.netlify.app'];
    return [...new Set([...envOrigins, ...requiredOrigins])];
  }

  // Fallback to defaults based on environment
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
  if (isProduction) {
    // Production defaults - ensure Netlify domains are included
    return [
      'https://windtunnel.netlify.app',
      'https://mythrill.netlify.app',
      'https://descension-mythrill.netlify.app' // Alternative domain
    ].filter(Boolean); // Remove any empty strings
  }

  // Development defaults
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002'
  ];
};

const allowedOrigins = getAllowedOrigins();

// Initialize error handler
const errorHandler = new ErrorHandler();

console.log('🚀 SERVER CORS CONFIGURATION:', {
  allowedOrigins,
  envVarSet: !!process.env.ALLOWED_ORIGINS,
  envVarValue: process.env.ALLOWED_ORIGINS,
  environment: process.env.NODE_ENV,
  railwayEnvironment: process.env.RAILWAY_ENVIRONMENT
});

logger.info('Server initializing', {
  corsOrigins: allowedOrigins,
  environment: process.env.NODE_ENV,
  railwayEnvironment: process.env.RAILWAY_ENVIRONMENT
});

// Configure CORS for Socket.io with proper origins
console.log('🔌 SOCKET.IO CORS CONFIG:', {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// For multiplayer functionality, be more permissive with CORS
const corsOrigin = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT
  ? function (origin, callback) {
    // Allow Netlify domains and localhost for development
    const allowed = !origin ||
      origin === 'https://mythrill.netlify.app' ||
      origin === 'https://windtunnel.netlify.app' ||
      origin === 'https://descension-mythrill.netlify.app' ||
      origin.includes('netlify.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      allowedOrigins.includes(origin);

    console.log('🔍 CORS CHECK:', { origin, allowed, allowedOrigins });

    if (allowed) {
      callback(null, true);
    } else {
      console.warn('🚫 CORS BLOCKED:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  }
  : allowedOrigins;

console.log('🔌 FINAL SOCKET.IO CORS CONFIG:', {
  origins: allowedOrigins,
  isProduction: process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT
});

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true
  },
  allowEIO3: true // Allow Engine.IO v3 clients
});

// SECURITY: Add input sanitization middleware to Socket.IO (before validation)
io.use(createSanitizationMiddleware({
  logSanitization: process.env.NODE_ENV === 'development',
  fieldsToSkip: ['password', 'passwordHash', 'token', 'id', 'roomId', 'socketId', 'playerId', 'characterId']
}));

// Add validation middleware to Socket.IO
io.use(createValidationMiddleware({
  logErrors: true,
  strictMode: false, // Don't disconnect clients on validation errors in production
  maxErrorsPerMinute: 10
}));

// Add rate limiting middleware to Socket.IO
io.use(rateLimitService.createMiddleware({
  logViolations: true,
  disconnectOnViolation: false, // Don't disconnect for rate limit violations
  violationThreshold: 10
}));

// Add Firebase authentication middleware to Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;

    if (!token) {
      // Allow guest connections for multiplayer functionality
      // Guests can join rooms but cannot access Firebase-protected features
      socket.data.authenticated = false;
      socket.data.userId = null;
      socket.data.isGuest = true;
      logger.debug('Guest connection allowed for multiplayer', { socketId: socket.id });
      return next();
    }

    // Verify Firebase ID token
    const decodedToken = await firebaseService.verifyIdToken(token);
    if (decodedToken) {
      socket.data.authenticated = true;
      socket.data.userId = decodedToken.uid;
      socket.data.email = decodedToken.email;
      socket.data.isGuest = false;
      logger.info('Socket authenticated', { socketId: socket.id, userId: decodedToken.uid });
    } else {
      // Allow connection but mark as guest for invalid tokens
      // This prevents complete blocking while still allowing multiplayer
      socket.data.authenticated = false;
      socket.data.userId = null;
      socket.data.isGuest = true;
      logger.warn('Socket authentication failed, allowing as guest', { socketId: socket.id });
    }

    next();
  } catch (error) {
    logger.error('Socket authentication error', { socketId: socket.id, error: error.message });

    // Allow connection as guest for backward compatibility
    socket.data.authenticated = false;
    socket.data.userId = null;
    socket.data.isGuest = true;
    next();
  }
});

// OPTIMIZED: Enhanced multiplayer services with performance controls
// Initialize with reduced frequency to prevent lag
const eventBatcher = new EventBatcher(io);
const realtimeSync = new RealtimeSyncEngine(eventBatcher, deltaSync, optimizedFirebase);

// Combat action handler with lag compensation
const handleCombatAction = (roomId, playerId, actionData, _predictedAction) => {
  const room = rooms.get(roomId);
  if (!room) { return; }


  switch (actionData.type) {
    case 'next_turn':
      // Handle turn advancement with lag compensation
      if (room.gameState && room.gameState.combat && room.gameState.combat.isActive) {
        const combat = room.gameState.combat;
        const nextIndex = (combat.currentTurnIndex + 1) % combat.turnOrder.length;
        const newRound = nextIndex === 0 ? combat.round + 1 : combat.round;

        combat.currentTurnIndex = nextIndex;
        combat.round = newRound;
        combat.currentTurnStartTime = Date.now();

        // Notify all players of the turn change
        io.to(roomId).emit('combat_action', {
          type: 'turn_changed',
          newTurnIndex: nextIndex,
          newRound: newRound,
          timestamp: Date.now()
        });

        // Update lag compensation system
        if (lagCompensation && typeof lagCompensation.processCombatStateUpdate === 'function') {
          lagCompensation.processCombatStateUpdate(roomId, combat, Date.now());
        }
      }
      break;

    case 'initiative_roll':
      // Handle initiative changes
      if (actionData.data && actionData.data.combatantId && actionData.data.newInitiative) {
        if (room.gameState && room.gameState.combat && room.gameState.combat.turnOrder) {
          const combatant = room.gameState.combat.turnOrder.find(c => c.tokenId === actionData.data.combatantId);
          if (combatant) {
            combatant.initiative = actionData.data.newInitiative;
            // Re-sort turn order
            room.gameState.combat.turnOrder.sort((a, b) => b.initiative - a.initiative);

            // Notify all players
            io.to(roomId).emit('combat_action', {
              type: 'initiative_updated',
              combatantId: actionData.data.combatantId,
              newInitiative: actionData.data.newInitiative,
              newTurnOrder: room.gameState.combat.turnOrder.map(c => ({ tokenId: c.tokenId, initiative: c.initiative }))
            });
          }
        }
      }
      break;

    default:
      logger.debug('Unknown combat action type', { type: actionData.type, playerId });
  }
};

// Error handler is now initialized above using the ErrorHandler class

// Performance monitoring with sampling (lightweight)
const performanceMonitor = {
  requestCount: 0,
  websocketEventCount: 0,
  lastReset: Date.now(),

  trackRequest(path, duration, success) {
    this.requestCount++;
    // Only log slow requests (>500ms) or failures
    if (!success || duration > 500) {
      logger.warn('Slow or failed request', { path, duration, success });
    }
  },

  trackWebSocketEvent(eventType, roomId) {
    this.websocketEventCount++;
    // Sample 1% of websocket events to avoid spam
    if (Math.random() < 0.01) {
      logger.debug('WebSocket event', { eventType, roomId });
    }
  },

  getPerformanceSummary() {
    const uptime = Date.now() - this.lastReset;
    return {
      status: 'active',
      uptime: uptime,
      requestsPerMinute: uptime > 0 ? (this.requestCount * 60000) / uptime : 0,
      websocketEventsPerMinute: uptime > 0 ? (this.websocketEventCount * 60000) / uptime : 0
    };
  },

  getOptimizationRecommendations() {
    const summary = this.getPerformanceSummary();
    const recommendations = [];

    if (summary.requestsPerMinute > 100) {
      recommendations.push('High request rate detected - consider rate limiting');
    }
    if (summary.websocketEventsPerMinute > 500) {
      recommendations.push('High websocket activity - consider batching optimization');
    }

    return recommendations;
  }
};

// Make services globally available
global.errorHandler = errorHandler;
global.logger = logger;

logger.info('Optimized enhanced multiplayer services initialized');

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// SECURITY: Add request size limit to prevent memory exhaustion attacks
app.use(express.json({ limit: '1mb' })); // Limit JSON payloads to 1MB

// Basic API routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/rooms', (req, res) => {
  const publicRooms = getPublicRooms();
  logger.info('Rooms requested', { roomCount: publicRooms.length, totalRooms: rooms.size, rooms: publicRooms.map(r => ({ id: r.id, name: r.name, isActive: r.isActive })) });
  res.json(publicRooms);
});

// SECURITY: Add HTTP rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// OpenAI rate limiter removed - endpoint no longer exists

// Request tracing middleware (adds request IDs)
app.use(requestTracer.attachRequestId.bind(requestTracer));

// Performance tracking middleware (lightweight)
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const success = res.statusCode < 400;

    // Log request using structured logger
    logger.logRequest(req, res, duration, success);

    // Track slow requests or errors
    if (!success || duration > 500) {
      logger.warn('Slow or failed request', {
        ...requestTracer.getRequestContext(req),
        duration,
        statusCode: res.statusCode
      });
    }
  });

  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    const performanceSummary = performanceMonitor.getPerformanceSummary();
    const optimizationRecommendations = performanceMonitor.getOptimizationRecommendations();

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      corsOrigins: allowedOrigins,
      realtimeServices: {
        eventBatcher: !!eventBatcher,
        realtimeSync: !!realtimeSync,
        deltaSync: !!deltaSync,
        optimizedFirebase: !!optimizedFirebase
      },
      performance: performanceSummary,
      recommendations: optimizationRecommendations,
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Health check error', { error: error.message, stack: error.stack });
    res.status(500).json({ status: 'ERROR', message: 'Health check failed' });
  }
});

// List public rooms endpoint
app.get('/rooms', (req, res) => {
  res.json(getPublicRooms());
});

// Debug endpoint to check room state - SECURITY: Only available in development
app.get('/debug/rooms', (req, res) => {
  // SECURITY: Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Debug endpoints disabled in production' });
  }

  // SECURITY: Require authentication token in query or header
  const authToken = req.query.token || req.headers['x-debug-token'];
  const expectedToken = process.env.DEBUG_TOKEN;

  // SECURITY: Require strong token - no default fallback in production-like environments
  if (!expectedToken || expectedToken === 'dev-debug-token-change-in-production') {
    logger.warn('DEBUG_TOKEN not set or using default value', { ip: req.ip });
    return res.status(500).json({ error: 'Debug endpoint not configured' });
  }

  if (!authToken || authToken !== expectedToken) {
    logger.warn('Unauthorized debug endpoint access attempt', { ip: req.ip });
    return res.status(401).json({ error: 'Authentication required for debug endpoints' });
  }

  const roomsDebug = Array.from(rooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    gm: room.gm ? { id: room.gm.id, name: room.gm.name } : null, // Don't expose full GM data
    playerCount: room.players.size,
    players: Array.from(room.players.values()).map(p => ({ id: p.id, name: p.name })), // Limited player data
    isActive: room.isActive,
    gmDisconnectedAt: room.gmDisconnectedAt
  }));

  const playersDebug = Array.from(players.entries()).map(([socketId, player]) => ({
    socketId,
    id: player.id,
    name: player.name,
    roomId: player.roomId,
    isGM: player.isGM
    // Don't expose sensitive data
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
      playerCount: room.players.size, // GM is already in room.players, don't add +1
      maxPlayers: room.settings?.maxPlayers || 6,
      gm: room.gm.name,
      createdAt: room.createdAt,
      hasPassword: true, // All rooms now have passwords
      gmOnline: room.isActive !== false // Indicate if GM is currently online
    }));
}
const players = new Map(); // socketId -> { id, name, roomId, isGM }

// MULTIPLAYER: Idempotency tracking for room creation (prevents duplicate rooms from double-clicks)
const roomCreationAttempts = new Map(); // socketId -> { roomId, timestamp, roomName, gmName }
const IDEMPOTENCY_WINDOW_MS = 5000; // 5 second window for idempotency

logger.info('Mythrill VTT Server - Hybrid room system initialized');

// Load persistent rooms from Firebase on startup
const loadPersistentRooms = async () => {
  try {
    const persistentRooms = await firebaseService.loadPersistentRooms();
    for (const roomData of persistentRooms) {
      // Mark as inactive since no one is connected yet
      roomData.isActive = false;
      rooms.set(roomData.id, roomData);
      logger.debug('Loaded persistent room', { roomId: roomData.id, roomName: roomData.name });
    }
    logger.info(`Loaded ${persistentRooms.length} persistent rooms`);
  } catch (error) {
    console.error('❌ Error loading persistent rooms:', error);
  }
};

// Initialize persistent rooms
loadPersistentRooms();

// Helper function to hash room password
async function hashPassword(password) {
  if (!password || password.trim() === '') {
    return null; // No password means no hash
  }
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Helper function to verify room password
async function verifyPassword(plainPassword, hashedPassword) {
  if (!hashedPassword) {
    // If no hash, check if password is also empty
    return !plainPassword || plainPassword.trim() === '';
  }
  if (!plainPassword) {
    return false;
  }
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Room management functions
async function createRoom(roomName, gmName, gmSocketId, password, playerColor = '#4a90e2', _persistToFirebase = true) {
  const roomId = uuidv4();
  const gmPlayerId = uuidv4();

  // Hash password before storing
  const passwordHash = await hashPassword(password);

  const room = {
    id: roomId,
    name: roomName,
    passwordHash: passwordHash, // Store hashed password, never plain text
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
      // Initialize event batching for all rooms to optimize high-frequency events
      if (eventBatcher) {
        eventBatcher.initializeRoom(roomId);
      }
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

  // Save room to Firebase for persistence (so players can resume later)
  if (_persistToFirebase) {
    try {
      await firebaseService.saveRoomData(roomId, room);
      logger.info('Room persisted to Firebase', { roomId, roomName });
    } catch (error) {
      logger.error('Failed to persist room to Firebase', {
        roomId,
        roomName,
        error: error.message
      });
      // Don't fail room creation if Firebase save fails - room still works in-memory
    }
  }

  logger.info('Room created', { roomId, roomName, totalRooms: rooms.size });
  return room;
}

async function joinRoom(roomId, playerName, socketId, password, playerColor = '#4a90e2', character = null) {
  logger.debug('joinRoom called', { roomId, playerName, socketId, roomExists: rooms.has(roomId), totalRooms: rooms.size });

  const room = rooms.get(roomId);

  if (!room) {
    logger.error('❌ Room not found', {
      roomId,
      availableRooms: Array.from(rooms.keys()),
      playerName,
      socketId
    });
    return null;
  }

  logger.debug('Room found', {
    roomId,
    roomName: room.name,
    isActive: room.isActive,
    gmDisconnectedAt: room.gmDisconnectedAt,
    playerCount: room.players.size,
    hasPasswordHash: !!room.passwordHash
  });

  // MULTIPLAYER: Check if room is active (GM hasn't left)
  // Allow joining inactive rooms for multiplayer functionality
  // GM can reconnect later, and guests can still join
  const ROOM_INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  if (!room.isActive && room.gmDisconnectedAt) {
    const inactiveTime = Date.now() - room.gmDisconnectedAt;
    if (inactiveTime > ROOM_INACTIVE_TIMEOUT) {
      logger.debug('Room has been inactive too long, removing', { roomName: room.name, inactiveTime });
      rooms.delete(roomId);
      return { error: 'Room has expired - the GM left too long ago' };
    }
    // Room is inactive but still joinable
    logger.debug('Joining inactive room (GM disconnected)', { roomName: room.name, inactiveTime: Math.round(inactiveTime / 1000) + 's' });
  }

  // MULTIPLAYER: If GM disconnected but room still exists, allow reconnection
  if (room.gmDisconnectedAt && room.gm.name === playerName) {
    logger.info('GM reconnecting to room', { roomName: room.name });
    room.isActive = true;
    room.gmDisconnectedAt = null;
  }

  // Verify password using bcrypt
  logger.debug('Verifying password', { roomName: room.name, hasPasswordHash: !!room.passwordHash, providedPassword: !!password });
  const passwordValid = await verifyPassword(password, room.passwordHash);
  if (!passwordValid) {
    logger.debug('Password mismatch', { roomName: room.name });
    return { error: 'Incorrect password' };
  }
  logger.debug('Password verified successfully', { roomName: room.name });

  // Check if this is the GM joining their own room
  if (room.gm.name === playerName) {
    // Check if GM is already tracked (they should be from room creation)
    const existingGMPlayer = players.get(socketId);
    if (existingGMPlayer && existingGMPlayer.isGM) {
      logger.debug('GM already tracked', { roomName: room.name });
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
      logger.debug('Updated GM character data', {
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
    logger.debug('Room is full', { roomName: room.name, currentPlayers: room.players.size, maxPlayers: room.settings.maxPlayers });
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
      logger.debug('Player should be added to Firebase room members', { playerName, persistentRoomId: room.persistentRoomId });
    } catch (error) {
      logger.warn('Failed to add player to Firebase room members', { error: error.message, playerName, persistentRoomId: room.persistentRoomId });
    }
  }

  logger.info('Player joined room', { playerName, roomName: room.name, totalPlayers: room.players.size + 1 });
  logger.debug('joinRoom completed successfully', { roomId, playerName, isGM: playerName === room.gm.name });
  return { room, player };
}

function leaveRoom(socketId) {
  const player = players.get(socketId);
  if (!player) { return null; }

  const room = rooms.get(player.roomId);
  if (!room) { return null; }

  if (player.isGM) {
    // GM left - mark as inactive but don't delete immediately
    // Allow for reconnection and guest joins
    logger.info('GM left room, marking as inactive', { roomName: room.name, roomId: room.id });
    room.isActive = false;
    room.gmDisconnectedAt = Date.now();
    players.delete(socketId);

    // Don't delete the room - allow guests to join and GM to reconnect
    // Room will be cleaned up by periodic cleanup or when all players leave

    return { type: 'gm_left', room };
  } else {
    // Regular player left
    logger.info('Player left room', { playerName: player.name, roomName: room.name });
    room.players.delete(player.id);
    players.delete(socketId);
    return { type: 'player_left', room, player };
  }
}

// Use the original getPublicRooms function (remove duplicate)


// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/rooms', (req, res) => {
  res.json(getPublicRooms());
});

// Metrics endpoint with observability data
app.get('/metrics', async (req, res) => {
  try {
    const errorStats = errorHandler.getErrorStats();

    res.json({
      performance: {
        activeRequests: requestTracer.getActiveRequestCount(),
        uptime: process.uptime()
      },
      errors: errorStats,
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
    logger.error('Metrics endpoint error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

// Debug endpoint to query recent logs - SECURITY: Only available in development
app.get('/debug/logs', async (req, res) => {
  // SECURITY: Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Debug endpoints disabled in production' });
  }

  // SECURITY: Require authentication token in query or header
  const authToken = req.query.token || req.headers['x-debug-token'];
  const expectedToken = process.env.DEBUG_TOKEN;

  // SECURITY: Require strong token - no default fallback in production-like environments
  if (!expectedToken || expectedToken === 'dev-debug-token-change-in-production') {
    logger.warn('DEBUG_TOKEN not set or using default value', { ip: req.ip });
    return res.status(500).json({ error: 'Debug endpoint not configured' });
  }

  if (!authToken || authToken !== expectedToken) {
    logger.warn('Unauthorized debug endpoint access attempt', { ip: req.ip });
    return res.status(401).json({ error: 'Authentication required for debug endpoints' });
  }

  try {
    const limit = parseInt(req.query.limit) || 100;
    const level = req.query.level || null;

    const logs = await logger.getRecentLogs(limit, level);

    // SECURITY: Sanitize logs to remove sensitive information
    const sanitizedLogs = logs.map(log => {
      const sanitized = { ...log };
      // Remove potential sensitive data
      if (sanitized.message) {
        sanitized.message = sanitized.message.replace(/password[=:]\s*[^\s,}]+/gi, 'password=***');
        sanitized.message = sanitized.message.replace(/token[=:]\s*[^\s,}]+/gi, 'token=***');
      }
      return sanitized;
    });

    res.json({
      count: sanitizedLogs.length,
      logs: sanitizedLogs
    });
  } catch (error) {
    logger.error('Logs endpoint error', { error: error.message });
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

// OpenAI endpoint removed - item generation uses built-in logic

// Helper function to update gameState using delta sync with conflict resolution
async function updateGameStateWithDelta(roomId, newGameState, metadata = {}) {
  try {
    // Use delta sync with conflict resolution for simultaneous updates
    const deltaUpdate = await deltaSync.createStateUpdateWithConflictResolution(roomId, newGameState, metadata);

    if (deltaUpdate && deltaUpdate.delta) {
      // Use delta for efficient sync
      return {
        useDelta: true,
        delta: deltaUpdate.delta,
        versionId: deltaUpdate.id
      };
    }

    // Fallback to full state if delta is null (no changes)
    return {
      useDelta: false,
      fullState: newGameState
    };
  } catch (error) {
    logger.warn('Delta sync failed, using full state update', { roomId, error: error.message });
    return {
      useDelta: false,
      fullState: newGameState
    };
  }
}

// Track player viewports for filtering updates
const playerViewports = new Map(); // socketId -> { x, y, width, height, zoom }

// Helper function to check if position is in viewport
function isInViewport(position, viewport, margin = 200) {
  if (!viewport) return true; // If no viewport, send all updates (fallback)

  const { x, y, width, height, zoom = 1 } = viewport;
  const scaledWidth = (width || 1920) / zoom;
  const scaledHeight = (height || 1080) / zoom;

  // Check if position is within viewport bounds (with margin for smooth updates)
  return position.x >= (x - margin) &&
    position.x <= (x + scaledWidth + margin) &&
    position.y >= (y - margin) &&
    position.y <= (y + scaledHeight + margin);
}

// Helper function to get viewport for a player
function getPlayerViewport(socketId) {
  return playerViewports.get(socketId);
}

// Helper function to validate room membership
function validateRoomMembership(socket, roomId, requireGM = false) {
  const player = players.get(socket.id);
  if (!player) {
    return { valid: false, error: 'Player not found' };
  }

  if (player.roomId !== roomId) {
    return { valid: false, error: 'Not a member of this room' };
  }

  if (requireGM && !player.isGM) {
    return { valid: false, error: 'GM privileges required' };
  }

  const room = rooms.get(roomId);
  if (!room) {
    return { valid: false, error: 'Room not found' };
  }

  // Additional check: verify player is actually in room's players map or is GM
  if (!player.isGM && !room.players.has(player.id)) {
    return { valid: false, error: 'Not a member of this room' };
  }

  return { valid: true, player, room };
}

// Helper to wrap socket handlers with error handling
const wrapSocketHandler = (handler) => {
  return async (data) => {
    try {
      await handler(data);
    } catch (error) {
      logger.error('Socket handler error', {
        error: error.message,
        stack: error.stack,
        socketId: this.id,
        event: handler.name || 'unknown'
      });

      // Send error to client
      this.emit('error', {
        message: 'An error occurred processing your request',
        errorId: await errorHandler.handleError(error, {
          socketId: this.id
        }).then(r => r.id).catch(() => null)
      });
    }
  };
};

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info('Player connected', { socketId: socket.id });

  // Minimal handler for testing
  socket.on('ping', (data, callback) => {
    if (callback) callback('pong');
  });

  // Create room handler - ENHANCED with password support
  socket.on('create_room', async (data) => {
    try {
      logger.info('Create room request', { socketId: socket.id, roomName: data.roomName });

      // Basic validation
      if (!data.roomName || !data.gmName) {
        socket.emit('error', { message: 'Room name and GM name are required' });
        return;
      }

      // SECURITY: Sanitize room name and GM name
      const roomName = sanitizeRoomName(data.roomName);
      const gmName = sanitizePlayerName(data.gmName);

      // Hash password if provided (empty password = no password required)
      let passwordHash = null;
      if (data.password && data.password.trim()) {
        passwordHash = await bcrypt.hash(data.password.trim(), 10);
        logger.debug('Password hash created for room');
      }

      // Create room structure with password support
      // Use persistentRoomId if provided, otherwise generate a new one
      const roomId = data.persistentRoomId || `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const room = {
        id: roomId,
        persistentRoomId: data.persistentRoomId || null,
        name: roomName,
        passwordHash: passwordHash, // Store hashed password (null = no password)
        hasPassword: !!passwordHash, // Flag for clients to know if password is required
        gm: {
          id: socket.id, // Add id for player identification
          socketId: socket.id,
          name: gmName,
          isGM: true,
          color: data.playerColor || '#d4af37',
          character: data.character || null // Include GM's character data for HUD display
        },
        players: new Map(),
        settings: {
          maxPlayers: 5, // GM + 5 players
          allowSpectators: true
        },
        gameState: data.gameState || {
          tokens: {},
          gridItems: {},
          characters: {},
          backgrounds: [],
          combat: { isActive: false, currentTurn: null, turnOrder: [], round: 0 }
        },
        chatHistory: [],
        isActive: true,
        createdAt: new Date()
      };

      // Store room
      rooms.set(roomId, room);
      logger.info('Room stored in rooms Map', { roomId, roomCount: rooms.size, hasPassword: room.hasPassword });

      // Add GM to room
      room.players.set(socket.id, room.gm);

      // Track player for cleanup
      players.set(socket.id, {
        id: socket.id,
        name: gmName,
        roomId: roomId,
        isGM: true
      });

      logger.info('GM added to room', { roomId, playerCount: room.players.size });

      // Join socket to room channel
      socket.join(roomId);
      logger.info('Socket joined room channel', { roomId, socketId: socket.id });

      // Emit success with room data
      socket.emit('room_created', {
        roomId: roomId,
        room: {
          id: roomId,
          persistentRoomId: room.persistentRoomId,
          name: room.name,
          name: room.name,
          playerCount: room.players.size, // GM is already in players map
          hasPassword: room.hasPassword,
          gm: room.gm
        }
      });

      // Emit room_joined event to auto-join the creator
      socket.emit('room_joined', {
        roomId: roomId,
        room: {
          id: roomId,
          persistentRoomId: room.persistentRoomId,
          name: room.name,
          playerCount: room.players.size, // GM is already in players map
          gm: room.gm,
          players: Array.from(room.players.values()),
          gameState: room.gameState
        },
        isGMReconnect: true,
        isGM: true, // Room creator is always GM
        player: room.gm // Send GM as the current player
      });

      // Notify all clients about the new room
      io.emit('room_list_updated', getPublicRooms());

      logger.info('Room created and joined successfully', { roomId, socketId: socket.id, roomData: { id: roomId, name: room.name, playerCount: room.players.size } });

    } catch (error) {
      logger.error('Error creating room', { error: error.message, socketId: socket.id });
      socket.emit('error', { message: 'Failed to create room' });
    }
  });

  // Join room handler - ENHANCED with password verification
  socket.on('join_room', async (data) => {
    try {
      logger.info('Join room request', { socketId: socket.id, roomId: data.roomId, playerName: data.playerName });

      const room = rooms.get(data.roomId);
      if (!room) {
        logger.warn('Room not found', { roomId: data.roomId, availableRooms: Array.from(rooms.keys()) });
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Basic validation
      if (!data.playerName) {
        socket.emit('error', { message: 'Player name is required' });
        return;
      }

      // SECURITY: Sanitize player name
      const playerName = sanitizePlayerName(data.playerName);

      // Check if this is the GM reconnecting - IMPROVED: More robust GM detection
      // Only consider it a GM reconnect if:
      // 1. The room has a GM
      // 2. The name matches the GM's name
      // 3. Either: the GM socket disconnected (room.gmDisconnectedAt is set) OR this exact socket was already tracked as GM
      const existingPlayer = players.get(socket.id);
      const isGMReconnect = room.gm &&
        room.gm.name === playerName &&
        (room.gmDisconnectedAt || (existingPlayer && existingPlayer.isGM));

      // SECURITY: Verify password if room has one (skip for GM reconnect)
      if (room.passwordHash && !isGMReconnect) {
        const providedPassword = data.password || '';
        const passwordMatch = await bcrypt.compare(providedPassword, room.passwordHash);
        if (!passwordMatch) {
          logger.warn('Invalid room password', { roomId: data.roomId, playerName });
          socket.emit('error', { message: 'Incorrect password' });
          return;
        }
        logger.debug('Password verified successfully');
      }

      // Check if room is full (excluding GM)
      const nonGMPlayers = Array.from(room.players.values()).filter(p => !p.isGM);
      if (!isGMReconnect && nonGMPlayers.length >= room.settings.maxPlayers) {
        socket.emit('error', { message: 'Room is full' });
        return;
      }

      // Create player object - IMPORTANT: isGM should ONLY be true for GM reconnect
      const player = {
        id: socket.id, // Add id for player identification
        socketId: socket.id,
        name: playerName,
        isGM: isGMReconnect, // Only true if this is actually the GM reconnecting
        color: data.playerColor || '#4a90e2',
        character: data.character || null
      };

      // Handle GM reconnection
      if (isGMReconnect) {
        room.gm.id = socket.id; // Update ID to current socket ID
        room.gm.socketId = socket.id;
        room.gm.character = player.character; // Refresh GM character data
        room.isActive = true;
        room.gmDisconnectedAt = null; // Clear the disconnect timestamp
        player.isGM = true;
        logger.info('GM reconnected to room', { roomId: data.roomId, gmName: playerName });
      }

      // Add player to room
      room.players.set(socket.id, player);

      // Track player for cleanup
      players.set(socket.id, {
        id: socket.id,
        name: playerName,
        roomId: data.roomId,
        isGM: isGMReconnect
      });

      // Join socket to room channel
      socket.join(data.roomId);

      // Emit success with full room data
      socket.emit('room_joined', {
        roomId: data.roomId,
        room: {
          id: data.roomId,
          persistentRoomId: room.persistentRoomId,
          name: room.name,
          playerCount: room.players.size,
          gm: room.gm,
          players: Array.from(room.players.values()),
          gameState: room.gameState,
          chatHistory: room.chatHistory || []
        },
        isGMReconnect: isGMReconnect,
        isGM: isGMReconnect, // Explicit flag for client to use
        player: player // Send the current player object
      });

      // Notify others in room about the new player
      // Respect the player's GM status (especially for GM reconnection)
      socket.to(data.roomId).emit('player_joined', {
        player: player,
        playerCount: room.players.size
      });

      // Broadcast room list update (player counts changed)
      io.emit('room_list_updated', getPublicRooms());

      logger.info('Player joined room successfully', { roomId: data.roomId, socketId: socket.id, playerName, isGM: isGMReconnect });

    } catch (error) {
      logger.error('Error joining room', { error: error.message, socketId: socket.id });
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle disconnection - ENHANCED with player tracking and room list broadcast
  socket.on('disconnect', () => {
    logger.info('Player disconnected', { socketId: socket.id });

    // Get player info for cleanup
    const player = players.get(socket.id);
    const wasInRoom = !!player?.roomId;

    // Clean up from players tracking
    players.delete(socket.id);

    // Basic cleanup - remove from all rooms
    for (const [roomId, room] of rooms.entries()) {
      if (room.players.has(socket.id)) {
        const disconnectedPlayer = room.players.get(socket.id);
        const wasGM = disconnectedPlayer?.isGM || (room.gm && room.gm.socketId === socket.id);

        room.players.delete(socket.id);

        // If GM disconnected, mark room as inactive but don't delete
        if (wasGM) {
          room.isActive = false;
          room.gmDisconnectedAt = new Date();
          logger.info('GM disconnected - room marked inactive', { roomId, gmName: disconnectedPlayer?.name });

          // Notify others that GM disconnected
          socket.to(roomId).emit('gm_disconnected', {
            roomId: roomId,
            message: 'The Game Master has left the realm. The room remains, awaiting their return.'
          });
        } else {
          // Notify others about player leaving - use format client expects
          socket.to(roomId).emit('player_left', {
            player: {
              id: socket.id,
              name: disconnectedPlayer?.name || 'Unknown'
            },
            playerCount: room.players.size
          });
        }

        // Only delete room if empty AND not a persistent room
        if (room.players.size === 0 && !room.persistentRoomId) {
          rooms.delete(roomId);
          logger.info('Room cleaned up - no players remaining', { roomId });
        }
      }
    }

    // Broadcast room list update if player was in a room
    if (wasInRoom) {
      io.emit('room_list_updated', getPublicRooms());
    }
  });

  // ========== GAME SYNC HANDLERS (from original implementation) ==========
  // These handlers enable real-time game synchronization between players

  // NOTE: The create_room handler from original implementation is skipped
  // as we already have an enhanced version above. Starting from chat_message handler.

  // PLACEHOLDER - Additional handlers will be added from the commented block
  // For now, let's add critical sync handlers inline

  // Chat message handler
  socket.on('chat_message', async (data) => {
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

      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sender: player.name,
        senderId: socket.id,
        content: data.message,
        type: data.type || 'chat',
        timestamp: new Date().toISOString(),
        isGM: player.isGM
      };

      // Add to room chat history
      if (!room.chatHistory) room.chatHistory = [];
      room.chatHistory.push(message);

      // Keep only last 100 messages
      if (room.chatHistory.length > 100) {
        room.chatHistory = room.chatHistory.slice(-100);
      }

      // Broadcast to all players in room
      io.to(player.roomId).emit('chat_message', message);

      logger.debug('Chat message sent', { roomId: player.roomId, sender: player.name });
    } catch (error) {
      logger.error('Error handling chat message', { error: error.message });
    }
  });

  // DISABLED: Duplicate token_moved handler - there's a more sophisticated one at line 2414
  // Having two handlers causes duplicate broadcasts and position conflicts (GM seeing tokens reset)
  /*
  // Token moved handler - critical for game sync
  socket.on('token_moved', async (data) => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      const tokenId = data.tokenId || data.creatureId;

      // Update token position in game state
      if (!room.gameState) room.gameState = { tokens: {} };
      if (!room.gameState.tokens) room.gameState.tokens = {};

      room.gameState.tokens[tokenId] = {
        ...room.gameState.tokens[tokenId],
        position: data.position
      };

      // Broadcast to other players in room - pass through ALL client data
      socket.to(player.roomId).emit('token_moved', {
        ...data, // Pass through all data from client
        tokenId: tokenId,
        creatureId: tokenId, // Ensure both IDs are present
        playerId: socket.id,
        playerName: player.name
      });

      logger.debug('Token moved broadcast', { roomId: player.roomId, tokenId });
    } catch (error) {
      logger.error('Error handling token_moved', { error: error.message });
    }
  });
  */

  // DISABLED: Duplicate token_created handler - there's a more sophisticated one at line ~3419
  // Having two handlers causes conflicts and the first one only broadcasts to others (socket.to)
  // while the enhanced one broadcasts to all including sender (io.to)
  /*
  // Token created handler
  socket.on('token_created', async (data) => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      // Add token to game state
      if (!room.gameState) room.gameState = { tokens: {}, creatures: [] };
      if (!room.gameState.tokens) room.gameState.tokens = {};
      if (!room.gameState.creatures) room.gameState.creatures = [];

      const tokenId = data.token?.id || data.tokenId || `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const creatureId = data.creature?.id || data.creatureId;

      room.gameState.tokens[tokenId] = {
        ...data.token,
        id: tokenId,
        creatureId: creatureId,
        createdBy: socket.id
      };

      if (data.creature) {
        room.gameState.creatures.push(data.creature);
      }

      // Broadcast to OTHER players in room (not the sender)
      socket.to(player.roomId).emit('token_created', {
        ...data, // Pass through all data
        tokenId: tokenId,
        creatureId: creatureId,
        playerId: socket.id,
        playerName: player.name
      });

      logger.debug('Token created broadcast', { roomId: player.roomId, tokenId, creatureId });
    } catch (error) {
      logger.error('Error handling token_created', { error: error.message });
    }
  });
  */

  // DISABLED: Duplicate map_update handler - there's a more sophisticated one at line ~2961
  // Having two handlers causes conflicts and uses wrong event name (map_update vs map_updated)
  /*
  // Map update handler
  socket.on('map_update', async (data) => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      // Only GM can update map
      if (!player.isGM) {
        socket.emit('error', { message: 'Only the GM can update the map' });
        return;
      }

      // Update map data in game state
      if (!room.gameState) room.gameState = {};
      room.gameState.mapData = {
        ...room.gameState.mapData,
        ...data.mapData
      };

      // Broadcast to all players in room
      socket.to(player.roomId).emit('map_update', {
        mapData: data.mapData,
        playerId: socket.id
      });
    } catch (error) {
      logger.error('Error handling map_update', { error: error.message });
    }
  });
  */

  // Grid item update handler
  socket.on('grid_item_update', async (data) => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      // Update grid items in game state
      if (!room.gameState) room.gameState = {};
      if (!room.gameState.gridItems) room.gameState.gridItems = {};

      room.gameState.gridItems[data.data.gridItemId] = data.data;

      // CRITICAL FIX: Persist to Firebase to ensure items survive reconnection
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist grid item update:', error);
      }

      // Broadcast to all OTHER players in room to avoid echo/jumping for the sender
      // Include playerId so clients can still verify if needed
      socket.to(player.roomId).emit('grid_item_update', {
        ...data,
        playerId: socket.id
      });
    } catch (error) {
      logger.error('Error handling grid_item_update', { error: error.message });
    }
  });

  // Item dropped handler
  socket.on('item_dropped', async (data) => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      // CRITICAL FIX: Initialize gridItems correctly for loot orb sync
      if (!room.gameState) room.gameState = {};
      if (!room.gameState.gridItems) room.gameState.gridItems = {};

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

      // Broadcast item drop to ALL players in room (including dropper for confirmation)
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
    } catch (error) {
      logger.error('Error handling item_dropped', { error: error.message });
    }
  });

  // Character update handler
  socket.on('character_updated', async (data) => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      // Update character in game state
      if (!room.gameState) room.gameState = {};
      if (!room.gameState.characters) room.gameState.characters = {};

      room.gameState.characters[data.characterId] = data.character;

      // Update player's character reference
      const roomPlayer = room.players.get(socket.id);
      if (roomPlayer) {
        roomPlayer.character = data.character;
      }

      // Broadcast to other players in room
      socket.to(player.roomId).emit('character_updated', {
        characterId: data.characterId,
        character: data.character,
        playerId: socket.id
      });
    } catch (error) {
      logger.error('Error handling character_updated', { error: error.message });
    }
  });

  // Request full sync handler - sends current game state to requesting player
  socket.on('request_full_sync', () => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      // Send full game state to the requesting player
      socket.emit('full_sync', {
        gameState: room.gameState || {},
        players: Array.from(room.players.values()),
        gm: room.gm,
        chatHistory: room.chatHistory || []
      });

      logger.debug('Full sync sent to player', { socketId: socket.id, roomId: player.roomId });
    } catch (error) {
      logger.error('Error handling request_full_sync', { error: error.message });
    }
  });

  // Player left notification - notify remaining players
  socket.on('leave_room', () => {
    try {
      const player = players.get(socket.id);
      if (!player) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      const roomId = player.roomId;
      const playerName = player.name;

      // Remove player from room
      room.players.delete(socket.id);
      socket.leave(roomId);

      // Notify others - send in format client expects
      socket.to(roomId).emit('player_left', {
        player: {
          id: socket.id,
          name: playerName
        },
        playerCount: room.players.size
      });

      // Clean up player tracking
      players.delete(socket.id);

      // Broadcast room list update
      io.emit('room_list_updated', getPublicRooms());

      logger.info('Player left room', { socketId: socket.id, roomId: roomId });
    } catch (error) {
      logger.error('Error handling leave_room', { error: error.message });
    }
  });

});

// ========== END OF SOCKET CONNECTION HANDLER ==========

// The following commented block contains the original full implementation
// It is kept for reference but the essential handlers have been integrated above

/*
// Original io.on('connection') handler - commented out, handlers integrated above
io.on('connection', (socket) => {
  logger.info('Player connected', { socketId: socket.id });

  // SKIPPED: create_room - already handled above
  // SKIPPED: join_room - already handled above
  
  // NOTE: The handlers below are from the original implementation
  // Critical handlers have been extracted and added to the active connection block above
  
  socket.on('create_room', async(data) => {
    try {
      logger.debug('Received create_room request', { socketId: socket.id, roomName: data.roomName });
      
      // SECURITY: Sanitize user input
      const roomName = sanitizeRoomName(data.roomName);
      const gmName = sanitizePlayerName(data.gmName);
      const password = data.password; // Password doesn't need sanitization (will be hashed)

      if (!roomName || !gmName) {
        logger.warn('Missing required fields for room creation', { socketId: socket.id, hasRoomName: !!roomName, hasGmName: !!gmName });
        socket.emit('error', { message: 'Room name and GM name are required' });
        return;
      }

      // MULTIPLAYER: Check for idempotency (prevent duplicate room creation from double-clicks)
      const existingAttempt = roomCreationAttempts.get(socket.id);
      const now = Date.now();
      
      if (existingAttempt && 
          (now - existingAttempt.timestamp) < IDEMPOTENCY_WINDOW_MS &&
          existingAttempt.roomName === roomName &&
          existingAttempt.gmName === gmName) {
        // Duplicate request within idempotency window - return existing room
        logger.debug('Idempotent room creation request detected', { 
          socketId: socket.id, 
          existingRoomId: existingAttempt.roomId 
        });
        
        const existingRoom = rooms.get(existingAttempt.roomId);
        if (existingRoom) {
          socket.join(existingRoom.id);
          socket.emit('room_created', {
            room: {
              id: existingRoom.id,
              name: existingRoom.name,
              gm: existingRoom.gm,
              players: Array.from(existingRoom.players.values()),
              settings: existingRoom.settings
            }
          });
          return;
        }
      }

    logger.debug('Creating room', { roomName, gmName, socketId: socket.id, hasPassword: !!password });
    const room = await createRoom(roomName, gmName, socket.id, password, data.playerColor);
    logger.info('✅ Room created successfully', { roomId: room.id, roomName, totalRooms: rooms.size });

    // MULTIPLAYER: Track room creation for idempotency
    roomCreationAttempts.set(socket.id, {
      roomId: room.id,
        timestamp: now,
        roomName: roomName,
        gmName: gmName
      });
      
      // Clean up old idempotency entries
      setTimeout(() => {
        roomCreationAttempts.delete(socket.id);
      }, IDEMPOTENCY_WINDOW_MS);
      
      socket.join(room.id);

      logger.info('Room created successfully', { roomId: room.id, totalRooms: rooms.size });

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
      logger.debug('Broadcasting room list update', { roomCount: publicRooms.length });
      io.emit('room_list_updated', publicRooms);

      // Auto-invite party members if provided
      if (data.partyMembers && Array.isArray(data.partyMembers) && data.partyMembers.length > 0) {
        logger.info('Auto-inviting party members to room', { 
          roomName: room.name,
          memberCount: data.partyMembers.length,
          members: data.partyMembers.map(m => m.name)
        });

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
            logger.debug('Party auto-invite sent', { 
              gmName, 
              memberName: member.name, 
              roomName: room.name 
            });
          } else {
            logger.debug('Party member not online', { memberName: member.name });
          }
        });
      }

      // Performance tracking disabled

    } catch (error) {
      const errorResult = await errorHandler.handleError(error, {
        socketId: socket.id,
        roomName: data.roomName,
        event: 'create_room'
      });

      logger.error('Error creating room', {
        socketId: socket.id,
        error: error.message,
        errorId: errorResult.id
      });

      socket.emit('error', {
        message: 'Failed to create room',
        errorId: errorResult.id
      });
    }
  });
  
  // Join an existing room
  socket.on('join_room', async (data) => {
    console.log('🚪 JOIN_ROOM EVENT RECEIVED:', {
      socketId: socket.id,
      roomId: data.roomId,
      playerName: data.playerName,
      hasPassword: !!data.password,
      authenticated: socket.data.authenticated,
      isGuest: socket.data.isGuest
    });

    logger.info('🔄 Received join_room request', {
      socketId: socket.id,
      roomId: data.roomId,
      playerName: data.playerName,
      hasPassword: !!data.password,
      authenticated: socket.data.authenticated,
      isGuest: socket.data.isGuest
    });

    try {
    
    // SECURITY: Sanitize user input
    const roomId = data.roomId; // UUID, no sanitization needed
    const playerName = sanitizePlayerName(data.playerName);
    const password = data.password; // Password doesn't need sanitization
    const character = data.character; // Character data will be validated separately

    // Enhanced parameter validation with detailed logging
    if (!roomId || !playerName) {
      logger.warn('Missing required fields for join', {
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
      logger.warn('Empty required fields for join', {
        roomId: roomId.trim() || 'EMPTY',
        playerName: playerName.trim() || 'EMPTY',
        password: password && password.trim() ? '[HIDDEN]' : 'EMPTY',
        socketId: socket.id
      });
      socket.emit('error', { message: 'Room ID and player name cannot be empty' });
      return;
    }

    logger.debug('Attempting to join room', { 
      roomId, 
      totalRooms: rooms.size,
      availableRoomIds: Array.from(rooms.keys())
    });

    logger.debug('Calling joinRoom function', { roomId, playerName, socketId: socket.id });
    const result = await joinRoom(roomId, playerName, socket.id, password, data.playerColor, character);
    logger.debug('joinRoom result', { resultType: result ? (result.error ? 'error' : 'success') : 'null', roomId });

    if (!result) {
      logger.warn('❌ Room not found for join request', { roomId, socketId: socket.id });
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (result.error) {
      logger.error('❌ Join room error', {
        roomId,
        error: result.error,
        socketId: socket.id
      });
      socket.emit('error', { message: result.error });
      return;
    }

      logger.info('✅ Join room successful, emitting room_joined', { roomId, playerName, socketId: socket.id });

      socket.emit('room_joined', {
        room: {
          id: result.room.id,
          name: result.room.name,
          gm: result.room.gm,
          players: Array.from(result.room.players.values()),
          settings: result.room.settings
        },
        player: result.player,
        chatHistory: result.room.chatHistory || [],
        isGM: result.player.name === result.room.gm.name
      });

    } catch (error) {
      logger.error('❌ CRITICAL ERROR in join_room handler', {
        error: error.message,
        stack: error.stack,
        socketId: socket.id,
        roomId: data?.roomId,
        playerName: data?.playerName
      });

      socket.emit('error', { message: 'Internal server error during room join' });
    }
  });
    
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

      // CRITICAL FIX: Send all existing player character data to GM when they reconnect
      // This ensures GM sees correct stats, images, and character data immediately
      if (room.players && room.players.size > 0) {
        room.players.forEach((roomPlayer) => {
          if (roomPlayer.character) {
            logger.debug('Sending player character data to GM', { 
              gmName: playerName, 
              playerName: roomPlayer.name,
              roomId: room.id
            });
            socket.emit('character_updated', {
              characterId: roomPlayer.character.id || roomPlayer.id,
              character: {
                ...roomPlayer.character,
                playerId: roomPlayer.id
              },
              updatedBy: roomPlayer.id,
              updatedByName: roomPlayer.name,
              timestamp: new Date()
            });
          }
        });
      }

      logger.info('GM reconnected to room', { 
        gmName: playerName, 
        roomName: room.name,
        roomId: room.id
      });
    } else if (result.isReconnect) {
      // MULTIPLAYER: Player reconnected - send full state
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
        gameState: room.gameState, // Send full game state for reconnection
        isReconnect: true
      });

      // Notify other players that player reconnected
      socket.to(roomId).emit('player_reconnected', {
        player: {
          id: player.id,
          name: player.name
        },
        message: `${player.name} has reconnected`
      });

      logger.info('Player reconnected to room', { 
        playerName, 
        roomName: room.name,
        roomId: room.id
      });
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
      logger.debug('Broadcasting player_joined event', { 
        roomId, 
        playerName: player.name,
        currentPlayers: Array.from(room.players.values()).map(p => p.name)
      });

      // Calculate accurate player count: GM + regular players
      // Note: GM is already in the players map in most cases, but let's be safe
      // If GM is in players map, size is accurate. If not, size + 1.
      const gmInPlayers = Array.from(room.players.values()).some(p => p.id === room.gm?.id);
      const totalPlayerCount = room.players.size + (gmInPlayers ? 0 : 1);

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
      logger.debug('Broadcasting player_joined', {
        hasCharacter: !!player.character,
        hasTokenSettings: !!player.character?.tokenSettings,
        hasLore: !!player.character?.lore,
        hasCharacterImage: !!player.character?.lore?.characterImage
      });

      // Also send a separate player count update to ensure all clients have the correct count
      io.to(roomId).emit('player_count_updated', {
        playerCount: totalPlayerCount
      });

      logger.info('Player joined room', { 
        playerName, 
        roomName: room.name,
        roomId: room.id,
        totalPlayers: totalPlayerCount
      });
    }

    // Send current grid items to the newly joined player
    if (room.gameState.gridItems && Object.keys(room.gameState.gridItems).length > 0) {
      logger.debug('Sending grid items to player', { 
        playerName,
        gridItemCount: Object.keys(room.gameState.gridItems).length,
        roomId: room.id
      });
      socket.emit('sync_grid_items', {
        gridItems: room.gameState.gridItems
      });
    }

    // Send current tokens to the newly joined player
    if (room.gameState.tokens && Object.keys(room.gameState.tokens).length > 0) {
      logger.debug('Sending tokens to player', { 
        playerName,
        tokenCount: Object.keys(room.gameState.tokens).length,
        roomId: room.id
      });
      socket.emit('sync_tokens', {
        tokens: room.gameState.tokens
      });
    }

    // Send current character tokens to the newly joined player
    if (room.gameState.characterTokens && Object.keys(room.gameState.characterTokens).length > 0) {
      logger.debug('Sending character tokens to player', { 
        playerName,
        characterTokenCount: Object.keys(room.gameState.characterTokens).length,
        roomId: room.id
      });
      socket.emit('sync_character_tokens', {
        characterTokens: room.gameState.characterTokens
      });
    }

    // Send map data (terrain, fog, walls, etc.) to the newly joined player
    if (room.gameState.mapData && Object.keys(room.gameState.mapData).length > 0) {
      logger.debug('Sending map data to player', { playerName, roomId: room.id });
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

    // CRITICAL FIX: Send all existing character data to the newly joined player
    // This ensures they see correct stats, images, and character data immediately
    if (room.gm && room.gm.character) {
      logger.debug('Sending GM character data to player', { playerName, roomId: room.id });
      socket.emit('character_updated', {
        characterId: room.gm.character.id || room.gm.id,
        character: {
          ...room.gm.character,
          playerId: room.gm.id
        },
        updatedBy: room.gm.id,
        updatedByName: room.gm.name,
        timestamp: new Date()
      });
    }

    // Send all other players' character data
    if (room.players && room.players.size > 0) {
      room.players.forEach((roomPlayer) => {
        if (roomPlayer.character) {
          logger.debug('Sending player character data', { 
            targetPlayer: playerName,
            sourcePlayer: roomPlayer.name,
            roomId: room.id
          });
          socket.emit('character_updated', {
            characterId: roomPlayer.character.id || roomPlayer.id,
            character: {
              ...roomPlayer.character,
              playerId: roomPlayer.id
            },
            updatedBy: roomPlayer.id,
            updatedByName: roomPlayer.name,
            timestamp: new Date()
          });
        }
      });
    }

    // Removed: Duplicate token syncing code

    // Broadcast room list update to all connected clients
    io.emit('room_list_updated', getPublicRooms());
  });
  
  // Handle chat messages
  socket.on('chat_message', async(data) => {
    logger.debug('Received chat message', { 
      socketId: socket.id,
      messageLength: data.message?.length || 0,
      roomId: data.roomId
    });
    // SECURITY: Validate room membership
    const player = players.get(socket.id);
    if (!player || !player.roomId) {
      logger.warn('Chat message from player not in room', { socketId: socket.id });
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const validation = validateRoomMembership(socket, player.roomId);
    if (!validation.valid) {
      socket.emit('error', { message: validation.error });
      logger.warn('Unauthorized chat_message attempt', { socketId: socket.id, roomId: player.roomId });
      return;
    }

    const room = validation.room;

    logger.debug('Processing chat message', { 
      playerName: player.name, 
      roomName: room.name,
      roomId: room.id
    });

    // SECURITY: Sanitize chat message to prevent XSS
    const sanitizedMessage = sanitizeChatMessage(data.message);
    if (!sanitizedMessage || sanitizedMessage.trim() === '') {
      socket.emit('error', { message: 'Message cannot be empty' });
      return;
    }

    // Get player color with improved lookup logic
    let playerColor = player.color || '#4a90e2'; // Use color from players tracking first

    if (player.isGM) {
      // For GM, use the color from room.gm or fallback to player tracking
      playerColor = room.gm.color || player.color || '#d4af37'; // Gold default for GM
      logger.debug('Using GM color for chat', { color: playerColor });
    } else {
      // For regular players, check room.players Map for most up-to-date color
      const roomPlayer = room.players.get(player.id);
      if (roomPlayer && roomPlayer.color) {
        playerColor = roomPlayer.color;
        logger.debug('Using room player color for chat', { 
          color: playerColor, 
          playerName: player.name
        });
      } else {
        logger.debug('Using tracked player color for chat', { 
          color: playerColor, 
          playerName: player.name
        });
      }
    }

    const message = {
      id: uuidv4(),
      playerId: player.id,
      playerName: player.name,
      playerColor: playerColor,
      isGM: player.isGM,
      content: sanitizedMessage, // Use sanitized message
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
    logger.debug('Broadcasting chat message', { 
      roomId: player.roomId,
      messageLength: message.content?.length || 0
    });
    io.to(player.roomId).emit('chat_message', message);

    logger.info('Chat message processed', { 
      playerName: player.name, 
      roomName: room.name,
      roomId: room.id
    });
  });

  // Handle typing indicators
  socket.on('user_typing', (_data) => {
    const player = players.get(socket.id);
    if (!player) {return;}

    const room = rooms.get(player.roomId);
    if (!room) {return;}

    // Broadcast typing indicator to other players in the room
    socket.to(room.id).emit('user_typing', {
      playerId: player.id,
      playerName: player.name
    });
  });

  socket.on('user_stopped_typing', (_data) => {
    const player = players.get(socket.id);
    if (!player) {return;}

    const room = rooms.get(player.roomId);
    if (!room) {return;}

    // Broadcast stopped typing to other players in the room
    socket.to(room.id).emit('user_stopped_typing', {
      playerId: player.id,
      playerName: player.name
    });
  });

  // Handle viewport updates for selective sync
  socket.on('update_viewport', (viewportData) => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) {return;}

    // Update player's viewport in the real-time sync engine
    if (realtimeSync && typeof realtimeSync.updatePlayerViewport === 'function') {
      realtimeSync.updatePlayerViewport(player.roomId, player.id, viewportData);
    }
  });

  // IMPROVEMENT: Handle ping/pong for latency measurement
  socket.on('ping', (data, callback) => {
    if (typeof callback === 'function') {
      callback({ timestamp: data.timestamp, serverTime: Date.now() });
    }
  });

  // Handle cursor position updates for multiplayer awareness
  socket.on('cursor_update', (cursorData) => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) {return;}

    // Broadcast cursor position to other players in the room
    socket.to(player.roomId).emit('cursor_update', {
      playerId: player.id,
      playerName: player.name,
      x: cursorData.x,
      y: cursorData.y,
      timestamp: cursorData.timestamp
    });
  });

  // Handle combat actions with lag compensation
  socket.on('combat_action', (actionData) => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) {return;}

    // Use lag compensation to predict the action
    if (lagCompensation && typeof lagCompensation.predictCombatAction === 'function') {
      const predictedAction = lagCompensation.predictCombatAction(socket.id, actionData);

      // Process the combat action
      handleCombatAction(player.roomId, player.id, actionData, predictedAction);
    }
  });

  // Handle combat state synchronization requests
  socket.on('request_combat_sync', () => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) {return;}

    const room = rooms.get(player.roomId);
    if (!room) {return;}

    // Send current combat state
    socket.emit('combat_state_sync', {
      combat: room.gameState?.combat || {
        isActive: false,
        currentTurn: null,
        turnOrder: [],
        round: 0
      },
      timestamp: Date.now()
    });
  });

  // Handle dialogue messages
  socket.on('dialogue_message', async(data) => {
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
  socket.on('token_moved', async(data) => {
    // SECURITY: Validate room membership
    const player = players.get(socket.id);
    if (!player || !player.roomId) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const validation = validateRoomMembership(socket, player.roomId);
    if (!validation.valid) {
      socket.emit('error', { message: validation.error });
      logger.warn('Unauthorized token_moved attempt', { socketId: socket.id, roomId: player.roomId });
      return;
    }

    const room = validation.room;

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
      if (player.isGM) {
        // DISABLED: Delta sync causing performance issues
        // deltaUpdate = await deltaSync.createStateUpdate(
        //   player.roomId,
        //   room.gameState,
        //   {
        //     type: 'token_movement',
        //     tokenId: tokenKey,
        //     playerId: player.id,
        //     isDragging: data.isDragging
        //   }
        // );
      }

      // Enhanced throttling with conflict detection
      const broadcastKey = `${player.roomId}_${tokenKey}`;
      const now = Date.now();
      if (!global.lastTokenBroadcast) {global.lastTokenBroadcast = new Map();}
      if (!global.tokenMovementConflicts) {global.tokenMovementConflicts = new Map();}

      const lastBroadcast = global.lastTokenBroadcast.get(broadcastKey) || 0;
      const throttleTime = data.isDragging ? 33 : 100; // Increased to ~30fps for dragging, ~10fps for final positions

      // Check for potential conflicts (multiple rapid movements)
      const conflictKey = `${tokenKey}_${player.id}`;
      const lastMovement = global.tokenMovementConflicts.get(conflictKey) || 0;

      // IMPROVEMENT: Better conflict resolution - queue instead of dropping
      if (now - lastMovement < 50) {
        console.log(`🚫 Potential movement conflict detected for token ${tokenKey} by player ${player.name}`);
        // IMPROVEMENT: Queue the movement instead of dropping it to prevent desync
        // Store the queued movement and process it after conflict window
        if (!global.queuedTokenMovements) {
          global.queuedTokenMovements = new Map();
        }
        const queueKey = `${player.roomId}_${tokenKey}`;
        global.queuedTokenMovements.set(queueKey, {
          tokenKey,
          position: data.position,
          player,
          timestamp: now
        });
        
        // Process queued movement after conflict window
        setTimeout(() => {
          const queued = global.queuedTokenMovements.get(queueKey);
          if (queued && queued.player.id === player.id) {
            global.queuedTokenMovements.delete(queueKey);
            // Re-process the movement
            const queuedData = { ...data, position: queued.position };
            socket.emit('token_moved', queuedData);
          }
        }, 100);
        
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

        // OPTIMIZATION: Viewport-based filtering - only send to relevant clients
        const roomSockets = io.sockets.adapter.rooms.get(player.roomId);
        if (roomSockets) {
          for (const socketId of roomSockets) {
            const targetSocket = io.sockets.sockets.get(socketId);
            if (!targetSocket) continue;
            
            const targetPlayer = players.get(socketId);
            if (!targetPlayer) continue;
            
            // GM always receives all updates
            if (targetPlayer.isGM) {
              if (eventBatcher) {
                eventBatcher.addPlayerEvent(player.roomId, targetPlayer.id, {
                  type: 'token_moved',
                  data: tokenMoveData
                }, data.isDragging ? 'normal' : 'high');
              } else {
                targetSocket.emit('token_moved', tokenMoveData);
              }
            } else {
              // For players: only send if token is in their viewport
              const viewport = getPlayerViewport(socketId);
              if (isInViewport(data.position, viewport)) {
                if (eventBatcher) {
                  eventBatcher.addPlayerEvent(player.roomId, targetPlayer.id, {
                    type: 'token_moved',
                    data: tokenMoveData
                  }, data.isDragging ? 'normal' : 'high');
                } else {
                  targetSocket.emit('token_moved', tokenMoveData);
                }
              }
            }
          }
        }
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
  socket.on('character_moved', async(data) => {
    try {
      // SECURITY: Validate room membership
      const player = players.get(socket.id);
      if (!player || !player.roomId) {
        socket.emit('error', { message: 'You are not in a room' });
        return;
      }

      const validation = validateRoomMembership(socket, player.roomId);
      if (!validation.valid) {
        socket.emit('error', { message: validation.error });
        logger.warn('Unauthorized character_moved attempt', { socketId: socket.id, roomId: player.roomId });
        return;
      }

      const room = validation.room;

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
      if (!global.lastCharacterBroadcast) {global.lastCharacterBroadcast = new Map();}
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

        // OPTIMIZATION: Batch high-frequency character movement events
        if (eventBatcher) {
          eventBatcher.addEvent(player.roomId, {
            type: 'character_moved',
            data: movementData
          }, data.isDragging ? 'normal' : 'high');
        } else {
          // Fallback to direct emit if batcher not available
          io.to(player.roomId).emit('character_moved', movementData);
        }

        console.log(`🚶 Character moved by ${player.name} to`, data.position, data.isDragging ? '(dragging)' : '(final)');
      }
    } catch (error) {
      console.error('Error handling character movement:', error);
      socket.emit('error', { message: 'Failed to process character movement' });
    }
  });

  // Handle character token creation
  socket.on('character_token_created', async(data) => {
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
  socket.on('character_updated', async(data) => {
    // SECURITY: Validate room membership
    const player = players.get(socket.id);
    if (!player || !player.roomId) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const validation = validateRoomMembership(socket, player.roomId);
    if (!validation.valid) {
      socket.emit('error', { message: validation.error });
      logger.warn('Unauthorized character_updated attempt', { socketId: socket.id, roomId: player.roomId });
      return;
    }

    const room = validation.room;

    // MIGRATION: Keep minimal character reference in gameState (session-only)
    // Full character data is stored in top-level characters collection
    if (!room.gameState.characters) {
      room.gameState.characters = {};
    }

    // Only store minimal session data in gameState, not full character data
    room.gameState.characters[data.characterId] = {
      characterId: data.characterId,
      name: data.character.name,
      lastUpdatedBy: player.id,
      lastUpdatedAt: new Date(),
      // Store only essential session data, not full character object
      sessionData: {
        health: data.character.health,
        mana: data.character.mana,
        actionPoints: data.character.actionPoints
      }
    };

    // CRITICAL FIX: If this is the GM updating their character, also update room.gm.character
    if (player.isGM && room.gm && room.gm.id === player.id) {
      room.gm.character = {
        ...room.gm.character,
        ...data.character,
        // Preserve GM-specific fields
        name: data.character.name || room.gm.character?.name || room.gm.name
      };
      console.log('👑 Updated GM character data in room:', {
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
        console.log('👥 Updated player character data in room:', {
          playerId: player.id,
          playerName: roomPlayer.name,
          health: roomPlayer.character.health,
          mana: roomPlayer.character.mana,
          actionPoints: roomPlayer.character.actionPoints
        });
      }
    }

    // Persist to Firebase using delta sync for efficiency
    try {
      // Use delta sync for efficient updates
      const updateResult = await updateGameStateWithDelta(
        player.roomId,
        room.gameState,
        { type: 'character_update', characterId: data.characterId, playerId: player.id }
      );
      
      if (updateResult.useDelta) {
        // Use optimized Firebase with delta (character updates are normal priority)
        await optimizedFirebase.updateGameState(player.roomId, room.gameState, updateResult.delta, 'normal');
      } else {
        // Fallback to full state update
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      }
      
      // CRITICAL FIX: Also save individual character document to Firebase
      // This ensures character data is properly saved to user accounts
      // Use userId from data if provided, otherwise try to get from player object
      const userId = data.userId || player.userId;
      if (data.characterId && data.character && userId) {
        try {
          await firebaseService.saveCharacterDocument(
            data.characterId,
            data.character,
            userId
          );
          console.log(`✅ Character document saved to Firebase: ${data.characterId} for user: ${userId}`);
        } catch (charDocError) {
          console.warn('Failed to save character document (room state still saved):', charDocError);
          // Don't fail the whole operation if character doc save fails
        }
      } else if (data.characterId && data.character && !userId) {
        console.warn('⚠️ Cannot save character document - userId not available:', {
          characterId: data.characterId,
          hasDataUserId: !!data.userId,
          hasPlayerUserId: !!player.userId
        });
      }
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
  socket.on('character_equipment_updated', async(data) => {
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

    // MIGRATION: Keep minimal character reference in gameState (session-only)
    // Full character data is stored in top-level characters collection
    if (!room.gameState.characters) {
      room.gameState.characters = {};
    }

    // Only store minimal session data in gameState
    if (!room.gameState.characters[data.characterId]) {
      room.gameState.characters[data.characterId] = {
        characterId: data.characterId,
        lastUpdatedBy: player.id,
        lastUpdatedAt: new Date()
      };
    }

    // Update only session metadata, not full character data
    room.gameState.characters[data.characterId] = {
      ...room.gameState.characters[data.characterId],
      lastEquipmentUpdate: {
        slot: data.slot,
        item: data.item,
        updatedBy: player.id,
        updatedAt: new Date()
      },
      lastUpdatedAt: new Date()
    };

    // Persist to Firebase using delta sync for efficiency
    try {
      const updateResult = await updateGameStateWithDelta(
        player.roomId,
        room.gameState,
        { type: 'equipment_update', characterId: data.characterId, playerId: player.id }
      );
      
      if (updateResult.useDelta) {
        // Equipment updates are low priority (can be batched longer)
        await optimizedFirebase.updateGameState(player.roomId, room.gameState, updateResult.delta, 'low');
      } else {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      }
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

  // Handle map/background changes (GM only for live updates)
  socket.on('map_update', async(data) => {
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

    // IMPROVEMENT: Enhanced validation - Only GM can update map state for live synchronization
    if (!player.isGM) {
      logger.warn('Non-GM player attempted to update map state', {
        playerId: player.id,
        playerName: player.name,
        roomId: player.roomId
      });
      socket.emit('error', { message: 'Only GM can update map state' });
      return;
    }

    // IMPROVEMENT: Validate map update data structure
    if (!data || !data.mapUpdates || typeof data.mapUpdates !== 'object') {
      socket.emit('error', { message: 'Invalid map update data' });
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
      // Handle dndElements sync (connections/portals)
      if (data.mapUpdates.dndElements !== undefined) {
        if (!room.gameState.mapData) {
          room.gameState.mapData = {};
        }
        room.gameState.mapData.dndElements = data.mapUpdates.dndElements;
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

    // CRITICAL FIX: Broadcast map update to ALL players in the room immediately for live updates
    // This ensures players see GM's tiles, fog, and drawings in real-time
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
        dndElements: room.gameState.mapData?.dndElements || [], // Include dndElements (connections) for sync
        ...(data.mapUpdates || data.mapData || {})
      },
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`🗺️ Map updated by GM ${player.name} - broadcasted to all players in room ${player.roomId}`);
  });

  // Handle area remove operations
  socket.on('area_remove', async(data) => {
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
  socket.on('combat_updated', async(data) => {
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
  socket.on('dice_rolled', async(data) => {
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

    // IMPROVEMENT: Store dice roll in room's roll history for replay/debugging
    if (!room.gameState.diceRolls) {
      room.gameState.diceRolls = [];
    }
    room.gameState.diceRolls.push(rollData);
    
    // Keep only last 100 rolls
    if (room.gameState.diceRolls.length > 100) {
      room.gameState.diceRolls = room.gameState.diceRolls.slice(-100);
    }

    // Keep only last 100 messages
    if (room.chatHistory.length > 100) {
      room.chatHistory = room.chatHistory.slice(-100);
    }

    // IMPROVEMENT: Persist dice roll to Firebase with better error handling
    try {
      await firebaseService.addChatMessage(player.roomId, rollMessage);
      
      // Also update room game state to include roll history
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (stateError) {
        console.warn('Failed to persist dice roll history to room state:', stateError);
        // Don't fail the whole operation if state update fails
      }
    } catch (error) {
      console.error('Failed to persist dice roll:', error);
      // Still broadcast the roll even if persistence fails
    }

    // Broadcast dice roll to all players in the room
    io.to(player.roomId).emit('dice_rolled', rollData);
    io.to(player.roomId).emit('chat_message', rollMessage);

    console.log(`${player.name} rolled dice: ${data.results.join(', ')} (Total: ${data.total})`);
  });

  // IMPROVEMENT: Handle spell cast synchronization for multiplayer
  socket.on('spell_cast', async(data) => {
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

    // IMPROVEMENT: Validate spell cast data
    if (!data.spellId || !data.casterId) {
      socket.emit('error', { message: 'Invalid spell cast data' });
      return;
    }

    const castData = {
      id: uuidv4(),
      spellId: data.spellId,
      spellName: data.spellName || 'Unknown Spell',
      casterId: data.casterId,
      casterName: player.name,
      targetIds: data.targetIds || [],
      targetPositions: data.targetPositions || [],
      effects: data.effects || [],
      damage: data.damage || 0,
      healing: data.healing || 0,
      timestamp: new Date(),
      isGM: player.isGM
    };

    // Add to room's spell cast history (for replay/debugging)
    if (!room.gameState.spellCasts) {
      room.gameState.spellCasts = [];
    }
    room.gameState.spellCasts.push(castData);
    
    // Keep only last 50 spell casts
    if (room.gameState.spellCasts.length > 50) {
      room.gameState.spellCasts = room.gameState.spellCasts.slice(-50);
    }

    // Broadcast spell cast to all players in the room
    io.to(player.roomId).emit('spell_cast', castData);

    // Add to chat as a spell message
    const spellMessage = {
      id: uuidv4(),
      playerId: player.id,
      playerName: player.name,
      isGM: player.isGM,
      content: `${player.name} cast ${castData.spellName}${data.targetIds?.length > 0 ? ` on ${data.targetIds.length} target(s)` : ''}`,
      timestamp: new Date(),
      type: 'spell',
      spellData: castData
    };

    room.chatHistory.push(spellMessage);

    // Keep only last 100 messages
    if (room.chatHistory.length > 100) {
      room.chatHistory = room.chatHistory.slice(-100);
    }

    // Persist spell cast to Firebase
    try {
      await firebaseService.addChatMessage(player.roomId, spellMessage);
    } catch (error) {
      console.error('Failed to persist spell cast:', error);
    }

    console.log(`✨ ${player.name} cast ${castData.spellName}`);
  });

  // IMPROVEMENT: Handle ability use synchronization
  socket.on('ability_used', async(data) => {
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

    // Validate ability use data
    if (!data.abilityId || !data.creatureId) {
      socket.emit('error', { message: 'Invalid ability use data' });
      return;
    }

    const abilityData = {
      id: uuidv4(),
      abilityId: data.abilityId,
      abilityName: data.abilityName || 'Unknown Ability',
      creatureId: data.creatureId,
      creatureName: data.creatureName || 'Unknown',
      targetIds: data.targetIds || [],
      effects: data.effects || [],
      damage: data.damage || 0,
      healing: data.healing || 0,
      timestamp: new Date(),
      usedBy: player.id,
      usedByName: player.name,
      isGM: player.isGM
    };

    // Broadcast ability use to all players
    io.to(player.roomId).emit('ability_used', abilityData);

    console.log(`⚔️ ${player.name} used ${abilityData.abilityName} with ${abilityData.creatureName}`);
  });

  // Handle item drops on grid
  socket.on('item_dropped', async(data) => {
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
  socket.on('token_created', async(data) => {
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

    // Create a unique token ID to prevent conflicts - handle missing token object safely
    const tokenId = (data.token && data.token.id) || data.tokenId || `token_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

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
      token: { ...(data.token || {}), id: tokenId },
      position: data.position,
      playerId: socket.id,
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

    // CRITICAL FIX: Remove item from gridItems for loot orb sync
    if (data.gridItemId && room.gameState.gridItems) {
      const gridItem = room.gameState.gridItems[data.gridItemId];
      if (gridItem) {
        console.log(`🎁 Removing looted item ${data.gridItemId} from server state`);
        delete room.gameState.gridItems[data.gridItemId];
        itemRemoved = true;

        // Persist to Firebase
        try {
          await firebaseService.updateRoomGameState(player.roomId, room.gameState);
        } catch (error) {
          console.error('Failed to persist item removal:', error);
        }
      } else {
        console.warn(`⚠️ Grid item ${data.gridItemId} not found for looting`);
      }
    }

    // Broadcast loot event to all players in room (including looter for confirmation)
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

    // IMPROVEMENT: Send complete game state including all necessary data for reconnection
    const fullState = {
      tokens: room.gameState.tokens || {},
      gridItems: room.gameState.gridItems || {},
      characters: room.gameState.characters || {},
      characterTokens: room.gameState.characterTokens || {}, // CRITICAL: Include character tokens
      mapData: room.gameState.mapData || {},
      fogOfWar: room.gameState.fogOfWar || {}, // CRITICAL: Include fog of war
      combat: room.gameState.combat || {
        isActive: false,
        currentTurnIndex: 0,
        turnOrder: [],
        round: 0
      },
      // Include all connected players for party sync
      players: Array.from(room.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        character: p.character || null,
        color: p.color
      })),
      // Include GM data if available
      gm: room.gm ? {
        id: room.gm.id,
        name: room.gm.name,
        character: room.gm.character || null,
        color: room.gm.color
      } : null,
      timestamp: new Date()
    };

    socket.emit('full_game_state_sync', fullState);
    console.log(`✅ Full sync sent to ${player.name} (${Object.keys(fullState.tokens).length} tokens, ${Object.keys(fullState.gridItems).length} items)`);
  });

  // Handle state conflict resolution
  socket.on('resolve_state_conflict', async(data) => {
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

  // Handle game session launch (GM only)
  socket.on('launch_game_session', (_data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can launch game sessions' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Send game session launch notification to all players in the room
    io.to(player.roomId).emit('game_session_launched', {
      gmName: player.name,
      roomName: room.name,
      message: `${player.name} has launched a game session!`,
      timestamp: new Date()
    });

    console.log(`🎮 GM ${player.name} launched game session in room: ${room.name}`);
  });

  // Handle player response to game session launch
  socket.on('respond_to_game_session', (data) => {
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

    // Notify GM of player's response
    const gmSocketId = room.gm.socketId;
    if (gmSocketId) {
      io.to(gmSocketId).emit('game_session_response', {
        playerId: player.id,
        playerName: player.name,
        accepted: data.accepted,
        timestamp: new Date()
      });
    }

    console.log(`🎮 ${player.name} ${data.accepted ? 'accepted' : 'declined'} game session invitation`);
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
  socket.on('character_update', async(data) => {
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

    // Character update processed (real-time sync disabled for performance)
    console.log(`👤 Character ${data.characterId} updated by ${player.name}`);
  });

  // IMPROVEMENT: Handle inventory updates with real-time sync and validation
  socket.on('inventory_update', async(data) => {
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

    // IMPROVEMENT: Validate inventory update data
    if (!data || !data.inventoryData) {
      socket.emit('error', { message: 'Invalid inventory update data' });
      return;
    }

    // IMPROVEMENT: Validate player can only update their own inventory (unless GM)
    const targetPlayerId = data.playerId || player.id;
    if (!player.isGM && targetPlayerId !== player.id) {
      logger.warn('Player attempted to update another player\'s inventory', {
        playerId: player.id,
        targetPlayerId: targetPlayerId,
        roomId: player.roomId
      });
      socket.emit('error', { message: 'You can only update your own inventory' });
      return;
    }

    // Update player activity
    memoryManager.updatePlayerActivity(socket.id);

    // Process with lag compensation
    lagCompensation.processClientInput(socket.id, {
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

  // Handle party updates with real-time sync
  socket.on('party_update', async(data) => {
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

    try {
      // Broadcast party updates to all players in the room
      socket.to(player.roomId).emit('party_update', {
        type: data.type,
        data: data.data,
        playerId: player.id,
        playerName: player.name,
        timestamp: data.timestamp || Date.now()
      });

      // Update room state if needed
      if (data.type === 'member_added') {
        // Add party member to room state if not already present
        if (!room.partyMembers) {room.partyMembers = [];}
        const existingMember = room.partyMembers.find(m => m.id === data.data.id);
        if (!existingMember) {
          room.partyMembers.push(data.data);
        }
      } else if (data.type === 'member_removed') {
        // Remove party member from room state
        if (room.partyMembers) {
          room.partyMembers = room.partyMembers.filter(m => m.id !== data.data.memberId);
        }
      }

      console.log(`👥 Party ${data.type} by ${player.name} in room ${player.roomId}`);
    } catch (error) {
      console.error('Party update error:', error);
      socket.emit('error', { message: 'Failed to update party' });
    }
  });

  // Handle buff updates with real-time sync
  socket.on('buff_update', async(data) => {
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

    try {
      // Broadcast buff updates to all players in the room
      socket.to(player.roomId).emit('buff_update', {
        type: data.type,
        data: data.data,
        playerId: player.id,
        playerName: player.name,
        timestamp: data.timestamp || Date.now()
      });

      console.log(`✨ Buff ${data.type} by ${player.name} in room ${player.roomId}`);
    } catch (error) {
      console.error('Buff update error:', error);
      socket.emit('error', { message: 'Failed to update buff' });
    }
  });

  // Handle debuff updates with real-time sync
  socket.on('debuff_update', async(data) => {
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

    try {
      // Broadcast debuff updates to all players in the room
      socket.to(player.roomId).emit('debuff_update', {
        type: data.type,
        data: data.data,
        playerId: player.id,
        playerName: player.name,
        timestamp: data.timestamp || Date.now()
      });

      console.log(`🧟 Debuff ${data.type} by ${player.name} in room ${player.roomId}`);
    } catch (error) {
      console.error('Debuff update error:', error);
      socket.emit('error', { message: 'Failed to update debuff' });
    }
  });

  // Handle dice updates with real-time sync
  socket.on('dice_update', async(data) => {
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

    try {
      // Broadcast dice updates to all players in the room
      socket.to(player.roomId).emit('dice_update', {
        type: data.type,
        data: data.data,
        playerId: player.id,
        playerName: player.name,
        timestamp: data.timestamp || Date.now()
      });

      console.log(`🎲 Dice ${data.type} by ${player.name} in room ${player.roomId}`);
    } catch (error) {
      console.error('Dice update error:', error);
      socket.emit('error', { message: 'Failed to update dice' });
    }
  });

  // Handle item updates with real-time sync
  socket.on('item_update', async(data) => {
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

    try {
      // Broadcast item updates to all players in the room
      socket.to(player.roomId).emit('item_update', {
        type: data.type,
        data: data.data,
        playerId: player.id,
        playerName: player.name,
        timestamp: data.timestamp || Date.now()
      });

      console.log(`📦 Item ${data.type} by ${player.name} in room ${player.roomId}`);
    } catch (error) {
      console.error('Item update error:', error);
      socket.emit('error', { message: 'Failed to update item' });
    }
  });

  // Handle window updates with real-time sync
  socket.on('window_update', async(data) => {
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

    try {
      // Broadcast window updates to all players in the room
      socket.to(player.roomId).emit('window_update', {
        type: data.type,
        data: data.data,
        playerId: player.id,
        playerName: player.name,
        timestamp: data.timestamp || Date.now()
      });

      console.log(`🪟 Window ${data.type} by ${player.name} in room ${player.roomId}`);
    } catch (error) {
      console.error('Window update error:', error);
      socket.emit('error', { message: 'Failed to update window' });
    }
  });

  // Handle container updates with real-time sync
  socket.on('container_update', async(data) => {
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

    try {
      // Broadcast container updates to all players in the room
      socket.to(player.roomId).emit('container_update', {
        type: data.type,
        data: data.data,
        playerId: player.id,
        playerName: player.name,
        timestamp: data.timestamp || Date.now()
      });

      console.log(`📦 Container ${data.type} by ${player.name} in room ${player.roomId}`);
    } catch (error) {
      console.error('Container update error:', error);
      socket.emit('error', { message: 'Failed to update container' });
    }
  });

  // Handle grid item updates with real-time sync
  socket.on('grid_item_update', async(data) => {
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

    try {
      // Broadcast grid item updates to all players in the room
      socket.to(player.roomId).emit('grid_item_update', {
        type: data.type,
        data: data.data,
        playerId: player.id,
        playerName: player.name,
        timestamp: data.timestamp || Date.now()
      });

      console.log(`🔳 Grid item ${data.type} by ${player.name} in room ${player.roomId}`);
    } catch (error) {
      console.error('Grid item update error:', error);
      socket.emit('error', { message: 'Failed to update grid item' });
    }
  });

  // Handle combat state updates (GM only)
  socket.on('combat_update', async(data) => {
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

  // REMOVED: Duplicate map_update handler - the first handler (line 1264) already handles
  // immediate broadcasting to all players. The realtimeSync service was causing delays.
  // Live map updates (tiles, fog, drawings) are now broadcast immediately via the first handler.

  // Handle UI state synchronization
  socket.on('ui_update', async(data) => {
    const player = players.get(socket.id);
    if (!player) {return;} // UI updates are optional

    const room = rooms.get(player.roomId);
    if (!room) {return;}

    // OPTIMIZED: Real-time UI sync with error handling
    try {
      realtimeSync.updateUI(player.roomId, player.id, data.uiUpdates);
    } catch (error) {
      console.warn('UI sync failed:', error.message);
    }
  });

  // DISABLED: Enhanced services causing lag
  socket.on('network_metrics', (_metrics) => {
    // lagCompensation.updateNetworkMetrics(socket.id, _metrics);
    // eventBatcher.updateClientMetrics(socket.id, _metrics);
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

  // GM shares quest with all players in room
  socket.on('share_quest', (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only the GM can share quests' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    // Broadcast quest to all players in the room
    io.to(player.roomId).emit('quest_shared', {
      quest: data.quest,
      sharedBy: player.name,
      timestamp: new Date().toISOString()
    });

    console.log(`📜 GM ${player.name} shared quest "${data.quest.title}" with room ${room.name}`);
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
  socket.on('global_chat_message', async(message) => {
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
  socket.on('respond_to_invite', async({ inviteId, accepted, roomId, password }) => {
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
    // Note: password should be provided by user, we can't use room.passwordHash (it's hashed)
    const joinData = {
      roomId,
      playerName: user.characterName,
      password: password || '', // User must provide password, empty string if none
      playerColor: '#4a90e2'
    };

    // Trigger join room logic
    socket.emit('auto_join_room', joinData);

    console.log('✅ Invitation accepted:', user.characterName, 'joining room:', room.name);
  });

  // ========== END GLOBAL CHAT & PRESENCE HANDLERS ==========

  // DEBUG: Test socket connectivity
  /*
  socket.on('test_connectivity', (data) => {
    logger.info('🔗 Connectivity test received', { socketId: socket.id, data });
    socket.emit('connectivity_test', {
      success: true,
      serverTime: new Date().toISOString(),
      socketId: socket.id,
      authenticated: socket.data.authenticated,
      isGuest: socket.data.isGuest
    });
  });

  // Handle disconnection
  socket.on('disconnect', async() => {
    logger.info('Player disconnected', { socketId: socket.id });

    // Clean up viewport tracking
    playerViewports.delete(socket.id);

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
    
    // MULTIPLAYER: Clean up idempotency tracking
    roomCreationAttempts.delete(socket.id);

    console.log(`🧹 Enhanced cleanup completed for socket ${socket.id}`);
  });
});
*/


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

// Global error handlers
process.on('uncaughtException', async (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  await errorHandler.handleError(error, { type: 'uncaughtException' });
  // Don't exit in production - let the process manager handle it
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

process.on('unhandledRejection', async (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason?.message || String(reason),
    stack: reason?.stack
  });
  await errorHandler.handleError(
    reason instanceof Error ? reason : new Error(String(reason)),
    { type: 'unhandledRejection' }
  );
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: allowedOrigins
  });
});
