/**
 * UserCard Component
 * 
 * Unified user card component for displaying player information consistently
 * across Online, Friends, Ignored, and Party tabs in the community window.
 * 
 * Display rules:
 * - If NO character is selected: show only the display/account name
 * - If a character IS selected: show character name, subrace, class, and level
 */

import React from 'react';
import { getFullRaceData } from '../../data/raceData';
import '../../styles/user-card.css';

const UserCard = ({
  user,
  nameFormat = 'party', // 'global' or 'party'
  isCurrentUser = false,
  isLeader = false,
  showYouBadge = false,
  showLeaderCrown = false,
  showSessionInfo = false,
  sessionDisplay = null,
  showFriendId = false,
  onClick,
  onContextMenu,
  className = '',
  additionalContent = null
}) => {
  // Determine if user has a character selected
  const charName = user.characterName || (user.character?.name) || '';
  const hasCharacter = charName && charName !== 'Guest' && charName !== 'Unknown' && charName !== 'none' && charName !== '' && charName !== 'Adventurer' && charName !== 'Unknown Adventurer';

  // Account/display name (always available)
  const accountName = user.accountName || user.displayName || user.name || (user.isGuest ? 'Guest' : 'Adventurer');

  // Get race display name only when character exists
  const getRaceDisplayName = (userData) => {
    if (!hasCharacter) return '';
    if (userData.raceDisplayName) return userData.raceDisplayName;
    if (userData.character?.raceDisplayName) return userData.character.raceDisplayName;

    const race = userData.race || userData.character?.race;
    const subrace = userData.subrace || userData.character?.subrace;

    if (race && subrace) {
      const fullRaceData = getFullRaceData(race, subrace);
      if (fullRaceData?.subrace?.name) return fullRaceData.subrace.name;
    }
    return subrace || race || '';
  };

  const actualStatus = user.status || 'online';
  const statusComment = user.statusComment;

  // Character stats — only if a character is selected
  const charLevel = hasCharacter ? (user.level || user.character?.level || user.characterLevel || 1) : null;
  const charClass = hasCharacter ? (user.class || user.character?.class || user.characterClass || '') : null;
  const charRace = hasCharacter ? getRaceDisplayName(user) : null;

  // Filter out empty/placeholder values
  const showCharClass = charClass && charClass !== 'Unknown' && charClass !== 'Unknown Class';
  const showCharRace = charRace && charRace !== 'Unknown Race' && charRace !== 'Unknown';

  const isYou = isCurrentUser && showYouBadge;
  const isLeaderBadge = isLeader && showLeaderCrown;

  // Build the primary display name
  const getPrimaryName = () => {
    if (nameFormat === 'global') {
      // Global tab: Show account name, and character name in parentheses if different
      if (hasCharacter && charName !== accountName) {
        return accountName;
      }
      return accountName;
    } else {
      // Party/other tabs: Show character name if available, otherwise account name
      if (hasCharacter) {
        return charName;
      }
      return accountName;
    }
  };

  // Show character name subtitle on global tab
  const showCharNameSubtitle = nameFormat === 'global' && hasCharacter && charName !== accountName;

  return (
    <div
      className={`user-card ${className} ${isCurrentUser ? 'current-player' : ''} ${user.isFriend ? 'is-friend' : ''} ${user.isIgnored ? 'is-ignored' : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={statusComment || ''}
    >
      {/* Header row: status orb + name + badges */}
      <div className="user-card-header">
        <div className="user-status-orb-container">
          <span className={`status-orb status-${actualStatus.toLowerCase()}`} title={actualStatus}></span>
        </div>

        <div className="user-main-info">
          <div className="user-name-row">
            <span className="user-name" title={getPrimaryName()}>{getPrimaryName()}</span>
            {isYou && <span className="badge badge-you">YOU</span>}
            {isLeaderBadge && <span className="badge badge-leader"><i className="fas fa-crown"></i></span>}
          </div>
          {showCharNameSubtitle && (
            <span className="user-char-subtitle">{charName}</span>
          )}
          {statusComment && <span className="user-status-comment">{statusComment}</span>}
        </div>
      </div>

      {/* Character details — ONLY if character is selected and has meaningful data */}
      {hasCharacter && (showCharClass || showCharRace || charLevel) && (
        <div className="user-card-body">
          <div className="character-stats-row">
            {charLevel && <span className="character-level-badge">Lv. {charLevel}</span>}
            {showCharRace && <span className="character-race">{charRace}</span>}
            {showCharClass && <span className="character-class">{charClass}</span>}
          </div>
        </div>
      )}

      {/* Session info */}
      {showSessionInfo && sessionDisplay && (
        <div className="user-card-session">
          {sessionDisplay}
        </div>
      )}

      {/* Friend ID badge */}
      {showFriendId && user.friendId && (
        <div className="user-card-friend-id">
          <span className="friend-id-tag">#{user.friendId}</span>
        </div>
      )}

      {/* Additional content (notes, action buttons, etc.) */}
      {additionalContent && (
        <div className="user-card-footer">
          {additionalContent}
        </div>
      )}
    </div>
  );
};

export default UserCard;
