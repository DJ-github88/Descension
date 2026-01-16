import React, { useState, useEffect } from 'react';
import WowWindow from '../windows/WowWindow';
import useMapStore from '../../store/mapStore';
import './styles/PortalTransferDialog.css';

const PortalTransferDialog = ({
    isOpen,
    onClose,
    portal,
    position = { x: 400, y: 300 }
}) => {
    const { maps, switchToMap, getCurrentMapId } = useMapStore();
    const [isTransferring, setIsTransferring] = useState(false);

    // Get destination map info
    const destinationMapId = portal?.properties?.destinationMapId;
    const destinationConnectionId = portal?.properties?.destinationConnectionId || portal?.properties?.connectedToId;
    const destinationMap = maps.find(map => map.id === destinationMapId);
    const portalName = portal?.properties?.portalName || 'Portal';

    // Get destination connection name
    let destinationConnectionName = null;
    if (destinationConnectionId && destinationMap) {
        const destinationConnections = destinationMap.dndElements || [];
        const destinationConnection = destinationConnections.find(el =>
            (el.type === 'portal' || el.type === 'connection') && el.id === destinationConnectionId
        );
        if (destinationConnection) {
            destinationConnectionName = destinationConnection.properties?.portalName || 'Connection';
        }
    }

    const handleTransfer = async () => {
        if (!destinationMapId || !destinationMap) {
            alert('Connection destination is not properly configured.');
            return;
        }

        setIsTransferring(true);

        try {
            // Get destination connection position
            const destinationConnectionId = portal?.properties?.destinationConnectionId || portal?.properties?.connectedToId;
            let destinationPosition = portal?.properties?.destinationPosition || { x: 0, y: 0 };

            // Find destination connection to get its actual position
            let worldPos = null;
            if (destinationConnectionId) {
                const destinationConnections = destinationMap.dndElements || [];
                const destinationConnection = destinationConnections.find(el =>
                    (el.type === 'portal' || el.type === 'connection') && el.id === destinationConnectionId
                );
                if (destinationConnection) {
                    // Check if connection has world position or grid position
                    if (destinationConnection.position &&
                        destinationConnection.position.x !== undefined &&
                        destinationConnection.position.y !== undefined) {
                        // Already in world coordinates
                        worldPos = destinationConnection.position;
                    } else if (destinationConnection.gridX !== undefined &&
                        destinationConnection.gridY !== undefined) {
                        // Convert from grid coordinates to world coordinates
                        const { getGridSystem } = await import('../../utils/InfiniteGridSystem');
                        const gridSystem = getGridSystem();
                        worldPos = gridSystem.gridToWorld(destinationConnection.gridX, destinationConnection.gridY);
                    }
                }
            }

            // Fallback to destinationPosition if connection not found
            if (!worldPos) {
                const { getGridSystem } = await import('../../utils/InfiniteGridSystem');
                const gridSystem = getGridSystem();
                // Check if destinationPosition is grid or world coordinates
                // If it's a small number, assume grid coordinates
                if (destinationPosition.x < 1000 && destinationPosition.y < 1000) {
                    worldPos = gridSystem.gridToWorld(destinationPosition.x, destinationPosition.y);
                } else {
                    worldPos = destinationPosition;
                }
            }

            // Switch to the destination map
            await switchToMap(destinationMapId);

            // Move player tokens to destination position
            try {
                const { default: useCharacterTokenStore } = await import('../../store/characterTokenStore');
                const { default: useCreatureStore } = await import('../../store/creatureStore');
                const { default: useGameStore } = await import('../../store/gameStore');

                const characterTokenStore = useCharacterTokenStore.getState();
                const creatureStore = useCreatureStore.getState();
                const gameStore = useGameStore.getState();

                // Move player's character token
                if (characterTokenStore.characterTokens) {
                    // Find the player's token (isPlayerToken flag or first token)
                    const playerToken = characterTokenStore.characterTokens.find(token => token.isPlayerToken) ||
                        characterTokenStore.characterTokens[0];

                    if (playerToken && characterTokenStore.updateCharacterTokenPosition) {
                        characterTokenStore.updateCharacterTokenPosition(playerToken.id, worldPos);

                        // Broadcast movement to other players
                        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket?.connected) {
                            gameStore.multiplayerSocket.emit('character_moved', {
                                tokenId: playerToken.id,
                                characterId: playerToken.characterId || playerToken.playerId,
                                position: { x: Math.round(worldPos.x), y: Math.round(worldPos.y) },
                                isDragging: false
                            });
                        }
                    }
                }

                // Move player's creature token if they're viewing from a creature
                if (creatureStore.tokens) {
                    const playerCreatureToken = creatureStore.tokens.find(token => token.isPlayerToken);
                    if (playerCreatureToken && creatureStore.updateTokenPosition) {
                        creatureStore.updateTokenPosition(playerCreatureToken.id, worldPos);

                        // Broadcast movement to other players
                        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket?.connected) {
                            gameStore.multiplayerSocket.emit('token_moved', {
                                tokenId: playerCreatureToken.id,
                                position: { x: Math.round(worldPos.x), y: Math.round(worldPos.y) },
                                isLocal: true
                            });
                        }
                    }
                }

                // Center camera on destination position - use grid system for proper centering
                const { getGridSystem } = await import('../../utils/InfiniteGridSystem');
                const gridSystem = getGridSystem();
                requestAnimationFrame(() => {
                    gridSystem.centerCameraOnWorld(worldPos.x, worldPos.y);
                });
            } catch (tokenError) {
                console.warn('Could not move tokens:', tokenError);
            }

            // Close the dialog
            onClose();

            // Show success message
            console.log(`Successfully transferred to ${destinationMap.name}`);
        } catch (error) {
            console.error('Error transferring through connection:', error);
            alert('Failed to transfer through connection. Please try again.');
        } finally {
            setIsTransferring(false);
        }
    };

    const handleStayHere = () => {
        onClose();
    };

    if (!portal || !isOpen) {
        return null;
    }

    return (
        <WowWindow
            title="Connection Transfer"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 500, height: 420 }}
            defaultPosition={position}
            className="portal-transfer-dialog-window"
        >
            <div className="portal-transfer-dialog">
                <div className="portal-header">
                    <h2 className="portal-title">Connection Destination</h2>
                    {portal.properties?.description && (
                        <p className="portal-description">{portal.properties.description}</p>
                    )}
                </div>

                <div className="transfer-question">
                    {destinationMap ? (
                        <>
                            <p>This connection leads to:</p>
                            <div className="destination-info">
                                <span className="destination-name">◉ {destinationConnectionName || portalName}</span>
                            </div>
                            <p className="transfer-prompt">Would you like to travel through this connection?</p>
                        </>
                    ) : (
                        <div className="no-destination">
                            <p>⚠ This connection is not properly configured.</p>
                            <p>No destination map has been set.</p>
                        </div>
                    )}
                </div>

                <div className="dialog-actions">
                    <button
                        className="wow-button"
                        onClick={handleStayHere}
                        disabled={isTransferring}
                    >
                        Stay Here
                    </button>
                    {destinationMap && (
                        <button
                            className="wow-button primary"
                            onClick={handleTransfer}
                            disabled={isTransferring}
                        >
                            {isTransferring ? 'Transferring...' : `Travel to ${portalName}`}
                        </button>
                    )}
                </div>
            </div>
        </WowWindow>
    );
};

export default PortalTransferDialog;
