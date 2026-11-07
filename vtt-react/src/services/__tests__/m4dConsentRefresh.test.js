import { sendSpellApproval, reapproveSpell, useSpellConsequenceStore } from '../spellConsequenceService';
import { supportSpell, buildApproval, recordRoll } from '../spellConsequence';
import { getStore } from '../../store/storeRegistry';
import { refreshActorSnapshot, requestActorEvent, roomResourceProjection, findActor, refOf } from '../actorConsequenceService';
import { readDeterministicFormula, DETERMINISTIC_CAPABILITY } from '../authoredAbility';
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
const spell = { definitionId: 'authored:test:1:hash', definitionHash: `${DETERMINISTIC_CAPABILITY}/${'a'.repeat(64)}`, name: 'Deterministic measure' };
let token;
beforeEach(() => {
  jest.clearAllMocks(); box.record = null; global.crypto = { randomUUID: () => 'new-approval' };
  token = { mapId: 'm', character: { id: 'c', stats: { intelligence: 19 }, health: { current: 19, max: 40 }, tempHealth: 9 }, state: { actorContract: { ...source, primary: true, revision: 1 }, conditions: [] } };
  getStore.mockImplementation(name => ({ getState: () => name === 'characterStore' ? { currentCharacterId: 'c' } : name === 'characterTokenStore' ? { characterTokens: [token] } : name === 'creatureStore' ? { creatureTokens: [] } : {} }));
  roomResourceProjection.mockImplementation(() => ({ roomActorProjection: { ref: source }, health: token.character.health }));
  findActor.mockImplementation(() => token); refOf.mockImplementation(() => source);
  supportSpell.mockImplementation(() => ({ supported: true, payment: { affordable: true, classPayment: null }, ...spell, cooldown: { type: 'none', value: 0 },
    rollHealth: { ...token.character.health }, rollAttributes: { intelligence: token.character.stats.intelligence }, reading: readDeterministicFormula('intelligence/4 + caster_missing_health/4', token.character.stats, token.character.health) }));
  buildApproval.mockImplementation(({ support, roll }) => ({ source, spell, roll, rollHealth: support.rollHealth }));
  requestActorEvent.mockResolvedValue({ success: false, code: 'awaiting_gm', contentHash: 'h' });
  refreshActorSnapshot.mockResolvedValue({ success: true, roomId: 'r', actionEpoch: 'e', commitSequence: 0 });
});
test.each(['initial', 'reapproval'])('%s refuses consent-refresh drift then requires explicit new click, no dice', async phase => {
  const roll = recordRoll('deterministic', supportSpell().reading, []), old = { source, spell, roll, rollHealth: { ...token.character.health } };
  box.record = phase === 'initial' ? { draft: { roll } } : { phase: 'reapproval', approval: old };
  let release; refreshActorSnapshot.mockImplementationOnce(() => new Promise(r => { release = r; }));
  const act = () => phase === 'initial' ? sendSpellApproval({ spellId: spell.definitionId, targetRef: { kind: 'creature' }, roll: recordRoll('deterministic', supportSpell().reading, []) }) : reapproveSpell();
  const pending = act(); token.character.health.current = 3; token.character.stats.intelligence = 23;
  release({ success: true, roomId: 'r', actionEpoch: 'e', commitSequence: 0 }); await pending;
  expect(useSpellConsequenceStore.getState().ownerStatus.message).toMatch(/changed while refreshing/); expect(requestActorEvent).not.toHaveBeenCalled(); expect(buildApproval).not.toHaveBeenCalled();
  await act(); expect(requestActorEvent).toHaveBeenCalledTimes(1);
  expect(requestActorEvent.mock.calls[0][1].roll).toMatchObject({ mode: 'deterministic', dice: [], total: 14 });
});
