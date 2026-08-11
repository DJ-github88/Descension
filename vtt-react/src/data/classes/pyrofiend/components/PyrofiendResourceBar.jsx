import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/PyrofiendResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';

const STAGE_NAMES = {
    0: 'Mortal',
    1: 'Ember',
    2: 'Smolder',
    3: 'Scorch',
    4: 'Blaze',
    5: 'Inferno',
    6: 'Conflagration',
    7: 'Cataclysm',
    8: 'Apocalypse',
    9: 'Oblivion'
};

const DRAWBACK_TEXTS = {
    0: 'None',
    1: '-2 Hit chance (distortions)',
    2: '1d4 Psychic dmg/turn',
    3: '-10ft Movement, Fatigue',
    4: '+1d6 Damage taken from all sources',
    5: '1d6 Bleeding dmg/turn',
    6: 'Cannot be healed by others, Disadv Insight/Perception',
    7: '-15ft Speed, 1d6 Suffocation',
    8: '2d4 Self-dmg, Disadv Dex',
    9: '4d8 Self-dmg, Death in 3 Turns'
};

const PyrofiendResourceBar = ({ 
    classResource = {}, 
    size = 'normal', 
    config = {}, 
    context = 'hud', 
    isOwner = true, 
    onClassResourceUpdate = null 
}) => {
    // Read inferno level from classResource prop, default to 0 if not available
    const infernoLevel = classResource?.current ?? 0;
    const maxInfernoLevel = classResource?.max ?? 9;
    
    const [selectedSpec, setSelectedSpec] = useState('inferno');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showSpecSelector, setShowSpecSelector] = useState(false);
    const [hoveredRune, setHoveredRune] = useState(null);
    
    const barRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [infernoLevel]);
    const controlsMenuRef = useRef(null);

    const specConfigs = {
        inferno: { 
            name: 'Inferno', 
            baseColor: '#8B0000',
            activeColor: '#FF4500',
            glowColor: '#FF6347',
            icon: 'fa-fire-flame-curved',
            passive: 'Burning Ambition',
            passiveDesc: 'At Inferno Level 3+: Fire spells deal +1 damage per die rolled. At Level 7+: Fire spells crit on the 2 highest die numbers, crits deal +1d10 fire damage.'
        },
        wildfire: { 
            name: 'Wildfire', 
            baseColor: '#CC5500',
            activeColor: '#FF8C00',
            glowColor: '#FFA500',
            icon: 'fa-fire',
            passive: 'Wildfire Spread',
            passiveDesc: 'When an enemy with your burn dies, burn spreads to all enemies within 10 ft (2d6 fire + 1d6/turn for 3 turns).'
        },
        apostate: {
            name: "The Apostate's Path",
            baseColor: '#6B2020',
            activeColor: '#8B3A3A',
            glowColor: '#C06060',
            icon: 'fa-fire-flame-curved',
            passive: 'Tempered Pact',
            passiveDesc: "All fire spells cost double mana but ascend the Inferno Veil at half the rate. Descending via Cooling Ember grants +1 next fire damage per level descended. Advantage on Wyrd Whisper Spirit saves. No self-healing."
        }
    };

    const currentSpec = specConfigs[selectedSpec] || specConfigs.inferno;

    // Close controls menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showControls) {
                const clickedElement = event.target;
                const isInsideMenu = controlsMenuRef.current?.contains(clickedElement);
                const isInsideBar = barRef.current?.contains(clickedElement);
                
                if (!isInsideMenu && !isInsideBar) {
                    setShowControls(false);
                }
            }
        };

        if (showControls) {
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 0);
            
            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showControls]);

    // Chat store for combat notifications
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');
    
    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };
    
    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'classResource') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        
        let message = '';
        if (isPositive) {
            const messages = [
                `${characterName} gained ${absAmount} ${resourceName}`,
                `${characterName} acquired ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} was added to ${characterName}`,
                `${characterName} received ${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `${characterName} spent ${absAmount} ${resourceName}`,
                `${characterName} used ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} was consumed by ${characterName}`,
                `${characterName} expended ${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        }
        
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: resourceType,
            isPositive: isPositive,
            customMessage: message
        });
    };

    const handleInfernoChange = (delta) => {
        const newLevel = Math.max(0, Math.min(maxInfernoLevel, infernoLevel + delta));
        const actualAmount = Math.abs(newLevel - infernoLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Inferno Level', actualAmount, delta > 0, 'infernoLevel');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', newLevel);
        }
    };

    const handleInfernoSet = (level) => {
        const newLevel = Math.max(0, Math.min(maxInfernoLevel, level));
        const actualAmount = Math.abs(newLevel - infernoLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Inferno Level', actualAmount, newLevel > infernoLevel, 'infernoLevel');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', newLevel);
        }
    };

    const getVisualIntensity = () => {
        if (infernoLevel === 0) return 'dormant';
        if (infernoLevel <= 2) return 'ember';
        if (infernoLevel <= 4) return 'controlled';
        if (infernoLevel <= 6) return 'intense';
        if (infernoLevel <= 8) return 'blazing';
        return 'catastrophic';
    };

    const getStageName = (level) => STAGE_NAMES[level] || 'Unknown';
    const getDrawbackText = (level) => DRAWBACK_TEXTS[level] || 'Unknown';

    // 9 Runes Rendering with custom game assets
    const renderRunes = () => {
        const runes = [];
        for (let i = 1; i <= maxInfernoLevel; i++) {
            const isFilled = infernoLevel >= i;
            const isCurrentTier = infernoLevel === i;
            const isCatastrophic = i === 9 && infernoLevel >= 9;
            const isHovered = hoveredRune === i;

            runes.push(
                <div 
                    key={i} 
                    className={`pyrofiend-rune-slot slot-${i} ${isFilled ? 'filled' : 'empty'} ${isCurrentTier ? 'current-active' : ''} ${isCatastrophic ? 'catastrophic' : ''} ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredRune(i)}
                    onMouseLeave={() => setHoveredRune(null)}
                    onClick={(e) => {
                        if (isOwner && e.shiftKey) {
                            e.stopPropagation();
                            handleInfernoSet(i);
                        }
                    }}
                >
                    {/* Unlit Carved Rune (Stone) */}
                    <img 
                        src={`/assets/ui/classes/pyrofiend/Empty Stage ${i}.PNG`}
                        alt={`Unlit Stage ${i}`}
                        className={`pyrofiend-rune-img rune-empty ${!isFilled ? 'visible' : 'faded'}`}
                        draggable={false}
                    />

                    {/* Lit Glowing Rune (Fire) */}
                    <img 
                        src={`/assets/ui/classes/pyrofiend/Filled Stage ${i}.PNG`}
                        alt={`Lit Stage ${i}`}
                        className={`pyrofiend-rune-img rune-filled ${isFilled ? 'visible' : 'faded'}`}
                        draggable={false}
                    />
                </div>
            );
        }
        return runes;
    };

    const getDrawbackColor = (level) => {
        if (level === 0) return '#4a3c2c';
        if (level <= 4) return '#8c2510';
        if (level <= 6) return '#9e1212';
        return '#b30000';
    };

    return (
        <div className={`pyrofiend-resource-wrapper ${size} ${infernoLevel >= 9 ? 'catastrophic-warning' : ''}`}>
            {/* Main Resource Bar - Interactive Illustrated Component */}
            <div
                ref={barRef}
                className={`pyrofiend-resource-bar ${size} clickable intensity-${getVisualIntensity()}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => {
                    setShowTooltip(false);
                    setHoveredRune(null);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isOwner) setShowControls(!showControls);
                }}
            >
                {/* Base Carved Stone Slab Background Asset */}
                <img 
                    src="/assets/ui/classes/pyrofiend/Empty Bar.PNG"
                    alt="Pyrofiend Bar Base"
                    className="pyrofiend-bar-base-asset"
                    draggable={false}
                />

                {/* 9 Runes Track */}
                <div className="pyrofiend-runes-track">
                    {renderRunes()}
                </div>
            </div>
            
            {/* Pathfinder-styled Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip pyrofiend-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <div className="tooltip-header" style={{ fontSize: '1.05rem', color: infernoLevel > 0 ? '#8c2510' : '#2C2416', letterSpacing: '0.6px' }}>
                        {getStageName(infernoLevel)} (Stage {infernoLevel})
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-row" style={{ fontSize: '0.92rem', color: '#2C2416' }}>
                            <strong>Fire Damage Bonus:</strong> <span style={{ color: '#8c2510', fontWeight: 700 }}>+{infernoLevel} per die rolled</span>
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label" style={{ color: '#2C2416', fontWeight: 700 }}>CURRENT DRAWBACK</div>
                        <div className="drawback-text" style={{ color: getDrawbackColor(infernoLevel), fontWeight: infernoLevel >= 5 ? 700 : 600, fontSize: '0.9rem', lineHeight: 1.35 }}>
                            {getDrawbackText(infernoLevel)}
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label" style={{ color: '#2C2416', fontWeight: 700, marginBottom: '6px' }}>LEVEL MANAGEMENT</div>
                        <div className="pyrofiend-management-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.86rem' }}>
                            <div style={{ color: '#2C2416' }}>
                                <strong style={{ color: '#8c2510' }}>Ascend:</strong> <span style={{ color: '#3d2e1e' }}>Cast fire spells (varies by spell tier)</span>
                            </div>
                            <div style={{ color: '#2C2416' }}>
                                <strong style={{ color: '#1e5f74' }}>Descend:</strong> <span style={{ color: '#3d2e1e' }}>Cooling Ember (-2 levels), -1 per min out of combat</span>
                            </div>
                        </div>
                    </div>

                    {infernoLevel >= 5 && (
                        <>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label" style={{ color: '#8c2510', fontWeight: 700 }}>INFERNAL SURGE (ACTIVE)</div>
                                <div className="passive-desc" style={{ color: '#2C2416', fontSize: '0.88rem', fontWeight: 500 }}>
                                    At Inferno Level 5+: Your next fire spell deals <strong>+2d6 fire damage</strong>.
                                </div>
                            </div>
                        </>
                    )}

                    {isOwner && (
                        <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed rgba(139, 115, 85, 0.4)', fontSize: '0.78rem', color: '#5a4632', fontStyle: 'italic' }}>
                            Click bar to open controls menu. Shift+Click rune to set level directly.
                        </div>
                    )}
                </div>,
                document.body
            )}
            
            {/* Dev & Player Controls Menu */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    style={{
                        position: 'fixed',
                        top: barRef.current ? barRef.current.getBoundingClientRect().bottom + 8 : '50%',
                        left: barRef.current ? barRef.current.getBoundingClientRect().left : '50%',
                        transform: barRef.current ? 'none' : 'translate(-50%, -50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Inferno Veil Controls</div>

                            {/* Current state summary */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '6px', lineHeight: 1.35 }}>
                                <div><strong>Stage:</strong> {getStageName(infernoLevel)} <span style={{ color: '#d4883b' }}>(Level {infernoLevel}/{maxInfernoLevel})</span></div>
                                <div><strong>Fire bonus:</strong> +{infernoLevel} damage per die</div>
                                <div style={{ color: infernoLevel >= 7 ? '#ff6b6b' : infernoLevel >= 5 ? '#ff9e5e' : '#5a4628' }}>
                                    <strong>Drawback:</strong> {getDrawbackText(infernoLevel)}
                                </div>
                                {infernoLevel >= 5 && (
                                    <div style={{ color: '#c0392b', fontStyle: 'italic', marginTop: '2px' }}>
                                        Infernal Surge active — Wyrd Whisper Spirit saves begin at Level 5.
                                    </div>
                                )}
                                {infernoLevel === 0 && (
                                    <div style={{ color: '#5a4628', fontStyle: 'italic', marginTop: '2px' }}>
                                        Cast fire spells to ascend. Use <strong>Cooling Ember</strong> to descend.
                                    </div>
                                )}
                            </div>

                            <div className="context-menu-section-header" style={{fontSize: '12px', marginTop: '8px', marginBottom: '8px'}}>
                                Set Inferno Level
                            </div>

                            {/* Direct Jump Grid (0 to 9) */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                                    <button 
                                        key={lvl}
                                        className={`context-menu-button ${infernoLevel === lvl ? 'active' : ''} ${lvl >= 9 ? 'danger' : ''}`}
                                        onClick={() => handleInfernoSet(lvl)}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <button className="context-menu-button" onClick={() => handleInfernoChange(-1)}>
                                    <i className="fas fa-minus-circle"></i>
                                    -1
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoChange(1)}>
                                    <i className="fas fa-plus-circle"></i>
                                    +1
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{margin: '12px 0'}}></div>

                            <button className="context-menu-button danger" onClick={() => setShowControls(false)} style={{width: '100%'}}>
                                <i className="fas fa-times"></i>
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default PyrofiendResourceBar;
