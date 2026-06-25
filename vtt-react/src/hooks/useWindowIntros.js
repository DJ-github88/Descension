import { useState, useEffect, useRef, useCallback } from 'react';
import { WINDOW_INTROS, GUIDE_CHARACTER } from '../data/windowIntros';

const STORAGE_KEY = 'mythrill.windowIntros.v1';
const SYNC_EVENT = 'mythrill:intros-changed';
const DEFAULT_STATE = { enabled: true, seen: [] };

const readStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_STATE;
};

const writeStorage = (state) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
};

export const useWindowIntros = () => {
    const [state, setState] = useState(readStorage);
    const stateRef = useRef(state);
    stateRef.current = state;

    // Cross-instance + cross-tab sync
    useEffect(() => {
        const handler = () => setState(readStorage());
        window.addEventListener(SYNC_EVENT, handler);
        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener(SYNC_EVENT, handler);
            window.removeEventListener('storage', handler);
        };
    }, []);

    const commit = useCallback((next) => {
        writeStorage(next);
        setState(next);
        window.dispatchEvent(new CustomEvent(SYNC_EVENT));
    }, []);

    // Called when a GM opens a window. Shows the intro (typewriter) on first open, then marks it seen.
    const triggerIfFirstOpen = useCallback((windowId) => {
        const s = stateRef.current;
        if (!s.enabled || s.seen.includes(windowId)) return;
        const intro = WINDOW_INTROS[windowId];
        if (!intro) return;

        window.dispatchEvent(new CustomEvent('showDialogue', {
            detail: {
                text: intro.text,
                character: GUIDE_CHARACTER,
                characterName: GUIDE_CHARACTER.name,
                local: true,
                sendToChat: false,
                speed: 28
            }
        }));

        const next = { ...s, seen: [...s.seen, windowId] };
        writeStorage(next);
        setState(next);
        window.dispatchEvent(new CustomEvent(SYNC_EVENT));
    }, []);

    const resetSeen = useCallback(() => commit({ ...stateRef.current, seen: [] }), [commit]);
    const setEnabled = useCallback((enabled) => commit({ ...stateRef.current, enabled }), [commit]);

    return {
        enabled: state.enabled,
        seenCount: state.seen.length,
        total: Object.keys(WINDOW_INTROS).length,
        triggerIfFirstOpen,
        resetSeen,
        setEnabled
    };
};

export default useWindowIntros;
