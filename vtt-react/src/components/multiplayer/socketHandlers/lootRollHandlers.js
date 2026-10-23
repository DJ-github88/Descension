import useLootRollStore, { LOOT_REVEAL_SETTLE_MS } from '../../../store/lootRollStore';
import useGridItemStore from '../../../store/gridItemStore';
import useInventoryStore from '../../../store/inventoryStore';

const CHOICE_LABEL = { need: 'Need', greed: 'Greed' };

/**
 * Group loot rolls (Need / Greed / Pass, d20). The server owns the rolls and
 * timers; these handlers mirror its state into lootRollStore and auto-loot the
 * item when this player wins.
 */
export function registerLootRollHandlers(ctx) {
  const { socket, addNotification } = ctx;
  if (!socket) return undefined;

  const store = () => useLootRollStore.getState();

  const onStarted = (payload) => store().sessionStarted(payload);
  const onUpdated = ({ sessionId, item } = {}) => store().itemUpdated(sessionId, item);
  const onEnded = ({ sessionId } = {}) => store().sessionEnded(sessionId);

  const onResolved = ({ sessionId, item } = {}) => {
    const known = !!store().sessions[sessionId];
    store().itemResolved(sessionId, item);
    if (!known || !item || typeof addNotification !== 'function') return;

    let content;
    if (item.winner) {
      const how = CHOICE_LABEL[item.winner.category] || 'Roll';
      const rerolled = item.tiebreakHistory?.length ? ` after ${item.tiebreakHistory.length} reroll${item.tiebreakHistory.length > 1 ? 's' : ''}` : '';
      content = `${item.winner.name} won ${item.name} (${how} · d20 ${item.winner.roll}${rerolled}).`;
    } else {
      content = `Everyone passed on ${item.name} — it stays on the ground.`;
    }
    // Wait for the dice in the roll frame to land before announcing.
    setTimeout(() => {
      addNotification('social', {
        sender: { name: 'Loot', class: 'system', level: 0 },
        content,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    }, LOOT_REVEAL_SETTLE_MS);
  };

  // Server says we won: put the item straight into our inventory.
  const onWon = ({ gridItemId } = {}) => {
    if (!gridItemId) return;
    const tryLoot = (attempt = 0) => {
      const gridStore = useGridItemStore.getState();
      const exists = (gridStore.gridItems || []).some(gi => gi?.id === gridItemId);
      if (!exists) {
        // Orb may still be arriving, or we're on another map. If so it stays
        // reserved for us on the grid and we can click it later.
        if (attempt < 4) setTimeout(() => tryLoot(attempt + 1), 400);
        return;
      }
      const looterName = useInventoryStore.getState().characterName || 'Player';
      gridStore.lootItem(gridItemId, 'default', looterName, true, { force: true });
    };
    // Let the dice land first, then the item flies into the bags.
    setTimeout(() => tryLoot(), LOOT_REVEAL_SETTLE_MS);
  };

  socket.on('loot_roll_started', onStarted);
  socket.on('loot_roll_updated', onUpdated);
  socket.on('loot_roll_item_resolved', onResolved);
  socket.on('loot_roll_won', onWon);
  socket.on('loot_roll_ended', onEnded);

  return () => {
    socket.off('loot_roll_started', onStarted);
    socket.off('loot_roll_updated', onUpdated);
    socket.off('loot_roll_item_resolved', onResolved);
    socket.off('loot_roll_won', onWon);
    socket.off('loot_roll_ended', onEnded);
  };
}
