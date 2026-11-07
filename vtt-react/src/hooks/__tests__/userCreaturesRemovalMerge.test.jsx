/**
 * Removal resurrection: assign → save → remove → cloud delete fails → reload/merge → retry.
 * Production: useUserCreaturesPersistence (real local/cloud merge + periodic full-save retry), creatureStore
 * (updateCreature / placement), authStore. Fixture: the cloud is an in-memory document map behind a mocked
 * userCreaturesService (load/save); a failed delete is simply "the cloud document still holds the association".
 */
import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { useUserCreaturesPersistence } from '../useUserCreaturesPersistence';
import useCreatureStore from '../../store/creatureStore';
import useAuthStore from '../../store/authStore';
import { loadUserCreatures, saveUserCreature } from '../../services/firebase/userCreaturesService';

jest.mock('../../services/firebase/userCreaturesService', () => ({ saveUserCreature: jest.fn(), loadUserCreatures: jest.fn() }));

const association = () => ({ schemaVersion: 1, record: { name: 'Ember dart', authoredDefinitionId: 'd1' }, librarySpellId: 'lib-ember' });
const legacy = () => [{ name: 'Claw', range: 0, periodic: { unknown: true } }];
let cloud, api, saveShouldFail;
function Probe() { api = useUserCreaturesPersistence(); return null; }
const wolf = () => ({ id: 'wolf', name: 'Wolf', isCustom: true, abilities: legacy(), custom: { zero: 0 }, authoredAbility: association() });
const local = () => useCreatureStore.getState().creatures.find(c => c.id === 'wolf');
const mount = async () => { render(<Probe />); await act(async () => { await api.loadCreatures(); }); };

beforeEach(() => {
  jest.useFakeTimers();
  saveShouldFail = false;
  cloud = { wolf: JSON.parse(JSON.stringify(wolf())) };
  loadUserCreatures.mockImplementation(async () => Object.values(cloud).map(c => JSON.parse(JSON.stringify(c))));
  saveUserCreature.mockImplementation(async (uid, creature) => {
    if (saveShouldFail) return { success: false, error: 'offline' };
    cloud[creature.id] = JSON.parse(JSON.stringify(creature)); return { success: true };   // full document write, no merge
  });
  useAuthStore.setState({ user: { uid: 'u1', isGuest: false } });
  useCreatureStore.setState({ creatures: [wolf()], creatureTokens: [], tokens: [] });
});
afterEach(() => { cleanup(); jest.useRealTimers(); });

test('a removal whose cloud delete failed is not restored by the cloud copy, and the deletion is retried', async () => {
  await mount();
  useCreatureStore.getState().addCreatureToken('wolf', { x: 1, y: 1 }, false, 'placed-removal');
  const placed = JSON.parse(JSON.stringify(useCreatureStore.getState().creatureTokens[0].authoredAbility));
  // GM removes the association and saves; the cloud delete failed, so the cloud document still has it.
  useCreatureStore.getState().updateCreature('wolf', { id: 'wolf', name: 'Wolf', abilities: legacy(), custom: { zero: 0 }, authoredAbility: undefined });
  expect(local().authoredAbility).toBeUndefined();
  // Reload/merge while the cloud still has the stale association.
  await act(async () => { await api.loadCreatures(); });
  expect(local().authoredAbility).toBeUndefined();                                           // not silently restored
  expect(local().abilities).toEqual(legacy()); expect(local().custom).toEqual({ zero: 0 });  // unrelated data intact
  expect(useCreatureStore.getState().creatureTokens[0].authoredAbility).toEqual(placed);    // detached placed copy untouched
  expect(cloud.wolf.authoredAbility).toBeDefined();                                          // still pending, visible as unsynced
  // Retry: the periodic full save (setDoc, no merge) deletes the cloud field.
  await act(async () => { await api.syncNewCreatures(); });
  expect(cloud.wolf.authoredAbility).toBeUndefined();
  expect(cloud.wolf.abilities).toEqual(legacy());
  await act(async () => { await api.loadCreatures(); });
  expect(local().authoredAbility).toBeUndefined();
});

test('a retry that also fails stays pending and still does not resurrect', async () => {
  await mount();
  useCreatureStore.getState().updateCreature('wolf', { id: 'wolf', authoredAbility: undefined });
  saveShouldFail = true;
  await act(async () => { await api.syncNewCreatures(); });
  await act(async () => { await api.loadCreatures(); });
  expect(local().authoredAbility).toBeUndefined();
  saveShouldFail = false;
  await act(async () => { await api.syncNewCreatures(); });
  expect(cloud.wolf.authoredAbility).toBeUndefined();
});

test('saving only an unrelated field never deletes an existing association (local or cloud)', async () => {
  await mount();
  useCreatureStore.getState().updateCreature('wolf', { name: 'Renamed wolf' });
  await act(async () => { await api.syncNewCreatures(); });
  await act(async () => { await api.loadCreatures(); });
  expect(local().authoredAbility).toEqual(association());
  expect(cloud.wolf.authoredAbility).toEqual(association());
  expect(cloud.wolf.name).toBe('Renamed wolf');
});

test('an association added in the cloud elsewhere is still merged in for a creature that never had one locally', async () => {
  useCreatureStore.setState({ creatures: [{ id: 'wolf', name: 'Wolf', isCustom: true }] });
  await mount();
  expect(local().authoredAbility).toEqual(association());
});

test('documented last-writer-wins: while a removal is unconfirmed a newer association from another device is overwritten by the retry; after a successful save a later cloud association merges normally', async () => {
  await mount();
  useCreatureStore.getState().updateCreature('wolf', { id: 'wolf', authoredAbility: undefined });
  cloud.wolf.authoredAbility = { ...association(), librarySpellId: 'from-other-device' };
  await act(async () => { await api.loadCreatures(); });
  expect(local().authoredAbility).toBeUndefined();
  await act(async () => { await api.syncNewCreatures(); });
  expect(cloud.wolf.authoredAbility).toBeUndefined();
  cloud.wolf.authoredAbility = { ...association(), librarySpellId: 'later-device' };
  await act(async () => { await api.loadCreatures(); });
  expect(local().authoredAbility.librarySpellId).toBe('later-device');
});
