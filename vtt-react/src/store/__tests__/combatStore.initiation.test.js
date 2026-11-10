import useCombatStore from '../combatStore';
import { registerStore } from '../storeRegistry';

describe('combatStore: Normal Combat Initiation with PC and Placed Creatures', () => {
    let mockGameStore;
    let mockCharacterStore;
    let mockSocket;

    beforeEach(() => {
        useCombatStore.getState().forceResetCombat();
        useCombatStore.getState().resetMovementState();
        useCombatStore.getState().initializeStore();

        mockSocket = {
            connected: true,
            emit: jest.fn()
        };

        mockGameStore = {
            getState: jest.fn(() => ({
                isInMultiplayer: true,
                multiplayerSocket: mockSocket,
                multiplayerRoom: { id: 'room-1' },
                isGMMode: true
            }))
        };

        mockCharacterStore = {
            getState: jest.fn(() => ({
                name: 'Local Hero',
                stats: { agility: 10 },
                derivedStats: { moveSpeed: 30 }
            }))
        };

        registerStore('gameStore', mockGameStore);
        registerStore('characterStore', mockCharacterStore);
    });

    it('1. retains primary player character token alongside creature tokens and includes actorRefs', () => {
        const pcToken = {
            id: 'pc-1',
            mapId: 'map-1',
            ownerUserId: 'user-ilse',
            character: {
                id: 'ilse',
                name: 'Ilse',
                class: 'Arcanoneer',
                stats: { agility: 16 },
                actionPoints: { current: 3, max: 5 }
            },
            state: {
                actorContract: {
                    version: 1,
                    kind: 'character',
                    roomId: 'room-1',
                    mapId: 'map-1',
                    tokenId: 'pc-1',
                    ownerUid: 'user-ilse',
                    characterId: 'ilse',
                    primary: true
                }
            }
        };

        const creatureToken = {
            id: 'foe-1',
            creatureId: 'c-stalker',
            name: 'Grimmstalk',
            mapId: 'map-1',
            state: {
                currentActionPoints: 4,
                actorContract: {
                    version: 1,
                    kind: 'creature',
                    roomId: 'room-1',
                    mapId: 'map-1',
                    tokenId: 'foe-1'
                }
            }
        };

        const creatures = [
            {
                id: 'c-stalker',
                name: 'Grimmstalk',
                stats: { agility: 12, maxActionPoints: 4 }
            }
        ];

        // Start combat with PC and creature
        useCombatStore.getState().startCombat([pcToken, creatureToken], creatures);

        const state = useCombatStore.getState();
        expect(state.isInCombat).toBe(true);
        expect(state.turnOrder.length).toBe(2);

        const pcCombatant = state.turnOrder.find(c => c.tokenId === 'pc-1');
        expect(pcCombatant).toBeDefined();
        expect(pcCombatant.isCharacterToken).toBe(true);
        expect(pcCombatant.name).toBe('Ilse');
        expect(pcCombatant.actorRef).toEqual({
            kind: 'character',
            roomId: 'room-1',
            mapId: 'map-1',
            tokenId: 'pc-1',
            ownerUid: 'user-ilse',
            characterId: 'ilse'
        });

        const foeCombatant = state.turnOrder.find(c => c.tokenId === 'foe-1');
        expect(foeCombatant).toBeDefined();
        expect(foeCombatant.isCharacterToken).toBe(false);
        expect(foeCombatant.name).toBe('Grimmstalk');
        expect(foeCombatant.actorRef).toEqual({
            kind: 'creature',
            roomId: 'room-1',
            mapId: 'map-1',
            tokenId: 'foe-1'
        });

        expect(mockSocket.emit).toHaveBeenCalledWith('combat_started', expect.objectContaining({
            roomId: 'room-1',
            round: 1,
            currentTurnIndex: 0,
            turnOrder: expect.any(Array)
        }));
    });

    it('2. respects custom manual initiative when supplied', () => {
        const pcToken = {
            id: 'pc-1',
            ownerUserId: 'user-ilse',
            character: { id: 'ilse', name: 'Ilse', stats: { agility: 14 } },
            state: { actorContract: { version: 1, kind: 'character', primary: true } }
        };

        const foeToken = {
            id: 'foe-1',
            creatureId: 'c-1',
            state: { actorContract: { version: 1, kind: 'creature' } }
        };

        const creatures = [{ id: 'c-1', name: 'Beast', stats: { agility: 10 } }];

        useCombatStore.getState().startCombat(
            [pcToken, foeToken],
            creatures,
            null,
            { 'pc-1': 25, 'foe-1': 5 } // Custom initiatives
        );

        const state = useCombatStore.getState();
        expect(state.turnOrder[0].tokenId).toBe('pc-1');
        expect(state.turnOrder[0].initiative).toBe(25);
        expect(state.turnOrder[1].tokenId).toBe('foe-1');
        expect(state.turnOrder[1].initiative).toBe(5);
    });
});
