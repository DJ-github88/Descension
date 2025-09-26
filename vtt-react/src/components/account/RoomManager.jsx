// Room Manager component for account dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRooms, deleteRoom, getRoomLimits } from '../../services/roomService';
import localRoomService from '../../services/localRoomService';
import subscriptionService from '../../services/subscriptionService';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import RoomCard from '../common/RoomCard';
import './styles/RoomManager.css';

const RoomManager = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getActiveCharacter } = useCharacterStore();

  const [rooms, setRooms] = useState([]);
  const [localRooms, setLocalRooms] = useState([]);
  const [roomLimits, setRoomLimits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomStatuses, setRoomStatuses] = useState(new Map());
  const [refreshMessage, setRefreshMessage] = useState('');
  const [showCreateLocalRoom, setShowCreateLocalRoom] = useState(false);
  const [newLocalRoomName, setNewLocalRoomName] = useState('');

  useEffect(() => {
    loadRoomData();
    loadLocalRooms();
  }, [user]);

  // Check for room data changes when component mounts or becomes visible
  useEffect(() => {
    const checkForRoomDataChanges = () => {
      if (user && localStorage.getItem('roomDataChanged') === 'true') {
        console.log('🔄 Room data changed detected, refreshing...');
        localStorage.removeItem('roomDataChanged');
        const lastJoinedRoom = localStorage.getItem('lastJoinedRoom');
        const lastCreatedRoom = localStorage.getItem('lastCreatedRoom');

        if (lastJoinedRoom) {
          console.log(`📍 Last joined room: ${lastJoinedRoom}`);
          localStorage.removeItem('lastJoinedRoom');
          setRefreshMessage(`🎮 Welcome back! Room data refreshed after joining a room.`);
        } else if (lastCreatedRoom) {
          console.log(`📍 Last created room: ${lastCreatedRoom}`);
          localStorage.removeItem('lastCreatedRoom');
          setRefreshMessage(`🎉 Room created successfully! Your new room should appear below.`);
        }

        // Clear message after 5 seconds
        setTimeout(() => setRefreshMessage(''), 5000);

        loadRoomData();
      }
    };

    // Check immediately when component mounts
    checkForRoomDataChanges();

    // Auto-refresh room data when component becomes visible (e.g., returning from multiplayer)
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('🔄 Page became visible, checking for changes...');
        checkForRoomDataChanges();
      }
    };

    const handleFocus = () => {
      if (user) {
        console.log('🔄 Window focused, checking for changes...');
        checkForRoomDataChanges();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  // Function to check if a room is currently live on the server
  const checkRoomStatus = async (roomId) => {
    try {
      // Skip status check for test rooms
      if (roomId === 'test-room-local') {
        return 'test';
      }

      // Check if server is available and room is live
      const serverUrl = process.env.REACT_APP_SOCKET_URL ||
                       (process.env.NODE_ENV === 'production' ?
                        'https://descension-mythrill.up.railway.app' :
                        'http://localhost:3001');

      const response = await fetch(`${serverUrl}/rooms`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (response.ok) {
        const liveRooms = await response.json();
        const isLive = liveRooms.some(room => room.id === roomId);
        return isLive ? 'live' : 'offline';
      } else {
        return 'unknown';
      }
    } catch (error) {
      console.warn(`Failed to check status for room ${roomId}:`, error);
      return 'unknown';
    }
  };

  // Check status for all rooms
  const checkAllRoomStatuses = async () => {
    const statusMap = new Map();

    for (const room of rooms) {
      const status = await checkRoomStatus(room.id);
      statusMap.set(room.id, status);
    }

    setRoomStatuses(statusMap);
  };

  // Check room statuses when rooms change
  useEffect(() => {
    if (rooms.length > 0) {
      checkAllRoomStatuses();
    }
  }, [rooms]);

  // Load local rooms from localStorage
  const loadLocalRooms = () => {
    try {
      const localRoomsList = localRoomService.getLocalRooms();
      setLocalRooms(localRoomsList);
      console.log('📁 Loaded local rooms:', localRoomsList.length);
    } catch (error) {
      console.error('Error loading local rooms:', error);
    }
  };

  // Create a new local room
  const handleCreateLocalRoom = () => {
    if (!newLocalRoomName.trim()) {
      alert('Please enter a room name');
      return;
    }

    const activeCharacter = getActiveCharacter();
    const roomData = {
      name: newLocalRoomName.trim(),
      description: `Local room for ${activeCharacter?.name || 'Unknown Character'}`,
      characterId: activeCharacter?.id,
      characterName: activeCharacter?.name || 'Unknown Character'
    };

    try {
      const newRoom = localRoomService.createLocalRoom(roomData);
      loadLocalRooms(); // Refresh the list
      setNewLocalRoomName('');
      setShowCreateLocalRoom(false);
      setRefreshMessage(`✅ Local room "${newRoom.name}" created`);
      setTimeout(() => setRefreshMessage(''), 3000);
    } catch (error) {
      console.error('Error creating local room:', error);
      alert('Failed to create local room');
    }
  };

  // Join a local room
  const handleJoinLocalRoom = (room) => {
    try {
      // Store local room info for the game to load
      localStorage.setItem('selectedLocalRoomId', room.id);
      localStorage.setItem('isLocalRoom', 'true');
      localStorage.removeItem('selectedRoomId');
      localStorage.removeItem('isTestRoom');

      console.log('🎮 Joining local room:', room.name);
      navigate('/game'); // Navigate directly to game for local rooms
    } catch (error) {
      console.error('Error joining local room:', error);
      alert('Failed to join local room');
    }
  };

  // Delete a local room
  const handleDeleteLocalRoom = (roomId) => {
    if (confirm('Are you sure you want to delete this local room? This action cannot be undone.')) {
      try {
        localRoomService.deleteLocalRoom(roomId);
        loadLocalRooms(); // Refresh the list
        setRefreshMessage('🗑️ Local room deleted');
        setTimeout(() => setRefreshMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting local room:', error);
        alert('Failed to delete local room');
      }
    }
  };

  // Update a local room
  const handleUpdateLocalRoom = (roomId, updates) => {
    console.log('🔄 Updating local room:', roomId, 'with updates:', updates);
    try {
      localRoomService.updateLocalRoom(roomId, updates);
      loadLocalRooms(); // Refresh the list
      console.log('✅ Local room updated successfully');
      setRefreshMessage('✅ Local room updated');
      setTimeout(() => setRefreshMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error updating local room:', error);
      if (error.message && error.message.includes('quota')) {
        alert('Storage quota exceeded. The image is too large. Please try a smaller image.');
      } else {
        alert('Failed to update local room: ' + (error.message || 'Unknown error'));
      }
      throw error; // Re-throw so RoomCard can handle it
    }
  };

  // Update a multiplayer room
  const handleUpdateMultiplayerRoom = async (roomId, updates) => {
    console.log('🔄 Updating multiplayer room:', roomId, 'with updates:', updates);
    try {
      if (!roomId) {
        throw new Error('Room ID is required');
      }

      // Check localStorage space before saving
      const existingData = localStorage.getItem(`room-data-${roomId}`) || '{}';
      const roomData = JSON.parse(existingData);
      const updatedData = { ...roomData, ...updates };
      const dataString = JSON.stringify(updatedData);

      // Estimate size (rough calculation)
      const estimatedSize = new Blob([dataString]).size;
      console.log('💾 Estimated storage size:', (estimatedSize / 1024).toFixed(1), 'KB');

      // Try to save with better error handling
      try {
        localStorage.setItem(`room-data-${roomId}`, dataString);
      } catch (storageError) {
        if (storageError.name === 'QuotaExceededError') {
          throw new Error('Storage quota exceeded. The image is too large. Please try a smaller image.');
        }
        throw storageError;
      }

      // Update the local state
      setRooms(prevRooms =>
        prevRooms.map(room =>
          room.id === roomId ? { ...room, ...updates } : room
        )
      );

      console.log('✅ Multiplayer room updated successfully');
      setRefreshMessage('✅ Room updated');
      setTimeout(() => setRefreshMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error updating multiplayer room:', error);
      throw error; // Re-throw so RoomCard can handle it
    }
  };

  const loadRoomData = async () => {
    if (!user) {
      // Even without user, create a test room for development
      const activeCharacter = getActiveCharacter();
      const testRoom = {
        id: 'test-room-local',
        name: 'Development Test Lab',
        description: 'A sandbox environment for testing game mechanics, character abilities, and multiplayer features. Experiment with spells, items, and combat in a safe testing ground.',
        userRole: 'gm',
        gmName: 'Game Master',
        members: ['dev-user'],
        isTestRoom: true,
        settings: {
          maxPlayers: 8,
          isPrivate: false,
          allowSpectators: true,
          autoSave: true
        },
        lastActivity: {
          seconds: Math.floor(Date.now() / 1000)
        },
        createdAt: {
          seconds: Math.floor(Date.now() / 1000)
        },
        stats: {
          totalSessions: 0,
          lastSession: 'Ready for Testing',
          averageSessionLength: 'Variable'
        },
        isTestRoom: true
      };


      console.log('🧪 Setting test room:', testRoom);
      setRooms([testRoom]);
      setLocalRooms([]); // Keep local rooms empty in development
      setRoomLimits({
        tier: { name: 'Development' },
        used: 1,
        limit: 999,
        canCreate: true
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    // Create test room regardless of Firebase status
    const activeCharacter = getActiveCharacter();
    const testRoom = {
      id: 'test-room-local',
      name: 'Development Test Lab',
      description: 'A sandbox environment for testing game mechanics, character abilities, and multiplayer features. Experiment with spells, items, and combat in a safe testing ground.',
      userRole: 'gm',
      gmName: user?.displayName || 'Game Master',
      members: [user?.uid || 'dev-user'],
      isTestRoom: true,
      settings: {
        maxPlayers: 8,
        isPrivate: false,
        allowSpectators: true,
        autoSave: true
      },
      lastActivity: {
        seconds: Math.floor(Date.now() / 1000)
      },
      createdAt: {
        seconds: Math.floor(Date.now() / 1000)
      },
      stats: {
        totalSessions: 0,
        lastSession: 'Ready for Testing',
        averageSessionLength: 'Variable'
      }
    };

    try {
      const [userRooms, limits] = await Promise.all([
        getUserRooms(user.uid),
        getRoomLimits(user.uid)
      ]);

      // Add test room to the beginning of the list
      const roomsWithTest = [testRoom, ...userRooms];

      setRooms(roomsWithTest);
      setRoomLimits(limits);

      // Show success message
      const roomCount = userRooms.length;
      if (roomCount > 0) {
        setRefreshMessage(`✅ Loaded ${roomCount} room${roomCount === 1 ? '' : 's'}`);
      } else {
        setRefreshMessage('📝 No campaign rooms found');
      }

      // Clear message after 3 seconds
      setTimeout(() => setRefreshMessage(''), 3000);

    } catch (err) {
      console.error('Error loading room data:', err);
      setError('Failed to load room data from Firebase. Showing test room only.');
      setRefreshMessage('❌ Failed to load rooms from Firebase');

      // Even if Firebase fails, keep the existing test room (don't overwrite)
      setRoomLimits({
        tier: { name: 'Development' },
        used: 1,
        limit: 999,
        canCreate: true
      });

      // Clear error message after 5 seconds
      setTimeout(() => setRefreshMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = () => {
    navigate('/multiplayer');
  };

  const handleJoinRoom = (room) => {
    if (room.isTestRoom) {
      // For test room, navigate directly to game with test room setup
      localStorage.setItem('selectedRoomId', room.id);
      localStorage.setItem('selectedRoomPassword', 'test123');
      localStorage.setItem('isTestRoom', 'true');
      navigate('/multiplayer');
    } else {
      // For campaign rooms, prompt for password
      const password = prompt(`Enter password for "${room.name}":`);
      if (password !== null && password.trim()) {
        // Store room selection and navigate to multiplayer
        localStorage.setItem('selectedRoomId', room.id);
        localStorage.setItem('selectedRoomPassword', password.trim());
        localStorage.removeItem('isTestRoom');
        navigate('/multiplayer');
      } else if (password !== null) {
        // User entered empty password
        alert('Password cannot be empty');
      }
      // If password is null, user cancelled - do nothing
    }
  };

  const handleDeleteRoom = async (room) => {
    setSelectedRoom(room);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRoom = async () => {
    if (!selectedRoom) return;

    try {
      await deleteRoom(selectedRoom.id, user.uid);
      await loadRoomData(); // Refresh the list
      setShowDeleteConfirm(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error('Error deleting room:', err);
      setError('Failed to delete room. Please try again.');
    }
  };

  const formatLastActivity = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getRoleIcon = (role) => {
    return role === 'gm' ? 'fas fa-crown' : 'fas fa-user';
  };

  const getRoleColor = (role) => {
    return role === 'gm' ? '#d4af37' : '#7a3b2e';
  };

  const getRoomStatusIndicator = (roomId) => {
    const status = roomStatuses.get(roomId);

    switch (status) {
      case 'live':
        return {
          icon: 'fas fa-circle',
          color: '#4CAF50',
          text: 'Live',
          title: 'Room is currently active'
        };
      case 'offline':
        return {
          icon: 'fas fa-circle',
          color: '#757575',
          text: 'Offline',
          title: 'Room is not currently active'
        };
      case 'test':
        return {
          icon: 'fas fa-flask',
          color: '#FF9800',
          text: 'Test',
          title: 'Local test room'
        };
      default:
        return {
          icon: 'fas fa-question-circle',
          color: '#9E9E9E',
          text: 'Unknown',
          title: 'Unable to determine room status'
        };
    }
  };



  // Show test room even without user for testing
  if (!user) {
    return (
      <div className="room-manager">
        <div className="room-manager-header">
          <h2>
            <i className="fas fa-dungeon"></i>
            My Campaign Rooms (Test Mode)
          </h2>

        </div>

        <div className="rooms-list">
          <div className="no-rooms">
            <i className="fas fa-dungeon"></i>
            <h3>No Local Rooms</h3>
            <p>Local rooms will appear here when you create them.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="room-manager">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading your rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-manager">
      <div className="room-manager-header">
        <h2>
          <i className="fas fa-dungeon"></i>
          My Campaign Rooms
        </h2>

        {refreshMessage && (
          <div className="refresh-message">
            {refreshMessage}
          </div>
        )}

        <div className="header-actions">
          <button
            className="refresh-rooms-btn"
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              loadRoomData();
            }}
            title="Refresh room list"
            disabled={isLoading}
          >
            <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i>
            Refresh Rooms
          </button>
          <button
            className="refresh-status-btn"
            onClick={checkAllRoomStatuses}
            title="Refresh room status"
          >
            <i className="fas fa-wifi"></i>
            Check Status
          </button>
        </div>

        {roomLimits && (
          <div className="room-limits">
            <div className="usage-info">
              <span className="usage-text">
                {roomLimits.used} / {roomLimits.limit} rooms used
              </span>
              <div className="usage-bar">
                <div
                  className="usage-fill"
                  style={{
                    width: `${roomLimits.limit > 0 ? (roomLimits.used / roomLimits.limit) * 100 : 0}%`,
                    backgroundColor: roomLimits.used >= roomLimits.limit ? '#dc2626' : '#059669'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      <div className="room-actions">
        <button 
          className="create-room-btn"
          onClick={handleCreateRoom}
          disabled={roomLimits && !roomLimits.canCreate}
        >
          <i className="fas fa-plus"></i>
          {roomLimits && !roomLimits.canCreate ? 'Room Limit Reached' : 'Create New Room'}
        </button>
        
        {roomLimits && !roomLimits.canCreate && (
          <p className="limit-message">
            <i className="fas fa-info-circle"></i>
            Upgrade your plan to create more rooms
          </p>
        )}
      </div>

      {/* Local Rooms Section */}
      <div className="local-rooms-section">
        <div className="section-header">
          <h3>
            <i className="fas fa-home"></i>
            Local Rooms
          </h3>
          <button
            className="create-local-room-btn"
            onClick={() => setShowCreateLocalRoom(true)}
            title="Create a new local room for offline play"
          >
            <i className="fas fa-plus"></i>
            New Local Room
          </button>
        </div>

        {showCreateLocalRoom && (
          <div className="create-local-room-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter room name..."
                value={newLocalRoomName}
                onChange={(e) => setNewLocalRoomName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateLocalRoom()}
                autoFocus
              />
              <div className="form-actions">
                <button onClick={handleCreateLocalRoom} className="create-btn">
                  <i className="fas fa-check"></i>
                  Create
                </button>
                <button onClick={() => {
                  setShowCreateLocalRoom(false);
                  setNewLocalRoomName('');
                }} className="cancel-btn">
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="room-cards-grid">
          {localRooms.length === 0 ? (
            <div className="no-local-rooms">
              <i className="fas fa-home"></i>
              <p>No local rooms yet. Create one for offline play!</p>
            </div>
          ) : (
            localRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onJoin={handleJoinLocalRoom}
                onDelete={handleDeleteLocalRoom}
                onUpdateRoom={handleUpdateLocalRoom}
                showDeleteButton={true}
                className="room-card-unified"
              />
            ))
          )}
        </div>
      </div>

      {/* Multiplayer Rooms Section */}
      <div className="multiplayer-rooms-section">
        <div className="section-header">
          <h3>
            <i className="fas fa-users"></i>
            Multiplayer Rooms
          </h3>
        </div>

        <div className="room-cards-grid">
          {rooms.length === 0 ? (
            <div className="no-rooms">
              <i className="fas fa-dungeon"></i>
              <h3>No Multiplayer Rooms Yet</h3>
              <p>Create your first persistent room to start a campaign that saves your progress.</p>
            </div>
          ) : (
          rooms.map(room => {
            console.log('🎮 Rendering room:', room);
            return (
              <RoomCard
                key={room.id}
                room={room}
                onJoin={handleJoinRoom}
                onDelete={room.userRole === 'gm' ? handleDeleteRoom : null}
                onUpdateRoom={handleUpdateMultiplayerRoom}
                showDeleteButton={room.userRole === 'gm'}
                className="room-card-unified"
              />
            );
          })
        )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedRoom && (
        <div className="modal-overlay">
          <div className="delete-confirm-modal">
            <h3>Delete Room</h3>
            <p>
              Are you sure you want to delete "<strong>{selectedRoom.name}</strong>"?
              <br />
              <span className="warning-text">This action cannot be undone and all room data will be lost.</span>
            </p>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedRoom(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={confirmDeleteRoom}
              >
                <i className="fas fa-trash"></i>
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManager;
