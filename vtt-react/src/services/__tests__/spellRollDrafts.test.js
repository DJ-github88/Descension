/** P12C-B1 §2 (T5–T7): P9 spell roll drafts never allow a second roll before approval. */
import { saveSpellDraft, loadSpellDraft, loadDiscardedSpellDrafts, discardSpellDraft, withdrawSpellApproval, checkSpellApproval, spellDraftContext } from '../spellConsequenceService';
import { requestActorEvent } from '../actorConsequenceService';

jest.mock('../spellConsequenceCustody', () => {
  const actual = jest.requireActual('../spellConsequenceCustody');
  const box = { record: null };
  const context = { uid: 'u1', roomId: 'r1', current: () => true };
  return {
    unresolvedSpell: actual.unresolvedSpell,
    spellContext: () => context,
    loadLatestSpell: () => box.record,
    retainLatestSpell: (_ctx, value) => { box.record = { ...JSON.parse(JSON.stringify(value)), custody: 'Device retained' }; return box.record; },
    __box: box
  };
});
jest.mock('../actorConsequenceService', () => ({
  refOf: jest.fn(), findActor: jest.fn(), inSharedRoom: () => true, refreshActorSnapshot: jest.fn(), prepareActorCommand: jest.fn(),
  submitPreparedActorCommand: jest.fn(), retryActorCommand: jest.fn(), requestActorEvent: jest.fn(), roomResourceProjection: jest.fn()
}));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: (_r, line) => line }));

const { __box: box } = jest.requireMock('../spellConsequenceCustody');
const sourceRef = { kind: 'character', roomId: 'r1', mapId: 'm1', tokenId: 't1', instanceId: 'i1', ownerUid: 'u1', characterId: 'c1' };
const ctx = spellDraftContext({ characterId: 'c1', sourceRef, spellId: 'spark' });
const roll = { mode: 'digital', dice: [{ faces: [4, 2] }] };
const approval = { approvalId: 'a1', roomId: 'r1', source: sourceRef, spell: { definitionId: 'spark', name: 'Spark' }, roll };

beforeEach(() => { box.record = null; requestActorEvent.mockReset(); });

test('T5: a spell draft survives reload; no second roll while an approval is pending', () => {
  saveSpellDraft({ context: ctx, label: 'Spark', roll, targetKey: 'creature:x' });
  expect(loadSpellDraft()).toMatchObject({ roll, targetKey: 'creature:x' });
  box.record = { phase: 'awaiting', approval, sent: true, custody: 'Device retained' };
  expect(() => saveSpellDraft({ context: ctx, label: 'Spark', roll: { mode: 'digital', dice: [{ faces: [6, 6] }] } })).toThrow(/pending/);
});

test('T6: a draft never moves to another spell; discard is explicit and listed', () => {
  saveSpellDraft({ context: ctx, label: 'Spark', roll });
  expect(() => saveSpellDraft({ context: { ...ctx, spellId: 'mend' }, label: 'Mend', roll })).toThrow(/another spell/);
  discardSpellDraft();
  expect(loadSpellDraft()).toBeNull();
  expect(loadDiscardedSpellDrafts()).toHaveLength(1);
});

test('T7: a withdrawn approval returns its roll as the draft', async() => {
  box.record = { phase: 'awaiting', approval, sent: true };
  requestActorEvent.mockResolvedValue({ success: true, code: 'withdrawn' });
  await withdrawSpellApproval();
  expect(box.record.phase).toBe('withdrawn');
  expect(loadSpellDraft()).toMatchObject({ roll, fromApproval: 'a1' });
});

test('a refused first submission returns its roll as the draft', async() => {
  box.record = { phase: 'prepared', approval, sent: false };
  requestActorEvent.mockResolvedValue({ success: false, code: 'insufficient_resources' });
  await checkSpellApproval();
  expect(box.record.phase).toBe('refused');
  expect(loadSpellDraft()).toMatchObject({ roll });
});
