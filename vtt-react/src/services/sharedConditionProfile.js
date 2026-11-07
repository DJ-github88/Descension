/** Closed P14-C1 profile shared by Node/client. No evaluator, clock or action/payment rule. */
const data = require('../data/sharedConditionProfiles.json');
const DEFENDING = Object.freeze(data.defending);
const STUNNED = Object.freeze(data.stunned);
const MOVEMENT = Object.freeze(data.movementModifier);
// Shared attribute-modifier family: one flat change to one supported attribute score, authored only.
const ATTRIBUTE = Object.freeze(Object.assign({}, data.attributeModifier, { attributes: Object.freeze([...data.attributeModifier.attributes]) }));
const ATTRIBUTE_NAMES = Object.freeze({ strength: 'Strength', agility: 'Agility', constitution: 'Constitution', intelligence: 'Intelligence', spirit: 'Spirit', charisma: 'Charisma' });
const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const REF_KEYS = ['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'];
const sameRef = (a, b) => !!a && !!b && REF_KEYS.every(k => a[k] === b[k]);
const canonical = value => JSON.stringify(value, (key, child) => child && typeof child === 'object' && !Array.isArray(child)
  ? Object.fromEntries(Object.keys(child).sort().map(k => [k, child[k]])) : child);
const isDefending = r => r?.version === 1 && r.conditionKey === DEFENDING.conditionKey;
const recordsFor = token => (Array.isArray(token?.state?.conditions) ? token.state.conditions : []).filter(isDefending);
const holdsDefending = token => recordsFor(token).length > 0;
const blockingReduction = (face, defending) => face * (defending ? DEFENDING.blockingMultiplier : 1);
const preventsBlockingWear = defending => !!defending && DEFENDING.preventsBlockingWear;
const expiryLabel = (record, combat) => require('./sharedEffectTiming').label(record, combat) || (structuredBoundary(record)
  // A10: a structured instance without a live schedule (combat ended/retired clock) is manual from then on.
  ? `${record.authoredDuration} — not tracked by the current turn clock; ${isPeriodicTick(record) ? 'no further ticks are recorded automatically; ' : ''}GM removes this exact instance.` : isStunned(record) || isMovementModifier(record) || isAttributeModifier(record) ? record.effectSummary : isDefending(record) && record.target?.kind === 'character' ? DEFENDING.expiryLabel :
  record?.sharedTiming === 'manual' ? 'GM manages timing.' : null);
function makeDefendingRecord(target, id, sourceMode = 'manual') {
  if (target?.kind !== 'character' || !REF_KEYS.every(k => typeof target[k] === 'string' && target[k]) || !uuid(id) || !['manual', 'self-defend'].includes(sourceMode)) throw Error('Exact primary PC, UUID instance and source mode required.');
  // Keep this Node/client module free of object-spread Babel helper imports (CRA otherwise marks CommonJS as ESM).
  return Object.assign({
    version: 1, id, recordId: id, conditionKey: DEFENDING.conditionKey, originalName: DEFENDING.name, name: DEFENDING.name,
    type: 'buff', kind: 'effect', target: JSON.parse(JSON.stringify(target)), targetId: target.tokenId, targetType: 'character',
    source: sourceMode === 'self-defend' ? 'manual-result:universal_defend' : 'manual',
    effectOrigin: DEFENDING.origin, description: DEFENDING.description, effectSummary: DEFENDING.expiryLabel,
    icon: DEFENDING.icon, color: DEFENDING.color, effects: {}, isMagical: false, stackable: false, hasOverTimeEffect: false,
    sharedTiming: 'manual', durationType: 'manual', clockBoundary: DEFENDING.clockBoundary
  }, sourceMode === 'self-defend' ? { sourceActor: JSON.parse(JSON.stringify(target)), sourceEntityId: target.tokenId } : {});
}
function validManagedRecord(record, target) {
  if (record?.effectOrigin === PERIODIC.origin) {
    try { return canonical(record) === canonical(makePeriodicRecord(target, record.recordId, {
      sourceOccurrence: record.sourceEntityId, timing: record.clockBoundary, sourceActor: record.sourceActor, authoredDuration: record.authoredDuration,
      occurrences: record.clockOccurrences, label: record.name, effectDefinition: record.effectDefinition,
      tick: Object.assign({ kind: record.overTimeType, formula: record.overTimeFormula }, record.overTimeType === 'damage' ? { damageType: record.overTimeElement } : {}) })); } catch (_) { return false; }
  }
  if (record?.effectOrigin === ATTRIBUTE.origin) {
    const entries = record.effects && typeof record.effects === 'object' && !Array.isArray(record.effects) ? Object.entries(record.effects) : [];
    if (entries.length !== 1) return false;
    try { return canonical(record) === canonical(makeAttributeRecord(target, record.recordId, {
      sourceOccurrence: record.sourceEntityId, timing: record.clockBoundary, sourceActor: record.sourceActor, authoredDuration: record.authoredDuration,
      occurrences: record.clockOccurrences, attribute: entries[0][0], amount: entries[0][1], label: record.name, effectDefinition: record.effectDefinition })); } catch (_) { return false; }
  }
  if (record?.effectOrigin === MOVEMENT.origin) {
    try { return canonical(record) === canonical(makeMovementRecord(target, record.recordId, {
      sourceOccurrence: record.sourceEntityId, timing: record.clockBoundary, sourceActor: record.sourceActor, authoredDuration: record.authoredDuration,
      occurrences: record.clockOccurrences, feet: record.effects?.movementSpeed, label: record.name, effectDefinition: record.effectDefinition })); } catch (_) { return false; }
  }
  if (record?.effectOrigin === STUNNED.origin) {
    try { return canonical(record) === canonical(makeStunnedRecord(target, record.recordId, {
      sourceOccurrence: record.sourceEntityId, timing: record.clockBoundary, sourceActor: record.sourceActor, authoredDuration: record.authoredDuration,
      occurrences: record.clockOccurrences
    })); } catch (_) { return false; }
  }
  if (!record || !uuid(record.recordId) || record.effectOrigin !== DEFENDING.origin || record.target?.kind !== 'character' || !sameRef(record.target, target) || !REF_KEYS.every(k => typeof target[k] === 'string' && target[k])) return false;
  const expected = makeDefendingRecord(target, record.recordId, record.source === 'manual-result:universal_defend' ? 'self-defend' : 'manual');
  return canonical(record) === canonical(expected);
}
const validRef = ref => !!ref && ['creature', 'character'].includes(ref.kind) &&
  (ref.kind === 'character' ? REF_KEYS : REF_KEYS.slice(0, 5)).every(k => typeof ref[k] === 'string' && ref[k]) &&
  Object.keys(ref).every(k => (ref.kind === 'character' ? REF_KEYS : REF_KEYS.slice(0, 5)).includes(k));
