import React from 'react';
import useCombatStore from '../../store/combatStore';

const CombatDebugPanel = () => {
    const {
        isInCombat,
        isSelectionMode,
        turnOrder,
        currentTurnIndex,
        selectedTokens,
        startSelectionMode,
        cancelSelectionMode,
        endCombat,
        forceResetCombat,
        debugCombatState,
        clearCombatStorage,
        startCombat
    } = useCombatStore();

    const currentCombatant = turnOrder[currentTurnIndex];

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 9999,
            minWidth: '250px'
        }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#FFD700' }}>Combat Debug Panel</h3>
            
            <div style={{ marginBottom: '10px' }}>
                <strong>Combat State:</strong>
                <div>In Combat: {isInCombat ? 'YES' : 'NO'}</div>
                <div>Selection Mode: {isSelectionMode ? 'YES' : 'NO'}</div>
                <div>Selected Tokens: {selectedTokens.size}</div>
                <div>Turn Order Length: {turnOrder.length}</div>
                <div>Current Turn Index: {currentTurnIndex}</div>
                {currentCombatant && (
                    <div>Current Turn: {currentCombatant.name}</div>
                )}
                {turnOrder.length > 0 && (
                    <div style={{ fontSize: '10px', marginTop: '5px' }}>
                        <strong>Turn Order:</strong>
                        {turnOrder.map((combatant, index) => (
                            <div key={index} style={{
                                color: index === currentTurnIndex ? '#FFD700' : '#ccc',
                                marginLeft: '10px'
                            }}>
                                {index}: {combatant.name} (Init: {combatant.initiative})
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button 
                    onClick={debugCombatState}
                    style={{ padding: '5px', fontSize: '11px' }}
                >
                    Log State to Console
                </button>
                
                <button
                    onClick={startSelectionMode}
                    disabled={isSelectionMode || isInCombat}
                    style={{ padding: '5px', fontSize: '11px' }}
                >
                    Start Selection
                </button>

                <button
                    onClick={() => {
                        // Create dummy tokens and creatures for testing
                        const dummyTokens = [
                            { id: 'token1', creatureId: 'creature1' },
                            { id: 'token2', creatureId: 'creature2' },
                            { id: 'token3', creatureId: 'creature3' }
                        ];

                        const dummyCreatures = [
                            {
                                id: 'creature1',
                                name: 'Goblin Warrior',
                                tokenIcon: 'ability_warrior_savageblow',
                                stats: { agility: 14, maxActionPoints: 2 }
                            },
                            {
                                id: 'creature2',
                                name: 'Orc Shaman',
                                tokenIcon: 'spell_nature_lightning',
                                stats: { agility: 12, maxActionPoints: 2 }
                            },
                            {
                                id: 'creature3',
                                name: 'Human Paladin',
                                tokenIcon: 'spell_holy_holybolt',
                                stats: { agility: 10, maxActionPoints: 2 }
                            }
                        ];

                        startCombat(dummyTokens, dummyCreatures, null);
                    }}
                    disabled={isInCombat}
                    style={{ padding: '5px', fontSize: '11px', background: '#4CAF50' }}
                >
                    Test Timeline
                </button>
                
                <button 
                    onClick={cancelSelectionMode}
                    disabled={!isSelectionMode}
                    style={{ padding: '5px', fontSize: '11px' }}
                >
                    Cancel Selection
                </button>
                
                <button 
                    onClick={endCombat}
                    disabled={!isInCombat}
                    style={{ padding: '5px', fontSize: '11px' }}
                >
                    End Combat
                </button>
                
                <button 
                    onClick={forceResetCombat}
                    style={{ padding: '5px', fontSize: '11px', background: '#ff4444' }}
                >
                    Force Reset
                </button>
                
                <button 
                    onClick={() => {
                        clearCombatStorage();
                        forceResetCombat();
                    }}
                    style={{ padding: '5px', fontSize: '11px', background: '#ff8800' }}
                >
                    Clear Storage & Reset
                </button>
            </div>

            <div style={{ marginTop: '10px', fontSize: '10px', color: '#ccc' }}>
                Shortcuts:
                <div>Ctrl+Shift+C: Force Reset</div>
                <div>Ctrl+Shift+X: Clear Storage</div>
            </div>
        </div>
    );
};

export default CombatDebugPanel;
