// Room service for Firebase Firestore integration
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import subscriptionService from './subscriptionService';

// Room collection reference
const ROOMS_COLLECTION = 'rooms';
const ROOM_SESSIONS_COLLECTION = 'roomSessions';

/**
 * Create a new persistent room in Firestore
 * @param {Object} roomData - Room configuration
 * @returns {Promise<string>} - Room ID
 */
export const createPersistentRoom = async (roomData) => {
  if (!db || !auth.currentUser) {
    throw new Error('Firebase not initialized or user not authenticated');
  }

  const userId = auth.currentUser.uid;

  // Check subscription limits
  try {
    const userRooms = await getUserRooms(userId);
    const currentRoomCount = userRooms.filter(room => room.userRole === 'gm').length;

    const roomLimitCheck = await subscriptionService.canCreateRoom(currentRoomCount, userId);

    if (!roomLimitCheck.canCreate) {
      const tier = roomLimitCheck.tier;
      throw new Error(`Room limit reached. Your ${tier.name} plan allows ${tier.roomLimit} room${tier.roomLimit === 1 ? '' : 's'}. You currently have ${currentRoomCount} room${currentRoomCount === 1 ? '' : 's'}.`);
    }
  } catch (error) {
    if (error.message.includes('Room limit reached')) {
      throw error; // Re-throw subscription limit errors
    }
    console.warn('Could not check room limits:', error);
    // Continue with room creation if limit check fails
  }

  const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const room = {
    id: roomId,
    name: roomData.name,
    description: roomData.description || '',
    password: roomData.password, // In production, this should be hashed
    
    // GM and ownership
    gmId: userId,
    gmName: roomData.gmName || auth.currentUser.displayName || 'Game Master',
    
    // Room settings
    settings: {
      maxPlayers: roomData.maxPlayers || 6,
      isPrivate: true,
      allowSpectators: roomData.allowSpectators || false,
      autoSaveInterval: 300000, // 5 minutes
      enableVoiceChat: false,
      enableVideoChat: false
    },
    
    // Game state - comprehensive VTT data
    gameState: {
      currentMap: null,
      characters: {},
      tokens: {},
      combat: {
        isActive: false,
        currentTurn: null,
        turnOrder: [],
        round: 0
      },
      mapData: {
        backgrounds: [],
        activeBackgroundId: null,
        cameraPosition: { x: 0, y: 0 },
        zoomLevel: 1.0,
        gridSettings: {
          size: 50,
          offsetX: 0,
          offsetY: 0,
          color: 'rgba(212, 175, 55, 0.8)',
          thickness: 2
        }
      },
      fogOfWar: {},
      lighting: {
        globalIllumination: 0.3,
        lightSources: []
      },
      // Level editor data
      levelEditor: {
        terrainData: [],
        environmentalObjects: [],
        wallData: [],
        dndElements: [],
        fogOfWarData: [],
        drawingPaths: [],
        drawingLayers: [],
        lightSources: []
      },
      // Inventory and items
      inventory: {
        droppedItems: {},
        lootBags: {}
      },
      // Notes and annotations
      notes: {
        gmNotes: [],
        playerNotes: [],
        sharedNotes: []
      }
    },
    
    // Chat and communication
    chatHistory: [],
    
    // Metadata
    createdAt: serverTimestamp(),
    lastModified: serverTimestamp(),
    lastActivity: serverTimestamp(),
    isActive: false, // Whether there's an active session
    
    // Player management
    members: [userId], // Array of user IDs who have access
    bannedUsers: [],
    
    // Room statistics
    stats: {
      totalSessions: 0,
      totalPlayTime: 0,
      lastSessionDate: null
    }
  };

  try {
    await setDoc(doc(db, ROOMS_COLLECTION, roomId), room);
    console.log('✅ Room created in Firestore:', roomId);
    return roomId;
  } catch (error) {
    console.error('❌ Error creating room in Firestore:', error);
    throw error;
  }
};

/**
 * Get room data from Firestore
 * @param {string} roomId - Room ID
 * @returns {Promise<Object|null>} - Room data or null if not found
 */
export const getRoomData = async (roomId) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const roomDoc = await getDoc(doc(db, ROOMS_COLLECTION, roomId));
    if (roomDoc.exists()) {
      return { id: roomDoc.id, ...roomDoc.data() };
    }
    return null;
  } catch (error) {
    // Check if this is a permission error and handle gracefully
    if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
      console.warn(`⚠️ Firebase permission denied for room ${roomId}. User may not be in room members array.`);
      // Return null instead of throwing to prevent repeated errors
      return null;
    }

    console.error('❌ Error fetching room data:', error);
    throw error;
  }
};

/**
 * Update room game state
 * @param {string} roomId - Room ID
 * @param {Object} gameStateUpdate - Partial game state update
 * @returns {Promise<void>}
 */
