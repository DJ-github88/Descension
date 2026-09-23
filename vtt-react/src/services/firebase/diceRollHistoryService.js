/**
 * Dice Roll History Service
 *
 * Manages dice roll history and statistics persistence to Firebase.
 * Tracks individual rolls, session statistics, and character-specific roll data.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured, isDemoMode } from '../../config/firebase';

// Collection names
const COLLECTIONS = {
  DICE_ROLLS: 'diceRolls',
  ROLL_SESSIONS: 'rollSessions',
  CHARACTER_ROLL_STATS: 'characterRollStats',
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
 * Save a dice roll to Firebase
 */
export async function saveDiceRoll(userId, characterId, roomId, rollData) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    if (!userId || !characterId) {
      throw new Error('User ID and Character ID are required');
    }

    // Generate roll ID
    const rollId = `roll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare roll document
    const rollDocument = {
      id: rollId,
      userId,
      characterId,
      roomId: roomId || null,
      timestamp: serverTimestamp(),
      clientTimestamp: new Date().toISOString(),

      // Roll details
      dice: rollData.dice || [],
      results: rollData.results || [],
      total: rollData.total || 0,
      rollString: rollData.rollString || '',
      rollType: rollData.rollType || 'manual', // 'manual', 'skill', 'attack', 'saving_throw', 'ability', etc.

      // Context
      context: rollData.context || null, // e.g., { skill: 'stealth', modifier: 5 }
      campaignId: rollData.campaignId || null,
      sessionId: rollData.sessionId || null,

      // Metadata
      isPublic: rollData.isPublic !== false, // Whether roll appears in chat
      tags: rollData.tags || [], // Custom tags for filtering
      notes: rollData.notes || ''
    };

    // Save to dice_rolls collection
    const rollRef = doc(db, COLLECTIONS.DICE_ROLLS, rollId);
    await setDoc(rollRef, rollDocument);

    // Update character roll statistics
    await updateCharacterRollStats(userId, characterId, rollData);

    return { success: true, rollId, localOnly: false };

  } catch (error) {
    console.error('Error saving dice roll:', error);
    return { success: false, error: error.message, localOnly: true };
  }
}

/**
 * Update character roll statistics
 *
 * Uses atomic `increment()` writes with dotted field paths, so concurrent
 * rolls from multiple devices no longer lose updates. `averageRoll` is derived
 * on read (`getCharacterRollStats`) instead of being stored by a
 * read-modify-write cycle.
 */
async function updateCharacterRollStats(userId, characterId, rollData) {
  try {
    const statsRef = doc(db, COLLECTIONS.CHARACTER_ROLL_STATS, `${userId}_${characterId}`);

    const d20Results = rollData.results?.filter(r => r.sides === 20) || [];
    let natural20s = 0;
    let natural1s = 0;
    d20Results.forEach(result => {
      if (result.value === 20) natural20s += 1;
      else if (result.value === 1) natural1s += 1;
    });

    const rollType = rollData.rollType || 'manual';

    const updates = {
      userId,
      characterId,
      lastRollDate: serverTimestamp(),
      totalRolls: increment(1),
      totalSum: increment(rollData.total || 0),
      criticalSuccesses: increment(natural20s),
      criticalFailures: increment(natural1s),
      natural20s: increment(natural20s),
      natural1s: increment(natural1s)
    };

    (rollData.dice || []).forEach(die => {
      const dieType = `d${die.sides}`;
      updates[`diceTypeStats.${dieType}.count`] = increment(die.count || 1);
    });

    updates[`rollTypeStats.${rollType}.count`] = increment(1);
    updates[`rollTypeStats.${rollType}.total`] = increment(rollData.total || 0);

    try {
      await updateDoc(statsRef, updates);
    } catch (error) {
      if (error?.code !== 'not-found') throw error;

      // First roll for this character: create the document. setDoc does not
      // split dotted keys into field paths, so build the nested maps here.
      const firstStats = {
        userId,
        characterId,
        lastRollDate: serverTimestamp(),
        totalRolls: 1,
        totalSum: rollData.total || 0,
        criticalSuccesses: natural20s,
        criticalFailures: natural1s,
        natural20s,
        natural1s,
        diceTypeStats: {},
        rollTypeStats: {}
      };

      (rollData.dice || []).forEach(die => {
        const dieType = `d${die.sides}`;
        firstStats.diceTypeStats[dieType] = { count: die.count || 1, total: 0 };
      });

      firstStats.rollTypeStats[rollType] = {
        count: 1,
        total: rollData.total || 0
      };

      await setDoc(statsRef, firstStats, { merge: true });
    }

  } catch (error) {
    console.error('Error updating character roll stats:', error);
    // Don't throw - stats update failure shouldn't break roll saving
  }
}

/**
 * Get roll history for a character
 */
export async function getCharacterRollHistory(userId, characterId, options = {}) {
  try {
    if (!checkFirebaseAvailable()) {
      return [];
    }

    const { limit: resultLimit = 50, rollType } = options;

    let queryConstraints = [
      where('userId', '==', userId),
      where('characterId', '==', characterId),
      orderBy('timestamp', 'desc'),
      limit(resultLimit)
    ];

    if (rollType) {
      queryConstraints.push(where('rollType', '==', rollType));
    }

    const rollsQuery = query(
      collection(db, COLLECTIONS.DICE_ROLLS),
      ...queryConstraints
    );

    const querySnapshot = await getDocs(rollsQuery);
    const rolls = [];

    querySnapshot.forEach((doc) => {
      rolls.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return rolls;

  } catch (error) {
    console.error('Error loading character roll history:', error);
    return [];
  }
}

/**
 * Get roll statistics for a character
 */
export async function getCharacterRollStats(userId, characterId) {
  try {
    if (!checkFirebaseAvailable()) {
      return null;
    }

    const statsRef = doc(db, COLLECTIONS.CHARACTER_ROLL_STATS, `${userId}_${characterId}`);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      const stats = statsDoc.data();
      // averageRoll is derived (increment-only writes keep it race-free).
      const totalRolls = stats.totalRolls || 0;
      return {
        ...stats,
        averageRoll: totalRolls > 0 ? (stats.totalSum || 0) / totalRolls : 0
      };
    } else {
      return {
        userId,
        characterId,
        totalRolls: 0,
        lastRollDate: null,
        diceTypeStats: {},
        rollTypeStats: {},
        totalSum: 0,
        averageRoll: 0,
        criticalSuccesses: 0,
        criticalFailures: 0,
        natural20s: 0,
        natural1s: 0
      };
    }

  } catch (error) {
    console.error('Error loading character roll stats:', error);
    return null;
  }
}

/**
 * Get roll history for a room/session
 */
export async function getRoomRollHistory(roomId, options = {}) {
  try {
    if (!checkFirebaseAvailable()) {
      return [];
    }

    const { limit: resultLimit = 100 } = options;

    const rollsQuery = query(
      collection(db, COLLECTIONS.DICE_ROLLS),
      where('roomId', '==', roomId),
      where('isPublic', '==', true),
      orderBy('timestamp', 'desc'),
      limit(resultLimit)
    );

    const querySnapshot = await getDocs(rollsQuery);
    const rolls = [];

    querySnapshot.forEach((doc) => {
      rolls.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return rolls;

  } catch (error) {
    console.error('Error loading room roll history:', error);
    return [];
  }
}

/**
 * Delete old roll history (cleanup function)
 *
 * Actually deletes in batches (it used to just log a message). Scoped to the
 * user's own rolls; `characterId` filters client-side so a single composite
 * index on userId+timestamp is enough.
 */
export async function cleanupOldRolls(userId, characterId, daysOld = 90) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

    const q = query(
      collection(db, COLLECTIONS.DICE_ROLLS),
      where('userId', '==', userId),
      where('timestamp', '<', cutoffTimestamp),
      limit(200)
    );
    const snapshot = await getDocs(q);

    const toDelete = characterId
      ? snapshot.docs.filter(d => d.data().characterId === characterId)
      : snapshot.docs;

    if (toDelete.length > 0) {
      const batch = writeBatch(db);
      toDelete.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }

    return {
      success: true,
      localOnly: false,
      deleted: toDelete.length,
      hasMore: snapshot.size === 200
    };

  } catch (error) {
    console.error('Error cleaning up old rolls:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Export roll history for a character
 */
export async function exportCharacterRollHistory(userId, characterId, options = {}) {
  try {
    const rolls = await getCharacterRollHistory(userId, characterId, { limit: 1000, ...options });
    const stats = await getCharacterRollStats(userId, characterId);

    return {
      characterId,
      exportDate: new Date().toISOString(),
      rolls,
      statistics: stats
    };

  } catch (error) {
    console.error('Error exporting roll history:', error);
    return null;
  }
}
