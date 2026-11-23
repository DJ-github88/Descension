'use strict';

/**
 * Pure shared Hunter Flow rule, Slice-1 Quick Draw contract & reversible migration module
 * (Vault v38 Checkpoint 25 + Supplement §17 + Creator Approval 2026-11-17).
 *
 * Scope boundary:
 * - Pure deterministic calculation, state validation, Quick Draw Slice-1 policy checks,
 *   card/authoring normalization, encounter-end reset helper, and reversible
 *   hunter-evidence -> hunter-flow migration helpers ONLY.
 * - Zero RNG, zero storage, zero socket listeners, and zero client-authoritative Flow setters.
 * - Leaves Apex (`quarryMarksCompanion`), Animist (`ancestralResonance`), and Totemist untouched.
 */

const FLOW_VERSION = 'hunter-flow:v1';
const FLOW_DOMAIN = 'hunterFlow';
const FLOW_RESOURCE_TYPE = 'hunter-flow';
const LEGACY_EVIDENCE_TYPE = 'hunter-evidence';
const APEX_RESOURCE_TYPE = 'quarryMarksCompanion';

const FLOW_CAPABILITY = 'authored-hunter-flow:v1';
const FLOW_COMPILER = 'p14-hunter-flow-1';
const QUICK_DRAW_APPROVAL_REF = 'creator-approval-20261117-hunter-slice-1';

const FLOW_MIN = 1;
const FLOW_MAX = 4;
const FLOW_START = 1;
const DIE_MIN = 1;
const DIE_MAX = 6;

const QUICK_DRAW_SLICE_POLICY = Object.freeze({
  abilityId: 'cr1_hunter_quick_draw',
  name: 'Quick Draw',
  actionPoints: 1,
  mana: 0,
  formula: '1d6',
  damageTypes: Object.freeze(['stabbing']),
  rangeFeet: 30,
  restriction: 'enemy',
  bonusDamageOnHit: 2,
  bonusDamageType: 'stabbing',
  rollDice: Object.freeze({ count: 2, sides: 6 }),
  updateOnMiss: true,
  encounterResetTo: FLOW_START,
  approvalRef: QUICK_DRAW_APPROVAL_REF
});

const NON_REDUCTION_EVENTS = Object.freeze(['damage_taken', 'stunned', 'movement']);
const ABILITY_KINDS = Object.freeze(['flow_eligible', 'preparation', 'ordinary']);

const isSafeIntIn = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max;
const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
const text = (value) => (typeof value === 'string' ? value.trim() : '');

function fail(code, message) {
  const error = new Error(message || code);
  error.code = code;
  throw error;
}

function assertValidFlow(flow, label = 'preRollFlow') {
  if (!isSafeIntIn(flow, FLOW_MIN, FLOW_MAX)) {
    fail('invalid_hunter_flow', `${label} must be an integer between ${FLOW_MIN} and ${FLOW_MAX}.`);
  }
  return flow;
}

function clampFlow(value) {
  if (!Number.isFinite(value)) return FLOW_START;
  return Math.max(FLOW_MIN, Math.min(FLOW_MAX, Math.trunc(value)));
}

/**
 * Pure Vault v38 Checkpoint 25 / Supplement §17 Flow 2d6 resolution.
 */
