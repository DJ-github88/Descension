import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useCharacterTokenStore = create(
    persist(
        (set, get) => ({
            // Character tokens on the grid
            characterTokens: [],

            // Add a character token to the grid
            addCharacterToken: (position) => set(state => {
                console.log('🎭 addCharacterToken called with position:', position);
                console.log('🎭 Current character tokens:', state.characterTokens);

                // Check if a character token already exists
                const existingToken = state.characterTokens.find(t => t.isPlayerToken);
                if (existingToken) {
                    console.log('🎭 Character token already exists, updating position from', existingToken.position, 'to', position);
                    return {
                        characterTokens: state.characterTokens.map(t =>
                            t.isPlayerToken
                                ? { ...t, position }
                                : t
                        )
                    };
                }

                // Create a new character token
                const newToken = {
                    id: uuidv4(),
                    isPlayerToken: true,
                    position,
                    createdAt: Date.now()
                };

                console.log('🎭 Created new character token:', newToken);

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
