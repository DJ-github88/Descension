/**
 * Project 4 — Common Room Access Service
 *
 * Narrow, shared P4 access mechanics only:
 * - verified UID/provider eligibility (H2)
 * - owning-GM / durable-membership checks
 * - admission classification and real-Map capacity
 * - durable entitlement grant/revoke
 * - outbound room / player / character / game-state privacy projections
 * - stable denial codes
 *
 * This is deliberately NOT a gameplay service and does not know about RPG
 * rules, tokens or inventory contents beyond redacting private outbound data.
 */



const { DEFAULT_MAX_PLAYERS } = require('../utils/constants');
const { roomAuthorityDenial } = require('./roomAuthorityService');

const DENIAL_CODES = Object.freeze({
  NOT_AUTHENTICATED: 'not_authenticated',
  ACCOUNT_REQUIRED: 'account_required',
  ROOM_UNAVAILABLE: 'room_unavailable',
  NOT_ROOM_MEMBER: 'not_room_member',
  GM_REQUIRED: 'gm_required',
  OWNER_REQUIRED: 'owner_required',
  OWNER_RECOVERY_REQUIRED: 'owner_recovery_required',
  INVALID_PASSWORD: 'invalid_password',
  CAPACITY_REACHED: 'capacity_reached',
  MEMBERSHIP_PERSISTENCE_FAILED: 'membership_persistence_failed',
  MEMBERSHIP_COMPENSATION_REQUIRED: 'membership_compensation_required',
  MEMBERSHIP_COMPENSATION_PERSISTENCE_FAILED: 'membership_compensation_persistence_failed',
  MEMBERSHIP_COMPENSATION_UNAVAILABLE: 'membership_compensation_unavailable',
  INVITATION_INVALID: 'invitation_invalid',
  INVITATION_WRONG_RECIPIENT: 'invitation_wrong_recipient',
  INVITATION_EXPIRED: 'invitation_expired',
  INVITATION_CONSUMED: 'invitation_consumed',
  INVITATION_REVOKED: 'invitation_revoked',
  INVITATION_REISSUE_REQUIRED: 'invitation_reissue_required',
  TOKEN_CONTROL_REQUIRED: 'token_control_required',
  PROTECTED_FIELD: 'protected_field',
  PRIVATE_DATA_FORBIDDEN: 'private_data_forbidden',
  SHARE_CONSENT_REQUIRED: 'share_consent_required',
  ROOM_AUTHORITY_BUSY: 'room_authority_busy',
  ROOM_AUTHORITY_UNAVAILABLE: 'room_authority_unavailable',
  ROOM_AUTHORITY_LOST: 'room_authority_lost',
  ROOM_DELETED: 'room_deleted'
});

// Fields that are never part of an outbound shared character projection.
// Raw stores/checkpoints keep them; only delivery is redacted.
const PRIVATE_CHARACTER_KEYS = Object.freeze([
  'inventory',
  'currency',
  'carriedItems',
  'containers',
  'backpack',
  'privateNotes',
  'gmNotes',
  'userId'
]);

// ---------------------------------------------------------------------------
// Identity eligibility (H2)
// ---------------------------------------------------------------------------

function getVerifiedUserId(socket) {
  const uid = socket && socket.data ? socket.data.userId : null;
  return typeof uid === 'string' && uid.length > 0 ? uid : null;
}

function isAuthenticatedIdentity(socket) {
  return !!(socket && socket.data && socket.data.authenticated === true && getVerifiedUserId(socket));
}

function getSignInProvider(socket) {
  return (socket && socket.data && socket.data.signInProvider) || null;
}

const KNOWN_SIGN_IN_PROVIDERS = new Set([
  'password',
  'google.com',
  'github.com',
  'facebook.com',
  'twitter.com',
  'apple.com',
  'microsoft.com',
  'yahoo.com',
  'phone',
  'custom',
  'saml',
  'oidc'
]);

function isKnownSignInProvider(socket) {
  const provider = getSignInProvider(socket);
  return typeof provider === 'string' && KNOWN_SIGN_IN_PROVIDERS.has(provider);
}

function isAnonymousIdentity(socket) {
  return getSignInProvider(socket) === 'anonymous';
}

/**
 * H2: durable cloud rooms and durable account operations require a normal
 * non-anonymous verified account. Missing/unknown provider information fails
 * closed. Synthetic guest identities are never durable authority.
 */
function isDurableAccount(socket) {
  if (!isAuthenticatedIdentity(socket)) {return false;}
  if (socket.data.isGuest === true) {return false;}
  if (!isKnownSignInProvider(socket)) {return false;}
  return !isAnonymousIdentity(socket);
}

/**
 * Durable-account principal gate. Returns { allowed, code }.
 * Missing/unknown provider fails closed with account_required.
 */
function checkDurableRoomIdentity(socket) {
  if (!isAuthenticatedIdentity(socket)) {
    return { allowed: false, code: DENIAL_CODES.NOT_AUTHENTICATED };
  }
  if (socket.data.isGuest === true || !isKnownSignInProvider(socket) || isAnonymousIdentity(socket)) {
    return { allowed: false, code: DENIAL_CODES.ACCOUNT_REQUIRED };
  }
  return { allowed: true, code: null };
}

// ---------------------------------------------------------------------------
// Ownership / membership
// ---------------------------------------------------------------------------

