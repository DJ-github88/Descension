/**
 * Character Session Service
 * 
 * This service tracks character changes during gameplay sessions
 * and ensures they are properly saved back to the character's persistent data.
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode } from '../../config/firebase';
import characterPersistenceService from './characterPersistenceService';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';

// Import sync service for offline handling
let characterSyncService = null;
const getSyncService = async () => {
  if (!characterSyncService) {
    const module = await import('./characterSyncService');
    characterSyncService = module.default;
  }
  return characterSyncService;
};

// Collection names
const COLLECTIONS = {
  CHARACTER_SESSIONS: 'characterSessions',
  CHARACTERS: 'characters'
};

/**
 * Character Session Service Class
 */
class CharacterSessionService {
  constructor() {
    this.isConfigured = isFirebaseConfigured && !isDemoMode;
    this.activeSessions = new Map(); // Local cache of active sessions
  }

  /**
   * Start a new character session
   */
  async startSession(characterId, userId, roomId = null) {
    if (!this.isConfigured || !db || isDemoMode) {
      const reason = isDemoMode ? 'Demo mode enabled' : 'Firebase not configured';
      console.warn(`${reason}, using local session tracking`);
      // Create local session for offline mode
      const sessionId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.activeSessions.set(characterId, {
        id: sessionId,
        characterId,
        userId,
        roomId,
        startedAt: new Date(),
        changes: {
          inventory: { added: [], removed: [], modified: [] },
          currency: { gained: { platinum: 0, gold: 0, silver: 0, copper: 0 }, spent: { platinum: 0, gold: 0, silver: 0, copper: 0 } },
          experience: { gained: 0 },
          resources: { health: null, mana: null, actionPoints: null },
          stats: {},
          equipment: { equipped: [], unequipped: [] }
        },
        status: 'active',
        isLocal: true
      });
      console.log(`✅ Local character session created: ${sessionId} for character ${characterId} (${reason})`);
      return sessionId;
    }

    try {
      // Check if character already has an active session
      const existingSession = await this.getActiveSession(characterId);
      if (existingSession) {
        console.log(`Character ${characterId} already has active session: ${existingSession.id}`);
        return existingSession.id;
      }

      // Create new session document
      const sessionData = {
        characterId,
        userId,
        roomId,
        startedAt: serverTimestamp(),
        endedAt: null,
        changes: {
          inventory: { added: [], removed: [], modified: [] },
          currency: { gained: { platinum: 0, gold: 0, silver: 0, copper: 0 }, spent: { platinum: 0, gold: 0, silver: 0, copper: 0 } },
          experience: { gained: 0 },
          resources: { health: null, mana: null, actionPoints: null },
          stats: {},
          equipment: { equipped: [], unequipped: [] }
        },
        status: 'active'
      };

      // Sanitize session data to remove undefined values
      const sanitizedSessionData = sanitizeForFirestore(sessionData);

      const sessionRef = await addDoc(collection(db, COLLECTIONS.CHARACTER_SESSIONS), sanitizedSessionData);

      // Cache locally
      this.activeSessions.set(characterId, {
        id: sessionRef.id,
        ...sessionData,
        isLocal: false
      });

      console.log(`✅ Character session started: ${sessionRef.id} for character ${characterId}`);
      return sessionRef.id;

    } catch (error) {
      console.error('Error starting character session:', error);
      throw new Error(`Failed to start session: ${error.message}`);
    }
  }

  /**
   * Record a change during the session
   */
  async recordChange(characterId, changeType, changeData) {
    const session = this.activeSessions.get(characterId);
    if (!session) {
      console.warn(`No active session for character ${characterId}, change not recorded`);
      return false;
    }

    try {
      // Update local cache immediately
      this.applyChangeToSession(session, changeType, changeData);

      // If using Firebase, update the session document
      if (!session.isLocal && this.isConfigured && db) {
        try {
          const sessionRef = doc(db, COLLECTIONS.CHARACTER_SESSIONS, session.id);

          // Sanitize changes to remove undefined values
          const sanitizedChanges = sanitizeForFirestore(session.changes);

          await updateDoc(sessionRef, {
            changes: sanitizedChanges,
            lastUpdated: serverTimestamp()
          });
        } catch (firebaseError) {
          console.warn('Failed to update Firebase session, queuing for offline sync:', firebaseError);

          // Queue change for offline sync
          try {
            const syncService = await getSyncService();
            syncService.queueChange(characterId, changeType, changeData);
          } catch (syncError) {
            console.error('Failed to queue change for offline sync:', syncError);
          }
        }
      } else {
        // If not using Firebase or session is local, queue for sync when online
        try {
          const syncService = await getSyncService();
          syncService.queueChange(characterId, changeType, changeData);
        } catch (syncError) {
          console.error('Failed to queue change for offline sync:', syncError);
        }
      }

      console.log(`📝 Recorded ${changeType} change for character ${characterId}`);
      return true;

    } catch (error) {
      console.error('Error recording change:', error);
      return false;
    }
  }