function resolveFlowRoll(input) {
  const { preRollFlow, dice } = input && typeof input === 'object' ? input : {};
  assertValidFlow(preRollFlow, 'preRollFlow');
  if (!Array.isArray(dice) || dice.length !== 2) {
    fail('invalid_flow_dice', 'Hunter Flow check requires exactly two d6 die faces ([d1, d2]).');
  }
  const d1 = dice[0];
  const d2 = dice[1];
  if (!isSafeIntIn(d1, DIE_MIN, DIE_MAX) || !isSafeIntIn(d2, DIE_MIN, DIE_MAX)) {
    fail('invalid_flow_dice', 'Each Hunter Flow die face must be an integer from 1 to 6.');
  }

  const isNaturalDoubles = d1 === d2;
  const difference = Math.abs(d1 - d2);

  let outcome;
  let flowBonusActivated;
  let rawDelta;

  if (isNaturalDoubles) {
    outcome = 'natural_doubles';
    flowBonusActivated = true;
    rawDelta = 1;
  } else if (difference <= preRollFlow) {
    outcome = 'within_threshold';
    flowBonusActivated = true;
    rawDelta = 0;
  } else {
    outcome = 'outside_threshold';
    flowBonusActivated = false;
    rawDelta = -1;
  }

  const unclamped = preRollFlow + rawDelta;
  const postRollFlow = Math.max(FLOW_MIN, Math.min(FLOW_MAX, unclamped));
  const flowDelta = postRollFlow - preRollFlow;
  const clamped = postRollFlow !== unclamped;

  return Object.freeze({
    ruleVersion: FLOW_VERSION,
    preRollFlow,
    dice: Object.freeze([d1, d2]),
    difference,
    isNaturalDoubles,
    flowBonusActivated,
    rawDelta,
    flowDelta,
    postRollFlow,
    clamped,
    outcome,
    preservesNormalResolution: true,
    doublesAutoCrit: false
  });
}

/**
 * Pure non-reduction check: taking damage, being stunned, or moving never lowers or resets Flow.
 */
function applyNonReductionEvent(input) {
  const { currentFlow, eventType } = input && typeof input === 'object' ? input : {};
  assertValidFlow(currentFlow, 'currentFlow');
  if (!NON_REDUCTION_EVENTS.includes(eventType)) {
    fail('unsupported_non_reduction_event', `Unsupported eventType '${eventType}'. Expected one of: ${NON_REDUCTION_EVENTS.join(', ')}.`);
  }
  return Object.freeze({
    ruleVersion: FLOW_VERSION,
    eventType,
    preEventFlow: currentFlow,
    postEventFlow: currentFlow,
    delta: 0,
    changed: false,
    reason: 'Vault checkpoint 25: damage taken, stun, and movement do not independently lower or reset Flow.'
  });
}

/**
 * Validate a 2d6 Flow check payload (`{ mode: 'digital' | 'physical', dice: [{ sides: 6, faces: [d1, d2] }] }`).
 */
function validateFlowCheckRoll(flowCheck) {
  if (!flowCheck || typeof flowCheck !== 'object' || Array.isArray(flowCheck)) {
    fail('invalid_flow_check', 'flowCheck must be an object.');
  }
  const keys = Object.keys(flowCheck);
  if (keys.some((k) => !['mode', 'dice'].includes(k))) {
    fail('invalid_flow_check', 'flowCheck contains unsupported fields.');
  }
  if (!['digital', 'physical'].includes(flowCheck.mode)) {
    fail('invalid_flow_check', 'flowCheck.mode must be digital or physical.');
  }
  if (!Array.isArray(flowCheck.dice) || flowCheck.dice.length !== 1) {
    fail('invalid_flow_check', 'flowCheck.dice must contain one 2d6 group.');
  }
  const group = flowCheck.dice[0];
  if (!group || typeof group !== 'object' || group.sides !== 6 || !Array.isArray(group.faces) || group.faces.length !== 2) {
    fail('invalid_flow_check', 'flowCheck.dice[0] must be { sides: 6, faces: [d1, d2] }.');
  }
  const d1 = group.faces[0];
  const d2 = group.faces[1];
  if (!isSafeIntIn(d1, DIE_MIN, DIE_MAX) || !isSafeIntIn(d2, DIE_MIN, DIE_MAX)) {
    fail('invalid_flow_check', 'Each 2d6 Flow check face must be an integer 1..6.');
  }
  return [d1, d2];
}

/**
 * Creator-approved Slice-1 Quick Draw outcome (D-S1 + D-S2):
 * - Hit + qualifying Flow check: baseRollTotal + 2 stabbing damage.
 * - Miss (hit === false): 0 damage (Flow bonus never makes a miss deal damage),
 *   while Flow still updates from the 2d6 check.
 */
