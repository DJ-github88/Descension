/**
 * Combat authority service.
 *
 * Centralises who is allowed to mutate shared combat state. Authority is
 * enforced only when COMBAT_AUTHORITY_ENFORCEMENT is set to 'true'. This keeps
 * the cooperative-VTT trust model intact by default while giving operators a
 * single flag to flip on for stricter deployments (public games, adversarial
 * tables).
 *
 * Authority rules when enabled:
 *   - combat_started / combat_ended  -> GM only
 *   - combat_turn_changed            -> GM OR the controller of the combatant
 *                                       whose turn is currently active
 *
 * The controller check is intentionally permissive: a combatant is considered
 * controlled by `player` if the combatant's `playerId`/`characterId` matches
 * the player's id, OR the combatant has no controller field (NPCs/creatures,
 * which any player can advance on behalf of). The strictest practical rule
 * (GM-only) is the fallback when the controller cannot be determined.
 */

const ENV_FLAG = 'COMBAT_AUTHORITY_ENFORCEMENT';

function isCombatAuthorityEnabled() {
  return process.env[ENV_FLAG] === 'true';
}

function _combatantControllerMatches(combatant, player) {
  if (!combatant || typeof combatant !== 'object') {
    return false;
  }
  if (!player) {
    return false;
  }

  const candidateIds = new Set(
    [player.id, player.userId, player.socketId].filter(Boolean)
  );

  const combatantOwners = new Set(
    [combatant.playerId, combatant.characterId, combatant.ownerId]
      .filter(Boolean)
  );

  if (combatantOwners.size === 0) {
    return true;
  }

  for (const owner of combatantOwners) {
    if (candidateIds.has(owner)) {
      return true;
    }
  }

  return false;
}

function _getCurrentCombatant(room) {
  const combat = room && room.gameState ? room.gameState.combat : null;
  if (!combat || !combat.isActive) {
    return null;
  }
  const idx = Number.isInteger(combat.currentTurnIndex) ? combat.currentTurnIndex : null;
  if (idx === null) {
    return null;
  }
  const order = Array.isArray(combat.turnOrder) ? combat.turnOrder : [];
  return order[idx] || null;
}

function canStartOrEndCombat(player, room) {
  if (!isCombatAuthorityEnabled()) {
    return { allowed: true };
  }
  if (!player) {
    return { allowed: false, reason: 'unknown_player' };
  }
  if (player.isGM) {
    return { allowed: true };
  }
  if (room && room.gm && room.gm.socketId && room.gm.socketId === player.socketId) {
    return { allowed: true };
  }
  if (room && room.gm && room.gm.id && room.gm.id === player.id) {
    return { allowed: true };
  }
  return { allowed: false, reason: 'gm_only' };
}

function canChangeTurn(player, room) {
  if (!isCombatAuthorityEnabled()) {
    return { allowed: true };
  }
  if (!player) {
    return { allowed: false, reason: 'unknown_player' };
  }
  if (player.isGM) {
    return { allowed: true };
  }
  if (room && room.gm && room.gm.socketId && room.gm.socketId === player.socketId) {
    return { allowed: true };
  }
  if (room && room.gm && room.gm.id && room.gm.id === player.id) {
    return { allowed: true };
  }

  const currentCombatant = _getCurrentCombatant(room);
  if (currentCombatant && _combatantControllerMatches(currentCombatant, player)) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'not_turn_holder' };
}

module.exports = {
  isCombatAuthorityEnabled,
  canStartOrEndCombat,
  canChangeTurn,
  _combatantControllerMatches,
  _getCurrentCombatant
};
