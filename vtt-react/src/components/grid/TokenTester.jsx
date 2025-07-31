import React, { useEffect } from 'react';
import useCreatureStore from '../../store/creatureStore';
import { CREATURE_TYPES, CREATURE_SIZES } from '../../store/creatureStore';

const TokenTester = () => {
  const { creatures, tokens, addToken, addCreature } = useCreatureStore();

  // Add a test creature if none exist
  useEffect(() => {
    if (creatures.length === 0) {
      console.log('No creatures found, adding test creature for tooltip testing...');
      const testCreature = {
        id: 'test-goblin-tooltip',
        name: 'Test Goblin',
        description: 'A test goblin for tooltip testing',
        type: CREATURE_TYPES.HUMANOID,
        size: CREATURE_SIZES.SMALL,
        tags: ['goblin', 'test'],
        tokenIcon: 'inv_misc_head_orc_01',
        tokenBorder: '#4CAF50',
        stats: {
          strength: 8,
          agility: 14,
          constitution: 10,
          intelligence: 8,
          spirit: 8,
          charisma: 8,
          maxHp: 35,
          currentHp: 25, // Partially damaged for testing
          maxMana: 20,
          currentMana: 15, // Partially used for testing
          maxActionPoints: 4,
          currentActionPoints: 2, // Partially used for testing
          armor: 13,
          initiative: 2,
          speed: 30,
          flying: 0,
          swimming: 15,
          sightRange: 60,
          darkvision: 60
        },
        abilities: []
      };

      addCreature(testCreature);
      console.log('Added test creature:', testCreature);
    }
  }, [creatures.length, addCreature]);

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

  const handleAddTestToken = () => {
    // Add a test token at a fixed position for easy testing
    if (creatures.length > 0) {
      const testCreature = creatures[0]; // Use the first creature
      addToken(testCreature.id, { x: 300, y: 200 });
      console.log('Added test token for tooltip testing at position (300, 200)');
    }
  };

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleAddTestToken}
          style={{
            padding: '8px 16px',
            backgroundColor: '#FF5722',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          Add Test Token (for Tooltip)
        </button>
        <button
          onClick={handleAddRandomToken}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          Add Random Token
        </button>
      </div>
      <div style={{ marginTop: '10px', color: 'white', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '4px', borderRadius: '4px' }}>
        Creatures: {creatures.length}<br/>
        Tokens: {tokens.length}
      </div>
    </div>
  );
};

export default TokenTester;
