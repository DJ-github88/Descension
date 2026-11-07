/** F7: the owner's personal runtime load (production useCharacterPersistence.loadCharacterState → applyRuntime) and the
 * room condition hydration (actorConsequenceService.hydrateActorConditions) may run in either order. The authoritative room
 * Agility record must survive both orderings, apply exactly once to its exact matching character, never come from a stale
 * personal draft, never reach a different character, and stay removed once the room removed it. */
import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import useAuthStore from '../../store/authStore';
import useConditionStore from '../../store/conditionStore';
import useGameStore from '../../store/gameStore';
import useQuestStore from '../../store/questStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import usePersistenceStatusStore from '../../store/persistenceStatusStore';
import { registerStore } from '../../store/storeRegistry';
import { useCharacterPersistence } from '../../hooks/useCharacterPersistence';
import { activatePrivateScope, resetBootstrapGateForTests } from '../bootstrapPrivacyGate';
import { resetHandoffCoordinatorForTests, whenHandoffIdle } from '../handoff/accountHandoffCoordinator';
import { resetCharacterSaveOutcomeForTests } from '../characterSaveOutcome';
import { discardCharacterAutoSave } from '../../store/characterHelpers';
import { hydrateActorConditions, selectOwnerAttachment } from '../../services/actorConsequenceService';
import { combatAttributes } from '../../services/combatAttributes';
import { makeAttributeRecord } from '../../services/sharedConditionProfile';

jest.mock('../../config/firebase', () => ({ db: {}, auth: { currentUser: { uid: 'u-a' } },
  isFirebaseConfigured: true, isDemoMode: false, isMockOrDevUser: () => false }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: () => () => {} }));
jest.mock('firebase/firestore', () => ({
  doc: (_db, ...parts) => parts.join('/'), collection: (_db, ...parts) => parts.join('/'),
  getDoc: jest.fn(async() => ({ exists: () => false })), getDocs: jest.fn(async() => ({ forEach: () => {} })),
  setDoc: jest.fn(async() => {}), updateDoc: jest.fn(async() => {}), addDoc: jest.fn(),
  query: () => ({}), where: () => ({}), orderBy: () => ({}), limit: () => ({}), deleteDoc: jest.fn(),
  serverTimestamp: () => 'SERVER', onSnapshot: jest.fn(() => () => {}), runTransaction: jest.fn(), writeBatch: jest.fn()
}));
jest.mock('../../services/firebase/characterBackupService', () => ({ default: { autoBackup: async() => true } }));

const settle = async() => { for (let i = 0; i < 16; i++) await Promise.resolve(); };
const ID = '40000000-0000-4000-8000-0000000000f7', OTHER = '40000000-0000-4000-8000-0000000000f8';
const DEF = `authored:40000000-0000-4000-8000-000000000003:1:${'b'.repeat(64)}`;
// Token ids deliberately differ from character ids, as in production (no id collision can mask scoping).
const refA = { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'tok-a', instanceId: 'inst-a', ownerUid: 'u-a', characterId: 'c-a' };
const refB = { kind: 'character', roomId: 'room-1', mapId: 'm', tokenId: 'tok-b', instanceId: 'inst-b', ownerUid: 'u-a', characterId: 'c-b' };
const caster = { kind: 'creature', roomId: 'room-1', mapId: 'm', tokenId: 'foe', instanceId: 'inst-foe' };
const publicForm = record => { const { sourceActor, effectDefinition, ...rest } = record; return rest; };
const agilityRecord = (ref, id, amount) => publicForm(makeAttributeRecord(ref, id, { sourceOccurrence: `authored-effect:${id}`, timing: 'manual',
  authoredDuration: 'While it holds', attribute: 'agility', amount, label: amount < 0 ? 'Leaden' : 'Quickened', sourceActor: caster, effectDefinition: DEF }));
const token = (ref, conditions) => ({ id: ref.tokenId, ownerUserId: ref.ownerUid, character: { id: ref.characterId, health: { current: 20, max: 30 } },
  state: { conditions, actorContract: { version: 1, ...ref, revision: 4, primary: true } } });
const stats = { strength: 10, agility: 13, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 };
const sheet = id => ({ id, currentCharacterId: id, statsModel: 'base+earned@1', baseStats: { ...stats }, stats: { ...stats }, race: null, subrace: null, background: '', levelUpHistory: {}, equipment: {} });
const persistence = () => require('../../services/firebase/persistenceService').default;

let hook;
function Mounted() { hook = useCharacterPersistence(); return <div>mounted</div>; }
async function mount() { render(<Mounted />); await act(settle); }
async function loadDraft(draft) { jest.spyOn(persistence(), 'loadCharacterState').mockResolvedValue(draft); let r; await act(async() => { r = await hook.loadCharacterState(); }); return r; }
const agility = () => combatAttributes(useCharacterStore.getState()).agility;
const roomDebuffs = () => useConditionStore.getState().activeDebuffs.filter(record => record.target?.roomId);

