/** Attribute revalidation on the owner's strike client: a server close with `owner_reapproval_required` settles the
 * retained approval (nothing spent) and returns the SAME recorded faces as a draft for an explicit reapproval.
 * Nothing is rerolled and nothing is resubmitted automatically. */
import { registerWeaponStrikeHandlers, loadStrikeDraft, restoreStrikeCustody, useWeaponStrikeStore } from '../weaponStrikeService';
import { requestActorEvent } from '../actorConsequenceService';
import useGameStore from '../../store/gameStore';
import { registerStore } from '../../store/storeRegistry';

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
const roll = { mode: 'physical', faces: [5] }, proficiencyRoll = { mode: 'physical', faces: [3] };
const approval = { approvalId: 'a1', source: sourceRef, target: { kind: 'creature', tokenId: 'x' }, roll,
  weapon: { slot: 'ranged', itemId: 'bow', weaponType: 'bow', die: 8, name: 'Short Bow', attribute: 'agility', score: 14, modifier: 2 }, proficiency: { die: 8, roll: proficiencyRoll } };

function socket() {
  const handlers = {};
  return { handlers, on: (event, fn) => { handlers[event] = fn; }, off: jest.fn() };
}

beforeEach(() => {
  registerStore('gameStore', useGameStore);
  useGameStore.setState({ multiplayerRoom: { id: 'r1' }, isGMMode: false });
  box.record = { owner: { phase: 'awaiting', approval, sent: true, actionId: 'ranged_standard_attack' }, gm: {}, draft: null };
  requestActorEvent.mockReset();
});

test('owner_reapproval_required closes the owner approval and returns the recorded faces as a draft, without resubmitting', () => {
  const s = socket(); registerWeaponStrikeHandlers({ socket: s });
  s.handlers.actor_strike_closed({ roomId: 'r1', approvalId: 'a1', code: 'owner_reapproval_required' });
  expect(box.record.owner.phase).toBe('reapproval');
  expect(loadStrikeDraft()).toMatchObject({ roll, proficiencyRoll });
  expect(requestActorEvent).not.toHaveBeenCalled();
  restoreStrikeCustody();
  expect(useWeaponStrikeStore.getState().ownerStatus.message).toMatch(/attribute changes on the table changed/);
});

test('another approval\'s close or an unrelated code leaves the retained strike untouched', () => {
  const s = socket(); registerWeaponStrikeHandlers({ socket: s });
  s.handlers.actor_strike_closed({ roomId: 'r1', approvalId: 'other', code: 'owner_reapproval_required' });
  s.handlers.actor_strike_closed({ roomId: 'r1', approvalId: 'a1', code: 'capacity' });
  expect(box.record.owner.phase).toBe('awaiting'); expect(box.record.draft).toBeNull();
});
