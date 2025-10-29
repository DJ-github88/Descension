import React, { useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import { RESOLUTION_TYPES } from '../../core/mechanics/resolutionMechanics';
import ResolutionTypeSelector from '../mechanics/ResolutionTypeSelector';
import TableEntryEditor from '../mechanics/TableEntryEditor';
import '../../styles/RollableTableStepWoW.css';

const RollableTableStep = () => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const { rollableTable } = state;

  // Initialize rollable table if not already set
  useEffect(() => {
    if (!rollableTable) {
      dispatch(actionCreators.updateRollableTable({
        enabled: false,
        name: '',
        description: '',
        resolutionType: 'DICE',
        resolutionConfig: {
          diceType: 'd100',
          cardCount: 3,
          coinCount: 5,
        },
        entries: []
      }));
    }
  }, [rollableTable, dispatch]);

  // Skip if not initialized yet
  if (!rollableTable) return <div className="loading">Loading...</div>;

  const handleToggleEnabled = () => {
    const newEnabled = !rollableTable.enabled;

    // If enabling and no entries exist, add some sample entries for testing
    const updatedTable = {
      ...rollableTable,
      enabled: newEnabled
    };

    if (newEnabled && (!rollableTable.entries || rollableTable.entries.length === 0)) {
      updatedTable.name = 'Random Effects';
      updatedTable.description = 'Roll for random magical effects';
      updatedTable.entries = [
        {
          id: 'sample-1',
          range: { min: 1, max: 25 },
          customName: 'Minor Healing',
          effect: 'Heals 1d4 hit points',
          modifiesBaseSpell: false,
          spellReference: null,
          effectModifications: {},
          formulaOverrides: {}
        },
        {
          id: 'sample-2',
          range: { min: 26, max: 50 },
          customName: 'Spark Damage',
          effect: 'Deals 1d6 lightning damage',
          modifiesBaseSpell: false,
          spellReference: null,
          effectModifications: {},
          formulaOverrides: {}
        },
        {
          id: 'sample-3',
          range: { min: 51, max: 75 },
          customName: 'Speed Boost',
          effect: 'Increases movement speed by 10 feet for 1 round',
          modifiesBaseSpell: false,
          spellReference: null,
          effectModifications: {},
          formulaOverrides: {}
        },
        {
          id: 'sample-4',
          range: { min: 76, max: 100 },
          customName: 'Magic Resistance',
          effect: 'Grants advantage on next saving throw',
          modifiesBaseSpell: false,
          spellReference: null,
          effectModifications: {},
          formulaOverrides: {}
        }
      ];
    }

    dispatch(actionCreators.updateRollableTable(updatedTable));
  };

  const handleNameChange = (e) => {
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      name: e.target.value
    }));
  };

  const handleDescriptionChange = (e) => {
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      description: e.target.value
    }));
  };

  // Generate placeholder entries when resolution type is first selected
  const generatePlaceholderEntries = (resolutionType, config) => {
    const placeholders = [];

    switch (resolutionType) {
      case 'DICE':
        const diceType = config.diceType || 'd100';
        const maxValue = parseInt(diceType.substring(1));
        const exampleCount = Math.min(6, maxValue); // Generate up to 6 examples
        const rangeSize = Math.floor(maxValue / exampleCount);

        for (let i = 0; i < exampleCount; i++) {
          const min = (i * rangeSize) + 1;
          const max = i === exampleCount - 1 ? maxValue : (i + 1) * rangeSize;
          placeholders.push({
            id: `placeholder-${i}`,
            range: { min, max },
            name: `Example Effect ${i + 1}`,
            description: `Placeholder effect for range ${min}-${max}`,
            effectType: 'damage',
            effectConfig: {
              damageFormula: '2d6',
              damageType: 'fire',
              healingFormula: '2d8',
              creatureType: '',
              quantity: 1,
              buffType: '',
              duration: 3
            }
          });
        }
        break;

      case 'CARDS':
        const cardExamples = [
          { pattern: 'Hearts', name: 'Hearts Effect', desc: 'Effect when drawing Hearts' },
          { pattern: 'Diamonds', name: 'Diamonds Effect', desc: 'Effect when drawing Diamonds' },
          { pattern: 'Clubs', name: 'Clubs Effect', desc: 'Effect when drawing Clubs' },
          { pattern: 'Spades', name: 'Spades Effect', desc: 'Effect when drawing Spades' },
          { pattern: 'Red Cards', name: 'Red Cards Effect', desc: 'Effect when drawing Red Cards' },
          { pattern: 'Black Cards', name: 'Black Cards Effect', desc: 'Effect when drawing Black Cards' },
          { pattern: 'Face Cards', name: 'Face Cards Effect', desc: 'Effect when drawing Face Cards' },
          { pattern: 'Aces', name: 'Aces Effect', desc: 'Effect when drawing Aces' }
        ];

        cardExamples.forEach((example, i) => {
          placeholders.push({
            id: `placeholder-${i}`,
            cardPattern: example.pattern,
            name: example.name,
            description: example.desc,
            effectType: 'damage',
            effectConfig: {
              damageFormula: '2d6',
              damageType: 'fire',
              healingFormula: '2d8',
              creatureType: '',
              quantity: 1,
              buffType: '',
              duration: 3
            }
          });
        });
        break;

      case 'COINS':
        const coinExamples = [
          { pattern: 'All Heads', name: 'All Heads Effect', desc: 'Effect when all coins are heads' },
          { pattern: 'All Tails', name: 'All Tails Effect', desc: 'Effect when all coins are tails' },
          { pattern: 'Majority Heads (3+)', name: 'Majority Heads Effect', desc: 'Effect when majority are heads' },
          { pattern: 'Majority Tails (3+)', name: 'Majority Tails Effect', desc: 'Effect when majority are tails' },
          { pattern: 'Exactly 2 Heads', name: 'Two Heads Effect', desc: 'Effect when exactly 2 heads' },
          { pattern: 'Exactly 2 Tails', name: 'Two Tails Effect', desc: 'Effect when exactly 2 tails' },
          { pattern: 'Alternating Pattern (H-T-H-T)', name: 'Alternating Effect', desc: 'Effect for alternating pattern' },
          { pattern: 'Mixed (No Pattern)', name: 'Mixed Effect', desc: 'Effect for mixed results' }
        ];

        coinExamples.forEach((example, i) => {
          placeholders.push({
            id: `placeholder-${i}`,
            coinPattern: example.pattern,
            name: example.name,
            description: example.desc,
            effectType: 'damage',
            effectConfig: {
              damageFormula: '2d6',
              damageType: 'fire',
              healingFormula: '2d8',
              creatureType: '',
              quantity: 1,
              buffType: '',
              duration: 3
            }
          });
        });
        break;

      default:
        break;
    }

    return placeholders;
  };

  // Convert entries to match the new resolution type
  const convertEntriesToResolutionType = (entries, newType, config = {}) => {
    if (!entries || entries.length === 0) return entries;

    return entries.map((entry, index) => {
      // Preserve all entry data including effectConfig
      const baseEntry = {
        ...entry,
        // Ensure effectConfig exists
        effectConfig: entry.effectConfig || {
          damageFormula: '2d6',
          damageType: 'fire',
          healingFormula: '2d8',
          creatureType: '',
          quantity: 1,
          buffType: '',
          duration: 3
        }
      };

      switch (newType) {
        case 'DICE':
          // Convert to dice ranges (distribute evenly across d100)
          const rangeSize = Math.floor(100 / entries.length);
          const min = (index * rangeSize) + 1;
          const max = index === entries.length - 1 ? 100 : (index + 1) * rangeSize;
          return {
            ...baseEntry,
            range: { min, max },
            cardPattern: undefined,
            coinPattern: undefined
          };

        case 'CARDS':
          // Convert to card patterns - expanded options
          const cardPatterns = [
            'Hearts', 'Diamonds', 'Clubs', 'Spades',
            'Red Cards', 'Black Cards', 'Face Cards', 'Number Cards',
            'Aces', 'Kings', 'Queens', 'Jacks',
            'Ace of Spades', 'Ace of Hearts', 'Ace of Diamonds', 'Ace of Clubs',
            'King of Spades', 'King of Hearts', 'King of Diamonds', 'King of Clubs',
            'Queen of Spades', 'Queen of Hearts', 'Queen of Diamonds', 'Queen of Clubs',
            'Jack of Spades', 'Jack of Hearts', 'Jack of Diamonds', 'Jack of Clubs',
            'Red Face Cards', 'Black Face Cards', 'Odd Numbers', 'Even Numbers',
            '2-5 (Low)', '6-9 (Mid)', '10-K (High)', 'Joker'
          ];
          const cardPattern = cardPatterns[index % cardPatterns.length] || `Pattern ${index + 1}`;
          return {
            ...baseEntry,
            range: undefined,
            cardPattern: cardPattern,
            coinPattern: undefined
          };

        case 'COINS':
          // Convert to coin patterns - clearer wording for sequences and majorities
          const coinPatterns = [
            'All Heads', 'All Tails',
            'Majority Heads (3+)', 'Majority Tails (3+)',
            'Exactly 2 Heads', 'Exactly 2 Tails',
            'Exactly 3 Heads', 'Exactly 3 Tails',
            'Exactly 4 Heads', 'Exactly 4 Tails',
            'Alternating Pattern (H-T-H-T)', 'Alternating Pattern (T-H-T-H)',
            'Sequence: H-H-T', 'Sequence: T-T-H',
            'Sequence: H-T-T', 'Sequence: T-H-H',
            'Mixed (No Pattern)', 'Any Single Heads', 'Any Single Tails'
          ];
          const coinPattern = coinPatterns[index % coinPatterns.length] || `Pattern ${index + 1}`;
          return {
            ...baseEntry,
            range: undefined,
            cardPattern: undefined,
            coinPattern: coinPattern
          };

        default:
          return baseEntry;
      }
    });
  };

  const handleResolutionTypeChange = (type) => {
    let convertedEntries = convertEntriesToResolutionType(
      rollableTable.entries,
      type,
      rollableTable.resolutionConfig
    );

    // Auto-populate placeholder examples if no entries exist
    if (!convertedEntries || convertedEntries.length === 0) {
      convertedEntries = generatePlaceholderEntries(type, rollableTable.resolutionConfig);
    }

    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      resolutionType: type,
      entries: convertedEntries
    }));
  };

  const handleResolutionConfigChange = (config) => {
    const newConfig = {
      ...rollableTable.resolutionConfig,
      ...config
    };

    // If dice type, card count, or coin count changed, update entries
    let updatedEntries = rollableTable.entries;

    // If dice type changed and we have entries, regenerate ranges
    if (config.diceType && rollableTable.entries && rollableTable.entries.length > 0) {
      updatedEntries = convertEntriesToResolutionType(
        rollableTable.entries,
        rollableTable.resolutionType,
        newConfig
      );
    }
    // If card count or coin count changed, update entries
    else if ((config.cardCount || config.coinCount) && rollableTable.entries && rollableTable.entries.length > 0) {
      updatedEntries = convertEntriesToResolutionType(
        rollableTable.entries,
        rollableTable.resolutionType,
        newConfig
      );
    }
    // If dice type changed and no entries exist, auto-populate
    else if (config.diceType && (!rollableTable.entries || rollableTable.entries.length === 0)) {
      updatedEntries = generatePlaceholderEntries(rollableTable.resolutionType, newConfig);
    }

    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      resolutionConfig: newConfig,
      entries: updatedEntries
    }));
  };

  const handleAddEntry = (entry) => {
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      entries: [...rollableTable.entries, entry]
    }));
  };

  const handleUpdateEntry = (index, entry) => {
    const updatedEntries = [...rollableTable.entries];
    updatedEntries[index] = entry;
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      entries: updatedEntries
    }));
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = [...rollableTable.entries];
    updatedEntries.splice(index, 1);
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      entries: updatedEntries
    }));
  };

  return (
    <div className="rollable-table-step wow-window-content">
      <div className="step-header">
        <h2>Rollable Table Configuration</h2>
        <p className="step-description">
          Create a table of random effects that can be triggered when the spell is cast.
          These can be resolved using dice rolls, card draws, or coin flips.
        </p>
      </div>

      <div className="toggle-section">
        <div className="toggle-option">
          <button
            className={`toggle-button ${rollableTable.enabled ? 'active' : ''}`}
            onClick={handleToggleEnabled}
          >
            <div className="toggle-icon">
              {rollableTable.enabled ? '✓' : ''}
            </div>
            <span>Enable Rollable Table</span>
          </button>
        </div>
      </div>

      {rollableTable.enabled && (
        <>
          <div className="table-config-section">
            <div className="form-group">
              <label htmlFor="table-name">Table Name</label>
              <input
                id="table-name"
                type="text"
                value={rollableTable.name}
                onChange={handleNameChange}
                placeholder="e.g., Wild Magic Surge"
                className="wow-settings-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="table-description">Description</label>
              <textarea
                id="table-description"
                value={rollableTable.description}
                onChange={handleDescriptionChange}
                placeholder="Describe what this table represents..."
                className="wow-settings-input"
                rows={3}
              />
            </div>
          </div>

          <div className="resolution-section">
            <h3>Resolution Method</h3>
            <ResolutionTypeSelector
              selectedType={rollableTable.resolutionType}
              onTypeChange={handleResolutionTypeChange}
              config={rollableTable.resolutionConfig}
              onConfigChange={handleResolutionConfigChange}
            />
          </div>

          <div className="table-entries-section">
            <h3>Table Entries</h3>
            <TableEntryEditor
              entries={rollableTable.entries}
              resolutionType={rollableTable.resolutionType}
              resolutionConfig={rollableTable.resolutionConfig}
              onAddEntry={handleAddEntry}
              onUpdateEntry={handleUpdateEntry}
              onRemoveEntry={handleRemoveEntry}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RollableTableStep;
