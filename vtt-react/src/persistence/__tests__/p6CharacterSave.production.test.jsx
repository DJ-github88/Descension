import React from 'react';
import { render, act, screen, cleanup } from '@testing-library/react';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import useAuthStore from '../../store/authStore';
import usePersistenceStatusStore from '../../store/persistenceStatusStore';
import { registerStore } from '../../store/storeRegistry';
import CharacterPersistenceProvider from '../../components/providers/CharacterPersistenceProvider';
import { activatePrivateScope, resetBootstrapGateForTests, getBootstrapGateState } from '../bootstrapPrivacyGate';
import { captureConsumerContext } from '../scopedConsumer';
import { resetCharacterScopedStorageState, saveRoster } from '../characterScopedStorage';
import { resetHandoffCoordinatorForTests, whenHandoffIdle } from '../handoff/accountHandoffCoordinator';
import { resetCharacterSaveOutcomeForTests, getCharacterCandidate, characterStatusKey, exportCharacterDraft, importCharacterDraft, stageCharacterDraft, saveCharacterDraft } from '../characterSaveOutcome';
import { discardCharacterAutoSave } from '../../store/characterHelpers';
import canonicalService, { transformForStorage, transformFromStorage } from '../../services/firebase/characterPersistenceService';
import runtimeService from '../../services/firebase/characterStateService';
import syncService from '../../services/firebase/characterSyncService';
import { syncOfflineData, storeCharacterOffline, getCharacterData, queueAction, getOfflineSyncStatus } from '../../services/offlineService';
import * as firestore from 'firebase/firestore';

jest.mock('../../config/firebase', () => ({
  db: {}, auth: { currentUser: { uid: 'u-a', getIdToken: async () => 'test' } },
  isFirebaseConfigured: true, isDemoMode: false, isMockOrDevUser: () => false
}));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: () => () => {} }));
jest.mock('firebase/firestore', () => ({
  doc: (_db, ...parts) => parts.join('/'), collection: (_db, ...parts) => parts.join('/'),
  getDoc: jest.fn(), getDocs: jest.fn(), setDoc: jest.fn(), updateDoc: jest.fn(), addDoc: jest.fn(),
  query: (ref, ...constraints) => ({ ref, constraints }), where: (field, op, value) => ({ field, op, value }), orderBy: () => ({}),
  serverTimestamp: () => 'SERVER', onSnapshot: jest.fn(() => () => {}), limit: () => ({}), deleteDoc: jest.fn(),
  runTransaction: jest.fn(), writeBatch: jest.fn()
}));
jest.mock('../../services/firebase/characterBackupService', () => ({ default: { autoBackup: async () => true } }));

const docs = new Map();
const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 };
const character = (id = 'c-a') => ({ id, name: id, class: 'Martyr', race: 'human', level: 1, stats,
  resources: { health: { current: 30, max: 50 }, mana: { current: 20, max: 30 }, actionPoints: { current: 2, max: 3 } },
  lore: { notes: 'baseline' }, inventory: { items: [], currency: {}, containers: [] }, equipment: {},
  classResource: { type: 'cadence', bank: ['I', 'VII'] }, unknownFuture: { keep: [1, 2, 3] } });
