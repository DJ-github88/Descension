import React, { useState, useEffect } from 'react';
import useGameStore from '../../store/gameStore';
import '../../styles/settings-window.css';

export default function SettingsWindow({ activeTab: propActiveTab }) {
    // Get state and actions from stores
    const takeShortRest = useGameStore(state => state.takeShortRest);
    const takeLongRest = useGameStore(state => state.takeLongRest);
    const isGMMode = useGameStore(state => state.isGMMode);

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

    // Update activeTab when prop changes
    useEffect(() => {
        if (propActiveTab) {
            setActiveTab(propActiveTab);
        }
    }, [propActiveTab]);
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









    // Interface tab content
    const renderInterfaceTab = () => (
        <div className="settings-tab-content">
            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>🪟 Window Scale</h3>
                    <p>Adjust the size of all windows without losing sharpness</p>
                </div>
                <div className="settings-card-body">
                    <div className="control-group">
                        <label className="control-label">
                            Current Size: <span className="control-value">{Math.round(windowScale * 100)}%</span>
                            {hasScaleChanges && (
                                <span className="control-preview">
                                    → <span className="control-value preview">{Math.round(previewWindowScale * 100)}%</span>
                                </span>
                            )}
                        </label>
                        <div className="control-row">
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
                        <div className="control-actions">
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
                    </div>
                </div>
            </div>
        </div>
    );





    // Gameplay tab content
    const renderGameplayTab = () => (
        <div className="settings-tab-content">
            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>📏 Movement & Distance</h3>
                    <p>Configure movement and distance measurements</p>
                </div>
                <div className="settings-card-body">
                    <div className="control-group">
                        <label className="control-label">
                            Feet per Grid Tile: <span className="control-value">{feetPerTile} ft</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={feetPerTile}
                            onChange={(e) => setFeetPerTile(parseInt(e.target.value))}
                            className="control-slider"
                        />
                        <div className="control-help">
                            <p>Determines how many feet each grid tile represents. Standard D&D uses 5 feet per tile.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>🎯 Movement Visualization</h3>
                    <p>Configure movement tracking and visualization during combat</p>
                </div>
                <div className="settings-card-body">
                    <div className="control-group">
                        <label className="control-label">
                            <input
                                type="checkbox"
                                checked={showMovementVisualization}
                                onChange={(e) => setShowMovementVisualization(e.target.checked)}
                                className="control-checkbox"
                            />
                            Enable Movement Visualization
                        </label>
                        <div className="control-help">
                            <p>Show animated dotted lines when dragging tokens during combat to visualize movement paths and distances.</p>
                        </div>
                    </div>

                    {showMovementVisualization && (
                        <>
                            <div className="control-group">
                                <label className="control-label">
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

                            <div className="control-group">
                                <label className="control-label">
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
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>🎲 Rest & Recovery</h3>
                    <p>Manage character rest options and recovery</p>
                </div>
                <div className="settings-card-body">
                    <div className="control-group">
                        <label className="control-label">Rest Options</label>
                        <div className="control-row">
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
                    </div>
                </div>
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
}
