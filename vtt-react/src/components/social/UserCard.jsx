/**
 * UserCard Component
 * 
 * Unified user card component for displaying player information consistently
 * across Online, Friends, Ignored, and Party tabs in the community window.
 * 
 * Adheres strictly to character creation options:
 * - Classes: 27 classes (Pyrofiend, Minstrel, Chronarch, etc.)
 * - Backgrounds: 9 custom backgrounds (Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel)
 * - Races: Nordmark, Corvani, Dwarf, Halfling, Graveworn (with subraces)
 */

import React from 'react';
import { getCustomBackgroundData } from '../../data/customBackgroundData';
import { getFullRaceData, getRaceData } from '../../data/raceData';

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
  // Helper to get the display name based on format
  const getDisplayName = () => {
    const accName = user.accountName || user.name || (user.isGuest ? 'Guest' : 'Unknown');
    const charName = user.characterName || (user.character?.name) || '';

    if (nameFormat === 'global') {
      // For global/friends: AccountName(CharacterName)
      // Only show character name if it's special and not same as account name
      if (charName && charName !== 'Guest' && charName !== 'Unknown' && charName !== accName) {
        return `${accName}(${charName})`;
      }
      return accName;
    } else {
      // For parties/in-game: CharacterName (fallback to AccountName)
      if (charName && charName !== 'Guest' && charName !== 'Unknown') {
        return charName;
      }
      return accName;
    }
  };
  // Helper to get background display name from backgroundData
  const getBackgroundDisplayName = (backgroundId) => {
    if (!backgroundId) return '';

    // Import background data
    const { getBackgroundData } = require('../../data/backgroundData');
    const bgData = getBackgroundData(backgroundId);
    if (bgData) return bgData.name;

    // If not found, return empty string
    return '';
  };

  // Helper to get background from lore if available
  const getBackgroundFromLore = (user) => {
    // Check if user has lore object with background
    if (user.lore?.background) {
      return user.lore.background;
    }
    return '';
  };

  // Helper to get race display name
  const getRaceDisplayName = (user) => {
    // Prefer pre-computed raceDisplayName
    if (user.raceDisplayName) return user.raceDisplayName;

    // Try to compute from race and subrace
    if (user.race && user.subrace) {
      const fullRaceData = getFullRaceData(user.race, user.subrace);
      if (fullRaceData?.subrace?.name) return fullRaceData.subrace.name;
    }

    // Fallback to subrace or race
    return user.subrace || user.race || '';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      case 'busy': return '🔴';
      case 'idle': return '⚪'; // Grey for idle
      case 'offline': return '⚫'; // White/grey for appear offline
      default: return '⚪';
    }
  };

  // Get background display name - check multiple sources
  const backgroundDisplayName =
    user.backgroundDisplayName ||
    getBackgroundDisplayName(user.background) ||
    getBackgroundFromLore(user);
  const raceDisplayName = getRaceDisplayName(user);

  return (
    <div
      className={`user-card ${className} ${isCurrentUser ? 'current-user' : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={user.statusComment || ''}
    >
      {/* Status Indicator */}
      <div className="user-status">
        <span className="status-icon">{getStatusIcon(user.status)}</span>
      </div>

      {/* User Info */}
      <div className="user-info">
        {/* Name Row */}
        <div className="user-name">
          {getDisplayName()}
          {showFriendId && user.friendId && (
            <span className="friend-id-badge" title="Friend ID">
              #{user.friendId}
            </span>
          )}
          {showLeaderCrown && isLeader && (
            <span className="leader-crown" title="Party Leader">👑</span>
          )}
          {showYouBadge && isCurrentUser && (
            <span className="you-badge">(You)</span>
          )}
          {user.statusComment && (
            <span className="status-comment-indicator" title={user.statusComment}>
              💬
            </span>
          )}
        </div>

        {/* Character Details - Clean intuitive overview */}
        <div className="user-details-new">
          {/* Level and Class - Large and prominent */}
          <div className="level-class-row">
            <span className="level-text">Lvl {user.level || 1}</span>
            <span className="class-text">{user.class || 'Unknown'}</span>
          </div>

          {/* Background and Race - Clean display without labels */}
          {(backgroundDisplayName || raceDisplayName) && (
            <div className="character-traits">
              {backgroundDisplayName && (
                <span className="character-trait">{backgroundDisplayName}</span>
              )}
              {raceDisplayName && (
                <span className="character-trait">{raceDisplayName}</span>
              )}
            </div>
          )}
        </div>

        {/* Session Info */}
        {showSessionInfo && sessionDisplay}

        {/* Additional Content (e.g., ignored note) */}
        {additionalContent}
      </div>
    </div>
  );
};

export default UserCard;

