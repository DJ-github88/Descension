/**
 * User Library Service
 * 
 * This service handles syncing user's downloaded community content across devices
 * and sessions using Firebase user documents. It manages the user's personal library
 * of downloaded items, creatures, and packs.
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  setDoc,
  writeBatch,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Collection names
const COLLECTIONS = {
  USER_LIBRARIES: 'user_libraries',
  USERS: 'users'
};

// Check if Firebase is available
function checkFirebaseAvailable() {
  return db !== null && db !== undefined;
}

/**
 * Get user's library data
 */
export async function getUserLibrary(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return {
        downloadedItems: [],
        downloadedCreatures: [],
        downloadedPacks: [],
        favorites: [],
        downloadHistory: [],
        lastSyncAt: null
      };
    }

    const userLibraryRef = doc(db, COLLECTIONS.USER_LIBRARIES, userId);
    const userLibraryDoc = await getDoc(userLibraryRef);
    
    if (!userLibraryDoc.exists()) {
      // Create new user library document
      const newLibrary = {
        userId,
        downloadedItems: [],
        downloadedCreatures: [],
        downloadedPacks: [],
        favorites: [],
        downloadHistory: [],
        createdAt: new Date(),
        lastSyncAt: new Date()
      };
      
      await setDoc(userLibraryRef, newLibrary);
      return newLibrary;
    }

    return {
      id: userLibraryDoc.id,
      ...userLibraryDoc.data()
    };
  } catch (error) {
    console.error('Error getting user library:', error);
    throw new Error('Failed to get user library');
  }
}

/**
 * Add downloaded item to user's library
 */
export async function addDownloadedItem(userId, itemData) {
  try {
    if (!checkFirebaseAvailable()) {
      return;
    }

    const userLibraryRef = doc(db, COLLECTIONS.USER_LIBRARIES, userId);
    const downloadEntry = {
      id: itemData.id,
      name: itemData.name,
      type: itemData.type,
      categoryId: itemData.categoryId,
      downloadedAt: new Date(),
      source: 'community'
    };

    const historyEntry = {
      type: 'item',
      action: 'download',
      itemId: itemData.id,
      itemName: itemData.name,
      timestamp: new Date()
    };

    await updateDoc(userLibraryRef, {
      downloadedItems: arrayUnion(downloadEntry),
      downloadHistory: arrayUnion(historyEntry),
      lastSyncAt: new Date()
    });
  } catch (error) {
    console.error('Error adding downloaded item:', error);
    throw new Error('Failed to add item to user library');
  }
}

/**
 * Add downloaded creature to user's library
 */
export async function addDownloadedCreature(userId, creatureData) {
  try {
    if (!checkFirebaseAvailable()) {
      return;
    }

    const userLibraryRef = doc(db, COLLECTIONS.USER_LIBRARIES, userId);
    const downloadEntry = {
      id: creatureData.id,
      name: creatureData.name,
      type: creatureData.type,
      categoryId: creatureData.categoryId,
      downloadedAt: new Date(),
      source: 'community'
    };

    const historyEntry = {
      type: 'creature',
      action: 'download',
      creatureId: creatureData.id,
      creatureName: creatureData.name,
      timestamp: new Date()
    };

    await updateDoc(userLibraryRef, {
      downloadedCreatures: arrayUnion(downloadEntry),
      downloadHistory: arrayUnion(historyEntry),
      lastSyncAt: new Date()
    });

  } catch (error) {
    console.error('Error adding downloaded creature:', error);
    throw new Error('Failed to add creature to user library');
  }
}

/**
 * Add downloaded pack to user's library
 */
export async function addDownloadedPack(userId, packData) {
  try {
    if (!checkFirebaseAvailable()) {
      return;
    }

    const userLibraryRef = doc(db, COLLECTIONS.USER_LIBRARIES, userId);
    const downloadEntry = {
      id: packData.id,
      name: packData.name,
      type: packData.type,
      version: packData.version,
      itemCount: packData.items?.length || 0,
      creatureCount: packData.creatures?.length || 0,
      downloadedAt: new Date(),
      source: 'community'
    };

    const historyEntry = {
      type: 'pack',
      action: 'download',
      packId: packData.id,
      packName: packData.name,
      timestamp: new Date()
    };

    await updateDoc(userLibraryRef, {
      downloadedPacks: arrayUnion(downloadEntry),
      downloadHistory: arrayUnion(historyEntry),
      lastSyncAt: new Date()
    });

  } catch (error) {
    console.error('Error adding downloaded pack:', error);
    throw new Error('Failed to add pack to user library');
  }
}

