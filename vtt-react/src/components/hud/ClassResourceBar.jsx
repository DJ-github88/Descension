import React, { useState, useRef, useEffect } from 'react';
import { getClassResourceConfig } from '../../data/classResources';
import TooltipPortal from '../tooltips/TooltipPortal';
import DemonConfigModal from './DemonConfigModal';
import PlaguebringerResourceBar from '../../data/classes/plaguebringer/components/PlaguebringerResourceBar';
import PrimalistResourceBar from '../../data/classes/primalist/components/PrimalistResourceBar';
import PyrofiendResourceBar from '../../data/classes/pyrofiend/components/PyrofiendResourceBar';
import SpellguardResourceBar from '../../data/classes/spellguard/components/SpellguardResourceBar';
import TitanResourceBar from '../../data/classes/titan/components/TitanResourceBar';
import ToxicologistResourceBar from '../../data/classes/toxicologist/components/ToxicologistResourceBar';
import WardenResourceBar from '../../data/classes/warden/components/WardenResourceBar';
import WitchDoctorResourceBar from '../../data/classes/witchdoctor/components/WitchDoctorResourceBar';

const ClassResourceBar = ({
    characterClass,
    classResource,
    isGMMode = false,
    onResourceClick = null,
    size = 'normal', // 'small', 'normal', 'large'
    context = 'hud' // 'hud' or 'account' - controls whether to show interactive elements
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
    const [localModifiers, setLocalModifiers] = useState(0); // Chaos Weaver Mayhem Modifiers
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

    // State for Dreadnaught (local state for interactive demo)
    const [localDRP, setLocalDRP] = useState(30); // Start with 30 for demo
    const [selectedResistanceType, setSelectedResistanceType] = useState('Slashing'); // Default resistance type
    const [showDRPMenu, setShowDRPMenu] = useState(false);
    const [dreadnaughtHoverSection, setDreadnaughtHoverSection] = useState(null); // 'drp' | 'resistance' | 'rebirth' | null
    const drpBarRef = useRef(null);

    // State for Exorcist (local state for interactive demo)
    const [localDominanceDie, setLocalDominanceDie] = useState(0); // Start with no demon
    const [selectedDemonIndex, setSelectedDemonIndex] = useState(0); // Which demon is currently displayed
    const [boundDemons, setBoundDemons] = useState([
        null, // Empty slot - can be configured
        null  // Empty slot - can be configured
    ]); // Demo: 2 slots (base Exorcist), both empty by default
    const [showDominanceMenu, setShowDominanceMenu] = useState(false);
    const [exorcistHoverSection, setExorcistHoverSection] = useState(null); // 'dominance' | null
    const dominanceBarRef = useRef(null);
    const [showDemonConfigModal, setShowDemonConfigModal] = useState(false);
    const [demonConfigMode, setDemonConfigMode] = useState('create'); // 'create' | 'edit'
    const [demonConfigInitialData, setDemonConfigInitialData] = useState(null);

    // State for False Prophet (local state for interactive demo)
    const [localMadness, setLocalMadness] = useState(8); // Start with 8 for demo
    const [showMadnessMenu, setShowMadnessMenu] = useState(false);
    const [falseProphetHoverSection, setFalseProphetHoverSection] = useState(null); // 'madness' | null
    const madnessBarRef = useRef(null);

    // State for Fate Weaver (local state for interactive demo)
    const [localThreads, setLocalThreads] = useState(7); // Start with 7 for demo (mid-range)
    const [showThreadsMenu, setShowThreadsMenu] = useState(false);
    const [fateWeaverHoverSection, setFateWeaverHoverSection] = useState(null); // 'threads' | null
    const threadsBarRef = useRef(null);

    // State for Formbender (local state for interactive demo)
    const [localWildInstinct, setLocalWildInstinct] = useState(8); // Start with 8 for demo
    const [currentForm, setCurrentForm] = useState('nightstalker'); // Start in Nightstalker form
    const [showWIMenu, setShowWIMenu] = useState(false);
    const [showFormMenu, setShowFormMenu] = useState(false);
    const [formbenderHoverSection, setFormbenderHoverSection] = useState(null); // 'wi' | 'form' | null
    const wiBarRef = useRef(null);

    // State for Gambler (local state for interactive demo)
    const [localFortunePoints, setLocalFortunePoints] = useState(5); // Start with 5 for demo
    const [gamblerSpec, setGamblerSpec] = useState('high-roller'); // Default to High Roller
    const [showFPMenu, setShowFPMenu] = useState(false);
    const [showSpecMenu, setShowSpecMenu] = useState(false);
    const [gamblerHoverSection, setGamblerHoverSection] = useState(null); // 'fp' | null
    const fpBarRef = useRef(null);

    // State for Huntress (local state for interactive demo)
    const [localQuarryMarks, setLocalQuarryMarks] = useState(3); // Start with 3 for demo
    const [huntressSpec, setHuntressSpec] = useState('bladestorm'); // 'bladestorm' | 'beastmaster' | 'shadowdancer'
    const [companionHP, setCompanionHP] = useState(50); // Companion HP
    const [companionMaxHP] = useState(50); // Companion max HP
    const [showQMMenu, setShowQMMenu] = useState(false);
    const [showHuntressSpecMenu, setShowHuntressSpecMenu] = useState(false);
    const [huntressHoverSection, setHuntressHoverSection] = useState(null); // 'marks' | 'companion' | null
    const qmBarRef = useRef(null);

    // State for Inscriptor (local state for interactive demo)
    const [localRunes, setLocalRunes] = useState(5); // Start with 5 for demo
    const [localInscriptions, setLocalInscriptions] = useState(2); // Start with 2 for demo
    const [inscriptorSpec, setInscriptorSpec] = useState('base'); // 'base' | 'runebinder' | 'enchanter' | 'glyphweaver'
    const [showRunesMenu, setShowRunesMenu] = useState(false);
    const [showInscriptorSpecMenu, setShowInscriptorSpecMenu] = useState(false);
    const [inscriptorHoverSection, setInscriptorHoverSection] = useState(null); // 'runes' | 'inscriptions' | null
    const inscriptorBarRef = useRef(null);

    // State for Lichborne (local state for interactive demo)
    const [localPhylacteryHP, setLocalPhylacteryHP] = useState(25); // Start with 25 for demo
    const [eternalFrostActive, setEternalFrostActive] = useState(false); // Aura state
    const [lichborneSpec, setLichborneSpec] = useState('frostbound_tyrant'); // 'frostbound_tyrant' | 'spectral_reaper' | 'phylactery_guardian'
    const [showPhylacteryMenu, setShowPhylacteryMenu] = useState(false);
    const [showLichborneSpecMenu, setShowLichborneSpecMenu] = useState(false);
    const [lichborneHoverSection, setLichborneHoverSection] = useState(null); // 'phylactery' | 'aura' | null
    const phylacteryBarRef = useRef(null);

    // State for Lunarch (local state for interactive demo)
    const [currentLunarPhase, setCurrentLunarPhase] = useState('new_moon'); // 'new_moon' | 'waxing_moon' | 'full_moon' | 'waning_moon'
    const [roundsInPhase, setRoundsInPhase] = useState(0); // 0-2 (3 rounds per phase)
    const [lunarchSpec, setLunarchSpec] = useState('moonlight_sentinel'); // 'moonlight_sentinel' | 'starfall_invoker' | 'lunar_guardian'
    const [showLunarPhaseMenu, setShowLunarPhaseMenu] = useState(false);
    const [showLunarchSpecMenu, setShowLunarchSpecMenu] = useState(false);
    const [lunarchHoverSection, setLunarchHoverSection] = useState(null); // 'phase' | 'timer' | null
    const lunarPhaseBarRef = useRef(null);

    // State for Martyr (local state for interactive demo)
    const [localDevotionLevel, setLocalDevotionLevel] = useState(3); // Start with level 3 for demo
    const [localDevotionDamage, setLocalDevotionDamage] = useState(45); // Damage accumulated (45/60 toward level 4)
    const [martyrSpec, setMartyrSpec] = useState('redemption'); // 'redemption' | 'zealot' | 'ascetic'
    const [showDevotionMenu, setShowDevotionMenu] = useState(false);
    const [showMartyrSpecMenu, setShowMartyrSpecMenu] = useState(false);
    const [martyrHoverSection, setMartyrHoverSection] = useState(null); // 'devotion' | null
    const devotionBarRef = useRef(null);

    // State for Minstrel (local state for interactive demo)
    const [localNotes, setLocalNotes] = useState([3, 1, 2, 0, 2, 1, 0]); // Start with some notes for demo (I, II, III, IV, V, VI, VII)
    const [minstrelSpec, setMinstrelSpec] = useState('battlechoir'); // 'battlechoir' | 'soulsinger' | 'dissonance'
    const [minstrelHoverSection, setMinstrelHoverSection] = useState(null); // 'note-0' through 'note-6' | 'spec' | null
    const [showNoteMenus, setShowNoteMenus] = useState([false, false, false, false, false, false, false]); // One for each note
    const [showMinstrelSpecMenu, setShowMinstrelSpecMenu] = useState(false);
    const minstrelBarRef = useRef(null);

    // State for Oracle (local state for interactive demo)
    const [localVisions, setLocalVisions] = useState(6); // Start with 6 for demo
    const [oracleSpec, setOracleSpec] = useState('seer'); // 'seer' | 'truthseeker' | 'fateweaver'
    const [predictionAccuracy, setPredictionAccuracy] = useState({ total: 5, correct: 4, chain: 2 }); // Tracking predictions
    const [lastVisionGain, setLastVisionGain] = useState([
        { source: 'Correct Prediction (Moderate)', amount: 2 },
        { source: 'Witness Critical', amount: 1 },
        { source: 'Revelation', amount: 1 }
    ]); // Last 3 Vision gains
    const [showVisionsMenu, setShowVisionsMenu] = useState(false);
    const [showOracleSpecMenu, setShowOracleSpecMenu] = useState(false);
    const [oracleHoverSection, setOracleHoverSection] = useState(null); // 'visions' | null
    const visionsBarRef = useRef(null);

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

        const updatePosition = () => {
            const tt = tooltipRef.current?.getBoundingClientRect();
            if (!tt) return;

            const margin = 10;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Decide vertical placement based on current tooltip position and available space
            let placement = 'above';
            let y = tooltipPosition.y;

            const spaceAbove = tooltipPosition.y - margin;
            const spaceBelow = viewportHeight - tooltipPosition.y - margin;
            const tooltipHeightWithMargin = tt.height + 20; // Extra margin for safety

            // Choose placement based on available space
            if (spaceAbove < tooltipHeightWithMargin && spaceBelow >= tooltipHeightWithMargin) {
                placement = 'below';
            } else if (spaceAbove >= tooltipHeightWithMargin) {
                placement = 'above';
            } else {
                // Not enough space either way, choose the side with more space
                placement = spaceBelow > spaceAbove ? 'below' : 'above';

                // If showing above but not enough space, clamp Y position to keep tooltip in viewport
                if (placement === 'above' && spaceAbove < tooltipHeightWithMargin) {
                    // Calculate how much the tooltip would extend above the viewport
                    // With transform: translate(-50%, calc(-100% - 10px)), the tooltip top would be at:
                    // y - tt.height - 10
                    const tooltipTop = y - tt.height - 10;
                    if (tooltipTop < margin) {
                        // Adjust y so tooltip top is at margin
                        y = margin + tt.height + 10;
                    }
                }
            }

            // Clamp horizontally accounting for translateX(-50%)
            const minX = margin + tt.width / 2;
            const maxX = viewportWidth - margin - tt.width / 2;
            const x = Math.max(minX, Math.min(maxX, tooltipPosition.x));

            // Update both placement and position if needed
            if (placement !== tooltipPlacement) {
                setTooltipPlacement(placement);
            }
            if (x !== tooltipPosition.x || y !== tooltipPosition.y) {
                setTooltipPosition({ x, y });
            }
        };

        // Run immediately and on next frame to ensure dimensions are available
        updatePosition();
        requestAnimationFrame(updatePosition);
    }, [showTooltip, tooltipPosition.x, tooltipPosition.y, tooltipPlacement, localRage, localMomentum, localFlourish, bladedancerHoverSection, chaosWeaverHoverSection, chronarchHoverSection, localTimeShards, localTemporalStrain, covenbaneHoverSection, localHexbreakerCharges, localAttackCounter, dreadnaughtHoverSection, localDRP, selectedResistanceType, size]);

    const handleRageBarLeave = () => setShowTooltip(false);


    const finalConfig = config || defaultConfig;
    const finalClassResource = classResource || { current: 0, max: finalConfig.mechanics?.max || 20 };

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
            if (e) {
                e.stopPropagation();
            }
            onResourceClick(finalClassResource.type || finalConfig.id);
        }
    };

    // Handle demon config modal save (Exorcist)
    const handleDemonConfigSave = (demonData) => {
        const updatedDemons = [...boundDemons];
        updatedDemons[selectedDemonIndex] = demonData;
        setBoundDemons(updatedDemons);
        setLocalDominanceDie(demonData.dd);
        setShowDemonConfigModal(false);
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
            case 'drp-resilience':
                return renderDRPResilience();
            case 'dominance-die':
                return renderDominanceDie();
            case 'madness-gauge':
                return renderMadnessGauge();
            case 'threads-of-destiny':
                return renderThreadsOfDestiny();
            case 'wild-instinct-forms':
                return renderWildInstinctForms();
            case 'fortune-points-gambling':
                return renderFortunePointsGambling();
            case 'quarry-marks-companion':
                return renderQuarryMarksCompanion();
            case 'runes-inscriptions':
                return renderRunesInscriptions();
            case 'eternal-frost-phylactery':
                return renderEternalFrostPhylactery();
            case 'lunar-phases':
                return renderLunarPhases();
            case 'devotion-gauge':
                return renderDevotionGauge();
            case 'musical-notes-combo':
                return renderMusicalNotesCombo();
            case 'prophetic-visions':
                return renderPropheticVisions();
            case 'corruption-bar':
                return <PlaguebringerResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} />;
            case 'totemic-synergy':
                return <PrimalistResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} />;
            case 'inferno-veil':
                return <PyrofiendResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} />;
            case 'arcane-absorption':
                return <SpellguardResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} />;
            case 'celestial-devotion':
                return <TitanResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} />;
            case 'alchemical-arsenal':
                return <ToxicologistResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} />;
            case 'vengeance-points':
                return <WardenResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} />;
            case 'voodoo-essence':
                return <WitchDoctorResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} />;
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

    // DRP Resilience display (Dreadnaught)
    const renderDRPResilience = () => {
        const drpValue = localDRP;
        const drpMax = finalClassResource.max || 50;
        const drpPercentage = (drpValue / drpMax) * 100;

        // Calculate passive benefits
        const hasPassiveBenefits = drpValue >= 10;
        const regenAmount = Math.floor(drpValue / 10); // 1 HP per 10 DRP
        const emergencyHP = drpValue * 2; // Dark Rebirth potential

        // Get DRP color based on level
        const getDRPColor = (drp) => {
            if (drp >= 40) return '#8B00FF'; // Intense purple glow
            if (drp >= 30) return '#9370DB'; // Bright purple
            if (drp >= 20) return '#6A0DAD'; // Medium purple
            if (drp >= 10) return '#4B0082'; // Indigo (passive benefits active)
            return '#2E0854'; // Dim purple
        };

        const drpColor = getDRPColor(drpValue);

        // Damage type options for resistance with their glow colors
        const damageTypes = {
            'Slashing': '#C0C0C0',      // Silver
            'Piercing': '#B87333',      // Copper
            'Bludgeoning': '#8B7355',   // Burlywood
            'Fire': '#FF4500',          // Orange-red
            'Cold': '#00CED1',          // Dark turquoise
            'Lightning': '#FFD700',     // Gold
            'Thunder': '#4169E1',       // Royal blue
            'Acid': '#ADFF2F',          // Green-yellow
            'Poison': '#9ACD32',        // Yellow-green
            'Necrotic': '#8B008B',      // Dark magenta
            'Radiant': '#FFD700',       // Gold
            'Force': '#9370DB',         // Medium purple
            'Psychic': '#FF1493'        // Deep pink
        };

        // Get glow color based on resistance type (when 10+ DRP)
        const getGlowColor = () => {
            if (hasPassiveBenefits && damageTypes[selectedResistanceType]) {
                return damageTypes[selectedResistanceType];
            }
            return finalConfig.visual.glowColor; // Default purple glow
        };

        const glowColor = getGlowColor();

        // Helper functions
        const addDRP = (amount) => {
            setLocalDRP(prev => Math.min(prev + amount, drpMax));
        };

        const removeDRP = (amount) => {
            setLocalDRP(prev => Math.max(prev - amount, 0));
        };

        const simulateDamage = (damage) => {
            const drpGained = Math.floor(damage / 5);
            addDRP(drpGained);
        };

        const handleDRPBarEnter = (e) => {
            if (drpBarRef.current) {
                setDreadnaughtHoverSection('drp');
                const rect = drpBarRef.current.getBoundingClientRect();
                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                setShowTooltip(true);
            }
        };

        const handleDRPBarLeave = () => {
            setDreadnaughtHoverSection(null);
            setShowTooltip(false);
        };

        return (
            <div className={`class-resource-bar drp-resilience ${size}`}>
                <div className="drp-bar-wrapper">
                    <div className="drp-bar-container" ref={drpBarRef} onMouseEnter={handleDRPBarEnter} onMouseLeave={handleDRPBarLeave}>
                        <div className="bar-background" style={{
                            borderColor: hasPassiveBenefits ? glowColor : 'rgba(139, 0, 255, 0.4)',
                            boxShadow: hasPassiveBenefits ? `inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px ${glowColor}` : 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'
                        }}>
                            {/* Segmented bar with threshold markers */}
                            <div className="drp-segments">
                                {Array.from({ length: 5 }, (_, sectionIdx) => (
                                    <div key={sectionIdx} className="drp-section">
                                        {Array.from({ length: 10 }, (_, segIdx) => {
                                            const segmentNumber = sectionIdx * 10 + segIdx;
                                            const isFilled = segmentNumber < drpValue;
                                            return (
                                                <div
                                                    key={segIdx}
                                                    className={`drp-segment ${isFilled ? 'filled' : 'empty'}`}
                                                    style={{
                                                        backgroundColor: isFilled ? drpColor : finalConfig.visual.baseColor,
                                                        boxShadow: isFilled ? `0 0 3px ${drpColor}` : 'none'
                                                    }}
                                                />
                                            );
                                        })}
                                        {/* Threshold marker at 10, 20, 30, 40, 50 */}
                                        <div className="drp-threshold-marker" title={`${(sectionIdx + 1) * 10} DRP`} />
                                    </div>
                                ))}
                            </div>
                            <div className="bar-text">
                                {drpValue}/{drpMax} DRP
                            </div>
                        </div>
                    </div>

                    {/* Control button with popup menu */}
                    <div className="drp-controls">
                        <button
                            className="drp-btn drp-menu-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDRPMenu(v => !v);
                            }}
                            title="Adjust DRP"
                        >
                            <i className="fas fa-sliders-h"></i>
                        </button>
                        {showDRPMenu && (
                            <div className="drp-menu" onClick={(e) => e.stopPropagation()}>
                                <div className="drp-menu-section">
                                    <div className="menu-label">Adjust DRP</div>
                                    <div className="drp-menu-row">
                                        <button className="drp-menu-item" onClick={() => addDRP(5)}>+5</button>
                                        <button className="drp-menu-item" onClick={() => removeDRP(5)}>-5</button>
                                    </div>
                                    <div className="drp-menu-row">
                                        <button className="drp-menu-item" onClick={() => addDRP(10)}>+10</button>
                                        <button className="drp-menu-item" onClick={() => removeDRP(10)}>-10</button>
                                    </div>
                                    <div className="drp-menu-row set-row">
                                        <button className="drp-menu-item" onClick={() => setLocalDRP(0)}>Reset</button>
                                        <button className="drp-menu-item" onClick={() => setLocalDRP(drpMax)}>Max</button>
                                    </div>
                                </div>
                                <div className="drp-menu-section">
                                    <div className="menu-label">Simulate Damage</div>
                                    <div className="drp-menu-row">
                                        <button className="drp-menu-item" onClick={() => simulateDamage(25)}>Take 25 dmg (+5 DRP)</button>
                                    </div>
                                    <div className="drp-menu-row">
                                        <button className="drp-menu-item" onClick={() => simulateDamage(50)}>Take 50 dmg (+10 DRP)</button>
                                    </div>
                                </div>
                                {hasPassiveBenefits && (
                                    <div className="drp-menu-section">
                                        <div className="menu-label">Resistance Type</div>
                                        <select
                                            className="drp-resistance-select"
                                            value={selectedResistanceType}
                                            onChange={(e) => setSelectedResistanceType(e.target.value)}
                                        >
                                            {Object.keys(damageTypes).map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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

    // Dominance Die display (Exorcist)
    const renderDominanceDie = () => {
        // Use local state for demo, fallback to classResource
        const currentDemon = boundDemons[selectedDemonIndex];
        const currentDD = currentDemon?.dd ?? localDominanceDie ?? classResource?.current ?? 0;

        // Check if demon slot is empty or escaped
        const isDemonBound = currentDemon && currentDD > 0;

        // Map DD value to percentage (d12=100%, d10=75%, d8=50%, d6=25%, 0=0%)
        const ddToPercentage = (dd) => {
            switch(dd) {
                case 12: return 100;
                case 10: return 75;
                case 8: return 50;
                case 6: return 25;
                case 0: return 0;
                default: return 0;
            }
        };

        // Get color based on DD value
        const getDDColor = (dd) => {
            if (!isDemonBound) return finalConfig.visual.baseColor;
            switch(dd) {
                case 12: return finalConfig.visual.activeColor; // Gold - safe
                case 10: return '#F4C430'; // Yellow-gold - good
                case 8: return finalConfig.visual.warningColor; // Orange - moderate risk
                case 6: return finalConfig.visual.dangerColor; // Red - high risk
                case 0: return finalConfig.visual.criticalColor; // Dark red - critical
                default: return finalConfig.visual.baseColor;
            }
        };

        // Get DD label and demon name
        const getDemonDisplay = () => {
            if (!currentDemon) return { name: 'No demon bound to this slot', ddLabel: '—' };
            if (currentDD === 0) return { name: 'No demon bound to this slot', ddLabel: 'ESCAPED' };
            return { name: currentDemon.name, ddLabel: `d${currentDD}` };
        };

        const { name: demonName, ddLabel } = getDemonDisplay();
        const percentage = ddToPercentage(currentDD);
        const barColor = getDDColor(currentDD);

        // Handlers for tooltip
        const handleDominanceBarEnter = (e) => {
            setExorcistHoverSection('dominance');
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        };

        const handleDominanceBarLeave = () => {
            setExorcistHoverSection(null);
            setShowTooltip(false);
        };

        // Decrease DD by one step
        const decreaseDD = () => {
            if (!currentDemon) return;
            const progression = [12, 10, 8, 6, 0];
            const currentIndex = progression.indexOf(currentDD);
            if (currentIndex < progression.length - 1) {
                const newDD = progression[currentIndex + 1];
                setLocalDominanceDie(newDD);
                // Update the demon's DD in the array
                const updatedDemons = [...boundDemons];
                if (updatedDemons[selectedDemonIndex]) {
                    updatedDemons[selectedDemonIndex].dd = newDD;
                    setBoundDemons(updatedDemons);
                }
            }
        };

        // Increase DD by one step
        const increaseDD = () => {
            if (!currentDemon) return;
            const progression = [12, 10, 8, 6, 0];
            const currentIndex = progression.indexOf(currentDD);
            if (currentIndex > 0) {
                const newDD = progression[currentIndex - 1];
                setLocalDominanceDie(newDD);
                // Update the demon's DD in the array
                const updatedDemons = [...boundDemons];
                if (updatedDemons[selectedDemonIndex]) {
                    updatedDemons[selectedDemonIndex].dd = newDD;
                    setBoundDemons(updatedDemons);
                }
            }
        };

        // Restore DD to maximum
        const restoreDD = () => {
            if (!currentDemon) return;
            setLocalDominanceDie(12);
            const updatedDemons = [...boundDemons];
            if (updatedDemons[selectedDemonIndex]) {
                updatedDemons[selectedDemonIndex].dd = 12;
                setBoundDemons(updatedDemons);
            }
        };

        // Switch to next demon
        const nextDemon = () => {
            const nextIndex = (selectedDemonIndex + 1) % boundDemons.length;
            setSelectedDemonIndex(nextIndex);
            setLocalDominanceDie(boundDemons[nextIndex]?.dd || 0);
        };

        // Switch to previous demon
        const prevDemon = () => {
            const prevIndex = selectedDemonIndex === 0 ? boundDemons.length - 1 : selectedDemonIndex - 1;
            setSelectedDemonIndex(prevIndex);
            setLocalDominanceDie(boundDemons[prevIndex]?.dd || 0);
        };

        return (
            <div className={`class-resource-bar dominance-die-display ${size}`}>
                <div className="dominance-bar-wrapper">
                    <div
                        className="dominance-bar-container"
                        ref={dominanceBarRef}
                        onMouseEnter={handleDominanceBarEnter}
                        onMouseLeave={handleDominanceBarLeave}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDominanceMenu(!showDominanceMenu);
                        }}
                    >
                        <div className="bar-background" style={{
                            borderColor: barColor,
                            boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px ${barColor}`
                        }}>
                            <div
                                className="bar-fill"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: barColor,
                                    boxShadow: `0 0 10px ${barColor}`
                                }}
                            />
                            <div className="bar-text">
                                <span className="demon-name">{demonName}</span>
                                {isDemonBound && <span className="dd-value">{ddLabel}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Dominance Adjustment Menu */}
                    {showDominanceMenu && (
                        <div
                            className="resource-adjust-menu dominance-menu"
                            onMouseEnter={(e) => {
                                e.stopPropagation();
                                setExorcistHoverSection(null); // Hide tooltip when hovering menu
                                setShowTooltip(false); // Also hide the tooltip
                            }}
                            onMouseLeave={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className="menu-header">
                                {isDemonBound ? `Dominance Control - ${demonName}` : 'Demon Binding'}
                            </div>

                            <div className="menu-section">
                                <div className="section-label">Demon Slot ({selectedDemonIndex + 1}/{boundDemons.length})</div>
                                <div className="menu-buttons">
                                    <button onClick={prevDemon} disabled={boundDemons.length <= 1}>
                                        <i className="fas fa-chevron-left"></i> Previous Slot
                                    </button>
                                    <button onClick={nextDemon} disabled={boundDemons.length <= 1}>
                                        Next Slot <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>

                            {isDemonBound && (
                                <div className="menu-section">
                                    <div className="section-label">Dominance Die Adjustment</div>
                                    <div className="menu-buttons">
                                        <button onClick={decreaseDD} disabled={currentDD === 0}>
                                            <i className="fas fa-arrow-down"></i> Demon Acts/Hit Taken
                                        </button>
                                        <button onClick={increaseDD} disabled={currentDD === 12}>
                                            <i className="fas fa-arrow-up"></i> Replenish (+1 Step)
                                        </button>
                                        <button onClick={restoreDD} disabled={currentDD === 12}>
                                            <i className="fas fa-redo"></i> Reassert Dominance (Max)
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="menu-section">
                                <div className="section-label">Demon Management</div>
                                <div className="menu-buttons">
                                    {!currentDemon || currentDD === 0 ? (
                                        <button onClick={() => {
                                            setDemonConfigMode('create');
                                            setDemonConfigInitialData(null);
                                            setShowDemonConfigModal(true);
                                        }}>
                                            <i className="fas fa-plus-circle"></i> Bind New Demon
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setDemonConfigMode('edit');
                                                setDemonConfigInitialData(currentDemon);
                                                setShowDemonConfigModal(true);
                                            }}>
                                                <i className="fas fa-edit"></i> Edit Demon Info
                                            </button>
                                            <button onClick={() => {
                                                if (confirm(`Release ${currentDemon.name}?`)) {
                                                    const updatedDemons = [...boundDemons];
                                                    updatedDemons[selectedDemonIndex] = null;
                                                    setBoundDemons(updatedDemons);
                                                    setLocalDominanceDie(0);
                                                }
                                            }}>
                                                <i className="fas fa-unlink"></i> Release Demon
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="section-label">Specialization Slots</div>
                                <div className="menu-buttons">
                                    <button onClick={() => {
                                        if (boundDemons.length >= 4) {
                                            alert('Maximum 4 demon slots (Demonologist spec)');
                                            return;
                                        }
                                        setBoundDemons([...boundDemons, null]);
                                    }} disabled={boundDemons.length >= 4}>
                                        <i className="fas fa-plus"></i> Add Demon Slot ({boundDemons.length}/4)
                                    </button>
                                    <button onClick={() => {
                                        if (boundDemons.length <= 1) {
                                            alert('Must have at least 1 demon slot');
                                            return;
                                        }
                                        const updatedDemons = [...boundDemons];
                                        updatedDemons.pop();
                                        setBoundDemons(updatedDemons);
                                        if (selectedDemonIndex >= updatedDemons.length) {
                                            setSelectedDemonIndex(updatedDemons.length - 1);
                                            setLocalDominanceDie(updatedDemons[updatedDemons.length - 1]?.dd || 0);
                                        }
                                    }} disabled={boundDemons.length <= 1}>
                                        <i className="fas fa-minus"></i> Remove Demon Slot
                                    </button>
                                </div>
                            </div>

                            <button className="menu-close" onClick={() => setShowDominanceMenu(false)}>
                                <i className="fas fa-times"></i> Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Helper functions for False Prophet (defined at component level for tooltip access)
    const getDangerLevel = (madness) => {
        const levels = finalConfig.dangerLevels || [];
        const level = levels.find(l => madness >= l.min && madness <= l.max);
        return level || { name: 'Stable', color: '#6a0dad' };
    };

    const getNextThreshold = (madness) => {
        const thresholds = [6, 9, 10, 12, 15, 20];
        const next = thresholds.find(t => t > madness);
        return next ? `${next} Madness` : 'MAX';
    };

    // Madness Gauge display (False Prophet)
    const renderMadnessGauge = () => {
        // Use local state for demo, fallback to classResource
        const currentMadness = localMadness ?? classResource?.current ?? 0;
        const maxMadness = finalConfig.mechanics?.max ?? 20;

        const dangerLevel = getDangerLevel(currentMadness);

        // Get segment color based on index
        const getSegmentColor = (index) => {
            if (index < 6) return finalConfig.visual.safeColor;
            if (index < 10) return finalConfig.visual.moderateColor;
            if (index < 15) return finalConfig.visual.highColor;
            if (index < 20) return finalConfig.visual.dangerColor;
            return finalConfig.visual.convulsionColor;
        };

        // Adjustment functions
        const gainMadness = (amount) => {
            const newValue = Math.min(maxMadness, currentMadness + amount);
            setLocalMadness(newValue);
        };

        const spendMadness = (amount) => {
            const newValue = Math.max(0, currentMadness - amount);
            setLocalMadness(newValue);
        };

        const resetMadness = () => {
            setLocalMadness(0);
        };

        const setToConvulsion = () => {
            setLocalMadness(20);
        };

        // Tooltip handlers
        const handleMadnessBarEnter = (e) => {
            setFalseProphetHoverSection('madness');
            const rect = madnessBarRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setTooltipPlacement(spaceBelow > 400 ? 'below' : (spaceAbove > 400 ? 'above' : 'below'));
            setShowTooltip(true);
        };

        const handleMadnessBarLeave = () => {
            setFalseProphetHoverSection(null);
            setShowTooltip(false);
        };

        const handleBarClick = () => {
            setShowMadnessMenu(!showMadnessMenu);
        };

        return (
            <div className={`class-resource-bar madness-gauge ${size}`}>
                <div className="madness-bar-wrapper">
                    <div
                        className="madness-bar-container"
                        ref={madnessBarRef}
                        onMouseEnter={handleMadnessBarEnter}
                        onMouseLeave={handleMadnessBarLeave}
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Segmented madness bar */}
                        <div className="madness-segments">
                            {Array.from({ length: maxMadness }, (_, index) => (
                                <div
                                    key={index}
                                    className={`madness-segment ${index < currentMadness ? 'filled' : 'empty'}`}
                                    style={{
                                        backgroundColor: index < currentMadness ? getSegmentColor(index) : finalConfig.visual.baseColor,
                                        borderColor: finalConfig.visual.segmentBorder,
                                        boxShadow: index < currentMadness ? `0 0 4px ${getSegmentColor(index)}` : 'none'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Madness value label */}
                        <div className="madness-value-label">
                            {currentMadness} / {maxMadness}
                        </div>
                    </div>

                    {/* Adjustment Menu */}
                    {showMadnessMenu && (
                        <div className="madness-adjustment-menu">
                            <div className="menu-section">
                                <div className="menu-section-title">Madness Adjustment</div>
                                <div className="menu-buttons">
                                    <button onClick={() => gainMadness(1)} title="Gain 1 Madness">
                                        <i className="fas fa-plus"></i> +1
                                    </button>
                                    <button onClick={() => gainMadness(3)} title="Simulate 1d4 average">
                                        <i className="fas fa-dice-d6"></i> +1d4 (3)
                                    </button>
                                    <button onClick={() => gainMadness(4)} title="Simulate 1d6 average">
                                        <i className="fas fa-dice-d6"></i> +1d6 (4)
                                    </button>
                                    <button onClick={() => gainMadness(5)} title="Simulate 1d8 average">
                                        <i className="fas fa-dice-d8"></i> +1d8 (5)
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="menu-section-title">Spend Madness</div>
                                <div className="menu-buttons">
                                    <button onClick={() => spendMadness(1)} title="Spend 1 Madness">
                                        <i className="fas fa-minus"></i> -1
                                    </button>
                                    <button onClick={() => spendMadness(3)} title="Spend 1d4 average">
                                        <i className="fas fa-dice-d6"></i> -1d4 (3)
                                    </button>
                                    <button onClick={() => spendMadness(4)} title="Spend 1d6 average">
                                        <i className="fas fa-dice-d6"></i> -1d6 (4)
                                    </button>
                                    <button onClick={() => spendMadness(5)} title="Spend 1d8 average">
                                        <i className="fas fa-dice-d8"></i> -1d8 (5)
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="menu-section-title">Quick Actions</div>
                                <div className="menu-buttons">
                                    <button onClick={resetMadness} title="Reset to 0">
                                        <i className="fas fa-undo"></i> Reset to 0
                                    </button>
                                    <button onClick={setToConvulsion} title="Set to Convulsion threshold" style={{ color: '#DC143C' }}>
                                        <i className="fas fa-exclamation-triangle"></i> Set to 20 (Convulsion)
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <button onClick={() => setShowMadnessMenu(false)} className="close-menu-btn">
                                    <i className="fas fa-times"></i> Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Helper functions for Fate Weaver (defined at component level for tooltip access)
    const getThreadLevel = (threads) => {
        const levels = finalConfig.threadLevels || [];
        const level = levels.find(l => threads >= l.min && threads <= l.max);
        return level || { name: 'Sparse Threads', color: '#9370DB' };
    };

    // Threads of Destiny display (Fate Weaver)
    const renderThreadsOfDestiny = () => {
        // Use local state for demo, fallback to classResource
        const currentThreads = localThreads ?? classResource?.current ?? 0;
        const maxThreads = finalConfig.mechanics?.max ?? 13;

        const threadLevel = getThreadLevel(currentThreads);

        // Get card suit symbol for segment (cycles through ♠ ♥ ♦ ♣)
        const getCardSuit = (index) => {
            const suits = finalConfig.visual.cardSuits || ['♠', '♥', '♦', '♣'];
            return suits[index % suits.length];
        };

        // Get segment color based on index (gradient from purple to gold)
        const getSegmentColor = (index) => {
            const progress = index / maxThreads;
            if (progress < 0.25) return '#9370DB'; // Medium purple
            if (progress < 0.5) return '#B8860B'; // Dark goldenrod
            if (progress < 0.75) return '#FFD700'; // Gold
            return '#FFA500'; // Orange-gold
        };

        // Adjustment functions
        const gainThreads = (amount) => {
            const newValue = Math.min(maxThreads, currentThreads + amount);
            setLocalThreads(newValue);
        };

        const spendThreads = (amount) => {
            const newValue = Math.max(0, currentThreads - amount);
            setLocalThreads(newValue);
        };

        const resetThreads = () => {
            setLocalThreads(0);
        };

        const setToMax = () => {
            setLocalThreads(13);
        };

        // Tooltip handlers
        const handleThreadsBarEnter = (e) => {
            setFateWeaverHoverSection('threads');
            const rect = threadsBarRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setTooltipPlacement(spaceBelow > 400 ? 'below' : (spaceAbove > 400 ? 'above' : 'below'));
            setShowTooltip(true);
        };

        const handleThreadsBarLeave = () => {
            setFateWeaverHoverSection(null);
            setShowTooltip(false);
        };

        const handleBarClick = () => {
            setShowThreadsMenu(!showThreadsMenu);
        };

        return (
            <div className={`class-resource-bar threads-of-destiny ${size}`}>
                <div className="threads-bar-wrapper">
                    <div
                        className="threads-bar-container"
                        ref={threadsBarRef}
                        onMouseEnter={handleThreadsBarEnter}
                        onMouseLeave={handleThreadsBarLeave}
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Segmented threads bar with card suits */}
                        <div className="threads-segments">
                            {Array.from({ length: maxThreads }, (_, index) => (
                                <div
                                    key={index}
                                    className={`thread-segment ${index < currentThreads ? 'woven' : 'empty'}`}
                                    style={{
                                        backgroundColor: index < currentThreads ? getSegmentColor(index) : finalConfig.visual.baseColor,
                                        borderColor: finalConfig.visual.segmentBorder,
                                        boxShadow: index < currentThreads ? `0 0 6px ${getSegmentColor(index)}` : 'none'
                                    }}
                                >
                                    {/* Card suit symbol */}
                                    <span className="card-suit-symbol" style={{
                                        color: index < currentThreads ? '#FFF' : 'rgba(147, 112, 219, 0.3)',
                                        opacity: index < currentThreads ? 0.6 : 0.3
                                    }}>
                                        {getCardSuit(index)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Threads value label */}
                        <div className="threads-value-label">
                            {currentThreads} / {maxThreads}
                        </div>
                    </div>

                    {/* Adjustment Menu */}
                    {showThreadsMenu && (
                        <div className="threads-adjustment-menu">
                            <div className="menu-section">
                                <div className="menu-section-title">Gain Threads (Failures)</div>
                                <div className="menu-buttons">
                                    <button onClick={() => gainThreads(1)} title="Minor failure">
                                        <i className="fas fa-plus"></i> +1 (Minor)
                                    </button>
                                    <button onClick={() => gainThreads(2)} title="Major failure">
                                        <i className="fas fa-plus-circle"></i> +2 (Major)
                                    </button>
                                    <button onClick={() => gainThreads(3)} title="Destiny Weaver bonus">
                                        <i className="fas fa-star"></i> +3 (Weaver)
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="menu-section-title">Spend Threads</div>
                                <div className="menu-buttons">
                                    <button onClick={() => spendThreads(2)} title="Call specific card">
                                        <i className="fas fa-hand-sparkles"></i> -2 (Call Card)
                                    </button>
                                    <button onClick={() => spendThreads(3)} title="Force failure">
                                        <i className="fas fa-times-circle"></i> -3 (Force Fail)
                                    </button>
                                    <button onClick={() => spendThreads(5)} title="Force success">
                                        <i className="fas fa-check-circle"></i> -5 (Force Success)
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="menu-section-title">Quick Actions</div>
                                <div className="menu-buttons">
                                    <button onClick={resetThreads} title="Reset to 0">
                                        <i className="fas fa-undo"></i> Reset to 0
                                    </button>
                                    <button onClick={setToMax} title="Set to maximum" style={{ color: '#FFD700' }}>
                                        <i className="fas fa-crown"></i> Set to 13 (King)
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <button onClick={() => setShowThreadsMenu(false)} className="close-menu-btn">
                                    <i className="fas fa-times"></i> Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Wild Instinct Forms display (Formbender)
    const renderWildInstinctForms = () => {
        const maxWI = finalConfig.mechanics?.max || 15;
        const wiValue = localWildInstinct;
        const forms = finalConfig.visual?.forms || {};
        const activeForm = forms[currentForm] || forms.human;

        // Get form color based on current form
        const getFormColor = () => activeForm.activeColor;
        const getFormGlow = () => activeForm.glowColor;
        const getFormBorder = () => activeForm.borderColor;

        // Handle bar click to toggle WI menu
        const handleBarClick = (e) => {
            e.stopPropagation();
            setShowWIMenu(!showWIMenu);
            setShowFormMenu(false);
        };

        // Handle form indicator click to toggle form menu
        const handleFormClick = (e) => {
            e.stopPropagation();
            setShowFormMenu(!showFormMenu);
            setShowWIMenu(false);
        };

        // Handle WI bar hover
        const handleWIBarEnter = (e) => {
            setFormbenderHoverSection('wi');
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        };

        // Handle form indicator hover
        const handleFormEnter = (e) => {
            setFormbenderHoverSection('form');
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        };

        const handleLeave = () => {
            setFormbenderHoverSection(null);
            setShowTooltip(false);
        };

        // Form transformation handler
        const handleTransform = (formId) => {
            if (formId !== currentForm && formId !== 'human') {
                // Cost 1 WI to transform (unless it's the first transform)
                if (wiValue >= 1) {
                    setLocalWildInstinct(Math.max(0, wiValue - 1));
                }
            }
            setCurrentForm(formId);
            setShowFormMenu(false);
        };

        return (
            <div className={`class-resource-bar wild-instinct-forms ${size}`}>
                <div className="formbender-container">
                    {/* Wild Instinct Segmented Bar */}
                    <div
                        className="wi-bar-wrapper"
                        ref={wiBarRef}
                        onMouseEnter={handleWIBarEnter}
                        onMouseLeave={handleLeave}
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="wi-segments">
                            {Array.from({ length: maxWI }, (_, index) => (
                                <div
                                    key={index}
                                    className={`wi-segment ${index < wiValue ? 'filled' : 'empty'}`}
                                    style={{
                                        backgroundColor: index < wiValue ? getFormColor() : '#2D2D2D',
                                        borderColor: index < wiValue ? getFormBorder() : '#1A1A1A',
                                        boxShadow: index < wiValue ? `0 0 4px ${getFormGlow()}` : 'none'
                                    }}
                                />
                            ))}
                        </div>
                        <div className="wi-value" style={{ color: getFormGlow() }}>
                            {wiValue}/{maxWI} WI
                        </div>
                    </div>

                    {/* Form Indicator */}
                    <div
                        className="form-indicator"
                        onMouseEnter={handleFormEnter}
                        onMouseLeave={handleLeave}
                        onClick={handleFormClick}
                        style={{
                            cursor: 'pointer',
                            backgroundColor: activeForm.color,
                            borderColor: activeForm.borderColor,
                            boxShadow: `0 0 8px ${activeForm.glowColor}`
                        }}
                    >
                        <i className={activeForm.icon} style={{ color: activeForm.glowColor }}></i>
                    </div>

                    {/* WI Adjustment Menu */}
                    {showWIMenu && (
                        <div className="resource-adjust-menu wi-menu">
                            <div className="menu-header">Adjust Wild Instinct ({wiValue}/{maxWI})</div>
                            <div className="menu-buttons">
                                <button onClick={() => setLocalWildInstinct(Math.min(maxWI, wiValue + 1))}>+1 WI</button>
                                <button onClick={() => setLocalWildInstinct(Math.min(maxWI, wiValue + 2))}>+2 Form Action</button>
                                <button onClick={() => setLocalWildInstinct(Math.max(0, wiValue - 1))}>-1 Transform</button>
                                <button onClick={() => setLocalWildInstinct(Math.max(0, wiValue - 3))}>-3 Ability</button>
                                <button onClick={() => setLocalWildInstinct(Math.max(0, wiValue - 5))}>-5 Ultimate</button>
                            </div>
                            <button className="menu-reset" onClick={() => { setLocalWildInstinct(0); setShowWIMenu(false); }}>Reset to 0</button>
                        </div>
                    )}

                    {/* Form Selection Menu */}
                    {showFormMenu && (
                        <div className="resource-adjust-menu form-menu">
                            <div className="menu-header">Transform (1 WI)</div>
                            <div className="form-buttons">
                                {Object.entries(forms).map(([formId, form]) => (
                                    <button
                                        key={formId}
                                        onClick={() => handleTransform(formId)}
                                        className={currentForm === formId ? 'active' : ''}
                                        style={{
                                            borderColor: form.borderColor,
                                            backgroundColor: currentForm === formId ? form.color : 'transparent'
                                        }}
                                    >
                                        <i className={form.icon}></i> {form.name}
                                    </button>
                                ))}
                            </div>
                            <button className="menu-reset" onClick={() => setShowFormMenu(false)}>Close</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Fortune Points Gambling (Gambler)
    const renderFortunePointsGambling = () => {
        const specs = finalConfig.visual?.specializations || {};
        const currentSpec = specs[gamblerSpec] || specs['high-roller'];
        const maxFP = currentSpec.max || 21;
        const fpValue = Math.min(localFortunePoints, maxFP); // Cap at current spec max
        const theme = currentSpec.theme || 'blackjack';
        const specColor = currentSpec.color || '#FFD700';

        return (
            <div className={`class-resource-bar fortune-points-gambling ${size}`}>
                <div className="gambler-container">
                    {/* Specialization Indicator */}
                    <div
                        className="spec-indicator"
                        onClick={() => setShowSpecMenu(!showSpecMenu)}
                        title=""
                        style={{
                            borderColor: specColor,
                            color: specColor
                        }}
                    >
                        <i className={currentSpec.icon} title=""></i>

                        {/* Specialization Menu */}
                        {showSpecMenu && (
                            <div className="spec-menu" onClick={(e) => e.stopPropagation()}>
                                <div className="menu-title">Choose Specialization</div>
                                {Object.entries(specs).map(([key, spec]) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setGamblerSpec(key);
                                            setLocalFortunePoints(Math.min(localFortunePoints, spec.max));
                                            setShowSpecMenu(false);
                                        }}
                                        className={gamblerSpec === key ? 'active' : ''}
                                        style={{
                                            borderColor: spec.color,
                                            color: gamblerSpec === key ? '#000' : spec.color,
                                            background: gamblerSpec === key ? spec.color : 'transparent'
                                        }}
                                    >
                                        <i className={spec.icon}></i> {spec.name} ({spec.max} FP)
                                    </button>
                                ))}
                                <button className="menu-reset" onClick={() => setShowSpecMenu(false)}>Close</button>
                            </div>
                        )}
                    </div>

                    {/* Fortune Points Bar */}
                    <div
                        className="fp-bar-wrapper"
                        ref={fpBarRef}
                        onClick={() => setShowFPMenu(!showFPMenu)}
                        onMouseEnter={(e) => {
                            if (!showFPMenu) {
                                setGamblerHoverSection('fp');
                                const rect = e.currentTarget.getBoundingClientRect();

                                // Calculate tooltip position with screen boundary detection
                                const tooltipWidth = 300;
                                const tooltipHeight = 350;
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
                            }
                        }}
                        onMouseLeave={() => {
                            setGamblerHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        {/* Different visual styles based on theme */}
                        {theme === 'coins' && (
                            <div className="fp-coins">
                                {Array.from({ length: maxFP }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`fp-coin ${i < fpValue ? 'filled' : ''}`}
                                        style={{
                                            backgroundColor: i < fpValue ? specColor : 'rgba(0, 0, 0, 0.3)',
                                            borderColor: i < fpValue ? specColor : '#555',
                                            boxShadow: i < fpValue ? `0 0 6px ${specColor}` : 'none'
                                        }}
                                    >
                                        <i className="fas fa-coins" style={{
                                            color: i < fpValue ? '#000' : '#666',
                                            opacity: i < fpValue ? 1 : 0.3
                                        }}></i>
                                    </div>
                                ))}
                            </div>
                        )}

                        {theme === 'blackjack' && (
                            <div className="fp-blackjack" style={{ borderColor: specColor }}>
                                <div
                                    className="fp-fill"
                                    style={{
                                        width: `${(fpValue / maxFP) * 100}%`,
                                        background: `linear-gradient(90deg, ${specColor} 0%, ${specColor}dd 100%)`,
                                        boxShadow: `0 0 8px ${specColor}`
                                    }}
                                ></div>
                                {/* Chip markers */}
                                {Array.from({ length: maxFP }, (_, i) => (
                                    <div
                                        key={i}
                                        className="fp-chip-marker"
                                        style={{
                                            left: `${(i / maxFP) * 100}%`,
                                            backgroundColor: i < fpValue ? specColor : '#333',
                                            borderColor: i < fpValue ? '#FFF' : '#555'
                                        }}
                                    ></div>
                                ))}
                            </div>
                        )}

                        {theme === 'cards' && (
                            <div className="fp-cards">
                                {Array.from({ length: maxFP }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`fp-card ${i < fpValue ? 'filled' : ''}`}
                                        style={{
                                            backgroundColor: i < fpValue ? specColor : 'rgba(0, 0, 0, 0.3)',
                                            borderColor: i < fpValue ? specColor : '#555',
                                            boxShadow: i < fpValue ? `0 0 4px ${specColor}` : 'none'
                                        }}
                                    >
                                        <i className="fas fa-diamond" style={{
                                            color: i < fpValue ? '#FFF' : '#666',
                                            opacity: i < fpValue ? 1 : 0.3
                                        }}></i>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* FP Value Display */}
                        <div className="fp-value" style={{ color: '#FFF' }}>
                            {fpValue}/{maxFP}
                        </div>

                        {/* FP Adjustment Menu */}
                        {showFPMenu && (
                            <div
                                className="fp-menu"
                                onMouseEnter={() => setGamblerHoverSection(null)}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="menu-title">Adjust Fortune Points</div>
                                <div className="menu-buttons">
                                    <button onClick={() => setLocalFortunePoints(Math.min(maxFP, fpValue + 1))}>
                                        +1 FP (Successful Action)
                                    </button>
                                    <button onClick={() => setLocalFortunePoints(Math.min(maxFP, fpValue + 2))}>
                                        +2 FP (Critical Hit)
                                    </button>
                                    <button onClick={() => setLocalFortunePoints(Math.max(0, fpValue - 1))}>
                                        -1 FP (Minor Adjustment)
                                    </button>
                                    <button onClick={() => setLocalFortunePoints(Math.max(0, fpValue - 3))}>
                                        -3 FP (Moderate Adjustment)
                                    </button>
                                    <button onClick={() => setLocalFortunePoints(Math.max(0, fpValue - 5))}>
                                        -5 FP (Major Adjustment)
                                    </button>
                                    <button onClick={() => setLocalFortunePoints(0)}>
                                        Set to 0
                                    </button>
                                    <button onClick={() => setLocalFortunePoints(Math.floor(maxFP / 2))}>
                                        Set to {Math.floor(maxFP / 2)}
                                    </button>
                                    <button onClick={() => setLocalFortunePoints(maxFP)}>
                                        Set to {maxFP} (Max)
                                    </button>
                                </div>
                                <button className="menu-reset" onClick={() => setShowFPMenu(false)}>
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Quarry Marks & Companion (Huntress)
    const renderQuarryMarksCompanion = () => {
        const specs = finalConfig.visual?.quarryMarks || {};
        const currentSpec = specs[huntressSpec] || specs['bladestorm'];
        const maxQM = specs.max || 5;
        const qmValue = Math.min(localQuarryMarks, maxQM);
        const specColor = currentSpec.activeColor || '#DC143C';
        const specGlow = currentSpec.glowColor || '#FF6B6B';
        const specIcon = currentSpec.icon || 'fa-glaive-alt';
        const specName = currentSpec.name || 'Bladestorm';

        // Companion info
        const companionInfo = finalConfig.visual?.companion || {};
        const companionHPValue = companionHP;
        const companionMaxHPValue = companionMaxHP;
        const companionHPPercent = (companionHPValue / companionMaxHPValue) * 100;

        // Get companion HP bar color
        const getCompanionHPColor = () => {
            if (companionHPPercent > 60) return '#2E7D32'; // Green
            if (companionHPPercent > 30) return '#F9A825'; // Yellow
            return '#C62828'; // Red
        };

        const handleBarClick = () => {
            if (!showQMMenu) {
                // Hide tooltip when opening menu
                setHuntressHoverSection(null);
                setShowTooltip(false);
            }
            setShowQMMenu(!showQMMenu);
        };

        const handleQMBarEnter = (e) => {
            if (showQMMenu) return; // Don't show tooltip when menu is open

            setHuntressHoverSection('spec');
            const rect = qmBarRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            // Position tooltip
            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });

            // Determine best placement
            if (spaceBelow > 300) {
                setTooltipPlacement('below');
            } else if (spaceAbove > 300) {
                setTooltipPlacement('above');
            } else if (spaceRight > 300) {
                setTooltipPlacement('right');
            } else if (spaceLeft > 300) {
                setTooltipPlacement('left');
            } else {
                setTooltipPlacement('below'); // Default
            }

            setShowTooltip(true);
        };

        const handleQMBarLeave = () => {
            if (showQMMenu) return; // Don't hide tooltip when menu is open

            setHuntressHoverSection(null);
            setShowTooltip(false);
        };

        return (
            <div className={`class-resource-bar quarry-marks-companion ${size}`}>
                <div className="huntress-container">
                    {/* Quarry Marks Bar */}
                    <div
                        className="qm-bar-wrapper"
                        ref={qmBarRef}
                    >
                        {/* Segmented Quarry Marks */}
                        <div
                            className="qm-segments"
                            onClick={handleBarClick}
                            onMouseEnter={handleQMBarEnter}
                            onMouseLeave={handleQMBarLeave}
                        >
                            {Array.from({ length: maxQM }, (_, index) => (
                                <div
                                    key={index}
                                    className={`qm-segment ${index < qmValue ? 'filled' : 'empty'}`}
                                    style={{
                                        backgroundColor: index < qmValue ? specColor : specs.emptyColor || '#1A0F08',
                                        borderColor: specs.segmentBorder || '#4A2C1A',
                                        boxShadow: index < qmValue ? `0 0 6px ${specGlow}` : 'none'
                                    }}
                                >
                                    {index < qmValue && (
                                        <i className={`fas ${specIcon === 'fa-glaive-alt' ? 'fa-khanda' : specIcon}`} style={{ color: '#FFF' }}></i>
                                    )}
                                </div>
                            ))}

                            {/* QM Value Display */}
                            <div className="qm-value" style={{ color: specColor }}>
                                {qmValue}/{maxQM}
                            </div>
                        </div>

                        {/* QM Adjustment Menu */}
                        {showQMMenu && (
                            <div
                                className="qm-menu"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="menu-title">Adjust Quarry Marks</div>
                                <div className="menu-buttons">
                                    <button onClick={() => { setLocalQuarryMarks(Math.min(maxQM, qmValue + 1)); setShowQMMenu(false); }}>
                                        +1 QM (Hit/Companion Hit)
                                    </button>
                                    <button onClick={() => { setLocalQuarryMarks(Math.min(maxQM, qmValue + 2)); setShowQMMenu(false); }}>
                                        +2 QM (Critical Hit)
                                    </button>
                                    <button onClick={() => { setLocalQuarryMarks(Math.max(0, qmValue - 1)); setShowQMMenu(false); }}>
                                        -1 QM (Enhance Companion)
                                    </button>
                                    <button onClick={() => { setLocalQuarryMarks(Math.max(0, qmValue - 2)); setShowQMMenu(false); }}>
                                        -2 QM (Extend Chain)
                                    </button>
                                    <button onClick={() => { setLocalQuarryMarks(Math.max(0, qmValue - 3)); setShowQMMenu(false); }}>
                                        -3 QM (Companion Special)
                                    </button>
                                    <button onClick={() => { setLocalQuarryMarks(0); setShowQMMenu(false); }}>
                                        -5 QM (Ultimate Ability)
                                    </button>
                                    <button onClick={() => { setLocalQuarryMarks(0); setShowQMMenu(false); }}>
                                        Set to 0
                                    </button>
                                    <button onClick={() => { setLocalQuarryMarks(maxQM); setShowQMMenu(false); }}>
                                        Set to {maxQM} (Max)
                                    </button>
                                </div>
                                <button className="menu-reset" onClick={() => setShowQMMenu(false)}>
                                    Close
                                </button>
                            </div>
                        )}

                        {/* Specialization Selector (inside QM bar wrapper) */}
                        <div
                            className="spec-selector"
                            onClick={() => setShowHuntressSpecMenu(!showHuntressSpecMenu)}
                            style={{
                                borderColor: specColor,
                                color: specColor
                            }}
                        >
                            <i className={`fas ${specIcon === 'fa-glaive-alt' ? 'fa-khanda' : specIcon}`}></i>

                            {/* Specialization Menu */}
                            {showHuntressSpecMenu && (
                                <div className="spec-menu" onClick={(e) => e.stopPropagation()}>
                                    {Object.entries(specs).filter(([key]) => key !== 'max' && key !== 'baseColor' && key !== 'emptyColor' && key !== 'segmentBorder').map(([key, spec]) => (
                                        <div
                                            key={key}
                                            className={`spec-menu-item ${key}`}
                                            onClick={() => {
                                                setHuntressSpec(key);
                                                setShowHuntressSpecMenu(false);
                                            }}
                                        >
                                            <i className={`fas ${spec.icon === 'fa-glaive-alt' ? 'fa-khanda' : spec.icon}`}></i>
                                            <span>{spec.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Runes & Inscriptions display (Inscriptor)
    const renderRunesInscriptions = () => {
        // Get specialization config
        const specs = finalConfig.visual;
        const currentSpec = specs[inscriptorSpec] || specs.base;
        const maxRunes = currentSpec.maxRunes;
        const maxInscriptions = currentSpec.maxInscriptions;
        const specColor = currentSpec.color;
        const specGlow = currentSpec.glow;
        const specIcon = currentSpec.icon;

        const runesValue = localRunes;
        const inscriptionsValue = localInscriptions;

        // Handlers
        const handleBarClick = () => {
            setShowRunesMenu(!showRunesMenu);
            // Hide tooltip when menu opens
            if (!showRunesMenu) {
                setShowTooltip(false);
                setInscriptorHoverSection(null);
            }
        };

        const handleRunesBarEnter = (e) => {
            if (showRunesMenu) return; // Don't show tooltip if menu is open
            setInscriptorHoverSection('runes');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });

            if (spaceBelow > 300) {
                setTooltipPlacement('below');
            } else if (spaceAbove > 300) {
                setTooltipPlacement('above');
            } else if (spaceRight > 300) {
                setTooltipPlacement('right');
            } else if (spaceLeft > 300) {
                setTooltipPlacement('left');
            } else {
                setTooltipPlacement('below');
            }

            setShowTooltip(true);
        };

        const handleInscriptionsBarEnter = (e) => {
            if (showRunesMenu) return; // Don't show tooltip if menu is open
            setInscriptorHoverSection('inscriptions');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });

            if (spaceBelow > 300) {
                setTooltipPlacement('below');
            } else if (spaceAbove > 300) {
                setTooltipPlacement('above');
            } else if (spaceRight > 300) {
                setTooltipPlacement('right');
            } else if (spaceLeft > 300) {
                setTooltipPlacement('left');
            } else {
                setTooltipPlacement('below');
            }

            setShowTooltip(true);
        };

        const handleBarLeave = () => {
            if (showRunesMenu) return;
            setInscriptorHoverSection(null);
            setShowTooltip(false);
        };

        return (
            <div className={`class-resource-bar runes-inscriptions ${size}`}>
                <div className="inscriptor-container">
                    {/* Combined Runes & Inscriptions Bar */}
                    <div className="ri-bar-wrapper" ref={inscriptorBarRef}>
                        <div className="ri-bar-content">
                        {/* Runes Section */}
                        <div
                            className="runes-section"
                            onClick={handleBarClick}
                            onMouseEnter={handleRunesBarEnter}
                            onMouseLeave={handleBarLeave}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Runes Value Display - Centered */}
                            <div className="ri-section-value runes-value">
                                {runesValue}/{maxRunes}
                            </div>
                            <div className="runes-segments">
                                {Array.from({ length: maxRunes }, (_, index) => {
                                    const runeSymbols = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ']; // Elder Futhark runes
                                    return (
                                        <div
                                            key={`rune-${index}`}
                                            className={`rune-segment ${index < runesValue ? 'filled' : 'empty'}`}
                                            style={{
                                                backgroundColor: index < runesValue ? specs.runes.activeColor : specs.runes.baseColor,
                                                borderColor: specs.runes.segmentBorder,
                                                boxShadow: index < runesValue ? `0 0 6px ${specs.runes.glowColor}` : 'none',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: index < runesValue ? '#FFF' : 'rgba(255, 255, 255, 0.2)'
                                            }}
                                        >
                                            {runeSymbols[index % runeSymbols.length]}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="ri-separator" style={{ borderColor: specColor }}></div>

                        {/* Inscriptions Section */}
                        <div
                            className="inscriptions-section"
                            onClick={handleBarClick}
                            onMouseEnter={handleInscriptionsBarEnter}
                            onMouseLeave={handleBarLeave}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Inscriptions Value Display - Centered */}
                            <div className="ri-section-value inscriptions-value">
                                {inscriptionsValue}/{maxInscriptions}
                            </div>
                            <div className="inscriptions-segments">
                                {Array.from({ length: maxInscriptions }, (_, index) => {
                                    const inscriptionSymbols = ['◈', '◆', '◇', '◉', '○', '●', '◎', '◐']; // Mystical geometric symbols
                                    return (
                                        <div
                                            key={`inscription-${index}`}
                                            className={`inscription-segment ${index < inscriptionsValue ? 'filled' : 'empty'}`}
                                            style={{
                                                backgroundColor: index < inscriptionsValue ? specs.inscriptions.activeColor : specs.inscriptions.baseColor,
                                                borderColor: specs.inscriptions.segmentBorder,
                                                boxShadow: index < inscriptionsValue ? `0 0 6px ${specs.inscriptions.glowColor}` : 'none',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                color: index < inscriptionsValue ? '#FFF' : 'rgba(255, 255, 255, 0.2)'
                                            }}
                                        >
                                            {inscriptionSymbols[index % inscriptionSymbols.length]}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        </div>

                        {/* Adjustment Menu */}
                        {showRunesMenu && (
                            <div className="ri-menu" onClick={(e) => e.stopPropagation()}>
                                <div className="menu-title">Adjust Runes & Inscriptions</div>
                                <div className="menu-section">
                                    <div className="menu-section-title">Runes</div>
                                    <div className="menu-buttons">
                                        <button onClick={() => { setLocalRunes(Math.min(maxRunes, runesValue + 1)); }}>
                                            +1 Rune (Place)
                                        </button>
                                        <button onClick={() => { setLocalRunes(Math.min(maxRunes, runesValue + 3)); }}>
                                            +3 Runes (Form Zone)
                                        </button>
                                        <button onClick={() => { setLocalRunes(Math.max(0, runesValue - 1)); }}>
                                            -1 Rune (Detonate)
                                        </button>
                                        <button onClick={() => { setLocalRunes(0); }}>
                                            Clear All Runes
                                        </button>
                                    </div>
                                </div>
                                <div className="menu-section">
                                    <div className="menu-section-title">Inscriptions</div>
                                    <div className="menu-buttons">
                                        <button onClick={() => { setLocalInscriptions(Math.min(maxInscriptions, inscriptionsValue + 1)); }}>
                                            +1 Inscription (Inscribe Item)
                                        </button>
                                        <button onClick={() => { setLocalInscriptions(Math.max(0, inscriptionsValue - 1)); }}>
                                            -1 Inscription (Remove)
                                        </button>
                                        <button onClick={() => { setLocalInscriptions(0); }}>
                                            Clear All Inscriptions
                                        </button>
                                    </div>
                                </div>
                                <div className="menu-buttons">
                                    <button onClick={() => { setLocalRunes(0); setLocalInscriptions(0); }}>
                                        Reset All
                                    </button>
                                    <button onClick={() => { setLocalRunes(maxRunes); setLocalInscriptions(maxInscriptions); }}>
                                        Set to Max
                                    </button>
                                </div>
                                <button className="menu-reset" onClick={() => setShowRunesMenu(false)}>
                                    Close
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Specialization Selector - Outside the bar */}
                    <div
                        className="inscriptor-spec-selector"
                        onClick={() => setShowInscriptorSpecMenu(!showInscriptorSpecMenu)}
                        style={{
                            borderColor: specColor,
                            color: specColor
                        }}
                    >
                        <i className={`fas ${specIcon}`}></i>

                        {/* Specialization Menu */}
                        {showInscriptorSpecMenu && (
                            <div className="spec-menu" onClick={(e) => e.stopPropagation()}>
                                {Object.entries(specs).filter(([key]) =>
                                    key === 'base' || key === 'runebinder' || key === 'enchanter' || key === 'glyphweaver'
                                ).map(([key, spec]) => (
                                    <div
                                        key={key}
                                        className={`spec-menu-item ${key}`}
                                        onClick={() => {
                                            setInscriptorSpec(key);
                                            setShowInscriptorSpecMenu(false);
                                            // Adjust current values if they exceed new max
                                            setLocalRunes(Math.min(localRunes, spec.maxRunes));
                                            setLocalInscriptions(Math.min(localInscriptions, spec.maxInscriptions));
                                        }}
                                    >
                                        <i className={`fas ${spec.icon}`}></i>
                                        <span>{spec.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Eternal Frost Phylactery display (Lichborne)
    const renderEternalFrostPhylactery = () => {
        // Get specialization config
        const specs = finalConfig.visual;
        const currentSpec = specs[lichborneSpec] || specs.frostbound_tyrant;
        const maxPhylactery = currentSpec.maxPhylactery;
        const segments = currentSpec.segments;
        const specColor = currentSpec.color;
        const specGlow = currentSpec.glow;
        const specIcon = currentSpec.icon;

        const phylacteryValue = localPhylacteryHP;
        const auraActive = eternalFrostActive;

        // Handlers
        const handleBarClick = () => {
            setShowPhylacteryMenu(!showPhylacteryMenu);
            // Hide tooltip when menu opens
            if (!showPhylacteryMenu) {
                setShowTooltip(false);
                setLichborneHoverSection(null);
            }
        };

        const handlePhylacteryBarEnter = (e) => {
            if (showPhylacteryMenu) return; // Don't show tooltip if menu is open
            setLichborneHoverSection('phylactery');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        };

        const handleAuraIconEnter = (e) => {
            if (showPhylacteryMenu) return; // Don't show tooltip if menu is open
            setLichborneHoverSection('aura');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        };

        const handleBarLeave = () => {
            if (showPhylacteryMenu) return;
            setLichborneHoverSection(null);
            setShowTooltip(false);
        };

        const handleAdjustPhylactery = (amount) => {
            setLocalPhylacteryHP(Math.max(0, Math.min(maxPhylactery, phylacteryValue + amount)));
        };

        const handleToggleAura = () => {
            setEternalFrostActive(!auraActive);
        };

        // Get spec passive description
        const getSpecPassive = () => {
            switch (lichborneSpec) {
                case 'frostbound_tyrant':
                    return 'Freeze effects last +1d4 rounds. Frozen enemies take +1d6 damage.';
                case 'spectral_reaper':
                    return 'Frost spells deal +1d6 necrotic damage. Enemies killed have 1/6 chance to rise as spectral minions (1d4 rounds).';
                case 'phylactery_guardian':
                    return 'Phylactery stores 75 HP. Resurrection costs 8 HP, revives at 15 HP.';
                default:
                    return '';
            }
        };

        return (
            <div className={`class-resource-bar eternal-frost-phylactery ${size}`}>
                <div className="lichborne-container">
                    {/* Phylactery Bar with Aura Icon */}
                    <div className="phylactery-bar-wrapper" ref={phylacteryBarRef}>
                        {/* Aura Toggle Icon (Left) */}
                        <div
                            className={`aura-icon ${auraActive ? 'active' : 'inactive'}`}
                            onClick={handleToggleAura}
                            onMouseEnter={handleAuraIconEnter}
                            onMouseLeave={handleBarLeave}
                            style={{
                                color: auraActive ? specGlow : '#555',
                                textShadow: auraActive ? `0 0 8px ${specGlow}` : 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <i className={`fas ${specIcon}`}></i>
                        </div>

                        {/* Phylactery HP Bar */}
                        <div
                            className="phylactery-bar-content"
                            onClick={handleBarClick}
                            onMouseEnter={handlePhylacteryBarEnter}
                            onMouseLeave={handleBarLeave}
                            style={{
                                cursor: 'pointer',
                                borderColor: auraActive ? specGlow : 'rgba(100, 149, 237, 0.4)',
                                boxShadow: auraActive
                                    ? `inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 15px ${specGlow}`
                                    : 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            {/* Phylactery Value Display */}
                            <div className="phylactery-value">
                                {phylacteryValue}/{maxPhylactery}
                            </div>

                            {/* Segmented Phylactery Bar */}
                            <div className="phylactery-segments">
                                {Array.from({ length: segments }, (_, index) => {
                                    const segmentValue = (index + 1) * (maxPhylactery / segments);
                                    const isFilled = phylacteryValue >= segmentValue;
                                    return (
                                        <div
                                            key={`phylactery-${index}`}
                                            className={`phylactery-segment ${isFilled ? 'filled' : 'empty'} ${auraActive ? 'aura-active' : ''}`}
                                            style={{
                                                backgroundColor: isFilled ? specColor : '#1A0F2E',
                                                borderColor: isFilled ? specGlow : '#2E1A5E',
                                                boxShadow: isFilled && auraActive
                                                    ? `0 0 8px ${specGlow}, inset 0 0 4px ${specGlow}`
                                                    : isFilled
                                                        ? `0 0 4px ${specGlow}`
                                                        : 'none'
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Adjustment Menu */}
                    {showPhylacteryMenu && (
                        <div className="phylactery-menu">
                            <div className="menu-section">
                                <div className="menu-title">Phylactery HP</div>
                                <div className="menu-value">{phylacteryValue}/{maxPhylactery}</div>
                                <div className="menu-buttons">
                                    <button onClick={() => handleAdjustPhylactery(-10)}>-10</button>
                                    <button onClick={() => handleAdjustPhylactery(-5)}>-5</button>
                                    <button onClick={() => handleAdjustPhylactery(5)}>+5</button>
                                    <button onClick={() => handleAdjustPhylactery(10)}>+10</button>
                                </div>
                                <div className="menu-info">
                                    {lichborneSpec === 'phylactery_guardian'
                                        ? 'Ritual: Transfer 10 HP (1 hour) | Resurrection: 8 HP → revive at 15 HP (once per combat)'
                                        : 'Ritual: Transfer 10 HP (1 hour) | Resurrection: 10 HP → revive at 10 HP (once per combat)'}
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="menu-title">Eternal Frost Aura</div>
                                <button
                                    className={`aura-toggle-btn ${auraActive ? 'active' : 'inactive'}`}
                                    onClick={handleToggleAura}
                                >
                                    {auraActive ? 'ACTIVE' : 'INACTIVE'}
                                </button>
                                <div className="menu-info">
                                    Active: +1d6 frost damage, chilling DC 17, drains 1d6 HP/turn
                                </div>
                            </div>

                            {/* Specialization Selector */}
                            <div className="menu-section">
                                <div className="menu-title">
                                    Specialization
                                    <button
                                        className="spec-toggle-btn"
                                        onClick={() => setShowLichborneSpecMenu(!showLichborneSpecMenu)}
                                    >
                                        <i className="fas fa-cog"></i>
                                    </button>
                                </div>
                                {showLichborneSpecMenu && (
                                    <div className="spec-selector">
                                        {Object.entries(specs)
                                            .filter(([key]) => key !== 'type' && key !== 'arrangement' && key !== 'baseColor' && key !== 'activeColor' && key !== 'glowColor' && key !== 'icon')
                                            .map(([key, spec]) => (
                                                <div
                                                    key={key}
                                                    className={`spec-option ${lichborneSpec === key ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setLichborneSpec(key);
                                                        setShowLichborneSpecMenu(false);
                                                        // Adjust phylactery HP if switching to/from Phylactery Guardian
                                                        if (key === 'phylactery_guardian') {
                                                            // Can now store up to 75
                                                        } else {
                                                            // Cap at 50 if switching away from Phylactery Guardian
                                                            setLocalPhylacteryHP(Math.min(localPhylacteryHP, 50));
                                                        }
                                                    }}
                                                >
                                                    <i className={`fas ${spec.icon}`}></i>
                                                    <span>{spec.name}</span>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Lunar Phases display (Lunarch)
    const renderLunarPhases = () => {
        // Get phase configurations
        const phases = finalConfig.visual;
        const phaseOrder = ['new_moon', 'waxing_moon', 'full_moon', 'waning_moon'];
        const currentPhaseIndex = phaseOrder.indexOf(currentLunarPhase);
        const currentPhaseConfig = phases[currentLunarPhase];

        // Get specialization config
        const specConfig = phases[lunarchSpec];

        // Handlers
        const handlePhaseClick = () => {
            setShowLunarPhaseMenu(!showLunarPhaseMenu);
            if (!showLunarPhaseMenu) {
                setShowTooltip(false);
                setLunarchHoverSection(null);
            }
        };

        const handlePhaseEnter = (e) => {
            if (showLunarPhaseMenu) return;
            setLunarchHoverSection('phase');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Calculate available space
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            // Adjust x position to keep tooltip in viewport
            let x = rect.left + rect.width / 2;
            const tooltipWidth = 300; // Estimated tooltip width
            if (x + tooltipWidth / 2 > viewportWidth) {
                x = viewportWidth - tooltipWidth / 2 - 10;
            } else if (x - tooltipWidth / 2 < 0) {
                x = tooltipWidth / 2 + 10;
            }

            setTooltipPosition({ x, y: rect.top });
            setShowTooltip(true);
        };

        const handleTimerEnter = (e) => {
            if (showLunarPhaseMenu) return;
            setLunarchHoverSection('timer');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Calculate available space
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const spaceRight = viewportWidth - rect.right;
            const spaceLeft = rect.left;

            // Adjust x position to keep tooltip in viewport
            let x = rect.left + rect.width / 2;
            const tooltipWidth = 300; // Estimated tooltip width
            if (x + tooltipWidth / 2 > viewportWidth) {
                x = viewportWidth - tooltipWidth / 2 - 10;
            } else if (x - tooltipWidth / 2 < 0) {
                x = tooltipWidth / 2 + 10;
            }

            setTooltipPosition({ x, y: rect.top });
            setShowTooltip(true);
        };

        const handleLeave = () => {
            if (showLunarPhaseMenu) return;
            setLunarchHoverSection(null);
            setShowTooltip(false);
        };

        const handleManualShift = (newPhase) => {
            setCurrentLunarPhase(newPhase);
            setRoundsInPhase(0);
            setShowLunarPhaseMenu(false);
        };

        const handleAdvanceRound = () => {
            const newRounds = roundsInPhase + 1;
            if (newRounds >= 3) {
                // Cycle to next phase
                const nextIndex = (currentPhaseIndex + 1) % 4;
                setCurrentLunarPhase(phaseOrder[nextIndex]);
                setRoundsInPhase(0);
            } else {
                setRoundsInPhase(newRounds);
            }
        };

        // Get phase bonuses
        const getPhaseBonuses = (phase) => {
            switch (phase) {
                case 'new_moon':
                    return { bonus: '+2 Armor', theme: 'Defense' };
                case 'waxing_moon':
                    return { bonus: 'Healing +1d4', theme: 'Healing' };
                case 'full_moon':
                    return { bonus: 'Damage +2d6', theme: 'Offense' };
                case 'waning_moon':
                    return { bonus: 'Mana -2 cost', theme: 'Efficiency' };
                default:
                    return { bonus: '', theme: '' };
            }
        };

        const getSpecPassive = () => {
            switch (lunarchSpec) {
                case 'moonlight_sentinel':
                    return 'Critical hits during Full Moon deal +2d6 radiant damage.';
                case 'starfall_invoker':
                    return 'AoE spells during Full Moon affect +5 ft radius.';
                case 'lunar_guardian':
                    return 'Healing during Waxing Moon grants +1d6 temporary HP.';
                default:
                    return '';
            }
        };

        return (
            <div className={`class-resource-bar lunar-phases ${size}`}>
                <div className="lunarch-container">
                    {/* Lunar Phase Bar */}
                    <div className="lunar-phase-bar-wrapper" ref={lunarPhaseBarRef}>
                        {/* Moon Icon (Left) */}
                        <div
                            className="lunar-moon-icon"
                            onClick={handlePhaseClick}
                            onMouseEnter={handlePhaseEnter}
                            onMouseLeave={handleLeave}
                            style={{
                                cursor: 'pointer',
                                background: `radial-gradient(circle, ${currentPhaseConfig.color} 0%, ${currentPhaseConfig.glow} 60%, transparent 100%)`,
                                borderColor: currentPhaseConfig.glow,
                                boxShadow: `0 0 20px ${currentPhaseConfig.glow}, inset 0 0 12px ${currentPhaseConfig.color}`
                            }}
                        >
                            <i className={`fas ${currentPhaseConfig.icon}`} style={{ color: currentPhaseConfig.glow }}></i>
                        </div>

                        {/* Phase Bar Content */}
                        <div
                            className="lunar-phase-bar-content"
                            onClick={handlePhaseClick}
                            onMouseEnter={handlePhaseEnter}
                            onMouseLeave={handleLeave}
                            style={{
                                cursor: 'pointer',
                                borderColor: currentPhaseConfig.glow,
                                boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 15px ${currentPhaseConfig.glow}33`
                            }}
                        >
                            {/* 4 Phase Segments */}
                            <div className="lunar-phase-segments">
                                {phaseOrder.map((phase, index) => {
                                    const phaseConfig = phases[phase];
                                    const isActive = phase === currentLunarPhase;
                                    const isPast = index < currentPhaseIndex;
                                    const isFuture = index > currentPhaseIndex;

                                    return (
                                        <div
                                            key={phase}
                                            className={`lunar-phase-segment ${isActive ? 'active' : isPast ? 'past' : 'future'}`}
                                            style={{
                                                backgroundColor: isActive ? phaseConfig.color : isPast ? `${phaseConfig.color}40` : 'rgba(30, 30, 50, 0.5)',
                                                borderColor: isActive ? phaseConfig.glow : 'rgba(100, 100, 120, 0.3)',
                                                boxShadow: isActive ? `0 0 12px ${phaseConfig.glow}, inset 0 0 8px ${phaseConfig.glow}` : 'none'
                                            }}
                                        >
                                            <i className={`fas ${phaseConfig.icon}`} style={{
                                                color: isActive ? phaseConfig.glow : isPast ? `${phaseConfig.glow}60` : 'rgba(150, 150, 170, 0.5)',
                                                fontSize: '11px'
                                            }}></i>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Round Timer (Right) */}
                        <div
                            className="lunar-round-timer"
                            onMouseEnter={handleTimerEnter}
                            onMouseLeave={handleLeave}
                            style={{
                                borderColor: currentPhaseConfig.glow
                            }}
                        >
                            <div className="timer-segments">
                                {[0, 1, 2].map((round) => (
                                    <div
                                        key={round}
                                        className={`timer-segment ${round < roundsInPhase ? 'filled' : 'empty'}`}
                                        style={{
                                            backgroundColor: round < roundsInPhase ? currentPhaseConfig.glow : 'rgba(50, 50, 70, 0.4)',
                                            boxShadow: round < roundsInPhase ? `0 0 6px ${currentPhaseConfig.glow}` : 'none'
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="timer-label" style={{ color: currentPhaseConfig.glow }}>
                                {roundsInPhase + 1}/3
                            </div>
                        </div>
                    </div>

                    {/* Phase Menu */}
                    {showLunarPhaseMenu && (
                        <div className="lunar-phase-menu">
                            <div className="menu-section">
                                <div className="menu-title">Current Phase: {currentPhaseConfig.name}</div>
                                <div className="menu-value">Round {roundsInPhase + 1}/3</div>
                                <button className="advance-round-btn" onClick={handleAdvanceRound}>
                                    <i className="fas fa-forward"></i> Advance Round
                                </button>
                            </div>

                            <div className="menu-section">
                                <div className="menu-title">Manual Phase Shift (8 Mana)</div>
                                <div className="phase-shift-grid">
                                    {phaseOrder.map((phase) => {
                                        const phaseConfig = phases[phase];
                                        const bonuses = getPhaseBonuses(phase);
                                        const isCurrentPhase = phase === currentLunarPhase;

                                        return (
                                            <div
                                                key={phase}
                                                className={`phase-shift-option ${isCurrentPhase ? 'current' : ''}`}
                                                onClick={() => !isCurrentPhase && handleManualShift(phase)}
                                                style={{
                                                    borderColor: phaseConfig.glow,
                                                    cursor: isCurrentPhase ? 'default' : 'pointer',
                                                    opacity: isCurrentPhase ? 0.5 : 1
                                                }}
                                            >
                                                <i className={`fas ${phaseConfig.icon}`} style={{ color: phaseConfig.glow }}></i>
                                                <div className="phase-shift-name">{phaseConfig.name}</div>
                                                <div className="phase-shift-bonus">{bonuses.bonus}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Specialization Selector */}
                            <div className="menu-section">
                                <div className="menu-title">
                                    Specialization
                                    <button
                                        className="spec-toggle-btn"
                                        onClick={() => setShowLunarchSpecMenu(!showLunarchSpecMenu)}
                                    >
                                        <i className="fas fa-cog"></i>
                                    </button>
                                </div>
                                {showLunarchSpecMenu && (
                                    <div className="spec-selector">
                                        {Object.entries(phases)
                                            .filter(([key]) => key === 'moonlight_sentinel' || key === 'starfall_invoker' || key === 'lunar_guardian')
                                            .map(([key, spec]) => (
                                                <div
                                                    key={key}
                                                    className={`spec-option ${lunarchSpec === key ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setLunarchSpec(key);
                                                        setShowLunarchSpecMenu(false);
                                                    }}
                                                >
                                                    <i className={`fas ${spec.icon}`}></i>
                                                    <span>{spec.name}</span>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Musical Notes Combo display (Minstrel)
    const renderMusicalNotesCombo = () => {
        const notes = finalConfig.visual.notes || [];
        const maxPerNote = finalConfig.mechanics?.maxPerNote || 5;
        const specs = finalConfig.visual.specializations || [];
        const currentSpec = specs.find(s => s.id === minstrelSpec) || specs[0];

        // Handlers for note segments
        const handleNoteClick = (noteIndex) => {
            console.log('Minstrel note clicked:', noteIndex);
            const newMenus = [...showNoteMenus];
            newMenus[noteIndex] = !newMenus[noteIndex];
            setShowNoteMenus(newMenus);
            console.log('Show note menus:', newMenus);
            if (newMenus[noteIndex]) {
                setShowTooltip(false);
                setMinstrelHoverSection(null);
            }
        };

        const handleNoteEnter = (noteIndex, e) => {
            console.log('Minstrel note hover:', noteIndex);
            if (showNoteMenus[noteIndex]) return;
            setMinstrelHoverSection(`note-${noteIndex}`);
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Adjust x position to keep tooltip in viewport
            let x = rect.left + rect.width / 2;
            const tooltipWidth = 300;
            if (x + tooltipWidth / 2 > viewportWidth) {
                x = viewportWidth - tooltipWidth / 2 - 10;
            } else if (x - tooltipWidth / 2 < 0) {
                x = tooltipWidth / 2 + 10;
            }

            setTooltipPosition({ x, y: rect.top });
            setShowTooltip(true);
            console.log('Tooltip should show, position:', { x, y: rect.top });
        };

        const handleNoteLeave = () => {
            console.log('Minstrel note leave');
            setMinstrelHoverSection(null);
            setShowTooltip(false);
        };

        const handleNoteAdjust = (noteIndex, delta) => {
            const newNotes = [...localNotes];
            newNotes[noteIndex] = Math.max(0, Math.min(maxPerNote, newNotes[noteIndex] + delta));
            setLocalNotes(newNotes);
        };

        const handleNoteReset = (noteIndex) => {
            const newNotes = [...localNotes];
            newNotes[noteIndex] = 0;
            setLocalNotes(newNotes);
        };

        const handleSpecClick = () => {
            setShowMinstrelSpecMenu(!showMinstrelSpecMenu);
        };

        return (
            <div className={`class-resource-bar musical-notes-combo ${size}`}>
                <div className="minstrel-container">
                    {/* Musical Notes Bar */}
                    <div className="musical-notes-bar-wrapper" ref={minstrelBarRef}>
                        <div className="musical-notes-segments">
                            {notes.map((note, index) => {
                                const count = localNotes[index] || 0;
                                const fillPercentage = (count / maxPerNote) * 100;

                                return (
                                    <div
                                        key={index}
                                        className={`musical-note-segment ${count > 0 ? 'filled' : 'empty'}`}
                                        onClick={() => handleNoteClick(index)}
                                        onMouseEnter={(e) => handleNoteEnter(index, e)}
                                        onMouseLeave={handleNoteLeave}
                                        style={{
                                            cursor: 'pointer',
                                            borderColor: count > 0 ? note.glow : finalConfig.visual.segmentBorder,
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Fill indicator */}
                                        <div
                                            className="note-fill"
                                            style={{
                                                height: `${fillPercentage}%`,
                                                backgroundColor: note.color,
                                                boxShadow: count > 0 ? `0 0 8px ${note.glow}` : 'none'
                                            }}
                                        />
                                        {/* Note label */}
                                        <div className="note-label" style={{ color: count > 0 ? note.glow : '#7a6a4a' }}>
                                            <div className="note-numeral">{note.numeral}</div>
                                            <div className="note-count">{count}</div>
                                        </div>

                                        {/* Adjustment Menu */}
                                        {showNoteMenus[index] && (
                                            <div className="note-adjustment-menu" onClick={(e) => e.stopPropagation()}>
                                                <div className="menu-header">{note.name} ({note.numeral})</div>
                                                <div className="menu-controls">
                                                    <button onClick={() => handleNoteAdjust(index, -1)} disabled={count === 0}>
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <span className="menu-value">{count}/{maxPerNote}</span>
                                                    <button onClick={() => handleNoteAdjust(index, 1)} disabled={count === maxPerNote}>
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                                <div className="menu-info">
                                                    <div className="info-label">Generated By:</div>
                                                    <div className="info-value">{note.generatedBy}</div>
                                                </div>
                                                <button className="menu-reset" onClick={() => handleNoteReset(index)}>
                                                    Reset to 0
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Specialization Indicator - Only show in HUD context */}
                    {context !== 'account' && (
                        <div
                            className="minstrel-spec-indicator"
                            onClick={handleSpecClick}
                            style={{
                                borderColor: currentSpec.glow,
                                cursor: 'pointer'
                            }}
                            title={currentSpec.name} // Show full name on hover
                        >
                            <i className="fas fa-cog" style={{ color: currentSpec.glow }}></i>

                            {/* Specialization Menu */}
                            {showMinstrelSpecMenu && (
                                <div className="minstrel-spec-menu" onClick={(e) => e.stopPropagation()}>
                                    <div className="menu-title">Select Specialization</div>
                                    {specs.map((spec) => (
                                        <div
                                            key={spec.id}
                                            className={`spec-option ${minstrelSpec === spec.id ? 'selected' : ''}`}
                                            onClick={() => {
                                                setMinstrelSpec(spec.id);
                                                setShowMinstrelSpecMenu(false);
                                            }}
                                            style={{
                                                borderColor: spec.glow,
                                                backgroundColor: minstrelSpec === spec.id ? `${spec.color}22` : 'transparent'
                                            }}
                                        >
                                            <div className="spec-name" style={{ color: spec.glow }}>{spec.name}</div>
                                            <div className="spec-theme">{spec.theme}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Prophetic Visions display (Oracle)
    const renderPropheticVisions = () => {
        const specs = finalConfig.visual || {};
        const currentSpec = specs[oracleSpec] || specs['seer'];
        const maxVisions = specs.max || 10;
        const visionsValue = Math.min(localVisions, maxVisions);
        const specColor = currentSpec.activeColor || '#9370DB';
        const specGlow = currentSpec.glowColor || '#DDA0DD';
        const specIcon = currentSpec.icon || 'fa-eye';
        const specName = currentSpec.name || 'Seer';

        // Calculate visual state based on Vision count
        const getVisionState = () => {
            if (visionsValue >= 8) return 'clarity'; // 8-10: Fully aligned
            if (visionsValue >= 4) return 'stable'; // 4-7: Stable flow
            return 'murky'; // 0-3: Murky foresight
        };

        const visionState = getVisionState();

        // Get opacity based on state
        const getSegmentOpacity = (index) => {
            if (index >= visionsValue) return 0.15; // Empty
            if (visionState === 'clarity') return 1.0;
            if (visionState === 'stable') return 0.85;
            return 0.6; // murky
        };

        const handleBarClick = () => {
            if (!showVisionsMenu) {
                setOracleHoverSection(null);
                setShowTooltip(false);
            }
            setShowVisionsMenu(!showVisionsMenu);
        };

        const handleVisionsBarEnter = (e) => {
            if (showVisionsMenu) return;

            setOracleHoverSection('visions');
            const rect = visionsBarRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setTooltipPlacement(spaceBelow > 400 ? 'below' : (spaceAbove > 400 ? 'above' : 'below'));
            setShowTooltip(true);
        };

        const handleVisionsBarLeave = () => {
            if (showVisionsMenu) return;
            setOracleHoverSection(null);
            setShowTooltip(false);
        };

        const handleVisionsAdjust = (delta) => {
            setLocalVisions(Math.max(0, Math.min(maxVisions, localVisions + delta)));
        };

        const handlePredictionSuccess = (type) => {
            const gains = { simple: 1, moderate: 2, complex: 3 };
            const gain = gains[type] || 1;
            const bonusGain = oracleSpec === 'seer' ? 1 : 0; // Seer gets +1
            const totalGain = gain + bonusGain;

            setLocalVisions(Math.min(maxVisions, localVisions + totalGain));
            setPredictionAccuracy(prev => ({
                total: prev.total + 1,
                correct: prev.correct + 1,
                chain: prev.chain + 1
            }));

            // Update last vision gain
            setLastVisionGain(prev => [
                { source: `Correct Prediction (${type})${bonusGain > 0 ? ' +Seer Bonus' : ''}`, amount: totalGain },
                ...prev.slice(0, 2)
            ]);
        };

        const handlePredictionFailure = () => {
            setPredictionAccuracy(prev => ({
                total: prev.total + 1,
                correct: prev.correct,
                chain: 0 // Break the chain
            }));

            // Add visual feedback for failed prediction
            setLastVisionGain(prev => [
                { source: 'Failed Prediction', amount: 0 },
                ...prev.slice(0, 2)
            ]);
        };

        const handleRevelation = () => {
            const gain = 1;
            setLocalVisions(Math.min(maxVisions, localVisions + gain));
            setLastVisionGain(prev => [
                { source: 'Revelation', amount: gain },
                ...prev.slice(0, 2)
            ]);
        };

        const handleSpecClick = (e) => {
            e.stopPropagation();
            setShowOracleSpecMenu(!showOracleSpecMenu);
        };

        return (
            <div className={`class-resource-bar prophetic-visions-bar ${size}`}>
                <div className="oracle-container">
                    {/* Prophetic Visions Bar */}
                    <div
                        className="visions-bar-wrapper"
                        ref={visionsBarRef}
                    >
                        {/* Vision count display - centered over bar */}
                        <div className="visions-count-overlay" style={{ color: specGlow }}>
                            {visionsValue}/{maxVisions}
                        </div>

                        {/* Segmented Visions */}
                        <div
                            className={`visions-segments visions-${visionState}`}
                            onClick={handleBarClick}
                            onMouseEnter={handleVisionsBarEnter}
                            onMouseLeave={handleVisionsBarLeave}
                        >
                            {Array.from({ length: maxVisions }, (_, index) => (
                                <div
                                    key={index}
                                    className={`vision-segment ${index < visionsValue ? 'filled' : 'empty'} ${visionState}`}
                                    style={{
                                        backgroundColor: index < visionsValue ? specColor : specs.emptyColor || '#0D0718',
                                        borderColor: specs.segmentBorder || '#2E1A5E',
                                        opacity: getSegmentOpacity(index),
                                        boxShadow: index < visionsValue ? `0 0 6px ${specGlow}` : 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {index < visionsValue && visionState === 'clarity' && (
                                        <i className={`fas ${specIcon}`} style={{
                                            color: '#FFF',
                                            fontSize: '10px',
                                            filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.8))'
                                        }}></i>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Specialization Indicator */}
                        <div
                            className="oracle-spec-indicator"
                            onClick={handleSpecClick}
                            style={{
                                borderColor: specColor,
                                background: `linear-gradient(135deg, ${specColor}22 0%, ${specColor}11 100%)`,
                                boxShadow: `0 0 8px ${specColor}66`
                            }}
                        >
                            <i className={`fas ${specIcon}`} style={{ color: specColor }}></i>
                        </div>
                    </div>

                    {/* Visions Adjustment Menu */}
                    {showVisionsMenu && (
                        <div className="visions-menu" onClick={(e) => e.stopPropagation()}>
                            <div className="menu-section">
                                <div className="menu-title">Prophetic Visions</div>
                                <div className="menu-controls">
                                    <button onClick={() => handleVisionsAdjust(-1)} disabled={visionsValue === 0}>
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <span className="menu-value">{visionsValue}/{maxVisions}</span>
                                    <button onClick={() => handleVisionsAdjust(1)} disabled={visionsValue === maxVisions}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                <div className="menu-quick-buttons">
                                    <button onClick={() => setLocalVisions(0)}>Clear</button>
                                    <button onClick={() => setLocalVisions(3)}>Reset (3)</button>
                                    <button onClick={() => setLocalVisions(maxVisions)}>Max</button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="menu-title">Simulate Prediction</div>
                                <div className="prediction-buttons">
                                    <button onClick={() => handlePredictionSuccess('simple')} className="prediction-btn simple">
                                        Simple (+1)
                                    </button>
                                    <button onClick={() => handlePredictionSuccess('moderate')} className="prediction-btn moderate">
                                        Moderate (+2)
                                    </button>
                                    <button onClick={() => handlePredictionSuccess('complex')} className="prediction-btn complex">
                                        Complex (+3)
                                    </button>
                                </div>
                                <button onClick={handlePredictionFailure} className="prediction-btn failure">
                                    Failed Prediction
                                </button>
                            </div>

                            <div className="menu-section">
                                <div className="menu-title">Other Actions</div>
                                <button onClick={handleRevelation} className="action-btn oracle-action-btn">
                                    <i className="fas fa-lightbulb"></i> Revelation (+1)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Oracle Specialization Menu */}
                    {showOracleSpecMenu && (
                        <div className="oracle-spec-menu" onClick={(e) => e.stopPropagation()}>
                            <div className="menu-title">Specialization</div>
                            {['seer', 'truthseeker', 'fateweaver'].map((spec) => {
                                const specConfig = specs[spec];
                                const isSelected = oracleSpec === spec;
                                return (
                                    <div
                                        key={spec}
                                        className={`spec-option ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            setOracleSpec(spec);
                                            setShowOracleSpecMenu(false);
                                        }}
                                        style={{
                                            borderColor: specConfig.activeColor,
                                            background: isSelected
                                                ? `linear-gradient(135deg, ${specConfig.activeColor}33 0%, ${specConfig.activeColor}22 100%)`
                                                : 'rgba(0, 0, 0, 0.3)'
                                        }}
                                    >
                                        <div className="spec-name" style={{ color: specConfig.activeColor }}>
                                            <i className={`fas ${specConfig.icon}`}></i> {specConfig.name}
                                        </div>
                                        <div className="spec-theme">{specConfig.theme}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Helper function to get tooltip header color with better contrast
    const getTooltipHeaderColor = (color) => {
        // Map bright colors to darker versions for better contrast on beige background
        const colorMap = {
            '#FFD700': '#B8860B', // Gold -> DarkGoldenrod
            '#DC143C': '#8B0000', // Crimson -> DarkRed
            '#9CA3AF': '#4B5563'  // Gray -> DarkGray
        };
        return colorMap[color] || color;
    };

    // Devotion Gauge display (Martyr)
    const renderDevotionGauge = () => {
        const maxLevel = 6;
        const thresholds = finalConfig.mechanics?.thresholds || [0, 10, 20, 40, 60, 80, 100];
        const currentLevel = localDevotionLevel;
        const currentDamage = localDevotionDamage;

        // Get specialization colors
        const specColors = finalConfig.visual[martyrSpec] || finalConfig.visual.redemption;
        const activeColor = specColors.activeColor;
        const glowColor = specColors.glowColor;

        // Get current and next threshold
        const currentThreshold = thresholds[currentLevel];
        const nextThreshold = currentLevel < maxLevel ? thresholds[currentLevel + 1] : thresholds[maxLevel];

        // Calculate progress toward next level
        const damageIntoLevel = currentDamage - currentThreshold;
        const damageNeeded = nextThreshold - currentThreshold;
        const progressPercentage = currentLevel >= maxLevel ? 100 : (damageIntoLevel / damageNeeded) * 100;

        // Get current stage info
        const currentStage = finalConfig.stages?.[currentLevel] || { name: 'Unknown', passive: 'None' };

        // Get specialization passives
        const specData = finalConfig.specializations?.[martyrSpec] || finalConfig.specializations?.redemption;

        // Handlers
        const handleDevotionClick = () => {
            setShowDevotionMenu(!showDevotionMenu);
            if (!showDevotionMenu) {
                setShowTooltip(false);
                setMartyrHoverSection(null);
            }
        };

        const handleDevotionEnter = (e) => {
            if (showDevotionMenu) return;
            setMartyrHoverSection('devotion');
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Adjust x position to keep tooltip in viewport
            let x = rect.left + rect.width / 2;
            const tooltipWidth = 320;
            if (x + tooltipWidth / 2 > viewportWidth) {
                x = viewportWidth - tooltipWidth / 2 - 10;
            } else if (x - tooltipWidth / 2 < 0) {
                x = tooltipWidth / 2 + 10;
            }

            // Estimate tooltip height and check if there's space above or below
            const estimatedTooltipHeight = 250; // Approximate height of the tooltip
            const spaceAbove = rect.top;
            const spaceBelow = viewportHeight - rect.bottom;

            // Determine placement: prefer above, but use below if not enough space
            let placement = 'above';
            let y = rect.top;

            if (spaceAbove < estimatedTooltipHeight && spaceBelow > spaceAbove) {
                // Not enough space above and more space below
                placement = 'below';
                y = rect.bottom;
            }

            setTooltipPlacement(placement);
            setTooltipPosition({ x, y });
            setShowTooltip(true);
        };

        const handleDevotionLeave = () => {
            if (showDevotionMenu) return;
            setMartyrHoverSection(null);
            setShowTooltip(false);
        };

        const handleLevelChange = (newLevel) => {
            const clampedLevel = Math.max(0, Math.min(newLevel, maxLevel));
            setLocalDevotionLevel(clampedLevel);
            setLocalDevotionDamage(thresholds[clampedLevel]);
        };

        const handleDamageChange = (newDamage) => {
            const clampedDamage = Math.max(0, Math.min(newDamage, 150));
            setLocalDevotionDamage(clampedDamage);

            // Auto-adjust level based on damage
            let newLevel = 0;
            for (let i = maxLevel; i >= 0; i--) {
                if (clampedDamage >= thresholds[i]) {
                    newLevel = i;
                    break;
                }
            }
            setLocalDevotionLevel(newLevel);
        };

        return (
            <div className={`class-resource-bar devotion-gauge ${size}`}>
                <div className="devotion-bar-wrapper">
                    <div
                        className="devotion-bar-container"
                        ref={devotionBarRef}
                        onMouseEnter={handleDevotionEnter}
                        onMouseLeave={handleDevotionLeave}
                        onClick={handleDevotionClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Segmented devotion bar */}
                        <div className="devotion-segments">
                            {Array.from({ length: maxLevel }, (_, index) => {
                                const level = index + 1;
                                const isFilled = level <= currentLevel;
                                const isPartiallyFilled = level === currentLevel + 1 && currentLevel < maxLevel;

                                return (
                                    <div
                                        key={index}
                                        className={`devotion-segment ${isFilled ? 'filled' : isPartiallyFilled ? 'partial' : 'empty'}`}
                                        style={{
                                            backgroundColor: isFilled ? activeColor : finalConfig.visual.emptyColor,
                                            borderColor: finalConfig.visual.segmentBorder,
                                            boxShadow: isFilled ? `0 0 8px ${glowColor}` : 'none',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Progress fill for partial segment */}
                                        {isPartiallyFilled && (
                                            <div
                                                className="devotion-segment-progress"
                                                style={{
                                                    width: `${progressPercentage}%`,
                                                    backgroundColor: activeColor,
                                                    boxShadow: `0 0 6px ${glowColor}`
                                                }}
                                            />
                                        )}
                                        {/* Level number */}
                                        <span className="devotion-level-number" style={{
                                            color: isFilled ? '#FFF' : '#666',
                                            fontWeight: 'bold',
                                            fontSize: '8px',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 2
                                        }}>
                                            {level}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Damage display */}
                        <div className="devotion-damage-display" style={{ color: glowColor }}>
                            {currentDamage}/{nextThreshold}
                        </div>
                    </div>

                    {/* Devotion Menu */}
                    {showDevotionMenu && (
                        <div className="devotion-menu">
                            <div className="menu-section">
                                <div className="menu-title">Devotion Level: {currentLevel}</div>
                                <div className="menu-value">{currentStage.name}</div>
                                <div className="level-controls">
                                    <button onClick={() => handleLevelChange(currentLevel - 1)} disabled={currentLevel === 0}>
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <span>{currentLevel}/{maxLevel}</span>
                                    <button onClick={() => handleLevelChange(currentLevel + 1)} disabled={currentLevel === maxLevel}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="menu-title">Damage Accumulated</div>
                                <div className="damage-input-group">
                                    <input
                                        type="number"
                                        value={currentDamage}
                                        onChange={(e) => handleDamageChange(parseInt(e.target.value) || 0)}
                                        min="0"
                                        max="150"
                                    />
                                    <div className="damage-quick-buttons">
                                        <button onClick={() => handleDamageChange(currentDamage + 10)}>+10</button>
                                        <button onClick={() => handleDamageChange(currentDamage + 20)}>+20</button>
                                        <button onClick={() => handleDamageChange(0)}>Reset</button>
                                    </div>
                                </div>
                                <div className="damage-info">
                                    Next Level: {nextThreshold} damage ({nextThreshold - currentDamage} needed)
                                </div>
                            </div>

                            {/* Specialization Selector */}
                            <div className="menu-section">
                                <div className="menu-title">
                                    Specialization
                                    <span className="menu-value" style={{ color: specColors.activeColor }}>
                                        {specData?.name || martyrSpec}
                                    </span>
                                </div>
                                <div className="spec-selector-horizontal">
                                    {['redemption', 'zealot', 'ascetic'].map((spec) => {
                                        const specConfig = finalConfig.specializations?.[spec];
                                        const specVisual = finalConfig.visual[spec];
                                        const isSelected = martyrSpec === spec;
                                        return (
                                            <div
                                                key={spec}
                                                className={`spec-option-horizontal ${isSelected ? 'selected' : ''}`}
                                                onClick={() => setMartyrSpec(spec)}
                                                style={{
                                                    borderColor: isSelected ? specVisual.activeColor : 'rgba(139, 69, 19, 0.4)',
                                                    background: isSelected
                                                        ? `linear-gradient(135deg, ${specVisual.activeColor}22 0%, ${specVisual.activeColor}11 100%)`
                                                        : 'rgba(0, 0, 0, 0.2)',
                                                    boxShadow: isSelected ? `0 0 8px ${specVisual.activeColor}66` : 'none'
                                                }}
                                            >
                                                <i
                                                    className="fas fa-cross"
                                                    style={{
                                                        color: specVisual.activeColor
                                                    }}
                                                ></i>
                                                <span style={{
                                                    color: isSelected ? specVisual.activeColor : '#999',
                                                    fontWeight: isSelected ? 'bold' : 'normal'
                                                }}>
                                                    {specConfig?.name || spec}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tooltip */}
                {showTooltip && martyrHoverSection === 'devotion' && (
                    <TooltipPortal>
                        <div
                            className="class-resource-tooltip rage-tooltip"
                            style={{
                                position: 'fixed',
                                left: tooltipPosition.x,
                                top: tooltipPosition.y,
                                transform: tooltipPlacement === 'above'
                                    ? 'translate(-50%, calc(-100% - 10px))'
                                    : 'translate(-50%, 10px)',
                                pointerEvents: 'none',
                                zIndex: 999999999
                            }}
                        >
                            <div className="tooltip-rage-bar">
                                <div className="rage-tooltip-state">
                                    <div className="state-name">Devotion Level {currentLevel}: {currentStage.name}</div>
                                    <div className="state-columns">
                                        <div className="state-col">
                                            <div className="col-title">Generation</div>
                                            <ul>
                                                <li><strong>+Damage</strong> taken</li>
                                                <li><strong>+1 Level</strong> per Intervene</li>
                                                <li>Persists until rest/full heal</li>
                                            </ul>
                                        </div>
                                        <div className="state-col">
                                            <div className="col-title">Usage</div>
                                            <ul>
                                                <li>Spend to <strong>amplify spells</strong></li>
                                                <li>Cost: <strong>1-5 Levels</strong></li>
                                                <li>Passive benefits at each level</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ fontStyle: 'italic', fontSize: '9px', marginTop: '6px', color: '#5a1e12' }}>
                                    Current: {currentDamage} damage | Next: {nextThreshold} damage
                                </div>

                                {/* Current Level Passive */}
                                {currentLevel > 0 && (
                                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(139, 69, 19, 0.3)' }}>
                                        <div style={{ fontSize: '10px', fontWeight: 'bold', color: getTooltipHeaderColor(activeColor) }}>
                                            Level {currentLevel} Passive
                                        </div>
                                        <div style={{ fontSize: '9px', color: '#5a1e12', marginTop: '2px' }}>
                                            {currentStage.passive}
                                        </div>
                                    </div>
                                )}

                                {/* Specialization Passives */}
                                {specData && (
                                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(139, 69, 19, 0.3)' }}>
                                        <div style={{ fontSize: '10px', fontWeight: 'bold', color: getTooltipHeaderColor(activeColor) }}>
                                            {specData.name} Passives
                                        </div>
                                        <div style={{ fontSize: '9px', color: '#5a1e12', marginTop: '4px' }}>
                                            <div><strong>Shared:</strong> {specData.sharedPassive.description}</div>
                                            <div style={{ marginTop: '2px' }}><strong>Unique:</strong> {specData.uniquePassive.description}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TooltipPortal>
                )}
            </div>
        );
    };

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
        // Classes that handle their own tooltips don't need finalConfig.tooltip
        const handlesOwnTooltips = finalConfig.visual?.type === 'musical-notes-combo' ||
                                   finalConfig.visual?.type === 'time-shards-strain' ||
                                   finalConfig.visual?.type === 'mayhem-modifiers' ||
                                   finalConfig.visual?.type === 'ascension-blood' ||
                                   finalConfig.visual?.type === 'hexbreaker-charges' ||
                                   finalConfig.visual?.type === 'drp-resilience' ||
                                   finalConfig.visual?.type === 'dominance-die' ||
                                   finalConfig.visual?.type === 'madness-gauge' ||
                                   finalConfig.visual?.type === 'threads-of-destiny' ||
                                   finalConfig.visual?.type === 'fortune-points-gambling' ||
                                   finalConfig.visual?.type === 'quarry-marks-companion' ||
                                   finalConfig.visual?.type === 'runes-inscriptions' ||
                                   finalConfig.visual?.type === 'eternal-frost-phylactery' ||
                                   finalConfig.visual?.type === 'lunar-phases' ||
                                   finalConfig.visual?.type === 'prophetic-visions' ||
                                   finalConfig.visual?.type === 'corruption-bar' ||
                                   finalConfig.visual?.type === 'dual-resource' ||
                                   finalConfig.visual?.type === 'vengeance-points';

        if (!showTooltip) return null;
        if (!handlesOwnTooltips && !finalConfig.tooltip) return null;

        const sphereCount = finalClassResource.spheres?.length || 0;
        const rageState = finalConfig.type === 'rage' ? getRageState(finalClassResource.current) : '';

        // Skip tooltip title replacement for classes that handle their own tooltips
        const tooltipTitle = finalConfig.tooltip?.title
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
                    {finalConfig.type !== 'rage' && finalConfig.type !== 'dual-resource' && finalConfig.visual?.type !== 'mayhem-modifiers' && finalConfig.visual?.type !== 'time-shards-strain' && finalConfig.visual?.type !== 'ascension-blood' && finalConfig.visual?.type !== 'hexbreaker-charges' && finalConfig.visual?.type !== 'drp-resilience' && finalConfig.visual?.type !== 'dominance-die' && finalConfig.visual?.type !== 'madness-gauge' && finalConfig.visual?.type !== 'threads-of-destiny' && finalConfig.visual?.type !== 'fortune-points-gambling' && finalConfig.visual?.type !== 'quarry-marks-companion' && finalConfig.visual?.type !== 'runes-inscriptions' && finalConfig.visual?.type !== 'musical-notes-combo' && finalConfig.visual?.type !== 'prophetic-visions' && finalConfig.visual?.type !== 'vengeance-points' && finalConfig.tooltip?.description && (
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

                    {/* Dreadnaught DRP Tooltip */}
                    {finalConfig.visual?.type === 'drp-resilience' && dreadnaughtHoverSection === 'drp' && (
                        <div className="tooltip-rage-bar">
                            <div className="state-columns">
                                <div className="state-col">
                                    <div className="col-title">Generation</div>
                                    <ul>
                                        <li><strong>+1 DRP</strong> per 5 damage taken</li>
                                        <li>Calculated from full damage</li>
                                        <li>(before resistance)</li>
                                    </ul>
                                </div>
                                <div className="state-col">
                                    <div className="col-title">Spending</div>
                                    <ul>
                                        <li><strong>Shadow Shield:</strong> 2:1 absorption</li>
                                        <li><strong>Wraith Strike:</strong> +1d6 per 5 DRP</li>
                                        <li><strong>Necrotic Aura:</strong> 15 DRP</li>
                                    </ul>
                                </div>
                            </div>
                            {localDRP >= 10 && (
                                <div style={{
                                    marginTop: '8px',
                                    padding: '8px',
                                    background: (() => {
                                        const damageTypes = {
                                            'Slashing': '#C0C0C0', 'Piercing': '#B87333', 'Bludgeoning': '#8B7355',
                                            'Fire': '#FF4500', 'Cold': '#00CED1', 'Lightning': '#FFD700',
                                            'Thunder': '#4169E1', 'Acid': '#ADFF2F', 'Poison': '#9ACD32',
                                            'Necrotic': '#8B008B', 'Radiant': '#FFD700', 'Force': '#9370DB', 'Psychic': '#FF1493'
                                        };
                                        const color = damageTypes[selectedResistanceType] || '#8B00FF';
                                        return `linear-gradient(135deg, ${color}20, ${color}35)`;
                                    })(),
                                    borderRadius: '4px',
                                    border: `2px solid ${(() => {
                                        const damageTypes = {
                                            'Slashing': '#C0C0C0', 'Piercing': '#B87333', 'Bludgeoning': '#8B7355',
                                            'Fire': '#FF4500', 'Cold': '#00CED1', 'Lightning': '#FFD700',
                                            'Thunder': '#4169E1', 'Acid': '#ADFF2F', 'Poison': '#9ACD32',
                                            'Necrotic': '#8B008B', 'Radiant': '#FFD700', 'Force': '#9370DB', 'Psychic': '#FF1493'
                                        };
                                        return damageTypes[selectedResistanceType] || '#8B00FF';
                                    })()}`,
                                    boxShadow: `0 0 10px ${(() => {
                                        const damageTypes = {
                                            'Slashing': '#C0C0C0', 'Piercing': '#B87333', 'Bludgeoning': '#8B7355',
                                            'Fire': '#FF4500', 'Cold': '#00CED1', 'Lightning': '#FFD700',
                                            'Thunder': '#4169E1', 'Acid': '#ADFF2F', 'Poison': '#9ACD32',
                                            'Necrotic': '#8B008B', 'Radiant': '#FFD700', 'Force': '#9370DB', 'Psychic': '#FF1493'
                                        };
                                        return damageTypes[selectedResistanceType] || '#8B00FF';
                                    })()}50`
                                }}>
                                    <div className="state-columns">
                                        <div className="state-col">
                                            <div className="col-title" style={{
                                                color: (() => {
                                                    const damageTypes = {
                                                        'Slashing': '#FFFFFF', 'Piercing': '#FFD700', 'Bludgeoning': '#DEB887',
                                                        'Fire': '#FF4500', 'Cold': '#00FFFF', 'Lightning': '#FFFF00',
                                                        'Thunder': '#87CEEB', 'Acid': '#ADFF2F', 'Poison': '#00FF00',
                                                        'Necrotic': '#FF00FF', 'Radiant': '#FFFF00', 'Force': '#DA70D6', 'Psychic': '#FF1493'
                                                    };
                                                    return damageTypes[selectedResistanceType] || '#E0B0FF';
                                                })(),
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                textShadow: '0 0 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6)'
                                            }}>Resistance</div>
                                            <ul>
                                                <li><strong>{selectedResistanceType}</strong></li>
                                                <li>Halves damage taken</li>
                                                <li>DRP from full damage</li>
                                            </ul>
                                        </div>
                                        <div className="state-col">
                                            <div className="col-title" style={{
                                                color: (() => {
                                                    const damageTypes = {
                                                        'Slashing': '#FFFFFF', 'Piercing': '#FFD700', 'Bludgeoning': '#DEB887',
                                                        'Fire': '#FF4500', 'Cold': '#00FFFF', 'Lightning': '#FFFF00',
                                                        'Thunder': '#87CEEB', 'Acid': '#ADFF2F', 'Poison': '#00FF00',
                                                        'Necrotic': '#FF00FF', 'Radiant': '#FFFF00', 'Force': '#DA70D6', 'Psychic': '#FF1493'
                                                    };
                                                    return damageTypes[selectedResistanceType] || '#E0B0FF';
                                                })(),
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                textShadow: '0 0 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6)'
                                            }}>Regeneration</div>
                                            <ul>
                                                <li><strong>+{Math.floor(localDRP / 10)} HP/turn</strong></li>
                                                <li>(1 HP per 10 DRP)</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div style={{
                                        marginTop: '6px',
                                        padding: '4px',
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        borderRadius: '3px',
                                        fontSize: '9px',
                                        textAlign: 'center'
                                    }}>
                                        <strong>Dark Rebirth:</strong> If you die, revive with <strong>{localDRP * 2} HP</strong>
                                    </div>
                                </div>
                            )}
                            {localDRP < 10 && (
                                <div style={{
                                    marginTop: '8px',
                                    padding: '6px',
                                    background: 'rgba(139, 69, 19, 0.1)',
                                    borderRadius: '3px',
                                    border: '1px solid rgba(160, 140, 112, 0.3)',
                                    fontSize: '9px',
                                    textAlign: 'center',
                                    color: '#a08c70'
                                }}>
                                    Need <strong>10+ DRP</strong> to activate passive benefits
                                </div>
                            )}
                        </div>
                    )}

                    {/* Exorcist Dominance Tooltip */}
                    {finalConfig.visual?.type === 'dominance-die' && exorcistHoverSection === 'dominance' && (
                        <div className="tooltip-rage-bar">
                            {(() => {
                                const currentDemon = boundDemons[selectedDemonIndex];
                                const currentDD = currentDemon?.dd ?? localDominanceDie ?? 0;
                                const isDemonBound = currentDemon && currentDD > 0;

                                const getDDState = (dd) => {
                                    switch(dd) {
                                        case 12: return { name: 'Full Control', color: '#FFD700' };
                                        case 10: return { name: 'Good Control', color: '#F4C430' };
                                        case 8: return { name: 'Moderate Risk', color: '#FF8C00' };
                                        case 6: return { name: 'High Risk', color: '#DC143C' };
                                        case 0: return { name: 'ESCAPED', color: '#8B0000' };
                                        default: return { name: 'Unknown', color: '#666' };
                                    }
                                };

                                const state = getDDState(currentDD);
                                const ddLabel = currentDD === 0 ? 'ESCAPED' : `d${currentDD}`;

                                // If no demon is bound, show binding instructions
                                if (!isDemonBound) {
                                    return (
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">No Demon Bound</div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Binding Ritual</div>
                                                    <ul>
                                                        <li>Requires <strong>ritual</strong> (10 min)</li>
                                                        <li>Target must be <strong>defeated</strong></li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Demon Slots</div>
                                                    <ul>
                                                        <li><strong>Base:</strong> 2 demons</li>
                                                        <li><strong>Demonologist:</strong> 4 demons</li>
                                                        <li><strong>Demon Lord:</strong> 1 demon</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">
                                                {currentDemon.name} (Tier {currentDemon.tier})
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: state.color,
                                                    fontWeight: 'bold',
                                                    marginLeft: '8px',
                                                    padding: '2px 6px',
                                                    background: `${state.color}22`,
                                                    borderRadius: '3px'
                                                }}>
                                                    {ddLabel}
                                                </span>
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">DD Progression</div>
                                                    <ul>
                                                        <li><strong>d12 → d10 → d8 → d6 → 0</strong></li>
                                                        <li>Decreases per action/hit</li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">At DD = 0</div>
                                                    <ul>
                                                        <li><strong>Save DC {currentDemon.saveDC}</strong></li>
                                                        <li>Fail: Demon escapes</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {currentDD <= 6 && currentDD > 0 && (
                                            <div className="rage-tooltip-warning" style={{
                                                background: currentDD === 6 ? 'rgba(220, 20, 60, 0.15)' : 'rgba(255, 140, 0, 0.15)',
                                                borderColor: currentDD === 6 ? '#DC143C' : '#FF8C00'
                                            }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                    {currentDD === 6 ? '⚠️ CRITICAL - Demon Near Escape!' : '⚠️ WARNING - Low Dominance'}
                                                </div>
                                                <div className="state-columns">
                                                    <div className="state-col">
                                                        <div className="col-title">Replenishment</div>
                                                        <ul>
                                                            <li><strong>Reassert Dominance:</strong> 5 mana</li>
                                                            <li><strong>Chain of Command:</strong> 4 mana</li>
                                                        </ul>
                                                    </div>
                                                    <div className="state-col">
                                                        <div className="col-title">Effects</div>
                                                        <ul>
                                                            <li>Restore to max DD</li>
                                                            <li>+1 DD for 3 actions</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {currentDD === 0 && (
                                            <div className="rage-tooltip-warning" style={{ background: 'rgba(139, 0, 0, 0.2)', borderColor: '#8B0000' }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#FF4444' }}>
                                                    💀 DEMON ESCAPED!
                                                </div>
                                                <div className="state-columns">
                                                    <div className="state-col">
                                                        <div className="col-title">Consequences</div>
                                                        <ul>
                                                            <li>Demon flees or attacks</li>
                                                            <li>Must re-bind (ritual)</li>
                                                        </ul>
                                                    </div>
                                                    <div className="state-col">
                                                        <div className="col-title">Behavior (d6)</div>
                                                        <ul>
                                                            <li><strong>1-2:</strong> Flees</li>
                                                            <li><strong>3-6:</strong> Attacks you</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* False Prophet Madness Tooltip */}
                    {finalConfig.visual?.type === 'madness-gauge' && falseProphetHoverSection === 'madness' && (
                        <div className="tooltip-rage-bar">
                            <div className="rage-tooltip-state">
                                <div className="state-name">Madness Points: {localMadness}/20</div>
                                <div className="state-columns">
                                    <div className="state-col">
                                        <div className="col-title">Current Effects</div>
                                        <ul>
                                            <li><strong>Shadow Damage:</strong> +{localMadness}</li>
                                            <li><strong>Danger Level:</strong> {getDangerLevel(localMadness).name}</li>
                                            <li><strong>Next Threshold:</strong> {getNextThreshold(localMadness)}</li>
                                        </ul>
                                    </div>
                                    <div className="state-col">
                                        <div className="col-title">Mechanics</div>
                                        <ul>
                                            <li>Spells generate Madness</li>
                                            <li>Some spells spend Madness</li>
                                            <li>At 10+: Next shadow spell +2d6</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Thresholds */}
                            <div className="rage-tooltip-warning" style={{
                                background: 'rgba(148, 0, 211, 0.15)',
                                borderColor: '#9400D3'
                            }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                    Madness Thresholds
                                </div>
                                <div className="state-columns">
                                    <div className="state-col">
                                        <div className="col-title">Unlocks</div>
                                        <ul>
                                            <li><strong>6:</strong> Veil of Shadows</li>
                                            <li><strong>9:</strong> Eldritch Vision</li>
                                            <li><strong>10:</strong> Empowerment (+2d6)</li>
                                            <li><strong>12:</strong> Apocalyptic Revelation</li>
                                        </ul>
                                    </div>
                                    <div className="state-col">
                                        <div className="col-title">Warnings</div>
                                        <ul>
                                            <li><strong>15:</strong> DANGER ZONE</li>
                                            <li><strong>20:</strong> INSANITY CONVULSION</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Convulsion Warning */}
                            {localMadness >= 15 && (
                                <div className="rage-tooltip-warning" style={{
                                    background: localMadness === 20 ? 'rgba(139, 0, 0, 0.2)' : 'rgba(220, 20, 60, 0.15)',
                                    borderColor: localMadness === 20 ? '#8B0000' : '#DC143C'
                                }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                        {localMadness === 20 ? '💀 INSANITY CONVULSION!' : '⚠️ HIGH CONVULSION RISK'}
                                    </div>
                                    {localMadness === 20 ? (
                                        <>
                                            <div style={{ marginBottom: '8px' }}>
                                                Roll 1d6 on Convulsion Table:
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <ul>
                                                        <li><strong>1:</strong> Shadow Burst (5d6 necrotic AoE)</li>
                                                        <li><strong>2:</strong> Mind Shatter (stunned 2 rounds)</li>
                                                        <li><strong>3:</strong> Dark Whispers (disadvantage 3 rounds)</li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <ul>
                                                        <li><strong>4:</strong> Chaotic Pulse (teleport + 4d6 psychic)</li>
                                                        <li><strong>5:</strong> Psychic Scream (AoE fear 3 rounds)</li>
                                                        <li><strong>6:</strong> Nightmare Echoes (6d6 + madness)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '8px', fontStyle: 'italic', fontSize: '0.9em' }}>
                                                After Convulsion: Madness resets to 0
                                            </div>
                                        </>
                                    ) : (
                                        <div className="state-columns">
                                            <div className="state-col">
                                                <div className="col-title">Risk</div>
                                                <ul>
                                                    <li>Approaching Convulsion</li>
                                                    <li>Consider spending Madness</li>
                                                </ul>
                                            </div>
                                            <div className="state-col">
                                                <div className="col-title">Options</div>
                                                <ul>
                                                    <li>Use Madness-spending spells</li>
                                                    <li>Avoid Madness-generating spells</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Fate Weaver Threads Tooltip */}
                    {finalConfig.visual?.type === 'threads-of-destiny' && fateWeaverHoverSection === 'threads' && (
                        <div className="tooltip-rage-bar">
                            <div className="rage-tooltip-state">
                                <div className="state-name">Threads of Destiny: {localThreads}/13</div>
                                <div className="state-columns">
                                    <div className="state-col">
                                        <div className="col-title">Thread Generation</div>
                                        <ul>
                                            <li><strong>Minor Failure:</strong> +1 Thread</li>
                                            <li><strong>Major Failure:</strong> +2 Threads</li>
                                            <li><strong>Spell Fails:</strong> +1-2 Threads</li>
                                        </ul>
                                    </div>
                                    <div className="state-col">
                                        <div className="col-title">Thread Spending</div>
                                        <ul>
                                            <li><strong>Call Card:</strong> 2 Threads</li>
                                            <li><strong>Force Fail:</strong> 3 Threads</li>
                                            <li><strong>Force Success:</strong> 5 Threads</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Thread Level Info */}
                            <div className="rage-tooltip-warning" style={{
                                background: 'rgba(255, 215, 0, 0.15)',
                                borderColor: '#FFD700'
                            }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                    Current Level: {getThreadLevel(localThreads).name}
                                </div>
                                <div className="state-columns">
                                    <div className="state-col">
                                        <div className="col-title">Thread Levels</div>
                                        <ul>
                                            <li><strong>0-3:</strong> Sparse Threads</li>
                                            <li><strong>4-6:</strong> Woven Strands</li>
                                            <li><strong>7-9:</strong> Tapestry of Fate</li>
                                            <li><strong>10-12:</strong> Destiny's Web</li>
                                            <li><strong>13:</strong> Fate Mastered (King)</li>
                                        </ul>
                                    </div>
                                    <div className="state-col">
                                        <div className="col-title">Strategy</div>
                                        <ul>
                                            <li>Failures generate Threads</li>
                                            <li>Spend to manipulate cards</li>
                                            <li>Force outcomes at high cost</li>
                                            <li>Balance risk vs. control</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Destiny Weaver Specialization Bonus */}
                            {localThreads >= 7 && (
                                <div className="rage-tooltip-warning" style={{
                                    background: 'rgba(147, 112, 219, 0.15)',
                                    borderColor: '#9370DB'
                                }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                        ✨ Destiny Weaver Bonus
                                    </div>
                                    <div className="state-columns">
                                        <div className="state-col">
                                            <div className="col-title">Enhanced Generation</div>
                                            <ul>
                                                <li>+1 Thread on all gains</li>
                                                <li>1 becomes 2, 2 becomes 3</li>
                                            </ul>
                                        </div>
                                        <div className="state-col">
                                            <div className="col-title">Special Options</div>
                                            <ul>
                                                <li><strong>5 Threads:</strong> Auto-succeed (max)</li>
                                                <li><strong>3 Threads:</strong> Auto-fail (max Threads)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Formbender Wild Instinct Tooltips */}
                    {finalConfig.visual?.type === 'wild-instinct-forms' && formbenderHoverSection && (
                        <div className="tooltip-rage-bar">
                            {formbenderHoverSection === 'wi' && (
                                <>
                                    <div className="rage-tooltip-state">
                                        <div className="state-name">Wild Instinct: {localWildInstinct}/15</div>
                                        <div className="state-columns">
                                            <div className="state-col">
                                                <div className="col-title">Generation</div>
                                                <ul>
                                                    <li><strong>Form Actions:</strong> +1-2 WI</li>
                                                    <li><strong>Stealth (Nightstalker):</strong> +1/round</li>
                                                    <li><strong>Taunt (Ironhide):</strong> +1/enemy</li>
                                                    <li><strong>Scout (Skyhunter):</strong> +1 WI</li>
                                                    <li><strong>Track (Frostfang):</strong> +1 WI</li>
                                                </ul>
                                            </div>
                                            <div className="state-col">
                                                <div className="col-title">Spending</div>
                                                <ul>
                                                    <li><strong>Transform:</strong> 1 WI</li>
                                                    <li><strong>Tier 1-2:</strong> 1-2 WI</li>
                                                    <li><strong>Tier 3-4:</strong> 3-4 WI</li>
                                                    <li><strong>Ultimate:</strong> 5 WI</li>
                                                    <li><strong>First transform:</strong> FREE</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rage-tooltip-warning" style={{
                                        background: 'rgba(76, 175, 80, 0.15)',
                                        borderColor: '#4CAF50'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                            Resource Banking
                                        </div>
                                        <div className="state-columns">
                                            <div className="state-col">
                                                <ul>
                                                    <li>WI persists between combats</li>
                                                    <li>No decay or time limit</li>
                                                </ul>
                                            </div>
                                            <div className="state-col">
                                                <ul>
                                                    <li>Save for crucial encounters</li>
                                                    <li>Strategic resource management</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {formbenderHoverSection === 'form' && (
                                <>
                                    <div className="rage-tooltip-state">
                                        <div className="state-name">
                                            {finalConfig.visual.forms[currentForm]?.name || 'Human'} Form
                                        </div>
                                        <div className="state-columns">
                                            <div className="state-col">
                                                <div className="col-title">Role</div>
                                                <ul>
                                                    <li>{finalConfig.visual.forms[currentForm]?.description || 'Not Transformed'}</li>
                                                </ul>
                                            </div>
                                            <div className="state-col">
                                                <div className="col-title">Generation</div>
                                                <ul>
                                                    <li>{finalConfig.visual.forms[currentForm]?.generation || 'None'}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rage-tooltip-warning" style={{
                                        background: `rgba(${parseInt(finalConfig.visual.forms[currentForm]?.color?.slice(1, 3) || '80', 16)}, ${parseInt(finalConfig.visual.forms[currentForm]?.color?.slice(3, 5) || '80', 16)}, ${parseInt(finalConfig.visual.forms[currentForm]?.color?.slice(5, 7) || '80', 16)}, 0.15)`,
                                        borderColor: finalConfig.visual.forms[currentForm]?.borderColor || '#808080'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                            Form Passive
                                        </div>
                                        <div>
                                            {finalConfig.visual.forms[currentForm]?.passive || 'No form bonuses'}
                                        </div>
                                    </div>

                                    {currentForm !== 'human' && (
                                        <div style={{
                                            fontStyle: 'italic',
                                            fontSize: '9px',
                                            marginTop: '8px',
                                            textAlign: 'center',
                                            color: '#AAA'
                                        }}>
                                            Click form icon to transform (1 WI)
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Gambler Fortune Points Tooltip */}
                    {finalConfig.visual?.type === 'fortune-points-gambling' && gamblerHoverSection === 'fp' && (() => {
                        const specs = finalConfig.visual?.specializations || {};
                        const currentSpec = specs[gamblerSpec] || specs['high-roller'];
                        const maxFP = currentSpec.max || 21;

                        return (
                            <div className="tooltip-rage-bar">
                                <div className="rage-tooltip-state">
                                    <div className="state-name">
                                        Fortune Points: {localFortunePoints}/{maxFP}
                                        <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>
                                            {currentSpec.name} - {currentSpec.approach}
                                        </div>
                                    </div>
                                    <div className="state-columns">
                                        <div className="state-col">
                                            <div className="col-title">Specialization Use</div>
                                            <ul>
                                                <li>{currentSpec.useCase}</li>
                                                <li style={{ marginTop: '4px', fontStyle: 'italic', fontSize: '9px' }}>
                                                    {currentSpec[`why${maxFP}`]}
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="state-col">
                                            <div className="col-title">Standard Use</div>
                                            <ul>
                                                <li><strong>Adjust Roll:</strong> ±1 per FP</li>
                                                <li><strong>No Limit:</strong> Spend any amount</li>
                                                <li><strong>Declare Before:</strong> Outcome revealed</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="rage-tooltip-warning" style={{
                                    background: 'rgba(76, 175, 80, 0.15)',
                                    borderColor: '#4CAF50'
                                }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                        Generation & Persistence
                                    </div>
                                    <div className="state-columns">
                                        <div className="state-col">
                                            <ul>
                                                <li>Successful Attack: +1 FP</li>
                                                <li>Successful Spell: +1 FP</li>
                                            </ul>
                                        </div>
                                        <div className="state-col">
                                            <ul>
                                                <li>Critical Hit: +2 FP</li>
                                                <li>Persists until long rest</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Huntress Quarry Marks & Companion Tooltip */}
                    {finalConfig.visual?.type === 'quarry-marks-companion' && huntressHoverSection && (
                        <div className="tooltip-rage-bar">
                            {huntressHoverSection === 'marks' && (() => {
                                const specName = huntressSpec === 'bladestorm' ? 'Bladestorm' : huntressSpec === 'beastmaster' ? 'Beastmaster' : 'Shadowdancer';
                                const specUltimate = huntressSpec === 'bladestorm' ? 'Glaive Storm (5 QM)' : huntressSpec === 'beastmaster' ? 'Primal Fury (5 QM)' : 'Shadow Assault (5 QM)';

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">
                                                Quarry Marks: {localQuarryMarks}/5
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: huntressSpec === 'bladestorm' ? '#DC143C' : huntressSpec === 'beastmaster' ? '#2E7D32' : '#6A1B9A',
                                                    fontWeight: 'bold',
                                                    marginLeft: '8px',
                                                    padding: '2px 6px',
                                                    background: huntressSpec === 'bladestorm' ? 'rgba(220, 20, 60, 0.2)' : huntressSpec === 'beastmaster' ? 'rgba(46, 125, 50, 0.2)' : 'rgba(106, 27, 154, 0.2)',
                                                    borderRadius: '3px'
                                                }}>
                                                    {specName}
                                                </span>
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Generation</div>
                                                    <ul>
                                                        <li><strong>Glaive Hit:</strong> +1 QM</li>
                                                        <li><strong>Companion Hit:</strong> +1 QM</li>
                                                        <li><strong>Critical Hit:</strong> +2 QM</li>
                                                        <li><strong>Companion Crit:</strong> +2 QM</li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Spending</div>
                                                    <ul>
                                                        <li><strong>1 QM:</strong> Enhance Companion</li>
                                                        <li><strong>2 QM:</strong> Extend Chain +1</li>
                                                        <li><strong>3 QM:</strong> Companion Special</li>
                                                        <li><strong>5 QM:</strong> {specUltimate}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                    <div className="rage-tooltip-warning" style={{
                                        background: 'rgba(220, 20, 60, 0.15)',
                                        borderColor: '#DC143C'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                            Resource Banking
                                        </div>
                                        <div className="state-columns">
                                            <div className="state-col">
                                                <ul>
                                                    <li>Marks persist between combats</li>
                                                    <li>No decay or time limit</li>
                                                </ul>
                                            </div>
                                            <div className="state-col">
                                                <ul>
                                                    <li>Save for burst damage windows</li>
                                                    <li>Strategic resource management</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                        {localQuarryMarks === 5 && (
                                            <div className="rage-tooltip-warning" style={{
                                                background: 'rgba(139, 69, 19, 0.2)',
                                                borderColor: '#8B4513'
                                            }}>
                                                <div style={{ fontWeight: 'bold', color: '#D2691E' }}>ULTIMATE READY!</div>
                                                <div style={{ fontSize: '9px', marginTop: '4px' }}>
                                                    {specUltimate} - Spend all 5 marks
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            {huntressHoverSection === 'spec' && (() => {
                                const companionType = huntressSpec === 'bladestorm' ? 'War Owl' : huntressSpec === 'beastmaster' ? 'Dire Wolf' : 'Shadow Panther';
                                const companionSpecial = huntressSpec === 'bladestorm' ? 'Aerial Strike (3 QM)' : huntressSpec === 'beastmaster' ? 'Pack Tactics (3 QM)' : 'Stealth Pounce (3 QM)';
                                const specColor = huntressSpec === 'bladestorm' ? '#DC143C' : huntressSpec === 'beastmaster' ? '#2E7D32' : '#6A1B9A';
                                const specBg = huntressSpec === 'bladestorm' ? 'rgba(220, 20, 60, 0.15)' : huntressSpec === 'beastmaster' ? 'rgba(46, 125, 50, 0.15)' : 'rgba(106, 27, 154, 0.15)';
                                const specName = huntressSpec === 'bladestorm' ? 'Bladestorm' : huntressSpec === 'beastmaster' ? 'Beastmaster' : 'Shadowdancer';
                                const specUltimate = huntressSpec === 'bladestorm' ? 'Glaive Storm' : huntressSpec === 'beastmaster' ? 'Primal Fury' : 'Shadow Assault';

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">
                                                {specName} Specialization
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: specColor,
                                                    fontWeight: 'bold',
                                                    marginLeft: '8px',
                                                    padding: '2px 6px',
                                                    background: specBg,
                                                    borderRadius: '3px'
                                                }}>
                                                    {companionType}
                                                </span>
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Companion ({companionHP}/{companionMaxHP} HP)</div>
                                                    <ul>
                                                        <li><strong>Attack:</strong> 1d8 + proficiency</li>
                                                        <li><strong>Defend:</strong> +2 Armor to ally</li>
                                                        <li><strong>Support:</strong> Tactical buff</li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Enhancements</div>
                                                    <ul>
                                                        <li><strong>1 QM:</strong> +1d6 damage</li>
                                                        <li><strong>3 QM:</strong> {companionSpecial}</li>
                                                        <li><strong>5 QM:</strong> {specUltimate}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rage-tooltip-warning" style={{
                                            background: specBg,
                                            borderColor: specColor
                                        }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                Specialization Bonuses
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <ul>
                                                        {huntressSpec === 'bladestorm' && (
                                                            <>
                                                                <li>Glaive chains to nearby enemies</li>
                                                                <li>+1 chain per 2 QM spent</li>
                                                            </>
                                                        )}
                                                        {huntressSpec === 'beastmaster' && (
                                                            <>
                                                                <li>Companion has +50% HP</li>
                                                                <li>Companion attacks twice per command</li>
                                                            </>
                                                        )}
                                                        {huntressSpec === 'shadowdancer' && (
                                                            <>
                                                                <li>+2d6 damage from stealth</li>
                                                                <li>Companion can stealth</li>
                                                            </>
                                                        )}
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <ul>
                                                        <li>Companion generates QM on hit</li>
                                                        <li>Telepathic bond (100ft)</li>
                                                        <li>Shares your initiative</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Inscriptor Runes & Inscriptions Tooltip */}
                    {finalConfig.visual?.type === 'runes-inscriptions' && inscriptorHoverSection && (
                        <div className="tooltip-rage-bar">
                            {inscriptorHoverSection === 'runes' && (() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[inscriptorSpec] || specs.base;
                                const specName = currentSpec.name;
                                const specColor = currentSpec.color;
                                const maxRunes = currentSpec.maxRunes;

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">
                                                Runes: {localRunes}/{maxRunes}
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: specColor,
                                                    fontWeight: 'bold',
                                                    marginLeft: '8px',
                                                    padding: '2px 6px',
                                                    background: `${specColor}33`,
                                                    borderRadius: '3px'
                                                }}>
                                                    {specName}
                                                </span>
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Generation</div>
                                                    <ul>
                                                        <li><strong>3 mana</strong> per rune</li>
                                                        <li><strong>1 action</strong> to place</li>
                                                        <li>Lasts <strong>1 minute</strong></li>
                                                        {inscriptorSpec === 'runebinder' && <li><strong>-2 mana</strong> cost (min 2)</li>}
                                                        {inscriptorSpec === 'glyphweaver' && <li>Auto-detonate after <strong>30 sec</strong></li>}
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Usage</div>
                                                    <ul>
                                                        <li><strong>3+ runes</strong> form zone</li>
                                                        <li>Detonate for effects</li>
                                                        <li>Zone effects vary by type</li>
                                                        {inscriptorSpec === 'runebinder' && <li>Move rune: <strong>1 AP</strong> (30ft)</li>}
                                                        {inscriptorSpec === 'glyphweaver' && <li>Chain detonate all runes</li>}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {localRunes >= 3 && (
                                            <div className="rage-tooltip-warning" style={{
                                                background: 'rgba(65, 105, 225, 0.15)',
                                                borderColor: '#4169E1'
                                            }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                    Zone Active
                                                </div>
                                                <div className="state-columns">
                                                    <div className="state-col">
                                                        <ul>
                                                            <li>Minimum 3 runes placed</li>
                                                            <li>Zone effects now active</li>
                                                            {inscriptorSpec === 'runebinder' && <li>Zones overlap & combine</li>}
                                                        </ul>
                                                    </div>
                                                    <div className="state-col">
                                                        <ul>
                                                            <li>Amplify spells in zone</li>
                                                            <li>Control battlefield positioning</li>
                                                            {inscriptorSpec === 'runebinder' && <li>7.5ft radius (50% larger)</li>}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {inscriptorSpec === 'glyphweaver' && (
                                            <div className="rage-tooltip-warning" style={{
                                                background: 'rgba(220, 20, 60, 0.15)',
                                                borderColor: '#DC143C'
                                            }}>
                                                <div style={{ fontWeight: 'bold', color: '#DC143C' }}>VOLATILE RUNES</div>
                                                <div style={{ fontSize: '9px', marginTop: '4px' }}>
                                                    Auto-detonate after 30 seconds | +3d8 bonus damage | Friendly fire (half damage)
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            {inscriptorHoverSection === 'inscriptions' && (() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[inscriptorSpec] || specs.base;
                                const specName = currentSpec.name;
                                const specColor = currentSpec.color;
                                const maxInscriptions = currentSpec.maxInscriptions;

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">
                                                Inscriptions: {localInscriptions}/{maxInscriptions}
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: specColor,
                                                    fontWeight: 'bold',
                                                    marginLeft: '8px',
                                                    padding: '2px 6px',
                                                    background: `${specColor}33`,
                                                    borderRadius: '3px'
                                                }}>
                                                    {specName}
                                                </span>
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Generation</div>
                                                    <ul>
                                                        <li>At <strong>combat start</strong></li>
                                                        <li>Choose equipment slots</li>
                                                        <li>Lasts entire combat</li>
                                                        {inscriptorSpec === 'enchanter' && <li>Lasts <strong>adventuring day</strong></li>}
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Usage</div>
                                                    <ul>
                                                        <li>Enhance equipment</li>
                                                        <li>Cannot stack same slot</li>
                                                        <li>6 slots available</li>
                                                        {inscriptorSpec === 'enchanter' && <li><strong>Double</strong> effectiveness</li>}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rage-tooltip-warning" style={{
                                            background: 'rgba(255, 215, 0, 0.15)',
                                            borderColor: '#FFD700'
                                        }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                Equipment Slots
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <ul>
                                                        <li><strong>Weapon:</strong> +damage/effects</li>
                                                        <li><strong>Armor:</strong> +Armor/resistance</li>
                                                        <li><strong>Boots:</strong> +movement/flight</li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <ul>
                                                        <li><strong>Cape:</strong> +utility/teleport</li>
                                                        <li><strong>Belt:</strong> +stats/regen</li>
                                                        <li><strong>Pants:</strong> +resistance</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {inscriptorSpec === 'enchanter' && (
                                            <div className="rage-tooltip-warning" style={{
                                                background: 'rgba(255, 215, 0, 0.2)',
                                                borderColor: '#FFD700'
                                            }}>
                                                <div style={{ fontWeight: 'bold', color: '#FFD700' }}>MASTER ENCHANTER</div>
                                                <div style={{ fontSize: '9px', marginTop: '4px' }}>
                                                    All 6 slots available | Double bonuses | Can inscribe allies (1 item each)
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Lichborne Eternal Frost & Phylactery Tooltip */}
                    {finalConfig.visual?.type === 'eternal-frost-phylactery' && lichborneHoverSection && (
                        <div className="tooltip-rage-bar">
                            {lichborneHoverSection === 'phylactery' && (() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[lichborneSpec] || specs.frostbound_tyrant;
                                const maxPhylactery = currentSpec.maxPhylactery;
                                const specName = currentSpec.name;

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">Phylactery HP: {localPhylacteryHP}/{maxPhylactery}</div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Storage</div>
                                                    <ul>
                                                        <li><strong>Ritual:</strong> Transfer 10 HP (1 hour)</li>
                                                        <li><strong>Max:</strong> {maxPhylactery} HP</li>
                                                        <li><strong>Recharge:</strong> 10 HP per rest</li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Resurrection</div>
                                                    <ul>
                                                        <li><strong>Cost:</strong> {lichborneSpec === 'phylactery_guardian' ? '8 HP' : '10 HP'}</li>
                                                        <li><strong>Revive at:</strong> {lichborneSpec === 'phylactery_guardian' ? '15 HP' : '10 HP'}</li>
                                                        <li><strong>Limit:</strong> Once per combat</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rage-tooltip-warning" style={{
                                            background: 'rgba(74, 144, 226, 0.15)',
                                            borderColor: '#4A90E2'
                                        }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                Specialization: {specName}
                                            </div>
                                            <div style={{ fontSize: '9px' }}>
                                                {lichborneSpec === 'frostbound_tyrant' && 'Freeze effects last +1d4 rounds. Frozen enemies take +1d6 damage.'}
                                                {lichborneSpec === 'spectral_reaper' && 'Frost spells deal +1d6 necrotic damage. Enemies killed have 1/6 chance to rise as spectral minions (1d4 rounds).'}
                                                {lichborneSpec === 'phylactery_guardian' && 'Phylactery stores 75 HP. Resurrection costs 8 HP, revives at 15 HP.'}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}

                            {lichborneHoverSection === 'aura' && (
                                <>
                                    <div className="rage-tooltip-state">
                                        <div className="state-name">Eternal Frost Aura: {eternalFrostActive ? 'ACTIVE' : 'INACTIVE'}</div>
                                        <div className="state-columns">
                                            <div className="state-col">
                                                <div className="col-title">When Active</div>
                                                <ul>
                                                    <li><strong>Frost Damage:</strong> +1d6</li>
                                                    <li><strong>Chilling DC:</strong> 17</li>
                                                    <li><strong>Effect:</strong> -10 ft movement</li>
                                                </ul>
                                            </div>
                                            <div className="state-col">
                                                <div className="col-title">Cost</div>
                                                <ul>
                                                    <li><strong>HP Drain:</strong> 1d6 per turn</li>
                                                    <li><strong>Toggle:</strong> Free action</li>
                                                    <li><strong>Duration:</strong> Until deactivated</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {eternalFrostActive && (
                                        <div className="rage-tooltip-warning" style={{
                                            background: 'rgba(0, 255, 255, 0.15)',
                                            borderColor: '#00FFFF'
                                        }}>
                                            <div style={{ fontWeight: 'bold', color: '#00FFFF' }}>AURA ACTIVE</div>
                                            <div style={{ fontSize: '9px', marginTop: '4px' }}>
                                                All frost spells enhanced | Draining 1d6 HP per turn
                                            </div>
                                        </div>
                                    )}

                                    <div className="rage-tooltip-warning" style={{
                                        background: 'rgba(74, 144, 226, 0.15)',
                                        borderColor: '#4A90E2'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                            Shared Passive: Undying Frost
                                        </div>
                                        <div style={{ fontSize: '9px' }}>
                                            Chilling DC +2 (DC 17) | Immune to frost damage
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Lunarch Lunar Phases Tooltip */}
                    {finalConfig.visual?.type === 'lunar-phases' && lunarchHoverSection && (
                        <div className="tooltip-rage-bar">
                            {lunarchHoverSection === 'phase' && (() => {
                                const phases = finalConfig.visual;
                                const currentPhaseConfig = phases[currentLunarPhase];
                                const phaseOrder = ['new_moon', 'waxing_moon', 'full_moon', 'waning_moon'];

                                const getPhaseBonuses = (phase) => {
                                    switch (phase) {
                                        case 'new_moon':
                                            return { bonus: '+2 Armor', penalty: 'Damage -1d6', theme: 'Defense' };
                                        case 'waxing_moon':
                                            return { bonus: 'Healing +1d4', penalty: 'None', theme: 'Healing' };
                                        case 'full_moon':
                                            return { bonus: 'Damage +2d6', penalty: 'Armor -1', theme: 'Offense' };
                                        case 'waning_moon':
                                            return { bonus: 'Mana -2 cost', penalty: 'Healing -1d4', theme: 'Efficiency' };
                                        default:
                                            return { bonus: '', penalty: '', theme: '' };
                                    }
                                };

                                const currentBonuses = getPhaseBonuses(currentLunarPhase);

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">
                                                {currentPhaseConfig.name}
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: currentPhaseConfig.glow,
                                                    fontWeight: 'bold',
                                                    marginLeft: '8px',
                                                    padding: '2px 6px',
                                                    background: `${currentPhaseConfig.glow}33`,
                                                    borderRadius: '3px'
                                                }}>
                                                    {currentBonuses.theme}
                                                </span>
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Phase Bonus</div>
                                                    <ul>
                                                        <li><strong>{currentBonuses.bonus}</strong></li>
                                                        <li>Duration: <strong>3 rounds</strong></li>
                                                        <li>Auto-cycles naturally</li>
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Manual Shift</div>
                                                    <ul>
                                                        <li>Cost: <strong>8 mana</strong></li>
                                                        <li>Instant phase change</li>
                                                        <li>Resets 3-round timer</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rage-tooltip-warning" style={{
                                            background: `${currentPhaseConfig.glow}22`,
                                            borderColor: currentPhaseConfig.glow
                                        }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                All Phases
                                            </div>
                                            <div className="state-columns">
                                                {phaseOrder.map((phase) => {
                                                    const phaseConfig = phases[phase];
                                                    const bonuses = getPhaseBonuses(phase);
                                                    return (
                                                        <div key={phase} className="state-col" style={{ fontSize: '8px' }}>
                                                            <div className="col-title" style={{ color: phaseConfig.glow }}>
                                                                {phaseConfig.name}
                                                            </div>
                                                            <div>{bonuses.bonus}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="rage-tooltip-warning" style={{
                                            background: 'rgba(230, 230, 250, 0.15)',
                                            borderColor: '#E6E6FA'
                                        }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                Shared Passive: Lunar Empowerment
                                            </div>
                                            <div style={{ fontSize: '9px' }}>
                                                Darkvision 60 ft | Advantage vs charm/fear in Full Moon
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}

                            {lunarchHoverSection === 'timer' && (
                                <>
                                    <div className="rage-tooltip-state">
                                        <div className="state-name">Phase Timer: Round {roundsInPhase + 1}/3</div>
                                        <div className="state-columns">
                                            <div className="state-col">
                                                <div className="col-title">Natural Cycling</div>
                                                <ul>
                                                    <li>Each phase: <strong>3 rounds</strong></li>
                                                    <li>Auto-advances after round 3</li>
                                                    <li>Order: New → Waxing → Full → Waning</li>
                                                </ul>
                                            </div>
                                            <div className="state-col">
                                                <div className="col-title">Current Phase</div>
                                                <ul>
                                                    <li>Rounds elapsed: <strong>{roundsInPhase}</strong></li>
                                                    <li>Rounds remaining: <strong>{3 - roundsInPhase}</strong></li>
                                                    <li>Next phase in: <strong>{3 - roundsInPhase} rounds</strong></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rage-tooltip-warning" style={{
                                        background: 'rgba(230, 230, 250, 0.15)',
                                        borderColor: '#E6E6FA'
                                    }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                            Specialization Passive
                                        </div>
                                        <div style={{ fontSize: '9px' }}>
                                            {lunarchSpec === 'moonlight_sentinel' && 'Critical hits during Full Moon deal +2d6 radiant damage.'}
                                            {lunarchSpec === 'starfall_invoker' && 'AoE spells during Full Moon affect +5 ft radius.'}
                                            {lunarchSpec === 'lunar_guardian' && 'Healing during Waxing Moon grants +1d6 temporary HP.'}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Minstrel Musical Notes Tooltip */}
                    {finalConfig.visual?.type === 'musical-notes-combo' && minstrelHoverSection && minstrelHoverSection.startsWith('note-') && (() => {
                        console.log('Rendering Minstrel tooltip for:', minstrelHoverSection);
                        const noteIndex = parseInt(minstrelHoverSection.split('-')[1]);
                        const note = finalConfig.visual?.notes?.[noteIndex];

                        // Safety check: only render if note exists
                        if (!note) {
                            console.error('Note not found for index:', noteIndex);
                            return null;
                        }

                        // Helper function to get high-contrast color for tooltip text
                        const getHighContrastColor = (glowColor) => {
                            // Map of light colors to darker, more readable versions
                            const colorMap = {
                                '#FFED4E': '#D4A017', // Yellow -> Dark gold
                                '#FFA500': '#CC6600', // Orange -> Dark orange
                                '#90EE90': '#2E8B57', // Light green -> Sea green
                                '#FF6B6B': '#DC143C', // Light red -> Crimson
                                '#6495ED': '#4169E1', // Light blue -> Royal blue
                                '#BA55D3': '#8B008B', // Light purple -> Dark magenta
                                '#DA70D6': '#9400D3'  // Light orchid -> Dark violet
                            };
                            return colorMap[glowColor] || glowColor;
                        };

                        const headerColor = getHighContrastColor(note.glow);

                        return (
                        <div className="tooltip-rage-bar">
                            {(() => {
                                const count = localNotes[noteIndex] || 0;
                                const maxPerNote = finalConfig.mechanics?.maxPerNote || 5;
                                const currentSpec = finalConfig.visual?.specializations?.find(s => s.id === minstrelSpec);

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name" style={{ color: headerColor }}>
                                                {note.numeral} - {note.name}
                                                <span style={{
                                                    fontSize: '10px',
                                                    color: '#f8f4e6',
                                                    fontWeight: 'bold',
                                                    marginLeft: '8px',
                                                    padding: '2px 6px',
                                                    background: note.color,
                                                    borderRadius: '3px'
                                                }}>
                                                    {count}/{maxPerNote}
                                                </span>
                                            </div>
                                            <div style={{
                                                fontSize: '9px',
                                                fontStyle: 'italic',
                                                color: '#5a1e12',
                                                marginTop: '4px',
                                                marginBottom: '8px'
                                            }}>
                                                {note.function}: {note.description}
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Generated By</div>
                                                    <div style={{ fontSize: '9px', marginTop: '4px', color: '#5a1e12' }}>
                                                        {note.generatedBy}
                                                    </div>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Used In</div>
                                                    <ul style={{ color: '#5a1e12' }}>
                                                        {note.usedIn?.slice(0, 3).map((cadence, i) => (
                                                            <li key={i}>{cadence}</li>
                                                        ))}
                                                        {note.usedIn?.length > 3 && <li>+{note.usedIn.length - 3} more...</li>}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{
                                            fontStyle: 'italic',
                                            fontSize: '9px',
                                            textAlign: 'center',
                                            color: '#5a1e12',
                                            marginTop: '6px',
                                            padding: '4px',
                                            background: `${note.color}15`,
                                            borderRadius: '3px'
                                        }}>
                                            🎵 Notes persist between combats | Decay: 1 per minute
                                        </div>

                                        {finalConfig.sharedPassive?.description && (
                                            <div className="rage-tooltip-warning" style={{
                                                background: 'rgba(74, 144, 226, 0.15)',
                                                borderColor: '#4A90E2',
                                                color: '#2E5C8A'
                                            }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#2E5C8A' }}>
                                                    Shared Passive: {finalConfig.sharedPassive.name || 'Harmonic Resonance'}
                                                </div>
                                                <div style={{ fontSize: '9px', color: '#5a1e12' }}>
                                                    {finalConfig.sharedPassive.description}
                                                </div>
                                            </div>
                                        )}

                                        {currentSpec && finalConfig.specPassives?.[minstrelSpec]?.description && (
                                            <div className="rage-tooltip-warning" style={{
                                                background: `${currentSpec.color}15`,
                                                borderColor: getHighContrastColor(currentSpec.glow),
                                                color: getHighContrastColor(currentSpec.glow)
                                            }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: getHighContrastColor(currentSpec.glow) }}>
                                                    {currentSpec.name} Passive
                                                </div>
                                                <div style={{ fontSize: '9px', color: '#5a1e12' }}>
                                                    {finalConfig.specPassives[minstrelSpec].description}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                        );
                    })()}

                    {/* Oracle Prophetic Visions Tooltip */}
                    {finalConfig.visual?.type === 'prophetic-visions' && oracleHoverSection && (
                        <div className="tooltip-rage-bar">
                            {oracleHoverSection === 'visions' && (() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[oracleSpec] || specs.seer;
                                const specName = currentSpec.name;
                                const specColor = currentSpec.activeColor;
                                const maxVisions = specs.max || 10;
                                const visionsValue = localVisions;

                                return (
                                    <>
                                        <div className="rage-tooltip-state">
                                            <div className="state-name">
                                                {specName}
                                            </div>
                                            <div className="state-columns">
                                                <div className="state-col">
                                                    <div className="col-title">Gain Visions</div>
                                                    <ul>
                                                        <li>Simple Prediction: +1</li>
                                                        <li>Moderate Prediction: +2</li>
                                                        <li>Complex Prediction: +3</li>
                                                        {oracleSpec === 'seer' && <li style={{ color: specColor }}>Seer: +1 per prediction</li>}
                                                    </ul>
                                                </div>
                                                <div className="state-col">
                                                    <div className="col-title">Spend Visions</div>
                                                    <ul>
                                                        <li>Alter Fate (Minor): 1</li>
                                                        <li>Alter Fate (Moderate): 2</li>
                                                        <li>Alter Fate (Major): 3</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Specialization Passive */}
                                        <div className="rage-tooltip-warning" style={{
                                            background: `${specColor}22`,
                                            borderColor: specColor
                                        }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                {specName} Passive
                                            </div>
                                            <div style={{ fontSize: '9px' }}>
                                                {oracleSpec === 'seer' && 'Gain +1 Vision per correct prediction. Predictions are free actions. Advantage on initiative.'}
                                                {oracleSpec === 'truthseeker' && 'Detect lies and illusions. Uncover hidden knowledge for +1 Vision each.'}
                                                {oracleSpec === 'fateweaver' && 'Once per round: spend 1 Vision to force reroll within 60ft. You choose which result.'}
                                            </div>
                                        </div>
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
    // Rage, Bladedancer, Chronarch, Chaos Weaver, Deathcaller, Dreadnaught, Exorcist, False Prophet, Fate Weaver, Gambler, Huntress, Inscriptor, Lichborne, Lunarch, Martyr, Minstrel, Oracle, Plaguebearer, Primalist, Pyrofiend, Spellguard, Titan, Warden, and Witch Doctor handle their own tooltips internally
    const isArcanoneer = finalConfig.visual.type === 'elemental-spheres';
    const isBladedancer = finalConfig.type === 'dual-resource';
    const isBerserker = finalConfig.type === 'rage';
    const isChaosWeaver = finalConfig.visual?.type === 'mayhem-modifiers';
    const isChronarch = finalConfig.visual?.type === 'time-shards-strain';
    const isDeathcaller = finalConfig.visual?.type === 'ascension-blood';
    const isDreadnaught = finalConfig.visual?.type === 'drp-resilience';
    const isExorcist = finalConfig.visual?.type === 'dominance-die';
    const isFalseProphet = finalConfig.visual?.type === 'madness-gauge';
    const isFateWeaver = finalConfig.visual?.type === 'threads-of-destiny';
    const isGambler = finalConfig.visual?.type === 'fortune-points-gambling';
    const isHuntress = finalConfig.visual?.type === 'quarry-marks-companion';
    const isInscriptor = finalConfig.visual?.type === 'runes-inscriptions';
    const isLichborne = finalConfig.visual?.type === 'eternal-frost-phylactery';
    const isLunarch = finalConfig.visual?.type === 'lunar-phases';
    const isMartyr = finalConfig.visual?.type === 'devotion-gauge';
    const isMinstrel = finalConfig.visual?.type === 'musical-notes-combo';
    const isOracle = finalConfig.visual?.type === 'prophetic-visions';
    const isPlaguebearer = finalConfig.visual?.type === 'corruption-bar';
    const isPrimalist = finalConfig.visual?.type === 'totemic-synergy';
    const isPyrofiend = finalConfig.visual?.type === 'inferno-veil';
    const isSpellguard = finalConfig.visual?.type === 'arcane-absorption';
    const isWarden = finalConfig.visual?.type === 'vengeance-points';
    const isWitchDoctor = finalConfig.visual?.type === 'voodoo-essence';

    const isTitan = finalConfig.visual?.type === 'celestial-devotion';

    return (
        <>
            <div
                className={`class-resource-wrapper ${isGMMode ? 'clickable' : ''}`}
                onMouseEnter={!isArcanoneer && !isBerserker && !isBladedancer && !isChaosWeaver && !isChronarch && !isDeathcaller && !isDreadnaught && !isExorcist && !isFalseProphet && !isFateWeaver && !isGambler && !isHuntress && !isInscriptor && !isLichborne && !isLunarch && !isMartyr && !isMinstrel && !isOracle && !isPlaguebearer && !isPrimalist && !isPyrofiend && !isSpellguard && !isTitan && !isWarden && !isWitchDoctor ? handleMouseEnter : undefined}
                onMouseLeave={!isArcanoneer && !isBerserker && !isBladedancer && !isChaosWeaver && !isChronarch && !isDeathcaller && !isDreadnaught && !isExorcist && !isFalseProphet && !isFateWeaver && !isGambler && !isHuntress && !isInscriptor && !isLichborne && !isLunarch && !isMartyr && !isMinstrel && !isOracle && !isPlaguebearer && !isPrimalist && !isPyrofiend && !isSpellguard && !isTitan && !isWarden && !isWitchDoctor ? handleMouseLeave : undefined}
                onMouseMove={!isArcanoneer && !isBerserker && !isBladedancer && !isChaosWeaver && !isChronarch && !isDeathcaller && !isDreadnaught && !isExorcist && !isFalseProphet && !isFateWeaver && !isGambler && !isHuntress && !isInscriptor && !isLichborne && !isLunarch && !isMartyr && !isMinstrel && !isOracle && !isPlaguebearer && !isPrimalist && !isWarden && !isWitchDoctor ? handleMouseMove : undefined}
                onClick={handleClick}
                style={{ cursor: isGMMode ? 'pointer' : 'default' }}
            >
                {renderResourceDisplay()}
                {!isArcanoneer && !isMartyr && renderTooltip()}
            </div>

            {/* Demon Config Modal for Exorcist */}
            {finalConfig.visual?.type === 'dominance-die' && (
                <DemonConfigModal
                    show={showDemonConfigModal}
                    onClose={() => setShowDemonConfigModal(false)}
                    onSave={handleDemonConfigSave}
                    mode={demonConfigMode}
                    initialData={demonConfigInitialData}
                />
            )}
        </>
    );
};

export default ClassResourceBar;
