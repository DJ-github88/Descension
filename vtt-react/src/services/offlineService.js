/**
 * Offline Support Service
 *
 * Manages offline data storage, synchronization, and conflict resolution
 * Provides seamless offline editing with automatic sync when online
 */

import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Offline storage keys
const OFFLINE_STORAGE = {
  CHARACTERS: 'offline_characters',
  MAPS: 'offline_maps',
  ACTION_QUEUE: 'offline_action_queue',
  SYNC_STATUS: 'offline_sync_status',
  LAST_SYNC: 'offline_last_sync'
};

/**
 * Check if the user is currently online
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Get offline storage data
 */
function getOfflineData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading offline data:', error);
    return null;
  }
}

/**
 * Set offline storage data
 */
function setOfflineData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing offline data:', error);
  }
}

/**
 * Clear offline data for a specific key
 */
function clearOfflineData(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing offline data:', error);
  }
}

/**
 * Initialize offline support
 */
export function initializeOfflineSupport(userId) {
  // Set up online/offline event listeners
  window.addEventListener('online', () => handleOnlineStatusChange(userId, true));
  window.addEventListener('offline', () => handleOnlineStatusChange(userId, false));

  // Initialize sync status
  const syncStatus = getOfflineData(OFFLINE_STORAGE.SYNC_STATUS) || {
    isOnline: isOnline(),
    lastSyncAttempt: null,
    lastSuccessfulSync: null,
    pendingActions: 0,
    conflicts: []
  };

  setOfflineData(OFFLINE_STORAGE.SYNC_STATUS, syncStatus);

  // Initialize action queue if it doesn't exist
  if (!getOfflineData(OFFLINE_STORAGE.ACTION_QUEUE)) {
    setOfflineData(OFFLINE_STORAGE.ACTION_QUEUE, []);
  }

  // Initialize offline data stores
  [OFFLINE_STORAGE.CHARACTERS, OFFLINE_STORAGE.MAPS].forEach(key => {
    if (!getOfflineData(key)) {
      setOfflineData(key, {});
    }
  });

  console.log('Offline support initialized');
}

/**
 * Handle online/offline status changes
 */
async function handleOnlineStatusChange(userId, isNowOnline) {
  const syncStatus = getOfflineData(OFFLINE_STORAGE.SYNC_STATUS) || {};
  syncStatus.isOnline = isNowOnline;
  setOfflineData(OFFLINE_STORAGE.SYNC_STATUS, syncStatus);

  if (isNowOnline) {
    console.log('🔄 Back online - starting sync process');
    await syncOfflineData(userId);
  } else {
    console.log('📴 Gone offline - switching to offline mode');
  }
}

/**
 * Store character data for offline editing
 */
export function storeCharacterOffline(characterId, characterData) {
  const offlineCharacters = getOfflineData(OFFLINE_STORAGE.CHARACTERS) || {};
  offlineCharacters[characterId] = {
    ...characterData,
    lastModified: new Date().toISOString(),
    offline: true,
    syncStatus: 'pending'
  };
  setOfflineData(OFFLINE_STORAGE.CHARACTERS, offlineCharacters);

  console.log(`💾 Character ${characterId} stored offline`);
}

/**
 * Get character data (checks offline storage first, then online)
 */
export async function getCharacterData(characterId, userId) {
  // Check offline storage first
  const offlineCharacters = getOfflineData(OFFLINE_STORAGE.CHARACTERS) || {};
  if (offlineCharacters[characterId]) {
    return {
      ...offlineCharacters[characterId],
      source: 'offline'
    };
  }

  // If online, try to fetch from Firebase
  if (isOnline()) {
    try {
      const characterDoc = await getDoc(doc(db, 'characters', characterId));
      if (characterDoc.exists()) {
        const data = characterDoc.data();
        return {
          ...data,
          source: 'online'
        };
      }
    } catch (error) {
      console.error('Error fetching character online:', error);
    }
  }

  return null;
}

/**
 * Update character data (works offline and queues sync)
 */
export async function updateCharacterData(characterId, updates, userId) {
  const timestamp = new Date().toISOString();

  // Store offline first
  const offlineCharacters = getOfflineData(OFFLINE_STORAGE.CHARACTERS) || {};
  if (!offlineCharacters[characterId]) {
    // Load existing character data if not already offline
    const existingData = await getCharacterData(characterId, userId);
    if (existingData) {
      offlineCharacters[characterId] = existingData;
    } else {
      offlineCharacters[characterId] = {};
    }
  }

  // Apply updates
  offlineCharacters[characterId] = {
    ...offlineCharacters[characterId],
    ...updates,
    id: characterId,
    lastModified: timestamp,
    offline: true,
    syncStatus: 'pending'
  };

  setOfflineData(OFFLINE_STORAGE.CHARACTERS, offlineCharacters);

  // Queue sync action if online
  if (isOnline()) {
    await queueAction('update_character', {
      characterId,
      updates,
      timestamp
    }, userId);
  }

  console.log(`📝 Character ${characterId} updated offline`);
}


/**
 * Queue an action for later synchronization
 */
