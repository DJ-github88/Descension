import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faDice, faFire, faHeart, faUsers, faMagic, faBolt } from '@fortawesome/free-solid-svg-icons';
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
  const [isEditing, setIsEditing] = useState(false);

  // Initialize a new entry based on resolution type
  const initializeNewEntry = () => {
    const baseEntry = {
      id: uuidv4(),
      name: '',
      description: '',
      effectType: 'damage', // damage, healing, summoning, buff
      effectConfig: {
        // Damage config
        damageFormula: '2d6',
        damageType: 'fire',
        // Healing config
        healingFormula: '2d8',
        // Summoning config
        creatureType: '',
        quantity: 1,
        // Buff config
        buffType: '',
        duration: 3
      }
    };

    if (resolutionType === 'DICE') {
      return {
        ...baseEntry,
        range: { min: 1, max: 1 }
      };
    } else if (resolutionType === 'CARDS') {
      return {
        ...baseEntry,
        cardPattern: 'Hearts'
      };
    } else if (resolutionType === 'COINS') {
      return {
        ...baseEntry,
        coinPattern: 'All Heads'
      };
    }

    return baseEntry;
  };

  const handleAddNew = () => {
    setEditingEntry(initializeNewEntry());
    setEditingIndex(null);
    setIsEditing(true);
  };

  const handleEdit = (entry, index) => {
    setEditingEntry({ ...entry });
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingEntry(null);
    setEditingIndex(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      onUpdateEntry(editingIndex, editingEntry);
    } else {
      onAddEntry(editingEntry);
    }
    setEditingEntry(null);
    setEditingIndex(null);
    setIsEditing(false);
  };

  const handleRemove = (index) => {
    onRemoveEntry(index);
  };

  const handleDescriptionChange = (e) => {
    setEditingEntry({
      ...editingEntry,
      effect: {
        ...editingEntry.effect,
        description: e.target.value
      }
    });
  };

  const handleVisualEffectChange = (e) => {
    setEditingEntry({
      ...editingEntry,
      effect: {
        ...editingEntry.effect,
        visualEffect: e.target.value
      }
    });
  };

  const handleCustomNameChange = (e) => {
    setEditingEntry({
      ...editingEntry,
      customName: e.target.value
    });
  };

  const handleSpellSearchChange = (e) => {
    setSpellSearchTerm(e.target.value);
  };

  const toggleSpellSelector = () => {
    setShowSpellSelector(!showSpellSelector);
  };

  const handleSelectSpell = (spell) => {
    setEditingEntry({
      ...editingEntry,
      spellReference: spell.id,
      effect: {
        ...editingEntry.effect,
        description: spell.description || editingEntry.effect.description
      },
      customName: editingEntry.customName || spell.name
    });
    setShowSpellSelector(false);
    // Show effect modifier when a spell is selected
    setShowEffectModifier(true);
  };

  const clearSelectedSpell = () => {
    setEditingEntry({
      ...editingEntry,
      spellReference: null
    });
    // Hide effect modifier when no spell is selected
    setShowEffectModifier(false);
  };

  // Effect modification handlers
  const handleEffectModificationChange = (field, value) => {
    setEffectModifications({
      ...effectModifications,
      [field]: value
    });
  };

  const toggleEffectModifier = () => {
    setShowEffectModifier(!showEffectModifier);
  };

  // Dice-specific handlers
  const handleMinRangeChange = (e) => {
    const min = parseInt(e.target.value);
    setEditingEntry({
      ...editingEntry,
      range: {
        ...editingEntry.range,
        min
      }
    });
  };

  const handleMaxRangeChange = (e) => {
    const max = parseInt(e.target.value);
    setEditingEntry({
      ...editingEntry,
      range: {
        ...editingEntry.range,
        max
      }
    });
  };

  // Card-specific handlers
  const handleCardPatternChange = (e) => {
    setEditingEntry({
      ...editingEntry,
      cardPattern: e.target.value
    });
  };

  // Coin-specific handlers
  const handleCoinPatternChange = (e) => {
    setEditingEntry({
      ...editingEntry,
      coinPattern: e.target.value
    });
  };

  const handleCoinPatternTypeChange = (type) => {
    if (type === 'general') {
      setEditingEntry({
        ...editingEntry,
        coinPattern: 'ANY'
      });
    } else {
      // Initialize with all heads for the number of coins
      const initialSequence = 'H'.repeat(resolutionConfig.coinCount || 1);
      setEditingEntry({
        ...editingEntry,
        coinPattern: `SEQUENCE_${initialSequence}`
      });
    }
  };

  const handleCoinSequenceChange = (index, value) => {
    const currentSequence = editingEntry.coinPattern.replace('SEQUENCE_', '');
    const sequenceArray = currentSequence.split('');
    sequenceArray[index] = value;
    const newSequence = sequenceArray.join('');

    setEditingEntry({
      ...editingEntry,
      coinPattern: `SEQUENCE_${newSequence}`
    });
  };

  // Render the entry editor form
  const renderEntryForm = () => {
    if (!editingEntry) return null;

    return (
      <div className="entry-editor">
        <div className="entry-editor-header">
          <h4>{editingIndex !== null ? 'Edit Entry' : 'Add New Entry'}</h4>
        </div>

        <div className="entry-editor-form">
          {/* Resolution-specific inputs */}
          {resolutionType === 'DICE' && (
            <>
              <div className="form-group">
                <label htmlFor="min-range">Minimum Roll</label>
                <input
                  id="min-range"
                  type="number"
                  min="1"
                  max={resolutionConfig.diceType === 'd100' ? 100 : parseInt(resolutionConfig.diceType.substring(1))}
                  value={editingEntry.range?.min || 1}
                  onChange={handleMinRangeChange}
                  className="wow-settings-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="max-range">Maximum Roll</label>
                <input
                  id="max-range"
                  type="number"
                  min="1"
                  max={resolutionConfig.diceType === 'd100' ? 100 : parseInt(resolutionConfig.diceType.substring(1))}
                  value={editingEntry.range?.max || 1}
                  onChange={handleMaxRangeChange}
                  className="wow-settings-input"
                />
              </div>
            </>
          )}

          {resolutionType === 'CARDS' && (
            <div className="form-group">
              <label htmlFor="card-pattern">Card Pattern</label>
              <select
                id="card-pattern"
                value={editingEntry.cardPattern}
                onChange={handleCardPatternChange}
                className="wow-settings-input"
              >
                <option value="ANY">Any Cards</option>
                <option value="PAIR">Pair</option>
                <option value="TWO_PAIR">Two Pair</option>
                <option value="THREE_KIND">Three of a Kind</option>
                <option value="STRAIGHT">Straight</option>
                <option value="FLUSH">Flush</option>
                <option value="FULL_HOUSE">Full House</option>
                <option value="FOUR_KIND">Four of a Kind</option>
                <option value="STRAIGHT_FLUSH">Straight Flush</option>
                <option value="ROYAL_FLUSH">Royal Flush</option>
                <option value="ALL_RED">All Red Cards</option>
                <option value="ALL_BLACK">All Black Cards</option>
                <option value="ALL_FACE">All Face Cards</option>
              </select>
            </div>
          )}

          {resolutionType === 'COINS' && (
            <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
              <label htmlFor="coin-pattern">Coin Pattern</label>
              <div className="coin-pattern-options">
                <div className="coin-pattern-type-selector">
                  <label className={!editingEntry.coinPattern || !editingEntry.coinPattern.includes('SEQUENCE_') ? 'active' : ''}>
                    <input
                      type="radio"
                      name="coin-pattern-type"
                      checked={!editingEntry.coinPattern || !editingEntry.coinPattern.includes('SEQUENCE_')}
                      onChange={() => handleCoinPatternTypeChange('general')}
                    />
                    General Pattern
                  </label>
                  <label className={editingEntry.coinPattern && editingEntry.coinPattern.includes('SEQUENCE_') ? 'active' : ''}>
                    <input
                      type="radio"
                      name="coin-pattern-type"
                      checked={editingEntry.coinPattern && editingEntry.coinPattern.includes('SEQUENCE_')}
                      onChange={() => handleCoinPatternTypeChange('sequence')}
                    />
                    Specific Sequence
                  </label>
                </div>

                {(!editingEntry.coinPattern || !editingEntry.coinPattern.includes('SEQUENCE_')) ? (
                  <select
                    id="coin-pattern"
                    value={editingEntry.coinPattern}
                    onChange={handleCoinPatternChange}
                    className="wow-settings-input"
                  >
                    <option value="ANY">Any Result</option>
                    <option value="ALL_HEADS">All Heads</option>
                    <option value="ALL_TAILS">All Tails</option>
                    <option value="MAJORITY_HEADS">Majority Heads</option>
                    <option value="MAJORITY_TAILS">Majority Tails</option>
                    <option value="EQUAL_SPLIT">Equal Split</option>
                    <option value="ALTERNATING">Alternating Pattern</option>
                  </select>
                ) : (
                  <div className="coin-sequence-builder">
                    <div className="coin-sequence-label">Build your sequence:</div>
                    <div className="coin-sequence-coins">
                      {resolutionConfig.coinCount > 0 && Array.from({ length: resolutionConfig.coinCount }).map((_, index) => {
                        const sequence = editingEntry.coinPattern.replace('SEQUENCE_', '');
                        const currentValue = sequence.length > index ? sequence[index] : 'H';

                        return (
                          <div key={index} className="coin-sequence-coin">
                            <div className="coin-number">{index + 1}</div>
                            <select
                              value={currentValue}
                              onChange={(e) => handleCoinSequenceChange(index, e.target.value)}
                              className="wow-settings-input"
                            >
                              <option value="H">Heads (H)</option>
                              <option value="T">Tails (T)</option>
                            </select>
                          </div>
                        );
                      })}
                    </div>
                    <div className="coin-sequence-preview">
                      Sequence: <span className="coin-sequence-value">
                        {editingEntry.coinPattern.replace('SEQUENCE_', '')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Base Spell Modification Toggle */}
          <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
            <div className="effect-modifier-header">
              <label>Effect Type</label>
            </div>
            <div className="toggle-section">
              <div className="toggle-option">
                <button
                  className={`toggle-button ${editingEntry.modifiesBaseSpell ? 'active' : ''}`}
                  onClick={() => setEditingEntry({...editingEntry, modifiesBaseSpell: true})}
                >
                  <div className="toggle-icon">
                    {editingEntry.modifiesBaseSpell ? '✓' : ''}
                  </div>
                  <span>Modify Base Spell</span>
                </button>
              </div>
              <div className="toggle-option">
                <button
                  className={`toggle-button ${!editingEntry.modifiesBaseSpell ? 'active' : ''}`}
                  onClick={() => setEditingEntry({...editingEntry, modifiesBaseSpell: false})}
                >
                  <div className="toggle-icon">
                    {!editingEntry.modifiesBaseSpell ? '✓' : ''}
                  </div>
                  <span>Use External Spell</span>
                </button>
              </div>
            </div>
          </div>

          {/* Spell Reference Selector - Only show if not modifying base spell */}
          {!editingEntry.modifiesBaseSpell && (
            <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
              <label>Spell Reference</label>
              <div className="spell-reference-selector">
                {editingEntry.spellReference ? (
                  <div className="selected-spell">
                    <div className="selected-spell-info">
                      <span className="selected-spell-name">
                        {library.spells.find(s => s.id === editingEntry.spellReference)?.name || 'Unknown Spell'}
                      </span>
                      <button
                        className="clear-spell-button"
                        onClick={clearSelectedSpell}
                        title="Clear selected spell"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="select-spell-button"
                    onClick={toggleSpellSelector}
                  >
                    <FaSearch /> Select a spell from library
                  </button>
                )}
              </div>

              {showSpellSelector && (
                <div className="spell-selector-popup">
                  <div className="spell-selector-header">
                    <input
                      type="text"
                      placeholder="Search spells..."
                      value={spellSearchTerm}
                      onChange={handleSpellSearchChange}
                      className="wow-settings-input"
                    />
                    <button
                      className="close-selector-button"
                      onClick={toggleSpellSelector}
                    >
                      ×
                    </button>
                  </div>
                  <div className="spell-list">
                    {library.spells
                      .filter(spell =>
                        spell.name.toLowerCase().includes(spellSearchTerm.toLowerCase()) ||
                        (spell.description && spell.description.toLowerCase().includes(spellSearchTerm.toLowerCase()))
                      )
                      .map(spell => (
                        <div
                          key={spell.id}
                          className="spell-list-item"
                          onClick={() => handleSelectSpell(spell)}
                        >
                          <div className="spell-list-item-name">{spell.name}</div>
                          <div className="spell-list-item-description">
                            {spell.description ? `${spell.description.substring(0, 60)}${spell.description.length > 60 ? '...' : ''}` : ''}
                          </div>
                        </div>
                      ))
                    }
                    {library.spells.filter(spell =>
                      spell.name.toLowerCase().includes(spellSearchTerm.toLowerCase()) ||
                      (spell.description && spell.description.toLowerCase().includes(spellSearchTerm.toLowerCase()))
                    ).length === 0 && (
                      <div className="no-spells-found">No spells found matching your search.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Custom Name */}
          <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
            <label htmlFor="custom-name">Custom Name (optional)</label>
            <input
              id="custom-name"
              type="text"
              value={editingEntry.customName}
              onChange={handleCustomNameChange}
              className="wow-settings-input"
              placeholder="Custom name for this table entry"
            />
          </div>

          {/* Formula Modifications */}
          {editingEntry.modifiesBaseSpell && (
            <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
              <div className="effect-modifier-header">
                <label>Formula Modifications</label>
              </div>

              <div className="formula-modifier-container">
                {/* Damage Formula Modifier */}
                {wizardState.damageConfig && (
                  <FormulaModifierSection
                    formulaType="damage"
                    originalFormula={wizardState.damageConfig.formula || '1d6 + INT'}
                    currentOverride={editingEntry.formulaOverrides?.damage || ''}
                    onFormulaChange={(formula) => setEditingEntry({
                      ...editingEntry,
                      formulaOverrides: {
                        ...editingEntry.formulaOverrides,
                        damage: formula
                      }
                    })}
                  />
                )}

                {/* Healing Formula Modifier */}
                {wizardState.healingConfig && (
                  <FormulaModifierSection
                    formulaType="healing"
                    originalFormula={wizardState.healingConfig.formula || '1d8 + HEA'}
                    currentOverride={editingEntry.formulaOverrides?.healing || ''}
                    onFormulaChange={(formula) => setEditingEntry({
                      ...editingEntry,
                      formulaOverrides: {
                        ...editingEntry.formulaOverrides,
                        healing: formula
                      }
                    })}
                  />
                )}

                {/* Range Modifier */}
                <FormulaModifierSection
                  formulaType="range"
                  originalFormula={`${wizardState.range || 30}ft`}
                  currentOverride={editingEntry.formulaOverrides?.range || ''}
                  onFormulaChange={(formula) => setEditingEntry({
                    ...editingEntry,
                    formulaOverrides: {
                      ...editingEntry.formulaOverrides,
                      range: formula
                    }
                  })}
                />

                {/* Duration Modifier */}
                <FormulaModifierSection
                  formulaType="duration"
                  originalFormula={wizardState.duration ? `${wizardState.duration} ${wizardState.durationUnit || 'rounds'}` : '1 round'}
                  currentOverride={editingEntry.formulaOverrides?.duration || ''}
                  onFormulaChange={(formula) => setEditingEntry({
                    ...editingEntry,
                    formulaOverrides: {
                      ...editingEntry.formulaOverrides,
                      duration: formula
                    }
                  })}
                />

                {/* Targets Modifier */}
                <FormulaModifierSection
                  formulaType="targets"
                  originalFormula={wizardState.targetCount ? `${wizardState.targetCount} targets` : '1 target'}
                  currentOverride={editingEntry.formulaOverrides?.targets || ''}
                  onFormulaChange={(formula) => setEditingEntry({
                    ...editingEntry,
                    formulaOverrides: {
                      ...editingEntry.formulaOverrides,
                      targets: formula
                    }
                  })}
                />

                <div className="formula-modifier-section">
                  <div className="formula-modifier-row">
                    <label>Saving Throw Modifications</label>
                    <div className="formula-modifier-checkbox-group">
                      <div className="formula-modifier-checkbox">
                        <input
                          id="saving-throw-advantage"
                          type="checkbox"
                          checked={editingEntry.savingThrowModifications?.advantage || false}
                          onChange={(e) => setEditingEntry({
                            ...editingEntry,
                            savingThrowModifications: {
                              ...editingEntry.savingThrowModifications,
                              advantage: e.target.checked
                            }
                          })}
                        />
                        <label htmlFor="saving-throw-advantage">Grant advantage</label>
                      </div>

                      <div className="formula-modifier-checkbox">
                        <input
                          id="saving-throw-disadvantage"
                          type="checkbox"
                          checked={editingEntry.savingThrowModifications?.disadvantage || false}
                          onChange={(e) => setEditingEntry({
                            ...editingEntry,
                            savingThrowModifications: {
                              ...editingEntry.savingThrowModifications,
                              disadvantage: e.target.checked
                            }
                          })}
                        />
                        <label htmlFor="saving-throw-disadvantage">Impose disadvantage</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Common effect inputs */}
          <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
            <label htmlFor="effect-description">Effect Description</label>
            <textarea
              id="effect-description"
              value={editingEntry.effect.description}
              onChange={handleDescriptionChange}
              className="wow-settings-input"
              rows={3}
              placeholder="Describe the effect that occurs when this result is rolled/drawn/flipped"
            />
          </div>

          <div className="form-group">
            <label htmlFor="visual-effect">Visual Effect (optional)</label>
            <input
              id="visual-effect"
              type="text"
              value={editingEntry.effect.visualEffect}
              onChange={handleVisualEffectChange}
              className="wow-settings-input"
              placeholder="e.g., blue-glow, explosion, etc."
            />
          </div>
        </div>

        <div className="entry-editor-buttons">
          <button className="entry-editor-button" onClick={handleCancel}>
            <span>Cancel</span>
          </button>
          <button className="entry-editor-button primary" onClick={handleSave}>
            <span>{editingIndex !== null ? 'Update' : 'Add'} Entry</span>
          </button>
        </div>
      </div>
    );
  };

  // Render the entries table
  const renderEntriesTable = () => {
    if (entries.length === 0) {
      return (
        <div className="empty-table-message">
          No entries yet. Click "Add Entry" to create your first table entry.
        </div>
      );
    }

    return (
      <table className="rollable-table">
        <thead>
          <tr>
            {resolutionType === 'DICE' && <th>Roll Range</th>}
            {resolutionType === 'CARDS' && <th>Card Pattern</th>}
            {resolutionType === 'COINS' && <th>Coin Pattern</th>}
            <th>Name</th>
            <th>Effect Type</th>
            <th>Effect</th>
            <th>Modifications</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            // Get modification summary
            const mods = entry.effectModifications || {};
            const formulaOverrides = entry.formulaOverrides || {};

            // Check if there are any formula overrides
            const hasFormulaOverrides =
              formulaOverrides.damage ||
              formulaOverrides.healing ||
              formulaOverrides.range ||
              formulaOverrides.duration ||
              formulaOverrides.targets;

            // Check if there are any effect modifications
            const hasEffectModifications =
              mods.damageMultiplier !== 1 ||
              mods.healingMultiplier !== 1 ||
              mods.rangeMultiplier !== 1 ||
              mods.durationMultiplier !== 1 ||
              mods.additionalTargets !== 0 ||
              mods.resourceCostModifier !== 0 ||
              mods.savingThrowAdvantage ||
              mods.savingThrowDisadvantage;

            const hasModifications = hasFormulaOverrides || hasEffectModifications;

            // Create a summary of modifications
            const modSummary = [];

            // Add formula overrides to the summary
            if (formulaOverrides.damage) modSummary.push(`Dmg: ${formulaOverrides.damage}`);
            if (formulaOverrides.healing) modSummary.push(`Heal: ${formulaOverrides.healing}`);
            if (formulaOverrides.range) modSummary.push(`Range: ${formulaOverrides.range}`);
            if (formulaOverrides.duration) modSummary.push(`Duration: ${formulaOverrides.duration}`);
            if (formulaOverrides.targets) modSummary.push(`Targets: ${formulaOverrides.targets}`);

            // Add effect modifications to the summary
            if (mods.damageMultiplier !== 1) modSummary.push(`Dmg ×${mods.damageMultiplier}`);
            if (mods.healingMultiplier !== 1) modSummary.push(`Heal ×${mods.healingMultiplier}`);
            if (mods.rangeMultiplier !== 1) modSummary.push(`Range ×${mods.rangeMultiplier}`);
            if (mods.durationMultiplier !== 1) modSummary.push(`Duration ×${mods.durationMultiplier}`);
            if (mods.additionalTargets !== 0) modSummary.push(`+${mods.additionalTargets} targets`);
            if (mods.resourceCostModifier !== 0) {
              const prefix = mods.resourceCostModifier > 0 ? '+' : '';
              modSummary.push(`${prefix}${mods.resourceCostModifier} cost`);
            }
            if (mods.savingThrowAdvantage) modSummary.push('Save Adv');
            if (mods.savingThrowDisadvantage) modSummary.push('Save Disadv');

            return (
              <tr key={entry.id}>
                {resolutionType === 'DICE' && (
                  <td>
                    {entry.range?.min === entry.range?.max
                      ? entry.range?.min
                      : `${entry.range?.min || 1}-${entry.range?.max || 1}`}
                  </td>
                )}
                {resolutionType === 'CARDS' && <td>{entry.cardPattern}</td>}
                {resolutionType === 'COINS' && <td>{entry.coinPattern}</td>}
                <td>{entry.customName || (entry.spellReference ? library.spells.find(s => s.id === entry.spellReference)?.name : 'Effect')}</td>
                <td>
                  {entry.modifiesBaseSpell ? (
                    <span className="spell-modifier">
                      Base Spell Modifier
                    </span>
                  ) : entry.spellReference ? (
                    <span className="spell-reference">
                      {library.spells.find(s => s.id === entry.spellReference)?.name || 'External Spell'}
                    </span>
                  ) : (
                    <span className="no-spell-reference">Custom Effect</span>
                  )}
                </td>
                <td>{entry.effect.description}</td>
                <td className="effect-modifications">
                  {hasModifications ? (
                    <div className="modification-tags">
                      {modSummary.map((mod, i) => {
                        let className = "mod-tag";
                        if (mod.includes('Adv')) className += " advantage";
                        if (mod.includes('Disadv')) className += " disadvantage";
                        return <span key={i} className={className}>{mod}</span>;
                      })}
                    </div>
                  ) : (
                    <span className="no-modifications">None</span>
                  )}
                </td>
                <td className="action-buttons">
                  <button
                    className="action-button"
                    onClick={() => handleEdit(entry, index)}
                  >
                    <span>Edit</span>
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleRemove(index)}
                  >
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="table-entry-editor">
      {isEditing ? (
        renderEntryForm()
      ) : (
        <>
          <div className="table-actions">
            <button className="entry-editor-button primary" onClick={handleAddNew}>
              <span>+ Add New Entry</span>
            </button>
          </div>
          <div className="table-entries">
            {renderEntriesTable()}
          </div>
        </>
      )}
    </div>
  );
};

export default TableEntryEditor;
