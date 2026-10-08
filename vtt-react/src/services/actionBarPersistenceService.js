import { db } from '../config/firebase.js';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';
import { resolveActiveScope, captureConsumerContext, isConsumerContextCurrent } from '../persistence/scopedConsumer';
import { buildScopedKey, parseP5ScopedKey } from '../persistence/keyFormat';
import { readDurable } from '../persistence/protectedStorage';

const ACTION_BAR_STORAGE_PREFIX = 'mythrill-actionbar-';
const HOTKEY_STORAGE_PREFIX = 'mythrill-hotkeys-';

// Wave B (final sweep): action bars and hotkeys are authored private records in
// verified-owner scoped storage, keyed by character/room resource references.
// Character/room ids are never ownership proof; the legacy global keys are
// quarantined (verified copies) and never auto-adopted.
const actionBarFamily = createScopedNativeFamily({ familyId: 'character.actionBar' });
const hotkeyFamily = createScopedNativeFamily({ familyId: 'character.hotkeys' });

function listScopedFamilyRecords(familyId, characterId) {
  const records = {};
  const scope = resolveActiveScope();
  if (!scope || !characterId) return records;
  let prefix;
  try {
    prefix = `${buildScopedKey({ scope, familyId, locator: [String(characterId)] })}:`;
  } catch (_error) {
    return records;
  }
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(prefix)) continue;
      const parsed = parseP5ScopedKey(key);
      if (!parsed || parsed.familyId !== familyId || !parsed.segments || parsed.segments.length < 2) continue;
      const raw = readDurable(key);
      if (!raw.ok || raw.raw === null) continue;
      try {
        let value = JSON.parse(raw.raw);
        // Draft-envelope families store the payload inside the envelope.
        if (value && typeof value === 'object' && 'payload' in value) {
          value = value.payload;
        }
        records[parsed.segments[1]] = value;
      } catch (_error) {
        // malformed record: preserve raw, skip from listing
      }
    }
  } catch (_error) {
    // fail safe: listing is best-effort
  }
  return records;
}

