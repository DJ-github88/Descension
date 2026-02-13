/**
 * Party Invitation Notification Component
 * 
 * Toast-style notification for party invitations from friends.
 * Appears in the bottom-right corner with accept/decline buttons.
 */

import React, { useState, useEffect } from 'react';
import usePresenceStore from '../../store/presenceStore';

const PartyInviteNotification = ({ invitation }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds default
    const [isExpiring, setIsExpiring] = useState(false);

    const respondToPartyInvite = usePresenceStore((state) => state.respondToPartyInvite);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                if (prev <= 11) {
                    setIsExpiring(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto-decline when timer expires (separate from the timer to avoid setState-in-render)
    useEffect(() => {
        if (timeLeft === 0 && isVisible) {
            handleDecline();
        }
    }, [timeLeft]);

    // Handle accept
    const handleAccept = () => {
        respondToPartyInvite(invitation.id, true);
        setIsVisible(false);
    };

    // Handle decline
    const handleDecline = () => {
        respondToPartyInvite(invitation.id, false);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={`room-invitation-notification party-invitation-notification ${isExpiring ? 'expiring' : ''}`}>
            <div className="invitation-header">
                <i className="fas fa-users-cog"></i>
                <span>Party Invitation</span>
                <button
                    className="close-notification"
                    onClick={handleDecline}
                    title="Decline"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="invitation-content">
                <p className="invitation-from">
                    <strong>{invitation.senderName}</strong> has invited you to a party!
                </p>
                <div className="sender-preview">
                    <div className="sender-avatar">
                        <i className="fas fa-user-shield"></i>
                    </div>
                    <div className="sender-info">
                        <span className="sender-name">{invitation.senderName}</span>
                        <span className="sender-details">Level {invitation.senderLevel} {invitation.senderClass}</span>
                    </div>
                </div>
            </div>

            <div className="invitation-timer">
                <i className="fas fa-clock"></i>
                <span>Expires in {timeLeft}s</span>
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

export default PartyInviteNotification;
