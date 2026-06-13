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
import { sanitizeForFirestore } from '../../utils/firebaseUtils';

// Collection names
const COLLECTIONS = {
  SPELLS: 'community_spells',
  USERS: 'users',
  RATINGS: 'spell_ratings',
  FAVORITES: 'spell_favorites'
};

// Mock data and state for when Firebase is not available (Demo Mode)
const MOCK_USER_VOTES = {};
const MOCK_USER_FAVORITES = new Set();

const MOCK_FEATURED_SPELLS = [
  {
    id: 'mock-fireball',
    name: 'Pyroclastic Fireball',
    description: 'Fling a massive, swirling orb of molten fire that explodes in a 20-foot radius sphere, incinerating all targets and leaving behind a smoldering field of ash.',
    school: 'Evocation',
    level: 3,
    castingTime: '1 action',
    range: '150 feet',
    components: ['V', 'S', 'M'],
    duration: 'Instantaneous',
    damage: '8d6 fire',
    author: 'Archmage Ignis',
    rating: 4.9,
    ratingCount: 142,
    downloadCount: 843,
    categoryId: 'damage',
    tags: ['damage', 'fire', 'aoe', 'explosive'],
    icon: 'Fire/Swirling Fireball',
    rarity: 'rare',
    isPublic: true,
    isFeatured: true,
    upvotes: 140,
    downvotes: 2,
    damageConfig: {
      damageType: 'direct',
      elementType: 'ember',
      formula: '8d6',
      criticalConfig: { enabled: true, critMultiplier: 2 }
    },
    resourceCost: { mana: 40, actionPoints: 1 }
  },
  {
    id: 'mock-frostbolt',
    name: 'Glacial Spear',
    description: 'Conjure a piercing spear of solid ice and hurl it at a target. Deals cold damage and freezes the target\'s joints, reducing their movement speed by 15 feet.',
    school: 'Evocation',
    level: 1,
    castingTime: '1 action',
    range: '60 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    damage: '1d10 cold',
    author: 'Frostweaver Jaina',
    rating: 4.7,
    ratingCount: 89,
    downloadCount: 512,
    categoryId: 'damage',
    tags: ['damage', 'cold', 'slow', 'single-target'],
    icon: 'Frost/Frozen in Ice',
    rarity: 'common',
    isPublic: true,
    isFeatured: true,
    upvotes: 86,
    downvotes: 3,
    damageConfig: {
      damageType: 'direct',
      elementType: 'rime',
      formula: '1d10',
      criticalConfig: { enabled: true, critMultiplier: 2 }
    },
    resourceCost: { mana: 15, actionPoints: 1 }
  },
  {
    id: 'mock-chains-shadow',
    name: 'Grasp of the Abyss',
    description: 'Summon writhing chains of dark energy from the shadow realm to bind up to three creatures. Bound targets are restrained and take necrotic damage at the start of each turn.',
    school: 'Conjuration',
    level: 2,
    castingTime: '1 action',
    range: '90 feet',
    components: ['V', 'S'],
    duration: 'Concentration, up to 1 minute',
    damage: '2d6 necrotic',
    author: 'Warlock Malakar',
    rating: 4.8,
    ratingCount: 74,
    downloadCount: 418,
    categoryId: 'control',
    tags: ['control', 'necrotic', 'restrained', 'multi-target'],
    icon: 'Shadow/Shadow Darkness',
    rarity: 'rare',
    isPublic: true,
    isFeatured: true,
    upvotes: 72,
    downvotes: 2,
    damageConfig: {
      damageType: 'dot',
      elementType: 'blight',
      formula: '2d6',
      criticalConfig: { enabled: false }
    },
    resourceCost: { mana: 25, actionPoints: 1 }
  },
  {
    id: 'mock-healing-light',
    name: 'Celestial Mend',
    description: 'Call down a beam of pure radiant starlight upon a wounded ally. Instantly restores health and provides a minor ward that increases saving throws for 2 turns.',
    school: 'Abjuration',
    level: 2,
    castingTime: '1 action',
    range: '60 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    healing: '2d8+4',
    author: 'High Priest Alistair',
    rating: 4.8,
    ratingCount: 95,
    downloadCount: 632,
    categoryId: 'healing',
    tags: ['healing', 'radiant', 'buff', 'single-target'],
    icon: 'Radiant/Divine Blessing',
    rarity: 'uncommon',
    isPublic: true,
    isFeatured: true,
    upvotes: 93,
    downvotes: 2,
    healingConfig: {
      healingType: 'direct',
      formula: '2d8+4'
    },
    resourceCost: { mana: 20, actionPoints: 1 }
  },
  {
    id: 'mock-ember-shield',
    name: 'Emberflame Aegis',
    description: 'Surround yourself with a barrier of swirling flame. You gain fire resistance, and any creature that hits you with a melee attack takes fire damage.',
    school: 'Abjuration',
    level: 1,
    castingTime: '1 bonus action',
    range: 'Self',
    components: ['V', 'S'],
    duration: '10 minutes',
    damage: '1d4 fire',
    author: 'Forge Master Valkan',
    rating: 4.6,
    ratingCount: 54,
    downloadCount: 320,
    categoryId: 'utility',
    tags: ['utility', 'buff', 'fire', 'defense'],
    icon: 'Fire/Flame Burst',
    rarity: 'uncommon',
    isPublic: true,
    isFeatured: false,
    upvotes: 52,
    downvotes: 2,
    damageConfig: {
      damageType: 'direct',
      elementType: 'ember',
      formula: '1d4',
      criticalConfig: { enabled: false }
    },
    resourceCost: { mana: 15, actionPoints: 1 }
  },
  {
    id: 'mock-lightning-bolt',
    name: 'Tempest Javelin',
    description: 'Strike with a concentrated javelin of crackling lightning. The bolt punches through the first target and jumps to two nearby targets, dealing storm damage.',
    school: 'Evocation',
    level: 3,
    castingTime: '1 action',
    range: '90 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    damage: '4d10 lightning',
    author: 'Stormcaller Raiden',
    rating: 4.9,
    ratingCount: 112,
    downloadCount: 789,
    categoryId: 'damage',
    tags: ['damage', 'lightning', 'storm', 'chain'],
    icon: 'Lightning/Lightning Bolt',
    rarity: 'epic',
    isPublic: true,
    isFeatured: true,
    upvotes: 110,
    downvotes: 2,
    damageConfig: {
      damageType: 'direct',
      elementType: 'storm',
      formula: '4d10',
      criticalConfig: { enabled: true, critMultiplier: 2 }
    },
    resourceCost: { mana: 35, actionPoints: 1 }
  },
  {
    id: 'mock-grasp-nature',
    name: 'Wildwood Entanglement',
    description: 'Command roots and vines to erupt from the earth, grasping at creatures in a 15-foot square. Targets are rooted and take physical bludgeoning damage.',
    school: 'Transmutation',
    level: 1,
    castingTime: '1 action',
    range: '60 feet',
    components: ['V', 'S', 'M'],
    duration: 'Concentration, up to 1 minute',
    damage: '1d6 physical',
    author: 'Archdruid Sylva',
    rating: 4.5,
    ratingCount: 43,
    downloadCount: 245,
    categoryId: 'control',
    tags: ['control', 'nature', 'physical', 'aoe'],
    icon: 'Utility/Summon Minion',
    rarity: 'common',
    isPublic: true,
    isFeatured: false,
    upvotes: 41,
    downvotes: 2,
    damageConfig: {
      damageType: 'direct',
      elementType: 'physical',
      formula: '1d6',
      criticalConfig: { enabled: false }
    },
    resourceCost: { mana: 10, actionPoints: 1 }
  },
  {
    id: 'mock-arcane-torrent',
    name: 'Aether Resonance',
    description: 'Unleash a wave of volatile force energy that disrupts spellcasting in a 15-foot cone. Targets are silenced for 1 round and take arcane force damage.',
    school: 'Evocation',
    level: 2,
    castingTime: '1 action',
    range: '15 feet',
    components: ['V'],
    duration: 'Instantaneous',
    damage: '3d8 force',
    author: 'Aetherologist Elyria',
    rating: 4.7,
    ratingCount: 68,
    downloadCount: 395,
    categoryId: 'control',
    tags: ['control', 'arcane', 'silence', 'force'],
    icon: 'Arcane/Arcane Blast',
    rarity: 'rare',
    isPublic: true,
    isFeatured: false,
    upvotes: 66,
    downvotes: 2,
    damageConfig: {
      damageType: 'direct',
      elementType: 'arcane',
      formula: '3d8',
      criticalConfig: { enabled: true, critMultiplier: 2 }
    },
    resourceCost: { mana: 25, actionPoints: 1 }
  },
  {
    id: 'mock-summon-golem',
    name: 'Summon Clay Guardian',
    description: 'Erect a loyal clay sentinel from the earth to fight by your side. The guardian has high health, can taunt enemies, and deals physical bludgeoning damage.',
    school: 'Conjuration',
    level: 3,
    castingTime: '1 minute',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    duration: 'Concentration, up to 1 hour',
    author: 'Golemancer Martha',
    rating: 4.8,
    ratingCount: 57,
    downloadCount: 290,
    categoryId: 'summoning',
    tags: ['summon', 'physical', 'tank', 'minion'],
    icon: 'Utility/Summon Minion',
    rarity: 'rare',
    isPublic: true,
    isFeatured: false,
    upvotes: 55,
    downvotes: 2,
    resourceCost: { mana: 40, actionPoints: 1 }
  }
];