const defer = () => { let resolve; let reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const settle = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const status = (lane, id = 'c-a', context = captureConsumerContext().context) =>
  usePersistenceStatusStore.getState().statuses[characterStatusKey(context, id, lane)];

beforeEach(async () => {
  cleanup(); discardCharacterAutoSave(); resetCharacterSaveOutcomeForTests(); resetBootstrapGateForTests();
  resetHandoffCoordinatorForTests(); resetCharacterScopedStorageState(); localStorage.clear(); docs.clear();
  canonicalService.saveTails.clear(); runtimeService.saveTails.clear();
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request: (_name, options, fn) => Promise.resolve().then(() => fn({})) } });
  const firebase = require('../../config/firebase');
  firebase.auth.currentUser = { uid: 'u-a', getIdToken: async () => 'test' };
  registerStore('authStore', useAuthStore); registerStore('characterStore', useCharacterStore); registerStore('inventoryStore', useInventoryStore);
  useAuthStore.getState().setUser(firebase.auth.currentUser);
  await whenHandoffIdle();
  activatePrivateScope({ scopeKind: 'user', scopeId: 'u-a' });
  usePersistenceStatusStore.setState({ statuses: {} });
  firestore.getDoc.mockImplementation(async path => ({ exists: () => docs.has(path), data: () => docs.get(path) }));
  firestore.getDocs.mockImplementation(async () => ({ forEach: fn => [...docs].filter(([path]) => path.startsWith('characters/')).forEach(([, data]) => fn({ data: () => data })) }));
  firestore.updateDoc.mockImplementation(async (path, data) => { docs.set(path, { ...docs.get(path), ...data }); });
  firestore.setDoc.mockImplementation(async (path, data) => { docs.set(path, { ...docs.get(path), ...data }); });
  firestore.onSnapshot.mockImplementation(() => () => {});
  useInventoryStore.setState({ items: [], currency: {}, containers: [], encumbranceState: 'normal' });
  useCharacterStore.setState({ characters: [character(), character('c-b')], currentCharacterId: null, lore: { notes: 'baseline' } });
  useCharacterStore.getState().loadCharacter('c-a');
  discardCharacterAutoSave();
  await saveRoster(false, useCharacterStore.getState().characters);
});
afterEach(() => { cleanup(); discardCharacterAutoSave(); });

test('current production canonical edit confirms cloud and preserves notes, banks, inventory/equipment and unknown fields', async () => {
  useCharacterStore.getState().updateLore('notes', 'latest');
  expect(status('canonical').status).toBe('pending');
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(status('canonical').status).toBe('saved');
  const restored = transformFromStorage(docs.get('characters/c-a'));
  expect(restored.lore.notes).toBe('latest');
  expect(restored.classResource).toEqual(getCharacterCandidate('c-a', 'canonical').payload.classResource);
  expect(restored.unknownFuture).toEqual({ keep: [1, 2, 3] });
  const custom = character(); custom.equipment = { mainHand: { id: 'blade', custom: 7 } }; custom.inventory.containers = [{ id: 'bag', contents: [1] }];
  expect(transformFromStorage(transformForStorage(custom, 'u-a')).equipment).toMatchObject(custom.equipment);
  expect(transformFromStorage(transformForStorage(custom, 'u-a')).inventory.containers).toEqual(custom.inventory.containers);
  const future = transformForStorage(custom, 'u-a');
  future.basicInfo.futureHeritage = { preserve: 7 }; future.futureRoot = { preserve: 8 };
  const roundTrip = transformForStorage(transformFromStorage(future), 'u-a');
  expect(roundTrip.basicInfo.futureHeritage).toEqual({ preserve: 7 });
  expect(roundTrip.futureRoot).toEqual({ preserve: 8 });
});

test.each(['success', 'failure'])('new edit remains pending after an older canonical %s', async mode => {
  const gate = defer();
  firestore.updateDoc.mockImplementationOnce(() => gate.promise);
  useCharacterStore.getState().updateLore('notes', 'old');
  const saving = useCharacterStore.getState().saveCurrentCharacter();
  await settle();
  useCharacterStore.getState().updateLore('notes', 'new');
  expect(status('canonical').status).toBe('pending');
  mode === 'success' ? gate.resolve() : gate.reject(Error('network refusal'));
  await saving;
  expect(status('canonical').status).toBe('pending');
  expect(JSON.parse(exportCharacterDraft('c-a')).canonical.lore.notes).toBe('new');
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(status('canonical').status).toBe('saved');
  expect(docs.get('characters/c-a').lore.notes).toBe('new');
});

test('offline never confirms cloud; failed network retry heals the exact canonical draft', async () => {
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });
  useCharacterStore.getState().updateLore('notes', 'offline exact');
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(status('canonical')).toMatchObject({ status: 'pending', retention: 'device' });
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
  firestore.updateDoc.mockRejectedValueOnce(Error('network failed'));
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(status('canonical').status).toBe('error');
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(status('canonical').status).toBe('saved');
});

