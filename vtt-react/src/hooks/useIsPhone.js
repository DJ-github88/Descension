import { useState, useEffect } from 'react';

/**
 * Detects whether the current device is a phone (not a tablet/iPad).
 *
 * The VTT game grid and multiplayer experience are designed for larger
 * screens.  Phones get a restricted landing page where only Character
 * Creation, Lore (Rules) and the Immerse world-map are accessible.
 *
 * iPads and other tablets are treated as desktop-class and are NOT
 * considered phones.
 *
 * Detection strategy:
 *  1. Viewport width <= 767px  -> phone (covers all phones in portrait;
 *     the original iPad is exactly 768px so it is excluded).
 *  2. User-Agent heuristics    -> catches phones that are wide enough in
 *     landscape to exceed 767px (e.g. iPhone Pro Max).  We explicitly
 *     exclude iPads, which report either "iPad" in the UA or, under
 *     iPadOS 13+, "Macintosh" with multi-touch support.
 */
function checkIsPhone() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';

    // ── iPad / tablet detection ──
    const isIPad =
        /ipad/i.test(ua) ||
        (platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1) ||
        (/macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1 && 'ontouchend' in document);

    const isAndroidTablet = /android/i.test(ua) && !/mobile/i.test(ua);

    if (isIPad || isAndroidTablet) return false;

    // ── Width-based check (phones in portrait) ──
    if (window.innerWidth <= 767) return true;

    // ── UA-based phone check (catches phones in landscape) ──
    const isMobileUA = /iphone|ipod|android.*mobile|windows phone|blackberry|opera mini/i.test(ua);
    if (isMobileUA) return true;

    return false;
}

/**
 * Hook that returns `true` when the current device is a phone.
 * Re-evaluates on resize and orientation change.
 */
export function useIsPhone() {
    const [isPhone, setIsPhone] = useState(() => checkIsPhone());

    useEffect(() => {
        const update = () => setIsPhone(checkIsPhone());
        update(); // re-check on mount

        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);

        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
        };
    }, []);

    return isPhone;
}

export default useIsPhone;