function resolveQuickDrawOutcome({ preRollFlow, flowDice, hit, baseRollTotal } = {}) {
  if (typeof hit !== 'boolean') {
    fail('invalid_flow_hit', 'hit must be a boolean.');
  }
  if (!Number.isSafeInteger(baseRollTotal) || baseRollTotal < 0 || baseRollTotal > 100000) {
    fail('invalid_flow_total', 'baseRollTotal must be a non-negative integer.');
  }
  const flowResult = resolveFlowRoll({ preRollFlow, dice: flowDice });
  const bonusDamage = hit && flowResult.flowBonusActivated ? QUICK_DRAW_SLICE_POLICY.bonusDamageOnHit : 0;
  const expectedDamage = hit ? baseRollTotal + bonusDamage : 0;
  return Object.freeze({
    approvalRef: QUICK_DRAW_APPROVAL_REF,
    flowResult,
    hit,
    bonusDamage,
    expectedDamage
  });
}

/**
 * Check whether an authored Wizard draft matches the creator-approved Quick Draw Slice-1 contract.
 */
function isQuickDrawFlowSpell({ classId, mechanicsConfig, actionPoints, mana, directEffect, targeting } = {}) {
  if (String(classId || '').toLowerCase() !== 'hunter') {
    return { ok: false, reason: 'Hunter Flow execution requires classId "hunter".' };
  }
  const hf = mechanicsConfig?.hunterFlow;
  if (!hf || typeof hf !== 'object' || Array.isArray(hf) || hf.enabled !== true) {
    return { ok: false, reason: 'mechanicsConfig.hunterFlow.enabled must be true.' };
  }
  if (hf.abilityKind !== 'flow_eligible' || hf.ruleset !== 'checkpoint-25-flow' || hf.companionShared !== true) {
    return { ok: false, reason: 'Only creator-approved flow_eligible Checkpoint-25 Flow spells are executable; preparation and other roles remain manual.' };
  }
  if (actionPoints !== QUICK_DRAW_SLICE_POLICY.actionPoints || mana !== QUICK_DRAW_SLICE_POLICY.mana) {
    return { ok: false, reason: 'Quick Draw Flow execution requires 1 AP and 0 mana.' };
  }
  if (!directEffect || directEffect.kind !== 'damage' || directEffect.formula !== QUICK_DRAW_SLICE_POLICY.formula ||
      JSON.stringify(directEffect.damageTypes || []) !== JSON.stringify(['stabbing'])) {
    return { ok: false, reason: 'Quick Draw Flow execution requires 1d6 stabbing immediate damage.' };
  }
  if (!targeting || targeting.kind !== 'single' || targeting.rangeFeet !== QUICK_DRAW_SLICE_POLICY.rangeFeet ||
      targeting.restriction !== QUICK_DRAW_SLICE_POLICY.restriction || targeting.maxTargets !== 1) {
    return { ok: false, reason: 'Quick Draw Flow execution requires single enemy targeting at 30 ft.' };
  }
  return { ok: true };
}

/**
 * Construct or validate a shared Hunter/companion Flow state object.
 */
function createSharedFlowState(options = {}) {
  const flow = options.flow === undefined ? FLOW_START : assertValidFlow(options.flow, 'flow');
  const companion = options.companion && typeof options.companion === 'object'
    ? {
        id: text(options.companion.id) || null,
        label: text(options.companion.label) || 'Bonded companion',
        bonded: options.companion.bonded === true
      }
    : null;
  return {
    version: 1,
    flow,
    min: FLOW_MIN,
    max: FLOW_MAX,
    sharedWithCompanion: true,
    companion,
    resetBoundaryPolicy: options.resetBoundaryPolicy || 'encounter-end-1'
  };
}

