import React, { useState, useEffect } from 'react';
import useItemStore from '../../store/itemStore';
import ConfirmationDialog from './ConfirmationDialog';
import UnlockContainerModal from './UnlockContainerModal';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';

const ItemContextMenu = ({ x, y, onClose, categories, onMoveToCategory, currentCategoryId, itemId, onEdit, item }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [error, setError] = useState(null);
    const removeItem = useItemStore(state => state.removeItem);
    const toggleContainerOpen = useItemStore(state => state.toggleContainerOpen);
    const openContainers = useItemStore(state => state.openContainers);
    const items = useItemStore(state => state.items);

    // Validate item data
    useEffect(() => {
        try {
            // If item is not provided, try to find it in the store
            if (!item && itemId) {
                const foundItem = items.find(i => i.id === itemId);
                if (!foundItem) {
                    console.error('Item not found for context menu:', itemId);
                    setError('Item not found');
                }
            }
        } catch (err) {
            console.error('Error validating item data:', err);
            setError('Error loading item data');
        }
    }, [item, itemId, items]);

    // Close the context menu if there's an error
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error, onClose]);

    // Safely check item properties
    const isContainer = item?.type === 'container';

    // Check if openContainers is a Set, if not convert it to a Set
    const openContainersSet = openContainers instanceof Set
        ? openContainers
        : new Set(Array.isArray(openContainers) ? openContainers : []);

    const isOpen = item && item.id && openContainersSet.has(item.id);
    const isLocked = item?.containerProperties?.isLocked || false;

    const handleDelete = () => {
        if (!item || !itemId) {
            console.error('Cannot delete item: Invalid item data');
            setError('Cannot delete: Invalid item data');
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirmDelete = () => {
        try {
            if (!itemId) {
                throw new Error('Invalid item ID');
            }
            removeItem(itemId);
            setShowConfirmation(false);
            onClose();
        } catch (err) {
            console.error('Error deleting item:', err);
            setError('Error deleting item');
            setShowConfirmation(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    const handleOpen = () => {
        try {
            if (!item || !item.id) {
                throw new Error('Invalid item data');
            }

            if (isLocked) {
                setShowUnlockModal(true);
            } else {
                // Safely toggle container open state
                try {
                    toggleContainerOpen(item.id);
                    onClose();
                } catch (toggleError) {
                    // Fallback implementation if the store function fails
                    const newOpenContainers = new Set(
                        Array.isArray(openContainers) ? openContainers : Array.from(openContainersSet)
                    );

                    if (newOpenContainers.has(item.id)) {
                        newOpenContainers.delete(item.id);
                    } else {
                        newOpenContainers.add(item.id);
                    }

                    // Update the store manually
                    useItemStore.setState({ openContainers: newOpenContainers });
                    onClose();
                }
            }
        } catch (err) {
            console.error('Error opening container:', err);
            setError('Error opening container');
        }
    };

    const handleUnlockSuccess = () => {
        try {
            if (!item || !item.id) {
                throw new Error('Invalid item data');
            }

            // Safely toggle container open state
            try {
                toggleContainerOpen(item.id);
                setShowUnlockModal(false);
                onClose();
            } catch (toggleError) {
                console.error('Error toggling container after unlock:', toggleError);
                // Fallback implementation if the store function fails
                const newOpenContainers = new Set(
                    Array.isArray(openContainers) ? openContainers : Array.from(openContainersSet)
                );

                if (newOpenContainers.has(item.id)) {
                    newOpenContainers.delete(item.id);
                } else {
                    newOpenContainers.add(item.id);
                }

                // Update the store manually
                useItemStore.setState({ openContainers: newOpenContainers });
                setShowUnlockModal(false);
                onClose();
            }
        } catch (err) {
            console.error('Error unlocking container:', err);
            setError('Error unlocking container');
            setShowUnlockModal(false);
        }
    };

    // Build menu items array for UnifiedContextMenu
    const menuItems = [];

    // Edit Item
    menuItems.push({
        icon: '✏️',
        label: 'Edit Item',
        onClick: () => {
            onEdit(itemId);
            onClose();
        }
    });

    // Container actions
    if (isContainer) {
        menuItems.push({
            icon: isLocked ? '🔓' : (isOpen ? '📂' : '📁'),
            label: isLocked ? 'Unlock Container' : (isOpen ? 'Close Container' : 'Open Container'),
            onClick: handleOpen
        });
    }

    // Move to folder options
    const moveToFolderItems = categories
        .filter(category => category.id !== currentCategoryId)
        .map(category => ({
            icon: '📁',
            label: category.name,
            onClick: () => {
                onMoveToCategory(itemId, category.id);
                onClose();
            }
        }));

    if (moveToFolderItems.length > 0) {
        // Add separator before move options
        menuItems.push({ type: 'separator' });
        menuItems.push(...moveToFolderItems);
    }

    // Delete Item
    menuItems.push(
        { type: 'separator' },
        {
            icon: '🗑️',
            label: 'Delete Item',
            onClick: handleDelete,
            className: 'danger-action'
        }
    );

    // If there's an error, show error item
    if (error) {
        return (
            <UnifiedContextMenu
                visible={true}
                x={x}
                y={y}
                onClose={onClose}
                items={[
                    {
                        icon: '⚠️',
                        label: error,
                        disabled: true
                    },
                    { type: 'separator' },
                    {
                        icon: '✕',
                        label: 'Close',
                        onClick: onClose
                    }
                ]}
            />
        );
    }

    return (
        <>
            <UnifiedContextMenu
                visible={true}
                x={x}
                y={y}
                onClose={onClose}
                items={menuItems}
            />

            {showConfirmation && (
                <ConfirmationDialog
                    message="Are you sure you want to delete this item?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

            {showUnlockModal && item && (
                <UnlockContainerModal
                    container={item}
                    onSuccess={handleUnlockSuccess}
                    onClose={() => setShowUnlockModal(false)}
                />
            )}
        </>
    );
};

export default ItemContextMenu;
