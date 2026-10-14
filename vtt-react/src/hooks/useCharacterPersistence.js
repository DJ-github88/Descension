/** Owner-bound personal runtime persistence. This is not a room checkpoint. */
import { useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import { useRealtimeSync } from './useRealtimeSync';
import { migrateArcanoneerClassResource } from '../utils/arcanoneerMigration';
import { captureConsumerContext } from '../persistence/scopedConsumer';
import { subscribeBootstrapGate, getBootstrapGateState } from '../persistence/bootstrapPrivacyGate';
import { characterContextCurrent, stageCharacterDraft, getCharacterCandidate, saveCharacterDraft, isLatestCharacterDraft, importCharacterDraft, preservePersonalConditionRecovery } from '../persistence/characterSaveOutcome';
import { decodeCharacterShapes } from '../utils/characterShapeCodec';
import { discardCharacterAutoSave } from '../store/characterHelpers';
import { projectPersonalRuntime, roomResourceProjection } from '../services/actorConsequenceService';

export const useCharacterPersistence = () => {
  const persistenceService = require('../services/firebase/persistenceService').default;
  const useAuthStore = require('../store/authStore').default;
  const useCharacterStore = require('../store/characterStore').default;
  const useInventoryStore = require('../store/inventoryStore').default;
  const useConditionStore = require('../store/conditionStore').default;
  const useQuestStore = require('../store/questStore').default;
  const user = useAuthStore(state => state.user);
  const currentCharacterId = useCharacterStore(state => state.currentCharacterId);
  const gate = useSyncExternalStore(subscribeBootstrapGate, getBootstrapGateState, getBootstrapGateState);
  const contextRef = useRef(null);
  if (contextRef.current?.accountGeneration !== gate.accountGeneration || contextRef.current?.scope !== gate.scope) {
    contextRef.current = captureConsumerContext().context;
  }
  const context = contextRef.current;
  const timer = useRef(null);
  const applyingRemote = useRef(false);
  const realtimeRef = useRef(null);
  const lastSaved = useRef(null);
  const eligible = useCallback(() => !!user && !user.isGuest && characterContextCurrent(context) &&
    useCharacterStore.getState().currentCharacterId === currentCharacterId,
  [user, context, useCharacterStore, currentCharacterId]);

  const collectCharacterState = useCallback(() => {
    if (!currentCharacterId || !eligible()) return null;
    const character = useCharacterStore.getState();
    const inventory = useInventoryStore.getState();
    const conditions = useConditionStore.getState();
    const quests = useQuestStore.getState();
    const payload = {
      health: character.health, mana: character.mana, actionPoints: character.actionPoints,
      tempHealth: character.tempHealth || 0, tempMana: character.tempMana || 0,
      tempActionPoints: character.tempActionPoints || 0, exhaustionLevel: character.exhaustionLevel || 0,
      classResource: character.classResource, equipment: character.equipment,
      inventory: { items: inventory.items, currency: inventory.currency,
        encumbranceState: inventory.encumbranceState, containers: inventory.containers || [] },
      actionBars: {}, buffs: conditions.activeBuffs || [], debuffs: conditions.activeDebuffs || [],
      quests: { quests: quests.quests || [], categories: quests.categories || [], questCategories: quests.questCategories || {} },
      questProgress: character.levelUpHistory || {}, skillRanks: character.skillRanks || {},
      skillProgress: character.skillProgress || {}, skillPointsSpent: character.skillPointsSpent || 0,
      skillPointsAvailable: character.skillPointsAvailable || 0, version: 1
    };
    if (character.roomActorRecoveryCandidates) payload.roomActorRecoveryCandidates = character.roomActorRecoveryCandidates;
    const projected = projectPersonalRuntime(payload, false);
    preservePersonalConditionRecovery(currentCharacterId, undefined, context);
    return projected;
  }, [currentCharacterId, eligible, context, useCharacterStore, useInventoryStore, useConditionStore, useQuestStore]);

  const saveCharacterState = useCallback(async (stateData = null) => {
    if (!eligible() || !currentCharacterId) return { success: false, reason: 'owner-or-character-changed' };
    const payload = projectPersonalRuntime(stateData || collectCharacterState(), false);
    preservePersonalConditionRecovery(currentCharacterId, undefined, context);
    if (!payload) return { success: false, reason: 'no-runtime-data' };
    const entry = stageCharacterDraft(currentCharacterId, 'runtime', payload, context);
    const result = await saveCharacterDraft(entry, (data, latest) =>
      persistenceService.saveCharacterState(user.uid, currentCharacterId, data, { isCurrent: latest }));
    if (result?.success && !result.localOnly && eligible() && isLatestCharacterDraft(entry)) {
      lastSaved.current = JSON.stringify(entry.payload);
      realtimeRef.current?.markLocalSave(result.writeToken);
    }
    return result;
  }, [eligible, currentCharacterId, collectCharacterState, context, persistenceService, user]);

  const applyRuntime = useCallback((data) => {
    if (!eligible() || !data) return false;
    data = decodeCharacterShapes(data);
    data = projectPersonalRuntime(data);
    preservePersonalConditionRecovery(currentCharacterId, undefined, context);
    const wasApplying = applyingRemote.current;
    applyingRemote.current = true;
    try {
      const resourceFields = ['health', 'mana', 'actionPoints', 'tempHealth', 'tempMana', 'tempActionPoints',
        'exhaustionLevel', 'equipment', 'skillRanks', 'skillProgress', 'skillPointsSpent', 'skillPointsAvailable'];
      const patch = Object.fromEntries(resourceFields.filter(key => data[key] !== undefined).map(key => [key, data[key]]));
      if (data.classResource !== undefined) patch.classResource = data.classResource ? migrateArcanoneerClassResource(data.classResource) : null;
      useCharacterStore.setState(patch);
      if (data.inventory) useInventoryStore.setState(Object.fromEntries(
        ['items', 'currency', 'encumbranceState', 'containers'].filter(key => data.inventory[key] !== undefined).map(key => [key, data.inventory[key]])));
      if (data.buffs || data.debuffs) useConditionStore.setState({
        ...(data.buffs ? { activeBuffs: data.buffs } : {}), ...(data.debuffs ? { activeDebuffs: data.debuffs } : {})
      });
      if (data.quests) useQuestStore.setState(Object.fromEntries(
        ['quests', 'categories', 'questCategories'].filter(key => data.quests[key] !== undefined).map(key => [key, data.quests[key]])));
      lastSaved.current = JSON.stringify(collectCharacterState());
      return true;
    } finally { applyingRemote.current = wasApplying; }
  }, [eligible, currentCharacterId, context, useCharacterStore, useInventoryStore, useConditionStore, useQuestStore, collectCharacterState]);

  const importSelectedDraft = useCallback(raw => {
    if (!eligible() || !currentCharacterId) throw new Error('Owner or selected character changed');
    if (!useCharacterStore.getState().characters.some(character => character.id === currentCharacterId)) throw new Error('Selected character is not in the owned roster');
    const data = importCharacterDraft(raw, currentCharacterId);
    const roomProjection = roomResourceProjection();
    if (roomProjection && data.canonical) {
      projectPersonalRuntime({ ...data.canonical, ...data.canonical.resources });
      data.canonical = { ...data.canonical, ...roomProjection, resources: { ...data.canonical.resources, ...roomProjection } };
    }
    // Validation succeeded against clean/equivalent work. Retire its old
    // canonical debounce before the first roster notification can refresh a
    // pre-import live snapshot; subsequent edits create their own debounce.
    discardCharacterAutoSave();
    // Scope suppression to this synchronous application only. Later real edits
    // still stage normally; old live projections cannot replace the import.
    applyingRemote.current = true;
    clearTimeout(timer.current);
    timer.current = null;
    try {
      if (data.canonical) {
        useCharacterStore.setState(state => ({ characters: state.characters.map(character => character.id === currentCharacterId
          ? { ...character, ...data.canonical, id: currentCharacterId } : character) }));
        useCharacterStore.getState().loadCharacter(currentCharacterId);
        // Preserve exact resources/items after the legacy loader's derived
        // initialization and inventory authoring. Import is not a gameplay edit.
        applyRuntime({ ...data.canonical, ...data.canonical.resources });
        discardCharacterAutoSave();
        stageCharacterDraft(currentCharacterId, 'canonical', data.canonical, context);
      }
      if (data.runtime) applyRuntime(data.runtime);
      else if (data.canonical) stageCharacterDraft(currentCharacterId, 'runtime', collectCharacterState(), context);
      lastSaved.current = JSON.stringify(collectCharacterState());
      return data;
    } finally { applyingRemote.current = false; }
  }, [eligible, currentCharacterId, useCharacterStore, context, applyRuntime, collectCharacterState]);

  const loadCharacterState = useCallback(async () => {
    if (!eligible() || !currentCharacterId) return { success: false, reason: 'owner-or-character-changed' };
    const before = collectCharacterState();
    const entry = getCharacterCandidate(currentCharacterId, 'runtime', context);
    if (entry && entry.status !== 'idle' && entry.status !== 'saved') {
      applyRuntime(entry.payload);
      return { success: true, recovered: true, data: entry.payload };
    }
    try {
      const result = await persistenceService.loadCharacterState(user.uid, currentCharacterId);
      if (!eligible() || JSON.stringify(collectCharacterState()) !== JSON.stringify(before) ||
        getCharacterCandidate(currentCharacterId, 'runtime', context) !== entry) {
        return { success: false, reason: 'superseded-runtime-read' };
      }
      return result && applyRuntime(result) ? { success: true, data: result } : { success: false, reason: 'no-confirmed-runtime-read' };
    } catch (error) { return { success: false, error: error.message }; }
  }, [eligible, currentCharacterId, collectCharacterState, context, applyRuntime, persistenceService, user]);

  const forceSave = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = null;
    const pending = getCharacterCandidate(currentCharacterId, 'runtime', context);
    return saveCharacterState(pending && pending.status !== 'saved' && pending.status !== 'idle' ? pending.payload : null);
  }, [currentCharacterId, context, saveCharacterState]);

  useEffect(() => {
    lastSaved.current = null;
    loadCharacterState();
    return () => { clearTimeout(timer.current); timer.current = null; };
  }, [loadCharacterState]);

  useEffect(() => {
    if (!eligible() || !currentCharacterId) return undefined;
    const changed = () => {
      if (applyingRemote.current || !eligible()) return;
      const payload = collectCharacterState();
      let hash;
      try { hash = JSON.stringify(payload); } catch (_error) { hash = null; }
      if (hash !== null && hash === lastSaved.current) return;
      const prior = getCharacterCandidate(currentCharacterId, 'runtime', context);
      const entry = stageCharacterDraft(currentCharacterId, 'runtime', payload, context);
      if (entry === prior) return;
      realtimeRef.current?.markLocalChange('character-state');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        timer.current = null;
        if (eligible() && isLatestCharacterDraft(entry)) saveCharacterState(entry.payload);
      }, 2000);
    };
    // Synchronous subscriptions: no dynamic-import gap can miss an edit.
    const unsubscribers = [useCharacterStore, useInventoryStore, useConditionStore, useQuestStore].map(store => store.subscribe(changed));
    // Preserve a projection-created source synchronously, before a later personal
    // save, account handoff or reload can lose the earlier volatile P7 cache.
    const game = require('../store/gameStore').default;
    const recoveryChanged = () => {
      if (eligible()) preservePersonalConditionRecovery(currentCharacterId, undefined, context);
    };
    recoveryChanged();
    unsubscribers.push(game.subscribe(recoveryChanged));
    const online = () => { if (eligible()) forceSave(); };
    window.addEventListener('online', online);
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      window.removeEventListener('online', online);
      clearTimeout(timer.current);
    };
  }, [eligible, currentCharacterId, context, collectCharacterState, saveCharacterState, forceSave,
    useCharacterStore, useInventoryStore, useConditionStore, useQuestStore]);

  const handleRemote = useCallback((data, type) => {
    if (!eligible()) return;
    const entry = getCharacterCandidate(currentCharacterId, 'runtime', context);
    if (type !== 'conflict-resolved-remote' && entry && entry.status !== 'saved' && entry.status !== 'idle') return;
    applyRuntime(data);
  }, [eligible, currentCharacterId, context, applyRuntime]);
  const realtime = useRealtimeSync(`users/${user?.uid}/characterStates`, currentCharacterId, handleRemote,
    { enabled: !!currentCharacterId && eligible(), conflictResolution: 'ask-user' });
  realtimeRef.current = realtime;

  return {
    isGuestUser: !!user?.isGuest, isAuthenticated: eligible(),
    collectCharacterState, saveCharacterState, loadCharacterState, forceSave, importSelectedDraft,
    updateResources: async (resources) => { if (!eligible()) return; useCharacterStore.setState(resources); return saveCharacterState(); },
    conflictDetected: realtime.conflictDetected, conflictData: realtime.conflictData, resolveConflict: realtime.resolveConflict
  };
};
