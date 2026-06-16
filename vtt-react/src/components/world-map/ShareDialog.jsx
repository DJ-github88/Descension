import React, { useState } from 'react';
import { notify } from './MapNotify';
import './WorldMapImmerse.css';

const ShareDialog = ({
  isOpen,
  onClose,
  friends,
  onShare
}) => {
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [message, setMessage] = useState('');
  const [sharing, setSharing] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!selectedFriendId) {
      notify('Please select a friend.', 'warning');
      return;
    }

    const friend = friends.find(f => f.id === selectedFriendId);
    if (!friend) return;

    setSharing(true);
    try {
      await onShare(friend, message);
      notify(`Map view successfully shared with ${friend.name || friend.displayName || 'your friend'}!`, 'success');
      setSelectedFriendId('');
      setMessage('');
      onClose();
    } catch (e) {
      notify('Failed to share map view: ' + e.message, 'error');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="annotation-popup-overlay share-dialog-overlay animate-fade-in" onClick={onClose}>
      <div className="annotation-popup-container share-dialog-container" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <h2 className="popup-header-title">
          <i className="fas fa-share-nodes"></i> Share Current View
        </h2>
        <p className="share-dialog-desc">
          Send your current zoom level and coordinates to a friend so they can explore this exact location.
        </p>

        <div className="popup-form-scrollable">
          {/* Friend Selector */}
          <div className="form-group">
            <label className="form-label">Choose Friend</label>
            {friends && friends.length > 0 ? (
              <select
                className="form-select"
                value={selectedFriendId}
                onChange={(e) => setSelectedFriendId(e.target.value)}
              >
                <option value="">-- Select a friend --</option>
                {friends.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name || f.displayName} (Friend ID: {f.friendId})
                  </option>
                ))}
              </select>
            ) : (
              <div className="no-friends-notice">
                <i className="fas fa-users-slash"></i>
                <p>No friends found in your list.</p>
                <span>Add friends on the social panel of the Account Dashboard.</span>
              </div>
            )}
          </div>

          {/* Optional message */}
          <div className="form-group">
            <label className="form-label">Optional Note</label>
            <input
              type="text"
              className="form-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Check out this goblin camp in the Frostwood!"
              disabled={friends.length === 0}
            />
          </div>
        </div>

        <div className="popup-actions-footer">
          <button className="popup-btn cancel-btn" onClick={onClose} disabled={sharing}>
            Cancel
          </button>
          <button
            className="popup-btn save-btn share-btn"
            onClick={handleShare}
            disabled={sharing || !selectedFriendId || friends.length === 0}
          >
            {sharing ? 'Sharing...' : 'Share Coordinates'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
