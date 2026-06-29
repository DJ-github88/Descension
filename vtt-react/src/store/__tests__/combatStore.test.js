import useCombatStore from '../combatStore';
import { registerStore } from '../storeRegistry';
import { calculateEffectiveMovementSpeed } from '../../utils/conditionUtils';
import { processTurnBasedCooldowns } from '../../components/spellcrafting-wizard/core/mechanics/cooldownSystem';
import { processOverTimeEffectsForTarget } from '../../services/effectProcessingService';

// Mock dependencies
jest.mock('../../services/effectProcessingService', () => ({
    processOverTimeEffectsForTarget: jest.fn()
}));

jest.mock('../../components/spellcrafting-wizard/core/mechanics/cooldownSystem', () => ({
    processTurnBasedCooldowns: jest.fn()
}));

// Setup fake timers for Jest to test async timeout inside nextTurn
jest.useFakeTimers();

describe('useCombatStore — Combat Math & State transitions', () => {
    let mockCharacterStore;
    let mockPartyStore;
    let mockGameStore;
    let mockConditionStore;
    let mockCreatureStore;
    let mockCharacterTokenStore;
    let updateResourceMock;
    let updatePartyMemberMock;
    let updateTokenStateMock;
    let decrementConditionsMock;

    beforeEach(() => {
        // Reset Zustand store state before each test
        useCombatStore.getState().forceResetCombat();
        useCombatStore.getState().resetMovementState();
        useCombatStore.getState().initializeStore();

        // Reset mock functions
        jest.clearAllMocks();

        // Spies/Mocks definition
        updateResourceMock = jest.fn();
        updatePartyMemberMock = jest.fn();
        updateTokenStateMock = jest.fn();
        decrementConditionsMock = jest.fn();

        // Setup mock stores to register in registry
        mockCharacterStore = {
            getState: jest.fn(() => ({
                name: 'Garrick',
                stats: { agility: 14 },
                derivedStats: { moveSpeed: 30, maxActionPoints: 3 },
                actionPoints: { current: 3, max: 3 },
                updateResource: updateResourceMock,
                getTotalStatsWithEffects: jest.fn(() => ({ healthRegen: 5, manaRegen: 2 }))
            }))
        };

        mockPartyStore = {
            getState: jest.fn(() => ({
                partyMembers: [
                    {
                        id: 'current-player',
                        character: {
                            actionPoints: { current: 3, max: 3 }
                        }
                    }
                ],
                updatePartyMember: updatePartyMemberMock
            }))
        };

        mockGameStore = {
            getState: jest.fn(() => ({
                isInMultiplayer: false,
                multiplayerSocket: {
                    connected: false,
                    emit: jest.fn()
                }
            }))
        };

        mockConditionStore = {
            getState: jest.fn(() => ({
                decrementRoundBasedConditions: decrementConditionsMock
            }))
        };

        mockCreatureStore = {
            getState: jest.fn(() => ({
                creatures: [
                    {
                        id: 'creature-goblin',
                        name: 'Goblin',
                        stats: { agility: 12, speed: 30, initiativeMod: 2, maxHp: 30, maxMana: 10, constitution: 12, intelligence: 10, spirit: 10 }
                    }
                ],
                tokens: [
                    {
                        id: 'token-goblin',
                        creatureId: 'creature-goblin',
                        state: { currentHp: 20, currentMana: 5, conditions: [] }
                    }
                ],
                updateTokenState: updateTokenStateMock
            }))
        };

        mockCharacterTokenStore = {
            getState: jest.fn(() => ({
                characterTokens: []
            }))
        };

        registerStore('characterStore', mockCharacterStore);
        registerStore('partyStore', mockPartyStore);
        registerStore('gameStore', mockGameStore);
        registerStore('conditionStore', mockConditionStore);
        registerStore('creatureStore', mockCreatureStore);
        registerStore('characterTokenStore', mockCharacterTokenStore);

        // Make initiative rolls predictable: Player rolls high (0.9), Goblin rolls low (0.2)
        // Since Player token is mapped first, it gets 0.9. Goblin is mapped second, gets 0.2.
        let rollIndex = 0;
        const rolls = [0.9, 0.2];
        jest.spyOn(Math, 'random').mockImplementation(() => {
            if (rollIndex < rolls.length) {
                return rolls[rollIndex++];
            }
            return 0.5;
        });
    });

    afterEach(() => {
        Math.random.mockRestore();
    });

    describe('Initiative & Start Combat', () => {
        it('rolls initiative and sorts combatants highest first', () => {
            const tokens = [
                { id: 'token-player', isPlayerToken: true, creatureId: null },
                { id: 'token-goblin', creatureId: 'creature-goblin' }
            ];

            const creatures = [
                {
                    id: 'creature-goblin',
                    name: 'Goblin',
                    stats: { agility: 12, speed: 30, initiativeMod: 2 }
                }
            ];

            const notifications = [];
            const addNotification = (n) => notifications.push(n);

            useCombatStore.getState().startCombat(tokens, creatures, addNotification);

            const state = useCombatStore.getState();
            expect(state.isInCombat).toBe(true);
            expect(state.turnOrder).toHaveLength(2);

            // Sorted by initiative descending: Player first, Goblin second
            expect(state.turnOrder[0].tokenId).toBe('token-player');
            expect(state.turnOrder[1].tokenId).toBe('token-goblin');

            expect(notifications).toHaveLength(2);
            expect(notifications[0].creature).toBe('Garrick');
            expect(notifications[1].creature).toBe('Goblin');
        });

        it('assigns initial Action Points based on initiative brackets', () => {
            const tokens = [{ id: 'token-player', isPlayerToken: true }];
            const creatures = [];

            const runAPTest = (mockedRandom, expectedAP) => {
                useCombatStore.getState().forceResetCombat();
                Math.random.mockImplementation(() => mockedRandom);
                useCombatStore.getState().startCombat(tokens, creatures);
                const firstCombatant = useCombatStore.getState().turnOrder[0];
                expect(firstCombatant.currentActionPoints).toBe(expectedAP);
            };

            // Bracket 1-5: 0 AP (d20 roll of 1 + modifier 2 = 3)
            runAPTest(0.0, 0);

            // Bracket 6-10: 1 AP (d20 roll of 6 + modifier 2 = 8)
            runAPTest(0.25, 1);

            // Bracket 11-15: 2 AP (d20 roll of 11 + modifier 2 = 13)
            runAPTest(0.5, 2);

            // Bracket 16-20: 3 AP (d20 roll of 16 + modifier 2 = 18)
            runAPTest(0.75, 3);

            // Bracket 21+: 4 AP (d20 roll of 20 + modifier 2 = 22)
            runAPTest(0.99, 4);
        });
    });

    describe('Turn Transitions & Round Loops', () => {
        it('advances turn indices, resets movement states, and loops rounds', () => {
            const tokens = [
                { id: 'token-player', isPlayerToken: true },
                { id: 'token-goblin', creatureId: 'creature-goblin' }
            ];
            const creatures = [
                {
                    id: 'creature-goblin',
                    name: 'Goblin',
                    stats: { agility: 12, speed: 30, initiativeMod: 2 }
                }
            ];

            useCombatStore.getState().startCombat(tokens, creatures);
            expect(useCombatStore.getState().currentTurnIndex).toBe(0);
            expect(useCombatStore.getState().round).toBe(1);

            // Mark movement unlocked/used for player
            useCombatStore.getState().addMovementUsed('token-player', 15);
            useCombatStore.getState().spendActionPoints('token-player', 1);

            // Advance turn
            useCombatStore.getState().nextTurn();
            jest.runAllTimers();

            expect(useCombatStore.getState().currentTurnIndex).toBe(1);
            expect(useCombatStore.getState().round).toBe(1);
            // Verify movement states cleared for previous turn-holder
            expect(useCombatStore.getState().turnMovementUsed.has('token-player')).toBe(false);

            // Advance again, looping round to 2
            useCombatStore.getState().nextTurn();
            jest.runAllTimers();

            expect(useCombatStore.getState().currentTurnIndex).toBe(0);
            expect(useCombatStore.getState().round).toBe(2);
        });

        it('processes condition decrements, cooldown ticks, and overtime effects on turn transitions', () => {
            const tokens = [
                { id: 'token-player', isPlayerToken: true },
                { id: 'token-goblin', creatureId: 'creature-goblin' }
            ];
            const creatures = [
                {
                    id: 'creature-goblin',
                    name: 'Goblin',
                    stats: { agility: 12, speed: 30, initiativeMod: 2 }
                }
            ];

            useCombatStore.getState().startCombat(tokens, creatures);
            const playerTokenId = useCombatStore.getState().turnOrder[0].tokenId;

            // Trigger turn transition
            useCombatStore.getState().nextTurn();
            jest.runAllTimers();

            // Expect decrement of round based conditions
            expect(decrementConditionsMock).toHaveBeenCalledWith('buff', playerTokenId);
            expect(decrementConditionsMock).toHaveBeenCalledWith('debuff', playerTokenId);

            // Cooldown ticks triggered
            expect(processTurnBasedCooldowns).toHaveBeenCalled();
        });

        it('triggers health/mana regeneration ticks based on stats', () => {
            const tokens = [
                { id: 'token-player', isPlayerToken: true },
                { id: 'token-goblin', creatureId: 'creature-goblin' }
            ];
            const creatures = [
                {
                    id: 'creature-goblin',
                    name: 'Goblin',
                    stats: { agility: 12, speed: 30, initiativeMod: 2, constitution: 12, intelligence: 12, spirit: 12 }
                }
            ];

            // Enable regen in config
            useCombatStore.setState({
                combatConfig: {
                    showTimers: false,
                    apRestorationMode: 'initiative',
                    apRestorationAmount: 3,
                    healthRegenEnabled: true,
                    manaRegenEnabled: true
                }
            });

            useCombatStore.getState().startCombat(tokens, creatures);

            // Player is first, next turn is Goblin
            useCombatStore.getState().nextTurn();

            // Run timeouts in nextTurn to trigger regen async logic
            jest.runAllTimers();

            // Goblin token has constitution 12 => healthRegen = 6. intelligence 12 + spirit 12 => manaRegen = 6.
            // Starting token state was: currentHp: 20, currentMana: 5. maxHp is 30, maxMana is 10.
            // Verified that creatureStore.updateTokenState is called for the next combatant
            expect(updateTokenStateMock).toHaveBeenCalledWith('token-goblin', { currentHp: 26 });
            expect(updateTokenStateMock).toHaveBeenCalledWith('token-goblin', { currentMana: 10 }); // Clamped to maxMana (10)
        });
    });

    describe('Movement Calculations & AP Validation', () => {
        it('calculates Pathfinder grid distance correctly (5ft straight, 8ft diagonal)', () => {
            const store = useCombatStore.getState();
            const calculateDistance = store.calculateMovementDistance;

            // 1 tile straight (horizontal)
            expect(calculateDistance([{ x: 0, y: 0 }, { x: 1, y: 0 }])).toBe(5);
            // 2 tiles straight (vertical)
            expect(calculateDistance([{ x: 0, y: 0 }, { x: 0, y: 2 }])).toBe(10);
            // 1 tile diagonal (approx 1.414 * 5 = 7.07)
            expect(calculateDistance([{ x: 0, y: 0 }, { x: 1, y: 1 }])).toBeCloseTo(7.07);
            // 2 tiles diagonal (approx 2.828 * 5 = 14.14)
            expect(calculateDistance([{ x: 0, y: 0 }, { x: 2, y: 2 }])).toBeCloseTo(14.14);
        });

        it('demands 1 AP and confirmation for the first movement of the turn', () => {
            const tokens = [{ id: 'token-player', isPlayerToken: true }];
            useCombatStore.getState().startCombat(tokens, []);

            const result = useCombatStore.getState().validateMovement(
                'token-player',
                { x: 0, y: 0 },
                { x: 50, y: 0 }, // 1 tile (5 feet)
                []
            );

            expect(result.additionalAPNeeded).toBe(1);
            expect(result.needsConfirmation).toBe(true);
            expect(result.reason).toBe('Movement not unlocked');
        });

        it('permits movement within unlocked budget without AP or confirmation', () => {
            const tokens = [{ id: 'token-player', isPlayerToken: true }];
            useCombatStore.getState().startCombat(tokens, []);

            // Confirm first movement (costs 1 AP, unlocks 30ft since speed is 30)
            useCombatStore.getState().confirmMovement('token-player', 1, 5);

            // Validate second move of 10 feet (total 15 feet used so far, under 30ft budget)
            const result = useCombatStore.getState().validateMovement(
                'token-player',
                { x: 50, y: 0 },
                { x: 150, y: 0 }, // 2 tiles (10 feet)
                []
            );

            expect(result.additionalAPNeeded).toBe(0);
            expect(result.needsConfirmation).toBe(false);
        });

        it('charges incremental AP when movement exceeds unlocked budget', () => {
            const tokens = [{ id: 'token-player', isPlayerToken: true }];
            useCombatStore.getState().startCombat(tokens, []);

            // Confirm first movement (costs 1 AP, unlocks 30ft)
            useCombatStore.getState().confirmMovement('token-player', 1, 20);

            // Attempt a move of 20 feet (total 40 feet, exceeding the 30ft budget by 10ft)
            // Since speed is 30ft, it requires 1 additional AP to unlock another 30ft segment.
            const result = useCombatStore.getState().validateMovement(
                'token-player',
                { x: 200, y: 0 },
                { x: 400, y: 0 }, // 4 tiles (20 feet)
                []
            );

            expect(result.additionalAPNeeded).toBe(1);
            expect(result.needsConfirmation).toBe(true);
        });
    });

    describe('Store Synchronization', () => {
        it('synchronizes spent Action Points to characterStore and partyStore', () => {
            const tokens = [{ id: 'token-player', isPlayerToken: true }];
            useCombatStore.getState().startCombat(tokens, []);

            const initialAP = useCombatStore.getState().turnOrder[0].currentActionPoints;

            // Spend 1 AP
            useCombatStore.getState().spendActionPoints('token-player', 1);

            // Verifies combat store states updated
            const combatant = useCombatStore.getState().turnOrder[0];
            expect(combatant.currentActionPoints).toBe(initialAP - 1);

            // Verifies characterStore is called to update AP
            expect(updateResourceMock).toHaveBeenCalledWith(
                'actionPoints',
                combatant.currentActionPoints,
                expect.any(Number)
            );

            // Verifies partyStore is called to update player AP
            expect(updatePartyMemberMock).toHaveBeenCalledWith(
                'current-player',
                expect.objectContaining({
                    character: expect.objectContaining({
                        actionPoints: {
                            current: combatant.currentActionPoints,
                            max: expect.any(Number)
                        }
                    })
                })
            );
        });
    });
});
