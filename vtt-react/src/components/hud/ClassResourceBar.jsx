import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { getClassResourceConfig } from '../../data/classResources';
import useChatStore from '../../store/chatStore';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import ResourceCanvasBar from './canvas/ResourceCanvasBar';
import PlaguebringerResourceBar from '../../data/classes/plaguebringer/components/PlaguebringerResourceBar';
import PyrofiendResourceBar from '../../data/classes/pyrofiend/components/PyrofiendResourceBar';
import SpellguardResourceBar from '../../data/classes/spellguard/components/SpellguardResourceBar';
import ToxicologistResourceBar from '../../data/classes/toxicologist/components/ToxicologistResourceBar';
import GaolerResourceBar from '../../data/classes/warden/components/GaolerResourceBar';
import AugurResourceBar from '../../data/classes/augur/components/AugurResourceBar';
import StanceFlowResourceBar from './StanceFlowResourceBar';
import AscensionBloodResourceBar from './AscensionBloodResourceBar';
import TimeShardsStrainResourceBar from './TimeShardsStrainResourceBar';
import MayhemModifiersResourceBar from './MayhemModifiersResourceBar';
import PropheticVisionsResourceBar from './PropheticVisionsResourceBar';
import DominanceDieResourceBar from './DominanceDieResourceBar';
import QuarryMarksResourceBar from './QuarryMarksResourceBar';
import DevotionGaugeResourceBar from './DevotionGaugeResourceBar';
import FortunePointsResourceBar from './FortunePointsResourceBar';
import DRPResilienceResourceBar from './DRPResilienceResourceBar';
import LunarPhasesResourceBar from './LunarPhasesResourceBar';
import HexbreakerChargesResourceBar from './HexbreakerChargesResourceBar';
import RageBarResourceBar from './RageBarResourceBar';
import ThreadsOfDestinyResourceBar from './ThreadsOfDestinyResourceBar';
import MadnessGaugeResourceBar from './MadnessGaugeResourceBar';
import EternalFrostPhylacteryResourceBar from './EternalFrostPhylacteryResourceBar';
import AncestralResonanceResourceBar from './AncestralResonanceResourceBar';
import ResourceTooltip from './ResourceTooltip';
import ArcanoneerResourceBar from '../../data/classes/arcanoneer/components/ArcanoneerResourceBar';
// Arcanoneer combination matrix: passed through to ArcanoneerResourceBar so it can
// render live "ready formulation" chips without a separate import in the component.
import { ARCANONEER_DATA } from '../../data/classes/arcanoneerData';
import MinstrelResourceBar from '../../data/classes/minstrel/components/MinstrelResourceBar';
// Minstrel cadence matrix: same pattern: passed through to MinstrelResourceBar
// so it can render live "ready cadence" chips with hover-spellcards without a
// separate import (and without creating a circular dep with minstrelData.js).
import { MINSTREL_DATA } from '../../data/classes/minstrelData';
import { getResourceStatusFlavor } from '../../utils/resourceStatusFlavor';

const ARCANONEER_COMBINATION_MATRIX = ARCANONEER_DATA?.combinationMatrix || null;
const MINSTREL_CADENCE_MATRIX = MINSTREL_DATA?.resourceSystem?.cadenceMatrix || MINSTREL_DATA?.cadenceMatrix || null;