// A10: authored-effect occurrences may carry one structured C4 boundary; A7 occurrences stay manual.
const EFFECT_PREFIX = 'authored-effect:';
const STRUCTURED_TIMINGS = ['authored-target-next-start', 'authored-target-next-end', 'authored-target-start-count', 'authored-target-end-count'];
// M2A: explicit counted target-turn boundaries. The first occurrence is the existing strictly-next boundary; a count of N
// ends the effect at the Nth. The count is 2…MAX (a count of 1 is the existing next-turn timing). A "round" is never inferred.
const COUNTED_TIMINGS = ['authored-target-start-count', 'authored-target-end-count'];
const MAX_OCCURRENCES = 10;
const isCountedTiming = timing => COUNTED_TIMINGS.includes(timing);
const validOccurrences = n => Number.isSafeInteger(n) && n >= 2 && n <= MAX_OCCURRENCES;
const ordinal = n => `${n}${[11, 12, 13].includes(n % 100) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' })[n % 10] || 'th'}`;
/** Explicit author/GM wording for a counted boundary: no "round", and the counting rule is stated. */
const occurrenceText = (boundary, n) => `${boundary === 'start' ? 'start' : 'end'} of the target's ${ordinal(n)} upcoming turn (its next turn counts as the 1st${boundary === 'end' ? '; a turn already in progress is not counted' : ''})`;
const authoredSummary = (duration, timing, occurrences) => `${duration} — ${timing === 'manual' ? 'GM removes.' : isCountedTiming(timing)
  ? `expires at the ${occurrenceText(timing === 'authored-target-start-count' ? 'start' : 'end', occurrences)}, at the authenticated turn boundary.` : STUNNED.timings[timing]}`;
