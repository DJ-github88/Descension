import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import WowWindow from './WowWindow';
import useQuestStore from '../../store/questStore';
import QuestCreationForm from '../quest-log/QuestCreationForm';
import QuestObjective from '../quest-log/QuestObjective';
import QuestReward from '../quest-log/QuestReward';
import QuestCard from '../quest-log/QuestCard';
import '../../styles/quest-log-new.css';
import '../../styles/quest-log-fixes.css';
import '../../styles/party-hud.css'; // For context menu styles

// Import icons
import {
  FaScroll,
  FaCheckCircle,
  FaPlusCircle,
  FaSearch,
  FaSkull,
  FaMapMarkerAlt,
  FaBoxOpen
} from 'react-icons/fa';

const QuestLogWindow = ({ isOpen = true, onClose = () => {}, activeTab: propActiveTab, contentOnly = false }) => {
  const [activeTab, setActiveTab] = useState(propActiveTab || 'active');

  // Update activeTab when prop changes
  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Context menu state
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuQuest, setContextMenuQuest] = useState(null);
  const contextMenuRef = useRef(null);

  // Get quests from store
  const {
    quests,
    filters,
    setFilters,
    updateObjectiveProgress,
    completeObjective,
    completeQuest,
    failQuest,
    resetQuest,
    removeQuest,
    reactivateQuest,
    windowPosition,
    windowSize,
    setWindowPosition,
    setWindowSize
  } = useQuestStore(state => ({
    quests: state.quests,
    filters: state.filters,
    setFilters: state.setFilters,
    updateObjectiveProgress: state.updateObjectiveProgress,
    completeObjective: state.completeObjective,
    completeQuest: state.completeQuest,
    failQuest: state.failQuest,
    resetQuest: state.resetQuest,
    removeQuest: state.removeQuest,
    reactivateQuest: state.reactivateQuest,
    windowPosition: state.windowPosition,
    windowSize: state.windowSize,
    setWindowPosition: state.setWindowPosition,
    setWindowSize: state.setWindowSize
  }));

  // Debounced position save to avoid localStorage writes during dragging
  const debouncedPositionSave = useRef(null);

  // Handle window drag to save position (debounced for performance)
  const handleWindowDrag = useCallback((position) => {
    // Clear any existing timeout
    if (debouncedPositionSave.current) {
      clearTimeout(debouncedPositionSave.current);
    }

    // Set a new timeout to save position after dragging stops
    debouncedPositionSave.current = setTimeout(() => {
      // Only save x and y coordinates to avoid circular references
      setWindowPosition({ x: position.x, y: position.y });
    }, 100); // Save position 100ms after last drag event
  }, [setWindowPosition]);

  // Calculate proper default position (exactly like spellbook)
  const getDefaultPosition = useCallback(() => {
    if (windowPosition) {
      return windowPosition;
    }
    // Center the window on screen
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const windowWidth = windowSize.width;
    const windowHeight = windowSize.height;

    return {
      x: Math.max(0, Math.floor((screenWidth - windowWidth) / 2)),
      y: Math.max(0, Math.floor((screenHeight - windowHeight) / 2))
    };
  }, [windowPosition, windowSize]);

  // Set isLoaded to true immediately - no delay needed
  useEffect(() => {
    setIsLoaded(true);

    // Cleanup debounced position save on unmount
    return () => {
      if (debouncedPositionSave.current) {
        clearTimeout(debouncedPositionSave.current);
      }
    };
  }, []);

  // Handle clicking outside context menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

  // Filter quests based on active tab (memoized for performance)
  const filteredQuests = useMemo(() => {
    return quests.filter(quest => {
      if (activeTab === 'active') return quest.status === 'active';
      if (activeTab === 'completed') return quest.status === 'completed';
      if (activeTab === 'failed') return quest.status === 'failed';
      return true; // 'all' tab
    });
  }, [quests, activeTab]);

  // Handle tab change (memoized)
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSelectedQuest(null);
  }, []);

  // Handle quest selection (memoized)
  const handleQuestSelect = useCallback((questId) => {
    setSelectedQuest(questId);
  }, []);

  // Context menu handlers (memoized)
  const handleQuestRightClick = useCallback((e, quest) => {
    e.preventDefault();
    e.stopPropagation();

    // Only show context menu for failed quests
    if (quest.status !== 'failed') return;

    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuQuest(quest);
    setShowContextMenu(true);
  }, []);

  const handleRemoveQuest = () => {
    if (contextMenuQuest) {
      removeQuest(contextMenuQuest.id);
      if (selectedQuest === contextMenuQuest.id) {
        setSelectedQuest(null);
      }
    }
    setShowContextMenu(false);
    setContextMenuQuest(null);
  };

  const handleReactivateQuest = () => {
    if (contextMenuQuest) {
      reactivateQuest(contextMenuQuest.id);
    }
    setShowContextMenu(false);
    setContextMenuQuest(null);
  };

  // Get selected quest object
  const selectedQuestObj = quests.find(q => q.id === selectedQuest);

  // Handle objective progress update
  const handleObjectiveUpdate = (questId, objectiveId, newProgress) => {
    updateObjectiveProgress(questId, objectiveId, newProgress);
  };

  // Handle objective completion
  const handleObjectiveComplete = (questId, objectiveId) => {
    completeObjective(questId, objectiveId);
  };

  // Handle quest completion
  const handleQuestComplete = (questId) => {
    completeQuest(questId);
  };

  // Handle quest failure
  const handleQuestFail = (questId) => {
    failQuest(questId);
  };

  // Handle quest reset
  const handleQuestReset = (questId) => {
    resetQuest(questId);
  };



  // Render difficulty badge
  const renderDifficultyBadge = (difficulty) => {
    const difficultyClass = `quest-difficulty quest-difficulty-${difficulty.toLowerCase()}`;
    return <span className={difficultyClass}>{difficulty}</span>;
  };

  // Render quest details
  const renderQuestDetails = () => {
    if (!selectedQuestObj) {
      return (
        <div className="quest-details-empty" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <FaScroll className="quest-details-empty-icon" style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            opacity: 0.6,
            color: '#8b7355'
          }} />
          <p className="quest-details-empty-text" style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#8b7355'
          }}>Select a quest to view details</p>
          <p className="quest-details-empty-subtext" style={{
            margin: 0,
            opacity: 0.7,
            color: '#666'
          }}>Choose a quest from the list to see its details</p>
        </div>
      );
    }

    return (
      <div className="quest-details">
        <div className="quest-header">
          <h2 className="quest-title">{selectedQuestObj.title}</h2>
          <div className="quest-subtitle">
            <div>
              {renderDifficultyBadge(selectedQuestObj.difficulty)}
              <span>Level {selectedQuestObj.level}</span>
            </div>
            <div>
              <span>Given by: {selectedQuestObj.giver}</span>
            </div>
          </div>
        </div>

        <div className="quest-description">
          {selectedQuestObj.description}
        </div>

        <h3 className="quest-section-title">Objectives</h3>
        <ul className="quest-objective-list">
          {selectedQuestObj.objectives.map(objective => (
            <li key={objective.id} className="quest-objective-item">
              <QuestObjective
                questId={selectedQuestObj.id}
                objective={objective}
              />
            </li>
          ))}
        </ul>

        <h3 className="quest-section-title">Rewards</h3>

        {selectedQuestObj.rewards.experience > 0 && (
          <QuestReward
            reward={selectedQuestObj.rewards.experience}
            type="experience"
          />
        )}

        {(selectedQuestObj.rewards.currency.gold > 0 ||
          selectedQuestObj.rewards.currency.silver > 0 ||
          selectedQuestObj.rewards.currency.copper > 0) && (
          <QuestReward
            reward={selectedQuestObj.rewards.currency}
            type="currency"
          />
        )}

        {selectedQuestObj.rewards.items.length > 0 && (
          <div className="quest-reward-list">
            {selectedQuestObj.rewards.items.map(item => (
              <QuestReward
                key={item.id}
                reward={item}
                type="item"
              />
            ))}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="quest-actions">
            <button
              className="quest-button"
              onClick={() => handleQuestComplete(selectedQuestObj.id)}
            >
              Complete Quest
            </button>
            <button
              className="quest-button"
              onClick={() => handleQuestFail(selectedQuestObj.id)}
            >
              Abandon Quest
            </button>
          </div>
        )}

        {(activeTab === 'completed' || activeTab === 'failed') && (
          <div className="quest-actions">
            <button
              className="quest-button"
              onClick={() => handleQuestReset(selectedQuestObj.id)}
            >
              Reset Quest
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render quest creation form
  const renderQuestCreation = () => {
    return <QuestCreationForm onComplete={() => handleTabChange('active')} />;
  };

  // Render content based on active tab
  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="loading-wrapper">
          <div className="loading-text">Loading quest log...</div>
        </div>
      );
    }

    if (activeTab === 'create') {
      return renderQuestCreation();
    }

    return (
      <div className="quest-log-content">
        <div className="quest-list-sidebar">
          <div className="quest-list-header">
            <h3 className="quest-list-title">
              {activeTab === 'active' && 'Active Quests'}
              {activeTab === 'completed' && 'Completed Quests'}
              {activeTab === 'failed' && 'Failed Quests'}
              {activeTab === 'all' && 'All Quests'}
            </h3>
            <span>{filteredQuests.length}</span>
          </div>
          <div className="quest-list">
            {filteredQuests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                isSelected={selectedQuest === quest.id}
                onClick={() => handleQuestSelect(quest.id)}
                onRightClick={(e) => handleQuestRightClick(e, quest)}
              />
            ))}
            {filteredQuests.length === 0 && (
              <div className="quest-list-empty">
                <p>No quests found</p>
              </div>
            )}
          </div>
        </div>
        {renderQuestDetails()}
      </div>
    );
  };

  // Content to render
  const questContent = (
    <div className="quest-log-container">
      {!contentOnly && (
        <div className="quest-log-header">
          <button
            className={`quest-log-tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => handleTabChange('active')}
          >
            Active Quests
          </button>
          <button
            className={`quest-log-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => handleTabChange('completed')}
          >
            Completed Quests
          </button>
          <button
            className={`quest-log-tab ${activeTab === 'failed' ? 'active' : ''}`}
            onClick={() => handleTabChange('failed')}
          >
            Failed Quests
          </button>
          <button
            className={`quest-log-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All Quests
          </button>
          <button
            className={`quest-log-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => handleTabChange('create')}
          >
            Create Quest
          </button>
        </div>
      )}
      {renderContent()}
    </div>
  );

  return (
    <>
      {contentOnly ? questContent : (
        <WowWindow
          isOpen={isOpen}
          onClose={onClose}
          defaultPosition={getDefaultPosition()}
          defaultSize={windowSize}
          title="Quest Log"
          centered={false} // Handle centering manually (exactly like spellbook)
          onDrag={handleWindowDrag}
        >
          {questContent}
        </WowWindow>
      )}

      {/* Context Menu */}
      {showContextMenu && createPortal(
        <div
          ref={contextMenuRef}
          className="character-hud-context-menu"
          style={{
            position: 'fixed',
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            zIndex: 999999
          }}
        >
          <div className="context-menu-header">
            <div className="character-name">{contextMenuQuest?.title}</div>
            <div className="character-details">Failed Quest</div>
          </div>

          <div className="context-menu-section">
            <button className="context-menu-button" onClick={handleReactivateQuest}>
              <i className="fas fa-redo"></i> Reactivate Quest
            </button>
            <button className="context-menu-button" onClick={handleRemoveQuest}>
              <i className="fas fa-trash"></i> Remove Quest
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default QuestLogWindow;
