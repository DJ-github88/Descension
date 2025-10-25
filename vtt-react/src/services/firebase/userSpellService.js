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
  USER_SPELLS: 'user_spells',
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
      console.log('Firebase not available, spell saved locally only');
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
      createdAt: spellData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isCustom: true,
      source: spellData.source || 'wizard'
    };

    // Save to user_spells collection
    const spellRef = doc(db, COLLECTIONS.USER_SPELLS, spellId);
    await setDoc(spellRef, spellDocument);

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

    console.log(`✅ Spell saved to Firebase: ${spellData.name} (${spellId})`);
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
      console.log('Firebase not available, returning empty spell list');
      return [];
    }

    if (!userId) {
      console.log('No user ID provided, returning empty spell list');
      return [];
    }

    // Query all spells for this user
    const spellsQuery = query(
      collection(db, COLLECTIONS.USER_SPELLS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(spellsQuery);
    const spells = [];

    querySnapshot.forEach((doc) => {
      spells.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Loaded ${spells.length} custom spells for user ${userId}`);
    return spells;

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
      console.log('Firebase not available, spell updated locally only');
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
    await updateDoc(spellRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });

    console.log(`✅ Spell updated: ${spellId}`);
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
      console.log('Firebase not available, spell deleted locally only');
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

    console.log(`✅ Spell deleted: ${spellId}`);
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
      console.log('Firebase not available, cannot sync spells');
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

    console.log(`✅ Synced ${syncedCount} spells to Firebase`);
    return { success: true, synced: syncedCount, errors };

  } catch (error) {
    console.error('Error syncing spells:', error);
    return { success: false, synced: 0, error: error.message };
  }
}

