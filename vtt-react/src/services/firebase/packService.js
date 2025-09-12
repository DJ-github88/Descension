/**
 * Pack Management Service
 * 
 * This service handles all interactions with the Firebase Firestore database
 * for community packs (collections of items and/or creatures). It provides functionality to:
 * - Create and manage packs
 * - Browse packs by category/type
 * - Search packs
 * - Upload new packs
 * - Rate and review packs
 * - Download packs to local library
 * - Handle pack versioning and dependencies
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
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Collection names
const COLLECTIONS = {
  PACKS: 'community_packs',
  ITEMS: 'community_items',
  CREATURES: 'community_creatures',
  USERS: 'users',
  RATINGS: 'pack_ratings'
};

// Pack types
export const PACK_TYPES = {
  ITEMS: 'items',
  CREATURES: 'creatures',
  MIXED: 'mixed'
};

// Check if Firebase is available
function checkFirebaseAvailable() {
  return db !== null && db !== undefined;
}

// Mock data for when Firebase is not available
const MOCK_FEATURED_PACKS = [
  {
    id: 'mock-pack-1',
    name: 'Medieval Weapons Collection',
    description: 'A comprehensive collection of medieval weapons including swords, axes, and bows',
    type: PACK_TYPES.ITEMS,
    categoryId: 'weapons',
    authorId: 'mock-author',
    isPublic: true,
    isFeatured: true,
    rating: 4.7,
    ratingCount: 23,
    downloadCount: 145,
    tags: ['medieval', 'weapons', 'combat'],
    version: '1.2.0',
    items: ['sword-1', 'axe-1', 'bow-1', 'dagger-1'],
    creatures: [],
    dependencies: [],
    compatibility: {
      minVersion: '1.0.0',
      maxVersion: '2.0.0'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'mock-pack-2',
    name: 'Forest Encounter Pack',
    description: 'A collection of forest creatures and related items for woodland adventures',
    type: PACK_TYPES.MIXED,
    categoryId: 'nature',
    authorId: 'mock-author-2',
    isPublic: true,
    isFeatured: true,
    rating: 4.5,
    ratingCount: 18,
    downloadCount: 89,
    tags: ['forest', 'nature', 'encounter', 'adventure'],
    version: '1.0.0',
    items: ['herb-potion', 'wooden-staff'],
    creatures: ['forest-guardian', 'dire-wolf', 'forest-sprite'],
    dependencies: [],
    compatibility: {
      minVersion: '1.0.0',
      maxVersion: '1.5.0'
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

/**
 * Get packs by type with pagination
 */
