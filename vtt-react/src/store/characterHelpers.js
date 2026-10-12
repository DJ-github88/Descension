import { getStore } from './storeRegistry';
import characterPersistenceService from '../services/firebase/characterPersistenceService';
import { updateCharacterData } from '../services/offlineService';
import { isDemoMode } from '../config/firebase';
import { captureConsumerContext } from '../persistence/scopedConsumer';

export const getEncumbranceState = () => {
    try {
        const inventoryStore = getStore('inventoryStore');
        const state = inventoryStore.getState();
        return state.encumbranceState || 'normal';
    } catch (error) {
        console.warn('Could not get encumbrance state, using normal:', error);
        return 'normal';
    }
};

export const getCurrentUserId = () => {
    try {
        const authStore = getStore('authStore');
        const state = authStore.getState();

        // Return the authenticated user's UID, or null when not authenticated.
        // NEVER return a fake/placeholder UID (e.g. 'dev-user-localhost'): those
        // leak into Firestore writes (character_backups.userId, characters.metadata.userId)
        // and fail security rules because they never match request.auth.uid.
        // The deliberate dev-login identity ('dev-user-123' from authStore) still
        // flows through here correctly via state.user.uid.
        return state.user?.uid || null;
    } catch (error) {
        console.warn('Could not get current user ID:', error);
        return null;
    }
};

export const isGuestUser = () => {
    try {
        const authStore = getStore('authStore');
        const state = authStore.getState();
        return state.user?.isGuest || false;
    } catch (error) {
        return false;
    }
};

export const getCharactersStorageKey = () => {
    return isGuestUser() ? 'mythrill-guest-characters' : 'mythrill-characters';
};

export const shouldUseFirebase = () => {
    if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
        return false;
    }

    try {
        if (isDemoMode) {
            return false;
        }
    } catch (error) {
        console.warn('Could not check demo mode:', error);
    }

    const userId = getCurrentUserId();
    return !!(userId && characterPersistenceService.isConfigured);
};

export let characterAutoSaveTimer = null;
export let characterAutoSavePending = null;
export const CHARACTER_AUTO_SAVE_DELAY = 2000;

// Immutable origin context (owner scope + account generation) captured when
// the debounced save was scheduled. A pending save must never derive its owner
// from a newer live authentication principal.
let characterAutoSaveOriginContext = null;

export const setCharacterAutoSaveTimer = (timer) => {
    characterAutoSaveTimer = timer;
};

export const clearCharacterAutoSaveTimer = () => {
    if (characterAutoSaveTimer) {
        clearTimeout(characterAutoSaveTimer);
        characterAutoSaveTimer = null;
    }
};

export const triggerCharacterAutoSave = (saveFn) => {
    clearCharacterAutoSaveTimer();
    characterAutoSavePending = typeof saveFn === 'function' ? saveFn : null;
    try {
        const captured = captureConsumerContext();
        characterAutoSaveOriginContext = captured.ok ? captured.context : null;
    } catch (_error) {
        characterAutoSaveOriginContext = null;
    }
    characterAutoSaveTimer = setTimeout(() => {
        const pending = characterAutoSavePending;
        characterAutoSavePending = null;
        try {
            if (pending) pending();
        } catch (error) {
            console.warn('Auto-save execution failed:', error);
        } finally {
            characterAutoSaveTimer = null;
            characterAutoSaveOriginContext = null;
        }
    }, CHARACTER_AUTO_SAVE_DELAY);
};

/** Read and clear the pending save's immutable origin context. */
export const consumeCharacterAutoSaveOriginContext = () => {
    const context = characterAutoSaveOriginContext;
    characterAutoSaveOriginContext = null;
    return context;
};

export const peekCharacterAutoSaveOriginContext = () => characterAutoSaveOriginContext;

/**
 * P5-01 handoff isolation: discard the pending debounced save. The caller has
 * already captured the authored working state (the pending save's payload) into
 * a retained candidate, so the debounce would only double-save.
 */
export const discardCharacterAutoSave = () => {
    clearCharacterAutoSaveTimer();
    characterAutoSavePending = null;
    characterAutoSaveOriginContext = null;
};

/** Live inventory working data for a character save payload. */
export const readInventoryWorkingData = () => {
    try {
        const inventoryStore = getStore('inventoryStore');
        const inventoryState = inventoryStore.getState();
        return {
            items: inventoryState.items || [],
            currency: inventoryState.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
            encumbranceState: inventoryState.encumbranceState || 'normal'
        };
    } catch (error) {
        console.warn('Could not get inventory data:', error);
        return {
            items: [],
            currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
            encumbranceState: 'normal'
        };
    }
};

/**
 * Assemble the canonical working-character save payload from store state and
 * live inventory data. Shared by the normal save path and the handoff
 * candidate capture so both preserve the exact same authored content.
 */
export const assembleCharacterWorkingData = (state, inventoryData = null) => ({
    name: state.name,
    baseName: state.baseName,
    race: state.race,
    subrace: state.subrace,
    class: state.class,
    classAcquisition: state.classAcquisition,
    bodyStates: state.bodyStates,
    level: state.level,
    experience: state.experience,
    alignment: state.alignment,
    stats: state.stats,
    health: state.health,
    mana: state.mana,
    actionPoints: state.actionPoints,
    equipment: state.equipment,
    resistances: state.resistances,
    spellPower: state.spellPower,
    lore: state.lore,
    tokenSettings: state.tokenSettings,
    skillRanks: state.skillRanks,
    class_spells: state.class_spells,
    levelUpHistory: state.levelUpHistory,
    talents: state.talents,
    primarySpecialization: state.primarySpecialization,
    inventory: inventoryData || {
        items: [],
        currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        encumbranceState: 'normal'
    },
    classResource: state.classResource,
    updatedAt: new Date().toISOString()
});

/**
 * P5-01 handoff isolation: run the pending debounced character save
 * synchronously so unsent working changes are preserved into the retained
 * owner's scoped record before the working projection is hidden. Returns true
 * when a pending save was flushed.
 */
export const flushCharacterAutoSave = () => {
    clearCharacterAutoSaveTimer();
    const pending = characterAutoSavePending;
    characterAutoSavePending = null;
    if (!pending) return false;
    try {
        pending();
        return true;
    } catch (error) {
        console.warn('Character auto-save flush failed:', error);
        return false;
    }
};

export { characterPersistenceService, updateCharacterData };
