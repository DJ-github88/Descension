/**
 * User Creatures Service
 *
 * Manages user-created custom creatures in Firebase Firestore.
 * Creatures are tied to user accounts and persist across sessions/characters/rooms.
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
  USER_CREATURES: 'userCreatures',
  USER_FOLDERS: 'userCreatureFolders', // Personal folder structure for organizing creatures
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
 * Save a custom creature for a user
 */
export async function saveUserCreature(userId, creatureData) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Generate creature ID if not provided
    const creatureId = creatureData.id || `creature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare creature document
    const creatureDocument = {
      ...creatureData,
      id: creatureId,
      userId,
      folderId: creatureData.folderId || null, // Reference to folder if organized
      createdAt: creatureData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isCustom: true,
      isShared: false, // Set to true when shared to community
      source: creatureData.source || 'wizard'
    };

    // Save to user_creatures collection
    const creatureRef = doc(db, COLLECTIONS.USER_CREATURES, creatureId);

    // Sanitize creature document to remove undefined values
    const sanitizedCreature = sanitizeForFirestore(creatureDocument);

    await setDoc(creatureRef, sanitizedCreature);

    // Update user's creature list
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        customCreatures: arrayUnion(creatureId),
        updatedAt: serverTimestamp()
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        customCreatures: [creatureId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, creatureId, localOnly: false };

  } catch (error) {
    console.error('Error saving creature to Firebase:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Load all custom creatures for a user
 */
export async function loadUserCreatures(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return [];
    }

    if (!userId) {
      return [];
    }

    // Query all creatures for this user
    const creaturesQuery = query(
      collection(db, COLLECTIONS.USER_CREATURES),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(creaturesQuery);
    const creatures = [];

    querySnapshot.forEach((doc) => {
      creatures.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return creatures;

  } catch (error) {
    console.error('Error loading user creatures:', error);
    return [];
  }
}

/**
 * Update an existing creature
 */
export async function updateUserCreature(userId, creatureId, updates) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId || !creatureId) {
      throw new Error('User ID and Creature ID are required');
    }

    // Get the creature to verify ownership
    const creatureRef = doc(db, COLLECTIONS.USER_CREATURES, creatureId);
    const creatureDoc = await getDoc(creatureRef);

    if (!creatureDoc.exists()) {
      throw new Error('Creature not found');
    }

    const creatureData = creatureDoc.data();
    if (creatureData.userId !== userId) {
      throw new Error('Access denied: Creature does not belong to user');
    }

    // Update the creature
    // Sanitize updates to remove undefined values
    const sanitizedUpdates = sanitizeForFirestore(updates);

    await updateDoc(creatureRef, {
      ...sanitizedUpdates,
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error updating creature:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Delete a creature
 */
export async function deleteUserCreature(userId, creatureId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId || !creatureId) {
      throw new Error('User ID and Creature ID are required');
    }

    // Get the creature to verify ownership
    const creatureRef = doc(db, COLLECTIONS.USER_CREATURES, creatureId);
    const creatureDoc = await getDoc(creatureRef);

    if (!creatureDoc.exists()) {
      throw new Error('Creature not found');
    }

    const creatureData = creatureDoc.data();
    if (creatureData.userId !== userId) {
      throw new Error('Access denied: Creature does not belong to user');
    }

    // Delete the creature
    await deleteDoc(creatureRef);

    // Remove from user's creature list
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      customCreatures: arrayRemove(creatureId),
      updatedAt: serverTimestamp()
    });

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error deleting creature:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Get a single creature by ID
 */
export async function getUserCreature(userId, creatureId) {
  try {
    if (!checkFirebaseAvailable()) {
      return null;
    }

    const creatureRef = doc(db, COLLECTIONS.USER_CREATURES, creatureId);
    const creatureDoc = await getDoc(creatureRef);

    if (!creatureDoc.exists()) {
      return null;
    }

    const creatureData = creatureDoc.data();

    // Verify ownership
    if (creatureData.userId !== userId) {
      throw new Error('Access denied: Creature does not belong to user');
    }

    return {
      id: creatureDoc.id,
      ...creatureData
    };

  } catch (error) {
    console.error('Error getting creature:', error);
    return null;
  }
}

/**
 * Sync local creatures to Firebase
 * Used when a user logs in to upload any creatures created while offline
 */
export async function syncLocalCreaturesToFirebase(userId, localCreatures) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, synced: 0 };
    }

    if (!userId || !localCreatures || localCreatures.length === 0) {
      return { success: true, synced: 0 };
    }

    let syncedCount = 0;
    const errors = [];

    for (const creature of localCreatures) {
      try {
        // Only sync creatures that don't have a userId or have the current userId
        if (!creature.userId || creature.userId === userId) {
          await saveUserCreature(userId, creature);
          syncedCount++;
        }
      } catch (error) {
        console.error(`Failed to sync creature ${creature.id}:`, error);
        errors.push({ creatureId: creature.id, error: error.message });
      }
    }

    return { success: true, synced: syncedCount, errors };

  } catch (error) {
    console.error('Error syncing creatures:', error);
    return { success: false, synced: 0, error: error.message };
  }
}

/**
 * ========================================
 * PERSONAL FOLDER SYSTEM
 * Users can organize creatures in folders with sub-folders
 * ========================================
 */

/**
 * Get all folders for a user (with nested sub-folders)
 */
export async function getUserCreatureFolders(userId) {
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
    console.error('Error loading user creature folders:', error);
    return [];
  }
}

/**
 * Create a new folder for a user
 */
export async function createUserCreatureFolder(userId, folderData) {
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
      creatureIds: [], // Array of creature IDs in this folder
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
    console.error('Error creating creature folder:', error);
    throw error;
  }
}

/**
 * Move a creature to a folder
 */
export async function moveCreatureToFolder(userId, creatureId, folderId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    // Verify creature ownership
    const creatureRef = doc(db, COLLECTIONS.USER_CREATURES, creatureId);
    const creatureDoc = await getDoc(creatureRef);

    if (!creatureDoc.exists() || creatureDoc.data().userId !== userId) {
      throw new Error('Creature not found or access denied');
    }

    // Remove creature from previous folder if any
    const allFolders = await getUserCreatureFolders(userId);
    for (const folder of allFolders) {
      if (folder.creatureIds && folder.creatureIds.includes(creatureId)) {
        const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folder.id);
        await updateDoc(folderRef, {
          creatureIds: arrayRemove(creatureId),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Add creature to new folder (if folderId is provided, null = root/unorganized)
    if (folderId) {
      const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folderId);
      const folderDoc = await getDoc(folderRef);

      if (!folderDoc.exists() || folderDoc.data().userId !== userId) {
        throw new Error('Folder not found or access denied');
      }

      await updateDoc(folderRef, {
        creatureIds: arrayUnion(creatureId),
        updatedAt: new Date().toISOString()
      });
    }

    // Update creature with folder reference
    await updateDoc(creatureRef, {
      folderId: folderId || null,
      updatedAt: new Date().toISOString()
    });

    return { success: true, localOnly: false };
  } catch (error) {
    console.error('Error moving creature to folder:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Share a creature to the community
 * This creates a copy in community_creatures and marks the original as shared
 */
export async function shareCreatureToCommunity(userId, creatureId) {
  try {
    if (!checkFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    if (!userId || !creatureId) {
      throw new Error('User ID and Creature ID are required');
    }

    // Get the user's creature
    const creatureRef = doc(db, COLLECTIONS.USER_CREATURES, creatureId);
    const creatureDoc = await getDoc(creatureRef);

    if (!creatureDoc.exists() || creatureDoc.data().userId !== userId) {
      throw new Error('Creature not found or access denied');
    }

    const creatureData = creatureDoc.data();

    // Check if already shared
    if (creatureData.isShared) {
      throw new Error('Creature is already shared to the community');
    }

    // Import community service to add creature
    const { uploadCreature } = await import('./communityCreatureService');

    // Prepare creature for community (remove folder references, add community metadata)
    const communityCreature = {
      ...creatureData,
      originalCreatureId: creatureId, // Reference back to user's creature
      originalUserId: userId,
      isPublic: true,
      isFeatured: false,
      isShared: true
    };

    // Remove user-specific fields
    delete communityCreature.folderId;
    delete communityCreature.isCustom;

    // Upload to community
    const sharedCreature = await uploadCreature(communityCreature, userId);

    // Mark original creature as shared
    await updateDoc(creatureRef, {
      isShared: true,
      sharedCreatureId: sharedCreature.id, // Reference to community creature
      sharedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, sharedCreatureId: sharedCreature.id };
  } catch (error) {
    console.error('Error sharing creature to community:', error);
    throw error;
  }
}
