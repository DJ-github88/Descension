import React from 'react';

const CreatureWizardApp = ({ editMode, creatureId, onSave, onCancel }) => {
  return (
    <div className="creature-wizard-app">
      <h2>Creature Wizard</h2>
      <p>Edit Mode: {editMode ? 'Yes' : 'No'}</p>
      <p>Creature ID: {creatureId || 'New'}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={onSave} style={{ marginRight: '10px' }}>
          Save
        </button>
        <button onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreatureWizardApp;
