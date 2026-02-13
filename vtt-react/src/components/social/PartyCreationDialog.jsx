/**
 * Party Creation Dialog
 *
 * Modal dialog for creating a new party with a custom name.
 * Allows users to specify party name before creation.
 */

import React, { useState } from 'react';
import usePartyStore from '../../store/partyStore';
import usePresenceStore from '../../store/presenceStore';
import useSettingsStore from '../../store/settingsStore';

const PartyCreationDialog = ({ isOpen, onClose }) => {
  const [partyName, setPartyName] = useState('');
  const [error, setError] = useState('');

  const windowScale = useSettingsStore(state => state.windowScale);

  const handleCreateParty = async () => {
    if (!partyName.trim()) {
      setError('Please enter a party name');
      return;
    }

    const currentName = partyName;
    setError('');

    // Create party with user as GM (isGM: true)
    const currentUserPresence = usePresenceStore.getState().currentUserPresence;
    const leaderData = {
      name: currentUserPresence?.accountName || currentUserPresence?.characterName || 'Unknown',
      characterName: currentUserPresence?.characterName || 'Unknown',
      characterClass: currentUserPresence?.class || 'Unknown',
      characterLevel: currentUserPresence?.level || 1
    };

    console.log('🎉 Creating party:', currentName);
    
    try {
      await usePartyStore.getState().createParty(currentName, true, leaderData);
      setPartyName('');
      onClose();
    } catch (error) {
      console.error('❌ Failed to create party:', error);
      setError(error.message || 'Failed to create party');
    }
  };

  const handleClose = () => {
    setPartyName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="social-modal-overlay" onClick={handleClose}>
      <div
        className="social-modal-content party-creation-modal"
        style={{ transform: `scale(${windowScale})` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Create Party</h3>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            title="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Enter a name for your new party. As party leader, you can invite up to 6 members.
          </p>

          <div className="form-group">
            <label htmlFor="partyNameInput">Party Name</label>
            <input
              id="partyNameInput"
              type="text"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              placeholder="e.g., Mythrill's Party"
              maxLength={30}
              className="party-name-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              className="modal-btn modal-btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="modal-btn modal-btn-primary"
              onClick={handleCreateParty}
              disabled={!partyName.trim()}
            >
              <i className="fas fa-plus"></i>
              Create Party
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyCreationDialog;
