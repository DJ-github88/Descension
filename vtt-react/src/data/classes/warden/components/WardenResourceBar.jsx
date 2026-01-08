import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/WardenResourceBar.css';

const WardenResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', onClassResourceUpdate = null }) => {
    // Local state for dev testing
    const [localVP, setLocalVP] = useState(7);
    const [selectedSpec, setSelectedSpec] = useState('shadowblade');
    const [isInStealth, setIsInStealth] = useState(false);
    const [activeCages, setActiveCages] = useState(0);
    const [isInAvatar, setIsInAvatar] = useState(false);
    const [isMarked, setIsMarked] = useState(true);
    
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);

    const maxVP = 10;

    // Specialization configurations
    const specConfigs = {
        shadowblade: {
            name: 'Shadowblade',
            baseColor: '#1a0a2e',
            activeColor: '#2E0854',
            glowColor: '#7B2CBF',
            icon: 'fa-user-ninja',
            sharedPassive: 'Relentless Hunter',
            sharedPassiveDesc: 'Advantage on Survival/Perception to track. Move at full speed while tracking.',
            uniquePassive: 'Shadow Strike + Umbral Veil',
            uniquePassiveDesc: 'Stealth attacks: +1 VP (total 3 VP), +1d8 damage, hide using action points. After spending 3+ VP: invisible for 1 round.'
        },
        jailer: {
            name: 'Jailer',
            baseColor: '#1f2937',
            activeColor: '#4A5568',
            glowColor: '#94A3B8',
            icon: 'fa-lock',
            sharedPassive: 'Relentless Hunter',
            sharedPassiveDesc: 'Advantage on Survival/Perception to track. Move at full speed while tracking.',
            uniquePassive: 'Master Jailer + Condemned',
            uniquePassiveDesc: 'Cages cost -2 VP (3 instead of 5). Maintain 2 cages simultaneously. Caged enemies take +1d6 damage from all sources (+2d6 if marked).'
        },
        vengeanceSeeker: {
            name: 'Vengeance Seeker',
            baseColor: '#450a0a',
            activeColor: '#8B0000',
            glowColor: '#DC2626',
            icon: 'fa-crosshairs',
            sharedPassive: 'Relentless Hunter',
            sharedPassiveDesc: 'Advantage on Survival/Perception to track. Move at full speed while tracking.',
            uniquePassive: 'Inexorable Pursuit + Endless Vengeance',
            uniquePassiveDesc: 'Marked targets cannot hide/go invisible. Free dash to marked targets. Avatar lasts +2 rounds (6 total). Avatar attacks on marked: +1 VP (total 3 VP).'
        }
    };

    const currentSpec = specConfigs[selectedSpec];

    // Auto-adjust tooltip position
    useEffect(() => {
        if (showTooltip && tooltipRef.current && barRef.current) {
            const tooltip = tooltipRef.current;
            const bar = barRef.current;
            const barRect = bar.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            let top = barRect.top - tooltipRect.height - 8;
            
            // Adjust horizontal position
            if (left < 8) left = 8;
            if (left + tooltipRect.width > viewportWidth - 8) {
                left = viewportWidth - tooltipRect.width - 8;
            }
            
            // Adjust vertical position (flip to bottom if needed)
            if (top < 8) {
                top = barRect.bottom + 8;
            }
            
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }
    }, [showTooltip, localVP, selectedSpec, isInStealth, activeCages, isInAvatar]);

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
    };

    const handleVPChange = (delta) => {
        setLocalVP(prev => {
            const newValue = Math.max(0, Math.min(maxVP, prev + delta));
            const actualAmount = Math.abs(newValue - prev);
            if (actualAmount > 0) {
                logClassResourceChange('Vengeance Point', actualAmount, delta > 0, 'vengeancePoints');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
            return newValue;
        });
    };

    // Get visual state based on spec and conditions
    const getVisualState = () => {
        if (selectedSpec === 'shadowblade' && isInStealth) return 'stealth';
        if (selectedSpec === 'jailer' && activeCages > 0) return 'caged';
        if (selectedSpec === 'vengeanceSeeker' && isInAvatar) return 'avatar';
        if (localVP === maxVP) return 'max';
        return 'normal';
    };

    const visualState = getVisualState();
    const percentage = (localVP / maxVP) * 100;

    // Render VP segments (10 segments for 0-10 VP)
    const renderVPSegments = () => {
        const segments = [];
        
        for (let i = 1; i <= maxVP; i++) {
            const isFilled = localVP >= i;
            const isMaxSegment = i === maxVP && localVP === maxVP;
            
            segments.push(
                <div 
                    key={i} 
                    className={`vp-segment ${isFilled ? 'filled' : ''} ${isMaxSegment ? 'max-flare' : ''} state-${visualState}`}
                >
                    <div 
                        className="segment-fill" 
                        style={{ 
                            background: isFilled 
                                ? `linear-gradient(90deg, ${currentSpec.baseColor} 0%, ${currentSpec.activeColor} 50%, ${currentSpec.glowColor} 100%)`
                                : 'transparent',
                            boxShadow: isFilled 
                                ? `0 0 ${6 + i}px ${currentSpec.glowColor}, inset 0 0 ${3 + i}px ${currentSpec.activeColor}`
                                : 'none'
                        }}
                    />
                    {isFilled && (
                        <div className="segment-energy" style={{ 
                            background: `radial-gradient(circle, ${currentSpec.glowColor} 0%, transparent 70%)`,
                            animationDelay: `${i * 0.08}s`
                        }} />
                    )}
                </div>
            );
        }
        
        return segments;
    };

    // Get VP generation info
    const getVPGenerationInfo = () => {
        const info = [];
        info.push('Successful attack: +1 VP');
        info.push('Evasion: +1 VP');
        info.push('Critical hit: +1 VP');
        
        if (isMarked) {
            info.push('Attack on marked target: +2 VP');
        }
        
        if (selectedSpec === 'shadowblade') {
            info.push('Stealth attack: +3 VP (Shadow Strike)');
        }
        
        if (selectedSpec === 'vengeanceSeeker' && isInAvatar) {
            info.push('Avatar attack on marked: +3 VP');
        }
        
        return info;
    };

    // Get VP spending info
    const getVPSpendingInfo = () => {
        const info = [];
        info.push('1 VP: Vengeful Strike (+1d6 damage)');
        info.push('2 VP: Whirling Glaive (multi-target)');
        info.push("3 VP: Hunter's Resolve (heal + Armor)");
        
        if (selectedSpec === 'jailer') {
            info.push('3 VP: Cage of Vengeance (Master Jailer)');
        } else {
            info.push('5 VP: Cage of Vengeance');
        }
        
        info.push('10 VP: Avatar of Vengeance (ultimate)');
        
        return info;
    };

    return (
        <div className={`warden-resource-container ${size}`}>
            {/* Main Resource Bar */}
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    className={`warden-resource-bar ${size} state-${visualState} clickable`}
                onMouseEnter={() => { if (!showControls) setShowTooltip(true); }}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => {
                    setShowControls(!showControls);
                    if (showControls) setShowTooltip(false);
                }}
                    style={{
                        '--spec-base-color': currentSpec.baseColor,
                        '--spec-active-color': currentSpec.activeColor,
                        '--spec-glow-color': currentSpec.glowColor
                    }}
                >
                    {/* Spectral background pattern */}
                    <div className="spectral-background"></div>

                    {/* Vengeance energy overlay */}
                    <div className="vengeance-energy">
                        <div className="energy-particle"></div>
                        <div className="energy-particle"></div>
                        <div className="energy-particle"></div>
                    </div>

                    {/* VP segments */}
                    <div className="vp-segments">
                        {renderVPSegments()}
                    </div>

                    {/* VP counter overlay */}
                    <div className="vp-counter">
                        <span className="vp-number" style={{ color: currentSpec.glowColor }}>
                            {localVP}
                        </span>
                        <span className="vp-max">/{maxVP}</span>
                    </div>

                    {/* Spec-specific visual effects */}
                    {selectedSpec === 'shadowblade' && isInStealth && (
                        <div className="shadow-veil"></div>
                    )}
                    {selectedSpec === 'jailer' && activeCages > 0 && (
                        <div className="spectral-chains">
                            {Array.from({ length: activeCages }, (_, i) => (
                                <div key={i} className="chain-rune" style={{ animationDelay: `${i * 0.3}s` }}>⛓</div>
                            ))}
                        </div>
                    )}
                    {selectedSpec === 'vengeanceSeeker' && isInAvatar && (
                        <div className="avatar-aura"></div>
                    )}
                </div>
            </div>

            {/* Warden Menu - Compact Unified Style */}
            {showControls && barRef.current && ReactDOM.createPortal(
                <div
                    className={`unified-context-menu compact warden-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'fixed',
                        top: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            let hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                            let hudBottom = rect.bottom;
                            if (hudContainer) {
                                const hudRect = hudContainer.getBoundingClientRect();
                                hudBottom = hudRect.bottom;
                            }
                            return hudBottom + 8;
                        })(),
                        left: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            return rect.left + (rect.width / 2);
                        })(),
                        transform: 'translateX(-50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">VP: {localVP}/{maxVP}</div>

                            {/* Gain Section */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button 
                                    className="context-menu-button gain" 
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(1); }}
                                >
                                    <i className="fas fa-plus"></i> +1
                                </button>
                                <button 
                                    className="context-menu-button gain" 
                                    onClick={(e) => { e.stopPropagation(); if (isMarked) handleVPChange(2); }}
                                >
                                    <i className="fas fa-plus-circle"></i> +2
                                </button>
                            </div>

                            {/* Spend Section */}
                            <div className="context-menu-section-header" style={{fontSize: '12px', marginTop: '12px', marginBottom: '8px'}}>Spend</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button 
                                    className="context-menu-button spend" 
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(-1); }}
                                >
                                    <i className="fas fa-minus"></i> -1
                                </button>
                                <button 
                                    className="context-menu-button spend" 
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(-2); }}
                                >
                                    <i className="fas fa-minus"></i> -2
                                </button>
                                <button 
                                    className="context-menu-button spend" 
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(-3); }}
                                >
                                    <i className="fas fa-minus"></i> -3
                                </button>
                                <button 
                                    className="context-menu-button spend" 
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(selectedSpec === 'jailer' ? -3 : -5); }}
                                >
                                    <i className="fas fa-minus"></i> {selectedSpec === 'jailer' ? '-3' : '-5'}
                                </button>
                            </div>

                            {/* Shadowblade State */}
                            {selectedSpec === 'shadowblade' && (
                                <>
                                    <div className="context-menu-section-header" style={{fontSize: '12px', marginTop: '12px', marginBottom: '8px'}}>Shadowblade</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                        <button 
                                            className={`context-menu-button ${isInStealth ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setIsInStealth(!isInStealth); }}
                                        >
                                            <i className={`fas ${isInStealth ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                            Stealth
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Jailer State */}
                            {selectedSpec === 'jailer' && (
                                <>
                                    <div className="context-menu-section-header" style={{fontSize: '12px', marginTop: '12px', marginBottom: '8px'}}>Cages: {activeCages}/2</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                        <button 
                                            className="context-menu-button spend" 
                                            onClick={(e) => { e.stopPropagation(); setActiveCages(Math.max(0, activeCages - 1)); }}
                                        >
                                            <i className="fas fa-minus"></i> -1
                                        </button>
                                        <button 
                                            className="context-menu-button" 
                                            onClick={(e) => { e.stopPropagation(); setActiveCages(0); }}
                                        >
                                            Clear
                                        </button>
                                        <button 
                                            className="context-menu-button gain" 
                                            onClick={(e) => { e.stopPropagation(); setActiveCages(2); }}
                                        >
                                            Max
                                        </button>
                                        <button 
                                            className="context-menu-button gain" 
                                            onClick={(e) => { e.stopPropagation(); setActiveCages(Math.min(2, activeCages + 1)); }}
                                        >
                                            <i className="fas fa-plus"></i> +1
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Vengeance Seeker State */}
                            {selectedSpec === 'vengeanceSeeker' && (
                                <>
                                    <div className="context-menu-section-header" style={{fontSize: '12px', marginTop: '12px', marginBottom: '8px'}}>Vengeance Seeker</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                        <button 
                                            className={`context-menu-button ${isInAvatar ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setIsInAvatar(!isInAvatar); }}
                                        >
                                            <i className={`fas ${isInAvatar ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                            Avatar
                                        </button>
                                        <button 
                                            className={`context-menu-button ${isMarked ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setIsMarked(!isMarked); }}
                                        >
                                            <i className={`fas ${isMarked ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                            Marked
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Specialization */}
                            <div className="context-menu-section-header" style={{fontSize: '12px', marginTop: '12px', marginBottom: '8px'}}>Specialization</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px', marginBottom: '8px' }}>
                                {Object.entries(specConfigs).map(([key, spec]) => (
                                    <button
                                        key={key}
                                        className={`context-menu-button ${selectedSpec === key ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); handleSpecChange(key); }}
                                    >
                                        <i className={`fas ${spec.icon}`}></i> {spec.name}
                                    </button>
                                ))}
                            </div>

                            <div className="context-menu-separator" style={{margin: '12px 0'}}></div>

                            {/* Quick Actions */}
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button 
                                    className="context-menu-button danger" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const resetAmount = localVP;
                                        handleVPChange(-10);
                                        setIsInAvatar(true);
                                        setShowControls(false);
                                    }}
                                    style={{flex: 1}}
                                >
                                    <i className="fas fa-star"></i> Avatar
                                </button>
                                <button 
                                    className="context-menu-button" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const resetAmount = localVP;
                                        setLocalVP(0);
                                        setShowControls(false);
                                        if (resetAmount > 0) {
                                            logClassResourceChange('Vengeance Point', resetAmount, false, 'vengeancePoints');
                                            if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                        }
                                    }}
                                    style={{flex: 1}}
                                >
                                    <i className="fas fa-undo"></i> Reset
                                </button>
                                <button 
                                    className="context-menu-button" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const gainAmount = maxVP - localVP;
                                        setLocalVP(maxVP);
                                        setShowControls(false);
                                        if (gainAmount > 0) {
                                            logClassResourceChange('Vengeance Point', gainAmount, true, 'vengeancePoints');
                                            if (onClassResourceUpdate) onClassResourceUpdate('current', maxVP);
                                        }
                                    }}
                                    style={{flex: 1}}
                                >
                                    <i className="fas fa-arrow-up"></i> Max
                                </button>
                                <button 
                                    className="context-menu-button" 
                                    onClick={(e) => { e.stopPropagation(); setShowControls(false); }}
                                    style={{flex: 1}}
                                >
                                    <i className="fas fa-times"></i> Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Simplified Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip">
                    <div className="tooltip-title">Vengeance Points: {localVP}/{maxVP}</div>
                    <div className="tooltip-spec">{currentSpec.name}</div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <strong>Generation:</strong> Attack +1 VP, Marked +2 VP, Evasion +1 VP, Crit +1 VP
                    </div>

                    <div className="tooltip-section">
                        <strong>Spending:</strong> 1 VP (+1d6 dmg) • 2 VP (multi-target) • 3 VP (heal+Armor) • {selectedSpec === 'jailer' ? '3' : '5'} VP (cage) • 10 VP (Avatar)
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <strong>Shared:</strong> {currentSpec.sharedPassiveDesc}
                    </div>

                    <div className="tooltip-section">
                        <strong>Unique:</strong> {currentSpec.uniquePassiveDesc}
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};

export default WardenResourceBar;

