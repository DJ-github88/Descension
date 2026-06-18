import useAuthStore from '../../../store/authStore';

export function registerConnectionHandlers(ctx) {
  const {
    socket,
    setIsConnecting, setConnectionQuality, setConnectionStatus,
    setIsJoiningRoom, setPendingRoomData, setIsRoomReady,
    setError,
    isJoiningRoomRef, currentRoomRef, currentPlayerRef,
    autoJoinAttemptedRef, isAutoJoinSequenceRef,
    addNotificationRef, addNotification,
    checkAutoJoin, getActiveCharacter
  } = ctx;

    if (!socket) return;

    // IMPROVEMENT: Monitor socket connection status with quality tracking
    const handleConnect = () => {
      setIsConnecting(false);

      // IMPROVEMENT: Measure latency on connect
      const startTime = Date.now();
      socket.emit('ping');
      socket.once('pong', () => {
        const latency = Date.now() - startTime;
        const quality = latency < 100 ? 'excellent' : latency < 200 ? 'good' : latency < 500 ? 'fair' : 'poor';
        setConnectionQuality({ latency, quality });

        if (quality === 'poor') {
          console.warn(`âš ï¸ High latency detected: ${latency}ms`);
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `Connection quality is poor (${latency}ms latency). Gameplay may be affected.`,
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }
      });

      // Periodic latency checks
      const latencyCheckInterval = setInterval(() => {
        if (socket.connected) {
          const pingStart = Date.now();
          socket.emit('ping');
          socket.once('pong', () => {
            const latency = Date.now() - pingStart;
            const quality = latency < 100 ? 'excellent' : latency < 200 ? 'good' : latency < 500 ? 'fair' : 'poor';
            setConnectionQuality({ latency, quality });
          });
        } else {
          clearInterval(latencyCheckInterval);
        }
      }, 30000);

      socket._latencyCheckInterval = latencyCheckInterval;

      // Trigger auto-join logic
      checkAutoJoin();
    };

    socket.on('connect', handleConnect);

    socket.on('error', (data) => {
      console.error('âŒ Socket error received:', data);
      if (typeof data === 'object') {
        console.error('Socket Error Details:', JSON.stringify(data, null, 2));
      }

      if (isJoiningRoomRef.current && !currentRoomRef.current) {
        console.log('âš ï¸ Error during join/create, resetting loading state');
        setIsJoiningRoom(false);
        setPendingRoomData(null);
        setIsRoomReady(false);
        setConnectionStatus('error');

        // Allow retrying auto-join if it failed
        autoJoinAttemptedRef.current = false;
        isAutoJoinSequenceRef.current = false;

        const errorMessage = typeof data === 'string' ? data : (data.message || 'Unknown error');
        addNotificationRef.current('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Error joining room: ${errorMessage}`,
          type: 'error',
          timestamp: new Date().toISOString()
        });
      }
    });

    // NEW: Handle specific room errors from server
    socket.on('room_error', (data) => {
      const errorMessage = typeof data === 'string' ? data : (data.message || 'Unknown room error');
      
      setError(errorMessage);
      setConnectionStatus('error');
      
      if (isJoiningRoomRef.current) {
        setIsJoiningRoom(false);
        setPendingRoomData(null);
        setIsRoomReady(false);
      }

      autoJoinAttemptedRef.current = false;
      
      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Room Error: ${errorMessage}`,
        type: 'error',
        timestamp: new Date().toISOString()
      });
    });

    socket.on('auth_error', (data) => {
      const errorMessage = typeof data === 'string' ? data : (data.error || data.message || 'Authentication required');
      console.warn('ðŸ›¡ï¸ [auth_error] received, dismissing loading screen:', errorMessage);
      setError(errorMessage);
      setConnectionStatus('error');

      // CRITICAL FIX: An auth failure during create_room/join_room means room_joined
      // will never arrive. If we don't reset the loading state here, the overlay climbs
      // to 95% ("Finalizing...") and hangs forever. Mirror the room_error/error handlers.
      if (isJoiningRoomRef.current) {
        setIsJoiningRoom(false);
        setPendingRoomData(null);
        setIsRoomReady(false);
      }

      // Allow retrying once auth is restored
      autoJoinAttemptedRef.current = false;
      isAutoJoinSequenceRef.current = false;

      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: errorMessage,
        type: 'error',
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('ðŸ”Œ Socket disconnected:', reason);
      setConnectionStatus(reason === 'io client disconnect' ? 'disconnected' : 'error');
      setConnectionQuality({ latency: 0, quality: 'disconnected' });
      autoJoinAttemptedRef.current = false;

      if (socket._latencyCheckInterval) {
        clearInterval(socket._latencyCheckInterval);
        delete socket._latencyCheckInterval;
      }

      if (reason === 'io server disconnect') {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: 'Disconnected by server. Attempting to reconnect...',
          type: 'system',
          timestamp: new Date().toISOString()
        });
      } else if (reason === 'transport close' || reason === 'ping timeout') {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Connection lost (${reason}). Attempting to reconnect...`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle synchronization errors
    socket.on('sync_error', (data) => {
      console.error('Synchronization error:', data);

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Sync error: ${data.message}. Requesting full sync...`,
        type: 'system',
        timestamp: new Date().toISOString()
      });

      // Request full sync to recover
      setTimeout(() => {
        socket.emit('request_full_sync');
      }, 1000);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('âŒ Connection error:', error);

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: 'Connection error. Attempting to reconnect...',
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    // IMPROVEMENT: Handle reconnection with better state recovery
    socket.on('reconnect', (attemptNumber) => {

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Reconnected to server (attempt ${attemptNumber}). Syncing game state...`,
        type: 'system',
        timestamp: new Date().toISOString()
      });

      // IMPROVEMENT: Rejoin room if we were in one
      if (currentRoomRef.current && currentPlayerRef.current) {
        // Small delay to ensure socket is fully connected
        setTimeout(() => {
          // Request full sync to get latest game state
          socket.emit('request_full_sync');

          // Also request combat sync if combat was active
          socket.emit('request_combat_sync');

          // Re-send our character data to ensure server has latest
          const activeCharacter = getActiveCharacter();
          if (activeCharacter && socket.connected) {
            try {
              const authStore = require('../../../store/authStore').default;
              const authState = authStore.getState();
              const userId = authState.user?.uid || null;

              socket.emit('character_updated', {
                characterId: activeCharacter.id,
                userId: userId,
                character: {
                  name: activeCharacter.name,
                  class: activeCharacter.class,
                  race: activeCharacter.race,
                  subrace: activeCharacter.subrace,
                  raceDisplayName: activeCharacter.raceDisplayName || '',
                  background: activeCharacter.background || '',
                  backgroundDisplayName: activeCharacter.backgroundDisplayName || '',
                  path: activeCharacter.path || '',
                  pathDisplayName: activeCharacter.pathDisplayName || '',
                  level: activeCharacter.level,
                  health: activeCharacter.health,
                  mana: activeCharacter.mana,
                  actionPoints: activeCharacter.actionPoints,
                  // CRITICAL FIX: Always include classResource if it has a valid max value
                  ...(activeCharacter.classResource?.max ? { classResource: activeCharacter.classResource } : {}),
                  playerId: currentPlayerRef.current.id
                }
              });
            } catch (error) {
              console.warn('Failed to resend character data on reconnect:', error);
            }
          }
        }, 500);
      } else {
        // Not in a room, just request sync if we have a socket
        setTimeout(() => {
          socket.emit('request_full_sync');
        }, 500);
      }
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('error');
      socket.off('room_error');
      socket.off('auth_error');
      socket.off('disconnect');
      socket.off('sync_error');
      socket.off('connect_error');
      socket.off('reconnect');
    };
}
