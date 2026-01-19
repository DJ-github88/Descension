import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import RoomLobby from './RoomLobby';
// Removed: LocalhostMultiplayerSimulator - as requested to reduce bloat
import GameSessionInvitation from './GameSessionInvitation';
import CursorTracker from './CursorTracker';
// Removed: Debug utils - not used in production
import gameStateManager from '../../services/gameStateManager';
import optimisticUpdatesService from '../../services/optimisticUpdatesService';

import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import usePresenceStore from '../../store/presenceStore';
import useAuthStore from '../../store/authStore';
import useDialogueStore from '../../store/dialogueStore';
import useCombatStore from '../../store/combatStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGridItemStore from '../../store/gridItemStore';
import useInventoryStore from '../../store/inventoryStore';
import useQuestStore from '../../store/questStore';
import useSettingsStore from '../../store/settingsStore';
import QuestShareDialog from '../quest-log/QuestShareDialog';
import QuestRewardDeliveryDialog from '../quest-log/QuestRewardDeliveryDialog';
import { showPlayerJoinNotification, showPlayerLeaveNotification, showGMDisconnectedNotification } from '../../utils/playerNotifications';
import { RoomProvider, useRoomContext } from '../../contexts/RoomContext';
import { getBackgroundData } from '../../data/backgroundData';
import { getCustomBackgroundData } from '../../data/customBackgroundData';
import { getEnhancedPathData } from '../../data/enhancedPathData';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import './styles/MultiplayerApp.css';

// Import main game components
import Grid from "../Grid";
import Navigation from "../Navigation";
import HUDContainer from "../hud/HUDContainer";
import GridItemsManager from "../grid/GridItemsManager";

import DynamicFogManager from "../level-editor/DynamicFogManager";
import DynamicLightingManager from "../level-editor/DynamicLightingManager";
import AtmosphericEffectsManager from "../level-editor/AtmosphericEffectsManager";
import MemorySnapshotManager from "../level-editor/MemorySnapshotManager";
import ActionBar from "../ui/ActionBar";
import CombatSelectionWindow from "../combat/CombatSelectionOverlay";
import CombatTimeline from "../combat/CombatTimeline";
import { FloatingCombatTextManager } from "../combat/FloatingCombatText";
import DialogueSystem from "../dialogue/DialogueSystem";
import DialogueControls from "../dialogue/DialogueControls";
import DiceRollingSystem from "../dice/DiceRollingSystem";

// Connection Status Indicator Component
const ConnectionStatusIndicator = ({ status, isJoiningRoom, playerCount }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: 'fas fa-wifi',
          color: '#4caf50',
          text: `Connected (${playerCount} players)`
        };
      case 'connecting':
        return {
          icon: 'fas fa-spinner fa-spin',
          color: '#ff9800',
          text: 'Connecting...'
        };
      case 'error':
        return {
          icon: 'fas fa-exclamation-triangle',
          color: '#f44336',
          text: 'Connection Error'
        };
      default:
        return {
          icon: 'fas fa-wifi-slash',
          color: '#9e9e9e',
          text: 'Disconnected'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="connection-status-indicator">
      <i className={statusInfo.icon} style={{ color: statusInfo.color }}></i>
      <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>
    </div>
  );
};

