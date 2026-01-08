/**
 * User Items Service
 *
 * Manages user-created custom items in Firebase Firestore.
 * Items are tied to user accounts and persist across sessions/characters/rooms.
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

// Collection names
const COLLECTIONS = {
  USER_ITEMS: 'userItems',
  USER_FOLDERS: 'userItemFolders', // Personal folder structure for organizing items
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
 * Save a custom item for a user
 */
export async function saveUserItem(userId, itemData) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Generate item ID if not provided
    const itemId = itemData.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare item document
    const itemDocument = {
      ...itemData,
      id: itemId,
      userId,
      folderId: itemData.folderId || null, // Reference to folder if organized
      createdAt: itemData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isCustom: true,
      isShared: false, // Set to true when shared to community
      source: itemData.source || 'wizard'
    };

    // Save to user_items collection
    const itemRef = doc(db, COLLECTIONS.USER_ITEMS, itemId);
    await setDoc(itemRef, itemDocument);

    // Update user's item list
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        customItems: arrayUnion(itemId),
        updatedAt: serverTimestamp()
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        customItems: [itemId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, itemId, localOnly: false };

  } catch (error) {
    console.error('Error saving item to Firebase:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Load all custom items for a user
 */
export async function loadUserItems(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return [];
    }

    if (!userId) {
      return [];
    }

    // Query all items for this user
    const itemsQuery = query(
      collection(db, COLLECTIONS.USER_ITEMS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(itemsQuery);
    const items = [];

    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return items;

  } catch (error) {
    console.error('Error loading user items:', error);
    return [];
  }
}

/**
 * Update an existing item
 */
export async function updateUserItem(userId, itemId, updates) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId || !itemId) {
      throw new Error('User ID and Item ID are required');
    }

    // Get the item to verify ownership
    const itemRef = doc(db, COLLECTIONS.USER_ITEMS, itemId);
    const itemDoc = await getDoc(itemRef);

    if (!itemDoc.exists()) {
      throw new Error('Item not found');
    }

    const itemData = itemDoc.data();
    if (itemData.userId !== userId) {
      throw new Error('Access denied: Item does not belong to user');
    }

    // Update the item
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error updating item:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Delete an item
 */
export async function deleteUserItem(userId, itemId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId || !itemId) {
      throw new Error('User ID and Item ID are required');
    }

    // Get the item to verify ownership
    const itemRef = doc(db, COLLECTIONS.USER_ITEMS, itemId);
    const itemDoc = await getDoc(itemRef);

    if (!itemDoc.exists()) {
      throw new Error('Item not found');
    }

    const itemData = itemDoc.data();
    if (itemData.userId !== userId) {
      throw new Error('Access denied: Item does not belong to user');
    }

    // Delete the item
    await deleteDoc(itemRef);

    // Remove from user's item list
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      customItems: arrayRemove(itemId),
      updatedAt: serverTimestamp()
    });

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error deleting item:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Get a single item by ID
 */
export async function getUserItem(userId, itemId) {
  try {
    if (!checkFirebaseAvailable()) {
      return null;
    }

    const itemRef = doc(db, COLLECTIONS.USER_ITEMS, itemId);
    const itemDoc = await getDoc(itemRef);

    if (!itemDoc.exists()) {
      return null;
    }

    const itemData = itemDoc.data();

    // Verify ownership
    if (itemData.userId !== userId) {
      throw new Error('Access denied: Item does not belong to user');
    }

    return {
      id: itemDoc.id,
      ...itemData
    };

  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
}

/**
 * Sync local items to Firebase
 * Used when a user logs in to upload any items created while offline
 */
export async function syncLocalItemsToFirebase(userId, localItems) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, synced: 0 };
    }

    if (!userId || !localItems || localItems.length === 0) {
      return { success: true, synced: 0 };
    }

    let syncedCount = 0;
    const errors = [];

    for (const item of localItems) {
      try {
        // Only sync items that don't have a userId or have the current userId
        if (!item.userId || item.userId === userId) {
          await saveUserItem(userId, item);
          syncedCount++;
        }
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        errors.push({ itemId: item.id, error: error.message });
      }
    }

    return { success: true, synced: syncedCount, errors };

  } catch (error) {
    console.error('Error syncing items:', error);
    return { success: false, synced: 0, error: error.message };
  }
}

