/**
 * Enhanced GM Tools Panel
 * Provides Roll20-like GM controls and player management
 */

import React, { useState, useEffect } from 'react';
import useGameStore from '../../store/gameStore';
import useCombatStore from '../../store/combatStore';
import useChatStore from '../../store/chatStore';
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

  const renderPlayersTab = () => (
    <div className="gm-tab-content">
      <h3>Connected Players ({connectedPlayers.length})</h3>
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
    </div>
  );

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
    { id: 'players', label: 'Players', icon: '👥' },
    { id: 'combat', label: 'Combat', icon: '⚔️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
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
            <span className="gm-tab-icon">{tab.icon}</span>
            <span className="gm-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="gm-tools-content">
        {activeTab === 'players' && renderPlayersTab()}
        {activeTab === 'combat' && renderCombatTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default GMToolsPanel;
