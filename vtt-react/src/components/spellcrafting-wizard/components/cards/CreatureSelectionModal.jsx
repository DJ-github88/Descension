import React, { useState, useEffect } from 'react';
import { LIBRARY_CREATURES } from '../../../../data/creatureLibraryData';
import '../../styles/pathfinder/main.css';

// Helper function to get icon URL
const getIconUrl = (iconId) => {
  if (!iconId) return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};

/**
 * Modal for selecting creatures for summoning spells
 */
const CreatureSelectionModal = ({ 
  isOpen, 
  onClose, 
  onSelectCreature, 
  allowedTypes = [], 
  allowedTags = [], 
  maxLevel = 10,
  currentSelection = null 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreature, setSelectedCreature] = useState(currentSelection);

  // Filter creatures based on spell requirements
  const getFilteredCreatures = () => {
    return LIBRARY_CREATURES.filter(creature => {
      // Check search term
      if (searchTerm && !creature.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Check allowed types
      if (allowedTypes.length > 0 && !allowedTypes.includes(creature.type)) {
        return false;
      }

      // Check allowed tags
      if (allowedTags.length > 0) {
        const hasAllowedTag = creature.tags?.some(tag => 
          allowedTags.some(allowedTag => 
            tag.toLowerCase().includes(allowedTag.toLowerCase())
          )
        );
        if (!hasAllowedTag) return false;
      }

      // Check max level (using challenge rating or stats as approximation)
      const creatureLevel = Math.floor((creature.stats?.maxHp || 30) / 10);
      if (creatureLevel > maxLevel) {
        return false;
      }

      return true;
    });
  };

  const filteredCreatures = getFilteredCreatures();

  const handleSelectCreature = (creature) => {
    setSelectedCreature(creature);
  };

  const handleConfirm = () => {
    if (selectedCreature) {
      onSelectCreature(selectedCreature);
      onClose();
    }
  };

  const getCreatureDisplayInfo = (creature) => {
    const stats = creature.stats || {};
    return {
      hp: stats.maxHp || 30,
      armor: stats.armor || stats.armorClass || 10,
      damage: `${Math.floor((stats.strength || 10) / 2)}d6`,
      speed: stats.speed || 30,
      type: creature.type || 'Unknown',
      size: creature.size || 'Medium'
    };
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content creature-selection-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Creature to Summon</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Search */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Search creatures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Creature Grid */}
          <div className="creature-grid">
            {filteredCreatures.map(creature => {
              const displayInfo = getCreatureDisplayInfo(creature);
              const isSelected = selectedCreature?.id === creature.id;

              return (
                <div
                  key={creature.id}
                  className={`creature-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectCreature(creature)}
                >
                  <div className="creature-icon">
                    <img
                      src={getIconUrl(creature.tokenIcon)}
                      alt={creature.name}
                      style={{ border: `2px solid ${creature.tokenBorder || '#666'}` }}
                    />
                  </div>
                  
                  <div className="creature-info">
                    <h4>{creature.name}</h4>
                    <p className="creature-type">{displayInfo.size} {displayInfo.type}</p>
                    
                    <div className="creature-stats">
                      <div className="stat">
                        <span className="stat-label">HP:</span>
                        <span className="stat-value">{displayInfo.hp}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Armor:</span>
                        <span className="stat-value">{displayInfo.armor}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">DMG:</span>
                        <span className="stat-value">{displayInfo.damage}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">SPD:</span>
                        <span className="stat-value">{displayInfo.speed}ft</span>
                      </div>
                    </div>

                    {creature.tags && (
                      <div className="creature-tags">
                        {creature.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCreatures.length === 0 && (
            <div className="no-creatures">
              <p>No creatures match the current criteria.</p>
              <p>Try adjusting your search or spell requirements.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleConfirm}
            disabled={!selectedCreature}
          >
            Select Creature
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatureSelectionModal;
