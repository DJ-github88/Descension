import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import useChatStore from './chatStore';

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
    memberPositions: {}
};

// Create the party store
const usePartyStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Party Management Actions
            createParty: (partyName = 'New Party', currentPlayerName = 'Current Player') => {
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
                    partyMembers: [
                        {
                            id: 'current-player',
                            name: currentPlayerName,
                            status: PARTY_STATUS.ONLINE,
                            joinedAt: Date.now(),
                            character: {
                                class: 'Unknown',
                                level: 1,
                                health: { current: 100, max: 100 },
                                mana: { current: 50, max: 50 },
                                actionPoints: { current: 3, max: 3 }
                            }
                        }
                    ]
                });
            },

            leaveParty: () => {
                set({
                    currentParty: null,
                    isInParty: false,
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

                const newMember = {
                    id: memberData.id || uuidv4(),
                    name: memberData.name,
                    status: PARTY_STATUS.ONLINE,
                    joinedAt: Date.now(),
                    character: memberData.character || {
                        class: 'Unknown',
                        level: 1,
                        health: { current: 100, max: 100 },
                        mana: { current: 50, max: 50 },
                        actionPoints: { current: 3, max: 3 }
                    }
                };

                // Add new member without changing leadership
                const updatedMembers = [...state.partyMembers, newMember];

                // Keep existing leadership structure
                set(state => ({
                    partyMembers: updatedMembers
                }));

                return true;
            },

            removePartyMember: (memberId) => {
                set(state => ({
                    partyMembers: state.partyMembers.filter(member => member.id !== memberId)
                }));

                // If current player is removed, they should be redirected (handled by MultiplayerApp)
                if (memberId === 'current-player') {
                    console.log('Current player removed from party - should redirect to homepage');
                }
            },

            updatePartyMember: (memberId, updates) => {
                set(state => {
                    const updatedMembers = state.partyMembers.map(member => {
                        if (member.id === memberId) {
                            const oldMember = member;
                            const newMember = { ...member, ...updates };

                            // Log the update for debugging
                            console.log('🔄 Party member updated:', {
                                memberId,
                                oldMember,
                                newMember,
                                updates
                            });

                            return newMember;
                        }
                        return member;
                    });

                    return { partyMembers: updatedMembers };
                });
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
                    pendingInvites: [...state.pendingInvites, invite]
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
                    receivedInvites: [...state.receivedInvites, invite]
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
                const invite = state.receivedInvites.find(inv => inv.id === inviteId);
                
                if (invite) {
                    // Join the party (this would typically involve network communication)
                    set(state => ({
                        receivedInvites: state.receivedInvites.filter(inv => inv.id !== inviteId)
                    }));
                }
            },

            declinePartyInvite: (inviteId) => {
                set(state => ({
                    receivedInvites: state.receivedInvites.filter(inv => inv.id !== inviteId)
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
