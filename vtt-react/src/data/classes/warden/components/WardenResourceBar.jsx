import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/WardenResourceBar.css';

const WardenResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud' }) => {
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
            uniquePassiveDesc: 'Stealth attacks: +1 VP (total 3 VP), +1d8 damage, hide as bonus action. After spending 3+ VP: invisible for 1 round.'
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

    const handleSpecChange = (spec) => {
        setSelectedSpec(spec);
    };

    const handleVPChange = (delta) => {
        setLocalVP(prev => Math.max(0, Math.min(maxVP, prev + delta)));
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
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowControls(!showControls)}
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

            {/* Warden Menu - Pathfinder Beige Style */}
            {showControls && (
                <div className="warden-menu" onClick={(e) => e.stopPropagation()}>
                    <div className="menu-header">
                        <div className="menu-title">Adjust Vengeance Points</div>
                    </div>
                    <div className="menu-buttons">
                        <div className="button-row">
                            <button onClick={() => { handleVPChange(1); setShowControls(false); }}>
                                +1 <span className="button-desc">Attack</span>
                            </button>
                            <button onClick={() => { if (isMarked) handleVPChange(2); setShowControls(false); }}>
                                +2 <span className="button-desc">Marked</span>
                            </button>
                            <button onClick={() => { handleVPChange(-1); setShowControls(false); }}>
                                -1 <span className="button-desc">Strike</span>
                            </button>
                        </div>
                        <div className="button-row">
                            <button onClick={() => { handleVPChange(-2); setShowControls(false); }}>
                                -2 <span className="button-desc">Whirl</span>
                            </button>
                            <button onClick={() => { handleVPChange(-3); setShowControls(false); }}>
                                -3 <span className="button-desc">Resolve</span>
                            </button>
                            <button onClick={() => { handleVPChange(selectedSpec === 'jailer' ? -3 : -5); setShowControls(false); }}>
                                {selectedSpec === 'jailer' ? '-3' : '-5'} <span className="button-desc">Cage</span>
                            </button>
                        </div>
                        <div className="button-row">
                            <button onClick={() => { setLocalVP(0); setShowControls(false); }}>
                                0 <span className="button-desc">Reset</span>
                            </button>
                            <button onClick={() => { setLocalVP(maxVP); setShowControls(false); }}>
                                {maxVP} <span className="button-desc">Max</span>
                            </button>
                            <button className="menu-reset" onClick={() => setShowControls(false)}>
                                ✕
                            </button>
                        </div>
                    </div>
                    <div className="menu-divider"></div>
                    
                    {/* Shadowblade State Controls */}
                    {selectedSpec === 'shadowblade' && (
                        <div className="menu-section">
                            <div className="section-label">Shadowblade State</div>
                            <div className="button-row">
                                <button 
                                    className={isInStealth ? 'active' : ''}
                                    onClick={() => setIsInStealth(!isInStealth)}
                                >
                                    {isInStealth ? '✓' : ''} Stealth Mode
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Jailer State Controls */}
                    {selectedSpec === 'jailer' && (
                        <div className="menu-section">
                            <div className="section-label">Active Cages: {activeCages}/2</div>
                            <div className="button-row">
                                <button onClick={() => setActiveCages(Math.max(0, activeCages - 1))}>-1</button>
                                <button onClick={() => setActiveCages(0)}>Clear</button>
                                <button onClick={() => setActiveCages(2)}>Max</button>
                                <button onClick={() => setActiveCages(Math.min(2, activeCages + 1))}>+1</button>
                            </div>
                        </div>
                    )}

                    {/* Vengeance Seeker State Controls */}
                    {selectedSpec === 'vengeanceSeeker' && (
                        <div className="menu-section">
                            <div className="section-label">Vengeance Seeker State</div>
                            <div className="button-row">
                                <button 
                                    className={isInAvatar ? 'active' : ''}
                                    onClick={() => setIsInAvatar(!isInAvatar)}
                                >
                                    {isInAvatar ? '✓' : ''} Avatar
                                </button>
                                <button 
                                    className={isMarked ? 'active' : ''}
                                    onClick={() => setIsMarked(!isMarked)}
                                >
                                    {isMarked ? '✓' : ''} Marked
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="menu-section">
                        <div className="section-label">Quick Actions</div>
                        <div className="button-row">
                            <button onClick={() => { handleVPChange(-10); setIsInAvatar(true); setShowControls(false); }}>
                                Avatar <span className="button-desc">-10 VP</span>
                            </button>
                        </div>
                    </div>

                    <div className="menu-divider"></div>
                    <div className="spec-buttons">
                        {Object.entries(specConfigs).map(([key, spec]) => (
                            <button
                                key={key}
                                className={`spec-button ${selectedSpec === key ? 'active' : ''}`}
                                onClick={() => handleSpecChange(key)}
                            >
                                <i className={`fas ${spec.icon}`}></i> {spec.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Simplified Tooltip */}
            {showTooltip && ReactDOM.createPortal(
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

