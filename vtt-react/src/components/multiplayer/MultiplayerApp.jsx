import React, { useState, useEffect } from 'react';
import RoomLobby from './RoomLobby';
import ChatWindow from './ChatWindow';
import useGameStore from '../../store/gameStore';
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

  // Get game store for potential state synchronization
  const { setIsGMMode } = useGameStore();

  useEffect(() => {
    if (!socket) return;

    // Listen for player join/leave events
    socket.on('player_joined', (data) => {
      console.log('Player joined:', data);
      // Update connected players list
      if (currentRoom) {
        setConnectedPlayers(prev => [...prev, data.player]);
      }
    });

    socket.on('player_left', (data) => {
      console.log('Player left:', data);
      setConnectedPlayers(prev => 
        prev.filter(player => player.id !== data.player.id)
      );
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
    if (isGameMaster) {
      setCurrentPlayer(room.gm);
    } else {
      // Find the current player in the room's players
      const players = Array.from(room.players.values());
      const currentPlayerData = players[players.length - 1]; // Last joined player
      setCurrentPlayer(currentPlayerData);
    }

    // Update game store GM mode
    setIsGMMode(isGameMaster);

    // Initialize connected players list
    const allPlayers = [room.gm, ...Array.from(room.players.values())];
    setConnectedPlayers(allPlayers);

    console.log('Joined room:', room.name, 'as', isGameMaster ? 'GM' : 'Player');
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

  // If in a room, show the game interface with chat
  return (
    <div className="multiplayer-app">
      {/* Room Header */}
      <div className="room-header">
        <div className="room-info">
          <h2>{currentRoom.name}</h2>
          <span className="player-role">
            {isGM ? '👑 Game Master' : '🎲 Player'}
          </span>
        </div>
        
        <div className="room-controls">
          <button 
            className="toggle-chat-button"
            onClick={() => setShowChat(!showChat)}
          >
            {showChat ? 'Hide Chat' : 'Show Chat'}
          </button>
          
          <button 
            className="leave-room-button"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </button>
          
          <button 
            className="single-player-button"
            onClick={handleReturnToSinglePlayer}
          >
            Single Player Mode
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="game-area">
        {/* Connected Players Sidebar */}
        <div className="players-sidebar">
          <h3>Connected Players</h3>
          <div className="players-list">
            {connectedPlayers.map(player => (
              <div key={player.id} className={`player-item ${player.id === currentPlayer?.id ? 'current-player' : ''}`}>
                <span className="player-name">
                  {player.isGM && '👑 '}
                  {player.name}
                  {player.id === currentPlayer?.id && ' (You)'}
                </span>
                <span className="player-status online">●</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game Content Area - Full VTT Interface */}
        <div className="game-content">
          <div className="multiplayer-game-screen">
            <Grid />
            <GridItemsManager />
            <HUDContainer />
            <ActionBar />
            <CombatSelectionWindow />
            <FloatingCombatTextManager />
            <DynamicFogManager />
            <DynamicLightingManager />
            <AtmosphericEffectsManager />

            {/* Navigation overlay for multiplayer */}
            <div className="multiplayer-navigation">
              <Navigation />
              <GMPlayerToggle />
            </div>
          </div>
        </div>

        {/* Chat Window */}
        {showChat && (
          <div className="chat-sidebar">
            <ChatWindow 
              socket={socket}
              room={currentRoom}
              currentPlayer={currentPlayer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerApp;
