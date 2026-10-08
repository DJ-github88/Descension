/**
 * Project 5 Wave A (S4/D, corrected R7) — one account-handoff coordinator.
 *
 * Ordered transition on a verified principal/scope change:
 *
 *   gate private work -> stop new old-generation operations -> preserve pending
 *   work -> retire listeners/socket -> reset private projections -> advance
 *   generation -> activate destination
 *
 * Failure contract (fail closed):
 *  - thrown errors, rejected Promises and returned failure/clean:false results
 *    are all treated as failures
 *  - required pre-activation hooks are awaited with an explicit async contract
 *  - while a transition is pending, no destination scope is active
 *  - if any required retirement/reset fails, NO private scope is activated
 *    (the gate holds in loading with no scope) until a retry succeeds
 *  - stale/reentrant completions can never activate an obsolete principal
 */

import { deriveScopeFromAuthUser, scopesEqual } from '../scopeModel';
import {
  getBootstrapGateState,
  getBootstrapGateContext,
  retirePrivateScope,
  beginLoadingPhase,
  activatePrivateScope,
  clearToSignedOut,
  holdPrivateScopeForRetry
} from '../bootstrapPrivacyGate';
import { createRuntimeResetParticipant } from './runtimeResetParticipant';
import { createSocketRetirementParticipant } from './socketPrincipalRetirement';
import { installStorageInvalidationListener } from '../storageInvalidation';

export const HANDOFF_HOOKS = Object.freeze([
  'stopNewWork',
  'preservePendingWork',
  'retire',
  'resetProjection',
  'activate'
]);

const participants = new Map();
let defaultsRegistered = false;

let transitionSeq = 0;
let activeTransition = null;
let queuedAuthState = null;
let lastRequestedAuthState = null;
let lastHandoffResult = null;
const idleWaiters = new Set();

function sameScope(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return scopesEqual(a, b);
}

export function registerHandoffParticipant(participant) {
  if (!participant || typeof participant.id !== 'string' || participant.id.length === 0) {
    throw new Error('P5 handoff: participant requires a string id');
  }
  if (!HANDOFF_HOOKS.some((hook) => typeof participant[hook] === 'function')) {
    throw new Error(`P5 handoff: participant "${participant.id}" has no hooks`);
  }
  participants.set(participant.id, participant);
  return participant.id;
}

export function unregisterHandoffParticipant(participantId) {
  return participants.delete(participantId);
}

export function listHandoffParticipants() {
  return [...participants.values()].map((participant) => participant.id);
}

export function registerDefaultHandoffParticipants() {
  if (defaultsRegistered) return;
  defaultsRegistered = true;
  registerHandoffParticipant(createRuntimeResetParticipant());
  registerHandoffParticipant(createSocketRetirementParticipant());
  try {
    installStorageInvalidationListener();
  } catch (_error) {
    // invalidation listener is best-effort; never blocks handoff
  }
}

/** Test-only reset of participant registration and transition state. */
export function resetHandoffCoordinatorForTests() {
  participants.clear();
  defaultsRegistered = false;
  transitionSeq = 0;
  activeTransition = null;
  queuedAuthState = null;
  lastRequestedAuthState = null;
  lastHandoffResult = null;
  idleWaiters.clear();
}

function pushFailure(failures, participantId, hook, error) {
  failures.push({ participantId, hook, error: String(error) });
}

/** Interpret a participant hook result as failures, not only thrown errors. */
function collectHookFailures(participantId, hook, outcome, failures) {
  if (!outcome || typeof outcome !== 'object') return;
  let reported = false;
  if (Array.isArray(outcome.failures) && outcome.failures.length > 0) {
    outcome.failures.forEach((entry) => {
      reported = true;
      const reason = entry && typeof entry === 'object'
        ? (entry.reason || entry.error)
        : entry;
      pushFailure(failures, participantId, hook, reason || 'reported-failure');
    });
    if (outcome.clean === false && !reported) {
      pushFailure(failures, participantId, hook, 'reported-not-clean');
    }
    return;
  }
  if (outcome.clean === false) pushFailure(failures, participantId, hook, 'reported-not-clean');
  if (outcome.ok === false) pushFailure(failures, participantId, hook, outcome.reason || 'reported-not-ok');
  if (outcome.reset === false && outcome.reason) pushFailure(failures, participantId, hook, outcome.reason);
  if (Array.isArray(outcome.errors)) {
    outcome.errors.forEach((error) => pushFailure(failures, participantId, hook, error));
  }
}

/**
 * Run hooks sequentially against a fixed participant snapshot. Returns
 * `{ failures, completion }` where completion is null when every hook was
 * synchronous. Rejections are converted into failures. An external failures
 * array may be supplied so a multi-phase transition reports one combined set.
 */
function runHooks(hookNames, envelope, failures = []) {
  const steps = [];
  for (const hook of hookNames) {
    for (const participant of participants.values()) {
      if (typeof participant[hook] === 'function') {
        steps.push({ participant, hook });
      }
    }
  }
  let index = 0;

  const step = () => {
    while (index < steps.length) {
      const { participant, hook } = steps[index];
      index += 1;
      let outcome;
      try {
        outcome = participant[hook](envelope);
      } catch (error) {
        pushFailure(failures, participant.id, hook, error?.message || 'threw');
        continue;
      }
      if (outcome && typeof outcome.then === 'function') {
        return Promise.resolve(outcome).then(
          (resolved) => {
            collectHookFailures(participant.id, hook, resolved, failures);
            return step();
          },
          (error) => {
            pushFailure(failures, participant.id, hook, error?.message || 'rejected');
            return step();
          }
        );
      }
      collectHookFailures(participant.id, hook, outcome, failures);
    }
    return null;
  };

  const completion = step();
  return { failures, completion };
}

