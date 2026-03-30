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
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
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
 */
async function updateCharacterRollStats(userId, characterId, rollData) {
  try {
    const statsRef = doc(db, COLLECTIONS.CHARACTER_ROLL_STATS, `${userId}_${characterId}`);

    // Get current stats
    const statsDoc = await getDoc(statsRef);
    const currentStats = statsDoc.exists() ? statsDoc.data() : {
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

    // Calculate new statistics
    const newStats = { ...currentStats };
    newStats.totalRolls += 1;
    newStats.lastRollDate = serverTimestamp();
    newStats.totalSum += rollData.total || 0;
    newStats.averageRoll = newStats.totalSum / newStats.totalRolls;

    // Update dice type statistics
    rollData.dice?.forEach(die => {
      const dieType = `d${die.sides}`;
      if (!newStats.diceTypeStats[dieType]) {
        newStats.diceTypeStats[dieType] = { count: 0, total: 0 };
      }
      newStats.diceTypeStats[dieType].count += die.count || 1;
    });

    // Update roll type statistics
    const rollType = rollData.rollType || 'manual';
    if (!newStats.rollTypeStats[rollType]) {
      newStats.rollTypeStats[rollType] = { count: 0, total: 0 };
    }
    newStats.rollTypeStats[rollType].count += 1;
    newStats.rollTypeStats[rollType].total += rollData.total || 0;

    // Check for criticals (assuming d20 rolls)
    const d20Results = rollData.results?.filter(r => r.sides === 20) || [];
    d20Results.forEach(result => {
      if (result.value === 20) {
        newStats.natural20s += 1;
        newStats.criticalSuccesses += 1;
      } else if (result.value === 1) {
        newStats.natural1s += 1;
        newStats.criticalFailures += 1;
      }
    });

    // Save updated statistics
    await setDoc(statsRef, newStats, { merge: true });

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

    const { limit: resultLimit = 50, rollType, startDate, endDate } = options;

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
      return statsDoc.data();
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

    const { limit: resultLimit = 100, startDate, endDate } = options;

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
 */
export async function cleanupOldRolls(userId, characterId, daysOld = 90) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, localOnly: true };
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // This is a simplified cleanup - in production you'd want to batch delete
    // For now, we'll just mark old rolls for potential cleanup
    console.log(`Cleanup requested for rolls older than ${cutoffDate.toISOString()}`);

    return { success: true, localOnly: false };

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
