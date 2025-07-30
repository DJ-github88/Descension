import React, { useState } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import './styles/FogPanel.css';

const FogPanel = () => {
    const [selectedFogTool, setSelectedFogTool] = useState('paint');
    const [selectedFogType, setSelectedFogType] = useState('standard');

    // Level editor store
    const {
        activeTool,
        setActiveTool,
        setActiveTerrainType,
        brushSize,
        setBrushSize,
        fogOfWarData,
        clearFogOfWar,
        setFogOfWarEnabled,
        fogOfWarEnabled,
        lineOfSightEnabled,
        setLineOfSightEnabled,
        tokenVisionEnabled,
        setTokenVisionEnabled
    } = useLevelEditorStore();

    // Game store for GM mode check
    const { isGMMode } = useGameStore();

    // Fog types
    const fogTypes = {
        standard: {
            name: 'Standard Fog',
            icon: 'spell_frost_frostbolt',
            description: 'Basic fog of war - blocks vision completely',
            opacity: 0.8,
            color: '#000000'
        },
        light: {
            name: 'Light Fog',
            icon: 'spell_frost_chillingblast',
            description: 'Lighter fog - partially obscures vision',
            opacity: 0.5,
            color: '#333333'
        },
        heavy: {
            name: 'Heavy Fog',
            icon: 'spell_frost_frostshock',
            description: 'Dense fog - completely blocks vision',
            opacity: 1.0,
            color: '#000000'
        },
        magical: {
            name: 'Magical Darkness',
            icon: 'spell_shadow_shadowwordpain',
            description: 'Supernatural darkness - immune to normal light',
            opacity: 0.9,
            color: '#1a0033'
        }
    };

    // Fog tools
    const fogTools = {
        paint: {
            name: 'Paint Fog',
            icon: 'spell_nature_acid_01',
            description: 'Paint fog of war areas'
        },
        erase: {
            name: 'Erase Fog',
            icon: 'spell_holy_dispelmagic',
            description: 'Remove fog of war'
        },
        reveal: {
            name: 'Reveal Area',
            icon: 'spell_holy_holylight',
            description: 'Reveal areas for players'
        },
        hide: {
            name: 'Hide Area',
            icon: 'spell_shadow_detectinvisibility',
            description: 'Hide areas from players'
        }
    };

    const handleFogToolSelect = (tool) => {
        setSelectedFogTool(tool);

        // Set the appropriate level editor tool for fog operations
        switch (tool) {
            case 'paint':
                setActiveTool('paint');
                setActiveTerrainType('fogOfWar');
                console.log('🌫️ Fog paint tool activated - terrain type set to fogOfWar');
                break;
            case 'erase':
                setActiveTool('erase');
                setActiveTerrainType('fogOfWar');
                console.log('🌫️ Fog erase tool activated - terrain type set to fogOfWar');
                break;
            case 'reveal':
                setActiveTool('reveal');
                console.log('🌫️ Fog reveal tool activated');
                break;
            case 'hide':
                setActiveTool('hide');
                console.log('🌫️ Fog hide tool activated');
                break;
            default:
                setActiveTool('select');
        }

        // Fog tool selected
    };

    const handleFogTypeSelect = (type) => {
        setSelectedFogType(type);
    };

    const handleClearAllFog = () => {
        if (window.confirm('Are you sure you want to clear all fog of war?')) {
            clearFogOfWar();
        }
    };

    const handleBrushSizeChange = (size) => {
        setBrushSize(size);
    };

    const getFogCoverage = () => {
        if (!fogOfWarData || Object.keys(fogOfWarData).length === 0) {
            return 0;
        }
        // Calculate percentage of map covered by fog
        const totalCells = Object.keys(fogOfWarData).length;
        const foggedCells = Object.values(fogOfWarData).filter(cell => cell.fogged).length;
        return Math.round((foggedCells / totalCells) * 100);
    };

    return (
        <div className="fog-panel">
            {/* Fog Tools */}
            <div className="fog-tools">
                <h4>Fog Tools</h4>
                <div className="tool-grid">
                    {Object.entries(fogTools).map(([tool, config]) => (
                        <button
                            key={tool}
                            className={`tool-button ${selectedFogTool === tool ? 'active' : ''}`}
                            onClick={() => handleFogToolSelect(tool)}
                            title={config.description}
                        >
                            <img
                                src={`${WOW_ICON_BASE_URL}${config.icon}.jpg`}
                                alt={config.name}
                                className="tool-icon-img"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${WOW_ICON_BASE_URL}inv_misc_questionmark.jpg`;
                                }}
                            />
                            <span className="tool-label">{config.name}</span>
                        </button>
                    ))}
                </div>

                {/* Brush Controls */}
                {(selectedFogTool === 'paint' || selectedFogTool === 'erase') && (
                    <div className="brush-section">
                        <div className="brush-label">Brush Size:</div>
                        <div className="brush-buttons">
                            <button
                                className={`brush-button ${brushSize === 'small' ? 'active' : ''}`}
                                onClick={() => handleBrushSizeChange('small')}
                                title="Small Brush (1)"
                            >
                                S
                            </button>
                            <button
                                className={`brush-button ${brushSize === 'medium' ? 'active' : ''}`}
                                onClick={() => handleBrushSizeChange('medium')}
                                title="Medium Brush (2)"
                            >
                                M
                            </button>
                            <button
                                className={`brush-button ${brushSize === 'large' ? 'active' : ''}`}
                                onClick={() => handleBrushSizeChange('large')}
                                title="Large Brush (3)"
                            >
                                L
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Fog Types */}
            <div className="fog-types">
                <h4>Fog Types</h4>
                <div className="fog-type-grid">
                    {Object.entries(fogTypes).map(([type, config]) => (
                        <button
                            key={type}
                            className={`fog-type-button ${selectedFogType === type ? 'active' : ''}`}
                            onClick={() => handleFogTypeSelect(type)}
                            title={config.description}
                        >
                            <img
                                src={`${WOW_ICON_BASE_URL}${config.icon}.jpg`}
                                alt={config.name}
                                className="fog-icon-img"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${WOW_ICON_BASE_URL}inv_misc_questionmark.jpg`;
                                }}
                            />
                            <span className="fog-name">{config.name}</span>
                            <div className="fog-preview" style={{
                                backgroundColor: config.color,
                                opacity: config.opacity
                            }}></div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Vision System */}
            <div className="vision-system">
                <h4>Vision System</h4>
                <div className="vision-controls">
                    <div className="control-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={fogOfWarEnabled}
                                onChange={(e) => setFogOfWarEnabled(e.target.checked)}
                            />
                            Enable Fog of War
                        </label>
                    </div>
                    <div className="control-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={lineOfSightEnabled}
                                onChange={(e) => setLineOfSightEnabled(e.target.checked)}
                                disabled={!fogOfWarEnabled}
                            />
                            Line of Sight
                        </label>
                    </div>
                    <div className="control-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={tokenVisionEnabled}
                                onChange={(e) => setTokenVisionEnabled(e.target.checked)}
                                disabled={!fogOfWarEnabled || !lineOfSightEnabled}
                            />
                            Token Vision
                        </label>
                    </div>
                </div>
            </div>

            {/* Fog Statistics */}
            <div className="fog-statistics">
                <h4>Fog Statistics</h4>
                <div className="stat-list">
                    <div className="stat-item">
                        <span className="stat-label">Fog Coverage:</span>
                        <span className="stat-value">{getFogCoverage()}%</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">System Status:</span>
                        <span className={`stat-value ${fogOfWarEnabled ? 'enabled' : 'disabled'}`}>
                            {fogOfWarEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Line of Sight:</span>
                        <span className={`stat-value ${lineOfSightEnabled ? 'enabled' : 'disabled'}`}>
                            {lineOfSightEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Fog Controls */}
            <div className="fog-controls">
                {isGMMode && (
                    <>
                        <button
                            className="control-btn primary"
                            onClick={() => handleFogToolSelect('reveal')}
                            disabled={!fogOfWarEnabled}
                        >
                            Reveal All to Players
                        </button>
                        <button
                            className="control-btn secondary"
                            onClick={() => handleFogToolSelect('hide')}
                            disabled={!fogOfWarEnabled}
                        >
                            Hide All from Players
                        </button>
                        <button
                            className="control-btn danger"
                            onClick={handleClearAllFog}
                        >
                            Clear All Fog
                        </button>
                    </>
                )}
            </div>

            {/* Instructions */}
            <div className="fog-instructions">
                <h4>Instructions</h4>
                <ul className="instructions-list">
                    <li><strong>Enable Fog:</strong> Toggle fog of war system on/off</li>
                    <li><strong>Paint Fog:</strong> Click and drag to add fog areas (dark blue preview)</li>
                    <li><strong>Erase Fog:</strong> Remove fog from specific areas (yellow preview)</li>
                    <li><strong>Brush Size:</strong> S/M/L controls the area affected by paint/erase</li>
                    <li><strong>Line of Sight:</strong> Walls block vision automatically</li>
                    <li><strong>Token Vision:</strong> Characters reveal areas around them</li>
                    <li><strong>GM Controls:</strong> Reveal/hide areas for players</li>
                    <li><strong>Hover Preview:</strong> See what areas will be affected before clicking</li>
                    <li>Players can only see revealed areas and their token's vision range</li>
                </ul>
            </div>
        </div>
    );
};

export default FogPanel;
