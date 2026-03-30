import React, { useState, useEffect } from 'react';
import useItemStore from '../../store/itemStore';
import ConfirmationDialog from './ConfirmationDialog';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';

const ItemContextMenu = ({ x, y, onClose, categories, onMoveToCategory, currentCategoryId, itemId, onEdit, item, onShowCategorizeModal, onShowUnlockModal, onShareToCommunity, user }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState(null);
    const removeItem = useItemStore(state => state.removeItem);
    const updateItem = useItemStore(state => state.updateItem);
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

    // Ensure container has proper containerProperties if it's a container
    if (isContainer && !item.containerProperties) {
        // Initialize default containerProperties to ensure proper functionality
        const defaultContainerProperties = {
            gridSize: { rows: 4, cols: 6 },
            items: [],
            isLocked: false,
            lockType: 'none',
            lockDC: 0,
            lockCode: '',
            flavorText: '',
            maxAttempts: 3,
            failureAction: 'none',
            failureActionDetails: {}
        };

        // Update the item in the store with default containerProperties
        updateItem(item.id, {
            ...item,
            containerProperties: defaultContainerProperties
        });

    }


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
                onShowUnlockModal(item);
                onClose(); // Close context menu immediately since modal is handled by parent
            } else {
                // Safely toggle container open state
                try {
                    toggleContainerOpen(item.id);
                    // Delay closing the context menu slightly to allow container opening to complete
                    setTimeout(() => {
                        onClose();
                    }, 100);
                } catch (toggleError) {
                    console.error('Error opening container:', toggleError);
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
                    // Delay closing the context menu slightly to allow container opening to complete
                    setTimeout(() => {
                        onClose();
                    }, 100);
                }
            }
        } catch (err) {
            console.error('Error opening container:', err);
            setError('Error opening container');
        }
    };


    // Build menu items array for UnifiedContextMenu
    const menuItems = [];

    // Edit Item
    menuItems.push({
        icon: <i className="fas fa-edit"></i>,
        label: 'Edit Item',
        onClick: () => {
            onEdit(itemId);
            onClose();
        }
    });

    // Container actions
    if (isContainer) {
        menuItems.push({
            icon: <i className={`fas ${isLocked ? 'fa-unlock' : (isOpen ? 'fa-folder-open' : 'fa-folder')}`}></i>,
            label: isLocked ? 'Unlock Container' : (isOpen ? 'Close Container' : 'Open Container'),
            onClick: handleOpen
        });
    }

    // Categorize option
    if (categories && categories.length > 0) {
        menuItems.push({
            icon: <i className="fas fa-folder"></i>,
            label: 'Categorize',
            onClick: () => {
                onShowCategorizeModal(itemId, currentCategoryId, x, y);
                onClose(); // Close the context menu immediately
            }
        });
    }

    // Share with Community option - only for authenticated users (not guests)
    // Allowed: Google/email login users, development bypass users
    const canShare = user && (
        (!user.isGuest && user.uid) || // Google/email authenticated user
        user.isDevelopmentUser // Development bypass user
    );

    if (onShareToCommunity && canShare) {
        menuItems.push({
            icon: <i className="fas fa-share-alt"></i>,
            label: 'Share with Community',
            onClick: () => {
                onShareToCommunity(item);
                onClose();
            }
        });
    }

    // Delete Item
    menuItems.push(
        { type: 'separator' },
        {
            icon: <i className="fas fa-trash"></i>,
            label: 'Delete Item',
            onClick: handleDelete,
            className: 'danger'
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
                        icon: <i className="fas fa-exclamation-triangle"></i>,
                        label: error,
                        disabled: true
                    },
                    { type: 'separator' },
                    {
                        icon: <i className="fas fa-times"></i>,
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
                visible={!showConfirmation}
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

        </>
    );
};

export default ItemContextMenu;
