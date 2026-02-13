/**
 * Social Notification Layer
 * 
 * Global container for social-related notifications like room and party invitations.
 * This ensures invitations are visible even if the Community window is closed.
 */

import React from 'react';
import usePresenceStore from '../../store/presenceStore';
import useSocialStore from '../../store/socialStore';
import RoomInvitationNotification from './RoomInvitationNotification';
import GMSessionInvitation from './GMSessionInvitation';
import PartyInviteNotification from './PartyInviteNotification';
import FriendRequestNotification from './FriendRequestNotification';
import '../../styles/global-chat.css';

const SocialNotificationLayer = () => {
  const pendingInvitations = usePresenceStore((state) => state.pendingInvitations);
  const pendingPartyInvites = usePresenceStore((state) => state.pendingPartyInvites);
  const pendingRequests = useSocialStore((state) => state.pendingRequests);
  const gmSessionInvitation = usePresenceStore((state) => state.gmSessionInvitation);

  return (
    <div className="social-notification-layer">
      {/* Friend Requests */}
      {pendingRequests.map((request) => (
        <FriendRequestNotification
          key={request.id}
          request={request}
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
