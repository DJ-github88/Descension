import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { auth } from '../../config/firebase';
import { getUserRooms, createPersistentRoom } from '../../services/roomService';
import './styles/RoomLobby.css';

const RoomLobby = ({ socket, onJoinRoom, onReturnToLanding }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('join'); // 'join', 'create', or 'my-rooms'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use ref to store the callback to avoid recreating socket
  const onJoinRoomRef = useRef(onJoinRoom);
  useEffect(() => {
    onJoinRoomRef.current = onJoinRoom;
  }, [onJoinRoom]);

  // Socket server URL for room fetching
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://descension-production.up.railway.app' // Your Railway URL
      : 'http://localhost:3001');

  useEffect(() => {
    // Check authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        setPlayerName(user.displayName || user.email?.split('@')[0] || 'Player');
        loadUserRooms();
      } else {
        setUserRooms([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Set up socket event listeners when socket is available
  useEffect(() => {
    if (!socket) return;

    console.log('Setting up RoomLobby socket event listeners');

    // Socket event listeners
    const handleConnect = () => {
      console.log('Connected to server in RoomLobby');
      setIsConnecting(false);
      fetchAvailableRooms();
    };

    const handleDisconnect = () => {
      console.log('Disconnected from server in RoomLobby');
    };

    const handleRoomCreated = (data) => {
      console.log('Room created successfully:', data);
      setIsConnecting(false);

      // Store the room password for auto-join
      const createdRoomPassword = roomPassword;

      // Clear form
      setRoomName('');
      setRoomDescription('');
      setRoomPassword('');

      // Automatically join the room as GM
      setTimeout(() => {
        const joinData = {
          roomId: data.room.id,
          playerName: playerName.trim(),
          password: createdRoomPassword.trim()
        };

        console.log('Auto-joining created room:', joinData);
        console.log('Socket connected:', socket.connected);
        console.log('Socket ID:', socket.id);
        socket.emit('join_room', joinData);
      }, 100); // Small delay to ensure room is fully created
    };

    const handleRoomJoined = (data) => {
      console.log('Room joined successfully:', data);
      console.log('Player name:', playerName.trim());
      console.log('Room GM name:', data.room.gm?.name);
      console.log('Is GM reconnect:', data.isGMReconnect);
      setIsConnecting(false);

      // Check if this is a GM reconnect or if the player name matches the GM name
      const isGM = data.isGMReconnect || (data.room.gm && data.room.gm.name === playerName.trim());
      console.log('Determined isGM:', isGM);

      console.log('Calling onJoinRoom with:', { room: data.room, socket: socket, isGM });
      onJoinRoomRef.current(data.room, socket, isGM);
    };

    const handleError = (data) => {
      console.error('Socket error:', data);
      setError(data.message || 'An unknown error occurred');
      setIsConnecting(false);
    };

    const handleConnectError = (error) => {
      console.error('Socket connection error:', error);
      setError('Failed to connect to server. Please check your connection and try again.');
      setIsConnecting(false);
    };

    const handleRoomListUpdated = (rooms) => {
      console.log('Room list updated:', rooms);
      setAvailableRooms(rooms);
    };

    // Add event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('room_created', handleRoomCreated);
    socket.on('room_joined', handleRoomJoined);
    socket.on('error', handleError);
    socket.on('connect_error', handleConnectError);
    socket.on('room_list_updated', handleRoomListUpdated);

    // Fetch rooms if already connected
    if (socket.connected) {
      fetchAvailableRooms();
    }

    return () => {
      console.log('Cleaning up RoomLobby socket event listeners');
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('room_created', handleRoomCreated);
      socket.off('room_joined', handleRoomJoined);
      socket.off('error', handleError);
      socket.off('connect_error', handleConnectError);
      socket.off('room_list_updated', handleRoomListUpdated);
    };
  }, [socket, playerName, roomPassword]); // Dependencies for the event handlers

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch(`${SOCKET_URL}/rooms`);
      const rooms = await response.json();
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const loadUserRooms = async () => {
    if (!auth.currentUser) return;

    try {
      const rooms = await getUserRooms(auth.currentUser.uid);
      setUserRooms(rooms);
    } catch (error) {
      console.error('Failed to load user rooms:', error);
    }
  };

  const handleCreatePersistentRoom = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to create persistent rooms');
      return;
    }

    if (!roomName.trim()) {
      setError('Please enter a room name');
      return;
    }

    if (!roomPassword.trim()) {
      setError('Please enter a password for your room');
      return;
    }

    if (!socket || !socket.connected) {
      setError('Not connected to server');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Try to create persistent room in Firebase first
      let persistentRoomId = null;
      try {
        persistentRoomId = await createPersistentRoom({
          name: roomName.trim(),
          description: roomDescription.trim(),
          password: roomPassword.trim(),
          gmName: playerName.trim(),
          maxPlayers: 6
        });
        console.log('Persistent room created:', persistentRoomId);
      } catch (firebaseError) {
        console.warn('Firebase room creation failed, creating socket room only:', firebaseError);
        // Continue with socket room creation even if Firebase fails
      }

      // Create socket server room for immediate multiplayer
      const roomData = {
        roomName: roomName.trim(),
        gmName: playerName.trim(),
        password: roomPassword.trim(),
        persistentRoomId: persistentRoomId // Include Firebase room ID if available
      };

      console.log('Creating socket room with data:', roomData);
      socket.emit('create_room', roomData);

      // Try to refresh user rooms if Firebase is available
      try {
        await loadUserRooms();
      } catch (error) {
        console.warn('Failed to refresh user rooms:', error);
      }

      // Note: The socket will handle the response via 'room_created' event
      // which will call onJoinRoom and clear the form

    } catch (error) {
      console.error('Failed to create room:', error);
      setError('Failed to create room: ' + error.message);
      setIsConnecting(false);
    }
  };

  const handleJoinPersistentRoom = (room) => {
    if (!socket) {
      setError('Not connected to server');
      return;
    }

    setIsConnecting(true);
    setError('');

    // For persistent rooms, we need to connect to the live session
    // The room password is already known since the user is a member
    const joinData = {
      roomId: room.id,
      playerName: playerName.trim(),
      password: room.password || '' // This should be handled securely
    };

    console.log('Joining persistent room:', joinData);
    socket.emit('join_room', joinData);
  };

  const handleCreateRoom = () => {
    if (!playerName.trim() || !roomName.trim()) {
      setError('Please enter both your name and a room name');
      return;
    }

    if (!roomPassword.trim()) {
      setError('Please enter a password for your room');
      return;
    }

    if (!socket) {
      setError('Not connected to server');
      return;
    }

    if (!socket.connected) {
      setError('Socket not connected to server');
      return;
    }

    setIsConnecting(true);
    setError('');

    const roomData = {
      roomName: roomName.trim(),
      gmName: playerName.trim(),
      password: roomPassword.trim()
    };

    console.log('Creating room with data:', roomData);
    socket.emit('create_room', roomData);
  };

  const handleJoinRoom = (targetRoomId = null, targetPassword = null) => {
    const finalRoomId = targetRoomId || roomId;
    const finalPassword = targetPassword || joinPassword;

    if (!playerName.trim() || !finalRoomId.trim()) {
      setError('Please enter your name and a room ID');
      return;
    }

    if (!finalPassword.trim()) {
      setError('Please enter the room password');
      return;
    }

    if (!socket) {
      setError('Not connected to server');
      return;
    }

    setIsConnecting(true);
    setError('');

    const joinData = {
      roomId: finalRoomId.trim(),
      playerName: playerName.trim(),
      password: finalPassword.trim()
    };

    console.log('Joining room with data:', joinData);
    socket.emit('join_room', joinData);
  };

  const handleQuickJoin = (room) => {
    // For quick join, we need to prompt for password
    const password = prompt(`Enter password for room "${room.name}":`);
    if (password !== null) {
      setRoomId(room.id);
      setJoinPassword(password);
      handleJoinRoom(room.id, password);
    }
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
            <i className="fas fa-times"></i>
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
          {isAuthenticated && (
            <button
              className={`tab-button ${activeTab === 'my-rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-rooms')}
            >
              My Rooms
            </button>
          )}
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
              </div>

              <label htmlFor="joinPassword">Room Password:</label>
              <div className="room-input-group">
                <input
                  id="joinPassword"
                  type="password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="Enter room password"
                  disabled={isConnecting}
                />
                <button
                  onClick={() => handleJoinRoom()}
                  disabled={isConnecting || !playerName.trim() || !roomId.trim() || !joinPassword.trim()}
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
                        <p>GM: {room.gm} {room.gmOnline === false ? '(Offline)' : '(Online)'}</p>
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

            <label htmlFor="roomDescription">Description (Optional):</label>
            <textarea
              id="roomDescription"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              placeholder="Describe your campaign or session"
              disabled={isConnecting}
              maxLength={200}
              rows={3}
            />

            <label htmlFor="roomPassword">Room Password:</label>
            <input
              id="roomPassword"
              type="password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              placeholder="Enter a password for your room"
              disabled={isConnecting}
              maxLength={50}
            />

            <div className="create-buttons">
              <button
                onClick={handleCreateRoom}
                disabled={isConnecting || !playerName.trim() || !roomName.trim() || !roomPassword.trim()}
                className="create-button"
              >
                {isConnecting ? 'Creating...' : 'Create Temporary Room'}
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleCreatePersistentRoom}
                  disabled={isConnecting || !roomName.trim() || !roomPassword.trim()}
                  className="create-button persistent"
                >
                  {isConnecting ? 'Creating...' : 'Create Persistent Room'}
                </button>
              )}
            </div>

            <div className="gm-info">
              <p><strong>Note:</strong> You will be the Game Master (GM) of this room.</p>
              <p>As GM, you have full control over the game state and can manage players.</p>
              <p><strong>Password Required:</strong> All players must enter the password to join.</p>
              {!isAuthenticated && (
                <p><strong>Tip:</strong> Sign in to create persistent rooms that save your progress!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'my-rooms' && isAuthenticated && (
          <div className="my-rooms-section">
            <h3>My Rooms</h3>
            {userRooms.length === 0 ? (
              <p className="no-rooms">You haven't created any rooms yet.</p>
            ) : (
              <div className="rooms-list">
                {userRooms.map(room => (
                  <div key={room.id} className="room-card persistent">
                    <div className="room-info">
                      <h4>{room.name}</h4>
                      {room.description && <p className="room-description">{room.description}</p>}
                      <p>Role: {room.userRole === 'gm' ? 'Game Master' : 'Player'}</p>
                      <p>Members: {room.members?.length || 0}/{(room.settings?.maxPlayers || 6) + 1}</p>
                      <p className="room-age">
                        Last Activity: {room.lastActivity ? new Date(room.lastActivity.seconds * 1000).toLocaleString() : 'Unknown'}
                      </p>
                      {room.isActive && <span className="active-indicator">🟢 Active</span>}
                    </div>
                    <div className="room-actions">
                      <button
                        onClick={() => handleJoinPersistentRoom(room)}
                        disabled={isConnecting}
                        className="join-button"
                      >
                        {room.userRole === 'gm' ? 'Resume as GM' : 'Join'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomLobby;
