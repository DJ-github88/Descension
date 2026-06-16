import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { getClassResourceConfig } from '../../data/classResources';
import TooltipPortal from '../tooltips/TooltipPortal';
import useChatStore from '../../store/chatStore';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
import ResourceCanvasBar from './canvas/ResourceCanvasBar';
import PlaguebringerResourceBar from '../../data/classes/plaguebringer/components/PlaguebringerResourceBar';
import PyrofiendResourceBar from '../../data/classes/pyrofiend/components/PyrofiendResourceBar';
import SpellguardResourceBar from '../../data/classes/spellguard/components/SpellguardResourceBar';
import ToxicologistResourceBar from '../../data/classes/toxicologist/components/ToxicologistResourceBar';
import WardenResourceBar from '../../data/classes/warden/components/WardenResourceBar';
import AugurResourceBar from '../../data/classes/augur/components/AugurResourceBar';
import ArcanoneerResourceBar from '../../data/classes/arcanoneer/components/ArcanoneerResourceBar';
// Arcanoneer combination matrix â€” passed through to ArcanoneerResourceBar so it can
// render live "ready formulation" chips without a separate import in the component.
import { ARCANONEER_DATA } from '../../data/classes/arcanoneerData';
const ARCANONEER_COMBINATION_MATRIX = ARCANONEER_DATA?.combinationMatrix || null;
import '../../styles/unified-context-menu.css';

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
        tooltipPosition,
        tooltipPlacement,
        showRageMenu,
        rageInputValue,
        showModifierMenu,
        chaosWeaverHoverSection,
        activeSpecialization,
        rerollsUsed,
        swapMode,
        selectedForSwap
    } = uiState;

    // Helper functions for updating uiState
    const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
    const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
    const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));
    const setShowRageMenu = (value) => setUiState(prev => ({ ...prev, showRageMenu: value }));
    const setRageInputValue = (value) => setUiState(prev => ({ ...prev, rageInputValue: value }));
    const setShowModifierMenu = (value) => setUiState(prev => ({ ...prev, showModifierMenu: value }));
    const setChaosWeaverHoverSection = (value) => setUiState(prev => ({ ...prev, chaosWeaverHoverSection: value }));
    const setActiveSpecialization = (value) => setUiState(prev => ({ ...prev, activeSpecialization: value }));
    const setRerollsUsed = (value) => setUiState(prev => ({ ...prev, rerollsUsed: value }));
    const setSwapMode = (value) => setUiState(prev => ({ ...prev, swapMode: value }));
    const setSelectedForSwap = (value) => setUiState(prev => ({ ...prev, selectedForSwap: value }));

    // Arcanoneer state
    const [arcanoneerState, setArcanoneerState] = useState({
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

    // Class-specific states consolidated - ONLY UI STATE, values read from props
    const [berserkerState, setBerserkerState] = useState({
        showRageMenu: false
    });
    // BERSERKER FIX: Read directly from classResource prop
    const berserkerRage = classResource?.current ?? 0;
    const berserkerRageMax = classResource?.max ?? 100;

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
    const chronarchTimeShardsMax = classResource?.timeShards?.max ?? 10;
    const chronarchTemporalStrain = classResource?.temporalStrain?.current ?? 0;
    const chronarchTemporalStrainMax = classResource?.temporalStrain?.max ?? 10;

    const [covenbaneState, setCovenbaneState] = useState({
        showChargesMenu: false,
        covenbaneHoverSection: null // 'charges' | 'counter' | null
    });
    // COVENBANE FIX: Read directly from classResource prop
    const covenbaneHexbreakerCharges = classResource?.hexbreakerCharges ?? 4;
    const covenbaneAttackCounter = classResource?.attackCounter ?? 2;
    const chargesDisplayRef = useRef(null);

    const [deathcallerState, setDeathcallerState] = useState({
        localAscensionPaths: [true, false, false, false, false, false, false], // Start with 1 path active (first path only)
        localBloodTokens: 12, // Start with 12 tokens for demo
        showPathsMenu: false,
        showTokensMenu: false,
        deathcallerHoverSection: null // 'paths' | 'tokens' | null
    });

    const [dreadnaughtState, setDreadnaughtState] = useState({
        localDRP: 30, // Start with 30 for demo
        selectedResistanceType: 'Slashing', // Default resistance type
        showDRPMenu: false,
        dreadnaughtHoverSection: null // 'drp' | 'resistance' | 'rebirth' | null
    });
    const drpBarRef = useRef(null);

    const [exorcistState, setExorcistState] = useState({
        localDominanceDie: 0, // Start with no demon
        selectedDemonIndex: 0, // Which demon is currently displayed
        boundDemons: [null, null], // Demo: 2 slots (base Exorcist), both empty by default
        showDominanceMenu: false,
        exorcistHoverSection: null, // 'dominance' | null
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
    const setLocalQuarryMarks = (value) => {
        setHuntressState(prev => ({ ...prev, localQuarryMarks: value }));
    };

    const setHuntressSpec = (value) => {
        setHuntressState(prev => ({ ...prev, huntressSpec: value }));
    };

    const setLocalCompanionHP = (value) => {
        setHuntressState(prev => ({ ...prev, companionHP: value }));
    };

    const qmBarRef = useRef(null);
    const wiBarRef = useRef(null); // Wild Instinct (Formbender merged into Shaper - JSX removed, ref kept for legacy position calcs)

    const [lichborneState, setLichborneState] = useState({
        localPhylacteryHP: 25, // Start with 25 for demo
        eternalFrostActive: false, // Aura state
        lichborneSpec: 'frostbound_tyrant', // 'frostbound_tyrant' | 'spectral_reaper' | 'phylactery_guardian'
        showPhylacteryMenu: false,
        lichborneHoverSection: null // 'phylactery' | null
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

    const [oracleState, setOracleState] = useState({
        localVisions: 6, // Start with 6 for demo
        oracleSpec: 'seer', // 'seer' | 'truthseeker' | 'fateseer'
        predictionAccuracy: { total: 5, correct: 4, chain: 2 }, // Tracking predictions
        lastVisionGain: [
            { source: 'Correct Prediction (Moderate)', amount: 2 },
            { source: 'Witness Critical', amount: 1 },
            { source: 'Revelation', amount: 1 }
        ], // Last 3 Vision gains
        showVisionsMenu: false,
        oracleHoverSection: null // 'visions' | null
    });
    const visionsBarRef = useRef(null);
    const pathsBarRef = useRef(null);
    const tokensBarRef = useRef(null);
    const resonanceBarRef = useRef(null);
    const [showResonanceMenu, setShowResonanceMenu] = useState(false);
    const [animistHoverSection, setAnimistHoverSection] = useState(null);

    // Destructure local variables from state objects for easier access
    // BERSERKER FIX: Using prop-based berserkerRage instead of local state
    const {
        showRageMenu: berserkerShowRageMenu
    } = berserkerState;
    // BERSERKER FIX: rageInputValue comes from uiState, not berserkerState
    const berserkerRageInputValue = rageInputValue;

    const {
        currentStance,
        showStanceMenu,
        showMomentumMenu,
        showFlourishMenu,
        momentumInputValue,
        shaperHoverSection,
        showSpecPassiveMenu,
        selectedSpecialization
    } = shaperState;

    const {
        showTimeShardsMenu,
        showTemporalStrainMenu,
        chronarchHoverSection
    } = chronarchState;

    const {
        showChargesMenu,
        covenbaneHoverSection
    } = covenbaneState;

    const {
        localAscensionPaths,
        localBloodTokens,
        showPathsMenu,
        showTokensMenu,
        deathcallerHoverSection
    } = deathcallerState;

    const {
        localDRP,
        selectedResistanceType,
        showDRPMenu,
        dreadnaughtHoverSection
    } = dreadnaughtState;

    const {
        localDominanceDie,
        selectedDemonIndex,
        boundDemons,
        showDominanceMenu,
        exorcistHoverSection,
        showDemonConfigModal,
        demonConfigMode,
        demonConfigInitialData
    } = exorcistState;

    const {
        localMadness,
        showMadnessMenu,
        falseProphetHoverSection
    } = falseProphetState;

    const {
        localThreads,
        showThreadsMenu,
        fateWeaverHoverSection,
        selectedFateWeaverSpec
    } = fateWeaverState;

    const {
        localFortunePoints,
        gamblerSpec,
        showFPMenu,
        showSpecMenu,
        gamblerHoverSection,
        menuPosition
    } = gamblerState;

    const {
        localQuarryMarks,
        huntressSpec,
        companionHP,
        companionMaxHP,
        showQMMenu,
        showHuntressSpecMenu,
        huntressHoverSection
    } = huntressState;

    const {
        localPhylacteryHP,
        eternalFrostActive,
        lichborneSpec,
        showPhylacteryMenu,
        lichborneHoverSection
    } = lichborneState;

    const {
        currentLunarPhase,
        roundsInPhase,
        lunarchSpec,
        showLunarPhaseMenu,
        lunarchHoverSection
    } = lunarchState;

    const {
        localDevotionLevel,
        localDevotionDamage,
        martyrSpec,
        showDevotionMenu,
        showMartyrSpecMenu,
        martyrHoverSection
    } = martyrState;

    const {
        localNotes,
        minstrelSpec,
        showNoteMenus,
        showMinstrelSpecMenu,
        minstrelHoverSection
    } = minstrelState;

    const setMinstrelHoverSection = (value) => setMinstrelState(prev => ({ ...prev, minstrelHoverSection: value }));
    const setShowMinstrelSpecMenu = (value) => setMinstrelState(prev => ({ ...prev, showMinstrelSpecMenu: value }));
    const setShowNoteMenus = (value) => setMinstrelState(prev => ({ ...prev, showNoteMenus: value }));
    const setLocalNotes = (value) => setMinstrelState(prev => ({ ...prev, localNotes: value }));
    const setMinstrelSpec = (value) => setMinstrelState(prev => ({ ...prev, minstrelSpec: value }));

    // Setter functions for menu toggles in class-specific states
    const setShowStanceMenu = (value) => setShaperState(prev => ({ ...prev, showStanceMenu: value }));
    const setShowMomentumMenu = (value) => setShaperState(prev => ({ ...prev, showMomentumMenu: value }));
    const setShowFlourishMenu = (value) => setShaperState(prev => ({ ...prev, showFlourishMenu: value }));
    const setShowSpecPassiveMenu = (value) => setShaperState(prev => ({ ...prev, showSpecPassiveMenu: value }));


    const setCurrentStance = (value) => setShaperState(prev => ({ ...prev, currentStance: value }));
    // BERSERKER FIX: Removed setLocalRage - now reading from props. Using setShowRageMenu from uiState.
    const setShowTimeShardsMenu = (value) => setChronarchState(prev => ({ ...prev, showTimeShardsMenu: value }));
    const setShowTemporalStrainMenu = (value) => setChronarchState(prev => ({ ...prev, showTemporalStrainMenu: value }));
    // CHRONARCH FIX: Removed setLocalTimeShards and setLocalTemporalStrain - now reading from props

    const setShowPathsMenu = (value) => setDeathcallerState(prev => ({ ...prev, showPathsMenu: value }));
    const setShowTokensMenu = (value) => setDeathcallerState(prev => ({ ...prev, showTokensMenu: value }));
    const setLocalAscensionPaths = (valueOrFn) => setDeathcallerState(prev => ({
        ...prev,
        localAscensionPaths: typeof valueOrFn === 'function' ? valueOrFn(prev.localAscensionPaths) : valueOrFn
    }));
    const setLocalBloodTokens = (valueOrFn) => setDeathcallerState(prev => ({
        ...prev,
        localBloodTokens: typeof valueOrFn === 'function' ? valueOrFn(prev.localBloodTokens) : valueOrFn
    }));
    const setShowDRPMenu = (value) => setDreadnaughtState(prev => ({ ...prev, showDRPMenu: value }));
    const setLocalDRP = (value) => setDreadnaughtState(prev => ({ ...prev, localDRP: value }));
    const setSelectedResistanceType = (value) => setDreadnaughtState(prev => ({ ...prev, selectedResistanceType: value }));
    const setShowDominanceMenu = (value) => setExorcistState(prev => ({ ...prev, showDominanceMenu: value }));
    const setLocalDominanceDie = (value) => setExorcistState(prev => ({ ...prev, localDominanceDie: value }));
    const setSelectedDemonIndex = (value) => setExorcistState(prev => ({ ...prev, selectedDemonIndex: value }));
    const setBoundDemons = (value) => setExorcistState(prev => ({ ...prev, boundDemons: value }));
    const setShowDemonConfigModal = (value) => setExorcistState(prev => ({ ...prev, showDemonConfigModal: value }));
    const setDemonConfigMode = (value) => setExorcistState(prev => ({ ...prev, demonConfigMode: value }));
    const setDemonConfigInitialData = (value) => setExorcistState(prev => ({ ...prev, demonConfigInitialData: value }));
    const setShowMadnessMenu = (value) => setFalseProphetState(prev => ({ ...prev, showMadnessMenu: value }));
    const setLocalMadness = (value) => setFalseProphetState(prev => ({ ...prev, localMadness: value }));
    const setShowFPMenu = (value) => setGamblerState(prev => ({ ...prev, showFPMenu: value }));
    const setShowSpecMenu = (value) => setGamblerState(prev => ({ ...prev, showSpecMenu: value }));
    const setGamblerSpec = (value) => setGamblerState(prev => ({ ...prev, gamblerSpec: value }));
    const setLocalFortunePoints = (value) => setGamblerState(prev => ({ ...prev, localFortunePoints: value }));

    const calculateMenuPosition = () => {
        if (!fpBarRef.current) return;

        const rect = fpBarRef.current.getBoundingClientRect();
        const menuWidth = 340; // Menu max-width from CSS
        const menuHeight = 350; // Estimated menu height
        const margin = 10;

        // Check vertical space
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Check horizontal space
        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;

        let verticalPosition = 'below';
        let horizontalPosition = 'left';

        // Determine vertical position
        if (spaceBelow >= menuHeight + margin) {
            verticalPosition = 'below';
        } else if (spaceAbove >= menuHeight + margin) {
            verticalPosition = 'above';
        } else {
            verticalPosition = 'below'; // Default to below even if it overflows
        }

        // Determine horizontal position - try to center first, then adjust if needed
        if (rect.left + rect.width / 2 - menuWidth / 2 < margin) {
            // Not enough space on left, align to left edge
            horizontalPosition = 'left';
        } else if (rect.right - rect.width / 2 + menuWidth / 2 > window.innerWidth - margin) {
            // Not enough space on right, align to right edge
            horizontalPosition = 'right';
        } else {
            // Enough space, center the menu
            horizontalPosition = 'center';
        }

        // Set position styles based on calculations
        let position = {};
        if (verticalPosition === 'below') {
            position.top = '100%';
            position.bottom = 'auto';
        } else {
            position.top = 'auto';
            position.bottom = '100%';
        }

        if (horizontalPosition === 'left') {
            position.left = '0';
            position.right = 'auto';
        } else if (horizontalPosition === 'right') {
            position.left = 'auto';
            position.right = '0';
        } else { // center
            position.left = '50%';
            position.right = 'auto';
            position.transform = 'translateX(-50%)';
        }

        setGamblerState(prev => ({ ...prev, menuPosition: position }));
    };

    const setShowQMMenu = (value) => setHuntressState(prev => ({ ...prev, showQMMenu: value }));
    const setShowHuntressSpecMenu = (value) => setHuntressState(prev => ({ ...prev, showHuntressSpecMenu: value }));
    const setShowPhylacteryMenu = (value) => setLichborneState(prev => ({ ...prev, showPhylacteryMenu: value }));
    const setShowLunarPhaseMenu = (value) => setLunarchState(prev => ({ ...prev, showLunarPhaseMenu: value }));
    const setCurrentLunarPhase = useCallback((value) => setLunarchState(prev => ({ ...prev, currentLunarPhase: value })), []);
    const setRoundsInPhase = useCallback((value) => setLunarchState(prev => ({ ...prev, roundsInPhase: value })), []);
    const setLunarchSpec = useCallback((value) => setLunarchState(prev => ({ ...prev, lunarchSpec: value })), []);
    const setShowDevotionMenu = (value) => setMartyrState(prev => ({ ...prev, showDevotionMenu: value }));
    const setShowMartyrSpecMenu = (value) => setMartyrState(prev => ({ ...prev, showMartyrSpecMenu: value }));
    const setMartyrSpec = (value) => setMartyrState(prev => ({ ...prev, martyrSpec: value }));
    const setLocalDevotionLevel = (value) => setMartyrState(prev => ({ ...prev, localDevotionLevel: value }));
    const setLocalDevotionDamage = (value) => setMartyrState(prev => ({ ...prev, localDevotionDamage: value }));
    const setShowVisionsMenu = (value) => setOracleState(prev => ({ ...prev, showVisionsMenu: value }));
    const setLocalVisions = (value) => setOracleState(prev => ({ ...prev, localVisions: value }));
    const setOracleSpec = (value) => setOracleState(prev => ({ ...prev, oracleSpec: value }));
    const setLastVisionGain = (value) => setOracleState(prev => ({ ...prev, lastVisionGain: value }));
    const setPredictionAccuracy = (value) => setOracleState(prev => ({ ...prev, predictionAccuracy: value }));
    const setShowChargesMenu = (value) => setCovenbaneState(prev => ({ ...prev, showChargesMenu: value }));

    // Setter functions for hover sections in class-specific states
    const setShaperHoverSection = (value) => setShaperState(prev => ({ ...prev, shaperHoverSection: value }));
    const setChronarchHoverSection = (value) => setChronarchState(prev => ({ ...prev, chronarchHoverSection: value }));
    const setCovenbaneHoverSection = (value) => setCovenbaneState(prev => ({ ...prev, covenbaneHoverSection: value }));
    const setDeathcallerHoverSection = (value) => setDeathcallerState(prev => ({ ...prev, deathcallerHoverSection: value }));
    const setDreadnaughtHoverSection = (value) => setDreadnaughtState(prev => ({ ...prev, dreadnaughtHoverSection: value }));
    const setExorcistHoverSection = (value) => setExorcistState(prev => ({ ...prev, exorcistHoverSection: value }));
    const setFalseProphetHoverSection = (value) => setFalseProphetState(prev => ({ ...prev, falseProphetHoverSection: value }));
    const setFateWeaverHoverSection = (value) => setFateWeaverState(prev => ({ ...prev, fateWeaverHoverSection: value }));
    const setSelectedFateWeaverSpec = (value) => setFateWeaverState(prev => ({ ...prev, selectedFateWeaverSpec: value }));
    const setShowThreadsMenu = (value) => setFateWeaverState(prev => ({ ...prev, showThreadsMenu: value }));
    const setLocalThreads = (value) => setFateWeaverState(prev => ({ ...prev, localThreads: value }));
    const setGamblerHoverSection = (value) => setGamblerState(prev => ({ ...prev, gamblerHoverSection: value }));
    const setHuntressHoverSection = (value) => setHuntressState(prev => ({ ...prev, huntressHoverSection: value }));
    const setLichborneHoverSection = (value) => setLichborneState(prev => ({ ...prev, lichborneHoverSection: value }));
    const setLocalPhylacteryHP = (value) => setLichborneState(prev => ({ ...prev, localPhylacteryHP: value }));
    const setEternalFrostActive = (value) => setLichborneState(prev => ({ ...prev, eternalFrostActive: value }));
    const setLichborneSpec = (value) => setLichborneState(prev => ({ ...prev, lichborneSpec: value }));
    const setLunarchHoverSection = (value) => setLunarchState(prev => ({ ...prev, lunarchHoverSection: value }));
    const setMartyrHoverSection = (value) => setMartyrState(prev => ({ ...prev, martyrHoverSection: value }));
    const setOracleHoverSection = (value) => setOracleState(prev => ({ ...prev, oracleHoverSection: value }));

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
        predictionAccuracy,
        lastVisionGain,
        showVisionsMenu,
        oracleHoverSection
    } = oracleState;

    const {
        localSpheres,
        isRolling,
        showControls,
        diceButtonMode
    } = arcanoneerState;

    const {
        localModifiers
    } = chaosWeaverState;

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
    const handleRageBarEnter = () => {
        if (rageBarRef.current) {
            const rect = rageBarRef.current.getBoundingClientRect();
            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        }
    };
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

        const tooltip = tooltipRef.current;
        const bar = resourceBarWrapperRef.current;

        if (!tooltip || !bar) return;

        tooltip.style.opacity = '0';

        const updatePosition = () => {
            const tt = tooltipRef.current;
            const br = resourceBarWrapperRef.current;
            if (!tt || !br) return;

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
            requestAnimationFrame(updatePosition);
        });

        const timeoutId = setTimeout(updatePosition, 50);
        const timeoutId2 = setTimeout(updatePosition, 100);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(timeoutId2);
            if (tooltipRef.current) {
                tooltipRef.current.style.opacity = '0';
            }
        };

    }, [showTooltip, berserkerRage, shaperMomentum, shaperFlourish, shaperHoverSection, chaosWeaverHoverSection, chronarchHoverSection, chronarchTimeShards, chronarchTemporalStrain, covenbaneHoverSection, covenbaneHexbreakerCharges, covenbaneAttackCounter, size, minstrelHoverSection, gamblerHoverSection, huntressHoverSection, lunarchHoverSection, fateWeaverHoverSection, falseProphetHoverSection, deathcallerHoverSection, arcanoneerState.showRollTooltip]);

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

    const handleRageBarLeave = () => setShowTooltip(false);


    // Create specialization-specific visual and mechanical configurations for Fate Weaver
    const getFateWeaverConfig = (spec) => {
        const baseConfig = {
            type: 'threads-of-destiny',
            count: 13,
            arrangement: 'horizontal',
            segmentBorder: '#2d1b4e',
            cardSuits: ['Ã¢â„¢Â ', 'Ã¢â„¢Â¥', 'Ã¢â„¢Â¦', 'Ã¢â„¢Â£'],
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
                    crystalSymbols: ['Ã¢â„¢Â ', 'Ã¢â„¢Â¥', 'Ã¢â„¢Â¦', 'Ã¢â„¢Â£'],
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
                    cardSymbols: ['Ã¢â„¢Â ', 'Ã¢â„¢Â¥', 'Ã¢â„¢Â¦', 'Ã¢â„¢Â£'],
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
                    webSymbols: ['Ã¢â„¢Â ', 'Ã¢â„¢Â¥', 'Ã¢â„¢Â¦', 'Ã¢â„¢Â£'],
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
    const modifiedConfig = characterClass === 'Fate Weaver' ? {
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
        // Clear any existing timeout
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }

        // Show tooltip immediately on hover
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        // Clear timeout if mouse leaves before tooltip shows
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
        }
        setShowTooltip(false);
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
                // Arcanoneer "Building Blocks" — handled by external component.
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
            case 'fortune-points-gambling':
                return renderFortunePointsGambling();
            case 'quarry-marks-companion':
                return renderQuarryMarksCompanion();
            case 'ancestral-resonance':
                return renderAncestralResonance();
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
                return <WardenResourceBar classResource={finalClassResource} size={size} config={finalConfig} context={context} isOwner={isOwner} onClassResourceUpdate={onClassResourceUpdate} />;
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

    // Time Shards & Temporal Strain display (Chronarch)
    // CHRONARCH FIX: Read directly from classResource prop
    const renderTimeShardsStrain = () => {
        const shardsMax = chronarchTimeShardsMax;
        const strainMax = chronarchTemporalStrainMax;
        const shardsValue = chronarchTimeShards;
        const strainValue = chronarchTemporalStrain;

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
                <div className="chronarch-single-bar">
                    {/* Time Shards Bar (Left Side) */}
                    <div
                        ref={timeShardsBarRef}
                        className="time-shards-bar"
                            onClick={(e) => {
                            e.stopPropagation();
                            if (!isOwner) return; // SECURITY: Only owner can open menu
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
                        <div className="fluid-bar-container">
                            <div
                                className="fluid-bar-fill"
                                style={{
                                    width: `${(shardsValue / shardsMax) * 100}%`,
                                    background: `linear-gradient(90deg,
                                        ${finalConfig.visual.timeShards.activeColor} 0%,
                                        ${finalConfig.visual.timeShards.activeColor} 70%,
                                        ${finalConfig.visual.timeShards.glowColor} 100%)`,
                                    boxShadow: `0 0 8px ${finalConfig.visual.timeShards.glowColor}`
                                }}
                            />
                        </div>
                        <div className="bar-value">{shardsValue}/{shardsMax}</div>
                    </div>

                    {/* Chronarch Center Divider */}
                    <div className="chronarch-center">
                        <div className="center-ornament">
                            <div className="center-circle"></div>
                            <div className="center-lines">
                                <div className="line line-1"></div>
                                <div className="line line-2"></div>
                                <div className="line line-3"></div>
                                <div className="line line-4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Temporal Strain Bar (Right Side) */}
                    <div
                        ref={temporalStrainBarRef}
                        className={`temporal-strain-bar ${shouldPulse ? 'pulse' : ''} ${shouldFlash ? 'flash' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOwner) return; // SECURITY: Only owner can open menu
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
                        <div className="fluid-bar-container">
                            <div
                                className="fluid-bar-fill"
                                style={{
                                    width: `${(strainValue / strainMax) * 100}%`,
                                    background: `linear-gradient(90deg,
                                        ${strainColor} 0%,
                                        ${strainColor} 70%,
                                        rgba(255, 255, 255, 0.3) 100%)`,
                                    boxShadow: `0 0 8px ${strainColor}`
                                }}
                            />
                        </div>
                        <div className="bar-value" style={{ color: strainColor }}>
                            {strainValue}/{strainMax}
                        </div>
                    </div>

                    {/* Time Shards Adjustment Menu */}
                    {showTimeShardsMenu && timeShardsBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!timeShardsBarRef.current) return '50%';
                                    const rect = timeShardsBarRef.current.getBoundingClientRect();
                                    let hudContainer = timeShardsBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!timeShardsBarRef.current) return '50%';
                                    const rect = timeShardsBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Time Shards: {shardsValue}/{shardsMax}</div>

                                <div className="chronarch-actions">
                                    <div className="chronarch-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(shardsMax, shardsValue + 1);
                                                const amount = newValue - shardsValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Time Shard', amount, true, 'timeShards');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('timeShards', newValue);
                                                }
                                            }}
                                            title="Cast Spell (+1 Shard)"
                                        >
                                            <i className="fas fa-magic"></i>
                                            <span>+1</span>
                                        </button>
                                    </div>
                                    <div className="chronarch-action-row">
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(0, shardsValue - 2);
                                                const amount = shardsValue - newValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Time Shard', amount, false, 'timeShards');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('timeShards', newValue);
                                                }
                                            }}
                                            title="Flux (-2 Shards)"
                                        >
                                            <i className="fas fa-bolt"></i>
                                            <span>-2</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(0, shardsValue - 5);
                                                const amount = shardsValue - newValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Time Shard', amount, false, 'timeShards');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('timeShards', newValue);
                                                }
                                            }}
                                            title="Major (-5 Shards)"
                                        >
                                            <i className="fas fa-fire"></i>
                                            <span>-5</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="chronarch-quick-actions">
                                    <button
                                        onClick={() => {
                                            if (!isOwner) return; // SECURITY: Only owner can modify
                                            const resetAmount = shardsValue;
                                            setShowTimeShardsMenu(false);
                                            if (resetAmount > 0) {
                                                logClassResourceChange('Time Shard', resetAmount, false, 'timeShards');
                                                if (onClassResourceUpdate) onClassResourceUpdate('timeShards', 0);
                                            }
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowTimeShardsMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* Temporal Strain Adjustment Menu */}
                    {showTemporalStrainMenu && temporalStrainBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!temporalStrainBarRef.current) return '50%';
                                    const rect = temporalStrainBarRef.current.getBoundingClientRect();
                                    let hudContainer = temporalStrainBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!temporalStrainBarRef.current) return '50%';
                                    const rect = temporalStrainBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Temporal Strain: {strainValue}/{strainMax}</div>

                                <div className="chronarch-actions">
                                    <div className="chronarch-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(strainMax, strainValue + 1);
                                                const amount = newValue - strainValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Temporal Strain', amount, true, 'temporalStrain');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', newValue);
                                                }
                                            }}
                                            title="Minor Strain (+1)"
                                        >
                                            <i className="fas fa-clock"></i>
                                            <span>+1</span>
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(strainMax, strainValue + 3);
                                                const amount = newValue - strainValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Temporal Strain', amount, true, 'temporalStrain');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', newValue);
                                                }
                                            }}
                                            title="Major Strain (+3)"
                                        >
                                            <i className="fas fa-history"></i>
                                            <span>+3</span>
                                        </button>
                                    </div>
                                    <div className="chronarch-action-row">
                                        <button
                                            className="context-menu-button heal"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(0, strainValue - 1);
                                                const amount = strainValue - newValue;
                                                if (amount > 0) {
                                                    logClassResourceChange('Temporal Strain', amount, false, 'temporalStrain');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', newValue);
                                                }
                                            }}
                                            title="Decay (-1 Strain)"
                                        >
                                            <i className="fas fa-leaf"></i>
                                            <span>-1</span>
                                        </button>
                                        <button
                                            className="context-menu-button danger"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = 10;
                                                const amount = Math.abs(newValue - strainValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Temporal Strain', amount, newValue > strainValue, 'temporalStrain');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', newValue);
                                                }
                                            }}
                                            title="Backlash (Set to 10)"
                                        >
                                            <i className="fas fa-exclamation-triangle"></i>
                                            <span>10</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="chronarch-quick-actions">
                                    <button
                                        onClick={() => {
                                            if (!isOwner) return; // SECURITY: Only owner can modify
                                            const resetAmount = strainValue;
                                            setShowTemporalStrainMenu(false);
                                            if (resetAmount > 0) {
                                                logClassResourceChange('Temporal Strain', resetAmount, false, 'temporalStrain');
                                                if (onClassResourceUpdate) onClassResourceUpdate('temporalStrain', 0);
                                            }
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowTemporalStrainMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            </div>
        );
    };

    // Hexbreaker Charges display (Covenbane)
    const renderHexbreakerCharges = () => {
        const maxCharges = finalConfig.mechanics?.max || 8;
        const chargesValue = covenbaneHexbreakerCharges;
        const attackCounter = covenbaneAttackCounter; // 1, 2, or 3

        // Get passive bonuses based on current charges
        const getPassiveBonuses = (charges) => {
            const bonuses = {
                0: { damage: '0', speed: '+0ft', crit: '20', trueDmg: '0%' },
                1: { damage: '+1d4', speed: '+5ft', crit: '20', trueDmg: '6%' },
                2: { damage: '+1d6', speed: '+10ft', crit: '20', trueDmg: '7%' },
                3: { damage: '+2d6', speed: '+15ft', crit: '19-20', trueDmg: '8%' },
                4: { damage: '+3d6', speed: '+20ft', crit: '19-20', trueDmg: '9%' },
                5: { damage: '+4d6', speed: '+25ft', crit: '18-20', trueDmg: '10%' },
                6: { damage: '+5d6', speed: '+30ft', crit: '18-20', trueDmg: '11%' },
                7: { damage: '+6d6', speed: '+35ft', crit: '17-20', trueDmg: '12%' },
                8: { damage: '+7d6', speed: '+40ft', crit: '17-20', trueDmg: '13%' }
            };
            return bonuses[charges] || bonuses[charges > 8 ? 8 : 0];
        };

        const currentBonuses = getPassiveBonuses(chargesValue);
        const isMaxCharges = chargesValue === maxCharges;

        return (
            <div className={`class-resource-bar hexbreaker-charges ${size}`}>
                <div className="hexbreaker-container">
                    {/* Charges Display */}
                    <div
                        ref={chargesDisplayRef}
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
                                    {i < chargesValue && <span className="charge-icon">{renderIcon(finalConfig.visual.icon)}</span>}
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
                            const newValue = attackCounter === 3 ? 1 : attackCounter + 1;
                            if (onClassResourceUpdate) onClassResourceUpdate('attackCounter', newValue);
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
                    {showChargesMenu && chargesDisplayRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact covenbane-charges-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            onMouseEnter={() => setShowTooltip(false)}
                            onMouseLeave={() => setShowTooltip(false)}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!chargesDisplayRef.current) return '50%';
                                    const rect = chargesDisplayRef.current.getBoundingClientRect();
                                    let hudContainer = chargesDisplayRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!chargesDisplayRef.current) return '50%';
                                    const rect = chargesDisplayRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Hexbreaker Charges: {chargesValue}/{maxCharges}</div>

                                {/* Gain Actions */}
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header">Gain</div>
                                    <div className="covenbane-action-grid">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.min(maxCharges, chargesValue + 1);
                                                const amount = newValue - chargesValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, true, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="+1 Attack Evil Caster"
                                        >
                                            <i className="fas fa-plus"></i> +1
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.min(maxCharges, chargesValue + 1);
                                                const amount = newValue - chargesValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, true, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="+1 Targeted by Spell"
                                        >
                                            <i className="fas fa-plus-circle"></i> +1
                                        </button>
                                    </div>
                                </div>

                                {/* Spend Actions */}
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header">Spend</div>
                                    <div className="covenbane-action-grid four-col">
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.max(0, chargesValue - 1);
                                                const amount = chargesValue - newValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, false, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="-1 Shadow Step"
                                        >
                                            <i className="fas fa-minus"></i> -1
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.max(0, chargesValue - 2);
                                                const amount = chargesValue - newValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, false, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="-2 Curse Eater"
                                        >
                                            <i className="fas fa-minus"></i> -2
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.max(0, chargesValue - 3);
                                                const amount = chargesValue - newValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, false, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="-3 Dark Pursuit"
                                        >
                                            <i className="fas fa-minus"></i> -3
                                        </button>
                                        <button
                                            className="context-menu-button danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newValue = Math.max(0, chargesValue - 6);
                                                const amount = chargesValue - newValue;
                                                // setLocalHexbreakerCharges(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Hexbreaker Charge', amount, false, 'hexbreakerCharges');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', newValue);
                                                }
                                            }}
                                            title="-6 Hexbreaker Fury"
                                        >
                                            <i className="fas fa-star"></i> -6
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="covenbane-quick-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const resetAmount = chargesValue;
                                            // setLocalHexbreakerCharges(0);
                                            setShowChargesMenu(false);
                                            if (resetAmount > 0) {
                                                logClassResourceChange('Hexbreaker Charge', resetAmount, false, 'hexbreakerCharges');
                                                if (onClassResourceUpdate) onClassResourceUpdate('hexbreakerCharges', 0);
                                            }
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                        <span>Reset</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowChargesMenu(false);
                                        }}
                                        className="context-menu-button"
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
            </div>
        );
    };

    // Ascension Paths & Blood Tokens display (Deathcaller)
    const renderAscensionBlood = () => {
        const pathsMax = finalConfig.visual?.ascensionPaths?.max || 7;
        const tokensMax = finalConfig.visual?.bloodTokens?.max || 30;
        const pathsArray = Array.isArray(finalClassResource.stacks) ? finalClassResource.stacks : [true, false, false, false, false, false, false];
        const activePaths = pathsArray.filter(p => p).length;
        const tokensValue = finalClassResource.bloodTokens ?? 0;

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
            const prev = Array.isArray(finalClassResource.stacks) ? finalClassResource.stacks : [true, false, false, false, false, false, false];
            let currentPaths = [...prev];

            // If path is currently inactive, try to activate it
            if (!currentPaths[index]) {
                if (index === 0) {
                    currentPaths[index] = true;
                } else {
                    const allPreviousActive = currentPaths.slice(0, index).every(p => p === true);
                    if (allPreviousActive) {
                        currentPaths[index] = true;
                    }
                }
            }
            // If path is currently active, deactivate it and all subsequent paths
            else {
                for (let i = index; i < currentPaths.length; i++) {
                    currentPaths[i] = false;
                }
            }
            setLocalAscensionPaths(currentPaths);
            if (onClassResourceUpdate) onClassResourceUpdate('stacks', currentPaths);
        };

        // Helper functions for token management
        const addTokens = (amount) => {
            const prev = finalClassResource.bloodTokens ?? 0;
            const newValue = prev + amount;
            setLocalBloodTokens(newValue);
            logClassResourceChange('Blood Token', amount, true, 'bloodTokens');
            if (onClassResourceUpdate) onClassResourceUpdate('bloodTokens', newValue);
        };

        const removeTokens = (amount) => {
            const prev = finalClassResource.bloodTokens ?? 0;
            const newValue = Math.max(prev - amount, 0);
            const actualAmount = prev - newValue;
            if (actualAmount > 0) {
                setLocalBloodTokens(newValue);
                logClassResourceChange('Blood Token', actualAmount, false, 'bloodTokens');
                if (onClassResourceUpdate) onClassResourceUpdate('bloodTokens', newValue);
            }
        };

        const rollDice = (diceCount, diceSize) => {
            let total = 0;
            for (let i = 0; i < diceCount; i++) {
                total += Math.floor(Math.random() * diceSize) + 1;
            }
            return total;
        };

        return (
            <div className={`class-resource-bar ascension-blood ${size} ${context === 'party' ? 'party-context' : ''}`}>
                <div className="revenant-single-bar" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>

                    {/* Ascension Paths (Left) â€” segmented skull cells */}
                    <div
                        ref={pathsBarRef}
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
                        style={{
                            flex: 1,
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            height: size === 'large' ? '20px' : '14px',
                            background: 'rgba(26, 13, 26, 0.2)',
                            border: '1px solid rgba(139, 0, 0, 0.35)',
                            borderRadius: '4px 0 0 4px',
                            padding: '0 4px',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        {Array.from({ length: pathsMax }, (_, i) => {
                            const isActive = pathsArray[i];
                            const pathData = finalConfig.paths[i];
                            return (
                                <div
                                    key={i}
                                    className={`path-indicator ${isActive ? 'active' : 'inactive'}`}
                                    title={pathData ? `${pathData.shortName || pathData.name}` : `Path ${i + 1}`}
                                    style={{
                                        flex: 1,
                                        height: size === 'large' ? '14px' : '10px',
                                        borderRadius: '2px',
                                        backgroundColor: isActive
                                            ? finalConfig.visual.ascensionPaths.activeColor
                                            : finalConfig.visual.ascensionPaths.baseColor,
                                        boxShadow: isActive
                                            ? `0 0 4px ${finalConfig.visual.ascensionPaths.glowColor}`
                                            : 'none',
                                        border: '1px solid rgba(0,0,0,0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {isActive && <span style={{ fontSize: '7px', lineHeight: 1 }}>ðŸ’€</span>}
                                </div>
                            );
                        })}
                        {/* Overlay value */}
                        <div style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', fontSize: '8px', fontWeight: 'bold', color: '#DC143C', textShadow: '0 0 3px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 2, whiteSpace: 'nowrap' }}>
                            {activePaths}/{pathsMax}
                        </div>
                    </div>

                    {/* Center Separator â€” skull */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '11px', color: '#8B0000', textShadow: '0 0 4px rgba(220,20,60,0.5)', margin: '0 1px' }}>ðŸ’€</span>
                    </div>

                    {/* Blood Tokens Bar (Right) â€” fill bar */}
                    <div
                        ref={tokensBarRef}
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
                        style={{
                            flex: 1,
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            height: size === 'large' ? '20px' : '14px',
                            background: 'rgba(45, 10, 10, 0.2)',
                            border: `1px solid rgba(178, 34, 34, 0.35)`,
                            borderRadius: '0 4px 4px 0',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Fill */}
                        <div style={{
                            position: 'absolute', left: 0, top: 0, height: '100%',
                            width: `${tokenPercentage}%`,
                            background: `linear-gradient(90deg, #8B0000 0%, ${tokenColor} 100%)`,
                            opacity: 0.5,
                            transition: 'width 0.2s ease-out',
                        }} />
                        {/* Value label */}
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%', fontSize: '9px', fontWeight: 'bold', color: tokensValue >= 6 ? tokenColor : '#B22222', textShadow: '0 0 3px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}>
                            <span>{tokensValue} BT</span>
                        </div>
                    </div>
                </div>

                    {/* Paths Menu */}
                    {showPathsMenu && pathsBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!pathsBarRef.current) return '50%';
                                    const rect = pathsBarRef.current.getBoundingClientRect();
                                    let hudContainer = pathsBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!pathsBarRef.current) return '50%';
                                    const rect = pathsBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Ascension Paths: {activePaths}/{pathsMax}</div>

                                <div className="deathcaller-paths-grid">
                                    {finalConfig.paths.map((path, i) => {
                                        // Get current paths array - use the one from renderAscensionBlood scope
                                        const currentPaths = Array.isArray(localAscensionPaths) ? localAscensionPaths : [true, false, false, false, false, false, false];

                                        // Path is disabled if: it's not active AND it's not the first path AND the previous path is not active
                                        const isDisabled = !currentPaths[i] && i > 0 && !currentPaths[i - 1];

                                        // Path can be activated if: it's the first path OR all previous paths are active
                                        const canActivate = i === 0 || currentPaths.slice(0, i).every(p => p === true);

                                        return (
                                            <button
                                                key={i}
                                                className={`deathcaller-path-btn ${currentPaths[i] ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    // Only allow toggle if not disabled
                                                    if (isDisabled) {
                                                        return;
                                                    }
                                                    // Call togglePath for enabled paths
                                                    togglePath(i);
                                                }}
                                                title={path.name}
                                                style={{
                                                    opacity: isDisabled ? 0.4 : 1,
                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                    pointerEvents: isDisabled ? 'none' : 'auto'
                                                }}
                                            >
                                                <span className="deathcaller-path-number">{i + 1}</span>
                                                <i className={`fas ${currentPaths[i] ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                                <span className="deathcaller-path-name">{path.shortName || path.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="deathcaller-quick-actions">
                                                                    <button
                                        onClick={() => {
                                            const nextPaths = [false, false, false, false, false, false, false];
                                            setLocalAscensionPaths(nextPaths);
                                            if (onClassResourceUpdate) onClassResourceUpdate('stacks', nextPaths);
                                            setShowPathsMenu(false);
                                        }}
                                        className="context-menu-button"
                                        title="Reset All Paths"
                                    >
                                        <i className="fas fa-undo"></i>
                                        <span>Reset</span>
                                    </button>
                                    <button
                                        onClick={() => setShowPathsMenu(false)}
                                        className="context-menu-button"
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

                    {/* Tokens Menu */}
                    {showTokensMenu && tokensBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!tokensBarRef.current) return '50%';
                                    const rect = tokensBarRef.current.getBoundingClientRect();
                                    let hudContainer = tokensBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!tokensBarRef.current) return '50%';
                                    const rect = tokensBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Blood Tokens: {tokensValue}/{tokensMax}</div>

                                <div style={{ marginBottom: '6px' }}>
                                    <div className="context-menu-section-header">Gain Tokens</div>
                                    <div className="deathcaller-tokens-grid">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addTokens(rollDice(1, 6));
                                            }}
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+1d6</span>
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addTokens(rollDice(2, 8));
                                            }}
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+2d8</span>
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addTokens(rollDice(4, 10));
                                            }}
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+4d10</span>
                                        </button>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '6px', paddingTop: '6px', borderTop: '1px solid rgba(160, 140, 112, 0.3)' }}>
                                    <div className="context-menu-section-header">Spend Tokens</div>
                                    <div className="deathcaller-tokens-grid">
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTokens(5);
                                            }}
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                            <span>-5</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTokens(10);
                                            }}
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                            <span>-10</span>
                                        </button>
                                    </div>
                                    <button
                                        className="context-menu-button spend danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTokens(tokensValue);
                                        }}
                                        style={{ width: '100%', marginTop: '4px' }}
                                    >
                                        <i className="fas fa-bolt"></i>
                                        <span>Spend All ({tokensValue}d10)</span>
                                    </button>
                                </div>

                                <div className="deathcaller-quick-actions" style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(160, 140, 112, 0.3)' }}>
                                    <button
                                        className="context-menu-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const resetAmount = tokensValue;
                                            setLocalBloodTokens(0);
                                            setShowTokensMenu(false);
                                            if (resetAmount > 0) {
                                                logClassResourceChange('Blood Token', resetAmount, false, 'bloodTokens');
                                                if (onClassResourceUpdate) onClassResourceUpdate('bloodTokens', 0);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-undo"></i>
                                        <span>Reset</span>
                                    </button>
                                    <button
                                        className="context-menu-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowTokensMenu(false);
                                        }}
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
            'Frost': '#00CED1',          // Dark turquoise
            'Lightning': '#FFD700',     // Gold
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
            const newValue = Math.min(localDRP + amount, drpMax);
            const actualAmount = newValue - localDRP;
            setLocalDRP(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('DRP', actualAmount, true, 'drp');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const removeDRP = (amount) => {
            const newValue = Math.max(localDRP - amount, 0);
            const actualAmount = localDRP - newValue;
            setLocalDRP(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('DRP', actualAmount, false, 'drp');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
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
                    <div className="drp-bar-container" ref={drpBarRef} onMouseEnter={handleDRPBarEnter} onMouseLeave={handleDRPBarLeave} onClick={(e) => {
                        e.stopPropagation();
                        setShowDRPMenu(v => !v);
                    }} style={{ cursor: 'pointer' }}>
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

                    {/* Control menu */}
                    {showDRPMenu && drpBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact dreadnaught-drp-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!drpBarRef.current) return '50%';
                                    const rect = drpBarRef.current.getBoundingClientRect();
                                    let hudContainer = drpBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!drpBarRef.current) return '50%';
                                    const rect = drpBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">DRP: {drpValue}/{drpMax}</div>

                                {/* Gain/Spend Actions */}
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header">Adjust</div>
                                    <div className="dreadnaught-action-grid">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addDRP(5);
                                            }}
                                            title="Gain 5 DRP"
                                        >
                                            <i className="fas fa-plus"></i> +5
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addDRP(10);
                                            }}
                                            title="Gain 10 DRP"
                                        >
                                            <i className="fas fa-plus-circle"></i> +10
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeDRP(5);
                                            }}
                                            title="Spend 5 DRP"
                                        >
                                            <i className="fas fa-minus"></i> -5
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeDRP(10);
                                            }}
                                            title="Spend 10 DRP"
                                        >
                                            <i className="fas fa-minus-circle"></i> -10
                                        </button>
                                    </div>
                                </div>

                                {/* Damage Simulation */}
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header">Simulate Damage</div>
                                    <div className="dreadnaught-damage-grid">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                simulateDamage(25);
                                            }}
                                            title="Take 25 Damage (+5 DRP)"
                                        >
                                            <i className="fas fa-heart-broken"></i> 25
                                        </button>
                                        <button
                                            className="context-menu-button danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                simulateDamage(50);
                                            }}
                                            title="Take 50 Damage (+10 DRP)"
                                        >
                                            <i className="fas fa-heart-broken"></i> 50
                                        </button>
                                    </div>
                                </div>

                                {/* Resistance Selection */}
                                {hasPassiveBenefits && (
                                    <div className="context-menu-section">
                                        <div className="context-menu-section-header">Resistance</div>
                                        <select
                                            className="dreadnaught-resistance-select"
                                            value={selectedResistanceType}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                setSelectedResistanceType(e.target.value);
                                            }}
                                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                        >
                                            {Object.keys(damageTypes).map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="dreadnaught-quick-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLocalDRP(0);
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                        <span>Reset</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLocalDRP(drpMax);
                                        }}
                                        className="context-menu-button"
                                        title={`Set to Max (${drpMax})`}
                                    >
                                        <i className="fas fa-maximize"></i>
                                        <span>Max</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDRPMenu(false);
                                        }}
                                        className="context-menu-button"
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
            </div>
        );
    };

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
            setChaosWeaverState(prev => ({
                ...prev,
                localModifiers: Math.min(prev.localModifiers + amount, maxModifiers)
            }));
        };

        const removeModifiers = (amount) => {
            setChaosWeaverState(prev => ({
                ...prev,
                localModifiers: Math.max(prev.localModifiers - amount, 0)
            }));
        };

        const resetModifiers = () => {
            setChaosWeaverState(prev => ({
                ...prev,
                localModifiers: 0
            }));
        };

        const maxModifiersFunc = () => {
            setChaosWeaverState(prev => ({
                ...prev,
                localModifiers: maxModifiers
            }));
        };

        const rollDice = (diceCount, diceSize) => {
            let total = 0;
            for (let i = 0; i < diceCount; i++) {
                total += Math.floor(Math.random() * diceSize) + 1;
            }
            return total;
        };

        // For small size (HUD), show compact bar with controls
        if (size === 'small' || size === 'normal') {
            return (
                <div
                    className={`class-resource-bar mayhem-modifiers-display ${size}`}
                >
                    <div className="mayhem-bar-wrapper">
                        {showModifierMenu && mayhemBarRef.current && ReactDOM.createPortal(
                            <div
                                className={`unified-context-menu compact ${context === 'party' ? 'chronarch-party' : ''}`}
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
                                    <div className="menu-title">Mayhem Modifiers: {modifierCount}/{maxModifiers}</div>

                                    <div className="context-menu-section">
                                        <div className="context-menu-section-title">Adjust</div>
                                        <div className="menu-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                            <button className="context-menu-button" onClick={() => addModifiers(1)}>
                                                <i className="fas fa-plus"></i>
                                                <span>1</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => removeModifiers(1)}>
                                                <i className="fas fa-minus"></i>
                                                <span>1</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => addModifiers(5)}>
                                                <i className="fas fa-plus"></i>
                                                <span>5</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => removeModifiers(5)}>
                                                <i className="fas fa-minus"></i>
                                                <span>5</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="context-menu-section">
                                        <div className="context-menu-section-title">Random</div>
                                        <div className="menu-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                                            <button className="context-menu-button" onClick={() => addModifiers(rollDice(1, 4))}>
                                                <i className="fas fa-dice"></i>
                                                <span>1d4</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => addModifiers(rollDice(2, 4))}>
                                                <i className="fas fa-dice"></i>
                                                <span>2d4</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="menu-buttons">
                                        <button className="context-menu-button" onClick={maxModifiersFunc}>
                                            <i className="fas fa-maximize"></i>
                                            <span>Set to Max</span>
                                        </button>
                                        <button className="context-menu-button" onClick={() => { resetModifiers(); setShowModifierMenu(false); }}>
                                            <i className="fas fa-undo"></i>
                                            <span>Reset to 0</span>
                                        </button>
                                    </div>

                                    <button className="menu-reset" onClick={() => setShowModifierMenu(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>,
                            document.body
                        )}

                        <div
                            ref={mayhemBarRef}
                            className="mayhem-bar-container-hud"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowModifierMenu(v => !v);
                            }}
                            style={{ cursor: 'pointer' }}
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
                            <div
                                className="mayhem-bar-background"
                            >
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
                            <span className="mayhem-icon">{finalConfig.visual?.icon ? <i className={finalConfig.visual.icon}></i> : null}</span>
                            <span className="mayhem-count">{modifierCount}/{maxModifiers}</span>
                        </div>
                    </div>

                    {size === 'large' && (
                        <div className="mayhem-controls">
                            <button
                                className="context-menu-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModifierMenu(v => !v);
                                }}
                                title="Adjust Mayhem Modifiers"
                            >
                                <i className="fas fa-sliders-h"></i>
                            </button>

                            {showModifierMenu && mayhemBarRef.current && ReactDOM.createPortal(
                                <div
                                    className={`unified-context-menu compact ${context === 'party' ? 'chronarch-party' : ''}`}
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
                                        <div className="menu-title">Mayhem Control: {modifierCount}/{maxModifiers}</div>
                                        <div className="context-menu-section">
                                            <div className="context-menu-section-title">Adjust</div>
                                            <div className="menu-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                                <button className="context-menu-button" onClick={() => addModifiers(1)}>
                                                    <i className="fas fa-plus"></i>
                                                    <span>1</span>
                                                </button>
                                                <button className="context-menu-button" onClick={() => removeModifiers(1)}>
                                                    <i className="fas fa-minus"></i>
                                                    <span>1</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="context-menu-section">
                                            <div className="context-menu-section-title">Random</div>
                                            <div className="menu-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                                                <button className="context-menu-button" onClick={() => addModifiers(rollDice(1, 4))}>
                                                    <i className="fas fa-dice"></i>
                                                    <span>1d4</span>
                                                </button>
                                                <button className="context-menu-button" onClick={() => addModifiers(rollDice(2, 4))}>
                                                    <i className="fas fa-dice"></i>
                                                    <span>2d4</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="menu-buttons">
                                            <button className="context-menu-button" onClick={maxModifiersFunc}>
                                                <i className="fas fa-maximize"></i>
                                                <span>Set to Max</span>
                                            </button>
                                            <button className="context-menu-button" onClick={() => { resetModifiers(); setShowModifierMenu(false); }}>
                                                <i className="fas fa-undo"></i>
                                                <span>Reset to 0</span>
                                            </button>
                                        </div>
                                        <button className="menu-reset" onClick={() => setShowModifierMenu(false)}>
                                            Close
                                        </button>
                                    </div>
                                </div>,
                                document.body
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Card deck display (Fate Weaver)
    const renderCardDeck = () => {
        const suits = ['Ã¢â„¢Â ', 'Ã¢â„¢Â¥', 'Ã¢â„¢Â¦', 'Ã¢â„¢Â£'];
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
                            const isRed = suit === 'Ã¢â„¢Â¥' || suit === 'Ã¢â„¢Â¦';
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
                            Ã¢Å“Å¡
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

    // Dominance Die display (Exorcist)
    const renderDominanceDie = () => {
        // Use local state for demo, fallback to classResource
        const currentDemon = boundDemons[selectedDemonIndex];
        const currentDD = currentDemon?.dd ?? localDominanceDie ?? classResource?.current ?? 0;

        // Check if demon slot is empty or escaped
        const isDemonBound = currentDemon && currentDD > 0;

        // Map DD value to percentage (d12=100%, d10=75%, d8=50%, d6=25%, 0=0%)
        const ddToPercentage = (dd) => {
            switch (dd) {
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
            switch (dd) {
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
            if (!currentDemon) return { name: 'No demon bound to this slot', ddLabel: 'Ã¢â‚¬â€' };
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
                    {showDominanceMenu && dominanceBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!dominanceBarRef.current) return '50%';
                                    const rect = dominanceBarRef.current.getBoundingClientRect();
                                    let hudContainer = dominanceBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!dominanceBarRef.current) return '50%';
                                    const rect = dominanceBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">
                                    {isDemonBound ? `${demonName} (DD: ${currentDD}/12)` : `Slot ${selectedDemonIndex + 1}/${boundDemons.length}`}
                                </div>

                                <div className="exorcist-slot-controls">
                                    <button
                                        className="context-menu-button"
                                        onClick={prevDemon}
                                        disabled={boundDemons.length <= 1}
                                        title="Previous Slot"
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <span className="exorcist-slot-display">{selectedDemonIndex + 1}/{boundDemons.length}</span>
                                    <button
                                        className="context-menu-button"
                                        onClick={nextDemon}
                                        disabled={boundDemons.length <= 1}
                                        title="Next Slot"
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>

                                {isDemonBound && (
                                    <div className="exorcist-dominance-controls">
                                        <div className="exorcist-dominance-row">
                                            <button
                                                className="context-menu-button decrease"
                                                onClick={decreaseDD}
                                                disabled={currentDD === 0}
                                                title="Demon Acts (-1 DD)"
                                            >
                                                <i className="fas fa-arrow-down"></i>
                                                <span>-1</span>
                                            </button>
                                            <button
                                                className="context-menu-button increase"
                                                onClick={increaseDD}
                                                disabled={currentDD === 12}
                                                title="Replenish (+1 DD)"
                                            >
                                                <i className="fas fa-arrow-up"></i>
                                                <span>+1</span>
                                            </button>
                                            <button
                                                className="context-menu-button restore"
                                                onClick={restoreDD}
                                                disabled={currentDD === 12}
                                                title="Max Dominance (d12)"
                                            >
                                                <i className="fas fa-redo"></i>
                                                <span>Max</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="exorcist-demon-management">
                                    {!currentDemon || currentDD === 0 ? (
                                        <button
                                            className="context-menu-button"
                                            onClick={() => {
                                                setDemonConfigMode('create');
                                                setDemonConfigInitialData(null);
                                                setShowDemonConfigModal(true);
                                            }}
                                            title="Bind New Demon"
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="context-menu-button"
                                                onClick={() => {
                                                    setDemonConfigMode('edit');
                                                    setDemonConfigInitialData(currentDemon);
                                                    setShowDemonConfigModal(true);
                                                }}
                                                title="Edit Demon"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="context-menu-button danger"
                                                onClick={() => {
                                                    if (window.confirm(`Release ${currentDemon.name}?`)) {
                                                        const updatedDemons = [...boundDemons];
                                                        updatedDemons[selectedDemonIndex] = null;
                                                        setBoundDemons(updatedDemons);
                                                        setLocalDominanceDie(0);
                                                    }
                                                }}
                                                title="Release Demon"
                                            >
                                                <i className="fas fa-unlink"></i>
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="exorcist-slots-controls">
                                    <button
                                        className="context-menu-button"
                                        onClick={() => {
                                            if (boundDemons.length >= 4) {
                                                alert('Maximum 4 demon slots (Demonologist spec)');
                                                return;
                                            }
                                            setBoundDemons([...boundDemons, null]);
                                        }}
                                        disabled={boundDemons.length >= 4}
                                        title={`Add Slot (${boundDemons.length}/4 max)`}
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                    <button
                                        className="context-menu-button danger"
                                        onClick={() => {
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
                                        }}
                                        disabled={boundDemons.length <= 1}
                                        title="Remove Slot"
                                    >
                                        <i className="fas fa-minus"></i>
                                    </button>
                                </div>

                                <div className="exorcist-quick-actions">
                                    <button
                                        onClick={() => setShowDominanceMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
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
            const actualAmount = newValue - currentMadness;
            setLocalMadness(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Madness', actualAmount, true, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const spendMadness = (amount) => {
            const newValue = Math.max(0, currentMadness - amount);
            const actualAmount = currentMadness - newValue;
            setLocalMadness(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Madness', actualAmount, false, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const resetMadness = () => {
            const resetAmount = currentMadness;
            setLocalMadness(0);
            if (resetAmount > 0) {
                logClassResourceChange('Madness', resetAmount, false, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
            }
        };

        const setToConvulsion = () => {
            const newValue = 20;
            const amount = Math.abs(newValue - currentMadness);
            setLocalMadness(newValue);
            if (amount > 0) {
                logClassResourceChange('Madness', amount, newValue > currentMadness, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
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
                    {showMadnessMenu && madnessBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!madnessBarRef.current) return '50%';
                                    const rect = madnessBarRef.current.getBoundingClientRect();
                                    let hudContainer = madnessBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!madnessBarRef.current) return '50%';
                                    const rect = madnessBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Madness: {currentMadness}/{maxMadness}</div>

                                <div className="falseprophet-actions">
                                    <div className="falseprophet-action-row">
                                        <button onClick={() => gainMadness(1)} className="context-menu-button gain" title="Gain 1 Madness">
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                        <button onClick={() => gainMadness(3)} className="context-menu-button gain" title="Gain 1d4 Madness (3)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>+3</span>
                                        </button>
                                        <button onClick={() => gainMadness(4)} className="context-menu-button gain" title="Gain 1d6 Madness (4)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>+4</span>
                                        </button>
                                        <button onClick={() => gainMadness(5)} className="context-menu-button gain" title="Gain 1d8 Madness (5)">
                                            <i className="fas fa-dice-d8"></i>
                                            <span>+5</span>
                                        </button>
                                    </div>
                                    <div className="falseprophet-action-row">
                                        <button onClick={() => spendMadness(1)} className="context-menu-button spend" title="Spend 1 Madness">
                                            <i className="fas fa-minus"></i>
                                            <span>-1</span>
                                        </button>
                                        <button onClick={() => spendMadness(3)} className="context-menu-button spend" title="Spend 1d4 Madness (3)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>-3</span>
                                        </button>
                                        <button onClick={() => spendMadness(4)} className="context-menu-button spend" title="Spend 1d6 Madness (4)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>-4</span>
                                        </button>
                                        <button onClick={() => spendMadness(5)} className="context-menu-button spend" title="Spend 1d8 Madness (5)">
                                            <i className="fas fa-dice-d8"></i>
                                            <span>-5</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="falseprophet-quick-actions">
                                    <button
                                        onClick={() => { resetMadness(); setShowMadnessMenu(false); }}
                                        className="context-menu-button danger"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={setToConvulsion}
                                        className="context-menu-button danger"
                                        title="Set to 20 (Convulsion)"
                                    >
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowMadnessMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            </div>
        );
    };

    // Helper functions for Fate Weaver (defined at component level for tooltip access)
    const getThreadLevel = (threads) => {
        // Standard levels for all specs (max 13)
        if (threads <= 3) return { name: 'Sparse Threads', color: '#9370DB' };
        if (threads <= 6) return { name: 'Woven Strands', color: '#B8860B' };
        if (threads <= 9) return { name: 'Tapestry of Fate', color: '#FFD700' };
        if (threads <= 12) return { name: 'Destiny\'s Web', color: '#FFA500' };
        return { name: 'Fate Mastered', color: '#FFD700' };
    };

    // Threads of Destiny display (Fate Weaver)
    const renderThreadsOfDestiny = () => {
        // Use local state for demo, fallback to classResource
        const currentThreads = localThreads ?? classResource?.current ?? 0;
        const maxThreads = modifiedConfig.mechanics?.max ?? 13;

        const threadLevel = getThreadLevel(currentThreads);

        // Get card suit symbol for segment (cycles through specialization-specific symbols)
        const getCardSuit = (index) => {
            const spec = selectedFateWeaverSpec;
            if (spec === 'fortune-teller') {
                const crystalSymbols = modifiedConfig.visual.crystalSymbols || ['Ã°Å¸â€™Å½', 'Ã°Å¸â€Â®', 'Ã¢Å“Â¨', 'Ã°Å¸Å’Å¸'];
                return crystalSymbols[index % crystalSymbols.length];
            } else if (spec === 'card-master') {
                const cardSymbols = modifiedConfig.visual.cardSymbols || ['Ã°Å¸Æ’Â', 'Ã¢â„¢Â ', 'Ã¢â„¢Â¥', 'Ã¢â„¢Â¦', 'Ã¢â„¢Â£'];
                return cardSymbols[index % cardSymbols.length];
            } else if (spec === 'thread-weaver') {
                const webSymbols = modifiedConfig.visual.webSymbols || ['Ã°Å¸â€¢Â¸Ã¯Â¸Â', 'Ã°Å¸â€¢Â·Ã¯Â¸Â', 'Ã¢Å“Â¨', 'Ã°Å¸Å’Â'];
                return webSymbols[index % webSymbols.length];
            } else {
                const suits = modifiedConfig.visual.cardSuits || ['Ã¢â„¢Â ', 'Ã¢â„¢Â¥', 'Ã¢â„¢Â¦', 'Ã¢â„¢Â£'];
                return suits[index % suits.length];
            }
        };

        // Get segment color based on specialization
        const getSegmentColor = (index) => {
            const spec = selectedFateWeaverSpec;
            switch (spec) {
                case 'fortune-teller':
                    const crystalProgress = index / maxThreads;
                    if (crystalProgress < 0.25) return '#9370DB'; // Medium purple
                    if (crystalProgress < 0.5) return '#BA55D3'; // Medium orchid
                    if (crystalProgress < 0.75) return '#8A2BE2'; // Blue violet
                    return '#DA70D6'; // Orchid
                case 'card-master':
                    const cardProgress = index / maxThreads;
                    if (cardProgress < 0.25) return '#FFD700'; // Gold
                    if (cardProgress < 0.5) return '#F0E68C'; // Pale goldenrod
                    if (cardProgress < 0.75) return '#DAA520'; // Goldenrod
                    return '#FFA500'; // Orange
                case 'thread-weaver':
                    const webProgress = index / maxThreads;
                    if (webProgress < 0.25) return '#FF1493'; // Deep pink
                    if (webProgress < 0.5) return '#FF69B4'; // Hot pink
                    if (webProgress < 0.75) return '#DC143C'; // Crimson
                    return '#FF6347'; // Tomato
                default:
                    const progress = index / maxThreads;
                    if (progress < 0.25) return '#9370DB'; // Medium purple
                    if (progress < 0.5) return '#B8860B'; // Dark goldenrod
                    if (progress < 0.75) return '#FFD700'; // Gold
                    return '#FFA500'; // Orange-gold
            }
        };

        // Adjustment functions
        const gainThreads = (amount) => {
            const newValue = Math.min(maxThreads, currentThreads + amount);
            const actualAmount = newValue - currentThreads;
            setLocalThreads(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Thread', actualAmount, true, 'threads');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const spendThreads = (amount) => {
            const newValue = Math.max(0, currentThreads - amount);
            const actualAmount = currentThreads - newValue;
            setLocalThreads(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Thread', actualAmount, false, 'threads');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const resetThreads = () => {
            setLocalThreads(0);
        };

        const setToMax = () => {
            const maxThreads = modifiedConfig.mechanics?.max ?? 13;
            setLocalThreads(maxThreads);
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
                        {/* Segmented threads bar with specialization symbols */}
                        <div className="threads-segments">
                            {Array.from({ length: maxThreads }, (_, index) => (
                                <div
                                    key={index}
                                    className={`thread-segment ${index < currentThreads ? 'woven' : 'empty'}`}
                                    style={{
                                        backgroundColor: index < currentThreads ? getSegmentColor(index) : modifiedConfig.visual.baseColor,
                                        borderColor: modifiedConfig.visual.segmentBorder,
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
                    {showThreadsMenu && threadsBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!threadsBarRef.current) return '50%';
                                    const rect = threadsBarRef.current.getBoundingClientRect();
                                    // Find the HUD container to position menu below it
                                    let hudContainer = threadsBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!threadsBarRef.current) return '50%';
                                    const rect = threadsBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Threads: {currentThreads}/{maxThreads}</div>

                                <div className="fateweaver-actions">
                                    <div className="fateweaver-action-row">
                                        <button onClick={() => gainThreads(1)} className="context-menu-button gain" title="Gain 1 Thread (Minor Failure)">
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                        <button onClick={() => gainThreads(2)} className="context-menu-button gain" title="Gain 2 Threads (Major Failure)">
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+2</span>
                                        </button>
                                        <button onClick={() => gainThreads(3)} className="context-menu-button gain" title="Gain 3 Threads (Destiny Weaver)">
                                            <i className="fas fa-star"></i>
                                            <span>+3</span>
                                        </button>
                                    </div>
                                    <div className="fateweaver-action-row">
                                        <button onClick={() => spendThreads(2)} className="context-menu-button spend" title="Call Card (-2 Threads)">
                                            <i className="fas fa-hand-sparkles"></i>
                                            <span>-2</span>
                                        </button>
                                        <button onClick={() => spendThreads(3)} className="context-menu-button spend" title="Force Failure (-3 Threads)">
                                            <i className="fas fa-times-circle"></i>
                                            <span>-3</span>
                                        </button>
                                        <button onClick={() => spendThreads(5)} className="context-menu-button spend" title="Force Success (-5 Threads)">
                                            <i className="fas fa-check-circle"></i>
                                            <span>-5</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="fateweaver-specs">
                                    <button
                                        className={`fateweaver-spec-btn ${selectedFateWeaverSpec === 'fortune-teller' ? 'active' : ''}`}
                                        onClick={() => setSelectedFateWeaverSpec('fortune-teller')}
                                        title="Fortune Teller"
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button
                                        className={`fateweaver-spec-btn ${selectedFateWeaverSpec === 'card-master' ? 'active' : ''}`}
                                        onClick={() => setSelectedFateWeaverSpec('card-master')}
                                        title="Card Master"
                                    >
                                        <i className="fas fa-crown"></i>
                                    </button>
                                    <button
                                        className={`fateweaver-spec-btn ${selectedFateWeaverSpec === 'thread-weaver' ? 'active' : ''}`}
                                        onClick={() => setSelectedFateWeaverSpec('thread-weaver')}
                                        title="Thread Weaver"
                                    >
                                        <i className="fas fa-spider"></i>
                                    </button>
                                </div>

                                <div className="fateweaver-quick-actions">
                                    <button onClick={() => { resetThreads(); setShowThreadsMenu(false); }} className="context-menu-button" title="Reset to 0">
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button onClick={setToMax} className="context-menu-button" title={`Set to Max (${modifiedConfig.mechanics?.max ?? 13})`}>
                                        <i className="fas fa-crown"></i>
                                    </button>
                                    <button onClick={() => setShowThreadsMenu(false)} className="context-menu-button" title="Close">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            </div>
        );
    };

    // Wild Instinct Forms rendering removed (Formbender merged into Shaper)

    const renderAncestralResonance = () => {
        const curRes = finalClassResource.current ?? 0;
        const maxRes = finalClassResource.max ?? 20;
        const percentage = Math.min((curRes / maxRes) * 100, 100);

        return (
            <div className={`class-resource-bar ancestral-resonance ${size} ${context === 'party' ? 'party-context' : ''}`}>
                <div
                    ref={resonanceBarRef}
                    className="resonance-bar"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isOwner) setShowResonanceMenu(!showResonanceMenu);
                    }}
                    onMouseEnter={(e) => {
                        if (!showResonanceMenu) {
                            setAnimistHoverSection('resonance');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }
                    }}
                    onMouseLeave={() => {
                        setAnimistHoverSection(null);
                        setShowTooltip(false);
                    }}
                    style={{
                        cursor: isOwner ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        height: size === 'large' ? '20px' : '14px',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '4px',
                        position: 'relative',
                        padding: '0 6px',
                        overflow: 'hidden',
                        width: '100%'
                    }}
                >
                    <div
                        className="resonance-bar-fill"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${percentage}%`,
                            background: 'linear-gradient(90deg, #059669 0%, #10B981 100%)',
                            boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                            opacity: 0.35,
                            transition: 'width 0.2s ease-out'
                        }}
                    />
                    {/* Subtle runic overlay effect */}
                    <div
                        className="runic-glow-overlay"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(52, 211, 153, 0.1) 15px, rgba(52, 211, 153, 0.1) 16px)',
                            pointerEvents: 'none',
                            animation: 'runicPulse 3s infinite ease-in-out'
                        }}
                    />
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '10px', fontWeight: 'bold', color: '#1B5E20' }}>
                        <span>Ancestral Resonance</span>
                        <span>{curRes}/{maxRes} AR</span>
                    </div>
                </div>

                {/* Resonance Adjustment Menu */}
                {showResonanceMenu && resonanceBarRef.current && ReactDOM.createPortal(
                    <div
                        className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                        onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        style={{
                            position: 'fixed',
                            top: (() => {
                                if (!resonanceBarRef.current) return '50%';
                                const rect = resonanceBarRef.current.getBoundingClientRect();
                                let hudContainer = resonanceBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                let hudBottom = rect.bottom;
                                if (hudContainer) {
                                    const hudRect = hudContainer.getBoundingClientRect();
                                    hudBottom = hudRect.bottom;
                                }
                                return hudBottom + 8;
                            })(),
                            left: (() => {
                                if (!resonanceBarRef.current) return '50%';
                                const rect = resonanceBarRef.current.getBoundingClientRect();
                                return rect.left + (rect.width / 2);
                            })(),
                            transform: 'translateX(-50%)',
                            zIndex: 100000
                        }}
                    >
                        <div className="context-menu-main">
                            <div className="menu-title">Resonance Control</div>

                            <div className="context-menu-section">
                                <div className="context-menu-section-header" style={{ color: '#1B5E20', fontSize: '11px', fontWeight: 'bold' }}>
                                    Resonance: {curRes}/{maxRes}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxRes, curRes + 1);
                                            const amount = newValue - curRes;
                                            if (amount > 0) {
                                                logClassResourceChange('Ancestral Resonance', amount, true, 'ancestralResonance');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +1 AR
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxRes, curRes + 5);
                                            const amount = newValue - curRes;
                                            if (amount > 0) {
                                                logClassResourceChange('Ancestral Resonance', amount, true, 'ancestralResonance');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +5 AR
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, curRes - 1);
                                            const amount = curRes - newValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Ancestral Resonance', amount, false, 'ancestralResonance');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -1 AR
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, curRes - 5);
                                            const amount = curRes - newValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Ancestral Resonance', amount, false, 'ancestralResonance');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -5 AR
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
                                    onClick={() => setShowResonanceMenu(false)}
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
    };

    const renderFortunePointsGambling = () => {
        const fpValue = finalClassResource.current ?? localFortunePoints;
        const maxFP = finalClassResource.max ?? 7;
        const riskValue = finalClassResource.risk ?? 0;
        const maxRisk = 13;

        return (
            <div className={`class-resource-bar fortune-points-gambling ${size} ${context === 'party' ? 'party-context' : ''}`}>
                <div className="gambler-single-bar" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>
                    {/* Fortune Points Bar (Left) */}
                    <div
                        ref={fpBarRef}
                        className="fortune-points-bar"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOwner) setShowFPMenu(!showFPMenu);
                        }}
                        onMouseEnter={(e) => {
                            if (!showFPMenu) {
                                setGamblerHoverSection('fp');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                                setShowTooltip(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setGamblerHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            height: size === 'large' ? '20px' : '14px',
                            background: 'rgba(255, 215, 0, 0.05)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: '4px 0 0 4px',
                            position: 'relative',
                            padding: '0 6px',
                            overflow: 'hidden',
                            flex: 1
                        }}
                    >
                        <div
                            className="fp-bar-fill"
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${(fpValue / maxFP) * 100}%`,
                                background: 'linear-gradient(90deg, #D4AF37 0%, #FFD700 100%)',
                                opacity: 0.35,
                                transition: 'width 0.2s ease-out'
                            }}
                        />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%', fontSize: '9px', fontWeight: 'bold', color: '#8B6508', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            <span>{size === 'small' || context === 'party' ? `${fpValue}/${maxFP} FP` : `Fortune: ${fpValue}/${maxFP}`}</span>
                        </div>
                    </div>

                    {/* Center Divider: Gold card/dice symbol */}
                    <div className="gambler-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#8B6508', textShadow: '0 0 4px rgba(255, 215, 0, 0.4)', margin: '0 2px' }}>â™¦</span>
                    </div>

                    {/* Karmic Debt Bar (Right) */}
                    <div
                        className="karmic-debt-bar"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOwner) setShowFPMenu(!showFPMenu);
                        }}
                        onMouseEnter={(e) => {
                            if (!showFPMenu) {
                                setGamblerHoverSection('fp');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                                setShowTooltip(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setGamblerHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            height: size === 'large' ? '20px' : '14px',
                            background: 'rgba(220, 20, 60, 0.05)',
                            border: '1px solid rgba(220, 20, 60, 0.3)',
                            borderRadius: '0 4px 4px 0',
                            position: 'relative',
                            padding: '0 6px',
                            overflow: 'hidden',
                            flex: 1
                        }}
                    >
                        <div
                            className="debt-bar-fill"
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${(riskValue / maxRisk) * 100}%`,
                                background: 'linear-gradient(90deg, #8B0000 0%, #DC143C 100%)',
                                opacity: 0.35,
                                transition: 'width 0.2s ease-out'
                            }}
                        />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%', fontSize: '9px', fontWeight: 'bold', color: '#B71C1C', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            <span>{size === 'small' || context === 'party' ? `${riskValue}/${maxRisk} Debt` : `Debt: ${riskValue}/${maxRisk}`}</span>
                        </div>
                    </div>
                </div>

                {/* FP & Debt Adjustment Menu */}
                {showFPMenu && fpBarRef.current && ReactDOM.createPortal(
                    <div
                        className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                        onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        style={{
                            position: 'fixed',
                            top: (() => {
                                if (!fpBarRef.current) return '50%';
                                const rect = fpBarRef.current.getBoundingClientRect();
                                let hudContainer = fpBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                let hudBottom = rect.bottom;
                                if (hudContainer) {
                                    const hudRect = hudContainer.getBoundingClientRect();
                                    hudBottom = hudRect.bottom;
                                }
                                return hudBottom + 8;
                            })(),
                            left: (() => {
                                if (!fpBarRef.current) return '50%';
                                const rect = fpBarRef.current.getBoundingClientRect();
                                return rect.left + (rect.width / 2);
                            })(),
                            transform: 'translateX(-50%)',
                            zIndex: 100000
                        }}
                    >
                        <div className="context-menu-main">
                            <div className="menu-title">Gambit Ledger</div>

                            {/* Fortune Points Section */}
                            <div className="context-menu-section">
                                <div className="context-menu-section-header" style={{ color: '#8B6508', fontSize: '11px', fontWeight: 'bold' }}>
                                    Fortune Points: {fpValue}/{maxFP}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxFP, fpValue + 1);
                                            const amount = newValue - fpValue;
                                            setLocalFortunePoints(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Fortune Point', amount, true, 'fortunePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +1 FP
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxFP, fpValue + 2);
                                            const amount = newValue - fpValue;
                                            setLocalFortunePoints(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Fortune Point', amount, true, 'fortunePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +2 FP
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, fpValue - 1);
                                            const amount = fpValue - newValue;
                                            setLocalFortunePoints(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Fortune Point', amount, false, 'fortunePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -1 FP
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, fpValue - 3);
                                            const amount = fpValue - newValue;
                                            setLocalFortunePoints(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Fortune Point', amount, false, 'fortunePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -3 FP
                                    </button>
                                </div>
                            </div>

                            {/* Karmic Debt Section */}
                            <div className="context-menu-section" style={{ marginTop: '8px' }}>
                                <div className="context-menu-section-header" style={{ color: '#B71C1C', fontSize: '11px', fontWeight: 'bold' }}>
                                    Karmic Debt: {riskValue}/{maxRisk}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button spend"
                                        style={{ borderColor: 'rgba(220, 20, 60, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.min(maxRisk, riskValue + 1);
                                            const amount = newValue - riskValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Karmic Debt', amount, true, 'risk');
                                                if (onClassResourceUpdate) onClassResourceUpdate('risk', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +1 Debt
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        style={{ borderColor: 'rgba(220, 20, 60, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.min(maxRisk, riskValue + 3);
                                            const amount = newValue - riskValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Karmic Debt', amount, true, 'risk');
                                                if (onClassResourceUpdate) onClassResourceUpdate('risk', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +3 Debt
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        style={{ borderColor: 'rgba(46, 125, 50, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.max(0, riskValue - 1);
                                            const amount = riskValue - newValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Karmic Debt', amount, false, 'risk');
                                                if (onClassResourceUpdate) onClassResourceUpdate('risk', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -1 Debt
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        style={{ borderColor: 'rgba(46, 125, 50, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.max(0, riskValue - 3);
                                            const amount = riskValue - newValue;
                                            if (amount > 0) {
                                                logClassResourceChange('Karmic Debt', amount, false, 'risk');
                                                if (onClassResourceUpdate) onClassResourceUpdate('risk', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -3 Debt
                                    </button>
                                </div>
                            </div>

                            <div className="gambler-quick-actions" style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                <button
                                    onClick={() => {
                                        setLocalFortunePoints(0);
                                        if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                    }}
                                    className="context-menu-button"
                                    title="Reset FP to 0"
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-undo"></i> Reset FP
                                </button>
                                <button
                                    onClick={() => {
                                        if (onClassResourceUpdate) onClassResourceUpdate('risk', 0);
                                    }}
                                    className="context-menu-button"
                                    title="Reset Debt to 0"
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-eraser"></i> Clear Debt
                                </button>
                                <button
                                    onClick={() => setShowFPMenu(false)}
                                    className="context-menu-button danger"
                                    title="Close"
                                    style={{ padding: '0 12px' }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        );
    };

    // Quarry Marks & Companion (Huntress)
    const renderQuarryMarksCompanion = () => {
        const specs = finalConfig.visual?.quarryMarks || {};
        const maxQM = finalClassResource.max ?? 5;
        const qmValue = Math.min(finalClassResource.current ?? localQuarryMarks, maxQM);
        const specColor = '#DC143C';
        const specGlow = '#FF6B6B';
        const specIcon = 'fa-khanda';

        // Companion info
        const companionHPValue = finalClassResource.companionHP ?? companionHP;
        const companionMaxHPValue = finalClassResource.companionMaxHP ?? companionMaxHP;
        const companionHPPercent = (companionHPValue / companionMaxHPValue) * 100;

        // Get companion HP bar color
        const getCompanionHPColor = () => {
            if (companionHPPercent > 60) return '#2E7D32'; // Green
            if (companionHPPercent > 30) return '#C67100'; // Dark Yellow/Gold
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

        return (
            <div className={`class-resource-bar quarry-marks-companion ${size}`}>
                <div className="huntress-single-bar" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '4px' }}>
                    {/* Quarry Marks Bar (Left) */}
                    <div
                        className="qm-bar-wrapper"
                        ref={qmBarRef}
                        onClick={handleBarClick}
                        onMouseEnter={(e) => {
                            if (!showQMMenu) {
                                setHuntressHoverSection('marks');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                                setShowTooltip(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setHuntressHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{ cursor: isOwner ? 'pointer' : 'default', flex: 1 }}
                    >
                        {/* Segmented Quarry Marks */}
                        <div
                            className="qm-segments"
                            style={{ display: 'flex', gap: '2px', width: '100%' }}
                        >
                            {Array.from({ length: maxQM }, (_, index) => (
                                <div
                                    key={index}
                                    className={`qm-segment ${index < qmValue ? 'filled' : 'empty'}`}
                                    style={{
                                        flex: 1,
                                        height: size === 'large' ? '18px' : '12px',
                                        backgroundColor: index < qmValue ? specColor : 'rgba(26, 15, 8, 0.15)',
                                        border: '1px solid #4A2C1A',
                                        borderRadius: '3px',
                                        boxShadow: index < qmValue ? `0 0 6px ${specGlow}` : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {index < qmValue && (
                                        <i className="fas fa-khanda" style={{ color: '#FFF', fontSize: '8px' }}></i>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Center Divider: Paw icon */}
                    <div className="huntress-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-paw" style={{ color: '#4A2C1A', fontSize: '10px', opacity: 0.7, margin: '0 2px' }}></i>
                    </div>

                    {/* Companion HP Bar (Right) */}
                    <div
                        className="companion-hp-bar"
                        onClick={handleBarClick}
                        onMouseEnter={(e) => {
                            if (!showQMMenu) {
                                setHuntressHoverSection('companion');
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                                setShowTooltip(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setHuntressHoverSection(null);
                            setShowTooltip(false);
                        }}
                        style={{
                            flex: 1,
                            cursor: isOwner ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            height: size === 'large' ? '18px' : '12px',
                            background: 'rgba(34, 197, 94, 0.05)',
                            border: '1px solid #4A2C1A',
                            borderRadius: '4px',
                            position: 'relative',
                            padding: '0 6px',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            className="companion-hp-fill"
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${companionHPPercent}%`,
                                background: `linear-gradient(90deg, ${getCompanionHPColor()} 0%, #22C55E 100%)`,
                                opacity: 0.25,
                                transition: 'width 0.2s ease-out'
                            }}
                        />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%', fontSize: '9px', fontWeight: 'bold', color: '#1B5E20', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            <span>{size === 'small' || context === 'party' ? `${companionHPValue}/${companionMaxHPValue} HP` : `Comp: ${companionHPValue}/${companionMaxHPValue}`}</span>
                        </div>
                    </div>
                </div>

                {/* QM & Companion HP Adjustment Menu */}
                {showQMMenu && qmBarRef.current && ReactDOM.createPortal(
                    <div
                        className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                        onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                        style={{
                            position: 'fixed',
                            top: (() => {
                                if (!qmBarRef.current) return '50%';
                                const rect = qmBarRef.current.getBoundingClientRect();
                                let hudContainer = qmBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                let hudBottom = rect.bottom;
                                if (hudContainer) {
                                    const hudRect = hudContainer.getBoundingClientRect();
                                    hudBottom = hudRect.bottom;
                                }
                                return hudBottom + 8;
                            })(),
                            left: (() => {
                                if (!qmBarRef.current) return '50%';
                                const rect = qmBarRef.current.getBoundingClientRect();
                                return rect.left + (rect.width / 2);
                            })(),
                            transform: 'translateX(-50%)',
                            zIndex: 100000
                        }}
                    >
                        <div className="context-menu-main">
                            <div className="menu-title">Apex Hunting Ledger</div>

                            {/* Quarry Marks Section */}
                            <div className="context-menu-section">
                                <div className="context-menu-section-header" style={{ color: specColor, fontSize: '11px', fontWeight: 'bold' }}>
                                    Quarry Marks: {qmValue}/{maxQM}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxQM, qmValue + 1);
                                            const amount = newValue - qmValue;
                                            setLocalQuarryMarks(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Quarry Mark', amount, true, 'quarryMarks');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +1 Mark
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        onClick={() => {
                                            const newValue = Math.min(maxQM, qmValue + 2);
                                            const amount = newValue - qmValue;
                                            setLocalQuarryMarks(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Quarry Mark', amount, true, 'quarryMarks');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +2 Marks
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, qmValue - 1);
                                            const amount = qmValue - newValue;
                                            setLocalQuarryMarks(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Quarry Mark', amount, false, 'quarryMarks');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -1 Mark
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        onClick={() => {
                                            const newValue = Math.max(0, qmValue - 2);
                                            const amount = qmValue - newValue;
                                            setLocalQuarryMarks(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Quarry Mark', amount, false, 'quarryMarks');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -2 Marks
                                    </button>
                                </div>
                            </div>

                            {/* Companion HP Section */}
                            <div className="context-menu-section" style={{ marginTop: '8px', borderTop: '1px solid rgba(160, 140, 112, 0.3)', paddingTop: '8px' }}>
                                <div className="context-menu-section-header" style={{ color: getCompanionHPColor(), fontSize: '11px', fontWeight: 'bold' }}>
                                    Companion HP: {companionHPValue}/{companionMaxHPValue}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                    <button
                                        className="context-menu-button gain"
                                        style={{ borderColor: 'rgba(46, 125, 50, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.min(companionMaxHPValue, companionHPValue + 5);
                                            const amount = newValue - companionHPValue;
                                            setLocalCompanionHP(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Companion HP', amount, true, 'companionHP');
                                                if (onClassResourceUpdate) onClassResourceUpdate('companionHP', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus"></i> +5 HP
                                    </button>
                                    <button
                                        className="context-menu-button gain"
                                        style={{ borderColor: 'rgba(46, 125, 50, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.min(companionMaxHPValue, companionHPValue + 10);
                                            const amount = newValue - companionHPValue;
                                            setLocalCompanionHP(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Companion HP', amount, true, 'companionHP');
                                                if (onClassResourceUpdate) onClassResourceUpdate('companionHP', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-plus-circle"></i> +10 HP
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        style={{ borderColor: 'rgba(220, 20, 60, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.max(0, companionHPValue - 5);
                                            const amount = companionHPValue - newValue;
                                            setLocalCompanionHP(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Companion HP', amount, false, 'companionHP');
                                                if (onClassResourceUpdate) onClassResourceUpdate('companionHP', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus"></i> -5 HP
                                    </button>
                                    <button
                                        className="context-menu-button spend"
                                        style={{ borderColor: 'rgba(220, 20, 60, 0.5)' }}
                                        onClick={() => {
                                            const newValue = Math.max(0, companionHPValue - 10);
                                            const amount = companionHPValue - newValue;
                                            setLocalCompanionHP(newValue);
                                            if (amount > 0) {
                                                logClassResourceChange('Companion HP', amount, false, 'companionHP');
                                                if (onClassResourceUpdate) onClassResourceUpdate('companionHP', newValue);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-minus-circle"></i> -10 HP
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                <button
                                    onClick={() => {
                                        setLocalQuarryMarks(0);
                                        if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                    }}
                                    className="context-menu-button"
                                    style={{ flex: 1 }}
                                    title="Reset Marks"
                                >
                                    <i className="fas fa-undo"></i> Reset Marks
                                </button>
                                <button
                                    onClick={() => setShowQMMenu(false)}
                                    className="context-menu-button close"
                                    style={{ flex: 1 }}
                                    title="Close"
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


        const handleBarLeave = () => {
            if (showPhylacteryMenu) return;
            setLichborneHoverSection(null);
            setShowTooltip(false);
        };

        const handleAdjustPhylactery = (amount) => {
            const newValue = Math.max(0, Math.min(maxPhylactery, phylacteryValue + amount));
            const actualAmount = Math.abs(newValue - phylacteryValue);
            setLocalPhylacteryHP(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Phylactery HP', actualAmount, amount > 0, 'phylacteryHP');
                if (onClassResourceUpdate) onClassResourceUpdate('phylacteryHP', newValue);
            }
        };

        const handleToggleAura = () => {
            setEternalFrostActive(!auraActive);
        };

        // Get spec passive description
        const getSpecPassive = () => {
            switch (lichborneSpec) {
                case 'frostbound_tyrant':
                    return 'Freeze effects last +1d4 rounds. Frozen enemies take +1d6 damage. 50% Shatter chance on hit (3d6 burst, ends freeze).';
                case 'spectral_reaper':
                    return 'Frost spells deal +1d6 necrotic. Every kill raises a spectral minion (max 4). Minions: 10 HP, 1d6 dmg/turn.';
                case 'phylactery_guardian':
                    return 'Phylactery stores 75 HP. Death Trigger freeze radius 25ft (vs 15ft).';
                default:
                    return '';
            }
        };

        return (
            <div className={`class-resource-bar eternal-frost-phylactery ${size}`}>
                <div className="lichborne-container">
                    {/* Phylactery Bar */}
                    <div className="phylactery-bar-wrapper" ref={phylacteryBarRef}>
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
                    {showPhylacteryMenu && phylacteryBarRef.current && ReactDOM.createPortal(
                        <div
                            className="unified-context-menu compact"
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!phylacteryBarRef.current) return '50%';
                                    const rect = phylacteryBarRef.current.getBoundingClientRect();
                                    let hudContainer = phylacteryBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!phylacteryBarRef.current) return '50%';
                                    const rect = phylacteryBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header" style={{ fontSize: '10px', marginBottom: '6px' }}>
                                        Phylactery HP: {phylacteryValue}/{maxPhylactery}
                                    </div>

                                    {/* Adjust HP */}
                                    <div className="action-row" style={{ marginBottom: '6px' }}>
                                        <button className="context-menu-button spend" onClick={() => handleAdjustPhylactery(-10)} title="-10 HP">
                                            <i className="fas fa-minus"></i> -10
                                        </button>
                                        <button className="context-menu-button spend" onClick={() => handleAdjustPhylactery(-5)} title="-5 HP">
                                            <i className="fas fa-minus"></i> -5
                                        </button>
                                        <button className="context-menu-button gain" onClick={() => handleAdjustPhylactery(5)} title="+5 HP">
                                            <i className="fas fa-plus"></i> +5
                                        </button>
                                        <button className="context-menu-button gain" onClick={() => handleAdjustPhylactery(10)} title="+10 HP">
                                            <i className="fas fa-plus"></i> +10
                                        </button>
                                    </div>

                                    {/* Eternal Frost Aura */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <div style={{ fontSize: '9px', color: '#8b7355', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Eternal Frost Aura
                                        </div>
                                        <button
                                            className={`context-menu-button ${auraActive ? 'active' : ''}`}
                                            onClick={handleToggleAura}
                                            title={auraActive ? 'Aura Mode: Spells cost HP instead of Mana, +1d6 frost damage, chill DC 17, drains HP/turn' : 'Normal Mode: Spells cost Mana'}
                                        >
                                            <i className={`fas ${auraActive ? 'fa-snowflake' : 'fa-circle'}`}></i> {auraActive ? 'ON' : 'OFF'}
                                        </button>
                                    </div>

                                    {/* Specialization Selector - Icon Only */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                                            {Object.entries(specs)
                                                .filter(([key]) => key !== 'type' && key !== 'arrangement' && key !== 'baseColor' && key !== 'activeColor' && key !== 'glowColor' && key !== 'icon')
                                                .map(([key, spec]) => (
                                                    <button
                                                        key={key}
                                                        className={`context-menu-button spec-option-button ${lichborneSpec === key ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setLichborneSpec(key);
                                                            // Adjust phylactery HP if switching to/from Phylactery Guardian
                                                            if (key === 'phylactery_guardian') {
                                                                // Can now store up to 75
                                                            } else {
                                                                // Cap at 50 if switching away from Phylactery Guardian
                                                                setLocalPhylacteryHP(Math.min(localPhylacteryHP, 50));
                                                            }
                                                        }}
                                                        title={`${spec.name}: ${getSpecPassive()}`}
                                                    >
                                                        <i className={`fas ${spec.icon}`}></i>
                                                    </button>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="action-row" style={{ marginTop: '6px' }}>
                                        <button className="context-menu-button danger" onClick={() => setShowPhylacteryMenu(false)} title="Close">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
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
                <>
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
                                                backgroundColor: isActive ? phaseConfig.color : isPast ? `${phaseConfig.color}60` : 'rgba(139, 69, 19, 0.2)',
                                                borderColor: isActive ? phaseConfig.glow : 'rgba(139, 69, 19, 0.4)',
                                                boxShadow: isActive ? `0 0 12px ${phaseConfig.glow}, inset 0 0 8px ${phaseConfig.glow}` : 'none'
                                            }}
                                        >
                                            <i className={`fas ${phaseConfig.icon}`} style={{
                                                color: isActive ? phaseConfig.glow : isPast ? `${phaseConfig.glow}60` : 'rgba(150, 150, 170, 0.5)',
                                                fontSize: '9px'
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
                    {showLunarPhaseMenu && lunarPhaseBarRef.current && ReactDOM.createPortal(
                        <div
                            className="unified-context-menu compact"
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!lunarPhaseBarRef.current) return '50%';
                                    const rect = lunarPhaseBarRef.current.getBoundingClientRect();
                                    let hudContainer = lunarPhaseBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!lunarPhaseBarRef.current) return '50%';
                                    const rect = lunarPhaseBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header" style={{ fontSize: '10px', marginBottom: '6px' }}>
                                        {currentPhaseConfig.name} - Round {roundsInPhase + 1}/3
                                    </div>

                                    {/* Advance Round */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <button className="context-menu-button" onClick={handleAdvanceRound} title="Advance Round">
                                            <i className="fas fa-forward"></i> Advance
                                        </button>
                                    </div>

                                    {/* Manual Phase Shift */}
                                    <div style={{ marginBottom: '6px' }}>
                                        <div style={{ fontSize: '9px', color: '#8b7355', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Phase Shift (8 Mana)
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3px' }}>
                                            {phaseOrder.map((phase) => {
                                                const phaseConfig = phases[phase];
                                                const bonuses = getPhaseBonuses(phase);
                                                const isCurrentPhase = phase === currentLunarPhase;

                                                return (
                                                    <button
                                                        key={phase}
                                                        className={`context-menu-button ${isCurrentPhase ? 'active' : ''}`}
                                                        onClick={() => !isCurrentPhase && handleManualShift(phase)}
                                                        disabled={isCurrentPhase}
                                                        style={{
                                                            opacity: isCurrentPhase ? 0.5 : 1,
                                                            fontSize: '9px',
                                                            padding: '4px 6px'
                                                        }}
                                                        title={`${phaseConfig.name}: ${bonuses.bonus}`}
                                                    >
                                                        <i className={`fas ${phaseConfig.icon}`} style={{ color: phaseConfig.glow, marginRight: '3px' }}></i>
                                                        <span style={{ fontSize: '8px' }}>{phaseConfig.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>


                                    {/* Quick Actions */}
                                    <div className="action-row" style={{ marginTop: '6px' }}>
                                        <button className="context-menu-button danger" onClick={() => setShowLunarPhaseMenu(false)} title="Close">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </>
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
            // Close all other note menus first
            newMenus.fill(false);
            // Then toggle the clicked menu
            newMenus[noteIndex] = !showNoteMenus[noteIndex];
            setShowNoteMenus(newMenus);
            console.log('Show note menus:', newMenus);
            if (newMenus[noteIndex]) {
                setShowTooltip(false);
                setMinstrelHoverSection(null);
                // Close spec menu when opening note menu
                setShowMinstrelSpecMenu(false);
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
            const oldValue = newNotes[noteIndex];
            newNotes[noteIndex] = Math.max(0, Math.min(maxPerNote, newNotes[noteIndex] + delta));
            const actualAmount = Math.abs(newNotes[noteIndex] - oldValue);
            setLocalNotes(newNotes);
            if (actualAmount > 0) {
                const noteName = finalConfig.visual?.notes?.[noteIndex]?.name || 'Musical Note';
                logClassResourceChange(noteName, actualAmount, delta > 0, 'musicalNotes');
                if (onClassResourceUpdate) onClassResourceUpdate('notes', newNotes);
            }
        };

        const handleNoteReset = (noteIndex) => {
            const newNotes = [...localNotes];
            newNotes[noteIndex] = 0;
            setLocalNotes(newNotes);
        };

        const handleSpecClick = () => {
            setShowMinstrelSpecMenu(!showMinstrelSpecMenu);
            // Close all note menus when opening spec menu
            if (!showMinstrelSpecMenu) {
                setMinstrelState(prev => ({ ...prev, showNoteMenus: [false, false, false, false, false, false, false] }));
            }
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
                                        {showNoteMenus[index] && minstrelBarRef.current && ReactDOM.createPortal(
                                            <div
                                                className="unified-context-menu compact"
                                                onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                                style={{
                                                    position: 'fixed',
                                                    top: (() => {
                                                        if (!minstrelBarRef.current) return '50%';
                                                        const rect = minstrelBarRef.current.getBoundingClientRect();
                                                        let hudContainer = minstrelBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                                        let hudBottom = rect.bottom;
                                                        if (hudContainer) {
                                                            const hudRect = hudContainer.getBoundingClientRect();
                                                            hudBottom = hudRect.bottom;
                                                        }
                                                        return hudBottom + 8;
                                                    })(),
                                                    left: (() => {
                                                        if (!minstrelBarRef.current) return '50%';
                                                        const rect = minstrelBarRef.current.getBoundingClientRect();
                                                        // Position menu relative to the clicked note segment
                                                        const noteWidth = rect.width / notes.length;
                                                        return rect.left + (noteWidth * index) + (noteWidth / 2);
                                                    })(),
                                                    transform: 'translateX(-50%)',
                                                    zIndex: 100000
                                                }}
                                            >
                                                <div className="context-menu-main">
                                                    <div className="context-menu-section">
                                                        <div className="context-menu-section-header" style={{ fontSize: '10px', marginBottom: '6px' }}>
                                                            {note.name} ({note.numeral}): {count}/{maxPerNote}
                                                        </div>

                                                        {/* Adjust Count */}
                                                        <div className="action-row" style={{ marginBottom: '6px' }}>
                                                            <button
                                                                className="context-menu-button spend"
                                                                onClick={() => handleNoteAdjust(index, -1)}
                                                                disabled={count === 0}
                                                                title="-1"
                                                            >
                                                                <i className="fas fa-minus"></i> -1
                                                            </button>
                                                            <button
                                                                className="context-menu-button gain"
                                                                onClick={() => handleNoteAdjust(index, 1)}
                                                                disabled={count === maxPerNote}
                                                                title="+1"
                                                            >
                                                                <i className="fas fa-plus"></i> +1
                                                            </button>
                                                        </div>

                                                        {/* Quick Actions */}
                                                        <div className="action-row" style={{ marginTop: '6px' }}>
                                                            <button className="context-menu-button danger" onClick={() => handleNoteReset(index)} title="Reset to 0">
                                                                <i className="fas fa-undo"></i>
                                                            </button>
                                                            <button className="context-menu-button danger" onClick={() => setShowNoteMenus(prev => ({ ...prev, [index]: false }))} title="Close">
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>,
                                            document.body
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>


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
            const newValue = Math.max(0, Math.min(maxVisions, localVisions + delta));
            const actualAmount = Math.abs(newValue - localVisions);
            setLocalVisions(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Vision', actualAmount, delta > 0, 'visions');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
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
            const newValue = Math.min(maxVisions, localVisions + gain);
            setLocalVisions(newValue);
            if (gain > 0) {
                logClassResourceChange('Vision', gain, true, 'visions');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
            setLastVisionGain(prev => [
                { source: 'Revelation', amount: gain },
                ...prev.slice(0, 2)
            ]);
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

                    </div>

                    {/* Visions Adjustment Menu */}
                    {showVisionsMenu && visionsBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!visionsBarRef.current) return '50%';
                                    const rect = visionsBarRef.current.getBoundingClientRect();
                                    let hudContainer = visionsBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!visionsBarRef.current) return '50%';
                                    const rect = visionsBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Visions: {visionsValue}/{maxVisions}</div>

                                <div className="oracle-specs">
                                    {['seer', 'truthseeker', 'fateseer'].map((spec) => {
                                        const specConfig = specs[spec];
                                        const isSelected = oracleSpec === spec;
                                        return (
                                            <button
                                                key={spec}
                                                className={`oracle-spec-btn ${isSelected ? 'active' : ''}`}
                                                onClick={() => setOracleSpec(spec)}
                                                title={`${specConfig.name}: ${specConfig.theme}`}
                                            >
                                                <i className={`fas ${specConfig.icon}`}></i>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="oracle-adjust-controls">
                                    <div className="oracle-adjust-row">
                                        <button
                                            className="context-menu-button decrease"
                                            onClick={() => handleVisionsAdjust(-1)}
                                            disabled={visionsValue === 0}
                                            title="Decrease Visions (-1)"
                                        >
                                            <i className="fas fa-minus"></i>
                                            <span>-1</span>
                                        </button>
                                        <button
                                            className="context-menu-button increase"
                                            onClick={() => handleVisionsAdjust(1)}
                                            disabled={visionsValue === maxVisions}
                                            title="Increase Visions (+1)"
                                        >
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                    </div>
                                    <div className="oracle-quick-adjust-row">
                                        <button
                                            className="context-menu-button"
                                            onClick={() => {
                                                const resetAmount = visionsValue;
                                                setLocalVisions(0);
                                                if (resetAmount > 0) {
                                                    logClassResourceChange('Vision', resetAmount, false, 'visions');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                                }
                                            }}
                                            title="Clear (0)"
                                        >
                                            <i className="fas fa-eraser"></i>
                                        </button>
                                        <button
                                            className="context-menu-button"
                                            onClick={() => {
                                                const newValue = 3;
                                                const amount = Math.abs(newValue - visionsValue);
                                                setLocalVisions(newValue);
                                                if (amount > 0) {
                                                    logClassResourceChange('Vision', amount, newValue > visionsValue, 'visions');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Reset (3)"
                                        >
                                            <i className="fas fa-undo"></i>
                                        </button>
                                        <button
                                            className="context-menu-button"
                                            onClick={() => {
                                                const gainAmount = maxVisions - visionsValue;
                                                setLocalVisions(maxVisions);
                                                if (gainAmount > 0) {
                                                    logClassResourceChange('Vision', gainAmount, true, 'visions');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', maxVisions);
                                                }
                                            }}
                                            title={`Max (${maxVisions})`}
                                        >
                                            <i className="fas fa-crown"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="oracle-predictions">
                                    <div className="oracle-prediction-row">
                                        <button
                                            className="context-menu-button success"
                                            onClick={() => handlePredictionSuccess('simple')}
                                            title={`Simple (+1${oracleSpec === 'seer' ? '+1' : ''})`}
                                        >
                                            <i className="fas fa-check"></i>
                                            <span>+1</span>
                                        </button>
                                        <button
                                            className="context-menu-button success"
                                            onClick={() => handlePredictionSuccess('moderate')}
                                            title={`Moderate (+2${oracleSpec === 'seer' ? '+1' : ''})`}
                                        >
                                            <i className="fas fa-check-double"></i>
                                            <span>+2</span>
                                        </button>
                                    </div>
                                    <div className="oracle-prediction-row">
                                        <button
                                            className="context-menu-button success"
                                            onClick={() => handlePredictionSuccess('complex')}
                                            title={`Complex (+3${oracleSpec === 'seer' ? '+1' : ''})`}
                                        >
                                            <i className="fas fa-star"></i>
                                            <span>+3</span>
                                        </button>
                                        <button
                                            className="context-menu-button danger"
                                            onClick={handlePredictionFailure}
                                            title="Failed Prediction"
                                        >
                                            <i className="fas fa-times"></i>
                                            <span>Fail</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="oracle-other-actions">
                                    <button
                                        className="context-menu-button special"
                                        onClick={handleRevelation}
                                        title="Revelation (+1 Vision)"
                                    >
                                        <i className="fas fa-lightbulb"></i>
                                        <span>+1</span>
                                    </button>
                                </div>

                                <div className="oracle-quick-actions">
                                    <button
                                        onClick={() => setShowVisionsMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            </div>
        );
    };

    // Helper function to get tooltip header color with better contrast
    const getTooltipHeaderColor = (color) => {
        // Map bright colors to darker versions for better contrast on beige background
        const colorMap = {
            '#FFD700': '#8B6508', // Gold -> DarkGoldenrod
            '#DC143C': '#8B0000', // Crimson -> DarkRed
            '#34D399': '#1B5E20', // Green -> DarkGreen
            '#FF6B6B': '#B71C1C', // Soft Red -> DarkRed
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
                    {showDevotionMenu && devotionBarRef.current && ReactDOM.createPortal(
                        <div
                            className="unified-context-menu compact"
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!devotionBarRef.current) return '50%';
                                    const rect = devotionBarRef.current.getBoundingClientRect();
                                    let hudContainer = devotionBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!devotionBarRef.current) return '50%';
                                    const rect = devotionBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Level {currentLevel}: {currentStage.name}</div>

                                <div className="martyr-level-controls">
                                    <button
                                        className="context-menu-button"
                                        onClick={() => handleLevelChange(currentLevel - 1)}
                                        disabled={currentLevel === 0}
                                        title="Decrease Level"
                                    >
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <span className="martyr-level-display">{currentLevel}/{maxLevel}</span>
                                    <button
                                        className="context-menu-button"
                                        onClick={() => handleLevelChange(currentLevel + 1)}
                                        disabled={currentLevel === maxLevel}
                                        title="Increase Level"
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>

                                <div className="martyr-damage-section">
                                    <div className="martyr-damage-input-row">
                                        <input
                                            type="number"
                                            className="martyr-damage-input"
                                            value={currentDamage}
                                            onChange={(e) => handleDamageChange(parseInt(e.target.value) || 0)}
                                            min="0"
                                            max="150"
                                        />
                                        <div className="martyr-damage-quick-btns">
                                            <button
                                                onClick={() => handleDamageChange(currentDamage + 10)}
                                                className="context-menu-button"
                                                title="Add 10 Damage"
                                            >
                                                +10
                                            </button>
                                            <button
                                                onClick={() => handleDamageChange(currentDamage + 20)}
                                                className="context-menu-button"
                                                title="Add 20 Damage"
                                            >
                                                +20
                                            </button>
                                        </div>
                                    </div>
                                    <div className="martyr-damage-info">
                                        Next: {nextThreshold} ({nextThreshold - currentDamage} needed)
                                    </div>
                                </div>


                                <div className="martyr-quick-actions">
                                    <button
                                        onClick={() => handleDamageChange(0)}
                                        className="context-menu-button"
                                        title="Reset Damage to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowDevotionMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </div>

                {/* Tooltip */}
                {showTooltip && martyrHoverSection === 'devotion' && ReactDOM.createPortal(
                    <div ref={martyrTooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                        <div className="tooltip-header" style={{ color: getTooltipHeaderColor('#9CA3AF') }}>Devotion</div>

                        <div className="tooltip-section">
                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                <strong>Level:</strong> {currentLevel} ({currentStage.name})
                            </div>
                            <div style={{ fontSize: '0.9rem' }}>
                                <strong>Damage:</strong> {currentDamage}/{nextThreshold}
                            </div>
                        </div>

                        <div className="tooltip-divider"></div>

                        <div className="tooltip-section">
                            <div className="tooltip-label">Devotion Management</div>
                            <div className="level-management">
                                <strong>Gain:</strong>
                                <span>Take damage, +1 per Intervene</span>
                                <strong>Spend:</strong>
                                <span>Amplify spells (1-5 levels)</span>
                            </div>
                        </div>

                        {currentLevel > 0 && (
                            <div>
                                <div className="tooltip-divider"></div>
                                <div className="tooltip-section">
                                    <div className="tooltip-label">Level {currentLevel} Passive</div>
                                    <div className="passive-desc">
                                        {currentStage.passive}
                                    </div>
                                </div>
                            </div>
                        )}

                        {specData && (
                            <div>
                                <div className="tooltip-divider"></div>
                                <div className="tooltip-section">
                                    <div className="tooltip-label">{specData.name} Passives</div>
                                    <div className="passive-desc">
                                        <strong>Shared:</strong> {specData.sharedPassive.description}<br />
                                        <strong>Unique:</strong> {specData.uniquePassive.description}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>,
                    document.body
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


    // Rage Bar display (Berserker)
    const renderRageBar = () => {
        const rageValue = berserkerRage;
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
                    <div className="rage-bar-container" ref={rageBarRef} onMouseEnter={handleRageBarEnter} onMouseLeave={handleRageBarLeave} onClick={(e) => {
                        e.stopPropagation();
                        setShowRageMenu((v) => !v);
                    }} style={{ cursor: 'pointer' }}>
                        <ResourceCanvasBar
                            rendererType="rage-bar"
                            size={size}
                            layoutMode="bar"
                            spheres={[]}
                            elements={[]}
                            config={{
                                currentRage: rageValue,
                                maxRage: berserkerRageMax,
                                rageStates: finalConfig.rageStates,
                            }}
                            isOwner={isOwner}
                            style={{ width: '100%' }}
                        />
                    </div>
                    {showRageMenu && rageBarRef.current && ReactDOM.createPortal(
                        <div
                            className="unified-context-menu compact"
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!rageBarRef.current) return '50%';
                                    const rect = rageBarRef.current.getBoundingClientRect();
                                    let hudContainer = rageBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!rageBarRef.current) return '50%';
                                    const rect = rageBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Rage: {rageValue}/100</div>

                                <div className="berserker-actions">
                                    <div className="berserker-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(rageValue + 5, 150);
                                                const amount = newValue - rageValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, true, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Gain 5 Rage"
                                        >
                                            <i className="fas fa-plus"></i>
                                            <span>+5</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(rageValue - 5, 0);
                                                const amount = rageValue - newValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, false, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Spend 5 Rage"
                                        >
                                            <i className="fas fa-minus"></i>
                                            <span>-5</span>
                                        </button>
                                    </div>
                                    <div className="berserker-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(rageValue + 10, 150);
                                                const amount = newValue - rageValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, true, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Gain 10 Rage"
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+10</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(rageValue - 10, 0);
                                                const amount = rageValue - newValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, false, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Spend 10 Rage"
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                            <span>-10</span>
                                        </button>
                                    </div>
                                    <div className="berserker-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.min(rageValue + 20, 150);
                                                const amount = newValue - rageValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, true, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Gain 20 Rage"
                                        >
                                            <i className="fas fa-arrow-up"></i>
                                            <span>+20</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const newValue = Math.max(rageValue - 20, 0);
                                                const amount = rageValue - newValue;
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, false, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                                }
                                            }}
                                            title="Spend 20 Rage"
                                        >
                                            <i className="fas fa-arrow-down"></i>
                                            <span>-20</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="berserker-set-controls">
                                    <input
                                        className="berserker-set-input"
                                        type="number"
                                        min="0"
                                        max="150"
                                        placeholder={`${rageValue}`}
                                        value={rageInputValue}
                                        onChange={(e) => setRageInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (!isOwner) return; // SECURITY: Only owner can modify
                                                const v = parseInt(rageInputValue);
                                                if (!isNaN(v)) {
                                                    const clampedV = Math.max(0, Math.min(v, 150));
                                                    const amount = Math.abs(clampedV - rageValue);
                                                    setRageInputValue('');
                                                    setShowRageMenu(false);
                                                    if (amount > 0) {
                                                        logClassResourceChange('Rage', amount, clampedV > rageValue, 'rage');
                                                        if (onClassResourceUpdate) onClassResourceUpdate('current', clampedV);
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        className="context-menu-button"
                                        onClick={() => {
                                            if (!isOwner) return; // SECURITY: Only owner can modify
                                            const v = parseInt(rageInputValue);
                                            if (!isNaN(v)) {
                                                const clampedV = Math.max(0, Math.min(v, 150));
                                                const amount = Math.abs(clampedV - rageValue);
                                                setRageInputValue('');
                                                setShowRageMenu(false);
                                                if (amount > 0) {
                                                    logClassResourceChange('Rage', amount, clampedV > rageValue, 'rage');
                                                    if (onClassResourceUpdate) onClassResourceUpdate('current', clampedV);
                                                }
                                            }
                                        }}
                                        title="Set Rage Value"
                                    >
                                        <i className="fas fa-check"></i>
                                    </button>
                                </div>

                                <div className="berserker-quick-actions">
                                    <button
                                        onClick={() => setShowRageMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
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

    // Stance Flow display (Shaper) - Icon centered, bars on sides
    const renderStanceFlow = () => {
        // Use actual character resource values for account context, local state for HUD
        const momentumValue = context === 'account'
            ? (finalClassResource?.momentum?.current ?? finalClassResource?.current ?? 0)
            : shaperMomentum;
        const flourishValue = context === 'account'
            ? (finalClassResource?.flourish?.current ?? 0)
            : shaperFlourish;
        const momentumMax = finalConfig.mechanics?.momentum?.max || 20;
        const flourishMax = finalConfig.mechanics?.flourish?.max || 5;
        const momentumPercentage = (momentumValue / momentumMax) * 100;
        const flourishPercentage = (flourishValue / flourishMax) * 100;

        const stances = finalConfig.visual?.stances || {};
        const stanceNetwork = finalConfig.stanceNetwork || {};
        const transitionCosts = finalConfig.transitionCosts || {};

        // Get available transitions from current stance
        let availableTransitions = stanceNetwork[stanceValue] || [];

        // Primal Shadow can enter Void Predator from any stance
        if (selectedSpecialization === 'Primal Shadow' && !availableTransitions.includes('Void Predator')) {
            availableTransitions = [...availableTransitions, 'Void Predator'];
        }

        // Calculate transition cost based on specialization
        const getTransitionCost = (fromStance, toStance) => {
            // Primal Shadow: entering Void Predator from any stance costs 3 Flux
            if (selectedSpecialization === 'Primal Shadow' && toStance === 'Void Predator') {
                return 3;
            }

            let baseCost = transitionCosts[fromStance]?.[toStance] || 2;

            // Apply Flow Master passive: -1 Momentum cost (minimum 1)
            if (selectedSpecialization === 'Flow Master') {
                baseCost = Math.max(1, baseCost - 1);
            }

            return baseCost;
        };

        // Handle stance transition (only for HUD context)
        const transitionToStance = (targetStance) => {
            if (context === 'account' || !availableTransitions.includes(targetStance)) return;

            const cost = getTransitionCost(stanceValue, targetStance);
            if (momentumValue >= cost) {
                if (onClassResourceUpdate) onClassResourceUpdate('momentum', momentumValue - cost);
                setCurrentStance(targetStance);
                setShowStanceMenu(false);
            }
        };

        const currentStanceData = stances[stanceValue] || {};

        // Stance data with detailed bonuses/penalties
        const stanceDetails = {
            'Ataxic Flow': {
                bonuses: ['+2 dodge', '+10 ft movement', 'Advantage on Disengage'],
                penalties: ['No offensive bonuses']
            },
            'Arterial Strike': {
                bonuses: ['+2 attack rolls', 'Expanded crit range'],
                penalties: ['No defensive bonuses']
            },
            'Centrifugal Fury': {
                bonuses: ['Attacks cleave to adjacent enemies', '+5 ft reach'],
                penalties: ['Cannot parry']
            },
            'Deadened Bastion': {
                bonuses: ['Reaction parry', '+20 temp HP', 'Immune to knockback'],
                penalties: ['-15 ft movement', 'Cannot dash']
            },
            'Fluid Apex': {
                bonuses: ['+1 all rolls', 'Can transition to any form (4 Flux)'],
                penalties: ['No stance-specific defensive bonuses']
            },
            'Void Predator': {
                bonuses: ['Advantage on first attack', '+2d6 damage from stealth', '+10 ft movement'],
                penalties: ['Penalties in bright light']
            }
        };

        // Get specialization passive based on selected spec
        const getSpecPassive = () => {
            const passives = {
                'Flow Master': {
                    name: 'Chimeric Current',
                    description: 'All transitions cost 1 less Flux (min 1). Next attack after shift deals +1d6 bonus damage.'
                },
                'Iron Dancer': {
                    name: 'Steely Harvest',
                    description: 'In Arterial Strike or Deadened Bastion: +2 attack, reroll 1s on damage. On killing blow, harvest one trait from enemy for rest of combat at +1 Body Toll.'
                },
                'Primal Shadow': {
                    name: 'Shadow Affinity',
                    description: 'Enter Void Predator from ANY form for 3 Flux. Void Predator: lightly obscured, +1d6 bonus damage. Stealth attacks generate +1 extra Flux and +1 Body Toll.'
                }
            };
            return passives[selectedSpecialization] || passives['Flow Master'];
        };

        return (
            <div className={`class-resource-bar stance-flow ${size}`}>
                <div className="stance-flow-compact">
                    {/* Flux Zone (left) â€” clickable overlay */}
                    <div
                        ref={momentumBarRef}
                        className="shaper-zone-overlay shaper-zone-left"
                        style={{
                            position: 'absolute', left: 0, top: 0,
                            width: 'calc(50% - 14px)', height: '100%',
                            zIndex: 2, cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            if (context === 'account') return;
                            e.stopPropagation();
                            setShowMomentumMenu(!showMomentumMenu);
                            setShowFlourishMenu(false);
                            setShowStanceMenu(false);
                            setShowSpecPassiveMenu(false);
                        }}
                        onMouseEnter={() => { setShaperHoverSection('momentum'); setShowTooltip(true); }}
                        onMouseLeave={() => { setShaperHoverSection(null); setShowTooltip(false); }}
                    />

                    {/* Canvas â€” visual rendering only */}
                    <ResourceCanvasBar
                        rendererType="stance-flow"
                        size={size}
                        layoutMode="multi-zone"
                        spheres={[]}
                        elements={[]}
                        config={{
                            momentum: { current: momentumValue, max: momentumMax },
                            flourish: { current: flourishValue, max: flourishMax },
                            currentStance: stanceValue,
                            stances,
                            transitionCosts,
                            availableTransitions,
                            specialization: selectedSpecialization,
                        }}
                        isOwner={false}
                        style={{ width: '100%' }}
                        onElementHover={(hit) => {
                            if (!hit) {
                                // Only clear if not hovering an overlay
                                return;
                            }
                            if (hit.zone === 'momentum') {
                                setShaperHoverSection('momentum');
                            } else if (hit.zone === 'stance') {
                                setShaperHoverSection('stance');
                            } else if (hit.zone === 'flourish') {
                                setShaperHoverSection('flourish');
                            }
                        }}
                    />

                    {/* Stance Icon Overlay (HTML FA icon on top of canvas glow) */}
                    <div
                        ref={stanceBarRef}
                        className="stance-icon-overlay"
                        onClick={(e) => {
                            if (context === 'account') return;
                            e.stopPropagation();
                            setShowStanceMenu(!showStanceMenu);
                            setShowMomentumMenu(false);
                            setShowFlourishMenu(false);
                            setShowSpecPassiveMenu(false);
                        }}
                        onMouseEnter={(e) => {
                            setShaperHoverSection('stance');
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                            setShowTooltip(true);
                        }}
                        onMouseLeave={() => {
                            setShaperHoverSection(null);
                            setShowTooltip(false);
                        }}
                    >
                        <i className={currentStanceData.icon} style={{ color: currentStanceData.color }}></i>
                    </div>

                    {/* Body Toll Zone (right) â€” clickable overlay */}
                    <div
                        ref={flourishBarRef}
                        className="shaper-zone-overlay shaper-zone-right"
                        style={{
                            position: 'absolute', right: 0, top: 0,
                            width: 'calc(50% - 14px)', height: '100%',
                            zIndex: 2, cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            if (context === 'account') return;
                            e.stopPropagation();
                            setShowFlourishMenu(!showFlourishMenu);
                            setShowMomentumMenu(false);
                            setShowStanceMenu(false);
                            setShowSpecPassiveMenu(false);
                        }}
                        onMouseEnter={() => { setShaperHoverSection('flourish'); setShowTooltip(true); }}
                        onMouseLeave={() => { setShaperHoverSection(null); setShowTooltip(false); }}
                    />

                    {/* Momentum Adjustment Menu */}
                    {showMomentumMenu && momentumBarRef.current && context !== 'account' && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!momentumBarRef.current) return '50%';
                                    const rect = momentumBarRef.current.getBoundingClientRect();
                                    let hudContainer = momentumBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!momentumBarRef.current) return '50%';
                                    const rect = momentumBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Flux: {momentumValue}/{momentumMax}</div>

                                <div className="shaper-actions">
                                    <div className="shaper-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                const newVal = Math.min(momentumMax, momentumValue + 1);
                                                if (onClassResourceUpdate) onClassResourceUpdate('momentum', newVal);
                                            }}
                                            title="Gain 1 Flux (Hit)"
                                        >
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                const newVal = Math.min(momentumMax, momentumValue + 2);
                                                if (onClassResourceUpdate) onClassResourceUpdate('momentum', newVal);
                                            }}
                                            title="Gain 2 Flux (Crit)"
                                        >
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+2</span>
                                        </button>
                                    </div>
                                    <div className="shaper-action-row">
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                const newVal = Math.max(0, momentumValue - 2);
                                                if (onClassResourceUpdate) onClassResourceUpdate('momentum', newVal);
                                            }}
                                            title="Spend 2 Flux (Ability)"
                                        >
                                            <i className="fas fa-minus"></i>
                                            <span>-2</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                const newVal = Math.max(0, momentumValue - 4);
                                                if (onClassResourceUpdate) onClassResourceUpdate('momentum', newVal);
                                            }}
                                            title="Spend 4 Flux (Ability)"
                                        >
                                            <i className="fas fa-minus-circle"></i>
                                            <span>-4</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="shaper-quick-actions">
                                    <button
                                        onClick={() => { 
                                            if (onClassResourceUpdate) onClassResourceUpdate('momentum', 0);
                                            setShowMomentumMenu(false); 
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => { 
                                            if (onClassResourceUpdate) onClassResourceUpdate('momentum', momentumMax);
                                            setShowMomentumMenu(false); 
                                        }}
                                        className="context-menu-button"
                                        title={`Set to Max (${momentumMax})`}
                                    >
                                        <i className="fas fa-crown"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowMomentumMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* Flourish Adjustment Menu */}
                    {showFlourishMenu && flourishBarRef.current && context !== 'account' && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!flourishBarRef.current) return '50%';
                                    const rect = flourishBarRef.current.getBoundingClientRect();
                                    let hudContainer = flourishBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!flourishBarRef.current) return '50%';
                                    const rect = flourishBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Body Toll: {flourishValue}/{flourishMax}</div>

                                <div className="shaper-actions">
                                    <div className="shaper-action-row">
                                        <button
                                            className="context-menu-button gain"
                                            onClick={() => {
                                                const newVal = Math.min(flourishMax, flourishValue + 1);
                                                if (onClassResourceUpdate) onClassResourceUpdate('flourish', newVal);
                                            }}
                                            disabled={flourishValue >= flourishMax}
                                            title="Earn 1 Body Toll"
                                        >
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={() => {
                                                const newVal = Math.max(0, flourishValue - 1);
                                                if (onClassResourceUpdate) onClassResourceUpdate('flourish', newVal);
                                            }}
                                            disabled={flourishValue === 0}
                                            title="Spend 1 Body Toll"
                                        >
                                            <i className="fas fa-minus"></i>
                                            <span>-1</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="shaper-quick-actions">
                                    <button
                                        onClick={() => { 
                                            if (onClassResourceUpdate) onClassResourceUpdate('flourish', 0);
                                            setShowFlourishMenu(false); 
                                        }}
                                        className="context-menu-button"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={() => { 
                                            if (onClassResourceUpdate) onClassResourceUpdate('flourish', flourishMax);
                                            setShowFlourishMenu(false); 
                                        }}
                                        className="context-menu-button"
                                        title={`Set to Max (${flourishMax})`}
                                    >
                                        <i className="fas fa-crown"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowFlourishMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* Stance Transition Menu */}
                    {showStanceMenu && stanceBarRef.current && context !== 'account' && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!stanceBarRef.current) return '50%';
                                    const rect = stanceBarRef.current.getBoundingClientRect();
                                    let hudContainer = stanceBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!stanceBarRef.current) return '50%';
                                    const rect = stanceBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">
                                    {currentStance} ({momentumValue}/{momentumMax})
                                    {selectedSpecialization === 'Flow Master' && (
                                        <div style={{ fontSize: '8px', fontWeight: 500, marginTop: '2px', color: '#3498DB' }}>
                                            Flow Master: -1 Flux cost
                                        </div>
                                    )}
                                    {selectedSpecialization === 'Primal Shadow' && (
                                        <div style={{ fontSize: '8px', fontWeight: 500, marginTop: '2px', color: '#2C3E50' }}>
                                            Primal Shadow: Void Predator (3)
                                        </div>
                                    )}
                                </div>

                                <div className="shaper-stances">
                                    {availableTransitions.map((stanceName) => {
                                        const stanceData = stances[stanceName];
                                        const cost = getTransitionCost(stanceValue, stanceName);
                                        const canAfford = momentumValue >= cost;
                                        const isCurrent = currentStance === stanceName;

                                        return (
                                            <button
                                                key={stanceName}
                                                className={`shaper-stance-btn ${isCurrent ? 'active' : ''}`}
                                                onClick={() => canAfford && transitionToStance(stanceName)}
                                                disabled={!canAfford}
                                                title={`${stanceName} - Cost: ${cost} Flux`}
                                                style={{
                                                    borderColor: stanceData.color,
                                                    opacity: !canAfford ? 0.4 : 1
                                                }}
                                            >
                                                <i className={stanceData.icon} style={{ color: stanceData.color }}></i>
                                                <span className="shaper-stance-name">{stanceName}</span>
                                                <span className="shaper-stance-cost" style={{ color: stanceData.color }}>{cost}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="shaper-quick-actions">
                                    <button
                                        onClick={() => setShowStanceMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                    {/* Specialization Passive Menu disabled */}
                </div>
            </div>
        );
    };

    // Render tooltip (following item tooltip pattern)
    const renderTooltip = () => {
        // Classes that handle their own tooltips don't need finalConfig.tooltip
        const handlesOwnTooltips = finalConfig.visual?.type === 'musical-notes-combo' ||
            finalConfig.visual?.type === 'time-shards-strain' ||
            finalConfig.visual?.type === 'mayhem-gauge' ||
            finalConfig.visual?.type === 'ascension-blood' ||
            finalConfig.visual?.type === 'hexbreaker-charges' ||
            finalConfig.visual?.type === 'madness-gauge' ||
            finalConfig.visual?.type === 'threads-of-destiny' ||
            finalConfig.visual?.type === 'fortune-points-gambling' ||
            finalConfig.visual?.type === 'quarry-marks-companion' ||
            finalConfig.visual?.type === 'lunar-phases' ||
            finalConfig.visual?.type === 'virulence-bar' ||
            finalConfig.visual?.type === 'dual-resource' ||
            finalConfig.visual?.type === 'vengeance-points' ||
            finalConfig.visual?.type === 'ancestral-resonance' ||
            finalConfig.visual?.type === 'dual-omen' ||
            finalConfig.visual?.type === 'inferno-veil' ||
            finalConfig.visual?.type === 'arcane-absorption' ||
            finalConfig.visual?.type === 'devotion-gauge' ||
            finalConfig.visual?.type === 'elemental-spheres';

        // Hide tooltip when menus are open to prevent conflicts
        if (false) return null; // Placeholder: was showWIMenu

        if (!showTooltip) return null;
        if (!handlesOwnTooltips && !finalConfig.tooltip) return null;

        const sphereCount = finalClassResource.spheres?.length || 0;
        const rageState = modifiedConfig.type === 'rage' ? getRageState(finalClassResource.current) : '';

        // Skip tooltip title replacement for classes that handle their own tooltips
        const tooltipTitle = modifiedConfig.tooltip?.title
            ? modifiedConfig.tooltip.title
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
        if (modifiedConfig.type === 'spheres' && finalClassResource.spheres) {
            finalClassResource.spheres.forEach(elementId => {
                const element = finalConfig.elements?.find(el => el.id === elementId);
                if (element) {
                    sphereBreakdown[element.name] = (sphereBreakdown[element.name] || 0) + 1;
                }
            });
        }

        // Check if there's any content to show in the tooltip
        const hasTooltipContent =
            (modifiedConfig.type !== 'rage' && modifiedConfig.type !== 'dual-resource' && modifiedConfig.visual?.type !== 'mayhem-gauge' && modifiedConfig.visual?.type !== 'time-shards-strain' && modifiedConfig.visual?.type !== 'ascension-blood' && modifiedConfig.visual?.type !== 'hexbreaker-charges' && modifiedConfig.visual?.type !== 'madness-gauge' && modifiedConfig.visual?.type !== 'threads-of-destiny' && modifiedConfig.visual?.type !== 'fortune-points-gambling' && modifiedConfig.visual?.type !== 'quarry-marks-companion' && modifiedConfig.visual?.type !== 'musical-notes-combo' && modifiedConfig.visual?.type !== 'vengeance-points' && modifiedConfig.visual?.type !== 'ancestral-resonance' && modifiedConfig.visual?.type !== 'dual-omen' && modifiedConfig.visual?.type !== 'inferno-veil' && modifiedConfig.visual?.type !== 'arcane-absorption' && modifiedConfig.visual?.type !== 'devotion-gauge' && modifiedConfig.visual?.type !== 'lunar-phases' && modifiedConfig.visual?.type !== 'elemental-spheres' && modifiedConfig.tooltip?.description) ||
            (finalConfig.type === 'spheres') ||
            (finalConfig.type === 'dual-resource' && shaperHoverSection) ||
            (finalConfig.visual?.type === 'time-shards-strain' && chronarchHoverSection) ||
            (finalConfig.visual?.type === 'hexbreaker-charges' && covenbaneHoverSection) ||
            (finalConfig.visual?.type === 'ascension-blood' && deathcallerHoverSection) ||
            (finalConfig.visual?.type === 'madness-gauge' && falseProphetHoverSection === 'madness') ||
            (finalConfig.visual?.type === 'threads-of-destiny' && fateWeaverHoverSection) ||
            (finalConfig.visual?.type === 'fortune-points-gambling' && gamblerHoverSection === 'fp') ||
            (finalConfig.visual?.type === 'quarry-marks-companion' && huntressHoverSection) ||
            (finalConfig.visual?.type === 'lunar-phases' && lunarchHoverSection) ||
            (finalConfig.visual?.type === 'mayhem-gauge' && chaosWeaverHoverSection) ||
            (finalConfig.visual?.type === 'ancestral-resonance' && animistHoverSection === 'resonance') ||
            (finalConfig.visual?.type === 'musical-notes-combo' && minstrelHoverSection && minstrelHoverSection.startsWith('note-')) ||
            (finalConfig.type === 'rage' && finalConfig.rageStates);

        if (!hasTooltipContent) {
            return null;
        }

        return (
            <TooltipPortal>
                <div
                    ref={tooltipRef}
                    className="unified-resourcebar-tooltip pathfinder-tooltip"
                    style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                >
                    {modifiedConfig.type !== 'rage' && modifiedConfig.type !== 'dual-resource' && modifiedConfig.visual?.type !== 'mayhem-modifiers' && modifiedConfig.visual?.type !== 'mayhem-gauge' && modifiedConfig.visual?.type !== 'time-shards-strain' && modifiedConfig.visual?.type !== 'ascension-blood' && modifiedConfig.visual?.type !== 'hexbreaker-charges' && modifiedConfig.visual?.type !== 'drp-resilience' && modifiedConfig.visual?.type !== 'dominance-die' && modifiedConfig.visual?.type !== 'madness-gauge' && modifiedConfig.visual?.type !== 'threads-of-destiny' && modifiedConfig.visual?.type !== 'fortune-points-gambling' && modifiedConfig.visual?.type !== 'quarry-marks-companion' && modifiedConfig.visual?.type !== 'musical-notes-combo' && modifiedConfig.visual?.type !== 'prophetic-visions' && modifiedConfig.visual?.type !== 'vengeance-points' && modifiedConfig.visual?.type !== 'eternal-frost-phylactery' && modifiedConfig.visual?.type !== 'ancestral-resonance' && modifiedConfig.tooltip?.description && (
                        <>
                            <div className="tooltip-header">{tooltipTitle || modifiedConfig.visual?.name || 'Class Resource'}</div>
                            <div className="tooltip-section">
                                {modifiedConfig.tooltip.description}
                            </div>
                        </>
                    )}

                    {/* Simple sphere count */}
                    {finalConfig.type === 'spheres' && (
                        <>
                            <div className="tooltip-header">Elemental Spheres</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Banked:</strong> {sphereCount} sphere{sphereCount !== 1 ? 's' : ''} / {finalConfig.mechanics?.max || 12}
                                </div>
                                {sphereCount > 0 && (
                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                        {Object.entries(sphereBreakdown).map(([name, count]) => (
                                            <div key={name}>{name}: {count}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Sphere Management</div>
                                <div className="level-management">
                                    <strong>Generate:</strong>
                                    <span>Roll {activeSpecialization === 'entropy-weaver' ? '5d8' : '4d8'} each turn</span>
                                    <strong>Combine:</strong>
                                    <span>Spend matching spheres to cast spells</span>
                                    <strong>Bank Cap:</strong>
                                    <span>{activeSpecialization === 'sphere-architect' ? 15 : 12} spheres max</span>
                                    <strong>Add:</strong>
                                    <span>Left-click an element orb</span>
                                    <strong>Remove:</strong>
                                    <span>Right-click an active orb</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Shaper Tooltips */}
                    {finalConfig.type === 'dual-resource' && shaperHoverSection && (
                        <div>
                            {shaperHoverSection === 'momentum' && (
                                <>
                                    <div className="tooltip-header">Momentum</div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {shaperMomentum}/20
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Momentum Management</div>
                                        <div className="level-management">
                                            <strong>Gain:</strong>
                                            <span>+1 on hit, +2 on max damage die (crit), +1 on dodge/parry</span>
                                            <strong>Spend:</strong>
                                            <span>2-4 for stance transitions, 3-6 for abilities</span>
                                            <strong>Decay:</strong>
                                            <span>-1 on lowest damage die (miss), -1 when taking damage</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {shaperHoverSection === 'flourish' && (
                                <>
                                    <div className="tooltip-header">Flourish</div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {shaperFlourish}/5
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Flourish Management</div>
                                        <div className="level-management">
                                            <strong>Gain:</strong>
                                            <span>+1 per signature move (each stance has 1 signature move)</span>
                                            <strong>Spend:</strong>
                                            <span>2-5 for ultimate abilities</span>
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(101, 67, 33, 0.8)' }}>
                                            Does not decay - persists between combats
                                        </div>
                                    </div>
                                </>
                            )}

                            {shaperHoverSection === 'stance' && (() => {
                                const stances = finalConfig.visual?.stances || {};
                                const currentStanceData = stances[stanceValue] || {};
                                const details = {
                                    'Ataxic Flow': {
                                        bonuses: ['+2 dodge', '+10 ft movement', 'Advantage on Disengage'],
                                        penalties: ['No offensive bonuses']
                                    },
                                    'Arterial Strike': {
                                        bonuses: ['+2 attack rolls', 'Expanded crit range'],
                                        penalties: ['No defensive bonuses']
                                    },
                                    'Centrifugal Fury': {
                                        bonuses: ['Attacks cleave to adjacent enemies', '+5 ft reach'],
                                        penalties: ['Cannot parry']
                                    },
                                    'Deadened Bastion': {
                                        bonuses: ['Reaction parry', '+20 temp HP', 'Immune to knockback'],
                                        penalties: ['-15 ft movement', 'Cannot dash']
                                    },
                                    'Fluid Apex': {
                                        bonuses: ['+1 all rolls', 'Can transition to any form (4 Flux)'],
                                        penalties: ['No stance-specific defensive bonuses']
                                    },
                                    'Void Predator': {
                                        bonuses: ['Advantage on first attack', '+2d6 damage from stealth', '+10 ft movement'],
                                        penalties: ['Penalties in bright light']
                                    }
                                }[currentStance] || { bonuses: [], penalties: [] };

                                const specBonus = (() => {
                                    if (selectedSpecialization === 'Iron Dancer' && (currentStance === 'Arterial Strike' || currentStance === 'Deadened Bastion')) {
                                        return 'Iron Dancer: +2 attack | Reroll 1s on damage | Harvest traits on kill';
                                    }
                                    return null;
                                })();

                                return (
                                    <>
                                        <div className="tooltip-header">{currentStance}</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Type:</strong> {currentStanceData.type}
                                            </div>
                                            {specBonus && (
                                                <div style={{
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(139, 69, 19, 1)',
                                                    fontStyle: 'italic',
                                                    marginTop: '4px',
                                                    padding: '4px',
                                                    background: 'rgba(160, 82, 45, 0.1)',
                                                    borderRadius: '3px'
                                                }}>
                                                    Ã¢Â­  {specBonus}
                                                </div>
                                            )}
                                        </div>
                                        {details.bonuses.length > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Bonuses</div>
                                                    {details.bonuses.map((bonus, i) => (
                                                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: '2px' }}>{bonus}</div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {details.penalties.length > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Penalties</div>
                                                    {details.penalties.map((penalty, i) => (
                                                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: '2px', color: 'rgba(178, 34, 52, 1)' }}>{penalty}</div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {details.penalties.length === 0 && details.bonuses.length > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Penalties</div>
                                                    <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(101, 67, 33, 0.7)' }}>None</div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Chronarch Time Shards & Temporal Strain Tooltips */}
                    {finalConfig.visual?.type === 'time-shards-strain' && chronarchHoverSection && (
                        <div>
                            {chronarchHoverSection === 'shards' && (
                                <>
                                    <div className="tooltip-header">Time Shards</div>

                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {chronarchTimeShards}/10 shards
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <strong>Power resource:</strong> Accumulate to unleash time magic
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Shard Management</div>
                                        <div className="level-management">
                                            <strong>Gain:</strong>
                                            <span>+1 per spell cast, persists between combats</span>
                                            <strong>Spend:</strong>
                                            <span>Temporal Flux spells (1-10 shards)</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {chronarchHoverSection === 'strain' && (() => {
                                const strainValue = chronarchTemporalStrain;
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
                                        <div className="tooltip-header">Temporal Strain</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {strainValue}/10 ({state.name})
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Risk resource:</strong> Balance power with safety
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Strain Management</div>
                                            <div className="level-management">
                                                <strong>Gain:</strong>
                                                <span>+1 to +5 per Flux ability</span>
                                                <strong>Decay:</strong>
                                                <span>-1 per turn (if no Flux used)</span>
                                            </div>
                                        </div>

                                        {strainValue >= 10 && (
                                            <div>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Temporal Backlash</div>
                                                    <div className="drawback-text">
                                                        Lose next turn, take 4d6 Force damage, strain resets to 0
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {strainValue >= 7 && strainValue < 10 && (
                                            <div>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Warning</div>
                                                    <div className="drawback-text">
                                                        Approaching Backlash threshold!
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Covenbane Hexbreaker Charges Tooltips */}
                    {finalConfig.visual?.type === 'hexbreaker-charges' && covenbaneHoverSection && (
                        <div>
                            {covenbaneHoverSection === 'charges' && (() => {
                                const maxCharges = finalConfig.mechanics?.max || 8;
                                const chargesValue = covenbaneHexbreakerCharges;
                                const getPassiveBonuses = (charges) => {
                                    const bonuses = {
                                        0: { damage: '0', speed: '+0ft', crit: '20', trueDmg: '0%' },
                                        1: { damage: '+1d4', speed: '+5ft', crit: '20', trueDmg: '6%' },
                                        2: { damage: '+1d6', speed: '+10ft', crit: '20', trueDmg: '7%' },
                                        3: { damage: '+2d6', speed: '+15ft', crit: '19-20', trueDmg: '8%' },
                                        4: { damage: '+3d6', speed: '+20ft', crit: '19-20', trueDmg: '9%' },
                                        5: { damage: '+4d6', speed: '+25ft', crit: '18-20', trueDmg: '10%' },
                                        6: { damage: '+5d6', speed: '+30ft', crit: '18-20', trueDmg: '11%' },
                                        7: { damage: '+6d6', speed: '+35ft', crit: '17-20', trueDmg: '12%' },
                                        8: { damage: '+7d6', speed: '+40ft', crit: '17-20', trueDmg: '13%' }
                                    };
                                    return bonuses[charges] || bonuses[charges > 8 ? 8 : 0];
                                };
                                const bonuses = getPassiveBonuses(chargesValue);

                                return (
                                    <>
                                        <div className="tooltip-header">Hexbreaker Charges</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {chargesValue}/{maxCharges} charges
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Passive:</strong> {bonuses.damage} damage, {bonuses.speed} speed
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Charge Management</div>
                                            <div className="level-management">
                                                <strong>Gain:</strong>
                                                <span>Combat abilities and attacks</span>
                                                <strong>Spend:</strong>
                                                <span>Shadow Step (1), Curse Eater (2), Dark Pursuit (3), Fury ({maxCharges})</span>
                                            </div>
                                        </div>

                                        {chargesValue === maxCharges && (
                                            <div>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Ultimate Ready</div>
                                                    <div className="passive-desc">
                                                        Hexbreaker Fury: Spend all {maxCharges} charges for AoE damage and stun.
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </>
                                );
                            })()}

                            {covenbaneHoverSection === 'counter' && (
                                <>
                                    <div className="tooltip-header">Attack Counter</div>

                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {covenbaneAttackCounter}/3 attacks
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <strong>Every 3rd attack:</strong> Deals bonus true damage
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">True Damage Scaling</div>
                                        <div className="passive-desc">
                                            Base: +1d6 true damage<br />
                                            At 6 charges: +4d8 true damage
                                        </div>
                                    </div>

                                    {covenbaneAttackCounter === 3 && (
                                        <>
                                            <div className="tooltip-divider"></div>
                                            <div className="tooltip-section">
                                                <div className="tooltip-label">True Damage Ready</div>
                                                <div className="passive-desc">
                                                    Next attack deals bonus true damage (ignores armor/resistances)
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </>
                            )}
                        </div>
                    )}

                    {/* Deathcaller Ascension Paths & Blood Tokens Tooltips */}
                    {finalConfig.visual?.type === 'ascension-blood' && deathcallerHoverSection && (
                        <div>
                            {deathcallerHoverSection === 'paths' && (() => {
                                const pathsArray = Array.isArray(localAscensionPaths) ? localAscensionPaths : [true, false, false, false, false, false, false];
                                const activePaths = pathsArray.filter(p => p).length;
                                const activePathsList = finalConfig.paths.filter((_, i) => pathsArray[i]);

                                return (
                                    <>
                                        <div className="tooltip-header">Necrotic Ascension</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Active Paths:</strong> {activePaths}/7
                                            </div>
                                        </div>
                                        {activePathsList.length > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Active Boons</div>
                                                    {activePathsList.map((path, i) => (
                                                        <div key={i} style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                            <strong>{path.shortName}:</strong> {path.boon}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Active Curses</div>
                                                    {activePathsList.map((path, i) => (
                                                        <div key={i} style={{ fontSize: '0.85rem', marginTop: '4px', color: '#B71C1C' }}>
                                                            <strong>{path.shortName}:</strong> {path.curse}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {activePathsList.length === 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#4E342E' }}>
                                                        No paths activated yet
                                                    </div>
                                                </div>
                                            </>
                                        )}
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
                                        <div className="tooltip-header">Blood Tokens</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {tokensValue} tokens
                                            </div>
                                        </div>
                                        <div className="tooltip-divider"></div>
                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Token Management</div>
                                            <div className="level-management">
                                                <strong>Gain:</strong>
                                                <span>1 HP sacrificed = 1 Token (requires Crimson Pact path)</span>
                                                <strong>Spend:</strong>
                                                <span>1 Token = +1d6 necrotic damage (can spend multiple per spell)</span>
                                            </div>
                                        </div>
                                        {tokensValue >= dangerThreshold && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label" style={{ color: '#B71C1C' }}>
                                                        EXTREME DANGER!
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                        <strong>Burst Damage:</strong> {burstDamage}d10 damage (~{Math.floor(burstDamage * 5.5)} average)
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                        <strong>Timer:</strong> 10 minutes (15 with Crimson Pact)
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {tokensValue >= warningThreshold && tokensValue < dangerThreshold && (
                                            <div style={{
                                                fontStyle: 'italic',
                                                fontSize: '9px',
                                                textAlign: 'center',
                                                color: '#B71C1C',
                                                marginTop: '6px',
                                                padding: '4px',
                                                background: 'rgba(255, 107, 107, 0.15)',
                                                borderRadius: '3px'
                                            }}>
                                                High token count - use soon or risk burst!
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Dreadnaught DRP Tooltip */}
                    {finalConfig.visual?.type === 'drp-resilience' && dreadnaughtHoverSection === 'drp' && (
                        <>
                            <div className="tooltip-header">Damage Resilience Points</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Current:</strong> {localDRP} DRP
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">DRP Management</div>
                                <div className="level-management">
                                    <strong>Gain:</strong>
                                    <span>+1 DRP per 5 damage taken (calculated from full damage, before resistance)</span>
                                    <strong>Spend:</strong>
                                    <span>Shadow Shield (2:1 absorption), Wraith Strike (+1d6 per 5 DRP), Necrotic Aura (15 DRP)</span>
                                </div>
                            </div>
                            {localDRP >= 10 && (
                                <>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Active Resistance</div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                            <strong>Type:</strong> {selectedResistanceType}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                            Halves damage taken. DRP calculated from full damage.
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Regeneration</div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                            <strong>+{Math.floor(localDRP / 10)} HP/turn</strong> (1 HP per 10 DRP)
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Dark Rebirth</div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                            If you die, revive with <strong>{localDRP * 2} HP</strong>
                                        </div>
                                    </div>
                                </>
                            )}
                            {localDRP < 10 && (
                                <>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#4E342E' }}>
                                            Need <strong>10+ DRP</strong> to activate passive benefits
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Exorcist Dominance Tooltip */}
                    {finalConfig.visual?.type === 'dominance-die' && exorcistHoverSection === 'dominance' && (
                        <div>
                            {(() => {
                                const currentDemon = boundDemons[selectedDemonIndex];
                                const currentDD = currentDemon?.dd ?? localDominanceDie ?? 0;
                                const isDemonBound = currentDemon && currentDD > 0;

                                const getDDState = (dd) => {
                                    switch (dd) {
                                        case 12: return { name: 'Full Control', color: '#8B6508' };
                                        case 10: return { name: 'Good Control', color: '#8B6508' };
                                        case 8: return { name: 'Moderate Risk', color: '#8B6508' };
                                        case 6: return { name: 'High Risk', color: '#8B0000' };
                                        case 0: return { name: 'ESCAPED', color: '#8B0000' };
                                        default: return { name: 'Unknown', color: '#4E342E' };
                                    }
                                };

                                const state = getDDState(currentDD);
                                const ddLabel = currentDD === 0 ? 'ESCAPED' : `d${currentDD}`;

                                // If no demon is bound, show binding instructions
                                if (!isDemonBound) {
                                    return (
                                        <>
                                            <div className="tooltip-header">Dominance Die</div>
                                            <div className="tooltip-section">
                                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                    <strong>Status:</strong> No Demon Bound
                                                </div>
                                            </div>
                                            <div className="tooltip-divider"></div>
                                            <div className="tooltip-section">
                                                <div className="tooltip-label">Binding Ritual</div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    Requires <strong>ritual</strong> (10 min). Target must be <strong>defeated</strong>.
                                                </div>
                                            </div>
                                            <div className="tooltip-divider"></div>
                                            <div className="tooltip-section">
                                                <div className="tooltip-label">Demon Slots</div>
                                                <div className="level-management">
                                                    <strong>Base:</strong>
                                                    <span>2 demons</span>
                                                    <strong>Demonologist:</strong>
                                                    <span>4 demons</span>
                                                    <strong>Demon Lord:</strong>
                                                    <span>1 demon</span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                }

                                return (
                                    <>
                                        <div className="tooltip-header">Dominance Die</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Demon:</strong> {currentDemon.name} (Tier {currentDemon.tier})
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Current DD:</strong> <span style={{ color: state.color, fontWeight: 'bold' }}>{ddLabel}</span> ({state.name})
                                            </div>
                                        </div>
                                        <div className="tooltip-divider"></div>
                                        <div className="tooltip-section">
                                            <div className="tooltip-label">DD Progression</div>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <strong>Progression:</strong> d12 Ã¢â€ â€™ d10 Ã¢â€ â€™ d8 Ã¢â€ â€™ d6 Ã¢â€ â€™ 0
                                            </div>
                                            <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                Decreases per action/hit
                                            </div>
                                        </div>
                                        <div className="tooltip-divider"></div>
                                        <div className="tooltip-section">
                                            <div className="tooltip-label">At DD = 0</div>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <strong>Save DC:</strong> {currentDemon.saveDC}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', marginTop: '4px', color: '#B71C1C' }}>
                                                Fail: Demon escapes
                                            </div>
                                        </div>

                                        {currentDD <= 6 && currentDD > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label" style={{ color: currentDD === 6 ? '#B71C1C' : '#8B6508' }}>
                                                        {currentDD === 6 ? 'CRITICAL - Demon Near Escape!' : 'WARNING - Low Dominance'}
                                                    </div>
                                                    <div className="level-management" style={{ marginTop: '4px' }}>
                                                        <strong>Reassert Dominance:</strong>
                                                        <span>5 mana - Restore to max DD, +1 DD for 3 actions</span>
                                                        <strong>Chain of Command:</strong>
                                                        <span>4 mana - Restore to max DD, +1 DD for 3 actions</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentDD === 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label" style={{ color: '#B71C1C' }}>
                                                        DEMON ESCAPED!
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                        Demon flees or attacks. Must re-bind (ritual).
                                                    </div>
                                                    <div className="level-management" style={{ marginTop: '4px' }}>
                                                        <strong>Behavior (d6):</strong>
                                                        <span>1-2: Flees, 3-6: Attacks you</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* False Prophet Madness Tooltip */}
                    {finalConfig.visual?.type === 'madness-gauge' && falseProphetHoverSection === 'madness' && (
                        <>
                            <div className="tooltip-header">Madness Points</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Current:</strong> {localMadness}/20 ({getDangerLevel(localMadness).name})
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Shadow Damage:</strong> +{localMadness}
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Next Threshold:</strong> {getNextThreshold(localMadness)}
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Madness Management</div>
                                <div className="level-management">
                                    <strong>Gain:</strong>
                                    <span>Spells generate Madness</span>
                                    <strong>Spend:</strong>
                                    <span>Some spells spend Madness</span>
                                    <strong>At 10+:</strong>
                                    <span>Next shadow spell +2d6</span>
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Madness Thresholds</div>
                                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                    <strong>6:</strong> Veil of Shadows
                                </div>
                                <div style={{ fontSize: '0.85rem' }}>
                                    <strong>9:</strong> Eldritch Vision
                                </div>
                                <div style={{ fontSize: '0.85rem' }}>
                                    <strong>10:</strong> Empowerment (+2d6)
                                </div>
                                <div style={{ fontSize: '0.85rem' }}>
                                    <strong>12:</strong> Apocalyptic Revelation
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#B71C1C', marginTop: '4px' }}>
                                    <strong>15:</strong> DANGER ZONE
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#B71C1C' }}>
                                    <strong>20:</strong> INSANITY CONVULSION
                                </div>
                            </div>
                            {localMadness >= 15 && (
                                <>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label" style={{ color: localMadness === 20 ? '#B71C1C' : '#8B6508' }}>
                                            {localMadness === 20 ? 'INSANITY CONVULSION!' : 'HIGH CONVULSION RISK'}
                                        </div>
                                        {localMadness === 20 ? (
                                            <>
                                                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                    Roll 1d6 on Convulsion Table:
                                                </div>
                                                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                    <strong>1:</strong> Shadow Burst (5d6 necrotic AoE)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>2:</strong> Mind Shatter (stunned 2 rounds)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>3:</strong> Dark Whispers (disadvantage 3 rounds)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>4:</strong> Chaotic Pulse (teleport + 4d6 psychic)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>5:</strong> Psychic Scream (AoE fear 3 rounds)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>6:</strong> Nightmare Echoes (6d6 + madness)
                                                </div>
                                                <div style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '4px', color: '#4E342E' }}>
                                                    After Convulsion: Madness resets to 0
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                Approaching Convulsion. Consider spending Madness or avoiding Madness-generating spells.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Fate Weaver Threads Tooltip */}
                    {modifiedConfig.visual?.type === 'threads-of-destiny' && fateWeaverHoverSection === 'threads' && (
                        <>
                            <div className="tooltip-header">Threads of Destiny</div>

                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Current:</strong> {localThreads}/{modifiedConfig.mechanics?.max ?? 13} Threads
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Level:</strong> {getThreadLevel(localThreads).name}
                                </div>
                            </div>

                            <div className="tooltip-divider"></div>

                            <div className="tooltip-section">
                                <div className="tooltip-label">Thread Management</div>
                                <div className="level-management">
                                    <strong>Generate:</strong>
                                    <span>Failures generate Threads</span>
                                    <strong>Spend:</strong>
                                    <span>2 Threads: Call specific card{selectedFateWeaverSpec === 'thread-weaver' && localThreads >= 3 ? ', 3 Threads: Force failure, 5 Threads: Force success' : ''}</span>
                                </div>
                            </div>

                            <div className="tooltip-divider"></div>

                            <div className="tooltip-section">
                                <div className="tooltip-label">Specialization: {selectedFateWeaverSpec === 'fortune-teller' ? 'Fortune Teller' : selectedFateWeaverSpec === 'card-master' ? 'Card Master' : 'Thread Weaver'}</div>
                                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                    {selectedFateWeaverSpec === 'fortune-teller' && 'See top card always. 1 Thread for ally advantage.'}
                                    {selectedFateWeaverSpec === 'card-master' && 'Hold 7 cards. Call 2 cards per 2 Threads.'}
                                    {selectedFateWeaverSpec === 'thread-weaver' && '+1 Thread on all gains. 5T auto-success. 3T auto-fail.'}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Gambit Dual Ledger Tooltip */}
                    {finalConfig.visual?.type === 'fortune-points-gambling' && gamblerHoverSection === 'fp' && (() => {
                        const fpValue = finalClassResource.current ?? localFortunePoints;
                        const maxFP = finalClassResource.max ?? 7;
                        const riskValue = finalClassResource.risk ?? 0;
                        const maxRisk = 13;

                        return (
                            <div>
                                <div className="tooltip-header">Gambit Dual Ledger</div>

                                <div className="tooltip-section">
                                    <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#8B6508' }}>
                                        <strong>Fortune Points:</strong> {fpValue}/{maxFP} FP
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                        Spend Fortune Points to influence fate and adjust rolls. Gain points from successful actions and critical hits.
                                    </div>
                                </div>

                                <div className="tooltip-divider"></div>

                                <div className="tooltip-section">
                                    <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#B71C1C' }}>
                                        <strong>Karmic Debt:</strong> {riskValue}/{maxRisk} Debt
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                        Represents the accumulated cost of pushing your luck. Accumulated risk will eventually demand payment, imposing dangerous penalties or cascading effects.
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Apex Quarry Marks & Companion Tooltip */}
                    {finalConfig.visual?.type === 'quarry-marks-companion' && huntressHoverSection && (
                        <div>
                            {huntressHoverSection === 'marks' && (() => {
                                const qmValue = finalClassResource.current ?? localQuarryMarks;
                                const maxQM = finalClassResource.max ?? 5;

                                return (
                                    <>
                                        <div className="tooltip-header">Quarry Marks</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#8B0000' }}>
                                                <strong>Marks:</strong> {qmValue}/{maxQM}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                                Used to enhance companion actions and unleash deadly glaive chains. Generated by successful hunter strikes.
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}

                            {huntressHoverSection === 'companion' && (() => {
                                const companionHPValue = finalClassResource.companionHP ?? companionHP;
                                const companionMaxHPValue = finalClassResource.companionMaxHP ?? companionMaxHP;

                                return (
                                    <>
                                        <div className="tooltip-header">Beast Companion</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#1B5E20' }}>
                                                <strong>HP:</strong> {companionHPValue}/{companionMaxHPValue}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                                The vital health of your loyal beast companion. If they fall to 0 HP, they are incapacitated.
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Animist Tooltip */}
                    {finalConfig.visual?.type === 'ancestral-resonance' && animistHoverSection === 'resonance' && (
                        <div>
                            <div className="tooltip-header">Ancestral Resonance</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#1B5E20' }}>
                                    <strong>Current:</strong> {finalClassResource.current ?? 0}/{finalClassResource.max ?? 20} AR
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                    Represents your attunement with ancestral spirits. Used to power runic invocations, summon ancestral guides, and manifest spirit-ward shields.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lichborne Phylactery Tooltip - Only shows phylactery info, no aura content */}
                    {finalConfig.visual?.type === 'eternal-frost-phylactery' && lichborneHoverSection === 'phylactery' && lichborneHoverSection !== 'aura' && (
                        <div>
                            {(() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[lichborneSpec] || specs.frostbound_tyrant;
                                const maxPhylactery = currentSpec.maxPhylactery;
                                const specName = currentSpec.name;
                                const specGlow = currentSpec.glow || '#6495ED';

                                return (
                                    <>
                                        <div className="tooltip-header">Phylactery</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>HP:</strong> {localPhylacteryHP}/{maxPhylactery}
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Style:</strong> {specName}
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Phylactery Management</div>
                                            <div className="level-management">
                                                <strong>Charge:</strong>
                                                <span>+1d6 HP per enemy killed by frost spells</span>
                                                <strong>Resurrect:</strong>
                                                <span>Spend all stored HP, once per combat. Death Trigger: Freeze 15ft for 1 round.</span>
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">{specName}</div>
                                            <div className="passive-desc">
                                                {lichborneSpec === 'frostbound_tyrant' && 'Freeze effects last +1d4 rounds. Frozen enemies take +1d6 damage. 50% Shatter chance (3d6 burst, ends freeze).'}
                                                {lichborneSpec === 'spectral_reaper' && 'Frost spells deal +1d6 necrotic. Every kill raises a spectral minion (max 4). 10 HP, 1d6 dmg/turn.'}
                                                {lichborneSpec === 'phylactery_guardian' && 'Phylactery stores 75 HP. Death Trigger freeze radius 25ft (vs 15ft).'}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Lunarch Lunar Phases Tooltip */}
                    {finalConfig.visual?.type === 'lunar-phases' && lunarchHoverSection && (
                        <div>
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
                                        <div className="tooltip-header">Lunar Phases</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current Phase:</strong> {currentPhaseConfig.name} ({currentBonuses.theme})
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Phase Bonus:</strong> {currentBonuses.bonus}
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Phase Management</div>
                                            <div className="level-management">
                                                <strong>Duration:</strong>
                                                <span>3 rounds per phase</span>
                                                <strong>Manual Shift:</strong>
                                                <span>8 mana (instant, resets timer)</span>
                                                <strong>Natural Cycle:</strong>
                                                <span>Auto-advances after 3 rounds</span>
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">All Phases</div>
                                            <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                {phaseOrder.map((phase, idx) => {
                                                    const phaseConfig = phases[phase];
                                                    const bonuses = getPhaseBonuses(phase);
                                                    return (
                                                        <div key={phase} style={{ marginBottom: '3px' }}>
                                                            <strong style={{ color: '#2C2416' }}>{phaseConfig.name}:</strong> {bonuses.bonus}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Lunar Empowerment (Shared Passive)</div>
                                            <div className="passive-desc">
                                                Darkvision 60 ft. Advantage vs charm/fear during Full Moon.
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}

                            {lunarchHoverSection === 'timer' && (
                                <>
                                    <div className="tooltip-header">Phase Timer</div>

                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current Round:</strong> {roundsInPhase + 1}/3
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <strong>Rounds Remaining:</strong> {3 - roundsInPhase}
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Natural Cycling</div>
                                        <div className="level-management">
                                            <strong>Duration:</strong>
                                            <span>3 rounds per phase</span>
                                            <strong>Cycle Order:</strong>
                                            <span>New Ã¢â€ â€™ Waxing Ã¢â€ â€™ Full Ã¢â€ â€™ Waning</span>
                                            <strong>Auto-Advance:</strong>
                                            <span>After round 3 completes</span>
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Specialization Passive</div>
                                        <div className="passive-desc">
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
                        const noteIndex = parseInt(minstrelHoverSection.split('-')[1]);
                        const note = finalConfig.visual?.notes?.[noteIndex];

                        if (!note) return null;

                        const count = localNotes[noteIndex] || 0;
                        const maxPerNote = finalConfig.mechanics?.maxPerNote || 5;

                        return (
                            <>
                                <div className="tooltip-header">{note.name}</div>

                                <div className="tooltip-section">
                                    <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                        <strong>Current:</strong> {count}/{maxPerNote} notes
                                    </div>
                                    <div style={{ fontSize: '0.9rem' }}>
                                        <strong>Effect:</strong> {note.function}
                                    </div>
                                </div>

                                <div className="tooltip-divider"></div>

                                <div className="tooltip-section">
                                    <div className="tooltip-label">Note Management</div>
                                    <div className="level-management">
                                        <strong>Generate:</strong>
                                        <span>{note.generatedBy}</span>
                                        <strong>Use:</strong>
                                        <span>{note.usedIn?.[0] || 'Various cadences'}</span>
                                    </div>
                                </div>
                            </>
                        );
                    })()}

                    {/* Oracle Prophetic Visions Tooltip */}
                    {finalConfig.visual?.type === 'prophetic-visions' && oracleHoverSection && (
                        <div>
                            {oracleHoverSection === 'visions' && (() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[oracleSpec] || specs.seer;
                                const specName = currentSpec.name;
                                const maxVisions = specs.max || 10;
                                const visionsValue = localVisions;

                                return (
                                    <>
                                        <div className="tooltip-header">{specName} Visions</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {visionsValue}/{maxVisions} visions
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Next Prediction:</strong> +1-3 visions
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Vision Management</div>
                                            <div className="level-management">
                                                <strong>Gain:</strong>
                                                <span>Make predictions (simple +1, moderate +2, complex +3)</span>
                                                <strong>Spend:</strong>
                                                <span>Alter Fate (1-3 visions per use)</span>
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">{specName} Passive</div>
                                            <div className="passive-desc">
                                                {oracleSpec === 'seer' && 'Gain +1 Vision per correct prediction. Predictions cost no action points. Advantage on initiative.'}
                                                {oracleSpec === 'truthseeker' && 'Detect lies and illusions. Uncover hidden knowledge for +1 Vision each.'}
                                                {oracleSpec === 'fateseer' && 'Premonition: When a prediction resolves correctly, spend 1 Vision to immediately apply a fate effect (reroll, Ã‚Â±1d6, or advantage/disadvantage) related to that prediction.'}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Berserker Rage Tooltip */}
                    {finalConfig.type === 'rage' && finalConfig.rageStates && (
                        <div>
                            {(() => {
                                const rageValue = berserkerRage;
                                const currentState = finalConfig.rageStates.find(s => rageValue >= s.range[0] && rageValue <= s.range[1]);
                                const isOverheated = rageValue > 100;

                                return (
                                    <>
                                        <div className="tooltip-header">Berserker Rage</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {rageValue}/100 rage
                                            </div>
                                            {currentState && (
                                                <div style={{ fontSize: '0.9rem' }}>
                                                    <strong>State:</strong> {currentState.name}
                                                </div>
                                            )}
                                        </div>

                                        {currentState && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Current Effects</div>
                                                    {currentState.bonuses && currentState.bonuses.length > 0 && (
                                                        <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                                                            <strong>Bonuses:</strong> {currentState.bonuses.join(', ')}
                                                        </div>
                                                    )}
                                                    {currentState.penalties && currentState.penalties.length > 0 && (
                                                        <div style={{ fontSize: '0.85rem' }}>
                                                            <strong>Penalties:</strong> {currentState.penalties.join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {isOverheated && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Overheat Warning</div>
                                                    <div className="drawback-text">
                                                        Take 2d6 damage if not spent this round!
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Harbinger Tooltips */}
                    {finalConfig.visual?.type === 'mayhem-gauge' && chaosWeaverHoverSection === 'mayhem' && (
                        <div>
                            <div className="tooltip-header">Mayhem Gauge</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#5E35B1' }}>
                                    <strong>Current:</strong> {finalClassResource.current || 0}/{finalClassResource.max || 100} Mayhem
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                    Passive chaos pressure gauge â€” CANNOT be spent. Passively amplifies all spells as it rises. Only release is Wild Surge at 100.
                                </div>
                            </div>
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

    const isArcanoneer = finalConfig.visual.type === 'elemental-spheres';
    const isShaper = finalConfig.type === 'dual-resource';
    const isBerserker = finalConfig.type === 'rage';
    const isHarbinger = finalConfig.visual?.type === 'mayhem-gauge';
    const isChronarch = finalConfig.visual?.type === 'time-shards-strain';
    const isRevenant = finalConfig.visual?.type === 'ascension-blood';
    const isFalseProphet = finalConfig.visual?.type === 'madness-gauge';
    const isGambitThreads = modifiedConfig.visual?.type === 'threads-of-destiny';
    const isGambit = finalConfig.visual?.type === 'fortune-points-gambling';
    const isApex = finalConfig.visual?.type === 'quarry-marks-companion';
    const isAnimist = finalConfig.visual?.type === 'ancestral-resonance';
    const isInquisitor = finalConfig.visual?.type === 'hexbreaker-charges';
    const isLunarch = finalConfig.visual?.type === 'lunar-phases';
    const isMartyr = finalConfig.visual?.type === 'devotion-gauge';
    const isMinstrel = finalConfig.visual?.type === 'musical-notes-combo';
    const isPlaguebringer = finalConfig.visual?.type === 'virulence-bar';
    const isPyrofiend = finalConfig.visual?.type === 'inferno-veil';
    const isSpellguard = finalConfig.visual?.type === 'arcane-absorption';
    const isWarden = finalConfig.visual?.type === 'vengeance-points';
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
                onMouseEnter={!isBerserker && !isShaper && !isHarbinger && !isChronarch && !isRevenant && !isFalseProphet && !isGambitThreads && !isGambit && !isApex && !isAnimist && !isInquisitor && !isLunarch && !isMartyr && !isMinstrel && !isPlaguebringer && !isPyrofiend && !isSpellguard && !isWarden && !isAugur ? handleMouseEnter : undefined}
                onMouseLeave={!isBerserker && !isShaper && !isHarbinger && !isChronarch && !isRevenant && !isFalseProphet && !isGambitThreads && !isGambit && !isApex && !isAnimist && !isInquisitor && !isLunarch && !isMartyr && !isMinstrel && !isPlaguebringer && !isPyrofiend && !isSpellguard && !isWarden && !isAugur ? handleMouseLeave : undefined}
                onMouseMove={!isBerserker && !isShaper && !isHarbinger && !isChronarch && !isRevenant && !isFalseProphet && !isGambitThreads && !isGambit && !isApex && !isAnimist && !isInquisitor && !isLunarch && !isMartyr && !isMinstrel && !isPlaguebringer && !isWarden && !isAugur ? handleMouseMove : undefined}
                onClick={handleClick}
                style={{ cursor: isGMMode ? 'pointer' : 'default' }}
            >
                {renderResourceDisplay()}
                {!isMartyr && !isAugur && !isArcanoneer && renderTooltip()}
            </div>

        </>
    );
};

export default ClassResourceBar;