export const updateRoomGameState = async (roomId, gameStateUpdate) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    await updateDoc(roomRef, {
      gameState: gameStateUpdate,
      lastModified: serverTimestamp(),
      lastActivity: serverTimestamp()
    });
  } catch (error) {
    console.error('❌ Error updating room game state:', error);
    throw error;
  }
};

/**
 * Add a chat message to room history
 * @param {string} roomId - Room ID
 * @param {Object} message - Chat message
 * @returns {Promise<void>}
 */
export const addChatMessage = async (roomId, message) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const messageWithTimestamp = {
    ...message,
    timestamp: serverTimestamp()
  };

  try {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    await updateDoc(roomRef, {
      chatHistory: arrayUnion(messageWithTimestamp),
      lastActivity: serverTimestamp()
    });
  } catch (error) {
    console.error('❌ Error adding chat message:', error);
    throw error;
  }
};

/**
 * Get user's rooms (where they are GM or member)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of room data
 */
export const getUserRooms = async (userId) => {
  // Check for demo mode
  try {
    const { isDemoMode } = await import('../config/firebase');
    if (isDemoMode) {
      console.log('🔧 Demo mode: Returning empty rooms list');
      return [];
    }
  } catch (error) {
    console.warn('Could not check demo mode:', error);
  }

  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    // Get rooms where user is GM
    const gmRoomsQuery = query(
      collection(db, ROOMS_COLLECTION),
      where('gmId', '==', userId),
      orderBy('lastActivity', 'desc')
    );
    
    // Get rooms where user is a member
    const memberRoomsQuery = query(
      collection(db, ROOMS_COLLECTION),
      where('members', 'array-contains', userId),
      orderBy('lastActivity', 'desc')
    );

    const [gmRoomsSnapshot, memberRoomsSnapshot] = await Promise.all([
      getDocs(gmRoomsQuery),
      getDocs(memberRoomsQuery)
    ]);

    const rooms = new Map();
    
    // Add GM rooms
    gmRoomsSnapshot.forEach(doc => {
      rooms.set(doc.id, { id: doc.id, ...doc.data(), userRole: 'gm' });
    });
    
    // Add member rooms (avoid duplicates)
    memberRoomsSnapshot.forEach(doc => {
      if (!rooms.has(doc.id)) {
        rooms.set(doc.id, { id: doc.id, ...doc.data(), userRole: 'player' });
      }
    });

    return Array.from(rooms.values());
  } catch (error) {
    console.error('❌ Error fetching user rooms:', error);
    throw error;
  }
};

/**
 * Join a room (add user to members)
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @param {string} password - Room password
 * @returns {Promise<Object>} - Room data or error
 */
export const joinRoom = async (roomId, userId, password) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const roomData = await getRoomData(roomId);
    
    if (!roomData) {
      throw new Error('Room not found');
    }

    // Check password - handle both empty and non-empty passwords
    const roomPassword = roomData.password || '';
    const providedPassword = password || '';

    if (roomPassword !== providedPassword) {
      throw new Error('Incorrect password');
    }

    // Check if user is banned
    if (roomData.bannedUsers.includes(userId)) {
      throw new Error('You are banned from this room');
    }

    // Check if room is full
    if (roomData.members.length >= roomData.settings.maxPlayers + 1) { // +1 for GM
      throw new Error('Room is full');
    }

    // Add user to members if not already a member
    if (!roomData.members.includes(userId)) {
      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      await updateDoc(roomRef, {
        members: arrayUnion(userId),
        lastActivity: serverTimestamp()
      });
    }

    return await getRoomData(roomId);
  } catch (error) {
    console.error('❌ Error joining room:', error);
    throw error;
  }
};

/**
 * Leave a room (remove user from members)
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const leaveRoom = async (roomId, userId) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    await updateDoc(roomRef, {
      members: arrayRemove(userId),
      lastActivity: serverTimestamp()
    });
  } catch (error) {
    console.error('❌ Error leaving room:', error);
    throw error;
  }
};

/**
 * Delete a room (only GM can do this)
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID (must be GM)
 * @returns {Promise<void>}
 */
export const deleteRoom = async (roomId, userId) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const roomData = await getRoomData(roomId);

    if (!roomData) {
      throw new Error('Room not found');
    }

    if (roomData.gmId !== userId) {
      throw new Error('Only the GM can delete the room');
    }

    await deleteDoc(doc(db, ROOMS_COLLECTION, roomId));
    console.log('✅ Room deleted:', roomId);
  } catch (error) {
    console.error('❌ Error deleting room:', error);
    throw error;
  }
};

