const fs = require('fs');
const path = require('path');

// Mock logger
const logger = {
    info: console.log,
    debug: console.log,
    warn: console.warn,
    error: console.error
};

// Mock variables from server.js
let isDevelopment = true;
const rooms = new Map();
// Use __dirname like in the fix
const localPath = path.resolve(__dirname, 'local-persistence.json');

function saveLocalPersistence() {
    if (!isDevelopment) return;

    try {
        const roomsToPersist = {};
        for (const [id, room] of rooms.entries()) {
            if (room.persistentRoomId || room.isPermanent) {
                const roomCopy = { ...room };
                if (roomCopy.players instanceof Map) {
                    roomCopy.players = Object.fromEntries(roomCopy.players);
                }
                roomsToPersist[id] = roomCopy;
            }
        }

        if (Object.keys(roomsToPersist).length > 0) {
            fs.writeFileSync(localPath, JSON.stringify(roomsToPersist, null, 2));
            console.log('✅ Local persistence saved', { roomCount: Object.keys(roomsToPersist).length, path: localPath });
        }
    } catch (error) {
        console.error('❌ Failed to save local persistence:', error);
    }
}

let saveTimeout = null;
let writeCount = 0;
function saveLocalPersistenceDebounced(delay = 100) { // Short delay for test
    if (!isDevelopment) return;

    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
        saveLocalPersistence();
        writeCount++;
        saveTimeout = null;
    }, delay);
}

// Test Case
async function runTest() {
    console.log('Starting advanced persistence verification test...');

    // 1. Setup mock room
    const roomId = 'test-room-456';
    rooms.set(roomId, {
        id: roomId,
        name: 'Advanced Verification Room',
        isPermanent: true,
        persistentRoomId: roomId,
        players: new Map(),
        gameState: {
            terrainData: { '1,1': { type: 'grass' } }
        }
    });

    // 2. Trigger debounced saves
    console.log('Triggering multiple debounced saves...');
    saveLocalPersistenceDebounced(50);
    saveLocalPersistenceDebounced(50);
    saveLocalPersistenceDebounced(50);

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 200));

    // 3. Verify path and content
    console.log(`Checking path: ${localPath}`);
    if (fs.existsSync(localPath)) {
        console.log('✅ Found local-persistence.json');
        const content = JSON.parse(fs.readFileSync(localPath, 'utf8'));
        if (content[roomId] && content[roomId].gameState.terrainData['1,1'].type === 'grass') {
            console.log('✅ Content verification passed!');
        } else {
            console.error('❌ Content verification failed!');
            process.exit(1);
        }

        if (writeCount === 1) {
            console.log('✅ Debounce verification passed (only 1 write)!');
        } else {
            console.error(`❌ Debounce verification failed! Write count: ${writeCount}`);
            process.exit(1);
        }
    } else {
        console.error('❌ local-persistence.json not found!');
        process.exit(1);
    }

    console.log('Test completed successfully!');
}

runTest();
