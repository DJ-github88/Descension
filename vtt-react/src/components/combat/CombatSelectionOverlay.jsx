import React from 'react';
import WowWindow from '../windows/WowWindow';
import useCombatStore from '../../store/combatStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCharacterStore from '../../store/characterStore';
import useChatStore from '../../store/chatStore';
import { getCreatureTokenIconUrl, getIconUrl } from '../../utils/assetManager';
import './CombatSelectionOverlay.css';
// import '../../styles/combat-selection-window.css'; // Removed redundant/conflicting import

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
        const selectedCharacterTokens = (characterTokens || []).filter(token => selectedTokens.has(token.id));
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
        const selectedCharacterTokens = (characterTokens || []).filter(token => selectedTokens.has(token.id));

        const creatureData = selectedCreatureTokens.map(token => {
            const creature = creatures.find(c => c.id === token.creatureId);
            return {
                name: creature?.name || 'Unknown',
                tokenIcon: creature?.tokenIcon || 'inv_misc_questionmark',
                type: creature?.type || 'creature',
                isCharacter: false,
                tokenId: token.id
            };
        });

        const characterData = selectedCharacterTokens.map(token => {
            const char = useCharacterStore.getState();
            return {
                name: char.name || 'Character',
                tokenIcon: char.tokenSettings?.customIcon || char.lore?.characterImage || 'inv_misc_questionmark',
                type: 'character',
                isCharacter: true,
                tokenId: token.id
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
            className="combat-selection-window"
            defaultSize={{ width: 420, height: 600 }}
            defaultPosition={{ x: 200, y: 150 }}
            centered={false}
            minConstraints={[300, 550]}
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
                                {selectedTokenData.map((tokenData, index) => {
                                    const iconUrl = tokenData.isCharacter
                                        ? (tokenData.tokenIcon || getIconUrl('Utility/Utility', 'abilities'))
                                        : getCreatureTokenIconUrl(tokenData.tokenIcon, tokenData.type);

                                    return (
                                        <div key={tokenData.tokenId || index} className="combatant-card">
                                            <div className="combatant-portrait">
                                                <img
                                                    src={iconUrl}
                                                    alt={tokenData.name}
                                                    className="combatant-icon-img"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                                    }}
                                                />
                                                {tokenData.isCharacter && (
                                                    <div className="character-badge">
                                                        <i className="fas fa-user"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="combatant-name" title={tokenData.name}>
                                                {tokenData.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-message">
                                <div className="empty-icon">⚔️</div>
                                <span>No combatants selected</span>
                                <p className="empty-hint">Click tokens on the map to add them</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="combat-buttons">
                    <button className="btn-cancel" onClick={handleCancel}>
                        <i className="fas fa-times"></i>
                        Cancel
                    </button>
                    <button
                        className="btn-start"
                        onClick={handleStartCombat}
                        disabled={selectedTokens.size === 0}
                    >
                        <i className="fas fa-swords"></i>
                        Begin Combat ({selectedTokens.size})
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default CombatSelectionWindow;
