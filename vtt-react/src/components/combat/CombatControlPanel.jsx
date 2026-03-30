import React from 'react';
import { createPortal } from 'react-dom';
import useCombatStore from '../../store/combatStore';

const CombatControlPanel = () => {
    const {
        isInCombat,
        turnOrder,
        currentTurnIndex,
        round,
        nextTurn,
        endCombat
    } = useCombatStore();

    // Only show if in combat
    if (!isInCombat) return null;

    const currentCombatant = turnOrder[currentTurnIndex];

    return createPortal(
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(145deg, #f8f4e6 0%, #ede4d3 30%, #e8dcc6 70%, #f0ead6 100%)',
            border: '3px solid #8B4513',
            borderRadius: '12px',
            padding: '15px 20px',
            zIndex: 9998,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            minWidth: '400px',
            textAlign: 'center'
        }}>
            <div style={{
                color: '#5a1e12',
                fontWeight: 'bold',
                fontSize: '16px',
                marginBottom: '10px'
            }}>
                Combat Round {round}
            </div>

            {currentCombatant ? (
                <div style={{
                    color: '#5a1e12',
                    marginBottom: '15px',
                    fontSize: '14px'
                }}>
                    <div style={{ fontWeight: 'bold' }}>
                        Current Turn: {currentCombatant.name}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                        Initiative: {currentCombatant.initiative} | 
                        AP: {currentCombatant.currentActionPoints}/{currentCombatant.maxActionPoints}
                    </div>
                </div>
            ) : (
                <div style={{
                    color: '#ff4444',
                    marginBottom: '15px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    No combatants found!
                </div>
            )}

            <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
            }}>
                {turnOrder.length > 0 && (
                    <button
                        onClick={nextTurn}
                        style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(145deg, #f8f4e6 0%, #ede4d3 30%, #e8dcc6 70%, #f0ead6 100%)',
                            border: '2px solid #8B4513',
                            borderRadius: '6px',
                            color: '#5a1e12',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Next Turn
                    </button>
                )}

                <button
                    onClick={endCombat}
                    style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(145deg, #ff6b6b 0%, #ff5252 30%, #f44336 70%, #d32f2f 100%)',
                        border: '2px solid #8B0000',
                        borderRadius: '6px',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    End Combat
                </button>
            </div>

            {turnOrder.length > 0 && (
                <div style={{
                    marginTop: '10px',
                    fontSize: '11px',
                    color: '#666'
                }}>
                    Turn {currentTurnIndex + 1} of {turnOrder.length}
                </div>
            )}
        </div>,
        document.body
    );
};

export default CombatControlPanel;
