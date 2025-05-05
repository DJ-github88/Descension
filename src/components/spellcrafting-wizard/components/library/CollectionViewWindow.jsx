import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SpellContextMenu from './SpellContextMenu';
import CollectionSpellCard from './CollectionSpellCard';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';

/**
 * CollectionViewWindow - Window to display spells in a collection
 */
const CollectionViewWindow = ({
  isOpen,
  onClose,
  collectionId
}) => {
  const [contextMenu, setContextMenu] = useState(null);
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();

  // Get the collection
  const collection = library.categories.find(cat => cat.id === collectionId);

  // Get spells in the collection
  const collectionSpells = library.spells.filter(spell => {
    // Check if the spell belongs to this collection
    if (spell.categoryIds && spell.categoryIds.includes(collectionId)) {
      return true;
    }
    return false;
  });

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu && !e.target.closest('.spell-context-menu')) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  // Handle selecting a spell
  const handleSelectSpell = (spellId) => {
    dispatch(libraryActionCreators.selectSpell(spellId));
  };

  // Handle duplicating a spell
  const handleDuplicateSpell = (spellId) => {
    dispatch(libraryActionCreators.duplicateSpell(spellId));
  };

  // Handle removing a spell from the collection
  const handleRemoveFromCollection = (spellId) => {
    const spell = library.spells.find(s => s.id === spellId);
    if (spell && spell.categoryIds) {
      const updatedCategories = spell.categoryIds.filter(id => id !== collectionId);
      dispatch(libraryActionCreators.categorizeSpell(spellId, updatedCategories));
    }
  };

  // Handle editing a spell by transferring its data to the wizard
  const handleEditSpell = (spellId) => {
    dispatch(libraryActionCreators.selectSpell(spellId));
    onClose();
  };

  // Handle adding spell to another collection
  const handleAddToCollection = (spellId, targetCollectionId) => {
    const spell = library.spells.find(s => s.id === spellId);
    if (spell) {
      const currentCategories = spell.categoryIds || [];
      // Check if the spell is already in the target collection
      if (!currentCategories.includes(targetCollectionId)) {
        // Add to the target collection without duplicates
        dispatch(libraryActionCreators.categorizeSpell(spellId, [...currentCategories, targetCollectionId]));
      }
    }
  };

  // Function to clean up duplicate spells in this collection
  const cleanupDuplicateSpells = () => {
    // Get all spells in this collection
    const spellsInCollection = library.spells.filter(spell =>
      spell.categoryIds && spell.categoryIds.includes(collectionId)
    );

    // For each spell, ensure it has no duplicate category IDs
    spellsInCollection.forEach(spell => {
      if (spell.categoryIds) {
        // Get unique category IDs
        const uniqueCategoryIds = [...new Set(spell.categoryIds)];

        // If there were duplicates, update the spell
        if (uniqueCategoryIds.length !== spell.categoryIds.length) {
          dispatch(libraryActionCreators.categorizeSpell(spell.id, uniqueCategoryIds));
        }
      }
    });

    // Check for duplicate spell entries (same spell appearing multiple times)
    const spellIds = spellsInCollection.map(spell => spell.id);
    const uniqueSpellIds = [...new Set(spellIds)];

    // If we found duplicate spell entries, remove them
    if (uniqueSpellIds.length !== spellIds.length) {
      console.log('Found duplicate spell entries in collection, cleaning up...');

      // For each unique spell ID, ensure it only appears once in the collection
      uniqueSpellIds.forEach(spellId => {
        const spell = library.spells.find(s => s.id === spellId);
        if (spell && spell.categoryIds) {
          // Ensure the spell has this collection ID only once
          const categoryIds = spell.categoryIds.filter(id => id !== collectionId);
          categoryIds.push(collectionId); // Add it back once

          // Update the spell's categories
          dispatch(libraryActionCreators.categorizeSpell(spellId, categoryIds));
        }
      });
    }
  };

  // Clean up duplicates when the component mounts
  useEffect(() => {
    // Run cleanup with a slight delay to ensure all data is loaded
    const timer = setTimeout(() => {
      cleanupDuplicateSpells();
    }, 100);

    return () => clearTimeout(timer);
  }, [collectionId]);

  // If collection doesn't exist, don't render
  if (!collection) {
    return null;
  }

  // Use ReactDOM.createPortal to render the window directly to the document body
  // This ensures it's not constrained by any parent containers
  return ReactDOM.createPortal(
    <div
      className={`collection-view-overlay ${isOpen ? 'active' : ''}`}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#0f172a',
          borderRadius: '10px',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(30, 58, 138, 0.5)',
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #1e3a8a',
          overflow: 'hidden'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px',
          borderBottom: '2px solid #1e3a8a',
          background: 'linear-gradient(to bottom, #1e293b, #0f172a)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              marginRight: '15px',
              width: '48px',
              height: '48px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '2px solid #4a4a4a',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
            }}>
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${collection.icon || 'inv_misc_questionmark'}.jpg`}
                alt={collection.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h2 style={{
              margin: 0,
              color: '#ffd100',
              fontFamily: '"Cinzel", serif',
              fontSize: '24px',
              textShadow: '1px 1px 2px #000'
            }}>{collection.name}</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.3)',
              border: '1px solid rgba(248, 113, 113, 0.4)',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0',
          backgroundColor: '#0f172a'
        }}>
          {collectionSpells.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              textAlign: 'center',
              color: '#94a3b8',
              height: '100%',
              minHeight: '300px'
            }}>
              <i className="fas fa-book-open" style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}></i>
              <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>No spells in this collection.</p>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Right-click on spells in the library to add them to this collection.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              padding: '20px',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 200px)',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95)), url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill-opacity="0.03"><path d="M0 0h64v64H0z" fill="none"/><path d="M32 8l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="%231e3a8a"/></svg>\')',
              borderRadius: '8px',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)'
            }}>
              {collectionSpells.map(spell => (
                <CollectionSpellCard
                  key={spell.id}
                  spell={spell}
                  isSelected={library.selectedSpell === spell.id}
                  onSelect={() => handleSelectSpell(spell.id)}
                  onDelete={() => handleRemoveFromCollection(spell.id)}
                  onDuplicate={() => handleDuplicateSpell(spell.id)}
                  categories={library.categories}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      spellId: spell.id
                    });
                  }}
                />
              ))}
            </div>
          )}

          {/* Context Menu */}
          {contextMenu && ReactDOM.createPortal(
            <SpellContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              spell={library.spells.find(s => s.id === contextMenu.spellId)}
              onClose={() => setContextMenu(null)}
              collections={library.categories}
              inCollection={true}
              onEdit={handleEditSpell}
              onDuplicate={handleDuplicateSpell}
              onDelete={handleRemoveFromCollection}
              onAddToCollection={handleAddToCollection}
            />,
            document.body
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

CollectionViewWindow.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  collectionId: PropTypes.string.isRequired
};

export default CollectionViewWindow;
