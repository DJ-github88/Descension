import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/ToxicologistResourceBar.css';

const ToxicologistResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud' }) => {
    // Local state for dev testing
    const [localToxinVials, setLocalToxinVials] = useState(6);
    const [localContraptionParts, setLocalContraptionParts] = useState(3);
    const [selectedSpec, setSelectedSpec] = useState('venomancer');
    const [activePoisonsCount, setActivePoisonsCount] = useState(2);
    const [deployedContraptionsCount, setDeployedContraptionsCount] = useState(1);
    const [comboActive, setComboActive] = useState(false);
    
    const [showTooltip, setShowTooltip] = useState(false);
    const [hoverSection, setHoverSection] = useState(null); // 'toxins' or 'contraptions'
    const [showToxinMenu, setShowToxinMenu] = useState(false);
    const [showContraptionMenu, setShowContraptionMenu] = useState(false);
    const [showSpecMenu, setShowSpecMenu] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);

    // Specialization configurations
    const specConfigs = {
        venomancer: {
            name: 'Venomancer',
            color: '#2D5016',
            activeColor: '#4CAF50',
            glowColor: '#76FF03',
            icon: 'fa-skull-crossbones',
            passive: 'Potent Toxins',
            passiveDesc: 'All poison damage +1d6. Poison effects last 2 additional rounds. Enemies have disadvantage on saves against your poisons.'
        },
        gadgeteer: {
            name: 'Gadgeteer',
            color: '#4A4A4A',
            activeColor: '#9E9E9E',
            glowColor: '#FFD700',
            icon: 'fa-cog',
            passive: 'Mechanical Mastery',
            passiveDesc: 'Deploy contraptions as bonus action. +1 contraption part max (total 6). Contraptions harder to detect (DC +3).'
        },
        saboteur: {
            name: 'Saboteur',
            color: '#1A237E',
            activeColor: '#5C6BC0',
            glowColor: '#7C4DFF',
            icon: 'fa-user-secret',
            passive: 'Debilitating Expertise',
            passiveDesc: 'All debuffs last 2 additional rounds. Debuffs require coin flip (heads) to dispel. Enemies affected by poisons/contraptions have -2 to all saves.'
        }
    };

    const currentSpec = specConfigs[selectedSpec];
    const maxToxinVials = selectedSpec === 'gadgeteer' ? 8 : 10; // Base INT mod + 3
    const maxContraptionParts = selectedSpec === 'gadgeteer' ? 6 : 5;

    // Auto-adjust tooltip position
    useEffect(() => {
        if (showTooltip && barRef.current && tooltipRef.current) {
            const barRect = barRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const tooltip = tooltipRef.current;
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const padding = 10;
            
            let top = barRect.top - tooltipRect.height - padding;
            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            
            // Check if tooltip goes off top
            if (top < padding) {
                top = barRect.bottom + padding;
                tooltip.classList.add('below');
            } else {
                tooltip.classList.remove('below');
            }
            
            // Check if tooltip goes off left
            if (left < padding) {
                left = padding;
            }
            
            // Check if tooltip goes off right
            if (left + tooltipRect.width > viewportWidth - padding) {
                left = viewportWidth - tooltipRect.width - padding;
            }
            
            // Check if tooltip goes off bottom
            if (top + tooltipRect.height > viewportHeight - padding) {
                top = viewportHeight - tooltipRect.height - padding;
            }
            
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
    }, [showTooltip, localToxinVials, localContraptionParts, selectedSpec, hoverSection]);

    // Render toxin vials with liquid fill effect
    const renderToxinVials = () => {
        const vials = [];
        const vialsPerRow = 5;
        const rows = Math.ceil(maxToxinVials / vialsPerRow);
        
        for (let i = 0; i < maxToxinVials; i++) {
            const isFilled = i < localToxinVials;
            const isPulsing = selectedSpec === 'venomancer' && activePoisonsCount > 0 && isFilled;
            
            vials.push(
                <div 
                    key={i} 
                    className={`toxin-vial ${isFilled ? 'filled' : 'empty'} ${isPulsing ? 'pulsing' : ''}`}
                >
                    <div 
                        className="vial-liquid"
                        style={{
                            height: isFilled ? '100%' : '0%',
                            backgroundColor: selectedSpec === 'venomancer' ? currentSpec.activeColor : '#4CAF50',
                            boxShadow: isFilled ? `0 0 6px ${selectedSpec === 'venomancer' ? currentSpec.glowColor : '#76FF03'}` : 'none'
                        }}
                    />
                </div>
            );
        }
        
        return vials;
    };

    // Render contraption parts with mechanical segments
    const renderContraptionParts = () => {
        const parts = [];
        const isGlowing = selectedSpec === 'gadgeteer' && deployedContraptionsCount > 0;
        
        for (let i = 0; i < maxContraptionParts; i++) {
            const isFilled = i < localContraptionParts;
            
            parts.push(
                <div 
                    key={i} 
                    className={`contraption-part ${isFilled ? 'filled' : 'empty'} ${isGlowing && isFilled ? 'glowing' : ''}`}
                >
                    <div 
                        className="part-gear"
                        style={{
                            opacity: isFilled ? 1 : 0.3,
                            color: isFilled ? currentSpec.activeColor : '#666',
                            filter: isGlowing && isFilled ? `drop-shadow(0 0 4px ${currentSpec.glowColor})` : 'none'
                        }}
                    >
                        <i className="fas fa-cog"></i>
                    </div>
                </div>
            );
        }
        
        return parts;
    };

    return (
        <div className="toxicologist-resource-container">
            {/* Spec Button - Positioned Absolutely to the Left */}
            <button
                className="spec-button"
                onClick={() => setShowSpecMenu(!showSpecMenu)}
                title="Change Specialization"
            >
                <i className="fas fa-cog"></i>
            </button>

            {/* Single Split Bar */}
            <div
                ref={barRef}
                className={`split-bar-container ${size} ${comboActive && selectedSpec === 'saboteur' ? 'combo-active' : ''}`}
            >
                            {/* Left Half - Toxin Vials (Liquid) */}
                            <div
                                className="bar-half toxin-half"
                                onClick={() => {
                                    setShowToxinMenu(!showToxinMenu);
                                    setShowContraptionMenu(false);
                                }}
                                onMouseEnter={() => {
                                    setShowTooltip(true);
                                    setHoverSection('toxins');
                                }}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                {/* Count Badge Inside Bar */}
                                <div className="bar-count">
                                    <i className="fas fa-flask"></i> {localToxinVials}/{maxToxinVials}
                                </div>

                                <div
                                    className={`liquid-fill ${selectedSpec === 'venomancer' && activePoisonsCount > 0 ? 'pulsing' : ''}`}
                                    style={{
                                        height: `${(localToxinVials / maxToxinVials) * 100}%`,
                                        background: `linear-gradient(180deg, ${specConfigs[selectedSpec].activeColor}DD 0%, ${specConfigs[selectedSpec].activeColor}FF 100%)`
                                    }}
                                >
                                    {/* Bubbles for liquid effect */}
                                    {localToxinVials > 0 && (
                                        <>
                                            <div className="bubble bubble-1"></div>
                                            <div className="bubble bubble-2"></div>
                                            <div className="bubble bubble-3"></div>
                                        </>
                                    )}
                                </div>
                                {/* Tick marks */}
                                <div className="tick-marks">
                                    {Array.from({ length: maxToxinVials }).map((_, i) => (
                                        <div key={i} className="tick" style={{ bottom: `${((i + 1) / maxToxinVials) * 100}%` }}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Center Divider */}
                            <div className="center-divider">
                                {comboActive && selectedSpec === 'saboteur' && (
                                    <div className="mixing-indicator">
                                        <i className="fas fa-flask-vial"></i>
                                    </div>
                                )}
                            </div>

                            {/* Right Half - Contraption Parts (Mechanical) */}
                            <div
                                className="bar-half contraption-half"
                                onClick={() => {
                                    setShowContraptionMenu(!showContraptionMenu);
                                    setShowToxinMenu(false);
                                }}
                                onMouseEnter={() => {
                                    setShowTooltip(true);
                                    setHoverSection('contraptions');
                                }}
                                onMouseLeave={() => setShowTooltip(false)}
                            >
                                {/* Count Badge Inside Bar */}
                                <div className="bar-count">
                                    <i className="fas fa-cog"></i> {localContraptionParts}/{maxContraptionParts}
                                </div>

                                <div
                                    className={`mechanical-fill ${selectedSpec === 'gadgeteer' && deployedContraptionsCount > 0 ? 'glowing' : ''}`}
                                    style={{
                                        height: `${(localContraptionParts / maxContraptionParts) * 100}%`,
                                        background: `linear-gradient(180deg, rgba(158, 158, 158, 0.7) 0%, ${specConfigs[selectedSpec].glowColor}AA 100%)`
                                    }}
                                >
                                    {/* Gears for mechanical effect */}
                                    {localContraptionParts > 0 && (
                                        <>
                                            <i className="fas fa-cog gear gear-1"></i>
                                            <i className="fas fa-cog gear gear-2"></i>
                                            <i className="fas fa-cog gear gear-3"></i>
                                        </>
                                    )}
                                </div>
                                {/* Tick marks */}
                                <div className="tick-marks">
                                    {Array.from({ length: maxContraptionParts }).map((_, i) => (
                                        <div key={i} className="tick" style={{ bottom: `${((i + 1) / maxContraptionParts) * 100}%` }}></div>
                                    ))}
                                </div>
                            </div>
                    </div>

            {/* Tooltip */}
            {showTooltip && hoverSection && ReactDOM.createPortal(
                <div ref={tooltipRef} className="toxicologist-tooltip">
                    {hoverSection === 'toxins' && (
                        <>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Toxin Vials: {localToxinVials}/{maxToxinVials}</div>
                                <div className="tooltip-columns">
                                    <div className="tooltip-col">
                                        <div className="col-title">Generation</div>
                                        <ul>
                                            <li><strong>1d4</strong> per short rest</li>
                                            <li><strong>All</strong> per long rest</li>
                                        </ul>
                                    </div>
                                    <div className="tooltip-col">
                                        <div className="col-title">Usage</div>
                                        <ul>
                                            <li><strong>1-2</strong> for poisons</li>
                                            <li><strong>2-3</strong> for concoctions</li>
                                            <li><strong>3</strong> for explosives</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Alchemical Expertise (Shared)</div>
                                <div className="passive-desc">Craft poisons/concoctions as bonus action. Deploy contraptions as action. Immune to own poisons, resist all poison damage.</div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">{currentSpec.passive} ({currentSpec.name})</div>
                                <div className="passive-desc">{currentSpec.passiveDesc}</div>
                            </div>
                        </>
                    )}
                    {hoverSection === 'contraptions' && (
                        <>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Contraption Parts: {localContraptionParts}/{maxContraptionParts}</div>
                                <div className="tooltip-columns">
                                    <div className="tooltip-col">
                                        <div className="col-title">Generation</div>
                                        <ul>
                                            <li><strong>1</strong> per short rest</li>
                                            <li><strong>All</strong> per long rest</li>
                                        </ul>
                                    </div>
                                    <div className="tooltip-col">
                                        <div className="col-title">Usage</div>
                                        <ul>
                                            <li><strong>1-2</strong> per contraption</li>
                                            <li>Traps, devices, mechanisms</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Alchemical Expertise (Shared)</div>
                                <div className="passive-desc">Craft poisons/concoctions as bonus action. Deploy contraptions as action. Immune to own poisons, resist all poison damage.</div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">{currentSpec.passive} ({currentSpec.name})</div>
                                <div className="passive-desc">{currentSpec.passiveDesc}</div>
                            </div>
                        </>
                    )}
                </div>,
                document.body
            )}

            {/* Specialization Menu */}
            {showSpecMenu && (
                <div className="toxicologist-spec-menu">
                    <div className="spec-menu-title">Specialization</div>
                    <div className="spec-menu-options">
                        <button
                            className={`spec-option ${selectedSpec === 'venomancer' ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedSpec('venomancer');
                                setShowSpecMenu(false);
                            }}
                        >
                            <i className="fas fa-skull-crossbones"></i>
                            <span>Venomancer</span>
                        </button>
                        <button
                            className={`spec-option ${selectedSpec === 'gadgeteer' ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedSpec('gadgeteer');
                                setShowSpecMenu(false);
                            }}
                        >
                            <i className="fas fa-cog"></i>
                            <span>Gadgeteer</span>
                        </button>
                        <button
                            className={`spec-option ${selectedSpec === 'saboteur' ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedSpec('saboteur');
                                setShowSpecMenu(false);
                            }}
                        >
                            <i className="fas fa-user-secret"></i>
                            <span>Saboteur</span>
                        </button>
                    </div>
                    <button className="menu-close-btn" onClick={() => setShowSpecMenu(false)}>
                        Close
                    </button>
                </div>
            )}

            {/* Toxin Vials Menu */}
            {showToxinMenu && (
                <div className="toxicologist-resource-menu">
                    <div className="menu-title">Toxin Vials ({localToxinVials}/{maxToxinVials})</div>
                    <div className="menu-info-row">
                        <span className="info-label">Generation:</span>
                        <span className="info-value">+1d4 per short rest</span>
                    </div>
                    <div className="menu-info-row">
                        <span className="info-label">Crafting:</span>
                        <span className="info-value">Bonus action</span>
                    </div>
                    <div className="menu-action-buttons">
                        <button
                            className="menu-action-btn gain"
                            onClick={() => setLocalToxinVials(Math.min(maxToxinVials, localToxinVials + 1))}
                        >
                            +1 Vial
                        </button>
                        <button
                            className="menu-action-btn spend"
                            onClick={() => setLocalToxinVials(Math.max(0, localToxinVials - 1))}
                        >
                            -1 Poison
                        </button>
                        <button
                            className="menu-action-btn spend"
                            onClick={() => setLocalToxinVials(Math.max(0, localToxinVials - 2))}
                        >
                            -2 Concoction
                        </button>
                        <button
                            className="menu-action-btn spend"
                            onClick={() => setLocalToxinVials(Math.max(0, localToxinVials - 3))}
                        >
                            -3 Explosive
                        </button>
                    </div>
                    <button className="menu-reset-btn" onClick={() => {
                        setLocalToxinVials(maxToxinVials);
                        setShowToxinMenu(false);
                    }}>
                        Reset to Max
                    </button>
                    <button className="menu-close-btn" onClick={() => setShowToxinMenu(false)}>
                        Close
                    </button>
                </div>
            )}

            {/* Contraption Parts Menu */}
            {showContraptionMenu && (
                <div className="toxicologist-resource-menu">
                    <div className="menu-title">Contraption Parts ({localContraptionParts}/{maxContraptionParts})</div>
                    <div className="menu-info-row">
                        <span className="info-label">Generation:</span>
                        <span className="info-value">+1 per short rest</span>
                    </div>
                    <div className="menu-info-row">
                        <span className="info-label">Deployment:</span>
                        <span className="info-value">{selectedSpec === 'gadgeteer' ? 'Bonus action' : 'Action'}</span>
                    </div>
                    <div className="menu-action-buttons">
                        <button
                            className="menu-action-btn gain"
                            onClick={() => setLocalContraptionParts(Math.min(maxContraptionParts, localContraptionParts + 1))}
                        >
                            +1 Part
                        </button>
                        <button
                            className="menu-action-btn spend"
                            onClick={() => setLocalContraptionParts(Math.max(0, localContraptionParts - 1))}
                        >
                            -1 Deploy Contraption
                        </button>
                        <button
                            className="menu-action-btn spend"
                            onClick={() => setLocalContraptionParts(Math.max(0, localContraptionParts - 2))}
                        >
                            -2 Deploy Complex Device
                        </button>
                    </div>
                    <button className="menu-reset-btn" onClick={() => {
                        setLocalContraptionParts(maxContraptionParts);
                        setShowContraptionMenu(false);
                    }}>
                        Reset to Max
                    </button>
                    <button className="menu-close-btn" onClick={() => setShowContraptionMenu(false)}>
                        Close
                    </button>
                </div>
            )}


        </div>
    );
};

export default ToxicologistResourceBar;
