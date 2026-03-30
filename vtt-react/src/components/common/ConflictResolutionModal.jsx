/**
 * Conflict Resolution Modal
 *
 * Shows when data conflicts are detected between local and remote changes.
 * Allows users to choose which version to keep.
 */

import React, { useState } from 'react';
import './styles/ConflictResolutionModal.css';

const ConflictResolutionModal = ({
  isOpen,
  conflictType, // 'character', 'room', 'campaign', 'journal'
  localTimestamp,
  remoteTimestamp,
  onResolveWithLocal,
  onResolveWithRemote,
  onCancel
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  if (!isOpen) return null;

  const handleResolve = () => {
    if (selectedChoice === 'local') {
      onResolveWithLocal();
    } else if (selectedChoice === 'remote') {
      onResolveWithRemote();
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  const getConflictDescription = () => {
    switch (conflictType) {
      case 'character':
        return 'Your character data has been modified on another device.';
      case 'room':
        return 'The room state has been modified by another user.';
      case 'campaign':
        return 'Campaign data has been modified on another device.';
      case 'journal':
        return 'Your journal has been modified on another device.';
      default:
        return 'Data has been modified on another device.';
    }
  };

  return (
    <div className="conflict-modal-overlay">
      <div className="conflict-modal">
        <div className="conflict-modal-header">
          <h3>⚠️ Data Conflict Detected</h3>
          <button className="conflict-modal-close" onClick={onCancel}>×</button>
        </div>

        <div className="conflict-modal-body">
          <p className="conflict-description">
            {getConflictDescription()}
          </p>

          <div className="conflict-details">
            <div className="conflict-option">
              <input
                type="radio"
                id="local-changes"
                name="conflict-choice"
                value="local"
                checked={selectedChoice === 'local'}
                onChange={(e) => setSelectedChoice(e.target.value)}
              />
              <label htmlFor="local-changes">
                <div className="option-header">
                  <strong>Keep My Changes</strong>
                  <span className="timestamp">(Modified: {formatTimestamp(localTimestamp)})</span>
                </div>
                <div className="option-description">
                  Discard changes from the other device and keep your current data.
                </div>
              </label>
            </div>

            <div className="conflict-option">
              <input
                type="radio"
                id="remote-changes"
                name="remote-changes"
                value="remote"
                checked={selectedChoice === 'remote'}
                onChange={(e) => setSelectedChoice(e.target.value)}
              />
              <label htmlFor="remote-changes">
                <div className="option-header">
                  <strong>Accept Other Changes</strong>
                  <span className="timestamp">(Modified: {formatTimestamp(remoteTimestamp)})</span>
                </div>
                <div className="option-description">
                  Accept changes from the other device and update your current data.
                </div>
              </label>
            </div>
          </div>

          <div className="conflict-warning">
            <i className="fas fa-exclamation-triangle"></i>
            <span>This action cannot be undone. Choose carefully.</span>
          </div>
        </div>

        <div className="conflict-modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleResolve}
            disabled={!selectedChoice}
          >
            Resolve Conflict
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionModal;
