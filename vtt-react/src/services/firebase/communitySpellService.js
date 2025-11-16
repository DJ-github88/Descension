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
  USERS: 'users',
  RATINGS: 'spell_ratings',
  FAVORITES: 'spell_favorites'
};

// Mock data for when Firebase is not available

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
 * Get all shared community spells (simplified - no folders/maps)
 */
export async function getAllCommunitySpells(pageSize = 20, lastDoc = null, sortBy = 'rating') {
  try {
    if (!checkFirebaseAvailable()) {
      return {
        spells: [],
        lastDoc: null,
        hasMore: false
      };
    }

    const spellsRef = collection(db, COLLECTIONS.SPELLS);
    
    // Build query - get all public shared spells
    try {
      let orderField = 'createdAt';
      if (sortBy === 'rating') orderField = 'rating';
      else if (sortBy === 'downloads') orderField = 'downloadCount';
      else if (sortBy === 'newest') orderField = 'createdAt';

      let q = query(
        spellsRef,
        where('isPublic', '==', true),
        orderBy(orderField, sortBy === 'rating' || sortBy === 'downloads' ? 'desc' : 'desc'),
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
    } catch (queryError) {
      // If orderBy fails, try without it
      console.warn('Query with orderBy failed, trying without:', queryError);
      let q = query(
        spellsRef,
        where('isPublic', '==', true),
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
    }
  } catch (error) {
    console.error('Error fetching community spells:', error);
    return {
      spells: [],
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
    return MOCK_FEATURED_SPELLS.slice(0, limit);
  }
}

/**
 * Upload a spell to the community
 */
export async function uploadSpell(spellData, userId) {
  try {
    if (!checkFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

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

/**
 * Favorite/unfavorite a spell
 */
export async function favoriteSpell(spellId, userId, isFavorite) {
  try {
    if (!checkFirebaseAvailable() || !userId) {
      throw new Error('Firebase not available or user not logged in');
    }

    const favoriteRef = doc(db, COLLECTIONS.FAVORITES, `${userId}_${spellId}`);
    
    if (isFavorite) {
      await setDoc(favoriteRef, {
        userId,
        spellId,
        favoritedAt: new Date().toISOString()
      });
    } else {
      await deleteDoc(favoriteRef);
    }

    return { success: true };
  } catch (error) {
    console.error('Error favoriting spell:', error);
    throw error;
  }
}

/**
 * Check if user has favorited a spell
 */
export async function isSpellFavorited(spellId, userId) {
  try {
    if (!checkFirebaseAvailable() || !userId) {
      return false;
    }

    const favoriteRef = doc(db, COLLECTIONS.FAVORITES, `${userId}_${spellId}`);
    const favoriteDoc = await getDoc(favoriteRef);
    
    return favoriteDoc.exists();
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

/**
 * Get user's favorited spells
 */
export async function getUserFavorites(userId, pageSize = 20) {
  try {
    if (!checkFirebaseAvailable() || !userId) {
      return [];
    }

    const favoritesRef = collection(db, COLLECTIONS.FAVORITES);
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      orderBy('favoritedAt', 'desc'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);
    const favoriteSpellIds = snapshot.docs.map(doc => doc.data().spellId);

    // Fetch the actual spells
    const spells = [];
    for (const spellId of favoriteSpellIds) {
      const spellRef = doc(db, COLLECTIONS.SPELLS, spellId);
      const spellDoc = await getDoc(spellRef);
      if (spellDoc.exists()) {
        spells.push({
          id: spellDoc.id,
          ...spellDoc.data()
        });
      }
    }

    return spells;
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return [];
  }
}

/**
 * Get spells uploaded/shared by a specific user
 */
export async function getUserSpells(userId, pageSize = 20) {
  try {
    if (!checkFirebaseAvailable()) {
      return [];
    }

    const spellsRef = collection(db, COLLECTIONS.SPELLS);
    const q = query(
      spellsRef,
      where('authorId', '==', userId),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user spells:', error);
    return [];
  }
}

/**
 * Vote on a spell (upvote = 1, downvote = -1)
 */
export async function voteSpell(spellId, userId, voteType) {
  try {
    if (!checkFirebaseAvailable()) {
      throw new Error('Firebase not available');
    }

    const vote = voteType === 'upvote' ? 1 : -1;
    const ratingRef = doc(db, COLLECTIONS.RATINGS, `${spellId}_${userId}`);
    
    // Check if user has already voted
    const ratingDoc = await getDoc(ratingRef);
    
    if (ratingDoc.exists()) {
      // Update existing vote
      await updateDoc(ratingRef, {
        spellId,
        userId,
        vote,
        updatedAt: new Date()
      });
    } else {
      // Create new vote
      await setDoc(ratingRef, {
        spellId,
        userId,
        vote,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Recalculate spell rating based on votes
    await recalculateSpellVotes(spellId);
    
  } catch (error) {
    console.error('Error voting on spell:', error);
    throw new Error('Failed to vote on spell');
  }
}

/**
 * Get user's vote for a spell
 */
export async function getUserVote(spellId, userId) {
  try {
    if (!checkFirebaseAvailable() || !userId) {
      return null;
    }

    const ratingRef = doc(db, COLLECTIONS.RATINGS, `${spellId}_${userId}`);
    const ratingDoc = await getDoc(ratingRef);
    
    if (ratingDoc.exists()) {
      return ratingDoc.data().vote || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user vote:', error);
    return null;
  }
}

/**
 * Recalculate vote-based rating for a spell
 */
async function recalculateSpellVotes(spellId) {
  try {
    const ratingsRef = collection(db, COLLECTIONS.RATINGS);
    const q = query(ratingsRef, where('spellId', '==', spellId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Set default rating if no votes
      const spellRef = doc(db, COLLECTIONS.SPELLS, spellId);
      await updateDoc(spellRef, {
        rating: 0,
        ratingCount: 0,
        upvotes: 0,
        downvotes: 0
      });
      return;
    }

    const votes = snapshot.docs.map(doc => doc.data().vote);
    const upvotes = votes.filter(v => v === 1).length;
    const downvotes = votes.filter(v => v === -1).length;
    const totalVotes = votes.length;
    
    // Calculate score: (upvotes - downvotes) / totalVotes, scaled to 0-5
    const score = totalVotes > 0 
      ? Math.max(0, Math.min(5, ((upvotes - downvotes) / totalVotes) * 2.5 + 2.5))
      : 0;
    
    const spellRef = doc(db, COLLECTIONS.SPELLS, spellId);
    await updateDoc(spellRef, {
      rating: Math.round(score * 10) / 10, // Round to 1 decimal place
      ratingCount: totalVotes,
      upvotes,
      downvotes
    });
    
  } catch (error) {
    console.error('Error recalculating spell votes:', error);
  }
}

