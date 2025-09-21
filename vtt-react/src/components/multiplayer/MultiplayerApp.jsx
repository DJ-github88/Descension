import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import io from 'socket.io-client';
import RoomLobby from './RoomLobby';
import LocalhostMultiplayerSimulator from './LocalhostMultiplayerSimulator';
// Removed: Debug utils - not used in production
import gameStateManager from '../../services/gameStateManager';

import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useAuthStore from '../../store/authStore';
import { showPlayerJoinNotification, showPlayerLeaveNotification } from '../../utils/playerNotifications';
import './styles/MultiplayerApp.css';

// Import main game components
import Grid from "../Grid";
import Navigation from "../Navigation";
import HUDContainer from "../hud/HUDContainer";
import GridItemsManager from "../grid/GridItemsManager";

import DynamicFogManager from "../level-editor/DynamicFogManager";
import DynamicLightingManager from "../level-editor/DynamicLightingManager";
import AtmosphericEffectsManager from "../level-editor/AtmosphericEffectsManager";
import ActionBar from "../ui/ActionBar";
import CombatSelectionWindow from "../combat/CombatSelectionOverlay";
import { FloatingCombatTextManager } from "../combat/FloatingCombatText";

const MultiplayerApp = ({ onReturnToSinglePlayer }) => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [isGM, setIsGM] = useState(false);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [actualPlayerCount, setActualPlayerCount] = useState(1); // Track actual player count from server

  // Get stores for state synchronization
  const { setGMMode, setMultiplayerState } = useGameStore();
  const { updateCharacterInfo, setRoomName, getActiveCharacter, loadActiveCharacter, startCharacterSession, endCharacterSession } = useCharacterStore();
  const { addPartyMember, removePartyMember, createParty, updatePartyMember } = usePartyStore();
  const { addUser, removeUser, updateUser, addNotification, setMultiplayerIntegration, clearMultiplayerIntegration } = useChatStore();
  const { updateTokenPosition: updateCreatureTokenPosition, addCreature, addToken } = useCreatureStore();

  // Remove enhanced multiplayer - causes conflicts with main system

  // Smart throttling based on role - optimized for performance
  const tokenUpdateThrottleRef = useRef(new Map());
  const PLAYER_THROTTLE_MS = 50; // 20fps for players (reduced from 60fps to prevent performance issues)
  const GM_THROTTLE_MS = 66; // 15fps for GMs (reduced from 30fps to prevent performance issues)

  const THROTTLE_CLEANUP_INTERVAL = 15000; // Clean up throttle map every 15 seconds
  const THROTTLE_ENTRY_LIFETIME = 30000; // Remove entries older than 30 seconds

  // Removed: Unused drag state tracking

  // Performance optimization: Batch updates to prevent lag spikes
  const updateBatchRef = useRef([]);
  const batchTimeoutRef = useRef(null);

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
        : 'http://localhost:3001');
  }, []); // Empty dependency array since environment variables don't change

  // Environment check logs removed for performance

  // Initialize socket connection when component mounts
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      autoConnect: false
    });

    // Removed enhanced multiplayer system - was causing conflicts

    // Basic connection event listeners
    newSocket.on('connect', () => {
      setIsConnecting(false);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnecting(false);
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
    newSocket.connect();

    return () => {
      if (newSocket) {
        newSocket.emit('leave_room');
        newSocket.disconnect();
      }

      // Performance optimizer removed - was causing conflicts
    };
  }, [SOCKET_URL]);

  useEffect(() => {
    if (!socket) return;

    // Monitor socket connection status
    socket.on('connect', () => {
      // Socket reconnected
    });

    socket.on('disconnect', (reason) => {
      // Socket disconnected
    });

    // Listen for player join/leave events
    socket.on('player_joined', (data) => {
      console.log(`👥 Player joined:`, data.player.name, `Total players: ${data.playerCount}`);

      // Update actual player count from server
      setActualPlayerCount(data.playerCount);

      // Update connected players list - don't require currentRoom to be set yet
      setConnectedPlayers(prev => {
        // Check if player already exists to avoid duplicates
        const existingPlayer = prev.find(p => p.id === data.player.id);
        if (existingPlayer) {
          console.log(`⚠️ Player ${data.player.name} already in list, skipping duplicate`);
          return prev;
        }

        // Don't add current player to connected players list (they're handled separately)
        if (currentPlayer && data.player.id === currentPlayer.id) {
          console.log(`⚠️ Skipping current player ${data.player.name} in connected players list`);
          return prev;
        }

        const updated = [...prev, data.player];
        console.log(`✅ Updated player list:`, updated.map(p => p.name));
        return updated;
      });

      // Show player join notification (only if currentRoom is set)
      if (currentRoom) {
        showPlayerJoinNotification(data.player.name, currentRoom.name);
      }

      // Use character name if available, otherwise fall back to player name
      const playerCharacterName = data.player.character?.name || data.player.name;

        // Add to party system with character data
        const newPartyMember = {
          id: data.player.id,
          name: playerCharacterName,
          isGM: data.player.isGM || false, // Include GM status
          character: {
            class: data.player.character?.class || 'Unknown',
            level: data.player.character?.level || 1,
            health: data.player.character?.health || { current: 100, max: 100 },
            mana: data.player.character?.mana || { current: 50, max: 50 },
            actionPoints: data.player.character?.actionPoints || { current: 3, max: 3 },
            race: data.player.character?.race || 'Unknown',
            raceDisplayName: data.player.character?.raceDisplayName || 'Unknown'
          }
        };

        addPartyMember(newPartyMember);

        // Broadcast party member addition to other players
        if (socket && socket.connected) {
          socket.emit('party_member_added', {
            member: newPartyMember
          });
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
      console.log(`📊 Player count updated: ${data.playerCount} players`);
      // Update the actual player count from server
      setActualPlayerCount(data.playerCount);
    });

    // Listen for party member additions from other clients
    socket.on('party_member_added', (data) => {
      console.log(`🎭 Received party member addition:`, data.member?.name || 'Unknown');

      // Add the party member to our local party store
      if (data.member) {
        addPartyMember(data.member);
      }
    });

    socket.on('player_left', (data) => {
      console.log(`👥 Player left:`, data.player.name, `Total players: ${data.playerCount}`);

      // Update actual player count from server
      setActualPlayerCount(data.playerCount);

      setConnectedPlayers(prev => {
        const updated = prev.filter(player => player.id !== data.player.id);
        console.log(`✅ Updated player list after leave:`, updated.map(p => p.name));
        return updated;
      });

      // Show player leave notification
      showPlayerLeaveNotification(data.player.name, currentRoom?.name || 'Room');

      // Remove from party system
      removePartyMember(data.player.id);

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
      alert(data.message);
      handleLeaveRoom();
    });

    // Handle being kicked/removed from room
    socket.on('player_kicked', (data) => {
      alert(`You have been removed from the room: ${data.reason || 'No reason provided'}`);
      // Redirect to homepage when removed
      window.location.href = '/';
    });

    // Handle room access revoked
    socket.on('access_revoked', (data) => {
      alert(`Your access to this room has been revoked: ${data.reason || 'No reason provided'}`);
      // Redirect to homepage when uninvited
      window.location.href = '/';
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
    });

    // Listen for token movements from other players
    socket.on('token_moved', (data) => {
      const isDragging = data.isDragging;

      const targetId = data.creatureId || data.tokenId;

      // Enhanced check to prevent processing our own movements with improved conflict detection
      const isOwnMovement = data.playerId === currentPlayer?.id ||
                           data.playerId === socket.id ||
                           (window.multiplayerDragState && window.multiplayerDragState.has(`token_${targetId}`));

      // Additional check for recent local movements to prevent race conditions
      const recentMovementKey = `recent_move_${targetId}`;
      const recentMovementTime = window[recentMovementKey];
      const hasRecentLocalMovement = recentMovementTime && (Date.now() - recentMovementTime) < 1000;

      if (isOwnMovement || hasRecentLocalMovement) {
        return;
      }

      // Only update if it's not our own movement (to avoid double updates and feedback loops)
      if (!isOwnMovement) {
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
            targetId,
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
                    const currentTokens = useCreatureStore.getState().tokens;
                    const token = currentTokens.find(t => t.creatureId === update.targetId);
                    if (token) {
                      updateCreatureTokenPosition(token.id, update.position);
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
      }
    });

    // Listen for character movements from other players
    socket.on('character_moved', (data) => {
      // Enhanced check to prevent processing our own movements
      const isOwnMovement = data.playerId === currentPlayer?.id ||
                           data.playerId === socket.id;

      // Don't check multiplayerDragState for character movements as it can cause sync issues
      if (isOwnMovement) {
        console.log(`🚫 Ignoring own character movement from ${data.playerId}`);
        return;
      }

      console.log(`👤 Received character movement from ${data.playerName || data.playerId}:`, data.position, `isDragging: ${data.isDragging}`);

      // Process movement from other players
        // Throttle character token position updates
        const throttleKey = `character_${data.playerId}`;
        const now = Date.now();
        const lastUpdate = tokenUpdateThrottleRef.current.get(throttleKey) || 0;
        const throttleMs = data.isDragging ? 33 : 16;

        if (now - lastUpdate >= throttleMs || !data.isDragging) {
          tokenUpdateThrottleRef.current.set(throttleKey, now);

          // Update character token position
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
      console.log(`🎭 Received character token creation from ${data.playerName}:`, data);

      // Don't process our own token creation
      if (data.playerId === currentPlayer?.id) {
        console.log(`🚫 Ignoring own character token creation`);
        return;
      }

      // Import character token store dynamically to avoid circular dependencies
      import('../../store/characterTokenStore').then(({ default: useCharacterTokenStore }) => {
        const { addCharacterTokenFromServer, addCharacterToken } = useCharacterTokenStore.getState();

        // Add character token directly from server data (bypasses multiplayer sending)
        if (addCharacterTokenFromServer) {
          addCharacterTokenFromServer(data.tokenId, data.position, data.playerId);
          console.log(`✅ Added character token from server for ${data.playerName}`);
        } else {
          // Fallback to regular method but don't send to server
          addCharacterToken(data.position, data.playerId, false); // false = don't send to server
          console.log(`✅ Added character token (fallback) for ${data.playerName}`);
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
      console.log(`🎁 Received item_looted event:`, data);

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

      console.log(`🎁 Should remove item ${data.gridItemId}? ${shouldRemove}`);
      console.log(`🎁 Conditions: gridItemId=${!!data.gridItemId}, itemRemoved=${data.itemRemoved}, isOtherPlayer=${data.playerId !== currentPlayer?.id}, isCurrency=${data.item && data.item.type === 'currency'}`);

      if (shouldRemove) {
        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { removeItemFromGrid, gridItems } = useGridItemStore.getState();

          // Check if item still exists before trying to remove it
          const itemExists = gridItems.find(item => item.id === data.gridItemId);
          console.log(`🎁 Item ${data.gridItemId} exists in grid: ${!!itemExists}`);
          if (itemExists) {
            console.log(`🎁 Removing looted item ${data.gridItemId} from grid (server confirmation)`);
            removeItemFromGrid(data.gridItemId);
          } else {
            console.log(`🎁 Item ${data.gridItemId} not found in grid, already removed`);
          }
        }).catch(error => {
          console.error('Failed to import gridItemStore for loot removal:', error);
        });
      } else {
        console.log(`🎁 Not removing item ${data.gridItemId} - conditions not met`);
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

    // Listen for character updates from other players
    socket.on('character_updated', (data) => {
      // Only process updates from other players (not our own)
      if (data.character?.playerId && data.character.playerId !== currentPlayer?.id) {
        console.log(`📊 Received character update from ${data.character.name}:`, data.character);

        // Update party member with new character data
        const updatedCharacterData = {
          class: data.character.class || 'Unknown',
          level: data.character.level || 1,
          health: data.character.health || { current: 100, max: 100 },
          mana: data.character.mana || { current: 50, max: 50 },
          actionPoints: data.character.actionPoints || { current: 3, max: 3 },
          race: data.character.race || 'Unknown',
          raceDisplayName: data.character.raceDisplayName || 'Unknown',
          exhaustionLevel: data.character.exhaustionLevel || 0,
          classResource: data.character.classResource || { current: 0, max: 0 }
        };

        // Update party member data (use updatePartyMember if exists, otherwise add)
        try {
          updatePartyMember(data.character.playerId, {
            name: data.character.name,
            character: updatedCharacterData
          });
        } catch (error) {
          // Fallback to adding if update fails
          addPartyMember({
            id: data.character.playerId,
            name: data.character.name,
            character: updatedCharacterData
          });
        }

        // Update chat user data
        try {
          updateUser(data.character.playerId, {
            name: data.character.name,
            class: updatedCharacterData.class,
            level: updatedCharacterData.level
          });
        } catch (error) {
          // Fallback to adding if update fails
          addUser({
            id: data.character.playerId,
            name: data.character.name,
            class: updatedCharacterData.class,
            level: updatedCharacterData.level,
            status: 'online'
          });
        }

        // Update connected players list with character data
        setConnectedPlayers(prev => prev.map(player =>
          player.id === data.character.playerId
            ? { ...player, character: updatedCharacterData }
            : player
        ));

        console.log(`✅ Updated character data for ${data.character.name} in all systems`);
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

      // Sync tokens
      if (data.tokens && Object.keys(data.tokens).length > 0) {
        Object.values(data.tokens).forEach(tokenData => {
          if (tokenData.creature) {
            addCreature(tokenData.creature);
          }
          addToken(tokenData.creatureId, tokenData.position, false, tokenData.id);
        });
      }

      // Sync grid items
      if (data.gridItems && Object.keys(data.gridItems).length > 0) {
        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { addItemToGrid } = useGridItemStore.getState();

          Object.values(data.gridItems).forEach(gridItem => {
            addItemToGrid(gridItem, gridItem.position, false);
          });
        });
      }
    });

    // Handle synchronization errors
    socket.on('sync_error', (data) => {
      console.error('❌ Synchronization error:', data);

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

    // Handle reconnection
    socket.on('reconnect', (attemptNumber) => {

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: 'Reconnected to server. Syncing game state...',
        type: 'system',
        timestamp: new Date().toISOString()
      });

      // Request full sync after reconnection
      setTimeout(() => {
        socket.emit('request_full_sync');
      }, 500);
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
      socket.off('character_equipment_updated');
      socket.off('player_color_updated');
      socket.off('character_token_created');
      socket.off('character_moved');
      socket.off('full_game_state_sync');
      socket.off('sync_error');
      socket.off('connect_error');
      socket.off('reconnect');
    };
  }, [socket]); // Reduced dependencies to prevent excessive re-runs

  const handleJoinRoom = async (room, socketConnection, isGameMaster) => {

    let currentPlayerData;

    try {
      setCurrentRoom(room);
      setSocket(socketConnection);
      setIsGM(isGameMaster);

      // Set current player info
      if (isGameMaster) {
        currentPlayerData = room.gm;
        setCurrentPlayer(room.gm);
      } else {
        // Find the current player in the room's players
        const players = Array.from(room.players.values());
        currentPlayerData = players[players.length - 1]; // Last joined player
        setCurrentPlayer(currentPlayerData);
      }

      // Add player to Firebase room members for persistence (if authenticated)
      try {
        // Check if auth store is available (might not be in all environments)
        if (typeof useAuthStore !== 'undefined') {
          const { user } = useAuthStore.getState();
          if (user && room.persistentRoomId) {
            const { joinRoom } = await import('../../services/roomService');
            await joinRoom(room.persistentRoomId, user.uid, room.password || '');
            console.log(`✅ Added player to persistent room ${room.persistentRoomId}`);
          }
        } else {
          console.log('🔄 Auth store not available, skipping Firebase persistence');
        }
      } catch (error) {
        console.warn('Failed to add player to persistent room:', error);
        // Don't fail the room join if Firebase persistence fails
      }
    } catch (error) {
      console.error('Error in handleJoinRoom:', error);
      return; // Exit early if there's an error
    }

    // Load active character data when joining multiplayer room
    try {
      let activeCharacter = getActiveCharacter();

      // If no active character is loaded, try to load from storage
      if (!activeCharacter) {
        console.log('🔄 No active character found, attempting to load from storage...');
        activeCharacter = await loadActiveCharacter();
      }

      // If still no active character, check if any characters exist and suggest activation
      if (!activeCharacter) {
        console.warn('⚠️ No active character found for multiplayer session');

        // Try to get available characters
        const { characters } = useCharacterStore.getState();
        if (characters && characters.length > 0) {
          console.log(`💡 Found ${characters.length} available characters. Please activate one before joining multiplayer.`);
          // Show a user-friendly message with actionable guidance
          const characterNames = characters.map(c => c.name).join(', ');
          setError(`Please select and activate a character before joining multiplayer rooms. Available characters: ${characterNames}. Go to Account > Characters to activate one.`);
          return;
        } else {
          console.log('ℹ️ No characters available. User needs to create a character first.');
          setError('You need to create a character before joining multiplayer rooms. Go to Account > Characters to create your first character.');
          return;
        }
      }

      console.log(`🎮 Loading active character into multiplayer: ${activeCharacter.name}`);

      // Start character session for tracking changes during multiplayer
      try {
        const sessionId = await startCharacterSession(activeCharacter.id, room.id);
        if (sessionId) {
          console.log(`✅ Character session started: ${sessionId}`);
        } else {
          console.warn('⚠️ Character session could not be started, but continuing with multiplayer');
        }
      } catch (sessionError) {
        console.error('❌ Error starting character session:', sessionError);
        console.log('🔄 Continuing with multiplayer without session tracking');
      }

      // Set room name for multiplayer context (this will format the display name)
      setRoomName(room.name);

        // Sync character inventory with inventory store
        try {
          import('../../store/inventoryStore').then(({ default: useInventoryStore }) => {
            const inventoryStore = useInventoryStore.getState();

            // Load character's inventory into the inventory store
            if (activeCharacter.inventory) {
              // Clear current inventory
              inventoryStore.clearInventory();

              // Load character's items
              if (activeCharacter.inventory.items) {
                activeCharacter.inventory.items.forEach(item => {
                  inventoryStore.addItem(item);
                });
              }

              // Load character's currency
              if (activeCharacter.inventory.currency) {
                inventoryStore.updateCurrency(activeCharacter.inventory.currency);
              }

              console.log(`✅ Character inventory synced: ${activeCharacter.inventory.items?.length || 0} items`);
            }
          });
        } catch (inventoryError) {
          console.warn('Failed to sync character inventory:', inventoryError);
        }

        // Send character data to server for synchronization
        if (socketConnection && socketConnection.connected) {
          socketConnection.emit('character_updated', {
            characterId: activeCharacter.id,
            character: {
              name: activeCharacter.name,
              class: activeCharacter.class,
              race: activeCharacter.race,
              subrace: activeCharacter.subrace,
              level: activeCharacter.level,
              stats: activeCharacter.stats,
              health: activeCharacter.health,
              mana: activeCharacter.mana,
              actionPoints: activeCharacter.actionPoints,
              equipment: activeCharacter.equipment,
              inventory: activeCharacter.inventory,
              experience: activeCharacter.experience,
              exhaustionLevel: activeCharacter.exhaustionLevel,
              playerId: currentPlayerData?.id
            }
          });
          console.log('📤 Character data sent to server');
        }
    } catch (error) {
      console.error('Error loading active character for multiplayer:', error);
      // Fall back to updating character name to match player name
      if (currentPlayerData?.name) {
        updateCharacterInfo('name', currentPlayerData.name);
      }
    }

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

    console.log(`🎮 Setting initial player list (excluding current player):`, uniquePlayers.map(p => p.name));
    setConnectedPlayers(uniquePlayers);

    // Set initial player count (GM + regular players)
    const initialPlayerCount = (room.players?.size || 0) + 1; // +1 for GM
    setActualPlayerCount(initialPlayerCount);
    console.log(`📊 Setting initial player count: ${initialPlayerCount}`);

    // Integrate multiplayer players into party system
    // Get active character data for current player
    const activeCharacter = getActiveCharacter();
    const currentPlayerCharacterName = activeCharacter?.name || currentPlayerData?.name || 'Unknown Player';

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
        class: activeCharacter?.class || 'Unknown',
        level: activeCharacter?.level || 1,
        health: activeCharacter?.health || { current: 100, max: 100 },
        mana: activeCharacter?.mana || { current: 50, max: 50 },
        actionPoints: activeCharacter?.actionPoints || { current: 3, max: 3 },
        race: activeCharacter?.race || 'Unknown',
        raceDisplayName: activeCharacter?.raceDisplayName || 'Unknown'
      }
    };

    // Update the existing current player instead of adding a duplicate
    console.log('🎮 Setting up current player with GM status:', {
        isGameMaster,
        currentPlayerMember
    });
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

    // Add other players to party and chat (only non-current players)
    if (room.players && room.players.size > 0) {
      Array.from(room.players.values()).forEach(player => {
        const isCurrentPlayer = player.id === currentPlayerData?.id;

        if (!isCurrentPlayer) {
          const playerCharacterName = player.character?.name || player.name;
          console.log(`👥 Adding other player: ${playerCharacterName}`);

          addPartyMember({
            id: player.id,
            name: playerCharacterName,
            character: {
              class: player.character?.class || 'Unknown',
              level: player.character?.level || 1,
              health: player.character?.health || { current: 100, max: 100 },
              mana: player.character?.mana || { current: 50, max: 50 },
              actionPoints: player.character?.actionPoints || { current: 3, max: 3 }
            }
          });

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
        socketConnection.emit('chat_message', {
          message: message,
          type: 'chat'
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

    // Initialize game state manager for persistent room state
    if (room.persistentRoomId || room.id) {
      // Removed: Unused roomId variable

      // DISABLED: Game state loading causes old tokens to appear in fresh rooms
      // Only enable auto-save for GMs, but don't load old state for fresh rooms
      // gameStateManager.initialize(roomId, isGameMaster).then(() => {
      //   // Game state manager initialized successfully
      // }).catch((error) => {
      //   console.error('❌ Failed to initialize game state manager:', error);
      // });

      console.log('🎮 Skipping game state loading to prevent old tokens in fresh rooms');
    }
  };

  const handleLeaveRoom = async () => {
    try {
      // End character session to save all changes
      const activeCharacter = getActiveCharacter();
      if (activeCharacter) {
        console.log(`🔄 Ending character session for: ${activeCharacter.name}`);
        const sessionEnded = await endCharacterSession(activeCharacter.id);
        if (sessionEnded) {
          console.log(`✅ Character session ended and changes saved`);
        } else {
          console.warn('⚠️ Failed to end character session properly');
        }
      }

      // Cleanup game state manager first (saves final state)
      gameStateManager.cleanup().then(() => {
        // Game state manager cleaned up successfully
      }).catch((error) => {
        console.error('❌ Error cleaning up game state manager:', error);
      });

      if (socket) {
        // Emit leave room event to server before disconnecting
        socket.emit('leave_room');
        // Disconnect the socket
        socket.disconnect();
      }

      // Clear multiplayer players from chat system
      connectedPlayers.forEach(player => {
        removeUser(player.id);
      });

      // Clear chat multiplayer integration
      clearMultiplayerIntegration();
    } catch (error) {
      console.error('Error in handleLeaveRoom:', error);
    }

    // Room name is not set on character, so no need to clear

    setCurrentRoom(null);
    setSocket(null);
    setCurrentPlayer(null);
    setIsGM(false);
    setConnectedPlayers([]);

    // Reset to single player GM mode
    setGMMode(true);
    setMultiplayerState(false, null, null);
  };

  const handleReturnToSinglePlayer = () => {
    handleLeaveRoom();
    onReturnToSinglePlayer();
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
        <FloatingCombatTextManager />
        <DynamicFogManager />
        <DynamicLightingManager />
        <AtmosphericEffectsManager />
        <Navigation onReturnToLanding={handleReturnToSinglePlayer} />

        {/* Performance monitor removed - was causing overhead */}
      </div>

      {/* Multiplayer indicator with back button */}
      <div className="multiplayer-indicator">
        <button
          className="leave-room-btn"
          onClick={handleReturnToSinglePlayer}
          title="Leave room and return to main menu"
        >
          <i className="fas fa-sign-out-alt"></i>
          Leave Room
        </button>
        <div className="room-info">
          <span className="room-name">{currentRoom.name}</span>
          <span className="player-count">{actualPlayerCount} players</span>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerApp;
