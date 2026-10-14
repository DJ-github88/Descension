import { getStore } from '../../store/storeRegistry';
import { getBootstrapGateState } from '../../persistence/bootstrapPrivacyGate';
import { captureActorDelivery, prepareActorProjection } from '../actorProjectionOrder';

jest.mock('../../store/storeRegistry', () => ({ getStore: jest.fn() }));
jest.mock('../../persistence/bootstrapPrivacyGate', () => ({ getBootstrapGateState: jest.fn() }));
let game, generation, ordinal = 0;
beforeEach(() => {
  generation = 1;
  game = { isInMultiplayer: true, multiplayerRoom: { id: `lifecycle-${ordinal++}` }, multiplayerSocket: { connected: true } };
  getStore.mockImplementation(name => ({ getState: () => name === 'gameStore' ? game : { user: { uid: 'owner' } } }));
  getBootstrapGateState.mockImplementation(() => ({ accountGeneration: generation }));
});
const header = (cut, epoch = 'runtime') => ({ version: 1, roomId: game.multiplayerRoom.id, epoch, cut });
const token = (id, instance = 'incarnation', revision = 0, hp = 7) => ({ id, state: {
  actorContract: { version: 1, kind: 'creature', roomId: game.multiplayerRoom.id, mapId: 'default', tokenId: id, instanceId: instance, revision }, currentHp: hp, conditions: []
} });
const candidate = (cut, maps, extra = {}) => prepareActorProjection(maps, { actorProjection: header(cut), correlated: true, ...extra });
const admit = result => { expect(result.ok).toBe(true); result.commit(); };

test('complete absence protects unseen IDs and deleted maps; newer recreation and bind remain admissible', () => {
  admit(candidate(5, { default: { tokens: {} } }));
  expect(candidate(4, { default: { tokens: { unseen: token('unseen') } } }).code).toBe('actor_projection_stale');
  const unbound = { id: 'unseen', state: { currentHp: 7, actorLifecycle: header(6) } };
  admit(candidate(6, { default: { tokens: { unseen: unbound } } }));
  admit(candidate(7, { default: { tokens: { unseen: { ...token('unseen'), state: { ...token('unseen').state, actorLifecycle: header(6) } } } } }));
  expect(candidate(5, { default: { tokens: {} } }).code).toBe('actor_projection_stale');
  admit(candidate(8, {}));
  expect(candidate(7, { default: { tokens: { unseen: token('unseen') } } }, { scope: 'map' }).code).toBe('actor_projection_stale');
});

test('equal conflict and higher-cut same-incarnation rollback cannot commit; metadata loss needs actual creation proof', () => {
  admit(candidate(1, { default: { tokens: { a: token('a', 'current', 3) } } }));
  expect(candidate(1, { default: { tokens: { a: token('a', 'old', 3) } } }).code).toBe('actor_projection_conflict');
  expect(candidate(2, { default: { tokens: { a: token('a', 'current', 2) } } }).code).toBe('actor_projection_stale');
  expect(candidate(2, { default: { tokens: { a: token('a', 'current', 3, 6) } } }).code).toBe('actor_projection_conflict');
  const changedIdentity = token('a', 'current', 4); changedIdentity.ownerUserId = 'different-owner';
  expect(candidate(2, { default: { tokens: { a: changedIdentity } } }).code).toBe('actor_binding_conflict');
  expect(candidate(2, { default: { tokens: { a: { id: 'a', state: { currentHp: 49 } } } } }).code).toBe('actor_binding_metadata_missing');
  admit(candidate(3, { default: { tokens: { a: { id: 'a', state: { currentHp: 7, actorLifecycle: header(3) } } } } }));
});

test('partial coverage does not erase another collection and a rejected mixed candidate does not advance any fence', () => {
  admit(candidate(1, { default: { tokens: { a: token('a') }, creatures: { legacy: { id: 'legacy' } }, characterTokens: {} } }));
  const malformed = token('wrong'); malformed.state.actorContract.mapId = 'wrong';
  expect(candidate(2, { default: { tokens: { a: token('a', 'incarnation', 1) } }, other: { tokens: { wrong: malformed } } }).ok).toBe(false);
  admit(candidate(1, { default: { tokens: { a: token('a') }, creatures: { legacy: { id: 'legacy' } }, characterTokens: {} } }));
  admit(candidate(2, { default: { tokens: {} } }, { scope: 'section' }));
  // The untouched legacy collection retains its earlier cut, not the token cut.
  admit(candidate(1, { default: { creatures: { legacy: { id: 'legacy' } } } }, { scope: 'section' }));
  expect(candidate(1, { default: { tokens: { a: token('a') } } }, { scope: 'section' }).code).toBe('actor_projection_stale');
});

test('old room/socket/principal callbacks and arbitrary epochs cannot establish authority', () => {
  admit(candidate(1, { default: { tokens: {} } }));
  const old = captureActorDelivery();
  game.multiplayerRoom = { id: game.multiplayerRoom.id };
  expect(candidate(2, { default: { tokens: {} } }, { context: old }).code).toBe('actor_delivery_context');
  const beforeSocket = captureActorDelivery(); game.multiplayerSocket = { connected: true };
  expect(candidate(2, {}, { context: beforeSocket }).code).toBe('actor_delivery_context');
  const beforePrincipal = captureActorDelivery(); generation++;
  expect(candidate(2, {}, { context: beforePrincipal }).code).toBe('actor_delivery_context');
  admit(candidate(1, { default: { tokens: {} } }));
  expect(candidate(0, {}, { actorProjection: header(0, 'new-runtime'), correlated: false }).code).toBe('actor_projection_read_required');
  expect(candidate(0, {}, { actorProjection: header(0, 'new-runtime') }).code).toBe('actor_runtime_reconciliation_required');
  admit(candidate(0, {}, { actorProjection: header(0, 'new-runtime'), reconcileEpoch: true }));
});

test('display mutations cannot alter retained authority/equality fences', () => {
  const received = { default: { tokens: { a: token('a') } } };
  admit(candidate(1, received));
  received.default.tokens.a.state.actorContract.instanceId = 'unproven';
  received.default.tokens.a.state.conditions.push({ id: 'unproven-condition' });
  expect(candidate(1, received).code).toBe('actor_projection_conflict');
  admit(candidate(1, { default: { tokens: { a: token('a') } } }));
});
