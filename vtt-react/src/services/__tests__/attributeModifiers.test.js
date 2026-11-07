/** Attribute buff/debuff (flat Agility family): shared record/plan/consent rules, Wizard mapping, and the client
 * consumer path — room record → hydrateActorConditions → sheet aggregation → combatAttributes → spell formula and
 * basic strike — counted once, restored on removal, never doubled by repeated hydration. */
import useCharacterStore from '../../store/characterStore';
import useConditionStore from '../../store/conditionStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import { registerStore } from '../../store/storeRegistry';
import { combatAttributes } from '../combatAttributes';
import { readFormula } from '../spellConsequence';
import { supportStrike } from '../weaponStrike';
import { hydrateActorConditions, selectOwnerAttachment } from '../actorConsequenceService';
import { getEffectiveAttributes } from '../../utils/attributeProfile';
import * as profile from '../sharedConditionProfile';
import * as effect from '../authoredEffect';
import { definitionFromWizard, definitionSummary, EFFECT_CAPABILITY } from '../authoredAbility';

const ID = '20000000-0000-4000-8000-000000000001';
const DEF = `authored:30000000-0000-4000-8000-000000000003:1:${'a'.repeat(64)}`;
const target = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc2', instanceId: 'i2', ownerUid: 'u2', characterId: 'c2' };
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i1', ownerUid: 'u1', characterId: 'c1' };
const make = (amount = 2, extra = {}) => profile.makeAttributeRecord(target, extra.id || ID, Object.assign({ sourceOccurrence: `authored-effect:${extra.id || ID}`, timing: 'manual',
  authoredDuration: 'While the charm holds', attribute: 'agility', amount, label: amount > 0 ? 'Quickened' : 'Leaden', sourceActor: source, effectDefinition: DEF }, extra));
const publicForm = record => { const { sourceActor, effectDefinition, ...rest } = record; return rest; }; // what a PC target's public view carries

describe('shared attribute-modifier record and plan', () => {
  test('exact record: one signed key, buff/debuff polarity, required identity pair, public form still valid', () => {
    const plus = make(2), minus = make(-2);
    expect(plus).toMatchObject({ type: 'buff', effects: { agility: 2 }, effectOrigin: profile.ATTRIBUTE.origin, effectDefinition: DEF, stackable: false });
    expect(minus).toMatchObject({ type: 'debuff', effects: { agility: -2 } });
    expect(profile.isAttributeModifier(plus)).toBe(true);
    expect(profile.isAttributeModifier(publicForm(plus))).toBe(true);
    expect(profile.attributeModifierOf(publicForm(minus))).toEqual({ attribute: 'agility', amount: -2 });
    for (const bad of [{ attribute: 'strength' }, { amount: 0 }, { amount: 6 }, { amount: 1.5 }, { label: '' }, { effectDefinition: undefined }, { sourceActor: undefined }, { sourceOccurrence: 'class-effect:x' }])
      expect(() => make(2, bad)).toThrow();
    // A tampered value or second key is no longer a managed record.
    expect(profile.isAttributeModifier({ ...plus, effects: { agility: 4 } })).toBe(false);
    expect(profile.isAttributeModifier({ ...plus, effects: { agility: 2, strength: 1 } })).toBe(false);
    expect(profile.isMovementModifier(plus)).toBe(false); expect(profile.isStunned(plus)).toBe(false);
  });
  test('one shared calculation: breakdown and totals add each validated change once; no clamp is invented', () => {
    const conditions = [make(-2), { name: 'Unrelated', effects: { movementSpeed: -10 } }];
    expect(profile.attributeBreakdown(14, conditions, 'agility')).toMatchObject({ before: 14, total: -2, result: 12, negative: false });
    expect(profile.attributeBreakdown(1, conditions, 'agility')).toMatchObject({ result: -1, negative: true });
    expect(profile.attributeBreakdown(14, conditions, 'strength')).toMatchObject({ total: 0, result: 14 });
    expect(profile.attributeModifierTotals(conditions)).toEqual({ agility: -2 });
  });
  test('combination (D-ATTR-1 open): a second change to the same attribute refuses whole, whatever its source', () => {
    const active = [make(2)];
    expect(profile.attributeCombination([], make(2))).toEqual({ ok: true, outcome: 'added', replaces: null });
    expect(profile.attributeCombination(active, make(2))).toMatchObject({ ok: false, code: 'condition_id_conflict' });
    expect(profile.attributeCombination(active, make(-1, { id: '20000000-0000-4000-8000-000000000002' }))).toMatchObject({ ok: false, code: 'attribute_combination_unresolved' });
    expect(profile.attributeCombination([{ name: 'Manual Grace', effects: { agility: 1 } }], make(2))).toMatchObject({ ok: false, code: 'attribute_combination_unresolved' });
    expect(profile.attributeCombination([{ name: 'Manual Might', effects: { strength: 1 } }], make(2)).ok).toBe(true);
  });
  test('bundle mapping: record, plan and consent polarity reuse the existing A9/M3A rules', () => {
    const terms = c => ({ direct: null, condition: c, timing: { expiryPolicy: 'gm-manual', durationText: 'x', authoredDuration: null, gmNote: 'n' } });
    const plus = { kind: 'attribute', attribute: 'agility', amount: 2, label: 'Quickened' }, minus = { ...plus, amount: -2, label: 'Leaden' };
    expect(effect.pcConsent(terms(plus), 'character')).toMatchObject({ ok: true, rider: 'beneficial', acceptanceRequired: true });
    expect(effect.pcConsent(terms(minus), 'character')).toMatchObject({ ok: true, rider: 'hostile', designatable: true });
    expect(effect.pcConsent({ ...terms(plus), direct: { kind: 'damage', formula: '1d4', damageTypes: ['wyrd'] } }, 'character').code).toBe('pc_target_consent_conflict');
    const approval = { approvalId: ID, source, target, spell: { definitionId: DEF }, effectTerms: terms(plus) };
    expect(effect.recordFor(approval)).toEqual(make(2, { authoredDuration: 'x' }));
    expect(effect.conditionPlan(approval, []).combination).toEqual({ outcome: 'added', replacesInstanceId: null });
    expect(effect.conditionPlan(approval, [{ name: 'Manual', effects: { agility: 1 } }]).refused.code).toBe('attribute_combination_unresolved');
    expect(effect.describe(terms(plus))).toMatch(/Quickened \(Agility \+2\)/);
  });
});

