import React, { useState } from 'react';
import { PROFESSIONAL_TERRAIN_TYPES } from '../terrain/TerrainSystem';
import { WOW_ICON_BASE_URL } from '../../item-generation/wowIcons';
import './styles/TerrainTools.css';

const TerrainTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedTerrainType, setSelectedTerrainType] = useState(settings.selectedTerrainType || 'grass');
    const [brushSize, setBrushSize] = useState(settings.brushSize || 1);

    // Terrain categories for organization
    const terrainCategories = {
        natural: {
            name: 'Natural Terrain',
            icon: 'spell_nature_natureguardian',
            terrains: ['grass', 'dirt', 'stone', 'sand', 'water', 'cobblestone']
        },
        dungeon: {
            name: 'Dungeon Floors',
            icon: 'inv_misc_key_03',
            terrains: ['dungeon_floor', 'marble_floor', 'wooden_floor']
        },
        difficult: {
            name: 'Difficult Terrain',
            icon: 'spell_nature_earthquake',
            terrains: ['mud', 'swamp', 'ice']
        },
        hazard: {
            name: 'Hazardous Terrain',
            icon: 'spell_fire_fire',
            terrains: ['lava', 'acid', 'pit']
        }
    };

    // Tool configurations
    const terrainTools = [
        {
            id: 'terrain_brush',
            name: 'Terrain Brush',
            icon: 'inv_misc_brush_01',
            description: 'Paint terrain with selected type'
        },
        {
            id: 'terrain_erase',
            name: 'Terrain Eraser',
            icon: 'inv_misc_bandage_12',
            description: 'Remove terrain from tiles'
        }
    ];

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        // Update settings with current terrain type
        onSettingsChange({
            selectedTerrainType,
            brushSize
        });
    };

    const handleTerrainSelect = (terrainId) => {
        setSelectedTerrainType(terrainId);
        // Auto-select terrain brush when terrain is selected
        onToolSelect('terrain_brush');
        onSettingsChange({
            selectedTerrainType: terrainId,
            brushSize
        });
    };

    const handleBrushSizeChange = (size) => {
        setBrushSize(size);
        onSettingsChange({
            selectedTerrainType,
            brushSize: size
        });
    };

    return (
        <div className="terrain-tools">
            {/* Tool Selection */}
            <div className="tool-section">
                <h4>Terrain Tools</h4>
                <div className="tool-grid">
                    {terrainTools.map(tool => (
                        <button
                            key={tool.id}
                            className={`terrain-tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
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

            {/* Brush Settings */}
            {(selectedTool === 'terrain_brush' || selectedTool === 'terrain_erase') && (
                <div className="tool-section">
                    <h4>Brush Settings</h4>
                    <div className="brush-settings">
                        <label>Brush Size:</label>
                        <div className="brush-size-controls">
                            {[1, 2, 3, 4, 5].map(size => (
                                <button
                                    key={size}
                                    className={`size-btn ${brushSize === size ? 'active' : ''}`}
                                    onClick={() => handleBrushSizeChange(size)}
                                    title={`${size}x${size} brush`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Terrain Type Selection */}
            {selectedTool !== 'terrain_erase' && (
                <div className="tool-section">
                    <h4>Terrain Types</h4>
                    {Object.entries(terrainCategories).map(([categoryId, category]) => (
                        <div key={categoryId} className="terrain-category">
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
                            <div className="terrain-grid">
                                {category.terrains.map(terrainId => {
                                    const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainId];
                                    if (!terrain) return null;

                                    return (
                                        <button
                                            key={terrainId}
                                            className={`terrain-tile ${selectedTerrainType === terrainId ? 'active' : ''}`}
                                            onClick={() => handleTerrainSelect(terrainId)}
                                            title={`${terrain.name} - ${terrain.description}`}
                                            style={{
                                                backgroundColor: terrain.color,
                                                border: selectedTerrainType === terrainId 
                                                    ? '3px solid #d4af37' 
                                                    : '2px solid #a08c70'
                                            }}
                                        >
                                            <div className="terrain-preview" style={{ backgroundColor: terrain.color }}>
                                                <span className="terrain-name">{terrain.name}</span>
                                                {terrain.movementCost > 1 && (
                                                    <span className="movement-cost">
                                                        {terrain.movementCost === 99 ? '∞' : `×${terrain.movementCost}`}
                                                    </span>
                                                )}
                                                {terrain.damage && (
                                                    <span className="damage-indicator">⚠</span>
                                                )}
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

export default TerrainTools;