const MultiplayerApp = ({ onReturnToSinglePlayer }) => {
  // CRITICAL FIX: Get room code from URL params for room code routing
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [currentRoom, setCurrentRoom] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [isGM, setIsGM] = useState(false);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [actualPlayerCount, setActualPlayerCount] = useState(1); // Track actual player count from server
  const [pendingGameSessionInvitations, setPendingGameSessionInvitations] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected', 'error'
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState({ latency: 0, quality: 'good' }); // IMPROVEMENT: Track connection quality

  // PERFORMANCE OPTIMIZATION: Use selector functions to only subscribe to needed values
  // This prevents re-renders when unrelated store values change
  const { setGMMode, setMultiplayerState, isGMMode, isInMultiplayer, gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, zoomLevel, cursorUpdateThrottle } = useGameStore((state) => ({
    setGMMode: state.setGMMode,
    setMultiplayerState: state.setMultiplayerState,
    isGMMode: state.isGMMode,
    isInMultiplayer: state.isInMultiplayer,
    gridSize: state.gridSize,
    gridOffsetX: state.gridOffsetX,
    gridOffsetY: state.gridOffsetY,
    cameraX: state.cameraX,
    cameraY: state.cameraY,
    zoomLevel: state.zoomLevel,
    cursorUpdateThrottle: state.cursorUpdateThrottle || 50
  }));

  // Settings state
  const showCursorTracking = useSettingsStore(state => state.showCursorTracking);
  const { updateCharacterInfo, setRoomName, getActiveCharacter, loadActiveCharacter, startCharacterSession, endCharacterSession } = useCharacterStore((state) => ({
    updateCharacterInfo: state.updateCharacterInfo,
    setRoomName: state.setRoomName,
    getActiveCharacter: state.getActiveCharacter,
    loadActiveCharacter: state.loadActiveCharacter,
    startCharacterSession: state.startCharacterSession,
    endCharacterSession: state.endCharacterSession
  }));
  const { addPartyMember, removePartyMember, createParty, updatePartyMember } = usePartyStore((state) => ({
    addPartyMember: state.addPartyMember,
    removePartyMember: state.removePartyMember,
    createParty: state.createParty,
    updatePartyMember: state.updatePartyMember
  }));
  const { addUser, removeUser, updateUser, addNotification, setMultiplayerIntegration, clearMultiplayerIntegration } = useChatStore((state) => ({
    addUser: state.addUser,
    removeUser: state.removeUser,
    updateUser: state.updateUser,
    addNotification: state.addNotification,
    setMultiplayerIntegration: state.setMultiplayerIntegration,
    clearMultiplayerIntegration: state.clearMultiplayerIntegration
  }));
  const { updateTokenPosition: updateCreatureTokenPosition, addCreature, addToken, removeToken, clearCreatureTokens } = useCreatureStore((state) => ({
    updateTokenPosition: state.updateTokenPosition,
    addCreature: state.addCreature,
    addToken: state.addToken,
    removeToken: state.removeToken,
    clearCreatureTokens: state.clearCreatureTokens
  }));
  const { updateCharacterTokenPosition, addCharacterTokenFromServer, removeCharacterToken, clearCharacterTokens } = useCharacterTokenStore((state) => ({
    updateCharacterTokenPosition: state?.updateCharacterTokenPosition || (() => console.warn('updateCharacterTokenPosition not available')),
    addCharacterTokenFromServer: state?.addCharacterTokenFromServer || (() => console.warn('addCharacterTokenFromServer not available')),
    removeCharacterToken: state?.removeCharacterToken || (() => console.warn('removeCharacterToken not available')),
    clearCharacterTokens: state?.clearCharacterTokens || (() => console.warn('clearCharacterTokens not available'))
  }));
  const { setMultiplayerSocket } = useDialogueStore((state) => ({
    setMultiplayerSocket: state.setMultiplayerSocket
  }));
  const { nextTurn, startCombat, getCombatState } = useCombatStore((state) => ({
    nextTurn: state.nextTurn,
    startCombat: state.startCombat,
    getCombatState: state.getCombatState
  }));

  // Remove enhanced multiplayer - causes conflicts with main system

  // Smart throttling based on role - optimized for performance
  const tokenUpdateThrottleRef = useRef(new Map());
  const PLAYER_THROTTLE_MS = 50; // 20fps for players (reduced from 60fps to prevent performance issues)
  const GM_THROTTLE_MS = 66; // 15fps for GMs (reduced from 30fps to prevent performance issues)

  // Cursor tracking
  const cursorThrottleRef = useRef(0);

  const THROTTLE_CLEANUP_INTERVAL = 15000; // Clean up throttle map every 15 seconds
  const THROTTLE_ENTRY_LIFETIME = 30000; // Remove entries older than 30 seconds

  // Removed: Unused drag state tracking

  // Performance optimization: Batch updates to prevent lag spikes
  const updateBatchRef = useRef([]);
  const batchTimeoutRef = useRef(null);

  // Handle game session invitation responses
  const handleAcceptGameSession = (invitation) => {
    if (socket && socket.connected) {
      socket.emit('respond_to_game_session', { accepted: true });
    }
    setPendingGameSessionInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
  };

  const handleDeclineGameSession = (invitation) => {
    if (socket && socket.connected) {
      socket.emit('respond_to_game_session', { accepted: false });
    }
    setPendingGameSessionInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
  };

  // Unified store cleanup for joining/creating rooms
  const clearAllMultiplayerStores = useCallback(() => {
    console.log('🧹 Clearing all stores for clean room initialization');

    // Level editor
    const levelEditorStore = useLevelEditorStore.getState();
    if (levelEditorStore.resetStore) levelEditorStore.resetStore();

    // Creatures and Character Tokens
    useCreatureStore.getState().clearCreatureTokens();
    useCharacterTokenStore.getState().clearCharacterTokens();

    // Combat
    useCombatStore.getState().forceResetCombat();

    // Chat and Presence
    const chatStore = useChatStore.getState();
    if (chatStore.resetStore) chatStore.resetStore();

    usePresenceStore.getState().cleanup();

    // Party
    const partyStore = usePartyStore.getState();
    if (partyStore.resetStore) partyStore.resetStore();

    // Grid Items
    useGridItemStore.getState().clearGrid();

    // Inventory (clear to prevent guest users seeing old data)
    useInventoryStore.getState().clearInventory();

    // Game State
    const gameStore = useGameStore.getState();
    if (gameStore.resetStore) gameStore.resetStore();

    console.log('✅ All stores cleared');
  }, []);

  // Refs for values used in socket event handlers to prevent dependency issues
  const currentRoomRef = useRef(currentRoom);
  const currentPlayerRef = useRef(currentPlayer);
  const isGMRef = useRef(isGM);
  const roomPasswordRef = useRef('');
  const addPartyMemberRef = useRef(addPartyMember);
  const removePartyMemberRef = useRef(removePartyMember);
  const addUserRef = useRef(addUser);
  const removeUserRef = useRef(removeUser);
  const addNotificationRef = useRef(addNotification);

  // Initialize global drag state tracker for cross-component communication
  useEffect(() => {
    if (!window.multiplayerDragState) {
      window.multiplayerDragState = new Map();
    }
  }, []);

  // Update refs when values change to prevent socket event handler recreation
  useEffect(() => {
    currentRoomRef.current = currentRoom;
    currentPlayerRef.current = currentPlayer;
    isGMRef.current = isGM;
  }, [currentRoom, currentPlayer, isGM]);

  // Track viewport changes for selective sync optimization
  useEffect(() => {
    if (socket && currentPlayer && currentRoom) {
      const viewportData = {
        cameraX: cameraX,
        cameraY: cameraY,
        zoomLevel: zoomLevel,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };

      // Throttle viewport updates to prevent spam
      const updateViewport = () => {
        socket.emit('update_viewport', viewportData);
      };

      // Debounce viewport updates
      const timeoutId = setTimeout(updateViewport, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [socket, currentPlayer, currentRoom, cameraX, cameraY, zoomLevel]);

  // Placeholder for old cursor related effects that have been consolidated

  useEffect(() => {
    addPartyMemberRef.current = addPartyMember;
  }, [addPartyMember]);

  useEffect(() => {
    removePartyMemberRef.current = removePartyMember;
  }, [removePartyMember]);

  useEffect(() => {
    addUserRef.current = addUser;
  }, [addUser]);

  useEffect(() => {
    removeUserRef.current = removeUser;
  }, [removeUser]);

  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  // Cleanup function for throttling maps to prevent memory buildup
  const cleanupThrottleMaps = useCallback(() => {
    const now = Date.now();
    const throttleMap = tokenUpdateThrottleRef.current;

    // Remove old entries to prevent memory buildup
    for (const [key, timestamp] of throttleMap.entries()) {
      if (now - timestamp > THROTTLE_ENTRY_LIFETIME) {
        throttleMap.delete(key);
      }
    }

    // Log cleanup if map was getting large
    if (throttleMap.size > 50) {
      // Throttle map cleaned up
    }
  }, []);

  // Periodic cleanup of throttling maps to prevent memory buildup
  useEffect(() => {
    const cleanupInterval = setInterval(cleanupThrottleMaps, THROTTLE_CLEANUP_INTERVAL);

    return () => {
      clearInterval(cleanupInterval);
      // Clear batch timeout on cleanup
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
        batchTimeoutRef.current = null;
      }
      // Clear pending batch updates
      updateBatchRef.current = [];
    };
  }, [cleanupThrottleMaps]);

  // Socket server URL - adjust based on environment (memoized to prevent recreation)
  const SOCKET_URL = useMemo(() => {
    return process.env.REACT_APP_SOCKET_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://descension-mythrill.up.railway.app' // Your Railway URL
        : 'http://localhost:3002');
  }, []); // Empty dependency array since environment variables don't change

  // Environment check logs removed for performance

  // Initialize socket connection when component mounts
  useEffect(() => {
    let newSocket = null;

    const initializeSocket = async () => {
      // Get Firebase auth token if user is authenticated (not development bypass and not guest)
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

      // CRITICAL: Expose socket globally for HUD components that need direct access
      window.multiplayerSocket = newSocket;

      // Removed enhanced multiplayer system - was causing conflicts

      // Enhanced connection event listeners with status feedback
      newSocket.on('connect', () => {
        setIsConnecting(false);
        // Don't set to 'connected' here - wait for room join to complete
        // setConnectionStatus('connected');

        // AUTO-REJOIN: If we have room data and were already connected, re-join automatically
        // This is CRITICAL for handling temporary socket disconnections (e.g. tab sleep, network swap)
        if (currentRoomRef.current) {
          const roomData = currentRoomRef.current;
          console.log('🔄 Socket connected, auto-rejoining room:', roomData.id);

          newSocket.emit('join_room', {
            roomId: roomData.persistentRoomId || roomData.id,
            playerName: currentPlayerRef.current?.name || 'Reconnecting...',
            password: roomPasswordRef.current || '',
            isReconnect: true
          });

          // Clear tokens when reconnecting/switching rooms
          clearCreatureTokens();
          clearCharacterTokens();
          console.log('🧹 Cleared tokens for room rejoin');
        }

        // Show connection success notification
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

        // Show disconnection notification with reason
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
        console.error('Socket error in MultiplayerApp:', error);
        setIsConnecting(false);

        // Only show error notification for critical errors, not minor ones
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
        // Show connection error to user
        addNotificationRef.current('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: 'Failed to connect to server. Please check your connection.',
          type: 'system',
          timestamp: new Date().toISOString()
        });
      });

      setSocket(newSocket);
      setIsConnecting(true);

      // Sync socket to presenceStore for global chat and invites
      try {
        import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
          usePresenceStore.getState().setSocket(newSocket);
        });
      } catch (e) {
        console.warn('Could not sync socket to presenceStore:', e);
      }

      newSocket.connect();
    };

    // Initialize the socket
    initializeSocket();

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.emit('leave_room');
        newSocket.disconnect();
      }

      // Performance optimizer removed - was causing conflicts
    };
  }, [SOCKET_URL]);

  // Cursor tracking - emit cursor position to other players

  useEffect(() => {
    if (!socket || !socket.connected) return;
    if (!showCursorTracking) return;

    let lastEmitTime = 0;
    const THROTTLE_MS = 60; // Emit at most ~16 times per second

    const handleMouseMove = (event) => {
      const now = Date.now();
      if (now - lastEmitTime < THROTTLE_MS) return;

      lastEmitTime = now;

      // Emit cursor position to server
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
        } catch (e) {
          // Fallback if grid system not initialized
        }

        const gameStoreState = useGameStore.getState();
        const partyStoreState = usePartyStore.getState();
        const currentPlayer = partyStoreState.partyMembers.find(m => m.id === 'current-player');
        const playerColor = currentPlayer?.character?.tokenSettings?.color || (gameStoreState.isGMMode ? '#d4af37' : '#4a90e2');

        socket.emit('cursor_move', {
          worldX: worldPos.x,
          worldY: worldPos.y,
          playerId: currentPlayerRef.current?.id || 'unknown',
          playerName: currentPlayerRef.current?.name || (gameStoreState.isGMMode ? 'Game Master' : 'Unknown'),
          playerColor: playerColor
        });
      }
    };

    // Add listener to document
    document.addEventListener('mousemove', handleMouseMove);
    console.log('🖱️ Cursor tracking enabled - emitting cursor positions');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      console.log('🖱️ Cursor tracking disabled');
    };
  }, [socket, showCursorTracking]);


  // Handle authentication changes - reconnect socket with fresh token
  useEffect(() => {
    const authStore = require('../../store/authStore').default;

    const handleAuthChange = async () => {
      if (!socket) return;

      try {
        const authState = authStore.getState();

        // Disconnect current socket if connected
        if (socket.connected) {
          socket.disconnect();
        }

        // Get fresh auth token (only for authenticated users, not guests)
        let authToken = null;
        if (authState.user && !authState.isDevelopmentBypass && !authState.user.isGuest && authState.user.getIdToken) {
          authToken = await authState.user.getIdToken(true); // Force refresh
        }

        // Update socket auth
        socket.auth = { token: authToken };

        // Reconnect - allow both authenticated users and guests
        if (authState.isAuthenticated || authState.user?.isGuest) {
          socket.connect();
        }
      } catch (error) {
        console.warn('Could not refresh socket auth token:', error);
      }
    };

    // Subscribe to auth store changes
    const unsubscribe = authStore.subscribe(handleAuthChange);

    return unsubscribe;
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    // IMPROVEMENT: Monitor socket connection status with quality tracking
    socket.on('connect', () => {
      // Don't set connection status here - wait for room join to complete
      // setConnectionStatus('connected');
      setIsConnecting(false);

      // IMPROVEMENT: Measure latency on connect using existing ping/pong pattern
      const startTime = Date.now();
      socket.emit('ping');
      socket.once('pong', () => {
        const latency = Date.now() - startTime;
        const quality = latency < 100 ? 'excellent' : latency < 200 ? 'good' : latency < 500 ? 'fair' : 'poor';
        setConnectionQuality({ latency, quality });

        // Log connection quality
        if (quality === 'poor') {
          console.warn(`⚠️ High latency detected: ${latency}ms`);
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `Connection quality is poor (${latency}ms latency). Gameplay may be affected.`,
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }
      });

      // IMPROVEMENT: Periodic latency checks
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
      }, 30000); // Check every 30 seconds

      // Store interval for cleanup
      socket._latencyCheckInterval = latencyCheckInterval;
    });

    socket.on('disconnect', (reason) => {
      // If disconnect was not intentional, show it as an error
      setConnectionStatus(reason === 'io client disconnect' ? 'disconnected' : 'error');
      setConnectionQuality({ latency: 0, quality: 'disconnected' });

      // IMPROVEMENT: Clear latency check interval
      if (socket._latencyCheckInterval) {
        clearInterval(socket._latencyCheckInterval);
        delete socket._latencyCheckInterval;
      }

      // IMPROVEMENT: Provide user feedback based on disconnect reason
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

    // Listen for player join/leave events
    socket.on('player_joined', (data) => {
      // Update actual player count from server - Always add 1 for the GM
      // The server typically counts only non-GM players in the players list
      setActualPlayerCount(data.playerCount);

      // Update connected players list - don't require currentRoom to be set yet
      setConnectedPlayers(prev => {
        // Check if player already exists to avoid duplicates
        const existingPlayer = prev.find(p => p.id === data.player.id);
        if (existingPlayer) {
          return prev;
        }

        // Don't add current player to connected players list (they're handled separately)
        if (currentPlayerRef.current && data.player.id === currentPlayerRef.current.id) {
          return prev;
        }

        const updated = [...prev, data.player];
        return updated;
      });

      // Show player join notification (only if currentRoom is set)
      if (currentRoomRef.current) {
        showPlayerJoinNotification(data.player.name, currentRoomRef.current.name);
      }


      // Use character name if available, otherwise fall back to player name
      const playerCharacterName = data.player.character?.name || data.player.name;

      // Skip adding ourselves to prevent duplicate HUDs - check both ID and name
      const isCurrentPlayer = data.player.id === currentPlayerRef.current?.id ||
        playerCharacterName === currentPlayerRef.current?.name ||
        data.player.name === currentPlayerRef.current?.name;

      if (!isCurrentPlayer) {

        // Calculate proper race display name from race and subrace data
        let raceDisplayName = data.player.character?.raceDisplayName || 'Unknown';

        console.log('🆔 player_joined - Adding party member with:', {
          playerId: data.player.id,
          playerName: playerCharacterName,
          serverPlayerName: data.player.name
        });

        // Add to party system with character data first
        // CRITICAL FIX: Ensure isGM is explicitly false for joining players (only room creator is GM)
        const newPartyMember = {
          id: data.player.id,
          socketId: data.player.id, // CRITICAL: Store socketId for character_updated lookups
          name: playerCharacterName,
          isGM: false, // Joining players are never GM - only room creator is GM
          character: {
            class: data.player.character?.class || 'Unknown',
            level: data.player.character?.level || 1,
            // CRITICAL FIX: Use defaults that match characterStore (HP 50, Mana 50, AP 3)
            health: data.player.character?.health || { current: 45, max: 50 },
            mana: data.player.character?.mana || { current: 45, max: 50 },
            actionPoints: data.player.character?.actionPoints || { current: 1, max: 3 },
            race: data.player.character?.race || 'Unknown',
            subrace: data.player.character?.subrace || '',
            raceDisplayName: raceDisplayName,
            classResource: data.player.character?.classResource || { current: 0, max: 0 }, // Include class resource
            tokenSettings: data.player.character?.tokenSettings || {}, // Include token settings
            lore: data.player.character?.lore || {} // Include lore (which contains characterImage)
          }
        };

        // Add party member
        addPartyMember(newPartyMember);

        // Then update with proper race display name if needed
        if (data.player.character?.race && data.player.character?.subrace) {
          import('../../data/raceData').then(({ getFullRaceData }) => {
            const raceData = getFullRaceData(data.player.character.race, data.player.character.subrace);
            if (raceData) {
              const updatedRaceDisplayName = raceData.subrace.name;
              // Update the party member with the correct race display name
              updatePartyMember(data.player.id, {
                character: {
                  ...newPartyMember.character,
                  raceDisplayName: updatedRaceDisplayName
                }
              });
            }
          }).catch(error => {
            console.warn('Failed to calculate race display name for new player:', error);
          });
        } else if (data.player.character?.race) {
          import('../../data/raceData').then(({ getRaceData }) => {
            const raceData = getRaceData(data.player.character.race);
            if (raceData) {
              const updatedRaceDisplayName = raceData.name;
              // Update the party member with the correct race display name
              updatePartyMember(data.player.id, {
                character: {
                  ...newPartyMember.character,
                  raceDisplayName: updatedRaceDisplayName
                }
              });
            }
          }).catch(error => {
            console.warn('Failed to get race data for new player:', error);
          });
        }

        // Broadcast party member addition to other players
        if (socket && socket.connected) {
          socket.emit('party_member_added', {
            member: newPartyMember
          });
        }
      }

      // ===== GM: BROADCAST LEVEL EDITOR STATE TO NEW PLAYER =====
      // When a player joins, GM should send current level editor state so they see terrain, hex grid, walls, etc.
      if (isGMRef.current && socket && socket.connected) {
        console.log('🗺️ GM broadcasting level editor state to new player:', data.player.name);

        try {
          const levelEditorStore = useLevelEditorStore.getState();
          const gameStore = useGameStore.getState();

          socket.emit('sync_level_editor_state', {
            levelEditor: {
              terrainData: levelEditorStore.terrainData || {},
              wallData: levelEditorStore.wallData || {},
              environmentalObjects: levelEditorStore.environmentalObjects || [],
              drawingPaths: levelEditorStore.drawingPaths || [],
              drawingLayers: levelEditorStore.drawingLayers || [],
              fogOfWarData: levelEditorStore.fogOfWarData || {},
              exploredAreas: levelEditorStore.exploredAreas || {},
              lightSources: levelEditorStore.lightSources || {},
              dynamicFogEnabled: levelEditorStore.dynamicFogEnabled,
              respectLineOfSight: levelEditorStore.respectLineOfSight,
              dndElements: levelEditorStore.dndElements || []
            },
            gridSettings: {
              gridType: gameStore.gridType || 'square',
              gridSize: gameStore.gridSize || 50,
              gridOffsetX: gameStore.gridOffsetX || 0,
              gridOffsetY: gameStore.gridOffsetY || 0,
              gridLineColor: gameStore.gridLineColor || 'rgba(255, 255, 255, 0.8)',
              gridLineThickness: gameStore.gridLineThickness || 2,
              gridLineOpacity: gameStore.gridLineOpacity || 0.8,
              gridBackgroundColor: gameStore.gridBackgroundColor || '#d4c5b9'
            },
            gameplaySettings: {
              feetPerTile: gameStore.feetPerTile || 5,
              showMovementVisualization: gameStore.showMovementVisualization,
              movementLineColor: gameStore.movementLineColor || '#FFD700',
              movementLineWidth: gameStore.movementLineWidth || 3,
              defaultViewFromToken: gameStore.defaultViewFromToken
            }
          });
        } catch (error) {
          console.error('Failed to broadcast level editor state:', error);
        }
      }

      // Add to chat system
      addUser({
        id: data.player.id,
        name: playerCharacterName,
        class: data.player.character?.class || 'Unknown',
        level: data.player.character?.level || 1,
        status: 'online'
      });

      // Add chat notification about player joining
      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `${data.player.name} joined the room`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    // Listen for player count updates
    socket.on('player_count_updated', (data) => {
      // Update the actual player count from server - Always add 1 for the GM
      setActualPlayerCount(data.playerCount);
    });

    // Listen for creature token creation
    socket.on('token_created', (data) => {
      if (data && data.position) {
        // (creature, position, sendToServer, forcedTokenId, isSyncEvent)
        addToken(
          data.creature || data.token?.creatureId,
          data.position,
          false, // Don't send back to server
          data.tokenId || data.token?.id,
          true // isSyncEvent
        );
      }
    });

    // Listen for character token creation
    socket.on('character_token_created', (data) => {
      if (data && data.position) {
        addCharacterTokenFromServer(data.tokenId, data.position, data.playerId);
      }
    });

    // NOTE: token_moved listener is defined later with more robust throttling and batching

    // NOTE: character_moved listener is consolidated further down with throttling and robust ID handling

    // Listen for party member additions from other clients
    socket.on('party_member_added', (data) => {
      // Get current character name for comparison
      const activeCharacter = getActiveCharacter();
      const currentCharacterName = activeCharacter?.name || currentPlayerRef.current?.name;

      // Add the party member to our local party store
      // Skip if this is our own data being broadcast back to us (check both player name and character name)
      const isOwnMember = data.member && (
        data.member.name === currentPlayerRef.current?.name ||
        data.member.name === currentCharacterName ||
        data.member.id === currentPlayerRef.current?.id ||
        data.member.id === 'current-player'
      );

      if (data.member && !isOwnMember) {
        addPartyMember(data.member);
      }
    });

    // Listen for token removal
    socket.on('token_removed', (data) => {
      if (data && data.tokenId) {
        removeToken(data.tokenId, false); // false = don't send back to server
      }
    });

    // Listen for character token removal
    socket.on('character_token_removed', (data) => {
      if (data && data.tokenId) {
        removeCharacterToken(data.tokenId, false); // false = don't send back to server
      }
    });

    // Clean up tokens when joining a new room
    // This listener handles the 'room_joined' confirmation or room state sync
    socket.on('room_state_sync', () => {
      // Optional: Could clear tokens here if the server sends a full state sync event
      // typically join_room response handles initial load, but clearing old state is good practice
      console.log('🧹 Clearing tokens for new room synchronization');
      clearCreatureTokens();
      clearCharacterTokens();
    });

    // Listen for character resource updates from other players
    socket.on('character_resource_updated', (data) => {
      const { playerId, playerName, resource, current, max, temp, adjustment } = data;

      // Multiple ways to identify current player for robust matching
      const currentPlayerId = currentPlayerRef.current?.id;
      const currentPlayerName = currentPlayerRef.current?.name;

      // Check if this update is for the current player (GM updating us)
      // Match by: exact ID, 'current-player' literal, or player name fallback
      const isCurrentPlayer =
        playerId === currentPlayerId ||
        playerId === 'current-player' ||
        (playerName && playerName === currentPlayerName);

      console.log('🔍 character_resource_updated check:', {
        receivedPlayerId: playerId,
        receivedPlayerName: playerName,
        currentPlayerId,
        currentPlayerName,
        isCurrentPlayer,
        resource,
        current,
        max
      });

      if (isCurrentPlayer) {
        // Update current player's character store directly
        const charStore = require('../../store/characterStore').default;
        charStore.getState().updateResource(resource, current, max);

        // Also update temporary resources if provided
        if (temp !== undefined) {
          charStore.getState().updateTempResource(resource, temp);
        }

        // Show synchronized floating combat text for current player
        if (window.showFloatingCombatText && adjustment && adjustment !== 0) {
          const playerFrame = document.querySelector('.player-status-frame') || document.querySelector('.player-hud');
          const rect = playerFrame ? playerFrame.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight - 150 };

          let textType = 'damage';
          if (adjustment > 0) {
            textType = resource === 'health' ? 'heal' : resource === 'mana' ? 'mana' : 'ap';
          } else {
            textType = resource === 'health' ? 'damage' : resource === 'mana' ? 'mana-loss' : 'ap-loss';
          }

          window.showFloatingCombatText(
            Math.abs(adjustment),
            textType,
            { x: rect.left + (playerFrame ? 100 : 0), y: rect.top + (playerFrame ? 20 : 0) }
          );
        }

        console.log(`💊 GM updated my ${resource}: ${current}/${max}${temp !== undefined ? ` (Temp: ${temp})` : ''}`);
      } else {
        // Update the party member's resource
        const memberUpdate = {
          character: {
            [resource]: { current, max }
          }
        };

        // Also update temporary resources if provided
        if (temp !== undefined) {
          const tempFieldMap = {
            'health': 'tempHealth',
            'mana': 'tempMana',
            'actionPoints': 'tempActionPoints'
          };
          const tempField = tempFieldMap[resource];
          if (tempField) {
            memberUpdate.character[tempField] = temp;
          }
        }

        updatePartyMember(playerId, memberUpdate);

        // Show synchronized floating combat text for party member
        if (window.showFloatingCombatText && adjustment && adjustment !== 0) {
          const frame = document.querySelector(`.party-frame-${playerId}`);
          if (frame) {
            const rect = frame.getBoundingClientRect();

            let textType = 'damage';
            if (adjustment > 0) {
              textType = resource === 'health' ? 'heal' : resource === 'mana' ? 'mana' : 'ap';
            } else {
              textType = resource === 'health' ? 'damage' : resource === 'mana' ? 'mana-loss' : 'ap-loss';
            }

            window.showFloatingCombatText(
              Math.abs(adjustment),
              textType,
              { x: rect.left + 50, y: rect.top + 30 }
            );
          }
        }

        console.log(`💊 Updated ${data.playerName || playerId}'s ${resource}: ${current}/${max}${temp !== undefined ? ` (Temp: ${temp})` : ''}`);
      }
    });

    // Listen for GM actions (XP awards, rests, etc.)
    socket.on('gm_action', (data) => {
      const { type, amount } = data;

      console.log('🎮 Received GM action:', type, data);

      switch (type) {
        case 'award_xp':
          // Award XP to local character
          import('../../store/characterStore').then(({ default: useCharacterStore }) => {
            const charStore = useCharacterStore.getState();
            charStore.awardExperience(amount);

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has awarded you ${amount} XP.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
          });
          break;

        case 'adjust_level':
          // Adjust level of local character
          import('../../store/characterStore').then(({ default: useCharacterStore }) => {
            const charStore = useCharacterStore.getState();
            charStore.adjustLevel(amount);

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has ${amount > 0 ? 'increased' : 'decreased'} your level by ${Math.abs(amount)}.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
          });
          break;

        case 'short_rest':
          // Apply short rest locally
          import('../../store/gameStore').then(({ default: useGameStore }) => {
            useGameStore.getState().takeShortRest();

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has triggered a Short Rest for you.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
            console.log('😴 Short rest triggered by GM');
          }).catch(error => {
            console.error('Failed to trigger short rest:', error);
          });
          break;

        case 'long_rest':
          // Apply long rest locally
          import('../../store/gameStore').then(({ default: useGameStore }) => {
            useGameStore.getState().takeLongRest();

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has triggered a Long Rest for you.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
            console.log('😴 Long rest triggered by GM');
          }).catch(error => {
            console.error('Failed to trigger long rest:', error);
          });
          break;

        default:
          console.warn('Unknown GM action type:', type);
      }
    });

    // Listen for gameplay settings synchronization from GM
    socket.on('sync_gameplay_settings', (data) => {
      console.log('⚙️ Received synchronized gameplay settings from GM:', data);

      Promise.all([
        import('../../store/settingsStore'),
        import('../../store/gameStore'),
        import('../../store/levelEditorStore'),
        import('../../store/characterTokenStore')
      ]).then(([{ default: useSettingsStore }, { default: useGameStore }, { default: useLevelEditorStore }, { default: useCharacterTokenStore }]) => {
        const settingsStore = useSettingsStore.getState();
        const gameStore = useGameStore.getState();
        const levelEditorStore = useLevelEditorStore.getState();
        const characterTokenStore = useCharacterTokenStore.getState();

        // Update settings in both stores to ensure consistency
        if (data.feetPerTile !== undefined) {
          settingsStore.setFeetPerTile(data.feetPerTile);
          gameStore.setFeetPerTile(data.feetPerTile);
          console.log(`📏 Synced Grid Scale: ${data.feetPerTile} ft`);
        }

        if (data.showMovementVisualization !== undefined) {
          settingsStore.setShowMovementVisualization(data.showMovementVisualization);
          gameStore.setShowMovementVisualization(data.showMovementVisualization);
          console.log(`✨ Synced Movement Visualization: ${data.showMovementVisualization}`);
        }

        if (data.movementLineColor !== undefined) {
          settingsStore.setMovementLineColor(data.movementLineColor);
          gameStore.setMovementLineColor(data.movementLineColor);
        }

        if (data.movementLineWidth !== undefined) {
          settingsStore.setMovementLineWidth(data.movementLineWidth);
          gameStore.setMovementLineWidth(data.movementLineWidth);
        }

        // Update grid settings if provided (real-time sync)
        if (data.gridSize !== undefined) gameStore.setGridSize(data.gridSize);
        if (data.gridLineColor !== undefined) gameStore.setGridLineColor(data.gridLineColor);
        if (data.gridLineThickness !== undefined) gameStore.setGridLineThickness(data.gridLineThickness);
        if (data.gridLineOpacity !== undefined) gameStore.setGridLineOpacity(data.gridLineOpacity);
        if (data.gridBackgroundColor !== undefined) gameStore.setGridBackgroundColor(data.gridBackgroundColor);
        if (data.showGrid !== undefined) gameStore.setShowGrid(data.showGrid);

        if (data.defaultViewFromToken !== undefined) {
          settingsStore.setDefaultViewFromToken(data.defaultViewFromToken);
          gameStore.setDefaultViewFromToken(data.defaultViewFromToken);
          console.log(`👁️ Synced Default View From Token: ${data.defaultViewFromToken}`);

          // If GM forced View from Token, and we're a player, find our token and snap view to it
          if (data.defaultViewFromToken && !gameStore.isGMMode) {
            // Wait a moment for store to settle if needed, or use refreshed getPlayerToken
            const playerToken = characterTokenStore.getPlayerToken();
            if (playerToken) {
              console.log('🛡️ GM forced View from Token. Snapping player view to token:', playerToken.id);
              levelEditorStore.playerViewFromTokenDisabled = false;
              levelEditorStore.setViewingFromToken({
                id: playerToken.id,
                type: 'character',
                characterId: playerToken.playerId || 'local_player',
                position: playerToken.position
              });
            } else {
              console.warn('⚠️ GM forced View from Token but no player token found to snap to');
            }
          }
        }


        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Game Master updated tactical settings for the session.`,
          isSystem: true,
          timestamp: new Date().toISOString()
        });
      }).catch(error => {
        console.error('Failed to sync gameplay settings:', error);
      });
    });

    // Listen for combat start from GM
    socket.on('combat_started', (data) => {
      console.log('⚔️ Received combat_started from server:', data);

      // Update combat store with received state
      useCombatStore.getState().forceResetCombat(); // Clear any existing state

      // Set the combat state
      useCombatStore.setState({
        isInCombat: true,
        turnOrder: data.turnOrder || [],
        round: data.round || 1,
        currentTurnIndex: data.currentTurnIndex || 0,
        isSelectionMode: false,
        selectedTokens: new Set()
      });

      console.log('⚔️ Combat state synced - player should now see combat timeline');
    });

    // Listen for combat end from GM
    socket.on('combat_ended', (data) => {
      console.log('🏳️ Received combat_ended from server:', data);

      // Reset combat store
      useCombatStore.getState().forceResetCombat();

      console.log('🏳️ Combat ended - timeline hidden');
    });

    // Listen for combat turn changes from GM
    socket.on('combat_turn_changed', (data) => {
      console.log('⚔️ Received combat_turn_changed from server:', data);

      const combatState = useCombatStore.getState();
      if (combatState.isInCombat) {
        // Update combat store with new turn state
        useCombatStore.setState({
          currentTurnIndex: data.currentTurnIndex,
          round: data.round,
          turnOrder: data.turnOrder
        });
        console.log(`⚔️ Combat turn synced - now on turn ${data.currentTurnIndex + 1}, round ${data.round}`);
      }
    });

    socket.on('player_left', (data) => {
      // CRITICAL FIX: Check if the leaving player is the current player
      // If so, navigate to landing page (they were disconnected)
      if (data.player.id === currentPlayerRef.current?.id) {
        handleLeaveRoom();
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 200);
        return;
      }

      // Update actual player count from server - Always add 1 for the GM
      setActualPlayerCount(data.playerCount);

      setConnectedPlayers(prev => {
        const updated = prev.filter(player => player.id !== data.player.id);
        return updated;
      });

      // Show player leave notification
      showPlayerLeaveNotification(data.player.name, currentRoomRef.current?.name || 'Room');

      // Remove from party system (ensure it's removed)
      try {
        removePartyMember(data.player.id);
        // Also remove from party store directly if needed
        import('../../store/partyStore').then(({ default: usePartyStore }) => {
          const { removePartyMember: removeFromStore } = usePartyStore.getState();
          removeFromStore(data.player.id);
        }).catch(() => {
          // Ignore if party store not available
        });
      } catch (error) {
        console.error('Error removing party member:', error);
      }

      // Remove from chat system
      removeUser(data.player.id);

      // Add chat notification about player leaving
      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `${data.player.name} left the room`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    socket.on('room_closed', (data) => {
      // CRITICAL FIX: Properly handle room closure with navigation
      handleLeaveRoom();

      // Navigate to landing page after cleanup
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 200);
    });

    socket.on('gm_disconnected', (data) => {
      // For players, we should notify and return to landing page
      if (!isGMRef.current) {
        // Show specialized GM disconnect notification
        showGMDisconnectedNotification(data.gmName || 'Unknown');

        // Add to chat notification system as well
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Game Master ${data.gmName || 'Unknown'} has disconnected. Returning to landing page...`,
          type: 'system',
          timestamp: new Date().toISOString()
        });

        // Use handleLeaveRoom to clean up state
        handleLeaveRoom();

        // Navigate back to starter page (landing page) after a short delay to allow reading the notification
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      }
    });

    // Handle being kicked/removed from room
    socket.on('player_kicked', (data) => {
      // CRITICAL FIX: Properly handle player kick with navigation
      handleLeaveRoom();

      // Navigate to landing page after cleanup
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 200);
    });

    // Handle room access revoked
    socket.on('access_revoked', (data) => {
      // CRITICAL FIX: Properly handle access revocation with navigation
      handleLeaveRoom();

      // Navigate to landing page after cleanup
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 200);
    });

    // Listen for quest shared by GM
    socket.on('quest_shared', (data) => {
      const { quest, sharedBy } = data;

      // Import quest store and add the quest
      import('../../store/questStore').then(({ default: useQuestStore }) => {
        const { addQuest } = useQuestStore.getState();

        // Create a new quest instance for the player (with unique ID)
        const playerQuest = {
          ...quest,
          id: `shared-${quest.id}-${Date.now()}`,
          status: 'active',
          dateReceived: new Date().toISOString(),
          sharedBy: sharedBy
        };

        addQuest(playerQuest);

        // Add notification to party chat
        import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
          const { addPartyChatMessage } = usePresenceStore.getState();
          addPartyChatMessage({
            id: `quest_shared_${Date.now()}`,
            senderId: 'system',
            senderName: 'Game Master',
            content: `${sharedBy} shared a quest: ${quest.title}`,
            timestamp: new Date().toISOString(),
            type: 'system'
          });
        });

        // Show notification
        addNotification('social', {
          sender: {
            name: 'System',
            class: 'System',
            level: 1
          },
          content: `You received a new quest: ${quest.title}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }).catch(error => {
        console.error('Failed to add shared quest:', error);
      });
    });

    // Listen for chat messages (Party Chat)
    socket.on('chat_message', (message) => {
      console.log('💬 Received party chat message:', message);

      // Add to notifications
      addNotification('social', {
        sender: {
          name: message.playerName,
          class: message.isGM ? 'GM' : 'Player',
          level: 1,
          playerColor: message.playerColor || (message.isGM ? '#d4af37' : '#4a90e2')
        },
        content: message.content,
        type: 'message',
        timestamp: message.timestamp,
        playerId: message.playerId,
        isGM: message.isGM
      });

      // Add to presence store party chat
      if (message.type === 'party' || message.type === 'chat') {
        const timestamp = message.timestamp || new Date().toISOString();
        usePresenceStore.getState().addPartyChatMessage({
          id: message.id || `msg_${Date.now()}`,
          senderId: message.playerId,
          senderName: message.playerName,
          senderClass: message.isGM ? 'GM' : 'Player',
          senderLevel: 1,
          content: message.content,
          timestamp: timestamp,
          type: 'party'
        });
        console.log('✅ Party message added to presence store');
      }
    });

    // Listen for global chat messages to sync with presence store
    socket.on('global_chat_message', (message) => {
      console.log('📨 Client received global_chat_message:', message);
      try {
        usePresenceStore.getState().addGlobalMessage(message);
        console.log('✅ Global message added to store');
      } catch (error) {
        console.error('❌ Failed to add global chat message:', error);
      }
    });

    // ========== CRITICAL: Level Editor State Synchronization ==========
    // Listen for level editor state sync from GM
    socket.on('level_editor_state_sync', (data) => {
      console.log('🗺️ Received level_editor_state_sync:', {
        hasLevelEditor: !!data.levelEditor,
        hasGridSettings: !!data.gridSettings
      });

      try {
        // Apply level editor state
        if (data.levelEditor) {
          const levelEditorStore = useLevelEditorStore.getState();

          if (data.levelEditor.terrainData !== undefined) {
            levelEditorStore.setTerrainData(data.levelEditor.terrainData);
          }
          if (data.levelEditor.wallData !== undefined) {
            levelEditorStore.setWallData(data.levelEditor.wallData);
          }
          if (data.levelEditor.environmentalObjects !== undefined) {
            levelEditorStore.setEnvironmentalObjects(data.levelEditor.environmentalObjects);
          }
          if (data.levelEditor.drawingPaths !== undefined) {
            levelEditorStore.setDrawingPaths(data.levelEditor.drawingPaths);
          }
          if (data.levelEditor.drawingLayers !== undefined) {
            levelEditorStore.setDrawingLayers(data.levelEditor.drawingLayers);
          }
          if (data.levelEditor.fogOfWarData !== undefined) {
            levelEditorStore.setFogOfWarData(data.levelEditor.fogOfWarData);
          }
          if (data.levelEditor.exploredAreas !== undefined) {
            levelEditorStore.setExploredAreas(data.levelEditor.exploredAreas);
          }
          if (data.levelEditor.lightSources !== undefined) {
            levelEditorStore.setLightSources(data.levelEditor.lightSources);
          }
          if (data.levelEditor.dynamicFogEnabled !== undefined) {
            levelEditorStore.setDynamicFogEnabled(data.levelEditor.dynamicFogEnabled);
          }
          if (data.levelEditor.respectLineOfSight !== undefined) {
            levelEditorStore.setRespectLineOfSight(data.levelEditor.respectLineOfSight);
          }
          if (data.levelEditor.dndElements !== undefined) {
            levelEditorStore.setDndElements(data.levelEditor.dndElements);
          }

          console.log('✅ Level editor state applied');
        }

        // Apply grid settings
        if (data.gridSettings) {
          const gameStore = useGameStore.getState();

          if (data.gridSettings.gridType !== undefined) {
            gameStore.setGridType(data.gridSettings.gridType);
            console.log('🔷 Grid type set to:', data.gridSettings.gridType);
          }
          if (data.gridSettings.gridSize !== undefined) {
            gameStore.setGridSize(data.gridSettings.gridSize);
          }
          if (data.gridSettings.gridOffsetX !== undefined && data.gridSettings.gridOffsetY !== undefined) {
            gameStore.setGridOffset(data.gridSettings.gridOffsetX, data.gridSettings.gridOffsetY);
          }
          if (data.gridSettings.gridLineColor !== undefined) {
            gameStore.setGridLineColor(data.gridSettings.gridLineColor);
          }
          if (data.gridSettings.gridLineThickness !== undefined) {
            gameStore.setGridLineThickness(data.gridSettings.gridLineThickness);
          }
          if (data.gridSettings.gridLineOpacity !== undefined) {
            gameStore.setGridLineOpacity(data.gridSettings.gridLineOpacity);
          }
          if (data.gridSettings.gridBackgroundColor !== undefined) {
            gameStore.setGridBackgroundColor(data.gridSettings.gridBackgroundColor);
          }

          console.log('✅ Grid settings applied');
        }

        // Apply gameplay settings
        if (data.gameplaySettings) {
          const gameStore = useGameStore.getState();
          const settingsStore = useSettingsStore.getState();

          if (data.gameplaySettings.feetPerTile !== undefined) {
            settingsStore.setFeetPerTile(data.gameplaySettings.feetPerTile);
            gameStore.setFeetPerTile(data.gameplaySettings.feetPerTile);
          }
          if (data.gameplaySettings.showMovementVisualization !== undefined) {
            settingsStore.setShowMovementVisualization(data.gameplaySettings.showMovementVisualization);
            gameStore.setShowMovementVisualization(data.gameplaySettings.showMovementVisualization);
          }
          if (data.gameplaySettings.movementLineColor !== undefined) {
            settingsStore.setMovementLineColor(data.gameplaySettings.movementLineColor);
            gameStore.setMovementLineColor(data.gameplaySettings.movementLineColor);
          }
          if (data.gameplaySettings.movementLineWidth !== undefined) {
            settingsStore.setMovementLineWidth(data.gameplaySettings.movementLineWidth);
            gameStore.setMovementLineWidth(data.gameplaySettings.movementLineWidth);
          }
          if (data.gameplaySettings.defaultViewFromToken !== undefined) {
            settingsStore.setDefaultViewFromToken(data.gameplaySettings.defaultViewFromToken);
            gameStore.setDefaultViewFromToken(data.gameplaySettings.defaultViewFromToken);
          }
          console.log('✅ Gameplay settings applied');
        }
      } catch (error) {
        console.error('❌ Failed to apply level editor state sync:', error);
      }
    });

    // Listen for token movements from other players
    socket.on('token_moved', (data) => {
      // Enhanced debug logging for multiplayer sync testing
      const myRole = isGMRef.current ? 'GM' : 'Player';
      console.log(`📨 [${myRole}] Received token_moved:`, {
        tokenId: data.tokenId || data.id,
        creatureId: data.creatureId,
        position: data.position,
        isDragging: data.isDragging,
        fromPlayerId: data.playerId,
        isFromSelf: data.playerId === socket.id
      });

      // Enhanced check to prevent processing our own movements with improved conflict detection
      const tokenId = data.tokenId || data.id;
      const creatureId = data.creatureId;
      const targetId = tokenId || creatureId;

      // CRITICAL FIX: Only skip if it's our own movement AND we're the one who moved it
      // Use tokenId for specific token tracking, fallback to creatureId
      const isDraggingOurToken = (window.multiplayerDragState && (
        window.multiplayerDragState.has(`token_${tokenId}`) ||
        window.multiplayerDragState.has(`token_${creatureId}`)
      ));

      const isOwnMovement = (data.playerId === socket.id) && isDraggingOurToken;

      // Standardized tracking key
      const recentMovementKey = `token_${targetId}`;
      const recentMovementTime = window.recentTokenMovements?.get(recentMovementKey)?.timestamp;
      const hasRecentLocalMovement = recentMovementTime && (Date.now() - recentMovementTime) < 1000 &&
        data.playerId === socket.id;

      // CRITICAL FIX: Resolve pending actionId BEFORE any early returns
      // to clear the optimistic update. 
      if (data.actionId) {
        optimisticUpdatesService.resolveUpdate(data.actionId, { position: data.position });
      }

      if (isOwnMovement || hasRecentLocalMovement) {
        return; // initiator doesn't need to re-update store from network
      }

      // CRITICAL FIX: Always update token position when receiving movement from server
      // This ensures GM moving player tokens shows the correct token moving
      // Smart throttling based on current player role
      const throttleKey = `${targetId}_${data.playerId}`;
      const now = Date.now();
      const lastUpdate = tokenUpdateThrottleRef.current.get(throttleKey) || 0;
      const throttleMs = isGMRef.current ? GM_THROTTLE_MS : PLAYER_THROTTLE_MS;

      if (now - lastUpdate >= throttleMs) {
        tokenUpdateThrottleRef.current.set(throttleKey, now);

        // Batch updates for better performance
        const updateData = {
          type: 'token',
          targetId: targetId || data.creatureId, // CRITICAL FIX: Use targetId (tokenId) first, fallback to creatureId
          position: data.position,
          timestamp: now
        };

        updateBatchRef.current.push(updateData);

        // Process batch after a short delay to group updates
        if (batchTimeoutRef.current) {
          clearTimeout(batchTimeoutRef.current);
        }

        batchTimeoutRef.current = setTimeout(() => {
          const batch = updateBatchRef.current.splice(0);
          if (batch.length > 0) {
            requestAnimationFrame(() => {
              batch.forEach(update => {
                if (update.type === 'token') {
                  // FIXED: Do NOT early return here. We resolved it above for the initiator, 
                  // but other players still need to process this movement update.
                  // The initiator's update to the store is handled locally during drag/drop.
                  if (data.playerId === socket.id) {
                    return;
                  }

                  // CRITICAL FIX: Find token by unique token ID token OR creatureId
                  const currentTokens = useCreatureStore.getState().tokens;
                  const token = currentTokens.find(t => t.id === update.targetId || t.creatureId === update.targetId);
                  if (token) {
                    // CRITICAL FIX: Only update position if it's significantly different to prevent micro-jumps
                    // This prevents position jumps when GM starts dragging player tokens
                    // FIX: position is a top-level property of token, not in token.state
                    const currentTokenPosition = token.position || { x: 0, y: 0 };
                    const distance = Math.sqrt(
                      Math.pow(update.position.x - currentTokenPosition.x, 2) +
                      Math.pow(update.position.y - currentTokenPosition.y, 2)
                    );

                    // CRITICAL FIX: Always update position when dragging starts or when distance is significant
                    // When GM starts dragging a player token, accept the first position update even if distance is small
                    // This prevents the player from seeing the token start from the wrong position
                    const shouldUpdate = data.isDragging || distance > 1 || distance === 0; // Accept dragging, significant changes, or exact matches

                    if (shouldUpdate) {
                      const myRole = isGMRef.current ? 'GM' : 'Player';
                      console.log(`✅ [${myRole}] Updating token position:`, {
                        tokenId: token.id,
                        from: { x: Math.round(currentTokenPosition.x), y: Math.round(currentTokenPosition.y) },
                        to: { x: Math.round(update.position.x), y: Math.round(update.position.y) },
                        distance: Math.round(distance)
                      });
                      updateCreatureTokenPosition(token.id, {
                        ...update.position,
                        isSyncEvent: true // CRITICAL: Mark as sync event to allow store tracking
                      });
                    }
                  } else {
                    console.warn('⚠️ Token not found for movement update:', {
                      targetId: update.targetId,
                      creatureId: data.creatureId,
                      tokenId: data.tokenId
                    });
                  }
                }
              });
            });
          }
        }, 33); // Increased delay to reduce frequency and prevent performance issues
      }

      // Clean up throttle entry immediately when dragging stops
      if (!data.isDragging) {
        // Small delay to allow final position update, then clean up
        setTimeout(() => {
          tokenUpdateThrottleRef.current.delete(throttleKey);
        }, 100);
      }
    });

    // Listen for token state updates (HP, Mana, AP) from other players
    socket.on('token_updated', (data) => {
      const { tokenId, stateUpdates, updatedBy } = data;

      // Skip if we are the one who sent it
      if (updatedBy === socket.id) return;

      const { updateTokenState } = require('../../store/creatureStore').default.getState();
      // Apply update locally, but don't re-emit to server
      updateTokenState(tokenId, stateUpdates, false);
    });

    // Listen for character movements from other players AND server confirmations
    // This handles: player moving their own token, GM moving any player's token
    socket.on('character_moved', (data) => {
      // CRITICAL DEBUG: Log all received character_moved events with clear info
      // If tokenId is undefined here, the event won't update the correct token!
      console.log('📥 Received character_moved:', {
        tokenId: data.tokenId,        // Should be the token's UUID (e.g., "fbdd8929-...")
        characterId: data.characterId, // Should be the token owner's player ID
        playerId: data.playerId,       // Who moved the token (sender - could be GM)
        position: data.position,
        mySocketId: socket.id,
        myPlayerId: currentPlayerRef.current?.id,
        hasTokenId: !!data.tokenId,    // Quick check - if false, we have a problem!
        hasCharacterId: !!data.characterId
      });

      // FIXED: Use tokenId or characterId consistently for character tokens
      const senderId = data.playerId;

      // CRITICAL FIX: When GM moves a player's token, we MUST have the tokenId to identify
      // which token to update. If both tokenId and characterId are undefined, 
      // log a warning and try alternate identification methods.
      let targetCharacterId = data.tokenId || data.characterId;

      if (!targetCharacterId) {
        // tokenId is missing! This is the bug case.
        // Log clearly so we know what data the server sent
        console.warn('⚠️ character_moved received WITHOUT tokenId or characterId!', {
          receivedData: data,
          hint: 'Check that CharacterToken.jsx emits tokenId and server.js relays data.tokenId'
        });

        // FALLBACK: Try to find any character token that might be the one being moved
        // When GM moves a player's token, we NEED to update the player's own token
        // So we look for any token near the new position
        const { characterTokens } = useCharacterTokenStore.getState();

        // Sort tokens by distance from the new position, pick the closest one
        // that isn't at the exact new position already (which would mean it's already updated)
        const sortedByDistance = (characterTokens || [])
          .map(token => {
            const dx = (token.position?.x || 0) - data.position.x;
            const dy = (token.position?.y || 0) - data.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return { token, distance };
          })
          .filter(({ distance }) => distance > 1) // Exclude tokens already at target position
          .sort((a, b) => a.distance - b.distance);

        const nearbyMatch = sortedByDistance[0];

        if (nearbyMatch && nearbyMatch.distance < 500) { // Within ~10 tiles
          targetCharacterId = nearbyMatch.token.id;
          console.log('🔧 FALLBACK: Found likely token by proximity:', {
            tokenId: nearbyMatch.token.id,
            playerId: nearbyMatch.token.playerId,
            isOwnToken: nearbyMatch.token.playerId === currentPlayerRef.current?.id,
            tokenPosition: nearbyMatch.token.position,
            newPosition: data.position,
            distance: Math.round(nearbyMatch.distance)
          });
        } else {
          // Last resort - use senderId but warn that this probably won't work
          targetCharacterId = senderId;
          console.warn('❌ Could not identify target token! Using senderId as fallback (likely wrong):', {
            senderId,
            availableTokens: (characterTokens || []).map(t => ({ id: t.id, playerId: t.playerId }))
          });
        }
      }

      const isOwnMovement = senderId === socket.id || (currentPlayerRef.current && senderId === currentPlayerRef.current.id);

      // Standardized tracking key - MUST match CharacterToken.jsx
      const recentMovementKey = `token_${targetCharacterId}`;
      const recentMovementEntry = window.recentTokenMovements?.get(recentMovementKey);
      const recentMovementTime = recentMovementEntry?.timestamp;

      // CRITICAL FIX: Enhanced echo prevention - skip if:
      // 1. This is our own movement based on senderId/socket matching
      // 2. We recently moved this specific tokenId locally (within 1000ms grace period)
      if (isOwnMovement) {
        console.log('🚫 Skipping character_moved - isOwnMovement:', { senderId, socketId: socket.id });
        return;
      }

      // CRITICAL FIX: Check if this token was recently moved locally (by any of our tokens)
      // This catches echoes that come back with different sender IDs
      if (recentMovementEntry && recentMovementEntry.isLocal && (Date.now() - (recentMovementTime || 0) < 1000)) {
        console.log('🚫 Skipping character_moved - recent local movement:', { recentMovementEntry });
        // Skip server echo for this token - we moved it locally recently
        return;
      }

      console.log('✅ Processing character_moved - updating token:', {
        targetCharacterId,
        newPosition: data.position
      });

      // Throttle character token position updates
      const throttleKey = `character_${targetCharacterId}`;
      const now = Date.now();
      const lastUpdate = tokenUpdateThrottleRef.current.get(throttleKey) || 0;
      const throttleMs = data.isDragging ? 33 : 16;

      if (now - lastUpdate >= throttleMs || !data.isDragging) {
        tokenUpdateThrottleRef.current.set(throttleKey, now);

        try {
          const { updateCharacterTokenPosition, characterTokens } = useCharacterTokenStore.getState();

          // FIXED: Add isSyncEvent flag to prevent store from blocking this update as an "echo"
          const positionWithSync = {
            ...data.position,
            isSyncEvent: true
          };

          // Double-check: does a token with this ID exist?
          const tokenExists = (characterTokens || []).some(t =>
            t.id === targetCharacterId || t.playerId === targetCharacterId
          );

          if (!tokenExists) {
            console.warn('⚠️ Token not found in store! Update will fail:', {
              targetCharacterId,
              availableTokens: (characterTokens || []).map(t => ({ id: t.id, playerId: t.playerId }))
            });
          }

          updateCharacterTokenPosition(targetCharacterId, positionWithSync);
        } catch (error) {
          console.error('Failed to update character token position:', error);
        }
      }

      // Clean up throttle entry when dragging stops
      if (!data.isDragging) {
        setTimeout(() => {
          tokenUpdateThrottleRef.current.delete(throttleKey);
        }, 100);
      }
    });

    // Combat lag compensation event handlers
    socket.on('combat_action', (data) => {
      // Handle predicted combat actions from other players
      if (data.playerId !== currentPlayerRef.current?.id) {
        // Apply the action with lag compensation
      }
    });

    socket.on('combat_correction', (data) => {
      // Handle server corrections for predicted combat state
      // Apply corrections to local combat state
      if (data.discrepancies && data.discrepancies.length > 0) {
        // Update local combat state to match server
      }
    });

    socket.on('combat_state_sync', (data) => {
      // IMPROVEMENT: Full combat state synchronization with proper state restoration

      if (data.combat) {
        const combatStore = useCombatStore.getState();

        // If combat is active, restore the full state
        if (data.combat.isActive) {
          // Restore turn order if available
          if (data.combat.turnOrder && data.combat.turnOrder.length > 0) {
            combatStore.startCombat(data.combat.turnOrder);

            // Restore current turn index
            if (data.combat.currentTurnIndex !== undefined) {
              const currentState = combatStore.getCombatState();
              const targetIndex = data.combat.currentTurnIndex;
              const currentIndex = currentState.currentTurnIndex || 0;

              // Advance to correct turn if needed
              if (targetIndex !== currentIndex) {
                const diff = targetIndex - currentIndex;
                for (let i = 0; i < Math.abs(diff); i++) {
                  if (diff > 0) {
                    combatStore.nextTurn();
                  }
                }
              }
            }

            // Restore round number if available
            if (data.combat.round !== undefined) {
              // Round is managed internally, but we can log it
            }
          }
        } else {
          // Combat is not active, ensure it's stopped
          const currentState = combatStore.getCombatState();
          if (currentState.isActive) {
            // Stop combat if it was active locally but not on server
          }
        }
      }
    });

    socket.on('combat_action', (data) => {
      // Handle real-time combat actions
      console.log('Received combat action:', data);

      switch (data.type) {
        case 'turn_changed':
          // Update turn index and round
          if (data.newTurnIndex !== undefined) {
            // The combat store will be updated through the normal sync process
          }
          break;

        case 'initiative_updated':
          // Update initiative for a specific combatant
          if (data.combatantId && data.newInitiative !== undefined) {
            const combatStore = useCombatStore.getState();
            combatStore.updateInitiative(data.combatantId, data.newInitiative);
          }
          break;
      }
    });

    // Handle cursor updates from other players (deprecated - CursorTracker.jsx handles this now)
    // socket.on('cursor_update', (data) => {
    //   if (data.playerId !== currentPlayerRef.current?.id && showCursorTracking) {
    //     setOtherPlayerCursors(prev => ({
    //       ...prev,
    //       [data.playerId]: {
    //         ...data,
    //         lastUpdate: Date.now()
    //       }
    //     }));
    //   }
    // });

    // Listen for item drops from other players
    socket.on('item_dropped', (data) => {
      const isSync = data.isSync;
      const myRole = isGMRef.current ? 'GM' : 'Player';
      console.log(`📨 [${myRole}] Received item_dropped:`, {
        itemName: data.item?.name,
        itemId: data.item?.id,
        position: data.position,
        fromPlayer: data.playerName,
        isSync: data.isSync,
        isFromSelf: data.playerId === currentPlayerRef.current?.id
      });

      // Only add item if it's not our own drop (to avoid duplicates) or if it's a sync
      if (data.playerId !== currentPlayerRef.current?.id || isSync) {
        // Import the grid item store dynamically to avoid circular dependencies
        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { addItemToGrid } = useGridItemStore.getState();

          // Add the item to the grid without sending back to server (avoid infinite loop)
          addItemToGrid(data.item, data.position, false);

          // Show notification in chat only for new drops from other players, not syncs or own drops
          if (!isSync && data.playerId !== currentPlayerRef.current?.id) {
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `${data.playerName} dropped ${data.item.name} on the grid`,
              type: 'system',
              timestamp: new Date().toISOString()
            });
          }
        }).catch(error => {
          console.error('Failed to import gridItemStore:', error);
        });
      }
    });

    // Listen for token creation from other players
    socket.on('token_created', (data) => {
      const myRole = isGMRef.current ? 'GM' : 'Player';
      console.log(`📨 [${myRole}] Received token_created:`, {
        creatureName: data.creature?.name,
        creatureId: data.creature?.id,
        tokenId: data.token?.id,
        position: data.position,
        fromPlayer: data.playerName,
        isSync: data.isSync,
        isFromSelf: data.playerId === socket.id
      });
      const isSync = data.isSync;
      const myPlayerId = socket.id; // Use socket.id for reliable self-identification

      // CRITICAL FIX: Check if this is our own token creation being echoed back
      const isOwnTokenCreation = data.playerId === myPlayerId;

      if (isOwnTokenCreation && !isSync) {
        // This is our own token creation being echoed back by server
        // DON'T add it to the store again - we already added it when we created it
        console.log('🔄 Skipping duplicate token from own creation');
        return;
      }

      // Only add token for sync events, and for new creations from other players
      if (isSync || !isSync) {
        // First ensure that creature exists in the store
        addCreature(data.creature);

        // Then add the token without sending back to server (avoid infinite loop)
        // Pass initial state to ensure correct stats
        addToken(data.creature.id, data.position, false, data.token.id, data.token.state);
      }

      // Show notification in chat only for new creations from other players, not syncs or own creations
      if (!isSync && data.playerId !== myPlayerId) {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.playerName} placed ${data.creature.name} on the grid`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    // NOTE: character_moved handled by the main listener at line 1305
    // Listener at line 1525 removed to prevent update conflicts

    // Listen for character token creation from other players
    socket.on('character_token_created', (data) => {
      // Use socket.id for reliable self-filtering
      const myPlayerId = socket.id;
      if (data.playerId === myPlayerId) {
        return;
      }

      try {
        const { addCharacterTokenFromServer, addCharacterToken } = useCharacterTokenStore.getState();

        // Add character token directly from server data (bypasses multiplayer sending)
        if (addCharacterTokenFromServer) {
          addCharacterTokenFromServer(data.tokenId, data.position, data.playerId);
        } else {
          // Fallback to regular method but don't send to server
          addCharacterToken(data.position, data.playerId, false); // false = don't send to server
        }

        // Show notification in chat only if it's not our own creation
        if (data.playerId !== myPlayerId) {
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `${data.playerName} placed their character token on the grid`,
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Failed to update character tokens:', error);
      }
    });

    // Listen for loot events from other players
    socket.on('item_looted', (data) => {

      // Add loot notification to the loot tab
      addNotification('loot', {
        type: 'item_looted',
        item: data.item,
        quantity: data.quantity,
        source: data.source,
        looter: data.looter,
        timestamp: data.timestamp
      });

      // Show in social chat only if it's not our own loot action
      if (data.playerId !== currentPlayerRef.current?.id) {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.looter} looted ${data.item.name} (x${data.quantity}) from ${data.source}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }

      // Remove the item from grid if it was successfully removed on server
      // Remove the item from grid if it was successfully removed on server
      // For currency items, also process our own removals to ensure synchronization
      // For other items, only remove if this is from another player (our own removals are handled immediately)
      const shouldRemove = data.gridItemId && data.itemRemoved && (
        data.playerId !== currentPlayerRef.current?.id || // Other player's loot
        (data.item && data.item.type === 'currency') // Our own currency loot (needs server confirmation)
      );

      if (shouldRemove) {
        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { removeItemFromGrid, gridItems } = useGridItemStore.getState();

          // Check if item still exists before trying to remove it
          const itemExists = gridItems.find(item => item.id === data.gridItemId);
          if (itemExists) {
            removeItemFromGrid(data.gridItemId);
          }
        }).catch(error => {
          console.error('Failed to import gridItemStore for loot removal:', error);
        });
      }
    });

    // Listen for grid item synchronization when joining a room
    socket.on('sync_grid_items', (data) => {

      import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
        const { addItemToGrid } = useGridItemStore.getState();

        // Add each grid item without sending back to server
        Object.values(data.gridItems).forEach(gridItem => {
          addItemToGrid(gridItem, gridItem.position, false);
        });
      }).catch(error => {
        console.error('Failed to import gridItemStore for sync:', error);
      });
    });

    // Listen for grid item position updates from other players
    socket.on('grid_item_update', (data) => {
      const { type, data: updateData, playerId } = data;

      // Skip if it's our own update (we already applied it locally)
      if (playerId === socket.id) return;

      import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
        const { updateItemPosition, removeItemFromGrid, gridItems } = useGridItemStore.getState();

        if (type === 'grid_item_moved' && updateData.gridItemId && updateData.newPosition) {
          console.log('📦 Received grid item move from other player:', updateData.gridItemId);
          updateItemPosition(updateData.gridItemId, updateData.newPosition, false);
        } else if (type === 'grid_item_removed' && updateData.gridItemId) {
          console.log('📦 Received grid item removal from other player:', updateData.gridItemId);
          const itemExists = gridItems.find(item => item.id === updateData.gridItemId);
          if (itemExists) {
            removeItemFromGrid(updateData.gridItemId);
          }
        }
      }).catch(error => {
        console.error('Failed to import gridItemStore for grid item update:', error);
      });
    });

    // Listen for items dropped by other players
    socket.on('item_dropped', (data) => {
      // Skip if it's our own drop (we already have it locally)
      if (data.playerId === socket.id) return;

      import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
        const { addItemToGrid } = useGridItemStore.getState();

        console.log('📦 Received item drop from other player:', data.item?.name);
        addItemToGrid(data.item, data.position, false);
      }).catch(error => {
        console.error('Failed to import gridItemStore for item drop:', error);
      });
    });

    // Listen for token synchronization when joining a room
    socket.on('sync_tokens', (data) => {

      // Add each token without sending back to server
      Object.values(data.tokens).forEach(tokenData => {

        // First ensure the creature exists (if we have creature data)
        if (tokenData.creature) {
          addCreature(tokenData.creature);
        }

        // Then add the token with the correct token ID
        addToken(tokenData.creatureId, tokenData.position, false, tokenData.id);
      });
    });

    // Listen for character token synchronization when joining a room
    socket.on('sync_character_tokens', (data) => {
      try {
        const { addCharacterTokenFromServer, addCharacterToken } = useCharacterTokenStore.getState();
        const { addCharacterTokenFromServer: storeAddFromServer } = useCharacterTokenStore.getState();

        // Add each character token without sending back to server
        Object.values(data.characterTokens).forEach(tokenData => {
          if (storeAddFromServer) {
            storeAddFromServer(tokenData.id, tokenData.position, tokenData.playerId);
          } else {
            // Fallback method
            addCharacterToken(tokenData.position, tokenData.playerId, false); // false = don't send to server
          }
        });
      } catch (error) {
        console.error('Failed to sync character tokens:', error);
      }
    });

    // Listen for character updates from other players
    socket.on('character_updated', (data) => {
      // Only process updates from other players (not our own)
      const senderSocketId = data.character?.playerId || data.characterId;
      const characterName = data.character?.name;
      const updatedBy = data.updatedBy; // Player ID of sender from server
      const isFromGM = data.isGM || false; // Server may indicate if this is from GM

      console.log('📥 [character_updated] Received:', {
        senderSocketId,
        characterName,
        updatedBy,
        mySocketId: socket.id,
        hasLore: !!data.character?.lore,
        hasEquipment: !!data.character?.equipment,
        class: data.character?.class
      });

      // CRITICAL FIX: Use socket.id to check if this is our own update
      // The senderSocketId in the data is the sender's socket ID, compare against our socket.id
      if (senderSocketId && senderSocketId !== socket.id) {
        // CRITICAL FIX: Find party member by multiple strategies since party members use UUIDs
        // but character_updated events use socket IDs
        const partyStore = usePartyStore.getState();
        let partyMember = partyStore.partyMembers.find(m =>
          m.socketId === senderSocketId || // Match by stored socket ID
          m.socketId === updatedBy || // Match by server-provided sender ID stored as socketId
          m.id === updatedBy || // Match by ID since server uses player.id as updatedBy
          m.name === characterName || // Match by character name
          m.id === senderSocketId // Match by ID (in case they match)
        );

        // FALLBACK: If not found and this is from GM, find the GM party member
        if (!partyMember) {
          // Check if sender is the GM by looking at who ISN'T us and IS the GM
          const gmMember = partyStore.partyMembers.find(m => m.isGM && m.id !== 'current-player');
          if (gmMember) {
            console.log('📥 [character_updated] Trying GM fallback match:', { gmMemberName: gmMember.name });
            partyMember = gmMember;
          }
        }

        if (!partyMember) {
          console.warn('📥 [character_updated] Could not find party member for:', { senderSocketId, characterName, updatedBy });
          return;
        }

        // Store socketId on the member for future lookups
        const targetMemberId = partyMember.id;
        console.log('📥 [character_updated] Found party member:', { targetMemberId, name: partyMember.name });

        // Calculate proper race display name from race and subrace data
        let raceDisplayName = data.character.raceDisplayName || 'Unknown';

        // CRITICAL FIX: Use actual character data
        const baseCharacterData = {
          ...data.character,
          socketId: senderSocketId, // Store socketId for future lookups
          // Ensure we don't have nulls for critical stats
          health: data.character.health || { current: 45, max: 50 },
          mana: data.character.mana || { current: 45, max: 50 },
          actionPoints: data.character.actionPoints || { current: 1, max: 3 }
        };

        console.log('📦 [character_updated] baseCharacterData keys:', Object.keys(baseCharacterData));

        if (data.character.race && data.character.subrace) {
          import('../../data/raceData').then(({ getFullRaceData }) => {
            const raceData = getFullRaceData(data.character.race, data.character.subrace);
            if (raceData) {
              // Combine Race and Subrace for better display (e.g. "Nordmark (Bloodhammer)")
              const updatedRaceDisplayName = `${raceData.race.name} (${raceData.subrace.name})`;

              // Update party member with correct race display name
              usePartyStore.getState().updatePartyMember(targetMemberId, {
                name: data.character.name,
                socketId: senderSocketId,
                character: {
                  ...baseCharacterData,
                  raceDisplayName: updatedRaceDisplayName
                }
              }, true);
            }
          }).catch(error => {
            console.warn('Failed to calculate race display name:', error);
            // Fallback to base data
            usePartyStore.getState().updatePartyMember(targetMemberId, {
              name: data.character.name,
              socketId: senderSocketId,
              character: baseCharacterData
            }, true);
          });
        } else if (data.character.race) {
          import('../../data/raceData').then(({ getRaceData }) => {
            const raceData = getRaceData(data.character.race);
            if (raceData) {
              const updatedRaceDisplayName = raceData.name;
              // Update party member with correct race display name
              usePartyStore.getState().updatePartyMember(targetMemberId, {
                name: data.character.name,
                socketId: senderSocketId,
                character: {
                  ...baseCharacterData,
                  raceDisplayName: updatedRaceDisplayName
                }
              }, true);
            }
          }).catch(error => {
            console.warn('Failed to get race data:', error);
            // Fallback to base data
            usePartyStore.getState().updatePartyMember(targetMemberId, {
              name: data.character.name,
              socketId: senderSocketId,
              character: baseCharacterData
            }, true);
          });
        } else {
          // No race data to process, use base data
          usePartyStore.getState().updatePartyMember(targetMemberId, {
            name: data.character.name,
            socketId: senderSocketId,
            character: baseCharacterData
          }, true);
        }

        // Update chat user data
        try {
          updateUser(senderSocketId, {
            name: data.character.name,
            class: data.character.class || 'Unknown',
            level: data.character.level || 1
          });
        } catch (error) {
          // Fallback to adding if update fails
          addUser({
            id: senderSocketId,
            name: data.character.name,
            class: data.character.class || 'Unknown',
            level: data.character.level || 1,
            status: 'online'
          });
        }

        // Update connected players list with character data
        setConnectedPlayers(prev => prev.map(player =>
          player.id === senderSocketId
            ? { ...player, character: data.character }
            : player
        ));
      }
    });

    // Listen for high-frequency character resource updates
    socket.on('character_resource_updated', (data) => {
      const senderSocketId = data.senderSocketId || data.socketId || data.updatedBy;
      const characterId = data.characterId;
      const updatedBy = data.updatedBy;

      // CRITICAL FIX: Use socket.id to check if this is our own update
      if ((senderSocketId && senderSocketId !== socket.id) || (updatedBy && updatedBy !== socket.id)) {
        const partyStore = usePartyStore.getState();
        let partyMember = partyStore.partyMembers.find(m =>
          m.socketId === senderSocketId ||
          m.id === characterId ||
          m.id === updatedBy ||
          m.socketId === updatedBy
        );

        // FALLBACK: If not found and this is likely from GM (no characterId or special flag)
        if (!partyMember && !characterId) {
          const gmMember = partyStore.partyMembers.find(m => m.isGM && m.id !== 'current-player');
          if (gmMember) partyMember = gmMember;
        }

        if (!partyMember) return;

        const updates = { character: {} };

        // Handle delta-based updates
        if (data.newValues) {
          Object.entries(data.newValues).forEach(([resource, value]) => {
            updates.character[resource] = {
              current: value,
              max: data.max || partyMember.character?.[resource]?.max || 100
            };
          });
        } else if (data.resource) {
          // Handle old format
          updates.character[data.resource] = {
            current: data.current,
            max: data.max || partyMember.character?.[data.resource]?.max || 100
          };
        }

        usePartyStore.getState().updatePartyMember(partyMember.id, updates, true);
      }
    });

    // Listen for character equipment updates from other players
    socket.on('character_equipment_updated', (data) => {
      const senderSocketId = data.senderSocketId || data.socketId || data.updatedBy;
      const characterId = data.characterId;
      const updatedBy = data.updatedBy;

      // Update party member with new equipment and stats
      if ((senderSocketId && senderSocketId !== socket.id) || (updatedBy && updatedBy !== socket.id)) {
        const partyStore = usePartyStore.getState();
        let partyMember = partyStore.partyMembers.find(m =>
          m.socketId === senderSocketId ||
          m.id === characterId ||
          m.id === updatedBy ||
          m.socketId === updatedBy ||
          m.name === data.updatedByName
        );

        // FALLBACK: If not found and from GM
        if (!partyMember) {
          const gmMember = partyStore.partyMembers.find(m => m.isGM && m.id !== 'current-player');
          if (gmMember) partyMember = gmMember;
        }

        if (partyMember) {
          usePartyStore.getState().updatePartyMember(partyMember.id, {
            character: {
              equipment: data.equipment,
              ...(data.stats || {})
            }
          }, true);
        }
      }

      // Show notification if it's from another player
      const isOurUpdate = data.updatedBy === currentPlayerRef.current?.id ||
        data.updatedByName === currentPlayerRef.current?.name ||
        data.updatedBy === socket.id;

      if (!isOurUpdate) {
        // Show notification in chat
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.updatedByName || 'Someone'} ${data.item ? 'equipped' : 'unequipped'} ${data.item?.name || 'an item'} ${data.item ? 'to' : 'from'} ${data.slot}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Listen for player color updates
    socket.on('player_color_updated', (data) => {

      // Update connected players list with new color
      setConnectedPlayers(prev =>
        prev.map(player =>
          player.id === data.playerId
            ? { ...player, color: data.color }
            : player
        )
      );

      // Show notification in chat
      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `${data.playerName} changed their chat color`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    // Handle full game state synchronization
    socket.on('full_game_state_sync', (data) => {

      // IMPROVEMENT: Sync tokens (creatures)
      if (data.tokens && Object.keys(data.tokens).length > 0) {
        Object.values(data.tokens).forEach(tokenData => {
          if (tokenData.creature) {
            addCreature(tokenData.creature);
          }
          // Pass the tokenData.state as the initialState to preserve HP/Mana/Conditions
          addToken(tokenData.creatureId, tokenData.position, false, tokenData.id, tokenData.state);
        });
      }

      // IMPROVEMENT: Sync character tokens (player characters on map)
      if (data.characterTokens && Object.keys(data.characterTokens).length > 0) {
        try {
          const { addCharacterTokenFromServer, addCharacterToken } = useCharacterTokenStore.getState();
          Object.values(data.characterTokens).forEach(tokenData => {
            if (tokenData.playerId && tokenData.position) {
              if (addCharacterTokenFromServer) {
                addCharacterTokenFromServer(tokenData.id, tokenData.position, tokenData.playerId);
              } else {
                // CORRECTED ARGUMENT ORDER: (position, playerId, sendToServer)
                addCharacterToken(tokenData.position, tokenData.playerId, false);
              }
            }
          });
        } catch (error) {
          console.warn('Failed to sync character tokens:', error);
        }
      }

      // IMPROVEMENT: Sync grid items
      if (data.gridItems && Object.keys(data.gridItems).length > 0) {
        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { addItemToGrid } = useGridItemStore.getState();

          Object.values(data.gridItems).forEach(gridItem => {
            addItemToGrid(gridItem, gridItem.position, false);
          });
        }).catch(error => {
          console.warn('Failed to sync grid items:', error);
        });
      }

      // IMPROVEMENT: Sync fog of war if provided
      if (data.fogOfWar !== undefined) {
        import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          window._isReceivingMapUpdate = true;
          levelEditorStore.setFogOfWarData(data.fogOfWar);
          window._isReceivingMapUpdate = false;
        }).catch(error => {
          console.warn('Failed to sync fog of war:', error);
        });
      }

      // IMPROVEMENT: Sync map data (terrain, walls, etc.)
      if (data.mapData) {
        import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          window._isReceivingMapUpdate = true;

          if (data.mapData.terrainData !== undefined) {
            levelEditorStore.setTerrainData(data.mapData.terrainData);
          }
          if (data.mapData.wallData !== undefined) {
            levelEditorStore.setWallData(data.mapData.wallData);
          }
          if (data.mapData.fogOfWarPaths !== undefined) {
            levelEditorStore.setFogOfWarPaths(data.mapData.fogOfWarPaths);
          }

          window._isReceivingMapUpdate = false;
        }).catch(error => {
          console.warn('Failed to sync map data:', error);
        });
      }

      // IMPROVEMENT: Sync combat state
      if (data.combat) {
        const combatStore = useCombatStore.getState();
        if (data.combat.isActive) {
          // Restore combat state
          if (data.combat.turnOrder && data.combat.turnOrder.length > 0) {
            combatStore.startCombat(data.combat.turnOrder);
            if (data.combat.currentTurnIndex !== undefined) {
              // Set current turn
              for (let i = 0; i < data.combat.currentTurnIndex; i++) {
                combatStore.nextTurn();
              }
            }
          }
        }
      }

      // IMPROVEMENT: Sync party members from server state
      if (data.players && Array.isArray(data.players)) {
        data.players.forEach(playerData => {
          if (playerData.id !== currentPlayerRef.current?.id && playerData.character) {
            updatePartyMember(playerData.id, {
              name: playerData.name,
              character: playerData.character,
              color: playerData.color
            });
          }
        });
      }

      // IMPROVEMENT: Sync GM data if available
      if (data.gm && data.gm.character) {
        updatePartyMember(data.gm.id, {
          name: data.gm.name,
          character: data.gm.character,
          color: data.gm.color
        });
      }

    });

    // Handle party updates
    socket.on('party_update', (data) => {
      // Import party store dynamically to avoid circular dependencies
      import('../../store/partyStore').then(({ default: usePartyStore }) => {
        const partyStore = usePartyStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayerRef.current?.id) {
          switch (data.type) {
            case 'member_added':
              // Add the new party member
              if (data.data && data.data.id) {
                const memberData = {
                  ...data.data,
                  status: 'online' // Assume online since they're active
                };
                partyStore.addPartyMember(memberData);
              }
              break;

            case 'member_removed':
              // Remove the party member
              if (data.data && data.data.memberId) {
                partyStore.removePartyMember(data.data.memberId);
              }
              break;

            case 'member_updated':
              // Update party member data - Pass true to indicate this is from sync
              if (data.data && data.data.memberId && data.data.updates) {
                partyStore.updatePartyMember(data.data.memberId, data.data.updates, true);
              }
              break;

            case 'leadership_transferred':
              // Update leader status across all clients
              // The setLeader function now handles GM mode toggle internally
              if (data.data && data.data.leaderId) {
                let resolvedLeaderId = data.data.leaderId;

                // CRITICAL: Translate the leaderId to 'current-player' if it matches our socket/player ID
                // This is needed because on the GM's side, the player is identified by their socket ID,
                // but on the player's own side, they're identified as 'current-player'.
                const mySocketId = socket?.id;
                const myPlayerId = currentPlayerRef.current?.id;
                const amITheNewLeader = resolvedLeaderId === mySocketId || resolvedLeaderId === myPlayerId;

                if (amITheNewLeader) {
                  resolvedLeaderId = 'current-player';
                  console.log('👑 I am now the leader! Translating leaderId to current-player');
                }

                console.log('👑 Leadership transferred via socket:', data.data.leaderId, '→', resolvedLeaderId);

                // CRITICAL FIX: Clear any active drag states or interaction flags when leadership changes
                // to prevent the new leader from having blocked interactions due to stale state.
                if (window.multiplayerDragState) {
                  console.log('🧹 Clearing multiplayerDragState due to leadership transfer');
                  window.multiplayerDragState.clear();
                }

                window.tokenInteractionActive = false;
                window.tokenInteractionTimestamp = null;
                window._isDraggingToken = false;
                window._isDraggingCamera = false;

                // CRITICAL FIX: Update isGM local state immediately
                setIsGM(amITheNewLeader);

                // Pass true as second arg to indicate this is from sync (prevents re-broadcast)
                partyStore.setLeader(resolvedLeaderId, true);
              }
              break;
          }
        }
      });
    });

    // Handle buff updates
    socket.on('buff_update', (data) => {
      // Import buff store dynamically to avoid circular dependencies
      import('../../store/buffStore').then(({ default: useBuffStore }) => {
        const buffStore = useBuffStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayerRef.current?.id) {
          switch (data.type) {
            case 'buff_added':
              // Add the new buff
              if (data.data && data.data.id) {
                buffStore.addBuff(data.data);
              }
              break;

            case 'buff_removed':
              // Remove the buff
              if (data.data && data.data.buffId) {
                buffStore.removeBuff(data.data.buffId);
              }
              break;
          }
        }
      });
    });

    // Handle debuff updates
    socket.on('debuff_update', (data) => {
      // Import debuff store dynamically to avoid circular dependencies
      import('../../store/debuffStore').then(({ default: useDebuffStore }) => {
        const debuffStore = useDebuffStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayerRef.current?.id) {
          switch (data.type) {
            case 'debuff_added':
              // Add the new debuff
              if (data.data && data.data.id) {
                debuffStore.addDebuff(data.data);
              }
              break;

            case 'debuff_removed':
              // Remove the debuff
              if (data.data && data.data.debuffId) {
                debuffStore.removeDebuff(data.data.debuffId);
              }
              break;
          }
        }
      });
    });

    // Handle dice updates
    socket.on('dice_update', (data) => {
      // Import dice store dynamically to avoid circular dependencies
      import('../../store/diceStore').then(({ default: useDiceStore }) => {
        const diceStore = useDiceStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayer?.id) {
          switch (data.type) {
            case 'dice_added':
              // Add dice to selection
              if (data.data && data.data.diceType && data.data.quantity) {
                diceStore.addDice(data.data.diceType, data.data.quantity);
              }
              break;

            case 'dice_removed':
              // Remove dice from selection
              if (data.data && data.data.diceType && data.data.quantity) {
                diceStore.removeDice(data.data.diceType, data.data.quantity);
              }
              break;

            case 'dice_quantity_set':
              // Set dice quantity
              if (data.data && data.data.diceType !== undefined && data.data.quantity !== undefined) {
                diceStore.setDiceQuantity(data.data.diceType, data.data.quantity);
              }
              break;

            case 'dice_rolled':
              // Show dice roll results from other players
              if (data.data && data.data.results) {
                // Add to roll history without triggering local roll
                const rollEntry = {
                  ...data.data,
                  playerName: data.playerName,
                  fromNetwork: true
                };
                // This could trigger a notification or add to a shared roll history
              }
              break;
          }
        }
      });
    });

    // IMPROVEMENT: Handle spell cast synchronization from other players
    socket.on('spell_cast', (data) => {
      // Only process casts from other players (not our own)
      if (data.casterId && data.casterId !== currentPlayer?.id) {

        // Add notification to chat
        addNotification('combat', {
          sender: { name: data.casterName, class: 'player', level: 0 },
          content: `${data.casterName} cast ${data.spellName}${data.targetIds?.length > 0 ? ` on ${data.targetIds.length} target(s)` : ''}`,
          type: 'spell',
          spellData: data,
          timestamp: data.timestamp || new Date().toISOString()
        });

        // TODO: Apply spell effects to targets if needed
        // This would integrate with the combat system
      }
    });

    // IMPROVEMENT: Handle ability use synchronization from other players
    socket.on('ability_used', (data) => {
      // Only process abilities from other players
      if (data.usedBy && data.usedBy !== currentPlayer?.id) {

        // Add notification to chat
        addNotification('combat', {
          sender: { name: data.usedByName, class: 'player', level: 0 },
          content: `${data.usedByName} used ${data.abilityName} with ${data.creatureName}`,
          type: 'ability',
          abilityData: data,
          timestamp: data.timestamp || new Date().toISOString()
        });
      }
    });

    // Handle item updates
    socket.on('item_update', (data) => {
      // Import item store dynamically to avoid circular dependencies
      import('../../store/itemStore').then(({ default: useItemStore }) => {
        const itemStore = useItemStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayer?.id) {
          switch (data.type) {
            case 'item_added':
              // Add the new item
              if (data.data && data.data.item && data.data.categories) {
                itemStore.addItem(data.data.item, data.data.categories);
              }
              break;

            case 'item_updated':
              // Update the item
              if (data.data && data.data.itemId && data.data.updates) {
                itemStore.updateItem(data.data.itemId, data.data.updates);
              }
              break;

            case 'item_removed':
              // Remove the item
              if (data.data && data.data.itemId) {
                itemStore.removeItem(data.data.itemId);
              }
              break;

            case 'item_moved':
              // Move the item to a different category
              if (data.data && data.data.itemId && data.data.categoryId) {
                itemStore.moveItem(data.data.itemId, data.data.categoryId);
              }
              break;
          }
        }
      });
    });

    // Handle window updates (optional - mostly for awareness)
    socket.on('window_update', (data) => {
      // Window updates are mostly informational - each player manages their own UI
      // But we can log for awareness or future features
      if (data.type === 'window_registered') {
      } else if (data.type === 'window_focused') {
      }
    });

    // Handle container updates
    socket.on('container_update', (data) => {
      // Import container store dynamically to avoid circular dependencies
      import('../../store/containerStore').then(({ default: useContainerStore }) => {
        const containerStore = useContainerStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayer?.id) {
          switch (data.type) {
            case 'container_added':
              // Add the new container
              if (data.data) {
                containerStore.addContainer(data.data);
              }
              break;

            case 'container_removed':
              // Remove the container
              if (data.data && data.data.containerId) {
                containerStore.removeContainer(data.data.containerId);
              }
              break;

            case 'container_toggled':
              // This is the most critical - sync open/close state
              if (data.data && data.data.containerId !== undefined) {
                // We need to check if the container exists and update its state
                // Since toggleOpen checks if it's not locked, we need to directly set the state
                const containerStore = useContainerStore.getState();
                // For now, we'll trust the sync - in a full implementation we'd verify
              }
              break;

            case 'container_lock_toggled':
              // Sync lock state
              if (data.data && data.data.containerId !== undefined) {
              }
              break;

            case 'item_added_to_container':
              // Add item to container
              if (data.data && data.data.containerId && data.data.item) {
                containerStore.addItemToContainer(data.data.containerId, data.data.item, data.data.item.position);
              }
              break;

            case 'item_removed_from_container':
              // Remove item from container
              if (data.data && data.data.containerId && data.data.itemId) {
                containerStore.removeItemFromContainer(data.data.containerId, data.data.itemId);
              }
              break;

            case 'container_position_updated':
              // Update container position
              if (data.data && data.data.containerId && data.data.position) {
                containerStore.updateContainerPosition(data.data.containerId, data.data.position);
              }
              break;
          }
        }
      });
    });

    // Handle grid item updates
    socket.on('grid_item_update', (data) => {
      // Import grid item store dynamically to avoid circular dependencies
      import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
        const gridItemStore = useGridItemStore.getState();

        // Only process updates from other players (not our own)
        // Use socket.id for the most reliable comparison in mixed environments
        const myPlayerId = socket.id;
        if (data.playerId !== myPlayerId) {
          switch (data.type) {
            case 'grid_item_added':
              // Add item to grid - pass false to avoid sync loop
              if (data.data && data.data.item && data.data.position) {
                gridItemStore.addItemToGrid(data.data.item, data.data.position, false);
              }
              break;

            case 'grid_item_removed':
              // Remove item from grid - pass false to avoid sync loop
              if (data.data && data.data.gridItemId) {
                gridItemStore.removeItemFromGrid(data.data.gridItemId, false);
              }
              break;

            case 'grid_item_moved':
              // Move item on grid - pass false to avoid sync loop
              if (data.data && data.data.gridItemId && data.data.newPosition) {
                gridItemStore.updateItemPosition(data.data.gridItemId, data.data.newPosition, false);
              }
              break;
          }
        }
      });
    });

    // Listen for map updates (fog of war, drawing, tiles)
    socket.on('map_updated', (data) => {
      // CRITICAL FIX: Ignore echos of our own updates (prevents sync loops and blocking our own paint batches)
      if (data.updatedBy === currentPlayerRef.current?.id) {
        return;
      }

      window._isReceivingMapUpdate = true;

      import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
        const levelEditorStore = useLevelEditorStore.getState();

        // Handle both mapData (new format) and mapUpdates (legacy/store format)
        const mapData = data.mapData || data.mapUpdates || {};

        // Update fog of war if provided
        if (mapData.fogOfWar !== undefined) {
          levelEditorStore.setFogOfWarData(mapData.fogOfWar);
        }

        // Update fog paths if provided
        if (mapData.fogOfWarPaths !== undefined) {
          levelEditorStore.setFogOfWarPaths(mapData.fogOfWarPaths);
        }
        if (mapData.fogErasePaths !== undefined) {
          levelEditorStore.setFogErasePaths(mapData.fogErasePaths);
        }

        // CRITICAL FIX: Update terrain data if provided (this is the key fix for terrain tiles)
        if (mapData.terrainData !== undefined) {
          // Merge terrain data instead of replacing to preserve existing tiles
          // FIXED: levelEditorStore is already the result of getState(), access terrainData directly
          const currentTerrainData = levelEditorStore.terrainData || {};

          // CRITICAL FIX: Properly handle null values (erased terrain) and ensure all tiles are merged
          const mergedTerrainData = { ...currentTerrainData };
          for (const [key, value] of Object.entries(mapData.terrainData)) {
            if (value === null) {
              // Remove erased tiles
              delete mergedTerrainData[key];
            } else {
              // Add or update tile
              mergedTerrainData[key] = value;
            }
          }

          levelEditorStore.setTerrainData(mergedTerrainData);
        }

        // Update wall data if provided
        if (mapData.wallData !== undefined) {
          levelEditorStore.setWallData(mapData.wallData);
        }

        // Update drawing layers if provided
        if (mapData.drawingLayers !== undefined) {
          levelEditorStore.setDrawingLayers(mapData.drawingLayers);
        }

        // Update drawing paths if provided
        if (mapData.drawingPaths !== undefined) {
          levelEditorStore.setDrawingPaths(mapData.drawingPaths);
        }

        // CRITICAL FIX: Update explored areas if provided (for fog of war memory)
        if (mapData.exploredAreas !== undefined) {
          levelEditorStore.setExploredAreas(mapData.exploredAreas);
        }

        // Update dndElements (connections/portals) if provided
        if (mapData.dndElements !== undefined) {
          levelEditorStore.setDndElements(mapData.dndElements);
        }

        // CRITICAL FIX: Reset flag after processing to allow future updates
        setTimeout(() => {
          window._isReceivingMapUpdate = false;
        }, 100);
      }).catch(error => {
        console.error('Failed to update map data:', error);
        // Reset flag even on error
        window._isReceivingMapUpdate = false;
      });
    });

    // Listen for area remove operations from GM
    socket.on('area_remove', (data) => {
      // Only process removals from other players (not our own)
      if (data.removedBy !== currentPlayerRef.current?.id) {
        import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          const { removeToken } = require('../../store/creatureStore').default.getState();
          const { removeCharacterToken } = require('../../store/characterTokenStore').default.getState();
          const { removeItemFromGrid } = require('../../store/gridItemStore').default.getState();
          const { removeEnvironmentalObject, removeDrawingPath, removeWall, clearTerrain } = levelEditorStore;

          const { removeType, selectedObjects } = data;

          if (removeType === 'all') {
            selectedObjects.tokens?.forEach(token => removeToken(token.id));
            selectedObjects.characterTokens?.forEach(token => removeCharacterToken(token.id));
            selectedObjects.items?.forEach(item => removeItemFromGrid(item.id));
            selectedObjects.environmentalObjects?.forEach(obj => removeEnvironmentalObject(obj.id));
            selectedObjects.walls?.forEach(({ key }) => {
              const [x1, y1, x2, y2] = key.split(',').map(Number);
              removeWall(x1, y1, x2, y2);
            });
            selectedObjects.drawings?.forEach(path => removeDrawingPath(path.id));
            selectedObjects.terrainTiles?.forEach(({ gridX, gridY }) => {
              clearTerrain(gridX, gridY);
            });
          } else if (removeType === 'tokens') {
            selectedObjects.tokens?.forEach(token => removeToken(token.id));
          } else if (removeType === 'characterTokens') {
            selectedObjects.characterTokens?.forEach(token => removeCharacterToken(token.id));
          } else if (removeType === 'items') {
            selectedObjects.items?.forEach(item => removeItemFromGrid(item.id));
          } else if (removeType === 'environmentalObjects') {
            selectedObjects.environmentalObjects?.forEach(obj => removeEnvironmentalObject(obj.id));
          } else if (removeType === 'walls') {
            selectedObjects.walls?.forEach(({ key }) => {
              const [x1, y1, x2, y2] = key.split(',').map(Number);
              removeWall(x1, y1, x2, y2);
            });
          } else if (removeType === 'drawings') {
            selectedObjects.drawings?.forEach(path => removeDrawingPath(path.id));
          } else if (removeType === 'terrainTiles') {
            selectedObjects.terrainTiles?.forEach(({ gridX, gridY }) => {
              clearTerrain(gridX, gridY);
            });
          }

        }).catch(error => {
          console.error('Failed to process area remove:', error);
        });
      }
    });

    // NOTE: dialogue_message listener is handled in DialogueSystem.jsx
    // and synced via dialogueStore to prevent double-processing.

    // Listen for whisper messages
    socket.on('whisper_received', (message) => {
      // Import presence store dynamically to avoid circular dependencies
      import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
        const { addWhisperMessage, setActiveTab } = usePresenceStore.getState();
        // Add whisper message to the appropriate tab
        // Use senderId to create/update the whisper tab (tab is for the sender)
        const senderId = message.senderId;
        if (!senderId) {
          console.error('Whisper message missing senderId:', message);
          return;
        }

        // Create tab if it doesn't exist and switch to it
        const whisperTabId = `whisper_${senderId}`;
        addWhisperMessage(senderId, {
          id: message.id || `whisper_${Date.now()}`,
          senderId: message.senderId,
          senderName: message.senderName || 'Unknown',
          senderClass: message.senderClass || 'Unknown',
          senderLevel: message.senderLevel || 1,
          recipientId: message.recipientId || currentPlayerRef.current?.id,
          recipientName: message.recipientName || currentPlayerRef.current?.name || 'Unknown',
          content: message.content,
          timestamp: message.timestamp || message.serverTimestamp || new Date().toISOString(),
          type: 'whisper_received'
        });

        // Switch to whisper tab if not already on it
        const { activeTab } = usePresenceStore.getState();
        if (activeTab !== whisperTabId) {
          setActiveTab(whisperTabId);
        }
      }).catch(error => {
        console.error('Failed to handle whisper message:', error);
      });
    });

    // CRITICAL FIX: Listen for whisper_sent confirmation from server to update recipient name
    socket.on('whisper_sent', (message) => {
      // Import presence store dynamically to avoid circular dependencies
      import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
        const { addWhisperMessage } = usePresenceStore.getState();
        // Use recipientId to create/update the whisper tab (tab is for the recipient)
        const recipientId = message.recipientId;
        if (!recipientId) {
          console.error('Whisper sent confirmation missing recipientId:', message);
          return;
        }

        // Add message to whisper tab with correct recipient name
        addWhisperMessage(recipientId, {
          id: message.id || `whisper_${Date.now()}`,
          senderId: message.senderId,
          senderName: message.senderName || 'Unknown',
          senderClass: message.senderClass || 'Unknown',
          senderLevel: message.senderLevel || 1,
          recipientId: message.recipientId,
          recipientName: message.recipientName || 'Unknown',
          recipientClass: message.recipientClass || 'Unknown',
          recipientLevel: message.recipientLevel || 1,
          content: message.content,
          timestamp: message.timestamp || message.serverTimestamp || new Date().toISOString(),
          type: 'whisper_sent'
        });
      }).catch(error => {
        console.error('Failed to handle whisper sent confirmation:', error);
      });
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
      console.error('❌ Connection error:', error);

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: 'Connection error. Attempting to reconnect...',
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    // REMOVED: Duplicate character_token_created handler - handled above at line 506

    // Duplicate character movement handler disabled to prevent double processing
    // The main character_moved handler above handles all character movements

    // Handle game session launch
    socket.on('game_session_launched', (data) => {
      // Show game session invitation popup for players (not GM)
      if (!isGMRef.current) {
        // Show popup invitation
        setPendingGameSessionInvitations(prev => [...prev, {
          id: `session_${Date.now()}`,
          gmName: data.gmName,
          roomName: data.roomName,
          timestamp: data.timestamp
        }]);
      }
    });

    // Handle game session response (for GM)
    socket.on('game_session_response', (data) => {
      if (isGMRef.current) {
        addNotification('social', {
          sender: { name: data.playerName, class: 'player', level: 0 },
          content: `${data.playerName} has ${data.accepted ? 'accepted' : 'declined'} the game session invitation.`,
          type: 'game_session_response',
          accepted: data.accepted,
          timestamp: data.timestamp
        });
      }
    });

    // ========== QUEST SHARING SOCKET LISTENERS ==========

    // Handle receiving a shared quest from GM (for players)
    socket.on('quest_shared', (data) => {
      // Only process for non-GM players
      if (isGMRef.current) return;

      import('../../store/questStore').then(({ default: useQuestStore }) => {
        const { addPendingSharedQuest } = useQuestStore.getState();
        addPendingSharedQuest(data.quest, data.sharedBy);

        addNotification('social', {
          sender: { name: data.sharedBy?.name || 'Game Master', class: 'gm', level: 0 },
          content: `New quest offered: "${data.quest.title}"`,
          type: 'quest_shared',
          timestamp: data.timestamp
        });
      }).catch(error => {
        console.error('Failed to handle quest_shared:', error);
      });
    });

    // Handle GM receiving quest share confirmation
    socket.on('quest_share_confirmed', (data) => {
      if (!isGMRef.current) return;

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Quest "${data.questTitle}" shared with all players.`,
        type: 'system',
        timestamp: data.timestamp
      });
    });

    // Handle GM receiving quest acceptance notification
    socket.on('quest_accepted_notification', (data) => {
      if (!isGMRef.current) return;

      // Update tracking status
      import('../../store/questStore').then(({ default: useQuestStore }) => {
        const { updatePlayerShareStatus } = useQuestStore.getState();
        updatePlayerShareStatus(data.questId, data.playerId, data.playerName, 'accepted');
      }).catch(err => console.error('Failed to update share status:', err));

      addNotification('social', {
        sender: { name: data.playerName, class: 'player', level: 0 },
        content: `Accepted quest: "${data.questTitle}"`,
        type: 'quest_accepted',
        timestamp: data.timestamp
      });
    });

    // Handle GM receiving quest decline notification
    socket.on('quest_declined_notification', (data) => {
      if (!isGMRef.current) return;

      // Update tracking status
      import('../../store/questStore').then(({ default: useQuestStore }) => {
        const { updatePlayerShareStatus } = useQuestStore.getState();
        updatePlayerShareStatus(data.questId, data.playerId, data.playerName, 'declined');
      }).catch(err => console.error('Failed to update share status:', err));

      addNotification('social', {
        sender: { name: data.playerName, class: 'player', level: 0 },
        content: `Declined quest: "${data.questTitle}"`,
        type: 'quest_declined',
        timestamp: data.timestamp
      });
    });

    // Handle GM receiving quest completion request
    socket.on('quest_completion_pending', (data) => {
      if (!isGMRef.current) return;

      import('../../store/questStore').then(({ default: useQuestStore }) => {
        const { addPendingRewardDelivery } = useQuestStore.getState();
        addPendingRewardDelivery(data.quest, data.playerId, data.playerName);

        addNotification('social', {
          sender: { name: data.playerName, class: 'player', level: 0 },
          content: `Requesting completion of quest: "${data.quest.title}"`,
          type: 'quest_completion_pending',
          timestamp: data.timestamp
        });
      }).catch(error => {
        console.error('Failed to handle quest_completion_pending:', error);
      });
    });

    // Handle player receiving confirmation that completion request was sent
    socket.on('quest_completion_request_sent', (data) => {
      if (isGMRef.current) return;

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Completion request for "${data.questTitle}" sent to GM.`,
        type: 'system',
        timestamp: data.timestamp
      });
    });

    // Handle player receiving rewards from GM
    socket.on('rewards_received', (data) => {
      if (isGMRef.current) return;

      Promise.all([
        import('../../store/questStore'),
        import('../../store/characterStore'),
        import('../../store/inventoryStore')
      ]).then(([questModule, characterModule, inventoryModule]) => {
        const useQuestStore = questModule.default;
        const useCharacterStore = characterModule.default;
        const useInventoryStore = inventoryModule.default;

        const { markSharedQuestCompleted } = useQuestStore.getState();
        const characterStore = useCharacterStore.getState();
        const inventoryStore = useInventoryStore.getState();

        // Mark quest as completed
        markSharedQuestCompleted(data.questId);

        // Add experience
        if (data.rewards?.experience > 0) {
          const currentExp = characterStore.experience || 0;
          characterStore.updateCharacterInfo('experience', currentExp + data.rewards.experience);
        }

        // Add currency
        if (data.rewards?.currency) {
          const currentCurrency = inventoryStore.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 };
          inventoryStore.updateCurrency({
            platinum: (currentCurrency.platinum || 0) + (data.rewards.currency.platinum || 0),
            gold: (currentCurrency.gold || 0) + (data.rewards.currency.gold || 0),
            silver: (currentCurrency.silver || 0) + (data.rewards.currency.silver || 0),
            copper: (currentCurrency.copper || 0) + (data.rewards.currency.copper || 0)
          });
        }

        // Add items to inventory
        if (data.rewards?.items && data.rewards.items.length > 0) {
          data.rewards.items.forEach(item => {
            try {
              inventoryStore.addItemFromLibrary(item);
            } catch (err) {
              console.warn('Failed to add reward item:', err);
            }
          });
        }

        // Notify player
        addNotification('social', {
          sender: { name: data.deliveredBy || 'Game Master', class: 'gm', level: 0 },
          content: `Quest rewards received for "${data.questTitle}"!`,
          type: 'rewards_received',
          timestamp: data.timestamp
        });
      }).catch(error => {
        console.error('Failed to handle rewards_received:', error);
      });
    });

    // Handle GM confirmation that rewards were delivered
    socket.on('rewards_delivery_confirmed', (data) => {
      if (!isGMRef.current) return;

      import('../../store/questStore').then(({ default: useQuestStore }) => {
        const { confirmRewardDelivery } = useQuestStore.getState();
        confirmRewardDelivery(data.questId, data.playerId);

        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Rewards delivered to ${data.playerName}.`,
          type: 'system',
          timestamp: data.timestamp
        });
      }).catch(error => {
        console.error('Failed to handle rewards_delivery_confirmed:', error);
      });
    });

    // Handle player receiving completion denial
    socket.on('completion_denied', (data) => {
      if (isGMRef.current) return;

      addNotification('social', {
        sender: { name: 'Game Master', class: 'gm', level: 0 },
        content: `Quest completion for "${data.questTitle}" was denied: ${data.reason || 'No reason provided'}`,
        type: 'completion_denied',
        timestamp: data.timestamp
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
              const authStore = require('../../store/authStore').default;
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
      // Cleanup socket event listeners
      socket.off('connect');
      socket.off('disconnect');
      socket.off('player_joined');
      socket.off('player_count_updated');
      socket.off('party_member_added');
      socket.off('player_left');
      socket.off('room_closed');
      socket.off('chat_message');
      socket.off('token_moved');
      socket.off('item_dropped');
      socket.off('token_created');
      socket.off('item_looted');
      socket.off('sync_grid_items');
      socket.off('sync_tokens');
      socket.off('sync_character_tokens');
      socket.off('character_equipment_updated');
      socket.off('player_color_updated');
      socket.off('character_token_created');
      socket.off('character_moved');
      socket.off('combat_action');
      socket.off('combat_correction');
      socket.off('combat_state_sync');
      socket.off('combat_started');
      socket.off('combat_ended');
      socket.off('combat_turn_changed');
      socket.off('spell_cast'); // IMPROVEMENT: Clean up spell cast handler
      socket.off('ability_used'); // IMPROVEMENT: Clean up ability use handler
      socket.off('dice_rolled'); // IMPROVEMENT: Clean up dice roll handler
      socket.off('dice_update'); // IMPROVEMENT: Clean up dice update handler
      socket.off('item_update'); // IMPROVEMENT: Clean up item update handler
      socket.off('inventory_update'); // IMPROVEMENT: Clean up inventory update handler
      socket.off('map_updated'); // IMPROVEMENT: Clean up map update handler
      socket.off('party_update'); // IMPROVEMENT: Clean up party update handler
      socket.off('window_update'); // IMPROVEMENT: Clean up window update handler
      socket.off('container_update'); // IMPROVEMENT: Clean up container update handler
      socket.off('cursor_update'); // IMPROVEMENT: Clean up cursor update handler
      socket.off('area_remove'); // IMPROVEMENT: Clean up area remove handler
      socket.off('full_game_state_sync');
      socket.off('global_chat_message');
      socket.off('character_updated');
      socket.off('token_updated');
      socket.off('sync_error');
      socket.off('connect_error');
      socket.off('reconnect');
      socket.off('gm_action'); // GM actions (XP, rests) listener cleanup
      // Quest sharing socket cleanup
      socket.off('quest_shared');
      socket.off('quest_share_confirmed');
      socket.off('quest_accepted_notification');
      socket.off('quest_declined_notification');
      socket.off('quest_completion_pending');
      socket.off('quest_completion_request_sent');
      socket.off('rewards_received');
      socket.off('rewards_delivery_confirmed');
      socket.off('completion_denied');
    };
  }, [socket]); // Reduced dependencies to prevent excessive re-runs

  const handleJoinRoom = async (room, socketConnection, isGameMaster, playerObject, password, levelEditorState, gridSettings) => {
    // Clear all stores before joining a new room to ensure a clean slate
    clearAllMultiplayerStores();

    setIsJoiningRoom(true);
    setConnectionStatus('connecting');

    // Show joining notification
    addNotificationRef.current('social', {
      sender: { name: 'System', class: 'system', level: 0 },
      content: `Joining room: ${room.name}...`,
      type: 'system',
      timestamp: new Date().toISOString()
    });

    // ===== APPLY INITIAL LEVEL EDITOR STATE FOR NON-GM PLAYERS =====
    // This ensures players joining a room see terrain, hex grid, walls, etc.
    if (!isGameMaster && (levelEditorState || gridSettings)) {
      window._isReceivingMapUpdate = true;
      try {
        // Apply level editor state
        if (levelEditorState) {
          const levelEditorStore = useLevelEditorStore.getState();

          if (levelEditorState.terrainData !== undefined) {
            levelEditorStore.setTerrainData(levelEditorState.terrainData);
          }
          if (levelEditorState.wallData !== undefined) {
            levelEditorStore.setWallData(levelEditorState.wallData);
          }
          if (levelEditorState.environmentalObjects !== undefined) {
            levelEditorStore.setEnvironmentalObjects(levelEditorState.environmentalObjects);
          }
          if (levelEditorState.drawingPaths !== undefined) {
            levelEditorStore.setDrawingPaths(levelEditorState.drawingPaths);
          }
          if (levelEditorState.drawingLayers !== undefined) {
            levelEditorStore.setDrawingLayers(levelEditorState.drawingLayers);
          }
          if (levelEditorState.fogOfWarData !== undefined) {
            levelEditorStore.setFogOfWarData(levelEditorState.fogOfWarData);
          }
          if (levelEditorState.exploredAreas !== undefined) {
            levelEditorStore.setExploredAreas(levelEditorState.exploredAreas);
          }
          if (levelEditorState.lightSources !== undefined) {
            levelEditorStore.setLightSources(levelEditorState.lightSources);
          }
          if (levelEditorState.dynamicFogEnabled !== undefined) {
            levelEditorStore.setDynamicFogEnabled(levelEditorState.dynamicFogEnabled);
          }
          if (levelEditorState.respectLineOfSight !== undefined) {
            levelEditorStore.setRespectLineOfSight(levelEditorState.respectLineOfSight);
          }
          if (levelEditorState.dndElements !== undefined) {
            levelEditorStore.setDndElements(levelEditorState.dndElements);
          }

          console.log('✅ Initial level editor state applied');
        }

        // Apply grid settings
        if (gridSettings) {
          const gameStore = useGameStore.getState();

          if (gridSettings.gridType !== undefined) {
            gameStore.setGridType(gridSettings.gridType);
            console.log('🔷 Initial grid type set to:', gridSettings.gridType);
          }
          if (gridSettings.gridSize !== undefined) {
            gameStore.setGridSize(gridSettings.gridSize);
          }
          if (gridSettings.gridOffsetX !== undefined && gridSettings.gridOffsetY !== undefined) {
            gameStore.setGridOffset(gridSettings.gridOffsetX, gridSettings.gridOffsetY);
          }
          if (gridSettings.gridLineColor !== undefined) {
            gameStore.setGridLineColor(gridSettings.gridLineColor);
          }
          if (gridSettings.gridLineThickness !== undefined) {
            gameStore.setGridLineThickness(gridSettings.gridLineThickness);
          }
          if (gridSettings.gridLineOpacity !== undefined) {
            gameStore.setGridLineOpacity(gridSettings.gridLineOpacity);
          }
          if (gridSettings.gridBackgroundColor !== undefined) {
            gameStore.setGridBackgroundColor(gridSettings.gridBackgroundColor);
          }

          console.log('✅ Initial grid settings applied');
        }
      } catch (error) {
        console.error('❌ Failed to apply initial level editor state:', error);
      } finally {
        window._isReceivingMapUpdate = false;
      }
    }

    let currentPlayerData;

    try {
      setCurrentRoom(room);
      setSocket(socketConnection);
      setIsGM(isGameMaster);
      roomPasswordRef.current = password || '';

      // Sync socket to presenceStore in handleJoinRoom
      try {
        import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
          usePresenceStore.getState().setSocket(socketConnection);
        });
      } catch (e) {
        console.warn('Could not sync socket to presenceStore in handleJoinRoom:', e);
      }

      // Disable editor mode for test rooms (test rooms are not world builder mode)
      const isTestRoom = localStorage.getItem('isTestRoom') === 'true';
      if (isTestRoom) {
        localStorage.removeItem('isWorldBuilderMode');
        import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          if (levelEditorStore.isEditorMode) {
            levelEditorStore.setEditorMode(false);
          }
        });
      }

      // Set current player info - use explicit playerObject from server if available
      const activeCharacter = getActiveCharacter();

      console.log('🆔 handleJoinRoom - Setting up current player:', {
        playerObject,
        playerObjectId: playerObject?.id,
        playerObjectName: playerObject?.name,
        activeCharacterName: activeCharacter?.name,
        isGameMaster
      });

      if (playerObject) {
        currentPlayerData = {
          ...playerObject,
          name: activeCharacter?.name || playerObject.character?.name || playerObject.name,
          isGM: isGameMaster
        };
      } else if (isGameMaster) {
        // Fallback for GM if playerObject is somehow missing
        currentPlayerData = {
          ...room.gm,
          name: activeCharacter?.name || room.gm?.character?.name || room.gm?.name || 'Game Master',
          isGM: true
        };
      } else {
        // Fallback for regular player - less reliable
        let playersList = [];
        if (Array.isArray(room.players)) {
          playersList = room.players;
        } else if (room.players instanceof Map) {
          playersList = Array.from(room.players.values());
        } else if (room.players && typeof room.players === 'object') {
          playersList = Object.values(room.players);
        }

        const lastPlayer = playersList.length > 0 ? playersList[playersList.length - 1] : { name: 'Player' };
        currentPlayerData = {
          ...lastPlayer,
          name: activeCharacter?.name || lastPlayer.character?.name || lastPlayer.name,
          isGM: false
        };
      }

      setCurrentPlayer(currentPlayerData);
      window.currentPlayerId = currentPlayerData?.id;


      // Set initial player count
      let initialCount = 0;
      if (Array.isArray(room.players)) {
        initialCount = room.players.length;
      } else if (room.players instanceof Map) {
        initialCount = room.players.size;
      } else if (room.players && typeof room.players === 'object') {
        initialCount = Object.keys(room.players).length;
      }
      setActualPlayerCount(initialCount + 1); // Total including GM

      // Add player to Firebase room members for persistence (if authenticated)
      try {
        // Check if auth store is available (might not be in all environments)
        if (typeof useAuthStore !== 'undefined') {
          const { user } = useAuthStore.getState();
          if (user && room.persistentRoomId) {
            // For guest users, save joined room to localStorage instead of Firebase
            if (user.isGuest) {
              const guestRoomData = {
                id: room.persistentRoomId,
                name: room.name,
                description: room.description || '',
                password: room.password || '',
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                userRole: 'player',
                isMultiplayer: true
              };
              localStorage.setItem('mythrill-guest-joined-room', JSON.stringify(guestRoomData));
              localStorage.setItem('roomDataChanged', 'true');
              localStorage.setItem('lastJoinedRoom', room.persistentRoomId);
            } else {
              // Regular authenticated user - save to Firebase
              const { joinRoom } = await import('../../services/roomService');
              await joinRoom(room.persistentRoomId, user.uid, room.password || '');

              // Set a flag to indicate that room data should be refreshed when returning to account
              localStorage.setItem('roomDataChanged', 'true');
              localStorage.setItem('lastJoinedRoom', room.persistentRoomId);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to add player to persistent room:', error);
        // Don't fail the room join if Firebase persistence fails
      }
    } catch (error) {
      console.error('Error in handleJoinRoom initialization:', error);
      setIsJoiningRoom(false);
      setConnectionStatus('error');
      setError(`Failed to initialize room connection: ${error.message || 'Unknown error'}`);
      return; // Exit early if there's an error
    }

    // Load active character data when joining multiplayer room
    try {
      let activeCharacter = getActiveCharacter();

      // Update currentPlayerData with character name if we have it
      if (activeCharacter && currentPlayerData) {
        currentPlayerData = {
          ...currentPlayerData,
          name: activeCharacter.name || currentPlayerData.name
        };
        setCurrentPlayer(currentPlayerData);
        window.currentPlayerId = currentPlayerData?.id;

      }

      // If no active character is loaded, try to load from storage
      if (!activeCharacter) {
        activeCharacter = await loadActiveCharacter();
      }

      // If still no active character, show a warning but ALLOW joining
      // Players can now join without an active character and set one up later
      const { user } = useAuthStore.getState();
      const isGuest = user?.isGuest || false;

      if (!activeCharacter && !isGuest && !isGameMaster) {
        // Show a warning but don't block joining
        const { characters } = useCharacterStore.getState();
        if (characters && characters.length > 0) {
          console.warn('⚠️ No active character selected. Player can select one later.');
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `You joined without an active character. Go to Account > Characters to select one for the full experience.`,
            type: 'system',
            timestamp: new Date().toISOString()
          });
        } else {
          console.warn('⚠️ No characters available. Player can create one later.');
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `You joined without a character. Go to Account > Characters to create one.`,
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }
        // Continue joining - don't return/block
      }

      // Start character session for tracking changes during multiplayer
      try {
        if (activeCharacter && !isGuest) {
          await startCharacterSession(activeCharacter.id, room.id);
        }
      } catch (sessionError) {
        // Continue with multiplayer even if session tracking fails
      }

      // Set room name for multiplayer context (this will format the display name)
      setRoomName(room.name);

      // CRITICAL FIX: Ensure character is fully loaded before syncing inventory
      // Try to refresh from Firebase first to get the latest data including inventory
      let characterToUse = activeCharacter;

      if (activeCharacter) {
        try {
          // Try to refresh character from Firebase to get latest inventory
          const { loadCharacters } = useCharacterStore.getState();
          await loadCharacters(); // Refresh characters from Firebase

          // Get updated character from store after refresh
          const { characters } = useCharacterStore.getState();
          const refreshedCharacter = characters.find(c => c.id === activeCharacter.id);

          if (refreshedCharacter && refreshedCharacter.inventory) {
            characterToUse = refreshedCharacter;
          } else {
            // Fallback to store character
            const { loadCharacter } = useCharacterStore.getState();
            const storeCharacter = loadCharacter(activeCharacter.id);
            if (storeCharacter && storeCharacter.inventory) {
              characterToUse = storeCharacter;
            } else {
              console.warn('⚠️ Character does not have inventory saved. This may be a new character or inventory was not saved during creation.');
              characterToUse = activeCharacter;
            }
          }
        } catch (error) {
          console.warn('⚠️ Could not refresh character from Firebase, using store:', error);
          // Fallback to store character
          const { loadCharacter } = useCharacterStore.getState();
          const storeCharacter = loadCharacter(activeCharacter.id);
          if (storeCharacter && storeCharacter.inventory) {
            characterToUse = storeCharacter;
          }
        }
      }

      // Sync character inventory with inventory store
      // Sync character inventory with inventory store
      if (characterToUse) {
        try {
          import('../../store/inventoryStore').then(({ default: useInventoryStore }) => {
            const inventoryStore = useInventoryStore.getState();

            // Load character's inventory into the inventory store
            // Ensure inventory exists, default to empty if not present
            const characterInventory = characterToUse.inventory || {
              items: [],
              currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
              encumbranceState: 'normal'
            };

            // Clear current inventory
            inventoryStore.clearInventory();

            // Load character's items
            if (characterInventory.items && Array.isArray(characterInventory.items)) {
              characterInventory.items.forEach(item => {
                try {
                  inventoryStore.addItem(item);
                } catch (itemError) {
                  console.warn('Failed to add item to inventory:', itemError, item);
                }
              });
            } else {
              console.warn('⚠️ Character inventory items is not an array:', characterInventory.items);
            }

            // Load character's currency
            if (characterInventory.currency) {
              inventoryStore.updateCurrency(characterInventory.currency);
            }
          });
        } catch (inventoryError) {
          console.warn('Failed to sync character inventory:', inventoryError);
        }
      }

      // Send character data to server for synchronization
      if (socketConnection && socketConnection.connected && activeCharacter) {
        // Get userId from auth store for Firebase persistence
        let userId = null;
        try {
          const authStore = require('../../store/authStore').default;
          const authState = authStore.getState();
          userId = authState.user?.uid || null;
        } catch (error) {
          console.warn('Could not get userId from auth store:', error);
        }

        socketConnection.emit('character_updated', {
          characterId: activeCharacter.id,
          userId: userId, // CRITICAL FIX: Include userId for Firebase character document saving
          character: {
            name: activeCharacter.name,
            class: activeCharacter.class,
            race: activeCharacter.race,
            subrace: activeCharacter.subrace,
            raceDisplayName: activeCharacter.raceDisplayName || '',
            background: activeCharacter.background || '',
            backgroundDisplayName: backgroundDisplayName || activeCharacter.backgroundDisplayName || '',
            path: activeCharacter.path || '',
            pathDisplayName: pathDisplayName || activeCharacter.pathDisplayName || '',
            level: activeCharacter.level,
            stats: activeCharacter.stats,
            health: activeCharacter.health,
            mana: activeCharacter.mana,
            actionPoints: activeCharacter.actionPoints,
            equipment: activeCharacter.equipment,
            inventory: activeCharacter.inventory || { items: [], currency: { platinum: 0, gold: 0, silver: 0, copper: 0 } },
            experience: activeCharacter.experience,
            exhaustionLevel: activeCharacter.exhaustionLevel,
            classResource: activeCharacter.classResource || { current: 0, max: 0 }, // Include class resource
            tokenSettings: activeCharacter.tokenSettings, // Include token settings
            lore: activeCharacter.lore, // Include lore (which contains characterImage)
            playerId: currentPlayerData?.id
          }
        });
      }
    } catch (error) {
      console.error('Error loading active character for multiplayer:', error);
      // Fall back to updating character name to match player name
      if (currentPlayerData?.name) {
        updateCharacterInfo('name', currentPlayerData.name);
      }
    }

    try {
      // Simple: Room creator = GM, others = players
      setGMMode(isGameMaster);

      // Create/update party with multiplayer players
      // Include GM and all regular players
      const allPlayers = [room.gm];

      // Handle different room.players formats (Map, Array, or Object)
      if (room.players) {
        if (room.players instanceof Map) {
          allPlayers.push(...Array.from(room.players.values()));
        } else if (Array.isArray(room.players)) {
          allPlayers.push(...room.players);
        } else if (typeof room.players === 'object') {
          allPlayers.push(...Object.values(room.players));
        }
      }

      // Remove duplicates based on player ID and exclude current player from connected list
      const uniquePlayers = allPlayers.filter((player, index, self) =>
        index === self.findIndex(p => p.id === player.id) && player.id !== currentPlayerData?.id
      );

      setConnectedPlayers(uniquePlayers);

      // Set initial player count (GM + regular players)
      // Note: room.players is an Array from server (Array.from()), so use .length not .size
      // If I am the creator/GM, I might not be in the players list yet, or I count as +1
      // If I am a player joining, I am already accounted for in the server's update or will be +1.
      // Better to rely on "GM + players.length" logic safely.
      // Set initial player count - server already includes GM in the count
      // Use room.playerCount directly when available (most reliable)
      // Fallback: count unique players + 1 (ourselves)
      const fallbackCount = (uniquePlayers ? uniquePlayers.length : 0) + 1;
      setActualPlayerCount(room.playerCount || fallbackCount);

      // Integrate multiplayer players into party system
      // Get active character data for current player
      const activeCharacter = getActiveCharacter();
      // CRITICAL FIX: Use character name if available, otherwise use display name from join data (currentPlayerData)
      // This ensures players joining without characters (GUESTS) get the name they entered in the lobby
      // Priority: Active Character Name -> Join Data Name -> Fallback
      const currentPlayerCharacterName = activeCharacter?.name || currentPlayerData?.name || 'Unknown Player';

      // Get character store state for display names (more reliable than stored character)
      const characterStore = useCharacterStore.getState();

      // Resolve background display name
      let backgroundDisplayName = characterStore.backgroundDisplayName || activeCharacter?.backgroundDisplayName || '';
      if (!backgroundDisplayName && (characterStore.background || activeCharacter?.background)) {
        const bgId = characterStore.background || activeCharacter?.background;
        const bgData = getBackgroundData(bgId);
        if (bgData) {
          backgroundDisplayName = bgData.name;
        } else {
          const customBgData = getCustomBackgroundData(bgId?.toLowerCase());
          if (customBgData) {
            backgroundDisplayName = customBgData.name;
          }
        }
      }

      // Resolve path display name
      let pathDisplayName = characterStore.pathDisplayName || activeCharacter?.pathDisplayName || '';
      if (!pathDisplayName && (characterStore.path || activeCharacter?.path)) {
        const pathId = characterStore.path || activeCharacter?.path;
        const pathData = getEnhancedPathData(pathId);
        if (pathData) {
          pathDisplayName = pathData.name;
        }
      }

      // Removed: Unused variable

      // Create party with current player's character name (not user name)
      // Note: createParty automatically adds the current player, so we don't need to add them again
      createParty(room.name, currentPlayerCharacterName, isGameMaster);

      // CRITICAL FIX: Ensure initial leader is set for the party
      // This ensures the crown icon is visible on the GM's HUD
      import('../../store/partyStore').then(({ default: usePartyStore }) => {
        if (isGameMaster) {
          // If I am the creator/GM, I am the leader
          usePartyStore.getState().setLeader('current-player', true);
        } else if (room.gm) {
          // If I am a player joining, set the leader to the GM if they are defined
          usePartyStore.getState().setLeader(room.gm.id, true);
        }
      }).catch(err => console.error('Failed to set initial party leader:', err));

      // Update the current player that was automatically added by createParty with full character data
      const currentPlayerMember = {
        id: 'current-player',
        name: currentPlayerCharacterName,
        isGM: isGameMaster, // Include GM status for current player
        character: {
          class: activeCharacter?.class || characterStore.class || 'Unknown',
          level: activeCharacter?.level || characterStore.level || 1,
          health: activeCharacter?.health || characterStore.health || { current: 45, max: 50 },
          mana: activeCharacter?.mana || characterStore.mana || { current: 45, max: 50 },
          actionPoints: activeCharacter?.actionPoints || characterStore.actionPoints || { current: 1, max: 3 },
          race: activeCharacter?.race || characterStore.race || 'Unknown',
          raceDisplayName: activeCharacter?.raceDisplayName || characterStore.raceDisplayName || 'Unknown',
          background: activeCharacter?.background || characterStore.background || '',
          backgroundDisplayName: backgroundDisplayName,
          path: activeCharacter?.path || characterStore.path || '',
          pathDisplayName: pathDisplayName,
          tokenSettings: activeCharacter?.tokenSettings || characterStore.tokenSettings || {}, // Include token settings, default to empty object
          lore: activeCharacter?.lore || characterStore.lore || {} // Include lore (which contains characterImage), default to empty object
        }
      };

      // CRITICAL FIX: Ensure current player member has correct isGM status
      currentPlayerMember.isGM = isGameMaster;

      // Update the existing current player instead of adding a duplicate
      updatePartyMember('current-player', currentPlayerMember);

      // Broadcast current player's party member data to other players
      if (socketConnection) {
        socketConnection.emit('party_member_added', {
          member: currentPlayerMember
        });
      }

      // Add current player to chat system
      addUser({
        id: currentPlayerData?.id,
        name: currentPlayerCharacterName,
        class: activeCharacter?.class || 'Unknown',
        level: activeCharacter?.level || 1,
        status: 'online'
      });

      // Add GM to party if GM is not the current player
      if (room.gm && room.gm.id !== currentPlayerData?.id) {
        // CRITICAL FIX: Use character name if available, otherwise fall back to GM name
        // Get active character for GM if available
        const gmActiveCharacter = room.gm.character;
        const gmCharacterName = gmActiveCharacter?.name || room.gm.name;

        addPartyMember({
          id: room.gm.id,
          name: gmCharacterName,
          isGM: true, // Mark as GM
          character: {
            class: room.gm.character?.class || 'Unknown',
            level: room.gm.character?.level || 1,
            health: room.gm.character?.health || { current: 45, max: 50 },
            mana: room.gm.character?.mana || { current: 45, max: 50 },
            actionPoints: room.gm.character?.actionPoints || { current: 1, max: 3 },
            race: room.gm.character?.race || 'Unknown',
            subrace: room.gm.character?.subrace || '',
            raceDisplayName: room.gm.character?.raceDisplayName || 'Unknown',
            background: room.gm.character?.background || '',
            backgroundDisplayName: room.gm.character?.backgroundDisplayName || '',
            path: room.gm.character?.path || '',
            pathDisplayName: room.gm.character?.pathDisplayName || '',
            classResource: room.gm.character?.classResource || { current: 0, max: 0 }, // Include class resource
            tokenSettings: room.gm.character?.tokenSettings || {}, // Include token settings, default to empty object
            lore: room.gm.character?.lore || {} // Include lore (which contains characterImage), default to empty object
          }
        });

        addUser({
          id: room.gm.id,
          name: gmCharacterName,
          class: room.gm.character?.class || 'Unknown',
          level: room.gm.character?.level || 1,
          status: 'online'
        });
      }

      // Add other players to party and chat (only non-current players)
      // Note: room.players is an Array from server, not a Map
      if (room.players && room.players.length > 0) {
        room.players.forEach(player => {
          const isCurrentPlayer = player.id === currentPlayerData?.id;

          if (!isCurrentPlayer) {
            const playerCharacterName = player.character?.name || player.name;

            const playerMember = {
              id: player.id,
              name: playerCharacterName,
              isGM: player.isGM || false, // Check if player is GM (for GM reconnecting)
              character: {
                class: player.character?.class || 'Unknown',
                level: player.character?.level || 1,
                health: player.character?.health || { current: 45, max: 50 },
                mana: player.character?.mana || { current: 45, max: 50 },
                actionPoints: player.character?.actionPoints || { current: 1, max: 3 },
                race: player.character?.race || 'Unknown',
                subrace: player.character?.subrace || '',
                raceDisplayName: player.character?.raceDisplayName || 'Unknown',
                background: player.character?.background || '',
                backgroundDisplayName: player.character?.backgroundDisplayName || '',
                path: player.character?.path || '',
                pathDisplayName: player.character?.pathDisplayName || '',
                classResource: player.character?.classResource || { current: 0, max: 0 }, // Include class resource
                tokenSettings: player.character?.tokenSettings || {}, // Include token settings, default to empty object
                lore: player.character?.lore || {} // Include lore (which contains characterImage), default to empty object
              }
            };

            addPartyMember(playerMember);

            addUser({
              id: player.id,
              name: playerCharacterName,
              class: player.character?.class || 'Unknown',
              level: player.character?.level || 1,
              status: 'online'
            });
          }
        });
      }

      // Simple: Room creator is GM, others are players (no leadership transfer needed)

      // Set multiplayer state in game store with socket
      setMultiplayerState(true, room, handleReturnToSinglePlayer, socketConnection, currentPlayerData);

      // Set up chat integration for multiplayer
      const sendChatMessage = (message) => {
        if (socketConnection && socketConnection.connected) {
          // Get current player data for the message
          const activeCharacter = getActiveCharacter();
          const currentPlayerCharacterName = activeCharacter?.name || currentPlayerData?.name || 'Unknown Player';

          socketConnection.emit('chat_message', {
            message: message,
            type: 'party' // Explicitly set as party chat
          });
        } else {
          console.error('No socket connection for chat or socket disconnected');
          // Show error to user
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: 'Cannot send message: disconnected from server',
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }
      };
      setMultiplayerIntegration(socketConnection, sendChatMessage);

      // Set up dialogue system for multiplayer
      setMultiplayerSocket(socketConnection, true, currentPlayerData?.id);

      // Initialize game state manager for persistent room state
      if (room.persistentRoomId || room.id) {
        // DISABLED: Game state loading causes old tokens to appear in fresh rooms
        // Skip game state loading to prevent old tokens in fresh rooms
      }

      // Show successful join notification
      setIsJoiningRoom(false);
      setConnectionStatus('connected');

      // Welcome notification
      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `🎉 Welcome to ${room.name}! You have joined as ${isGameMaster ? 'Game Master' : 'Player'}. The adventure awaits!`,
        type: 'system',
        timestamp: new Date().toISOString()
      });

      // Additional helpful notification for new players
      if (!isGameMaster) {
        setTimeout(() => {
          addNotificationRef.current('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: '💡 Tip: Use the chat to communicate with your party. Press Enter to send messages.',
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error in handleJoinRoom:', error);
      setIsJoiningRoom(false);
      setConnectionStatus('error');

      // Show user-friendly error message
      const errorMessage = error.message?.includes('character')
        ? error.message
        : 'Failed to join room. Please try again.';

      setError(errorMessage);

      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Failed to join room: ${errorMessage}`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleLeaveRoom = async () => {
    // Immediately update UI state for instant response
    setCurrentRoom(null);
    setCurrentPlayer(null);
    window.currentPlayerId = null;

    setIsGM(false);
    setConnectedPlayers([]);

    // Clear multiplayer players from chat system immediately
    connectedPlayers.forEach(player => {
      removeUser(player.id);
    });

    // Clear chat multiplayer integration
    clearMultiplayerIntegration();

    // Reset to single player GM mode immediately
    setGMMode(true);
    setMultiplayerState(false, null, null);

    // Perform cleanup operations in background (non-blocking)
    try {
      // End character session to save all changes (async, non-blocking)
      const activeCharacter = getActiveCharacter();
      if (activeCharacter) {
        // Don't await - let it complete in background
        endCharacterSession(activeCharacter.id).then((sessionEnded) => {
          if (!sessionEnded) {
            console.warn('⚠️ Failed to end character session properly');
          }
        }).catch((error) => {
          console.error('Error ending character session:', error);
        });
      }

      // Cleanup game state manager (async, non-blocking)
      gameStateManager.cleanup().catch((error) => {
        console.error('❌ Error cleaning up game state manager:', error);
      });

      // Disconnect socket immediately
      if (socket) {
        socket.emit('leave_room');
        socket.disconnect();
        // Set socket to null immediately for instant UI response
        setSocket(null);
      }
    } catch (error) {
      console.error('Error in background cleanup:', error);
    }
  };

  const handleReturnToSinglePlayer = () => {
    // Start cleanup process (non-blocking)
    handleLeaveRoom();

    // CRITICAL FIX: Properly navigate to landing page using React Router
    // Use navigate from useNavigate hook (already imported)
    setTimeout(() => {
      // Navigate to landing page and clear room code from URL
      navigate('/', { replace: true });
    }, 100);
  };

  // If not in a room, show the lobby
  if (!currentRoom) {
    return (
      <RoomLobby
        socket={socket}
        onJoinRoom={handleJoinRoom}
        onReturnToLanding={onReturnToSinglePlayer}
      />
    );
  }

  // Clean VTT interface with integrated multiplayer
  return (
    <RoomProvider>
      <MultiplayerGameContent
        currentRoom={currentRoom}
        handleReturnToSinglePlayer={handleReturnToSinglePlayer}
        connectionStatus={connectionStatus}
        isJoiningRoom={isJoiningRoom}
        isGMMode={isGMMode}
        gridSize={gridSize}
        gridOffsetX={gridOffsetX}
        gridOffsetY={gridOffsetY}
        isGM={isGM}
        isInMultiplayer={isInMultiplayer}
        socket={socket}
        addNotification={addNotification}
        pendingGameSessionInvitations={pendingGameSessionInvitations}
        handleAcceptGameSession={handleAcceptGameSession}
        handleDeclineGameSession={handleDeclineGameSession}
        actualPlayerCount={actualPlayerCount}
      />
    </RoomProvider>
  );
};

// Separate component that can use room context
const MultiplayerGameContent = ({
  currentRoom,
  handleReturnToSinglePlayer,
  connectionStatus,
  isJoiningRoom,
  isGMMode,
  isInMultiplayer,
  gridSize,
  gridOffsetX,
  gridOffsetY,
  isGM,
  socket,
  addNotification,
  pendingGameSessionInvitations,
  handleAcceptGameSession,
  handleDeclineGameSession,
  actualPlayerCount
}) => {
  const { enterMultiplayerRoom, exitRoom } = useRoomContext();

  // Quest sharing state from store
  const {
    activeSharedQuest,
    activeRewardDelivery,
    acceptSharedQuest,
    declineSharedQuest,
    confirmRewardDelivery,
    denyRewardDelivery
  } = useQuestStore(state => ({
    activeSharedQuest: state.activeSharedQuest,
    activeRewardDelivery: state.activeRewardDelivery,
    acceptSharedQuest: state.acceptSharedQuest,
    declineSharedQuest: state.declineSharedQuest,
    confirmRewardDelivery: state.confirmRewardDelivery,
    denyRewardDelivery: state.denyRewardDelivery
  }));

  // Update room context when currentRoom changes
  // CRITICAL FIX: Use useMemo to prevent excessive re-renders
  const roomId = useMemo(() => {
    return currentRoom ? (currentRoom.persistentRoomId || currentRoom.id) : null;
  }, [currentRoom?.persistentRoomId, currentRoom?.id]);

  useEffect(() => {
    if (roomId) {
      enterMultiplayerRoom(roomId, currentRoom);
    } else {
      exitRoom();
    }
  }, [roomId, enterMultiplayerRoom, exitRoom, currentRoom]);

  // Handle quest acceptance
  const handleAcceptQuest = useCallback((questId) => {
    acceptSharedQuest(questId);

    // Notify server
    if (socket && socket.connected) {
      const quest = activeSharedQuest;
      socket.emit('quest_accepted', {
        questId: questId,
        questTitle: quest?.title || 'Unknown Quest'
      });
    }
  }, [acceptSharedQuest, socket, activeSharedQuest]);

  // Handle quest decline
  const handleDeclineQuest = useCallback((questId) => {
    const quest = activeSharedQuest;
    declineSharedQuest(questId);

    // Notify server
    if (socket && socket.connected) {
      socket.emit('quest_declined', {
        questId: questId,
        questTitle: quest?.title || 'Unknown Quest'
      });
    }
  }, [declineSharedQuest, socket, activeSharedQuest]);

  // Handle reward delivery (GM)
  const handleDeliverRewards = useCallback((questId, playerId, rewards) => {
    const delivery = activeRewardDelivery;
    confirmRewardDelivery(questId, playerId);

    // Notify server to deliver rewards
    if (socket && socket.connected) {
      socket.emit('quest_rewards_delivered', {
        questId: questId,
        questTitle: delivery?.quest?.title || 'Unknown Quest',
        playerId: playerId,
        playerName: delivery?.playerName || 'Unknown Player',
        rewards: rewards
      });
    }
  }, [confirmRewardDelivery, socket, activeRewardDelivery]);

  // Handle deny completion (GM)
  const handleDenyCompletion = useCallback((questId, playerId) => {
    const delivery = activeRewardDelivery;
    denyRewardDelivery(questId, playerId);

    // Notify server
    if (socket && socket.connected) {
      socket.emit('quest_completion_denied', {
        questId: questId,
        questTitle: delivery?.quest?.title || 'Unknown Quest',
        playerId: playerId,
        playerName: delivery?.playerName || 'Unknown Player'
      });
    }
  }, [denyRewardDelivery, socket, activeRewardDelivery]);

  if (!currentRoom) {
    return null;
  }

  // Note: We now use the actualPlayerCount prop passed from the parent which tracks server updates
  // const actualPlayerCount = (currentRoom.players ? currentRoom.players.length : 0) + 1; 

  return (
    <div className="multiplayer-vtt">
      {/* Full VTT Interface */}
      <div className="vtt-game-screen">
        <Grid />
        <GridItemsManager />
        <HUDContainer />
        <ActionBar />
        <CombatSelectionWindow />
        <CombatTimeline />
        <FloatingCombatTextManager />
        {/* Disable expensive background managers in player mode for performance */}
        {isGMMode && <DynamicFogManager />}
        {isGMMode && <DynamicLightingManager />}
        {isGMMode && <AtmosphericEffectsManager />}
        {/* Memory system runs in both modes - tracks exploration when viewingFromToken is set */}
        <MemorySnapshotManager isGMMode={isGMMode} gridSize={gridSize} gridOffsetX={gridOffsetX} gridOffsetY={gridOffsetY} />
        <DialogueSystem />
        {isGMMode && <DialogueControls />}
        <DiceRollingSystem />
        <Navigation onReturnToLanding={handleReturnToSinglePlayer} />

        {/* Connection Status Indicator */}
        <ConnectionStatusIndicator
          status={connectionStatus}
          isJoiningRoom={isJoiningRoom}
          playerCount={actualPlayerCount}
        />
      </div>

      {/* Multiplayer indicator removed - use ESC key in navigation bar to leave room */}

      {/* Game Session Invitations */}
      {pendingGameSessionInvitations.map((invitation) => (
        <GameSessionInvitation
          key={invitation.id}
          invitation={invitation}
          onAccept={handleAcceptGameSession}
          onDecline={handleDeclineGameSession}
        />
      ))}

      {/* Quest Share Dialog - shown to players when GM shares a quest */}
      {!isGMMode && activeSharedQuest && (
        <QuestShareDialog
          quest={activeSharedQuest}
          giverInfo={activeSharedQuest.sharedBy}
          onAccept={handleAcceptQuest}
          onDecline={handleDeclineQuest}
          isVisible={true}
        />
      )}

      {/* Quest Reward Delivery Dialog - shown to GM when player requests completion */}
      {isGMMode && activeRewardDelivery && (
        <QuestRewardDeliveryDialog
          quest={activeRewardDelivery.quest}
          playerName={activeRewardDelivery.playerName}
          playerId={activeRewardDelivery.playerId}
          onDeliverRewards={handleDeliverRewards}
          onDenyCompletion={handleDenyCompletion}
          isVisible={true}
        />
      )}

      {/* Cursor Tracking - show other players' cursors in real-time */}
      {isInMultiplayer && <CursorTracker socket={socket} />}
    </div>
  );
};

export default MultiplayerApp;
