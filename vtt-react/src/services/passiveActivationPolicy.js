/** Creator policy and canonical descriptor for the first playable passive (Heightened Senses; P1-P5).
 * APPROVED 14 November 2026 (handoff/first-playable-passive-implementation-successor-20261114/CREATOR_APPROVAL.md#creator-approval-14-november-2026).
 * Scope is strictly bounded to Heightened Senses (skill_perception_heightened_senses, Perception NOVICE, +2 flat initiative,
 * no authored trigger) under P1-P5. Unrelated passive shapes and unrelated initiative rules remain unapproved and refused.
 * No object/array spread on purpose: this file is bundled as CommonJS by the client build. */
const CONTRACT = 'passive-activation:v1';
const PASSIVE_DESCRIPTOR_VERSION = 'passive-descriptor:v1';
const HEIGHTENED_SENSES_RECORD_SHA256 = '2d44e0f6ca002c990ebaabf5af3f3d7d935624dfd2763bed696459ec044465f2';
const SKILL_RANK_LADDER = Object.freeze(['UNTRAINED', 'NOVICE', 'TRAINED', 'APPRENTICE', 'ADEPT', 'EXPERT', 'MASTER']);
const STACKING_MODES = Object.freeze(['one-copy-additive', 'exclusive', 'both-copies']);

const HEIGHTENED_SENSES_PASSIVE = Object.freeze({
  contract: PASSIVE_DESCRIPTOR_VERSION,
  passiveId: 'heightened-senses',
  sourceRecordId: 'skill_perception_heightened_senses',
  sourceShape: 'skill-ability:v1',
  sourceRecordSha256: HEIGHTENED_SENSES_RECORD_SHA256,
  name: 'Heightened Senses',
  spellType: 'PASSIVE',
  eligibility: Object.freeze({
    kind: 'skill-rank',
    skillId: 'perception',
    minRank: 'NOVICE'
  }),
  effect: Object.freeze({
    kind: 'initiative',
    stat: 'initiative',
    magnitude: 2,
    magnitudeType: 'flat'
  }),
  cost: Object.freeze({
    actionPoints: 0,
    mana: 0
  }),
  authoredTrigger: null
});

const CREATOR_APPROVAL = Object.freeze({
  date: '2026-11-14',
  conversationId: '35c44bc6-9afd-4967-80a4-49f31d81ce8e',
  reference: 'handoff/first-playable-passive-implementation-successor-20261114/CREATOR_APPROVAL.md#creator-approval-14-november-2026',
  scope: Object.freeze(['P1', 'P2', 'P3', 'P4', 'P5']),
  profile: Object.freeze({
    P1: 'gm-explicit-perception-novice',
    P2: 'initiative-roll-automatic',
    P3: 'free-every-roll',
    P4: 'one-copy-additive',
    P5: 'revoke-future-rolls-disable-on-ineligible-or-incarnation-change'
  })
});

const POLICY = Object.freeze({
  contract: CONTRACT,
  decisions: Object.freeze(['P1', 'P2', 'P3', 'P4', 'P5']),
  recommendedProfile: Object.freeze({
    activationAuthority: 'gm-explicit',
    timing: 'initiative-roll-automatic',
    cost: 'free-every-roll',
    stacking: 'one-copy-additive',
    lifecycle: 'revoke-future-rolls-disable-on-ineligible-or-incarnation-change'
  }),
  creatorApproval: CREATOR_APPROVAL,
  request: 'handoff/first-playable-passive-readiness/CREATOR_CARD.md'
});

const UNAPPROVED_REASON = 'Prism does not activate passive modifiers while creator approval for the passive activation profile (P1-P5) is pending. Passive records remain stored on the character sheet and grant no active combat modifier.';

function approved() {
  const approval = POLICY.creatorApproval;
  return !!(approval && typeof approval.reference === 'string' && approval.reference.trim());
}

function stackingMode() {
  return POLICY.recommendedProfile.stacking;
}

