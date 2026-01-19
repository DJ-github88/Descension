import React, { useState, useEffect, memo } from 'react';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import useSettingsStore from '../../store/settingsStore';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import LocalRoomIndicator from '../local-room/LocalRoomIndicator';
import OfflineIndicator from '../common/OfflineIndicator';
import ContentModerationDashboard from '../common/ContentModerationDashboard';
import PlayerSelector from '../common/PlayerSelector';
import { useNavigate } from 'react-router-dom';
import '../../styles/settings-window.css';

const SettingsWindow = memo(function SettingsWindow({ activeTab: propActiveTab }) {
    const navigate = useNavigate();

    // Get state and actions from stores
    const takeShortRest = useGameStore(state => state.takeShortRest);
    const takeLongRest = useGameStore(state => state.takeLongRest);
    const isGMMode = useGameStore(state => state.isGMMode);
    const isInMultiplayer = useGameStore(state => state.isInMultiplayer);
    const multiplayerRoom = useGameStore(state => state.multiplayerRoom);
    const multiplayerSocket = useGameStore(state => state.multiplayerSocket);
    const leaveMultiplayer = useGameStore(state => state.leaveMultiplayer);
    const partyMembers = usePartyStore(state => state.partyMembers);
    const addNotification = useChatStore(state => state.addNotification);
    const restOverlayOpen = useGameStore(state => state.restOverlayOpen);
    const restOverlayType = useGameStore(state => state.restOverlayType);
    const hideRestOverlay = useGameStore(state => state.hideRestOverlay);
    const setGameFeetPerTile = useGameStore(state => state.setFeetPerTile);
    const setGameShowMovementVisualization = useGameStore(state => state.setShowMovementVisualization);
    const setGameMovementLineColor = useGameStore(state => state.setMovementLineColor);
    const setGameMovementLineWidth = useGameStore(state => state.setMovementLineWidth);
    const setGameDefaultViewFromToken = useGameStore(state => state.setDefaultViewFromToken);

    // Local room state
    const [currentLocalRoomId, setCurrentLocalRoomId] = useState(null);

    // Dashboard states
    const [showContentModeration, setShowContentModeration] = useState(false);

    // Settings from new settings store (with persistence)
    const windowScale = useSettingsStore(state => state.windowScale);
    const setWindowScale = useSettingsStore(state => state.setWindowScale);
    const feetPerTile = useSettingsStore(state => state.feetPerTile);
    const setFeetPerTile = useSettingsStore(state => state.setFeetPerTile);
    const showMovementVisualization = useSettingsStore(state => state.showMovementVisualization);
    const setShowMovementVisualization = useSettingsStore(state => state.setShowMovementVisualization);
    const movementLineColor = useSettingsStore(state => state.movementLineColor);
    const setMovementLineColor = useSettingsStore(state => state.setMovementLineColor);
    const movementLineWidth = useSettingsStore(state => state.movementLineWidth);
    const setMovementLineWidth = useSettingsStore(state => state.setMovementLineWidth);
    const showCursorTracking = useSettingsStore(state => state.showCursorTracking);
    const setShowCursorTracking = useSettingsStore(state => state.setShowCursorTracking);
    const defaultViewFromToken = useSettingsStore(state => state.defaultViewFromToken);
    const setDefaultViewFromToken = useSettingsStore(state => state.setDefaultViewFromToken);

    // Character store
    const characterLevel = useCharacterStore(state => state.level);
    const characterExperience = useCharacterStore(state => state.experience);
    const characterClass = useCharacterStore(state => state.class);
    const knownSpells = useCharacterStore(state => state.class_spells?.known_spells || []);
    const awardExperience = useCharacterStore(state => state.awardExperience);
    const adjustLevel = useCharacterStore(state => state.adjustLevel);
    const levelUpHistory = useCharacterStore(state => state.levelUpHistory);

    // Local state
    const [activeTab, setActiveTab] = useState(propActiveTab || 'interface');

    // Player selection state for multiplayer GM actions
    const [selectedPlayersForXP, setSelectedPlayersForXP] = useState([]);
    const [selectedPlayersForRest, setSelectedPlayersForRest] = useState([]);

    // Update activeTab when prop changes (memoized to prevent unnecessary re-renders)
    useEffect(() => {
        if (propActiveTab && propActiveTab !== activeTab) {
            setActiveTab(propActiveTab);
        }
    }, [propActiveTab, activeTab]);

    // Check for local room
    useEffect(() => {
        const checkLocalRoom = () => {
            const isLocalRoom = localStorage.getItem('isLocalRoom') === 'true';
            const selectedLocalRoomId = localStorage.getItem('selectedLocalRoomId');
            if (isLocalRoom && selectedLocalRoomId) {
                setCurrentLocalRoomId(selectedLocalRoomId);
            } else {
                setCurrentLocalRoomId(null);
            }
        };

        checkLocalRoom();
        const interval = setInterval(checkLocalRoom, 1000);
        return () => clearInterval(interval);
    }, []);


    // Window scale preview state
    const [previewWindowScale, setPreviewWindowScale] = useState(windowScale);
    const [hasScaleChanges, setHasScaleChanges] = useState(false);

    // Helper function to convert actual scale to display percentage
    // 0.6889 actual = 100% display, 0.6 actual = ~87% display, 1.5 actual = ~218% display
    const scaleToDisplayPercent = (scale) => {
        return Math.round((scale / 0.6889) * 100);
    };




    // Handle window scale preview change
    const handleWindowScalePreviewChange = (e) => {
        const value = parseFloat(e.target.value);
        setPreviewWindowScale(value);
        setHasScaleChanges(Math.abs(value - windowScale) > 0.01);
    };

    // Apply window scale changes with animation
    const applyWindowScale = () => {
        setWindowScale(previewWindowScale);
        setHasScaleChanges(false);
    };

    // Reset window scale preview
    const resetWindowScalePreview = () => {
        setPreviewWindowScale(0.6889);
        setHasScaleChanges(Math.abs(0.6889 - windowScale) > 0.01);
    };

    // Quick scale adjustments
    const previewScaleDown = () => {
        const newScale = Math.max(0.4, previewWindowScale / 1.1);
        setPreviewWindowScale(newScale);
        setHasScaleChanges(Math.abs(newScale - windowScale) > 0.01);
    };

    const previewScaleUp = () => {
        const newScale = Math.min(1.2, previewWindowScale * 1.1);
        setPreviewWindowScale(newScale);
        setHasScaleChanges(Math.abs(newScale - windowScale) > 0.01);
    };

    // Handle short rest (GM only, with multiplayer player targeting)
    const handleShortRest = () => {
        if (!isGMMode) return;

        // In multiplayer, emit to selected players
        if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected && selectedPlayersForRest.length > 0) {
            console.log('🎮 GM emitting gm_action short_rest to:', selectedPlayersForRest);
            multiplayerSocket.emit('gm_action', {
                type: 'short_rest',
                targetPlayerIds: selectedPlayersForRest
            });
        } else {
            console.log('⚠️ GM action NOT emitted:', { isInMultiplayer, socketConnected: multiplayerSocket?.connected, selectedPlayers: selectedPlayersForRest });
        }

        // Always apply locally if not in multiplayer, or if current-player is selected
        if (!isInMultiplayer || selectedPlayersForRest.includes('current-player')) {
            takeShortRest();
        }
    };

    // Handle long rest (GM only, with multiplayer player targeting)
    const handleLongRest = () => {
        if (!isGMMode) return;

        // In multiplayer, emit to selected players
        if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected && selectedPlayersForRest.length > 0) {
            console.log('🎮 GM emitting gm_action long_rest to:', selectedPlayersForRest);
            multiplayerSocket.emit('gm_action', {
                type: 'long_rest',
                targetPlayerIds: selectedPlayersForRest
            });
        } else {
            console.log('⚠️ GM action NOT emitted:', { isInMultiplayer, socketConnected: multiplayerSocket?.connected, selectedPlayers: selectedPlayersForRest });
        }

        // Always apply locally if not in multiplayer, or if current-player is selected
        if (!isInMultiplayer || selectedPlayersForRest.includes('current-player')) {
            takeLongRest();
        }
    };

    // Handle XP award (with multiplayer player targeting)
    const handleAwardXP = (amount) => {
        // In multiplayer, emit to selected players
        if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected && selectedPlayersForXP.length > 0) {
            console.log('🎮 GM emitting gm_action award_xp to:', selectedPlayersForXP, 'amount:', amount);
            multiplayerSocket.emit('gm_action', {
                type: 'award_xp',
                amount,
                targetPlayerIds: selectedPlayersForXP
            });
        } else {
            console.log('⚠️ GM XP action NOT emitted:', { isInMultiplayer, socketConnected: multiplayerSocket?.connected, selectedPlayers: selectedPlayersForXP });
        }

        // Always apply locally if not in multiplayer, or if current-player is selected
        if (!isInMultiplayer || selectedPlayersForXP.includes('current-player')) {
            awardExperience(amount);
        }
    };

    // Helper to sync gameplay settings in multiplayer
    const syncGameplaySettings = (settings) => {
        if (isGMMode && isInMultiplayer && multiplayerSocket && multiplayerSocket.connected) {
            console.log('⚙️ GM syncing gameplay settings:', settings);
            multiplayerSocket.emit('sync_gameplay_settings', settings);
        }
    };

    // Handle level adjustment (with multiplayer player targeting)
    const handleAdjustLevel = (amount) => {
        // In multiplayer, emit to selected players
        if (isInMultiplayer && multiplayerSocket && multiplayerSocket.connected && selectedPlayersForXP.length > 0) {
            console.log('🎮 GM emitting gm_action adjust_level to:', selectedPlayersForXP, 'delta:', amount);
            multiplayerSocket.emit('gm_action', {
                type: 'adjust_level',
                amount,
                targetPlayerIds: selectedPlayersForXP
            });
        }

        // Always apply locally if not in multiplayer, or if current-player is selected
        if (!isInMultiplayer || selectedPlayersForXP.includes('current-player')) {
            adjustLevel(amount);
        }
    };

    // Handle leave multiplayer room
    const handleLeaveMultiplayer = () => {
        if (window.confirm('Are you sure you want to leave the multiplayer room?')) {
            leaveMultiplayer();
        }
    };









    // Interface tab content
    const renderInterfaceTab = () => (
        <div className="settings-content-clean">
            <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>

                {/* Window Scaling Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '16px',
                    gap: '12px'
                }}>
                    <i className="fas fa-expand-arrows-alt" style={{
                        fontSize: '20px',
                        color: '#7a3b2e'
                    }}></i>
                    <div>
                        <h3 style={{
                            margin: '0 0 4px 0',
                            color: '#7a3b2e',
                            fontSize: '18px',
                            fontFamily: 'Cinzel, serif'
                        }}>
                            Window Scaling
                        </h3>
                        <p style={{
                            margin: '0',
                            color: '#8b6f47',
                            fontSize: '14px',
                            fontStyle: 'italic'
                        }}>
                            Adjust window sizes to fit your screen perfectly
                        </p>
                    </div>
                </div>

                <div className="control-group">
                    {/* Current Scale Display */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '20px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '6px',
                        border: '1px solid #e8dcc0'
                    }}>
                        <div style={{ fontSize: '12px', color: '#8b6f47', marginBottom: '8px' }}>
                            Current Window Scale
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '600', color: '#7a3b2e' }}>
                            {scaleToDisplayPercent(windowScale)}%
                        </div>
                        {hasScaleChanges && (
                            <div style={{
                                marginTop: '8px',
                                fontSize: '14px',
                                color: '#4a934a',
                                fontWeight: '500'
                            }}>
                                → {scaleToDisplayPercent(previewWindowScale)}%
                            </div>
                        )}
                    </div>

                    {/* Scale Controls */}
                    <div style={{
                        marginBottom: '20px',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '6px',
                        border: '1px solid #e8dcc0'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px',
                            marginBottom: '12px'
                        }}>
                            <span style={{ fontSize: '12px', color: '#8b6f47' }}>Smaller</span>
                            <div style={{
                                width: '200px',
                                height: '4px',
                                background: 'linear-gradient(to right, #a08c70, #7a3b2e, #a08c70)',
                                borderRadius: '2px',
                                opacity: 0.3
                            }}></div>
                            <span style={{ fontSize: '12px', color: '#8b6f47' }}>Larger</span>
                        </div>

                        <div className="control-row" style={{ justifyContent: 'center', gap: '12px' }}>
                            <button
                                className="control-button secondary"
                                onClick={previewScaleDown}
                                disabled={previewWindowScale <= 0.4}
                                style={{ minWidth: '80px' }}
                                title="Make windows smaller"
                            >
                                <i className="fas fa-minus" style={{ marginRight: '6px' }}></i>
                                Smaller
                            </button>

                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '300px' }}>
                                <span className="range-label">60%</span>
                                <input
                                    type="range"
                                    min="0.4"
                                    max="1.2"
                                    step="0.05"
                                    value={previewWindowScale}
                                    onChange={handleWindowScalePreviewChange}
                                    className="control-slider"
                                    style={{ flex: 1 }}
                                />
                                <span className="range-label">175%</span>
                            </div>

                            <button
                                className="control-button secondary"
                                onClick={previewScaleUp}
                                disabled={previewWindowScale >= 1.2}
                                style={{ minWidth: '80px' }}
                                title="Make windows larger"
                            >
                                <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>
                                Larger
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="control-actions" style={{
                        justifyContent: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            className="control-button secondary"
                            onClick={resetWindowScalePreview}
                            style={{ minWidth: '120px' }}
                            title="Reset to default 100% scale"
                        >
                            <i className="fas fa-undo" style={{ marginRight: '6px' }}></i>
                            Reset to 100%
                        </button>
                        <button
                            className={`control-button primary ${hasScaleChanges ? 'pulse' : ''}`}
                            onClick={applyWindowScale}
                            disabled={!hasScaleChanges}
                            style={{ minWidth: '120px' }}
                            title={hasScaleChanges ? 'Apply your scale changes' : 'No changes to apply'}
                        >
                            <i className="fas fa-check" style={{ marginRight: '6px' }}></i>
                            {hasScaleChanges ? 'Apply Changes' : 'No Changes'}
                        </button>
                    </div>
                </div>

                {/* Local Room Indicator Section */}
                {currentLocalRoomId && (
                    <div style={{ marginTop: '32px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '16px',
                            gap: '12px'
                        }}>
                            <i className="fas fa-home" style={{
                                fontSize: '20px',
                                color: '#7a3b2e'
                            }}></i>
                            <div>
                                <h3 style={{
                                    margin: '0 0 4px 0',
                                    color: '#7a3b2e',
                                    fontSize: '18px',
                                    fontFamily: 'Cinzel, serif'
                                }}>
                                    Local Room
                                </h3>
                                <p style={{
                                    margin: '0',
                                    color: '#8b6f47',
                                    fontSize: '14px',
                                    fontStyle: 'italic'
                                }}>
                                    Manage your local room and convert to multiplayer
                                </p>
                            </div>
                        </div>

                        <div className="settings-group">
                            <LocalRoomIndicator
                                currentLocalRoomId={currentLocalRoomId}
                                onReturnToMenu={() => navigate('/')}
                                inSettings={true}
                            />
                        </div>
                    </div>
                )}

                {/* Cursor Tracking Settings (Multiplayer Only) */}
                {isInMultiplayer && (
                    <div style={{ marginTop: '32px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '16px',
                            gap: '12px'
                        }}>
                            <i className="fas fa-mouse-pointer" style={{
                                fontSize: '20px',
                                color: '#7a3b2e'
                            }}></i>
                            <div>
                                <h3 style={{
                                    margin: '0 0 4px 0',
                                    color: '#7a3b2e',
                                    fontSize: '18px',
                                    fontWeight: '600'
                                }}>
                                    Cursor Tracking
                                </h3>
                                <p style={{
                                    margin: '0',
                                    color: '#8b6f47',
                                    fontSize: '14px',
                                    fontStyle: 'italic'
                                }}>
                                    Show other players' cursors in real-time
                                </p>
                            </div>
                        </div>

                        <div className="settings-group">
                            <div className="control-group">
                                <label className="control-label control-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={showCursorTracking}
                                        onChange={(e) => setShowCursorTracking(e.target.checked)}
                                        style={{ marginRight: '8px' }}
                                    />
                                    Enable Cursor Tracking
                                </label>
                                <div className="control-help">
                                    <p>Display animated cursors showing where other players are looking and interacting on the map.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Offline & Performance Settings Section - GM ONLY */}
                {isGMMode && (
                    <div style={{
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '2px solid #e8dcc0'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '16px',
                            gap: '12px'
                        }}>
                            <i className="fas fa-wifi" style={{
                                fontSize: '20px',
                                color: '#7a3b2e'
                            }}></i>
                            <div>
                                <h3 style={{
                                    margin: '0 0 4px 0',
                                    color: '#7a3b2e',
                                    fontSize: '18px',
                                    fontFamily: 'Cinzel, serif'
                                }}>
                                    Connection & Performance
                                </h3>
                                <p style={{
                                    margin: '0',
                                    color: '#8b6f47',
                                    fontSize: '14px',
                                    fontStyle: 'italic'
                                }}>
                                    Monitor your connection status and performance metrics
                                </p>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '8px',
                            padding: '16px',
                            border: '1px solid #e8dcc0'
                        }}>
                            <OfflineIndicator />
                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => {
                                        // Trigger performance dashboard with keyboard shortcut
                                        const event = new KeyboardEvent('keydown', {
                                            ctrlKey: true,
                                            shiftKey: true,
                                            key: 'P'
                                        });
                                        window.dispatchEvent(event);
                                    }}
                                    style={{
                                        background: '#7a3b2e',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontFamily: 'Cinzel, serif',
                                        fontSize: '14px'
                                    }}
                                >
                                    <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
                                    Performance Dashboard
                                </button>

                                <button
                                    onClick={() => setShowContentModeration(true)}
                                    style={{
                                        background: '#2c5530',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontFamily: 'Cinzel, serif',
                                        fontSize: '14px'
                                    }}
                                >
                                    <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
                                    Content Moderation
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );





    // Gameplay tab content
    const renderGameplayTab = () => (
        <div className="settings-content-clean">
            <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
                {/* Gameplay Configuration Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '32px',
                    padding: '24px',
                    background: 'linear-gradient(135deg, rgba(122, 59, 46, 0.08), rgba(122, 59, 46, 0.04))',
                    border: '1px solid rgba(122, 59, 46, 0.15)',
                    borderRadius: '12px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        marginBottom: '16px'
                    }}>
                        <i className="fas fa-dungeon" style={{
                            fontSize: '28px',
                            color: '#7a3b2e'
                        }}></i>
                        <h2 style={{
                            margin: '0',
                            color: '#7a3b2e',
                            fontSize: '28px',
                            fontFamily: 'Cinzel, serif',
                            fontWeight: '600'
                        }}>
                            Gameplay Configuration
                        </h2>
                        <i className="fas fa-dungeon" style={{
                            fontSize: '28px',
                            color: '#7a3b2e'
                        }}></i>
                    </div>
                    <p style={{
                        margin: '0',
                        color: '#8b6f47',
                        fontSize: '16px',
                        fontStyle: 'italic',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Master your campaign with precise grid measurements, intuitive movement mechanics, and comprehensive character management
                    </p>
                </div>

                {/* Current Campaign Status */}
                <div style={{
                    marginBottom: '32px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid #e8dcc0',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        margin: '0 0 16px 0',
                        color: '#7a3b2e',
                        fontSize: '18px',
                        fontFamily: 'Cinzel, serif',
                        textAlign: 'center'
                    }}>
                        <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
                        Current Campaign Status
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            padding: '16px',
                            background: 'rgba(122, 59, 46, 0.05)',
                            borderRadius: '6px',
                            border: '1px solid rgba(122, 59, 46, 0.1)'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: '600', color: '#7a3b2e', marginBottom: '4px' }}>
                                {feetPerTile}ft
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: '500' }}>
                                Grid Scale
                            </div>
                            <div style={{ fontSize: '11px', color: '#a08c70', marginTop: '4px' }}>
                                Distance per tile
                            </div>
                        </div>
                        <div style={{
                            padding: '16px',
                            background: showMovementVisualization ? 'rgba(74, 147, 74, 0.1)' : 'rgba(199, 69, 69, 0.1)',
                            borderRadius: '6px',
                            border: `1px solid ${showMovementVisualization ? 'rgba(74, 147, 74, 0.2)' : 'rgba(199, 69, 69, 0.2)'} `
                        }}>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                color: showMovementVisualization ? '#4a934a' : '#c74545',
                                marginBottom: '4px'
                            }}>
                                {showMovementVisualization ? 'ON' : 'OFF'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: '500' }}>
                                Movement Visualization
                            </div>
                            <div style={{ fontSize: '11px', color: '#a08c70', marginTop: '4px' }}>
                                Path preview
                            </div>
                        </div>
                        {isInMultiplayer && (
                            <div style={{
                                padding: '16px',
                                background: showCursorTracking ? 'rgba(74, 147, 74, 0.1)' : 'rgba(199, 69, 69, 0.1)',
                                borderRadius: '6px',
                                border: `1px solid ${showCursorTracking ? 'rgba(74, 147, 74, 0.2)' : 'rgba(199, 69, 69, 0.2)'} `
                            }}>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: '600',
                                    color: showCursorTracking ? '#4a934a' : '#c74545',
                                    marginBottom: '4px'
                                }}>
                                    {showCursorTracking ? 'ON' : 'OFF'}
                                </div>
                                <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: '500' }}>
                                    Cursor Tracking
                                </div>
                                <div style={{ fontSize: '11px', color: '#a08c70', marginTop: '4px' }}>
                                    Show other players' cursors
                                </div>
                            </div>
                        )}
                        <div style={{
                            padding: '16px',
                            background: 'rgba(122, 59, 46, 0.05)',
                            borderRadius: '6px',
                            border: '1px solid rgba(122, 59, 46, 0.1)'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: '600', color: '#7a3b2e', marginBottom: '4px' }}>
                                {characterLevel || 1}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: '500' }}>
                                Character Level
                            </div>
                            <div style={{ fontSize: '11px', color: '#a08c70', marginTop: '4px' }}>
                                Current level
                            </div>
                        </div>
                        {isInMultiplayer && (
                            <div style={{
                                padding: '16px',
                                background: 'rgba(122, 59, 46, 0.05)',
                                borderRadius: '6px',
                                border: '1px solid rgba(122, 59, 46, 0.1)'
                            }}>
                                <div style={{ fontSize: '24px', fontWeight: '600', color: '#7a3b2e', marginBottom: '4px' }}>
                                    <i className={`fas ${isGMMode ? 'fa-crown' : 'fa-user'} `} style={{ fontSize: '20px' }}></i>
                                </div>
                                <div style={{ fontSize: '12px', color: '#8b6f47', fontWeight: '500' }}>
                                    {isGMMode ? 'Game Master' : 'Player'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#a08c70', marginTop: '4px' }}>
                                    Your role
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Character Progression Section */}
                <div style={{
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(74, 147, 74, 0.08), rgba(74, 147, 74, 0.04))',
                    border: '1px solid rgba(74, 147, 74, 0.15)',
                    borderRadius: '8px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        gap: '12px'
                    }}>
                        <i className="fas fa-level-up-alt" style={{
                            fontSize: '20px',
                            color: '#4a934a'
                        }}></i>
                        <div>
                            <h3 style={{
                                margin: '0 0 4px 0',
                                color: '#4a934a',
                                fontSize: '20px',
                                fontFamily: 'Cinzel, serif',
                                fontWeight: '600'
                            }}>
                                Character Progression
                            </h3>
                            <p style={{
                                margin: '0',
                                color: '#8b6f47',
                                fontSize: '14px',
                                fontStyle: 'italic'
                            }}>
                                Level up your character and track experience progression
                            </p>
                        </div>
                    </div>
                    {/* Character Info Section */}
                    <div className="settings-group" style={{ marginBottom: '24px' }}>
                        <div className="settings-group-title">Current Character</div>
                        <div className="settings-group-description">View and manage your character's progression</div>

                        <div style={{
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.6)',
                            border: '1px solid #d5cbb0',
                            borderRadius: '6px',
                            marginBottom: '16px'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#8b6f47', marginBottom: '4px' }}>Class</div>
                                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#7a3b2e' }}>
                                        {characterClass || 'None'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#8b6f47', marginBottom: '4px' }}>Level</div>
                                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#7a3b2e' }}>
                                        {characterLevel}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#8b6f47', marginBottom: '4px' }}>Experience</div>
                                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#7a3b2e' }}>
                                        {characterExperience} XP
                                    </div>
                                </div>
                            </div>
                            {characterClass === 'Arcanoneer' && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #d5cbb0' }}>
                                    <div style={{ fontSize: '12px', color: '#8b6f47', marginBottom: '4px', textAlign: 'center' }}>
                                        Known Spells
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#7a3b2e', textAlign: 'center' }}>
                                        {knownSpells.length} spells
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Level Controls */}
                        <div className="control-group" style={{ marginBottom: '16px' }}>
                            <label className="control-label">Level Adjustment</label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button
                                    className="control-button secondary"
                                    onClick={() => handleAdjustLevel(-1)}
                                    disabled={characterLevel <= 1}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-minus" style={{ marginRight: '6px' }}></i>
                                    Level Down
                                </button>
                                <button
                                    className="control-button primary"
                                    onClick={() => handleAdjustLevel(1)}
                                    disabled={characterLevel >= 20}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>
                                    Level Up
                                </button>
                            </div>
                            <div className="control-help">
                                <p>Manually adjust character level. Level-down will reverse bonuses from level-up choices.</p>
                            </div>
                        </div>

                        {/* Experience Controls */}
                        <div className="control-group" style={{ marginBottom: '16px' }}>
                            <label className="control-label">Award Experience</label>

                            {/* Player Selector for multiplayer XP awards */}
                            {isInMultiplayer && isGMMode && (
                                <PlayerSelector
                                    partyMembers={partyMembers}
                                    onSelectionChange={setSelectedPlayersForXP}
                                    excludeGM={false}
                                    label="Award XP to:"
                                />
                            )}

                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button
                                    className="control-button"
                                    onClick={() => handleAwardXP(100)}
                                    style={{ flex: 1 }}
                                >
                                    +100 XP
                                </button>
                                <button
                                    className="control-button"
                                    onClick={() => handleAwardXP(300)}
                                    style={{ flex: 1 }}
                                >
                                    +300 XP
                                </button>
                                <button
                                    className="control-button"
                                    onClick={() => handleAwardXP(900)}
                                    style={{ flex: 1 }}
                                >
                                    +900 XP
                                </button>
                            </div>
                            <div className="control-help">
                                <p>Award experience points. {isInMultiplayer ? 'Select which players receive the XP using the icons above.' : 'Leveling up will trigger the level-up modal with spell and stat choices.'}</p>
                            </div>
                        </div>

                        {/* Level-Up History */}
                        {Object.keys(levelUpHistory).length > 0 && (
                            <div className="control-group">
                                <label className="control-label">Level-Up History</label>
                                <div style={{
                                    marginTop: '8px',
                                    padding: '12px',
                                    background: 'rgba(255, 255, 255, 0.4)',
                                    border: '1px solid #d5cbb0',
                                    borderRadius: '4px',
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}>
                                    {Object.entries(levelUpHistory)
                                        .sort(([a], [b]) => parseInt(b) - parseInt(a))
                                        .map(([level, choice]) => (
                                            <div key={level} style={{
                                                padding: '8px',
                                                marginBottom: '4px',
                                                background: 'rgba(122, 59, 46, 0.05)',
                                                borderRadius: '4px',
                                                fontSize: '13px'
                                            }}>
                                                <strong style={{ color: '#7a3b2e' }}>Level {level}:</strong>{' '}
                                                <span style={{ color: '#8b6f47' }}>
                                                    {choice.statChoice === 'vitality' && '+15 Health'}
                                                    {choice.statChoice === 'essence' && '+10 Mana'}
                                                    {choice.statChoice === 'attribute' && `+ 1 ${choice.attribute} `}
                                                    {choice.spellId && ` + Spell(${choice.spellId})`}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                                <div className="control-help">
                                    <p>Shows all level-up choices made. These will be reversed if you level down.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid & Movement Section */}
                <div style={{
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(160, 140, 112, 0.08), rgba(160, 140, 112, 0.04))',
                    border: '1px solid rgba(160, 140, 112, 0.15)',
                    borderRadius: '8px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        gap: '12px'
                    }}>
                        <i className="fas fa-th" style={{
                            fontSize: '20px',
                            color: '#a08c70'
                        }}></i>
                        <div>
                            <h3 style={{
                                margin: '0 0 4px 0',
                                color: '#a08c70',
                                fontSize: '20px',
                                fontFamily: 'Cinzel, serif',
                                fontWeight: '600'
                            }}>
                                Grid & Movement
                            </h3>
                            <p style={{
                                margin: '0',
                                color: '#8b6f47',
                                fontSize: '14px',
                                fontStyle: 'italic'
                            }}>
                                Set grid scale and movement visualization for tactical combat
                            </p>
                        </div>
                    </div>
                    {/* Grid Scale Section */}
                    <div className="settings-group" style={{ marginBottom: '24px' }}>
                        <div className="settings-group-title">Grid Scale</div>
                        <div className="settings-group-description">Set the scale for distance measurements</div>

                        <div className="control-group">
                            <label className="control-label">
                                Feet per Grid Tile: <span className="control-value">{feetPerTile} ft</span>
                            </label>
                            <div className="control-row" style={{ marginBottom: '12px' }}>
                                <span className="range-label">1 ft</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={feetPerTile}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setFeetPerTile(value);
                                        setGameFeetPerTile(value);
                                        syncGameplaySettings({ feetPerTile: value });
                                    }}
                                    className="control-slider"
                                />
                                <span className="range-label">20 ft</span>
                            </div>
                            <div className="control-help">
                                <p><strong>Standard:</strong> D&D 5e uses 5 feet per tile. Pathfinder typically uses 5 feet as well.</p>
                                <p><strong>Tip:</strong> Larger values work well for outdoor encounters or large-scale battles.</p>
                            </div>

                            {/* Grid Scale Preview */}
                            <div style={{
                                marginTop: '16px',
                                padding: '16px',
                                background: 'rgba(255, 255, 255, 0.6)',
                                border: '1px solid #d5cbb0',
                                borderRadius: '6px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '14px', color: '#7a3b2e', marginBottom: '8px', fontWeight: '600' }}>
                                    Grid Scale Preview
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    width: '60px',
                                    height: '60px',
                                    border: '2px solid #7a3b2e',
                                    background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #7a3b2e 19px, #7a3b2e 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #7a3b2e 19px, #7a3b2e 20px)',
                                    borderRadius: '4px',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(122, 59, 46, 0.9)',
                                        color: '#f0e6d2',
                                        padding: '2px 6px',
                                        borderRadius: '3px',
                                        fontSize: '10px',
                                        fontWeight: '600'
                                    }}>
                                        {feetPerTile}ft
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#8b6f47', marginTop: '8px' }}>
                                    Each grid square = {feetPerTile} feet
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Movement Visualization Section */}
                    <div className="settings-group">
                        <div className="settings-group-title">Movement Visualization</div>
                        <div className="settings-group-description">Visual aids for tracking movement during combat</div>

                        <div className="control-group" style={{ marginBottom: '16px' }}>
                            <label className="control-label control-checkbox">
                                <input
                                    type="checkbox"
                                    checked={showMovementVisualization}
                                    onChange={(e) => {
                                        const value = e.target.checked;
                                        setShowMovementVisualization(value);
                                        setGameShowMovementVisualization(value);
                                        syncGameplaySettings({ showMovementVisualization: value });
                                    }}
                                    style={{ marginRight: '8px' }}
                                />
                                Enable Movement Visualization
                            </label>
                            <div className="control-help">
                                <p>Show animated dotted lines when dragging tokens during combat to visualize movement paths and distances.</p>
                            </div>
                        </div>

                        {showMovementVisualization && (
                            <div style={{ paddingLeft: '16px', borderLeft: '3px solid #7a3b2e', marginLeft: '8px' }}>
                                <div className="control-group" style={{ marginBottom: '16px' }}>
                                    <label className="control-label">Movement Line Color</label>
                                    <div className="color-picker-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                        <input
                                            type="color"
                                            value={movementLineColor}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setMovementLineColor(value);
                                                setGameMovementLineColor(value);
                                                syncGameplaySettings({ movementLineColor: value });
                                            }}
                                            className="control-color"
                                            style={{ width: '50px', height: '40px' }}
                                        />
                                        <span className="color-value" style={{
                                            padding: '8px 12px',
                                            background: 'rgba(122, 59, 46, 0.1)',
                                            borderRadius: '4px',
                                            fontFamily: 'monospace',
                                            fontSize: '14px'
                                        }}>{movementLineColor}</span>
                                    </div>
                                    <div className="control-help">
                                        <p>Color of the movement visualization line. Default is gold (#FFD700).</p>
                                    </div>
                                </div>

                                <div className="control-group">
                                    <label className="control-label">
                                        Line Width: <span className="control-value">{movementLineWidth}px</span>
                                    </label>
                                    <div className="control-row" style={{ marginBottom: '12px' }}>
                                        <span className="range-label">1px</span>
                                        <input
                                            type="range"
                                            min="1"
                                            max="8"
                                            value={movementLineWidth}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                setMovementLineWidth(value);
                                                setGameMovementLineWidth(value);
                                                syncGameplaySettings({ movementLineWidth: value });
                                            }}
                                            className="control-slider"
                                        />
                                        <span className="range-label">8px</span>
                                    </div>
                                    <div className="control-help">
                                        <p>Thickness of the movement visualization line.</p>
                                    </div>
                                </div>

                                {/* Movement Line Preview */}
                                <div style={{
                                    marginTop: '16px',
                                    padding: '16px',
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    border: '1px solid #d5cbb0',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '14px', color: '#7a3b2e', marginBottom: '12px', fontWeight: '600' }}>
                                        Movement Line Preview
                                    </div>
                                    <div style={{
                                        position: 'relative',
                                        height: '60px',
                                        background: 'rgba(245, 240, 225, 0.8)',
                                        border: '1px solid #d5cbb0',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                                            <defs>
                                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d5cbb0" strokeWidth="1" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#grid)" />
                                            <path
                                                d="M 20 30 Q 60 10 120 40"
                                                fill="none"
                                                stroke={movementLineColor}
                                                strokeWidth={movementLineWidth}
                                                strokeDasharray="8,4"
                                                style={{
                                                    animation: 'dash 2s linear infinite'
                                                }}
                                            />
                                        </svg>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#8b6f47', marginTop: '8px' }}>
                                        Color: {movementLineColor} • Width: {movementLineWidth}px
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* View from Token Section (GM Only in Multiplayer) */}
                    {isGMMode && isInMultiplayer && (
                        <div className="settings-group" style={{ marginBottom: '24px' }}>
                            <div className="settings-group-title">Player View Settings</div>
                            <div className="settings-group-description">Control how players view the battlefield</div>

                            <div className="control-group">
                                <label className="control-label control-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={defaultViewFromToken}
                                        onChange={(e) => {
                                            const value = e.target.checked;
                                            setDefaultViewFromToken(value);
                                            setGameDefaultViewFromToken(value);
                                            syncGameplaySettings({ defaultViewFromToken: value });
                                        }}
                                        style={{ marginRight: '8px' }}
                                    />
                                    Default View from Token
                                </label>
                                <div className="control-help">
                                    <p><strong>Enabled:</strong> All players will view the map from their character token's perspective by default.</p>
                                    <p><strong>Disabled:</strong> Players have free camera movement and can view the entire map.</p>
                                    <p style={{ marginTop: '8px', fontStyle: 'italic', color: '#7a3b2e' }}>
                                        This setting is synchronized to all players in real-time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Character Management Section */}
                <div style={{
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(199, 69, 69, 0.08), rgba(199, 69, 69, 0.04))',
                    border: '1px solid rgba(199, 69, 69, 0.15)',
                    borderRadius: '8px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px',
                        gap: '12px'
                    }}>
                        <i className="fas fa-user-shield" style={{
                            fontSize: '20px',
                            color: '#c74545'
                        }}></i>
                        <div>
                            <h3 style={{
                                margin: '0 0 4px 0',
                                color: '#c74545',
                                fontSize: '20px',
                                fontFamily: 'Cinzel, serif',
                                fontWeight: '600'
                            }}>
                                Character Management
                            </h3>
                            <p style={{
                                margin: '0',
                                color: '#8b6f47',
                                fontSize: '14px',
                                fontStyle: 'italic'
                            }}>
                                Restore resources and manage character recovery
                            </p>
                        </div>
                    </div>
                    {isGMMode && (
                        <div className="settings-group">
                            <div className="settings-group-title">Rest & Recovery</div>
                            <div className="settings-group-description">Restore character resources and health (GM Only)</div>

                            <div className="control-group">
                                <label className="control-label">Rest Options</label>

                                {/* Player Selector for multiplayer rest actions */}
                                {isInMultiplayer && (
                                    <PlayerSelector
                                        partyMembers={partyMembers}
                                        onSelectionChange={setSelectedPlayersForRest}
                                        excludeGM={false}
                                        label="Apply rest to:"
                                    />
                                )}

                                <div className="control-actions" style={{ justifyContent: 'flex-start', gap: '16px' }}>
                                    <button
                                        className="control-button secondary"
                                        onClick={handleShortRest}
                                        style={{ minWidth: '120px' }}
                                    >
                                        <i className="fas fa-moon" style={{ marginRight: '6px' }}></i>
                                        Short Rest
                                    </button>
                                    <button
                                        className="control-button secondary"
                                        onClick={handleLongRest}
                                        style={{ minWidth: '120px' }}
                                    >
                                        <i className="fas fa-bed" style={{ marginRight: '6px' }}></i>
                                        Long Rest
                                    </button>
                                </div>
                                <div className="control-help" style={{ marginTop: '16px' }}>
                                    <p><strong>Short Rest:</strong> Restores a portion of HP and Mana based on each character's Spirit stat. Recovery starts at 25% and increases by 5% per Spirit modifier (minimum 25%, maximum 75%). Action Points are fully restored.</p>
                                    <p style={{ marginTop: '12px' }}><strong>Long Rest:</strong> Fully restores HP, Mana, and Action Points to maximum. {isInMultiplayer ? 'Select which players receive the rest benefit using the icons above.' : 'Typically represents 8 hours of rest.'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* GM-Only Settings Section */}
                {isGMMode && (
                    <div style={{
                        marginBottom: '24px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(212, 175, 55, 0.04))',
                        border: '1px solid rgba(212, 175, 55, 0.15)',
                        borderRadius: '8px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '16px',
                            gap: '12px'
                        }}>
                            <i className="fas fa-crown" style={{
                                fontSize: '20px',
                                color: '#d4af37'
                            }}></i>
                            <div>
                                <h3 style={{
                                    margin: '0 0 4px 0',
                                    color: '#d4af37',
                                    fontSize: '20px',
                                    fontFamily: 'Cinzel, serif',
                                    fontWeight: '600'
                                }}>
                                    Game Master Settings
                                </h3>
                                <p style={{
                                    margin: '0',
                                    color: '#8b6f47',
                                    fontSize: '14px',
                                    fontStyle: 'italic'
                                }}>
                                    Configure default player token behavior
                                </p>
                            </div>
                        </div>
                        <div className="settings-group">
                            <div className="settings-group-title">Player Token Defaults</div>
                            <div className="settings-group-description">Control how player tokens behave when first placed</div>

                            <div className="control-group">
                                <label className="control-label control-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={defaultViewFromToken}
                                        onChange={(e) => {
                                            const value = e.target.checked;
                                            setDefaultViewFromToken(value);
                                            setGameDefaultViewFromToken(value);
                                            syncGameplaySettings({ defaultViewFromToken: value });
                                        }}
                                        style={{ marginRight: '8px' }}
                                    />
                                    Default View from Token
                                </label>
                                <div className="control-help">
                                    <p>When enabled, players will automatically view from their own token when they place it, enabling fog of war restrictions.</p>
                                    <p>When disabled (default), players have full visibility and must manually select "View from Token" if they want fog of war restrictions.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Multiplayer Session Card - only show when in multiplayer */}
                {isInMultiplayer && (
                    <div style={{
                        marginBottom: '24px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.08), rgba(52, 152, 219, 0.04))',
                        border: '1px solid rgba(52, 152, 219, 0.15)',
                        borderRadius: '8px'
                    }}>
                        {/* Multiplayer Session Section */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '16px',
                            gap: '12px'
                        }}>
                            <i className="fas fa-users" style={{
                                fontSize: '20px',
                                color: '#3498db'
                            }}></i>
                            <div>
                                <h3 style={{
                                    margin: '0 0 4px 0',
                                    color: '#3498db',
                                    fontSize: '20px',
                                    fontFamily: 'Cinzel, serif',
                                    fontWeight: '600'
                                }}>
                                    Multiplayer Session
                                </h3>
                                <p style={{
                                    margin: '0',
                                    color: '#8b6f47',
                                    fontSize: '14px',
                                    fontStyle: 'italic'
                                }}>
                                    Manage your multiplayer session and room settings
                                </p>
                            </div>
                        </div>
                        {/* Room Information Section */}
                        <div className="settings-group" style={{ marginBottom: '24px' }}>
                            <div className="settings-group-title">Room Information</div>
                            <div className="settings-group-description">Current multiplayer room details</div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                                <div className="control-group">
                                    <label className="control-label">Room Name</label>
                                    <div className="control-info" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fas fa-door-open" style={{ color: '#7a3b2e' }}></i>
                                        <span className="room-name-display">{multiplayerRoom?.name || 'Unknown Room'}</span>
                                    </div>
                                </div>

                                <div className="control-group">
                                    <label className="control-label">Your Role</label>
                                    <div className="control-info" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className={`fas ${isGMMode ? 'fa-crown' : 'fa-user'} `} style={{ color: '#7a3b2e' }}></i>
                                        <span className="role-display">{isGMMode ? 'Game Master' : 'Player'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Session Controls Section */}
                        <div className="settings-group">
                            <div className="settings-group-title">Session Controls</div>
                            <div className="settings-group-description">Manage your participation in the session</div>

                            {/* GM-only: Launch Game Session button */}
                            {isGMMode && partyMembers && partyMembers.length > 1 && (
                                <div className="control-group" style={{ marginBottom: '16px' }}>
                                    <label className="control-label">Launch Game Session</label>
                                    <button
                                        className="control-button"
                                        onClick={() => {
                                            if (multiplayerSocket && multiplayerSocket.connected) {
                                                multiplayerSocket.emit('launch_game_session');
                                                addNotification('social', {
                                                    sender: { name: 'System', class: 'system', level: 0 },
                                                    content: 'Game session launched! Waiting for players to respond...',
                                                    type: 'system',
                                                    timestamp: new Date().toISOString()
                                                });
                                            }
                                        }}
                                        style={{ marginTop: '8px', minWidth: '180px' }}
                                    >
                                        <i className="fas fa-play-circle" style={{ marginRight: '6px' }}></i>
                                        Launch Game Session
                                    </button>
                                    <div className="control-help">
                                        <p>Start a game session for your party. Players will receive an invitation to join.</p>
                                    </div>
                                </div>
                            )}

                            <div className="control-group">
                                <label className="control-label">Leave Session</label>
                                <button
                                    className="control-button danger"
                                    onClick={handleLeaveMultiplayer}
                                    style={{ marginTop: '8px', minWidth: '180px' }}
                                >
                                    <i className="fas fa-sign-out-alt" style={{ marginRight: '6px' }}></i>
                                    Leave Multiplayer Room
                                </button>
                                <div className="control-help">
                                    <p><strong>Warning:</strong> This will disconnect you from the multiplayer session and return you to single-player mode.</p>
                                    <p>Your character and progress will be saved, but you'll need to rejoin to continue playing with others.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );



    // Render tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'interface':
                return renderInterfaceTab();
            case 'gameplay':
                return renderGameplayTab();
            default:
                return renderInterfaceTab();
        }
    };

    return (
        <div className="modern-settings">
            {/* Tab Content */}
            <div className="settings-content">
                {renderTabContent()}
            </div>

            {/* Content Moderation Dashboard */}
            <ContentModerationDashboard
                isOpen={showContentModeration}
                onClose={() => setShowContentModeration(false)}
            />
        </div>
    );
});

export default SettingsWindow;
