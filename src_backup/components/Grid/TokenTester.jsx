import React from 'react';
import useCreatureStore from '../../../vtt-react/src/store/creatureStore';

const TokenTester = () => {
  const { creatures, tokens, addToken, removeToken } = useCreatureStore();

  const handleAddRandomToken = () => {
    console.log('Current creatures in store:', creatures);

    if (creatures.length === 0) {
      console.error('No creatures available to add as tokens');
      return;
    }

    // Get a random creature
    const randomIndex = Math.floor(Math.random() * creatures.length);
    const randomCreature = creatures[randomIndex];

    // Generate a random position on the grid
    const randomX = Math.floor(Math.random() * 800) + 100; // Between 100 and 900
    const randomY = Math.floor(Math.random() * 600) + 100; // Between 100 and 700

    console.log('Adding random token for creature:', randomCreature.id, 'at position:', { x: randomX, y: randomY });

    // Add the token
    addToken(randomCreature.id, { x: randomX, y: randomY });

    // Debug: Check if token was added
    setTimeout(() => {
      const currentTokens = useCreatureStore.getState().tokens;
      console.log('Current tokens after adding random token:', currentTokens);
      const addedToken = currentTokens.find(token => token.creatureId === randomCreature.id);
      if (addedToken) {
        console.log('Successfully added random token:', addedToken);
      } else {
        console.error('Failed to add random token. Token not found in tokens array.');
      }
    }, 100);
  };

  const handleClearTokens = () => {
    // Remove all tokens
    tokens.forEach(token => {
      removeToken(token.id);
    });
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '10px',
      borderRadius: '5px',
      color: 'white'
    }}>
      <h3>Token Tester</h3>
      <div>
        <button
          onClick={handleAddRandomToken}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          Add Random Token
        </button>
        <button
          onClick={handleClearTokens}
          style={{
            backgroundColor: '#F44336',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear All Tokens
        </button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <p>Creatures: {creatures.length}</p>
        <p>Tokens: {tokens.length}</p>
      </div>
    </div>
  );
};

export default TokenTester;
