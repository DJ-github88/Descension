import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useCreatureStore from '../../store/creatureStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import ConditionDurationModal from '../modals/ConditionDurationModal';
import './ConditionsWindow.css';

const CONDITION_CATEGORIES = {
  MOVEMENT: 'Movement',
  MENTAL: 'Mental',
  PHYSICAL: 'Physical',
  MAGICAL: 'Magical',
  COMBAT: 'Combat'
};

const CONDITIONS = {
  // Movement Conditions
  stunned: {
    name: 'Stunned',
    description: 'Cannot move or take actions',
    category: CONDITION_CATEGORIES.MOVEMENT,
    type: 'debuff',
    color: '#FFD700',
    icon: 'fas fa-dizzy',
    severity: 'severe'
  },
  paralyzed: {
    name: 'Paralyzed',
    description: 'Cannot move or speak',
    category: CONDITION_CATEGORIES.PHYSICAL,
    type: 'debuff',
    color: '#8B4513',
    icon: 'fas fa-hand-paper',
    severity: 'severe'
  },
  restrained: {
    name: 'Restrained',
    description: 'Movement is restricted',
    category: CONDITION_CATEGORIES.MOVEMENT,
    type: 'debuff',
    color: '#CD853F',
    icon: 'fas fa-link',
    severity: 'moderate'
  },
  slowed: {
    name: 'Slowed',
    description: 'Movement speed reduced by half',
    category: CONDITION_CATEGORIES.MOVEMENT,
    type: 'debuff',
    color: '#87CEEB',
    icon: 'fas fa-snail',
    severity: 'minor'
  },
  hasted: {
    name: 'Hasted',
    description: 'Movement speed doubled',
    category: CONDITION_CATEGORIES.MOVEMENT,
    type: 'buff',
    color: '#32CD32',
    icon: 'fas fa-running',
    severity: 'beneficial'
  },

  // Mental Conditions
  charmed: {
    name: 'Charmed',
    description: 'Friendly to the charmer',
    category: CONDITION_CATEGORIES.MENTAL,
    type: 'debuff',
    color: '#FF69B4',
    icon: 'fas fa-heart',
    severity: 'moderate'
  },
  frightened: {
    name: 'Frightened',
    description: 'Disadvantage on ability checks and attacks',
    category: CONDITION_CATEGORIES.MENTAL,
    type: 'debuff',
    color: '#8B0000',
    icon: 'fas fa-ghost',
    severity: 'moderate'
  },
  confused: {
    name: 'Confused',
    description: 'Actions are unpredictable',
    category: CONDITION_CATEGORIES.MENTAL,
    type: 'debuff',
    color: '#9370DB',
    icon: 'fas fa-question-circle',
    severity: 'moderate'
  },

  // Physical Conditions
  poisoned: {
    name: 'Poisoned',
    description: 'Disadvantage on attack rolls and ability checks',
    category: CONDITION_CATEGORIES.PHYSICAL,
    type: 'debuff',
    color: '#228B22',
    icon: 'fas fa-skull-crossbones',
    severity: 'moderate'
  },
  diseased: {
    name: 'Diseased',
    description: 'Ongoing health deterioration',
    category: CONDITION_CATEGORIES.PHYSICAL,
    type: 'debuff',
    color: '#556B2F',
    icon: 'fas fa-virus',
    severity: 'severe'
  },
  exhausted: {
    name: 'Exhausted',
    description: 'Reduced physical capabilities',
    category: CONDITION_CATEGORIES.PHYSICAL,
    type: 'debuff',
    color: '#A0522D',
    icon: 'fas fa-tired',
    severity: 'moderate'
  },

  // Magical Conditions
  silenced: {
    name: 'Silenced',
    description: 'Cannot cast spells with verbal components',
    category: CONDITION_CATEGORIES.MAGICAL,
    type: 'debuff',
    color: '#4B0082',
    icon: 'fas fa-volume-mute',
    severity: 'moderate'
  },
  dispelled: {
    name: 'Dispelled',
    description: 'Magical effects suppressed',
    category: CONDITION_CATEGORIES.MAGICAL,
    type: 'debuff',
    color: '#191970',
    icon: 'fas fa-ban',
    severity: 'severe'
  },

  // Combat Conditions
  bleeding: {
    name: 'Bleeding',
    description: 'Takes damage over time',
    category: CONDITION_CATEGORIES.COMBAT,
    type: 'debuff',
    color: '#DC143C',
    icon: 'fas fa-tint',
    severity: 'moderate'
  },
  burning: {
    name: 'Burning',
    description: 'Takes fire damage over time',
    category: CONDITION_CATEGORIES.COMBAT,
    type: 'debuff',
    color: '#FF4500',
    icon: 'fas fa-fire',
    severity: 'moderate'
  },
  blessed: {
    name: 'Blessed',
    description: 'Advantage on attack rolls and saving throws',
    category: CONDITION_CATEGORIES.COMBAT,
    type: 'buff',
    color: '#FFD700',
    icon: 'fas fa-star',
    severity: 'beneficial'
  },
  defending: {
    name: 'Defending',
    description: 'Increased armor and damage resistance',
    category: CONDITION_CATEGORIES.COMBAT,
    type: 'buff',
    color: '#4682B4',
    icon: 'fas fa-shield-alt',
    severity: 'beneficial'
  }
};

