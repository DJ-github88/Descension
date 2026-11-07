import { consumeSpellReceipt, useSpellConsequenceStore } from '../spellConsequenceService';
import { spellReceipt } from '../spellConsequence';

jest.mock('../../store/storeRegistry', () => {
  const state = { uid: 'owner', room: 'r' };
  return { __state: state, getStore: name => ({ getState: () => name === 'characterStore' ? { currentCharacterId: 'c' }
    : name === 'gameStore' ? { multiplayerRoom: { id: state.room } } : {} }) };
});
jest.mock('../spellConsequenceCustody', () => {
  const box = { latest: null };
  return { __box: box, spellContext: () => { const s = jest.requireMock('../../store/storeRegistry').__state; return { uid: s.uid, roomId: s.room, current: () => true }; },
    loadLatestSpell: () => box.latest, retainLatestSpell: (_c, value) => { box.latest = value; return value; } };
});
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: () => null }));
const box = jest.requireMock('../spellConsequenceCustody').__box, state = jest.requireMock('../../store/storeRegistry').__state;
const target = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 't', instanceId: 'i', ownerUid: 'target-owner', characterId: 'target' };
const recorded = { capability: 'authored-effect:v1', approvalId: 'original', kind: 'effect', direct: null,
  condition: { kind: 'attribute', attribute: 'agility', amount: 2, label: 'Quickened' }, conditionInstanceId: 'original', expiryPolicy: 'gm-manual',
  resolution: { gmConfirmed: true, timing: { durationText: 'Until removed' } } };
const result = () => ({ success: true, receipt: { version: 1, roomId: 'r', commandId: 'command', checkpointRevision: null,
  authorization: { kind: 'owner-approval-gm', proposalId: 'original' }, target, actors: [{ ref: target }],
  adjudication: { definitionVersionOrHash: 'authored-effect:v1/undisclosed', finalAmount: 0, chosenResult: JSON.stringify(recorded) } } });
beforeEach(() => {
  state.uid = 'owner'; state.room = 'r';
  box.latest = { phase: 'awaiting', approval: { approvalId: 'original', source: { kind: 'character', ownerUid: 'owner', characterId: 'c' }, spell: { kind: 'effect' } } };
  useSpellConsequenceStore.setState({ ownerStatus: null, gmPending: {}, gmStatus: {} });
});
test('redacted PC effect receipt is recognized and completes only the exact retained source-owner approval; repeated receipt stays accepted', () => {
  expect(spellReceipt(result())).toMatchObject({ approvalId: 'original', recorded: { kind: 'effect' } });
  consumeSpellReceipt(result()); expect(box.latest.phase).toBe('accepted');
  expect(useSpellConsequenceStore.getState().ownerStatus.message).toMatch(/Quickened.*Agility \+2/);
  consumeSpellReceipt(result(), { historical: true }); expect(box.latest.phase).toBe('accepted');
  expect(box.latest.result.receipt.source).toBeUndefined();
});
test.each(['target-owner', 'observer'])('redacted receipt cannot transfer retained payment custody to %s', uid => {
  state.uid = uid; consumeSpellReceipt(result()); expect(box.latest.phase).toBe('awaiting');
  expect(useSpellConsequenceStore.getState().ownerStatus).toBeNull();
});
test('a different approval or room cannot settle the retained source approval', () => {
  box.latest.approval.approvalId = 'different'; consumeSpellReceipt(result()); expect(box.latest.phase).toBe('awaiting');
  state.room = 'other'; expect(consumeSpellReceipt(result())).toBeNull();
});
