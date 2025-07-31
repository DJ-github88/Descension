import React, { useState, useEffect } from 'react';
import RoomLobby from './RoomLobby';
import ChatWindow from './ChatWindow';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import usePartyStore from '../../store/partyStore';
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
  const [showChat, setShowChat] = useState(true);

  // Get stores for state synchronization
  const { setIsGMMode } = useGameStore();
  const { setName } = useCharacterStore();
  const { addPartyMember, removePartyMember, passLeadership, createParty } = usePartyStore();

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
      }
    });

    socket.on('player_left', (data) => {
      console.log('Player left:', data);
      setConnectedPlayers(prev =>
        prev.filter(player => player.id !== data.player.id)
      );

      // Remove from party system
      removePartyMember(data.player.id);
    });

    socket.on('room_closed', (data) => {
      console.log('Room closed:', data);
      alert(data.message);
      handleLeaveRoom();
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('room_closed');
    };
  }, [socket, currentRoom]);

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

    // Update character name to match multiplayer player name
    if (currentPlayerData?.name) {
      setName(currentPlayerData.name);
    }

    // Update game store GM mode
    setIsGMMode(isGameMaster);

    // Create/update party with multiplayer players
    const allPlayers = [room.gm, ...Array.from(room.players.values())];
    setConnectedPlayers(allPlayers);

    // Integrate multiplayer players into party system
    createParty(room.name, currentPlayerData?.name || 'Player');

    // Add other players to party (excluding current player)
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
      }
    });

    // Set GM leadership if current player is GM
    if (isGameMaster) {
      // Leadership is already set in createParty for current player
    }

    console.log('Joined room:', room.name, 'as', isGameMaster ? 'GM' : 'Player');
    console.log('Character name set to:', currentPlayerData?.name);
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
    }
    
    setCurrentRoom(null);
    setSocket(null);
    setCurrentPlayer(null);
    setIsGM(false);
    setConnectedPlayers([]);
    
    // Reset GM mode
    setIsGMMode(true); // Default back to GM mode for single player
  };

  const handleReturnToSinglePlayer = () => {
    handleLeaveRoom();
    onReturnToSinglePlayer();
  };

  // If not in a room, show the lobby
  if (!currentRoom) {
    return <RoomLobby onJoinRoom={handleJoinRoom} />;
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

      {/* Chat Window - positioned as overlay */}
      {showChat && (
        <div className="multiplayer-chat-overlay">
          <ChatWindow
            socket={socket}
            room={currentRoom}
            currentPlayer={currentPlayer}
          />
        </div>
      )}

      {/* Minimal multiplayer controls */}
      <div className="multiplayer-controls">
        <button
          className="chat-toggle-btn"
          onClick={() => setShowChat(!showChat)}
          title={showChat ? 'Hide Chat' : 'Show Chat'}
        >
          💬
        </button>
        <button
          className="leave-room-btn"
          onClick={handleLeaveRoom}
          title="Leave Room"
        >
          🚪
        </button>
      </div>
    </div>
  );
};

export default MultiplayerApp;
