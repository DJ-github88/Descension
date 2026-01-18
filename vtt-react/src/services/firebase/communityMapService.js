/**
 * Community Map Service
 *
 * This service handles all interactions with the Firebase Firestore database
 * for community-created maps. It provides functionality to:
 * - Browse maps by category/folder
 * - Search maps
 * - Upload new maps
 * - Rate and review maps
 * - Download maps to local library
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
import { sanitizeForFirestore } from '../../utils/firebaseUtils';

// Collection names
const COLLECTIONS = {
  MAPS: 'community_maps',
  CATEGORIES: 'map_categories',
  USERS: 'users',
  RATINGS: 'map_ratings'
};

// Check if Firebase is available
function checkFirebaseAvailable() {
  return db !== null && db !== undefined;
}

// Mock data for when Firebase is not available
const MOCK_CATEGORIES = [
  {
    id: 'dungeons',
    name: 'Dungeons',
    description: 'Underground complexes, caves, and dungeon layouts',
    icon: 'inv_misc_bag_10',
    color: '#8b5cf6'
  },
  {
    id: 'cities',
    name: 'Cities & Towns',
    description: 'Urban areas, villages, and settlements',
    icon: 'inv_misc_bag_10',
    color: '#10b981'
  },
  {
    id: 'wilderness',
    name: 'Wilderness',
    description: 'Forests, mountains, deserts, and natural landscapes',
    icon: 'inv_misc_bag_10',
    color: '#f59e0b'
  },
  {
    id: 'buildings',
    name: 'Buildings',
    description: 'Individual structures, houses, castles, and interiors',
    icon: 'inv_misc_bag_10',
    color: '#ef4444'
  }
];

/**
 * Upload a map to the community
 */