function getAuthUser() {
  try {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      const user = parsed.state?.user;
      if (user && !user.isGuest) {
        return user;
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
}

function getFirebaseDocRef(characterId, roomId) {
  const user = getAuthUser();
  const scope = resolveActiveScope();
  // B9's verified local-room owner, not a leftover auth-storage marker,
  // determines whether this cloud destination may be used.
  if (!user || !db || scope?.scopeKind !== 'user' || scope.scopeId !== user.uid) return null;
  return doc(db, 'users', user.uid, 'actionBar', `${characterId}_${roomId}`);
}

class ActionBarPersistenceService {
  constructor() {
    this.cache = new Map();
    this.hotkeyCache = new Map();
  }

  /**
   * Generate storage key for character-room combination
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID (or 'global' for default)
   * @returns {string} Storage key
   */
  getStorageKey(characterId, roomId = 'global') {
    const scope = resolveActiveScope();
    const scopeTag = scope ? `${scope.scopeKind}:${scope.scopeId}` : 'none';
    return `${ACTION_BAR_STORAGE_PREFIX}${scopeTag}:${characterId}-${roomId}`;
  }

  /**
   * Save action bar configuration for a character in a specific room
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID
   * @param {Array} actionSlots - Array of action bar items
   * @returns {boolean} Success status
   */
  saveActionBarConfig(characterId, roomId, actionSlots) {
    if (!characterId || !actionSlots || !Array.isArray(actionSlots)) {
      console.warn('Invalid parameters for saving action bar config');
      return false;
    }

    try {
      const storageKey = this.getStorageKey(characterId, roomId);
      const configData = {
        characterId,
        roomId,
        actionSlots: actionSlots.map(slot => {
          if (!slot) return null;
          
          // Store essential data only to reduce storage size
          return {
            id: slot.id,
            name: slot.name,
            type: slot.type,
            icon: slot.icon,
            originalItemId: slot.originalItemId,
            maxCooldown: slot.maxCooldown,
            cooldown: 0, // Reset cooldown on save
            rarity: slot.rarity,
            description: slot.description,
            // Store spell-specific data if it's a spell
            ...(slot.type === 'spell' && {
              spellData: {
                damage: slot.damage,
                manaCost: slot.manaCost,
                castTime: slot.castTime,
                range: slot.range,
                duration: slot.duration,
                school: slot.school,
                level: slot.level
              }
            })
          };
        }),
        lastSaved: new Date().toISOString(),
        version: '1.0'
      };

      const writeResult = actionBarFamily.save(configData, [String(characterId), String(roomId || 'global')]);
      if (writeResult.status !== 'OK') {
        console.warn('Action bar save refused:', writeResult.status);
        return false;
      }
      this.cache.set(storageKey, configData);

      const firebaseRef = getFirebaseDocRef(characterId, roomId);
      if (firebaseRef) {
        setDoc(firebaseRef, configData, { merge: true }).catch((err) => {
          console.error('Error saving action bar to Firebase:', err);
        });
      }

      console.log(`💾 Action bar saved for character ${characterId} in room ${roomId}`);
      return true;
    } catch (error) {
      console.error('Error saving action bar config:', error);
      return false;
    }
  }

  /**
   * Load action bar configuration for a character in a specific room
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID
   * @returns {Array|null} Action slots array or null if not found
   */
  async loadActionBarConfig(characterId, roomId) {
    if (!characterId) {
      console.warn('Invalid character ID for loading action bar config');
      return null;
    }

    try {
      const storageKey = this.getStorageKey(characterId, roomId);

      if (this.cache.has(storageKey)) {
        const cached = this.cache.get(storageKey);
        console.log(`📋 Action bar loaded from cache for character ${characterId} in room ${roomId}`);
        return cached.actionSlots;
      }

      // B1: capture the verified destination before any await so a delayed
      // Firebase response can never populate a different account.
      const captured = captureConsumerContext();

      const firebaseRef = getFirebaseDocRef(characterId, roomId);
      if (firebaseRef) {
        try {
          const firebaseDoc = await getDoc(firebaseRef);
          if (!captured.ok || !isConsumerContextCurrent(captured.context)) {
            return null;
          }
          if (firebaseDoc.exists()) {
            const configData = firebaseDoc.data();
            if (configData.actionSlots && Array.isArray(configData.actionSlots)) {
              actionBarFamily.save(configData, [String(characterId), String(roomId || 'global')]);
              this.cache.set(storageKey, configData);
              console.log(`📋 Action bar loaded from Firebase for character ${characterId} in room ${roomId}`);
              return configData.actionSlots;
            }
          }
        } catch (err) {
          console.error('Error loading action bar from Firebase, falling back to localStorage:', err);
        }
      }

      if (!captured.ok || !isConsumerContextCurrent(captured.context)) {
        return null;
      }
      const configData = actionBarFamily.load([String(characterId), String(roomId || 'global')]);
      if (!configData) {
        if (roomId !== 'global') {
          console.log(`🔄 No room-specific config found, trying global config for character ${characterId}`);
          return await this.loadActionBarConfig(characterId, 'global');
        }
        return null;
      }

      if (!configData.actionSlots || !Array.isArray(configData.actionSlots)) {
        console.warn('Invalid action bar config data structure');
        return null;
      }

      this.cache.set(storageKey, configData);

      console.log(`📋 Action bar loaded for character ${characterId} in room ${roomId}`);
      return configData.actionSlots;
    } catch (error) {
      console.error('Error loading action bar config:', error);
      return null;
    }
  }

  /**
   * Copy action bar configuration from one room to another
   * @param {string} characterId - Character ID
   * @param {string} sourceRoomId - Source room ID
   * @param {string} targetRoomId - Target room ID
   * @returns {boolean} Success status
   */
  async copyActionBarConfig(characterId, sourceRoomId, targetRoomId) {
    const sourceConfig = await this.loadActionBarConfig(characterId, sourceRoomId);
    if (!sourceConfig) {
      console.warn(`No action bar config found for character ${characterId} in room ${sourceRoomId}`);
      return false;
    }

    return this.saveActionBarConfig(characterId, targetRoomId, sourceConfig);
  }

  /**
   * Delete action bar configuration for a character in a specific room
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID
   * @returns {boolean} Success status
   */
  deleteActionBarConfig(characterId, roomId) {
    try {
      const storageKey = this.getStorageKey(characterId, roomId);
      actionBarFamily.clear([String(characterId), String(roomId || 'global')]);
      this.cache.delete(storageKey);

      const firebaseRef = getFirebaseDocRef(characterId, roomId);
      if (firebaseRef) {
        deleteDoc(firebaseRef).catch((err) => {
          console.error('Error deleting action bar from Firebase:', err);
        });
      }

      console.log(`� - �️ Action bar config deleted for character ${characterId} in room ${roomId}`);
      return true;
    } catch (error) {
      console.error('Error deleting action bar config:', error);
      return false;
    }
  }

  /**
   * Get all action bar configurations for a character
   * @param {string} characterId - Character ID
   * @returns {Object} Object with roomId as keys and configs as values
   */
  getAllCharacterConfigs(characterId) {
    return listScopedFamilyRecords('character.actionBar', characterId);
  }

  /**
   * Get hotkey storage key for character-room combination
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID (or 'global' for default)
   * @returns {string} Storage key
   */
  getHotkeyStorageKey(characterId, roomId = 'global') {
    const scope = resolveActiveScope();
    const scopeTag = scope ? `${scope.scopeKind}:${scope.scopeId}` : 'none';
    return `${HOTKEY_STORAGE_PREFIX}${scopeTag}:${characterId}-${roomId}`;
  }

  /**
   * Save hotkey bindings for a character in a specific room
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID
   * @param {Object} hotkeys - Object mapping slot indices to hotkey strings
   * @returns {boolean} Success status
   */
  saveHotkeys(characterId, roomId, hotkeys) {
    if (!characterId) {
      console.warn('Invalid character ID for saving hotkeys');
      return false;
    }

    try {
      const storageKey = this.getHotkeyStorageKey(characterId, roomId);
      const hotkeyData = {
        characterId,
        roomId,
        hotkeys,
        lastSaved: new Date().toISOString(),
        version: '1.0'
      };

      const hotkeyWrite = hotkeyFamily.save(hotkeyData, [String(characterId), String(roomId || 'global')]);
      if (hotkeyWrite.status !== 'OK') {
        console.warn('Hotkey save refused:', hotkeyWrite.status);
        return false;
      }
      this.hotkeyCache.set(storageKey, hotkeyData);

      console.log(`⌨️ Hotkeys saved for character ${characterId} in room ${roomId}`);
      return true;
    } catch (error) {
      console.error('Error saving hotkeys:', error);
      return false;
    }
  }

  /**
   * Load hotkey bindings for a character in a specific room
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID
   * @returns {Object|null} Hotkey bindings object or null if not found
   */
  loadHotkeys(characterId, roomId) {
    if (!characterId) {
      console.warn('Invalid character ID for loading hotkeys');
      return null;
    }

    try {
      const storageKey = this.getHotkeyStorageKey(characterId, roomId);

      // Check cache first
      if (this.hotkeyCache.has(storageKey)) {
        const cached = this.hotkeyCache.get(storageKey);
        console.log(`⌨️ Hotkeys loaded from cache for character ${characterId} in room ${roomId}`);
        return cached.hotkeys;
      }

      // Load from verified-owner scoped storage
      const hotkeyData = hotkeyFamily.load([String(characterId), String(roomId || 'global')]);
      if (!hotkeyData) {
        // Try to load global hotkeys as fallback
        if (roomId !== 'global') {
          console.log(`🔄 No room-specific hotkeys found, trying global hotkeys for character ${characterId}`);
          return this.loadHotkeys(characterId, 'global');
        }
        return null;
      }

      // Validate data structure
      if (!hotkeyData.hotkeys || typeof hotkeyData.hotkeys !== 'object') {
        console.warn('Invalid hotkey data structure');
        return null;
      }

      // Update cache
      this.hotkeyCache.set(storageKey, hotkeyData);

      console.log(`⌨️ Hotkeys loaded for character ${characterId} in room ${roomId}`);
      return hotkeyData.hotkeys;
    } catch (error) {
      console.error('Error loading hotkeys:', error);
      return null;
    }
  }

  /**
   * Delete hotkey bindings for a character in a specific room
   * @param {string} characterId - Character ID
   * @param {string} roomId - Room ID
   * @returns {boolean} Success status
   */
  deleteHotkeys(characterId, roomId) {
    try {
      const storageKey = this.getHotkeyStorageKey(characterId, roomId);
      hotkeyFamily.clear([String(characterId), String(roomId || 'global')]);
      this.hotkeyCache.delete(storageKey);

      console.log(`� - �️ Hotkeys deleted for character ${characterId} in room ${roomId}`);
      return true;
    } catch (error) {
      console.error('Error deleting hotkeys:', error);
      return false;
    }
  }

  /**
   * Clean up old or invalid action bar configurations
   * @param {number} maxAge - Maximum age in days (default: 30)
   */
  cleanupOldConfigs(maxAge = 30) {
    // Wave B: authored action-bar/hotkey records are verified-owner scoped.
    // Age-based cleanup never deletes authored work; this is now a no-op.
    void maxAge;
    return 0;
  }

  /**
   * Get storage usage statistics
   * @returns {Object} Storage statistics
   */
  getStorageStats() {
    let totalConfigs = 0;
    let totalSize = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith('mythrill:p5:')) continue;
        if (key.includes(':character.actionBar') || key.includes(':character.hotkeys')) {
          totalConfigs++;
          const value = localStorage.getItem(key);
          totalSize += key.length + (value ? value.length : 0);
        }
      }
    } catch (error) {
      console.error('Error calculating storage stats:', error);
    }
    
    return {
      totalConfigs,
      totalSize,
      averageSize: totalConfigs > 0 ? Math.round(totalSize / totalConfigs) : 0
    };
  }
}

// Create singleton instance
const actionBarPersistenceService = new ActionBarPersistenceService();

export default actionBarPersistenceService;
