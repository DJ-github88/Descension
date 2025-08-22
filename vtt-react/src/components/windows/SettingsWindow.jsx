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
        <div style={{
            padding: '20px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="settings-title" style={{ textAlign: 'center', marginBottom: '8px' }}>Window Scale</h3>
                <p className="settings-description" style={{ textAlign: 'center', marginBottom: '40px' }}>Adjust the size of all windows without losing sharpness</p>

                <div className="control-group">
                    <label className="control-label" style={{ textAlign: 'center', display: 'block', marginBottom: '20px' }}>
                        Current Size: <span className="control-value">{Math.round(windowScale * 100)}%</span>
                        {hasScaleChanges && (
                            <span className="control-preview">
                                → <span className="control-value preview">{Math.round(previewWindowScale * 100)}%</span>
                            </span>
                        )}
                    </label>
                    <div className="control-row" style={{ marginBottom: '30px' }}>
                        <button
                            className="control-button secondary"
                            onClick={previewScaleDown}
                            disabled={previewWindowScale <= 0.5}
                        >
                            Smaller
                        </button>
                        <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.05"
                            value={previewWindowScale}
                            onChange={handleWindowScalePreviewChange}
                            className="control-slider"
                        />
                        <button
                            className="control-button secondary"
                            onClick={previewScaleUp}
                            disabled={previewWindowScale >= 1.5}
                        >
                            Larger
                        </button>
                    </div>
                    <div className="control-actions" style={{ marginBottom: '30px' }}>
                        <button
                            className="control-button secondary"
                            onClick={resetWindowScalePreview}
                        >
                            Reset to 100%
                        </button>
                        <button
                            className={`control-button primary ${hasScaleChanges ? 'pulse' : ''}`}
                            onClick={applyWindowScale}
                            disabled={!hasScaleChanges}
                        >
                            {hasScaleChanges ? 'Apply Changes' : 'No Changes'}
                        </button>
                    </div>
                    <div className="control-help" style={{ textAlign: 'center' }}>
                        <p>Use this to make windows larger on high-resolution displays or smaller to fit more on screen.</p>
                    </div>
                </div>
            </div>
        </div>
    );





    // Gameplay tab content
    const renderGameplayTab = () => (
        <div style={{
            padding: '20px',
            height: '100%',
            overflowY: 'auto'
        }}>
            {/* Grid & Movement Section */}
            <div style={{ marginBottom: '30px' }}>
                <h2 className="settings-title" style={{ marginBottom: '8px' }}>Grid & Movement</h2>
                <p className="settings-description" style={{ marginBottom: '20px' }}>Configure grid measurements and movement mechanics</p>

                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#7a3b2e', marginBottom: '5px' }}>Grid Scale</h3>
                    <p style={{ fontSize: '14px', color: '#8b6f47', marginBottom: '15px', fontStyle: 'italic' }}>Set the scale for distance measurements</p>

                    <div className="control-group">
                        <label className="control-label" style={{ marginBottom: '10px' }}>
                            Feet per Grid Tile: <span className="control-value">{feetPerTile} ft</span>
                        </label>
                        <div className="control-row" style={{ marginBottom: '15px' }}>
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
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#7a3b2e', marginBottom: '5px' }}>Movement Visualization</h3>
                <p style={{ fontSize: '14px', color: '#8b6f47', marginBottom: '15px', fontStyle: 'italic' }}>Visual aids for tracking movement during combat</p>

                <div className="control-group">
                    <label className="control-label" style={{ marginBottom: '10px' }}>
                        <input
                            type="checkbox"
                            checked={showMovementVisualization}
                            onChange={(e) => setShowMovementVisualization(e.target.checked)}
                            className="control-checkbox"
                        />
                        Enable Movement Visualization
                    </label>
                    <div className="control-help" style={{ marginBottom: '15px' }}>
                        <p>Show animated dotted lines when dragging tokens during combat to visualize movement paths and distances.</p>
                    </div>
                </div>

                {showMovementVisualization && (
                    <>
                        <div className="control-group" style={{ marginBottom: '15px' }}>
                            <label className="control-label" style={{ marginBottom: '10px' }}>
                                Movement Line Color
                            </label>
                            <div className="color-picker-container">
                                <input
                                    type="color"
                                    value={movementLineColor}
                                    onChange={(e) => setMovementLineColor(e.target.value)}
                                    className="control-color-picker"
                                />
                                <span className="color-value">{movementLineColor}</span>
                            </div>
                            <div className="control-help">
                                <p>Color of the movement visualization line. Default is gold (#FFD700).</p>
                            </div>
                        </div>

                        <div className="control-group" style={{ marginBottom: '15px' }}>
                            <label className="control-label" style={{ marginBottom: '10px' }}>
                                Line Width: <span className="control-value">{movementLineWidth}px</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="8"
                                value={movementLineWidth}
                                onChange={(e) => setMovementLineWidth(parseInt(e.target.value))}
                                className="control-slider"
                            />
                            <div className="control-help">
                                <p>Thickness of the movement visualization line.</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Character Management Section */}
            <div style={{ marginBottom: '30px' }}>
                <h2 className="settings-title" style={{ marginBottom: '8px' }}>Character Management</h2>
                <p className="settings-description" style={{ marginBottom: '20px' }}>Manage character resources and recovery</p>

                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#7a3b2e', marginBottom: '5px' }}>Rest & Recovery</h3>
                    <p style={{ fontSize: '14px', color: '#8b6f47', marginBottom: '15px', fontStyle: 'italic' }}>Restore character resources and health</p>

                    <div className="control-group">
                        <label className="control-label" style={{ marginBottom: '10px' }}>Rest Options</label>
                        <div className="control-row" style={{ marginBottom: '15px' }}>
                            <button
                                className="control-button secondary"
                                onClick={handleShortRest}
                            >
                                Short Rest
                            </button>
                            <button
                                className="control-button secondary"
                                onClick={handleLongRest}
                            >
                                Long Rest
                            </button>
                        </div>
                        {restMessage && (
                            <div className="control-message success">
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

            {/* Multiplayer Section - only show when in multiplayer */}
            {isInMultiplayer && (
                <div style={{ marginBottom: '30px' }}>
                    <h2 className="settings-title" style={{ marginBottom: '8px' }}>Multiplayer Session</h2>
                    <p className="settings-description" style={{ marginBottom: '20px' }}>Manage your current multiplayer session</p>

                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#7a3b2e', marginBottom: '5px' }}>Room Information</h3>
                        <p style={{ fontSize: '14px', color: '#8b6f47', marginBottom: '15px', fontStyle: 'italic' }}>Current multiplayer room details</p>

                        <div className="control-group" style={{ marginBottom: '15px' }}>
                            <label className="control-label" style={{ marginBottom: '5px' }}>Room Name</label>
                            <div className="control-info">
                                <span className="room-name-display">{multiplayerRoom?.name || 'Unknown Room'}</span>
                            </div>
                        </div>

                        <div className="control-group" style={{ marginBottom: '15px' }}>
                            <label className="control-label" style={{ marginBottom: '5px' }}>Your Role</label>
                            <div className="control-info">
                                <span className="role-display">{isGMMode ? 'Game Master' : 'Player'}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#7a3b2e', marginBottom: '5px' }}>Session Controls</h3>
                        <p style={{ fontSize: '14px', color: '#8b6f47', marginBottom: '15px', fontStyle: 'italic' }}>Manage your participation in the session</p>

                        <div className="control-group">
                            <label className="control-label" style={{ marginBottom: '10px' }}>Leave Session</label>
                            <button
                                className="control-button danger"
                                onClick={handleLeaveMultiplayer}
                                style={{ marginBottom: '15px' }}
                            >
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
