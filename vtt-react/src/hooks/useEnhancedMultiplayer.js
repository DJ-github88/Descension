/**
 * Enhanced Multiplayer Hook
 * Provides state management and action dispatching for multiplayer functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import useGameStore from '../store/gameStore';
import useCharacterStore from '../store/characterStore';
import useChatStore from '../store/chatStore';

export const useEnhancedMultiplayer = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [networkMetrics, setNetworkMetrics] = useState({
    latency: 0,
    bandwidth: 0,
    packetLoss: 0
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    updateRate: 30
  });

  // Get stores
  const { isInMultiplayer, multiplayerSocket } = useGameStore();
  const { getActiveCharacter } = useCharacterStore();
  const { addNotification } = useChatStore();

  // Socket reference
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (multiplayerSocket) {
      socketRef.current = multiplayerSocket;
      setIsConnected(multiplayerSocket.connected);
      
      // Set up connection listeners
      multiplayerSocket.on('connect', () => {
        setIsConnected(true);
        setIsConnecting(false);
      });

      multiplayerSocket.on('disconnect', () => {
        setIsConnected(false);
        setIsConnecting(false);
      });

      multiplayerSocket.on('connect_error', () => {
        setIsConnected(false);
        setIsConnecting(false);
      });
    }
  }, [multiplayerSocket]);

  // Move token function
  const moveToken = useCallback((tokenId, position, isDragging = false, velocity = null) => {
    if (!socketRef.current || !isConnected) return null;

    const actionId = `move_${tokenId}_${Date.now()}`;
    
    // Emit token movement
    socketRef.current.emit('token_moved', {
      tokenId,
      position,
      isDragging,
      velocity,
      actionId
    });

    return actionId;
  }, [isConnected]);

  // Update character function
  const updateCharacter = useCallback((characterId, updates) => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.emit('character_update', {
      characterId,
      updates,
      timestamp: Date.now()
    });
  }, [isConnected]);

  // Update inventory function
  const updateInventory = useCallback((inventoryData) => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.emit('inventory_update', {
      inventoryData,
      timestamp: Date.now()
    });
  }, [isConnected]);

  // Send chat message function
  const sendChatMessage = useCallback((message) => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.emit('chat_message', {
      message,
      type: 'chat',
      timestamp: Date.now()
    });
  }, [isConnected]);

  // Game state (simplified)
  const gameState = {
    isInMultiplayer,
    isConnected,
    connectionQuality,
    activeCharacter: getActiveCharacter()
  };

  return {
    // Connection state
    isConnecting,
    setIsConnecting,
    isConnected,
    connectionQuality,
    
    // Metrics
    networkMetrics,
    performanceMetrics,
    
    // Game state
    gameState,
    
    // Actions
    moveToken,
    updateCharacter,
    updateInventory,
    sendChatMessage
  };
};

export default useEnhancedMultiplayer;
