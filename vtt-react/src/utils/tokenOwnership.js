/**
 * Unified token ownership resolution.
 *
 * Ownership identifiers live in several places depending on how a token was created:
 * - state.ownerId / state.playerId  — client-side grants (Give Control), summons
 * - token.ownerId / token.playerId  — legacy top-level copies (character tokens, some grants)
 * - token.ownerPlayerId             — stamped server-side on creature tokens at creation
 * - token._summonMeta.ownerId       — summon metadata
 *
 * A player's own identity also has several shapes:
 * - currentPlayer.id                — server player UUID (multiplayer)
 * - auth user.uid                   — Firebase uid
 * - currentPlayer.name              — display name fallback
 * - multiplayerSocket.id            — socket id (summons historically stamp this)
 * - characterStore.name             — local character name
 * - 'current-player'                — single-player magic id
 *
 * Every ownership check in the app (drag gating, vision union, afterimage
 * exclusion, control modal) must go through these helpers so the variants
 * stay consistent.
 */

const collectOwnerIds = (token) => {
  const ids = [];
  const push = (v) => {
    if (v !== undefined && v !== null && v !== '') ids.push(String(v));
  };
  const st = token?.state || {};
  push(st.ownerId);
  push(st.playerId);
  push(token?.ownerId);
  push(token?.playerId);
  push(token?.ownerPlayerId);
  push(token?._summonMeta?.ownerId);
  return ids;
};

const collectMyIdentityIds = () => {
  const ids = [];
  const push = (v) => {
    if (v !== undefined && v !== null && v !== '') ids.push(String(v));
  };
  try {
    const gs = require('../store/gameStore').default.getState();
    push(gs.currentPlayer?.id);
    push(gs.currentPlayer?.userId);
    push(gs.currentPlayer?.name);
    push(gs.multiplayerSocket?.id);
  } catch {}
  try {
    const auth = require('../store/authStore').default.getState();
    push(auth.user?.uid);
  } catch {}
  try {
    const cs = require('../store/characterStore').default.getState();
    push(cs.name);
  } catch {}
  push('current-player');
  return ids;
};

export const getTokenOwnerIds = collectOwnerIds;

export const getMyIdentityIds = collectMyIdentityIds;

export const isTokenControlledByMe = (token) => {
  const ownerIds = collectOwnerIds(token);
  if (ownerIds.length === 0) return false;
  const mine = new Set(collectMyIdentityIds());
  return ownerIds.some(id => mine.has(id));
};

export const isTokenControlledByPlayer = (token, player) => {
  const ownerIds = collectOwnerIds(token);
  if (ownerIds.length === 0 || !player) return false;
  const candidates = new Set();
  [player.id, player.userId, player.name, player.socketId].forEach(v => {
    if (v !== undefined && v !== null && v !== '') candidates.add(String(v));
  });
  return ownerIds.some(id => candidates.has(id));
};
