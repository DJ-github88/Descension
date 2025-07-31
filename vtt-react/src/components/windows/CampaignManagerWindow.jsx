import React, { useState, useEffect } from 'react';
import WowWindow from './WowWindow';
import '../../styles/campaign-manager.css';

// Campaign Management Window with tabbed interface
function CampaignManagerWindow({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [campaignData, setCampaignData] = useState({
        name: 'New Campaign',
        description: '',
        currentSession: 1,
        players: [],
        sessions: [],
        npcs: [],
        locations: [],
        plotThreads: []
    });

    // Tab definitions
    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'fas fa-home' },
        { id: 'sessions', label: 'Sessions', icon: 'fas fa-calendar-alt' },
        { id: 'npcs', label: 'NPCs', icon: 'fas fa-users' },
        { id: 'locations', label: 'Locations', icon: 'fas fa-map-marker-alt' },
        { id: 'plots', label: 'Plot Threads', icon: 'fas fa-project-diagram' }
    ];

    // Load campaign data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('mythrill-campaign-data');
        if (savedData) {
            try {
                setCampaignData(JSON.parse(savedData));
            } catch (error) {
                console.error('Error loading campaign data:', error);
            }
        }
    }, []);

    // Save campaign data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('mythrill-campaign-data', JSON.stringify(campaignData));
    }, [campaignData]);

    const updateCampaignData = (updates) => {
        setCampaignData(prev => ({ ...prev, ...updates }));
    };

    const addPlayer = () => {
        const playerName = prompt('Enter player name:');
        if (playerName && playerName.trim()) {
            const newPlayer = {
                id: Date.now(),
                name: playerName.trim(),
                characterName: '',
                class: '',
                level: 1,
                status: 'active'
            };
            updateCampaignData({
                players: [...campaignData.players, newPlayer]
            });
        }
    };

    const removePlayer = (playerId) => {
        if (confirm('Are you sure you want to remove this player?')) {
            updateCampaignData({
                players: campaignData.players.filter(p => p.id !== playerId)
            });
        }
    };

    const updatePlayer = (playerId, updates) => {
        updateCampaignData({
            players: campaignData.players.map(p =>
                p.id === playerId ? { ...p, ...updates } : p
            )
        });
    };

    const addSession = () => {
        const sessionNumber = campaignData.sessions.length + 1;
        const newSession = {
            id: Date.now(),
            number: sessionNumber,
            title: `Session ${sessionNumber}`,
            date: new Date().toISOString().split('T')[0],
            status: 'planned',
            objectives: [],
            notes: '',
            encounters: [],
            xpAwarded: 0,
            summary: ''
        };
        updateCampaignData({
            sessions: [...campaignData.sessions, newSession],
            currentSession: sessionNumber
        });
    };

    const updateSession = (sessionId, updates) => {
        updateCampaignData({
            sessions: campaignData.sessions.map(s =>
                s.id === sessionId ? { ...s, ...updates } : s
            )
        });
    };

    const removeSession = (sessionId) => {
        if (confirm('Are you sure you want to delete this session?')) {
            updateCampaignData({
                sessions: campaignData.sessions.filter(s => s.id !== sessionId)
            });
        }
    };

    const addNPC = () => {
        const npcName = prompt('Enter NPC name:');
        if (npcName && npcName.trim()) {
            const newNPC = {
                id: Date.now(),
                name: npcName.trim(),
                description: '',
                location: '',
                relationship: 'neutral',
                plotRelevance: 'minor',
                notes: '',
                status: 'alive'
            };
            updateCampaignData({
                npcs: [...campaignData.npcs, newNPC]
            });
        }
    };

    const updateNPC = (npcId, updates) => {
        updateCampaignData({
            npcs: campaignData.npcs.map(npc =>
                npc.id === npcId ? { ...npc, ...updates } : npc
            )
        });
    };

    const removeNPC = (npcId) => {
        if (confirm('Are you sure you want to remove this NPC?')) {
            updateCampaignData({
                npcs: campaignData.npcs.filter(npc => npc.id !== npcId)
            });
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-overview">
                            <div className="campaign-header-section">
                                <div className="campaign-field">
                                    <label>Campaign Name</label>
                                    <input
                                        type="text"
                                        value={campaignData.name}
                                        onChange={(e) => updateCampaignData({ name: e.target.value })}
                                        className="campaign-input"
                                        placeholder="Enter campaign name..."
                                    />
                                </div>
                                <div className="campaign-field">
                                    <label>Description</label>
                                    <textarea
                                        value={campaignData.description}
                                        onChange={(e) => updateCampaignData({ description: e.target.value })}
                                        className="campaign-textarea"
                                        placeholder="Describe your campaign setting, themes, and goals..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                            
                            <div className="campaign-stats-grid">
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-calendar-day"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Current Session</div>
                                        <div className="stat-value">{campaignData.currentSession}</div>
                                    </div>
                                </div>
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Active Players</div>
                                        <div className="stat-value">{campaignData.players.length}</div>
                                    </div>
                                </div>
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Locations</div>
                                        <div className="stat-value">{campaignData.locations.length}</div>
                                    </div>
                                </div>
                                <div className="campaign-stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-scroll"></i>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Plot Threads</div>
                                        <div className="stat-value">{campaignData.plotThreads.length}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="campaign-players-section">
                                <div className="campaign-section-header">
                                    <h3>Player Roster</h3>
                                    <button className="campaign-add-btn" onClick={addPlayer}>
                                        <i className="fas fa-plus"></i>
                                        Add Player
                                    </button>
                                </div>
                                <div className="players-list">
                                    {campaignData.players.length > 0 ? (
                                        campaignData.players.map(player => (
                                            <div key={player.id} className="player-card">
                                                <div className="player-info">
                                                    <div className="player-name">{player.name}</div>
                                                    <div className="player-character">
                                                        <input
                                                            type="text"
                                                            placeholder="Character name..."
                                                            value={player.characterName}
                                                            onChange={(e) => updatePlayer(player.id, { characterName: e.target.value })}
                                                            className="player-input"
                                                        />
                                                    </div>
                                                    <div className="player-details">
                                                        <input
                                                            type="text"
                                                            placeholder="Class..."
                                                            value={player.class}
                                                            onChange={(e) => updatePlayer(player.id, { class: e.target.value })}
                                                            className="player-input small"
                                                        />
                                                        <span className="player-level">Lvl {player.level}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="player-remove-btn"
                                                    onClick={() => removePlayer(player.id)}
                                                    title="Remove player"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="players-placeholder">
                                            <i className="fas fa-users"></i>
                                            <p>No players added yet. Click "Add Player" to get started!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="premium-feature-banner">
                                <div className="premium-icon">
                                    <i className="fas fa-crown"></i>
                                </div>
                                <div className="premium-content">
                                    <h3>Premium Campaign Management</h3>
                                    <p>Unlock advanced campaign tools including automated session tracking, NPC relationship maps, plot thread visualization, and much more!</p>
                                    <button className="premium-upgrade-btn">
                                        <i className="fas fa-star"></i>
                                        Upgrade to Premium
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'sessions':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-section-header">
                            <h3>Session Management</h3>
                            <button className="campaign-add-btn" onClick={addSession}>
                                <i className="fas fa-plus"></i>
                                New Session
                            </button>
                        </div>
                        <div className="sessions-list">
                            {campaignData.sessions.length > 0 ? (
                                campaignData.sessions.map(session => (
                                    <div key={session.id} className="session-card">
                                        <div className="session-header">
                                            <div className="session-title-section">
                                                <input
                                                    type="text"
                                                    value={session.title}
                                                    onChange={(e) => updateSession(session.id, { title: e.target.value })}
                                                    className="session-title-input"
                                                />
                                                <div className="session-meta">
                                                    <span className="session-number">#{session.number}</span>
                                                    <input
                                                        type="date"
                                                        value={session.date}
                                                        onChange={(e) => updateSession(session.id, { date: e.target.value })}
                                                        className="session-date-input"
                                                    />
                                                    <select
                                                        value={session.status}
                                                        onChange={(e) => updateSession(session.id, { status: e.target.value })}
                                                        className="session-status-select"
                                                    >
                                                        <option value="planned">Planned</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                className="session-remove-btn"
                                                onClick={() => removeSession(session.id)}
                                                title="Delete session"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="session-content">
                                            <div className="session-field">
                                                <label>Session Notes</label>
                                                <textarea
                                                    value={session.notes}
                                                    onChange={(e) => updateSession(session.id, { notes: e.target.value })}
                                                    className="session-textarea"
                                                    placeholder="Plan objectives, encounters, plot points..."
                                                    rows={3}
                                                />
                                            </div>
                                            {session.status === 'completed' && (
                                                <div className="session-field">
                                                    <label>Session Summary</label>
                                                    <textarea
                                                        value={session.summary}
                                                        onChange={(e) => updateSession(session.id, { summary: e.target.value })}
                                                        className="session-textarea"
                                                        placeholder="What happened this session..."
                                                        rows={3}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="session-placeholder">
                                    <i className="fas fa-calendar-plus"></i>
                                    <p>No sessions planned yet. Create your first session to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'npcs':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-section-header">
                            <h3>NPC Management</h3>
                            <button className="campaign-add-btn" onClick={addNPC}>
                                <i className="fas fa-plus"></i>
                                Add NPC
                            </button>
                        </div>
                        <div className="npcs-grid">
                            {campaignData.npcs.length > 0 ? (
                                campaignData.npcs.map(npc => (
                                    <div key={npc.id} className="npc-card">
                                        <div className="npc-header">
                                            <input
                                                type="text"
                                                value={npc.name}
                                                onChange={(e) => updateNPC(npc.id, { name: e.target.value })}
                                                className="npc-name-input"
                                            />
                                            <button
                                                className="npc-remove-btn"
                                                onClick={() => removeNPC(npc.id)}
                                                title="Remove NPC"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <div className="npc-content">
                                            <div className="npc-field">
                                                <label>Description</label>
                                                <textarea
                                                    value={npc.description}
                                                    onChange={(e) => updateNPC(npc.id, { description: e.target.value })}
                                                    className="npc-textarea"
                                                    placeholder="Physical description, personality..."
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="npc-meta">
                                                <div className="npc-field">
                                                    <label>Location</label>
                                                    <input
                                                        type="text"
                                                        value={npc.location}
                                                        onChange={(e) => updateNPC(npc.id, { location: e.target.value })}
                                                        className="npc-input"
                                                        placeholder="Where they're found..."
                                                    />
                                                </div>
                                                <div className="npc-field">
                                                    <label>Relationship</label>
                                                    <select
                                                        value={npc.relationship}
                                                        onChange={(e) => updateNPC(npc.id, { relationship: e.target.value })}
                                                        className="npc-select"
                                                    >
                                                        <option value="ally">Ally</option>
                                                        <option value="neutral">Neutral</option>
                                                        <option value="enemy">Enemy</option>
                                                        <option value="unknown">Unknown</option>
                                                    </select>
                                                </div>
                                                <div className="npc-field">
                                                    <label>Plot Relevance</label>
                                                    <select
                                                        value={npc.plotRelevance}
                                                        onChange={(e) => updateNPC(npc.id, { plotRelevance: e.target.value })}
                                                        className="npc-select"
                                                    >
                                                        <option value="major">Major</option>
                                                        <option value="moderate">Moderate</option>
                                                        <option value="minor">Minor</option>
                                                        <option value="background">Background</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="npc-field">
                                                <label>Notes</label>
                                                <textarea
                                                    value={npc.notes}
                                                    onChange={(e) => updateNPC(npc.id, { notes: e.target.value })}
                                                    className="npc-textarea"
                                                    placeholder="Plot hooks, secrets, relationships..."
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="npc-placeholder">
                                    <i className="fas fa-user-plus"></i>
                                    <p>No NPCs created yet. Add NPCs to track relationships and story involvement!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'locations':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-section-header">
                            <h3>Location Management</h3>
                            <button className="campaign-add-btn">
                                <i className="fas fa-plus"></i>
                                Add Location
                            </button>
                        </div>
                        <div className="locations-grid">
                            <div className="location-placeholder">
                                <i className="fas fa-map-plus"></i>
                                <p>No locations created yet. Build your world by adding important places!</p>
                            </div>
                        </div>
                    </div>
                );

            case 'plots':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-section-header">
                            <h3>Plot Thread Management</h3>
                            <button className="campaign-add-btn">
                                <i className="fas fa-plus"></i>
                                New Plot Thread
                            </button>
                        </div>
                        <div className="plots-list">
                            <div className="plot-placeholder">
                                <i className="fas fa-project-diagram"></i>
                                <p>No plot threads tracked yet. Create storylines to keep your campaign organized!</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Content coming soon...</div>;
        }
    };

    return (
        <WowWindow
            isOpen={isOpen}
            onClose={onClose}
            title="Campaign Manager"
            defaultSize={{ width: 1000, height: 700 }}
            defaultPosition={{ x: 100, y: 100 }}
            customHeader={
                <div className="spellbook-tab-headers">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`spellbook-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <i className={tab.icon}></i>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            }
        >
            <div className="campaign-manager-content">
                {renderTabContent()}
            </div>
        </WowWindow>
    );
}

export default CampaignManagerWindow;
