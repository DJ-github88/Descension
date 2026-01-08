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
  isCustomSpell = false,
  onEdit,
  onDuplicate,
  onDelete,
  onAddToCollection,
  onShareToCommunity,
  onDownload
}) => {
  const menuItems = [];

  // Edit in Spell Wizard (only for custom spells)
  if (onEdit && isCustomSpell) {
    menuItems.push({
      icon: <i className="fas fa-edit"></i>,
      label: 'Edit in Spell Wizard',
      onClick: () => {
        console.log('[SpellContextMenu] Edit clicked, calling onEdit with spell:', spell);
        onEdit(spell.id);
        onClose();
      }
    });
  }

  if (inCollection) {
    // Remove from collection option
    menuItems.push({
      icon: <i className="fas fa-minus-circle"></i>,
      label: 'Remove from Collection',
      onClick: () => {
        console.log('[SpellContextMenu] Remove from collection clicked');
        onDelete(spell.id);
        onClose();
      },
      className: 'danger'
    });
  } else {
    // Download option (for community spells)
    if (onDownload) {
      menuItems.push({
        icon: <i className="fas fa-download"></i>,
        label: 'Download to Library',
        onClick: () => {
          console.log('[SpellContextMenu] Download clicked');
          onDownload();
          onClose();
        }
      });
    }

    // Add to collection as a submenu (for custom spells and community spells with onAddToCollection)
    if (collections.length > 0 && (isCustomSpell || onAddToCollection)) {
      menuItems.push({
        icon: <i className="fas fa-folder-plus"></i>,
        label: 'Add to Collection',
        submenu: collections.map(collection => ({
          icon: <i className="fas fa-book"></i>,
          label: collection.name,
          onClick: () => {
            console.log('[SpellContextMenu] Add to collection clicked:', collection.name);
            onAddToCollection(spell.id, collection.id);
            onClose();
          }
        }))
      });
    }

    // Share to Community option (only for custom spells)
    if (onShareToCommunity && isCustomSpell) {
      menuItems.push({
        icon: <i className="fas fa-share-alt"></i>,
        label: 'Share with Community',
        onClick: () => {
          console.log('[SpellContextMenu] Share to community clicked');
          onShareToCommunity(spell);
          onClose();
        }
      });
    }

    // Remove spell option (only for custom spells)
    if (onDelete && isCustomSpell) {
      menuItems.push({
        icon: <i className="fas fa-trash"></i>,
        label: 'Remove Spell',
        onClick: () => {
          console.log('[SpellContextMenu] Remove spell clicked');
          onDelete(spell.id);
          onClose();
        },
        className: 'danger'
      });
    }
  }

  // If no menu items, show a message
  if (menuItems.length === 0) {
    menuItems.push({
      icon: <i className="fas fa-info-circle"></i>,
      label: 'Class spells cannot be edited or removed',
      disabled: true
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
  isCustomSpell: PropTypes.bool,
  onEdit: PropTypes.func,
  onDuplicate: PropTypes.func,
  onDelete: PropTypes.func,
  onAddToCollection: PropTypes.func,
  onShareToCommunity: PropTypes.func,
  onDownload: PropTypes.func
};

export default SpellContextMenu;