function isPlain(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value) &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value));
}

function hasAuthoredTriggers(record) {
  if (!isPlain(record) || !isPlain(record.triggerConfig)) { return false; }
  const global = record.triggerConfig.global;
  if (isPlain(global) && Array.isArray(global.compoundTriggers) && global.compoundTriggers.length > 0) {
    return true;
  }
  const effectTriggers = record.triggerConfig.effectTriggers;
  if (isPlain(effectTriggers) && Object.keys(effectTriggers).length > 0) {
    return true;
  }
  return false;
}

function resolvePassiveDescriptor(input) {
  if (!isPlain(input)) {
    return { ok: false, code: 'unsupported_passive', reason: 'Passive descriptor input must be a plain record.' };
  }
  if (input.record !== undefined && !isPlain(input.record)) {
    return { ok: false, code: 'unsupported_passive', reason: 'The supplied passive record must be a plain object.' };
  }
  const record = isPlain(input.record) ? input.record : (typeof input.id === 'string' && input.passiveId === undefined ? input : null);
  const passiveId = input.passiveId !== undefined ? input.passiveId : (record && record.id === HEIGHTENED_SENSES_PASSIVE.sourceRecordId ? HEIGHTENED_SENSES_PASSIVE.passiveId : null);
  const sourceRecordId = input.sourceRecordId !== undefined ? input.sourceRecordId : (record ? record.id : null);

  if (passiveId !== HEIGHTENED_SENSES_PASSIVE.passiveId || sourceRecordId !== HEIGHTENED_SENSES_PASSIVE.sourceRecordId) {
    return {
      ok: false,
      code: 'unsupported_passive',
      reason: 'Only Heightened Senses (skill_perception_heightened_senses, Perception NOVICE, +2 flat initiative, no authored trigger) is supported.'
    };
  }

  if (record) {
    const effects = record.buffConfig && Array.isArray(record.buffConfig.effects) ? record.buffConfig.effects : [];
    const mod = effects.length === 1 && isPlain(effects[0]) && isPlain(effects[0].statModifier) ? effects[0].statModifier : null;
    const req = isPlain(record.skillRequirement) ? record.skillRequirement : null;
    const cost = isPlain(record.resourceCost) ? record.resourceCost : null;
    if (record.id !== HEIGHTENED_SENSES_PASSIVE.sourceRecordId ||
        record.spellType !== 'PASSIVE' ||
        hasAuthoredTriggers(record) ||
        !req || req.skillId !== 'perception' || req.minRank !== 'NOVICE' ||
        !mod || mod.stat !== 'initiative' || mod.magnitude !== 2 || mod.magnitudeType !== 'flat' ||
        (cost && ((cost.actionPoints || 0) !== 0 || (cost.mana || 0) !== 0))) {
      return {
        ok: false,
        code: 'unsupported_passive',
        reason: 'The supplied passive record does not match the canonical Heightened Senses shape.'
      };
    }
  }

  return { ok: true, descriptor: HEIGHTENED_SENSES_PASSIVE };
}

function extractSkillMap(character) {
  if (!isPlain(character)) { return null; }
  if (isPlain(character.skillRanks)) { return character.skillRanks; }
  if (isPlain(character.skill_ranks)) { return character.skill_ranks; }
  if (isPlain(character.skills)) { return character.skills; }
  return null;
}

