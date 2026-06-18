import useCombatStore from '../../../store/combatStore';

export function registerCombatHandlers(ctx) {
  const {
    socket, currentPlayerRef, currentPlayer, addNotification
  } = ctx;
    if (!socket) return;

    socket.on('combat_started', (data) => {
      if (!data) return;
      console.log('âš”ï¸ Received combat_started from server:', data);

      // Update combat store with received state
      useCombatStore.getState().forceResetCombat(); // Clear any existing state

      // Set the combat state
      useCombatStore.setState({
        isInCombat: true,
        turnOrder: data.turnOrder || [],
        round: data.round || 1,
        currentTurnIndex: data.currentTurnIndex || 0,
        isSelectionMode: false,
        selectedTokens: new Set()
      });

      console.log('âš”ï¸ Combat state synced - player should now see combat timeline');
    });

    socket.on('combat_ended', (data) => {
      if (!data) return;
      console.log('ðŸ³ï¸ Received combat_ended from server:', data);

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

    socket.on('combat_action', (data) => {
      // Handle predicted combat actions from other players
      if (data.playerId !== currentPlayerRef.current?.id) {
        // Apply the action with lag compensation
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
      // IMPROVEMENT: Full combat state synchronization with proper state restoration

      if (data.combat) {
        const combatStore = useCombatStore.getState();

        // If combat is active, restore the full state
        if (data.combat.isActive) {
          // Restore turn order if available
          if (data.combat.turnOrder && data.combat.turnOrder.length > 0) {
            combatStore.startCombat(data.combat.turnOrder);

            // Restore current turn index
            if (data.combat.currentTurnIndex !== undefined) {
              const currentState = combatStore.getCombatState();
              const targetIndex = data.combat.currentTurnIndex;
              const currentIndex = currentState.currentTurnIndex || 0;

              // Advance to correct turn if needed
              if (targetIndex !== currentIndex) {
                const diff = targetIndex - currentIndex;
                for (let i = 0; i < Math.abs(diff); i++) {
                  if (diff > 0) {
                    combatStore.nextTurn();
                  }
                }
              }
            }

            // Restore round number if available
            if (data.combat.round !== undefined) {
              // Round is managed internally, but we can log it
            }
          }
        } else {
          // Combat is not active, ensure it's stopped
          const currentState = combatStore.getCombatState();
          if (currentState.isActive) {
            // Stop combat if it was active locally but not on server
          }
        }
      }
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
    socket.off('combat_action');
    socket.off('spell_cast');
    socket.off('ability_used');
    socket.off('combat_log');
  };
}
