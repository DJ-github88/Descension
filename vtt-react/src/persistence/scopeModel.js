/**
 * Project 5 — scope identity model (Slice 1).
 *
 * Frozen architecture: Option 1 — named localStorage scopes + bounded campaign
 * CAS. Private drafts belong to exactly one scope:
 *
 *   user  : scopeId = verified Firebase UID (never persisted JSON identity)
 *   guest : stable local guest namespace, independent of the anonymous
 *           Firebase UID (which changes between guest sessions)
 *   dev   : explicit development-only namespace
 *
 * Business IDs (campaignId/roomId/characterId/imported IDs) are never scope
 * proof. See docs: Project 5 architecture freeze review.
 */

export const SCOPE_KINDS = Object.freeze({
  USER: 'user',
  GUEST: 'guest',
  DEV: 'dev'
});

export const ALL_SCOPE_KINDS = Object.freeze([
  SCOPE_KINDS.USER,
  SCOPE_KINDS.GUEST,
  SCOPE_KINDS.DEV
]);

/**
 * Stable device-local guest namespace. Slice 1 freezes this constant so guest
 * drafts survive anonymous UID churn. It must never be derived from a Firebase
 * UID and never silently promoted to a user scope.
 */
export const GUEST_SCOPE_ID = 'local-guest';

/** Explicit development-only namespace. */
export const DEV_SCOPE_ID = 'local-dev';

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * Create a verified user scope. Callers must supply the UID from the verified
 * auth principal (auth.currentUser.uid / socket-verified identity), never from
 * persisted JSON payloads.
 *
 * @param {string} verifiedUid
 * @returns {{ scopeKind: string, scopeId: string }}
 */
export function createUserScope(verifiedUid) {
  if (!isNonEmptyString(verifiedUid)) {
    throw new Error('P5 scope: a verified non-empty UID is required for a user scope');
  }
  return Object.freeze({ scopeKind: SCOPE_KINDS.USER, scopeId: verifiedUid });
}

/** Stable guest scope for device-local guest drafts. */
export function guestScope() {
  return Object.freeze({ scopeKind: SCOPE_KINDS.GUEST, scopeId: GUEST_SCOPE_ID });
}

/** Explicit development / bypass scope. */
export function devScope() {
  return Object.freeze({ scopeKind: SCOPE_KINDS.DEV, scopeId: DEV_SCOPE_ID });
}

/**
 * Validate a scope shape. Returns { ok, reason }.
 *
 * @param {unknown} scope
 */
export function validateScope(scope) {
  if (!scope || typeof scope !== 'object') {
    return { ok: false, reason: 'scope-not-object' };
  }
  if (!ALL_SCOPE_KINDS.includes(scope.scopeKind)) {
    return { ok: false, reason: `scope-kind-invalid:${String(scope.scopeKind)}` };
  }
  if (!isNonEmptyString(scope.scopeId)) {
    return { ok: false, reason: 'scope-id-invalid' };
  }
  if (scope.scopeKind === SCOPE_KINDS.GUEST && scope.scopeId !== GUEST_SCOPE_ID) {
    return { ok: false, reason: 'guest-scope-must-use-stable-namespace' };
  }
  if (scope.scopeKind === SCOPE_KINDS.DEV && scope.scopeId !== DEV_SCOPE_ID) {
    return { ok: false, reason: 'dev-scope-must-use-dev-namespace' };
  }
  return { ok: true, reason: null };
}

/** @returns {boolean} */
export function isValidScope(scope) {
  return validateScope(scope).ok;
}

/** Ordered comparison of two scopes. */
export function scopesEqual(a, b) {
  return !!a && !!b && a.scopeKind === b.scopeKind && a.scopeId === b.scopeId;
}

/** Canonical string form used inside scoped keys. */
export function scopeKeyOf(scope) {
  const validation = validateScope(scope);
  if (!validation.ok) {
    throw new Error(`P5 scope: ${validation.reason}`);
  }
  return `${scope.scopeKind}:${scope.scopeId}`;
}

/**
 * Derive the current P5 scope from auth store state.
 *
 * - explicit dev/admin bypass state -> dev scope
 * - guest wrapper user (`isGuest`) or raw anonymous Firebase user
 *   (`isAnonymous`) -> the single stable guest scope
 * - verified user with a UID -> user scope
 * - otherwise no active principal (signed out / boot)
 *
 * This is the only sanctioned bridge between auth state and P5 scopes.
 *
 * @param {{ user?: object|null, isDevelopmentBypass?: boolean, isAdminBypass?: boolean }} [authState]
 * @returns {{ scopeKind: string, scopeId: string } | null}
 */
export function deriveScopeFromAuthUser(authState = {}) {
  const { user, isDevelopmentBypass, isAdminBypass } = authState;

  if (isDevelopmentBypass || isAdminBypass) {
    return devScope();
  }
  if (user && typeof user === 'object') {
    if (user.isGuest || user.isAnonymous) {
      return guestScope();
    }
    if (isNonEmptyString(user.uid)) {
      return createUserScope(user.uid);
    }
  }
  return null;
}
