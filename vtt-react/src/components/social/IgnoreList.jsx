import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useSocialStore from '../../store/socialStore';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';
import useSettingsStore from '../../store/settingsStore';
import SocialContextMenu from './SocialContextMenu';
import UserCard from './UserCard';
import '../../styles/social-window.css';

const IgnoreList = () => {
  const windowScale = useSettingsStore(state => state.windowScale);
  const {
    ignored,
    selectedIgnored,
    setSelectedIgnored,
    addIgnored,
    removeIgnored,
    setIgnoredNote
  } = useSocialStore();
  const user = useAuthStore(state => state.user);
  const userData = useAuthStore(state => state.userData);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);
  // State for add ignore dialog
  const [showAddIgnore, setShowAddIgnore] = useState(false);
  const [newIgnoreId, setNewIgnoreId] = useState('');
  const [addIgnoreError, setAddIgnoreError] = useState('');
  // State for note dialog
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notePlayerId, setNotePlayerId] = useState(null);

  // Handle ignore selection
  const handleSelectIgnored = (id) => {
    setSelectedIgnored(id);
  };

  // Handle right-click on ignored player
  const handleContextMenu = (e, ignored) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      player: {
        ...ignored,
        isFriend: false,
        isIgnored: true
      }
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Handle add ignore
  const handleAddIgnore = () => {
    setShowAddIgnore(true);
  };

  // Handle add ignore submit
  const handleAddIgnoreSubmit = async () => {
    const rawInput = newIgnoreId.trim();
    if (!rawInput) {
      setAddIgnoreError('Please enter a Friend ID');
      return;
    }

    const cleanFriendId = rawInput.startsWith('#') ? rawInput.slice(1) : rawInput;
    if (!/^[a-zA-Z0-9]{3,20}$/.test(cleanFriendId)) {
      setAddIgnoreError('Friend ID must be 3-20 letters/numbers');
      return;
    }

    const currentUserFriendId = userData?.friendId || user?.friendId;
    if (currentUserFriendId && currentUserFriendId.toLowerCase() === cleanFriendId.toLowerCase()) {
      setAddIgnoreError('You cannot ignore yourself');
      return;
    }

    const exists = (ignored || []).some(i =>
      (i.friendId || '').toLowerCase() === cleanFriendId.toLowerCase()
    );
    if (exists) {
      setAddIgnoreError('This player is already ignored');
      return;
    }

    try {
      const foundUser = await authService.findUserByFriendId(cleanFriendId);
      if (!foundUser) {
        setAddIgnoreError('No user found with that Friend ID');
        return;
      }

      addIgnored({
        id: foundUser.id,
        name: foundUser.displayName || foundUser.email?.split('@')[0] || cleanFriendId,
        friendId: foundUser.friendId,
        level: 1,
        class: 'Unknown',
        status: 'offline'
      });

      setNewIgnoreId('');
      setAddIgnoreError('');
      setShowAddIgnore(false);
    } catch (error) {
      console.error('Error adding ignored user by Friend ID:', error);
      setAddIgnoreError('Failed to add ignored user. Please try again.');
    }
  };

  // Handle remove ignore
  const handleRemoveIgnore = (player) => {
    removeIgnored(player.id);
    closeContextMenu();
  };

  // Handle add note
  const handleAddNote = (player) => {
    setNoteText(player.note || '');
    setNotePlayerId(player.id);
    setShowNoteDialog(true);
    closeContextMenu();
  };

  // Handle note submit
  const handleNoteSubmit = () => {
    if (notePlayerId) {
      setIgnoredNote(notePlayerId, noteText);
      setShowNoteDialog(false);
      setNotePlayerId(null);
      setNoteText('');
    }
  };

  // Render an ignore entry using UserCard
  const renderIgnoreEntry = (ignore) => {
    // Build note display
    const noteDisplay = ignore.note ? (
      <div className="ignored-note">
        <i className="fas fa-sticky-note"></i>
        <span>{ignore.note}</span>
      </div>
    ) : null;

    return (
      <UserCard
        key={ignore.id}
        user={{
          ...ignore,
          characterName: ignore.name,
          userId: ignore.id,
          status: 'offline' // Ignored users shown as offline
        }}
        className="ignored-card"
        additionalContent={noteDisplay}
        onClick={() => handleSelectIgnored(ignore.id)}
        onContextMenu={(e) => handleContextMenu(e, ignore)}
      />
    );
  };

  return (
    <div className="friends-list-container">
      {/* Ignore List Header with Actions */}
      <div className="friends-list-header">
        <div className="friends-list-title">Ignored Players</div>
        <div className="friends-list-actions">
          <button
            className="compact-action-btn add-ignore"
            onClick={handleAddIgnore}
            title="Add Ignore"
          >
            <i className="fas fa-user-slash"></i>
          </button>
          {selectedIgnored && (
            <>
              <button
                className="compact-action-btn set-note"
                onClick={() => handleAddNote(ignored.find(i => i.id === selectedIgnored))}
                title="Set Note"
              >
                <i className="fas fa-sticky-note"></i>
              </button>
              <button
                className="compact-action-btn remove-ignore"
                onClick={() => handleRemoveIgnore(ignored.find(i => i.id === selectedIgnored))}
                title="Remove Ignore"
              >
                <i className="fas fa-user-check"></i>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ignore List */}
      <div className="friends-list">
        {(!isAuthenticated || user?.isGuest) ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-lock"></i>
            </div>
            <div className="empty-state-text">Authentication Required</div>
            <div className="empty-state-subtext">
              Please log in to manage your ignored players
            </div>
          </div>
        ) : ignored.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-ban"></i>
            </div>
            <div className="empty-state-text">No ignored players</div>
            <div className="empty-state-subtext">
              Click the ignore button above to add players
            </div>
          </div>
        ) : (
          <>
            <div className="friends-section-header">Ignored Players ({ignored.length})</div>
            {ignored.map(renderIgnoreEntry)}
          </>
        )}
      </div>

      {/* Add Ignore Dialog */}
      {showAddIgnore && createPortal(
        <div className="social-modal-overlay">
          <div
            className="social-modal-content"
            style={{ transform: `scale(${windowScale})` }}
          >
            <h3>Add Ignore</h3>
            <div className="social-modal-form">
              <input
                type="text"
                value={newIgnoreId}
                onChange={(e) => {
                  setNewIgnoreId(e.target.value.replace(/[^a-zA-Z0-9#]/g, ''));
                  setAddIgnoreError('');
                }}
                placeholder="Enter Friend ID (e.g. #StoneLight6117)"
                className="who-input"
              />
              {addIgnoreError && (
                <div className="error-text" style={{ marginTop: '8px' }}>{addIgnoreError}</div>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="social-button"
                onClick={handleAddIgnoreSubmit}
              >
                Add
              </button>
              <button
                className="social-button"
                onClick={() => {
                  setShowAddIgnore(false);
                  setNewIgnoreId('');
                  setAddIgnoreError('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Note Dialog */}
      {showNoteDialog && createPortal(
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
                onClick={() => {
                  setShowNoteDialog(false);
                  setNotePlayerId(null);
                  setNoteText('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Context Menu */}
      {contextMenu && (
        <SocialContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          player={contextMenu.player}
          onClose={closeContextMenu}
          onWhisper={() => { }}
          onInvite={() => { }}
          onAddFriend={() => { }}
          onRemoveFriend={() => { }}
          onAddIgnore={() => { }}
          onRemoveIgnore={handleRemoveIgnore}
          onAddNote={handleAddNote}
        />
      )}
    </div>
  );
};

export default IgnoreList;
