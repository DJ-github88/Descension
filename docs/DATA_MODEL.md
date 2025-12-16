# Data Model Documentation

This document describes the current data model structure for the D&D Virtual Tabletop application.

## Overview

The application uses **Firestore** (NoSQL) as the primary database. This document maps out all collections, their relationships, and identifies potential issues.

## Core Collections

### 1. `users/{userId}`
**Purpose**: User account information

**Structure**:
- `userId` (string, document ID)
- User profile data
- Authentication metadata

**Access**: Users can read/write their own document

**Relationships**:
- One-to-many with `characters` (via `metadata.userId`)
- One-to-many with `user_spells`
- One-to-many with `users/{userId}/libraries`
- Legacy: One-to-many with `users/{userId}/characters` (deprecated)

**Issues**:
- ⚠️ **DUPLICATION**: Characters can be stored in two places:
  - Top-level `characters` collection (current)
  - Nested `users/{userId}/characters` (legacy)
- ⚠️ **INCONSISTENCY**: Rules support both patterns, suggesting migration in progress

---

### 2. `characters/{characterId}`
**Purpose**: Character data (main collection)

**Structure**:
- `characterId` (string, document ID)
- `metadata.userId` (string) - Links to user
- Character stats, equipment, spells, etc.

**Access**: Users can read/write characters where `metadata.userId` matches their auth ID

**Relationships**:
- Many-to-one with `users` (via `metadata.userId`)
- Referenced in `character_sessions`
- Used in multiplayer `rooms` gameState

**Issues**:
- ⚠️ **NULLABLE FIELD**: `metadata.userId` must exist but no validation in rules
- ⚠️ **NO INDEXES**: No composite indexes defined for common queries (e.g., userId + createdAt)

---

### 3. `character_sessions/{sessionId}`
**Purpose**: Track gameplay changes per session

**Structure**:
- `sessionId` (string, document ID)
- `userId` (string) - Links to user
- Session data, changes, timestamps

**Access**: Users can read/write their own sessions

**Relationships**:
- Many-to-one with `users` (via `userId`)

**Issues**:
- ⚠️ **UNDERDOCUMENTED**: Purpose unclear from rules alone
- ⚠️ **NO RELATIONSHIP**: No explicit link to `characters` or `rooms`

---

### 4. `rooms/{roomId}`
**Purpose**: Multiplayer game rooms

**Structure**:
- `roomId` (string, document ID)
- `gmId` (string) - Game Master user ID
- `gameState` (object) - Complex nested state:
  - `characters` (object)
  - `combat` (object)
  - `mapData` (object)
  - `tokens` (object)
  - `gridItems` (object)
  - `characterTokens` (object)
  - `fogOfWar` (object)
- `lastActivity` (timestamp)
- Room settings, password, etc.

**Access**: 
- Authenticated users can read any room
- GM can create/update/delete
- Any authenticated user can update `gameState` and `lastActivity` only

**Relationships**:
- One-to-one with GM (`users/{gmId}`)
- Contains references to `characters` in gameState
- Related to `roomSessions`

**Issues**:
- 🚨 **MASSIVE COMPLEXITY**: `gameState` is deeply nested with no schema validation
- 🚨 **NO INDEXES**: No indexes for querying active rooms, GM lookup, etc.
- ⚠️ **DUPLICATION**: Character data duplicated in `gameState.characters` and `characters` collection
- ⚠️ **NULLABLE EVERYWHERE**: No required fields defined in rules

---

### 5. `roomSessions/{sessionId}`
**Purpose**: Active multiplayer sessions

**Structure**:
- `sessionId` (string, document ID)
- Session metadata

**Access**: Any authenticated user can read/write

**Issues**:
- ⚠️ **UNDERDOCUMENTED**: Purpose and structure unclear
- ⚠️ **NO RELATIONSHIP**: No explicit link to `rooms`

---

### 6. `gameData/{document=**}`
**Purpose**: Public game data (items, spells, etc.)

**Structure**:
- Wildcard path - can be any nested structure
- Read-only for all users

**Access**: Public read, no write

**Issues**:
- 🚨 **NO STRUCTURE**: Wildcard path means no defined schema
- ⚠️ **NO INDEXES**: Can't efficiently query nested game data

---

## Community Collections

### 7. `community_spells/{spellId}`
**Purpose**: User-created spells shared publicly

**Structure**:
- `spellId` (string, document ID)
- `isPublic` (boolean)
- `categoryId` (string) - Links to category
- `isFeatured` (boolean)
- `rating` (number)
- `createdAt` (timestamp)

**Access**: Public read if `isPublic == true`, authenticated write

**Relationships**:
- Many-to-one with `spell_categories` (via `categoryId`)
- One-to-many with `spell_ratings`

**Indexes**: ✅ Has composite indexes for:
- `categoryId + isPublic + createdAt`
- `isFeatured + isPublic + rating`

---

### 8. `spell_categories/{categoryId}`
**Purpose**: Categories for organizing spells

