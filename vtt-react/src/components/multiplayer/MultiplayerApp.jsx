import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import RoomLobby from './RoomLobby';
import LocalhostMultiplayerSimulator from './LocalhostMultiplayerSimulator';
import GameSessionInvitation from './GameSessionInvitation';
import CursorOverlay from './CursorOverlay';
// Removed: Debug utils - not used in production
import gameStateManager from '../../services/gameStateManager';
import optimisticUpdatesService from '../../services/optimisticUpdatesService';

import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useAuthStore from '../../store/authStore';
import useDialogueStore from '../../store/dialogueStore';
import useCombatStore from '../../store/combatStore';
import { showPlayerJoinNotification, showPlayerLeaveNotification } from '../../utils/playerNotifications';
import { RoomProvider, useRoomContext } from '../../contexts/RoomContext';
import { getBackgroundData } from '../../data/backgroundData';
import { getCustomBackgroundData } from '../../data/customBackgroundData';
import { getEnhancedPathData } from '../../data/enhancedPathData';
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
  const { setGMMode, setMultiplayerState, isGMMode, gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, zoomLevel, showCursorTracking, cursorUpdateThrottle } = useGameStore((state) => ({
    setGMMode: state.setGMMode,
    setMultiplayerState: state.setMultiplayerState,
    isGMMode: state.isGMMode,
    gridSize: state.gridSize,
    gridOffsetX: state.gridOffsetX,
    gridOffsetY: state.gridOffsetY,
    cameraX: state.cameraX,
    cameraY: state.cameraY,
    zoomLevel: state.zoomLevel,
    showCursorTracking: state.showCursorTracking,
    cursorUpdateThrottle: state.cursorUpdateThrottle
  }));
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
  const { updateTokenPosition: updateCreatureTokenPosition, addCreature, addToken } = useCreatureStore((state) => ({
    updateTokenPosition: state.updateTokenPosition,
    addCreature: state.addCreature,
    addToken: state.addToken
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
  const [otherPlayerCursors, setOtherPlayerCursors] = useState({});

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

  // Refs for values used in socket event handlers to prevent dependency issues
  const currentRoomRef = useRef(currentRoom);
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
  }, [currentRoom]);

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

  // Cursor tracking for multiplayer awareness
  useEffect(() => {
    if (!socket || !currentPlayer || !showCursorTracking) return;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - cursorThrottleRef.current < cursorUpdateThrottle) return;

      cursorThrottleRef.current = now;

      // Convert screen coordinates to world coordinates
      const rect = e.currentTarget.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Send cursor position
      socket.emit('cursor_update', {
        x: screenX,
        y: screenY,
        timestamp: now
      });
    };

    // Add mouse move listener to the main grid area
    const gridElement = document.querySelector('.grid-container');
    if (gridElement) {
      gridElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [socket, currentPlayer, showCursorTracking, cursorUpdateThrottle]);

  // Clean up old cursors
  useEffect(() => {
    const cleanup = () => {
      setOtherPlayerCursors(prev => {
        const now = Date.now();
        const cleaned = { ...prev };
        Object.keys(cleaned).forEach(playerId => {
          if (now - cleaned[playerId].lastUpdate > 5000) { // Remove after 5 seconds
            delete cleaned[playerId];
          }
        });
        return cleaned;
      });
    };

    const interval = setInterval(cleanup, 1000);
    return () => clearInterval(interval);
  }, []);

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
        const authStore = require('../../store/authStore').default;
        const authState = authStore.getState();
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

      // Removed enhanced multiplayer system - was causing conflicts

      // Enhanced connection event listeners with status feedback
      newSocket.on('connect', () => {
        setIsConnecting(false);
        // Don't set to 'connected' here - wait for room join to complete
        // setConnectionStatus('connected');

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
        // CRITICAL FIX: Set connection status to error so UI shows the error state
        setConnectionStatus('error');
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
      setConnectionStatus('disconnected');
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
      } else if (reason === 'transport close') {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: 'Connection lost. Attempting to reconnect...',
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Listen for player join/leave events
    socket.on('player_joined', (data) => {
      // Update actual player count from server
      setActualPlayerCount(data.playerCount);

      // Update connected players list - don't require currentRoom to be set yet
      setConnectedPlayers(prev => {
        // Check if player already exists to avoid duplicates
        const existingPlayer = prev.find(p => p.id === data.player.id);
        if (existingPlayer) {
          return prev;
        }

        // Don't add current player to connected players list (they're handled separately)
        if (currentPlayer && data.player.id === currentPlayer.id) {
          return prev;
        }

        const updated = [...prev, data.player];
        return updated;
      });

      // Show player join notification (only if currentRoom is set)
      if (currentRoom) {
        showPlayerJoinNotification(data.player.name, currentRoom.name);
      }


      // Use character name if available, otherwise fall back to player name
      const playerCharacterName = data.player.character?.name || data.player.name;

      // Skip adding ourselves to prevent duplicate HUDs - check both ID and name
      const isCurrentPlayer = data.player.id === currentPlayer?.id ||
        playerCharacterName === currentPlayer?.name ||
        data.player.name === currentPlayer?.name;

      if (!isCurrentPlayer) {

        // Calculate proper race display name from race and subrace data
        let raceDisplayName = data.player.character?.raceDisplayName || 'Unknown';

        // Add to party system with character data first
        // CRITICAL FIX: Ensure isGM is explicitly false for joining players (only room creator is GM)
        const newPartyMember = {
          id: data.player.id,
          name: playerCharacterName,
          isGM: false, // Joining players are never GM - only room creator is GM
          character: {
            class: data.player.character?.class || 'Unknown',
            level: data.player.character?.level || 1,
            health: data.player.character?.health || { current: 100, max: 100 },
            mana: data.player.character?.mana || { current: 50, max: 50 },
            actionPoints: data.player.character?.actionPoints || { current: 3, max: 3 },
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
      // Update the actual player count from server
      setActualPlayerCount(data.playerCount);
    });

    // Listen for party member additions from other clients
    socket.on('party_member_added', (data) => {
      // Get current character name for comparison
      const activeCharacter = getActiveCharacter();
      const currentCharacterName = activeCharacter?.name || currentPlayer?.name;

      // Add the party member to our local party store
      // Skip if this is our own data being broadcast back to us (check both player name and character name)
      const isOwnMember = data.member && (
        data.member.name === currentPlayer?.name ||
        data.member.name === currentCharacterName ||
        data.member.id === currentPlayer?.id ||
        data.member.id === 'current-player'
      );

      if (data.member && !isOwnMember) {
        addPartyMember(data.member);
      }
    });

    socket.on('player_left', (data) => {
      // CRITICAL FIX: Check if the leaving player is the current player
      // If so, navigate to landing page (they were disconnected)
      if (data.player.id === currentPlayer?.id) {
        handleLeaveRoom();
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 200);
        return;
      }

      // Update actual player count from server
      setActualPlayerCount(data.playerCount);

      setConnectedPlayers(prev => {
        const updated = prev.filter(player => player.id !== data.player.id);
        return updated;
      });

      // Show player leave notification
      showPlayerLeaveNotification(data.player.name, currentRoom?.name || 'Room');

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

    // Listen for chat messages
    socket.on('chat_message', (message) => {
      // Add to chat system with proper color handling
      addNotification('social', {
        sender: {
          name: message.playerName,
          class: message.isGM ? 'GM' : 'Player',
          level: 1,
          playerColor: message.playerColor || (message.isGM ? '#d4af37' : '#4a90e2') // Fallback colors
        },
        content: message.content,
        type: 'message',
        timestamp: message.timestamp,
        playerId: message.playerId, // Include player ID for future reference
        isGM: message.isGM
      });

      // Also add to party chat if message type is 'party' or if in party
      if (message.type === 'party' || message.type === 'chat') {
        import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
          const { addPartyChatMessage, activeTab, setActiveTab } = usePresenceStore.getState();
          // Convert timestamp to ISO string if it's a Date object
          const timestamp = message.timestamp instanceof Date
            ? message.timestamp.toISOString()
            : (message.timestamp || new Date().toISOString());
          addPartyChatMessage({
            id: message.id || `msg_${Date.now()}`,
            senderId: message.playerId,
            senderName: message.playerName,
            senderClass: message.isGM ? 'GM' : 'Player',
            senderLevel: 1,
            content: message.content,
            timestamp: timestamp,
            type: 'party'
          });

          // If not on party tab, switch to it to show the message
          if (activeTab !== 'party') {
            setActiveTab('party');
          }
        }).catch(error => {
          console.error('Failed to add party chat message:', error);
        });
      }
    });

    // Listen for token movements from other players
    socket.on('token_moved', (data) => {
      const isDragging = data.isDragging;

      // CRITICAL FIX: Use creatureId as primary identifier (not tokenId)
      // This ensures GM moving player tokens shows the correct token moving
      const targetId = data.creatureId || data.tokenId;

      // Enhanced check to prevent processing our own movements with improved conflict detection
      // CRITICAL FIX: Only skip if it's our own movement AND we're the one who moved it
      // If GM moves our token, we should still see it move
      // CRITICAL FIX: data.playerId is socket.id from server, so compare with socket.id
      const isOwnMovement = (data.playerId === socket.id) &&
        (window.multiplayerDragState && window.multiplayerDragState.has(`token_${targetId}`));

      // Additional check for recent local movements to prevent race conditions
      // CRITICAL FIX: Only skip if we recently moved this token ourselves
      // Note: data.playerId is socket.id from server
      const recentMovementKey = `recent_move_${targetId}`;
      const recentMovementTime = window[recentMovementKey];
      const hasRecentLocalMovement = recentMovementTime && (Date.now() - recentMovementTime) < 1000 &&
        data.playerId === socket.id;

      if (isOwnMovement || hasRecentLocalMovement) {
        return;
      }

      // CRITICAL FIX: Always update token position when receiving movement from server
      // This ensures GM moving player tokens shows the correct token moving
      // Smart throttling based on current player role
      const throttleKey = `${targetId}_${data.playerId}`;
      const now = Date.now();
      const lastUpdate = tokenUpdateThrottleRef.current.get(throttleKey) || 0;
      const throttleMs = isGM ? GM_THROTTLE_MS : PLAYER_THROTTLE_MS;

      if (now - lastUpdate >= throttleMs) {
        tokenUpdateThrottleRef.current.set(throttleKey, now);

        // Batch updates for better performance
        const updateData = {
          type: 'token',
          targetId: data.creatureId || targetId, // CRITICAL FIX: Use creatureId to find correct token
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
                  // Check if this is a confirmation for an optimistic update
                  if (data.actionId) {
                    // This is a server confirmation for our optimistic update
                    optimisticUpdatesService.resolveUpdate(data.actionId, { position: update.position });
                    return; // Don't process position update since optimistic update already applied it
                  }

                  // CRITICAL FIX: Find token by creatureId (not tokenId) to ensure correct token is updated
                  const currentTokens = useCreatureStore.getState().tokens;
                  const token = currentTokens.find(t => t.creatureId === update.targetId);
                  if (token) {
                    // CRITICAL FIX: Only update position if it's significantly different to prevent micro-jumps
                    // This prevents position jumps when GM starts dragging player tokens
                    const currentTokenPosition = token.state.position || { x: 0, y: 0 };
                    const distance = Math.sqrt(
                      Math.pow(update.position.x - currentTokenPosition.x, 2) +
                      Math.pow(update.position.y - currentTokenPosition.y, 2)
                    );

                    // CRITICAL FIX: Always update position when dragging starts or when distance is significant
                    // When GM starts dragging a player token, accept the first position update even if distance is small
                    // This prevents the player from seeing the token start from the wrong position
                    const shouldUpdate = data.isDragging || distance > 1 || distance === 0; // Accept dragging, significant changes, or exact matches

                    if (shouldUpdate) {
                      updateCreatureTokenPosition(token.id, update.position);
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

    // Listen for character movements from other players AND server confirmations
    socket.on('character_moved', (data) => {
      const isOwnMovement = data.playerId === currentPlayer?.id ||
        data.playerId === socket.id;

      // For own movements, ignore server confirmations to prevent position jumps
      // The client is authoritative for its own character position
      if (isOwnMovement) {
        // Check if we recently sent this movement (within last 2000ms to handle long drags)
        const recentMoveKey = `recent_character_move_${data.playerId}`;
        const recentMoveTime = window[recentMoveKey] || 0;
        const timeSinceMove = Date.now() - recentMoveTime;

        if (timeSinceMove < 2000) {
          // This is our own recent movement echoed back - ignore it completely
          // Extended to 2000ms to handle long drag sessions
          return;
        }

        // If it's been a while, this might be a legitimate server correction
        // (e.g., after reconnection or desync), so apply it
        try {
          const { updateCharacterTokenPosition } = useCharacterTokenStore.getState();
          updateCharacterTokenPosition(data.playerId, data.position);
        } catch (error) {
          console.error('Failed to update own character token position from server:', error);
        }
        return;
      }


      // Process movement from other players
      // Throttle character token position updates
      const throttleKey = `character_${data.playerId}`;
      const now = Date.now();
      const lastUpdate = tokenUpdateThrottleRef.current.get(throttleKey) || 0;
      const throttleMs = data.isDragging ? 33 : 16;

      if (now - lastUpdate >= throttleMs || !data.isDragging) {
        tokenUpdateThrottleRef.current.set(throttleKey, now);

        // Update character token position for other players
        try {
          const { updateCharacterTokenPosition } = useCharacterTokenStore.getState();
          updateCharacterTokenPosition(data.playerId, data.position);
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
      if (data.playerId !== currentPlayer?.id) {
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

    // Handle cursor updates from other players
    socket.on('cursor_update', (data) => {
      if (data.playerId !== currentPlayer?.id && showCursorTracking) {
        setOtherPlayerCursors(prev => ({
          ...prev,
          [data.playerId]: {
            ...data,
            lastUpdate: Date.now()
          }
        }));
      }
    });

    // Listen for item drops from other players
    socket.on('item_dropped', (data) => {
      const isSync = data.isSync;
      // Reduced console logging to prevent performance impact

      // Only add item if it's not our own drop (to avoid duplicates) or if it's a sync
      if (data.playerId !== currentPlayer?.id || isSync) {
        // Import the grid item store dynamically to avoid circular dependencies
        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { addItemToGrid } = useGridItemStore.getState();

          // Add the item to the grid without sending back to server (avoid infinite loop)
          addItemToGrid(data.item, data.position, false);

          // Show notification in chat only for new drops from other players, not syncs or own drops
          if (!isSync && data.playerId !== currentPlayer?.id) {
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
      const isSync = data.isSync;

      // Always add token for sync events, and for new creations (server handles deduplication)
      if (isSync || !isSync) {
        // First ensure the creature exists in the store
        addCreature(data.creature);

        // Then add the token without sending back to server (avoid infinite loop)
        addToken(data.creature.id, data.position, false, data.token.id);

        // Show notification in chat only for new creations from other players, not syncs or own creations
        if (!isSync && data.playerId !== currentPlayer?.id) {
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `${data.playerName} placed ${data.creature.name} on the grid`,
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    // Listen for character token creation from other players
    socket.on('character_token_created', (data) => {
      // Don't process our own token creation
      if (data.playerId === currentPlayer?.id) {
        return;
      }

      // Import character token store dynamically to avoid circular dependencies
      import('../../store/characterTokenStore').then(({ default: useCharacterTokenStore }) => {
        const { addCharacterTokenFromServer, addCharacterToken } = useCharacterTokenStore.getState();

        // Add character token directly from server data (bypasses multiplayer sending)
        if (addCharacterTokenFromServer) {
          addCharacterTokenFromServer(data.tokenId, data.position, data.playerId);
        } else {
          // Fallback to regular method but don't send to server
          addCharacterToken(data.position, data.playerId, false); // false = don't send to server
        }

        // Show notification in chat only if it's not our own creation
        if (data.playerId !== currentPlayer?.id) {
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `${data.playerName} placed their character token on the grid`,
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }
      }).catch(error => {
        console.error('Failed to import characterTokenStore:', error);
      });
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
      if (data.playerId !== currentPlayer?.id) {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.looter} looted ${data.item.name} (x${data.quantity}) from ${data.source}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }

      // Remove the item from grid if it was successfully removed on server
      // For currency items, also process our own removals to ensure synchronization
      // For other items, only remove if this is from another player (our own removals are handled immediately)
      const shouldRemove = data.gridItemId && data.itemRemoved && (
        data.playerId !== currentPlayer?.id || // Other player's loot
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

      // Import character token store dynamically to avoid circular dependencies
      import('../../store/characterTokenStore').then(({ default: useCharacterTokenStore }) => {
        const { addCharacterTokenFromServer } = useCharacterTokenStore.getState();

        // Add each character token without sending back to server
        Object.values(data.characterTokens).forEach(tokenData => {

          if (addCharacterTokenFromServer) {
            addCharacterTokenFromServer(tokenData.id, tokenData.position, tokenData.playerId);
          } else {
            // Fallback method
            const { addCharacterToken } = useCharacterTokenStore.getState();
            addCharacterToken(tokenData.position, tokenData.playerId, false); // false = don't send to server
          }
        });
      }).catch(error => {
        console.error('Failed to import characterTokenStore for sync:', error);
      });
    });

    // Listen for character updates from other players
    socket.on('character_updated', (data) => {
      // Only process updates from other players (not our own)
      if (data.character?.playerId && data.character.playerId !== currentPlayer?.id) {

        // Calculate proper race display name from race and subrace data
        let raceDisplayName = data.character.raceDisplayName || 'Unknown';

        // CRITICAL FIX: Use actual character data, not fallback defaults
        // Only use defaults if the data is truly missing (null/undefined), not if it's 0 or empty object
        const baseCharacterData = {
          class: data.character.class || 'Unknown',
          level: data.character.level || 1,
          // CRITICAL FIX: Use actual health/mana/AP values, not defaults
          health: data.character.health !== undefined && data.character.health !== null
            ? data.character.health
            : { current: 100, max: 100 },
          mana: data.character.mana !== undefined && data.character.mana !== null
            ? data.character.mana
            : { current: 50, max: 50 },
          actionPoints: data.character.actionPoints !== undefined && data.character.actionPoints !== null
            ? data.character.actionPoints
            : { current: 3, max: 3 },
          race: data.character.race || 'Unknown',
          subrace: data.character.subrace || '',
          raceDisplayName: raceDisplayName,
          exhaustionLevel: data.character.exhaustionLevel !== undefined ? data.character.exhaustionLevel : 0,
          classResource: data.character.classResource !== undefined && data.character.classResource !== null
            ? data.character.classResource
            : { current: 0, max: 0 },
          tokenSettings: data.character.tokenSettings || {}, // Include token settings, default to empty object
          lore: data.character.lore || {} // Include lore (which contains characterImage), default to empty object
        };

        if (data.character.race && data.character.subrace) {
          import('../../data/raceData').then(({ getFullRaceData }) => {
            const raceData = getFullRaceData(data.character.race, data.character.subrace);
            if (raceData) {
              const updatedRaceDisplayName = raceData.subrace.name;
              // Update party member with correct race display name
              updatePartyMember(data.character.playerId, {
                name: data.character.name,
                character: {
                  ...baseCharacterData,
                  raceDisplayName: updatedRaceDisplayName
                }
              });
            }
          }).catch(error => {
            console.warn('Failed to calculate race display name:', error);
            // Fallback to base data
            updatePartyMember(data.character.playerId, {
              name: data.character.name,
              character: baseCharacterData
            });
          });
        } else if (data.character.race) {
          import('../../data/raceData').then(({ getRaceData }) => {
            const raceData = getRaceData(data.character.race);
            if (raceData) {
              const updatedRaceDisplayName = raceData.name;
              // Update party member with correct race display name
              updatePartyMember(data.character.playerId, {
                name: data.character.name,
                character: {
                  ...baseCharacterData,
                  raceDisplayName: updatedRaceDisplayName
                }
              });
            }
          }).catch(error => {
            console.warn('Failed to get race data:', error);
            // Fallback to base data
            updatePartyMember(data.character.playerId, {
              name: data.character.name,
              character: baseCharacterData
            });
          });
        } else {
          // No race data to process, use base data
          updatePartyMember(data.character.playerId, {
            name: data.character.name,
            character: baseCharacterData
          });
        }

        // Update chat user data
        try {
          updateUser(data.character.playerId, {
            name: data.character.name,
            class: data.character.class || 'Unknown',
            level: data.character.level || 1
          });
        } catch (error) {
          // Fallback to adding if update fails
          addUser({
            id: data.character.playerId,
            name: data.character.name,
            class: data.character.class || 'Unknown',
            level: data.character.level || 1,
            status: 'online'
          });
        }

        // Update connected players list with character data
        setConnectedPlayers(prev => prev.map(player =>
          player.id === data.character.playerId
            ? { ...player, character: data.character }
            : player
        ));

      }
    });

    // Listen for character equipment updates from other players
    socket.on('character_equipment_updated', (data) => {

      // Only process updates from other players (not our own)
      if (data.updatedBy !== currentRoom?.gm?.id && data.updatedByName !== currentRoom?.gm?.name) {
        // Show notification in chat
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.updatedByName} ${data.item ? 'equipped' : 'unequipped'} ${data.item?.name || 'an item'} ${data.item ? 'to' : 'from'} ${data.slot}`,
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
          addToken(tokenData.creatureId, tokenData.position, false, tokenData.id);
        });
      }

      // IMPROVEMENT: Sync character tokens (player characters on map)
      if (data.characterTokens && Object.keys(data.characterTokens).length > 0) {
        import('../../store/characterTokenStore').then(({ default: useCharacterTokenStore }) => {
          const { addCharacterToken } = useCharacterTokenStore.getState();
          Object.values(data.characterTokens).forEach(tokenData => {
            if (tokenData.playerId && tokenData.position) {
              addCharacterToken(tokenData.playerId, tokenData.position, false);
            }
          });
        }).catch(error => {
          console.warn('Failed to sync character tokens:', error);
        });
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
          if (playerData.id !== currentPlayer?.id && playerData.character) {
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
        if (data.playerId !== currentPlayer?.id) {
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
              // Update party member data
              if (data.data && data.data.memberId && data.data.updates) {
                partyStore.updatePartyMember(data.data.memberId, data.data.updates);
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
        if (data.playerId !== currentPlayer?.id) {
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
        if (data.playerId !== currentPlayer?.id) {
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
        if (data.playerId !== currentPlayer?.id) {
          switch (data.type) {
            case 'grid_item_added':
              // Add item to grid
              if (data.data && data.data.item && data.data.position) {
                gridItemStore.addItemToGrid(data.data.item, data.data.position, false);
              }
              break;

            case 'grid_item_removed':
              // Remove item from grid
              if (data.data && data.data.gridItemId) {
                gridItemStore.removeItemFromGrid(data.data.gridItemId);
              }
              break;

            case 'grid_item_moved':
              // Move item on grid
              if (data.data && data.data.gridItemId && data.data.newPosition) {
                gridItemStore.updateItemPosition(data.data.gridItemId, data.data.newPosition);
              }
              break;
          }
        }
      });
    });

    // Listen for map updates (fog of war, drawing, tiles)
    socket.on('map_updated', (data) => {
      // CRITICAL FIX: Always process map updates from server (even if it's our own update)
      // This ensures all players see terrain, fog, and drawings correctly
      // The server broadcasts to all players including the sender for confirmation
      window._isReceivingMapUpdate = true;

      import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
        const levelEditorStore = useLevelEditorStore.getState();

        // CRITICAL FIX: Temporarily disable emit check, then use setters to update state
        // This ensures updates are applied and synced properly

        // CRITICAL FIX: Use store methods directly, not getState().method()
        // getState() returns the state object, not the store methods

        // Update fog of war if provided
        if (data.mapData?.fogOfWar !== undefined) {
          const wasReceiving = window._isReceivingMapUpdate;
          window._isReceivingMapUpdate = false; // Temporarily disable to allow setter to work
          levelEditorStore.setFogOfWarData(data.mapData.fogOfWar);
          window._isReceivingMapUpdate = wasReceiving;
        }

        // Update fog paths if provided
        if (data.mapData?.fogOfWarPaths !== undefined) {
          const wasReceiving = window._isReceivingMapUpdate;
          window._isReceivingMapUpdate = false;
          levelEditorStore.setFogOfWarPaths(data.mapData.fogOfWarPaths);
          window._isReceivingMapUpdate = wasReceiving;
        }
        if (data.mapData?.fogErasePaths !== undefined) {
          const wasReceiving = window._isReceivingMapUpdate;
          window._isReceivingMapUpdate = false;
          levelEditorStore.setFogErasePaths(data.mapData.fogErasePaths);
          window._isReceivingMapUpdate = wasReceiving;
        }

        // CRITICAL FIX: Update terrain data if provided (this is the key fix for terrain tiles)
        if (data.mapData?.terrainData !== undefined) {
          // Merge terrain data instead of replacing to preserve existing tiles
          const currentTerrainData = levelEditorStore.getState().terrainData || {};
          const mergedTerrainData = { ...currentTerrainData, ...data.mapData.terrainData };
          const wasReceiving = window._isReceivingMapUpdate;
          window._isReceivingMapUpdate = false;
          levelEditorStore.setTerrainData(mergedTerrainData);
          window._isReceivingMapUpdate = wasReceiving;
        }

        // Update wall data if provided
        if (data.mapData?.wallData !== undefined) {
          const wasReceiving = window._isReceivingMapUpdate;
          window._isReceivingMapUpdate = false;
          levelEditorStore.setWallData(data.mapData.wallData);
          window._isReceivingMapUpdate = wasReceiving;
        }

        // Update drawing layers if provided
        if (data.mapData?.drawingLayers !== undefined) {
          const wasReceiving = window._isReceivingMapUpdate;
          window._isReceivingMapUpdate = false;
          levelEditorStore.setDrawingLayers(data.mapData.drawingLayers);
          window._isReceivingMapUpdate = wasReceiving;
        }

        // Update drawing paths if provided
        if (data.mapData?.drawingPaths !== undefined) {
          const wasReceiving = window._isReceivingMapUpdate;
          window._isReceivingMapUpdate = false;
          levelEditorStore.setDrawingPaths(data.mapData.drawingPaths);
          window._isReceivingMapUpdate = wasReceiving;
        }

        // CRITICAL FIX: Update explored areas if provided (for fog of war memory)
        if (data.mapData?.exploredAreas !== undefined) {
          const wasReceiving = window._isReceivingMapUpdate;
          window._isReceivingMapUpdate = false;
          levelEditorStore.setExploredAreas(data.mapData.exploredAreas);
          window._isReceivingMapUpdate = wasReceiving;
        }

        // Update dndElements (connections/portals) if provided
        if (data.mapData?.dndElements !== undefined) {
          const wasReceiving = window._isReceivingMapUpdate;
          window._isReceivingMapUpdate = false;
          levelEditorStore.setDndElements(data.mapData.dndElements);
          window._isReceivingMapUpdate = wasReceiving;
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
      if (data.removedBy !== currentPlayer?.id) {
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

    // Listen for dialogue messages from other players
    socket.on('dialogue_message', (data) => {
      // Only process dialogue from other players (not our own)
      if (data.dialogueData?.playerId !== currentPlayer?.id) {
        import('../../store/dialogueStore').then(({ default: useDialogueStore }) => {
          const { handleMultiplayerDialogue } = useDialogueStore.getState();
          handleMultiplayerDialogue(data.dialogueData);
        }).catch(error => {
          console.error('Failed to handle multiplayer dialogue:', error);
        });
      }
    });

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
          recipientId: message.recipientId || currentPlayer?.id,
          recipientName: message.recipientName || currentPlayer?.name || 'Unknown',
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
      
      // CRITICAL FIX: Set connection status to error so UI shows the error state
      setConnectionStatus('error');

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
      if (!isGM) {
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
      if (isGM) {
        addNotification('social', {
          sender: { name: data.playerName, class: 'player', level: 0 },
          content: `${data.playerName} has ${data.accepted ? 'accepted' : 'declined'} the game session invitation.`,
          type: 'game_session_response',
          accepted: data.accepted,
          timestamp: data.timestamp
        });
      }
    });

    // IMPROVEMENT: Handle reconnection with better state recovery
    socket.on('reconnect', (attemptNumber) => {
      // CRITICAL FIX: Reset connection status to connected on successful reconnect
      setConnectionStatus('connected');

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Reconnected to server (attempt ${attemptNumber}). Syncing game state...`,
        type: 'system',
        timestamp: new Date().toISOString()
      });

      // IMPROVEMENT: Rejoin room if we were in one
      if (currentRoom && currentPlayer) {
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
                  level: activeCharacter.level,
                  health: activeCharacter.health,
                  mana: activeCharacter.mana,
                  actionPoints: activeCharacter.actionPoints,
                  playerId: currentPlayer.id
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
      socket.off('sync_error');
      socket.off('connect_error');
      socket.off('reconnect');
    };
  }, [socket]); // Reduced dependencies to prevent excessive re-runs

  const handleJoinRoom = async (room, socketConnection, isGameMaster) => {
    setIsJoiningRoom(true);
    setConnectionStatus('connecting');

    // Show joining notification
    addNotificationRef.current('social', {
      sender: { name: 'System', class: 'system', level: 0 },
      content: `Joining room: ${room.name}...`,
      type: 'system',
      timestamp: new Date().toISOString()
    });

    let currentPlayerData;

    try {
      setCurrentRoom(room);
      setSocket(socketConnection);
      setIsGM(isGameMaster);

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

      // Set current player info - use character name if available
      const activeCharacter = getActiveCharacter();
      if (isGameMaster) {
        currentPlayerData = {
          ...room.gm,
          name: activeCharacter?.name || room.gm?.character?.name || room.gm?.name || 'Game Master',
          isGM: true // Explicitly set GM status
        };
        setCurrentPlayer(currentPlayerData);
      } else {
        // Find the current player in the room's players
        // Handle Map, Array, or Object formats safely
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
          isGM: false // Explicitly set non-GM status for joining players
        };
        setCurrentPlayer(currentPlayerData);
      }

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
      // CRITICAL FIX: Ensure GM mode is set correctly even on early return
      // Joining players are never GM - only room creator is GM
      setGMMode(isGameMaster);
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
      }

      // If no active character is loaded, try to load from storage
      if (!activeCharacter) {
        activeCharacter = await loadActiveCharacter();
      }

      // If still no active character, check if any characters exist and suggest activation
      // SKIP this check for guest users - they don't need persistent characters
      const { user } = useAuthStore.getState();
      const isGuest = user?.isGuest || false;

      if (!activeCharacter && !isGuest) {
        // Try to get available characters
        const { characters } = useCharacterStore.getState();
        setIsJoiningRoom(false);
        setConnectionStatus('error');
        // CRITICAL FIX: Ensure GM mode is set correctly even on early return
        // Joining players are never GM - only room creator is GM
        setGMMode(isGameMaster);
        if (characters && characters.length > 0) {
          // Show a user-friendly message with actionable guidance
          const characterNames = characters.map(c => c.name).join(', ');
          setError(`Please select and activate a character before joining multiplayer rooms. Available characters: ${characterNames}. Go to Account > Characters to activate one.`);
        } else {
          setError('You need to create a character before joining multiplayer rooms. Go to Account > Characters to create your first character.');
        }
        return;
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
      // Set initial player count (GM + regular players)
      // Note: room.players is an Array from server (Array.from()), and server now handles GM inclusion in count
      const initialPlayerCount = room.players?.length || room.playerCount || 1;
      setActualPlayerCount(initialPlayerCount);

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
      createParty(room.name, currentPlayerCharacterName);

      // Update the current player that was automatically added by createParty with full character data
      const currentPlayerMember = {
        id: 'current-player',
        name: currentPlayerCharacterName,
        isGM: isGameMaster, // Include GM status for current player
        character: {
          class: activeCharacter?.class || characterStore.class || 'Unknown',
          level: activeCharacter?.level || characterStore.level || 1,
          health: activeCharacter?.health || characterStore.health || { current: 100, max: 100 },
          mana: activeCharacter?.mana || characterStore.mana || { current: 50, max: 50 },
          actionPoints: activeCharacter?.actionPoints || characterStore.actionPoints || { current: 3, max: 3 },
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
            health: room.gm.character?.health || { current: 100, max: 100 },
            mana: room.gm.character?.mana || { current: 50, max: 50 },
            actionPoints: room.gm.character?.actionPoints || { current: 3, max: 3 },
            race: room.gm.character?.race || 'Unknown',
            subrace: room.gm.character?.subrace || '',
            raceDisplayName: room.gm.character?.raceDisplayName || 'Unknown',
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
                health: player.character?.health || { current: 100, max: 100 },
                mana: player.character?.mana || { current: 50, max: 50 },
                actionPoints: player.character?.actionPoints || { current: 3, max: 3 },
                race: player.character?.race || 'Unknown',
                subrace: player.character?.subrace || '',
                raceDisplayName: player.character?.raceDisplayName || 'Unknown',
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
      setMultiplayerState(true, room, handleReturnToSinglePlayer, socketConnection);

      // Set up chat integration for multiplayer
      const sendChatMessage = (message) => {
        if (socketConnection && socketConnection.connected) {
          // Get current player data for the message
          const activeCharacter = getActiveCharacter();
          const currentPlayerCharacterName = activeCharacter?.name || currentPlayerData?.name || 'Unknown Player';

          socketConnection.emit('chat_message', {
            message: message,
            type: 'chat' // This will be handled as party chat on the server
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
      setMultiplayerSocket(socketConnection, true);

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
        socket={socket}
        addNotification={addNotification}
        otherPlayerCursors={otherPlayerCursors}
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
  gridSize,
  gridOffsetX,
  gridOffsetY,
  isGM,
  socket,
  addNotification,
  otherPlayerCursors,
  pendingGameSessionInvitations,
  handleAcceptGameSession,
  handleDeclineGameSession,
  actualPlayerCount
}) => {
  const { enterMultiplayerRoom, exitRoom } = useRoomContext();

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

  if (!currentRoom) {
    return null;
  }

  // Note: We now use the actualPlayerCount prop passed from the parent which tracks server updates
  // const actualPlayerCount = (currentRoom.players ? currentRoom.players.length : 0) + 1; 

  return (
    <div className="multiplayer-vtt">
      {/* Localhost Multiplayer Simulator - only show in development on localhost */}
      <LocalhostMultiplayerSimulator
        isVisible={true}
        currentRoom={currentRoom}
      />

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
        <CursorOverlay cursors={otherPlayerCursors} />
        <Navigation onReturnToLanding={handleReturnToSinglePlayer} />

        {/* Connection Status Indicator */}
        <ConnectionStatusIndicator
          status={connectionStatus}
          isJoiningRoom={isJoiningRoom}
          playerCount={actualPlayerCount}
        />

        {/* Performance monitor removed - was causing overhead */}
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
    </div>
  );
};

export default MultiplayerApp;
