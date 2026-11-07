import { consumeSpellReceipt } from '../spellConsequenceService';
import { getStore } from '../../store/storeRegistry';
import { TYPE } from '../authoredCooldown';
jest.mock('../../store/storeRegistry', () => ({ getStore: jest.fn() }));
jest.mock('../actorConsequenceService', () => ({ roomResourceProjection: () => null, findActor: () => null }));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: () => null }));
jest.mock('../spellConsequenceCustody', () => {
  const box = { record: null };
  return { spellContext: () => ({ uid: 'u', roomId: 'r', current: () => true }), loadLatestSpell: () => box.record,
    retainLatestSpell: (_c, v) => { box.record = v; return v; }, __box: box };
});
const { __box: box } = jest.requireMock('../spellConsequenceCustody');
test('accepted HUD cooldown cast and duplicate receipt never start legacy slot timers; legacy P9 still does', () => {
  getStore.mockImplementation(name => name === 'gameStore' ? { getState: () => ({ multiplayerRoom: { id: 'r' } }) } : null);
  const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'p', instanceId: 'i', ownerUid: 'u', characterId: 'c' }, target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'f', instanceId: 'j' };
  const recorded = { capability: 'authored-immediate:v2', approvalId: 'a', kind: 'damage', spellName: 'Cooldown', sourceName: 'P', targetName: 'F', damageTypes: ['arcane'], roll: { mode: 'physical', dice: [{ faces: [3] }], constant: 0, total: 3 } };
  const result = { success: true, receipt: { version: 1, roomId: 'r', commandId: 'cmd', source, target, actors: [{ ref: source }, { ref: target }], authorization: { kind: 'owner-approval-gm', proposalId: 'a' }, adjudication: { definitionId: 'authored:definition', definitionVersionOrHash: 'authored-immediate:v2/hash', chosenResult: JSON.stringify(recorded), finalAmount: 3, adjustmentReason: '' } } };
  const listener = jest.fn(); window.addEventListener('mythrill:p9-spell-accepted', listener);
  try {
    box.record = { phase: 'awaiting', approval: { approvalId: 'a' }, origin: { producer: 'hud', slotIndex: 1 }, cooldown: { type: TYPE, value: 2 } };
    expect(consumeSpellReceipt(result)).not.toBeNull(); consumeSpellReceipt(result); expect(listener).not.toHaveBeenCalled(); expect(box.record.phase).toBe('accepted');
    box.record = { ...box.record, phase: 'awaiting', cooldown: { type: 'turn_based', value: 2 } }; consumeSpellReceipt(result); expect(listener).toHaveBeenCalledTimes(1);
  } finally { window.removeEventListener('mythrill:p9-spell-accepted', listener); }
});
