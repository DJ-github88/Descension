/**
 * Room Persistence Hook
 *
 * Project 3 scope: the personal `users/{uid}/roomStates/{roomId}` document is
 * an inert personal cache. It is never applied to shared gameplay stores in an
 * active multiplayer room, and it can never publish shared room state.
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

  const collectRoomState = useCallback(async () => {
    if (!currentRoomId || !user || user.isGuest) {
      return null;
    }

    try {
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
        characterTokens: characterTokenState.characterTokens || [],
        creatureTokens: creatureState.tokens || [],
        gridItems: gridItemState.gridItems || [],
        environmentalObjects: levelEditorState.dndElements || [],
        combat: {
          isActive: combatState.isInCombat || false,
          currentTurn: combatState.currentTurn || 0,
          turnOrder: combatState.turnOrder || [],
          round: combatState.round || 0,
          combatLog: combatState.combatLog || []
        },
        chatHistory: {
          party: chatState.notifications?.social?.slice(-50) || [],
          combat: chatState.notifications?.combat?.slice(-25) || [],
          loot: chatState.notifications?.loot?.slice(-25) || []
        },
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

  // Personal cache updates are recorded only. They never touch shared stores
  // in an active multiplayer room (frozen P3 personal-state allowlist).
  const handleRemoteRoomChange = useCallback((remoteData, changeType) => {
    if (changeType === 'remote-update' || changeType === 'conflict-resolved-remote') {
      lastSavedStateRef.current = JSON.stringify(remoteData || {});
    }
  }, []);

  const realtimeSync = useRealtimeSync(
    `users/${user?.uid}/roomStates`,
    currentRoomId,
    handleRemoteRoomChange,
    {
      enabled: !!user && !user.isGuest && !!currentRoomId,
      conflictResolution: 'remote-wins'
    }
  );

  realtimeSyncRef.current = realtimeSync;

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
        realtimeSyncRef.current?.markLocalSave(result.writeToken);
      }

      return result;
    } catch (error) {
      console.error('Failed to save room state:', error);
      return { success: false, error: error.message };
    }
  }, [user, currentRoomId, collectRoomState, persistenceService]);

  const loadRoomState = useCallback(async () => {
    if (!user || user.isGuest || !currentRoomId) {
      return { success: false, reason: 'No authenticated user or room' };
    }

    try {
      const result = await persistenceService.loadRoomState(user.uid, currentRoomId);

      if (result) {
        // Cache-only: record the fingerprint so the auto-save subscription
        // does not echo, and never apply shared domains to live stores.
        lastSavedStateRef.current = JSON.stringify(result);
        return { success: true, data: result, applied: false };
      }
      return { success: false, reason: 'No saved data found' };
    } catch (error) {
      console.error('Failed to load room state:', error);
      return { success: false, error: error.message };
    }
  }, [user, currentRoomId, persistenceService]);

  const scheduleAutoSave = useCallback(() => {
    realtimeSyncRef.current?.markLocalChange('room-state');

    if (roomStateTimerRef.current) {
      clearTimeout(roomStateTimerRef.current);
    }

    roomStateTimerRef.current = setTimeout(async () => {
      roomStateTimerRef.current = null;
      const currentState = await collectRoomState();
      if (currentState) {
        const currentStateStr = JSON.stringify(currentState);
        if (currentStateStr !== lastSavedStateRef.current) {
          await saveRoomState(currentState);
        }
      }
    }, AUTO_SAVE_DELAY);
  }, [collectRoomState, saveRoomState]);

  const forceSave = useCallback(async () => {
    if (roomStateTimerRef.current) {
      clearTimeout(roomStateTimerRef.current);
      roomStateTimerRef.current = null;
    }

    return await saveRoomState();
  }, [saveRoomState]);

  // Load the personal cache fingerprint when room changes (no store apply).
  useEffect(() => {
    if (user && !user.isGuest && currentRoomId) {
      loadRoomState();
    }
  }, [user, currentRoomId, loadRoomState]);

  // Personal cache auto-save subscription. Writes the user's own cache document
  // only; shared authority stays server-side.
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

      const watch = (store, selector) =>
        store.subscribe((state, prevState) => {
          if (selector(state, prevState)) {
            scheduleAutoSave();
          }
        });

      unsubscribers.push(
        watch(creatureStore, (s, p) => s.tokens !== p.tokens),
        watch(characterTokenStore, (s, p) => s.characterTokens !== p.characterTokens),
        watch(gridItemStore, (s, p) => s.gridItems !== p.gridItems),
        watch(levelEditorStore, (s, p) => s.dndElements !== p.dndElements),
        watch(combatStore, (s, p) => s.isInCombat !== p.isInCombat || s.currentTurn !== p.currentTurn || s.round !== p.round || s.combatLog !== p.combatLog),
        watch(chatStore, (s, p) => s.notifications !== p.notifications),
        watch(conditionStore, (s, p) => s.activeBuffs !== p.activeBuffs || s.activeDebuffs !== p.activeDebuffs)
      );
    });

    return () => {
      isMounted = false;
      if (roomStateTimerRef.current) {
        clearTimeout(roomStateTimerRef.current);
        roomStateTimerRef.current = null;
      }
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentRoomId, scheduleAutoSave, user]);

  return {
    isGuestUser: user?.isGuest || false,
    isAuthenticated: !!user && !user.isGuest,
    saveRoomState,
    loadRoomState,
    forceSave,
    collectRoomState
  };
};
