import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './styles/RoomLobby.css';

const RoomLobby = ({ onJoinRoom, onReturnToLanding }) => {
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'

  // Socket server URL - adjust based on environment
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://descension-production.up.railway.app' // Your Railway URL
      : 'http://localhost:3001');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      autoConnect: false
    });

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnecting(false);
      fetchAvailableRooms();
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('room_created', (data) => {
      console.log('Room created:', data);
      setIsConnecting(false);
      onJoinRoom(data.room, newSocket, true); // true = isGM
    });

    newSocket.on('room_joined', (data) => {
      console.log('Room joined:', data);
      setIsConnecting(false);
      onJoinRoom(data.room, newSocket, false); // false = not GM
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setError(data.message);
      setIsConnecting(false);
    });

    setSocket(newSocket);

    // Connect to server
    newSocket.connect();

    return () => {
      newSocket.disconnect();
    };
  }, [SOCKET_URL, onJoinRoom]);

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/rooms`);
      const rooms = await response.json();
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const handleCreateRoom = () => {
    if (!playerName.trim() || !roomName.trim()) {
      setError('Please enter both your name and a room name');
      return;
    }

    if (!socket) {
      setError('Not connected to server');
      return;
    }

    setIsConnecting(true);
    setError('');
    
    socket.emit('create_room', {
      roomName: roomName.trim(),
      gmName: playerName.trim()
    });
  };

  const handleJoinRoom = (targetRoomId = null) => {
    const finalRoomId = targetRoomId || roomId;
    
    if (!playerName.trim() || !finalRoomId.trim()) {
      setError('Please enter your name and a room ID');
      return;
    }

    if (!socket) {
      setError('Not connected to server');
      return;
    }

    setIsConnecting(true);
    setError('');
    
    socket.emit('join_room', {
      roomId: finalRoomId.trim(),
      playerName: playerName.trim()
    });
  };

  const handleQuickJoin = (room) => {
    setRoomId(room.id);
    handleJoinRoom(room.id);
  };

  return (
    <div className="room-lobby">
      <div className="lobby-container">
        <div className="lobby-header">
          <button
            className="back-to-landing-btn"
            onClick={onReturnToLanding}
            title="Return to main menu"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Main Menu
          </button>
          <h1>Mythrill D&D</h1>
          <p>Join or create a multiplayer session</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="player-name-section">
          <label htmlFor="playerName">Your Name:</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your display name"
            disabled={isConnecting}
            maxLength={20}
          />
        </div>

        <div className="lobby-tabs">
          <button 
            className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => setActiveTab('join')}
          >
            Join Room
          </button>
          <button 
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Room
          </button>
        </div>

        {activeTab === 'join' && (
          <div className="join-room-section">
            <div className="manual-join">
              <label htmlFor="roomId">Room ID:</label>
              <div className="room-input-group">
                <input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  disabled={isConnecting}
                />
                <button 
                  onClick={() => handleJoinRoom()}
                  disabled={isConnecting || !playerName.trim() || !roomId.trim()}
                  className="join-button"
                >
                  {isConnecting ? 'Joining...' : 'Join'}
                </button>
              </div>
            </div>

            <div className="available-rooms">
              <h3>Available Rooms</h3>
              <button 
                onClick={fetchAvailableRooms}
                className="refresh-button"
                disabled={isConnecting}
              >
                Refresh
              </button>
              
              {availableRooms.length === 0 ? (
                <p className="no-rooms">No public rooms available</p>
              ) : (
                <div className="rooms-list">
                  {availableRooms.map(room => (
                    <div key={room.id} className="room-card">
                      <div className="room-info">
                        <h4>{room.name}</h4>
                        <p>GM: {room.gm}</p>
                        <p>Players: {room.playerCount}/{room.maxPlayers}</p>
                        <p className="room-age">
                          Created: {new Date(room.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleQuickJoin(room)}
                        disabled={isConnecting || !playerName.trim() || room.playerCount >= room.maxPlayers}
                        className="quick-join-button"
                      >
                        {room.playerCount >= room.maxPlayers ? 'Full' : 'Join'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-room-section">
            <label htmlFor="roomName">Room Name:</label>
            <input
              id="roomName"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              disabled={isConnecting}
              maxLength={30}
            />
            
            <button 
              onClick={handleCreateRoom}
              disabled={isConnecting || !playerName.trim() || !roomName.trim()}
              className="create-button"
            >
              {isConnecting ? 'Creating...' : 'Create Room as GM'}
            </button>
            
            <div className="gm-info">
              <p><strong>Note:</strong> You will be the Game Master (GM) of this room.</p>
              <p>As GM, you have full control over the game state and can manage players.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomLobby;
