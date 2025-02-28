import React from 'react';
import Token from './Token';
import useGameStore from '../store/gameStore';

export default function TokenManager() {
    const creatures = useGameStore(state => state.creatures);

    return (
        <div 
            id="token-container" 
            style={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%", 
                pointerEvents: "none",
                zIndex: 1
            }}
        >
            {creatures.map(creature => (
                <Token key={creature.id} creature={creature} />
            ))}
        </div>
    );
}
