import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/PyrofiendResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';

const PyrofiendResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', isOwner = true, onClassResourceUpdate = null }) => {
    // Read inferno level from classResource prop, default to 0 if not available
    const infernoLevel = classResource?.current ?? 0;
    const maxInfernoLevel = classResource?.max ?? 9;
    
    
    const [selectedSpec, setSelectedSpec] = useState('inferno');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showSpecSelector, setShowSpecSelector] = useState(false);
    
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
            passiveDesc: "All fire spells cost double mana but ascend the Inferno Veil at half the rate. Descending via Cooling Ember grants +1 next fire damage per level descended. Advantage on Demonic Whisper Spirit saves. No self-healing."
        }
    };

    const currentSpec = specConfigs[selectedSpec] || specConfigs.inferno;


    // Close controls menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showControls) {
                // Check if click is outside both the menu and the bar
                const clickedElement = event.target;
                const isInsideMenu = controlsMenuRef.current?.contains(clickedElement);
                const isInsideBar = barRef.current?.contains(clickedElement);
                
                // Don't close if clicking on the bar (it toggles the menu itself)
                // or if clicking inside the menu
                if (!isInsideMenu && !isInsideBar) {
                    setShowControls(false);
                }
            }
        };

        if (showControls) {
            // Use a small timeout to ensure the bar's onClick handler runs first
            // This prevents the menu from closing immediately when opening it
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 0);
            
            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showControls]);

    // Get chat store for combat notifications
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');
    
    // Helper function to get the actor name
    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };
    
    // Helper function to log class resource changes
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

    const handleSpecChange = (spec) => {
        setSelectedSpec(spec);
        setShowSpecSelector(false);
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

    // Get visual intensity based on inferno level
    const getVisualIntensity = () => {
        if (infernoLevel === 0) return 'dormant';
        if (infernoLevel <= 2) return 'ember';
        if (infernoLevel <= 4) return 'controlled';
        if (infernoLevel <= 6) return 'intense';
        if (infernoLevel <= 8) return 'blazing';
        return 'catastrophic';
    };

    // Get stage name for inferno level
    const getStageName = (level) => {
        const stageNames = {
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
        return stageNames[level] || 'Unknown';
    };

    // Get drawback text for current level
    const getDrawbackText = (level) => {
        const drawbacks = {
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
        return drawbacks[level] || 'Unknown';
    };

    // Render inferno segments (9 segments for levels 1-9)
    const renderInfernoSegments = () => {
        const segments = [];
        const intensity = getVisualIntensity();
        
        for (let i = 1; i <= maxInfernoLevel; i++) {
            const isFilled = infernoLevel >= i;
            const isCatastrophic = i === 9 && infernoLevel === 9;
            
            segments.push(
                <div 
                    key={i} 
                    className={`inferno-segment ${isFilled ? 'filled' : ''} ${isCatastrophic ? 'catastrophic' : ''} intensity-${intensity}`}
                >
                    <div 
                        className="segment-fill" 
                        style={{ 
                            background: isFilled 
                                ? `linear-gradient(90deg, ${currentSpec.baseColor} 0%, ${currentSpec.activeColor} 50%, ${currentSpec.glowColor} 100%)`
                                : 'transparent',
                            boxShadow: isFilled 
                                ? `0 0 ${8 + i * 2}px ${currentSpec.glowColor}, inset 0 0 ${4 + i}px ${currentSpec.activeColor}`
                                : 'none'
                        }}
                    />
                    {isFilled && (
                        <div className="segment-flicker" style={{ 
                            background: `radial-gradient(circle, ${currentSpec.glowColor} 0%, transparent 70%)`,
                            animationDelay: `${i * 0.1}s`
                        }} />
                    )}
                </div>
            );
        }
        
        return segments;
    };

    return (
        <div className={`pyrofiend-resource-wrapper ${size} ${infernoLevel >= 9 ? 'catastrophic-warning' : ''}`}>
            {/* Main Resource Bar - CLICKABLE */}
            <div
                ref={barRef}
                className={`pyrofiend-resource-bar ${size} clickable intensity-${getVisualIntensity()}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isOwner) setShowControls(!showControls);
                }}
            >
                <div className="inferno-segments">
                    {renderInfernoSegments()}
                </div>

                {/* Numeric overlay â€” the level must be visible for the game's most dangerous resource */}
                <div className={`inferno-level-overlay ${infernoLevel >= 9 ? 'critical' : infernoLevel >= 7 ? 'danger' : ''}`}>
                    {infernoLevel}/{maxInfernoLevel}
                </div>


                {/* Heat distortion effect at high levels */}
                {infernoLevel >= 7 && (
                    <div className="heat-distortion" style={{
                        background: `radial-gradient(circle, ${currentSpec.glowColor}22 0%, transparent 70%)`
                    }} />
                )}
            </div>
            
            {/* Pathfinder-styled Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <div className="tooltip-header">Inferno Veil</div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Current Stage:</strong> {getStageName(infernoLevel)} (Level {infernoLevel})
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Fire Damage Bonus:</strong> +{infernoLevel}
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Current Drawback</div>
                        <div className="drawback-text">
                            {getDrawbackText(infernoLevel)}
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Level Management</div>
                        <div className="level-management">
                            <strong>Ascend:</strong>
                            <span>Cast fire spells (varies by spell)</span>
                            <strong>Descend:</strong>
                            <span>Cooling Ember (-2 levels, fixed), -1 per minute out of combat</span>
                        </div>
                    </div>

                    {infernoLevel >= 5 && (
                        <>
                            <div className="tooltip-divider"></div>

                            <div className="tooltip-section">
                                <div className="tooltip-label">Infernal Surge (Shared)</div>
                                <div className="passive-desc">
                                    At Inferno Level 5+: Your next fire spell deals +2d6 fire damage.
                                </div>
                            </div>
                        </>
                    )}
                </div>,
                document.body
            )}
            
            {/* Dev Controls */}
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

                            {/* Current state summary â€” descriptive, not just a number */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '6px', lineHeight: 1.35 }}>
                                <div><strong>Stage:</strong> {getStageName(infernoLevel)} <span style={{ color: '#8b5a2b' }}>(Level {infernoLevel}/{maxInfernoLevel})</span></div>
                                <div><strong>Fire bonus:</strong> +{infernoLevel} damage per die</div>
                                <div style={{ color: infernoLevel >= 5 ? '#B22222' : '#5a4628' }}>
                                    <strong>Drawback:</strong> {getDrawbackText(infernoLevel)}
                                </div>
                                {infernoLevel >= 5 && (
                                    <div style={{ color: '#8B0000', fontStyle: 'italic', marginTop: '2px' }}>
                                        Infernal Surge active â€” Demonic Whisper Spirit saves begin at Level 5.
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

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(0)} title="Mortal â€” reset">
                                    0
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(3)} title="Scorch">
                                    3
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(5)} title="Inferno â€” Surge begins">
                                    5
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(7)} title="Cataclysm">
                                    7
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(9)} title="Oblivion â€” death clock">
                                    9
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <button className="context-menu-button" onClick={() => handleInfernoChange(-1)} title="Descend (Cooling Ember)">
                                    <i className="fas fa-minus-circle"></i>
                                    -1
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoChange(1)} title="Ascend">
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

