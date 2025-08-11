// Firebase Admin SDK service for server-side operations
const admin = require('firebase-admin');

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
      console.log('✅ Firebase Admin initialized with service account');
    } else if (process.env.NODE_ENV === 'development') {
      // Initialize with default credentials (development)
      // This requires GOOGLE_APPLICATION_CREDENTIALS environment variable
      // or running on a machine with default credentials
      admin.initializeApp({
        projectId: projectId
      });
      console.log('✅ Firebase Admin initialized with default credentials');
    } else {
      console.warn('⚠️ Firebase Admin not initialized - no credentials provided');
      return null;
    }

    db = admin.firestore();
    isInitialized = true;
    return db;
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
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
const getRoomData = async (roomId) => {
  if (!db) {
    console.warn('Firebase not initialized, using in-memory rooms only');
    return null;
  }

  try {
    const roomDoc = await db.collection('rooms').doc(roomId).get();
    if (roomDoc.exists) {
      return { id: roomDoc.id, ...roomDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching room from Firestore:', error);
    return null;
  }
};

/**
 * Create or update room data in Firestore
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Room data
 * @returns {Promise<boolean>} - Success status
 */
const saveRoomData = async (roomId, roomData) => {
  if (!db) {
    console.warn('Firebase not initialized, room data not persisted');
    return false;
  }

  try {
    // Convert Maps to objects for Firestore
    const firestoreData = {
      ...roomData,
      players: roomData.players ? Object.fromEntries(roomData.players) : {},
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('rooms').doc(roomId).set(firestoreData, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving room to Firestore:', error);
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
    console.error('Error updating room game state:', error);
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
    console.error('Error adding chat message:', error);
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
    console.error('Error updating room active status:', error);
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
    console.error('Error deleting room:', error);
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
    console.error('Error fetching user data:', error);
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
    console.error('Error verifying ID token:', error);
    return null;
  }
};

/**
 * Load persistent rooms from Firestore on server startup
 * @returns {Promise<Array>} - Array of room data
 */
const loadPersistentRooms = async () => {
  if (!db) {
    console.log('Firebase not initialized, skipping persistent room loading');
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
      rooms.push(roomData);
    });

    console.log(`✅ Loaded ${rooms.length} persistent rooms from Firestore`);
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
  loadPersistentRooms
};
