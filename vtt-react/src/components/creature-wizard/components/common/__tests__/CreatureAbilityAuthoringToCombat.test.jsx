/**
 * Bestiary ability authoring → combat (real-path regression).
 *
 * Production implementations: Creature Wizard app + Step 3 ability editor, creature wizard/library context,
 * creatureStore (library, placement, template propagation), normalizeCreatureForWizard, A1 adapter
 * (definitionFromWizard), CreatureAbilityDetails + AuthoredAdmission (placed Inspect), userCreaturesService.
 *
 * Disclosed fixtures (nothing else is replaced):
 *  - The Spell Library is an in-memory list of Wizard-shaped records (same shape the Spell Wizard saves: outer record +
 *    `authoredDraft` + `authoredDefinitionId`).
 *  - The room authority is a fixture: `spellConsequenceService` network calls (open/admit/check/refresh) are jest
 *    functions, and the exact-actor binding is written to the placed token's `state.actorContract` (what `bindActor`
 *    returns from the server). No socket, server, Firebase, entitlement or payment engine runs here; execution
 *    semantics and payment are covered by the server suites and the identified-build witness.
 *  - Book preview / external preview / icon assets are stubbed (unrelated presentation).
 */
import React from 'react';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatureWizardApp, { normalizeCreatureForWizard } from '../../../CreatureWizardApp';
import CreatureAbilityEditor, { CreatureAbilityDetails } from '../CreatureAuthoredAbility';
import { CreatureWizardProvider, retainedCreatureDraft, useCreatureWizardDispatch, wizardActionCreators } from '../../../context/CreatureWizardContext';
import { CreatureLibraryProvider } from '../../../context/CreatureLibraryContext';
import { SpellLibraryStateContext, SpellLibraryProvider, useSpellLibraryDispatch } from '../../../../spellcrafting-wizard/context/SpellLibraryContext';
import useCreatureStore from '../../../../../store/creatureStore';
import useGameStore from '../../../../../store/gameStore';
import { definitionFromWizard, definitionSummary } from '../../../../../services/authoredAbility';
import { itemAbilitySupport } from '../../../../../services/itemAuthoredAbility';
import { transformAbilityToSpell } from '../../../../../utils/creatureAbilityUtils';
import * as consequence from '../../../../../services/spellConsequenceService';
import { canonical } from '../../../../../services/featherSlash';
import { refOf } from '../../../../../services/actorConsequenceService';

jest.mock('../../../../books/BookTtrpgBlocks', () => ({ normalizeDangerLevel: () => 'Medium', CREATURE_PRESETS: [] }));
jest.mock('../ExternalCreaturePreview', () => () => null);
// Persistence stand-in for the Spell Library only (plain functions: CRA resetMocks would wipe jest.fn implementations).
jest.mock('../../../../spellcrafting-wizard/core/utils/libraryManager', () => ({
  getDefaultLibrary: () => ({ spells: [], categories: [], collections: [] }), loadLibraryFromStorage: () => null, saveLibraryToStorage: () => true,
  categorizeSpell: () => [], generateUniqueId: () => 'generated-id', validateLibraryIntegrity: value => value, createDefaultCategories: () => []
}));
jest.mock('../../../../../utils/assetManager', () => ({ getIconUrl: () => 'i.png', getAbilityIconUrl: () => 'i.png', getCustomIconUrl: () => 'i.png' }));
jest.mock('../../../../../services/spellConsequenceService', () => ({
  ...jest.requireActual('../../../../../services/spellConsequenceService'),
  openCreatureAbility: jest.fn(), refreshAuthoredAbilities: jest.fn(), changeAuthoredAdmission: jest.fn(),
  checkAuthoredAdmission: jest.fn(), authoredRegistryWork: jest.fn()
}));

beforeAll(() => { Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true }); });

