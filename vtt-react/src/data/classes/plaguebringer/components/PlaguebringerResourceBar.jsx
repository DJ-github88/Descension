import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/PlaguebringerResourceBar.css';

const PlaguebringerResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud' }) => {
    const [localCorruption, setLocalCorruption] = useState(65);
    const [localAfflictions, setLocalAfflictions] = useState(4);
    const [selectedSpec, setSelectedSpec] = useState('virulentSpreader');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    
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



    return (
        <div className={`plaguebringer-resource-wrapper ${size}`}>

            {/* Dual Resource Display */}
            <div className="plaguebringer-dual-bars">

                {/* Corruption Bar (Top) */}
                <div
                    ref={barRef}
                    className={`corruption-bar ${size} clickable`}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowControls(!showControls)}
                >
                    <div className="corruption-fill" style={{
                        width: `${(localCorruption / maxCorruption) * 100}%`,
                        background: `linear-gradient(90deg, ${currentSpec.color} 0%, ${currentSpec.glow} 100%)`
                    }} />
                    <div className="corruption-overlay">
                        <div className="corruption-number">
                            {localCorruption}/{maxCorruption}
                        </div>
                    </div>
                </div>

                {/* Afflictions Bar (Bottom) */}
                <div className="afflictions-bar">
                    {Array.from({ length: maxAfflictions }, (_, index) => (
                        <div
                            key={index}
                            className={`affliction-segment ${index < localAfflictions ? 'active' : 'inactive'} ${currentSpec.icon.split('-')[1]}`}
                            style={{
                                backgroundColor: index < localAfflictions ? currentSpec.color : 'rgba(85, 107, 47, 0.2)',
                                borderColor: index < localAfflictions ? currentSpec.glow : 'rgba(85, 107, 47, 0.4)',
                                boxShadow: index < localAfflictions ? `0 0 4px ${currentSpec.glow}80` : 'none'
                            }}
                        >
                            {index < localAfflictions && (
                                <i className={`fas ${currentSpec.icon}`} style={{
                                    color: '#ffffff',
                                    fontSize: size === 'small' ? '6px' : size === 'large' ? '8px' : '7px',
                                    filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))'
                                }} />
                            )}
                        </div>
                    ))}
                    <div className="afflictions-label">
                        <i className="fas fa-disease"></i> {localAfflictions}
                    </div>
                </div>
            </div>
            
            {/* Simple Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="plaguebringer-tooltip pathfinder-tooltip">
                    <div className="tooltip-header">Plaguebringer</div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Corruption:</strong> {localCorruption}/{maxCorruption}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Active Afflictions:</strong> {localAfflictions}/{maxAfflictions}
                        </div>
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Evolution Stage: {evolutionStage}/4</div>
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">{currentSpec.name}</div>
                        <div className="passive-desc" style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                            {currentSpec.passiveDesc}
                        </div>
                    </div>
                </div>,
                document.body
            )}
            
            {/* Plaguebringer Menu */}
            {showControls && (
                <div className="plaguebringer-menu" onClick={(e) => e.stopPropagation()}>
                    <div className="menu-section">
                        <div className="menu-title">Corruption</div>
                        <div className="menu-controls">
                            <button onClick={() => setLocalCorruption(Math.max(0, localCorruption - 10))}>-10</button>
                            <span className="menu-value">{localCorruption}/{maxCorruption}</span>
                            <button onClick={() => setLocalCorruption(Math.min(maxCorruption, localCorruption + 10))}>+10</button>
                        </div>
                        <div className="menu-quick-buttons">
                            <button onClick={() => setLocalCorruption(Math.max(0, localCorruption - 5))}>-5</button>
                            <button onClick={() => setLocalCorruption(Math.min(maxCorruption, localCorruption + 5))}>+5</button>
                            <button onClick={() => setLocalCorruption(0)}>Clear</button>
                            <button onClick={() => setLocalCorruption(maxCorruption)}>Max</button>
                        </div>
                    </div>

                    <div className="menu-section">
                        <div className="menu-title">Active Afflictions</div>
                        <div className="menu-controls">
                            <button onClick={() => setLocalAfflictions(Math.max(0, localAfflictions - 1))}>-1</button>
                            <span className="menu-value">{localAfflictions}/{maxAfflictions}</span>
                            <button onClick={() => setLocalAfflictions(Math.min(maxAfflictions, localAfflictions + 1))}>+1</button>
                        </div>
                        <div className="menu-quick-buttons">
                            <button onClick={() => setLocalAfflictions(0)}>Clear</button>
                            <button onClick={() => setLocalAfflictions(maxAfflictions)}>Max</button>
                        </div>
                    </div>

                    <div className="menu-section">
                        <div className="menu-title">Specialization</div>
                        <div className="spec-icons-row">
                            {Object.entries(specConfigs).map(([key, spec]) => {
                                const isSelected = selectedSpec === key;
                                return (
                                    <div
                                        key={key}
                                        className={`spec-icon-option ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedSpec(key);
                                        }}
                                        title={`${spec.name}: ${spec.passive}`}
                                    >
                                        <i className={`fas ${spec.icon}`}></i>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaguebringerResourceBar;

