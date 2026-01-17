import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import WowWindow from './WowWindow';
import useQuestStore from '../../store/questStore';
import useGameStore from '../../store/gameStore';
import usePresenceStore from '../../store/presenceStore';
import QuestCreationForm from '../quest-log/QuestCreationForm';
import QuestObjective from '../quest-log/QuestObjective';
import QuestReward from '../quest-log/QuestReward';
import QuestCard from '../quest-log/QuestCard';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
import SmartTabButton from '../common/SmartTabButton';
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
  FaBoxOpen,
  FaUser,
  FaShieldAlt
} from 'react-icons/fa';

const QuestLogWindow = ({ isOpen = true, onClose = () => { }, activeTab: propActiveTab, contentOnly = false }) => {
  const [activeTab, setActiveTab] = useState(propActiveTab || 'active');
  const { isGMMode } = useGameStore();

  // Update activeTab when prop changes
  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  // Redirect players away from create tab if they somehow access it
  useEffect(() => {
    if (!isGMMode && activeTab === 'create') {
      setActiveTab('active');
    }
  }, [isGMMode, activeTab]);
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
    setWindowSize,
    activeQuestShares
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
    setWindowSize: state.setWindowSize,
    activeQuestShares: state.activeQuestShares
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

  // Define tabs for consistent formatting - conditionally show Create Quest tab only for GMs
  const tabs = [
    { id: 'active', label: 'Active Quests' },
    { id: 'completed', label: 'Completed Quests' },
    { id: 'failed', label: 'Failed Quests' },
    { id: 'all', label: 'All Quests' },
    ...(isGMMode ? [{ id: 'create', label: 'Create Quest' }] : [])
  ];

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

  // Handle sharing quest to players
  const handleShareQuest = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    // Get socket from window global (set by MultiplayerApp)
    const socket = window.multiplayerSocket;
    const gameStore = useGameStore.getState();

    if (gameStore.isInMultiplayer && socket && socket.connected) {
      // Emit quest share event
      socket.emit('share_quest', {
        quest: quest
      });

      // Track quest as shared locally
      const questStoreActions = useQuestStore.getState();
      if (questStoreActions.trackSharedQuest) {
        questStoreActions.trackSharedQuest(questId);
      }

      // Also add to party chat as notification
      const { addPartyChatMessage } = usePresenceStore.getState();
      if (addPartyChatMessage) {
        addPartyChatMessage({
          id: `quest_share_${Date.now()}`,
          senderId: 'system',
          senderName: 'Game Master',
          content: `Shared quest: ${quest.title}`,
          timestamp: new Date().toISOString(),
          type: 'system'
        });
      }
    } else {
      // Fallback for single player mode
      console.log('Sharing quest:', quest.title, 'Socket connected:', socket?.connected, 'isInMultiplayer:', gameStore.isInMultiplayer);
      alert(`Quest "${quest.title}" would be shared with all players. (Multiplayer connection required)`);
    }
  };

  // Handle player requesting quest completion (for shared quests only)
  const handleRequestCompletion = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    // Only shared quests require GM approval
    if (!quest.isShared) {
      // Non-shared quests can be completed directly
      completeQuest(questId);
      return;
    }

    // Get socket from gameStore
    const gameStore = useGameStore.getState();
    const socket = gameStore.multiplayerSocket;

    if (gameStore.isInMultiplayer && socket && socket.connected) {
      // Request completion from GM
      socket.emit('quest_complete_request', {
        quest: quest
      });

      // Notify player that request was sent
      const { addPartyChatMessage } = usePresenceStore.getState();
      if (addPartyChatMessage) {
        addPartyChatMessage({
          id: `quest_completion_request_${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          content: `Requested completion for "${quest.title}". Awaiting GM approval...`,
          timestamp: new Date().toISOString(),
          type: 'system'
        });
      }
    } else {
      // Fallback for single player
      completeQuest(questId);
    }
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
        <div className="quest-details-content">
          <div className="quest-header">
            <div className="quest-title-wrapper">
              <h2 className="quest-title">{selectedQuestObj.title}</h2>
            </div>
            <div className="quest-meta">
              <div className="quest-meta-left">
                {renderDifficultyBadge(selectedQuestObj.difficulty)}
                <div className="quest-level-badge">
                  <FaShieldAlt className="quest-meta-icon" />
                  <span className="quest-level-text">Level {selectedQuestObj.level}</span>
                </div>
              </div>
              <div className="quest-meta-right">
                <FaUser className="quest-meta-icon" />
                <span className="quest-giver-text">
                  <span className="quest-giver-label">Given by:</span>
                  <span className="quest-giver-name">{selectedQuestObj.giver}</span>
                </span>
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

          <div className="quest-rewards-container">
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
          </div>
        </div>

        {/* Share Status Indicator - shown to GM when quest is being shared */}
        {isGMMode && activeQuestShares && activeQuestShares[selectedQuestObj.id] && (
          <div className="quest-share-status">
            <div className="quest-share-status-header">
              <span className="share-status-icon">📤</span>
              <span className="share-status-title">Quest Shared</span>
            </div>
            <div className="quest-share-status-players">
              {Object.entries(activeQuestShares[selectedQuestObj.id].players || {}).map(([playerId, player]) => (
                <div
                  key={playerId}
                  className={`share-player-status status-${player.status}`}
                >
                  <span className="player-status-icon">
                    {player.status === 'pending' && '⏳'}
                    {player.status === 'accepted' && '✅'}
                    {player.status === 'declined' && '❌'}
                  </span>
                  <span className="player-name">{player.name}</span>
                  <span className="player-status-text">
                    {player.status === 'pending' && 'Pending...'}
                    {player.status === 'accepted' && 'Accepted'}
                    {player.status === 'declined' && 'Declined'}
                  </span>
                </div>
              ))}
              {Object.keys(activeQuestShares[selectedQuestObj.id].players || {}).length === 0 && (
                <div className="share-status-waiting">
                  <span className="waiting-icon">📡</span>
                  <span>Waiting for player responses...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'active' && (
          <div className="quest-actions">
            <button
              className={`quest-button ${selectedQuestObj.isShared ? 'quest-button-request' : ''}`}
              onClick={() => handleRequestCompletion(selectedQuestObj.id)}
              title={selectedQuestObj.isShared ? 'Request GM approval for quest completion' : 'Mark quest as complete'}
            >
              {selectedQuestObj.isShared ? 'Request Completion' : 'Complete Quest'}
            </button>
            <button
              className="quest-button"
              onClick={() => handleQuestFail(selectedQuestObj.id)}
            >
              Abandon Quest
            </button>
            {isGMMode && (
              <button
                className="quest-button quest-button-share"
                onClick={() => handleShareQuest(selectedQuestObj.id)}
                title="Share this quest with all players"
              >
                Share Quest
              </button>
            )}
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
            {isGMMode && (
              <button
                className="quest-button quest-button-share"
                onClick={() => handleShareQuest(selectedQuestObj.id)}
                title="Share this quest with all players"
              >
                Share Quest
              </button>
            )}
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
          customHeader={
            <div className="spellbook-tab-container">
              {tabs.map(tab => (
                <SmartTabButton
                  key={tab.id}
                  title={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                />
              ))}
            </div>
          }
        >
          {questContent}
        </WowWindow>
      )}

      {/* Context Menu */}
      {showContextMenu && createPortal(
        <UnifiedContextMenu
          visible={true}
          x={contextMenuPosition.x}
          y={contextMenuPosition.y}
          onClose={() => setShowContextMenu(false)}
          items={[
            {
              icon: <i className="fas fa-redo"></i>,
              label: 'Reactivate Quest',
              onClick: handleReactivateQuest
            },
            {
              icon: <i className="fas fa-trash"></i>,
              label: 'Remove Quest',
              onClick: handleRemoveQuest,
              className: 'danger'
            }
          ]}
        />,
        document.body
      )}
    </>
  );
};

export default QuestLogWindow;
