import { create } from 'zustand';

const useContainerStore = create((set, get) => ({
    containers: [],
    
    addContainer: (container) => set(state => ({
        containers: [...state.containers, {
            id: Date.now().toString(),
            name: container.name || 'Container',
            isLocked: container.isLocked || false,
            isOpen: !container.isLocked,
            items: [],
            gridSize: container.containerProperties?.gridSize || container.gridSize || { rows: 4, cols: 6 },
            position: container.position || { x: 0, y: 0 },
            ...container
        }]
    })),

    removeContainer: (containerId) => set(state => ({
        containers: state.containers.filter(c => c.id !== containerId)
    })),

    toggleLock: (containerId) => set(state => ({
        containers: state.containers.map(c => 
            c.id === containerId 
                ? { ...c, isLocked: !c.isLocked, isOpen: !c.isLocked } // If unlocking, also open
                : c
        )
    })),

    toggleOpen: (containerId) => set(state => ({
        containers: state.containers.map(c => 
            c.id === containerId && !c.isLocked
                ? { ...c, isOpen: !c.isOpen }
                : c
        )
    })),

    addItemToContainer: (containerId, item, position) => set(state => ({
        containers: state.containers.map(c => 
            c.id === containerId
                ? {
                    ...c,
                    items: [...c.items, { ...item, position }]
                }
                : c
        )
    })),

    removeItemFromContainer: (containerId, itemId) => set(state => ({
        containers: state.containers.map(c => 
            c.id === containerId
                ? {
                    ...c,
                    items: c.items.filter(item => item.id !== itemId)
                }
                : c
        )
    })),

    updateContainerPosition: (containerId, position) => set(state => ({
        containers: state.containers.map(c => 
            c.id === containerId
                ? { ...c, position }
                : c
        )
    }))
}));

export default useContainerStore;
