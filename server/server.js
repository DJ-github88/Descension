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

// Firebase Write Batching Service to prevent quota exhaustion
class FirebaseBatchWriter {
  constructor(flushInterval = 2000, maxBatchSize = 50) {
    this.pendingWrites = new Map(); // roomId -> {gameState, timestamp}
    this.flushInterval = flushInterval;
    this.maxBatchSize = maxBatchSize;
    this.startBatchProcessor();
  }

  // Queue a write to be batched
  queueWrite(roomId, gameState) {
    this.pendingWrites.set(roomId, {
      gameState: { ...gameState },
      timestamp: Date.now()
    });

    // Flush immediately if batch is full
    if (this.pendingWrites.size >= this.maxBatchSize) {
      this.flush();
    }
  }

  // Flush all pending writes
  async flush() {
    if (this.pendingWrites.size === 0) return;

    const writesToProcess = Array.from(this.pendingWrites.entries());
    this.pendingWrites.clear();

    const writePromises = writesToProcess.map(async ([roomId, data]) => {
      try {
        await firebaseService.updateRoomGameState(roomId, data.gameState);
        logger.debug(`Batched write completed for room ${roomId}`);
      } catch (error) {
        logger.error(`Batched write failed for room ${roomId}:`, error);
      }
    });

    await Promise.allSettled(writePromises);
  }

  // Start periodic batch processor
  startBatchProcessor() {
    this.batchInterval = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  // Stop batch processor
  stop() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
    }
    this.flush(); // Final flush
  }
}

const firebaseBatchWriter = new FirebaseBatchWriter();

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await firebaseBatchWriter.flush();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await firebaseBatchWriter.flush();
  process.exit(0);
});

// Movement Debouncing Service to reduce network spam during drags
class MovementDebouncer {
  constructor(debounceMs = 50) {
    this.pendingMoves = new Map(); // roomId_tokenId -> {position, velocity, timestamp, playerId}
    this.debounceMs = debounceMs;
    this.flushInterval = null;
    this.startDebouncer();
  }

  // Queue a movement update
  queueMove(roomId, tokenId, moveData) {
    const key = `${roomId}_${tokenId}`;
    this.pendingMoves.set(key, {
      roomId,
      tokenId,
      ...moveData,
      timestamp: Date.now()
    });
  }

  // Flush all pending movements
  flush(io, rooms, players) {
    if (this.pendingMoves.size === 0) return;

    const movesToProcess = Array.from(this.pendingMoves.values());
    this.pendingMoves.clear();

    movesToProcess.forEach(move => {
      const room = rooms.get(move.roomId);
      if (!room) return;

      // Update room state
      if (!room.gameState.tokens) {
        room.gameState.tokens = {};
      }

      const existingToken = room.gameState.tokens[move.tokenId];
      if (existingToken) {
        room.gameState.tokens[move.tokenId] = {
          ...existingToken,
          position: move.position,
          velocity: move.velocity,
          lastMovedBy: move.playerId,
          lastMovedAt: new Date()
        };

        // Broadcast debounced movement
        const player = players.get(move.socketId);
        if (player) {
          io.to(move.roomId).except(move.socketId).emit('token_moved', {
            tokenId: move.tokenId,
            position: move.position,
            velocity: move.velocity,
            playerId: move.playerId,
            playerName: player.name,
            isDragging: move.isDragging,
            serverTimestamp: Date.now(),
            actionId: move.actionId,
            debounced: true
          });
        }
      }

      // Queue batched Firebase write
      firebaseBatchWriter.queueWrite(move.roomId, room.gameState);
    });
  }

  startDebouncer() {
    this.flushInterval = setInterval(() => {
      // Will be called with io, rooms, players from server context
      if (this.flushCallback) {
        this.flushCallback();
      }
    }, this.debounceMs);
  }

  stop() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
  }
}

const movementDebouncer = new MovementDebouncer(50); // 50ms debounce = 20 updates/sec max

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

// Error handler is now initialized above using ErrorHandler class

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
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
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
      playerCount: room.players.size + 1, // Include GM (+1) as they are the first "player" in the room
      maxPlayers: room.settings?.maxPlayers || 6,
      gm: room.gm.name,
      createdAt: room.createdAt,
      hasPassword: !!room.passwordHash, // Check if room actually has a password
      gmOnline: room.isActive !== false // Indicate if GM is currently online
    }));
}
const players = new Map(); // socketId -> { id, name, roomId, isGM }

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

// Helper to update gameState using delta sync with conflict resolution
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
  // Normalize password values - treat null, undefined, and empty string as "no password"
  const normalizedPlainPassword = (plainPassword === null || plainPassword === undefined || plainPassword === '') ? null : plainPassword.trim();
  const hasRoomPassword = hashedPassword !== null && hashedPassword !== undefined;

  logger.debug('Password verification details', {
    hasRoomPassword,
    providedPasswordType: typeof plainPassword,
    providedPasswordEmpty: !normalizedPlainPassword,
    normalizedToNull: normalizedPlainPassword === null
  });

  // Case 1: Room has no password
  if (!hasRoomPassword) {
    // Allow if user also provided no password (or empty string)
    if (!normalizedPlainPassword) {
      logger.debug('Room has no password, user provided none - ALLOWED');
      return true;
    }
    // User provided a password for a room that has none - still allow (weird but not harmful)
    logger.debug('Room has no password, user provided one anyway - ALLOWED');
    return true;
  }

  // Case 2: Room has a password but user didn't provide one
  if (!normalizedPlainPassword) {
    logger.debug('Room requires password but none provided - DENIED');
    return false;
  }

  // Case 3: Both have passwords - verify with bcrypt
  const matches = await bcrypt.compare(normalizedPlainPassword, hashedPassword);
  logger.debug('Password comparison result', { matches });
  return matches;
}