  /**
   * Apply a change to the session data
   */
  applyChangeToSession(session, changeType, changeData) {
    switch (changeType) {
      case 'inventory_add':
        session.changes.inventory.added.push({
          ...changeData,
          timestamp: new Date()
        });
        break;

      case 'inventory_remove':
        session.changes.inventory.removed.push({
          ...changeData,
          timestamp: new Date()
        });
        break;

      case 'inventory_modify':
        session.changes.inventory.modified.push({
          ...changeData,
          timestamp: new Date()
        });
        break;

      case 'currency_gain':
        Object.keys(changeData).forEach(currencyType => {
          session.changes.currency.gained[currencyType] += changeData[currencyType] || 0;
        });
        break;

      case 'currency_spend':
        Object.keys(changeData).forEach(currencyType => {
          session.changes.currency.spent[currencyType] += changeData[currencyType] || 0;
        });
        break;

      case 'experience_gain':
        session.changes.experience.gained += changeData.amount || 0;
        break;

      case 'resource_change':
        session.changes.resources[changeData.type] = changeData.value;
        break;

      case 'stat_change':
        session.changes.stats[changeData.stat] = changeData.value;
        break;

      case 'equipment_equip':
        session.changes.equipment.equipped.push({
          ...changeData,
          timestamp: new Date()
        });
        break;

      case 'equipment_unequip':
        session.changes.equipment.unequipped.push({
          ...changeData,
          timestamp: new Date()
        });
        break;

      default:
        console.warn(`Unknown change type: ${changeType}`);
    }
  }

  /**
   * End a character session and apply changes
   */
  async endSession(characterId, userId) {
    const session = this.activeSessions.get(characterId);
    if (!session) {
      console.warn(`No active session for character ${characterId}`);
      return false;
    }

    try {
      // Load current character data
      const character = await characterPersistenceService.loadCharacter(characterId, userId);
      if (!character) {
        throw new Error('Character not found');
      }

      // Apply session changes to character
      const updatedCharacter = this.applySessionChangesToCharacter(character, session.changes);

      // Save updated character
      await characterPersistenceService.saveCharacter(updatedCharacter, userId);

      // Mark session as completed
      if (!session.isLocal && this.isConfigured && db) {
        const sessionRef = doc(db, COLLECTIONS.CHARACTER_SESSIONS, session.id);
        await updateDoc(sessionRef, {
          endedAt: serverTimestamp(),
          status: 'completed',
          finalChanges: sanitizeForFirestore(session.changes)
        });
      }

      // Remove from local cache
      this.activeSessions.delete(characterId);

      console.log(`✅ Character session ended and changes applied: ${session.id}`);
      return true;

    } catch (error) {
      console.error('Error ending character session:', error);

      // Mark session as failed but keep it for retry
      if (!session.isLocal && this.isConfigured && db) {
        try {
          const sessionRef = doc(db, COLLECTIONS.CHARACTER_SESSIONS, session.id);
          await updateDoc(sessionRef, {
            status: 'failed',
            error: error.message,
            lastAttempt: serverTimestamp()
          });
        } catch (updateError) {
          console.error('Error updating session status:', updateError);
        }
      }

      throw new Error(`Failed to end session: ${error.message}`);
    }
  }