function validateSharedFlowState(state) {
  const errors = [];
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return { valid: false, errors: ['Flow state must be an object.'] };
  }
  if (!isSafeIntIn(state.flow, FLOW_MIN, FLOW_MAX)) {
    errors.push(`flow must be an integer ${FLOW_MIN}..${FLOW_MAX}`);
  }
  if (state.min !== undefined && state.min !== FLOW_MIN) {
    errors.push(`min must be ${FLOW_MIN}`);
  }
  if (state.max !== undefined && state.max !== FLOW_MAX) {
    errors.push(`max must be ${FLOW_MAX}`);
  }
  if (state.sharedWithCompanion !== true) {
    errors.push('Hunter and companion must share Flow (sharedWithCompanion: true)');
  }
  if (state.companion !== null && state.companion !== undefined) {
    if (typeof state.companion !== 'object' || Array.isArray(state.companion)) {
      errors.push('companion must be null or an object');
    } else if (state.companion.bonded !== true) {
      errors.push('companion must be positively bonded (bonded: true)');
    }
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Normalize Wizard/library Hunter Flow authoring metadata without stripping unknown/unsupported fields.
 */
function normalizeFlowAuthoringConfig(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || input.enabled !== true) {
    return null;
  }
  const abilityKind = ABILITY_KINDS.includes(input.abilityKind) ? input.abilityKind : 'flow_eligible';
  const baseEffectSummary = text(input.baseEffectSummary);
  const flowBonusSummary = text(input.flowBonusSummary);
  const companionShared = input.companionShared !== false;
  return {
    enabled: true,
    ruleset: 'checkpoint-25-flow',
    abilityKind,
    baseEffectSummary,
    flowBonusSummary,
    companionShared,
    approvalStatus: abilityKind === 'ordinary'
      ? 'no_flow_roll'
      : abilityKind === 'flow_eligible'
        ? 'slice_1_quick_draw_or_pending'
        : 'pending_creator_decisions'
  };
}

function extractFlowAuthoringFromRecord(record) {
  if (!record || typeof record !== 'object') return null;
  const draft = record.authoredDraft && typeof record.authoredDraft === 'object' ? record.authoredDraft : record;
  return (
    normalizeFlowAuthoringConfig(draft?.mechanicsConfig?.hunterFlow) ||
    normalizeFlowAuthoringConfig(record?.mechanicsConfig?.hunterFlow) ||
    normalizeFlowAuthoringConfig(draft?.specialMechanics?.hunterFlow) ||
    normalizeFlowAuthoringConfig(record?.specialMechanics?.hunterFlow) ||
    null
  );
}

/**
 * Pure presentation model for SpellCard / SpellBehaviorFlow explaining ordinary effect,
 * Flow qualification, printed Flow bonus, and (when available) pre-roll & post-roll shared Flow.
 */
