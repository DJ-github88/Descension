import React from 'react';
import UnifiedContextMenu from '../../../level-editor/UnifiedContextMenu';

const CreatureContextMenu = ({
  x,
  y,
  creatureId,
  creature,
  onClose,
  categories = [],
  onEdit,
  onDuplicate,
  onDelete,
  onAddToCategory,
  onInspect,
  onShareToCommunity,
  user
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
  }

  // Share with Community option - only for authenticated users (not guests)
  // Allowed: Google/email login users, development bypass users
  const canShare = user && (
    (!user.isGuest && user.uid) || // Google/email authenticated user
    user.isDevelopmentUser // Development bypass user
  );

  if (onShareToCommunity && creature && canShare) {
    menuItems.push({ type: 'separator' });
    menuItems.push({
      icon: <i className="fas fa-share-alt"></i>,
      label: 'Share with Community',
      onClick: (e) => {
        e.stopPropagation();
        onShareToCommunity(creature);
        onClose();
      }
    });
  }

  // Delete action
  menuItems.push(
    { type: 'separator' },
    {
      icon: <i className="fas fa-trash-alt"></i>,
      label: 'Delete',
      onClick: handleDelete,
      className: 'danger'
    }
  );

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
