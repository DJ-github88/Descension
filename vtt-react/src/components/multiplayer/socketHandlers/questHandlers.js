export function registerQuestHandlers(ctx) {
  const {
    socket, isGMRef, addNotification
  } = ctx;
    socket.on('quest_shared', (data) => {
      const { quest, sharedBy } = data;

      // Import quest store and add the quest
      import('../../../store/questStore').then(({ default: useQuestStore }) => {
        const { addQuest } = useQuestStore.getState();

        // Create a new quest instance for the player (with unique ID)
        const playerQuest = {
          ...quest,
          id: `shared-${quest.id}-${Date.now()}`,
          status: 'active',
          dateReceived: new Date().toISOString(),
          sharedBy: sharedBy
        };

        addQuest(playerQuest);

        // Add notification to party chat
        import('../../../store/presenceStore').then(({ default: usePresenceStore }) => {
          const { addPartyChatMessage } = usePresenceStore.getState();
          addPartyChatMessage({
            id: `quest_shared_${Date.now()}`,
            senderId: 'system',
            senderName: 'Game Master',
            content: `${sharedBy} shared a quest: ${quest.title}`,
            timestamp: new Date().toISOString(),
            type: 'system'
          });
        });

        // Show notification
        addNotification('social', {
          sender: {
            name: 'System',
            class: 'System',
            level: 1
          },
          content: `You received a new quest: ${quest.title}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }).catch(error => {
        console.error('Failed to add shared quest:', error);
      });
    });

    socket.on('quest_shared', (data) => {
      // Only process for non-GM players
      if (isGMRef.current) return;

      import('../../../store/questStore').then(({ default: useQuestStore }) => {
        const { addPendingSharedQuest } = useQuestStore.getState();
        addPendingSharedQuest(data.quest, data.sharedBy);

        addNotification('social', {
          sender: { name: data.sharedBy?.name || 'Game Master', class: 'gm', level: 0 },
          content: `New quest offered: "${data.quest.title}"`,
          type: 'quest_shared',
          timestamp: data.timestamp
        });
      }).catch(error => {
        console.error('Failed to handle quest_shared:', error);
      });
    });

    socket.on('quest_share_confirmed', (data) => {
      if (!isGMRef.current) return;

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Quest "${data.questTitle}" shared with all players.`,
        type: 'system',
        timestamp: data.timestamp
      });
    });

    socket.on('quest_accepted_notification', (data) => {
      if (!isGMRef.current) return;

      // Update tracking status
      import('../../../store/questStore').then(({ default: useQuestStore }) => {
        const { updatePlayerShareStatus } = useQuestStore.getState();
        updatePlayerShareStatus(data.questId, data.playerId, data.playerName, 'accepted');
      }).catch(err => console.error('Failed to update share status:', err));

      addNotification('social', {
        sender: { name: data.playerName, class: 'player', level: 0 },
        content: `Accepted quest: "${data.questTitle}"`,
        type: 'quest_accepted',
        timestamp: data.timestamp
      });
    });

    socket.on('quest_declined_notification', (data) => {
      if (!isGMRef.current) return;

      // Update tracking status
      import('../../../store/questStore').then(({ default: useQuestStore }) => {
        const { updatePlayerShareStatus } = useQuestStore.getState();
        updatePlayerShareStatus(data.questId, data.playerId, data.playerName, 'declined');
      }).catch(err => console.error('Failed to update share status:', err));

      addNotification('social', {
        sender: { name: data.playerName, class: 'player', level: 0 },
        content: `Declined quest: "${data.questTitle}"`,
        type: 'quest_declined',
        timestamp: data.timestamp
      });
    });

    socket.on('quest_completion_pending', (data) => {
      if (!isGMRef.current) return;

      import('../../../store/questStore').then(({ default: useQuestStore }) => {
        const { addPendingRewardDelivery } = useQuestStore.getState();
        addPendingRewardDelivery(data.quest, data.playerId, data.playerName);

        addNotification('social', {
          sender: { name: data.playerName, class: 'player', level: 0 },
          content: `Requesting completion of quest: "${data.quest.title}"`,
          type: 'quest_completion_pending',
          timestamp: data.timestamp
        });
      }).catch(error => {
        console.error('Failed to handle quest_completion_pending:', error);
      });
    });

    socket.on('quest_completion_request_sent', (data) => {
      if (isGMRef.current) return;

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Completion request for "${data.questTitle}" sent to GM.`,
        type: 'system',
        timestamp: data.timestamp
      });
    });

    socket.on('rewards_received', (data) => {
      if (isGMRef.current) return;

      Promise.all([
        import('../../../store/questStore'),
        import('../../../store/characterStore'),
        import('../../../store/inventoryStore')
      ]).then(([questModule, characterModule, inventoryModule]) => {
        const useQuestStore = questModule.default;
        const useCharacterStore = characterModule.default;
        const useInventoryStore = inventoryModule.default;

        const { markSharedQuestCompleted } = useQuestStore.getState();
        const characterStore = useCharacterStore.getState();
        const inventoryStore = useInventoryStore.getState();

        // Mark quest as completed
        markSharedQuestCompleted(data.questId);

        // Add experience
        if (data.rewards?.experience > 0) {
          const currentExp = characterStore.experience || 0;
          characterStore.updateCharacterInfo('experience', currentExp + data.rewards.experience);
        }

        // Add currency
        if (data.rewards?.currency) {
          const currentCurrency = inventoryStore.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 };
          inventoryStore.updateCurrency({
            platinum: (currentCurrency.platinum || 0) + (data.rewards.currency.platinum || 0),
            gold: (currentCurrency.gold || 0) + (data.rewards.currency.gold || 0),
            silver: (currentCurrency.silver || 0) + (data.rewards.currency.silver || 0),
            copper: (currentCurrency.copper || 0) + (data.rewards.currency.copper || 0)
          });
        }

        // Add items to inventory
        if (data.rewards?.items && data.rewards.items.length > 0) {
          data.rewards.items.forEach(item => {
            try {
              inventoryStore.addItemFromLibrary(item);
            } catch (err) {
              console.warn('Failed to add reward item:', err);
            }
          });
        }

        // Notify player
        addNotification('social', {
          sender: { name: data.deliveredBy || 'Game Master', class: 'gm', level: 0 },
          content: `Quest rewards received for "${data.questTitle}"!`,
          type: 'rewards_received',
          timestamp: data.timestamp
        });
      }).catch(error => {
        console.error('Failed to handle rewards_received:', error);
      });
    });

    socket.on('rewards_delivery_confirmed', (data) => {
      if (!isGMRef.current) return;

      import('../../../store/questStore').then(({ default: useQuestStore }) => {
        const { confirmRewardDelivery } = useQuestStore.getState();
        confirmRewardDelivery(data.questId, data.playerId);

        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Rewards delivered to ${data.playerName}.`,
          type: 'system',
          timestamp: data.timestamp
        });
      }).catch(error => {
        console.error('Failed to handle rewards_delivery_confirmed:', error);
      });
    });

    socket.on('completion_denied', (data) => {
      if (isGMRef.current) return;

      addNotification('social', {
        sender: { name: 'Game Master', class: 'gm', level: 0 },
        content: `Quest completion for "${data.questTitle}" was denied: ${data.reason || 'No reason provided'}`,
        type: 'completion_denied',
        timestamp: data.timestamp
      });
    });

  return () => {
    socket.off('quest_shared');
    socket.off('quest_share_confirmed');
    socket.off('quest_accepted_notification');
    socket.off('quest_declined_notification');
    socket.off('quest_completion_pending');
    socket.off('quest_completion_request_sent');
    socket.off('rewards_received');
    socket.off('rewards_delivery_confirmed');
    socket.off('completion_denied');
  };
}
