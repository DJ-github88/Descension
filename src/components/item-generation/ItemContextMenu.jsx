import React, { useState } from 'react';
import useItemStore from '../../store/itemStore';
import ConfirmationDialog from './ConfirmationDialog';
import UnlockContainerModal from './UnlockContainerModal';
import '../../styles/item-context-menu.css';

const ItemContextMenu = ({ x, y, onClose, categories, onMoveToCategory, currentCategoryId, itemId, onEdit, item }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const removeItem = useItemStore(state => state.removeItem);
    const toggleContainerOpen = useItemStore(state => state.toggleContainerOpen);
    const openContainers = useItemStore(state => state.openContainers);

    const isContainer = item?.type === 'container';
    const isOpen = item && openContainers.has(item.id);
    const isLocked = item?.containerProperties?.isLocked || false;

    const handleDelete = () => {
        setShowConfirmation(true);
    };

    const handleConfirmDelete = () => {
        removeItem(itemId);
        setShowConfirmation(false);
        onClose();
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    const handleOpen = () => {
        if (!item) return;
        
        if (isLocked) {
            setShowUnlockModal(true);
        } else {
            toggleContainerOpen(item.id);
            onClose();
        }
    };

    const handleUnlockSuccess = () => {
        toggleContainerOpen(item.id);
        setShowUnlockModal(false);
        onClose();
    };

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

            {showUnlockModal && (
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