export async function queueAction(actionType, actionData, userId) {
  const actionQueue = getOfflineData(OFFLINE_STORAGE.ACTION_QUEUE) || [];
  const action = {
    id: `${actionType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: actionType,
    data: actionData,
    timestamp: new Date().toISOString(),
    userId,
    status: 'queued'
  };

  actionQueue.push(action);
  setOfflineData(OFFLINE_STORAGE.ACTION_QUEUE, actionQueue);

  // Update sync status
  const syncStatus = getOfflineData(OFFLINE_STORAGE.SYNC_STATUS) || {};
  syncStatus.pendingActions = actionQueue.length;
  setOfflineData(OFFLINE_STORAGE.SYNC_STATUS, syncStatus);

  console.log(`📋 Action queued: ${actionType}`);
}

/**
 * Process queued actions when coming back online
 */
async function processActionQueue(userId) {
  const actionQueue = getOfflineData(OFFLINE_STORAGE.ACTION_QUEUE) || [];
  if (actionQueue.length === 0) return;

  console.log(`🔄 Processing ${actionQueue.length} queued actions`);

  const processedActions = [];
  const failedActions = [];

  for (const action of actionQueue) {
    try {
      await processQueuedAction(action);
      processedActions.push(action.id);
      action.status = 'completed';
    } catch (error) {
      console.error(`Failed to process action ${action.id}:`, error);
      action.status = 'failed';
      action.error = error.message;
      failedActions.push(action);
    }
  }

  // Update queue with results
  const updatedQueue = actionQueue.filter(action =>
    !processedActions.includes(action.id)
  );

  setOfflineData(OFFLINE_STORAGE.ACTION_QUEUE, [...updatedQueue, ...failedActions]);

  // Update sync status
  const syncStatus = getOfflineData(OFFLINE_STORAGE.SYNC_STATUS) || {};
  syncStatus.pendingActions = updatedQueue.length;
  syncStatus.lastSyncAttempt = new Date().toISOString();
  if (processedActions.length > 0 && failedActions.length === 0) {
    syncStatus.lastSuccessfulSync = new Date().toISOString();
  }
  setOfflineData(OFFLINE_STORAGE.SYNC_STATUS, syncStatus);

  console.log(`✅ Processed ${processedActions.length} actions, ${failedActions.length} failed`);
}

/**
 * Process a single queued action
 */
async function processQueuedAction(action) {
  switch (action.type) {
    case 'update_character':
      await setDoc(doc(db, 'characters', action.data.characterId), {
        ...action.data.updates,
        lastModified: action.data.timestamp
      }, { merge: true });
      break;

    case 'create_room':
      // Handle room creation
      break;

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

/**
 * Sync offline data with online storage
 */
export async function syncOfflineData(userId) {
  if (!isOnline()) {
    console.log('📴 Skipping sync - offline');
    return;
  }

  console.log('🔄 Starting offline data sync');

  try {
    // Process action queue first
    await processActionQueue(userId);

    // Sync offline characters
    const offlineCharacters = getOfflineData(OFFLINE_STORAGE.CHARACTERS) || {};
    for (const [characterId, characterData] of Object.entries(offlineCharacters)) {
      if (characterData.syncStatus === 'pending') {
        try {
          await setDoc(doc(db, 'characters', characterId), {
            ...characterData,
            offline: false,
            syncStatus: 'synced',
            lastSynced: new Date().toISOString()
          }, { merge: true });

          // Mark as synced offline
          characterData.syncStatus = 'synced';
          characterData.lastSynced = new Date().toISOString();
        } catch (error) {
          console.error(`Failed to sync character ${characterId}:`, error);
          characterData.syncStatus = 'error';
          characterData.syncError = error.message;
        }
      }
    }
    setOfflineData(OFFLINE_STORAGE.CHARACTERS, offlineCharacters);

    // Update last sync timestamp
    setOfflineData(OFFLINE_STORAGE.LAST_SYNC, new Date().toISOString());

    console.log('✅ Offline data sync completed');

  } catch (error) {
    console.error('Offline data sync failed:', error);
  }
}

/**
 * Get offline sync status
 */
export function getOfflineSyncStatus() {
  const syncStatus = getOfflineData(OFFLINE_STORAGE.SYNC_STATUS) || {
    isOnline: isOnline(),
    pendingActions: 0,
    conflicts: []
  };

  const actionQueue = getOfflineData(OFFLINE_STORAGE.ACTION_QUEUE) || [];
  syncStatus.pendingActions = actionQueue.length;

  return syncStatus;
}

/**
 * Clear all offline data (use with caution)
 */
export function clearAllOfflineData() {
  Object.values(OFFLINE_STORAGE).forEach(key => {
    clearOfflineData(key);
  });
  console.log('🧹 All offline data cleared');
}

/**
 * Get offline storage usage
 */
export function getOfflineStorageUsage() {
  let totalSize = 0;
  const usage = {};

  Object.entries(OFFLINE_STORAGE).forEach(([name, key]) => {
    const data = localStorage.getItem(key);
    if (data) {
      const size = new Blob([data]).size;
      usage[name] = size;
      totalSize += size;
    }
  });

  return {
    totalSize,
    breakdown: usage,
    formattedTotal: formatBytes(totalSize)
  };
}

/**
 * Format bytes for display
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
