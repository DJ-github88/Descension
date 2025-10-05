import React, { useState, useEffect } from 'react';
import useGameStore from '../../../store/gameStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import { WOW_ICON_BASE_URL } from '../../item-generation/wowIcons';
import './styles/GridTools.css';

const GridTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    // Get grid settings from game store
    const {
        gridSize,
        gridOffsetX,
        gridOffsetY,
        gridLineThickness,
        gridLineOpacity,
        gridLineColor,
        gridMovesWithBackground,
        backgrounds,
        activeBackgroundId,
        isBackgroundManipulationMode,
        isGridAlignmentMode,
        setGridSize,
        setGridOffset,
        setGridLineThickness,
        setGridLineOpacity,
        setGridLineColor,
        setGridMovesWithBackground,
        setBackgroundManipulationMode,
        setActiveBackground,
        setGridAlignmentMode,
        addBackground,
        updateBackground,
        removeBackground,
        showGrid,
        setShowGrid
    } = useGameStore();

    // Local state for UI
    const [selectedThickness, setSelectedThickness] = useState(gridLineThickness);
    const [selectedOpacity, setSelectedOpacity] = useState(gridLineOpacity);
    const [selectedColor, setSelectedColor] = useState(gridLineColor);
    const [selectedGridSize, setSelectedGridSize] = useState(gridSize);
    const [offsetX, setOffsetX] = useState(gridOffsetX);
    const [offsetY, setOffsetY] = useState(gridOffsetY);

    // Simplified grid tool - just the align grid functionality
    const gridAlignTool = {
        id: 'grid_align',
        name: 'Align Grid',
        icon: 'spell_arcane_arcaneorb',
        description: 'Draw rectangles to align grid with background image'
    };

    // Thickness presets
    const thicknessPresets = [
        { value: 0.5, label: 'Thin', icon: 'inv_misc_arrowdown' },
        { value: 1, label: 'Normal', icon: 'inv_misc_arrowdown' },
        { value: 2, label: 'Thick', icon: 'inv_misc_arrowdown' },
        { value: 3, label: 'Very Thick', icon: 'inv_misc_arrowdown' },
        { value: 5, label: 'Ultra Thick', icon: 'inv_misc_arrowdown' }
    ];

    // Color presets
    const colorPresets = [
        { value: 'rgba(212, 175, 55, 0.8)', label: 'Gold', color: '#d4af37' },
        { value: 'rgba(255, 255, 255, 0.8)', label: 'White', color: '#ffffff' },
        { value: 'rgba(0, 0, 0, 0.8)', label: 'Black', color: '#000000' },
        { value: 'rgba(77, 155, 230, 0.8)', label: 'Blue', color: '#4d9be6' },
        { value: 'rgba(255, 0, 0, 0.8)', label: 'Red', color: '#ff0000' },
        { value: 'rgba(0, 255, 0, 0.8)', label: 'Green', color: '#00ff00' }
    ];

    // Update local state when store changes
    useEffect(() => {
        setSelectedThickness(gridLineThickness);
        setSelectedOpacity(gridLineOpacity);
        setSelectedColor(gridLineColor);
        setSelectedGridSize(gridSize);
        setOffsetX(gridOffsetX);
        setOffsetY(gridOffsetY);
    }, [gridLineThickness, gridLineOpacity, gridLineColor, gridSize, gridOffsetX, gridOffsetY]);

    const handleGridAlign = () => {
        if (isGridAlignmentMode) {
            // Exit grid alignment mode
            setGridAlignmentMode(false);
        } else {
            // Enter grid alignment mode
            // Exit level editor mode if active
            const levelEditorStore = useLevelEditorStore.getState();
            if (levelEditorStore.isEditorMode) {
                levelEditorStore.setEditorMode(false);
                levelEditorStore.setActiveTool('select');
            }

            // Exit background manipulation mode if active
            if (isBackgroundManipulationMode) {
                setBackgroundManipulationMode(false);
            }

            setGridAlignmentMode(true);
        }
    };

    const handleThicknessChange = (thickness) => {
        setSelectedThickness(thickness);
        setGridLineThickness(thickness);
    };

    const handleOpacityChange = (opacity) => {
        setSelectedOpacity(opacity);
        setGridLineOpacity(opacity);
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        setGridLineColor(color);
    };



    const handleGridSizeChange = (size) => {
        setSelectedGridSize(size);
        setGridSize(size);
    };

    const handleOffsetChange = (x, y) => {
        setOffsetX(x);
        setOffsetY(y);
        setGridOffset(x, y);
    };



    const handleBackgroundUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (10MB limit)
            const MAX_FILE_SIZE = 10 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                alert(`File size too large! Please choose an image smaller than 10MB.\n\nCurrent file size: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
                e.target.value = '';
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                // Get current camera position to center the background
                const gameStore = useGameStore.getState();
                const { cameraX, cameraY } = gameStore;

                // Create new background centered on current view
                const backgroundId = addBackground({
                    url: reader.result,
                    name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                    position: { x: cameraX, y: cameraY }, // Center on current camera view
                    scale: 1.0,
                    opacity: 1.0,
                    sticksToGrid: true // Default to grid-aligned for dungeon maps
                });

                // Set as active background
                setActiveBackground(backgroundId);

                // Clear the file input
                e.target.value = '';
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
                e.target.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleBackgroundManipulation = () => {
        if (isBackgroundManipulationMode) {
            // Exit background manipulation mode
            setBackgroundManipulationMode(false);
        } else {
            // Enter background manipulation mode
            // Exit level editor mode if active
            const levelEditorStore = useLevelEditorStore.getState();
            if (levelEditorStore.isEditorMode) {
                levelEditorStore.setEditorMode(false);
                levelEditorStore.setActiveTool('select');
            }

            // If there's a background available, set it as active and enter manipulation mode
            if (activeBackgroundId) {
                setBackgroundManipulationMode(true);
            }
        }
    };

    return (
        <div className="grid-tools">
            {/* Background Management - Redesigned for better UX */}
            <div className="tool-section">
                <h4>Background Management</h4>

                {/* Upload Section - Always Visible */}
                <div className="background-upload-section">
                    <input
                        type="file"
                        id="background-upload"
                        accept="image/*"
                        onChange={handleBackgroundUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        className="upload-button"
                        onClick={() => document.getElementById('background-upload').click()}
                        title="Upload a background image for your map"
                    >
                        <img
                            src={`${WOW_ICON_BASE_URL}/inv_misc_map02.jpg`}
                            alt="Upload"
                            className="upload-icon"
                        />
                        <span>Upload Background</span>
                    </button>
                </div>

                {/* Active Background Controls - Only show when background exists */}
                {backgrounds.length > 0 && (
                    <div className="active-background-section">
                        {backgrounds.map((bg) => (
                            <div key={bg.id} className={`background-card ${bg.id === activeBackgroundId ? 'active' : ''}`}>
                                {/* Background Header */}
                                <div className="background-header">
                                    <div className="background-title">
                                        <span className="background-name">{bg.name}</span>
                                        {bg.id === activeBackgroundId && <span className="active-badge">Active</span>}
                                    </div>
                                    <div className="background-actions">
                                        {bg.id !== activeBackgroundId && (
                                            <button
                                                className="action-button select"
                                                onClick={() => setActiveBackground(bg.id)}
                                                title="Set as active background"
                                            >
                                                Select
                                            </button>
                                        )}
                                        <button
                                            className="action-button remove"
                                            onClick={() => removeBackground(bg.id)}
                                            title="Remove this background"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>

                                {/* Background Controls - Only for active background */}
                                {bg.id === activeBackgroundId && (
                                    <div className="background-controls">
                                        {/* Grid Alignment Toggle */}
                                        <div className="control-row">
                                            <label className="toggle-control">
                                                <input
                                                    type="checkbox"
                                                    checked={bg.sticksToGrid || false}
                                                    onChange={(e) => {
                                                        const isGridAligned = e.target.checked;
                                                        const updates = { sticksToGrid: isGridAligned };
                                                        if (isGridAligned) {
                                                            const gameStore = useGameStore.getState();
                                                            const { cameraX, cameraY } = gameStore;
                                                            updates.position = { x: cameraX, y: cameraY };
                                                        }
                                                        updateBackground(bg.id, updates);
                                                    }}
                                                />
                                                <span className="toggle-label">Grid-Aligned</span>
                                                <small>Background moves with grid</small>
                                            </label>
                                        </div>

                                        {/* Edit Position Button */}
                                        <div className="control-row">
                                            <button
                                                className={`edit-button ${isBackgroundManipulationMode ? 'active' : ''}`}
                                                onClick={toggleBackgroundManipulation}
                                                title={isBackgroundManipulationMode ? 'Exit background editing mode' : 'Edit background position and size'}
                                            >
                                                <img
                                                    src={`${WOW_ICON_BASE_URL}/inv_misc_gear_01.jpg`}
                                                    alt="Edit"
                                                    className="edit-icon"
                                                />
                                                <span>{isBackgroundManipulationMode ? 'Exit Edit Mode' : 'Edit Position'}</span>
                                            </button>
                                        </div>

                                        {/* Edit Instructions */}
                                        {isBackgroundManipulationMode && (
                                            <div className="edit-instructions">
                                                <small>
                                                    <strong>Drag</strong> image to move • <strong>Drag corners</strong> to resize • <strong>Drag green circle</strong> to rotate
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Grid Controls - Redesigned for better UX */}
            <div className="tool-section">
                <h4>Grid Controls</h4>

                {/* Grid Visibility and Alignment in a clean layout */}
                <div className="grid-controls-layout">
                    {/* Grid Visibility Toggle */}
                    <div className="grid-control-item">
                        <label className="grid-toggle">
                            <input
                                type="checkbox"
                                checked={showGrid}
                                onChange={() => setShowGrid(!showGrid)}
                            />
                            <span className="toggle-switch"></span>
                            <div className="toggle-content">
                                <span className="toggle-title">Show Grid Lines</span>
                                <small>Toggle grid visibility on/off</small>
                            </div>
                        </label>
                    </div>

                    {/* Grid Alignment Tool */}
                    <div className="grid-control-item">
                        <button
                            className={`grid-align-button ${isGridAlignmentMode ? 'active' : ''}`}
                            onClick={handleGridAlign}
                            title={gridAlignTool.description}
                        >
                            <div className="button-content">
                                <img
                                    src={`${WOW_ICON_BASE_URL}${gridAlignTool.icon}.jpg`}
                                    alt={gridAlignTool.name}
                                    className="align-icon"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${WOW_ICON_BASE_URL}inv_misc_questionmark.jpg`;
                                    }}
                                />
                                <div className="button-text">
                                    <span className="button-title">
                                        {isGridAlignmentMode ? 'Exit Align Mode' : 'Align Grid'}
                                    </span>
                                    <small>Align grid to your background image</small>
                                </div>
                            </div>
                        </button>

                        {/* Alignment Instructions */}
                        {isGridAlignmentMode && (
                            <div className="align-instructions">
                                <small>
                                    <strong>Instructions:</strong> Draw rectangles on your background image to align the grid to your map.
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid Appearance - Redesigned for Clean Layout */}
            <div className="tool-section">
                <h4>Grid Appearance</h4>

                {/* Thickness Control - Compact Horizontal Layout */}
                <div className="appearance-group">
                    <label className="appearance-label">Line Thickness ({selectedThickness}px)</label>
                    <div className="thickness-buttons">
                        {thicknessPresets.map(preset => (
                            <button
                                key={preset.value}
                                className={`thickness-option ${selectedThickness === preset.value ? 'active' : ''}`}
                                onClick={() => handleThicknessChange(preset.value)}
                                title={`${preset.label} (${preset.value}px)`}
                            >
                                <div
                                    className="thickness-line"
                                    style={{
                                        height: `${Math.max(2, Math.min(preset.value * 2, 8))}px`,
                                        backgroundColor: selectedThickness === preset.value ? '#f0e6d2' : '#7a3b2e'
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Opacity Control - Compact Slider */}
                <div className="appearance-group">
                    <label className="appearance-label">Opacity ({Math.round(selectedOpacity * 100)}%)</label>
                    <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={selectedOpacity}
                        onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                        className="compact-slider"
                    />
                </div>

                {/* Color Control - Compact Grid */}
                <div className="appearance-group">
                    <label className="appearance-label">Line Color</label>
                    <div className="color-grid">
                        {colorPresets.map(preset => (
                            <button
                                key={preset.value}
                                className={`color-option ${selectedColor === preset.value ? 'active' : ''}`}
                                onClick={() => handleColorChange(preset.value)}
                                title={preset.label}
                                style={{
                                    backgroundColor: preset.color
                                }}
                            />
                        ))}
                        <input
                            type="color"
                            value={selectedColor.match(/#[0-9a-f]{6}/i)?.[0] || '#d4af37'}
                            onChange={(e) => handleColorChange(`rgba(${parseInt(e.target.value.slice(1, 3), 16)}, ${parseInt(e.target.value.slice(3, 5), 16)}, ${parseInt(e.target.value.slice(5, 7), 16)}, ${selectedOpacity})`)}
                            className="color-picker-compact"
                            title="Custom color"
                        />
                    </div>
                </div>
            </div>


        </div>
    );
};

export default GridTools;