// Room management functions
async function createRoom(roomName, gmName, gmSocketId, password, playerColor = '#d4af37', _persistToFirebase = true) {
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
      tokens: {}, // Creature tokens
      characterTokens: {}, // Player character tokens
      gridItems: {}, // Grid items
      fogOfWar: {} // Fog of war state
    },
    chatHistory: [],
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

  // MULTIPLAYER: Check if room is active (GM hasn't left)
  // Allow joining inactive rooms for multiplayer functionality
  // GM can reconnect later, and guests can still join
  const ROOM_INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  if (!room.isActive && room.gmDisconnectedAt) {
    const inactiveTime = Date.now() - room.gmDisconnectedAt;
    if (inactiveTime > ROOM_INACTIVE_TIMEOUT) {
      logger.debug('Room has been inactive too long, removing', { roomName: room.name, inactiveTime });
      rooms.delete(roomId);
      return { error: 'Room has expired - GM left too long ago' };
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

    // Update GM's socket ID and color if provided
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

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info('Player connected', { socketId: socket.id });

  // Hook up movement debouncer flush callback
  if (!movementDebouncer.flushCallback) {
    movementDebouncer.flushCallback = () => {
      movementDebouncer.flush(io, rooms, players);
    };
  }

  // Minimal handler for testing
  socket.on('ping', (data, callback) => {
    if (callback) callback('pong');
  });

  // RESTORED: Handle room creation
  socket.on('create_room', async (data) => {
    try {
      const room = await createRoom(
        data.roomName,
        data.gmName,
        socket.id,
        data.password,
        data.playerColor,
        true // persist to firebase
      );

      // Handle persistent room data
      if (data.persistentRoomId) {
        room.persistentRoomId = data.persistentRoomId;
        if (data.gameState) {
          room.gameState = { ...room.gameState, ...data.gameState };
        }
      }

      // Update GM character data
      if (data.character && room.gm) {
        room.gm.character = data.character;
      }

      // Join the socket.io room
      socket.join(room.id);

      // Emit room_joined event (RoomLobby expects this)
      socket.emit('room_joined', {
        room,
        player: room.gm,
        isGM: true,
        sessionId: socket.id
      });

      // Also emit room_created for specific handling
      socket.emit('room_created', {
        room,
        playerId: room.gm.id,
        isGM: true
      });

      // Broadcast update to all clients for lobby list
      io.emit('room_list_updated', getPublicRooms());

      console.log(`✅ Room ${room.id} created by ${data.gmName}`);
    } catch (error) {
      console.error('Create room error:', error);
      socket.emit('error', { message: error.message || 'Failed to create room' });
    }
  });

  // RESTORED: Handle joining a room
  socket.on('join_room', async (data) => {
    try {
      const result = await joinRoom(
        data.roomId,
        data.playerName,
        socket.id,
        data.password,
        data.playerColor,
        data.character
      );

      if (!result) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      if (result.error) {
        socket.emit('error', { message: result.error });
        return;
      }

      const { room, player, isGMReconnect } = result;

      // Join socket room
      socket.join(room.id);

      // Emit success to joiner
      socket.emit('room_joined', {
        room,
        player,
        isGM: player.isGM,
        isGMReconnect,
        sessionId: socket.id
      });

      // Notify others in room
      socket.to(room.id).emit('player_joined', {
        player,
        isGM: player.isGM,
        playerCount: room.players.size + 1 // Total including GM
      });

      console.log(`✅ Player ${player.name} joined room ${room.id}`);

    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: error.message || 'Failed to join room' });
    }
  });

  // ========== CRITICAL FIX: Token Synchronization ==========
  // Handle token creation - FIXED: Use io.to() so GM sees their own tokens
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

    // Initialize tokens if needed
    if (!room.gameState.tokens) {
      room.gameState.tokens = {};
    }

    // Create a unique token ID
    const tokenId = (data.token && data.token.id) || data.tokenId || `token_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Store token with comprehensive data
    const tokenData = {
      id: tokenId,
      creatureId: data.creature.id,
      position: data.position,
      creature: data.creature,
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

    // CRITICAL FIX: Send confirmation to creator first
    socket.emit('token_create_confirmed', {
      creature: data.creature,
      token: { ...(data.token || {}), id: tokenId },
      position: data.position,
      playerId: socket.id,
      timestamp: new Date(),
      success: true
    });

    // Broadcast to OTHER players only (creator already has confirmation)
    socket.to(player.roomId).emit('token_created', {
      creature: data.creature,
      token: { ...(data.token || {}), id: tokenId },
      position: data.position,
      playerId: socket.id,
      playerName: player.name,
      timestamp: new Date(),
      isSync: true
    });

    console.log(`🎭 Token ${data.creature.name} (${tokenId}) created by ${player.name} at`, data.position);
  });

  // Handle token movement - FIXED: Improve conflict resolution and prevent echo-induced resets
  socket.on('token_moved', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      return;
    }

    // FIXED: Use data.tokenId consistently throughout (not data.creatureId)
    const tokenId = data.tokenId;

    // Initialize tokens if needed
    if (!room.gameState.tokens) {
      room.gameState.tokens = {};
    }

    // Track recent movements to prevent conflicts and echo-induced position resets
    const recentMoveKey = `${player.roomId}_token_${tokenId}`;
    const now = Date.now();

    // FIXED: Ignore movement if it was received less than 100ms after local movement
    // This prevents server echo from resetting position while user is still dragging
    if (!global.recentTokenMovements) {
      global.recentTokenMovements = new Map();
    }
    const recentMove = global.recentTokenMovements.get(recentMoveKey);

    if (recentMove && (now - recentMove.timestamp) < 100) {
      console.log(`🚫 Ignoring stale token movement echo for ${tokenId} (${now - recentMove.timestamp}ms old)`);
      return;
    }

    // Track this movement
    global.recentTokenMovements.set(recentMoveKey, {
      tokenId: tokenId,
      position: data.position,
      player: socket.id,
      timestamp: now
    });

    // Find token by either tokenId or creatureId for backward compatibility
    let existingToken = room.gameState.tokens[tokenId];

    if (!existingToken) {
      // Try to find by creatureId if direct lookup failed
      const tokenKeys = Object.keys(room.gameState.tokens);
      for (const key of tokenKeys) {
        if (room.gameState.tokens[key].creatureId === data.creature?.id) {
          existingToken = room.gameState.tokens[key];
          break;
        }
      }
    }

    if (existingToken) {
      // Update existing token
      room.gameState.tokens[tokenId] = {
        ...existingToken,
        position: data.position,
        lastMovedBy: player.id,
        lastMovedByName: player.name,
        lastMovedAt: new Date(),
        // FIXED: Preserve velocity data for lag compensation
        velocity: data.velocity || existingToken.velocity
      };

      // Persist to Firebase
      if (!data.isDragging) {
        try {
          await firebaseService.updateRoomGameState(player.roomId, room.gameState);
        } catch (error) {
          console.error('Failed to persist token position:', error);
        }
      }
    } else {
      // New token or token not found
      console.warn(`⚠️ Token ${tokenId} not found, creating new token entry`);
      const newTokenData = {
        id: tokenId,
        creatureId: data.creature?.id,
        position: data.position,
        creature: data.creature,
        createdBy: player.id,
        createdByName: player.name,
        createdAt: new Date(),
        lastMovedBy: player.id,
        lastMovedAt: new Date()
      };
      room.gameState.tokens[tokenId] = newTokenData;

      // Persist to Firebase
      if (!data.isDragging) {
        try {
          await firebaseService.updateRoomGameState(player.roomId, room.gameState);
        } catch (error) {
          console.error('Failed to persist token creation:', error);
        }
      }
    }

    // CRITICAL FIX: Calculate velocity for lag compensation
    const previousPos = existingToken?.position || data.position;
    const timeDelta = existingToken?.lastMovedAt ? (now - new Date(existingToken.lastMovedAt).getTime()) : 100;
    const calculatedVelocity = {
      x: timeDelta > 0 ? (data.position.x - previousPos.x) / (timeDelta / 1000) : 0,
      y: timeDelta > 0 ? (data.position.y - previousPos.y) / (timeDelta / 1000) : 0
    };

    // Persist to Firebase
    // FIXED: Use movement debouncer for dragging events to prevent Firebase write spam
    if (data.isDragging) {
      movementDebouncer.queueMove(player.roomId, tokenId, {
        position: data.position,
        velocity: data.velocity || calculatedVelocity, // Use calculatedVelocity here
        playerId: player.id,
        socketId: socket.id, // Needed for except() broadcasting
        isDragging: true,
        actionId: data.actionId
      });
      // Don't persist or broadcast immediately - let debouncer handle it
    } else {
      // Final move - update immediately and persist
      try {
        // Queue batched write instead of immediate await
        firebaseBatchWriter.queueWrite(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist token movement:', error);
      }

      // Broadcast to OTHER players only
      socket.to(player.roomId).emit('token_moved', {
        tokenId: tokenId,
        creatureId: data.creature?.id,
        position: data.position,
        playerId: player.id,
        playerName: player.name,
        isDragging: false,
        serverTimestamp: now,
        velocity: data.velocity || calculatedVelocity, // Use calculatedVelocity here
        actionId: data.actionId || `move_${now}`
      });
    }

    console.log(`🔷 Token ${tokenId} moved by ${player.name}`, data.position);
  });

  // Handle token state updates (HP, Mana, AP, conditions)
  socket.on('token_updated', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room || !room.gameState.tokens) return;

    const { tokenId, stateUpdates } = data;
    if (!room.gameState.tokens[tokenId]) return;

    // Update token state
    room.gameState.tokens[tokenId].state = {
      ...room.gameState.tokens[tokenId].state,
      ...stateUpdates
    };

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist token update:', error);
    }

    // FIXED: Broadcast to other players only (not to sender)
    socket.to(player.roomId).emit('token_updated', {
      tokenId,
      stateUpdates,
      updatedBy: player.id
    });
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

    // CRITICAL FIX: Send confirmation to creator first
    socket.emit('character_token_create_confirmed', {
      tokenId: data.tokenId,
      playerId: player.id,
      position: data.position,
      timestamp: new Date(),
      success: true
    });

    // Broadcast to OTHER players only (creator already has confirmation)
    socket.to(player.roomId).emit('character_token_created', {
      tokenId: data.tokenId,
      playerId: player.id,
      playerName: player.name,
      position: data.position,
      timestamp: new Date()
    });

    console.log(`🎭 Character token created by ${player.name} at`, data.position);
  });

  // Handle character movement - FIXED: Prevent echo-induced position resets
  socket.on('character_moved', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
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

    const playerId = data.playerId || socket.id;

    // FIXED: Track recent movements to prevent echo-induced position resets
    const recentMoveKey = `${player.roomId}_character_${playerId}`;
    const now = Date.now();

    // FIXED: Ignore stale movement echoes
    if (!global.recentTokenMovements) {
      global.recentTokenMovements = new Map();
    }
    const recentMove = global.recentTokenMovements.get(recentMoveKey);

    if (recentMove && (now - recentMove.timestamp) < 100) {
      console.log(`🚫 Ignoring stale character movement echo for ${playerId} (${now - recentMove.timestamp}ms old)`);
      return;
    }

    // Track this movement
    global.recentTokenMovements.set(recentMoveKey, {
      playerId: playerId,
      position: data.position,
      timestamp: now
    });

    // Update character token position in room state
    if (room.gameState.characterTokens[playerId]) {
      room.gameState.characterTokens[playerId].position = data.position;
      room.gameState.characterTokens[playerId].lastMovedAt = new Date();
      room.gameState.characterTokens[playerId].lastMovedBy = player.id;
    }

    // Persist to Firebase (only final positions, not during drag)
    if (!data.isDragging) {
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist character token movement:', error);
      }
    }

    // CRITICAL FIX: Calculate velocity for lag compensation
    const charToken = room.gameState.characterTokens[playerId];
    const prevCharPos = charToken?.position || data.position;
    const charTimeDelta = charToken?.lastMovedAt ? (now - new Date(charToken.lastMovedAt).getTime()) : 100;
    const charVelocity = {
      x: charTimeDelta > 0 ? (data.position.x - prevCharPos.x) / (charTimeDelta / 1000) : 0,
      y: charTimeDelta > 0 ? (data.position.y - prevCharPos.y) / (charTimeDelta / 1000) : 0
    };

    // CRITICAL FIX: Broadcast to OTHER players only (not sender) to prevent echo-induced resets
    socket.to(player.roomId).emit('character_moved', {
      position: data.position,
      playerId: player.id,
      playerName: player.name,
      isDragging: data.isDragging || false,
      timestamp: new Date(),
      serverTimestamp: now,
      velocity: data.velocity || charVelocity
    });

    console.log(`🚶 Character moved by ${player.name} to`, data.position, data.isDragging ? '(dragging)' : '(final)');
  });

  // CONFLICT RESOLUTION: Handle HP/Mana/Resource incremental updates
  // Uses increment/decrement operations to prevent race conditions
  socket.on('character_resource_delta', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Validate delta data
    if (!data.characterId || !data.deltas) {
      socket.emit('error', { message: 'Invalid resource delta data' });
      return;
    }

    // Initialize characters if needed
    if (!room.gameState.characters) {
      room.gameState.characters = {};
    }

    const character = room.gameState.characters[data.characterId];
    if (!character || !character.sessionData) {
      socket.emit('error', { message: 'Character not found in room state' });
      return;
    }

    // Apply deltas (additive operations resolve conflicts automatically)
    const appliedDeltas = {};

    if (data.deltas.health !== undefined) {
      const newHealth = (character.sessionData.health || 0) + data.deltas.health;
      character.sessionData.health = Math.max(0, newHealth); // Clamp to 0 minimum
      appliedDeltas.health = character.sessionData.health;
    }

    if (data.deltas.mana !== undefined) {
      const newMana = (character.sessionData.mana || 0) + data.deltas.mana;
      character.sessionData.mana = Math.max(0, newMana);
      appliedDeltas.mana = character.sessionData.mana;
    }

    if (data.deltas.actionPoints !== undefined) {
      const newAP = (character.sessionData.actionPoints || 0) + data.deltas.actionPoints;
      character.sessionData.actionPoints = Math.max(0, newAP);
      appliedDeltas.actionPoints = character.sessionData.actionPoints;
    }

    // Track operation for conflict detection
    character.lastUpdatedBy = player.id;
    character.lastUpdatedAt = new Date();
    character.version = (character.version || 0) + 1;

    // Queue batched Firebase write
    firebaseBatchWriter.queueWrite(player.roomId, room.gameState);

    // Broadcast delta and new values to ALL players
    io.to(player.roomId).emit('character_resource_updated', {
      characterId: data.characterId,
      deltas: data.deltas,
      newValues: appliedDeltas,
      updatedBy: player.id,
      updatedByName: player.name,
      version: character.version,
      timestamp: new Date()
    });

    console.log(`⚡ Character ${data.characterId} resources updated by ${player.name}:`, data.deltas, '→', appliedDeltas);
  });

  // Handle character state updates
  socket.on('character_updated', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // MIGRATION: Keep minimal character reference in gameState (session-only)
    // Full character data is stored in top-level characters collection
    if (!room.gameState.characters) {
      room.gameState.characters = {};
    }

    room.gameState.characters[data.characterId] = {
      characterId: data.characterId,
      name: data.character.name,
      lastUpdatedBy: player.id,
      lastUpdatedAt: new Date(),
      // Store only essential session data
      sessionData: {
        health: data.character.health,
        mana: data.character.mana,
        actionPoints: data.character.actionPoints
      }
    };

    // FIXED: If GM updating their character, also update room.gm.character
    if (player.isGM && room.gm && room.gm.id === player.id) {
      room.gm.character = {
        ...room.gm.character,
        ...data.character,
        name: data.character.name || room.gm.character?.name || room.gm.name
      };
    }

    // Persist to Firebase
    try {
      // FIXED: Use delta sync for efficient updates
      const updateResult = await updateGameStateWithDelta(
        player.roomId,
        room.gameState,
        { type: 'character_update', characterId: data.characterId, playerId: player.id }
      );

      if (updateResult.useDelta) {
        await optimizedFirebase.updateGameState(player.roomId, room.gameState, updateResult.delta, 'normal');
      } else {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      }

      // FIXED: Also save individual character document to Firebase
      const userId = data.userId || player.userId;
      if (data.characterId && data.character && userId) {
        try {
          await firebaseService.saveCharacterDocument(
            data.characterId,
            data.character,
            userId
          );
        } catch (charDocError) {
          console.warn('Failed to save character document:', charDocError);
        }
      }
    } catch (error) {
      console.error('Failed to persist character update:', error);
    }

    // FIXED: Broadcast to other players only
    socket.to(player.roomId).emit('character_updated', {
      characterId: data.characterId,
      character: {
        ...data.character,
        playerId: data.character.playerId || player.id
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
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // MIGRATION: Keep minimal character reference in gameState (session-only)
    if (!room.gameState.characters) {
      room.gameState.characters = {};
    }

    if (!room.gameState.characters[data.characterId]) {
      room.gameState.characters[data.characterId] = {
        characterId: data.characterId,
        lastUpdatedBy: player.id,
        lastUpdatedAt: new Date()
      };
    }

    // Update only session metadata
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

    // Persist to Firebase
    try {
      const updateResult = await updateGameStateWithDelta(
        player.roomId,
        room.gameState,
        { type: 'equipment_update', characterId: data.characterId, playerId: player.id }
      );

      if (updateResult.useDelta) {
        await optimizedFirebase.updateGameState(player.roomId, room.gameState, updateResult.delta, 'low');
      } else {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      }
    } catch (error) {
      console.error('Failed to persist equipment update:', error);
    }

    // FIXED: Broadcast to other players only
    socket.to(player.roomId).emit('character_equipment_updated', {
      characterId: data.characterId,
      slot: data.slot,
      item: data.item,
      equipment: data.equipment,
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`Equipment updated for character ${data.characterId} by ${player.name}: ${data.slot} -> ${data.item?.name || 'unequipped'}`);
  });

  // Handle map/background changes (GM only for live updates)
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

    // Only GM can update map state for live synchronization
    if (!player.isGM) {
      socket.emit('error', { message: 'Only GM can update map state' });
      return;
    }

    // Validate map update data structure
    if (!data || !data.mapUpdates || typeof data.mapUpdates !== 'object') {
      socket.emit('error', { message: 'Invalid map update data' });
      return;
    }

    // Update map data in room game state
    if (data.mapUpdates) {
      // Update all map-related properties
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
      // FIXED: Handle explored areas sync for fog of war memory
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

    // FIXED: Broadcast map update to ALL players INCLUDING GM (client has window._isReceivingMapUpdate flag to prevent infinite loops)
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
        exploredAreas: room.gameState.mapData?.exploredAreas || {}
      },
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`🗺️ Map updated by GM ${player.name} - broadcasted to all players in room ${player.roomId}`);
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

    // Broadcast combat update to all players in room
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

    // IMPROVEMENT: Store dice roll in room's roll history
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

    // Persist dice roll to Firebase
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
    }

    // Broadcast dice roll to all players in room
    io.to(player.roomId).emit('dice_rolled', rollData);
    io.to(player.roomId).emit('chat_message', rollMessage);

    console.log(`${player.name} rolled dice: ${data.results.join(', ')} (Total: ${data.total})`);
  });

  // IMPROVEMENT: Handle spell cast synchronization for multiplayer
  socket.on('spell_cast', async (data) => {
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

    // Broadcast spell cast to all players in room
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

    // Create unique item ID
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

    // CRITICAL FIX: Send confirmation to dropper first
    socket.emit('item_drop_confirmed', {
      item: { ...data.item, id: gridItemId },
      position: data.position,
      gridPosition: data.gridPosition,
      success: true,
      timestamp: new Date()
    });

    // Broadcast item drop to OTHER players only (dropper already has confirmation)
    socket.to(player.roomId).emit('item_dropped', {
      item: { ...data.item, id: gridItemId },
      position: data.position,
      gridPosition: data.gridPosition,
      playerId: player.id,
      playerName: player.name,
      timestamp: new Date(),
      isSync: false
    });

    console.log(`📦 Item ${data.item.name} (${gridItemId}) dropped by ${player.name} at`, data.position);
  });

  // Handle token state updates (HP, Mana, AP, etc.)
  socket.on('token_updated', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room || !room.gameState.tokens) return;

    const { tokenId, stateUpdates } = data;
    if (!room.gameState.tokens[tokenId]) return;

    // Update token state
    room.gameState.tokens[tokenId].state = {
      ...room.gameState.tokens[tokenId].state,
      ...stateUpdates
    };

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist token update:', error);
    }

    // Broadcast to others in the room
    socket.to(player.roomId).emit('token_updated', {
      tokenId,
      stateUpdates,
      updatedBy: player.id
    });
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

    // CRITICAL FIX: Verify item exists before removing
    let itemRemoved = false;
    let removedItem = null;

    if (data.gridItemId && room.gameState.gridItems) {
      const gridItem = room.gameState.gridItems[data.gridItemId];
      if (gridItem) {
        removedItem = { ...gridItem };
        delete room.gameState.gridItems[data.gridItemId];
        itemRemoved = true;
        console.log(`🎁 Removing looted item ${data.gridItemId} from server state`);
      } else {
        console.warn(`⚠️ Item ${data.gridItemId} not found in grid items - may have already been looted`);
      }
    }

    // CRITICAL FIX: Persist to Firebase BEFORE broadcasting to ensure consistency
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist item loot:', error);
      // If persistence fails, re-add the item to prevent desync
      if (removedItem && data.gridItemId) {
        room.gameState.gridItems[data.gridItemId] = removedItem;
        socket.emit('error', { message: 'Failed to loot item - please try again' });
        return;
      }
    }

    // CRITICAL FIX: Send confirmation to looter first
    socket.emit('item_loot_confirmed', {
      item: data.item,
      quantity: data.quantity,
      gridItemId: data.gridItemId,
      success: itemRemoved,
      timestamp: new Date()
    });

    // Broadcast loot event to OTHER players only (looter already has confirmation)
    socket.to(player.roomId).emit('item_looted', {
      item: data.item,
      quantity: data.quantity,
      source: data.source,
      looter: data.looter,
      gridItemId: data.gridItemId,
      playerId: player.id,
      playerName: player.name,
      timestamp: new Date(),
      itemRemoved: itemRemoved
    });

    console.log(`🎁 ${data.item.name} (x${data.quantity}) looted by ${player.name} from ${data.source} (removed: ${itemRemoved})`);
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

    // COMPREHENSIVE: Send complete game state including ALL syncable elements
    const mapData = room.gameState.mapData || {};
    const fullState = {
      // Token data
      tokens: room.gameState.tokens || {},
      gridItems: room.gameState.gridItems || {},
      characters: room.gameState.characters || {},
      characterTokens: room.gameState.characterTokens || {},

      // Container data
      containers: room.gameState.containers || {},

      // Map data with all sub-elements
      mapData: {
        ...mapData,
        terrainData: mapData.terrainData || {},
        wallData: mapData.wallData || {},
        fogOfWarPaths: mapData.fogOfWarPaths || [],
        fogErasePaths: mapData.fogErasePaths || [],
        exploredAreas: mapData.exploredAreas || {},
        drawingPaths: mapData.drawingPaths || [],
        drawingLayers: mapData.drawingLayers || [],
        lightSources: mapData.lightSources || {},
        environmentalObjects: mapData.environmentalObjects || []
      },
      fogOfWar: room.gameState.fogOfWar || {},

      // GM-only data (only send to GM)
      gmNotes: player.isGM ? (room.gameState.gmNotes || {}) : undefined,

      // Combat state
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

      chatHistory: room.chatHistory || [],
      timestamp: new Date()
    };

    socket.emit('full_game_state_sync', fullState);
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

    // Send game session launch notification to all players in room
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

    // Broadcast color update to all players in room
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

  // ========== COMPREHENSIVE MULTIPLAYER SYNC HANDLERS ==========

  // Handle container updates (chests, crates, etc.)
  socket.on('container_update', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Initialize containers if needed
    if (!room.gameState.containers) {
      room.gameState.containers = {};
    }

    // Update container state
    if (data.containerId) {
      room.gameState.containers[data.containerId] = {
        ...room.gameState.containers[data.containerId],
        ...data.container,
        lastUpdatedBy: player.id,
        lastUpdatedAt: new Date()
      };
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist container update:', error);
    }

    // Broadcast to other players
    socket.to(player.roomId).emit('container_updated', {
      containerId: data.containerId,
      container: data.container,
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`📦 Container ${data.containerId} updated by ${player.name}`);
  });

  // Handle creature token addition (from GM or players)
  socket.on('creature_added', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Only GM can add creature tokens
    if (!player.isGM) {
      socket.emit('error', { message: 'Only GM can add creature tokens' });
      return;
    }

    // Initialize tokens if needed
    if (!room.gameState.tokens) {
      room.gameState.tokens = {};
    }

    const tokenId = data.id || `creature_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    room.gameState.tokens[tokenId] = {
      id: tokenId,
      creatureId: data.creatureId,
      position: data.position,
      velocity: data.velocity || { x: 0, y: 0 },
      createdBy: player.id,
      createdAt: new Date()
    };

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist creature addition:', error);
    }

    // Send confirmation to creator
    socket.emit('creature_add_confirmed', {
      id: tokenId,
      position: data.position,
      success: true
    });

    // Broadcast to other players
    socket.to(player.roomId).emit('creature_added', {
      id: tokenId,
      creatureId: data.creatureId,
      position: data.position,
      velocity: data.velocity,
      createdBy: player.id,
      createdByName: player.name,
      timestamp: new Date()
    });

    console.log(`🐉 Creature token ${tokenId} added by GM ${player.name}`);
  });

  // Handle creature state updates
  socket.on('creature_updated', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    if (!room.gameState.tokens || !room.gameState.tokens[data.tokenId]) {
      return;
    }

    // Update creature state
    room.gameState.tokens[data.tokenId] = {
      ...room.gameState.tokens[data.tokenId],
      ...data.stateUpdates,
      lastUpdatedBy: player.id,
      lastUpdatedAt: new Date()
    };

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist creature update:', error);
    }

    // Broadcast to other players
    socket.to(player.roomId).emit('creature_updated', {
      tokenId: data.tokenId,
      stateUpdates: data.stateUpdates,
      updatedBy: player.id,
      timestamp: new Date()
    });
  });

  // Handle grid item updates (loot orbs, objects on grid)
  socket.on('grid_item_update', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Initialize grid items if needed
    if (!room.gameState.gridItems) {
      room.gameState.gridItems = {};
    }

    const { updateType, itemId, itemData, position } = data;

    switch (updateType) {
      case 'add':
        room.gameState.gridItems[itemId] = {
          ...itemData,
          id: itemId,
          position: position,
          addedBy: player.id,
          addedAt: new Date()
        };
        break;
      case 'move':
        if (room.gameState.gridItems[itemId]) {
          room.gameState.gridItems[itemId].position = position;
          room.gameState.gridItems[itemId].lastMovedBy = player.id;
          room.gameState.gridItems[itemId].lastMovedAt = new Date();
        }
        break;
      case 'remove':
        delete room.gameState.gridItems[itemId];
        break;
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist grid item update:', error);
    }

    // Broadcast to other players
    socket.to(player.roomId).emit('grid_item_updated', {
      updateType,
      itemId,
      itemData,
      position,
      updatedBy: player.id,
      updatedByName: player.name,
      timestamp: new Date()
    });

    console.log(`📍 Grid item ${itemId} ${updateType} by ${player.name}`);
  });

  // Handle wall placement/updates
  socket.on('wall_update', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can modify walls' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Initialize wall data if needed
    if (!room.gameState.mapData) {
      room.gameState.mapData = {};
    }
    if (!room.gameState.mapData.wallData) {
      room.gameState.mapData.wallData = {};
    }

    const { wallId, wallData, updateType } = data;

    switch (updateType) {
      case 'add':
      case 'update':
        room.gameState.mapData.wallData[wallId] = {
          ...wallData,
          id: wallId,
          lastUpdatedBy: player.id,
          lastUpdatedAt: new Date()
        };
        break;
      case 'remove':
        delete room.gameState.mapData.wallData[wallId];
        break;
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist wall update:', error);
    }

    // Broadcast to other players
    socket.to(player.roomId).emit('wall_updated', {
      wallId,
      wallData,
      updateType,
      updatedBy: player.id,
      timestamp: new Date()
    });

    console.log(`🧱 Wall ${wallId} ${updateType} by GM ${player.name}`);
  });

  // Handle terrain placement/updates
  socket.on('terrain_update', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can modify terrain' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Initialize terrain data if needed
    if (!room.gameState.mapData) {
      room.gameState.mapData = {};
    }
    if (!room.gameState.mapData.terrainData) {
      room.gameState.mapData.terrainData = {};
    }

    // Apply terrain updates (can be batch updates)
    if (data.terrainData) {
      room.gameState.mapData.terrainData = {
        ...room.gameState.mapData.terrainData,
        ...data.terrainData
      };
    }

    // Handle single tile update
    if (data.tileKey && data.terrainType !== undefined) {
      if (data.terrainType === null) {
        delete room.gameState.mapData.terrainData[data.tileKey];
      } else {
        room.gameState.mapData.terrainData[data.tileKey] = data.terrainType;
      }
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist terrain update:', error);
    }

    // Broadcast to other players
    socket.to(player.roomId).emit('terrain_updated', {
      terrainData: room.gameState.mapData.terrainData,
      tileKey: data.tileKey,
      terrainType: data.terrainType,
      updatedBy: player.id,
      timestamp: new Date()
    });

    console.log(`🌲 Terrain updated by GM ${player.name}`);
  });

  // Handle door state changes (open/close/lock)
  socket.on('door_state_changed', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Only GM can lock/unlock doors, anyone can open/close
    if (data.state === 'locked' && !player.isGM) {
      socket.emit('error', { message: 'Only GM can lock doors' });
      return;
    }

    // Update door state in wall data
    if (room.gameState.mapData?.wallData?.[data.doorId]) {
      room.gameState.mapData.wallData[data.doorId].state = data.state;
      room.gameState.mapData.wallData[data.doorId].lastInteractedBy = player.id;
      room.gameState.mapData.wallData[data.doorId].lastInteractedAt = new Date();
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist door state change:', error);
    }

    // Broadcast to ALL players (door interaction visible to everyone)
    io.to(player.roomId).emit('door_state_changed', {
      doorId: data.doorId,
      state: data.state,
      interactedBy: player.id,
      interactedByName: player.name,
      timestamp: new Date()
    });

    console.log(`🚪 Door ${data.doorId} ${data.state} by ${player.name}`);
  });

  // Handle GM notes (private notes visible only to GM)
  socket.on('gm_note_update', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can manage notes' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Initialize GM notes if needed
    if (!room.gameState.gmNotes) {
      room.gameState.gmNotes = {};
    }

    const { noteId, noteData, updateType } = data;

    switch (updateType) {
      case 'add':
      case 'update':
        room.gameState.gmNotes[noteId] = {
          ...noteData,
          id: noteId,
          lastUpdatedAt: new Date()
        };
        break;
      case 'remove':
        delete room.gameState.gmNotes[noteId];
        break;
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist GM note update:', error);
    }

    // GM notes are private - only emit confirmation back to GM
    socket.emit('gm_note_confirmed', {
      noteId,
      noteData,
      updateType,
      timestamp: new Date()
    });

    console.log(`📝 GM note ${noteId} ${updateType} by ${player.name}`);
  });

  // Handle light source updates
  socket.on('light_source_update', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can modify light sources' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Initialize light sources if needed
    if (!room.gameState.mapData) {
      room.gameState.mapData = {};
    }
    if (!room.gameState.mapData.lightSources) {
      room.gameState.mapData.lightSources = {};
    }

    const { lightId, lightData, updateType } = data;

    switch (updateType) {
      case 'add':
      case 'update':
        room.gameState.mapData.lightSources[lightId] = {
          ...lightData,
          id: lightId,
          lastUpdatedAt: new Date()
        };
        break;
      case 'remove':
        delete room.gameState.mapData.lightSources[lightId];
        break;
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist light source update:', error);
    }

    // Broadcast to other players
    socket.to(player.roomId).emit('light_source_updated', {
      lightId,
      lightData,
      updateType,
      updatedBy: player.id,
      timestamp: new Date()
    });

    console.log(`💡 Light source ${lightId} ${updateType} by GM ${player.name}`);
  });

  // Handle fog of war updates (dedicated handler for real-time fog painting)
  socket.on('fog_update', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can modify fog of war' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Initialize fog data if needed
    if (!room.gameState.mapData) {
      room.gameState.mapData = {};
    }

    // Update fog paths
    if (data.fogOfWarPaths !== undefined) {
      room.gameState.mapData.fogOfWarPaths = data.fogOfWarPaths;
    }
    if (data.fogErasePaths !== undefined) {
      room.gameState.mapData.fogErasePaths = data.fogErasePaths;
    }
    if (data.exploredAreas !== undefined) {
      room.gameState.mapData.exploredAreas = data.exploredAreas;
    }

    // Only persist on finalize (not during continuous painting)
    if (data.finalize) {
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist fog update:', error);
      }
    }

    // Broadcast to other players
    socket.to(player.roomId).emit('fog_updated', {
      fogOfWarPaths: data.fogOfWarPaths,
      fogErasePaths: data.fogErasePaths,
      exploredAreas: data.exploredAreas,
      finalize: data.finalize,
      updatedBy: player.id,
      timestamp: new Date()
    });
  });

  // Handle drawing path updates (free drawing on grid)
  socket.on('drawing_update', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can draw on the map' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Initialize drawing data if needed
    if (!room.gameState.mapData) {
      room.gameState.mapData = {};
    }

    if (data.drawingPaths !== undefined) {
      room.gameState.mapData.drawingPaths = data.drawingPaths;
    }
    if (data.drawingLayers !== undefined) {
      room.gameState.mapData.drawingLayers = data.drawingLayers;
    }

    // Only persist on finalize
    if (data.finalize) {
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist drawing update:', error);
      }
    }

    // Broadcast to other players
    socket.to(player.roomId).emit('drawing_updated', {
      drawingPaths: data.drawingPaths,
      drawingLayers: data.drawingLayers,
      finalize: data.finalize,
      updatedBy: player.id,
      timestamp: new Date()
    });
  });

  // Handle environmental object updates (furniture, decorations, etc.)
  socket.on('environmental_object_update', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can modify environmental objects' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Initialize environmental objects if needed
    if (!room.gameState.mapData) {
      room.gameState.mapData = {};
    }
    if (!room.gameState.mapData.environmentalObjects) {
      room.gameState.mapData.environmentalObjects = [];
    }

    const { objectId, objectData, updateType } = data;

    switch (updateType) {
      case 'add':
        room.gameState.mapData.environmentalObjects.push({
          ...objectData,
          id: objectId || `env_${Date.now()}`,
          addedAt: new Date()
        });
        break;
      case 'update':
        room.gameState.mapData.environmentalObjects = room.gameState.mapData.environmentalObjects.map(obj =>
          obj.id === objectId ? { ...obj, ...objectData, lastUpdatedAt: new Date() } : obj
        );
        break;
      case 'remove':
        room.gameState.mapData.environmentalObjects = room.gameState.mapData.environmentalObjects.filter(obj =>
          obj.id !== objectId
        );
        break;
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist environmental object update:', error);
    }

    // Broadcast to other players
    socket.to(player.roomId).emit('environmental_object_updated', {
      objectId,
      objectData,
      updateType,
      environmentalObjects: room.gameState.mapData.environmentalObjects,
      updatedBy: player.id,
      timestamp: new Date()
    });

    console.log(`🏠 Environmental object ${objectId} ${updateType} by GM ${player.name}`);
  });

  // Player left notification - notify remaining players
  socket.on('leave_room', () => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    const roomId = player.roomId;
    const playerName = player.name;

    // Remove player from room
    room.players.delete(player.id);
    socket.leave(roomId);

    // Notify others - send in format client expects
    socket.to(roomId).emit('player_left', {
      player: {
        id: player.id,
        name: playerName
      },
      playerCount: room.players.size + 1 // Include GM (+1) in total count
    });

    // Clean up player tracking
    players.delete(socket.id);

    // Broadcast room list update
    io.emit('room_list_updated', getPublicRooms());

    logger.info('Player left room', { socketId: socket.id, roomId: roomId, playerName: playerName });
  });

  // Handle player disconnection (tab closed, internet lost, etc.)
  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (!player) {
      logger.info('Unregistered socket disconnected', { socketId: socket.id });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      players.delete(socket.id);
      logger.info('Player disconnected from non-existent room', { socketId: socket.id, playerName: player.name });
      return;
    }

    if (player.isGM) {
      // Mark GM as disconnected but keep room for potential reconnection
      room.isActive = false;
      room.gmDisconnectedAt = new Date();

      // Notify others in the room
      socket.to(room.id).emit('gm_disconnected', {
        gmName: player.name,
        timestamp: new Date()
      });

      logger.info('GM disconnected - room marked inactive', { roomId: room.id, gmName: player.name });
    } else {
      // Regular player disconnected - remove from room
      room.players.delete(player.id);

      // Notify others in the room
      socket.to(room.id).emit('player_left', {
        player: {
          id: player.id,
          name: player.name
        },
        playerCount: room.players.size + 1 // Total including GM
      });

      logger.info('Player disconnected', { roomId: room.id, playerName: player.name });
    }

    // Clean up player tracking
    players.delete(socket.id);

    // Broadcast list update to lobby users
    io.emit('room_list_updated', getPublicRooms());
  });
});

// Cleanup throttling maps periodically to prevent memory buildup
const throttleCleanupInterval = setInterval(() => {
  const now = Date.now();
  const THROTTLE_ENTRY_LIFETIME = 30000; // 30 seconds

  // Clean up token broadcast throttling
  if (global.recentTokenMovements) {
    for (const [key, timestamp] of global.recentTokenMovements.entries()) {
      if (now - timestamp > THROTTLE_ENTRY_LIFETIME) {
        global.recentTokenMovements.delete(key);
      }
    }
  }

  // Clean up character broadcast throttling
  if (global.recentCharacterMovements) {
    for (const [key, timestamp] of global.recentCharacterMovements.entries()) {
      if (now - timestamp > THROTTLE_ENTRY_LIFETIME) {
        global.recentCharacterMovements.delete(key);
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
  // Don't exit in production - let's process manager handle it
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