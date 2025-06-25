import { useEffect } from 'react';
import useGameStore from '../store/gameStore';

export default function GameProvider({ children }) {
    useEffect(() => {
        // Initialize the store if it's empty
        const state = useGameStore.getState();
        if (state.creatures.length === 0) {
            state.initializeStore();
        }
    }, []);

    return children;
}
