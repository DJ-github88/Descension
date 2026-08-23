import { create } from 'zustand';

const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useDialogStore = create((set, get) => ({
    dialogs: [],

    openDialog: (config) => {
        return new Promise((resolve) => {
            const id = generateId();
            const dialog = {
                id,
                type: config.type || 'confirm', // 'confirm', 'alert', 'prompt'
                title: config.title || (config.type === 'alert' ? 'Notice' : config.type === 'prompt' ? 'Input' : 'Confirm Action'),
                message: config.message || '',
                subMessage: config.subMessage || null,
                confirmText: config.confirmText || (config.type === 'alert' ? 'OK' : 'Confirm'),
                cancelText: config.cancelText || 'Cancel',
                isDestructive: config.isDestructive ?? false,
                variant: config.variant || (config.isDestructive ? 'danger' : 'primary'), // 'danger', 'primary', 'warning', 'info', 'success'
                icon: config.icon || null,
                // Prompt specific options
                defaultValue: config.defaultValue || '',
                placeholder: config.placeholder || '',
                inputType: config.inputType || 'text', // 'text', 'password', 'number'
                required: config.required ?? false,
                backdropClose: config.backdropClose ?? (config.type !== 'alert'),
                resolve
            };

            set((state) => ({ dialogs: [...state.dialogs, dialog] }));
        });
    },

    confirm: (options) => {
        const config = typeof options === 'string' ? { message: options } : (options || {});
        return get().openDialog({
            type: 'confirm',
            ...config
        });
    },

    alert: (options) => {
        const config = typeof options === 'string' ? { message: options } : (options || {});
        return get().openDialog({
            type: 'alert',
            ...config
        });
    },

    prompt: (options) => {
        const config = typeof options === 'string' ? { message: options } : (options || {});
        return get().openDialog({
            type: 'prompt',
            ...config
        });
    },

    closeDialog: (id, result) => {
        const { dialogs } = get();
        const dialog = dialogs.find((d) => d.id === id);
        if (dialog && typeof dialog.resolve === 'function') {
            dialog.resolve(result);
        }
        set((state) => ({
            dialogs: state.dialogs.filter((d) => d.id !== id)
        }));
    }
}));

export default useDialogStore;