function describeFlowMechanics(flowConfig, liveContext = {}) {
  const normalized = normalizeFlowAuthoringConfig(flowConfig);
  if (!normalized) return null;

  const preRollFlow = isSafeIntIn(liveContext.preRollFlow, FLOW_MIN, FLOW_MAX)
    ? liveContext.preRollFlow
    : null;
  const flowResult = liveContext.flowResult && typeof liveContext.flowResult === 'object'
    ? liveContext.flowResult
    : null;
  const executableQuickDraw = liveContext.executableQuickDraw === true;

  if (normalized.abilityKind === 'ordinary') {
    return {
      label: 'FLOW (ORDINARY)',
      summary: 'Ordinary Hunter action — does not roll 2d6 for Flow.',
      branches: [],
      details: [
        normalized.baseEffectSummary ? `Ordinary effect: ${normalized.baseEffectSummary}` : 'Resolves its authored ordinary effect only.',
        'Shared Hunter/companion Flow is unchanged; damage taken, stun, and movement never lower or reset Flow.'
      ]
    };
  }

  if (normalized.abilityKind === 'preparation') {
    return {
      label: 'FLOW PREPARATION (PENDING)',
      summary: 'AP preparation direction approved in Checkpoint 25; exact AP cost, eligibility, and frequency await creator decision.',
      branches: [],
      details: [
        normalized.baseEffectSummary ? `Ordinary effect: ${normalized.baseEffectSummary}` : 'Preparation effect preserved as authored.',
        normalized.flowBonusSummary ? `Flow interaction: ${normalized.flowBonusSummary}` : 'Preparation details remain manual until creator confirmation.'
      ]
    };
  }

  const baseText = normalized.baseEffectSummary || 'Ordinary ability effect (normal hit/save/critical resolution applies).';
  const bonusText = normalized.flowBonusSummary || 'Printed Flow bonus not yet specified.';
  const thresholdHint = preRollFlow !== null
    ? `Difference ≤ pre-roll Flow (${preRollFlow})`
    : 'Difference ≤ pre-roll Flow';

  const branches = [
    { outcome: 'Natural doubles (d1 = d2)', text: `Activates printed Flow bonus (${bonusText}) and raises shared Flow +1 (cap ${FLOW_MAX}).` },
    { outcome: `${thresholdHint} (non-doubles)`, text: `Activates printed Flow bonus (${bonusText}) and maintains shared Flow.` },
    { outcome: preRollFlow !== null ? `Difference > ${preRollFlow}` : 'Difference > pre-roll Flow', text: `Ordinary effect only (${baseText}); lowers shared Flow −1 (floor ${FLOW_MIN}).` }
  ];

  const details = [
    'Normal hit, save, and critical resolution still applies (natural doubles do not automatically critical; a miss never deals damage).',
    'Hunter and bonded companion share Flow (1–4). Damage taken, stun, and movement never lower or reset Flow.',
    executableQuickDraw
      ? 'Approved Quick Draw slice (D-S1–D-S3): one 2d6 check per committed action including misses; resets to 1 at encounter end.'
      : 'Non-Quick-Draw Flow abilities remain manual until creator approval.'
  ];

  if (flowResult && isSafeIntIn(flowResult.preRollFlow, FLOW_MIN, FLOW_MAX) && isSafeIntIn(flowResult.postRollFlow, FLOW_MIN, FLOW_MAX)) {
    const diceText = Array.isArray(flowResult.dice) && flowResult.dice.length === 2
      ? `2d6 = [${flowResult.dice[0]}, ${flowResult.dice[1]}] (diff ${flowResult.difference}${flowResult.isNaturalDoubles ? ', natural doubles' : ''})`
      : '';
    details.unshift(
      `Shared Hunter/companion Flow: pre-roll ${flowResult.preRollFlow}/${FLOW_MAX}${diceText ? ` · ${diceText}` : ''} → ${flowResult.flowBonusActivated ? 'Flow bonus activated' : 'Ordinary effect only'} · post-roll ${flowResult.postRollFlow}/${FLOW_MAX}.`
    );
  } else if (preRollFlow !== null) {
    details.unshift(`Current shared Hunter/companion Flow: ${preRollFlow}/${FLOW_MAX} (pre-roll).`);
  }

  return {
    label: executableQuickDraw ? 'FLOW CHECK (2d6 · QUICK DRAW)' : 'FLOW CHECK (2d6 · MANUAL)',
    summary: `Base: ${baseText} · Flow bonus: ${bonusText}`,
    branches,
    details
  };
}

/**
 * Project a Hunter resource object (either legacy `hunter-evidence` or `hunter-flow`)
 * for HUD / resource controls without mutating stored data.
 */
