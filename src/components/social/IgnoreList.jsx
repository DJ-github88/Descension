import React, { useState } from 'react';
import useSocialStore from '../../store/socialStore';
import SocialContextMenu from './SocialContextMenu';
import '../../styles/social-window.css';

const IgnoreList = () => {
  const {
    ignored,
    selectedIgnored,
    setSelectedIgnored,
    addIgnored,
    removeIgnored
  } = useSocialStore();

  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);
  // State for add ignore dialog
  const [showAddIgnore, setShowAddIgnore] = useState(false);
  const [newIgnoreName, setNewIgnoreName] = useState('');

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
  };

  // Render an ignore entry
  const renderIgnoreEntry = (ignore) => (
    <div
      key={ignore.id}
      className={`ignore-entry ${selectedIgnored === ignore.id ? 'selected' : ''}`}
      onClick={() => handleSelectIgnored(ignore.id)}
      onContextMenu={(e) => handleContextMenu(e, ignore)}
    >
      <div className="ignore-name">{ignore.name}</div>
      <div className="friend-info">
        <span className="friend-level">{ignore.level}</span>
        <span className={`friend-class ${ignore.class}`}>{ignore.class}</span>
        {ignore.note && (
          <div className="friend-note">{ignore.note}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="friends-list-container">
      {/* Ignore List */}
      <div className="ignore-list">
        {ignored.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-ban"></i>
            </div>
            <div className="empty-state-text">No ignored players</div>
            <div className="empty-state-subtext">
              Players you ignore will appear here
            </div>
          </div>
        ) : (
          <>
            <div className="friends-section-header">Ignored Players</div>
            {ignored.map(renderIgnoreEntry)}
          </>
        )}
      </div>

      {/* Content Spacer - pushes action buttons to bottom */}
      <div style={{ flex: 1 }}></div>

      {/* Action Buttons */}
      <div className="social-actions">
        <button
          className="social-button"
          onClick={handleAddIgnore}
        >
          Add Ignore
        </button>
        <button
          className="social-button"
          onClick={() => selectedIgnored && handleRemoveIgnore(ignored.find(i => i.id === selectedIgnored))}
          disabled={!selectedIgnored}
        >
          Remove
        </button>
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
        />
      )}
    </div>
  );
};

export default IgnoreList;