export async function getPacksByType(packType, pageSize = 20, lastDoc = null) {
  try {
    if (!checkFirebaseAvailable()) {
      // Return mock packs for the type
      const mockPacks = MOCK_FEATURED_PACKS.filter(pack => pack.type === packType);
      return {
        packs: mockPacks,
        lastDoc: null,
        hasMore: false
      };
    }

    const packsRef = collection(db, COLLECTIONS.PACKS);
    let q = query(
      packsRef,
      where('type', '==', packType),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const packs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      packs,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching packs by type:', error);
    console.log('Falling back to mock data');
    const mockPacks = MOCK_FEATURED_PACKS.filter(pack => pack.type === packType);
    return {
      packs: mockPacks,
      lastDoc: null,
      hasMore: false
    };
  }
}

/**
 * Search packs by name/tags
 */
export async function searchPacks(searchTerm, pageSize = 20) {
  try {
    if (!checkFirebaseAvailable()) {
      // Return filtered mock packs
      const filteredPacks = MOCK_FEATURED_PACKS.filter(pack =>
        pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return filteredPacks;
    }

    const packsRef = collection(db, COLLECTIONS.PACKS);

    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that searches by name prefix
    // For production, consider using Algolia or similar service
    const q = query(
      packsRef,
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
    console.error('Error searching packs:', error);
    console.log('Falling back to mock search');
    const filteredPacks = MOCK_FEATURED_PACKS.filter(pack =>
      pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return filteredPacks;
  }
}

/**
 * Get featured/popular packs
 */
export async function getFeaturedPacks(pageSize = 10) {
  try {
    if (!checkFirebaseAvailable()) {
      return MOCK_FEATURED_PACKS.slice(0, pageSize);
    }

    const packsRef = collection(db, COLLECTIONS.PACKS);
    const q = query(
      packsRef,
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
    console.error('Error fetching featured packs:', error);
    console.log('Falling back to mock featured packs');
    return MOCK_FEATURED_PACKS.slice(0, pageSize);
  }
}

/**
 * Create a new pack
 */
export async function createPack(packData, userId) {
  try {
    const packsRef = collection(db, COLLECTIONS.PACKS);
    
    const communityPack = {
      ...packData,
      authorId: userId,
      isPublic: true,
      isFeatured: false,
      rating: 0,
      ratingCount: 0,
      downloadCount: 0,
      version: packData.version || '1.0.0',
      dependencies: packData.dependencies || [],
      compatibility: packData.compatibility || {
        minVersion: '1.0.0',
        maxVersion: '2.0.0'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(packsRef, communityPack);
    
    return {
      id: docRef.id,
      ...communityPack
    };
  } catch (error) {
    console.error('Error creating pack:', error);
    throw new Error('Failed to create pack');
  }
}

/**
 * Download a pack (increment download count)
 */
export async function downloadPack(packId) {
  try {
    const packRef = doc(db, COLLECTIONS.PACKS, packId);
    const packDoc = await getDoc(packRef);
    
    if (!packDoc.exists()) {
      throw new Error('Pack not found');
    }

    // Increment download count
    await updateDoc(packRef, {
      downloadCount: (packDoc.data().downloadCount || 0) + 1
    });

    return {
      id: packDoc.id,
      ...packDoc.data()
    };
  } catch (error) {
    console.error('Error downloading pack:', error);
    throw new Error('Failed to download pack');
  }
}

/**
 * Get pack contents (items and creatures)
 */
export async function getPackContents(packId) {
  try {
    const packRef = doc(db, COLLECTIONS.PACKS, packId);
    const packDoc = await getDoc(packRef);

    if (!packDoc.exists()) {
      throw new Error('Pack not found');
    }

    const packData = packDoc.data();
    const contents = {
      pack: { id: packDoc.id, ...packData },
      items: [],
      creatures: []
    };

    // Fetch items if any
    if (packData.items && packData.items.length > 0) {
      const itemsRef = collection(db, COLLECTIONS.ITEMS);
      const itemsQuery = query(itemsRef, where('__name__', 'in', packData.items));
      const itemsSnapshot = await getDocs(itemsQuery);
      contents.items = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    // Fetch creatures if any
    if (packData.creatures && packData.creatures.length > 0) {
      const creaturesRef = collection(db, COLLECTIONS.CREATURES);
      const creaturesQuery = query(creaturesRef, where('__name__', 'in', packData.creatures));
      const creaturesSnapshot = await getDocs(creaturesQuery);
      contents.creatures = creaturesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    return contents;
  } catch (error) {
    console.error('Error fetching pack contents:', error);
    throw new Error('Failed to fetch pack contents');
  }
}

/**
 * Rate a pack
 */
export async function ratePack(packId, userId, rating) {
  try {
    // Add or update rating
    const ratingRef = doc(db, COLLECTIONS.RATINGS, `${packId}_${userId}`);
    await setDoc(ratingRef, {
      packId,
      userId,
      rating,
      createdAt: new Date()
    });

    // Recalculate average rating for the pack
    await recalculatePackRating(packId);

  } catch (error) {
    console.error('Error rating pack:', error);
    throw new Error('Failed to rate pack');
  }
}

/**
 * Recalculate average rating for a pack
 */
async function recalculatePackRating(packId) {
  try {
    const ratingsRef = collection(db, COLLECTIONS.RATINGS);
    const q = query(ratingsRef, where('packId', '==', packId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return;
    }

    const ratings = snapshot.docs.map(doc => doc.data().rating);
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    const packRef = doc(db, COLLECTIONS.PACKS, packId);
    await updateDoc(packRef, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingCount: ratings.length
    });

  } catch (error) {
    console.error('Error recalculating pack rating:', error);
  }
}

/**
 * Update pack version
 */
export async function updatePackVersion(packId, newVersion, updateData) {
  try {
    const packRef = doc(db, COLLECTIONS.PACKS, packId);

    await updateDoc(packRef, {
      ...updateData,
      version: newVersion,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating pack version:', error);
    throw new Error('Failed to update pack version');
  }
}

/**
 * Check pack dependencies
 */
export async function checkPackDependencies(packId) {
  try {
    const packRef = doc(db, COLLECTIONS.PACKS, packId);
    const packDoc = await getDoc(packRef);

    if (!packDoc.exists()) {
      throw new Error('Pack not found');
    }

    const packData = packDoc.data();
    const dependencies = packData.dependencies || [];

    if (dependencies.length === 0) {
      return { satisfied: true, missing: [] };
    }

    // Check if all dependencies exist
    const packsRef = collection(db, COLLECTIONS.PACKS);
    const dependencyQuery = query(packsRef, where('__name__', 'in', dependencies));
    const dependencySnapshot = await getDocs(dependencyQuery);

    const foundDependencies = dependencySnapshot.docs.map(doc => doc.id);
    const missingDependencies = dependencies.filter(dep => !foundDependencies.includes(dep));

    return {
      satisfied: missingDependencies.length === 0,
      missing: missingDependencies,
      found: foundDependencies
    };
  } catch (error) {
    console.error('Error checking pack dependencies:', error);
    throw new Error('Failed to check pack dependencies');
  }
}

/**
 * Get pack compatibility info
 */
export async function getPackCompatibility(packId) {
  try {
    const packRef = doc(db, COLLECTIONS.PACKS, packId);
    const packDoc = await getDoc(packRef);

    if (!packDoc.exists()) {
      throw new Error('Pack not found');
    }

    const packData = packDoc.data();
    return {
      version: packData.version,
      compatibility: packData.compatibility || {
        minVersion: '1.0.0',
        maxVersion: '2.0.0'
      },
      dependencies: packData.dependencies || []
    };
  } catch (error) {
    console.error('Error getting pack compatibility:', error);
    throw new Error('Failed to get pack compatibility');
  }
}

/**
 * Validate pack before upload
 */
export function validatePack(packData) {
  const errors = [];

  // Required fields
  if (!packData.name || packData.name.trim().length === 0) {
    errors.push('Pack name is required');
  }

  if (!packData.description || packData.description.trim().length === 0) {
    errors.push('Pack description is required');
  }

  if (!packData.type || !Object.values(PACK_TYPES).includes(packData.type)) {
    errors.push('Valid pack type is required');
  }

  // Content validation
  const hasItems = packData.items && packData.items.length > 0;
  const hasCreatures = packData.creatures && packData.creatures.length > 0;

  if (!hasItems && !hasCreatures) {
    errors.push('Pack must contain at least one item or creature');
  }

  if (packData.type === PACK_TYPES.ITEMS && !hasItems) {
    errors.push('Items pack must contain at least one item');
  }

  if (packData.type === PACK_TYPES.CREATURES && !hasCreatures) {
    errors.push('Creatures pack must contain at least one creature');
  }

  // Version validation
  if (packData.version && !/^\d+\.\d+\.\d+$/.test(packData.version)) {
    errors.push('Version must be in format x.y.z (e.g., 1.0.0)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
