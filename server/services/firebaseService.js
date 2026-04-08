// Firebase Admin SDK service for server-side operations
const admin = require('firebase-admin');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

// Initialize Firebase Admin SDK
let db = null;
let isInitialized = false;

const initializeFirebase = () => {
  if (isInitialized) {
    return db;
  }

  try {
    // Check if we have Firebase credentials or if we should use emulators
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const projectId = process.env.FIREBASE_PROJECT_ID || 'mythrill-ff7c6';
    
    // Check for emulator environment variables
    const isEmulator = process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST;

    let serviceAccount = null;

    if (serviceAccountKey) {
      // Initialize with service account key from inline JSON (production)
      serviceAccount = JSON.parse(serviceAccountKey);
    } else if (serviceAccountPath) {
      // Initialize with service account key from JSON file (production/development)
      const fs = require('fs');
      try {
        if (fs.existsSync(serviceAccountPath)) {
          const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
          serviceAccount = JSON.parse(serviceAccountData);
        }
      } catch (e) {
        logger.warn('Could not read service account file, falling back to default/emulator', { path: serviceAccountPath });
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId
      });
      logger.info('Firebase Admin initialized with service account', { projectId, isEmulator: !!isEmulator });
    } else if (isEmulator || process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      // Initialize without credentials when using emulator or in development
      // This allows the Admin SDK to use the emulators if they are configured via ENV
      admin.initializeApp({
        projectId: projectId
      });
      
      if (isEmulator) {
        logger.info('Firebase Admin initialized for Emulator usage', {
          projectId,
          firestoreHost: process.env.FIRESTORE_EMULATOR_HOST,
          authHost: process.env.FIREBASE_AUTH_EMULATOR_HOST
        });
      } else {
        logger.info('Firebase Admin initialized with default credentials/ADC', { projectId });
      }
    } else {
      logger.warn('Firebase Admin not initialized - no credentials provided');
      return null;
    }

    db = admin.firestore();
    isInitialized = true;
    return db;
  } catch (error) {
    logger.error('Firebase Admin initialization failed', { error: error.message, stack: error.stack });
    return null;
  }
};

// Initialize on module load
db = initializeFirebase();

/**
 * Get room data from Firestore
 * @param {string} roomId - Room ID
 * @returns {Promise<Object|null>} - Room data or null
 */
/**
 * Get room data from Firestore (handles both single-document and split storage)
 * @param {string} roomId - Room ID
 * @returns {Promise<Object|null>} - Room data or null
 */
