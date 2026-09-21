import React, { useState } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import useFeatureFlag from '../../hooks/useFeatureFlag';
import { LIGHT_PRESETS } from '../../utils/LightingCalculations';
import './styles/AdvancedLightingPanel.css';

/**
 * AdvancedLightingPanel - Controls for advanced lighting features
 * Includes shadow quality, atmospheric effects, performance settings, and weather
 */
const AdvancedLightingPanel = () => {
    const [showWeatherControls, setShowWeatherControls] = useState(false);
    const { allowed: atmosphericAllowed } = useFeatureFlag('atmosphericEffects');
    
    // Level editor store
    const {
        atmosphericEffects,
        lightAnimations,
        performanceMode,
        shadowQuality,
        weatherEffects,
        setAtmosphericEffects,
        setLightAnimations,
        setPerformanceMode,
        setShadowQuality,
        setWeatherEffect,
        clearWeatherEffects,
        selectedLightType,
        setSelectedLightType,
        lightSources,
        clearAllLightSources,
        sunSettings,
        setSunSettings,
        ambientLightLevel,
        setAmbientLightLevel,
        selectedLightId,
        setSelectedLightId,
        updateLightSource,
        wallShadowsEnabled,
        setWallShadowsEnabled
    } = useLevelEditorStore();

    const selectedLight = selectedLightId ? lightSources?.[selectedLightId] : null;

    // Safe fallback for rooms persisted before sunSettings existed
    const sun = sunSettings || { azimuth: 135, elevation: 45, intensity: 1.0, ambient: 0.2 };

    // Game store for GM mode check
    const { isGMMode } = useGameStore();

    // Weather effect options
    const weatherOptions = [
        { value: 'none', label: 'None', description: 'Clear weather' },
        { value: 'rain', label: 'Rain', description: 'Falling rain particles' },
        { value: 'snow', label: 'Snow', description: 'Falling snow particles' },
        { value: 'fog', label: 'Atmospheric Fog', description: 'Drifting fog clouds' },
        { value: 'storm', label: 'Storm', description: 'Heavy rain with wind' },
        { value: 'embers', label: 'Embers', description: 'Rising ember particles' }
    ];

    const handleWeatherChange = (type) => {
        if (type === 'none') {
            clearWeatherEffects();
        } else {
            setWeatherEffect(type, weatherEffects.intensity, true);
        }
    };

    const handleWeatherIntensityChange = (intensity) => {
        setWeatherEffect(weatherEffects.type, intensity, weatherEffects.enabled);
    };

    return (
        <div className="advanced-lighting-panel">
            {/* Performance Settings */}
            <div className="settings-section">
                <h4 className="section-title">Performance Settings</h4>
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={performanceMode}
                            onChange={(e) => setPerformanceMode(e.target.checked)}
                        />
                        Performance Mode
                    </label>
                    <div className="setting-description">
                        Reduces visual quality for better performance on slower devices
                    </div>
                </div>
                
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={lightAnimations}
                            onChange={(e) => setLightAnimations(e.target.checked)}
                        />
                        Light Animations
                    </label>
                    <div className="setting-description">
                        Enable flickering effects for torches and candles
                    </div>
                </div>

                <div className="setting-item">
                    <label className="setting-label">3D Shadow Quality</label>
                    <select
                        value={shadowQuality}
                        onChange={(e) => setShadowQuality(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '4px 6px',
                            fontSize: 12,
                            borderRadius: 4,
                            border: '1.5px solid #7a3b2e',
                            background: '#f2e7cd',
                            color: '#5d2d22',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="low">Low — fastest</option>
                        <option value="medium">Medium</option>
                        <option value="high">High — sharpest</option>
                    </select>
                    <div className="setting-description">
                        Resolution of sun and dynamic light shadows. High sharpens
                        object shadows; Performance Mode overrides this to Low.
                    </div>
                </div>
            </div>

            {/* Sun & Shadows */}
            <div className="settings-section">
                <h4 className="section-title">Sun &amp; Shadows</h4>
                <div className="setting-item">
                    <label className="setting-label">Azimuth ({Math.round(sun.azimuth)}°)</label>
                    <input
                        type="range" min="0" max="360" step="5" value={sun.azimuth}
                        onChange={(e) => setSunSettings({ azimuth: parseFloat(e.target.value) })}
                    />
                    <div className="setting-description">Direction the sunlight comes FROM (0° = north)</div>
                </div>
                <div className="setting-item">
                    <label className="setting-label">Sun height ({Math.round(sun.elevation)}°)</label>
                    <input
                        type="range" min="5" max="90" step="5" value={sun.elevation}
                        onChange={(e) => setSunSettings({ elevation: parseFloat(e.target.value) })}
                    />
                    <div className="setting-description">Low sun = long shadows, 90° = directly overhead</div>
                </div>
                <div className="setting-item">
                    <label className="setting-label">Sun intensity ({sun.intensity.toFixed(1)})</label>
                    <input
                        type="range" min="0" max="2" step="0.1" value={sun.intensity}
                        onChange={(e) => setSunSettings({ intensity: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="setting-item">
                    <label className="setting-label">Ambient light ({Math.round(ambientLightLevel * 100)}%)</label>
                    <input
                        type="range" min="0" max="1" step="0.05" value={ambientLightLevel}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setAmbientLightLevel(value);
                            setSunSettings({ ambient: value });
                        }}
                    />
                </div>
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={wallShadowsEnabled !== false}
                            onChange={(e) => setWallShadowsEnabled(e.target.checked)}
                        />
                        Wall sun shadows
                    </label>
                    <div className="setting-description">
                        Turn off to hide directional wall shadows in the editor (big perf win on wall-heavy maps)
                    </div>
                </div>
            </div>

            {/* Selected Light Properties */}
            {selectedLight && (
                <div className="settings-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <h4 className="section-title" style={{ margin: 0 }}>
                            Selected: {LIGHT_PRESETS[selectedLight.type]?.name || selectedLight.type}
                        </h4>
                        <button
                            onClick={() => setSelectedLightId(null)}
                            style={{
                                padding: '2px 8px', fontSize: 10, borderRadius: 4,
                                border: '1.5px solid #7a3b2e', background: '#e2d2ae',
                                color: '#5d2d22', cursor: 'pointer'
                            }}
                        >
                            Deselect
                        </button>
                    </div>

                    <div className="setting-item">
                        <label className="setting-label">Radius ({selectedLight.radius} tiles)</label>
                        <input
                            type="range" min="1" max="20" step="1" value={selectedLight.radius}
                            onChange={(e) => updateLightSource(selectedLight.id, { radius: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div className="setting-item">
                        <label className="setting-label">Intensity ({Number(selectedLight.intensity ?? 1).toFixed(1)})</label>
                        <input
                            type="range" min="0" max="2" step="0.1" value={selectedLight.intensity ?? 1}
                            onChange={(e) => updateLightSource(selectedLight.id, { intensity: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div className="setting-item">
                        <label className="setting-label">Color</label>
                        <input
                            type="color"
                            value={selectedLight.color || '#ffaa00'}
                            onChange={(e) => updateLightSource(selectedLight.id, { color: e.target.value })}
                        />
                    </div>

                    <div className="setting-item">
                        <label className="setting-label">
                            <input
                                type="checkbox"
                                checked={!!selectedLight.flickering}
                                onChange={(e) => updateLightSource(selectedLight.id, { flickering: e.target.checked })}
                            />
                            Flickering
                        </label>
                    </div>

                    <div className="setting-item">
                        <label className="setting-label">
                            <input
                                type="checkbox"
                                checked={selectedLight.enabled !== false}
                                onChange={(e) => updateLightSource(selectedLight.id, { enabled: e.target.checked })}
                            />
                            Enabled
                        </label>
                    </div>

                    <div className="setting-item">
                        <label className="setting-label">
                            Direction ({Math.round(selectedLight.direction ?? 0)}°) — 0 = radial glow
                        </label>
                        <input
                            type="range" min="0" max="360" step="15" value={selectedLight.direction ?? 0}
                            onChange={(e) => updateLightSource(selectedLight.id, { direction: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div className="setting-item">
                        <label className="setting-label">
                            Cone angle ({Math.round(selectedLight.coneAngle ?? 360)}°)
                        </label>
                        <input
                            type="range" min="15" max="360" step="15" value={selectedLight.coneAngle ?? 360}
                            onChange={(e) => updateLightSource(selectedLight.id, { coneAngle: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>
            )}

            {/* Light Placement */}
            <div className="settings-section">
                <h4 className="section-title">Light Placement</h4>
                <div className="setting-description" style={{ marginBottom: 8 }}>
                    Pick the <strong>Place Light</strong> tool in the tool dropdown, then click the map.
                    Use <strong>Remove Light</strong> to delete a light.
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {Object.entries(LIGHT_PRESETS).map(([presetKey, preset]) => (
                        <button
                            key={presetKey}
                            onClick={() => setSelectedLightType(presetKey)}
                            title={preset.description}
                            style={{
                                padding: '4px 8px',
                                fontSize: 11,
                                borderRadius: 5,
                                cursor: 'pointer',
                                border: selectedLightType === presetKey ? '2px solid #d4af37' : '1.5px solid #7a3b2e',
                                background: selectedLightType === presetKey
                                    ? 'linear-gradient(180deg, #c9a24a 0%, #b08d3e 100%)'
                                    : 'linear-gradient(180deg, #f2e7cd 0%, #ddcda6 100%)',
                                color: selectedLightType === presetKey ? '#fff8e6' : '#5d2d22',
                                fontWeight: 700
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    marginRight: 5,
                                    background: preset.color
                                }}
                            />
                            {preset.name}
                        </button>
                    ))}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, opacity: 0.8 }}>
                    Lights on map: <strong>{Object.keys(lightSources || {}).length}</strong>
                    {Object.keys(lightSources || {}).length > 0 && (
                        <button
                            onClick={() => clearAllLightSources()}
                            style={{
                                marginLeft: 8,
                                padding: '2px 8px',
                                fontSize: 10,
                                borderRadius: 4,
                                border: '1.5px solid #7a3b2e',
                                background: '#e2d2ae',
                                color: '#5d2d22',
                                cursor: 'pointer'
                            }}
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Atmospheric Effects */}
            <div className="settings-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 className="section-title" style={{ margin: 0 }}>Atmospheric Effects</h4>
                    {!atmosphericAllowed && (
                        <span style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(155, 89, 182, 0.25)',
                            border: '1px solid rgba(155, 89, 182, 0.6)',
                            color: '#e0b0ff',
                            letterSpacing: '0.5px'
                        }}>
                            <i className="fas fa-crown" style={{ marginRight: '4px' }}></i>PRO
                        </span>
                    )}
                </div>
                
                <div className="setting-item">
                    <label className="setting-label" style={{ opacity: !atmosphericAllowed ? 0.7 : 1 }}>
                        <input
                            type="checkbox"
                            checked={atmosphericAllowed && atmosphericEffects}
                            onChange={(e) => {
                                if (!atmosphericAllowed) {
                                    alert('Atmospheric and weather effects require a Dungeon Master (Pro) or higher subscription.');
                                    return;
                                }
                                setAtmosphericEffects(e.target.checked);
                            }}
                            disabled={!atmosphericAllowed}
                        />
                        Enable Atmospheric Effects
                    </label>
                    <div className="setting-description">
                        {atmosphericAllowed
                            ? 'Adds atmospheric scattering and environmental effects'
                            : 'Atmospheric particles and weather overlays require Dungeon Master (Pro) or above'}
                    </div>
                </div>

                <div className="setting-item">
                    <button
                        className={`toggle-btn ${showWeatherControls ? 'active' : ''}`}
                        onClick={() => setShowWeatherControls(!showWeatherControls)}
                        disabled={!atmosphericAllowed}
                        style={{ opacity: !atmosphericAllowed ? 0.6 : 1 }}
                    >
                        Weather Effects {!atmosphericAllowed ? '🔒' : showWeatherControls ? '▼' : '▶'}
                    </button>
                </div>

                {showWeatherControls && (
                    <div className="weather-controls">
                        <div className="setting-item">
                            <label className="setting-label">Weather Type:</label>
                            <div className="weather-buttons">
                                {weatherOptions.map(option => (
                                    <button
                                        key={option.value}
                                        className={`weather-btn ${weatherEffects.type === option.value ? 'active' : ''}`}
                                        onClick={() => handleWeatherChange(option.value)}
                                        title={option.description}
                                        disabled={!atmosphericEffects}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {weatherEffects.type !== 'none' && (
                            <div className="setting-item">
                                <label className="setting-label">Weather Intensity:</label>
                                <div className="slider-control">
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.1"
                                        value={weatherEffects.intensity}
                                        onChange={(e) => handleWeatherIntensityChange(parseFloat(e.target.value))}
                                        disabled={!atmosphericEffects}
                                    />
                                    <span className="slider-value">{Math.round(weatherEffects.intensity * 100)}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* System Information */}
            <div className="settings-section">
                <h4 className="section-title">System Information</h4>
                <div className="system-info">
                    <div className="info-item">
                        <span className="info-label">Performance Mode:</span>
                        <span className={`info-value ${performanceMode ? 'enabled' : 'disabled'}`}>
                            {performanceMode ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Weather:</span>
                        <span className="info-value">
                            {weatherEffects.type === 'none' ? 'Clear' : weatherEffects.type.charAt(0).toUpperCase() + weatherEffects.type.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="settings-section">
                <h4 className="section-title">Advanced Features</h4>
                <ul className="instructions-list">
                    <li><strong>Performance Mode:</strong> Disables advanced effects for better frame rates</li>
                    <li><strong>Atmospheric Effects:</strong> Adds environmental lighting interactions</li>
                    <li><strong>Weather Effects:</strong> Visual overlays that enhance immersion</li>
                    <li>Adjust settings based on your device's performance capabilities</li>
                </ul>
            </div>
        </div>
    );
};

export default AdvancedLightingPanel;
