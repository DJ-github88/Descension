/**
 * Durable ability removal: assign → save → remove → cloud failure → RELOAD → stale cloud merge → retry.
 *
 * Production implementations: Creature Wizard (remove/confirm/save + reassignment), services/creatureAbilityRemoval and its
 * owner-scoped storage family `library.creatureAbilityRemovals` (real bootstrap gate + real localStorage engine),
 * useUserCreaturesPersistence (real load/merge/autosync path), creatureStore, notificationStore.
 *
 * Disclosed fixtures: the cloud is an in-memory document map behind a mocked userCreaturesService (load/save/update with the
 * same semantics as the real service: update merges and deletes the field only for an explicit undefined; save is a full
 * overwrite). A "reload" is: unmount everything, empty the creature store (creatures are cloud-backed, not locally
 * persisted), mount a fresh hook (new refs) while localStorage keeps the pending-removal record. Placed tokens stay in the
 * store across the simulated reload (they belong to the room, not the creature library). Spell Library = in-memory records.
 * Multi-device behaviour is NOT tested: last-writer-wins is retained.
 */
import React from 'react';
import { render, screen, fireEvent, cleanup, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatureWizardApp from '../../../CreatureWizardApp';
import { CreatureWizardProvider } from '../../../context/CreatureWizardContext';
import { CreatureLibraryProvider } from '../../../context/CreatureLibraryContext';
import { SpellLibraryStateContext } from '../../../../spellcrafting-wizard/context/SpellLibraryContext';
import useCreatureStore from '../../../../../store/creatureStore';
import useAuthStore from '../../../../../store/authStore';
import useNotificationStore from '../../../../../store/notificationStore';
import { useUserCreaturesPersistence } from '../../../../../hooks/useUserCreaturesPersistence';
import { pendingRemovals, recordRemoval, supersedeRemoval, confirmRemoval, pruneCreature } from '../../../../../services/creatureAbilityRemoval';

let mockCloud;
jest.mock('../../../../../services/firebase/userCreaturesService', () => ({
  loadUserCreatures: (...a) => mockCloud.load(...a),
  saveUserCreature: (...a) => mockCloud.save(...a),
  updateUserCreature: (...a) => mockCloud.update(...a)
}));
jest.mock('../../../../books/BookTtrpgBlocks', () => ({ normalizeDangerLevel: () => 'Medium', CREATURE_PRESETS: [] }));
jest.mock('../ExternalCreaturePreview', () => () => null);
jest.mock('../../../../spellcrafting-wizard/core/utils/libraryManager', () => ({
  getDefaultLibrary: () => ({ spells: [], categories: [], collections: [] }), loadLibraryFromStorage: () => null, saveLibraryToStorage: () => true,
  categorizeSpell: () => [], generateUniqueId: () => 'generated-id', validateLibraryIntegrity: value => value, createDefaultCategories: () => []
}));
jest.mock('../../../../../utils/assetManager', () => ({ getIconUrl: () => 'i.png', getAbilityIconUrl: () => 'i.png', getCustomIconUrl: () => 'i.png' }));

beforeAll(() => {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
  const tails = new Map();
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request(name, opt, cb) {
    const callback = typeof opt === 'function' ? opt : cb; const run = (tails.get(name) || Promise.resolve()).then(() => callback({ name })); tails.set(name, run.catch(() => {})); return run; } } });
});

const clone = v => JSON.parse(JSON.stringify(v));
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const ember = () => { const d = { name: 'Ember dart', description: 'A small hot dart.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'ember' }, effectTypes: ['damage'],
  damageConfig: { damageType: 'direct', elementType: 'ember', formula: '2d6+1', resolution: 'DICE' }, targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['enemy'] }, resourceCost: { actionPoints: 2, mana: 3 } };
  return { ...clone(d), authoredDraft: d, authoredDefinitionId: '10000000-0000-4000-8000-000000000001', id: 'lib-ember' }; };
const association = () => ({ schemaVersion: 1, record: ember(), librarySpellId: 'lib-ember' });
const LEGACY = () => [{ name: 'Claw', range: 0, periodic: { unknown: true }, custom: { zero: 0 } }];
const wolf = (extra = {}) => ({ id: 'wolf', name: 'Wolf', description: 'A wolf.', type: 'beast', size: 'medium', isCustom: true,
  stats: { maxHp: 40, maxMana: 12, maxActionPoints: 5, strength: 10, agility: 12, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 }, abilities: LEGACY(), ...extra });

