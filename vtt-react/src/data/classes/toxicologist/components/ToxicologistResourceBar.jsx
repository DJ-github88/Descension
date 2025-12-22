import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/ToxicologistResourceBar.css';
import '../../../../styles/unified-context-menu.css';

const ToxicologistResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', onClassResourceUpdate = null }) => {
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
            passiveDesc: 'Deploy contraptions using action points. +1 contraption part max (total 6). Contraptions harder to detect (DC +3).'
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
            
            // Find the HUD container to position tooltip below it
            let hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
            let hudBottom = barRect.bottom;
            
            if (hudContainer) {
                const hudRect = hudContainer.getBoundingClientRect();
                hudBottom = hudRect.bottom;
            }
            
            // Position tooltip below the HUD container, centered horizontally
            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            let top = hudBottom + padding;
            
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
                // If there's not enough space below, position above the HUD instead
                if (hudContainer) {
                    const hudRect = hudContainer.getBoundingClientRect();
                    top = hudRect.top - tooltipRect.height - padding;
                    tooltip.classList.remove('below');
                } else {
                    top = viewportHeight - tooltipRect.height - padding;
                }
                // But ensure it doesn't go off top either
                if (top < padding) {
                    top = padding;
                }
            } else {
                tooltip.classList.add('below');
            }
            
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
    }, [showTooltip, localToxinVials, localContraptionParts, selectedSpec, hoverSection]);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSpecMenu && !event.target.closest('.toxicologist-spec-menu') && !event.target.closest('.spec-button')) {
                setShowSpecMenu(false);
            }
            if (showToxinMenu && !event.target.closest('.toxicologist-resource-menu') && !event.target.closest('.toxin-half')) {
                setShowToxinMenu(false);
            }
            if (showContraptionMenu && !event.target.closest('.toxicologist-resource-menu') && !event.target.closest('.contraption-half')) {
                setShowContraptionMenu(false);
            }
        };

        if (showSpecMenu || showToxinMenu || showContraptionMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSpecMenu, showToxinMenu, showContraptionMenu]);

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
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip">
                    {hoverSection === 'toxins' && (
                        <>
                            <div className="tooltip-header">Toxin Vials</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Current:</strong> {localToxinVials}/{maxToxinVials} vials
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Vial Management</div>
                                <div className="level-management">
                                    <strong>Gain:</strong>
                                    <span>1d4 per short rest, all per long rest</span>
                                    <strong>Spend:</strong>
                                    <span>1-2 for poisons, 2-3 for concoctions, 3 for explosives</span>
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Alchemical Expertise (Shared)</div>
                                <div className="passive-desc">Craft poisons/concoctions using action points. Deploy contraptions as action. Immune to own poisons, resist all poison damage.</div>
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
                            <div className="tooltip-header">Contraption Parts</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Current:</strong> {localContraptionParts}/{maxContraptionParts} parts
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Part Management</div>
                                <div className="level-management">
                                    <strong>Gain:</strong>
                                    <span>1 per short rest, all per long rest</span>
                                    <strong>Spend:</strong>
                                    <span>1-2 per contraption (traps, devices, mechanisms)</span>
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Alchemical Expertise (Shared)</div>
                                <div className="passive-desc">Craft poisons/concoctions using action points. Deploy contraptions as action. Immune to own poisons, resist all poison damage.</div>
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
            {showSpecMenu && barRef.current && ReactDOM.createPortal(
                <div
                    className={`unified-context-menu compact toxicologist-spec-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
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
                    <div className="context-menu-main toxicologist-menu">
                        <div className="menu-title">Specialization</div>
                        <div className="toxicologist-spec-grid">
                            {Object.entries(specConfigs).map(([specKey, spec]) => (
                                <button
                                    key={specKey}
                                    className={`toxicologist-spec-btn ${selectedSpec === specKey ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSpec(specKey);
                                        setShowSpecMenu(false);
                                    }}
                                    title={spec.name}
                                >
                                    <i className={`fas ${spec.icon}`}></i>
                                    <span>{spec.name}</span>
                                </button>
                            ))}
                        </div>
                        <div className="toxicologist-quick-actions">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSpecMenu(false);
                                }} 
                                className="toxicologist-quick-btn"
                                title="Close"
                            >
                                <i className="fas fa-times"></i>
                                <span>Close</span>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Toxin Vials Menu */}
            {showToxinMenu && barRef.current && ReactDOM.createPortal(
                <div
                    className={`unified-context-menu compact toxicologist-toxin-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
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
                    <div className="context-menu-main toxicologist-menu">
                        <div className="menu-title">Toxin Vials: {localToxinVials}/{maxToxinVials}</div>

                        <div className="toxicologist-info-text">
                            <div>Generation: +1d4 per short rest</div>
                            <div>Crafting: Action points</div>
                        </div>

                        {/* Gain Actions */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Gain</div>
                            <div className="toxicologist-action-grid single-col">
                                <button
                                    className="context-menu-button gain"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newValue = Math.min(maxToxinVials, localToxinVials + 1);
                                        const amount = newValue - localToxinVials;
                                        setLocalToxinVials(newValue);
                                        if (amount > 0) {
                                            logClassResourceChange('Toxin Vial', amount, true, 'toxinVials');
                                            if (onClassResourceUpdate) onClassResourceUpdate('toxinVials', newValue);
                                        }
                                    }}
                                    title="+1 Vial"
                                >
                                    <i className="fas fa-plus"></i> +1
                                </button>
                            </div>
                        </div>

                        {/* Spend Actions */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Spend</div>
                            <div className="toxicologist-action-grid">
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newValue = Math.max(0, localToxinVials - 1);
                                        const amount = localToxinVials - newValue;
                                        setLocalToxinVials(newValue);
                                        if (amount > 0) {
                                            logClassResourceChange('Toxin Vial', amount, false, 'toxinVials');
                                            if (onClassResourceUpdate) onClassResourceUpdate('toxinVials', newValue);
                                        }
                                    }}
                                    title="-1 Poison"
                                >
                                    <i className="fas fa-minus"></i> -1
                                </button>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newValue = Math.max(0, localToxinVials - 2);
                                        const amount = localToxinVials - newValue;
                                        setLocalToxinVials(newValue);
                                        if (amount > 0) {
                                            logClassResourceChange('Toxin Vial', amount, false, 'toxinVials');
                                            if (onClassResourceUpdate) onClassResourceUpdate('toxinVials', newValue);
                                        }
                                    }}
                                    title="-2 Concoction"
                                >
                                    <i className="fas fa-minus"></i> -2
                                </button>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newValue = Math.max(0, localToxinVials - 3);
                                        const amount = localToxinVials - newValue;
                                        setLocalToxinVials(newValue);
                                        if (amount > 0) {
                                            logClassResourceChange('Toxin Vial', amount, false, 'toxinVials');
                                            if (onClassResourceUpdate) onClassResourceUpdate('toxinVials', newValue);
                                        }
                                    }}
                                    title="-3 Explosive"
                                >
                                    <i className="fas fa-minus"></i> -3
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="toxicologist-quick-actions">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const gainAmount = maxToxinVials - localToxinVials;
                                    setLocalToxinVials(maxToxinVials);
                                    setShowToxinMenu(false);
                                    if (gainAmount > 0) {
                                        logClassResourceChange('Toxin Vial', gainAmount, true, 'toxinVials');
                                        if (onClassResourceUpdate) onClassResourceUpdate('toxinVials', maxToxinVials);
                                    }
                                }} 
                                className="toxicologist-quick-btn"
                                title="Reset to Max"
                            >
                                <i className="fas fa-undo"></i>
                                <span>Max</span>
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowToxinMenu(false);
                                }} 
                                className="toxicologist-quick-btn"
                                title="Close"
                            >
                                <i className="fas fa-times"></i>
                                <span>Close</span>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Contraption Parts Menu */}
            {showContraptionMenu && barRef.current && ReactDOM.createPortal(
                <div
                    className={`unified-context-menu compact toxicologist-contraption-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
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
                    <div className="context-menu-main toxicologist-menu">
                        <div className="menu-title">Contraption Parts: {localContraptionParts}/{maxContraptionParts}</div>

                        <div className="toxicologist-info-text">
                            <div>Generation: +1 per short rest</div>
                            <div>Deployment: {selectedSpec === 'gadgeteer' ? 'Action points' : 'Action'}</div>
                        </div>

                        {/* Gain Actions */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Gain</div>
                            <div className="toxicologist-action-grid single-col">
                                <button
                                    className="context-menu-button gain"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newValue = Math.min(maxContraptionParts, localContraptionParts + 1);
                                        const amount = newValue - localContraptionParts;
                                        setLocalContraptionParts(newValue);
                                        if (amount > 0) {
                                            logClassResourceChange('Contraption Part', amount, true, 'contraptionParts');
                                            if (onClassResourceUpdate) onClassResourceUpdate('contraptionParts', newValue);
                                        }
                                    }}
                                    title="+1 Part"
                                >
                                    <i className="fas fa-plus"></i> +1
                                </button>
                            </div>
                        </div>

                        {/* Spend Actions */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Spend</div>
                            <div className="toxicologist-action-grid two-col">
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newValue = Math.max(0, localContraptionParts - 1);
                                        const amount = localContraptionParts - newValue;
                                        setLocalContraptionParts(newValue);
                                        if (amount > 0) {
                                            logClassResourceChange('Contraption Part', amount, false, 'contraptionParts');
                                            if (onClassResourceUpdate) onClassResourceUpdate('contraptionParts', newValue);
                                        }
                                    }}
                                    title="-1 Deploy Contraption"
                                >
                                    <i className="fas fa-minus"></i> -1
                                </button>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newValue = Math.max(0, localContraptionParts - 2);
                                        const amount = localContraptionParts - newValue;
                                        setLocalContraptionParts(newValue);
                                        if (amount > 0) {
                                            logClassResourceChange('Contraption Part', amount, false, 'contraptionParts');
                                            if (onClassResourceUpdate) onClassResourceUpdate('contraptionParts', newValue);
                                        }
                                    }}
                                    title="-2 Deploy Complex Device"
                                >
                                    <i className="fas fa-minus"></i> -2
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="toxicologist-quick-actions">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const gainAmount = maxContraptionParts - localContraptionParts;
                                    setLocalContraptionParts(maxContraptionParts);
                                    setShowContraptionMenu(false);
                                    if (gainAmount > 0) {
                                        logClassResourceChange('Contraption Part', gainAmount, true, 'contraptionParts');
                                        if (onClassResourceUpdate) onClassResourceUpdate('contraptionParts', maxContraptionParts);
                                    }
                                }} 
                                className="toxicologist-quick-btn"
                                title="Reset to Max"
                            >
                                <i className="fas fa-undo"></i>
                                <span>Max</span>
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowContraptionMenu(false);
                                }} 
                                className="toxicologist-quick-btn"
                                title="Close"
                            >
                                <i className="fas fa-times"></i>
                                <span>Close</span>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}


        </div>
    );
};

export default ToxicologistResourceBar;
