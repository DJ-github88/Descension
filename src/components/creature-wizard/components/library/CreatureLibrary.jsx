import React from 'react';

const CreatureLibrary = ({ onEdit }) => {
  return (
    <div className="creature-library">
      <h2>Creature Library</h2>
      <p>This is a test creature library component.</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => onEdit && onEdit('test-creature-1')}>
          Create New Creature
        </button>
      </div>
    </div>
  );
};

export default CreatureLibrary;
