import React, { useState, useEffect } from 'react';
import { WOW_ICON_BASE_URL } from '../../item-generation/wowIcons';
import { WALL_TYPES } from '../../../store/levelEditorStore';
import './styles/WallTools.css';

// Using WALL_TYPES from store - removed duplicate definition

const WallTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedWallType, setSelectedWallType] = useState('stone_wall');
    const [wallMode, setWallMode] = useState('continuous'); // continuous, rectangle

    // Wall tool configurations
    const wallTools = [
        {
            id: 'wall_draw',
            name: 'Draw Wall',
            icon: 'inv_misc_wall_01',
            description: 'Draw walls between grid points'
        },
        {
            id: 'door_place',
            name: 'Place Door',
            icon: 'inv_misc_key_03',
            description: 'Place interactive doors'
        },
        {
            id: 'window_place',
            name: 'Place Window',
            icon: 'inv_misc_gem_crystal_01',
            description: 'Place windows and openings'
        },
        {
            id: 'wall_select',
            name: 'Select Wall',
            icon: 'ability_hunter_markedfordeath',
            description: 'Select and modify walls'
        },
        {
            id: 'wall_erase',
            name: 'Erase Wall',
            icon: 'ability_warrior_cleave',
            description: 'Remove walls from grid'
        }
    ];

    // Wall categories for organization using store WALL_TYPES
    const wallCategories = {
        basic: {
            name: 'Basic Walls',
            icon: 'inv_misc_wall_01',
            walls: ['stone_wall', 'wooden_wall', 'brick_wall']
        },
        advanced: {
            name: 'Advanced Materials',
            icon: 'inv_ingot_steel',
            walls: ['metal_wall']
        },
        magical: {
            name: 'Magical Barriers',
            icon: 'spell_arcane_prismaticcloak',
            walls: ['magical_barrier', 'force_wall']
        },
        interactive: {
            name: 'Interactive Elements',
            icon: 'inv_misc_key_03',
            walls: ['wooden_door', 'stone_door']
        }
    };

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        updateSettings();
    };

    const handleWallTypeSelect = (wallType) => {
        setSelectedWallType(wallType);
        // Pass the new wallType directly since setState is asynchronous
        onSettingsChange({
            selectedWallType: wallType,
            wallMode
        });
    };

    const handleWallModeChange = (mode) => {
        setWallMode(mode);
        // Pass the new mode directly since setState is asynchronous
        onSettingsChange({
            selectedWallType,
            wallMode: mode
        });
    };

    const updateSettings = () => {
        onSettingsChange({
            selectedWallType,
            wallMode
        });
    };

    // Set initial settings when component mounts
    useEffect(() => {
        onSettingsChange({
            selectedWallType,
            wallMode
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
                                src={`${WOW_ICON_BASE_URL}${tool.icon}.jpg`}
                                alt={tool.name}
                                className="tool-icon"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${WOW_ICON_BASE_URL}inv_misc_questionmark.jpg`;
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

            {/* Wall Type Selection */}
            {(selectedTool === 'wall_draw' || selectedTool === 'door_place' || selectedTool === 'window_place') && (
                <div className="tool-section">
                    <h4>Wall Types</h4>
                    {Object.entries(wallCategories).map(([categoryId, category]) => (
                        <div key={categoryId} className="wall-category">
                            <div className="category-header">
                                <img
                                    src={`${WOW_ICON_BASE_URL}${category.icon}.jpg`}
                                    alt={category.name}
                                    className="category-icon"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${WOW_ICON_BASE_URL}inv_misc_questionmark.jpg`;
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
