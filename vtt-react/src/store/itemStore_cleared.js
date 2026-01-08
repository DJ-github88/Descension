import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useGameStore from './gameStore';

// Constants
export const BASE_CATEGORY = {
    id: 'all-items',
    name: 'All Items',
    parentId: null,
    icon: 'inv_misc_bag_10',
    isBaseCategory: true
};

// Item types
export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  ACCESSORY: 'accessory',
  CONSUMABLE: 'consumable',
  CONTAINER: 'container',
  MISCELLANEOUS: 'miscellaneous',
  CURRENCY: 'currency'
};

// Item rarities
export const ITEM_RARITIES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  ARTIFACT: 'artifact'
};

// Version for comprehensive items (increment when items change)
const COMPREHENSIVE_ITEMS_VERSION = 3;

// Comprehensive Pathfinder/D&D-themed item library
const COMPREHENSIVE_ITEMS = [
];

// Define comprehensive categories for organizing items
const COMPREHENSIVE_CATEGORIES = [
  BASE_CATEGORY,

  // Main Weapons Category
  {
    id: 'weapons',
    name: 'Weapons',
    icon: 'inv_sword_04',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'weapons-swords',
    name: 'Swords',
    icon: 'inv_sword_04',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-axes',
    name: 'Axes',
    icon: 'inv_axe_09',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-maces',
    name: 'Maces & Hammers',
    icon: 'inv_mace_01',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-daggers',
    name: 'Daggers',
    icon: 'inv_weapon_shortblade_01',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-bows',
    name: 'Bows & Crossbows',
    icon: 'inv_weapon_bow_08',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-staves',
    name: 'Staves & Wands',
    icon: 'inv_staff_01',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-polearms',
    name: 'Polearms',
    icon: 'inv_spear_01',
    isBaseCategory: false,
    parentId: 'weapons'
  },

  // Main Armor Category
  {
    id: 'armor',
    name: 'Armor',
    icon: 'inv_chest_plate06',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'armor-cloth',
    name: 'Cloth Armor',
    icon: 'inv_chest_cloth_07',
    isBaseCategory: false,
    parentId: 'armor'
  },
  {
    id: 'armor-leather',
    name: 'Leather Armor',
    icon: 'inv_chest_leather_01',
    isBaseCategory: false,
    parentId: 'armor'
  },
  {
    id: 'armor-mail',
    name: 'Mail Armor',
    icon: 'inv_chest_chain_15',
    isBaseCategory: false,
    parentId: 'armor'
  },
  {
    id: 'armor-plate',
    name: 'Plate Armor',
    icon: 'inv_chest_plate06',
    isBaseCategory: false,
    parentId: 'armor'
  },

  // Accessories Category
  {
    id: 'accessories',
    name: 'Accessories',
    icon: 'inv_jewelry_ring_03',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'accessories-rings',
    name: 'Rings',
    icon: 'inv_jewelry_ring_03',
    isBaseCategory: false,
    parentId: 'accessories'
  },
  {
    id: 'accessories-amulets',
    name: 'Amulets & Necklaces',
    icon: 'inv_jewelry_necklace_03',
    isBaseCategory: false,
    parentId: 'accessories'
  },
  {
    id: 'accessories-trinkets',
    name: 'Trinkets',
    icon: 'inv_misc_orb_01',
    isBaseCategory: false,
    parentId: 'accessories'
  },
  {
    id: 'accessories-cloaks',
    name: 'Cloaks',
    icon: 'inv_misc_cape_02',
    isBaseCategory: false,
    parentId: 'accessories'
  },

  // Consumables Category
  {
    id: 'consumables',
    name: 'Consumables',
    icon: 'inv_potion_51',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'consumables-potions',
    name: 'Potions',
    icon: 'inv_potion_51',
    isBaseCategory: false,
    parentId: 'consumables'
  },
  {
    id: 'consumables-food',
    name: 'Food & Drink',
    icon: 'inv_misc_food_15',
    isBaseCategory: false,
    parentId: 'consumables'
  },
  {
    id: 'consumables-scrolls',
    name: 'Scrolls',
    icon: 'inv_scroll_03',
    isBaseCategory: false,
    parentId: 'consumables'
  },
  {
    id: 'consumables-poisons',
    name: 'Poisons',
    icon: 'inv_potion_17',
    isBaseCategory: false,
    parentId: 'consumables'
  },

  // Tools Category
  {
    id: 'tools',
    name: 'Tools & Equipment',
    icon: 'inv_misc_bag_10',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'tools-crafting',
    name: 'Crafting Tools',
    icon: 'inv_misc_bag_10',
    isBaseCategory: false,
    parentId: 'tools'
  },
  {
    id: 'tools-adventuring',
    name: 'Adventuring Gear',
    icon: 'inv_misc_rope_01',
    isBaseCategory: false,
    parentId: 'tools'
  },

  // Trade Goods Category
  {
    id: 'trade-goods',
    name: 'Trade Goods',
    icon: 'inv_ore_copper_01',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'trade-goods-ores',
    name: 'Ores & Metals',
    icon: 'inv_ore_copper_01',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'trade-goods-gems',
    name: 'Gems & Stones',
    icon: 'inv_misc_gem_emerald_02',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'trade-goods-cloth',
    name: 'Cloth & Leather',
    icon: 'inv_fabric_linen_01',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'trade-goods-reagents',
    name: 'Reagents & Herbs',
    icon: 'inv_misc_herb_01',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },

  // Containers Category
  {
    id: 'containers',
    name: 'Containers',
    icon: 'inv_box_01',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'containers-bags',
    name: 'Bags & Pouches',
    icon: 'inv_misc_bag_10',
    isBaseCategory: false,
    parentId: 'containers'
  },
  {
    id: 'containers-chests',
    name: 'Chests & Boxes',
    icon: 'inv_box_01',
    isBaseCategory: false,
    parentId: 'containers'
  }
];

