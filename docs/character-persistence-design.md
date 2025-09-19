# Character Persistence System Design

## Overview
This document outlines the design for a comprehensive character persistence system that ties character data (inventory, currency, level, exhaustion, etc.) to user accounts and ensures synchronization across multiplayer sessions.

## Core Principles

1. **Account-Centric Storage**: Characters belong to authenticated users, not devices
2. **Real-Time Synchronization**: Changes during gameplay immediately persist to the cloud
3. **Conflict Resolution**: Handle concurrent edits gracefully
4. **Offline Capability**: Support offline play with sync on reconnection
5. **Data Integrity**: Prevent data loss through backups and validation

## Data Architecture

### Firebase Firestore Structure

```
/users/{userId}
  ├── profile: { displayName, email, createdAt, lastLoginAt }
  ├── preferences: { theme, notifications, autoSave }
  └── characters: [characterId1, characterId2, ...] // Array of character IDs

/characters/{characterId}
  ├── metadata: {
  │     id: string,
  │     userId: string, // Owner of this character
  │     name: string,
  │     createdAt: timestamp,
  │     updatedAt: timestamp,
  │     lastPlayedAt: timestamp,
  │     version: number // For conflict resolution
  │   }
  ├── basicInfo: {
  │     race: string,
  │     subrace: string,
  │     class: string,
  │     level: number,
  │     alignment: string,
  │     exhaustionLevel: number
  │   }
  ├── stats: {
  │     strength: number,
  │     agility: number,
  │     constitution: number,
  │     intelligence: number,
  │     spirit: number,
  │     charisma: number
  │   }
  ├── resources: {
  │     health: { current: number, max: number },
  │     mana: { current: number, max: number },
  │     actionPoints: { current: number, max: number }
  │   }
  ├── inventory: {
  │     items: [{ id, name, type, quantity, position, ... }],
  │     currency: { platinum: number, gold: number, silver: number, copper: number },
  │     encumbranceState: string
  │   }
  ├── equipment: {
  │     weapon: object | null,
  │     armor: object | null,
  │     shield: object | null,
  │     accessories: array
  │   }
  ├── spells: [{ id, name, type, ... }]
  ├── lore: {
  │     background: string,
  │     personalityTraits: string,
  │     characterImage: string,
  │     imageTransformations: object,
  │     // ... other lore fields
  │   }
  └── gameState: {
        experience: number,
        sessionData: {
          currentRoomId: string | null,
          lastSavedAt: timestamp,
          pendingChanges: object // For offline sync
        }
      }

/characterSessions/{sessionId}
  ├── characterId: string
  ├── roomId: string
  ├── startedAt: timestamp
  ├── endedAt: timestamp | null
  ├── changes: {
  │     inventory: { added: [], removed: [], modified: [] },
  │     currency: { gained: object, spent: object },
  │     experience: { gained: number },
  │     resources: { health: object, mana: object }
  │   }
  └── status: "active" | "completed" | "abandoned"
```

## Service Layer Architecture

### CharacterPersistenceService
- `loadCharacter(characterId, userId)`: Load complete character data
- `saveCharacter(characterData, userId)`: Save character with validation
- `createCharacter(characterData, userId)`: Create new character
- `deleteCharacter(characterId, userId)`: Soft delete character
- `syncCharacterChanges(characterId, changes)`: Apply incremental changes

### CharacterSessionService
- `startSession(characterId, roomId)`: Begin tracking session changes
- `recordChange(sessionId, changeType, changeData)`: Log gameplay changes
- `endSession(sessionId)`: Apply session changes to character
- `getActiveSession(characterId)`: Get current session if any

### CharacterSyncService
- `syncToCloud(characterData)`: Upload local changes to Firebase
- `syncFromCloud(characterId)`: Download latest character data
- `resolveConflicts(localData, cloudData)`: Handle concurrent edits
- `queueOfflineChanges(changes)`: Store changes for later sync

## Integration Points

### Character Store Enhancement
- Replace localStorage with Firebase as primary storage
- Implement automatic sync on character changes
- Add conflict resolution for concurrent edits
- Maintain local cache for offline access

### Inventory Store Integration
- Link inventory changes to active character
- Auto-save inventory changes to character data
- Sync currency changes immediately
- Handle encumbrance updates

### Multiplayer Session Integration
- Load character data when joining rooms
- Track all character changes during session
- Save session changes back to character on room exit
- Handle disconnection scenarios gracefully

## Synchronization Strategy

### Real-Time Sync
1. **Immediate Sync**: Critical changes (level up, major item acquisition)
2. **Batched Sync**: Minor changes (position, temporary effects) every 30 seconds
3. **Session Sync**: Complete sync on session start/end

### Conflict Resolution
1. **Last-Write-Wins**: For simple fields like stats, level
2. **Merge Strategy**: For inventory (combine additions, resolve conflicts)
3. **User Choice**: For major conflicts, prompt user to choose

### Offline Support
1. **Local Cache**: Store character data locally for offline access
2. **Change Queue**: Track all offline changes with timestamps
3. **Sync on Reconnect**: Apply queued changes with conflict resolution

## Security Considerations

### Data Validation
- Validate all character data before saving
- Prevent impossible stat combinations
- Verify item ownership and quantities
- Rate limit character updates

### Access Control
- Users can only access their own characters
- Validate user authentication on all operations
- Implement character ownership verification
- Audit trail for character modifications

## Performance Optimizations

### Caching Strategy
- Local cache for active character
- Redis cache for frequently accessed characters
- Lazy loading for character lists

### Data Compression
- Compress large character data (inventory, spells)
- Use delta updates for incremental changes
- Batch multiple small updates

### Network Optimization
- Minimize payload size with selective field updates
- Use WebSocket for real-time character updates
- Implement retry logic for failed syncs

## Migration Strategy

### Phase 1: Service Implementation
- Create Firebase character storage service
- Implement basic CRUD operations
- Add user authentication validation

### Phase 2: Store Integration
- Enhance character store with cloud persistence
- Implement automatic sync mechanisms
- Add conflict resolution

### Phase 3: Multiplayer Integration
- Modify room joining to load character data
- Implement session tracking
- Add session change persistence

### Phase 4: Data Migration
- Migrate existing localStorage data to Firebase
- Implement backward compatibility
- Provide data export/import tools

## Testing Strategy

### Unit Tests
- Character CRUD operations
- Conflict resolution algorithms
- Data validation logic

### Integration Tests
- Character loading in multiplayer
- Session change tracking
- Offline/online sync scenarios

### End-to-End Tests
- Complete character lifecycle
- Multi-device synchronization
- Data recovery scenarios

## Monitoring and Analytics

### Key Metrics
- Character save/load success rates
- Sync latency and failure rates
- Conflict resolution frequency
- Data loss incidents

### Alerting
- Failed character saves
- Sync service downtime
- Data corruption detection
- High conflict rates

This design provides a robust foundation for character persistence that ensures data integrity, supports multiplayer scenarios, and provides a seamless user experience across devices and sessions.
