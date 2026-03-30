/**
 * Character State Persistence Service
 *
 * Handles persistence of character runtime state:
 * - Health, mana, action points, exhaustion
 * - Inventory contents and positions
 * - Equipment state
 * - Quest progress
 * - Action bar configurations
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
 * Character State Persistence Service
 */
class CharacterStateService {

  /**
   * Save character runtime state
   */
  async saveCharacterState(userId, characterId, stateData) {
    if (!userId || !characterId) {
      throw new Error('User ID and Character ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'characterStates', characterId);

      const firestoreData = {
        // Basic state
        health: stateData.health,
        mana: stateData.mana,
        actionPoints: stateData.actionPoints,
        tempHealth: stateData.tempHealth || 0,
        tempMana: stateData.tempMana || 0,
        tempActionPoints: stateData.tempActionPoints || 0,
        exhaustionLevel: stateData.exhaustionLevel || 0,

        // Class-specific resources
        classResource: stateData.classResource,

        // Inventory state
        inventory: {
          items: stateData.inventory?.items || [],
          currency: stateData.inventory?.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
          encumbranceState: stateData.inventory?.encumbranceState || 'normal'
        },

        // Equipment state
        equipment: {
          weapon: stateData.equipment?.weapon || null,
          armor: stateData.equipment?.armor || null,
          shield: stateData.equipment?.shield || null,
          accessories: stateData.equipment?.accessories || []
        },

        // Action bar configuration (per room)
        actionBars: stateData.actionBars || {},

        // Quest progress
        questProgress: stateData.questProgress || {},

        // Skill system - proficiency ranks and quest progress
        skillRanks: stateData.skillRanks || {},
        skillProgress: stateData.skillProgress || {},
        skillPointsSpent: stateData.skillPointsSpent || 0,
        skillPointsAvailable: stateData.skillPointsAvailable || 0,

        // Metadata
        characterId,
        lastUpdated: serverTimestamp(),
        version: stateData.version || 1
      };

      await setDoc(docRef, firestoreData, { merge: true });

      return {
        success: true,
        characterId,
        size: new Blob([JSON.stringify(firestoreData)]).size
      };

    } catch (error) {
      console.error('Error saving character state:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load character runtime state
   */
  async loadCharacterState(userId, characterId) {
    if (!userId || !characterId) {
      return null;
    }

    try {
      const docRef = doc(db, 'users', userId, 'characterStates', characterId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      // Transform back to client format
      return {
        // Basic state
        health: data.health,
        mana: data.mana,
        actionPoints: data.actionPoints,
        tempHealth: data.tempHealth || 0,
        tempMana: data.tempMana || 0,
        tempActionPoints: data.tempActionPoints || 0,
        exhaustionLevel: data.exhaustionLevel || 0,

        // Class-specific resources
        classResource: data.classResource,

        // Inventory state
        inventory: data.inventory || {
          items: [],
          currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
          encumbranceState: 'normal'
        },

        // Equipment state
        equipment: data.equipment || {
          weapon: null,
          armor: null,
          shield: null,
          accessories: []
        },

        // Action bar configurations
        actionBars: data.actionBars || {},

        // Quest progress
        questProgress: data.questProgress || {},

        // Skill system data
        skillRanks: data.skillRanks || {},
        skillProgress: data.skillProgress || {},
        skillPointsSpent: data.skillPointsSpent || 0,
        skillPointsAvailable: data.skillPointsAvailable || 0,

        // Metadata
        lastUpdated: data.lastUpdated?.toDate?.() || new Date(data.lastUpdated),
        version: data.version || 1
      };

    } catch (error) {
      console.error('Error loading character state:', error);
      return null;
    }
  }

  /**
   * Save action bar configuration for a specific room
   */
  async saveActionBar(userId, characterId, roomId, actionSlots) {
    if (!userId || !characterId || !roomId) {
      throw new Error('User ID, Character ID, and Room ID are required');
    }

    try {
      const stateDocRef = doc(db, 'users', userId, 'characterStates', characterId);

      // Update the specific action bar for this room
      const updateData = {
        [`actionBars.${roomId}`]: actionSlots,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(stateDocRef, updateData);

      return {
        success: true,
        characterId,
        roomId,
        size: new Blob([JSON.stringify(actionSlots)]).size
      };

    } catch (error) {
      console.error('Error saving action bar:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load action bar configuration for a specific room
   */
  async loadActionBar(userId, characterId, roomId) {
    const stateData = await this.loadCharacterState(userId, characterId);
    return stateData?.actionBars?.[roomId] || null;
  }

  /**
   * Save quest progress for a character
   */
  async saveQuestProgress(userId, characterId, questData) {
    if (!userId || !characterId) {
      throw new Error('User ID and Character ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'characterStates', characterId);

      const updateData = {
        questProgress: questData,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return {
        success: true,
        characterId,
        size: new Blob([JSON.stringify(questData)]).size
      };

    } catch (error) {
      console.error('Error saving quest progress:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Load quest progress for a character
   */
  async loadQuestProgress(userId, characterId) {
    const stateData = await this.loadCharacterState(userId, characterId);
    return stateData?.questProgress || {};
  }

  /**
   * Update character health/mana/AP (quick updates)
   */
  async updateCharacterResources(userId, characterId, resources) {
    if (!userId || !characterId) {
      throw new Error('User ID and Character ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'characterStates', characterId);

      const updateData = {
        ...resources,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return { success: true };

    } catch (error) {
      console.error('Error updating character resources:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update character inventory
   */
  async updateCharacterInventory(userId, characterId, inventoryData) {
    if (!userId || !characterId) {
      throw new Error('User ID and Character ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'characterStates', characterId);

      const updateData = {
        inventory: inventoryData,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return {
        success: true,
        size: new Blob([JSON.stringify(inventoryData)]).size
      };

    } catch (error) {
      console.error('Error updating character inventory:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update character equipment
   */
  async updateCharacterEquipment(userId, characterId, equipmentData) {
    if (!userId || !characterId) {
      throw new Error('User ID and Character ID are required');
    }

    try {
      const docRef = doc(db, 'users', userId, 'characterStates', characterId);

      const updateData = {
        equipment: equipmentData,
        lastUpdated: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      return {
        success: true,
        size: new Blob([JSON.stringify(equipmentData)]).size
      };

    } catch (error) {
      console.error('Error updating character equipment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all character states for a user (for backup/export)
   */
  async getAllCharacterStates(userId) {
    if (!userId) return {};

    try {
      const collectionRef = collection(db, 'users', userId, 'characterStates');
      const querySnapshot = await getDocs(collectionRef);

      const states = {};
      querySnapshot.forEach((doc) => {
        states[doc.id] = doc.data();
      });

      return states;

    } catch (error) {
      console.error('Error getting all character states:', error);
      return {};
    }
  }

  /**
   * Delete character state data
   */
  async deleteCharacterState(userId, characterId) {
    if (!userId || !characterId) return;

    try {
      const docRef = doc(db, 'users', userId, 'characterStates', characterId);
      await deleteDoc(docRef);
      return { success: true };

    } catch (error) {
      console.error('Error deleting character state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete all character state data for a user
   */
  async deleteAllCharacterData(userId) {
    if (!userId) return;

    try {
      const states = await this.getAllCharacterStates(userId);
      const batch = writeBatch(db);

      Object.keys(states).forEach(characterId => {
        const docRef = doc(db, 'users', userId, 'characterStates', characterId);
        batch.delete(docRef);
      });

      await batch.commit();
      return { success: true };

    } catch (error) {
      console.error('Error deleting all character data:', error);
      return { success: false, error: error.message };
    }
  }
}

const characterStateService = new CharacterStateService();
export default characterStateService;
