import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Constants
export const BASE_CATEGORY = {
    id: 'all-items',
    name: 'All Items',
    parentId: null,
    icon: 'inv_misc_bag_10',
    isBaseCategory: true
};

const useItemStore = create(
    persist(
        (set, get) => ({
            // View state
            activeView: 'library', // 'library' or 'generation'
            
            // Item Library state
            items: [],
            categories: [BASE_CATEGORY], // Initialize with base item category
            itemCategories: {}, // {itemId: Set(categoryIds)}
            selectedItem: null,
            selectedCategory: BASE_CATEGORY.id, // Initialize with base category selected
            openContainers: new Set(), // Track which containers are open
            
            // Item Generation state
            drawMode: false,
            editMode: false,
            selectedTiles: [], // Store as array for persistence
            previewItem: null,
            
            // Actions
            setActiveView: (view) => set({ activeView: view }),
            
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
                console.log('=== addItem called ===');
                console.log('Item:', item);
                console.log('Categories:', categories);
                
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

                console.log('Final category set for item:', Array.from(categorySet));
                
                // Create new itemCategories state with the updated categories
                const newItemCategories = {
                    ...state.itemCategories,
                    [newItem.id]: Array.from(categorySet) // Convert Set to Array
                };
                
                console.log('Updated itemCategories:', newItemCategories);
                
                return {
                    items: [...state.items, newItem],
                    itemCategories: newItemCategories
                };
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
            }),
            
            moveItem: (itemId, categoryId) => set(state => ({
                itemCategories: {
                    ...state.itemCategories,
                    [itemId]: categoryId === BASE_CATEGORY.id ? [BASE_CATEGORY.id] : [BASE_CATEGORY.id, categoryId]
                }
            })),
            
            selectItem: (item) => set({ selectedItem: item }),
            
            toggleContainerOpen: (containerId) => set(state => {
                const newOpenContainers = new Set(state.openContainers);
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
            })
        }),
        {
            name: 'item-store',
            serialize: (state) => {
                // Convert Sets to arrays for storage
                return {
                    ...state,
                    openContainers: Array.from(state.openContainers || []),
                    selectedTiles: Array.from(state.selectedTiles || [])
                };
            },
            deserialize: (storedState) => {
                // Convert arrays back to Sets
                return {
                    ...storedState,
                    openContainers: new Set(storedState.openContainers || []),
                    selectedTiles: storedState.selectedTiles || []
                };
            }
        }
    )
);

export default useItemStore;
