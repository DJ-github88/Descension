/** A7 companion codec/planner for the SAME installed registry. Legacy-only snapshots delegate to
 * the protected A1a implementation. Schema2 permits both compiler versions with identical custody,
 * limits, decision hashes, sequential versions and current-GM authority. No execution flag grants use. */
const legacy = require('./authoredSpellDefinitions');
const checkpoint = require('./roomCheckpoint');
const { CONDITION_CAPABILITY, EFFECT_CAPABILITY, EFFECT_EXPIRY_POLICIES, COUNTED_EXPIRY_POLICIES, CLASS_IDS, readFormula } = require('../shared/services/authoredAbility');
const { FORMULA_CAPABILITY, FORMULA_COMPILER, AREA_CAPABILITY, AREA_COMPILER, MAX_AREA_TARGETS, isAreaRollProcedureApproved, readScaledFormula, formulaAttributes } = require('../shared/services/authoredAbility');
const { HEALTH_CAPABILITY, HEALTH_COMPILER, readHealthFormula } = require('../shared/services/authoredAbility');
const { DETERMINISTIC_CAPABILITY, DETERMINISTIC_COMPILER, readDeterministicFormula } = require('../shared/services/authoredAbility');
const catalogueAbility = require('../shared/services/catalogueAbility.cjs');
const { validMovementFeet, validOccurrences, supportedAttribute, validAttributeAmount, validDamageReductionAmount, validTickFormula } = require('../shared/services/sharedConditionProfile');
// M2A: counted expiry policies (explicit target-turn boundary count 2…10) add exactly one key; every other policy keeps the exact A10 key set.
const validEffectTiming = t => !!t && typeof t === 'object' && EFFECT_EXPIRY_POLICIES.includes(t.expiryPolicy) &&
  (COUNTED_EXPIRY_POLICIES.includes(t.expiryPolicy) ? exact(t, ['expiryPolicy', 'durationText', 'authoredDuration', 'gmNote', 'occurrences']) && validOccurrences(t.occurrences)
    : exact(t, ['expiryPolicy', 'durationText', 'authoredDuration', 'gmNote']));
const VERSION = 'p14-a7-condition-1';
const EFFECT_VERSION = 'p14-a10-effect-1';
// M5: a periodic A10 bundle compiles under its own compiler version (same registry, custody, hash domain and admission).
const PERIODIC_VERSION = 'p14-m5-periodic-1';
// M5 composition: one immediate direct part (same kind as the tick) + one periodic tick. Same shape/hash domain; its own compiler id.
const COMPOSITION_VERSION = 'p14-m5-composition-1';
// M5 composition + M4A: the immediate part reads owner-attested attribute scores through the existing scaled reader.
const COMPOSITION_FORMULA_VERSION = 'p14-m5-composition-formula-1';
const scaledDirect = direct => !!direct && formulaAttributes(direct.formula).length > 0;
// Shared GM-recorded save branch: a bundle whose one save negates only its canonical effect (plain direct part, non-periodic effect).
const SAVE_BRANCH_VERSION = 'p14-save-branch-1';
// Timed save branch: the same save shape with a structured target-turn expiry (next start/end or counted, validated by validEffectTiming).
// Both recorded outcomes need the authenticated schedule (spellPayments.bindEffect). Manual-expiry save bundles keep SAVE_BRANCH_VERSION.
// A pre-change server refuses such a registry (its validEffectSave required manual expiry), so roll back only while none is admitted.
const SAVE_BRANCH_TIMED_VERSION = 'p14-save-branch-timed-1';
const saveBranch = require('../shared/services/saveBranch');
// Formula-rider saves: the direct part may also be attribute-scaled when the rider is movement OR Stunned (validDirect admits the scaled
// reader only next to periodic/movement/Stunned, and periodic never carries a save). Its own descriptor labels below. A pre-change server
// refuses such a registry (its validEffectSave required a plain direct part), so roll back only while none is admitted.
const SAVE_BRANCH_FORMULA_VERSION = 'p14-save-branch-formula-1';
const SAVE_BRANCH_TIMED_FORMULA_VERSION = 'p14-save-branch-timed-formula-1';
const SAVE_FORMULA_CONDITIONS = Object.freeze(['movement', 'stunned']);
// Formula-rider save cooldowns: the same caster-start cooldown key on that shape; same check/start/release machinery, its own labels. A pre-change
// server refuses such a registry (its validEffectCooldown excluded a scaled part with a save), so roll back only while none is admitted.
const SAVE_BRANCH_FORMULA_COOLDOWN_VERSION = 'p14-save-branch-formula-cooldown-1';
const SAVE_BRANCH_TIMED_FORMULA_COOLDOWN_VERSION = 'p14-save-branch-timed-formula-cooldown-1';
const validEffectSave = (effects, timing) => !Object.hasOwn(effects, 'save') ||
  (saveBranch.validSave(effects.save, ['condition']) && effects.direct !== null && !['periodic', 'damageReduction'].includes(effects.condition?.kind) &&
    (!scaledDirect(effects.direct) || SAVE_FORMULA_CONDITIONS.includes(effects.condition?.kind)) && typeof timing?.expiryPolicy === 'string');
