/** Closed P14-C1 profile shared by Node/client. No evaluator, clock or action/payment rule. */
const data = require('../data/sharedConditionProfiles.json');
const DEFENDING = Object.freeze(data.defending);
const STUNNED = Object.freeze(data.stunned);
const MOVEMENT = Object.freeze(data.movementModifier);
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
  ? `${record.authoredDuration} — not tracked by the current turn clock; GM removes this exact instance.` : isStunned(record) || isMovementModifier(record) ? record.effectSummary : isDefending(record) && record.target?.kind === 'character' ? DEFENDING.expiryLabel :
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
function validMovementFeet(feet) {
  return Number.isSafeInteger(feet) && feet !== 0 && feet >= MOVEMENT.minFeet && feet <= MOVEMENT.maxFeet && feet % MOVEMENT.stepFeet === 0;
}
function isMovementModifier(record) { return record?.effectOrigin === MOVEMENT.origin && validManagedRecord(record, record.target); }
const movementRecordsFor = token => (Array.isArray(token?.state?.conditions) ? token.state.conditions : []).filter(r =>
  isMovementModifier(r) && sameRef(r.target, token.state?.actorContract));
/** Structured C4 boundary requested by an authored-effect record, or null for manual timing. */
const structuredBoundary = record => record && String(record.sourceEntityId || '').startsWith(EFFECT_PREFIX) && STRUCTURED_TIMINGS.includes(record.clockBoundary) &&
  (isStunned(record) || isMovementModifier(record)) ? (['authored-target-next-start', 'authored-target-start-count'].includes(record.clockBoundary) ? 'start' : 'end') : null;
/** Number of target-turn boundaries a structured record counts: 1 for the existing next-turn timings, 2…10 when counted, null otherwise. */
const structuredOccurrences = record => structuredBoundary(record) ? (isCountedTiming(record.clockBoundary) ? record.clockOccurrences : 1) : null;
function isStunned(record) { return record?.effectOrigin === STUNNED.origin && validManagedRecord(record, record.target); }
const stunnedRecordsFor = token => (Array.isArray(token?.state?.conditions) ? token.state.conditions : []).filter(r =>
  isStunned(r) && sameRef(r.target, token.state?.actorContract));
const holdsStunned = token => stunnedRecordsFor(token).length > 0;
const sameStunnedSource = (a, b) => a.sourceEntityId === b.sourceEntityId && canonical(a.sourceActor || null) === canonical(b.sourceActor || null);
exports.STUNNED = STUNNED;
exports.MOVEMENT = MOVEMENT;
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
