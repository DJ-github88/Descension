/** Original P9: named source-owned class payment adapter and owner approvals.
 * Typed shape and price-conservation checks only; no spell rules, dice, targeting,
 * mitigation or class pricing. Prices are prepared by the owning class domain on
 * the owner's client and bound here to the exact approved typed result.
 */
const actors = require('./actorConsequences');

const { fail, keys, own, clone, hash } = actors;
const ELEMENTS = Object.freeze(['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd']);
const PITCHES = Object.freeze(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
const THRESHOLDS = Object.freeze([0, 10, 20, 40, 60, 80, 100]);
const DOMAINS = Object.freeze(['elementalSpheres', 'musicalNotes', 'devotionGauge']);
const CAPABILITY = 'p9-spell:v1';
const APPROVED_MINSTREL_SPELLS = Object.freeze({
  // Existing P9 builder, distinct from the held minstrel_harmony_strike.
  minstrel_harmonic_strike: Object.freeze({
    definitionId: 'minstrel_harmonic_strike',
    definitionHash: 'p9-spell:v1/baca878b4f8bd1133cfe5496ab716520007c50694817d10412765a52dd5b2521',
    name: 'Harmonic Strike',
    kind: 'damage',
    damageTypes: Object.freeze(['smashing', 'stabbing', 'slicing']),
    price: Object.freeze({ ap: 1, mana: 4 }),
    dice: Object.freeze([{ sides: 8, count: 1 }]),
    constantRule: 'zero',
    classPrice: Object.freeze({ costs: Object.freeze([]), gains: Object.freeze(['III', 'III', 'I']) }),
  }),
  minstrel_opening_chord: Object.freeze({
    definitionId: 'minstrel_opening_chord',
    definitionHash: 'p9-spell:v1/c50d2e41042e81d6988e65daa8843d4c4d83a700064141b02cdc0bd92f189695',
    name: 'Opening Chord',
    kind: 'damage',
    damageTypes: Object.freeze(['storm']),
    price: Object.freeze({ ap: 1, mana: 4 }),
    dice: Object.freeze([{ sides: 6, count: 1 }]),
    constantRule: 'zero',
    classPrice: Object.freeze({ costs: Object.freeze([]), gains: Object.freeze(['I', 'I', 'V']) }),
  }),
  minstrel_resolving_strike: Object.freeze({
    definitionId: 'minstrel_resolving_strike',
    definitionHash: 'p9-spell:v1/e6a1b7a12865b3db2d0a8d6e623ef55af20609d82b62338c9c4b898972c1985d',
    name: 'Resolving Strike',
    kind: 'damage',
    damageTypes: Object.freeze(['storm']),
    price: Object.freeze({ ap: 1, mana: 4 }),
    dice: Object.freeze([{ sides: 8, count: 1 }]),
    constantRule: 'spirit_score',
    classPrice: Object.freeze({ costs: Object.freeze(['I', 'V']), gains: Object.freeze([]) }),
  }),
});
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const approvals = new WeakMap();
const condition = require('../shared/services/authoredCondition');
const effect = require('../shared/services/authoredEffect');
const classEffect = require('../shared/services/classEffect');
// Closed (withdrawn/declined/re-approval) IDs are never silently re-registered.
const closedApprovals = new WeakMap();
const int = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= min && value <= max;
const text = (value, max = 200) => typeof value === 'string' && value.length > 0 && value.length <= max;
const martyrLevel = damage => THRESHOLDS.reduce((level, threshold, index) => damage >= threshold ? index : level, 0);

function validateValue(domain, value) {
  if (!DOMAINS.includes(domain)) {fail('unsupported_class_payment');}
  if (domain === 'elementalSpheres') {
    keys(value, ['type', 'spheres']);
    if (value.type !== domain || !Array.isArray(value.spheres) || value.spheres.length > 12 || value.spheres.some(item => !ELEMENTS.includes(item))) {fail('invalid_class_payment');}
  } else if (domain === 'musicalNotes') {
    keys(value, ['type', 'notes']);
    if (value.type !== domain || !Array.isArray(value.notes) || value.notes.length !== 7 || value.notes.some(item => !int(item, 0, 5))) {fail('invalid_class_payment');}
  } else {
    keys(value, ['type', 'current', 'max', 'damage', 'earnedLevels', 'spentLevels', 'bonusLevels']);
    const { current, max, damage, earnedLevels, spentLevels, bonusLevels } = value;
    if (value.type !== domain || max !== 6 || !int(current, 0, 6) || typeof damage !== 'number' || !Number.isFinite(damage) || damage < 0 || damage > 150 ||
      earnedLevels !== martyrLevel(damage) || !int(bonusLevels, 0, 6) || !int(spentLevels, 0, earnedLevels + bonusLevels) ||
      current !== earnedLevels + bonusLevels - spentLevels) {fail('invalid_class_payment');}
  }
  return value;
}
function validatePrice(domain, price) {
  if (domain === 'devotionGauge') {
    keys(price, ['cost', 'gain', 'required']);
    if (!int(price.cost, 0, 6) || !int(price.gain, 0, 6) || !int(price.required, 0, 6)) {fail('invalid_class_payment');}
  } else {
    keys(price, ['costs', 'gains']);
    const vocabulary = domain === 'elementalSpheres' ? ELEMENTS : PITCHES;
    for (const list of [price.costs, price.gains]) {
      if (!Array.isArray(list) || list.length > 35 || list.some(item => !vocabulary.includes(item))) {fail('invalid_class_payment');}
    }
    if (domain === 'musicalNotes' && price.costs.length > 0 && price.gains.length > 0) {fail('invalid_class_payment');}
  }
  return price;
}
function validateMinstrelSpellApproval(approval) {
  const spec = APPROVED_MINSTREL_SPELLS[approval.spell.definitionId];
  if (!spec) {fail('unsupported_spell_definition');}
  if (approval.spell.definitionHash !== spec.definitionHash || approval.spell.name !== spec.name ||
      approval.spell.kind !== spec.kind || hash(approval.spell.damageTypes) !== hash(spec.damageTypes)) {
    fail('invalid_spell_approval');
  }
  if (approval.price.ap !== spec.price.ap || approval.price.mana !== spec.price.mana) {
    fail('invalid_spell_approval');
  }
  if (!approval.classPayment || approval.classPayment.domain !== 'musicalNotes') {
    fail('invalid_spell_approval');
  }
  if (hash(approval.classPayment.price) !== hash(spec.classPrice)) {
    fail('class_payment_mismatch');
  }
  if (approval.roll.dice.length !== spec.dice.length ||
      spec.dice.some((group, index) => approval.roll.dice[index].sides !== group.sides || approval.roll.dice[index].faces.length !== group.count)) {
    fail('invalid_spell_approval');
  }
  if (spec.constantRule === 'zero' && approval.roll.constant !== 0) {fail('invalid_spell_approval');}
  if (spec.constantRule === 'spirit_score' && (!int(approval.roll.constant, 0, 1000) || !/^1d8 \+ spirit → 1d8(?: [+-] \d+)? \(SPI score\)$/.test(approval.roll.reading))) {
    fail('invalid_spell_approval');
  }
  return spec;
}
/** Typed price conservation: the approved after-state is exactly the approved
 * price applied to the authoritative before-state (list arithmetic / ledger form). */
function conserve(domain, before, after, price) {
  validateValue(domain, before); validateValue(domain, after); validatePrice(domain, price);
  if (domain === 'devotionGauge') {
    if (before.current < Math.max(price.cost, price.required)) {fail('insufficient_class_resource');}
    // Spend records spent levels; a later gain first restores spent levels, and
    // the six-level cap bounds the gain (the existing ledger contract).
    const afterConsume = before.current - price.cost;
    const spent = before.spentLevels + price.cost;
    const delta = Math.min(6, afterConsume + price.gain) - afterConsume;
    const restored = Math.min(spent, delta);
    const expected = { damage: before.damage, earnedLevels: before.earnedLevels, spentLevels: spent - restored, current: afterConsume + delta };
    if (Object.entries(expected).some(([key, value]) => after[key] !== value)) {fail('class_payment_mismatch');}
    return true;
  }
  const items = domain === 'elementalSpheres' ? [...before.spheres] : before.notes.flatMap((count, index) => Array(count).fill(PITCHES[index]));
  for (const cost of price.costs) {
    const index = items.indexOf(cost);
    if (index < 0) {fail('insufficient_class_resource');}
    items.splice(index, 1);
  }
  const next = [...items, ...price.gains];
  const expected = domain === 'elementalSpheres' ? next.slice(0, 12) : PITCHES.map(pitch => Math.min(5, next.filter(item => item === pitch).length));
  if (hash(expected) !== hash(domain === 'elementalSpheres' ? after.spheres : after.notes)) {fail('class_payment_mismatch');}
  return true;
}
function publicValue(domain, value) {
  if (domain === 'elementalSpheres') {return { type: domain, spheres: [...value.spheres], current: value.spheres.length, max: 12 };}
  if (domain === 'musicalNotes') {return { type: domain, current: value.notes.reduce((sum, count) => sum + count, 0), max: 35 };}
  return { type: domain, current: value.current, max: 6 };
}
function home(token) {
  const stored = token?.state?.classPayment;
  if (stored === undefined || stored === null) {return null;}
  if (stored.version !== 1) {fail('unsupported_actor_contract');}
  validateValue(stored.domain, stored.value);
  return { domain: stored.domain, value: stored.value };
}
function validateHomeShape(value, allowNull) {
  if (value === null && allowNull) {return null;}
  keys(value, ['domain', 'value']);
  validateValue(value.domain, value.value);
  return value;
}
function validateEntry(payment) {
  keys(payment, ['mode', 'before', 'after', 'domain', 'approvalHash']);
  if (payment.mode === 'sync') {
    if (!own(payment, 'before') || !own(payment, 'after') || own(payment, 'domain') || own(payment, 'approvalHash')) {fail('invalid_class_payment');}
    validateHomeShape(payment.before, true); validateHomeShape(payment.after, false);
  } else if (payment.mode === 'spell') {
    if (own(payment, 'before') || own(payment, 'after') || !DOMAINS.includes(payment.domain) || !/^[0-9a-f]{64}$/.test(payment.approvalHash || '')) {fail('invalid_class_payment');}
  } else {fail('invalid_class_payment');}
  return payment;
}
function validateRoll(roll, deterministic = false) {
  keys(roll, ['mode', 'dice', 'constant', 'total', 'reading']);
  if (!(deterministic ? roll.mode === 'deterministic' : ['digital', 'physical'].includes(roll.mode)) || !Array.isArray(roll.dice) || (deterministic ? roll.dice.length !== 0 : !roll.dice.length) || roll.dice.length > 8 ||
    !Number.isSafeInteger(roll.constant) || Math.abs(roll.constant) > 10000 || !text(roll.reading, 300)) {fail('invalid_spell_approval');}
  let total = roll.constant;
  for (const group of roll.dice) {
    keys(group, ['sides', 'faces']);
    if (!int(group.sides, 2, 100) || !Array.isArray(group.faces) || !group.faces.length || group.faces.length > 50 || group.faces.some(face => !int(face, 1, group.sides))) {fail('invalid_spell_approval');}
    total += group.faces.reduce((sum, face) => sum + face, 0);
  }
  if (roll.total !== total) {fail('invalid_spell_approval');}
  return roll;
}
function validateApprovalShape(approval, creature = false) {
  const bundle = effect.isEffect(approval), composed = classEffect.isClassEffect(approval);
  const authored = require('../shared/services/authoredAbility');
  const formula = authored.isFormula(approval), area = authored.isArea(approval);
  if (area) {
    if (creature) fail('unsupported_source_route');
    if (!authored.isAreaRollProcedureApproved()) fail('area_roll_procedure_unapproved', authored.AREA_ROLL_UNAPPROVED_REASON);
    keys(approval, ['version', 'roomId', 'approvalId', 'actionEpoch', 'baseCommitSequence', 'source', 'targets', 'areaTerms', 'areaOrigin', 'areaRollProcedure', 'spell', 'roll', 'rollAttributes', 'formulaSourceRevision', 'formulaSourceHash', 'price', 'classPayment']);
    if (approval.version !== 1 || !text(approval.roomId) || !UUID.test(approval.approvalId || '') || !text(approval.actionEpoch) || !int(approval.baseCommitSequence) ||
      actors.bytes(approval) > 32768 || !authored.isAuthored(approval.spell) || approval.areaRollProcedure !== authored.AREA_ROLL_PROCEDURE) fail('invalid_spell_approval');
    keys(approval.areaTerms, ['kind', 'aoeShape', 'radiusFeet', 'rangeFeet', 'maxTargets', 'restriction']);
    if (approval.areaTerms.kind !== 'area' || approval.areaTerms.aoeShape !== 'circle' || !int(approval.areaTerms.radiusFeet, 5, 60) || approval.areaTerms.radiusFeet % 5 !== 0 ||
      !int(approval.areaTerms.rangeFeet, 1, 300) || !int(approval.areaTerms.maxTargets, 1, authored.MAX_AREA_TARGETS) || !['any', 'ally', 'enemy'].includes(approval.areaTerms.restriction)) fail('invalid_spell_approval');
    if (approval.areaOrigin !== undefined && approval.areaOrigin !== null) {
      keys(approval.areaOrigin, ['x', 'y']);
      if (typeof approval.areaOrigin.x !== 'number' || !Number.isFinite(approval.areaOrigin.x) || typeof approval.areaOrigin.y !== 'number' || !Number.isFinite(approval.areaOrigin.y)) fail('invalid_spell_approval');
    }
    actors.validateRef(approval.source);
    if (approval.source.kind !== 'character' || approval.source.roomId !== approval.roomId) fail('invalid_spell_approval');
    if (!Array.isArray(approval.targets) || approval.targets.length < 1) fail('invalid_spell_approval');
    if (approval.targets.length > authored.MAX_AREA_TARGETS || approval.targets.length > approval.areaTerms.maxTargets) {
      fail('area_target_capacity_exceeded', 'Technical limit of 8 creature targets (9 actors including source) exceeded; do not truncate.');
    }
    const seenTargets = new Set();
    for (const targetRef of approval.targets) {
      actors.validateRef(targetRef);
      if (hash(targetRef) === hash(approval.source)) fail('source_in_targets');
      if (targetRef.kind !== 'creature') fail('unsupported_area_target_kind');
      if (targetRef.roomId !== approval.roomId || targetRef.mapId !== approval.source.mapId) fail('cross_map_area_target');
      const th = hash(targetRef);
      if (seenTargets.has(th)) fail('duplicate_target_actor');
      seenTargets.add(th);
    }
    if (approval.formulaSourceRevision !== undefined && !int(approval.formulaSourceRevision)) fail('invalid_spell_approval');
    if (approval.formulaSourceHash !== undefined && !/^[0-9a-f]{64}$/.test(approval.formulaSourceHash || '')) fail('invalid_spell_approval');
  } else {
    keys(approval, ['version', 'roomId', 'approvalId', 'actionEpoch', 'baseCommitSequence', 'source', 'target', 'spell', 'roll', 'price', 'classPayment', ...(creature ? ['sourceAuthority', ...(condition.isCondition(approval) || bundle ? ['resolution'] : [])] : condition.isCondition(approval) ? ['conditionTerms'] : []), ...(bundle ? ['effectTerms'] : []), ...(authored.isFormulaBundle(approval) ? ['rollAttributes', 'formulaSourceRevision', 'formulaSourceHash'] : []), ...(composed ? ['effectTerms', 'disclosure', 'rollAttributes'] : []), ...(formula ? ['rollAttributes', 'formulaSourceRevision', 'formulaSourceHash'] : []), ...(authored.isHealth(approval) ? ['rollHealth'] : [])]);
    if (authored.isHealth(approval)) {
      keys(approval.rollHealth, ['current', 'max']);
      if (!int(approval.rollHealth.current, 0, 100000) || !int(approval.rollHealth.max, 0, 100000) || approval.target?.kind !== 'creature' || approval.classPayment !== null) fail('invalid_spell_approval');
    }
    if (formula && (creature || !authored.isAuthored(approval.spell) ||
      !['creature', 'character'].includes(approval.target?.kind) || (approval.target.kind === 'character' && approval.spell.kind !== 'healing') ||
      !int(approval.formulaSourceRevision) || !/^[0-9a-f]{64}$/.test(approval.formulaSourceHash || ''))) fail('invalid_spell_approval');
    if (approval.version !== 1 || !text(approval.roomId) || !UUID.test(approval.approvalId || '') || !text(approval.actionEpoch) || !int(approval.baseCommitSequence) ||
      actors.bytes(approval) > 32768) {fail('invalid_spell_approval');}
    actors.validateRef(approval.source); actors.validateRef(approval.target);
    if (approval.source.kind !== (creature ? 'creature' : 'character') || approval.source.roomId !== approval.roomId || approval.target.roomId !== approval.roomId ||
      approval.target.mapId !== approval.source.mapId) {fail('invalid_spell_approval');}
  }
  keys(approval.spell, ['definitionId', 'definitionHash', 'name', 'kind', 'damageTypes']);
  if (!text(approval.spell.definitionId) || !/^(p9-spell:v1|authored-immediate:v[1234]|authored-area:v1|authored-condition:v1|authored-effect:v1|class-effect:v1)\/[0-9a-f]{64}$/.test(approval.spell.definitionHash || '') || !text(approval.spell.name) ||
    !(condition.isCondition(approval) ? approval.spell.kind === 'condition' && approval.spell.damageTypes?.length === 0 : bundle ? approval.spell.kind === 'effect' : composed ? approval.spell.kind === 'class-effect' : ['damage', 'healing'].includes(approval.spell.kind)) || !Array.isArray(approval.spell.damageTypes) || approval.spell.damageTypes.length > 8 ||
    approval.spell.damageTypes.some(type => !text(type, 40)) || (approval.spell.kind === 'damage' && !approval.spell.damageTypes.length)) {fail('invalid_spell_approval');}
  if (composed) {
    // M1: the whole composed effect is pinned by a reviewed profile entry; nothing here is taken from the client.
    if (creature) fail('unsupported_creature_target');
    validateRoll(approval.roll);
    checkClassEffectTerms(approval);
  } else if (bundle) {
    // A10: whole-bundle terms; exact equality with the installed definition is checked against the room.
    keys(approval.effectTerms, ['direct', 'condition', 'timing']);
    if (approval.classPayment !== null || (approval.effectTerms.direct === null) !== (approval.roll === null) || !approval.effectTerms.condition || !approval.effectTerms.timing) fail('invalid_spell_approval');
    if (approval.roll !== null) validateRoll(approval.roll);
    // M5 composition + M4A: an attribute-reading immediate part carries the M4A input disclosure and caster-snapshot binding (owner PC only).
    if (authored.isFormulaBundle(approval) && (creature || !int(approval.formulaSourceRevision) || !/^[0-9a-f]{64}$/.test(approval.formulaSourceHash || '') ||
      !approval.rollAttributes || typeof approval.rollAttributes !== 'object' || Array.isArray(approval.rollAttributes))) fail('invalid_spell_approval');
    if (creature) validateConditionResolution(approval.resolution);
  } else if (condition.isCondition(approval)) {
    if (approval.roll !== null || approval.classPayment !== null) fail('invalid_spell_approval');
    if (creature) validateConditionResolution(approval.resolution);
    else {
      keys(approval.conditionTerms, ['conditionKey', 'timing']);
      if (approval.conditionTerms.conditionKey !== 'stunned' || !approval.conditionTerms.timing) fail('invalid_spell_approval');
    }
  } else validateRoll(approval.roll, authored.isDeterministic(approval));
  keys(approval.price, ['ap', 'mana']);
  if (!int(approval.price.ap, 0, 100) || !int(approval.price.mana, 0, 10000)) {fail('invalid_spell_approval');}
  if (approval.classPayment !== null) {
    keys(approval.classPayment, ['domain', 'before', 'after', 'price']);
    conserve(approval.classPayment.domain, approval.classPayment.before, approval.classPayment.after, approval.classPayment.price);
  }
  if (!creature && !condition.isCondition(approval) && !bundle && !composed && !area &&
      (approval.classPayment?.domain === 'musicalNotes' || approval.spell.definitionId.startsWith('minstrel_'))) {
    validateMinstrelSpellApproval(approval);
  }
  return approval;
}
function validateApproval(approval) { return validateApprovalShape(approval); }
/** M1: exact equality with the confirmed, hash-pinned class-effect profile (terms, price, typed payment price, disclosure). */
function classEffectEntry(approval) {
  const found = classEffect.profileFor(classEffect.recordHashOf(approval));
  if (!found.ok) fail('class_effect_profile_unavailable', found.reason);
  return found.entry;
}
function checkClassEffectTerms(approval) {
  const entry = classEffectEntry(approval);
  if (approval.spell.definitionId !== entry.spellId || approval.spell.name !== entry.name || hash(approval.spell.damageTypes) !== hash(entry.terms.direct.damageTypes || []) ||
      hash(approval.effectTerms) !== hash(entry.terms) || hash(approval.price) !== hash(entry.price) || hash(approval.disclosure) !== hash(classEffect.disclosure(entry)) ||
      (entry.payment ? approval.classPayment?.domain !== entry.payment.domain || hash(approval.classPayment.price) !== hash(entry.payment.price) : approval.classPayment !== null)) {
    fail('class_effect_terms_mismatch', 'The approval does not match the admitted class-effect profile; nothing was registered.');
  }
  // Review M-1: the roll is exactly the pinned formula read with the owner-attested effective scores.
  if (!classEffect.rollMatches(entry.terms.direct.formula, approval.roll, approval.rollAttributes)) fail('class_effect_roll_mismatch', 'The recorded roll does not match the admitted formula; nothing was registered.');
  if (approval.target.kind !== 'creature' || hash(approval.source) === hash(approval.target)) fail('unsupported_class_effect_target');
  return entry;
}
function validateConditionResolution(resolution) {
  keys(resolution, ['gmConfirmed', 'timing', 'timingNote', 'evidence']);
  if (resolution.gmConfirmed !== true || !text(resolution.timingNote, 300) || !resolution.timingNote.trim() || typeof resolution.evidence !== 'string' || resolution.evidence.length > 2000) fail('invalid_condition_resolution');
}
function validateCreatureApproval(approval, primaryPc = false) {
  validateApprovalShape(approval, true);
  keys(approval.sourceAuthority, ['admissionId', 'associationHash', 'gmUid']);
  if (!UUID.test(approval.sourceAuthority.admissionId || '') || !/^[0-9a-f]{64}$/.test(approval.sourceAuthority.associationHash || '') || !text(approval.sourceAuthority.gmUid) ||
    (!condition.isCondition(approval) && !(effect.isEffect(approval) ? ['character', 'creature'].includes(approval.target.kind) : approval.target.kind === (primaryPc ? 'character' : 'creature'))) || (hash(approval.source) === hash(approval.target) && (primaryPc || approval.spell.kind !== 'healing')) || approval.classPayment !== null ||
    !(approval.spell.definitionHash.startsWith('authored-immediate:v1/') || condition.isCondition(approval) || effect.isEffect(approval))) fail('unsupported_creature_target');
  return approval;
}
/** Temporary pools are counted and spent first (approved creator rule). */
function tempFirst(current, temp, amount) {
  if (![current, temp, amount].every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0)) {fail('invalid_resources');}
  if (amount > current + temp) {fail('insufficient_resources');}
  const fromTemp = Math.min(temp, amount);
  return { current: current - (amount - fromTemp), temp: temp - fromTemp };
}
function sourcePools(token, kind = 'character') {
  const values = actors.resources(token, kind);
  return values;
}
function validPool(pool) {
  if (![pool.current, pool.temp, pool.max].every(v => typeof v === 'number' && Number.isFinite(v) && v >= 0) || pool.current > pool.max) fail('invalid_resources');
  return pool;
}
// A6 validation evidence belongs to the existing pending attempt, not a second actor/store.
function selfState(room, approval) {
  if ((condition.isCondition(approval) || effect.isEffect(approval)) && approval.source.kind === 'creature') return hash([approval.source, approval.target].map(ref => { const a = actors.locate(room, ref); return { contract: a.contract, resources: actors.resources(a.token, ref.kind), conditions: a.token.state?.conditions || [] }; }));
  if (approval.source.kind !== 'creature' || !approval.target || hash(approval.source) !== hash(approval.target)) return null;
  const source = actors.locate(room, approval.source);
  return hash({ contract: source.contract, resources: actors.resources(source.token, 'creature'), conditions: source.token.state?.conditions || [] });
}
/** Checks an approval against current authoritative room state. */
function checkAgainstRoom(room, approval) {
  const authored = require('../shared/services/authoredAbility');
  if (authored.isAuthored(approval.spell) || authored.isFormula(approval) || authored.isArea(approval) || approval.spell.definitionHash.startsWith(`${authored.CAPABILITY}/`)) {
    require('./installedAuthoredAbilities').checkApproval(room, approval);
  }
  actors.assertCanAct(room, approval.source);
  const source = actors.locate(room, approval.source);
  if (authored.isArea(approval)) {
    const targets = approval.targets.map(tRef => {
      const t = actors.locate(room, tRef);
      if (t.token?.state?.hiddenFromPlayers === true || t.token?.hiddenFromPlayers === true) fail('actor_not_found');
      validPool(actors.resources(t.token, 'creature').hp);
      return t;
    });
    const pools = sourcePools(source.token, approval.source.kind);
    for (const [pool, key] of [['ap', 'ap'], ['mana', 'mana']]) {
      if (approval.price[key] > 0) tempFirst(pools[pool].current, pools[pool].temp, approval.price[key]);
    }
    if (approval.classPayment) {
      if (hash(home(source.token)) !== hash({ domain: approval.classPayment.domain, value: approval.classPayment.before })) {fail('class_home_required');}
    }
    return { source, targets };
  }
  const target = actors.locate(room, approval.target);
  // Review m-3: a class effect is cast only by a character of the admitted entry's class.
  if (classEffect.isClassEffect(approval) && classEffect.classIdOf(source.token.character?.class) !== classEffectEntry(approval).classId) fail('class_effect_class_mismatch');
  const pools = sourcePools(source.token, approval.source.kind);
  for (const [pool, key] of [['ap', 'ap'], ['mana', 'mana']]) {
    if (approval.price[key] > 0) {if (approval.source.kind === 'creature') validPool(pools[pool]); tempFirst(pools[pool].current, pools[pool].temp, approval.price[key]);}
  }
  if (approval.source.kind === 'creature') { validPool(pools.ap); if (!condition.isCondition(approval)) validPool(actors.resources(target.token, approval.target.kind).hp); }
  if (approval.source.kind === 'character' && source.token?.character?.class === 'Minstrel' && approval.spell.definitionHash.startsWith(`${CAPABILITY}/`)) {
    validateMinstrelSpellApproval(approval);
  }
  if (approval.classPayment) {
    if (hash(home(source.token)) !== hash({ domain: approval.classPayment.domain, value: approval.classPayment.before })) {fail('class_home_required');}
  }
  return { source, target };
}
function registry(room) {
  let entries = approvals.get(room);
  if (!entries) {entries = new Map(); approvals.set(room, entries);}
  return entries;
}
function get(room, approvalId) { return approvals.get(room)?.get(approvalId) || null; }
function pendingFor(room, ownerUid, characterId) {
  if (!room || !ownerUid) {return null;}
  return Array.from(approvals.get(room)?.values() || []).find(entry => entry.approval.source.ownerUid === ownerUid &&
    (characterId === undefined || entry.approval.source.characterId === characterId)) || null;
}
function add(room, entry) {
  const entries = registry(room);
  if (entry.approval.source.kind === 'creature' ? listAll(room).some(e => hash(e.approval.source) === hash(entry.approval.source)) : pendingFor(room, entry.approval.source.ownerUid, entry.approval.source.characterId)) {fail('approval_pending');}
  if ((closedApprovals.get(room)?.size || 0) + entries.size >= CLOSED_LIMIT) {fail('approval_capacity');}
  if (entries.size >= 32 || actors.bytes(Array.from(entries.values()).map(value => value.approval).concat(entry.approval)) > 512 * 1024) {fail('approval_capacity');}
  entries.set(entry.approval.approvalId, entry);
  return entry;
}
function remove(room, approvalId) { return approvals.get(room)?.delete(approvalId) || false; }
function listAll(room) { return Array.from(approvals.get(room)?.values() || []); }
// Closed and consumed IDs are remembered for the whole runtime (never evicted).
// A runtime change resets them, but a new runtime also has a new admission epoch,
// so an old approval is outcome_unknown there and can never be registered again.
const CLOSED_LIMIT = 4096;
function close(room, approvalId, code, evidence = get(room, approvalId)) {
  let closed = closedApprovals.get(room);
  if (!closed) {closed = new Map(); closedApprovals.set(room, closed);}
  if (!closed.has(approvalId) && closed.size + (approvals.get(room)?.size || 0) - (get(room, approvalId) ? 1 : 0) >= CLOSED_LIMIT) fail('approval_capacity');
  closed.set(approvalId, { code, contentHash: evidence?.contentHash, ownerUid: evidence?.ownerUid });
  return remove(room, approvalId);
}
function closedEntry(room, approvalId) { return closedApprovals.get(room)?.get(approvalId) || null; }
function closedCode(room, approvalId) { return closedEntry(room, approvalId)?.code || null; }
function consumedReceipt(room, approvalId) {
  return actors.ledger(room).receipts.find(receipt => ['owner-approval-gm', 'gm-creature-ability'].includes(receipt.authorization?.kind) && receipt.authorization.proposalId === approvalId) || null;
}
/** GM-visible privacy projection: class values are reduced to public fields. */
function gmProjection(entry) {
  const { approval } = entry;
  return { ...clone(approval), classPayment: approval.classPayment ? { domain: approval.classPayment.domain, price: clone(approval.classPayment.price),
    beforePublic: publicValue(approval.classPayment.domain, approval.classPayment.before), afterPublic: publicValue(approval.classPayment.domain, approval.classPayment.after) } : null };
}
function ownerMember(room, ownerUid) {
  return room.gmId === ownerUid || Array.from(room.players?.values?.() || []).some(player => player.userId === ownerUid);
}
/** Registration window (repair B2): an approval is bound to the commit sequence it
 * was prepared from. Once its receipt could have been pruned (floor above the base),
 * the server can no longer prove non-consumption, so the outcome is unknown. */
