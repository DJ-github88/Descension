/** routeTokenState returns the room's outcome Promise. A Promise is truthy even when it later resolves to a refusal, so the existing
 * callers (characterTokenStore.updateCharacterTokenState, creatureStore.updateCreatureState: `if (routed) return state`) treat "routed" as
 * "the room owns this write": they never write locally, and they never see the refusal. Only a caller that awaits the Promise (the
 * consumable helpers) learns the outcome. Fixture: fake socket from support/sharedRoomFixture (recorded production refusal shape). */
import useCharacterStore from '../../store/characterStore';
import useConditionStore from '../../store/conditionStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import usePartyStore from '../../store/partyStore';
import useMapStore from '../../store/mapStore';
import { registerStore } from '../../store/storeRegistry';
import { selectOwnerAttachment, routeTokenState, refreshActorSnapshot } from '../actorConsequenceService';
import { createRoom, REFUSAL } from '../__test_support__/sharedRoomFixture';

const room = createRoom();
const flush = async () => { for (let i = 0; i < 6; i++) await new Promise(r => setTimeout(r, 0)); };

beforeAll(async () => {
  if (!global.crypto?.randomUUID) Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
  for (const store of [useCharacterStore, useConditionStore, useCharacterTokenStore, useCreatureStore, useGameStore, useAuthStore, usePartyStore, useMapStore]) await store.persist?.rehydrate?.();
});
beforeEach(async () => {
  for (const [name, store] of [['characterStore', useCharacterStore], ['conditionStore', useConditionStore], ['characterTokenStore', useCharacterTokenStore], ['creatureStore', useCreatureStore],
    ['gameStore', useGameStore], ['authStore', useAuthStore], ['partyStore', usePartyStore], ['mapStore', useMapStore]]) registerStore(name, store);
  room.reset();
  useAuthStore.setState({ user: { uid: 'u2' } });
  useCharacterStore.setState({ id: 'c2', currentCharacterId: 'c2', name: 'Ilse', health: { current: 20, max: 40 }, tempHealth: 0 });
  useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  useCharacterTokenStore.setState({ characterTokens: [room.pcToken()] });
  usePartyStore.setState({ partyMembers: [] });
  useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'r' }, multiplayerSocket: room.socket(), actorConsequenceStatus: null });
  await refreshActorSnapshot();
  selectOwnerAttachment(room.ref);
  room.emitted = [];
});

test('a routed write is a truthy Promise that later resolves to the room refusal', async () => {
  const routed = routeTokenState('pc2', { tempHealth: 3 });
  expect(routed).toBeInstanceOf(Promise);
  expect(!!routed).toBe(true);                       // truthy NOW, before the room has answered
  const outcome = await routed;
  expect(outcome).toMatchObject({ success: false, code: 'attribute_change_gm_only' });
  expect(!!routed).toBe(true);                       // and still truthy as an object after it resolved to a refusal
});

test('characterTokenStore callers treat the Promise as "handled": no local write, refusal visible only in the actor status', async () => {
  useCharacterTokenStore.getState().updateCharacterTokenState('pc2', { tempHealth: 3 });
  await flush();
  expect(room.commands()).toHaveLength(1);
  expect(useCharacterTokenStore.getState().characterTokens.find(t => t.id === 'pc2').state.tempHealth).toBeUndefined();   // not applied locally
  expect(useGameStore.getState().actorConsequenceStatus).toMatchObject({ success: false, code: 'attribute_change_gm_only' });
});

test('an unresolved target routes to a resolved binding_required outcome (still truthy), and nothing is sent', async () => {
  const routed = routeTokenState('nobody', { tempHealth: 3 });
  expect(!!routed).toBe(true);
  expect(await routed).toMatchObject({ success: false, code: 'binding_required' });
  expect(room.commands()).toHaveLength(0);
});

test('creatureStore callers behave the same for an unresolved creature id: no local write', async () => {
  useCreatureStore.setState({ creatureTokens: [{ id: 'goblin', state: { currentHp: 7 } }], tokens: [{ id: 'goblin', state: { currentHp: 7 } }] });
  useCreatureStore.getState().updateCreatureState('goblin', { currentHp: 1 });
  await flush();
  expect(useCreatureStore.getState().creatureTokens.find(t => t.id === 'goblin').state.currentHp).toBe(7);
  expect(useGameStore.getState().actorConsequenceStatus).toMatchObject({ success: false, code: 'binding_required' });
});

test('outside a shared room, or for an unprotected key, nothing is routed (falsy) and the caller writes locally', () => {
  expect(routeTokenState('pc2', { facing: 90 })).toBe(false);
  useGameStore.setState({ isInMultiplayer: false });
  expect(routeTokenState('pc2', { tempHealth: 3 })).toBe(false);
});