  /**
   * Apply session changes to character data
   */
  applySessionChangesToCharacter(character, changes) {
    const updatedCharacter = { ...character };

    // Apply inventory changes
    if (changes.inventory) {
      // Add new items
      changes.inventory.added.forEach(item => {
        if (!updatedCharacter.inventory) updatedCharacter.inventory = { items: [] };
        updatedCharacter.inventory.items.push(item);
      });

      // Remove items
      changes.inventory.removed.forEach(removal => {
        if (updatedCharacter.inventory?.items) {
          updatedCharacter.inventory.items = updatedCharacter.inventory.items.filter(
            item => item.id !== removal.itemId
          );
        }
      });

      // Modify items
      changes.inventory.modified.forEach(modification => {
        if (updatedCharacter.inventory?.items) {
          const itemIndex = updatedCharacter.inventory.items.findIndex(
            item => item.id === modification.itemId
          );
          if (itemIndex !== -1) {
            updatedCharacter.inventory.items[itemIndex] = {
              ...updatedCharacter.inventory.items[itemIndex],
              ...modification.changes
            };
          }
        }
      });
    }

    // Apply currency changes
    if (changes.currency) {
      if (!updatedCharacter.inventory) updatedCharacter.inventory = {};
      if (!updatedCharacter.inventory.currency) {
        updatedCharacter.inventory.currency = { platinum: 0, gold: 0, silver: 0, copper: 0 };
      }

      // Add gained currency
      Object.keys(changes.currency.gained).forEach(currencyType => {
        updatedCharacter.inventory.currency[currencyType] += changes.currency.gained[currencyType];
      });

      // Subtract spent currency
      Object.keys(changes.currency.spent).forEach(currencyType => {
        updatedCharacter.inventory.currency[currencyType] -= changes.currency.spent[currencyType];
        // Ensure currency doesn't go negative
        if (updatedCharacter.inventory.currency[currencyType] < 0) {
          updatedCharacter.inventory.currency[currencyType] = 0;
        }
      });
    }

    // Apply experience changes
    if (changes.experience?.gained > 0) {
      updatedCharacter.experience = (updatedCharacter.experience || 0) + changes.experience.gained;
    }

    // Apply resource changes
    if (changes.resources) {
      if (!updatedCharacter.resources) updatedCharacter.resources = {};
      Object.keys(changes.resources).forEach(resourceType => {
        if (changes.resources[resourceType] !== null) {
          updatedCharacter.resources[resourceType] = changes.resources[resourceType];
        }
      });
    }

    // Apply stat changes
    if (changes.stats) {
      if (!updatedCharacter.stats) updatedCharacter.stats = {};
      Object.keys(changes.stats).forEach(stat => {
        updatedCharacter.stats[stat] = changes.stats[stat];
      });
    }

    // Apply equipment changes
    if (changes.equipment) {
      if (!updatedCharacter.equipment) updatedCharacter.equipment = {};

      // Handle equipped items
      changes.equipment.equipped.forEach(equip => {
        updatedCharacter.equipment[equip.slot] = equip.item;
      });

      // Handle unequipped items
      changes.equipment.unequipped.forEach(unequip => {
        if (updatedCharacter.equipment[unequip.slot]?.id === unequip.itemId) {
          updatedCharacter.equipment[unequip.slot] = null;
        }
      });
    }

    return updatedCharacter;
  }

  /**
   * Get active session for a character
   */
  async getActiveSession(characterId) {
    // Check local cache first
    const localSession = this.activeSessions.get(characterId);
    if (localSession) {
      return localSession;
    }

    if (!this.isConfigured || !db) {
      return null;
    }

    try {
      const sessionsQuery = query(
        collection(db, COLLECTIONS.CHARACTER_SESSIONS),
        where('characterId', '==', characterId),
        where('status', '==', 'active')
      );

      const querySnapshot = await getDocs(sessionsQuery);

      if (!querySnapshot.empty) {
        const sessionDoc = querySnapshot.docs[0];
        const sessionData = { id: sessionDoc.id, ...sessionDoc.data() };

        // Cache locally
        this.activeSessions.set(characterId, sessionData);

        return sessionData;
      }

      return null;

    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  /**
   * Force end all sessions for a character (cleanup)
   */
  async forceEndAllSessions(characterId, userId) {
    try {
      // End local session if exists
      if (this.activeSessions.has(characterId)) {
        await this.endSession(characterId, userId);
      }

      // End any Firebase sessions
      if (this.isConfigured && db) {
        const sessionsQuery = query(
          collection(db, COLLECTIONS.CHARACTER_SESSIONS),
          where('characterId', '==', characterId),
          where('status', '==', 'active')
        );

        const querySnapshot = await getDocs(sessionsQuery);

        for (const sessionDoc of querySnapshot.docs) {
          await updateDoc(sessionDoc.ref, {
            endedAt: serverTimestamp(),
            status: 'force_ended'
          });
        }
      }

      console.log(`✅ All sessions ended for character ${characterId}`);
      return true;

    } catch (error) {
      console.error('Error force ending sessions:', error);
      return false;
    }
  }
}

// Export singleton instance
const characterSessionService = new CharacterSessionService();
export default characterSessionService;
