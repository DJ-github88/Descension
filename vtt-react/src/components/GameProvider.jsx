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

        // Initialize character system - load active character if available
        const initializeCharacterSystem = async () => {
            try {
                const { loadActiveCharacter } = useCharacterStore.getState();
                await loadActiveCharacter();
            } catch (error) {
                console.error('Error initializing character system:', error);
            }
        };

        initializeCharacterSystem();
    }, []);

    return children;
}
