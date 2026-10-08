/**
 * Project 5 — auth principal → bootstrap gate binding (Slice 1 + Wave A S4).
 *
 * The only sanctioned bridge between auth state and the P5 bootstrap privacy
 * gate. Wave A routes principal changes through the account-handoff
 * coordinator so old work is stopped/retired/reset and the destination scope
 * is activated with a new generation before any private UI hydrates.
 */

import { deriveScopeFromAuthUser, scopesEqual } from './scopeModel';
import {
  activatePrivateScope,
  clearToSignedOut,
  getBootstrapGateState
} from './bootstrapPrivacyGate';
import {
  coordinateAuthPrincipalChange,
  registerDefaultHandoffParticipants
} from './handoff/accountHandoffCoordinator';

registerDefaultHandoffParticipants();

export { registerDefaultHandoffParticipants };
export {
  getHandoffStatus,
  retryPendingHandoff,
  whenHandoffIdle
} from './handoff/accountHandoffCoordinator';

/**
 * Sync the gate/handoff coordinator with an auth state snapshot.
 * Same principal keeps the generation stable; a different principal or a
 * fresh sign-in runs the handoff sequence and advances the generation.
 *
 * Kept as the Slice 1-compatible entry point; returns the gate snapshot.
 */
export function syncBootstrapGateWithAuthState(authState = {}) {
  if (!authState || typeof authState !== 'object') {
    return getBootstrapGateState();
  }
  const outcome = coordinateAuthPrincipalChange(authState);
  return outcome.gate;
}

/**
 * Direct (participant-free) gate sync, preserved for callers that only need
 * scope/generation mapping without running the participant sequence.
 */
export function syncGateScopeOnly(authState = {}) {
  const scope = deriveScopeFromAuthUser(authState);
  const gate = getBootstrapGateState();
  if (!scope) {
    clearToSignedOut();
    return getBootstrapGateState();
  }
  const sameActivePrincipal = gate.phase === 'active' && gate.scope && scopesEqual(gate.scope, scope);
  if (sameActivePrincipal) return gate;
  activatePrivateScope(scope);
  return getBootstrapGateState();
}

/**
 * Subscribe a Zustand-style store to the gate. Returns an unsubscribe
 * function. Safe to call with a missing/incomplete store (no-op).
 */
export function installAuthBootstrapGate(store) {
  if (!store || typeof store.subscribe !== 'function' || typeof store.getState !== 'function') {
    return () => {};
  }
  const sync = () => {
    const state = store.getState() || {};
    syncBootstrapGateWithAuthState({
      user: state.user,
      isDevelopmentBypass: state.isDevelopmentBypass,
      isAdminBypass: state.isAdminBypass
    });
  };
  sync();
  return store.subscribe(sync);
}
