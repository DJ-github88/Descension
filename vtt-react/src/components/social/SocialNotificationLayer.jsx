/**
 * Social Notification Layer
 *
 * Global container for social-related notifications.
 * Split into two layers:
 *  - Centered overlay: party/room/GM session invites (modal-style, center screen)
 *  - Toast layer: friend requests, accept/decline feedback, party event toasts (bottom-right)
 */

import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePresenceStore from '../../store/presenceStore';
import useSocialStore from '../../store/socialStore';
import RoomInvitationNotification from './RoomInvitationNotification';
import GMSessionInvitation from './GMSessionInvitation';
import PartyInviteNotification from './PartyInviteNotification';
import FriendRequestNotification from './FriendRequestNotification';
import FriendAcceptedNotification from './FriendAcceptedNotification';
import PartyInviteSentNotification from './PartyInviteSentNotification';
import PartyEventToast from './PartyEventToast';
import '../../styles/global-chat.css';
import '../../styles/social-notifications.css';

const SocialNotificationLayer = () => {
  const navigate = useNavigate();

  // Invitation state
  const pendingInvitations = usePresenceStore((state) => state.pendingInvitations);
  const pendingPartyInvites = usePresenceStore((state) => state.pendingPartyInvites);
  const gmSessionInvitation = usePresenceStore((state) => state.gmSessionInvitation);
  const pendingMultiplayerJoin = usePresenceStore((state) => state.pendingMultiplayerJoin);
  const clearPendingMultiplayerJoin = usePresenceStore((state) => state.clearPendingMultiplayerJoin);

  // Sender feedback & party event toasts
  const sentPartyInvites = usePresenceStore((state) => state.sentPartyInvites);
  const partyEventNotifications = usePresenceStore((state) => state.partyEventNotifications);
  const dismissSentPartyInvite = usePresenceStore((state) => state.dismissSentPartyInvite);
  const dismissPartyEventNotification = usePresenceStore((state) => state.dismissPartyEventNotification);

  // Friend social notifications
  const pendingRequests = useSocialStore((state) => state.pendingRequests);
  const acceptanceNotifications = useSocialStore((state) => state.acceptanceNotifications);

  // Handle navigation when player accepts GM session invitation
  useEffect(() => {
    if (pendingMultiplayerJoin) {
      console.log('🚀 [SocialNotificationLayer] Navigating to /multiplayer for GM session join');
      clearPendingMultiplayerJoin();
      navigate('/multiplayer', { replace: true });
    }
  }, [pendingMultiplayerJoin, clearPendingMultiplayerJoin, navigate]);

  const handleDismissSentInvite = useCallback((id) => {
    dismissSentPartyInvite(id);
  }, [dismissSentPartyInvite]);

  const handleDismissPartyEvent = useCallback((id) => {
    dismissPartyEventNotification(id);
  }, [dismissPartyEventNotification]);

  // Only render the center-screen modal layer when there are modal invitations
  const hasCenteredInvites = pendingPartyInvites.length > 0
    || pendingInvitations.length > 0
    || !!gmSessionInvitation;

  return (
    <>
      {/* ─── Center-Screen Invite Modal Layer ─── */}
      {hasCenteredInvites && (
        <div className="invite-overlay-center">
          {/* Party Invitations */}
          {pendingPartyInvites.map((invitation) => (
            <PartyInviteNotification
              key={invitation.id}
              invitation={invitation}
            />
          ))}

          {/* Room Invitations */}
          {pendingInvitations.map((invitation) => (
            <RoomInvitationNotification
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
      )}

      {/* ─── Bottom-Right Toast Layer ─── */}
      <div className="social-notification-layer">
        {/* Friend Requests – only shown to the RECEIVER */}
        {pendingRequests
          .filter((request) => request.type === 'received')
          .map((request) => (
            <FriendRequestNotification
              key={request.id}
              request={request}
            />
          ))}

        {/* Friend acceptance notifications */}
        {acceptanceNotifications.map((notification) => (
          <FriendAcceptedNotification
            key={notification.id}
            notification={notification}
          />
        ))}

        {/* Party invite sent toasts (sender feedback) */}
        {sentPartyInvites.map((invite) => (
          <PartyInviteSentNotification
            key={invite.id}
            invite={invite}
            onDismiss={handleDismissSentInvite}
          />
        ))}

        {/* Party event toasts (join / leave / accepted / declined) */}
        {partyEventNotifications.map((event) => (
          <PartyEventToast
            key={event.id}
            event={event}
            onDismiss={handleDismissPartyEvent}
          />
        ))}
      </div>
    </>
  );
};

export default SocialNotificationLayer;
