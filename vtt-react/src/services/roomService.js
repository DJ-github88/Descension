// Room service for Firebase Firestore integration
import {
 doc,
 getDoc,
 updateDoc,
 serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import subscriptionService from './subscriptionService';

// Room collection reference
const ROOMS_COLLECTION = 'rooms';

/**
 * Resolve the verified multiplayer socket when connected. Project 4 routes
 * every access-sensitive room operation through the server; the browser never
 * falls back to a direct Firebase mutation when the server denies.
 */
function getMultiplayerSocket() {
  try {
    const { getStore } = require('../store/storeRegistry');
    const presence = getStore('presenceStore') || require('../store/presenceStore').default;
    return presence?.getState?.().socket || null;
  } catch (_error) {
    return null;
  }
}

function resolveServerUrl() {
  if (process.env.REACT_APP_SOCKET_URL) {
    return process.env.REACT_APP_SOCKET_URL;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://descension-mythrill.up.railway.app'
    : 'http://localhost:3001';
}

/**
 * Emit one ack-bearing request over the verified multiplayer socket.
 */
function requestServerEvent(event, payload, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const socket = getMultiplayerSocket();
    if (!socket || !socket.connected) {
      reject(new Error('Multiplayer connection unavailable'));
      return;
    }
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) {return;}
      settled = true;
      reject(new Error(`Server ${event} request timed out`));
    }, timeoutMs);
    socket.emit(event, payload, (response) => {
      if (settled) {return;}
      settled = true;
      clearTimeout(timer);
      if (response && response.success) {
        resolve(response);
      } else {
        const error = new Error((response && response.error) || `Server ${event} request failed`);
        error.code = response && response.code;
        reject(error);
      }
    });
  });
}

/**
 * Create a new permanent room in Firestore
 * @param {Object} roomData - Room configuration
 * @returns {Promise<string>} - Room ID
 */
export const createPersistentRoom = async (roomData) => {
 try {
  const { isDemoMode } = await import('../config/firebase');
  if (isDemoMode) {
   throw new Error('Room creation is disabled in Demo Mode. Please log in with a real account.');
  }
 } catch (e) { }

 if (!db || !auth?.currentUser) {
  throw new Error('Firebase not initialized or user not authenticated');
 }

 const userId = auth.currentUser.uid;

 const tier = await subscriptionService.getUserTier(userId);

 if (tier.id === 'guest') {
  throw new Error('Guest accounts cannot create rooms. Please create a free account to host games.');
 }

 if (tier.roomLimit <= 0) {
  throw new Error('Your plan does not allow room creation. Please upgrade your membership.');
 }

 // Project 4: safe draft creation is server-mediated. The server verifies the
 // durable account principal and refuses any id that already has a room root
 // or checkpoint fragments, so a new draft can never claim orphaned state.
 const maxPlayers = Math.min(roomData.maxPlayers || tier.maxPlayersPerRoom || 3, tier.maxPlayersPerRoom || 3);
 const response = await requestServerEvent('create_room_draft', {
  name: roomData.name,
  description: roomData.description || '',
  gmName: roomData.gmName || auth?.currentUser?.displayName || 'Game Master',
  settings: {
   maxPlayers,
   allowSpectators: roomData.allowSpectators || false
  }
 });
 if (!response.roomId) {
  throw new Error('Room draft creation did not return a room id');
 }
 return response.roomId;
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
  // Project 4: a permission denial is never reinterpreted as room absence.
  if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
   const denied = new Error('Room access denied; authorized state is delivered by the multiplayer server');
   denied.code = 'permission-denied';
   throw denied;
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
 throw new Error('Project 3: browser whole-room gameState writes are disabled; the server checkpoint writer owns shared room state');
};

/**
 * Add a chat message to room history
 * @param {string} roomId - Room ID
 * @param {Object} message - Chat message
 * @returns {Promise<void>}
 */
export const addChatMessage = async (_roomId, _message) => {
 // Project 4: canonical room chat is server-mediated. Direct chatHistory
 // writes to a raw room document are disabled.
 throw new Error('Project 4: room chat is server-mediated; use the chat socket events');
};

/**
 * Get user's rooms (where they are GM or member)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of room data
 */
/**
 * Project 4: verified owner/member room listing comes from the server
 * projection (metadata only; may include inactive entitled rooms). Raw room
 * documents are server-only and are never queried directly.
 */
