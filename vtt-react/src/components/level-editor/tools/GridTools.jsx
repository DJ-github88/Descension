import React, { useState, useEffect } from 'react';
import useGameStore from '../../../store/gameStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useDialogueStore from '../../../store/dialogueStore';
import { getIconUrl } from '../../../utils/assetManager';
import './styles/GridTools.css';

const GridTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    // Get grid settings from game store
    const {
        gridSize,
        gridType,
        gridOffsetX,
        gridOffsetY,
        gridLineThickness,
        gridLineOpacity,
        gridLineColor,
        gridBackgroundColor,
        gridMovesWithBackground,
        backgrounds,
        activeBackgroundId,
        isBackgroundManipulationMode,
        isGridAlignmentMode,
        setGridSize,
        setGridType,
        setGridOffset,
        setGridLineThickness,
        setGridLineOpacity,
        setGridLineColor,
        setGridBackgroundColor,
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
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(gridBackgroundColor);
    const [selectedGridSize, setSelectedGridSize] = useState(gridSize);
    const [offsetX, setOffsetX] = useState(gridOffsetX);
    const [offsetY, setOffsetY] = useState(gridOffsetY);

    // State for inline editing
    const [editingBackgroundId, setEditingBackgroundId] = useState(null);
    const [editingName, setEditingName] = useState('');

    // Simplified grid tool - just the align grid functionality
    const gridAlignTool = {
        id: 'grid_align',
        name: 'Align Grid',
        icon: 'Utility/Utility Gear',
        description: 'Draw rectangles to align grid with background image'
    };

    // Thickness presets
    const thicknessPresets = [
        { value: 0.5, label: 'Thin', icon: 'Piercing/Piercing Shot' },
        { value: 1, label: 'Normal', icon: 'Piercing/Piercing Shot' },
        { value: 2, label: 'Thick', icon: 'Piercing/Piercing Shot' },
        { value: 3, label: 'Very Thick', icon: 'Piercing/Piercing Shot' },
        { value: 5, label: 'Ultra Thick', icon: 'Piercing/Piercing Shot' }
    ];

    // Color presets for grid lines
    const colorPresets = [
        { value: 'rgba(255, 255, 255, 0.8)', label: 'White', color: '#ffffff' },
        { value: 'rgba(212, 175, 55, 0.8)', label: 'Gold', color: '#d4af37' },
        { value: 'rgba(0, 0, 0, 0.8)', label: 'Black', color: '#000000' },
        { value: 'rgba(77, 155, 230, 0.8)', label: 'Blue', color: '#4d9be6' },
        { value: 'rgba(255, 0, 0, 0.8)', label: 'Red', color: '#ff0000' },
        { value: 'rgba(0, 255, 0, 0.8)', label: 'Green', color: '#00ff00' }
    ];

    // Calm background color presets (desaturated, varied colors)
    const backgroundColorPresets = [
        { value: '#d4c5b9', label: 'Beige', color: '#d4c5b9' },
        { value: '#e8dab2', label: 'Muted Yellow', color: '#e8dab2' },
        { value: '#c4d4d0', label: 'Sage Green', color: '#c4d4d0' },
        { value: '#b8c5d1', label: 'Dusty Blue', color: '#b8c5d1' },
        { value: '#d1c4b8', label: 'Taupe', color: '#d1c4b8' },
        { value: '#c9c0b8', label: 'Warm Gray', color: '#c9c0b8' },
        { value: '#bdb8a8', label: 'Olive', color: '#bdb8a8' },
        { value: '#c8beb5', label: 'Khaki', color: '#c8beb5' }
    ];

    // Update local state when store changes
    useEffect(() => {
        setSelectedThickness(gridLineThickness);
        setSelectedOpacity(gridLineOpacity);
        setSelectedColor(gridLineColor);
        setSelectedBackgroundColor(gridBackgroundColor);
        setSelectedGridSize(gridSize);
        setOffsetX(gridOffsetX);
        setOffsetY(gridOffsetY);
    }, [gridLineThickness, gridLineOpacity, gridLineColor, gridBackgroundColor, gridSize, gridOffsetX, gridOffsetY]);

    // Helper to sync grid settings over multiplayer
    const syncGridSettings = (overrides = {}) => {
        const socket = useDialogueStore.getState().multiplayerSocket;
        if (socket && socket.connected) {
            const gameStore = useGameStore.getState();
            socket.emit('sync_level_editor_state', {
                gridSettings: {
                    gridType: overrides.gridType || gameStore.gridType,
                    gridSize: overrides.gridSize || gameStore.gridSize,
                    gridOffsetX: overrides.gridOffsetX ?? gameStore.gridOffsetX,
                    gridOffsetY: overrides.gridOffsetY ?? gameStore.gridOffsetY,
                    gridLineColor: overrides.gridLineColor || gameStore.gridLineColor,
                    gridLineThickness: overrides.gridLineThickness ?? gameStore.gridLineThickness,
                    gridLineOpacity: overrides.gridLineOpacity ?? gameStore.gridLineOpacity,
                    gridBackgroundColor: overrides.gridBackgroundColor || gameStore.gridBackgroundColor
                }
            });
            console.log('📡 Synced grid settings to multiplayer');
        }
    };

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
        syncGridSettings({ gridLineThickness: thickness });
    };

    const handleOpacityChange = (opacity) => {
        setSelectedOpacity(opacity);
        setGridLineOpacity(opacity);
        syncGridSettings({ gridLineOpacity: opacity });
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        setGridLineColor(color);
        syncGridSettings({ gridLineColor: color });
    };

    const handleBackgroundColorChange = (color) => {
        setSelectedBackgroundColor(color);
        setGridBackgroundColor(color);
        syncGridSettings({ gridBackgroundColor: color });
    };



    const handleGridSizeChange = (size) => {
        setSelectedGridSize(size);
        setGridSize(size);
        syncGridSettings({ gridSize: size });
    };

    const handleOffsetChange = (x, y) => {
        setOffsetX(x);
        setOffsetY(y);
        setGridOffset(x, y);
    };



    const handleBackgroundUpload = async (e) => {
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

            try {
                // Import compression utility
                const { compressImage } = await import('../../../utils/imageCompression');

                // Compress image before storing (max 1920px width for map backgrounds, quality 0.85)
                console.log('🖼️ Compressing background image... Original size:', (file.size / 1024).toFixed(1), 'KB');
                const compressedFile = await compressImage(file, 1920, null, 0.85);
                console.log('🗜️ Image compressed to:', (compressedFile.size / 1024).toFixed(1), 'KB');

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
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('❌ Image compression failed:', error);
                alert('Failed to compress image. Please try a different image or a smaller file.');
                e.target.value = '';
            }
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

    const handleNameClick = (bg) => {
        setEditingBackgroundId(bg.id);
        setEditingName(bg.name || 'unnamed');
    };

    const handleNameChange = (e) => {
        setEditingName(e.target.value);
    };

    const handleNameBlur = (bgId) => {
        if (editingName.trim()) {
            updateBackground(bgId, { name: editingName.trim() });
        }
        setEditingBackgroundId(null);
        setEditingName('');
    };

    const handleNameKeyDown = (e, bgId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleNameBlur(bgId);
        } else if (e.key === 'Escape') {
            setEditingBackgroundId(null);
            setEditingName('');
        }
    };

    const toggleBackgroundVisibility = (bg) => {
        const isVisible = bg.opacity > 0;
        // Toggle between 0 (hidden) and 1.0 (visible)
        // If it was previously visible with a custom opacity, restore to 1.0 when showing
        updateBackground(bg.id, {
            opacity: isVisible ? 0 : 1.0
        });
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
                            src={getIconUrl('Nature/World Map', 'abilities')}
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
                            <div key={bg.id} className={`background-card ${bg.id === activeBackgroundId ? 'active' : ''} ${bg.opacity === 0 ? 'invisible' : ''}`}>
                                {/* Background Header - Cleaner Layout */}
                                <div className="background-header">
                                    <div className="background-title-section">
                                        {bg.id === activeBackgroundId && (
                                            <span className="active-badge">ACTIVE</span>
                                        )}
                                        <div className="background-title">
                                            {editingBackgroundId === bg.id ? (
                                                <input
                                                    type="text"
                                                    className="background-name-input"
                                                    value={editingName}
                                                    onChange={handleNameChange}
                                                    onBlur={() => handleNameBlur(bg.id)}
                                                    onKeyDown={(e) => handleNameKeyDown(e, bg.id)}
                                                    autoFocus
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <span
                                                    className="background-name"
                                                    onClick={() => handleNameClick(bg)}
                                                    title="Click to rename"
                                                >
                                                    {bg.name || 'unnamed'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="background-actions">
                                        <button
                                            className={`action-button visibility ${bg.opacity > 0 ? 'visible' : 'hidden'}`}
                                            onClick={() => toggleBackgroundVisibility(bg)}
                                            title={bg.opacity > 0 ? 'Hide background' : 'Show background'}
                                        >
                                            {bg.opacity > 0 ? 'Hide' : 'Show'}
                                        </button>
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
                                        {/* Grid Alignment Toggle - Improved Layout */}
                                        <div className="control-row">
                                            <label className="toggle-control">
                                                <div className="toggle-switch-wrapper">
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
                                                    <span className="toggle-switch-visual"></span>
                                                </div>
                                                <div className="toggle-label-wrapper">
                                                    <span className="toggle-label">Grid-Aligned</span>
                                                    <small>Background moves with grid</small>
                                                </div>
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
                                                    src={getIconUrl('Utility/Utility Gear', 'abilities')}
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
                                                    <strong>Drag</strong> image to move • <strong>Scroll</strong> to resize • <strong>Ctrl+Scroll</strong> to rotate
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
                    {/* Grid Type Selector */}
                    <div className="grid-control-item">
                        <label className="appearance-label">Grid Type</label>
                        <div className="grid-type-selector">
                            <button
                                className={`grid-type-button ${gridType === 'square' ? 'active' : ''}`}
                                onClick={() => {
                                    setGridType('square');
                                    syncGridSettings({ gridType: 'square' });
                                }}
                                title="Square Grid - Traditional square tiles"
                            >
                                <span>Square</span>
                            </button>
                            <button
                                className={`grid-type-button ${gridType === 'hex' ? 'active' : ''}`}
                                onClick={() => {
                                    setGridType('hex');
                                    syncGridSettings({ gridType: 'hex' });
                                }}
                                title="Hex Grid - Hexagonal tiles for tactical gameplay"
                            >
                                <span>Hex</span>
                            </button>
                        </div>
                    </div>

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
                                    src={getIconUrl(gridAlignTool.icon, 'abilities')}
                                    alt={gridAlignTool.name}
                                    className="align-icon"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = getIconUrl('Utility/Utility', 'abilities');
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

                {/* Background Color Control */}
                <div className="appearance-group">
                    <label className="appearance-label">Background Color</label>
                    <div className="background-color-controls">
                        <div className="background-color-presets">
                            {backgroundColorPresets.map(preset => (
                                <button
                                    key={`${preset.value}-${preset.label}`}
                                    className={`background-color-option ${selectedBackgroundColor === preset.value ? 'active' : ''}`}
                                    onClick={() => handleBackgroundColorChange(preset.value)}
                                    title={preset.label}
                                    style={{
                                        backgroundColor: preset.color
                                    }}
                                />
                            ))}
                        </div>
                        <div className="background-color-custom">
                            <input
                                type="color"
                                value={selectedBackgroundColor || '#d4c5b9'}
                                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                                className="color-picker-compact background-color-picker"
                                title="Custom background color"
                            />
                            <div className="background-color-preview" style={{ backgroundColor: selectedBackgroundColor || '#d4c5b9' }}>
                                <span className="background-color-value">{selectedBackgroundColor || '#d4c5b9'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default GridTools;
