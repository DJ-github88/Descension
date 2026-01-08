/**
 * Room State Persistence Service
 *
 * Handles persistence of room-specific data:
 * - Character and creature token placements
 * - Grid items (loot, containers, etc.)
 * - Environmental objects (chests, doors, portals, GM notes)
 * - Map data (terrain, walls, fog, lighting)
 * - Combat state
 * - Chat history
 * - Buffs and debuffs
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * Room State Persistence Service
 */
class RoomStateService {

  /**
   * Save complete room state
   */
  async saveRoomState(userId, roomId, roomState) {
    if (!userId || !roomId) {
      throw new Error('User ID and Room ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);

      const firestoreData = {
        // Token placements
        characterTokens: roomState.characterTokens || [],
        creatureTokens: roomState.creatureTokens || [],

        // Items on the grid
        gridItems: roomState.gridItems || [],

        // Environmental objects
        environmentalObjects: roomState.environmentalObjects || [],

        // Metadata
        roomId,
        lastUpdated: serverTimestamp(),
        version: roomState.version || 1
      };

      await setDoc(docRef, firestoreData, { merge: true });

      return {
        success: true,
        roomId,
        size: new Blob([JSON.stringify(firestoreData)]).size
      };

    } catch (error) {
      console.error('Error saving room state:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load room state
   */
  async loadRoomState(userId, roomId) {
    if (!userId || !roomId) {
      return null;
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      return {
        // Token placements
        characterTokens: data.characterTokens || [],
        creatureTokens: data.creatureTokens || [],

        // Items on the grid
        gridItems: data.gridItems || [],

        // Environmental objects
        environmentalObjects: data.environmentalObjects || [],

        // Metadata
        lastUpdated: data.lastUpdated?.toDate?.() || new Date(data.lastUpdated),
        version: data.version || 1
      };

    } catch (error) {
      console.error('Error loading room state:', error);
      return null;
    }
  }

  /**
   * Save map/environment data for a room
   */
  async saveMapData(userId, roomId, mapData) {
    if (!userId || !roomId) {
      throw new Error('User ID and Room ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);

      const firestoreData = {
        // Map and camera data
        mapData: {
          backgrounds: mapData.backgrounds || [],
          activeBackgroundId: mapData.activeBackgroundId || null,
          backgroundImage: mapData.backgroundImage || null,
          backgroundImageUrl: mapData.backgroundImageUrl || '',
          cameraX: mapData.cameraX || 0,
          cameraY: mapData.cameraY || 0,
          zoomLevel: mapData.zoomLevel || 1.0,
          gridSize: mapData.gridSize || 50,
          gridOffsetX: mapData.gridOffsetX || 0,
          gridOffsetY: mapData.gridOffsetY || 0
        },

        // Level editor data
        levelEditor: {
          terrainData: mapData.levelEditor?.terrainData || {},
          environmentalObjects: mapData.levelEditor?.environmentalObjects || [],
          wallData: mapData.levelEditor?.wallData || {},
          dndElements: mapData.levelEditor?.dndElements || [],
          fogOfWarData: mapData.levelEditor?.fogOfWarData || {},
          fogOfWarPaths: mapData.levelEditor?.fogOfWarPaths || [],
          fogErasePaths: mapData.levelEditor?.fogErasePaths || [],
          exploredAreas: mapData.levelEditor?.exploredAreas || {},
          drawingPaths: mapData.levelEditor?.drawingPaths || [],
          drawingLayers: mapData.levelEditor?.drawingLayers || [],
          lightSources: mapData.levelEditor?.lightSources || {},
          dynamicFogEnabled: mapData.levelEditor?.dynamicFogEnabled !== false,
          respectLineOfSight: mapData.levelEditor?.respectLineOfSight !== false
        },

        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, firestoreData);

      return {
        success: true,
        roomId,
        size: new Blob([JSON.stringify(firestoreData)]).size
      };

    } catch (error) {
      console.error('Error saving map data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load map data for a room
   */
  async loadMapData(userId, roomId) {
    if (!userId || !roomId) {
      return null;
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      return {
        // Map and camera data
        backgrounds: data.mapData?.backgrounds || [],
        activeBackgroundId: data.mapData?.activeBackgroundId || null,
        backgroundImage: data.mapData?.backgroundImage || null,
        backgroundImageUrl: data.mapData?.backgroundImageUrl || '',
        cameraX: data.mapData?.cameraX || 0,
        cameraY: data.mapData?.cameraY || 0,
        zoomLevel: data.mapData?.zoomLevel || 1.0,
        gridSize: data.mapData?.gridSize || 50,
        gridOffsetX: data.mapData?.gridOffsetX || 0,
        gridOffsetY: data.mapData?.gridOffsetY || 0,

        // Level editor data
        levelEditor: data.levelEditor || {
          terrainData: {},
          environmentalObjects: [],
          wallData: {},
          dndElements: [],
          fogOfWarData: {},
          fogOfWarPaths: [],
          fogErasePaths: [],
          exploredAreas: {},
          drawingPaths: [],
          drawingLayers: [],
          lightSources: {},
          dynamicFogEnabled: true,
          respectLineOfSight: true
        }
      };

    } catch (error) {
      console.error('Error loading map data:', error);
      return null;
    }
  }

  /**
   * Save combat state for a room
   */
  async saveCombatState(userId, roomId, combatState) {
    if (!userId || !roomId) {
      throw new Error('User ID and Room ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);

      const firestoreData = {
        combat: {
          isActive: combatState.isActive || false,
          currentTurn: combatState.currentTurn || 0,
          turnOrder: combatState.turnOrder || [],
          round: combatState.round || 0,
          combatLog: combatState.combatLog || []
        },
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, firestoreData);

      return {
        success: true,
        roomId,
        size: new Blob([JSON.stringify(firestoreData)]).size
      };

    } catch (error) {
      console.error('Error saving combat state:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load combat state for a room
   */
  async loadCombatState(userId, roomId) {
    if (!userId || !roomId) {
      return null;
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      return data.combat || {
        isActive: false,
        currentTurn: 0,
        turnOrder: [],
        round: 0,
        combatLog: []
      };

    } catch (error) {
      console.error('Error loading combat state:', error);
      return null;
    }
  }

  /**
   * Save buffs and debuffs for a room
   */
  async saveBuffsAndDebuffs(userId, roomId, buffsData) {
    if (!userId || !roomId) {
      throw new Error('User ID and Room ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);

      const firestoreData = {
        buffsAndDebuffs: {
          buffs: buffsData.buffs || [],
          debuffs: buffsData.debuffs || []
        },
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, firestoreData);

      return {
        success: true,
        roomId,
        size: new Blob([JSON.stringify(firestoreData)]).size
      };

    } catch (error) {
      console.error('Error saving buffs and debuffs:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load buffs and debuffs for a room
   */
  async loadBuffsAndDebuffs(userId, roomId) {
    if (!userId || !roomId) {
      return null;
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      return data.buffsAndDebuffs || {
        buffs: [],
        debuffs: []
      };

    } catch (error) {
      console.error('Error loading buffs and debuffs:', error);
      return null;
    }
  }

  /**
   * Save chat history for a room
   */
  async saveChatHistory(userId, roomId, chatData) {
    if (!userId || !roomId) {
      throw new Error('User ID and Room ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);

      // Keep only last 100 messages per chat type to prevent storage bloat
      const limitedChatData = {
        party: (chatData.party || []).slice(-100),
        whispers: chatData.whispers || {},
        combat: (chatData.combat || []).slice(-50),
        loot: (chatData.loot || []).slice(-50)
      };

      const firestoreData = {
        chatHistory: limitedChatData,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, firestoreData);

      return {
        success: true,
        roomId,
        size: new Blob([JSON.stringify(firestoreData)]).size
      };

    } catch (error) {
      console.error('Error saving chat history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load chat history for a room
   */
  async loadChatHistory(userId, roomId) {
    if (!userId || !roomId) {
      return null;
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      return data.chatHistory || {
        party: [],
        whispers: {},
        combat: [],
        loot: []
      };

    } catch (error) {
      console.error('Error loading chat history:', error);
      return null;
    }
  }

  /**
   * Update token positions (quick update for performance)
   */
  async updateTokenPositions(userId, roomId, tokenUpdates) {
    if (!userId || !roomId) {
      throw new Error('User ID and Room ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);

      const updateData = {};
      tokenUpdates.forEach(update => {
        if (update.type === 'character') {
          updateData[`characterTokens.${update.tokenId}.position`] = update.position;
        } else if (update.type === 'creature') {
          updateData[`creatureTokens.${update.tokenId}.position`] = update.position;
        }
      });

      updateData.lastUpdated = serverTimestamp();

      await updateDoc(docRef, updateData);

      return { success: true };

    } catch (error) {
      console.error('Error updating token positions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all room states for a user (for backup/export)
   */
  async getAllRoomStates(userId) {
    if (!userId) return {};

    try {
      const collectionRef = collection(db, 'users', userId, 'roomStates');
      const querySnapshot = await getDocs(collectionRef);

      const states = {};
      querySnapshot.forEach((doc) => {
        states[doc.id] = doc.data();
      });

      return states;

    } catch (error) {
      console.error('Error getting all room states:', error);
      return {};
    }
  }

  /**
   * Delete room state data
   */
  async deleteRoomState(userId, roomId) {
    if (!userId || !roomId) return;

    try {
      const docRef = doc(db, 'users', userId, 'roomStates', roomId);
      await deleteDoc(docRef);
      return { success: true };

    } catch (error) {
      console.error('Error deleting room state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete all room state data for a user
   */
  async deleteAllRoomData(userId) {
    if (!userId) return;

    try {
      const states = await this.getAllRoomStates(userId);
      const batch = writeBatch(db);

      Object.keys(states).forEach(roomId => {
        const docRef = doc(db, 'users', userId, 'roomStates', roomId);
        batch.delete(docRef);
      });

      await batch.commit();
      return { success: true };

    } catch (error) {
      console.error('Error deleting all room data:', error);
      return { success: false, error: error.message };
    }
  }
}

const roomStateService = new RoomStateService();
export default roomStateService;
