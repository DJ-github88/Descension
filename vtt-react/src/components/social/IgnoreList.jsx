import React, { useState } from 'react';
import useSocialStore from '../../store/socialStore';
import SocialContextMenu from './SocialContextMenu';
import UserCard from './UserCard';
import '../../styles/social-window.css';

const IgnoreList = () => {
  const {
    ignored,
    selectedIgnored,
    setSelectedIgnored,
    addIgnored,
    removeIgnored,
    setIgnoredNote
  } = useSocialStore();

  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);
  // State for add ignore dialog
  const [showAddIgnore, setShowAddIgnore] = useState(false);
  const [newIgnoreName, setNewIgnoreName] = useState('');
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
  const handleAddIgnoreSubmit = () => {
    if (newIgnoreName.trim()) {
      addIgnored({
        name: newIgnoreName.trim(),
        level: 1,
        class: 'Unknown'
      });
      setNewIgnoreName('');
      setShowAddIgnore(false);
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
        {ignored.length === 0 ? (
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
      {showAddIgnore && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Ignore</h3>
            <div className="modal-form">
              <input
                type="text"
                value={newIgnoreName}
                onChange={(e) => setNewIgnoreName(e.target.value)}
                placeholder="Enter character name"
                className="who-input"
              />
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
                onClick={() => setShowAddIgnore(false)}
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
          onWhisper={() => {}}
          onInvite={() => {}}
          onAddFriend={() => {}}
          onRemoveFriend={() => {}}
          onAddIgnore={() => {}}
          onRemoveIgnore={handleRemoveIgnore}
          onAddNote={handleAddNote}
        />
      )}
    </div>
  );
};

export default IgnoreList;