function makeCloud() {
  const c = { docs: {}, calls: [], mode: 'ok', hold: false, held: [],
    async load() { return clone(Object.values(c.docs)); },
    async save(uid, creature) { c.calls.push(['save', creature.id, has(creature, 'authoredAbility') && creature.authoredAbility !== undefined]); if (c.mode === 'fail') return { success: false, error: 'offline' }; c.docs[creature.id] = clone(creature); return { success: true }; },
    update(uid, id, updates) {
      const removes = has(updates, 'authoredAbility') && updates.authoredAbility === undefined;
      c.calls.push(['update', id, removes ? 'remove' : has(updates, 'authoredAbility') ? 'set' : 'none']);
      const apply = () => { const next = { ...(c.docs[id] || {}), ...clone(updates) }; if (removes) delete next.authoredAbility; c.docs[id] = next; return { success: true, localOnly: false }; };
      if (c.hold) return new Promise(resolve => c.held.push({ removes, release: (outcome) => resolve(outcome === 'ok' ? apply() : { success: false, error: 'late failure', localOnly: true }) }));
      if (c.mode === 'fail') return Promise.resolve({ success: false, error: 'offline', localOnly: true });
      return Promise.resolve(apply());
    } };
  return c;
}

let api;
function Probe() { api = useUserCreaturesPersistence(); return null; }
const gateOf = () => require('../../../../../persistence/bootstrapPrivacyGate');
const scopeOf = uid => require('../../../../../persistence/scopeModel').createUserScope(uid);
const signIn = uid => { gateOf().clearToSignedOut(); gateOf().activatePrivateScope(scopeOf(uid)); useAuthStore.setState({ user: { uid, isGuest: false } }); };
const mountApp = (creature) => render(
  <SpellLibraryStateContext.Provider value={{ spells: [ember()] }}>
    <CreatureLibraryProvider><CreatureWizardProvider><CreatureWizardApp initialCreature={creature} onSave={jest.fn()} /></CreatureWizardProvider></CreatureLibraryProvider>
  </SpellLibraryStateContext.Provider>);
