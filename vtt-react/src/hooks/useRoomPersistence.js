/**
 * Room Persistence Hook
 *
 * Automatically saves and loads room runtime state to/from Firebase.
 * Handles tokens, grid items, environmental objects, combat state, chat, etc.
 */

import { useEffect, useCallback, useRef } from 'react';
import { useRealtimeSync } from './useRealtimeSync';

export const useRoomPersistence = (roomId) => {
  const useAuthStore = require('../store/authStore').default;
  const persistenceService = require('../services/firebase/persistenceService').default;
  const { user } = useAuthStore();
  // Call useGameStore unconditionally (React hooks rules) and use roomId prop as primary source
  const storeRoomId = require('../store/gameStore').default(state => state.currentRoomId);
  const currentRoomId = roomId || storeRoomId;

  // Auto-save timer refs
  const roomStateTimerRef = useRef(null);
  const lastSavedStateRef = useRef(null);
  // Latest realtimeSync API kept in a ref so save/schedule callbacks stay
  // stable. The hook's returned object changes identity on every connection /
  // conflict state change; putting it in effect deps re-subscribed the store
  // listeners (and reset the save debounce) on every render.
  const realtimeSyncRef = useRef(null);

  // Debounced auto-save delay (3 seconds for room data)
  const AUTO_SAVE_DELAY = 3000;

  /**
   * Collect current room state for persistence
   */
  const collectRoomState = useCallback(async () => {
    // Don't save if no room or user is guest
    if (!currentRoomId || !user || user.isGuest) {
      return null;
    }

    try {
      // Import stores dynamically to avoid circular dependencies
      const [
        characterTokenStoreModule,
        gridItemStoreModule,
        creatureStoreModule,
        levelEditorStoreModule,
        combatStoreModule,
        chatStoreModule,
        conditionStoreModule
      ] = await Promise.all([
        import('../store/characterTokenStore'),
        import('../store/gridItemStore'),
        import('../store/creatureStore'),
        import('../store/levelEditorStore'),
        import('../store/combatStore'),
        import('../store/chatStore'),
        import('../store/conditionStore')
      ]);

      const characterTokenState = characterTokenStoreModule.default.getState();
      const gridItemState = gridItemStoreModule.default.getState();
      const creatureState = creatureStoreModule.default.getState();
      const levelEditorState = levelEditorStoreModule.default.getState();
      const combatState = combatStoreModule.default.getState();
      const chatState = chatStoreModule.default.getState();
      const conditionState = conditionStoreModule.default.getState();

      return {
        // Token placements
        characterTokens: characterTokenState.characterTokens || [],
        creatureTokens: creatureState.tokens || [],

        // Items on the grid
        gridItems: gridItemState.gridItems || [],

        // Environmental objects (chests, doors, portals, GM notes)
        environmentalObjects: levelEditorState.dndElements || [],

        // Combat state
        combat: {
          isActive: combatState.isInCombat || false,
          currentTurn: combatState.currentTurn || 0,
          turnOrder: combatState.turnOrder || [],
          round: combatState.round || 0,
          combatLog: combatState.combatLog || []
        },

        // Chat history (limited to prevent storage bloat)
        chatHistory: {
          party: chatState.notifications?.social?.slice(-50) || [],
          combat: chatState.notifications?.combat?.slice(-25) || [],
          loot: chatState.notifications?.loot?.slice(-25) || []
        },

        // Active buffs and debuffs
        buffsAndDebuffs: {
          buffs: conditionState.activeBuffs || [],
          debuffs: conditionState.activeDebuffs || []
        },

        version: 1
      };
    } catch (error) {
      console.error('Error collecting room state:', error);
      return null;
    }
  }, [currentRoomId, user]);

  // Real-time sync for cross-device room synchronization
  const handleRemoteRoomChange = useCallback((remoteData, changeType) => {
    if (changeType === 'remote-update' || changeType === 'conflict-resolved-remote') {
      console.log('🔄 Remote room update received:', changeType);

      // Import stores dynamically and update them
      (async () => {
        const [
          characterTokenStoreModule,
          gridItemStoreModule,
          creatureStoreModule,
          levelEditorStoreModule,
          combatStoreModule,
          chatStoreModule,
          conditionStoreModule
        ] = await Promise.all([
          import('../store/characterTokenStore'),
          import('../store/gridItemStore'),
          import('../store/creatureStore'),
          import('../store/levelEditorStore'),
          import('../store/combatStore'),
          import('../store/chatStore'),
          import('../store/conditionStore')
        ]);

        // Update character tokens
        if (remoteData.characterTokens) {
          characterTokenStoreModule.default.setState({
            characterTokens: remoteData.characterTokens
          });
        }

        // Update grid items
        if (remoteData.gridItems) {
          gridItemStoreModule.default.setState({
            gridItems: remoteData.gridItems
          });
        }

        // Update creature tokens
        if (remoteData.creatureTokens) {
          creatureStoreModule.default.setState({
            tokens: remoteData.creatureTokens
          });
        }

        // Update environmental objects
        if (remoteData.environmentalObjects) {
          levelEditorStoreModule.default.setState({
            dndElements: remoteData.environmentalObjects
          });
        }

        // Update combat state
        if (remoteData.combat) {
          combatStoreModule.default.setState({
            isInCombat: remoteData.combat.isActive,
            currentTurn: remoteData.combat.currentTurn,
            turnOrder: remoteData.combat.turnOrder,
            round: remoteData.combat.round,
            combatLog: remoteData.combat.combatLog
          });
        }

        // Update chat history
        if (remoteData.chatHistory) {
          chatStoreModule.default.setState({
            notifications: {
              social: remoteData.chatHistory.party || [],
              combat: remoteData.chatHistory.combat || [],
              loot: remoteData.chatHistory.loot || []
            }
          });
        }

        // Update buffs and debuffs
        if (remoteData.buffsAndDebuffs) {
          conditionStoreModule.default.setState({
            activeBuffs: remoteData.buffsAndDebuffs.buffs || [],
            activeDebuffs: remoteData.buffsAndDebuffs.debuffs || []
          });
        }

        // Record the applied remote state as "last saved" so the auto-save
        // subscription does not immediately write the same data back (which
        // would bounce between clients as an endless write echo).
        lastSavedStateRef.current = JSON.stringify({
          characterTokens: remoteData.characterTokens || [],
          creatureTokens: remoteData.creatureTokens || [],
          gridItems: remoteData.gridItems || [],
          environmentalObjects: remoteData.environmentalObjects || [],
          combat: remoteData.combat || null,
          chatHistory: remoteData.chatHistory || null,
          buffsAndDebuffs: remoteData.buffsAndDebuffs || null,
          version: remoteData.version || 1
        });

        console.log('✅ Room state updated from remote changes');
      })();
    }
  }, []);

  const realtimeSync = useRealtimeSync(
    `users/${user?.uid}/roomStates`,
    currentRoomId,
    handleRemoteRoomChange,
    {
      enabled: !!user && !user.isGuest && !!currentRoomId,
      conflictResolution: 'remote-wins' // GM changes usually take precedence
    }
  );

  realtimeSyncRef.current = realtimeSync;

  /**
   * Save room state to Firebase
   */
  const saveRoomState = useCallback(async (stateData = null) => {
    if (!user || user.isGuest || !currentRoomId) {
      return { success: false, reason: 'No authenticated user or room' };
    }

    const dataToSave = stateData || await collectRoomState();
    if (!dataToSave) {
      return { success: false, reason: 'No data to save' };
    }

    try {
      const result = await persistenceService.saveRoomState(user.uid, currentRoomId, dataToSave);

      if (result.success) {
        lastSavedStateRef.current = JSON.stringify(dataToSave);
        // Pass the write token so the listener ignores our own echo.
        realtimeSyncRef.current?.markLocalSave(result.writeToken);
        console.log(`💾 Room state saved for ${currentRoomId}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to save room state:', error);
      return { success: false, error: error.message };
    }
  }, [user, currentRoomId, collectRoomState, persistenceService]);

  /**
   * Load room state from Firebase
   */
  const loadRoomState = useCallback(async () => {
    if (!user || user.isGuest || !currentRoomId) {
      return { success: false, reason: 'No authenticated user or room' };
    }

    try {
      const result = await persistenceService.loadRoomState(user.uid, currentRoomId);

      if (result) {
        // Import stores dynamically and update them with loaded data
        const [
          characterTokenStoreModule,
          gridItemStoreModule,
          creatureStoreModule,
          levelEditorStoreModule,
          combatStoreModule,
          chatStoreModule,
          conditionStoreModule
        ] = await Promise.all([
          import('../store/characterTokenStore'),
          import('../store/gridItemStore'),
          import('../store/creatureStore'),
          import('../store/levelEditorStore'),
          import('../store/combatStore'),
          import('../store/chatStore'),
          import('../store/conditionStore')
        ]);

        // Update character tokens
        if (result.characterTokens) {
          characterTokenStoreModule.default.setState({
            characterTokens: result.characterTokens
          });
        }

        // Update creature tokens
        if (result.creatureTokens) {
          creatureStoreModule.default.setState({
            tokens: result.creatureTokens
          });
        }

        // Update grid items
        if (result.gridItems) {
          gridItemStoreModule.default.setState({
            gridItems: result.gridItems
          });
        }

        // Update environmental objects
        if (result.environmentalObjects) {
          levelEditorStoreModule.default.setState({
            dndElements: result.environmentalObjects
          });
        }

        // Update combat state
        if (result.combat) {
          combatStoreModule.default.setState({
            isInCombat: result.combat.isActive,
            currentTurn: result.combat.currentTurn,
            turnOrder: result.combat.turnOrder,
            round: result.combat.round,
            combatLog: result.combat.combatLog
          });
        }

        // Update chat history
        if (result.chatHistory) {
          chatStoreModule.default.setState({
            notifications: {
              social: result.chatHistory.party || [],
              combat: result.chatHistory.combat || [],
              loot: result.chatHistory.loot || []
            }
          });
        }

        // Update buffs and debuffs
        if (result.buffsAndDebuffs) {
          conditionStoreModule.default.setState({
            activeBuffs: result.buffsAndDebuffs.buffs || [],
            activeDebuffs: result.buffsAndDebuffs.debuffs || []
          });
        }

        lastSavedStateRef.current = JSON.stringify(result);
        console.log(`📂 Room state loaded for ${currentRoomId}`);
        return { success: true, data: result };
      } else {
        console.log(`📂 No saved room state found for ${currentRoomId}, using defaults`);
        return { success: false, reason: 'No saved data found' };
      }
    } catch (error) {
      console.error('Failed to load room state:', error);
      return { success: false, error: error.message };
    }
  }, [user, currentRoomId, persistenceService]);

  /**
   * Auto-save room state when it changes
   */
  const scheduleAutoSave = useCallback(() => {
    // A local change is being scheduled - flag it so a concurrent remote update
    // can be detected as a conflict. (This used to run in a separate effect
    // that re-fired on every render, permanently marking the room dirty.)
    realtimeSyncRef.current?.markLocalChange('room-state');

    // Clear existing timer
    if (roomStateTimerRef.current) {
      clearTimeout(roomStateTimerRef.current);
    }

    // Set new auto-save timer
    roomStateTimerRef.current = setTimeout(async () => {
      roomStateTimerRef.current = null;
      const currentState = await collectRoomState();
      if (currentState) {
        const currentStateStr = JSON.stringify(currentState);

        // Only save if state has actually changed
        if (currentStateStr !== lastSavedStateRef.current) {
          await saveRoomState(currentState);
        }
      }
    }, AUTO_SAVE_DELAY);
  }, [collectRoomState, saveRoomState]);

  /**
   * Force immediate save
   */
  const forceSave = useCallback(async () => {
    if (roomStateTimerRef.current) {
      clearTimeout(roomStateTimerRef.current);
      roomStateTimerRef.current = null;
    }

    return await saveRoomState();
  }, [saveRoomState]);

  // Load room state when room changes
  useEffect(() => {
    if (user && !user.isGuest && currentRoomId) {
      loadRoomState();
    }
  }, [user, currentRoomId, loadRoomState]);

  // Auto-save when room state changes.
  // Subscribe to every store that `collectRoomState` reads from, otherwise
  // character-token moves, grid items, environmental objects (doors/chests),
  // chat and buffs were collected but never actually triggered a save.
  useEffect(() => {
    let isMounted = true;
    const unsubscribers = [];

    if (!user || user.isGuest || !currentRoomId) {
      return undefined;
    }

    Promise.all([
      import('../store/creatureStore'),
      import('../store/characterTokenStore'),
      import('../store/gridItemStore'),
      import('../store/levelEditorStore'),
      import('../store/combatStore'),
      import('../store/chatStore'),
      import('../store/conditionStore')
    ]).then(([creatureStoreModule, characterTokenStoreModule, gridItemStoreModule, levelEditorStoreModule, combatStoreModule, chatStoreModule, conditionStoreModule]) => {
      if (!isMounted) return;

      const creatureStore = creatureStoreModule.default;
      const characterTokenStore = characterTokenStoreModule.default;
      const gridItemStore = gridItemStoreModule.default;
      const levelEditorStore = levelEditorStoreModule.default;
      const combatStore = combatStoreModule.default;
      const chatStore = chatStoreModule.default;
      const conditionStore = conditionStoreModule.default;

      const watch = (store, selector, label) =>
        store.subscribe((state, prevState) => {
          if (selector(state, prevState)) {
            scheduleAutoSave();
            if (process.env.NODE_ENV === 'development') {
              console.debug(`[RoomPersistence] ${label} changed, scheduling auto-save`);
            }
          }
        });

      unsubscribers.push(
        watch(creatureStore, (s, p) => s.tokens !== p.tokens, 'creature tokens'),
        watch(characterTokenStore, (s, p) => s.characterTokens !== p.characterTokens, 'character tokens'),
        watch(gridItemStore, (s, p) => s.gridItems !== p.gridItems, 'grid items'),
        watch(levelEditorStore, (s, p) => s.dndElements !== p.dndElements, 'environmental objects'),
        watch(combatStore, (s, p) => s.isInCombat !== p.isInCombat || s.currentTurn !== p.currentTurn || s.round !== p.round || s.combatLog !== p.combatLog, 'combat'),
        watch(chatStore, (s, p) => s.notifications !== p.notifications, 'chat'),
        watch(conditionStore, (s, p) => s.activeBuffs !== p.activeBuffs || s.activeDebuffs !== p.activeDebuffs, 'conditions')
      );
    });

    // Cleanup timer and subscriptions on unmount
    return () => {
      isMounted = false;
      if (roomStateTimerRef.current) {
        clearTimeout(roomStateTimerRef.current);
        roomStateTimerRef.current = null;
      }
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [
    // Watch for major room state changes (all stable identities)
    currentRoomId,
    scheduleAutoSave,
    user
  ]);

  return {
    // State
    isGuestUser: user?.isGuest || false,
    isAuthenticated: !!user && !user.isGuest,

    // Actions
    saveRoomState,
    loadRoomState,
    forceSave,

    // Utilities
    collectRoomState
  };
};
