const actors = require('./actorConsequences');

const VERSION = 1;
const STATES = Object.freeze(['placed', 'available', 'inactive']);
const MAX_ENTRIES = 256;
const MAX_SNAPSHOT_BYTES = 64 * 1024;

const integer = value => Number.isSafeInteger(value) && value >= 0;
const fail = (code, message = code) => { const error = new Error(message); error.code = code; throw error; };

function stored(room) {
  const record = room?.gameState?.companionRoster;
  if (record === undefined) {return null;}
  if (!record || typeof record !== 'object' || Array.isArray(record) || record.version !== VERSION ||
    !integer(record.revision) || !record.entries || typeof record.entries !== 'object' || Array.isArray(record.entries) ||
    Object.keys(record.entries).length > MAX_ENTRIES) {
    fail('roster_contract_unavailable', 'The stored companion roster is not a supported version or shape.');
  }
  return record;
}

function revision(room) {
  return stored(room)?.revision || 0;
}

function entries(room) {
  return stored(room)?.entries || {};
}

function rosterIdFor(sourceRef) {
  return `roster:${actors.hash(sourceRef).slice(0, 32)}`;
}

function entryForSource(room, sourceRef) {
  const hash = actors.hash(sourceRef);
  for (const entry of Object.values(entries(room))) {
    if (entry?.sourceRef && actors.hash(entry.sourceRef) === hash) {return entry;}
  }
  return null;
}

function entryForStableToken(room, stableTokenId) {
  for (const entry of Object.values(entries(room))) {
    if (entry?.stableTokenId === stableTokenId) {return entry;}
  }
  return null;
}

function applyRecruit(next, input) {
  const record = next.companionRoster
    ? actors.clone(next.companionRoster)
    : { version: VERSION, revision: 0, entries: {} };
  const rosterId = rosterIdFor(input.sourceRef);
  const prior = record.entries[rosterId] || null;
  if (actors.bytes(input.snapshot) > MAX_SNAPSHOT_BYTES) {
    fail('roster_snapshot_capacity', 'The creature snapshot is larger than the companion roster technical bound.');
  }
  if (!prior && Object.keys(record.entries).length >= MAX_ENTRIES) {
    fail('roster_capacity', 'The companion roster is at its declared entry capacity.');
  }
  const now = input.now || Date.now();
  const entry = {
    rosterId,
    recipientUid: input.recipientUid,
    partyId: input.partyId,
    sourceRef: actors.clone(input.sourceRef),
    stableTokenId: input.stableTokenId,
    creatureId: input.creatureId ?? null,
    displayName: input.displayName ?? null,
    state: 'placed',
    activeRef: actors.clone(input.sourceRef),
    snapshot: actors.clone(input.snapshot),
    createdAt: prior?.createdAt || now,
    updatedAt: now
  };
  record.entries[rosterId] = entry;
  record.version = VERSION;
  record.revision += 1;
  next.companionRoster = record;
  return { entry, prior, revision: record.revision };
}

function activeEntry(record, ref) {
  const hash = actors.hash(ref);
  for (const [rosterId, entry] of Object.entries(record.entries || {})) {
    if (entry?.activeRef && actors.hash(entry.activeRef) === hash) {return { rosterId, entry };}
  }
  return null;
}

function transition(next, ref, state, now, snapshot = null) {
  const current = next.companionRoster;
  if (!current || current.version !== VERSION || !current.entries) {return null;}
  const record = actors.clone(current);
  const found = activeEntry(record, ref);
  if (!found) {return null;}
  found.entry.state = state;
  found.entry.activeRef = null;
  if (snapshot && typeof snapshot === 'object') {
    if (actors.bytes(snapshot) > MAX_SNAPSHOT_BYTES) {
      fail('roster_snapshot_capacity', 'The creature snapshot is larger than the companion roster technical bound.');
    }
    found.entry.snapshot = actors.clone(snapshot);
  }
  found.entry.updatedAt = now || Date.now();
  record.revision += 1;
  next.companionRoster = record;
  return { rosterId: found.rosterId, entry: found.entry, revision: record.revision };
}

function applyRecall(next, ref, now, snapshot = null) {
  return transition(next, ref, 'available', now, snapshot);
}

function applyRemoval(next, ref, now) {
  return transition(next, ref, 'inactive', now);
}

/** Placed -> inactive by stable roster identity for a missing/invalid exact
 * incarnation. The retained snapshot is evidence only: this never creates a
 * token, heals, respawns or turns the entry into an available companion. */