function checkWindow(room, approval) {
  const state = actors.ledger(room);
  if (approval.baseCommitSequence < state.replayFloor) {fail('retry_window_expired');}
  if (approval.baseCommitSequence > state.commitSequence) {fail('invalid_spell_approval');}
}
/** Binds a GM command to one pending owner approval (F9.3 step 4). */
function bindCommand(room, player, command, authorization) {
  if (!player.isGM) {fail('forbidden');}
  // Repair B1: only the GM's own direct consequence may consume an owner approval.
  if (authorization?.kind !== 'gm') {fail('approval_requires_gm');}
  keys(command.approval, ['approvalId', 'contentHash']);
  const entry = get(room, command.approval.approvalId);
  if (!entry) {
    const closed = closedCode(room, command.approval.approvalId);
    fail(consumedReceipt(room, command.approval.approvalId) ? 'approval_consumed' : closed ? `approval_${closed}` : 'outcome_unknown');
  }
  if (entry.contentHash !== command.approval.contentHash) {fail('command_id_conflict');}
  const { approval } = entry;
  if (condition.isCondition(approval)) return bindCondition(room, player, command, authorization, entry);
  if (effect.isEffect(approval)) return bindEffect(room, player, command, authorization, entry);
  if (classEffect.isClassEffect(approval)) return bindClassEffect(room, player, command, authorization, entry);
  const authored = require('../shared/services/authoredAbility');
  if (authored.isArea(approval)) return bindArea(room, player, command, authorization, entry);
  const authoredImmediate = authored.isAuthored(approval.spell) || authored.isFormula(approval);
  const capability = authored.isDeterministic(approval) ? authored.DETERMINISTIC_CAPABILITY : authored.isHealth(approval) ? authored.HEALTH_CAPABILITY : authored.isFormula(approval) ? authored.FORMULA_CAPABILITY : authoredImmediate ? authored.CAPABILITY : CAPABILITY;
  if (authoredImmediate) {
    checkAgainstRoom(room, approval);
    if (selfState(room, approval) !== (entry.selfState ?? null)) fail('creature_revalidation_required');
    if (approval.source.kind === 'character' && actors.locate(room, approval.source).token.ownerUserId !== approval.source.ownerUid) {fail('forbidden');}
  }
  if (approval.source.kind === 'creature') {
    validateCreatureApproval(approval);
    if (entry.ownerUid !== room.gmId || authorization.authorizerUid !== room.gmId) fail('forbidden');
  } else if (!ownerMember(room, approval.source.ownerUid)) {fail('owner_unavailable');}
  if (hash(command.source) !== hash(approval.source) || hash(command.target) !== hash(approval.target)) {fail('approval_mismatch');}
  const adjudication = command.adjudication || {};
  if (adjudication.definitionId !== approval.spell.definitionId || adjudication.definitionVersionOrHash !== approval.spell.definitionHash) {fail('approval_mismatch');}
  let chosen;
  try {chosen = JSON.parse(adjudication.chosenResult);} catch (_) {fail('approval_mismatch');}
  if (!chosen || chosen.capability !== capability || chosen.approvalId !== approval.approvalId || chosen.kind !== approval.spell.kind ||
    chosen.gmConfirmed !== true || hash(chosen.roll) !== hash(approval.roll)) {fail('approval_mismatch');}
  if (authored.isHealth(approval) && hash(chosen.rollHealth) !== hash(approval.rollHealth)) fail('approval_mismatch');
  const amount = adjudication.finalAmount;
  if (!int(amount, 0, 100000)) {fail('invalid_final_amount');}
  if (typeof adjudication.adjustmentReason !== 'string' || adjudication.adjustmentReason.length > 2000 ||
    (amount !== approval.roll.total && !adjudication.adjustmentReason.trim())) {fail('adjustment_reason_required');}
  const { source, target } = { source: actors.locate(room, approval.source), target: actors.locate(room, approval.target) };
  // Revision bumps are CAS refusals (GM re-prepares explicitly), never owner re-approval.
  for (const actor of command.actors) {
    if (actors.locate(room, actor.ref).contract.revision !== actor.expectedRevision) {fail('stale_actor_revision');}
  }
  if (approval.classPayment && hash(home(source.token)) !== hash({ domain: approval.classPayment.domain, value: approval.classPayment.before })) {fail('owner_reapproval_required');}
  if (require('../shared/services/authoredAbility').isFormula(approval)) require('./installedAuthoredAbilities').checkApproval(room, approval);
  if (require('../shared/services/authoredAbility').isFormula(approval) && approval.target.kind === 'character') {
    checkTargetAcceptance(room, entry);
    if (amount !== approval.roll.total) fail('owner_reapproval_required', 'The accepted healing amount changed; the target owner must accept the exact amount again. Nothing was applied.');
  }
  const self = hash(approval.source) === hash(approval.target);
  const pools = sourcePools(source.token, approval.source.kind);
  const expectedSource = {};
  for (const pool of ['ap', 'mana']) {
    if (approval.price[pool] > 0) {expectedSource[pool] = tempFirst(pools[pool].current, pools[pool].temp, approval.price[pool]);}
  }
  // P7 requires an explicit operation on every participating actor. For a free remote action,
  // compare-and-set the unchanged AP projection; this is not an inferred price or a debit.
  if (authoredImmediate && !self && !Object.keys(expectedSource).length) {expectedSource.ap = tempFirst(pools.ap.current, pools.ap.temp, 0);}
  const targetPools = actors.resources(target.token, approval.target.kind);
  const hp = approval.spell.kind === 'damage' ? (() => {
    const fromTemp = Math.min(targetPools.hp.temp, amount);
    return { current: Math.max(0, targetPools.hp.current - (amount - fromTemp)), temp: targetPools.hp.temp - fromTemp };
  })() : { current: Math.min(targetPools.hp.max, targetPools.hp.current + amount), temp: targetPools.hp.temp };
  if (((self && approval.source.kind === 'creature') || (require('../shared/services/authoredAbility').isFormula(approval) && approval.target.kind === 'character')) &&
    approval.spell.kind === 'healing' && chosen.actualHealing !== hp.current - targetPools.hp.current) fail('approval_mismatch');
  const expected = [{ ref: approval.source, finalResources: self ? { ...expectedSource, hp } : expectedSource,
    ...(approval.classPayment ? { classPayment: { mode: 'spell', domain: approval.classPayment.domain, approvalHash: entry.contentHash } } : {}) }];
  if (!self) {expected.push({ ref: approval.target, finalResources: { hp } });}
  if (command.actors.length !== expected.length) {fail('approval_mismatch');}
  expected.forEach((value, index) => {
    const actual = command.actors[index];
    if (authoredImmediate && (actual.equipmentWear !== undefined || actual.blockingDeclaration !== undefined)) {fail('approval_mismatch');}
    if (hash(actual.ref) !== hash(value.ref) || actual.conditions !== undefined ||
      hash(actual.finalResources || {}) !== hash(value.finalResources) || hash(actual.classPayment || null) !== hash(value.classPayment || null)) {fail('approval_mismatch');}
  });
  return entry;
}
function bindArea(room, player, command, authorization, entry) {
  const { approval } = entry;
  const authored = require('../shared/services/authoredAbility');
  validateApproval(approval);
  const { source, targets } = checkAgainstRoom(room, approval);
  if (authorization.authorizerUid !== room.gmId) fail('forbidden');
  if (entry.ownerUid !== approval.source.ownerUid || source.token.ownerUserId !== approval.source.ownerUid) fail('forbidden');
  if (!ownerMember(room, approval.source.ownerUid)) fail('owner_unavailable');
  if (hash(command.source) !== hash(approval.source) || !Array.isArray(command.targets) || hash(command.targets) !== hash(approval.targets)) fail('approval_mismatch');
  const adj = command.adjudication || {};
  if (adj.definitionId !== approval.spell.definitionId || adj.definitionVersionOrHash !== approval.spell.definitionHash) fail('approval_mismatch');
  let chosen;
  try { chosen = JSON.parse(adj.chosenResult); } catch (_) { fail('approval_mismatch'); }
  if (!chosen || chosen.capability !== authored.AREA_CAPABILITY || chosen.approvalId !== approval.approvalId || chosen.kind !== approval.spell.kind ||
    chosen.areaRollProcedure !== authored.AREA_ROLL_PROCEDURE || chosen.gmConfirmed !== true || hash(chosen.roll) !== hash(approval.roll) ||
    !Array.isArray(chosen.targets) || chosen.targets.length !== approval.targets.length) fail('approval_mismatch');
  for (const actor of command.actors) {
    if (actors.locate(room, actor.ref).contract.revision !== actor.expectedRevision) fail('stale_actor_revision');
  }
  if (approval.classPayment && hash(home(source.token)) !== hash({ domain: approval.classPayment.domain, value: approval.classPayment.before })) fail('owner_reapproval_required');
  require('./installedAuthoredAbilities').checkApproval(room, approval);
  const pools = sourcePools(source.token, 'character');
  const expectedSource = {};
  for (const pool of ['ap', 'mana']) {
    if (approval.price[pool] > 0) expectedSource[pool] = tempFirst(pools[pool].current, pools[pool].temp, approval.price[pool]);
  }
  if (!Object.keys(expectedSource).length) expectedSource.ap = tempFirst(pools.ap.current, pools.ap.temp, 0);
  const expected = [{ ref: approval.source, finalResources: expectedSource,
    ...(approval.classPayment ? { classPayment: { mode: 'spell', domain: approval.classPayment.domain, approvalHash: entry.contentHash } } : {}) }];
  let totalFinalAmount = 0;
  for (let i = 0; i < approval.targets.length; i++) {
    const tRef = approval.targets[i], tOutcome = chosen.targets[i], targetLocated = targets[i];
    if (!tOutcome || typeof tOutcome !== 'object' || hash(tOutcome.ref) !== hash(tRef)) fail('approval_mismatch');
    const amount = tOutcome.finalAmount;
    if (!int(amount, 0, 100000)) fail('invalid_final_amount');
    if (typeof tOutcome.adjustmentReason !== 'string' || tOutcome.adjustmentReason.length > 2000 ||
      (amount !== approval.roll.total && !tOutcome.adjustmentReason.trim())) fail('adjustment_reason_required');
    totalFinalAmount += amount;
    const targetPools = actors.resources(targetLocated.token, 'creature');
    const hp = approval.spell.kind === 'damage' ? (() => {
      const fromTemp = Math.min(targetPools.hp.temp, amount);
      return { current: Math.max(0, targetPools.hp.current - (amount - fromTemp)), temp: targetPools.hp.temp - fromTemp };
    })() : { current: Math.min(targetPools.hp.max, targetPools.hp.current + amount), temp: targetPools.hp.temp };
    expected.push({ ref: tRef, finalResources: { hp } });
  }
  if (adj.finalAmount !== totalFinalAmount || typeof adj.adjustmentReason !== 'string' || adj.adjustmentReason.length > 2000) fail('approval_mismatch');
  if (command.actors.length !== expected.length) fail('approval_mismatch');
  expected.forEach((value, index) => {
    const actual = command.actors[index];
    if (actual.equipmentWear !== undefined || actual.blockingDeclaration !== undefined || actual.conditions !== undefined) fail('approval_mismatch');
    if (hash(actual.ref) !== hash(value.ref) || hash(actual.finalResources || {}) !== hash(value.finalResources) ||
      hash(actual.classPayment || null) !== hash(value.classPayment || null)) fail('approval_mismatch');
  });
  return entry;
}
function bindCondition(room, player, command, authorization, entry) {
  const a = entry.approval;
  const pc = a.source.kind === 'character';
  (pc ? validateApproval : validateCreatureApproval)(a); checkAgainstRoom(room, a);
  if (authorization.authorizerUid !== room.gmId) fail('forbidden');
  checkTargetAcceptance(room, entry);
  if (pc) {
    if (entry.ownerUid !== a.source.ownerUid || actors.locate(room, a.source).token.ownerUserId !== entry.ownerUid || !ownerMember(room, entry.ownerUid)) fail('forbidden');
  } else {
    if (entry.ownerUid !== room.gmId) fail('forbidden');
    if (selfState(room, a) !== entry.selfState) fail('creature_revalidation_required');
  }
  if (hash(command.source) !== hash(a.source) || hash(command.target) !== hash(a.target)) fail('approval_mismatch');
  const adj = command.adjudication;
  if (adj?.definitionId !== a.spell.definitionId || adj.definitionVersionOrHash !== a.spell.definitionHash || adj.finalAmount !== 0 || adj.adjustmentReason !== '') fail('approval_mismatch');
  let chosen; try { chosen = JSON.parse(adj.chosenResult); } catch (_) { fail('approval_mismatch'); }
  const resolved = pc ? { ...a, resolution: chosen.resolution } : a;
  validateConditionResolution(resolved.resolution);
  if (pc && hash(resolved.resolution.timing) !== hash(a.conditionTerms.timing)) fail('owner_reapproval_required');
  if (hash(chosen) !== hash(condition.resultFor(resolved))) fail('approval_mismatch');
  const pools = sourcePools(actors.locate(room, a.source).token, a.source.kind), payment = {};
  for (const pool of ['ap', 'mana']) if (a.price[pool] > 0) payment[pool] = tempFirst(pools[pool].current, pools[pool].temp, a.price[pool]);
  if (!Object.keys(payment).length) payment.ap = tempFirst(pools.ap.current, pools.ap.temp, 0);
  const expected = [{ ref: a.source, expectedRevision: actors.locate(room, a.source).contract.revision, finalResources: payment },
    { ref: a.target, expectedRevision: actors.locate(room, a.target).contract.revision, conditions: [{ op: 'add', recordId: a.approvalId, record: condition.recordFor(resolved) }] }];
  if (hash(command.actors) !== hash(expected)) fail('approval_mismatch');
  return entry;
}
// A10: one GM-confirmed bundle — payment, optional direct HP change and one canonical effect (with any
// structured C4 schedule, installed by the P7 stage) — or nothing. Terms are bound to the installed definition.
function bindEffect(room, player, command, authorization, entry) {
  const a = entry.approval, pc = a.source.kind === 'character';
  (pc ? validateApproval : validateCreatureApproval)(a); checkAgainstRoom(room, a);
  if (authorization.authorizerUid !== room.gmId) fail('forbidden');
  if (pc) {
    if (entry.ownerUid !== a.source.ownerUid || actors.locate(room, a.source).token.ownerUserId !== entry.ownerUid || !ownerMember(room, entry.ownerUid)) fail('forbidden');
  } else {
    if (entry.ownerUid !== room.gmId) fail('forbidden');
    if (selfState(room, a) !== entry.selfState) fail('creature_revalidation_required');
  }
  if (hash(command.source) !== hash(a.source) || hash(command.target) !== hash(a.target)) fail('approval_mismatch');
  const adj = command.adjudication;
  if (adj?.definitionId !== a.spell.definitionId || adj.definitionVersionOrHash !== a.spell.definitionHash) fail('approval_mismatch');
  let chosen; try { chosen = JSON.parse(adj.chosenResult); } catch (_) { fail('approval_mismatch'); }
  const resolution = pc ? chosen?.resolution : a.resolution;
  validateConditionResolution(resolution);
  // Changed timing terms are never silently substituted for the owner-approved/admitted ones.
  if (hash(resolution.timing) !== hash(a.effectTerms.timing)) fail(pc ? 'owner_reapproval_required' : 'approval_mismatch');
  // A11: add / refresh / refuse is derived here from the target's current authoritative conditions,
  // never taken from the client; the P7 stage re-derives it independently before installing anything.
  const target = actors.locate(room, a.target), plan = effect.conditionPlan(a, target.token.state?.conditions || []);
  if (plan.refused) fail(plan.refused.code, plan.refused.message);
  if (a.target.kind === 'character') {
    // M3A: the consent boundary is derived from the admitted terms here, never from the client. A creature's direct part uses A5's offer route instead.
    const consent = effect.pcConsent(a.effectTerms, a.source.kind);
    if (!consent.ok) fail(consent.code, consent.message);
    if (consent.a5) fail('pc_target_route_mismatch', 'A creature\'s direct damage or healing on a player character needs the owner\'s response; this command cannot apply it.');
    if (consent.acceptanceRequired && !entry.targetPolicy) fail('target_acceptance_required', 'The target\'s owner must explicitly accept this beneficial effect first.');
    checkTargetAcceptance(room, entry);
    // An accepted healing amount is the amount the owner was shown; any other amount needs a fresh acceptance (A5's rule).
    if (a.effectTerms.direct?.kind === 'healing' && adj.finalAmount !== a.roll.total) fail('owner_reapproval_required', 'The healing amount differs from the accepted proposal; the target\'s owner must accept again.');
  }
  if (hash(chosen) !== hash(effect.resultFor(a, resolution, plan.combination))) fail(plan.combination ? 'modifier_combination_changed' : 'approval_mismatch');
  const direct = a.effectTerms.direct, amount = adj.finalAmount;
  if (direct) {
    if (!int(amount, 0, 100000)) fail('invalid_final_amount');
    if (a.target.kind === 'character' && direct.kind === 'damage' && (amount === 0 || a.roll?.total === 0)) fail('bundle_zero_damage_unsupported', 'Unsupported automation case: a bundle with zero direct damage is not automated. This does not mean the damage was fully blocked, and no rule is set that a rider needs positive damage. Nothing is charged or applied; the evidence is kept for manual adjudication.');
    if (typeof adj.adjustmentReason !== 'string' || adj.adjustmentReason.length > 2000 || (amount !== a.roll.total && !adj.adjustmentReason.trim())) fail('adjustment_reason_required');
  } else if (amount !== 0 || adj.adjustmentReason !== '') fail('approval_mismatch');
  const source = actors.locate(room, a.source);
  const pools = sourcePools(source.token, a.source.kind), payment = {};
  for (const pool of ['ap', 'mana']) if (a.price[pool] > 0) payment[pool] = tempFirst(pools[pool].current, pools[pool].temp, a.price[pool]);
  if (!Object.keys(payment).length) payment.ap = tempFirst(pools.ap.current, pools.ap.temp, 0);
  const targetEntry = { ref: a.target, expectedRevision: target.contract.revision, conditions: plan.ops };
  if (direct) {
    const hp = actors.resources(target.token, a.target.kind).hp;
    validPool(hp);
    const fromTemp = Math.min(hp.temp, amount);
    targetEntry.finalResources = { hp: direct.kind === 'damage' ? { current: Math.max(0, hp.current - (amount - fromTemp)), temp: hp.temp - fromTemp } : { current: Math.min(hp.max, hp.current + amount), temp: hp.temp } };
  }
  const expected = [{ ref: a.source, expectedRevision: source.contract.revision, finalResources: payment }, targetEntry];
  if (hash(command.actors) !== hash(expected)) fail('approval_mismatch');
  return entry;
}
/**
 * M1: one GM-confirmed class-paid composed effect. The GM records one of the owner-approved outcome branches;
 * payment (AP, mana, typed class payment) and the direct HP change apply on every branch, the movement rider only
 * on a branch the definition says applies it. A11 add/refresh/refusal is derived here from authoritative state
 * and re-derived by the P7 stage. One command, or nothing.
 */
