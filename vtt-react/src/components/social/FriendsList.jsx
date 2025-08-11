import React, { useState, useEffect } from 'react';
import useSocialStore from '../../store/socialStore';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import SocialContextMenu from './SocialContextMenu';
import '../../styles/social-window.css';

const FriendsList = () => {
  const {
    friends,
    selectedFriend,
    setSelectedFriend,
    addFriend,
    removeFriend,
    setFriendNote
  } = useSocialStore();

  // Party store for invites
  const { addPartyMember, isInParty, createParty } = usePartyStore();

  // Chat store for whispers
  const { addSocialNotification, setIsOpen: setChatOpen, setActiveTab: setChatTab } = useChatStore();

  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);
  // State for add friend dialog
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
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
      // Use a slight delay to avoid conflicts with the right-click event
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // Handle whisper
  const handleWhisper = (player) => {
    // Add a whisper notification to chat
    addSocialNotification({
      type: 'whisper_start',
      target: player.name,
      content: `Whisper conversation started with ${player.name}`,
      sender: { name: 'System', class: 'system', level: 0 }
    });

    // Open chat window and switch to social tab
    setChatOpen(true);
    setChatTab('social');

    // Close context menu
    closeContextMenu();


  };

  // Handle invite
  const handleInvite = (player) => {
    if (!isInParty) {
      // Create party automatically and add the player
      createParty(`${player.name}'s Party`);

      // Add notification about party creation
      addSocialNotification({
        type: 'party_created',
        content: `Party created and ${player.name} has been added`,
        sender: { name: 'System', class: 'system', level: 0 }
      });
    }

    // Add the player directly to the party
    const newMember = {
      id: `friend-${player.id}`,
      name: player.name,
      role: 'member',
      status: player.status,
      character: {
        level: player.level,
        race: 'Unknown', // Friends list doesn't include race
        class: player.class,
        health: { current: 100, max: 100 },
        mana: { current: 50, max: 50 },
        actionPoints: { current: 3, max: 3 }
      }
    };

    addPartyMember(newMember);

    // Add notification to chat
    addSocialNotification({
      type: 'party_member_added',
      target: player.name,
      content: `${player.name} has been added to your party`,
      sender: { name: 'System', class: 'system', level: 0 }
    });

    // Open chat to show the message
    setChatOpen(true);
    setChatTab('social');

    // Close context menu
    closeContextMenu();


  };

  // Handle add friend
  const handleAddFriend = () => {
    setShowAddFriend(true);
  };

  // Handle add friend submit
  const handleAddFriendSubmit = () => {
    if (newFriendName.trim()) {
      addFriend({
        name: newFriendName.trim(),
        level: 1,
        class: 'Unknown',
        status: 'offline'
      });
      setNewFriendName('');
      setShowAddFriend(false);
    }
  };

  // Handle remove friend
  const handleRemoveFriend = (player) => {
    removeFriend(player.id);
    closeContextMenu();
  };

  // Handle add note
  const handleAddNote = (player) => {
    setNoteText(player.note || '');
    setNotePlayerId(player.id);
    setShowNoteDialog(true);
  };

  // Handle note submit
  const handleNoteSubmit = () => {
    if (notePlayerId) {
      setFriendNote(notePlayerId, noteText);
      setShowNoteDialog(false);
      setNotePlayerId(null);
      setNoteText('');
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    const friend = friends.find(f => f.id === selectedFriend);
    if (friend && friend.status === 'online') {
      handleWhisper(friend);
    }
  };

  // Filter friends by online status
  const onlineFriends = friends.filter(friend => friend.status === 'online' || friend.status === 'away');
  const offlineFriends = friends.filter(friend => friend.status === 'offline');

  // Render a friend entry
  const renderFriendEntry = (friend) => (
    <div
      key={friend.id}
      className={`friend-entry ${selectedFriend === friend.id ? 'selected' : ''}`}
      onClick={() => handleSelectFriend(friend.id)}
      onContextMenu={(e) => handleContextMenu(e, friend)}
      onDoubleClick={() => friend.status === 'online' && handleWhisper(friend)}
    >
      <div className={`friend-status ${friend.status}`}></div>
      <div className="friend-name">{friend.name}</div>
      <div className="friend-info">
        <span className="friend-level">{friend.level}</span>
        <span className={`friend-class ${friend.class}`}>{friend.class}</span>
        {friend.background && (
          <span className="friend-background">{friend.background}</span>
        )}
        {friend.status === 'online' && friend.location && (
          <div className="friend-location">{friend.location}</div>
        )}
        {friend.note && (
          <div className="friend-note">{friend.note}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="friends-list-container">
      {/* Friends List Header with Actions */}
      <div className="friends-list-header">
        <div className="friends-list-title">Friends</div>
        <div className="friends-list-actions">
          <button
            className="compact-action-btn add-friend"
            onClick={handleAddFriend}
            title="Add Friend"
          >
            <i className="fas fa-user-plus"></i>
          </button>
          {selectedFriend && (
            <>
              <button
                className="compact-action-btn set-note"
                onClick={() => handleAddNote(friends.find(f => f.id === selectedFriend))}
                title="Set Note"
              >
                <i className="fas fa-sticky-note"></i>
              </button>
              <button
                className="compact-action-btn send-message"
                onClick={handleSendMessage}
                disabled={friends.find(f => f.id === selectedFriend)?.status !== 'online'}
                title="Send Message"
              >
                <i className="fas fa-comment"></i>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Friends List */}
      <div className="friends-list">
        {friends.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <div className="empty-state-text">No friends yet</div>
            <div className="empty-state-subtext">
              Click the + button above to add friends
            </div>
          </div>
        ) : (
          <>
            {/* Online Friends Section */}
            {onlineFriends.length > 0 && (
              <>
                <div className="friends-section-header">Online Players ({onlineFriends.length})</div>
                {onlineFriends.map(renderFriendEntry)}
              </>
            )}

            {/* Offline Friends Section */}
            {offlineFriends.length > 0 && (
              <>
                <div className="friends-section-header">Offline Players ({offlineFriends.length})</div>
                {offlineFriends.map(renderFriendEntry)}
              </>
            )}
          </>
        )}
      </div>

      {/* Add Friend Dialog */}
      {showAddFriend && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Friend</h3>
            <div className="modal-form">
              <input
                type="text"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                placeholder="Enter character name"
                className="who-input"
              />
            </div>
            <div className="modal-actions">
              <button
                className="social-button"
                onClick={handleAddFriendSubmit}
              >
                Add
              </button>
              <button
                className="social-button"
                onClick={() => setShowAddFriend(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Dialog */}
      {showNoteDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Set Note</h3>
            <div className="modal-form">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter note"
                className="who-input"
                rows={3}
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
                onClick={() => setShowNoteDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <SocialContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          player={contextMenu.player}
          onClose={closeContextMenu}
          onWhisper={handleWhisper}
          onInvite={handleInvite}
          onAddFriend={() => {}}
          onRemoveFriend={handleRemoveFriend}
          onAddIgnore={() => {}}
          onRemoveIgnore={() => {}}
        />
      )}
    </div>
  );
};

export default FriendsList;
