/**
 * Character Persistence Hook
 *
 * Automatically saves and loads character runtime state to/from Firebase.
 * Integrates with the character store to provide unbroken persistence.
 */

import { useEffect, useCallback, useRef } from 'react';
import { useRealtimeSync } from './useRealtimeSync';
import { migrateArcanoneerClassResource } from '../utils/arcanoneerMigration';

export const useCharacterPersistence = () => {
 const persistenceService = require('../services/firebase/persistenceService').default;
 // Use shifting require to break circular dependencies
 const useAuthStore = require('../store/authStore').default;
 const useCharacterStore = require('../store/characterStore').default;
 const useInventoryStore = require('../store/inventoryStore').default;
 const useConditionStore = require('../store/conditionStore').default;
 const useQuestStore = require('../store/questStore').default;

 const { user } = useAuthStore();
 const currentCharacterId = useCharacterStore(state => state.currentCharacterId);

  // Auto-save timer refs
  const characterStateTimerRef = useRef(null);
  const lastSavedStateRef = useRef(null);
  const lastStateHashRef = useRef(null);
  // True immediately after we apply remote data, so the next state-hash change
  // detected by the auto-save effect isn't mistaken for a local user edit.
  const isApplyingRemoteRef = useRef(false);

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
 const characterState = useCharacterStore?.getState();
 const inventoryState = useInventoryStore?.getState();
 const conditionState = useConditionStore?.getState();
 const questState = useQuestStore?.getState();

 if (!characterState || !inventoryState || !conditionState || !questState) {
  return null;
 }

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
  buffs: conditionState.activeBuffs || [],
  debuffs: conditionState.activeDebuffs || [],

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
 }, [currentCharacterId, user, useCharacterStore, useConditionStore, useInventoryStore, useQuestStore]);

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
  lastStateHashRef.current = getCharacterStateHash();
  // Pass the write token so the listener ignores our own echo.
  realtimeSyncRef.current?.markLocalSave(result.writeToken);
  console.log(`💾 Character state saved for ${currentCharacterId}`);
  }

  return result;
  } catch (error) {
  console.error('Failed to save character state:', error);
  return { success: false, error: error.message };
  }
  }, [user, currentCharacterId, collectCharacterState, getCharacterStateHash, persistenceService]);

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
  // One-time migration: legacy Arcanoneer block IDs → new canonical IDs.
  // Idempotent; no-op for non-Arcanoneer characters and already-migrated data.
  const migratedClassResource = migrateArcanoneerClassResource(result.classResource);
  if (migratedClassResource !== result.classResource) {
   result.classResource = migratedClassResource;
   console.log('🔄 Migrated legacy Arcanoneer block IDs to new canonical IDs.');
  }

  // Update stores with remote data
  isApplyingRemoteRef.current = true;
  useCharacterStore?.setState({
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
  lastStateHashRef.current = getCharacterStateHash();
  isApplyingRemoteRef.current = false;
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
  }, [user, currentCharacterId, persistenceService, useCharacterStore, getCharacterStateHash]);

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
  characterStateTimerRef.current = null;
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
 useCharacterStore?.setState(resources);

 // Save immediately for critical resources
  await saveCharacterState();
  }, [saveCharacterState, useCharacterStore]);

  // Load character state when character changes
 useEffect(() => {
 if (user && !user.isGuest && currentCharacterId) {
  loadCharacterState();
 }
 }, [user, currentCharacterId, loadCharacterState]);

 // Auto-save when character state changes.
 // Store subscriptions are required: the previous version compared a state
 // hash inside an effect whose dependencies never changed when HP/mana/
 // inventory changed, so local edits were never flagged and conflict
 // detection was effectively dead.
 useEffect(() => {
 if (!user || user.isGuest || !currentCharacterId) {
  return undefined;
 }

 let isMounted = true;
 const unsubscribers = [];

 Promise.all([
  import('../store/characterStore'),
  import('../store/inventoryStore'),
  import('../store/conditionStore'),
  import('../store/questStore')
 ]).then(([characterStoreModule, inventoryStoreModule, conditionStoreModule, questStoreModule]) => {
  if (!isMounted) return;

  const characterStore = characterStoreModule.default;
  const inventoryStore = inventoryStoreModule.default;
  const conditionStore = conditionStoreModule.default;
  const questStore = questStoreModule.default;

  const watch = (store, selector) =>
   store.subscribe((state, prevState) => {
    if (!selector(state, prevState)) return;
    // Remote-applied state is not a local edit; the remote handler updates
    // lastSavedStateRef/lastStateHashRef itself.
    if (isApplyingRemoteRef.current) return;
    realtimeSyncRef.current?.markLocalChange('character-state');
    scheduleAutoSave();
   });

  unsubscribers.push(
   watch(
    characterStore,
    (s, p) =>
     s.health !== p.health ||
     s.mana !== p.mana ||
     s.actionPoints !== p.actionPoints ||
     s.tempHealth !== p.tempHealth ||
     s.tempMana !== p.tempMana ||
     s.tempActionPoints !== p.tempActionPoints ||
     s.exhaustionLevel !== p.exhaustionLevel ||
     s.classResource !== p.classResource ||
     s.equipment !== p.equipment ||
     s.skillRanks !== p.skillRanks ||
     s.skillProgress !== p.skillProgress ||
     s.skillPointsSpent !== p.skillPointsSpent ||
     s.skillPointsAvailable !== p.skillPointsAvailable
   ),
   watch(inventoryStore, (s, p) => s.items !== p.items || s.currency !== p.currency || s.encumbranceState !== p.encumbranceState),
   watch(conditionStore, (s, p) => s.activeBuffs !== p.activeBuffs || s.activeDebuffs !== p.activeDebuffs),
   watch(questStore, (s, p) => s.quests !== p.quests)
  );
 });

 // Cleanup timer and subscriptions on unmount
 return () => {
  isMounted = false;
  if (characterStateTimerRef.current) {
   clearTimeout(characterStateTimerRef.current);
   characterStateTimerRef.current = null;
  }
  unsubscribers.forEach((unsubscribe) => unsubscribe());
 };
 }, [user, currentCharacterId, scheduleAutoSave]);

 // Real-time sync for cross-device synchronization
  const handleRemoteCharacterChange = useCallback((remoteData, changeType) => {
  if (changeType === 'remote-update' || changeType === 'conflict-resolved-remote') {
   console.log('🔄 Remote character update received:', changeType);
   // Flag that the upcoming store update is remote-driven so the auto-save
   // effect doesn't treat it as a local edit (which would create false
   // conflicts and echo saves back to Firebase).
   isApplyingRemoteRef.current = true;

  // Update stores with remote data
  useCharacterStore.setState({
  health: remoteData.health,
  mana: remoteData.mana,
  actionPoints: remoteData.actionPoints,
  tempHealth: remoteData.tempHealth || 0,
  tempMana: remoteData.tempMana || 0,
  tempActionPoints: remoteData.tempActionPoints || 0,
  exhaustionLevel: remoteData.exhaustionLevel || 0,
  // One-time migration on remote update too: covers a party member on an
  // older client broadcasting legacy IDs.
  classResource: migrateArcanoneerClassResource(remoteData.classResource),
  skillRanks: remoteData.skillRanks || {},
  skillProgress: remoteData.skillProgress || {},
  skillPointsSpent: remoteData.skillPointsSpent || 0,
  skillPointsAvailable: remoteData.skillPointsAvailable || 0,
  });

  // Update inventory store
  if (remoteData.inventory) {
  useInventoryStore?.setState({
   items: remoteData.inventory.items || [],
   currency: remoteData.inventory.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
   encumbranceState: remoteData.inventory.encumbranceState || 'normal',
   containers: remoteData.inventory.containers || []
  });
  }

  // Update equipment
  if (remoteData.equipment) {
  useCharacterStore?.setState({ equipment: remoteData.equipment });
  }

  // Update buff/debuff stores
  if (remoteData.buffs) {
  useConditionStore?.setState({ activeBuffs: remoteData.buffs });
  }
  if (remoteData.debuffs) {
  useConditionStore?.setState({ activeDebuffs: remoteData.debuffs });
  }

  // Update quest store
  if (remoteData.quests) {
  useQuestStore?.setState({
   quests: remoteData.quests.quests || [],
   categories: remoteData.quests.categories || [],
   questCategories: remoteData.quests.questCategories || {}
  });
  }

  // The remote state is now the persisted baseline; prevents the store
  // subscriptions from treating it as a local edit and echoing it back.
  lastSavedStateRef.current = JSON.stringify(collectCharacterState());
  lastStateHashRef.current = getCharacterStateHash();
  isApplyingRemoteRef.current = false;

  console.log('✅ Character state updated from remote changes');
  }
  }, [useCharacterStore, useConditionStore, useInventoryStore, useQuestStore, collectCharacterState, getCharacterStateHash]);

 const realtimeSyncRef = useRef(null);

 const realtimeSync = useRealtimeSync(
 `users/${user?.uid}/characterStates`,
 currentCharacterId,
 handleRemoteCharacterChange,
  {
   enabled: !!user && !user.isGuest && !!currentCharacterId,
   conflictResolution: 'ask-user'
  }
 );

 realtimeSyncRef.current = realtimeSync;

  // Note: local changes are flagged inside the auto-save effect above (only on
  // genuine local edits). The previous effect here depended on `realtimeSync`,
  // which is a new object every render, so it called markLocalChange on nearly
  // every render - keeping localChangesRef permanently populated and making
  // conflicts re-trigger instantly after being resolved.

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
 collectCharacterState,

 // Conflict resolution
 conflictDetected: realtimeSync.conflictDetected,
 conflictData: realtimeSync.conflictData,
 resolveConflict: realtimeSync.resolveConflict
 };
};