test('device refusal retains exact private source and leaves previous durable source untouched; healed retry saves', async () => {
  useCharacterStore.getState().updateLore('notes', 'prior');
  await useCharacterStore.getState().saveCurrentCharacter();
  const prior = localStorage.getItem('mythrill:p5:user:u-a:character.roster');
  const original = Storage.prototype.setItem;
  const refuse = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function(key, value) {
    if (String(value).includes('refused exact')) throw new DOMException('quota', 'QuotaExceededError');
    return original.call(this, key, value);
  });
  useCharacterStore.getState().updateLore('notes', 'refused exact');
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(status('canonical')).toMatchObject({ status: 'error', retention: 'memory' });
  expect(JSON.parse(exportCharacterDraft('c-a')).canonical.lore.notes).toBe('refused exact');
  expect(localStorage.getItem('mythrill:p5:user:u-a:character.roster')).toBe(prior);
  refuse.mockRestore();
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(status('canonical').status).toBe('saved');
});

test('serialization refusal retains cyclic source, reports failure, and export refuses without losing it', async () => {
  const payload = { note: 'exact', bad: 1n }; payload.self = payload;
  const entry = stageCharacterDraft('c-a', 'runtime', payload);
  expect(status('runtime')).toMatchObject({ status: 'error', retention: 'memory' });
  expect(entry.payload.self).toBe(entry.payload);
  const write = jest.fn();
  expect((await saveCharacterDraft(entry, write)).success).toBe(false);
  expect(write).not.toHaveBeenCalled();
  expect(() => exportCharacterDraft('c-a')).toThrow();
  expect(getCharacterCandidate('c-a', 'runtime').payload.bad).toBe(1n);
});

test('confirmed old generation is not recovered over newer cloud; SDK timestamp metadata remains retainable', async () => {
  const timestamp = { seconds: 1790000000, nanoseconds: 120, toDate: () => new Date(1790000000000) };
  const entry = stageCharacterDraft('c-a', 'canonical', { ...character(), createdAt: timestamp });
  expect(entry.retention).toBe('device');
  expect(entry.payload.createdAt).toEqual({ seconds: 1790000000, nanoseconds: 120 });
  expect(stageCharacterDraft('c-a', 'canonical', { ...character(), createdAt: timestamp })).toBe(entry);
  await saveCharacterDraft(entry, async () => true);
  useAuthStore.getState().setUser(null); await whenHandoffIdle();
  useAuthStore.getState().setUser({ uid: 'u-a' }); await whenHandoffIdle();
  expect(getCharacterCandidate('c-a', 'canonical').status).toBe('idle');
});

test('lossy legacy sanitizer cannot manufacture cloud confirmation for an unknown nested array', async () => {
  useCharacterStore.setState(state => ({ characters: state.characters.map(c => c.id === 'c-a' ? { ...c, futureNested: [[1, 2], [3]] } : c) }));
  useCharacterStore.getState().updateLore('notes', 'nested exact');
  await useCharacterStore.getState().saveCurrentCharacter();
  expect(status('canonical').status).toBe('error');
  expect(JSON.parse(exportCharacterDraft('c-a')).canonical.futureNested).toEqual([[1, 2], [3]]);
});