**Structure**: Not defined in rules

**Access**: Public read, authenticated write

**Issues**:
- ⚠️ **NO STRUCTURE**: Schema not defined

---

### 9. `spell_ratings/{ratingId}`
**Purpose**: User ratings for spells

**Structure**:
- `ratingId` (string, document ID)
- `userId` (string)
- Rating data

**Access**: Users can read/write their own ratings

**Relationships**:
- Many-to-one with `users` (via `userId`)
- Many-to-one with `community_spells` (implicit, not enforced)

**Issues**:
- ⚠️ **NO RELATIONSHIP**: No explicit link to spell being rated

---

### 10-15. Similar Pattern for Items, Creatures, Packs
- `community_items/{itemId}` - Same structure as spells
- `item_categories/{categoryId}`
- `item_ratings/{ratingId}`
- `community_creatures/{creatureId}`
- `creature_categories/{categoryId}`
- `creature_ratings/{ratingId}`
- `community_packs/{packId}`
- `pack_ratings/{ratingId}`

**Issues**:
- ⚠️ **DUPLICATION**: Same pattern repeated 3 times (spells, items, creatures)
- ⚠️ **NO UNIFIED MODEL**: Could be abstracted to single `community_content` collection

---

## User-Specific Collections

### 16. `users/{userId}/libraries/{libraryId}`
**Purpose**: User's personal content libraries

**Structure**: Not defined in rules

**Access**: Users can read/write their own libraries

**Issues**:
- ⚠️ **NO STRUCTURE**: Schema not defined

---

### 17. `user_spells/{spellId}`
**Purpose**: User's custom spells (not shared)

**Structure**:
- `spellId` (string, document ID)
- `userId` (string)

**Access**: Users can read/write their own spells

**Relationships**:
- Many-to-one with `users` (via `userId`)

**Issues**:
- ⚠️ **DUPLICATION**: Similar to `community_spells` but private
- ⚠️ **NO INDEXES**: Can't efficiently query user's spells

---

## Data Model Issues Summary

### 🚨 Critical Issues

1. **No Schema Validation**: Firestore rules don't validate data structure
2. **Deep Nesting**: `rooms.gameState` is extremely complex with no boundaries
3. **No Relationships Enforced**: Foreign keys are implicit, not enforced
4. **Missing Indexes**: Many collections lack indexes for common queries

### ⚠️ High Priority Issues

1. **Data Duplication**:
   - Characters stored in both top-level and nested collections
   - Character data duplicated in `rooms.gameState`
   - Community content pattern repeated 3x (spells, items, creatures)

2. **Nullable Fields**: No required fields defined anywhere

3. **Inconsistent Patterns**:
   - Some collections use `userId`, others use `metadata.userId`
   - Some use nested paths, others use top-level with foreign keys

4. **Undocumented Collections**: Several collections have unclear purpose

### 📋 Recommended Actions

1. **Create Schema Documentation**: Document expected structure for each collection
2. **Add Validation**: Use Firestore rules to enforce required fields
3. **Consolidate Duplicates**: 
   - Migrate all characters to single location
   - Consider unified `community_content` collection
4. **Add Missing Indexes**: Create indexes for common query patterns
5. **Define Relationships**: Make foreign key relationships explicit
6. **Simplify gameState**: Break down `rooms.gameState` into separate collections

---

## Entity Relationship Diagram (Text)

```
users
  ├── characters (1:N via metadata.userId)
  ├── user_spells (1:N via userId)
  ├── users/{userId}/libraries (1:N nested)
  ├── spell_ratings (1:N via userId)
  ├── item_ratings (1:N via userId)
  ├── creature_ratings (1:N via userId)
  ├── pack_ratings (1:N via userId)
  └── character_sessions (1:N via userId)

characters
  └── (referenced in rooms.gameState.characters)

rooms
  ├── gmId → users (N:1)
  └── gameState.characters → characters (N:1, duplicated)

community_spells
  ├── categoryId → spell_categories (N:1)
  └── spell_ratings (1:N, implicit)

community_items
  ├── categoryId → item_categories (N:1)
  └── item_ratings (1:N, implicit)

community_creatures
  ├── categoryId → creature_categories (N:1)
  └── creature_ratings (1:N, implicit)

community_packs
  └── pack_ratings (1:N, implicit)
```

---

## Questions to Answer

1. **Can you draw your core tables + relations on paper in 5 minutes?**
   - ❌ NO - Too complex, relationships unclear

2. **Are there duplicated fields?**
   - ✅ YES - Characters in multiple places, community pattern repeated

3. **Are fields nullable everywhere?**
   - ✅ YES - No required fields defined

4. **Do you have indexes?**
   - ⚠️ PARTIAL - Only community collections have indexes

5. **Do screens read from different sources for the same concept?**
   - ✅ YES - Characters can come from top-level or nested collection

---

**Last Updated**: 2024-01-XX
**Next Review**: After data model cleanup

