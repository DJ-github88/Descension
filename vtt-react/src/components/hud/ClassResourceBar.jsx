import React, { useState, useRef, useEffect } from 'react';
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
    const [tooltipPlacement, setTooltipPlacement] = useState('above'); // 'above' | 'below'
    const rageBarRef = useRef(null);
    const tooltipRef = useRef(null);

    // State for Arcanoneer spheres (local state for interactive demo)
    const [localSpheres, setLocalSpheres] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [showControls, setShowControls] = useState(false);

    // Berserker rage controls
    const [showRageMenu, setShowRageMenu] = useState(false);
    const [rageInputValue, setRageInputValue] = useState('');

    // Chaos Weaver mayhem modifier controls
    const [localModifiers, setLocalModifiers] = useState(12); // Start with 12 for demo
    const [showModifierMenu, setShowModifierMenu] = useState(false);
    const [chaosWeaverHoverSection, setChaosWeaverHoverSection] = useState(null); // 'modifiers' | null

    // State for Arcanoneer specialization
    const [activeSpecialization, setActiveSpecialization] = useState('prism-mage'); // 'prism-mage', 'entropy-weaver', 'sphere-architect'
    const [rerollsUsed, setRerollsUsed] = useState(0);
    const [swapMode, setSwapMode] = useState(false);
    const [selectedForSwap, setSelectedForSwap] = useState([]);

    // State for Berserker rage (local state for interactive demo)
    const [localRage, setLocalRage] = useState(classResource?.current || 0);

    // State for Bladedancer (local state for interactive demo)
    const [localMomentum, setLocalMomentum] = useState(0);
    const [localFlourish, setLocalFlourish] = useState(3);
    const [currentStance, setCurrentStance] = useState('Flowing Water');
    const [showStanceMenu, setShowStanceMenu] = useState(false);
    const [showMomentumMenu, setShowMomentumMenu] = useState(false);
    const [showFlourishMenu, setShowFlourishMenu] = useState(false);
    const [momentumInputValue, setMomentumInputValue] = useState('');
    const [bladedancerHoverSection, setBladedancerHoverSection] = useState(null); // 'momentum' | 'flourish' | 'stance' | null
    const [showSpecPassiveMenu, setShowSpecPassiveMenu] = useState(false);
    const [selectedSpecialization, setSelectedSpecialization] = useState('Flow Master'); // 'Blade Dancer' | 'Duelist' | 'Shadow Dancer'

    // State for Chronarch (local state for interactive demo)
    const [localTimeShards, setLocalTimeShards] = useState(7); // Start with 7 for demo
    const [localTemporalStrain, setLocalTemporalStrain] = useState(6); // Start with 6 for demo
    const [showTimeShardsMenu, setShowTimeShardsMenu] = useState(false);
    const [showTemporalStrainMenu, setShowTemporalStrainMenu] = useState(false);
    const [chronarchHoverSection, setChronarchHoverSection] = useState(null); // 'shards' | 'strain' | null

    // State for Covenbane (local state for interactive demo)
    const [localHexbreakerCharges, setLocalHexbreakerCharges] = useState(4); // Start with 4 for demo
    const [localAttackCounter, setLocalAttackCounter] = useState(2); // 1, 2, or 3 (resets to 1 after 3)
    const [showChargesMenu, setShowChargesMenu] = useState(false);
    const [covenbaneHoverSection, setCovenbaneHoverSection] = useState(null); // 'charges' | 'counter' | null

    // State for Deathcaller (local state for interactive demo)
    const [localAscensionPaths, setLocalAscensionPaths] = useState([true, true, true, false, false, false, false]); // Start with 3 paths active
    const [localBloodTokens, setLocalBloodTokens] = useState(12); // Start with 12 tokens for demo
    const [showPathsMenu, setShowPathsMenu] = useState(false);
    const [showTokensMenu, setShowTokensMenu] = useState(false);
    const [deathcallerHoverSection, setDeathcallerHoverSection] = useState(null); // 'paths' | 'tokens' | null

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
    // Rage bar anchored tooltip handlers
    const handleRageBarEnter = () => {
        if (rageBarRef.current) {
            const rect = rageBarRef.current.getBoundingClientRect();
            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        }
    };
    // Keep tooltip inside viewport using measurement after render
    useEffect(() => {
        if (!showTooltip || !tooltipRef.current) return;
        // Run on next paint to ensure tooltip has dimensions
        requestAnimationFrame(() => {
            const tt = tooltipRef.current?.getBoundingClientRect();
            if (!tt) return;
            const margin = 8;

            // Decide vertical placement based on current tooltip position and available space
            let placement = 'above';
            let y = tooltipPosition.y;

            const spaceAbove = tooltipPosition.y - margin;
            const spaceBelow = window.innerHeight - tooltipPosition.y - margin;
            const tooltipHeightWithMargin = tt.height + 10;

            // Choose placement based on available space
            if (spaceAbove < tooltipHeightWithMargin && spaceBelow >= tooltipHeightWithMargin) {
                placement = 'below';
            } else if (spaceAbove >= tooltipHeightWithMargin) {
                placement = 'above';
            } else {
                // Not enough space either way, choose the side with more space
                placement = spaceBelow > spaceAbove ? 'below' : 'above';
            }

            // Clamp horizontally accounting for translateX(-50%)
            const minX = margin + tt.width / 2;
            const maxX = window.innerWidth - margin - tt.width / 2;
            const x = Math.max(minX, Math.min(maxX, tooltipPosition.x));

            setTooltipPlacement(placement);
            if (x !== tooltipPosition.x) {
                setTooltipPosition({ x, y });
            }
        });
    }, [showTooltip, localRage, localMomentum, localFlourish, bladedancerHoverSection, chaosWeaverHoverSection, chronarchHoverSection, localTimeShards, localTemporalStrain, covenbaneHoverSection, localHexbreakerCharges, localAttackCounter, size]);

    const handleRageBarLeave = () => setShowTooltip(false);


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
            case 'mayhem-modifiers':
                return renderMayhemModifiers();
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
            case 'dual-dice':
                return renderRageBar();
            case 'stance-flow':
                return renderStanceFlow();
            case 'time-shards-strain':
                return renderTimeShardsStrain();
            case 'hexbreaker-charges':
                return renderHexbreakerCharges();
            case 'ascension-blood':
                return renderAscensionBlood();
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

    // Gauge display (Chronarch - OLD, kept for compatibility)
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

    // Time Shards & Temporal Strain display (Chronarch)
    const renderTimeShardsStrain = () => {
        const shardsMax = finalConfig.visual?.timeShards?.max || 10;
        const strainMax = finalConfig.visual?.temporalStrain?.max || 10;
        const shardsValue = localTimeShards;
        const strainValue = localTemporalStrain;

        // Get strain color based on level
        const getStrainColor = (strain) => {
            const colors = finalConfig.visual?.temporalStrain?.strainColors || {};
            if (strain >= 10) return colors.backlash || '#B71C1C';
            if (strain >= 9) return colors.critical || '#C62828';
            if (strain >= 7) return colors.danger || '#E53935';
            if (strain >= 5) return colors.warning || '#FB8C00';
            if (strain >= 3) return colors.caution || '#F9A825';
            return colors.safe || '#2E7D32';
        };

        // Get strain state label
        const getStrainState = (strain) => {
            if (strain >= 10) return 'BACKLASH!';
            if (strain >= 9) return 'Critical';
            if (strain >= 7) return 'Danger';
            if (strain >= 5) return 'Warning';
            if (strain >= 3) return 'Caution';
            return 'Safe';
        };

        const strainColor = getStrainColor(strainValue);
        const strainState = getStrainState(strainValue);
        const shouldPulse = strainValue >= 5;
        const shouldFlash = strainValue >= 9;

        return (
            <div className={`class-resource-bar time-shards-strain ${size}`}>
                <div className="chronarch-dual-bars">
                    {/* Time Shards Bar (Top) */}
                    <div
                        className="time-shards-bar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTimeShardsMenu(!showTimeShardsMenu);
                            setShowTemporalStrainMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setChronarchHoverSection('shards');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setChronarchHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="segments-container">
                            {Array.from({ length: shardsMax }, (_, i) => (
                                <div
                                    key={i}
                                    className={`segment ${i < shardsValue ? 'filled' : 'empty'}`}
                                    style={{
                                        backgroundColor: i < shardsValue
                                            ? finalConfig.visual.timeShards.activeColor
                                            : finalConfig.visual.timeShards.baseColor,
                                        boxShadow: i < shardsValue
                                            ? `0 0 4px ${finalConfig.visual.timeShards.glowColor}`
                                            : 'none'
                                    }}
                                />
                            ))}
                        </div>
                        <div className="bar-value">{shardsValue}/{shardsMax}</div>
                    </div>

                    {/* Temporal Strain Bar (Bottom) */}
                    <div
                        className={`temporal-strain-bar ${shouldPulse ? 'pulse' : ''} ${shouldFlash ? 'flash' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTemporalStrainMenu(!showTemporalStrainMenu);
                            setShowTimeShardsMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setChronarchHoverSection('strain');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setChronarchHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="segments-container">
                            {Array.from({ length: strainMax }, (_, i) => (
                                <div
                                    key={i}
                                    className={`segment ${i < strainValue ? 'filled' : 'empty'}`}
                                    style={{
                                        backgroundColor: i < strainValue
                                            ? strainColor
                                            : finalConfig.visual.temporalStrain.baseColor,
                                        boxShadow: i < strainValue
                                            ? `0 0 4px ${strainColor}`
                                            : 'none'
                                    }}
                                />
                            ))}
                        </div>
                        <div className="bar-value" style={{ color: strainColor }}>
                            {strainValue}/{strainMax}
                        </div>
                    </div>

                    {/* Time Shards Adjustment Menu */}
                    {showTimeShardsMenu && (
                        <div className="resource-adjust-menu shards-menu">
                            <div className="menu-header">Adjust Time Shards ({shardsValue}/{shardsMax})</div>
                            <div className="menu-buttons">
                                <button onClick={() => setLocalTimeShards(Math.min(shardsMax, shardsValue + 1))}>+1 Cast Spell</button>
                                <button onClick={() => setLocalTimeShards(Math.max(0, shardsValue - 2))}>-2 Flux Ability</button>
                                <button onClick={() => setLocalTimeShards(Math.max(0, shardsValue - 5))}>-5 Flux Ability</button>
                            </div>
                            <button className="menu-reset" onClick={() => { setLocalTimeShards(0); setShowTimeShardsMenu(false); }}>Reset to 0</button>
                        </div>
                    )}

                    {/* Temporal Strain Adjustment Menu */}
                    {showTemporalStrainMenu && (
                        <div className="resource-adjust-menu strain-menu">
                            <div className="menu-header">Adjust Temporal Strain ({strainValue}/{strainMax})</div>
                            <div className="menu-buttons">
                                <button onClick={() => setLocalTemporalStrain(Math.min(strainMax, strainValue + 1))}>+1 Strain</button>
                                <button onClick={() => setLocalTemporalStrain(Math.min(strainMax, strainValue + 3))}>+3 Strain</button>
                                <button onClick={() => setLocalTemporalStrain(Math.max(0, strainValue - 1))}>-1 Decay</button>
                                <button onClick={() => setLocalTemporalStrain(10)}>Set to 10 (Backlash!)</button>
                            </div>
                            <button className="menu-reset" onClick={() => { setLocalTemporalStrain(0); setShowTemporalStrainMenu(false); }}>Reset to 0</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Hexbreaker Charges display (Covenbane)
    const renderHexbreakerCharges = () => {
        const maxCharges = 6;
        const chargesValue = localHexbreakerCharges;
        const attackCounter = localAttackCounter; // 1, 2, or 3

        // Get passive bonuses based on current charges
        const getPassiveBonuses = (charges) => {
            const bonuses = {
                0: { damage: '0', speed: '+0ft', crit: '20', trueDmg: '0%' },
                1: { damage: '+1d4', speed: '+5ft', crit: '20', trueDmg: '6%' },
                2: { damage: '+1d6', speed: '+10ft', crit: '20', trueDmg: '7%' },
                3: { damage: '+2d6', speed: '+15ft', crit: '19-20', trueDmg: '8%' },
                4: { damage: '+3d6', speed: '+20ft', crit: '19-20', trueDmg: '9%' },
                5: { damage: '+4d6', speed: '+25ft', crit: '18-20', trueDmg: '10%' },
                6: { damage: '+5d6', speed: '+30ft', crit: '18-20', trueDmg: '11%' }
            };
            return bonuses[charges] || bonuses[0];
        };

        const currentBonuses = getPassiveBonuses(chargesValue);
        const isMaxCharges = chargesValue === maxCharges;

        return (
            <div className={`class-resource-bar hexbreaker-charges ${size}`}>
                <div className="hexbreaker-container">
                    {/* Charges Display */}
                    <div
                        className="charges-display"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowChargesMenu(!showChargesMenu);
                        }}
                        onMouseEnter={(e) => {
                            setCovenbaneHoverSection('charges');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setCovenbaneHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="charges-grid">
                            {Array.from({ length: maxCharges }, (_, i) => (
                                <div
                                    key={i}
                                    className={`charge-indicator ${i < chargesValue ? 'filled' : 'empty'} ${i === chargesValue - 1 && isMaxCharges ? 'max-glow' : ''}`}
                                    style={{
                                        backgroundColor: i < chargesValue
                                            ? finalConfig.visual.activeColor
                                            : finalConfig.visual.baseColor,
                                        boxShadow: i < chargesValue
                                            ? `0 0 6px ${finalConfig.visual.glowColor}`
                                            : 'none'
                                    }}
                                >
                                    {i < chargesValue && <span className="charge-icon">{finalConfig.visual.icon}</span>}
                                </div>
                            ))}
                        </div>
                        <div className="charges-value">{chargesValue}/{maxCharges}</div>
                    </div>

                    {/* Attack Counter (True Damage Tracker) */}
                    <div
                        className="attack-counter"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Cycle through 1 -> 2 -> 3 -> 1
                            setLocalAttackCounter(attackCounter === 3 ? 1 : attackCounter + 1);
                        }}
                        onMouseEnter={(e) => {
                            setCovenbaneHoverSection('counter');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setCovenbaneHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="counter-dots">
                            {[1, 2, 3].map((dot) => (
                                <div
                                    key={dot}
                                    className={`counter-dot ${dot <= attackCounter ? 'active' : 'inactive'} ${dot === 3 && attackCounter === 3 ? 'true-damage-ready' : ''}`}
                                    style={{
                                        backgroundColor: dot <= attackCounter
                                            ? (dot === 3 ? '#FFD700' : finalConfig.visual.activeColor)
                                            : finalConfig.visual.baseColor,
                                        boxShadow: dot === 3 && attackCounter === 3
                                            ? '0 0 8px #FFD700'
                                            : 'none'
                                    }}
                                />
                            ))}
                        </div>
                        <div className="counter-label">{attackCounter}/3</div>
                    </div>

                    {/* Charges Adjustment Menu */}
                    {showChargesMenu && (
                        <div className="resource-adjust-menu charges-menu">
                            <div className="menu-header">Adjust Hexbreaker Charges ({chargesValue}/{maxCharges})</div>
                            <div className="menu-buttons">
                                <button onClick={() => setLocalHexbreakerCharges(Math.min(maxCharges, chargesValue + 1))}>+1 Attack Evil Caster</button>
                                <button onClick={() => setLocalHexbreakerCharges(Math.min(maxCharges, chargesValue + 1))}>+1 Targeted by Spell</button>
                                <button onClick={() => setLocalHexbreakerCharges(Math.max(0, chargesValue - 1))}>-1 Shadow Step</button>
                                <button onClick={() => setLocalHexbreakerCharges(Math.max(0, chargesValue - 2))}>-2 Curse Eater</button>
                                <button onClick={() => setLocalHexbreakerCharges(Math.max(0, chargesValue - 3))}>-3 Dark Pursuit</button>
                                <button onClick={() => setLocalHexbreakerCharges(Math.max(0, chargesValue - 6))}>-6 Hexbreaker Fury</button>
                            </div>
                            <button className="menu-reset" onClick={() => { setLocalHexbreakerCharges(0); setShowChargesMenu(false); }}>Reset to 0</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Ascension Paths & Blood Tokens display (Deathcaller)
    const renderAscensionBlood = () => {
        const pathsMax = finalConfig.visual?.ascensionPaths?.max || 7;
        const tokensMax = finalConfig.visual?.bloodTokens?.max || 30;
        const activePaths = localAscensionPaths.filter(p => p).length;
        const tokensValue = localBloodTokens;

        // Get token color based on count (warning/danger thresholds)
        const getTokenColor = (tokens) => {
            const warningThreshold = finalConfig.bloodTokens?.warningThreshold || 10;
            const dangerThreshold = finalConfig.bloodTokens?.dangerThreshold || 20;

            if (tokens >= dangerThreshold) return finalConfig.visual.bloodTokens.dangerColor;
            if (tokens >= warningThreshold) return finalConfig.visual.bloodTokens.warningColor;
            return finalConfig.visual.bloodTokens.activeColor;
        };

        const tokenColor = getTokenColor(tokensValue);
        const tokenPercentage = Math.min((tokensValue / tokensMax) * 100, 100);

        // Helper functions for path management
        const togglePath = (index) => {
            setLocalAscensionPaths(prev => {
                const newPaths = [...prev];
                // Can only activate paths sequentially (can't skip)
                if (!newPaths[index]) {
                    // Check if all previous paths are active
                    const canActivate = index === 0 || newPaths.slice(0, index).every(p => p);
                    if (canActivate) {
                        newPaths[index] = true;
                    }
                }
                // Can deactivate, but must deactivate all subsequent paths too
                else {
                    for (let i = index; i < newPaths.length; i++) {
                        newPaths[i] = false;
                    }
                }
                return newPaths;
            });
        };

        // Helper functions for token management
        const addTokens = (amount) => {
            setLocalBloodTokens(prev => prev + amount);
        };

        const removeTokens = (amount) => {
            setLocalBloodTokens(prev => Math.max(prev - amount, 0));
        };

        const rollDice = (diceCount, diceSize) => {
            let total = 0;
            for (let i = 0; i < diceCount; i++) {
                total += Math.floor(Math.random() * diceSize) + 1;
            }
            return total;
        };

        return (
            <div className={`class-resource-bar ascension-blood ${size}`}>
                <div className="deathcaller-dual-bars">
                    {/* Ascension Paths Bar (Top) */}
                    <div
                        className="ascension-paths-bar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowPathsMenu(!showPathsMenu);
                            setShowTokensMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setDeathcallerHoverSection('paths');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setDeathcallerHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="paths-container">
                            {Array.from({ length: pathsMax }, (_, i) => {
                                const isActive = localAscensionPaths[i];
                                const pathData = finalConfig.paths[i];

                                return (
                                    <div
                                        key={i}
                                        className={`path-indicator ${isActive ? 'active' : 'inactive'}`}
                                        title={pathData ? `${pathData.shortName || pathData.name}` : `Path ${i + 1}`}
                                        style={{
                                            backgroundColor: isActive
                                                ? finalConfig.visual.ascensionPaths.activeColor
                                                : finalConfig.visual.ascensionPaths.baseColor,
                                            boxShadow: isActive
                                                ? `0 0 6px ${finalConfig.visual.ascensionPaths.glowColor}`
                                                : 'none'
                                        }}
                                    >
                                        {isActive && <span className="path-icon">{finalConfig.visual.ascensionPaths.icon}</span>}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="bar-value">{activePaths}/{pathsMax}</div>
                    </div>

                    {/* Blood Tokens Bar (Bottom) */}
                    <div
                        className="blood-tokens-bar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTokensMenu(!showTokensMenu);
                            setShowPathsMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setDeathcallerHoverSection('tokens');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setDeathcallerHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div className="tokens-bar-background">
                            <div
                                className="tokens-bar-fill"
                                style={{
                                    width: `${tokenPercentage}%`,
                                    backgroundColor: tokenColor,
                                    boxShadow: `0 0 6px ${tokenColor}`
                                }}
                            />
                        </div>
                        <div className="bar-value" style={{ color: tokenColor }}>{tokensValue}</div>
                    </div>

                    {/* Paths Menu */}
                    {showPathsMenu && (
                        <div className="resource-adjust-menu paths-menu" onClick={(e) => e.stopPropagation()}>
                            <div className="menu-header">Necrotic Ascension Paths ({activePaths}/{pathsMax})</div>
                            <div className="menu-buttons paths-grid">
                                {finalConfig.paths.map((path, i) => (
                                    <button
                                        key={i}
                                        className={localAscensionPaths[i] ? 'active' : 'inactive'}
                                        onClick={() => togglePath(i)}
                                        disabled={!localAscensionPaths[i] && i > 0 && !localAscensionPaths[i - 1]}
                                    >
                                        {path.shortName || path.name}
                                    </button>
                                ))}
                            </div>
                            <button className="menu-reset" onClick={() => { setLocalAscensionPaths([false, false, false, false, false, false, false]); setShowPathsMenu(false); }}>
                                Reset All Paths
                            </button>
                        </div>
                    )}

                    {/* Tokens Menu */}
                    {showTokensMenu && (
                        <div className="resource-adjust-menu tokens-menu" onClick={(e) => e.stopPropagation()}>
                            <div className="menu-header">Blood Tokens ({tokensValue})</div>
                            <div className="menu-buttons">
                                <button onClick={() => addTokens(rollDice(1, 6))}>+1d6 HP Sacrifice</button>
                                <button onClick={() => addTokens(rollDice(2, 8))}>+2d8 HP Sacrifice</button>
                                <button onClick={() => addTokens(rollDice(4, 10))}>+4d10 HP Sacrifice</button>
                                <button onClick={() => removeTokens(5)}>-5 Enhance Spell</button>
                                <button onClick={() => removeTokens(10)}>-10 Enhance Spell</button>
                                <button onClick={() => removeTokens(tokensValue)}>Spend All ({tokensValue}d10 burst!)</button>
                            </div>
                            <button className="menu-reset" onClick={() => { setLocalBloodTokens(0); setShowTokensMenu(false); }}>
                                Reset to 0
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Vortex display (Old Chaos Weaver - kept for compatibility)
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

    // Mayhem Modifiers display (Chaos Weaver)
    const renderMayhemModifiers = () => {
        // Use local state for interactive demo
        const modifierCount = localModifiers; // Always use localModifiers for consistency
        const maxModifiers = finalClassResource.max || 20;

        // Calculate bar fill percentage
        const modifierPercentage = (modifierCount / maxModifiers) * 100;
        const intensity = Math.min(modifierCount / maxModifiers, 1);
        const vortexScale = 1 + (intensity * 0.3); // Grows up to 30% larger
        const spinSpeed = 3 - (intensity * 1.5); // Spins faster with more modifiers

        // Determine specialization colors (if available)
        const specColors = finalConfig.visual?.specializations || {};
        const defaultColors = {
            vortex: finalConfig.visual?.vortexColor || '#7C3AED',
            glow: finalConfig.visual?.glowColor || '#D946EF',
            active: finalConfig.visual?.activeColor || '#9333EA'
        };

        // Helper functions for modifier management
        const addModifiers = (amount) => {
            setLocalModifiers(prev => Math.min(prev + amount, maxModifiers));
        };

        const removeModifiers = (amount) => {
            setLocalModifiers(prev => Math.max(prev - amount, 0));
        };

        const rollDice = (diceCount, diceSize) => {
            let total = 0;
            for (let i = 0; i < diceCount; i++) {
                total += Math.floor(Math.random() * diceSize) + 1;
            }
            return total;
        };

        // For small size (HUD), show compact bar with controls
        if (size === 'small') {
            return (
                <div className={`class-resource-bar mayhem-modifiers-display ${size}`}>
                    <div className="mayhem-bar-wrapper">
                        {/* Control button with popup menu */}
                        <div className="mayhem-controls-hud">
                            <button
                                className="mayhem-btn mayhem-menu-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModifierMenu(v => !v);
                                }}
                                title="Adjust Modifiers"
                            >
                                <i className="fas fa-sliders-h"></i>
                            </button>
                            {showModifierMenu && (
                                <div className="mayhem-menu" onClick={(e) => e.stopPropagation()}>
                                    <div className="mayhem-menu-row">
                                        <button className="mayhem-menu-item" onClick={() => addModifiers(1)}>+1</button>
                                        <button className="mayhem-menu-item" onClick={() => removeModifiers(1)}>-1</button>
                                    </div>
                                    <div className="mayhem-menu-row">
                                        <button className="mayhem-menu-item" onClick={() => addModifiers(5)}>+5</button>
                                        <button className="mayhem-menu-item" onClick={() => removeModifiers(5)}>-5</button>
                                    </div>
                                    <div className="mayhem-menu-row">
                                        <button className="mayhem-menu-item" onClick={() => addModifiers(rollDice(1, 4))}>+1d4</button>
                                        <button className="mayhem-menu-item" onClick={() => addModifiers(rollDice(2, 4))}>+2d4</button>
                                    </div>
                                    <div className="mayhem-menu-row set-row">
                                        <button className="mayhem-menu-item" onClick={() => setLocalModifiers(0)}>Reset</button>
                                        <button className="mayhem-menu-item" onClick={() => setLocalModifiers(maxModifiers)}>Max</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            className="mayhem-bar-container-hud"
                            onMouseEnter={(e) => {
                                setChaosWeaverHoverSection('modifiers');
                                const rect = e.currentTarget.getBoundingClientRect();

                                // Calculate tooltip position with screen boundary detection
                                const tooltipWidth = 300;
                                const tooltipHeight = 250;
                                const padding = 10;

                                let x = rect.left + rect.width / 2;
                                let y = rect.top;
                                let placement = 'above';

                                if (x + tooltipWidth / 2 > window.innerWidth - padding) {
                                    x = window.innerWidth - tooltipWidth / 2 - padding;
                                }

                                if (x - tooltipWidth / 2 < padding) {
                                    x = tooltipWidth / 2 + padding;
                                }

                                if (y - tooltipHeight < padding) {
                                    y = rect.bottom;
                                    placement = 'below';
                                }

                                setTooltipPosition({ x, y });
                                setTooltipPlacement(placement);
                                setShowTooltip(true);
                            }}
                            onMouseLeave={() => {
                                setChaosWeaverHoverSection(null);
                                setShowTooltip(false);
                            }}
                        >
                            <div className="mayhem-bar-background">
                                <div
                                    className="mayhem-bar-fill-hud"
                                    style={{
                                        width: `${modifierPercentage}%`,
                                        background: `linear-gradient(90deg,
                                            ${defaultColors.active} 0%,
                                            ${defaultColors.glow} 50%,
                                            ${defaultColors.active} 100%
                                        )`,
                                        backgroundSize: '200% 100%',
                                        boxShadow: `0 0 8px ${defaultColors.glow}`
                                    }}
                                />
                            </div>
                            <div className="mayhem-bar-text">
                                {modifierCount}/{maxModifiers}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // For normal and large sizes, show simple progress bar
        return (
            <div className={`class-resource-bar mayhem-modifiers-display ${size}`}>
                <div className="mayhem-bar-container">
                    <div
                        className="mayhem-modifier-bar"
                        onMouseEnter={(e) => {
                            setChaosWeaverHoverSection('modifiers');
                            const rect = e.currentTarget.getBoundingClientRect();

                            // Calculate tooltip position with screen boundary detection
                            const tooltipWidth = 300;
                            const tooltipHeight = 250;
                            const padding = 10;

                            let x = rect.left + rect.width / 2;
                            let y = rect.top;
                            let placement = 'above';

                            // Check horizontal boundaries
                            if (x + tooltipWidth / 2 > window.innerWidth - padding) {
                                x = window.innerWidth - tooltipWidth / 2 - padding;
                            }

                            if (x - tooltipWidth / 2 < padding) {
                                x = tooltipWidth / 2 + padding;
                            }

                            // Check vertical boundaries
                            if (y - tooltipHeight < padding) {
                                y = rect.bottom;
                                placement = 'below';
                            }

                            setTooltipPosition({ x, y });
                            setTooltipPlacement(placement);
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setChaosWeaverHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div
                            className="mayhem-bar-fill"
                            style={{
                                width: `${modifierPercentage}%`,
                                background: `linear-gradient(90deg, ${defaultColors.active}, ${defaultColors.glow})`,
                                boxShadow: `0 0 8px ${defaultColors.glow}`
                            }}
                        />
                        <div className="mayhem-count-display">
                            <span className="mayhem-icon">{finalConfig.visual?.icon || '🌀'}</span>
                            <span className="mayhem-count">{modifierCount}/{maxModifiers}</span>
                        </div>
                    </div>

                    {size === 'large' && (
                        <div className="mayhem-controls">
                            <button
                                className="mayhem-control-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModifierMenu(v => !v);
                                }}
                                title="Adjust Mayhem Modifiers"
                            >
                                <i className="fas fa-sliders-h"></i>
                            </button>

                            {showModifierMenu && (
                                <div className="mayhem-control-menu">
                                    <button className="mayhem-menu-option" onClick={() => addModifiers(1)}>+1</button>
                                    <button className="mayhem-menu-option" onClick={() => removeModifiers(1)}>-1</button>
                                    <button className="mayhem-menu-option" onClick={() => addModifiers(rollDice(1, 4))}> +1d4</button>
                                    <button className="mayhem-menu-option" onClick={() => addModifiers(rollDice(2, 4))}>+2d4</button>
                                    <button className="mayhem-menu-option" onClick={() => setLocalModifiers(0)}>Reset</button>
                                    <button className="mayhem-menu-option" onClick={() => setLocalModifiers(maxModifiers)}>Max</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

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

    // Rage Bar display (Berserker)
    const renderRageBar = () => {
        const rageValue = localRage;
        const isOverheated = rageValue > 100;
        const percentage = Math.min((rageValue / 100) * 100, 100);
        const overheatedAmount = Math.max(rageValue - 100, 0);

        // Determine rage state
        let rageState = 'Smoldering';
        let stateColor = '#4A0000';

        if (rageValue >= 101) {
            rageState = 'Obliteration';
            stateColor = '#FF0000';
        } else if (rageValue >= 81) {
            rageState = 'Cataclysm';
            stateColor = '#DC143C';
        } else if (rageValue >= 61) {
            rageState = 'Carnage';
            stateColor = '#FF4500';
        } else if (rageValue >= 41) {
            rageState = 'Primal';
            stateColor = '#FF6347';
        } else if (rageValue >= 21) {
            rageState = 'Frenzied';
            stateColor = '#FF8C00';
        }

        return (
            <div className={`class-resource-bar rage-bar ${size} ${isOverheated ? 'overheated' : ''}`}>
                <div className="rage-bar-wrapper">
                    <div className="rage-bar-container" ref={rageBarRef} onMouseEnter={handleRageBarEnter} onMouseLeave={handleRageBarLeave}>
                        <div className="bar-background">
                            <div
                                className="bar-fill"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: stateColor,
                                    boxShadow: `0 0 8px ${stateColor}`
                                }}
                            />
                        </div>
                        <div className="bar-text">
                            {rageValue}/100
                        </div>
                    </div>
                    {/* Single control button with pop menu */}
                    <div className="rage-controls">
                        <button
                            className="rage-btn rage-menu-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowRageMenu((v) => !v);
                            }}
                            title="Adjust Rage"
                        >
                            <i className="fas fa-sliders-h"></i>
                        </button>
                        {showRageMenu && (
                            <div className="rage-menu" onClick={(e) => e.stopPropagation()}>
                                <div className="rage-menu-row">
                                    <button className="rage-menu-item" onClick={() => { setLocalRage(Math.min(rageValue + 5, 150)); setShowRageMenu(false); }}>+5</button>
                                    <button className="rage-menu-item" onClick={() => { setLocalRage(Math.max(rageValue - 5, 0)); setShowRageMenu(false); }}>-5</button>
                                </div>
                                <div className="rage-menu-row">
                                    <button className="rage-menu-item" onClick={() => { setLocalRage(Math.min(rageValue + 10, 150)); setShowRageMenu(false); }}>+10</button>
                                    <button className="rage-menu-item" onClick={() => { setLocalRage(Math.max(rageValue - 10, 0)); setShowRageMenu(false); }}>-10</button>
                                </div>
                                <div className="rage-menu-row">
                                    <button className="rage-menu-item" onClick={() => { setLocalRage(Math.min(rageValue + 20, 150)); setShowRageMenu(false); }}>+20</button>
                                    <button className="rage-menu-item" onClick={() => { setLocalRage(Math.max(rageValue - 20, 0)); setShowRageMenu(false); }}>-20</button>
                                </div>
                                <div className="rage-menu-row set-row">
                                    <input
                                        className="rage-menu-input"
                                        type="number"
                                        min="0"
                                        max="150"
                                        placeholder={`${rageValue}`}
                                        value={rageInputValue}
                                        onChange={(e) => setRageInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const v = parseInt(rageInputValue);
                                                if (!isNaN(v)) {
                                                    setLocalRage(Math.max(0, Math.min(v, 150)));
                                                    setRageInputValue('');
                                                    setShowRageMenu(false);
                                                }
                                            }
                                        }}
                                    />
                                    <button className="rage-menu-item apply" onClick={() => {
                                        const v = parseInt(rageInputValue);
                                        if (!isNaN(v)) {
                                            setLocalRage(Math.max(0, Math.min(v, 150)));
                                            setRageInputValue('');
                                            setShowRageMenu(false);
                                        }
                                    }}>Set</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        );
    };

    // Helper function to get Berserker rage state
    const getRageState = (rageValue) => {
        if (rageValue > 100) return 'Obliteration';
        if (rageValue >= 81) return 'Cataclysm';
        if (rageValue >= 61) return 'Carnage';
        if (rageValue >= 41) return 'Primal';
        if (rageValue >= 21) return 'Frenzied';
        return 'Smoldering';
    };

    // Stance Flow display (Bladedancer) - Icon centered, bars on sides
    const renderStanceFlow = () => {
        const momentumValue = localMomentum;
        const flourishValue = localFlourish;
        const momentumMax = finalConfig.mechanics?.momentum?.max || 20;
        const flourishMax = finalConfig.mechanics?.flourish?.max || 5;
        const momentumPercentage = (momentumValue / momentumMax) * 100;
        const flourishPercentage = (flourishValue / flourishMax) * 100;

        const stances = finalConfig.visual?.stances || {};
        const stanceNetwork = finalConfig.stanceNetwork || {};
        const transitionCosts = finalConfig.transitionCosts || {};

        // Get available transitions from current stance
        let availableTransitions = stanceNetwork[currentStance] || [];

        // Shadow Dancer can enter Shadow Step from any stance
        if (selectedSpecialization === 'Shadow Dancer' && !availableTransitions.includes('Shadow Step')) {
            availableTransitions = [...availableTransitions, 'Shadow Step'];
        }

        // Calculate transition cost based on specialization
        const getTransitionCost = (fromStance, toStance) => {
            // Shadow Dancer: entering Shadow Step from any stance costs 3 Momentum
            if (selectedSpecialization === 'Shadow Dancer' && toStance === 'Shadow Step') {
                return 3;
            }

            let baseCost = transitionCosts[fromStance]?.[toStance] || 2;

            // Apply Flow Master passive: -1 Momentum cost (minimum 1)
            if (selectedSpecialization === 'Flow Master') {
                baseCost = Math.max(1, baseCost - 1);
            }

            return baseCost;
        };

        // Handle stance transition
        const transitionToStance = (targetStance) => {
            if (!availableTransitions.includes(targetStance)) return;

            const cost = getTransitionCost(currentStance, targetStance);
            if (momentumValue >= cost) {
                setLocalMomentum(momentumValue - cost);
                setCurrentStance(targetStance);
                setShowStanceMenu(false);
            }
        };

        const currentStanceData = stances[currentStance] || {};

        // Stance data with detailed bonuses/penalties
        const stanceDetails = {
            'Flowing Water': {
                bonuses: ['+2 armor', '+10 ft movement', 'Reroll 1s on damage dice'],
                penalties: ['-1d4 damage']
            },
            'Striking Serpent': {
                bonuses: ['Crit on highest 2 damage die results', '+1d6 damage'],
                penalties: ['-1 armor', 'Miss on lowest 2 damage die results']
            },
            'Whirling Wind': {
                bonuses: ['Attacks hit all adjacent enemies', '+5 ft reach'],
                penalties: ['-2 armor', 'Cannot parry']
            },
            'Rooted Stone': {
                bonuses: ['+4 armor', 'Reroll misses once', 'Immune to knockback'],
                penalties: ['-15 ft movement', 'Cannot dash', '-1d4 damage']
            },
            'Dancing Blade': {
                bonuses: ['Can transition to any stance (4 Momentum)', '+1d4 damage'],
                penalties: ['No stance-specific bonuses']
            },
            'Shadow Step': {
                bonuses: ['+2d6 damage from stealth', 'Enemies have disadvantage to detect you', '+10 ft movement'],
                penalties: ['-3 armor in bright light', 'Miss on lowest 3 damage die results in bright light']
            }
        };

        // Get specialization passive based on selected spec
        const getSpecPassive = () => {
            const passives = {
                'Flow Master': {
                    name: 'Flowing Transitions',
                    description: 'All stance transitions cost 1 less Momentum (minimum 1). After changing stances, your next attack gains +1d6 damage.'
                },
                'Duelist': {
                    name: 'Perfect Precision',
                    description: 'While in Striking Serpent or Rooted Stone stance, crit on highest 3 damage die results. Reroll damage dice of 1.'
                },
                'Shadow Dancer': {
                    name: 'Shadow Affinity',
                    description: 'Enter Shadow Step from any stance for 3 Momentum. In Shadow Step, gain +1d6 damage and enemies miss on 1-4 when attacking you.'
                }
            };
            return passives[selectedSpecialization] || passives['Flow Master'];
        };

        return (
            <div className={`class-resource-bar stance-flow ${size}`}>
                <div className="stance-flow-compact">
                    {/* Momentum Bar (Left) */}
                    <div
                        className="momentum-bar-left"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMomentumMenu(!showMomentumMenu);
                            setShowFlourishMenu(false);
                            setShowStanceMenu(false);
                            setShowSpecPassiveMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setBladedancerHoverSection('momentum');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setBladedancerHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div
                            className="momentum-fill"
                            style={{
                                width: `${momentumPercentage}%`,
                                backgroundColor: finalConfig.visual.momentum.activeColor,
                                boxShadow: `0 0 6px ${finalConfig.visual.momentum.glowColor}`
                            }}
                        />
                        <span className="resource-value-left">{momentumValue}</span>
                    </div>

                    {/* Stance Icon (Center) */}
                    <div
                        className="stance-icon-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowStanceMenu(!showStanceMenu);
                            setShowMomentumMenu(false);
                            setShowFlourishMenu(false);
                            setShowSpecPassiveMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setBladedancerHoverSection('stance');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setBladedancerHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{
                            color: currentStanceData.color,
                            borderColor: currentStanceData.color
                        }}
                    >
                        <i className={currentStanceData.icon}></i>
                    </div>

                    {/* Flourish Bar (Right) */}
                    <div
                        className="flourish-bar-right"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowFlourishMenu(!showFlourishMenu);
                            setShowMomentumMenu(false);
                            setShowStanceMenu(false);
                            setShowSpecPassiveMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setBladedancerHoverSection('flourish');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setBladedancerHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <div
                            className="flourish-fill"
                            style={{
                                width: `${flourishPercentage}%`,
                                backgroundColor: finalConfig.visual.flourish.activeColor,
                                boxShadow: `0 0 6px ${finalConfig.visual.flourish.glowColor}`
                            }}
                        />
                        <span className="resource-value-right">{flourishValue}</span>
                    </div>

                    {/* Momentum Adjustment Menu */}
                    {showMomentumMenu && (
                        <div className="resource-adjust-menu momentum-menu-left">
                            <div className="menu-header">Adjust Momentum ({momentumValue}/{momentumMax})</div>
                            <div className="menu-buttons">
                                <button onClick={() => setLocalMomentum(Math.min(momentumMax, momentumValue + 1))}>+1 Hit</button>
                                <button onClick={() => setLocalMomentum(Math.min(momentumMax, momentumValue + 2))}>+2 Crit</button>
                                <button onClick={() => setLocalMomentum(Math.max(0, momentumValue - 2))}>-2 Spend</button>
                                <button onClick={() => setLocalMomentum(Math.max(0, momentumValue - 4))}>-4 Spend</button>
                            </div>
                            <div className="menu-custom-input">
                                <input
                                    type="text"
                                    placeholder="e.g., 18 or -5"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = e.target.value.trim();
                                            if (val.startsWith('+') || val.startsWith('-')) {
                                                const delta = parseInt(val);
                                                if (!isNaN(delta)) {
                                                    setLocalMomentum(Math.max(0, Math.min(momentumMax, momentumValue + delta)));
                                                }
                                            } else {
                                                const abs = parseInt(val);
                                                if (!isNaN(abs)) {
                                                    setLocalMomentum(Math.max(0, Math.min(momentumMax, abs)));
                                                }
                                            }
                                            e.target.value = '';
                                            setShowMomentumMenu(false);
                                        }
                                    }}
                                />
                            </div>
                            <button className="menu-reset" onClick={() => { setLocalMomentum(0); setShowMomentumMenu(false); }}>Reset to 0</button>
                        </div>
                    )}

                    {/* Flourish Adjustment Menu */}
                    {showFlourishMenu && (
                        <div className="resource-adjust-menu flourish-menu-right">
                            <div className="menu-header">Adjust Flourish ({flourishValue}/{flourishMax})</div>
                            <div className="menu-buttons">
                                <button
                                    onClick={() => setLocalFlourish(Math.min(flourishMax, flourishValue + 1))}
                                    disabled={flourishValue >= flourishMax}
                                >
                                    +1 Earn
                                </button>
                                <button
                                    onClick={() => setLocalFlourish(Math.max(0, flourishValue - 1))}
                                    disabled={flourishValue === 0}
                                >
                                    -1 Spend
                                </button>
                            </div>
                            <div className="menu-custom-input">
                                <input
                                    type="text"
                                    placeholder="e.g., 3 or -1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = e.target.value.trim();
                                            if (val.startsWith('+') || val.startsWith('-')) {
                                                const delta = parseInt(val);
                                                if (!isNaN(delta)) {
                                                    setLocalFlourish(Math.max(0, Math.min(flourishMax, flourishValue + delta)));
                                                }
                                            } else {
                                                const abs = parseInt(val);
                                                if (!isNaN(abs)) {
                                                    setLocalFlourish(Math.max(0, Math.min(flourishMax, abs)));
                                                }
                                            }
                                            e.target.value = '';
                                            setShowFlourishMenu(false);
                                        }
                                    }}
                                />
                            </div>
                            <button className="menu-reset" onClick={() => { setLocalFlourish(0); setShowFlourishMenu(false); }}>Reset to 0</button>
                        </div>
                    )}

                    {/* Stance Transition Menu */}
                    {showStanceMenu && (
                        <div className="stance-menu-compact">
                            <div className="menu-header">
                                Change Stance (Costs Momentum)
                                {selectedSpecialization === 'Flow Master' && (
                                    <div style={{ fontSize: '9px', fontWeight: 500, marginTop: '2px', color: '#3498DB' }}>
                                        Flow Master: -1 cost (min 1)
                                    </div>
                                )}
                                {selectedSpecialization === 'Shadow Dancer' && (
                                    <div style={{ fontSize: '9px', fontWeight: 500, marginTop: '2px', color: '#2C3E50' }}>
                                        Shadow Dancer: Shadow Step from anywhere (3 cost)
                                    </div>
                                )}
                            </div>
                            <div className="stance-grid">
                                {availableTransitions.map((stanceName) => {
                                    const stanceData = stances[stanceName];
                                    const cost = getTransitionCost(currentStance, stanceName);
                                    const canAfford = momentumValue >= cost;

                                    // Get stance details for tooltip
                                    const stanceDetails = {
                                        'Flowing Water': {
                                            type: 'Defensive/Evasive',
                                            bonuses: ['+2 armor', '+10 ft movement', 'Reroll 1s on damage dice'],
                                            penalties: ['-1d4 damage']
                                        },
                                        'Striking Serpent': {
                                            type: 'Offensive/Precision',
                                            bonuses: ['Crit on highest 2 damage die results', '+1d6 damage'],
                                            penalties: ['-1 armor', 'Miss on lowest 2 damage die results']
                                        },
                                        'Whirling Wind': {
                                            type: 'AoE/Multi-target',
                                            bonuses: ['Attacks hit all adjacent enemies', '+5 ft reach'],
                                            penalties: ['-2 armor', 'Cannot parry']
                                        },
                                        'Rooted Stone': {
                                            type: 'Defensive/Counter',
                                            bonuses: ['+4 armor', 'Reroll misses once', 'Immune to knockback'],
                                            penalties: ['-15 ft movement', 'Cannot dash', '-1d4 damage']
                                        },
                                        'Dancing Blade': {
                                            type: 'Balanced/Hub',
                                            bonuses: ['Can transition to any stance (4 Momentum)', '+1d4 damage'],
                                            penalties: ['No stance-specific bonuses']
                                        },
                                        'Shadow Step': {
                                            type: 'Stealth/Burst',
                                            bonuses: ['+2d6 damage from stealth', 'Enemies have disadvantage to detect you', '+10 ft movement'],
                                            penalties: ['-3 armor in bright light', 'Miss on lowest 3 damage die results in bright light']
                                        }
                                    }[stanceName] || { type: '', bonuses: [], penalties: [] };

                                    const tooltipText = `${stanceName}\n${stanceDetails.type}\n\nCost: ${cost} Momentum\n\nBonuses:\n${stanceDetails.bonuses.map(b => `• ${b}`).join('\n')}${stanceDetails.penalties.length > 0 ? `\n\nPenalties:\n${stanceDetails.penalties.map(p => `• ${p}`).join('\n')}` : ''}`;

                                    return (
                                        <button
                                            key={stanceName}
                                            className={`stance-option-compact ${!canAfford ? 'disabled' : ''}`}
                                            onClick={() => canAfford && transitionToStance(stanceName)}
                                            disabled={!canAfford}
                                            title={tooltipText}
                                            style={{ borderColor: stanceData.color }}
                                        >
                                            <i className={stanceData.icon} style={{ color: stanceData.color }}></i>
                                            <span className="stance-cost-compact">{cost}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Specialization Passive Menu (for rules section) */}
                    {showSpecPassiveMenu && size === 'large' && (
                        <div className="stance-menu-compact" style={{ minWidth: '240px' }}>
                            <div className="menu-header">Select Specialization</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {['Flow Master', 'Duelist', 'Shadow Dancer'].map((spec) => {
                                    const passive = {
                                        'Flow Master': 'Flowing Transitions: -1 Momentum cost on transitions',
                                        'Duelist': 'Perfect Precision: Crit on highest 3 die results in Serpent/Stone',
                                        'Shadow Dancer': 'Shadow Affinity: Enter Shadow Step from any stance (3 cost)'
                                    }[spec];

                                    return (
                                        <button
                                            key={spec}
                                            className={`menu-buttons`}
                                            onClick={() => {
                                                setSelectedSpecialization(spec);
                                                setShowSpecPassiveMenu(false);
                                            }}
                                            style={{
                                                background: selectedSpecialization === spec ? 'rgba(52, 73, 94, 0.6)' : 'rgba(52, 73, 94, 0.3)',
                                                border: selectedSpecialization === spec ? '2px solid rgba(139, 69, 19, 0.8)' : '1px solid rgba(139, 69, 19, 0.4)',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                color: '#d8c9a9',
                                                fontFamily: "'Crimson Text', serif",
                                                fontSize: '10px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px'
                                            }}
                                        >
                                            <div style={{ fontWeight: 700, fontSize: '11px' }}>{spec}</div>
                                            <div style={{ fontSize: '9px', opacity: 0.8 }}>{passive}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Specialization Passive Button (for rules section only) */}
                {size === 'large' && (
                    <div style={{
                        marginTop: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        position: 'relative'
                    }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSpecPassiveMenu(!showSpecPassiveMenu);
                                setShowStanceMenu(false);
                                setShowMomentumMenu(false);
                                setShowFlourishMenu(false);
                            }}
                            style={{
                                background: 'rgba(52, 73, 94, 0.4)',
                                border: '1px solid rgba(139, 69, 19, 0.5)',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: '#d8c9a9',
                                fontFamily: "'Crimson Text', serif",
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(52, 73, 94, 0.6)';
                                e.currentTarget.style.borderColor = 'rgba(139, 69, 19, 0.7)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(52, 73, 94, 0.4)';
                                e.currentTarget.style.borderColor = 'rgba(139, 69, 19, 0.5)';
                            }}
                        >
                            <i className="fas fa-star" style={{ marginRight: '6px', color: '#F39C12' }}></i>
                            Specialization: {selectedSpecialization}
                        </button>
                        <div style={{
                            fontSize: '9px',
                            color: '#7a6a4a',
                            fontStyle: 'italic',
                            fontFamily: "'Crimson Text', serif",
                            textAlign: 'center'
                        }}>
                            {getSpecPassive().name}: {getSpecPassive().description.split('.')[0]}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render tooltip (following item tooltip pattern)
    const renderTooltip = () => {
        if (!showTooltip || !finalConfig.tooltip) return null;

        const sphereCount = finalClassResource.spheres?.length || 0;
        const rageState = finalConfig.type === 'rage' ? getRageState(finalClassResource.current) : '';

        // Skip tooltip title replacement for Chronarch (handles its own tooltips)
        const tooltipTitle = finalConfig.tooltip.title
            ? finalConfig.tooltip.title
                .replace('{current}', finalClassResource.current)
                .replace('{max}', finalClassResource.max)
                .replace('{count}', sphereCount)
                .replace('{state}', rageState)
                .replace('{stacks}', finalClassResource.stacks?.length || 0)
                .replace('{risk}', finalClassResource.risk || 0)
                .replace('{volatility}', finalClassResource.volatility || 0)
            : '';

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
                    ref={tooltipRef}
                    className="class-resource-tooltip rage-tooltip"
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        transform: tooltipPlacement === 'above' ? 'translate(-50%, calc(-100% - 10px))' : 'translate(-50%, 10px)',
                        pointerEvents: 'none',
                        zIndex: 999999999
                    }}
                >
                    {finalConfig.type !== 'rage' && finalConfig.type !== 'dual-resource' && finalConfig.visual?.type !== 'mayhem-modifiers' && finalConfig.visual?.type !== 'time-shards-strain' && finalConfig.visual?.type !== 'ascension-blood' && finalConfig.visual?.type !== 'hexbreaker-charges' && (
                        <div className="tooltip-description">
                            <span className="tooltip-header">
                                <i className={`${finalConfig.visual.icon || 'fas fa-atom'} tooltip-icon`} style={{ color: finalConfig.visual.activeColor || '#9370DB' }}></i>
                            </span>
                            {finalConfig.tooltip.description}
                        </div>
                    )}

                    {/* Simple sphere count */}
                    {finalConfig.type === 'spheres' && sphereCount > 0 && (
                        <div className="tooltip-sphere-count">
                            Banked: <strong>{sphereCount} sphere{sphereCount !== 1 ? 's' : ''}</strong>
                        </div>
                    )}

                    {/* Bladedancer Tooltips */}
                    {finalConfig.type === 'dual-resource' && bladedancerHoverSection && (
                        <div className="tooltip-rage-bar">
                            {bladedancerHoverSection === 'momentum' && (
                                <>
                                    <div className="bladedancer-tooltip-header">Momentum: {localMomentum}/20</div>
                                    <div className="bladedancer-tooltip-section">
                                        <div className="bladedancer-tooltip-label">Generation</div>
                                        <div className="bladedancer-tooltip-mechanics">
                                            <div className="bladedancer-tooltip-mechanic"><strong>+1</strong> on hit</div>
                                            <div className="bladedancer-tooltip-mechanic"><strong>+2</strong> on max damage die (crit)</div>
                                            <div className="bladedancer-tooltip-mechanic"><strong>+1</strong> on dodge/parry</div>
                                        </div>
                                    </div>
                                    <div className="bladedancer-tooltip-section">
                                        <div className="bladedancer-tooltip-label">Consumption</div>
                                        <div className="bladedancer-tooltip-mechanics">
                                            <div className="bladedancer-tooltip-mechanic"><strong>2-4</strong> stance transitions</div>
                                            <div className="bladedancer-tooltip-mechanic"><strong>3-6</strong> abilities</div>
                                        </div>
                                    </div>
                                    <div className="bladedancer-tooltip-section">
                                        <div className="bladedancer-tooltip-label">Decay</div>
                                        <div className="bladedancer-tooltip-mechanics">
                                            <div className="bladedancer-tooltip-mechanic"><strong>-1</strong> on lowest damage die (miss)</div>
                                            <div className="bladedancer-tooltip-mechanic"><strong>-1</strong> when taking damage</div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {bladedancerHoverSection === 'flourish' && (
                                <>
                                    <div className="bladedancer-tooltip-header">Flourish: {localFlourish}/5</div>
                                    <div className="bladedancer-tooltip-section">
                                        <div className="bladedancer-tooltip-label">Earning Flourish</div>
                                        <div className="bladedancer-tooltip-mechanics">
                                            <div className="bladedancer-tooltip-mechanic"><strong>+1</strong> per signature move</div>
                                            <div className="bladedancer-tooltip-mechanic">Each stance has 1 signature move</div>
                                        </div>
                                    </div>
                                    <div className="bladedancer-tooltip-section">
                                        <div className="bladedancer-tooltip-label">Spending Flourish</div>
                                        <div className="bladedancer-tooltip-mechanics">
                                            <div className="bladedancer-tooltip-mechanic"><strong>2-5</strong> ultimate abilities</div>
                                        </div>
                                    </div>
                                    <div className="bladedancer-tooltip-section">
                                        <div className="bladedancer-tooltip-value" style={{ fontStyle: 'italic', fontSize: '9px' }}>
                                            Does not decay - persists between combats
                                        </div>
                                    </div>
                                </>
                            )}

                            {bladedancerHoverSection === 'stance' && (() => {
                                const stances = finalConfig.visual?.stances || {};
                                const currentStanceData = stances[currentStance] || {};
                                const details = {
                                    'Flowing Water': {
                                        bonuses: ['+2 armor', '+10 ft movement', 'Reroll 1s on damage dice'],
                                        penalties: ['-1d4 damage']
                                    },
                                    'Striking Serpent': {
                                        bonuses: ['Crit on highest 2 damage die results', '+1d6 damage'],
                                        penalties: ['-1 armor', 'Miss on lowest 2 damage die results']
                                    },
                                    'Whirling Wind': {
                                        bonuses: ['Attacks hit all adjacent enemies', '+5 ft reach'],
                                        penalties: ['-2 armor', 'Cannot parry']
                                    },
                                    'Rooted Stone': {
                                        bonuses: ['+4 armor', 'Reroll misses once', 'Immune to knockback'],
                                        penalties: ['-15 ft movement', 'Cannot dash', '-1d4 damage']
                                    },
                                    'Dancing Blade': {
                                        bonuses: ['Can transition to any stance (4 Momentum)', '+1d4 damage'],
                                        penalties: ['No stance-specific bonuses']
                                    },
                                    'Shadow Step': {
                                        bonuses: ['+2d6 damage from stealth', 'Enemies have disadvantage to detect you', '+10 ft movement'],
                                        penalties: ['-3 armor in bright light', 'Miss on lowest 3 damage die results in bright light']
                                    }
                                }[currentStance] || { bonuses: [], penalties: [] };

                                // Add specialization bonuses to the current stance
                                const specBonus = (() => {
                                    if (selectedSpecialization === 'Duelist' && (currentStance === 'Striking Serpent' || currentStance === 'Rooted Stone')) {
                                        return 'Duelist: Crit on highest 3 die results | Reroll 1s';
                                    }
                                    return null;
                                })();

                                return (
                                    <>
                                        <div className="bladedancer-tooltip-header">{currentStance}</div>
                                        <div className="bladedancer-stance-type">{currentStanceData.type}</div>
                                        {specBonus && (
                                            <div style={{
                                                fontSize: '9px',
                                                color: '#9B59B6',
                                                fontStyle: 'italic',
                                                textAlign: 'center',
                                                marginTop: '4px',
                                                padding: '2px 4px',
                                                background: 'rgba(155, 89, 182, 0.1)',
                                                borderRadius: '3px'
                                            }}>
                                                ⭐ {specBonus}
                                            </div>
                                        )}
                                        <div className="bladedancer-stance-bonuses">
                                            {details.bonuses.length > 0 && (
                                                <div className="bladedancer-stance-bonus-col bonuses">
                                                    <div className="col-title">Bonuses</div>
                                                    <ul>
                                                        {details.bonuses.map((bonus, i) => (
                                                            <li key={i}>{bonus}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {details.penalties.length > 0 && (
                                                <div className="bladedancer-stance-bonus-col penalties">
                                                    <div className="col-title">Penalties</div>
                                                    <ul>
                                                        {details.penalties.map((penalty, i) => (
                                                            <li key={i}>{penalty}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {details.penalties.length === 0 && details.bonuses.length > 0 && (
                                                <div className="bladedancer-stance-bonus-col penalties">
                                                    <div className="col-title">Penalties</div>
                                                    <div style={{ fontSize: '9px', textAlign: 'center', color: '#7a6a4a', fontStyle: 'italic' }}>None</div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Chronarch Time Shards & Temporal Strain Tooltips */}
                    {finalConfig.visual?.type === 'time-shards-strain' && chronarchHoverSection && (
                        <div className="tooltip-rage-bar">
                            {chronarchHoverSection === 'shards' && (
                                <>
                                    <div className="rage-tooltip-state">
                                        <div className="state-name">Time Shards: {localTimeShards}/10</div>
                                        <div className="state-columns">
                                            <div className="state-col">
                                                <div className="col-title">Generation</div>
                                                <ul>
                                                    <li><strong>+1</strong> per spell cast</li>
                                                    <li>Persists between combats</li>
                                                </ul>
                                            </div>
                                            <div className="state-col">
                                                <div className="col-title">Usage</div>
                                                <ul>
                                                    <li>Spend on <strong>Temporal Flux</strong></li>
                                                    <li>Cost: <strong>1-10</strong> shards</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        fontStyle: 'italic',
                                        fontSize: '9px',
                                        textAlign: 'center',
                                        color: '#81D4FA',
                                        marginTop: '6px',
                                        padding: '4px',
                                        background: 'rgba(79, 195, 247, 0.1)',
                                        borderRadius: '3px'
                                    }}>
                                        ⏳ Power resource - accumulate to unleash time magic
                                    </div>
                                </>
                            )}

                            {chronarchHoverSection === 'strain' && (() => {
                                const strainValue = localTemporalStrain;
                                const getStrainState = (strain) => {
                                    if (strain >= 10) return { name: 'BACKLASH!', color: '#B71C1C' };
                                    if (strain >= 9) return { name: 'Critical', color: '#C62828' };
                                    if (strain >= 7) return { name: 'Danger', color: '#E53935' };
                                    if (strain >= 5) return { name: 'Warning', color: '#FB8C00' };
                                    if (strain >= 3) return { name: 'Caution', color: '#F9A825' };
                                    return { name: 'Safe', color: '#2E7D32' };
                                };
                                const state = getStrainState(strainValue);

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">
                                                Temporal Strain: {strainValue}/10
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: state.color,
                                                    fontWeight: 'bold',
                                                    marginLeft: '8px',
                                                    padding: '2px 6px',
                                                    background: `${state.color}22`,
                                                    borderRadius: '3px'
                                                }}>
                                                    {state.name}
                                                </span>
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Accumulation</div>
                                                    <ul>
                                                        <li><strong>+1 to +5</strong> per Flux ability</li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Decay</div>
                                                    <ul>
                                                        <li><strong>-1</strong> per turn</li>
                                                        <li>(if no Flux used)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {strainValue >= 10 && (
                                            <div className="rage-tooltip-warning" style={{ background: 'rgba(183, 28, 28, 0.15)', borderColor: '#B71C1C' }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>⚠️ TEMPORAL BACKLASH</div>
                                                <div className="state-columns">
                                                    <div className="state-col">
                                                        <div className="col-title">Immediate</div>
                                                        <ul>
                                                            <li>Lose next turn</li>
                                                            <li>Take <strong>10 damage</strong></li>
                                                        </ul>
                                                    </div>
                                                    <div className="state-col">
                                                        <div className="col-title">Reset</div>
                                                        <ul>
                                                            <li>Strain → 0</li>
                                                            <li>All effects end</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {strainValue >= 7 && strainValue < 10 && (
                                            <div style={{
                                                fontStyle: 'italic',
                                                fontSize: '9px',
                                                textAlign: 'center',
                                                color: '#E53935',
                                                marginTop: '6px',
                                                padding: '4px',
                                                background: 'rgba(229, 57, 53, 0.1)',
                                                borderRadius: '3px'
                                            }}>
                                                ⚠️ Approaching Backlash threshold!
                                            </div>
                                        )}
                                        <div style={{
                                            fontStyle: 'italic',
                                            fontSize: '9px',
                                            textAlign: 'center',
                                            color: '#FF5252',
                                            marginTop: '6px',
                                            padding: '4px',
                                            background: 'rgba(255, 82, 82, 0.1)',
                                            borderRadius: '3px'
                                        }}>
                                            ⚠️ Risk resource - balance power with safety
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Covenbane Hexbreaker Charges Tooltips */}
                    {finalConfig.visual?.type === 'hexbreaker-charges' && covenbaneHoverSection && (
                        <div className="tooltip-rage-bar">
                            {covenbaneHoverSection === 'charges' && (() => {
                                const chargesValue = localHexbreakerCharges;
                                const getPassiveBonuses = (charges) => {
                                    const bonuses = {
                                        0: { damage: '0', speed: '+0ft', crit: '20', trueDmg: '0%' },
                                        1: { damage: '+1d4', speed: '+5ft', crit: '20', trueDmg: '6%' },
                                        2: { damage: '+1d6', speed: '+10ft', crit: '20', trueDmg: '7%' },
                                        3: { damage: '+2d6', speed: '+15ft', crit: '19-20', trueDmg: '8%' },
                                        4: { damage: '+3d6', speed: '+20ft', crit: '19-20', trueDmg: '9%' },
                                        5: { damage: '+4d6', speed: '+25ft', crit: '18-20', trueDmg: '10%' },
                                        6: { damage: '+5d6', speed: '+30ft', crit: '18-20', trueDmg: '11%' }
                                    };
                                    return bonuses[charges] || bonuses[0];
                                };
                                const bonuses = getPassiveBonuses(chargesValue);

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">Hexbreaker Charges: {chargesValue}/6</div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Passive Bonuses</div>
                                                    <ul>
                                                        <li>Damage: <strong>{bonuses.damage}</strong></li>
                                                        <li>Speed: <strong>{bonuses.speed}</strong></li>
                                                        <li>Crit: <strong>{bonuses.crit}</strong></li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Spend Options</div>
                                                    <ul>
                                                        <li><strong>1:</strong> Shadow Step</li>
                                                        <li><strong>2:</strong> Curse Eater</li>
                                                        <li><strong>3:</strong> Dark Pursuit</li>
                                                        <li><strong>6:</strong> Hexbreaker Fury</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {chargesValue === 6 && (
                                            <div className="rage-tooltip-warning" style={{ background: 'rgba(192, 192, 192, 0.15)', borderColor: '#C0C0C0' }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>MAX CHARGES - ULTIMATE READY</div>
                                                <div className="state-columns">
                                                    <div className="state-col">
                                                        <div className="col-title">Hexbreaker Fury</div>
                                                        <ul>
                                                            <li>AoE damage (30ft)</li>
                                                            <li>Stun all enemies</li>
                                                        </ul>
                                                    </div>
                                                    <div className="state-col">
                                                        <div className="col-title">Or Save For</div>
                                                        <ul>
                                                            <li>+5d6 damage/attack</li>
                                                            <li>+30ft speed</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </>
                                );
                            })()}

                            {covenbaneHoverSection === 'counter' && (
                                <>
                                    <div className="rage-tooltip-state">
                                        <div className="state-name">Attack Counter: {localAttackCounter}/3</div>
                                        <div className="state-columns">
                                            <div className="state-col">
                                                <div className="col-title">True Damage</div>
                                                <ul>
                                                    <li>Every <strong>3rd attack</strong></li>
                                                    <li>Ignores all armor/resistances</li>
                                                </ul>
                                            </div>
                                            <div className="state-col">
                                                <div className="col-title">Scaling</div>
                                                <ul>
                                                    <li>Base: <strong>+1d6</strong></li>
                                                    <li>At 6 charges: <strong>+4d8</strong></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    {localAttackCounter === 3 && (
                                        <div className="rage-tooltip-warning" style={{ background: 'rgba(255, 215, 0, 0.15)', borderColor: '#FFD700' }}>
                                            <div style={{ fontWeight: 'bold', color: '#FFD700' }}>TRUE DAMAGE READY!</div>
                                            <div style={{ fontSize: '9px', marginTop: '4px' }}>Next attack deals bonus true damage</div>
                                        </div>
                                    )}

                                </>
                            )}
                        </div>
                    )}

                    {/* Deathcaller Ascension Paths & Blood Tokens Tooltips */}
                    {finalConfig.visual?.type === 'ascension-blood' && deathcallerHoverSection && (
                        <div className="tooltip-rage-bar">
                            {deathcallerHoverSection === 'paths' && (() => {
                                const activePaths = localAscensionPaths.filter(p => p).length;
                                const activePathsList = finalConfig.paths.filter((_, i) => localAscensionPaths[i]);

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">Necrotic Ascension: {activePaths}/7 Paths Active</div>
                                            {activePathsList.length > 0 && (
                                                <div className="state-columns">
                                                    <div className="state-col">
                                                        <div className="col-title">Active Boons</div>
                                                        <ul>
                                                            {activePathsList.map((path, i) => (
                                                                <li key={i}><strong>{path.shortName}:</strong> {path.boon}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="state-col">
                                                        <div className="col-title">Active Curses</div>
                                                        <ul>
                                                            {activePathsList.map((path, i) => (
                                                                <li key={i}><strong>{path.shortName}:</strong> {path.curse}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                            {activePathsList.length === 0 && (
                                                <div style={{ fontSize: '9px', textAlign: 'center', color: '#7a6a4a', fontStyle: 'italic', marginTop: '6px' }}>
                                                    No paths activated yet
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                            {deathcallerHoverSection === 'tokens' && (() => {
                                const tokensValue = localBloodTokens;
                                const warningThreshold = finalConfig.bloodTokens?.warningThreshold || 10;
                                const dangerThreshold = finalConfig.bloodTokens?.dangerThreshold || 20;
                                const burstDamage = tokensValue; // 1d10 per token

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">Blood Tokens: {tokensValue}</div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Generation</div>
                                                    <ul>
                                                        <li><strong>1 HP</strong> sacrificed = <strong>1 Token</strong></li>
                                                        <li>Requires <strong>Crimson Pact</strong> path</li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Usage</div>
                                                    <ul>
                                                        <li><strong>1 Token</strong> = <strong>+1d6</strong> necrotic damage</li>
                                                        <li>Can spend multiple per spell</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {tokensValue >= dangerThreshold && (
                                            <div className="rage-tooltip-warning" style={{ background: 'rgba(255, 0, 0, 0.15)', borderColor: '#FF0000' }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>💀 EXTREME DANGER!</div>
                                                <div className="state-columns">
                                                    <div className="state-col">
                                                        <div className="col-title">Burst Damage</div>
                                                        <ul>
                                                            <li><strong>{burstDamage}d10</strong> damage</li>
                                                            <li>~{Math.floor(burstDamage * 5.5)} average</li>
                                                        </ul>
                                                    </div>
                                                    <div className="state-col">
                                                        <div className="col-title">Timer</div>
                                                        <ul>
                                                            <li><strong>10 minutes</strong></li>
                                                            <li>(15 with Crimson Pact)</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {tokensValue >= warningThreshold && tokensValue < dangerThreshold && (
                                            <div style={{
                                                fontStyle: 'italic',
                                                fontSize: '9px',
                                                textAlign: 'center',
                                                color: '#FF6B6B',
                                                marginTop: '6px',
                                                padding: '4px',
                                                background: 'rgba(255, 107, 107, 0.1)',
                                                borderRadius: '3px'
                                            }}>
                                                ⚠️ High token count - use soon or risk burst!
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Berserker Rage Tooltip */}
                    {finalConfig.type === 'rage' && finalConfig.rageStates && (
                        <div className="tooltip-rage-bar">
                            {(() => {
                                const rageValue = localRage;
                                const currentState = finalConfig.rageStates.find(s => rageValue >= s.range[0] && rageValue <= s.range[1]);
                                const isOverheated = rageValue > 100;

                                return (
                                    <>
                                        {currentState && (
                                            <div className="rage-tooltip-state">
                                                <div className="state-name">{currentState.name}</div>
                                                <div className="state-columns">
                                                    <div className="state-col">
                                                        <div className="col-title">Bonus</div>
                                                        {(currentState.bonuses && currentState.bonuses.length > 0) ? (
                                                            <ul>
                                                                {currentState.bonuses.map((b, i) => (<li key={i}>{b}</li>))}
                                                            </ul>
                                                        ) : (<div className="col-empty">—</div>)}
                                                    </div>
                                                    <div className="state-col">
                                                        <div className="col-title">Penalty</div>
                                                        {(currentState.penalties && currentState.penalties.length > 0) ? (
                                                            <ul>
                                                                {currentState.penalties.map((p, i) => (<li key={i}>{p}</li>))}
                                                            </ul>
                                                        ) : (<div className="col-empty">—</div>)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {isOverheated && (
                                            <div className="rage-tooltip-warning">
                                                ⚠️ OVERHEAT: Take 2d6 damage if not spent this round!
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Chaos Weaver Tooltips */}
                    {finalConfig.visual?.type === 'mayhem-modifiers' && chaosWeaverHoverSection && (
                        <div className="tooltip-rage-bar chaos-weaver-tooltip">
                            {chaosWeaverHoverSection === 'modifiers' && (
                                <>
                                    <div className="bladedancer-tooltip-header">Mayhem Modifiers: {localModifiers}/20</div>

                                    <div className="chaos-tooltip-columns">
                                        <div className="chaos-tooltip-column">
                                            <div className="bladedancer-tooltip-label">Generation</div>
                                            <div className="bladedancer-tooltip-mechanics">
                                                <div className="bladedancer-tooltip-mechanic"><strong>Chaotic Infusion (4 mana):</strong> Gain 1d4 modifiers</div>
                                                <div className="bladedancer-tooltip-mechanic"><strong>Wild Conduit (6 mana):</strong> Gain 2d4 modifiers</div>
                                                <div className="bladedancer-tooltip-mechanic"><strong>Unpredictable Surge (5 mana):</strong> Gain 1d6 modifiers</div>
                                            </div>
                                        </div>

                                        <div className="chaos-tooltip-column">
                                            <div className="bladedancer-tooltip-label">Usage</div>
                                            <div className="bladedancer-tooltip-mechanics">
                                                <div className="bladedancer-tooltip-mechanic">After rolling on a chaos table, spend modifiers</div>
                                                <div className="bladedancer-tooltip-mechanic">Each modifier adjusts the result by ±1</div>
                                                <div className="bladedancer-tooltip-mechanic">Example: Roll 15 on d20, spend 3 to get 12 or 18</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
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
    // Rage, Bladedancer, Chronarch, Chaos Weaver, and Deathcaller handle their own tooltips internally
    const isArcanoneer = finalConfig.visual.type === 'elemental-spheres';
    const isBladedancer = finalConfig.type === 'dual-resource';
    const isBerserker = finalConfig.type === 'rage';
    const isChaosWeaver = finalConfig.visual?.type === 'mayhem-modifiers';
    const isChronarch = finalConfig.visual?.type === 'time-shards-strain';
    const isDeathcaller = finalConfig.visual?.type === 'ascension-blood';

    return (
        <div
            className={`class-resource-wrapper ${isGMMode ? 'clickable' : ''}`}
            onMouseEnter={!isArcanoneer && !isBerserker && !isBladedancer && !isChaosWeaver && !isChronarch && !isDeathcaller ? handleMouseEnter : undefined}
            onMouseLeave={!isArcanoneer && !isBerserker && !isBladedancer && !isChaosWeaver && !isChronarch && !isDeathcaller ? handleMouseLeave : undefined}
            onMouseMove={!isArcanoneer && !isBerserker && !isBladedancer && !isChaosWeaver && !isChronarch && !isDeathcaller ? handleMouseMove : undefined}
            onClick={handleClick}
            style={{ cursor: isGMMode ? 'pointer' : 'default' }}
        >
            {renderResourceDisplay()}
            {!isArcanoneer && renderTooltip()}
        </div>
    );
};

export default ClassResourceBar;