function applyInactive(next, rosterId, now) {
  const current = next.companionRoster;
  if (!current || current.version !== VERSION || !current.entries) {
    fail('roster_contract_unavailable', 'The stored companion roster is not a supported version or shape.');
  }
  const record = actors.clone(current);
  const entry = record.entries[rosterId];
  if (!entry) {fail('roster_entry_missing', 'The companion roster entry no longer exists.');}
  if (entry.state === 'inactive') {
    return { rosterId, entry, revision: record.revision, unchanged: true };
  }
  if (entry.state !== 'placed') {
    fail('roster_state_conflict', 'Only a placed companion can be reconciled to inactive.');
  }
  entry.state = 'inactive';
  entry.activeRef = null;
  entry.updatedAt = now || Date.now();
  record.revision += 1;
  next.companionRoster = record;
  return { rosterId, entry, revision: record.revision, unchanged: false };
}

/** Available -> placed for one existing roster identity. The caller supplies the
 * exact new incarnation ref and its already-built token snapshot; this helper
 * only validates the roster side and bumps the roster revision. */
function applyPlacement(next, input) {
  const current = next.companionRoster;
  if (!current || current.version !== VERSION || !current.entries) {
    fail('roster_contract_unavailable', 'The stored companion roster is not a supported version or shape.');
  }
  const record = actors.clone(current);
  const entry = record.entries[input.rosterId];
  if (!entry) {fail('roster_entry_missing', 'The companion roster entry no longer exists.');}
  if (entry.state === 'inactive') {fail('companion_inactive', 'That companion is inactive.');}
  if (entry.state !== 'available') {fail('companion_already_placed', 'That companion is already placed.');}
  if (entry.stableTokenId !== input.stableTokenId) {
    fail('placement_identity_conflict', 'The stable placement identity does not match the roster entry.');
  }
  if (actors.bytes(input.snapshot) > MAX_SNAPSHOT_BYTES) {
    fail('roster_snapshot_capacity', 'The creature snapshot is larger than the companion roster technical bound.');
  }
  const now = input.now || Date.now();
  entry.state = 'placed';
  entry.activeRef = actors.clone(input.activeRef);
  entry.snapshot = actors.clone(input.snapshot);
  entry.updatedAt = now;
  record.revision += 1;
  next.companionRoster = record;
  return { entry, revision: record.revision };
}

/** Placed -> available for one exact active incarnation. The canonical token
 * snapshot is retained so a later placement preserves resources/conditions. */
function applyDismissal(next, ref, input = {}) {
  const current = next.companionRoster;
  if (!current || current.version !== VERSION || !current.entries) {
    fail('roster_contract_unavailable', 'The stored companion roster is not a supported version or shape.');
  }
  const record = actors.clone(current);
  const found = activeEntry(record, ref);
  if (!found) {fail('active_actor_missing', 'The exact placed companion no longer exists.');}
  if (found.entry.state === 'inactive') {fail('companion_inactive', 'That companion is inactive.');}
  if (found.entry.state !== 'placed') {fail('companion_not_placed', 'That companion is not placed.');}
  if (input.snapshot && typeof input.snapshot === 'object') {
    if (actors.bytes(input.snapshot) > MAX_SNAPSHOT_BYTES) {
      fail('roster_snapshot_capacity', 'The creature snapshot is larger than the companion roster technical bound.');
    }
    found.entry.snapshot = actors.clone(input.snapshot);
  }
  found.entry.state = 'available';
  found.entry.activeRef = null;
  found.entry.updatedAt = input.now || Date.now();
  record.revision += 1;
  next.companionRoster = record;
  return { rosterId: found.rosterId, entry: found.entry, revision: record.revision };
}

function projectEntry(entry, authority = false) {
  if (!entry || typeof entry !== 'object') {return null;}
  const out = {
    rosterId: entry.rosterId,
    stableTokenId: entry.stableTokenId,
    displayName: entry.displayName ?? null,
    creatureId: entry.creatureId ?? null,
    state: STATES.includes(entry.state) ? entry.state : 'inactive',
    activeRef: entry.activeRef ? actors.clone(entry.activeRef) : null,
    updatedAt: Number.isFinite(entry.updatedAt) ? entry.updatedAt : null
  };
  if (authority) {
    out.authority = {
      recipientUid: entry.recipientUid ?? null,
      partyId: entry.partyId ?? null,
      sourceRef: entry.sourceRef ? actors.clone(entry.sourceRef) : null
    };
  }
  return out;
}

function list(room, uid, isGM) {
  const out = [];
  for (const entry of Object.values(entries(room))) {
    if (!entry || typeof entry !== 'object') {continue;}
    if (!isGM && entry.recipientUid !== uid) {continue;}
    const projected = projectEntry(entry, isGM === true);
    if (projected) {out.push(projected);}
  }
  return out.sort((a, b) => String(a.rosterId).localeCompare(String(b.rosterId)));
}

module.exports = { VERSION, STATES, MAX_ENTRIES, MAX_SNAPSHOT_BYTES, revision, entries, rosterIdFor, entryForSource,
  entryForStableToken, applyRecruit, applyRecall, applyRemoval, applyInactive, applyPlacement, applyDismissal, projectEntry, list };
