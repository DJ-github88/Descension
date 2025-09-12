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
  setDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Collection names
const COLLECTIONS = {
  ITEMS: 'community_items',
  CATEGORIES: 'item_categories',
  USERS: 'users',
  RATINGS: 'item_ratings'
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
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_39.jpg',
    itemData: {
      damage: '2d8+3',
      damageType: 'fire',
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
    imageUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_54.jpg',
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

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching item categories:', error);
    console.log('Falling back to mock data');
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
    console.log('Falling back to mock data');
    const mockItems = MOCK_FEATURED_ITEMS.filter(item => item.categoryId === categoryId);
    return {
      items: mockItems,
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
    console.log('Falling back to mock search');
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
    console.log('Falling back to mock featured items');
    return MOCK_FEATURED_ITEMS.slice(0, pageSize);
  }
}

/**
 * Upload an item to the community
 */
export async function uploadItem(itemData, userId) {
  try {
    const itemsRef = collection(db, COLLECTIONS.ITEMS);
    
    const communityItem = {
      ...itemData,
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
    
    return {
      id: docRef.id,
      ...communityItem
    };
  } catch (error) {
    console.error('Error uploading item:', error);
    throw new Error('Failed to upload item');
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

    // Increment download count
    await updateDoc(itemRef, {
      downloadCount: (itemDoc.data().downloadCount || 0) + 1
    });

    return {
      id: itemDoc.id,
      ...itemDoc.data()
    };
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
    // This would typically be done with a Cloud Function in production
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

// Default categories for initial setup
export const DEFAULT_ITEM_CATEGORIES = [
  {
    id: 'weapons',
    name: 'Weapons',
    description: 'Swords, axes, bows, and other combat equipment',
    icon: 'inv_sword_04',
    color: '#8B4513'
  },
  {
    id: 'armor',
    name: 'Armor',
    description: 'Protective gear and clothing',
    icon: 'inv_chest_plate02',
    color: '#2d5016'
  },
  {
    id: 'consumables',
    name: 'Consumables',
    description: 'Potions, food, and other consumable items',
    icon: 'inv_potion_54',
    color: '#5a1e12'
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Utility items and equipment',
    icon: 'inv_misc_tool_01',
    color: '#a08c70'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Rings, amulets, and other accessories',
    icon: 'inv_jewelry_ring_01',
    color: '#b8860b'
  },
  {
    id: 'materials',
    name: 'Materials',
    description: 'Crafting materials and components',
    icon: 'inv_misc_gem_01',
    color: '#8b7355'
  }
];

/**
 * Initialize default item categories in Firebase
 */
export async function initializeItemCategories() {
  if (!checkFirebaseAvailable()) {
    console.log('Firebase not available, skipping category initialization');
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
      console.log(`✅ Created: ${categoryData.name}`);
    } catch (error) {
      results.push(`❌ Failed: ${categoryData.name} - ${error.message}`);
      console.error(`❌ Failed: ${categoryData.name}`, error);
    }
  }

  return results;
}
