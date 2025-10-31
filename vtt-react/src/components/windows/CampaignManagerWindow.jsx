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
    
    // Modal state
    const [showInputModal, setShowInputModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [inputModalConfig, setInputModalConfig] = useState({ title: '', placeholder: '', onSubmit: null });
    const [confirmModalConfig, setConfirmModalConfig] = useState({ message: '', onConfirm: null });
    const [inputValue, setInputValue] = useState('');

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
        setInputModalConfig({
            title: 'Enter Player Name',
            placeholder: 'Player name...',
            onSubmit: (playerName) => {
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
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const removePlayer = (playerId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this player?',
            onConfirm: () => {
                updateCampaignData({
                    players: campaignData.players.filter(p => p.id !== playerId)
                });
            }
        });
        setShowConfirmModal(true);
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
        setConfirmModalConfig({
            message: 'Are you sure you want to delete this session?',
            onConfirm: () => {
                updateCampaignData({
                    sessions: campaignData.sessions.filter(s => s.id !== sessionId)
                });
            }
        });
        setShowConfirmModal(true);
    };

    const addNPC = () => {
        setInputModalConfig({
            title: 'Enter NPC Name',
            placeholder: 'NPC name...',
            onSubmit: (npcName) => {
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
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updateNPC = (npcId, updates) => {
        updateCampaignData({
            npcs: campaignData.npcs.map(npc =>
                npc.id === npcId ? { ...npc, ...updates } : npc
            )
        });
    };

    const removeNPC = (npcId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this NPC?',
            onConfirm: () => {
                updateCampaignData({
                    npcs: campaignData.npcs.filter(npc => npc.id !== npcId)
                });
            }
        });
        setShowConfirmModal(true);
    };

    const addLocation = () => {
        setInputModalConfig({
            title: 'Enter Location Name',
            placeholder: 'Location name...',
            onSubmit: (locationName) => {
                if (locationName && locationName.trim()) {
                    const newLocation = {
                        id: Date.now(),
                        name: locationName.trim(),
                        description: '',
                        type: 'city',
                        region: '',
                        notableFeatures: '',
                        notes: ''
                    };
                    updateCampaignData({
                        locations: [...campaignData.locations, newLocation]
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updateLocation = (locationId, updates) => {
        updateCampaignData({
            locations: campaignData.locations.map(location =>
                location.id === locationId ? { ...location, ...updates } : location
            )
        });
    };

    const removeLocation = (locationId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this location?',
            onConfirm: () => {
                updateCampaignData({
                    locations: campaignData.locations.filter(location => location.id !== locationId)
                });
            }
        });
        setShowConfirmModal(true);
    };

    const addPlotThread = () => {
        setInputModalConfig({
            title: 'Enter Plot Thread Title',
            placeholder: 'Plot thread title...',
            onSubmit: (plotTitle) => {
                if (plotTitle && plotTitle.trim()) {
                    const newPlotThread = {
                        id: Date.now(),
                        title: plotTitle.trim(),
                        description: '',
                        status: 'active',
                        priority: 'medium',
                        relatedNPCs: [],
                        relatedLocations: [],
                        notes: ''
                    };
                    updateCampaignData({
                        plotThreads: [...campaignData.plotThreads, newPlotThread]
                    });
                }
            }
        });
        setInputValue('');
        setShowInputModal(true);
    };

    const updatePlotThread = (plotThreadId, updates) => {
        updateCampaignData({
            plotThreads: campaignData.plotThreads.map(plotThread =>
                plotThread.id === plotThreadId ? { ...plotThread, ...updates } : plotThread
            )
        });
    };

    const removePlotThread = (plotThreadId) => {
        setConfirmModalConfig({
            message: 'Are you sure you want to remove this plot thread?',
            onConfirm: () => {
                updateCampaignData({
                    plotThreads: campaignData.plotThreads.filter(plotThread => plotThread.id !== plotThreadId)
                });
            }
        });
        setShowConfirmModal(true);
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
                            <button className="campaign-add-btn" onClick={addLocation}>
                                <i className="fas fa-plus"></i>
                                Add Location
                            </button>
                        </div>
                        <div className="locations-grid">
                            {campaignData.locations.length > 0 ? (
                                campaignData.locations.map(location => (
                                    <div key={location.id} className="location-card" style={{
                                        backgroundColor: '#f9f6f0',
                                        border: '2px solid #8b7355',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        marginBottom: '15px'
                                    }}>
                                        <div className="location-header" style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '12px'
                                        }}>
                                            <input
                                                type="text"
                                                value={location.name}
                                                onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                                                className="location-name-input"
                                                style={{
                                                    flex: 1,
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    padding: '6px',
                                                    border: '2px solid #8b7355',
                                                    borderRadius: '4px',
                                                    fontFamily: 'inherit',
                                                    marginRight: '10px'
                                                }}
                                            />
                                            <button
                                                className="location-remove-btn"
                                                onClick={() => removeLocation(location.id)}
                                                title="Remove location"
                                                style={{
                                                    backgroundColor: '#8b0000',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '6px 10px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <div className="location-content">
                                            <div className="location-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Description</label>
                                                <textarea
                                                    value={location.description}
                                                    onChange={(e) => updateLocation(location.id, { description: e.target.value })}
                                                    className="location-textarea"
                                                    placeholder="Describe the location..."
                                                    rows={2}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="location-meta" style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '10px',
                                                marginBottom: '10px'
                                            }}>
                                                <div className="location-field">
                                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Type</label>
                                                    <select
                                                        value={location.type}
                                                        onChange={(e) => updateLocation(location.id, { type: e.target.value })}
                                                        className="location-select"
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '2px solid #8b7355',
                                                            borderRadius: '4px',
                                                            fontFamily: 'inherit'
                                                        }}
                                                    >
                                                        <option value="city">City</option>
                                                        <option value="town">Town</option>
                                                        <option value="village">Village</option>
                                                        <option value="dungeon">Dungeon</option>
                                                        <option value="landmark">Landmark</option>
                                                        <option value="wilderness">Wilderness</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="location-field">
                                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Region</label>
                                                    <input
                                                        type="text"
                                                        value={location.region}
                                                        onChange={(e) => updateLocation(location.id, { region: e.target.value })}
                                                        className="location-input"
                                                        placeholder="Region..."
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '2px solid #8b7355',
                                                            borderRadius: '4px',
                                                            fontFamily: 'inherit',
                                                            boxSizing: 'border-box'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="location-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Notable Features</label>
                                                <textarea
                                                    value={location.notableFeatures}
                                                    onChange={(e) => updateLocation(location.id, { notableFeatures: e.target.value })}
                                                    className="location-textarea"
                                                    placeholder="Key features, landmarks, points of interest..."
                                                    rows={2}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="location-field">
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Notes</label>
                                                <textarea
                                                    value={location.notes}
                                                    onChange={(e) => updateLocation(location.id, { notes: e.target.value })}
                                                    className="location-textarea"
                                                    placeholder="Plot hooks, secrets, connections to other locations..."
                                                    rows={2}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="location-placeholder">
                                    <i className="fas fa-map-plus"></i>
                                    <p>No locations created yet. Build your world by adding important places!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'plots':
                return (
                    <div className="campaign-tab-content">
                        <div className="campaign-section-header">
                            <h3>Plot Thread Management</h3>
                            <button className="campaign-add-btn" onClick={addPlotThread}>
                                <i className="fas fa-plus"></i>
                                New Plot Thread
                            </button>
                        </div>
                        <div className="plots-list">
                            {campaignData.plotThreads.length > 0 ? (
                                campaignData.plotThreads.map(plotThread => (
                                    <div key={plotThread.id} className="plot-card" style={{
                                        backgroundColor: '#f9f6f0',
                                        border: '2px solid #8b7355',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        marginBottom: '15px'
                                    }}>
                                        <div className="plot-header" style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '12px'
                                        }}>
                                            <input
                                                type="text"
                                                value={plotThread.title}
                                                onChange={(e) => updatePlotThread(plotThread.id, { title: e.target.value })}
                                                className="plot-title-input"
                                                style={{
                                                    flex: 1,
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    padding: '6px',
                                                    border: '2px solid #8b7355',
                                                    borderRadius: '4px',
                                                    fontFamily: 'inherit',
                                                    marginRight: '10px'
                                                }}
                                            />
                                            <button
                                                className="plot-remove-btn"
                                                onClick={() => removePlotThread(plotThread.id)}
                                                title="Remove plot thread"
                                                style={{
                                                    backgroundColor: '#8b0000',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '6px 10px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                        <div className="plot-content">
                                            <div className="plot-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Description</label>
                                                <textarea
                                                    value={plotThread.description}
                                                    onChange={(e) => updatePlotThread(plotThread.id, { description: e.target.value })}
                                                    className="plot-textarea"
                                                    placeholder="Describe the plot thread..."
                                                    rows={3}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="plot-meta" style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '10px',
                                                marginBottom: '10px'
                                            }}>
                                                <div className="plot-field">
                                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Status</label>
                                                    <select
                                                        value={plotThread.status}
                                                        onChange={(e) => updatePlotThread(plotThread.id, { status: e.target.value })}
                                                        className="plot-select"
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '2px solid #8b7355',
                                                            borderRadius: '4px',
                                                            fontFamily: 'inherit'
                                                        }}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="on-hold">On Hold</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="abandoned">Abandoned</option>
                                                    </select>
                                                </div>
                                                <div className="plot-field">
                                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Priority</label>
                                                    <select
                                                        value={plotThread.priority}
                                                        onChange={(e) => updatePlotThread(plotThread.id, { priority: e.target.value })}
                                                        className="plot-select"
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            border: '2px solid #8b7355',
                                                            borderRadius: '4px',
                                                            fontFamily: 'inherit'
                                                        }}
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                        <option value="critical">Critical</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="plot-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Related NPCs</label>
                                                <input
                                                    type="text"
                                                    value={Array.isArray(plotThread.relatedNPCs) ? plotThread.relatedNPCs.join(', ') : (plotThread.relatedNPCs || '')}
                                                    onChange={(e) => updatePlotThread(plotThread.id, { 
                                                        relatedNPCs: e.target.value ? e.target.value.split(',').map(n => n.trim()).filter(n => n) : []
                                                    })}
                                                    className="plot-input"
                                                    placeholder="NPC names (comma-separated)..."
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="plot-field" style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Related Locations</label>
                                                <input
                                                    type="text"
                                                    value={Array.isArray(plotThread.relatedLocations) ? plotThread.relatedLocations.join(', ') : (plotThread.relatedLocations || '')}
                                                    onChange={(e) => updatePlotThread(plotThread.id, { 
                                                        relatedLocations: e.target.value ? e.target.value.split(',').map(l => l.trim()).filter(l => l) : []
                                                    })}
                                                    className="plot-input"
                                                    placeholder="Location names (comma-separated)..."
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                            <div className="plot-field">
                                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#3a2f1a' }}>Notes</label>
                                                <textarea
                                                    value={plotThread.notes}
                                                    onChange={(e) => updatePlotThread(plotThread.id, { notes: e.target.value })}
                                                    className="plot-textarea"
                                                    placeholder="Progress, key events, connections to other plot threads..."
                                                    rows={3}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px',
                                                        border: '2px solid #8b7355',
                                                        borderRadius: '4px',
                                                        fontFamily: 'inherit',
                                                        boxSizing: 'border-box'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="plot-placeholder">
                                    <i className="fas fa-project-diagram"></i>
                                    <p>No plot threads tracked yet. Create storylines to keep your campaign organized!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return <div>Content coming soon...</div>;
        }
    };

    // Handler for input modal
    const handleInputSubmit = () => {
        if (inputModalConfig.onSubmit && inputValue.trim()) {
            inputModalConfig.onSubmit(inputValue);
            setShowInputModal(false);
            setInputValue('');
        }
    };

    // Handler for confirm modal
    const handleConfirm = () => {
        if (confirmModalConfig.onConfirm) {
            confirmModalConfig.onConfirm();
            setShowConfirmModal(false);
        }
    };

    return (
        <>
            <WowWindow
                isOpen={isOpen}
                onClose={onClose}
                title="Campaign Manager"
                defaultSize={{ width: 1000, height: 700 }}
                defaultPosition={{ x: 100, y: 100 }}
                customHeader={
                    <div className="spellbook-tab-container">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`spellbook-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
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

            {/* Input Modal */}
            {showInputModal && (
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100000
                    }}
                    onClick={() => {
                        setShowInputModal(false);
                        setInputValue('');
                    }}
                >
                    <div
                        className="input-modal"
                        style={{
                            backgroundColor: '#f0e6d2',
                            border: '3px solid #8b7355',
                            borderRadius: '8px',
                            padding: '20px',
                            maxWidth: '400px',
                            width: '90%',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#3a2f1a',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 15px 0', color: '#8b7355' }}>{inputModalConfig.title}</h3>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleInputSubmit();
                                }
                            }}
                            placeholder={inputModalConfig.placeholder}
                            style={{
                                width: '100%',
                                padding: '8px',
                                fontSize: '14px',
                                border: '2px solid #8b7355',
                                borderRadius: '4px',
                                fontFamily: 'inherit',
                                marginBottom: '15px',
                                boxSizing: 'border-box'
                            }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowInputModal(false);
                                    setInputValue('');
                                }}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4a5d23',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInputSubmit}
                                disabled={!inputValue.trim()}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: inputValue.trim() ? '#8b7355' : '#cccccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100000
                    }}
                    onClick={() => setShowConfirmModal(false)}
                >
                    <div
                        className="confirm-modal"
                        style={{
                            backgroundColor: '#f0e6d2',
                            border: '3px solid #8b7355',
                            borderRadius: '8px',
                            padding: '20px',
                            maxWidth: '400px',
                            textAlign: 'center',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#3a2f1a',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 15px 0', color: '#8b7355' }}>Confirm Action</h3>
                        <p style={{ margin: '0 0 20px 0', lineHeight: '1.4' }}>
                            {confirmModalConfig.message}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4a5d23',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#8b7355',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CampaignManagerWindow;
