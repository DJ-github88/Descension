import React, { useState } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import './styles/AdvancedLightingPanel.css';

/**
 * AdvancedLightingPanel - Controls for advanced lighting features
 * Includes shadow quality, atmospheric effects, performance settings, and weather
 */
const AdvancedLightingPanel = () => {
    const [showWeatherControls, setShowWeatherControls] = useState(false);
    
    // Level editor store
    const {
        atmosphericEffects,
        lightAnimations,
        performanceMode,
        weatherEffects,
        setAtmosphericEffects,
        setLightAnimations,
        setPerformanceMode,
        setWeatherEffect,
        clearWeatherEffects
    } = useLevelEditorStore();

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
            </div>

            {/* Atmospheric Effects */}
            <div className="settings-section">
                <h4 className="section-title">Atmospheric Effects</h4>
                
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={atmosphericEffects}
                            onChange={(e) => setAtmosphericEffects(e.target.checked)}
                        />
                        Enable Atmospheric Effects
                    </label>
                    <div className="setting-description">
                        Adds atmospheric scattering and environmental effects
                    </div>
                </div>

                <div className="setting-item">
                    <button
                        className={`toggle-btn ${showWeatherControls ? 'active' : ''}`}
                        onClick={() => setShowWeatherControls(!showWeatherControls)}
                    >
                        Weather Effects {showWeatherControls ? '▼' : '▶'}
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
