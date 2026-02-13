/**
 * Online Users List Component
 * 
 * Displays all currently online users with their character details and session status.
 * Includes search/filter functionality and context menu for actions.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import usePresenceStore from '../../store/presenceStore';
import useAuthStore from '../../store/authStore';
import usePartyStore from '../../store/partyStore';
import PartyPanel from './PartyPanel';
import useSocialStore from '../../store/socialStore';
import useCharacterStore from '../../store/characterStore';
import authService from '../../services/authService';
import useSettingsStore from '../../store/settingsStore';
import PartyCreationDialog from './PartyCreationDialog';
import UserCard from './UserCard';
import '../../styles/social-window.css';

const OnlineUsersList = ({ onUserClick, onWhisper, onInviteToRoom }) => {
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

  const onlineUsers = usePresenceStore((state) => state.getOnlineUsersArray());
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const updateStatus = usePresenceStore((state) => state.updateStatus);
  const { user } = useAuthStore();
  const { isInParty, addPartyMember, createParty, partyMembers, removePartyMember, leaveParty, sendPartyMessage, partyChatMessages, joinParty, inviteToParty } = usePartyStore();
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

  // Filter out current user from friends list
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    return friends.filter(friend => {
      // Exclude current user by character name
      if (friend.name === currentUserPresence?.characterName) return false;
      return true;
    });
  }, [friends, currentUserPresence]);

  // Filter out offline users from the global list
  const activeOnlineUsers = useMemo(() => {
    return onlineUsers.filter(u => u.status !== 'offline');
  }, [onlineUsers]);

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

    setContextMenu({
      x,
      y,
      user: targetUser
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

  const handleLeaveParty = () => {
    leaveParty();
    closeContextMenu();
  };

  const handlePromoteMember = () => {
    const member = partyMembers.find(m => m.id === contextMenu.user.userId);
    if (member) {
      console.log('👑 Promoting member to leader:', contextMenu.user.name);
      // TODO: Implement promotion logic when we have party roles
    }
    closeContextMenu();
  };

  const handleRemovePartyMember = () => {
    const member = partyMembers.find(m => m.id === contextMenu.user.userId);
    if (member) {
      console.log('🗑️ Removing party member:', contextMenu.user.name);
      // TODO: Implement removal logic when we have party roles
    }
    closeContextMenu();
  };

  const handleDisbandParty = () => {
    const partyId = getCurrentPartyId();
    if (partyId) {
      console.log('💥 Disbanding party:', partyId);
      // TODO: Implement disband logic in partyStore
    }
    closeContextMenu();
  };

  const handleInviteToParty = async () => {
    const sendPartyInvite = usePresenceStore.getState().sendPartyInvite;
    const currentUserPresence = usePresenceStore.getState().currentUserPresence;

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

    // Get friend presence - try multiple ID fields
    const friendPres = friendPresence[targetUserId] || friendPresence[contextMenu.user.id];

    // Check if user is online (include 'idle' as a valid online status)
    const isUserOnline = onlineUser || (friendPres && ['online', 'away', 'busy', 'idle'].includes(friendPres.status));

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
      // If not in party, create one first and wait for it
      if (!isInParty) {
        const currentPlayerName = currentUserPresence?.characterName || currentUserPresence?.accountName || 'Unknown';

        await createParty(`${currentPlayerName}'s Party`, false, {
          name: currentPlayerName,
          characterName: currentPlayerName,
          characterClass: currentUserPresence?.class || 'Unknown',
          characterLevel: currentUserPresence?.level || 1
        });

        console.log('🎉 Party created for invitation');
      }

      // Now send the invitation using the correct user ID
      const inviteTargetId = targetUser.userId || targetUser.id || targetUserId;
      sendPartyInvite(inviteTargetId, targetUser.characterName || targetUser.name);
      console.log('✅ Sent party invitation to:', targetUser.characterName || targetUser.name, 'ID:', inviteTargetId);
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
      // Find friend by name
      const friend = friends.find(f => f.name === contextMenu.user.characterName || f.name === contextMenu.user.name);
      if (friend) {
        removeFriend(friend.id);
        console.log(`✅ Removed ${friend.name} from friends`);
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
      const userName = contextMenu.user.characterName || contextMenu.user.name;
      // Find party member by userId or name
      const member = partyMembers.find(m =>
        m.id === contextMenu.user.userId || m.name === userName
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
      const userName = contextMenu.user.characterName || contextMenu.user.name;

      // Determine if this is a friend or ignored user
      const friend = friends.find(f => f.name === userName);
      const ignoredUser = ignored.find(i => i.name === userName);

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
    m.id === contextMenu.user.userId || m.name === (contextMenu.user.characterName || contextMenu.user.name)
  ) : false;

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      case 'busy': return '🔴';
      case 'idle': return '⚪'; // Grey for idle
      case 'offline': return '⚫'; // White/grey for appear offline
      default: return '⚪';
    }
  };

  // Debug: Log when currentUserPresence changes
  useEffect(() => {
    console.log('🔍 OnlineUsersList - currentUserPresence changed:', {
      userId: currentUserPresence?.userId,
      status: currentUserPresence?.status,
      statusComment: currentUserPresence?.statusComment,
      lastUpdated: currentUserPresence?.lastUpdated
    });
  }, [currentUserPresence]);

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
    }
    return (
      <div className="session-info idle">
        <i className="fas fa-circle"></i>
        <span>Idle</span>
      </div>
    );
  };

  // Get party leader (first member with isGM: true, or first member if none)
  const getPartyLeader = () => {
    if (!partyMembers || partyMembers.length === 0) return null;
    const gmMember = partyMembers.find(m => m.isGM);
    return gmMember || partyMembers[0];
  };

  const partyLeader = getPartyLeader();

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
          <button
            className={`users-tab ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
            title="Friends"
          >
            <i className="fas fa-user-friends"></i>
            {filteredFriends.length > 0 && <span className="tab-count">{filteredFriends.length}</span>}
          </button>
          <button
            className={`users-tab ${activeTab === 'ignored' ? 'active' : ''}`}
            onClick={() => setActiveTab('ignored')}
            title="Ignored Users"
          >
            <i className="fas fa-user-slash"></i>
            {ignored.length > 0 && <span className="tab-count">{ignored.length}</span>}
          </button>
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

                // For current user, merge character store data with online user data
                const userData = isCurrentUser ? {
                  ...user,
                  characterName: characterName || user.characterName || user.name,
                  name: characterName || user.name,
                  level: characterLevel || user.level || 1,
                  class: characterClass || user.class || 'Unknown',
                  background: characterBackground || user.background,
                  backgroundDisplayName: characterBackgroundDisplayName || user.backgroundDisplayName,
                  path: characterPath || user.path,
                  pathDisplayName: characterPathDisplayName || user.pathDisplayName,
                  race: characterRace || user.race,
                  subrace: characterSubrace || user.subrace,
                  raceDisplayName: characterRaceDisplayName || user.raceDisplayName
                } : user;

                return (
                  <UserCard
                    key={user.userId}
                    user={userData}
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
            {/* Quick Actions: Create Party */}
            <div className="friends-quick-actions">
              <button
                className="create-party-btn"
                onClick={handleCreateParty}
                title="Create a new party"
              >
                <i className="fas fa-users"></i>
                Create Party
              </button>
            </div>

            {filteredFriends.length === 0 ? (
              <div className="no-users">
                <i className="fas fa-user-friends"></i>
                <p>No friends added yet</p>
                <p className="hint">Add friends by their Friend ID or right-click online users</p>
              </div>
            ) : (
              <div className="friends-list">
                {filteredFriends.map((friend) => {
                  const onlineUser = onlineUsers.find(u => u.userId === friend.id || u.characterName === friend.name);
                  const friendPres = friendPresence[friend.id];
                  const friendData = onlineUser
                    ? { ...onlineUser, friendId: friend.friendId, userId: onlineUser.userId || friend.id }
                    : friendPres
                      ? { ...friend, ...friendPres, friendId: friend.friendId, userId: friend.id }
                      : { ...friend, status: 'offline', userId: friend.id };

                  return (
                    <UserCard
                      key={friend.id || friend.name}
                      user={friendData}
                      nameFormat="global"
                      className="friend-card"
                      showSessionInfo={!!(onlineUser || friendPres)}
                      sessionDisplay={(onlineUser || friendPres) ? getSessionDisplay(onlineUser || friendPres) : null}
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
                })}
              </div>
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
              <div className="ignored-list">
                {ignored.map((ignoredUser) => {
                  // Find the ignored user in online users to get current status
                  const onlineUser = onlineUsers.find(u => u.characterName === ignoredUser.name);
                  const userData = onlineUser || ignoredUser;

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
                })}
              </div>
            )}
          </div>
        )}

        {/* Party Tab */}
        {activeTab === 'party' && (
          <div className="users-section party-section">
            <PartyPanel onCreateParty={handleCreateParty} />
          </div>
        )}
      </div>

      {/* Add Friend by ID Popup */}
      {
        showAddFriendPopup && createPortal(
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
              {contextMenu.user.characterName || contextMenu.user.name}
            </div>

            {/* Show Unignore option for ignored users, otherwise show normal options */}
            {contextMenu.isIgnored ? (
              <>
                <button
                  className="context-menu-item"
                  onClick={handleAddNote}
                >
                  <i className="fas fa-sticky-note"></i>
                  Add/Edit Note
                </button>
                <button
                  className="context-menu-item"
                  onClick={() => {
                    console.log('🔍 Attempting to unignore:', contextMenu.user);
                    console.log('📋 Current ignored list:', ignored);

                    if (contextMenu.user.id) {
                      removeIgnored(contextMenu.user.id);
                      console.log(`✅ Unignored ${contextMenu.user.name} (ID: ${contextMenu.user.id})`);

                      // Verify removal
                      setTimeout(() => {
                        const updatedIgnored = useSocialStore.getState().ignored;
                        console.log('📋 Updated ignored list:', updatedIgnored);
                      }, 100);
                    } else {
                      console.error('❌ No ID found for user:', contextMenu.user);
                    }
                    closeContextMenu();
                  }}
                >
                  <i className="fas fa-user-check"></i>
                  Unignore
                </button>
              </>
            ) : (currentUserPresence?.userId && contextMenu.user.userId === currentUserPresence.userId) ||
              (currentUserPresence?.userId && contextMenu.user.uid === currentUserPresence.userId) ? (
              <>
                {/* Status Change Options for Current User */}
                <div className="context-menu-section">
                  <div className="context-menu-section-header">Change Status</div>
                  <button
                    className="context-menu-item"
                    onClick={() => {
                      handleStatusChange('online');
                      closeContextMenu();
                    }}
                  >
                    <span className="status-icon">🟢</span>
                    Online
                  </button>
                  <button
                    className="context-menu-item"
                    onClick={() => {
                      handleStatusChange('away');
                      closeContextMenu();
                    }}
                  >
                    <span className="status-icon">🟡</span>
                    Away
                  </button>
                  <button
                    className="context-menu-item"
                    onClick={() => {
                      handleStatusChange('busy');
                      closeContextMenu();
                    }}
                  >
                    <span className="status-icon">🔴</span>
                    Busy
                  </button>
                  <button
                    className="context-menu-item"
                    onClick={() => {
                      handleStatusChange('offline');
                      closeContextMenu();
                    }}
                  >
                    <span className="status-icon">⚫</span>
                    Appear Offline
                  </button>
                </div>

                {/* Status Comment Section */}
                <div className="context-menu-section">
                  <div className="context-menu-section-header">Status Comment</div>
                  <input
                    type="text"
                    className="context-menu-input"
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
                  <div className="status-comment-footer">
                    <small>{statusCommentDraft.length}/100</small>
                    <button
                      className="save-comment-btn"
                      onClick={() => {
                        handleSaveStatusComment();
                        closeContextMenu();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  className="context-menu-item"
                  onClick={handleWhisper}
                >
                  <i className="fas fa-comment"></i>
                  Whisper
                </button>

                {/* Show different party options based on whether user is in party */}
                {isUserInParty ? (
                  <button
                    className="context-menu-item danger"
                    onClick={handleRemoveFromParty}
                  >
                    <i className="fas fa-user-times"></i>
                    Remove from Party
                  </button>
                ) : (
                  <button
                    className="context-menu-item"
                    onClick={handleInviteToParty}
                  >
                    <i className="fas fa-users"></i>
                    Invite to Party
                  </button>
                )}

                {/* Show different options based on whether user is a friend */}
                {activeTab === 'friends' ? (
                  <>
                    <button
                      className="context-menu-item"
                      onClick={handleAddNote}
                    >
                      <i className="fas fa-sticky-note"></i>
                      Add/Edit Note
                    </button>
                    <button
                      className="context-menu-item danger"
                      onClick={handleRemoveFriend}
                    >
                      <i className="fas fa-user-minus"></i>
                      Remove Friend
                    </button>
                  </>
                ) : (
                  <button
                    className="context-menu-item"
                    onClick={handleAddFriend}
                  >
                    <i className="fas fa-user-plus"></i>
                    Add Friend
                  </button>
                )}

                <button
                  className="context-menu-item danger"
                  onClick={handleIgnoreUser}
                >
                  <i className="fas fa-ban"></i>
                  Ignore
                </button>
              </>
            )}
            <div className="context-menu-divider"></div>

            <button className="context-menu-item" onClick={closeContextMenu}>
              <i className="fas fa-times"></i>
              Cancel
            </button>
          </div>,
          document.body
        )
      }
    </div >
  );
};

export default OnlineUsersList;
