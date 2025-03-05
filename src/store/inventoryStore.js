import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useInventoryStore = create(persist((set) => ({
    items: [],
    currency: {
        gold: 0,
        silver: 0,
        copper: 0
    },
    encumbranceState: 'normal', // normal, encumbered, overencumbered

    updateCurrency: (currencyData) => set((state) => ({
        currency: { ...state.currency, ...currencyData }
    })),

    updateEncumbranceState: (newState) => set({
        encumbranceState: newState
    }),

    addItem: (item) => set((state) => ({
        items: [...state.items, item]
    })),

    removeItem: (itemId) => set((state) => ({
        items: state.items.filter(item => item.id !== itemId)
    })),

    moveItem: (itemId, newPosition) => set((state) => ({
        items: state.items.map(item => 
            item.id === itemId 
                ? { ...item, position: newPosition }
                : item
        )
    })),
}), { name: 'inventory' }));

export default useInventoryStore;
