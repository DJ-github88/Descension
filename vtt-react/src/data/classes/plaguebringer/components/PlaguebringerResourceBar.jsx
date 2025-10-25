import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/PlaguebringerResourceBar.css';

const PlaguebringerResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud' }) => {
    const [localCorruption, setLocalCorruption] = useState(65);
    const [localAfflictions, setLocalAfflictions] = useState(4);
    const [selectedSpec, setSelectedSpec] = useState('virulentSpreader');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showSpecSelector, setShowSpecSelector] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);

    const specConfigs = {
        virulentSpreader: { 
            name: 'Virulent Spreader', 
            color: '#556B2F', 
            glow: '#9ACD32', 
            icon: 'fa-virus', 
            passive: 'Epidemic Mastery', 
            passiveDesc: 'Fester/Infect spells +10 ft range. Spread afflictions retain 2/3 development steps.' 
        },
        tormentWeaver: { 
            name: 'Torment Weaver', 
            color: '#4B0082', 
            glow: '#9370DB', 
            icon: 'fa-brain', 
            passive: 'Psychic Resonance', 
            passiveDesc: 'Torment spells +1d6 damage. Psychic afflictions: 5-6 on 1d6 causes target to attack nearest ally.' 
        },
        decayHarbinger: { 
            name: 'Decay Harbinger', 
            color: '#2F4F2F', 
            glow: '#556B2F', 
            icon: 'fa-skull', 
            passive: 'Accelerated Decay', 
            passiveDesc: 'Decay spells reduce max HP by +1d6. Afflictions reduce healing by 1d8 per heal received.' 
        }
    };

    const currentSpec = specConfigs[selectedSpec];
    const maxCorruption = 100;
    const maxAfflictions = 10;
    const evolutionStage = localCorruption >= 75 ? 4 : localCorruption >= 50 ? 3 : localCorruption >= 25 ? 2 : 1;
    const isEvolutionReady = localCorruption >= 75;

    useEffect(() => {
        if (showTooltip && barRef.current && tooltipRef.current) {
            const barRect = barRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const tooltip = tooltipRef.current;
            let top = barRect.top - tooltipRect.height - 10;
            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            if (top < 10) { 
                top = barRect.bottom + 10; 
                tooltip.classList.add('below'); 
            } else { 
                tooltip.classList.remove('below'); 
            }
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
            }
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
    }, [showTooltip, localCorruption, localAfflictions, selectedSpec]);

    const handleSpecChange = (newSpec) => {
        setSelectedSpec(newSpec);
        setShowSpecSelector(false);
    };

    const renderCorruptionSegments = () => {
        const segments = [];
        const segmentValue = maxCorruption / 4;
        
        for (let i = 0; i < 4; i++) {
            const segmentStart = i * segmentValue;
            const segmentEnd = (i + 1) * segmentValue;
            const fillPercent = Math.max(0, Math.min(100, ((localCorruption - segmentStart) / segmentValue) * 100));
            const isFilled = localCorruption > segmentStart;
            const isEvolutionSegment = localCorruption >= 75 && i === 3;
            
            segments.push(
                <div 
                    key={i} 
                    className={`corruption-segment ${isFilled ? 'filled' : ''} ${isEvolutionSegment ? 'evolution-ready' : ''}`}
                >
                    <div 
                        className="segment-fill" 
                        style={{ 
                            width: `${fillPercent}%`,
                            background: `linear-gradient(90deg, ${currentSpec.color} 0%, ${currentSpec.glow} 100%)`,
                            boxShadow: `0 0 8px ${currentSpec.glow}`
                        }}
                    />
                </div>
            );
        }
        
        return segments;
    };

    return (
        <div className={`plaguebringer-resource-wrapper ${size}`}>
            {/* Spec Selector Icon - Only show in HUD context */}
            {context !== 'account' && (
                <>
                    <div className="spec-selector-icon" onClick={() => setShowSpecSelector(!showSpecSelector)}>
                        <i className={`fas ${currentSpec.icon}`} style={{ color: currentSpec.glow }}></i>
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
                                    <i className={`fas ${spec.icon}`} style={{ color: spec.glow }}></i>
                                    <span>{spec.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            
            {/* Main Resource Bar - CLICKABLE */}
            <div
                ref={barRef}
                className={`plaguebringer-resource-bar ${size} clickable`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowControls(!showControls)}
            >
                <div className="corruption-segments">
                    {renderCorruptionSegments()}
                </div>

                <div className="corruption-overlay">
                    <div className="corruption-number">
                        {localCorruption}/{maxCorruption}
                    </div>
                    <div className="afflictions-count">
                        <i className="fas fa-disease"></i> {localAfflictions}/{maxAfflictions}
                    </div>
                </div>
            </div>
            
            {/* Pathfinder-styled Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="plaguebringer-tooltip pathfinder-tooltip">
                    <div className="tooltip-header">Affliction Cultivation</div>
                    
                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Corruption:</strong> {localCorruption}/{maxCorruption}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Active Afflictions:</strong> {localAfflictions}/{maxAfflictions}
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">Evolution Stage: {evolutionStage}/4</div>
                        <div className="evolution-stages">
                            <div className={evolutionStage >= 1 ? 'stage-active' : ''}>Stage 1 (0-24): Base Afflictions</div>
                            <div className={evolutionStage >= 2 ? 'stage-active' : ''}>Stage 2 (25-49): Enhanced Effects</div>
                            <div className={evolutionStage >= 3 ? 'stage-active' : ''}>Stage 3 (50-74): Advanced Symptoms</div>
                            <div className={evolutionStage >= 4 ? 'stage-active' : ''}>Stage 4 (75-100): Final Form</div>
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">Corruption Generation</div>
                        <div className="corruption-gen">
                            <strong>Gain:</strong>
                            <span>+10 base affliction, +5 category spell, +25 final form</span>
                            <strong>Decay:</strong>
                            <span>-2 per turn</span>
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">Plague Mastery (Shared)</div>
                        <div className="passive-desc">
                            Your afflictions last 1d4 additional rounds and resist dispel attempts (roll 1d6, on 5-6 resist). 
                            Additionally, whenever an afflicted target dies, you gain 1d4 mana.
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">{currentSpec.passive}</div>
                        <div className="passive-desc">{currentSpec.passiveDesc}</div>
                    </div>
                </div>,
                document.body
            )}
            
            {/* Dev Controls */}
            {showControls && ReactDOM.createPortal(
                <div className="plaguebringer-controls-overlay" onClick={() => setShowControls(false)}>
                    <div className="plaguebringer-controls" onClick={(e) => e.stopPropagation()}>
                        <div className="controls-header">
                            <h4>Plaguebringer Controls</h4>
                            <button className="close-btn" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div className="control-group">
                            <label>Corruption: {localCorruption}/{maxCorruption}</label>
                            <input 
                                type="range" 
                                min="0" 
                                max={maxCorruption} 
                                value={localCorruption} 
                                onChange={(e) => setLocalCorruption(parseInt(e.target.value))}
                            />
                            <div className="control-buttons">
                                <button onClick={() => setLocalCorruption(Math.max(0, localCorruption - 10))}>-10</button>
                                <button onClick={() => setLocalCorruption(Math.max(0, localCorruption - 5))}>-5</button>
                                <button onClick={() => setLocalCorruption(Math.min(maxCorruption, localCorruption + 5))}>+5</button>
                                <button onClick={() => setLocalCorruption(Math.min(maxCorruption, localCorruption + 10))}>+10</button>
                            </div>
                        </div>
                        
                        <div className="control-group">
                            <label>Active Afflictions: {localAfflictions}/{maxAfflictions}</label>
                            <input 
                                type="range" 
                                min="0" 
                                max={maxAfflictions} 
                                value={localAfflictions} 
                                onChange={(e) => setLocalAfflictions(parseInt(e.target.value))}
                            />
                            <div className="control-buttons">
                                <button onClick={() => setLocalAfflictions(Math.max(0, localAfflictions - 1))}>-1</button>
                                <button onClick={() => setLocalAfflictions(Math.min(maxAfflictions, localAfflictions + 1))}>+1</button>
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
                                        style={{ borderColor: spec.glow }}
                                    >
                                        <i className={`fas ${spec.icon}`} style={{ color: spec.glow }}></i>
                                        <span>{spec.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default PlaguebringerResourceBar;

