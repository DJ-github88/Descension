import { getStore } from './storeRegistry';
import characterPersistenceService from '../services/firebase/characterPersistenceService';
import { updateCharacterData } from '../services/offlineService';
import { isDemoMode } from '../config/firebase';

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
export const CHARACTER_AUTO_SAVE_DELAY = 2000;

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
    characterAutoSaveTimer = setTimeout(() => {
        try {
            saveFn();
        } catch (error) {
            console.warn('Auto-save execution failed:', error);
        } finally {
            characterAutoSaveTimer = null;
        }
    }, CHARACTER_AUTO_SAVE_DELAY);
};

export { characterPersistenceService, updateCharacterData };
