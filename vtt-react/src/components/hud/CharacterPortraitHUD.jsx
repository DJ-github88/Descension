import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import useTargetingStore from '../../store/targetingStore';
import ClassResourceBar from './ClassResourceBar';
import '../../styles/party-hud.css';
import './styles/ClassResourceBar.css';

const CharacterPortraitHUD = ({
    character,
    isCurrentPlayer = false,
    isTarget = false,
    onInspect,
    onTarget,
    onCreateToken,
    position = { x: 0, y: 0 },
    scale = 1.0
}) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    
    const contextMenuRef = useRef(null);
    const portraitRef = useRef(null);

    // Get character data - use current player data if this is the current player
    const currentPlayerData = useCharacterStore(state => ({
        name: state.name,
        baseName: state.baseName,
        roomName: state.roomName,
        race: state.race,
        raceDisplayName: state.raceDisplayName,
        class: state.class,
        level: state.level,
        health: state.health,
        mana: state.mana,
        actionPoints: state.actionPoints,
        classResource: state.classResource, // Add class resource to subscription
        lore: state.lore,
        tokenSettings: state.tokenSettings,
        derivedStats: state.derivedStats,
        equipmentBonuses: state.equipmentBonuses,
        stats: state.stats // Add stats to subscription for constitution/intelligence changes
    }));

    // Get updateClassResource function from store
    const updateClassResource = useCharacterStore(state => state.updateClassResource);

    const characterData = isCurrentPlayer ? currentPlayerData : character;

    // Use calculated max values from derivedStats if available, otherwise fall back to stored values
    const maxHealth = characterData.derivedStats?.maxHealth || characterData.health.max;
    const maxMana = characterData.derivedStats?.maxMana || characterData.mana.max;



    // Calculate health percentage for bar color
    const healthPercentage = (characterData.health.current / maxHealth) * 100;
    const manaPercentage = (characterData.mana.current / maxMana) * 100;
    const apPercentage = (characterData.actionPoints.current / characterData.actionPoints.max) * 100;

    // Get health bar color based on percentage
    const getHealthBarColor = (percentage) => {
        if (percentage > 75) return '#4CAF50'; // Green
        if (percentage > 50) return '#FFC107'; // Yellow
        if (percentage > 25) return '#FF9800'; // Orange
        return '#F44336'; // Red
    };

    // Handle right-click context menu
    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const x = e.clientX;
        const y = e.clientY;

        setContextMenuPosition({ x, y });
        setShowContextMenu(true);
    };

    // Handle mouse enter for tooltip
    const handleMouseEnter = (e) => {
        if (!portraitRef.current) return;

        const rect = portraitRef.current.getBoundingClientRect();
        setTooltipPosition({
            x: rect.right + 10,
            y: rect.top
        });
        setShowTooltip(true);
    };

    // Handle mouse leave for tooltip
    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    // Handle inspect action
    const handleInspect = () => {
        setShowContextMenu(false);
        if (onInspect) {
            onInspect(characterData, isCurrentPlayer);
        }
    };

    // Handle create token action
    const handleCreateToken = () => {
        setShowContextMenu(false);
        if (onCreateToken) {
            onCreateToken(characterData, isCurrentPlayer);
        }
    };

    // Handle target action
    const handleTarget = () => {
        setShowContextMenu(false);
        if (onTarget) {
            onTarget(characterData);
        }
    };

    // Close context menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setShowContextMenu(false);
            }
        };

        if (showContextMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showContextMenu]);

    return (
        <>
            <div
                ref={portraitRef}
                className={`character-portrait-hud ${isCurrentPlayer ? 'current-player' : ''} ${isTarget ? 'targeted' : ''}`}
                style={{
                    position: 'absolute',
                    left: position.x,
                    top: position.y,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left'
                }}
                onContextMenu={handleContextMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Character Portrait */}
                <div className="portrait-container">
                    <div className="portrait-frame">
                        <div className="portrait-image">
                            {/* Use character image if available, otherwise show default */}
                            {characterData.lore?.characterImage ? (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        backgroundImage: `url(${characterData.lore.characterImage})`,
                                        backgroundSize: characterData.lore?.imageTransformations
                                            ? `${(characterData.lore.imageTransformations.scale || 1) * 150}%`
                                            : 'cover',
                                        backgroundPosition: characterData.lore?.imageTransformations
                                            ? `${50 + (characterData.lore.imageTransformations.positionX || 0) / 2}% ${50 - (characterData.lore.imageTransformations.positionY || 0) / 2}%`
                                            : 'center center',
                                        backgroundRepeat: 'no-repeat',
                                        transform: characterData.lore?.imageTransformations
                                            ? `rotate(${characterData.lore.imageTransformations.rotation || 0}deg)`
                                            : 'none'
                                    }}
                                />
                            ) : null}
                            <div
                                className="default-portrait"
                                style={{
                                    display: characterData.lore?.characterImage ? 'none' : 'flex'
                                }}
                            >
                                {characterData.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        
                        {/* Target indicator */}
                        {isTarget && (
                            <div className="target-indicator">
                                <div className="target-arrow"></div>
                            </div>
                        )}
                        
                        {/* Status indicators */}
                        <div className="status-indicators">
                            {isCurrentPlayer && <div className="player-indicator"></div>}
                        </div>
                    </div>
                    
                    {/* Character Name */}
                    <div className="character-name">{characterData.name}</div>
                </div>

                {/* Resource Bars */}
                <div className="resource-bars">
                    {/* Health Bar */}
                    <div className="resource-bar health-bar">
                        <div className="bar-background">
                            <div 
                                className="bar-fill health-fill"
                                style={{
                                    width: `${healthPercentage}%`,
                                    backgroundColor: getHealthBarColor(healthPercentage)
                                }}
                            ></div>
                            <div className="bar-text">
                                {characterData.health.current}/{Math.round(maxHealth)}
                            </div>
                        </div>
                    </div>

                    {/* Mana Bar */}
                    <div className="resource-bar mana-bar">
                        <div className="bar-background">
                            <div 
                                className="bar-fill mana-fill"
                                style={{
                                    width: `${manaPercentage}%`,
                                    backgroundColor: '#2196F3' // Blue for mana
                                }}
                            ></div>
                            <div className="bar-text">
                                {characterData.mana.current}/{Math.round(maxMana)}
                            </div>
                        </div>
                    </div>

                    {/* Action Points Bar */}
                    <div className="resource-bar ap-bar">
                        <div className="bar-background">
                            <div
                                className="bar-fill ap-fill"
                                style={{
                                    width: `${apPercentage}%`,
                                    backgroundColor: '#FF9800' // Orange for action points
                                }}
                            ></div>
                            <div className="bar-text">
                                {characterData.actionPoints.current}/{characterData.actionPoints.max}
                            </div>
                        </div>
                    </div>

                    {/* Class Resource Bar - Only show if character has a class and class resource */}
                    {characterData.class && characterData.classResource && (
                        <ClassResourceBar
                            characterClass={characterData.class}
                            classResource={characterData.classResource}
                            size="small"
                            onClassResourceUpdate={isCurrentPlayer ? updateClassResource : null}
                        />
                    )}
                </div>
            </div>

            {/* Context Menu */}
            {showContextMenu && createPortal(
                <div
                    ref={contextMenuRef}
                    className="character-hud-context-menu"
                    style={{
                        position: 'fixed',
                        left: contextMenuPosition.x,
                        top: contextMenuPosition.y,
                        zIndex: 999999
                    }}
                >
                    <div className="context-menu-header">
                        <div className="character-name">{characterData.name}</div>
                        <div className="character-details">
                            {characterData.race} {characterData.class}
                        </div>
                    </div>
                    
                    <div className="context-menu-section">
                        <button className="context-menu-button" onClick={handleInspect}>
                            <i className="fas fa-search"></i> Inspect
                        </button>

                        {isCurrentPlayer && (
                            <button className="context-menu-button" onClick={handleCreateToken}>
                                <i className="fas fa-plus-circle"></i> Create Token
                            </button>
                        )}

                        {!isCurrentPlayer && (
                            <button className="context-menu-button" onClick={handleTarget}>
                                <i className="fas fa-crosshairs"></i> Target
                            </button>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* Tooltip */}
            {showTooltip && createPortal(
                <div
                    className="character-hud-tooltip"
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        zIndex: 999998
                    }}
                >
                    <div className="tooltip-header">
                        <div className="tooltip-name">{characterData.name}</div>
                        <div className="tooltip-class">{characterData.raceDisplayName || characterData.race} {characterData.class}</div>
                    </div>
                    <div className="tooltip-resources">
                        <div className="tooltip-resource">
                            <span className="resource-label">Health:</span>
                            <span className="resource-value">{characterData.health.current}/{characterData.health.max}</span>
                        </div>
                        <div className="tooltip-resource">
                            <span className="resource-label">Mana:</span>
                            <span className="resource-value">{characterData.mana.current}/{characterData.mana.max}</span>
                        </div>
                        <div className="tooltip-resource">
                            <span className="resource-label">Action Points:</span>
                            <span className="resource-value">{characterData.actionPoints.current}/{characterData.actionPoints.max}</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default CharacterPortraitHUD;
