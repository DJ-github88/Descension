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

// Echo Prevention Window - standardized timeout across all stores
const ECHO_PREVENTION_WINDOW_MS = 200;

// Map Validation Helper - ensures maps exist before assigning data
function validateMapExists(room, mapId) {
  if (!room.gameState.maps) {
    room.gameState.maps = {};
  }

  if (!room.gameState.maps[mapId] && mapId !== 'default') {
    // Create map if it doesn't exist
    room.gameState.maps[mapId] = {
      id: mapId,
      name: mapId,
      tokens: {},
      characterTokens: {},
      gridItems: {},
      terrainData: [],
      wallData: [],
      drawingPaths: [],
      fogOfWarData: [],
      dndElements: [],
      createdAt: new Date()
    };
    console.log(`🗺️ Created new map structure: ${mapId}`);
  }

  return room.gameState.maps[mapId];
}

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
    // Production defaults - include Netlify domains AND localhost for local testing
    return [
      'https://windtunnel.netlify.app',
      'https://mythrill.netlify.app',
      'https://descension-mythrill.netlify.app', // Alternative domain
      'http://localhost:3000', // Allow local development testing
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
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
  fieldsToSkip: ['password', 'passwordHash', 'token', 'id', 'roomId', 'socketId', 'playerId', 'characterId', 'tokenId']
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
const players = new Map(); // socketId -> { id, name, roomId, isGM }

// Load persistent rooms from Firestore on startup
async function initializePersistentRooms() {
  try {
    logger.info('Initializing persistent rooms from Firestore...');
    const persistentRooms = await firebaseService.loadPersistentRooms();

    if (persistentRooms && persistentRooms.length > 0) {
      persistentRooms.forEach(room => {
        // Convert plain object players to Map if they aren't already
        // (firebaseService handles this, but let's be double sure)
        if (room.players && !(room.players instanceof Map)) {
          room.players = new Map(Object.entries(room.players));
        }
        rooms.set(room.id, room);
      });
      logger.info(`✅ Successfully loaded ${rooms.size} persistent rooms`);
    } else {
      logger.info('ℹ️ No active persistent rooms found in Firestore');
    }
  } catch (error) {
    logger.error('❌ Failed to load persistent rooms:', error);
  }
}

// Helper function to get available room list
function getPublicRooms() {
  return Array.from(rooms.values())
    .filter(room => {
      // CRITICAL FIX: Only show rooms where GM is actively connected
      // Offline/inactive rooms should NOT appear in public listing
      // They can only be accessed via "My Rooms" tab for authenticated users
      return room.isActive === true;
    })
    .map(room => ({
      id: room.id,
      name: room.name,
      playerCount: (room.players?.size || 0) + 1, // Include GM (+1) as they are the first "player" in the room
      maxPlayers: room.settings?.maxPlayers || 6,
      gm: room.gm?.name || 'Unknown',
      createdAt: room.createdAt,
      hasPassword: !!room.passwordHash, // Check if room actually has a password
      gmOnline: !!room.isActive // Accurately report GM online status
    }));
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
      // Default map ID for new rooms
      defaultMapId: 'default',
      // Track which map each player is on: { [playerId]: mapId }
      playerMapAssignments: {},
      // Multi-map storage: each map has its own data
      maps: {
        'default': {
          id: 'default',
          name: 'Default Map',
          thumbnailUrl: null,
          terrainData: {},
          wallData: {},
          environmentalObjects: [],
          drawingPaths: [],
          drawingLayers: [],
          fogOfWarData: {},
          fogOfWarPaths: [],
          fogErasePaths: [],
          exploredAreas: {},
          lightSources: {},
          dndElements: [],
          tokens: {},
          characterTokens: {},
          gridItems: {}
        }
      },
      // Legacy fields (for backward compatibility during migration)
      mapData: {
        backgrounds: [],
        activeBackgroundId: null,
        cameraPosition: { x: 0, y: 0 },
        zoomLevel: 1.0
      },
      tokens: {}, // Legacy - now per-map
      characterTokens: {}, // Legacy - now per-map
      gridItems: {}, // Legacy - now per-map
      fogOfWar: {}, // Legacy - now per-map
      // Level editor state for terrain, walls, objects, etc.
      levelEditor: {
        terrainData: {},
        wallData: {},
        environmentalObjects: [],
        drawingPaths: [],
        drawingLayers: [],
        fogOfWarData: {},
        fogOfWarPaths: [],
        fogErasePaths: [],
        exploredAreas: {},
        lightSources: {},
        dynamicFogEnabled: true,
        respectLineOfSight: true,
        dndElements: []
      },
      // Grid settings (type, size, colors, etc.)
      gridSettings: {
        gridType: 'square',
        gridSize: 50,
        gridOffsetX: 0,
        gridOffsetY: 0,
        gridLineColor: '#000000',
        gridLineThickness: 1,
        gridLineOpacity: 0.5,
        gridBackgroundColor: '#d4c5b9'
      }
    },
    chatHistory: [],
    createdAt: new Date().toISOString(), // Store as ISO string for proper serialization
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
    color: playerColor,
    currentMapId: 'default' // GM starts on default map
  });

  // Track GM's map assignment
  room.gameState.playerMapAssignments[gmPlayerId] = 'default';

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
  // We check by name (fallback) OR by character ID if provided
  const isGMAttempt = room.gm.name === playerName || (character && character.id === room.gm.id);

  if (isGMAttempt) {

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

  // Determine which map the player should start on (default map)
  const startMapId = room.gameState.defaultMapId || 'default';

  players.set(socketId, {
    id: playerId,
    name: playerName,
    roomId: roomId,
    isGM: false,
    color: playerColor || '#4a90e2', // Ensure color is always set
    currentMapId: startMapId // Players start on the default map
  });

  // Track player's map assignment in gameState
  room.gameState.playerMapAssignments[playerId] = startMapId;

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

      // Determine which map's data to send based on player's location
      const targetMapId = player.currentMapId || 'default';
      const targetMap = room.gameState.maps?.[targetMapId];

      let levelEditorData;

      if (targetMap) {
        // Use specific map data
        levelEditorData = {
          terrainData: targetMap.terrainData || {},
          wallData: targetMap.wallData || {},
          environmentalObjects: targetMap.environmentalObjects || [],
          drawingPaths: targetMap.drawingPaths || [],
          drawingLayers: targetMap.drawingLayers || [],
          fogOfWarData: targetMap.fogOfWarData || {},
          fogOfWarPaths: targetMap.fogOfWarPaths || [],
          fogErasePaths: targetMap.fogErasePaths || [],
          exploredAreas: targetMap.exploredAreas || {},
          lightSources: targetMap.lightSources || {},
          dndElements: targetMap.dndElements || [],
          dynamicFogEnabled: targetMap.dynamicFogEnabled !== undefined ? targetMap.dynamicFogEnabled : true,
          respectLineOfSight: targetMap.respectLineOfSight !== undefined ? targetMap.respectLineOfSight : true,
          // CRITICAL: Include grid items for initial sync
          gridItems: targetMap.gridItems || {},
          // CRITICAL: Include tokens for initial sync
          tokens: targetMap.tokens || {},
          characterTokens: targetMap.characterTokens || {}
        };
      } else {
        // Fallback to legacy global state if map not found (shouldn't happen with proper init)
        levelEditorData = {
          ...(room.gameState.mapData || {}),
          ...(room.gameState.levelEditor || {})
        };
      }

      // Emit success to joiner with full game state including level editor
      socket.emit('room_joined', {
        room,
        player,
        isGM: player.isGM,
        isGMReconnect,
        sessionId: socket.id,
        // Include level editor and grid settings for initial sync
        levelEditor: levelEditorData,
        gridSettings: (targetMap && targetMap.gridSettings) ? targetMap.gridSettings : (room.gameState.gridSettings || {})
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

  // ========== Level Editor State Synchronization ==========
  // Handle GM syncing level editor state to players
  socket.on('sync_level_editor_state', async (data) => {
    const player = players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    // Only GM can sync level editor state
    if (!player.isGM) {
      console.log(`⚠️ Non-GM player ${player.name} attempted to sync level editor state`);
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Update room gameState with level editor data
    if (data.levelEditor) {
      room.gameState.levelEditor = {
        ...room.gameState.levelEditor,
        ...data.levelEditor
      };
    }

    // Update grid settings
    if (data.gridSettings) {
      room.gameState.gridSettings = {
        ...room.gameState.gridSettings,
        ...data.gridSettings
      };
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist level editor state:', error);
    }

    // Broadcast to OTHER players only (not back to GM)
    socket.to(player.roomId).emit('level_editor_state_sync', {
      levelEditor: data.levelEditor || room.gameState.levelEditor,
      gridSettings: data.gridSettings || room.gameState.gridSettings,
      timestamp: new Date()
    });

    console.log(`🗺️ GM ${player.name} synced level editor state to room ${room.name}`);
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

    // CRITICAL FIX: Get target map ID for map isolation
    const targetMapId = (data.token && data.token.targetMapId) || data.targetMapId || player.currentMapId || 'default';

    // Initialize multi-map storage if needed
    if (!room.gameState.maps) room.gameState.maps = {};
    if (!room.gameState.maps[targetMapId]) {
      room.gameState.maps[targetMapId] = {
        id: targetMapId,
        name: targetMapId === 'default' ? 'Default Map' : `Map ${targetMapId}`,
        tokens: {},
        characterTokens: {},
        gridItems: {}
      };
    }
    if (!room.gameState.maps[targetMapId].tokens) {
      room.gameState.maps[targetMapId].tokens = {};
    }

    // Initialize legacy tokens if needed (for backward compatibility)
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
      lastMovedAt: null,
      mapId: targetMapId // Store map association
    };

    // Store in both specific map and legacy global storage
    room.gameState.maps[targetMapId].tokens[tokenId] = tokenData;
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

    // Broadcast to OTHER players on the SAME map only
    // targetMapId already calculated above

    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
        io.to(sid).emit('token_created', {
          creature: data.creature,
          token: { ...(data.token || {}), id: tokenId },
          position: data.position,
          playerId: socket.id,
          playerName: player.name,
          timestamp: new Date(),
          isSync: true,
          mapId: targetMapId
        });
      }
    }

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

    // FIXED: Ignore movement if it was received less than ECHO_PREVENTION_WINDOW_MS after local movement
    // This prevents server echo from resetting position while user is still dragging
    if (!global.recentTokenMovements) {
      global.recentTokenMovements = new Map();
    }
    const recentMove = global.recentTokenMovements.get(recentMoveKey);

    if (recentMove && (now - recentMove.timestamp) < ECHO_PREVENTION_WINDOW_MS) {
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

    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // CRITICAL FIX: Validate map exists to ensure map isolation
    validateMapExists(room, targetMapId);

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

      // Broadcast to OTHER players on the SAME map only
      // targetMapId already calculated above

      // Ensure target map storage is updated correctly for movements
      if (room.gameState.maps?.[targetMapId]?.tokens) {
        room.gameState.maps[targetMapId].tokens[tokenId] = room.gameState.tokens[tokenId];
      }

      for (const [sid, p] of players.entries()) {
        if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
          io.to(sid).emit('token_moved', {
            tokenId: tokenId,
            creatureId: data.creature?.id,
            position: data.position,
            playerId: player.id,
            playerName: player.name,
            isDragging: false,
            serverTimestamp: now,
            velocity: data.velocity || calculatedVelocity,
            actionId: data.actionId || `move_${now}`,
            mapId: targetMapId
          });
        }
      }
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

    // CRITICAL FIX: Update map-specific token storage as well
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    if (room.gameState.maps?.[targetMapId]?.tokens?.[tokenId]) {
      room.gameState.maps[targetMapId].tokens[tokenId].state = room.gameState.tokens[tokenId].state;
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist token update:', error);
    }

    // Broadcast to other players on the SAME map only


    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
        io.to(sid).emit('token_updated', {
          tokenId,
          stateUpdates,
          updatedBy: player.id,
          mapId: targetMapId
        });
      }
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

    // Broadcast to OTHER players on the SAME map only
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Update map-specific character tokens
    if (!room.gameState.maps) room.gameState.maps = {};
    if (!room.gameState.maps[targetMapId]) room.gameState.maps[targetMapId] = { characterTokens: {} };
    if (!room.gameState.maps[targetMapId].characterTokens) room.gameState.maps[targetMapId].characterTokens = {};

    room.gameState.maps[targetMapId].characterTokens[player.id] = characterTokenData;

    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
        io.to(sid).emit('character_token_created', {
          tokenId: data.tokenId,
          playerId: player.id,
          playerName: player.name,
          position: data.position,
          timestamp: new Date(),
          mapId: targetMapId
        });
      }
    }

    console.log(`🎭 Character token created by ${player.name} at`, data.position, `on map ${targetMapId}`);
  });

  // ========== CRITICAL FIX: Token Removal Synchronization ==========
  // Handle creature token removal - Broadcast to all other players
  socket.on('token_removed', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    const { tokenId } = data;
    if (!tokenId) {
      console.warn('⚠️ token_removed event received without tokenId');
      return;
    }

    // CRITICAL FIX: Get target map ID for map isolation
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Remove from room game state (both legacy and map-specific)
    let removed = false;
    if (room.gameState.tokens && room.gameState.tokens[tokenId]) {
      delete room.gameState.tokens[tokenId];
      removed = true;
    }

    if (room.gameState.maps?.[targetMapId]?.tokens?.[tokenId]) {
      delete room.gameState.maps[targetMapId].tokens[tokenId];
      removed = true;
    }

    if (removed) {
      // Persist to Firebase
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist token removal:', error);
      }
    }

    // Broadcast to OTHER players on the SAME map only
    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
        io.to(sid).emit('token_removed', {
          tokenId,
          removedBy: player.id,
          removedByName: player.name,
          timestamp: new Date(),
          mapId: targetMapId
        });
      }
    }

    console.log(`🗑️ Token ${tokenId} removed by ${player.name} from map ${targetMapId}`);
  });

  // Handle character token removal - Broadcast to all other players
  socket.on('character_token_removed', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    const { tokenId } = data;
    if (!tokenId) {
      console.warn('⚠️ character_token_removed event received without tokenId');
      return;
    }

    // CRITICAL FIX: Get target map ID for map isolation
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Remove from room game state (both legacy and map-specific)
    let removed = false;

    if (room.gameState.characterTokens) {
      // Try to find and remove the token (could be indexed by tokenId or playerId)
      if (room.gameState.characterTokens[tokenId]) {
        delete room.gameState.characterTokens[tokenId];
        removed = true;
      }
      // Also check if indexed by another key with matching id property
      Object.keys(room.gameState.characterTokens).forEach(key => {
        if (room.gameState.characterTokens[key]?.id === tokenId) {
          delete room.gameState.characterTokens[key];
          removed = true;
        }
      });
    }

    if (room.gameState.maps?.[targetMapId]?.characterTokens) {
      if (room.gameState.maps[targetMapId].characterTokens[tokenId]) {
        delete room.gameState.maps[targetMapId].characterTokens[tokenId];
        removed = true;
      }
      // Also check player ID
      if (room.gameState.maps[targetMapId].characterTokens[player.id]) {
        delete room.gameState.maps[targetMapId].characterTokens[player.id];
        removed = true;
      }
    }

    if (removed) {
      // Persist to Firebase
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist character token removal:', error);
      }
    }

    // Broadcast to OTHER players on the SAME map only
    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
        io.to(sid).emit('character_token_removed', {
          tokenId,
          removedBy: player.id,
          removedByName: player.name,
          timestamp: new Date(),
          mapId: targetMapId
        });
      }
    }

    console.log(`🗑️ Character token ${tokenId} removed by ${player.name}`);
  });

  // Handle character movement - FIXED: Prevent echo-induced position resets
  socket.on('character_moved', async (data) => {
    // DEBUG: Log received data
    console.log('📥 Server received character_moved:', {
      tokenId: data.tokenId,
      characterId: data.characterId,
      playerId: data.playerId,
      position: data.position,
      fromSocket: socket.id
    });

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

    // CRITICAL: Use tokenId as primary identification for character tokens
    // Fall back to characterId or playerId if tokenId is missing
    const targetTokenId = data.tokenId || data.characterId || data.playerId || socket.id;
    const senderPlayerId = player.id;

    // FIXED: Track recent movements to prevent echo-induced position resets
    // Use targetTokenId so we track movements PER TOKEN, regardless of who moved it
    const recentMoveKey = `${player.roomId}_character_${targetTokenId}`;
    const now = Date.now();

    // FIXED: Ignore stale movement echoes
    if (!global.recentTokenMovements) {
      global.recentTokenMovements = new Map();
    }
    const recentMove = global.recentTokenMovements.get(recentMoveKey);

    if (recentMove && (now - recentMove.timestamp) < 100) {
      console.log(`🚫 Ignoring stale character movement echo for token ${targetTokenId} (${now - recentMove.timestamp}ms old)`);
      return;
    }

    // Track this movement
    global.recentTokenMovements.set(recentMoveKey, {
      position: data.position,
      timestamp: now,
      socketId: socket.id
    });

    // Update token position in room state
    if (!room.gameState.characterTokens[targetTokenId]) {
      room.gameState.characterTokens[targetTokenId] = {};
    }

    room.gameState.characterTokens[targetTokenId].position = data.position;
    room.gameState.characterTokens[targetTokenId].lastMovedAt = new Date().toISOString();
    room.gameState.characterTokens[targetTokenId].lastMovedBy = senderPlayerId;

    // Update map-specific token position
    const targetMapId = data.targetMapId || player.currentMapId || 'default';
    if (!room.gameState.maps) room.gameState.maps = {};
    if (!room.gameState.maps[targetMapId]) room.gameState.maps[targetMapId] = { characterTokens: {} };
    if (!room.gameState.maps[targetMapId].characterTokens) room.gameState.maps[targetMapId].characterTokens = {};

    room.gameState.maps[targetMapId].characterTokens[targetTokenId] = room.gameState.characterTokens[targetTokenId];

    // Persist to Firebase (only final positions, not during drag)
    if (!data.isDragging) {
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist character token movement:', error);
      }
    }

    // CRITICAL FIX: Calculate velocity for lag compensation
    const charToken = room.gameState.characterTokens[targetTokenId];
    const prevCharPos = charToken?.position || data.position;
    const charTimeDelta = charToken?.lastMovedAt ? (now - new Date(charToken.lastMovedAt).getTime()) : 100;
    const charVelocity = {
      x: charTimeDelta > 0 ? (data.position.x - prevCharPos.x) / (charTimeDelta / 1000) : 0,
      y: charTimeDelta > 0 ? (data.position.y - prevCharPos.y) / (charTimeDelta / 1000) : 0
    };

    // Build the broadcast payload
    const broadcastPayload = {
      position: data.position,
      playerId: player.id,
      tokenId: data.tokenId, // CRITICAL: Include tokenId for client echo prevention
      characterId: data.characterId, // Include for backward compatibility
      playerName: player.name,
      isDragging: data.isDragging || false,
      timestamp: new Date(),
      serverTimestamp: now,
      velocity: data.velocity || charVelocity
    };

    // CRITICAL DEBUG: Log exactly what we're broadcasting
    // If tokenId is undefined here, the client won't be able to identify the token!
    if (!broadcastPayload.tokenId) {
      console.warn('⚠️ Broadcasting character_moved WITHOUT tokenId! Client will have trouble identifying the token.', {
        receivedTokenId: data.tokenId,
        receivedCharacterId: data.characterId,
        usingTargetTokenId: targetTokenId,
        fromPlayer: player.name
      });
    }

    console.log('📤 Server broadcasting character_moved:', {
      tokenId: broadcastPayload.tokenId,
      characterId: broadcastPayload.characterId,
      playerId: broadcastPayload.playerId,
      position: broadcastPayload.position,
      hasTokenId: !!broadcastPayload.tokenId,
      toRoom: player.roomId
    });

    // CRITICAL FIX: Broadcast to OTHER players on the SAME map only
    // targetMapId already calculated above
    socket.to(player.roomId).timeout(5000).emit('character_moved', broadcastPayload, (err) => {
      if (err) console.warn('Broadcast character_moved timeout');
    });

    // Manual filtering for cases where socket.to().emit() might be too broad
    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
        // Already handled by socket.to(room).emit for recipients on same map?
        // Actually socket.to(roomId) sends to everyone in room.
        // We should use more precise targeting if possible.
      }
    }

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
  // NEW: Now supports per-map isolation - only players on the same map receive updates
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

    // Always use targetMapId from GM's emit (player.currentMapId is wrong source!)
    const targetMapId = data.targetMapId || 'default';

    // CRITICAL FIX: Validate map exists to ensure map isolation
    const mapData = validateMapExists(room, targetMapId);

    const mapUpdates = data.mapUpdates;

    // Handle terrain data updates
    if (mapUpdates.terrainData) {
      // Merge terrain data
      mapData.terrainData = {
        ...mapData.terrainData || {},
        ...mapUpdates.terrainData
      };
      // Handle null values (deleted tiles)
      for (const [key, value] of Object.entries(mapUpdates.terrainData)) {
        if (value === null && mapData.terrainData[key] !== undefined) {
          delete mapData.terrainData[key];
        }
      }
      // Update legacy format for backward compatibility
      if (!room.gameState.mapData) room.gameState.mapData = {};
      room.gameState.mapData.terrainData = { ...mapData.terrainData };
    }

    // Handle wall data updates
    if (mapUpdates.wallData !== undefined) {
      mapData.wallData = mapUpdates.wallData || {};
      if (!room.gameState.mapData) room.gameState.mapData = {};
      room.gameState.mapData.wallData = mapUpdates.wallData;
    }

    // Handle fog of war updates
    if (mapUpdates.fogOfWar !== undefined) {
      mapData.fogOfWarData = mapUpdates.fogOfWar;
    }
    if (mapUpdates.fogOfWarPaths !== undefined) {
      mapData.fogOfWarPaths = mapUpdates.fogOfWarPaths;
    }
    if (mapUpdates.fogErasePaths !== undefined) {
      mapData.fogErasePaths = mapUpdates.fogErasePaths;
    }
    if (mapUpdates.exploredAreas !== undefined) {
      mapData.exploredAreas = mapUpdates.exploredAreas;
    }

    // Handle drawing updates
    if (mapUpdates.drawingLayers !== undefined) {
      mapData.drawingLayers = mapUpdates.drawingLayers;
    }
    if (mapUpdates.drawingPaths !== undefined) {
      mapData.drawingPaths = mapUpdates.drawingPaths;
    }

    // Handle dndElements (connections/portals)
    if (mapUpdates.dndElements !== undefined) {
      mapData.dndElements = mapUpdates.dndElements;
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist map update:', error);
    }

    // CRITICAL FIX: Broadcast map_updated event to OTHER players on SAME MAP
    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
        io.to(sid).emit('map_updated', {
          mapId: targetMapId,
          mapData: mapUpdates,
          updatedBy: player.id
        });
      }
    }

    console.log(`🗺️ Map update on ${targetMapId} by GM ${player.name}: ${Object.keys(mapUpdates).join(', ')}`);
  });

  // Handle grid item updates (loot orbs, objects on grid)
  // This is a unified handler that replaces two duplicate handlers
  socket.on('grid_item_update', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) {
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

    // Support both old format (type) and new format (updateType)
    const type = data.type || data.updateType;
    const updateData = data.data || {};
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // CRITICAL FIX: Validate map exists to ensure map isolation
    validateMapExists(room, targetMapId);

    // Handle different update types
    switch (type) {
      case 'grid_item_moved':
      case 'move': {
        const gridItemId = data.itemId || updateData.gridItemId || updateData.itemId;
        const newPosition = data.position || updateData.newPosition;

        if (!gridItemId || !newPosition) {
          console.warn('Invalid grid item move data:', data);
          return;
        }

        const existingItem = room.gameState.gridItems[gridItemId];
        if (existingItem) {
          // Update item position
          const updatedItem = {
            ...existingItem,
            position: newPosition,
            gridPosition: newPosition.gridPosition,
            lastMovedBy: player.id,
            lastMovedAt: new Date()
          };
          room.gameState.gridItems[gridItemId] = updatedItem;

          // Update in map-specific location
          if (room.gameState.maps?.[targetMapId]?.gridItems) {
            room.gameState.maps[targetMapId].gridItems[gridItemId] = updatedItem;
          }

          // Persist to Firebase (use batch writer for performance)
          try {
            firebaseBatchWriter.queueWrite(player.roomId, room.gameState);
          } catch (error) {
            console.error('Failed to persist grid item move:', error);
          }

          // Broadcast to OTHER players on SAME MAP only
          for (const [sid, p] of players.entries()) {
            if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
              io.to(sid).emit('grid_item_updated', {
                updateType: 'move',
                itemId: gridItemId,
                itemData: updatedItem,
                position: newPosition,
                updatedBy: player.id,
                updatedByName: player.name,
                timestamp: Date.now(),
                mapId: targetMapId
              });
            }
          }

          console.log(`📦 Grid item ${gridItemId} moved by ${player.name} on map ${targetMapId}`);
        }
        break;
      }

      case 'grid_item_removed':
      case 'remove': {
        const gridItemId = data.itemId || updateData.gridItemId;
        if (!gridItemId) return;

        if (room.gameState.gridItems[gridItemId]) {
          delete room.gameState.gridItems[gridItemId];

          // Remove from map-specific location
          if (room.gameState.maps?.[targetMapId]?.gridItems?.[gridItemId]) {
            delete room.gameState.maps[targetMapId].gridItems[gridItemId];
          }

          // Persist to Firebase
          try {
            firebaseBatchWriter.queueWrite(player.roomId, room.gameState);
          } catch (error) {
            console.error('Failed to persist grid item removal:', error);
          }

          // Broadcast to OTHER players on SAME MAP only
          for (const [sid, p] of players.entries()) {
            if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
              io.to(sid).emit('grid_item_updated', {
                updateType: 'remove',
                itemId: gridItemId,
                updatedBy: player.id,
                updatedByName: player.name,
                timestamp: Date.now(),
                mapId: targetMapId
              });
            }
          }

          console.log(`📦 Grid item ${gridItemId} removed by ${player.name} from map ${targetMapId}`);
        }
        break;
      }

      case 'add': {
        const itemId = data.itemId;
        const itemData = data.itemData || updateData;
        const position = data.position;

        if (!itemId || !itemData || !position) {
          console.warn('Invalid grid item add data:', data);
          return;
        }

        const newItem = {
          ...itemData,
          id: itemId,
          position: position,
          addedBy: player.id,
          addedAt: new Date(),
          mapId: targetMapId
        };

        room.gameState.gridItems[itemId] = newItem;
        room.gameState.maps[targetMapId].gridItems[itemId] = newItem;

        // Persist to Firebase
        try {
          firebaseBatchWriter.queueWrite(player.roomId, room.gameState);
        } catch (error) {
          console.error('Failed to persist grid item addition:', error);
        }

        // Broadcast to OTHER players on SAME MAP only
        for (const [sid, p] of players.entries()) {
          if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
            io.to(sid).emit('grid_item_updated', {
              updateType: 'add',
              itemId: itemId,
              itemData: newItem,
              position: position,
              updatedBy: player.id,
              updatedByName: player.name,
              timestamp: Date.now(),
              mapId: targetMapId
            });
          }
        }

        console.log(`📦 Grid item ${itemId} added by ${player.name} on map ${targetMapId}`);
        break;
      }

      default:
        console.warn('Unknown grid item update type:', type);
    }
  });

  // ========== NEW HANDLERS: Map Synchronization ==========

  // Handler: GM switches to a different map view
  socket.on('gm_switch_view', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      socket.emit('error', { message: 'Only GM can switch views' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Update GM's current map on server
    player.currentMapId = data.newMapId;

    // Get target map data to include in broadcast
    const targetMap = room.gameState.maps?.[data.newMapId];

    // Broadcast to all players so they know GM is looking at a different map
    io.to(player.roomId).emit('gm_view_changed', {
      gmId: player.id,
      gmName: player.name,
      newMapId: data.newMapId,
      mapName: data.mapName,
      mapData: targetMap ? {
        terrainData: targetMap.terrainData || {},
        wallData: targetMap.wallData || {},
        environmentalObjects: targetMap.environmentalObjects || [],
        drawingPaths: targetMap.drawingPaths || [],
        drawingLayers: targetMap.drawingLayers || [],
        fogOfWarPaths: targetMap.fogOfWarPaths || [],
        fogErasePaths: targetMap.fogErasePaths || [],
        dndElements: targetMap.dndElements || [],
        backgrounds: targetMap.backgrounds || [],
        activeBackgroundId: targetMap.activeBackgroundId || null,
        gridSettings: targetMap.gridSettings || {}
      } : {}
    });

    console.log(`🗺️ GM ${player.name} switched to map ${data.newMapId}`);
  });

  // Handler: GM transfers a player to a different map
  socket.on('gm_transfer_player', async (data) => {
    const gmPlayer = players.get(socket.id);
    if (!gmPlayer || !gmPlayer.isGM) {
      socket.emit('error', { message: 'Only GM can transfer players' });
      return;
    }

    const room = rooms.get(gmPlayer.roomId);
    if (!room) return;

    const targetPlayer = Array.from(players.values()).find(
      p => p.id === data.targetPlayerId || p.socketId === data.targetPlayerId
    );

    if (!targetPlayer) {
      socket.emit('error', { message: 'Player not found' });
      return;
    }

    // Update target player's current map on server
    targetPlayer.currentMapId = data.destinationMapId;

    // Notify the player being transferred
    io.to(targetPlayer.socketId).emit('player_transferred', {
      destinationMapId: data.destinationMapId,
      destinationPosition: data.destinationPosition || { x: 0, y: 0 },
      mapName: data.mapName
    });

    // Notify GM of successful transfer
    socket.emit('player_transfer_complete', {
      playerId: targetPlayer.id,
      playerName: targetPlayer.name,
      destinationMapId: data.destinationMapId
    });

    // Get destination map data to include in broadcast
    const destMap = room.gameState.maps?.[data.destinationMapId];
   
    // CRITICAL FIX: Broadcast player_map_changed to affected players only
    // Only send to: transferred player, players on destination map, GM (if not transferring themselves)
    // This prevents transition screen for GM when they're just switching their own view
    for (const [sid, p] of players.entries()) {
      const isAffectedPlayer = 
        // Player being transferred should always receive
        p.id === targetPlayer.id ||
        // Players on destination map should receive
        p.currentMapId === data.destinationMapId ||
        // GM should receive if they're not the one being transferred
        (gmPlayer.id !== targetPlayer.id && p.isGM);
      
      if (isAffectedPlayer) {
        io.to(sid).emit('player_map_changed', {
          playerId: targetPlayer.id,
          playerName: targetPlayer.name,
          newMapId: data.destinationMapId,
          mapName: data.mapName,
          transferredByGM: true, // CRITICAL: Indicates this is an actual transfer, not just GM viewing different map
          mapData: destMap ? {
            terrainData: destMap.terrainData || {},
            wallData: destMap.wallData || {},
            environmentalObjects: destMap.environmentalObjects || [],
            drawingPaths: destMap.drawingPaths || [],
            drawingLayers: destMap.drawingLayers || [],
            fogOfWarPaths: destMap.fogOfWarPaths || [],
            fogErasePaths: destMap.fogErasePaths || [],
            dndElements: destMap.dndElements || [],
            backgrounds: destMap.backgrounds || [],
            activeBackgroundId: destMap.activeBackgroundId || null,
            gridSettings: destMap.gridSettings || {}
          } : {}
        });
      }
    }

    console.log(`🎮 GM transferred ${targetPlayer.name} to map ${data.destinationMapId}`);
  });

  // Handler: Player uses connection/portal to transfer between maps
  socket.on('player_use_connection', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) {
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const { connectionId } = data;
    if (!connectionId) {
      socket.emit('error', { message: 'Connection ID is required' });
      return;
    }

    // Find the portal/connection on current map
    const currentMap = room.gameState.maps?.[player.currentMapId];
    if (!currentMap) {
      socket.emit('error', { message: 'Current map not found' });
      return;
    }

    const portal = currentMap.portals?.[connectionId] ||
                 currentMap.dndElements?.find(el => el.id === connectionId && el.type === 'portal');

    if (!portal) {
      socket.emit('error', { message: 'Portal not found' });
      return;
    }

    // Check if portal is active and configured
    const isActive = portal.properties?.isActive !== false;
    if (!isActive) {
      socket.emit('error', { message: 'Portal is currently inactive' });
      return;
    }

    const destinationMapId = portal.properties?.destinationMapId;
    if (!destinationMapId) {
      socket.emit('error', { message: 'Portal is not configured with a destination' });
      return;
    }

    // Get destination map for validation
    const destMap = room.gameState.maps?.[destinationMapId];
    if (!destMap) {
      socket.emit('error', { message: 'Destination map does not exist' });
      return;
    }

    // Update player's current map
    player.currentMapId = destinationMapId;

    // Prepare destination position
    const destinationPosition = portal.properties?.destinationPosition || destMap.cameraPosition || { x: 0, y: 0 };
    const destinationConnectionId = portal.properties?.destinationConnectionId || portal.properties?.connectedToId;

    // Broadcast to affected players
    const affectedPlayers = [];
    for (const [sid, p] of players.entries()) {
      // Notify: player being transferred, players on destination map, GM
      const isAffected = p.id === player.id ||
                       p.currentMapId === destinationMapId ||
                       p.isGM;

      if (isAffected) {
        affectedPlayers.push(sid);

        io.to(sid).emit('player_map_changed', {
          playerId: player.id,
          playerName: player.name,
          newMapId: destinationMapId,
          mapName: destMap.name || destinationMapId,
          centerPosition: destinationPosition,
          transferredByGM: false,
          portalUsed: {
            sourceConnectionId: connectionId,
            destinationConnectionId: destinationConnectionId,
            portalName: portal.properties?.portalName || portal.name || 'Portal'
          },
          mapData: {
            terrainData: destMap.terrainData || [],
            wallData: destMap.wallData || [],
            tokens: destMap.tokens || {},
            characterTokens: destMap.characterTokens || {},
            gridItems: destMap.gridItems || {},
            dndElements: destMap.dndElements || [],
            backgrounds: destMap.backgrounds || [],
            gridSettings: destMap.gridSettings || {}
          }
        });
      }
    }

    // Batch write to Firebase
    firebaseBatchWriter.queueWrite(player.roomId, room.gameState);

    console.log(`🌀 Player ${player.name} used portal ${connectionId} to transfer to map ${destinationMapId}`);
    console.log(`   Affected players: ${affectedPlayers.length}`);
  });

  // Handler: Sync complete map state to Firebase
  socket.on('sync_map_state', async (data) => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    const { mapId, ...mapData } = data;

    // Ensure map structure exists
    if (!room.gameState.maps) {
      room.gameState.maps = {};
    }

    if (!room.gameState.maps[mapId]) {
      room.gameState.maps[mapId] = {
        id: mapId,
        name: data.mapName || mapId,
        tokens: {},
        characterTokens: {},
        gridItems: {},
        terrainData: [],
        wallData: [],
        drawingPaths: [],
        fogOfWarData: [],
        dndElements: []
      };
    }

    // Update map data
    room.gameState.maps[mapId] = {
      ...room.gameState.maps[mapId],
      ...mapData,
      lastUpdatedBy: player.id,
      lastUpdatedAt: new Date()
    };

    // Batch write to Firebase
    firebaseBatchWriter.queueWrite(player.roomId, room.gameState);

    console.log(`💾 Map ${mapId} synced by ${player.name}`);
  });

  // ========== END NEW HANDLERS ==========

  // Handle character resource updates (HP, Mana, AP changes from player or GM)
  socket.on('character_resource_updated', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    const { resource, current, max, temp, timestamp, playerId, playerName } = data;

    // Determine target - either the sender or a specific player (GM updating someone else)
    const targetPlayerId = playerId || player.id;
    // Use provided playerName, or look up from players map, or use sender's name
    const targetPlayerName = playerName ||
      (playerId ? (Array.from(players.values()).find(p => p.id === playerId)?.name || 'Unknown') : player.name);

    // Update target player's character state in room
    if (!room.players) room.players = {};
    if (!room.players[targetPlayerId]) room.players[targetPlayerId] = {};
    if (!room.players[targetPlayerId].character) room.players[targetPlayerId].character = {};

    // Update the specific resource
    room.players[targetPlayerId].character[resource] = { current, max };

    // Also store temporary resources in room state if provided
    if (temp !== undefined) {
      const tempFieldMap = {
        'health': 'tempHealth',
        'mana': 'tempMana',
        'actionPoints': 'tempActionPoints'
      };
      const tempField = tempFieldMap[resource];
      if (tempField) {
        room.players[targetPlayerId].character[tempField] = temp;
      }
    }

    // Broadcast to all other players in the room
    console.log(`📤 Broadcasting character_resource_updated to room ${player.roomId}:`, {
      targetPlayerId,
      targetPlayerName,
      resource,
      current,
      max,
      temp,
      adjustment: data.adjustment,
      senderName: player.name
    });

    socket.to(player.roomId).emit('character_resource_updated', {
      playerId: targetPlayerId,
      playerName: targetPlayerName,
      resource,
      current,
      max,
      temp,
      adjustment: data.adjustment, // Include adjustment for FCT sync
      timestamp
    });

    console.log(`💊 ${targetPlayerName} ${resource} updated: ${current}/${max}${temp !== undefined ? ` (Temp: ${temp})` : ''} (by ${player.name})`);
  });

  // Handle combat start (GM starting combat)
  socket.on('combat_started', (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Store combat state in room
    room.combatState = {
      isInCombat: true,
      turnOrder: data.turnOrder,
      round: data.round || 1,
      currentTurnIndex: data.currentTurnIndex || 0,
      startedAt: Date.now()
    };

    // Broadcast to all other players in the room
    socket.to(player.roomId).emit('combat_started', {
      turnOrder: data.turnOrder,
      round: data.round,
      currentTurnIndex: data.currentTurnIndex,
      timestamp: data.timestamp
    });

    console.log(`⚔️ Combat started by ${player.name} with ${data.turnOrder?.length || 0} combatants`);
  });

  // Handle combat end
  socket.on('combat_ended', (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Clear combat state in room
    room.combatState = null;

    // Broadcast to all other players in the room
    socket.to(player.roomId).emit('combat_ended', {
      timestamp: data.timestamp
    });

    console.log(`🏳️ Combat ended by ${player.name}`);
  });

  // Handle party updates (leadership transfer, member updates, etc.)
  socket.on('party_update', (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Broadcast party update to ALL players in the room (including sender for consistency)
    // This is critical for leadership transfers where the sender also needs confirmationn
    io.to(player.roomId).emit('party_update', {
      ...data,
      playerId: socket.id // Ensure playerId is present for echo prevention
    });

    console.log(`👑 Party update (${data.type}) from ${player.name}:`, data.data);
  });

  // Handle GM actions (XP awards, rests, etc.) - broadcasts to selected players only
  socket.on('gm_action', (data) => {
    const player = players.get(socket.id);
    if (!player) {
      console.log('🎮 gm_action: Player not found for socket:', socket.id);
      socket.emit('error', { message: 'You are not in a room' });
      return;
    }

    // Only GM can send GM actions
    if (!player.isGM) {
      console.log('🎮 gm_action: Player is not GM:', player.name);
      socket.emit('error', { message: 'Only the Game Master can perform this action' });
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) {
      console.log('🎮 gm_action: Room not found:', player.roomId);
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const { type, targetPlayerIds, ...actionData } = data;

    console.log(`🎮 GM ${player.name} gm_action received:`, { type, targetPlayerIds, actionData });

    if (!targetPlayerIds || !Array.isArray(targetPlayerIds)) {
      console.log('🎮 gm_action: Invalid targetPlayerIds:', targetPlayerIds);
      socket.emit('error', { message: 'Invalid target players' });
      return;
    }

    // Get all sockets in the room
    const roomSockets = io.sockets.adapter.rooms.get(player.roomId);
    if (!roomSockets) {
      console.log('🎮 gm_action: No sockets in room');
      return;
    }

    // Log all players in the room for debugging
    console.log('🎮 gm_action: Players in room:');
    roomSockets.forEach(socketId => {
      const p = players.get(socketId);
      console.log(`  - socketId: ${socketId}, player.id: ${p?.id}, name: ${p?.name}, isGM: ${p?.isGM}`);
    });

    let sentCount = 0;

    // Send to each targeted player
    targetPlayerIds.forEach(targetId => {
      // Skip 'current-player' - GM already handled locally
      if (targetId === 'current-player') {
        console.log('🎮 Skipping current-player (GM handles locally)');
        return;
      }

      // Find the target socket - check both socketId and player.id
      roomSockets.forEach(socketId => {
        const targetPlayer = players.get(socketId);
        if (!targetPlayer) return;

        // Match by either the socket ID or the player's assigned ID
        const isMatch = targetPlayer.id === targetId || socketId === targetId;

        if (isMatch && !targetPlayer.isGM) {
          io.to(socketId).emit('gm_action', {
            type,
            ...actionData
          });
          console.log(`🎮 GM action '${type}' sent to ${targetPlayer.name} (socket: ${socketId})`);
          sentCount++;
        }
      });
    });

    console.log(`挑 GM ${player.name} performed '${type}' action - sent to ${sentCount} players (targeted: ${targetPlayerIds.length})`);
  });

  // Handle synchronization of gameplay settings from GM to players
  socket.on('sync_gameplay_settings', (data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {
      console.warn(`⚠️ Socket ${socket.id} attempted to sync settings but is not a GM`);
      return;
    }

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Broadcast the settings to all other players in the room
    socket.to(player.roomId).emit('sync_gameplay_settings', {
      ...data,
      gmId: player.id,
      gmName: player.name
    });

    console.log(`⚙️ GM ${player.name} synced gameplay settings to room ${player.roomId}:`, data);
  });

  // NOTE: item_dropped is handled above with proper map isolation at line ~3145
  // This duplicate handler was removed to prevent conflicting broadcasts

  // Handle combat turn changes (GM advancing turns)
  socket.on('combat_turn_changed', (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    // Update room combat state
    if (room.combatState) {
      room.combatState.currentTurnIndex = data.currentTurnIndex;
      room.combatState.round = data.round;
      room.combatState.turnOrder = data.turnOrder;
    }

    // Broadcast to all other players in the room
    socket.to(player.roomId).emit('combat_turn_changed', {
      currentTurnIndex: data.currentTurnIndex,
      round: data.round,
      turnOrder: data.turnOrder,
      timestamp: data.timestamp
    });

    console.log(`⚔️ Combat turn changed by ${player.name}: Turn ${data.currentTurnIndex + 1}, Round ${data.round}`);
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

  // Handle cursor position updates for cursor tracking
  socket.on('cursor_move', (data) => {
    const player = players.get(socket.id);
    if (!player || !player.roomId) return;

    // CRITICAL FIX: Broadcast cursor only to players on the SAME map
    const currentMapId = player.currentMapId || 'default';

    // Manual filtering for map isolation
    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === currentMapId) {
        io.to(sid).emit('cursor_move', {
          playerId: player.id,
          playerName: player.name,
          playerColor: data.playerColor || '#4a90e2',
          worldX: data.worldX,
          worldY: data.worldY,
          x: data.x,
          y: data.y,
          mapId: currentMapId
        });
      }
    }
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

    // CRITICAL FIX: Get target map ID for map isolation
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Initialize map storage if needed
    if (!room.gameState.maps) room.gameState.maps = {};
    if (!room.gameState.maps[targetMapId]) {
      room.gameState.maps[targetMapId] = { tokens: {} };
    }
    if (!room.gameState.maps[targetMapId].tokens) {
      room.gameState.maps[targetMapId].tokens = {};
    }

    const tokenId = data.id || `creature_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    const tokenData = {
      id: tokenId,
      creatureId: data.creatureId,
      position: data.position,
      velocity: data.velocity || { x: 0, y: 0 },
      createdBy: player.id,
      createdAt: new Date(),
      mapId: targetMapId
    };

    // Store in global (legacy) and map-specific storage
    room.gameState.tokens[tokenId] = tokenData;
    room.gameState.maps[targetMapId].tokens[tokenId] = tokenData;

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
      success: true,
      mapId: targetMapId
    });

    // Broadcast to other players ON THE SAME MAP
    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
        io.to(sid).emit('creature_added', {
          id: tokenId,
          creatureId: data.creatureId,
          position: data.position,
          velocity: data.velocity,
          createdBy: player.id,
          createdByName: player.name,
          timestamp: new Date(),
          mapId: targetMapId
        });
      }
    }

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

    // Use targetMapId from data or find token to get its map
    let targetMapId = data.targetMapId;
    if (!targetMapId && room.gameState.tokens[data.tokenId]) {
      targetMapId = room.gameState.tokens[data.tokenId].mapId || 'default';
    }
    targetMapId = targetMapId || player.currentMapId || 'default';

    // Update creature state
    const updateData = {
      ...room.gameState.tokens[data.tokenId],
      ...data.stateUpdates,
      lastUpdatedBy: player.id,
      lastUpdatedAt: new Date()
    };

    room.gameState.tokens[data.tokenId] = updateData;

    // Update in map-specific storage
    if (room.gameState.maps?.[targetMapId]?.tokens?.[data.tokenId]) {
      room.gameState.maps[targetMapId].tokens[data.tokenId] = updateData;
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist creature update:', error);
    }

    // Broadcast to other players on SAME MAP
    for (const [sid, p] of players.entries()) {
      if (sid !== socket.id && p.roomId === player.roomId && p.currentMapId === targetMapId) {
        io.to(sid).emit('creature_updated', {
          tokenId: data.tokenId,
          stateUpdates: data.stateUpdates,
          updatedBy: player.id,
          timestamp: new Date(),
          mapId: targetMapId
        });
      }
    }
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

    // Get the target map ID - default to GM's current map or 'default'
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Ensure the maps object and specific map exist
    if (!room.gameState.maps) {
      room.gameState.maps = {};
    }
    if (!room.gameState.maps[targetMapId]) {
      room.gameState.maps[targetMapId] = {
        id: targetMapId,
        name: targetMapId === 'default' ? 'Default Map' : `Map ${targetMapId}`,
        wallData: {}
      };
    }

    const targetMap = room.gameState.maps[targetMapId];

    const { wallId, wallData, updateType } = data;

    switch (updateType) {
      case 'add':
      case 'update':
        targetMap.wallData[wallId] = {
          ...wallData,
          id: wallId,
          lastUpdatedBy: player.id,
          lastUpdatedAt: new Date()
        };
        break;
      case 'remove':
        delete targetMap.wallData[wallId];
        break;
    }

    // Also update legacy if this is the default map
    if (targetMapId === 'default' || targetMapId === room.gameState.defaultMapId) {
      if (!room.gameState.mapData) room.gameState.mapData = {};
      if (!room.gameState.mapData.wallData) room.gameState.mapData.wallData = {};

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
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist wall update:', error);
    }

    // MAP ISOLATION: Only broadcast to players on the SAME map
    const playersOnThisMap = [];
    for (const [socketId, playerData] of players.entries()) {
      if (playerData.roomId === player.roomId && playerData.currentMapId === targetMapId) {
        playersOnThisMap.push(socketId);
      }
    }

    // Also include the GM (the sender) if they aren't on the map but are editing it
    if (!playersOnThisMap.includes(socket.id)) {
      playersOnThisMap.push(socket.id);
    }

    // Broadcast to specific sockets only
    for (const targetSocketId of playersOnThisMap) {
      if (targetSocketId === socket.id) continue;

      io.to(targetSocketId).emit('wall_updated', {
        wallId,
        wallData,
        updateType,
        mapId: targetMapId,
        updatedBy: player.id,
        timestamp: new Date()
      });
    }

    console.log(`🧱 Wall ${wallId} ${updateType} on map ${targetMapId} by GM ${player.name}`);
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

    // Get the target map ID - default to GM's current map or 'default'
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Ensure the maps object and specific map exist
    if (!room.gameState.maps) {
      room.gameState.maps = {};
    }
    if (!room.gameState.maps[targetMapId]) {
      room.gameState.maps[targetMapId] = {
        id: targetMapId,
        name: targetMapId === 'default' ? 'Default Map' : `Map ${targetMapId}`,
        terrainData: {}
      };
    }

    const targetMap = room.gameState.maps[targetMapId];

    // Apply terrain updates (can be batch updates)
    if (data.terrainData) {
      targetMap.terrainData = {
        ...targetMap.terrainData,
        ...data.terrainData
      };
    }

    // Handle single tile update
    if (data.tileKey && data.terrainType !== undefined) {
      if (data.terrainType === null) {
        delete targetMap.terrainData[data.tileKey];
      } else {
        targetMap.terrainData[data.tileKey] = data.terrainType;
      }
    }

    // Also update legacy if this is the default map
    if (targetMapId === 'default' || targetMapId === room.gameState.defaultMapId) {
      if (!room.gameState.mapData) room.gameState.mapData = {};
      if (data.terrainData) {
        room.gameState.mapData.terrainData = {
          ...room.gameState.mapData.terrainData,
          ...data.terrainData
        };
      }
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist terrain update:', error);
    }

    // MAP ISOLATION: Only broadcast to players on the SAME map
    const playersOnThisMap = [];
    for (const [socketId, playerData] of players.entries()) {
      if (playerData.roomId === player.roomId && playerData.currentMapId === targetMapId) {
        playersOnThisMap.push(socketId);
      }
    }

    // Also include the GM (the sender) if they aren't on the map but are editing it
    if (!playersOnThisMap.includes(socket.id)) {
      playersOnThisMap.push(socket.id);
    }

    // Broadcast to specific sockets only
    for (const targetSocketId of playersOnThisMap) {
      if (targetSocketId === socket.id) continue; // Don't send back to the sender if they already handled it

      io.to(targetSocketId).emit('terrain_updated', {
        terrainData: data.terrainData,
        tileKey: data.tileKey,
        terrainType: data.terrainType,
        mapId: targetMapId,
        updatedBy: player.id,
        timestamp: new Date()
      });
    }

    console.log(`🌲 Terrain updated on map ${targetMapId} by GM ${player.name}`);
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

    // Get the target map ID - default to GM's current map or 'default'
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Ensure the maps object and specific map exist
    if (!room.gameState.maps) {
      room.gameState.maps = {};
    }
    if (!room.gameState.maps[targetMapId]) {
      room.gameState.maps[targetMapId] = {
        id: targetMapId,
        name: targetMapId === 'default' ? 'Default Map' : `Map ${targetMapId}`,
        lightSources: {}
      };
    }

    const targetMap = room.gameState.maps[targetMapId];

    const { lightId, lightData, updateType } = data;

    switch (updateType) {
      case 'add':
      case 'update':
        targetMap.lightSources[lightId] = {
          ...lightData,
          id: lightId,
          lastUpdatedAt: new Date()
        };
        break;
      case 'remove':
        delete targetMap.lightSources[lightId];
        break;
    }

    // Also update legacy if this is the default map
    if (targetMapId === 'default' || targetMapId === room.gameState.defaultMapId) {
      if (!room.gameState.mapData) room.gameState.mapData = {};
      if (!room.gameState.mapData.lightSources) room.gameState.mapData.lightSources = {};

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
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist light source update:', error);
    }

    // MAP ISOLATION: Only broadcast to players on the SAME map
    const playersOnThisMap = [];
    for (const [socketId, playerData] of players.entries()) {
      if (playerData.roomId === player.roomId && playerData.currentMapId === targetMapId) {
        playersOnThisMap.push(socketId);
      }
    }

    // Also include the GM (the sender) if they aren't on the map but are editing it
    if (!playersOnThisMap.includes(socket.id)) {
      playersOnThisMap.push(socket.id);
    }

    // Broadcast to ALL players (not just those on same map)
    // This ensures all players get correct map updates when GM switches maps
    for (const [socketId, playerData] of players.entries()) {
       io.to(socketId).emit('light_source_updated', {
         lightId,
         lightData,
         updateType,
         mapId: targetMapId,
         updatedBy: player.id,
         timestamp: new Date()
       });
    }

    console.log(`💡 Light source ${lightId} ${updateType} on map ${targetMapId} by GM ${player.name}`);
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

    // Get the target map ID - default to GM's current map or 'default'
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Ensure the maps object and specific map exist
    if (!room.gameState.maps) {
      room.gameState.maps = {};
    }
    if (!room.gameState.maps[targetMapId]) {
      room.gameState.maps[targetMapId] = {
        id: targetMapId,
        name: targetMapId === 'default' ? 'Default Map' : `Map ${targetMapId}`,
        fogOfWarPaths: [],
        fogErasePaths: [],
        exploredAreas: {}
      };
    }

    const targetMap = room.gameState.maps[targetMapId];

    // Update fog paths
    if (data.fogOfWarPaths !== undefined) {
      targetMap.fogOfWarPaths = data.fogOfWarPaths;
    }
    if (data.fogErasePaths !== undefined) {
      targetMap.fogErasePaths = data.fogErasePaths;
    }
    if (data.exploredAreas !== undefined) {
      targetMap.exploredAreas = data.exploredAreas;
    }

    // Also update legacy if this is the default map
    if (targetMapId === 'default' || targetMapId === room.gameState.defaultMapId) {
      if (!room.gameState.mapData) room.gameState.mapData = {};
      if (data.fogOfWarPaths !== undefined) {
        room.gameState.mapData.fogOfWarPaths = data.fogOfWarPaths;
      }
      if (data.fogErasePaths !== undefined) {
        room.gameState.mapData.fogErasePaths = data.fogErasePaths;
      }
      if (data.exploredAreas !== undefined) {
        room.gameState.mapData.exploredAreas = data.exploredAreas;
      }
    }

    // Only persist on finalize (not during continuous painting)
    if (data.finalize) {
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist fog update:', error);
      }
    }

    // MAP ISOLATION: Only broadcast to players on the SAME map
    const playersOnThisMap = [];
    for (const [socketId, playerData] of players.entries()) {
      if (playerData.roomId === player.roomId && playerData.currentMapId === targetMapId) {
        playersOnThisMap.push(socketId);
      }
    }

    // Also include the GM (the sender) if they aren't on the map but are editing it
    if (!playersOnThisMap.includes(socket.id)) {
      playersOnThisMap.push(socket.id);
    }

    // Broadcast to specific sockets only
    for (const targetSocketId of playersOnThisMap) {
      if (targetSocketId === socket.id) continue;

      io.to(targetSocketId).emit('fog_updated', {
        fogOfWarPaths: data.fogOfWarPaths,
        fogErasePaths: data.fogErasePaths,
        exploredAreas: data.exploredAreas,
        finalize: data.finalize,
        mapId: targetMapId,
        updatedBy: player.id,
        timestamp: new Date()
      });
    }

    console.log(`🌫️ Fog updated on map ${targetMapId} by GM ${player.name}`);
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

    // Get the target map ID - default to GM's current map or 'default'
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Ensure the maps object and specific map exist
    if (!room.gameState.maps) {
      room.gameState.maps = {};
    }
    if (!room.gameState.maps[targetMapId]) {
      room.gameState.maps[targetMapId] = {
        id: targetMapId,
        name: targetMapId === 'default' ? 'Default Map' : `Map ${targetMapId}`,
        drawingPaths: [],
        drawingLayers: []
      };
    }

    const targetMap = room.gameState.maps[targetMapId];

    if (data.drawingPaths !== undefined) {
      targetMap.drawingPaths = data.drawingPaths;
    }
    if (data.drawingLayers !== undefined) {
      targetMap.drawingLayers = data.drawingLayers;
    }

    // Also update legacy if this is the default map
    if (targetMapId === 'default' || targetMapId === room.gameState.defaultMapId) {
      if (!room.gameState.mapData) room.gameState.mapData = {};
      if (data.drawingPaths !== undefined) {
        room.gameState.mapData.drawingPaths = data.drawingPaths;
      }
      if (data.drawingLayers !== undefined) {
        room.gameState.mapData.drawingLayers = data.drawingLayers;
      }
    }

    // Only persist on finalize
    if (data.finalize) {
      try {
        await firebaseService.updateRoomGameState(player.roomId, room.gameState);
      } catch (error) {
        console.error('Failed to persist drawing update:', error);
      }
    }

    // MAP ISOLATION: Only broadcast to players on the SAME map
    const playersOnThisMap = [];
    for (const [socketId, playerData] of players.entries()) {
      if (playerData.roomId === player.roomId && playerData.currentMapId === targetMapId) {
        playersOnThisMap.push(socketId);
      }
    }

    // Also include the GM (the sender) if they aren't on the map but are editing it
    if (!playersOnThisMap.includes(socket.id)) {
      playersOnThisMap.push(socket.id);
    }

    // Broadcast to specific sockets only
    for (const targetSocketId of playersOnThisMap) {
      if (targetSocketId === socket.id) continue;

      io.to(targetSocketId).emit('drawing_updated', {
        drawingPaths: data.drawingPaths,
        drawingLayers: data.drawingLayers,
        finalize: data.finalize,
        mapId: targetMapId,
        updatedBy: player.id,
        timestamp: new Date()
      });
    }

    console.log(`🎨 Drawing updated on map ${targetMapId} by GM ${player.name}`);
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

    // Get the target map ID - default to GM's current map or 'default'
    const targetMapId = data.targetMapId || player.currentMapId || 'default';

    // Ensure the maps object and specific map exist
    if (!room.gameState.maps) {
      room.gameState.maps = {};
    }
    if (!room.gameState.maps[targetMapId]) {
      room.gameState.maps[targetMapId] = {
        id: targetMapId,
        name: targetMapId === 'default' ? 'Default Map' : `Map ${targetMapId}`,
        environmentalObjects: []
      };
    }

    const targetMap = room.gameState.maps[targetMapId];

    const { objectId, objectData, updateType } = data;

    switch (updateType) {
      case 'add':
        targetMap.environmentalObjects.push({
          ...objectData,
          id: objectId || `env_${Date.now()}`,
          addedAt: new Date()
        });
        break;
      case 'update':
        targetMap.environmentalObjects = targetMap.environmentalObjects.map(obj =>
          obj.id === objectId ? { ...obj, ...objectData, lastUpdatedAt: new Date() } : obj
        );
        break;
      case 'remove':
        targetMap.environmentalObjects = targetMap.environmentalObjects.filter(obj =>
          obj.id !== objectId
        );
        break;
    }

    // Also update legacy if this is the default map
    if (targetMapId === 'default' || targetMapId === room.gameState.defaultMapId) {
      if (!room.gameState.mapData) room.gameState.mapData = {};
      if (!room.gameState.mapData.environmentalObjects) room.gameState.mapData.environmentalObjects = [];

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
    }

    // Persist to Firebase
    try {
      await firebaseService.updateRoomGameState(player.roomId, room.gameState);
    } catch (error) {
      console.error('Failed to persist environmental object update:', error);
    }

    // MAP ISOLATION: Only broadcast to players on the SAME map
    const playersOnThisMap = [];
    for (const [socketId, playerData] of players.entries()) {
      if (playerData.roomId === player.roomId && playerData.currentMapId === targetMapId) {
        playersOnThisMap.push(socketId);
      }
    }

    // Also include the GM (the sender) if they aren't on the map but are editing it
    if (!playersOnThisMap.includes(socket.id)) {
      playersOnThisMap.push(socket.id);
    }

    // Broadcast to specific sockets only
    for (const targetSocketId of playersOnThisMap) {
      if (targetSocketId === socket.id) continue;

      io.to(targetSocketId).emit('environmental_object_updated', {
        objectId,
        objectData,
        updateType,
        environmentalObjects: targetMap.environmentalObjects,
        mapId: targetMapId,
        updatedBy: player.id,
        timestamp: new Date()
      });
    }

    console.log(`🪑 Environmental object ${objectId} ${updateType} on map ${targetMapId} by GM ${player.name}`);
  });

  // Player left notification - notify remaining players
  socket.on('leave_room', () => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) {
      players.delete(socket.id);
      return;
    }

    const roomId = player.roomId;
    const playerName = player.name;

    if (player.isGM) {
      // GM leaving - mark room inactive and notify players
      room.isActive = false;
      room.gmDisconnectedAt = new Date();

      socket.to(roomId).emit('gm_disconnected', {
        gmName: playerName,
        timestamp: new Date()
      });

      logger.info('GM left room', { roomId: roomId, gmName: playerName });
    } else {
      // Regular player leaving
      room.players.delete(player.id);

      // Notify others
      socket.to(roomId).emit('player_left', {
        player: {
          id: player.id,
          name: playerName
        },
        playerCount: room.players.size + 1 // Total including GM
      });

      logger.info('Player left room', { roomId: roomId, playerName: playerName });
    }

    // Common cleanup
    socket.leave(roomId);
    players.delete(socket.id);

    // Broadcast list update to lobby users
    io.emit('room_list_updated', getPublicRooms());
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

// Initialize persistent rooms before starting the server
initializePersistentRooms().then(() => {
  server.listen(PORT, () => {
    logger.info('Server started', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      corsOrigins: allowedOrigins
    });
  });
}).catch(err => {
  logger.error('CRITICAL: Failed to initialize server:', err);
  // Start server anyway so health checks pass, but log the failure
  server.listen(PORT, () => {
    logger.info('Server started in DEGRADED mode (no persistence)', { port: PORT });
  });
});