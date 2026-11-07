/**
 * Spell library scope transitions (real OwnedSpellLibraryProvider + real libraryManager + real scoped storage + real bootstrap gate).
 * Disclosed fixture: scope activation is driven directly through the gate (the same call authBootstrapGateBinding makes) at controlled
 * moments, to model auth initializing after, or changing under, an already-mounted provider.
 */
import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { SpellLibraryProvider, useSpellLibrary, useSpellLibraryDispatch } from '../SpellLibraryContext';
import { saveLibraryToStorage, loadLibraryFromStorage } from '../../core/utils/libraryManager';
import { activatePrivateScope, clearToSignedOut, resetBootstrapGateForTests } from '../../../../persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../../../persistence/scopeModel';

const lib = (...ids) => ({ spells: ids.map(id => ({ id, name: id })), categories: [], collections: [] });
let api;
function Probe() { api = { state: useSpellLibrary(), dispatch: useSpellLibraryDispatch() }; return null; }
const mount = () => render(<SpellLibraryProvider><Probe /></SpellLibraryProvider>);
const ids = () => api.state.spells.map(s => s.id);
// Unmount first so reading another principal's storage cannot itself re-key a mounted provider.
const stored = uid => { cleanup(); activatePrivateScope(createUserScope(uid)); return loadLibraryFromStorage().spells.map(s => s.id); };
const add = id => act(() => api.dispatch({ type: 'ADD_SPELL_DIRECT', payload: { id, name: id } }));

beforeEach(() => { localStorage.clear(); resetBootstrapGateForTests(); });
afterEach(cleanup);

function seed(uid, ...spellIds) { activatePrivateScope(createUserScope(uid)); expect(saveLibraryToStorage(lib(...spellIds))).toBe(true); clearToSignedOut(); }

test('scope activating after mount hydrates the principal library and a later edit does not erase it', () => {
  seed('app-gm', 'saved-agility');
  mount();                                  // auth not yet initialised: no scope
  expect(ids()).toEqual([]);
  act(() => { activatePrivateScope(createUserScope('app-gm')); });
  expect(ids()).toEqual(['saved-agility']);
  add('another');
  expect(stored('app-gm')).toEqual(['saved-agility', 'another']);
});

test('reported witness failure: provider mounted before sign-in, then an edit, keeps the saved library (no empty overwrite)', () => {
  seed('app-gm', 'saved-agility');
  mount();
  act(() => { activatePrivateScope(createUserScope('app-gm')); });
  add('wizard-save');
  expect(stored('app-gm')).toEqual(['saved-agility', 'wizard-save']);
});

test('mounting with no scope and activating one does not rewrite the saved library', () => {
  seed('app-gm', 'saved-agility');
  mount();
  act(() => { activatePrivateScope(createUserScope('app-gm')); });
  expect(stored('app-gm')).toEqual(['saved-agility']);
});

test('account switch A to B never writes A library into B and shows B library', () => {
  seed('a', 'a-spell'); seed('b', 'b-spell');
  activatePrivateScope(createUserScope('a'));
  mount();
  expect(ids()).toEqual(['a-spell']);
  act(() => { activatePrivateScope(createUserScope('b')); });
  expect(ids()).toEqual(['b-spell']);
  add('b-new');
  expect(stored('b')).toEqual(['b-spell', 'b-new']);
  expect(stored('a')).toEqual(['a-spell']);
});

test('sign-out clears the private projection and signed-out edits are not persisted into the next principal', () => {
  seed('a', 'a-spell'); seed('b', 'b-spell');
  act(() => { activatePrivateScope(createUserScope('a')); });
  mount();
  act(() => { clearToSignedOut(); });
  expect(ids()).toEqual([]);
  add('guest-spell');
  act(() => { activatePrivateScope(createUserScope('b')); });
  expect(ids()).toEqual(['b-spell']);
  expect(stored('a')).toEqual(['a-spell']);
  expect(stored('b')).toEqual(['b-spell']);
});

test('a new account with no saved library starts empty and persists its own first spell', () => {
  activatePrivateScope(createUserScope('fresh'));
  mount();
  add('first');
  expect(stored('fresh')).toEqual(['first']);
});

test('the same principal re-activating (token refresh) keeps in-memory edits', () => {
  seed('a', 'a-spell');
  activatePrivateScope(createUserScope('a'));
  mount();
  add('draft');
  act(() => { activatePrivateScope(createUserScope('a')); });
  expect(ids()).toEqual(['a-spell', 'draft']);
});

// ---- late work / hydration-window safety --------------------------------------------------------------------------------------
test('scope that activates between the signed-out render and the provider effects does not get the empty library written over it', () => {
  seed('app-gm', 'saved-agility');
  function ActivateEarly() { React.useLayoutEffect(() => { activatePrivateScope(createUserScope('app-gm')); }, []); return null; }
  render(<><SpellLibraryProvider><Probe /></SpellLibraryProvider><ActivateEarly /></>);
  expect(stored('app-gm')).toEqual(['saved-agility']);
});

test('React StrictMode double effects do not write an unhydrated empty library', () => {
  seed('app-gm', 'saved-agility');
  act(() => { activatePrivateScope(createUserScope('app-gm')); });
  render(<React.StrictMode><SpellLibraryProvider><Probe /></SpellLibraryProvider></React.StrictMode>);
  expect(ids()).toEqual(['saved-agility']);
  expect(stored('app-gm')).toEqual(['saved-agility']);
});

test('StrictMode with delayed activation still keeps the saved library', () => {
  seed('app-gm', 'saved-agility');
  render(<React.StrictMode><SpellLibraryProvider><Probe /></SpellLibraryProvider></React.StrictMode>);
  act(() => { activatePrivateScope(createUserScope('app-gm')); });
  add('x');
  expect(stored('app-gm')).toEqual(['saved-agility', 'x']);
});

test('a dispatch from the old principal issued in the same batch as the switch cannot land in B', () => {
  seed('a', 'a-spell'); seed('b', 'b-spell');
  act(() => { activatePrivateScope(createUserScope('a')); });
  mount();
  const staleDispatch = api.dispatch;
  act(() => { activatePrivateScope(createUserScope('b')); staleDispatch({ type: 'ADD_SPELL_DIRECT', payload: { id: 'a-late', name: 'a-late' } }); });
  expect(ids()).toEqual(['b-spell']);
  expect(stored('b')).toEqual(['b-spell']);
  expect(stored('a')).toEqual(['a-spell']);
});

test('a dispatch from A after B is active is dropped and writes nothing', () => {
  seed('a', 'a-spell'); seed('b', 'b-spell');
  act(() => { activatePrivateScope(createUserScope('a')); });
  mount();
  const staleDispatch = api.dispatch;
  act(() => { activatePrivateScope(createUserScope('b')); });
  act(() => { staleDispatch({ type: 'ADD_SPELL_DIRECT', payload: { id: 'a-late', name: 'a-late' } }); });
  expect(ids()).toEqual(['b-spell']);
  expect(stored('b')).toEqual(['b-spell']);
});

test('signed-out edits write no library data anywhere', () => {
  mount();
  const before = JSON.stringify(Object.keys(localStorage).sort());
  add('guest-edit');
  expect(JSON.stringify(Object.keys(localStorage).sort())).toBe(before);
});
