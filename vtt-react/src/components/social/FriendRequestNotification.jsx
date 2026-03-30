/**
 * Friend Request Notification Component
 * 
 * Toast-style notification for incoming friend requests.
 * Appears in the bottom-right corner with accept/decline buttons.
 */

import React, { useState } from 'react';
import useSocialStore from '../../store/socialStore';

const FriendRequestNotification = ({ request }) => {
    const [isVisible, setIsVisible] = useState(true);
    const { acceptFriendRequest, declineFriendRequest } = useSocialStore();

    const handleAccept = async () => {
        setIsVisible(false);
        const result = await acceptFriendRequest(request.id);
        if (!result.success) {
            console.error('Failed to accept friend request:', result.error);
        }
    };

    const handleDecline = async () => {
        setIsVisible(false);
        const result = await declineFriendRequest(request.id);
        if (!result.success) {
            console.error('Failed to decline friend request:', result.error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="room-invitation-notification friend-request-notification">
            <div className="invitation-header">
                <i className="fas fa-user-plus"></i>
                <span>Friend Request</span>
                <button
                    className="close-notification"
                    onClick={() => setIsVisible(false)}
                    title="Dismiss"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="invitation-content">
                <p className="invitation-from">
                    <strong>{request.senderName || 'A player'}</strong> wants to be your friend!
                </p>
                <div className="sender-preview">
                    <div className="sender-avatar">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="sender-info">
                        <span className="sender-name">{request.senderName || 'Unknown Player'}</span>
                        <span className="sender-details">Friend ID: #{request.senderFriendId || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="invitation-actions">
                <button
                    className="accept-button"
                    onClick={handleAccept}
                >
                    <i className="fas fa-check"></i>
                    Accept
                </button>
                <button
                    className="decline-button"
                    onClick={handleDecline}
                >
                    <i className="fas fa-times"></i>
                    Decline
                </button>
            </div>
        </div>
    );
};

export default FriendRequestNotification;
