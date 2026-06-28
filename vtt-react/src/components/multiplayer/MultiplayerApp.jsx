import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomLobby from './RoomLobby';
import GameSessionInvitation from './GameSessionInvitation';
import CursorTracker from './CursorTracker';
import UnifiedTransitionOverlay, { TRANSITION_TIMINGS } from './UnifiedTransitionOverlay';
import gameStateManager from '../../services/gameStateManager';
import optimisticUpdatesService from '../../services/optimisticUpdatesService';
import { setupSocketConnection, setupCursorTracking, setupAuthChangeHandler } from './useSocketConnection';
import { registerAllSocketHandlers } from './socketHandlers/registerAllHandlers';
import { handleJoinRoom as joinRoomImpl } from './roomJoinHandler';
import ConnectionStatusIndicator from './ConnectionStatusIndicator';
import GameSurface from './GameSurface';

import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import { setCombatSyncSocket, clearCombatSyncSocket } from '../../store/chatStore';
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
import useTargetingStore from '../../store/targetingStore';
import useTravelStore from '../../store/travelStore';
import QuestShareDialog from '../quest-log/QuestShareDialog';
import QuestRewardDeliveryDialog from '../quest-log/QuestRewardDeliveryDialog';
import { showPlayerJoinNotification, showPlayerLeaveNotification, showGMDisconnectedNotification } from '../../utils/playerNotifications';
import { RoomProvider, useRoomContext } from '../../contexts/RoomContext';
import { getBackgroundData } from '../../data/backgroundData';
import { getCustomBackgroundData, getEnhancedPathData } from '../../data/legacyDisciplineData';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import './styles/MultiplayerApp.css';

// Import main game components
import Grid from "../Grid";
import Navigation from "../Navigation";
const HUDContainer = lazy(() => import("../hud/HUDContainer"));
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
import AudioPlayerWidget from "../jukebox/AudioPlayerWidget";

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



