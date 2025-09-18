import React, { useState, useEffect, memo } from 'react';
import useGameStore from '../../store/gameStore';
import '../../styles/settings-window.css';

const SettingsWindow = memo(function SettingsWindow({ activeTab: propActiveTab }) {
    // Get state and actions from stores
    const takeShortRest = useGameStore(state => state.takeShortRest);
    const takeLongRest = useGameStore(state => state.takeLongRest);
    const isGMMode = useGameStore(state => state.isGMMode);
    const isInMultiplayer = useGameStore(state => state.isInMultiplayer);
    const multiplayerRoom = useGameStore(state => state.multiplayerRoom);
    const leaveMultiplayer = useGameStore(state => state.leaveMultiplayer);

    // Window scale controls
    const windowScale = useGameStore(state => state.windowScale);
    const windowScaleUp = useGameStore(state => state.windowScaleUp);
    const windowScaleDown = useGameStore(state => state.windowScaleDown);
    const resetWindowScale = useGameStore(state => state.resetWindowScale);
    const setWindowScale = useGameStore(state => state.setWindowScale);
    const feetPerTile = useGameStore(state => state.feetPerTile);
    const setFeetPerTile = useGameStore(state => state.setFeetPerTile);
    const showMovementVisualization = useGameStore(state => state.showMovementVisualization);
    const setShowMovementVisualization = useGameStore(state => state.setShowMovementVisualization);
    const movementLineColor = useGameStore(state => state.movementLineColor);
    const setMovementLineColor = useGameStore(state => state.setMovementLineColor);
    const movementLineWidth = useGameStore(state => state.movementLineWidth);
    const setMovementLineWidth = useGameStore(state => state.setMovementLineWidth);



    // Local state
    const [activeTab, setActiveTab] = useState(propActiveTab || 'interface');

    // Update activeTab when prop changes (memoized to prevent unnecessary re-renders)
    useEffect(() => {
        if (propActiveTab && propActiveTab !== activeTab) {
            setActiveTab(propActiveTab);
        }
    }, [propActiveTab, activeTab]);
    const [restMessage, setRestMessage] = useState('');

    // Window scale preview state
    const [previewWindowScale, setPreviewWindowScale] = useState(windowScale);
    const [hasScaleChanges, setHasScaleChanges] = useState(false);







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
        setPreviewWindowScale(1.0);
        setHasScaleChanges(Math.abs(1.0 - windowScale) > 0.01);
    };

    // Quick scale adjustments
    const previewScaleDown = () => {
        const newScale = Math.max(0.5, previewWindowScale / 1.1);
        setPreviewWindowScale(newScale);
        setHasScaleChanges(Math.abs(newScale - windowScale) > 0.01);
    };

    const previewScaleUp = () => {
        const newScale = Math.min(1.5, previewWindowScale * 1.1);
        setPreviewWindowScale(newScale);
        setHasScaleChanges(Math.abs(newScale - windowScale) > 0.01);
    };

    // Handle short rest
    const handleShortRest = () => {
        takeShortRest();
        setRestMessage('Short rest taken. Characters have recovered some resources.');
        setTimeout(() => setRestMessage(''), 3000);
    };

    // Handle long rest
    const handleLongRest = () => {
        takeLongRest();
        setRestMessage('Long rest taken. Characters have fully recovered.');
        setTimeout(() => setRestMessage(''), 3000);
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
                {/* Interface Overview */}
                <div style={{
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(122, 59, 46, 0.1), rgba(122, 59, 46, 0.05))',
                    border: '2px solid rgba(122, 59, 46, 0.2)',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        margin: '0 0 8px 0',
                        color: '#7a3b2e',
                        fontSize: '24px',
                        fontFamily: 'Cinzel, serif'
                    }}>
                        Interface Configuration
                    </h2>
                    <p style={{
                        margin: '0',
                        color: '#8b6f47',
                        fontSize: '16px',
                        fontStyle: 'italic'
                    }}>
                        Customize window scaling and display preferences
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '24px',
                        marginTop: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#7a3b2e' }}>
                                {Math.round(windowScale * 100)}%
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b6f47' }}>Window Scale</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#7a3b2e' }}>
                                <i className="fas fa-desktop"></i>
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b6f47' }}>Display</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: hasScaleChanges ? '#4a934a' : '#7a3b2e' }}>
                                {hasScaleChanges ? 'PREVIEW' : 'CURRENT'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b6f47' }}>Status</div>
                        </div>
                    </div>
                </div>

                {/* Window Scaling Card */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <h3>
                            <i className="fas fa-expand-arrows-alt" style={{ marginRight: '8px' }}></i>
                            Window Scaling
                        </h3>
                        <p>Adjust the size of all windows without losing sharpness</p>
                    </div>
                    <div className="settings-card-body">
                        <div className="settings-group">
                            <div className="settings-group-title">Scale Adjustment</div>
                            <div className="settings-group-description">Make windows larger or smaller to fit your display</div>

                            <div className="control-group">
                                <label className="control-label" style={{ textAlign: 'center', display: 'block' }}>
                                    Current Size: <span className="control-value">{Math.round(windowScale * 100)}%</span>
                                    {hasScaleChanges && (
                                        <span className="control-preview">
                                            → <span className="control-value preview">{Math.round(previewWindowScale * 100)}%</span>
                                        </span>
                                    )}
                                </label>

                                <div className="control-row" style={{ marginBottom: '16px', marginTop: '16px' }}>
                                    <button
                                        className="control-button secondary"
                                        onClick={previewScaleDown}
                                        disabled={previewWindowScale <= 0.5}
                                        style={{ minWidth: '80px' }}
                                    >
                                        <i className="fas fa-minus" style={{ marginRight: '6px' }}></i>
                                        Smaller
                                    </button>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span className="range-label">50%</span>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="1.5"
                                            step="0.05"
                                            value={previewWindowScale}
                                            onChange={handleWindowScalePreviewChange}
                                            className="control-slider"
                                        />
                                        <span className="range-label">150%</span>
                                    </div>
                                    <button
                                        className="control-button secondary"
                                        onClick={previewScaleUp}
                                        disabled={previewWindowScale >= 1.5}
                                        style={{ minWidth: '80px' }}
                                    >
                                        <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>
                                        Larger
                                    </button>
                                </div>

                                <div className="control-actions" style={{ justifyContent: 'center', gap: '16px' }}>
                                    <button
                                        className="control-button secondary"
                                        onClick={resetWindowScalePreview}
                                        style={{ minWidth: '120px' }}
                                    >
                                        <i className="fas fa-undo" style={{ marginRight: '6px' }}></i>
                                        Reset to 100%
                                    </button>
                                    <button
                                        className={`control-button primary ${hasScaleChanges ? 'pulse' : ''}`}
                                        onClick={applyWindowScale}
                                        disabled={!hasScaleChanges}
                                        style={{ minWidth: '120px' }}
                                    >
                                        <i className="fas fa-check" style={{ marginRight: '6px' }}></i>
                                        {hasScaleChanges ? 'Apply Changes' : 'No Changes'}
                                    </button>
                                </div>

                                <div className="control-help">
                                    <p><strong>Purpose:</strong> Scale all windows uniformly for better visibility on high-resolution displays or to fit more content on smaller screens.</p>
                                    <p><strong>Tip:</strong> Use 125-150% for 4K displays, or 75-90% to fit more windows on screen.</p>
                                </div>

                                {/* Window Scale Preview */}
                                <div style={{
                                    marginTop: '16px',
                                    padding: '16px',
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    border: '1px solid #d5cbb0',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '14px', color: '#7a3b2e', marginBottom: '12px', fontWeight: '600' }}>
                                        Window Scale Preview
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '16px',
                                        marginBottom: '12px'
                                    }}>
                                        {/* Current window preview */}
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                width: `${60 * (windowScale * 0.8)}px`,
                                                height: `${40 * (windowScale * 0.8)}px`,
                                                border: '2px solid #a08c70',
                                                borderRadius: '4px',
                                                background: 'linear-gradient(135deg, #f0e6d2, #e8dcc0)',
                                                position: 'relative',
                                                margin: '0 auto 4px',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '2px',
                                                    left: '2px',
                                                    right: '2px',
                                                    height: '8px',
                                                    background: 'linear-gradient(135deg, #7a3b2e, #5e2e23)',
                                                    borderRadius: '2px'
                                                }}></div>
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '4px',
                                                    left: '4px',
                                                    right: '4px',
                                                    height: '2px',
                                                    background: '#d5cbb0',
                                                    borderRadius: '1px'
                                                }}></div>
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#8b6f47' }}>Current</div>
                                        </div>

                                        <div style={{ color: '#7a3b2e', fontSize: '16px' }}>→</div>

                                        {/* Preview window */}
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                width: `${60 * (previewWindowScale * 0.8)}px`,
                                                height: `${40 * (previewWindowScale * 0.8)}px`,
                                                border: hasScaleChanges ? '2px solid #7a3b2e' : '2px solid #a08c70',
                                                borderRadius: '4px',
                                                background: hasScaleChanges ?
                                                    'linear-gradient(135deg, rgba(122, 59, 46, 0.1), rgba(122, 59, 46, 0.05))' :
                                                    'linear-gradient(135deg, #f0e6d2, #e8dcc0)',
                                                position: 'relative',
                                                margin: '0 auto 4px',
                                                transition: 'all 0.3s ease',
                                                boxShadow: hasScaleChanges ? '0 0 8px rgba(122, 59, 46, 0.3)' : 'none'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '2px',
                                                    left: '2px',
                                                    right: '2px',
                                                    height: '8px',
                                                    background: 'linear-gradient(135deg, #7a3b2e, #5e2e23)',
                                                    borderRadius: '2px'
                                                }}></div>
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '4px',
                                                    left: '4px',
                                                    right: '4px',
                                                    height: '2px',
                                                    background: '#d5cbb0',
                                                    borderRadius: '1px'
                                                }}></div>
                                            </div>
                                            <div style={{ fontSize: '10px', color: hasScaleChanges ? '#7a3b2e' : '#8b6f47', fontWeight: hasScaleChanges ? '600' : 'normal' }}>
                                                {hasScaleChanges ? 'Preview' : 'Same'}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#8b6f47' }}>
                                        {hasScaleChanges ?
                                            `Scaling from ${Math.round(windowScale * 100)}% to ${Math.round(previewWindowScale * 100)}%` :
                                            `Current scale: ${Math.round(windowScale * 100)}%`
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );





    // Gameplay tab content
    const renderGameplayTab = () => (
        <div className="settings-content-clean">
            <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
                {/* Gameplay Overview */}
                <div style={{
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(122, 59, 46, 0.1), rgba(122, 59, 46, 0.05))',
                    border: '2px solid rgba(122, 59, 46, 0.2)',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        margin: '0 0 8px 0',
                        color: '#7a3b2e',
                        fontSize: '24px',
                        fontFamily: 'Cinzel, serif'
                    }}>
                        Gameplay Configuration
                    </h2>
                    <p style={{
                        margin: '0',
                        color: '#8b6f47',
                        fontSize: '16px',
                        fontStyle: 'italic'
                    }}>
                        Configure grid measurements, movement mechanics, and character management options
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '24px',
                        marginTop: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#7a3b2e' }}>{feetPerTile}ft</div>
                            <div style={{ fontSize: '12px', color: '#8b6f47' }}>Grid Scale</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: showMovementVisualization ? '#4a934a' : '#c74545' }}>
                                {showMovementVisualization ? 'ON' : 'OFF'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8b6f47' }}>Movement Viz</div>
                        </div>
                        {isInMultiplayer && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '20px', fontWeight: '600', color: '#7a3b2e' }}>
                                    <i className={`fas ${isGMMode ? 'fa-crown' : 'fa-user'}`}></i>
                                </div>
                                <div style={{ fontSize: '12px', color: '#8b6f47' }}>{isGMMode ? 'GM' : 'Player'}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid & Movement Card */}
                <div className="settings-card" style={{ marginBottom: '24px' }}>
                    <div className="settings-card-header">
                        <h3>
                            <i className="fas fa-th" style={{ marginRight: '8px' }}></i>
                            Grid & Movement
                        </h3>
                        <p>Configure grid measurements and movement mechanics for tactical gameplay</p>
                    </div>
                    <div className="settings-card-body">
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
                                        onChange={(e) => setFeetPerTile(parseInt(e.target.value))}
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
                                        onChange={(e) => setShowMovementVisualization(e.target.checked)}
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
                                                onChange={(e) => setMovementLineColor(e.target.value)}
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
                                                onChange={(e) => setMovementLineWidth(parseInt(e.target.value))}
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
                                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d5cbb0" strokeWidth="1"/>
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
                    </div>
                </div>

                {/* Character Management Card */}
                <div className="settings-card" style={{ marginBottom: '24px' }}>
                    <div className="settings-card-header">
                        <h3>
                            <i className="fas fa-user-shield" style={{ marginRight: '8px' }}></i>
                            Character Management
                        </h3>
                        <p>Manage character resources and recovery options</p>
                    </div>
                    <div className="settings-card-body">
                        <div className="settings-group">
                            <div className="settings-group-title">Rest & Recovery</div>
                            <div className="settings-group-description">Restore character resources and health</div>

                            <div className="control-group">
                                <label className="control-label">Rest Options</label>
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
                                {restMessage && (
                                    <div className="control-message success" style={{ marginTop: '12px' }}>
                                        <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                                        {restMessage}
                                    </div>
                                )}
                                <div className="control-help">
                                    <p><strong>Short Rest:</strong> Recover some resources and abilities (typically 1 hour).</p>
                                    <p><strong>Long Rest:</strong> Fully restore health, spell slots, and abilities (typically 8 hours).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Multiplayer Session Card - only show when in multiplayer */}
                {isInMultiplayer && (
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <h3>
                                <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
                                Multiplayer Session
                            </h3>
                            <p>Manage your current multiplayer session</p>
                        </div>
                        <div className="settings-card-body">
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
                                            <i className={`fas ${isGMMode ? 'fa-crown' : 'fa-user'}`} style={{ color: '#7a3b2e' }}></i>
                                            <span className="role-display">{isGMMode ? 'Game Master' : 'Player'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Session Controls Section */}
                            <div className="settings-group">
                                <div className="settings-group-title">Session Controls</div>
                                <div className="settings-group-description">Manage your participation in the session</div>

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
        </div>
    );
});

export default SettingsWindow;
