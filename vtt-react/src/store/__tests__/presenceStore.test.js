import usePresenceStore from '../presenceStore';
import { registerStore } from '../storeRegistry';

// Mock dependencies
jest.mock('socket.io-client', () => ({
    io: jest.fn(() => ({
        on: jest.fn(),
        emit: jest.fn(),
        connect: jest.fn(),
        disconnect: jest.fn()
    }))
}));

jest.mock('../../services/firebase/presenceService', () => ({
    updateUserPresence: jest.fn(),
    goOffline: jest.fn()
}));

describe('usePresenceStore', () => {
    let mockPartyStore;

    beforeEach(() => {
        // Reset Zustand store state before each test
        usePresenceStore.setState({
            onlineUsers: new Map(),
            currentUserPresence: null,
            activeTab: 'global',
            whisperTabs: new Map(),
            globalChatMessages: [],
            isGlobalChatMuted: false,
            partyChatMessages: [],
            partyChatUnreadCount: 0,
            travelChatUnreadCount: 0,
            isCommunityWindowOpen: false,
            partyMembers: [],
            pendingInvitations: [],
            pendingPartyInvites: []
        });

        jest.clearAllMocks();

        mockPartyStore = {
            getState: jest.fn(() => ({
                partyMembers: []
            }))
        };

        registerStore('partyStore', mockPartyStore);
    });

    describe('UI Visibility and Muting', () => {
        it('sets community window open status', () => {
            usePresenceStore.getState().setCommunityWindowOpen(true);
            expect(usePresenceStore.getState().isCommunityWindowOpen).toBe(true);

            usePresenceStore.getState().setCommunityWindowOpen(false);
            expect(usePresenceStore.getState().isCommunityWindowOpen).toBe(false);
        });

        it('changes active tab', () => {
            usePresenceStore.getState().setActiveTab('party');
            expect(usePresenceStore.getState().activeTab).toBe('party');
        });

        it('mutes and unmutes global chat', () => {
            expect(usePresenceStore.getState().isGlobalChatMuted).toBe(false);
            usePresenceStore.getState().toggleGlobalChatMute();
            expect(usePresenceStore.getState().isGlobalChatMuted).toBe(true);

            usePresenceStore.getState().toggleGlobalChatMute();
            expect(usePresenceStore.getState().isGlobalChatMuted).toBe(false);
        });
    });

    describe('User Presence and Whisper management', () => {
        it('manages online users mapping', () => {
            const user1 = { userId: 'u1', name: 'Garrick', class: 'Mage' };
            
            // Simulates updating online users (typically via socket events)
            const nextUsers = new Map(usePresenceStore.getState().onlineUsers);
            nextUsers.set('u1', user1);
            usePresenceStore.setState({ onlineUsers: nextUsers });

            expect(usePresenceStore.getState().onlineUsers.has('u1')).toBe(true);
            expect(usePresenceStore.getState().onlineUsers.get('u1').name).toBe('Garrick');
        });

        it('buffers whisper messages and creates whisper tabs', () => {
            const user = { userId: 'u2', characterName: 'Legolas', name: 'Legolas' };
            const msg = { senderId: 'u2', senderName: 'Legolas', content: 'Hail!', timestamp: Date.now(), type: 'whisper_received' };

            // Add user to onlineUsers first, so addWhisperMessage can resolve the user object
            const nextUsers = new Map(usePresenceStore.getState().onlineUsers);
            nextUsers.set('u2', user);
            usePresenceStore.setState({ onlineUsers: nextUsers });

            usePresenceStore.getState().addWhisperMessage('u2', msg);

            const tabs = usePresenceStore.getState().whisperTabs;
            expect(tabs.has('u2')).toBe(true);
            expect(tabs.get('u2').messages).toHaveLength(1);
            expect(tabs.get('u2').messages[0].content).toBe('Hail!');
            expect(tabs.get('u2').unreadCount).toBe(1);
        });
    });
});
