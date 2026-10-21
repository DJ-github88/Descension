import { create } from 'zustand';
import { registerStore } from '../../store/storeRegistry';
import useConditionStore from '../../store/conditionStore';
import { makeDefendingRecord, makeStunnedRecord } from '../sharedConditionProfile';
import { routeTokenState } from '../actorConsequenceService';
jest.mock('../../store/gameStore', () => ({ __esModule: true, default: { getState: () => ({}) } }));
jest.mock('../inquisitorAssistanceService', () => ({ getAssistanceDecisionForTarget: () => ({}) }));
jest.mock('../actorConsequenceService', () => ({ inSharedRoom: () => true, routeTokenState: jest.fn(),
  findActor: () => require('../../store/storeRegistry').getStore('characterTokenStore').getState().characterTokens[0],
  refOf: token => token?.state?.actorContract }));
test('custom same-name buff preserves exact canonical Defending instead of replacing its mechanics', () => {
  global.crypto = { randomUUID: require('crypto').randomUUID };
  const ref = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i', ownerUid: 'u', characterId: 'c' };
  const defending = makeDefendingRecord(ref, crypto.randomUUID());
  registerStore('characterTokenStore', create(() => ({ characterTokens: [{ id: 'pc', state: { actorContract: ref, conditions: [defending] } }] })));
  useConditionStore.getState().addCondition('buff', { name: 'Defending', targetId: 'pc', durationType: 'manual' });
  expect(routeTokenState).toHaveBeenCalledWith('pc', { conditions: [defending, expect.objectContaining({ name: 'Defending' })] });
});
test('C2 custom same-name debuff preserves both independent canonical Stunned episodes', () => {
  global.crypto = { randomUUID: require('crypto').randomUUID };
  const ref = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i', ownerUid: 'u', characterId: 'c' };
  const first = makeStunnedRecord(ref, crypto.randomUUID(), { sourceOccurrence: 'critical-1', timing: 'critical-one-round' });
  const second = makeStunnedRecord(ref, crypto.randomUUID(), { sourceOccurrence: 'bash-2', timing: 'shield-bash-target-end' });
  registerStore('characterTokenStore', create(() => ({ characterTokens: [{ id: 'pc', state: { actorContract: ref, conditions: [first, second] } }] })));
  useConditionStore.getState().addCondition('debuff', { name: 'Stunned', targetId: 'pc', durationType: 'manual' });
  expect(routeTokenState).toHaveBeenLastCalledWith('pc', { conditions: [first, second, expect.objectContaining({ name: 'Stunned' })] });
});