// Composed cooldowns: the installed Wizard combat cooldown (authenticated caster-turn starts) on an immediate + periodic bundle.
// Same shape/hash domain plus one exact `cooldown` key; a pre-change server refuses such a registry because its exact-key check rejects
// `cooldown` (review F1). The distinct compiler ids only label the descriptor; they are not an admission check.
const COMPOSITION_COOLDOWN_VERSION = 'p14-m5-composition-cooldown-1';
const COMPOSITION_FORMULA_COOLDOWN_VERSION = 'p14-m5-composition-formula-cooldown-1';
const authoredCooldown = require('../shared/services/authoredCooldown');
// Effect cooldowns: the same procedure on a standalone periodic bundle and on a movement OR Stunned rider bundle (with or without its
// existing plain immediate part). Same key, check/start/release machinery; their own descriptor labels.
// Class-paid bundles keep refusing the key (a rider-local save: see rider-save cooldowns below). A pre-change server refuses these registries (validEffectCooldown required direct + periodic).
const PERIODIC_COOLDOWN_VERSION = 'p14-m5-periodic-cooldown-1';
const EFFECT_COOLDOWN_VERSION = 'p14-a10-effect-cooldown-1';
// Attribute cooldowns reuse the installed flat attribute family and A10 executor, including its optional plain direct part.
// FORMULA_CONDITIONS and SAVE_COOLDOWN_CONDITIONS deliberately exclude attributes.
const ATTRIBUTE_COOLDOWN_VERSION = 'p14-a10-attribute-cooldown-1';
// Positive flat DR reuses A10 installation and its existing single-DR refusal, with an independent cooldown.
const FLAT_DR_COOLDOWN_VERSION = 'p14-a10-flat-dr-cooldown-1';
const COOLDOWN_CONDITIONS = Object.freeze(['periodic', 'movement', 'stunned', 'attribute', 'damageReduction']);
// Formula-rider cooldowns: the same key on a movement OR Stunned rider whose immediate part uses the M4A attribute vocabulary; same
// check/start/release machinery, its own descriptor label. A pre-change server refuses these registries (validEffectCooldown excluded a
// scaled rider), so roll back only while none is admitted.
const EFFECT_FORMULA_COOLDOWN_VERSION = 'p14-a10-effect-formula-cooldown-1';
// Rider-save cooldowns: the same key on a movement OR Stunned bundle that also carries its existing rider-local "negates" save
// (plain or, under the formula-rider save cooldown labels below, attribute-scaled direct part). Same check/start/release machinery: the cooldown starts in the one successful
// cast commit on either recorded outcome. Their own descriptor labels. A pre-change server refuses these registries (validEffectCooldown
// excluded any save), so roll back only while none is admitted.
const SAVE_BRANCH_COOLDOWN_VERSION = 'p14-save-branch-cooldown-1';
const SAVE_BRANCH_TIMED_COOLDOWN_VERSION = 'p14-save-branch-timed-cooldown-1';
const SAVE_COOLDOWN_CONDITIONS = Object.freeze(['movement', 'stunned']);
const validEffectCooldown = d => !Object.hasOwn(d, 'cooldown') ||
  (authoredCooldown.valid(d.cooldown) && COOLDOWN_CONDITIONS.includes(d.effects?.condition?.kind) &&
    (!Object.hasOwn(d.effects, 'save') || SAVE_COOLDOWN_CONDITIONS.includes(d.effects.condition.kind)));
