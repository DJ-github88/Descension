import React from 'react';
import '../../../../styles/unified-context-menu.css';

const CreatureContextMenu = ({
  x,
  y,
  creatureId,
  onClose,
  categories = [],
  onEdit,
  onDuplicate,
  onDelete,
  onAddToCategory,
  onInspect
}) => {
  // Handle inspect button click
  const handleInspect = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Call the inspect handler immediately
    onInspect(creatureId);

    // Close the context menu
    onClose();
  };

  // Handle edit button click
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(creatureId);
    onClose();
  };

  // Handle duplicate button click
  const handleDuplicate = (e) => {
    e.stopPropagation();
    onDuplicate(creatureId);
    onClose();
  };

  // Handle delete button click
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(creatureId);
    onClose();
  };

  // Handle add to category button click
  const handleAddToCategory = (e, categoryId) => {
    e.stopPropagation();
    onAddToCategory(creatureId, categoryId);
    onClose();
  };

  return (
    <div
      className="unified-context-menu"
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-button" onClick={handleInspect}>
        <i className="fas fa-search"></i>
        Inspect
      </div>
      <div className="context-menu-button" onClick={handleEdit}>
        <i className="fas fa-edit"></i>
        Edit
      </div>
      <div className="context-menu-button" onClick={handleDuplicate}>
        <i className="fas fa-copy"></i>
        Duplicate
      </div>
      <div className="context-menu-button danger" onClick={handleDelete}>
        <i className="fas fa-trash-alt"></i>
        Delete
      </div>

      {/* Add to category submenu */}
      {categories.length > 0 && (
        <div className="context-menu-group">
          <div className="group-header">
            <i className="fas fa-folder-plus"></i>
            Add to Category
            <i className="fas fa-caret-right expand-icon"></i>
          </div>
          <div className="submenu">
            {categories.map(category => (
              <div
                key={category.id}
                className="context-menu-button"
                onClick={(e) => handleAddToCategory(e, category.id)}
              >
                <i className="fas fa-folder"></i>
                {category.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatureContextMenu;
