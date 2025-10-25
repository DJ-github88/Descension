import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/PyrofiendResourceBar.css';

const PyrofiendResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud' }) => {
    const [localInfernoLevel, setLocalInfernoLevel] = useState(5);
    const [selectedSpec, setSelectedSpec] = useState('inferno');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showSpecSelector, setShowSpecSelector] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);

    const maxInfernoLevel = 9;

    const specConfigs = {
        inferno: { 
            name: 'Inferno', 
            baseColor: '#8B0000',
            activeColor: '#FF4500',
            glowColor: '#FF6347',
            icon: 'fa-fire-flame-curved',
            passive: 'Burning Ambition',
            passiveDesc: 'At Inferno Level 7+: +10% crit chance with fire spells, crits deal +1d10 fire damage.'
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
    }, [showTooltip, localInfernoLevel, selectedSpec]);

    const handleSpecChange = (spec) => {
        setSelectedSpec(spec);
        setShowSpecSelector(false);
    };

    const handleInfernoChange = (delta) => {
        setLocalInfernoLevel(prev => Math.max(0, Math.min(maxInfernoLevel, prev + delta)));
    };

    // Get visual intensity based on inferno level
    const getVisualIntensity = () => {
        if (localInfernoLevel === 0) return 'dormant';
        if (localInfernoLevel <= 2) return 'ember';
        if (localInfernoLevel <= 4) return 'controlled';
        if (localInfernoLevel <= 6) return 'intense';
        if (localInfernoLevel <= 8) return 'blazing';
        return 'catastrophic';
    };

    // Get drawback text for current level
    const getDrawbackText = (level) => {
        const drawbacks = {
            0: 'None',
            1: '-2 hit chance (visual distortions)',
            2: '1d4 psychic/turn (lustful intensity)',
            3: '-10 ft speed, constant fatigue',
            4: '+2d6 damage taken from all attacks',
            5: '1d6 bleeding/turn, -4 AC',
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
            const isFilled = localInfernoLevel >= i;
            const isCatastrophic = i === 9 && localInfernoLevel === 9;
            
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
            {/* Spec Selector Icon */}
            <div className="spec-selector-icon" onClick={() => setShowSpecSelector(!showSpecSelector)}>
                <i className={`fas ${currentSpec.icon}`} style={{ color: currentSpec.glowColor }}></i>
            </div>
            
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
                onClick={() => setShowControls(!showControls)}
            >
                <div className="inferno-segments">
                    {renderInfernoSegments()}
                </div>

                <div className="inferno-overlay">
                    <div className="inferno-level-display">
                        <span className="level-label">Inferno</span>
                        <span className="level-number" style={{ color: currentSpec.glowColor }}>
                            {localInfernoLevel}
                        </span>
                    </div>
                </div>

                {/* Heat distortion effect at high levels */}
                {localInfernoLevel >= 7 && (
                    <div className="heat-distortion" style={{
                        background: `radial-gradient(circle, ${currentSpec.glowColor}22 0%, transparent 70%)`
                    }} />
                )}
            </div>
            
            {/* Pathfinder-styled Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="pyrofiend-tooltip pathfinder-tooltip">
                    <div className="tooltip-header">Inferno Veil</div>
                    
                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Current Level:</strong> {localInfernoLevel}/{maxInfernoLevel}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Fire Damage Bonus:</strong> +{localInfernoLevel}
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">Current Drawback</div>
                        <div className="drawback-text">
                            {getDrawbackText(localInfernoLevel)}
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
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">Infernal Surge (Shared)</div>
                        <div className="passive-desc">
                            At Inferno Level 5+: Your next fire spell deals +2d6 fire damage.
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">{currentSpec.passive} ({currentSpec.name})</div>
                        <div className="passive-desc">
                            {currentSpec.passiveDesc}
                        </div>
                    </div>
                </div>,
                document.body
            )}
            
            {/* Dev Controls */}
            {showControls && (
                <div className="pyrofiend-dev-controls pathfinder-panel">
                    <div className="controls-header">
                        <span>Inferno Veil Controls</span>
                        <button className="close-btn" onClick={() => setShowControls(false)}>×</button>
                    </div>
                    
                    <div className="control-group">
                        <label>Inferno Level: {localInfernoLevel}</label>
                        <div className="level-buttons">
                            <button onClick={() => setLocalInfernoLevel(0)}>0</button>
                            <button onClick={() => setLocalInfernoLevel(3)}>3</button>
                            <button onClick={() => setLocalInfernoLevel(5)}>5</button>
                            <button onClick={() => setLocalInfernoLevel(7)}>7</button>
                            <button onClick={() => setLocalInfernoLevel(9)}>9</button>
                        </div>
                        <div className="increment-buttons">
                            <button onClick={() => handleInfernoChange(-1)}>-1</button>
                            <button onClick={() => handleInfernoChange(1)}>+1</button>
                        </div>
                    </div>
                    
                    <div className="control-group">
                        <label>Specialization</label>
                        <div className="spec-buttons">
                            {Object.entries(specConfigs).map(([key, spec]) => (
                                <button 
                                    key={key}
                                    className={selectedSpec === key ? 'active' : ''}
                                    onClick={() => setSelectedSpec(key)}
                                    style={{ 
                                        borderColor: selectedSpec === key ? spec.glowColor : 'transparent',
                                        color: spec.glowColor
                                    }}
                                >
                                    <i className={`fas ${spec.icon}`}></i> {spec.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PyrofiendResourceBar;

