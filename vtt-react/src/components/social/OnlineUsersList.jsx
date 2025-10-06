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
import useSocialStore from '../../store/socialStore';
import useCharacterStore from '../../store/characterStore';
import mockPresenceService from '../../services/mockPresenceService';
import authService from '../../services/authService';
import UserCard from './UserCard';

const OnlineUsersList = ({ onUserClick, onWhisper, onInviteToRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('online'); // 'online', 'friends', 'ignored', or 'party'
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [statusComment, setStatusComment] = useState('');
  const [statusCommentDraft, setStatusCommentDraft] = useState('');
  const [showAddFriendPopup, setShowAddFriendPopup] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState('');
  const [friendIdError, setFriendIdError] = useState('');

  const onlineUsers = usePresenceStore((state) => state.getOnlineUsersArray());
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const updateStatus = usePresenceStore((state) => state.updateStatus);
  const { user } = useAuthStore();
  const { isInParty, addPartyMember, createParty, partyMembers, removePartyMember } = usePartyStore();
  const { friends, addFriend, removeFriend, addIgnored, ignored, removeIgnored, migrateFriends } = useSocialStore();

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

  // Start party chat simulation when party members change
  useEffect(() => {
    if (isInParty && partyMembers && partyMembers.length > 1) {
      const addPartyChatMessage = usePresenceStore.getState().addPartyChatMessage;
      mockPresenceService.startPartyChatSimulation(partyMembers, addPartyChatMessage);
      console.log('🎉 Started party chat simulation');
    } else {
      mockPresenceService.stopPartyChatSimulation();
    }

    // Cleanup on unmount
    return () => {
      mockPresenceService.stopPartyChatSimulation();
    };
  }, [isInParty, partyMembers]);

  // Filter out current user from friends list
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    return friends.filter(friend => {
      // Exclude current user by character name
      if (friend.name === currentUserPresence?.characterName) return false;
      // Exclude "Yad" (test user)
      if (friend.name === 'Yad') return false;
      return true;
    });
  }, [friends, currentUserPresence]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return onlineUsers;
    
    const term = searchTerm.toLowerCase();
    return onlineUsers.filter(u => 
      u.characterName?.toLowerCase().includes(term) ||
      u.class?.toLowerCase().includes(term) ||
      u.background?.toLowerCase().includes(term) ||
      u.race?.toLowerCase().includes(term)
    );
  }, [onlineUsers, searchTerm]);

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

  // Close context menu
  const closeContextMenu = () => {
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

  const handleInviteToParty = () => {
    if (contextMenu?.user) {
      // If not in party, create one first with current character data
      if (!isInParty) {
        const currentPlayerName = characterName || currentUserPresence?.characterName || 'Player';

        // Get proper background display name - ONLY custom backgrounds are valid
        let backgroundDisplayName = characterBackground || currentUserPresence?.background || '';
        if (backgroundDisplayName) {
          const { getCustomBackgroundData } = require('../../data/customBackgroundData');
          const customBgData = getCustomBackgroundData(backgroundDisplayName.toLowerCase());
          if (customBgData) {
            backgroundDisplayName = customBgData.name;
          } else {
            // Invalid background - not one of the 9 custom backgrounds
            backgroundDisplayName = '';
          }
        }

        const currentPlayerData = {
          id: 'current-player',
          name: currentPlayerName,
          isGM: false,
          status: 'online',
          joinedAt: Date.now(),
          character: {
            class: characterClass || currentUserPresence?.class || 'Unknown',
            level: characterLevel || currentUserPresence?.level || 1,
            background: characterBackground || currentUserPresence?.background || '',
            backgroundDisplayName: backgroundDisplayName,
            race: characterRace || currentUserPresence?.race || '',
            subrace: characterSubrace || currentUserPresence?.subrace || '',
            raceDisplayName: characterRaceDisplayName || currentUserPresence?.raceDisplayName || '',
            health: { current: 100, max: 100 },
            mana: { current: 50, max: 50 },
            actionPoints: { current: 3, max: 3 }
          }
        };

        createParty(`${currentPlayerName}'s Party`, currentPlayerName);

        // Update the current player's data in the party
        const updatePartyMember = usePartyStore.getState().updatePartyMember;
        if (updatePartyMember) {
          updatePartyMember('current-player', currentPlayerData);
        }
      }

      // Add member to party with full character details
      // Compute backgroundDisplayName for the invited user
      let invitedUserBackgroundDisplayName = '';
      if (contextMenu.user.background) {
        const { getCustomBackgroundData } = require('../../data/customBackgroundData');
        const customBgData = getCustomBackgroundData(contextMenu.user.background.toLowerCase());
        if (customBgData) {
          invitedUserBackgroundDisplayName = customBgData.name;
        }
      }

      // Compute raceDisplayName for the invited user
      let invitedUserRaceDisplayName = contextMenu.user.raceDisplayName || '';
      if (!invitedUserRaceDisplayName && contextMenu.user.race && contextMenu.user.subrace) {
        const { getFullRaceData } = require('../../data/raceData');
        const raceData = getFullRaceData(contextMenu.user.race, contextMenu.user.subrace);
        if (raceData) {
          invitedUserRaceDisplayName = raceData.displayName;
        }
      }

      const newMember = {
        id: contextMenu.user.userId,
        name: contextMenu.user.characterName,
        isGM: false,
        status: contextMenu.user.status || 'online',
        joinedAt: Date.now(),
        character: {
          class: contextMenu.user.class,
          level: contextMenu.user.level,
          background: contextMenu.user.background,
          backgroundDisplayName: invitedUserBackgroundDisplayName,
          race: contextMenu.user.race,
          subrace: contextMenu.user.subrace,
          raceDisplayName: invitedUserRaceDisplayName,
          health: { current: 100, max: 100 },
          mana: { current: 50, max: 50 },
          actionPoints: { current: 3, max: 3 }
        }
      };

      addPartyMember(newMember);
      console.log(`✅ Invited ${contextMenu.user.characterName} to party`);
    }
    closeContextMenu();
  };

  const handleAddFriend = () => {
    if (contextMenu?.user) {
      // Don't add yourself as a friend
      if (contextMenu.user.userId === currentUserPresence?.userId) {
        console.log(`❌ Cannot add yourself as a friend`);
        closeContextMenu();
        return;
      }

      addFriend({
        name: contextMenu.user.characterName,
        level: contextMenu.user.level,
        class: contextMenu.user.class,
        background: contextMenu.user.background,
        race: contextMenu.user.race,
        subrace: contextMenu.user.subrace,
        status: contextMenu.user.status,
        location: contextMenu.user.sessionType === 'multiplayer' ? contextMenu.user.roomName : 'Local'
      });
      console.log(`✅ Added ${contextMenu.user.characterName} as friend`);
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

  const handleAddFriendById = async () => {
    setFriendIdError('');

    if (!friendIdInput.trim()) {
      setFriendIdError('Please enter a Friend ID');
      return;
    }

    try {
      // Find user by Friend ID
      const foundUser = await authService.findUserByFriendId(friendIdInput.trim());

      if (!foundUser) {
        setFriendIdError('No user found with this Friend ID');
        return;
      }

      // Check if already friends
      const alreadyFriend = friends.some(f => f.friendId === foundUser.friendId);
      if (alreadyFriend) {
        setFriendIdError('This user is already in your friends list');
        return;
      }

      // Add friend
      addFriend({
        name: foundUser.displayName,
        friendId: foundUser.friendId,
        level: 1, // Default values since we don't have character data
        class: 'Unknown',
        status: 'offline'
      });

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

  const handleIgnoreUser = () => {
    if (contextMenu?.user) {
      const userName = contextMenu.user.characterName || contextMenu.user.name;
      addIgnored({
        name: userName,
        note: 'Ignored from Community'
      });
      console.log(`✅ Ignored ${userName}`);
    }
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

  return (
    <div className="online-users-list" onClick={closeContextMenu}>
      {/* Header with Status Setter and Tabs */}
      <div className="users-list-header">
        {/* Status Setter */}
        <div className="status-setter">
          <button
            className="status-button"
            onClick={(e) => {
              e.stopPropagation();
              console.log('🖱️ Status button clicked, current status:', currentUserPresence?.status);
              setShowStatusMenu(!showStatusMenu);
            }}
            title={statusComment || "Set your status"}
          >
            <span className="status-icon-display">{getStatusIcon(currentUserPresence?.status || 'online')}</span>
            <span className="status-label">{currentUserPresence?.status || 'online'}</span>
            <i className="fas fa-chevron-down"></i>
          </button>

          {showStatusMenu && (
            <div className="status-menu" onClick={(e) => e.stopPropagation()}>
              <div className="status-menu-header">Set Status</div>
              <button
                className="status-option"
                onClick={() => handleStatusChange('online')}
              >
                🟢 Online
              </button>
              <button
                className="status-option"
                onClick={(e) => {
                  console.log('🖱️ AWAY BUTTON CLICKED!');
                  e.stopPropagation();
                  handleStatusChange('away');
                }}
              >
                🟡 Away
              </button>
              <button
                className="status-option"
                onClick={() => handleStatusChange('busy')}
              >
                🔴 Busy
              </button>
              <button
                className="status-option"
                onClick={() => handleStatusChange('offline')}
              >
                ⚫ Appear Offline
              </button>
              <div className="status-comment-section">
                <label>Status Comment:</label>
                <input
                  type="text"
                  placeholder="Looking for campaign about zombies..."
                  value={statusCommentDraft}
                  onChange={(e) => setStatusCommentDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveStatusComment();
                    }
                  }}
                  maxLength={100}
                />
                <div className="status-comment-footer">
                  <small>{statusCommentDraft.length}/100</small>
                  <button
                    className="save-comment-btn"
                    onClick={handleSaveStatusComment}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="users-tabs">
          <button
            className={`users-tab ${activeTab === 'online' ? 'active' : ''}`}
            onClick={() => setActiveTab('online')}
          >
            <i className="fas fa-globe"></i>
            <span>Online</span>
            <span className="tab-count">({onlineUsers.length})</span>
          </button>
          <button
            className={`users-tab ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            <i className="fas fa-user-friends"></i>
            <span>Friends</span>
            <span className="tab-count">({filteredFriends.length})</span>
          </button>
          <button
            className={`users-tab ${activeTab === 'ignored' ? 'active' : ''}`}
            onClick={() => setActiveTab('ignored')}
          >
            <i className="fas fa-user-slash"></i>
            <span>Ignored</span>
            <span className="tab-count">({ignored.length})</span>
          </button>
          <button
            className={`users-tab ${activeTab === 'party' ? 'active' : ''}`}
            onClick={() => setActiveTab('party')}
          >
            <i className="fas fa-users"></i>
            <span>Party</span>
            <span className="tab-count">({isInParty ? partyMembers.length : 0})</span>
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

                return (
                  <UserCard
                    key={user.userId}
                    user={user}
                    isCurrentUser={isCurrentUser}
                    showYouBadge={isCurrentUser}
                    showSessionInfo={true}
                    sessionDisplay={getSessionDisplay(user)}
                    onClick={() => onUserClick?.(user)}
                    onContextMenu={(e) => !isCurrentUser && handleContextMenu(e, user)}
                  />
                );
              })
            )}
        </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="users-section friends-section">
            {/* Add Friend by ID Button */}
            <div className="friends-actions">
              <button
                className="add-friend-by-id-btn"
                onClick={() => setShowAddFriendPopup(true)}
                title="Add Friend by ID"
              >
                <i className="fas fa-user-plus"></i>
                Add Friend by ID
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
                  // Find the friend in online users to get full details
                  const onlineUser = onlineUsers.find(u => u.characterName === friend.name);
                  // Merge friend data with online user data, preserving friendId
                  const friendData = onlineUser
                    ? { ...onlineUser, friendId: friend.friendId }
                    : friend;

                  // Debug: Log friend data to see if friendId is present
                  console.log('Friend data:', friend.name, 'friendId:', friend.friendId, 'merged:', friendData.friendId);

                  return (
                    <UserCard
                      key={friend.id || friend.name}
                      user={friendData}
                      className="friend-card"
                      showSessionInfo={!!onlineUser}
                      sessionDisplay={onlineUser ? getSessionDisplay(onlineUser) : null}
                      showFriendId={true}
                      onContextMenu={(e) => handleContextMenu(e, friendData)}
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
            {!isInParty || partyMembers.length === 0 ? (
              <div className="no-users">
                <i className="fas fa-users"></i>
                <p>No party members</p>
                <p className="hint">Invite players to your party from Online or Friends tabs</p>
              </div>
            ) : (
              <div className="party-list">
                {partyMembers.map((member) => {
                  const isLeader = partyLeader && (member.id === partyLeader.id || member.name === partyLeader.name);
                  const isCurrentPlayer = member.id === 'current-player';

                  // Try to find matching online user for full details
                  const onlineUser = onlineUsers.find(u => u.characterName === member.name);
                  const displayData = onlineUser || member;

                  // Compute backgroundDisplayName if not already set
                  let computedBackgroundDisplayName = member.character?.backgroundDisplayName || displayData.backgroundDisplayName || '';
                  if (!computedBackgroundDisplayName && (member.character?.background || displayData.background)) {
                    const { getCustomBackgroundData } = require('../../data/customBackgroundData');
                    const bgId = member.character?.background || displayData.background;
                    const customBgData = getCustomBackgroundData(bgId.toLowerCase());
                    if (customBgData) {
                      computedBackgroundDisplayName = customBgData.name;
                    }
                  }

                  // Merge member data with online user data
                  const userData = {
                    ...member.character,
                    characterName: member.name,
                    name: member.name,
                    level: displayData.level || member.character?.level || 1,
                    class: displayData.class || member.character?.class || 'Unknown',
                    background: member.character?.background,
                    backgroundDisplayName: computedBackgroundDisplayName,
                    race: member.character?.race,
                    subrace: member.character?.subrace,
                    raceDisplayName: member.character?.raceDisplayName || displayData.raceDisplayName,
                    status: displayData.status || member.status,
                    statusComment: displayData.statusComment
                  };

                  return (
                    <UserCard
                      key={member.id}
                      user={userData}
                      isCurrentUser={isCurrentPlayer}
                      isLeader={isLeader}
                      showYouBadge={isCurrentPlayer}
                      showLeaderCrown={true}
                      showSessionInfo={!!onlineUser}
                      sessionDisplay={onlineUser ? getSessionDisplay(onlineUser) : null}
                      className={`party-member-card ${isCurrentPlayer ? 'current-player' : ''}`}
                      onContextMenu={(e) => !isCurrentPlayer && handleContextMenu(e, onlineUser || {
                        userId: member.id,
                        characterName: member.name,
                        name: member.name,
                        level: member.character?.level || 1,
                        class: member.character?.class || 'Unknown',
                        background: member.character?.background,
                        race: member.character?.race,
                        subrace: member.character?.subrace,
                        status: member.status
                      })}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Friend by ID Popup */}
      {showAddFriendPopup && (
        <div className="modal-overlay" onClick={() => setShowAddFriendPopup(false)}>
          <div className="modal-content add-friend-modal" onClick={(e) => e.stopPropagation()}>
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
        </div>
      )}

      {/* Context Menu - Rendered via Portal */}
      {contextMenu && createPortal(
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
                <button
                  className="context-menu-item danger"
                  onClick={handleRemoveFriend}
                >
                  <i className="fas fa-user-minus"></i>
                  Remove Friend
                </button>
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

          {isGMWithRoom && (
            <button
              className="context-menu-item"
              onClick={handleInvite}
            >
              <i className="fas fa-envelope"></i>
              Invite to Room
            </button>
          )}

          <button
            className="context-menu-item"
            onClick={closeContextMenu}
          >
            <i className="fas fa-times"></i>
            Cancel
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default OnlineUsersList;

