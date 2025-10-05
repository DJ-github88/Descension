/**
 * Online Users List Component
 * 
 * Displays all currently online users with their character details and session status.
 * Includes search/filter functionality and context menu for actions.
 */

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import usePresenceStore from '../../store/presenceStore';
import useAuthStore from '../../store/authStore';
import usePartyStore from '../../store/partyStore';
import useSocialStore from '../../store/socialStore';

const OnlineUsersList = ({ onUserClick, onWhisper, onInviteToRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('online'); // 'online' or 'friends'

  const onlineUsers = usePresenceStore((state) => state.getOnlineUsersArray());
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const { user } = useAuthStore();
  const { isInParty, addPartyMember, createParty } = usePartyStore();
  const { friends, addFriend } = useSocialStore();

  // Filter out current user from friends list
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    return friends.filter(friend =>
      friend.name !== currentUserPresence?.characterName
    );
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
      // If not in party, create one first
      if (!isInParty) {
        createParty(`${currentUserPresence?.characterName || 'Player'}'s Party`, currentUserPresence?.characterName || 'Player');
      }

      // Add member to party
      const newMember = {
        id: contextMenu.user.userId,
        name: contextMenu.user.characterName,
        isGM: false,
        status: 'online',
        joinedAt: Date.now(),
        character: {
          class: contextMenu.user.class,
          level: contextMenu.user.level,
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
      addFriend({
        name: contextMenu.user.characterName,
        level: contextMenu.user.level,
        class: contextMenu.user.class,
        status: contextMenu.user.status,
        location: contextMenu.user.sessionType === 'multiplayer' ? contextMenu.user.roomName : 'Local'
      });
      console.log(`✅ Added ${contextMenu.user.characterName} as friend`);
    }
    closeContextMenu();
  };

  // Check if current user is GM with active room
  const isGMWithRoom = currentUserPresence?.sessionType === 'multiplayer';

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      case 'busy': return '🔴';
      default: return '⚪';
    }
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

  return (
    <div className="online-users-list" onClick={closeContextMenu}>
      {/* Header with Tabs */}
      <div className="users-list-header">
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
              <div
                key={user.userId}
                className={`user-card ${isCurrentUser ? 'current-user' : ''}`}
                onClick={() => onUserClick?.(user)}
                onContextMenu={(e) => !isCurrentUser && handleContextMenu(e, user)}
              >
                {/* Status Indicator */}
                <div className="user-status">
                  <span className="status-icon">{getStatusIcon(user.status)}</span>
                </div>

                {/* User Info */}
                <div className="user-info">
                  <div className="user-name">
                    {user.characterName}
                    {isCurrentUser && <span className="you-badge">(You)</span>}
                  </div>
                  
                  <div className="user-details">
                    <span className="user-level">Lvl {user.level}</span>
                    <span className="user-class">{user.class}</span>
                    {user.background && <span className="user-background">({user.background})</span>}
                  </div>

                  <div className="user-race">
                    {user.subrace && user.race && (
                      <span>{user.subrace}</span>
                    )}
                  </div>

                  {/* Session Info */}
                  {getSessionDisplay(user)}
                </div>
              </div>
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
                <p className="hint">Right-click online users to add friends</p>
              </div>
            ) : (
              <div className="friends-list">
                {filteredFriends.map((friend) => (
                  <div key={friend.id || friend.name} className="user-card friend-card">
                    <div className="user-status">
                      <span className="status-icon">{getStatusIcon(friend.status)}</span>
                    </div>
                    <div className="user-info">
                      <div className="user-name">{friend.name}</div>
                      <div className="user-details">
                        <span className="user-level">Lvl {friend.level}</span>
                        <span className="user-class">{friend.class}</span>
                      </div>
                      {friend.location && (
                        <div className="session-info">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{friend.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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
            {contextMenu.user.characterName}
          </div>

          <button
            className="context-menu-item"
            onClick={handleWhisper}
          >
            <i className="fas fa-comment"></i>
            Whisper
          </button>

          <button
            className="context-menu-item"
            onClick={handleInviteToParty}
          >
            <i className="fas fa-users"></i>
            Invite to Party
          </button>

          <button
            className="context-menu-item"
            onClick={handleAddFriend}
          >
            <i className="fas fa-user-plus"></i>
            Add Friend
          </button>

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

