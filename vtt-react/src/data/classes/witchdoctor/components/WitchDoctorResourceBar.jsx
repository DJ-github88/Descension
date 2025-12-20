import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/WitchDoctorResourceBar.css';

const WitchDoctorResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', onClassResourceUpdate = null }) => {
    // Local state for dev controls
    const [localEssence, setLocalEssence] = useState(8);
    const [selectedSpec, setSelectedSpec] = useState('shadow-priest');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showSpecSelector, setShowSpecSelector] = useState(false);
    
    // Specialization passive states
    const [cursesActive, setCursesActive] = useState(true);
    const [totemsActive, setTotemsActive] = useState(false);
    const [poisonsApplied, setPoisonsApplied] = useState(3);
    
    // Loa invocation flash states
    const [loaFlash, setLoaFlash] = useState(null); // 'samedi', 'erzulie', 'ogoun', 'simbi', 'legba'
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);
    
    const maxEssence = 15;
    
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
    
    // Determine visual stage based on essence level
    const getStage = (essence) => {
        if (essence <= 5) return 'dim';
        if (essence <= 10) return 'glow';
        return 'flicker';
    };
    
    const stage = getStage(localEssence);
    
    // Specialization configurations
    const specs = {
        'shadow-priest': {
            name: 'Shadow Priest',
            icon: 'fas fa-skull',
            baseColor: '#2D1B4E',
            activeColor: '#8B008B',
            glowColor: '#9370DB',
            theme: 'Necromancy & Death Magic',
            sharedPassive: {
                name: "Loa's Favor",
                description: "Generate Voodoo Essence through curses, poisons, totems, and rituals. Spend essence to invoke powerful loa spirits."
            },
            uniquePassive: {
                name: "Shadow's Embrace",
                description: "Baron Samedi invocations cost 2 less essence. Curses generate +1 additional essence. Bar flickers between life and death hues when curses are active."
            }
        },
        'spirit-healer': {
            name: 'Spirit Healer',
            icon: 'fas fa-hand-holding-heart',
            baseColor: '#1A472A',
            activeColor: '#32CD32',
            glowColor: '#98FB98',
            theme: 'Totems & Protection',
            sharedPassive: {
                name: "Loa's Favor",
                description: "Generate Voodoo Essence through curses, poisons, totems, and rituals. Spend essence to invoke powerful loa spirits."
            },
            uniquePassive: {
                name: "Spirit's Blessing",
                description: "Erzulie and Simbi invocations cost 2 less essence. Totems generate +1 additional essence. Bar pulses rhythmically while totems are active."
            }
        },
        'war-priest': {
            name: 'War Priest',
            icon: 'fas fa-fire',
            baseColor: '#4A1C1C',
            activeColor: '#DC143C',
            glowColor: '#FF6347',
            theme: 'Aggressive Channeling',
            sharedPassive: {
                name: "Loa's Favor",
                description: "Generate Voodoo Essence through curses, poisons, totems, and rituals. Spend essence to invoke powerful loa spirits."
            },
            uniquePassive: {
                name: "Warrior's Spirit",
                description: "Ogoun and Papa Legba invocations cost 2 less essence. Poisons generate +1 additional essence and deal +2d6 damage. Bar gains fiery core that brightens with each poison or melee hit."
            }
        }
    };
    
    const currentSpec = specs[selectedSpec];
    
    // Loa color signatures
    const loaColors = {
        samedi: '#4B0082',      // Violet-black
        erzulie: '#DAA520',     // Rose-gold
        ogoun: '#DC143C',       // Ember red
        simbi: '#40E0D0',       // Turquoise
        legba: '#FFB347'        // Amber
    };
    
    // Auto-position tooltip
    useEffect(() => {
        if (showTooltip && barRef.current && tooltipRef.current) {
            const barRect = barRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let x = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            let y = barRect.top - tooltipRect.height - 10;
            
            // Adjust if off-screen
            if (x < 10) x = 10;
            if (x + tooltipRect.width > viewportWidth - 10) x = viewportWidth - tooltipRect.width - 10;
            if (y < 10) y = barRect.bottom + 10;
            
            tooltipRef.current.style.left = `${x}px`;
            tooltipRef.current.style.top = `${y}px`;
        }
    }, [showTooltip, localEssence, selectedSpec, cursesActive, totemsActive, poisonsApplied]);
    
    // Trigger loa flash effect
    const triggerLoaFlash = (loa) => {
        setLoaFlash(loa);
        setTimeout(() => setLoaFlash(null), 800);
    };
    
    // Render essence segments
    const renderEssenceSegments = () => {
        return Array.from({ length: maxEssence }, (_, i) => {
            const isFilled = i < localEssence;
            return (
                <div
                    key={i}
                    className={`essence-segment ${isFilled ? 'filled' : 'empty'}`}
                    style={{
                        backgroundColor: isFilled ? currentSpec.activeColor : 'rgba(0, 0, 0, 0.3)',
                        boxShadow: isFilled ? `0 0 6px ${currentSpec.glowColor}` : 'none'
                    }}
                />
            );
        });
    };
    
    // Render tooltip
    const renderTooltip = () => {
        if (!showTooltip) return null;

        const tooltipContent = (
            <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip">
                <div className="tooltip-header">
                    <div className="tooltip-title">⚝ ☥ ⚶ {localEssence}/{maxEssence} - {currentSpec.name}</div>
                </div>

                <div className="tooltip-content">
                    <div className="compact-info">
                        <div className="explanatory-text">
                            Voodoo Essence - mystical energy from curses, totems, and rituals. Spend to invoke powerful loa spirits.
                        </div>

                        <div className="gen-info">
                            <strong>Generation:</strong> +1 curse/totem, +2 ritual
                            {selectedSpec === 'shadow-priest' && <span className="spec-bonus"> (+1 curses)</span>}
                            {selectedSpec === 'spirit-healer' && <span className="spec-bonus"> (+1 totems)</span>}
                            {selectedSpec === 'war-priest' && <span className="spec-bonus"> (+1 poisons)</span>}
                        </div>

                        <div className="loa-info">
                            <strong>Loa:</strong> Samedi {selectedSpec === 'shadow-priest' ? '8' : '10'},
                            Erzulie {selectedSpec === 'spirit-healer' ? '4' : '6'},
                            Ogoun {selectedSpec === 'war-priest' ? '7' : '9'},
                            Simbi {selectedSpec === 'spirit-healer' ? '4' : '6'},
                            Legba {selectedSpec === 'war-priest' ? '5' : '7'}
                        </div>

                        {((selectedSpec === 'shadow-priest' && cursesActive) ||
                          (selectedSpec === 'spirit-healer' && totemsActive) ||
                          (selectedSpec === 'war-priest' && poisonsApplied > 0)) && (
                            <div className="active-info">
                                <strong>Active:</strong>
                                {selectedSpec === 'shadow-priest' && cursesActive && " Curses (life/death flicker)"}
                                {selectedSpec === 'spirit-healer' && totemsActive && " Totems (rhythmic pulse)"}
                                {selectedSpec === 'war-priest' && poisonsApplied > 0 && ` ${poisonsApplied} poisons (${Math.min(poisonsApplied * 20, 100)}% intensity)`}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );

        return ReactDOM.createPortal(tooltipContent, document.body);
    };
    
    return (
        <div className={`witchdoctor-resource-container ${size}`}>
            <div className="resource-bar-row">
                {/* Main Resource Bar */}
                <div
                    ref={barRef}
                    className={`witchdoctor-resource-bar ${size} stage-${stage} ${selectedSpec} ${loaFlash ? `loa-flash-${loaFlash}` : ''} ${selectedSpec === 'shadow-priest' && cursesActive ? 'shadow-flicker' : ''} ${selectedSpec === 'spirit-healer' && totemsActive ? 'spirit-pulse' : ''} ${selectedSpec === 'war-priest' && poisonsApplied > 0 ? 'war-core' : ''} clickable`}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowControls(!showControls)}
                    style={{
                        '--spec-base-color': currentSpec.baseColor,
                        '--spec-active-color': currentSpec.activeColor,
                        '--spec-glow-color': currentSpec.glowColor,
                        '--war-core-intensity': Math.min(poisonsApplied * 20, 100) + '%'
                    }}
                >
                    {/* Voodoo background pattern */}
                    <div className="voodoo-background"></div>
                    
                    {/* Spiritual energy overlay */}
                    <div className="spiritual-energy">
                        <div className="energy-wisp"></div>
                        <div className="energy-wisp"></div>
                        <div className="energy-wisp"></div>
                    </div>
                    
                    {/* Essence segments */}
                    <div className="essence-segments">
                        {renderEssenceSegments()}
                    </div>
                    
                    {/* Runic glyphs (visible at glow/flicker stages) */}
                    {(stage === 'glow' || stage === 'flicker') && (
                        <div className="runic-glyphs">
                            <div className="glyph">⚝</div>
                            <div className="glyph">☥</div>
                            <div className="glyph">⚶</div>
                        </div>
                    )}
                    
                    {/* War Priest fiery core */}
                    {selectedSpec === 'war-priest' && poisonsApplied > 0 && (
                        <div className="fiery-core"></div>
                    )}
                    
                    {/* Essence count overlay */}
                    <div className="essence-count">
                        {localEssence}/{maxEssence}
                    </div>
                </div>
            </div>
            
            {/* Tooltip */}
            {renderTooltip()}
            
            {/* Specialization Selector */}
            {showSpecSelector && (
                <div className="spec-selector-overlay" onClick={() => setShowSpecSelector(false)}>
                    <div className="spec-selector-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="spec-selector-header">Select Specialization</div>
                        {Object.entries(specs).map(([key, spec]) => (
                            <div
                                key={key}
                                className={`spec-option ${selectedSpec === key ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedSpec(key);
                                    setShowSpecSelector(false);
                                }}
                                style={{
                                    borderColor: selectedSpec === key ? spec.glowColor : 'transparent',
                                    backgroundColor: selectedSpec === key ? `${spec.baseColor}88` : 'transparent'
                                }}
                            >
                                <div className="spec-name" style={{ color: spec.activeColor }}>
                                    <i className={spec.icon}></i> {spec.name}
                                </div>
                                <div className="spec-theme">{spec.theme}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Compact Dev Controls */}
            {showControls && (
                <div className="compact-dev-overlay" onClick={() => setShowControls(false)}>
                    <div
                        className="compact-dev-panel"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1000,
                            marginTop: '4px'
                        }}
                    >
                        {/* Row 1: Essence Controls */}
                        <div className="compact-row">
                            <div className="compact-essence-section">
                                <span className="compact-section-label">Essence:</span>
                                <div className="compact-essence-btns">
                                    <button onClick={() => {
                                        const newValue = Math.max(0, localEssence - 1);
                                        const amount = localEssence - newValue;
                                        setLocalEssence(newValue);
                                        if (amount > 0) {
                                            logClassResourceChange('Voodoo Essence', amount, false, 'voodooEssence');
                                            if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                        }
                                    }} title="Decrease Essence">
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <button onClick={() => {
                                        const resetAmount = localEssence;
                                        setLocalEssence(0);
                                        if (resetAmount > 0) {
                                            logClassResourceChange('Voodoo Essence', resetAmount, false, 'voodooEssence');
                                            if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                        }
                                    }} title="Clear Essence">
                                        <i className="fas fa-times"></i>
                                    </button>
                                    <button onClick={() => {
                                        const gainAmount = maxEssence - localEssence;
                                        setLocalEssence(maxEssence);
                                        if (gainAmount > 0) {
                                            logClassResourceChange('Voodoo Essence', gainAmount, true, 'voodooEssence');
                                            if (onClassResourceUpdate) onClassResourceUpdate('current', maxEssence);
                                        }
                                    }} title="Max Essence">
                                        <i className="fas fa-infinity"></i>
                                    </button>
                                    <button onClick={() => {
                                        const newValue = Math.min(maxEssence, localEssence + 1);
                                        const amount = newValue - localEssence;
                                        setLocalEssence(newValue);
                                        if (amount > 0) {
                                            logClassResourceChange('Voodoo Essence', amount, true, 'voodooEssence');
                                            if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                        }
                                    }} title="Increase Essence">
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Specialization Selection */}
                        <div className="compact-row">
                            <div className="compact-spec-section">
                                <div className="compact-spec-buttons">
                                    <button
                                        className={`spec-select-btn ${selectedSpec === 'shadow-priest' ? 'active' : ''}`}
                                        onClick={() => setSelectedSpec('shadow-priest')}
                                        title="Shadow Priest - Necromancy & Death Magic"
                                    >
                                        <i className="fas fa-skull"></i>
                                        <span>Shadow Priest</span>
                                        <small>Death Magic</small>
                                    </button>
                                    <button
                                        className={`spec-select-btn ${selectedSpec === 'spirit-healer' ? 'active' : ''}`}
                                        onClick={() => setSelectedSpec('spirit-healer')}
                                        title="Spirit Healer - Totems & Protection"
                                    >
                                        <i className="fas fa-hand-holding-heart"></i>
                                        <span>Spirit Healer</span>
                                        <small>Protection</small>
                                    </button>
                                    <button
                                        className={`spec-select-btn ${selectedSpec === 'war-priest' ? 'active' : ''}`}
                                        onClick={() => setSelectedSpec('war-priest')}
                                        title="War Priest - Aggressive Channeling"
                                    >
                                        <i className="fas fa-fire"></i>
                                        <span>War Priest</span>
                                        <small>Combat</small>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Loa Quick Tests */}
                        <div className="compact-row">
                            <div className="compact-loa-section">
                                <span className="compact-section-label">Loa:</span>
                                <div className="compact-loa-btns">
                                    <button className="loa-beige-btn" onClick={() => triggerLoaFlash('samedi')} title="Baron Samedi - Death & Shadow">
                                        <i className="fas fa-skull"></i>
                                        <span>Samedi</span>
                                    </button>
                                    <button className="loa-beige-btn" onClick={() => triggerLoaFlash('erzulie')} title="Erzulie - Love & Healing">
                                        <i className="fas fa-heart"></i>
                                        <span>Erzulie</span>
                                    </button>
                                    <button className="loa-beige-btn" onClick={() => triggerLoaFlash('ogoun')} title="Ogoun - War & Strength">
                                        <i className="fas fa-fire"></i>
                                        <span>Ogoun</span>
                                    </button>
                                    <button className="loa-beige-btn" onClick={() => triggerLoaFlash('simbi')} title="Simbi - Water & Magic">
                                        <i className="fas fa-water"></i>
                                        <span>Simbi</span>
                                    </button>
                                    <button className="loa-beige-btn" onClick={() => triggerLoaFlash('legba')} title="Papa Legba - Crossroads & Fate">
                                        <i className="fas fa-key"></i>
                                        <span>Legba</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Effects Toggle */}
                        <div className="compact-row">
                            <div className="compact-effects-section">
                                <span className="compact-section-label">Effects:</span>
                                <div className="compact-effect-controls">
                                    {selectedSpec === 'shadow-priest' && (
                                        <label className="compact-toggle">
                                            <input
                                                type="checkbox"
                                                checked={cursesActive}
                                                onChange={(e) => setCursesActive(e.target.checked)}
                                            />
                                            <span title="Curses Active (life/death flicker)">C</span>
                                        </label>
                                    )}
                                    {selectedSpec === 'spirit-healer' && (
                                        <label className="compact-toggle">
                                            <input
                                                type="checkbox"
                                                checked={totemsActive}
                                                onChange={(e) => setTotemsActive(e.target.checked)}
                                            />
                                            <span title="Totems Active (rhythmic pulse)">T</span>
                                        </label>
                                    )}
                                    {selectedSpec === 'war-priest' && (
                                        <div className="compact-war-controls">
                                            <span className="compact-war-label" title={`Poisons: ${poisonsApplied} (${Math.min(poisonsApplied * 20, 100)}% intensity)`}>
                                                P:{poisonsApplied}
                                            </span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="5"
                                                value={poisonsApplied}
                                                onChange={(e) => setPoisonsApplied(parseInt(e.target.value))}
                                                className="compact-poison-range"
                                                title={`Poisons: ${poisonsApplied}`}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WitchDoctorResourceBar;

