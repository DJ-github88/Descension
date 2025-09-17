import React from 'react';
import PropTypes from 'prop-types';
import UnifiedContextMenu from '../../../level-editor/UnifiedContextMenu';

/**
 * SpellContextMenu - Context menu for spells in the library or collections
 */
const SpellContextMenu = ({
  x,
  y,
  spell,
  onClose,
  collections = [],
  inCollection = false,
  onEdit,
  onDuplicate,
  onDelete,
  onAddToCollection
}) => {
  const menuItems = [];

  // Duplicate option
  menuItems.push({
    icon: <i className="fas fa-copy"></i>,
    label: 'Duplicate Spell',
    onClick: () => {
      onDuplicate(spell.id);
      onClose();
    }
  });

  if (inCollection) {
    // Remove from collection option
    menuItems.push({
      icon: <i className="fas fa-minus-circle"></i>,
      label: 'Remove from Collection',
      onClick: () => {
        onDelete(spell.id);
        onClose();
      },
      className: 'danger'
    });
  } else {
    // Add to collection options
    if (collections.length > 0) {
      menuItems.push({ type: 'separator' });
      collections.forEach(collection => {
        menuItems.push({
          icon: <i className="fas fa-book"></i>,
          label: collection.name,
          onClick: () => {
            onAddToCollection(spell.id, collection.id);
            onClose();
          }
        });
      });
      menuItems.push({ type: 'separator' });
    }

    // Delete spell option
    menuItems.push({
      icon: <i className="fas fa-trash"></i>,
      label: 'Delete Spell',
      onClick: () => {
        onDelete(spell.id);
        onClose();
      },
      className: 'danger'
    });
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
};

SpellContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  spell: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  collections: PropTypes.array,
  inCollection: PropTypes.bool,
  onEdit: PropTypes.func, // Made optional since edit functionality is removed
  onDuplicate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddToCollection: PropTypes.func
};

export default SpellContextMenu;
