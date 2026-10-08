/**
 * Project 5 Wave A (S3/B7) — storage invalidation layer.
 *
 * Storage events are INVALIDATION SIGNALS, not locks and not hydration
 * permission. This module only parses scoped-key events and notifies
 * subscribers. It never reads, writes, hydrates or saves.
 *
 * Consumers must:
 *  - ignore events for other scopes
 *  - invalidate a stale baseline for the affected family/resource
 *  - never overwrite dirty working state on an event
 */

import { isP5ScopedKey, parseP5ScopedKey } from './keyFormat';

const listeners = new Set();
let installed = false;
let installedTarget = null;
let installedHandler = null;

export function parseScopedStorageKey(rawKey) {
  if (!isP5ScopedKey(rawKey)) return null;
  const parsed = parseP5ScopedKey(rawKey);
  if (!parsed) return null;
  return {
    rawKey,
    scopeKind: parsed.scopeKind,
    scopeId: parsed.scopeId,
    familyId: parsed.familyId,
    locator: parsed.segments
  };
}

/** True only for the active scope; A-scope events are irrelevant to B. */
export function isRelevantToScope(identity, scope) {
  if (!identity || !scope) return false;
  if (identity.scopeKind !== scope.scopeKind) return false;
  if (identity.scopeKind === 'guest' || identity.scopeKind === 'dev') return true;
  return identity.scopeId === scope.scopeId;
}

/** True when the event affects exactly this family (+ optional resource). */
export function isRelevantToResource(identity, familyId, resource = null) {
  if (!identity || identity.familyId !== familyId) return false;
  if (resource === null || resource === undefined) return true;
  return (identity.locator || []).join('/') === resource;
}

export function subscribeStorageInvalidation(listener) {
  if (typeof listener !== 'function') return () => {};
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyStorageInvalidation(identity, meta = {}) {
  for (const listener of listeners) {
    try {
      listener(identity, meta);
    } catch (_error) {
      // invalidation listeners must never break the event path
    }
  }
}

/** Pure parse+notify; performs no storage access of any kind. */
export function handleStorageEvent(event) {
  if (!event || typeof event.key !== 'string') return null;
  const identity = parseScopedStorageKey(event.key);
  if (!identity) return null;
  notifyStorageInvalidation(identity, { newValuePresent: typeof event.newValue === 'string' });
  return identity;
}

export function installStorageInvalidationListener(target = null) {
  const resolvedTarget = target || (typeof window !== 'undefined' ? window : null);
  if (!resolvedTarget || typeof resolvedTarget.addEventListener !== 'function') {
    return () => {};
  }
  if (installed && installedTarget === resolvedTarget) {
    return () => uninstallStorageInvalidationListener();
  }
  const handler = (event) => handleStorageEvent(event);
  resolvedTarget.addEventListener('storage', handler);
  installed = true;
  installedTarget = resolvedTarget;
  installedHandler = handler;
  return () => uninstallStorageInvalidationListener();
}

export function uninstallStorageInvalidationListener() {
  if (installed && installedTarget && installedHandler) {
    try {
      installedTarget.removeEventListener('storage', installedHandler);
    } catch (_error) {
      // ignore
    }
  }
  installed = false;
  installedTarget = null;
  installedHandler = null;
}

export function resetStorageInvalidationForTests() {
  uninstallStorageInvalidationListener();
  listeners.clear();
}
