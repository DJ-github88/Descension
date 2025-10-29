import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faEdit, faTrash, faDice, faFire, faHeart,
  faUsers, faMagic, faBolt, faShieldAlt, faTimes, faSave
} from '@fortawesome/free-solid-svg-icons';
import CreatureSelectionWindow from '../common/CreatureSelectionWindow';
import '../../styles/RollableTableStep.css';

const TableEntryEditor = ({
  entries,
  resolutionType,
  resolutionConfig,
  onAddEntry,
  onUpdateEntry,
  onRemoveEntry
}) => {
  const [editingEntry, setEditingEntry] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showCreatureSelection, setShowCreatureSelection] = useState(false);

  // Initialize a new entry based on resolution type
  const initializeNewEntry = () => {
    const baseEntry = {
      id: uuidv4(),
      name: '',
      description: '',
      effectType: 'damage', // damage, healing, summoning, buff
      effectConfig: {
        damageFormula: '2d6',
        damageType: 'fire',
        healingFormula: '2d8',
        creatures: [], // Array of selected creatures for summoning
        quantity: 1,
        duration: 3,
        controlType: 'full',
        summonLocation: 'nearby',
        buffType: '',
        buffDuration: 3
      }
    };

    if (resolutionType === 'DICE') {
      return { ...baseEntry, range: { min: 1, max: 1 } };
    } else if (resolutionType === 'CARDS') {
      return { ...baseEntry, cardPattern: 'Hearts' };
    } else if (resolutionType === 'COINS') {
      return { ...baseEntry, coinPattern: 'All Heads' };
    }
    return baseEntry;
  };

  const handleAddNew = () => {
    setEditingEntry(initializeNewEntry());
    setEditingIndex(null);
  };

  const handleEdit = (entry, index) => {
    // Ensure effectConfig exists with all required fields
    const normalizedEntry = {
      ...entry,
      effectConfig: {
        damageFormula: '2d6',
        damageType: 'fire',
        healingFormula: '2d8',
        creatures: [],
        quantity: 1,
        duration: 3,
        controlType: 'full',
        summonLocation: 'nearby',
        buffType: '',
        buffDuration: 3,
        ...(entry.effectConfig || {})
      }
    };
    setEditingEntry(normalizedEntry);
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setEditingEntry(null);
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (!editingEntry.name.trim()) {
      alert('Please enter a name for this entry');
      return;
    }

    if (editingIndex !== null) {
      onUpdateEntry(editingIndex, editingEntry);
    } else {
      onAddEntry(editingEntry);
    }
    setEditingEntry(null);
    setEditingIndex(null);
  };

  const handleRemove = (index) => {
    if (window.confirm('Are you sure you want to remove this entry?')) {
      onRemoveEntry(index);
    }
  };

  const updateEntry = (field, value) => {
    setEditingEntry({ ...editingEntry, [field]: value });
  };

  const updateEffectConfig = (field, value) => {
    setEditingEntry({
      ...editingEntry,
      effectConfig: { ...(editingEntry.effectConfig || {}), [field]: value }
    });
  };

  // Handle creature selection from library
  const handleCreatureSelection = (selectedCreatures) => {
    updateEffectConfig('creatures', selectedCreatures);
    setShowCreatureSelection(false);
  };

  // Remove a creature from selection
  const handleRemoveCreature = (creatureId) => {
    const updatedCreatures = (editingEntry.effectConfig?.creatures || []).filter(c => c.id !== creatureId);
    updateEffectConfig('creatures', updatedCreatures);
  };

  // Get display text for resolution pattern
  const getPatternDisplay = (entry) => {
    if (resolutionType === 'DICE') {
      const min = entry.range?.min || 1;
      const max = entry.range?.max || 1;
      return min === max ? `${min}` : `${min}-${max}`;
    } else if (resolutionType === 'CARDS') {
      return entry.cardPattern || 'Any';
    } else if (resolutionType === 'COINS') {
      return entry.coinPattern || 'Any';
    }
    return '';
  };

  // Get icon for effect type
  const getEffectIcon = (effectType) => {
    switch (effectType) {
      case 'damage': return faFire;
      case 'healing': return faHeart;
      case 'summoning': return faUsers;
      case 'buff': return faShieldAlt;
      default: return faMagic;
    }
  };

  // Render entry list
  const renderEntryList = () => {
    if (entries.length === 0) {
      return (
        <div className="no-entries-message">
          <FontAwesomeIcon icon={faDice} size="2x" />
          <p>No table entries yet. Click "Add Entry" to create one.</p>
        </div>
      );
    }

    return (
      <div className="table-entries-list">
        {entries.map((entry, index) => (
          <div key={entry.id || index} className="table-entry-card">
            <div className="entry-card-header">
              <div className="entry-pattern">
                <FontAwesomeIcon icon={faDice} />
                <span>{getPatternDisplay(entry)}</span>
              </div>
              <div className="entry-actions">
                <button
                  onClick={() => handleEdit(entry, index)}
                  className="entry-action-btn edit"
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="entry-action-btn delete"
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
            <div className="entry-card-body">
              <div className="entry-name">
                <FontAwesomeIcon icon={getEffectIcon(entry.effectType)} />
                <strong>{entry.name || 'Unnamed Entry'}</strong>
              </div>
              {entry.description && (
                <p className="entry-description">{entry.description}</p>
              )}
              <div className="entry-effect-summary">
                <span className="effect-type-badge">{entry.effectType || 'effect'}</span>
                {entry.effectType === 'damage' && entry.effectConfig && (
                  <span className="effect-detail">
                    {entry.effectConfig.damageFormula || '2d6'} {entry.effectConfig.damageType || 'fire'}
                  </span>
                )}
                {entry.effectType === 'healing' && entry.effectConfig && (
                  <span className="effect-detail">
                    {entry.effectConfig.healingFormula || '2d8'}
                  </span>
                )}
                {entry.effectType === 'summoning' && entry.effectConfig && (
                  <span className="effect-detail">
                    {entry.effectConfig.creatures && entry.effectConfig.creatures.length > 0
                      ? `${entry.effectConfig.quantity || 1}x ${entry.effectConfig.creatures.map(c => c.name).join(', ')}`
                      : `${entry.effectConfig.quantity || 1}x creature`
                    }
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render entry editor form
  const renderEntryEditor = () => {
    if (!editingEntry) return null;

    const modalContent = (
      <div className="entry-editor-modal" onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target.classList.contains('entry-editor-modal')) {
          handleCancel();
        }
      }}>
        <div className="entry-editor-content">

          <div className="entry-editor-body">
            {/* Two-column layout */}
            <div className="editor-columns">
              {/* Left Column - Basic Info */}
              <div className="editor-column-left">
                {/* Resolution Pattern */}
                <div className="form-section">
                  <h4>
                    <FontAwesomeIcon icon={faDice} /> Resolution Pattern
                  </h4>
                  {resolutionType === 'DICE' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Min Roll</label>
                        <input
                          type="number"
                          min="1"
                          max={resolutionConfig.diceType === 'd100' ? 100 : parseInt(resolutionConfig.diceType?.substring(1) || '20')}
                          value={editingEntry.range?.min || 1}
                          onChange={(e) => updateEntry('range', { ...editingEntry.range, min: parseInt(e.target.value) })}
                          className="wow-settings-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Max Roll</label>
                        <input
                          type="number"
                          min="1"
                          max={resolutionConfig.diceType === 'd100' ? 100 : parseInt(resolutionConfig.diceType?.substring(1) || '20')}
                          value={editingEntry.range?.max || 1}
                          onChange={(e) => updateEntry('range', { ...editingEntry.range, max: parseInt(e.target.value) })}
                          className="wow-settings-input"
                        />
                      </div>
                    </div>
                  )}

                  {resolutionType === 'CARDS' && (
                    <div className="form-group">
                      <label>Card Pattern</label>
                      <select
                        value={editingEntry.cardPattern}
                        onChange={(e) => updateEntry('cardPattern', e.target.value)}
                        className="wow-settings-input"
                      >
                        <option value="Hearts">Hearts</option>
                        <option value="Diamonds">Diamonds</option>
                        <option value="Clubs">Clubs</option>
                        <option value="Spades">Spades</option>
                        <option value="Red Cards">Red Cards</option>
                        <option value="Black Cards">Black Cards</option>
                        <option value="Face Cards">Face Cards</option>
                        <option value="Aces">Aces</option>
                      </select>
                    </div>
                  )}

                  {resolutionType === 'COINS' && (
                    <div className="form-group">
                      <label>Coin Pattern</label>
                      <select
                        value={editingEntry.coinPattern}
                        onChange={(e) => updateEntry('coinPattern', e.target.value)}
                        className="wow-settings-input"
                      >
                        <option value="All Heads">All Heads</option>
                        <option value="All Tails">All Tails</option>
                        <option value="Majority Heads (3+)">Majority Heads (3+)</option>
                        <option value="Majority Tails (3+)">Majority Tails (3+)</option>
                        <option value="Exactly 2 Heads">Exactly 2 Heads</option>
                        <option value="Exactly 2 Tails">Exactly 2 Tails</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Entry Details */}
                <div className="form-section">
                  <h4>
                    <FontAwesomeIcon icon={faMagic} /> Entry Details
                  </h4>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={editingEntry.name}
                      onChange={(e) => updateEntry('name', e.target.value)}
                      placeholder="e.g., Critical Hit, Minor Heal, Summon Wolf"
                      className="wow-settings-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editingEntry.description}
                      onChange={(e) => updateEntry('description', e.target.value)}
                      placeholder="Describe what happens when this result occurs..."
                      className="wow-settings-input"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="entry-save-button-container">
                  <button onClick={handleSave} className="save-btn">
                    <FontAwesomeIcon icon={faSave} /> Save Entry
                  </button>
                </div>
              </div>

              {/* Right Column - Effect Configuration */}
              <div className="editor-column-right">
                <div className="form-section">
                  <h4>
                    <FontAwesomeIcon icon={faBolt} /> Effect Configuration
                  </h4>
                  <div className="form-group">
                    <label>Effect Type</label>
                    <select
                      value={editingEntry.effectType}
                      onChange={(e) => updateEntry('effectType', e.target.value)}
                      className="wow-settings-input effect-type-select"
                    >
                      <option value="damage">💥 Damage</option>
                      <option value="healing">💚 Healing</option>
                      <option value="summoning">👥 Summoning</option>
                      <option value="buff">🛡️ Buff/Debuff</option>
                    </select>
                  </div>

                  {/* Damage Configuration */}
                  {editingEntry.effectType === 'damage' && (
                    <div className="effect-config-panel">
                      <div className="form-group">
                        <label>Damage Formula</label>
                        <input
                          type="text"
                          value={editingEntry.effectConfig?.damageFormula || '2d6'}
                          onChange={(e) => updateEffectConfig('damageFormula', e.target.value)}
                          placeholder="e.g., 2d6, 3d8+INT"
                          className="wow-settings-input"
                        />
                        <span className="form-hint">Use dice notation (e.g., 2d6) or formulas (e.g., 3d8+INT)</span>
                      </div>
                      <div className="form-group">
                        <label>Damage Type</label>
                        <select
                          value={editingEntry.effectConfig?.damageType || 'fire'}
                          onChange={(e) => updateEffectConfig('damageType', e.target.value)}
                          className="wow-settings-input"
                        >
                          <option value="fire">🔥 Fire</option>
                          <option value="ice">❄️ Ice</option>
                          <option value="lightning">⚡ Lightning</option>
                          <option value="necrotic">💀 Necrotic</option>
                          <option value="holy">✨ Holy</option>
                          <option value="physical">⚔️ Physical</option>
                          <option value="arcane">🔮 Arcane</option>
                          <option value="nature">🌿 Nature</option>
                          <option value="shadow">🌑 Shadow</option>
                        </select>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Critical Multiplier</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            step="0.5"
                            value={editingEntry.effectConfig?.critMultiplier || 2}
                            onChange={(e) => updateEffectConfig('critMultiplier', parseFloat(e.target.value))}
                            className="wow-settings-input"
                          />
                          <span className="form-hint">Damage multiplier on critical hits</span>
                        </div>
                        <div className="form-group">
                          <label>Area of Effect (ft)</label>
                          <input
                            type="number"
                            min="0"
                            max="60"
                            step="5"
                            value={editingEntry.effectConfig?.aoeRadius || 0}
                            onChange={(e) => updateEffectConfig('aoeRadius', parseInt(e.target.value))}
                            className="wow-settings-input"
                          />
                          <span className="form-hint">0 = single target</span>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={editingEntry.effectConfig?.ignoreArmor || false}
                            onChange={(e) => updateEffectConfig('ignoreArmor', e.target.checked)}
                          />
                          {' '}Ignore Armor/Resistance
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Healing Configuration */}
                  {editingEntry.effectType === 'healing' && (
                    <div className="effect-config-panel">
                      <div className="form-group">
                        <label>Healing Formula</label>
                        <input
                          type="text"
                          value={editingEntry.effectConfig?.healingFormula || '2d8'}
                          onChange={(e) => updateEffectConfig('healingFormula', e.target.value)}
                          placeholder="e.g., 2d8, 3d6+SPIR"
                          className="wow-settings-input"
                        />
                        <span className="form-hint">Use dice notation (e.g., 2d8) or formulas (e.g., 3d6+SPIR)</span>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Heal Over Time (rounds)</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={editingEntry.effectConfig?.hotDuration || 0}
                            onChange={(e) => updateEffectConfig('hotDuration', parseInt(e.target.value))}
                            className="wow-settings-input"
                          />
                          <span className="form-hint">0 = instant heal only</span>
                        </div>
                        <div className="form-group">
                          <label>Area of Effect (ft)</label>
                          <input
                            type="number"
                            min="0"
                            max="60"
                            step="5"
                            value={editingEntry.effectConfig?.healAoeRadius || 0}
                            onChange={(e) => updateEffectConfig('healAoeRadius', parseInt(e.target.value))}
                            className="wow-settings-input"
                          />
                          <span className="form-hint">0 = single target</span>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={editingEntry.effectConfig?.allowOverheal || false}
                            onChange={(e) => updateEffectConfig('allowOverheal', e.target.checked)}
                          />
                          {' '}Allow Overheal (temporary HP)
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={editingEntry.effectConfig?.removeCurses || false}
                            onChange={(e) => updateEffectConfig('removeCurses', e.target.checked)}
                          />
                          {' '}Remove Curses/Debuffs
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Summoning Configuration */}
                  {editingEntry.effectType === 'summoning' && (
                    <div className="effect-config-panel">
                      <div className="form-group">
                        <label>Creatures</label>
                        <button
                          type="button"
                          onClick={() => setShowCreatureSelection(true)}
                          className="creature-select-btn"
                        >
                          <FontAwesomeIcon icon={faUsers} /> Select from Creature Library
                        </button>

                        {/* Display selected creatures */}
                        {editingEntry.effectConfig?.creatures && editingEntry.effectConfig.creatures.length > 0 && (
                          <div className="selected-creatures-list">
                            {editingEntry.effectConfig.creatures.map(creature => (
                              <div key={creature.id} className="selected-creature-item">
                                <div className="creature-item-info">
                                  <span className="creature-name">{creature.name}</span>
                                  <span className="creature-type-badge">{creature.type || 'Unknown'}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCreature(creature.id)}
                                  className="remove-creature-btn"
                                  title="Remove creature"
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Quantity per Creature</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={editingEntry.effectConfig?.quantity || 1}
                            onChange={(e) => updateEffectConfig('quantity', parseInt(e.target.value))}
                            className="wow-settings-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Duration (rounds)</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={editingEntry.effectConfig?.duration || 3}
                            onChange={(e) => updateEffectConfig('duration', parseInt(e.target.value))}
                            className="wow-settings-input"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Control Type</label>
                          <select
                            value={editingEntry.effectConfig?.controlType || 'full'}
                            onChange={(e) => updateEffectConfig('controlType', e.target.value)}
                            className="wow-settings-input"
                          >
                            <option value="full">Full Control</option>
                            <option value="limited">Limited Control</option>
                            <option value="autonomous">Autonomous</option>
                            <option value="friendly">Friendly</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Summon Location</label>
                          <select
                            value={editingEntry.effectConfig?.summonLocation || 'nearby'}
                            onChange={(e) => updateEffectConfig('summonLocation', e.target.value)}
                            className="wow-settings-input"
                          >
                            <option value="nearby">Nearby (5ft)</option>
                            <option value="adjacent">Adjacent</option>
                            <option value="target">At Target</option>
                            <option value="random">Random (30ft)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Buff/Debuff Configuration */}
                  {editingEntry.effectType === 'buff' && (
                    <div className="effect-config-panel">
                      <div className="form-group">
                        <label>Effect Category</label>
                        <select
                          value={editingEntry.effectConfig?.buffCategory || 'stat'}
                          onChange={(e) => updateEffectConfig('buffCategory', e.target.value)}
                          className="wow-settings-input"
                        >
                          <option value="stat">Stat Modifier</option>
                          <option value="resistance">Resistance/Vulnerability</option>
                          <option value="condition">Condition (Haste, Slow, etc.)</option>
                          <option value="shield">Damage Shield/Barrier</option>
                        </select>
                      </div>

                      {editingEntry.effectConfig?.buffCategory === 'stat' && (
                        <>
                          <div className="form-group">
                            <label>Stat to Modify</label>
                            <select
                              value={editingEntry.effectConfig?.buffStat || 'strength'}
                              onChange={(e) => updateEffectConfig('buffStat', e.target.value)}
                              className="wow-settings-input"
                            >
                              <option value="strength">Strength</option>
                              <option value="agility">Agility</option>
                              <option value="constitution">Constitution</option>
                              <option value="intelligence">Intelligence</option>
                              <option value="spirit">Spirit</option>
                              <option value="charisma">Charisma</option>
                              <option value="armor">Armor</option>
                              <option value="speed">Speed</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Modifier Amount</label>
                            <input
                              type="number"
                              min="-10"
                              max="10"
                              value={editingEntry.effectConfig?.buffAmount || 1}
                              onChange={(e) => updateEffectConfig('buffAmount', parseInt(e.target.value))}
                              className="wow-settings-input"
                            />
                            <span className="form-hint">Positive = buff, Negative = debuff</span>
                          </div>
                        </>
                      )}

                      {editingEntry.effectConfig?.buffCategory === 'resistance' && (
                        <>
                          <div className="form-group">
                            <label>Damage Type</label>
                            <select
                              value={editingEntry.effectConfig?.resistanceType || 'fire'}
                              onChange={(e) => updateEffectConfig('resistanceType', e.target.value)}
                              className="wow-settings-input"
                            >
                              <option value="fire">🔥 Fire</option>
                              <option value="ice">❄️ Ice</option>
                              <option value="lightning">⚡ Lightning</option>
                              <option value="necrotic">💀 Necrotic</option>
                              <option value="holy">✨ Holy</option>
                              <option value="physical">⚔️ Physical</option>
                              <option value="arcane">🔮 Arcane</option>
                              <option value="nature">🌿 Nature</option>
                              <option value="shadow">🌑 Shadow</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Effect Type</label>
                            <select
                              value={editingEntry.effectConfig?.resistanceEffect || 'resistance'}
                              onChange={(e) => updateEffectConfig('resistanceEffect', e.target.value)}
                              className="wow-settings-input"
                            >
                              <option value="resistance">Resistance (reduce damage)</option>
                              <option value="immunity">Immunity (negate damage)</option>
                              <option value="vulnerability">Vulnerability (increase damage)</option>
                            </select>
                          </div>
                        </>
                      )}

                      {editingEntry.effectConfig?.buffCategory === 'condition' && (
                        <div className="form-group">
                          <label>Condition Type</label>
                          <select
                            value={editingEntry.effectConfig?.conditionType || 'haste'}
                            onChange={(e) => updateEffectConfig('conditionType', e.target.value)}
                            className="wow-settings-input"
                          >
                            <option value="haste">Haste (+1 action)</option>
                            <option value="slow">Slow (-1 action)</option>
                            <option value="invisible">Invisibility</option>
                            <option value="flying">Flight</option>
                            <option value="regeneration">Regeneration</option>
                            <option value="poison">Poison (DoT)</option>
                            <option value="stun">Stun (no actions)</option>
                            <option value="silence">Silence (no spells)</option>
                          </select>
                        </div>
                      )}

                      {editingEntry.effectConfig?.buffCategory === 'shield' && (
                        <div className="form-group">
                          <label>Shield Amount (HP)</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={editingEntry.effectConfig?.shieldAmount || 10}
                            onChange={(e) => updateEffectConfig('shieldAmount', parseInt(e.target.value))}
                            className="wow-settings-input"
                          />
                          <span className="form-hint">Absorbs damage before affecting HP</span>
                        </div>
                      )}

                      <div className="form-row">
                        <div className="form-group">
                          <label>Duration (rounds)</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={editingEntry.effectConfig?.buffDuration || 3}
                            onChange={(e) => updateEffectConfig('buffDuration', parseInt(e.target.value))}
                            className="wow-settings-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={editingEntry.effectConfig?.stackable || false}
                              onChange={(e) => updateEffectConfig('stackable', e.target.checked)}
                            />
                            {' '}Stackable
                          </label>
                          <span className="form-hint">Can apply multiple times</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    // Use portal to render modal at document root level
    return ReactDOM.createPortal(modalContent, document.body);
  };

  return (
    <div className="table-entry-editor">
      <div className="entry-editor-actions">
        <button onClick={handleAddNew} className="add-entry-btn">
          <FontAwesomeIcon icon={faPlus} /> Add Entry
        </button>
      </div>

      {renderEntryList()}
      {editingEntry && renderEntryEditor()}

      {/* Creature Selection Window */}
      <CreatureSelectionWindow
        isOpen={showCreatureSelection}
        onClose={() => setShowCreatureSelection(false)}
        onSelect={handleCreatureSelection}
        selectedCreatures={editingEntry?.effectConfig?.creatures || []}
        multiSelect={true}
        title="Select Creatures to Summon"
        effectType="summon"
      />
    </div>
  );
};

export default TableEntryEditor;

