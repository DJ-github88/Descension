/**
 * Room Persistence Hook
 *
 * Automatically saves and loads room runtime state to/from Firebase.
 * Handles tokens, grid items, environmental objects, combat state, chat, etc.
 */

import { useEffect, useCallback, useRef } from 'react';
import useAuthStore from '../store/authStore';
import useGameStore from '../store/gameStore';
import persistenceService from '../services/firebase/persistenceService';
import { useRealtimeSync } from './useRealtimeSync';

export const useRoomPersistence = (roomId) => {
  const { user } = useAuthStore();
  const currentRoomId = roomId || useGameStore(state => state.currentRoomId);

  // Auto-save timer refs
  const roomStateTimerRef = useRef(null);
  const lastSavedStateRef = useRef(null);

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
        buffStoreModule,
        debuffStoreModule
      ] = await Promise.all([
        import('../store/characterTokenStore'),
        import('../store/gridItemStore'),
        import('../store/creatureStore'),
        import('../store/levelEditorStore'),
        import('../store/combatStore'),
        import('../store/chatStore'),
        import('../store/buffStore'),
        import('../store/debuffStore')
      ]);

      const characterTokenState = characterTokenStoreModule.default.getState();
      const gridItemState = gridItemStoreModule.default.getState();
      const creatureState = creatureStoreModule.default.getState();
      const levelEditorState = levelEditorStoreModule.default.getState();
      const combatState = combatStoreModule.default.getState();
      const chatState = chatStoreModule.default.getState();
      const buffState = buffStoreModule.default.getState();
      const debuffState = debuffStoreModule.default.getState();

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
          buffs: buffState.activeBuffs || [],
          debuffs: debuffState.activeDebuffs || []
        },

        version: 1
      };
    } catch (error) {
      console.error('Error collecting room state:', error);
      return null;
    }
  }, [currentRoomId, user]);

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
        realtimeSync.markLocalSave(new Date(result.data?.lastUpdated));
        console.log(`💾 Room state saved for ${currentRoomId}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to save room state:', error);
      return { success: false, error: error.message };
    }
  }, [user, currentRoomId, collectRoomState]);

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
          buffStoreModule,
          debuffStoreModule
        ] = await Promise.all([
          import('../store/characterTokenStore'),
          import('../store/gridItemStore'),
          import('../store/creatureStore'),
          import('../store/levelEditorStore'),
          import('../store/combatStore'),
          import('../store/chatStore'),
          import('../store/buffStore'),
          import('../store/debuffStore')
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
          buffStoreModule.default.setState({
            activeBuffs: result.buffsAndDebuffs.buffs || []
          });
          debuffStoreModule.default.setState({
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
  }, [user, currentRoomId]);

  /**
   * Auto-save room state when it changes
   */
  const scheduleAutoSave = useCallback(() => {
    // Clear existing timer
    if (roomStateTimerRef.current) {
      clearTimeout(roomStateTimerRef.current);
    }

    // Set new auto-save timer
    roomStateTimerRef.current = setTimeout(async () => {
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

  // Auto-save when room state changes (simplified - would need more specific watchers)
  useEffect(() => {
    if (user && !user.isGuest && currentRoomId) {
      scheduleAutoSave();
    }

    // Cleanup timer on unmount
    return () => {
      if (roomStateTimerRef.current) {
        clearTimeout(roomStateTimerRef.current);
      }
    };
  }, [
    // Watch for major room state changes
    currentRoomId,
    scheduleAutoSave,
    user
  ]);

  // Real-time sync for cross-device room synchronization
  const handleRemoteRoomChange = useCallback((remoteData, changeType) => {
    if (changeType === 'remote-update' || changeType === 'conflict-resolved-remote') {
      console.log('🔄 Remote room update received:', changeType);

      // Import stores dynamically and update them
      (async () => {
        const [
          gridItemStoreModule,
          creatureStoreModule,
          levelEditorStoreModule,
          combatStoreModule,
          chatStoreModule,
          buffStoreModule,
          debuffStoreModule
        ] = await Promise.all([
          import('../store/gridItemStore'),
          import('../store/creatureStore'),
          import('../store/levelEditorStore'),
          import('../store/combatStore'),
          import('../store/chatStore'),
          import('../store/buffStore'),
          import('../store/debuffStore')
        ]);

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
          buffStoreModule.default.setState({
            activeBuffs: remoteData.buffsAndDebuffs.buffs || []
          });
          debuffStoreModule.default.setState({
            activeDebuffs: remoteData.buffsAndDebuffs.debuffs || []
          });
        }

        console.log('✅ Room state updated from remote changes');
      })();
    }
  }, []);

  const realtimeSync = useRealtimeSync(
    'roomStates',
    currentRoomId,
    handleRemoteRoomChange,
    {
      enabled: !!user && !user.isGuest && !!currentRoomId,
      conflictResolution: 'remote-wins', // GM changes usually take precedence
      onConflict: (conflictInfo) => {
        console.warn('⚠️ Room data conflict detected - accepting remote (GM) changes');
        conflictInfo.resolveWithRemote();
      }
    }
  );

  // Mark local changes for conflict detection
  useEffect(() => {
    if (user && !user.isGuest && currentRoomId) {
      realtimeSync.markLocalChange('room-state');
    }
  }, [user, currentRoomId, realtimeSync]);

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
