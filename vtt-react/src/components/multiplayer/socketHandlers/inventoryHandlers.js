import useCharacterStore from '../../../store/characterStore';
import useInventoryStore from '../../../store/inventoryStore';
import useSharedInventoryStore from '../../../store/sharedInventoryStore';

/**
 * Inventory updates broadcast by other room members.
 *
 * Project 4 boundary: the server delivers private inventory only to the
 * character owner's authorized devices and, with explicit owner consent, to
 * the bound current GM. The client still verifies that an update targets this
 * device's active character before applying it, giving same-account
 * cross-device sync without clobbering unrelated local state.
 *
 * GM-consented projections are kept in a separate read-only store and are
 * never applied to the GM's own inventory.
 */

export function registerInventoryHandlers(ctx) {
  const { socket } = ctx;
  if (!socket) return () => {};

  const onInventoryUpdate = (data) => {
    if (!data || !data.playerId || !data.inventoryData) return;

    if (data.sharedWithGm === true) {
      // Explicit owner-consented read-only view for the current GM.
      useSharedInventoryStore.getState().setSharedView(data.playerId, {
        characterId: data.playerId,
        ownerUserId: data.ownerUserId || null,
        inventoryData: data.inventoryData,
        changeType: data.changeType
      });
      return;
    }

    const currentCharacterId = useCharacterStore.getState().currentCharacterId;
    if (!currentCharacterId || data.playerId !== currentCharacterId) return;

    try {
      // Preserve the wire retry-stable updateId into the actual application
      // seam so duplicate deliveries apply once.
      useInventoryStore.getState().applyRemoteInventory({
        ...data.inventoryData,
        updateId: data.updateId || data.inventoryData.updateId
      });
    } catch (error) {
      console.error('Failed to apply remote inventory update:', error);
    }
  };

  const onShareActive = (data) => {
    if (!data || !data.characterId) return;
    useSharedInventoryStore.getState().markPending(data.characterId, {
      ownerUserId: data.ownerUserId || null
    });
  };

  const onShareEnded = (data) => {
    if (!data || !data.characterId) return;
    useSharedInventoryStore.getState().removeSharedView(data.characterId);
  };

  const onShareStatus = (data) => {
    if (!data || !data.characterId) return;
    if (data.active !== true) useSharedInventoryStore.getState().removeSharedView(data.characterId);
  };

  socket.on('inventory_update', onInventoryUpdate);
  socket.on('inventory_share_active', onShareActive);
  socket.on('inventory_share_ended', onShareEnded);
  socket.on('inventory_share_status', onShareStatus);

  return () => {
    socket.off('inventory_update', onInventoryUpdate);
    socket.off('inventory_share_active', onShareActive);
    socket.off('inventory_share_ended', onShareEnded);
    socket.off('inventory_share_status', onShareStatus);
  };
}

export function resetSharedInventoryViews() {
  useSharedInventoryStore.getState().clearSharedViews();
}