const ClassResourceBar = ({
    characterClass,
    classResource,
    character = null,
    isGMMode = false,
    isOwner = false, // CRITICAL FIX: Default to false for security - must explicitly pass true
    onResourceClick = null,
    onClassResourceUpdate = null, // Callback to update class resource in store
    size = 'normal', // 'small', 'normal', 'large'
    context = 'hud', // 'hud' or 'account' - controls whether to show interactive elements
    showcase = false // Rules-page showcase mode: collapses verbose sections (formulations, etc.)
}) => {
    // Consolidated state for better performance
    const [uiState, setUiState] = useState({
        showTooltip: false,
        tooltipPosition: { x: 0, y: 0 },
        tooltipPlacement: 'above', // 'above' | 'below'
        showRageMenu: false,
        rageInputValue: '',
        showModifierMenu: false,
        chaosWeaverHoverSection: null, // 'modifiers' | null
        activeSpecialization: 'prism-mage', // 'prism-mage', 'entropy-weaver', 'sphere-architect'
        rerollsUsed: 0,
        swapMode: false,
        selectedForSwap: []
    });

    // Destructure uiState for easier access
    const {
        showTooltip,
        rageInputValue,
        showModifierMenu,
        chaosWeaverHoverSection,
        activeSpecialization
    } = uiState;

    // Helper functions for updating uiState
    const setShowTooltip = (value) => {
        if (value === false && isMouseOverWrapperRef.current) return;
        setUiState(prev => ({ ...prev, showTooltip: value }));
    };
    const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
                const setShowModifierMenu = (value) => setUiState(prev => ({ ...prev, showModifierMenu: value }));
    const setChaosWeaverHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setUiState(prev => ({ ...prev, chaosWeaverHoverSection: value }));
    };
                
    // Arcanoneer state
    const [arcanoneerState] = useState({
        localSpheres: [],
        isRolling: false,
        showControls: false,
        diceButtonMode: 'roll',
        showRollTooltip: false,
        hoveredElement: null,
    });

    // Chaos Weaver state
    const [chaosWeaverState, setChaosWeaverState] = useState({
        localModifiers: 0 // Chaos Weaver Mayhem Modifiers
    });

    const rageBarRef = useRef(null);
    const mayhemBarRef = useRef(null);
    const tooltipRef = useRef(null);
    const tooltipTimeoutRef = useRef(null);
    const resourceBarWrapperRef = useRef(null);
    const isMouseOverWrapperRef = useRef(false);

    // Class-specific states consolidated - ONLY UI STATE, values read from props
    const [berserkerState, setBerserkerState] = useState({
        showRageMenu: false
    });
    // BERSERKER FIX: Read directly from classResource prop
    const berserkerRage = classResource?.current ?? 0;
    
    const [shaperState, setShaperState] = useState({
        currentStance: 'Ataxic Flow',
        showStanceMenu: false,
        showMomentumMenu: false,
        showFlourishMenu: false,
        momentumInputValue: '',
        shaperHoverSection: null, // 'momentum' | 'flourish' | 'stance' | null
        showSpecPassiveMenu: false,
        selectedSpecialization: 'Flow Master' // 'Flow Master' | 'Iron Dancer' | 'Primal Shadow'
    });
    // SHAPER FIX: Read directly from classResource prop
    const shaperMomentum = classResource?.momentum?.current ?? classResource?.momentum ?? 0;
    const shaperFlourish = classResource?.flourish?.current ?? classResource?.flourish ?? 3;

    const [chronarchState, setChronarchState] = useState({
        showTimeShardsMenu: false,
        showTemporalStrainMenu: false,
        chronarchHoverSection: null // 'shards' | 'strain' | null
    });
    // CHRONARCH FIX: Read directly from classResource prop instead of local state
    const chronarchTimeShards = classResource?.timeShards?.current ?? 0;
        const chronarchTemporalStrain = classResource?.temporalStrain?.current ?? 0;
    
    const [hexbreakerState, setHexbreakerState] = useState({
        showChargesMenu: false,
        hexbreakerHoverSection: null // 'charges' | 'counter' | null
    });
    // COVENBANE FIX: Read directly from classResource prop
    const covenbaneHexbreakerCharges = classResource?.hexbreakerCharges ?? 4;
    const covenbaneAttackCounter = classResource?.attackCounter ?? 2;
    const chargesDisplayRef = useRef(null);

    const [ascensionState, setAscensionState] = useState({
        localAscensionPaths: [true, false, false, false, false, false, false], // Start with 1 path active (first path only)
        localBloodTokens: 12, // Start with 12 tokens for demo
        showPathsMenu: false,
        showTokensMenu: false,
        ascensionHoverSection: null // 'paths' | 'tokens' | null
    });

    const [resilienceState, setResilienceState] = useState({
        localDRP: 30, // Start with 30 for demo
        selectedResistanceType: 'Slashing', // Default resistance type
        showDRPMenu: false,
        resilienceHoverSection: null // 'drp' | 'resistance' | 'rebirth' | null
    });
    const drpBarRef = useRef(null);

    const [dominanceState, setDominanceState] = useState({
        localDominanceDie: 0, // Start with no demon
        selectedDemonIndex: 0, // Which demon is currently displayed
        boundDemons: [null, null], // Demo: 2 slots (base Exorcist), both empty by default
        showDominanceMenu: false,
        dominanceHoverSection: null, // 'dominance' | null
        showDemonConfigModal: false,
        demonConfigMode: 'create', // 'create' | 'edit'
        demonConfigInitialData: null
    });
    const dominanceBarRef = useRef(null);

    // Additional class states consolidated
    const [falseProphetState, setFalseProphetState] = useState({
        localMadness: 8, // Start with 8 for demo
        showMadnessMenu: false,
        falseProphetHoverSection: null // 'madness' | null
    });
    const madnessBarRef = useRef(null);

    const [fateWeaverState, setFateWeaverState] = useState({
        localThreads: 7, // Start with 7 for demo (mid-range)
        showThreadsMenu: false,
        fateWeaverHoverSection: null, // 'threads' | null
        selectedFateWeaverSpec: 'fortune-teller' // 'fortune-teller', 'card-master', 'thread-weaver'
    });
    const threadsBarRef = useRef(null);

    // Formbender state removed (merged into Shaper)
    const momentumBarRef = useRef(null);
    const flourishBarRef = useRef(null);
    const stanceBarRef = useRef(null);

    const [gamblerState, setGamblerState] = useState({
        localFortunePoints: 5, // Start with 5 for demo
        gamblerSpec: 'high-roller', // Default to High Roller
        showFPMenu: false,
        showSpecMenu: false,
        gamblerHoverSection: null, // 'fp' | null
        menuPosition: { top: '100%', bottom: 'auto', left: '0', right: '0' }
    });
    const fpBarRef = useRef(null);

    const [huntressState, setHuntressState] = useState({
        localQuarryMarks: 3, // Start with 3 for demo
        huntressSpec: 'bladestorm', // 'bladestorm' | 'beastmaster' | 'shadowblade'
        companionHP: 50, // Companion HP
        companionMaxHP: 50, // Companion max HP
        showQMMenu: false,
        showHuntressSpecMenu: false,
        huntressHoverSection: null // 'marks' | 'companion' | null
    });

    // Helper functions for huntress state
    
    
    
    const qmBarRef = useRef(null);
    const wiBarRef = useRef(null); // Wild Instinct (Formbender merged into Shaper - JSX removed, ref kept for legacy position calcs)

    const [phylacteryState, setPhylacteryState] = useState({
        localPhylacteryHP: 25, // Start with 25 for demo
        eternalFrostActive: false, // Aura state
        lichborneSpec: 'frostbound_tyrant', // 'frostbound_tyrant' | 'spectral_reaper' | 'phylactery_guardian'
        showPhylacteryMenu: false,
        phylacteryHoverSection: null // 'phylactery' | null
    });
    const phylacteryBarRef = useRef(null);

    const [lunarchState, setLunarchState] = useState({
        currentLunarPhase: 'new_moon', // 'new_moon' | 'waxing_moon' | 'full_moon' | 'waning_moon'
        roundsInPhase: 0, // 0-2 (3 rounds per phase)
        lunarchSpec: 'moonlight_sentinel', // 'moonlight_sentinel' | 'starfall_invoker' | 'lunar_guardian'
        showLunarPhaseMenu: false,
        lunarchHoverSection: null // 'phase' | 'timer' | null
    });
    const lunarPhaseBarRef = useRef(null);

    const [martyrState, setMartyrState] = useState({
        localDevotionLevel: 3, // Start with level 3 for demo
        localDevotionDamage: 45, // Damage accumulated (45/60 toward level 4)
        martyrSpec: 'redemption', // 'redemption' | 'zealot' | 'ascetic'
        showDevotionMenu: false,
        showMartyrSpecMenu: false,
        martyrHoverSection: null // 'devotion' | null
    });
    const devotionBarRef = useRef(null);
    const martyrTooltipRef = useRef(null);

    const [minstrelState, setMinstrelState] = useState({
        localNotes: [3, 1, 2, 0, 2, 1, 0], // Start with some notes for demo (I, II, III, IV, V, VI, VII)
        minstrelSpec: 'battlechoir', // 'battlechoir' | 'soulsinger' | 'dissonance'
        minstrelHoverSection: null, // 'note-0' through 'note-6' | 'spec' | null
        showNoteMenus: [false, false, false, false, false, false, false], // One for each note
        showMinstrelSpecMenu: false
    });
    const minstrelBarRef = useRef(null);
    const [minstrelPositions, setMinstrelPositions] = useState({});

    // Class states for specs whose resource UIs were consolidated into the
    // generic classResource renderer. The setters below still drive menu toggles.
    const [deathcallerState, setDeathcallerState] = useState({
        showPathsMenu: false,
        showTokensMenu: false,
        localAscensionPaths: [],
        localBloodTokens: 0
    });
    const [dreadnaughtState, setDreadnaughtState] = useState({
        showDRPMenu: false,
        localDRP: 0,
        selectedResistanceType: null
    });
    const [exorcistState, setExorcistState] = useState({
        showDominanceMenu: false,
        localDominanceDie: 0,
        selectedDemonIndex: 0,
        boundDemons: [null, null],
        showDemonConfigModal: false,
        demonConfigMode: null,
        demonConfigInitialData: null
    });
    const [lichborneState, setLichborneState] = useState({
        showPhylacteryMenu: false
    });

    const timeShardsBarRef = useRef(null);
    const temporalStrainBarRef = useRef(null);
    const [chronarchPositions, setChronarchPositions] = useState({});
    const [mayhemPositions, setMayhemPositions] = useState({});
    const [dominancePositions, setDominancePositions] = useState({});
    const [madnessPositions, setMadnessPositions] = useState({});
    const [threadsPositions, setThreadsPositions] = useState({});
    const [fortunePointsPositions, setFortunePointsPositions] = useState({});
    const [wildInstinctPositions, setWildInstinctPositions] = useState({});
    const [quarryMarksPositions, setQuarryMarksPositions] = useState({});

    const [visionsState, setVisionsState] = useState({
        localVisions: 6, // Start with 6 for demo
        oracleSpec: 'seer', // 'seer' | 'truthseeker' | 'fateseer'
        predictionAccuracy: { total: 5, correct: 4, chain: 2 }, // Tracking predictions
        lastVisionGain: [
            { source: 'Correct Prediction (Moderate)', amount: 2 },
            { source: 'Witness Critical', amount: 1 },
            { source: 'Revelation', amount: 1 }
        ], // Last 3 Vision gains
        showVisionsMenu: false,
        visionsHoverSection: null // 'visions' | null
    });
    const visionsBarRef = useRef(null);
    const pathsBarRef = useRef(null);
    const tokensBarRef = useRef(null);
    const resonanceBarRef = useRef(null);
    const [showResonanceMenu, setShowResonanceMenu] = useState(false);
    const [animistHoverSection, setAnimistHoverSection] = useState(null);
    const setAnimistHoverSectionSafe = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setAnimistHoverSection(value);
    };

    // Destructure local variables from state objects for easier access
    // BERSERKER FIX: Using prop-based berserkerRage instead of local state
        // BERSERKER FIX: rageInputValue comes from uiState, not berserkerState
    
    const {
        currentStance,
        shaperHoverSection,
        selectedSpecialization
    } = shaperState;

    const {
        chronarchHoverSection
    } = chronarchState;

    const {
        hexbreakerHoverSection
    } = hexbreakerState;

    const {
        localAscensionPaths,
        localBloodTokens,
        ascensionHoverSection
    } = ascensionState;

    const {
        localDRP,
        selectedResistanceType,
        showDRPMenu,
        resilienceHoverSection
    } = resilienceState;

    const {
        localDominanceDie,
        selectedDemonIndex,
        boundDemons,
        dominanceHoverSection
    } = dominanceState;

    const {
        localMadness,
        falseProphetHoverSection
    } = falseProphetState;

    const {
        localThreads,
        fateWeaverHoverSection,
        selectedFateWeaverSpec
    } = fateWeaverState;

    const {
        localFortunePoints,
        gamblerHoverSection
    } = gamblerState;

    const {
        localQuarryMarks,
        companionHP,
        companionMaxHP,
        huntressHoverSection
    } = huntressState;

    const {
        localPhylacteryHP,
        lichborneSpec,
        phylacteryHoverSection
    } = phylacteryState;

    const {
        currentLunarPhase,
        roundsInPhase,
        lunarchSpec,
        lunarchHoverSection
    } = lunarchState;

    const {
        localDevotionLevel,
        localDevotionDamage,
        martyrSpec,
        martyrHoverSection
    } = martyrState;

    const {
        localNotes,
        minstrelHoverSection
    } = minstrelState;

    const setMinstrelHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setMinstrelState(prev => ({ ...prev, minstrelHoverSection: value }));
    };
                
    // Setter functions for menu toggles in class-specific states
                

        // BERSERKER FIX: Removed setLocalRage - now reading from props. Using setShowRageMenu from uiState.
            // CHRONARCH FIX: Removed setLocalTimeShards and setLocalTemporalStrain - now reading from props

    const setShowDRPMenu = (value) => setDreadnaughtState(prev => ({ ...prev, showDRPMenu: value }));
    const setLocalDominanceDie = (value) => setExorcistState(prev => ({ ...prev, localDominanceDie: value }));
    const setBoundDemons = (value) => setExorcistState(prev => ({ ...prev, boundDemons: value }));
    const setShowDemonConfigModal = (value) => setExorcistState(prev => ({ ...prev, showDemonConfigModal: value }));
    const setCurrentLunarPhase = useCallback((value) => setLunarchState(prev => ({ ...prev, currentLunarPhase: value })), []);
    const setRoundsInPhase = useCallback((value) => setLunarchState(prev => ({ ...prev, roundsInPhase: value })), []);
    const setLunarchSpec = useCallback((value) => setLunarchState(prev => ({ ...prev, lunarchSpec: value })), []);

    // Setter functions for hover sections in class-specific states
    const setShaperHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setShaperState(prev => ({ ...prev, shaperHoverSection: value }));
    };
    const setChronarchHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setChronarchState(prev => ({ ...prev, chronarchHoverSection: value }));
    };
    const setCovenbaneHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setHexbreakerState(prev => ({ ...prev, hexbreakerHoverSection: value }));
    };
    const setDeathcallerHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setAscensionState(prev => ({ ...prev, ascensionHoverSection: value }));
    };
            const setFalseProphetHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setFalseProphetState(prev => ({ ...prev, falseProphetHoverSection: value }));
    };
    const setFateWeaverHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setFateWeaverState(prev => ({ ...prev, fateWeaverHoverSection: value }));
    };
                const setGamblerHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setGamblerState(prev => ({ ...prev, gamblerHoverSection: value }));
    };
    const setHuntressHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setHuntressState(prev => ({ ...prev, huntressHoverSection: value }));
    };
    const setLichborneHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setPhylacteryState(prev => ({ ...prev, phylacteryHoverSection: value }));
    };
                const setLunarchHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setLunarchState(prev => ({ ...prev, lunarchHoverSection: value }));
    };
        const setOracleHoverSection = (value) => {
        if (value === null && isMouseOverWrapperRef.current) return;
        setVisionsState(prev => ({ ...prev, visionsHoverSection: value }));
    };

    const renderIcon = (icon) => {
        if (!icon) return null;
        if (typeof icon === 'string' && (icon.includes('fa-') || icon.startsWith('fa '))) {
            return <i className={icon} />;
        }
        return icon;
    };

    const {
        localVisions,
        oracleSpec,
        visionsHoverSection
    } = visionsState;

    const {} = arcanoneerState;

    const {} = chaosWeaverState;

    // Get chat store for combat notifications (must be before early return)
    const { addCombatNotification } = useChatStore();

    // Get GM mode status (must be before early return)
    const isGMModeFromStore = useGameStore(state => state.isGMMode);
    const effectiveGMMode = isGMMode || isGMModeFromStore;

    // Get current player name for actor name in logs (must be before early return)
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    // Get class configuration
    const config = getClassResourceConfig(characterClass);

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
            icon: 'fa-bolt'
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

    // Helper function to get the actor name (current player, with GM suffix if in GM mode)
    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return effectiveGMMode ? `${actorName} (GM)` : actorName;
    };

    // Helper function to get character name
    const getCharacterName = () => {
        if (character?.name) return character.name;
        if (character?.character?.name) return character.character.name;
        return currentPlayerName || 'Character';
    };

    // Helper function to log class resource changes
    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'classResource') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = getCharacterName();

        const resourceDisplayName = resourceName || 'Class Resource';

        let message = '';
        if (isPositive) {
            const messages = [
                `${characterName} gained ${absAmount} ${resourceDisplayName}`,
                `${characterName} acquired ${absAmount} ${resourceDisplayName}`,
                `${absAmount} ${resourceDisplayName} was added to ${characterName}`,
                `${characterName} received ${absAmount} ${resourceDisplayName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `${characterName} spent ${absAmount} ${resourceDisplayName}`,
                `${characterName} used ${absAmount} ${resourceDisplayName}`,
                `${absAmount} ${resourceDisplayName} was consumed by ${characterName}`,
                `${characterName} expended ${absAmount} ${resourceDisplayName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        }

        // Use combat_resource type for class resources
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

    // Rage bar anchored tooltip handlers
        // Keep tooltip inside viewport using measurement after render
    // Reset modifier menu when character class changes
    useEffect(() => {
        setShowModifierMenu(false);
    }, [characterClass]);

    // Close modifier menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showModifierMenu && !event.target.closest('.unified-context-menu')) {
                setShowModifierMenu(false);
            }
        };

        if (showModifierMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModifierMenu]);

    // Close DRP menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDRPMenu && !event.target.closest('.drp-menu') && !event.target.closest('.drp-bar-container')) {
                setShowDRPMenu(false);
            }
        };

        if (showDRPMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDRPMenu]);

    // Cleanup tooltip timeout on unmount
    useEffect(() => {
        return () => {
            if (tooltipTimeoutRef.current) {
                clearTimeout(tooltipTimeoutRef.current);
            }
        };
    }, []);

    // Position tooltip below the resource bar
    useEffect(() => {
        if (!showTooltip) return;

        let active = true;

        const updatePosition = () => {
            if (!active) return;
            const tt = tooltipRef.current;
            const br = resourceBarWrapperRef.current;
            if (!tt || !br) {
                requestAnimationFrame(updatePosition);
                return;
            }

            // Set fixed position early so getBoundingClientRect returns correct intrinsic dimensions 
            // instead of stretching to 100% of body width
            tt.style.position = 'fixed';

            const tooltipRect = tt.getBoundingClientRect();
            const barRect = br.getBoundingClientRect();

            if (barRect.width === 0 && barRect.height === 0 && barRect.left === 0 && barRect.top === 0) {
                requestAnimationFrame(updatePosition);
                return;
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 8;

            let hudContainer = br.closest('.party-hud, .party-member-frame, .character-portrait-hud');
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
                // Apply fallback positioning so it doesn't default to the top-left of the viewport,
                // but keep it hidden (opacity 0) while waiting for layout dimensions to resolve.
                tt.style.left = `${left}px`;
                tt.style.top = `${top}px`;
                tt.style.opacity = '0';
                requestAnimationFrame(updatePosition);
                return;
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

            tt.style.position = 'fixed';
            tt.style.left = `${left}px`;
            tt.style.top = `${top}px`;
            tt.style.transform = 'none';
            tt.style.zIndex = '2147483647';
            tt.style.borderRadius = '0';
            tt.style.padding = '10px 12px';
            tt.style.opacity = '1';
        };

        updatePosition();
        requestAnimationFrame(() => {
            if (active) requestAnimationFrame(updatePosition);
        });

        const timeoutId = setTimeout(() => {
            if (active) updatePosition();
        }, 50);
        const timeoutId2 = setTimeout(() => {
            if (active) updatePosition();
        }, 100);

        return () => {
            active = false;
            clearTimeout(timeoutId);
            clearTimeout(timeoutId2);
            if (tooltipRef.current) {
                tooltipRef.current.style.opacity = '0';
            }
        };

    }, [showTooltip, berserkerRage, shaperMomentum, shaperFlourish, shaperHoverSection, chaosWeaverHoverSection, chronarchHoverSection, chronarchTimeShards, chronarchTemporalStrain, hexbreakerHoverSection, covenbaneHexbreakerCharges, covenbaneAttackCounter, size, minstrelHoverSection, gamblerHoverSection, huntressHoverSection, lunarchHoverSection, fateWeaverHoverSection, falseProphetHoverSection, ascensionHoverSection, arcanoneerState.showRollTooltip]);

    // Dedicated Martyr tooltip positioning (avoids TooltipPortal render delay)
    useEffect(() => {
        if (!showTooltip || martyrHoverSection !== 'devotion' || !martyrTooltipRef.current || !devotionBarRef.current) return;

        const updatePosition = () => {
            const tooltip = martyrTooltipRef.current;
            const bar = devotionBarRef.current;
            if (!tooltip || !bar) return;

            tooltip.style.opacity = '0';
            tooltip.style.position = 'fixed';

            const barRect = bar.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

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
                // Apply fallback positioning so it doesn't default to the top-left of the viewport,
                // but keep it hidden (opacity 0) while waiting for layout dimensions to resolve.
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.opacity = '0';
                requestAnimationFrame(updatePosition);
                return;
            }

            if (left < margin) left = margin;
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
            if (martyrTooltipRef.current) martyrTooltipRef.current.style.opacity = '0';
        };
    }, [showTooltip, martyrHoverSection, localDevotionLevel, localDevotionDamage, martyrSpec]);

    

    // Create specialization-specific visual and mechanical configurations for Fate Weaver
    const getFateWeaverConfig = (spec) => {
        const baseConfig = {
            type: 'threads-of-destiny',
            count: 13,
            arrangement: 'horizontal',
            segmentBorder: '#2d1b4e',
            cardSuits: ['♠', '♥', '♦', '♣'],
            icon: 'fas fa-scroll',
            effects: ['mystical', 'fate', 'tarot'],
            maxThreads: 13, // Base maximum
            handLimit: 5   // Base hand limit
        };

        switch (spec) {
            case 'fortune-teller':
                return {
                    ...baseConfig,
                    baseColor: '#0a0614', // Deep mystical purple-black
                    threadColor: '#9370DB', // Medium purple
                    shimmerColor: '#BA55D3', // Medium orchid
                    accentColor: '#8A2BE2', // Blue violet
                    glowColor: '#DA70D6', // Orchid
                    crystalSymbols: ['♠', '♥', '♦', '♣'],
                    icon: 'fas fa-eye',
                    effects: ['mystical', 'crystal', 'divination'],
                    maxThreads: 13, // Standard
                    handLimit: 5   // Standard
                };
            case 'card-master':
                return {
                    ...baseConfig,
                    type: 'deck',
                    baseColor: '#1a1a0a', // Deep gold-black
                    threadColor: '#FFD700', // Gold
                    shimmerColor: '#F0E68C', // Pale goldenrod
                    accentColor: '#DAA520', // Goldenrod
                    glowColor: '#FFA500', // Orange
                    cardSymbols: ['♠', '♥', '♦', '♣'],
                    icon: 'fas fa-cards',
                    effects: ['golden', 'deck', 'cards'],
                    maxThreads: 13, // Standard Threads
                    handLimit: 7   // Master of the Deck: hold up to 7 cards
                };
            case 'thread-weaver':
                return {
                    ...baseConfig,
                    baseColor: '#140a0f', // Deep pink-black
                    threadColor: '#FF1493', // Deep pink
                    shimmerColor: '#FF69B4', // Hot pink
                    accentColor: '#DC143C', // Crimson
                    glowColor: '#FF6347', // Tomato
                    webSymbols: ['♠', '♥', '♦', '♣'],
                    icon: 'fas fa-spider',
                    effects: ['thread', 'web', 'weaver'],
                    maxThreads: 13, // Standard maximum
                    handLimit: 5   // Standard
                };
            default:
                return {
                    ...baseConfig,
                    baseColor: '#1a0d2e', // Deep mystical purple
                    threadColor: '#FFD700', // Golden thread
                    shimmerColor: '#F0E68C', // Pale gold shimmer
                    accentColor: '#9370DB', // Medium purple
                    glowColor: '#FFA500', // Orange-gold glow
                    maxThreads: 13,
                    handLimit: 5
                };
        }
    };

    const finalClassResource = classResource || { current: 0, max: 0 };

    // Calculate and store menu positions
    const updateMinstrelPositions = useCallback(() => {
        if (minstrelBarRef.current) {
            const rect = minstrelBarRef.current.getBoundingClientRect();
            const notes = finalConfig.visual?.notes || [];
            const positions = {};

            // Calculate positions for each note menu
            notes.forEach((note, index) => {
                positions[`note-${index}`] = {
                    top: rect.bottom + 6,
                    left: rect.left + (index * (rect.width / notes.length)) + ((rect.width / notes.length) / 2)
                };
            });

            // Calculate position for spec menu
            positions.spec = {
                top: rect.bottom + 8,
                left: rect.right - 10
            };

            setMinstrelPositions(positions);
        }
    }, [finalConfig.visual?.notes]);

    // Calculate and store Chronarch menu positions
    const updateChronarchPositions = useCallback(() => {
        const positions = {};

        if (timeShardsBarRef.current) {
            const rect = timeShardsBarRef.current.getBoundingClientRect();
            positions.timeShards = {
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) // Center under the bar
            };
        }

        if (temporalStrainBarRef.current) {
            const rect = temporalStrainBarRef.current.getBoundingClientRect();
            positions.temporalStrain = {
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) // Center under the bar
            };
        }

        setChronarchPositions(positions);
    }, []);

    // Calculate and store Mayhem menu positions
    const updateMayhemPositions = useCallback(() => {
        if (mayhemBarRef.current) {
            const rect = mayhemBarRef.current.getBoundingClientRect();
            setMayhemPositions({
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) // Center under the bar
            });
        }
    }, []);

    // Calculate and store Dominance menu positions
    const updateDominancePositions = useCallback(() => {
        if (dominanceBarRef.current) {
            const rect = dominanceBarRef.current.getBoundingClientRect();
            setDominancePositions({
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) // Center under the bar
            });
        }
    }, []);

    // Calculate and store Madness menu positions
    const updateMadnessPositions = useCallback(() => {
        if (madnessBarRef.current) {
            const rect = madnessBarRef.current.getBoundingClientRect();
            setMadnessPositions({
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) // Center under the bar
            });
        }
    }, []);

    // Calculate and store Threads menu positions
    const updateThreadsPositions = useCallback(() => {
        if (threadsBarRef.current) {
            const rect = threadsBarRef.current.getBoundingClientRect();
            setThreadsPositions({
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) // Center under the bar
            });
        }
    }, []);

    // Calculate and store Fortune Points menu positions
    const updateFortunePointsPositions = useCallback(() => {
        if (fpBarRef.current) {
            const rect = fpBarRef.current.getBoundingClientRect();
            setFortunePointsPositions({
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) // Center under the bar
            });
        }
    }, []);

    // Calculate and store Wild Instinct menu positions
    const updateWildInstinctPositions = useCallback(() => {
        if (wiBarRef.current) {
            const rect = wiBarRef.current.getBoundingClientRect();
            setWildInstinctPositions({
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) // Center under the bar
            });
        }
    }, []);

    // Calculate and store Quarry Marks menu positions
    const updateQuarryMarksPositions = useCallback(() => {
        if (qmBarRef.current) {
            const rect = qmBarRef.current.getBoundingClientRect();
            setQuarryMarksPositions({
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) // Center under the bar
            });
        }
    }, []);

    // Update positions when the component mounts and when window resizes
    useLayoutEffect(() => {
        updateMinstrelPositions();
        updateChronarchPositions();
        updateMayhemPositions();
        updateDominancePositions();
        updateMadnessPositions();
        updateThreadsPositions();
        updateFortunePointsPositions();
        updateWildInstinctPositions();
        updateQuarryMarksPositions();
        const handleResize = () => {
            updateMinstrelPositions();
            updateChronarchPositions();
            updateMayhemPositions();
            updateDominancePositions();
            updateMadnessPositions();
            updateThreadsPositions();
            updateFortunePointsPositions();
            updateWildInstinctPositions();
            updateQuarryMarksPositions();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateMinstrelPositions, updateChronarchPositions, updateMayhemPositions, updateDominancePositions, updateMadnessPositions, updateThreadsPositions, updateFortunePointsPositions, updateWildInstinctPositions, updateQuarryMarksPositions]);

    // Apply specialization-specific visual and mechanical config for Fate Weaver
    const modifiedConfig = characterClass === 'Gambit' ? {
        ...finalConfig,
        visual: {
            ...finalConfig.visual,
            ...getFateWeaverConfig(selectedFateWeaverSpec)
        },
        mechanics: {
            ...finalConfig.mechanics,
            max: getFateWeaverConfig(selectedFateWeaverSpec).maxThreads,
            handLimit: getFateWeaverConfig(selectedFateWeaverSpec).handLimit
        }
    } : finalConfig;

    // Define stance value for Shaper tooltips (needs to be accessible to renderTooltip)
    const stanceValue = context === 'account'
        ? (finalClassResource?.stance?.current ?? 'Ataxic Flow')
        : currentStance;

    // Don't render if no valid class or if class is the default 'Class' placeholder
    // (Check after all hooks to satisfy React rules)
    if (!characterClass || characterClass === 'Class') {
        return null;
    }

    // Calculate percentage for progress bars
    const percentage = finalClassResource.max > 0 ? (finalClassResource.current / finalClassResource.max) * 100 : 0;

    // Handle mouse events for tooltip (following item tooltip pattern)
    // Add 4 second delay before showing tooltip
    const handleMouseEnter = (e) => {
        isMouseOverWrapperRef.current = true;
        // Clear any existing timeout
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }

        // Show tooltip immediately on hover
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        isMouseOverWrapperRef.current = false;
        // Clear timeout if mouse leaves before tooltip shows
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
        }
        setUiState(prev => ({ ...prev, showTooltip: false }));

        // Clear all custom class hover sections
        setChaosWeaverHoverSection(null);
        setShaperHoverSection(null);
        setChronarchHoverSection(null);
        setCovenbaneHoverSection(null);
        setDeathcallerHoverSection(null);
        setFalseProphetHoverSection(null);
        setFateWeaverHoverSection(null);
        setGamblerHoverSection(null);
        setHuntressHoverSection(null);
        setLunarchHoverSection(null);
        setMinstrelHoverSection(null);
        setLichborneHoverSection(null);
        setAnimistHoverSection(null);
        setOracleHoverSection(null);
    };

    const handleMouseMove = (e) => {
        // Position is handled by useEffect relative to the bar, no need to update here
    };

    // Handle click events for GM mode (only if owner)
    const handleClick = (e) => {
        if (!isOwner) return; // Only owner can interact
        if (isGMMode && onResourceClick) {
            if (e) {
                e.stopPropagation();
            }
            onResourceClick(finalClassResource.type || finalConfig.id);
        }
    };

    // Handle demon config modal save (Exorcist)
    
    // Dynamic, informal status flavor line shown under each resource menu title.
    // Reflects the live state of the resource bar (calm / warm / danger / critical).
    const renderStatusFlavor = () => {
        const flavor = getResourceStatusFlavor(characterClass, finalClassResource);
        if (!flavor) return null;
        return (
            <div className="menu-status-flavor" style={{
                ...flavor.style,
                fontSize: '0.72rem',
                padding: '2px 10px 4px',
                lineHeight: 1.25,
                opacity: 0.92,
            }}>
                {flavor.text}
            </div>
        );
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
                return <MayhemModifiersResourceBar
                    chaosWeaverState={chaosWeaverState}
                    setChaosWeaverState={setChaosWeaverState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    size={size}
                    context={context}
                    mayhemBarRef={mayhemBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                />;
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
                // Arcanoneer "Building Blocks": handled by external component.
                // combinationMatrix is plumbed through config so the bar can render
                // live formulation chips without a separate import. `showcase` collapses
                // the formulation chips behind a toggle on the rules page.
                return <ArcanoneerResourceBar
                    classResource={finalClassResource}
                    size={size}
                    config={{ ...finalConfig, combinationMatrix: ARCANONEER_COMBINATION_MATRIX }}
                    context={context}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    showcase={showcase}
                />;
            case 'dual-dice':
                return <RageBarResourceBar
                    berserkerState={berserkerState}
                    setBerserkerState={setBerserkerState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    rageInputValue={rageInputValue}
                    rageBarRef={rageBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                />;
            case 'stance-flow':
                return <StanceFlowResourceBar
                    shaperState={shaperState}
                    setShaperState={setShaperState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    momentumBarRef={momentumBarRef}
                    flourishBarRef={flourishBarRef}
                    stanceBarRef={stanceBarRef}
                    setShowTooltip={setShowTooltip}
                    setTooltipPosition={setTooltipPosition}
                    renderStatusFlavor={renderStatusFlavor}
                />;
            case 'time-shards-strain':
                return <TimeShardsStrainResourceBar
                    chronarchState={chronarchState}
                    setChronarchState={setChronarchState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    timeShardsBarRef={timeShardsBarRef}
                    temporalStrainBarRef={temporalStrainBarRef}
                    setShowTooltip={setShowTooltip}
                    setTooltipPosition={setTooltipPosition}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'hexbreaker-charges':
                return <HexbreakerChargesResourceBar
                    hexbreakerState={hexbreakerState}
                    setHexbreakerState={setHexbreakerState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    chargesDisplayRef={chargesDisplayRef}
                    renderIcon={renderIcon}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'ascension-blood':
                return <AscensionBloodResourceBar
                    ascensionState={ascensionState}
                    setAscensionState={setAscensionState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    pathsBarRef={pathsBarRef}
                    tokensBarRef={tokensBarRef}
                    setShowTooltip={setShowTooltip}
                    setTooltipPosition={setTooltipPosition}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'drp-resilience':
                return <DRPResilienceResourceBar
                    resilienceState={resilienceState}
                    setResilienceState={setResilienceState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    drpBarRef={drpBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'dominance-die':
                return <DominanceDieResourceBar
                    dominanceState={dominanceState}
                    setDominanceState={setDominanceState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    dominanceBarRef={dominanceBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                />;
            case 'madness-gauge':
                return <MadnessGaugeResourceBar
                    falseProphetState={falseProphetState}
                    setFalseProphetState={setFalseProphetState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    madnessBarRef={madnessBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                    getDangerLevel={getDangerLevel}
                />;
            case 'threads-of-destiny':
                return <ThreadsOfDestinyResourceBar
                    fateWeaverState={fateWeaverState}
                    setFateWeaverState={setFateWeaverState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    modifiedConfig={modifiedConfig}
                    threadsBarRef={threadsBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'fortune-points-gambling':
                return <FortunePointsResourceBar
                    gamblerState={gamblerState}
                    setGamblerState={setGamblerState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    fpBarRef={fpBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'quarry-marks-companion':
                return <QuarryMarksResourceBar
                    huntressState={huntressState}
                    setHuntressState={setHuntressState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    qmBarRef={qmBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'ancestral-resonance':
                return <AncestralResonanceResourceBar
                    showResonanceMenu={showResonanceMenu}
                    setShowResonanceMenu={setShowResonanceMenu}
                    animistHoverSection={animistHoverSection}
                    setAnimistHoverSection={setAnimistHoverSectionSafe}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    resonanceBarRef={resonanceBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'eternal-frost-phylactery':
                return <EternalFrostPhylacteryResourceBar
                    phylacteryState={phylacteryState}
                    setPhylacteryState={setPhylacteryState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    phylacteryBarRef={phylacteryBarRef}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'lunar-phases':
                return <LunarPhasesResourceBar
                    lunarchState={lunarchState}
                    setLunarchState={setLunarchState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    lunarPhaseBarRef={lunarPhaseBarRef}
                />;
            case 'devotion-gauge':
                return <DevotionGaugeResourceBar
                    martyrState={martyrState}
                    setMartyrState={setMartyrState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    devotionBarRef={devotionBarRef}
                    martyrTooltipRef={martyrTooltipRef}
                    renderStatusFlavor={renderStatusFlavor}
                    getTooltipHeaderColor={getTooltipHeaderColor}
                />;
            case 'musical-notes-combo':
                // Minstrel "Musical Notes & Cadences": handled by external component.
                // cadenceMatrix is plumbed through config so the bar can render live
                // cadence chips with hover-spellcards (same pattern as Arcanoneer).
                return <MinstrelResourceBar
                    classResource={finalClassResource}
                    size={size}
                    config={{ ...finalConfig, cadenceMatrix: MINSTREL_CADENCE_MATRIX }}
                    context={context}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    showcase={showcase}
                />;
            case 'prophetic-visions':
                return <PropheticVisionsResourceBar
                    visionsState={visionsState}
                    setVisionsState={setVisionsState}
                    uiState={uiState}
                    setUiState={setUiState}
                    finalClassResource={finalClassResource}
                    finalConfig={finalConfig}
                    character={character}
                    isOwner={isOwner}
                    onClassResourceUpdate={onClassResourceUpdate}
                    size={size}
                    context={context}
                    visionsBarRef={visionsBarRef}
                    renderStatusFlavor={renderStatusFlavor}
                    logClassResourceChange={logClassResourceChange}
                />;
            case 'virulence-bar':
                return <PlaguebringerResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} isOwner={isOwner} onClassResourceUpdate={onClassResourceUpdate} />;
            case 'inferno-veil':
                return <PyrofiendResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} isOwner={isOwner} onClassResourceUpdate={onClassResourceUpdate} />;
            case 'arcane-absorption':
                return <SpellguardResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} isOwner={isOwner} onClassResourceUpdate={onClassResourceUpdate} />;
            case 'celestial-devotion':
                return renderProgressBar();
            case 'alchemical-arsenal':
                return <ToxicologistResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} isOwner={isOwner} onClassResourceUpdate={onClassResourceUpdate} />;
            case 'vengeance-points':
                return <GaolerResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} isOwner={isOwner} onClassResourceUpdate={onClassResourceUpdate} />;
            case 'mayhem-gauge':
                return (
                    <div
                        className={`class-resource-bar mayhem-gauge ${size}`}
                        ref={mayhemBarRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOwner) setShowModifierMenu(!showModifierMenu);
                        }}
                        onMouseEnter={(e) => {
                            if (!showModifierMenu) {
                                setChaosWeaverHoverSection('mayhem');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                                setShowTooltip(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setChaosWeaverHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{ cursor: isOwner ? 'pointer' : 'default', overflow: 'visible', width: '100%', position: 'relative' }}
                    >
                        <ResourceCanvasBar
                            rendererType="mayhem-bar"
                            size={size}
                            layoutMode="bar"
                            current={finalClassResource.current || 0}
                            max={finalClassResource.max || 100}
                            config={{
                                ...finalConfig,
                                currentPressure: finalClassResource.current || 0,
                                maxPressure: finalClassResource.max || 100,
                                specialization: 'pandemonium'
                            }}
                            isOwner={isOwner}
                        />
                        {showModifierMenu && mayhemBarRef.current && ReactDOM.createPortal(
                            <div
                                className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                                onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                style={{
                                    position: 'fixed',
                                    top: (() => {
                                        if (!mayhemBarRef.current) return '50%';
                                        const rect = mayhemBarRef.current.getBoundingClientRect();
                                        let hudContainer = mayhemBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                        let hudBottom = rect.bottom;
                                        if (hudContainer) {
                                            const hudRect = hudContainer.getBoundingClientRect();
                                            hudBottom = hudRect.bottom;
                                        }
                                        return hudBottom + 8;
                                    })(),
                                    left: (() => {
                                        if (!mayhemBarRef.current) return '50%';
                                        const rect = mayhemBarRef.current.getBoundingClientRect();
                                        return rect.left + (rect.width / 2);
                                    })(),
                                    transform: 'translateX(-50%)',
                                    zIndex: 100000
                                }}
                            >
                                <div className="context-menu-main">
                                    <div className="menu-title">Mayhem Control</div>
                                    {renderStatusFlavor()}
                                    <div className="context-menu-section">
                                        <div className="context-menu-section-header" style={{ color: '#5E35B1', fontSize: '11px', fontWeight: 'bold' }}>
                                            Mayhem: {finalClassResource.current || 0}/{finalClassResource.max || 100}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                            <button
                                                className="context-menu-button gain"
                                                onClick={() => {
                                                    const cur = finalClassResource.current || 0;
                                                    const maxVal = finalClassResource.max || 100;
                                                    const newValue = Math.min(maxVal, cur + 5);
                                                    const amount = newValue - cur;
                                                    if (amount > 0) {
                                                        logClassResourceChange('Mayhem', amount, true, 'mayhemGauge');
                                                        if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-plus"></i> +5 Mayhem
                                            </button>
                                            <button
                                                className="context-menu-button gain"
                                                onClick={() => {
                                                    const cur = finalClassResource.current || 0;
                                                    const maxVal = finalClassResource.max || 100;
                                                    const newValue = Math.min(maxVal, cur + 10);
                                                    const amount = newValue - cur;
                                                    if (amount > 0) {
                                                        logClassResourceChange('Mayhem', amount, true, 'mayhemGauge');
                                                        if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-plus-circle"></i> +10 Mayhem
                                            </button>
                                            <button
                                                className="context-menu-button spend"
                                                onClick={() => {
                                                    const cur = finalClassResource.current || 0;
                                                    const newValue = Math.max(0, cur - 5);
                                                    const amount = cur - newValue;
                                                    if (amount > 0) {
                                                        logClassResourceChange('Mayhem', amount, false, 'mayhemGauge');
                                                        if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-minus"></i> -5 Mayhem
                                            </button>
                                            <button
                                                className="context-menu-button spend"
                                                onClick={() => {
                                                    const cur = finalClassResource.current || 0;
                                                    const newValue = Math.max(0, cur - 10);
                                                    const amount = cur - newValue;
                                                    if (amount > 0) {
                                                        logClassResourceChange('Mayhem', amount, false, 'mayhemGauge');
                                                        if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-minus-circle"></i> -10 Mayhem
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                        <button
                                            onClick={() => {
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                            }}
                                            className="context-menu-button"
                                            style={{ flex: 1 }}
                                        >
                                            <i className="fas fa-undo"></i> Reset
                                        </button>
                                        <button
                                            onClick={() => setShowModifierMenu(false)}
                                            className="context-menu-button close"
                                            style={{ flex: 1 }}
                                        >
                                            <i className="fas fa-times"></i> Close
                                        </button>
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>
                );
            case 'dual-omen':
                return <AugurResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} isOwner={isOwner} onClassResourceUpdate={onClassResourceUpdate} />;
            case 'havoc':
                return renderProgressBar();
            case 'progress-bar':
                return renderProgressBar();
            default:
                return renderProgressBar();
        }
    };

    // Progress bar (default/fallback)
    const renderProgressBar = () => {
        const hasChaoticWave = finalConfig.visual.effects?.includes('chaotic-wave');

        // Debug logging disabled to prevent console flooding
        // console.log('ClassResourceBar Debug:', {
        //     characterClass,
        //     hasChaoticWave,
        //     effects: finalConfig.visual.effects,
        //     activeColor: finalConfig.visual.activeColor,
        //     percentage
        // });

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
                        <span className="orb-icon">{renderIcon(finalConfig.visual.icon)}</span>
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
                            {renderIcon(config.visual.icon)}
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
                <div className="gauge-icon">{renderIcon(config.visual.icon)}</div>
            </div>
            <div className="resource-label">{classResource.current}/{classResource.max} {config.shortName}</div>
        </div>
    );

    // Vortex display (Old Chaos Weaver - kept for compatibility)
    const renderVortex = () => (
        <div className={`class-resource-bar vortex-display ${size}`}>
            <div className="vortex-container">
                <div className="chaos-vortex">
                    <div className="vortex-center">{renderIcon(config.visual.icon)}</div>
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
    const renderCardDeck = () => {
        const suits = ['♠', '♥', '♦', '♣'];
        const currentResource = finalClassResource.current ?? 0;
        const maxResource = finalClassResource.max ?? 13;
        const deckCount = Math.max(0, maxResource - currentResource);
        const deckIconClass = finalConfig.visual?.icon || 'fas fa-scroll';

        return (
            <div className={`class-resource-bar card-deck ${size}`}>
                <div className="deck-container">
                    <div className="deck-stack" title={`Deck: ${deckCount} cards remaining`}>
                        <div className="deck-icon">
                            <i className={deckIconClass}></i>
                        </div>
                        <div className="deck-count">{deckCount}</div>
                    </div>
                    <div className="hand-display">
                        {Array.from({ length: currentResource }, (_, i) => {
                            const suit = suits[i % 4];
                            const isRed = suit === '♥' || suit === '♦';
                            return (
                                <div 
                                    key={i} 
                                    className={`card-in-hand ${isRed ? 'red-suit' : 'black-suit'}`}
                                    title={`Card ${i + 1} (${suit})`}
                                >
                                    <span className="card-suit">{suit}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="resource-label">Sanguine Reserve: {currentResource}/{modifiedConfig.mechanics?.handLimit ?? 7}</div>
            </div>
        );
    };

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
                <div className="casino-icon">{renderIcon(config.visual.icon)}</div>
            </div>
        </div>
    );

    // Stigmata display (Martyr)
    const renderStigmata = () => (
        <div className={`class-resource-bar stigmata-display ${size}`}>
            <div className="stigmata-container">
                <div className="holy-symbol">{renderIcon(config.visual.icon)}</div>
                <div className="pain-charges">
                    {Array.from({ length: classResource.current }, (_, i) => (
                        <div key={i} className="pain-charge" style={{ color: config.visual.activeColor }}>
                            ♥
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
                    {renderIcon(config.visual.icon)}
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
                <div className="holy-medallion" style={{ color: finalConfig.visual.activeColor }}>
                    {renderIcon(finalConfig.visual.icon) || 'â›¤'}
                </div>
                <div className="spirit-gems">
                    {Array.from({ length: finalClassResource.max }, (_, i) => (
                        <div
                            key={i}
                            className={`spirit-gem ${i < finalClassResource.current ? 'charged' : ''}`}
                            style={{
                                backgroundColor: i < finalClassResource.current ? finalConfig.visual.glowColor : finalConfig.visual.baseColor
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="resource-label">Spirit Gems: {finalClassResource.current}/{finalClassResource.max}</div>
        </div>
    );

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

    // Helper functions for Fate Weaver (defined at component level for tooltip access)
    const getThreadLevel = (threads) => {
        // Standard levels for all specs (max 13)
        if (threads <= 3) return { name: 'Sparse Threads', color: '#9370DB' };
        if (threads <= 6) return { name: 'Woven Strands', color: '#B8860B' };
        if (threads <= 9) return { name: 'Wyrd-Weave', color: '#FFD700' };
        if (threads <= 12) return { name: 'Destiny\'s Web', color: '#FFA500' };
        return { name: 'Fate Mastered', color: '#FFD700' };
    };

    // Wild Instinct Forms rendering removed (Formbender merged into Shaper)

    // Helper function to get tooltip header color with better contrast
    const getTooltipHeaderColor = (color) => {
        // Map bright colors to darker versions for better contrast on beige background
        const colorMap = {
            '#FFD700': '#8B6508', // Gold -> DarkGoldenrod
            '#DC143C': '#8B0000', // Crimson -> DarkRed
            '#34D399': '#1B5E20', // Green -> DarkGreen
            '#FF6B6B': '#8b3a2a', // Soft Red -> DarkRed
            '#9CA3AF': '#4B5563'  // Gray -> DarkGray
        };
        return colorMap[color] || color;
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
                        {renderIcon(config.visual.icon)}
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
                <div className="phylactery-core">{renderIcon(config.visual.icon)}</div>
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
                <div className="death-scythe">{renderIcon(config.visual.icon)}</div>
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


    // Helper function to get Berserker rage state

    const isArcanoneer = finalConfig.visual.type === 'elemental-spheres';
                                                    const isMartyr = finalConfig.visual?.type === 'devotion-gauge';
                        const isAugur = finalConfig.visual?.type === 'dual-omen';

    // Hide CR bar if class has no resource system (max === 0)
    // This prevents showing "0/0" bars for GMs or characters without class resources
    if (!finalClassResource.max || finalClassResource.max === 0) {
        return null;
    }

    return (
        <>
            <div
                ref={resourceBarWrapperRef}
                className={`class-resource-wrapper ${isGMMode ? 'clickable' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                style={{ cursor: isGMMode ? 'pointer' : 'default' }}
            >
                {renderResourceDisplay()}
                {!isMartyr && !isAugur && !isArcanoneer && (
                    <ResourceTooltip
                        finalConfig={finalConfig}
                        modifiedConfig={modifiedConfig}
                        finalClassResource={finalClassResource}
                        showTooltip={showTooltip}
                        chaosWeaverHoverSection={chaosWeaverHoverSection}
                        activeSpecialization={activeSpecialization}
                        animistHoverSection={animistHoverSection}
                        shaperHoverSection={shaperHoverSection}
                        chronarchHoverSection={chronarchHoverSection}
                        hexbreakerHoverSection={hexbreakerHoverSection}
                        ascensionHoverSection={ascensionHoverSection}
                        falseProphetHoverSection={falseProphetHoverSection}
                        fateWeaverHoverSection={fateWeaverHoverSection}
                        gamblerHoverSection={gamblerHoverSection}
                        huntressHoverSection={huntressHoverSection}
                        lunarchHoverSection={lunarchHoverSection}
                        minstrelHoverSection={minstrelHoverSection}
                        tooltipRef={tooltipRef}
                        shaperMomentum={shaperMomentum}
                        shaperFlourish={shaperFlourish}
                        stanceValue={stanceValue}
                        currentStance={currentStance}
                        selectedSpecialization={selectedSpecialization}
                        chronarchTimeShards={chronarchTimeShards}
                        chronarchTemporalStrain={chronarchTemporalStrain}
                        covenbaneHexbreakerCharges={covenbaneHexbreakerCharges}
                        covenbaneAttackCounter={covenbaneAttackCounter}
                        localAscensionPaths={localAscensionPaths}
                        localBloodTokens={localBloodTokens}
                        resilienceHoverSection={resilienceHoverSection}
                        localDRP={localDRP}
                        selectedResistanceType={selectedResistanceType}
                        dominanceHoverSection={dominanceHoverSection}
                        boundDemons={boundDemons}
                        selectedDemonIndex={selectedDemonIndex}
                        localDominanceDie={localDominanceDie}
                        localMadness={localMadness}
                        getDangerLevel={getDangerLevel}
                        getNextThreshold={getNextThreshold}
                        localThreads={localThreads}
                        getThreadLevel={getThreadLevel}
                        selectedFateWeaverSpec={selectedFateWeaverSpec}
                        localFortunePoints={localFortunePoints}
                        localQuarryMarks={localQuarryMarks}
                        companionHP={companionHP}
                        companionMaxHP={companionMaxHP}
                        phylacteryHoverSection={phylacteryHoverSection}
                        lichborneSpec={lichborneSpec}
                        localPhylacteryHP={localPhylacteryHP}
                        currentLunarPhase={currentLunarPhase}
                        roundsInPhase={roundsInPhase}
                        lunarchSpec={lunarchSpec}
                        localNotes={localNotes}
                        visionsHoverSection={visionsHoverSection}
                        oracleSpec={oracleSpec}
                        localVisions={localVisions}
                        berserkerRage={berserkerRage}
                    />
                )}
            </div>

        </>
    );
};

export default React.memo(ClassResourceBar);