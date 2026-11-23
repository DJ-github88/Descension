'use strict';
/**
 * Hunter Flow sheet authority (server only).
 *
 * The committed Flow lives in the primary actor token (`state.classPayment`, domain `hunterFlow`) and its
 * `character.classResource`. A player's room-level sheet mirror (`room.players[*].character.classResource`)
 * is derived from that committed record. A generic client write (character_updated / character_resource_updated)
 * may never decide what the sheet shows for a Flow resource; it can only announce the canonical start value
 * before an authoritative record exists.
 */
const hunterFlow = require('../shared/services/hunterFlow');

const FLOW_TYPES = [hunterFlow.FLOW_RESOURCE_TYPE, 'hunter_flow', hunterFlow.FLOW_DOMAIN];
const clone = value => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
const isFlowLike = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value) && FLOW_TYPES.includes(value.type);
const isLegacyEvidence = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value) &&
  [hunterFlow.LEGACY_EVIDENCE_TYPE, 'hunter_evidence'].includes(value.type);

function* primaryTokens(room) {
  for (const map of Object.values(room?.gameState?.maps || {})) {
    for (const token of Object.values(map?.characterTokens || {})) {
      const contract = token?.state?.actorContract;
      if (contract?.primary && contract.ownerUid && contract.characterId) {yield { token, contract };}
    }
  }
}

const isFlowToken = token => token?.state?.classPayment?.domain === hunterFlow.FLOW_DOMAIN || isFlowLike(token?.character?.classResource);

/** The committed Flow token of this owner's character, or null when no authoritative Flow record exists yet. */
function authoritativeToken(room, ownerUid, characterId) {
  for (const { token, contract } of primaryTokens(room)) {
    if (contract.ownerUid === ownerUid && contract.characterId === characterId && isFlowToken(token)) {return token;}
  }
  return null;
}

function legacyEvidenceToken(room, ownerUid, characterId) {
  for (const { token, contract } of primaryTokens(room)) {
    if (contract.ownerUid === ownerUid && contract.characterId === characterId && isLegacyEvidence(token?.character?.classResource)) {return token;}
  }
  return null;
}

// The member mirror is what generic room paths relay: scalar fields only. The full record (state, legacy snapshot) stays on the token.
const sheetMirror = resource => {
  const out = {};
  for (const key of ['type', 'current', 'min', 'max', 'sharedWithCompanion']) if (resource[key] !== undefined) out[key] = resource[key];
  return out;
};

function members(room) {
  return [...new Set([...(room?.players?.values?.() || []), room?.gm].filter(Boolean))];
}

/** Replace each member's sheet mirror with a copy of the committed token record (never a merge with client data). */
function mirrorCommittedFlow(room) {
  let count = 0;
  for (const { token, contract } of primaryTokens(room)) {
    if (!isFlowToken(token) || !isFlowLike(token.character?.classResource)) {continue;}
    for (const member of members(room)) {
      if (member.userId === contract.ownerUid && member.character?.id === contract.characterId) {
        member.character = { ...member.character, classResource: sheetMirror(token.character.classResource) };
        count += 1;
      }
    }
  }
  return count;
}

/**
 * Decide what a client-supplied classResource may do to a Flow sheet.
 *  - an authoritative committed record exists, or the stored sheet is already Flow: the stored value wins;
 *  - no record yet and the client announces Flow: only the canonical start value (1) is accepted;
 *  - anything that is not Flow-typed passes through (other classes, class switches).
 * Returns { action: 'pass' } | { action: 'ignore' } | { action: 'replace', value, mirror }.
 */
function judgeClassResource(room, { ownerUid, characterId, existing, incoming }) {
  const authoritative = authoritativeToken(room, ownerUid, characterId);
  if (incoming === undefined || incoming === null) {
    // current/max edits and null clears may not touch a Flow sheet.
    return isFlowLike(existing) || authoritative ? { action: 'ignore' } : { action: 'pass' };
  }
  if (authoritative) {
    // The committed token owns Flow. A generic sheet write (including a raw legacy Evidence record) never replaces it.
    return { action: 'ignore' };
  }
  if (legacyEvidenceToken(room, ownerUid, characterId) && (isLegacyEvidence(incoming) || isFlowLike(incoming))) {
    // Preserve the bound primary token's raw legacy Quarry Evidence record verbatim so lossy generic
    // projection (e.g. CharacterPanel mount sync) never strips quarry/tags/custom before Cast 1 snapshots it.
    return { action: 'ignore' };
  }
  if (isFlowLike(incoming)) {
    const start = hunterFlow.normalizeFlowResourceRecord({
      type: hunterFlow.FLOW_RESOURCE_TYPE, current: hunterFlow.FLOW_START,
      ...(incoming.legacyHunterEvidence && typeof incoming.legacyHunterEvidence === 'object' ? { legacyHunterEvidence: incoming.legacyHunterEvidence } : {})
    });
    return { action: 'replace', value: start, mirror: sheetMirror(start) };
  }
  return { action: 'pass' };
}

module.exports = { FLOW_TYPES, isFlowLike, isFlowToken, authoritativeToken, mirrorCommittedFlow, judgeClassResource };
