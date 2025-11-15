import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/SpellguardResourceBar.css';

const SpellguardResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud' }) => {
    const [localAEP, setLocalAEP] = useState(45);
    const [selectedSpec, setSelectedSpec] = useState('arcaneWarden');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isAbsorbing, setIsAbsorbing] = useState(false);
    const [isSpending, setIsSpending] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, placement: 'top' });

    const maxAEP = 100;

    // Specialization configurations
    const specConfigs = {
        arcaneWarden: {
            name: 'Arcane Warden',
            baseColor: '#1E3A8A',
            activeColor: '#4169E1',
            glowColor: '#6495ED',
            icon: 'fa-shield',
            passive: 'Arcane Fortitude',
            passiveDesc: 'Gain 1.5x AEP from magical damage (3 per damage). While shielded: +2 AC, +10% all resistances.'
        },
        spellBreaker: {
            name: 'Spell Breaker',
            baseColor: '#4C1D95',
            activeColor: '#9370DB',
            glowColor: '#BA55D3',
            icon: 'fa-bolt',
            passive: 'Spell Reflection Mastery',
            passiveDesc: 'Successful reflections grant +5 AEP. Reflected spells deal +25% damage. Reflection cooldowns reduced by 1 turn.'
        },
        manaReaver: {
            name: 'Mana Reaver',
            baseColor: '#581C87',
            activeColor: '#8B008B',
            glowColor: '#9932CC',
            icon: 'fa-skull',
            passive: 'Mana Vampirism',
            passiveDesc: 'Melee attacks drain 2x mana. Per 10 mana drained: +1d6 arcane damage (stacks 5x). Offensive abilities cost -5 AEP.'
        }
    };

    const currentSpec = specConfigs[selectedSpec];

    // Calculate visual intensity based on AEP level
    const getVisualIntensity = () => {
        if (localAEP === 0) return 'empty';
        if (localAEP <= 15) return 'low';
        if (localAEP <= 40) return 'building';
        if (localAEP <= 75) return 'optimal';
        return 'maximum';
    };

    const visualIntensity = getVisualIntensity();
    const percentage = (localAEP / maxAEP) * 100;

    // Auto-adjust tooltip position
    useEffect(() => {
        if (showTooltip && barRef.current && tooltipRef.current) {
            const barRect = barRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = barRect.top - tooltipRect.height - 10;
            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            let placement = 'top';

            // Check if tooltip goes off top of screen
            if (top < 10) {
                top = barRect.bottom + 10;
                placement = 'bottom';
            }

            // Check if tooltip goes off right side
            if (left + tooltipRect.width > viewportWidth - 10) {
                left = viewportWidth - tooltipRect.width - 10;
            }

            // Check if tooltip goes off left side
            if (left < 10) {
                left = 10;
            }

            setTooltipPosition({ top, left, placement });
        }
    }, [showTooltip, localAEP, selectedSpec]);

    // Simulate absorption effect
    const simulateAbsorption = () => {
        setIsAbsorbing(true);
        setTimeout(() => setIsAbsorbing(false), 800);
    };

    // Simulate spending effect
    const simulateSpending = () => {
        setIsSpending(true);
        setTimeout(() => setIsSpending(false), 600);
    };

    const adjustAEP = (amount) => {
        const newAEP = Math.max(0, Math.min(maxAEP, localAEP + amount));
        setLocalAEP(newAEP);
        
        if (amount > 0) {
            simulateAbsorption();
        } else if (amount < 0) {
            simulateSpending();
        }
    };

    // Cycle through specializations
    const cycleSpec = () => {
        const specs = Object.keys(specConfigs);
        const currentIndex = specs.indexOf(selectedSpec);
        const nextIndex = (currentIndex + 1) % specs.length;
        setSelectedSpec(specs[nextIndex]);
    };

    return (
        <div className="spellguard-resource-container">
            {/* Main Bar Row */}
            <div className="resource-bar-row">
                {/* Main Resource Bar */}
                <div
                    ref={barRef}
                    className={`spellguard-resource-bar ${size} ${visualIntensity} ${isAbsorbing ? 'absorbing' : ''} ${isSpending ? 'spending' : ''} clickable`}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowControls(!showControls)}
                    style={{
                        '--spec-base-color': currentSpec.baseColor,
                        '--spec-active-color': currentSpec.activeColor,
                        '--spec-glow-color': currentSpec.glowColor
                    }}
                >
                {/* Background arcane pattern */}
                <div className="arcane-background"></div>

                {/* Flowing runes overlay */}
                <div className="runes-overlay">
                    <div className="rune">◈</div>
                    <div className="rune">◇</div>
                    <div className="rune">◆</div>
                    <div className="rune">◈</div>
                </div>

                {/* AEP fill bar */}
                <div 
                    className="aep-fill"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="energy-particles"></div>
                </div>

                {/* Spec-specific overlay effects */}
                {selectedSpec === 'arcaneWarden' && localAEP > 40 && (
                    <div className="shield-overlay"></div>
                )}
                {selectedSpec === 'spellBreaker' && localAEP > 40 && (
                    <div className="mirror-pulse"></div>
                )}
                {selectedSpec === 'manaReaver' && localAEP > 40 && (
                    <div className="siphon-tendrils"></div>
                )}

                {/* AEP display */}
                <div className="aep-display">
                    <span className="aep-current">{localAEP}</span>
                    <span className="aep-separator">/</span>
                    <span className="aep-max">{maxAEP}</span>
                    <span className="aep-label">AEP</span>
                </div>
                </div>
            </div>

            {/* Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className={`spellguard-tooltip ${tooltipPosition.placement}`}
                    style={{
                        position: 'fixed',
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                        zIndex: 100000
                    }}
                >
                    <div className="tooltip-header">
                        AEP: {localAEP}/{maxAEP}
                    </div>
                    
                    <div className="tooltip-compact-grid">
                        <div className="tooltip-compact-item">
                            <span className="tooltip-compact-label">Status:</span>
                            <span className="tooltip-compact-value">
                                {localAEP === 0 && 'Empty'}
                                {localAEP > 0 && localAEP <= 15 && 'Critical Low'}
                                {localAEP > 15 && localAEP <= 40 && 'Building'}
                                {localAEP > 40 && localAEP <= 75 && 'Optimal'}
                                {localAEP > 75 && 'Maximum'}
                            </span>
                        </div>
                        <div className="tooltip-compact-item">
                            <span className="tooltip-compact-label">Generate:</span>
                            <span className="tooltip-compact-value">Magical +2, Physical +1/2, Mana +1</span>
                        </div>
                        <div className="tooltip-compact-item spec-compact">
                            <span className="tooltip-compact-label">{currentSpec.name}:</span>
                            <span className="tooltip-compact-value">{currentSpec.passiveDesc}</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Dev Controls */}
            {showControls && (
                <div className="spellguard-dev-controls">
                    <div className="controls-header">
                        <span>Arcane Absorption</span>
                        <button onClick={() => setShowControls(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="control-group">
                        {/* Specialization Selection */}
                        <div className="spec-selector-group">
                            <label>Specialization:</label>
                            <button
                                className="spec-cycle-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cycleSpec();
                                }}
                                title={`Current: ${currentSpec.name}\nClick to cycle`}
                                style={{
                                    borderColor: currentSpec.activeColor,
                                    color: currentSpec.glowColor
                                }}
                            >
                                <i className={`fas ${currentSpec.icon}`}></i>
                                <span>{currentSpec.name}</span>
                            </button>
                        </div>
                        
                        <label>AEP Level: {localAEP}/{maxAEP}</label>
                        <div className="aep-info">
                            Absorb magical damage to generate AEP. Spend on shields, reflections, and strikes.
                        </div>
                        <div className="button-row">
                            <button onClick={() => setLocalAEP(0)}>0</button>
                            <button onClick={() => setLocalAEP(15)}>15</button>
                            <button onClick={() => setLocalAEP(40)}>40</button>
                            <button onClick={() => setLocalAEP(75)}>75</button>
                            <button onClick={() => setLocalAEP(100)}>100</button>
                        </div>
                        <div className="button-row">
                            <button onClick={() => adjustAEP(-10)}>-10</button>
                            <button onClick={() => adjustAEP(-5)}>-5</button>
                            <button onClick={() => adjustAEP(5)}>+5</button>
                            <button onClick={() => adjustAEP(10)}>+10</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpellguardResourceBar;

