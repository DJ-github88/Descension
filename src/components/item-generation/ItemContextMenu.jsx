import React, { useState, useEffect } from 'react';
import useItemStore from '../../store/itemStore';
import ConfirmationDialog from './ConfirmationDialog';
import UnlockContainerModal from './UnlockContainerModal';
import '../../styles/item-context-menu.css';

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

    // If there's an error, show a simplified menu
    if (error) {
        return (
            <div
                className="item-context-menu error"
                style={{
                    left: x,
                    top: y,
                    backgroundColor: '#ffeeee',
                    border: '1px solid #ff6666',
                    boxShadow: '0 2px 8px rgba(255, 0, 0, 0.2)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="context-menu-error" style={{ padding: '10px', color: '#cc0000' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                    {error}
                </div>
                <button
                    className="context-menu-item"
                    onClick={onClose}
                    style={{
                        backgroundColor: '#ff6666',
                        color: 'white',
                        padding: '8px 12px',
                        margin: '8px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    <i className="fas fa-times" style={{ marginRight: '5px' }}></i>
                    Close
                </button>
            </div>
        );
    }

    return (
        <>
            <div
                className="item-context-menu"
                style={{
                    left: x,
                    top: y
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="context-menu-item edit-item primary-action"
                    onClick={() => {
                        onEdit(itemId);
                        onClose();
                    }}
                >
                    <i className="fas fa-edit"></i>
                    Edit Item
                </button>



                {isContainer && (
                    <div className="context-menu-section">
                        <button
                            className="context-menu-item"
                            onClick={handleOpen}
                        >
                            <i className={`fas fa-${isLocked ? 'unlock' : `folder-${isOpen ? 'open' : 'plus'}`}`}></i>
                            {isLocked ? 'Unlock Container' : (isOpen ? 'Close Container' : 'Open Container')}
                        </button>
                    </div>
                )}

                <div className="context-menu-section">
                    <div className="context-menu-header">Move to Folder</div>
                    <div className="context-menu-items">
                        {categories
                            .filter(category => category.id !== currentCategoryId)
                            .map(category => (
                                <div
                                    key={category.id}
                                    className="context-menu-item"
                                    onClick={() => {
                                        onMoveToCategory(itemId, category.id);
                                        onClose();
                                    }}
                                >
                                    <i className="fas fa-folder"></i>
                                    {category.name}
                                </div>
                            ))}
                    </div>
                </div>

                <button
                    className="context-menu-item delete-item"
                    onClick={handleDelete}
                >
                    <i className="fas fa-trash"></i>
                    Delete Item
                </button>
            </div>

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
