/**
 * Community Spell Service
 * 
 * This service handles all interactions with the Firebase Firestore database
 * for community-created spells. It provides functionality to:
 * - Browse spells by category/folder
 * - Search spells
 * - Upload new spells
 * - Rate and review spells
 * - Download spells to local library
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
  startAfter,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Collection names
const COLLECTIONS = {
  SPELLS: 'community_spells',
  CATEGORIES: 'spell_categories',
  USERS: 'users',
  RATINGS: 'spell_ratings'
};

// Mock data for when Firebase is not available
const MOCK_CATEGORIES = [
  {
    id: 'damage',
    name: 'Damage Spells',
    description: 'Offensive spells that deal damage to enemies',
    icon: 'spell_fire_fireball02',
    color: '#FF4500',
    spellCount: 15
  },
  {
    id: 'healing',
    name: 'Healing Spells',
    description: 'Restorative spells that heal wounds and cure ailments',
    icon: 'spell_holy_heal',
    color: '#32CD32',
    spellCount: 8
  },
  {
    id: 'utility',
    name: 'Utility Spells',
    description: 'Versatile spells for exploration and problem-solving',
    icon: 'spell_arcane_teleportundercity',
    color: '#4169E1',
    spellCount: 12
  },
  {
    id: 'protection',
    name: 'Protection Spells',
    description: 'Defensive spells that shield and protect',
    icon: 'spell_holy_devotionaura',
    color: '#FFD700',
    spellCount: 6
  },
  {
    id: 'illusion',
    name: 'Illusion Spells',
    description: 'Deceptive spells that manipulate perception',
    icon: 'spell_shadow_charm',
    color: '#9370DB',
    spellCount: 9
  },
  {
    id: 'elemental',
    name: 'Elemental Spells',
    description: 'Spells that harness the power of the elements',
    icon: 'spell_nature_lightning',
    color: '#00CED1',
    spellCount: 18
  }
];

const MOCK_FEATURED_SPELLS = [
  {
    id: 'featured-1',
    name: 'Arcane Missile',
    description: 'A reliable spell that fires multiple magical projectiles at a target.',
    school: 'Evocation',
    level: 1,
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    damage: '1d4+1 force',
    author: 'Community Wizard',
    rating: 4.5,
    ratingCount: 23,
    downloadCount: 156,
    categoryId: 'damage',
    tags: ['damage', 'force', 'reliable']
  },
  {
    id: 'featured-2',
    name: 'Healing Light',
    description: 'A gentle spell that restores health with warm, golden light.',
    school: 'Evocation',
    level: 1,
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    healing: '1d8+2',
    author: 'Temple Healer',
    rating: 4.8,
    ratingCount: 31,
    downloadCount: 203,
    categoryId: 'healing',
    tags: ['healing', 'light', 'touch']
  }
];

// Helper function to check if Firebase is available
const checkFirebaseAvailable = () => {
  if (!db) {
    console.warn('Firebase not available, using mock data');
    return false;
  }
  return true;
};

/**
 * Get all spell categories/folders
 */
export async function getSpellCategories() {
  try {
    if (!checkFirebaseAvailable()) {
      // Return mock data when Firebase is not available
      return MOCK_CATEGORIES;
    }

    const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
    const snapshot = await getDocs(categoriesRef);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching spell categories:', error);
    console.log('Falling back to mock data');
    return MOCK_CATEGORIES;
  }
}

/**
 * Get spells by category with pagination
 */