// M1: class-effect:v1 occurrences (one class-paid composed effect) are GM-managed only: verbatim authored duration.
const CLASS_EFFECT_PREFIX = 'class-effect:';
function checkAuthoredOccurrence(sourceOccurrence, timing, authoredDuration, occurrences) {
  if (occurrences !== undefined && (!isCountedTiming(timing) || !validOccurrences(occurrences)) || occurrences === undefined && isCountedTiming(timing))
    throw Error(`A counted boundary needs a whole number of occurrences from 2 to ${MAX_OCCURRENCES}; no other timing carries a count.`);
  if (sourceOccurrence.startsWith(CLASS_EFFECT_PREFIX)) {
    if (!uuid(sourceOccurrence.slice(CLASS_EFFECT_PREFIX.length)) || timing !== 'manual' || typeof authoredDuration !== 'string' || !authoredDuration.trim() ||
        authoredDuration.length > 700) throw Error('Class effect occurrence requires GM-managed timing and its authored duration.');
    return true;
  }
  const a7 = sourceOccurrence.startsWith('authored-condition:'), a10 = sourceOccurrence.startsWith(EFFECT_PREFIX);
  if (!a7 && !a10) {
    if (authoredDuration !== undefined || STRUCTURED_TIMINGS.includes(timing)) throw Error('Structured authored timing requires an authored-effect occurrence.');
    return false;
  }
  const id = sourceOccurrence.slice(a7 ? 'authored-condition:'.length : EFFECT_PREFIX.length);
  if (!uuid(id) || (a7 ? timing !== 'manual' : !['manual', ...STRUCTURED_TIMINGS].includes(timing)) ||
      typeof authoredDuration !== 'string' || !authoredDuration.trim() || authoredDuration.length > 700) throw Error('Authored occurrence requires a supported timing and duration.');
  return true;
}
function makeStunnedRecord(target, id, { sourceOccurrence, timing = 'manual', sourceActor, authoredDuration, occurrences } = {}) {
  if (!validRef(target) || !uuid(id) || typeof sourceOccurrence !== 'string' || !sourceOccurrence.trim() ||
      sourceOccurrence !== sourceOccurrence.trim() || sourceOccurrence.length > 160 || !Object.prototype.hasOwnProperty.call(STUNNED.timings, timing) ||
      (sourceActor && (!validRef(sourceActor) || sourceActor.roomId !== target.roomId))) throw Error('Exact actor, UUID, source occurrence and known timing required.');
  // Public PC-target views omit sourceActor; the authored binder still requires the exact full record.
  if (sourceOccurrence.startsWith(CLASS_EFFECT_PREFIX)) throw Error('Class effect occurrences are movement riders only.');
  const authored = checkAuthoredOccurrence(sourceOccurrence, timing, authoredDuration, occurrences);
  return Object.assign({ version: 1, id, recordId: id, conditionKey: 'stunned', originalName: STUNNED.name, name: STUNNED.name,
    type: STUNNED.type, kind: 'effect', target: JSON.parse(JSON.stringify(target)), targetId: target.tokenId, targetType: target.kind,
    source: 'manual-resolved:stunned', sourceEntityId: sourceOccurrence, effectOrigin: STUNNED.origin, description: STUNNED.description,
    effectSummary: authored ? authoredSummary(authoredDuration, timing, occurrences) : STUNNED.timings[timing], icon: STUNNED.icon, color: STUNNED.color, effects: {}, isMagical: false,
    stackable: true, hasOverTimeEffect: false, sharedTiming: 'manual', durationType: 'manual', clockBoundary: timing
  }, sourceActor ? { sourceActor: JSON.parse(JSON.stringify(sourceActor)) } : {}, authored ? { authoredDuration } : {}, occurrences !== undefined ? { clockOccurrences: occurrences } : {});
}
/** A10 closed numeric family: one flat movement-speed change (feet per movement AP), authored only.
 * A11: new instances also carry `effectDefinition`, the exact installed authored action id
 * (`authored:<definition UUID>:<version>:<hash>`), the stable identity used for combination. Records
 * accepted before A11 have none; they stay valid, removable and expirable, but never combine. */
const EFFECT_DEFINITION = /^authored:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}):([1-9][0-9]{0,8}):([0-9a-f]{64})$/i;
// M1: `class:<classId>:<spellId>:<record hash>`; the class and spell ids are the stable identity, the hash its version.
const CLASS_EFFECT_DEFINITION = /^class:([a-z][a-z0-9_]{0,63}):([a-z][a-z0-9_]{0,95}):([0-9a-f]{64})$/;
function makeMovementRecord(target, id, { sourceOccurrence, timing = 'manual', sourceActor, authoredDuration, feet, label, effectDefinition, occurrences } = {}) {
  if (!validRef(target) || !uuid(id) || typeof sourceOccurrence !== 'string' || !(sourceOccurrence.startsWith(EFFECT_PREFIX) || sourceOccurrence.startsWith(CLASS_EFFECT_PREFIX)) || sourceOccurrence.length > 160 ||
      (sourceActor && (!validRef(sourceActor) || sourceActor.roomId !== target.roomId)) || !validMovementFeet(feet) ||
      (effectDefinition !== undefined && (typeof effectDefinition !== 'string' || !sourceActor ||
        !(sourceOccurrence.startsWith(CLASS_EFFECT_PREFIX) ? CLASS_EFFECT_DEFINITION : EFFECT_DEFINITION).test(effectDefinition))) ||
      (sourceOccurrence.startsWith(CLASS_EFFECT_PREFIX) && effectDefinition === undefined) ||
      typeof label !== 'string' || !label.trim() || label !== label.trim() || label.length > 60) throw Error('Exact actor, UUID, authored occurrence, label and supported feet required.');
  checkAuthoredOccurrence(sourceOccurrence, timing, authoredDuration, occurrences);
  const signed = `${feet > 0 ? '+' : '−'}${Math.abs(feet)} ft`;
  return Object.assign({ version: 1, id, recordId: id, conditionKey: MOVEMENT.conditionKey, originalName: label, name: label,
    type: feet > 0 ? 'buff' : 'debuff', kind: 'effect', target: JSON.parse(JSON.stringify(target)), targetId: target.tokenId, targetType: target.kind,
    source: sourceOccurrence.startsWith(CLASS_EFFECT_PREFIX) ? 'class-effect:movement' : 'authored-effect:movement', sourceEntityId: sourceOccurrence, effectOrigin: MOVEMENT.origin,
    description: `Movement speed ${signed}. ${MOVEMENT.description}`, effectSummary: authoredSummary(authoredDuration, timing, occurrences),
    icon: feet > 0 ? MOVEMENT.buffIcon : MOVEMENT.debuffIcon, color: feet > 0 ? MOVEMENT.buffColor : MOVEMENT.debuffColor,
    effects: { movementSpeed: feet }, isMagical: false, stackable: false, hasOverTimeEffect: false, sharedTiming: 'manual', durationType: 'manual', clockBoundary: timing
  }, sourceActor ? { sourceActor: JSON.parse(JSON.stringify(sourceActor)) } : {}, { authoredDuration }, effectDefinition !== undefined ? { effectDefinition } : {}, occurrences !== undefined ? { clockOccurrences: occurrences } : {});
}
/**
 * A11 readable breakdown of the authored movement step: `speedBefore` is the speed after the existing
 * condition multipliers; each accepted authored change adds its feet; the result never goes below 0 ft.
 */
