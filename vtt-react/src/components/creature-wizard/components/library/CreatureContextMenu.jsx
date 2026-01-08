import React from 'react';
import UnifiedContextMenu from '../../../level-editor/UnifiedContextMenu';

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

  const menuItems = [];

  // Main actions
  menuItems.push(
    {
      icon: <i className="fas fa-search"></i>,
      label: 'Inspect',
      onClick: handleInspect
    },
    {
      icon: <i className="fas fa-edit"></i>,
      label: 'Edit',
      onClick: handleEdit
    },
    {
      icon: <i className="fas fa-copy"></i>,
      label: 'Duplicate',
      onClick: handleDuplicate
    }
  );

  // Add to category options
  if (categories.length > 0) {
    menuItems.push({ type: 'separator' });
    categories.forEach(category => {
      menuItems.push({
        icon: <i className="fas fa-folder"></i>,
        label: `Add to ${category.name}`,
        onClick: (e) => handleAddToCategory(e, category.id)
      });
    });
    menuItems.push({ type: 'separator' });
  }

  // Delete action
  menuItems.push({
    icon: <i className="fas fa-trash-alt"></i>,
    label: 'Delete',
    onClick: handleDelete,
    className: 'danger'
  });

  return (
    <UnifiedContextMenu
      visible={true}
      x={x}
      y={y}
      onClose={onClose}
      items={menuItems}
    />
  );
};

export default CreatureContextMenu;
