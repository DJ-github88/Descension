/**
 * Enhanced GM Tools Panel
 * Provides Roll20-like GM controls and player management
 */

import React, { useState, useEffect } from 'react';
import useGameStore from '../../store/gameStore';
import useCombatStore from '../../store/combatStore';
import useChatStore from '../../store/chatStore';
import SocialEncounterGenerator from './SocialEncounterGenerator';
import './GMToolsPanel.css';

const GMToolsPanel = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('players');
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [roomSettings, setRoomSettings] = useState({});

  const {
    isGMMode,
    isInMultiplayer,
    multiplayerRoom,
    multiplayerSocket
  } = useGameStore();

  const roomId = multiplayerRoom?.id || '';

  const {
    isInCombat,
    currentTurn,
    turnOrder,
    startCombat,
    endCombat,
    nextTurn,
    addToCombat,
    removeFromCombat
  } = useCombatStore();

  const { addNotification } = useChatStore();

  // Listen for player updates
  useEffect(() => {
    if (multiplayerSocket) {
      multiplayerSocket.on('player_list_updated', (players) => {
        setConnectedPlayers(players);
      });

      multiplayerSocket.on('room_settings_updated', (settings) => {
        setRoomSettings(settings);
      });

      // Request current player list
      multiplayerSocket.emit('request_player_list');
      multiplayerSocket.emit('request_room_settings');
    }

    return () => {
      if (multiplayerSocket) {
        multiplayerSocket.off('player_list_updated');
        multiplayerSocket.off('room_settings_updated');
      }
    };
  }, [multiplayerSocket]);

  const handleKickPlayer = (playerId) => {
    if (multiplayerSocket && window.confirm('Are you sure you want to kick this player?')) {
      multiplayerSocket.emit('kick_player', { playerId });
      addNotification('system', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Player has been kicked from the room.`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleMutePlayer = (playerId) => {
    if (multiplayerSocket) {
      multiplayerSocket.emit('mute_player', { playerId });
      addNotification('system', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Player has been muted.`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleRoomSettingChange = (setting, value) => {
    const newSettings = { ...roomSettings, [setting]: value };
    setRoomSettings(newSettings);

    if (multiplayerSocket) {
      multiplayerSocket.emit('update_room_settings', newSettings);
    }
  };

  const handleCombatAction = (action, data = {}) => {
    switch (action) {
      case 'start':
        startCombat();
        if (multiplayerSocket) {
          multiplayerSocket.emit('combat_started', { turnOrder });
        }
        break;
      case 'end':
        endCombat();
        if (multiplayerSocket) {
          multiplayerSocket.emit('combat_ended');
        }
        break;
      case 'next_turn':
        nextTurn();
        if (multiplayerSocket) {
          multiplayerSocket.emit('combat_turn_changed', { currentTurn });
        }
        break;
      default:
        break;
    }
  };

  const renderPlayersTab = () => {
    const [showXPModal, setShowXPModal] = useState(false);
    const [partyXPAmount, setPartyXPAmount] = useState('');

    const handleAwardPartyXP = () => {
      const xpAmount = parseInt(partyXPAmount);
      if (isNaN(xpAmount) || xpAmount <= 0) return;

      // Award XP to all players including self
      console.log(`💰 Awarding ${xpAmount} XP to entire party`);

      if (isInMultiplayer && multiplayerSocket?.connected) {
        multiplayerSocket.emit('gm_action', {
          type: 'award_xp',
          amount: xpAmount,
          roomId: roomId,
          targetPlayerIds: ['all'] // Special target for all players
        });
      }

      // Also apply locally for the GM's character if they have one
      const useCharacterStore = require('../../store/characterStore').default;
      useCharacterStore.getState().awardExperience(xpAmount);

      addNotification('system', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `GM awarded ${xpAmount} XP to the party!`,
        isSystem: true,
        timestamp: new Date().toISOString()
      });

      setShowXPModal(false);
      setPartyXPAmount('');
    };

    const handleHealAll = () => {
      if (window.confirm('Are you sure you want to heal the entire party to full?')) {
        console.log('💚 Healing entire party');

        if (isInMultiplayer && multiplayerSocket?.connected) {
          multiplayerSocket.emit('gm_action', {
            type: 'heal_all',
            action: 'heal_all',
            roomId: roomId
          });
        }

        // Also apply locally
        const useCharacterStore = require('../../store/characterStore').default;
        const charStore = useCharacterStore.getState();
        charStore.updateResource('health', charStore.health.max, charStore.health.max);

        addNotification('system', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `You have healed the entire party.`,
          isSystem: true,
          timestamp: new Date().toISOString()
        });
      }
    };

    return (
      <div className="gm-tab-content">
        <h3>Connected Players ({connectedPlayers.length})</h3>

        {/* Party-wide Actions */}
        <div className="party-actions" style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
          <button
            className="gm-btn gm-btn-primary"
            onClick={() => setShowXPModal(true)}
            title="Award XP to entire party"
          >
            ⭐ Award Party XP
          </button>
          <button
            className="gm-btn gm-btn-primary"
            onClick={handleHealAll}
            title="Heal entire party to full"
            style={{ backgroundColor: '#2ecc71' }}
          >
            💚 Heal All
          </button>
        </div>

        <div className="players-list">
          {connectedPlayers.map(player => (
            <div key={player.id} className="player-item">
              <div className="player-info">
                <div
                  className="player-color"
                  style={{ backgroundColor: player.color }}
                />
                <div className="player-details">
                  <span className="player-name">{player.name}</span>
                  <span className="player-status">
                    {player.isGM ? 'GM' : 'Player'} • {player.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              {!player.isGM && (
                <div className="player-actions">
                  <button
                    className="gm-btn gm-btn-small"
                    onClick={() => handleMutePlayer(player.id)}
                    title="Mute Player"
                  >
                    🔇
                  </button>
                  <button
                    className="gm-btn gm-btn-small gm-btn-danger"
                    onClick={() => handleKickPlayer(player.id)}
                    title="Kick Player"
                  >
                    👢
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* XP Award Modal */}
        {showXPModal && (
          <div
            className="modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10002
            }}
            onClick={() => setShowXPModal(false)}
          >
            <div
              className="xp-modal"
              style={{
                backgroundColor: '#f0e6d2',
                border: '2px solid #a08c70',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                fontFamily: "'Bookman Old Style', 'Garamond', serif",
                color: '#7a3b2e',
                minWidth: '300px',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                Award Party Experience
              </h3>
              <input
                type="number"
                min="1"
                placeholder="Enter XP amount..."
                value={partyXPAmount}
                onChange={(e) => setPartyXPAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #a08c70',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginBottom: '15px',
                  textAlign: 'center'
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAwardPartyXP();
                  } else if (e.key === 'Escape') {
                    setShowXPModal(false);
                  }
                }}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#7a3b2e',
                    color: '#f0e6d2',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  onClick={handleAwardPartyXP}
                >
                  Award
                </button>
                <button
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#a08c70',
                    color: '#f0e6d2',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  onClick={() => setShowXPModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCombatTab = () => (
    <div className="gm-tab-content">
      <h3>Combat Management</h3>
      <div className="combat-controls">
        <div className="combat-status">
          <span className={`combat-indicator ${isInCombat ? 'active' : 'inactive'}`}>
            {isInCombat ? '⚔️ Combat Active' : '🕊️ Combat Inactive'}
          </span>
        </div>

        <div className="combat-actions">
          {!isInCombat ? (
            <button
              className="gm-btn gm-btn-primary"
              onClick={() => handleCombatAction('start')}
            >
              Start Combat
            </button>
          ) : (
            <>
              <button
                className="gm-btn gm-btn-secondary"
                onClick={() => handleCombatAction('next_turn')}
              >
                Next Turn
              </button>
              <button
                className="gm-btn gm-btn-danger"
                onClick={() => handleCombatAction('end')}
              >
                End Combat
              </button>
              <button
                className="gm-btn gm-btn-danger"
                onClick={() => {
                  if (window.confirm('FORCE RESET combat? This will clear all combat state for everyone.')) {
                    import('../../store/combatStore').then(({ default: useCombatStore }) => {
                      useCombatStore.getState().forceResetCombat();
                    });
                  }
                }}
                style={{ marginLeft: '10px', backgroundColor: '#e74c3c', borderStyle: 'dashed' }}
              >
                Reset Combat
              </button>
            </>
          )}
        </div>

        {isInCombat && (
          <div className="turn-order">
            <h4>Turn Order</h4>
            <div className="turn-list">
              {turnOrder.map((participant, index) => (
                <div
                  key={participant.id}
                  className={`turn-item ${index === currentTurn ? 'current-turn' : ''}`}
                >
                  <span className="turn-name">{participant.name}</span>
                  <span className="turn-initiative">{participant.initiative}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderWorldTab = () => (
    <div className="gm-tab-content">
      <h3>World & Map Tools</h3>
      <div className="world-actions" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="action-group">
          <h4>Fog of War</h4>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            Actions affecting the current map and visibility for all players.
          </p>
          <button
            className="gm-btn gm-btn-danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to CLEAR ALL fog of war for everyone?')) {
                import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
                  useLevelEditorStore.getState().clearAllFog();
                });
              }
            }}
          >
            🌫️ Clear All Fog (Broadcast)
          </button>
        </div>

        <div className="action-group">
          <h4>Map Synchronization</h4>
          <button
            className="gm-btn gm-btn-secondary"
            onClick={() => {
              if (multiplayerSocket && roomId) {
                // Force a full map update to all clients
                multiplayerSocket.emit('request_full_map_sync', { roomId });
                addNotification('system', {
                  sender: { name: 'System', class: 'system', level: 0 },
                  content: 'Requested full map synchronization for all clients.',
                  isSystem: true,
                  timestamp: new Date().toISOString()
                });
              }
            }}
          >
            🔄 Force Map Sync
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="gm-tab-content">
      <h3>Room Settings</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label>Max Players</label>
          <input
            type="number"
            min="1"
            max="20"
            value={roomSettings.maxPlayers || 6}
            onChange={(e) => handleRoomSettingChange('maxPlayers', parseInt(e.target.value))}
          />
        </div>

        <div className="setting-item">
          <label>Allow Spectators</label>
          <input
            type="checkbox"
            checked={roomSettings.allowSpectators || false}
            onChange={(e) => handleRoomSettingChange('allowSpectators', e.target.checked)}
          />
        </div>

        <div className="setting-item">
          <label>Auto-save Interval (minutes)</label>
          <select
            value={roomSettings.autoSaveInterval || 5}
            onChange={(e) => handleRoomSettingChange('autoSaveInterval', parseInt(e.target.value))}
          >
            <option value={1}>1 minute</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={0}>Disabled</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Player Token Movement</label>
          <select
            value={roomSettings.playerTokenMovement || 'own'}
            onChange={(e) => handleRoomSettingChange('playerTokenMovement', e.target.value)}
          >
            <option value="own">Own tokens only</option>
            <option value="all">All tokens</option>
            <option value="none">No movement</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Dice Roll Visibility</label>
          <select
            value={roomSettings.diceVisibility || 'all'}
            onChange={(e) => handleRoomSettingChange('diceVisibility', e.target.value)}
          >
            <option value="all">All players see all rolls</option>
            <option value="gm">GM sees all, players see own</option>
            <option value="private">Players see only own rolls</option>
          </select>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'players', label: 'Players', icon: '/assets/icons/abilities/Social/GroupGathering.png' },
    { id: 'combat', label: 'Combat', icon: '/assets/icons/Status/combat/concentric-target.png' },
    { id: 'world', label: 'World', icon: '/assets/icons/Status/utility/forking-path.png' },
    { id: 'encounters', label: 'Encounters', icon: '/assets/icons/Status/social/bardic-note.png' },
    { id: 'settings', label: 'Settings', icon: '/assets/icons/Status/utility/gear-cog-turns.png' }
  ];

  if (!isVisible || !isGMMode) return null;

  return (
    <div className="gm-tools-panel">
      <div className="gm-tools-header">
        <h2>🎲 GM Tools</h2>
        <button className="gm-tools-close" onClick={onClose}>×</button>
      </div>

      <div className="gm-tools-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`gm-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="gm-tab-icon">
              <img src={tab.icon} alt="" draggable={false} style={{ width: 20, height: 20, objectFit: 'contain', pointerEvents: 'none' }} />
            </span>
            <span className="gm-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="gm-tools-content">
        {activeTab === 'players' && renderPlayersTab()}
        {activeTab === 'combat' && renderCombatTab()}
        {activeTab === 'world' && renderWorldTab()}
        {activeTab === 'encounters' && <SocialEncounterGenerator />}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default GMToolsPanel;