export async function uploadMap(mapData, userId) {
  try {
    if (!checkFirebaseAvailable()) {
      console.warn('Firebase not available for map upload');
      return {
        success: false,
        id: `mock_${Date.now()}`,
        message: 'Map uploaded to local storage only'
      };
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Prepare map data for community
    const communityMap = {
      ...mapData,
      id: undefined, // Remove local ID
      originalMapId: mapData.originalMapId || mapData.id,
      originalUserId: userId,
      isPublic: true,
      isFeatured: false,
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      downloadCount: 0,
      rating: 0,
      ratingCount: 0,
      tags: mapData.tags || [],
      category: mapData.category || 'uncategorized'
    };

    // Remove user-specific fields
    delete communityMap.userId;
    delete communityMap.folderId;
    delete communityMap.isCustom;

    // Add to community collection
    const mapsRef = collection(db, COLLECTIONS.MAPS);

    // Sanitize map data to remove undefined values
    const sanitizedMapData = sanitizeForFirestore(communityMap);

    const docRef = await addDoc(mapsRef, sanitizedMapData);

    console.log(`✅ Map uploaded to community: ${docRef.id}`);

    return {
      success: true,
      id: docRef.id,
      message: 'Map uploaded successfully to community'
    };

  } catch (error) {
    console.error('Error uploading map to community:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to upload map to community'
    };
  }
}

/**
 * Get community maps with optional filtering
 */
export async function getCommunityMaps(options = {}) {
  try {
    if (!checkFirebaseAvailable()) {
      console.log('Using mock community maps data');
      return {
        maps: [],
        totalCount: 0,
        hasMore: false
      };
    }

    const {
      category,
      searchQuery,
      sortBy = 'uploadDate',
      sortOrder = 'desc',
      limit: resultLimit = 20,
      startAfter: startAfterDoc
    } = options;

    let queryConstraints = [
      where('isPublic', '==', true),
      orderBy(sortBy, sortOrder),
      limit(resultLimit)
    ];

    if (category && category !== 'all') {
      queryConstraints.push(where('category', '==', category));
    }

    if (startAfterDoc) {
      queryConstraints.push(startAfter(startAfterDoc));
    }

    const mapsQuery = query(
      collection(db, COLLECTIONS.MAPS),
      ...queryConstraints
    );

    const querySnapshot = await getDocs(mapsQuery);
    const maps = [];

    querySnapshot.forEach((doc) => {
      maps.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      maps,
      totalCount: maps.length,
      hasMore: maps.length === resultLimit
    };

  } catch (error) {
    console.error('Error loading community maps:', error);
    return {
      maps: [],
      totalCount: 0,
      hasMore: false
    };
  }
}

/**
 * Get map categories
 */
export async function getMapCategories() {
  try {
    if (!checkFirebaseAvailable()) {
      return MOCK_CATEGORIES;
    }

    const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
    const querySnapshot = await getDocs(categoriesRef);
    const categories = [];

    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return categories.length > 0 ? categories : MOCK_CATEGORIES;

  } catch (error) {
    console.error('Error loading map categories:', error);
    return MOCK_CATEGORIES;
  }
}

/**
 * Get a specific community map by ID
 */
export async function getCommunityMap(mapId) {
  try {
    if (!checkFirebaseAvailable()) {
      return null;
    }

    const mapRef = doc(db, COLLECTIONS.MAPS, mapId);
    const mapDoc = await getDoc(mapRef);

    if (mapDoc.exists()) {
      return {
        id: mapDoc.id,
        ...mapDoc.data()
      };
    }

    return null;

  } catch (error) {
    console.error('Error loading community map:', error);
    return null;
  }
}

/**
 * Download a community map to user's library
 */
export async function downloadCommunityMap(mapId, userId) {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, message: 'Firebase not available' };
    }

    const mapData = await getCommunityMap(mapId);
    if (!mapData) {
      throw new Error('Map not found');
    }

    // Import user maps service to save locally
    const { saveUserMap } = await import('./userMapsService');

    // Save to user's library
    const result = await saveUserMap(userId, {
      ...mapData,
      id: undefined, // Generate new ID
      userId,
      source: 'community',
      downloadedFrom: mapId,
      downloadDate: new Date().toISOString()
    });

    if (result.success) {
      // Update download count
      const mapRef = doc(db, COLLECTIONS.MAPS, mapId);
      const currentDownloads = mapData.downloadCount || 0;
      await updateDoc(mapRef, {
        downloadCount: currentDownloads + 1
      });
    }

    return result;

  } catch (error) {
    console.error('Error downloading community map:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Rate a community map
 */
export async function rateCommunityMap(mapId, userId, rating, review = '') {
  try {
    if (!checkFirebaseAvailable()) {
      return { success: false, message: 'Firebase not available' };
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user already rated this map
    const existingRatingQuery = query(
      collection(db, COLLECTIONS.RATINGS),
      where('mapId', '==', mapId),
      where('userId', '==', userId)
    );

    const existingRatingSnapshot = await getDocs(existingRatingQuery);
    let ratingDocRef;

    if (!existingRatingSnapshot.empty) {
      // Update existing rating
      ratingDocRef = existingRatingSnapshot.docs[0].ref;
      await updateDoc(ratingDocRef, {
        rating,
        review,
        lastModified: new Date().toISOString()
      });
    } else {
      // Create new rating
      const ratingsRef = collection(db, COLLECTIONS.RATINGS);
      ratingDocRef = await addDoc(ratingsRef, {
        mapId,
        userId,
        rating,
        review,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      });
    }

    // Update map's average rating
    await updateMapRating(mapId);

    return {
      success: true,
      message: 'Rating submitted successfully'
    };

  } catch (error) {
    console.error('Error rating community map:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update map's average rating
 */
async function updateMapRating(mapId) {
  try {
    // Get all ratings for this map
    const ratingsQuery = query(
      collection(db, COLLECTIONS.RATINGS),
      where('mapId', '==', mapId)
    );

    const ratingsSnapshot = await getDocs(ratingsQuery);
    const ratings = [];

    ratingsSnapshot.forEach((doc) => {
      ratings.push(doc.data().rating);
    });

    if (ratings.length > 0) {
      const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

      // Update map with new average
      const mapRef = doc(db, COLLECTIONS.MAPS, mapId);
      await updateDoc(mapRef, {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        ratingCount: ratings.length
      });
    }

  } catch (error) {
    console.error('Error updating map rating:', error);
  }
}
