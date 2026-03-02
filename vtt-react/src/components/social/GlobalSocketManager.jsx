/**
 * Global Socket Manager
 * 
 * Ensures that the global socket connection (in presenceStore) is initialized
 * and maintained as long as the user is authenticated.
 * Also re-registers presence when the authenticated user changes (account switch).
 * 
 * CRITICAL: Initializes presence on login so users appear online immediately
 * without needing to open the Community window.
 */

import React, { useEffect, useRef } from 'react';
import useAuthStore from '../../store/authStore';
import usePresenceStore from '../../store/presenceStore';
import useCharacterStore from '../../store/characterStore';

const GlobalSocketManager = () => {
    const { isAuthenticated, user, userData } = useAuthStore();
    const initializeGlobalSocket = usePresenceStore((state) => state.initializeGlobalSocket);
    const initializePresence = usePresenceStore((state) => state.initializePresence);
    const subscribeToOnlineUsers = usePresenceStore((state) => state.subscribeToOnlineUsers);
    const isConnected = usePresenceStore((state) => state.isConnected);
    const socket = usePresenceStore((state) => state.socket);
    const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
    const prevUserIdRef = useRef(null);
    const presenceInitializedRef = useRef(false);

    // Get character data from store
    const characterId = useCharacterStore((state) => state.id);
    const characterName = useCharacterStore((state) => state.name);
    const characterLevel = useCharacterStore((state) => state.level);
    const characterClass = useCharacterStore((state) => state.class);
    const characterRace = useCharacterStore((state) => state.race);
    const characterSubrace = useCharacterStore((state) => state.subrace);
    const characterRaceDisplayName = useCharacterStore((state) => state.raceDisplayName);
    const characterBackground = useCharacterStore((state) => state.background);
    const characterBackgroundDisplayName = useCharacterStore((state) => state.backgroundDisplayName);
    const characterPath = useCharacterStore((state) => state.path);
    const characterPathDisplayName = useCharacterStore((state) => state.pathDisplayName);

    // Initialize socket when authenticated but not connected
    // CRITICAL FIX: Skip initialization if we're entering or in a multiplayer room
    // to prevent race condition where a new socket disconnects the multiplayer socket
    useEffect(() => {
        if (isAuthenticated && user && !isConnected && !socket) {
            // Check if we're in multiplayer mode - if so, the multiplayer socket handles everything
            const isEnteringMultiplayer = sessionStorage.getItem('enteringMultiplayer') === 'true';
            try {
                const gameStore = require('../../store/gameStore').default;
                const isInMultiplayer = gameStore.getState().isInMultiplayer;
                if (isInMultiplayer || isEnteringMultiplayer) {
                    console.log('⏭️ Skipping global socket init - in multiplayer mode');
                    return;
                }
            } catch (e) {
                // gameStore might not be available, continue with init
            }
            console.log('🔄 Authenticated but no socket. Initializing global socket...');
            initializeGlobalSocket();
        }
    }, [isAuthenticated, user, isConnected, socket, initializeGlobalSocket]);

    // CRITICAL: Initialize presence immediately when user authenticates
    // This ensures users appear online without needing to open Community window
    useEffect(() => {
        const userId = user?.uid;
        if (!isAuthenticated || !userId) {
            presenceInitializedRef.current = false;
            return;
        }

        // Skip if already initialized for this user
        if (presenceInitializedRef.current && currentUserPresence?.userId === userId) {
            return;
        }

        // CRITICAL: Check for default "Character Name" and use account name as fallback
        const isDefaultName = characterName === 'Character Name' || characterName === 'Character Name (Room Name)';
        const resolvedCharacterName = (!isDefaultName && characterName) ? characterName : (user?.displayName || 'Adventurer');

        // Build character data
        const characterData = {
            id: characterId || 'temp_character',
            name: resolvedCharacterName,
            level: characterLevel || 1,
            class: characterClass || 'Adventurer',
            background: characterBackground || '',
            backgroundDisplayName: characterBackgroundDisplayName || '',
            race: characterRace || '',
            subrace: characterSubrace || '',
            raceDisplayName: characterRaceDisplayName || '',
            path: characterPath || '',
            pathDisplayName: characterPathDisplayName || ''
        };

        const sessionData = {
            sessionType: null
        };

        const accountName = user?.displayName || 'Unknown';
        const isGuest = user?.isGuest || false;
        const friendId = userData?.friendId || user?.friendId || null;

        console.log('🟢 Initializing presence on authentication for:', userId, characterData.name);
        initializePresence(userId, characterData, sessionData, accountName, isGuest, friendId);
        subscribeToOnlineUsers();
        
        presenceInitializedRef.current = true;
    }, [isAuthenticated, user?.uid, characterId, characterName, initializePresence, subscribeToOnlineUsers]);

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
                accountName: currentUserPresence.accountName || null, // CRITICAL: Include account name for fallback
                characterClass: currentUserPresence.class || currentUserPresence.characterClass,
                characterLevel: currentUserPresence.level || currentUserPresence.characterLevel,
                // Include character data for HUD display
                character: {
                    class: currentUserPresence.class || 'Unknown',
                    level: currentUserPresence.level || 1,
                    health: currentUserPresence.health || { current: 45, max: 50 },
                    mana: currentUserPresence.mana || { current: 45, max: 50 },
                    actionPoints: currentUserPresence.actionPoints || { current: 1, max: 3 },
                    race: currentUserPresence.race || 'Unknown',
                    raceDisplayName: currentUserPresence.raceDisplayName || 'Unknown'
                },
                health: currentUserPresence.health || { current: 45, max: 50 },
                mana: currentUserPresence.mana || { current: 45, max: 50 },
                actionPoints: currentUserPresence.actionPoints || { current: 1, max: 3 }
            });
        }

        prevUserIdRef.current = currentUserId;
    }, [socket, currentUserPresence?.userId]);

    // This component doesn't render anything
    return null;
};

export default GlobalSocketManager;