const goStep = n => fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${n}`) }));
const clickSave = async () => { goStep(5); await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Save Creature/ })); }); };
const removeAbility = () => { fireEvent.click(screen.getByText('Remove activated ability')); fireEvent.click(screen.getByText('Confirm removal')); };
const local = (id = 'wolf') => useCreatureStore.getState().creatures.find(c => c.id === id);
const warnings = () => useNotificationStore.getState().notifications.filter(n => n.type === 'warning' && /ability removal/.test(n.message));
const reload = async () => { cleanup(); useCreatureStore.setState({ creatures: [] }); render(<Probe />); await act(async () => { await api.loadCreatures(); }); };

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  gateOf().resetBootstrapGateForTests(); signIn('u1');
  mockCloud = makeCloud(); mockCloud.docs.wolf = clone(wolf({ authoredAbility: association() }));
  useNotificationStore.setState({ notifications: [] });
  useCreatureStore.setState({ creatures: [wolf({ authoredAbility: association() })], creatureTokens: [], tokens: [] });
});
afterEach(() => { cleanup(); });

describe('failed delete → reload → stale cloud merge → retry (production path)', () => {
  test('the failure is visible, the removal survives the reload, the stale cloud copy does not restore it, and the retry confirms and clears it', async () => {
    useCreatureStore.getState().addCreatureToken('wolf', { x: 1, y: 1 }, false, 'placed-1');
    const placed = clone(useCreatureStore.getState().creatureTokens[0].authoredAbility);
    mountApp(clone(local())); goStep(3); removeAbility();
    mockCloud.mode = 'fail';
    await clickSave();
    expect(warnings()).toHaveLength(1);                                         // visible failure (tested warning)
    expect(warnings()[0].message).toMatch(/stays pending and is retried, including after a reload/);
    expect(pendingRemovals('u1').has('wolf')).toBe(true);                       // durable, scoped to this account + creature
    expect(mockCloud.docs.wolf.authoredAbility).toBeDefined();                  // the cloud still holds the association
    await reload();                                                              // page reload; stale cloud copy is merged
    expect(local().authoredAbility).toBeUndefined();                             // NOT restored
    expect(local().abilities).toEqual(LEGACY()); expect(local().name).toBe('Wolf');    // unrelated data intact
    expect(useCreatureStore.getState().creatureTokens[0].authoredAbility).toEqual(placed); // detached placed copy untouched
    expect(pendingRemovals('u1').has('wolf')).toBe(true);                       // still pending (not cleared by merge)
    await act(async () => { await api.syncNewCreatures(); });                   // existing autosync path retries (cloud still failing)
    expect(pendingRemovals('u1').has('wolf')).toBe(true);
    await reload(); expect(local().authoredAbility).toBeUndefined();            // and again after a second reload
    mockCloud.mode = 'ok';
    await act(async () => { await api.syncNewCreatures(); });                   // retry succeeds
    expect(mockCloud.docs.wolf.authoredAbility).toBeUndefined();
    expect(mockCloud.docs.wolf.abilities).toEqual(LEGACY());
    expect(pendingRemovals('u1').size).toBe(0);                                 // cleared only on the confirmed save
    await reload(); expect(local().authoredAbility).toBeUndefined();            // stays removed
  });

  test('a successful removal never leaves a record, and an unrelated-field save does not delete an association', async () => {
    mountApp(clone(local())); goStep(3); removeAbility(); await clickSave();
    expect(warnings()).toHaveLength(0); expect(pendingRemovals('u1').size).toBe(0); expect(mockCloud.docs.wolf.authoredAbility).toBeUndefined();
    cleanup(); mockCloud.docs.wolf = clone(wolf({ authoredAbility: association() })); useCreatureStore.setState({ creatures: [wolf({ authoredAbility: association() })] });
    mountApp(clone(local())); await clickSave();                                   // save without touching the ability
    expect(pendingRemovals('u1').size).toBe(0); expect(mockCloud.docs.wolf.authoredAbility).toEqual(association());
    expect(mockCloud.calls.filter(c => c[2] === 'remove')).toHaveLength(1);
  });

  test('a cloud copy that already lacks the association confirms the removal on load', async () => {
    mountApp(clone(local())); goStep(3); removeAbility(); mockCloud.mode = 'fail'; await clickSave();
    expect(pendingRemovals('u1').has('wolf')).toBe(true);
    delete mockCloud.docs.wolf.authoredAbility;                                  // the delete did land (response was lost)
    await reload();
    expect(local().authoredAbility).toBeUndefined(); expect(pendingRemovals('u1').size).toBe(0);
  });
});

describe('account isolation', () => {
  test('a pending removal belongs to one account: another account sees none and keeps its own association; the first account still has it', async () => {
    mountApp(clone(local())); goStep(3); removeAbility(); mockCloud.mode = 'fail'; await clickSave(); cleanup();
    expect(pendingRemovals('u1').has('wolf')).toBe(true);
    signIn('u2');                                                                // same creature id, different account
    mockCloud.docs.wolf = clone(wolf({ authoredAbility: association() })); useCreatureStore.setState({ creatures: [] });
    render(<Probe />); await act(async () => { await api.loadCreatures(); });
    expect(pendingRemovals('u2').size).toBe(0);
    expect(local().authoredAbility).toEqual(association());                      // u2's association is merged normally
    cleanup(); signIn('u1');
    expect(pendingRemovals('u1').has('wolf')).toBe(true);                        // u1's record is intact
    expect(pendingRemovals('u2').size).toBe(0);
  });
});

describe('remove → reassign → delayed old response', () => {
  test.each([['fails', 'fail'], ['succeeds', 'ok']])('the old removal response that %s late never removes or reports against the newer assignment', async (_n, outcome) => {
    mockCloud.hold = true;
    mountApp(clone(local())); goStep(3); removeAbility(); await clickSave();
    await waitFor(() => expect(mockCloud.held).toHaveLength(1));
    expect(mockCloud.held[0].removes).toBe(true); expect(pendingRemovals('u1').has('wolf')).toBe(true);
    cleanup();                                                                   // GM reopens the creature (template currently has no ability)
    mountApp(clone(local())); goStep(3);
    fireEvent.change(screen.getByLabelText('Compatible Spell Library definition'), { target: { value: 'lib-ember' } });
    fireEvent.click(screen.getByText('Keep ability on creature'));
    await clickSave();
    expect(local().authoredAbility.librarySpellId).toBe('lib-ember');            // newer intentional assignment
    expect(pendingRemovals('u1').size).toBe(0);                                  // the old removal was superseded
    expect(mockCloud.held).toHaveLength(1);                                      // the new cloud write waits behind the old one (ordered per creature)
    await act(async () => { mockCloud.held[0].release(outcome); });              // the old response arrives late
    await waitFor(() => expect(mockCloud.held).toHaveLength(2));
    await act(async () => { mockCloud.held[1].release('ok'); });
    expect(warnings()).toHaveLength(0);                                          // nothing reported against the newer state
    expect(mockCloud.calls.map(c => c[2])).toEqual(['remove', 'set']);          // order preserved
    expect(mockCloud.docs.wolf.authoredAbility.librarySpellId).toBe('lib-ember'); // cloud ends with the new assignment
    expect(pendingRemovals('u1').size).toBe(0);
    mockCloud.hold = false; await reload();
    expect(local().authoredAbility.librarySpellId).toBe('lib-ember');            // reassignment survives reload
  });

  test('a reassignment saved while a removal is pending (cloud failing) wins over the stale cloud copy after reload', async () => {
    mountApp(clone(local())); goStep(3); removeAbility(); mockCloud.mode = 'fail'; await clickSave(); cleanup();
    expect(pendingRemovals('u1').has('wolf')).toBe(true);
    mountApp(clone(local())); goStep(3);
    fireEvent.change(screen.getByLabelText('Compatible Spell Library definition'), { target: { value: 'lib-ember' } });
    fireEvent.click(screen.getByText('Keep ability on creature')); await clickSave();
    expect(pendingRemovals('u1').size).toBe(0);
    mockCloud.mode = 'ok'; render(<Probe />); await act(async () => { await api.syncNewCreatures(); });
    expect(mockCloud.docs.wolf.authoredAbility.librarySpellId).toBe('lib-ember');
    await reload(); expect(local().authoredAbility.librarySpellId).toBe('lib-ember');
  });
});

describe('the Creature library provider cloud load (second cloud-load path)', () => {
  const heldLoad = () => { let release; mockCloud.load = () => new Promise(resolve => { release = () => resolve(clone(Object.values(mockCloud.docs))); }); return async () => { for (let i = 0; i < 100 && !release; i++) await new Promise(r => setTimeout(r, 5)); release(); }; };
  test('a slow cloud load never overwrites a template removal saved in the meantime (it merges into the live store)', async () => {
    const release = heldLoad();
    render(<CreatureLibraryProvider><span /></CreatureLibraryProvider>);
    useCreatureStore.getState().updateCreature('wolf', { id: 'wolf', authoredAbility: undefined });
    await act(async () => { release(); await new Promise(r => setTimeout(r, 20)); });
    expect(local().authoredAbility).toBeUndefined();
  });
  test('after a reload the provider load does not restore the association for a creature with a pending removal', async () => {
    recordRemoval('u1', 'wolf'); useCreatureStore.setState({ creatures: [] });
    const release = heldLoad();
    render(<CreatureLibraryProvider><span /></CreatureLibraryProvider>);
    await act(async () => { release(); await new Promise(r => setTimeout(r, 20)); });
    expect(local()).toBeDefined(); expect(local().authoredAbility).toBeUndefined();
    expect(mockCloud.docs.wolf.authoredAbility).toBeDefined();                  // the cloud copy is untouched until the retry
  });
});

describe('review repairs', () => {
  test('a failed storage write while superseding or confirming cannot leave a record that strips a newer state (session override)', () => {
    recordRemoval('u1', 'wolf');
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    const removeSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked'); });
    try { supersedeRemoval('u1', 'wolf'); } finally { spy.mockRestore(); removeSpy.mockRestore(); }
    expect(pendingRemovals('u1').size).toBe(0);
    const { removalId } = recordRemoval('u1', 'wolf');
    const spy2 = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    const removeSpy2 = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked'); });
    try { expect(confirmRemoval('u1', 'wolf', removalId)).toBe(true); } finally { spy2.mockRestore(); removeSpy2.mockRestore(); }
    expect(pendingRemovals('u1').size).toBe(0);
  });
  test('a cloud load served before a removal was confirmed cannot restore it when the response arrives afterwards', async () => {
    const { removalId } = recordRemoval('u1', 'wolf');
    useCreatureStore.setState({ creatures: [wolf()] });                          // local copy without the association
    let release; mockCloud.load = () => new Promise(resolve => { release = () => resolve(clone(Object.values(mockCloud.docs))); });
    render(<Probe />);
    let pending; await act(async () => { pending = api.loadCreatures(); await new Promise(r => setTimeout(r, 5)); });
    confirmRemoval('u1', 'wolf', removalId);                                     // the retry confirmed while the request was in flight
    await act(async () => { release(); await pending; });
    expect(local().authoredAbility).toBeUndefined();                             // the stale response (still has it) is not applied
  });
  test('deleting a creature prunes its pending removal', () => {
    recordRemoval('u1', 'wolf'); pruneCreature('u1', 'wolf');
    expect(pendingRemovals('u1').size).toBe(0);
  });
});
