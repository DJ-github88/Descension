import { getStore } from './storeRegistry';
import characterPersistenceService from '../services/firebase/characterPersistenceService';
import { updateCharacterData } from '../services/offlineService';

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

        if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
            const devUserId = state.user?.uid || 'dev-user-localhost';
            return devUserId;
        }

        return state.user?.uid || null;
    } catch (error) {
        console.warn('Could not get current user ID:', error);
        if (process.env.NODE_ENV === 'development') {
            return 'dev-user-fallback';
        }
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
        const { isDemoMode } = require('../config/firebase');
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

export { characterPersistenceService, updateCharacterData };
