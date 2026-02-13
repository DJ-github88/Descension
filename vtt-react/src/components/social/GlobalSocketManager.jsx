/**
 * Global Socket Manager
 * 
 * Ensures that the global socket connection (in presenceStore) is initialized
 * and maintained as long as the user is authenticated.
 * Also re-registers presence when the authenticated user changes (account switch).
 */

import React, { useEffect, useRef } from 'react';
import useAuthStore from '../../store/authStore';
import usePresenceStore from '../../store/presenceStore';

const GlobalSocketManager = () => {
    const { isAuthenticated, user } = useAuthStore();
    const initializeGlobalSocket = usePresenceStore((state) => state.initializeGlobalSocket);
    const isConnected = usePresenceStore((state) => state.isConnected);
    const socket = usePresenceStore((state) => state.socket);
    const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
    const prevUserIdRef = useRef(null);

    // Initialize socket when authenticated but not connected
    useEffect(() => {
        if (isAuthenticated && user && !isConnected && !socket) {
            console.log('🔄 Authenticated but no socket. Initializing global socket...');
            initializeGlobalSocket();
        }
    }, [isAuthenticated, user, isConnected, socket, initializeGlobalSocket]);

    // Re-register presence when the authenticated user changes (account switch in same tab)
    useEffect(() => {
        const currentUserId = currentUserPresence?.userId;
        if (!socket || !socket.connected || !currentUserId) return;

        // Only re-register if the userId actually changed
        if (prevUserIdRef.current && prevUserIdRef.current !== currentUserId) {
            console.log('🔄 User identity changed, re-registering socket presence:', currentUserId);
            socket.emit('register_presence', {
                userId: currentUserId,
                name: currentUserPresence.name || currentUserPresence.characterName,
                characterClass: currentUserPresence.class || currentUserPresence.characterClass,
                characterLevel: currentUserPresence.level || currentUserPresence.characterLevel
            });
        }

        prevUserIdRef.current = currentUserId;
    }, [socket, currentUserPresence?.userId]);

    // This component doesn't render anything
    return null;
};

export default GlobalSocketManager;
