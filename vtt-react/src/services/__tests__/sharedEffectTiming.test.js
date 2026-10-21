import { create } from 'zustand';
import { registerStore } from '../../store/storeRegistry';
import useConditionStore from '../../store/conditionStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCombatStore from '../../store/combatStore';
import { submitTurnBoundary } from '../sharedConditionService';
import { makeDefendingRecord, expiryLabel, canonical } from '../sharedConditionProfile';
import { positionKey, instanceKey } from '../sharedEffectTiming';
jest.mock('../sharedConditionService', () => ({ submitTurnBoundary: jest.fn(), useSharedConditionStore: { getState: () => ({ combat: { effectLifecycle: { version: 1 } } }) } }));
jest.mock('../inquisitorAssistanceService', () => ({ getAssistanceDecisionForTarget: () => ({}) }));
const ref = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i', ownerUid: 'u', characterId: 'c' };
let game;
beforeEach(() => {
  global.crypto = { randomUUID: require('crypto').randomUUID }; jest.clearAllMocks();
  game = create(() => ({ isInMultiplayer: true })); registerStore('gameStore', game);
});
test('C4 one timing label distinguishes exact tracked instance, corrected instance, retired roster and manual fallback', () => {
  const record = makeDefendingRecord(ref, crypto.randomUUID()), combat = { isActive: true, currentTurnIndex: 0, round: 1, turnOrder: [{ tokenId: 'pc', actorRef: ref }] };
  const id = crypto.randomUUID(); combat.effectLifecycle = { version: 1, id, sequence: 0, positionKey: positionKey(combat), schedules: {
    [instanceKey(ref, record.recordId)]: { combatId: id, recordId: record.recordId, ref, recordKey: canonical(record), dueSequence: 1, boundary: 'start' }
  } };
  expect(expiryLabel(record, combat)).toMatch(/Automatic.*start of your next turn/);
  expect(expiryLabel({ ...record, source: 'corrected' }, combat)).toMatch(/GM removes/);
  expect(expiryLabel(record, { ...combat, round: 2 })).toMatch(/GM removes/);
  expect(expiryLabel(record)).toMatch(/GM removes/);
});
test('C4 shared-room callbacks cannot expire records locally; the same cleanup still functions in sandbox', () => {
  const local = { id: 'expired', name: 'local', endTime: Date.now() - 1000, durationType: 'seconds', appliedAt: Date.now() - 2000, duration: 1 };
  useConditionStore.setState({ activeBuffs: [local], activeDebuffs: [] });
  useCreatureStore.setState({ creatureTokens: [{ id: 'probe', state: { conditions: [local] } }] });
  useCharacterTokenStore.setState({ characterTokens: [{ id: 'probe-pc', state: { conditions: [local] } }] });
  useConditionStore.getState().updateConditionTimers('buff'); useCreatureStore.getState().cleanupExpiredConditions(); useCharacterTokenStore.getState().cleanupExpiredConditions();
  expect(useConditionStore.getState().activeBuffs).toHaveLength(1); expect(useCreatureStore.getState().creatureTokens[0].state.conditions).toHaveLength(1); expect(useCharacterTokenStore.getState().characterTokens[0].state.conditions).toHaveLength(1);
  game.setState({ isInMultiplayer: false });
  useConditionStore.getState().updateConditionTimers('buff'); useCreatureStore.getState().cleanupExpiredConditions(); useCharacterTokenStore.getState().cleanupExpiredConditions();
  expect(useConditionStore.getState().activeBuffs).toHaveLength(0); expect(useCreatureStore.getState().creatureTokens[0].state.conditions).toHaveLength(0); expect(useCharacterTokenStore.getState().characterTokens[0].state.conditions).toHaveLength(0);
});
test('C4 ordinary shared Next Turn routes once to authentication without local index, AP, RNG, regen or callbacks', async() => {
  submitTurnBoundary.mockResolvedValue({ success: true });
  useCombatStore.setState({ isInCombat: true, currentTurnIndex: 0, round: 1, effectLifecycle: { version: 1 }, turnOrder: [{ tokenId: 'pc' }, { tokenId: 'foe' }] });
  const before = useCombatStore.getState(), random = jest.spyOn(Math, 'random');
  useCombatStore.getState().nextTurn(); await Promise.resolve(); await Promise.resolve();
  expect(useCombatStore.getState()).toBe(before); expect(submitTurnBoundary).toHaveBeenCalledWith('advance'); expect(submitTurnBoundary).toHaveBeenCalledTimes(1); expect(random).not.toHaveBeenCalled(); random.mockRestore();
});
