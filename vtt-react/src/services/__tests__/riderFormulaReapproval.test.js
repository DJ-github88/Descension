import { reapproveSpell } from '../spellConsequenceService';
import { supportSpell, buildApproval, recordRoll } from '../spellConsequence';
import { getStore } from '../../store/storeRegistry';
import { refreshActorSnapshot, requestActorEvent, roomResourceProjection, findActor, refOf } from '../actorConsequenceService';
import { readScaledFormula, readFormula, EFFECT_CAPABILITY } from '../authoredAbility';
jest.mock('../spellConsequenceCustody', () => {
  const actual = jest.requireActual('../spellConsequenceCustody'), box = { record: null };
  return { unresolvedSpell: actual.unresolvedSpell, spellContext: () => ({ uid: 'u', roomId: 'r', current: () => true }),
    loadLatestSpell: () => box.record, retainLatestSpell: (_ctx, v) => { box.record = { ...v, custody: 'Device retained' }; return box.record; }, __box: box };
});
jest.mock('../actorConsequenceService', () => ({ refOf: jest.fn(), findActor: jest.fn(), inSharedRoom: () => true, refreshActorSnapshot: jest.fn(), requestActorEvent: jest.fn(), roomResourceProjection: jest.fn() }));
jest.mock('../spellConsequence', () => ({ ...jest.requireActual('../spellConsequence'), supportSpell: jest.fn(), buildApproval: jest.fn() }));
jest.mock('../../store/storeRegistry', () => ({ getStore: jest.fn() }));
jest.mock('../acceptedResultFeed', () => ({ chatLineFor: (_r, line) => line }));
const { __box: box } = jest.requireMock('../spellConsequenceCustody');
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i', ownerUid: 'u', characterId: 'c' };
const terms = f => ({ direct: { kind: 'damage', formula: f, damageTypes: ['ember'] }, condition: { kind: 'movement', feet: -10, label: 'Mired' }, timing: {} });
let token, stats;
beforeEach(() => {
  jest.clearAllMocks(); box.record = null; global.crypto = { randomUUID: () => 'new' };
  stats = { intelligence: 17 };
  token = { mapId: 'm', character: { id: 'c', stats }, state: { actorContract: { ...source, primary: true, revision: 1 }, conditions: [] } };
  getStore.mockImplementation(name => ({ getState: () => name === 'characterStore' ? { currentCharacterId: 'c' } : name === 'characterTokenStore' ? { characterTokens: [token] } : name === 'creatureStore' ? { creatureTokens: [] } : {} }));
  roomResourceProjection.mockImplementation(() => ({ roomActorProjection: { ref: source } }));
  findActor.mockImplementation(() => token); refOf.mockImplementation(() => source);
  buildApproval.mockImplementation(({ support, roll }) => ({ source, spell: { kind: 'effect' }, roll, rollAttributes: support.rollAttributes }));
  requestActorEvent.mockResolvedValue({ success: false, code: 'awaiting_gm', contentHash: 'h' });
  refreshActorSnapshot.mockResolvedValue({ success: true, roomId: 'r', actionEpoch: 'e', commitSequence: 0 });
});
// Formula riders: the M5 composition reapproval path (retained immediate faces, fresh attested score) serves a movement rider bundle too;
// a plain-dice rider bundle keeps its existing withdraw-and-approve-again path.
test('formula rider reapproval revalues the retained immediate faces with the fresh attested score', async () => {
  const f = '2d6 + intelligence/3';
  supportSpell.mockImplementation(() => ({ supported: true, kind: 'effect', payment: { affordable: true, classPayment: null }, effectTerms: terms(f), reading: readScaledFormula(f, stats), rollAttributes: { intelligence: stats.intelligence } }));
  const oldRoll = recordRoll('physical', readScaledFormula(f, { intelligence: 14 }), [[5, 2]]);
  box.record = { phase: 'reapproval', approval: { source, spell: { kind: 'effect', definitionId: 'authored:x:1:h', definitionHash: `${EFFECT_CAPABILITY}/${'a'.repeat(64)}` }, effectTerms: terms(f), roll: oldRoll, rollAttributes: { intelligence: 14 } } };
  await reapproveSpell();
  const sent = requestActorEvent.mock.calls[0]?.[1];

  expect(sent.roll.dice[0].faces).toEqual([5, 2]); expect(sent.roll.constant).toBe(5); expect(sent.roll.total).toBe(12); expect(sent.rollAttributes).toEqual({ intelligence: 17 });
});
test('plain-dice rider reapproval still withdraws and sends nothing', async () => {
  const f = '1d6+2';
  box.record = { phase: 'reapproval', approval: { source, spell: { kind: 'effect', definitionId: 'authored:x:1:h', definitionHash: `${EFFECT_CAPABILITY}/${'a'.repeat(64)}` }, effectTerms: terms(f), roll: recordRoll('physical', readFormula(f), [[3]]) } };
  await reapproveSpell();
  expect(requestActorEvent).not.toHaveBeenCalled(); expect(box.record.phase).toBe('withdrawn');
});
