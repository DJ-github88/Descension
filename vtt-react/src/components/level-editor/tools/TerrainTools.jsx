import React, { useState, useEffect } from 'react';
import { PROFESSIONAL_TERRAIN_TYPES } from '../terrain/TerrainSystem';
import { getIconUrl } from '../../../utils/assetManager';
import './styles/TerrainTools.css';

const TerrainTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedTerrainType, setSelectedTerrainType] = useState(settings.selectedTerrainType || 'grass');
    const [brushSize, setBrushSize] = useState(settings.brushSize || 1);

    // Initialize settings with default terrain type and brush size on mount
    useEffect(() => {
        if (!settings.selectedTerrainType || !settings.brushSize) {
            onSettingsChange({
                selectedTerrainType: settings.selectedTerrainType || 'grass',
                brushSize: settings.brushSize || 1
            });
        }
    }, []); // Run once on mount

    // Terrain categories for organization
    const terrainCategories = {
        natural: {
            name: 'Natural Terrain',
            icon: 'Nature/Nature Natural',
            terrains: ['grass', 'dirt', 'stone', 'snow', 'sand', 'water', 'cobblestone']
        },
        dungeon: {
            name: 'Dungeon Floors',
            icon: 'Utility/Lockpick',
            terrains: ['dungeon_floor', 'marble_floor', 'wooden_floor', 'crystal_floor', 'gold_floor']
        },
        difficult: {
            name: 'Difficult Terrain',
            icon: 'Nature/World Map',
            terrains: ['mud', 'swamp', 'ice', 'fungal_growth']
        },
        hazard: {
            name: 'Hazardous Terrain',
            icon: 'Fire/Fiery Skull',
            terrains: ['lava', 'acid', 'pit', 'abyss']
        }
    };

    // Tool configurations
    const terrainTools = [
        {
            id: 'terrain_brush',
            name: 'Terrain Brush',
            icon: 'Utility/Utility Tool',
            description: 'Paint terrain with selected type'
        },
        {
            id: 'terrain_erase',
            name: 'Terrain Eraser',
            icon: 'Utility/Broken',
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
            brushSize: brushSize  // Preserve current brush size
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
        <>
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
                                <span className="category-name">{category.name}</span>
                            </div>
                            <div className="terrain-grid">
                                {category.terrains.map(terrainId => {
                                    const terrain = PROFESSIONAL_TERRAIN_TYPES[terrainId];
                                    if (!terrain) return null;

                                    // Get the first tile variation if available, otherwise use texture
                                    const tileImage = terrain.tileVariations?.[0] || terrain.texture;

                                    return (
                                        <button
                                            key={terrainId}
                                            className={`terrain-tile ${selectedTerrainType === terrainId ? 'active' : ''}`}
                                            onClick={() => handleTerrainSelect(terrainId)}
                                            title={`${terrain.name} - ${terrain.description}`}
                                            style={{
                                                border: selectedTerrainType === terrainId
                                                    ? '3px solid #d4af37'
                                                    : '2px solid #a08c70'
                                            }}
                                        >
                                            <div className="terrain-preview">
                                                {/* Show tile image if available, otherwise show color */}
                                                {tileImage ? (
                                                    <img
                                                        src={tileImage}
                                                        alt={terrain.name}
                                                        className="terrain-tile-image"
                                                        onError={(e) => {
                                                            // Fallback to color if image fails to load
                                                            e.target.style.display = 'none';
                                                            const preview = e.target.parentElement;
                                                            preview.style.backgroundColor = terrain.color;
                                                            // Add fallback div with terrain type class
                                                            const fallback = document.createElement('div');
                                                            fallback.className = `terrain-color-fallback terrain-type-${terrainId}`;
                                                            fallback.style.backgroundColor = terrain.color;
                                                            fallback.style.position = 'absolute';
                                                            fallback.style.top = '0';
                                                            fallback.style.left = '0';
                                                            fallback.style.width = '100%';
                                                            fallback.style.height = '100%';
                                                            fallback.style.zIndex = '0';
                                                            preview.appendChild(fallback);
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className={`terrain-color-fallback terrain-type-${terrainId}`}
                                                        style={{ backgroundColor: terrain.color }}
                                                    />
                                                )}
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
        </>
    );
};

export default TerrainTools;
