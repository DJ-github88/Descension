/**
 * Community Item Service
 * 
 * This service handles all interactions with the Firebase Firestore database
 * for community-created items. It provides functionality to:
 * - Browse items by category/folder
 * - Search items
 * - Upload new items
 * - Rate and review items
 * - Download items to local library
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
 increment
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getIconUrl } from '../../utils/assetManager';
import { sanitizeForFirestore } from '../../utils/firebaseUtils';
import {
 getCommunitySummaries,
 upsertCommunitySummary,
 backfillCommunitySummaries,
 SUMMARY_KINDS
} from './communitySummaryService';

// Collection names
const COLLECTIONS = {
 ITEMS: 'community_items',
 CATEGORIES: 'item_categories',
 USERS: 'users',
 RATINGS: 'item_ratings',
 COMMENTS: 'item_comments'
};

// Check if Firebase is available
function checkFirebaseAvailable() {
 return db !== null && db !== undefined;
}

// Mock data for when Firebase is not available
const MOCK_CATEGORIES = [
 {
  id: 'weapons',
  name: 'Weapons',
  description: 'Swords, axes, bows, and other combat equipment',
  icon: 'inv_sword_04',
  color: '#8B4513',
  itemCount: 0
 },
 {
  id: 'armor',
  name: 'Armor',
  description: 'Protective gear and clothing',
  icon: 'inv_chest_plate02',
  color: '#2d5016',
  itemCount: 0
 },
 {
  id: 'consumables',
  name: 'Consumables',
  description: 'Potions, food, and other consumable items',
  icon: 'inv_potion_54',
  color: '#5a1e12',
  itemCount: 0
 },
 {
  id: 'tools',
  name: 'Tools',
  description: 'Utility items and equipment',
  icon: 'inv_misc_tool_01',
  color: '#a08c70',
  itemCount: 0
 },
 {
  id: 'accessories',
  name: 'Accessories',
  description: 'Rings, amulets, and other accessories',
  icon: 'inv_jewelry_ring_01',
  color: '#b8860b',
  itemCount: 0
 },
 {
  id: 'materials',
  name: 'Materials',
  description: 'Crafting materials and components',
  icon: 'inv_misc_gem_01',
  color: '#8b7355',
  itemCount: 0
 }
];

const MOCK_FEATURED_ITEMS = [
 {
  id: 'mock-item-1',
  name: 'Flamebrand Sword',
  description: 'A legendary sword wreathed in eternal flames that burns with the fury of ancient dragons',
  type: 'weapon',
  quality: 'legendary',
  categoryId: 'weapons',
  authorId: 'mock-author',
  isPublic: true,
  isFeatured: true,
  rating: 4.8,
  ratingCount: 24,
  downloadCount: 156,
  tags: ['fire', 'sword', 'legendary'],
  iconId: 'inv_sword_39',
  imageUrl: getIconUrl('magical-sword-pendant', 'items'),
  itemData: {
   damage: '2d8+3',
   damageType: 'ember',
   weight: 3,
   value: 5000,
   slot: 'Main Hand',
   weaponType: 'sword',
   subtype: 'SWORD',
   requiredLevel: 15,
   baseStats: {
    strength: 2,
    constitution: 1
   },
   enchantments: [
    {
     name: 'Flaming',
     description: '+1d6 fire damage',
     type: 'damage'
    }
   ],
   // Currency breakdown
   goldValue: 50,
   silverValue: 0,
   copperValue: 0,
   platinumValue: 0
  },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15')
 },
 {
  id: 'mock-item-2',
  name: 'Healing Potion',
  description: 'A magical potion that restores health when consumed',
  type: 'consumable',
  quality: 'common',
  categoryId: 'consumables',
  authorId: 'mock-author-2',
  isPublic: true,
  isFeatured: true,
  rating: 4.5,
  ratingCount: 89,
  downloadCount: 342,
  tags: ['healing', 'potion', 'consumable'],
  iconId: 'inv_potion_54',
  imageUrl: getIconUrl('head-skull-potion-bottle', 'items'),
  itemData: {
   healing: '2d4+2',
   weight: 0.5,
   value: 50,
   slot: 'Consumable',
   subtype: 'POTION',
   requiredLevel: 1,
   baseStats: {},
   enchantments: [],
   // Currency breakdown
   goldValue: 0,
   silverValue: 5,
   copperValue: 0,
   platinumValue: 0
  },
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-10')
 }
];

/**
 * Get all item categories/folders
 */
