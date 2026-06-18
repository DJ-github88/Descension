import { io } from 'socket.io-client';
import useAuthStore from '../../store/authStore';
import useGameStore from '../../store/gameStore';
import usePartyStore from '../../store/partyStore';
import useCharacterStore from '../../store/characterStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';

const CURSOR_DEBUG = process.env.REACT_APP_CURSOR_DEBUG === 'true';
const cursorDebug = (...args) => {
  if (CURSOR_DEBUG) {
    console.log(...args);
  }
};

export function setupSocketConnection({
  SOCKET_URL,
  setSocket,
  setIsConnecting,
  setIsJoiningRoom,
  setConnectionStatus,
  currentRoomRef,
  currentPlayerRef,
  roomPasswordRef,
  addNotificationRef,
  getActiveCharacter
}) {
  let newSocket = null;

  const initializeSocket = async () => {
    let authToken = null;
    try {
      const authState = useAuthStore.getState();
      if (authState.user && !authState.isDevelopmentBypass && !authState.user.isGuest && authState.user.getIdToken) {
        authToken = await authState.user.getIdToken();
      }
    } catch (error) {
      console.warn('Could not get auth token for socket:', error);
    }

    newSocket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: authToken
      }
    });

    newSocket.on('connect', () => {
      console.log('🔌 [MultiplayerApp] Multiplayer socket CONNECTED:', newSocket.id);
      setIsConnecting(false);

      if (currentRoomRef.current) {
        const roomData = currentRoomRef.current;
        console.log('🔄 Socket connected, auto-rejoining room:', roomData.id);

        try {
          const partyState = usePartyStore.getState();
          const selfIds = new Set(['current-player']);
          try {
            const gs = useGameStore.getState();
            if (gs?.currentPlayer?.id) selfIds.add(gs.currentPlayer.id);
          } catch (e) {}
          const authUid = useAuthStore.getState().user?.uid;
          if (authUid) selfIds.add(authUid);

          const selfMember = partyState.partyMembers.find(m =>
            selfIds.has(m.id) || selfIds.has(m.userId) || selfIds.has(m.socketId)
          );
          if (selfMember && newSocket.id) {
            usePartyStore.getState().updatePartyMember(selfMember.id, {
              socketId: newSocket.id,
              isConnected: true
            });
            console.log('🔄 Updated self socketId in party store:', newSocket.id);
          }
        } catch (e) {
          console.warn('⚠️ Failed to update socketId on reconnect:', e);
        }

        newSocket.emit('join_room', {
          roomId: roomData.persistentRoomId || roomData.id,
          playerName: currentPlayerRef.current?.name || 'Reconnecting...',
          password: roomPasswordRef.current || '',
          isReconnect: true,
          character: useCharacterStore.getState().getActiveCharacter() || null
        });

        const isPersistentRejoin = !!roomData?.persistentRoomId;
        if (isPersistentRejoin) {
          console.warn('🛡️ [Reconnect] Permanent room rejoin detected — ensuring data persists!');
        } else {
          useCreatureStore.getState().clearCreatureTokens();
          const charTokenState = useCharacterTokenStore.getState();
          if (charTokenState.clearCharacterTokens) {
            charTokenState.clearCharacterTokens();
          }
          console.log('🧹 Cleared tokens for room rejoin');
        }

        useGameStore.getState().set({
          multiplayerSocket: newSocket,
          isInMultiplayer: true
        });
        console.log('🔄 Updated multiplayerSocket in gameStore for reconnect');
      }

      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: 'Successfully connected to multiplayer server!',
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnecting(false);
      setConnectionStatus('disconnected');

      const reasonMessage = reason === 'io server disconnect' ? 'Server disconnected' :
        reason === 'io client disconnect' ? 'Client disconnected' :
          reason === 'ping timeout' ? 'Connection timed out' :
            reason === 'transport close' ? 'Connection closed' :
              'Connection lost';

      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Disconnected from multiplayer server: ${reasonMessage}`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error in MultiplayerApp:', error);
      setIsConnecting(false);
      setIsJoiningRoom(false);

      if (error && error.message && !error.message.includes('transport close')) {
        addNotificationRef.current('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Connection error: ${error.message || 'Unknown error'}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnecting(false);
      setIsJoiningRoom(false);
      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: 'Failed to connect to server. Please check your connection.',
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    setSocket(newSocket);
    setIsConnecting(true);

    try {
      import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
        usePresenceStore.getState().setSocket(newSocket);
      });
    } catch (e) {
      console.warn('Could not sync socket to presenceStore:', e);
    }

    newSocket.connect();
  };

  initializeSocket();

  return () => {
    if (newSocket) {
      newSocket.emit('leave_room');
      newSocket.disconnect();
    }
  };
}

export function setupCursorTracking({
  socket,
  showCursorTracking,
  cursorUpdateThrottle,
  currentPlayerRef,
  currentRoomRef
}) {
  if (!socket) {
    cursorDebug('🖱️ [Cursor] Emit listener not attached: socket unavailable');
    return;
  }

  if (!showCursorTracking) {
    cursorDebug('🖱️ [Cursor] Emit listener not attached: showCursorTracking is disabled');
    return;
  }

  let lastEmitTime = 0;
  const THROTTLE_MS = Math.max(12, Math.min(cursorUpdateThrottle || 16, 33));
  const MIN_WORLD_DELTA = 0.25;
  let lastWorldX = null;
  let lastWorldY = null;

  const handleMouseMove = (event) => {
    if (!socket.connected) return;

    const now = Date.now();
    if (now - lastEmitTime < THROTTLE_MS) return;

    if (socket && socket.connected) {
      let worldPos = { x: event.clientX, y: event.clientY };
      try {
        const gridSystem = getGridSystem();
        const viewportDimensions = gridSystem.getViewportDimensions();
        worldPos = gridSystem.screenToWorld(
          event.clientX,
          event.clientY,
          viewportDimensions.width,
          viewportDimensions.height
        );
      } catch (e) {}

      if (
        lastWorldX !== null &&
        lastWorldY !== null &&
        Math.abs(worldPos.x - lastWorldX) < MIN_WORLD_DELTA &&
        Math.abs(worldPos.y - lastWorldY) < MIN_WORLD_DELTA
      ) {
        return;
      }

      lastEmitTime = now;
      lastWorldX = worldPos.x;
      lastWorldY = worldPos.y;

      const gameStoreState = useGameStore.getState();
      const partyStoreState = usePartyStore.getState();
      const currentPlayer = partyStoreState.partyMembers.find(m => m.id === 'current-player');
      const playerColor = currentPlayer?.character?.tokenSettings?.color || (gameStoreState.isGMMode ? '#d4af37' : '#4a90e2');

      socket.emit('cursor_move', {
        worldX: worldPos.x,
        worldY: worldPos.y,
        x: event.clientX,
        y: event.clientY,
        playerId: currentPlayerRef.current?.id || 'unknown',
        playerName: currentPlayerRef.current?.name || (gameStoreState.isGMMode ? 'Game Master' : 'Unknown'),
        playerColor: playerColor
      });

      cursorDebug('🖱️ [Cursor] Emitted cursor_move', {
        playerId: currentPlayerRef.current?.id || 'unknown',
        worldX: Math.round(worldPos.x),
        worldY: Math.round(worldPos.y)
      });
    }
  };

  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  cursorDebug('🖱️ Cursor tracking enabled - emitting cursor positions');

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    cursorDebug('🖱️ Cursor tracking disabled');
  };
}

export function setupAuthChangeHandler({
  socket,
  isJoiningRoomRef,
  isAutoJoinSequenceRef
}) {
  const authStore = useAuthStore;

  const handleAuthChange = async () => {
    if (!socket) return;

    if (window._isMapSwitching) {
      console.log('⏭️ [Auth] Skipping socket reconnect during map switch');
      return;
    }

    const isInMultiplayer = useGameStore.getState().isInMultiplayer;
    if (isInMultiplayer) {
      console.log('⏭️ [Auth] Skipping socket reconnect - in multiplayer room');
      return;
    }

    if (isJoiningRoomRef.current || isAutoJoinSequenceRef.current) {
      console.log('⏭️ [Auth] Skipping socket reconnect - joining room');
      return;
    }

    try {
      const authState = authStore.getState();

      if (socket.connected) {
        socket.disconnect();
      }

      let authToken = null;
      if (authState.user && !authState.isDevelopmentBypass && !authState.user?.isGuest && authState.user.getIdToken) {
        authToken = await authState.user.getIdToken(true);
      }

      socket.auth = { token: authToken };

      if (authState.isAuthenticated || authState.user?.isGuest) {
        socket.connect();
      }
    } catch (error) {
      console.warn('Could not refresh socket auth token:', error);
    }
  };

  const unsubscribe = authStore.subscribe(handleAuthChange);

  return unsubscribe;
}
