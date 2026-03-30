import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import usePresenceStore from '../../store/presenceStore';
import '../../styles/social-notifications.css';

const SessionJoinRequest = ({ request }) => {
  const [isEntering, setIsEntering] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isExpiring, setIsExpiring] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const { respondToJoinRequest } = usePresenceStore();

  useEffect(() => {
    setIsEntering(true);
    const enterTimeout = setTimeout(() => setIsEntering(false), 300);
    return () => clearTimeout(enterTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - request.createdAt) / 1000);
      const remaining = 60 - elapsed;
      setTimeLeft(remaining);

      if (remaining <= 10 && remaining > 0) {
        setIsExpiring(true);
      }

      if (remaining <= 0) {
        setIsLeaving(true);
        setTimeout(() => {
          usePresenceStore.getState().dismissSessionJoinRequest(request.id);
        }, 300);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [request.createdAt, request.id]);

  const handleAccept = () => {
    setIsLeaving(true);
    setTimeout(() => {
      respondToJoinRequest(request.id, true);
    }, 300);
  };

  const handleDecline = () => {
    setIsLeaving(true);
    setTimeout(() => {
      respondToJoinRequest(request.id, false);
    }, 300);
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return ReactDOM.createPortal(
    <div className={`party-invite-premium gm-session-premium ${isEntering ? 'entering' : ''} ${isLeaving ? 'leaving' : ''} ${isExpiring ? 'expiring' : ''}`}>
      <div className="invite-header">
        <div className="invite-icon">
          <i className="fas fa-user-clock"></i>
        </div>
        <div className="invite-title-section">
          <h3 className="invite-title">Session Join Request</h3>
          <p className="invite-subtitle">{request.requesterName} wants to join your session</p>
        </div>
      </div>

      <div className="invite-details">
        <div className="detail-row">
          <span className="detail-label">Player:</span>
          <span className="detail-value">{request.requesterName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Room ID:</span>
          <span className="detail-value">{request.roomId.substring(0, 8)}...</span>
        </div>
      </div>

      <div className="invite-timer">
        <div className="timer-bar">
          <div
            className="timer-fill"
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          ></div>
        </div>
        <span className="timer-text">{formatTime(timeLeft)}</span>
      </div>

      <div className="invite-actions">
        <button
          className="invite-btn accept-btn"
          onClick={handleAccept}
        >
          <i className="fas fa-check"></i>
          Accept
        </button>
        <button
          className="invite-btn decline-btn"
          onClick={handleDecline}
        >
          <i className="fas fa-times"></i>
          Decline
        </button>
      </div>
    </div>,
    document.body
  );
};

const SessionJoinRequestContainer = () => {
  const sessionJoinRequests = usePresenceStore(state => state.sessionJoinRequests);

  if (sessionJoinRequests.length === 0) return null;

  return (
    <div className="session-join-requests-container">
      {sessionJoinRequests.map(request => (
        <SessionJoinRequest key={request.id} request={request} />
      ))}
    </div>
  );
};

export default SessionJoinRequestContainer;
