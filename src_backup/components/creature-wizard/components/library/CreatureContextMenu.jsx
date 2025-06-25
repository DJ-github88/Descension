import React, { useState, useRef, useEffect } from 'react';
import '../../styles/CreatureContextMenu.css';

const CreatureContextMenu = ({
  x,
  y,
  creatureId,
  onClose,
  categories = [],
  onEdit,
  onDuplicate,
  onDelete,
  onAddToCategory
}) => {
  const [showCategorySubmenu, setShowCategorySubmenu] = useState(false);
  const menuRef = useRef(null);
  const categorySubmenuRef = useRef(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          (!categorySubmenuRef.current || !categorySubmenuRef.current.contains(event.target))) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Handle edit action
  const handleEdit = () => {
    onEdit(creatureId);
    onClose();
  };
  
  // Handle duplicate action
  const handleDuplicate = () => {
    onDuplicate(creatureId);
    onClose();
  };
  
  // Handle delete action
  const handleDelete = () => {
    onDelete(creatureId);
    onClose();
  };
  
  // Handle add to category action
  const handleAddToCategory = (categoryId) => {
    onAddToCategory(creatureId, categoryId);
    setShowCategorySubmenu(false);
    onClose();
  };
  
  // Calculate position for category submenu
  const getCategorySubmenuPosition = () => {
    if (!menuRef.current) return { left: 0, top: 0 };
    
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // If there's enough space to the right, show submenu to the right
    // Otherwise, show it to the left
    if (menuRect.right + 200 < viewportWidth) {
      return { left: '100%', top: '0' };
    } else {
      return { right: '100%', top: '0' };
    }
  };
  
  return (
    <>
      <div
        ref={menuRef}
        className="creature-context-menu"
        style={{ left: x, top: y }}
      >
        <div className="context-menu-item" onClick={handleEdit}>
          <i className="fas fa-edit"></i>
          Edit Creature
        </div>
        
        <div className="context-menu-item" onClick={handleDuplicate}>
          <i className="fas fa-copy"></i>
          Duplicate
        </div>
        
        <div 
          className="context-menu-item has-submenu"
          onMouseEnter={() => setShowCategorySubmenu(true)}
          onMouseLeave={() => setShowCategorySubmenu(false)}
        >
          <i className="fas fa-folder-plus"></i>
          Add to Category
          <i className="fas fa-chevron-right submenu-arrow"></i>
          
          {showCategorySubmenu && (
            <div 
              ref={categorySubmenuRef}
              className="context-submenu category-submenu"
              style={getCategorySubmenuPosition()}
            >
              {categories.length === 0 ? (
                <div className="context-menu-item disabled">
                  No categories available
                </div>
              ) : (
                categories.map(category => (
                  <div 
                    key={category.id}
                    className="context-menu-item"
                    onClick={() => handleAddToCategory(category.id)}
                  >
                    {category.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <div className="context-menu-divider"></div>
        
        <div className="context-menu-item delete-item" onClick={handleDelete}>
          <i className="fas fa-trash-alt"></i>
          Delete
        </div>
      </div>
    </>
  );
};

export default CreatureContextMenu;
