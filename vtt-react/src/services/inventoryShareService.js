/**
 * Project 4 H14: explicit, session-scoped GM inventory sharing.
 *
 * The owner deliberately grants a read-only projection bound by the server to
 * the exact room/session, character, owner and current GM. The owner can
 * revoke it; consent never silently returns after departure/rejoin.
 */

function getMultiplayerSocket() {
  try {
    const { getStore } = require('../store/storeRegistry');
    const presence = getStore('presenceStore') || require('../store/presenceStore').default;
    return presence?.getState?.().socket || null;
  } catch (_error) {
    return null;
  }
}

function requestShareEvent(event, payload, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const socket = getMultiplayerSocket();
    if (!socket || !socket.connected) {
      reject(new Error('Multiplayer connection unavailable'));
      return;
    }
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) {return;}
      settled = true;
      reject(new Error(`Inventory share ${event} timed out`));
    }, timeoutMs);
    socket.emit(event, payload, (response) => {
      if (settled) {return;}
      settled = true;
      clearTimeout(timer);
      if (response && response.success) {
        resolve(response);
      } else {
        const error = new Error((response && response.error) || 'Inventory share request failed');
        error.code = response && response.code;
        reject(error);
      }
    });
  });
}

export function grantGmInventoryShare(roomId, characterId) {
  return requestShareEvent('inventory_share_grant', { roomId, characterId });
}

export function revokeGmInventoryShare(roomId, characterId) {
  return requestShareEvent('inventory_share_revoke', { roomId, characterId });
}
