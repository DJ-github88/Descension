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

const OnlineUsersList = ({ onUserClick, onWhisper, onInviteToRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  
  const onlineUsers = usePresenceStore((state) => state.getOnlineUsersArray());
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const { user } = useAuthStore();

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
      {/* Header */}
      <div className="users-list-header">
        <h3>
          <i className="fas fa-users"></i>
          Online Users
          <span className="user-count">({onlineUsers.length})</span>
        </h3>
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
                  </div>
                  
                  <div className="user-race">
                    {user.background && <span>{user.background}</span>}
                    {user.race && (
                      <span>
                        {user.subrace ? `${user.subrace} ${user.race}` : user.race}
                      </span>
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

      {/* Context Menu - Rendered via Portal */}
      {contextMenu && createPortal(
        <div
          className="user-context-menu"
          style={{
            position: 'fixed',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            zIndex: 10000
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

