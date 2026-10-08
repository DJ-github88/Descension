/**
 * Project 5 — scoped key construction (Slice 1).
 *
 * Canonical key format:
 *
 *   mythrill:p5:user:<uid>:<familyId>[:<segment>...]
 *   mythrill:p5:guest:<familyId>[:<segment>...]
 *   mythrill:p5:dev:<familyId>[:<segment>...]
 *
 * Properties:
 *  - deterministic and explicit about owner scope and family identity
 *  - the `mythrill:p5:` prefix can never collide with any current legacy raw
 *    key (`mythrill-*`, `mythrill_*`, store keys, session keys, ...)
 *  - segments are encoded so `:` and other reserved characters cannot create
 *    ambiguous or colliding keys
 *  - key building NEVER reads global selected room/campaign/character state;
 *    every identity input is an explicit argument
 */

import { SCOPE_KINDS, validateScope } from './scopeModel';

export const P5_KEY_PREFIX = 'mythrill:p5:';

const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

/**
 * Deterministic, collision-safe segment encoding.
 *
 * Segments that already match the safe character set are stored verbatim
 * (readable keys). Everything else is percent-encoded, which is injective and
 * can never collide with a verbatim segment (percent-encoded output for the
 * unsafe branch contains `%` or unreserved characters outside the safe set).
 */
export function encodeSegment(segment) {
  if (typeof segment === 'number') {
    if (!Number.isSafeInteger(segment)) {
      throw new Error(`P5 key: numeric segment must be a safe integer (${segment})`);
    }
    return String(segment);
  }
  if (typeof segment !== 'string' || segment.length === 0) {
    throw new Error('P5 key: segments must be non-empty strings or safe integers');
  }
  if (SAFE_SEGMENT.test(segment)) {
    return segment;
  }
  return encodeURIComponent(segment);
}

function assertFamilyId(familyId) {
  if (typeof familyId !== 'string' || !SAFE_SEGMENT.test(familyId)) {
    throw new Error(`P5 key: invalid familyId "${String(familyId)}"`);
  }
}

/**
 * Build a scoped key.
 *
 * @param {{
 *   scope: { scopeKind: string, scopeId: string },
 *   familyId: string,
 *   locator?: Array<string|number>
 * }} input
 * @returns {string}
 */
export function buildScopedKey({ scope, familyId, locator = [] } = {}) {
  const scopeValidation = validateScope(scope);
  if (!scopeValidation.ok) {
    throw new Error(`P5 key: ${scopeValidation.reason}`);
  }
  assertFamilyId(familyId);
  if (!Array.isArray(locator)) {
    throw new Error('P5 key: locator must be an array');
  }

  const scopePart = scope.scopeKind === SCOPE_KINDS.USER
    ? `${SCOPE_KINDS.USER}:${encodeSegment(scope.scopeId)}`
    : scope.scopeKind;

  const encodedSegments = locator
    .map((segment) => `:${encodeSegment(segment)}`)
    .join('');

  return `${P5_KEY_PREFIX}${scopePart}:${familyId}${encodedSegments}`;
}

/** @returns {boolean} whether a raw key belongs to the P5 scoped namespace. */
export function isP5ScopedKey(key) {
  return typeof key === 'string' && key.startsWith(P5_KEY_PREFIX);
}

/**
 * Parse a P5 scoped key back into its identity parts. Returns null for
 * non-P5 keys or malformed keys.
 *
 * @param {string} key
 * @returns {{ scopeKind: string, scopeId: string|null, familyId: string, segments: string[] } | null}
 */
export function parseP5ScopedKey(key) {
  if (!isP5ScopedKey(key)) return null;
  const rest = key.slice(P5_KEY_PREFIX.length);
  const parts = rest.split(':');
  const scopeKind = parts[0];
  if (!Object.values(SCOPE_KINDS).includes(scopeKind)) return null;

  // Builder layout:
  //   user:  user : <uid> : <familyId> [: locator...]
  //   guest: guest : <familyId> [: locator...]
  //   dev:   dev : <familyId> [: locator...]
  // Every component must be non-empty; a malformed/ambiguous key is rejected
  // rather than mis-parsed into another scope or family.
  if (parts.some((part) => part.length === 0)) return null;

  if (scopeKind === SCOPE_KINDS.USER) {
    if (parts.length < 3) return null;
    const [, scopeIdToken, familyId, ...segments] = parts;
    if (!scopeIdToken || !familyId) return null;
    return {
      scopeKind,
      scopeId: decodeSegment(scopeIdToken),
      familyId,
      segments: segments.map(decodeSegment)
    };
  }

  if (parts.length < 2) return null;
  const [, familyId, ...segments] = parts;
  if (!familyId) return null;
  return {
    scopeKind,
    scopeId: null,
    familyId,
    segments: segments.map(decodeSegment)
  };
}

function decodeSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch (_error) {
    return segment;
  }
}

/**
 * Legacy keys (pre-P5) never occupy the scoped namespace. This guard is used
 * by tests and later migration slices to prove the successor format cannot
 * collide with a given legacy key.
 */
export function isLegacyKey(key) {
  return typeof key === 'string' && key.length > 0 && !isP5ScopedKey(key);
}
