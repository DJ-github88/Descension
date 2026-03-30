import React from 'react';
import PropTypes from 'prop-types';
import UnifiedContextMenu from '../../../level-editor/UnifiedContextMenu';

/**
 * CollectionContextMenu - Context menu for spell collections
 */
const CollectionContextMenu = ({
  x,
  y,
  collection,
  onClose,
  onOpen,
  onEdit,
  onDelete
}) => {
  // Handle clicks on menu items
  const handleItemClick = (handler) => {
    handler(collection.id);
    onClose();
  };

  const menuItems = [
    {
      icon: <i className="fas fa-book-open"></i>,
      label: 'Open Collection',
      onClick: () => handleItemClick(onOpen)
    },
    {
      icon: <i className="fas fa-edit"></i>,
      label: 'Edit Collection',
      onClick: () => handleItemClick(onEdit)
    },
    { type: 'separator' },
    {
      icon: <i className="fas fa-trash"></i>,
      label: 'Delete Collection',
      onClick: () => handleItemClick(onDelete),
      className: 'danger'
    }
  ];

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

CollectionContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  collection: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default CollectionContextMenu;
