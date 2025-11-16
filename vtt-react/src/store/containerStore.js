import { create } from 'zustand';
import useGameStore from './gameStore';

const useContainerStore = create((set, get) => ({
    containers: [],
    
    addContainer: (container) => {
        const newContainer = {
            id: Date.now().toString(),
            name: container.name || 'Container',
            isLocked: container.isLocked || false,
            isOpen: !container.isLocked,
            items: [],
            gridSize: container.containerProperties?.gridSize || container.gridSize || { rows: 4, cols: 6 },
            position: container.position || { x: 0, y: 0 },
            ...container
        };

        set(state => ({
            containers: [...state.containers, newContainer]
        }));

        // Sync with multiplayer
        get().syncContainerUpdate('container_added', newContainer);
    },

    removeContainer: (containerId) => {
        const state = get();
        const containerToRemove = state.containers.find(c => c.id === containerId);

        set(state => ({
            containers: state.containers.filter(c => c.id !== containerId)
        }));

        // Sync with multiplayer
        if (containerToRemove) {
            get().syncContainerUpdate('container_removed', { containerId, containerData: containerToRemove });
        }
    },

    toggleLock: (containerId) => {
        const state = get();
        const container = state.containers.find(c => c.id === containerId);

        if (container) {
            const newLockedState = !container.isLocked;
            const newOpenState = newLockedState ? false : container.isOpen; // Close if locking

            set(state => ({
                containers: state.containers.map(c =>
                    c.id === containerId
                        ? { ...c, isLocked: newLockedState, isOpen: newOpenState }
                        : c
                )
            }));

            // Sync with multiplayer
            get().syncContainerUpdate('container_lock_toggled', {
                containerId,
                isLocked: newLockedState,
                isOpen: newOpenState
            });
        }
    },

    toggleOpen: (containerId) => {
        const state = get();
        const container = state.containers.find(c => c.id === containerId);

        if (container && !container.isLocked) {
            const newOpenState = !container.isOpen;

            set(state => ({
                containers: state.containers.map(c =>
                    c.id === containerId
                        ? { ...c, isOpen: newOpenState }
                        : c
                )
            }));

            // Sync with multiplayer - this is critical for shared inventory visibility
            get().syncContainerUpdate('container_toggled', {
                containerId,
                isOpen: newOpenState
            });
        }
    },

    addItemToContainer: (containerId, item, position) => {
        set(state => ({
            containers: state.containers.map(c =>
                c.id === containerId
                    ? {
                        ...c,
                        items: [...c.items, { ...item, position }]
                    }
                    : c
            )
        }));

        // Sync with multiplayer
        get().syncContainerUpdate('item_added_to_container', {
            containerId,
            item: { ...item, position }
        });
    },

    removeItemFromContainer: (containerId, itemId) => {
        const state = get();
        const container = state.containers.find(c => c.id === containerId);
        const itemToRemove = container?.items.find(item => item.id === itemId);

        set(state => ({
            containers: state.containers.map(c =>
                c.id === containerId
                    ? {
                        ...c,
                        items: c.items.filter(item => item.id !== itemId)
                    }
                    : c
            )
        }));

        // Sync with multiplayer
        if (itemToRemove) {
            get().syncContainerUpdate('item_removed_from_container', {
                containerId,
                itemId,
                itemData: itemToRemove
            });
        }
    },

    updateContainerPosition: (containerId, position) => {
        set(state => ({
            containers: state.containers.map(c =>
                c.id === containerId
                    ? { ...c, position }
                    : c
            )
        }));

        // Sync with multiplayer
        get().syncContainerUpdate('container_position_updated', {
            containerId,
            position
        });
    },

    // Multiplayer Synchronization
    syncContainerUpdate: (updateType, data) => {
        const gameStore = useGameStore.getState();
        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
            gameStore.multiplayerSocket.emit('container_update', {
                type: updateType,
                data: data,
                timestamp: Date.now()
            });
        }
    }
}));

export default useContainerStore;
