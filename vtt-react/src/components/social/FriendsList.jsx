import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useSocialStore from '../../store/socialStore';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import useSettingsStore from '../../store/settingsStore';
import usePresenceStore from '../../store/presenceStore';
import SocialContextMenu from './SocialContextMenu';
import UserCard from './UserCard';
import { formatTimeAgo } from '../../utils/timeUtils';
import '../../styles/social-window.css';

const FriendsList = () => {
  const windowScale = useSettingsStore(state => state.windowScale);
  const {
    friends,
    friendPresence,
    selectedFriend,
    setSelectedFriend,
    sendFriendRequest,
    removeFriend,
    setFriendNote
  } = useSocialStore();
  const user = useAuthStore(state => state.user);
  const userData = useAuthStore(state => state.userData);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // Party store for invites
  const { addPartyMember, isInParty, createParty } = usePartyStore();

  // Chat store for whispers
  const { addSocialNotification, setIsOpen: setChatOpen, setActiveTab: setChatTab } = useChatStore();

  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);
  // State for add friend dialog
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendId, setNewFriendId] = useState('');
  const [addFriendError, setAddFriendError] = useState('');
  // State for note dialog
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notePlayerId, setNotePlayerId] = useState(null);

  // Handle friend selection
  const handleSelectFriend = (id) => {
    setSelectedFriend(id);
  };

  // Handle right-click on friend
  const handleContextMenu = (e, friend) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      player: {
        ...friend,
        isFriend: true,
        isIgnored: false
      }
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest('.social-context-menu')) {
        closeContextMenu();
      }
    };

    if (contextMenu) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // Handle whisper
  const handleWhisper = (player) => {
    addSocialNotification({
      type: 'whisper_start',
      target: player.name,
      content: `Whisper conversation started with ${player.name}`,
      sender: { name: 'System', class: 'system', level: 0 }
    });
    setChatOpen(true);
    setChatTab('social');
    closeContextMenu();
  };

  // Handle invite - async to wait for party creation
  const handleInvite = async (player) => {
    const sendPartyInvite = usePresenceStore.getState().sendPartyInvite;
    const currentUserPresence = usePresenceStore.getState().currentUserPresence;

    try {
      if (!isInParty) {
        const currentPlayerName = userData?.name || user?.displayName || currentUserPresence?.characterName || 'Unknown';
        
        // Await party creation before sending invite
        await createParty(`${currentPlayerName}'s Party`, false, {
          name: currentPlayerName,
          characterName: currentPlayerName,
          characterClass: currentUserPresence?.class || 'Unknown',
          characterLevel: currentUserPresence?.level || 1
        });

        addSocialNotification({
          type: 'party_created',
          content: `Party created for ${currentPlayerName}`,
          sender: { name: 'System', class: 'system', level: 0 }
        });
      }

      // Send the invitation via socket
      // player.id should be the target userId
      if (player.id) {
        sendPartyInvite(player.id, player.name);

        addSocialNotification({
          type: 'party_invite_sent',
          target: player.name,
          content: `Party invitation sent to ${player.name}`,
          sender: { name: 'System', class: 'system', level: 0 }
        });
      } else {
        console.error('❌ Could not send party invitation: player ID missing');
      }
    } catch (error) {
      console.error('❌ Failed to create party or send invite:', error);
      addSocialNotification({
        type: 'party_error',
        content: `Failed to send party invitation: ${error.message}`,
        sender: { name: 'System', class: 'system', level: 0 }
      });
    }

    closeContextMenu();
  };

  // Handle add friend submit
  const handleAddFriendSubmit = async () => {
    const rawInput = newFriendId.replace(/\s+/g, '');
    if (!rawInput) {
      setAddFriendError('Please enter a Friend ID');
      return;
    }

    const cleanFriendId = rawInput.startsWith('#') ? rawInput.slice(1) : rawInput;
    const currentUserFriendId = userData?.friendId || user?.friendId;
    if (currentUserFriendId && currentUserFriendId.toLowerCase() === cleanFriendId.toLowerCase()) {
      setAddFriendError('You cannot add yourself');
      return;
    }

    const exists = (friends || []).some(f => (f.friendId || '').toLowerCase() === cleanFriendId.toLowerCase());
    if (exists) {
      setAddFriendError('This player is already in your friends list');
      return;
    }

    try {
      const result = await sendFriendRequest(cleanFriendId);
      if (result.success) {
        setNewFriendId('');
        setShowAddFriend(false);
      } else {
        setAddFriendError(result.error || 'Failed to send request');
      }
    } catch (error) {
      setAddFriendError('Failed to send request.');
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    const friend = enrichedFriends.find(f => f.id === selectedFriend);
    if (friend && friend.status !== 'offline') {
      handleWhisper(friend);
    }
  };

  // Handle add note
  const handleAddNote = (player) => {
    setNoteText(player.note || '');
    setNotePlayerId(player.id);
    setShowNoteDialog(true);
    closeContextMenu();
  };

  const handleNoteSubmit = () => {
    if (notePlayerId) {
      setFriendNote(notePlayerId, noteText);
      setShowNoteDialog(false);
    }
  };

  const handleRemoveFriend = (player) => {
    removeFriend(player.id);
    closeContextMenu();
  };

  // Enrich friends with real-time presence data
  const enrichedFriends = (friends || []).map(friend => {
    const presence = friendPresence[friend.id];
    return {
      ...friend,
      status: presence?.status || 'offline',
      lastSeen: presence?.lastSeen || presence?.lastUpdated || null,
      location: presence?.roomName || presence?.roomId || null,
      level: presence?.level || friend.level,
      class: presence?.class || friend.class,
      userId: friend.id // Ensure userId is set for party invites
    };
  });

  // Include 'idle' as an online status
  const onlineFriends = enrichedFriends.filter(f => ['online', 'away', 'busy', 'idle'].includes(f.status));
  const offlineFriends = enrichedFriends.filter(f => f.status === 'offline' || !f.status);

  // Render a friend entry using UserCard
  const renderFriendEntry = (friend) => {
    // Include 'idle' as an online status
    const isOnline = ['online', 'away', 'busy', 'idle'].includes(friend.status);

    let sessionDisplay = null;
    if (isOnline && friend.location) {
      sessionDisplay = (
        <div className="user-session">
          <span className="session-badge local">
            <i className="fas fa-map-marker-alt"></i> {friend.location}
          </span>
        </div>
      );
    } else if (!isOnline && friend.lastSeen) {
      sessionDisplay = (
        <div className="user-session">
          <span className="last-seen-text" style={{ fontSize: '0.75rem', color: '#999', marginTop: '2px', display: 'block' }}>
            <i className="fas fa-clock" style={{ marginRight: '4px' }}></i>
            Last seen {formatTimeAgo(friend.lastSeen)}
          </span>
        </div>
      );
    }

    const noteDisplay = friend.note ? (
      <div className="friend-note-display">
        <i className="fas fa-sticky-note"></i>
        <span>{friend.note}</span>
      </div>
    ) : null;

    return (
      <UserCard
        key={friend.id}
        user={{
          ...friend,
          characterName: friend.name,
          userId: friend.id
        }}
        className="friend-card"
        showFriendId={true}
        showSessionInfo={!!sessionDisplay}
        sessionDisplay={sessionDisplay}
        additionalContent={noteDisplay}
        onClick={() => handleSelectFriend(friend.id)}
        onContextMenu={(e) => handleContextMenu(e, friend)}
      />
    );
  };

  return (
    <div className="friends-list-container">
      <div className="friends-list-header">
        <div className="friends-list-title">Friends</div>
        <div className="friends-list-actions">
          <button className="compact-action-btn add-friend" onClick={() => setShowAddFriend(true)} title="Add Friend">
            <i className="fas fa-user-plus"></i>
          </button>
          {selectedFriend && (
            <>
              <button className="compact-action-btn set-note" onClick={() => handleAddNote(enrichedFriends.find(f => f.id === selectedFriend))} title="Set Note">
                <i className="fas fa-sticky-note"></i>
              </button>
              <button
                className="compact-action-btn send-message"
                onClick={handleSendMessage}
                disabled={enrichedFriends.find(f => f.id === selectedFriend)?.status === 'offline'}
                title="Send Message"
              >
                <i className="fas fa-comment"></i>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="friends-list">
        {(!isAuthenticated || user?.isGuest) ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-lock"></i></div>
            <div className="empty-state-text">Authentication Required</div>
          </div>
        ) : enrichedFriends.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-user-friends"></i></div>
            <div className="empty-state-text">No friends yet</div>
          </div>
        ) : (
          <>
            {onlineFriends.length > 0 && (
              <>
                <div className="friends-section-header">Online ({onlineFriends.length})</div>
                {onlineFriends.map(renderFriendEntry)}
              </>
            )}
            {offlineFriends.length > 0 && (
              <>
                <div className="friends-section-header">Offline ({offlineFriends.length})</div>
                {offlineFriends.map(renderFriendEntry)}
              </>
            )}
          </>
        )}
      </div>

      {showAddFriend && createPortal(
        <div className="social-modal-overlay">
          <div className="social-modal-content" style={{ transform: `scale(${windowScale})` }}>
            <h3>Add Friend</h3>
            <input type="text" value={newFriendId} onChange={(e) => setNewFriendId(e.target.value)} placeholder="Friend ID" className="who-input" />
            {addFriendError && <div className="error-text">{addFriendError}</div>}
            <div className="modal-actions">
              <button className="social-button" onClick={handleAddFriendSubmit}>Add</button>
              <button className="social-button" onClick={() => setShowAddFriend(false)}>Cancel</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showNoteDialog && createPortal(
        <div className="social-modal-overlay">
          <div className="social-modal-content note-modal" style={{ transform: `scale(${windowScale})` }}>
            <h3>Set Note</h3>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Enter note" className="who-input" rows={3} />
            <div className="modal-actions">
              <button className="social-button" onClick={handleNoteSubmit}>Save</button>
              <button className="social-button" onClick={() => setShowNoteDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {contextMenu && (
        <SocialContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          player={contextMenu.player}
          onClose={closeContextMenu}
          onWhisper={handleWhisper}
          onInvite={handleInvite}
          onRemoveFriend={handleRemoveFriend}
          onAddNote={handleAddNote}
        />
      )}
    </div>
  );
};

export default FriendsList;
