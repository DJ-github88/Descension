import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../context/spellWizardContext';
import { RESOLUTION_TYPES } from '../core/mechanics/resolutionMechanics';
import ResolutionTypeSelector from '../components/mechanics/ResolutionTypeSelector';
import TableEntryEditor from '../components/mechanics/TableEntryEditor';
import TablePreview from '../components/mechanics/TablePreview';
import '../styles/RollableTableStep.css';

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
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      enabled: !rollableTable.enabled
    }));
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

  const handleResolutionTypeChange = (type) => {
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      resolutionType: type
    }));
  };

  const handleResolutionConfigChange = (config) => {
    dispatch(actionCreators.updateRollableTable({
      ...rollableTable,
      resolutionConfig: {
        ...rollableTable.resolutionConfig,
        ...config
      }
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
