/** Shared flat damage-reduction effects (positive flat DR +1..+20):
 * - shared record/plan/consent rules (sharedConditionProfile + authoredEffect);
 * - Spell Wizard mapping and refusal of unsupported/unresolved combinations (authoredAbility);
 * - client combat & sheet consumers:
 *   1) P12A classifyDefenses / planStrikeCommand (automated flatDr once on non-critical hit; manual on critical or resistance tier);
 *   2) PC room record → hydrateActorConditions → getTotalStatsWithEffects().damageReduction (counted once, base stats untouched, F7 character switching/reload isolated, exact removal restores);
 *   3) P12B planBlockCommand + Defending coexistence (block reduction and wear untouched; flat DR is never silently auto-subtracted a second time). */
import useCharacterStore from '../../store/characterStore';
import useConditionStore from '../../store/conditionStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useCreatureStore from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import { registerStore } from '../../store/storeRegistry';
import { combatAttributes } from '../combatAttributes';
import { classifyDefenses, planStrikeCommand } from '../weaponStrike';
import { planBlockCommand } from '../equipmentBlocking';
import { hydrateActorConditions, selectOwnerAttachment } from '../actorConsequenceService';
import * as profile from '../sharedConditionProfile';
import * as effect from '../authoredEffect';
import { definitionFromWizard, definitionSummary, EFFECT_CAPABILITY } from '../authoredAbility';

const ID = '40000000-0000-4000-8000-000000000001';
const DEF = `authored:50000000-0000-4000-8000-000000000005:1:${'b'.repeat(64)}`;
const target = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc2', instanceId: 'i2', ownerUid: 'u2', characterId: 'c2' };
const foeRef = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'foe', instanceId: 'ifoe' };
const source = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc', instanceId: 'i1', ownerUid: 'u1', characterId: 'c1' };

const make = (amount = 3, extra = {}) => profile.makeDamageReductionRecord(
  extra.target || target,
  extra.id || ID,
  Object.assign({
    sourceOccurrence: `authored-effect:${extra.id || ID}`,
    timing: 'manual',
    authoredDuration: 'Until the ward fades',
    amount,
    label: 'Aegis Ward',
    sourceActor: source,
    effectDefinition: DEF
  }, extra)
);
const publicForm = record => { const { sourceActor, effectDefinition, ...rest } = record; return rest; };

