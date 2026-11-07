import { sendSpellApproval, reapproveSpell, useSpellConsequenceStore } from '../spellConsequenceService';
import { supportSpell, buildApproval, recordRoll } from '../spellConsequence';
import { getStore } from '../../store/storeRegistry';
import { refreshActorSnapshot, requestActorEvent, roomResourceProjection, findActor, refOf } from '../actorConsequenceService';
import { readHealthFormula, HEALTH_CAPABILITY } from '../authoredAbility';

jest.mock('../spellConsequenceCustody', () => {
  const actual = jest.requireActual('../spellConsequenceCustody'), box = { record: null };
  return { unresolvedSpell: actual.unresolvedSpell, spellContext: () => ({ uid: 'u', roomId: 'r', current: () => true }),
    loadLatestSpell: () => box.record, retainLatestSpell: (_ctx, v) => { box.record = { ...v, custody: 'Device retained' }; return box.record; }, __box: box };
});
jest.mock('../actorConsequenceService', () => ({ refOf: jest.fn(), findActor: jest.fn(), inSharedRoom: () => true,
  refreshActorSnapshot: jest.fn(), requestActorEvent: jest.fn(), roomResourceProjection: jest.fn() }));
jest.mock('../spellConsequence', () => ({ ...jest.requireActual('../spellConsequence'), supportSpell: jest.fn(), buildApproval: jest.fn() }));
jest.mock('../../store/storeRegistry', () => ({ getStore: jest.fn() }));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: (_r, line) => line }));
const { __box: box } = jest.requireMock('../spellConsequenceCustody');
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i', ownerUid: 'u', characterId: 'c' };
const spell = { definitionId: 'authored:test:1:hash', definitionHash: `${HEALTH_CAPABILITY}/${'a'.repeat(64)}`, name: 'Wound measure' };
let token;
beforeEach(() => {
  jest.clearAllMocks(); box.record = null;
  global.crypto = { randomUUID: () => 'new-approval' };
  token = { mapId: 'm', character: { id: 'c', health: { current: 19, max: 40 }, tempHealth: 9 }, state: { actorContract: { ...source, primary: true, revision: 1 }, conditions: [] } };
  getStore.mockImplementation(name => ({ getState: () => name === 'characterStore' ? { currentCharacterId: 'c' } : name === 'characterTokenStore' ? { characterTokens: [token] } : name === 'creatureStore' ? { creatureTokens: [] } : {} }));
  roomResourceProjection.mockImplementation(() => ({ roomActorProjection: { ref: source }, health: token.character.health }));
  findActor.mockImplementation(() => token); refOf.mockImplementation(() => source);
  supportSpell.mockImplementation(() => ({ supported: true, payment: { affordable: true, classPayment: null }, definitionId: spell.definitionId,
    definitionHash: spell.definitionHash, cooldown: { type: 'none', value: 0 },
    rollHealth: { ...token.character.health }, rollAttributes: {}, reading: readHealthFormula('1d8 + caster_missing_health/4', {}, token.character.health) }));
  buildApproval.mockImplementation(({ support, roll }) => ({ source, spell, roll, rollHealth: support.rollHealth }));
  requestActorEvent.mockResolvedValue({ success: false, code: 'awaiting_gm', contentHash: 'h' });
  refreshActorSnapshot.mockResolvedValue({ success: true, roomId: 'r', actionEpoch: 'e', commitSequence: 0 });
});
const faces = [[4]];
const roll = () => recordRoll('physical', supportSpell().reading, faces);

test.each(['hp', 'revision', 'projection'])('initial v3 approval refuses %s drift during refresh, retaining the draft for another explicit click', async kind => {
  const recorded = roll(); box.record = { draft: { roll: recorded } };
  let release; refreshActorSnapshot.mockImplementationOnce(() => new Promise(r => { release = r; }));
  const pending = sendSpellApproval({ spellId: spell.definitionId, targetRef: { kind: 'creature' }, roll: recorded });
  if (kind === 'hp') token.character.health.current = 3;
  if (kind === 'revision') token.state.actorContract.revision++;
  if (kind === 'projection') token.character.tempHealth++;
  release({ success: true, roomId: 'r', actionEpoch: 'e', commitSequence: 0 });
  await pending;
  expect(useSpellConsequenceStore.getState().ownerStatus.message).toMatch(/changed while refreshing/); expect(requestActorEvent).not.toHaveBeenCalled(); expect(buildApproval).not.toHaveBeenCalled();
  expect(box.record.draft.roll.dice[0].faces).toEqual([4]);
  await sendSpellApproval({ spellId: spell.definitionId, targetRef: { kind: 'creature' }, roll: roll() });
  expect(requestActorEvent).toHaveBeenCalledTimes(1); expect(requestActorEvent.mock.calls[0][1].roll.dice[0].faces).toEqual([4]);
});

test.each(['hp', 'revision', 'projection'])('v3 reapproval refuses %s drift during refresh; subsequent click binds refreshed inputs and original faces', async kind => {
  const old = { source, spell, roll: roll(), rollHealth: { current: 19, max: 40 } };
  box.record = { phase: 'reapproval', approval: old };
  let release; refreshActorSnapshot.mockImplementationOnce(() => new Promise(r => { release = r; }));
  const pending = reapproveSpell();
  if (kind === 'hp') token.character.health.current = 3;
  if (kind === 'revision') token.state.actorContract.revision++;
  if (kind === 'projection') token.character.tempHealth++;
  release({ success: true, roomId: 'r', actionEpoch: 'e', commitSequence: 0 });
  await pending;
  expect(useSpellConsequenceStore.getState().ownerStatus.phase).toBe('reapproval'); expect(requestActorEvent).not.toHaveBeenCalled(); expect(buildApproval).not.toHaveBeenCalled();
  expect(box.record.approval).toBe(old);
  await reapproveSpell(); expect(requestActorEvent).toHaveBeenCalledTimes(1);
  const approved = requestActorEvent.mock.calls[0][1];
  expect(approved.rollHealth).toEqual(token.character.health); expect(approved.roll.dice[0].faces).toEqual([4]);
  expect(approved.roll.total).toBe(kind === 'hp' ? 13 : 9);
});