function movementBreakdown(speedBefore, conditions) {
  const effects = (Array.isArray(conditions) ? conditions : []).filter(isMovementModifier)
    .map(record => ({ recordId: record.recordId, name: record.name, feet: record.effects.movementSpeed, record }));
  const total = effects.reduce((sum, effect) => sum + effect.feet, 0), raw = speedBefore + total;
  return { before: speedBefore, effects, total, result: Math.max(0, Math.floor(raw)), clamped: raw < 0 };
}
/** Stable effect identity (the authored definition UUID, independent of version), or null for pre-A11 records. */
function movementEffectKey(record) {
  const classMatch = CLASS_EFFECT_DEFINITION.exec(record?.effectDefinition || '');
  if (classMatch) return `class:${classMatch[1]}:${classMatch[2]}`;
  const match = EFFECT_DEFINITION.exec(record?.effectDefinition || '');
  return match ? match[1].toLowerCase() : null;
}
const sameDisplayName = (a, b) => String(a || '').trim().toLocaleLowerCase() === String(b || '').trim().toLocaleLowerCase();
const refuseCombination = (code, message) => ({ ok: false, code, message });
/**
 * A11 recorded policy (HQ 2026-10-28) for one new authored movement change against a target's current
 * conditions: different named effects stack additively; the same effect (same authored definition UUID)
 * from the same exact source refreshes — the existing instance is replaced, value not stacked; the
 * result never goes below 0 ft (the consumer clamps). Combinations the policy does not define are refused
 * explicitly and left to the GM, never guessed. Pure; shared by the client planner, binder and P7 stage.
 */
function movementCombination(conditions, record) {
  if (record?.effectOrigin !== MOVEMENT.origin || !isMovementModifier(record) || !movementEffectKey(record))
    return refuseCombination('modifier_identity_required', 'This movement change has no stable effect identity, so it cannot be combined. Nothing was applied.');
  const key = movementEffectKey(record), active = (Array.isArray(conditions) ? conditions : []).filter(isMovementModifier);
  let replaces = null;
  for (const existing of active) {
    if (existing.recordId === record.recordId) return refuseCombination('condition_id_conflict', 'This exact instance is already active.');
    const existingKey = movementEffectKey(existing);
    if (!existingKey) return refuseCombination('modifier_combination_unresolved', `${existing.name} was applied before movement effects carried a stable identity, so how it combines is not decided. The GM removes it (or resolves this manually); nothing was applied.`);
    if (existingKey === key) {
      if (!sameRef(existing.sourceActor, record.sourceActor)) return refuseCombination('modifier_combination_unresolved', `${existing.name} is already active from a different source. The recorded policy does not decide how the same effect from two sources combines; the GM resolves it manually. Nothing was applied.`);
      if (existing.effectDefinition !== record.effectDefinition || existing.effects.movementSpeed !== record.effects.movementSpeed || existing.name !== record.name ||
          existing.clockBoundary !== record.clockBoundary || existing.clockOccurrences !== record.clockOccurrences || existing.authoredDuration !== record.authoredDuration)
        return refuseCombination('modifier_combination_unresolved', `${existing.name} is active from this source with different authored terms (a changed definition version). The recorded policy does not decide a refresh that changes the value or timing; the GM resolves it manually. Nothing was applied.`);
      if (replaces) return refuseCombination('modifier_combination_unresolved', `More than one ${existing.name} instance from this source is active; the GM resolves them manually. Nothing was applied.`);
      replaces = existing.recordId;
    } else if (sameDisplayName(existing.name, record.name)) {
      return refuseCombination('modifier_combination_unresolved', `A different effect named ${existing.name} is already active. Whether same-named effects are the same effect is not decided; the GM resolves it manually. Nothing was applied.`);
    }
  }
  if (!replaces && active.length >= MOVEMENT.maxActivePerTarget) return refuseCombination('movement_modifier_capacity', `This target already has ${active.length} authored movement changes (the supported maximum). The GM removes one first; nothing was applied.`);
  return { ok: true, outcome: replaces ? 'refreshed' : 'added', replaces };
}
/**
 * Attribute-modifier family: one flat signed change to ONE supported attribute score (profile `attributes`),
 * from one Wizard-authored, installed authored-effect definition. The authoritative record carries the exact installed
 * action id (`effectDefinition`) and its source actor (the P7 stage requires both on install); a PC target's public view
 * withholds both together, and that public form stays a valid record so every client reads the same value.
 * It never rewrites base, earned, heritage or origin attributes: consumers add `effects[attribute]` once on top.
 */
