import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/SpellguardResourceBar.css';
import '../../../../styles/unified-context-menu.css';

const SpellguardResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', onClassResourceUpdate = null }) => {
    const [localAEP, setLocalAEP] = useState(45);
    const [selectedSpec, setSelectedSpec] = useState('arcaneWarden');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isAbsorbing, setIsAbsorbing] = useState(false);
    const [isSpending, setIsSpending] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);

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
        if (showTooltip && tooltipRef.current && barRef.current) {
            const updatePosition = () => {
                const tooltip = tooltipRef.current;
                const bar = barRef.current;
                if (!tooltip || !bar) {
                    requestAnimationFrame(updatePosition);
                    return;
                }

                const tooltipRect = tooltip.getBoundingClientRect();
                const barRect = bar.getBoundingClientRect();

                if (barRect.width === 0 && barRect.height === 0 && barRect.left === 0 && barRect.top === 0) {
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

                const tooltipWidth = tooltipRect.width > 0 ? tooltipRect.width : 300;
                const tooltipHeight = tooltipRect.height > 0 ? tooltipRect.height : 200;

                let left = barRect.left + (barRect.width / 2) - (tooltipWidth / 2);
                let top = hudBottom + margin;

                if (tooltipRect.width === 0 || tooltipRect.height === 0) {
                    requestAnimationFrame(updatePosition);
                }

                if (left < margin) {
                    left = margin;
                }
                if (left + tooltipWidth > viewportWidth - margin) {
                    left = viewportWidth - tooltipWidth - margin;
                }

                if (top + tooltipHeight > viewportHeight - margin) {
                    if (hudContainer) {
                        const hudRect = hudContainer.getBoundingClientRect();
                        top = hudRect.top - tooltipHeight - margin;
                    } else {
                        top = barRect.top - tooltipHeight - margin;
                    }
                    if (top < margin) {
                        top = margin;
                    }
                }

                tooltip.style.position = 'fixed';
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.transform = 'none';
                tooltip.style.zIndex = '2147483647';
                tooltip.style.borderRadius = '0';
                tooltip.style.padding = '10px 12px';
            };

            updatePosition();
            requestAnimationFrame(() => {
                requestAnimationFrame(updatePosition);
            });

            const timeoutId = setTimeout(updatePosition, 50);

            return () => clearTimeout(timeoutId);
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

    const adjustAEP = (amount) => {
        const newAEP = Math.max(0, Math.min(maxAEP, localAEP + amount));
        const actualAmount = Math.abs(newAEP - localAEP);
        setLocalAEP(newAEP);
        
        if (actualAmount > 0) {
            logClassResourceChange('AEP', actualAmount, amount > 0, 'aep');
            if (onClassResourceUpdate) onClassResourceUpdate('current', newAEP);
        }
        
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
                    context={context}
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
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip">
                    <div className="tooltip-header">Arcane Energy Points</div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Current:</strong> {localAEP}/{maxAEP} AEP
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Status:</strong> {
                                localAEP === 0 ? 'Empty' :
                                localAEP <= 15 ? 'Critical Low' :
                                localAEP <= 40 ? 'Building' :
                                localAEP <= 75 ? 'Optimal' : 'Maximum'
                            }
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">AEP Management</div>
                        <div className="level-management">
                            <strong>Generate:</strong>
                            <span>Magical +2, Physical +1/2, Mana +1</span>
                            <strong>Spend:</strong>
                            <span>Arcane shields, spell reflections, magical strikes</span>
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

            {/* AEP Controls Menu */}
            {showControls && barRef.current && ReactDOM.createPortal(
                <div
                    className={`unified-context-menu compact spellguard-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
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
                    <div className="context-menu-main spellguard-menu">
                        <div className="menu-title">AEP: {localAEP}/{maxAEP}</div>

                        {/* Specialization Selection */}
                        <div className="spellguard-spec-section">
                            <button
                                className="spellguard-spec-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cycleSpec();
                                }}
                                title={`${currentSpec.name}\n${currentSpec.passiveDesc}`}
                            >
                                <i className={`fas ${currentSpec.icon}`}></i>
                                <span>{currentSpec.name}</span>
                            </button>
                        </div>

                        <div className="spellguard-info-text">
                            {context === 'party' ? (
                                'Absorb magical damage to build AEP. Use for arcane shields, spell reflections, and magical strikes.'
                            ) : (
                                'Absorb magical damage to generate AEP. Spend on shields, reflections, and strikes.'
                            )}
                        </div>

                        {/* Quick Set AEP */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Quick Set</div>
                            <div className="spellguard-preset-grid">
                                <button 
                                    className="context-menu-button" 
                                    onClick={(e) => { e.stopPropagation(); setLocalAEP(0); }} 
                                    title="Empty (0 AEP)"
                                >
                                    0
                                </button>
                                <button 
                                    className="context-menu-button" 
                                    onClick={(e) => { e.stopPropagation(); setLocalAEP(25); }} 
                                    title="Quarter (25 AEP)"
                                >
                                    ¼
                                </button>
                                <button 
                                    className="context-menu-button" 
                                    onClick={(e) => { e.stopPropagation(); setLocalAEP(50); }} 
                                    title="Half (50 AEP)"
                                >
                                    ½
                                </button>
                                <button 
                                    className="context-menu-button" 
                                    onClick={(e) => { e.stopPropagation(); setLocalAEP(75); }} 
                                    title="Three Quarters (75 AEP)"
                                >
                                    ¾
                                </button>
                                <button 
                                    className="context-menu-button" 
                                    onClick={(e) => { e.stopPropagation(); setLocalAEP(100); }} 
                                    title="Full (100 AEP)"
                                >
                                    100
                                </button>
                            </div>
                        </div>

                        {/* Adjust AEP */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Adjust</div>
                            <div className="spellguard-adjust-grid">
                                <button 
                                    className="context-menu-button negative" 
                                    onClick={(e) => { e.stopPropagation(); adjustAEP(-10); }}
                                >
                                    -10
                                </button>
                                <button 
                                    className="context-menu-button negative" 
                                    onClick={(e) => { e.stopPropagation(); adjustAEP(-5); }}
                                >
                                    -5
                                </button>
                                <button 
                                    className="context-menu-button positive" 
                                    onClick={(e) => { e.stopPropagation(); adjustAEP(5); }}
                                >
                                    +5
                                </button>
                                <button 
                                    className="context-menu-button positive" 
                                    onClick={(e) => { e.stopPropagation(); adjustAEP(10); }}
                                >
                                    +10
                                </button>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="spellguard-quick-actions">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowControls(false); }} 
                                className="spellguard-quick-btn"
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

export default SpellguardResourceBar;

