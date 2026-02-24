/**
 * Party Panel Component
 *
 * Displays party chat interface for community window.
 * Shows party members list and chat messages when user is in a party.
 */

import React, { useEffect, useRef, useState } from 'react';
import usePartyStore from '../../store/partyStore';
import usePresenceStore from '../../store/presenceStore';
import useSettingsStore from '../../store/settingsStore';
import '../../styles/social-window.css';

const PartyPanel = ({ onCreateParty, onContextMenu }) => {
  const { partyMembers, partyChatMessages, getCurrentPartyId, leaderId } = usePartyStore();
  const currentUserPresence = usePresenceStore(state => state.currentUserPresence);

  const messagesEndRef = useRef(null);
  const windowScale = useSettingsStore(state => state.windowScale);

  if (!getCurrentPartyId()) {
    return (
      <div className="party-panel-empty">
        <div className="party-panel-empty-icon">
          <i className="fas fa-users"></i>
        </div>
        <p>No party</p>
        <p className="hint">Right-click a friend or online user to invite them to a party.</p>
        {/* Create Party button removed per user request */}
      </div>
    );
  }

  // Import UserCard dynamically to avoid circular dependencies if any, 
  // though typically standard import is fine. 
  // We'll use the one from parent context or just standard import.
  const UserCard = require('./UserCard').default;

  return (
    <div className="party-panel">
      <div className="party-header">
        <h3>
          <i className="fas fa-shield-alt"></i>
          Your Party
        </h3>
        <span className="party-member-count">
          {partyMembers.length} / 6
        </span>
      </div>

      {/* Party Members List - Using UserCard for consistency */}
      <div className="party-members-list">
        {partyMembers.map((member) => {
          // Check if this member is the leader based on leaderId or isGM flag
          const isLeader = member.id === leaderId || member.isGM;
          const isCurrentPlayer = member.id === 'current-player' ||
            member.id === currentUserPresence?.userId ||
            member.userId === currentUserPresence?.userId ||
            member.uid === currentUserPresence?.userId;

          // normalize member data for UserCard
          const userCardData = {
            ...member,
            characterName: member.name, // Party members usually have 'name' set to character name
            level: member.characterLevel || member.level,
            class: member.characterClass || member.class,
            // Add status if available, default to online
            status: member.status || 'online',
            isFriend: member.isFriend // If flag exists from previous stores
          };

          return (
            <UserCard
              key={member.id}
              user={userCardData}
              nameFormat="party"
              isCurrentUser={isCurrentPlayer}
              isLeader={isLeader}
              showLeaderCrown={true}
              showYouBadge={true}
              className="party-member-card"
              onContextMenu={(e) => onContextMenu && onContextMenu(e, {
                ...member,
                userId: member.userId || member.id
              })}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PartyPanel;
