/**
 * Online Users List Component
 * 
 * Displays all currently online users with their character details and session status.
 * Includes search/filter functionality and context menu for actions.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import usePresenceStore from '../../store/presenceStore';
import useAuthStore from '../../store/authStore';
import usePartyStore from '../../store/partyStore';

import useSocialStore from '../../store/socialStore';
import useCharacterStore from '../../store/characterStore';
import authService from '../../services/authService';
import useSettingsStore from '../../store/settingsStore';
import presenceService from '../../services/firebase/presenceService';
import PartyCreationDialog from './PartyCreationDialog';
import UserCard from './UserCard';
import ConfirmationDialog from '../item-generation/ConfirmationDialog';
import '../../styles/social-window.css';

const OnlineUsersList = ({ onUserClick, onWhisper, onInviteToRoom }) => {
  const navigate = useNavigate();
  const windowScale = useSettingsStore(state => state.windowScale);
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('online'); // 'online', 'friends', 'ignored', or 'party'
  const [statusComment, setStatusComment] = useState('');
  const [statusCommentDraft, setStatusCommentDraft] = useState('');
  const [showAddFriendPopup, setShowAddFriendPopup] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState('');
  const [friendIdError, setFriendIdError] = useState('');
  const [showCreatePartyDialog, setShowCreatePartyDialog] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteUserId, setNoteUserId] = useState(null);
  const [noteUserType, setNoteUserType] = useState(null); // 'friend' or 'ignored'
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [pendingRemoveFriend, setPendingRemoveFriend] = useState(null);

  // Subscribe to the raw Map (stable reference — only changes when presenceStore.set() is called).
  // Deriving the array via useMemo avoids the Array.from() reference churn that previously
  // caused a re-render on every store access.
  const onlineUsersMap = usePresenceStore((state) => state.onlineUsers);
  const onlineUsers = useMemo(() => Array.from(onlineUsersMap.values()), [onlineUsersMap]);
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const updateStatus = usePresenceStore((state) => state.updateStatus);
  const { user } = useAuthStore();
  const {
    isInParty,
    currentParty,
    addPartyMember,
    createParty,
    partyMembers,
    removePartyMember,
    leaveParty,
    sendPartyMessage,
    partyChatMessages,
    joinParty,
    inviteToParty,
    promotePartyMember,
    kickPartyMember
  } = usePartyStore();
  const { friends, addFriend, sendFriendRequest, removeFriend, addIgnored, ignored, removeIgnored, migrateFriends, setFriendNote, setIgnoredNote, friendPresence } = useSocialStore();

  // Migrate friends data on mount if needed
  useEffect(() => {
    migrateFriends();
  }, [migrateFriends]);

  // Get current character data
  const characterName = useCharacterStore((state) => state.name);
  const characterClass = useCharacterStore((state) => state.class);
  const characterLevel = useCharacterStore((state) => state.level);
  const characterRace = useCharacterStore((state) => state.race);
  const characterSubrace = useCharacterStore((state) => state.subrace);
  const characterBackground = useCharacterStore((state) => state.background);
  const characterRaceDisplayName = useCharacterStore((state) => state.raceDisplayName);
  const characterPath = useCharacterStore((state) => state.path);
  const characterPathDisplayName = useCharacterStore((state) => state.pathDisplayName);
  const characterBackgroundDisplayName = useCharacterStore((state) => state.backgroundDisplayName);

  // Start party chat simulation when party members change
  useEffect(() => {
    // Mock party chat simulation removed
  }, [isInParty, partyMembers]);

  // Get party leader (first member with isGM: true, or first member if none)
  const partyLeader = useMemo(() => {
    if (!partyMembers || partyMembers.length === 0) return null;
    const gmMember = partyMembers.find(m => m.isGM);
    return gmMember || partyMembers[0];
  }, [partyMembers]);

  const isLeader = useMemo(() => {
    if (!partyLeader || !currentUserPresence) return false;
    return partyLeader.id === currentUserPresence.userId || partyLeader.userId === currentUserPresence.userId;
  }, [partyLeader, currentUserPresence]);

  // Filter out current user from friends list
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    return friends.filter(friend => {
      // Exclude current user by unique ID, not character name
      if (friend.id === currentUserPresence?.userId) return false;
      return true;
    });
  }, [friends, currentUserPresence]);

  // Filter out offline users from the global list, but always include current user
  const activeOnlineUsers = useMemo(() => {
    return onlineUsers.filter(u => {
      // Always show current user (even when appearing offline)
      if (u.userId === currentUserPresence?.userId) return true;
      // Others must pass isUserOnline check (filters out 'offline' status)
      return presenceService.isUserOnline(u);
    });
  }, [onlineUsers, currentUserPresence?.userId]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return activeOnlineUsers;

    const term = searchTerm.toLowerCase();
    return activeOnlineUsers.filter(u =>
      u.characterName?.toLowerCase().includes(term) ||
      u.class?.toLowerCase().includes(term) ||
      u.background?.toLowerCase().includes(term) ||
      u.race?.toLowerCase().includes(term)
    );
  }, [activeOnlineUsers, searchTerm]);

  // Handle right-click context menu
  const handleContextMenu = (e, targetUser) => {
    e.preventDefault();

    // Calculate position with viewport boundary detection
    const menuWidth = 200; // Approximate menu width
    const menuHeight = 150; // Approximate menu height

    let x = e.clientX;
    let y = e.clientY;

    // Adjust if menu would go off right edge
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }

    // Adjust if menu would go off bottom edge
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    const targetUserId = targetUser.userId || targetUser.id || targetUser.uid;
    const isIgnored = (ignored || []).some(i => i.id === targetUserId || (i.friendId && i.friendId === targetUser.friendId) || i.userId === targetUserId);
    const isFriend = (friends || []).some(f => f.id === targetUserId || (f.friendId && f.friendId === targetUser.friendId) || f.userId === targetUserId);

    setContextMenu({
      x,
      y,
      user: targetUser,
      isIgnored,
      isFriend
    });
  };

  // Close context menu and status menu when clicking outside
  const closeContextMenu = (e) => {
    // Don't close if clicking inside status menu or status button
    if (e && (
      e.target.closest('.status-menu') ||
      e.target.closest('.status-button')
    )) {
      return;
    }
    setContextMenu(null);
  };

  // Handle context menu actions
  const handleWhisper = () => {
    if (contextMenu?.user) {
      onWhisper(contextMenu.user);
    }
    closeContextMenu();
  };

  const handleInvite = () => {
    if (contextMenu?.user) {
      onInviteToRoom(contextMenu.user);
    }
    closeContextMenu();
  };

  const handleJoinRoom = () => {
    const roomId = contextMenu?.user?.roomId;
    const roomName = contextMenu?.user?.roomName;
    if (roomId) {
      console.log('🎮 Joining room:', roomId, roomName);
      localStorage.setItem('selectedRoomId', roomId);
      localStorage.setItem('isGMResume', 'false');
      localStorage.removeItem('selectedRoomPassword');
      navigate('/multiplayer', { replace: true });
    }
    closeContextMenu();
  };

  const handleLeaveParty = () => {
    leaveParty();
    closeContextMenu();
  };

  const handlePromoteMember = () => {
    const targetUserId = contextMenu.user.userId || contextMenu.user.id || contextMenu.user.uid;
    const member = partyMembers.find(m => m.id === targetUserId);
    if (member) {
      console.log('👑 Promoting member to leader:', member.name);
      promotePartyMember(member.id);
    }
    closeContextMenu();
  };

  const handleRemovePartyMember = () => {
    const targetUserId = contextMenu.user.userId || contextMenu.user.id || contextMenu.user.uid;
    const member = partyMembers.find(m => m.id === targetUserId);
    if (member) {
      console.log('🗑️ Removing party member:', member.name);
      kickPartyMember(member.id);
    }
    closeContextMenu();
  };

  const handleDisbandParty = () => {
    const { disbandParty, currentParty: partyState } = usePartyStore.getState();
    const partyId = partyState?.id;
    if (partyId) {
      console.log('💥 Disbanding party:', partyId);
      disbandParty();
    }
    closeContextMenu();
  };


  const handleInviteToParty = async () => {
    const sendPartyInvite = usePresenceStore.getState().sendPartyInvite;
    const currentUserPresence = usePresenceStore.getState().currentUserPresence;
    const ensureSocketConnected = usePresenceStore.getState().ensureSocketConnected;

    // Get the user ID - check multiple possible fields (userId, id, uid)
    const targetUserId = contextMenu.user.userId || contextMenu.user.id || contextMenu.user.uid;

    // Prevent self-invitation
    if (targetUserId === currentUserPresence?.userId) {
      console.warn('⚠️ Cannot invite yourself to a party');
      closeContextMenu();
      return;
    }

    // Find online user to invite
    const onlineUser = onlineUsers.find(u => u.userId === targetUserId);

    const friendPres = friendPresence[targetUserId] || friendPresence[contextMenu.user.id];

    const isUserOnline = onlineUser || presenceService.isUserOnline(friendPres);

    if (!isUserOnline) {
      console.warn('⚠️ User not found or offline:', contextMenu.user.name, 'status:', friendPres?.status);
      closeContextMenu();
      return;
    }

    // Build target user with correct ID
    const targetUser = onlineUser || {
      ...contextMenu.user,
      ...friendPres,
      userId: targetUserId // Ensure userId is set
    };

    try {
      // Ensure social socket is connected before any party operation
      // (including createParty) to avoid create timeout paths.
      const socketReady = await ensureSocketConnected(5000);
      if (!socketReady) {
        throw new Error('Social server unavailable - could not connect socket for party invite');
      }

      // If not in party, create one first and wait for it
      if (!isInParty) {
        const currentPlayerName = currentUserPresence?.characterName || currentUserPresence?.accountName || 'Unknown Adventurer';

        await createParty(`${currentPlayerName}'s Party`, false, {
          name: currentPlayerName,
          characterName: currentPlayerName,
          characterClass: currentUserPresence?.class || 'Unknown Class',
          characterLevel: currentUserPresence?.level || 1
        });

        console.log('🎉 Party created for invitation');
      }

      // Now send the invitation using the correct user ID
      const inviteTargetId = targetUser.userId || targetUser.id || targetUserId;
      const inviteSent = sendPartyInvite(inviteTargetId, targetUser.characterName || targetUser.name);
      if (!inviteSent) {
        throw new Error('Failed to send party invite (socket not connected)');
      }
      console.log('📡 Party invitation requested for:', targetUser.characterName || targetUser.name, 'ID:', inviteTargetId);
    } catch (error) {
      console.error('❌ Failed to send party invitation:', error);
    }

    closeContextMenu();
  };

  const handleAddFriend = async () => {
    if (contextMenu?.user) {
      // Don't add yourself as a friend
      if (contextMenu.user.userId === currentUserPresence?.userId || contextMenu.user.uid === currentUserPresence?.userId) {
        console.log(`❌ Cannot add yourself as a friend`);
        closeContextMenu();
        return;
      }

      // Check if already friends
      const alreadyFriend = (friends || []).some(f =>
        (f.id === contextMenu.user.userId) ||
        (f.id === contextMenu.user.uid) ||
        (contextMenu.user.friendId && f.friendId === contextMenu.user.friendId)
      );

      if (alreadyFriend) {
        console.log(`❌ Already friends with this user`);
        closeContextMenu();
        return;
      }

      if (contextMenu.user.friendId) {
        const result = await sendFriendRequest(contextMenu.user.friendId);
        if (result && !result.success) {
          console.error('Failed to send friend request:', result.error);
        }
      } else {
        // Fallback or legacy support
        addFriend({
          id: contextMenu.user.userId || contextMenu.user.uid,
          name: contextMenu.user.characterName || contextMenu.user.name,
          level: contextMenu.user.level,
          class: contextMenu.user.class,
          background: contextMenu.user.background,
          race: contextMenu.user.race,
          subrace: contextMenu.user.subrace,
          status: contextMenu.user.status,
          location: contextMenu.user.sessionType === 'multiplayer' ? contextMenu.user.roomName : 'Local'
        });
      }
      console.log(`✅ Friend action performed for ${contextMenu.user.characterName}`);
    }
    closeContextMenu();
  };

  const handleRemoveFriend = () => {
    if (contextMenu?.user) {
      const targetUserId = contextMenu.user.userId || contextMenu.user.id || contextMenu.user.uid;
      const friend = friends.find(f => f.id === targetUserId);
      if (friend) {
        setPendingRemoveFriend(friend);
      }
    }
    closeContextMenu();
  };

  const handleIgnoreUser = () => {
    if (contextMenu?.user) {
      addIgnored(contextMenu.user);
      console.log(`✅ Ignored user: ${contextMenu.user.characterName || contextMenu.user.name}`);
    }
    closeContextMenu();
  };

  const handleAddFriendById = async () => {
    setFriendIdError('');

    if (!friendIdInput.trim()) {
      setFriendIdError('Please enter a Friend ID');
      return;
    }

    try {
      // Strip # if present
      const cleanFriendId = friendIdInput.trim().startsWith('#')
        ? friendIdInput.trim().substring(1)
        : friendIdInput.trim();

      // Find user by Friend ID
      const foundUser = await authService.findUserByFriendId(cleanFriendId);

      if (!foundUser) {
        setFriendIdError('No user found with this Friend ID');
        return;
      }

      // Check if trying to add yourself
      const currentUserFriendId = user?.friendId || (currentUserPresence?.friendId);
      if (foundUser.id === currentUserPresence?.userId || (currentUserFriendId && currentUserFriendId.toLowerCase() === cleanFriendId.toLowerCase())) {
        setFriendIdError('You cannot add yourself');
        return;
      }

      // Check if already friends
      const alreadyFriend = (friends || []).some(f =>
        f.friendId === foundUser.friendId || f.id === foundUser.id
      );
      if (alreadyFriend) {
        setFriendIdError('This user is already in your friends list');
        return;
      }

      // Send friend request instead of adding directly
      const result = await sendFriendRequest(foundUser.friendId);

      if (result && !result.success) {
        setFriendIdError(result.error || 'Failed to send friend request');
        return;
      }

      console.log(`✅ Friend request sent to ${foundUser.displayName} (${foundUser.friendId})`);

      console.log(`✅ Added ${foundUser.displayName} (${foundUser.friendId}) as friend`);

      // Close popup and reset
      setShowAddFriendPopup(false);
      setFriendIdInput('');
      setFriendIdError('');
    } catch (error) {
      console.error('Error adding friend by ID:', error);
      setFriendIdError('Failed to add friend. Please try again.');
    }
  };

  const handleCreateParty = () => {
    setShowCreatePartyDialog(true);
    closeContextMenu();
  };

  const handleRemoveFromParty = () => {
    if (contextMenu?.user) {
      const targetUserId = contextMenu.user.userId || contextMenu.user.id || contextMenu.user.uid;
      // Find party member ONLY by userId
      const member = partyMembers.find(m =>
        m.id === targetUserId || m.userId === targetUserId
      );

      if (member) {
        removePartyMember(member.id);
        console.log(`✅ Removed ${userName} from party`);
      }
    }
    closeContextMenu();
  };

  // Handle add/edit note
  const handleAddNote = () => {
    if (contextMenu?.user) {
      const targetUserId = contextMenu.user.userId || contextMenu.user.id || contextMenu.user.uid;

      // Determine if this is a friend or ignored user by ID
      const friend = friends.find(f => f.id === targetUserId);
      const ignoredUser = ignored.find(i => i.id === targetUserId);

      if (friend) {
        setNoteText(friend.note || '');
        setNoteUserId(friend.id);
        setNoteUserType('friend');
        setShowNoteDialog(true);
      } else if (ignoredUser) {
        setNoteText(ignoredUser.note || '');
        setNoteUserId(ignoredUser.id);
        setNoteUserType('ignored');
        setShowNoteDialog(true);
      }
    }
    closeContextMenu();
  };

  // Handle note submit
  const handleNoteSubmit = () => {
    if (noteUserId && noteUserType) {
      if (noteUserType === 'friend') {
        setFriendNote(noteUserId, noteText);
      } else if (noteUserType === 'ignored') {
        setIgnoredNote(noteUserId, noteText);
      }
      setShowNoteDialog(false);
      setNoteUserId(null);
      setNoteUserType(null);
      setNoteText('');
    }
  };

  // Check if current user is GM with active room
  const isGMWithRoom = currentUserPresence?.sessionType === 'multiplayer';

  // Check if the context menu user is in the party
  const isUserInParty = contextMenu?.user ? partyMembers.some(m =>
    m.id === contextMenu.user.userId ||
    m.userId === contextMenu.user.userId ||
    m.id === contextMenu.user.id ||
    m.userId === contextMenu.user.id
  ) : false;

  const isContextMenuUserSelf = contextMenu?.user ? (
    contextMenu.user.userId === currentUserPresence?.userId ||
    contextMenu.user.uid === currentUserPresence?.userId ||
    contextMenu.user.id === currentUserPresence?.userId ||
    contextMenu.user.userId === 'current-player' ||
    contextMenu.user.id === 'current-player' ||
    contextMenu.user.isSelf === true
  ) : false;

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      case 'busy': return '🔴';
      case 'offline': return '⚪'; // White for appear offline
      default: return '⚪';
    }
  };


  // Load status comment from current user presence
  useEffect(() => {
    if (currentUserPresence?.statusComment) {
      setStatusComment(currentUserPresence.statusComment);
      setStatusCommentDraft(currentUserPresence.statusComment);
    }
  }, [currentUserPresence?.statusComment]);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    console.log('🔄 Changing status to:', newStatus);
    console.log('📝 Current status:', currentUserPresence?.status);
    console.log('💬 Status comment draft:', statusCommentDraft);

    const result = await updateStatus(newStatus, null); // Don't update comment when changing status
    console.log('✅ Status update result:', result);

    setShowStatusMenu(false);
  };

  // Handle status comment save
  const handleSaveStatusComment = async () => {
    await updateStatus(currentUserPresence?.status || 'online', statusCommentDraft);
    setStatusComment(statusCommentDraft);
  };

  // Get session display
  const getSessionDisplay = (user) => {
    if (!user) return null;

    // Check if user is offline
    if (user.status === 'offline') {
      return (
        <div className="session-info offline">
          <i className="fas fa-minus-circle"></i>
          <span>Offline</span>
        </div>
      );
    }

    if (user.sessionType === 'local') {
      return (
        <div className="session-info local">
          <i className="fas fa-map"></i>
          <span>Local Session</span>
        </div>
      );
    } else if (user.sessionType === 'multiplayer') {
      const participantCount = user.roomParticipants?.length || 0;
      return (
        <div className="session-info multiplayer">
          <i className="fas fa-users"></i>
          <span>{user.roomName || 'Multiplayer'}</span>
          {participantCount > 0 && (
            <span className="participant-count">({participantCount})</span>
          )}
        </div>
      );
    } else if (user.partyId) {
      return (
        <div className="session-info party">
          <i className="fas fa-user-friends"></i>
          <span>In Party: {user.partyName || 'Active'}</span>
        </div>
      );
    }

    // Online but no active session - don't show idle, just don't show session info
    return null;
  };


  // Handle clicks outside status menu to close it
  const handleOutsideClick = (e) => {
    // Close context menu
    closeContextMenu(e);
  };

  return (
    <div className="online-users-list" onClick={handleOutsideClick}>
      {/* Header with Tabs */}
      <div className="users-list-header">

        <div className="users-tabs">
          <button
            className={`users-tab ${activeTab === 'online' ? 'active' : ''}`}
            onClick={() => setActiveTab('online')}
            title="Online Users"
          >
            <i className="fas fa-globe"></i>
            {onlineUsers.length > 0 && <span className="tab-count">{onlineUsers.length}</span>}
          </button>
          {!user?.isGuest && (
            <button
              className={`users-tab ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
              title="Friends"
            >
              <i className="fas fa-user-friends"></i>
              {filteredFriends.length > 0 && <span className="tab-count">{filteredFriends.length}</span>}
            </button>
          )}
          {!user?.isGuest && (
            <button
              className={`users-tab ${activeTab === 'ignored' ? 'active' : ''}`}
              onClick={() => setActiveTab('ignored')}
              title="Ignored Users"
            >
              <i className="fas fa-user-slash"></i>
              {ignored.length > 0 && <span className="tab-count">{ignored.length}</span>}
            </button>
          )}
          <button
            className={`users-tab ${activeTab === 'party' ? 'active' : ''}`}
            onClick={() => setActiveTab('party')}
            title="Party Members"
          >
            <i className="fas fa-users"></i>
            {isInParty && partyMembers.length > 0 && <span className="tab-count">{partyMembers.length}</span>}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="users-search">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* Users List */}
      <div className="users-list-content">
        {/* Online Users Tab */}
        {activeTab === 'online' && (
          <div className="users-section">
            {filteredUsers.length === 0 ? (
              <div className="no-users">
                {searchTerm ? (
                  <>
                    <i className="fas fa-search"></i>
                    <p>No users found matching "{searchTerm}"</p>
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-slash"></i>
                    <p>No users online</p>
                  </>
                )}
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isCurrentUser = user.userId === currentUserPresence?.userId;

                // Check if user is a friend or ignored
                const isIgnored = (ignored || []).some(i => i.id === user.userId);
                const isFriend = (friends || []).some(f => f.id === user.userId);

                // ONLY use characterStore values for the local user's own card.
                // For other users, use the presence data directly.
                const userData = {
                  ...user,
                  characterName: isCurrentUser ? (characterName || user.characterName) : (user.characterName || ''),
                  name: user.name, // The account name
                  level: isCurrentUser ? (characterLevel || user.level) : user.level,
                  class: isCurrentUser ? (characterClass || user.class) : user.class,
                  background: isCurrentUser ? (characterBackground || user.background) : user.background,
                  backgroundDisplayName: isCurrentUser ? (characterBackgroundDisplayName || user.backgroundDisplayName) : user.backgroundDisplayName,
                  race: isCurrentUser ? (characterRace || user.race) : user.race,
                  subrace: isCurrentUser ? (characterSubrace || user.subrace) : user.subrace,
                  raceDisplayName: isCurrentUser ? (characterRaceDisplayName || user.raceDisplayName) : user.raceDisplayName,
                  isFriend,
                  isIgnored
                };

                return (
                  <UserCard
                    key={user.userId}
                    user={isCurrentUser ? { ...userData, isFriend: false, isIgnored: false } : userData}
                    nameFormat="global"
                    isCurrentUser={isCurrentUser}
                    showYouBadge={isCurrentUser}
                    showSessionInfo={true}
                    sessionDisplay={getSessionDisplay(user)}
                    onClick={() => onUserClick?.(user)}
                    onContextMenu={(e) => handleContextMenu(e, user)}
                  />
                );
              })
            )}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="users-section friends-section">


            {filteredFriends.length === 0 ? (
              <div className="no-users">
                <i className="fas fa-user-friends"></i>
                <p>No friends added yet</p>
                <p className="hint">Add friends by their Friend ID or right-click online users</p>
              </div>
            ) : (
              filteredFriends.map((friend) => {
                const onlineUser = activeOnlineUsers.find(u =>
                  u.userId === friend.id
                );
                const friendPres = friendPresence[friend.id];
                const isOffline = !onlineUser && !friendPres;

                const friendData = onlineUser
                  ? { ...onlineUser, friendId: friend.friendId, userId: onlineUser.userId || friend.id, isFriend: true }
                  : friendPres
                    ? { ...friend, ...friendPres, friendId: friend.friendId, userId: friend.id, isFriend: true }
                    : { ...friend, status: 'offline', userId: friend.id, isFriend: true };

                return (
                  <UserCard
                    key={friend.id || friend.name}
                    user={friendData}
                    nameFormat="global"
                    className="friend-card"
                    showSessionInfo={!!(onlineUser || friendPres || isOffline)}
                    sessionDisplay={getSessionDisplay(onlineUser || friendPres || (isOffline ? { status: 'offline' } : null))}
                    showFriendId={true}
                    onContextMenu={(e) => handleContextMenu(e, friendData)}
                    additionalContent={
                      friend.note && (
                        <div className="friend-note-display">
                          <i className="fas fa-sticky-note"></i>
                          <span>{friend.note}</span>
                        </div>
                      )
                    }
                  />
                );
              })
            )}
          </div>
        )}

        {/* Ignored Tab */}
        {activeTab === 'ignored' && (
          <div className="users-section ignored-section">
            {ignored.length === 0 ? (
              <div className="no-users">
                <i className="fas fa-user-slash"></i>
                <p>No ignored users</p>
                <p className="hint">Right-click users to ignore them</p>
              </div>
            ) : (
              ignored.map((ignoredUser) => {
                // Find the ignored user in online users to get current status
                const onlineUser = onlineUsers.find(u => u.userId === ignoredUser.id);
                const userData = {
                  ...(onlineUser || ignoredUser),
                  isIgnored: true
                };

                return (
                  <UserCard
                    key={ignoredUser.id}
                    user={userData}
                    nameFormat="global"
                    className="ignored-card"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const menuWidth = 200;
                      const menuHeight = 100;
                      let x = e.clientX;
                      let y = e.clientY;
                      if (x + menuWidth > window.innerWidth) {
                        x = window.innerWidth - menuWidth - 10;
                      }
                      if (y + menuHeight > window.innerHeight) {
                        y = window.innerHeight - menuHeight - 10;
                      }
                      setContextMenu({
                        x,
                        y,
                        user: {
                          ...userData,
                          id: ignoredUser.id, // Use the ignored user's ID for removal
                          name: ignoredUser.name
                        },
                        isIgnored: true
                      });
                    }}
                    additionalContent={
                      ignoredUser.note && (
                        <div className="ignored-note">
                          <i className="fas fa-sticky-note"></i>
                          <span>{ignoredUser.note}</span>
                        </div>
                      )
                    }
                  />
                );
              })
            )}
          </div>
        )}

        {/* Party Tab */}
        {activeTab === 'party' && (
          <div className="users-section party-section">
            {!currentParty?.id ? (
              <div className="no-users">
                <i className="fas fa-users"></i>
                <p>No party</p>
                <p className="hint">Right-click a friend or online user to invite them to a party.</p>
              </div>
            ) : (
              partyMembers.map((member) => {
                const isLeader = member.id === usePartyStore.getState().leaderId || member.isGM || member.isLeader;
                const isCurrentPlayer = member.id === 'current-player' ||
                  member.id === currentUserPresence?.userId ||
                  member.userId === currentUserPresence?.userId ||
                  member.uid === currentUserPresence?.userId;

                const userCardData = {
                  ...member,
                  characterName: member.name,
                  level: member.characterLevel || member.level,
                  class: member.characterClass || member.class,
                  status: member.status || 'online'
                };

                return (
                  <UserCard
                    key={member.id}
                    user={userCardData}
                    nameFormat="party"
                    isCurrentUser={isCurrentPlayer}
                    isLeader={isLeader}
                    showLeaderCrown={true}
                    showYouBadge={true}
                    className="party-member-card"
                    onContextMenu={(e) => handleContextMenu(e, {
                      ...member,
                      userId: member.userId || member.id,
                      isSelf: isCurrentPlayer
                    })}
                  />
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Add Friend by ID Popup */}
      {showAddFriendPopup && createPortal(
        <div className="social-modal-overlay" onClick={() => setShowAddFriendPopup(false)}>
          <div
            className="social-modal-content add-friend-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: `scale(${windowScale})` }}
          >
            <div className="modal-header">
              <h3>Add Friend by ID</h3>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowAddFriendPopup(false);
                  setFriendIdInput('');
                  setFriendIdError('');
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                Enter your friend's unique Friend ID to add them to your friends list.
              </p>

              <div className="friend-id-input-group">
                <label htmlFor="friendIdInput">Friend ID</label>
                <div className="friend-id-input-wrapper">
                  <span className="friend-id-prefix">#</span>
                  <input
                    id="friendIdInput"
                    type="text"
                    value={friendIdInput}
                    onChange={(e) => {
                      setFriendIdInput(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                      setFriendIdError('');
                    }}
                    placeholder="e.g., WillburtTheGoat4"
                    maxLength={20}
                    className="friend-id-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddFriendById();
                      }
                    }}
                  />
                </div>
                {friendIdError && (
                  <span className="error-text">{friendIdError}</span>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn modal-btn-primary"
                onClick={handleAddFriendById}
                disabled={!friendIdInput.trim()}
              >
                <i className="fas fa-user-plus"></i>
                Add Friend
              </button>
              <button
                className="modal-btn modal-btn-secondary"
                onClick={() => {
                  setShowAddFriendPopup(false);
                  setFriendIdInput('');
                  setFriendIdError('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
      }

      {/* Party Creation Dialog */}
      {
        showCreatePartyDialog && createPortal(
          <PartyCreationDialog
            isOpen={showCreatePartyDialog}
            onClose={() => setShowCreatePartyDialog(false)}
          />,
          document.body
        )
      }

      {/* Note Dialog */}
      {
        showNoteDialog && createPortal(
          <div className="social-modal-overlay">
            <div
              className="social-modal-content note-modal"
              style={{ transform: `scale(${windowScale})` }}
            >
              <h3>Set Note</h3>
              <div className="social-modal-form">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter note"
                />
              </div>
              <div className="modal-actions">
                <button
                  className="social-button"
                  onClick={handleNoteSubmit}
                >
                  Save
                </button>
                <button
                  className="social-button"
                  onClick={() => {
                    setShowNoteDialog(false);
                    setNoteUserId(null);
                    setNoteUserType(null);
                    setNoteText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      }

      {/* Context Menu - Rendered via Portal */}
      {
        contextMenu && createPortal(
          <div
            className="user-context-menu"
            style={{
              position: 'fixed',
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
              zIndex: 9999999
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="context-menu-header">
              {contextMenu.user?.characterName || contextMenu.user?.displayName || 'User'}
            </div>
            {/* Content for current user vs others */}
            {(() => {
              const targetUserId = contextMenu.user.userId || contextMenu.user.uid || contextMenu.user.id;
              const isContextMenuUserSelf = currentUserPresence?.userId === targetUserId ||
                targetUserId === 'current-player' ||
                contextMenu.user.isSelf === true;

              if (contextMenu.isIgnored) {
                return (
                  <>
                    <button className="context-menu-item" onClick={handleAddNote}>
                      <i className="fas fa-sticky-note"></i>
                      Add/Edit Note
                    </button>
                    <button
                      className="context-menu-item danger"
                      onClick={() => {
                        if (contextMenu.user.id) {
                          removeIgnored(contextMenu.user.id);
                        }
                        closeContextMenu();
                      }}
                    >
                      <i className="fas fa-user-check"></i>
                      Unignore
                    </button>
                    <div className="context-menu-divider"></div>
                    <button className="context-menu-item" onClick={closeContextMenu}>
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  </>
                );
              }

              if (isContextMenuUserSelf) {
                return (
                  <>
                    {/* Status Comment Section */}
                    <div className="user-menu-body">
                      <div className="user-menu-section">
                        <label className="user-menu-label">
                          <i className="fas fa-feather-alt"></i>
                          Current Status Comment
                        </label>
                        <div className="user-menu-input-row">
                          <input
                            type="text"
                            className="user-menu-input"
                            placeholder="Looking For Campaign"
                            value={statusCommentDraft}
                            onChange={(e) => setStatusCommentDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveStatusComment();
                                closeContextMenu();
                              }
                            }}
                            maxLength={100}
                          />
                          <button className="user-menu-save-btn" onClick={handleSaveStatusComment}>
                            <i className="fas fa-check"></i>
                          </button>
                        </div>
                        <div className="char-count-display">{statusCommentDraft.length}/100</div>
                      </div>

                      <div className="user-menu-divider"></div>

                      {/* Presence/Status Bar */}
                      <div className="user-menu-section">
                        <label className="user-menu-label">
                          <i className="fas fa-sun"></i>
                          Set Presence
                        </label>
                        <div className="presence-buttons-row">
                          <button
                            className={`presence-toggle online ${currentUserPresence?.status === 'online' ? 'active' : ''}`}
                            onClick={() => { handleStatusChange('online'); closeContextMenu(); }}
                          >
                            <span className="dot"></span> Online
                          </button>
                          <button
                            className={`presence-toggle away ${currentUserPresence?.status === 'away' ? 'active' : ''}`}
                            onClick={() => { handleStatusChange('away'); closeContextMenu(); }}
                          >
                            <span className="dot"></span> Away
                          </button>
                          <button
                            className={`presence-toggle busy ${currentUserPresence?.status === 'busy' ? 'active' : ''}`}
                            onClick={() => { handleStatusChange('busy'); closeContextMenu(); }}
                          >
                            <span className="dot"></span> Busy
                          </button>
                          <button
                            className={`presence-toggle offline ${currentUserPresence?.status === 'offline' ? 'active' : ''}`}
                            onClick={() => { handleStatusChange('offline'); closeContextMenu(); }}
                          >
                            <span className="dot"></span> Invisible
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="user-menu-footer">
                      {isInParty && (
                        <button
                          className="user-footer-action danger"
                          onClick={() => {
                            if (isLeader) handleDisbandParty();
                            else handleLeaveParty();
                          }}
                        >
                          <i className={`fas fa-${isLeader ? 'trash-alt' : 'sign-out-alt'}`}></i>
                          {isLeader ? 'Disband' : 'Leave Party'}
                        </button>
                      )}
                      <button className="user-footer-action" onClick={closeContextMenu}>
                        <i className="fas fa-times"></i>
                        Dismiss
                      </button>
                    </div>
                  </>
                );
              }

              // Other users menu
              return (
                <>
                  <button className="context-menu-item" onClick={handleWhisper}>
                    <i className="fas fa-comment"></i>
                    Whisper
                  </button>

                  {partyMembers.some(m => m.id === targetUserId || m.userId === targetUserId) ? (
                    <>
                      {isLeader && !isContextMenuUserSelf && (
                        <>
                          <button className="context-menu-item" onClick={handlePromoteMember}>
                            <i className="fas fa-crown"></i>
                            Promote
                          </button>
                          <button className="context-menu-item danger" onClick={handleRemovePartyMember}>
                            <i className="fas fa-user-times"></i>
                            Kicked
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <button
                      className="context-menu-item"
                      onClick={handleInviteToParty}
                      disabled={!!contextMenu.user.partyId}
                    >
                      <i className="fas fa-users"></i>
                      Invite to Party
                    </button>
                  )}

                  {contextMenu.user.sessionType === 'multiplayer' && contextMenu.user.roomId && (
                    <button
                      className="context-menu-item"
                      onClick={handleJoinRoom}
                    >
                      <i className="fas fa-door-open"></i>
                      Join Room
                    </button>
                  )}

                  {!user?.isGuest && !contextMenu.user.isGuest && (
                    contextMenu.isFriend ? (
                      <button className="context-menu-item" onClick={handleRemoveFriend}>
                        <i className="fas fa-user-minus"></i>
                        Remove Friend
                      </button>
                    ) : (
                      <button className="context-menu-item" onClick={handleAddFriend}>
                        <i className="fas fa-user-plus"></i>
                        Add Friend
                      </button>
                    )
                  )}

                  {!user?.isGuest && !contextMenu.user.isGuest && (
                    contextMenu.isIgnored ? (
                      <button className="context-menu-item" onClick={() => {
                        const targetId = contextMenu.user.id || contextMenu.user.userId || contextMenu.user.uid;
                        if (targetId) removeIgnored(targetId);
                        closeContextMenu();
                      }}>
                        <i className="fas fa-user-check"></i>
                        Unignore
                      </button>
                    ) : (
                      <button className="context-menu-item danger" onClick={handleIgnoreUser}>
                        <i className="fas fa-ban"></i>
                        Ignore
                      </button>
                    )
                  )}
                  
                  <div className="context-menu-divider"></div>
                  <button className="context-menu-item" onClick={closeContextMenu}>
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </>
              );
            })()}
          </div>,
          document.body
        )
      }

      {
        pendingRemoveFriend && createPortal(
          <ConfirmationDialog
            message={`Remove "${pendingRemoveFriend.name}" from your friends list?`}
            onConfirm={() => {
              removeFriend(pendingRemoveFriend.id);
              setPendingRemoveFriend(null);
            }}
            onCancel={() => setPendingRemoveFriend(null)}
          />,
          document.body
        )
      }
    </div >
  );
};

export default OnlineUsersList;
