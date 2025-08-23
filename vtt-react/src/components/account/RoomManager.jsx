// Room Manager component for account dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRooms, deleteRoom, getRoomLimits } from '../../services/roomService';
import subscriptionService from '../../services/subscriptionService';
import useAuthStore from '../../store/authStore';
import './styles/RoomManager.css';

const RoomManager = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [rooms, setRooms] = useState([]);
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
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const [userRooms, limits] = await Promise.all([
        getUserRooms(user.uid),
        getRoomLimits(user.uid)
      ]);

      setRooms(userRooms);
      setRoomLimits(limits);
    } catch (err) {
      console.error('Error loading room data:', err);
      setError('Failed to load room data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = () => {
    navigate('/multiplayer');
  };

  const handleJoinRoom = (room) => {
    // Store room selection and navigate to multiplayer
    localStorage.setItem('selectedRoomId', room.id);
    localStorage.setItem('selectedRoomPassword', room.password || '');
    navigate('/multiplayer');
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

  if (!user) {
    return (
      <div className="room-manager">
        <div className="auth-required">
          <i className="fas fa-sign-in-alt"></i>
          <h3>Sign In Required</h3>
          <p>You need to be signed in to manage persistent rooms.</p>
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
              <span className="tier-badge">
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
            <div key={room.id} className="room-card">
              <div className="room-header">
                <div className="room-title">
                  <h3>{room.name}</h3>
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
                    Enter Room
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
