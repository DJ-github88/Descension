# Server Architecture Documentation

## Overview

The Mythrill VTT server has been refactored into a modular architecture for better maintainability and testability.

## Directory Structure

```
server/
├── server.js                 # Main entry point (original - 6996 lines)
├── server.refactored.js      # Refactored entry point (~240 lines)
│
├── handlers/
│   ├── socketHandlers.js     # All socket.on event handlers (~2271 lines)
│   └── roomHandlers.js       # Room CRUD operations (~431 lines)
│
├── services/
│   ├── syncService.js        # FirebaseBatchWriter, MovementDebouncer (~262 lines)
│   ├── firebaseService.js    # Firebase operations (existing)
│   ├── deltaSync.js          # Delta sync engine (existing)
│   ├── eventBatcher.js       # Event batching (existing)
│   ├── realtimeSync.js       # Real-time sync (existing)
│   ├── memoryManager.js      # Memory cleanup (existing)
│   ├── lagCompensation.js    # Lag compensation (existing)
│   ├── validationService.js  # Input validation (existing)
│   ├── rateLimitService.js   # Rate limiting (existing)
│   ├── sanitizationService.js# Input sanitization (existing)
│   ├── logger.js             # Logging service (existing)
│   ├── requestTracer.js      # Request tracing (existing)
│   └── errorHandler.js       # Error handling (existing)
│
├── utils/
│   ├── validators.js         # Validation helpers (~366 lines)
│   └── broadcastHelpers.js   # Broadcast utilities (existing)
│
├── tests/
│   ├── socketHandlers.test.js
│   ├── roomHandlers.test.js
│   └── integration-test.js
│
├── docs/
│   └── API.md                # API documentation
│
└── scripts/
    └── validate-env.js       # Environment validation
```

## Module Responsibilities

### Entry Point (server.refactored.js)
- Express and Socket.io setup
- CORS configuration
- Middleware registration
- Service initialization
- Route definitions

### Handlers

#### socketHandlers.js
Contains all 64 socket event handlers organized by category:
- **Utility**: ping, health_check, cursor_move
- **Room Management**: create_room, join_room, leave_room, disconnect
- **Token Management**: token_created, token_moved, token_updated, token_removed
- **Character Management**: character_updated, character_resource_updated, character_moved
- **Map/Grid Management**: map_update, grid_item_update, sync_map_state
- **GM Actions**: gm_switch_view, gm_transfer_player, gm_action
- **Combat**: combat_started, combat_ended, combat_turn_changed
- **Chat**: chat_message, global_chat_message, whisper_message
- **Environment**: fog_update, wall_update, light_source_update, etc.
- **Party System**: create_party, join_party, invite_to_party, etc.

#### roomHandlers.js
Room CRUD operations and helpers:
- `createRoom()` - Create new room
- `getPublicRooms()` - Get active room list
- `validateRoomMembership()` - Validate player in room
- `hashPassword()` / `verifyPassword()` - Password handling
- `mergeRoomGameStateForResume()` - State merging for resume
- `initializePersistentRooms()` - Load from Firestore
- `cleanupInactiveRooms()` - Periodic cleanup

### Services

#### syncService.js (New)
- `FirebaseBatchWriter` - Batches Firebase writes to reduce quota usage
- `MovementDebouncer` - Debounces token movement updates
- `createSyncServices()` - Factory function
- `setupShutdownHandlers()` - Graceful shutdown

### Utils

#### validators.js (New)
- `validateRoomCreation()` - Validate room creation data
- `validateJoinRoom()` - Validate join data
- `validateTokenCreation()` - Validate token data
- `validateChatMessage()` - Validate chat messages
- `validateCharacterUpdate()` - Validate character updates
- `checkRateLimit()` - Rate limit helper
- `sanitizeString()` - Input sanitization

## Data Flow

```
Client                    Server                      Services
  │                         │                            │
  │──── emit('event') ─────>│                            │
  │                         │                            │
  │                    socketHandlers.js                │
  │                         │                            │
  │                    validate input                   │
  │                         │                            │
  │                    update state                     │
  │                         │                            │
  │                         │── queueWrite() ──────────>│ FirebaseBatchWriter
  │                         │                            │
  │<─── broadcast ──────────│                            │
  │                         │                            │
  │                         │<───── periodic flush ──────│
  │                         │                            │
```

## Key Patterns

### Debouncing
Movement updates are debounced to reduce network traffic:
```javascript
movementDebouncer.queueMove(roomId, tokenId, moveData);
// Flushes every 50ms
```

### Batching
Firebase writes are batched to reduce quota usage:
```javascript
firebaseBatchWriter.queueWrite(roomId, gameState);
// Flushes every 500ms or when batch is full
```

### Event Sequencing
All broadcasts include a sequence number for ordering:
```javascript
io.to(roomId).emit('event', {
  ...data,
  sequence: getNextEventSequence()
});
```

## Testing

### Unit Tests
```bash
# Run socket handler tests
npm test tests/socketHandlers.test.js

# Run room handler tests
npm test tests/roomHandlers.test.js
```

### Integration Tests
```bash
# Run integration tests (requires running server)
node tests/integration-test.js
```

## Migration Guide

### From Original to Refactored

1. **Backup original:**
   ```bash
   cp server.js server.backup.js
   ```

2. **Replace with refactored:**
   ```bash
   cp server.refactored.js server.js
   ```

3. **Restart server:**
   ```bash
   npm start
   ```

4. **Verify with tests:**
   ```bash
   node tests/integration-test.js
   ```

## Performance Considerations

### Memory Management
- Periodic cleanup of inactive rooms (every 5 minutes)
- Chat history limited to 500 messages per room
- Movement debouncing reduces memory churn

### Network Optimization
- Movement debouncing (50ms)
- Firebase write batching (500ms)
- Viewport-based update filtering

### Scalability
- Stateless handlers allow horizontal scaling
- Redis adapter can be added for multi-server support
- Firebase handles persistence layer

## Security

### Authentication
- Firebase ID token validation
- Guest connections allowed for multiplayer

### Input Validation
- All inputs sanitized
- Rate limiting on all endpoints
- Validation middleware on socket connection

### Authorization
- GM-only actions enforced
- Room membership validation
- Password-protected rooms

## Error Handling

### Socket Errors
```javascript
socket.emit('room_error', { error: 'Error message' });
socket.emit('party_error', { error: 'Error message' });
```

### Graceful Shutdown
```javascript
process.on('SIGTERM', async () => {
  await firebaseBatchWriter.flush();
  process.exit(0);
});
```

## Future Improvements

1. **Redis Adapter** - For multi-server scaling
2. **Connection Pooling** - Reduce Firebase connection overhead
3. **Caching Layer** - Cache frequently accessed data
4. **Metrics** - Add Prometheus metrics
5. **WebSocket Compression** - Enable permessage-deflate
