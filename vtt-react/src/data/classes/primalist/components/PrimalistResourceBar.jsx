import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/PrimalistResourceBar.css';

const PrimalistResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', isOwner = true, onClassResourceUpdate = null }) => {
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
            passiveDesc: 'Healing totem effects +50%. Totems have +5 HP and +2 Armor. Healing and defensive totems can overlap with any synergy.',
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
        if (!showTooltip || !tooltipRef.current || !barRef.current) return;

        const updatePosition = () => {
            const tooltip = tooltipRef.current;
            const bar = barRef.current;
            if (!tooltip || !bar) return;

            tooltip.style.opacity = '0';
            tooltip.style.position = 'fixed';

            const barRect = bar.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            if (barRect.width === 0 && barRect.height === 0 && barRect.left === 0 && barRect.top === 0) {
                requestAnimationFrame(updatePosition);
                return;
            }

            if (tooltipRect.width === 0 || tooltipRect.height === 0) {
                requestAnimationFrame(updatePosition);
                return;
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 8;

            let hudContainer = bar.closest('.party-hud, .party-member-frame, .character-portrait-hud');
            let hudBottom = barRect.bottom;

            if (hudContainer) {
                const hudRect = hudContainer.getBoundingClientRect();
                hudBottom = hudRect.bottom;
            }

            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            let top = hudBottom + margin;

            if (left < margin) left = margin;
            if (left + tooltipRect.width > viewportWidth - margin) {
                left = viewportWidth - tooltipRect.width - margin;
            }

            if (top + tooltipRect.height > viewportHeight - margin) {
                if (hudContainer) {
                    const hudRect = hudContainer.getBoundingClientRect();
                    top = hudRect.top - tooltipRect.height - margin;
                } else {
                    top = barRect.top - tooltipRect.height - margin;
                }
                if (top < margin) top = margin;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.transform = 'none';
            tooltip.style.zIndex = '2147483647';
            tooltip.style.opacity = '1';
        };

        updatePosition();
        requestAnimationFrame(() => requestAnimationFrame(updatePosition));
        const timeoutId = setTimeout(updatePosition, 50);

        return () => {
            clearTimeout(timeoutId);
            if (tooltipRef.current) tooltipRef.current.style.opacity = '';
        };
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
                    <div className="spec-selector-icon" onClick={() => { if (isOwner) setShowSpecSelector(!showSpecSelector); }}>
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
                onClick={() => { if (isOwner) setShowControls(!showControls); }}
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
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ opacity: 0 }}>
                    <div className="tooltip-header">Totemic Synergy</div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Current:</strong> {localSynergy}/{maxSynergy} Synergy
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Totems:</strong> {activeTotems}/{maxTotems} active
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Synergy Management</div>
                        <div className="level-management">
                            <strong>Gain:</strong>
                            <span>+1 per totem placed, +1 per totem per turn</span>
                            <strong>Spend:</strong>
                            <span>Variable (4-10 per synergy effect)</span>
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
            {showControls && ReactDOM.createPortal(
                <div className="primalist-controls-overlay" onClick={() => setShowControls(false)}>
                    <div className="primalist-controls" onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }} onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}>
                        <div className="controls-header">
                            <h4>Primalist Controls</h4>
                            <button className="context-menu-button danger" onClick={() => setShowControls(false)}>
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
                            <div className="menu-buttons">
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
                            <div className="menu-buttons">
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
                            <div className="spec-options-grid">
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