describe('shared damage-reduction modifier record and plan', () => {
  test('exact record: positive integer flat DR (+1..+20), buff polarity, required identity pair, public PC form still valid', () => {
    const rec = make(3);
    expect(rec).toMatchObject({
      type: 'buff',
      conditionKey: 'damage-reduction-modifier',
      effects: { damageReduction: 3 },
      effectOrigin: profile.DAMAGE_REDUCTION.origin,
      effectDefinition: DEF,
      stackable: false
    });
    expect(profile.isDamageReductionModifier(rec)).toBe(true);
    expect(profile.isDamageReductionModifier(publicForm(rec))).toBe(true);
    expect(profile.damageReductionModifierOf(publicForm(rec))).toEqual({ amount: 3 });

    for (const bad of [
      { amount: 0 }, { amount: -1 }, { amount: -3 }, { amount: 21 }, { amount: 1.5 },
      { label: '' }, { label: ' Padded ' }, { effectDefinition: undefined }, { sourceActor: undefined }, { sourceOccurrence: 'class-effect:x' }
    ]) {
      expect(() => make(3, bad)).toThrow();
    }

    expect(profile.isDamageReductionModifier({ ...rec, effects: { damageReduction: 5 } })).toBe(false);
    expect(profile.isDamageReductionModifier({ ...rec, effects: { damageReduction: 3, agility: 1 } })).toBe(false);
    expect(profile.isAttributeModifier(rec)).toBe(false);
    expect(profile.isMovementModifier(rec)).toBe(false);
  });

  test('breakdown and totals add each validated flat DR record once', () => {
    const conditions = [make(3), { name: 'Unrelated', effects: { agility: 2 } }];
    expect(profile.damageReductionBreakdown(0, conditions)).toMatchObject({ before: 0, total: 3, result: 3 });
    expect(profile.damageReductionBreakdown(2, conditions)).toMatchObject({ before: 2, total: 3, result: 5 });
    expect(profile.damageReductionTotal(conditions)).toBe(3);
  });

  test('combination (D-DR-1 open): a second flat DR change on the same actor refuses whole, whatever its source', () => {
    const active = [make(3)];
    expect(profile.damageReductionCombination([], make(3))).toEqual({ ok: true, outcome: 'added', replaces: null });
    expect(profile.damageReductionCombination(active, make(3))).toMatchObject({ ok: false, code: 'condition_id_conflict' });
    expect(profile.damageReductionCombination(active, make(2, { id: '40000000-0000-4000-8000-000000000002' }))).toMatchObject({
      ok: false,
      code: 'damage_reduction_combination_unresolved'
    });
    expect(profile.damageReductionCombination([{ name: 'Bark Skin', effects: { damageReduction: 2 } }], make(3))).toMatchObject({
      ok: false,
      code: 'damage_reduction_combination_unresolved'
    });
    expect(profile.damageReductionCombination([{ name: 'Quickened', effects: { agility: 2 } }], make(3)).ok).toBe(true);
  });

  test('bundle mapping: record, plan and consent polarity reuse existing A9/M3A rules', () => {
    const terms = c => ({ direct: null, condition: c, timing: { expiryPolicy: 'gm-manual', durationText: 'Until the ward fades', authoredDuration: null, gmNote: 'GM note' } });
    const ward = { kind: 'damageReduction', amount: 3, label: 'Aegis Ward' };
    expect(effect.pcConsent(terms(ward), 'character')).toMatchObject({ ok: true, rider: 'beneficial', acceptanceRequired: true });
    expect(effect.pcConsent({ ...terms(ward), direct: { kind: 'damage', formula: '1d4', damageTypes: ['arcane'] } }, 'character').code).toBe('pc_target_consent_conflict');
    const approval = { approvalId: ID, source, target, spell: { definitionId: DEF }, effectTerms: terms(ward) };
    expect(effect.recordFor(approval)).toEqual(make(3, { authoredDuration: 'Until the ward fades' }));
    expect(effect.conditionPlan(approval, []).combination).toEqual({ outcome: 'added', replacesInstanceId: null });
    expect(effect.conditionPlan(approval, [{ name: 'Manual DR', effects: { damageReduction: 1 } }]).refused.code).toBe('damage_reduction_combination_unresolved');
    expect(effect.describe(terms(ward))).toMatch(/Aegis Ward \(Flat DR \+3\)/);
  });
});

describe('Spell Wizard record → definition for flat DR', () => {
  const record = (c, extra) => {
    const d = {
      name: 'Aegis Ward', description: 'Protective ward.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'],
      controlConfig: { authoredCondition: { profile: EFFECT_CAPABILITY, effect: 'damageReduction', drAmount: 3, label: 'Aegis Ward', expiryPolicy: 'gm-manual', durationText: 'Until the ward fades', gmNote: 'GM note', ...c } },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
      resourceCost: { actionPoints: 1, mana: 2 }
    };
    if (extra) extra(d);
    return { ...JSON.parse(JSON.stringify(d)), authoredDraft: d, authoredDefinitionId: '50000000-0000-4000-8000-000000000005' };
  };
  const map = r => definitionFromWizard(r, { roomId: 'r', definitionVersion: 1, classId: 'spellguard' });

  test('positive flat DR (+1..+20) maps to exact condition; save/reopen maps identically', () => {
    const mapped = map(record({}));
    expect(mapped.ok).toBe(true);
    expect(mapped.definition.effects.condition).toEqual({ kind: 'damageReduction', amount: 3, label: 'Aegis Ward' });
    const reopened = JSON.parse(JSON.stringify(record({})));
    expect(map(reopened)).toEqual(mapped);
    expect(definitionSummary(mapped.definition)).toMatch(/Aegis Ward \(Flat DR \+3\)/);
  });

  test('0, negative, >20, save branch, buffConfig and mixed fields stay refused with a clear reason', () => {
    for (const c of [
      { drAmount: 0 }, { drAmount: -1 }, { drAmount: -3 }, { drAmount: 21 }, { drAmount: '3' },
      { label: '' }, { movementFeet: 5 }, { attribute: 'agility' }, { attributeAmount: 2 },
      { save: { ability: 'constitution', dc: 12, outcome: 'negates' } }
    ]) {
      expect(map(record(c))).toMatchObject({ ok: false, code: 'unsupported_wizard_record' });
    }
    expect(map(record({}, d => { d.buffConfig = { effects: [{ statModifier: { stat: 'armor', magnitude: 3 } }] }; })).ok).toBe(false);
  });
});