test('reload-style recovery beats stale canonical baseline and selected export/import preserves exact payloads', async () => {
  useCharacterStore.getState().updateLore('notes', 'reload retained');
  stageCharacterDraft('c-a', 'runtime', { health: { current: 7, max: 50 }, classResource: { bank: ['I', 'VII'] } });
  const exported = exportCharacterDraft('c-a');
  resetCharacterSaveOutcomeForTests();
  docs.set('characters/c-a', transformForStorage(character(), 'u-a'));
  useCharacterStore.setState({ currentCharacterId: null, characters: [] });
  await useCharacterStore.getState().loadCharacters();
  useCharacterStore.getState().loadCharacter('c-a');
  expect(useCharacterStore.getState().lore.notes).toBe('reload retained');
  expect(JSON.parse(exportCharacterDraft('c-a')).runtime.classResource.bank).toEqual(['I', 'VII']);
  const recoveredExport = exportCharacterDraft('c-a');
  // The legacy loader may author additional derived fields during recovery.
  // Reimporting the earlier, different snapshot must now preserve that work.
  expect(() => importCharacterDraft(exported, 'c-a')).toThrow('unsaved');
  expect(exportCharacterDraft('c-a')).toBe(recoveredExport);
  expect(importCharacterDraft(recoveredExport, 'c-a').canonical.lore.notes).toBe('reload retained');
  expect(() => importCharacterDraft(exported, 'c-b')).toThrow();
  const foreign = JSON.parse(exported); foreign.owner.scopeId = 'u-b';
  expect(() => importCharacterDraft(JSON.stringify(foreign), 'c-a')).toThrow();
});

test.each(['account', 'generation', 'character'])('outstanding runtime save is fenced across %s switch with mounted consumer', async mode => {
  render(<CharacterPersistenceProvider><div>owned content</div></CharacterPersistenceProvider>);
  await act(settle);
  const held = defer();
  firestore.setDoc.mockImplementation((path, data) => path.includes('/characterStates/') ? held.promise : Promise.resolve());
  act(() => useCharacterStore.getState().updateResource('health', 17));
  const context = captureConsumerContext().context;
  const oldEntry = getCharacterCandidate('c-a', 'runtime');
  let saving;
  await act(async () => { saving = saveCharacterDraft(oldEntry, (payload, latest) => runtimeService.saveCharacterState('u-a', 'c-a', payload, { isCurrent: latest })); await settle(); });
  await act(async () => {
    if (mode === 'character') useCharacterStore.getState().loadCharacter('c-b');
    else {
      const firebase = require('../../config/firebase');
      const uid = mode === 'account' ? 'u-b' : 'u-a';
      if (mode === 'generation') {
        useAuthStore.getState().setUser(null);
        await whenHandoffIdle();
      }
      firebase.auth.currentUser = { uid };
      useAuthStore.getState().setUser({ uid });
      await whenHandoffIdle();
      activatePrivateScope({ scopeKind: 'user', scopeId: uid });
    }
  });
  const before = { ...usePersistenceStatusStore.getState().statuses };
  await act(async () => { held.resolve(); await saving; });
  if (mode !== 'character') expect(usePersistenceStatusStore.getState().statuses).toEqual(before);
  expect(screen.getByLabelText('Selected character save status').textContent).toContain(
    mode === 'generation' ? 'Personal runtime: Cloud save pending' : 'Personal runtime: Not confirmed');
  expect(getBootstrapGateState().accountGeneration).toBeGreaterThanOrEqual(context.accountGeneration);
});

test('mounted provider exposes runtime failure and retry while canonical stays independently pending', async () => {
  render(<CharacterPersistenceProvider><div>sheet</div></CharacterPersistenceProvider>);
  await act(settle);
  act(() => useCharacterStore.getState().updateResource('health', 13));
  firestore.setDoc.mockImplementation(async (path, data) => {
    if (path.includes('/characterStates/')) throw Error('runtime network failed');
    docs.set(path, data);
  });
  await act(async () => { screen.getByRole('button', { name: 'Retry runtime save' }).click(); await settle(); });
  expect(status('runtime').status).toBe('error');
  expect(status('canonical').status).toBe('pending');
  expect(screen.getByLabelText('Selected character save status').textContent).toContain('Save failed');
  firestore.setDoc.mockImplementation(async (path, data) => docs.set(path, data));
  await act(async () => { screen.getByRole('button', { name: 'Retry runtime save' }).click(); await settle(); });
  expect(status('runtime').status).toBe('saved');
  expect(status('canonical').status).toBe('pending');
  expect(docs.get('users/u-a/characterStates/c-a').health.current).toBe(13);
  const confirmed = docs.get('users/u-a/characterStates/c-a');
  const writes = firestore.setDoc.mock.calls.length;
  const listener = firestore.onSnapshot.mock.calls.at(-1)[1];
  act(() => listener({ exists: () => true, data: () => ({ ...confirmed, health: { current: 45, max: 50 } }) }));
  expect(useCharacterStore.getState().health.current).toBe(13);
  expect(firestore.setDoc.mock.calls.length).toBe(writes);
});