const getRoomData = async (roomId) => {
  if (!db) {
    logger.warn('⚠️ getRoomData called but Firebase is not initialized. Permanent rooms cannot be retrieved.');
    throw new Error('Database connection error: Firebase Admin SDK not correctly initialized. Please check server logs for service account configuration.');
  }

  try {
    // 1. Load core room doc
    const roomSnap = await db.collection('rooms').doc(roomId).get();
    if (!roomSnap.exists) {
      return null;
    }

    const roomData = { ...roomSnap.data(), id: roomSnap.id }; // Ensure id property matches document ID

    logger.info(`[getRoomData] Main document loaded for ${roomId}`, {
      hasGameState: !!roomData.gameState,
      gameStateMapsCount: Object.keys(roomData.gameState?.maps || {}).length,
      gameStateKeys: Object.keys(roomData.gameState || {})
    });

    // 2. Load fragmented game state and chat in parallel
    const [gameStateCurrentSnap, mapsSnapshot, chatSnapshot] = await Promise.all([
      db.collection('rooms').doc(roomId).collection('gameState').doc('current').get(),
      db.collection('rooms').doc(roomId).collection('gameState').get(),
      db.collection('rooms').doc(roomId).collection('chat')
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get()
    ]);

    logger.info(`[getRoomData] Subcollections queried for ${roomId}`, {
      hasCurrentFragment: gameStateCurrentSnap.exists,
      mapsDocsCount: mapsSnapshot.docs.length,
      chatDocsCount: chatSnapshot.docs.length
    });

    // 3. Hydrate gameState
    // Start with 'current' fragment if it exists (subcollection is authoritative)
    roomData.gameState = {};
    if (gameStateCurrentSnap.exists) {
      const currentFrag = gameStateCurrentSnap.data();
      delete currentFrag.lastUpdated; // Internal metadata
      roomData.gameState = { ...currentFrag };
    } else {
      // Fallback to main document if subcollection doesn't exist
      roomData.gameState = roomData.gameState || {};
    }

    // Load individual map documents from subcollection
    if (!mapsSnapshot.empty) {
      roomData.gameState.maps = roomData.gameState.maps || {};
      mapsSnapshot.docs.forEach(doc => {
        if (doc.id === 'current') return; // Skip the metadata/global fragment
        roomData.gameState.maps[doc.id] = doc.data();
      });

      logger.info(`[getRoomData] Maps loaded from subcollection for ${roomId}`, {
        mapIds: mapsSnapshot.docs.filter(d => d.id !== 'current').map(d => d.id),
        mapsStructure: mapsSnapshot.docs.filter(d => d.id !== 'current').map(d => ({
          id: d.id,
          hasGridItems: !!d.data().gridItems,
          gridItemsCount: Object.keys(d.data().gridItems || {}).length,
          hasTerrainData: !!d.data().terrainData,
          terrainDataCount: Object.keys(d.data().terrainData || {}).length
        }))
      });
    } else {
      logger.warn(`[getRoomData] No maps in subcollection for ${roomId}`, {
        mainDocMapsCount: Object.keys(roomData.gameState?.maps || {}).length,
        mainDocMapKeys: Object.keys(roomData.gameState?.maps || {})
      });
    }

    // 4. Hydrate chatHistory
    if (!chatSnapshot.empty) {
      roomData.chatHistory = chatSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .reverse();
    } else if (!roomData.chatHistory) {
      roomData.chatHistory = [];
    }

    // Convert players object back to Map
    if (roomData.players && typeof roomData.players === 'object' && !(roomData.players instanceof Map)) {
      roomData.players = new Map(Object.entries(roomData.players));
    }

    logger.info(`[getRoomData] Final room data for ${roomId}`, {
      mapCount: Object.keys(roomData.gameState?.maps || {}).length,
      mapIds: Object.keys(roomData.gameState?.maps || {}),
      hasDefaultMap: !!roomData.gameState?.maps?.default,
      defaultMapGridItemsCount: Object.keys(roomData.gameState?.maps?.default?.gridItems || {}).length,
      defaultMapTerrainCount: Object.keys(roomData.gameState?.maps?.default?.terrainData || {}).length
    });

    return roomData;
  } catch (error) {
    logger.error('Error fetching room from Firestore', { error: error.message, roomId });
    return null;
  }
};

/**
 * Split large room data into subcollections to avoid 1MB Firestore limit
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Full room data
 * @returns {Promise<boolean>} - Success status
 */
