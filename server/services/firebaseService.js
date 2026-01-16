// Firebase Admin SDK service for server-side operations
const admin = require('firebase-admin');
const logger = require('./logger');

// Initialize Firebase Admin SDK
let db = null;
let isInitialized = false;

const initializeFirebase = () => {
  if (isInitialized) {
    return db;
  }

  try {
    // Check if we have Firebase credentials
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID || 'mythrill-ff7c6';

    if (serviceAccountKey) {
      // Initialize with service account key (production)
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId
      });
      logger.info('Firebase Admin initialized with service account');
    } else if (process.env.NODE_ENV === 'development') {
      // Initialize with default credentials (development)
      // This requires GOOGLE_APPLICATION_CREDENTIALS environment variable
      // or running on a machine with default credentials
      admin.initializeApp({
        projectId: projectId
      });
      logger.info('Firebase Admin initialized with default credentials');
    } else {
      logger.warn('Firebase Admin not initialized - no credentials provided');
      return null;
    }

    db = admin.firestore();
    isInitialized = true;
    return db;
  } catch (error) {
    logger.error('Firebase Admin initialization failed', { error: error.message });
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
    logger.debug('Firebase not initialized, using in-memory rooms only');
    return null;
  }

  try {
    // PERFORMANCE: Batch all queries in parallel to reduce latency
    const [roomDoc, gameStateDoc, chatSnapshot] = await Promise.all([
      db.collection('rooms').doc(roomId).get(),
      db.collection('rooms').doc(roomId).collection('gameState').doc('current').get(),
      db.collection('rooms').doc(roomId).collection('chat')
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get()
    ]);

    if (!roomDoc.exists) {
      return null;
    }

    const roomData = { id: roomDoc.id, ...roomDoc.data() };

    // Check if gameState is in subcollection (split storage)
    if (gameStateDoc.exists) {
      roomData.gameState = gameStateDoc.data();
      // Remove timestamp from gameState
      delete roomData.gameState.lastUpdated;
    }

    // Load chat history from subcollection if it exists
    if (!chatSnapshot.empty) {
      roomData.chatHistory = chatSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .reverse(); // Reverse to get chronological order
    } else if (!roomData.chatHistory) {
      // Fallback to chatHistory in main document if subcollection doesn't exist
      roomData.chatHistory = roomData.chatHistory || [];
    }

    // Convert players object back to Map
    if (roomData.players && typeof roomData.players === 'object' && !(roomData.players instanceof Map)) {
      roomData.players = new Map(Object.entries(roomData.players));
    }

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
    logger.debug('Firebase not initialized, room data not persisted');
    return false;
  }

  try {
    // Extract data that should be in subcollections
    const gameState = roomData.gameState || {};
    const chatHistory = roomData.chatHistory || [];

    // Core room data (small, stays in main document)
    const coreRoomData = {
      id: roomData.id,
      name: roomData.name,
      passwordHash: roomData.passwordHash,
      gm: roomData.gm,
      players: roomData.players ? Object.fromEntries(roomData.players) : {},
      settings: roomData.settings || {},
      isActive: roomData.isActive !== false,
      createdAt: roomData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    };

    // Remove plain text password if it exists
    delete coreRoomData.password;

    // Save core room data
    await db.collection('rooms').doc(roomId).set(coreRoomData, { merge: true });

    // Save gameState to subcollection (only if it exists and has data)
    if (gameState && Object.keys(gameState).length > 0) {
      const gameStateRef = db.collection('rooms').doc(roomId).collection('gameState').doc('current');
      await gameStateRef.set({
        ...gameState,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    // Save recent chat messages to subcollection (keep last 100)
    if (chatHistory && chatHistory.length > 0) {
      const recentMessages = chatHistory.slice(-100); // Keep last 100 messages
      const batch = db.batch();

      // Delete old messages beyond limit
      const chatRef = db.collection('rooms').doc(roomId).collection('chat');
      const oldMessagesSnapshot = await chatRef.orderBy('timestamp', 'desc').offset(100).get();
      oldMessagesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Add new messages
      for (const message of recentMessages) {
        if (message.id) {
          const messageRef = chatRef.doc(message.id);
          batch.set(messageRef, {
            ...message,
            timestamp: message.timestamp || admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }
      }

      if (oldMessagesSnapshot.size > 0 || recentMessages.length > 0) {
        await batch.commit();
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving split room data to Firestore:', error);
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
      players: roomData.players ? Object.fromEntries(roomData.players) : {},
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
 * Update room game state in Firestore
 * @param {string} roomId - Room ID
 * @param {Object} gameState - Game state update
 * @returns {Promise<boolean>} - Success status
 */
const updateRoomGameState = async (roomId, gameState) => {
  if (!db) {
    return false;
  }

  try {
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

    await db.collection('rooms').doc(roomId).update({
      chatHistory: admin.firestore.FieldValue.arrayUnion(messageWithTimestamp),
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
    roomsSnapshot.forEach(doc => {
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
    });

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
  getRoomData,
  saveRoomData,
  updateRoomGameState,
  addChatMessage,
  setRoomActiveStatus,
  deleteRoom,
  getUserData,
  verifyIdToken,
  loadPersistentRooms,
  saveCharacterDocument
};
