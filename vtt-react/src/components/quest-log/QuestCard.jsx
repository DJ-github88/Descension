import React, { memo } from 'react';

const QuestCard = memo(({ quest, isSelected, onClick, onRightClick }) => {
  // Calculate quest progress percentage
  const calculateProgress = () => {
    if (!quest.objectives || quest.objectives.length === 0) return 0;

    const requiredObjectives = quest.objectives.filter(obj => !obj.optional);
    if (requiredObjectives.length === 0) return 0;

    const completedCount = requiredObjectives.reduce((count, obj) => {
      if (obj.type === 'visit' || obj.type === 'talk') {
        return obj.completed ? count + 1 : count;
      } else {
        return obj.progress >= obj.count ? count + 1 : count;
      }
    }, 0);

    return Math.round((completedCount / requiredObjectives.length) * 100);
  };

  // Render difficulty badge
  const renderDifficultyBadge = () => {
    const difficultyClass = `quest-difficulty quest-difficulty-${quest.difficulty.toLowerCase()}`;
    return <span className={difficultyClass}>{quest.difficulty}</span>;
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (quest.status) {
      case 'completed':
        return <span className="quest-status-icon completed">✓</span>;
      case 'failed':
        return <span className="quest-status-icon failed">✗</span>;
      default:
        return null;
    }
  };

  const progress = calculateProgress();

  return (
    <div
      className={`quest-card ${isSelected ? 'selected' : ''} ${quest.status}`}
      onClick={onClick}
      onContextMenu={onRightClick}
      style={{ cursor: quest.status === 'failed' ? 'context-menu' : 'pointer' }}
    >
      <div className={`quest-status-icon ${quest.status || 'active'}`}></div>
      <div className="quest-card-content">
        <div className="quest-card-title">
          {quest.title}
        </div>
        <div className="quest-card-meta">
          <span className="quest-level">Level {quest.level}</span> • {quest.giver}
        </div>

        {quest.status === 'active' && (
          <div className="quest-progress">
            <div className="quest-progress-bar">
              <div
                className="quest-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="quest-progress-text">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
});

QuestCard.displayName = 'QuestCard';

export default QuestCard;
