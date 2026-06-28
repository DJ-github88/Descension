/**
 * Per-field conflict resolution policies for the delta sync engine.
 *
 * The engine's resolveConflict choke-point delegates to a registry of policies
 * keyed by immediate field name. A policy is a function
 *   (value1, value2, context) -> resolved | undefined
 * that returns the resolved value (in delta wire format) or `undefined` to
 * defer to the engine's default Last-Write-Wins fallback.
 *
 * Policies operate on the delta wire format. A primitive leaf is
 * `{ __value, __type: 'primitive' }`. Helpers below unwrap/rewrap as needed.
 *
 * If either value is a deletion (`__deleted`) or not a primitive, the policy
 * should return `undefined` so the engine's existing tombstone / object /
 * array handling stays in charge.
 */

function isPrimitiveLeaf(v) {
  return v != null && typeof v === 'object' && v.__type === 'primitive';
}

function unwrap(v) {
  return isPrimitiveLeaf(v) ? v.__value : undefined;
}

function wrap(v) {
  if (typeof v === 'number' && !Number.isFinite(v)) {
    return { __value: 0, __type: 'primitive' };
  }
  return { __value: v, __type: 'primitive' };
}

function policyFor(numericFn) {
  return function policy(value1, value2, context) {
    if (!isPrimitiveLeaf(value1) || !isPrimitiveLeaf(value2)) return undefined;
    const a = unwrap(value1);
    const b = unwrap(value2);
    if (typeof a !== 'number' || typeof b !== 'number') return undefined;
    if (context && context.path) {
      // Hook for future per-path logging or telemetry.
    }
    return wrap(numericFn(a, b));
  };
}

const lastWriter = policyFor((_a, b) => b);

const minValue = policyFor((a, b) => Math.min(a, b));

const maxValue = policyFor((a, b) => Math.max(a, b));

function sumValue() {
  return policyFor((a, b) => a + b);
}

function clamped(min, max) {
  return policyFor((a, b) => {
    const pick = b;
    if (pick < min) return min;
    if (pick > max) return max;
    return pick;
  });
}

function boundedMin(min, max) {
  return policyFor((a, b) => {
    const pick = Math.min(a, b);
    if (pick < min) return min;
    if (pick > max) return max;
    return pick;
  });
}

function boundedMax(min, max) {
  return policyFor((a, b) => {
    const pick = Math.max(a, b);
    if (pick < min) return min;
    if (pick > max) return max;
    return pick;
  });
}

const DEFAULT_HEALTH_FIELDS = ['hp', 'health', 'currentHp', 'currentHealth'];
const DEFAULT_MANA_FIELDS = ['mp', 'mana', 'currentMp', 'currentMana'];
const DEFAULT_AP_FIELDS = ['ap', 'actionPoints', 'currentAp'];
const DEFAULT_AMMO_FIELDS = ['ammo', 'currentAmmo', 'rounds'];
const DEFAULT_XP_FIELDS = ['xp', 'experience', 'currentXp'];
const DEFAULT_POSITION_FIELDS = ['x', 'y'];

function defaultPolicies() {
  return {
    [DEFAULT_HEALTH_FIELDS[0]]: boundedMin(0, 99999),
    [DEFAULT_HEALTH_FIELDS[1]]: boundedMin(0, 99999),
    [DEFAULT_HEALTH_FIELDS[2]]: boundedMin(0, 99999),
    [DEFAULT_HEALTH_FIELDS[3]]: boundedMin(0, 99999),
    [DEFAULT_MANA_FIELDS[0]]: clamped(0, 99999),
    [DEFAULT_MANA_FIELDS[1]]: clamped(0, 99999),
    [DEFAULT_MANA_FIELDS[2]]: clamped(0, 99999),
    [DEFAULT_MANA_FIELDS[3]]: clamped(0, 99999),
    [DEFAULT_AP_FIELDS[0]]: boundedMax(0, 99),
    [DEFAULT_AP_FIELDS[1]]: boundedMax(0, 99),
    [DEFAULT_AP_FIELDS[2]]: boundedMax(0, 99),
    [DEFAULT_AMMO_FIELDS[0]]: minValue,
    [DEFAULT_AMMO_FIELDS[1]]: minValue,
    [DEFAULT_AMMO_FIELDS[2]]: minValue,
    [DEFAULT_XP_FIELDS[0]]: maxValue,
    [DEFAULT_XP_FIELDS[1]]: maxValue,
    [DEFAULT_XP_FIELDS[2]]: maxValue,
    [DEFAULT_POSITION_FIELDS[0]]: lastWriter,
    [DEFAULT_POSITION_FIELDS[1]]: lastWriter
  };
}

module.exports = {
  isPrimitiveLeaf,
  unwrap,
  wrap,
  lastWriter,
  minValue,
  maxValue,
  sumValue,
  clamped,
  boundedMin,
  boundedMax,
  defaultPolicies,
  DEFAULT_HEALTH_FIELDS,
  DEFAULT_MANA_FIELDS,
  DEFAULT_AP_FIELDS,
  DEFAULT_AMMO_FIELDS,
  DEFAULT_XP_FIELDS,
  DEFAULT_POSITION_FIELDS
};
