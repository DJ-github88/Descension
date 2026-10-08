import { io } from 'socket.io-client';
import {
  principalKeyOfAuthState,
  retireSocketPrincipal,
  createSocketLifetimeGuard
} from '../../persistence/handoff/socketPrincipalRetirement';
import { getBootstrapGateState } from '../../persistence/bootstrapPrivacyGate';
import { exitRoomProjection } from '../../persistence/mapProjectionBoundary';
import useAuthStore from '../../store/authStore';
import useGameStore from '../../store/gameStore';
import usePartyStore from '../../store/partyStore';
import useCharacterStore from '../../store/characterStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { isProduction } from '../../config/env';

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
  // Wave A (P5/S4, corrected R8/B5): disposal permanently invalidates this
  // setup, even if the same UID logs back in and the principal string matches.
  let disposed = false;

  const initializeSocket = async () => {
    // Capture the exact principal AND account generation before any await.
    // The initial connection may only install while that operation identity
    // is still current, the socket has not been retired, and the setup has
    // not been disposed.
    const principalAtStart = principalKeyOfAuthState(useAuthStore.getState());
    const generationAtStart = getBootstrapGateState().accountGeneration;
    const setupValid = () =>
      !disposed &&
      principalKeyOfAuthState(useAuthStore.getState()) === principalAtStart &&
      getBootstrapGateState().accountGeneration === generationAtStart;
    let authToken = null;
    // Dev tokens are only ever sent outside production.
    const allowDevToken = !isProduction();
    try {
      const authState = useAuthStore.getState();
      if (authState.user && typeof authState.user.getIdToken === 'function') {
        authToken = await authState.user.getIdToken();
      } else if (allowDevToken && authState.user && !authState.user.isGuest) {
        authToken = `dev-token-${authState.user.uid || 'admin-dev-user'}`;
      } else if (allowDevToken && (authState.isDevelopmentBypass || authState.isAdminBypass || authState.isAuthenticated)) {
        authToken = `dev-token-${authState.user?.uid || 'admin-dev-user'}`;
      }
    } catch (error) {
      console.warn('Could not get auth token for socket:', error);
      const authState = useAuthStore.getState();
      if (allowDevToken && authState.user?.uid) {
        authToken = `dev-token-${authState.user.uid}`;
      }
    }

    if (!setupValid()) {
      console.warn('🔐 [Auth] Principal/generation changed during initial socket setup - aborting connection');
      return;
    }

    newSocket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: authToken
      }
    });

    const socketLifetime = createSocketLifetimeGuard({
      socket: newSocket,
      principalKey: principalAtStart,
      accountGeneration: generationAtStart,
      getAuthState: () => useAuthStore.getState(),
      getAccountGeneration: () => getBootstrapGateState()
    });

    newSocket.on('connect', () => {
      if (!setupValid() || !socketLifetime.isValid()) {
        console.warn('🔐 [Auth] Retired/superseded socket attempted to connect - dropping');
        newSocket.disconnect();
        return;
      }
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
          console.warn('🛡️ [Reconnect] Permanent room rejoin detected: ensuring data persists!');
        } else {
          useCreatureStore.getState().clearCreatureTokens();
          const charTokenState = useCharacterTokenStore.getState();
          if (charTokenState.clearCharacterTokens) {
            charTokenState.clearCharacterTokens();
          }
          console.log('🧹 Cleared tokens for room rejoin');
        }

        useGameStore.setState({
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

    if (!setupValid() || !socketLifetime.isValid()) {
      newSocket.disconnect();
      return;
    }

    setSocket(newSocket);
    setIsConnecting(true);

    try {
      import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
        if (!setupValid() || !socketLifetime.isValid()) return;
        usePresenceStore.getState().setSocket(newSocket);
      });
    } catch (e) {
      console.warn('Could not sync socket to presenceStore:', e);
    }

    newSocket.connect();
  };

  initializeSocket();

  const cleanup = () => {
    disposed = true;
    if (newSocket) {
      newSocket.emit('leave_room');
      newSocket.disconnect();
      // Clear the presence store's binding so it never treats this dead socket
      // as connected in the next session.
      try {
        const presenceStore = require('../../store/presenceStore').default;
        if (presenceStore?.getState?.().socket === newSocket) {
          presenceStore.getState().setSocket?.(null);
        }
      } catch (_e) { /* ignore */ }
    }
  };

  return cleanup;
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
  isAutoJoinSequenceRef,
  currentRoomRef,
  roomPasswordRef,
  currentPlayerRef,
  pendingRoomDataRef,
  activeJoinIdRef,
  autoJoinAttemptedRef,
  setCurrentRoom,
  setSocket,
  setCurrentPlayer,
  setPendingRoomData,
  setIsRoomReady,
  setIsJoiningRoom,
  setIsFadingOut,
  setShowContinue
}) {
  const authStore = useAuthStore;
  let lastPrincipalKey = principalKeyOfAuthState(authStore.getState());

  const clearRetiredAdmissionState = () => {
    try {
      // Wave B (S5/E): a retired admission must not leave the projection
      // suspension active for the next owner.
      exitRoomProjection();
      if (typeof setCurrentRoom === 'function') setCurrentRoom(null);
      if (typeof setSocket === 'function') setSocket(null);
      if (typeof setCurrentPlayer === 'function') setCurrentPlayer(null);
      if (typeof setPendingRoomData === 'function') setPendingRoomData(null);
      if (typeof setIsRoomReady === 'function') setIsRoomReady(false);
      if (typeof setIsJoiningRoom === 'function') setIsJoiningRoom(false);
      if (typeof setIsFadingOut === 'function') setIsFadingOut(false);
      if (typeof setShowContinue === 'function') setShowContinue(false);
      if (activeJoinIdRef && 'current' in activeJoinIdRef) activeJoinIdRef.current = null;
      if (autoJoinAttemptedRef && 'current' in autoJoinAttemptedRef) autoJoinAttemptedRef.current = false;
    } catch (_error) {
      // ignore UI reset failures; the socket and stored state are handled
    }
  };

  const handleAuthChange = async () => {
    if (!socket) return;

    const authState = authStore.getState();
    const nextPrincipalKey = principalKeyOfAuthState(authState);

    // Wave A (P5/S4, corrected R8): principal retirement is checked BEFORE the
    // map-switch early return so a switch cannot bypass it.
    if (nextPrincipalKey !== lastPrincipalKey) {
      lastPrincipalKey = nextPrincipalKey;
      console.warn('🔐 [Auth] Principal change detected - retiring old multiplayer socket');
      retireSocketPrincipal({
        socket,
        refs: { currentRoomRef, roomPasswordRef, currentPlayerRef, pendingRoomDataRef },
        clearRuntime: true,
        clearPendingJoin: true
      });
      clearRetiredAdmissionState();
      return;
    }

    if (window._isMapSwitching) {
      console.log('⏭️ [Auth] Skipping socket reconnect during map switch');
      return;
    }

    // Same-principal token refresh path (existing behavior): never disrupt an
    // active multiplayer session.
    if (useGameStore.getState().isInMultiplayer) {
      console.log('⏭️ [Auth] Skipping socket reconnect - in multiplayer room');
      return;
    }

    if (isJoiningRoomRef.current || isAutoJoinSequenceRef.current) {
      console.log('⏭️ [Auth] Skipping socket reconnect - joining room');
      return;
    }

    // Capture the exact continuation identity BEFORE awaiting the token.
    const lifetime = createSocketLifetimeGuard({
      socket,
      principalKey: nextPrincipalKey,
      accountGeneration: getBootstrapGateState().accountGeneration,
      getAuthState: () => authStore.getState(),
      getAccountGeneration: () => getBootstrapGateState()
    });

    try {
      if (socket.connected) {
        socket.disconnect();
      }

      let authToken = null;
      const allowDevToken = !isProduction();
      if (authState.user && typeof authState.user.getIdToken === 'function') {
        authToken = await authState.user.getIdToken(true);
      } else if (allowDevToken && authState.user && !authState.user?.isGuest) {
        authToken = `dev-token-${authState.user.uid || 'admin-dev-user'}`;
      } else if (allowDevToken && (authState.isDevelopmentBypass || authState.isAdminBypass || authState.isAuthenticated)) {
        authToken = `dev-token-${authState.user?.uid || 'admin-dev-user'}`;
      }

      // Revalidate after the await, before any side effect.
      if (!lifetime.isValid()) {
        console.warn('🔐 [Auth] Principal changed/retired during token refresh - not reconnecting');
        if (socket.connected) socket.disconnect();
        return;
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
