import React, { useState, useEffect } from 'react';
import { getIconUrl } from '../../../utils/assetManager';
import { WALL_TYPES } from '../../../store/levelEditorStore';
import './styles/WallTools.css';

// Using WALL_TYPES from store - removed duplicate definition

const WallTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedWallType, setSelectedWallType] = useState('stone_wall');
    const [wallMode, setWallMode] = useState('continuous'); // continuous, rectangle
    const [doorOrientation, setDoorOrientation] = useState('horizontal'); // horizontal, vertical

    // Wall tool configurations
    const wallTools = [
        {
            id: 'wall_draw',
            name: 'Draw Wall',
            icon: 'Utility/Barred Shield',
            description: 'Draw walls between grid points'
        },
        {
            id: 'door_place',
            name: 'Place Door',
            icon: 'Utility/Lockpick',
            description: 'Place interactive doors'
        },
        {
            id: 'window_place',
            name: 'Place Window',
            icon: 'Utility/All Seeing Eye',
            description: 'Place windows and openings'
        },
        {
            id: 'wall_select',
            name: 'Select',
            icon: 'Utility/Target Crosshair',
            description: 'Select and move walls, doors, and windows'
        },
        {
            id: 'wall_erase',
            name: 'Erase Wall',
            icon: 'Utility/Broken',
            description: 'Remove walls from grid'
        }
    ];

    // Wall categories for organization using store WALL_TYPES
    const allWallCategories = {
        basic: {
            name: 'Basic Walls',
            icon: 'Utility/Barred Shield',
            walls: ['stone_wall', 'wooden_wall', 'brick_wall']
        },
        advanced: {
            name: 'Advanced Materials',
            icon: 'Utility/Golden Toothed Gear',
            walls: ['metal_wall']
        },
        magical: {
            name: 'Magical Barriers',
            icon: 'Arcane/Orb Manipulation',
            walls: ['magical_barrier', 'force_wall']
        },
        interactive: {
            name: 'Interactive Elements',
            icon: 'Utility/Lockpick',
            walls: ['wooden_door', 'stone_door']
        },
        window: {
            name: 'Windows',
            icon: 'Utility/All Seeing Eye',
            walls: ['glass_window', 'barred_window', 'arrow_slit', 'open_window']
        }
    };

    // Filter categories based on selected tool
    const getCategoriesForTool = (tool) => {
        switch (tool) {
            case 'wall_draw':
                // Show all categories except interactive elements (doors) and windows
                const { interactive, window: windowCat, ...wallCategories } = allWallCategories;
                return wallCategories;
            case 'door_place':
                // Only show interactive elements (doors)
                return { interactive: allWallCategories.interactive };
            case 'window_place':
                // Only show window types
                return { window: allWallCategories.window };
            default:
                return {};
        }
    };

    const wallCategories = getCategoriesForTool(selectedTool);

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        
        // Auto-select appropriate wall type based on tool
        if (toolId === 'door_place' && !['wooden_door', 'stone_door'].includes(selectedWallType)) {
            setSelectedWallType('wooden_door');
            onSettingsChange({
                selectedWallType: 'wooden_door',
                wallMode,
                doorOrientation
            });
        } else if (toolId === 'window_place' && !['glass_window', 'barred_window', 'arrow_slit', 'open_window'].includes(selectedWallType)) {
            setSelectedWallType('glass_window');
            onSettingsChange({
                selectedWallType: 'glass_window',
                wallMode,
                doorOrientation
            });
        } else {
            updateSettings();
        }
    };

    const handleWallTypeSelect = (wallType) => {
        setSelectedWallType(wallType);
        // Pass the new wallType directly since setState is asynchronous
        onSettingsChange({
            selectedWallType: wallType,
            wallMode,
            doorOrientation
        });
    };

    const handleWallModeChange = (mode) => {
        setWallMode(mode);
        // Pass the new mode directly since setState is asynchronous
        onSettingsChange({
            selectedWallType,
            wallMode: mode,
            doorOrientation
        });
    };

    const handleDoorOrientationChange = (orientation) => {
        setDoorOrientation(orientation);
        onSettingsChange({
            selectedWallType,
            wallMode,
            doorOrientation: orientation
        });
    };

    const updateSettings = () => {
        onSettingsChange({
            selectedWallType,
            wallMode,
            doorOrientation
        });
    };

    // Set initial settings when component mounts
    useEffect(() => {
        onSettingsChange({
            selectedWallType,
            wallMode,
            doorOrientation
        });
    }, []); // Only run on mount

    return (
        <div className="wall-tools">
            {/* Tool Selection */}
            <div className="tool-section">
                <h4>Wall Tools</h4>
                <div className="tool-grid">
                    {wallTools.map(tool => (
                        <button
                            key={tool.id}
                            className={`wall-tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
                            onClick={() => handleToolSelect(tool.id)}
                            title={tool.description}
                        >
                            <img
                                src={getIconUrl(tool.icon, 'abilities')}
                                alt={tool.name}
                                className="tool-icon"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                }}
                            />
                            <span className="tool-name">{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Wall Drawing Mode */}
            {selectedTool === 'wall_draw' && (
                <div className="tool-section">
                    <h4>Drawing Mode</h4>
                    <div className="mode-controls">
                        {[
                            { id: 'continuous', name: 'Continuous', desc: 'Draw connected walls' },
                            { id: 'rectangle', name: 'Rectangle', desc: 'Draw rectangular rooms' }
                        ].map(mode => (
                            <button
                                key={mode.id}
                                className={`mode-btn ${wallMode === mode.id ? 'active' : ''}`}
                                onClick={() => handleWallModeChange(mode.id)}
                                title={mode.desc}
                            >
                                {mode.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Door/Window placement hint */}
            {(selectedTool === 'door_place' || selectedTool === 'window_place') && (
                <div className="tool-section">
                    <div style={{ 
                        fontSize: '11px', 
                        color: '#a08c70', 
                        fontStyle: 'italic',
                        padding: '8px',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '4px'
                    }}>
                        {selectedTool === 'door_place' 
                            ? 'Click on a wall to place a door. Orientation auto-detects from nearby walls.'
                            : 'Click on a wall to place a window opening. Windows allow vision through.'}
                    </div>
                </div>
            )}

            {/* Wall Type Selection */}
            {(selectedTool === 'wall_draw' || selectedTool === 'door_place' || selectedTool === 'window_place') && (
                <div className="tool-section">
                    <h4>Wall Types</h4>
                    {Object.entries(wallCategories).map(([categoryId, category]) => (
                        <div key={categoryId} className="wall-category">
                            <div className="category-header">
                                <img
                                    src={getIconUrl(category.icon, 'abilities')}
                                    alt={category.name}
                                    className="category-icon"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                    }}
                                />
                                <span className="category-name">{category.name}</span>
                            </div>
                            <div className="wall-grid">
                                {category.walls.map(wallId => {
                                    const wall = WALL_TYPES[wallId];
                                    if (!wall) return null;

                                    return (
                                        <button
                                            key={wallId}
                                            className={`wall-tile ${selectedWallType === wallId ? 'active' : ''}`}
                                            onClick={() => handleWallTypeSelect(wallId)}
                                            title={`${wall.name} - ${wall.description}`}
                                        >
                                            <div
                                                className="wall-preview"
                                                style={{
                                                    backgroundColor: wall.color,
                                                    opacity: wall.category === 'partial' ? 0.7 : 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '8px',
                                                    minHeight: '80px',
                                                    border: selectedWallType === wallId ? '3px solid #d4af37' : '2px solid #a08c70'
                                                }}
                                            >
                                                <span
                                                    className="wall-name"
                                                    style={{
                                                        color: '#ffffff',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                                                        lineHeight: '1.2',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    {wall.name}
                                                </span>
                                                <div className="wall-properties" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                                                    {wall.blocksMovement && (
                                                        <span
                                                            className="property-badge movement-block"
                                                            title="Blocks Movement"
                                                            style={{
                                                                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                                                color: '#ffffff',
                                                                fontSize: '10px',
                                                                padding: '2px 4px',
                                                                borderRadius: '3px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            BLOCKS
                                                        </span>
                                                    )}
                                                    {wall.blocksLineOfSight && (
                                                        <span
                                                            className="property-badge vision-block"
                                                            title="Blocks Vision"
                                                            style={{
                                                                backgroundColor: 'rgba(0, 0, 255, 0.8)',
                                                                color: '#ffffff',
                                                                fontSize: '10px',
                                                                padding: '2px 4px',
                                                                borderRadius: '3px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            VISION
                                                        </span>
                                                    )}
                                                    {wall.interactive && (
                                                        <span
                                                            className="property-badge interactive"
                                                            title="Interactive"
                                                            style={{
                                                                backgroundColor: 'rgba(0, 255, 0, 0.8)',
                                                                color: '#ffffff',
                                                                fontSize: '10px',
                                                                padding: '2px 4px',
                                                                borderRadius: '3px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            DOOR
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
};

export default WallTools;
