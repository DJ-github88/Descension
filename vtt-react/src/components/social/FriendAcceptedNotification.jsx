/**
 * Friend Accepted Notification Component
 *
 * Toast-style notification shown to the sender when their friend request is accepted.
 */

import React, { useEffect, useState } from 'react';
import useSocialStore from '../../store/socialStore';

const FriendAcceptedNotification = ({ notification }) => {
    const [isVisible, setIsVisible] = useState(true);
    const dismissAcceptanceNotification = useSocialStore((s) => s.dismissAcceptanceNotification);

    // Auto-dismiss after 6 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            handleDismiss();
        }, 6000);
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        dismissAcceptanceNotification(notification.id);
    };

    if (!isVisible) return null;

    return (
        <div className="room-invitation-notification friend-accepted-notification">
            <div className="invitation-header">
                <i className="fas fa-user-check"></i>
                <span>Friend Request Accepted!</span>
                <button
                    className="close-notification"
                    onClick={handleDismiss}
                    title="Dismiss"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="invitation-content">
                <p className="invitation-from">
                    🎉 <strong>{notification.friendName || 'A player'}</strong> accepted your friend request!
                </p>
            </div>
        </div>
    );
};

export default FriendAcceptedNotification;
