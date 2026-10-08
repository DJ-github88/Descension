/**
 * Project 5 — account context foundation (Slice 1).
 *
 * Frozen context shape later slices use for handoff generation fencing:
 *
 *   { scopeKind, scopeId, accountGeneration, documentInstanceId, phase }
 *
 * Slice 1 defines validators, immutable capture helpers and comparison
 * helpers. It does NOT yet enforce the context across existing callbacks —
 * that is the later handoff-coordinator slice. No private async primitive
 * introduced in this slice may accept only a raw UID where the full context
 * is available.
 */

import { validateScope, scopesEqual } from './scopeModel';

export const ACCOUNT_PHASES = Object.freeze({
  BOOT: 'boot',
  ACTIVE: 'active',
  RETIRING: 'retiring',
  LOADING: 'loading',
  SIGNED_OUT: 'signed-out'
});

const PHASE_VALUES = Object.freeze(Object.values(ACCOUNT_PHASES));

const isSafeGeneration = (value) =>
  Number.isSafeInteger(value) && value >= 0;

const isNullableString = (value) =>
  value === null || value === undefined || typeof value === 'string';

/**
 * Validate an account context. Returns { ok, reason }.
 *
 * Phase rules:
 *  - boot / signed-out  : scope must be absent
 *  - active / retiring  : scope must be valid
 *  - loading            : scope may be absent or valid (destination loading)
 */
export function validateAccountContext(context) {
  if (!context || typeof context !== 'object') {
    return { ok: false, reason: 'context-not-object' };
  }
  if (!PHASE_VALUES.includes(context.phase)) {
    return { ok: false, reason: `context-phase-invalid:${String(context.phase)}` };
  }
  if (!isSafeGeneration(context.accountGeneration)) {
    return { ok: false, reason: 'context-generation-invalid' };
  }
  if (!isNullableString(context.documentInstanceId)) {
    return { ok: false, reason: 'context-document-instance-invalid' };
  }

  const hasScope = context.scope !== null && context.scope !== undefined;
  if (hasScope) {
    const scopeValidation = validateScope(context.scope);
    if (!scopeValidation.ok) {
      return { ok: false, reason: `context-${scopeValidation.reason}` };
    }
  }
  if ((context.phase === ACCOUNT_PHASES.ACTIVE || context.phase === ACCOUNT_PHASES.RETIRING) && !hasScope) {
    return { ok: false, reason: 'context-scope-required-for-phase' };
  }
  if ((context.phase === ACCOUNT_PHASES.BOOT || context.phase === ACCOUNT_PHASES.SIGNED_OUT) && hasScope) {
    return { ok: false, reason: 'context-scope-forbidden-for-phase' };
  }
  return { ok: true, reason: null };
}

/**
 * Create an immutable account context.
 *
 * @param {{
 *   scope?: object|null,
 *   phase: string,
 *   accountGeneration?: number,
 *   documentInstanceId?: string|null
 * }} input
 */
export function createAccountContext(input = {}) {
  const context = {
    scope: input.scope ?? null,
    phase: input.phase,
    accountGeneration: input.accountGeneration ?? 0,
    documentInstanceId: input.documentInstanceId ?? null
  };
  const validation = validateAccountContext(context);
  if (!validation.ok) {
    throw new Error(`P5 account context: ${validation.reason}`);
  }
  return Object.freeze({
    ...context,
    scope: context.scope ? Object.freeze({ ...context.scope }) : null
  });
}

/**
 * Capture an immutable snapshot of a context for later equality checks.
 * Pure copy — safe to hold across awaits.
 */
export function captureAccountContext(context) {
  const validation = validateAccountContext(context);
  if (!validation.ok) {
    throw new Error(`P5 account context: ${validation.reason}`);
  }
  return createAccountContext(context);
}

/**
 * Operation identity comparison: scope + generation + document instance.
 * Phase transitions (active <-> retiring) do not change operation identity.
 */
export function isSameOperationContext(captured, current) {
  if (!captured || !current) return false;
  if (captured.accountGeneration !== current.accountGeneration) return false;
  if ((captured.documentInstanceId ?? null) !== (current.documentInstanceId ?? null)) return false;
  const capturedScope = captured.scope ?? null;
  const currentScope = current.scope ?? null;
  if (!capturedScope || !currentScope) return capturedScope === currentScope;
  return scopesEqual(capturedScope, currentScope);
}

/** Full equality including phase. */
export function contextsEqual(a, b) {
  return (
    isSameOperationContext(a, b) &&
    !!a && !!b && a.phase === b.phase
  );
}

/**
 * Assert that a previously captured operation context is still current.
 * Returns { ok, reason }.
 */
export function assertSameOperationContext(captured, current) {
  if (!captured) return { ok: false, reason: 'no-captured-context' };
  if (!current) return { ok: false, reason: 'no-current-context' };
  if (!isSameOperationContext(captured, current)) {
    return { ok: false, reason: 'context-generation-or-scope-changed' };
  }
  return { ok: true, reason: null };
}
