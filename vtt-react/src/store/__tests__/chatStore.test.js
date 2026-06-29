import useChatStore from '../chatStore';

describe('useChatStore', () => {
    beforeEach(() => {
        // Clear store to default state before each test
        useChatStore.setState({
            activeTab: 'social',
            notifications: {
                social: [],
                combat: [],
                loot: []
            },
            isOpen: false,
            unreadCounts: {
                social: 0,
                combat: 0,
                loot: 0
            },
            onlineUsers: [],
            currentUser: { id: 'current', name: 'Player', class: 'sentinel', level: 10 },
            multiplayerSocket: null,
            sendMultiplayerMessage: null,
            typingUsers: {}
        });
        localStorage.clear();
    });

    describe('Tabs and Window visibility', () => {
        it('sets active tab and clears its unread count', () => {
            // Set unread count first
            useChatStore.setState({
                unreadCounts: {
                    social: 5,
                    combat: 2,
                    loot: 0
                }
            });

            useChatStore.getState().setActiveTab('combat');

            expect(useChatStore.getState().activeTab).toBe('combat');
            expect(useChatStore.getState().unreadCounts.combat).toBe(0);
            expect(useChatStore.getState().unreadCounts.social).toBe(5); // unchanged
        });

        it('sets isOpen and resets unread count for active tab if opened', () => {
            useChatStore.setState({
                activeTab: 'social',
                unreadCounts: {
                    social: 4,
                    combat: 0,
                    loot: 0
                },
                isOpen: false
            });

            useChatStore.getState().setIsOpen(true);

            expect(useChatStore.getState().isOpen).toBe(true);
            expect(useChatStore.getState().unreadCounts.social).toBe(0);
        });
    });

    describe('Notification management', () => {
        it('adds a notification to a specific tab and increments unread count if window closed', () => {
            useChatStore.setState({
                isOpen: false,
                activeTab: 'social'
            });

            const notification = { id: 'n1', content: 'New loot found' };
            useChatStore.getState().addNotification('loot', notification);

            expect(useChatStore.getState().notifications.loot).toHaveLength(1);
            expect(useChatStore.getState().notifications.loot[0].content).toBe('New loot found');
            expect(useChatStore.getState().unreadCounts.loot).toBe(1);
        });

        it('does not increment unread count for a tab if window is open and that tab is active', () => {
            useChatStore.setState({
                isOpen: true,
                activeTab: 'social'
            });

            const notification = { id: 'n1', content: 'Hello there' };
            useChatStore.getState().addNotification('social', notification);

            expect(useChatStore.getState().notifications.social).toHaveLength(1);
            expect(useChatStore.getState().unreadCounts.social).toBe(0);
        });

        it('caps notifications array at MAX_MESSAGES (100)', () => {
            useChatStore.setState({ isOpen: true, activeTab: 'combat' });

            for (let i = 0; i < 120; i++) {
                useChatStore.getState().addNotification('combat', { id: `msg-${i}`, content: `Dmg ${i}` });
            }

            expect(useChatStore.getState().notifications.combat).toHaveLength(100);
            // Verify oldest messages were evicted (should start with msg-20)
            expect(useChatStore.getState().notifications.combat[0].id).toBe('msg-20');
            expect(useChatStore.getState().notifications.combat[99].id).toBe('msg-119');
        });
    });

    describe('Online Users and Typing Indicators', () => {
        it('sets typing status for users', () => {
            useChatStore.getState().setUserTyping('user-1', 'Thordak', true);

            let typing = useChatStore.getState().typingUsers;
            expect(typing['user-1'].isTyping).toBe(true);
            expect(typing['user-1'].name).toBe('Thordak');

            useChatStore.getState().setUserTyping('user-1', 'Thordak', false);
            typing = useChatStore.getState().typingUsers;
            expect(typing['user-1']).toBeUndefined();
        });

        it('cleans up stale typing indicators', () => {
            const now = Date.now();
            jest.spyOn(Date, 'now').mockReturnValue(now);

            useChatStore.getState().setUserTyping('user-1', 'Thordak', true);
            
            // Mock a future timestamp (15 seconds later)
            Date.now.mockReturnValue(now + 15000);
            useChatStore.getState().cleanupTypingIndicators();

            expect(useChatStore.getState().typingUsers['user-1']).toBeUndefined();

            Date.now.mockRestore();
        });
    });
});
