import { useEffect, useRef, useState } from 'react';
import useWindowManagerStore from '../store/windowManagerStore';

/**
 * Register a window/modal with the window manager exactly ONCE, regardless of
 * how often `onClose` changes.
 *
 * The window manager's register/unregister mutate the shared `windows` Map. If a
 * registration effect depends on `onClose` and a parent passes an inline handler,
 * the effect re-runs (unregister + register) on every render. That churns the
 * Map, re-renders every subscriber (notably Navigation), which hands back a new
 * inline `onClose`, re-triggering the effect — an infinite loop that React
 * reports as "Maximum update depth exceeded".
 *
 * This hook keeps `onClose` fresh via a ref and registers a STABLE wrapper, so
 * the registration effect runs only once (on mount/unmount).
 *
 * @param {string} windowId   Stable, unique id for this window
 * @param {'window'|'modal'} type
 * @param {Function} onClose   May be a fresh reference every render; handled via ref
 * @returns {number|undefined} The initial z-index assigned by the manager
 */
export function useStableWindowRegistration(windowId, type, onClose) {
    const registerWindow = useWindowManagerStore(state => state.registerWindow);
    const unregisterWindow = useWindowManagerStore(state => state.unregisterWindow);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    const [zIndex, setZIndex] = useState(0);

    useEffect(() => {
        const stableOnClose = () => {
            if (typeof onCloseRef.current === 'function') {
                onCloseRef.current();
            }
        };
        const assigned = registerWindow(windowId, type, stableOnClose);
        setZIndex(assigned);
        return () => unregisterWindow(windowId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowId, type, registerWindow, unregisterWindow]);

    return zIndex;
}