test('actual runtime facade quota refusal is visible and retains the selected exact draft', async () => {
  docs.set('users/u-a', { subscriptionTier: 'free', storageUsage: { total: 1e12 } });
  render(<CharacterPersistenceProvider><div>sheet</div></CharacterPersistenceProvider>);
  await act(settle);
  act(() => useCharacterStore.getState().updateResource('health', 10));
  await act(async () => { screen.getByRole('button', { name: 'Retry runtime save' }).click(); await settle(); });
  expect(status('runtime')).toMatchObject({ status: 'error', retention: 'device' });
  expect(JSON.parse(exportCharacterDraft('c-a')).runtime.health.current).toBe(10);
  expect(firestore.setDoc.mock.calls.some(([path]) => path.includes('/characterStates/'))).toBe(false);
});

test('runtime localOnly is pending, never cloud saved', async () => {
  require('../../config/firebase').auth.currentUser = null;
  const entry = stageCharacterDraft('c-a', 'runtime', { health: { current: 9, max: 50 } });
  await saveCharacterDraft(entry, payload => runtimeService.saveCharacterState('u-a', 'c-a', payload));
  expect(status('runtime').status).toBe('pending');
});

test.each(['success', 'failure'])('mounted runtime newer work survives older %s and retry confirms latest', async mode => {
  render(<CharacterPersistenceProvider><div>sheet</div></CharacterPersistenceProvider>);
  await act(settle);
  const held = defer();
  firestore.setDoc.mockImplementation((path, data) => path.includes('/characterStates/') ? held.promise : Promise.resolve());
  act(() => useCharacterStore.getState().updateResource('health', 18));
  await act(async () => { screen.getByRole('button', { name: 'Retry runtime save' }).click(); await settle(); });
  expect(status('runtime').status).toBe('saving');
  act(() => useCharacterStore.getState().updateResource('health', 11));
  await act(async () => { mode === 'success' ? held.resolve() : held.reject(Error('old runtime failed')); await settle(); });
  expect(status('runtime').status).toBe('pending');
  expect(getCharacterCandidate('c-a', 'runtime').payload.health.current).toBe(11);
  firestore.setDoc.mockImplementation(async (path, data) => docs.set(path, data));
  await act(async () => { screen.getByRole('button', { name: 'Retry runtime save' }).click(); await settle(); });
  expect(status('runtime').status).toBe('saved');
  expect(docs.get('users/u-a/characterStates/c-a').health.current).toBe(11);
});

test('returned false remains error; duplicate runtime retry is coalesced', async () => {
  const entry = stageCharacterDraft('c-a', 'runtime', { health: { current: 4, max: 50 } });
  await saveCharacterDraft(entry, async () => false);
  expect(status('runtime').status).toBe('error');
  const held = defer(); const write = jest.fn(() => held.promise);
  const first = saveCharacterDraft(entry, write); const second = saveCharacterDraft(entry, write);
  held.resolve({ success: true, writeToken: 'same' });
  await Promise.all([first, second]);
  expect(write).toHaveBeenCalledTimes(1);
  expect(status('runtime').status).toBe('saved');
});

