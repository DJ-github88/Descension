/**
 * Project 5 — bootstrap privacy gate (Slice 1).
 *
 * Central primitive for the frozen rule: before a verified destination scope
 * is activated, registered private scoped data must NOT automatically hydrate
 * into visible private working state. Public/bundled defaults are unaffected.
 *
 * Slice 1:
 *  - owns the gate state and account-context shape
 *  - gates every new P5 read-for-hydration and scoped write API
 *  - is bound to the auth principal through authBootstrapGateBinding
 *  - does NOT yet enforce the context across existing legacy hydration paths;
 *    those are registered implementation backlog for later slices
 */

import { validateScope, scopesEqual } from './scopeModel';
import { ACCOUNT_PHASES, createAccountContext } from './accountContext';

const INITIAL_STATE = Object.freeze({
  phase: ACCOUNT_PHASES.BOOT,
  scope: null,
  accountGeneration: 0,
  documentInstanceId: null,
  holdReason: null,
  handoffPending: false
});

let state = { ...INITIAL_STATE };
const listeners = new Set();

function notify() {
  const snapshot = getBootstrapGateState();
  for (const listener of listeners) {
    try {
      listener(snapshot);
    } catch (_error) {
      // Gate listeners must never break the caller.
    }
  }
}

function setState(next) {
  state = { ...next };
  notify();
}

/** @returns frozen snapshot of the gate state. */
export function getBootstrapGateState() {
  return Object.freeze({
    phase: state.phase,
    scope: state.scope ? Object.freeze({ ...state.scope }) : null,
    accountGeneration: state.accountGeneration,
    documentInstanceId: state.documentInstanceId,
    holdReason: state.holdReason ?? null,
    handoffPending: state.handoffPending === true
  });
}

/** Account-context representation of the current gate state. */
export function getBootstrapGateContext() {
  const snapshot = getBootstrapGateState();
  return createAccountContext({
    scope: snapshot.scope,
    phase: snapshot.phase,
    accountGeneration: snapshot.accountGeneration,
    documentInstanceId: snapshot.documentInstanceId
  });
}

export function subscribeBootstrapGate(listener) {
  if (typeof listener !== 'function') return () => {};
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Activate a verified destination private scope. A principal change (or a
 * fresh activation after sign-out) advances the account generation. Repeated
 * activation of the same principal keeps the generation stable so ordinary
 * token refreshes do not invalidate in-flight draft work.
 */
export function activatePrivateScope(scope, { documentInstanceId = null } = {}) {
  const validation = validateScope(scope);
  if (!validation.ok) {
    throw new Error(`P5 bootstrap gate: ${validation.reason}`);
  }
  const samePrincipalActive =
    state.phase === ACCOUNT_PHASES.ACTIVE &&
    state.scope &&
    scopesEqual(state.scope, scope);
  const generation = samePrincipalActive
    ? state.accountGeneration
    : state.accountGeneration + 1;
  setState({
    phase: ACCOUNT_PHASES.ACTIVE,
    scope: { ...scope },
    accountGeneration: generation,
    documentInstanceId: documentInstanceId ?? null,
    holdReason: null
  });
  return getBootstrapGateState();
}

/**
 * Same-principal reload (keeps scope and generation; blocks hydration while
 * the destination is loading).
 */
export function beginLoadingPhase() {
  setState({ ...state, phase: ACCOUNT_PHASES.LOADING, holdReason: null });
  return getBootstrapGateState();
}

/**
 * Wave A R7 fail-closed hold: a required retirement/reset failed, so NO
 * private scope is active (hydration and private scoped work are blocked for
 * the old and the pending owner) until a retry succeeds. The pending principal
 * itself is retained by the handoff coordinator, not here.
 */
export function holdPrivateScopeForRetry(reason = 'handoff-retry-required') {
  setState({
    phase: ACCOUNT_PHASES.LOADING,
    scope: null,
    accountGeneration: state.accountGeneration,
    documentInstanceId: null,
    holdReason: reason
  });
  return getBootstrapGateState();
}

/** Begin retiring the previous principal. Hydration is blocked immediately. */
export function retirePrivateScope() {
  if (!state.scope) return getBootstrapGateState();
  setState({ ...state, phase: ACCOUNT_PHASES.RETIRING });
  return getBootstrapGateState();
}

/** Signed out / no private principal. Advances generation when leaving a scope. */
export function clearToSignedOut() {
  if (state.phase === ACCOUNT_PHASES.SIGNED_OUT && !state.scope) {
    return getBootstrapGateState();
  }
  setState({
    phase: ACCOUNT_PHASES.SIGNED_OUT,
    scope: null,
    accountGeneration: state.accountGeneration + 1,
    documentInstanceId: null,
    holdReason: null
  });
  return getBootstrapGateState();
}

/** True only for the active, matching destination scope. */
export function canHydratePrivateScopedData(scope) {
  if (!scope) return false;
  return state.phase === ACCOUNT_PHASES.ACTIVE && !!state.scope && scopesEqual(state.scope, scope);
}

/** Writes require the same active, matching destination scope. */
export function canWritePrivateScopedData(scope) {
  return canHydratePrivateScopedData(scope);
}

/**
 * Mark that a principal handoff is in progress. The old scope may remain
 * active (so already-captured writes can still be preserved), but every
 * private projection must stay isolated from the new authenticated principal
 * until the transition completes or fails closed.
 */
export function markHandoffPending(pending) {
  const next = pending === true;
  if (state.handoffPending === next) return getBootstrapGateState();
  setState({ ...state, handoffPending: next });
  return getBootstrapGateState();
}

/** @returns {{ ok: boolean, reason: string|null }} */
export function assertPrivateHydrationAllowed(scope) {
  if (!scope) return { ok: false, reason: 'no-requested-scope' };
  if (state.phase !== ACCOUNT_PHASES.ACTIVE) {
    return { ok: false, reason: `gate-phase:${state.phase}` };
  }
  if (!state.scope || !scopesEqual(state.scope, scope)) {
    return { ok: false, reason: 'gate-scope-mismatch' };
  }
  return { ok: true, reason: null };
}

/** Test-only reset; never used by production code. */
export function resetBootstrapGateForTests() {
  state = { ...INITIAL_STATE };
  listeners.clear();
}
