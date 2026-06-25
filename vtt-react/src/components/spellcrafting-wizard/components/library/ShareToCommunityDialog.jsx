import React, { useState } from 'react';
import WowWindow from '../../../windows/WowWindow';
import '../../../../styles/confirmation-dialog.css';

/**
 * ShareToCommunityDialog - Dialog for sharing a spell to the community
 * Simply shares the spell directly to the community
 */
const ShareToCommunityDialog = ({
  isOpen,
  spell,
  onClose,
  onShare
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await onShare(spell);
      onClose();
    } catch (error) {
      alert(`Failed to share spell: ${error.message}`);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <WowWindow
      title="Share Spell with Community"
      isOpen={isOpen && !!spell}
      onClose={onClose}
      modal={true}
      centered={true}
      defaultSize={{ width: 520, height: 360 }}
      resizable={false}
    >
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', boxSizing: 'border-box' }}>
        <div className="confirmation-message">
          <p style={{ marginBottom: '16px', fontSize: '14px' }}>
            Share <strong>"{spell?.name}"</strong> with the community so others can discover and use it!
          </p>
          <p style={{ fontSize: '13px', color: '#8B7355', fontStyle: 'italic' }}>
            Once shared, your spell will be available for the community to browse, download, vote on, and favorite.
          </p>
        </div>

        <div className="confirmation-buttons">
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={isSharing}
          >
            Cancel
          </button>
          <button
            className="confirm-button"
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Sharing...
              </>
            ) : (
              <>
                <i className="fas fa-share-alt"></i> Share Spell
              </>
            )}
          </button>
        </div>
      </div>
    </WowWindow>
  );
};

export default ShareToCommunityDialog;