const clone = value => JSON.parse(JSON.stringify(value));
const deepFreeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(deepFreeze); Object.freeze(value); } return value; };
const EFFECT = 'authored-effect:v1';
const wizardRecord = (draft, authoredDefinitionId, libraryId, extra = {}) =>
  ({ ...clone(draft), ...extra, authoredDraft: draft, authoredDefinitionId, id: libraryId });
const ember = () => wizardRecord({
  name: 'Ember dart', description: 'A small hot dart.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'ember' },
  effectTypes: ['damage'], damageConfig: { damageType: 'direct', elementType: 'ember', formula: '2d6+1', resolution: 'DICE' },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['enemy'] },
  resourceCost: { actionPoints: 2, mana: 3 }
}, '10000000-0000-4000-8000-000000000001', 'lib-ember');
const quickening = (amount = 2, label = 'Quickened') => wizardRecord({
  name: amount > 0 ? 'Quickening' : 'Leaden hex', description: 'A flat Agility change.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'],
  controlConfig: { authoredCondition: { profile: EFFECT, effect: 'attribute', attribute: 'agility', attributeAmount: amount, label, expiryPolicy: 'gm-manual', durationText: 'While it holds', gmNote: 'GM resolves' } },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 }
}, '30000000-0000-4000-8000-000000000003', 'lib-quicken');
// A multi-effect Wizard record the A1 adapter does not support: it must stay manual with full authored data.
const manualRecord = () => { const r = ember(); r.authoredDraft.effectTypes = ['damage', 'debuff']; r.effectTypes = ['damage', 'debuff']; r.authoredDraft.debuffConfig = { note: 'Slows the target', unknownRider: { count: 0, enabled: false } }; r.debuffConfig = clone(r.authoredDraft.debuffConfig); r.authoredDraft.name = r.name = 'Manual dart'; r.id = 'lib-manual'; return r; };

const LEGACY = () => [{ name: 'Claw', range: 0, manaCost: null, targetingConfig: { maxTargets: 0 }, periodic: { unknown: true }, formula: '2d6+STR', triggerCondition: null, custom: { zero: 0, off: false } }, { name: 'Rich', effects: { complex: [1, null, { deep: true }] } }];
const baseCreature = (extra = {}) => ({ id: 'bestiary-wolf', name: 'Bestiary Wolf', description: 'A wolf.', type: 'beast', size: 'medium', stats: { maxHp: 40, maxMana: 12, maxActionPoints: 5, strength: 10, agility: 12, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 }, abilities: LEGACY(), custom: { keep: [0, false, null] }, ...extra });

let spellsInLibrary;
const library = () => spellsInLibrary;
const mountApp = (creature, onSave = jest.fn()) => render(
  <SpellLibraryStateContext.Provider value={{ spells: library() }}>
    <CreatureLibraryProvider><CreatureWizardProvider>
      <CreatureWizardApp initialCreature={creature} onSave={onSave} />
    </CreatureWizardProvider></CreatureLibraryProvider>
  </SpellLibraryStateContext.Provider>);
