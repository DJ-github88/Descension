import React, { useMemo } from 'react';
import useLevelEditorStore from '../../../store/levelEditorStore';
import { getIconUrl } from '../../../utils/assetManager';
import './styles/TerrainTools.css';

const ELEVATION_TOOLS = [
    { id: 'elevation_raise', name: 'Raise', icon: 'Utility/Utility Tool', description: 'Raise terrain by one level (5 ft) per stroke' },
    { id: 'elevation_lower', name: 'Lower', icon: 'Necrotic/Gloomy Death', description: 'Lower terrain by one level (pits) per stroke' },
    { id: 'elevation_flatten', name: 'Flatten', icon: 'Utility/Utility', description: 'Set a uniform level under the brush' },
    { id: 'elevation_ramp', name: 'Ramp / Stairs', icon: 'Piercing/Piercing Shots', description: 'Place an auto-aligning ramp or stairs tile: it slopes toward whichever adjacent tile has the biggest level difference (click or drag, Remove erases)' }
];

const FLATTEN_LEVELS = [-3, -2, -1, 0, 1, 2, 3, 4, 5];

const ElevationTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const elevationData = useLevelEditorStore(state => state.elevationData) || {};
    const rampData = useLevelEditorStore(state => state.rampData) || {};
    const clearAllElevation = useLevelEditorStore(state => state.clearAllElevation);
    const indicatorsEnabled = useLevelEditorStore(state => state.elevationIndicatorsEnabled);
    const setElevationIndicatorsEnabled = useLevelEditorStore(state => state.setElevationIndicatorsEnabled);

    const brushSize = settings.elevationBrushSize || 1;
    const targetLevel = settings.elevationTargetLevel ?? 1;
    const rampType = settings.rampType || 'ramp';
    const rampRemove = settings.rampRemove === true;

    // NOTE: no auto-switch effect here. Selecting the bare 'elevation' tool is
    // handled directly by the editor pointer handlers (treated as raise), because
    // calling onToolSelect from an effect looped when its identity changed each render.

    const stats = useMemo(() => {
        const levels = Object.values(elevationData);
        let raised = 0;
        let pits = 0;
        let max = 0;
        let min = 0;
        for (const raw of levels) {
            const level = typeof raw === 'object' && raw !== null ? (raw.level || 0) : Number(raw) || 0;
            if (level > 0) raised++;
            if (level < 0) pits++;
            if (level > max) max = level;
            if (level < min) min = level;
        }
        return { raised, pits, max, min, ramps: Object.keys(rampData).length };
    }, [elevationData, rampData]);

    const updateSettings = (partial) => {
        onSettingsChange({ ...settings, ...partial });
    };

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        updateSettings({});
    };

    const isBrushTool = selectedTool === 'elevation_raise' || selectedTool === 'elevation_lower' || selectedTool === 'elevation_flatten';

    return (
        <>
            <div className="tool-section">
                <h4>Elevation Tools</h4>
                <div className="tool-grid">
                    {ELEVATION_TOOLS.map(tool => (
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
                <div style={{ marginTop: 6, opacity: 0.8, fontSize: 11 }}>
                    1 level = 5 ft = one tile of height. A ramp/stairs tile slopes up or down
                    to the neighbor it connects toward; movement allows a free 1-level step,
                    bigger steps need ramps or stairs.
                </div>
                <button
                    className="terrain-tool-btn"
                    style={{ marginTop: 8 }}
                    onClick={() => onToolSelect('terrain_brush')}
                    title="Switch back to the terrain brush"
                >
                    <span className="tool-name">Back to Terrain Brush</span>
                </button>
            </div>

            {isBrushTool && (
                <div className="tool-section">
                    <h4>Brush Settings</h4>
                    <div className="brush-settings">
                        <label>Brush Size:</label>
                        <div className="brush-size-controls">
                            {[1, 2, 3, 4, 5].map(size => (
                                <button
                                    key={size}
                                    className={`size-btn ${brushSize === size ? 'active' : ''}`}
                                    onClick={() => updateSettings({ elevationBrushSize: size })}
                                    title={`${size}x${size} brush`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {selectedTool === 'elevation_flatten' && (
                <div className="tool-section">
                    <h4>Target Level</h4>
                    <div className="brush-size-controls">
                        {FLATTEN_LEVELS.map(level => (
                            <button
                                key={level}
                                className={`size-btn ${targetLevel === level ? 'active' : ''}`}
                                onClick={() => updateSettings({ elevationTargetLevel: level })}
                                title={`Set tiles to ${level} (${level * 5} ft)`}
                            >
                                {level > 0 ? `+${level}` : level}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedTool === 'elevation_ramp' && (
                <div className="tool-section">
                    <h4>Ramp Settings</h4>
                    <div className="brush-settings">
                        <label>Mode:</label>
                        <div className="brush-size-controls">
                            <button
                                className={`size-btn ${!rampRemove ? 'active' : ''}`}
                                onClick={() => updateSettings({ rampRemove: false })}
                                title="Place ramps/stairs (click or drag across tiles)"
                                style={{ width: 'auto', padding: '0 8px' }}
                            >
                                Place
                            </button>
                            <button
                                className={`size-btn ${rampRemove ? 'active' : ''}`}
                                onClick={() => updateSettings({ rampRemove: true })}
                                title="Remove ramps/stairs under the cursor (click or drag)"
                                style={{ width: 'auto', padding: '0 8px' }}
                            >
                                Remove
                            </button>
                        </div>
                        {!rampRemove && (
                            <>
                                <label style={{ marginTop: 6, display: 'block' }}>Style:</label>
                                <div className="brush-size-controls">
                                    {['ramp', 'stairs'].map(type => (
                                        <button
                                            key={type}
                                            className={`size-btn ${rampType === type ? 'active' : ''}`}
                                            onClick={() => updateSettings({ rampType: type })}
                                            style={{ width: 'auto', padding: '0 8px' }}
                                        >
                                            {type === 'ramp' ? 'Ramp' : 'Stairs'}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ marginTop: 6, opacity: 0.75, fontSize: 11 }}>
                                    Auto-aligns with the adjacent tile that has the biggest
                                    level difference — no direction to set.
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="tool-section">
                <h4>Elevation Map</h4>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                    <div>Raised tiles: <strong>{stats.raised}</strong></div>
                    <div>Pit tiles: <strong>{stats.pits}</strong></div>
                    <div>Highest: <strong>{stats.max}</strong> · Lowest: <strong>{stats.min}</strong></div>
                    <div>Ramps / stairs: <strong>{stats.ramps}</strong></div>
                </div>
                <button
                    className="terrain-tool-btn"
                    style={{ marginTop: 8 }}
                    onClick={() => setElevationIndicatorsEnabled(!indicatorsEnabled)}
                    title="In-world markers: cliff rims, level badges (▲/▼) and ramp direction arrows. Players always see them; fog still hides undiscovered areas."
                >
                    <span className="tool-name">
                        {indicatorsEnabled ? 'Hide Elevation Markers' : 'Show Elevation Markers'}
                    </span>
                </button>
                <button
                    className="terrain-tool-btn"
                    style={{ marginTop: 8 }}
                    onClick={() => {
                        if (window.confirm('Clear all elevation and ramps on this map?')) {
                            clearAllElevation();
                        }
                    }}
                    title="Remove all elevation levels and ramp data on this map"
                >
                    <span className="tool-name">Clear All Elevation</span>
                </button>
            </div>
        </>
    );
};

export default ElevationTools;
