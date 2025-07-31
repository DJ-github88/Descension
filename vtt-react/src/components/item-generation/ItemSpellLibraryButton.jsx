import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/item-wizard.css';
import { useSpellLibrary } from '../spellcrafting-wizard/context/SpellLibraryContext';

/**
 * ItemSpellLibraryButton component
 * A button that opens a popup to select spells from the library for use in items
 *
 * @param {Object} props
 * @param {string} props.selectedSpellId - Currently selected spell ID
 * @param {Function} props.onSpellSelect - Callback when a spell is selected
 * @param {string} props.buttonText - Text to display on the button
 * @param {string} props.popupTitle - Title for the popup window
 */
const ItemSpellLibraryButton = ({
  selectedSpellId,
  onSpellSelect,
  buttonText = 'Select Spell from Library',
  popupTitle = 'Select Spell from Library'
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [spellLibrary, setSpellLibrary] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get spell library from context
  const library = useSpellLibrary();

  // Load spell library data
  useEffect(() => {
    if (library && library.spells) {
      // Transform spells for display
      const transformedSpells = library.spells.map(spell => {
        // If the spell already has the necessary properties, use them
        // Otherwise, transform it
        if (spell.icon && spell.name && spell.effectType) {
          return spell;
        }

        // Transform the spell data to match the format expected
        return {
          ...spell,
          icon: spell.icon || 'spell_holy_holybolt',
          effectType: spell.effectTypes?.[0] || 'Unknown'
        };
      });

      setSpellLibrary(transformedSpells);

      // If there's a selected spell ID, find it in the library
      if (selectedSpellId) {
        const spell = transformedSpells.find(s => s.id === selectedSpellId);
        if (spell) {
          setSelectedSpell(spell);
        }
      }
    }
  }, [library, selectedSpellId]);

  // Handle spell selection
  const handleSpellSelect = (spell) => {
    setSelectedSpell(spell);
    if (onSpellSelect) {
      onSpellSelect(spell.id);
    }
    setIsPopupOpen(false);
  };

  // Handle clearing the selection
  const handleClearSelection = (e) => {
    e.stopPropagation();
    setSelectedSpell(null);
    if (onSpellSelect) {
      onSpellSelect(null);
    }
  };

  // Get spell icon URL
  const getSpellIconUrl = (iconName) => {
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName || 'inv_misc_questionmark'}.jpg`;
  };

  // Get spell quality color
  const getSpellQualityColor = (spell) => {
    if (!spell) return '#ffffff';

    // Determine color based on spell properties
    if (spell.level >= 8) return '#ff8000'; // Legendary (orange)
    if (spell.level >= 6) return '#a335ee'; // Epic (purple)
    if (spell.level >= 4) return '#0070dd'; // Rare (blue)
    if (spell.level >= 2) return '#1eff00'; // Uncommon (green)
    return '#ffffff'; // Common (white)
  };

  // Filter spells based on search query
  const filteredSpells = searchQuery
    ? spellLibrary.filter(spell =>
        spell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (spell.effectType && spell.effectType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (spell.description && spell.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : spellLibrary;

  return (
    <div className="spell-library-button-container">
      {selectedSpell ? (
        <div
          className="selected-spell-display"
          onClick={() => setIsPopupOpen(true)}
          style={{
            borderColor: `${getSpellQualityColor(selectedSpell)}80`,
            boxShadow: `0 0 8px ${getSpellQualityColor(selectedSpell)}40`
          }}
        >
          <div className="selected-spell-icon">
            <img
              src={getSpellIconUrl(selectedSpell.icon)}
              alt={selectedSpell.name}
              style={{
                border: `1px solid ${getSpellQualityColor(selectedSpell)}80`,
                boxShadow: `0 0 5px ${getSpellQualityColor(selectedSpell)}40`
              }}
            />
          </div>
          <div className="selected-spell-info">
            <div className="selected-spell-name" style={{ color: getSpellQualityColor(selectedSpell) }}>
              {selectedSpell.name}
            </div>
            {selectedSpell.effectType && (
              <div className="selected-spell-type">{selectedSpell.effectType}</div>
            )}
          </div>
          <div className="selected-spell-actions">
            <button
              className="view-details-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsPopupOpen(true);
              }}
              title="Change selection"
            >
              <i className="fas fa-exchange-alt"></i>
            </button>

            <button
              className="clear-selection-btn"
              onClick={handleClearSelection}
              title="Clear selection"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <button
          className="spell-library-button"
          onClick={() => setIsPopupOpen(true)}
        >
          <i className="fas fa-book-open"></i>
          <span>{buttonText}</span>
        </button>
      )}

      {isPopupOpen && createPortal(
        <div
          className="spell-library-modal-backdrop"
          onClick={() => setIsPopupOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(3px)'
          }}
        >
          <div
            className="spell-library-modal"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
            style={{
              width: '800px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              background: 'rgba(0, 0, 0, 0.95)',
              borderRadius: '8px',
              border: '2px solid rgba(59, 130, 246, 0.5)',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal header */}
            <div className="spell-library-modal-header" style={{
              background: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(0, 0, 0, 0.9))',
              borderBottom: '1px solid rgba(59, 130, 246, 0.5)',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                color: '#ffd100',
                margin: 0,
                fontSize: '18px',
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
              }}>
                <i className="fas fa-book-open" style={{ marginRight: '8px' }}></i>
                {popupTitle}
              </h2>
              <button
                className="close-modal-btn"
                onClick={() => setIsPopupOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0 8px',
                  transition: 'all 0.2s ease'
                }}
              >×</button>
            </div>

            {/* Modal content */}
            <div className="spell-library-popup-content" style={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
              overflow: 'hidden'
            }}>
              {/* Search input */}
              <div className="spell-library-popup-header" style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div className="search-container" style={{
                  position: 'relative',
                  width: '100%'
                }}>
                  <input
                    type="text"
                    placeholder="Search spells by name, type, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="spell-search-input"
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <span className="search-icon" style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    pointerEvents: 'none'
                  }}>
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>

              {/* Spell cards */}
              <div className="spell-library-popup-spells grid-view" style={{
                padding: '16px',
                maxHeight: '400px',
                overflowY: 'auto',
                background: 'rgba(0, 0, 0, 0.2)'
              }}>
                {filteredSpells.length === 0 ? (
                  <div className="no-spells-found" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <img
                        src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg"
                        alt="No spells found"
                        style={{
                          width: '64px',
                          height: '64px',
                          opacity: '0.5',
                          borderRadius: '8px',
                          marginBottom: '12px'
                        }}
                      />
                    </div>
                    <p style={{
                      color: '#aaa',
                      fontSize: '16px',
                      marginBottom: '16px'
                    }}>No spells match your search criteria.</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="clear-search-btn"
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        borderRadius: '4px',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <i className="fas fa-times-circle" style={{ marginRight: '6px' }}></i>
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="spell-cards-container" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    {filteredSpells.map(spell => (
                      <div
                        key={spell.id}
                        className="spell-item library-style"
                        onClick={() => handleSpellSelect(spell)}
                        style={{
                          borderColor: `${getSpellQualityColor(spell)}40`,
                          boxShadow: `0 0 8px ${getSpellQualityColor(spell)}20`
                        }}
                      >
                        <div className="spell-card" style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div className="spell-card-header" style={{
                            padding: '10px',
                            background: `linear-gradient(to bottom, ${getSpellQualityColor(spell)}20, transparent)`,
                            borderBottom: `1px solid ${getSpellQualityColor(spell)}30`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <img
                              src={getSpellIconUrl(spell.icon)}
                              alt={spell.name}
                              className="spell-icon"
                              style={{
                                border: `1px solid ${getSpellQualityColor(spell)}60`,
                                boxShadow: `0 0 5px ${getSpellQualityColor(spell)}30`
                              }}
                            />
                            <div className="spell-title" style={{ color: getSpellQualityColor(spell) }}>
                              {spell.name}
                            </div>
                          </div>
                          <div className="spell-card-body" style={{
                            padding: '10px',
                            flex: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}>
                            {spell.effectType && (
                              <div className="spell-type">
                                <span style={{
                                  display: 'inline-block',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: `${getSpellQualityColor(spell)}20`,
                                  color: getSpellQualityColor(spell),
                                  fontSize: '0.85em',
                                  fontWeight: 'bold'
                                }}>
                                  {spell.effectType}
                                </span>
                              </div>
                            )}
                            {spell.description && (
                              <div className="spell-description" style={{
                                fontSize: '0.9em',
                                color: '#ccc',
                                lineHeight: '1.4',
                                flex: '1',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: '3',
                                WebkitBoxOrient: 'vertical',
                                textOverflow: 'ellipsis'
                              }}>
                                {spell.description}
                              </div>
                            )}
                            {spell.level && (
                              <div className="spell-level" style={{
                                marginTop: '4px',
                                fontSize: '0.85em',
                                color: '#aaa'
                              }}>
                                Level {spell.level}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ItemSpellLibraryButton;
