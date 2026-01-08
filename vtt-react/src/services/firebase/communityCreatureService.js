/**
 * Community Creature Service
 * 
 * This service handles all interactions with the Firebase Firestore database
 * for community-created creatures. It provides functionality to:
 * - Browse creatures by category/folder
 * - Search creatures
 * - Upload new creatures
 * - Rate and review creatures
 * - Download creatures to local library
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
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
  CREATURES: 'community_creatures',
  CATEGORIES: 'creature_categories',
  USERS: 'users',
  RATINGS: 'creature_ratings'
};

// Check if Firebase is available
function checkFirebaseAvailable() {
  return db !== null && db !== undefined;
}

// Mock data for when Firebase is not available
const MOCK_CATEGORIES = [
  {
    id: 'humanoids',
    name: 'Humanoids',
    description: 'Human-like creatures including NPCs and intelligent beings',
    icon: 'inv_misc_head_human_01',
    color: '#8B4513',
    creatureCount: 0
  },
  {
    id: 'beasts',
    name: 'Beasts',
    description: 'Natural animals and wildlife',
    icon: 'ability_hunter_pet_wolf',
    color: '#2d5016',
    creatureCount: 0
  },
  {
    id: 'undead',
    name: 'Undead',
    description: 'Zombies, skeletons, and other undead creatures',
    icon: 'spell_shadow_raisedead',
    color: '#5a1e12',
    creatureCount: 0
  },
  {
    id: 'dragons',
    name: 'Dragons',
    description: 'Mighty dragons and dragonkin',
    icon: 'inv_misc_head_dragon_01',
    color: '#a08c70',
    creatureCount: 0
  },
  {
    id: 'elementals',
    name: 'Elementals',
    description: 'Creatures of pure elemental energy',
    icon: 'spell_fire_elemental_totem',
    color: '#b8860b',
    creatureCount: 0
  },
  {
    id: 'fiends',
    name: 'Fiends',
    description: 'Demons, devils, and other evil outsiders',
    icon: 'spell_shadow_summoninfernal',
    color: '#8b7355',
    creatureCount: 0
  }
];

const MOCK_FEATURED_CREATURES = [
  {
    id: 'mock-creature-1',
    name: 'Ancient Red Dragon',
    description: 'A massive, ancient dragon with scales like molten lava',
    type: 'dragon',
    size: 'gargantuan',
    categoryId: 'dragons',
    authorId: 'mock-author',
    isPublic: true,
    isFeatured: true,
    rating: 4.9,
    ratingCount: 45,
    downloadCount: 234,
    tags: ['dragon', 'fire', 'ancient', 'boss'],
    creatureData: {
      stats: {
        strength: 30,
        agility: 10,
        constitution: 29,
        intelligence: 18,
        spirit: 15,
        charisma: 23,
        maxHp: 546,
        currentHp: 546,
        maxMana: 200,
        currentMana: 200,
        armor: 22,
        initiative: 10
      },
      tokenIcon: 'inv_misc_head_dragon_red',
      tokenBorder: '#FF0000'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'mock-creature-2',
    name: 'Forest Guardian',
    description: 'A wise treant that protects the ancient woods',
    type: 'plant',
    size: 'huge',
    categoryId: 'beasts',
    authorId: 'mock-author-2',
    isPublic: true,
    isFeatured: true,
    rating: 4.6,
    ratingCount: 32,
    downloadCount: 187,
    tags: ['treant', 'nature', 'guardian', 'forest'],
    creatureData: {
      stats: {
        strength: 23,
        agility: 8,
        constitution: 21,
        intelligence: 12,
        spirit: 16,
        charisma: 12,
        maxHp: 138,
        currentHp: 138,
        maxMana: 80,
        currentMana: 80,
        armor: 16,
        initiative: 8
      },
      tokenIcon: 'spell_nature_treant',
      tokenBorder: '#228B22'
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

/**
 * Get all creature categories/folders
 */
export async function getCreatureCategories() {
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
    console.error('Error fetching creature categories:', error);
    return MOCK_CATEGORIES;
  }
}

/**
 * Get all shared community creatures (similar to getAllCommunitySpells)
 */