function notifyIfIdle() {
  if (activeTransition || queuedAuthState) return;
  const waiters = [...idleWaiters];
  idleWaiters.clear();
  waiters.forEach((resolve) => resolve(lastHandoffResult));
}

/** Resolves when no transition is pending or queued. */
export function whenHandoffIdle() {
  if (!activeTransition && !queuedAuthState) {
    return Promise.resolve(lastHandoffResult);
  }
  return new Promise((resolve) => idleWaiters.add(resolve));
}

function buildOutcome({ changed, gate, result }) {
  return { changed, gate, result };
}

function finalizeTransition({ id, nextScope, envelope, failures }) {
  if (id !== transitionSeq) {
    // Superseded while awaiting: never activate an obsolete principal.
    activeTransition = null;
    processQueuedTransition();
    return;
  }

  if (failures.length > 0) {
    // Fail closed: no private scope is active for the old or pending owner.
    const gate = holdPrivateScopeForRetry('handoff-retirement-failed');
    activeTransition = null;
    const result = {
      failures,
      projectionClean: false,
      blocked: true,
      previousScope: envelope.previousScope,
      nextScope,
      nextContext: getBootstrapGateContext()
    };
    lastHandoffResult = result;
    processQueuedTransition();
    return buildOutcome({ changed: true, gate, result });
  }

  const gate = nextScope ? activatePrivateScope(nextScope) : clearToSignedOut();
  const nextContext = getBootstrapGateContext();
  const { failures: activateFailures } = runHooks(['activate'], { ...envelope, nextContext });
  const result = {
    failures: activateFailures,
    projectionClean: true,
    blocked: false,
    previousScope: envelope.previousScope,
    nextScope,
    nextContext
  };
  lastHandoffResult = result;
  activeTransition = null;
  processQueuedTransition();
  return buildOutcome({ changed: true, gate, result });
}

function processQueuedTransition() {
  if (queuedAuthState !== null) {
    const queued = queuedAuthState;
    queuedAuthState = null;
    const outcome = coordinateAuthPrincipalChange(queued);
    if (outcome && outcome.completion && typeof outcome.completion.then === 'function') {
      outcome.completion.then(() => notifyIfIdle(), () => notifyIfIdle());
      return;
    }
  }
  notifyIfIdle();
}

function startTransition({ id, nextScope, currentScope, previousGate }) {
  activeTransition = { id, nextScope };

  const envelope = {
    previousScope: currentScope,
    nextScope,
    previousGeneration: previousGate.accountGeneration
  };
  const failures = [];

  const retireOldScope = () => {
    if (currentScope) {
      retirePrivateScope();
    } else {
      beginLoadingPhase();
    }
  };

  const finish = () => finalizeTransition({ id, nextScope, envelope, failures });

  // Phase 1: stop/flush while the old scope is still active, so queued
  // captured scoped writes can still land under their originating owner
  // instead of being refused by the retirement gate and lost.
  const { completion: stopCompletion } = runHooks(['stopNewWork'], envelope, failures);

  const afterStop = () => {
    // Phase 2: retire the old principal, then run the remaining required
    // hooks against the blocked/retired gate.
    retireOldScope();
    const { completion: restCompletion } = runHooks(
      ['preservePendingWork', 'retire', 'resetProjection'],
      envelope,
      failures
    );
    if (restCompletion) return restCompletion.then(finish, finish);
    return finish();
  };

  if (!stopCompletion) {
    const result = afterStop();
    if (result && typeof result.then === 'function') {
      return { changed: true, deferred: true, gate: getBootstrapGateState(), result: null, completion: result };
    }
    return result;
  }

  const promise = stopCompletion.then(afterStop, afterStop);
  return { changed: true, deferred: true, gate: getBootstrapGateState(), result: null, completion: promise };
}

/**
 * Detect and execute a principal handoff. Same active principal is a no-op
 * (no generation bump, no participant churn). A retry after a blocked
 * transition is simply the next call with the pending auth state.
 */
export function coordinateAuthPrincipalChange(authState = {}) {
  const nextScope = deriveScopeFromAuthUser(authState);
  const gate = getBootstrapGateState();
  const currentScope = gate.scope;
  lastRequestedAuthState = authState;

  if (gate.phase === 'active' && sameScope(currentScope, nextScope)) {
    lastHandoffResult = {
      failures: [],
      projectionClean: true,
      blocked: false,
      previousScope: currentScope,
      nextScope,
      nextContext: getBootstrapGateContext()
    };
    return buildOutcome({
      changed: false,
      gate,
      result: lastHandoffResult
    });
  }

  if (activeTransition) {
    // Supersede the in-flight transition; only the newest request may activate.
    transitionSeq += 1;
    queuedAuthState = authState;
    return { changed: true, deferred: true, gate: getBootstrapGateState(), result: null };
  }

  const id = transitionSeq + 1;
  transitionSeq = id;
  return startTransition({ id, nextScope, currentScope, previousGate: gate });
}

/** Current handoff status for retry surfaces / diagnostics. */
export function getHandoffStatus() {
  const gate = getBootstrapGateState();
  return {
    holdReason: gate.holdReason ?? null,
    phase: gate.phase,
    activeScope: gate.scope,
    transitionPending: !!activeTransition,
    queued: queuedAuthState !== null,
    lastResult: lastHandoffResult
  };
}

/**
 * Retry the last blocked transition (or the last requested auth state).
 * Safe to call repeatedly; participants are idempotent and serialized.
 */
export function retryPendingHandoff() {
  if (lastRequestedAuthState === null) {
    return { changed: false, gate: getBootstrapGateState(), result: lastHandoffResult };
  }
  return coordinateAuthPrincipalChange(lastRequestedAuthState);
}
