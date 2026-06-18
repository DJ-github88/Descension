import { create } from 'zustand';

const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const DEFAULT_DURATION = 5000;

const pushNotification = (set, notification) => {
    const id = notification.id || generateId();
    const record = {
        id,
        type: 'info',
        title: null,
        message: null,
        duration: DEFAULT_DURATION,
        persistent: false,
        action: null,
        ...notification
    };

    set(state => ({ notifications: [...state.notifications, record] }));
    return id;
};

const useNotificationStore = create((set, get) => ({
    notifications: [],

    showNotification: (notification) => pushNotification(set, notification),

    dismissNotification: (id) => {
        set(state => ({ notifications: state.notifications.filter(n => n.id !== id) }));
    },

    clearAll: () => set({ notifications: [] }),

    showSuccess: (message, options = {}) => pushNotification(set, {
        type: 'success',
        message,
        title: options.title || 'Success',
        ...options
    }),

    showError: (message, options = {}) => pushNotification(set, {
        type: 'error',
        message,
        title: options.title || 'Error',
        ...options
    }),

    showWarning: (message, options = {}) => pushNotification(set, {
        type: 'warning',
        message,
        title: options.title || 'Warning',
        ...options
    }),

    showInfo: (message, options = {}) => pushNotification(set, {
        type: 'info',
        message,
        title: options.title || 'Info',
        ...options
    })
}));

export default useNotificationStore;
