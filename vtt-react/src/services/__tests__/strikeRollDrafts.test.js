/** P12C-B1 §2 (T5–T7): P12A strike roll drafts never allow a second roll before approval. */
import {
  saveStrikeDraft, loadStrikeDraft, loadDiscardedStrikeDrafts, discardStrikeDraft, withdrawStrikeApproval,
  checkStrikeApproval, reconcilableStrike, reconcileStrike, strikeDraftContext
} from '../weaponStrikeService';
import { requestActorEvent } from '../actorConsequenceService';

jest.mock('../weaponStrikeCustody', () => {
  const actual = jest.requireActual('../weaponStrikeCustody');
  const box = { record: null };
  const context = { uid: 'u1', roomId: 'r1', current: () => true };
  return {
    unresolvedStrike: actual.unresolvedStrike,
    strikeContext: () => context,
    loadStrikeCustody: () => box.record,
    retainStrikeCustody: (_ctx, patch) => {
      const previous = box.record;
      if (patch.owner && actual.unresolvedStrike(previous?.owner) && previous.owner.approval.approvalId !== patch.owner.approval?.approvalId) throw Error('Check, withdraw or reconcile the retained strike first.');
      box.record = JSON.parse(JSON.stringify({ owner: null, gm: {}, ...previous, ...patch }));
      return box.record;
    },
    __box: box
  };
});
jest.mock('../actorConsequenceService', () => ({
  findActor: jest.fn(), inSharedRoom: () => true, refreshActorSnapshot: jest.fn(), prepareActorCommand: jest.fn(),
  submitPreparedActorCommand: jest.fn(), requestActorEvent: jest.fn()
}));
jest.mock('../actorProjectionOrder', () => ({ captureActorDelivery: () => 1, currentActorDelivery: () => true }));
jest.mock('../spellConsequenceService', () => ({ ownerSource: jest.fn(() => ({ error: 'unused' })) }));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: (_r, line) => line }));

const { __box: box } = jest.requireMock('../weaponStrikeCustody');
const sourceRef = { kind: 'character', roomId: 'r1', mapId: 'm1', tokenId: 't1', instanceId: 'i1', ownerUid: 'u1', characterId: 'c1' };
const support = { supported: true, weapon: { slot: 'mainHand', itemId: 'sword', weaponType: 'blade', die: 8, name: 'Sword' }, proficiency: { die: 6 } };
const ctx = strikeDraftContext({ characterId: 'c1', sourceRef, actionId: 'mh_standard_attack', support });
const roll = { mode: 'digital', faces: [3] }, proficiencyRoll = { mode: 'digital', faces: [2] };
const approval = { approvalId: 'a1', source: sourceRef, target: { kind: 'creature', tokenId: 'x' }, roll, weapon: { ...support.weapon }, proficiency: { die: 6, roll: proficiencyRoll } };

beforeEach(() => { box.record = null; requestActorEvent.mockReset(); });

test('T5: a draft survives reload and no second roll is accepted while an approval is pending', () => {
  saveStrikeDraft({ context: ctx, label: 'Sword', roll, proficiencyRoll, targetKey: 'creature:m1:x' });
  expect(loadStrikeDraft()).toMatchObject({ roll, proficiencyRoll, targetKey: 'creature:m1:x' });
  box.record = { ...box.record, draft: null, owner: { phase: 'awaiting', approval, sent: true, actionId: 'mh_standard_attack' } };
  expect(() => saveStrikeDraft({ context: ctx, label: 'Sword', roll: { mode: 'digital', faces: [8] }, proficiencyRoll })).toThrow(/pending/);
  expect(loadStrikeDraft()).toBeNull();
});

test('T6: a draft never moves to another action; discard is explicit and listed', () => {
  saveStrikeDraft({ context: ctx, label: 'Sword', roll, proficiencyRoll });
  const other = { ...ctx, actionId: 'ranged_standard_attack' };
  expect(() => saveStrikeDraft({ context: other, label: 'Bow', roll: { mode: 'digital', faces: [7] } })).toThrow(/another action/);
  discardStrikeDraft();
  expect(loadStrikeDraft()).toBeNull();
  expect(loadDiscardedStrikeDrafts()).toHaveLength(1);
  expect(loadDiscardedStrikeDrafts()[0].roll).toEqual(roll);
});

test('T7: withdrawn rolls return as the draft and win over any other draft (which is listed)', async() => {
  box.record = { owner: { phase: 'awaiting', approval, sent: true, actionId: 'mh_standard_attack' }, gm: {},
    draft: { context: ctx, label: 'Sword', roll: { mode: 'digital', faces: [8] }, proficiencyRoll: { mode: 'digital', faces: [6] } } };
  requestActorEvent.mockResolvedValue({ success: true, code: 'withdrawn' });
  await withdrawStrikeApproval();
  expect(box.record.owner.phase).toBe('withdrawn');
  expect(loadStrikeDraft()).toMatchObject({ roll, proficiencyRoll, fromApproval: 'a1' });
  expect(loadDiscardedStrikeDrafts().map(d => d.roll.faces)).toEqual([[8]]);
});

test('a refused first submission returns its rolls as the draft', async() => {
  box.record = { owner: { phase: 'prepared', approval, sent: false, actionId: 'mh_standard_attack' }, gm: {} };
  requestActorEvent.mockResolvedValue({ success: false, code: 'insufficient_resources' });
  await checkStrikeApproval();
  expect(box.record.owner.phase).toBe('refused');
  expect(loadStrikeDraft()).toMatchObject({ roll, proficiencyRoll });
});

test('an approval awaiting the GM cannot be cleared by owner reconciliation', () => {
  box.record = { owner: { phase: 'awaiting', approval, sent: true, actionId: 'mh_standard_attack' }, gm: {} };
  expect(reconcilableStrike(box.record.owner)).toBe(false);
  reconcileStrike();
  expect(box.record.owner.phase).toBe('awaiting');
  expect(reconcilableStrike({ ...box.record.owner, phase: 'unknown' })).toBe(true);
});
