import re

with open('server.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the block to fix - look for line 1574 and the gm.id assignment
for i, line in enumerate(lines):
    if 'gm: {' in line:
        start_idx = i
        break

if start_idx is None:
    print('Target block not found')
    exit(1)

# Find where the block ends (where the ensureRoomGameStateDefaults call is)
end_idx = None
for i in range(start_idx, len(lines)):
    if 'ensureRoomGameStateDefaults(room);' in lines[i]:
        end_idx = i
        break

if end_idx is None:
    print('End of block not found')
    exit(1)

# The old block (lines start_idx to end_idx)
old_block = ''.join(lines[start_idx:end_idx+1])

# The new block - reordered to preserve gm.id from persistedRuntimeRoom
new_block = '''          // CRITICAL FIX: Set gm.id from persistedRuntimeRoom BEFORE spread to preserve Firestore document ID
          // If we use spread first, then assign gm.id separately, it will override the Firestore ID
          room = {
            ...persistedRuntimeRoom, // Spread all normalized room data first (includes gm.id from Firestore)
            id: data.persistentRoomId, // Then set room.id to Firestore document ID
            name: persistedRoomData.roomName || data.roomName,
            passwordHash: passwordHash,
            gm: {
              // id is now correctly set from persistedRuntimeRoom, not overridden by data.gmName
              name: data.gmName || 'Game Master',
              socketId: socket.id,
              isGM: true,
              color: data.playerColor || '#d4af37'
            },
            players: new Map(),
            gridSettings: {
              gridType: 'square',
              gridSize: 50,
              gridOffsetX: 0,
              gridOffsetY: 0,
              gridLineColor: '#000000',
              gridLineThickness: 1,
              gridLineOpacity: 0.5,
              gridBackgroundColor: '#d4c5b9'
            },
            lastActivity: new Date().toISOString(),
            isActive: true,
            isPermanent: true,
            persistentRoomId: data.persistentRoomId
          };
          
          // Ensure room has default gameState structure (maps, defaultMapId, etc.)
          ensureRoomGameStateDefaults(room);
          
          logger.info(`[create_room] Room object created from normalized data`, {
            roomId: room.id,
            gameStateMapCount: Object.keys(room.gameState?.maps || {}).length,
            defaultMapId: room.gameState?.defaultMapId,
            defaultMapHasGridItems: !!room.gameState?.maps?.default?.gridItems,
            defaultMapGridItemsCount: Object.keys(room.gameState?.maps?.default?.gridItems || {}).length,
            defaultMapTerrainCount: Object.keys(room.gameState?.maps?.default?.terrainData || {}).length
          });'''

# Replace the old block with the new block
new_content = ''.join(lines[:start_idx]) + new_block + ''.join(lines[end_idx+1:])

# Write the fixed content
with open('server.js', 'w', encoding='utf-8') as out:
    out.write(new_content)

print('Fix applied: room.id now uses Firestore document ID')
