/**
 * Character Persistence Hook
 *
 * Automatically saves and loads character runtime state to/from Firebase.
 * Integrates with the character store to provide seamless persistence.
 */

import { useEffect, useCallback, useRef } from 'react';
import useAuthStore from '../store/authStore';
import useCharacterStore from '../store/characterStore';
import useInventoryStore from '../store/inventoryStore';
import useBuffStore from '../store/buffStore';
import useDebuffStore from '../store/debuffStore';
import useQuestStore from '../store/questStore';
import persistenceService from '../services/firebase/persistenceService';
import { useRealtimeSync } from './useRealtimeSync';

export const useCharacterPersistence = () => {
  const { user } = useAuthStore();
  const currentCharacterId = useCharacterStore(state => state.currentCharacterId);

  // Auto-save timer refs
  const characterStateTimerRef = useRef(null);
  const lastSavedStateRef = useRef(null);
  const lastStateHashRef = useRef(null);

  // Debounced auto-save delay (2 seconds)
  const AUTO_SAVE_DELAY = 2000;

  /**
   * Collect current character state for persistence
   */
  const collectCharacterState = useCallback(() => {
    // Don't save if no character is selected or user is guest
    if (!currentCharacterId || !user || user.isGuest) {
      return null;
    }

    // Get current state from all stores
    const characterState = useCharacterStore.getState();
    const inventoryState = useInventoryStore.getState();
    const buffState = useBuffStore.getState();
    const debuffState = useDebuffStore.getState();
    const questState = useQuestStore.getState();

    return {
      // Basic resources
      health: characterState.health,
      mana: characterState.mana,
      actionPoints: characterState.actionPoints,
      tempHealth: characterState.tempHealth || 0,
      tempMana: characterState.tempMana || 0,
      tempActionPoints: characterState.tempActionPoints || 0,
      exhaustionLevel: characterState.exhaustionLevel || 0,

      // Class-specific resources
      classResource: characterState.classResource,

      // Inventory
      inventory: inventoryState,

      // Equipment
      equipment: characterState.equipment,

      // Action bars (per room - will be handled separately)
      actionBars: {},

      // Buffs and debuffs
      buffs: buffState.activeBuffs || [],
      debuffs: debuffState.activeDebuffs || [],

      // Quest state
      quests: questState,

      // Quest progress
      questProgress: characterState.levelUpHistory || {},

      // Skill system data
      skillRanks: characterState.skillRanks || {},
      skillProgress: characterState.skillProgress || {},
      skillPointsSpent: characterState.skillPointsSpent || 0,
      skillPointsAvailable: characterState.skillPointsAvailable || 0,

      version: 1
    };
  }, [currentCharacterId, user]);

  /**
   * Generate a hash of the current character state for efficient change detection
   */
  const getCharacterStateHash = useCallback(() => {
    const state = collectCharacterState();
    if (!state) return null;

    // Create a simplified hash of key state properties
    // Only include properties that should trigger saves
    const hashData = {
      health: state.health,
      mana: state.mana,
      actionPoints: state.actionPoints,
      tempHealth: state.tempHealth,
      tempMana: state.tempMana,
      tempActionPoints: state.tempActionPoints,
      exhaustionLevel: state.exhaustionLevel,
      classResource: state.classResource,
      equipment: state.equipment,
      skillRanks: state.skillRanks,
      skillProgress: state.skillProgress,
      skillPointsSpent: state.skillPointsSpent,
      skillPointsAvailable: state.skillPointsAvailable,
      buffs: state.buffs,
      debuffs: state.debuffs,
      quests: state.quests,
      questProgress: state.questProgress
    };

    return JSON.stringify(hashData);
  }, [collectCharacterState]);

  /**
   * Save character state to Firebase
   */
  const saveCharacterState = useCallback(async (stateData = null) => {
    if (!user || user.isGuest || !currentCharacterId) {
      return { success: false, reason: 'No authenticated user or character' };
    }

    const dataToSave = stateData || collectCharacterState();
    if (!dataToSave) {
      return { success: false, reason: 'No data to save' };
    }

    try {
      const result = await persistenceService.saveCharacterState(user.uid, currentCharacterId, dataToSave);

      if (result.success) {
        lastSavedStateRef.current = JSON.stringify(dataToSave);
        realtimeSync.markLocalSave(new Date(result.data?.lastUpdated));
        console.log(`💾 Character state saved for ${currentCharacterId}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to save character state:', error);
      return { success: false, error: error.message };
    }
  }, [user, currentCharacterId, collectCharacterState]);

  /**
   * Load character state from Firebase
   */
  const loadCharacterState = useCallback(async () => {
    if (!user || user.isGuest || !currentCharacterId) {
      return { success: false, reason: 'No authenticated user or character' };
    }

    try {
      const result = await persistenceService.loadCharacterState(user.uid, currentCharacterId);

      if (result) {
        // Update the character store with loaded data
        useCharacterStore.setState({
          // Basic resources
          health: result.health || { current: 45, max: 50 },
          mana: result.mana || { current: 45, max: 50 },
          actionPoints: result.actionPoints || { current: 3, max: 3 },
          tempHealth: result.tempHealth || 0,
          tempMana: result.tempMana || 0,
          tempActionPoints: result.tempActionPoints || 0,
          exhaustionLevel: result.exhaustionLevel || 0,

          // Class-specific resources
          classResource: result.classResource || {
            type: 'classResource',
            current: 3,
            max: 5
          },

          // Inventory
          inventory: result.inventory || {
            items: [],
            currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
            encumbranceState: 'normal'
          },

          // Equipment
          equipment: result.equipment || {
            weapon: null,
            armor: null,
            shield: null,
            accessories: []
          },

          // Skill system data
          skillRanks: result.skillRanks || {},
          skillProgress: result.skillProgress || {},
          skillPointsSpent: result.skillPointsSpent || 0,
          skillPointsAvailable: result.skillPointsAvailable || 0
        });

        lastSavedStateRef.current = JSON.stringify(result);
        console.log(`📂 Character state loaded for ${currentCharacterId}`);
        return { success: true, data: result };
      } else {
        console.log(`📂 No saved character state found for ${currentCharacterId}, using defaults`);
        return { success: false, reason: 'No saved data found' };
      }
    } catch (error) {
      console.error('Failed to load character state:', error);
      return { success: false, error: error.message };
    }
  }, [user, currentCharacterId]);

  /**
   * Auto-save character state when it changes
   */
  const scheduleAutoSave = useCallback(() => {
    // Clear existing timer
    if (characterStateTimerRef.current) {
      clearTimeout(characterStateTimerRef.current);
      characterStateTimerRef.current = null;
    }

    // Set new auto-save timer
    characterStateTimerRef.current = setTimeout(async () => {
      const currentState = collectCharacterState();
      if (currentState) {
        const currentStateStr = JSON.stringify(currentState);

        // Only save if state has actually changed (double-check with hash and full state)
        const currentHash = getCharacterStateHash();
        if (currentStateStr !== lastSavedStateRef.current && currentHash !== lastStateHashRef.current) {
          await saveCharacterState(currentState);
        }
      }
    }, AUTO_SAVE_DELAY);
  }, [collectCharacterState, saveCharacterState, getCharacterStateHash]);

  /**
   * Force immediate save
   */
  const forceSave = useCallback(async () => {
    if (characterStateTimerRef.current) {
      clearTimeout(characterStateTimerRef.current);
      characterStateTimerRef.current = null;
    }

    return await saveCharacterState();
  }, [saveCharacterState]);

  /**
   * Update character health/mana/AP with immediate save
   */
  const updateResources = useCallback(async (resources) => {
    // Update store first
    useCharacterStore.setState(resources);

    // Save immediately for critical resources
    await saveCharacterState();
  }, [saveCharacterState]);

  // Load character state when character changes
  useEffect(() => {
    if (user && !user.isGuest && currentCharacterId) {
      loadCharacterState();
    }
  }, [user, currentCharacterId, loadCharacterState]);

  // Auto-save when character state changes (optimized version)
  useEffect(() => {
    if (!user || user.isGuest || !currentCharacterId) {
      return;
    }

    const currentHash = getCharacterStateHash();
    if (currentHash && currentHash !== lastStateHashRef.current) {
      lastStateHashRef.current = currentHash;
      scheduleAutoSave();
    }

    // Cleanup timer on unmount
    return () => {
      if (characterStateTimerRef.current) {
        clearTimeout(characterStateTimerRef.current);
        characterStateTimerRef.current = null;
      }
    };
  }, [user, currentCharacterId, getCharacterStateHash, scheduleAutoSave]);

  // Real-time sync for cross-device synchronization
  const handleRemoteCharacterChange = useCallback((remoteData, changeType) => {
    if (changeType === 'remote-update' || changeType === 'conflict-resolved-remote') {
      console.log('🔄 Remote character update received:', changeType);

      // Update stores with remote data
      useCharacterStore.setState({
        health: remoteData.health,
        mana: remoteData.mana,
        actionPoints: remoteData.actionPoints,
        tempHealth: remoteData.tempHealth || 0,
        tempMana: remoteData.tempMana || 0,
        tempActionPoints: remoteData.tempActionPoints || 0,
        exhaustionLevel: remoteData.exhaustionLevel || 0,
        classResource: remoteData.classResource,
        skillRanks: remoteData.skillRanks || {},
        skillProgress: remoteData.skillProgress || {},
        skillPointsSpent: remoteData.skillPointsSpent || 0,
        skillPointsAvailable: remoteData.skillPointsAvailable || 0,
      });

      // Update inventory store
      if (remoteData.inventory) {
        useInventoryStore.setState({
          items: remoteData.inventory.items || [],
          currency: remoteData.inventory.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
          encumbranceState: remoteData.inventory.encumbranceState || 'normal',
          containers: remoteData.inventory.containers || []
        });
      }

      // Update equipment
      if (remoteData.equipment) {
        useCharacterStore.setState({ equipment: remoteData.equipment });
      }

      // Update buff/debuff stores
      if (remoteData.buffs) {
        useBuffStore.setState({ activeBuffs: remoteData.buffs });
      }
      if (remoteData.debuffs) {
        useDebuffStore.setState({ activeDebuffs: remoteData.debuffs });
      }

      // Update quest store
      if (remoteData.quests) {
        useQuestStore.setState({
          quests: remoteData.quests.quests || [],
          categories: remoteData.quests.categories || [],
          questCategories: remoteData.quests.questCategories || {}
        });
      }

      console.log('✅ Character state updated from remote changes');
    }
  }, []);

  const realtimeSync = useRealtimeSync(
    'characterStates',
    currentCharacterId,
    handleRemoteCharacterChange,
    {
      enabled: !!user && !user.isGuest && !!currentCharacterId,
      conflictResolution: 'ask-user', // Let user decide in conflicts
      onConflict: (conflictInfo) => {
        // Show conflict resolution UI (could be implemented in a modal)
        console.warn('⚠️ Character data conflict detected!', conflictInfo);
        // For now, just accept remote changes
        conflictInfo.resolveWithRemote();
      }
    }
  );

  // Mark local changes for conflict detection
  useEffect(() => {
    if (user && !user.isGuest && currentCharacterId) {
      realtimeSync.markLocalChange('character-state');
    }
  }, [user, currentCharacterId, realtimeSync]);

  return {
    // State
    isGuestUser: user?.isGuest || false,
    isAuthenticated: !!user && !user.isGuest,

    // Actions
    saveCharacterState,
    loadCharacterState,
    forceSave,
    updateResources,

    // Utilities
    collectCharacterState
  };
};