describe('client combat and sheet consumers: P12A strike, PC sheet + F7 switch/reload, and P12B equipment blocking + Defending', () => {
  const ref = target;
  const character = {
    id: 'c2', currentCharacterId: 'c2', name: 'Striker', race: null, subrace: null, statsModel: 'base+earned@1',
    baseStats: { strength: 10, agility: 14, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
    stats: { strength: 10, agility: 14, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
    damageReduction: 0, levelUpHistory: {}, class: 'Spellguard',
    health: { current: 25, max: 30 }, tempHealth: 0,
    actionPoints: { current: 6, max: 6 }, tempActionPoints: 0,
    equipment: {
      ranged: { id: 'bow-1', name: 'Short Bow', weaponType: 'bow', subtype: 'bow', weaponStats: { baseDamage: { diceCount: 1, diceType: 'd8', damageType: 'stabbing' } } },
      offHand: { id: 'iron-shield', name: 'Iron Shield', type: 'shield', combatStats: { armorDie: 'd6' } }
    }
  };
  const pcToken = (conditions, extra = {}) => ({
    id: 'pc2', mapId: 'm', ownerUserId: 'u2',
    character: { id: 'c2', name: 'Striker', health: { current: 25, max: 30 }, tempHealth: 0, actionPoints: { current: 6, max: 6 }, tempActionPoints: 0, damageReduction: 0, equipment: character.equipment, ...extra },
    state: { conditions, actorContract: { version: 1, ...ref, revision: 3, primary: true } }
  });

  beforeAll(async() => {
    for (const store of [useCharacterStore, useConditionStore, useCharacterTokenStore, useCreatureStore, useGameStore, useAuthStore]) await store.persist?.rehydrate?.();
    await new Promise(r => setTimeout(r, 0));
  });

  beforeEach(() => {
    for (const [name, store] of [['characterStore', useCharacterStore], ['conditionStore', useConditionStore], ['characterTokenStore', useCharacterTokenStore], ['creatureStore', useCreatureStore], ['gameStore', useGameStore], ['authStore', useAuthStore]]) registerStore(name, store);
    useAuthStore.setState({ user: { uid: 'u2' } });
    useCharacterStore.setState({ ...character });
    useGameStore.setState({ isInMultiplayer: true, multiplayerRoom: { id: 'r' } });
    useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] });
    useCreatureStore.setState({ creatureTokens: [], tokens: [] });
  });

  const install = conditions => {
    useCharacterTokenStore.setState({ characterTokens: [pcToken(conditions)] });
    expect(selectOwnerAttachment(ref).success).toBe(true);
    hydrateActorConditions();
  };
  const sheet = () => useCharacterStore.getState();

  test('P12A weaponStrike consumer: lone positive flat DR on creature target automates flatDr subtraction once on non-critical hit; critical and tier coexistence stay manual', () => {
    const foeDrRecord = make(3, { target: foeRef });
    const foeToken = { id: 'foe', mapId: 'm', name: 'Grimmstalk', state: { currentHp: 40, tempHealth: 0, conditions: [foeDrRecord], actorContract: { version: 1, ...foeRef, revision: 2 } } };
    const hitApproval = {
      version: 1, roomId: 'r', approvalId: 'a-hit', actionEpoch: 'e', baseCommitSequence: 1, source: ref, target: foeRef,
      weapon: { slot: 'ranged', itemId: 'bow-1', name: 'Short Bow', weaponType: 'bow', typeSource: 'item', die: 8, damageType: 'stabbing', attribute: 'agility', score: 14, modifier: 2 },
      roll: { mode: 'physical', faces: [5] },
      proficiency: { weaponType: 'bow', rank: 'TRAINED', rankSource: 'stored', die: 8, table: 'bow', roll: { mode: 'physical', faces: [3] } },
      price: { ap: 2 }
    };

    // 1. Non-critical hit (5 + 2 = 7) with lone flat DR (+3): automated flatDr reduces afterDefense from 7 to 4 once.
    const hitDef = classifyDefenses({ approval: hitApproval, target: foeToken, loaded: {}, bundled: {} });
    expect(hitDef.automated).toEqual({ kind: 'flatDr', amount: 3, recordId: ID });
    expect(hitDef.afterDefense).toBe(4);
    expect(hitDef.manual).toEqual([]);

    const plannedHit = planStrikeCommand({
      approval: hitApproval, contentHash: 'h'.repeat(64),
      tokens: [pcToken([]), foeToken],
      defense: hitDef, choice: { kind: 'deferred' }, verdict: null, finalAmount: hitDef.afterDefense, reason: ''
    });
    expect(plannedHit.entries[1].finalResources.hp.current).toBe(36); // 40 - 4 = 36

    // 2. Critical hit ([8, 3] = 11): flat DR is NOT automated (D-D open); listed in manual['condition'].
    const critApproval = { ...hitApproval, roll: { mode: 'physical', faces: [8, 3] } };
    const critDef = classifyDefenses({ approval: critApproval, target: foeToken, loaded: {}, bundled: {} });
    expect(critDef.automated).toBeNull();
    expect(critDef.afterDefense).toBe(11);
    expect(critDef.manual).toEqual([expect.objectContaining({ source: 'condition', name: 'Aegis Ward' })]);

    // 3. Coexistence with bundled resistance tier (50% stabbing): tier occupies automated, flat DR moves to manual['condition'] (D-DR-3 open).
    const tierCreature = { resistances: { stabbing: 50 }, vulnerabilities: {} };
    const tierDef = classifyDefenses({ approval: hitApproval, target: foeToken, loaded: tierCreature, bundled: tierCreature });
    expect(tierDef.automated).toEqual({ kind: 'resistance', percent: 50 });
    expect(tierDef.afterDefense).toBe(3); // floor(7 * 0.5) = 3
    expect(tierDef.manual).toEqual([expect.objectContaining({ source: 'condition', name: 'Aegis Ward' })]);
  });

  test('PC sheet + F7 character switching/reload: flat DR reaches getTotalStatsWithEffects().damageReduction once, leaves base stats untouched, never leaks across characters, and restores on removal', () => {
    install([]);
    expect(combatAttributes(sheet()).damageReduction).toBe(0);
    expect(sheet().damageReduction).toBe(0);

    const record = publicForm(make(3));
    install([record]);
    // Repeated hydration (reload/reconnect) must never apply flat DR twice.
    hydrateActorConditions();
    hydrateActorConditions();
    expect(useConditionStore.getState().activeBuffs.filter(r => r.recordId === ID)).toHaveLength(1);
    expect(combatAttributes(sheet()).damageReduction).toBe(3);
    expect(sheet().damageReduction).toBe(0);
    expect(sheet().baseStats.agility).toBe(14);

    // F7 character switch: switching to character c1 must not carry c2's flat DR buff, and switching back to c2 restores c2's single active +3 flat DR.
    const c1Token = {
      id: 'pc', mapId: 'm', ownerUserId: 'u2',
      character: { id: 'c1', name: 'Other', health: { current: 20, max: 20 }, tempHealth: 0, actionPoints: { current: 4, max: 4 }, tempActionPoints: 0, damageReduction: 0 },
      state: { conditions: [], actorContract: { version: 1, ...source, ownerUid: 'u2', revision: 1, primary: true } }
    };
    useCharacterTokenStore.setState({ characterTokens: [pcToken([record]), c1Token] });
    useCharacterStore.setState({ ...character, id: 'c1', currentCharacterId: 'c1', damageReduction: 0 });
    expect(selectOwnerAttachment({ ...source, ownerUid: 'u2' }).success).toBe(true);
    hydrateActorConditions();
    expect(combatAttributes(sheet()).damageReduction).toBe(0);

    // Switch back to c2: +3 flat DR is present once.
    useCharacterStore.setState({ ...character, id: 'c2', currentCharacterId: 'c2', damageReduction: 0 });
    expect(selectOwnerAttachment(ref).success).toBe(true);
    hydrateActorConditions();
    expect(combatAttributes(sheet()).damageReduction).toBe(3);

    // Exact removal restores damageReduction to 0.
    install([]);
    expect(combatAttributes(sheet()).damageReduction).toBe(0);
  });

  test('P12B equipmentBlocking + Defending coexistence: block roll reduces damage and prevents wear under Defending without silently subtracting flat DR a second time', () => {
    const defRecord = profile.makeDefendingRecord(ref, '40000000-0000-4000-8000-000000000009', 'self-defend');
    const drRecord = publicForm(make(3));
    const targetToken = pcToken([defRecord, drRecord]);
    const sourceToken = { id: 'foe', state: { currentActionPoints: 4, tempActionPoints: 0, currentMana: 0, tempMana: 0, conditions: [], actorContract: { version: 1, ...foeRef, revision: 1 } } };
    const declaration = { version: 1, revision: 1, mode: 'block', pieces: [{ slot: 'offHand', itemId: 'iron-shield', name: 'Iron Shield', kind: 'shield', currentDie: 'd6', broken: false }] };
    const attack = { capability: 'p12b-attack:v1', source: foeRef, target: ref, sourceRevision: 1, ability: { id: null, name: 'Claw' }, roll: { mode: 'physical', dice: '2d6+3', faces: [4, 3] }, outcome: 'hit', damageType: 'slicing', proposedDamage: 10, apCost: 1 };
    const offer = { commandId: '40000000-0000-4000-8000-000000000010', attack, attackHash: 'a'.repeat(64) };
    const entry = {
      contentHash: 'c'.repeat(64),
      approval: {
        version: 1, roomId: 'r', approvalId: '40000000-0000-4000-8000-000000000011', actionEpoch: 'e', baseCommitSequence: 1,
        source: foeRef, target: ref, attack: { commandId: offer.commandId, attackHash: offer.attackHash },
        blocking: { revision: 1, slot: 'offHand', itemId: 'iron-shield', die: 'd6' },
        roll: { mode: 'physical', faces: [1] } // natural 1 on shield: normally wears d6 -> d4, but Defending doubles to 2 and prevents wear!
      }
    };

    // Without GM manual adjustment, planBlockCommand computes afterBlock = 10 - (1 * 2) = 8; flat DR (+3) is NOT auto-subtracted.
    const unadjusted = planBlockCommand({ offer, entry, sourceToken, targetToken, declaration, names: { source: 'Foe', target: 'Striker' }, manual: [] });
    expect(unadjusted.preview).toMatchObject({ face: 1, defending: true, reduction: 2, afterBlock: 8, amount: 8, afterDie: 'd6', broken: false });

    // When GM rules 'flat-dr' and sets finalAmount = 5 (8 - 3), planBlockCommand records the manual ruling and commits 5 HP once.
    const gmAdjusted = planBlockCommand({
      offer, entry, sourceToken, targetToken, declaration, names: { source: 'Foe', target: 'Striker' },
      manual: [{ category: 'flat-dr', note: 'Aegis Ward +3 flat DR subtracted once after block' }],
      finalAmount: 5, reason: 'Aegis Ward +3 flat DR'
    });
    expect(gmAdjusted.preview).toMatchObject({ afterBlock: 8, amount: 5, afterDie: 'd6', broken: false });
    expect(gmAdjusted.entries[1].finalResources.hp.current).toBe(20); // 25 - 5 = 20
  });
});