beforeEach(async() => {
  cleanup(); discardCharacterAutoSave(); resetCharacterSaveOutcomeForTests(); resetBootstrapGateForTests(); resetHandoffCoordinatorForTests();
  localStorage.clear(); sessionStorage.clear(); jest.restoreAllMocks();
  for (const [name, store] of Object.entries({ authStore: useAuthStore, characterStore: useCharacterStore, inventoryStore: useInventoryStore, conditionStore: useConditionStore,
    gameStore: useGameStore, questStore: useQuestStore, characterTokenStore: useCharacterTokenStore, creatureStore: useCreatureStore })) registerStore(name, store);
  require('../../config/firebase').auth.currentUser = { uid: 'u-a' };
  useAuthStore.getState().setUser({ uid: 'u-a' }); await whenHandoffIdle(); activatePrivateScope({ scopeKind: 'user', scopeId: 'u-a' });
  useCharacterStore.setState({ characters: [{ id: 'c-a', name: 'A' }, { id: 'c-b', name: 'B' }], ...sheet('c-a'),
    health: { current: 20, max: 30 }, mana: { current: 5, max: 10 }, actionPoints: { current: 2, max: 3 }, roomActorRecoveryCandidates: [] });
  useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'room-1' }, personalConditionRecoveryCandidates: [] });
  useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  useCharacterTokenStore.setState({ characterTokens: [token(refA, [agilityRecord(refA, ID, -2)]), token(refB, [agilityRecord(refB, OTHER, 2)])] });
  useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] }); usePersistenceStatusStore.setState({ statuses: {} });
});
// Production order: the owner attachment for the loaded character is selected after the character is active.
const attach = () => expect(selectOwnerAttachment(refA).success).toBe(true);
afterEach(() => { cleanup(); discardCharacterAutoSave(); jest.restoreAllMocks(); });

test('sync before load: a personal runtime load after the room snapshot keeps the room record, applied exactly once', async() => {
  hydrateActorConditions(); // room snapshot arrives first
  await mount();
  const personal = { id: 'personal-1', name: 'Personal note', type: 'debuff', targetId: 'c-a', targetType: 'character', effects: {}, durationType: 'rounds', durationValue: 2, remainingRounds: 2 };
  expect((await loadDraft({ health: { current: 20, max: 30 }, buffs: [], debuffs: [personal], version: 1 })).success).toBe(true);
  attach(); // no corrective room sync after the load
  expect(roomDebuffs().map(record => record.id)).toEqual([ID]);
  expect(useConditionStore.getState().activeDebuffs.filter(record => record.id === 'personal-1')).toHaveLength(1); // the personal draft still applies
  expect(agility()).toBe(11);
  // A second load and repeated hydration never apply it twice.
  await loadDraft({ buffs: [], debuffs: [], version: 1 }); hydrateActorConditions(); hydrateActorConditions();
  expect(roomDebuffs().filter(record => record.id === ID)).toHaveLength(1); expect(agility()).toBe(11);
});

test('load before sync: the runtime load first, then the room snapshot, yields the same single application', async() => {
  await mount();
  await loadDraft({ buffs: [], debuffs: [], version: 1 });
  hydrateActorConditions(); attach();
  expect(roomDebuffs().filter(record => record.id === ID)).toHaveLength(1); expect(agility()).toBe(11);
});

test('a stale room record in a personal draft is never resurrected after the room removed it', async() => {
  hydrateActorConditions(); attach(); await mount();
  const stale = agilityRecord(refA, ID, -2);
  useCharacterTokenStore.setState({ characterTokens: [token(refA, []), token(refB, [agilityRecord(refB, OTHER, 2)])] });
  hydrateActorConditions(); expect(agility()).toBe(13);
  await loadDraft({ buffs: [], debuffs: [stale], version: 1 });
  expect(roomDebuffs()).toEqual([]); expect(agility()).toBe(13);
});

test('switching to another character never carries the first character\'s room effect, nor applies another actor\'s record', async() => {
  hydrateActorConditions(); await mount(); await loadDraft({ buffs: [], debuffs: [], version: 1 }); attach();
  expect(agility()).toBe(11);
  act(() => { useCharacterStore.setState({ ...sheet('c-b') }); }); await act(settle);
  await loadDraft({ buffs: [], debuffs: [], version: 1 });
  // No attachment is selected for c-b: neither A's −2 nor B's token record (bound to an unselected attachment) applies to this sheet.
  expect(agility()).toBe(13);
  expect(useConditionStore.getState().activeDebuffs.filter(record => record.id === ID)).toHaveLength(1); // still held for its exact token, not applied
});

test('outside a shared room the personal runtime behaviour is unchanged', async() => {
  useGameStore.setState({ isInMultiplayer: false, multiplayerRoom: null });
  await mount();
  const local = { id: 'local-1', name: 'Local', type: 'debuff', targetId: 'c-a', targetType: 'character', effects: { agility: -1 }, durationType: 'rounds', durationValue: 1, remainingRounds: 1 };
  await loadDraft({ buffs: [], debuffs: [local], version: 1 });
  expect(useConditionStore.getState().activeDebuffs.map(record => record.id)).toEqual(['local-1']);
});