const MultiplayerApp = ({ onReturnToSinglePlayer }) => {
  // CRITICAL FIX: Set enteringMultiplayer flag IMMEDIATELY on mount
  // This must happen BEFORE any socket initialization to prevent the old
  // social socket from being disconnected (which would disband the party)
  useEffect(() => {
    sessionStorage.setItem('enteringMultiplayer', 'true');
    return () => {
      // Clear flag and reset targeting when leaving multiplayer
      sessionStorage.removeItem('enteringMultiplayer');
      useTargetingStore.getState().resetStore?.();
    };
  }, []);

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
  const [pendingControlOffer, setPendingControlOffer] = useState(null); // { tokenId, tokenName, offeredBy, targetPlayerName }
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
    console.log('ðŸ”„ [MultiplayerApp] startJoiningRoom called at:', new Date(now).toLocaleTimeString());
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
    if (!startTime) {
      console.log('â³ [MultiplayerApp] Progress Effect: Waiting for startTime...');
      return;
    }

    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsed);
    
    // CRITICAL DEBUG: Log why we are (or aren't) auto-continuing
    const isInvitation = !!pendingRoomData?.isInvitationJoin;
    const isGMCreating = !!isGM && !currentRoom;
    const readyToContinue = isRoomReady && !isFadingOut;
    
    console.log('â±ï¸ [MultiplayerApp] Progress Effect:', {
      isRoomReady,
      isJoiningRoom,
      isFadingOut,
      showContinue,
      elapsed,
      remainingTime,
      isInvitation,
      isGMCreating,
      isGM, // State check
      hasPendingRoomData: !!pendingRoomData,
      readyToContinue
    });

    if (!readyToContinue) return;

    // Ensure progress completes to 100%
    setLoadingProgress(100);

    // AUTOMATION: If this was an invitation or auto-join flow, skip the button
    // Also skip for GMs who just created the room (they're in a hurry!)
    if (isInvitation || isGMCreating) {
      console.log('âœ¨ [MultiplayerApp] Auto-continue triggered:', { isInvitation, isGMCreating });
      const timer = setTimeout(() => {
        if (isJoiningRoom && !isFadingOut) {
          handleLoadingContinue();
        }
      }, remainingTime);
      return () => clearTimeout(timer);
    }

    // Otherwise, show continue button after minimum duration
    console.log('ðŸ‘‹ [MultiplayerApp] Auto-continue not triggered, showing Continue button in:', remainingTime);
    const timer = setTimeout(() => {
      if (isJoiningRoom && !isFadingOut) {
        setShowContinue(true);
      }
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [isRoomReady, isJoiningRoom, isFadingOut, joinStartTime, isGM, !!currentRoom, !!pendingRoomData?.isInvitationJoin, pendingRoomData]);

  // SAFETY NET: Guarantee the loading overlay can never hang indefinitely.
  // If we're still "joining" (no room, not fading) well beyond the normal window,
  // force-dismiss and surface an error instead of stranding the user on "Finalizing...".
  useEffect(() => {
    if (!isJoiningRoom || isFadingOut || currentRoom) return;

    const STUCK_THRESHOLD = 20000; // 20s â€” far beyond the ~1.5s normal auto-continue window

    const timeoutId = setTimeout(() => {
      if (isJoiningRoomRef.current && !currentRoomRef.current && !isRoomReady && !isFadingOut) {
        console.error('âŒ› [MultiplayerApp] Loading safety net triggered â€” stuck joining. Forcing dismissal.');
        setIsJoiningRoom(false);
        setIsRoomReady(false);
        setPendingRoomData(null);
        setLoadingProgress(0);
        setLoadingStatusMessage(null);
        setShowContinue(false);
        setConnectionStatus('error');
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: 'Connection to the realm could not be established. Please try again.',
          type: 'error',
          timestamp: new Date().toISOString()
        });
      }
    }, STUCK_THRESHOLD);

    return () => clearTimeout(timeoutId);
  }, [isJoiningRoom, isFadingOut, currentRoom, isRoomReady, addNotification, setConnectionStatus]);

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
        console.log(`ðŸ—ºï¸ [MapSync] Synced playerCurrentMapId with mapStore: ${currentMapId}`);
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
    console.log('ðŸ§¹ Clearing all stores for clean room initialization', { preserveMapEntities });

    if (!preserveMapEntities) {
      // Level editor
      const levelEditorStore = useLevelEditorStore.getState();
      if (levelEditorStore.resetStore) levelEditorStore.resetStore();

      // Creatures and Character Tokens
      useCreatureStore.getState().clearCreatureTokens();
      useCharacterTokenStore.getState().clearCharacterTokens();
    } else {
      console.log('ðŸ›¡ï¸ Preserving map entity stores for permanent room resume');
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

    // Targeting Store - Always reset target HUD when joining/creating rooms
    const targetingStore = useTargetingStore.getState();
    if (targetingStore && targetingStore.resetStore) targetingStore.resetStore();

    console.log('âœ… All stores cleared');
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
      console.log('ðŸ”„ [Auto-Join] Already attempted or in progress, skipping');
      return;
    }

    // Set immediately before any async work to block other calls
    autoJoinAttemptedRef.current = true;

    const selectedRoomId = localStorage.getItem('selectedRoomId');
    const selectedRoomPassword = sessionStorage.getItem('selectedRoomPassword');
    const isGMResume = localStorage.getItem('isGMResume') === 'true';
    const resumeRoomName = localStorage.getItem('resumeRoomName');
    const pendingInvitation = sessionStorage.getItem('pendingGMSessionInvitation');

    console.log('ðŸ” [Auto-Join] checkAutoJoin triggered:', {
      hasSelectedRoom: !!selectedRoomId,
      hasInvitation: !!pendingInvitation,
      isJoining: isJoiningRoomRef.current,
      inRoom: !!currentRoomRef.current
    });

    // Handle session invitations first (priority)
    if (pendingInvitation && !currentRoomRef.current) {
      try {
        const invitation = JSON.parse(pendingInvitation);
        console.log('ðŸ“¨ [Auto-Join] Found pending GM session invitation, responding:', invitation.partyName);
        setLoadingStatusMessage(`Accepting invitation from ${invitation.senderName || 'GM'}...`);

        // Mark that we've initiated an invitation response sequence
        isAutoJoinSequenceRef.current = true;

        startJoiningRoom();
        setConnectionStatus('connecting');

        // CRITICAL: Ensure we only emit once per unique invitation ID, but allow controlled retries
        const lastEmittedInvitationId = sessionStorage.getItem('lastEmittedInvitationId');
        const retryCount = parseInt(sessionStorage.getItem('invitationRetryCount') || '0', 10);

        if (lastEmittedInvitationId === invitation.invitationId && retryCount >= 1) {
          console.log('â­ï¸ [Auto-Join] Already attempted and retried for this invitation, waiting for server or timeout...');
          return;
        }

        if (lastEmittedInvitationId === invitation.invitationId) {
          console.log('ðŸ”„ [Auto-Join] Retrying invitation response (1/1)...');
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
            console.warn('âš ï¸ [Auto-Join] Server took too long to respond to invitation, resetting attempt flag');
            autoJoinAttemptedRef.current = false;

            // If we've already retried, show error or allow manual join
            const finalRetryCount = parseInt(sessionStorage.getItem('invitationRetryCount') || '0', 10);
            if (finalRetryCount >= 1) {
              console.error('âŒ [Auto-Join] Invitation response totally timed out after retry.');
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
      console.log('ðŸš€ [Auto-Join] Initiating join for:', selectedRoomId, { isGMResume });

      // Mark as auto-continue sequence
      isAutoJoinSequenceRef.current = true;

      // Clear auto-join flags immediately to prevent loops on error/reconnect
      localStorage.removeItem('selectedRoomId');
      sessionStorage.removeItem('selectedRoomPassword');
      localStorage.removeItem('isGMResume');
      localStorage.removeItem('resumeRoomName');

      startJoiningRoom();
      setConnectionStatus('connecting');

      // Ensure character data is loaded before joining
      let activeCharacter = getActiveCharacter();
      if (!activeCharacter) {
        console.log('ðŸš€ [Auto-Join] Loading active character before join...');
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
        console.log('ðŸ‘‘ [Auto-Join] GM resuming permanent room - creating on server:', selectedRoomId);

        // CRITICAL FIX: Clear social party members BEFORE creating room (not after)
        try {
          const currentPartyMembers = usePartyStore.getState().partyMembers || [];
          if (currentPartyMembers.length > 0) {
            console.log('ðŸ§¹ Clearing social party members BEFORE create_room');
            usePartyStore.getState().clearPartyMembers();
          }
        } catch (e) {
          console.warn('âš ï¸ Failed to clear party members before create_room:', e);
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

        console.log('ðŸ“¤ [Auto-Join] Sending create_room for GM resume:', selectedRoomId);
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

        console.log('ðŸ“¤ [Auto-Join] Sending join_room:', selectedRoomId);
        socket.emit('join_room', joinData);
      }
    } else if (isJoiningRoomRef.current && !pendingInvitation && !selectedRoomId) {
      // CRITICAL: If we're in joining state but there's no selectedRoomId or invitation,
      // the auto-join failed or was already cleared - reset the state
      console.log('âš ï¸ [Auto-Join] No room data found but isJoiningRoom=true, resetting state');
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
        console.log('âš¡ [Auto-Trigger] Detected pending invitation in storage, triggering join');
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

    cursorDebug('ðŸ”Œ [Cursor] Resolved socket URL:', {
      resolvedUrl,
      nodeEnv: process.env.NODE_ENV,
      hasEnvOverride: !!process.env.REACT_APP_SOCKET_URL
    });

    return resolvedUrl;
  }, []); // Empty dependency array since environment variables don't change

  // Environment check logs removed for performance

  // Initialize socket connection when component mounts
  useEffect(() => {
    return setupSocketConnection({
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
    });
  }, [SOCKET_URL]);

  // Cursor tracking - emit cursor position to other players
  useEffect(() => {
    return setupCursorTracking({
      socket,
      showCursorTracking,
      cursorUpdateThrottle,
      currentPlayerRef,
      currentRoomRef
    });
  }, [socket, showCursorTracking, cursorUpdateThrottle]);

  // Handle authentication changes - reconnect socket with fresh token
  useEffect(() => {
    return setupAuthChangeHandler({
      socket,
      isJoiningRoomRef,
      isAutoJoinSequenceRef
    });
  }, [socket]);


  // Consolidate all multiplayer socket listeners
  useEffect(() => {
    if (!socket) return;

    const cleanup = registerAllSocketHandlers({
      socket,
      useDeltaSyncTokens: false,
      currentRoom,
      setIsConnecting, setConnectionQuality, setConnectionStatus, setIsJoiningRoom,
      setPendingRoomData, setIsRoomReady, setPendingGameSessionInvitations,
      setError, setActualPlayerCount, setConnectedPlayers, setIsGM,
      setLoadingStatusMessage, setPendingControlOffer, setPlayerCurrentMapId,
      setMapTransition, setCurrentPlayer, setCurrentRoom, setSocket,
      isJoiningRoomRef, currentRoomRef, currentPlayerRef, pendingRoomDataRef,
      activeJoinIdRef, autoJoinAttemptedRef, isAutoJoinSequenceRef,
      isGMRef, addNotificationRef, addUserRef, removeUserRef,
      addPartyMemberRef, removePartyMemberRef, playerCurrentMapIdRef,
      isInitialMapLoadRef, joinStartTimeRef, roomPasswordRef,
      checkAutoJoin, handleJoinRoom, handleLeaveRoom, handleLoadingContinue,
      startJoiningRoom, getActiveCharacter, clearAllMultiplayerStores,
      navigate, showMapTransitions, showCursorTracking,
      clearCreatureTokens, clearCharacterTokens, updateCreatureTokenPosition,
      addCreature, addToken, removeToken, addPartyMember, removePartyMember,
      addUser, removeUser, updatePartyMember, addNotification,
      showPlayerJoinNotification, showPlayerLeaveNotification,
      showGMDisconnectedNotification, getGridSystem, playerCurrentMapId,
      loadActiveCharacter, startCharacterSession, setRoomName,
      updateCharacterInfo, tokenUpdateThrottleRef, cursorThrottleRef,
      updateBatchRef, batchTimeoutRef,
      THROTTLE_CLEANUP_INTERVAL, THROTTLE_ENTRY_LIFETIME,
      PLAYER_THROTTLE_MS, GM_THROTTLE_MS
    });

    return cleanup;
  }, [socket]); // Reduced dependencies to prevent excessive re-runs

  // ENHANCEMENT: Handle browser close/tab close to properly leave game session
  // This provides best-effort cleanup on browser close, but server-side cleanup is authoritative
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (socket && socket.connected && currentRoom) {
        console.log('ðŸšª [BeforeUnload] Browser closing, attempting to leave room and party');

        // Try to send leave events (may not complete if browser closes quickly)
        // Server-side disconnect handler is the authoritative cleanup mechanism
        try {
          socket.emit('leave_room');
          socket.emit('leave_party');
          console.log('âœ… [BeforeUnload] Leave events sent');
        } catch (error) {
          console.warn('âš ï¸ [BeforeUnload] Failed to send leave events:', error);
        }
      }
    };

    const handleVisibilityChange = () => {
      // Handle tab switching (hidden/visible)
      if (document.visibilityState === 'hidden') {
        console.log('ðŸ“± [VisibilityChange] Tab hidden');
        // Optionally: could emit 'away' status to party here
      } else if (document.visibilityState === 'visible') {
        console.log('ðŸ“± [VisibilityChange] Tab visible');
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
    return joinRoomImpl(room, socketConnection, isGameMaster, playerObject, password, levelEditorState, gridSettings, skipSetJoiningFalse, {
      socket, currentRoom, isGM, isJoiningRoom, isFadingOut, isRoomReady,
      joinStartTime, pendingRoomData, connectionStatus, currentPlayer,
      setIsConnecting, setConnectionQuality, setConnectionStatus, setIsJoiningRoom,
      setPendingRoomData, setIsRoomReady, setPendingGameSessionInvitations,
      setError, setActualPlayerCount, setConnectedPlayers, setIsGM,
      setLoadingStatusMessage, setPendingControlOffer, setPlayerCurrentMapId,
      setMapTransition, setCurrentPlayer, setCurrentRoom, setSocket,
      setLoadingProgress, setShowContinue, setJoinStartTime, setIsFadingOut,
      isJoiningRoomRef, currentRoomRef, currentPlayerRef, pendingRoomDataRef,
      activeJoinIdRef, autoJoinAttemptedRef, isAutoJoinSequenceRef,
      isGMRef, addNotificationRef, addUserRef, removeUserRef,
      addPartyMemberRef, removePartyMemberRef, playerCurrentMapIdRef,
      isInitialMapLoadRef, joinStartTimeRef, roomPasswordRef,
      startJoiningRoom, getActiveCharacter, clearAllMultiplayerStores,
      navigate, showMapTransitions, showCursorTracking,
      clearCreatureTokens, clearCharacterTokens, updateCreatureTokenPosition,
      addCreature, addToken, removeToken, addPartyMember, removePartyMember,
      addUser, removeUser, updatePartyMember, addNotification,
      showPlayerJoinNotification, showPlayerLeaveNotification,
      showGMDisconnectedNotification, getGridSystem, playerCurrentMapId,
      loadActiveCharacter, startCharacterSession, setRoomName,
      updateCharacterInfo, tokenUpdateThrottleRef, cursorThrottleRef,
      updateBatchRef, batchTimeoutRef,
      THROTTLE_CLEANUP_INTERVAL, THROTTLE_ENTRY_LIFETIME,
      PLAYER_THROTTLE_MS, GM_THROTTLE_MS
    });
  };

  const handleLeaveRoom = async () => {
    // Immediately update UI state for instant response
    setCurrentRoom(null);
    setCurrentPlayer(null);
    window.currentPlayerId = null;
    clearCombatSyncSocket();

    setIsGM(false);
    setConnectedPlayers([]);

    // Clear party members so HUD doesn't persist stale player entries
    usePartyStore.getState().clearPartyMembers();

    // Clear multiplayer players from chat system immediately
    connectedPlayers.forEach(player => {
      removeUser(player.id);
    });

    // Clear chat multiplayer integration
    clearMultiplayerIntegration();

    // Reset to single player GM mode immediately
    setGMMode(true);
    setMultiplayerState(false, null, null);
    sessionStorage.removeItem('enteringMultiplayer');

    // Perform cleanup operations in background (non-blocking)
    try {
      // End character session to save all changes (async, non-blocking)
      const activeCharacter = getActiveCharacter();
      if (activeCharacter) {
        // Don't await - let it complete in background
        endCharacterSession(activeCharacter.id).then((sessionEnded) => {
          if (!sessionEnded) {
            console.warn('âš ï¸ Failed to end character session properly');
          }
        }).catch((error) => {
          console.error('Error ending character session:', error);
        });
      }

      // Cleanup game state manager (async, non-blocking)
      gameStateManager.cleanup().catch((error) => {
        console.error('âŒ Error cleaning up game state manager:', error);
      });

      // Disconnect socket after server processes leave_room
      if (socket) {
        socket.emit('leave_room', () => {
          socket.disconnect();
        });
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
      console.log('ðŸš€ [MultiplayerApp] User clicked Continue, starting RPG fade out...');
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
            console.warn('âš ï¸ [MultiplayerApp] Safety timeout triggered during handleJoinRoom. Forcing loading screen closed.');
            setIsJoiningRoom(false);
            setIsFadingOut(false);
          }
        }, 12000); // 12 seconds safety net

        console.log('ðŸ› ï¸ [MultiplayerApp] Executing handleJoinRoom...');

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

        console.log('ðŸ› ï¸ [MultiplayerApp] handleJoinRoom execution completed');
        clearTimeout(safetyExitTimer);
      } catch (error) {
        console.error('âŒ Error handling loading continue:', error);
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
          console.log('âœ¨ [MultiplayerApp] RPG fade out complete');
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
            <GameSurface
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
              pendingControlOffer={pendingControlOffer}
              setPendingControlOffer={setPendingControlOffer}
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
          sessionStorage.setItem('enteringMultiplayer', 'true');
          try {
            const partyState = usePartyStore.getState();
            const currentMembers = partyState.partyMembers || [];
            if (currentMembers.length > 0) {
              console.log('ðŸ§¹ Clearing social party members on join attempt', {
                count: currentMembers.length,
                names: currentMembers.map(m => m.name)
              });
              if (typeof partyState.leaveParty === 'function') {
                partyState.leaveParty();
              } else {
                partyState.clearPartyMembers();
              }
            }
          } catch (e) {
            console.warn('âš ï¸ Failed to clear party members on join attempt:', e);
          }

          isAutoJoinSequenceRef.current = true;
          startJoiningRoom();
        }}
      />
    );
  }

  // Clean VTT interface with integrated multiplayer
  return (
    <RoomProvider>
      <GameSurface
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
        pendingControlOffer={pendingControlOffer}
        setPendingControlOffer={setPendingControlOffer}
      />
    </RoomProvider>
  );
}


export default MultiplayerApp;
