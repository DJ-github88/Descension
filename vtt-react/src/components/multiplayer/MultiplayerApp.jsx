import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RoomLobby from './RoomLobby';
import EnvironmentDebug from '../debug/EnvironmentDebug';

import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import { showPlayerJoinNotification, showPlayerLeaveNotification } from '../../utils/playerNotifications';
import './styles/MultiplayerApp.css';

// Import main game components
import Grid from "../Grid";
import Navigation from "../Navigation";
import HUDContainer from "../hud/HUDContainer";
import GridItemsManager from "../grid/GridItemsManager";
import GMPlayerToggle from "../level-editor/GMPlayerToggle";
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

  // Get stores for state synchronization
  const { setGMMode, setMultiplayerState, updateTokenPosition } = useGameStore();
  const { updateCharacterInfo, setRoomName, clearRoomName } = useCharacterStore();
  const { addPartyMember, removePartyMember, passLeadership, createParty } = usePartyStore();
  const { addUser, removeUser, addNotification, setMultiplayerIntegration, clearMultiplayerIntegration } = useChatStore();

  // Socket server URL - adjust based on environment
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://descension-production.up.railway.app' // Your Railway URL
      : 'http://localhost:3001');

  console.log('🌐 Multiplayer Environment Check:');
  console.log('🌐 NODE_ENV:', process.env.NODE_ENV);
  console.log('🌐 REACT_APP_SOCKET_URL:', process.env.REACT_APP_SOCKET_URL);
  console.log('🌐 Final SOCKET_URL:', SOCKET_URL);
  console.log('🎮 Current Player:', currentPlayer?.name, 'ID:', currentPlayer?.id);
  console.log('🎮 Is GM:', isGM);
  console.log('🎮 Connected Players:', connectedPlayers.map(p => `${p.name} (${p.id})`));

  // Initialize socket connection when component mounts
  useEffect(() => {
    console.log('Initializing socket connection in MultiplayerApp');
    const newSocket = io(SOCKET_URL, {
      autoConnect: false
    });

    // Basic connection event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected in MultiplayerApp:', newSocket.id);
      setIsConnecting(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected in MultiplayerApp:', reason);
      setIsConnecting(false);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error in MultiplayerApp:', error);
      setIsConnecting(false);
      // Show error notification to user
      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Connection error: ${error.message || 'Unknown error'}`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnecting(false);
      // Show connection error to user
      addNotification('social', {
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
      console.log('MultiplayerApp unmounting - cleaning up socket');
      if (newSocket) {
        newSocket.emit('leave_room');
        newSocket.disconnect();
      }
    };
  }, [SOCKET_URL]);

  useEffect(() => {
    if (!socket) return;

    console.log('Setting up socket event listeners for socket:', socket.id);
    console.log('Socket connected:', socket.connected);

    // Monitor socket connection status
    socket.on('connect', () => {
      console.log('Socket reconnected in MultiplayerApp');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected in MultiplayerApp:', reason);
    });

    // Listen for player join/leave events
    socket.on('player_joined', (data) => {
      console.log('🎮 Player joined event received:', data);
      console.log('🎮 Current room when player joined:', currentRoom?.name);
      console.log('🎮 Current connected players:', connectedPlayers.length);

      // Update connected players list
      if (currentRoom) {
        setConnectedPlayers(prev => {
          // Check if player already exists to avoid duplicates
          const existingPlayer = prev.find(p => p.id === data.player.id);
          if (existingPlayer) {
            console.log('🎮 Player already in list, skipping duplicate:', data.player.name);
            return prev;
          }
          const updated = [...prev, data.player];
          console.log('🎮 Updated connected players:', updated.map(p => p.name));
          return updated;
        });

        // Show player join notification
        console.log('🎮 Showing player join notification for:', data.player.name);
        showPlayerJoinNotification(data.player.name, currentRoom.name);

        // Add to party system
        console.log('🎮 Adding player to party system:', data.player.name);
        addPartyMember({
          id: data.player.id,
          name: data.player.name,
          character: {
            class: 'Unknown',
            level: 1,
            health: { current: 100, max: 100 },
            mana: { current: 50, max: 50 },
            actionPoints: { current: 3, max: 3 }
          }
        });

        // Add to chat system
        console.log('🎮 Adding player to chat system:', data.player.name);
        addUser({
          id: data.player.id,
          name: data.player.name,
          class: 'Unknown',
          level: 1,
          status: 'online'
        });

        // Add chat notification about player joining
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.player.name} joined the room`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      } else {
        console.warn('🎮 Player joined but no current room set');
      }
    });

    socket.on('player_left', (data) => {
      console.log('🚪 Player left event received:', data);
      setConnectedPlayers(prev => {
        const updated = prev.filter(player => player.id !== data.player.id);
        console.log('🚪 Updated connected players after leave:', updated.length);
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
      console.log('Room closed:', data);
      alert(data.message);
      handleLeaveRoom();
    });

    // Listen for chat messages
    socket.on('chat_message', (message) => {
      console.log('Received chat message:', message);
      console.log('Adding to chat system with current room:', currentRoom?.name);
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
      console.log(`🎯 Token ${isDragging ? 'dragging' : 'moved'} by player:`, data.playerName, 'token:', data.tokenId, 'creature:', data.creatureId);

      // Only update if it's not our own movement (to avoid double updates)
      if (data.playerId !== currentPlayer?.id) {
        // Update token position locally using creature ID for compatibility
        const targetId = data.creatureId || data.tokenId;
        console.log(`🎯 Attempting to update token position for: ${targetId}`, 'Position:', data.position);

        try {
          // Try updating via gameStore first
          updateTokenPosition(targetId, data.position);

          // Also try updating via creatureStore for compatibility
          import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
            const { updateTokenPosition: updateCreatureTokenPosition } = useCreatureStore.getState();
            // For creatureStore, we need to find the token by creatureId and update by tokenId
            const { tokens } = useCreatureStore.getState();
            const token = tokens.find(t => t.creatureId === targetId);
            if (token) {
              console.log(`🎯 Also updating via creatureStore for tokenId: ${token.id}`);
              updateCreatureTokenPosition(token.id, data.position);
            }
          });

          console.log(`🎯 ✅ Successfully updated token position for: ${targetId} ${isDragging ? '(live)' : '(final)'}`);
        } catch (error) {
          console.error(`🎯 ❌ Failed to update token position for: ${targetId}`, error);
        }
      } else {
        console.log('🎯 Ignoring own token movement to avoid duplicate update');
      }
    });

    // Listen for item drops from other players
    socket.on('item_dropped', (data) => {
      const isSync = data.isSync;
      console.log(isSync ? '🔄 Syncing grid item:' : '📦 Item dropped by player:', data.playerName, 'item:', data.item.name);

      // Only add item if it's not our own drop (to avoid duplicates) or if it's a sync
      if (data.playerId !== currentPlayer?.id || isSync) {
        // Import the grid item store dynamically to avoid circular dependencies
        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { addItemToGrid } = useGridItemStore.getState();

          // Add the item to the grid without sending back to server (avoid infinite loop)
          console.log('📦 Adding item to grid from server:', data.item.name, 'ID:', data.item.id);
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
      } else {
        console.log('📦 Ignoring own item drop to avoid duplicate');
      }
    });

    // Listen for token creation from other players
    socket.on('token_created', (data) => {
      const isSync = data.isSync;
      console.log(isSync ? '🔄 Syncing token:' : '🎭 Token created by player:', data.playerName, 'creature:', data.creature.name);

      // Only add token if it's not our own creation (to avoid duplicates) or if it's a sync
      if (data.playerId !== currentPlayer?.id || isSync) {
        // Import the creature store dynamically to avoid circular dependencies
        import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
          const { addCreature, addToken } = useCreatureStore.getState();

          // First ensure the creature exists in the store
          addCreature(data.creature);

          // Then add the token without sending back to server (avoid infinite loop)
          console.log('🎭 Adding token to local state:', data.creature.name, 'Token ID:', data.token.id);
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
        }).catch(error => {
          console.error('Failed to import creatureStore:', error);
        });
      } else {
        console.log('🎭 Ignoring own token creation to avoid duplicate');
      }
    });

    // Listen for loot events from other players
    socket.on('item_looted', (data) => {
      console.log('🎁 Item looted by player:', data.playerName, 'item:', data.item.name, 'removed:', data.itemRemoved);

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
      if (data.gridItemId && data.itemRemoved) {
        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { removeItemFromGrid } = useGridItemStore.getState();
          console.log('🎁 Removing looted item from grid:', data.gridItemId);
          removeItemFromGrid(data.gridItemId);
        }).catch(error => {
          console.error('Failed to import gridItemStore for loot removal:', error);
        });
      }
    });

    // Listen for grid item synchronization when joining a room
    socket.on('sync_grid_items', (data) => {
      console.log('📦 Syncing grid items from server:', Object.keys(data.gridItems).length, 'items');

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
      console.log('🎭 Syncing tokens from server:', Object.keys(data.tokens).length, 'tokens');

      import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
        const { addCreature, addToken } = useCreatureStore.getState();

        // Add each token without sending back to server
        Object.values(data.tokens).forEach(tokenData => {
          console.log('🔄 Syncing token:', tokenData.id, 'creature:', tokenData.creatureId);

          // First ensure the creature exists (if we have creature data)
          if (tokenData.creature) {
            addCreature(tokenData.creature);
          }

          // Then add the token with the correct token ID
          addToken(tokenData.creatureId, tokenData.position, false, tokenData.id);
        });
      }).catch(error => {
        console.error('Failed to import creatureStore for sync:', error);
      });
    });

    // Listen for character equipment updates from other players
    socket.on('character_equipment_updated', (data) => {
      console.log('🎽 Received equipment update from server:', data);

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
      console.log('🎨 Player color updated:', data.playerName, 'to', data.color);

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
      console.log('🔄 Received full game state sync:', Object.keys(data));

      // Sync tokens
      if (data.tokens && Object.keys(data.tokens).length > 0) {
        import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
          const { addCreature, addToken } = useCreatureStore.getState();

          Object.values(data.tokens).forEach(tokenData => {
            if (tokenData.creature) {
              addCreature(tokenData.creature);
            }
            addToken(tokenData.creatureId, tokenData.position, false, tokenData.id);
          });
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

      console.log('✅ Full game state sync completed');
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

    // Listen for character token creation from other players
    socket.on('character_token_created', (data) => {
      console.log('🎭 Character token created by player:', data.playerName);

      // Only add if it's not our own token
      if (data.playerId !== currentPlayer?.id) {
        import('../../store/characterTokenStore').then(({ default: useCharacterTokenStore }) => {
          const { addCharacterToken } = useCharacterTokenStore.getState();
          addCharacterToken(data.position, data.playerId);
          console.log('🎭 Added character token for player:', data.playerName);
        });

        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.playerName} placed their character token`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Listen for character movements from other players
    socket.on('character_moved', (data) => {
      const isDragging = data.isDragging;
      console.log(`🚶 Character ${isDragging ? 'dragging' : 'moved'} by player:`, data.playerName);

      // Only update if it's not our own movement (to avoid double updates)
      if (data.playerId !== currentPlayer?.id) {
        // Update character position - you'll need to implement this function
        // updateCharacterPosition(data.position);
        console.log(`🚶 Updated character position ${isDragging ? '(live)' : '(final)'}`);
      } else {
        console.log('🚶 Ignoring own character movement to avoid duplicate update');
      }
    });

    // Handle reconnection
    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');

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
      console.log('Cleaning up socket event listeners');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('player_joined');
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
  }, [socket, currentRoom, addPartyMember, removePartyMember, addUser, removeUser, addNotification]);

  const handleJoinRoom = (room, socketConnection, isGameMaster) => {
    console.log('handleJoinRoom called with:', { room, socketConnection, isGameMaster });
    console.log('Socket connection status:', socketConnection?.connected);
    console.log('Socket ID:', socketConnection?.id);

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

      console.log('Current player data set:', currentPlayerData);
    } catch (error) {
      console.error('Error in handleJoinRoom:', error);
      return; // Exit early if there's an error
    }

    // Update character name to match multiplayer player name and set room name
    if (currentPlayerData?.name) {
      updateCharacterInfo('name', currentPlayerData.name);
    }

    // Set room name for character name formatting
    if (room?.name) {
      setRoomName(room.name);
    }

    // Update game store GM mode
    setGMMode(isGameMaster);

    // Create/update party with multiplayer players
    // Include GM and all regular players
    const allPlayers = [room.gm];
    if (room.players && room.players.size > 0) {
      allPlayers.push(...Array.from(room.players.values()));
    }
    console.log('🎮 Setting connected players:', allPlayers.map(p => `${p.name} (${p.id})`));
    console.log('🎮 Total player count:', allPlayers.length);
    setConnectedPlayers(allPlayers);

    // Integrate multiplayer players into party system
    // GM should always be the leader, regardless of who the current player is
    const gmName = room.gm.name;
    createParty(room.name, gmName);

    // Add all players to party and chat
    allPlayers.forEach(player => {
      if (player.id !== currentPlayerData?.id) {
        addPartyMember({
          id: player.id,
          name: player.name,
          character: {
            class: 'Unknown',
            level: 1,
            health: { current: 100, max: 100 },
            mana: { current: 50, max: 50 },
            actionPoints: { current: 3, max: 3 }
          }
        });

        // Add to chat system
        addUser({
          id: player.id,
          name: player.name,
          class: 'Unknown',
          level: 1,
          status: 'online'
        });
      }
    });

    // Ensure GM is always the party leader
    if (room.gm.name !== currentPlayerData?.name) {
      // If current player is not GM, pass leadership to GM
      const gmPlayer = allPlayers.find(p => p.name === room.gm.name);
      if (gmPlayer) {
        passLeadership(gmPlayer.id);
      }
    }

    // Set multiplayer state in game store with socket
    setMultiplayerState(true, room, handleReturnToSinglePlayer, socketConnection);

    // Set up chat integration for multiplayer
    const sendChatMessage = (message) => {
      console.log('Sending chat message:', message);
      console.log('Socket connected:', socketConnection?.connected);
      console.log('Socket ID:', socketConnection?.id);
      console.log('Current room:', currentRoom?.name);
      console.log('Current player:', currentPlayerData?.name);

      if (socketConnection && socketConnection.connected) {
        socketConnection.emit('chat_message', {
          message: message,
          type: 'chat'
        });
        console.log('Chat message emitted successfully');
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

    console.log('Joined room:', room.name, 'as', isGameMaster ? 'GM' : 'Player');
    console.log('Character name set to:', currentPlayerData?.name);
    console.log('Final socket status after setup:', socketConnection?.connected);
  };

  const handleLeaveRoom = () => {
    console.log('handleLeaveRoom called');

    try {
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

    // Clear room name from character
    clearRoomName();

    setCurrentRoom(null);
    setSocket(null);
    setCurrentPlayer(null);
    setIsGM(false);
    setConnectedPlayers([]);

    // Reset GM mode and clear multiplayer state
    setGMMode(true); // Default back to GM mode for single player
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
      {/* Environment Debug - only show in development or when needed */}
      {(process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true')) && (
        <EnvironmentDebug />
      )}

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
        <Navigation />
        <GMPlayerToggle />
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
          <span className="player-count">{connectedPlayers.length} players</span>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerApp;