function isValidOwnerId(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isOwningGm(room, userId) {
  return !!room && isValidOwnerId(room.gmId) && !!userId && room.gmId === userId;
}

function isDurableMember(room, userId) {
  return !!room && !!userId && Array.isArray(room.members) && room.members.includes(userId);
}

function isEntitled(room, userId) {
  return isOwningGm(room, userId) || isDurableMember(room, userId);
}

/**
 * "Unowned legacy room": a room whose authoritative owner id is missing or
 * invalid. Must never be assigned to a caller.
 */
function hasProvableOwner(room) {
  return !!room && isValidOwnerId(room.gmId);
}

// ---------------------------------------------------------------------------
// Admission classification + capacity
// ---------------------------------------------------------------------------

const ADMISSION = Object.freeze({
  OWNER_RESUME: 'owner_resume',
  MEMBER_RECONNECT: 'member_reconnect',
  NEW_ADMISSION: 'new_admission'
});

function classifyAdmission(room, userId) {
  if (!room || !userId) {return null;}
  if (isOwningGm(room, userId)) {return ADMISSION.OWNER_RESUME;}
  if (isDurableMember(room, userId)) {return ADMISSION.MEMBER_RECONNECT;}
  if (room.disconnectedPlayers && room.disconnectedPlayers[userId]) {return ADMISSION.MEMBER_RECONNECT;}
  return ADMISSION.NEW_ADMISSION;
}

/**
 * Capacity counts active, verified non-GM member UIDs. Multiple devices for
 * one UID occupy one slot. GM is excluded. Players without a verified UID
 * (legacy in-memory presence) still occupy one slot each so a room cannot be
 * overbooked. room.players is a Map.
 */
function countActiveMemberSlots(room) {
  if (!room || !room.players || typeof room.players.values !== 'function') {return 0;}
  const uids = new Set();
  let uidless = 0;
  for (const player of room.players.values()) {
    if (!player || player.isGM) {continue;}
    if (player.userId) {
      uids.add(player.userId);
    } else {
      uidless += 1;
    }
  }
  return uids.size + uidless;
}

function getRoomMaxPlayers(room) {
  const configured = room && room.settings ? Number(room.settings.maxPlayers) : NaN;
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_MAX_PLAYERS;
}

function checkCapacity(room, userAlreadyPresent) {
  const maxPlayers = getRoomMaxPlayers(room);
  const current = countActiveMemberSlots(room);
  if (!userAlreadyPresent && current >= maxPlayers) {
    return { allowed: false, code: DENIAL_CODES.CAPACITY_REACHED, current, maxPlayers };
  }
  return { allowed: true, code: null, current, maxPlayers };
}

// ---------------------------------------------------------------------------
// Per-room serialized admission gate
// ---------------------------------------------------------------------------

const admissionLocks = new Map();

function withRoomAdmissionLock(roomId, task) {
  const previous = admissionLocks.get(roomId) || Promise.resolve();
  const run = previous.then(() => task(), () => task());
  const guard = run.then(() => undefined, () => undefined);
  admissionLocks.set(roomId, guard);
  guard.then(() => {
    if (admissionLocks.get(roomId) === guard) {admissionLocks.delete(roomId);}
  });
  return run;
}

// ---------------------------------------------------------------------------
// Durable entitlement (rooms/{roomId}.members UID array)
// ---------------------------------------------------------------------------

function getAccessGeneration(room) {
  return room && Number.isSafeInteger(room.accessGeneration) ? room.accessGeneration : 0;
}

function bumpAccessGeneration(room) {
  room.accessGeneration = getAccessGeneration(room) + 1;
  return room.accessGeneration;
}

/**
 * Persist a durable UID membership before any runtime side effect.
 * Returns { ok, persisted, code, compensationId }. `persisted` is true only
 * when THIS call created the durable entitlement (used for exact rollback).
 *
 * C3: a NEW durable membership is created atomically together with a durable
 * `pending_admission` recovery record, so durable membership can never exist
 * without durable recovery intent until admission is fully finalized.
 */
async function grantMembership(firebaseService, room, userId, authorityToken = null) {
  if (!room || !userId) {return { ok: false, persisted: false, code: DENIAL_CODES.NOT_ROOM_MEMBER, compensationId: null };}
  if (!room.isPermanent) {return { ok: true, persisted: false, code: null, compensationId: null };}
  if (!Array.isArray(room.members)) {room.members = [];}
  if (room.members.includes(userId) || isOwningGm(room, userId)) {
    return { ok: true, persisted: false, code: null, compensationId: null };
  }
  if (!authorityToken) {
    // R1: durable membership requires the pinned current authority.
    return { ok: false, persisted: false, code: DENIAL_CODES.ROOM_AUTHORITY_LOST, compensationId: null };
  }
  if (!firebaseService || typeof firebaseService.addRoomMember !== 'function') {
    return { ok: false, persisted: false, code: DENIAL_CODES.MEMBERSHIP_PERSISTENCE_FAILED, compensationId: null };
  }
  const result = await firebaseService.addRoomMember(room.id, userId, {
    authority: authorityToken,
    recoveryIntent: true
  });
  if (!result || result.ok !== true) {
    return { ok: false, persisted: false, code: DENIAL_CODES.MEMBERSHIP_PERSISTENCE_FAILED, compensationId: null };
  }
  room.members = Array.from(new Set([...room.members, userId]));
  return {
    ok: true,
    persisted: true,
    code: null,
    compensationId: typeof result.compensationId === 'string' && result.compensationId.length > 0
      ? result.compensationId
      : null
  };
}

/**
 * Cloud-first revocation: local entitlement is only removed after the durable
 * removal is confirmed, so a failed cloud revocation leaves local authority
 * consistent. Callers holding the admission lock use revokeMembershipUnlocked.
 */
async function revokeMembershipUnlocked(firebaseService, room, userId, authorityToken = null) {
  if (!room || !userId) {return { ok: false, code: DENIAL_CODES.NOT_ROOM_MEMBER };}
  if (!room.isPermanent) {
    if (Array.isArray(room.members)) {
      room.members = room.members.filter((memberId) => memberId !== userId);
    }
    bumpAccessGeneration(room);
    return { ok: true, persisted: false, code: null };
  }
  if (!authorityToken) {
    // R1: a fenced/stale lifecycle cannot mutate durable membership.
    return { ok: false, persisted: false, code: DENIAL_CODES.ROOM_AUTHORITY_LOST };
  }
  if (!firebaseService || typeof firebaseService.removeRoomMember !== 'function') {
    return { ok: false, persisted: false, code: DENIAL_CODES.MEMBERSHIP_PERSISTENCE_FAILED };
  }
  const result = await firebaseService.removeRoomMember(room.id, userId, { authority: authorityToken });
  if (!result || result.ok !== true) {
    return { ok: false, persisted: false, code: DENIAL_CODES.MEMBERSHIP_PERSISTENCE_FAILED };
  }
  if (Array.isArray(room.members)) {
    room.members = room.members.filter((memberId) => memberId !== userId);
  }
  bumpAccessGeneration(room);
  return { ok: true, persisted: true, code: null };
}

async function revokeMembership(firebaseService, room, userId, authorityService = null) {
  if (!room || !userId) {return { ok: false, code: DENIAL_CODES.NOT_ROOM_MEMBER };}
  if (room.isPermanent && (!authorityService || typeof authorityService.currentToken !== 'function')) {
    return { ok: false, code: DENIAL_CODES.ROOM_AUTHORITY_LOST };
  }
  const authorityToken = authorityService && typeof authorityService.currentToken === 'function'
    ? authorityService.currentToken(room.id)
    : null;
  if (room.isPermanent && !authorityToken) {
    return { ok: false, code: DENIAL_CODES.ROOM_AUTHORITY_LOST };
  }
  return withRoomAdmissionLock(room.id, () => revokeMembershipUnlocked(firebaseService, room, userId, authorityToken));
}

// ---------------------------------------------------------------------------
// Failed admission-rollback compensation (B10)
//
// If a durable grant was created for an admission that then failed its final
// eligibility check, and the compensating revoke also fails, the entitlement
// must not be silently forgotten. It is recorded here (bounded), retried on
// later admissions, and counted. It is never reported as a clean rollback.
// ---------------------------------------------------------------------------

const MEMBERSHIP_COMPENSATION_LIMIT = 200;
const membershipCompensations = new Map(); // `${roomId}\u0000${userId}` -> entry (in-process mirror)

function getMembershipCompensationLimit() {
  const configured = Number(process.env.MEMBERSHIP_COMPENSATION_LIMIT);
  return Number.isSafeInteger(configured) && configured > 0 ? configured : MEMBERSHIP_COMPENSATION_LIMIT;
}

function mirrorCompensationEntry(roomId, userId, compensationId = null, attempts = 1) {
  const key = `${roomId}\u0000${userId}`;
  const existing = membershipCompensations.get(key);
  if (existing) {
    existing.attempts += 1;
    existing.updatedAt = Date.now();
    if (compensationId) {existing.compensationId = compensationId;}
    return existing;
  }
  const entry = {
    roomId,
    userId,
    compensationId: compensationId || null,
    state: 'pending_admission',
    attempts,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  membershipCompensations.set(key, entry);
  return entry;
}

/**
 * Record one failed-rollback obligation through the legacy non-atomic adapter
 * path (used only when the atomic grant+intent mechanism is unavailable). The
 * durable record is the source of truth across restarts; the in-process mirror
 * keeps bounded accounting when the cloud write is unavailable.
 * @returns {Promise<{durable: boolean, compensationId: string|null}>}
 */
async function recordMembershipCompensation(firebaseService, roomId, userId, details = {}) {
  if (!firebaseService || typeof firebaseService.recordMembershipCompensation !== 'function') {
    mirrorCompensationEntry(roomId, userId);
    return { durable: false, compensationId: null };
  }
  try {
    const result = await firebaseService.recordMembershipCompensation(roomId, userId, details);
    if (result && result.ok === true) {
      const compensationId = result.compensationId || null;
      mirrorCompensationEntry(roomId, userId, compensationId);
      return { durable: true, compensationId };
    }
    mirrorCompensationEntry(roomId, userId);
    return { durable: false, compensationId: null };
  } catch (_error) {
    mirrorCompensationEntry(roomId, userId);
    return { durable: false, compensationId: null };
  }
}

/**
 * Load unresolved obligations (durable store unioned with the in-process
 * mirror). The durable store is the source of truth across restarts; the
 * mirror keeps bounded accounting when the cloud write is unavailable.
 * Discovery failure is explicit and never collapsed to "no obligations".
 * @returns {Promise<{ok: true, entries: Array<Object>}|{ok: false, code: string}>}
 */
async function loadPendingCompensations(firebaseService, roomId = null) {
  const merged = new Map();
  const mergeEntry = (entry) => {
    if (!entry || typeof entry.roomId !== 'string' || typeof entry.userId !== 'string') {return;}
    const key = `${entry.roomId}\u0000${entry.userId}`;
    merged.set(key, entry);
    if (!membershipCompensations.has(key)) {
      membershipCompensations.set(key, {
        roomId: entry.roomId,
        userId: entry.userId,
        compensationId: entry.compensationId || null,
        attempts: Number.isFinite(entry.attempts) ? entry.attempts : 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
  };
  if (firebaseService && typeof firebaseService.listMembershipCompensations === 'function') {
    let listed;
    try {
      listed = await firebaseService.listMembershipCompensations(roomId);
    } catch (_error) {
      return { ok: false, code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE };
    }
    if (Array.isArray(listed)) {
      // Legacy/degraded adapter shape: an explicit empty array means no
      // obligations; only a thrown or explicit failure result is discovery
      // failure.
      for (const entry of listed) {mergeEntry(entry);}
    } else if (listed && listed.ok === true && Array.isArray(listed.entries)) {
      for (const entry of listed.entries) {mergeEntry(entry);}
    } else {
      return {
        ok: false,
        code: (listed && listed.code) || DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE
      };
    }
  }
  for (const [key, entry] of membershipCompensations) {
    if (roomId !== null && entry.roomId !== roomId) {continue;}
    if (!merged.has(key)) {
      merged.set(key, {
        roomId: entry.roomId,
        userId: entry.userId,
        compensationId: entry.compensationId || null,
        reason: 'membership_rollback_failed',
        attempts: entry.attempts
      });
    }
  }
  return { ok: true, entries: Array.from(merged.values()) };
}

/**
 * Best-effort bounded retry of pending failed-rollback compensations for one
 * room (or all rooms when no filter is given). Only a lifecycle that currently
 * holds a token is attempted; anything else stays pending (accounted, never
 * forgotten). The exact originating runtime/token is retained through the
 * durable revoke await; local reconciliation only touches that runtime. The
 * journal entry is cleared conditionally on the exact fulfilled obligation and
 * is retained whenever clearing is not confirmed. Never throws.
 *
 * `ok` reports only that the recovery pass executed without an infrastructure
 * error. It is NOT a statement that every obligation is resolved. Callers that
 * use membership for authorization MUST additionally require that this user is
 * absent from `unresolved` (or re-load pending state) before granting any
 * membership-based exemption.
 * @returns {Promise<{pending: number, cleared: number, ok: boolean, code: string|null, unresolved: Array<{roomId: string, userId: string}>}>}
 */
async function retryMembershipCompensations(firebaseService, authorityService, roomId = null, rooms = null) {
  let cleared = 0;
  const unresolved = [];
  if (!firebaseService || typeof firebaseService.removeRoomMember !== 'function' ||
    !authorityService || typeof authorityService.currentToken !== 'function') {
    return {
      pending: membershipCompensations.size,
      cleared,
      ok: false,
      code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE,
      unresolved
    };
  }
  const listed = await loadPendingCompensations(firebaseService, roomId);
  if (!listed.ok) {
    return { pending: membershipCompensations.size, cleared, ok: false, code: listed.code, unresolved };
  }
  for (const entry of listed.entries) {
    const retryToken = authorityService.currentToken(entry.roomId);
    if (!retryToken) {
      unresolved.push({ roomId: entry.roomId, userId: entry.userId });
      continue;
    }
    const runtimeRoom = rooms && typeof rooms.get === 'function' ? rooms.get(entry.roomId) : null;
    let result;
    try {
      result = await firebaseService.removeRoomMember(entry.roomId, entry.userId, { authority: retryToken });
    } catch (_error) {
      result = { ok: false };
    }
    if (!result || result.ok !== true) {
      unresolved.push({ roomId: entry.roomId, userId: entry.userId });
      continue;
    }

    // C3: fresh backend proof of the CAPTURED retry token after the durable
    // revoke. An expired or replaced lifecycle must not reconcile local state
    // or clear the obligation; the current holder resumes idempotently.
    if (typeof authorityService.assertSettle === 'function') {
      const fresh = await authorityService.assertSettle(retryToken, { backendCheck: true });
      if (!fresh || fresh.ok !== true) {
        unresolved.push({ roomId: entry.roomId, userId: entry.userId });
        continue;
      }
    } else {
      const currentToken = authorityService.currentToken(entry.roomId);
      if (!currentToken ||
        currentToken.authorityInstanceId !== retryToken.authorityInstanceId ||
        currentToken.authorityGeneration !== retryToken.authorityGeneration) {
        unresolved.push({ roomId: entry.roomId, userId: entry.userId });
        continue;
      }
    }

    // C3: only the exact captured runtime may be reconciled locally; a
    // replacement runtime is never mutated through a stale continuation.
    if (runtimeRoom && rooms.get(entry.roomId) === runtimeRoom &&
      Array.isArray(runtimeRoom.members) && runtimeRoom.members.includes(entry.userId)) {
      runtimeRoom.members = runtimeRoom.members.filter((memberId) => memberId !== entry.userId);
      bumpAccessGeneration(runtimeRoom);
    }

    // C3: clear only the exact obligation that was fulfilled, at the backend
    // commit boundary, under the same captured authority. A failed, replaced
    // or identity-less clear retains the obligation for later retry.
    let clearResult = { ok: true, cleared: true };
    if (typeof firebaseService.clearMembershipCompensation === 'function') {
      try {
        clearResult = await firebaseService.clearMembershipCompensation(
          entry.roomId, entry.userId,
          { compensationId: entry.compensationId || null, authority: retryToken }
        );
      } catch (_error) {
        clearResult = { ok: false, code: 'compensation_clear_failed' };
      }
    }
    if (clearResult && clearResult.ok === true) {
      membershipCompensations.delete(`${entry.roomId}\u0000${entry.userId}`);
      cleared += 1;
      continue;
    }
    if (clearResult && clearResult.code === 'membership_compensation_missing') {
      // The obligation was already resolved by another current holder; the
      // corrective membership state is satisfied and nothing remains to clear.
      membershipCompensations.delete(`${entry.roomId}\u0000${entry.userId}`);
      cleared += 1;
      continue;
    }
    unresolved.push({ roomId: entry.roomId, userId: entry.userId });
  }
  return { pending: membershipCompensations.size, cleared, ok: true, code: null, unresolved };
}

function getMembershipCompensationStats() {
  return {
    pending: membershipCompensations.size,
    attempts: Array.from(membershipCompensations.values()).reduce((sum, entry) => sum + entry.attempts, 0)
  };
}

// ---------------------------------------------------------------------------
// Outbound privacy projections
// ---------------------------------------------------------------------------

// Positive allowlist of shared character presentation. Everything else
// (inventory, currency, private notes, account identifiers, unknown blobs and
// private asset URLs) is dropped at the outbound boundary only.
const SHARED_CHARACTER_FIELDS = Object.freeze([
  'id', 'name', 'class', 'race', 'subrace', 'raceDisplayName', 'level',
  'health', 'mana', 'actionPoints',
  'tempHealth', 'tempMana', 'tempActionPoints', 'exhaustionLevel',
  'classResource', 'stats', 'equipment', 'alignment', 'background',
  'damageReduction', 'durability', 'movementSpeed', 'resistances', 'immunities',
  'racialTraits', 'tokenSettings', 'isPlayerToken', 'playerId'
]);

// Shared scalar fields are copied only when they hold a scalar value.
const SHARED_CHARACTER_SCALAR_FIELDS = new Set([
  'id', 'name', 'class', 'race', 'subrace', 'raceDisplayName', 'level',
  'tempHealth', 'tempMana', 'tempActionPoints', 'exhaustionLevel',
  'alignment', 'background', 'damageReduction', 'durability', 'movementSpeed',
  'isPlayerToken', 'playerId'
]);

// Actual supported public stat keys. Arbitrary stats.* keys (including nested
// blobs such as stats.inventory or stats.secretBlob) never pass.
const SUPPORTED_STAT_KEYS = Object.freeze([
  'strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'
]);

const RESOURCE_PAIR_KEYS = Object.freeze(['health', 'mana', 'actionPoints']);

const CLASS_RESOURCE_SCALAR_KEYS = Object.freeze([
  'type', 'current', 'max', 'phase', 'threshold', 'charges', 'strain', 'risk', 'lastUpdate'
]);
const CLASS_RESOURCE_PRIMITIVE_ARRAY_KEYS = Object.freeze(['stacks', 'slots', 'spheres', 'activeEffects']);

const RESISTANCE_DAMAGE_TYPES = Object.freeze([
  'fire', 'frost', 'lightning', 'force', 'necrotic', 'radiant', 'poison',
  'psychic', 'bludgeoning', 'piercing', 'slashing'
]);

const APPROVED_ASSET_PREFIXES = ['/assets/', 'assets/', '/system-assets/', 'system-assets', 'shared/', 'data:'];

/**
 * Only approved public/shared/built-in asset references may be projected.
 * B14: the accepted representation is an explicit canonical STRING reference.
 * Objects/arrays/numbers and unknown relative paths are dropped - an asset
 * field can never become arbitrary JSON transport, and private bearer URLs
 * fall back to the built-in default.
 */
function projectAssetReference(value) {
  if (typeof value !== 'string' || value.length === 0) {return null;}
  if (APPROVED_ASSET_PREFIXES.some((prefix) => value.startsWith(prefix))) {return value;}
  return null;
}

// Asset-bearing keys route through the canonical asset projector; private
// bearer/download URLs are dropped so consumers use the built-in fallback.
const ASSET_KEYS = Object.freeze(['image', 'imageUrl', 'avatar', 'portrait', 'customIcon', 'thumbnail', 'icon', 'tokenIcon', 'tokenBorder']);

// Positive token-settings schema: only known presentation keys pass.
const SUPPORTED_TOKEN_SETTINGS_KEYS = Object.freeze([
  'borderColor', 'backgroundColor', 'color', 'customIcon', 'image', 'imageUrl', 'avatar'
]);

function projectTokenSettings(settings) {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    return null;
  }
  const out = {};
  for (const key of SUPPORTED_TOKEN_SETTINGS_KEYS) {
    if (!(key in settings)) {continue;}
    const value = settings[key];
    if (ASSET_KEYS.includes(key)) {
      const projected = projectAssetReference(value);
      if (projected !== null) {out[key] = projected;}
      continue;
    }
    if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value;
    }
  }
  return out;
}

// B13: explicit positive equipment schema. Modern per-slot equipment and the
// legacy weapon/armor/shield/accessories representation are supported; every
// item is rebuilt from supported public fields only (never shallow-spread).
const EQUIPMENT_SLOT_KEYS = Object.freeze([
  'head', 'neck', 'shoulders', 'back', 'chest', 'shirt', 'tabard', 'wrists',
  'mainHand', 'offHand', 'ranged', 'trinket1', 'trinket2', 'ring1', 'ring2',
  'feet', 'legs', 'waist', 'gloves'
]);
const EQUIPMENT_LEGACY_ITEM_KEYS = Object.freeze(['weapon', 'armor', 'shield']);
const EQUIPMENT_ITEM_SCALAR_KEYS = Object.freeze([
  'id', 'name', 'type', 'slot', 'description', 'quantity', 'weight', 'value',
  'rarity', 'equipped', 'attuned', 'charges', 'maxCharges', 'armorClass',
  'armor', 'damage', 'twoHanded', 'versatile', 'category', 'subtype',
  'material', 'quality', 'proficiency', 'isConsumable', 'isStackable', 'level', 'school'
]);
const EQUIPMENT_ITEM_ASSET_KEYS = Object.freeze([
  'image', 'imageUrl', 'icon', 'avatar', 'portrait', 'customIcon'
]);
const EQUIPMENT_ITEM_PRIMITIVE_ARRAY_KEYS = Object.freeze(['properties', 'tags', 'keywords', 'effects']);
const EQUIPMENT_ITEM_RECORD_KEYS = Object.freeze(['damage', 'armor']);

// C4A: explicit positive schemas for the nested damage/armor records the
// client actually consumes. Unknown keys (including private blobs and
// asset-like bearer fields such as damage.image) never pass.
const EQUIPMENT_DAMAGE_RECORD_KEYS = Object.freeze([
  'dice', 'diceString', 'type', 'value', 'isPercentage', 'bonus',
  'diceCount', 'diceType', 'damageType'
]);
const EQUIPMENT_ARMOR_RECORD_KEYS = Object.freeze([
  'value', 'isPercentage', 'armorClass', 'type'
]);

/**
 * Positive scalar projection for one known nested equipment record. Only the
 * approved keys survive; every unknown key is dropped.
 */
function projectKnownScalarRecord(value, approvedKeys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {return null;}
  const out = {};
  for (const key of approvedKeys) {
    if (key in value && isScalarValue(value[key])) {out[key] = value[key];}
  }
  return Object.keys(out).length > 0 ? out : null;
}

function projectEquipmentItem(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {return null;}
  const out = {};
  for (const key of EQUIPMENT_ITEM_SCALAR_KEYS) {
    if (key in item && isScalarValue(item[key])) {out[key] = item[key];}
  }
  for (const key of EQUIPMENT_ITEM_ASSET_KEYS) {
    if (!(key in item)) {continue;}
    const projected = projectAssetReference(item[key]);
    if (projected !== null) {out[key] = projected;}
  }
  for (const key of EQUIPMENT_ITEM_PRIMITIVE_ARRAY_KEYS) {
    const projected = projectPrimitiveArray(item[key]);
    if (projected !== null && projected.length > 0) {out[key] = projected;}
  }
  if ('stats' in item) {
    const stats = projectStatsForClient(item.stats);
    if (stats !== null) {out.stats = stats;}
  }
  for (const key of EQUIPMENT_ITEM_RECORD_KEYS) {
    if (key in item && typeof item[key] === 'object' && item[key] !== null) {
      const record = projectKnownScalarRecord(
        item[key],
        key === 'damage' ? EQUIPMENT_DAMAGE_RECORD_KEYS : EQUIPMENT_ARMOR_RECORD_KEYS
      );
      if (record !== null) {out[key] = record;}
    }
  }
  return out;
}

function projectEquipmentForClient(equipment) {
  if (!equipment || typeof equipment !== 'object') {return equipment === undefined ? null : null;}
  if (Array.isArray(equipment)) {
    return equipment.map(projectEquipmentItem).filter((item) => item !== null);
  }
  const out = {};
  for (const key of EQUIPMENT_SLOT_KEYS) {
    if (!(key in equipment)) {continue;}
    if (equipment[key] === null || equipment[key] === undefined) {out[key] = null; continue;}
    const projected = projectEquipmentItem(equipment[key]);
    if (projected !== null) {out[key] = projected;}
  }
  for (const key of EQUIPMENT_LEGACY_ITEM_KEYS) {
    if (!(key in equipment)) {continue;}
    if (equipment[key] === null || equipment[key] === undefined) {out[key] = null; continue;}
    const projected = projectEquipmentItem(equipment[key]);
    if (projected !== null) {out[key] = projected;}
  }
  if (Array.isArray(equipment.accessories)) {
    out.accessories = equipment.accessories.map(projectEquipmentItem).filter((item) => item !== null);
  }
  return out;
}

/**
 * Positive typed stats projection: only explicitly supported scalar stat keys
 * pass. Unknown keys and all nested structures (stats.inventory,
 * stats.secretBlob, ...) are dropped.
 */
function projectStatsForClient(stats) {
  if (!stats || typeof stats !== 'object' || Array.isArray(stats)) {
    return null;
  }
  const out = {};
  for (const key of SUPPORTED_STAT_KEYS) {
    if (!(key in stats)) {continue;}
    const value = stats[key];
    if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value;
    }
  }
  return out;
}

const isScalarValue = (value) => value === null ||
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

function projectResourcePair(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {return null;}
  const out = {};
  for (const key of ['current', 'max']) {
    if (key in value && isScalarValue(value[key])) {out[key] = value[key];}
  }
  return Object.keys(out).length > 0 ? out : null;
}

function projectClassResource(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {return null;}
  const out = {};
  for (const key of CLASS_RESOURCE_SCALAR_KEYS) {
    if (key in value && isScalarValue(value[key])) {out[key] = value[key];}
  }
  for (const key of CLASS_RESOURCE_PRIMITIVE_ARRAY_KEYS) {
    if (!Array.isArray(value[key])) {continue;}
    const filtered = value[key].filter(isScalarValue);
    if (filtered.length > 0) {out[key] = filtered;}
  }
  return out;
}

function projectResistancesForClient(resistances) {
  if (!resistances || typeof resistances !== 'object' || Array.isArray(resistances)) {return null;}
  const out = {};
  for (const damageType of RESISTANCE_DAMAGE_TYPES) {
    if (!(damageType in resistances)) {continue;}
    const entry = resistances[damageType];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {continue;}
    const projected = {};
    for (const key of ['level', 'multiplier']) {
      if (key in entry && isScalarValue(entry[key])) {projected[key] = entry[key];}
    }
    if (typeof entry.icon === 'string') {
      const icon = projectAssetReference(entry.icon);
      if (icon !== null) {projected.icon = icon;}
    }
    out[damageType] = projected;
  }
  return out;
}

function projectPrimitiveArray(value) {
  if (!Array.isArray(value)) {return null;}
  return value.filter(isScalarValue);
}

function projectCharacterForClient(character) {
  if (!character || typeof character !== 'object' || Array.isArray(character)) {
    return null;
  }
  const out = {};
  for (const key of SHARED_CHARACTER_FIELDS) {
    if (!(key in character)) {continue;}
    const value = character[key];
    if (SHARED_CHARACTER_SCALAR_FIELDS.has(key)) {
      if (isScalarValue(value)) {out[key] = value;}
      continue;
    }
    if (RESOURCE_PAIR_KEYS.includes(key)) {
      const projected = projectResourcePair(value);
      if (projected !== null) {out[key] = projected;}
      continue;
    }
    if (key === 'classResource') {
      const projected = projectClassResource(value);
      if (projected !== null) {out[key] = projected;}
      continue;
    }
    if (key === 'stats') {
      const projected = projectStatsForClient(value);
      if (projected !== null) {out[key] = projected;}
      continue;
    }
    if (key === 'equipment') {
      out[key] = projectEquipmentForClient(value);
      continue;
    }
    if (key === 'resistances') {
      const projected = projectResistancesForClient(value);
      if (projected !== null) {out[key] = projected;}
      continue;
    }
    if (key === 'tokenSettings') {
      out[key] = projectTokenSettings(value);
      continue;
    }
    if (key === 'immunities' || key === 'racialTraits') {
      const projected = projectPrimitiveArray(value);
      if (projected !== null) {out[key] = projected;}
      continue;
    }
    // No other structured shared field is supported: drop it.
  }
  return out;
}

function projectPlayerForClient(player) {
  if (!player || typeof player !== 'object') {return player === undefined ? null : player;}
  const out = {
    id: player.id,
    name: player.name,
    isGM: !!player.isGM,
    color: player.color,
    roomId: player.roomId,
    currentMapId: player.currentMapId,
    userId: player.userId || null
  };
  if (player.character) {out.character = projectCharacterForClient(player.character);}
  return out;
}

function projectPlayersForClient(playersSource) {
  const out = [];
  if (!playersSource) {return out;}
  const iterable = typeof playersSource.values === 'function' ? playersSource.values() : playersSource;
  for (const player of iterable) {out.push(projectPlayerForClient(player));}
  return out;
}

// Supported root token keys. Unknown keys (including unknown nested objects,
// alternate asset keys and secret blobs) are dropped at the outbound boundary.
const SUPPORTED_TOKEN_KEYS = Object.freeze([
  'id', 'name', 'position', 'velocity', 'lastMoved', 'updatedAt', 'createdAt', 'addedAt',
  'state', 'character', 'creatureId', 'targetMapId', 'mapId', 'isPlayerToken',
  'ownerUserId', 'ownerId', 'ownerPlayerId', 'playerId',
  'conditions', 'customName', 'x', 'y'
]);

// Supported state-update scalar keys.
const SUPPORTED_STATE_SCALAR_KEYS = Object.freeze([
  'currentHp', 'currentMana', 'currentActionPoints',
  'tempHealth', 'tempMana', 'tempActionPoints',
  'hp', 'customName', 'iconScale', 'lastModified', 'isHidden', 'locked', 'elevation', 'rotation'
]);

// Supported condition fields; condition icons route through the asset projector.
const SUPPORTED_CONDITION_KEYS = Object.freeze([
  'id', 'name', 'icon', 'color', 'description', 'type', 'appliedAt',
  'duration', 'durationType', 'durationValue', 'stacks', 'source'
]);

function projectPosition(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {return null;}
  const out = {};
  for (const key of ['x', 'y']) {
    if (typeof value[key] === 'number' && Number.isFinite(value[key])) {out[key] = value[key];}
  }
  return Object.keys(out).length > 0 ? out : null;
}

function projectCondition(condition) {
  if (!condition || typeof condition !== 'object' || Array.isArray(condition)) {return null;}
  const out = {};
  for (const key of SUPPORTED_CONDITION_KEYS) {
    if (!(key in condition)) {continue;}
    const value = condition[key];
    if (key === 'icon') {
      const icon = projectAssetReference(value);
      if (icon !== null) {out.icon = icon;}
      continue;
    }
    if (isScalarValue(value)) {out[key] = value;}
  }
  return Object.keys(out).length > 0 ? out : null;
}

function projectConditions(value) {
  if (!Array.isArray(value)) {return null;}
  return value.map(projectCondition).filter((entry) => entry !== null);
}

/**
 * R8.4/R10: positive outbound projection for state updates. Only explicitly
 * supported state fields pass. Unknown nested blobs (inventory, currency,
 * account/profile data, private asset references, secret markers) disappear.
 */
function projectStateUpdates(updates) {
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {return {};}
  const out = {};
  for (const key of SUPPORTED_STATE_SCALAR_KEYS) {
    if (!(key in updates)) {continue;}
    const value = updates[key];
    if (isScalarValue(value)) {out[key] = value;}
  }
  if ('conditions' in updates) {
    const conditions = projectConditions(updates.conditions);
    if (conditions !== null) {out.conditions = conditions;}
  }
  if ('iconPosition' in updates) {
    const position = projectPosition(updates.iconPosition);
    if (position !== null) {out.iconPosition = position;}
  }
  for (const assetKey of ASSET_KEYS) {
    if (!(assetKey in updates)) {continue;}
    const projected = projectAssetReference(updates[assetKey]);
    if (projected !== null) {out[assetKey] = projected;}
  }
  return out;
}

/**
 * Positive token projection. Only supported keys pass; asset-bearing keys are
 * routed through the canonical asset projector and private bearer URLs fall
 * back to null. Raw stored tokens are never mutated.
 */
function projectTokenCharacter(token) {
  if (!token || typeof token !== 'object' || Array.isArray(token)) {return null;}
  const out = {};
  for (const key of SUPPORTED_TOKEN_KEYS) {
    if (!(key in token)) {continue;}
    const value = token[key];
    if (key === 'position' || key === 'velocity') {
      const projected = projectPosition(value);
      if (projected !== null) {out[key] = projected;}
      continue;
    }
    if (key === 'state') {
      out.state = projectStateUpdates(value);
      continue;
    }
    if (key === 'conditions') {
      const projected = projectConditions(value);
      if (projected !== null) {out.conditions = projected;}
      continue;
    }
    if (key === 'character') {
      out.character = projectCharacterForClient(value);
      continue;
    }
    if (isScalarValue(value)) {out[key] = value;}
  }
  for (const assetKey of ASSET_KEYS) {
    if (!(assetKey in token)) {continue;}
    const projected = projectAssetReference(token[assetKey]);
    if (projected !== null) {out[assetKey] = projected;}
  }
  return out;
}

/**
 * Positive projection for a token/creature UPDATE payload. Combines the
 * supported structural token keys with the supported state-update keys so
 * legitimate state deltas (currentHp, conditions, ...) survive while unknown
 * nested blobs and private asset references are dropped.
 */
function projectTokenUpdateForClient(updates) {
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {return {};}
  const out = { ...projectTokenCharacter(updates) };
  const stateShape = projectStateUpdates(updates);
  for (const [key, value] of Object.entries(stateShape)) {
    if (!(key in out)) {out[key] = value;}
  }
  return out;
}

function projectTokenDictionary(tokens) {
  if (!tokens || typeof tokens !== 'object') {return tokens;}
  const out = {};
  for (const [tokenId, token] of Object.entries(tokens)) {
    out[tokenId] = projectTokenCharacter(token);
  }
  return out;
}

/**
 * Redact private player/character data from an outbound shared game-state
 * projection. Raw stored/checkpoint data is never mutated.
 */
function projectGameStateForClient(gameState) {
  if (!gameState || typeof gameState !== 'object') {return gameState === undefined ? null : gameState;}
  const out = { ...gameState };

  if (out.characters && typeof out.characters === 'object') {
    const characters = {};
    for (const [characterId, character] of Object.entries(out.characters)) {
      characters[characterId] = projectCharacterForClient(character);
    }
    out.characters = characters;
  }

  if (out.characterTokens && typeof out.characterTokens === 'object') {
    out.characterTokens = projectTokenDictionary(out.characterTokens);
  }
  if (out.tokens && typeof out.tokens === 'object') {
    out.tokens = projectTokenDictionary(out.tokens);
  }
  if (out.creatures && typeof out.creatures === 'object') {
    out.creatures = projectTokenDictionary(out.creatures);
  }

  if (out.maps && typeof out.maps === 'object') {
    const maps = {};
    for (const [mapId, map] of Object.entries(out.maps)) {
      maps[mapId] = projectMapDataForClient(map);
    }
    out.maps = maps;
  }

  // C4: root mapData is ALWAYS replaced by the positive projection. Any
  // unexpected type (array/string/number/boolean/function) is dropped, never
  // passed through raw.
  if ('mapData' in out) {
    const rootMapData = projectRootMapDataForClient(out.mapData);
    if (rootMapData === null) {
      delete out.mapData;
    } else {
      out.mapData = rootMapData;
    }
  }

  // Legacy root inventory container: keep shared spatial dropped items only.
  if (out.inventory && typeof out.inventory === 'object' && !Array.isArray(out.inventory)) {
    if ('droppedItems' in out.inventory) {
      out.inventory = { droppedItems: out.inventory.droppedItems };
    } else {
      delete out.inventory;
    }
  }

  return out;
}

/**
 * B15: explicit positive map-record schema. Unknown caller-supplied fields
 * (secretBlob, inventory, account/profile data, arbitrary nested payloads)
 * never reach a shared client. Entity dictionaries pass their projectors;
 * unsupported map fields are dropped.
 */
const SUPPORTED_MAP_KEYS = Object.freeze([
  'id', 'name', 'tokens', 'characterTokens', 'creatures', 'gridItems',
  'terrainData', 'wallData', 'windowOverlays', 'drawingPaths', 'drawingLayers',
  'fogOfWarData', 'fogOfWarPaths', 'fogErasePaths', 'exploredAreas',
  'environmentalObjects', 'lightSources', 'backgrounds', 'activeBackgroundId',
  'gridSettings', 'viewMode', 'elevationData', 'rampData', 'sunSettings',
  'dndElements', 'createdAt'
]);

function projectMapDataForClient(mapData) {
  if (!mapData || typeof mapData !== 'object' || Array.isArray(mapData)) {return null;}
  const out = {};
  for (const key of SUPPORTED_MAP_KEYS) {
    if (!(key in mapData)) {continue;}
    if (key === 'tokens' || key === 'characterTokens' || key === 'creatures') {
      out[key] = projectTokenDictionary(mapData[key]);
    } else if (key === 'backgrounds') {
      // C4B: per-map backgrounds use the SAME positive projector as the root
      // mapData backgrounds; private bearer assets and unknown nested fields
      // never reach map views, pulls or forced transfers.
      if (Array.isArray(mapData[key])) {
        out[key] = mapData[key].map(projectBackgroundForClient).filter((entry) => entry !== null);
      }
    } else {
      out[key] = mapData[key];
    }
  }
  return out;
}

// B16/C4B: positive background schema. Only fields the client actually reads
// survive; recognized asset fields route through the canonical asset
// projector, unknown scalar keys and object-valued unknowns are dropped.
const BACKGROUND_ASSET_KEYS = Object.freeze([
  'src', 'url', 'image', 'imageUrl', 'thumbnail', 'background', 'preview', 'icon'
]);
const BACKGROUND_NUMERIC_KEYS = Object.freeze(['scale', 'opacity', 'rotation', 'zIndex']);

function projectBackgroundForClient(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {return null;}
  const out = {};
  if (isScalarValue(entry.id)) {out.id = entry.id;}
  if (typeof entry.name === 'string') {out.name = entry.name;}
  for (const key of BACKGROUND_NUMERIC_KEYS) {
    if (key in entry && typeof entry[key] === 'number' && Number.isFinite(entry[key])) {
      out[key] = entry[key];
    }
  }
  if (typeof entry.sticksToGrid === 'boolean') {out.sticksToGrid = entry.sticksToGrid;}
  if (entry.position && typeof entry.position === 'object' && !Array.isArray(entry.position)) {
    const position = {};
    if (typeof entry.position.x === 'number' && Number.isFinite(entry.position.x)) {position.x = entry.position.x;}
    if (typeof entry.position.y === 'number' && Number.isFinite(entry.position.y)) {position.y = entry.position.y;}
    if (Object.keys(position).length > 0) {out.position = position;}
  }
  for (const key of BACKGROUND_ASSET_KEYS) {
    if (!(key in entry)) {continue;}
    const projected = projectAssetReference(entry[key]);
    if (projected !== null) {out[key] = projected;}
  }
  return Object.keys(out).length > 0 ? out : null;
}

function projectRootMapDataForClient(mapData) {
  if (!mapData || typeof mapData !== 'object' || Array.isArray(mapData)) {return null;}
  const out = {};
  if (Array.isArray(mapData.backgrounds)) {
    out.backgrounds = mapData.backgrounds
      .map(projectBackgroundForClient)
      .filter((entry) => entry !== null);
  }
  if (isScalarValue(mapData.activeBackgroundId)) {out.activeBackgroundId = mapData.activeBackgroundId;}
  if ('cameraPosition' in mapData) {
    const position = projectPosition(mapData.cameraPosition);
    if (position !== null) {out.cameraPosition = position;}
  }
  if (typeof mapData.zoomLevel === 'number' && Number.isFinite(mapData.zoomLevel)) {
    out.zoomLevel = mapData.zoomLevel;
  }
  return out;
}

/**
 * Build the outbound room projection handed to entitled GM/members.
 * Never include raw password hash, bans, member roster internals or private
 * carried inventory. Callers add transport capability fields as needed.
 */
function buildRoomProjection(room, options = {}) {
  const includeGameState = options.includeGameState !== false;
  const out = {
    id: room.id,
    name: room.name,
    gm: projectPlayerForClient(room.gm),
    players: projectPlayersForClient(room.players),
    settings: room.settings || {},
    persistentRoomId: room.persistentRoomId,
    isPermanent: !!room.isPermanent,
    createdAt: room.createdAt
  };
  if (includeGameState) {out.gameState = projectGameStateForClient(room.gameState);}
  return out;
}

// ---------------------------------------------------------------------------
// Public discovery (H1 explicit opt-in) + my-rooms listing
// ---------------------------------------------------------------------------

function isPubliclyDiscoverable(room) {
  return !!room &&
    room.isActive === true &&
    !!room.settings &&
    room.settings.isPrivate === false;
}

function getDiscoveryPlayerCount(room) {
  const size = room.players && typeof room.players.size === 'number' ? room.players.size : 0;
  const gmIncluded = !!(room.gm && room.players && typeof room.players.has === 'function' && room.players.has(room.gm.id));
  return size + (gmIncluded ? 0 : 1);
}

/**
 * Exact frozen eight-field discovery projection.
 * id, name, playerCount, maxPlayers, gm, createdAt, hasPassword, gmOnline
 */
function buildDiscoveryProjection(room) {
  return {
    id: room.id,
    name: room.name,
    playerCount: getDiscoveryPlayerCount(room),
    maxPlayers: getRoomMaxPlayers(room),
    gm: (room.gm && room.gm.name) || 'Unknown',
    createdAt: room.createdAt,
    hasPassword: !!room.passwordHash,
    gmOnline: room.isActive === true
  };
}

/**
 * Verified owner/member listing (may include inactive entitled rooms).
 * Metadata only; never game state, inventory, passwords or raw rosters.
 */
function buildMyRoomsProjection(rooms, userId) {
  const list = [];
  if (!rooms || !userId) {return list;}
  for (const room of rooms.values()) {
    const owner = isOwningGm(room, userId);
    const member = isDurableMember(room, userId);
    if (!owner && !member) {continue;}
    list.push({
      id: room.id,
      name: room.name,
      description: (room.settings && room.settings.description) || room.description || '',
      createdAt: room.createdAt,
      isActive: room.isActive === true,
      isPermanent: !!room.isPermanent,
      persistentRoomId: room.persistentRoomId || null,
      gmId: isValidOwnerId(room.gmId) ? room.gmId : null,
      gmName: (room.gm && room.gm.name) || null,
      memberCount: Array.isArray(room.members) ? room.members.length : 0,
      maxPlayers: getRoomMaxPlayers(room),
      settings: {
        maxPlayers: getRoomMaxPlayers(room),
        isPrivate: !(room.settings && room.settings.isPrivate === false)
      },
      userRole: owner ? 'gm' : 'player'
    });
  }
  return list;
}

/**
 * Bounded metadata projection for an entitled cloud room that is not
 * currently reconstructed in memory (inactive room or unactivated draft).
 * Input is trusted Admin metadata; output contains no raw checkpoint/access
 * or private fields.
 */
function buildEntitledRoomProjection(metadata, userId) {
  if (!metadata || !userId) {return null;}
  const owner = isValidOwnerId(metadata.gmId) && metadata.gmId === userId;
  const member = Array.isArray(metadata.members) && metadata.members.includes(userId);
  if (!owner && !member) {return null;}
  const maxPlayers = metadata.settings && Number.isFinite(Number(metadata.settings.maxPlayers))
    ? Number(metadata.settings.maxPlayers)
    : DEFAULT_MAX_PLAYERS;
  return {
    id: metadata.id,
    name: typeof metadata.name === 'string' ? metadata.name : '',
    description: (metadata.settings && typeof metadata.settings.description === 'string' && metadata.settings.description)
      || (typeof metadata.description === 'string' ? metadata.description : ''),
    createdAt: metadata.createdAt || null,
    isActive: metadata.isActive === true,
    isPermanent: metadata.isPermanent === true,
    persistentRoomId: metadata.persistentRoomId || null,
    gmId: isValidOwnerId(metadata.gmId) ? metadata.gmId : null,
    gmName: typeof metadata.gmName === 'string' ? metadata.gmName : null,
    memberCount: Array.isArray(metadata.members) ? metadata.members.length : 0,
    maxPlayers,
    settings: {
      maxPlayers,
      isPrivate: !(metadata.settings && metadata.settings.isPrivate === false)
    },
    userRole: owner ? 'gm' : 'player'
  };
}

function mergeMyRooms(liveList, cloudList) {
  const merged = new Map();
  for (const entry of cloudList || []) {
    if (entry && entry.id) {merged.set(entry.id, entry);}
  }
  for (const entry of liveList || []) {
    if (entry && entry.id) {merged.set(entry.id, entry);}
  }
  return Array.from(merged.values());
}

// ---------------------------------------------------------------------------
// Shared verified-member admission
// ---------------------------------------------------------------------------

function findActiveDevicePlayer(room, userId) {
  if (!room || !room.players || typeof room.players.values !== 'function') {return null;}
  for (const player of room.players.values()) {
    if (player && !player.isGM && player.userId === userId) {return player;}
  }
  return null;
}

function playerHasActivePresence(room, userId) {
  return !!findActiveDevicePlayer(room, userId);
}

/**
 * Admit one verified, already-authorized member (new admission or reconnect).
 *
 * Preconditions handled by the caller: authentication, H2 identity policy for
 * permanent rooms, owner-recovery state, password or recipient-bound invitation
 * verification.
 *
 * Persists durable entitlement BEFORE inserting runtime membership, assigning a
 * map, joining transport or emitting presence. Any failure returns without
 * side effects.
 *
 * @returns {Promise<{ok: boolean, code: string|null, player?: Object, room?: Object}>}
 */
/**
 * Revalidate all security-relevant admission state after an await that can
 * race authority. Returns { ok, code, room }.
 */
function revalidateAdmission({ socket, rooms, room, userId, expectedGeneration }) {
  const liveRoom = (rooms && typeof rooms.get === 'function' ? rooms.get(room.id) : null) || room;
  if (!liveRoom) {return { ok: false, code: DENIAL_CODES.ROOM_UNAVAILABLE };}
  if (liveRoom.isPermanent) {
    const identity = checkDurableRoomIdentity(socket);
    if (!identity.allowed) {return { ok: false, code: identity.code };}
    if (!hasProvableOwner(liveRoom)) {
      return { ok: false, code: DENIAL_CODES.OWNER_RECOVERY_REQUIRED };
    }
  }
  if (socket.disconnected === true) {return { ok: false, code: DENIAL_CODES.NOT_AUTHENTICATED };}
  if (isOwningGm(liveRoom, userId)) {return { ok: false, code: DENIAL_CODES.GM_REQUIRED };}
  if (Array.isArray(liveRoom.bannedUsers) && liveRoom.bannedUsers.includes(userId)) {
    return { ok: false, code: DENIAL_CODES.NOT_ROOM_MEMBER };
  }
  if (expectedGeneration !== undefined && getAccessGeneration(liveRoom) !== expectedGeneration) {
    return { ok: false, code: DENIAL_CODES.NOT_ROOM_MEMBER };
  }
  return { ok: true, code: null, room: liveRoom };
}

/**
 * Admit one verified, already-authorized member (new admission or reconnect).
 *
 * Security-relevant state is revalidated after every await. A newly created
 * durable grant is rolled back exactly when admission aborts afterwards.
 * Same-UID devices receive distinct runtime records (capacity still counts the
 * UID once).
 */
async function admitVerifiedMember({
  socket,
  rooms,
  players,
  firebaseService,
  uuidv4,
  room,
  userId,
  playerName,
  playerColor,
  character,
  sanitizePlayerName,
  lockHeld = false,
  authorityService = null,
  validateBeforeSideEffects = null
}) {
  if (!room || !userId) {return { ok: false, code: DENIAL_CODES.NOT_ROOM_MEMBER };}
  if (!socket || !players || typeof players.set !== 'function') {
    return { ok: false, code: DENIAL_CODES.NOT_AUTHENTICATED };
  }

  const core = async() => {
    const pre = revalidateAdmission({ socket, rooms, room, userId });
    if (!pre.ok) {return pre;}
    const liveRoom = pre.room;

    // C3: unresolved durable obligations for this room are retried under the
    // CURRENT legitimate authority before any new grant. A remaining obligation
    // for this user (or an over-limit backlog) refuses the admission instead of
    // creating another unsafe grant. Discovery failure fails closed: it is
    // never treated as "no obligations".
    //
    // Authorization invariant: this recovery pass may revoke a pending
    // membership. Callers that granted a membership-based credential exemption
    // MUST have required this user's obligation resolved BEFORE that decision
    // (see join_room); this helper never re-authorizes on their behalf.
    if (liveRoom.isPermanent === true) {
      let pendingResult = await loadPendingCompensations(firebaseService, liveRoom.id);
      if (!pendingResult.ok) {
        return { ok: false, code: pendingResult.code || DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE };
      }
      let pendingCompensations = pendingResult.entries;
      if (pendingCompensations.length > 0) {
        try {await retryMembershipCompensations(firebaseService, authorityService, liveRoom.id, rooms);} catch (_error) { /* stays pending */ }
        pendingResult = await loadPendingCompensations(firebaseService, liveRoom.id);
        if (!pendingResult.ok) {
          return { ok: false, code: pendingResult.code || DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE };
        }
        pendingCompensations = pendingResult.entries;
      }
      if (pendingCompensations.length >= getMembershipCompensationLimit()) {
        return { ok: false, code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_REQUIRED };
      }
      if (pendingCompensations.some((entry) => entry.userId === userId)) {
        return { ok: false, code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_REQUIRED };
      }
    }

    // C5: only the current room authority may evaluate admission/capacity.
    let admissionToken = null;
    if (authorityService) {
      const denial = roomAuthorityDenial(liveRoom, authorityService);
      if (denial) {return { ok: false, code: denial };}
      admissionToken = typeof authorityService.currentToken === 'function'
        ? authorityService.currentToken(liveRoom.id)
        : null;
      // R2: fresh backend authority validation before any admission effect.
      if (admissionToken && typeof authorityService.assertCurrent === 'function') {
        const fresh = await authorityService.assertCurrent(admissionToken, { backendCheck: true });
        if (!fresh.ok) {return { ok: false, code: fresh.code };}
      }
    }

    const hasActiveDevice = playerHasActivePresence(liveRoom, userId);
    const capacity = checkCapacity(liveRoom, hasActiveDevice);
    if (!capacity.allowed) {return { ok: false, code: capacity.code };}

    // B10: caller eligibility (e.g. invitation lifetime/status) is validated
    // BEFORE any durable grant is created, so an already-invalid invitation
    // can never leave newly-created entitlement behind.
    if (typeof validateBeforeSideEffects === 'function') {
      const preEligible = validateBeforeSideEffects({ room: liveRoom, userId });
      if (!preEligible || preEligible.ok !== true) {
        return { ok: false, code: (preEligible && preEligible.code) || DENIAL_CODES.INVITATION_INVALID };
      }
    }

    const generation = getAccessGeneration(liveRoom);
    const authorityToken = authorityService && typeof authorityService.currentToken === 'function'
      ? authorityService.currentToken(liveRoom.id)
      : null;
    const grant = await grantMembership(firebaseService, liveRoom, userId, authorityToken);
    if (!grant.ok) {return { ok: false, code: DENIAL_CODES.MEMBERSHIP_PERSISTENCE_FAILED };}

    // C3: finalize the pending recovery record created atomically with a new
    // durable membership. Finalization is accepted ONLY when this exact
    // obligation was transactionally cleared under the captured authority; a
    // missing or replaced record is ambiguous/not-finalized, never success.
    const finalizePendingAdmission = async(roomId) => {
      if (!grant.compensationId) {return { ok: true, code: null };}
      if (!firebaseService || typeof firebaseService.clearMembershipCompensation !== 'function') {
        return { ok: false, code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE };
      }
      try {
        const result = await firebaseService.clearMembershipCompensation(roomId, userId, {
          compensationId: grant.compensationId,
          authority: authorityToken
        });
        if (result && result.ok === true && result.cleared === true) {
          return { ok: true, code: null };
        }
        return { ok: false, code: (result && result.code) || DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE };
      } catch (_error) {
        return { ok: false, code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE };
      }
    };

    // C3: retire ONLY this operation's exact runtime/socket/map effects. A
    // replacement binding belonging to a successor operation is preserved.
    const retireAdmissionRuntimeEffects = () => {
      if (live.players.get(playerId) === player) {
        live.players.delete(playerId);
        if (live.gameState && live.gameState.playerMapAssignments) {
          delete live.gameState.playerMapAssignments[playerId];
        }
      }
      if (players.get(socket.id) === player) {players.delete(socket.id);}
      if (socket.rooms && typeof socket.rooms.has === 'function' && socket.rooms.has(live.id)) {
        socket.leave(live.id);
      }
    };

    // C3: the exact originating context must still be current before clean
    // participation success.
    const checkFinalAdmissionContext = () => {
      if (rooms.get(live.id) !== live) {
        return { ok: false, code: DENIAL_CODES.ROOM_AUTHORITY_LOST };
      }
      if (players.get(socket.id) !== player) {
        return { ok: false, code: DENIAL_CODES.ROOM_AUTHORITY_LOST };
      }
      if (socket.data && socket.data.userId !== userId) {
        return { ok: false, code: DENIAL_CODES.ROOM_AUTHORITY_LOST };
      }
      if (socket.rooms && typeof socket.rooms.has === 'function' && !socket.rooms.has(live.id)) {
        return { ok: false, code: DENIAL_CODES.ROOM_AUTHORITY_LOST };
      }
      if (!Array.isArray(live.members) || !live.members.includes(userId)) {
        return { ok: false, code: DENIAL_CODES.ROOM_AUTHORITY_LOST };
      }
      return { ok: true, code: null };
    };

    // C3: every post-grant abort either revokes the newly-created durable
    // membership or leaves the durable recovery record created atomically with
    // it. A failed rollback is never ignored.
    const abortWithGrantRollback = async(roomForRollback, code) => {
      if (!grant.persisted) {return { ok: false, code };}
      const rollback = await revokeMembershipUnlocked(firebaseService, roomForRollback, userId, authorityToken);
      if (rollback.ok) {
        // Durable membership is corrected; clear the exact recovery record.
        // A failed clear keeps the record for idempotent recovery.
        if (grant.compensationId) {
          await finalizePendingAdmission(roomForRollback.id);
        }
        return { ok: false, code };
      }
      if (grant.compensationId) {
        // The atomic grant already persisted durable recovery intent; no second
        // journal write is required. Keep the local mirror as an optimization.
        mirrorCompensationEntry(roomForRollback.id, userId, grant.compensationId);
        return { ok: false, code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_REQUIRED };
      }
      // Degraded adapter without atomic intent support: record the obligation
      // through the legacy path and fail closed when it cannot be persisted.
      const recorded = await recordMembershipCompensation(firebaseService, roomForRollback.id, userId, {
        reason: 'postgrant_abort',
        authorityGeneration: authorityToken ? authorityToken.authorityGeneration : null,
        authorityInstanceId: authorityToken ? authorityToken.authorityInstanceId : null
      });
      if (!recorded.durable) {
        return { ok: false, code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_PERSISTENCE_FAILED };
      }
      return { ok: false, code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_REQUIRED };
    };

    const post = revalidateAdmission({ socket, rooms, room: liveRoom, userId, expectedGeneration: generation });
    if (!post.ok) {
      return abortWithGrantRollback(liveRoom, post.code);
    }
    if (authorityService) {
      const denial = roomAuthorityDenial(post.room, authorityService);
      if (denial) {
        return abortWithGrantRollback(post.room, denial);
      }
    }

    const postCapacity = checkCapacity(post.room, playerHasActivePresence(post.room, userId));
    if (!postCapacity.allowed) {
      return abortWithGrantRollback(post.room, postCapacity.code);
    }
    const live = post.room;

    // C5/R5: final pre-side-effect check with a FRESH backend validation using
    // the exact admission token. Authority may have moved during the durable
    // grant await; a stale process inserts no player/presence.
    if (authorityService) {
      let denial = roomAuthorityDenial(live, authorityService);
      if (!denial && admissionToken && typeof authorityService.assertCurrent === 'function') {
        const fresh = await authorityService.assertCurrent(admissionToken, { backendCheck: true });
        if (!fresh.ok) {denial = fresh.code || DENIAL_CODES.ROOM_AUTHORITY_LOST;}
      }
      if (denial) {
        return abortWithGrantRollback(live, denial);
      }
    }

    // R8/B10: caller eligibility (e.g. invitation lifetime/status) revalidated
    // at the last synchronous point before irreversible runtime effects. A
    // failure here means no player/presence/map/socket side effect was
    // introduced. If this request created a durable grant, it is rolled back;
    // if the rollback itself fails, the outcome is a DISTINCT
    // compensation-required result and the pending entitlement is recorded and
    // retried - never reported as a clean invitation failure.
    if (typeof validateBeforeSideEffects === 'function') {
      const eligible = validateBeforeSideEffects({ room: live, userId });
      if (!eligible || eligible.ok !== true) {
        const code = (eligible && eligible.code) || DENIAL_CODES.INVITATION_INVALID;
        return abortWithGrantRollback(live, code);
      }
    }

    let playerId = null;
    let reusedPlayerId = false;
    if (live.disconnectedPlayers && live.disconnectedPlayers[userId]) {
      // Reclaim a disconnected session record only when it is not already live.
      const candidate = live.disconnectedPlayers[userId].playerId;
      if (!live.players.has(candidate)) {
        playerId = candidate;
        reusedPlayerId = true;
      }
      delete live.disconnectedPlayers[userId];
    }
    if (!playerId) {playerId = uuidv4();}

    const safeCharacter = character && typeof character === 'object'
      ? projectCharacterForClient(character)
      : null;

    const name = sanitizePlayerName ? sanitizePlayerName(playerName) : playerName;
    const player = {
      id: playerId,
      name: name || 'Player',
      socketId: socket.id,
      roomId: live.id,
      isGM: false,
      color: playerColor || undefined,
      character: safeCharacter,
      currentMapId: (live.gameState && live.gameState.defaultMapId) || 'default',
      userId
    };

    if (!live.gameState) {live.gameState = {};}
    if (!live.gameState.playerMapAssignments) {live.gameState.playerMapAssignments = {};}
    live.gameState.playerMapAssignments[playerId] = player.currentMapId;

    live.players.set(playerId, player);
    players.set(socket.id, player);
    socket.join(live.id);

    // C3: clean admission success is reported only after the pending recovery
    // record is conditionally cleared under the captured authority AND the
    // exact originating context is still current after that clear await. A
    // failed finalization retains the durable record and retires this
    // operation's exact runtime effects; a final context loss returns a
    // bounded authority-lost outcome without undoing historical durability.
    if (grant.persisted && grant.compensationId) {
      const finalized = await finalizePendingAdmission(live.id);
      if (!finalized.ok) {
        retireAdmissionRuntimeEffects();
        return { ok: false, code: DENIAL_CODES.MEMBERSHIP_COMPENSATION_REQUIRED };
      }
      const preContext = checkFinalAdmissionContext();
      if (!preContext.ok) {
        retireAdmissionRuntimeEffects();
        return { ok: false, code: preContext.code };
      }
      if (authorityService && authorityToken && typeof authorityService.assertCurrent === 'function') {
        const freshFinal = await authorityService.assertCurrent(authorityToken, { backendCheck: true });
        if (!freshFinal || freshFinal.ok !== true) {
          retireAdmissionRuntimeEffects();
          return { ok: false, code: (freshFinal && freshFinal.code) || DENIAL_CODES.ROOM_AUTHORITY_LOST };
        }
      }
      const postContext = checkFinalAdmissionContext();
      if (!postContext.ok) {
        retireAdmissionRuntimeEffects();
        return { ok: false, code: postContext.code };
      }
    }

    return { ok: true, code: null, player, room: live, reusedPlayerId };
  };

  return lockHeld ? core() : withRoomAdmissionLock(room.id, core);
}

/**
 * Remove runtime presence for every device of a revoked member. Returns the
 * list of detached sockets for caller-side notification.
 */
function detachMemberDevices({ io, room, players, userId }) {
  const detached = [];
  if (!room || !room.players) {return detached;}
  for (const [playerId, player] of Array.from(room.players.entries())) {
    if (!player || player.isGM || player.userId !== userId) {continue;}
    room.players.delete(playerId);
    if (room.gameState && room.gameState.playerMapAssignments) {
      delete room.gameState.playerMapAssignments[playerId];
    }
    const socketId = player.socketId;
    if (socketId && players && typeof players.get === 'function') {
      const livePlayer = players.get(socketId);
      if (livePlayer && livePlayer.id === playerId) {players.delete(socketId);}
    }
    const target = io && io.sockets && io.sockets.sockets && socketId ? io.sockets.sockets.get(socketId) : null;
    if (target) {
      target.leave(room.id);
      detached.push(target);
    }
  }
  if (room.disconnectedPlayers) {delete room.disconnectedPlayers[userId];}
  return detached;
}

module.exports = {
  DENIAL_CODES,
  PRIVATE_CHARACTER_KEYS,
  ADMISSION,
  admitVerifiedMember,
  playerHasActivePresence,
  findActiveDevicePlayer,
  detachMemberDevices,
  getVerifiedUserId,
  isAuthenticatedIdentity,
  getSignInProvider,
  isAnonymousIdentity,
  isDurableAccount,
  checkDurableRoomIdentity,
  isValidOwnerId,
  isOwningGm,
  isDurableMember,
  isEntitled,
  hasProvableOwner,
  classifyAdmission,
  countActiveMemberSlots,
  getRoomMaxPlayers,
  checkCapacity,
  withRoomAdmissionLock,
  grantMembership,
  revokeMembership,
  projectCharacterForClient,
  projectEquipmentForClient,
  projectPlayerForClient,
  projectPlayersForClient,
  projectGameStateForClient,
  projectMapDataForClient,
  projectRootMapDataForClient,
  buildRoomProjection,
  isPubliclyDiscoverable,
  buildDiscoveryProjection,
  buildMyRoomsProjection,
  buildEntitledRoomProjection,
  mergeMyRooms,
  projectTokenForClient: projectTokenCharacter,
  projectTokenUpdateForClient,
  revalidateAdmission,
  revokeMembershipUnlocked,
  retryMembershipCompensations,
  getMembershipCompensationStats,
  getAccessGeneration,
  bumpAccessGeneration,
  projectAssetReference,
  projectStateUpdates,
  roomAuthorityDenial
};