// Function to categorize items with comprehensive categories
const categorizeItems = (items) => {
  const itemCategories = {};

  items.forEach(item => {
    const categories = [BASE_CATEGORY.id]; // Always include base category

    // Add specific categories based on item type and subtype
    switch (item.type) {
      case 'weapon':
        categories.push('weapons');
        // Add subcategory based on weapon subtype
        switch (item.subtype) {
          case 'SWORD':
          case 'GREATSWORD':
            categories.push('weapons-swords');
            break;
          case 'AXE':
          case 'GREATAXE':
            categories.push('weapons-axes');
            break;
          case 'MACE':
          case 'MAUL':
            categories.push('weapons-maces');
            break;
          case 'DAGGER':
            categories.push('weapons-daggers');
            break;
          case 'BOW':
          case 'CROSSBOW':
            categories.push('weapons-bows');
            break;
          case 'STAFF':
          case 'WAND':
            categories.push('weapons-staves');
            break;
          case 'POLEARM':
          case 'SPEAR':
            categories.push('weapons-polearms');
            break;
        }
        break;
      case 'armor':
        categories.push('armor');
        // Add subcategory based on armor subtype
        switch (item.subtype) {
          case 'CLOTH':
          case 'CHEST':
            if (item.slots && item.slots.includes('chest') && item.name.toLowerCase().includes('robe')) {
              categories.push('armor-cloth');
            } else if (item.slots && item.slots.includes('chest')) {
              categories.push('armor-cloth');
            }
            break;
          case 'LEATHER':
            categories.push('armor-leather');
            break;
          case 'MAIL':
            categories.push('armor-mail');
            break;
          case 'PLATE':
            categories.push('armor-plate');
            break;
          case 'RING':
            categories.push('accessories', 'accessories-rings');
            break;
          case 'AMULET':
          case 'NECKLACE':
            categories.push('accessories', 'accessories-amulets');
            break;
          case 'TRINKET':
            categories.push('accessories', 'accessories-trinkets');
            break;
          case 'CLOAK':
            categories.push('accessories', 'accessories-cloaks');
            break;
        }
        break;
      case 'consumable':
        categories.push('consumables');
        switch (item.subtype) {
          case 'POTION':
            if (item.name.toLowerCase().includes('poison')) {
              categories.push('consumables-poisons');
            } else {
              categories.push('consumables-potions');
            }
            break;
          case 'FOOD':
          case 'DRINK':
            categories.push('consumables-food');
            break;
          case 'SCROLL':
            categories.push('consumables-scrolls');
            break;
          case 'POISON':
            categories.push('consumables-poisons');
            break;
        }
        break;
      case 'accessory':
        categories.push('accessories');
        // Add subcategory based on accessory subtype
        switch (item.subtype) {
          case 'RING':
            categories.push('accessories-rings');
            break;
          case 'AMULET':
          case 'NECKLACE':
            categories.push('accessories-amulets');
            break;
          case 'TRINKET':
            categories.push('accessories-trinkets');
            break;
          case 'CLOAK':
            categories.push('accessories-cloaks');
            break;
          case 'CROWN':
          case 'BELT':
            // Add these to general accessories for now
            break;
        }
        break;
      case 'container':
        categories.push('containers');
        switch (item.subtype) {
          case 'BAG':
          case 'POUCH':
            categories.push('containers-bags');
            break;
          case 'CHEST':
          case 'BOX':
            categories.push('containers-chests');
            break;
          default:
            categories.push('containers-chests');
            break;
        }
        break;
      case 'miscellaneous':
        switch (item.subtype) {
          case 'TRADE_GOODS':
            categories.push('trade-goods');
            if (item.name.toLowerCase().includes('ore') || item.name.toLowerCase().includes('metal')) {
              categories.push('trade-goods-ores');
            } else if (item.name.toLowerCase().includes('cloth') || item.name.toLowerCase().includes('leather')) {
              categories.push('trade-goods-cloth');
            } else if (item.name.toLowerCase().includes('herb') || item.name.toLowerCase().includes('reagent')) {
              categories.push('trade-goods-reagents');
            }
            break;
          case 'CRAFTING':
            categories.push('trade-goods');
            if (item.name.toLowerCase().includes('gem') || item.name.toLowerCase().includes('stone')) {
              categories.push('trade-goods-gems');
            }
            break;
          case 'TOOL':
            categories.push('tools');
            if (item.name.toLowerCase().includes('craft')) {
              categories.push('tools-crafting');
            } else {
              categories.push('tools-adventuring');
            }
            break;
        }
        break;
    }

    itemCategories[item.id] = categories;
  });

  return itemCategories;
};