/**
 * ========================================
 * PERSONAL FOLDER SYSTEM
 * Users can organize items in folders with sub-folders
 * ========================================
 */

/**
 * Get all folders for a user (with nested sub-folders)
 */
export async function getUserItemFolders(userId) {
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
    console.error('Error loading user item folders:', error);
    return [];
  }
}

/**
 * Create a new folder for a user
 */
export async function createUserItemFolder(userId, folderData) {
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
      itemIds: [], // Array of item IDs in this folder
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
    console.error('Error creating item folder:', error);
    throw error;
  }
}

/**
 * Move an item to a folder
 */
export async function moveItemToFolder(userId, itemId, folderId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    // Verify item ownership
    const itemRef = doc(db, COLLECTIONS.USER_ITEMS, itemId);
    const itemDoc = await getDoc(itemRef);

    if (!itemDoc.exists() || itemDoc.data().userId !== userId) {
      throw new Error('Item not found or access denied');
    }

    // Remove item from previous folder if any
    const allFolders = await getUserItemFolders(userId);
    for (const folder of allFolders) {
      if (folder.itemIds && folder.itemIds.includes(itemId)) {
        const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folder.id);
        await updateDoc(folderRef, {
          itemIds: arrayRemove(itemId),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Add item to new folder (if folderId is provided, null = root/unorganized)
    if (folderId) {
      const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folderId);
      const folderDoc = await getDoc(folderRef);

      if (!folderDoc.exists() || folderDoc.data().userId !== userId) {
        throw new Error('Folder not found or access denied');
      }

      await updateDoc(folderRef, {
        itemIds: arrayUnion(itemId),
        updatedAt: new Date().toISOString()
      });
    }

    // Update item with folder reference
    await updateDoc(itemRef, {
      folderId: folderId || null,
      updatedAt: new Date().toISOString()
    });

    return { success: true, localOnly: false };
  } catch (error) {
    console.error('Error moving item to folder:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Share an item to the community
 * This creates a copy in community_items and marks the original as shared
 */
export async function shareItemToCommunity(userId, itemId) {
  try {
    if (!checkFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    if (!userId || !itemId) {
      throw new Error('User ID and Item ID are required');
    }

    // Get the user's item
    const itemRef = doc(db, COLLECTIONS.USER_ITEMS, itemId);
    const itemDoc = await getDoc(itemRef);

    if (!itemDoc.exists() || itemDoc.data().userId !== userId) {
      throw new Error('Item not found or access denied');
    }

    const itemData = itemDoc.data();

    // Check if already shared
    if (itemData.isShared) {
      throw new Error('Item is already shared to the community');
    }

    // Import community service to add item
    const { uploadItem } = await import('./communityItemService');

    // Prepare item for community (remove folder references, add community metadata)
    const communityItem = {
      ...itemData,
      originalItemId: itemId, // Reference back to user's item
      originalUserId: userId,
      isPublic: true,
      isFeatured: false,
      isShared: true
    };

    // Remove user-specific fields
    delete communityItem.folderId;
    delete communityItem.isCustom;

    // Upload to community
    const sharedItem = await uploadItem(communityItem, userId);

    // Mark original item as shared
    await updateDoc(itemRef, {
      isShared: true,
      sharedItemId: sharedItem.id, // Reference to community item
      sharedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, sharedItemId: sharedItem.id };
  } catch (error) {
    console.error('Error sharing item to community:', error);
    throw error;
  }
}
