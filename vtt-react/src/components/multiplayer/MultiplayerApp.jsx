import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import RoomLobby from './RoomLobby';
// Removed: LocalhostMultiplayerSimulator - as requested to reduce bloat
import GameSessionInvitation from './GameSessionInvitation';
import CursorTracker from './CursorTracker';
import UnifiedTransitionOverlay, { TRANSITION_TIMINGS } from './UnifiedTransitionOverlay';
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
import useMapStore from '../../store/mapStore';
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

const CHAT_DEBUG = process.env.NODE_ENV === 'development' || process.env.REACT_APP_CHAT_DEBUG === 'true';
const chatDebug = (...args) => {
  if (CHAT_DEBUG) {
    console.log(...args);
  }
};

// Keep cursor debug fully opt-in so development mode doesn't spam logs and degrade cursor responsiveness.
const CURSOR_DEBUG = process.env.REACT_APP_CURSOR_DEBUG === 'true';
const cursorDebug = (...args) => {
  if (CURSOR_DEBUG) {
    console.log(...args);
  }
};

// Connection Status Indicator Component
const ConnectionStatusIndicator = ({ status, isJoiningRoom, playerCount, currentMapName, onMapIconClick }) => {
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
      <div className="status-main">
        <i className={statusInfo.icon} style={{ color: statusInfo.color }}></i>
        <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>
      </div>
      {status === 'connected' && currentMapName && (
        <div className="status-map" onClick={onMapIconClick} title="Switch/View Maps">
          <i className="fas fa-map-marked-alt"></i>
          <span className="current-map-name">{currentMapName}</span>
        </div>
      )}
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
  const [isJoiningRoom, setIsJoiningRoom] = useState(() => {
    // If we have auto-join data in localStorage or sessionStorage, start in joining state to prevent lobby flicker
    return !!localStorage.getItem('selectedRoomId') || !!sessionStorage.getItem('pendingGMSessionInvitation');
  });
  const [connectionQuality, setConnectionQuality] = useState({ latency: 0, quality: 'good' }); // IMPROVEMENT: Track connection quality

  // Pending room data - holds room info while showing loading screen with Continue button
  const [pendingRoomData, setPendingRoomData] = useState(null);
  const [isRoomReady, setIsRoomReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatusMessage, setLoadingStatusMessage] = useState(null);
  const [showContinue, setShowContinue] = useState(false);
  const [joinStartTime, setJoinStartTime] = useState(null);
  const joinStartTimeRef = useRef(null); // Ref to avoid race condition with state
  const MIN_LOADING_DURATION = 1500; // 1.5 seconds minimum loading time

  // Helper to start joining room with synchronized ref (avoids race condition)
  const startJoiningRoom = useCallback(() => {
    const now = Date.now();
    console.log('🔄 [MultiplayerApp] startJoiningRoom called at:', new Date(now).toLocaleTimeString());
    joinStartTimeRef.current = now;
    setJoinStartTime(now);
    setIsJoiningRoom(true);
  }, []);

  // MAP ISOLATION: Track player's current map and transition state
  const [playerCurrentMapId, setPlayerCurrentMapId] = useState('default');
  const playerCurrentMapIdRef = useRef('default'); // Ref for socket listener filtering
  const [mapTransition, setMapTransition] = useState({
    isActive: false,
    mapName: '',
    transferredByGM: false
  });
  // NOTE: playerMapAssignments is now centralized in partyStore - see usePartyStore
  const isInitialMapLoadRef = useRef(true); // Flag to skip transition on first load

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
    // Keep cursor stream responsive by default (~60fps ceiling) unless user explicitly sets otherwise
    cursorUpdateThrottle: state.cursorUpdateThrottle || 16
  }));

  // Get map transition preference from settings store
  const showMapTransitions = useSettingsStore(state => state.showMapTransitions);
  // Default to true when settings are not yet hydrated or key is missing
  const showCursorTracking = useSettingsStore(state => state.showCursorTracking) ?? true;

  const { updateCharacterInfo, setRoomName, getActiveCharacter, loadActiveCharacter, startCharacterSession, endCharacterSession } = useCharacterStore((state) => ({
    updateCharacterInfo: state.updateCharacterInfo,
    setRoomName: state.setRoomName,
    getActiveCharacter: state.getActiveCharacter,
    loadActiveCharacter: state.loadActiveCharacter,
    startCharacterSession: state.startCharacterSession,
    endCharacterSession: state.endCharacterSession
  }));

  const { addPartyMember, removePartyMember, createParty, updatePartyMember, isInParty } = usePartyStore((state) => ({
    addPartyMember: state.addPartyMember,
    removePartyMember: state.removePartyMember,
    createParty: state.createParty,
    updatePartyMember: state.updatePartyMember,
    isInParty: state.isInParty
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

  // Sync ref with state
  useEffect(() => {
    playerCurrentMapIdRef.current = playerCurrentMapId;
  }, [playerCurrentMapId]);

  // Loading progress simulation for join overlay
  useEffect(() => {
    if (!isJoiningRoom || isFadingOut) {
      setLoadingProgress(0);
      setShowContinue(false);
      setJoinStartTime(null);
      joinStartTimeRef.current = null;
      return;
    }

    // Record when joining started (for minimum duration enforcement)
    // Use ref to avoid race condition - state update may not be immediate
    if (!joinStartTimeRef.current) {
      const now = Date.now();
      joinStartTimeRef.current = now;
      setJoinStartTime(now);
    }

    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 95) {
        currentProgress += Math.random() * 8 + 2;
        currentProgress = Math.min(currentProgress, 95);
        setLoadingProgress(currentProgress);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isJoiningRoom, isFadingOut]);

  // Complete progress when room is ready (with minimum duration)
  useEffect(() => {
    if (!isRoomReady || !isJoiningRoom || isFadingOut) return;

    const startTime = joinStartTimeRef.current || joinStartTime;
    if (!startTime) return;

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsed);
    console.log('⏱️ [MultiplayerApp] Progress Effect:', {
      isRoomReady,
      isJoiningRoom,
      showContinue,
      elapsed,
      remainingTime,
      pendingRoomData: !!pendingRoomData,
      isInvitationJoin: pendingRoomData?.isInvitationJoin
    });

    // Ensure progress completes to 100%
    setLoadingProgress(100);

    // AUTOMATION: If this was an invitation or auto-join flow, skip the button
    // Also skip for GMs who just created the room (they're in a hurry!)
    const isInvitation = pendingRoomData?.isInvitationJoin;
    const isGMCreating = isGM && !currentRoom; // Joining for the first time as GM

    if (isInvitation || isGMCreating) {
      const timer = setTimeout(() => {
        if (isJoiningRoom && !isFadingOut) {
          handleLoadingContinue();
        }
      }, remainingTime);
      return () => clearTimeout(timer);
    }

    // Otherwise, show continue button after minimum duration
    const timer = setTimeout(() => {
      if (isJoiningRoom && !isFadingOut) {
        setShowContinue(true);
      }
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [isRoomReady, isJoiningRoom, isFadingOut, joinStartTime, isGM, !!currentRoom, !!pendingRoomData?.isInvitationJoin]);

  // Manual map transition requests from UI flows (e.g. MapLibraryWindow / MapSwitcher)
  useEffect(() => {
    const handleManualMapTransitionRequested = (event) => {
      if (!showMapTransitions) return;

      const detail = event?.detail || {};
      setMapTransition({
        isActive: true,
        mapName: detail.mapName || 'Unknown Realm',
        transferredByGM: !!detail.transferredByGM
      });
    };

    window.addEventListener('manual_map_transition_requested', handleManualMapTransitionRequested);
    return () => {
      window.removeEventListener('manual_map_transition_requested', handleManualMapTransitionRequested);
    };
  }, [showMapTransitions]);

  // CRITICAL FIX: Sync playerCurrentMapId with mapStore.currentMapId
  // This ensures the client-side filter for map_updated events is always correct,
  // even when GM switches maps manually via switchToMap() without server assignment
  // NOTE: Using full state subscription since mapStore doesn't have subscribeWithSelector
  useEffect(() => {
    let lastMapId = playerCurrentMapIdRef.current;
    const unsubscribe = useMapStore.subscribe((state) => {
      const currentMapId = state.currentMapId;
      if (currentMapId && currentMapId !== lastMapId) {
        lastMapId = currentMapId;
        setPlayerCurrentMapId(currentMapId);
        playerCurrentMapIdRef.current = currentMapId;
        console.log(`🗺️ [MapSync] Synced playerCurrentMapId with mapStore: ${currentMapId}`);
      }
    });
    return () => unsubscribe();
  }, []);

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
  const clearAllMultiplayerStores = useCallback((options = {}) => {
    const { preserveMapEntities = false } = options;
    console.log('🧹 Clearing all stores for clean room initialization', { preserveMapEntities });

    if (!preserveMapEntities) {
      // Level editor
      const levelEditorStore = useLevelEditorStore.getState();
      if (levelEditorStore.resetStore) levelEditorStore.resetStore();

      // Creatures and Character Tokens
      useCreatureStore.getState().clearCreatureTokens();
      useCharacterTokenStore.getState().clearCharacterTokens();
    } else {
      console.log('🛡️ Preserving map entity stores for permanent room resume');
    }

    // Combat
    useCombatStore.getState().forceResetCombat();

    // Chat and Presence
    const chatStore = useChatStore.getState();
    if (chatStore.resetStore) chatStore.resetStore();

    // CRITICAL FIX: Do NOT call cleanup() here - it clears the socket which triggers
    // GlobalSocketManager to create a new socket, which then disconnects the multiplayer
    // socket via setSocket()'s cleanup logic. This causes the GM to be disconnected from
    // the socket.io room and miss player_joined events.
    // Instead, only clear the presence data we actually need to reset.
    usePresenceStore.setState({
      currentParty: null,
      isInParty: false,
      partyMembers: [],
      pendingInvitations: [],
      pendingPartyInvites: [],
      globalChatMessages: [],
      partyChatMessages: [],
      whisperTabs: new Map()
      // NOTE: We intentionally do NOT clear socket, isConnected, or currentUserPresence
      // to maintain the active connection to the multiplayer server.
    });

    // Party - CRITICAL: Clear both partyStore AND presenceStore party data
    // to prevent social party members from appearing in multiplayer room
    const partyStore = usePartyStore.getState();
    if (partyStore.resetStore) partyStore.resetStore();

    // Grid Items
    if (!preserveMapEntities) {
      useGridItemStore.getState().clearGrid();
    }

    // Inventory (clear to prevent guest users seeing old data)
    useInventoryStore.getState().clearInventory();

    // Game State + Map Store (skip destructive reset for persistent resume)
    if (!preserveMapEntities) {
      const gameStore = useGameStore.getState();
      if (gameStore.resetStore) gameStore.resetStore();

      const mapStore = useMapStore.getState();
      if (mapStore.resetStore) mapStore.resetStore();
    }

    console.log('✅ All stores cleared');
  }, []);

  // Refs for values used in socket event handlers to prevent dependency issues
  const currentRoomRef = useRef(currentRoom);
  const isJoiningRoomRef = useRef(isJoiningRoom);
  const currentPlayerRef = useRef(currentPlayer);
  const pendingRoomDataRef = useRef(pendingRoomData);
  const activeJoinIdRef = useRef(null); // Track current join sequence to prevent stale joins
  const autoJoinAttemptedRef = useRef(false); // Ref to prevent redundant checkAutoJoin calls
  const isAutoJoinSequenceRef = useRef(false); // Ref to track if we're in an auto-continue join flow

  // Update refs when state changes
  useEffect(() => {
    currentRoomRef.current = currentRoom;
    isJoiningRoomRef.current = isJoiningRoom;
    currentPlayerRef.current = currentPlayer;
    pendingRoomDataRef.current = pendingRoomData;
  }, [currentRoom, isJoiningRoom, currentPlayer, pendingRoomData]);

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

  // ========== AUTO-JOIN LOGIC FOR DIRECT NAVIGATION ==========
  const checkAutoJoin = useCallback(async () => {
    // 1. Connection Guard: Must be connected to do anything
    if (!socket || !socket.connected) return;

    // 2. Concurrency Guard: Move this to the VERY TOP to prevent race conditions
    // between rapid socket events and this async function
    if (autoJoinAttemptedRef.current) {
      console.log('🔄 [Auto-Join] Already attempted or in progress, skipping');
      return;
    }

    // Set immediately before any async work to block other calls
    autoJoinAttemptedRef.current = true;

    const selectedRoomId = localStorage.getItem('selectedRoomId');
    const selectedRoomPassword = localStorage.getItem('selectedRoomPassword');
    const isGMResume = localStorage.getItem('isGMResume') === 'true';
    const resumeRoomName = localStorage.getItem('resumeRoomName');
    const pendingInvitation = sessionStorage.getItem('pendingGMSessionInvitation');

    console.log('🔍 [Auto-Join] checkAutoJoin triggered:', {
      hasSelectedRoom: !!selectedRoomId,
      hasInvitation: !!pendingInvitation,
      isJoining: isJoiningRoomRef.current,
      inRoom: !!currentRoomRef.current
    });

    // Handle session invitations first (priority)
    if (pendingInvitation && !currentRoomRef.current) {
      try {
        const invitation = JSON.parse(pendingInvitation);
        console.log('📨 [Auto-Join] Found pending GM session invitation, responding:', invitation.partyName);
        setLoadingStatusMessage(`Accepting invitation from ${invitation.senderName || 'GM'}...`);

        // Mark that we've initiated an invitation response sequence
        isAutoJoinSequenceRef.current = true;

        startJoiningRoom();
        setConnectionStatus('connecting');

        // CRITICAL: Ensure we only emit once per unique invitation ID, but allow controlled retries
        const lastEmittedInvitationId = sessionStorage.getItem('lastEmittedInvitationId');
        const retryCount = parseInt(sessionStorage.getItem('invitationRetryCount') || '0', 10);

        if (lastEmittedInvitationId === invitation.invitationId && retryCount >= 1) {
          console.log('⏭️ [Auto-Join] Already attempted and retried for this invitation, waiting for server or timeout...');
          return;
        }

        if (lastEmittedInvitationId === invitation.invitationId) {
          console.log('🔄 [Auto-Join] Retrying invitation response (1/1)...');
          sessionStorage.setItem('invitationRetryCount', (retryCount + 1).toString());
        } else {
          sessionStorage.setItem('lastEmittedInvitationId', invitation.invitationId);
          sessionStorage.setItem('invitationRetryCount', '0');
        }

        socket.emit('respond_to_room_invitation', {
          invitationId: invitation.invitationId,
          roomId: invitation.roomId,
          accepted: true,
          character: useCharacterStore.getState().getActiveCharacter() // Added character data
        });

        // Safety timeout for server response
        setTimeout(() => {
          if (isJoiningRoomRef.current && !currentRoomRef.current) {
            setLoadingStatusMessage('Still waiting for realm access...');
            console.warn('⚠️ [Auto-Join] Server took too long to respond to invitation, resetting attempt flag');
            autoJoinAttemptedRef.current = false;

            // If we've already retried, show error or allow manual join
            const finalRetryCount = parseInt(sessionStorage.getItem('invitationRetryCount') || '0', 10);
            if (finalRetryCount >= 1) {
              console.error('❌ [Auto-Join] Invitation response totally timed out after retry.');
              addNotification('social', {
                sender: { name: 'System', class: 'system', level: 0 },
                content: 'Server connection timed out while joining the realm. Please try joining manually.',
                type: 'system',
                timestamp: new Date().toISOString()
              });
              setIsJoiningRoom(false);
              setConnectionStatus('error');
            }
          }
        }, 8000); // 8 seconds for first attempt, then retry will happen on next trigger

        return;
      } catch (e) {
        console.error('Failed to parse pending GM session invitation:', e);
        sessionStorage.removeItem('pendingGMSessionInvitation');
      }
    }

    // Check if we have a room to join and the socket is connected
    // NOTE: We check !currentRoomRef.current to avoid re-joining if already in a room
    if (selectedRoomId && !currentRoomRef.current) {
      console.log('🚀 [Auto-Join] Initiating join for:', selectedRoomId, { isGMResume });

      // Mark as auto-continue sequence
      isAutoJoinSequenceRef.current = true;

      // Clear auto-join flags immediately to prevent loops on error/reconnect
      localStorage.removeItem('selectedRoomId');
      localStorage.removeItem('selectedRoomPassword');
      localStorage.removeItem('isGMResume');
      localStorage.removeItem('resumeRoomName');

      startJoiningRoom();
      setConnectionStatus('connecting');

      // Ensure character data is loaded before joining
      let activeCharacter = getActiveCharacter();
      if (!activeCharacter) {
        console.log('🚀 [Auto-Join] Loading active character before join...');
        activeCharacter = await loadActiveCharacter();
      }

      const inventoryState = useInventoryStore.getState();
      // CRITICAL: Determine the display name, using account name as fallback for generic defaults
      let finalPlayerName = activeCharacter?.name || 'Adventurer';
      if (finalPlayerName === 'Character Name' || finalPlayerName === 'Adventurer') {
        try {
          const { user } = useAuthStore.getState();
          finalPlayerName = user?.displayName || user?.email?.split('@')[0] || finalPlayerName;
        } catch (e) { }
      }

      // Character data for both create and join
      const characterData = activeCharacter ? {
        id: activeCharacter.id || 'guest-char',
        name: activeCharacter.name || finalPlayerName,
        class: activeCharacter.class || 'Unknown',
        race: activeCharacter.race || 'Unknown',
        subrace: activeCharacter.subrace || '',
        raceDisplayName: activeCharacter.raceDisplayName || '',
        level: activeCharacter.level || 1,
        health: activeCharacter.health || { current: 45, max: 50 },
        mana: activeCharacter.mana || { current: 45, max: 50 },
        actionPoints: activeCharacter.actionPoints || { current: 1, max: 3 },
        alignment: activeCharacter.alignment || 'Neutral Good',
        background: activeCharacter.background || '',
        // Only include classResource if it has a valid max value (prevents 0/0 bar)
        ...(activeCharacter.classResource?.max ? { classResource: activeCharacter.classResource } : {}),
        inventory: {
          items: inventoryState.items || [],
          currency: inventoryState.currency || { platinum: 0, gold: 0, silver: 0, copper: 0 },
          encumbranceState: inventoryState.encumbranceState || 'normal'
        },
        equipment: activeCharacter.equipment,
        stats: activeCharacter.stats,
        lore: activeCharacter.lore,
        tokenSettings: activeCharacter.tokenSettings
      } : null;

      if (isGMResume) {
        // GM is resuming a permanent room - need to CREATE/ACTIVATE it on the socket server
        console.log('👑 [Auto-Join] GM resuming permanent room - creating on server:', selectedRoomId);

        // CRITICAL FIX: Clear social party members BEFORE creating room (not after)
        try {
          const currentPartyMembers = usePartyStore.getState().partyMembers || [];
          if (currentPartyMembers.length > 0) {
            console.log('🧹 Clearing social party members BEFORE create_room');
            usePartyStore.getState().clearPartyMembers();
          }
        } catch (e) {
          console.warn('⚠️ Failed to clear party members before create_room:', e);
        }

        // Set flag to prevent social party from syncing to partyStore during transition
        sessionStorage.setItem('enteringMultiplayer', 'true');

        const createData = {
          roomName: resumeRoomName || 'Campaign Room',
          gmName: finalPlayerName,
          password: selectedRoomPassword || '',
          playerColor: '#d4af37', // Gold color for GM
          persistentRoomId: selectedRoomId, // Link to Firebase permanent room
          character: characterData,
          partyMembers: [] // GM resumes alone initially
        };

        console.log('📤 [Auto-Join] Sending create_room for GM resume:', selectedRoomId);
        socket.emit('create_room', createData);
      } else {
        // Regular player joining or test room
        const joinData = {
          roomId: selectedRoomId,
          playerName: finalPlayerName,
          password: selectedRoomPassword || '',
          playerColor: '#4a90e2', // Default blue color matching RoomLobby
          character: characterData
        };

        console.log('📤 [Auto-Join] Sending join_room:', selectedRoomId);
        socket.emit('join_room', joinData);
      }
    } else if (isJoiningRoomRef.current && !pendingInvitation && !selectedRoomId) {
      // CRITICAL: If we're in joining state but there's no selectedRoomId or invitation,
      // the auto-join failed or was already cleared - reset the state
      console.log('⚠️ [Auto-Join] No room data found but isJoiningRoom=true, resetting state');
      setIsJoiningRoom(false);
      setConnectionStatus('disconnected');
    }
  }, [socket, startJoiningRoom, getActiveCharacter, loadActiveCharacter]);


  // ROBUST TRIGGER: Effect to monitor connection status and trigger auto-join
  useEffect(() => {
    if (socket && socket.connected) {
      checkAutoJoin();
    }

    const handleConnect = () => {
      checkAutoJoin();
    };

    socket?.on('connect', handleConnect);
    return () => {
      socket?.off('connect', handleConnect);
    };
  }, [socket, socket?.connected, checkAutoJoin]);

  // ROBUST TRIGGER: Effect to monitor session storage changes
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (sessionStorage.getItem('pendingGMSessionInvitation') && !currentRoomRef.current && !isJoiningRoomRef.current) {
        console.log('⚡ [Auto-Trigger] Detected pending invitation in storage, triggering join');
        autoJoinAttemptedRef.current = false;
        checkAutoJoin();
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [checkAutoJoin]);

  // Socket server URL - adjust based on environment (memoized to prevent recreation)
  const SOCKET_URL = useMemo(() => {
    const resolvedUrl = process.env.REACT_APP_SOCKET_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://descension-mythrill.up.railway.app' // Your Railway URL
        : 'http://localhost:3001');

    cursorDebug('🔌 [Cursor] Resolved socket URL:', {
      resolvedUrl,
      nodeEnv: process.env.NODE_ENV,
      hasEnvOverride: !!process.env.REACT_APP_SOCKET_URL
    });

    return resolvedUrl;
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
      console.log('🔌 [MultiplayerApp] Multiplayer socket created and exposed to window.multiplayerSocket');

      // Removed enhanced multiplayer system - was causing conflicts

      // Enhanced connection event listeners with status feedback
      newSocket.on('connect', () => {
        console.log('🔌 [MultiplayerApp] Multiplayer socket CONNECTED:', newSocket.id);
        setIsConnecting(false);
        // Don't set to 'connected' here - wait for room join to complete
        // setConnectionStatus('connected');

        // MOVED: CHECK FOR PENDING GM SESSION INVITATION now handled in checkAutoJoin
        // This ensures the join is emitted on the multiplayer socket.

        // AUTO-REJOIN: If we have room data and were already connected, re-join automatically
        // This is CRITICAL for handling temporary socket disconnections (e.g. tab sleep, network swap)
        if (currentRoomRef.current) {
          const roomData = currentRoomRef.current;
          console.log('🔄 Socket connected, auto-rejoining room:', roomData.id);

          newSocket.emit('join_room', {
            roomId: roomData.persistentRoomId || roomData.id,
            playerName: currentPlayerRef.current?.name || 'Reconnecting...',
            password: roomPasswordRef.current || '',
            isReconnect: true,
            character: useCharacterStore.getState().getActiveCharacter() || null // CRITICAL FIX: Send character data on reconnect
          });

          const isPersistentRejoin = !!roomData?.persistentRoomId;
          if (isPersistentRejoin) {
            console.warn('🛡️ [Reconnect] Permanent room rejoin detected — ensuring data persists!');
          } else {
            // Keep legacy cleanup for temporary/test/non-permanent rooms
            clearCreatureTokens();
            clearCharacterTokens();
            console.log('🧹 Cleared tokens for room rejoin');
          }
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
        console.error('❌ Socket error in MultiplayerApp:', error);
        setIsConnecting(false);
        setIsJoiningRoom(false); // CRITICAL: Stop loading screen on error

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
        setIsJoiningRoom(false); // CRITICAL: Stop loading screen on connection error
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
    if (!socket) {
      cursorDebug('🖱️ [Cursor] Emit listener not attached: socket unavailable');
      return;
    }

    if (!showCursorTracking) {
      cursorDebug('🖱️ [Cursor] Emit listener not attached: showCursorTracking is disabled');
      return;
    }

    let lastEmitTime = 0;
    // Favor low-latency cursor updates while still bounding event rate
    const THROTTLE_MS = Math.max(12, Math.min(cursorUpdateThrottle || 16, 33)); // ~30-83 FPS envelope
    const MIN_WORLD_DELTA = 0.25; // Allow fine-grained movement without flooding
    let lastWorldX = null;
    let lastWorldY = null;

    const handleMouseMove = (event) => {
      // Keep guard minimal: requiring currentRoomRef here can block player emissions during certain join/resume timing windows.
      if (!socket.connected) return;

      const now = Date.now();
      if (now - lastEmitTime < THROTTLE_MS) return;

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

    // Add listener to document
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    cursorDebug('🖱️ Cursor tracking enabled - emitting cursor positions');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cursorDebug('🖱️ Cursor tracking disabled');
    };
  }, [socket, showCursorTracking, cursorUpdateThrottle]);


  // Handle authentication changes - reconnect socket with fresh token
  useEffect(() => {
    const authStore = require('../../store/authStore').default;

    const handleAuthChange = async () => {
      if (!socket) return;

      // CRITICAL FIX: Don't disconnect during active map transfers
      // This prevents the socket from being disconnected mid-transfer which causes
      // the RoomLobby to appear and the transfer to fail
      if (window._isMapSwitching) {
        console.log('⏭️ [Auth] Skipping socket reconnect during map switch');
        return;
      }

      // CRITICAL FIX: Don't disconnect if we're in a multiplayer room
      // The multiplayer socket must stay connected to receive room events
      const gameStore = require('../../store/gameStore').default;
      const isInMultiplayer = gameStore.getState().isInMultiplayer;
      if (isInMultiplayer) {
        console.log('⏭️ [Auth] Skipping socket reconnect - in multiplayer room');
        return;
      }

      try {
        const authState = authStore.getState();

        // Disconnect current socket if connected
        if (socket.connected) {
          socket.disconnect();
        }

        // Get fresh auth token (only for authenticated users, not guests)
        let authToken = null;
        if (authState.user && !authState.isDevelopmentBypass && !authState.user?.isGuest && authState.user.getIdToken) {
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

  // Consolidate all multiplayer socket listeners
  useEffect(() => {
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
          console.warn(`⚠️ High latency detected: ${latency}ms`);
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

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setConnectionStatus('disconnected');
      // Reset auto-join attempt on disconnect so it can retry on next connection
      // if we are still on the loading screen
      autoJoinAttemptedRef.current = false;
    });

    socket.on('error', (data) => {
      console.error('❌ Socket error received:', data);
      if (typeof data === 'object') {
        console.error('Socket Error Details:', JSON.stringify(data, null, 2));
      }

      if (isJoiningRoomRef.current && !currentRoomRef.current) {
        console.log('⚠️ Error during join/create, resetting loading state');
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

    socket.on('disconnect', (reason) => {
      setConnectionStatus(reason === 'io client disconnect' ? 'disconnected' : 'error');
      setConnectionQuality({ latency: 0, quality: 'disconnected' });

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

    // CRITICAL: Handle room_joined event
    socket.on('room_joined', (data) => {
      console.log('✅ [MultiplayerApp] room_joined received:', data);

      // Guard: If we're already in a room, ignore (RoomLobby might have handled it)
      if (currentRoomRef.current) {
        console.log('⚠️ [MultiplayerApp] Already in room, ignoring room_joined');
        return;
      }

      // Guard: Check for stale/duplicate join using join ID
      const joinId = data.room?.id || data.room?.persistentRoomId;
      if (activeJoinIdRef.current && activeJoinIdRef.current !== joinId) {
        console.log('⚠️ [MultiplayerApp] Stale room_joined (different room), ignoring', {
          activeJoinId: activeJoinIdRef.current,
          receivedJoinId: joinId
        });
        return;
      }

      // Guard: If we already have pending room data for the same room, don't overwrite
      if (pendingRoomDataRef.current && pendingRoomDataRef.current.room) {
        const pendingRoomId = pendingRoomDataRef.current.room.id || pendingRoomDataRef.current.room.persistentRoomId;
        if (pendingRoomId === joinId) {
          console.log('⚠️ [MultiplayerApp] Already have pending data for this room, ignoring duplicate');
          return;
        }
      }

      // Mark this join as active
      activeJoinIdRef.current = joinId;

      // Use server's playerCount directly (already includes GM - avoids double-counting)
      setActualPlayerCount(data.playerCount || 1);

      // Use explicit isGM flag from server
      const isGameMaster = data.isGM || data.isGMReconnect || false;

      // Get password from localStorage (auto-join flow stores it there)
      const usedPassword = localStorage.getItem('selectedRoomPassword') || '';

      // Clear auto-join flags
      localStorage.removeItem('selectedRoomId');
      localStorage.removeItem('selectedRoomPassword');

      // DETECT AUTO-CONTINUE INTENT
      // Skip "Continue" button for:
      // 1. Invitations (already verified via sessionStorage)
      // 2. Auto-joins (marked by isAutoJoinSequenceRef)
      // 3. New GM creations (captured by isJoiningRoomRef during the current session)
      const pendingInvitationStr = sessionStorage.getItem('pendingGMSessionInvitation');
      let shouldAutoContinue = isAutoJoinSequenceRef.current;

      console.log('🔍 [MultiplayerApp] Detecting auto-continue intent:', {
        isAutoJoinSequence: isAutoJoinSequenceRef.current,
        hasPendingInvitation: !!pendingInvitationStr,
        receivedJoinId: joinId
      });

      if (pendingInvitationStr) {
        try {
          const invitation = JSON.parse(pendingInvitationStr);
          console.log('🔍 [MultiplayerApp] Comparing invitation IDs:', {
            invitationRoomId: invitation.roomId,
            joinId: joinId
          });

          // Robust comparison: check if invitation.roomId matches joinId
          if (invitation.roomId === joinId ||
            (data.room?.persistentRoomId && invitation.roomId === data.room.persistentRoomId) ||
            (data.room?.id && invitation.roomId === data.room.id)) {
            console.log('✨ [MultiplayerApp] Verified invitation join for auto-continue:', invitation.partyName);
            shouldAutoContinue = true;
            sessionStorage.removeItem('pendingGMSessionInvitation');
          } else {
            console.warn('⚠️ [MultiplayerApp] Invitation Room ID mismatch:', {
              invitationRoomId: invitation.roomId,
              joinRoomId: data.room?.id,
              joinPersistentId: data.room?.persistentRoomId
            });
          }
        } catch (e) {
          console.error('❌ Failed to parse pending invitation in room_joined:', e);
        }
      }

      // Reset auto-join intent once captured in roomData
      isAutoJoinSequenceRef.current = false;

      // Record room data for the transition
      const roomData = {
        room: data.room,
        socket: socket,
        isGM: isGameMaster,
        player: data.player,
        password: usedPassword,
        levelEditor: data.levelEditor,
        gridSettings: data.gridSettings,
        isInvitationJoin: shouldAutoContinue // Flag to skip "Continue" button
      };

      // Store room data for the Continue button flow
      setPendingRoomData(roomData);
      pendingRoomDataRef.current = roomData;
      setIsRoomReady(true);

      // Update URL with room code for shareable links
      const roomCode = data.room.persistentRoomId || data.room.id;
      if (roomCode) {
        navigate(`/multiplayer/${roomCode}`, { replace: true });
      }

      console.log('✅ [MultiplayerApp] Room data stored and isRoomReady set to true', {
        room: data.room.name,
        isInvitationJoin: shouldAutoContinue,
        isGM: isGameMaster
      });

      if (shouldAutoContinue) {
        setLoadingStatusMessage('Finalizing entry...');
      } else {
        setLoadingStatusMessage(null); // Clear custom message so default stage text takes over
      }
    });

    // CRITICAL: Handle room_created event for GM resume flow
    // The server emits room_created, then immediately room_joined
    socket.on('room_created', (data) => {
      console.log('✅ [MultiplayerApp] room_created received:', data);
      console.log('🔍 Room structure check:', {
        hasRoom: !!data.room,
        hasPersistentRoomId: !!data.room?.persistentRoomId,
        roomId: data.room?.id,
        persistentRoomId: data.room?.persistentRoomId
      });

      // Note: Party members are already cleared BEFORE create_room is emitted
      // This is just a safety check in case clear failed earlier
      try {
        const currentPartyMembers = usePartyStore.getState().partyMembers || [];
        // Only clear if there are still members (safety check)
        if (currentPartyMembers.length > 0 && currentPartyMembers.some(m => !m.isGM)) {
          console.log('🧹 Safety clear: Removing non-GM party members on room_created');
          const gmsOnly = currentPartyMembers.filter(m => m.isGM);
          usePartyStore.getState().replacePartyMembers(gmsOnly);
        }
      } catch (e) {
        console.warn('⚠️ Failed to verify party members on room_created:', e);
      }

      // Update URL with room code for shareable links
      const roomCode = data.room.persistentRoomId || data.room.id;
      if (roomCode) {
        navigate(`/multiplayer/${roomCode}`, { replace: true });
      }

      // Clear any remaining auto-join flags
      localStorage.removeItem('selectedRoomId');
      localStorage.removeItem('selectedRoomPassword');
      localStorage.removeItem('isGMResume');
      localStorage.removeItem('resumeRoomName');

      // The room_joined event will follow shortly and handle the actual join
      console.log('✅ Room created/resumed successfully, waiting for room_joined:', roomCode);
    });

    // Listen for player join/leave events
    socket.on('player_joined', async (data) => {
      if (!data || !data.player) return;

      // Server sends total count (players + GM), use it directly
      setActualPlayerCount(data.playerCount || 1);

      // Update player locations if provided
      if (data.room && data.room.playerMapAssignments) {
        usePartyStore.getState().setAllPlayerMapAssignments(data.room.playerMapAssignments);
      } else if (data.player && data.player.currentMapId) {
        usePartyStore.getState().setPlayerMapAssignment(data.player.id, data.player.currentMapId);
      }

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

        // CRITICAL FIX: If we're on the loading screen (pendingRoomData exists), 
        // add the player to the pending room data's players list so they are picked up 
        // when handleJoinRoom is finally called.
        if (pendingRoomDataRef.current && pendingRoomDataRef.current.room) {
          const room = pendingRoomDataRef.current.room;
          if (!room.players) room.players = [];

          const playerExistsInPending = Array.isArray(room.players)
            ? room.players.some(p => p.id === data.player.id)
            : (room.players instanceof Map ? room.players.has(data.player.id) : room.players[data.player.id]);

          if (!playerExistsInPending) {
            console.log('📦 Buffering joined player into pendingRoomData:', data.player.name);
            if (Array.isArray(room.players)) {
              room.players.push(data.player);
            } else if (room.players instanceof Map) {
              room.players.set(data.player.id, data.player);
            } else {
              room.players[data.player.id] = data.player;
            }
          }
        }

        return updated;
      });

      // Show player join notification (only if currentRoom is set)
      if (currentRoomRef.current) {
        showPlayerJoinNotification(data.player.name, currentRoomRef.current.name);
      }


      // Use character name if available, otherwise fall back to player name
      let playerCharacterName = data.player.character?.name || data.player.name;

      // CRITICAL: Use account name as fallback for "Character Name"
      if (playerCharacterName === 'Character Name' || playerCharacterName === 'Character Name (Room Name)') {
        playerCharacterName = data.player.accountName || data.player.name || 'Player';
      }

      // Skip adding ourselves to prevent duplicate HUDs - check strict IDs only
      // CRITICAL FIX: Do NOT check by name, as multiple players (or GM) might have the same name/account during testing
      const isCurrentPlayer = data.player.id === currentPlayerRef.current?.id ||
        data.player.socketId === socket?.id;

      if (!isCurrentPlayer) {

        // Calculate proper race display name from race and subrace data
        let raceDisplayName = data.player.character?.raceDisplayName || 'Unknown';

        console.log('🆔 player_joined - Adding party member with:', {
          playerId: data.player.id,
          playerSocketId: data.player.socketId,
          playerUserId: data.player.userId,
          playerName: playerCharacterName,
          serverPlayerName: data.player.name
        });

        // Add to party system with character data first
        // CRITICAL FIX: Ensure isGM is explicitly false for joining players (only room creator is GM)
        // CRITICAL FIX: Add isConnected: true since player has actually joined the room
        const playerCharClassResource = data.player.character?.classResource;
        const newPartyMember = {
          id: data.player.id,
          socketId: data.player.socketId || data.player.id, // CRITICAL: Store actual socket.io ID for character_updated lookups
          userId: data.player.userId, // CRITICAL: Firebase UID for reliable identification
          name: playerCharacterName,
          isGM: false, // Joining players are never GM - only room creator is GM
          isConnected: true, // Player has actually joined the room
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
            tokenSettings: data.player.character?.tokenSettings || {}, // Include token settings
            lore: data.player.character?.lore || {} // Include lore (which contains characterImage)
          }
        };

        // Only add classResource if it has a valid max value (prevents 0/0 bar)
        if (playerCharClassResource?.max) {
          newPartyMember.character.classResource = playerCharClassResource;
        }

        // Add party member
        addPartyMember(newPartyMember);

        // Then update with proper race display name if needed
        if (data.player.character?.race && data.player.character?.subrace) {
          import('../../data/raceData').then(({ getFullRaceData }) => {
            const raceData = getFullRaceData(data.player.character.race, data.player.character.subrace);
            if (raceData) {
              const updatedRaceDisplayName = `${raceData.subrace.name} ${raceData.race.name}`;
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

          // CRITICAL: Also broadcast OUR character to the newcomer so they see us correctly
          import('../../store/characterStore').then(({ default: useCharacterStore }) => {
            useCharacterStore.getState().syncWithMultiplayer();
            console.log('📤 Broadcasted local character to newcomer:', playerCharacterName);
          });
        }
      }

      // ===== RE-ENABLED WITH MAP-SPECIFIC FILTERING =====
      // FIX: GM now broadcasts map-specific terrain based on player's assigned map
      // Players receive data only for the map they're assigned to, preventing cross-map contamination
      if (isGMRef.current && socket && socket.connected) {
        console.log('🗺️ GM broadcasting map-specific state to new player:', data.player.name);

        try {
          const levelEditorStore = useLevelEditorStore.getState();
          const gameStore = useGameStore.getState();
          const mapStore = useMapStore.getState();

          // Get the player's assigned map ID - use default if not specified
          const playerMapId = data.playerMapId || 'default';

          // CRITICAL FIX: Get terrain data from the player's assigned map in mapStore
          // This prevents sending current GM view's terrain to a player on a different map
          const playerMap = (mapStore.maps || []).find(m => m.id === playerMapId);

          // Use map-specific data if available, otherwise fall back to global (for 'default' map)
          const mapTerrainData = playerMap?.terrainData || (playerMapId === mapStore.currentMapId ? levelEditorStore.terrainData : {}) || {};
          const mapWallData = playerMap?.wallData || (playerMapId === mapStore.currentMapId ? levelEditorStore.wallData : {}) || {};
          const mapDrawingPaths = playerMap?.drawingPaths || (playerMapId === mapStore.currentMapId ? levelEditorStore.drawingPaths : []) || [];
          const mapDrawingLayers = playerMap?.drawingLayers || (playerMapId === mapStore.currentMapId ? levelEditorStore.drawingLayers : []) || [];
          const mapFogOfWarData = playerMap?.fogOfWarData || (playerMapId === mapStore.currentMapId ? levelEditorStore.fogOfWarData : {}) || {};
          const mapFogOfWarPaths = playerMap?.fogOfWarPaths || (playerMapId === mapStore.currentMapId ? levelEditorStore.fogOfWarPaths : []) || [];
          const mapFogErasePaths = playerMap?.fogErasePaths || (playerMapId === mapStore.currentMapId ? levelEditorStore.fogErasePaths : []) || [];
          const mapDndElements = playerMap?.dndElements || (playerMapId === mapStore.currentMapId ? levelEditorStore.dndElements : []) || [];

          // Map-specific overlays (windows, doors, etc.)
          const mapWindowOverlays = playerMap?.windowOverlays || (playerMapId === mapStore.currentMapId ? levelEditorStore.windowOverlays : {}) || {};

          console.log(`🗺️ Sending terrain for map ${playerMapId}:`, {
            terrainTileCount: Object.keys(mapTerrainData).length,
            isFromMapStore: !!playerMap?.terrainData,
            gmCurrentMap: mapStore.currentMapId
          });

          socket.emit('sync_level_editor_state', {
            mapId: playerMapId,
            levelEditor: {
              terrainData: mapTerrainData,
              wallData: mapWallData,
              windowOverlays: mapWindowOverlays,
              environmentalObjects: playerMap?.environmentalObjects || levelEditorStore.environmentalObjects || [],
              drawingPaths: mapDrawingPaths,
              drawingLayers: mapDrawingLayers,
              fogOfWarData: mapFogOfWarData,
              fogOfWarPaths: mapFogOfWarPaths,
              fogErasePaths: mapFogErasePaths,
              exploredAreas: playerMap?.exploredAreas || levelEditorStore.exploredAreas || {},
              lightSources: playerMap?.lightSources || levelEditorStore.lightSources || {},
              dynamicFogEnabled: levelEditorStore.dynamicFogEnabled,
              respectLineOfSight: levelEditorStore.respectLineOfSight,
              dndElements: mapDndElements
            },
            gridSettings: {
              gridType: playerMap?.gridSettings?.gridType || gameStore.gridType || 'square',
              gridSize: playerMap?.gridSettings?.gridSize || gameStore.gridSize || 50,
              gridOffsetX: playerMap?.gridSettings?.gridOffsetX || gameStore.gridOffsetX || 0,
              gridOffsetY: playerMap?.gridSettings?.gridOffsetY || gameStore.gridOffsetY || 0,
              gridLineColor: playerMap?.gridSettings?.gridLineColor || gameStore.gridLineColor || 'rgba(255, 255, 255, 0.8)',
              gridLineThickness: playerMap?.gridSettings?.gridLineThickness || gameStore.gridLineThickness || 2,
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

          // CRITICAL: Explicitly broadcast tokens for the specific map
          const creatureStore = (await import('../../store/creatureStore')).default.getState();
          const tokens = Object.fromEntries(
            Object.entries(creatureStore.tokens || {}).filter(([_, t]) => (t.mapId || 'default') === playerMapId)
          );

          if (Object.keys(tokens).length > 0) {
            console.log(`📤 Broadcasting ${Object.keys(tokens).length} tokens for map ${playerMapId}`);
            socket.emit('sync_tokens', {
              mapId: playerMapId,
              tokens: tokens,
              recipientPlayerId: data.player.id // Optional hint for server to only send to this player
            });
          }

          // CRITICAL: Explicitly broadcast grid items for the specific map
          const gridItemStore = (await import('../../store/gridItemStore')).default.getState();
          const gridItems = (gridItemStore.gridItems || []).filter(item => (item.mapId || 'default') === playerMapId);

          if (gridItems.length > 0) {
            console.log(`📤 Broadcasting ${gridItems.length} grid items for map ${playerMapId}`);
            socket.emit('sync_grid_items', {
              mapId: playerMapId,
              gridItems: Object.fromEntries(gridItems.map(item => [item.id, item])),
              recipientPlayerId: data.player.id
            });
          }

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

    // Listen for character token creation
    socket.on('character_token_created', (data) => {
      if (data && data.position) {
        // CRITICAL: Pass mapId for proper map isolation
        addCharacterTokenFromServer(data.tokenId, data.position, data.playerId, data.mapId);
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

    // PARTY INVITATION RESPONSE HANDLERS (fallback for when invite sent via multiplayer socket)
    // These mirror the handlers in presenceStore.js for cross-socket compatibility
    socket.on('invitation_sent', ({ invitationId, toUserId }) => {
      console.log('📤 [MultiplayerApp] invitation_sent received:', { invitationId, toUserId });
      import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
        usePresenceStore.setState(state => {
          const updatedInvites = state.sentPartyInvites.map(inv => {
            const isRecent = Date.now() - inv.sentAt < 5000;
            if (inv.targetUserId === toUserId || (inv.invitationId === null && isRecent)) {
              return { ...inv, invitationId };
            }
            return inv;
          });
          return { sentPartyInvites: updatedInvites };
        });
      });
    });

    socket.on('party_invitation_accepted', ({ invitationId, userId, userName }) => {
      console.log('✅ [MultiplayerApp] party_invitation_accepted:', userName);
      // NOTE: Only update sentPartyInvites list. Notifications handled by presenceStore party_invite_accepted
      import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
        const store = usePresenceStore.getState();
        const updatedInvites = store.sentPartyInvites.map(inv => {
          const matches = inv.invitationId === invitationId ||
            inv.targetUserId === userId ||
            inv.targetName === userName;
          return matches ? { ...inv, outcome: 'accepted' } : inv;
        });
        usePresenceStore.setState({
          sentPartyInvites: updatedInvites
          // REMOVED: Duplicate toast - handled by presenceStore party_invite_accepted
        });
      });
    });

    socket.on('party_invitation_declined', ({ invitationId, userId, userName }) => {
      console.log('❌ [MultiplayerApp] party_invitation_declined:', userName);
      // NOTE: Only update sentPartyInvites list. Notifications handled by presenceStore
      import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
        const store = usePresenceStore.getState();
        const updatedInvites = store.sentPartyInvites.map(inv => {
          const matches = inv.invitationId === invitationId ||
            inv.targetUserId === userId ||
            inv.targetName === userName;
          return matches ? { ...inv, outcome: 'declined' } : inv;
        });
        usePresenceStore.setState({
          sentPartyInvites: updatedInvites
          // REMOVED: Duplicate toast - handled by presenceStore
        });
      });
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

    // Listen for character resource updates from other players
    // CONSOLIDATED: Handles both formats:
    // - Format 1: {playerId, playerName, resource, current, max, temp, adjustment} - from GM updates
    // - Format 2: {senderSocketId, characterId, newValues, deltas} - from player self-updates
    socket.on('character_resource_updated', (data) => {
      if (!data) return;

      const currentPlayerId = currentPlayerRef.current?.id;
      const currentPlayerName = currentPlayerRef.current?.name;

      // Detect format and handle accordingly
      if (data.resource !== undefined && data.current !== undefined) {
        // Format 1: Single resource update from GM
        const { playerId, playerName, resource, current, max, temp, adjustment } = data;

        // CRITICAL FIX: Define identifiers needed for robust self-check
        const { user } = useAuthStore.getState();
        const currentUserId = user?.uid;
        const currentSocketId = socket?.id;
        const myServerId = currentPlayerRef.current?.id;

        // Check if this update is for the current player (GM updating us, or our own update echoing back)
        const isCurrentPlayer =
          playerId === 'current-player' ||
          (currentUserId && (playerId === currentUserId || data.userId === currentUserId)) ||
          (myServerId && (playerId === myServerId || data.userId === myServerId)) ||
          (currentSocketId && (playerId === currentSocketId || data.socketId === currentSocketId)) ||
          (playerName && playerName === currentPlayerName);

        console.log('🔍 character_resource_updated check:', {
          receivedPlayerId: playerId,
          receivedUserId: data.userId,
          receivedSocketId: data.socketId,
          receivedPlayerName: playerName,
          currentPlayerId,
          myServerId,
          currentUserId,
          isCurrentPlayer,
          resource,
          current,
          max
        });

        if (isCurrentPlayer) {
          // Update current player's character store directly
          const charStore = require('../../store/characterStore').default;

          if (resource === 'classResource') {
            // Class resource update - use the full classResource object if provided
            if (data.classResource) {
              // Use the hook's setState directly instead of trying to call it on the state object
              charStore.setState({ classResource: data.classResource });
            } else {
              charStore.getState().updateClassResource('current', current, true, true);
              charStore.getState().updateClassResource('max', max, true, true);
            }
          } else {
            charStore.getState().updateResource(resource, current, max, temp, true, true);
          }

          // Scrolling combat text removed per user request to eliminate wild animations
          if (false && window.showFloatingCombatText && adjustment && adjustment !== 0) {
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

          console.log(`💊 Resource sync: ${resource} updated to ${current}/${max}${temp !== undefined ? ` (Temp: ${temp})` : ''}`);
        } else {
          // Update the party member's resource
          // CRITICAL FIX: Find the correct party member by multiple ID types
          const partyStore = usePartyStore.getState();
          const targetMember = partyStore.partyMembers.find(m =>
            m.id === playerId ||
            m.id === data.userId ||
            m.id === data.socketId ||
            m.userId === playerId ||
            m.userId === data.userId ||
            m.socketId === playerId ||
            m.socketId === data.socketId ||
            (playerName && m.name === playerName)
          );

          if (!targetMember) {
            console.warn('⚠️ character_resource_updated: Party member not found', {
              playerId,
              userId: data.userId,
              socketId: data.socketId,
              playerName,
              availableMembers: partyStore.partyMembers.map(m => ({ id: m.id, userId: m.userId, socketId: m.socketId, name: m.name }))
            });
            return;
          }

          const memberUpdate = {
            character: {}
          };

          if (resource === 'classResource') {
            // Class resource update
            memberUpdate.character.classResource = data.classResource || { current, max };
          } else {
            memberUpdate.character[resource] = { current, max };
          }

          // Also update temporary resources if provided
          if (temp !== undefined && resource !== 'classResource') {
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

          // Use the found member's ID for the update
          updatePartyMember(targetMember.id, memberUpdate);

          // Scrolling combat text removed per user request to eliminate wild animations
          if (false && window.showFloatingCombatText && adjustment && adjustment !== 0) {
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
      } else if (data.newValues || data.deltas) {
        // Format 2: Delta-based update from another player's self-update
        const senderSocketId = data.senderSocketId || data.socketId || data.updatedBy;
        const senderUserId = data.userId || data.senderUserId;
        const characterId = data.characterId;
        const updatedBy = data.updatedBy;

        // Skip if this is our own update (we already updated locally)
        const mySocketId = socket?.id;
        const myServerId = useGameStore.getState().currentPlayer?.id;
        const myUserId = useAuthStore.getState().user?.uid;

        if ((senderSocketId && senderSocketId === mySocketId) ||
          (updatedBy && updatedBy === mySocketId) ||
          (senderUserId && senderUserId === myUserId) ||
          (updatedBy && updatedBy === myServerId)) {
          return;
        }

        const partyStore = usePartyStore.getState();
        let partyMember = partyStore.partyMembers.find(m =>
          (senderUserId && m.userId === senderUserId) || // Match by Firebase UID (Most stable)
          (senderSocketId && m.socketId === senderSocketId) || // Match by current socket ID
          (characterId && m.id === characterId) || // Match by character/server ID
          (updatedBy && (m.id === updatedBy || m.socketId === updatedBy)) // Match by updatedBy
        );

        // FALLBACK: If not found and this is likely from GM
        if (!partyMember && !characterId) {
          const gmMember = partyStore.partyMembers.find(m => m.isGM && m.id !== 'current-player');
          if (gmMember) partyMember = gmMember;
        }

        console.log('💊 Multi-resource sync check:', {
          found: !!partyMember,
          name: partyMember?.name,
          senderUserId,
          senderSocketId,
          characterId
        });

        if (!partyMember) return;

        const updates = { character: {} };

        // Handle delta-based updates
        if (data.newValues) {
          Object.entries(data.newValues).forEach(([resource, value]) => {
            if (resource === 'classResource') {
              updates.character.classResource = data.classResource || {
                current: value,
                max: data.max || partyMember.character?.classResource?.max || 5
              };
            } else {
              updates.character[resource] = {
                current: value,
                max: data.max || partyMember.character?.[resource]?.max || 100
              };
            }
          });
        }

        // Also handle classResource if explicitly provided
        if (data.classResource) {
          updates.character.classResource = data.classResource;
        }

        usePartyStore.getState().updatePartyMember(partyMember.id, updates, true);
        console.log(`💊 Synced ${partyMember.name}'s resources from their update`);
      }
    });

    // Listen for GM actions (XP awards, rests, etc.)
    socket.on('gm_action', (data) => {
      if (!data) return;
      const { type, amount, targetPlayerId, targetUserId, targetPlayerIds } = data;

      // CRITICAL FIX: Verify if this player is the intended target
      const myId = currentPlayerRef.current?.id;
      const myUserId = useAuthStore.getState().user?.uid;
      const mySocketId = socket?.id;

      // Support both singular (targetPlayerId/targetUserId) and plural (targetPlayerIds array) formats
      const isTarget = (() => {
        // If no targeting specified, broadcast to all
        if (!targetPlayerId && !targetUserId && (!targetPlayerIds || targetPlayerIds.length === 0)) {
          return true;
        }
        // Check array format (targetPlayerIds)
        if (targetPlayerIds && Array.isArray(targetPlayerIds) && targetPlayerIds.length > 0) {
          return targetPlayerIds.some(id =>
            id === 'current-player' ||
            id === myId ||
            id === myUserId ||
            id === mySocketId
          );
        }
        // Check singular format (targetPlayerId/targetUserId)
        return (targetPlayerId === 'current-player') ||
          (myId && (targetPlayerId === myId || targetUserId === myId)) ||
          (myUserId && (targetUserId === myUserId || targetPlayerId === myUserId)) ||
          (mySocketId && (targetPlayerId === mySocketId || targetUserId === mySocketId));
      })();

      if (!isTarget) {
        console.log('🎮 GM action ignored (not target):', type, { targetPlayerId, targetUserId, targetPlayerIds, myId, myUserId });
        return;
      }

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

        case 'heal_all':
          // Heal local character
          import('../../store/characterStore').then(({ default: useCharacterStore }) => {
            const charStore = useCharacterStore.getState();
            charStore.updateResource('health', charStore.health.max, charStore.health.max);

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has fully healed the party.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
            console.log('💚 Party healed by GM');
          });
          break;

        case 'clear_fog':
          // Clear fog locally
          import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
            useLevelEditorStore.getState().clearAllFog();
            console.log('🌫️ Fog cleared by GM');
          });
          break;

        case 'reset_combat':
          // Reset combat locally
          import('../../store/combatStore').then(({ default: useCombatStore }) => {
            useCombatStore.getState().forceResetCombat();
            console.log('⚔️ Combat reset by GM');
          });
          break;

        default:
          console.warn('Unknown GM action type:', type);
      }
    });

    // Listen for buff updates from other players
    socket.on('buff_update', (data) => {
      if (!data) return;
      const { type, data: buffData, senderSocketId } = data;

      // Skip if we sent this
      if (senderSocketId === socket?.id) return;

      console.log('✨ Received buff update:', type, buffData);

      import('../../store/buffStore').then(({ default: useBuffStore }) => {
        const buffStore = useBuffStore.getState();
        if (type === 'buff_added') {
          // Add buff silently (don't re-sync)
          buffStore.addBuff(buffData, true);
        } else if (type === 'buff_removed') {
          // Remove buff silently (don't re-sync)
          buffStore.removeBuff(data.buffId || buffData.id, true);
        }
      });
    });

    // Listen for debuff updates from other players
    socket.on('debuff_update', (data) => {
      if (!data) return;
      const { type, data: debuffData, senderSocketId } = data;

      // Skip if we sent this
      if (senderSocketId === socket?.id) return;

      console.log('🥀 Received debuff update:', type, debuffData);

      import('../../store/debuffStore').then(({ default: useDebuffStore }) => {
        const debuffStore = useDebuffStore.getState();
        if (type === 'debuff_added') {
          // Add debuff silently (don't re-sync)
          debuffStore.addDebuff(debuffData, true);
        } else if (type === 'debuff_removed') {
          // Remove debuff silently (don't re-sync)
          debuffStore.removeDebuff(data.debuffId || debuffData.id, true);
        }
      });
    });


    // Listen for gameplay settings synchronization from GM
    socket.on('sync_gameplay_settings', (data) => {
      if (!data) return;
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
      if (!data) return;
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
      if (!data) return;
      console.log('🏳️ Received combat_ended from server:', data);

      // Reset combat store
      useCombatStore.getState().forceResetCombat();

      console.log('🏳️ Combat ended - timeline hidden');
    });

    // Listen for combat turn changes from GM
    socket.on('combat_turn_changed', (data) => {
      if (!data) return;
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
      if (!data || !data.player) return;

      // CRITICAL FIX: Check if the leaving player is the current player
      // If so, navigate to landing page (they were disconnected)
      if (data.player.id === currentPlayerRef.current?.id) {
        handleLeaveRoom();
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 200);
        return;
      }

      // Server sends total count (players + GM), use it directly
      setActualPlayerCount(data.playerCount || 1);

      setConnectedPlayers(prev => {
        const updated = prev.filter(player => player.id !== data.player.id);

        // CRITICAL FIX: Also remove from pendingRoomData if we're on the loading screen
        if (pendingRoomDataRef.current && pendingRoomDataRef.current.room) {
          const room = pendingRoomDataRef.current.room;
          if (room.players) {
            if (Array.isArray(room.players)) {
              pendingRoomDataRef.current.room.players = room.players.filter(p => p.id !== data.player.id);
            } else if (room.players instanceof Map) {
              room.players.delete(data.player.id);
            } else {
              delete room.players[data.player.id];
            }
            console.log('📦 Removed player from buffered pendingRoomData:', data.player.name);
          }
        }

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
      if (!message) return;

      chatDebug('💬 [socket:chat_message] inbound', {
        id: message?.id,
        messageId: message?.messageId,
        senderId: message?.senderId,
        playerId: message?.playerId,
        type: message?.type,
        hasContent: !!(message?.content || message?.message)
      });

      const resolvedSenderId = message.playerId || message.senderId || message.userId || message.socketId || null;
      const resolvedSenderName = message.playerName || message.senderName || message.characterName || 'Unknown';
      const resolvedTimestamp = message.timestamp || message.serverTimestamp || new Date().toISOString();
      const resolvedContent = message.content || message.message || '';
      const matchedPartyMember = usePartyStore.getState().partyMembers.find((member) =>
        member?.id === resolvedSenderId ||
        member?.socketId === resolvedSenderId ||
        (resolvedSenderName && member?.name === resolvedSenderName)
      );
      const normalizedSenderId = matchedPartyMember?.id || resolvedSenderId || 'unknown_party_sender';
      const normalizedMessageId =
        message?.id ||
        message?.messageId ||
        message?.clientMessageId ||
        `${normalizedSenderId}:${resolvedTimestamp}:${resolvedContent}`;

      if (!resolvedContent) {
        console.warn('⚠️ Dropping empty party chat payload from socket:', message);
        return;
      }

      const presenceStore = usePresenceStore.getState();
      const beforeCount = presenceStore.partyChatMessages.length;
      const normalizedPartyType =
        message?.type === 'party' ||
          message?.type === 'chat' ||
          message?.type === 'message'
          ? 'party'
          : 'party';

      // Add to notifications
      addNotification('social', {
        sender: {
          name: resolvedSenderName,
          class: message?.isGM ? 'GM' : 'Player',
          level: 1,
          playerColor: message?.playerColor || (message?.isGM ? '#d4af37' : '#4a90e2')
        },
        content: resolvedContent,
        type: 'message',
        timestamp: resolvedTimestamp,
        playerId: normalizedSenderId,
        isGM: message?.isGM
      });

      // Add to presence store party chat (always, once non-empty and normalized)
      presenceStore.addPartyChatMessage({
        id: normalizedMessageId,
        messageId: message?.messageId || normalizedMessageId,
        senderId: normalizedSenderId,
        playerId: normalizedSenderId,
        senderName: resolvedSenderName,
        playerName: resolvedSenderName,
        senderClass: message?.isGM ? 'GM' : 'Player',
        senderLevel: 1,
        content: resolvedContent,
        timestamp: resolvedTimestamp,
        type: normalizedPartyType
      });

      const afterCount = usePresenceStore.getState().partyChatMessages.length;
      chatDebug('💬 [socket:chat_message] appended', {
        normalizedMessageId,
        normalizedSenderId,
        beforeCount,
        afterCount,
        delta: afterCount - beforeCount
      });
    });

    // Listen for global chat messages to sync with presence store
    socket.on('global_chat_message', (message) => {
      if (!message) return;

      chatDebug('🌐 [socket:global_chat_message] inbound', {
        id: message?.id,
        messageId: message?.messageId,
        senderId: message?.senderId,
        playerId: message?.playerId,
        type: message?.type,
        hasContent: !!(message?.content || message?.message)
      });
      try {
        const resolvedSenderId = message.playerId || message.senderId || message.userId || message.socketId || null;
        const resolvedSenderName = message.playerName || message.senderName || message.characterName || 'Unknown';
        const resolvedTimestamp = message.timestamp || message.serverTimestamp || new Date().toISOString();
        const resolvedContent = message.content || message.message || '';
        const matchedPartyMember = usePartyStore.getState().partyMembers.find((member) =>
          member?.id === resolvedSenderId ||
          member?.socketId === resolvedSenderId ||
          (resolvedSenderName && member?.name === resolvedSenderName)
        );
        const normalizedSenderId = matchedPartyMember?.id || resolvedSenderId || 'unknown_global_sender';
        const normalizedMessageId =
          message?.id ||
          message?.messageId ||
          message?.clientMessageId ||
          `${normalizedSenderId}:${resolvedTimestamp}:${resolvedContent}`;

        if (!resolvedContent) {
          console.warn('⚠️ Dropping empty global chat payload from socket:', message);
          return;
        }

        const presenceStore = usePresenceStore.getState();
        const beforeCount = presenceStore.globalChatMessages.length;

        presenceStore.addGlobalMessage({
          ...message,
          id: normalizedMessageId,
          messageId: message.messageId || normalizedMessageId,
          senderId: normalizedSenderId,
          playerId: normalizedSenderId,
          senderName: resolvedSenderName,
          playerName: resolvedSenderName,
          content: resolvedContent,
          message: resolvedContent,
          timestamp: resolvedTimestamp,
          type: message.type || 'message'
        });

        const afterCount = usePresenceStore.getState().globalChatMessages.length;
        chatDebug('🌐 [socket:global_chat_message] appended', {
          normalizedMessageId,
          normalizedSenderId,
          beforeCount,
          afterCount,
          delta: afterCount - beforeCount
        });
      } catch (error) {
        console.error('❌ Failed to add global chat message:', error);
      }
    });

    // ========== CRITICAL: Level Editor State Synchronization ==========
    // Listen for level editor state sync from GM
    // FIXED: Server emits 'level_editor_state_synced' (past tense)
    socket.on('level_editor_state_synced', (data) => {
      console.log('🗺️ Received level_editor_state_sync:', {
        mapId: data.mapId,
        hasLevelEditor: !!data.levelEditor,
        hasGridSettings: !!data.gridSettings
      });

      // CRITICAL FIX: Only process level editor sync if it's for our current map
      // This prevents terrain bleeding between maps
      if (data.mapId && data.mapId !== playerCurrentMapIdRef.current) {
        console.log(`[LevelEditorSync] Ignoring sync for map ${data.mapId} (we are on ${playerCurrentMapIdRef.current})`);
        return;
      }

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
          if (data.levelEditor.windowOverlays !== undefined) {
            levelEditorStore.setWindowOverlays(data.levelEditor.windowOverlays);
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
          if (data.levelEditor.gridItems !== undefined) {
            import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
              const currentItems = useGridItemStore.getState().gridItems || [];
              const otherMapItems = currentItems.filter(item => item.mapId !== (data.mapId || 'default'));
              useGridItemStore.setState({
                gridItems: [...otherMapItems, ...data.levelEditor.gridItems]
              });
            });
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

    // Event reordering buffer - ensures events process in intended order
    const eventBuffer = [];
    const MAX_BUFFER_SIZE = 50;
    const BUFFER_PROCESS_DELAY = 50;
    let highestProcessedSequence = 0;
    let processBufferTimeout = null;

    // ========== SOCKET EVENT HANDLERS ==========
    // These process incoming updates from the server and other players


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
        isFromSelf: data.playerId === socket?.id
      });

      // CRITICAL FIX: Filter by mapId to prevent cross-map contamination
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const tokenMapId = data.mapId || data.token?.mapId || 'default';

      if (tokenMapId !== currentMapId) {
        console.log(`🎭 Skipping token_moved - different map (token: ${tokenMapId}, current: ${currentMapId})`);
        return;
      }

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

      const isOwnMovement = (data.playerId === socket?.id) && isDraggingOurToken;

      // Standardized tracking key
      const recentMovementKey = `token_${targetId}`;
      const recentMovementTime = window.recentTokenMovements?.get(recentMovementKey)?.timestamp;
      const hasRecentLocalMovement = recentMovementTime && (Date.now() - recentMovementTime) < 1000 &&
        data.playerId === socket?.id;

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
                  if (data.playerId === socket?.id) {
                    return;
                  }

                  // CRITICAL FIX: Find token by unique token ID token OR creatureId in BOTH stores
                  const creatureStore = useCreatureStore.getState();
                  let token = creatureStore.tokens.find(t => t.id === update.targetId || t.creatureId === update.targetId);
                  let isCreature = true;

                  // If not found in creature store, check character token store
                  if (!token) {
                    try {
                      const charTokenStore = require('../../store/characterTokenStore').default.getState();
                      token = charTokenStore.characterTokens.find(t => t.id === update.targetId);
                      isCreature = false;
                    } catch (e) {
                      console.warn('Could not check characterTokenStore:', e);
                    }
                  }

                  if (token) {
                    // CRITICAL FIX: Only update position if it's significantly different to prevent micro-jumps
                    const currentTokenPosition = token.position || { x: 0, y: 0 };

                    // Safety check for update.position
                    if (!update.position || update.position.x === undefined) {
                      console.warn('⚠️ Invalid position in movement update:', update.position);
                      return;
                    }

                    const distance = Math.sqrt(
                      Math.pow(update.position.x - currentTokenPosition.x, 2) +
                      Math.pow(update.position.y - currentTokenPosition.y, 2)
                    );

                    // CRITICAL FIX: Always update position when dragging starts or when distance is significant
                    const shouldUpdate = data.isDragging || distance > 1 || distance === 0;

                    if (shouldUpdate) {
                      const myRole = isGMRef.current ? 'GM' : 'Player';
                      console.log(`✅ [${myRole}] Updating ${isCreature ? 'creature' : 'character'} token position:`, {
                        tokenId: token.id,
                        from: { x: Math.round(currentTokenPosition.x), y: Math.round(currentTokenPosition.y) },
                        to: { x: Math.round(update.position.x), y: Math.round(update.position.y) }
                      });

                      if (isCreature) {
                        updateCreatureTokenPosition(token.id, {
                          ...update.position,
                          isSyncEvent: true
                        });
                      } else {
                        // For character tokens, use their specialized update function
                        try {
                          const charTokenStore = require('../../store/characterTokenStore').default.getState();
                          charTokenStore.addCharacterTokenFromServer(token.id, update.position, token.playerId, token.mapId);
                        } catch (e) {
                          console.warn('Failed to update character token position:', e);
                        }
                      }
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
        }, 5); // Reduced delay for maximum responsiveness
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
      if (updatedBy === socket?.id) return;

      const { updateTokenState } = require('../../store/creatureStore').default.getState();
      // Apply update locally, but don't re-emit to server
      updateTokenState(tokenId, stateUpdates, false);
    });

    // Listen for creature state updates (HP, status, buffs) from GM
    socket.on('creature_updated', (data) => {
      const { tokenId, stateUpdates, updatedBy, mapId } = data;

      // Skip if we are the one who sent it
      if (updatedBy === socket?.id) return;

      const creatureStore = require('../../store/creatureStore').default.getState();
      // Apply creature state update locally without re-emitting
      creatureStore.updateTokenState(tokenId, stateUpdates, false);
      console.log('🐉 Received creature_updated:', { tokenId, stateUpdates, mapId });
    });

    // Listen for generic token updates (HP, Mana, conditions)
    socket.on('token_updated', (data) => {
      const { tokenId, updates, updatedBy, mapId } = data;

      // Skip if we are the one who sent it
      if (updatedBy === socket?.id) return;

      const creatureStore = require('../../store/creatureStore').default.getState();

      // Check if this token is a creature in our store
      const token = creatureStore.creatureTokens.find(t => t.id === tokenId);
      if (token) {
        // Apply creature state update locally without re-emitting
        creatureStore.updateTokenState(tokenId, updates, false);
        console.log('🐉 Received token_updated for creature:', { tokenId, updates, mapId });
      }
    });

    // Listen for buff updates from other players/GM
    socket.on('buff_update', (data) => {
      const { type, data: buffData, senderSocketId } = data;
      // Skip if we are the one who sent it (senderSocketId is usually the one who emitted)
      if (senderSocketId === socket?.id) return;

      const buffStore = require('../../store/buffStore').default.getState();
      if (type === 'buff_added') {
        buffStore.addBuff(buffData, true); // silent = true to avoid echo
      } else if (type === 'buff_removed') {
        buffStore.removeBuff(buffData.buffId, true); // silent = true to avoid echo
      }
      console.log('✨ Received buff_update:', { type, buffData });
    });

    // Listen for debuff updates from other players/GM
    socket.on('debuff_update', (data) => {
      const { type, data: debuffData, senderSocketId } = data;
      // Skip if we are the one who sent it
      if (senderSocketId === socket?.id) return;

      const debuffStore = require('../../store/debuffStore').default.getState();
      if (type === 'debuff_added') {
        debuffStore.addDebuff(debuffData, true); // silent = true to avoid echo
      } else if (type === 'debuff_removed') {
        debuffStore.removeDebuff(debuffData.debuffId, true); // silent = true to avoid echo
      }
      console.log('💀 Received debuff_update:', { type, debuffData });
    });

    // Listen for creature tokens being added by GM
    socket.on('creature_added', (data) => {
      const { id, creatureId, position, velocity, createdBy, createdByName, mapId, token, state } = data;

      // Skip if we are the one who added it (GM adding creature)
      if (createdBy === socket?.id) return;

      const creatureStore = require('../../store/creatureStore').default.getState();

      // CRITICAL: Use included state to preserve token state across clients
      // If state is provided (new behavior), use it; otherwise fall back to library data
      let creatureData;
      if (token && state) {
        // Use the full token data from server including state
        creatureData = token;
      } else {
        // Fallback: Find creature data in library or use minimal data
        const libraryCreatures = creatureStore.creatures || [];
        creatureData = libraryCreatures.find(c => c.id === creatureId) || {
          id: creatureId,
          name: `Creature ${creatureId.substring(0, 8)}...`,
          isPlaceholder: true
        };
      }

      // Add creature token locally without re-emitting to server
      creatureStore.addCreatureToken(creatureData, position, false, id, true, mapId);
      console.log('🐉 Received creature_added:', { id, creatureId, position, mapId, hasState: !!state });
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
        mySocketId: socket?.id,
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

      const isOwnMovement = senderId === socket?.id || (currentPlayerRef.current && senderId === currentPlayerRef.current.id);

      // CRITICAL FIX: Enhanced echo prevention - skip if:
      // 1. This is our own movement based on senderId/socket matching
      // 2. We are currently dragging this specific token
      // 3. We recently moved this specific tokenId locally (within 1000ms grace period)

      const isDraggingOurToken = window.multiplayerDragState?.has(`token_${targetCharacterId}`);
      const recentMovementKey = `token_${targetCharacterId}`;
      const recentMovementEntry = window.recentTokenMovements?.get(recentMovementKey);
      const recentMovementTime = recentMovementEntry?.timestamp;

      if (isOwnMovement || isDraggingOurToken) {
        if (isOwnMovement) console.log('🚫 Skipping character_moved - isOwnMovement:', { targetCharacterId });
        if (isDraggingOurToken) console.log('🚫 Skipping character_moved - currently dragging:', { targetCharacterId });
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
        isFromSelf: data.playerId === currentPlayerRef.current?.id,
        itemMapId: data.mapId
      });

      // CRITICAL FIX: Filter by current map - only add items on same map
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const itemMapId = data.mapId || data.item?.mapId || 'default';

      if (itemMapId !== currentMapId) {
        console.log(`📦 Skipping item_dropped - different map (item: ${itemMapId}, current: ${currentMapId})`);
        return;
      }

      // Only add item if it's not our own drop (to avoid duplicates) or if it's a sync
      if (data.playerId !== currentPlayerRef.current?.id || isSync) {
        // Import grid item store dynamically to avoid circular dependencies
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

    // Listen for grid item updates (moves, removes) from other players
    // FIXED: Server emits 'grid_item_update' (not 'grid_item_updated')
    // FIXED: Server uses 'action' not 'updateType', and 'item' not 'itemData'
    socket.on('grid_item_update', (data) => {
      const myRole = isGMRef.current ? 'GM' : 'Player';
      console.log(`📨 [${myRole}] Received grid_item_update:`, {
        action: data.action,
        itemId: data.itemId,
        mapId: data.mapId,
        addedBy: data.addedBy,
        updatedBy: data.updatedBy,
        removedBy: data.removedBy
      });

      // CRITICAL FIX: Filter by current map - only update items on same map
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const itemMapId = data.mapId || 'default';

      if (itemMapId !== currentMapId) {
        console.log(`📦 Skipping grid_item_update - different map (item: ${itemMapId}, current: ${currentMapId})`);
        return;
      }

      // Handle different action types (server uses 'action', not 'updateType')
      import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
        const gridItemStore = useGridItemStore.getState();

        if (data.action === 'add' && data.item) {
          // Add new item to grid - server sends 'item' with position inside
          const position = data.item.position || data.item.gridPosition;
          gridItemStore.addItemToGrid(data.item, position, false, itemMapId);
        } else if (data.action === 'update' && data.itemId && data.updates) {
          // Update item - server sends 'updates' object
          if (data.updates.position || data.updates.gridPosition) {
            gridItemStore.updateItemPosition(data.itemId, data.updates.position || data.updates.gridPosition, false, itemMapId);
          }
          // Could also handle other property updates here if needed
        } else if (data.action === 'remove' && data.itemId) {
          // Remove item from grid
          gridItemStore.removeItemFromGrid(data.itemId, false);
        }
      }).catch(error => {
        console.error('Failed to import gridItemStore:', error);
      });
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
        isFromSelf: data.playerId === socket?.id,
        tokenMapId: data.mapId
      });
      const isSync = data.isSync;
      const myPlayerId = socket?.id; // Use socket.id for reliable self-identification

      // CRITICAL FIX: Check if this is our own token creation being echoed back
      const isOwnTokenCreation = data.playerId === myPlayerId;

      if (isOwnTokenCreation && !isSync) {
        // This is our own token creation being echoed back by server
        // DON'T add it to the store again - we already added it when we created it
        console.log('🔄 Skipping duplicate token from own creation');
        return;
      }

      // CRITICAL FIX: Filter by current map - only add tokens on the same map
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const tokenMapId = data.mapId || data.token?.targetMapId || 'default';

      if (tokenMapId !== currentMapId) {
        console.log(`🎭 Skipping token_created - different map (token: ${tokenMapId}, current: ${currentMapId})`);
        return;
      }

      // Only add token for sync events, and for new creations from other players
      if (data.token) {
        // First ensure that creature exists in the store
        const creatureData = data.creature || data.token.creature;
        if (creatureData) {
          addCreature(creatureData);
        }

        // Then add the token without sending back to server (avoid infinite loop)
        // CRITICAL FIX: Ensure position is robustly extracted from multiple sources
        const position = data.position || data.token?.position || data.token?.gridPosition || { x: 0, y: 0 };
        const tokenId = data.token.id || data.tokenId;
        const creatureId = data.creature?.id || data.token.creatureId;

        console.log(`🔷 [${myRole}] Adding/Updating token: ${tokenId} at`, position);
        addToken(creatureData || creatureId, position, false, tokenId, data.token.state || true, tokenMapId);
      } else {
        console.warn('⚠️ Received token_created event without token data:', data);
      }

      // Show notification in chat only for new creations from other players, not syncs or own creations
      if (!isSync && data.playerId !== myPlayerId) {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.playerName || 'Player'} placed ${data.creature?.name || data.character?.name || 'a token'} on the grid`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Listen for token creation confirmation from server
    socket.on('token_create_confirmed', (data) => {
      console.log('✅ [Token Creation] Token confirmed by server:', {
        tokenId: data.token?.id,
        creatureName: data.creature?.name,
        success: data.success,
        position: data.position
      });

      if (!data.success) {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: 'Failed to save token to Firebase. Data may not persist.',
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    // NOTE: character_moved handled by the main listener at line 1305
    // Listener at line 1525 removed to prevent update conflicts

    // NOTE: character_token_created is handled by the primary listener above.
    // Keeping a single listener avoids duplicate hydration and map desync conflicts.

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
          content: `${data.looter} looted ${data.item?.name || 'an item'} (x${data.quantity || 1}) from ${data.source}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }

      // Remove the item from grid if it was successfully removed on server
      // Remove the item from grid if it was successfully removed on server
      // For currency items, also process our own removals to ensure synchronization
      // For other items, only remove if this is from another player (our own removals are handled immediately)
      // CRITICAL FIX: Filter by map - only remove from grid if we are on the same map
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const itemMapId = data.mapId || 'default';

      const shouldRemove = data.gridItemId && data.itemRemoved && (itemMapId === currentMapId) && (
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

      const currentMapId = useMapStore.getState().currentMapId || 'default';

      import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
        const { addItemToGrid } = useGridItemStore.getState();

        // Add each grid item without sending back to server
        Object.values(data.gridItems).forEach(gridItem => {
          // CRITICAL FIX: Only add items that belong to the current map
          const itemMapId = gridItem.mapId || (gridItem.gridPosition ? 'default' : currentMapId);

          if (itemMapId === currentMapId) {
            addItemToGrid(gridItem, gridItem.position, false);
          }
        });
      }).catch(error => {
        console.error('Failed to import gridItemStore for sync:', error);
      });
    });

    // NOTE: Legacy grid_item_update handler removed - using unified handler above
    // NOTE: item_dropped is handled above with proper map isolation filtering at line ~2301
    // This duplicate handler was removed to prevent duplicate item additions

    // Listen for token synchronization when joining a room
    socket.on('sync_tokens', (data) => {
      const currentMapId = useMapStore.getState().currentMapId || 'default';

      console.log('🔄 [sync_tokens] Received token sync, currentMapId:', currentMapId, '| token count:', Object.keys(data.tokens || {}).length);

      // Add each token without sending back to server
      Object.values(data.tokens).forEach(tokenData => {
        // Map ID matching: treat missing/null mapId as 'default'
        const tokenMapId = tokenData.mapId || tokenData.targetMapId || 'default';

        // Accept token if: (a) exact map match, or (b) both are 'default'
        const isMapMatch = tokenMapId === currentMapId || (tokenMapId === 'default' && (!currentMapId || currentMapId === 'default'));
        if (!isMapMatch) {
          console.log(`🎭 [sync_tokens] Skipping token ${tokenData.id} – map mismatch (token: ${tokenMapId}, current: ${currentMapId})`);
          return;
        }

        // First ensure the creature exists in the library
        if (tokenData.creature) {
          addCreature(tokenData.creature);
        }

        // Add the token – pass the creature object if available so addCreatureToken
        // doesn't have to do a library lookup (which may fail for first-time sync)
        const creatureArg = tokenData.creature || tokenData.creatureId;
        addToken(creatureArg, tokenData.position, false, tokenData.id, tokenData.state, tokenMapId);
      });
    });


    // Listen for character token synchronization
    socket.on('sync_character_tokens', (data) => {
      const currentMapId = useMapStore.getState().currentMapId || 'default';

      try {
        const { addCharacterTokenFromServer, clearCharacterTokens } = useCharacterTokenStore.getState();

        // Don't clear tokens here, just add matching ones
        // If we want a full sync, we should clear first, but this might run incrementally

        Object.values(data.characterTokens).forEach(token => {
          const tokenMapId = token.mapId || 'default';
          if (tokenMapId === currentMapId) {
            addCharacterTokenFromServer(token.id, token.position, token.playerId, tokenMapId);
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
      const serverPlayerId = data.character?.serverPlayerId; // Server-assigned UUID
      const senderUserId = data.character?.userId || data.userId; // Firebase UID - MOST RELIABLE
      const characterName = data.character?.name;
      const updatedBy = data.updatedBy; // Player ID of sender from server
      const isFromGM = data.isGM || false; // Server may indicate if this is from GM

      console.info('📡 [character_updated] Received:', {
        senderSocketId,
        serverPlayerId,
        senderUserId,
        characterName,
        updatedBy,
        class: data.character?.class,
        race: data.character?.race,
        subrace: data.character?.subrace
      });

      // CRITICAL FIX: Check if this is our own update using multiple identifiers
      const mySocketId = socket?.id;
      const myServerId = useGameStore.getState().currentPlayer?.id;
      const myUserId = useAuthStore.getState().user?.uid;
      const myCharacterId = useCharacterStore.getState().currentCharacterId;

      const isOwnUpdate = (senderUserId && myUserId && senderUserId === myUserId) ||
        (senderSocketId && mySocketId && senderSocketId === mySocketId) ||
        (serverPlayerId && myServerId && serverPlayerId === myServerId) ||
        (data.characterId && myCharacterId && data.characterId === myCharacterId);

      if (isOwnUpdate) {
        console.log('🔄 [character_updated] Skipping own update echo:', { senderUserId, myUserId });
        return;
      }

      // CRITICAL FIX: Find party member by multiple strategies, userId FIRST
      const partyStore = usePartyStore.getState();
      let partyMember = partyStore.partyMembers.find(m =>
        m.userId === senderUserId // 1. Match by Firebase UID (MOST RELIABLE)
      );

      // 2. If not found by userId, try other methods
      if (!partyMember) {
        partyMember = partyStore.partyMembers.find(m =>
          (senderSocketId && (m.socketId === senderSocketId || m.id === senderSocketId)) ||
          (serverPlayerId && (m.id === serverPlayerId || m.socketId === serverPlayerId)) ||
          (updatedBy && (m.id === updatedBy || m.socketId === updatedBy)) ||
          (senderUserId && (m.id === senderUserId || m.socketId === senderUserId))
        );
      }

      // 3. Last resort: match by name, but ONLY if name is NOT "Character Name"
      if (!partyMember && characterName && characterName !== 'Character Name') {
        partyMember = partyStore.partyMembers.find(m => m.name === characterName);
      }

      // FALLBACK: If not found and this is from GM, find the GM party member
      if (!partyMember) {
        const gmMember = partyStore.partyMembers.find(m => m.isGM && m.id !== 'current-player');
        if (gmMember) {
          console.log('📥 [character_updated] Trying GM fallback match:', { gmMemberName: gmMember.name, gmMemberUserId: gmMember.userId });
          partyMember = gmMember;
        }
      }

      if (!partyMember) {
        console.warn('📥 [character_updated] Could not find party member for:', {
          senderSocketId,
          serverPlayerId,
          senderUserId,
          characterName,
          updatedBy,
          availableMembers: partyStore.partyMembers.map(m => ({ id: m.id, userId: m.userId, socketId: m.socketId, name: m.name }))
        });
        return;
      }

      // Store socketId on the member for future lookups
      const targetMemberId = partyMember.id;
      console.log('📥 [character_updated] Found party member:', {
        targetMemberId,
        name: partyMember.name,
        matchSource: partyMember.userId === senderUserId ? 'userId' : 'other-id'
      });

      // CRITICAL FIX: Preserve GM's custom display name if incoming name is a default placeholder
      const incomingName = data.character.name;
      const isDefaultName = !incomingName ||
        incomingName === 'Character Name' ||
        incomingName === 'Character Name (Room Name)' ||
        incomingName.trim() === '';

      // Only update name if incoming is NOT a default placeholder
      const shouldUpdateName = !isDefaultName;
      const memberName = shouldUpdateName ? incomingName : partyMember.name;

      // CRITICAL FIX: Use actual character data with proper fallbacks
      // Include ALL display fields for proper sync
      const baseCharacterData = {
        ...data.character,
        socketId: senderSocketId, // Store socketId for future lookups
        // Ensure we don't have nulls for critical stats
        health: data.character.health || { current: 45, max: 50 },
        mana: data.character.mana || { current: 45, max: 50 },
        actionPoints: data.character.actionPoints || { current: 1, max: 3 },
        // CRITICAL FIX: Always include classResource, even if empty
        classResource: data.character.classResource || { current: 0, max: 0 },
        // CRITICAL FIX: Include display names for race/class/background/path
        race: data.character.race || partyMember.character?.race || 'Unknown',
        subrace: data.character.subrace || partyMember.character?.subrace || '',
        raceDisplayName: data.character.raceDisplayName || partyMember.character?.raceDisplayName || 'Unknown',
        class: data.character.class || partyMember.character?.class || 'Unknown',
        background: data.character.background || partyMember.character?.background || '',
        backgroundDisplayName: data.character.backgroundDisplayName || partyMember.character?.backgroundDisplayName || '',
        path: data.character.path || partyMember.character?.path || '',
        pathDisplayName: data.character.pathDisplayName || partyMember.character?.pathDisplayName || '',
        alignment: data.character.alignment || partyMember.character?.alignment || 'Neutral',
        level: data.character.level || partyMember.character?.level || 1,
        lore: data.character.lore || partyMember.character?.lore || {},
        tokenSettings: data.character.tokenSettings || partyMember.character?.tokenSettings || {}
      };

      console.log('📦 [character_updated] baseCharacterData keys:', Object.keys(baseCharacterData));

      // Update party member immediately with raw data to ensure sync happens even if async import fails
      console.log('📦 [character_updated] Performing immediate update for:', targetMemberId);

      const immediateUpdateData = {
        socketId: senderSocketId,
        character: baseCharacterData
      };

      if (shouldUpdateName) {
        immediateUpdateData.name = memberName;
      }

      partyStore.updatePartyMember(targetMemberId, immediateUpdateData, true);

      // 4. Refine display names asynchronously if we have race information
      if (data.character.race && data.character.subrace) {
        console.log('🧬 [character_updated] Refining race+subrace display name...');
        import('../../data/raceData').then(({ getFullRaceData }) => {
          const raceData = getFullRaceData(data.character.race, data.character.subrace);
          if (raceData) {
            const updatedRaceDisplayName = `${raceData.subrace.name} ${raceData.race.name}`;
            console.log('✅ [character_updated] Calculated full race name:', updatedRaceDisplayName);

            const refineData = {
              character: {
                ...baseCharacterData,
                raceDisplayName: updatedRaceDisplayName
              }
            };
            partyStore.updatePartyMember(targetMemberId, refineData, true);
          }
        }).catch(error => {
          console.warn('❌ [character_updated] Race display refinement failed:', error);
        });
      } else if (data.character.race) {
        console.log('🧬 [character_updated] Refining race display name...');
        import('../../data/raceData').then(({ getRaceData }) => {
          const raceData = getRaceData(data.character.race);
          if (raceData) {
            console.log('✅ [character_updated] Calculated race name:', raceData.name);
            const refineData = {
              character: {
                ...baseCharacterData,
                raceDisplayName: raceData.name
              }
            };
            partyStore.updatePartyMember(targetMemberId, refineData, true);
          }
        }).catch(error => {
          console.warn('❌ [character_updated] Race display refinement failed:', error);
        });
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
    });

    // REMOVED: Duplicate character_resource_updated handler - consolidated into single handler above

    // Listen for character equipment updates from other players
    socket.on('character_equipment_updated', (data) => {
      const senderSocketId = data.senderSocketId || data.socketId || data.updatedBy;
      const characterId = data.characterId;
      const updatedBy = data.updatedBy;

      // Update party member with new equipment and stats
      if ((senderSocketId && senderSocketId !== socket?.id) || (updatedBy && updatedBy !== socket?.id)) {
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
      // CRITICAL FIX: Update mapStore currentMapId if provided
      if (data.mapId || data.currentMapId) {
        useMapStore.setState({ currentMapId: data.mapId || data.currentMapId });
      }

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
                const tokenMapId = tokenData.mapId || data.mapId || data.currentMapId || 'default';
                addCharacterTokenFromServer(tokenData.id, tokenData.position, tokenData.playerId, tokenMapId);
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
          if (data.mapData.windowOverlays !== undefined) {
            levelEditorStore.setWindowOverlays(data.mapData.windowOverlays);
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

    // NOTE: Legacy grid_item_update handler removed - using unified handler at line ~3190

    // Listen for map updates (fog of war, drawing, tiles)
    // FIXED: Server emits 'map_update' (not 'map_updated')
    socket.on('map_update', (data) => {
      console.log(`📥 [map_updated] Received for map ${data.mapId}, I'm on ${playerCurrentMapIdRef.current}, updatedBy: ${data.updatedBy}`);
      // CRITICAL FIX: Only process updates for the map we are currently on
      // This prevents "bleeding" of changes from other maps
      if (data.mapId && data.mapId !== playerCurrentMapIdRef.current) {
        console.log(`[Map] Ignoring update for map ${data.mapId} (we are on ${playerCurrentMapIdRef.current})`);
        return;
      }

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
        if (mapData.windowOverlays !== undefined) {
          levelEditorStore.setWindowOverlays(mapData.windowOverlays);
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

    // ========== MAP NAVIGATION EVENT HANDLERS ==========

    // Handle map change (player traversed connection or GM transferred them)
    socket.on('player_map_changed', (data) => {
      console.log('🗺️ Player map changed:', data);

      // CRITICAL: Block outgoing updates during map switch
      window._isMapSwitching = true;

      // CRITICAL FIX: Only process view switch if this is for US
      // Other players should NOT change their view when someone else is transferred
      const isForMe = data.playerId === currentPlayerRef.current?.id;

      if (!isForMe) {
        console.log(`[Map] ${data.playerName} was transferred to ${data.newMapId} - updating assignment but not switching view`);
        // We still want to update the assignment in partyStore so the tags move
        if (data.playerId) {
          usePartyStore.getState().setPlayerMapAssignment(data.playerId, data.newMapId);
        }
        window._isMapSwitching = false;
        return;
      }

      console.log(`[Map] WE are being transferred to ${data.newMapId} (${data.newMapName || 'Unknown'})`);

      // Show transition overlay - but skip on first entry to the room UNLESS it's a connection/portal transfer
      const hasPortalMetadata = !!(
        data.portalUsed && (
          data.portalUsed.transferType === 'connection' ||
          data.portalUsed.sourceConnectionId ||
          data.portalUsed.destinationConnectionId ||
          data.portalUsed.sourceMapId ||
          data.portalUsed.destinationMapId
        )
      );

      // Defensive fallback for legacy payloads that may omit portalUsed
      const inferredConnectionTransfer = !!(
        !data.transferredByGM &&
        data.newMapId &&
        data.centerPosition &&
        Number.isFinite(data.centerPosition.x) &&
        Number.isFinite(data.centerPosition.y)
      );

      const isPortalTransfer = hasPortalMetadata || inferredConnectionTransfer;
      const shouldShowTransition = showMapTransitions && (!isInitialMapLoadRef.current || isPortalTransfer);

      if (shouldShowTransition) {
        // CRITICAL FIX: Look up map name from local store if not provided by server
        // OR if server provided a fallback string like "Map [ID]"
        const localMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId);
        let mapName = data.newMapName || localMap?.name || 'Unknown Location';

        if (localMap?.name && (mapName.startsWith('Map ') || mapName === data.newMapId)) {
          mapName = localMap.name;
        }

        // If it's a portal transfer, we can use the portal names for a cooler transition
        if (isPortalTransfer && data.portalUsed.portalName) {
          console.log(`🌀 [MapTransition] Portal used: ${data.portalUsed.portalName}`);
          // Optional: we could include "via [Portal Name]" in the transition
        }

        setMapTransition({
          isActive: true,
          mapName: mapName,
          transferredByGM: data.transferredByGM || false
        });
      }

      // After first map event, subsequent ones should always show transition
      isInitialMapLoadRef.current = false;


      // CRITICAL FIX: Update local map ID for filtering AND mapStore.currentMapId for terrain updates
      setPlayerCurrentMapId(data.newMapId);

      // IMMEDIATE CAMERA LOCK: Establish authority immediately (before the defer delay) 
      // to prevent other systems (like Grid.jsx auto-token-centering) from overriding 
      // the camera during the loading/transition period.
      if (
        data.centerPosition &&
        Number.isFinite(data.centerPosition.x) &&
        Number.isFinite(data.centerPosition.y)
      ) {
        const gameStore = useGameStore.getState();
        if (typeof gameStore.markTransferCameraAuthoritative === 'function') {
          gameStore.markTransferCameraAuthoritative(
            { x: data.centerPosition.x, y: data.centerPosition.y },
            2500, // 2.5s lock to cover transition
            'multiplayer-player_map_changed-immediate'
          );
          console.log('🎯 [player_map_changed] Initial authoritative camera lock established', {
            pos: data.centerPosition,
            mapId: data.newMapId
          });
        }

        // Apply position immediately as well
        if (gameStore.setCameraPosition) {
          gameStore.setCameraPosition(data.centerPosition.x, data.centerPosition.y);
        }
      }

      // CRITICAL FIX: Defer heavy synchronization work until transition fade-in has covered viewport.
      const mapSwapDelay = shouldShowTransition ? TRANSITION_TIMINGS.SAFE_SWAP_MS : 0;
      console.log(`⏱️ Deferring map data loading for ${data.newMapId} by ${mapSwapDelay}ms to avoid pre-reveal/flicker...`);
      setTimeout(() => {
        // CRITICAL FIX: Synchronously update mapStore.currentMapId so terrain updates use correct targetMapId
        // This is the KEY fix for terrain appearing on wrong map
        useMapStore.setState({ currentMapId: data.newMapId });
        console.log(`✅ [player_map_changed] Updated mapStore.currentMapId to: ${data.newMapId}`);

        // CRITICAL FIX: Add the map to mapStore.maps if it doesn't exist
        // This ensures the status indicator can find the map name
        const mapStore = useMapStore.getState();
        const existingMap = (mapStore.maps || []).find(m => m.id === data.newMapId);

        // Determine best name for mapStore
        const resolvedMapName = data.newMapName || data.mapData?.name || (existingMap?.name && !existingMap.name.startsWith('Map ') ? existingMap.name : `Map ${data.newMapId}`);

        if (!existingMap && data.newMapId) {
          const newMapEntry = {
            id: data.newMapId,
            name: resolvedMapName,
            // Include basic map data so it's available
            terrainData: data.mapData?.terrainData || {},
            wallData: data.mapData?.wallData || {},
            windowOverlays: data.mapData?.windowOverlays || {},
            drawingPaths: data.mapData?.drawingPaths || [],
            drawingLayers: data.mapData?.drawingLayers || [],
            fogOfWarPaths: data.mapData?.fogOfWarPaths || [],
            fogErasePaths: data.mapData?.fogErasePaths || [],
            dndElements: data.mapData?.dndElements || [],
            backgrounds: data.mapData?.backgrounds || [],
            activeBackgroundId: data.mapData?.activeBackgroundId || null,
            gridSettings: data.mapData?.gridSettings || {}
          };
          useMapStore.setState({
            maps: [...(mapStore.maps || []), newMapEntry]
          });
          console.log(`✅ [player_map_changed] Added map "${newMapEntry.name}" to mapStore.maps`);
        } else if (existingMap && resolvedMapName && (!existingMap.name || existingMap.name.startsWith('Map ')) && !resolvedMapName.startsWith('Map ')) {
          // Update existing map name if it was a fallback
          useMapStore.getState().updateMap(data.newMapId, { name: resolvedMapName });
        }

        // CRITICAL FIX: Clear fog, memories, and exploration data on map change
        // These are per-map and must not bleed into the new map
        import('../../store/levelEditorStore').then(({ default: useLevelEditorStore, mapUpdateBatcher }) => {
          if (mapUpdateBatcher) {
            mapUpdateBatcher.clear();
            console.log('🧹 [player_map_changed] Batcher cleared');
          }
          const les = useLevelEditorStore.getState();
          if (les.clearAllFogAndMemories) {
            les.clearAllFogAndMemories();
          }
          console.log('🧹 [player_map_changed] Cleared player memories and exploration data for new map');
        });

        // Apply the new map data to level editor store
        window._isReceivingMapUpdate = true;

        import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          const mapData = data.mapData || {};
          const localMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId) || {};

          // CRITICAL FIX: Avoid destructive clears when payload is partial.
          // Prefer incoming payload, then local map cache; only skip if both missing.
          const nextTerrainData = mapData.terrainData ?? localMap.terrainData;
          const nextWallData = mapData.wallData ?? localMap.wallData;
          const nextWindowOverlays = mapData.windowOverlays ?? localMap.windowOverlays;
          const nextDrawingPaths = mapData.drawingPaths ?? localMap.drawingPaths;
          const nextDrawingLayers = mapData.drawingLayers ?? localMap.drawingLayers;
          const nextFogOfWarPaths = mapData.fogOfWarPaths ?? localMap.fogOfWarPaths;
          const nextFogErasePaths = mapData.fogErasePaths ?? localMap.fogErasePaths;
          const nextDndElements = mapData.dndElements ?? localMap.dndElements;

          if (nextTerrainData !== undefined) levelEditorStore.setTerrainData(nextTerrainData || {});
          else console.warn('⚠️ [player_map_changed] Missing terrain payload and cache - preserving current terrain to avoid wipe');

          if (nextWallData !== undefined) levelEditorStore.setWallData(nextWallData || {});
          // Restore window/door overlays
          if (nextWindowOverlays !== undefined && levelEditorStore.setWindowOverlays) {
            levelEditorStore.setWindowOverlays(nextWindowOverlays || {});
          }
          if (nextDrawingPaths !== undefined) levelEditorStore.setDrawingPaths(nextDrawingPaths || []);
          if (nextDrawingLayers !== undefined) levelEditorStore.setDrawingLayers(nextDrawingLayers || []);
          if (nextFogOfWarPaths !== undefined) levelEditorStore.setFogOfWarPaths(nextFogOfWarPaths || []);
          if (nextFogErasePaths !== undefined) levelEditorStore.setFogErasePaths(nextFogErasePaths || []);
          if (nextDndElements !== undefined) levelEditorStore.setDndElements(nextDndElements || []);

          // CRITICAL FIX: Synchronize backgrounds and grid settings
          // This ensures the visuals match the new map
          useGameStore.setState({
            backgrounds: mapData.backgrounds || [],
            activeBackgroundId: mapData.activeBackgroundId || null,
            gridSize: mapData.gridSettings?.gridSize || 50,
            gridOffsetX: mapData.gridSettings?.gridOffsetX || 0,
            gridOffsetY: mapData.gridSettings?.gridOffsetY || 0,
            gridLineColor: mapData.gridSettings?.gridLineColor || '#000000',
            gridLineThickness: mapData.gridSettings?.gridLineThickness || 1
          });

          setTimeout(() => {
            window._isReceivingMapUpdate = false;
            window._isMapSwitching = false;
          }, 300);
        });

        // Clear tokens/items only when we actually have payload (or cache fallback).
        // This prevents accidental wipes for permanent rooms on partial payloads.
        const mapStoreMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId) || null;
        const tokensRaw = data.mapData?.tokens !== undefined ? data.mapData?.tokens : mapStoreMap?.tokens;
        const characterTokensRaw = data.mapData?.characterTokens !== undefined ? data.mapData?.characterTokens : mapStoreMap?.characterTokens;
        const gridItemsRaw = data.mapData?.gridItems !== undefined ? data.mapData?.gridItems : mapStoreMap?.gridItems;

        const hasTokenPayload = tokensRaw !== undefined || characterTokensRaw !== undefined;
        const hasGridItemsPayload = gridItemsRaw !== undefined;

        if (!hasTokenPayload) {
          console.warn('⚠️ [player_map_changed] Missing token payload - skipping destructive token clear to preserve existing tokens');
        } else {
          clearCreatureTokens();
          clearCharacterTokens();
        }

        // Add tokens from the new map
        const tokens = tokensRaw ? (Array.isArray(tokensRaw) ? tokensRaw : Object.values(tokensRaw)) : [];
        if (tokens.length > 0) {
          tokens.forEach(tokenData => {
            // CRITICAL FIX: Robust creature data resolution
            let creatureData = tokenData.creature;

            if (!creatureData && tokenData.creatureId) {
              // Check library if server didn't provide it
              creatureData = useCreatureStore.getState().creatures?.find(c => c.id === tokenData.creatureId);
              if (creatureData) {
                console.log(`✅ [player_map_changed] Found missing creature data in local library for ${tokenData.creatureId}`);
              }
            }

            if (creatureData) {
              addCreature(creatureData);
            } else if (tokenData.creatureId) {
              console.warn(`⚠️ Token ${tokenData.id} missing creature data!`, tokenData);
              // Even if data is missing, still try to add the token using creatureId
            }

            const creatureRef = tokenData.creatureId || creatureData?.id || tokenData.creature;
            if (creatureRef && tokenData.position) {
              // Load quietly and preserve ID/state; force target map for strict map isolation
              addToken(
                creatureRef,
                tokenData.position,
                false,
                tokenData.id || tokenData.tokenId,
                tokenData.state,
                data.newMapId || tokenData.mapId || 'default'
              );
            }
          });
        }

        // Load character tokens for the new map
        const characterTokens = characterTokensRaw
          ? (Array.isArray(characterTokensRaw) ? characterTokensRaw : Object.values(characterTokensRaw))
          : [];

        if (characterTokens.length > 0) {
          const { addCharacterTokenFromServer: addCharToken } = useCharacterTokenStore.getState();
          characterTokens.forEach(tokenData => {
            if (tokenData && tokenData.position) {
              // CRITICAL: Pass mapId for proper map isolation
              addCharToken(tokenData.id || tokenData.tokenId, tokenData.position, tokenData.playerId, data.newMapId);
            }
          });
        }


        // CRITICAL FIX: Load grid items for this map - keep items from all maps but filter by current mapId
        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const currentGridItems = useGridItemStore.getState().gridItems || [];
          // Server may send array or object, and payload can be omitted during partial sync.
          const mapGridItems = gridItemsRaw
            ? (Array.isArray(gridItemsRaw) ? gridItemsRaw : Object.values(gridItemsRaw))
            : null;

          if (!hasGridItemsPayload) {
            console.warn('⚠️ [player_map_changed] Missing gridItems payload - preserving existing grid items for target map');
            return;
          }

          // Debug: Log item loading
          console.log(`📦 [player_map_changed] Loading items:`, {
            oldMapId: data.oldMapId,
            newMapId: data.newMapId,
            mapGridItemsCount: mapGridItems?.length || 0,
            mapGridItems: (mapGridItems || []).map(i => ({ id: i.id, name: i.name, mapId: i.mapId })),
            currentGridItemsBeforeFilter: currentGridItems.map(i => ({ id: i.id, name: i.name, mapId: i.mapId }))
          });

          // CRITICAL FIX: Replace target-map items atomically to avoid map bleed/duplication.
          const nonTargetItems = currentGridItems.filter(item => (item?.mapId || 'default') !== data.newMapId);
          const normalizedTargetItems = (mapGridItems || [])
            .filter(item => (item?.mapId || data.newMapId || 'default') === data.newMapId)
            .map(item => ({ ...item, mapId: item?.mapId || data.newMapId || 'default' }));
          const dedupedTargetItems = Array.from(
            new Map(normalizedTargetItems.map(item => [item.id, item])).values()
          );

          const updatedGridItems = [...nonTargetItems, ...dedupedTargetItems];

          console.log(`📦 [player_map_changed] Final grid items:`, {
            totalItems: updatedGridItems.length,
            itemsForMapNew: updatedGridItems.filter(i => i.mapId === data.newMapId).map(i => ({ id: i.id, name: i.name, mapId: i.mapId })),
            itemsFromOldMap: data.oldMapId ? updatedGridItems.filter(i => i.mapId === data.oldMapId).map(i => ({ id: i.id, name: i.name, mapId: i.mapId })) : []
          });
          useGridItemStore.setState({ gridItems: updatedGridItems });
        });

        // Center camera on destination position if provided.
        // Apply immediately and again on next frame so this remains the final camera write
        // after map payload hydration and any late store updates.
        if (
          data.centerPosition &&
          Number.isFinite(data.centerPosition.x) &&
          Number.isFinite(data.centerPosition.y)
        ) {
          const gameStore = useGameStore.getState();
          if (typeof gameStore.markTransferCameraAuthoritative === 'function') {
            gameStore.markTransferCameraAuthoritative(
              { x: data.centerPosition.x, y: data.centerPosition.y },
              2500,
              'multiplayer-player_map_changed-initial'
            );
          }
          if (gameStore.setCameraPosition) {
            gameStore.setCameraPosition(data.centerPosition.x, data.centerPosition.y);
            requestAnimationFrame(() => {
              const latestGameStore = useGameStore.getState();
              if (typeof latestGameStore.markTransferCameraAuthoritative === 'function') {
                latestGameStore.markTransferCameraAuthoritative(
                  { x: data.centerPosition.x, y: data.centerPosition.y },
                  2500,
                  'multiplayer-player_map_changed-raf'
                );
              }
              if (latestGameStore.setCameraPosition) {
                latestGameStore.setCameraPosition(data.centerPosition.x, data.centerPosition.y);
                console.log('🎯 [player_map_changed] Re-applied destination center as final camera write', {
                  mapId: data.newMapId,
                  centerPosition: data.centerPosition,
                  source: 'multiplayer-player_map_changed'
                });
              }
            });
          }
        }

        usePartyStore.getState().setPlayerMapAssignment(currentPlayerRef.current?.id, data.newMapId);
        console.log(`✅ [player_map_changed] Player view switched to map: ${data.newMapName || data.newMapId}`);
      }, mapSwapDelay);
    });

    // Handle forced map transfer from GM (when GM drags a player to a different map)
    socket.on('forced_map_transfer', (data) => {
      // DETAILED LOGGING: Log full transfer data
      console.log('🔄 [forced_map_transfer] Received from server', {
        mapId: data.mapId,
        mapName: data.mapName,
        reason: data.reason,
        hasMapData: !!data.mapData,
        mapDataKeys: data.mapData ? Object.keys(data.mapData) : [],
        tokenCount: data.mapData?.tokens ? Object.keys(data.mapData.tokens).length : 0,
        characterTokenCount: data.mapData?.characterTokens ? Object.keys(data.mapData.characterTokens).length : 0,
        gridItemCount: data.mapData?.gridItems ? Object.keys(data.mapData.gridItems).length : 0,
        currentPlayerId: currentPlayerRef.current?.id,
        socketId: socket?.id
      });

      // Block outgoing updates during map switch
      window._isMapSwitching = true;
      console.log('🔒 [forced_map_transfer] Set window._isMapSwitching = true');

      // Show transition overlay
      const shouldShowTransition = !isInitialMapLoadRef.current;
      console.log('🎬 [forced_map_transfer] Transition decision', {
        shouldShowTransition,
        isInitialMapLoad: isInitialMapLoadRef.current
      });

      if (shouldShowTransition) {
        const localMap = useMapStore.getState().maps?.find(m => m.id === data.mapId);
        const mapName = data.mapName || localMap?.name || data.mapId || 'Unknown Location';
        setMapTransition({
          isActive: true,
          mapName: mapName,
          transferredByGM: true
        });
        console.log('🎬 [forced_map_transfer] Started transition overlay for:', mapName);
      }

      isInitialMapLoadRef.current = false;

      // Update local map ID and party assignment
      setPlayerCurrentMapId(data.mapId);
      useMapStore.setState({ currentMapId: data.mapId });
      usePartyStore.getState().setPlayerMapAssignment(currentPlayerRef.current?.id, data.mapId);
      console.log('📍 [forced_map_transfer] Updated map IDs', {
        playerCurrentMapId: data.mapId,
        mapStoreCurrentMapId: data.mapId
      });

      // If server sent map data, hydrate our stores now
      const mapSwapDelay = shouldShowTransition ? TRANSITION_TIMINGS.SAFE_SWAP_MS : 0;
      console.log('⏱️ [forced_map_transfer] Scheduling hydration in', mapSwapDelay, 'ms');

      setTimeout(() => {
        const mapData = data.mapData || {};
        const localMapCache = useMapStore.getState().maps?.find(m => m.id === data.mapId) || {};

        console.log('📦 [forced_map_transfer] Starting hydration', {
          hasServerMapData: Object.keys(mapData).length > 0,
          hasLocalMapCache: !!localMapCache.id,
          serverDataKeys: Object.keys(mapData)
        });

        // Always clear tokens on map switch to prevent stale tokens from lingering
        clearCreatureTokens();
        clearCharacterTokens();
        console.log('🧹 [forced_map_transfer] Cleared old creature/character tokens');

        if (Object.keys(mapData).length > 0) {
          import('../../store/levelEditorStore').then(({ default: useLevelEditorStore, mapUpdateBatcher }) => {
            if (mapUpdateBatcher) mapUpdateBatcher.clear();
            const les = useLevelEditorStore.getState();
            window._isReceivingMapUpdate = true;

            // CRITICAL FIX: Clear all fog and memories on map change
            if (les.clearAllFogAndMemories) {
              les.clearAllFogAndMemories();
            }

            const nextTerrain = mapData.terrainData ?? localMapCache.terrainData;
            const nextWall = mapData.wallData ?? localMapCache.wallData;
            const nextWindowOverlays = mapData.windowOverlays ?? localMapCache.windowOverlays;
            const nextFogPaths = mapData.fogOfWarPaths ?? localMapCache.fogOfWarPaths;
            const nextFogErase = mapData.fogErasePaths ?? localMapCache.fogErasePaths;
            const nextDraw = mapData.drawingPaths ?? localMapCache.drawingPaths;
            const nextLayers = mapData.drawingLayers ?? localMapCache.drawingLayers;
            const nextDnd = mapData.dndElements ?? localMapCache.dndElements;

            if (nextTerrain !== undefined && les.setTerrainData) les.setTerrainData(nextTerrain || {});
            if (nextWall !== undefined && les.setWallData) les.setWallData(nextWall || {});
            if (nextWindowOverlays !== undefined && les.setWindowOverlays) les.setWindowOverlays(nextWindowOverlays || {});
            if (nextFogPaths !== undefined && les.setFogOfWarPaths) les.setFogOfWarPaths(nextFogPaths || []);
            if (nextFogErase !== undefined && les.setFogErasePaths) les.setFogErasePaths(nextFogErase || []);
            if (nextDraw !== undefined && les.setDrawingPaths) les.setDrawingPaths(nextDraw || []);
            if (nextLayers !== undefined && les.setDrawingLayers) les.setDrawingLayers(nextLayers || []);
            if (nextDnd !== undefined && les.setDndElements) les.setDndElements(nextDnd || []);

            if (les.setFogOfWarData && mapData.fogOfWarData !== undefined)
              les.setFogOfWarData(mapData.fogOfWarData || {});

            useGameStore.setState({
              backgrounds: mapData.backgrounds || [],
              activeBackgroundId: mapData.activeBackgroundId || null,
              gridSize: mapData.gridSettings?.gridSize || 50,
              gridOffsetX: mapData.gridSettings?.gridOffsetX || 0,
              gridOffsetY: mapData.gridSettings?.gridOffsetY || 0,
              gridLineColor: mapData.gridSettings?.gridLineColor || '#000000',
              gridLineThickness: mapData.gridSettings?.gridLineThickness || 1
            });

            setTimeout(() => { window._isReceivingMapUpdate = false; }, 200);

            // Load tokens if payload present
            const tokensRaw = mapData.tokens;
            const characterTokensRaw = mapData.characterTokens;

            if (tokensRaw !== undefined) {
              const tokens = tokensRaw ? (Array.isArray(tokensRaw) ? tokensRaw : Object.values(tokensRaw)) : [];
              console.log('👾 [forced_map_transfer] Loading tokens', { tokenCount: tokens.length });
              tokens.forEach(tokenData => {
                let creatureData = tokenData.creature;
                if (!creatureData && tokenData.creatureId)
                  creatureData = useCreatureStore.getState().creatures?.find(c => c.id === tokenData.creatureId);
                if (creatureData) addCreature(creatureData);
                const creatureRef = tokenData.creatureId || creatureData?.id;
                if (creatureRef && tokenData.position)
                  addToken(creatureRef, tokenData.position, false, tokenData.id, tokenData.state, data.mapId);
              });
            } else {
              console.warn('⚠️ [forced_map_transfer] No token payload - tokens already cleared');
            }

            if (characterTokensRaw !== undefined) {
              const charTokens = characterTokensRaw
                ? (Array.isArray(characterTokensRaw) ? characterTokensRaw : Object.values(characterTokensRaw))
                : [];
              console.log('👤 [forced_map_transfer] Loading character tokens', { charTokenCount: charTokens.length });
              const { addCharacterTokenFromServer: addCharToken } = useCharacterTokenStore.getState();
              charTokens.forEach(tokenData => {
                if (tokenData && tokenData.position)
                  addCharToken(tokenData.id, tokenData.position, tokenData.playerId, data.mapId);
              });
            }
          });
        } else {
          // No mapData at all - tokens were already cleared above
          console.warn('⚠️ [forced_map_transfer] No mapData - requesting fresh state');
          if (socket?.connected) {
            socket.emit('gm_request_fresh_positions', {
              roomId: useGameStore.getState().multiplayerRoom?.id,
              mapId: data.mapId
            });
          }
          // Still clear memories even without map data
          import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
            const les = useLevelEditorStore.getState();
            if (les.clearAllFogAndMemories) {
              les.clearAllFogAndMemories();
            }
          });
        }

        // If the GM just transferred themselves, fetch fresh positions just like gm_view_changed
        const gameStoreCurrent = useGameStore.getState();
        if (gameStoreCurrent.isGMMode && socket?.connected) {
          socket.emit('gm_request_fresh_positions', {
            roomId: gameStoreCurrent.multiplayerRoom?.id,
            mapId: data.mapId
          });
          console.log(`📡 [forced_map_transfer] Requested fresh character positions for map ${data.mapId}`);
        }

        window._isMapSwitching = false;
        console.log('🔓 [forced_map_transfer] Set window._isMapSwitching = false');
        console.log(`✅ [forced_map_transfer] Transfer complete to map: ${data.mapId} (${data.mapName || 'unnamed'})`);
      }, mapSwapDelay);
    });

    // Handle GM view change (for GM switching maps to edit)
    socket.on('gm_view_changed', (data) => {
      console.log('[GM VIEW CHANGED] Received event:', {
        gmId: data.gmId,
        gmName: data.gmName,
        newMapId: data.newMapId,
        mapName: data.mapName,
        hasMapName: !!data.mapName,
        myId: currentPlayerRef.current?.id
      });

      // CRITICAL: Block outgoing updates during map switch
      window._isMapSwitching = true;

      // CRITICAL FIX: Only process if this is the GM who initiated the view change
      // Other players should NOT change their view when GM switches
      const amITheGM = currentPlayerRef.current?.id === data.gmId;
      if (!amITheGM) {
        console.log('[GM VIEW CHANGED] Not the GM who switched - ignoring view change event');
        window._isMapSwitching = false;
        return;
      }

      console.log('[GM VIEW CHANGED] Processing view change for GM:', data.gmName);

      // Show transition overlay only for GM
      const shouldShowTransition = !isInitialMapLoadRef.current && showMapTransitions;
      if (shouldShowTransition) {
        // CRITICAL FIX: Look up map name from local store if server provided a fallback string
        const localMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId);
        let mapName = data.mapName || localMap?.name || 'Unknown Realm';

        if (localMap?.name && (mapName.startsWith('Map ') || mapName === data.newMapId)) {
          mapName = localMap.name;
        }

        console.log('[GM VIEW CHANGED] Showing transition with map name:', mapName);

        setMapTransition({
          isActive: true,
          mapName: mapName,
          transferredByGM: false
        });
      }

      const gmMapSwapDelay = shouldShowTransition ? TRANSITION_TIMINGS.SAFE_SWAP_MS : 0;

      // Mark that initial load is complete after first view change
      isInitialMapLoadRef.current = false;
      const processGmViewChange = () => {
        // Update local map ID for GM (for filtering incoming updates)
        setPlayerCurrentMapId(data.newMapId);


        // Capture previous map before switching so later cleanup/remap logic can use it safely
        const previousMapId = useMapStore.getState().currentMapId;

        // CRITICAL FIX: Synchronously update mapStore.currentMapId so terrain updates use correct targetMapId
        // useMapStore is already imported at the top of the file - use it directly, not async import
        const mapStoreState = useMapStore.getState();
        // Check if map exists in local store
        const existingMap = mapStoreState.maps?.find(m => m.id === data.newMapId);

        // Determine best name for mapStore
        const resolvedMapName = data.mapName || data.mapData?.name || (existingMap?.name && !existingMap.name.startsWith('Map ') ? existingMap.name : `Map ${data.newMapId}`);

        if (!existingMap) {
          console.log('[GM VIEW CHANGED] Creating map in local store:', data.newMapId, resolvedMapName);
          // Create a map in local store
          mapStoreState.createMapWithoutSwitching({
            id: data.newMapId,
            name: resolvedMapName
          });
        } else if (resolvedMapName && (!existingMap.name || existingMap.name.startsWith('Map ')) && !resolvedMapName.startsWith('Map ')) {
          // Update existing map name if it was a fallback
          mapStoreState.updateMap(data.newMapId, { name: resolvedMapName });
        }

        // SYNCHRONOUS update to ensure terrain updates use correct mapId immediately
        useMapStore.setState({ currentMapId: data.newMapId });

        // CRITICAL FIX: Update GM's assignment in partyStore so their tag moves in Map Library
        // FIXED: Changed data.mapId (doesn't exist) to data.newMapId
        if (currentPlayerRef.current?.id) {
          console.log('[GM VIEW CHANGED] Updating GM assignment:', currentPlayerRef.current.id, '->', data.newMapId);
          usePartyStore.getState().setPlayerMapAssignment(currentPlayerRef.current.id, data.newMapId);
        }


        // CRITICAL: Clear batcher to prevent pending updates from old map bleeding to new map
        // Wrap ALL operations in a single chain to prevent race conditions
        import('../../store/levelEditorStore').then(({ mapUpdateBatcher }) => {
          if (mapUpdateBatcher) {
            mapUpdateBatcher.clear();
            console.log('🧹 [gm_view_changed] Batcher cleared to prevent data bleeding');
          }
        }).then(() => {
          // Step 1: Apply new map data to level editor store
          return import('../../store/levelEditorStore');
        }).then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          const mapData = data.mapData || {};
          const localMapCache = useMapStore.getState().maps?.find(m => m.id === data.newMapId) || {};

          window._isReceivingMapUpdate = true;

          // CRITICAL FIX: Avoid destructive clears when gm_view_changed payload is partial.
          // Prefer incoming payload, then local map cache; preserve current state if both missing.
          const nextTerrainData = mapData.terrainData ?? localMapCache.terrainData;
          const nextWallData = mapData.wallData ?? localMapCache.wallData;
          const nextWindowOverlays = mapData.windowOverlays ?? localMapCache.windowOverlays;
          const nextDrawingPaths = mapData.drawingPaths ?? localMapCache.drawingPaths;
          const nextDrawingLayers = mapData.drawingLayers ?? localMapCache.drawingLayers;
          const nextFogOfWarPaths = mapData.fogOfWarPaths ?? localMapCache.fogOfWarPaths;
          const nextFogErasePaths = mapData.fogErasePaths ?? localMapCache.fogErasePaths;
          const nextDndElements = mapData.dndElements ?? localMapCache.dndElements;

          if (nextTerrainData !== undefined) levelEditorStore.setTerrainData(nextTerrainData || {});
          else console.warn('⚠️ [gm_view_changed] Missing terrain payload and cache - preserving current terrain to avoid wipe');

          if (nextWallData !== undefined) levelEditorStore.setWallData(nextWallData || {});
          // Restore window/door overlays
          if (nextWindowOverlays !== undefined && levelEditorStore.setWindowOverlays) {
            levelEditorStore.setWindowOverlays(nextWindowOverlays || {});
          }
          if (nextDrawingPaths !== undefined) levelEditorStore.setDrawingPaths(nextDrawingPaths || []);
          if (nextDrawingLayers !== undefined) levelEditorStore.setDrawingLayers(nextDrawingLayers || []);
          if (nextFogOfWarPaths !== undefined) levelEditorStore.setFogOfWarPaths(nextFogOfWarPaths || []);
          if (nextFogErasePaths !== undefined) levelEditorStore.setFogErasePaths(nextFogErasePaths || []);
          if (nextDndElements !== undefined) levelEditorStore.setDndElements(nextDndElements || []);

          setTimeout(() => {
            window._isReceivingMapUpdate = false;
            window._isMapSwitching = false;
          }, 300);

          return { mapData, localMapCache };
        }).then(({ mapData, localMapCache }) => {
          // Step 2: Apply game store backgrounds and grid settings
          useGameStore.setState({
            backgrounds: mapData.backgrounds ?? localMapCache.backgrounds ?? [],
            activeBackgroundId: mapData.activeBackgroundId ?? localMapCache.activeBackgroundId ?? null,
            gridSize: mapData.gridSettings?.gridSize ?? localMapCache.gridSettings?.gridSize ?? 50,
            gridOffsetX: mapData.gridSettings?.gridOffsetX ?? localMapCache.gridSettings?.gridOffsetX ?? 0,
            gridOffsetY: mapData.gridSettings?.gridOffsetY ?? localMapCache.gridSettings?.gridOffsetY ?? 0,
            gridLineColor: mapData.gridSettings?.gridLineColor ?? localMapCache.gridSettings?.gridLineColor ?? '#000000',
            gridLineThickness: mapData.gridSettings?.gridLineThickness ?? localMapCache.gridSettings?.gridLineThickness ?? 1
          });
        }).then(() => {
          // Step 3: Reload token/item payloads.
          // Guard against partial gm_view_changed payloads that omit token collections,
          // which would otherwise clear stores and cause visible token loss for the GM.
          const mapData = data.mapData || {};

          const mapStoreMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId) || null;

          const serverTokensRaw = mapData.tokens;
          const serverCharacterTokensRaw = mapData.characterTokens;
          const serverGridItemsRaw = mapData.gridItems;

          const fallbackTokensRaw = mapStoreMap?.tokens;
          const fallbackCharacterTokensRaw = mapStoreMap?.characterTokens;
          const fallbackGridItemsRaw = mapStoreMap?.gridItems;

          const tokensRaw = serverTokensRaw !== undefined ? serverTokensRaw : fallbackTokensRaw;
          const characterTokensRaw = serverCharacterTokensRaw !== undefined ? serverCharacterTokensRaw : fallbackCharacterTokensRaw;
          const gridItemsRaw = serverGridItemsRaw !== undefined ? serverGridItemsRaw : fallbackGridItemsRaw;

          const hasTokenPayload = tokensRaw !== undefined || characterTokensRaw !== undefined;
          const hasGridItemsPayload = gridItemsRaw !== undefined;

          if (!hasTokenPayload) {
            console.warn('⚠️ [gm_view_changed] Missing token payload - skipping destructive token clear to prevent accidental wipe');
          } else {
            clearCreatureTokens();
            clearCharacterTokens();
          }

          if (!hasGridItemsPayload) {
            console.warn('⚠️ [gm_view_changed] Missing gridItems payload - skipping destructive grid item clear to prevent accidental wipe');
          }

          // Load tokens for the new map
          const tokens = tokensRaw ? (Array.isArray(tokensRaw) ? tokensRaw : Object.values(tokensRaw)) : [];
          tokens.forEach(tokenData => {
            // CRITICAL FIX: Robust creature data resolution
            let creatureData = tokenData.creature;
            if (!creatureData && tokenData.creatureId) {
              creatureData = useCreatureStore.getState().creatures?.find(c => c.id === tokenData.creatureId);
            }
            if (creatureData) {
              addCreature(creatureData);
            }

            const creatureRef = tokenData.creatureId || creatureData?.id || tokenData.creature;
            if (creatureRef && tokenData.position) {
              addToken(
                creatureRef,
                tokenData.position,
                false,
                tokenData.id || tokenData.tokenId,
                tokenData.state,
                data.newMapId || tokenData.mapId || 'default'
              );
            }
          });

          // Load character tokens for the new map
          const characterTokens = characterTokensRaw ? (Array.isArray(characterTokensRaw) ? characterTokensRaw : Object.values(characterTokensRaw)) : [];
          console.log('♟️ [gm_view_changed] Received characterTokens:', characterTokens.length, characterTokens);
          characterTokens.forEach(tokenData => {
            if (tokenData && tokenData.position) {
              console.log('♟️ [gm_view_changed] Adding character token:', tokenData.id, tokenData.playerId, tokenData.position);
              addCharacterTokenFromServer(tokenData.id || tokenData.tokenId, tokenData.position, tokenData.playerId, data.newMapId);
            }
          });


          return {
            mapData,
            gridItemsRaw,
            previousMapId
          };
        })
          .then(({ mapData, gridItemsRaw, previousMapId }) => {
            // Step 4: Load grid items for this map
            return import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
              const currentGridItems = useGridItemStore.getState().gridItems || [];
              const mapGridItems = gridItemsRaw ? (Array.isArray(gridItemsRaw) ? gridItemsRaw : Object.values(gridItemsRaw)) : [];
              const oldMapId = previousMapId;

              // CRITICAL FIX: Always replace target map's items with payload (deduped),
              // and keep non-target maps intact.
              const nonTargetItems = currentGridItems.filter(item => (item?.mapId || 'default') !== data.newMapId);

              const normalizedTargetItems = mapGridItems
                .filter(item => (item?.mapId || data.newMapId || 'default') === data.newMapId)
                .map(item => ({ ...item, mapId: item?.mapId || data.newMapId || 'default' }));

              const dedupedTargetItems = Array.from(
                new Map(normalizedTargetItems.map(item => [item.id, item])).values()
              );

              const updatedGridItems = [...nonTargetItems, ...dedupedTargetItems];
              useGridItemStore.setState({ gridItems: updatedGridItems });

              console.log(`✅ Map switch complete: ${data.mapName} (${data.newMapId})`, {
                gridItemsLoaded: updatedGridItems.length,
                terrainDataPoints: Object.keys(mapData?.terrainData || {}).length
              });

              // Bug 3 fix: After loading cached token data, request a FRESH positions snapshot
              // from the server. Players may have moved while GM was on another map, so
              // server state is authoritative.
              const gameStoreCurrent = useGameStore.getState();
              if (gameStoreCurrent.isGMMode && socket?.connected) {
                socket.emit('gm_request_fresh_positions', {
                  roomId: gameStoreCurrent.multiplayerRoom?.id,
                  mapId: data.newMapId
                });
                console.log(`📡 [gm_view_changed] Requested fresh character positions for map ${data.newMapId}`);
              }
            });
          }).catch(error => {
            console.error('❌ Error during map switch:', error);
          });
      };

      if (gmMapSwapDelay > 0) {
        console.log(`⏱️ [GM VIEW CHANGED] Deferring heavy map swap work by ${gmMapSwapDelay}ms to avoid pre-reveal/flicker`);
        setTimeout(processGmViewChange, gmMapSwapDelay);
      } else {
        processGmViewChange();
      }

    });

    // Handle player location updates (for GM map management UI)
    socket.on('player_location_updated', (data) => {
      console.log('[PLAYER LOCATION UPDATED] Player moved:', data.playerName, '->', data.newMapId);

      // Update the playerMapAssignments in partyStore
      usePartyStore.getState().setPlayerMapAssignment(data.playerId, data.newMapId);

      // Show notification if it wasn't us
      if (data.playerId !== currentPlayerRef.current?.id) {
        addNotificationRef.current('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: data.transferredByGM
            ? `${data.playerName} was transported to ${data.newMapId}`
            : `${data.playerName} traveled to ${data.newMapId}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle GM location updates (for Map Library "GM VIEWING" indicator)
    // This is sent to non-GM players when GM switches their view
    socket.on('gm_location_changed', (data) => {
      console.log('[GM LOCATION CHANGED] GM now viewing map:', {
        gmId: data.gmId,
        gmName: data.gmName,
        newMapId: data.newMapId,
        mapName: data.mapName,
        myId: currentPlayerRef.current?.id
      });

      // Update GM's assignment in partyStore so their tag moves in Map Library
      usePartyStore.getState().setPlayerMapAssignment(data.gmId, data.newMapId);
    });

    // Handle fresh positions received from GM request
    socket.on('fresh_positions_received', (data) => {
      console.log('📡 [fresh_positions_received] Hydrating authoritative GM token positions:', data.mapId);

      const { tokens, characterTokens } = data;

      if (characterTokens) {
        const charStore = require('../../store/characterTokenStore').default.getState();
        Object.values(characterTokens).forEach(tk => {
          if (tk && tk.position) {
            charStore.addCharacterTokenFromServer(tk.id || tk.tokenId, tk.position, tk.playerId, data.mapId);
          }
        });
      }

      if (tokens) {
        const ctStore = useCreatureStore.getState();
        Object.values(tokens).forEach(tk => {
          if (tk && tk.position && (tk.creatureId || tk.id)) {
            ctStore.updateTokenPosition(tk.creatureId || tk.id, tk.position.x, tk.position.y);
          }
        });
      }
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
        const senderId = message.senderId || message.playerId || message.userId;
        if (!senderId) {
          console.error('Whisper message missing senderId:', message);
          return;
        }

        const currentPlayerId = currentPlayerRef.current?.id;
        const currentPlayerName = currentPlayerRef.current?.name;

        // Create tab if it doesn't exist and switch to it
        const resolvedWhisperUserId = addWhisperMessage(senderId, {
          id: message.id || `whisper_${Date.now()}`,
          senderId,
          senderName: message.senderName || 'Unknown',
          senderClass: message.senderClass || 'Unknown',
          senderLevel: message.senderLevel || 1,
          recipientId: message.recipientId || currentPlayerId,
          recipientName: message.recipientName || currentPlayerName || 'Unknown',
          content: message.content,
          timestamp: message.timestamp || message.serverTimestamp || new Date().toISOString(),
          type: 'whisper_received'
        });

        // Switch to whisper tab if not already on it
        const finalWhisperUserId = resolvedWhisperUserId || senderId;
        const finalWhisperTabId = `whisper_${finalWhisperUserId}`;
        const { activeTab } = usePresenceStore.getState();
        if (activeTab !== finalWhisperTabId) {
          setActiveTab(finalWhisperTabId);
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
      // Cleanup socket event listeners
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error'); // Cleanup error handler
      socket.off('room_joined'); // CRITICAL: Clean up auto-join handler
      socket.off('room_created'); // CRITICAL: Clean up GM resume handler
      socket.off('player_joined');
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
      // MAP NAVIGATION: Clean up new event handlers
      socket.off('player_map_changed');
      socket.off('gm_view_changed');
      socket.off('gm_location_changed');
      socket.off('player_location_updated');
      socket.off('global_chat_message');
      socket.off('character_updated');
      socket.off('character_resource_updated'); // CRITICAL: Clean up resource update handler
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

  // ENHANCEMENT: Handle browser close/tab close to properly leave game session
  // This provides best-effort cleanup on browser close, but server-side cleanup is authoritative
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (socket && socket.connected && currentRoom) {
        console.log('🚪 [BeforeUnload] Browser closing, attempting to leave room and party');

        // Try to send leave events (may not complete if browser closes quickly)
        // Server-side disconnect handler is the authoritative cleanup mechanism
        try {
          socket.emit('leave_room');
          socket.emit('leave_party');
          console.log('✅ [BeforeUnload] Leave events sent');
        } catch (error) {
          console.warn('⚠️ [BeforeUnload] Failed to send leave events:', error);
        }
      }
    };

    const handleVisibilityChange = () => {
      // Handle tab switching (hidden/visible)
      if (document.visibilityState === 'hidden') {
        console.log('📱 [VisibilityChange] Tab hidden');
        // Optionally: could emit 'away' status to party here
      } else if (document.visibilityState === 'visible') {
        console.log('📱 [VisibilityChange] Tab visible');
        // Optionally: could emit 'online' status to party here
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [socket, currentRoom]); // Re-run when socket or room changes

  const handleJoinRoom = async (room, socketConnection, isGameMaster, playerObject, password, levelEditorState, gridSettings, skipSetJoiningFalse = false) => {
    // Declare currentUserId at the top scope of handleJoinRoom to avoid ReferenceErrors in subsequent blocks
    let currentUserId = null;

    // Clear the enteringMultiplayer flag - we're now in the room
    sessionStorage.removeItem('enteringMultiplayer');

    // Clear all stores before joining a new room to ensure a clean slate.
    // For permanent room resume, preserve map entities until authoritative payload hydration completes.
    const isPersistentRoomResume = !!room?.persistentRoomId;
    clearAllMultiplayerStores({ preserveMapEntities: isPersistentRoomResume });

    // CRITICAL: Ensure party members are cleared BEFORE we start adding new room members
    // This prevents social party members from leaking into the room HUD
    usePartyStore.getState().replacePartyMembers([]);
    usePresenceStore.setState({
      currentParty: null,
      isInParty: false,
      partyMembers: []
    });

    startJoiningRoom();
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
          if (levelEditorState.windowOverlays !== undefined) {
            levelEditorStore.setWindowOverlays(levelEditorState.windowOverlays);
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

          // CRITICAL: Load grid items for initial sync
          if (levelEditorState.gridItems) {
            import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
              const gridItemStore = useGridItemStore.getState();
              Object.values(levelEditorState.gridItems).forEach(gridItem => {
                console.log('📦 Loading grid item from initial sync:', {
                  id: gridItem.id,
                  name: gridItem.name,
                  position: gridItem.position,
                  gridPosition: gridItem.gridPosition
                });
                gridItemStore.loadGridItem(gridItem);
              });
              console.log('✅ Loaded grid items from initial sync:', Object.keys(levelEditorState.gridItems).length);
            }).catch(error => {
              console.error('Failed to load grid items:', error);
            });
          }

          // CRITICAL: Load tokens for initial sync
          if (levelEditorState.tokens) {
            import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
              const creatureStore = useCreatureStore.getState();
              Object.values(levelEditorState.tokens).forEach(tokenData => {
                creatureStore.loadToken(tokenData);
              });
              console.log('✅ Loaded tokens from initial sync:', Object.keys(levelEditorState.tokens).length);
            }).catch(error => {
              console.error('Failed to load tokens:', error);
            });
          }

          // CRITICAL: Load character tokens for initial sync
          if (levelEditorState.characterTokens) {
            import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
              const creatureStore = useCreatureStore.getState();
              Object.values(levelEditorState.characterTokens).forEach(tokenData => {
                creatureStore.loadToken(tokenData);
              });
              console.log('✅ Loaded character tokens from initial sync:', Object.keys(levelEditorState.characterTokens).length);
            }).catch(error => {
              console.error('Failed to load character tokens:', error);
            });
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
      // Move setCurrentRoom to the end to keep the loading screen active during initialization
      // setCurrentRoom(room);
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

      // CRITICAL: Get userId from authStore for reliable player identification
      try {
        const { user } = useAuthStore.getState();
        currentUserId = user?.uid;
      } catch (e) {
        console.warn('Could not get userId from authStore:', e);
      }

      console.log('🆔 handleJoinRoom - Setting up current player:', {
        playerObject,
        playerObjectId: playerObject?.id,
        playerObjectName: playerObject?.name,
        activeCharacterName: activeCharacter?.name,
        isGameMaster,
        currentUserId
      });

      if (playerObject) {
        currentPlayerData = {
          ...playerObject,
          userId: currentUserId, // CRITICAL: Add Firebase UID for reliable identification
          name: activeCharacter?.name || playerObject.character?.name || playerObject.name,
          isGM: isGameMaster
        };
      } else if (isGameMaster) {
        // Fallback for GM if playerObject is somehow missing
        currentPlayerData = {
          ...room.gm,
          userId: currentUserId, // CRITICAL: Add Firebase UID
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
          userId: currentUserId, // CRITICAL: Add Firebase UID
          name: activeCharacter?.name || lastPlayer.character?.name || lastPlayer.name,
          isGM: false
        };
      }

      setCurrentPlayer(currentPlayerData);
      window.currentPlayerId = currentPlayerData?.id;

      // CRITICAL: Set player ID in levelEditorStore for per-player memory system
      // This ensures each player has individual exploration memories
      try {
        const levelEditorStore = useLevelEditorStore.getState();
        const playerIdForMemories = currentUserId || socketConnection?.id || currentPlayerData?.id || 'local-player';
        if (playerIdForMemories && levelEditorStore.currentPlayerId !== playerIdForMemories) {
          levelEditorStore.setCurrentPlayerId(playerIdForMemories);
          console.log('🆔 Set current player ID for per-player memories:', playerIdForMemories);
        }
      } catch (e) {
        console.warn('Could not set player ID for per-player memories:', e);
      }

      // CRITICAL: Clear auto-join flags upon successful entry
      localStorage.removeItem('selectedRoomId');
      localStorage.removeItem('selectedRoomPassword');
      localStorage.removeItem('isTestRoom');


      // Set initial player count - use room.playerCount when available (already includes GM)
      // Fallback: calculate manually + 1 for GM
      let initialCount = 0;
      if (Array.isArray(room.players)) {
        initialCount = room.players.length;
      } else if (room.players instanceof Map) {
        initialCount = room.players.size;
      } else if (room.players && typeof room.players === 'object') {
        initialCount = Object.keys(room.players).length;
      }
      setActualPlayerCount(room.playerCount || (initialCount + 1));

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
        console.warn('Failed to add player to permanent room:', error);
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
            backgroundDisplayName: activeCharacter.backgroundDisplayName || '',
            path: activeCharacter.path || '',
            pathDisplayName: activeCharacter.pathDisplayName || '',
            level: activeCharacter.level,
            stats: activeCharacter.stats,
            health: activeCharacter.health,
            mana: activeCharacter.mana,
            actionPoints: activeCharacter.actionPoints,
            equipment: activeCharacter.equipment,
            inventory: activeCharacter.inventory || { items: [], currency: { platinum: 0, gold: 0, silver: 0, copper: 0 } },
            experience: activeCharacter.experience,
            exhaustionLevel: activeCharacter.exhaustionLevel,
            // Only include classResource if it has a valid max value
            ...(activeCharacter.classResource?.max ? { classResource: activeCharacter.classResource } : {}),
            tokenSettings: activeCharacter.tokenSettings, // Include token settings
            lore: activeCharacter.lore, // Include lore (which contains characterImage)
            playerId: currentPlayerData?.id || 'current-player'

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

      // ==========================================
      // CRITICAL FIX: MAP ISOLATION & INITIAL LOAD
      // ==========================================

      // 0. Populate Creature Library from Global Legacy Tokens
      // The server doesn't maintain a separate creature library, but it tracks specific tokens globally.
      // We must extract creature data from these tokens to ensure the local library is populated.
      // This safeguards against cases where map-specific token payloads miss embedded creature data.
      if (room.gameState && room.gameState.tokens) {
        let creatureCount = 0;
        Object.values(room.gameState.tokens).forEach(tokenData => {
          if (tokenData.creature) {
            // Add creature to store (store handles deduplication)
            addCreature(tokenData.creature);
            creatureCount++;
          }
        });
        console.log(`📚 Populated creature library with ${creatureCount} creatures from legacy tokens`);
      }

      // 1. Initialize Map Store with all maps (essential for GM Map Library)
      if (room.gameState.maps) {
        import('../../store/mapStore').then(({ default: useMapStore }) => {
          const mapStoreState = useMapStore.getState();
          // Reset store first to clear old maps
          if (mapStoreState.resetStore) mapStoreState.resetStore();

          Object.values(room.gameState.maps).forEach(mapData => {
            // Create map in store
            mapStoreState.createMapWithoutSwitching({
              id: mapData.id,
              name: mapData.name || mapData.id
            });

            // If this is the GM, load thumbnail if available
            if (isGameMaster && mapData.thumbnailUrl) {
              // Logic to set thumbnail would go here
            }
          });
          console.log('🗺️ MapStore initialized with maps:', Object.keys(room.gameState.maps));
        });
      }

      // 2. Determine correct start map for this player
      // Priority: Player's assigned map -> GM's current map (if following) -> Default
      let startMapId = 'default';

      if (currentPlayerData?.currentMapId) {
        startMapId = currentPlayerData.currentMapId;
      } else if (room.gameState.playerMapAssignments && currentPlayerData?.id && room.gameState.playerMapAssignments[currentPlayerData.id]) {
        startMapId = room.gameState.playerMapAssignments[currentPlayerData.id];
      } else if (room.gameState.defaultMapId) {
        startMapId = room.gameState.defaultMapId;
      } else {
        const availableMapIds = Object.keys(room.gameState.maps || {});
        if (availableMapIds.length > 0) {
          startMapId = availableMapIds[0];
        }
      }

      // Ensure start map exists; fallback to default then first available map.
      if (!room.gameState.maps?.[startMapId]) {
        const fallbackDefault = room.gameState.defaultMapId || 'default';
        const availableMapIds = Object.keys(room.gameState.maps || {});
        startMapId = room.gameState.maps?.[fallbackDefault]
          ? fallbackDefault
          : (availableMapIds[0] || 'default');
      }

      // Sync local map state
      setPlayerCurrentMapId(startMapId);
      import('../../store/mapStore').then(({ default: useMapStore }) => {
        useMapStore.setState({ currentMapId: startMapId });
      });

      console.log('📍 Initializing player on map:', startMapId);

      console.log('🔍 [handleJoinRoom] Room structure received from server:', {
        roomId: room.id,
        hasGameState: !!room.gameState,
        gameStateKeys: Object.keys(room.gameState || {}),
        mapsCount: Object.keys(room.gameState?.maps || {}).length,
        mapsKeys: Object.keys(room.gameState?.maps || {}),
        defaultMapId: room.gameState?.defaultMapId,
        hasDefaultMap: !!room.gameState?.maps?.default,
        defaultMapStructure: room.gameState?.maps?.default ? {
          hasGridItems: !!room.gameState.maps.default.gridItems,
          gridItemsCount: Object.keys(room.gameState.maps.default.gridItems || {}).length,
          gridItemIds: Object.keys(room.gameState.maps.default.gridItems || {}),
          hasTerrainData: !!room.gameState.maps.default.terrainData,
          terrainDataCount: Object.keys(room.gameState.maps.default.terrainData || {}).length
        } : null
      });

      // 3. Load Map-Specific Entities (Tokens, Items)
      // We must pull from specific map storage, NOT global legacy storage
      const targetMapData = room.gameState.maps?.[startMapId] || {};

      const tokensRaw = targetMapData.tokens;
      const characterTokensRaw = targetMapData.characterTokens;
      const gridItemsRaw = targetMapData.gridItems;

      const hasInitialTokenPayload = tokensRaw !== undefined || characterTokensRaw !== undefined;
      const hasInitialGridItemsPayload = gridItemsRaw !== undefined;

      if (hasInitialTokenPayload) {
        clearCreatureTokens();
        clearCharacterTokens();
      } else {
        console.warn('⚠️ [handleJoinRoom] Missing initial token payload - preserving existing token stores to avoid accidental wipe');
      }

      // Load Tokens
      const initialTokens = tokensRaw
        ? (Array.isArray(tokensRaw) ? tokensRaw : Object.values(tokensRaw))
        : [];

      if (initialTokens.length > 0) {
        initialTokens.forEach(tokenData => {
          if (tokenData.creature) {
            addCreature(tokenData.creature);
          }

          const creatureRef = tokenData.creatureId || tokenData.creature?.id || tokenData.creature;
          if (creatureRef && tokenData.position) {
            addToken(
              creatureRef,
              tokenData.position,
              false,
              tokenData.id || tokenData.tokenId,
              tokenData.state,
              tokenData.mapId || startMapId
            );
          }
        });
        console.log(`♟️ Loaded ${initialTokens.length} tokens for map ${startMapId}`);
      }

      // Load Character Tokens
      const initialCharacterTokens = characterTokensRaw
        ? (Array.isArray(characterTokensRaw) ? characterTokensRaw : Object.values(characterTokensRaw))
        : [];

      if (initialCharacterTokens.length > 0) {
        // characterTokens are usually indexed by playerId, but structure varies
        initialCharacterTokens.forEach(charTokenData => {
          // Ensure we have necessary data
          if (charTokenData.id && charTokenData.position) {
            // We need character data to add token properly. 
            // If missing, we might need to fetch from party members or room.players
            // For now, simpler add might be needed or relying on party sync

            // Check if it's our own token, if so, ensure local store matches
            if (charTokenData.playerId === currentPlayerData?.id) {
              updateCharacterTokenPosition(charTokenData.position);

              // CRITICAL FIX: Set viewingFromToken for player when they have a character token
              // This enables the afterimage/memory system for players
              try {
                const levelEditorStore = useLevelEditorStore.getState();
                if (levelEditorStore.dynamicFogEnabled && !levelEditorStore.viewingFromToken) {
                  console.log('👁️ [Afterimage] Setting viewingFromToken for player:', charTokenData.id);
                  levelEditorStore.setViewingFromToken({
                    id: charTokenData.id,
                    type: 'character',
                    characterId: charTokenData.playerId,
                    position: charTokenData.position
                  });
                }
              } catch (e) {
                console.warn('Could not set viewingFromToken for player:', e);
              }
            } else {
              // For other players, we need to add them visually
              // But characterStore might not have their data yet. 
              // Rely on party_member_added / player_joined to populate data,
              // then separate sync logic will place them.

              // However, we can perform a raw visual add if we have the data
              if (addCharacterTokenFromServer) {
                addCharacterTokenFromServer(
                  charTokenData.id,
                  charTokenData.position,
                  charTokenData.playerId,
                  charTokenData.mapId || startMapId
                );
              }
            }
          }
        });
        console.log(`♟️ Processing character tokens for map ${startMapId}`);
      }
      if (hasInitialGridItemsPayload) {
        const initialGridItems = gridItemsRaw
          ? (Array.isArray(gridItemsRaw) ? gridItemsRaw : Object.values(gridItemsRaw))
          : [];

        console.log('🔍 [handleJoinRoom] Grid items data:', {
          mapId: startMapId,
          gridItemsRawType: typeof gridItemsRaw,
          gridItemsRawIsArray: Array.isArray(gridItemsRaw),
          gridItemsRawKeys: typeof gridItemsRaw === 'object' && !Array.isArray(gridItemsRaw) ? Object.keys(gridItemsRaw) : [],
          initialGridItemsCount: initialGridItems.length,
          initialGridItemsIds: initialGridItems.map(i => i.id),
          hasInitialPayload: hasInitialGridItemsPayload
        });

        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const currentGridItems = useGridItemStore.getState().gridItems || [];
          const nonTargetItems = currentGridItems.filter(item => (item?.mapId || 'default') !== startMapId);
          const normalizedTargetItems = initialGridItems.map(item => ({
            ...item,
            mapId: item?.mapId || startMapId
          }));

          useGridItemStore.setState({
            gridItems: [...nonTargetItems, ...normalizedTargetItems]
          });

          console.log(`📦 Loaded ${initialGridItems.length} grid items for map ${startMapId}`);
        });
      } else {
        console.warn('⚠️ [handleJoinRoom] Missing initial gridItems payload - preserving existing grid items to avoid accidental wipe');
      }

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

      // CRITICAL: Determine the display name, using account name as fallback for "Character Name"
      let displayName = currentPlayerCharacterName;
      if (displayName === 'Character Name' || displayName === 'Character Name (Room Name)') {
        // Use account name from authStore as fallback
        try {
          const { user } = useAuthStore.getState();
          displayName = user?.displayName || user?.email?.split('@')[0] || currentPlayerData?.name || 'Player';
        } catch (e) {
          displayName = currentPlayerData?.name || 'Player';
        }
      }

      // Create party with room name, GM status, and leader data
      // FIXED: Correct argument order - (partyName, isGM, leaderData)
      // CRITICAL FIX: Clear existing social party members when entering a room to prevent duplicate HUDs
      // Social party and room party are separate systems - we must reset when transitioning
      const partyStoreState = usePartyStore.getState();
      const existingPartyMembers = partyStoreState.partyMembers || [];
      const hasExistingMembers = existingPartyMembers.length > 0;

      // Always clear social party members when entering a room to prevent duplicate HUDs
      if (hasExistingMembers) {
        console.log('🧹 Clearing existing party members before room entry to prevent duplicates', {
          existingCount: existingPartyMembers.length,
          existingNames: existingPartyMembers.map(m => m.name)
        });
        usePartyStore.getState().replacePartyMembers([]);
      }

      // CRITICAL: Get character resources with proper fallbacks
      const createHealth = (activeCharacter?.health?.max > 0) ? activeCharacter.health :
        (characterStore.health?.max > 0) ? characterStore.health : { current: 45, max: 50 };
      const createMana = (activeCharacter?.mana?.max > 0) ? activeCharacter.mana :
        (characterStore.mana?.max > 0) ? characterStore.mana : { current: 45, max: 50 };
      const createActionPoints = (activeCharacter?.actionPoints?.max > 0) ? activeCharacter.actionPoints :
        (characterStore.actionPoints?.max > 0) ? characterStore.actionPoints : { current: 1, max: 3 };

      // Set party basics in store directly instead of createParty() which is async/unreliable in this flow
      usePartyStore.setState({
        currentParty: { id: room.id, name: room.name },
        isInParty: true,
        partyChatMessages: [],
        pendingPartyInvites: [],
        sentPartyInvites: []
      });

      // CRITICAL FIX: Ensure initial leader is set for the party using the real player ID
      // Set synchronously (not via async import) to ensure leaderId is available when HUD renders
      const leaderId = isGameMaster ? (currentPlayerData?.id || 'current-player') : (room.gm?.id || 'room-gm');
      if (leaderId) {
        usePartyStore.getState().setLeader(leaderId, true);
        console.log('👑 Party leader set:', leaderId, 'isGM:', isGameMaster);
      }

      // Use real player ID so other players can identify this member uniquely
      const currentPlayerId = currentPlayerData?.id || 'current-player';

      // CRITICAL: Get character data with explicit fallbacks for each resource
      // This ensures HUD bars always have valid values even without an active character
      const charHealth = activeCharacter?.health?.max ? activeCharacter.health :
        (characterStore.health?.max ? characterStore.health : { current: 45, max: 50 });
      const charMana = activeCharacter?.mana?.max ? activeCharacter.mana :
        (characterStore.mana?.max ? characterStore.mana : { current: 45, max: 50 });
      const charActionPoints = activeCharacter?.actionPoints?.max ? activeCharacter.actionPoints :
        (characterStore.actionPoints?.max ? characterStore.actionPoints : { current: 1, max: 3 });

      const currentPlayerMember = {
        id: currentPlayerId,
        socketId: socketConnection?.id || currentPlayerId, // CRITICAL: Store socket.id for character_updated lookups
        userId: currentUserId, // CRITICAL: Firebase UID for reliable identification
        name: displayName, // Use displayName with account name fallback
        isGM: isGameMaster, // Include GM status for current player
        isConnected: true, // CRITICAL: Required for PartyHUD displayMembers filter
        character: {
          class: activeCharacter?.class || characterStore.class || 'Unknown',
          level: activeCharacter?.level || characterStore.level || 1,
          health: charHealth,
          mana: charMana,
          actionPoints: charActionPoints,
          race: activeCharacter?.race || characterStore.race || 'Unknown',
          raceDisplayName: activeCharacter?.raceDisplayName || characterStore.raceDisplayName || 'Unknown',
          background: activeCharacter?.background || characterStore.background || '',
          backgroundDisplayName: backgroundDisplayName,
          path: activeCharacter?.path || characterStore.path || '',
          pathDisplayName: pathDisplayName,
          // Only include classResource if there's an active character with a valid resource system
          // Otherwise omit it so ClassResourceBar doesn't render a 0/0 bar
          ...(activeCharacter?.classResource?.max ? { classResource: activeCharacter.classResource } : {}),
          tokenSettings: activeCharacter?.tokenSettings || characterStore.tokenSettings || {}, // Include token settings, default to empty object
          lore: activeCharacter?.lore || characterStore.lore || {} // Include lore (which contains characterImage), default to empty object
        }
      };

      // Ensure resources never default to 0/0 for display if stores are empty
      if (!currentPlayerMember.character.health?.max) currentPlayerMember.character.health = { current: 45, max: 50 };
      if (!currentPlayerMember.character.mana?.max) currentPlayerMember.character.mana = { current: 45, max: 50 };
      if (!currentPlayerMember.character.actionPoints?.max) currentPlayerMember.character.actionPoints = { current: 1, max: 3 };

      // CRITICAL FIX: Ensure current player member has correct isGM status
      currentPlayerMember.isGM = isGameMaster;

      console.log('🎮 Current player member data:', {
        id: currentPlayerMember.id,
        socketId: currentPlayerMember.socketId,
        userId: currentPlayerMember.userId,
        name: currentPlayerMember.name,
        isGM: currentPlayerMember.isGM,
        health: currentPlayerMember.character.health,
        mana: currentPlayerMember.character.mana,
        actionPoints: currentPlayerMember.character.actionPoints
      });

      // Add current player as first party member
      usePartyStore.getState().addPartyMember(currentPlayerMember);




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

      // 3. Add GM to party if GM is not the current player
      const gmId = room.gm?.id;
      const gmUserId = room.gmId || room.gm?.userId; // CRITICAL: Use room.gmId from server
      const isGmSelf = (gmId && (gmId === currentPlayerData?.id || gmId === currentPlayerData?.userId)) ||
        (gmUserId && (gmUserId === currentPlayerData?.id || gmUserId === currentPlayerData?.userId));

      if (room.gm && !isGmSelf) {
        let gmCharacterName = room.gm.character?.name || room.gm.name;

        // CRITICAL: Use account name as fallback for "Character Name"
        if (gmCharacterName === 'Character Name' || gmCharacterName === 'Character Name (Room Name)') {
          // Try to get GM's account name from room data
          gmCharacterName = room.gmAccountName || room.gm.name || 'Game Master';
        }

        console.log('👤 Adding GM to party:', {
          gmId: room.gm.id,
          gmName: gmCharacterName,
          gmUserId: gmUserId,
          gmSocketId: room.gm?.socketId
        });

        // Only include classResource if it has a valid max value
        const gmClassResource = room.gm.character?.classResource;

        // Ensure GM has valid resource data with proper fallbacks
        const gmHealth = room.gm.character?.health?.max ? room.gm.character.health : { current: 45, max: 50 };
        const gmMana = room.gm.character?.mana?.max ? room.gm.character.mana : { current: 45, max: 50 };
        const gmActionPoints = room.gm.character?.actionPoints?.max ? room.gm.character.actionPoints : { current: 1, max: 3 };

        const gmCharacter = {
          class: room.gm.character?.class || 'Unknown',
          level: room.gm.character?.level || 1,
          health: gmHealth,
          mana: gmMana,
          actionPoints: gmActionPoints,
          race: room.gm.character?.race || 'Unknown',
          subrace: room.gm.character?.subrace || '',
          raceDisplayName: room.gm.character?.raceDisplayName || 'Unknown',
          background: room.gm.character?.background || '',
          backgroundDisplayName: room.gm.character?.backgroundDisplayName || '',
          path: room.gm.character?.path || '',
          pathDisplayName: room.gm.character?.pathDisplayName || '',
          tokenSettings: room.gm.character?.tokenSettings || {},
          lore: room.gm.character?.lore || {}
        };

        // Only add classResource if it has a valid max value (prevents 0/0 bar)
        if (gmClassResource?.max) {
          gmCharacter.classResource = gmClassResource;
        }

        addPartyMember({
          id: room.gm.id,
          socketId: room.gm.socketId || room.gm.id, // CRITICAL: Store socket.id for character_updated lookups
          userId: gmUserId, // CRITICAL: Propagate Firebase UID
          name: gmCharacterName,
          isGM: true,
          isConnected: true, // CRITICAL: Required for PartyHUD displayMembers filter
          character: gmCharacter
        });

        addUser({
          id: room.gm.id,
          name: gmCharacterName,
          class: room.gm.character?.class || 'Unknown',
          level: room.gm.character?.level || 1,
          status: 'online'
        });

        // Set GM as party leader
        usePartyStore.getState().setLeader(room.gm.id, room.gm.id === currentPlayerData?.id);
      }

      // CRITICAL FIX: Add other players to party using the uniquePlayers list
      // Filter out the GM if they were already added above to prevent duplicate HUDs
      const playersToAdd = uniquePlayers.filter(player => player.id !== room.gm?.id);

      if (playersToAdd.length > 0) {
        playersToAdd.forEach(player => {
          // uniquePlayers already filters out current player and duplicates
          let playerCharacterName = player.character?.name || player.name;

          // CRITICAL: Use account name as fallback for "Character Name"
          if (playerCharacterName === 'Character Name' || playerCharacterName === 'Character Name (Room Name)') {
            playerCharacterName = player.accountName || player.name || 'Player';
          }

          // Only include classResource if it has a valid max value
          const playerClassResource = player.character?.classResource;
          const playerCharacter = {
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
            tokenSettings: player.character?.tokenSettings || {},
            lore: player.character?.lore || {}
          };

          // Only add classResource if it has a valid max value (prevents 0/0 bar)
          if (playerClassResource?.max) {
            playerCharacter.classResource = playerClassResource;
          }

          const playerMember = {
            id: player.id,
            socketId: player.socketId || player.id, // CRITICAL: Store socket.id for character_updated lookups
            userId: player.userId, // CRITICAL: Firebase UID for reliable identification
            name: playerCharacterName,
            isGM: player.isGM || false,
            isConnected: true, // CRITICAL: Required for PartyHUD displayMembers filter
            character: playerCharacter
          };

          addPartyMember(playerMember);

          addUser({
            id: player.id,
            name: playerCharacterName,
            class: player.character?.class || 'Unknown',
            level: player.character?.level || 1,
            status: 'online'
          });
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
          const currentPlayerId = currentPlayerData?.id || currentPlayerRef.current?.id || socketConnection?.id;

          socketConnection.emit('chat_message', {
            message: message,
            content: message,
            type: 'party', // Explicitly set as party chat
            playerId: currentPlayerId,
            senderId: currentPlayerId,
            playerName: currentPlayerCharacterName,
            senderName: currentPlayerCharacterName
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

      // Initialize game state manager for permanent room state
      if (room.persistentRoomId || room.id) {
        const roomId = room.persistentRoomId || room.id;
        const isPermanentRoom = !!room.persistentRoomId;

        console.log('🎮 Initializing game state manager for room:', roomId, {
          isPermanentRoom,
          isGM: isGameMaster,
          hasSavedState: isPermanentRoom
        });

        // CRITICAL FIX: Re-enable gameStateManager for permanent rooms
        // This will:
        // 1. Load saved state from Firebase if room has been played before (resuming rooms)
        // 2. Skip loading for fresh rooms (no saved state yet)
        // 3. Auto-save changes for GMs only
        // 4. Set up store listeners to track changes for auto-save
        gameStateManager.initialize(roomId, isGameMaster).then(() => {
          console.log('✅ Game state manager initialized successfully');
        }).catch((error) => {
          console.error('❌ Failed to initialize game state manager:', error);
        });
      }

      // Set current room after all initialization is complete
      setCurrentRoom(room);

      // Show successful join notification
      if (!skipSetJoiningFalse) {
        setIsJoiningRoom(false);
      }
      setConnectionStatus('connected');

      // Welcome notification
      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `🎉 Welcome to ${room.name}! You have joined as ${isGameMaster ? 'Game Master' : 'Player'}. The adventure awaits!`,
        type: 'system',
        timestamp: new Date().toISOString()
      });

      // CRITICAL: Trigger initial character sync so everyone sees us correctly
      import('../../store/characterStore').then(({ default: useCharacterStore }) => {
        useCharacterStore.getState().syncWithMultiplayer();
        console.log('🚀 Triggered initial character sync upon room entry');
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
      if (!skipSetJoiningFalse) {
        setIsJoiningRoom(false);
      }
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

  // Handler for when user clicks Continue on the loading screen
  const handleLoadingContinue = async () => {
    if (pendingRoomData) {
      console.log('🚀 [MultiplayerApp] User clicked Continue, starting RPG fade out...');
      setLoadingStatusMessage('Entering the realm...');

      // Start fade out immediately and hide button
      setIsFadingOut(true);
      const roomToJoin = { ...pendingRoomData };
      pendingRoomDataRef.current = null; // Clear ref so no more buffering happens
      activeJoinIdRef.current = null; // Clear join ID to allow future joins

      try {
        // Give the browser a moment to commit the state change and start the animation 
        // before processing the heavy handleJoinRoom logic
        await new Promise(resolve => setTimeout(resolve, 50));

        // SAFETY TIMEOUT: Ensure we eventually exit loading state even if handleJoinRoom hangs
        const safetyExitTimer = setTimeout(() => {
          if (isJoiningRoomRef.current) {
            console.warn('⚠️ [MultiplayerApp] Safety timeout triggered during handleJoinRoom. Forcing loading screen closed.');
            setIsJoiningRoom(false);
            setIsFadingOut(false);
          }
        }, 12000); // 12 seconds safety net

        console.log('🛠️ [MultiplayerApp] Executing handleJoinRoom...');

        // Perform the actual room join logic but don't clear loading screen yet
        await handleJoinRoom(
          roomToJoin.room,
          roomToJoin.socket,
          roomToJoin.isGM,
          roomToJoin.player,
          roomToJoin.password,
          roomToJoin.levelEditor,
          roomToJoin.gridSettings,
          true // skipSetJoiningFalse
        );

        console.log('🛠️ [MultiplayerApp] handleJoinRoom execution completed');
        clearTimeout(safetyExitTimer);
      } catch (error) {
        console.error('❌ Error handling loading continue:', error);
        // Ensure we eventually exit loading state even on error
        setTimeout(() => {
          setIsJoiningRoom(false);
          setIsFadingOut(false);
        }, 3000);
      } finally {
        // Wait for the fade animation to complete fully (now slower for cinematic effect)
        setTimeout(() => {
          setIsJoiningRoom(false);
          setIsFadingOut(false);
          setPendingRoomData(null);
          setIsRoomReady(false);
          setLoadingProgress(0);
          setShowContinue(false);
          console.log('✨ [MultiplayerApp] RPG fade out complete');
        }, 2500); // 2.5s matches the updated CSS transition
      }
    }
  };

  // If joining via direct navigation, show themed loading instead of lobby
  // UPDATED: Now also shows when isFadingOut is true to allow transition
  if ((isJoiningRoom && !currentRoom) || isFadingOut) {
    const pendingRoomId = localStorage.getItem('selectedRoomId');
    const roomName = pendingRoomData?.room?.name || currentRoom?.name || (pendingRoomId ? "your selected hall" : "");
    return (
      <>
        {/* Render room content behind the overlay during fade out */}
        {currentRoom && (
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
              mapTransition={mapTransition}
              setMapTransition={setMapTransition}
              playerCurrentMapId={playerCurrentMapId}
            />
          </RoomProvider>
        )}
        <UnifiedTransitionOverlay
          isVisible={true}
          mode="join"
          progress={isFadingOut ? 100 : loadingProgress}
          statusMessage={loadingStatusMessage}
          roomName={roomName}
          isReady={isRoomReady && !isFadingOut}
          showContinue={showContinue && isRoomReady}
          isFadingOut={isFadingOut}
          onContinue={handleLoadingContinue}
        />
      </>
    );
  }

  // If not in a room, show the lobby
  if (!currentRoom) {
    return (
      <RoomLobby
        socket={socket}
        onJoinRoom={handleJoinRoom}
        onReturnToLanding={onReturnToSinglePlayer}
        onJoinAttempt={(roomId) => {
          // CRITICAL FIX: Set enteringMultiplayer flag and clear party BEFORE any room operation
          // This prevents social party members from appearing in the room HUD
          sessionStorage.setItem('enteringMultiplayer', 'true');
          try {
            const currentMembers = usePartyStore.getState().partyMembers || [];
            if (currentMembers.length > 0) {
              console.log('🧹 Clearing social party members on join attempt', {
                count: currentMembers.length,
                names: currentMembers.map(m => m.name)
              });
              usePartyStore.getState().clearPartyMembers();
            }
          } catch (e) {
            console.warn('⚠️ Failed to clear party members on join attempt:', e);
          }

          isAutoJoinSequenceRef.current = true; // NEW creation/join from lobby should also auto-continue
          startJoiningRoom();
        }}
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
        mapTransition={mapTransition}
        setMapTransition={setMapTransition}
        playerCurrentMapId={playerCurrentMapId}
      />
    </RoomProvider>
  );
}

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
  actualPlayerCount,
  mapTransition,
  setMapTransition,
  playerCurrentMapId
}) => {
  const { enterMultiplayerRoom, exitRoom } = useRoomContext();
  const { maps, currentMapId } = useMapStore();

  // CRITICAL FIX: For players, use playerCurrentMapId to show their actual map location
  // For GM, use currentMapId (their editing view)
  const effectiveMapId = isGM ? currentMapId : (playerCurrentMapId || currentMapId);
  const currentMap = maps.find(m => m.id === effectiveMapId);
  const currentMapName = currentMap?.name || 'Default Map';

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

  // Memoize transition complete handler to prevent re-triggering effect in overlay
  const handleTransitionComplete = useCallback(() => {
    setMapTransition({ isActive: false, mapName: '', transferredByGM: false });
  }, [setMapTransition]);

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
          currentMapName={currentMapName}
          onMapIconClick={() => window.dispatchEvent(new CustomEvent('open-window', { detail: 'map-library' }))}
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

      {/* Map Transition Overlay - shown when traveling between maps */}
      <UnifiedTransitionOverlay
        isVisible={mapTransition.isActive}
        mode="map"
        mapName={mapTransition.mapName}
        transferredByGM={mapTransition.transferredByGM}
        onTransitionComplete={handleTransitionComplete}
      />
    </div>
  );
};

export default MultiplayerApp;