export const getUserRooms = async (userId) => {
 // Check for demo/mock mode
 try {
  const { isDemoMode, isMockOrDevUser, auth } = await import('../config/firebase');
  if (isDemoMode || !userId || isMockOrDevUser(userId) || !auth?.currentUser) {
   return [];
  }
 } catch (error) {
  console.warn('Could not check demo mode:', error);
 }

 try {
  const response = await requestServerEvent('request_my_rooms', {});
  return Array.isArray(response.rooms) ? response.rooms : [];
 } catch (error) {
  console.warn('Could not load entitled rooms from the server:', error?.message || error);
  return [];
 }
};

/**
 * Join a room (add user to members)
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @param {string} password - Room password
 * @returns {Promise<Object>} - Room data or error
 */
export const joinRoom = async (_roomId, _userId, _password) => {
 // Project 4: durable membership is established by the server admission gate
 // during the join_room socket event, never by a direct Firestore members
 // write. This legacy helper performs no mutation.
 throw new Error('Project 4: room membership is established by the multiplayer server join, not by a client write');
};

/**
 * Leave a room (remove user from members)
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
/**
 * Explicit durable membership revocation by the account holder. Distinct from
 * leaving a session (leave_room), which preserves durable membership.
 */
export const leaveRoom = async (_roomId, _userId) => {
 return requestServerEvent('leave_room_membership', {});
};

/**
 * Update room metadata (name, description, password, etc.)
 * @param {string} roomId - Room ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateRoom = async (roomId, updates) => {
 // Project 3 metadata-only boundary: shared gameplay/checkpoint fields and
 // shared name/description/settings may never be written from the browser.
 // Canonical-room metadata changes must be accepted by the server and
 // checkpointed through P2. Checked before any environment gate so the
 // boundary is provable without a live Firebase.
 for (const key of Object.keys(updates || {})) {
  if (key === 'gameState' || key === 'checkpoint' || key.startsWith('gameState.') || key.startsWith('checkpoint.') ||
      key === 'name' || key === 'description' || key === 'settings' || key.startsWith('settings.')) {
   throw new Error(`Project 3: browser writes to shared room field "${key}" are disabled; shared room metadata must be checkpointed through the server`);
  }
 }

 if (!db) {
  throw new Error('Firebase not initialized');
 }

 try {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  await updateDoc(roomRef, {
   ...updates,
   lastModified: serverTimestamp(),
   lastActivity: serverTimestamp()
  });
 } catch (error) {
  console.error('❌ Error updating room:', error);
  throw error;
 }
};

/**
 * Project 3 server-mediated shared metadata boundary.
 *
 * Canonical room name/description/settings are accepted by the server on the
 * verified multiplayer socket and checkpointed through the selected P2/P3
 * writer; the browser never writes canonical Firestore metadata directly.
 *
 * @param {string} roomId - Canonical room ID
 * @param {{name?: string, description?: string|null, settings?: Object}} updates
 * @returns {Promise<Object>} server acknowledgement with truthful outcome
 */
export const requestRoomMetadataUpdate = (roomId, updates) => new Promise((resolve, reject) => {
 let socket = null;
 try {
  const { getStore } = require('../store/storeRegistry');
  const presence = getStore('presenceStore') || require('../store/presenceStore').default;
  socket = presence?.getState?.().socket || null;
 } catch (_error) {
  socket = null;
 }
 if (!socket || !socket.connected) {
  reject(new Error('Multiplayer connection unavailable for shared room metadata update'));
  return;
 }
 let settled = false;
 const timer = setTimeout(() => {
  if (settled) {return;}
  settled = true;
  reject(new Error('Shared room metadata update timed out'));
 }, 10000);
 socket.emit('update_room_metadata', { roomId, ...updates }, (response) => {
  if (settled) {return;}
  settled = true;
  clearTimeout(timer);
  if (response && response.success) {
   resolve(response);
  } else {
   reject(new Error((response && response.error) || 'Shared room metadata update failed'));
  }
 });
});

/**
 * Delete a room (only GM can do this)
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID (must be GM)
 * @returns {Promise<void>}
 */
/**
 * Canonical room deletion is a server-mediated owner operation (Project 4).
 * The browser cannot delete room documents or checkpoint fragments directly.
 */
export const deleteRoom = async (roomId, _userId) => {
 return requestServerEvent('delete_room', { roomId });
};

/**
 * Get public rooms (for discovery)
 * @param {number} limitCount - Maximum number of rooms to return
 * @returns {Promise<Array>} - Array of public room data
 */
/**
 * Project 4 public discovery: exact shallow server projection. Only rooms
 * whose owner explicitly opted in (settings.isPrivate === false) are listed.
 */
export const getPublicRooms = async (_limitCount = 20) => {
 const response = await fetch(`${resolveServerUrl()}/api/rooms`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
 });
 if (!response.ok) {
  throw new Error(`Room discovery failed (HTTP ${response.status})`);
 }
 return response.json();
};