describe('Spell Wizard record → definition', () => {
  const record = (c, extra) => {
    const d = { name: 'Quickening', description: 'x', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'],
      controlConfig: { authoredCondition: { profile: EFFECT_CAPABILITY, effect: 'attribute', attribute: 'agility', attributeAmount: 2, label: 'Quickened', expiryPolicy: 'gm-manual', durationText: 'While it holds', gmNote: 'GM resolves', ...c } },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 } };
    if (extra) extra(d);
    return { ...JSON.parse(JSON.stringify(d)), authoredDraft: d, authoredDefinitionId: '30000000-0000-4000-8000-000000000003' };
  };
  const map = r => definitionFromWizard(r, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
  test('positive and negative changes map to exact conditions; save/reopen of the same record maps identically', () => {
    const plus = map(record({})), minus = map(record({ attributeAmount: -3, label: 'Leaden' }));
    expect(plus.definition.effects.condition).toEqual({ kind: 'attribute', attribute: 'agility', amount: 2, label: 'Quickened' });
    expect(minus.definition.effects.condition).toEqual({ kind: 'attribute', attribute: 'agility', amount: -3, label: 'Leaden' });
    const reopened = JSON.parse(JSON.stringify(record({})));
    expect(map(reopened)).toEqual(plus);
    expect(definitionSummary(plus.definition)).toMatch(/Quickened \(Agility \+2\)/);
  });
  test('unsupported or conflicting shapes stay manual with a reason', () => {
    for (const c of [{ attribute: 'strength' }, { attributeAmount: 0 }, { attributeAmount: 9 }, { attributeAmount: '2' }, { label: undefined }, { movementFeet: 5 }])
      expect(map(record(c))).toMatchObject({ ok: false, code: 'unsupported_wizard_record' });
    expect(map(record({}, d => { d.buffConfig = { effects: [{ statModifier: { stat: 'agility', magnitude: 2 } }] }; })).ok).toBe(false);
  });
});

