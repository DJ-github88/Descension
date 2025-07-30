import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaPlus, FaTrash, FaSkull, FaBoxOpen, FaMapMarkerAlt, FaScroll, FaSearch, FaTimes } from 'react-icons/fa';
import useQuestStore from '../../store/questStore';
import useItemStore from '../../store/itemStore';
import useCreatureStore, { getCreatureSizeMapping } from '../../store/creatureStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import ItemSelectionModal from './ItemSelectionModal';
import QuestReward from './QuestReward';
import { CreatureLibraryProvider } from '../creature-wizard/context/CreatureLibraryContext';
import CreatureSelectionWindow from '../spellcrafting-wizard/components/common/CreatureSelectionWindow';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import { RARITY_COLORS, getQualityColor } from '../../constants/itemConstants';

// Component to display selected creature details
const CreatureDisplay = ({ creature, onRemove }) => {
  if (!creature) return null;

  return (
    <div className="selected-creature-display">
      <div className="creature-info">
        <div
          className="creature-icon"
          style={{
            backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon}.jpg)`,
            borderColor: creature.tokenBorder || '#666'
          }}
        />
        <div className="creature-details">
          <div className="creature-name">{creature.name}</div>
          <div className="creature-description">
            {creature.description || 'No description available'}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="remove-creature-button"
        onClick={onRemove}
        title="Remove selected creature"
      >
        <FaTimes />
      </button>
    </div>
  );
};

// Creature display for objectives - matches quest giver styling exactly
const CompactCreatureDisplay = ({ creature, onRemove }) => {
  if (!creature) return null;

  return (
    <div className="selected-creature-display">
      <div className="creature-info">
        <div
          className="creature-icon"
          style={{
            backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon}.jpg)`,
            borderColor: creature.tokenBorder || '#666'
          }}
        />
        <div className="creature-details">
          <div className="creature-name">{creature.name}</div>
          <div className="creature-description">
            {creature.description || 'No description available'}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="remove-creature-button"
        onClick={onRemove}
        title="Remove selected creature"
      >
        <FaTimes />
      </button>
    </div>
  );
};

// Item display for objectives - matches quest reward styling exactly
const CompactItemDisplay = ({ item, onRemove }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (!item) return null;

  const qualityLower = (item.quality || item.rarity || 'common').toLowerCase();
  const qualityColor = getQualityColor(qualityLower);
  const iconId = item.iconId || 'inv_misc_questionmark';
  const imageUrl = item.imageUrl || `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;

  // Handle mouse enter for item tooltip
  const handleMouseEnter = (e) => {
    setShowTooltip(true);
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handle mouse leave for item tooltip
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Handle mouse move for item tooltip
  const handleMouseMove = (e) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <div className="compact-item-display-wrapper" style={{ position: 'relative', display: 'inline-block', textAlign: 'center', width: '60px' }}>
      <div
        className="quest-reward quest-reward-item compact-item-hoverable"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div
          className="quest-reward-item-container"
          style={{ borderColor: qualityColor, margin: '0 auto' }}
        >
          <img
            src={imageUrl}
            alt={item.name}
            className="quest-reward-item-icon"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg`;
            }}
          />
          {item.count > 1 && (
            <div className="quest-reward-item-count">
              {item.count}
            </div>
          )}

          {/* Remove button that appears on hover */}
          <button
            type="button"
            className="item-remove-button-hover"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove item"
          >
            <FaTimes />
          </button>
        </div>

        {showTooltip && createPortal(
          <div
            className="item-tooltip-wrapper"
            style={{
              position: 'fixed',
              top: tooltipPosition.y + 20,
              left: tooltipPosition.x + 10,
              zIndex: 99999
            }}
          >
            <ItemTooltip
              item={{
                ...item,
                // Ensure all required properties are present for proper tooltip formatting
                name: item.name || 'Unknown Item',
                quality: item.quality || item.rarity || 'common',
                rarity: item.rarity || item.quality || 'common',
                type: item.type || 'weapon',
                subtype: item.subtype,
                slot: item.slot || 'main hand',

                // Stats
                baseStats: item.baseStats || {},
                combatStats: item.combatStats || {
                  armorClass: { value: item.armorClass || 0 },
                  resistances: item.resistances || {}
                },
                utilityStats: item.utilityStats || {},
                weaponStats: item.weaponStats || {},

                // Other properties
                description: item.description || '',
                iconId: iconId,
                imageUrl: imageUrl,

                // Item dimensions
                width: item.width || 1,
                height: item.height || 1,

                // Value - ensure it's properly formatted to prevent NaN errors
                value: item.value && typeof item.value === 'object'
                  ? {
                      gold: parseInt(item.value.gold) || 0,
                      silver: parseInt(item.value.silver) || 0,
                      copper: parseInt(item.value.copper) || 0
                    }
                  : { gold: 0, silver: 0, copper: 0 },

                // Required level
                requiredLevel: item.requiredLevel || 0
              }}
            />
          </div>,
          document.body
        )}
      </div>

      <div className="compact-item-name" style={{
        textAlign: 'center',
        marginTop: '5px',
        fontSize: '12px',
        color: qualityColor,
        fontWeight: '600',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
        width: '60px',
        margin: '5px auto 0 auto',
        wordWrap: 'break-word',
        lineHeight: '1.2',
        textDecoration: 'none',
        border: 'none',
        borderBottom: 'none'
      }}>
        {(item.name || 'Unknown Item')
          .replace(/_/g, ' ')
          .replace(/[_\u005F\u2017\u203E\u0332\u2014\u2013\u2012\u2011\u2010]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()}
      </div>
    </div>
  );
};