/**
 * Save complete game state to room
 * @param {string} roomId - Room ID
 * @param {Object} gameState - Complete game state object
 * @returns {Promise<void>}
 */
export const saveCompleteGameState = async (roomId, gameState) => {
 throw new Error('Project 3: browser whole-room gameState writes are disabled; use the server explicit save request instead');
};

/**
 * Load complete game state from room
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} - Complete game state object
 */
export const loadCompleteGameState = async (_roomId) => {
 // Project 4: initialized room state is server-only. Entitled clients receive
 // a privacy projection over the verified multiplayer socket sync.
 throw new Error('Project 4: shared room state is delivered by the server; direct room-state reads are disabled');
};

/**
 * Update specific game state section
 * @param {string} roomId - Room ID
 * @param {string} section - Section name (e.g., 'tokens', 'levelEditor', 'combat')
 * @param {Object} sectionData - Section data
 * @returns {Promise<void>}
 */
export const updateGameStateSection = async (roomId, section, sectionData) => {
 throw new Error('Project 3: browser gameState section writes are disabled; the server checkpoint writer owns shared room state');
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
   // Import local room service to get local room count
   const { default: localRoomService } = await import('./localRoomService');
   const localRooms = localRoomService.getLocalRooms();
   const localRoomCount = localRooms.length;

   return {
    tier: { name: 'Demo', roomLimit: 999 },
    limit: 999,
    used: localRoomCount, // Include local rooms in demo mode
    remaining: 999 - localRoomCount,
    canCreate: true,
    rooms: [],
    localRooms: localRooms
   };
  }
 } catch (error) {
  console.warn('Could not check demo mode:', error);
 }

 const uid = userId || auth.currentUser?.uid;

 if (!uid) {
  // Not logged in - guest tier, but still count local rooms
  try {
   const { default: localRoomService } = await import('./localRoomService');
   const localRooms = localRoomService.getLocalRooms();
   const localRoomCount = localRooms.length;

   return {
    tier: await subscriptionService.getUserTier(null),
    limit: 0,
    used: localRoomCount, // Show local rooms even when not logged in
    remaining: 0,
    canCreate: false,
    localRooms: localRooms
   };
  } catch (error) {
   console.error('Error loading local rooms for guest user:', error);
   return {
    tier: await subscriptionService.getUserTier(null),
    limit: 0,
    used: 0,
    remaining: 0,
    canCreate: false
   };
  }
 }

 try {
  // Get both multiplayer and local rooms
  const [userRooms, localRoomService] = await Promise.all([
   getUserRooms(uid),
   import('./localRoomService').then(module => module.default)
  ]);

  const ownedRooms = userRooms.filter(room => room.userRole === 'gm');
  const localRooms = localRoomService.getLocalRooms();

  // Total used rooms = multiplayer rooms + local rooms
  const multiplayerRoomCount = ownedRooms.length;
  const localRoomCount = localRooms.length;
  const totalUsed = multiplayerRoomCount + localRoomCount;

  const tier = await subscriptionService.getUserTier(uid);
  const limit = tier.roomLimit;
  const remaining = Math.max(0, limit - totalUsed);

  return {
   tier: tier,
   limit: limit,
   used: totalUsed,
   remaining: remaining,
   canCreate: totalUsed < limit,
   rooms: ownedRooms,
   localRooms: localRooms,
   multiplayerCount: multiplayerRoomCount,
   localCount: localRoomCount
  };
 } catch (error) {
  console.error('Error getting room limits:', error);
  // Fallback to basic info, but still try to count local rooms
  try {
   const { default: localRoomService } = await import('./localRoomService');
   const localRooms = localRoomService.getLocalRooms();
   const localRoomCount = localRooms.length;

   const tier = await subscriptionService.getUserTier(uid);
   return {
    tier: tier,
    limit: tier.roomLimit,
    used: localRoomCount, // At least show local rooms
    remaining: Math.max(0, tier.roomLimit - localRoomCount),
    canCreate: localRoomCount < tier.roomLimit,
    rooms: [],
    localRooms: localRooms
   };
  } catch (localError) {
   console.error('Error loading local rooms in fallback:', localError);
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
 }
};

const roomService = {
 createPersistentRoom,
 getRoomData,
 updateRoomGameState,
 addChatMessage,
 getUserRooms,
 joinRoom,
 leaveRoom,
 deleteRoom,
 updateRoom,
 getPublicRooms,
 getRoomLimits,
 saveCompleteGameState,
 loadCompleteGameState,
 updateGameStateSection
};
export default roomService;
