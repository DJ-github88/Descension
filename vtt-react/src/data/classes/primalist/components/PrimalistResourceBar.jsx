import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/PrimalistResourceBar.css';

const PrimalistResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud' }) => {
    const [localSynergy, setLocalSynergy] = useState(45);
    const [activeTotems, setActiveTotems] = useState(5);
    const [selectedSpec, setSelectedSpec] = useState('earthwarden');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showSpecSelector, setShowSpecSelector] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);

    const specConfigs = {
        earthwarden: { 
            name: 'Earthwarden', 
            color: '#8B4513', 
            glow: '#CD853F', 
            icon: 'fa-shield-alt', 
            passive: 'Sanctuary Keeper', 
            passiveDesc: 'Healing totem effects +50%. Totems have +5 HP and +2 AC. Can place a 5th totem for enhanced synergies.',
            synergyThreshold: 4
        },
        stormbringer: { 
            name: 'Stormbringer', 
            color: '#4169E1', 
            glow: '#87CEEB', 
            icon: 'fa-bolt', 
            passive: 'Elemental Wrath', 
            passiveDesc: 'Elemental totems deal +1d6 damage. Trigger synergy with only 3 totems instead of 4. Elemental Fury deals 3d6 per element.',
            synergyThreshold: 3
        },
        spiritcaller: { 
            name: 'Spiritcaller', 
            color: '#9370DB', 
            glow: '#DDA0DD', 
            icon: 'fa-ghost', 
            passive: 'Spirit Bond', 
            passiveDesc: 'Totems have 15-foot radius (instead of 10). Reposition totems for 0 AP. Enemies in totem range have disadvantage on saves.',
            synergyThreshold: 4
        }
    };

    const handleSpecChange = (spec) => {
        setSelectedSpec(spec);
        setShowSpecSelector(false);
    };

    const currentSpec = specConfigs[selectedSpec];
    const maxSynergy = 100;
    const maxTotems = 8;
    const synergyThreshold = currentSpec.synergyThreshold;
    const canActivateSynergy = activeTotems >= synergyThreshold;

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
    }, [showTooltip, localSynergy, activeTotems, selectedSpec]);

    const renderSynergyBar = () => {
        const percentage = (localSynergy / maxSynergy) * 100;
        const thresholdPercentage = (synergyThreshold / maxTotems) * 100;
        
        return (
            <div className="synergy-bar-container">
                <div className="synergy-bar-background">
                    <div 
                        className={`synergy-bar-fill ${canActivateSynergy ? 'synergy-ready' : ''}`}
                        style={{ 
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${currentSpec.color} 0%, ${currentSpec.glow} 100%)`,
                            boxShadow: canActivateSynergy ? `0 0 12px ${currentSpec.glow}` : `0 0 6px ${currentSpec.glow}`
                        }}
                    />
                    {/* Synergy threshold marker */}
                    <div 
                        className="synergy-threshold-marker"
                        style={{ 
                            left: `${(synergyThreshold * 10)}%`,
                            borderColor: currentSpec.glow
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className={`primalist-resource-wrapper ${size}`}>
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
                className={`primalist-resource-bar ${size} clickable`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowControls(!showControls)}
            >
                {renderSynergyBar()}

                <div className="primalist-overlay">
                    <div className="synergy-number">
                        {localSynergy}/{maxSynergy}
                    </div>
                    <div className="totems-count">
                        <i className="fas fa-torii-gate"></i> {activeTotems}/{maxTotems}
                    </div>
                    {canActivateSynergy && (
                        <div className="synergy-ready-indicator" style={{ color: currentSpec.glow }}>
                            <i className="fas fa-star"></i> SYNERGY
                        </div>
                    )}
                </div>
            </div>
            
            {/* Pathfinder-styled Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="primalist-tooltip pathfinder-tooltip">
                    <div className="tooltip-header">Totemic Synergy</div>
                    
                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Synergy Energy:</strong> {localSynergy}/{maxSynergy}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Active Totems:</strong> {activeTotems}/{maxTotems}
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">Synergy Status</div>
                        <div className="synergy-status">
                            {canActivateSynergy ? (
                                <div style={{ color: currentSpec.glow }}>
                                    <strong>READY:</strong> {synergyThreshold}+ totems active - can trigger synergy effects
                                </div>
                            ) : (
                                <div>
                                    <strong>Building:</strong> Need {synergyThreshold - activeTotems} more totem(s) for synergy
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">Synergy Generation</div>
                        <div className="synergy-gen">
                            <strong>Gain:</strong>
                            <span>+1 per totem placed, +1 per totem per turn</span>
                            <strong>Spend:</strong>
                            <span>Variable (synergy effects cost 4-10)</span>
                        </div>
                    </div>
                    
                    <div className="tooltip-divider"></div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">Totemic Mastery (Shared)</div>
                        <div className="passive-desc">
                            Place and maintain up to 8 totems. Trigger synergy effects when {synergyThreshold === 3 ? '3' : '4'} totems are active. 
                            Totems have 10 HP, 12 AC, and 10-foot radius.
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
                <div className="primalist-controls-overlay" onClick={() => setShowControls(false)}>
                    <div className="primalist-controls" onClick={(e) => e.stopPropagation()}>
                        <div className="controls-header">
                            <h4>Primalist Controls</h4>
                            <button className="close-btn" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div className="control-group">
                            <label>Totemic Synergy: {localSynergy}/{maxSynergy}</label>
                            <input 
                                type="range" 
                                min="0" 
                                max={maxSynergy} 
                                value={localSynergy} 
                                onChange={(e) => setLocalSynergy(parseInt(e.target.value))}
                            />
                            <div className="control-buttons">
                                <button onClick={() => setLocalSynergy(Math.max(0, localSynergy - 10))}>-10</button>
                                <button onClick={() => setLocalSynergy(Math.max(0, localSynergy - 5))}>-5</button>
                                <button onClick={() => setLocalSynergy(Math.min(maxSynergy, localSynergy + 5))}>+5</button>
                                <button onClick={() => setLocalSynergy(Math.min(maxSynergy, localSynergy + 10))}>+10</button>
                            </div>
                        </div>
                        
                        <div className="control-group">
                            <label>Active Totems: {activeTotems}/{maxTotems}</label>
                            <input 
                                type="range" 
                                min="0" 
                                max={maxTotems} 
                                value={activeTotems} 
                                onChange={(e) => setActiveTotems(parseInt(e.target.value))}
                            />
                            <div className="control-buttons">
                                <button onClick={() => setActiveTotems(Math.max(0, activeTotems - 1))}>-1</button>
                                <button onClick={() => setActiveTotems(Math.min(maxTotems, activeTotems + 1))}>+1</button>
                            </div>
                            <div className="totem-info">
                                {activeTotems >= synergyThreshold ? (
                                    <span style={{ color: currentSpec.glow }}>
                                        <i className="fas fa-check-circle"></i> Synergy Ready ({synergyThreshold}+ totems)
                                    </span>
                                ) : (
                                    <span>
                                        <i className="fas fa-info-circle"></i> Need {synergyThreshold - activeTotems} more totem(s)
                                    </span>
                                )}
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
                                        <small>({spec.synergyThreshold} totems)</small>
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

export default PrimalistResourceBar;

