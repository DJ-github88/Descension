// Room Manager component for account dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRooms, deleteRoom, getRoomLimits } from '../../services/roomService';
import localRoomService from '../../services/localRoomService';
import subscriptionService from '../../services/subscriptionService';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useSocialStore from '../../store/socialStore';
import usePresenceStore from '../../store/presenceStore';
import RoomCard from '../common/RoomCard';
import ConfirmationDialog from '../item-generation/ConfirmationDialog';
import RoomToast from './RoomToast';
import './styles/RoomManager.css';

const RoomManager = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getActiveCharacter } = useCharacterStore();
  const { friends } = useSocialStore();
  // Get online users map and convert to array in useMemo to prevent infinite re-renders
  const onlineUsersMap = usePresenceStore((state) => state.onlineUsers);
  const onlineUsers = React.useMemo(() => {
    return Object.values(onlineUsersMap || {});
  }, [onlineUsersMap]);

  const [rooms, setRooms] = useState([]);
  const [localRooms, setLocalRooms] = useState([]);
  const [friendsRooms, setFriendsRooms] = useState([]);
  const [roomLimits, setRoomLimits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localRoomToDelete, setLocalRoomToDelete] = useState(null);
  const [showLocalDeleteConfirm, setShowLocalDeleteConfirm] = useState(false);
  const [roomStatuses, setRoomStatuses] = useState(new Map());
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [showCreateLocalRoom, setShowCreateLocalRoom] = useState(false);
  const [newLocalRoomName, setNewLocalRoomName] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Helper function to show toast notifications
  const showToast = (message, type = 'success', duration = 4000) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), duration);
  };

  useEffect(() => {
    loadRoomData();
    // Don't load local rooms separately for guests - handled in loadRoomData
    if (!user?.isGuest) {
      loadLocalRooms();
    }
  }, [user]);

  // Find rooms where friends are playing
  useEffect(() => {
    if (friends.length > 0 && onlineUsers.length > 0) {
      const friendsInRooms = [];

      // Find friends who are online and in multiplayer rooms
      onlineUsers.forEach(onlineUser => {
        const friend = friends.find(f => f.name === onlineUser.characterName);
        if (friend && onlineUser.sessionType === 'multiplayer' && onlineUser.roomName) {
          // Check if we already have this room
          const existingRoom = friendsInRooms.find(r => r.roomId === onlineUser.roomId);

          if (!existingRoom) {
            // Add this room with the friend info
            friendsInRooms.push({
              id: onlineUser.roomId,
              name: onlineUser.roomName,
              friend: friend,
              friendCharacterName: onlineUser.characterName,
              participants: onlineUser.roomParticipants || [],
              isFriendsRoom: true,
              createdAt: new Date(),
              // Mark as joinable since friend is there
              canJoin: true,
              passwordRequired: true // Assume password required unless we know otherwise
            });
          } else {
            // Add this friend to the existing room entry
            if (!existingRoom.participants.includes(onlineUser.characterName)) {
              existingRoom.participants.push(onlineUser.characterName);
            }
          }
        }
      });

      setFriendsRooms(friendsInRooms);
    } else {
      setFriendsRooms([]);
    }
  }, [friends, onlineUsers]);

  // Check for room data changes when component mounts or becomes visible
  useEffect(() => {
    const checkForRoomDataChanges = () => {
      if (user && localStorage.getItem('roomDataChanged') === 'true') {
        localStorage.removeItem('roomDataChanged');
        const lastJoinedRoom = localStorage.getItem('lastJoinedRoom');
        const lastCreatedRoom = localStorage.getItem('lastCreatedRoom');

        if (lastJoinedRoom) {
          localStorage.removeItem('lastJoinedRoom');
          showToast(`Welcome back! Room data refreshed after joining a room.`, 'info', 5000);
        } else if (lastCreatedRoom) {
          localStorage.removeItem('lastCreatedRoom');
          showToast(`Room created successfully! Your new room should appear below.`, 'success', 5000);
        }

        loadRoomData();
      }
    };

    // Check immediately when component mounts
    checkForRoomDataChanges();

    // Auto-refresh room data when component becomes visible (e.g., returning from multiplayer)
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        checkForRoomDataChanges();
      }
    };

    const handleFocus = () => {
      if (user) {
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

  // Check status for all rooms (user rooms + friends' rooms)
  const checkAllRoomStatuses = async () => {
    setIsCheckingStatus(true);
    const statusMap = new Map();

    try {
      // Check user's own rooms
      for (const room of rooms) {
        const status = await checkRoomStatus(room.id);
        statusMap.set(room.id, status);
      }

      // Check friends' rooms
      for (const room of friendsRooms) {
        const status = await checkRoomStatus(room.id);
        statusMap.set(room.id, status);
      }

      setRoomStatuses(statusMap);

      // Show feedback
      const totalChecked = rooms.length + friendsRooms.length;
      if (totalChecked > 0) {
        const liveCount = Array.from(statusMap.values()).filter(s => s === 'live').length;
        showToast(`Checked ${totalChecked} room${totalChecked === 1 ? '' : 's'}: ${liveCount} live`, 'success', 3000);
      } else {
        showToast('No rooms to check', 'info', 2000);
      }
    } catch (error) {
      console.error('Error checking room statuses:', error);
      showToast('Failed to check room statuses', 'error', 3000);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Check room statuses when rooms or friendsRooms change (auto-check on load)
  useEffect(() => {
    if (rooms.length > 0 || friendsRooms.length > 0) {
      // Auto-check status on load, but don't show loading state
      const autoCheck = async () => {
        const statusMap = new Map();

        for (const room of rooms) {
          const status = await checkRoomStatus(room.id);
          statusMap.set(room.id, status);
        }

        for (const room of friendsRooms) {
          const status = await checkRoomStatus(room.id);
          statusMap.set(room.id, status);
        }

        setRoomStatuses(statusMap);
      };

      autoCheck();
    } else {
      // Clear statuses if no rooms
      setRoomStatuses(new Map());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms.length, friendsRooms.length]); // Only depend on lengths to avoid infinite loops

  // Load local rooms from localStorage
  const loadLocalRooms = () => {
    try {
      const localRoomsList = localRoomService.getLocalRooms();
      setLocalRooms(localRoomsList);
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

    // Check room limits before creating
    if (roomLimits && localRooms.length >= roomLimits.limit && roomLimits.limit > 0) {
      alert(`Room limit reached. You can only create ${roomLimits.limit} local room${roomLimits.limit === 1 ? '' : 's'}.`);
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

      // Refresh room limits to update the counter
      if (user) {
        getRoomLimits(user.uid).then(limits => {
          setRoomLimits(limits);
        }).catch(err => {
          console.error('Error updating room limits:', err);
        });
      }

      setNewLocalRoomName('');
      setShowCreateLocalRoom(false);
      showToast(`Local room "${newRoom.name}" created`, 'success', 4000);
    } catch (error) {
      console.error('Error creating local room:', error);
      const errorMessage = error.message || 'Failed to create local room';
      if (errorMessage.includes('quota') || errorMessage.includes('QuotaExceeded')) {
        alert('Storage quota exceeded. Please clear some browser data or delete unused rooms.');
      } else {
        alert(`Failed to create local room: ${errorMessage}`);
      }
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
      // Clear world builder mode flag - local rooms are not world builder mode
      localStorage.removeItem('isWorldBuilderMode');

      navigate('/game'); // Navigate directly to game for local rooms
    } catch (error) {
      console.error('Error joining local room:', error);
      alert('Failed to join local room');
    }
  };

  // Delete a local room
  const handleDeleteLocalRoom = (roomId) => {
    setLocalRoomToDelete(roomId);
    setShowLocalDeleteConfirm(true);
  };

  const confirmDeleteLocalRoom = () => {
    if (!localRoomToDelete) return;

    try {
      localRoomService.deleteLocalRoom(localRoomToDelete);
      loadLocalRooms(); // Refresh the list

      // Refresh room limits to update the counter
      if (user) {
        getRoomLimits(user.uid).then(limits => {
          setRoomLimits(limits);
        }).catch(err => {
          console.error('Error updating room limits:', err);
        });
      }

      showToast('Local room deleted', 'success', 3000);

      setShowLocalDeleteConfirm(false);
      setLocalRoomToDelete(null);
    } catch (error) {
      console.error('Error deleting local room:', error);
      alert('Failed to delete local room');
      setShowLocalDeleteConfirm(false);
      setLocalRoomToDelete(null);
    }
  };

  // Update a local room
  const handleUpdateLocalRoom = (roomId, updates) => {
    try {
      localRoomService.updateLocalRoom(roomId, updates);
      loadLocalRooms(); // Refresh the list
      showToast('Local room updated', 'success', 3000);
    } catch (error) {
      console.error('Error updating local room:', error);
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

      showToast('Room updated', 'success', 3000);
    } catch (error) {
      console.error('Error updating multiplayer room:', error);
      throw error; // Re-throw so RoomCard can handle it
    }
  };

  const loadRoomData = async () => {
    if (!user) {
      // No user logged in - show empty state
      setRooms([]);
      setLocalRooms([]);
      setRoomLimits({
        tier: { name: 'Guest' },
        used: 0,
        limit: 0,
        canCreate: false
      });
      setIsLoading(false);
      return;
    }

    // Check if user is a guest - they get 1 room limit (can be local or multiplayer)
    if (user.isGuest) {
      setIsLoading(true);

      try {
        // Check if guest has been initialized (rooms cleared on first login)
        const guestInitialized = localStorage.getItem('mythrill-guest-initialized');

        if (!guestInitialized) {
          // First time this guest is accessing rooms - clear any existing rooms from other users
          localStorage.removeItem('mythrill_local_rooms');

          // Clear room state data
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('mythrill_local_room_state_')) {
              localStorage.removeItem(key);
            }
          });

          // Clear any previous guest joined rooms
          localStorage.removeItem('mythrill-guest-joined-room');

          // Mark as initialized
          localStorage.setItem('mythrill-guest-initialized', 'true');
        }

        // Load local rooms for guest
        const localRoomsData = localRoomService.getLocalRooms();
        const localRoomCount = localRoomsData.length;

        // Check for joined multiplayer rooms (stored in localStorage for guests)
        let joinedMultiplayerRooms = [];
        const guestJoinedRoomsJson = localStorage.getItem('mythrill-guest-joined-rooms');
        const legacyGuestJoinedRoom = localStorage.getItem('mythrill-guest-joined-room');

        let rawGuestRooms = [];
        try {
          if (guestJoinedRoomsJson) {
            rawGuestRooms = JSON.parse(guestJoinedRoomsJson);
            if (!Array.isArray(rawGuestRooms)) rawGuestRooms = [];
          } else if (legacyGuestJoinedRoom) {
            // Migrate legacy single room to new list format
            const roomData = JSON.parse(legacyGuestJoinedRoom);
            rawGuestRooms = [roomData];
            localStorage.setItem('mythrill-guest-joined-rooms', JSON.stringify(rawGuestRooms));
            localStorage.removeItem('mythrill-guest-joined-room');
          }
        } catch (e) {
          console.warn('Error parsing guest joined rooms:', e);
        }

        if (rawGuestRooms.length > 0) {
          try {
            // Verify the rooms still exist on the server
            const serverUrl = process.env.REACT_APP_SOCKET_URL ||
              (process.env.NODE_ENV === 'production' ?
                'https://descension-mythrill.up.railway.app' :
                'http://localhost:3002'); // Fixed port to 3002 for dev

            const response = await fetch(`${serverUrl}/rooms`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
              const activeRooms = await response.json();
              const activeRoomIds = new Set(activeRooms.map(r => r.id));

              // Filter out rooms that no longer exist
              joinedMultiplayerRooms = rawGuestRooms.filter(room => activeRoomIds.has(room.id));

              // Update localStorage if some rooms were removed
              if (joinedMultiplayerRooms.length !== rawGuestRooms.length) {
                localStorage.setItem('mythrill-guest-joined-rooms', JSON.stringify(joinedMultiplayerRooms));
              }
            } else {
              // Server error, keep all rooms for now
              joinedMultiplayerRooms = rawGuestRooms;
            }
          } catch (serverError) {
            console.warn('Could not verify rooms on server:', serverError);
            // Still show the rooms even if we can't verify
            joinedMultiplayerRooms = rawGuestRooms;
          }
        }

        // Guests can have 1 local room OR 1 multiplayer room (not both)
        // Total limit is 1 room
        const totalRoomCount = localRoomCount + joinedMultiplayerRooms.length;

        setRooms(joinedMultiplayerRooms);
        setLocalRooms(localRoomsData);

        const guestTier = await subscriptionService.getUserTier(user.uid);
        setRoomLimits({
          tier: guestTier,
          used: totalRoomCount,
          limit: 1,
          remaining: Math.max(0, 1 - totalRoomCount),
          canCreate: totalRoomCount < 1, // Can only create if no rooms at all
          localRooms: localRoomsData
        });
      } catch (error) {
        console.error('Error loading guest rooms:', error);
        setRooms([]);
        setLocalRooms([]);
        setRoomLimits({
          tier: { name: 'Guest' },
          used: 0,
          limit: 1,
          canCreate: true
        });
      }

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

      // Show success message only if rooms found
      const roomCount = userRooms.length;
      if (roomCount > 0) {
        showToast(`Loaded ${roomCount} room${roomCount === 1 ? '' : 's'}`, 'success', 3000);
      }
      // Don't show "No rooms found" message - let the empty state handle it

    } catch (err) {
      console.error('Error loading room data:', err);
      setError('Failed to load room data from Firebase. Showing test room only.');
      showToast('Failed to load rooms from Firebase', 'error', 5000);

      // Even if Firebase fails, keep the existing test room (don't overwrite)
      setRoomLimits({
        tier: { name: 'Development' },
        used: 1,
        limit: 999,
        canCreate: true
      });

      // Clear error message after 5 seconds
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
      // Clear world builder mode flag - test rooms are not world builder mode
      localStorage.removeItem('isWorldBuilderMode');
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

        <div className="header-actions">
          <button
            className="refresh-rooms-btn"
            onClick={() => {
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
            title="Check status of all rooms (yours and friends')"
            disabled={isCheckingStatus}
          >
            <i className={`fas fa-wifi ${isCheckingStatus ? 'fa-spin' : ''}`}></i>
            {isCheckingStatus ? 'Checking...' : 'Check Status'}
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

      {/* Toast Notification */}
      {toastMessage && (
        <RoomToast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
          duration={4000}
        />
      )}

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

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
            disabled={roomLimits && localRooms.length >= roomLimits.limit}
            title={roomLimits && localRooms.length >= roomLimits.limit
              ? `Room limit reached (${roomLimits.limit})`
              : "Create a new local room for offline play"}
          >
            <i className="fas fa-plus"></i>
            {roomLimits && localRooms.length >= roomLimits.limit ? 'Room Limit Reached' : 'New Local Room'}
          </button>
        </div>

        {roomLimits && localRooms.length >= roomLimits.limit && (
          <div className="limit-message-section">
            <p className="limit-message">
              <i className="fas fa-info-circle"></i>
              {user?.isGuest
                ? 'Guest accounts are limited to 1 room. Sign up for a free account to get more!'
                : 'Upgrade your plan to create more rooms'}
            </p>
          </div>
        )}


        <div className="room-cards-grid">
          {localRooms.length === 0 ? (
            <div className="no-local-rooms">
              <i className="fas fa-home"></i>
              <h3>No Local Rooms Yet</h3>
              <p>Create one for offline play!</p>
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

      {/* Friends are Playing Section */}
      <div className="friends-rooms-section">
        <div className="section-header">
          <h3>
            <i className="fas fa-user-friends"></i>
            Friends are Playing
          </h3>
        </div>

        <div className="room-cards-grid">
          {friendsRooms.length === 0 ? (
            <div className="no-friends-rooms">
              <i className="fas fa-user-friends"></i>
              <h3>No Friends Online</h3>
              <p>Your friends will appear here when they're in active multiplayer sessions.</p>
            </div>
          ) : (
            friendsRooms.map(room => {
              const status = roomStatuses.get(room.id);
              const statusInfo = getRoomStatusIndicator(room.id);

              return (
                <div key={room.id} className="room-card friends-room-card">
                  <div className="room-card-header">
                    <div className="room-info">
                      <h4 className="room-name">{room.name}</h4>
                      <div className="room-meta">
                        <span className="room-participants">
                          <i className="fas fa-users"></i>
                          {room.participants.length} player{room.participants.length !== 1 ? 's' : ''}
                        </span>
                        {status && (
                          <span className="room-status-badge" style={{ color: statusInfo.color }}>
                            <i className={statusInfo.icon}></i>
                            {statusInfo.text}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="friend-info">
                      <div className="friend-playing">
                        <i className="fas fa-gamepad"></i>
                        <span>{room.friendCharacterName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="room-card-body">
                    <div className="room-description">
                      Join your friend <strong>{room.friendCharacterName}</strong> in this multiplayer session!
                    </div>

                    <div className="room-actions">
                      <button
                        className="join-room-btn"
                        onClick={() => {
                          // Store room selection for joining
                          const password = prompt(`Enter password for "${room.name}":`);
                          if (password !== null && password.trim()) {
                            localStorage.setItem('selectedRoomId', room.id);
                            localStorage.setItem('selectedRoomPassword', password.trim());
                            localStorage.removeItem('isTestRoom');
                            navigate('/multiplayer');
                          }
                        }}
                      >
                        <i className="fas fa-sign-in-alt"></i>
                        Join Game
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
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
          <button
            className="create-local-room-btn"
            onClick={handleCreateRoom}
            disabled={roomLimits && !roomLimits.canCreate}
            title="Create a new multiplayer room"
          >
            <i className="fas fa-plus"></i>
            {user?.isGuest
              ? 'Sign Up Required'
              : (roomLimits && !roomLimits.canCreate ? 'Room Limit Reached' : 'New Multiplayer Room')}
          </button>
        </div>

        {roomLimits && !roomLimits.canCreate && (
          <div className="limit-message-section">
            <p className="limit-message">
              <i className="fas fa-info-circle"></i>
              Upgrade your plan to create more rooms
            </p>
          </div>
        )}

        <div className="room-cards-grid">
          {rooms.length === 0 ? (
            <div className="no-rooms">
              <i className="fas fa-dungeon"></i>
              <h3>No Multiplayer Rooms Yet</h3>
              <p>Create your first persistent room to start a campaign that saves your progress.</p>
              <div className="empty-state-actions">
                <button
                  className="create-room-btn"
                  onClick={handleCreateRoom}
                  disabled={roomLimits && !roomLimits.canCreate}
                  title="Create a new multiplayer room"
                >
                  <i className="fas fa-plus"></i>
                  Create Your First Room
                </button>
                {friendsRooms.length > 0 && (
                  <p className="friends-hint">
                    <i className="fas fa-info-circle"></i>
                    {friendsRooms.length} friend{friendsRooms.length === 1 ? '' : 's'} {friendsRooms.length === 1 ? 'is' : 'are'} playing in rooms above
                  </p>
                )}
              </div>
            </div>
          ) : (
            rooms.map(room => {
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

      {/* Delete Confirmation Modal for Multiplayer Room */}
      {showDeleteConfirm && selectedRoom && (
        <ConfirmationDialog
          message={`Are you sure you want to delete "${selectedRoom.name}"? This action cannot be undone and all room data will be lost.`}
          onConfirm={confirmDeleteRoom}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setSelectedRoom(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal for Local Room */}
      {showLocalDeleteConfirm && localRoomToDelete && (() => {
        const roomToDelete = localRooms.find(r => r.id === localRoomToDelete);
        const roomName = roomToDelete?.name || 'this local room';
        return (
          <ConfirmationDialog
            message={`Are you sure you want to delete "${roomName}"? This action cannot be undone.`}
            onConfirm={confirmDeleteLocalRoom}
            onCancel={() => {
              setShowLocalDeleteConfirm(false);
              setLocalRoomToDelete(null);
            }}
          />
        );
      })()}

      {/* Create Local Room Modal */}
      {showCreateLocalRoom && (
        <div className="modal-overlay">
          <div className="create-local-room-modal">
            <h3>Create Local Room</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter room name..."
                value={newLocalRoomName}
                onChange={(e) => setNewLocalRoomName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateLocalRoom()}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowCreateLocalRoom(false);
                  setNewLocalRoomName('');
                }}
              >
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={handleCreateLocalRoom}
              >
                <i className="fas fa-plus"></i>
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManager;
