import React from 'react';
import useGameStore from '../../store/gameStore';

export default function CreatureWindow() {
    const creatures = useGameStore(state => state.creatures);

    return (
        <div className="wow-window-content">
            <div className="wow-settings-section">
                <h3 className="wow-settings-title">Creatures</h3>
                <div className="wow-settings-content">
                    {creatures?.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {creatures.map((creature, index) => (
                                <li key={index} style={{ marginBottom: '8px', padding: '8px', background: 'rgba(49, 50, 68, 0.6)', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{creature.name}</span>
                                        <span>HP: {creature.hp}/{creature.maxHp}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No creatures added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
