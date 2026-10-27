import { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import useCharacterStore from '../store/characterStore';
import { subscribeBootstrapGate } from '../persistence/bootstrapPrivacyGate';

export default function GameProvider({ children }) {
  useEffect(() => {
    // Initialize the game store if it's empty
    const gameState = useGameStore.getState();
    if (gameState.creatures.length === 0) {
      gameState.initializeStore();
    }

    // Initialize character system with complete health check. On a cold load
    // the private scope may not be active yet; retry when auth delivers it
    // instead of treating "not loaded" as "no characters".
    let ready = false;
    let stopped = false;

    const initializeCharacterSystem = async () => {
      if (stopped || ready) return;
      try {
        const { initializeCharacterSystem } = useCharacterStore.getState();
        const result = await initializeCharacterSystem();
        if (result.isReady) {
          ready = true;
          console.log(`🎮 Character system ready: ${result.activeCharacter.name}`);
        } else {
          console.log(`⚠️ Character system needs attention: ${result.charactersCount} characters available`);
        }
      } catch (error) {
        console.error('❌ Error initializing character system:', error);
      }
    };

    initializeCharacterSystem();
    const unsubscribe = subscribeBootstrapGate((state) => {
      if (state.scope) initializeCharacterSystem();
    });

    return () => {
      stopped = true;
      unsubscribe();
    };
  }, []);

  return children;
}