const supportedAttribute = attribute => typeof attribute === 'string' && ATTRIBUTE.attributes.includes(attribute);
const validAttributeAmount = amount => Number.isSafeInteger(amount) && amount !== 0 && amount >= ATTRIBUTE.minAmount && amount <= ATTRIBUTE.maxAmount;
const attributeName = attribute => ATTRIBUTE_NAMES[attribute] || String(attribute || '');
const signedAmount = amount => `${amount > 0 ? '+' : '−'}${Math.abs(amount)}`;
function makeAttributeRecord(target, id, { sourceOccurrence, timing = 'manual', sourceActor, authoredDuration, attribute, amount, label, effectDefinition, occurrences } = {}) {
  if (!validRef(target) || !uuid(id) || typeof sourceOccurrence !== 'string' || !sourceOccurrence.startsWith(EFFECT_PREFIX) || sourceOccurrence.length > 160 ||
      // Source and definition identity travel together: both on the authoritative record, both withheld on a PC target's public view.
      (sourceActor === undefined) !== (effectDefinition === undefined) ||
      (sourceActor !== undefined && (!validRef(sourceActor) || sourceActor.roomId !== target.roomId || typeof effectDefinition !== 'string' || !EFFECT_DEFINITION.test(effectDefinition))) ||
      !supportedAttribute(attribute) || !validAttributeAmount(amount) ||
      typeof label !== 'string' || !label.trim() || label !== label.trim() || label.length > 60) throw Error('Exact actor and source, UUID, authored occurrence and definition, label, supported attribute and amount required.');
  checkAuthoredOccurrence(sourceOccurrence, timing, authoredDuration, occurrences);
  return Object.assign({ version: 1, id, recordId: id, conditionKey: ATTRIBUTE.conditionKey, originalName: label, name: label,
    type: amount > 0 ? 'buff' : 'debuff', kind: 'effect', target: JSON.parse(JSON.stringify(target)), targetId: target.tokenId, targetType: target.kind,
    source: 'authored-effect:attribute', sourceEntityId: sourceOccurrence, effectOrigin: ATTRIBUTE.origin,
    description: `${attributeName(attribute)} ${signedAmount(amount)}. ${ATTRIBUTE.description}`, effectSummary: authoredSummary(authoredDuration, timing, occurrences),
    icon: amount > 0 ? ATTRIBUTE.buffIcon : ATTRIBUTE.debuffIcon, color: amount > 0 ? ATTRIBUTE.buffColor : ATTRIBUTE.debuffColor,
    effects: { [attribute]: amount }, isMagical: false, stackable: false, hasOverTimeEffect: false, sharedTiming: 'manual', durationType: 'manual', clockBoundary: timing,
    authoredDuration
  }, sourceActor !== undefined ? { sourceActor: JSON.parse(JSON.stringify(sourceActor)), effectDefinition } : {}, occurrences !== undefined ? { clockOccurrences: occurrences } : {});
}
function isAttributeModifier(record) { return record?.effectOrigin === ATTRIBUTE.origin && validManagedRecord(record, record.target); }
/** { attribute, amount } of a validated attribute-modifier record, or null. */
function attributeModifierOf(record) {
  if (!isAttributeModifier(record)) return null;
  const [attribute, amount] = Object.entries(record.effects)[0];
  return { attribute, amount };
}
const attributeRecordsFor = token => (Array.isArray(token?.state?.conditions) ? token.state.conditions : []).filter(r =>
  isAttributeModifier(r) && sameRef(r.target, token.state?.actorContract));
/**
 * The one shared calculation of the authored step for one attribute: `before` is the score from the existing sheet
 * composition (base/earned + heritage + origin + equipment); each validated authored modifier on that attribute adds
 * its amount exactly once. No clamp or rounding rule is invented: a result below 0 is reported (`negative`) and the
 * consumers that need a 0+ score keep the action manual.
 */
