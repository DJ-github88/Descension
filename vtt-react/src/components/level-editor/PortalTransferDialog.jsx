import React, { useState } from 'react';
import WowWindow from '../windows/WowWindow';
import useMapStore from '../../store/mapStore';
import useSettingsStore from '../../store/settingsStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { MAP_TRANSITION_TIMINGS } from '../multiplayer/MapTransitionOverlay';
import './styles/PortalTransferDialog.css';

const PortalTransferDialog = ({
    isOpen,
    onClose,
    portal,
    position = { x: 400, y: 300 }
}) => {
    const { maps, switchToMap } = useMapStore();
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
            // Import game store to check if we're in multiplayer
            const { default: useGameStore } = await import('../../store/gameStore');
            const gameStore = useGameStore.getState();

            // MULTIPLAYER: Emit socket event instead of handling locally
            // Server will validate the connection and send player_map_changed event
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket?.connected) {
                const socket = gameStore.multiplayerSocket;

                // CRITICAL SAFETY: Check if emit exists (fixes this.onevent is not a function)
                if (socket && typeof socket.emit === 'function') {
                    socket.emit('player_use_connection', {
                        connectionId: portal.id
                    });
                    console.log(`📡 [PortalTransfer] Emitted player_use_connection for ${portal.id}`);
                } else {
                    console.error('❌ [PortalTransfer] Socket found but emit is missing or invalid:', socket);
                    // Fallback to local transfer if socket fails
                    throw new Error('Socket emit failed');
                }

                // Close the dialog - the server will trigger the map transition
                onClose();
                console.log(`Emitted player_use_connection for ${portal.id}`);
                return;
            }

            // SINGLE PLAYER: Handle transfer locally (existing logic)
            const waitForRenderStabilization = async () => {
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            };

            // Keep transition sequencing consistent with the stable GM path
            const showMapTransitions = useSettingsStore.getState().showMapTransitions;
            if (showMapTransitions) {
                window.dispatchEvent(new CustomEvent('manual_map_transition_requested', {
                    detail: {
                        mapName: destinationMap?.name || 'Unknown Realm',
                        transferredByGM: false
                    }
                }));

                await new Promise(resolve => setTimeout(resolve, MAP_TRANSITION_TIMINGS.SAFE_SWAP_MS));
            }

            // Switch to the destination map
            await switchToMap(destinationMapId, {
                skipCameraRestore: true,
                source: 'portal-transfer-dialog'
            });

            // Ensure stores/render settled before resolving and applying destination coordinates
            await waitForRenderStabilization();

            const mapStoreState = useMapStore.getState();
            const latestDestinationMap = (mapStoreState.maps || []).find(map => map.id === destinationMapId) || destinationMap;
            const destinationPosition = portal?.properties?.destinationPosition;
            const destinationPositionType = portal?.properties?.destinationPositionType;

            // Resolve destination position deterministically (no ambiguous small-value heuristics)
            let worldPos = null;
            const gridSystem = getGridSystem();
            if (destinationConnectionId) {
                const destinationConnections = latestDestinationMap?.dndElements || [];
                const destinationConnection = destinationConnections.find(el =>
                    (el.type === 'portal' || el.type === 'connection') && el.id === destinationConnectionId
                );

                if (destinationConnection) {
                    if (Number.isFinite(destinationConnection.gridX) && Number.isFinite(destinationConnection.gridY)) {
                        worldPos = gridSystem.gridToWorld(destinationConnection.gridX, destinationConnection.gridY);
                    } else if (
                        Number.isFinite(destinationConnection.position?.x) &&
                        Number.isFinite(destinationConnection.position?.y)
                    ) {
                        worldPos = destinationConnection.position;
                    }
                }
            }

            if (!worldPos && Number.isFinite(destinationPosition?.x) && Number.isFinite(destinationPosition?.y)) {
                if (destinationPositionType === 'grid') {
                    worldPos = gridSystem.gridToWorld(destinationPosition.x, destinationPosition.y);
                } else {
                    worldPos = destinationPosition;
                }
            }

            // Safer final fallback than defaulting directly to origin
            if (!worldPos && Number.isFinite(latestDestinationMap?.cameraPosition?.x) && Number.isFinite(latestDestinationMap?.cameraPosition?.y)) {
                worldPos = { ...latestDestinationMap.cameraPosition };
            }
            if (!worldPos && Number.isFinite(latestDestinationMap?.cameraX) && Number.isFinite(latestDestinationMap?.cameraY)) {
                worldPos = { x: latestDestinationMap.cameraX, y: latestDestinationMap.cameraY };
            }
            if (!worldPos) {
                worldPos = { x: 0, y: 0 };
            }
            if (!Number.isFinite(worldPos.x) || !Number.isFinite(worldPos.y)) {
                console.warn('⚠️ [PortalTransfer] Invalid destination worldPos resolved, using safe origin fallback', {
                    worldPos,
                    destinationMapId,
                    destinationConnectionId
                });
                worldPos = { x: 0, y: 0 };
            }

            // Move player tokens to destination position
            try {
                const { default: useCharacterTokenStore } = await import('../../store/characterTokenStore');
                const { default: useCreatureStore } = await import('../../store/creatureStore');

                const characterTokenStore = useCharacterTokenStore.getState();
                const creatureStore = useCreatureStore.getState();

                // Move player's character token
                if (characterTokenStore.characterTokens) {
                    // Find the player's token (isPlayerToken flag or first token)
                    const playerToken = characterTokenStore.characterTokens.find(token => token.isPlayerToken) ||
                        characterTokenStore.characterTokens[0];

                    if (playerToken && characterTokenStore.updateCharacterTokenPosition) {
                        characterTokenStore.updateCharacterTokenPosition(playerToken.id, worldPos);
                    }
                }

                // Move player's creature token if they're viewing from a creature
                if (creatureStore.tokens) {
                    const playerCreatureToken = creatureStore.tokens.find(token => token.isPlayerToken);
                    if (playerCreatureToken && creatureStore.updateTokenPosition) {
                        creatureStore.updateTokenPosition(playerCreatureToken.id, worldPos);
                    }
                }

                // Center camera only after token/map state is visible on the new map
                await waitForRenderStabilization();
                if (typeof gameStore.markTransferCameraAuthoritative === 'function') {
                    gameStore.markTransferCameraAuthoritative(
                        { x: worldPos.x, y: worldPos.y },
                        2000,
                        'portal-transfer-dialog-singleplayer'
                    );
                }
                gridSystem.centerCameraOnWorld(worldPos.x, worldPos.y);
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
            defaultSize={{ width: 500, height: 480 }}
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