// Formula riders: one movement OR Stunned effect whose immediate part uses the M4A attribute vocabulary (same scaled reader and binding as the
// M5 composition). Same shape/hash domain; its own descriptor label. No save or class payment on this route (a cooldown takes the
// formula-rider cooldown label above). A pre-change server
// refuses such a registry (its validDirect admitted a scaled part next to a periodic tick only), so roll back only while none is admitted.
const EFFECT_FORMULA_VERSION = 'p14-a10-effect-formula-1';
const FORMULA_CONDITIONS = Object.freeze(['periodic', 'movement', 'stunned']);
function scaledRider(effects) { return !!effects && scaledDirect(effects.direct) && effects.condition?.kind !== 'periodic'; }
const FORMULA_PAYMENT_COMPILER = 'p14-m4b-class-payment-1';
// Same damage vocabulary as the protected A1a compiler (not exported there; kept in parity here).
const DAMAGE_TYPES = ['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd', 'slicing', 'stabbing', 'smashing'];
const PAYMENT_DOMAINS = Object.freeze({ arcanoneer: 'elementalSpheres', minstrel: 'musicalNotes', martyr: 'devotionGauge' });
const ELEMENTS = Object.freeze(['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd']);
const PITCHES = Object.freeze(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']);
const clone = v => JSON.parse(JSON.stringify(v));
const hash = checkpoint.canonicalHash;
const equal = (a, b) => hash(a) === hash(b);
const uuid = v => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(v || '');
const text = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const int = (v, min, max) => Number.isSafeInteger(v) && v >= min && v <= max;
const exact = (o, fields) => o && Object.getPrototypeOf(o) === Object.prototype && Object.keys(o).sort().join('|') === fields.slice().sort().join('|');
const no = (code = 'INVALID_REGISTRY') => ({ ok: false, code });
// Reject lossy/non-JSON shapes before reading any user property, matching the protected compiler's
// ownership boundary. The room transport supplies plain JSON; codec/helper callers receive the same fence.
function snapshot(value, depth = 0) {
  if (depth > 16) throw Error('depth');
  if (value === null || typeof value === 'boolean' || typeof value === 'string' && Buffer.from(value).toString('utf8') === value || typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value || typeof value !== 'object' || Object.getOwnPropertySymbols(value).length) throw Error('shape');
  const array = Array.isArray(value);
  if (Object.getPrototypeOf(value) !== (array ? Array.prototype : Object.prototype)) throw Error('prototype');
  const names = Object.getOwnPropertyNames(value), out = array ? [] : {};
  if (array && names.length !== value.length + 1) throw Error('array');
  for (const key of names) {
    if (array && key === 'length') continue;
    const d = Object.getOwnPropertyDescriptor(value, key);
    if (!d.enumerable || !Object.hasOwn(d, 'value') || ['__proto__', 'constructor', 'prototype'].includes(key) || /^__.*__$/.test(key)) throw Error('property');
    out[key] = snapshot(d.value, depth + 1);
  }
  if (array && out.length !== value.length) throw Error('sparse');
  return out;
}
// A10 companion: one exact bundle. Unknown/partial vocabulary refuses; it never executes a subset.
function validDirect(direct, scaledAllowed = false) {
  if (direct === null) return true;
  // M5 composition / formula riders: next to a periodic tick, or a movement OR Stunned effect, the immediate formula may use the M4A
  // attribute vocabulary (at least one attribute).
  try { readFormula(direct?.formula); } catch (_) {
    if (!scaledAllowed || typeof direct?.formula !== 'string' || !scaledDirect(direct) || !readScaledFormula(direct.formula, Object.fromEntries(formulaAttributes(direct.formula).map(n => [n, 10]))).supported) return false;
  }
  if (direct.kind === 'healing') return exact(direct, ['kind', 'formula']);
  return direct.kind === 'damage' && exact(direct, ['kind', 'formula', 'damageTypes']) && Array.isArray(direct.damageTypes) && direct.damageTypes.length >= 1 &&
    direct.damageTypes.length <= 8 && direct.damageTypes.every(t => DAMAGE_TYPES.includes(t));
}
function validEffectCondition(c) {
  if (c?.kind === 'stunned') return exact(c, ['kind']);
  // Attribute family: one flat change to one supported attribute (same label rule as movement).
  if (c?.kind === 'attribute') return exact(c, ['kind', 'attribute', 'amount', 'label']) && supportedAttribute(c.attribute) && validAttributeAmount(c.amount) && text(c.label, 60) && c.label === c.label.trim();
  // Flat DR family: one positive flat DR modifier (+1..+20).
  if (c?.kind === 'damageReduction') return exact(c, ['kind', 'amount', 'label']) && validDamageReductionAmount(c.amount) && text(c.label, 60) && c.label === c.label.trim();
  // M5: one periodic damage OR healing tick (NdM±K), explicit per-tick roll; the timing names its boundary and count.
  if (c?.kind === 'periodic') return exact(c, ['kind', 'tick', 'label', 'tickRoll']) && c.tickRoll === 'each-tick' && text(c.label, 60) && c.label === c.label.trim() &&
    !!c.tick && validTickFormula(c.tick.formula) && (c.tick.kind === 'healing' ? exact(c.tick, ['kind', 'formula'])
      : c.tick.kind === 'damage' && exact(c.tick, ['kind', 'formula', 'damageTypes']) && Array.isArray(c.tick.damageTypes) && c.tick.damageTypes.length === 1 && DAMAGE_TYPES.includes(c.tick.damageTypes[0]));
  return c?.kind === 'movement' && exact(c, ['kind', 'feet', 'label']) && validMovementFeet(c.feet) && text(c.label, 60) && c.label === c.label.trim();
}
function compileEffect(d, { verifyCatalogue = true } = {}) {
  const canonical = checkpoint.canonicalize(d, 'definition');
  if (canonical.error || Buffer.byteLength(JSON.stringify(d)) > 16384 || !equal(d, canonical.value)) return no('INVALID_DEFINITION');
  if (d?.classPayment !== undefined && d?.catalogueSource === undefined) return no('UNSUPPORTED_SHAPE');
  if (d?.catalogueSource !== undefined && d?.classPayment === undefined) return no('UNSUPPORTED_SHAPE');
  // Reconciliation gate: a typed class payment is reviewed only on the plain/periodic composition route. Combining it with the
  // separately reviewed save branch or caster-start cooldown is an unreviewed route and stays manual.
  if (d?.classPayment !== undefined && (Object.hasOwn(d, 'cooldown') || (d?.effects && Object.hasOwn(d.effects, 'save')))) return no('UNSUPPORTED_SHAPE');
  // Formula riders carry no typed class payment (no reviewed class-paid scaled rider).
  if (d?.classPayment !== undefined && scaledRider(d?.effects)) {return no('UNSUPPORTED_SHAPE');}
  const effectKeys = ['schemaVersion', 'capability', 'scope', 'definitionId', 'definitionVersion', 'name', 'description', 'binding', 'spellType', 'castTimeType', 'targeting', 'resourceCost', 'effects', 'timing']
    .concat(d?.classPayment !== undefined ? ['classPayment'] : [])
    .concat(d?.catalogueSource !== undefined ? ['catalogueSource'] : [])
    .concat(Object.hasOwn(d || {}, 'cooldown') ? ['cooldown'] : []);
  if (!exact(d, effectKeys) || !validEffectCooldown(d) ||
      d.schemaVersion !== 3 || !exact(d.scope, ['roomId']) || !text(d.scope.roomId, 200) || !uuid(d.definitionId) || !int(d.definitionVersion, 1, 1000000) ||
      !text(d.name, 120) || typeof d.description !== 'string' || d.description.length > 4000 ||
      !exact(d.binding, ['rulesetId', 'rulesetVersion', 'classId']) || d.binding.rulesetId !== 'prism' || d.binding.rulesetVersion !== 'cr-a1a-pilot-1' || !CLASS_IDS.includes(d.binding.classId) ||
      d.spellType !== 'ACTION' || d.castTimeType !== 'IMMEDIATE' ||
      !exact(d.targeting, ['kind', 'maxTargets', 'rangeFeet', 'restriction']) || d.targeting.kind !== 'single' || d.targeting.maxTargets !== 1 || !int(d.targeting.rangeFeet, 1, 300) || !['any', 'ally', 'enemy'].includes(d.targeting.restriction) ||
      !exact(d.resourceCost, ['actionPoints', 'mana']) || !int(d.resourceCost.actionPoints, 0, 20) || !int(d.resourceCost.mana, 0, 10000) ||
      !(exact(d.effects, ['direct', 'condition']) || exact(d.effects, ['direct', 'condition', 'save'])) || !validEffectSave(d.effects, d.timing) ||
      !validDirect(d.effects.direct, FORMULA_CONDITIONS.includes(d.effects.condition?.kind)) || !validEffectCondition(d.effects.condition) ||
      (d.effects.condition.kind === 'periodic' && ((d.effects.direct !== null && d.effects.direct.kind !== d.effects.condition.tick.kind) || d.timing?.expiryPolicy === 'gm-manual')) ||
      !validEffectTiming(d.timing) ||
      !text(d.timing.durationText, 300) || !text(d.timing.gmNote, 1000) ||
      ![null, '{}', '{"durationType":"instant"}'].includes(d.timing.authoredDuration === null ? null : JSON.stringify(d.timing.authoredDuration))) return no('INVALID_DEFINITION');
  if (d.classPayment !== undefined && !validClassPayment(d.classPayment, d.binding.classId)) return no('UNSUPPORTED_SHAPE');
  if (d.catalogueSource !== undefined) {
    if (!validCatalogueSource(d.catalogueSource, d.binding.classId)) return no('UNSUPPORTED_SHAPE');
    if (verifyCatalogue && !catalogueAbility.verifyDefinition(d).ok) return no('CATALOGUE_PROVENANCE_UNTRUSTED');
  }
  const canonicalDefinition = canonical.value;
  const definitionHash = checkpoint.sha256Hex('mythrill:authored-effect:v1\n' + checkpoint.stableStringify(canonicalDefinition));
  const definitionRef = { roomId: d.scope.roomId, definitionId: d.definitionId, definitionVersion: d.definitionVersion, definitionHash };
  const cooldown = Object.hasOwn(d, 'cooldown');
  const compilerVersion = cooldown && d.effects.condition.kind === 'damageReduction' ? FLAT_DR_COOLDOWN_VERSION : cooldown && d.effects.condition.kind === 'attribute' ? ATTRIBUTE_COOLDOWN_VERSION : d.effects.condition.kind === 'periodic'
    ? (d.effects.direct ? (scaledDirect(d.effects.direct) ? (cooldown ? COMPOSITION_FORMULA_COOLDOWN_VERSION : COMPOSITION_FORMULA_VERSION) : (cooldown ? COMPOSITION_COOLDOWN_VERSION : COMPOSITION_VERSION)) : (cooldown ? PERIODIC_COOLDOWN_VERSION : PERIODIC_VERSION))
    : Object.hasOwn(d.effects, 'save') ? (scaledDirect(d.effects.direct) ? (d.timing.expiryPolicy === 'gm-manual' ? (cooldown ? SAVE_BRANCH_FORMULA_COOLDOWN_VERSION : SAVE_BRANCH_FORMULA_VERSION) : (cooldown ? SAVE_BRANCH_TIMED_FORMULA_COOLDOWN_VERSION : SAVE_BRANCH_TIMED_FORMULA_VERSION))
      : d.timing.expiryPolicy === 'gm-manual' ? (cooldown ? SAVE_BRANCH_COOLDOWN_VERSION : SAVE_BRANCH_VERSION) : (cooldown ? SAVE_BRANCH_TIMED_COOLDOWN_VERSION : SAVE_BRANCH_TIMED_VERSION)) : (cooldown ? (scaledRider(d.effects) ? EFFECT_FORMULA_COOLDOWN_VERSION : EFFECT_COOLDOWN_VERSION) : scaledRider(d.effects) ? EFFECT_FORMULA_VERSION : EFFECT_VERSION);
  return { ok: true, canonicalDefinition, definitionHash, descriptor: Object.assign({ schemaVersion: 3, capabilityId: EFFECT_CAPABILITY, compilerVersion,
    definitionRef, binding: clone(d.binding), price: { ap: d.resourceCost.actionPoints, mana: d.resourceCost.mana }, targeting: clone(d.targeting), effects: clone(d.effects), timing: clone(d.timing), executionEnabled: false },
  cooldown ? { cooldown: clone(d.cooldown) } : {},
  d.classPayment !== undefined ? { classPayment: clone(d.classPayment), catalogueSource: clone(d.catalogueSource) } : {}) };
}
function validClassPayment(payment, classId) {
  const domain = PAYMENT_DOMAINS[classId];
  if (!domain || !exact(payment, ['domain', 'price']) || payment.domain !== domain) return false;
  const price = payment.price;
  if (domain === 'devotionGauge') return exact(price, ['cost', 'gain', 'required']) &&
    [price.cost, price.gain, price.required].every(value => int(value, 0, 6));
  if (!exact(price, ['costs', 'gains']) || !Array.isArray(price.costs) || !Array.isArray(price.gains) ||
    price.costs.length > 35 || price.gains.length > 35) return false;
  const vocabulary = domain === 'elementalSpheres' ? ELEMENTS : PITCHES;
  return price.costs.concat(price.gains).every(value => vocabulary.includes(value)) &&
    !(domain === 'musicalNotes' && price.costs.length > 0 && price.gains.length > 0);
}
function validCatalogueSource(source, classId) {
  return exact(source, ['spellId', 'classId', 'recordHash']) && text(source.spellId, 120) &&
    source.classId === classId && /^[0-9a-f]{64}$/.test(source.recordHash || '');
}
function compileFormula(d, { verifyCatalogue = true } = {}) {
  const cooldown = d.cooldown !== undefined;
  if (cooldown && (!require('../shared/services/authoredCooldown').valid(d.cooldown) || d.catalogueSource !== undefined || d.classPayment !== undefined || d.targetRoute !== undefined || d.targeting?.restriction === 'self' || !int(d.targeting?.rangeFeet, 1, 300))) return no('UNSUPPORTED_SHAPE');
  const deterministic = d.capability === DETERMINISTIC_CAPABILITY;
  const health = d.capability === HEALTH_CAPABILITY;
  if (deterministic ? d.schemaVersion !== 7 : health ? d.schemaVersion !== 6 : d.schemaVersion !== 4 || d.capability !== FORMULA_CAPABILITY) return no('INVALID_DEFINITION');
  const extended = d.classPayment !== undefined || d.targetRoute !== undefined || d.catalogueSource !== undefined;
  const stats = Object.fromEntries(CLASS_ATTRIBUTES.map(name => [name, 10]));
  const reading = d.effect && typeof d.effect.formula === 'string'
    ? (deterministic ? readDeterministicFormula(d.effect.formula, stats, { current: 0, max: 0 }) : health ? readHealthFormula(d.effect.formula, stats, { current: 0, max: 0 }) : readScaledFormula(d.effect.formula, stats))
    : { supported: false };
  const selfHeal = !extended && !cooldown && !health && reading.readsHealth !== true && d.effect?.kind === 'healing' &&
    d.targeting?.kind === 'single' && d.targeting?.restriction === 'self' && d.targeting?.rangeFeet === 0;
  if (d.targeting?.restriction === 'self' && !selfHeal) return no('UNSUPPORTED_SHAPE');
  if ((health || (deterministic && !selfHeal)) && (extended || d.targeting?.restriction === 'self' || !int(d.targeting?.rangeFeet, 1, 300))) return no('UNSUPPORTED_SHAPE');
  if (extended) {
    if (d.classPayment !== undefined && (d.catalogueSource === undefined || !validClassPayment(d.classPayment, d.binding?.classId))) return no('UNSUPPORTED_SHAPE');
    if (d.catalogueSource !== undefined && !validCatalogueSource(d.catalogueSource, d.binding?.classId)) return no('UNSUPPORTED_SHAPE');
    if (d.targetRoute !== undefined && (d.targetRoute !== 'primary-pc-healing' || d.effect?.kind !== 'healing' || d.targeting?.restriction !== 'ally')) return no('UNSUPPORTED_SHAPE');
  }
  // M4B repair R1: a self-computed record hash is not catalogue authority. The exact
  // class/spell/record pin and its reviewed executable projection are required.
  // M4B repair R4: stored-registry validation checks immutable structure/hashes only.
  // A retired pin must leave the well-formed record decodable; admission and cast still
  // require current eligibility, and no other catalogue version is substituted.
  if (verifyCatalogue && d.catalogueSource !== undefined) {
    const verified = catalogueAbility.verifyDefinition(d);
    if (!verified.ok) return no('CATALOGUE_PROVENANCE_UNTRUSTED');
  }
  // Reuse A1's whole-definition fences; only formula syntax and capability/version differ.
  const projection = clone(d); delete projection.capability;
  delete projection.cooldown;
  delete projection.classPayment; delete projection.targetRoute; delete projection.catalogueSource;
  projection.schemaVersion = 1;
  if (!projection.effect) return no('INVALID_DEFINITION');
  projection.effect.formula = '1d2';
  const base = legacy.compileDefinition(projection);
  if (!base.ok || !reading.supported || (health && !reading.readsHealth)) return no('UNSUPPORTED_SHAPE');
  const canonicalDefinition = checkpoint.canonicalize(d, 'definition').value;
  const definitionHash = checkpoint.sha256Hex(`mythrill:${d.capability}\n` + checkpoint.stableStringify(canonicalDefinition));
  const definitionRef = Object.assign({}, base.descriptor.definitionRef, { definitionHash });
  const descriptor = Object.assign({}, base.descriptor, { schemaVersion: d.schemaVersion, capabilityId: d.capability,
    compilerVersion: deterministic ? DETERMINISTIC_COMPILER : health ? HEALTH_COMPILER : extended ? FORMULA_PAYMENT_COMPILER : FORMULA_COMPILER, definitionRef,
    effect: Object.assign({}, clone(d.effect), { dice: reading.dice, attributes: require('../shared/services/classEffect').formulaAttributes(d.effect.formula) }) });
  if (d.classPayment !== undefined) descriptor.classPayment = clone(d.classPayment);
  if (d.targetRoute !== undefined) descriptor.targetRoute = d.targetRoute;
  if (d.catalogueSource !== undefined) descriptor.catalogueSource = clone(d.catalogueSource);
  if (cooldown) { descriptor.cooldown = clone(d.cooldown); descriptor.compilerVersion = 'p14-wizard-cooldown-1'; }
  return { ok: true, canonicalDefinition, definitionHash, descriptor };
}
const CLASS_ATTRIBUTES = require('../shared/services/classEffect').ATTRIBUTES;
function compileArea(d, { verifyCatalogue = true, verifyRollPolicy = true } = {}) {
  const canonical = checkpoint.canonicalize(d, 'definition');
  if (canonical.error || Buffer.byteLength(JSON.stringify(d)) > 16384 || !equal(d, canonical.value)) return no('INVALID_DEFINITION');
  const rootKeys = ['schemaVersion', 'capability', 'scope', 'definitionId', 'definitionVersion', 'name', 'description', 'binding', 'spellType', 'castTimeType', 'targeting', 'resourceCost', 'effect']
    .concat(d.classPayment !== undefined ? ['classPayment'] : [])
    .concat(d.catalogueSource !== undefined ? ['catalogueSource'] : []);
  if (!exact(d, rootKeys) || d.schemaVersion !== 5 || d.capability !== AREA_CAPABILITY ||
      !exact(d.scope, ['roomId']) || !text(d.scope.roomId, 200) || !uuid(d.definitionId) || !int(d.definitionVersion, 1, 1000000) ||
      !text(d.name, 120) || typeof d.description !== 'string' || d.description.length > 4000 ||
      !exact(d.binding, ['rulesetId', 'rulesetVersion', 'classId']) || d.binding.rulesetId !== 'prism' || d.binding.rulesetVersion !== 'cr-a1a-pilot-1' || !CLASS_IDS.includes(d.binding.classId) ||
      d.spellType !== 'ACTION' || d.castTimeType !== 'IMMEDIATE' ||
      !exact(d.targeting, ['kind', 'aoeShape', 'radiusFeet', 'rangeFeet', 'maxTargets', 'restriction']) ||
      d.targeting.kind !== 'area' || d.targeting.aoeShape !== 'circle' ||
      !int(d.targeting.radiusFeet, 5, 60) || d.targeting.radiusFeet % 5 !== 0 ||
      !int(d.targeting.rangeFeet, 1, 300) || !Number.isSafeInteger(d.targeting.maxTargets) || d.targeting.maxTargets < 1 ||
      !['any', 'ally', 'enemy'].includes(d.targeting.restriction) ||
      !exact(d.resourceCost, ['actionPoints', 'mana']) || !int(d.resourceCost.actionPoints, 0, 20) || !int(d.resourceCost.mana, 0, 10000) ||
      !d.effect || typeof d.effect !== 'object') return no('INVALID_DEFINITION');
  if (d.targeting.maxTargets > MAX_AREA_TARGETS) return no('AREA_TARGET_CAPACITY_EXCEEDED');
  // M4B authority boundary: a typed class payment is permitted ONLY on a catalogue-backed definition
  // pinned in catalogueAbilityProfiles.json. An arbitrary Wizard-authored area definition cannot grant itself classPayment.
  if (d.classPayment !== undefined && (d.catalogueSource === undefined || !validClassPayment(d.classPayment, d.binding.classId))) return no('UNSUPPORTED_SHAPE');
  if (d.catalogueSource !== undefined) {
    if (!validCatalogueSource(d.catalogueSource, d.binding.classId)) return no('UNSUPPORTED_SHAPE');
    if (verifyCatalogue) {
      const verified = catalogueAbility.verifyDefinition(d);
      if (!verified.ok) return no('CATALOGUE_PROVENANCE_UNTRUSTED');
    }
  }
  if (verifyRollPolicy && !isAreaRollProcedureApproved()) return no('AREA_ROLL_PROCEDURE_UNAPPROVED');
  const validEffectShape = d.effect.kind === 'healing'
    ? exact(d.effect, ['kind', 'formula'])
    : d.effect.kind === 'damage' && exact(d.effect, ['kind', 'formula', 'damageTypes']) && Array.isArray(d.effect.damageTypes) &&
      d.effect.damageTypes.length >= 1 && d.effect.damageTypes.length <= 8 && d.effect.damageTypes.every(t => DAMAGE_TYPES.includes(t));
  if (!validEffectShape || typeof d.effect.formula !== 'string') return no('INVALID_DEFINITION');
  const reading = readScaledFormula(d.effect.formula, Object.fromEntries(CLASS_ATTRIBUTES.map(name => [name, 10])));
  if (!reading.supported) return no('UNSUPPORTED_SHAPE');
  const canonicalDefinition = canonical.value;
  const definitionHash = checkpoint.sha256Hex('mythrill:authored-area:v1\n' + checkpoint.stableStringify(canonicalDefinition));
  const definitionRef = { roomId: d.scope.roomId, definitionId: d.definitionId, definitionVersion: d.definitionVersion, definitionHash };
  const descriptor = { schemaVersion: 5, capabilityId: AREA_CAPABILITY, compilerVersion: AREA_COMPILER,
    definitionRef, binding: clone(d.binding), price: { ap: d.resourceCost.actionPoints, mana: d.resourceCost.mana },
    targeting: clone(d.targeting),
    effect: Object.assign({}, clone(d.effect), { dice: reading.dice, attributes: require('../shared/services/classEffect').formulaAttributes(d.effect.formula) }),
    executionEnabled: false };
  if (d.classPayment !== undefined) descriptor.classPayment = clone(d.classPayment);
  if (d.catalogueSource !== undefined) descriptor.catalogueSource = clone(d.catalogueSource);
  return { ok: true, canonicalDefinition, definitionHash, descriptor };
}
function compileDefinition(d, options) {
  try { d = snapshot(d); } catch (_) { return no('INVALID_DEFINITION'); }
  if (d?.capability === AREA_CAPABILITY) return compileArea(d, options);
  if ([FORMULA_CAPABILITY, HEALTH_CAPABILITY, DETERMINISTIC_CAPABILITY].includes(d?.capability)) return compileFormula(d, options);
  if (d?.capability === EFFECT_CAPABILITY) return compileEffect(d, options);
  if (d?.capability !== CONDITION_CAPABILITY) return legacy.compileDefinition(d);
  const canonical = checkpoint.canonicalize(d, 'definition');
  if (canonical.error || Buffer.byteLength(JSON.stringify(d)) > 16384 || !equal(d, canonical.value)) return no('INVALID_DEFINITION');
  if (!exact(d, ['schemaVersion', 'capability', 'scope', 'definitionId', 'definitionVersion', 'name', 'description', 'binding', 'spellType', 'castTimeType', 'targeting', 'resourceCost', 'effect', 'timing']) ||
      d.schemaVersion !== 2 || !exact(d.scope, ['roomId']) || !text(d.scope.roomId, 200) || !uuid(d.definitionId) || !int(d.definitionVersion, 1, 1000000) ||
      !text(d.name, 120) || typeof d.description !== 'string' || d.description.length > 4000 ||
      !equal(d.binding, { rulesetId: 'prism', rulesetVersion: 'cr-a1a-pilot-1', classId: 'arcanoneer' }) || d.spellType !== 'ACTION' || d.castTimeType !== 'IMMEDIATE' ||
      !exact(d.targeting, ['kind', 'maxTargets', 'rangeFeet', 'restriction']) || d.targeting.kind !== 'single' || d.targeting.maxTargets !== 1 || !int(d.targeting.rangeFeet, 1, 300) || !['any', 'ally', 'enemy'].includes(d.targeting.restriction) ||
      !exact(d.resourceCost, ['actionPoints', 'mana']) || !int(d.resourceCost.actionPoints, 0, 20) || !int(d.resourceCost.mana, 0, 10000) || !equal(d.effect, { kind: 'condition', conditionKey: 'stunned' }) ||
      !exact(d.timing, ['expiryPolicy', 'durationText', 'authoredDuration', 'gmNote']) || d.timing.expiryPolicy !== 'gm-manual' || !text(d.timing.durationText, 300) || !text(d.timing.gmNote, 1000)) return no('INVALID_DEFINITION');
  const canonicalDefinition = canonical.value;
  const definitionHash = checkpoint.sha256Hex('mythrill:authored-condition:v1\n' + checkpoint.stableStringify(canonicalDefinition));
  const definitionRef = { roomId: d.scope.roomId, definitionId: d.definitionId, definitionVersion: d.definitionVersion, definitionHash };
  return { ok: true, canonicalDefinition, definitionHash, descriptor: { schemaVersion: 2, capabilityId: CONDITION_CAPABILITY, compilerVersion: VERSION,
    definitionRef, binding: clone(d.binding), price: { ap: d.resourceCost.actionPoints, mana: d.resourceCost.mana }, targeting: clone(d.targeting), effect: clone(d.effect), timing: clone(d.timing), executionEnabled: false } };
}
function validateRegistrySnapshot(r) {
  try { r = snapshot(r); } catch (_) { return no(); }
  if (r?.schemaVersion !== 2) return legacy.decodeRegistry(JSON.stringify(r));
  if (!exact(r, ['schemaVersion', 'roomId', 'revision', 'definitions', 'decisions']) || !text(r.roomId, 200) || !Array.isArray(r.definitions) || !Array.isArray(r.decisions) || r.revision !== r.decisions.length) return no();
  if (r.definitions.length > 128 || r.decisions.length > 256 || Buffer.byteLength(JSON.stringify(r)) > 262144) return no('CAPACITY');
  const entries = new Map(), requests = new Set(), admitted = new Set(), revoked = new Set(), versions = new Map();
  for (const e of r.definitions) {
    if (!exact(e, ['definitionRef', 'canonicalDefinition', 'compilerVersion', 'descriptor'])) return no();
    const c = compileDefinition(e.canonicalDefinition, { verifyCatalogue: false, verifyRollPolicy: false }), ref = c.descriptor?.definitionRef;
    if (!c.ok || ref.roomId !== r.roomId || !equal(e.definitionRef, ref) || e.compilerVersion !== c.descriptor.compilerVersion || !equal(e.descriptor, c.descriptor)) return no();
    const key = `${ref.definitionId}:${ref.definitionVersion}`;
    if (entries.has(key)) return no();
    entries.set(key, e);
  }
  for (let i = 0; i < r.decisions.length; i++) {
    const d = r.decisions[i], key = `${d.definitionRef?.definitionId}:${d.definitionRef?.definitionVersion}`, e = entries.get(key);
    if (!exact(d, ['requestId', 'requestHash', 'byUid', 'sequence', 'action', 'definitionRef']) || !uuid(d.requestId) || requests.has(d.requestId) || !text(d.byUid, 200) || d.sequence !== i + 1 || !e || !equal(e.definitionRef, d.definitionRef)) return no();
    const request = { roomId: r.roomId, requestId: d.requestId, expectedRegistryRevision: i };
    if (d.action === 'admit') {
      if (admitted.has(key) || e.definitionRef.definitionVersion !== (versions.get(e.definitionRef.definitionId) || 1)) return no();
      versions.set(e.definitionRef.definitionId, e.definitionRef.definitionVersion + 1); admitted.add(key);
      Object.assign(request, { definition: e.canonicalDefinition, expectedDefinitionHash: e.definitionRef.definitionHash });
    } else if (d.action === 'revoke' && admitted.has(key) && !revoked.has(key)) { revoked.add(key); request.definitionRef = e.definitionRef; }
    else return no();
    if (hash(request) !== d.requestHash) return no();
    requests.add(d.requestId);
  }
  if (admitted.size !== entries.size) return no();
  return { ok: true, registry: clone(r) };
}
function decodeRegistry(json) { try { return validateRegistrySnapshot(JSON.parse(json)); } catch (_) { return no(); } }
function createDefinitionRegistry({ authorize }) {
  async function plan(operation, input, request) {
    try { input = snapshot(input); request = snapshot(request); } catch (_) { return no('INVALID_DEFINITION'); }
    if (input.schemaVersion !== 2 && ![CONDITION_CAPABILITY, EFFECT_CAPABILITY, FORMULA_CAPABILITY, HEALTH_CAPABILITY, DETERMINISTIC_CAPABILITY, AREA_CAPABILITY].includes(request.definition?.capability)) return legacy.createDefinitionRegistry({ authorize })[operation === 'admit' ? 'planAdmit' : 'planRevoke'](input, request);
    const valid = validateRegistrySnapshot(input);
    if (!valid.ok) return valid;
    const r = clone(valid.registry);
    if (!exact(request, operation === 'admit' ? ['roomId', 'requestId', 'expectedRegistryRevision', 'definition', 'expectedDefinitionHash'] : ['roomId', 'requestId', 'expectedRegistryRevision', 'definitionRef']) || !uuid(request.requestId) || !int(request.expectedRegistryRevision, 0, Number.MAX_SAFE_INTEGER)) return no('INVALID_DEFINITION');
    let a;
    try { a = await authorize({ operation, roomId: r.roomId }); } catch (_) { return no('AUTHORITY_UNAVAILABLE'); }
    if (!a?.ok || a.roomId !== r.roomId || !text(a.uid, 200) || a.uid !== a.gmUid || a.principalBound !== true || a.authorityCurrent !== true || a.rulesetId !== 'prism' || a.rulesetVersion !== 'cr-a1a-pilot-1') return no('FORBIDDEN');
    if (request.roomId !== r.roomId) return no('SCOPE_MISMATCH');
    const requestHash = hash(request), old = r.decisions.find(d => d.requestId === request.requestId);
    if (old) return old.requestHash === requestHash && old.byUid === a.uid ? { ok: true, kind: 'replay', definitionRef: old.definitionRef } : no('REQUEST_ID_CONFLICT');
    if (request.expectedRegistryRevision !== r.revision) return no('REVISION_CONFLICT');
    let definitionRef;
    if (operation === 'admit') {
      const c = compileDefinition(request.definition);
      if (!c.ok) return c;
      definitionRef = c.descriptor.definitionRef;
      if (definitionRef.roomId !== r.roomId || c.definitionHash !== request.expectedDefinitionHash) return no('HASH_MISMATCH');
      const version = 1 + Math.max(0, ...r.definitions.filter(e => e.definitionRef.definitionId === definitionRef.definitionId).map(e => e.definitionRef.definitionVersion));
      if (version !== definitionRef.definitionVersion) return no('VERSION_CONFLICT');
      r.definitions.push({ definitionRef, canonicalDefinition: c.canonicalDefinition, compilerVersion: c.descriptor.compilerVersion, descriptor: c.descriptor });
    } else {
      const e = r.definitions.find(e => equal(e.definitionRef, request.definitionRef));
      if (!e) return no('DEFINITION_NOT_FOUND');
      definitionRef = e.definitionRef;
      if (r.decisions.some(d => d.action === 'revoke' && equal(d.definitionRef, definitionRef))) return no('DEFINITION_REVOKED');
    }
    r.schemaVersion = 2; r.revision++;
    r.decisions.push({ requestId: request.requestId, requestHash, byUid: a.uid, sequence: r.revision, action: operation, definitionRef });
    const checked = validateRegistrySnapshot(r);
    return checked.ok ? { ok: true, kind: 'transition', nextRegistry: checked.registry, definitionRef } : checked;
  }
  return { planAdmit: (r, q) => plan('admit', r, q), planRevoke: (r, q) => plan('revoke', r, q) };
}
module.exports = { ...legacy, compileDefinition, validateRegistrySnapshot, decodeRegistry, encodeRegistry: r => { const v = validateRegistrySnapshot(r); return v.ok ? { ok: true, json: checkpoint.stableStringify(v.registry) } : v; }, createDefinitionRegistry };