test('reachable session sync loads/saves with the captured owner and observes false confirmation', async () => {
  await useCharacterStore.getState().saveCurrentCharacter();
  const context = captureConsumerContext().context;
  docs.set('characters/c-a', transformForStorage(character(), 'u-a'));
  const changes = [{ changeType: 'resource_change', changeData: { type: 'health', value: { current: 6, max: 50 } }, timestamp: '2026-10-12' }];
  await syncService.syncCharacterChanges('c-a', changes, context);
  expect(docs.get('characters/c-a').metadata.userId).toBe('u-a');
  const loadGate = defer(); firestore.getDoc.mockImplementationOnce(() => loadGate.promise);
  const saving = syncService.syncCharacterChanges('c-a', changes, context);
  const writesBeforeRetirement = firestore.updateDoc.mock.calls.length;
  require('../../config/firebase').auth.currentUser = { uid: 'u-b' };
  useAuthStore.getState().setUser({ uid: 'u-b' }); await whenHandoffIdle();
  loadGate.resolve({ exists: () => true, data: () => transformForStorage(character(), 'u-a') });
  await expect(saving).rejects.toThrow('Owner changed');
  expect(firestore.updateDoc.mock.calls.slice(writesBeforeRetirement)).toEqual([]);
});

test('reachable legacy sync preserves queued reconciliation rather than overwriting an unsent canonical draft', async () => {
  useCharacterStore.getState().updateLore('notes', 'local exact newer');
  const before = firestore.updateDoc.mock.calls.length;
  await expect(syncService.syncCharacterChanges('c-a', [], captureConsumerContext().context)).rejects.toThrow('explicit retry/reconciliation');
  expect(firestore.updateDoc.mock.calls.length).toBe(before);
  expect(getCharacterCandidate('c-a', 'canonical').payload.lore.notes).toBe('local exact newer');
});

test('canonical pending timer stays bound to edited character through selection switch', async () => {
  useCharacterStore.getState().updateResource('health', 16);
  expect(getCharacterCandidate('c-a', 'canonical').payload.health.current).toBe(16);
  useCharacterStore.getState().loadCharacter('c-b');
  expect(JSON.parse(exportCharacterDraft('c-a')).canonical.health.current).toBe(16);
  const latest = getCharacterCandidate('c-a', 'canonical');
  await useCharacterStore.getState().updateCharacter(latest.id, latest.payload, { originContext: latest.context });
  expect(docs.get('characters/c-a').resources.health.current).toBe(16);
  expect(useCharacterStore.getState().currentCharacterId).toBe('c-b');
});

test('runtime load refused after a newer edit and inventory hydration/echo stay loop-free', async () => {
  const read = defer();
  firestore.getDoc.mockImplementation(path => path.includes('/characterStates/') ? read.promise : Promise.resolve({ exists: () => false }));
  render(<CharacterPersistenceProvider><div>sheet</div></CharacterPersistenceProvider>);
  await act(settle);
  act(() => useCharacterStore.getState().updateResource('health', 12));
  await act(async () => { read.resolve({ exists: () => true, data: () => ({ health: { current: 40, max: 50 }, inventory: { items: [{ id: 'old' }] } }) }); await settle(); });
  expect(useCharacterStore.getState().health.current).toBe(12);
  expect(useInventoryStore.getState().items).toEqual([]);
  expect(getCharacterCandidate('c-a', 'runtime').payload.health.current).toBe(12);
});

test('offline no-op and historic synced metadata retain character content and queued work as pending', async () => {
  storeCharacterOffline('c-a', { id: 'c-a', notes: 'offline cache exact' });
  await queueAction('update_character', { characterId: 'c-a', updates: { notes: 'queued exact' } }, 'u-a');
  await syncOfflineData('u-a');
  expect((await getCharacterData('c-a', 'u-a')).syncStatus).toBe('pending');
  expect((await getCharacterData('c-a', 'u-a')).notes).toBe('offline cache exact');
  expect(getOfflineSyncStatus().pendingActions).toBe(1);
  expect(firestore.updateDoc).not.toHaveBeenCalled();
  const key = 'mythrill:p5:user:u-a:offline.characters';
  const historic = JSON.parse(localStorage.getItem(key));
  historic.payload['c-a'].syncStatus = 'synced';
  historic.payload['c-a'].lastSynced = 'unproven timestamp';
  localStorage.setItem(key, JSON.stringify(historic));
  await syncOfflineData('u-a');
  const restored = await getCharacterData('c-a', 'u-a');
  expect(restored.syncStatus).toBe('pending');
  expect(restored.notes).toBe('offline cache exact');
  expect(restored.lastSynced).toBeUndefined();
});