function projectHunterFlowResource(resource, isOwner = false) {
  if (!resource || typeof resource !== 'object') {
    return {
      mode: 'uninitialized',
      type: FLOW_RESOURCE_TYPE,
      flow: FLOW_START,
      min: FLOW_MIN,
      max: FLOW_MAX,
      sharedWithCompanion: true,
      companion: null,
      valid: true,
      errors: [],
      hasLegacyEvidence: false,
      legacyEvidence: null
    };
  }

  if (resource.type === APEX_RESOURCE_TYPE) {
    return {
      mode: 'apex-preserved',
      type: APEX_RESOURCE_TYPE,
      valid: true,
      errors: [],
      untouched: true
    };
  }

  if ([FLOW_RESOURCE_TYPE, 'hunter_flow', FLOW_DOMAIN].includes(resource.type)) {
    let state;
    const errors = [];
    if (resource.state && typeof resource.state === 'object') {
      state = resource.state;
      const check = validateSharedFlowState(state);
      if (!check.valid) Array.prototype.push.apply(errors, check.errors);
    } else if (resource.current !== undefined) {
      if (!isSafeIntIn(resource.current, FLOW_MIN, FLOW_MAX)) {
        errors.push(`current must be an integer ${FLOW_MIN}..${FLOW_MAX}`);
        state = createSharedFlowState({ flow: clampFlow(resource.current) });
      } else {
        state = createSharedFlowState({ flow: resource.current });
      }
    } else {
      state = createSharedFlowState({ flow: FLOW_START });
    }

    const hasLegacy = Boolean(resource.legacyHunterEvidence);
    return {
      mode: 'hunter-flow',
      type: FLOW_RESOURCE_TYPE,
      flow: errors.length === 0 ? state.flow : clampFlow(state.flow),
      min: FLOW_MIN,
      max: FLOW_MAX,
      sharedWithCompanion: state.sharedWithCompanion === true,
      companion: state.companion
        ? {
            id: state.companion.id || null,
            label: state.companion.label || 'Bonded companion',
            bonded: state.companion.bonded === true
          }
        : null,
      resetBoundaryPolicy: state.resetBoundaryPolicy || 'encounter-end-1',
      valid: errors.length === 0,
      errors,
      hasLegacyEvidence: hasLegacy,
      legacyEvidence: isOwner && hasLegacy ? clone(resource.legacyHunterEvidence) : null
    };
  }

  return {
    mode: 'legacy-evidence',
    type: resource.type || LEGACY_EVIDENCE_TYPE,
    valid: true,
    errors: [],
    hasLegacyEvidence: true
  };
}

function isFlowResourceRecord(resource) {
  return Boolean(
    resource &&
    typeof resource === 'object' &&
    !Array.isArray(resource) &&
    [FLOW_RESOURCE_TYPE, 'hunter_flow', FLOW_DOMAIN].includes(resource.type)
  );
}

/**
 * Fields that carry the original `hunter-evidence` record through a Flow commit/reset.
 * - already carrying a snapshot: keep it (and its migration markers) verbatim;
 * - a raw `hunter-evidence` record: snapshot it once, verbatim, with the v1 migration markers (rollback-ready);
 * - anything else (native Flow, empty, Apex, foreign): nothing is invented.
 */
function carryLegacyEvidence(prev) {
  if (!prev || typeof prev !== 'object' || Array.isArray(prev)) return {};
  if (prev.legacyHunterEvidence && typeof prev.legacyHunterEvidence === 'object') {
    const out = { legacyHunterEvidence: clone(prev.legacyHunterEvidence) };
    for (const key of ['rulesetVersion', 'migrationVersion', 'migratedFrom', 'migratedAt']) if (prev[key] !== undefined) out[key] = prev[key];
    return out;
  }
  if ([LEGACY_EVIDENCE_TYPE, 'hunter_evidence'].includes(prev.type)) {
    return {
      rulesetVersion: 'checkpoint-25-flow-slice-1',
      migrationVersion: 1,
      migratedFrom: prev.type,
      legacyHunterEvidence: clone(prev)
    };
  }
  return {};
}