function bindClassEffect(room, player, command, authorization, entry) {
  const a = entry.approval;
  validateApproval(a);
  const profileEntry = checkClassEffectTerms(a);
  const source = actors.locate(room, a.source);
  if (a.classPayment && hash(home(source.token)) !== hash({ domain: a.classPayment.domain, value: a.classPayment.before })) fail('owner_reapproval_required');
  checkAgainstRoom(room, a);
  if (authorization.authorizerUid !== room.gmId) fail('forbidden');
  if (entry.ownerUid !== a.source.ownerUid || source.token.ownerUserId !== entry.ownerUid || !ownerMember(room, entry.ownerUid)) fail('forbidden');
  if (hash(command.source) !== hash(a.source) || hash(command.target) !== hash(a.target)) fail('approval_mismatch');
  const adj = command.adjudication;
  if (adj?.definitionId !== a.spell.definitionId || adj.definitionVersionOrHash !== a.spell.definitionHash) fail('approval_mismatch');
  let chosen; try { chosen = JSON.parse(adj.chosenResult); } catch (_) { fail('approval_mismatch'); }
  const branch = chosen?.branch;
  if (!classEffect.branches(a.effectTerms).includes(branch)) fail('class_effect_branch_unbound', 'Only an outcome the owner approved can be recorded.');
  const target = actors.locate(room, a.target);
  let ops = null, combination = null;
  if (classEffect.riderApplies(a.effectTerms, branch)) {
    const record = classEffect.recordFor(a, profileEntry), plan = conditionProfile.movementCombination(target.token.state?.conditions || [], record);
    if (!plan.ok) fail(plan.code, plan.message);
    const add = { op: 'add', recordId: a.approvalId, record };
    ops = plan.replaces ? [{ op: 'remove', recordId: plan.replaces }, add] : [add];
    combination = { outcome: plan.outcome, replacesInstanceId: plan.replaces };
  }
  if (hash(chosen) !== hash(classEffect.resultFor(a, branch, combination))) fail(combination ? 'modifier_combination_changed' : 'approval_mismatch');
  const amount = adj.finalAmount;
  if (!int(amount, 0, 100000)) fail('invalid_final_amount');
  if (typeof adj.adjustmentReason !== 'string' || adj.adjustmentReason.length > 2000 || (amount !== a.roll.total && !adj.adjustmentReason.trim())) fail('adjustment_reason_required');
  const pools = sourcePools(source.token, 'character'), payment = {};
  for (const pool of ['ap', 'mana']) if (a.price[pool] > 0) payment[pool] = tempFirst(pools[pool].current, pools[pool].temp, a.price[pool]);
  if (!Object.keys(payment).length) payment.ap = tempFirst(pools.ap.current, pools.ap.temp, 0);
  const hp = actors.resources(target.token, 'creature').hp;
  validPool(hp);
  const fromTemp = Math.min(hp.temp, amount);
  const finalHp = a.effectTerms.direct.kind === 'damage' ? { current: Math.max(0, hp.current - (amount - fromTemp)), temp: hp.temp - fromTemp } : { current: Math.min(hp.max, hp.current + amount), temp: hp.temp };
  const expected = [{ ref: a.source, expectedRevision: source.contract.revision, finalResources: payment,
    ...(a.classPayment ? { classPayment: { mode: 'spell', domain: a.classPayment.domain, approvalHash: entry.contentHash } } : {}) },
  { ref: a.target, expectedRevision: target.contract.revision, finalResources: { hp: finalHp }, ...(ops ? { conditions: ops } : {}) }];
  if (hash(command.actors) !== hash(expected)) fail('approval_mismatch');
  return entry;
}
// A9: GM designation and exact target consent live with the original A8 approval.
// No owner/client mode flag is accepted in the approval or command DTO.
// M3A: an authored-effect bundle uses the same record. Its exact terms (direct part, rider, timing, proposed amount) are bound too.
function bundleParts(a) {
  const t = a.effectTerms, c = t.condition;
  return { direct: t.direct ? { kind: t.direct.kind, damageTypes: t.direct.damageTypes || [], formula: t.direct.formula, proposedAmount: a.roll ? a.roll.total : null } : null,
    condition: clone(c), timing: clone(t.timing) };
}
function targetTerms(entry) {
  const a = entry.approval;
  if (effect.isEffect(a)) {
    return { approvalId: a.approvalId, contentHash: entry.contentHash, source: clone(a.source), target: clone(a.target),
      spell: clone(a.spell), price: clone(a.price), bundle: bundleParts(a) };
  }
  if (require('../shared/services/authoredAbility').isFormula(a) && a.target.kind === 'character') {
    return { approvalId: a.approvalId, contentHash: entry.contentHash, source: clone(a.source), target: clone(a.target),
      spell: clone(a.spell), price: clone(a.price), classPayment: clone(a.classPayment),
      healing: { formula: a.roll?.reading || '', proposedAmount: a.roll?.total ?? null } };
  }
  return { approvalId: a.approvalId, contentHash: entry.contentHash, source: clone(a.source), target: clone(a.target),
    spell: clone(a.spell), price: clone(a.price), conditionKey: 'stunned', timing: clone(a.conditionTerms?.timing || a.resolution.timing) };
}
function targetProposal(entry) {
  const p = entry.targetPolicy;
  if (!p) return null;
  const t = targetTerms(entry);
  const base = { proposalId: p.proposalId, approvalId: t.approvalId, termsHash: p.termsHash, target: t.target,
    price: t.price, definitionId: t.spell.definitionId, definitionVersionOrHash: t.spell.definitionHash,
    sourceHandle: p.sourceHandle, source: 'GM-designated source (identity withheld)',
    mode: p.mode, accepted: !!p.acceptedUid, withdrawn: p.withdrawn === true };
  // Exact terms hash binds the concealed source/definition without disclosing either.
  if (t.healing) return { ...base, healing: clone(t.healing), consent: 'required' };
  if (t.bundle) {
    const c = t.bundle.condition;
    return { ...base, conditionKey: c.kind === 'stunned' ? 'stunned' : c.kind === 'attribute' ? 'attribute' : 'movement', durationText: t.bundle.timing.durationText, expiryPolicy: t.bundle.timing.expiryPolicy,
      ...(t.bundle.timing.occurrences !== undefined ? { occurrences: t.bundle.timing.occurrences } : {}),
      bundle: { ...t.bundle, timing: { durationText: t.bundle.timing.durationText, expiryPolicy: t.bundle.timing.expiryPolicy, ...(t.bundle.timing.occurrences !== undefined ? { occurrences: t.bundle.timing.occurrences } : {}) } },
      consent: effect.pcConsent(entry.approval.effectTerms, entry.approval.source.kind) };
  }
  return { ...base, conditionKey: 'stunned', durationText: t.timing.durationText, expiryPolicy: 'gm-manual' };
}
/** What target consent an approval aimed at a PC needs: 'none' (hostile default), 'designatable' (GM may ask), 'required' (always asked). */
function targetConsent(approval) {
  if (approval.target?.kind !== 'character') return 'none';
  if (condition.isCondition(approval)) return 'designatable';
  if (!effect.isEffect(approval)) {
    // M4B: direct formula healing aimed at a primary PC always needs that owner's
    // affirmative acceptance. Hostile formula damage keeps the creature-only route.
    return require('../shared/services/authoredAbility').isFormula(approval) && approval.spell.kind === 'healing' ? 'required' : 'none';
  }
  const consent = effect.pcConsent(approval.effectTerms, approval.source.kind);
  return !consent.ok || consent.a5 ? 'none' : consent.acceptanceRequired ? 'required' : 'designatable';
}
/** One server-derived record: the GM designates it, or beneficial content makes it mandatory. Never an owner/client flag. */
function ensureTargetPolicy(entry, gmUid) {
  if (!entry.targetPolicy) entry.targetPolicy = { mode: 'voluntary', gmUid, proposalId: require('crypto').randomUUID(),
    sourceHandle: require('crypto').randomUUID(), termsHash: require('crypto').randomBytes(32).toString('hex'), bindingHash: hash(targetTerms(entry)) };
  return entry.targetPolicy;
}
function checkTargetAcceptance(room, entry) {
  if (entry.approval.target?.kind !== 'character') return;
  const p = entry.targetPolicy;
  if (!p) {
    // M4B repair R3: beneficial PC healing always needs the exact target-owner record.
    if (targetConsent(entry.approval) === 'required') fail('target_acceptance_required', 'The target owner must accept this exact proposal first; nothing was paid or applied.');
    return; // Hostile default; authenticated current-GM command authorizes installation.
  }
  if (p.gmUid !== room.gmId || p.bindingHash !== hash(targetTerms(entry))) fail('target_proposal_changed');
  if (p.mode === 'voluntary' && (p.withdrawn || p.acceptedUid !== entry.approval.target.ownerUid)) fail('target_acceptance_required');
}
const conditionProfile = require('../shared/services/sharedConditionProfile');
module.exports = { CAPABILITY, DOMAINS, ELEMENTS, PITCHES, APPROVED_MINSTREL_SPELLS, validateValue, validatePrice, validateMinstrelSpellApproval, conserve, publicValue, home, validateEntry, validateApproval, validateCreatureApproval,
  validateRoll, tempFirst, selfState, checkAgainstRoom, checkWindow, get, add, remove, listAll, close, closedCode, closedEntry, pendingFor, consumedReceipt, gmProjection, bindCommand, ownerMember,
  targetTerms, targetProposal, checkTargetAcceptance, targetConsent, ensureTargetPolicy };
