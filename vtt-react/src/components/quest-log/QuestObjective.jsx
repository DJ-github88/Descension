import React from 'react';
import { FaSkull, FaBoxOpen, FaMapMarkerAlt, FaScroll, FaCheck } from 'react-icons/fa';
import useQuestStore from '../../store/questStore';

const QuestObjective = ({ questId, objective }) => {
  const { updateObjectiveProgress, completeObjective } = useQuestStore(state => ({
    updateObjectiveProgress: state.updateObjectiveProgress,
    completeObjective: state.completeObjective
  }));

  // Determine if objective is complete
  const isComplete = objective.type === 'visit' || objective.type === 'talk'
    ? objective.completed
    : objective.progress >= objective.count;

  // Handle progress update
  const handleProgressUpdate = (e) => {
    const newProgress = parseInt(e.target.value) || 0;
    updateObjectiveProgress(questId, objective.id, newProgress);
  };

  // Handle objective completion
  const handleComplete = () => {
    completeObjective(questId, objective.id);
  };

  // Render objective icon based on type
  const renderObjectiveIcon = () => {
    switch (objective.type) {
      case 'kill':
        return <FaSkull className="quest-objective-icon" />;
      case 'collect':
        return <FaBoxOpen className="quest-objective-icon" />;
      case 'visit':
        return <FaMapMarkerAlt className="quest-objective-icon" />;
      case 'talk':
        return <FaScroll className="quest-objective-icon" />;
      default:
        return <FaScroll className="quest-objective-icon" />;
    }
  };

  // Render progress indicator
  const renderProgress = () => {
    if (objective.type === 'visit' || objective.type === 'talk') {
      return (
        <div className="quest-objective-progress-container">
          <button
            className={`quest-objective-complete-btn ${isComplete ? 'completed' : ''}`}
            onClick={handleComplete}
            disabled={isComplete}
          >
            {isComplete ? <FaCheck /> : 'Complete'}
          </button>
        </div>
      );
    }

    return (
      <div className="quest-objective-progress-container">
        <input
          type="number"
          className="quest-objective-progress-input"
          value={objective.progress}
          onChange={handleProgressUpdate}
          min="0"
          max={objective.count}
        />
        <span className="quest-objective-progress-separator">/</span>
        <span className="quest-objective-progress-total">{objective.count}</span>
      </div>
    );
  };

  return (
    <div className={`quest-objective ${isComplete ? 'complete' : ''} ${objective.optional ? 'optional' : ''}`}>
      <div className="quest-objective-content">
        {renderObjectiveIcon()}
        <div className="quest-objective-text">
          <span className="quest-objective-description">{objective.description}</span>
          {objective.optional && <span className="quest-objective-optional-tag">(Optional)</span>}
        </div>
        {renderProgress()}
      </div>
    </div>
  );
};

export default QuestObjective;
