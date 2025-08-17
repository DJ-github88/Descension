import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useCharacterTokenStore = create(
    persist(
        (set, get) => ({
            // Character tokens on the grid
            characterTokens: [],

            // Add a character token to the grid
            addCharacterToken: (position, playerId = null, sendToServer = true) => set(state => {
                console.log('🎭 addCharacterToken called with position:', position, 'playerId:', playerId);
                console.log('🎭 Current character tokens:', state.characterTokens);

                // In multiplayer, use playerId to make tokens unique per player
                // In single player, use isPlayerToken for backward compatibility
                const tokenIdentifier = playerId || 'local_player';

                // Check if a character token already exists for this player
                const existingToken = state.characterTokens.find(t =>
                    playerId ? t.playerId === playerId : t.isPlayerToken
                );

                if (existingToken) {
                    console.log('🎭 Character token already exists for player', tokenIdentifier, ', updating position from', existingToken.position, 'to', position);
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

                console.log('🎭 Created new character token:', newToken);

                // Send to multiplayer server if in multiplayer mode and sendToServer is true
                if (playerId && sendToServer) {
                    import('../store/gameStore').then(({ default: useGameStore }) => {
                        const gameStore = useGameStore.getState();
                        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                            console.log('🎭 Sending character token creation to multiplayer server');
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

            // Add character token from server (no multiplayer sending)
            addCharacterTokenFromServer: (tokenId, position, playerId) => set(state => {
                console.log('🎭 addCharacterTokenFromServer called with:', { tokenId, position, playerId });

                // Check if token already exists
                const existingToken = state.characterTokens.find(t => t.id === tokenId);
                if (existingToken) {
                    console.log('🎭 Character token already exists, skipping:', tokenId);
                    return state;
                }

                const newToken = {
                    id: tokenId,
                    isPlayerToken: false, // Server tokens are not local player tokens
                    playerId: playerId,
                    position,
                    createdAt: Date.now()
                };

                console.log('🎭 Added character token from server:', newToken);
                return {
                    characterTokens: [
                        ...state.characterTokens,
                        newToken
                    ]
                };
            }),

            // Update character token position
            updateCharacterTokenPosition: (tokenId, position) => set(state => ({
                characterTokens: state.characterTokens.map(token =>
                    token.id === tokenId
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
            }
        }),
        {
            name: 'character-token-storage',
            version: 1
        }
    )
);

export default useCharacterTokenStore;
