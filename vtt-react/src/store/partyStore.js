import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import useChatStore from './chatStore';
import useGameStore from './gameStore';

// Party member status types
export const PARTY_STATUS = {
    ONLINE: 'online',
    AWAY: 'away',
    BUSY: 'busy',
    OFFLINE: 'offline'
};

// Removed: Complex party roles - Room creator is GM, others are players

// Initial state
const initialState = {
    // Current party information
    currentParty: null,
    isInParty: false,
    leaderId: null, // Track who has the crown (can be a player)

    // Party members data
    partyMembers: [], // Array of party member objects

    // Party invitations
    pendingInvites: [], // Invites sent by this player
    receivedInvites: [], // Invites received by this player

    // Party settings
    partySettings: {
        allowInvites: true,
        autoAcceptFriends: false,
        showMemberLocations: true,
        shareResources: true
    },

    // HUD display settings
    hudSettings: {
        showPartyHUD: true,
        hudPosition: { x: 20, y: 100 },
        hudScale: 1.0,
        showHealthBars: true,
        showManaBars: true,
        showActionPoints: true,
        compactMode: false
    },

    // Individual member HUD positions
    memberPositions: {},

    // Multiplayer integration
    multiplayerSocket: null
};

// Create the party store
const usePartyStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Party Management Actions
            createParty: (partyName = 'New Party', currentPlayerName = 'Current Player', isGM = false) => {
                const newParty = {
                    id: uuidv4(),
                    name: partyName,
                    createdAt: Date.now(),
                    maxMembers: 6,
                    isPublic: false
                };

                // Removed: 125+ lines of hardcoded character data bloat

                set({
                    currentParty: newParty,
                    isInParty: true,
                    // Only set leaderId if the creator is actually the GM
                    leaderId: isGM ? 'current-player' : null,
                    partyMembers: [
                        {
                            id: 'current-player',
                            name: currentPlayerName,
                            isGM: isGM,
                            status: PARTY_STATUS.ONLINE,
                            joinedAt: Date.now(),
                            character: {
                                class: 'Unknown',
                                level: 1,
                                health: { current: 45, max: 50 },
                                mana: { current: 45, max: 50 },
                                actionPoints: { current: 1, max: 3 }
                            }
                        }
                    ]
                });
            },

            leaveParty: () => {
                set({
                    currentParty: null,
                    isInParty: false,
                    leaderId: null,
                    partyMembers: []
                });
            },

            disbandParty: () => {
                // Only party leader can disband
                const state = get();
                if (state.currentParty?.leaderId === 'current-player') {
                    set({
                        currentParty: null,
                        isInParty: false,
                        leaderId: null,
                        partyMembers: []
                    });
                }
            },

            // Member Management
            addPartyMember: (memberData) => {
                const state = get();
                if (!state.isInParty || state.partyMembers.length >= (state.currentParty?.maxMembers || 6)) {
                    return false;
                }

                // Check for duplicate members by ID OR by name to prevent duplicate HUDs
                const existingMemberById = (state.partyMembers || []).find(member => member.id === memberData.id);
                const existingMemberByName = (state.partyMembers || []).find(member => member.name === memberData.name);

                if (existingMemberById) {
                    return false;
                }

                if (existingMemberByName) {
                    return false;
                }

                const newMember = {
                    id: memberData.id || uuidv4(),
                    socketId: memberData.socketId || memberData.id, // CRITICAL: Store socketId for character_updated lookups
                    name: memberData.name,
                    isGM: memberData.isGM || false, // Preserve GM status
                    status: PARTY_STATUS.ONLINE,
                    joinedAt: Date.now(),
                    character: memberData.character || {
                        class: 'Unknown',
                        level: 1,
                        health: { current: 45, max: 50 },
                        mana: { current: 45, max: 50 },
                        actionPoints: { current: 1, max: 3 }
                    }
                };


                // Add new member without changing leadership
                const updatedMembers = [...(state.partyMembers || []), newMember];

                // Keep existing leadership structure
                set(state => ({
                    partyMembers: updatedMembers
                }));

                // Sync with multiplayer
                get().syncPartyUpdate('member_added', newMember);

                return true;
            },

            removePartyMember: (memberId) => {
                const state = get();
                const memberToRemove = (state.partyMembers || []).find(member => member.id === memberId);

                set(state => ({
                    partyMembers: (state.partyMembers || []).filter(member => member.id !== memberId)
                }));

                // Sync with multiplayer
                if (memberToRemove) {
                    get().syncPartyUpdate('member_removed', { memberId, memberData: memberToRemove });
                }

                // If current player is removed, they should be redirected (handled by MultiplayerApp)
                if (memberId === 'current-player') {
                }
            },

            updatePartyMember: (memberId, updates, isFromSync = false) => {
                /*
                console.log('📥 [updatePartyMember] Called:', {
                    memberId,
                    isFromSync,
                    hasCharacter: !!updates.character,
                    characterKeys: updates.character ? Object.keys(updates.character) : [],
                    hasLore: !!updates.character?.lore,
                    hasEquipment: !!updates.character?.equipment
                });
                */

                set(state => {
                    const updatedMembers = (state.partyMembers || []).map(member => {
                        if (member.id === memberId) {
                            // Deep merge character data if it exists in updates
                            if (updates.character) {
                                const newCharacter = {
                                    ...member.character,
                                    ...updates.character
                                };

                                // Deep merge nested objects to preserve existing data
                                // This prevents partial updates from wiping out existing nested data
                                const nestedObjects = [
                                    'health', 'mana', 'actionPoints', 'classResource', // Resources
                                    'stats', 'equipment', 'lore', 'tokenSettings', // Complex objects
                                    'skillProgress', 'skillRanks', 'resistances' // Other nested data
                                ];

                                nestedObjects.forEach(key => {
                                    if (updates.character[key] && typeof updates.character[key] === 'object') {
                                        newCharacter[key] = {
                                            ...(member.character?.[key] || {}),
                                            ...updates.character[key]
                                        };
                                    }
                                });

                                /*
                                console.log('📦 [updatePartyMember] Merged character:', {
                                    memberId,
                                    hasLore: !!newCharacter.lore,
                                    hasEquipment: !!newCharacter.equipment,
                                    loreKeys: newCharacter.lore ? Object.keys(newCharacter.lore) : [],
                                    equipmentKeys: newCharacter.equipment ? Object.keys(newCharacter.equipment) : []
                                });
                                */

                                return {
                                    ...member,
                                    ...updates,
                                    character: newCharacter
                                };
                            }

                            return { ...member, ...updates };
                        }
                        return member;
                    });

                    return { partyMembers: updatedMembers };
                });

                // Only sync with multiplayer if this is NOT a network sync (to prevent infinite loops)
                if (!isFromSync) {
                    get().syncPartyUpdate('member_updated', { memberId, updates });
                }
            },

            setLeader: (newLeaderId, isFromSync = false) => {
                set({ leaderId: newLeaderId });

                // CRITICAL: Toggle isGMMode for ANY player who becomes/loses leadership
                // This gives the new leader GM-like UI capabilities
                const amILeader = newLeaderId === 'current-player';

                // Import gameStore dynamically to avoid circular dependency
                import('./gameStore').then(({ default: useGameStore }) => {
                    const gameStore = useGameStore.getState();
                    if (gameStore.isGMMode !== amILeader) {
                        gameStore.setGMMode(amILeader);
                        console.log(`🛠️ UI mode set to: ${amILeader ? 'LEADER (GM-like access)' : 'PLAYER (restricted)'}`);
                    }
                }).catch(err => console.error('Failed to update GM mode:', err));

                // Only sync with multiplayer if this is a local action, not a sync from server
                if (!isFromSync) {
                    // CRITICAL: Translate 'current-player' to actual socket ID before broadcasting
                    // Otherwise, other clients will incorrectly think 'current-player' refers to themselves
                    const gameStore = useGameStore.getState();
                    let leaderIdToSend = newLeaderId;

                    if (newLeaderId === 'current-player' && gameStore.multiplayerSocket?.id) {
                        leaderIdToSend = gameStore.multiplayerSocket.id;
                        console.log(`📤 Translating 'current-player' to socket ID: ${leaderIdToSend}`);
                    }

                    get().syncPartyUpdate('leadership_transferred', { leaderId: leaderIdToSend });
                }
            },

            // Invitation System
            sendPartyInvite: (targetPlayerName) => {
                const invite = {
                    id: uuidv4(),
                    targetPlayer: targetPlayerName,
                    sentAt: Date.now(),
                    status: 'pending'
                };

                set(state => ({
                    pendingInvites: [...(state.pendingInvites || []), invite]
                }));

                // Add chat notification
                const chatStore = useChatStore.getState();
                chatStore.addSocialNotification({
                    type: 'party_invite_sent',
                    target: targetPlayerName,
                    content: `Party invitation sent to ${targetPlayerName}`,
                    sender: { name: 'System', class: 'system', level: 0 }
                });
            },

            receivePartyInvite: (inviteData) => {
                const invite = {
                    id: uuidv4(),
                    fromPlayer: inviteData.fromPlayer,
                    partyName: inviteData.partyName,
                    receivedAt: Date.now(),
                    status: 'pending'
                };

                set(state => ({
                    receivedInvites: [...(state.receivedInvites || []), invite]
                }));

                // Add chat notification
                const chatStore = useChatStore.getState();
                chatStore.addSocialNotification({
                    type: 'party_invite_received',
                    sender: { name: inviteData.fromPlayer, class: 'unknown', level: 0 },
                    content: `${inviteData.fromPlayer} has invited you to join their party "${inviteData.partyName}"`
                });
            },

            acceptPartyInvite: (inviteId) => {
                const state = get();
                const invite = (state.receivedInvites || []).find(inv => inv.id === inviteId);

                if (invite) {
                    // Join the party (this would typically involve network communication)
                    set(state => ({
                        receivedInvites: (state.receivedInvites || []).filter(inv => inv.id !== inviteId)
                    }));
                }
            },

            declinePartyInvite: (inviteId) => {
                set(state => ({
                    receivedInvites: (state.receivedInvites || []).filter(inv => inv.id !== inviteId)
                }));
            },

            // Settings Management
            updatePartySettings: (settings) => {
                set(state => ({
                    partySettings: { ...state.partySettings, ...settings }
                }));
            },

            updateHUDSettings: (settings) => {
                set(state => ({
                    hudSettings: { ...state.hudSettings, ...settings }
                }));
            },

            // HUD Position Management
            setHUDPosition: (position) => {
                set(state => ({
                    hudSettings: { ...state.hudSettings, hudPosition: position }
                }));
            },

            // Member Position Management
            setMemberPosition: (memberId, position) => {
                set(state => ({
                    memberPositions: {
                        ...state.memberPositions,
                        [memberId]: position
                    }
                }));
            },

            getMemberPosition: (memberId) => {
                const state = get();
                return state.memberPositions[memberId] || null;
            },

            // Utility Functions
            getPartyMember: (memberId) => {
                const state = get();
                return state.partyMembers.find(member => member.id === memberId);
            },

            // Removed: Complex party leadership - Room creator is always GM

            // Removed: Complex leadership transfer - Room creator is always GM

            getPartySize: () => {
                const state = get();
                return state.partyMembers.length;
            },

            // Multiplayer Synchronization
            syncPartyUpdate: (updateType, data) => {
                const gameStore = useGameStore.getState();
                if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                    // CRITICAL: Include playerId so receiving clients can identify the sender
                    const socketId = gameStore.multiplayerSocket.id;
                    gameStore.multiplayerSocket.emit('party_update', {
                        type: updateType,
                        data: data,
                        playerId: socketId,
                        timestamp: Date.now()
                    });
                    // console.log(`📤 Party update sent: ${updateType}`, data);
                }
            },

            setMultiplayerSocket: (socket) => {
                set({ multiplayerSocket: socket });
            },

            clearMultiplayerSocket: () => {
                set({ multiplayerSocket: null });
            },

            // Reset store to initial state
            resetStore: () => {
                set({ ...initialState });
            }
        }),
        {
            name: 'party-store',
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    return JSON.parse(str);
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => localStorage.removeItem(name)
            }
        }
    )
);

export default usePartyStore;