function attributeBreakdown(before, conditions, attribute) {
  const effects = (Array.isArray(conditions) ? conditions : []).map(record => ({ record, value: attributeModifierOf(record) }))
    .filter(entry => entry.value && entry.value.attribute === attribute)
    .map(({ record, value }) => ({ recordId: record.recordId, name: record.name, amount: value.amount, record }));
  const total = effects.reduce((sum, effect) => sum + effect.amount, 0);
  const result = Number.isFinite(before) ? before + total : null;
  return { attribute, before: Number.isFinite(before) ? before : null, effects, total, result, negative: result !== null && result < 0 };
}
/** Per-attribute totals of validated authored modifiers on these records: { agility: -2, ... } (only non-zero keys). */
function attributeModifierTotals(conditions) {
  const totals = {};
  for (const record of Array.isArray(conditions) ? conditions : []) {
    const value = attributeModifierOf(record);
    if (value) totals[value.attribute] = (totals[value.attribute] || 0) + value.amount;
  }
  return totals;
}
/** Records other than validated authored attribute modifiers that also change this attribute (manual/legacy buffs). */
const otherAttributeRecords = (conditions, attribute) => (Array.isArray(conditions) ? conditions : []).filter(record =>
  !isAttributeModifier(record) && record?.effects && typeof record.effects === 'object' && typeof record.effects[attribute] === 'number' && record.effects[attribute] !== 0);
/**
 * Combination for one new authored attribute modifier against a target's current records. No attribute stacking rule
 * is approved (decision D-ATTR-1 is open; A11's movement rule is movement-only): a target may hold ONE change to a
 * given attribute. A second change to the same attribute — any source, same or different effect, authored or a
 * manual record — is refused whole for the GM to resolve. Different attributes never interact. Pure; shared by the
 * client planner, the binder and the P7 stage.
 */
function attributeCombination(conditions, record) {
  const value = attributeModifierOf(record);
  if (!value) return refuseCombination('modifier_identity_required', 'This attribute change is not a validated authored modifier. Nothing was applied.');
  const list = Array.isArray(conditions) ? conditions : [];
  if (list.some(existing => (existing?.recordId || existing?.id) === record.recordId)) return refuseCombination('condition_id_conflict', 'This exact instance is already active.');
  const same = list.find(existing => attributeModifierOf(existing)?.attribute === value.attribute) || otherAttributeRecords(list, value.attribute)[0];
  if (same) return refuseCombination('attribute_combination_unresolved', `${same.name || 'Another effect'} already changes ${attributeName(value.attribute)} on this target. How two changes to the same attribute combine (adding, highest only or refreshing) is not decided; the GM resolves it manually. Nothing was applied.`);
  return { ok: true, outcome: 'added', replaces: null };
}
function validMovementFeet(feet) {
  return Number.isSafeInteger(feet) && feet !== 0 && feet >= MOVEMENT.minFeet && feet <= MOVEMENT.maxFeet && feet % MOVEMENT.stepFeet === 0;
}
function isMovementModifier(record) { return record?.effectOrigin === MOVEMENT.origin && validManagedRecord(record, record.target); }
const movementRecordsFor = token => (Array.isArray(token?.state?.conditions) ? token.state.conditions : []).filter(r =>
  isMovementModifier(r) && sameRef(r.target, token.state?.actorContract));
/** Structured C4 boundary requested by an authored-effect record, or null for manual timing. */
const structuredBoundary = record => record && String(record.sourceEntityId || '').startsWith(EFFECT_PREFIX) && STRUCTURED_TIMINGS.includes(record.clockBoundary) &&
  (isStunned(record) || isMovementModifier(record) || isAttributeModifier(record) || isPeriodicTick(record)) ? (['authored-target-next-start', 'authored-target-start-count'].includes(record.clockBoundary) ? 'start' : 'end') : null;
/** Number of target-turn boundaries a structured record counts: 1 for the existing next-turn timings, 2…10 when counted, null otherwise. */
const structuredOccurrences = record => structuredBoundary(record) ? (isCountedTiming(record.clockBoundary) ? record.clockOccurrences : 1) : null;
function isStunned(record) { return record?.effectOrigin === STUNNED.origin && validManagedRecord(record, record.target); }
/**
 * M5 periodic ticks (first route): ONE Wizard-authored periodic damage OR healing component on ONE creature target.
 * The record is the exact paid instance. Its structured C4 schedule (the existing next-turn / M2A counted timings) names
 * the target-turn boundaries at which ticks fall: every one of those boundaries — the last included — records one due-tick
 * obligation, and the instance ends with its last authored tick. The authored tick count IS the effect's whole lifetime;
 * no separate duration is combined with it. A boundary never changes HP: the GM resolves each obligation with its own
 * retained roll and final amount (staged execution, not automatic HP). `hasOverTimeEffect` stays false so the legacy
 * client-local ticker can never run it. Catalogue "round"/"turn" fields are never read here.
 */
