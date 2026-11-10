/**
 * Shared Spell Timing and Presentation Helper
 *
 * Formats supported periodic effects, immediate-plus-periodic composition,
 * and authenticated combat cooldowns across UnifiedSpellCard and Wizard review.
 *
 * Rules:
 * - Pure presentation helper: no side effects, no mutation of definitions or records.
 * - Shows immediate component separately from recurring component.
 * - Shows target turn start OR end and exact tick count (never "rounds").
 * - Explains separate roll when GM resolves each tick, automatic scheduling vs GM-resolved HP,
 *   post-expiry resolvability of recorded ticks, and cost paid once at cast.
 * - Shows exact number of strictly upcoming caster-turn starts until reuse for cooldowns.
 * - Does not reinterpret legacy turn_based/rest/charge fields or assign them executable semantics.
 * - Preserves manual text, unsupported fields, and zero/false values.
 */

import { TYPE as COMBAT_COOLDOWN_TYPE, valid as validCombatCooldown } from '../../../../services/authoredCooldown';
import { policyText } from '../../../../services/authoredEffect';
import { validOccurrences } from '../../../../services/sharedConditionProfile';

export { COMBAT_COOLDOWN_TYPE };

const TARGET_TURN_POLICIES = ['target-next-start', 'target-next-end', 'target-start-count', 'target-end-count'];
/**
 * Wording for a structured target-turn expiry of an authored Stunned / movement / attribute effect (the installed policy text),
 * or null when the effect is manual (`gm-manual`), unknown, or a counted policy without a valid count. Callers keep their
 * existing manual wording for null. Accepts the Wizard policy key or the compiled `authored-` timing key.
 */
export function formatAuthoredExpiry(policy, occurrences) {
  const key = String(policy || '').replace(/^authored-/, '');
  if (!TARGET_TURN_POLICIES.includes(key)) return null;
  if (key.endsWith('-count') && !validOccurrences(occurrences)) return null;
  return policyText(key, occurrences);
}

/**
 * Checks whether a cooldown config represents the supported combat cooldown.
 */
export function isSupportedCombatCooldown(cooldownConfig) {
  if (!cooldownConfig || typeof cooldownConfig !== 'object') return false;
  return validCombatCooldown({
    cooldownType: cooldownConfig.cooldownType || cooldownConfig.type,
    cooldownValue: cooldownConfig.cooldownValue ?? cooldownConfig.value
  });
}

/**
 * Formats the supported authenticated caster-start combat cooldown.
 */
export function formatCombatCooldown(cooldownValue) {
  const n = Number.isSafeInteger(cooldownValue) ? cooldownValue : 1;
  return `${n} strictly upcoming caster-turn start${n === 1 ? '' : 's'} until reuse`;
}

/**
 * Extracts and normalizes periodic timing info from any supported spell shape:
 * - Wizard draft (`controlConfig.authoredCondition`)
 * - Saved library record (`authoredDraft.controlConfig.authoredCondition` or top-level)
 * - Compiled definition (`effects.condition` where `kind === 'periodic'`)
 */
export function extractPeriodicTiming(spell) {
  if (!spell || typeof spell !== 'object') return null;

  // 1. Check compiled definition structure (effects.condition && timing)
  const compiledCondition = spell.effects?.condition;
  if (compiledCondition && compiledCondition.kind === 'periodic' && compiledCondition.tick) {
    const kind = compiledCondition.tick.kind; // 'damage' or 'healing'
    const formula = compiledCondition.tick.formula;
    const damageType = kind === 'damage' ? (compiledCondition.tick.damageTypes?.[0] || null) : null;
    const timing = spell.timing || {};
    const expiryPolicy = timing.expiryPolicy;
    const occurrences = Number.isSafeInteger(timing.occurrences) ? timing.occurrences : 1;
    const boundary = (expiryPolicy === 'target-start-count' || expiryPolicy === 'target-next-start' ||
      expiryPolicy === 'authored-target-start-count' || expiryPolicy === 'authored-target-next-start') ? 'start' : 'end';
    const ticks = occurrences;
    const label = compiledCondition.label || spell.name || 'Periodic Effect';
    const durationText = timing.durationText || '';

    const direct = spell.effects.direct;
    const immediate = direct ? {
      kind: direct.kind,
      formula: direct.formula,
      damageTypes: Array.isArray(direct.damageTypes) ? direct.damageTypes : []
    } : null;

    return {
      isPeriodic: true,
      kind,
      formula,
      damageType,
      label,
      boundary,
      ticks,
      durationText,
      expiryPolicy,
      immediate
    };
  }

  // 2. Check Wizard draft / library record structure (controlConfig.authoredCondition)
  const authored = spell.controlConfig?.authoredCondition ||
    spell.authoredDraft?.controlConfig?.authoredCondition;

  if (authored && (authored.profile === 'authored-effect:v1' || authored.effect === 'periodic') &&
      authored.effect === 'periodic' && authored.periodicFormula) {
    const kind = authored.periodicKind || 'damage';
    const formula = authored.periodicFormula;
    const damageType = kind === 'damage' ? (authored.periodicDamageType || null) : null;
    const expiryPolicy = authored.expiryPolicy || 'target-start-count';
    const occurrences = Number.isSafeInteger(authored.occurrences) ? authored.occurrences :
      (['target-start-count', 'target-end-count'].includes(expiryPolicy) ? 2 : 1);
    const boundary = (expiryPolicy === 'target-start-count' || expiryPolicy === 'target-next-start' ||
      expiryPolicy === 'authored-target-start-count' || expiryPolicy === 'authored-target-next-start') ? 'start' : 'end';
    const ticks = ['target-start-count', 'target-end-count', 'authored-target-start-count', 'authored-target-end-count'].includes(expiryPolicy)
      ? occurrences : 1;
    const label = authored.label || spell.name || 'Periodic Effect';
    const durationText = authored.durationText || '';

    // Extract immediate component if present in the composed draft/record
    let immediate = null;
    const hasImmediateDamage = (spell.damageConfig?.formula || spell.primaryDamage?.dice || spell.damageConfig?.diceNotation) &&
      (spell.effectTypes?.includes('damage') || spell.authoredDraft?.effectTypes?.includes('damage'));
    const hasImmediateHealing = (spell.healingConfig?.formula || spell.healing?.dice || spell.healingConfig?.diceNotation) &&
      (spell.effectTypes?.includes('healing') || spell.authoredDraft?.effectTypes?.includes('healing'));

    if (hasImmediateDamage) {
      const dmgConfig = spell.damageConfig || spell.authoredDraft?.damageConfig || {};
      const formula = dmgConfig.formula || spell.primaryDamage?.dice || dmgConfig.diceNotation;
      const damageTypes = spell.damageTypes || (dmgConfig.elementType ? [dmgConfig.elementType] : []);
      immediate = { kind: 'damage', formula, damageTypes: Array.isArray(damageTypes) ? damageTypes : [damageTypes].filter(Boolean) };
    } else if (hasImmediateHealing) {
      const healConfig = spell.healingConfig || spell.authoredDraft?.healingConfig || {};
      const formula = healConfig.formula || spell.healing?.dice || healConfig.diceNotation;
      immediate = { kind: 'healing', formula, damageTypes: [] };
    }

    return {
      isPeriodic: true,
      kind,
      formula,
      damageType,
      label,
      boundary,
      ticks,
      durationText,
      expiryPolicy,
      immediate
    };
  }

  return null;
}

