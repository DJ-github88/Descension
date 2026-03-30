/**
 * User Maps Service
 *
 * Manages user-created custom maps in Firebase Firestore.
 * Maps are tied to user accounts and persist across sessions/devices.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode } from '../../config/firebase';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';

// Collection names
const COLLECTIONS = {
  USER_MAPS: 'userMaps',
  USER_FOLDERS: 'userMapFolders', // Personal folder structure for organizing maps
  USERS: 'users'
};

/**
 * Check if Firebase is available
 */
function checkFirebaseAvailable() {
  if (!isFirebaseConfigured || isDemoMode || !db) {
    console.warn('Firebase not configured or in demo mode');
    return false;
  }
  return true;
}

/**
 * Save a custom map for a user
 */
export async function saveUserMap(userId, mapData) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Generate map ID if not provided
    const mapId = mapData.id || `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare map document
    const mapDocument = {
      ...mapData,
      id: mapId,
      userId,
      folderId: mapData.folderId || null, // Reference to folder if organized
      createdAt: mapData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isCustom: true,
      isShared: false, // Set to true when shared to community
      source: mapData.source || 'editor'
    };

    // Save to user_maps collection
    const mapRef = doc(db, COLLECTIONS.USER_MAPS, mapId);

    // Sanitize map document to remove undefined values
    const sanitizedMap = sanitizeForFirestore(mapDocument);

    await setDoc(mapRef, sanitizedMap);

    // Update user's map list
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        customMaps: arrayUnion(mapId),
        updatedAt: serverTimestamp()
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        customMaps: [mapId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, mapId, localOnly: false };

  } catch (error) {
    console.error('Error saving map to Firebase:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Load all custom maps for a user
 */
export async function loadUserMaps(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return [];
    }

    if (!userId) {
      return [];
    }

    // Query all maps for this user
    const mapsQuery = query(
      collection(db, COLLECTIONS.USER_MAPS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(mapsQuery);
    const maps = [];

    querySnapshot.forEach((doc) => {
      maps.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return maps;

  } catch (error) {
    console.error('Error loading user maps:', error);
    return [];
  }
}

/**
 * Update an existing map
 */
export async function updateUserMap(userId, mapId, updates) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId || !mapId) {
      throw new Error('User ID and Map ID are required');
    }

    // Get the map to verify ownership
    const mapRef = doc(db, COLLECTIONS.USER_MAPS, mapId);
    const mapDoc = await getDoc(mapRef);

    if (!mapDoc.exists()) {
      throw new Error('Map not found');
    }

    const mapData = mapDoc.data();
    if (mapData.userId !== userId) {
      throw new Error('Access denied: Map does not belong to user');
    }

    // Update the map
    // Sanitize updates to remove undefined values
    const sanitizedUpdates = sanitizeForFirestore(updates);

    await updateDoc(mapRef, {
      ...sanitizedUpdates,
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error updating map:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Delete a map
 */
export async function deleteUserMap(userId, mapId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId || !mapId) {
      throw new Error('User ID and Map ID are required');
    }

    // Get the map to verify ownership
    const mapRef = doc(db, COLLECTIONS.USER_MAPS, mapId);
    const mapDoc = await getDoc(mapRef);

    if (!mapDoc.exists()) {
      throw new Error('Map not found');
    }

    const mapData = mapDoc.data();
    if (mapData.userId !== userId) {
      throw new Error('Access denied: Map does not belong to user');
    }

    // Delete the map
    await deleteDoc(mapRef);

    // Remove from user's map list
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      customMaps: arrayRemove(mapId),
      updatedAt: serverTimestamp()
    });

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error deleting map:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Get a single map by ID
 */
export async function getUserMap(userId, mapId) {
  try {
    if (!checkFirebaseAvailable()) {
      return null;
    }

    const mapRef = doc(db, COLLECTIONS.USER_MAPS, mapId);
    const mapDoc = await getDoc(mapRef);

    if (!mapDoc.exists()) {
      return null;
    }

    const mapData = mapDoc.data();

    // Verify ownership
    if (mapData.userId !== userId) {
      throw new Error('Access denied: Map does not belong to user');
    }

    return {
      id: mapDoc.id,
      ...mapData
    };

  } catch (error) {
    console.error('Error getting map:', error);
    return null;
  }
}

/**
 * Sync local maps to Firebase
 * Used when a user logs in to upload any maps created while offline
 */
export async function syncLocalMapsToFirebase(userId, localMaps) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, synced: 0 };
    }

    if (!userId || !localMaps || localMaps.length === 0) {
      return { success: true, synced: 0 };
    }

    let syncedCount = 0;
    const errors = [];

    for (const map of localMaps) {
      try {
        // Only sync maps that don't have a userId or have the current userId
        if (!map.userId || map.userId === userId) {
          await saveUserMap(userId, map);
          syncedCount++;
        }
      } catch (error) {
        console.error(`Failed to sync map ${map.id}:`, error);
        errors.push({ mapId: map.id, error: error.message });
      }
    }

    return { success: true, synced: syncedCount, errors };

  } catch (error) {
    console.error('Error syncing maps:', error);
    return { success: false, synced: 0, error: error.message };
  }
}

/**
 * ========================================
 * PERSONAL FOLDER SYSTEM
 * Users can organize maps in folders with sub-folders
 * ========================================
 */

/**
 * Get all folders for a user (with nested sub-folders)
 */
export async function getUserMapFolders(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return [];
    }

    if (!userId) {
      return [];
    }

    const foldersRef = collection(db, COLLECTIONS.USER_FOLDERS);
    const q = query(
      foldersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    const folders = [];

    snapshot.forEach((doc) => {
      folders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return folders;
  } catch (error) {
    console.error('Error loading user map folders:', error);
    return [];
  }
}

/**
 * Create a new folder for a user
 */
export async function createUserMapFolder(userId, folderData) {
  try {
    if (!checkFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    const foldersRef = collection(db, COLLECTIONS.USER_FOLDERS);
    const newFolder = {
      userId,
      name: folderData.name,
      description: folderData.description || '',
      icon: folderData.icon || 'inv_misc_bag_10',
      color: folderData.color || '#8b5cf6',
      parentFolderId: folderData.parentFolderId || null, // null = top level folder
      subFolders: [], // Array of sub-folder IDs
      mapIds: [], // Array of map IDs in this folder
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(foldersRef, newFolder);

    // If this is a sub-folder, update parent folder
    if (folderData.parentFolderId) {
      const parentRef = doc(db, COLLECTIONS.USER_FOLDERS, folderData.parentFolderId);
      const parentDoc = await getDoc(parentRef);

      if (parentDoc.exists() && parentDoc.data().userId === userId) {
        await updateDoc(parentRef, {
          subFolders: arrayUnion(docRef.id),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return {
      id: docRef.id,
      ...newFolder
    };
  } catch (error) {
    console.error('Error creating map folder:', error);
    throw error;
  }
}

/**
 * Move a map to a folder
 */
export async function moveMapToFolder(userId, mapId, folderId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    // Verify map ownership
    const mapRef = doc(db, COLLECTIONS.USER_MAPS, mapId);
    const mapDoc = await getDoc(mapRef);

    if (!mapDoc.exists() || mapDoc.data().userId !== userId) {
      throw new Error('Map not found or access denied');
    }

    // Remove map from previous folder if any
    const allFolders = await getUserMapFolders(userId);
    for (const folder of allFolders) {
      if (folder.mapIds && folder.mapIds.includes(mapId)) {
        const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folder.id);
        await updateDoc(folderRef, {
          mapIds: arrayRemove(mapId),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Add map to new folder (if folderId is provided, null = root/unorganized)
    if (folderId) {
      const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folderId);
      const folderDoc = await getDoc(folderRef);

      if (!folderDoc.exists() || folderDoc.data().userId !== userId) {
        throw new Error('Folder not found or access denied');
      }

      await updateDoc(folderRef, {
        mapIds: arrayUnion(mapId),
        updatedAt: new Date().toISOString()
      });
    }

    // Update map with folder reference
    await updateDoc(mapRef, {
      folderId: folderId || null,
      updatedAt: new Date().toISOString()
    });

    return { success: true, localOnly: false };
  } catch (error) {
    console.error('Error moving map to folder:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Share a map to the community
 * This creates a copy in community_maps and marks the original as shared
 */
export async function shareMapToCommunity(userId, mapId) {
  try {
    if (!checkFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    if (!userId || !mapId) {
      throw new Error('User ID and Map ID are required');
    }

    // Get the user's map
    const mapRef = doc(db, COLLECTIONS.USER_MAPS, mapId);
    const mapDoc = await getDoc(mapRef);

    if (!mapDoc.exists() || mapDoc.data().userId !== userId) {
      throw new Error('Map not found or access denied');
    }

    const mapData = mapDoc.data();

    // Check if already shared
    if (mapData.isShared) {
      throw new Error('Map is already shared to the community');
    }

    // Import community service to add map
    const { uploadMap } = await import('./communityMapService');

    // Prepare map for community (remove folder references, add community metadata)
    const communityMap = {
      ...mapData,
      originalMapId: mapId, // Reference back to user's map
      originalUserId: userId,
      isPublic: true,
      isFeatured: false,
      isShared: true
    };

    // Remove user-specific fields
    delete communityMap.folderId;
    delete communityMap.isCustom;

    // Upload to community
    const sharedMap = await uploadMap(communityMap, userId);

    // Mark original map as shared
    await updateDoc(mapRef, {
      isShared: true,
      sharedMapId: sharedMap.id, // Reference to community map
      sharedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, sharedMapId: sharedMap.id };
  } catch (error) {
    console.error('Error sharing map to community:', error);
    throw error;
  }
}
