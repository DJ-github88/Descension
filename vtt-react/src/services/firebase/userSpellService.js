/**
 * User Spell Service
 * 
 * Manages user-created custom spells in Firebase Firestore
 * Spells are tied to user accounts and persist across sessions/characters/rooms
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
  USER_SPELLS: 'user_spells',
  USER_FOLDERS: 'user_folders', // Personal folder structure for organizing spells
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
 * Save a custom spell for a user
 */
export async function saveUserSpell(userId, spellData) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Generate spell ID if not provided
    const spellId = spellData.id || `spell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare spell document
    const spellDocument = {
      ...spellData,
      id: spellId,
      userId,
      folderId: spellData.folderId || null, // Reference to folder if organized
      createdAt: spellData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isCustom: true,
      isShared: false, // Set to true when shared to community
      source: spellData.source || 'wizard'
    };

    // Save to user_spells collection
    const spellRef = doc(db, COLLECTIONS.USER_SPELLS, spellId);

    // Sanitize spell document to remove undefined values
    const sanitizedSpell = sanitizeForFirestore(spellDocument);

    await setDoc(spellRef, sanitizedSpell);

    // Update user's spell list
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        customSpells: arrayUnion(spellId),
        updatedAt: serverTimestamp()
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        customSpells: [spellId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, spellId, localOnly: false };

  } catch (error) {
    console.error('Error saving spell to Firebase:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Load all custom spells for a user
 */
export async function loadUserSpells(userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return [];
    }

    if (!userId) {
      return [];
    }

    // Query all spells for this user
    const spellsQuery = query(
      collection(db, COLLECTIONS.USER_SPELLS),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(spellsQuery);
    const spells = [];

    querySnapshot.forEach((doc) => {
      spells.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort in memory to avoid index requirement
    return spells.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA; // Descending
    });

  } catch (error) {
    console.error('Error loading user spells:', error);
    return [];
  }
}

/**
 * Update an existing spell
 */
export async function updateUserSpell(userId, spellId, updates) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId || !spellId) {
      throw new Error('User ID and Spell ID are required');
    }

    // Get the spell to verify ownership
    const spellRef = doc(db, COLLECTIONS.USER_SPELLS, spellId);
    const spellDoc = await getDoc(spellRef);

    if (!spellDoc.exists()) {
      throw new Error('Spell not found');
    }

    const spellData = spellDoc.data();
    if (spellData.userId !== userId) {
      throw new Error('Access denied: Spell does not belong to user');
    }

    // Update the spell
    // Sanitize updates to remove undefined values
    const sanitizedUpdates = sanitizeForFirestore(updates);

    await updateDoc(spellRef, {
      ...sanitizedUpdates,
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error updating spell:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Delete a spell
 */
export async function deleteUserSpell(userId, spellId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId || !spellId) {
      throw new Error('User ID and Spell ID are required');
    }

    // Get the spell to verify ownership
    const spellRef = doc(db, COLLECTIONS.USER_SPELLS, spellId);
    const spellDoc = await getDoc(spellRef);

    if (!spellDoc.exists()) {
      throw new Error('Spell not found');
    }

    const spellData = spellDoc.data();
    if (spellData.userId !== userId) {
      throw new Error('Access denied: Spell does not belong to user');
    }

    // Delete the spell
    await deleteDoc(spellRef);

    // Remove from user's spell list
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      customSpells: arrayRemove(spellId),
      updatedAt: serverTimestamp()
    });

    return { success: true, localOnly: false };

  } catch (error) {
    console.error('Error deleting spell:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Get a single spell by ID
 */
export async function getUserSpell(userId, spellId) {
  try {
    if (!checkFirebaseAvailable()) {
      return null;
    }

    const spellRef = doc(db, COLLECTIONS.USER_SPELLS, spellId);
    const spellDoc = await getDoc(spellRef);

    if (!spellDoc.exists()) {
      return null;
    }

    const spellData = spellDoc.data();

    // Verify ownership
    if (spellData.userId !== userId) {
      throw new Error('Access denied: Spell does not belong to user');
    }

    return {
      id: spellDoc.id,
      ...spellData
    };

  } catch (error) {
    console.error('Error getting spell:', error);
    return null;
  }
}

/**
 * Sync local spells to Firebase
 * Used when a user logs in to upload any spells created while offline
 */
export async function syncLocalSpellsToFirebase(userId, localSpells) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, synced: 0 };
    }

    if (!userId || !localSpells || localSpells.length === 0) {
      return { success: true, synced: 0 };
    }

    let syncedCount = 0;
    const errors = [];

    for (const spell of localSpells) {
      try {
        // Only sync spells that don't have a userId or have the current userId
        if (!spell.userId || spell.userId === userId) {
          await saveUserSpell(userId, spell);
          syncedCount++;
        }
      } catch (error) {
        console.error(`Failed to sync spell ${spell.id}:`, error);
        errors.push({ spellId: spell.id, error: error.message });
      }
    }

    return { success: true, synced: syncedCount, errors };

  } catch (error) {
    console.error('Error syncing spells:', error);
    return { success: false, synced: 0, error: error.message };
  }
}

/**
 * ========================================
 * PERSONAL FOLDER SYSTEM
 * Users can organize spells in folders with sub-folders
 * ========================================
 */

/**
 * Get all folders for a user (with nested sub-folders)
 */
export async function getUserFolders(userId) {
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
    console.error('Error loading user folders:', error);
    return [];
  }
}

/**
 * Create a new folder for a user
 */
export async function createUserFolder(userId, folderData) {
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
      icon: folderData.icon || 'spell_arcane_arcane04',
      color: folderData.color || '#8b5cf6',
      parentFolderId: folderData.parentFolderId || null, // null = top level folder
      subFolders: [], // Array of sub-folder IDs
      spellIds: [], // Array of spell IDs in this folder
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
    console.error('Error creating folder:', error);
    throw error;
  }
}

/**
 * Add a sub-folder to an existing folder
 */
export async function addSubFolder(userId, parentFolderId, subFolderData) {
  return createUserFolder(userId, {
    ...subFolderData,
    parentFolderId
  });
}

/**
 * Move a spell to a folder
 */
export async function moveSpellToFolder(userId, spellId, folderId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    // Verify spell ownership
    const spellRef = doc(db, COLLECTIONS.USER_SPELLS, spellId);
    const spellDoc = await getDoc(spellRef);

    if (!spellDoc.exists() || spellDoc.data().userId !== userId) {
      throw new Error('Spell not found or access denied');
    }

    // Remove spell from previous folder if any
    const allFolders = await getUserFolders(userId);
    for (const folder of allFolders) {
      if (folder.spellIds && folder.spellIds.includes(spellId)) {
        const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folder.id);
        await updateDoc(folderRef, {
          spellIds: arrayRemove(spellId),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Add spell to new folder (if folderId is provided, null = root/unorganized)
    if (folderId) {
      const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folderId);
      const folderDoc = await getDoc(folderRef);

      if (!folderDoc.exists() || folderDoc.data().userId !== userId) {
        throw new Error('Folder not found or access denied');
      }

      await updateDoc(folderRef, {
        spellIds: arrayUnion(spellId),
        updatedAt: new Date().toISOString()
      });
    }

    // Update spell with folder reference
    await updateDoc(spellRef, {
      folderId: folderId || null,
      updatedAt: new Date().toISOString()
    });

    return { success: true, localOnly: false };
  } catch (error) {
    console.error('Error moving spell to folder:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Update folder (rename, change description, etc.)
 */
export async function updateUserFolder(userId, folderId, updates) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folderId);
    const folderDoc = await getDoc(folderRef);

    if (!folderDoc.exists() || folderDoc.data().userId !== userId) {
      throw new Error('Folder not found or access denied');
    }

    await updateDoc(folderRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return { success: true, localOnly: false };
  } catch (error) {
    console.error('Error updating folder:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Delete a folder (and optionally move spells to parent or root)
 */
export async function deleteUserFolder(userId, folderId, moveSpellsToParent = true) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    const folderRef = doc(db, COLLECTIONS.USER_FOLDERS, folderId);
    const folderDoc = await getDoc(folderRef);

    if (!folderDoc.exists() || folderDoc.data().userId !== userId) {
      throw new Error('Folder not found or access denied');
    }

    const folderData = folderDoc.data();

    // Handle sub-folders - move them to parent or delete them
    if (folderData.subFolders && folderData.subFolders.length > 0) {
      for (const subFolderId of folderData.subFolders) {
        if (moveSpellsToParent && folderData.parentFolderId) {
          // Move sub-folder to parent
          const subFolderRef = doc(db, COLLECTIONS.USER_FOLDERS, subFolderId);
          await updateDoc(subFolderRef, {
            parentFolderId: folderData.parentFolderId,
            updatedAt: new Date().toISOString()
          });
        } else {
          // Delete sub-folder (this will recursively delete)
          await deleteUserFolder(userId, subFolderId, false);
        }
      }
    }

    // Handle spells in folder
    if (folderData.spellIds && folderData.spellIds.length > 0) {
      for (const spellId of folderData.spellIds) {
        if (moveSpellsToParent && folderData.parentFolderId) {
          await moveSpellToFolder(userId, spellId, folderData.parentFolderId);
        } else {
          // Move to root (remove folder reference)
          await moveSpellToFolder(userId, spellId, null);
        }
      }
    }

    // Remove from parent folder if it exists
    if (folderData.parentFolderId) {
      const parentRef = doc(db, COLLECTIONS.USER_FOLDERS, folderData.parentFolderId);
      await updateDoc(parentRef, {
        subFolders: arrayRemove(folderId),
        updatedAt: new Date().toISOString()
      });
    }

    // Delete the folder
    await deleteDoc(folderRef);

    return { success: true, localOnly: false };
  } catch (error) {
    console.error('Error deleting folder:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Share a spell to the community
 * This creates a copy in community_spells and marks the original as shared
 */
export async function shareSpellToCommunity(userId, spellId) {
  try {
    if (!checkFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    if (!userId || !spellId) {
      throw new Error('User ID and Spell ID are required');
    }

    // Get the user's spell
    const spellRef = doc(db, COLLECTIONS.USER_SPELLS, spellId);
    const spellDoc = await getDoc(spellRef);

    if (!spellDoc.exists() || spellDoc.data().userId !== userId) {
      throw new Error('Spell not found or access denied');
    }

    const spellData = spellDoc.data();

    // Check if already shared
    if (spellData.isShared) {
      throw new Error('Spell is already shared to the community');
    }

    // Import community service to add spell
    const { uploadSpell } = await import('./communitySpellService');

    // Prepare spell for community (remove folder references, add community metadata)
    const communitySpell = {
      ...spellData,
      originalSpellId: spellId, // Reference back to user's spell
      originalUserId: userId,
      isPublic: true,
      isFeatured: false,
      isShared: true
    };

    // Remove user-specific fields
    delete communitySpell.folderId;
    delete communitySpell.isCustom;

    // Upload to community
    const sharedSpell = await uploadSpell(communitySpell, userId);

    // Mark original spell as shared
    await updateDoc(spellRef, {
      isShared: true,
      sharedSpellId: sharedSpell.id, // Reference to community spell
      sharedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, sharedSpellId: sharedSpell.id };
  } catch (error) {
    console.error('Error sharing spell to community:', error);
    throw error;
  }
}

/**
 * Unshare a spell from the community
 */
export async function unshareSpellFromCommunity(userId, spellId) {
  try {
    if (!checkFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    const spellRef = doc(db, COLLECTIONS.USER_SPELLS, spellId);
    const spellDoc = await getDoc(spellRef);

    if (!spellDoc.exists() || spellDoc.data().userId !== userId) {
      throw new Error('Spell not found or access denied');
    }

    const spellData = spellDoc.data();

    if (!spellData.isShared || !spellData.sharedSpellId) {
      throw new Error('Spell is not shared');
    }

    // Delete from community
    const communitySpellRef = doc(db, 'community_spells', spellData.sharedSpellId);
    await deleteDoc(communitySpellRef);

    // Mark original as not shared
    await updateDoc(spellRef, {
      isShared: false,
      sharedSpellId: null,
      sharedAt: null,
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Error unsharing spell:', error);
    throw error;
  }
}

