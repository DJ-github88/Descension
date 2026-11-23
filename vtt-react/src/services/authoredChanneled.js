/**
 * Authored channeled spell lifecycle helper (authored-channeled:v1).
 * Shared between vtt-react and server/shared via sync-shared.js.
 * Must stay pure CommonJS with zero ES object/array spread syntax.
 */
const profile = require('./sharedConditionProfile');

const CAPABILITY = 'authored-channeled:v1';
const DC_ATTRIBUTES = profile.CHANNELED.dcTypes;

const isChanneled = approval => !!(approval && approval.spell && typeof approval.spell.definitionHash === 'string' &&
  approval.spell.definitionHash.startsWith(CAPABILITY + '/'));
const namedRecord = record => String(record?.sourceEntityId || '').startsWith(profile.EFFECT_PREFIX);
const occurrence = approvalId => profile.EFFECT_PREFIX + approvalId;

function timingKeyFor(tickFrequency, maxChannelDuration) {
  const start = tickFrequency === 'START_OF_TURN';
  if (Number.isSafeInteger(maxChannelDuration) && maxChannelDuration >= 2 && maxChannelDuration <= profile.MAX_OCCURRENCES) {
    return start ? 'authored-caster-start-count' : 'authored-caster-end-count';
  }
  return start ? 'authored-caster-next-start' : 'authored-caster-next-end';
}

function authoredDurationText(channel) {
  if (!channel) return '';
  const n = channel.maxChannelDuration;
  return `Channel up to ${n} caster ${n === 1 ? 'turn' : 'turns'} (${channel.rangeFeet} ft)`;
}

function tickSpec(tickEffect) {
  if (!tickEffect || typeof tickEffect !== 'object') return null;
  if (tickEffect.kind === 'healing') return { kind: 'healing', formula: tickEffect.formula };
  if (tickEffect.kind === 'damage') {
    const damageType = Array.isArray(tickEffect.damageTypes) ? tickEffect.damageTypes[0] : tickEffect.damageType;
    return { kind: 'damage', formula: tickEffect.formula, damageType };
  }
  return null;
}

function termsFor(definition) {
  return JSON.parse(JSON.stringify({
    tickEffect: definition.tickEffect,
    channel: definition.channel,
    timing: definition.timing
  }));
}

function recordFor(approval) {
  const terms = approval.channelTerms;
  const ch = terms.channel;
  const tick = tickSpec(terms.tickEffect);
  const opts = {
    sourceActor: approval.source,
    sourceOccurrence: occurrence(approval.approvalId),
    timing: ch.timing,
    authoredDuration: terms.timing.durationText,
    tick: tick,
    label: approval.spell.name,
    effectDefinition: approval.spell.definitionId,
    rangeFeet: ch.rangeFeet,
    interruptible: ch.interruptible,
    movementAllowed: ch.movementAllowed,
    breakEffect: ch.breakEffect
  };
  if (ch.occurrences !== undefined) {
    opts.occurrences = ch.occurrences;
  }
  if (ch.concentrationDC !== undefined && ch.concentrationDC !== null) {
    opts.concentrationDC = ch.concentrationDC;
    opts.dcType = ch.dcType;
  }
  return profile.makeChanneledRecord(approval.target, approval.approvalId, opts);
}

function conditionPlan(approval, conditions, casterChannels) {
  if (approval.target?.kind !== 'creature') {
    return {
      refused: {
        code: 'channeled_target_unsupported',
        message: 'A channeled effect can target one creature only; a player character target stays manual. Nothing was applied or charged.'
      }
    };
  }
  const record = recordFor(approval);
  const add = { op: 'add', recordId: approval.approvalId, record };
  const plan = profile.channeledCombination(conditions, record, casterChannels);
  if (!plan.ok) return { refused: { code: plan.code, message: plan.message } };
  return {
    ops: plan.replaces ? [{ op: 'remove', recordId: plan.replaces }, add] : [add],
    combination: { outcome: plan.outcome, replacesInstanceId: plan.replaces }
  };
}

function resultFor(approval, resolution, combination = null) {
  const terms = approval.channelTerms;
  return Object.assign({
    capability: CAPABILITY,
    approvalId: approval.approvalId,
    kind: 'channeled',
    gmConfirmed: true,
    roll: null,
    tickEffect: JSON.parse(JSON.stringify(terms.tickEffect)),
    channel: JSON.parse(JSON.stringify(terms.channel)),
    conditionInstanceId: approval.approvalId,
    spellName: approval.spell.name,
    resolution: JSON.parse(JSON.stringify(resolution))
  }, combination ? { combination: JSON.parse(JSON.stringify(combination)) } : {});
}

function distanceFeet(aPos, bPos, metrics) {
  if (!aPos || !bPos || !metrics) return Infinity;
  const ax = Number(aPos.x), ay = Number(aPos.y), bx = Number(bPos.x), by = Number(bPos.y);
  const gridSize = Number(metrics.gridSize), feetPerTile = Number(metrics.feetPerTile);
  if (!Number.isFinite(ax) || !Number.isFinite(ay) || !Number.isFinite(bx) || !Number.isFinite(by) ||
      !Number.isFinite(gridSize) || gridSize <= 0 || !Number.isFinite(feetPerTile) || feetPerTile <= 0) {
    return Infinity;
  }
  return (Math.hypot(ax - bx, ay - by) / gridSize) * feetPerTile;
}

function withinRange(aPos, bPos, metrics, rangeFeet) {
  if (!Number.isFinite(Number(rangeFeet)) || Number(rangeFeet) <= 0) return false;
  return distanceFeet(aPos, bPos, metrics) <= Number(rangeFeet) + 1e-6;
}

function describe(terms) {
  if (!terms || !terms.channel || !terms.tickEffect) return '';
  const ch = terms.channel;
  const tick = tickSpec(terms.tickEffect);
  const tickText = profile.tickText(tick);
  const sched = profile.tickScheduleText(ch.timing, ch.occurrences);
  const dcText = ch.concentrationDC
    ? `Concentration check hint: ${ch.dcType} DC ${ch.concentrationDC} (GM records interruption manually).`
    : 'Interruptible by GM removal or if caster becomes Stunned / 0 HP.';
  return `Channel Start (${ch.rangeFeet} ft range): pay AP/mana upfront; ${tickText} per tick (${sched}; GM resolves each tick). Channel End: final tick recorded, target moves beyond ${ch.rangeFeet} ft, or channel is interrupted. ${dcText}`;
}

module.exports = {
  CAPABILITY,
  DC_ATTRIBUTES,
  isChanneled,
  namedRecord,
  occurrence,
  timingKeyFor,
  authoredDurationText,
  tickSpec,
  termsFor,
  recordFor,
  conditionPlan,
  resultFor,
  distanceFeet,
  withinRange,
  describe
};
