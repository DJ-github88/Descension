import React from 'react';
import WowWindow from '../windows/WowWindow';
import useCombatStore from '../../store/combatStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCharacterStore from '../../store/characterStore';
import useChatStore from '../../store/chatStore';
// REMOVED: import './CombatSelectionOverlay.css'; // CAUSES CSS POLLUTION - loaded centrally

const CombatSelectionWindow = () => {
    const {
        isSelectionMode,
        selectedTokens,
        startCombat,
        cancelSelectionMode
    } = useCombatStore();

    const { tokens, creatures } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    const { addNotification } = useChatStore();

    // Don't render if not in selection mode
    if (!isSelectionMode) return null;

    const handleStartCombat = () => {
        if (selectedTokens.size === 0) {
            alert('Please select at least one token to start combat.');
            return;
        }

        // Get selected creature and character tokens
        const selectedCreatureTokens = tokens.filter(token => selectedTokens.has(token.id));
        const selectedCharacterTokens = characterTokens.filter(token => selectedTokens.has(token.id));
        const allSelectedTokens = [...selectedCreatureTokens, ...selectedCharacterTokens];

        // Add combat notification function
        const addCombatNotification = (notification) => {
            addNotification('combat', notification);
        };

        // Start combat with selected tokens
        startCombat(allSelectedTokens, creatures, addCombatNotification);
    };

    const handleCancel = () => {
        cancelSelectionMode();
    };

    const getSelectedTokenData = () => {
        const selectedCreatureTokens = tokens.filter(token => selectedTokens.has(token.id));
        const selectedCharacterTokens = characterTokens.filter(token => selectedTokens.has(token.id));

        const creatureData = selectedCreatureTokens.map(token => {
            const creature = creatures.find(c => c.id === token.creatureId);
            return {
                name: creature?.name || 'Unknown',
                tokenIcon: creature?.tokenIcon || 'inv_misc_questionmark'
            };
        });

        const characterData = selectedCharacterTokens.map(() => {
            const char = useCharacterStore.getState();
            return {
                name: char.name || 'Character',
                tokenIcon: char.tokenSettings?.customIcon || char.lore?.characterImage || 'inv_misc_questionmark'
            };
        });

        return [...creatureData, ...characterData];
    };

    const selectedTokenData = getSelectedTokenData();

    return (
        <WowWindow
            isOpen={isSelectionMode}
            onClose={handleCancel}
            title="Combat Selection"
            defaultSize={{ width: 420, height: 500 }}
            defaultPosition={{ x: 200, y: 150 }}
            centered={false}
        >
            <div className="combat-window">
                <div className="combat-header">
                    <h2>Select Combatants</h2>
                    <p>Click tokens on the map to add them to combat</p>
                </div>

                <div className="combatants-section">
                    <div className="section-title">
                        <span>Ready for Battle</span>
                        <span className="count">{selectedTokens.size}</span>
                    </div>

                    <div className="combatants-container">
                        {selectedTokenData.length > 0 ? (
                            <div className="combatants-grid">
                                {selectedTokenData.map((tokenData, index) => (
                                    <div key={index} className="combatant-card">
                                        <div className="combatant-initial">
                                            {tokenData.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="combatant-name">{tokenData.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-message">
                                <div className="empty-icon">⚔</div>
                                <span>No combatants selected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="combat-buttons">
                    <button className="btn-cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button
                        className="btn-start"
                        onClick={handleStartCombat}
                        disabled={selectedTokens.size === 0}
                    >
                        Begin Combat ({selectedTokens.size})
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default CombatSelectionWindow;
