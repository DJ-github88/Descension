import { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import useCharacterStore from '../store/characterStore';

export default function GameProvider({ children }) {
  useEffect(() => {
    // Initialize the game store if it's empty
    const gameState = useGameStore.getState();
    if (gameState.creatures.length === 0) {
      gameState.initializeStore();
    }

    // Initialize character system with complete health check
    const initializeCharacterSystem = async () => {
      try {
        const { initializeCharacterSystem } = useCharacterStore.getState();
        const result = await initializeCharacterSystem();

        if (result.isReady) {
          console.log(`🎮 Character system ready: ${result.activeCharacter.name}`);
        } else {
          console.log(`⚠️ Character system needs attention: ${result.charactersCount} characters available`);
        }
      } catch (error) {
        console.error('❌ Error initializing character system:', error);
      }
    };

    initializeCharacterSystem();
  }, []);

  return children;
}
