import React, { useState } from 'react';
import MythrillWindow from '../windows/MythrillWindow';
import useCombatStore from '../../store/combatStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCharacterStore from '../../store/characterStore';
import useMapStore from '../../store/mapStore';
import useGameStore from '../../store/gameStore';
import useChatStore from '../../store/chatStore';
import { getCreatureTokenIconUrl, getIconUrl } from '../../utils/assetManager';
import './CombatSelectionOverlay.css';

const CombatSelectionOverlay = () => {
    const {
        isSelectionMode,
        selectedTokens,
        startCombat,
        cancelSelectionMode,
        toggleTokenSelection
    } = useCombatStore();

    const { tokens, creatures } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    const currentMapId = useMapStore(state => state.currentMapId);
    const isGMMode = useGameStore(state => state.isGMMode);
    const isInMultiplayer = useGameStore(state => state.isInMultiplayer);
    const { addNotification } = useChatStore();

    const [customInitiatives, setCustomInitiatives] = useState({});

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

        // Start combat with selected tokens and optional supplied initiatives
        startCombat(allSelectedTokens, creatures, addCombatNotification, customInitiatives);
    };

    const handleCancel = () => {
        cancelSelectionMode();
    };

    const handleInitiativeChange = (tokenId, value) => {
        setCustomInitiatives(prev => {
            const next = { ...prev };
            if (value === '' || value === null || value === undefined) {
                delete next[tokenId];
            } else {
                next[tokenId] = Number(value);
            }
            return next;
        });
    };

    // Build candidates from placed tokens
    const getCandidates = () => {
        const candidates = [];

        // 1. Placed Characters
        (characterTokens || []).forEach(token => {
            const char = token.character || useCharacterStore.getState();
            const name = token.character?.name || token.name || char.name || 'Hero';
            const ownerUid = token.ownerUserId || token.state?.actorContract?.ownerUid || '';
            const charClass = token.character?.class || char.class || 'Hero';
            const agility = token.character?.stats?.agility ?? char.stats?.agility ?? 10;
            const initiativeMod = Math.floor((agility - 10) / 2);
            const tokenIcon = token.character?.tokenSettings?.customIcon || token.character?.lore?.characterImage || token.tokenIcon || char.tokenSettings?.customIcon || getIconUrl('Arcane/Abstract Rune', 'abilities');

            let eligible = true;
            let ineligibleReason = null;

            // Map check
            if (token.mapId && currentMapId && token.mapId !== currentMapId) {
                eligible = false;
                ineligibleReason = 'Different map';
            } else if (isInMultiplayer) {
                // Binding & primary PC check
                const contract = token.state?.actorContract;
                if (!contract || contract.version !== 1) {
                    eligible = false;
                    ineligibleReason = 'Unbound';
                } else if (!contract.primary) {
                    eligible = false;
                    ineligibleReason = 'Secondary attachment';
                }
            }

            candidates.push({
                tokenId: token.id,
                name,
                isCharacter: true,
                type: 'character',
                tokenIcon,
                agility,
                initiativeMod,
                ownerUid,
                charClass,
                distinction: `PC · ${charClass}${ownerUid ? ` · ${ownerUid}` : ''} · #${token.id}`,
                eligible,
                ineligibleReason,
                rawToken: token
            });
        });

        // 2. Placed Creatures
        (tokens || []).forEach(token => {
            const creature = (creatures || []).find(c => c.id === token.creatureId);
            const isHidden = token.hidden || token.state?.hidden || token.isHidden;

            // Security / contract: do NOT disclose hidden creatures to unauthorized non-GM clients
            if (isHidden && !isGMMode) {
                return;
            }

            const name = token.name || creature?.name || 'Creature';
            const agility = token.stats?.agility ?? creature?.stats?.agility ?? 10;
            const initiativeMod = Math.floor((agility - 10) / 2);
            const tokenIcon = creature?.tokenIcon || token.tokenIcon || 'inv_misc_questionmark';

            let eligible = true;
            let ineligibleReason = null;

            // Map check
            if (token.mapId && currentMapId && token.mapId !== currentMapId) {
                eligible = false;
                ineligibleReason = 'Different map';
            } else if (isInMultiplayer) {
                const contract = token.state?.actorContract;
                if (!contract || contract.version !== 1) {
                    eligible = false;
                    ineligibleReason = 'Unbound';
                }
            }

            const posStr = token.position ? ` · (${Math.round(token.position.x)}, ${Math.round(token.position.y)})` : '';
            candidates.push({
                tokenId: token.id,
                name,
                isCharacter: false,
                type: creature?.type || 'creature',
                tokenIcon,
                agility,
                initiativeMod,
                isHidden,
                distinction: `Creature · #${token.id}${posStr}${isHidden ? ' · [Hidden]' : ''}`,
                eligible,
                ineligibleReason,
                rawToken: token
            });
        });

        return candidates;
    };

    const candidates = getCandidates();
    const candidateMap = new Map(candidates.map(c => [c.tokenId, c]));

    const selectedList = Array.from(selectedTokens).map(id => {
        const candidate = candidateMap.get(id);
        if (candidate) return candidate;
        // Fallback for unexpected token
        return {
            tokenId: id,
            name: `Token #${id}`,
            isCharacter: false,
            type: 'creature',
            tokenIcon: 'inv_misc_questionmark',
            distinction: `#${id}`,
            eligible: true,
            initiativeMod: 0
        };
    });

    return (
        <MythrillWindow
            isOpen={isSelectionMode}
            onClose={handleCancel}
            title=""
            className="combat-selection-window"
            defaultSize={{ width: 520, height: 680 }}
            defaultPosition={{ x: 180, y: 100 }}
            centered={false}
            minConstraints={[360, 560]}
        >
            <div className="combat-window">
                <div className="combat-header">
                    <div className="combat-header-text">
                        <h2>Select Combatants</h2>
                        <p>Click tokens on the map or select from placed actors</p>
                    </div>
                    <button
                        className="header-close-btn"
                        onClick={handleCancel}
                        aria-label="Close combat selection"
                        title="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="combat-body-layout">
                    {/* Placed Actors / Participant Discovery */}
                    <div className="combatants-discovery-section">
                        <div className="section-title">
                            <span className="section-title-text">Placed on Map</span>
                            <span className="count">{candidates.filter(c => c.eligible).length}</span>
                        </div>
                        <div className="discovery-container">
                            {candidates.length > 0 ? (
                                <div className="discovery-list" role="list" aria-label="Available combatants">
                                    {candidates.map(candidate => {
                                        const isSelected = selectedTokens.has(candidate.tokenId);
                                        const iconUrl = candidate.isCharacter
                                            ? (candidate.tokenIcon || getIconUrl('Arcane/Abstract Rune', 'abilities'))
                                            : getCreatureTokenIconUrl(candidate.tokenIcon, candidate.type);

                                        return (
                                            <div
                                                key={candidate.tokenId}
                                                className={`discovery-item ${isSelected ? 'selected' : ''} ${!candidate.eligible ? 'ineligible' : ''}`}
                                                onClick={() => {
                                                    if (candidate.eligible) {
                                                        toggleTokenSelection(candidate.tokenId);
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={candidate.eligible ? 0 : -1}
                                                aria-disabled={!candidate.eligible}
                                                aria-pressed={isSelected}
                                                title={!candidate.eligible ? `Ineligible: ${candidate.ineligibleReason}` : candidate.distinction}
                                            >
                                                <div className="discovery-portrait">
                                                    <img
                                                        src={iconUrl}
                                                        alt={candidate.name}
                                                        className="discovery-icon-img"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = getIconUrl('Arcane/Abstract Rune', 'abilities');
                                                        }}
                                                    />
                                                    {candidate.isCharacter && (
                                                        <div className="character-badge">
                                                            <i className="fas fa-user"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="discovery-details">
                                                    <div className="discovery-name-row">
                                                        <span className="discovery-name">{candidate.name}</span>
                                                        {candidate.eligible ? (
                                                            <span className={`selection-status-pill ${isSelected ? 'active' : ''}`}>
                                                                {isSelected ? '✓ Selected' : '+ Add'}
                                                            </span>
                                                        ) : (
                                                            <span className="ineligible-badge" aria-label={`Ineligible: ${candidate.ineligibleReason}`}>
                                                                {candidate.ineligibleReason}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="discovery-distinction">{candidate.distinction}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="empty-message-small">
                                    <span>No placed tokens on this map</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Combatants (Ready for Battle) */}
                    <div className="combatants-section">
                        <div className="section-title">
                            <span className="section-title-text">Ready for Battle</span>
                            <span className="count">{selectedTokens.size}</span>
                        </div>

                        <div className="combatants-container">
                            {selectedList.length > 0 ? (
                                <div className="combatants-grid">
                                    {selectedList.map((tokenData) => {
                                        const iconUrl = tokenData.isCharacter
                                            ? (tokenData.tokenIcon || getIconUrl('Arcane/Abstract Rune', 'abilities'))
                                            : getCreatureTokenIconUrl(tokenData.tokenIcon, tokenData.type);

                                        return (
                                            <div key={tokenData.tokenId} className="combatant-card">
                                                <button
                                                    className="combatant-remove-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleTokenSelection(tokenData.tokenId);
                                                    }}
                                                    aria-label={`Remove ${tokenData.name} from combat`}
                                                    title="Remove"
                                                >
                                                    ×
                                                </button>
                                                <div className="combatant-portrait">
                                                    <img
                                                        src={iconUrl}
                                                        alt={tokenData.name}
                                                        className="combatant-icon-img"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = getIconUrl('Arcane/Abstract Rune', 'abilities');
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
                                                <span className="combatant-distinction-tag" title={tokenData.distinction}>
                                                    #{tokenData.tokenId}
                                                </span>
                                                <div className="initiative-input-row" onClick={(e) => e.stopPropagation()}>
                                                    <label htmlFor={`init-${tokenData.tokenId}`}>Init:</label>
                                                    <input
                                                        id={`init-${tokenData.tokenId}`}
                                                        type="number"
                                                        className="combatant-initiative-input"
                                                        placeholder={`d20${tokenData.initiativeMod >= 0 ? '+' : ''}${tokenData.initiativeMod}`}
                                                        value={customInitiatives[tokenData.tokenId] ?? ''}
                                                        onChange={(e) => handleInitiativeChange(tokenData.tokenId, e.target.value)}
                                                        title="Supply manual initiative or leave blank for automatic roll"
                                                        aria-label={`Initiative for ${tokenData.name}`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="empty-message">
                                    <div className="empty-icon">
                                        <i className="fas fa-shield-halved"></i>
                                    </div>
                                    <span className="empty-text">No combatants selected</span>
                                    <p className="empty-hint">Click tokens on the map or from the list above</p>
                                </div>
                            )}
                        </div>
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
        </MythrillWindow>
    );
};

export default CombatSelectionOverlay;
