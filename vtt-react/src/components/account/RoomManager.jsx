// Room Manager component for account dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRooms, deleteRoom, getRoomLimits } from '../../services/roomService';
import subscriptionService from '../../services/subscriptionService';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import './styles/RoomManager.css';

const RoomManager = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getActiveCharacter } = useCharacterStore();

  // Initialize with a test room to ensure it always shows
  const activeCharacter = getActiveCharacter();
  const initialTestRoom = {
    id: 'test-room-local',
    name: 'Local Test Room',
    description: 'Local test room for character testing',
    userRole: 'gm',
    gmName: 'Game Master',
    members: ['test-user'],
    isTestRoom: true,
    settings: {
      maxPlayers: 6,
      isPrivate: false
    },
    lastActivity: {
      seconds: Math.floor(Date.now() / 1000)
    },
    createdAt: {
      seconds: Math.floor(Date.now() / 1000)
    },
    isTestRoom: true
  };

  const [rooms, setRooms] = useState([initialTestRoom]);
  const [roomLimits, setRoomLimits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadRoomData();
  }, [user]);

  const loadRoomData = async () => {
    if (!user) {
      // Even without user, create a test room for development
      const activeCharacter = getActiveCharacter();
      const testRoom = {
        id: 'test-room-local',
        name: `${activeCharacter?.name || 'Test'} - Local Test Room`,
        description: 'Local test room for character testing',
        userRole: 'gm',
        gmName: 'Game Master',
        members: ['test-user'],
        isTestRoom: true,
        settings: {
          maxPlayers: 6,
          isPrivate: false
        },
        lastActivity: {
          seconds: Math.floor(Date.now() / 1000)
        },
        createdAt: {
          seconds: Math.floor(Date.now() / 1000)
        },
        isTestRoom: true
      };


      setRooms([testRoom]);
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
      name: 'Local Test Room',
      description: 'Local test room for character testing',
      userRole: 'gm',
      gmName: user?.displayName || 'Game Master',
      members: [user?.uid],
      isTestRoom: true,
      settings: {
        maxPlayers: 6,
        isPrivate: false
      },
      lastActivity: {
        seconds: Math.floor(Date.now() / 1000)
      },
      createdAt: {
        seconds: Math.floor(Date.now() / 1000)
      },
      isTestRoom: true // Mark as test room
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
    } catch (err) {
      console.error('Error loading room data:', err);
      setError('Failed to load room data from Firebase. Showing test room only.');

      // Even if Firebase fails, keep the existing test room (don't overwrite)
      setRoomLimits({
        tier: { name: 'Development' },
        used: 1,
        limit: 999,
        canCreate: true
      });
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
      // Store room selection and navigate to multiplayer
      localStorage.setItem('selectedRoomId', room.id);
      localStorage.setItem('selectedRoomPassword', room.password || '');
      localStorage.removeItem('isTestRoom');
      navigate('/multiplayer');
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
          {rooms.length === 0 ? (
            <div className="no-rooms">
              <i className="fas fa-dungeon"></i>
              <h3>No Test Rooms Available</h3>
              <p>Test room should appear here. Check console for debugging info.</p>
            </div>
          ) : (
            rooms.map(room => (
              <div
                key={room.id}
                className={`room-card ${room.isTestRoom ? 'test-room' : ''}`}
                style={room.isTestRoom ? {
                  border: '2px solid #e5e7eb',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  padding: '20px 28px',
                  borderRadius: '16px',
                  minHeight: '72px',
                  gap: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
                } : {}}
              >
                <div className="room-header" style={room.isTestRoom ? {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '20px'
                } : {}}>
                  <div className="room-title" style={room.isTestRoom ? {
                    flex: '1',
                    minWidth: '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  } : {}}>
                    <h3 style={room.isTestRoom ? {
                      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
                      fontSize: '19px',
                      fontWeight: '500',
                      lineHeight: '1.3',
                      letterSpacing: '-0.01em',
                      color: '#1f2937',
                      margin: '0 0 8px 0'
                    } : {}}>
                      {room.name}
                    </h3>
                    <div className="room-role" style={room.isTestRoom ? {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px',
                      color: '#6b7280',
                      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
                    } : {}}>
                      <span style={{
                        color: '#d4af37',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>👑</span>
                      <span>Game Master</span>
                    </div>
                  </div>
                  <div className="room-actions-menu" style={room.isTestRoom ? {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  } : {}}>
                    <button
                      className="join-btn"
                      onClick={() => handleJoinRoom(room)}
                      style={room.isTestRoom ? {
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: 'none',
                        borderRadius: '14px',
                        color: 'white',
                        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '12px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                        minWidth: 'auto',
                        whiteSpace: 'nowrap'
                      } : {}}
                      onMouseEnter={room.isTestRoom ? (e) => {
                        e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                      } : undefined}
                      onMouseLeave={room.isTestRoom ? (e) => {
                        e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                      } : undefined}
                    >
                      <i className="fas fa-play"></i>
                      Join
                    </button>
                  </div>
                </div>

                {room.description && (
                  <p className="room-description">{room.description}</p>
                )}

                <div className="room-stats">
                  <div className="stat">
                    <i className="fas fa-users"></i>
                    <span>1/7 members</span>
                  </div>
                  <div className="stat">
                    <i className="fas fa-clock"></i>
                    <span>Just created</span>
                  </div>
                </div>
              </div>
            ))
          )}
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

        
        {roomLimits && (
          <div className="room-limits">
            <div className="tier-info">
              <span className={`tier-badge ${roomLimits.tier.name.toLowerCase() === 'development' ? 'development' : ''}`}>
                <i className="fas fa-star"></i>
                {roomLimits.tier.name}
              </span>
            </div>
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

      <div className="rooms-list">
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <i className="fas fa-dungeon"></i>
            <h3>No Rooms Yet</h3>
            <p>Create your first persistent room to start a campaign that saves your progress.</p>
          </div>
        ) : (
          rooms.map(room => (
            <div key={room.id} className={`room-card ${room.isTestRoom ? 'test-room' : ''}`}>
              <div className="room-header">
                <div className="room-title">
                  <h3>
                    {room.name}
                  </h3>
                  <div className="room-role">
                    <i 
                      className={getRoleIcon(room.userRole)}
                      style={{ color: getRoleColor(room.userRole) }}
                    />
                    <span>{room.userRole === 'gm' ? 'Game Master' : 'Player'}</span>
                  </div>
                </div>
                <div className="room-actions-menu">
                  <button
                    className="join-btn"
                    onClick={() => handleJoinRoom(room)}
                  >
                    <i className="fas fa-play"></i>
                    Join
                  </button>
                  {room.userRole === 'gm' && (
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteRoom(room)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              </div>
              
              {room.description && (
                <p className="room-description">{room.description}</p>
              )}
              
              <div className="room-stats">
                <div className="stat">
                  <i className="fas fa-users"></i>
                  <span>{room.members?.length || 0}/{(room.settings?.maxPlayers || 6) + 1} members</span>
                </div>
                <div className="stat">
                  <i className="fas fa-clock"></i>
                  <span>Last active: {formatLastActivity(room.lastActivity)}</span>
                </div>
                {room.stats?.totalSessions > 0 && (
                  <div className="stat">
                    <i className="fas fa-dice-d20"></i>
                    <span>{room.stats.totalSessions} session{room.stats.totalSessions === 1 ? '' : 's'}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
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
