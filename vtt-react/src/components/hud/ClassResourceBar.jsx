import React, { useState } from 'react';
import { getClassResourceConfig } from '../../data/classResources';
import TooltipPortal from '../tooltips/TooltipPortal';

const ClassResourceBar = ({
    characterClass,
    classResource,
    isGMMode = false,
    onResourceClick = null,
    size = 'normal' // 'small', 'normal', 'large'
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // State for Arcanoneer spheres (local state for interactive demo)
    const [localSpheres, setLocalSpheres] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [showControls, setShowControls] = useState(false);

    // State for Arcanoneer specialization
    const [activeSpecialization, setActiveSpecialization] = useState('prism-mage'); // 'prism-mage', 'entropy-weaver', 'sphere-architect'
    const [rerollsUsed, setRerollsUsed] = useState(0);
    const [swapMode, setSwapMode] = useState(false);
    const [selectedForSwap, setSelectedForSwap] = useState([]);

    // Get class configuration
    const config = getClassResourceConfig(characterClass);

    // Don't render if no valid class or if class is the default 'Class' placeholder
    if (!characterClass || characterClass === 'Class') {
        return null;
    }

    // If no config exists, create a default one for unknown classes
    const defaultConfig = {
        id: 'classResource',
        name: 'Class Resource',
        shortName: 'CR',
        type: 'default',
        description: 'Class-specific resource',
        visual: {
            type: 'progress-bar',
            baseColor: '#2D1B69',
            activeColor: '#9370DB',
            glowColor: '#DDA0DD',
            icon: '⚡'
        },
        mechanics: {
            max: 5,
            current: 0
        },
        tooltip: {
            title: 'Class Resource: {current}/{max}',
            description: 'Class-specific resource for special abilities'
        }
    };

    const finalConfig = config || defaultConfig;
    const finalClassResource = classResource || { current: 0, max: finalConfig.mechanics.max || 5 };

    // Calculate percentage for progress bars
    const percentage = finalClassResource.max > 0 ? (finalClassResource.current / finalClassResource.max) * 100 : 0;

    // Handle mouse events for tooltip (following item tooltip pattern)
    const handleMouseEnter = (e) => {
        setShowTooltip(true);
        setTooltipPosition({
            x: e.clientX + 15,
            y: e.clientY - 10
        });
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const handleMouseMove = (e) => {
        if (showTooltip) {
            setTooltipPosition({
                x: e.clientX + 15,
                y: e.clientY - 10
            });
        }
    };

    // Handle click events for GM mode
    const handleClick = (e) => {
        if (isGMMode && onResourceClick) {
            e.stopPropagation();
            onResourceClick(finalClassResource.type || finalConfig.id);
        }
    };

    // Render different resource types
    const renderResourceDisplay = () => {
        switch (finalConfig.visual.type) {
            case 'orbs':
                return renderOrbs();
            case 'staff':
                return renderMusicalStaff();
            case 'gauge':
                return renderGauge();
            case 'vortex':
                return renderVortex();
            case 'deck':
                return renderCardDeck();
            case 'casino':
                return renderCasino();
            case 'stigmata':
                return renderStigmata();
            case 'corrupted-halo':
                return renderCorruptedHalo();
            case 'medallion':
                return renderMedallion();
            case 'vials':
                return renderVials();
            case 'phylactery':
                return renderPhylactery();
            case 'scythe':
                return renderScythe();
            case 'elemental-spheres':
                return renderElementalSpheres();
            case 'progress-bar':
                return renderProgressBar();
            default:
                return renderProgressBar();
        }
    };

    // Progress bar (default/fallback)
    const renderProgressBar = () => {
        const hasChaoticWave = finalConfig.visual.effects?.includes('chaotic-wave');

        // Debug logging
        console.log('ClassResourceBar Debug:', {
            characterClass,
            hasChaoticWave,
            effects: finalConfig.visual.effects,
            activeColor: finalConfig.visual.activeColor,
            percentage
        });

        return (
            <div className={`class-resource-bar progress-bar ${size}`}>
                <div className="bar-background">
                    <div
                        className={`bar-fill ${hasChaoticWave ? 'chaotic-wave-bar' : ''}`}
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: hasChaoticWave ? '#1E3A8A !important' : finalConfig.visual.activeColor,
                            boxShadow: hasChaoticWave ? '0 0 15px rgba(59, 130, 246, 0.6) !important' : `0 0 8px ${finalConfig.visual.glowColor}`,
                        }}
                        data-effect={hasChaoticWave ? 'chaotic-wave' : undefined}
                    />
                    <div className="bar-text">
                        {finalClassResource.current}/{finalClassResource.max} {finalConfig.shortName}
                    </div>
                </div>
            </div>
        );
    };

    // Orbs display (legacy - now using progress bar)
    const renderOrbs = () => (
        <div className={`class-resource-bar orbs-display ${size}`}>
            <div className="orbs-container">
                {Array.from({ length: finalConfig.visual.count }, (_, i) => (
                    <div
                        key={i}
                        className={`orb ${i <= finalClassResource.current ? 'active' : 'inactive'}`}
                        style={{
                            backgroundColor: i <= finalClassResource.current ? finalConfig.visual.activeColor : finalConfig.visual.baseColor,
                            boxShadow: i <= finalClassResource.current ? `0 0 6px ${finalConfig.visual.glowColor}` : 'none'
                        }}
                    >
                        <span className="orb-icon">{finalConfig.visual.icon}</span>
                    </div>
                ))}
            </div>
            <div className="resource-label">{finalConfig.shortName}: {finalClassResource.current}</div>
        </div>
    );

    // Musical staff (Minstrel)
    const renderMusicalStaff = () => (
        <div className={`class-resource-bar musical-staff ${size}`}>
            <div className="staff-container">
                <div className="staff-lines">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="staff-line" />
                    ))}
                </div>
                <div className="notes-container">
                    {config.notes && config.notes.map((note, i) => (
                        <div 
                            key={i}
                            className={`note ${classResource.stacks.includes(note.name) ? 'active' : 'inactive'}`}
                            style={{
                                color: classResource.stacks.includes(note.name) ? note.color : config.visual.baseColor,
                                left: `${(i / config.notes.length) * 100}%`
                            }}
                        >
                            {config.visual.icon}
                        </div>
                    ))}
                </div>
            </div>
            <div className="resource-label">{config.shortName}: {classResource.stacks.length}/7</div>
        </div>
    );

    // Gauge display (Chronarch)
    const renderGauge = () => (
        <div className={`class-resource-bar gauge-display ${size}`}>
            <div className="gauge-container">
                <div className="gauge-background">
                    <div 
                        className="gauge-fill"
                        style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${config.visual.baseColor}, ${config.visual.activeColor})`,
                            boxShadow: `0 0 8px ${config.visual.glowColor}`
                        }}
                    />
                    {config.thresholds && config.thresholds.map((threshold, i) => (
                        <div 
                            key={i}
                            className="threshold-marker"
                            style={{
                                left: `${(threshold.value / classResource.max) * 100}%`,
                                backgroundColor: classResource.current >= threshold.value ? config.visual.activeColor : config.visual.baseColor
                            }}
                        />
                    ))}
                </div>
                <div className="gauge-icon">{config.visual.icon}</div>
            </div>
            <div className="resource-label">{classResource.current}/{classResource.max} {config.shortName}</div>
        </div>
    );

    // Vortex display (Chaos Weaver)
    const renderVortex = () => (
        <div className={`class-resource-bar vortex-display ${size}`}>
            <div className="vortex-container">
                <div className="chaos-vortex">
                    <div className="vortex-center">{config.visual.icon}</div>
                    <div className="entropy-counter">{classResource.current}</div>
                </div>
                <div className="dice-display">
                    {config.dice && config.dice.map((die, i) => (
                        <div key={i} className="chaos-die" title={die}>
                            <i className="fas fa-dice"></i>
                        </div>
                    ))}
                </div>
            </div>
            <div className="resource-label">EP: {classResource.current}/{classResource.max}</div>
        </div>
    );

    // Card deck display (Fate Weaver)
    const renderCardDeck = () => (
        <div className={`class-resource-bar card-deck ${size}`}>
            <div className="deck-container">
                <div className="deck-stack">
                    <div className="deck-icon">{config.visual.icon}</div>
                    <div className="deck-count">{classResource.max - classResource.current}</div>
                </div>
                <div className="hand-display">
                    {Array.from({ length: classResource.current }, (_, i) => (
                        <div key={i} className="card-in-hand"><i className="fas fa-clone"></i></div>
                    ))}
                </div>
            </div>
            <div className="resource-label">Hand: {classResource.current}</div>
        </div>
    );

    // Casino display (Gambler)
    const renderCasino = () => (
        <div className={`class-resource-bar casino-display ${size}`}>
            <div className="casino-container">
                <div className="luck-meter">
                    <div className="meter-fill" style={{ width: `${percentage}%`, backgroundColor: config.visual.activeColor }} />
                    <div className="meter-label">Luck: {classResource.current}</div>
                </div>
                <div className="risk-meter">
                    <div className="meter-fill" style={{ width: `${(classResource.risk / 10) * 100}%`, backgroundColor: config.visual.riskColor }} />
                    <div className="meter-label">Risk: {classResource.risk}</div>
                </div>
                <div className="casino-icon">{config.visual.icon}</div>
            </div>
        </div>
    );

    // Stigmata display (Martyr)
    const renderStigmata = () => (
        <div className={`class-resource-bar stigmata-display ${size}`}>
            <div className="stigmata-container">
                <div className="holy-symbol">{config.visual.icon}</div>
                <div className="pain-charges">
                    {Array.from({ length: classResource.current }, (_, i) => (
                        <div key={i} className="pain-charge" style={{ color: config.visual.activeColor }}>
                            ✚
                        </div>
                    ))}
                </div>
            </div>
            <div className="resource-label">Pain: {classResource.current}</div>
        </div>
    );

    // Corrupted halo (False Prophet)
    const renderCorruptedHalo = () => (
        <div className={`class-resource-bar corrupted-halo ${size}`}>
            <div className="halo-container">
                <div className="corrupted-symbol" style={{ color: config.visual.activeColor }}>
                    {config.visual.icon}
                </div>
                <div className="heresy-points">
                    {Array.from({ length: classResource.current }, (_, i) => (
                        <div key={i} className="heresy-point" style={{ backgroundColor: config.visual.glowColor }} />
                    ))}
                </div>
            </div>
            <div className="resource-label">Heresy: {classResource.current}/{classResource.max}</div>
        </div>
    );

    // Medallion display (Exorcist)
    const renderMedallion = () => (
        <div className={`class-resource-bar medallion-display ${size}`}>
            <div className="medallion-container">
                <div className="holy-medallion">{config.visual.icon}</div>
                <div className="spirit-gems">
                    {Array.from({ length: classResource.max }, (_, i) => (
                        <div 
                            key={i}
                            className={`spirit-gem ${i < classResource.current ? 'charged' : 'empty'}`}
                            style={{
                                backgroundColor: i < classResource.current ? config.visual.activeColor : config.visual.baseColor,
                                boxShadow: i < classResource.current ? `0 0 4px ${config.visual.glowColor}` : 'none'
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="resource-label">Spirit: {classResource.current}/{classResource.max}</div>
        </div>
    );

    // Vials display (Plaguebringer, Toxicologist)
    const renderVials = () => (
        <div className={`class-resource-bar vials-display ${size}`}>
            <div className="vials-container">
                {Array.from({ length: Math.min(classResource.max, 8) }, (_, i) => (
                    <div 
                        key={i}
                        className={`vial ${i < classResource.current ? 'filled' : 'empty'}`}
                        style={{
                            backgroundColor: i < classResource.current ? config.visual.activeColor : config.visual.baseColor
                        }}
                    >
                        {config.visual.icon}
                    </div>
                ))}
            </div>
            <div className="resource-label">{config.shortName}: {classResource.current}/{classResource.max}</div>
        </div>
    );

    // Phylactery display (Lichborne)
    const renderPhylactery = () => (
        <div className={`class-resource-bar phylactery-display ${size}`}>
            <div className="phylactery-container">
                <div className="phylactery-core">{config.visual.icon}</div>
                <div className="soul-wisps">
                    {Array.from({ length: classResource.current }, (_, i) => (
                        <div 
                            key={i}
                            className="soul-wisp"
                            style={{
                                backgroundColor: config.visual.glowColor,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="resource-label">Echoes: {classResource.current}/{classResource.max}</div>
        </div>
    );

    // Scythe display (Deathcaller)
    const renderScythe = () => (
        <div className={`class-resource-bar scythe-display ${size}`}>
            <div className="scythe-container">
                <div className="death-scythe">{config.visual.icon}</div>
                <div className="soul-orbs">
                    {Array.from({ length: classResource.current }, (_, i) => (
                        <div
                            key={i}
                            className="soul-orb"
                            style={{ backgroundColor: config.visual.activeColor }}
                        />
                    ))}
                </div>
            </div>
            <div className="resource-label">Souls: {classResource.current}/{classResource.max}</div>
        </div>
    );

    // Elemental Spheres display (Arcanoneer)
    const renderElementalSpheres = () => {
        // Use local state for interactive demo (all sizes use localSpheres for now)
        const activeSpheres = localSpheres;

        // Count spheres by element type
        const sphereCounts = {};
        (activeSpheres || []).forEach(elementId => {
            sphereCounts[elementId] = (sphereCounts[elementId] || 0) + 1;
        });

        // Get element configuration by ID
        const getElementConfig = (elementId) => {
            return finalConfig.elements?.find(el => el.id === elementId);
        };

        // Roll spheres based on specialization
        const rollSpheres = () => {
            setIsRolling(true);
            setRerollsUsed(0); // Reset rerolls for new turn
            const newSpheres = [];

            // Determine number of dice based on specialization
            const diceCount = activeSpecialization === 'entropy-weaver' ? 5 : 4;

            // Roll dice
            for (let i = 0; i < diceCount; i++) {
                const roll = Math.floor(Math.random() * 8) + 1; // 1-8
                const element = finalConfig.elements?.find(el => el.d8Value === roll);
                if (element) {
                    newSpheres.push(element.id);
                }
            }

            // Add to existing spheres (banking)
            setTimeout(() => {
                setLocalSpheres([...activeSpheres, ...newSpheres]);
                setIsRolling(false);
            }, 500); // Animation delay
        };

        // Clear all spheres
        const clearSpheres = () => {
            setLocalSpheres([]);
        };

        // Remove a sphere (simulate spending)
        const removeElement = (elementId) => {
            const index = activeSpheres.indexOf(elementId);
            if (index > -1) {
                const newSpheres = [...activeSpheres];
                newSpheres.splice(index, 1);
                setLocalSpheres(newSpheres);
            }
        };

        // Reroll spheres (Prism Mage)
        const rerollSphere = (index) => {
            if (activeSpecialization !== 'prism-mage') return;
            if (rerollsUsed >= 2) return; // Max 2 rerolls per turn

            const newSpheres = [...activeSpheres];
            const roll = Math.floor(Math.random() * 8) + 1;
            const element = finalConfig.elements?.find(el => el.d8Value === roll);
            if (element) {
                newSpheres[index] = element.id;
                setLocalSpheres(newSpheres);
                setRerollsUsed(rerollsUsed + 1);
            }
        };

        // Swap spheres (Sphere Architect)
        const handleSphereSwap = (elementId) => {
            if (activeSpecialization !== 'sphere-architect') return;

            if (selectedForSwap.length === 0) {
                // First sphere selected
                setSelectedForSwap([elementId]);
            } else if (selectedForSwap.length === 1) {
                // Second sphere selected - perform swap
                const firstIndex = activeSpheres.indexOf(selectedForSwap[0]);
                const secondIndex = activeSpheres.indexOf(elementId);

                if (firstIndex > -1 && secondIndex > -1 && firstIndex !== secondIndex) {
                    const newSpheres = [...activeSpheres];
                    // Swap the elements
                    [newSpheres[firstIndex], newSpheres[secondIndex]] = [newSpheres[secondIndex], newSpheres[firstIndex]];
                    setLocalSpheres(newSpheres);
                }
                setSelectedForSwap([]);
                setSwapMode(false);
            }
        };

        // Toggle controls on click (for HUD/account)
        const handleContainerClick = () => {
            if (size !== 'large') {
                setShowControls(!showControls);
            }
        };

        return (
            <div className={`elemental-spheres-container ${size}`}>
                {/* Specialization selector and sphere count header for large size */}
                {size === 'large' && (
                    <div className="sphere-top-controls">
                        <select
                            value={activeSpecialization}
                            onChange={(e) => {
                                setActiveSpecialization(e.target.value);
                                setRerollsUsed(0);
                                setSelectedForSwap([]);
                                setSwapMode(false);
                            }}
                            className="spec-dropdown-top"
                            title="Select Specialization"
                        >
                            <option value="prism-mage">Prism</option>
                            <option value="entropy-weaver">Entropy</option>
                            <option value="sphere-architect">Architect</option>
                        </select>
                        <div className="sphere-count-header">
                            {activeSpheres.length} SPHERE{activeSpheres.length !== 1 ? 'S' : ''}
                        </div>
                    </div>
                )}

                <div className="sphere-bar-wrapper">
                    <div
                        className={`class-resource-bar elemental-spheres-display ${size}`}
                    >
                        <div className="spheres-grid">
                            {finalConfig.elements?.map((element, index) => {
                                const count = sphereCounts[element.id] || 0;
                                const isActive = count > 0;
                                const isChaos = element.isGradient;

                                const isSelectedForSwap = selectedForSwap.includes(element.id);

                                // Build tooltip text
                                const tooltipText = count > 0
                                    ? `${element.name} (${count})\n${element.description}`
                                    : `${element.name}\n${element.description}`;

                                return (
                                    <div
                                        key={element.id}
                                        className={`sphere-slot ${isActive ? 'active' : 'empty'} ${isChaos ? 'chaos' : ''} ${isRolling ? 'rolling' : ''} ${isSelectedForSwap ? 'selected-for-swap' : ''}`}
                                        title={tooltipText}
                                        onClick={(e) => {
                                            if (isActive) {
                                                e.stopPropagation();
                                                if (swapMode && activeSpecialization === 'sphere-architect') {
                                                    handleSphereSwap(element.id);
                                                } else {
                                                    removeElement(element.id);
                                                }
                                            }
                                        }}
                                        style={{
                                            backgroundColor: isActive ? element.color : finalConfig.visual.emptyColor,
                                            background: isChaos && isActive ? element.color : undefined,
                                            boxShadow: isActive ? `0 0 12px ${element.glowColor}, inset 0 0 8px rgba(255,255,255,0.3)` : 'none',
                                            cursor: isActive ? 'pointer' : 'default'
                                        }}
                                    >
                                        <i className={`sphere-icon ${element.icon}`}></i>
                                        {count > 1 && (
                                            <span className="sphere-count">{count}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Side controls for small/normal sizes (right side of spheres) */}
                    {size !== 'large' && (
                        <div className="sphere-side-controls">
                            <button
                                className="sphere-icon-btn roll-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    rollSpheres();
                                }}
                                disabled={isRolling}
                                title={isRolling ? 'Rolling...' : (activeSpecialization === 'entropy-weaver' ? 'Roll 5d8' : 'Roll 4d8')}
                            >
                                <i className="fas fa-dice"></i>
                            </button>

                            <button
                                className="sphere-icon-btn clear-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearSpheres();
                                }}
                                disabled={activeSpheres.length === 0}
                                title="Clear all spheres"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}

                    {/* Side controls for large size */}
                    {size === 'large' && (
                        <div className="sphere-side-controls">
                            <button
                                className="sphere-icon-btn roll-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    rollSpheres();
                                }}
                                disabled={isRolling}
                                title={activeSpecialization === 'entropy-weaver' ? 'Roll 5d8' : 'Roll 4d8'}
                            >
                                <i className="fas fa-dice"></i>
                            </button>

                            <button
                                className="sphere-icon-btn clear-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearSpheres();
                                }}
                                disabled={activeSpheres.length === 0}
                                title="Clear all spheres"
                            >
                                <i className="fas fa-times"></i>
                            </button>

                            {/* Prism Mage: Reroll button */}
                            {activeSpecialization === 'prism-mage' && (
                                <button
                                    className="sphere-icon-btn reroll-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (activeSpheres.length > 0) {
                                            const randomIndex = Math.floor(Math.random() * activeSpheres.length);
                                            rerollSphere(randomIndex);
                                        }
                                    }}
                                    disabled={rerollsUsed >= 2 || activeSpheres.length === 0}
                                    title={`Reroll sphere (${rerollsUsed}/2 used)`}
                                >
                                    <i className="fas fa-sync-alt"></i>
                                </button>
                            )}

                            {/* Sphere Architect: Swap button */}
                            {activeSpecialization === 'sphere-architect' && (
                                <button
                                    className={`sphere-icon-btn swap-btn ${swapMode ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSwapMode(!swapMode);
                                        setSelectedForSwap([]);
                                    }}
                                    disabled={activeSpheres.length < 2}
                                    title="Swap 2 spheres"
                                >
                                    <i className="fas fa-exchange-alt"></i>
                                </button>
                            )}
                        </div>
                    )}

                </div>
            </div>
        );
    };

    // Render tooltip (following item tooltip pattern)
    const renderTooltip = () => {
        if (!showTooltip || !finalConfig.tooltip) return null;

        const sphereCount = finalClassResource.spheres?.length || 0;
        const tooltipTitle = finalConfig.tooltip.title
            .replace('{current}', finalClassResource.current)
            .replace('{max}', finalClassResource.max)
            .replace('{count}', sphereCount)
            .replace('{stacks}', finalClassResource.stacks?.length || 0)
            .replace('{risk}', finalClassResource.risk || 0)
            .replace('{volatility}', finalClassResource.volatility || 0);

        // Calculate sphere breakdown for Arcanoneer
        const sphereBreakdown = {};
        if (finalConfig.type === 'spheres' && finalClassResource.spheres) {
            finalClassResource.spheres.forEach(elementId => {
                const element = finalConfig.elements?.find(el => el.id === elementId);
                if (element) {
                    sphereBreakdown[element.name] = (sphereBreakdown[element.name] || 0) + 1;
                }
            });
        }

        return (
            <TooltipPortal>
                <div
                    className="class-resource-tooltip arcanoneer-tooltip"
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        transform: 'translate(10px, -50%)',
                        pointerEvents: 'none',
                        zIndex: 999999999
                    }}
                >
                    <div className="tooltip-description">
                        <span className="tooltip-header">
                            <i className={`${finalConfig.visual.icon || 'fas fa-atom'} tooltip-icon`} style={{ color: finalConfig.visual.activeColor || '#9370DB' }}></i>
                        </span>{finalConfig.tooltip.description}
                    </div>

                    {/* Simple sphere count */}
                    {finalConfig.type === 'spheres' && sphereCount > 0 && (
                        <div className="tooltip-sphere-count">
                            Banked: <strong>{sphereCount} sphere{sphereCount !== 1 ? 's' : ''}</strong>
                        </div>
                    )}

                    {finalConfig.stages && finalClassResource.current < finalConfig.stages.length && (
                        <div className="tooltip-stage-info">
                            <div className="stage-name">{finalConfig.stages[finalClassResource.current].name}</div>
                            {finalConfig.stages[finalClassResource.current].bonuses.length > 0 && (
                                <div className="stage-bonuses">
                                    <strong>Bonuses:</strong>
                                    <ul>
                                        {finalConfig.stages[finalClassResource.current].bonuses.map((bonus, i) => (
                                            <li key={i}>{bonus}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {finalConfig.stages[finalClassResource.current].drawbacks.length > 0 && (
                                <div className="stage-drawbacks">
                                    <strong>Drawbacks:</strong>
                                    <ul>
                                        {finalConfig.stages[finalClassResource.current].drawbacks.map((drawback, i) => (
                                            <li key={i}>{drawback}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    {finalConfig.thresholds && (
                        <div className="tooltip-thresholds">
                            <strong>Thresholds:</strong>
                            {finalConfig.thresholds.map((threshold, i) => (
                                <div
                                    key={i}
                                    className={`threshold-info ${finalClassResource.current >= threshold.value ? 'achieved' : 'pending'}`}
                                >
                                    <span className="threshold-value">{threshold.value}:</span>
                                    <span className="threshold-name">{threshold.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </TooltipPortal>
        );
    };

    // Don't show wrapper tooltip for Arcanoneer (spheres have individual tooltips)
    const isArcanoneer = finalConfig.visual.type === 'elemental-spheres';

    return (
        <div
            className={`class-resource-wrapper ${isGMMode ? 'clickable' : ''}`}
            onMouseEnter={!isArcanoneer ? handleMouseEnter : undefined}
            onMouseLeave={!isArcanoneer ? handleMouseLeave : undefined}
            onMouseMove={!isArcanoneer ? handleMouseMove : undefined}
            onClick={handleClick}
            style={{ cursor: isGMMode ? 'pointer' : 'default' }}
        >
            {renderResourceDisplay()}
            {!isArcanoneer && renderTooltip()}
        </div>
    );
};

export default ClassResourceBar;
