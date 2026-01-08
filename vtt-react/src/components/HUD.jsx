import React from 'react';
import useGameStore from '../store/gameStore';

export default function HUD() {
    const creatures = useGameStore(state => state.creatures);
    const isGMMode = useGameStore(state => state.isGMMode);
    const player = creatures.find(c => c.type === 'PLAYER');

    if (!player) return null;

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
            borderRadius: '8px',
            color: 'white',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1000
        }}>
            {/* GM/Player Mode Indicator */}
            <div style={{
                position: 'absolute',
                top: '-12px',
                left: '15px',
                backgroundColor: isGMMode ? '#FF6B35' : '#4CAF50',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                zIndex: 1001
            }}>
                {isGMMode ? 'GM MODE' : 'PLAYER MODE'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#4a90e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}>
                    {player.name[0]}
                </div>
                <div>
                    <div style={{ fontWeight: 'bold' }}>{player.name}</div>
                    <div style={{ fontSize: '0.9em', opacity: 0.8 }}>Level 1 Hero</div>
                </div>
            </div>

            <div style={{ 
                display: 'flex', 
                gap: '15px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                paddingLeft: '15px'
            }}>
                <StatDisplay label="HP" current={player.hp} max={player.maxHp} color="#e25555" />
                <StatDisplay label="AP" current={player.actionPoints} max={3} color="#f5a623" />
            </div>

            <div style={{ 
                display: 'flex', 
                gap: '10px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                paddingLeft: '15px'
            }}>
                {player.abilities.map(ability => (
                    <button
                        key={ability.id}
                        onClick={() => {
                            if (ability.canUse(player)) {
                                useGameStore.getState().useAbility(player.id, ability.id);
                            }
                        }}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: ability.canUse(player) ? '#4a90e2' : '#2c3e50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: ability.canUse(player) ? 'pointer' : 'not-allowed',
                            opacity: ability.canUse(player) ? 1 : 0.5,
                            transition: 'all 0.2s ease-out',
                            position: 'relative'
                        }}
                    >
                        {ability.name}
                        <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#2c3e50',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            border: '2px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            {ability.cost}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function StatDisplay({ label, current, max, color }) {
    const percentage = (current / max) * 100;
    
    return (
        <div style={{ minWidth: '80px' }}>
            <div style={{ fontSize: '0.8em', opacity: 0.8, marginBottom: '4px' }}>{label}</div>
            <div style={{ 
                position: 'relative',
                height: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${percentage}%`,
                    background: color,
                    transition: 'width 0.3s ease-out'
                }} />
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                    {current}/{max}
                </div>
            </div>
        </div>
    );
}
