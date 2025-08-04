// Simple chat store stub
import { create } from 'zustand';

const useChatStore = create((set, get) => ({
    messages: [],
    
    addMessage: (message) => {
        set(state => ({
            messages: [...state.messages, message]
        }));
    },
    
    clearMessages: () => {
        set({ messages: [] });
    }
}));

export default useChatStore;
