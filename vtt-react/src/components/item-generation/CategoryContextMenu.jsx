import React, { useState } from 'react';
import useItemStore from '../../store/itemStore';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';

export default function CategoryContextMenu({ x, y, onClose, category, item }) {
    const editCategory = useItemStore(state => state.editCategory);
    const deleteCategory = useItemStore(state => state.deleteCategory);
    const addCategory = useItemStore(state => state.addCategory);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(category?.name || '');
    const [icon, setIcon] = useState(category?.icon || '');
    const [editMode, setEditMode] = useState('none'); // 'none', 'quick-rename', 'full-edit'
    const [showLockOptions, setShowLockOptions] = useState(false);

    const handleEdit = () => {
        editCategory(category.id, { name, icon });
        onClose();
    };

    const handleAddSubcategory = () => {
        addCategory({
            name: 'New Folder',
            parentId: category.id,
            icon: 'inv_misc_note_01'
        });
        onClose();
    };

    const handleDelete = () => {
        deleteCategory(category.id);
        onClose();
    };

    const handleOpen = () => {
        // TODO: Implement container opening logic
        onClose();
    };

    const handleLock = (lockType) => {
        // TODO: Implement container locking logic based on lockType
        onClose();
    };

    const renderLockOptions = () => (
        <div className="submenu lock-options">
            <div onClick={() => handleLock('code')}>Code Lock</div>
            <div onClick={() => handleLock('thievery')}>Thievery DC Lock</div>
            <div onClick={() => handleLock('none')}>Remove Lock</div>
        </div>
    );

    if (editMode === 'full-edit') {
        return (
            <div 
                className="category-context-menu edit-mode"
                style={{ left: x, top: y }}
                onClick={e => e.stopPropagation()}
            >
                <div className="menu-header">Edit Folder</div>
                <div className="menu-content">
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Folder Name"
                        className="edit-input"
                        autoFocus
                    />
                    <input
                        type="text"
                        value={icon}
                        onChange={e => setIcon(e.target.value)}
                        placeholder="Icon Name (e.g. inv_misc_note_01)"
                        className="edit-input"
                    />
                    <div className="icon-preview">
                        {icon && (
                            <img 
                                src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`}
                                alt={name}
                                onError={(e) => e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'}
                            />
                        )}
                    </div>
                    <div className="button-group">
                        <button onClick={handleEdit} className="save-button">
                            Save
                        </button>
                        <button onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (editMode === 'quick-rename') {
        return (
            <div 
                className="category-context-menu quick-rename-mode"
                style={{ left: x, top: y }}
                onClick={e => e.stopPropagation()}
            >
                <div className="menu-header">Rename Folder</div>
                <div className="menu-content">
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Folder Name"
                        className="edit-input"
                        autoFocus
                    />
                    <div className="button-group">
                        <button 
                            onClick={() => {
                                editCategory(category.id, { name });
                                onClose();
                            }} 
                            className="save-button"
                        >
                            Save
                        </button>
                        <button onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isContainer = item?.type === 'container';

    // Build menu items array for UnifiedContextMenu
    const menuItems = [];

    // Category management options (only for non-base categories)
    if (!category.isBaseCategory) {
        menuItems.push(
            {
                icon: '✏️',
                label: 'Rename',
                onClick: () => setEditMode('quick-rename')
            },
            {
                icon: '⚙️',
                label: 'Edit...',
                onClick: () => setEditMode('full-edit')
            },
            {
                icon: '🗑️',
                label: 'Delete',
                onClick: handleDelete,
                className: 'danger-action'
            }
        );
    }

    // Add separator if we have category management options
    if (!category.isBaseCategory) {
        menuItems.push({ type: 'separator' });
    }

    // General folder options
    menuItems.push(
        {
            icon: '📁',
            label: 'New Folder',
            onClick: handleAddSubcategory
        },
        {
            icon: '🔄',
            label: 'Sort By',
            onClick: () => {
                // TODO: Implement sort functionality
                onClose();
            }
        },
        {
            icon: '📦',
            label: 'Collapse All',
            onClick: () => {
                // TODO: Implement collapse/expand functionality
                onClose();
            }
        }
    );

    // Container-specific options
    if (isContainer) {
        menuItems.push(
            { type: 'separator' },
            {
                icon: '📂',
                label: 'Open Container',
                onClick: handleOpen
            }
            // Note: Lock options submenu would need special handling in UnifiedContextMenu
        );
    }

    return (
        <UnifiedContextMenu
            visible={true}
            x={x}
            y={y}
            onClose={onClose}
            items={menuItems}
        />
    );
}
