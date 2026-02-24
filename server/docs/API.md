# Mythrill VTT Server API Documentation

## Table of Contents
- [Overview](#overview)
- [Connection](#connection)
- [Room Events](#room-events)
- [Token Events](#token-events)
- [Character Events](#character-events)
- [Map Events](#map-events)
- [Combat Events](#combat-events)
- [Chat Events](#chat-events)
- [Environment Events](#environment-events)
- [Party Events](#party-events)
- [REST Endpoints](#rest-endpoints)

## Overview

The Mythrill VTT server uses Socket.io for real-time communication. All events are bidirectional - clients emit events and listen for responses.

### Connection URL
```
wss://[server-url]
```

### Authentication
Optional Firebase authentication via handshake:
```javascript
const socket = io(SERVER_URL, {
  auth: { token: firebaseIdToken }
});
```

---

## Connection

### `connection`
Automatically triggered when client connects.

**Response Events:**
- None (silent acknowledgment)

### `ping`
Test connection latency.

**Payload:** None (or empty object)

**Callback Response:**
```javascript
'pong'
```

### `health_check`
Request server health status.

**Payload:** None

**Response:** `health_check_response`
```json
{
  "status": "ok",
  "roomsCount": 5,
  "playersCount": 12,
  "uptime": 3600
}
```

---

## Room Events

### `create_room`
Create a new game room.

**Payload:**
```json
{
  "roomName": "My Campaign",
  "gmName": "Dungeon Master",
  "password": "optional-password",
  "playerColor": "#d4af37",
  "persistentRoomId": "optional-firebase-id",
  "character": { ... }
}
```

**Response:** `room_created`
```json
{
  "room": {
    "id": "room-uuid",
    "name": "My Campaign",
    "gm": { "id": "...", "name": "Dungeon Master" },
    "players": [],
    "gameState": { ... }
  }
}
```

**Error:** `room_error`
```json
{
  "error": "Error message"
}
```

### `join_room`
Join an existing room.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "playerName": "Player Name",
  "password": "room-password",
  "playerColor": "#4a90e2",
  "character": { ... }
}
```

**Response:** `room_joined`
```json
{
  "room": { ... },
  "player": { "id": "...", "name": "Player Name" }
}
```

**Broadcast to room:** `player_joined`
```json
{
  "player": { "id": "...", "name": "Player Name" },
  "playerCount": 3
}
```

### `leave_room`
Leave current room.

**Payload:** None

**Broadcast to room:** `player_left`
```json
{
  "playerId": "player-uuid",
  "playerName": "Player Name"
}
```

### `disconnect`
Handled automatically. Broadcasts `player_left` to room.

---

## Token Events

### `token_created`
Create a new token on the map.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "token": {
    "id": "token-uuid",
    "name": "Goblin",
    "position": { "x": 100, "y": 200 },
    "imageUrl": "https://...",
    "size": 50
  }
}
```

**Broadcast:** `token_created`
```json
{
  "token": { ... },
  "mapId": "default",
  "createdBy": "socket-id",
  "sequence": 1
}
```

### `token_moved`
Move a token (debounced on server).

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "tokenId": "token-uuid",
  "position": { "x": 150, "y": 250 },
  "velocity": { "x": 1, "y": 0 }
}
```

**Broadcast:** `token_moved`
```json
{
  "tokenId": "token-uuid",
  "position": { "x": 150, "y": 250 },
  "velocity": { "x": 1, "y": 0 },
  "mapId": "default",
  "movedBy": "socket-id"
}
```

### `token_updated`
Update token properties.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "tokenId": "token-uuid",
  "updates": {
    "name": "Goblin Warrior",
    "size": 75
  }
}
```

**Broadcast:** `token_updated`

### `token_removed`
Remove a token from the map.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "tokenId": "token-uuid"
}
```

**Broadcast:** `token_removed`

### `character_token_created`
Create a character token (player representation).

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "token": {
    "id": "char-token-uuid",
    "playerId": "player-uuid",
    "name": "Player Character",
    "position": { "x": 0, "y": 0 }
  }
}
```

---

## Character Events

### `character_updated`
Update character data.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "character": {
    "name": "Character Name",
    "class": "Warrior",
    "level": 5,
    "health": { "current": 45, "max": 50 },
    "mana": { "current": 30, "max": 30 },
    "actionPoints": { "current": 3, "max": 3 }
  }
}
```

**Broadcast:** `character_updated`

### `character_resource_updated`
Update specific character resources (HP, Mana, AP).

**Payload:**
```json
{
  "roomId": "room-uuid",
  "playerId": "target-player-uuid",
  "resource": "health",
  "current": 40,
  "max": 50,
  "temp": 5,
  "adjustment": -10
}
```

**Broadcast:** `character_resource_updated`

### `character_resource_delta`
Apply a delta change to resources.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "resource": "health",
  "delta": -5
}
```

### `character_moved`
Update character position.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "position": { "x": 100, "y": 100 }
}
```

---

## Map Events

### `map_update`
Create, delete, or modify maps.

**Payload (Create):**
```json
{
  "roomId": "room-uuid",
  "action": "create",
  "map": {
    "id": "dungeon-level-1",
    "name": "Dungeon Level 1"
  }
}
```

**Payload (Delete):**
```json
{
  "roomId": "room-uuid",
  "action": "delete",
  "mapId": "dungeon-level-1"
}
```

**Broadcast:** `map_update`

### `update_current_map`
Change player's active map.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "dungeon-level-1"
}
```

**Broadcast:** `player_map_changed`

### `sync_level_editor_state`
Sync terrain, walls, objects (GM only).

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "terrainData": { ... },
  "wallData": { ... },
  "environmentalObjects": [ ... ]
}
```

**Broadcast:** `level_editor_state_synced`

### `sync_map_state`
Request full map state.

**Payload:** None (uses current room)

**Response:** `map_state_synced`

### `grid_item_update`
Add, update, or remove grid items.

**Payload (Add):**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "action": "add",
  "item": { "id": "item-1", "type": "chest" }
}
```

---

## Combat Events

### `combat_started`
Start combat encounter.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "turnOrder": [
    { "id": "player-1", "name": "Warrior", "initiative": 18 },
    { "id": "creature-1", "name": "Goblin", "initiative": 12 }
  ]
}
```

**Broadcast:** `combat_started`

### `combat_ended`
End combat encounter.

**Payload:**
```json
{
  "roomId": "room-uuid"
}
```

**Broadcast:** `combat_ended`

### `combat_turn_changed`
Advance to next turn.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "turnIndex": 1,
  "round": 2
}
```

**Broadcast:** `combat_turn_changed`

---

## Chat Events

### `chat_message`
Send room chat message.

**Payload:**
```json
{
  "message": "Hello everyone!",
  "type": "chat"
}
```

**Broadcast:** `chat_message`
```json
{
  "id": "msg-uuid",
  "sender": { "id": "player-1", "name": "Player" },
  "content": "Hello everyone!",
  "type": "chat",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### `global_chat_message`
Send global chat (all servers).

**Payload:**
```json
{
  "message": "Anyone want to play?"
}
```

**Broadcast:** `global_chat_message`

### `whisper_message`
Send private message.

**Payload:**
```json
{
  "targetPlayerId": "player-2",
  "targetName": "Player 2",
  "message": "Secret message"
}
```

**Response:** `whisper_message` (to both sender and target)

---

## Environment Events

### `fog_update`
Update fog of war.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "fogData": { ... },
  "fogPaths": [ ... ]
}
```

### `wall_update`
Add/remove walls.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "action": "add",
  "wall": { "id": "wall-1", "x1": 0, "y1": 0, "x2": 100, "y2": 0 }
}
```

### `light_source_update`
Add/remove/update light sources.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "action": "add",
  "lightSource": { "id": "light-1", "x": 50, "y": 50, "radius": 100 }
}
```

### `drawing_update`
Update drawing paths/layers.

### `environmental_object_update`
Add/remove environmental objects.

### `door_state_changed`
Toggle door open/closed.

**Payload:**
```json
{
  "roomId": "room-uuid",
  "mapId": "default",
  "doorId": "door-1",
  "isOpen": true
}
```

---

## Party Events (Social System)

### `create_party`
Create a social party group.

**Payload:**
```json
{
  "partyName": "Adventure Party",
  "leaderData": { "name": "Leader" }
}
```

**Response:** `party_created`

### `join_party`
Join an existing party.

**Payload:**
```json
{
  "partyId": "party-uuid"
}
```

### `leave_party`
Leave current party.

### `invite_to_party`
Invite player to party.

**Payload:**
```json
{
  "partyId": "party-uuid",
  "fromUserId": "user-1",
  "toUserId": "user-2"
}
```

### `accept_party_invite` / `decline_party_invite`

### `party_message`
Send message to party.

### `promote_to_leader`
Transfer party leadership.

### `remove_party_member`
Kick member from party.

### `disband_party`
Disband entire party (leader only).

---

## REST Endpoints

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "rooms": 5,
  "players": 12,
  "uptime": 3600,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### `GET /api/rooms`
Get list of public rooms.

**Response:**
```json
{
  "rooms": [
    {
      "id": "room-1",
      "name": "Campaign Room",
      "playerCount": 3,
      "maxPlayers": 6,
      "gm": "Dungeon Master",
      "hasPassword": true,
      "gmOnline": true
    }
  ]
}
```

---

## Error Handling

### `room_error`
Sent when room operations fail.

```json
{
  "error": "Room not found"
}
```

### `party_error`
Sent when party operations fail.

```json
{
  "error": "Only the leader can promote members"
}
```

---

## Rate Limiting

- Socket events: 100 events per minute per socket
- REST API: 100 requests per 15 minutes per IP

---

## Data Structures

### Room Object
```typescript
interface Room {
  id: string;
  name: string;
  passwordHash: string | null;
  gm: Player;
  players: Map<string, Player>;
  settings: RoomSettings;
  gameState: GameState;
  chatHistory: ChatMessage[];
  createdAt: string;
  isActive: boolean;
  isPermanent: boolean;
}
```

### Player Object
```typescript
interface Player {
  id: string;
  name: string;
  socketId: string;
  roomId: string;
  isGM: boolean;
  color: string;
  character?: Character;
  currentMapId: string;
}
```

### GameState Object
```typescript
interface GameState {
  characters: Record<string, Character>;
  combat: CombatState;
  maps: Record<string, MapState>;
  playerMapAssignments: Record<string, string>;
  gridSettings: GridSettings;
}
```