const PERIODIC = Object.freeze({ conditionKey: 'periodic-tick', origin: 'shared-condition:periodic-tick:v1', definitionId: 'authored-periodic-tick',
  damageIcon: '/assets/icons/Status/dot/dripping-corrosion-acid.png', healingIcon: '/assets/icons/Status/hot/heart-chain-regeneration.png',
  damageColor: '#6b4a5e', healingColor: '#3c7a4a', maxTicks: MAX_OCCURRENCES,
  damageTypes: Object.freeze(['arcane', 'sacred', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd', 'slicing', 'stabbing', 'smashing']),
  description: 'Periodic effect. At each listed boundary of the target\'s turns the authenticated turn clock records one due tick; HP changes only when the GM resolves that tick with its roll.' });
// Same NdM(±K) grammar and bounds as the A1 adapter (kept local: this module is required by the adapter).
const TICK_FORMULA = /^([1-9][0-9]?)d([1-9][0-9]{0,2})(?:([+-])([1-9][0-9]{0,4}))?$/;
function validTickFormula(formula) {
  const m = typeof formula === 'string' && TICK_FORMULA.exec(formula);
  return !!m && +m[1] <= 50 && +m[2] >= 2 && +m[2] <= 100 && +(m[4] || 0) <= 10000;
}
function validTick(tick) {
  if (!tick || typeof tick !== 'object' || Array.isArray(tick) || !validTickFormula(tick.formula)) return false;
  if (tick.kind === 'healing') return Object.keys(tick).sort().join() === 'formula,kind';
  return tick.kind === 'damage' && Object.keys(tick).sort().join() === 'damageType,formula,kind' && PERIODIC.damageTypes.includes(tick.damageType);
}
const tickCount = (timing, occurrences) => isCountedTiming(timing) ? occurrences : 1;
const tickBoundary = timing => ['authored-target-next-start', 'authored-target-start-count'].includes(timing) ? 'start' : 'end';
/** Plain wording of where the ticks fall: never "round"; the counting rule is stated. */
function tickScheduleText(timing, occurrences) {
  const n = tickCount(timing, occurrences), boundary = tickBoundary(timing);
  if (n === 1) return `one tick at the ${boundary} of the target's next turn${boundary === 'end' ? ' (a turn already in progress is not counted)' : ''}`;
  return `${n} ticks, one at the ${boundary} of each of the target's next ${n} turns (its next turn counts as the 1st${boundary === 'end' ? '; a turn already in progress is not counted' : ''})`;
}
const tickText = tick => `${tick.kind === 'damage' ? `${tick.damageType} damage` : 'healing'} ${tick.formula}`;
function makePeriodicRecord(target, id, { sourceOccurrence, timing, sourceActor, authoredDuration, occurrences, tick, label, effectDefinition } = {}) {
  if (!validRef(target) || target.kind !== 'creature' || !uuid(id) || typeof sourceOccurrence !== 'string' || !sourceOccurrence.startsWith(EFFECT_PREFIX) || sourceOccurrence.length > 160 ||
      !validRef(sourceActor) || sourceActor.roomId !== target.roomId || typeof effectDefinition !== 'string' || !EFFECT_DEFINITION.test(effectDefinition) ||
      !STRUCTURED_TIMINGS.includes(timing) || !validTick(tick) ||
      typeof label !== 'string' || !label.trim() || label !== label.trim() || label.length > 60) throw Error('Exact creature target and source, UUID, authored occurrence and definition, structured tick boundary, label and NdM tick required.');
  checkAuthoredOccurrence(sourceOccurrence, timing, authoredDuration, occurrences);
  const damage = tick.kind === 'damage';
  return Object.assign({ version: 1, id, recordId: id, conditionKey: PERIODIC.conditionKey, originalName: label, name: label,
    type: damage ? 'debuff' : 'buff', kind: 'effect', target: JSON.parse(JSON.stringify(target)), targetId: target.tokenId, targetType: target.kind,
    source: 'authored-effect:periodic', sourceEntityId: sourceOccurrence, effectOrigin: PERIODIC.origin,
    description: `${tickText(tick)} per tick. ${PERIODIC.description}`,
    effectSummary: `${authoredDuration} — ${tickScheduleText(timing, occurrences)}; each tick is recorded at the authenticated turn boundary and changes HP only when the GM resolves it. The effect ends with its last tick.`,
    icon: damage ? PERIODIC.damageIcon : PERIODIC.healingIcon, color: damage ? PERIODIC.damageColor : PERIODIC.healingColor,
    effects: {}, isMagical: false, stackable: false, hasOverTimeEffect: false, overTimeType: tick.kind, overTimeFormula: tick.formula
  }, damage ? { overTimeElement: tick.damageType } : {}, { sharedTiming: 'manual', durationType: 'manual', clockBoundary: timing, authoredDuration,
    sourceActor: JSON.parse(JSON.stringify(sourceActor)), effectDefinition }, occurrences !== undefined ? { clockOccurrences: occurrences } : {});
}
function isPeriodicTick(record) { return record?.effectOrigin === PERIODIC.origin && validManagedRecord(record, record.target); }
/** { kind, formula, damageType|null, label, ticks, boundary } of a validated periodic record, or null. */
function periodicOf(record) {
  if (!isPeriodicTick(record)) return null;
  return { kind: record.overTimeType, formula: record.overTimeFormula, damageType: record.overTimeType === 'damage' ? record.overTimeElement : null, label: record.name,
    ticks: tickCount(record.clockBoundary, record.clockOccurrences), boundary: tickBoundary(record.clockBoundary) };
}
/**
 * M5 first route: a target holds at most ONE periodic instance. Refresh, stacking and a second stream (same or another
 * source) are open creator decisions, so any second periodic instance is refused whole for the GM. Pure; shared by the
 * client planner, the binder and the P7 stage.
 */
function periodicCombination(conditions, record) {
  if (!isPeriodicTick(record)) return refuseCombination('modifier_identity_required', 'This periodic effect is not a validated authored instance. Nothing was applied.');
  const list = Array.isArray(conditions) ? conditions : [];
  if (list.some(existing => (existing?.recordId || existing?.id) === record.recordId)) return refuseCombination('condition_id_conflict', 'This exact instance is already active.');
  const active = list.find(isPeriodicTick);
  if (active) return refuseCombination('periodic_combination_unresolved', `${active.name} is already ticking on this target. Whether a second periodic effect stacks, refreshes or is refused is not decided; the GM resolves it manually. Nothing was applied or charged.`);
  return { ok: true, outcome: 'added', replaces: null };
}
const stunnedRecordsFor = token => (Array.isArray(token?.state?.conditions) ? token.state.conditions : []).filter(r =>
  isStunned(r) && sameRef(r.target, token.state?.actorContract));
const holdsStunned = token => stunnedRecordsFor(token).length > 0;
const sameStunnedSource = (a, b) => a.sourceEntityId === b.sourceEntityId && canonical(a.sourceActor || null) === canonical(b.sourceActor || null);
exports.STUNNED = STUNNED;
exports.PERIODIC = PERIODIC;
exports.makePeriodicRecord = makePeriodicRecord;
exports.isPeriodicTick = isPeriodicTick;
exports.periodicOf = periodicOf;
exports.periodicCombination = periodicCombination;
exports.validTick = validTick;
exports.validTickFormula = validTickFormula;
exports.tickScheduleText = tickScheduleText;
exports.tickText = tickText;
exports.MOVEMENT = MOVEMENT;
exports.ATTRIBUTE = ATTRIBUTE;
exports.ATTRIBUTE_NAMES = ATTRIBUTE_NAMES;
exports.makeAttributeRecord = makeAttributeRecord;
exports.isAttributeModifier = isAttributeModifier;
exports.attributeModifierOf = attributeModifierOf;
exports.attributeRecordsFor = attributeRecordsFor;
exports.attributeBreakdown = attributeBreakdown;
exports.attributeModifierTotals = attributeModifierTotals;
exports.attributeCombination = attributeCombination;
exports.otherAttributeRecords = otherAttributeRecords;
exports.supportedAttribute = supportedAttribute;
exports.validAttributeAmount = validAttributeAmount;
exports.attributeName = attributeName;
exports.EFFECT_PREFIX = EFFECT_PREFIX;
exports.CLASS_EFFECT_PREFIX = CLASS_EFFECT_PREFIX;
exports.STRUCTURED_TIMINGS = STRUCTURED_TIMINGS;
exports.makeMovementRecord = makeMovementRecord;
exports.validMovementFeet = validMovementFeet;
exports.isMovementModifier = isMovementModifier;
exports.movementRecordsFor = movementRecordsFor;
exports.movementEffectKey = movementEffectKey;
exports.movementCombination = movementCombination;
exports.movementBreakdown = movementBreakdown;
exports.structuredBoundary = structuredBoundary;
exports.structuredOccurrences = structuredOccurrences;
exports.COUNTED_TIMINGS = COUNTED_TIMINGS;
exports.MAX_OCCURRENCES = MAX_OCCURRENCES;
exports.isCountedTiming = isCountedTiming;
exports.validOccurrences = validOccurrences;
exports.ordinal = ordinal;
exports.occurrenceText = occurrenceText;
exports.makeStunnedRecord = makeStunnedRecord;
exports.isStunned = isStunned;
exports.stunnedRecordsFor = stunnedRecordsFor;
exports.holdsStunned = holdsStunned;
exports.sameStunnedSource = sameStunnedSource;
exports.DEFENDING = DEFENDING;
exports.REF_KEYS = REF_KEYS;
exports.sameRef = sameRef;
exports.canonical = canonical;
exports.isDefending = isDefending;
exports.recordsFor = recordsFor;
exports.holdsDefending = holdsDefending;
exports.blockingReduction = blockingReduction;
exports.preventsBlockingWear = preventsBlockingWear;
exports.expiryLabel = expiryLabel;
exports.makeDefendingRecord = makeDefendingRecord;
exports.validManagedRecord = validManagedRecord;
