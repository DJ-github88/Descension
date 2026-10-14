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
            background: 'var(--adventure-page, #f8f5ee)',
            border: '1px solid #9b835e',
            borderRadius: '3px',
            padding: '14px 20px',
            zIndex: 9998,
            boxShadow: '0 8px 24px rgba(30, 21, 14, 0.35)',
            minWidth: '380px',
            textAlign: 'center',
            fontFamily: 'Cinzel, Georgia, serif'
        }}>
            <div style={{
                color: 'var(--adventure-ink, #34251a)',
                fontWeight: '600',
                fontSize: '15px',
                marginBottom: '8px',
                letterSpacing: '0.6px'
            }}>
                Combat Round {round}
            </div>

            {currentCombatant ? (
                <div style={{
                    marginBottom: '12px'
                }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--adventure-seal, #663c32)' }}>
                        Current Turn: {currentCombatant.name}
                    </div>
                    <div style={{ fontSize: '13px', marginTop: '4px', fontFamily: 'Crimson Text, Georgia, serif', color: 'var(--adventure-muted, #68533e)' }}>
                        Initiative: {currentCombatant.initiative} | 
                        AP: {currentCombatant.currentActionPoints}/{currentCombatant.maxActionPoints}
                    </div>
                </div>
            ) : (
                <div style={{
                    color: 'var(--adventure-seal, #663c32)',
                    marginBottom: '12px',
                    fontSize: '13px',
                    fontFamily: 'Crimson Text, Georgia, serif'
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
                            padding: '6px 16px',
                            background: 'var(--adventure-paper, #f1ece1)',
                            border: '1px solid var(--adventure-rule, #c4baa6)',
                            borderRadius: '3px',
                            color: 'var(--adventure-ink, #34251a)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontFamily: 'Cinzel, Georgia, serif',
                            letterSpacing: '0.4px',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'var(--adventure-panel, #e8e2d4)';
                            e.target.style.borderColor = 'var(--adventure-seal, #663c32)';
                            e.target.style.color = 'var(--adventure-seal, #663c32)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'var(--adventure-paper, #f1ece1)';
                            e.target.style.borderColor = 'var(--adventure-rule, #c4baa6)';
                            e.target.style.color = 'var(--adventure-ink, #34251a)';
                        }}
                    >
                        Next Turn
                    </button>
                )}

                <button
                    onClick={endCombat}
                    style={{
                        padding: '6px 16px',
                        background: 'var(--adventure-seal, #663c32)',
                        border: '1px solid #4a2820',
                        borderRadius: '3px',
                        color: '#fdfaf3',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'Cinzel, Georgia, serif',
                        letterSpacing: '0.4px',
                        transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.background = '#7a463a';
                        e.target.style.borderColor = '#5a2e24';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = 'var(--adventure-seal, #663c32)';
                        e.target.style.borderColor = '#4a2820';
                    }}
                >
                    End Combat
                </button>
            </div>

            {turnOrder.length > 0 && (
                <div style={{
                    marginTop: '8px',
                    fontSize: '11px',
                    fontFamily: 'Crimson Text, Georgia, serif',
                    color: 'var(--adventure-muted, #68533e)'
                }}>
                    Turn {currentTurnIndex + 1} of {turnOrder.length}
                </div>
            )}
        </div>,
        document.body
    );
};

export default CombatControlPanel;
