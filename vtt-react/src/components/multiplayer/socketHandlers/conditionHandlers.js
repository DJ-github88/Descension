export function registerConditionHandlers(ctx) {
  const {
    socket, addNotification, currentPlayerRef, currentPlayer
  } = ctx;
    if (!socket) return;

    socket.on('debuff_update', (data) => {
      if (!data) return;
      const { type, data: debuffData, senderSocketId } = data;

      // Skip if we sent this
      if (senderSocketId === socket?.id) return;

      console.log('ðŸ¥€ Received debuff update:', type, debuffData);

      Promise.all([
        import('../../../store/conditionStore'),
        import('../../../store/gameStore'),
        import('../../../store/authStore')
      ]).then(([{ default: useConditionStore }, { default: useGameStore }, { default: useAuthStore }]) => {
        const conditionStore = useConditionStore.getState();
        const gameStore = useGameStore.getState();
        const authStore = useAuthStore.getState();

        const remappedDebuffData = { ...debuffData };
        if (debuffData.targetId) {
          const myPlayerId = gameStore.currentPlayer?.id;
          const myUserId = authStore.user?.uid;
          if (debuffData.targetId === myPlayerId || debuffData.targetId === myUserId) {
            remappedDebuffData.targetId = 'current-player';
            console.log('ðŸ”„ Remapped debuff targetId to current-player');
          }
        }

        if (type === 'debuff_added') {
          conditionStore.addCondition('debuff', remappedDebuffData, true);
        } else if (type === 'debuff_removed') {
          conditionStore.removeCondition('debuff', data.debuffId || debuffData.id, true);
        }
      });
    });

    socket.on('sync_gameplay_settings', (data) => {
      if (!data) return;
      console.log('âš™ï¸ Received synchronized gameplay settings from GM:', data);

      Promise.all([
        import('../../../store/settingsStore'),
        import('../../../store/gameStore'),
        import('../../../store/levelEditorStore'),
        import('../../../store/characterTokenStore')
      ]).then(([{ default: useSettingsStore }, { default: useGameStore }, { default: useLevelEditorStore }, { default: useCharacterTokenStore }]) => {
        const settingsStore = useSettingsStore.getState();
        const gameStore = useGameStore.getState();
        const levelEditorStore = useLevelEditorStore.getState();
        const characterTokenStore = useCharacterTokenStore.getState();

        // Update settings in both stores to ensure consistency
        if (data.feetPerTile !== undefined) {
          settingsStore.setFeetPerTile(data.feetPerTile);
          gameStore.setFeetPerTile(data.feetPerTile);
          console.log(`ðŸ“ Synced Grid Scale: ${data.feetPerTile} ft`);
        }

        if (data.showMovementVisualization !== undefined) {
          settingsStore.setShowMovementVisualization(data.showMovementVisualization);
          gameStore.setShowMovementVisualization(data.showMovementVisualization);
          console.log(`âœ¨ Synced Movement Visualization: ${data.showMovementVisualization}`);
        }

        if (data.movementLineColor !== undefined) {
          settingsStore.setMovementLineColor(data.movementLineColor);
          gameStore.setMovementLineColor(data.movementLineColor);
        }

        if (data.movementLineWidth !== undefined) {
          settingsStore.setMovementLineWidth(data.movementLineWidth);
          gameStore.setMovementLineWidth(data.movementLineWidth);
        }

        // Update grid settings if provided (real-time sync)
        if (data.gridSize !== undefined) gameStore.setGridSize(data.gridSize);
        if (data.gridLineColor !== undefined) gameStore.setGridLineColor(data.gridLineColor);
        if (data.gridLineThickness !== undefined) gameStore.setGridLineThickness(data.gridLineThickness);
        if (data.gridLineOpacity !== undefined) gameStore.setGridLineOpacity(data.gridLineOpacity);
        if (data.gridBackgroundColor !== undefined) gameStore.setGridBackgroundColor(data.gridBackgroundColor);
        if (data.showGrid !== undefined) gameStore.setShowGrid(data.showGrid);

        if (data.defaultViewFromToken !== undefined) {
          settingsStore.setDefaultViewFromToken(data.defaultViewFromToken);
          gameStore.setDefaultViewFromToken(data.defaultViewFromToken);
          console.log(`ðŸ‘ï¸ Synced Default View From Token: ${data.defaultViewFromToken}`);

          // If GM forced View from Token, and we're a player, find our token and snap view to it
          if (data.defaultViewFromToken && !gameStore.isGMMode) {
            // Wait a moment for store to settle if needed, or use refreshed getPlayerToken
            const playerToken = characterTokenStore.getPlayerToken();
            if (playerToken) {
              console.log('ðŸ›¡ï¸ GM forced View from Token. Snapping player view to token:', playerToken.id);
              levelEditorStore.playerViewFromTokenDisabled = false;
              levelEditorStore.setViewingFromToken({
                id: playerToken.id,
                type: 'character',
                characterId: playerToken.playerId || 'local_player',
                position: playerToken.position
              });
            } else {
              console.warn('âš ï¸ GM forced View from Token but no player token found to snap to');
            }
          }
        }


        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Game Master updated tactical settings for the session.`,
          isSystem: true,
          timestamp: new Date().toISOString()
        });
      }).catch(error => {
        console.error('Failed to sync gameplay settings:', error);
      });
    });

    socket.on('buff_update', (data) => {
      // Import condition store dynamically to avoid circular dependencies
      Promise.all([
        import('../../../store/conditionStore'),
        import('../../../store/gameStore'),
        import('../../../store/authStore')
      ]).then(([{ default: useConditionStore }, { default: useGameStore }, { default: useAuthStore }]) => {
        const conditionStore = useConditionStore.getState();
        const gameStore = useGameStore.getState();
        const authStore = useAuthStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayerRef.current?.id) {
          // Remap targetId if this buff is for us
          const remapTargetId = (buffData) => {
            if (!buffData || !buffData.targetId) return buffData;
            const myPlayerId = gameStore.currentPlayer?.id;
            const myUserId = authStore.user?.uid;
            
            if (buffData.targetId === myPlayerId || buffData.targetId === myUserId) {
              return { ...buffData, targetId: 'current-player' };
            }
            return buffData;
          };

          switch (data.type) {
            case 'buff_added':
              // Add the new buff with remapped targetId
              if (data.data && data.data.id) {
                conditionStore.addCondition('buff', remapTargetId(data.data), true);
              }
              break;

            case 'buff_removed':
              // Remove the buff
              if (data.data && data.data.buffId) {
                conditionStore.removeCondition('buff', data.data.buffId, true);
              }
              break;
          }
        }
      });
    });

    socket.on('debuff_update', (data) => {
      // Import condition store dynamically to avoid circular dependencies
      Promise.all([
        import('../../../store/conditionStore'),
        import('../../../store/gameStore'),
        import('../../../store/authStore')
      ]).then(([{ default: useConditionStore }, { default: useGameStore }, { default: useAuthStore }]) => {
        const conditionStore = useConditionStore.getState();
        const gameStore = useGameStore.getState();
        const authStore = useAuthStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayerRef.current?.id) {
          // Remap targetId if this debuff is for us
          const remapTargetId = (debuffData) => {
            if (!debuffData || !debuffData.targetId) return debuffData;
            const myPlayerId = gameStore.currentPlayer?.id;
            const myUserId = authStore.user?.uid;
            
            if (debuffData.targetId === myPlayerId || debuffData.targetId === myUserId) {
              return { ...debuffData, targetId: 'current-player' };
            }
            return debuffData;
          };

          switch (data.type) {
            case 'debuff_added':
              // Add the new debuff with remapped targetId
              if (data.data && data.data.id) {
                conditionStore.addCondition('debuff', remapTargetId(data.data), true);
              }
              break;

            case 'debuff_removed':
              // Remove the debuff
              if (data.data && data.data.debuffId) {
                conditionStore.removeCondition('debuff', data.data.debuffId, true);
              }
              break;
          }
        }
      });
    });

    socket.on('dice_update', (data) => {
      // Import dice store dynamically to avoid circular dependencies
      import('../../../store/diceStore').then(({ default: useDiceStore }) => {
        const diceStore = useDiceStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayer?.id) {
          switch (data.type) {
            case 'dice_added':
              // Add dice to selection
              if (data.data && data.data.diceType && data.data.quantity) {
                diceStore.addDice(data.data.diceType, data.data.quantity);
              }
              break;

            case 'dice_removed':
              // Remove dice from selection
              if (data.data && data.data.diceType && data.data.quantity) {
                diceStore.removeDice(data.data.diceType, data.data.quantity);
              }
              break;

            case 'dice_quantity_set':
              // Set dice quantity
              if (data.data && data.data.diceType !== undefined && data.data.quantity !== undefined) {
                diceStore.setDiceQuantity(data.data.diceType, data.data.quantity);
              }
              break;

            case 'dice_rolled':
              // Show dice roll results from other players
              if (data.data && data.data.results) {
                // Add to roll history without triggering local roll
                const rollEntry = {
                  ...data.data,
                  playerName: data.playerName,
                  fromNetwork: true
                };
                // This could trigger a notification or add to a shared roll history
              }
              break;
          }
        }
      });
    });

  return () => {
    socket.off('debuff_update');
    socket.off('sync_gameplay_settings');
    socket.off('buff_update');
    socket.off('debuff_update');
    socket.off('dice_update');
  };
}
