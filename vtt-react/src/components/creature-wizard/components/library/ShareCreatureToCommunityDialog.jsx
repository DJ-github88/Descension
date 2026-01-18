import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import '../../../../styles/confirmation-dialog.css';

/**
 * ShareCreatureToCommunityDialog - Dialog for sharing a creature to the community
 * Simply shares the creature directly to the community
 */
const ShareCreatureToCommunityDialog = ({
    isOpen,
    creature,
    onClose,
    onShare
}) => {
    const [isSharing, setIsSharing] = useState(false);

    if (!isOpen || !creature) return null;

    const handleShare = async () => {
        setIsSharing(true);
        try {
            await onShare(creature);
            onClose();
        } catch (error) {
            alert(`Failed to share creature: ${error.message}`);
        } finally {
            setIsSharing(false);
        }
    };

    return createPortal(
        <div className="confirmation-dialog-overlay" onClick={onClose}>
            <div
                className="confirmation-dialog"
                onClick={(e) => e.stopPropagation()}
                style={{ minWidth: '500px', maxWidth: '600px' }}
            >
                <div className="confirmation-message">
                    <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#5a1e12' }}>
                        Share Creature with Community
                    </h3>
                    <p style={{ marginBottom: '16px', fontSize: '14px' }}>
                        Share <strong>"{creature.name}"</strong> with the community so others can discover and use it!
                    </p>
                    <p style={{
                        marginTop: '16px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: '#8B7355',
                        fontStyle: 'italic'
                    }}>
                        Once shared, your creature will be available for the community to browse, download, and rate.
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
                                <i className="fas fa-share-alt"></i> Share Creature
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ShareCreatureToCommunityDialog;