/**
 * Add item/creature/pack to favorites
 */
export async function addToFavorites(userId, contentType, contentId, contentName) {
  try {
    if (!checkFirebaseAvailable()) {
      return;
    }

    const userLibraryRef = doc(db, COLLECTIONS.USER_LIBRARIES, userId);
    const favoriteEntry = {
      type: contentType, // 'item', 'creature', or 'pack'
      id: contentId,
      name: contentName,
      addedAt: new Date()
    };

    await updateDoc(userLibraryRef, {
      favorites: arrayUnion(favoriteEntry),
      lastSyncAt: new Date()
    });

  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw new Error('Failed to add to favorites');
  }
}

/**
 * Remove from favorites
 */
export async function removeFromFavorites(userId, contentType, contentId) {
  try {
    if (!checkFirebaseAvailable()) {
      return;
    }

    // First get the current favorites to find the exact entry to remove
    const userLibrary = await getUserLibrary(userId);
    const favoriteToRemove = userLibrary.favorites.find(
      fav => fav.type === contentType && fav.id === contentId
    );

    if (favoriteToRemove) {
      const userLibraryRef = doc(db, COLLECTIONS.USER_LIBRARIES, userId);
      await updateDoc(userLibraryRef, {
        favorites: arrayRemove(favoriteToRemove),
        lastSyncAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw new Error('Failed to remove from favorites');
  }
}

/**
 * Get user's download history
 */
export async function getDownloadHistory(userId, limit = 50) {
  try {
    const userLibrary = await getUserLibrary(userId);
    
    // Sort by timestamp descending and limit results
    const history = userLibrary.downloadHistory || [];
    return history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting download history:', error);
    throw new Error('Failed to get download history');
  }
}

/**
 * Sync local library with Firebase
 */
export async function syncUserLibrary(userId, localLibraryData) {
  try {
    if (!checkFirebaseAvailable()) {
      return localLibraryData;
    }

    const userLibraryRef = doc(db, COLLECTIONS.USER_LIBRARIES, userId);
    
    // Get current Firebase library
    const firebaseLibrary = await getUserLibrary(userId);
    
    // Merge local and Firebase data (Firebase takes precedence for conflicts)
    const mergedLibrary = {
      ...localLibraryData,
      downloadedItems: mergeArrays(localLibraryData.downloadedItems || [], firebaseLibrary.downloadedItems || [], 'id'),
      downloadedCreatures: mergeArrays(localLibraryData.downloadedCreatures || [], firebaseLibrary.downloadedCreatures || [], 'id'),
      downloadedPacks: mergeArrays(localLibraryData.downloadedPacks || [], firebaseLibrary.downloadedPacks || [], 'id'),
      favorites: mergeArrays(localLibraryData.favorites || [], firebaseLibrary.favorites || [], 'id'),
      downloadHistory: mergeArrays(localLibraryData.downloadHistory || [], firebaseLibrary.downloadHistory || [], 'timestamp'),
      lastSyncAt: new Date()
    };

    // Update Firebase with merged data
    await updateDoc(userLibraryRef, mergedLibrary);
    
    return mergedLibrary;
  } catch (error) {
    console.error('Error syncing user library:', error);
    throw new Error('Failed to sync user library');
  }
}

/**
 * Helper function to merge arrays without duplicates
 */
function mergeArrays(localArray, firebaseArray, keyField) {
  const merged = [...firebaseArray]; // Start with Firebase data
  
  // Add local items that don't exist in Firebase
  localArray.forEach(localItem => {
    const exists = firebaseArray.some(firebaseItem => 
      firebaseItem[keyField] === localItem[keyField]
    );
    
    if (!exists) {
      merged.push(localItem);
    }
  });
  
  return merged;
}

/**
 * Clear user's library (for testing or reset purposes)
 */
export async function clearUserLibrary(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return;
    }

    const userLibraryRef = doc(db, COLLECTIONS.USER_LIBRARIES, userId);
    await updateDoc(userLibraryRef, {
      downloadedItems: [],
      downloadedCreatures: [],
      downloadedPacks: [],
      favorites: [],
      downloadHistory: [],
      lastSyncAt: new Date()
    });

  } catch (error) {
    console.error('Error clearing user library:', error);
    throw new Error('Failed to clear user library');
  }
}
