import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RoomLobby from './RoomLobby';

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
          const updated = [...prev, data.player];
          console.log('🎮 Updated connected players:', updated.length);
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
      // Add to chat system
      addNotification('social', {
        sender: {
          name: message.playerName,
          class: message.isGM ? 'GM' : 'Player',
          level: 1
        },
        content: message.content,
        type: 'message',
        timestamp: message.timestamp
      });
    });

    // Listen for token movements from other players
    socket.on('token_moved', (data) => {
      console.log('🎯 Token moved by another player:', data.playerName, 'token:', data.tokenId);
      // Update token position locally (this should be smooth since it's only on drag end)
      updateTokenPosition(data.tokenId, data.position);
    });

    // Listen for item drops from other players
    socket.on('item_dropped', (data) => {
      console.log('Item dropped by another player:', data);
      // TODO: Add item to grid at specified position
      // This would integrate with the grid items system
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
    const allPlayers = [room.gm, ...Array.from(room.players.values())];
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
          <span className="player-count">{connectedPlayers.length + 1} players</span>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerApp;
