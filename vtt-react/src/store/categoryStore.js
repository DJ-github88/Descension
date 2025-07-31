import { create } from 'zustand';

const useCategoryStore = create((set) => ({
    categories: [],
    selectedCategory: null,
    setCategories: (categories) => set({ categories }),
    addCategory: (category) => set((state) => ({ 
        categories: [...state.categories, category] 
    })),
    updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map(cat => 
            cat.id === id ? { ...cat, ...updates } : cat
        )
    })),
    deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(cat => cat.id !== id)
    })),
    setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
}));

export default useCategoryStore;
