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
        <p className="hint">Create or join a party to see party chat and member list.</p>
        {onCreateParty && (
          <button className="create-party-btn-large" onClick={onCreateParty}>
            <i className="fas fa-plus"></i> Create Party
          </button>
        )}
      </div>
    );
  }

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

      {/* Party Members List */}
      <div className="party-members-list-simple">
        {partyMembers.map((member) => {
          // Check if this member is the leader based on leaderId or isGM flag
          const isLeader = member.id === leaderId || member.isGM;
          const isCurrentPlayer = member.id === 'current-player' ||
            member.id === currentUserPresence?.userId ||
            member.userId === currentUserPresence?.userId ||
            member.uid === currentUserPresence?.userId;

          return (
            <div
              key={member.id}
              className={`party-member-item-simple ${isCurrentPlayer ? 'is-self' : ''}`}
              onContextMenu={(e) => onContextMenu && onContextMenu(e, {
                ...member,
                userId: member.userId || member.id // Ensure userId is available for the context menu
              })}
            >
              <div className="member-main-info">
                <span className="member-name-simple">
                  {member.name}
                  {isLeader && <i className="fas fa-crown leader-icon-simple" title="Party Leader"></i>}
                  {isCurrentPlayer && <span className="self-tag">(You)</span>}
                </span>
                <span className="member-subtitle-simple">
                  Lvl {member.characterLevel || member.level} {member.characterClass || member.class}
                </span>
              </div>

              <div className={`member-status-simple ${member.status || 'online'}`}>
                {(!member.status || member.status === 'online') && <i className="fas fa-circle online" title="Online"></i>}
                {member.status === 'away' && <i className="fas fa-circle away" title="Away"></i>}
                {member.status === 'busy' && <i className="fas fa-circle busy" title="Busy"></i>}
                {member.status === 'offline' && <i className="fas fa-circle offline" title="Offline"></i>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartyPanel;
