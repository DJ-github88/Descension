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

// Party roles
export const PARTY_ROLES = {
    LEADER: 'leader',
    MEMBER: 'member',
    ASSISTANT: 'assistant'
};

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
                    leaderId: 'current-player', // This would be the current player's ID
                    maxMembers: 6,
                    isPublic: false
                };

                // Maelis character data
                const maelisCharacterData = {
                    id: 'maelis-party-member',
                    name: 'Maelis',
                    role: PARTY_ROLES.MEMBER,
                    status: PARTY_STATUS.ONLINE,
                    joinedAt: Date.now(),
                    character: {
                        // Basic Info
                        name: 'Maelis',
                        race: 'Half-Elf',
                        class: 'Minstrel',
                        level: 3,
                        alignment: 'Chaotic Good',
                        exhaustionLevel: 0,

                        // Resources
                        health: { current: 42, max: 45 },
                        mana: { current: 65, max: 70 },
                        actionPoints: { current: 4, max: 4 },

                        // Base Stats
                        stats: {
                            constitution: 12,
                            strength: 8,
                            agility: 16,
                            intelligence: 14,
                            spirit: 13,
                            charisma: 18
                        },

                        // Equipment
                        equipment: {
                            head: {
                                name: "Feathered Bard's Cap",
                                icon: "https://wow.zamimg.com/images/wow/icons/large/inv_helmet_cloth_raidmage_q_01.jpg",
                                rarity: "uncommon",
                                stats: { charisma: 2, spirit: 1 },
                                description: "A stylish cap adorned with colorful feathers that enhance the wearer's presence."
                            },
                            chest: {
                                name: "Melodic Vest",
                                icon: "https://wow.zamimg.com/images/wow/icons/large/inv_chest_cloth_raidmage_q_01.jpg",
                                rarity: "uncommon",
                                stats: { charisma: 3, constitution: 1 },
                                description: "A finely crafted vest that resonates with musical energy."
                            },
                            legs: {
                                name: "Traveler's Leggings",
                                icon: "https://wow.zamimg.com/images/wow/icons/large/inv_pants_cloth_raidmage_q_01.jpg",
                                rarity: "common",
                                stats: { agility: 2 },
                                description: "Comfortable leggings perfect for long journeys."
                            },
                            feet: {
                                name: "Silent Step Boots",
                                icon: "https://wow.zamimg.com/images/wow/icons/large/inv_boots_cloth_raidmage_q_01.jpg",
                                rarity: "uncommon",
                                stats: { agility: 2, spirit: 1 },
                                description: "Soft-soled boots that muffle the wearer's footsteps."
                            },
                            mainHand: {
                                name: "Enchanted Lute",
                                icon: "https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg",
                                rarity: "rare",
                                stats: { charisma: 4, spirit: 2 },
                                description: "A masterfully crafted lute imbued with magical properties that amplify the user's musical abilities."
                            },
                            offHand: {
                                name: "Songbook of Ancient Melodies",
                                icon: "https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_07.jpg",
                                rarity: "uncommon",
                                stats: { intelligence: 2, spirit: 2 },
                                description: "A collection of ancient songs and musical techniques."
                            },
                            neck: {
                                name: "Pendant of Harmony",
                                icon: "https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_necklace_ahnqiraj_02.jpg",
                                rarity: "uncommon",
                                stats: { charisma: 2, spirit: 1 },
                                description: "A beautiful pendant that helps maintain musical harmony."
                            },
                            ring1: {
                                name: "Ring of Melodic Focus",
                                icon: "https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_ahnqiraj_02.jpg",
                                rarity: "uncommon",
                                stats: { charisma: 1, intelligence: 1 },
                                description: "Helps the wearer maintain concentration while performing."
                            },
                            ring2: {
                                name: "Band of Swift Fingers",
                                icon: "https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_ahnqiraj_01.jpg",
                                rarity: "common",
                                stats: { agility: 2 },
                                description: "Enhances dexterity for intricate musical performances."
                            }
                        },

                        // Lore Information
                        lore: {
                            background: "Folk Hero - Maelis grew up in a small village where she became known for her incredible musical talents and her ability to inspire hope in others during dark times.",
                            personalityTraits: "Maelis is naturally charismatic and optimistic, always looking for the bright side of any situation. She has an infectious laugh and loves to tell stories through song. She's also quite curious and tends to ask lots of questions about everything she encounters.",
                            ideals: "Music has the power to heal hearts, unite people, and bring hope to the darkest of times. Everyone deserves to hear beauty in their lives, regardless of their station.",
                            bonds: "Her village was saved from a terrible plague through her healing songs, and she feels responsible for protecting those who cannot protect themselves. She carries her grandmother's lute, which was passed down through generations of musicians.",
                            flaws: "Sometimes gets so caught up in the moment that she doesn't think through the consequences of her actions. Can be overly trusting of strangers, especially if they appreciate music.",
                            appearance: "Maelis is a graceful half-elf with auburn hair that she often braids with small bells and ribbons. Her eyes are a warm amber color that seems to sparkle when she performs. She's of average height but carries herself with the confidence of someone who has performed before crowds. She typically wears colorful, flowing clothes that move beautifully when she dances.",
                            backstory: "Born to a human mother and elven father in a small farming village, Maelis discovered her musical gifts at a young age. When a mysterious plague threatened to destroy her community, she found that her songs could actually heal the sick and lift the spirits of the dying. Word of her abilities spread, and she began traveling from town to town, using her music to help wherever she could. She joined the party after hearing tales of their heroic deeds, believing that together they could bring hope to even more people.",
                            goals: "To master the ancient songs of healing and inspiration that her grandmother spoke of in old stories. She also dreams of establishing a school where others can learn to use music for good.",
                            fears: "Losing her voice or her ability to play music. She's also terrified of being unable to help someone in need when her music could make the difference.",
                            allies: "The villagers of Millbrook (her hometown), various traveling musicians and bards she's met on the road, and a network of healers who appreciate her unique abilities.",
                            enemies: "A corrupt noble who tried to force her to perform exclusively for him and his court, and a rival bard who believes that music should only be for entertainment, not healing.",
                            organizations: "Informal member of the Traveling Minstrels Guild, and has connections with various temples that appreciate her healing abilities.",
                            notes: "Always carries a small pouch of flower petals that she throws during particularly joyful performances. Has a habit of humming while thinking. Knows an impressive number of drinking songs despite rarely drinking herself.",
                            characterImage: "https://i.imgur.com/placeholder-maelis.jpg"
                        },

                        // Skills (simplified for now)
                        skillProgress: {
                            'performance': { level: 4, experience: 850 },
                            'healing': { level: 3, experience: 600 },
                            'persuasion': { level: 3, experience: 550 },
                            'insight': { level: 2, experience: 300 },
                            'history': { level: 2, experience: 250 }
                        }
                    }
                };

                set({
                    currentParty: newParty,
                    isInParty: true,
                    partyMembers: [
                        {
                            id: 'current-player',
                            name: currentPlayerName, // Use actual character name
                            role: PARTY_ROLES.LEADER,
                            status: PARTY_STATUS.ONLINE,
                            joinedAt: Date.now(),
                            character: {
                                class: 'Pyrofiend',
                                level: 1,
                                health: { current: 100, max: 100 },
                                mana: { current: 50, max: 50 },
                                actionPoints: { current: 3, max: 3 }
                            }
                        }
                        // Remove hardcoded placeholder member for multiplayer
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
                    role: PARTY_ROLES.MEMBER,
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

            isPartyLeader: (memberId = 'current-player') => {
                const state = get();
                return state.currentParty?.leaderId === memberId;
            },

            // Pass leadership to another member
            passLeadership: (newLeaderId) => {
                const state = get();

                // Only current leader can pass leadership
                if (state.currentParty?.leaderId !== 'current-player') {
                    return false;
                }

                // Check if the new leader is a valid party member
                const newLeader = state.partyMembers.find(member => member.id === newLeaderId);
                if (!newLeader) {
                    return false;
                }

                set(state => ({
                    currentParty: {
                        ...state.currentParty,
                        leaderId: newLeaderId
                    },
                    partyMembers: state.partyMembers.map(member => ({
                        ...member,
                        role: member.id === newLeaderId ? PARTY_ROLES.LEADER :
                              member.id === 'current-player' ? PARTY_ROLES.MEMBER :
                              member.role
                    }))
                }));

                // Update GM mode based on new leadership
                try {
                    import('../store/gameStore').then(({ default: useGameStore }) => {
                        const gameStore = useGameStore.getState();
                        const isNewLeaderCurrentPlayer = newLeaderId === 'current-player';
                        gameStore.setGMMode(isNewLeaderCurrentPlayer);
                        console.log(`🎖️ Leadership transferred to ${newLeader.name}. GM mode: ${isNewLeaderCurrentPlayer}`);
                    });
                } catch (error) {
                    console.error('Failed to update GM mode after leadership transfer:', error);
                }

                return true;
            },

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
