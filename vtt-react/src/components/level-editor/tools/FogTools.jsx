import React, { useState } from 'react';
import { WOW_ICON_BASE_URL } from '../../item-generation/wowIcons';
import './styles/FogTools.css';

const FogTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [brushSize, setBrushSize] = useState(settings.brushSize || 1);

    // Simplified fog tool configurations - just paint and erase
    const fogTools = [
        {
            id: 'fog_paint',
            name: 'Paint Fog',
            icon: 'spell_frost_frostbolt',
            description: 'Paint animated fog of war areas'
        },
        {
            id: 'fog_erase',
            name: 'Erase Fog',
            icon: 'spell_holy_dispelmagic',
            description: 'Remove fog from areas'
        },
        {
            id: 'fog_clear_all',
            name: 'Clear All Fog',
            icon: 'spell_holy_holynova',
            description: 'Remove all fog from map'
        }
    ];

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        onSettingsChange({
            brushSize
        });
    };

    const handleBrushSizeChange = (size) => {
        setBrushSize(size);
        onSettingsChange({
            brushSize: size
        });
    };

    return (
        <div className="fog-tools">
            {/* Tool Selection */}
            <div className="tool-section">
                <h4>Fog of War Tools</h4>
                <div className="tool-grid">
                    {fogTools.map(tool => (
                        <button
                            key={tool.id}
                            className={`fog-tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
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
            {(selectedTool === 'fog_paint' || selectedTool === 'fog_erase') && (
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

            {/* Animated Fog Info */}
            <div className="tool-section">
                <h4>Animated Fog Features</h4>
                <div className="fog-features">
                    <ul>
                        <li>🌫️ Realistic moving fog particles</li>
                        <li>✨ Smooth opacity transitions</li>
                        <li>🎭 Blocks player vision completely</li>
                        <li>🎨 Atmospheric visual effects</li>
                        <li>⚡ 60fps smooth animation</li>
                    </ul>
                </div>
            </div>




        </div>
    );
};

export default FogTools;