const QuestCreationForm = ({ onComplete }) => {
  const { addQuest } = useQuestStore();
  const { items } = useItemStore(state => ({ items: state.items }));
  const { creatures } = useCreatureStore(state => ({ creatures: state.creatures }));

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Normal');
  const [level, setLevel] = useState(1);
  const [giver, setGiver] = useState('');
  const [giverCreature, setGiverCreature] = useState(null); // Store full creature object
  const [location, setLocation] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [rewards, setRewards] = useState({
    experience: 0,
    currency: {
      gold: 0,
      silver: 0,
      copper: 0
    },
    items: []
  });
  const [prerequisites, setPrerequisites] = useState({
    quests: [],
    level: 1
  });

  // Item selection state
  const [showItemSelection, setShowItemSelection] = useState(false);
  const [showCreatureSelection, setShowCreatureSelection] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Add a new objective
  const addObjective = (type) => {
    const newObjective = {
      id: `obj-${Date.now()}`,
      type,
      description: '',
      optional: false
    };

    // Add type-specific properties
    if (type === 'kill' || type === 'collect') {
      newObjective.target = '';
      newObjective.count = 1;
      newObjective.progress = 0;
    } else if (type === 'visit') {
      newObjective.target = '';
      newObjective.coordinates = { x: 0, y: 0 };
      newObjective.completed = false;
    } else if (type === 'talk') {
      newObjective.target = '';
      newObjective.completed = false;
    }

    setObjectives([...objectives, newObjective]);
  };

  // Remove an objective
  const removeObjective = (id) => {
    setObjectives(objectives.filter(obj => obj.id !== id));
  };

  // Update objective properties
  const updateObjective = (id, updates) => {
    setObjectives(objectives.map(obj =>
      obj.id === id ? { ...obj, ...updates } : obj
    ));
  };

  // Add a reward item
  const addRewardItem = (item) => {
    setRewards({
      ...rewards,
      items: [...rewards.items, item]
    });
  };

  // Remove a reward item
  const removeRewardItem = (id) => {
    setRewards({
      ...rewards,
      items: rewards.items.filter(item => item.id !== id)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new quest object
    const newQuest = {
      title,
      description,
      difficulty,
      level: parseInt(level),
      status: 'active',
      giver,
      giverCreature: giverCreature, // Include full creature object
      location,
      objectives,
      rewards,
      prerequisites
    };

    // Add quest to store
    addQuest(newQuest);

    // Reset form
    resetForm();

    // Call onComplete callback
    if (onComplete) onComplete();
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDifficulty('Normal');
    setLevel(1);
    setGiver('');
    setGiverCreature(null);
    setLocation('');
    setObjectives([]);
    setRewards({
      experience: 0,
      currency: {
        gold: 0,
        silver: 0,
        copper: 0
      },
      items: []
    });
    setPrerequisites({
      quests: [],
      level: 1
    });
  };

  // Handle item hover
  const handleItemHover = (e, item) => {
    setHoveredItem(item);
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    // Check if we're selecting for an objective or for rewards
    if (window.currentObjectiveId) {
      // Update the objective with the selected item
      updateObjective(window.currentObjectiveId, {
        target: item.name,
        itemId: item.id,
        targetItem: item // Store the full item object for display
      });

      // Clear the stored objective ID
      window.currentObjectiveId = null;
    } else {
      // Add item to rewards with complete necessary properties
      addRewardItem({
        id: item.id,
        name: item.name,
        quality: item.quality || 'common',
        type: item.type || 'miscellaneous',
        // Include value property with proper defaults to prevent NaN errors
        value: item.value || { gold: 0, silver: 0, copper: 0 },
        // Include other important properties for proper display
        iconId: item.iconId || 'inv_misc_questionmark',
        imageUrl: item.imageUrl,
        description: item.description || '',
        subtype: item.subtype,
        baseStats: item.baseStats || {},
        combatStats: item.combatStats || {},
        utilityStats: item.utilityStats || {},
        weaponStats: item.weaponStats || {},

        // Quest-specific properties for miscellaneous items
        questGiver: item.questGiver,
        questObjectives: item.questObjectives,
        questChain: item.questChain,
        timeLimit: item.timeLimit,
        requiredLevel: item.requiredLevel,

        // Other miscellaneous properties
        spellSchool: item.spellSchool,
        materialType: item.materialType,
        gatheringMethod: item.gatheringMethod,
        origin: item.origin,
        tradeValue: item.tradeValue,
        keyType: item.keyType,
        lockLevel: item.lockLevel,
        junkType: item.junkType,
        condition: item.condition,
        estimatedValue: item.estimatedValue,

        // Preserve any other properties that might be needed
        width: item.width,
        height: item.height,
        slots: item.slots,
        armorClass: item.armorClass,
        resistances: item.resistances,
        immunities: item.immunities
      });
    }

    // Close item selection
    setShowItemSelection(false);
  };

  // Render objective form based on type
  const renderObjectiveForm = (objective) => {
    const commonFields = (
      <>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-input"
            value={objective.description}
            onChange={(e) => updateObjective(objective.id, { description: e.target.value })}
            placeholder="Objective description"
          />
        </div>
        <div className="form-group form-checkbox">
          <input
            type="checkbox"
            id={`optional-${objective.id}`}
            checked={objective.optional}
            onChange={(e) => updateObjective(objective.id, { optional: e.target.checked })}
          />
          <label htmlFor={`optional-${objective.id}`}>Optional objective</label>
        </div>
      </>
    );

    switch (objective.type) {
      case 'kill':
        return (
          <>
            {commonFields}
            <div className="form-group">
              <label className="form-label">Target</label>
              {objective.targetCreature ? (
                <CompactCreatureDisplay
                  creature={objective.targetCreature}
                  onRemove={() => {
                    updateObjective(objective.id, {
                      target: '',
                      creatureId: null,
                      targetCreature: null
                    });
                  }}
                />
              ) : (
                <div className="form-input-with-button">
                  <input
                    type="text"
                    className="form-input"
                    value={objective.target}
                    onChange={(e) => updateObjective(objective.id, { target: e.target.value })}
                    placeholder="Creature to kill"
                  />
                  <button
                    type="button"
                    className="form-input-button"
                    onClick={() => {
                      setShowCreatureSelection(true);
                      // Store the objective ID to update when a creature is selected
                      window.currentObjectiveId = objective.id;
                    }}
                    title="Select from Creature Library"
                  >
                    <FaSearch />
                  </button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Count</label>
              <input
                type="number"
                className="form-input"
                value={objective.count}
                onChange={(e) => updateObjective(objective.id, { count: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
          </>
        );

      case 'collect':
        return (
          <>
            {commonFields}
            <div className="form-group">
              <label className="form-label">Item</label>
              {objective.targetItem ? (
                <CompactItemDisplay
                  item={objective.targetItem}
                  onRemove={() => {
                    updateObjective(objective.id, {
                      target: '',
                      itemId: null,
                      targetItem: null
                    });
                  }}
                />
              ) : (
                <div className="form-input-with-button">
                  <input
                    type="text"
                    className="form-input"
                    value={objective.target}
                    onChange={(e) => updateObjective(objective.id, { target: e.target.value })}
                    placeholder="Item to collect"
                  />
                  <button
                    type="button"
                    className="form-input-button"
                    onClick={() => {
                      setShowItemSelection(true);
                      // Store the objective ID to update when an item is selected
                      window.currentObjectiveId = objective.id;
                    }}
                    title="Select from Item Library"
                  >
                    <FaSearch />
                  </button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Count</label>
              <input
                type="number"
                className="form-input"
                value={objective.count}
                onChange={(e) => updateObjective(objective.id, { count: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
          </>
        );

      case 'visit':
        return (
          <>
            {commonFields}
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={objective.target}
                onChange={(e) => updateObjective(objective.id, { target: e.target.value })}
                placeholder="Location to visit"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Coordinates</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  className="form-input"
                  value={objective.coordinates?.x || 0}
                  onChange={(e) => updateObjective(objective.id, {
                    coordinates: {
                      ...objective.coordinates,
                      x: parseInt(e.target.value) || 0
                    }
                  })}
                  placeholder="X"
                />
                <input
                  type="number"
                  className="form-input"
                  value={objective.coordinates?.y || 0}
                  onChange={(e) => updateObjective(objective.id, {
                    coordinates: {
                      ...objective.coordinates,
                      y: parseInt(e.target.value) || 0
                    }
                  })}
                  placeholder="Y"
                />
              </div>
            </div>
          </>
        );

      case 'talk':
        return (
          <>
            {commonFields}
            <div className="form-group">
              <label className="form-label">NPC</label>
              {objective.targetCreature ? (
                <CompactCreatureDisplay
                  creature={objective.targetCreature}
                  onRemove={() => {
                    updateObjective(objective.id, {
                      target: '',
                      creatureId: null,
                      targetCreature: null
                    });
                  }}
                />
              ) : (
                <div className="form-input-with-button">
                  <input
                    type="text"
                    className="form-input"
                    value={objective.target}
                    onChange={(e) => updateObjective(objective.id, { target: e.target.value })}
                    placeholder="NPC to talk to"
                  />
                  <button
                    type="button"
                    className="form-input-button"
                    onClick={() => {
                      setShowCreatureSelection(true);
                      // Store the objective ID to update when a creature is selected
                      window.currentObjectiveId = objective.id;
                    }}
                    title="Select NPC from Creature Library"
                  >
                    <FaSearch />
                  </button>
                </div>
              )}
            </div>
          </>
        );

      default:
        return commonFields;
    }
  };

  return (
    <div className="quest-creation-form">
      <h2 className="quest-section-title">Create New Quest</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Quest Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quest title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter quest description"
            required
          />
        </div>

        <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Difficulty</label>
            <select
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Trivial">Trivial</option>
              <option value="Easy">Easy</option>
              <option value="Normal">Normal</option>
              <option value="Hard">Hard</option>
              <option value="Epic">Epic</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Level</label>
            <input
              type="number"
              className="form-input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              min="1"
              max="60"
              required
            />
          </div>
        </div>

        {/* Quest Giver Section - Full width when creature selected, half width when not */}
        {giverCreature ? (
          <div className="form-group">
            <label className="form-label">Quest Giver</label>
            <CreatureDisplay
              creature={giverCreature}
              onRemove={() => {
                setGiverCreature(null);
                setGiver('');
              }}
            />
          </div>
        ) : (
          <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Quest Giver</label>
              <div className="quest-giver-selection">
                <div className="form-input-with-button">
                  <input
                    type="text"
                    className="form-input"
                    value={giver}
                    onChange={(e) => setGiver(e.target.value)}
                    placeholder="NPC or entity giving the quest"
                  />
                  <button
                    type="button"
                    className="enhanced-creature-select-button"
                    onClick={() => {
                      setShowCreatureSelection(true);
                      // Flag to indicate we're selecting for quest giver
                      window.selectingForQuestGiver = true;
                    }}
                    title="Select NPC from Creature Library"
                  >
                    <FaSearch />
                    <span>Select Creature</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where the quest takes place"
              />
            </div>
          </div>
        )}

        {/* Location field when creature is selected - gets its own row */}
        {giverCreature && (
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where the quest takes place"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Objectives</label>
          <div className="objective-buttons" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              type="button"
              className="form-button"
              onClick={() => addObjective('kill')}
            >
              <FaSkull style={{ marginRight: '5px' }} /> Kill
            </button>
            <button
              type="button"
              className="form-button"
              onClick={() => addObjective('collect')}
            >
              <FaBoxOpen style={{ marginRight: '5px' }} /> Collect
            </button>
            <button
              type="button"
              className="form-button"
              onClick={() => addObjective('visit')}
            >
              <FaMapMarkerAlt style={{ marginRight: '5px' }} /> Visit
            </button>
            <button
              type="button"
              className="form-button"
              onClick={() => addObjective('talk')}
            >
              <FaScroll style={{ marginRight: '5px' }} /> Talk
            </button>
          </div>

          {objectives.length === 0 && (
            <div className="empty-objectives" style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginBottom: '10px' }}>
              No objectives added. Add at least one objective using the buttons above.
            </div>
          )}

          {objectives.map((objective, index) => (
            <div
              key={objective.id}
              className="objective-item"
              style={{
                padding: '15px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
                marginBottom: '10px',
                position: 'relative'
              }}
            >
              <button
                type="button"
                className="remove-objective-btn"
                onClick={() => removeObjective(objective.id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer'
                }}
              >
                <FaTrash />
              </button>

              <h4 style={{ margin: '0 0 10px 0', color: '#ffd100' }}>
                {objective.type.charAt(0).toUpperCase() + objective.type.slice(1)} Objective
              </h4>

              {renderObjectiveForm(objective)}
            </div>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">Rewards</label>

          <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Experience</label>
              <input
                type="number"
                className="form-input"
                value={rewards.experience}
                onChange={(e) => setRewards({
                  ...rewards,
                  experience: parseInt(e.target.value) || 0
                })}
                min="0"
              />
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Gold</label>
              <input
                type="number"
                className="form-input"
                value={rewards.currency.gold}
                onChange={(e) => setRewards({
                  ...rewards,
                  currency: {
                    ...rewards.currency,
                    gold: parseInt(e.target.value) || 0
                  }
                })}
                min="0"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Silver</label>
              <input
                type="number"
                className="form-input"
                value={rewards.currency.silver}
                onChange={(e) => setRewards({
                  ...rewards,
                  currency: {
                    ...rewards.currency,
                    silver: parseInt(e.target.value) || 0
                  }
                })}
                min="0"
                max="99"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Copper</label>
              <input
                type="number"
                className="form-input"
                value={rewards.currency.copper}
                onChange={(e) => setRewards({
                  ...rewards,
                  currency: {
                    ...rewards.currency,
                    copper: parseInt(e.target.value) || 0
                  }
                })}
                min="0"
                max="99"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Item Rewards</label>
            <button
              type="button"
              className="form-button"
              onClick={() => {
                window.currentObjectiveId = null; // Clear any objective selection
                setShowItemSelection(true);
              }}
              style={{ marginBottom: '10px' }}
            >
              <FaPlus style={{ marginRight: '5px' }} /> Add Item Reward
            </button>

            {rewards.items.length === 0 && (
              <div className="empty-rewards" style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                No item rewards added.
              </div>
            )}

            {rewards.items.length > 0 && (
              <div className="reward-items" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {rewards.items.map(item => (
                  <div key={item.id} className="reward-item-wrapper">
                    <QuestReward
                      reward={item}
                      type="item"
                      onRemove={() => removeRewardItem(item.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button
            type="button"
            className="form-button"
            onClick={resetForm}
          >
            Reset
          </button>
          <button
            type="submit"
            className="form-button"
          >
            Create Quest
          </button>
        </div>
      </form>

      {/* Item selection modal */}
      <ItemSelectionModal
        isOpen={showItemSelection}
        onClose={() => setShowItemSelection(false)}
        onSelectItem={handleItemSelect}
      />

      {/* Creature selection window */}
      <CreatureLibraryProvider>
        <CreatureSelectionWindow
          isOpen={showCreatureSelection}
          onClose={() => {
            setShowCreatureSelection(false);
            window.currentObjectiveId = null;
            window.selectingForQuestGiver = false;
          }}
          onSelect={(creatures) => {
            const creature = creatures[0]; // Get first creature since we're using single select
            if (window.selectingForQuestGiver) {
              // Update quest giver with both name and full creature object
              setGiver(creature.name);
              setGiverCreature(creature);
              window.selectingForQuestGiver = false;
            } else if (window.currentObjectiveId) {
              // Update objective target with both name and full creature object
              updateObjective(window.currentObjectiveId, {
                target: creature.name,
                creatureId: creature.id,
                targetCreature: creature
              });
              window.currentObjectiveId = null;
            }
            setShowCreatureSelection(false);
          }}
          multiSelect={false}
          title="Select Creature"
        />
      </CreatureLibraryProvider>

      {/* Item tooltip */}
      {hoveredItem && (
        <TooltipPortal>
          <div
            style={{
              position: 'fixed',
              top: tooltipPosition.y + 20,
              left: tooltipPosition.x + 10,
              pointerEvents: 'none'
            }}
          >
            <ItemTooltip
              item={{
                ...hoveredItem,
                // Ensure all required properties are present for proper tooltip formatting
                name: hoveredItem.name || 'Unknown Item',
                quality: hoveredItem.quality || hoveredItem.rarity || 'common',
                rarity: hoveredItem.rarity || hoveredItem.quality || 'common',
              type: hoveredItem.type || 'weapon',
              subtype: hoveredItem.subtype,
              slot: hoveredItem.slot || 'main hand',

              // Stats
              baseStats: hoveredItem.baseStats || {},
              combatStats: hoveredItem.combatStats || {
                armorClass: { value: hoveredItem.armorClass || 0 },
                resistances: hoveredItem.resistances || {}
              },
              utilityStats: hoveredItem.utilityStats || {},
              weaponStats: hoveredItem.weaponStats || {},

              // Other properties
              description: hoveredItem.description || '',
              iconId: hoveredItem.iconId || 'inv_misc_questionmark',
              imageUrl: hoveredItem.imageUrl || `${WOW_ICON_BASE_URL}${hoveredItem.iconId || 'inv_misc_questionmark'}.jpg`,

              // Item dimensions
              width: hoveredItem.width || 1,
              height: hoveredItem.height || 1,

              // Value
              value: hoveredItem.value || { gold: 0, silver: 0, copper: 0 },

              // Required level
              requiredLevel: hoveredItem.requiredLevel || 0
            }}
          />
        </div>
        </TooltipPortal>
      )}
    </div>
  );
};

export default QuestCreationForm;
