import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import ConditionDurationModal from '../modals/ConditionDurationModal';
import { CONDITIONS, CONDITION_CATEGORIES } from '../../data/conditionsData';
import './ConditionsWindow.css';

// Helper component to render icon (image or Font Awesome)
const ConditionIcon = ({ icon, color }) => {
  if (icon && icon.startsWith('/assets/')) {
    return <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
  }
  return <i className={icon} style={{ color }}></i>;
};

const ConditionsWindow = ({ isOpen, onClose, tokenId, creature }) => {
  const { updateTokenState, tokens } = useCreatureStore();
  const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  if (!isOpen) return null;

  // Check both creature tokens and character tokens
  let token = tokens.find(t => t.id === tokenId);
  let isCharacterToken = false;
  if (!token) {
    token = characterTokens.find(t => t.id === tokenId);
    isCharacterToken = !!token;
  }
  
  if (!token) return null;

  // Initialize state.conditions if it doesn't exist
  if (!token.state) {
    token.state = {};
  }
  if (!token.state.conditions) {
    token.state.conditions = [];
  }

  const currentConditions = token.state.conditions || [];

  // Filter conditions based on category and search
  const filteredConditions = Object.entries(CONDITIONS).filter(([key, condition]) => {
    const matchesCategory = selectedCategory === 'ALL' || condition.category === selectedCategory;
    const matchesSearch = condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         condition.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConditionClick = (conditionKey, condition) => {
    setSelectedCondition({ key: conditionKey, condition });
    setShowDurationModal(true);
  };

  const handleApplyCondition = (durationData) => {
    if (!selectedCondition) return;

    const { key: conditionKey, condition } = selectedCondition;
    const newCondition = {
      id: conditionKey,
      name: condition.name,
      description: condition.description,
      type: condition.type,
      color: condition.color,
      icon: condition.icon,
      severity: condition.severity,
      appliedAt: Date.now(),
      duration: durationData.duration,
      durationType: durationData.durationType,
      durationValue: durationData.durationValue,
      source: 'manual'
    };

    // Update token state (handle both creature tokens and character tokens)
    const updatedConditions = [...currentConditions, newCondition];
    if (isCharacterToken) {
      updateCharacterTokenState(tokenId, { conditions: updatedConditions });
    } else {
      updateTokenState(tokenId, { conditions: updatedConditions });
    }

    // Conditions are only stored in token.state.conditions, NOT in buff/debuff stores
    // They are displayed separately in the HUD conditions row
    // Buffs/debuffs are separate and only created via BuffDebuffCreatorModal

    setSelectedCondition(null);
  };

  const handleRemoveCondition = (conditionId) => {
    const updatedConditions = currentConditions.filter(c => c.id !== conditionId);
    if (isCharacterToken) {
      updateCharacterTokenState(tokenId, { conditions: updatedConditions });
    } else {
      updateTokenState(tokenId, { conditions: updatedConditions });
    }

    // Conditions are only stored in token.state.conditions, not in buff/debuff stores
    // No need to remove from buff/debuff stores
  };

  return createPortal(
    <div className="conditions-window-overlay">
      <div className="conditions-window">
        <div className="conditions-header">
          <div className="conditions-title">
            <i className="fas fa-magic"></i>
            <span>Conditions - {creature.name}</span>
          </div>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="conditions-content">
          {/* Search and Filter */}
          <div className="conditions-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {Object.values(CONDITION_CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Conditions */}
          {currentConditions.length > 0 && (
            <div className="current-conditions">
              <h3>Active Conditions</h3>
              <div className="conditions-list">
                {currentConditions.map((condition, index) => (
                  <div key={index} className={`condition-item active ${condition.type}`}>
                    <div className="condition-icon">
                      <ConditionIcon icon={condition.icon} color={condition.color} />
                    </div>
                    <div className="condition-info">
                      <div className="condition-name">{condition.name}</div>
                      <div className="condition-description">{condition.description}</div>
                    </div>
                    <button
                      className="remove-condition"
                      onClick={() => handleRemoveCondition(condition.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Conditions */}
          <div className="available-conditions">
            <h3>Available Conditions</h3>
            <div className="conditions-grid">
              {filteredConditions.map(([key, condition]) => {
                const isActive = currentConditions.some(c => c.id === key);
                return (
                  <div
                    key={key}
                    className={`condition-card ${condition.type} ${isActive ? 'disabled' : ''}`}
                    onClick={() => !isActive && handleConditionClick(key, condition)}
                  >
                    <div className="condition-icon">
                      <ConditionIcon icon={condition.icon} color={condition.color} />
                    </div>
                    <div className="condition-name">{condition.name}</div>
                    <div className="condition-description">{condition.description}</div>
                    {isActive && <div className="active-indicator">Active</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ConditionDurationModal
        show={showDurationModal}
        onClose={() => {
          setShowDurationModal(false);
          setSelectedCondition(null);
        }}
        onApply={handleApplyCondition}
        conditionName={selectedCondition?.condition?.name || ''}
      />
    </div>,
    document.body
  );
};

export default ConditionsWindow;