// Helper function to check if Firebase is available
const checkFirebaseAvailable = () => {
  if (!db) {
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
      // Sort mock spells dynamically for Demo Mode
      let sortedMock = [...MOCK_FEATURED_SPELLS];
      if (sortBy === 'rating') {
        sortedMock.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'downloads') {
        sortedMock.sort((a, b) => b.downloadCount - a.downloadCount);
      } else if (sortBy === 'newest') {
        // Mock ID creation order is stable, sort reverse by level as a proxy
        sortedMock.sort((a, b) => b.level - a.level);
      }
      return {
        spells: sortedMock.slice(0, pageSize),
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
      return MOCK_FEATURED_SPELLS.filter(s => s.isFeatured).slice(0, pageSize);
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
    return MOCK_FEATURED_SPELLS.filter(s => s.isFeatured).slice(0, pageSize);
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

    // Sanitize spellData to remove undefined values (Firestore doesn't accept them)
    const sanitizedSpellData = sanitizeForFirestore(spellData);

    const communitySpell = {
      ...sanitizedSpellData,
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
    if (!checkFirebaseAvailable()) {
      const spell = MOCK_FEATURED_SPELLS.find(s => s.id === spellId);
      if (!spell) throw new Error('Spell not found');
      
      // Increment local download count
      spell.downloadCount = (spell.downloadCount || 0) + 1;
      return { ...spell };
    }

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
    if (!checkFirebaseAvailable()) {
      return;
    }

    // Add or update rating
    const ratingRef = doc(db, COLLECTIONS.RATINGS, `${spellId}_${userId}`);
    await updateDoc(ratingRef, {
      spellId,
      userId,
      rating,
      createdAt: new Date()
    });

    // Recalculate average rating for the spell
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
      rating: Math.round(averageRating * 10) / 10,
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
      if (isFavorite) {
        MOCK_USER_FAVORITES.add(spellId);
      } else {
        MOCK_USER_FAVORITES.delete(spellId);
      }
      return { success: true };
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
      return MOCK_USER_FAVORITES.has(spellId);
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
      return MOCK_FEATURED_SPELLS.filter(s => MOCK_USER_FAVORITES.has(s.id));
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
      // Return a subset of mock spells to represent the user's shared spells
      return MOCK_FEATURED_SPELLS.slice(4, 6);
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
      const spell = MOCK_FEATURED_SPELLS.find(s => s.id === spellId);
      if (!spell) throw new Error('Spell not found');

      const vote = voteType === 'upvote' ? 1 : -1;
      MOCK_USER_VOTES[spellId] = vote;

      if (voteType === 'upvote') {
        spell.upvotes = (spell.upvotes || 0) + 1;
      } else {
        spell.downvotes = (spell.downvotes || 0) + 1;
      }

      const total = (spell.upvotes || 0) + (spell.downvotes || 0);
      const score = total > 0
        ? Math.max(0, Math.min(5, ((spell.upvotes - spell.downvotes) / total) * 2.5 + 2.5))
        : 0;

      spell.rating = Math.round(score * 10) / 10;
      spell.ratingCount = total;
      return;
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
      return MOCK_USER_VOTES[spellId] || null;
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
      rating: Math.round(score * 10) / 10,
      ratingCount: totalVotes,
      upvotes,
      downvotes
    });

  } catch (error) {
    console.error('Error recalculating spell votes:', error);
  }
}