/**
 * Subscribe to room changes
 * @param {string} roomId - Room ID
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToRoom = (roomId, callback) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  return onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('❌ Error in room subscription:', error);
    callback(null, error);
  });
};

/**
 * Get public rooms (for discovery)
 * @param {number} limitCount - Maximum number of rooms to return
 * @returns {Promise<Array>} - Array of public room data
 */
export const getPublicRooms = async (limitCount = 20) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const publicRoomsQuery = query(
      collection(db, ROOMS_COLLECTION),
      where('settings.isPrivate', '==', false),
      orderBy('lastActivity', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(publicRoomsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      gmName: doc.data().gmName,
      memberCount: doc.data().members?.length || 0,
      maxPlayers: doc.data().settings?.maxPlayers || 6,
      lastActivity: doc.data().lastActivity,
      isActive: doc.data().isActive || false
    }));
  } catch (error) {
    console.error('❌ Error fetching public rooms:', error);
    throw error;
  }
};

/**
 * Save complete game state to room
 * @param {string} roomId - Room ID
 * @param {Object} gameState - Complete game state object
 * @returns {Promise<void>}
 */
export const saveCompleteGameState = async (roomId, gameState) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    await updateDoc(roomRef, {
      gameState: gameState,
      lastModified: serverTimestamp(),
      lastActivity: serverTimestamp()
    });

    console.log('✅ Complete game state saved for room:', roomId);
  } catch (error) {
    console.error('❌ Error saving complete game state:', error);
    throw error;
  }
};

/**
 * Load complete game state from room
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} - Complete game state object
 */
export const loadCompleteGameState = async (roomId) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const roomData = await getRoomData(roomId);

    if (!roomData) {
      throw new Error('Room not found');
    }

    return roomData.gameState || {};
  } catch (error) {
    // Check if this is a permission error and handle gracefully
    if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
      console.warn('⚠️ Firebase permission denied for room data access. User may not be in room members array.');
      // Return empty game state instead of throwing to prevent repeated errors
      return {};
    }

    console.error('❌ Error loading complete game state:', error);
    throw error;
  }
};

/**
 * Update specific game state section
 * @param {string} roomId - Room ID
 * @param {string} section - Section name (e.g., 'tokens', 'levelEditor', 'combat')
 * @param {Object} sectionData - Section data
 * @returns {Promise<void>}
 */
export const updateGameStateSection = async (roomId, section, sectionData) => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }

  try {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    const updateData = {};
    updateData[`gameState.${section}`] = sectionData;
    updateData.lastModified = serverTimestamp();
    updateData.lastActivity = serverTimestamp();

    await updateDoc(roomRef, updateData);

    console.log(`✅ Game state section '${section}' updated for room:`, roomId);
  } catch (error) {
    console.error(`❌ Error updating game state section '${section}':`, error);
    throw error;
  }
};

/**
 * Get room limits and usage for current user
 * @param {string} userId - User ID (optional)
 * @returns {Promise<Object>} - Room limit information
 */
export const getRoomLimits = async (userId = null) => {
  // Check for demo mode
  try {
    const { isDemoMode } = await import('../config/firebase');
    if (isDemoMode) {
      console.log('🔧 Demo mode: Returning demo room limits');
      return {
        tier: { name: 'Demo', roomLimit: 999 },
        limit: 999,
        used: 0,
        remaining: 999,
        canCreate: true,
        rooms: []
      };
    }
  } catch (error) {
    console.warn('Could not check demo mode:', error);
  }

  const uid = userId || auth.currentUser?.uid;

  if (!uid) {
    // Not logged in - guest tier
    return {
      tier: await subscriptionService.getUserTier(null),
      limit: 0,
      used: 0,
      remaining: 0,
      canCreate: false
    };
  }

  try {
    const userRooms = await getUserRooms(uid);
    const ownedRooms = userRooms.filter(room => room.userRole === 'gm');
    const used = ownedRooms.length;

    const tier = await subscriptionService.getUserTier(uid);
    const limit = tier.roomLimit;
    const remaining = Math.max(0, limit - used);

    return {
      tier: tier,
      limit: limit,
      used: used,
      remaining: remaining,
      canCreate: used < limit,
      rooms: ownedRooms
    };
  } catch (error) {
    console.error('Error getting room limits:', error);
    // Fallback to basic info
    const tier = await subscriptionService.getUserTier(uid);
    return {
      tier: tier,
      limit: tier.roomLimit,
      used: 0,
      remaining: tier.roomLimit,
      canCreate: tier.roomLimit > 0,
      rooms: []
    };
  }
};

export default {
  createPersistentRoom,
  getRoomData,
  updateRoomGameState,
  addChatMessage,
  getUserRooms,
  joinRoom,
  leaveRoom,
  deleteRoom,
  subscribeToRoom,
  getPublicRooms,
  getRoomLimits,
  saveCompleteGameState,
  loadCompleteGameState,
  updateGameStateSection
};
