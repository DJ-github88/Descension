import { useEffect } from 'react';
import useSettingsStore from '../../store/settingsStore';

const AccessibilityController = () => {
    const reducedMotion = useSettingsStore(state => state.reducedMotion);
    const highContrast = useSettingsStore(state => state.highContrast);
    const largeText = useSettingsStore(state => state.largeText);
    const screenReader = useSettingsStore(state => state.screenReader);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('a11y-reduced-motion', !!reducedMotion);
        root.classList.toggle('a11y-high-contrast', !!highContrast);
        root.classList.toggle('a11y-large-text', !!largeText);
        root.classList.toggle('a11y-screen-reader', !!screenReader);
    }, [reducedMotion, highContrast, largeText, screenReader]);

    return null;
};

export default AccessibilityController;
