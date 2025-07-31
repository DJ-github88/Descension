import React, { useState, useEffect } from 'react';
import RoomLobby from './RoomLobby';

import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
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

  // Get stores for state synchronization
  const { setIsGMMode, setMultiplayerState } = useGameStore();
  const { updateCharacterInfo, setRoomName, clearRoomName } = useCharacterStore();
  const { addPartyMember, removePartyMember, passLeadership, createParty } = usePartyStore();
  const { addUser, removeUser, addNotification, setMultiplayerIntegration, clearMultiplayerIntegration } = useChatStore();

  useEffect(() => {
    if (!socket) return;

    // Listen for player join/leave events
    socket.on('player_joined', (data) => {
      console.log('Player joined:', data);
      // Update connected players list
      if (currentRoom) {
        setConnectedPlayers(prev => [...prev, data.player]);

        // Add to party system
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
        addUser({
          id: data.player.id,
          name: data.player.name,
          class: 'Unknown',
          level: 1,
          status: 'online'
        });
      }
    });

    socket.on('player_left', (data) => {
      console.log('Player left:', data);
      setConnectedPlayers(prev =>
        prev.filter(player => player.id !== data.player.id)
      );

      // Remove from party system
      removePartyMember(data.player.id);

      // Remove from chat system
      removeUser(data.player.id);
    });

    socket.on('room_closed', (data) => {
      console.log('Room closed:', data);
      alert(data.message);
      handleLeaveRoom();
    });

    // Listen for chat messages
    socket.on('chat_message', (message) => {
      // Add to chat system
      addNotification('social', {
        sender: {
          name: message.playerName,
          class: message.isGM ? 'GM' : 'Player',
          level: 1
        },
        content: message.content,
        type: 'message'
      });
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('room_closed');
      socket.off('chat_message');
    };
  }, [socket, currentRoom, addPartyMember, removePartyMember, addUser, removeUser, addNotification]);

  const handleJoinRoom = (room, socketConnection, isGameMaster) => {
    setCurrentRoom(room);
    setSocket(socketConnection);
    setIsGM(isGameMaster);

    // Set current player info
    let currentPlayerData;
    if (isGameMaster) {
      currentPlayerData = room.gm;
      setCurrentPlayer(room.gm);
    } else {
      // Find the current player in the room's players
      const players = Array.from(room.players.values());
      currentPlayerData = players[players.length - 1]; // Last joined player
      setCurrentPlayer(currentPlayerData);
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
    setIsGMMode(isGameMaster);

    // Create/update party with multiplayer players
    const allPlayers = [room.gm, ...Array.from(room.players.values())];
    setConnectedPlayers(allPlayers);

    // Integrate multiplayer players into party system
    createParty(room.name, currentPlayerData?.name || 'Player');

    // Add other players to party and chat (excluding current player)
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

    // Set GM leadership if current player is GM
    if (isGameMaster) {
      // Leadership is already set in createParty for current player
    }

    // Set multiplayer state in game store
    setMultiplayerState(true, room, handleReturnToSinglePlayer);

    // Set up chat integration for multiplayer
    const sendChatMessage = (message) => {
      if (socketConnection) {
        socketConnection.emit('chat_message', {
          message: message,
          type: 'chat'
        });
      }
    };
    setMultiplayerIntegration(socketConnection, sendChatMessage);

    console.log('Joined room:', room.name, 'as', isGameMaster ? 'GM' : 'Player');
    console.log('Character name set to:', currentPlayerData?.name);
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
    }

    // Clear multiplayer players from chat system
    connectedPlayers.forEach(player => {
      removeUser(player.id);
    });

    // Clear chat multiplayer integration
    clearMultiplayerIntegration();

    // Clear room name from character
    clearRoomName();

    setCurrentRoom(null);
    setSocket(null);
    setCurrentPlayer(null);
    setIsGM(false);
    setConnectedPlayers([]);

    // Reset GM mode and clear multiplayer state
    setIsGMMode(true); // Default back to GM mode for single player
    setMultiplayerState(false, null, null);
  };

  const handleReturnToSinglePlayer = () => {
    handleLeaveRoom();
    onReturnToSinglePlayer();
  };

  // If not in a room, show the lobby
  if (!currentRoom) {
    return <RoomLobby onJoinRoom={handleJoinRoom} onReturnToLanding={onReturnToSinglePlayer} />;
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
