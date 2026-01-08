/**
 * Character Persistence Service
 * 
 * This service handles all character data persistence to Firebase Firestore.
 * It provides secure, validated character storage tied to user accounts.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured, isDemoMode } from '../../config/firebase';

// Import backup service for automatic backups
let characterBackupService = null;
const getBackupService = async () => {
  if (!characterBackupService) {
    const module = await import('./characterBackupService');
    characterBackupService = module.default;
  }
  return characterBackupService;
};

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  CHARACTERS: 'characters',
  CHARACTER_SESSIONS: 'characterSessions'
};

/**
 * Validate character data structure
 */
function validateCharacterData(characterData) {
  const required = ['name', 'race', 'class', 'stats', 'resources'];
  const missing = required.filter(field => !characterData[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required character fields: ${missing.join(', ')}`);
  }

  // Validate stats
  const statNames = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];
  const stats = characterData.stats;
  for (const stat of statNames) {
    if (typeof stats[stat] !== 'number' || stats[stat] < 1 || stats[stat] > 30) {
      throw new Error(`Invalid ${stat} value: ${stats[stat]}`);
    }
  }

  // Validate resources
  const resources = characterData.resources;
  if (!resources.health || !resources.mana || !resources.actionPoints) {
    throw new Error('Invalid resources structure');
  }

  return true;
}

/**
 * Transform character data for Firestore storage
 */
function transformForStorage(characterData, userId) {
  const now = new Date();
  
  return {
    metadata: {
      id: characterData.id,
      userId: userId,
      name: characterData.name,
      createdAt: characterData.createdAt || now,
      updatedAt: now,
      lastPlayedAt: characterData.lastPlayedAt || now,
      version: (characterData.version || 0) + 1
    },
    basicInfo: {
      race: characterData.race || '',
      subrace: characterData.subrace || '',
      class: characterData.class || '',
      level: characterData.level || 1,
      alignment: characterData.alignment || 'Neutral Good',
      exhaustionLevel: characterData.exhaustionLevel || 0
    },
    stats: {
      strength: characterData.stats?.strength || 10,
      agility: characterData.stats?.agility || 10,
      constitution: characterData.stats?.constitution || 10,
      intelligence: characterData.stats?.intelligence || 10,
      spirit: characterData.stats?.spirit || 10,
      charisma: characterData.stats?.charisma || 10
    },
    resources: {
      health: characterData.resources?.health || { current: 100, max: 100 },
      mana: characterData.resources?.mana || { current: 50, max: 50 },
      actionPoints: characterData.resources?.actionPoints || { current: 3, max: 3 }
    },
    inventory: {
      items: characterData.inventory?.items || [],
      currency: characterData.inventory?.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
      encumbranceState: characterData.inventory?.encumbranceState || 'normal'
    },
    equipment: {
      weapon: characterData.equipment?.weapon || null,
      armor: characterData.equipment?.armor || null,
      shield: characterData.equipment?.shield || null,
      accessories: characterData.equipment?.accessories || []
    },
    spells: characterData.spells || [],
    lore: {
      background: characterData.lore?.background || '',
      personalityTraits: characterData.lore?.personalityTraits || '',
      ideals: characterData.lore?.ideals || '',
      bonds: characterData.lore?.bonds || '',
      flaws: characterData.lore?.flaws || '',
      appearance: characterData.lore?.appearance || '',
      backstory: characterData.lore?.backstory || '',
      goals: characterData.lore?.goals || '',
      fears: characterData.lore?.fears || '',
      allies: characterData.lore?.allies || '',
      enemies: characterData.lore?.enemies || '',
      organizations: characterData.lore?.organizations || '',
      notes: characterData.lore?.notes || '',
      characterImage: characterData.lore?.characterImage || null,
      imageTransformations: characterData.lore?.imageTransformations || null
    },
    gameState: {
      experience: characterData.experience || 0,
      sessionData: {
        currentRoomId: null,
        lastSavedAt: now,
        pendingChanges: {}
      }
    }
  };
}

/**
 * Transform Firestore data back to character format
 */
function transformFromStorage(firestoreData) {
  if (!firestoreData) return null;

  return {
    id: firestoreData.metadata?.id,
    name: firestoreData.metadata?.name,
    race: firestoreData.basicInfo?.race,
    subrace: firestoreData.basicInfo?.subrace,
    class: firestoreData.basicInfo?.class,
    level: firestoreData.basicInfo?.level,
    alignment: firestoreData.basicInfo?.alignment,
    exhaustionLevel: firestoreData.basicInfo?.exhaustionLevel,
    stats: firestoreData.stats,
    resources: firestoreData.resources,
    inventory: firestoreData.inventory,
    equipment: firestoreData.equipment,
    spells: firestoreData.spells,
    lore: firestoreData.lore,
    experience: firestoreData.gameState?.experience,
    createdAt: firestoreData.metadata?.createdAt,
    updatedAt: firestoreData.metadata?.updatedAt,
    lastPlayedAt: firestoreData.metadata?.lastPlayedAt,
    version: firestoreData.metadata?.version
  };
}

/**
 * Character Persistence Service Class
 */
class CharacterPersistenceService {
  constructor() {
    this.isConfigured = isFirebaseConfigured && !isDemoMode;
    
    // CRITICAL FIX: Log configuration status for debugging
  }

  /**
   * Create a new character
   */
  async createCharacter(characterData, userId) {
    if (!this.isConfigured || !db) {
      const reason = !this.isConfigured ? 'Service not configured' : 'Database not available';
      console.error('❌ [Firebase] createCharacter failed:', {
        reason,
        isConfigured: this.isConfigured,
        hasDb: !!db,
        isDemoMode: isDemoMode,
        isFirebaseConfigured: isFirebaseConfigured
      });
      throw new Error('Firebase not configured');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // Validate character data
      validateCharacterData(characterData);

      // Generate character ID if not provided
      const characterId = characterData.id || `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Transform data for storage
      const firestoreData = transformForStorage({ ...characterData, id: characterId }, userId);

      // Use transaction to ensure consistency
      const result = await runTransaction(db, async (transaction) => {
        // IMPORTANT: All reads must come before all writes in Firestore transactions

        // First, read the user document to check if it exists
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        const userDoc = await transaction.get(userRef);

        // Now perform all writes
        // Create character document
        const characterRef = doc(db, COLLECTIONS.CHARACTERS, characterId);
        transaction.set(characterRef, firestoreData);

        // Update user's character list
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const characters = userData.characters || [];
          if (!characters.includes(characterId)) {
            characters.push(characterId);
            transaction.update(userRef, {
              characters,
              updatedAt: serverTimestamp()
            });
          }
        } else {
          // Create user document if it doesn't exist
          transaction.set(userRef, {
            characters: [characterId],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }

        return characterId;
      });

      return result;

    } catch (error) {
      console.error('Error creating character:', error);
      throw new Error(`Failed to create character: ${error.message}`);
    }
  }

  /**
   * Load a character by ID
   */
  async loadCharacter(characterId, userId) {
    if (!this.isConfigured || !db) {
      const reason = !this.isConfigured ? 'Service not configured' : 'Database not available';
      console.error('❌ [Firebase] loadCharacter failed:', {
        reason,
        isConfigured: this.isConfigured,
        hasDb: !!db,
        isDemoMode: isDemoMode,
        isFirebaseConfigured: isFirebaseConfigured
      });
      throw new Error('Firebase not configured');
    }

    if (!characterId || !userId) {
      throw new Error('Character ID and User ID are required');
    }

    try {
      const characterRef = doc(db, COLLECTIONS.CHARACTERS, characterId);
      const characterDoc = await getDoc(characterRef);

      if (!characterDoc.exists()) {
        throw new Error('Character not found');
      }

      const characterData = characterDoc.data();

      // Verify ownership
      if (characterData.metadata?.userId !== userId) {
        throw new Error('Access denied: Character does not belong to user');
      }

      // Update last played timestamp
      await updateDoc(characterRef, {
        'metadata.lastPlayedAt': serverTimestamp()
      });

      const character = transformFromStorage(characterData);
      return character;

    } catch (error) {
      console.error('Error loading character:', error);
      throw new Error(`Failed to load character: ${error.message}`);
    }
  }

  /**
   * Check if user is properly authenticated for Firebase operations
   */
  async checkAuthentication() {
    if (!this.isConfigured || !auth) {
      return false;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.warn('🔐 No authenticated user found');
        return false;
      }

      // Check if the user's token is still valid
      const token = await currentUser.getIdToken(false);
      if (!token) {
        console.warn('🔐 User token is invalid');
        return false;
      }

      console.log(`✅ User authenticated: ${currentUser.uid}`);
      return true;
    } catch (error) {
      console.error('❌ Authentication check failed:', error);
      return false;
    }
  }

  /**
   * Load all characters for a user
   */
  async loadUserCharacters(userId) {
    // CRITICAL FIX: Enhanced logging for Firebase operation tracking
    console.log('🔥 [Firebase] loadUserCharacters called:', {
      userId,
      isConfigured: this.isConfigured,
      hasDb: !!db,
      isDemoMode: isDemoMode,
      isFirebaseConfigured: isFirebaseConfigured
    });
    
    if (!this.isConfigured || !db) {
      const reason = !this.isConfigured ? 'Service not configured' : 'Database not available';
      console.error('❌ [Firebase] loadUserCharacters failed:', {
        reason,
        isConfigured: this.isConfigured,
        hasDb: !!db,
        isDemoMode: isDemoMode,
        isFirebaseConfigured: isFirebaseConfigured
      });
      throw new Error('Firebase not configured');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Check authentication before proceeding
    const isAuthenticated = await this.checkAuthentication();
    if (!isAuthenticated) {
      throw new Error('User not properly authenticated for Firebase access');
    }

    try {
      const charactersQuery = query(
        collection(db, COLLECTIONS.CHARACTERS),
        where('metadata.userId', '==', userId),
        orderBy('metadata.lastPlayedAt', 'desc')
      );

      const querySnapshot = await getDocs(charactersQuery);
      const characters = [];

      querySnapshot.forEach((doc) => {
        const character = transformFromStorage(doc.data());
        if (character) {
          characters.push(character);
        }
      });

      console.log(`✅ Loaded ${characters.length} characters for user ${userId}`);
      return characters;

    } catch (error) {
      console.error('Error loading user characters:', error);

      // Handle specific Firebase errors more gracefully
      if (error.code === 'permission-denied') {
        console.warn('🔒 Firebase permission denied - user may not be properly authenticated');
        throw new Error('Permission denied: Please ensure you are logged in and try again');
      } else if (error.code === 'unavailable') {
        console.warn('🌐 Firebase service unavailable - network or server issue');
        throw new Error('Service unavailable: Please check your internet connection and try again');
      } else if (error.code === 'unauthenticated') {
        console.warn('🔐 User not authenticated for Firebase access');
        throw new Error('Authentication required: Please log in and try again');
      }

      throw new Error(`Failed to load characters: ${error.message}`);
    }
  }

  /**
   * Save character data
   */
  async saveCharacter(characterData, userId) {
    // CRITICAL FIX: Enhanced logging for Firebase operation tracking
    console.log('🔥 [Firebase] saveCharacter called:', {
      characterId: characterData.id,
      characterName: characterData.name,
      userId: userId,
      isConfigured: this.isConfigured,
      hasDb: !!db,
      isDemoMode: isDemoMode,
      isFirebaseConfigured: isFirebaseConfigured
    });
    
    if (!this.isConfigured || !db) {
      const reason = !this.isConfigured ? 'Service not configured' : 'Database not available';
      console.error('❌ [Firebase] saveCharacter failed:', {
        reason,
        isConfigured: this.isConfigured,
        hasDb: !!db,
        isDemoMode: isDemoMode,
        isFirebaseConfigured: isFirebaseConfigured
      });
      throw new Error('Firebase not configured');
    }

    if (!characterData.id || !userId) {
      throw new Error('Character ID and User ID are required');
    }

    try {
      // Create automatic backup if needed
      try {
        const backupService = await getBackupService();
        await backupService.autoBackup(characterData.id, userId, characterData);
      } catch (backupError) {
        console.warn('Failed to create automatic backup:', backupError);
        // Continue with save even if backup fails
      }

      // Validate character data
      validateCharacterData(characterData);

      // Transform data for storage
      const firestoreData = transformForStorage(characterData, userId);

      // Update character document
      const characterRef = doc(db, COLLECTIONS.CHARACTERS, characterData.id);
      await updateDoc(characterRef, firestoreData);

      console.log(`✅ Character saved: ${characterData.name} (${characterData.id})`);
      return true;

    } catch (error) {
      console.error('Error saving character:', error);
      throw new Error(`Failed to save character: ${error.message}`);
    }
  }

  /**
   * Delete a character (soft delete)
   */
  async deleteCharacter(characterId, userId) {
    if (!this.isConfigured || !db) {
      throw new Error('Firebase not configured');
    }

    if (!characterId || !userId) {
      throw new Error('Character ID and User ID are required');
    }

    try {
      const result = await runTransaction(db, async (transaction) => {
        // Verify ownership
        const characterRef = doc(db, COLLECTIONS.CHARACTERS, characterId);
        const characterDoc = await transaction.get(characterRef);

        if (!characterDoc.exists()) {
          throw new Error('Character not found');
        }

        const characterData = characterDoc.data();
        if (characterData.metadata?.userId !== userId) {
          throw new Error('Access denied: Character does not belong to user');
        }

        // Soft delete by marking as deleted
        transaction.update(characterRef, {
          'metadata.deletedAt': serverTimestamp(),
          'metadata.updatedAt': serverTimestamp()
        });

        // Remove from user's character list
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        const userDoc = await transaction.get(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const characters = (userData.characters || []).filter(id => id !== characterId);
          transaction.update(userRef, { characters });
        }

        return true;
      });

      console.log(`✅ Character deleted: ${characterId}`);
      return result;

    } catch (error) {
      console.error('Error deleting character:', error);
      throw new Error(`Failed to delete character: ${error.message}`);
    }
  }
}

// Export singleton instance
const characterPersistenceService = new CharacterPersistenceService();
export default characterPersistenceService;