const goStep = n => fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${n}`) }));
const saveCreature = async () => { goStep(5); await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Save Creature/ })); }); };
const storeCreature = id => useCreatureStore.getState().creatures.find(c => c.id === id);
const pick = id => fireEvent.change(screen.getByLabelText('Compatible Spell Library definition'), { target: { value: id } });

beforeEach(() => {
  spellsInLibrary = [deepFreeze(ember()), deepFreeze(quickening()), deepFreeze(manualRecord())];
  useCreatureStore.setState({ creatures: [], creatureTokens: [], tokens: [] });
  useGameStore.setState({ isGMMode: true, isInMultiplayer: false, multiplayerRoom: null });
  consequence.useSpellConsequenceStore.setState({ authoredEntries: [], creatureSources: [], authoredRoomId: null });
  consequence.openCreatureAbility.mockResolvedValue({ success: true });
  consequence.refreshAuthoredAbilities.mockResolvedValue({ success: true });
  consequence.changeAuthoredAdmission.mockResolvedValue({ success: true, status: 'accepted live' });
  consequence.checkAuthoredAdmission.mockResolvedValue({ success: true });
  consequence.authoredRegistryWork.mockReturnValue(null);
});
afterEach(() => { cleanup(); jest.clearAllMocks(); });

describe('assign → save → reopen (production Creature Wizard)', () => {
  test.each([['damage', 'lib-ember', 'Ember dart'], ['Agility effect', 'lib-quicken', 'Quickening']])('%s: library pick is a detached whole snapshot that survives save and reopen; legacy abilities and manual data are untouched', async (_label, libraryId, name) => {
    const original = baseCreature(); const legacyBefore = clone(original.abilities);
    useCreatureStore.setState({ creatures: [clone(original)] });
    const librarySnapshot = clone(library().find(s => s.id === libraryId));
    const onSave = jest.fn();
    const ui = mountApp(clone(original), onSave);
    goStep(3);
    const options = within(screen.getByLabelText('Compatible Spell Library definition')).getAllByRole('option').map(o => o.textContent);
    expect(options).toContain(name);                            // saved Wizard ability is available in the picker
    expect(options).not.toContain('Manual dart');               // unsupported record is not offered, never guessed
    pick(libraryId);
    expect(screen.queryByText('Edit activated ability')).not.toBeInTheDocument(); // inspect before Keep: nothing kept yet
    fireEvent.click(screen.getByText('Keep ability on creature'));
    await saveCreature();
    expect(onSave).toHaveBeenCalledTimes(1);
    const saved = storeCreature('bestiary-wolf');
    expect(saved.authoredAbility).toEqual({ schemaVersion: 1, record: librarySnapshot, librarySpellId: libraryId });
    expect(saved.authoredAbility.record).not.toBe(library().find(s => s.id === libraryId)); // copy, not reference
    expect(saved.abilities).toEqual(legacyBefore);              // legacy association behaviour unchanged
    expect(saved.custom).toEqual(original.custom);
    expect(library().find(s => s.id === libraryId)).toEqual(librarySnapshot); // source record not mutated (frozen)
    expect(itemAbilitySupport(saved.authoredAbility).ok).toBe(true);
    ui.unmount();
    // Reopen through the normal helper and the real app: same association, same record, byte-equal on a second round trip.
    const reopened = normalizeCreatureForWizard(saved);
    expect(reopened.authoredAbility).toEqual(saved.authoredAbility);
    expect(reopened.abilities).toEqual(legacyBefore);
    mountApp(clone(saved)); goStep(3);
    expect(screen.getByText(/Supported immediate ACTION/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`^${name}$`), { selector: 'h3' })).toBeInTheDocument();
    await saveCreature();
    expect(storeCreature('bestiary-wolf').authoredAbility).toEqual(saved.authoredAbility);
    expect(storeCreature('bestiary-wolf').abilities).toEqual(legacyBefore);
  });

  test('unsupported record is visible as manual with its full authored information, is not offered by the picker, and cannot be admitted or cast', () => {
    const manual = { schemaVersion: 1, record: deepFreeze(manualRecord()), librarySpellId: 'lib-manual' };
    useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'room-1' } });
    render(<CreatureAbilityDetails association={manual} saved />);
    expect(screen.getByText(/Unsupported\/manual/)).toBeInTheDocument();
    expect(screen.getByText(/Slows the target/)).toBeInTheDocument();           // full authored JSON is inspectable
    expect(screen.getByText(/unknownRider/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Admit|Use for this creature|Bind/ })).not.toBeInTheDocument();
    expect(itemAbilitySupport(manual).ok).toBe(false);
  });
});

describe('picker is fed by the real Spell Library provider', () => {
  function Saver() { const dispatch = useSpellLibraryDispatch(); return <button onClick={() => [ember(), quickening(), manualRecord()].forEach(payload => dispatch({ type: 'ADD_SPELL_DIRECT', payload }))}>Save Wizard definitions</button>; }
  function Reset() { const dispatch = useCreatureWizardDispatch(); return <button onClick={() => dispatch(wizardActionCreators.resetWizard())}>Reset wizard</button>; }
  test('definitions saved by a nested Spellbook provider (ADD_SPELL_DIRECT, as the Wizard saves) are offered by the Creature selector; unsupported ones are not', () => {
    render(<SpellLibraryProvider>
      <SpellLibraryProvider><Saver /></SpellLibraryProvider>
      <CreatureWizardProvider><Reset /><CreatureAbilityEditor /></CreatureWizardProvider>
    </SpellLibraryProvider>);
    fireEvent.click(screen.getByText('Reset wizard'));
    fireEvent.click(screen.getByText('Save Wizard definitions'));
    const options = within(screen.getByLabelText('Compatible Spell Library definition')).getAllByRole('option').map(o => o.textContent);
    expect(options).toEqual(['Choose a saved definition to inspect', 'Ember dart', 'Quickening']);
    pick('lib-quicken');
    expect(screen.getByText(/Composed effects are edited in/)).toBeInTheDocument(); // inspect-before-Keep opens on the exact composed record, Keep retains it unchanged
    expect(screen.getByText('Keep ability on creature')).toBeInTheDocument();
  });
});

describe('remove an ability (explicit, template only)', () => {
  test('requires confirmation, keeps the placed instance, drops the key from the template and the saved library entry, and never crashes later placement', async () => {
    const original = baseCreature({ authoredAbility: { schemaVersion: 1, record: ember(), librarySpellId: 'lib-ember' } });
    useCreatureStore.setState({ creatures: [clone(original)] });
    useCreatureStore.getState().addCreatureToken('bestiary-wolf', { x: 100, y: 100 }, false, 'placed-before');
    const placedBefore = clone(useCreatureStore.getState().creatureTokens[0].authoredAbility);
    mountApp(clone(original)); goStep(3);
    fireEvent.click(screen.getByText('Remove activated ability'));
    expect(screen.getByText(/Creatures already placed keep their own copy/)).toBeInTheDocument();
    expect(screen.getByText('Confirm removal')).toHaveFocus();                  // focus moves into the confirmation
    fireEvent.click(screen.getByText('Keep it'));                               // cancel: nothing changes
    expect(screen.getByText('Remove activated ability')).toHaveFocus();         // and returns when declined
    expect(screen.getByText(/Supported immediate ACTION/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Remove activated ability'));
    fireEvent.click(screen.getByText('Confirm removal'));
    expect(screen.queryByText(/Supported immediate ACTION/)).not.toBeInTheDocument();
    expect(screen.getByText('Add activated ability')).toBeInTheDocument();
    expect(screen.getByLabelText('Compatible Spell Library definition')).toBeInTheDocument(); // re-assign is possible
    expect(retainedCreatureDraft('edit_bestiary-wolf')).toBeUndefined();         // no stale session draft resurrects it
    await saveCreature();
    expect(Object.prototype.hasOwnProperty.call(storeCreature('bestiary-wolf'), 'authoredAbility')).toBe(false);
    expect(storeCreature('bestiary-wolf').abilities).toEqual(original.abilities);
    expect(useCreatureStore.getState().creatureTokens.find(t => t.id === 'placed-before').authoredAbility).toEqual(placedBefore); // A3: old instances keep their copy
    // Placement after removal must not throw (JSON.parse(undefined) used to) and carries no association.
    expect(() => useCreatureStore.getState().addCreatureToken('bestiary-wolf', { x: 200, y: 100 }, false, 'placed-after')).not.toThrow();
    expect(useCreatureStore.getState().creatureTokens.find(t => t.id === 'placed-after').authoredAbility).toBeUndefined();
  });

  test('template updates that do not name the key (shop edits, renames) never remove the association', () => {
    const association = { schemaVersion: 1, record: ember(), librarySpellId: 'lib-ember' };
    useCreatureStore.setState({ creatures: [baseCreature({ authoredAbility: association })] });
    useCreatureStore.getState().updateCreature('bestiary-wolf', { shopInventory: { items: [] } });
    useCreatureStore.getState().updateCreature('bestiary-wolf', { name: 'Renamed', authoredAbility: association });
    expect(storeCreature('bestiary-wolf').authoredAbility).toEqual(association);
  });

  test('an unsaved removal is discarded when the window closes: reopening restores the saved association (nothing persists before Save)', () => {
    const original = baseCreature({ authoredAbility: { schemaVersion: 1, record: ember(), librarySpellId: 'lib-ember' } });
    useCreatureStore.setState({ creatures: [clone(original)] });
    const ui = mountApp(clone(original)); goStep(3);
    fireEvent.click(screen.getByText('Remove activated ability')); fireEvent.click(screen.getByText('Confirm removal'));
    ui.unmount();
    mountApp(clone(storeCreature('bestiary-wolf'))); goStep(3);
    expect(screen.getByText(/Supported immediate ACTION/)).toBeInTheDocument();
    expect(storeCreature('bestiary-wolf').authoredAbility.record.name).toBe('Ember dart');
  });

  test('removing an unsupported/manual association is also explicit and leaves its placed copy intact', () => {
    // Distinct id: session drafts are keyed by creature id and would otherwise resume the previous test's creature.
    const original = baseCreature({ id: 'manual-wolf', authoredAbility: { schemaVersion: 1, record: manualRecord(), librarySpellId: 'lib-manual' } });
    mountApp(clone(original)); goStep(3);
    expect(screen.getByText(/Unsupported\/manual/)).toBeInTheDocument();
    expect(screen.queryByText('Edit activated ability')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Remove activated ability'));
    expect(screen.getByText(/Unsupported\/manual/)).toBeInTheDocument();         // still visible until confirmed
  });

  test('cloud save: an explicit removal deletes the field (updateDoc would otherwise keep it); other updates never touch it', async () => {
    jest.resetModules();
    const updateDoc = jest.fn().mockResolvedValue(undefined), deleteField = jest.fn(() => ({ _methodName: 'deleteField', _args: [] }));
    jest.doMock('firebase/firestore', () => ({ collection: jest.fn(), doc: jest.fn(() => ({})), getDoc: jest.fn().mockResolvedValue({ exists: () => true, data: () => ({ userId: 'u1' }) }),
      getDocs: jest.fn(), addDoc: jest.fn(), setDoc: jest.fn(), updateDoc, deleteDoc: jest.fn(), query: jest.fn(), where: jest.fn(), orderBy: jest.fn(),
      serverTimestamp: jest.fn(), arrayUnion: jest.fn(), arrayRemove: jest.fn(), deleteField }));
    jest.doMock('../../../../../config/firebase', () => ({ db: {}, auth: { currentUser: { uid: 'u1' } }, isFirebaseConfigured: true, isDemoMode: false, isMockOrDevUser: () => false }));
    jest.doMock('../../../../../services/firebase/storageLimitService', () => ({ __esModule: true, default: {} }));
    const { updateUserCreature } = require('../../../../../services/firebase/userCreaturesService');
    await updateUserCreature('u1', 'bestiary-wolf', { name: 'Wolf', authoredAbility: undefined });
    expect(updateDoc.mock.calls[0][1].authoredAbility).toEqual({ _methodName: 'deleteField', _args: [] });
    await updateUserCreature('u1', 'bestiary-wolf', { name: 'Wolf renamed' });
    expect(Object.prototype.hasOwnProperty.call(updateDoc.mock.calls[1][1], 'authoredAbility')).toBe(false);
    jest.dontMock('firebase/firestore'); jest.dontMock('../../../../../config/firebase'); jest.dontMock('../../../../../services/firebase/storageLimitService');
  });
});

describe('placement → inspect → supported cast entry (placed creature, GM/shared room)', () => {
  let tokenSeq = 0; // addCreatureToken de-duplicates rapid placements of the same token id, so every test places a fresh one
  const place = (record, libraryId, tokenId = `placed-${++tokenSeq}`) => {
    const association = { schemaVersion: 1, record: clone(record), librarySpellId: libraryId };
    useCreatureStore.setState({ creatures: [baseCreature({ authoredAbility: association })], creatureTokens: [], tokens: [] });
    useCreatureStore.getState().addCreatureToken('bestiary-wolf', { x: 100, y: 100 }, false, tokenId);
    const token = useCreatureStore.getState().creatureTokens.find(t => t.id === tokenId);
    return { association, token };
  };
  const bind = token => {
    const binding = { version: 1, kind: 'creature', roomId: 'room-1', mapId: token.mapId, tokenId: token.id, instanceId: `incarnation-${token.id}` };
    useCreatureStore.setState(s => ({ creatureTokens: s.creatureTokens.map(t => t.id === token.id ? { ...t, state: { ...t.state, actorContract: binding } } : t), tokens: s.creatureTokens }));
    return refOf(useCreatureStore.getState().creatureTokens.find(t => t.id === token.id));
  };

  test.each([['damage', ember, 'lib-ember', /damage · 2d6\+1 ember.*2 AP \/ 3 mana · 30 ft · one enemy target/], ['Agility effect', () => quickening(-2, 'Leaden'), 'lib-quicken', /Leaden \(Agility [-\u2212]2\).*1 AP \/ 2 mana · 30 ft · one any target/]])(
    '%s: the placed creature shows its own exact price and effect, and the supported Use control reaches the existing cast entry for the exact bound actor only', async (_l, make, libraryId, expectedText) => {
      useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'room-1' } });
      const record = make(); const { association, token } = place(record, libraryId);
      expect(token.authoredAbility).toEqual(association);                                     // detached copy on the instance
      expect(token.authoredAbility).not.toBe(useCreatureStore.getState().creatures[0].authoredAbility);
      const view = render(<CreatureAbilityDetails association={token.authoredAbility} token={token} saved />);
      // Not yet bound: no cast control, only the explicit binding step. Association alone grants nothing.
      expect(screen.queryByRole('button', { name: 'Use for this creature' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Bind this placed creature' })).toBeInTheDocument();
      view.unmount();
      const ref = bind(token);
      render(<CreatureAbilityDetails association={token.authoredAbility} token={token} saved />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
      const mapped = definitionFromWizard(record, { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 });
      expect(mapped.ok).toBe(true); expect(definitionSummary(mapped.definition)).toBeTruthy();
      expect(screen.getByText('Admit for this creature')).toBeInTheDocument();                // normal exact-source admission, GM only
      fireEvent.click(screen.getByRole('button', { name: 'Use for this creature' }));
      expect(consequence.openCreatureAbility).toHaveBeenCalledTimes(1);
      expect(consequence.openCreatureAbility).toHaveBeenCalledWith(ref);                      // exact placed-source ref (refOf of the bound token), nothing else
      expect(ref).toMatchObject({ roomId: 'room-1', tokenId: token.id, instanceId: `incarnation-${token.id}` });
      expect(consequence.changeAuthoredAdmission).not.toHaveBeenCalled();                     // viewing/using never admits
    });

  test('observers and non-GM clients get no cast, bind or admit controls even for a supported, bound, admitted ability', () => {
    useGameStore.setState({ isGMMode: false, isInMultiplayer: true, multiplayerRoom: { id: 'room-1' } });
    const { token } = place(ember(), 'lib-ember'); bind(token);
    render(<CreatureAbilityDetails association={token.authoredAbility} token={token} saved />);
    expect(screen.queryByRole('button', { name: /Use for this creature|Bind this placed creature|Admit for this creature/ })).not.toBeInTheDocument();
  });

  test('unsupported association on a bound placed creature: manual status, full data, no Use/Admit control', () => {
    useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'room-1' } });
    const { token } = place(manualRecord(), 'lib-manual'); bind(token);
    render(<CreatureAbilityDetails association={token.authoredAbility} token={token} saved />);
    expect(screen.getByText(/Unsupported\/manual/)).toBeInTheDocument();
    expect(screen.getByText(/unknownRider/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Use for this creature|Admit for this creature/ })).not.toBeInTheDocument();
    expect(consequence.openCreatureAbility).not.toHaveBeenCalled();
  });

  test('version binding: the template edit does not change an already placed creature, and the admitted version is the one the room snapshot names', () => {
    useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'room-1' } });
    const v1 = ember(); const { token } = place(v1, 'lib-ember'); const ref = bind(token);
    const v1Definition = definitionFromWizard(v1, { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 }).definition;
    const definitionRef = { definitionId: v1.authoredDefinitionId, roomId: 'room-1', definitionVersion: 1, definitionHash: 'h1' };
    consequence.useSpellConsequenceStore.setState({ authoredRoomId: 'room-1', authoredEntries: [{ definitionRef, canonicalDefinition: v1Definition, revoked: false }],
      creatureSources: [{ source: ref, association: clone(token.authoredAbility), admission: { definitionRef } }] });
    // GM edits the template (new ability content) and saves: placed token must keep v1.
    const v2 = ember(); v2.authoredDraft.damageConfig.formula = '4d6'; v2.damageConfig.formula = '4d6'; v2.authoredDraft.name = v2.name = 'Ember dart II';
    useCreatureStore.getState().updateCreature('bestiary-wolf', { id: 'bestiary-wolf', name: 'Bestiary Wolf', authoredAbility: { schemaVersion: 1, record: v2, librarySpellId: 'lib-ember' } });
    expect(useCreatureStore.getState().creatures[0].authoredAbility.record.name).toBe('Ember dart II');
    expect(useCreatureStore.getState().creatureTokens[0].authoredAbility.record.name).toBe('Ember dart');
    render(<CreatureAbilityDetails association={useCreatureStore.getState().creatureTokens[0].authoredAbility} token={useCreatureStore.getState().creatureTokens[0]} saved />);
    expect(screen.getByRole('heading', { name: 'Ember dart' })).toBeInTheDocument();
    expect(screen.getByText(/Admitted for immediate damage\/healing · version 1/)).toBeInTheDocument();   // installed v1 still matches this copy
    // A different placed creature copy of the NEW template shows 'Changed since admitted version' for that source until re-admitted.
    expect(canonical(definitionFromWizard(v2, { roomId: 'room-1', classId: 'arcanoneer', definitionVersion: 1 }).definition)).not.toBe(canonical(v1Definition));
  });
});

// Opus's immediate + periodic composition is definition-compatible but, for now, automated for a primary owner PC source only.
const periodicRecord = () => wizardRecord({
  name: 'Cinder brand', description: 'Immediate damage plus ticks.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['damage', 'control'],
  damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' },
  controlConfig: { authoredCondition: { profile: EFFECT, effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Cinder Brand',
    expiryPolicy: 'target-start-count', occurrences: 3, durationText: 'While the cinders glow', gmNote: 'GM resolves range before confirming.' } },
  targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 }
}, '60000000-0000-4000-8000-000000000001', 'lib-cinder');

describe('creature-source eligibility feedback (definition compatibility is not creature execution)', () => {
  test('the shared check names the PC-only compositions and leaves creature-eligible definitions alone', () => {
    const { creatureSourceRefusal } = require('../../../../../services/authoredAbility');
    const periodic = definitionFromWizard(periodicRecord(), { roomId: 'r', classId: 'arcanoneer', definitionVersion: 1 });
    expect(periodic.ok).toBe(true);
    expect(creatureSourceRefusal(periodic.definition)).toMatchObject({ code: 'unsupported_source_route', reason: expect.stringMatching(/immediate \+ periodic.*primary owner PC source/) });
    for (const record of [ember(), quickening(-2, 'Leaden')]) expect(creatureSourceRefusal(definitionFromWizard(record, { roomId: 'r', classId: 'arcanoneer', definitionVersion: 1 }).definition)).toBeNull();
  });
  test('Creature Wizard: the picker still offers it, but the card says a creature source cannot execute it; keep stays possible and nothing is admitted', async () => {
    spellsInLibrary = [deepFreeze(periodicRecord()), deepFreeze(quickening())];
    useCreatureStore.setState({ creatures: [baseCreature({ id: 'periodic-wolf' })] });   // distinct id: session drafts are keyed by creature id
    mountApp(baseCreature({ id: 'periodic-wolf' })); goStep(3);
    pick('lib-cinder');
    expect(screen.getByText(/compatible with the Spell Library adapter, but a creature source cannot execute it/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Keep ability on creature'));
    expect(screen.getByText(/Compatible definition, not executable by a creature source/)).toBeInTheDocument();
    expect(screen.queryByText(/Supported immediate ACTION/)).not.toBeInTheDocument();
    expect(screen.queryByText('Admit for this creature')).not.toBeInTheDocument();
    await saveCreature();
    expect(storeCreature('periodic-wolf').authoredAbility.record).toEqual(periodicRecord());      // whole record preserved
    expect(consequence.changeAuthoredAdmission).not.toHaveBeenCalled();
  });
  test('an eligible Agility definition still shows as supported in the same editor (no regression)', () => {
    mountApp(baseCreature({ id: 'agility-wolf' })); goStep(3); pick('lib-quicken');
    expect(screen.queryByText(/cannot execute it/)).not.toBeInTheDocument();
  });
  test('a bound placed creature with the periodic composition offers no Admit or Use control; the whole definition stays visible', () => {
    useGameStore.setState({ isGMMode: true, isInMultiplayer: true, multiplayerRoom: { id: 'room-1' } });
    const association = { schemaVersion: 1, record: periodicRecord(), librarySpellId: 'lib-cinder' };
    useCreatureStore.setState({ creatures: [baseCreature({ authoredAbility: association })], creatureTokens: [], tokens: [] });
    useCreatureStore.getState().addCreatureToken('bestiary-wolf', { x: 100, y: 100 }, false, 'periodic-placed');
    const token0 = useCreatureStore.getState().creatureTokens.find(t => t.id === 'periodic-placed');
    const binding = { version: 1, kind: 'creature', roomId: 'room-1', mapId: token0.mapId, tokenId: token0.id, instanceId: 'incarnation-periodic-placed' };
    useCreatureStore.setState(s => ({ creatureTokens: s.creatureTokens.map(t => t.id === token0.id ? { ...t, state: { ...t.state, actorContract: binding } } : t), tokens: s.creatureTokens }));
    const token = useCreatureStore.getState().creatureTokens.find(t => t.id === 'periodic-placed');
    render(<CreatureAbilityDetails association={token.authoredAbility} token={token} saved />);
    expect(screen.getByRole('region', { name: 'Execution compatibility' })).toHaveAttribute('data-state', 'unsupported');
    expect(screen.getByText(/Compatible definition, not executable by a creature source/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Use for this creature' })).not.toBeInTheDocument();
    expect(screen.queryByText('Admit for this creature')).not.toBeInTheDocument();
    expect(screen.getByText('Inspect whole preserved definition')).toBeInTheDocument();
    expect(consequence.openCreatureAbility).not.toHaveBeenCalled();
  });
});

describe('repeated conversion keeps the full authored data (adapter)', () => {
  test('transformAbilityToSpell is idempotent on a Wizard-shaped ability and never mutates its frozen source', () => {
    const source = deepFreeze({ ...ember(), manualMechanics: { executable: false, notes: '', extra: [0, null] }, unknownRider: { zero: 0, off: false } });
    const before = clone(source);
    const first = transformAbilityToSpell(source), second = transformAbilityToSpell(deepFreeze(clone(first)));
    expect(first).toMatchObject(before);
    expect(first.damageConfig).toEqual(before.damageConfig);
    expect(first.resourceCost).toEqual(before.resourceCost);
    expect(transformAbilityToSpell(deepFreeze(clone(second)))).toEqual(second);
    expect(source).toEqual(before);
  });
});