const ConditionsWindow = ({ isOpen, onClose, tokenId, creature }) => {
  const { updateTokenState, tokens } = useCreatureStore();
  const { addBuff } = useBuffStore();
  const { addDebuff } = useDebuffStore();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  if (!isOpen) return null;

  const token = tokens.find(t => t.id === tokenId);
  if (!token) return null;

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

    // Update token state
    const updatedConditions = [...currentConditions, newCondition];
    updateTokenState(tokenId, { conditions: updatedConditions });

    // Add to buff/debuff store for HUD display - target the specific creature
    const durationInSeconds = durationData.duration / 1000;
    const buffDebuffData = {
      name: condition.name,
      description: condition.description,
      duration: durationInSeconds,
      effects: {},
      source: 'condition',
      targetId: tokenId,
      targetType: 'token',
      icon: `fas ${condition.icon}`,
      color: condition.color,
      durationType: durationData.durationType,
      durationValue: durationData.durationValue
    };

    // For round-based durations, add remainingRounds
    if (durationData.durationType === 'rounds') {
      buffDebuffData.remainingRounds = durationData.durationValue;
    }

    if (condition.type === 'buff') {
      addBuff(buffDebuffData);
    } else {
      addDebuff(buffDebuffData);
    }

    setSelectedCondition(null);
  };

  const handleRemoveCondition = (conditionId) => {
    const updatedConditions = currentConditions.filter(c => c.id !== conditionId);
    updateTokenState(tokenId, { conditions: updatedConditions });

    // Also remove from buff/debuff stores
    const { removeBuffsForTarget } = useBuffStore.getState();
    const { removeDebuffsForTarget } = useDebuffStore.getState();

    // Find the condition being removed to determine its type
    const removedCondition = currentConditions.find(c => c.id === conditionId);
    if (removedCondition) {
      if (removedCondition.type === 'buff') {
        // Remove specific buff by name and target
        const { activeBuffs } = useBuffStore.getState();
        const buffToRemove = activeBuffs.find(b =>
          b.name === removedCondition.name && b.targetId === tokenId
        );
        if (buffToRemove) {
          useBuffStore.getState().removeBuff(buffToRemove.id);
        }
      } else {
        // Remove specific debuff by name and target
        const { activeDebuffs } = useDebuffStore.getState();
        const debuffToRemove = activeDebuffs.find(d =>
          d.name === removedCondition.name && d.targetId === tokenId
        );
        if (debuffToRemove) {
          useDebuffStore.getState().removeDebuff(debuffToRemove.id);
        }
      }
    }
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
                      <i className={condition.icon} style={{ color: condition.color }}></i>
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
                      <i className={condition.icon} style={{ color: condition.color }}></i>
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
