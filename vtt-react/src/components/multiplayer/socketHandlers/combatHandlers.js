import useCombatStore from '../../../store/combatStore';
import { applyRoomSnapshot } from '../../../services/silentRoomHydration';

export function registerCombatHandlers(ctx) {
  const {
    socket, currentPlayer, addNotification
  } = ctx;
    if (!socket) return;

    socket.on('combat_started', (data) => {
      if (!data) return;
      console.log('⚔️ Received combat_started from server:', data);

      const combatData = data.combat || data;

      // Update combat store with received state
      useCombatStore.getState().forceResetCombat(); // Clear any existing state

      // Set the combat state
      useCombatStore.setState({
        isInCombat: true,
        turnOrder: combatData.turnOrder || [],
        round: combatData.round || 1,
        currentTurnIndex: combatData.currentTurnIndex || 0,
        isSelectionMode: false,
        selectedTokens: new Set()
      });

      console.log('⚔️ Combat state synced - player should now see combat timeline');
    });

    socket.on('combat_ended', (data) => {
      if (!data) return;
      console.log('ðŸ ³ï¸  Received combat_ended from server:', data);

      // Reset combat store
      useCombatStore.getState().forceResetCombat();

      console.log('ðŸ³ï¸ Combat ended - timeline hidden');
    });

    socket.on('combat_turn_changed', (data) => {
      if (!data) return;
      console.log('âš”ï¸ Received combat_turn_changed from server:', data);

      const combatState = useCombatStore.getState();
      if (combatState.isInCombat) {
        // Update combat store with new turn state
        useCombatStore.setState({
          currentTurnIndex: data.currentTurnIndex,
          round: data.round,
          turnOrder: data.turnOrder
        });
        console.log(`âš”ï¸ Combat turn synced - now on turn ${data.currentTurnIndex + 1}, round ${data.round}`);
      }
    });

    socket.on('combat_correction', (data) => {
      // Handle server corrections for predicted combat state
      // Apply corrections to local combat state
      if (data.discrepancies && data.discrepancies.length > 0) {
        // Update local combat state to match server
      }
    });

    socket.on('combat_state_sync', (data) => {
      // Full combat state replacement through the silent adapter: stored
      // fields are restored directly. No startCombat/nextTurn replay, no RNG,
      // no AP/resource/cooldown/timer side effects.
      if (!data) return;
      const combat = data.combat !== undefined ? data.combat : data;
      applyRoomSnapshot({ scope: 'section', sections: { combat: combat || null } });
    });

    socket.on('combat_action', (data) => {
      // Handle real-time combat actions
      console.log('Received combat action:', data);

      switch (data.type) {
        case 'turn_changed':
          // Update turn index and round
          if (data.newTurnIndex !== undefined) {
            // The combat store will be updated through the normal sync process
          }
          break;

        case 'initiative_updated':
          // Update initiative for a specific combatant
          if (data.combatantId && data.newInitiative !== undefined) {
            const combatStore = useCombatStore.getState();
            combatStore.updateInitiative(data.combatantId, data.newInitiative);
          }
          break;

        default:
          break;
      }
    });

    socket.on('spell_cast', (data) => {
      // Only process casts from other players (not our own)
      if (data.casterId && data.casterId !== currentPlayer?.id) {

        // Add notification to chat
        addNotification('combat', {
          sender: { name: data.casterName, class: 'player', level: 0 },
          content: `${data.casterName} cast ${data.spellName}${data.targetIds?.length > 0 ? ` on ${data.targetIds.length} target(s)` : ''}`,
          type: 'spell',
          spellData: data,
          timestamp: data.timestamp || new Date().toISOString()
        });

        // TODO: Apply spell effects to targets if needed
        // This would integrate with the combat system
      }
    });

    socket.on('ability_used', (data) => {
      // Only process abilities from other players
      if (data.usedBy && data.usedBy !== currentPlayer?.id) {

        // Add notification to chat
        addNotification('combat', {
          sender: { name: data.usedByName, class: 'player', level: 0 },
          content: `${data.usedByName} used ${data.abilityName} with ${data.creatureName}`,
          type: 'ability',
          abilityData: data,
          timestamp: data.timestamp || new Date().toISOString()
        });
      }
    });

    socket.on('combat_log', (data) => {
      if (data.playerId !== currentPlayer?.id) {
        const notification = {
          ...data.notification,
          id: data.notification?.id || crypto.randomUUID(),
          timestamp: data.notification?.timestamp || data.timestamp || new Date().toISOString(),
          fromNetwork: true
        };
        addNotification('combat', notification);
      }
    });

  return () => {
    socket.off('combat_started');
    socket.off('combat_ended');
    socket.off('combat_turn_changed');
    socket.off('combat_action');
    socket.off('combat_correction');
    socket.off('combat_state_sync');
    socket.off('spell_cast');
    socket.off('ability_used');
    socket.off('combat_log');
  };
}