export async function getSpellsByCategory(categoryId, pageSize = 20, lastDoc = null) {
  try {
    if (!checkFirebaseAvailable()) {
      // Return mock spells for the category
      const mockSpells = MOCK_FEATURED_SPELLS.filter(spell => spell.categoryId === categoryId);
      return {
        spells: mockSpells,
        lastDoc: null,
        hasMore: false
      };
    }

    const spellsRef = collection(db, COLLECTIONS.SPELLS);
    let q = query(
      spellsRef,
      where('categoryId', '==', categoryId),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);

    return {
      spells: snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching spells by category:', error);
    console.log('Falling back to mock data');
    const mockSpells = MOCK_FEATURED_SPELLS.filter(spell => spell.categoryId === categoryId);
    return {
      spells: mockSpells,
      lastDoc: null,
      hasMore: false
    };
  }
}

/**
 * Search spells by name or description
 */
export async function searchSpells(searchTerm, pageSize = 20) {
  try {
    if (!checkFirebaseAvailable()) {
      // Simple mock search
      const searchLower = searchTerm.toLowerCase();
      const results = MOCK_FEATURED_SPELLS.filter(spell =>
        spell.name.toLowerCase().includes(searchLower) ||
        spell.description.toLowerCase().includes(searchLower) ||
        spell.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
      return results;
    }

    const spellsRef = collection(db, COLLECTIONS.SPELLS);

    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that searches by name prefix
    // For production, consider using Algolia or similar service
    const q = query(
      spellsRef,
      where('isPublic', '==', true),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      orderBy('name'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching spells:', error);
    console.log('Falling back to mock search');
    const searchLower = searchTerm.toLowerCase();
    const results = MOCK_FEATURED_SPELLS.filter(spell =>
      spell.name.toLowerCase().includes(searchLower) ||
      spell.description.toLowerCase().includes(searchLower) ||
      spell.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
    return results;
  }
}

/**
 * Get featured/popular spells
 */
export async function getFeaturedSpells(pageSize = 10) {
  try {
    if (!checkFirebaseAvailable()) {
      return MOCK_FEATURED_SPELLS.slice(0, limit);
    }

    const spellsRef = collection(db, COLLECTIONS.SPELLS);
    const q = query(
      spellsRef,
      where('isPublic', '==', true),
      where('isFeatured', '==', true),
      orderBy('rating', 'desc'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching featured spells:', error);
    console.log('Falling back to mock featured spells');
    return MOCK_FEATURED_SPELLS.slice(0, limit);
  }
}

/**
 * Upload a spell to the community
 */
export async function uploadSpell(spellData, userId) {
  try {
    const spellsRef = collection(db, COLLECTIONS.SPELLS);
    
    const communitySpell = {
      ...spellData,
      authorId: userId,
      isPublic: true,
      isFeatured: false,
      rating: 0,
      ratingCount: 0,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(spellsRef, communitySpell);
    
    return {
      id: docRef.id,
      ...communitySpell
    };
  } catch (error) {
    console.error('Error uploading spell:', error);
    throw new Error('Failed to upload spell');
  }
}

/**
 * Download a spell (increment download count)
 */
export async function downloadSpell(spellId) {
  try {
    const spellRef = doc(db, COLLECTIONS.SPELLS, spellId);
    const spellDoc = await getDoc(spellRef);
    
    if (!spellDoc.exists()) {
      throw new Error('Spell not found');
    }

    // Increment download count
    await updateDoc(spellRef, {
      downloadCount: (spellDoc.data().downloadCount || 0) + 1
    });

    return {
      id: spellDoc.id,
      ...spellDoc.data()
    };
  } catch (error) {
    console.error('Error downloading spell:', error);
    throw new Error('Failed to download spell');
  }
}

/**
 * Rate a spell
 */
export async function rateSpell(spellId, userId, rating) {
  try {
    // Add or update rating
    const ratingRef = doc(db, COLLECTIONS.RATINGS, `${spellId}_${userId}`);
    await updateDoc(ratingRef, {
      spellId,
      userId,
      rating,
      createdAt: new Date()
    });

    // Recalculate average rating for the spell
    // This would typically be done with a Cloud Function in production
    await recalculateSpellRating(spellId);
    
  } catch (error) {
    console.error('Error rating spell:', error);
    throw new Error('Failed to rate spell');
  }
}

/**
 * Recalculate average rating for a spell
 */
async function recalculateSpellRating(spellId) {
  try {
    const ratingsRef = collection(db, COLLECTIONS.RATINGS);
    const q = query(ratingsRef, where('spellId', '==', spellId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return;
    }

    const ratings = snapshot.docs.map(doc => doc.data().rating);
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    
    const spellRef = doc(db, COLLECTIONS.SPELLS, spellId);
    await updateDoc(spellRef, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingCount: ratings.length
    });
    
  } catch (error) {
    console.error('Error recalculating spell rating:', error);
  }
}

// Default categories for initial setup
export const DEFAULT_CATEGORIES = [
  {
    id: 'damage',
    name: 'Damage Spells',
    description: 'Spells that deal damage to enemies',
    icon: 'spell_fire_fireball02',
    color: '#FF4500'
  },
  {
    id: 'healing',
    name: 'Healing Spells',
    description: 'Spells that restore health and vitality',
    icon: 'spell_holy_heal',
    color: '#32CD32'
  },
  {
    id: 'utility',
    name: 'Utility Spells',
    description: 'Spells that provide various utility effects',
    icon: 'spell_arcane_teleportundercity',
    color: '#4169E1'
  },
  {
    id: 'control',
    name: 'Control Spells',
    description: 'Spells that control enemies or the battlefield',
    icon: 'spell_frost_frostbolt',
    color: '#00CED1'
  },
  {
    id: 'summoning',
    name: 'Summoning Spells',
    description: 'Spells that summon creatures or objects',
    icon: 'spell_shadow_summonvoidwalker',
    color: '#9370DB'
  }
];

/**
 * Setup function to create initial spell categories
 */
export async function setupSpellCategories() {
  try {
    if (!checkFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    const categories = {
      damage: {
        name: "Damage Spells",
        description: "Offensive spells that deal damage to enemies",
        icon: "spell_fire_fireball02",
        color: "#FF4500",
        spellCount: 0
      },
      healing: {
        name: "Healing Spells",
        description: "Restorative spells that heal wounds and cure ailments",
        icon: "spell_holy_heal",
        color: "#32CD32",
        spellCount: 0
      },
      utility: {
        name: "Utility Spells",
        description: "Versatile spells for exploration and problem-solving",
        icon: "spell_arcane_teleportundercity",
        color: "#4169E1",
        spellCount: 0
      },
      protection: {
        name: "Protection Spells",
        description: "Defensive spells that shield and protect",
        icon: "spell_holy_devotionaura",
        color: "#FFD700",
        spellCount: 0
      },
      illusion: {
        name: "Illusion Spells",
        description: "Deceptive spells that manipulate perception",
        icon: "spell_shadow_charm",
        color: "#9370DB",
        spellCount: 0
      },
      elemental: {
        name: "Elemental Spells",
        description: "Spells that harness the power of the elements",
        icon: "spell_nature_lightning",
        color: "#00CED1",
        spellCount: 0
      }
    };

    const results = [];
    for (const [categoryId, categoryData] of Object.entries(categories)) {
      try {
        const categoryRef = doc(db, 'spell_categories', categoryId);
        await setDoc(categoryRef, categoryData);
        results.push(`✅ Created: ${categoryData.name}`);
      } catch (error) {
        results.push(`❌ Failed: ${categoryData.name} - ${error.message}`);
      }
    }

    return results;
  } catch (error) {
    console.error('Error setting up spell categories:', error);
    throw error;
  }
}

// Debug function to check Firebase status
export function debugFirebaseStatus() {
  console.log('=== Firebase Debug Info ===');
  console.log('DB available:', !!db);
  console.log('Firebase available:', typeof window !== 'undefined' && !!window.firebase);
  console.log('checkFirebaseAvailable():', checkFirebaseAvailable());

  if (db) {
    console.log('Database instance:', db);
    console.log('App:', db.app);
  }

  return {
    dbAvailable: !!db,
    firebaseAvailable: typeof window !== 'undefined' && !!window.firebase,
    checkResult: checkFirebaseAvailable()
  };
}

// Simple setup function that works directly
async function simpleSetupCategories() {
  console.log('🔥 Starting simple category setup...');

  if (!db) {
    console.error('❌ Database not available');
    return ['❌ Database not available'];
  }

  // Try to authenticate first
  try {
    const { getAuth, signInAnonymously } = await import('firebase/auth');
    const auth = getAuth();

    if (!auth.currentUser) {
      console.log('🔐 Signing in anonymously...');
      await signInAnonymously(auth);
      console.log('✅ Authenticated successfully');
    }
  } catch (authError) {
    console.warn('⚠️ Authentication failed, trying without auth:', authError.message);
    return ['❌ Authentication failed. Please enable Anonymous authentication in Firebase Console.'];
  }

  const categories = {
    damage: {
      name: "Damage Spells",
      description: "Offensive spells that deal damage to enemies",
      icon: "spell_fire_fireball02",
      color: "#FF4500",
      spellCount: 0
    },
    healing: {
      name: "Healing Spells",
      description: "Restorative spells that heal wounds and cure ailments",
      icon: "spell_holy_heal",
      color: "#32CD32",
      spellCount: 0
    },
    utility: {
      name: "Utility Spells",
      description: "Versatile spells for exploration and problem-solving",
      icon: "spell_arcane_teleportundercity",
      color: "#4169E1",
      spellCount: 0
    }
  };

  const results = [];
  for (const [categoryId, categoryData] of Object.entries(categories)) {
    try {
      const categoryRef = doc(db, 'spell_categories', categoryId);
      await setDoc(categoryRef, categoryData);
      results.push(`✅ Created: ${categoryData.name}`);
      console.log(`✅ Created: ${categoryData.name}`);
    } catch (error) {
      results.push(`❌ Failed: ${categoryData.name} - ${error.message}`);
      console.error(`❌ Failed: ${categoryData.name}`, error);
    }
  }

  return results;
}

// Test function to check what we have
async function testCommunityData() {
  console.log('🔍 Testing community data...');

  if (!db) {
    console.error('❌ Database not available');
    return;
  }

  try {
    const { collection, getDocs } = await import('firebase/firestore');

    // Check categories
    const categoriesRef = collection(db, 'spell_categories');
    const categoriesSnapshot = await getDocs(categoriesRef);

    console.log(`📚 Found ${categoriesSnapshot.size} categories:`);
    categoriesSnapshot.forEach(doc => {
      console.log(`  - ${doc.id}:`, doc.data());
    });

    // Check spells
    const spellsRef = collection(db, 'community_spells');
    const spellsSnapshot = await getDocs(spellsRef);

    console.log(`✨ Found ${spellsSnapshot.size} community spells:`);
    spellsSnapshot.forEach(doc => {
      console.log(`  - ${doc.id}:`, doc.data().name);
    });

    return {
      categories: categoriesSnapshot.size,
      spells: spellsSnapshot.size
    };
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { error: error.message };
  }
}

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.setupSpellCategories = setupSpellCategories;
  window.simpleSetupCategories = simpleSetupCategories;
  window.debugFirebaseStatus = debugFirebaseStatus;
  window.testCommunityData = testCommunityData;
}

// Make setup function available globally for easy access
if (typeof window !== 'undefined') {
  window.setupSpellCategories = setupSpellCategories;
  window.debugFirebaseStatus = debugFirebaseStatus;
  window.simpleSetupCategories = simpleSetupCategories;
}