const useItemStore = create(
    persist(
        (set, get) => ({
            // View state
            activeView: 'library', // 'library' or 'generation'

            // Item Library state
            items: [...COMPREHENSIVE_ITEMS],
            categories: [...COMPREHENSIVE_CATEGORIES], // Initialize with comprehensive categories
            itemCategories: categorizeItems(COMPREHENSIVE_ITEMS), // Properly categorize items
            selectedItem: null,
            selectedCategory: BASE_CATEGORY.id, // Initialize with base category selected
            openContainers: new Set(), // Track which containers are open
            itemsVersion: COMPREHENSIVE_ITEMS_VERSION, // Track version for auto-updates

            // Item Generation state
            drawMode: false,
            editMode: false,
            selectedTiles: [], // Store as array for persistence
            previewItem: null,

            // Actions
            setActiveView: (view) => set({ activeView: view }),

            // Force reset to comprehensive items (clears localStorage)
            resetToComprehensiveItems: () => {
                // Clear localStorage for this store
                localStorage.removeItem('item-store');

                // Reset to comprehensive items
                set({
                    items: [...COMPREHENSIVE_ITEMS],
                    categories: [...COMPREHENSIVE_CATEGORIES],
                    itemCategories: categorizeItems(COMPREHENSIVE_ITEMS),
                    selectedItem: null,
                    selectedCategory: BASE_CATEGORY.id,
                    openContainers: new Set(),
                    activeView: 'library',
                    drawMode: false,
                    editMode: false,
                    selectedTiles: [],
                    previewItem: null,
                    itemsVersion: COMPREHENSIVE_ITEMS_VERSION
                });

                // Store reset to comprehensive items
            },

            // Category actions
            addCategory: (categoryData) => set(state => {
                const newCategory = {
                    id: Date.now().toString(),
                    name: categoryData.name,
                    parentId: categoryData.parentId,
                    icon: categoryData.icon
                };
                return {
                    categories: [...state.categories, newCategory]
                };
            }),

            editCategory: (categoryId, updates) => set(state => ({
                categories: state.categories.map(c =>
                    c.id === categoryId && !c.isBaseCategory
                        ? { ...c, ...updates }
                        : c
                )
            })),

            deleteCategory: (categoryId) => set(state => {
                const category = state.categories.find(c => c.id === categoryId);
                if (category?.isBaseCategory) return state; // Don't delete base categories

                // Move items from deleted category to base category
                const newItemCategories = { ...state.itemCategories };
                Object.entries(state.itemCategories).forEach(([itemId, catId]) => {
                    if (catId === categoryId) {
                        newItemCategories[itemId] = BASE_CATEGORY.id;
                    }
                });

                return {
                    categories: state.categories.filter(c => c.id !== categoryId),
                    itemCategories: newItemCategories
                };
            }),

            moveCategory: (categoryId, newParentId) => set(state => {
                const category = state.categories.find(c => c.id === categoryId);
                if (category?.isBaseCategory) return state; // Don't move base categories

                return {
                    categories: state.categories.map(c =>
                        c.id === categoryId ? { ...c, parentId: newParentId } : c
                    )
                };
            }),

            selectCategory: (categoryId) => set({ selectedCategory: categoryId }),

            // Item actions
            addItem: (item, categories = null) => set(state => {
                const newItem = {
                    id: item.id || Date.now().toString(),
                    ...item
                };

                // Always ensure BASE_CATEGORY.id is included
                const categorySet = new Set([BASE_CATEGORY.id]);

                // Add additional categories if provided
                if (Array.isArray(categories)) {
                    categories.forEach(catId => {
                        if (catId) {
                            categorySet.add(catId);
                        }
                    });
                } else if (categories) {
                    categorySet.add(categories);
                }

                // Create new itemCategories state with the updated categories
                const newItemCategories = {
                    ...state.itemCategories,
                    [newItem.id]: Array.from(categorySet) // Convert Set to Array
                };

                return {
                    items: [...state.items, newItem],
                    itemCategories: newItemCategories
                };

                // Sync with multiplayer
                get().syncItemUpdate('item_added', { item: newItem, categories: Array.from(categorySet) });
            }),

            updateItem: (itemId, updates) => set(state => {
                const itemIndex = state.items.findIndex(item => item.id === itemId);
                if (itemIndex === -1) return state;

                const updatedItems = [...state.items];
                updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...updates };

                return {
                    items: updatedItems,
                    selectedItem: state.selectedItem?.id === itemId ? updatedItems[itemIndex] : state.selectedItem
                };

                // Sync with multiplayer
                get().syncItemUpdate('item_updated', { itemId, updates });
            }),

            removeItem: (itemId) => set(state => {
                // Remove the item from items array
                const newItems = state.items.filter(item => item.id !== itemId);

                // Remove the item from itemCategories
                const newItemCategories = { ...state.itemCategories };
                delete newItemCategories[itemId];

                // If this was the selected item, clear the selection
                const newSelectedItem = state.selectedItem?.id === itemId ? null : state.selectedItem;

                return {
                    items: newItems,
                    itemCategories: newItemCategories,
                    selectedItem: newSelectedItem
                };

                // Sync with multiplayer
                const itemToRemove = state.items.find(item => item.id === itemId);
                if (itemToRemove) {
                    get().syncItemUpdate('item_removed', { itemId, itemData: itemToRemove });
                }
            }),

            moveItem: (itemId, categoryId) => {
                set(state => ({
                    itemCategories: {
                        ...state.itemCategories,
                        [itemId]: categoryId === BASE_CATEGORY.id ? [BASE_CATEGORY.id] : [BASE_CATEGORY.id, categoryId]
                    }
                }));

                // Sync with multiplayer
                get().syncItemUpdate('item_moved', { itemId, categoryId });
            },

            selectItem: (item) => set({ selectedItem: item }),

            toggleContainerOpen: (containerId) => set(state => {
                // Ensure openContainers is a Set
                const currentOpenContainers = state.openContainers instanceof Set
                    ? state.openContainers
                    : new Set(Array.isArray(state.openContainers) ? state.openContainers : []);

                // Create a new Set to avoid mutating the original
                const newOpenContainers = new Set(currentOpenContainers);

                // Toggle the container state
                if (newOpenContainers.has(containerId)) {
                    newOpenContainers.delete(containerId);
                } else {
                    newOpenContainers.add(containerId);
                }

                return { openContainers: newOpenContainers };
            }),

            // Item Generation actions
            toggleDrawMode: () => set(state => ({
                drawMode: !state.drawMode,
                selectedTiles: [] // Reset tiles when toggling draw mode
            })),

            toggleEditMode: () => set(state => ({
                editMode: !state.editMode,
                selectedTiles: [] // Reset tiles when toggling edit mode
            })),

            addSelectedTile: (tileKey) => set(state => {
                const currentTiles = state.selectedTiles || [];
                if (!currentTiles.includes(tileKey)) {
                    return { selectedTiles: [...currentTiles, tileKey] };
                }
                return state;
            }),

            removeSelectedTile: (tileKey) => set(state => {
                const currentTiles = state.selectedTiles || [];
                return {
                    selectedTiles: currentTiles.filter(t => t !== tileKey)
                };
            }),

            clearSelectedTiles: () => set({ selectedTiles: [] }),

            setPreviewItem: (item) => set({ previewItem: item }),

            generateItem: (item) => set(state => {
                const newItem = {
                    ...item,
                    id: Date.now().toString(),
                    selectedTiles: [...state.selectedTiles] // Store copy of selected tiles
                };

                return {
                    items: [...state.items, newItem],
                    selectedTiles: [], // Clear selected tiles after generating item
                    previewItem: null
                };
            }),

            // Multiplayer Synchronization
            syncItemUpdate: (updateType, data) => {
                const gameStore = useGameStore.getState();
                if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                    gameStore.multiplayerSocket.emit('item_update', {
                        type: updateType,
                        data: data,
                        timestamp: Date.now()
                    });
                }
            }

        }),
        {
            name: 'item-store',
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;

                    // Parse the stored data
                    const parsed = JSON.parse(str);

                    // Check version and reset if outdated
                    if (!parsed.state || !parsed.state.itemsVersion || parsed.state.itemsVersion < COMPREHENSIVE_ITEMS_VERSION) {
                        // Item store version outdated, resetting to comprehensive items
                        localStorage.removeItem(name);
                        return null; // This will trigger default initialization
                    }

                    // Convert arrays back to Sets for specific properties
                    if (parsed.state && parsed.state.openContainers) {
                        // Ensure openContainers is a Set
                        parsed.state.openContainers = new Set(parsed.state.openContainers);
                    }

                    return parsed;
                },
                setItem: (name, value) => {
                    // Convert Sets to arrays for storage
                    const serialized = {
                        ...value,
                        state: {
                            ...value.state,
                            openContainers: Array.from(value.state.openContainers || []),
                            selectedTiles: Array.from(value.state.selectedTiles || [])
                        }
                    };
                    localStorage.setItem(name, JSON.stringify(serialized));
                },
                removeItem: (name) => localStorage.removeItem(name)
            }
        }
    )
);

export default useItemStore;
