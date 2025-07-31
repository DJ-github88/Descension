import React, { useState } from 'react';
import useItemStore from '../../store/itemStore';
import '../../styles/category-context-menu.css';

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

    return (
        <div 
            className="category-context-menu"
            style={{ left: x, top: y }}
            onClick={e => e.stopPropagation()}
        >
            {!category.isBaseCategory && (
                <>
                    <button 
                        className="menu-item"
                        onClick={() => setEditMode('quick-rename')}
                    >
                        <i className="fas fa-signature"></i>
                        Rename
                    </button>
                    <button 
                        className="menu-item"
                        onClick={() => setEditMode('full-edit')}
                    >
                        <i className="fas fa-edit"></i>
                        Edit...
                    </button>
                    <button 
                        className="menu-item"
                        onClick={handleDelete}
                    >
                        <i className="fas fa-trash"></i>
                        Delete
                    </button>
                </>
            )}
            
            <button 
                className="menu-item"
                onClick={handleAddSubcategory}
            >
                <i className="fas fa-folder-plus"></i>
                New Folder
            </button>
            <button 
                className="menu-item"
                onClick={() => {
                    // TODO: Implement sort functionality
                    onClose();
                }}
            >
                <i className="fas fa-sort"></i>
                Sort By
            </button>
            <button 
                className="menu-item"
                onClick={() => {
                    // TODO: Implement collapse/expand functionality
                    onClose();
                }}
            >
                <i className="fas fa-compress-arrows-alt"></i>
                Collapse All
            </button>

            {isContainer && (
                <>
                    <div className="menu-separator"></div>
                    <button 
                        className="menu-item"
                        onClick={handleOpen}
                    >
                        <i className="fas fa-folder-open"></i>
                        Open Container
                    </button>
                    <div 
                        className="has-submenu menu-item"
                        onMouseEnter={() => setShowLockOptions(true)}
                        onMouseLeave={() => setShowLockOptions(false)}
                    >
                        <i className="fas fa-lock"></i>
                        Lock Options
                        {showLockOptions && renderLockOptions()}
                    </div>
                </>
            )}
        </div>
    );
}
