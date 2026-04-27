/**
 * Mythrill VTT Server - Refactored Entry Point
 * 
 * This is the main entry point for the Mythrill VTT multiplayer server.
 * It imports and wires together the extracted modules:
 * - handlers/socketHandlers.js: All socket event handlers
 * - handlers/roomHandlers.js: Room CRUD operations
 * - services/syncService.js: State synchronization services
 * - utils/validators.js: Validation utilities
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import services
const firebaseService = require('./services/firebaseService');
const deltaSync = require('./services/deltaSync');
const EventBatcher = require('./services/eventBatcher');
const optimizedFirebase = require('./services/optimizedFirebase');
const memoryManager = require('./services/memoryManager');
const lagCompensation = require('./services/lagCompensation');
const RealtimeSyncEngine = require('./services/realtimeSync');
const { createValidationMiddleware } = require('./services/validationService');
const rateLimitService = require('./services/rateLimitService');
const { sanitizeChatMessage, sanitizeRoomName, sanitizePlayerName, createSanitizationMiddleware } = require('./services/sanitizationService');
const logger = require('./services/logger');
const requestTracer = require('./services/requestTracer');
const ErrorHandler = require('./services/errorHandler');

// Import handlers
const { registerSocketHandlers } = require('./handlers/socketHandlers');
const roomHandlers = require('./handlers/roomHandlers');

// Import sync services
const { createSyncServices, setupShutdownHandlers } = require('./services/syncService');

// Import validators
const validators = require('./utils/validators');

// ==================== ENVIRONMENT VALIDATION ====================

if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
  try {
    const path = require('path');
    const { validateEnvironment } = require(path.resolve(process.cwd(), 'scripts/validate-env'));
    if (!validateEnvironment()) {
      logger.error('Environment validation failed. Server will not start.');
      process.exit(1);
    }
  } catch (error) {
    logger.warn('Could not validate environment variables:', { error: error.message });
  }
}

// ==================== EXPRESS SETUP ====================

const app = express();
const server = http.createServer(app);

// ==================== CORS CONFIGURATION ====================

function getAllowedOrigins() {
  if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    const requiredOrigins = ['https://mythrill.netlify.app', 'https://windtunnel.netlify.app'];
    return [...new Set([...envOrigins, ...requiredOrigins])];
  }

  const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
  if (isProduction) {
    return [
      'https://windtunnel.netlify.app',
      'https://mythrill.netlify.app',
      'https://descension-mythrill.netlify.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ].filter(Boolean);
  }

  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002'
  ];
}

const allowedOrigins = getAllowedOrigins();
const errorHandler = new ErrorHandler();

logger.debug('Server CORS configuration', {
  allowedOrigins,
  envVarSet: !!process.env.ALLOWED_ORIGINS,
  environment: process.env.NODE_ENV,
  railwayEnvironment: process.env.RAILWAY_ENVIRONMENT
});

logger.info('Server initializing', {
  corsOrigins: allowedOrigins,
  environment: process.env.NODE_ENV,
  railwayEnvironment: process.env.RAILWAY_ENVIRONMENT
});

// ==================== SOCKET.IO SETUP ====================

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true
  },
  allowEIO3: true
});

// Add sanitization middleware
io.use(createSanitizationMiddleware({
  logSanitization: process.env.NODE_ENV === 'development',
  fieldsToSkip: ['password', 'passwordHash', 'token', 'id', 'roomId', 'socketId', 'playerId', 'characterId', 'tokenId', 'description', 'notes', 'lore', 'backstory', 'gmNotes', 'content', 'text', 'gridItems', 'terrainData', 'drawnLines', 'wallData']
}));

// Add validation middleware
io.use(createValidationMiddleware({
  logErrors: true,
  strictMode: false,
  maxErrorsPerMinute: 10
}));

// Add rate limiting middleware
io.use(rateLimitService.createMiddleware({
  logViolations: true,
  disconnectOnViolation: false,
  violationThreshold: 10
}));

// Add Firebase authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;

    if (!token) {
      socket.data.authenticated = false;
      socket.data.userId = null;
      socket.data.isGuest = true;
      logger.debug('Guest connection allowed for multiplayer', { socketId: socket.id });
      return next();
    }

    const decodedToken = await firebaseService.verifyIdToken(token);
    if (decodedToken) {
      socket.data.authenticated = true;
      socket.data.userId = decodedToken.uid;
      socket.data.email = decodedToken.email;
      socket.data.isGuest = false;
      logger.info('Socket authenticated', { socketId: socket.id, userId: decodedToken.uid });
    } else {
      socket.data.authenticated = false;
      socket.data.userId = null;
      socket.data.isGuest = true;
      logger.warn('Socket authentication failed, allowing as guest', { socketId: socket.id });
    }

    next();
  } catch (error) {
    logger.error('Socket authentication error', { socketId: socket.id, error: error.message });
    socket.data.authenticated = false;
    socket.data.userId = null;
    socket.data.isGuest = true;
    next();
  }
});

// ==================== ENHANCED SERVICES ====================

const eventBatcher = new EventBatcher(io);
const realtimeSync = new RealtimeSyncEngine(eventBatcher, deltaSync, optimizedFirebase);

// ==================== IN-MEMORY DATA STORES ====================

const rooms = new Map(); // roomId -> room object
const players = new Map(); // socketId -> player object
global.players = players;

// Party system (social)
const parties = new Map(); // partyId -> Party object
const userToParty = new Map(); // userId -> partyId
const partyInvitations = new Map(); // invitationId -> Invitation
const onlineSocialUsers = new Map(); // socketId -> user data
const pendingPartyCreations = new Map(); // userId -> pending creation

// Viewport tracking
const playerViewports = new Map(); // socketId -> viewport

// ==================== CREATE SYNC SERVICES ====================

const syncServices = createSyncServices(io, rooms, players);
const { firebaseBatchWriter, movementDebouncer } = syncServices;

// Setup graceful shutdown
setupShutdownHandlers(syncServices);

// ==================== HELPER FUNCTIONS ====================

// Wrapper functions that include the data stores
const createRoomWithDataStores = async (...args) => {
  return roomHandlers.createRoom(...args, rooms, players);
};

const getPublicRoomsWithDataStores = () => {
  return roomHandlers.getPublicRooms(rooms);
};

const validateRoomMembershipWithDataStores = (socket, roomId, requireGM = false) => {
  return roomHandlers.validateRoomMembership(socket, roomId, requireGM, players, rooms);
};

const helpers = {
  createRoom: createRoomWithDataStores,
  hashPassword: roomHandlers.hashPassword,
  verifyPassword: roomHandlers.verifyPassword,
  getPublicRooms: getPublicRoomsWithDataStores,
  validateRoomMembership: validateRoomMembershipWithDataStores,
  mergeRoomGameStateForResume: roomHandlers.mergeRoomGameStateForResume
};

const services = {
  firebaseBatchWriter,
  movementDebouncer,
  eventBatcher,
  realtimeSync
};

// ==================== INITIALIZE PERSISTENT ROOMS ====================

async function initializeServer() {
  // Load persistent rooms from Firestore
  await roomHandlers.initializePersistentRooms(rooms);

  // Register all socket handlers
  registerSocketHandlers(io, rooms, players, parties, userToParty, partyInvitations, onlineSocialUsers, pendingPartyCreations, helpers, services);

  logger.info('✅ Server initialized successfully');
}

// ==================== EXPRESS ROUTES ====================

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Room list endpoint
app.get('/api/rooms', (req, res) => {
  const publicRooms = getPublicRoomsWithDataStores();
  res.json(publicRooms);
});

// Rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', apiLimiter);

// ==================== PERIODIC CLEANUP ====================

// Clean up inactive rooms every 5 minutes
setInterval(() => {
  roomHandlers.cleanupInactiveRooms(rooms, players);
}, 5 * 60 * 1000);



// ==================== START SERVER ====================

const PORT = process.env.PORT || 3001;

initializeServer()
  .then(() => {
    server.listen(PORT, () => {
      logger.info('Server started', { port: PORT, environment: process.env.NODE_ENV || 'development' });
    });
  })
  .catch(error => {
    logger.error('Server initialization failed', { error: error.message });
    process.exit(1);
  });

// ==================== EXPORTS FOR TESTING ====================

module.exports = {
  app,
  server,
  io,
  rooms,
  players,
  parties,
  helpers,
  services,
  validators
};