export async function getItemCategories() {
 try {
  if (!checkFirebaseAvailable()) {
   // Return mock data when Firebase is not available
   return MOCK_CATEGORIES;
  }

  const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
  const snapshot = await getDocs(categoriesRef);

  if (snapshot.empty) {
   return MOCK_CATEGORIES;
  }

  return snapshot.docs.map(doc => ({
   id: doc.id,
   ...doc.data()
  }));
 } catch (error) {
  console.error('Error fetching item categories:', error);
  return MOCK_CATEGORIES;
 }
}

/**
 * Get items by category with pagination
 */
export async function getItemsByCategory(categoryId, pageSize = 20, lastDoc = null) {
 try {
  if (!checkFirebaseAvailable()) {
   // Return mock items for the category
   const mockItems = MOCK_FEATURED_ITEMS.filter(item => item.categoryId === categoryId);
   return {
    items: mockItems,
    lastDoc: null,
    hasMore: false
   };
  }

  const itemsRef = collection(db, COLLECTIONS.ITEMS);
  let q = query(
   itemsRef,
   where('categoryId', '==', categoryId),
   where('isPublic', '==', true),
   orderBy('createdAt', 'desc'),
   limit(pageSize)
  );

  if (lastDoc) {
   q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(doc => ({
   id: doc.id,
   ...doc.data()
  }));

  return {
   items,
   lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
   hasMore: snapshot.docs.length === pageSize
  };
 } catch (error) {
  console.error('Error fetching items by category:', error);
  const mockItems = MOCK_FEATURED_ITEMS.filter(item => item.categoryId === categoryId);
  return {
   items: mockItems,
   lastDoc: null,
   hasMore: false
  };
 }
}

/**
 * Get all community items with sorting and pagination
 */
export async function getAllCommunityItems(pageSize = 20, lastDoc = null, sortBy = 'rating') {
 try {
  if (!checkFirebaseAvailable()) {
   return {
    items: MOCK_FEATURED_ITEMS,
    lastDoc: null,
    hasMore: false
   };
  }

  const itemsRef = collection(db, COLLECTIONS.ITEMS);

  // Preferred path: shallow summary feed (no nested itemData/weapon stats).
  const usingFullCursor = !!(lastDoc && lastDoc.__fullCursor);
  if (!usingFullCursor) {
   try {
    const { summaries, lastDoc: summaryCursor, hasMore } = await getCommunitySummaries(
     SUMMARY_KINDS.ITEM,
     { pageSize, sortBy, cursor: lastDoc }
    );
    if (summaries.length > 0) {
     return {
      items: summaries,
      lastDoc: summaryCursor,
      hasMore
     };
    }
   } catch (summaryError) {
    console.debug('Summary feed unavailable, using full item documents:', summaryError?.message || summaryError);
   }
  }

  const fullCursor = lastDoc?.__fullCursor || lastDoc;
  let orderField = 'rating';
  if (sortBy === 'downloads') orderField = 'downloadCount';
  if (sortBy === 'newest') orderField = 'createdAt';

  let snapshot = null;
  try {
   let q = query(
    itemsRef,
    where('isPublic', '==', true),
    orderBy(orderField, 'desc'),
    limit(pageSize)
   );
   if (fullCursor) {
    q = query(q, startAfter(fullCursor));
   }
   snapshot = await getDocs(q);
  } catch (err) {
   console.warn('getAllCommunityItems ordered query failed, trying unconstrained query:', err);
  }

  if (snapshot) {
   // An empty ordered result is a valid answer - do NOT fall through to an
   // unfiltered query or mock data (that would leak private drafts and double
   // the read count on every empty page).
   const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   backfillCommunitySummaries(SUMMARY_KINDS.ITEM, items);
   return {
    items,
    lastDoc: snapshot.docs.length ? { __fullCursor: snapshot.docs[snapshot.docs.length - 1] } : null,
    hasMore: snapshot.docs.length === pageSize
   };
  }

  // Fallback query without the composite order (missing index), still public-only.
  const fallbackQ = query(
   itemsRef,
   where('isPublic', '==', true),
   limit(pageSize)
  );
  const fallbackSnapshot = await getDocs(fallbackQ);
  const items = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  backfillCommunitySummaries(SUMMARY_KINDS.ITEM, items);
  return {
   items,
   lastDoc: fallbackSnapshot.docs.length ? { __fullCursor: fallbackSnapshot.docs[fallbackSnapshot.docs.length - 1] } : null,
   hasMore: false
  };
 } catch (error) {
  console.error('Error fetching all community items:', error);
  return {
   items: [],
   lastDoc: null,
   hasMore: false
  };
 }
}

/**
 * Search items by name/tags
 */
export async function searchItems(searchTerm, pageSize = 20) {
 try {
  if (!checkFirebaseAvailable()) {
   // Return filtered mock items
   const filteredItems = MOCK_FEATURED_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
   );
   return filteredItems;
  }

  const itemsRef = collection(db, COLLECTIONS.ITEMS);

  // Note: Firestore doesn't support full-text search natively
  // This is a simple implementation that searches by name prefix
  // For production, consider using Algolia or similar service
  const q = query(
   itemsRef,
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
  console.error('Error searching items:', error);
  const filteredItems = MOCK_FEATURED_ITEMS.filter(item =>
   item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
   item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return filteredItems;
 }
}

/**
 * Get featured/popular items
 */
export async function getFeaturedItems(pageSize = 10) {
 try {
  if (!checkFirebaseAvailable()) {
   return MOCK_FEATURED_ITEMS.slice(0, pageSize);
  }

  const itemsRef = collection(db, COLLECTIONS.ITEMS);
  const q = query(
   itemsRef,
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
  console.error('Error fetching featured items:', error);
  return MOCK_FEATURED_ITEMS.slice(0, pageSize);
 }
}

/**
 * Get recent items
 */
export async function getRecentItems(pageSize = 10) {
 try {
  if (!checkFirebaseAvailable()) {
   return MOCK_FEATURED_ITEMS.slice(0, pageSize);
  }

  const itemsRef = collection(db, COLLECTIONS.ITEMS);
  
  // First try with full criteria
  try {
   const q = query(
    itemsRef,
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
   );
   const snapshot = await getDocs(q);
   if (!snapshot.empty) {
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   }
  } catch (e) {
   console.warn('Initial recent items query failed, trying fallback:', e);
  }

  // Fallback 1: Just public items without strict ordering (sometimes ordering fails without index)
  const qFallback = query(
   itemsRef,
   where('isPublic', '==', true),
   limit(pageSize)
  );
  const fallbackSnapshot = await getDocs(qFallback);
  // Public-only by design: an unfiltered query here surfaced private drafts
  // in the public feed (the rules allow public reads of this collection).
  return fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

 } catch (error) {
  console.error('Error fetching recent items:', error);
  return [];
 }
}

/**
 * Upload an item to the community
 */
export async function uploadItem(itemData, userId) {
 try {
  const itemsRef = collection(db, COLLECTIONS.ITEMS);

  // Sanitize itemData to remove undefined values (Firestore doesn't accept them)
  const sanitizedItemData = sanitizeForFirestore(itemData);

  const communityItem = {
   ...sanitizedItemData,
   authorId: userId,
   isPublic: true,
   isFeatured: false,
   rating: 0,
   ratingCount: 0,
   downloadCount: 0,
   createdAt: new Date(),
   updatedAt: new Date()
  };

  const docRef = await addDoc(itemsRef, communityItem);

  const uploadedItem = {
   id: docRef.id,
   ...communityItem
  };
  // Keep the shallow feed summary in sync (best effort).
  upsertCommunitySummary(SUMMARY_KINDS.ITEM, docRef.id, uploadedItem).catch(() => {});

  return uploadedItem;
 } catch (error) {
  console.error('Error uploading item:', error);
  throw new Error('Failed to upload item');
 }
}

/**
 * Fetch a single full item document by id (no side effects).
 * Used to hydrate summary rows when the user opens details.
 */
export async function getCommunityItemById(itemId) {
 try {
  if (!checkFirebaseAvailable()) {
   return null;
  }
  const itemDoc = await getDoc(doc(db, COLLECTIONS.ITEMS, itemId));
  if (!itemDoc.exists()) return null;
  return { id: itemDoc.id, ...itemDoc.data() };
 } catch (error) {
  console.error('Error fetching item by id:', error);
  return null;
 }
}

/**
 * Download an item (increment download count)
 */
export async function downloadItem(itemId) {
 try {
  const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
  const itemDoc = await getDoc(itemRef);

  if (!itemDoc.exists()) {
   throw new Error('Item not found');
  }

  // Increment download count (atomic; avoids lost updates on concurrent downloads)
  await updateDoc(itemRef, {
   downloadCount: increment(1)
  });

  const fullItem = {
   id: itemDoc.id,
   ...itemDoc.data(),
   downloadCount: (itemDoc.data().downloadCount || 0) + 1
  };

  // Keep the feed summary's counter in sync (best effort).
  upsertCommunitySummary(SUMMARY_KINDS.ITEM, itemDoc.id, fullItem).catch(() => {});

  return fullItem;
 } catch (error) {
  console.error('Error downloading item:', error);
  throw new Error('Failed to download item');
 }
}

/**
 * Rate an item
 */
export async function rateItem(itemId, userId, rating) {
 try {
  // Add or update rating
  const ratingRef = doc(db, COLLECTIONS.RATINGS, `${itemId}_${userId}`);
  await setDoc(ratingRef, {
   itemId,
   userId,
   rating,
   createdAt: new Date()
  });

  // Recalculate average rating for the item
  // This would be done with a Cloud Function in production
  await recalculateItemRating(itemId);

 } catch (error) {
  console.error('Error rating item:', error);
  throw new Error('Failed to rate item');
 }
}

/**
 * Recalculate average rating for an item
 */
async function recalculateItemRating(itemId) {
 try {
  const ratingsRef = collection(db, COLLECTIONS.RATINGS);
  const q = query(ratingsRef, where('itemId', '==', itemId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
   return;
  }

  const ratings = snapshot.docs.map(doc => doc.data().rating);
  const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
  await updateDoc(itemRef, {
   rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
   ratingCount: ratings.length
  });

 } catch (error) {
  console.error('Error recalculating item rating:', error);
 }
}

export async function initializeItemCategories() {
 if (!checkFirebaseAvailable()) {
  return [];
 }

 const categories = {
  weapons: {
   name: "Weapons",
   description: "Swords, axes, bows, and other combat equipment",
   icon: "inv_sword_04",
   color: "#8B4513",
   itemCount: 0
  },
  armor: {
   name: "Armor",
   description: "Protective gear and clothing",
   icon: "inv_chest_plate02",
   color: "#2d5016",
   itemCount: 0
  },
  consumables: {
   name: "Consumables",
   description: "Potions, food, and other consumable items",
   icon: "inv_potion_54",
   color: "#5a1e12",
   itemCount: 0
  },
  tools: {
   name: "Tools",
   description: "Utility items and equipment",
   icon: "inv_misc_tool_01",
   color: "#a08c70",
   itemCount: 0
  },
  accessories: {
   name: "Accessories",
   description: "Rings, amulets, and other accessories",
   icon: "inv_jewelry_ring_01",
   color: "#b8860b",
   itemCount: 0
  },
  materials: {
   name: "Materials",
   description: "Crafting materials and components",
   icon: "inv_misc_gem_01",
   color: "#8b7355",
   itemCount: 0
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

/**
 * Vote on a community item (upvote or downvote)
 */
export async function voteItem(itemId, userId, direction) {
 try {
  if (!checkFirebaseAvailable()) {
   throw new Error('Firebase not available');
  }

  const voteRef = doc(db, COLLECTIONS.RATINGS, `${itemId}_${userId}`);
  const voteDoc = await getDoc(voteRef);

  const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
  const itemDoc = await getDoc(itemRef);

  if (!itemDoc.exists()) {
   throw new Error('Item not found');
  }

  const currentData = itemDoc.data();
  const upvotes = currentData.upvotes || 0;
  const downvotes = currentData.downvotes || 0;

  if (voteDoc.exists()) {
   const previousVote = voteDoc.data().direction;
   if (previousVote === direction) {
    await deleteDoc(voteRef);
    if (direction === 'up') {
     await updateDoc(itemRef, { upvotes: upvotes - 1 });
    } else {
     await updateDoc(itemRef, { downvotes: downvotes - 1 });
    }
   } else {
    await setDoc(voteRef, { itemId, userId, direction, updatedAt: new Date() });
    if (previousVote === 'up' && direction === 'down') {
     await updateDoc(itemRef, { upvotes: upvotes - 1, downvotes: downvotes + 1 });
    } else if (previousVote === 'down' && direction === 'up') {
     await updateDoc(itemRef, { upvotes: upvotes + 1, downvotes: downvotes - 1 });
    }
   }
  } else {
   await setDoc(voteRef, { itemId, userId, direction, createdAt: new Date(), updatedAt: new Date() });
   if (direction === 'up') {
    await updateDoc(itemRef, { upvotes: upvotes + 1 });
   } else {
    await updateDoc(itemRef, { downvotes: downvotes + 1 });
   }
  }

 } catch (error) {
  console.error('Error voting on item:', error);
  throw error;
 }
}

/**
 * Get a user's vote for an item
 */
export async function getUserVote(itemId, userId) {
 try {
  if (!checkFirebaseAvailable()) return null;
  const voteRef = doc(db, COLLECTIONS.RATINGS, `${itemId}_${userId}`);
  const voteDoc = await getDoc(voteRef);
  if (!voteDoc.exists()) return null;
  return voteDoc.data().direction;
 } catch (error) {
  console.error('Error getting user vote:', error);
  return null;
 }
}
/**
 * Add a comment to a community item
 */
export async function addComment(itemId, userId, displayName, text) {
 try {
  if (!checkFirebaseAvailable()) throw new Error('Firebase not available');
  const commentsRef = collection(db, COLLECTIONS.COMMENTS);
  const commentDoc = await addDoc(commentsRef, {
   communityItemId: itemId,
   userId,
   displayName: displayName || 'Anonymous',
   text,
   createdAt: new Date()
  });
  const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
  await updateDoc(itemRef, { commentCount: increment(1) });
  return { id: commentDoc.id, userId, displayName, text, createdAt: new Date() };
 } catch (error) {
  console.error('Error adding comment:', error);
  throw error;
 }
}
/**
 * Get comments for a community item
 */
export async function getComments(itemId, pageSize = 50) {
 try {
  if (!checkFirebaseAvailable()) return [];
  const commentsRef = collection(db, COLLECTIONS.COMMENTS);
  // Bounded: comments were previously read without a limit, so a popular item
  // downloaded its entire comment history every time the panel opened.
  const q = query(
   commentsRef,
   where('communityItemId', '==', itemId),
   orderBy('createdAt', 'desc'),
   limit(pageSize)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 } catch (error) {
  console.error('Error getting comments:', error);
  return [];
 }
}


