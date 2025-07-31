import React, { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { SpellLibraryProvider } from '../../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import AbilityLibrary from './AbilityLibrary';
import './AbilitySelectionWindow.css';

// Import the WowWindow component
const WowWindow = React.lazy(() => import('../../../../components/windows/WowWindow'));

// Spell types for filtering
const SPELL_TYPES = [
  { id: 'ACTION', name: 'Action', icon: 'fas fa-bolt' },
  { id: 'PASSIVE', name: 'Passive', icon: 'fas fa-shield-alt' },
  { id: 'REACTION', name: 'Reaction', icon: 'fas fa-redo-alt' },
  { id: 'CHANNELED', name: 'Channeled', icon: 'fas fa-spinner' },
  { id: 'TRAP', name: 'Trap', icon: 'fas fa-bomb' },
  { id: 'STATE', name: 'State', icon: 'fas fa-hourglass-half' }
];

/**
 * AbilitySelectionWindow component
 * A popup window for selecting abilities/spells from the library
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the window is open
 * @param {Function} props.onClose - Callback when the window is closed
 * @param {Function} props.onSelectAbility - Callback when an ability is selected
 */
const AbilitySelectionWindow = ({ isOpen, onClose, onSelectAbility }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [hoveredAbility, setHoveredAbility] = useState(null);
  const [previewAbility, setPreviewAbility] = useState(null);

  // Reset state when window opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedType('');
      setHoveredAbility(null);
      setPreviewAbility(null);
    }
  }, [isOpen]);

  // Update preview ability when hovering
  useEffect(() => {
    setPreviewAbility(hoveredAbility);
  }, [hoveredAbility]);

  // Handle selecting an ability
  const handleSelectAbility = (ability) => {
    if (onSelectAbility) {
      onSelectAbility(ability);
    }
  };

  // Handle type filter click
  const handleTypeFilterClick = (typeId) => {
    setSelectedType(selectedType === typeId ? '' : typeId);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="ability-selection-backdrop">
      <Suspense fallback={<div className="loading-window">Loading...</div>}>
        <WowWindow
          isOpen={true}
          onClose={onClose}
          title="Select Ability"
          defaultSize={{ width: 900, height: 700 }}
          defaultPosition={{ x: Math.max(50, window.innerWidth / 2 - 450), y: Math.max(50, window.innerHeight / 2 - 350) }}
          centered={true}
        >
          <div className="ability-selection-window">
            {/* Header with search and filters */}
            <div className="ability-selection-header">
              <div className="ability-search-container">
                <div className="ability-search-icon">
                  <i className="fas fa-search"></i>
                </div>
                <input
                  type="text"
                  className="ability-search-input"
                  placeholder="Search abilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="ability-search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              <div className="ability-type-filters">
                {SPELL_TYPES.map(type => (
                  <button
                    key={type.id}
                    className={`ability-type-filter ${selectedType === type.id ? 'active' : ''}`}
                    onClick={() => handleTypeFilterClick(type.id)}
                  >
                    <i className={type.icon}></i>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main content area with ability grid */}
            <div className="ability-selection-content">
              <SpellLibraryProvider>
                <Suspense fallback={<div className="loading-library">Loading spell library...</div>}>
                  <AbilityLibrary
                    onSelectAbility={handleSelectAbility}
                    filterType={selectedType}
                    searchQuery={searchQuery}
                    onHoverAbility={setHoveredAbility}
                  />
                </Suspense>
              </SpellLibraryProvider>
            </div>

            {/* Footer with action buttons */}
            <div className="ability-selection-footer">
              <button className="ability-cancel-button" onClick={onClose}>
                Cancel
              </button>
            </div>

            {/* Ability preview panel */}
            {previewAbility && (
              <div className="ability-preview-panel">
                <div className="ability-preview-header">
                  <div className="ability-preview-icon">
                    {previewAbility.icon ? (
                      <img
                        src={`https://wow.zamimg.com/images/wow/icons/large/${previewAbility.icon}.jpg`}
                        alt={previewAbility.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                      />
                    ) : (
                      <div className="ability-icon-placeholder">
                        <i className="fas fa-magic"></i>
                      </div>
                    )}
                  </div>
                  <div className="ability-preview-title">
                    <h3>{previewAbility.name}</h3>
                    <div className="ability-preview-type">{previewAbility.spellType || 'Ability'}</div>
                  </div>
                </div>
                <div className="ability-preview-content">
                  <p className="ability-preview-description">{previewAbility.description || 'No description available.'}</p>

                  {previewAbility.effects && previewAbility.effects.length > 0 && (
                    <div className="ability-preview-effects">
                      <h4>Effects:</h4>
                      <ul>
                        {previewAbility.effects.map((effect, index) => (
                          <li key={index} className={`effect-type-${effect.type?.toLowerCase()}`}>
                            {effect.type === 'damage' || effect.type === 'DAMAGE' ? (
                              <>
                                <span className="effect-label">Damage:</span>
                                <span className="effect-value">{effect.formula || effect.dice || '1d6'} {effect.damageType}</span>
                              </>
                            ) : effect.type === 'healing' || effect.type === 'HEALING' ? (
                              <>
                                <span className="effect-label">Healing:</span>
                                <span className="effect-value">{effect.formula || effect.dice || '1d6'}</span>
                              </>
                            ) : effect.type === 'condition' || effect.type === 'CONDITION' ? (
                              <>
                                <span className="effect-label">Condition:</span>
                                <span className="effect-value">{effect.condition} for {effect.duration} turns</span>
                              </>
                            ) : (
                              <>
                                <span className="effect-label">{effect.type}:</span>
                                <span className="effect-value">{effect.description || 'No details'}</span>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="ability-preview-stats">
                    {previewAbility.range > 0 && (
                      <div className="ability-stat">
                        <span className="stat-label">Range:</span>
                        <span className="stat-value">{previewAbility.range} ft</span>
                      </div>
                    )}
                    {previewAbility.actionPointCost > 0 && (
                      <div className="ability-stat">
                        <span className="stat-label">AP Cost:</span>
                        <span className="stat-value">{previewAbility.actionPointCost}</span>
                      </div>
                    )}
                    {previewAbility.cooldown > 0 && (
                      <div className="ability-stat">
                        <span className="stat-label">Cooldown:</span>
                        <span className="stat-value">{previewAbility.cooldown} turns</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </WowWindow>
      </Suspense>
    </div>,
    document.body
  );
};

export default AbilitySelectionWindow;
