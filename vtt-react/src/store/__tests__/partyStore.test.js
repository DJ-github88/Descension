import usePartyStore from '../partyStore';
import { registerStore } from '../storeRegistry';
import usePresenceStore from '../presenceStore';

// Mock presence service to avoid Firebase dependency
jest.mock('../../services/firebase/presenceService', () => ({
    updateUserPresence: jest.fn(),
    goOffline: jest.fn()
}));

describe('usePartyStore', () => {
    let mockSocket;
    let mockGameStore;
    let mockAuthStore;
    let mockCharacterStore;

    beforeEach(() => {
        // Reset Zustand store state before each test
        usePartyStore.setState({
            partyId: null,
            partyName: '',
            partyLeaderId: null,
            partyMembers: [],
            pendingPartyInvites: [],
            partySettings: {},
            currentParty: null
        });

        jest.clearAllMocks();
        jest.useFakeTimers();

        // Setup mock socket with once and off support
        mockSocket = {
            emit: jest.fn(),
            on: jest.fn(),
            once: jest.fn((event, cb) => {
                if (event === 'party_created') {
                    // Simulate server response on next tick
                    setTimeout(() => {
                        cb({
                            party: {
                                id: 'party-123',
                                name: 'Fellowship',
                                leaderId: 'user-gm',
                                members: [
                                    { id: 'current-player', userId: 'user-gm', name: 'GM Bob', isGM: true, isConnected: true }
                                ]
                            }
                        });
                    }, 0);
                }
            }),
            off: jest.fn(),
            connected: true
        };

        // Setup presenceStore state containing mock socket
        // Note: Set userId to 'user-self' so 'user-gm' in the test isn't filtered as self
        usePresenceStore.setState({
            socket: mockSocket,
            currentUserPresence: {
                userId: 'user-self',
                characterName: 'GM Bob',
                class: 'GM',
                level: 1
            }
        });

        // Setup other mock stores
        mockGameStore = {
            getState: jest.fn(() => ({
                currentPlayer: { id: 'user-self', name: 'GM Bob' },
                multiplayerSocket: mockSocket,
                isInMultiplayer: true
            }))
        };

        mockAuthStore = {
            getState: jest.fn(() => ({
                user: { uid: 'user-self', email: 'gm@test.com' }
            }))
        };

        mockCharacterStore = {
            getState: jest.fn(() => ({
                health: { current: 10, max: 20 },
                mana: { current: 5, max: 10 },
                actionPoints: { current: 3, max: 3 },
                class: 'Mage',
                level: 1
            }))
        };

        registerStore('gameStore', mockGameStore);
        registerStore('authStore', mockAuthStore);
        registerStore('characterStore', mockCharacterStore);
        registerStore('presenceStore', usePresenceStore);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('Party creation and disbanding', () => {
        it('creates a party and emits create_party socket event', async () => {
            const createPromise = usePartyStore.getState().createParty('Fellowship');
            
            // Trigger the setTimeout in mockSocket.once
            jest.runAllTimers();

            const resultParty = await createPromise;

            expect(resultParty.name).toBe('Fellowship');
            expect(usePartyStore.getState().currentParty.name).toBe('Fellowship');
            expect(usePartyStore.getState().currentParty.id).toBe('party-123');

            expect(mockSocket.emit).toHaveBeenCalledWith('create_party', expect.objectContaining({
                partyName: 'Fellowship'
            }));
        });

        it('disbands the party and emits disband_party if leader disbands', () => {
            usePartyStore.setState({
                partyId: 'party-1',
                partyName: 'Fellowship',
                partyLeaderId: 'user-gm',
                currentParty: { id: 'party-1', name: 'Fellowship' },
                partyMembers: [{ id: 'user-gm', name: 'GM Bob', isLeader: true }]
            });

            usePartyStore.getState().disbandParty();

            expect(mockSocket.emit).toHaveBeenCalledWith('disband_party', { partyId: 'party-1' });
        });
    });

    describe('Party Member updates', () => {
        it('adds and removes party members', () => {
            usePartyStore.setState({
                partyId: 'party-1',
                partyMembers: [{ id: 'user-gm', name: 'GM Bob', isLeader: true }]
            });

            const newMember = { id: 'user-p2', name: 'Legolas', isLeader: false };
            usePartyStore.getState().addPartyMember(newMember);

            expect(usePartyStore.getState().partyMembers).toHaveLength(2);
            expect(usePartyStore.getState().partyMembers[1].name).toBe('Legolas');

            usePartyStore.getState().removePartyMember('user-p2');
            expect(usePartyStore.getState().partyMembers).toHaveLength(1);
            expect(usePartyStore.getState().partyMembers.find(m => m.id === 'user-p2')).toBeUndefined();
        });

        it('updates member data deeply', () => {
            usePartyStore.setState({
                partyId: 'party-1',
                partyMembers: [
                    {
                        id: 'user-p2',
                        name: 'Legolas',
                        character: {
                            health: { current: 15, max: 30 }
                        }
                    }
                ]
            });

            usePartyStore.getState().updatePartyMember('user-p2', {
                character: {
                    health: { current: 25, max: 30 }
                }
            });

            const member = usePartyStore.getState().partyMembers.find(m => m.id === 'user-p2');
            expect(member.character.health.current).toBe(25);
        });
    });
});