const saveRoomDataSplit = async (roomId, roomData) => {
  if (!db) {
    logger.debug('Firebase not initialized, skipping split save (local fallback should handle)', { roomId });
    return true;
  }

  try {
    const gameState = roomData.gameState || {};
    const chatHistory = roomData.chatHistory || [];

    // 1. Save core metadata
    const coreRoomData = {
      id: roomData.id,
      name: roomData.name,
      passwordHash: roomData.passwordHash,
      gm: roomData.gm,
      gmId: roomData.gmId || (roomData.gm ? roomData.gm.userId || roomData.gm.id : null),
      members: roomData.members || (roomData.gm ? [roomData.gm.userId || roomData.gm.id] : []),
      players: roomData.players ? Object.fromEntries(roomData.players) : {},
      settings: roomData.settings || {},
      isActive: roomData.isActive !== false,
      createdAt: roomData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp(),
      isSplitStorage: true // Metadata flag
    };
    await db.collection('rooms').doc(roomId).set(coreRoomData, { merge: true });

    // 2. Save non-map gameState fragment
    const globalState = { ...gameState };
    const maps = globalState.maps || {};
    delete globalState.maps; // Maps saved separately

    await db.collection('rooms').doc(roomId).collection('gameState').doc('current').set({
      ...globalState,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    // 3. Save individual maps and clean up orphaned map subcollection docs
    const gameStateRef = db.collection('rooms').doc(roomId).collection('gameState');
    const currentMapIds = Object.keys(maps);

    // Delete orphaned map docs that no longer exist in gameState.maps
    try {
      const existingMapDocs = await gameStateRef.listDocuments();
      for (const doc of existingMapDocs) {
        if (doc.id !== 'current' && !currentMapIds.includes(doc.id)) {
          await doc.delete();
        }
      }
    } catch (cleanupError) {
      logger.warn('Failed to clean up orphaned map docs', { error: cleanupError.message, roomId });
    }

    const mapPromises = currentMapIds.map(mapId => {
      return gameStateRef.doc(mapId).set(maps[mapId]);
    });

    // 4. Save recent chat history
    // We only save the current set to the chat subcollection if they don't already exist
    // Actually, for a split-save of the whole room, we'll just ensure the latest 100 are there.
    const chatPromises = chatHistory.slice(-100).map(msg => {
      const msgId = msg.id || uuidv4();
      return db.collection('rooms').doc(roomId).collection('chat').doc(msgId).set({
        ...msg,
        timestamp: msg.timestamp || admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await Promise.all([...mapPromises, ...chatPromises]);
    logger.debug(`✅ Saved large room ${roomId} using split storage`);

    return true;
  } catch (error) {
    logger.error('Error saving split room data', { error: error.message, roomId });
    return false;
  }
};

/**
 * Update a specific map's data in Firestore
 * @param {string} roomId - Room ID
 * @param {string} mapId - Map ID to update
 * @param {Object} mapData - Map data to update
 * @ @returns {Promise<boolean>} - Success status
 */
const updateMapData = async (roomId, mapId, mapData) => {
  if (!db) {
    return false;
  }

  try {
    await db.collection('rooms').doc(roomId).collection('gameState').doc(mapId).set(mapData, { merge: true });
    logger.debug(`✅ Updated map ${mapId} in room ${roomId}`);
    return true;
  } catch (error) {
    logger.error('Error updating map data', { error: error.message, roomId, mapId });
    return false;
  }
};

/**
 * Get a specific map's data from Firestore
 * @param {string} roomId - Room ID
 * @param {string} mapId - Map ID to get
 * @returns {Promise<Object|null>} - Map data or null
 */
const getMapData = async (roomId, mapId) => {
  if (!db) {
    logger.debug('Firebase not initialized, using in-memory rooms only');
    return null;
  }

  try {
    const mapDoc = await db.collection('rooms').doc(roomId).collection('gameState').doc(mapId).get();
    if (!mapDoc.exists) {
      logger.warn(`⚠️ Map ${mapId} not found in room ${roomId}`);
      return null;
    }
    const mapData = mapDoc.data();
    logger.debug(`📂 Loaded map data for ${mapId}:`, {
      hasGridItems: !!mapData.gridItems,
      gridItemsCount: Object.keys(mapData.gridItems || {}).length
    });
    return mapData;
  } catch (error) {
    logger.error('Error getting map data', { error: error.message, roomId, mapId });
    return null;
  }
};

/**
 * Update room game state in Firestore
 * @param {string} roomId - Room ID
 * @param {Object} gameState - Game state update
 * @returns {Promise<boolean>} - Success status
 */
const updateRoomGameState = async (roomId, gameState) => {
  if (!db) {
    return true; // Allow caller to proceed (local persistence will handle in dev)
  }

  try {
    // Size check for split storage
    const dataSize = JSON.stringify(gameState).length;
    const splitThreshold = 100 * 1024; // 100KB - Always use split storage to ensure persistence

    if (dataSize > splitThreshold) {
      // Extract maps and save separately
      const globalState = { ...gameState };
      const maps = globalState.maps || {};
      // CRITICAL FIX: Deep clone to avoid race condition where concurrent updates lose maps data
      // Using JSON.parse/stringify ensures deep copy instead of shallow reference
      const globalStateClone = JSON.parse(JSON.stringify(globalState));
      delete globalStateClone.maps;

      // Update timestamps on the core document
      await db.collection('rooms').doc(roomId).update({
        lastModified: admin.firestore.FieldValue.serverTimestamp(),
        lastActivity: admin.firestore.FieldValue.serverTimestamp(),
        isSplitStorage: true
      });

      // Update current game state fragment
      await db.collection('rooms').doc(roomId).collection('gameState').doc('current').set({
        ...globalStateClone,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });

      const mapPromises = Object.entries(maps).map(([mapId, mapData]) => {
        return db.collection('rooms').doc(roomId).collection('gameState').doc(mapId).set(mapData);
      });
      await Promise.all(mapPromises);

      return true;
    }

    // Normal path
    await db.collection('rooms').doc(roomId).update({
      gameState: gameState,
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    logger.error('Error updating room game state', { error: error.message, roomId });
    return false;
  }
};

/**
 * Create or update room data in Firestore
 * Uses split storage for large rooms to avoid 1MB limit
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Room data
 * @returns {Promise<boolean>} - Success status
 */
const saveRoomData = async (roomId, roomData) => {
  if (!db) {
    logger.debug('Firebase not initialized, room data not persisted');
    return false;
  }

  try {
    // Estimate document size (rough approximation)
    const dataSize = JSON.stringify(roomData).length;
    const sizeLimit = 900 * 1024; // 900KB threshold (leave margin for Firestore overhead)

    // Use split storage for large documents
    if (dataSize > sizeLimit) {
      logger.debug('Room exceeds size threshold, using split storage', { roomId, sizeKB: (dataSize / 1024).toFixed(2) });
      return await saveRoomDataSplit(roomId, roomData);
    }

    // For smaller documents, use traditional single-document storage
    const firestoreData = {
      ...roomData,
      id: roomId, // Force ID to match document ID for consistency
      players: roomData.players ? Object.fromEntries(roomData.players) : {},
      gmId: roomData.gmId || (roomData.gm ? roomData.gm.userId || roomData.gm.id : null),
      members: roomData.members || (roomData.gm ? [roomData.gm.userId || roomData.gm.id] : []),
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    };

    // Remove plain text password if it exists (shouldn't, but safety check)
    delete firestoreData.password;

    // Ensure passwordHash is present (or null for no password)
    if (!firestoreData.passwordHash && roomData.passwordHash !== undefined) {
      firestoreData.passwordHash = roomData.passwordHash;
    }

    await db.collection('rooms').doc(roomId).set(firestoreData, { merge: true });
    return true;
  } catch (error) {
    logger.error('Error saving room to Firestore', { error: error.message, roomId });
    return false;
  }
};

/**
 * Add chat message to room history in Firestore
 * @param {string} roomId - Room ID
 * @param {Object} message - Chat message
 * @returns {Promise<boolean>} - Success status
 */
const addChatMessage = async (roomId, message) => {
  if (!db) {
    return false;
  }

  try {
    const messageWithTimestamp = {
      ...message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    const msgId = message.id || uuidv4();

    // Write to chat subcollection (authoritative location for split-storage rooms)
    await db.collection('rooms').doc(roomId).collection('chat').doc(msgId).set({
      ...messageWithTimestamp,
      id: msgId
    });

    // Also update lastActivity on main document
    await db.collection('rooms').doc(roomId).update({
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    logger.error('Error adding chat message', { error: error.message, roomId });
    return false;
  }
};

/**
 * Mark room as active/inactive
 * @param {string} roomId - Room ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<boolean>} - Success status
 */
const setRoomActiveStatus = async (roomId, isActive) => {
  if (!db) {
    return false;
  }

  try {
    await db.collection('rooms').doc(roomId).update({
      isActive: isActive,
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    logger.error('Error updating room active status', { error: error.message, roomId });
    return false;
  }
};

/**
 * Delete room from Firestore
 * @param {string} roomId - Room ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteRoom = async (roomId) => {
  if (!db) {
    return false;
  }

  try {
    await db.collection('rooms').doc(roomId).delete();
    return true;
  } catch (error) {
    logger.error('Error deleting room', { error: error.message, roomId });
    return false;
  }
};

/**
 * Save individual character document to Firestore
 * @param {string} characterId - Character ID
 * @param {Object} characterData - Character data
 * @param {string} userId - User ID (owner of the character)
 * @returns {Promise<boolean>} - Success status
 */
const saveCharacterDocument = async (characterId, characterData, userId) => {
  if (!db) {
    logger.debug('Firebase not initialized, character document not persisted');
    return false;
  }

  if (!characterId || !userId) {
    logger.warn('Missing characterId or userId, cannot save character document');
    return false;
  }

  try {
    // Transform character data for Firestore storage
    const firestoreData = {
      metadata: {
        id: characterId,
        userId: userId,
        name: characterData.name || 'Unnamed Character',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPlayedAt: admin.firestore.FieldValue.serverTimestamp(),
        version: (characterData.version || 0) + 1
      },
      basicInfo: {
        race: characterData.race || '',
        subrace: characterData.subrace || '',
        class: characterData.class || '',
        level: characterData.level || 1,
        alignment: characterData.alignment || 'Neutral Good',
        exhaustionLevel: characterData.exhaustionLevel || 0
      },
      stats: characterData.stats || {
        strength: 10,
        agility: 10,
        constitution: 10,
        intelligence: 10,
        spirit: 10,
        charisma: 10
      },
      resources: {
        health: characterData.health || { current: 100, max: 100 },
        mana: characterData.mana || { current: 50, max: 50 },
        actionPoints: characterData.actionPoints || { current: 3, max: 3 }
      },
      inventory: characterData.inventory || {
        items: [],
        currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        encumbranceState: 'normal'
      },
      equipment: characterData.equipment || {
        weapon: null,
        armor: null,
        shield: null,
        accessories: []
      },
      spells: characterData.spells || [],
      lore: characterData.lore || {},
      tokenSettings: characterData.tokenSettings || {},
      experience: characterData.experience || 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save character document
    await db.collection('characters').doc(characterId).set(firestoreData, { merge: true });
    logger.info('Character document saved', { characterName: characterData.name, characterId });
    return true;
  } catch (error) {
    logger.error('Error saving character document to Firestore', { error: error.message, characterId });
    return false;
  }
};

/**
 * Get user data from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - User data or null
 */
const getUserData = async (userId) => {
  if (!db) {
    return null;
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    logger.error('Error fetching user data', { error: error.message, userId });
    return null;
  }
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object|null>} - Decoded token or null
 */
const verifyIdToken = async (idToken) => {
  if (!admin.apps.length) {
    return null;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Error verifying ID token', { error: error.message });
    return null;
  }
};

/**
 * Migrate nested characters from room.gameState.characters to top-level collection
 * @param {string} roomId - Room ID
 * @param {Object} nestedCharacters - Characters from room.gameState.characters
 * @returns {Promise<number>} - Number of characters migrated
 */
const migrateNestedCharacters = async (roomId, nestedCharacters) => {
  if (!db || !nestedCharacters) {
    return 0;
  }

  let migratedCount = 0;
  try {
    for (const [characterId, characterData] of Object.entries(nestedCharacters)) {
      // Skip if this is already a minimal reference (has characterId but no full data)
      if (characterData.characterId && !characterData.stats && !characterData.inventory) {
        continue; // Already migrated
      }

      // Check if character already exists in top-level collection
      const charDoc = await db.collection('characters').doc(characterId).get();
      if (charDoc.exists) {
        continue; // Already exists, skip migration
      }

      // Extract userId from character data or use a default
      const userId = characterData.userId || characterData.metadata?.userId || 'unknown';

      // Migrate to top-level collection
      await saveCharacterDocument(characterId, characterData, userId);
      migratedCount++;
      logger.info('Migrated character from room to top-level collection', { characterId, roomId });
    }
  } catch (error) {
    logger.error('Error migrating nested characters', { error: error.message, roomId });
  }

  return migratedCount;
};

/**
 * Load persistent rooms from Firestore on server startup
 * @returns {Promise<Array>} - Array of room data
 */
const loadPersistentRooms = async () => {
  if (!db) {
    logger.debug('Firebase not initialized, skipping persistent room loading');
    return [];
  }

  try {
    const roomsSnapshot = await db.collection('rooms')
      .where('isActive', '==', true)
      .get();

    const rooms = [];
    for (const doc of roomsSnapshot.docs) {
      const roomData = { id: doc.id, ...doc.data() };
      // Convert players object back to Map
      if (roomData.players && typeof roomData.players === 'object') {
        roomData.players = new Map(Object.entries(roomData.players));
      }
      // SECURITY: Remove plain text password if it exists (migration from old data)
      if (roomData.password) {
        logger.warn('Room has plain text password - should be migrated to passwordHash', { roomId: roomData.id });
        delete roomData.password;
      }
      // Ensure passwordHash exists (or null for no password)
      if (!roomData.hasOwnProperty('passwordHash')) {
        roomData.passwordHash = null;
      }

      // CRITICAL FIX: For split-storage rooms, load gameState from subcollections.
      // The main document's gameState field is incomplete (maps are stored separately
      // in subcollection docs). Without this, players joining after a server restart
      // would get empty map data (no terrain, fog, walls, tokens, etc.)
      if (roomData.isSplitStorage) {
        try {
          const [gameStateCurrentSnap, mapsSnapshot] = await Promise.all([
            db.collection('rooms').doc(roomData.id).collection('gameState').doc('current').get(),
            db.collection('rooms').doc(roomData.id).collection('gameState').get()
          ]);

          // Build gameState from subcollections
          let gameState = {};
          if (gameStateCurrentSnap.exists) {
            const currentFrag = gameStateCurrentSnap.data();
            delete currentFrag.lastUpdated;
            gameState = { ...currentFrag };
          } else if (roomData.gameState) {
            gameState = { ...roomData.gameState };
            delete gameState.maps;
          }

          if (!mapsSnapshot.empty) {
            gameState.maps = gameState.maps || {};
            mapsSnapshot.docs.forEach(mapDoc => {
              if (mapDoc.id === 'current') return;
              gameState.maps[mapDoc.id] = mapDoc.data();
            });
          }

          roomData.gameState = gameState;
          logger.info(`[loadPersistentRooms] Hydrated split-storage gameState for room ${roomData.id}`, {
            mapsCount: Object.keys(gameState.maps || {}).length,
            mapIds: Object.keys(gameState.maps || {})
          });
        } catch (subErr) {
          logger.error(`[loadPersistentRooms] Failed to load subcollections for room ${roomData.id}`, { error: subErr.message });
        }
      }

      // MIGRATION: Migrate nested characters to top-level collection if they exist
      if (roomData.gameState && roomData.gameState.characters) {
        // Migrate in background (don't block room loading)
        migrateNestedCharacters(roomData.id, roomData.gameState.characters)
          .then(count => {
            if (count > 0) {
              logger.info('Migrated characters from room', { count, roomId: roomData.id });
            }
          })
          .catch(err => logger.error('Background character migration failed', { error: err.message, roomId: roomData.id }));

        // Clean up nested characters - keep only minimal references
        const minimalCharacters = {};
        for (const [characterId, characterData] of Object.entries(roomData.gameState.characters)) {
          minimalCharacters[characterId] = {
            characterId: characterId,
            name: characterData.name || 'Unknown',
            lastUpdatedAt: characterData.lastUpdatedAt || new Date()
          };
        }
        roomData.gameState.characters = minimalCharacters;
      }

      rooms.push(roomData);
    }

    logger.info(`Loaded ${rooms.length} persistent rooms from Firestore`);
    return rooms;
  } catch (error) {
    console.error('Error loading persistent rooms:', error);
    return [];
  }
};

module.exports = {
  db,
  isInitialized: () => isInitialized,
  isPersistenceAvailable: () => Boolean(db) && isInitialized,
  getRoomData,
  saveRoomData,
  updateRoomGameState,
  updateMapData,
  getMapData,
  addChatMessage,
  setRoomActiveStatus,
  deleteRoom,
  getUserData,
  verifyIdToken,
  loadPersistentRooms,
  saveCharacterDocument,
  validateConnection: async () => {
    if (!db) return { success: false, message: 'Firebase not initialized' };
    try {
      const testRef = db.collection('_server_health_check').doc('write_test');
      await testRef.set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        serverTime: Date.now()
      });
      await testRef.delete();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message, code: error.code };
    }
  }
};
