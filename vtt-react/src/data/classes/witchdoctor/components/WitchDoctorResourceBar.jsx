import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/WitchDoctorResourceBar.css';

const WitchDoctorResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud' }) => {
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
            <div
                ref={tooltipRef}
                className="witchdoctor-tooltip beige-tooltip"
                style={{ position: 'fixed', zIndex: 2147483647 }}
            >
                <div className="tooltip-header">
                    <div className="tooltip-title">Voodoo Essence: {localEssence}/{maxEssence}</div>
                    <div className="tooltip-spec">{currentSpec.name}</div>
                </div>
                
                <div className="tooltip-section">
                    <div className="section-title">Generation</div>
                    <ul>
                        <li><strong>+1</strong> per curse applied</li>
                        <li><strong>+1</strong> per totem placed</li>
                        <li><strong>+2</strong> per ritual completed</li>
                        {selectedSpec === 'shadow-priest' && <li><strong>+1 bonus</strong> from curses (Shadow's Embrace)</li>}
                        {selectedSpec === 'spirit-healer' && <li><strong>+1 bonus</strong> from totems (Spirit's Blessing)</li>}
                        {selectedSpec === 'war-priest' && <li><strong>+1 bonus</strong> from poisons (Warrior's Spirit)</li>}
                    </ul>
                </div>
                
                <div className="tooltip-section">
                    <div className="section-title">Loa Invocations</div>
                    <ul>
                        <li><strong>Baron Samedi:</strong> 10 essence {selectedSpec === 'shadow-priest' && '(8 for Shadow Priest)'}</li>
                        <li><strong>Erzulie:</strong> 6 essence {selectedSpec === 'spirit-healer' && '(4 for Spirit Healer)'}</li>
                        <li><strong>Ogoun:</strong> 9 essence {selectedSpec === 'war-priest' && '(7 for War Priest)'}</li>
                        <li><strong>Simbi:</strong> 6 essence {selectedSpec === 'spirit-healer' && '(4 for Spirit Healer)'}</li>
                        <li><strong>Papa Legba:</strong> 7 essence {selectedSpec === 'war-priest' && '(5 for War Priest)'}</li>
                    </ul>
                </div>
                
                <div className="tooltip-section">
                    <div className="section-title">Shared Passive</div>
                    <div className="passive-name">{currentSpec.sharedPassive.name}</div>
                    <div className="passive-desc">{currentSpec.sharedPassive.description}</div>
                </div>
                
                <div className="tooltip-section">
                    <div className="section-title">Specialization Passive</div>
                    <div className="passive-name">{currentSpec.uniquePassive.name}</div>
                    <div className="passive-desc">{currentSpec.uniquePassive.description}</div>
                </div>
                
                {selectedSpec === 'shadow-priest' && (
                    <div className="tooltip-section">
                        <div className="section-title">Active Effects</div>
                        <div className="effect-status">Curses Active: {cursesActive ? 'Yes (life/death flicker)' : 'No'}</div>
                    </div>
                )}
                
                {selectedSpec === 'spirit-healer' && (
                    <div className="tooltip-section">
                        <div className="section-title">Active Effects</div>
                        <div className="effect-status">Totems Active: {totemsActive ? 'Yes (rhythmic pulse)' : 'No'}</div>
                    </div>
                )}
                
                {selectedSpec === 'war-priest' && (
                    <div className="tooltip-section">
                        <div className="section-title">Active Effects</div>
                        <div className="effect-status">Poisons Applied: {poisonsApplied} (core intensity: {Math.min(poisonsApplied * 20, 100)}%)</div>
                    </div>
                )}
            </div>
        );
        
        return ReactDOM.createPortal(tooltipContent, document.body);
    };
    
    return (
        <div className={`witchdoctor-resource-container ${size}`}>
            <div className="resource-bar-row">
                {/* Specialization Cycle Button */}
                <button
                    className="spec-cycle-btn"
                    style={{
                        borderColor: currentSpec.glowColor,
                        color: currentSpec.activeColor
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowSpecSelector(!showSpecSelector);
                    }}
                    title="Change Specialization"
                >
                    <i className={currentSpec.icon}></i>
                </button>
                
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

            {/* Dev Controls */}
            {showControls && (
                <div className="dev-controls-overlay" onClick={() => setShowControls(false)}>
                    <div className="dev-controls-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="dev-controls-header">
                            <i className="fas fa-cog"></i> Witch Doctor Dev Controls
                        </div>

                        {/* Essence Control */}
                        <div className="control-section">
                            <div className="control-label">Voodoo Essence: {localEssence}/{maxEssence}</div>
                            <input
                                type="range"
                                min="0"
                                max={maxEssence}
                                value={localEssence}
                                onChange={(e) => setLocalEssence(parseInt(e.target.value))}
                                className="essence-slider"
                            />
                            <div className="control-buttons">
                                <button onClick={() => setLocalEssence(Math.max(0, localEssence - 1))}>-1</button>
                                <button onClick={() => setLocalEssence(0)}>Clear</button>
                                <button onClick={() => setLocalEssence(maxEssence)}>Max</button>
                                <button onClick={() => setLocalEssence(Math.min(maxEssence, localEssence + 1))}>+1</button>
                            </div>
                        </div>

                        {/* Loa Invocation Tests */}
                        <div className="control-section">
                            <div className="control-label">Test Loa Invocations</div>
                            <div className="loa-buttons">
                                <button
                                    onClick={() => triggerLoaFlash('samedi')}
                                    style={{ backgroundColor: loaColors.samedi }}
                                >
                                    Baron Samedi
                                </button>
                                <button
                                    onClick={() => triggerLoaFlash('erzulie')}
                                    style={{ backgroundColor: loaColors.erzulie }}
                                >
                                    Erzulie
                                </button>
                                <button
                                    onClick={() => triggerLoaFlash('ogoun')}
                                    style={{ backgroundColor: loaColors.ogoun }}
                                >
                                    Ogoun
                                </button>
                                <button
                                    onClick={() => triggerLoaFlash('simbi')}
                                    style={{ backgroundColor: loaColors.simbi }}
                                >
                                    Simbi
                                </button>
                                <button
                                    onClick={() => triggerLoaFlash('legba')}
                                    style={{ backgroundColor: loaColors.legba }}
                                >
                                    Papa Legba
                                </button>
                            </div>
                        </div>

                        {/* Specialization Passive States */}
                        {selectedSpec === 'shadow-priest' && (
                            <div className="control-section">
                                <div className="control-label">Shadow Priest Effects</div>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={cursesActive}
                                        onChange={(e) => setCursesActive(e.target.checked)}
                                    />
                                    Curses Active (life/death flicker)
                                </label>
                            </div>
                        )}

                        {selectedSpec === 'spirit-healer' && (
                            <div className="control-section">
                                <div className="control-label">Spirit Healer Effects</div>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={totemsActive}
                                        onChange={(e) => setTotemsActive(e.target.checked)}
                                    />
                                    Totems Active (rhythmic pulse)
                                </label>
                            </div>
                        )}

                        {selectedSpec === 'war-priest' && (
                            <div className="control-section">
                                <div className="control-label">War Priest Effects</div>
                                <div className="control-sublabel">Poisons Applied: {poisonsApplied}</div>
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    value={poisonsApplied}
                                    onChange={(e) => setPoisonsApplied(parseInt(e.target.value))}
                                    className="poison-slider"
                                />
                                <div className="control-info">Core Intensity: {Math.min(poisonsApplied * 20, 100)}%</div>
                            </div>
                        )}

                        <div className="control-section">
                            <button
                                className="close-btn"
                                onClick={() => setShowControls(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WitchDoctorResourceBar;

