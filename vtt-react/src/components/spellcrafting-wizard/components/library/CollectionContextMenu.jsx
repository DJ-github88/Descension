import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/SpellContextMenu.css';

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

  return (
    <div 
      className="spell-context-menu"
      style={{ left: x, top: y }}
      onClick={e => e.stopPropagation()}
    >
      <button 
        className="context-menu-item primary-action"
        onClick={() => handleItemClick(onOpen)}
      >
        <i className="fas fa-book-open"></i>
        Open Collection
      </button>

      <button 
        className="context-menu-item"
        onClick={() => handleItemClick(onEdit)}
      >
        <i className="fas fa-edit"></i>
        Edit Collection
      </button>

      <button 
        className="context-menu-item delete-item"
        onClick={() => handleItemClick(onDelete)}
      >
        <i className="fas fa-trash"></i>
        Delete Collection
      </button>
    </div>
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