/**
 * Formats duration summary for the stat pill header.
 */
export function formatPeriodicDuration(periodicInfo) {
  if (!periodicInfo || !periodicInfo.isPeriodic) return null;
  const boundaryText = periodicInfo.boundary === 'start' ? 'target turn start' : 'target turn end';
  const tickCountText = `${periodicInfo.ticks} tick${periodicInfo.ticks === 1 ? '' : 's'}`;
  if (periodicInfo.durationText) {
    return `${periodicInfo.durationText} (${tickCountText}, ${boundaryText})`;
  }
  return `${tickCountText} (${boundaryText})`;
}

/**
 * Returns structured timing bullet points explaining the executable periodic contract.
 */
export function getPeriodicTimingPoints(periodicInfo) {
  if (!periodicInfo || !periodicInfo.isPeriodic) return [];

  const boundaryText = periodicInfo.boundary === 'start' ? 'target turn start' : 'target turn end';
  const tickDesc = periodicInfo.kind === 'damage'
    ? `${periodicInfo.formula}${periodicInfo.damageType ? ` ${periodicInfo.damageType}` : ''} damage`
    : `${periodicInfo.formula} healing`;

  const points = [];

  // 1. Immediate component (if composed)
  if (periodicInfo.immediate) {
    const immTypes = periodicInfo.immediate.damageTypes?.length
      ? ` ${periodicInfo.immediate.damageTypes.join('/')}`
      : '';
    points.push({
      label: 'Immediate component',
      text: `${periodicInfo.immediate.formula}${immTypes} ${periodicInfo.immediate.kind === 'damage' ? 'damage' : 'healing'} (rolled and applied at cast)`
    });
  }

  // 2. Recurring tick component
  points.push({
    label: 'Recurring component',
    text: `${tickDesc} per tick (${periodicInfo.ticks} tick${periodicInfo.ticks === 1 ? '' : 's'})`
  });

  // 3. Scheduling and boundary
  points.push({
    label: 'Turn boundary',
    text: `Recorded automatically at the ${boundaryText} for ${periodicInfo.ticks} turn${periodicInfo.ticks === 1 ? '' : 's'}`
  });

  // 4. Per-tick roll and GM resolution
  points.push({
    label: 'Tick resolution',
    text: 'A separate roll is made when the GM resolves each tick; automatic turn boundaries record due obligations, but change HP only when resolved'
  });

  // 5. Expiry and post-expiry resolvability
  points.push({
    label: 'Expiry',
    text: 'The effect expires with its final scheduled boundary; the final tick recorded at natural expiry remains available for GM resolution'
  });

  // 6. Payment
  points.push({
    label: 'Resource cost',
    text: 'Paid once at cast; scheduled ticks require no further payment'
  });

  return points;
}

/**
 * Formats a cohesive multi-line explanation for cards, review panels, and tooltips.
 */
export function formatPeriodicFullDescription(periodicInfo) {
  if (!periodicInfo || !periodicInfo.isPeriodic) return '';
  const points = getPeriodicTimingPoints(periodicInfo);
  return points.map(p => `${p.label}: ${p.text}`).join(' · ');
}
