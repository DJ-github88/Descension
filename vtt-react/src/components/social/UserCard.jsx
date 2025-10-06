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
  // Helper to get background display name - ONLY custom backgrounds are valid
  const getBackgroundDisplayName = (backgroundId) => {
    if (!backgroundId) return '';

    // Only check custom backgrounds (Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel)
    const customBg = getCustomBackgroundData(backgroundId.toLowerCase());
    if (customBg) return customBg.name;

    // If not found, return empty string (invalid background)
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

  const backgroundDisplayName = user.backgroundDisplayName || getBackgroundDisplayName(user.background);
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
          {user.characterName || user.name}
          {showFriendId && user.friendId && (
            <span className="friend-id-badge" title="Friend ID">
              [#{user.friendId}]
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

        {/* Details Row: Level, Class, Background */}
        <div className="user-details">
          <span className="detail-item level-class">
            Lvl {user.level || 1} {user.class || 'Unknown'}
          </span>
          {backgroundDisplayName && (
            <span className="detail-item background-badge">{backgroundDisplayName}</span>
          )}
        </div>

        {/* Race Row */}
        {raceDisplayName && (
          <div className="user-race">
            <span className="race-name">{raceDisplayName}</span>
          </div>
        )}

        {/* Session Info */}
        {showSessionInfo && sessionDisplay}

        {/* Additional Content (e.g., ignored note) */}
        {additionalContent}
      </div>
    </div>
  );
};

export default UserCard;

