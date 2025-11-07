import React, { useState } from 'react';
import { WOW_ICON_BASE_URL } from '../../item-generation/wowIcons';
import useLevelEditorStore from '../../../store/levelEditorStore';
import './styles/FogTools.css';

const FogTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [brushSize, setBrushSize] = useState(settings.brushSize || 1);
    const { fovAngle, setFovAngle } = useLevelEditorStore();

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
        },
        {
            id: 'fog_consolidate',
            name: 'Consolidate Fog',
            icon: 'spell_holy_purify',
            description: 'Merge overlapping fog paths to improve performance'
        },
        {
            id: 'fog_cover_map',
            name: 'Cover Entire Map',
            icon: 'spell_shadow_nethercloak',
            description: 'Cover the entire map with fog'
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

            {/* FOV Toggle */}
            <div className="tool-section">
                <h4>Field of View (FOV)</h4>
                <div className="fov-toggle">
                    <button
                        className={`fov-button ${fovAngle === 360 ? 'active' : ''}`}
                        onClick={() => setFovAngle(360)}
                        title="360° - Full view around token"
                    >
                        360°
                    </button>
                    <button
                        className={`fov-button ${fovAngle === 100 ? 'active' : ''}`}
                        onClick={() => setFovAngle(100)}
                        title="100° - Limited directional view (use scroll to look around)"
                    >
                        100°
                    </button>
                </div>
                <div className="fov-description">
                    {fovAngle === 360 
                        ? 'Full 360° view around token' 
                        : '100° directional view - use scroll wheel on token to rotate view'}
                </div>
            </div>

        </div>
    );
};

export default FogTools;
