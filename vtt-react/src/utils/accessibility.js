import useSettingsStore from '../store/settingsStore';

export function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function shouldReduceMotion() {
    return prefersReducedMotion() || !!useSettingsStore.getState().reducedMotion;
}
