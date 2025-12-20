import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/PyrofiendResourceBar.css';

const PyrofiendResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', onClassResourceUpdate = null }) => {
    // Read inferno level from classResource prop, default to 0 if not available
    const infernoLevel = classResource?.current ?? 0;
    const maxInfernoLevel = classResource?.max ?? 9;
    
    const [selectedSpec, setSelectedSpec] = useState('inferno');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showSpecSelector, setShowSpecSelector] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);
    const controlsMenuRef = useRef(null);

    const specConfigs = {
        inferno: { 
            name: 'Inferno', 
            baseColor: '#8B0000',
            activeColor: '#FF4500',
            glowColor: '#FF6347',
            icon: 'fa-fire-flame-curved',
            passive: 'Burning Ambition',
            passiveDesc: 'At Inferno Level 7+: Fire spells crit on the 2 highest die numbers instead of just the highest, and crits deal +1d10 fire damage.'
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
        hellfire: { 
            name: 'Hellfire', 
            baseColor: '#4B0000',
            activeColor: '#8B0000',
            glowColor: '#B22222',
            icon: 'fa-skull-crossbones',
            passive: 'Demonic Vitality',
            passiveDesc: 'Heal for 25% of fire damage dealt. When descending Inferno Levels, gain 3 temp HP per level descended.'
        }
    };

    const currentSpec = specConfigs[selectedSpec];

    // Auto-adjust tooltip position
    useEffect(() => {
        if (showTooltip && tooltipRef.current && barRef.current) {
            const updatePosition = () => {
                const tooltip = tooltipRef.current;
                const bar = barRef.current;
                if (!tooltip || !bar) return;
                
                const barRect = bar.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                // Check if tooltip has valid dimensions (not 0x0)
                if (tooltipRect.width === 0 || tooltipRect.height === 0) {
                    // Try again on next frame if dimensions aren't ready
                    requestAnimationFrame(updatePosition);
                    return;
                }
                
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const margin = 8;
                
                // Find the HUD container to position tooltip below it
                let hudContainer = bar.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                let hudBottom = barRect.bottom;
                
                if (hudContainer) {
                    const hudRect = hudContainer.getBoundingClientRect();
                    hudBottom = hudRect.bottom;
                }
                
                // Position tooltip below the HUD container, centered horizontally
                let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
                let top = hudBottom + margin;
                
                // Adjust horizontal position
                if (left < margin) left = margin;
                if (left + tooltipRect.width > viewportWidth - margin) {
                    left = viewportWidth - tooltipRect.width - margin;
                }
                
                // Ensure tooltip doesn't go off bottom of viewport
                if (top + tooltipRect.height > viewportHeight - margin) {
                    // If there's not enough space below, position above the HUD instead
                    if (hudContainer) {
                        const hudRect = hudContainer.getBoundingClientRect();
                        top = hudRect.top - tooltipRect.height - margin;
                    } else {
                        top = barRect.top - tooltipRect.height - margin;
                    }
                    // But ensure it doesn't go off top either
                    if (top < margin) {
                        top = margin;
                    }
                }
                
                // Apply position directly to tooltip element
                tooltip.style.position = 'fixed';
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.transform = 'none';
                tooltip.style.zIndex = '2147483647';
            };
            
            // Run immediately and on multiple frames to ensure dimensions are available
            updatePosition();
            requestAnimationFrame(() => {
                requestAnimationFrame(updatePosition);
            });
            
            // Also add a small timeout as fallback for portal rendering
            const timeoutId = setTimeout(updatePosition, 50);
            
            return () => clearTimeout(timeoutId);
        }
    }, [showTooltip, infernoLevel, selectedSpec]);

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
            1: '-2 hit chance (visual distortions)',
            2: '1d4 psychic/turn (lustful intensity)',
            3: '-10 ft speed, constant fatigue',
            4: '+2d6 damage taken from all attacks',
            5: '1d6 bleeding/turn, weakened defenses',
            6: 'Disadvantage on sight-based checks',
            7: '2d6 fire/turn to self (uncontrollable flames)',
            8: '1d8 necrotic/turn, -2 all saves',
            9: '3d6 fire/turn, allies within 10 ft take 1d6 fire/turn'
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
        <div className={`pyrofiend-resource-wrapper ${size}`}>
            {/* Spec Selector Dropdown */}
            {showSpecSelector && (
                <div className="spec-selector-dropdown">
                    {Object.entries(specConfigs).map(([key, spec]) => (
                        <div 
                            key={key} 
                            className={`spec-option ${selectedSpec === key ? 'selected' : ''}`} 
                            onClick={() => handleSpecChange(key)}
                        >
                            <i className={`fas ${spec.icon}`} style={{ color: spec.glowColor }}></i>
                            <span>{spec.name}</span>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Main Resource Bar - CLICKABLE */}
            <div
                ref={barRef}
                className={`pyrofiend-resource-bar ${size} clickable intensity-${getVisualIntensity()}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent event from bubbling to document
                    setShowControls(!showControls);
                }}
            >
                <div className="inferno-segments">
                    {renderInfernoSegments()}
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
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip">
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
                            <span>Cooling Ember (1d4 levels), -1 per minute out of combat</span>
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

                    {((selectedSpec === 'inferno' && infernoLevel >= 7) ||
                      (selectedSpec === 'wildfire') ||
                      (selectedSpec === 'hellfire')) && (
                        <>
                            <div className="tooltip-divider"></div>

                            <div className="tooltip-section">
                                <div className="tooltip-label">{currentSpec.passive} ({currentSpec.name})</div>
                                <div className="passive-desc">
                                    {currentSpec.passiveDesc}
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
                    className="unified-context-menu compact"
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

                            <div className="context-menu-section-header" style={{fontSize: '12px', marginTop: '12px', marginBottom: '8px'}}>
                                Inferno Level: {infernoLevel}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(0)}>
                                    0
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(3)}>
                                    3
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(5)}>
                                    5
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(7)}>
                                    7
                                </button>
                                <button className="context-menu-button" onClick={() => handleInfernoSet(9)}>
                                    9
                                </button>
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

                            <div className="context-menu-section-header" style={{fontSize: '12px', marginTop: '12px', marginBottom: '8px'}}>
                                Specialization
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
                                {Object.entries(specConfigs).map(([key, spec]) => (
                                    <button
                                        key={key}
                                        className={`context-menu-button ${selectedSpec === key ? 'active' : ''}`}
                                        onClick={() => setSelectedSpec(key)}
                                    >
                                        <i className={`fas ${spec.icon}`}></i> {spec.name}
                                    </button>
                                ))}
                            </div>

                            <div className="context-menu-separator" style={{margin: '12px 0'}}></div>

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