describe('client consumer path: room record → sheet aggregation → spell formula and strike', () => {
  const ref = target;
  const character = { id: 'c2', currentCharacterId: 'c2', race: null, subrace: null, statsModel: 'base+earned@1',
    baseStats: { strength: 10, agility: 13, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
    stats: { strength: 10, agility: 13, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 }, levelUpHistory: {}, class: 'Arcanoneer',
    equipment: { ranged: { id: 'bow-1', name: 'Short Bow', weaponType: 'bow', subtype: 'bow', weaponStats: { baseDamage: { diceCount: 1, diceType: 'd8', damageType: 'stabbing' } } } } };
  const pcToken = conditions => ({ id: 'pc2', ownerUserId: 'u2', character: { id: 'c2', health: { current: 20, max: 30 } },
    state: { conditions, actorContract: { version: 1, ...ref, revision: 3, primary: true } } });
  beforeAll(async() => {
    // Let persisted stores finish their own asynchronous rehydration before the fixture state is set.
    for (const store of [useCharacterStore, useConditionStore, useCharacterTokenStore, useCreatureStore, useGameStore, useAuthStore]) await store.persist?.rehydrate?.();
    await new Promise(r => setTimeout(r, 0));
  });
  beforeEach(() => {
    for (const [name, store] of [['characterStore', useCharacterStore], ['conditionStore', useConditionStore], ['characterTokenStore', useCharacterTokenStore], ['creatureStore', useCreatureStore], ['gameStore', useGameStore], ['authStore', useAuthStore]]) registerStore(name, store);
    // Account/character first: their change listeners may reset room state, which is then set last.
    useAuthStore.setState({ user: { uid: 'u2' } });
    useCharacterStore.setState({ ...character });
    useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'r' } });
    useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] });
    useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  });
  const install = conditions => { useCharacterTokenStore.setState({ characterTokens: [pcToken(conditions)] }); expect(selectOwnerAttachment(ref).success).toBe(true); hydrateActorConditions(); };
  const sheet = () => useCharacterStore.getState();
  test.each([['intelligence', 2], ['spirit', -2]])('%s reaches its formula once through heritage, earned stats, equipment and the room record; exact removal restores', (attribute, amount) => {
    useCharacterStore.setState({ ...character, race: 'human', subrace: 'thalren_human', background: 'sanctuarySeneschal',
      baseStats: { ...character.baseStats, [attribute]: 12 }, stats: { ...character.stats, [attribute]: 13 },
      levelUpHistory: { 2: { attributes: [attribute] } },
      equipment: { ...character.equipment, ring1: { id: 'ring', name: 'Ring', baseStats: { [attribute]: { value: 1 } } } } });
    install([]);
    const before = combatAttributes(sheet())[attribute], stored = JSON.parse(JSON.stringify({ stats: sheet().stats, baseStats: sheet().baseStats, levelUpHistory: sheet().levelUpHistory, health: sheet().health, mana: sheet().mana }));
    expect(before).toBe(getEffectiveAttributes(sheet())[attribute] + 1);
    const record = publicForm(make(amount, { attribute })); install([record]);
    hydrateActorConditions(); hydrateActorConditions();
    expect(combatAttributes(sheet())[attribute]).toBe(before + amount);
    expect(readFormula(`1d6 + ${attribute}`, combatAttributes(sheet())).constant).toBe(before + amount);
    expect(sheet().stats[attribute]).toBe(13); expect(sheet().baseStats[attribute]).toBe(12);
    expect({ stats: sheet().stats, baseStats: sheet().baseStats, levelUpHistory: sheet().levelUpHistory, health: sheet().health, mana: sheet().mana }).toEqual(stored);
    expect(useConditionStore.getState()[amount > 0 ? 'activeBuffs' : 'activeDebuffs'].filter(r => r.recordId === ID)).toHaveLength(1);
    install([]); expect(readFormula(`1d6 + ${attribute}`, combatAttributes(sheet())).constant).toBe(before);
    // Another exact actor's otherwise valid modifier must never enter this owner's sheet.
    const other = { ...target, tokenId: 'other', instanceId: 'other-instance', ownerUid: 'other-owner', characterId: 'other-character' };
    const foreign = profile.makeAttributeRecord(other, ID, { sourceOccurrence: `authored-effect:${ID}`, timing: 'manual', authoredDuration: 'x', attribute, amount, label: 'Foreign' });
    useCharacterTokenStore.setState({ characterTokens: [pcToken([]), { id: 'other', state: { conditions: [foreign], actorContract: { version: 1, ...other, primary: true, revision: 1 } } }] });
    hydrateActorConditions(); expect(combatAttributes(sheet())[attribute]).toBe(before);
  });
  test.each([[-2, 11, 0], [2, 15, 2]])('a %i change moves the live score once, the formula constant and the strike modifier, and removal restores them', (amount, score, modifier) => {
    install([]);
    const before = combatAttributes(sheet()).agility;
    expect(before).toBe(getEffectiveAttributes(sheet()).agility);
    expect(supportStrike({ id: 'ranged_standard_attack' }, sheet()).weapon).toMatchObject({ attribute: 'agility', score: 13, modifier: 1 });
    install([publicForm(make(amount))]);
    expect(combatAttributes(sheet()).agility).toBe(before + amount);
    expect(combatAttributes(sheet()).agility).toBe(profile.attributeBreakdown(before, useCharacterTokenStore.getState().characterTokens[0].state.conditions, 'agility').result);
    expect(score).toBe(before + amount);
    expect(readFormula('1d6 + agility', combatAttributes(sheet())).constant).toBe(score);
    expect(supportStrike({ id: 'ranged_standard_attack' }, sheet()).weapon).toMatchObject({ score, modifier });
    // Reload/reconnect hydration repeats: still exactly one application.
    hydrateActorConditions(); hydrateActorConditions();
    expect(useConditionStore.getState()[amount > 0 ? 'activeBuffs' : 'activeDebuffs'].filter(r => r.recordId === ID)).toHaveLength(1);
    expect(combatAttributes(sheet()).agility).toBe(before + amount);
    // Base/earned stats are untouched by the modifier.
    expect(sheet().stats.agility).toBe(13); expect(sheet().baseStats.agility).toBe(13);
    install([]);
    expect(combatAttributes(sheet()).agility).toBe(before);
    expect(supportStrike({ id: 'ranged_standard_attack' }, sheet()).weapon).toMatchObject({ score: 13, modifier: 1 });
  });
  test('equipment, heritage and origin stay counted once alongside the modifier', () => {
    const withGear = { ...character, equipment: { ...character.equipment, ring: { id: 'ring', name: 'Ring', baseStats: { agility: { value: 1 } } } } };
    useCharacterStore.setState(withGear);
    install([]); const withEquipment = combatAttributes(sheet()).agility;
    expect(withEquipment).toBe(14); // 13 sheet + 1 equipment
    install([publicForm(make(2))]);
    expect(combatAttributes(sheet()).agility).toBe(withEquipment + 2);
    expect(getEffectiveAttributes(sheet()).agility).toBe(13);
    // Heritage and origin (explicit model): composed once by the shared helper, the modifier adds on top once.
    useCharacterStore.setState({ ...withGear, race: 'vreken', subrace: 'clean_vreken', background: 'sanctuarySeneschal' });
    install([]); const composed = getEffectiveAttributes(sheet()).agility;
    expect(combatAttributes(sheet()).agility).toBe(composed + 1);
    install([publicForm(make(-2))]);
    expect(combatAttributes(sheet()).agility).toBe(composed + 1 - 2);
    expect(getEffectiveAttributes(sheet()).agility).toBe(composed);
  });
  test('another actor\'s change does not reach this sheet', () => {
    const other = { ...target, tokenId: 'pc3', instanceId: 'i3', ownerUid: 'u3', characterId: 'c3' };
    const foreign = profile.makeAttributeRecord(other, ID, { sourceOccurrence: `authored-effect:${ID}`, timing: 'manual', authoredDuration: 'x', attribute: 'agility', amount: 2, label: 'Quickened' });
    useCharacterTokenStore.setState({ characterTokens: [pcToken([]), { id: 'pc3', ownerUserId: 'u3', character: { id: 'c3' }, state: { conditions: [foreign], actorContract: { version: 1, ...other, revision: 1, primary: true } } }] });
    selectOwnerAttachment(ref); hydrateActorConditions();
    expect(combatAttributes(sheet()).agility).toBe(13);
  });
});