function normalizeFlowResourceRecord(resource) {
  const projected = projectHunterFlowResource(resource, true);
  const flow = projected.valid && isSafeIntIn(projected.flow, FLOW_MIN, FLOW_MAX) ? projected.flow : FLOW_START;
  const legacy = resource?.legacyHunterEvidence && typeof resource.legacyHunterEvidence === 'object'
    ? { legacyHunterEvidence: clone(resource.legacyHunterEvidence) }
    : {};
  for (const key of ['rulesetVersion', 'migrationVersion', 'migratedFrom', 'migratedAt']) if (resource?.[key] !== undefined) legacy[key] = resource[key];
  const companion = projected.companion ? clone(projected.companion) : null;
  return Object.assign({
    type: FLOW_RESOURCE_TYPE,
    current: flow,
    min: FLOW_MIN,
    max: FLOW_MAX,
    sharedWithCompanion: true,
    initialized: true,
    stateValid: projected.valid,
    validationErrors: projected.errors,
    state: createSharedFlowState({ flow, companion, resetBoundaryPolicy: 'encounter-end-1' })
  }, legacy);
}

/**
 * Reset all Hunter Flow tokens in a room's gameState back to Flow 1 on encounter end (D-S3).
 * Purely operates on the provided room.gameState object; leaves non-Hunter and Apex tokens untouched.
 */
function resetRoomHunterFlow(gameState) {
  if (!gameState || typeof gameState !== 'object') return 0;
  let resetCount = 0;
  const resetToken = (token) => {
    if (!token || typeof token !== 'object') return;
    const isHunterFlowPayment = token.state?.classPayment?.domain === FLOW_DOMAIN;
    const isHunterFlowResource = token.character?.classResource?.type === FLOW_RESOURCE_TYPE ||
      token.character?.classResource?.type === 'hunter_flow';
    if (!isHunterFlowPayment && !isHunterFlowResource) return;

    if (isHunterFlowPayment) {
      token.state.classPayment = {
        version: 1,
        domain: FLOW_DOMAIN,
        value: { type: FLOW_DOMAIN, flow: FLOW_START }
      };
    }
    if (token.character && typeof token.character === 'object') {
      const prev = token.character.classResource || {};
      const companion = prev.state?.companion ? clone(prev.state.companion) : null;
      const legacy = carryLegacyEvidence(prev);
      token.character.classResource = Object.assign({
        type: FLOW_RESOURCE_TYPE,
        current: FLOW_START,
        min: FLOW_MIN,
        max: FLOW_MAX,
        sharedWithCompanion: true,
        state: createSharedFlowState({ flow: FLOW_START, companion, resetBoundaryPolicy: 'encounter-end-1' })
      }, legacy);
    }
    resetCount += 1;
  };

  for (const map of Object.values(gameState.maps || {})) {
    for (const token of Object.values(map?.characterTokens || {})) resetToken(token);
    for (const token of Object.values(map?.tokens || {})) resetToken(token);
  }
  for (const token of Object.values(gameState.characterTokens || {})) resetToken(token);
  for (const token of Object.values(gameState.tokens || {})) resetToken(token);
  return resetCount;
}

/**
 * Reversible, versioned engineering migration:
 * Requires explicit `className === 'Hunter'` before migrating `null`/uninitialized records.
 * Preserves the complete original `hunter-evidence` payload verbatim under `legacyHunterEvidence`.
 */
