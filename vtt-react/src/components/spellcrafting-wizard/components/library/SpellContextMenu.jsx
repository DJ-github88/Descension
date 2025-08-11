import React from 'react';
import PropTypes from 'prop-types';
import '../../../../styles/unified-context-menu.css';

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
  return (
    <div
      className="unified-context-menu"
      style={{
        left: x,
        top: y
      }}
      onClick={e => e.stopPropagation()}
    >

      <button
        className="context-menu-button"
        onClick={() => {
          onDuplicate(spell.id);
          onClose();
        }}
      >
        <i className="fas fa-copy"></i>
        Duplicate Spell
      </button>

      {inCollection ? (
        <button
          className="context-menu-button danger"
          onClick={() => {
            onDelete(spell.id);
            onClose();
          }}
        >
          <i className="fas fa-minus-circle"></i>
          Remove from Collection
        </button>
      ) : (
        <>
          {collections.length > 0 && (
            <div className="context-menu-section">
              <div className="context-menu-header">Add to Collection</div>
              <div className="context-menu-items">
                {collections.map(collection => (
                  <div
                    key={collection.id}
                    className="context-menu-button"
                    onClick={() => {
                      onAddToCollection(spell.id, collection.id);
                      onClose();
                    }}
                  >
                    <i className="fas fa-book"></i>
                    {collection.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            className="context-menu-button danger"
            onClick={() => {
              onDelete(spell.id);
              onClose();
            }}
          >
            <i className="fas fa-trash"></i>
            Delete Spell
          </button>
        </>
      )}
    </div>
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
