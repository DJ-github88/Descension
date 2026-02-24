/**
 * Social Notification Layer
 * 
 * Global container for social-related notifications like room and party invitations.
 * This ensures invitations are visible even if the Community window is closed.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePresenceStore from '../../store/presenceStore';
import useSocialStore from '../../store/socialStore';
import RoomInvitationNotification from './RoomInvitationNotification';
import GMSessionInvitation from './GMSessionInvitation';
import PartyInviteNotification from './PartyInviteNotification';
import FriendRequestNotification from './FriendRequestNotification';
import FriendAcceptedNotification from './FriendAcceptedNotification';
import '../../styles/global-chat.css';
import '../../styles/social-notifications.css';

const SocialNotificationLayer = () => {
  const navigate = useNavigate();
  const pendingInvitations = usePresenceStore((state) => state.pendingInvitations);
  const pendingPartyInvites = usePresenceStore((state) => state.pendingPartyInvites);
  const pendingRequests = useSocialStore((state) => state.pendingRequests);
  const acceptanceNotifications = useSocialStore((state) => state.acceptanceNotifications);
  const gmSessionInvitation = usePresenceStore((state) => state.gmSessionInvitation);
  const pendingMultiplayerJoin = usePresenceStore((state) => state.pendingMultiplayerJoin);
  const clearPendingMultiplayerJoin = usePresenceStore((state) => state.clearPendingMultiplayerJoin);

  // Handle navigation to multiplayer when player accepts GM session invitation
  useEffect(() => {
    if (pendingMultiplayerJoin) {
      console.log('🚀 [SocialNotificationLayer] Navigating to /multiplayer for GM session join');
      clearPendingMultiplayerJoin();
      navigate('/multiplayer', { replace: true });
    }
  }, [pendingMultiplayerJoin, clearPendingMultiplayerJoin, navigate]);

  return (
    <div className="social-notification-layer">
      {/* Friend Requests – only shown to the RECEIVER, never to the sender */}
      {pendingRequests
        .filter((request) => request.type === 'received')
        .map((request) => (
          <FriendRequestNotification
            key={request.id}
            request={request}
          />
        ))}

      {/* Acceptance notifications – shown to the sender when their request is accepted */}
      {acceptanceNotifications.map((notification) => (
        <FriendAcceptedNotification
          key={notification.id}
          notification={notification}
        />
      ))}

      {/* Room Invitations */}
      {pendingInvitations.map((invitation) => (
        <RoomInvitationNotification
          key={invitation.id}
          invitation={invitation}
        />
      ))}

      {/* Party Invitations */}
      {pendingPartyInvites.map((invitation) => (
        <PartyInviteNotification
          key={invitation.id}
          invitation={invitation}
        />
      ))}

      {/* GM Session Invitation */}
      {gmSessionInvitation && (
        <GMSessionInvitation
          key={gmSessionInvitation.id}
          invitation={gmSessionInvitation}
        />
      )}
    </div>
  );
};

export default SocialNotificationLayer;
