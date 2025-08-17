/**
 * Enhanced Multiplayer React Hook
 * 
 * This hook provides comprehensive multiplayer functionality with:
 * - Real-time synchronization for all game elements
 * - Client-side prediction for immediate feedback
 * - Network quality monitoring and adaptation
 * - Automatic state management and conflict resolution
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import enhancedMultiplayer from '../services/enhancedMultiplayer';

export const useEnhancedMultiplayer = () => {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [networkMetrics, setNetworkMetrics] = useState({
    latency: 50,
    jitter: 5,
    packetLoss: 0
  });

  // Room state
  const [roomData, setRoomData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isGM, setIsGM] = useState(false);

  // Game state with real-time sync
  const [gameState, setGameState] = useState({
    characters: {},
    tokens: {},
    inventory: {},
    combat: {},
    map: {},
    ui: {},
    chat: { messages: [] }
  });

  // Prediction state for immediate feedback
  const [predictedState, setPredictedState] = useState({});
  const [pendingActions, setPendingActions] = useState([]);

  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    updateRate: 60,
    averageLatency: 50,
    predictionsCorrect: 95,
    stateCorrections: 0
  });

  // Refs for stable callbacks
  const gameStateRef = useRef(gameState);
  const predictedStateRef = useRef(predictedState);

  // Update refs when state changes
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    predictedStateRef.current = predictedState;
  }, [predictedState]);

  // Initialize enhanced multiplayer
  useEffect(() => {
    const initializeMultiplayer = async () => {
      try {
        // Setup event handlers
        enhancedMultiplayer.on('connected', handleConnected);
        enhancedMultiplayer.on('disconnected', handleDisconnected);
        enhancedMultiplayer.on('room_created', handleRoomCreated);
        enhancedMultiplayer.on('room_joined', handleRoomJoined);
        enhancedMultiplayer.on('player_joined', handlePlayerJoined);
        enhancedMultiplayer.on('player_left', handlePlayerLeft);
        enhancedMultiplayer.on('state_updated', handleStateUpdated);
        enhancedMultiplayer.on('state_corrected', handleStateCorrection);
        enhancedMultiplayer.on('network_metrics_updated', handleNetworkMetrics);
        enhancedMultiplayer.on('token_moved', handleTokenMoved);
        enhancedMultiplayer.on('character_updated', handleCharacterUpdated);
        enhancedMultiplayer.on('inventory_changed', handleInventoryChanged);
        enhancedMultiplayer.on('combat_updated', handleCombatUpdated);
        enhancedMultiplayer.on('chat_message', handleChatMessage);
        enhancedMultiplayer.on('error', handleError);

        console.log('🚀 Enhanced multiplayer hook initialized');
      } catch (error) {
        console.error('❌ Failed to initialize enhanced multiplayer:', error);
      }
    };

    initializeMultiplayer();

    // Cleanup on unmount
    return () => {
      enhancedMultiplayer.off('connected', handleConnected);
      enhancedMultiplayer.off('disconnected', handleDisconnected);
      enhancedMultiplayer.off('room_created', handleRoomCreated);
      enhancedMultiplayer.off('room_joined', handleRoomJoined);
      enhancedMultiplayer.off('player_joined', handlePlayerJoined);
      enhancedMultiplayer.off('player_left', handlePlayerLeft);
      enhancedMultiplayer.off('state_updated', handleStateUpdated);
      enhancedMultiplayer.off('state_corrected', handleStateCorrection);
      enhancedMultiplayer.off('network_metrics_updated', handleNetworkMetrics);
      enhancedMultiplayer.off('token_moved', handleTokenMoved);
      enhancedMultiplayer.off('character_updated', handleCharacterUpdated);
      enhancedMultiplayer.off('inventory_changed', handleInventoryChanged);
      enhancedMultiplayer.off('combat_updated', handleCombatUpdated);
      enhancedMultiplayer.off('chat_message', handleChatMessage);
      enhancedMultiplayer.off('error', handleError);
    };
  }, []);

  // Event handlers
  const handleConnected = useCallback(() => {
    setIsConnected(true);
    console.log('🔗 Enhanced multiplayer connected');
  }, []);

  const handleDisconnected = useCallback((reason) => {
    setIsConnected(false);
    console.warn('⚠️ Enhanced multiplayer disconnected:', reason);
  }, []);

  const handleRoomCreated = useCallback((data) => {
    setRoomData(data.room);
    setIsGM(true);
    setGameState(data.room.gameState || {});
    console.log('🏠 Room created:', data.room.name);
  }, []);

  const handleRoomJoined = useCallback((data) => {
    setRoomData(data.room);
    setIsGM(data.player.isGM);
    setPlayers(Array.from(data.room.players.values()));
    setGameState(data.room.gameState || {});
    console.log('🚪 Room joined:', data.room.name);
  }, []);

  const handlePlayerJoined = useCallback((data) => {
    setPlayers(prev => [...prev, data.player]);
    console.log('👤 Player joined:', data.player.name);
  }, []);

  const handlePlayerLeft = useCallback((data) => {
    setPlayers(prev => prev.filter(p => p.id !== data.player.id));
    console.log('👋 Player left:', data.player.name);
  }, []);

  const handleStateUpdated = useCallback((deltaUpdate) => {
    // Apply delta update to game state
    setGameState(prev => {
      const updated = applyDeltaUpdate(prev, deltaUpdate);
      return updated;
    });
  }, []);

  const handleStateCorrection = useCallback((correction) => {
    console.log('🔄 Applying state correction');
    setGameState(correction.correctedState);
    setPredictedState({});
    
    // Update performance metrics
    setPerformanceMetrics(prev => ({
      ...prev,
      stateCorrections: prev.stateCorrections + 1
    }));
  }, []);

  const handleNetworkMetrics = useCallback((metrics) => {
    setNetworkMetrics(metrics);
    setConnectionQuality(enhancedMultiplayer.getNetworkQuality());
    
    setPerformanceMetrics(prev => ({
      ...prev,
      averageLatency: metrics.latency,
      updateRate: metrics.updateRate || prev.updateRate
    }));
  }, []);

  const handleTokenMoved = useCallback((data) => {
    // Update token position in game state
    setGameState(prev => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        [data.tokenId]: {
          ...prev.tokens[data.tokenId],
          position: data.position,
          lastMovedBy: data.playerId,
          lastMovedAt: data.serverTimestamp
        }
      }
    }));

    // Clear prediction if this was our movement
    if (data.predicted) {
      setPredictedState(prev => {
        const updated = { ...prev };
        if (updated.tokens && updated.tokens[data.tokenId]) {
          delete updated.tokens[data.tokenId];
        }
        return updated;
      });
    }
  }, []);

  const handleCharacterUpdated = useCallback((data) => {
    setGameState(prev => ({
      ...prev,
      characters: {
        ...prev.characters,
        [data.characterId]: {
          ...prev.characters[data.characterId],
          ...data.updates
        }
      }
    }));
  }, []);

  const handleInventoryChanged = useCallback((data) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [data.playerId]: data.inventory
      }
    }));
  }, []);

  const handleCombatUpdated = useCallback((data) => {
    setGameState(prev => ({
      ...prev,
      combat: {
        ...prev.combat,
        ...data.updates
      }
    }));
  }, []);

  const handleChatMessage = useCallback((data) => {
    setGameState(prev => ({
      ...prev,
      chat: {
        ...prev.chat,
        messages: [...prev.chat.messages, data.message].slice(-100) // Keep last 100 messages
      }
    }));
  }, []);

  const handleError = useCallback((error) => {
    console.error('🚨 Enhanced multiplayer error:', error);
  }, []);

  // Action methods with client-side prediction
  const moveToken = useCallback((tokenId, position, isDragging = false, velocity = null) => {
    // Apply immediate prediction
    setPredictedState(prev => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        [tokenId]: {
          ...prev.tokens[tokenId],
          position: position,
          predictedAt: Date.now()
        }
      }
    }));

    // Add to pending actions
    const actionId = Date.now();
    setPendingActions(prev => [...prev, { id: actionId, type: 'token_move', tokenId }]);

    // Send to server
    enhancedMultiplayer.moveToken(tokenId, position, isDragging, velocity);

    return actionId;
  }, []);

  const updateCharacter = useCallback((characterId, updates) => {
    // Apply immediate prediction
    setPredictedState(prev => ({
      ...prev,
      characters: {
        ...prev.characters,
        [characterId]: {
          ...prev.characters[characterId],
          ...updates,
          predictedAt: Date.now()
        }
      }
    }));

    // Send to server
    enhancedMultiplayer.socket?.emit('character_update', {
      characterId,
      updates
    });
  }, []);

  const updateInventory = useCallback((playerId, inventoryData, changeType = 'full') => {
    // Apply immediate prediction
    setPredictedState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [playerId]: inventoryData
      }
    }));

    // Send to server
    enhancedMultiplayer.socket?.emit('inventory_update', {
      playerId,
      inventoryData,
      changeType
    });
  }, []);

  const updateCombat = useCallback((combatUpdates) => {
    if (!isGM) {
      console.warn('Only GM can update combat state');
      return;
    }

    // Apply immediate prediction
    setPredictedState(prev => ({
      ...prev,
      combat: {
        ...prev.combat,
        ...combatUpdates
      }
    }));

    // Send to server
    enhancedMultiplayer.socket?.emit('combat_update', {
      combatUpdates
    });
  }, [isGM]);

  const sendChatMessage = useCallback((message) => {
    enhancedMultiplayer.sendChatMessage(message);
  }, []);

  // Connection methods
  const connect = useCallback(async (serverUrl) => {
    try {
      await enhancedMultiplayer.connect(serverUrl);
      return true;
    } catch (error) {
      console.error('Failed to connect:', error);
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    enhancedMultiplayer.disconnect();
  }, []);

  const createRoom = useCallback(async (roomData) => {
    try {
      const result = await enhancedMultiplayer.createRoom(roomData);
      return result;
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    }
  }, []);

  const joinRoom = useCallback(async (roomData) => {
    try {
      const result = await enhancedMultiplayer.joinRoom(roomData);
      return result;
    } catch (error) {
      console.error('Failed to join room:', error);
      throw error;
    }
  }, []);

  // Utility functions
  const getCurrentState = useCallback(() => {
    // Merge confirmed state with predictions
    const mergedState = { ...gameStateRef.current };
    const predicted = predictedStateRef.current;

    for (const [category, items] of Object.entries(predicted)) {
      if (!mergedState[category]) {
        mergedState[category] = {};
      }

      for (const [id, item] of Object.entries(items)) {
        mergedState[category][id] = {
          ...mergedState[category][id],
          ...item
        };
      }
    }

    return mergedState;
  }, []);

  const applyDeltaUpdate = useCallback((state, deltaUpdate) => {
    // Simplified delta application - in production, use proper delta algorithm
    return { ...state, ...deltaUpdate.delta };
  }, []);

  return {
    // Connection state
    isConnected,
    connectionQuality,
    networkMetrics,
    performanceMetrics,

    // Room state
    roomData,
    players,
    isGM,

    // Game state
    gameState: getCurrentState(),
    predictedState,
    pendingActions,

    // Actions
    moveToken,
    updateCharacter,
    updateInventory,
    updateCombat,
    sendChatMessage,

    // Connection methods
    connect,
    disconnect,
    createRoom,
    joinRoom,

    // Utilities
    getCurrentState
  };
};