export async function getAllCommunityCreatures(pageSize = 20, lastDoc = null, sortBy = 'rating') {
  try {
    if (!checkFirebaseAvailable()) {
      return {
        creatures: [],
        lastDoc: null,
        hasMore: false
      };
    }

    const creaturesRef = collection(db, COLLECTIONS.CREATURES);
    
    // Build query - get all public shared creatures
    try {
      let orderField = 'createdAt';
      if (sortBy === 'rating') orderField = 'rating';
      else if (sortBy === 'downloads') orderField = 'downloadCount';
      else if (sortBy === 'newest') orderField = 'createdAt';

      let q = query(
        creaturesRef,
        where('isPublic', '==', true),
        orderBy(orderField, sortBy === 'rating' || sortBy === 'downloads' ? 'desc' : 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);

      return {
        creatures: snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (queryError) {
      // If orderBy fails, try without it
      console.warn('Query with orderBy failed, trying without:', queryError);
      let q = query(
        creaturesRef,
        where('isPublic', '==', true),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);

      return {
        creatures: snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === pageSize
      };
    }
  } catch (error) {
    console.error('Error fetching community creatures:', error);
    return {
      creatures: [],
      lastDoc: null,
      hasMore: false
    };
  }
}

/**
 * Get creatures by category with pagination
 */
export async function getCreaturesByCategory(categoryId, pageSize = 20, lastDoc = null) {
  try {
    if (!checkFirebaseAvailable()) {
      // Return mock creatures for the category
      const mockCreatures = MOCK_FEATURED_CREATURES.filter(creature => creature.categoryId === categoryId);
      return {
        creatures: mockCreatures,
        lastDoc: null,
        hasMore: false
      };
    }

    const creaturesRef = collection(db, COLLECTIONS.CREATURES);
    let q = query(
      creaturesRef,
      where('categoryId', '==', categoryId),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const creatures = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      creatures,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching creatures by category:', error);
    const mockCreatures = MOCK_FEATURED_CREATURES.filter(creature => creature.categoryId === categoryId);
    return {
      creatures: mockCreatures,
      lastDoc: null,
      hasMore: false
    };
  }
}

/**
 * Search creatures by name/tags
 */
export async function searchCreatures(searchTerm, pageSize = 20) {
  try {
    if (!checkFirebaseAvailable()) {
      // Return filtered mock creatures
      const filteredCreatures = MOCK_FEATURED_CREATURES.filter(creature =>
        creature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creature.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return filteredCreatures;
    }

    const creaturesRef = collection(db, COLLECTIONS.CREATURES);

    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that searches by name prefix
    // For production, consider using Algolia or similar service
    const q = query(
      creaturesRef,
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
    console.error('Error searching creatures:', error);
    const filteredCreatures = MOCK_FEATURED_CREATURES.filter(creature =>
      creature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creature.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return filteredCreatures;
  }
}

/**
 * Get featured/popular creatures
 */
export async function getFeaturedCreatures(pageSize = 10) {
  try {
    if (!checkFirebaseAvailable()) {
      return MOCK_FEATURED_CREATURES.slice(0, pageSize);
    }

    const creaturesRef = collection(db, COLLECTIONS.CREATURES);
    const q = query(
      creaturesRef,
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
    console.error('Error fetching featured creatures:', error);
    return MOCK_FEATURED_CREATURES.slice(0, pageSize);
  }
}

/**
 * Upload a creature to the community
 */
export async function uploadCreature(creatureData, userId) {
  try {
    const creaturesRef = collection(db, COLLECTIONS.CREATURES);
    
    const communityCreature = {
      ...creatureData,
      authorId: userId,
      isPublic: true,
      isFeatured: false,
      rating: 0,
      ratingCount: 0,
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(creaturesRef, communityCreature);
    
    return {
      id: docRef.id,
      ...communityCreature
    };
  } catch (error) {
    console.error('Error uploading creature:', error);
    throw new Error('Failed to upload creature');
  }
}

/**
 * Download a creature (increment download count)
 */
export async function downloadCreature(creatureId) {
  try {
    const creatureRef = doc(db, COLLECTIONS.CREATURES, creatureId);
    const creatureDoc = await getDoc(creatureRef);

    if (!creatureDoc.exists()) {
      throw new Error('Creature not found');
    }

    // Increment download count
    await updateDoc(creatureRef, {
      downloadCount: (creatureDoc.data().downloadCount || 0) + 1
    });

    return {
      id: creatureDoc.id,
      ...creatureDoc.data()
    };
  } catch (error) {
    console.error('Error downloading creature:', error);
    throw new Error('Failed to download creature');
  }
}

/**
 * Rate a creature
 */
export async function rateCreature(creatureId, userId, rating) {
  try {
    // Add or update rating
    const ratingRef = doc(db, COLLECTIONS.RATINGS, `${creatureId}_${userId}`);
    await setDoc(ratingRef, {
      creatureId,
      userId,
      rating,
      createdAt: new Date()
    });

    // Recalculate average rating for the creature
    // This would typically be done with a Cloud Function in production
    await recalculateCreatureRating(creatureId);

  } catch (error) {
    console.error('Error rating creature:', error);
    throw new Error('Failed to rate creature');
  }
}

/**
 * Recalculate average rating for a creature
 */
async function recalculateCreatureRating(creatureId) {
  try {
    const ratingsRef = collection(db, COLLECTIONS.RATINGS);
    const q = query(ratingsRef, where('creatureId', '==', creatureId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return;
    }

    const ratings = snapshot.docs.map(doc => doc.data().rating);
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    const creatureRef = doc(db, COLLECTIONS.CREATURES, creatureId);
    await updateDoc(creatureRef, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingCount: ratings.length
    });

  } catch (error) {
    console.error('Error recalculating creature rating:', error);
  }
}

// Default categories for initial setup
export const DEFAULT_CREATURE_CATEGORIES = [
  {
    id: 'humanoids',
    name: 'Humanoids',
    description: 'Human-like creatures including NPCs and intelligent beings',
    icon: 'inv_misc_head_human_01',
    color: '#8B4513'
  },
  {
    id: 'beasts',
    name: 'Beasts',
    description: 'Natural animals and wildlife',
    icon: 'ability_hunter_pet_wolf',
    color: '#2d5016'
  },
  {
    id: 'undead',
    name: 'Undead',
    description: 'Zombies, skeletons, and other undead creatures',
    icon: 'spell_shadow_raisedead',
    color: '#5a1e12'
  },
  {
    id: 'dragons',
    name: 'Dragons',
    description: 'Mighty dragons and dragonkin',
    icon: 'inv_misc_head_dragon_01',
    color: '#a08c70'
  },
  {
    id: 'elementals',
    name: 'Elementals',
    description: 'Creatures of pure elemental energy',
    icon: 'spell_fire_elemental_totem',
    color: '#b8860b'
  },
  {
    id: 'fiends',
    name: 'Fiends',
    description: 'Demons, devils, and other evil outsiders',
    icon: 'spell_shadow_summoninfernal',
    color: '#8b7355'
  }
];

/**
 * Initialize default creature categories in Firebase
 */
export async function initializeCreatureCategories() {
  if (!checkFirebaseAvailable()) {
    return [];
  }

  const categories = {
    humanoids: {
      name: "Humanoids",
      description: "Human-like creatures including NPCs and intelligent beings",
      icon: "inv_misc_head_human_01",
      color: "#8B4513",
      creatureCount: 0
    },
    beasts: {
      name: "Beasts",
      description: "Natural animals and wildlife",
      icon: "ability_hunter_pet_wolf",
      color: "#2d5016",
      creatureCount: 0
    },
    undead: {
      name: "Undead",
      description: "Zombies, skeletons, and other undead creatures",
      icon: "spell_shadow_raisedead",
      color: "#5a1e12",
      creatureCount: 0
    },
    dragons: {
      name: "Dragons",
      description: "Mighty dragons and dragonkin",
      icon: "inv_misc_head_dragon_01",
      color: "#a08c70",
      creatureCount: 0
    },
    elementals: {
      name: "Elementals",
      description: "Creatures of pure elemental energy",
      icon: "spell_fire_elemental_totem",
      color: "#b8860b",
      creatureCount: 0
    },
    fiends: {
      name: "Fiends",
      description: "Demons, devils, and other evil outsiders",
      icon: "spell_shadow_summoninfernal",
      color: "#8b7355",
      creatureCount: 0
    }
  };

  const results = [];
  for (const [categoryId, categoryData] of Object.entries(categories)) {
    try {
      const categoryRef = doc(db, COLLECTIONS.CATEGORIES, categoryId);
      await setDoc(categoryRef, categoryData);
      results.push(`✅ Created: ${categoryData.name}`);
    } catch (error) {
      results.push(`❌ Failed: ${categoryData.name} - ${error.message}`);
      console.error(`❌ Failed: ${categoryData.name}`, error);
    }
  }

  return results;
}
