import { useDialogStore } from '../store/dialogStore';

/**
 * Display a custom confirmation dialog.
 * @param {string | { title?: string, message: string, subMessage?: string, confirmText?: string, cancelText?: string, isDestructive?: boolean, variant?: 'danger'|'primary'|'warning'|'info'|'success', icon?: string }} options
 * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled.
 */
export const showConfirm = (options) => {
    return useDialogStore.getState().confirm(options);
};

export const confirmDialog = showConfirm;

/**
 * Display a custom alert / informational modal dialog.
 * @param {string | { title?: string, message: string, subMessage?: string, confirmText?: string, variant?: 'danger'|'primary'|'warning'|'info'|'success', icon?: string }} options
 * @returns {Promise<boolean>} Resolves to true when acknowledged.
 */
export const showAlert = (options) => {
    return useDialogStore.getState().alert(options);
};

export const alertDialog = showAlert;

/**
 * Display a custom prompt modal dialog.
 * @param {string | { title?: string, message: string, subMessage?: string, defaultValue?: string, placeholder?: string, inputType?: string, confirmText?: string, cancelText?: string, required?: boolean, icon?: string }} options
 * @returns {Promise<string | null>} Resolves to entered text string, or null if cancelled.
 */
export const showPrompt = (options) => {
    return useDialogStore.getState().prompt(options);
};

export const promptDialog = showPrompt;

// Optional: Register on window object for convenience
if (typeof window !== 'undefined') {
    window.showConfirm = showConfirm;
    window.showAlert = showAlert;
    window.showPrompt = showPrompt;
    window.customConfirm = showConfirm;
    window.customAlert = showAlert;
    window.customPrompt = showPrompt;
}

export default {
    showConfirm,
    confirmDialog,
    showAlert,
    alertDialog,
    showPrompt,
    promptDialog
};
