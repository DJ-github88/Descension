import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useCharacterTokenStore = create((set, get) => ({
    // Character tokens on the grid
    characterTokens: [],

    // Add a character token to the grid
    addCharacterToken: (position, playerId = null, sendToServer = true) => set(state => {

        // In multiplayer, use playerId to make tokens unique per player
        // In single player, use isPlayerToken for backward compatibility
        const tokenIdentifier = playerId || 'local_player';

        // Check if a character token already exists for this player
        const existingToken = state.characterTokens.find(t =>
            playerId ? t.playerId === playerId : t.isPlayerToken
        );

        if (existingToken) {
            return {
                characterTokens: state.characterTokens.map(t =>
                    (playerId ? t.playerId === playerId : t.isPlayerToken)
                        ? { ...t, position }
                        : t
                )
            };
        }

        // Create a new character token
        const newToken = {
            id: uuidv4(),
            isPlayerToken: !playerId, // Only true for local single-player tokens
            playerId: playerId, // Store player ID for multiplayer
            position,
            createdAt: Date.now()
        };


        // 🎯 CONDITIONALLY SWITCH TO PLAYER VIEW WHEN CHARACTER TOKEN IS PLACED
        // Only auto-enable if GM has set defaultViewFromToken to true
        Promise.all([
            import('../store/gameStore'),
            import('../store/levelEditorStore')
        ]).then(([{ default: useGameStore }, { default: useLevelEditorStore }]) => {
            const gameStore = useGameStore.getState();
            const levelEditorStore = useLevelEditorStore.getState();

            // Switch to player mode
            gameStore.setGMMode(false);

            // Only auto-enable view from token if GM has configured it
            if (gameStore.defaultViewFromToken) {
                // Reset the disabled flag when placing a new token (so auto-enable works)
                levelEditorStore.playerViewFromTokenDisabled = false;
                // Enable view from this character token
                levelEditorStore.setViewingFromToken({
                    id: newToken.id,
                    type: 'character',
                    characterId: playerId || 'local_player',
                    position: position // Include position for visibility calculations
                });
            } else {
                // Default behavior: don't auto-enable view from token
                // Player must manually select it if they want fog of war restrictions
                levelEditorStore.setViewingFromToken(null);
            }
            // NOTE: Removed automatic camera centering on token creation to prevent unwanted camera resets
        }).catch(error => {
            console.error('Failed to setup player view:', error);
        });

        // Send to multiplayer server if in multiplayer mode and sendToServer is true
        if (playerId && sendToServer) {
            import('../store/gameStore').then(({ default: useGameStore }) => {
                const gameStore = useGameStore.getState();
                if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                    gameStore.multiplayerSocket.emit('character_token_created', {
                        tokenId: newToken.id,
                        position: position
                    });
                }
            }).catch(error => {
                console.error('Failed to import gameStore for character token sync:', error);
            });
        }

        return {
            characterTokens: [
                ...state.characterTokens,
                newToken
            ]
        };
    }),

    // Update character token position (by player ID for multiplayer sync)
    updateCharacterTokenPosition: (playerIdOrTokenId, position) => set(state => ({
        characterTokens: state.characterTokens.map(token =>
            token.id === playerIdOrTokenId || token.playerId === playerIdOrTokenId
                ? { ...token, position }
                : token
        )
    })),

    // Remove a character token
    removeCharacterToken: (tokenId) => set(state => ({
        characterTokens: state.characterTokens.filter(token => token.id !== tokenId)
    })),

    // Clear all character tokens
    clearCharacterTokens: () => set({ characterTokens: [] }),

    // Get character token by ID
    getCharacterToken: (tokenId) => {
        const state = get();
        return state.characterTokens.find(token => token.id === tokenId);
    },

    // Get the player's character token
    getPlayerToken: () => {
        const state = get();
        return state.characterTokens.find(token => token.isPlayerToken);
    },

    // Update character token state (for conditions, etc.)
    updateCharacterTokenState: (tokenId, stateUpdates) => set(state => {
        const updatedTokens = state.characterTokens.map(token => {
            if (token.id === tokenId) {
                const oldState = token.state || {};
                const newState = { ...oldState, ...stateUpdates };
                return {
                    ...token,
                    state: newState
                };
            }
            return token;
        });
        return { characterTokens: updatedTokens };
    }),

    // Clean up expired conditions from all character tokens
    cleanupExpiredConditions: () => {
        const state = get();
        const currentTime = Date.now();
        let hasChanges = false;

        const updatedTokens = state.characterTokens.map(token => {
            if (!token.state?.conditions || token.state.conditions.length === 0) {
                return token;
            }

            const validConditions = token.state.conditions.filter(condition => {
                // If no duration info, keep the condition (permanent)
                if (!condition.duration && !condition.durationType) {
                    return true;
                }

                // Round-based conditions are handled by combat store when turns end
                if (condition.durationType === 'rounds') {
                    // Check if remainingRounds exists and is > 0
                    const remainingRounds = condition.remainingRounds ?? condition.durationValue;
                    return remainingRounds > 0;
                }

                // Time-based conditions: check if appliedAt + duration has passed
                if (condition.appliedAt && condition.duration) {
                    const endTime = condition.appliedAt + condition.duration;
                    return endTime > currentTime;
                }

                // If we can't determine expiration, keep it
                return true;
            });

            if (validConditions.length !== token.state.conditions.length) {
                hasChanges = true;
                return {
                    ...token,
                    state: {
                        ...token.state,
                        conditions: validConditions
                    }
                };
            }

            return token;
        });

        if (hasChanges) {
            set({ characterTokens: updatedTokens });
        }
    },

    // Add character token from server (for multiplayer sync)
    addCharacterTokenFromServer: (tokenId, position, playerId) => set((state) => {
        // Check if token already exists
        const existingToken = state.characterTokens.find(token =>
            token.id === tokenId || (playerId && token.playerId === playerId)
        );

        if (existingToken) {
            return {
                characterTokens: state.characterTokens.map(token =>
                    token.id === existingToken.id
                        ? { ...token, position }
                        : token
                )
            };
        }

        // Create new token from server data
        const newToken = {
            id: tokenId,
            isPlayerToken: false, // Server tokens are not local player tokens
            playerId: playerId,
            position,
            createdAt: Date.now()
        };


        return {
            characterTokens: [
                ...state.characterTokens,
                newToken
            ]
        };
    })
}));

export default useCharacterTokenStore;
