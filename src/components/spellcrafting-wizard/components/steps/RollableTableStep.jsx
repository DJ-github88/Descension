import React, { useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import { RESOLUTION_TYPES } from '../../core/mechanics/resolutionMechanics';
import ResolutionTypeSelector from '../mechanics/ResolutionTypeSelector';
import TableEntryEditor from '../mechanics/TableEntryEditor';
import TablePreview from '../mechanics/TablePreview';
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

  // Convert entries to match the new resolution type
  const convertEntriesToResolutionType = (entries, newType, config = {}) => {
    if (!entries || entries.length === 0) return entries;

    return entries.map((entry, index) => {
      let newRange;

      switch (newType) {
        case 'DICE':
          // Convert to dice ranges (distribute evenly across d100)
          const rangeSize = Math.floor(100 / entries.length);
          const min = (index * rangeSize) + 1;
          const max = index === entries.length - 1 ? 100 : (index + 1) * rangeSize;
          return {
            ...entry,
            range: { min, max },
            cardPattern: null,
            coinPattern: null
          };

        case 'CARDS':
          // Convert to card patterns
          const cardPatterns = [
            'Hearts', 'Diamonds', 'Clubs', 'Spades',
            'Red Cards', 'Black Cards', 'Face Cards', 'Number Cards',
            'Aces', 'Kings', 'Queens', 'Jacks'
          ];
          const cardPattern = cardPatterns[index % cardPatterns.length] || `Pattern ${index + 1}`;
          return {
            ...entry,
            range: null,
            cardPattern: cardPattern
          };

        case 'COINS':
          // Convert to coin patterns
          const coinPatterns = [
            'All Heads', 'All Tails', 'Mostly Heads', 'Mostly Tails',
            'Mixed', 'Alternating', 'Two Heads', 'Two Tails',
            'Three Heads', 'Three Tails'
          ];
          const coinPattern = coinPatterns[index % coinPatterns.length] || `Pattern ${index + 1}`;
          return {
            ...entry,
            range: null,
            coinPattern: coinPattern
          };

        default:
          return entry;
      }
    });
  };

  const handleResolutionTypeChange = (type) => {
    const convertedEntries = convertEntriesToResolutionType(
      rollableTable.entries,
      type,
      rollableTable.resolutionConfig
    );

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

    // If card count or coin count changed, we might need to update entries
    let updatedEntries = rollableTable.entries;
    if ((config.cardCount || config.coinCount) && rollableTable.entries && rollableTable.entries.length > 0) {
      updatedEntries = convertEntriesToResolutionType(
        rollableTable.entries,
        rollableTable.resolutionType,
        newConfig
      );
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

          <div className="table-preview-section">
            <h3>Table Preview</h3>
            <TablePreview
              table={rollableTable}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RollableTableStep;