function migrateHunterResourceRecord(resource, options = {}) {
  const classKey = text(options.className).toLowerCase();
  if (classKey && classKey !== 'hunter') {
    return { migrated: false, reason: 'non_hunter_class_untouched', resource: clone(resource) };
  }
  if ((resource === null || resource === undefined) && classKey !== 'hunter') {
    return { migrated: false, reason: 'explicit_hunter_class_required', resource: null };
  }
  if (resource && typeof resource === 'object' && resource.type === APEX_RESOURCE_TYPE) {
    return { migrated: false, reason: 'apex_resource_untouched', resource: clone(resource) };
  }
  if (resource && typeof resource === 'object' && [FLOW_RESOURCE_TYPE, 'hunter_flow'].includes(resource.type)) {
    return {
      migrated: false,
      reason: resource.migrationVersion === 1 ? 'already_migrated' : 'already_hunter_flow',
      resource: clone(resource)
    };
  }
  if (resource && typeof resource === 'object' && resource.type && ![LEGACY_EVIDENCE_TYPE, 'hunter_evidence'].includes(resource.type)) {
    return { migrated: false, reason: 'foreign_resource_type_untouched', resource: clone(resource) };
  }

  const initialFlow = options.initialFlow === undefined ? FLOW_START : assertValidFlow(options.initialFlow, 'initialFlow');
  const legacyCompanion = resource?.state?.companion && typeof resource.state.companion === 'object'
    ? clone(resource.state.companion)
    : null;
  const companion = options.companion !== undefined ? clone(options.companion) : legacyCompanion;

  const snapshot = resource ? clone(resource) : null;
  const flowState = createSharedFlowState({ flow: initialFlow, companion, resetBoundaryPolicy: 'encounter-end-1' });

  return {
    migrated: true,
    reason: 'migrated_to_hunter_flow_v1',
    resource: {
      type: FLOW_RESOURCE_TYPE,
      rulesetVersion: 'checkpoint-25-flow-slice-1',
      migrationVersion: 1,
      migratedFrom: snapshot ? (snapshot.type || LEGACY_EVIDENCE_TYPE) : 'uninitialized',
      migratedAt: options.timestamp || null,
      current: flowState.flow,
      min: FLOW_MIN,
      max: FLOW_MAX,
      sharedWithCompanion: true,
      state: flowState,
      legacyHunterEvidence: snapshot
    }
  };
}

/**
 * Lossless rollback of `migrateHunterResourceRecord`.
 */
function rollbackHunterResourceMigration(resource) {
  if (!resource || typeof resource !== 'object') {
    return { rolledBack: false, reason: 'not_migrated', resource: clone(resource) };
  }
  if (resource.type === APEX_RESOURCE_TYPE) {
    return { rolledBack: false, reason: 'apex_resource_untouched', resource: clone(resource) };
  }
  if (resource.type !== FLOW_RESOURCE_TYPE || resource.migrationVersion !== 1) {
    return { rolledBack: false, reason: 'not_hunter_flow_v1', resource: clone(resource) };
  }
  if (resource.migratedFrom === 'uninitialized') {
    return {
      rolledBack: true,
      reason: 'restored_uninitialized_hunter_resource',
      resource: null
    };
  }
  if (!resource.legacyHunterEvidence || typeof resource.legacyHunterEvidence !== 'object') {
    return { rolledBack: false, reason: 'missing_legacy_snapshot', resource: clone(resource) };
  }
  return {
    rolledBack: true,
    reason: 'restored_legacy_hunter_evidence',
    resource: clone(resource.legacyHunterEvidence)
  };
}

module.exports = {
  FLOW_VERSION,
  FLOW_DOMAIN,
  FLOW_RESOURCE_TYPE,
  LEGACY_EVIDENCE_TYPE,
  APEX_RESOURCE_TYPE,
  FLOW_CAPABILITY,
  FLOW_COMPILER,
  QUICK_DRAW_APPROVAL_REF,
  QUICK_DRAW_SLICE_POLICY,
  FLOW_MIN,
  FLOW_MAX,
  FLOW_START,
  NON_REDUCTION_EVENTS,
  ABILITY_KINDS,
  clampFlow,
  assertValidFlow,
  resolveFlowRoll,
  applyNonReductionEvent,
  validateFlowCheckRoll,
  resolveQuickDrawOutcome,
  isQuickDrawFlowSpell,
  createSharedFlowState,
  validateSharedFlowState,
  normalizeFlowAuthoringConfig,
  extractFlowAuthoringFromRecord,
  describeFlowMechanics,
  projectHunterFlowResource,
  isFlowResourceRecord,
  normalizeFlowResourceRecord,
  resetRoomHunterFlow,
  migrateHunterResourceRecord,
  carryLegacyEvidence,
  rollbackHunterResourceMigration
};
