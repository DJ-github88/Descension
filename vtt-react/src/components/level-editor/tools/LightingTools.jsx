import React, { useState, useEffect } from 'react';
import { WOW_ICON_BASE_URL } from '../../item-generation/wowIcons';
import useLevelEditorStore from '../../../store/levelEditorStore';
import './styles/LightingTools.css';

// Professional lighting types
export const PROFESSIONAL_LIGHTING_TYPES = {
    lantern_object: {
        id: 'lantern_object',
        name: 'Lantern',
        category: 'flame',
        color: '#ffffcc',
        radius: 4,
        intensity: 1.0,
        flickering: false,
        castsShadows: true,
        description: 'Physical lantern object with light',
        isObject: true // Special flag to indicate this places an object
    },

};

const LightingTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedLightType, setSelectedLightType] = useState('lantern_object');
    const [lightRadius, setLightRadius] = useState(3);
    const [lightIntensity, setLightIntensity] = useState(1.0);
    const [lightColor, setLightColor] = useState('#ffaa00');
    const [flickering, setFlickering] = useState(false);

    // Get selected lantern from store
    const { environmentalObjects, updateEnvironmentalObject } = useLevelEditorStore();
    const selectedLantern = environmentalObjects.find(obj => obj.selected && obj.type === 'lantern');

    // Lighting tool configurations - removed broken tools
    const lightingTools = [
        {
            id: 'light_place',
            name: 'Place Light',
            icon: 'spell_fire_fire',
            description: 'Place light sources on the grid'
        },
        {
            id: 'light_select',
            name: 'Select Light',
            icon: 'ability_hunter_markedfordeath',
            description: 'Select and modify light sources'
        }
    ];

    // Light categories for organization
    const lightCategories = {
        flame: {
            name: 'Light Sources',
            icon: 'inv_misc_lantern_01',
            lights: ['lantern_object']
        }
    };

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        updateSettings();
    };

    const handleLightTypeSelect = (lightType) => {
        setSelectedLightType(lightType);
        const lightDef = PROFESSIONAL_LIGHTING_TYPES[lightType];
        if (lightDef) {
            setLightRadius(lightDef.radius);
            setLightIntensity(lightDef.intensity);
            setLightColor(lightDef.color);
            setFlickering(lightDef.flickering);
        }
        updateSettings();
    };

    const updateSettings = () => {
        onSettingsChange({
            selectedLightType,
            lightRadius,
            lightIntensity,
            lightColor,
            flickering
        });
    };

    return (
        <div className="lighting-tools">
            {/* Tool Selection */}
            <div className="tool-section">
                <h4>Lighting Tools</h4>
                <div className="tool-grid">
                    {lightingTools.map(tool => (
                        <button
                            key={tool.id}
                            className={`lighting-tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
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

            {/* Light Type Selection */}
            {(selectedTool === 'light_place' || selectedTool === 'shadow_place') && (
                <div className="tool-section">
                    <h4>Light Types</h4>
                    {Object.entries(lightCategories).map(([categoryId, category]) => (
                        <div key={categoryId} className="light-category">
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
                            <div className="light-grid">
                                {category.lights.map(lightId => {
                                    const light = PROFESSIONAL_LIGHTING_TYPES[lightId];
                                    if (!light) return null;

                                    return (
                                        <button
                                            key={lightId}
                                            className={`light-tile ${selectedLightType === lightId ? 'active' : ''}`}
                                            onClick={() => handleLightTypeSelect(lightId)}
                                            title={`${light.name} - ${light.description}`}
                                        >
                                            <div 
                                                className="light-preview" 
                                                style={{ 
                                                    backgroundColor: light.color,
                                                    boxShadow: `0 0 10px ${light.color}`
                                                }}
                                            >
                                                <span className="light-name">{light.name}</span>
                                                <div className="light-properties">
                                                    <span className="light-radius">R:{light.radius}</span>
                                                    {light.flickering && (
                                                        <span className="flickering">✨</span>
                                                    )}
                                                    {light.castsShadows && (
                                                        <span className="shadows">🌑</span>
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

            {/* Light Settings */}
            {selectedTool === 'light_place' && (
                <div className="tool-section">
                    <h4>Light Settings</h4>
                    
                    {/* Radius Control */}
                    <div className="setting-group">
                        <label>Light Radius:</label>
                        <div className="radius-controls">
                            <input
                                type="range"
                                min="1"
                                max="15"
                                value={lightRadius}
                                onChange={(e) => setLightRadius(parseInt(e.target.value))}
                                className="radius-slider"
                            />
                            <span className="radius-value">{lightRadius} tiles</span>
                        </div>
                    </div>

                    {/* Intensity Control */}
                    <div className="setting-group">
                        <label>Intensity:</label>
                        <div className="intensity-controls">
                            <input
                                type="range"
                                min="0.1"
                                max="2.0"
                                step="0.1"
                                value={lightIntensity}
                                onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                                className="intensity-slider"
                            />
                            <span className="intensity-value">{lightIntensity}×</span>
                        </div>
                    </div>

                    {/* Color Control */}
                    <div className="setting-group">
                        <label>Light Color:</label>
                        <input
                            type="color"
                            value={lightColor}
                            onChange={(e) => setLightColor(e.target.value)}
                            className="color-input"
                        />
                    </div>

                    {/* Flickering Toggle */}
                    <div className="setting-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={flickering}
                                onChange={(e) => setFlickering(e.target.checked)}
                            />
                            Flickering Effect
                        </label>
                    </div>
                </div>
            )}

            {/* Selected Light Info */}
            {selectedLightType && (
                <div className="tool-section">
                    <h4>Selected Light</h4>
                    <div className="light-info">
                        {(() => {
                            const light = PROFESSIONAL_LIGHTING_TYPES[selectedLightType];
                            return (
                                <div className="light-details">
                                    <div 
                                        className="light-swatch" 
                                        style={{ 
                                            backgroundColor: light.color,
                                            boxShadow: `0 0 8px ${light.color}`
                                        }}
                                    ></div>
                                    <div className="light-stats">
                                        <div className="light-name">{light.name}</div>
                                        <div className="light-description">{light.description}</div>
                                        <div className="light-properties">
                                            <div className="property">
                                                <span className="property-label">Radius:</span>
                                                <span className="property-value">{light.radius} tiles</span>
                                            </div>
                                            <div className="property">
                                                <span className="property-label">Intensity:</span>
                                                <span className="property-value">{light.intensity}×</span>
                                            </div>
                                            <div className="property">
                                                <span className="property-label">Flickering:</span>
                                                <span className="property-value">{light.flickering ? 'Yes' : 'No'}</span>
                                            </div>
                                            <div className="property">
                                                <span className="property-label">Casts Shadows:</span>
                                                <span className="property-value">{light.castsShadows ? 'Yes' : 'No'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Selected Lantern Editing */}
            {selectedLantern && selectedTool === 'light_select' && (
                <div className="tool-section">
                    <h4>🏮 Edit Selected Lantern</h4>
                    <div className="lantern-edit-controls">
                        <div className="lantern-edit-header">
                            <div className="lantern-icon">🏮</div>
                            <div className="lantern-info">
                                <span className="lantern-name">Lantern #{selectedLantern.id.split('_')[1]}</span>
                                <span className="lantern-status">Selected & Ready to Edit</span>
                            </div>
                        </div>
                        {/* Light Radius */}
                        <div className="setting-group">
                            <label>Light Radius: {selectedLantern.lightRadius || 4}</label>
                            <input
                                type="range"
                                min="1"
                                max="12"
                                value={selectedLantern.lightRadius || 4}
                                onChange={(e) => {
                                    const newRadius = parseInt(e.target.value);
                                    updateEnvironmentalObject(selectedLantern.id, {
                                        ...selectedLantern,
                                        lightRadius: newRadius
                                    });
                                }}
                                className="radius-slider"
                            />
                            <span className="radius-value">{(selectedLantern.lightRadius || 4) * 5}ft</span>
                        </div>

                        {/* Light Color */}
                        <div className="setting-group">
                            <label>Light Color</label>
                            <input
                                type="color"
                                value={selectedLantern.lightColor || '#ffffcc'}
                                onChange={(e) => {
                                    updateEnvironmentalObject(selectedLantern.id, {
                                        ...selectedLantern,
                                        lightColor: e.target.value
                                    });
                                }}
                                className="color-picker"
                            />
                        </div>

                        {/* Light Intensity */}
                        <div className="setting-group">
                            <label>Intensity: {((selectedLantern.lightIntensity || 1.0) * 100).toFixed(0)}%</label>
                            <input
                                type="range"
                                min="0.1"
                                max="2.0"
                                step="0.1"
                                value={selectedLantern.lightIntensity || 1.0}
                                onChange={(e) => {
                                    updateEnvironmentalObject(selectedLantern.id, {
                                        ...selectedLantern,
                                        lightIntensity: parseFloat(e.target.value)
                                    });
                                }}
                                className="intensity-slider"
                            />
                        </div>

                        {/* Scale */}
                        <div className="setting-group">
                            <label>Lantern Size: {((selectedLantern.scale || 1.0) * 100).toFixed(0)}%</label>
                            <input
                                type="range"
                                min="0.5"
                                max="2.0"
                                step="0.1"
                                value={selectedLantern.scale || 1.0}
                                onChange={(e) => {
                                    updateEnvironmentalObject(selectedLantern.id, {
                                        ...selectedLantern,
                                        scale: parseFloat(e.target.value)
                                    });
                                }}
                                className="scale-slider"
                            />
                        </div>

                        {/* Delete Button */}
                        <div className="setting-group">
                            <button
                                className="delete-lantern-btn"
                                onClick={() => {
                                    if (window.confirm('Delete this lantern?')) {
                                        const { removeEnvironmentalObject } = useLevelEditorStore.getState();
                                        removeEnvironmentalObject(selectedLantern.id);
                                    }
                                }}
                            >
                                🗑️ Delete Lantern
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default LightingTools;