function evaluatePassiveEligibility(character, descriptor) {
  const desc = descriptor || HEIGHTENED_SENSES_PASSIVE;
  if (!isPlain(character) || character.passiveIneligible === true) {
    return { ok: false, code: 'passive_source_ineligible', rank: 'UNTRAINED', reason: 'requires Perception NOVICE' };
  }
  const skillMap = extractSkillMap(character);
  if (!skillMap) {
    return { ok: false, code: 'passive_source_ineligible', rank: 'UNTRAINED', reason: 'requires Perception NOVICE' };
  }
  const raw = skillMap.perception !== undefined ? skillMap.perception : skillMap.PERCEPTION;
  const rank = typeof raw === 'string'
    ? raw.trim().toUpperCase()
    : (isPlain(raw) && typeof raw.rank === 'string' ? raw.rank.trim().toUpperCase() : 'UNTRAINED');
  const rankIndex = SKILL_RANK_LADDER.indexOf(rank);
  const minIndex = SKILL_RANK_LADDER.indexOf(desc.eligibility.minRank);
  if (rankIndex < 0 || rankIndex < minIndex) {
    return {
      ok: false,
      code: 'passive_source_ineligible',
      rank: rankIndex >= 0 ? rank : 'UNTRAINED',
      reason: 'requires Perception NOVICE'
    };
  }
  return { ok: true, rank: rank, skillId: desc.eligibility.skillId, minRank: desc.eligibility.minRank };
}

function describePassiveStatus(optionsOrActivation, maybeEligibility) {
  const isOptionsObj = isPlain(optionsOrActivation) && (
    Object.prototype.hasOwnProperty.call(optionsOrActivation, 'activation') ||
    Object.prototype.hasOwnProperty.call(optionsOrActivation, 'eligibility') ||
    Object.prototype.hasOwnProperty.call(optionsOrActivation, 'policyApproved')
  );
  const opts = isOptionsObj ? optionsOrActivation : {
    activation: optionsOrActivation || null,
    eligibility: maybeEligibility || null
  };
  const activation = opts.activation || null;
  const eligibility = opts.eligibility || null;
  const policyApproved = opts.policyApproved !== undefined ? Boolean(opts.policyApproved) : approved();

  if (!policyApproved) {
    const display = 'Inactive — creator approval pending';
    return {
      status: 'inactive',
      displayStatus: display,
      displayText: display,
      effectText: null,
      reason: UNAPPROVED_REASON,
      executableClaim: false
    };
  }

  if (activation) {
    if (activation.state === 'active' && (!eligibility || eligibility.ok !== false)) {
      const display = 'Active — +2 initiative';
      return {
        status: 'active',
        displayStatus: display,
        displayText: display,
        effectText: '+2 initiative',
        reason: null,
        executableClaim: false
      };
    }
    const reason = activation.reason || (eligibility && eligibility.reason) || 'ownership, incarnation, or eligibility changed';
    const display = 'Inactive — ' + reason;
    return {
      status: 'inactive',
      displayStatus: display,
      displayText: display,
      effectText: null,
      reason: reason,
      executableClaim: false
    };
  }

  if (eligibility && eligibility.ok === false) {
    const reason = eligibility.reason || 'requires Perception NOVICE';
    const display = 'Inactive — ' + reason;
    return {
      status: 'inactive',
      displayStatus: display,
      displayText: display,
      effectText: null,
      reason: reason,
      executableClaim: false
    };
  }

  return {
    status: 'stored',
    displayStatus: 'Stored — not active',
    displayText: 'Stored — not active',
    effectText: null,
    reason: null,
    executableClaim: false
  };
}

module.exports = {
  CONTRACT: CONTRACT,
  PASSIVE_DESCRIPTOR_VERSION: PASSIVE_DESCRIPTOR_VERSION,
  HEIGHTENED_SENSES_RECORD_SHA256: HEIGHTENED_SENSES_RECORD_SHA256,
  SKILL_RANK_LADDER: SKILL_RANK_LADDER,
  STACKING_MODES: STACKING_MODES,
  HEIGHTENED_SENSES_PASSIVE: HEIGHTENED_SENSES_PASSIVE,
  CREATOR_APPROVAL: CREATOR_APPROVAL,
  POLICY: POLICY,
  UNAPPROVED_REASON: UNAPPROVED_REASON,
  approved: approved,
  stackingMode: stackingMode,
  resolvePassiveDescriptor: resolvePassiveDescriptor,
  evaluatePassiveEligibility: evaluatePassiveEligibility,
  describePassiveStatus: describePassiveStatus
};
