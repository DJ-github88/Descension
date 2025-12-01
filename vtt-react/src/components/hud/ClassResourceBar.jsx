import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
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
    character = null,
    isGMMode = false,
    onResourceClick = null,
    size = 'normal', // 'small', 'normal', 'large'
    context = 'hud' // 'hud' or 'account' - controls whether to show interactive elements
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
        diceButtonMode: 'roll', // 'roll' | 'spec' | 'prism-reroll' | 'architect-swap'
        showRollTooltip: false
    });

    // Chaos Weaver state
    const [chaosWeaverState, setChaosWeaverState] = useState({
        localModifiers: 0 // Chaos Weaver Mayhem Modifiers
    });

    const rageBarRef = useRef(null);
    const tooltipRef = useRef(null);
    const tooltipTimeoutRef = useRef(null);
    const resourceBarWrapperRef = useRef(null);

    // Class-specific states consolidated
    const [berserkerState, setBerserkerState] = useState({
        localRage: classResource?.current || 0
    });

    const [bladedancerState, setBladedancerState] = useState({
        localMomentum: 0,
        localFlourish: 3,
        currentStance: 'Flowing Water',
        showStanceMenu: false,
        showMomentumMenu: false,
        showFlourishMenu: false,
        momentumInputValue: '',
        bladedancerHoverSection: null, // 'momentum' | 'flourish' | 'stance' | null
        showSpecPassiveMenu: false,
        selectedSpecialization: 'Flow Master' // 'Blade Dancer' | 'Duelist' | 'Shadow Dancer'
    });

    const [chronarchState, setChronarchState] = useState({
        localTimeShards: 7, // Start with 7 for demo
        localTemporalStrain: 6, // Start with 6 for demo
        showTimeShardsMenu: false,
        showTemporalStrainMenu: false,
        chronarchHoverSection: null // 'shards' | 'strain' | null
    });

    const [covenbaneState, setCovenbaneState] = useState({
        localHexbreakerCharges: 4, // Start with 4 for demo
        localAttackCounter: 2, // 1, 2, or 3 (resets to 1 after 3)
        showChargesMenu: false,
        covenbaneHoverSection: null // 'charges' | 'counter' | null
    });

    const [deathcallerState, setDeathcallerState] = useState({
        localAscensionPaths: [true, true, true, false, false, false, false], // Start with 3 paths active
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

    const [formbenderState, setFormbenderState] = useState({
        localWildInstinct: 8, // Start with 8 for demo
        currentForm: 'nightstalker', // Start in Nightstalker form
        showWIMenu: false,
        showFormMenu: false,
        formbenderHoverSection: null, // 'wi' | 'form' | null
        formbenderSpec: 'feral-hunter' // Default to Feral Hunter
    });
    const wiBarRef = useRef(null);

    const [primalistState, setPrimalistState] = useState({
        localSynergy: 45, // Start with 45 for demo
        activeTotems: 5, // Start with 5 totems for demo
        showSynergyMenu: false,
        primalistSpec: 'earthwarden' // Default to Earthwarden
    });
    const synergyBarRef = useRef(null);

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
        huntressSpec: 'bladestorm', // 'bladestorm' | 'beastmaster' | 'shadowdancer'
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

    const qmBarRef = useRef(null);

    const [inscriptorState, setInscriptorState] = useState({
        localRunes: 3, // Start with 3 for demo (Enchanter max)
        localInscriptions: 1, // Start with 1 for demo
        inscriptorSpec: 'enchanter', // 'runebinder' | 'enchanter' | 'glyphweaver'
        showRunesMenu: false,
        showInscriptorSpecMenu: false,
        inscriptorHoverSection: null // 'runes' | 'inscriptions' | null
    });
    const inscriptorBarRef = useRef(null);

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

    const [minstrelState, setMinstrelState] = useState({
        localNotes: [3, 1, 2, 0, 2, 1, 0], // Start with some notes for demo (I, II, III, IV, V, VI, VII)
        minstrelSpec: 'battlechoir', // 'battlechoir' | 'soulsinger' | 'dissonance'
        minstrelHoverSection: null, // 'note-0' through 'note-6' | 'spec' | null
        showNoteMenus: [false, false, false, false, false, false, false], // One for each note
        showMinstrelSpecMenu: false
    });
    const minstrelBarRef = useRef(null);

    const [oracleState, setOracleState] = useState({
        localVisions: 6, // Start with 6 for demo
        oracleSpec: 'seer', // 'seer' | 'truthseeker' | 'fateweaver'
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

    // Destructure local variables from state objects for easier access
    const {
        localRage,
        showRageMenu: berserkerShowRageMenu,
        rageInputValue: berserkerRageInputValue
    } = berserkerState;

    const {
        localMomentum,
        localFlourish,
        currentStance,
        showStanceMenu,
        showMomentumMenu,
        showFlourishMenu,
        momentumInputValue,
        bladedancerHoverSection,
        showSpecPassiveMenu,
        selectedSpecialization
    } = bladedancerState;

    const {
        localTimeShards,
        localTemporalStrain,
        showTimeShardsMenu,
        showTemporalStrainMenu,
        chronarchHoverSection
    } = chronarchState;

    const {
        localHexbreakerCharges,
        localAttackCounter,
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
        localWildInstinct,
        currentForm,
        formbenderSpec,
        showWIMenu,
        showFormMenu,
        formbenderHoverSection
    } = formbenderState;

    const {
        localSynergy,
        activeTotems,
        primalistSpec,
        showSynergyMenu
    } = primalistState;

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
        localRunes,
        localInscriptions,
        inscriptorSpec,
        showRunesMenu,
        showInscriptionsMenu,
        showInscriptorSpecMenu,
        inscriptorHoverSection
    } = inscriptorState;

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
    const setShowStanceMenu = (value) => setBladedancerState(prev => ({ ...prev, showStanceMenu: value }));
    const setShowMomentumMenu = (value) => setBladedancerState(prev => ({ ...prev, showMomentumMenu: value }));
    const setShowFlourishMenu = (value) => setBladedancerState(prev => ({ ...prev, showFlourishMenu: value }));
    const setShowSpecPassiveMenu = (value) => setBladedancerState(prev => ({ ...prev, showSpecPassiveMenu: value }));
    const setLocalMomentum = (value) => setBladedancerState(prev => ({ ...prev, localMomentum: value }));
    const setLocalFlourish = (value) => setBladedancerState(prev => ({ ...prev, localFlourish: value }));
    const setCurrentStance = (value) => setBladedancerState(prev => ({ ...prev, currentStance: value }));
    const setLocalRage = (value) => setBerserkerState(prev => ({ ...prev, localRage: value }));
    const setShowTimeShardsMenu = (value) => setChronarchState(prev => ({ ...prev, showTimeShardsMenu: value }));
    const setShowTemporalStrainMenu = (value) => setChronarchState(prev => ({ ...prev, showTemporalStrainMenu: value }));
    const setLocalTimeShards = (value) => setChronarchState(prev => ({ ...prev, localTimeShards: value }));
    const setLocalTemporalStrain = (value) => setChronarchState(prev => ({ ...prev, localTemporalStrain: value }));
    const setShowChargesMenu = (value) => setCovenbaneState(prev => ({ ...prev, showChargesMenu: value }));
    const setLocalHexbreakerCharges = (value) => setCovenbaneState(prev => ({ ...prev, localHexbreakerCharges: value }));
    const setLocalAttackCounter = (value) => setCovenbaneState(prev => ({ ...prev, localAttackCounter: value }));
    const setShowPathsMenu = (value) => setDeathcallerState(prev => ({ ...prev, showPathsMenu: value }));
    const setShowTokensMenu = (value) => setDeathcallerState(prev => ({ ...prev, showTokensMenu: value }));
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
    const setShowWIMenu = (value) => setFormbenderState(prev => ({ ...prev, showWIMenu: value }));
    const setShowFormMenu = (value) => setFormbenderState(prev => ({ ...prev, showFormMenu: value }));
    const setShowSynergyMenu = (value) => setPrimalistState(prev => ({ ...prev, showSynergyMenu: value }));
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
    const setShowRunesMenu = (value) => setInscriptorState(prev => ({ ...prev, showRunesMenu: value }));
    const setShowInscriptorSpecMenu = (value) => setInscriptorState(prev => ({ ...prev, showInscriptorSpecMenu: value }));
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

    // Setter functions for hover sections in class-specific states
    const setBladedancerHoverSection = (value) => setBladedancerState(prev => ({ ...prev, bladedancerHoverSection: value }));
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
    const setFormbenderHoverSection = (value) => setFormbenderState(prev => ({ ...prev, formbenderHoverSection: value }));
    const setGamblerHoverSection = (value) => setGamblerState(prev => ({ ...prev, gamblerHoverSection: value }));
    const setHuntressHoverSection = (value) => setHuntressState(prev => ({ ...prev, huntressHoverSection: value }));
    const setInscriptorHoverSection = (value) => setInscriptorState(prev => ({ ...prev, inscriptorHoverSection: value }));
    const setLichborneHoverSection = (value) => setLichborneState(prev => ({ ...prev, lichborneHoverSection: value }));
    const setLocalPhylacteryHP = (value) => setLichborneState(prev => ({ ...prev, localPhylacteryHP: value }));
    const setEternalFrostActive = (value) => setLichborneState(prev => ({ ...prev, eternalFrostActive: value }));
    const setLichborneSpec = (value) => setLichborneState(prev => ({ ...prev, lichborneSpec: value }));
    const setLunarchHoverSection = (value) => setLunarchState(prev => ({ ...prev, lunarchHoverSection: value }));
    const setMartyrHoverSection = (value) => setMartyrState(prev => ({ ...prev, martyrHoverSection: value }));
    const setOracleHoverSection = (value) => setOracleState(prev => ({ ...prev, oracleHoverSection: value }));

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
            if (showModifierMenu && !event.target.closest('.mayhem-menu')) {
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

        const updatePosition = () => {
            // Wait for tooltip and bar refs to be available (they might be in a portal)
            const tooltip = tooltipRef.current;
            const bar = resourceBarWrapperRef.current;
            
            if (!tooltip || !bar) {
                // If refs aren't ready, try again
                requestAnimationFrame(updatePosition);
                return;
            }

            const tooltipRect = tooltip.getBoundingClientRect();
            const barRect = bar.getBoundingClientRect();
            
            // Check if bar has valid position (might not be laid out yet)
            if (barRect.width === 0 && barRect.height === 0 && barRect.left === 0 && barRect.top === 0) {
                // Bar might not be positioned yet, try again
                requestAnimationFrame(updatePosition);
                return;
            }
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 8;
            
            // Find the HUD container (party-hud or party-member-frame) to position tooltip below it
            let hudContainer = bar.closest('.party-hud, .party-member-frame, .character-portrait-hud');
            let hudBottom = barRect.bottom;
            
            if (hudContainer) {
                const hudRect = hudContainer.getBoundingClientRect();
                hudBottom = hudRect.bottom;
            }
            
            // Check if tooltip has valid dimensions (not 0x0)
            // If dimensions aren't ready yet, use estimated dimensions
            const tooltipWidth = tooltipRect.width > 0 ? tooltipRect.width : 300;
            const tooltipHeight = tooltipRect.height > 0 ? tooltipRect.height : 200;
            
            // Position tooltip below the HUD container, centered horizontally relative to the resource bar
            let left = barRect.left + (barRect.width / 2) - (tooltipWidth / 2);
            let top = hudBottom + margin;
            
            // If dimensions weren't ready, schedule another update
            if (tooltipRect.width === 0 || tooltipRect.height === 0) {
                requestAnimationFrame(updatePosition);
            }
            
            // Adjust horizontal position to keep tooltip in viewport
            if (left < margin) {
                left = margin;
            }
            if (left + tooltipWidth > viewportWidth - margin) {
                left = viewportWidth - tooltipWidth - margin;
            }
            
            // Ensure tooltip doesn't go off bottom of viewport
            if (top + tooltipHeight > viewportHeight - margin) {
                // If there's not enough space below, position above the HUD instead
                if (hudContainer) {
                    const hudRect = hudContainer.getBoundingClientRect();
                    top = hudRect.top - tooltipHeight - margin;
                } else {
                    top = barRect.top - tooltipHeight - margin;
                }
                // But ensure it doesn't go off top either
                if (top < margin) {
                    top = margin;
                }
            }
            
            // Apply position directly to tooltip element - use cssText to override all styles
            // But preserve padding and border-radius from CSS
            tooltip.style.position = 'fixed';
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.transform = 'none';
            tooltip.style.zIndex = '2147483647';
            tooltip.style.borderRadius = '0';
            tooltip.style.padding = '10px 12px';
        };

        // Run immediately and on multiple frames to ensure dimensions are available
        // This handles the case where tooltip is rendered in a portal
        updatePosition();
        requestAnimationFrame(() => {
            requestAnimationFrame(updatePosition);
        });
        
        // Also add a small timeout as fallback for portal rendering
        const timeoutId = setTimeout(updatePosition, 50);
        const timeoutId2 = setTimeout(updatePosition, 100);
        
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(timeoutId2);
        };
    }, [showTooltip, localRage, localMomentum, localFlourish, bladedancerHoverSection, chaosWeaverHoverSection, chronarchHoverSection, localTimeShards, localTemporalStrain, covenbaneHoverSection, localHexbreakerCharges, localAttackCounter, dreadnaughtHoverSection, localDRP, selectedResistanceType, size, minstrelHoverSection, oracleHoverSection, gamblerHoverSection, huntressHoverSection, inscriptorHoverSection, lichborneHoverSection, lunarchHoverSection, fateWeaverHoverSection, formbenderHoverSection, falseProphetHoverSection, exorcistHoverSection, deathcallerHoverSection, arcanoneerState.showRollTooltip]);

    const handleRageBarLeave = () => setShowTooltip(false);


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

    const finalConfig = config || defaultConfig;
    const finalClassResource = classResource || { current: 0, max: finalConfig.mechanics?.max || 20 };

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

    // Define stance value for Bladedancer tooltips (needs to be accessible to renderTooltip)
    const stanceValue = context === 'account'
        ? (finalClassResource?.stance?.current ?? 'Flowing Water')
        : currentStance;

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
            case 'totemic-synergy':
                return renderTotemicSynergy();
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
                <div className="chronarch-single-bar">
                    {/* Time Shards Bar (Left Side) */}
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
                        <div
                            className="resource-adjust-menu charges-menu"
                            onMouseEnter={() => setShowTooltip(false)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
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
            <div className={`class-resource-bar ascension-blood ${size} ${context === 'party' ? 'party-context' : ''}`}>
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
            setLocalDRP(Math.min(localDRP + amount, drpMax));
        };

        const removeDRP = (amount) => {
            setLocalDRP(Math.max(localDRP - amount, 0));
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
                                    <button className="mayhem-menu-item" onClick={resetModifiers}>Reset</button>
                                    <button className="mayhem-menu-item" onClick={maxModifiersFunc}>Max</button>
                                </div>
                            </div>
                        )}

                        <div
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
                                    <button className="mayhem-menu-option" onClick={resetModifiers}>Reset</button>
                                    <button className="mayhem-menu-option" onClick={maxModifiersFunc}>Max</button>
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
                const crystalSymbols = modifiedConfig.visual.crystalSymbols || ['💎', '🔮', '✨', '🌟'];
                return crystalSymbols[index % crystalSymbols.length];
            } else if (spec === 'card-master') {
                const cardSymbols = modifiedConfig.visual.cardSymbols || ['🃏', '♠', '♥', '♦', '♣'];
                return cardSymbols[index % cardSymbols.length];
            } else if (spec === 'thread-weaver') {
                const webSymbols = modifiedConfig.visual.webSymbols || ['🕸️', '🕷️', '✨', '🌐'];
                return webSymbols[index % webSymbols.length];
            } else {
                const suits = modifiedConfig.visual.cardSuits || ['♠', '♥', '♦', '♣'];
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
                    {showThreadsMenu && ReactDOM.createPortal(
                        <div className="threads-adjustment-menu" style={{
                            position: 'fixed',
                            top: (() => {
                                if (!threadsBarRef.current) return '50%';
                                const rect = threadsBarRef.current.getBoundingClientRect();
                                const menuHeight = 300; // Approximate menu height
                                const bottom = rect.bottom + 8;
                                const viewportHeight = window.innerHeight;

                                // If menu would go off bottom, position above the bar
                                if (bottom + menuHeight > viewportHeight) {
                                    return Math.max(rect.top - menuHeight - 8, 10) + 'px';
                                }

                                return bottom + 'px';
                            })(),
                            left: (() => {
                                if (!threadsBarRef.current) return '50%';
                                const rect = threadsBarRef.current.getBoundingClientRect();
                                const menuWidth = 340; // Min width from CSS
                                const left = rect.left;
                                const viewportWidth = window.innerWidth;

                                // Center on bar, but keep within viewport
                                let finalLeft = left;
                                if (finalLeft + menuWidth > viewportWidth) {
                                    finalLeft = viewportWidth - menuWidth - 10;
                                }
                                if (finalLeft < 10) {
                                    finalLeft = 10;
                                }

                                return finalLeft + 'px';
                            })(),
                            transform: threadsBarRef.current ? 'translateX(0)' : 'translate(-50%, -50%)'
                        }}>
                            <div className="menu-section">
                                <div className="menu-section-title">Gain Threads (Failures)</div>
                                <div className="menu-buttons">
                                    <button onClick={() => gainThreads(1)} title="Minor failure">
                                        <i className="fas fa-plus"></i> Minor
                                    </button>
                                    <button onClick={() => gainThreads(2)} title="Major failure">
                                        <i className="fas fa-plus-circle"></i> Major
                                    </button>
                                    <button onClick={() => gainThreads(3)} title="Destiny Weaver bonus">
                                        <i className="fas fa-star"></i> Weaver
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="menu-section-title">Spend Threads</div>
                                <div className="menu-buttons">
                                    <button onClick={() => spendThreads(2)} title="Call specific card">
                                        <i className="fas fa-hand-sparkles"></i> Call Card
                                    </button>
                                    <button onClick={() => spendThreads(3)} title="Force failure">
                                        <i className="fas fa-times-circle"></i> Force Fail
                                    </button>
                                    <button onClick={() => spendThreads(5)} title="Force success">
                                        <i className="fas fa-check-circle"></i> Force Success
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <div className="menu-section-title">Specialization</div>
                                <div className="menu-buttons">
                                    <button
                                        onClick={() => setSelectedFateWeaverSpec('fortune-teller')}
                                        title="Fortune Teller: Predictive support and ally buffs"
                                        style={{
                                            backgroundColor: selectedFateWeaverSpec === 'fortune-teller' ? '#9370DB' : undefined,
                                            borderColor: selectedFateWeaverSpec === 'fortune-teller' ? '#9370DB' : '#9370DB'
                                        }}
                                    >
                                        <i className="fas fa-eye"></i> Fortune Teller
                                    </button>
                                    <button
                                        onClick={() => setSelectedFateWeaverSpec('card-master')}
                                        title="Card Master: Deck control and combo assembly"
                                        style={{
                                            backgroundColor: selectedFateWeaverSpec === 'card-master' ? '#FFD700' : undefined,
                                            borderColor: selectedFateWeaverSpec === 'card-master' ? '#FFD700' : '#FFD700'
                                        }}
                                    >
                                        <i className="fas fa-crown"></i> Card Master
                                    </button>
                                    <button
                                        onClick={() => setSelectedFateWeaverSpec('thread-weaver')}
                                        title="Thread Weaver: High-risk Thread generation"
                                        style={{
                                            backgroundColor: selectedFateWeaverSpec === 'thread-weaver' ? '#FF1493' : undefined,
                                            borderColor: selectedFateWeaverSpec === 'thread-weaver' ? '#FF1493' : '#FF1493'
                                        }}
                                    >
                                        <i className="fas fa-spider"></i> Thread Weaver
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
                                        <i className="fas fa-crown"></i> Set to {modifiedConfig.mechanics?.max ?? 13} (King)
                                    </button>
                                </div>
                            </div>

                            <div className="menu-section">
                                <button onClick={() => setShowThreadsMenu(false)} className="close-menu-btn">
                                    <i className="fas fa-times"></i> Close
                                </button>
                            </div>
                        </div>,
                        document.body
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
                    setFormbenderState(prev => ({ ...prev, localWildInstinct: Math.max(0, wiValue - 1) }));
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

                    {/* WI Adjustment Menu */}
                    {showWIMenu && (
                        <div
                            className="resource-adjust-menu wi-menu"
                            onMouseEnter={() => setShowTooltip(false)}
                        >
                            <div className="menu-header">Adjust Wild Instinct ({wiValue}/{maxWI})</div>
                            <div className="menu-buttons">
                                <button onClick={() => setFormbenderState(prev => ({ ...prev, localWildInstinct: Math.min(maxWI, wiValue + 1) }))}>+1 WI</button>
                                <button onClick={() => setFormbenderState(prev => ({ ...prev, localWildInstinct: Math.min(maxWI, wiValue + 2) }))}>+2 Form Action</button>
                                <button onClick={() => setFormbenderState(prev => ({ ...prev, localWildInstinct: Math.max(0, wiValue - 1) }))}>−1 Transform</button>
                                <button onClick={() => setFormbenderState(prev => ({ ...prev, localWildInstinct: Math.max(0, wiValue - 3) }))}>−3 Ability</button>
                                <button onClick={() => setFormbenderState(prev => ({ ...prev, localWildInstinct: Math.max(0, wiValue - 5) }))}>−5 Ultimate</button>
                            </div>

                            {/* Specialization Section */}
                            <div className="menu-section">
                                <div className="menu-section-title">Specialization</div>
                                <div className="spec-buttons">
                                    {Object.entries(finalConfig.visual?.specializations || {}).map(([specKey, spec]) => (
                                        <button
                                            key={specKey}
                                            onClick={() => setFormbenderState(prev => ({ ...prev, formbenderSpec: specKey }))}
                                            className={formbenderSpec === specKey ? 'active' : ''}
                                        >
                                            <i className={spec.icon}></i> {spec.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="menu-reset" onClick={() => { setFormbenderState(prev => ({ ...prev, localWildInstinct: 0 })); setShowWIMenu(false); }}>Reset to 0</button>
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
                                        title=""
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
                            <button className="menu-reset" title="" onClick={() => setShowFormMenu(false)}>Close</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Totemic Synergy (Primalist)
    const renderTotemicSynergy = () => {
        const maxSynergy = finalConfig.mechanics?.max || 100;
        const synergyValue = localSynergy;
        const maxTotems = finalConfig.mechanics?.totems?.max || 8;
        const totemCount = activeTotems;
        const synergyThreshold = finalConfig.mechanics?.synergyThreshold || 4;
        const specs = finalConfig.visual?.specializations || {};
        const currentSpec = specs[primalistSpec] || specs['earthwarden'];
        const canActivateSynergy = totemCount >= synergyThreshold;

        // Handle bar click to toggle synergy menu
        const handleBarClick = (e) => {
            e.stopPropagation();
            setShowSynergyMenu(!showSynergyMenu);
        };

        // Handle synergy bar hover
        const handleSynergyEnter = (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowTooltip(true);
        };

        const handleLeave = () => {
            setShowTooltip(false);
        };

        return (
            <div className={`class-resource-bar totemic-synergy ${size}`}>
                {/* Primal Energy Display - 2 Rows */}
                <div className="primal-energy-container">
                    {/* Row 1: Synergy Energy Flow */}
                    <div
                        className="primal-energy-row synergy-row"
                        ref={synergyBarRef}
                        onMouseEnter={handleSynergyEnter}
                        onMouseLeave={handleLeave}
                        onClick={handleBarClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="energy-flow-background">
                            {/* Primal Energy Waves */}
                            <div className="energy-waves">
                                {Array.from({ length: 3 }, (_, waveIndex) => (
                                    <div
                                        key={waveIndex}
                                        className="energy-wave"
                                        style={{
                                            background: `linear-gradient(90deg, transparent, ${currentSpec.activeColor}40, ${currentSpec.glowColor}60, transparent)`,
                                            animationDelay: `${waveIndex * 0.5}s`,
                                            opacity: synergyValue > 0 ? 1 : 0
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Energy Fill */}
                            <div
                                className="energy-fill"
                                style={{
                                    width: `${(synergyValue / maxSynergy) * 100}%`,
                                    background: `linear-gradient(90deg, ${currentSpec.activeColor}, ${currentSpec.glowColor}, ${currentSpec.activeColor})`,
                                    boxShadow: canActivateSynergy ? `0 0 15px ${currentSpec.glowColor}, inset 0 0 10px rgba(255,255,255,0.3)` : `0 0 8px ${currentSpec.activeColor}`,
                                    animation: canActivateSynergy ? 'energyPulse 1.5s infinite' : 'none'
                                }}
                            >
                                {/* Energy Particles */}
                                {canActivateSynergy && Array.from({ length: 5 }, (_, particleIndex) => (
                                    <div
                                        key={particleIndex}
                                        className="energy-particle"
                                        style={{
                                            left: `${20 + particleIndex * 15}%`,
                                            background: currentSpec.glowColor,
                                            animation: `particleFloat 2s infinite ${particleIndex * 0.3}s`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Tribal Energy Markings */}
                            <div className="energy-markings">
                                {Array.from({ length: 8 }, (_, markIndex) => (
                                    <div
                                        key={markIndex}
                                        className="energy-mark"
                                        style={{
                                            left: `${markIndex * 12.5}%`,
                                            opacity: synergyValue / maxSynergy > markIndex / 8 ? 0.8 : 0.2,
                                            background: synergyValue / maxSynergy > markIndex / 8 ? currentSpec.glowColor : '#666'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Elemental Spheres on top of the bar */}
                            <div className="elemental-spheres-overlay">
                                {Array.from({ length: maxTotems }, (_, index) => {
                                    const sphereElements = ['fire', 'frost', 'storm', 'earth', 'healing', 'protection', 'spirit', 'nature'];
                                    const element = sphereElements[index] || 'unknown';
                                    const isActive = index < totemCount; // Show spheres based on active totems

                                    return (
                                        <div
                                            key={index}
                                            className={`elemental-sphere ${element} ${isActive ? 'active' : 'inactive'}`}
                                        >
                                            <div className="sphere-icon">
                                                {/* No letters - spheres are just visual indicators */}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Totem Bubbles integrated into the bar */}
                            <div className="totem-symbols-overlay">
                                {Array.from({ length: maxTotems }, (_, index) => {
                                    const isActive = index < totemCount;

                                    return (
                                        <div
                                            key={index}
                                            className={`totem-bubble ${isActive ? 'active' : 'inactive'}`}
                                            style={{
                                                left: `${(index * (100 / maxTotems)) + (50 / maxTotems)}%`
                                            }}
                                        ></div>
                                    );
                                })}
                            </div>

                            <div className={`energy-value ${canActivateSynergy ? 'awakened' : ''}`} style={{
                                color: '#FFFFFF',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)',
                                fontWeight: 'bold',
                                fontFamily: 'serif'
                            }}>
                                {synergyValue}/{maxSynergy}
                            </div>
                        </div>
                        {canActivateSynergy && (
                            <div className="synergy-spirit-awakened" style={{
                                background: `linear-gradient(45deg, ${currentSpec.glowColor}, ${currentSpec.activeColor})`,
                                color: '#FFFFFF',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                fontWeight: 'bold',
                                border: `2px solid ${currentSpec.glowColor}`,
                                animation: 'spiritAwaken 1s infinite alternate'
                            }}>
                                ⚡ AWAKENED ⚡
                            </div>
                        )}
                    </div>

                </div>

                {/* Synergy Adjustment Menu */}
                {showSynergyMenu && (
                    <div
                        className="resource-adjust-menu synergy-menu"
                        onMouseEnter={() => setShowTooltip(false)}
                    >
                        <div className="menu-header">Adjust Totemic Synergy ({synergyValue}/{maxSynergy})</div>
                        <div className="menu-buttons">
                            <button title="" onClick={() => setPrimalistState(prev => ({ ...prev, localSynergy: Math.max(0, synergyValue - 10) }))}>-10 TS</button>
                            <button title="" onClick={() => setPrimalistState(prev => ({ ...prev, localSynergy: Math.max(0, synergyValue - 5) }))}>-5 TS</button>
                            <button title="" onClick={() => setPrimalistState(prev => ({ ...prev, localSynergy: Math.min(maxSynergy, synergyValue + 5) }))} >+5 TS</button>
                            <button title="" onClick={() => setPrimalistState(prev => ({ ...prev, localSynergy: Math.min(maxSynergy, synergyValue + 10) }))} >+10 TS</button>
                        </div>

                        {/* Totem Section */}
                        <div className="menu-section">
                            <div className="menu-section-title">Active Totems ({totemCount}/{maxTotems})</div>
                            <div className="menu-buttons">
                                <button title="" onClick={() => setPrimalistState(prev => ({ ...prev, activeTotems: Math.max(0, totemCount - 1) }))}>-1 Totem</button>
                                <button title="" onClick={() => setPrimalistState(prev => ({ ...prev, activeTotems: Math.min(maxTotems, totemCount + 1) }))} >+1 Totem</button>
                            </div>
                            <div className="synergy-status" style={{
                                fontSize: '10px',
                                color: canActivateSynergy ? currentSpec.glowColor : '#888',
                                textAlign: 'center',
                                marginTop: '4px'
                            }}>
                                {canActivateSynergy ? `SYNERGY READY (${synergyThreshold}+ totems)` : `Need ${synergyThreshold - totemCount} more totem(s)`}
                            </div>
                        </div>

                        {/* Specialization Section */}
                        <div className="menu-section">
                            <div className="menu-section-title">Specialization</div>
                            <div className="spec-buttons">
                                {Object.entries(specs).map(([specKey, spec]) => (
                                    <button
                                        key={specKey}
                                        title=""
                                        onClick={() => setPrimalistSpec(specKey)}
                                        className={primalistSpec === specKey ? 'active' : ''}
                                    >
                                        <i className={spec.icon}></i> {spec.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="menu-reset" title="" onClick={() => { setPrimalistState(prev => ({ ...prev, localSynergy: 0, activeTotems: 0 })); setShowSynergyMenu(false); }}>Reset to 0</button>
                    </div>
                )}
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
            <div className={`class-resource-bar fortune-points-gambling ${size} ${context === 'party' ? 'party-context' : ''}`}>
                <div className="gambler-container">

                    {/* Fortune Points Bar */}
                    <div
                        className="fp-bar-wrapper"
                        ref={fpBarRef}
                        onClick={() => {
                            const newShowState = !showFPMenu;
                            setShowFPMenu(newShowState);
                            if (newShowState) {
                                // Calculate position when opening the menu
                                setTimeout(calculateMenuPosition, 0);
                            }
                        }}
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
                                className="fp-menu inline-menu"
                                style={{
                                    position: 'absolute',
                                    top: menuPosition.top,
                                    bottom: menuPosition.bottom,
                                    left: menuPosition.left,
                                    right: menuPosition.right,
                                    transform: menuPosition.transform || 'none'
                                }}
                                onMouseEnter={() => setGamblerHoverSection(null)}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="menu-title">Adjust Fortune Points</div>

                                {/* Specialization Selection */}
                                <div className="spec-selection">
                                    {Object.entries(specs).map(([key, spec]) => (
                                        <button
                                            key={key}
                                            className={`spec-select-button ${gamblerSpec === key ? 'active' : ''}`}
                                            onClick={() => {
                                                setGamblerSpec(key);
                                                setLocalFortunePoints(Math.min(localFortunePoints, spec.max));
                                            }}
                                            title={spec.name}
                                        >
                                            <i className={key === 'card-sharp' ? 'fas fa-cards' : (spec.icon || 'fas fa-question')}></i>
                                            <span className="spec-name">{spec.name}</span>
                                        </button>
                                    ))}
                                </div>

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
                        </div>

                        {/* QM Adjustment Menu */}
                        {showQMMenu && (
                            <div
                                className="qm-menu"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="menu-header">
                                    <div className="menu-title">Adjust Quarry Marks</div>
                                </div>
                                <div className="menu-buttons">
                                    <div className="button-row">
                                        <button onClick={() => { setLocalQuarryMarks(Math.min(maxQM, qmValue + 1)); setShowQMMenu(false); }}>
                                            +1 <span className="button-desc">Hit</span>
                                        </button>
                                        <button onClick={() => { setLocalQuarryMarks(Math.min(maxQM, qmValue + 2)); setShowQMMenu(false); }}>
                                            +2 <span className="button-desc">Crit</span>
                                        </button>
                                        <button onClick={() => { setLocalQuarryMarks(Math.max(0, qmValue - 1)); setShowQMMenu(false); }}>
                                            -1 <span className="button-desc">Comp</span>
                                        </button>
                                    </div>
                                    <div className="button-row">
                                        <button onClick={() => { setLocalQuarryMarks(Math.max(0, qmValue - 2)); setShowQMMenu(false); }}>
                                            -2 <span className="button-desc">Chain</span>
                                        </button>
                                        <button onClick={() => { setLocalQuarryMarks(Math.max(0, qmValue - 3)); setShowQMMenu(false); }}>
                                            -3 <span className="button-desc">Spec</span>
                                        </button>
                                        <button onClick={() => { setLocalQuarryMarks(0); setShowQMMenu(false); }}>
                                            -5 <span className="button-desc">Ult</span>
                                        </button>
                                    </div>
                                    <div className="button-row">
                                        <button onClick={() => { setLocalQuarryMarks(0); setShowQMMenu(false); }}>
                                            0 <span className="button-desc">Reset</span>
                                        </button>
                                        <button onClick={() => { setLocalQuarryMarks(maxQM); setShowQMMenu(false); }}>
                                            {maxQM} <span className="button-desc">Max</span>
                                        </button>
                                        <button className="menu-reset" onClick={() => setShowQMMenu(false)}>
                                            ✕
                                        </button>
                                    </div>
                                </div>
                                <div className="menu-divider"></div>
                                <div className="spec-buttons">
                                    <button
                                        className={`spec-button ${huntressSpec === 'bladestorm' ? 'active' : ''}`}
                                        onClick={() => setHuntressSpec('bladestorm')}
                                    >
                                        <i className="fas fa-khanda"></i> Bladestorm
                                    </button>
                                    <button
                                        className={`spec-button ${huntressSpec === 'beastmaster' ? 'active' : ''}`}
                                        onClick={() => setHuntressSpec('beastmaster')}
                                    >
                                        <i className="fas fa-paw"></i> Beastmaster
                                    </button>
                                    <button
                                        className={`spec-button ${huntressSpec === 'shadowdancer' ? 'active' : ''}`}
                                        onClick={() => setHuntressSpec('shadowdancer')}
                                    >
                                        <i className="fas fa-moon"></i> Shadowdancer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Runes & Inscriptions display (Inscriptor)
    const renderRunesInscriptions = () => {
        // Get specialization config
        const specs = finalConfig.visual;
        const currentSpec = specs[inscriptorSpec] || specs.enchanter;
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
            <div className={`class-resource-bar runes-inscriptions ${size}`} style={{ width: '100%' }}>
                <div className="inscriptor-container" style={{ width: '100%' }}>
                    {/* Combined Runes & Inscriptions Bar */}
                    <div className="ri-bar-wrapper" ref={inscriptorBarRef} style={{ width: '100%', minWidth: 0 }}>
                        <div className="ri-bar-content" style={{ width: '100%', minWidth: 0 }}>
                        {/* Runes Section */}
                        <div
                            className="runes-section"
                            onClick={handleBarClick}
                            onMouseEnter={handleRunesBarEnter}
                            onMouseLeave={handleBarLeave}
                            style={{
                                cursor: 'pointer',
                                flex: maxRunes > maxInscriptions ? '3' : '1'
                            }}
                        >
                            {/* Runes Value Display - Centered */}
                            <div className="ri-section-value runes-value">
                                {runesValue}/{maxRunes}
                            </div>
                            <div className="runes-segments">
                                {Array.from({ length: Math.min(maxRunes, maxRunes > maxInscriptions ? 12 : 8) }, (_, index) => {
                                    const runeSymbols = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ']; // Elder Futhark runes
                                    const maxVisualRunes = maxRunes > maxInscriptions ? 12 : 8;
                                    return (
                                        <div
                                            key={`rune-${index}`}
                                            className={`rune-segment ${index < Math.min(runesValue, maxVisualRunes) ? 'filled' : 'empty'}`}
                                            style={{
                                                backgroundColor: index < Math.min(runesValue, maxVisualRunes) ? specs.runes.activeColor : specs.runes.baseColor,
                                                borderColor: specs.runes.segmentBorder,
                                                boxShadow: index < Math.min(runesValue, maxVisualRunes) ? `0 0 6px ${specs.runes.glowColor}` : 'none',
                                                fontSize: maxRunes > maxInscriptions ? '12px' : '14px',
                                                fontWeight: 'bold',
                                                color: index < Math.min(runesValue, maxVisualRunes) ? '#FFF' : 'rgba(255, 255, 255, 0.2)'
                                            }}
                                        >
                                            {runeSymbols[index % runeSymbols.length]}
                                        </div>
                                    );
                                })}
                                {maxRunes > (maxRunes > maxInscriptions ? 12 : 8) && (
                                    <div className="runes-overflow-indicator" style={{
                                        color: '#FFD700',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        marginLeft: '2px'
                                    }}>
                                        +{Math.max(0, Math.min(runesValue, maxRunes) - (maxRunes > maxInscriptions ? 12 : 8))}
                                    </div>
                                )}
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
                            style={{
                                cursor: 'pointer',
                                flex: maxInscriptions > maxRunes ? '3' : '1'
                            }}
                        >
                            {/* Inscriptions Value Display - Centered */}
                            <div className="ri-section-value inscriptions-value">
                                {inscriptionsValue}/{maxInscriptions}
                            </div>
                            <div className="inscriptions-segments">
                                {Array.from({ length: Math.min(maxInscriptions, maxRunes > maxInscriptions ? 2 : 6) }, (_, index) => {
                                    const inscriptionSymbols = ['◈', '◆', '◇', '◉', '○', '●']; // Mystical geometric symbols
                                    const maxVisualInscriptions = maxRunes > maxInscriptions ? 2 : 6;
                                    return (
                                        <div
                                            key={`inscription-${index}`}
                                            className={`inscription-segment ${index < Math.min(inscriptionsValue, maxVisualInscriptions) ? 'filled' : 'empty'}`}
                                            style={{
                                                backgroundColor: index < Math.min(inscriptionsValue, maxVisualInscriptions) ? specs.inscriptions.activeColor : specs.inscriptions.baseColor,
                                                borderColor: specs.inscriptions.segmentBorder,
                                                boxShadow: index < Math.min(inscriptionsValue, maxVisualInscriptions) ? `0 0 6px ${specs.inscriptions.glowColor}` : 'none',
                                                fontSize: maxRunes > maxInscriptions ? '8px' : '12px',
                                                fontWeight: 'bold',
                                                color: index < Math.min(inscriptionsValue, maxVisualInscriptions) ? '#FFF' : 'rgba(255, 255, 255, 0.2)'
                                            }}
                                        >
                                            {inscriptionSymbols[index]}
                                        </div>
                                    );
                                })}
                                {maxInscriptions > (maxRunes > maxInscriptions ? 2 : 6) && (
                                    <div className="inscriptions-overflow-indicator" style={{
                                        color: '#FFD700',
                                        fontSize: '9px',
                                        fontWeight: 'bold',
                                        marginLeft: '2px'
                                    }}>
                                        +{Math.max(0, Math.min(inscriptionsValue, maxInscriptions) - (maxRunes > maxInscriptions ? 2 : 6))}
                                    </div>
                                )}
                            </div>
                        </div>

                        </div>

                        {/* Adjustment Menu */}
                        {showRunesMenu && (
                            <div className="ri-menu" onClick={(e) => e.stopPropagation()}>
                                <div className="menu-title">Adjust Runes & Inscriptions</div>
                                
                                {/* Specialization Selection */}
                                <div className="menu-section spec-section-menu">
                                    <div className="menu-section-title">Specialization</div>
                                    <div className="spec-options-grid">
                                        {Object.entries(specs).filter(([key]) =>
                                            key === 'runebinder' || key === 'enchanter' || key === 'glyphweaver'
                                        ).map(([key, spec]) => (
                                            <button
                                                key={key}
                                                className={`spec-option-button ${key} ${inscriptorSpec === key ? 'active' : ''}`}
                                                onClick={() => {
                                                    setInscriptorState(prev => ({
                                                        ...prev,
                                                        inscriptorSpec: key,
                                                        localRunes: Math.min(localRunes, spec.maxRunes),
                                                        localInscriptions: Math.min(localInscriptions, spec.maxInscriptions)
                                                    }));
                                                }}
                                                style={{
                                                    borderColor: spec.color,
                                                    color: inscriptorSpec === key ? spec.color : '#3a3a3a'
                                                }}
                                            >
                                                <i className={`fas ${spec.icon}`}></i>
                                                <span>{spec.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="menu-section">
                                    <div className="menu-section-title">Runes</div>
                                    <div className="menu-buttons">
                                        <button onClick={() => { setInscriptorState(prev => ({ ...prev, localRunes: Math.min(maxRunes, runesValue + 1) })); }}>
                                            +1 Rune (Place)
                                        </button>
                                        <button onClick={() => { setInscriptorState(prev => ({ ...prev, localRunes: Math.min(maxRunes, runesValue + 3) })); }}>
                                            +3 Runes (Form Zone)
                                        </button>
                                        <button onClick={() => { setInscriptorState(prev => ({ ...prev, localRunes: Math.max(0, runesValue - 1) })); }}>
                                            -1 Rune (Detonate)
                                        </button>
                                        <button onClick={() => { setInscriptorState(prev => ({ ...prev, localRunes: 0 })); }}>
                                            Clear All Runes
                                        </button>
                                    </div>
                                </div>
                                <div className="menu-section">
                                    <div className="menu-section-title">Inscriptions</div>
                                    <div className="menu-buttons">
                                        <button onClick={() => { setInscriptorState(prev => ({ ...prev, localInscriptions: Math.min(maxInscriptions, inscriptionsValue + 1) })); }}>
                                            +1 Inscription (Inscribe Item)
                                        </button>
                                        <button onClick={() => { setInscriptorState(prev => ({ ...prev, localInscriptions: Math.max(0, inscriptionsValue - 1) })); }}>
                                            -1 Inscription (Remove)
                                        </button>
                                        <button onClick={() => { setInscriptorState(prev => ({ ...prev, localInscriptions: 0 })); }}>
                                            Clear All Inscriptions
                                        </button>
                                    </div>
                                </div>
                                <div className="menu-buttons">
                                    <button onClick={() => { setInscriptorState(prev => ({ ...prev, localRunes: 0, localInscriptions: 0 })); }}>
                                        Reset All
                                    </button>
                                    <button onClick={() => { setInscriptorState(prev => ({ ...prev, localRunes: maxRunes, localInscriptions: maxInscriptions })); }}>
                                        Set to Max
                                    </button>
                                </div>
                                <button className="menu-reset" onClick={() => setShowRunesMenu(false)}>
                                    Close
                                </button>
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
                                    Specialization: {Object.entries(specs)
                                        .filter(([key]) => key !== 'type' && key !== 'arrangement' && key !== 'baseColor' && key !== 'activeColor' && key !== 'glowColor' && key !== 'icon')
                                        .find(([key]) => key === lichborneSpec)?.[1]?.name || 'Frostbound Tyrant'}
                                </div>
                                <div className="menu-info">
                                    <div className="spec-buttons-inline">
                                        {Object.entries(specs)
                                            .filter(([key]) => key !== 'type' && key !== 'arrangement' && key !== 'baseColor' && key !== 'activeColor' && key !== 'glowColor' && key !== 'icon')
                                            .map(([key, spec]) => (
                                                <button
                                                    key={key}
                                                    className={`spec-button ${lichborneSpec === key ? 'selected' : ''}`}
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
                                                    style={{ borderColor: lichborneSpec === key ? spec.glow : 'rgba(0, 255, 255, 0.4)' }}
                                                    title={spec.name}
                                                >
                                                    <i className={`fas ${spec.icon}`} style={{ color: lichborneSpec === key ? spec.glow : '#87CEEB' }}></i>
                                                </button>
                                            ))}
                                    </div>
                                    <div className="spec-passive-text">
                                        {getSpecPassive()}
                                    </div>
                                </div>
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
                                <div className="menu-title">Specialization</div>
                                <div className="spec-row">
                                    {Object.entries(phases)
                                        .filter(([key]) => key === 'moonlight_sentinel' || key === 'starfall_invoker' || key === 'lunar_guardian')
                                        .map(([key, spec]) => (
                                            <div
                                                key={key}
                                                className={`spec-option ${lunarchSpec === key ? 'selected' : ''}`}
                                                onClick={() => setLunarchSpec(key)}
                                            >
                                                <i className={`fas ${spec.icon}`}></i>
                                                <span>{spec.name}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
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
                                        {showNoteMenus[index] && document.body && ReactDOM.createPortal(
                                            <div className="note-adjustment-menu" onClick={(e) => e.stopPropagation()} style={{
                                                position: 'fixed',
                                                top: minstrelBarRef.current ? minstrelBarRef.current.getBoundingClientRect().bottom + 8 : '50%',
                                                left: minstrelBarRef.current ? minstrelBarRef.current.getBoundingClientRect().left + (index * (minstrelBarRef.current.getBoundingClientRect().width / notes.length)) + ((minstrelBarRef.current.getBoundingClientRect().width / notes.length) / 2) : '50%',
                                                transform: minstrelBarRef.current ? 'translateX(-50%)' : 'translate(-50%, -50%)'
                                            }}>
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
                                            </div>,
                                            document.body
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
                            {showMinstrelSpecMenu && document.body && ReactDOM.createPortal(
                                <div className="minstrel-spec-menu" onClick={(e) => e.stopPropagation()} style={{
                                    position: 'fixed',
                                    top: minstrelBarRef.current ? minstrelBarRef.current.getBoundingClientRect().bottom + 8 : '50%',
                                    left: minstrelBarRef.current ? minstrelBarRef.current.getBoundingClientRect().right - 10 : '50%',
                                    transform: minstrelBarRef.current ? 'translateX(-100%)' : 'translate(-50%, -50%)'
                                }}>
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
                                </div>,
                                document.body
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

                            <div className="menu-section">
                                <div className="menu-title">Specialization</div>
                                <div className="spec-icons-row">
                                    {['seer', 'truthseeker', 'fateweaver'].map((spec) => {
                                        const specConfig = specs[spec];
                                        const isSelected = oracleSpec === spec;
                                        return (
                                            <div
                                                key={spec}
                                                className={`spec-icon-option ${isSelected ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setOracleSpec(spec);
                                                }}
                                                title={`${specConfig.name}: ${specConfig.theme}`}
                                            >
                                                <i className={`fas ${specConfig.icon}`}></i>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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
                                <div className="menu-title" style={{ color: specColors.activeColor }}>
                                    {specData?.name || martyrSpec}
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
                                                    borderColor: isSelected ? 'rgba(139, 105, 60, 0.8)' : 'rgba(139, 105, 60, 0.4)',
                                                    background: isSelected
                                                        ? 'linear-gradient(135deg, rgba(139, 105, 60, 0.4) 0%, rgba(120, 90, 50, 0.4) 100%)'
                                                        : 'linear-gradient(135deg, rgba(240, 230, 210, 0.6) 0%, rgba(232, 220, 192, 0.6) 100%)',
                                                    boxShadow: isSelected ? 'inset 0 0 8px rgba(139, 105, 60, 0.3)' : 'none'
                                                }}
                                            >
                                                <i
                                                    className="fas fa-cross"
                                                    style={{
                                                        color: isSelected ? '#8b5a3c' : '#5a4a3a'
                                                    }}
                                                ></i>
                                                <span style={{
                                                    color: isSelected ? '#8b5a3c' : '#5a4a3a',
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
                        <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip">
                            <div className="tooltip-header">Devotion</div>

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
                                            <strong>Shared:</strong> {specData.sharedPassive.description}<br/>
                                            <strong>Unique:</strong> {specData.uniquePassive.description}
                                        </div>
                                    </div>
                                </div>
                            )}
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
        const { isRolling, diceButtonMode, showRollTooltip } = arcanoneerState;
        const setShowRollTooltip = (value) => setArcanoneerState(prev => ({ ...prev, showRollTooltip: value }));

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
            setArcanoneerState(prev => ({ ...prev, isRolling: true }));
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
                setArcanoneerState(prev => ({ ...prev, localSpheres: [...activeSpheres, ...newSpheres], isRolling: false }));
            }, 500); // Animation delay
        };

        // Cycle dice button mode
        const cycleDiceButtonMode = () => {
            const modes = ['roll', 'spec'];
            // Add spec-specific modes
            if (activeSpecialization === 'prism-mage') {
                modes.splice(1, 0, 'prism-reroll');
            } else if (activeSpecialization === 'sphere-architect') {
                modes.splice(1, 0, 'architect-swap');
            }
            // For entropy weaver, no additional button needed as chaos effects are automatic

            const currentIndex = modes.indexOf(diceButtonMode);
            const nextIndex = (currentIndex + 1) % modes.length;
            setArcanoneerState(prev => ({ ...prev, diceButtonMode: modes[nextIndex] }));
        };

        // Handle dice button click based on mode
        const handleDiceButtonClick = (e) => {
            e.stopPropagation();
            if (diceButtonMode === 'roll') {
                rollSpheres();
            } else if (diceButtonMode === 'spec') {
                // Cycle specialization
                const specs = ['prism-mage', 'entropy-weaver', 'sphere-architect'];
                const currentIndex = specs.indexOf(activeSpecialization);
                const nextIndex = (currentIndex + 1) % specs.length;
                setActiveSpecialization(specs[nextIndex]);
                setRerollsUsed(0);
                setSelectedForSwap([]);
                setSwapMode(false);
            } else if (diceButtonMode === 'prism-reroll') {
                // Reroll sphere (Prism Mage)
                if (activeSpheres.length > 0) {
                    const randomIndex = Math.floor(Math.random() * activeSpheres.length);
                    rerollSphere(randomIndex);
                }
            } else if (diceButtonMode === 'architect-swap') {
                // Toggle swap mode (Sphere Architect)
                setSwapMode(!swapMode);
                setSelectedForSwap([]);
            }
        };

        // Clear all spheres
        const clearSpheres = () => {
            setArcanoneerState(prev => ({ ...prev, localSpheres: [] }));
        };

        // Remove a sphere (simulate spending)
        const removeElement = (elementId) => {
            const index = activeSpheres.indexOf(elementId);
            if (index > -1) {
                const newSpheres = [...activeSpheres];
                newSpheres.splice(index, 1);
                setArcanoneerState(prev => ({ ...prev, localSpheres: newSpheres }));
            }
        };

        // Reroll spheres (Prism Mage)
        const rerollSphere = (index) => {
            if (activeSpecialization !== 'prism-mage') return;

            const newSpheres = [...activeSpheres];
            const roll = Math.floor(Math.random() * 8) + 1;
            const element = finalConfig.elements?.find(el => el.d8Value === roll);
            if (element) {
                newSpheres[index] = element.id;
                setArcanoneerState(prev => ({ ...prev, localSpheres: newSpheres }));
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
                    setArcanoneerState(prev => ({ ...prev, localSpheres: newSpheres }));
                }
                setSelectedForSwap([]);
                setSwapMode(false);
            }
        };


        return (
            <div
                className={`elemental-spheres-container ${size}`}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Right-click on the bar removes one sphere (if any exist)
                    if (activeSpheres.length > 0) {
                        removeElement(activeSpheres[activeSpheres.length - 1]);
                    }
                }}
            >
                {/* Creative specialization selector for large size */}
                {size === 'large' && (
                    <div className="sphere-top-controls">
                        <div className="specialization-selector">
                            <button
                                className={`spec-button ${activeSpecialization === 'prism-mage' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveSpecialization('prism-mage');
                                    setRerollsUsed(0);
                                    setSelectedForSwap([]);
                                    setSwapMode(false);
                                }}
                                title="Prism Mage - Crystal focus and precise control"
                            >
                                <i className="fas fa-gem"></i>
                                <span className="spec-label">Prism</span>
                            </button>

                            <button
                                className={`spec-button ${activeSpecialization === 'entropy-weaver' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveSpecialization('entropy-weaver');
                                    setRerollsUsed(0);
                                    setSelectedForSwap([]);
                                    setSwapMode(false);
                                }}
                                title="Entropy Weaver - Chaotic power and randomness"
                            >
                                <i className="fas fa-dice"></i>
                                <span className="spec-label">Entropy</span>
                            </button>

                            <button
                                className={`spec-button ${activeSpecialization === 'sphere-architect' ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveSpecialization('sphere-architect');
                                    setRerollsUsed(0);
                                    setSelectedForSwap([]);
                                    setSwapMode(false);
                                }}
                                title="Sphere Architect - Strategic construction and manipulation"
                            >
                                <i className="fas fa-cogs"></i>
                                <span className="spec-label">Architect</span>
                            </button>
                        </div>
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
                                            e.stopPropagation();
                                            if (e.button === 0) { // Left click - add orb
                                                setArcanoneerState(prev => ({ ...prev, localSpheres: [...localSpheres, element.id] }));
                                            }
                                        }}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            // Right click - remove orb (if active)
                                            if (isActive) {
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
                                            cursor: 'pointer'
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
                                onClick={handleDiceButtonClick}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    cycleDiceButtonMode();
                                }}
                                onMouseEnter={() => setShowRollTooltip(true)}
                                onMouseLeave={() => setShowRollTooltip(false)}
                                disabled={
                                    (isRolling && diceButtonMode === 'roll') ||
                                    (diceButtonMode === 'prism-reroll' && activeSpheres.length === 0) ||
                                    (diceButtonMode === 'architect-swap' && activeSpheres.length < 2)
                                }
                            >
                                <i className={`fas ${
                                    diceButtonMode === 'roll' ? 'fa-dice' :
                                    diceButtonMode === 'spec' ? 'fa-exchange-alt' :
                                    diceButtonMode === 'prism-reroll' ? 'fa-sync-alt' :
                                    'fa-arrows-alt' // architect-swap
                                }`}></i>
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
                                onClick={handleDiceButtonClick}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    cycleDiceButtonMode();
                                }}
                                onMouseEnter={() => setShowRollTooltip(true)}
                                onMouseLeave={() => setShowRollTooltip(false)}
                                disabled={
                                    (isRolling && diceButtonMode === 'roll') ||
                                    (diceButtonMode === 'prism-reroll' && activeSpheres.length === 0) ||
                                    (diceButtonMode === 'architect-swap' && activeSpheres.length < 2)
                                }
                            >
                                <i className={`fas ${
                                    diceButtonMode === 'roll' ? 'fa-dice' :
                                    diceButtonMode === 'spec' ? 'fa-exchange-alt' :
                                    diceButtonMode === 'prism-reroll' ? 'fa-sync-alt' :
                                    'fa-arrows-alt' // architect-swap
                                }`}></i>
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

                </div>
            </div>
        );
    };

    // Arcanoneer Roll Button Tooltip
    const renderArcanoneerRollTooltip = () => {
        if (!arcanoneerState.showRollTooltip || finalConfig.visual?.type !== 'elemental-spheres') return null;

        const { isRolling, diceButtonMode } = arcanoneerState;
        const diceCount = activeSpecialization === 'entropy-weaver' ? 5 : 4;

        return (
            <TooltipPortal>
                <div 
                    ref={tooltipRef} 
                    className="unified-resourcebar-tooltip pathfinder-tooltip"
                >
                    {diceButtonMode === 'roll' && (
                        <>
                            <div className="tooltip-header">Roll Elemental Spheres</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Dice:</strong> {diceCount}d8
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Result:</strong> {isRolling ? 'Rolling...' : 'Gain spheres based on roll'}
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Roll Management</div>
                                <div className="level-management">
                                    <strong>Roll:</strong>
                                    <span>Click to roll {diceCount}d8</span>
                                    <strong>Cycle:</strong>
                                    <span>Right-click to change mode</span>
                                </div>
                            </div>
                        </>
                    )}
                    {diceButtonMode === 'spec' && (
                        <>
                            <div className="tooltip-header">Switch Specialization</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem' }}>
                                    Right-click to cycle between specializations
                                </div>
                            </div>
                        </>
                    )}
                    {diceButtonMode === 'prism-reroll' && (
                        <>
                            <div className="tooltip-header">Reroll Sphere</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem' }}>
                                    Click to reroll a selected sphere
                                </div>
                            </div>
                        </>
                    )}
                    {diceButtonMode === 'architect-swap' && (
                        <>
                            <div className="tooltip-header">Swap Spheres</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem' }}>
                                    Click two spheres to swap them
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </TooltipPortal>
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
                    <div className="rage-bar-container" ref={rageBarRef} onMouseEnter={handleRageBarEnter} onMouseLeave={handleRageBarLeave} onClick={(e) => {
                        e.stopPropagation();
                        setShowRageMenu((v) => !v);
                    }} style={{ cursor: 'pointer' }}>
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
        // Use actual character resource values for account context, local state for HUD
        const momentumValue = context === 'account'
            ? (finalClassResource?.momentum?.current ?? finalClassResource?.current ?? 0)
            : localMomentum;
        const flourishValue = context === 'account'
            ? (finalClassResource?.flourish?.current ?? 0)
            : localFlourish;
        const momentumMax = finalConfig.mechanics?.momentum?.max || 20;
        const flourishMax = finalConfig.mechanics?.flourish?.max || 5;
        const momentumPercentage = (momentumValue / momentumMax) * 100;
        const flourishPercentage = (flourishValue / flourishMax) * 100;

        const stances = finalConfig.visual?.stances || {};
        const stanceNetwork = finalConfig.stanceNetwork || {};
        const transitionCosts = finalConfig.transitionCosts || {};

        // Get available transitions from current stance
        let availableTransitions = stanceNetwork[stanceValue] || [];

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

        // Handle stance transition (only for HUD context)
        const transitionToStance = (targetStance) => {
            if (context === 'account' || !availableTransitions.includes(targetStance)) return;

            const cost = getTransitionCost(stanceValue, targetStance);
            if (momentumValue >= cost) {
                setLocalMomentum(momentumValue - cost);
                setCurrentStance(targetStance);
                setShowStanceMenu(false);
            }
        };

        const currentStanceData = stances[stanceValue] || {};

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
                            if (context === 'account') return;
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
                                width: momentumValue > 0 ? `${momentumPercentage}%` : '4px',
                                backgroundColor: momentumValue > 0 ? finalConfig.visual.momentum.activeColor : 'rgba(52, 152, 219, 0.3)',
                                boxShadow: momentumValue > 0 ? `0 0 6px ${finalConfig.visual.momentum.glowColor}` : 'none'
                            }}
                        />
                        <span className="resource-value-left">{momentumValue}</span>
                    </div>

                    {/* Stance Icon (Center) */}
                    <div
                        className="stance-icon-center"
                        onClick={(e) => {
                            if (context === 'account') return;
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
                    >
                        <div className="stance-center-ornament">
                            <div className="stance-center-circle"></div>
                            <div className="stance-center-lines">
                                <div className="stance-line stance-line-1"></div>
                                <div className="stance-line stance-line-2"></div>
                                <div className="stance-line stance-line-3"></div>
                                <div className="stance-line stance-line-4"></div>
                            </div>
                            <i className={currentStanceData.icon} style={{ color: currentStanceData.color }}></i>
                        </div>
                    </div>

                    {/* Flourish Bar (Right) */}
                    <div
                        className="flourish-bar-right"
                        onClick={(e) => {
                            if (context === 'account') return;
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
                                width: flourishValue > 0 ? `${flourishPercentage}%` : '4px',
                                backgroundColor: flourishValue > 0 ? finalConfig.visual.flourish.activeColor : 'rgba(243, 156, 18, 0.3)',
                                boxShadow: flourishValue > 0 ? `0 0 6px ${finalConfig.visual.flourish.glowColor}` : 'none'
                            }}
                        />
                        <span className="resource-value-right">{flourishValue}</span>
                    </div>

                    {/* Momentum Adjustment Menu */}
                    {showMomentumMenu && context !== 'account' && (
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
                    {showFlourishMenu && context !== 'account' && (
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
                    {showStanceMenu && context !== 'account' && (
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
                                    const cost = getTransitionCost(stanceValue, stanceName);
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
                                                background: selectedSpecialization === spec 
                                                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(139, 69, 19, 0.15) 100%)' 
                                                    : 'linear-gradient(135deg, rgba(245, 245, 220, 0.95) 0%, rgba(240, 240, 210, 0.9) 100%)',
                                                border: selectedSpecialization === spec 
                                                    ? '2px solid rgba(139, 69, 19, 0.8)' 
                                                    : '1px solid rgba(139, 69, 19, 0.4)',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                color: selectedSpecialization === spec ? '#3a0e08' : '#5a1e12',
                                                fontFamily: "'Crimson Text', serif",
                                                fontSize: '10px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedSpecialization !== spec) {
                                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(240, 240, 210, 0.95) 100%)';
                                                    e.currentTarget.style.borderColor = 'rgba(139, 69, 19, 0.6)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedSpecialization !== spec) {
                                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 245, 220, 0.95) 0%, rgba(240, 240, 210, 0.9) 100%)';
                                                    e.currentTarget.style.borderColor = 'rgba(139, 69, 19, 0.4)';
                                                }
                                            }}
                                        >
                                            <div style={{ fontWeight: 700, fontSize: '11px', color: selectedSpecialization === spec ? '#3a0e08' : '#5a1e12' }}>{spec}</div>
                                            <div style={{ fontSize: '9px', color: selectedSpecialization === spec ? '#5a1e12' : '#6b4423', opacity: 1 }}>{passive}</div>
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
                        marginBottom: '0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0',
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

        // Hide tooltip when menus are open to prevent conflicts
        if (showWIMenu || showSynergyMenu) return null;

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
            (modifiedConfig.type !== 'rage' && modifiedConfig.type !== 'dual-resource' && modifiedConfig.visual?.type !== 'mayhem-modifiers' && modifiedConfig.visual?.type !== 'time-shards-strain' && modifiedConfig.visual?.type !== 'ascension-blood' && modifiedConfig.visual?.type !== 'hexbreaker-charges' && modifiedConfig.visual?.type !== 'drp-resilience' && modifiedConfig.visual?.type !== 'dominance-die' && modifiedConfig.visual?.type !== 'madness-gauge' && modifiedConfig.visual?.type !== 'threads-of-destiny' && modifiedConfig.visual?.type !== 'fortune-points-gambling' && modifiedConfig.visual?.type !== 'quarry-marks-companion' && modifiedConfig.visual?.type !== 'runes-inscriptions' && modifiedConfig.visual?.type !== 'musical-notes-combo' && modifiedConfig.visual?.type !== 'prophetic-visions' && modifiedConfig.visual?.type !== 'vengeance-points' && modifiedConfig.visual?.type !== 'eternal-frost-phylactery' && modifiedConfig.tooltip?.description) ||
            (finalConfig.type === 'spheres' && sphereCount > 0) ||
            (finalConfig.type === 'dual-resource' && bladedancerHoverSection) ||
            (finalConfig.visual?.type === 'time-shards-strain' && chronarchHoverSection) ||
            (finalConfig.visual?.type === 'hexbreaker-charges' && covenbaneHoverSection) ||
            (finalConfig.visual?.type === 'ascension-blood' && deathcallerHoverSection) ||
            (finalConfig.visual?.type === 'drp-resilience' && dreadnaughtHoverSection === 'drp') ||
            (finalConfig.visual?.type === 'dominance-die' && exorcistHoverSection === 'dominance') ||
            (finalConfig.visual?.type === 'madness-gauge' && falseProphetHoverSection === 'madness') ||
            (finalConfig.visual?.type === 'threads-of-destiny' && fateWeaverHoverSection) ||
            (finalConfig.visual?.type === 'wild-instinct-forms' && formbenderHoverSection) ||
            (finalConfig.visual?.type === 'fortune-points-gambling' && gamblerHoverSection === 'fp') ||
            (finalConfig.visual?.type === 'quarry-marks-companion' && huntressHoverSection) ||
            (finalConfig.visual?.type === 'runes-inscriptions' && inscriptorHoverSection) ||
            (finalConfig.visual?.type === 'eternal-frost-phylactery' && lichborneHoverSection === 'phylactery' && lichborneHoverSection !== 'aura') ||
            (finalConfig.visual?.type === 'lunar-phases' && lunarchHoverSection) ||
            (finalConfig.visual?.type === 'prophetic-visions' && oracleHoverSection) ||
            (finalConfig.visual?.type === 'mayhem-modifiers' && chaosWeaverHoverSection) ||
            (finalConfig.visual?.type === 'musical-notes-combo' && minstrelHoverSection && minstrelHoverSection.startsWith('note-')) ||
            (finalConfig.visual?.type === 'totemic-synergy') ||
            (finalConfig.type === 'rage' && finalConfig.rageStates);

        if (!hasTooltipContent) {
            return null;
        }

        return (
            <TooltipPortal>
                <div 
                    ref={tooltipRef} 
                    className="unified-resourcebar-tooltip pathfinder-tooltip"
                >
                    {modifiedConfig.type !== 'rage' && modifiedConfig.type !== 'dual-resource' && modifiedConfig.visual?.type !== 'mayhem-modifiers' && modifiedConfig.visual?.type !== 'time-shards-strain' && modifiedConfig.visual?.type !== 'ascension-blood' && modifiedConfig.visual?.type !== 'hexbreaker-charges' && modifiedConfig.visual?.type !== 'drp-resilience' && modifiedConfig.visual?.type !== 'dominance-die' && modifiedConfig.visual?.type !== 'madness-gauge' && modifiedConfig.visual?.type !== 'threads-of-destiny' && modifiedConfig.visual?.type !== 'fortune-points-gambling' && modifiedConfig.visual?.type !== 'quarry-marks-companion' && modifiedConfig.visual?.type !== 'runes-inscriptions' && modifiedConfig.visual?.type !== 'musical-notes-combo' && modifiedConfig.visual?.type !== 'prophetic-visions' && modifiedConfig.visual?.type !== 'vengeance-points' && modifiedConfig.visual?.type !== 'eternal-frost-phylactery' && modifiedConfig.tooltip?.description && (
                        <>
                            <div className="tooltip-header">{tooltipTitle || modifiedConfig.visual?.name || 'Class Resource'}</div>
                            <div className="tooltip-section">
                                {modifiedConfig.tooltip.description}
                            </div>
                        </>
                    )}

                    {/* Simple sphere count */}
                    {finalConfig.type === 'spheres' && sphereCount > 0 && (
                        <>
                            <div className="tooltip-header">Elemental Spheres</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Banked:</strong> {sphereCount} sphere{sphereCount !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Bladedancer Tooltips */}
                    {finalConfig.type === 'dual-resource' && bladedancerHoverSection && (
                        <div>
                            {bladedancerHoverSection === 'momentum' && (
                                <>
                                    <div className="tooltip-header">Momentum</div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {localMomentum}/20
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

                            {bladedancerHoverSection === 'flourish' && (
                                <>
                                    <div className="tooltip-header">Flourish</div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {localFlourish}/5
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

                            {bladedancerHoverSection === 'stance' && (() => {
                                const stances = finalConfig.visual?.stances || {};
                                const currentStanceData = stances[stanceValue] || {};
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
                                                    ⭐ {specBonus}
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
                                            <strong>Current:</strong> {localTimeShards}/10 shards
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
                                                        Lose next turn, take 10 damage, strain resets to 0
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
                                        <div className="tooltip-header">Hexbreaker Charges</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {chargesValue}/6 charges
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
                                                <span>Shadow Step (1), Curse Eater (2), Dark Pursuit (3), Fury (6)</span>
                                            </div>
                                        </div>

                                        {chargesValue === 6 && (
                                            <div>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Ultimate Ready</div>
                                                    <div className="passive-desc">
                                                        Hexbreaker Fury: AoE damage (30ft), stun all enemies
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
                                            <strong>Current:</strong> {localAttackCounter}/3 attacks
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <strong>Every 3rd attack:</strong> Deals bonus true damage
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">True Damage Scaling</div>
                                        <div className="passive-desc">
                                            Base: +1d6 true damage<br/>
                                            At 6 charges: +4d8 true damage
                                        </div>
                                    </div>

                                    {localAttackCounter === 3 && (
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
                                const activePaths = localAscensionPaths.filter(p => p).length;
                                const activePathsList = finalConfig.paths.filter((_, i) => localAscensionPaths[i]);

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
                                                        <div key={i} style={{ fontSize: '0.85rem', marginTop: '4px', color: 'rgba(178, 34, 52, 1)' }}>
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
                                                    <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(101, 67, 33, 0.7)' }}>
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
                                                    <div className="tooltip-label" style={{ color: 'rgba(220, 20, 60, 1)' }}>
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
                                                color: '#FF6B6B',
                                                marginTop: '6px',
                                                padding: '4px',
                                                background: 'rgba(255, 107, 107, 0.1)',
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
                                        <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(101, 67, 33, 0.7)' }}>
                                            Need <strong>10+ DRP</strong> to activate passive benefits
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Totemic Synergy Tooltip */}
                    {finalConfig.visual?.type === 'totemic-synergy' && (
                        <>
                            <div className="tooltip-header">Totemic Synergy</div>

                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Current:</strong> {localSynergy}/100 Synergy
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Totems:</strong> {activeTotems}/8 active
                                </div>
                            </div>

                            <div className="tooltip-divider"></div>

                            <div className="tooltip-section">
                                <div className="tooltip-label">Synergy Management</div>
                                <div className="level-management">
                                    <strong>Gain:</strong>
                                    <span>+1 per totem placed, +1 per totem per turn</span>
                                    <strong>Spend:</strong>
                                    <span>Variable (4-10 per synergy effect)</span>
                                </div>
                            </div>
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
                                                <strong>Progression:</strong> d12 → d10 → d8 → d6 → 0
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
                                            <div style={{ fontSize: '0.85rem', marginTop: '4px', color: 'rgba(178, 34, 52, 1)' }}>
                                                Fail: Demon escapes
                                            </div>
                                        </div>

                                        {currentDD <= 6 && currentDD > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label" style={{ color: currentDD === 6 ? 'rgba(220, 20, 60, 1)' : 'rgba(255, 140, 0, 1)' }}>
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
                                                    <div className="tooltip-label" style={{ color: 'rgba(220, 20, 60, 1)' }}>
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
                                <div style={{ fontSize: '0.85rem', color: 'rgba(220, 20, 60, 1)', marginTop: '4px' }}>
                                    <strong>15:</strong> DANGER ZONE
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(220, 20, 60, 1)' }}>
                                    <strong>20:</strong> INSANITY CONVULSION
                                </div>
                            </div>
                            {localMadness >= 15 && (
                                <>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label" style={{ color: localMadness === 20 ? 'rgba(220, 20, 60, 1)' : 'rgba(255, 140, 0, 1)' }}>
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
                                                <div style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '4px', color: 'rgba(101, 67, 33, 0.8)' }}>
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

                    {/* Formbender Wild Instinct Tooltips */}
                    {finalConfig.visual?.type === 'wild-instinct-forms' && formbenderHoverSection && (
                        <div>
                            {formbenderHoverSection === 'wi' && (
                                <>
                                    <div className="tooltip-header">Wild Instinct</div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {localWildInstinct}/15
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            Primal energy for shapeshifting and feral abilities.
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Wild Instinct Management</div>
                                        <div className="level-management">
                                            <strong>Gain:</strong>
                                            <span>Combat actions, stealth, taunting, scouting, tracking</span>
                                            <strong>Spend:</strong>
                                            <span>Transform (1 WI), Abilities (1-5 WI), First transform free</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {formbenderHoverSection === 'form' && (
                                <>
                                    <div className="tooltip-header">
                                        {finalConfig.visual.forms[currentForm]?.name || 'Human'} Form
                                    </div>

                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                                            {finalConfig.visual.forms[currentForm]?.description || 'Human form with no special abilities.'}
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Wild Instinct Generation</div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                            {finalConfig.visual.forms[currentForm]?.generation || 'None'}
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Form Passive</div>
                                        <div className="passive-desc">
                                            {finalConfig.visual.forms[currentForm]?.passive || 'No bonuses'}
                                        </div>
                                    </div>
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
                        <div>
                                <div className="tooltip-header">Fortune Points</div>

                                <div className="tooltip-section">
                                    <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                        <strong>Current:</strong> {localFortunePoints}/{maxFP} points
                                    </div>
                                    <div style={{ fontSize: '0.9rem' }}>
                                        <strong>Style:</strong> {currentSpec.name}
                                    </div>
                                </div>

                                <div className="tooltip-divider"></div>

                                <div className="tooltip-section">
                                    <div className="tooltip-label">Point Management</div>
                                    <div className="level-management">
                                        <strong>Gain:</strong>
                                        <span>Successful attacks/spells (+1), crits (+2)</span>
                                        <strong>Spend:</strong>
                                        <span>Adjust rolls (±1 per point)</span>
                                    </div>
                                </div>

                                <div className="tooltip-divider"></div>

                                <div className="tooltip-section">
                                    <div className="tooltip-label">{currentSpec.name} Specialty</div>
                                    <div className="passive-desc">
                                        {currentSpec.useCase}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Huntress Quarry Marks & Companion Tooltip */}
                    {finalConfig.visual?.type === 'quarry-marks-companion' && huntressHoverSection && (
                        <div>
                            {huntressHoverSection === 'marks' && (() => {
                                const specName = huntressSpec === 'bladestorm' ? 'Bladestorm' : huntressSpec === 'beastmaster' ? 'Beastmaster' : 'Shadowdancer';
                                const specUltimate = huntressSpec === 'bladestorm' ? 'Glaive Storm' : huntressSpec === 'beastmaster' ? 'Primal Fury' : 'Shadow Assault';

                                return (
                                    <>
                                        <div className="tooltip-header">Quarry Marks</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {localQuarryMarks}/5 marks
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Style:</strong> {specName}
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Mark Management</div>
                                            <div className="level-management">
                                                <strong>Gain:</strong>
                                                <span>Hits (+1), crits (+2) with glaive/companion</span>
                                                <strong>Spend:</strong>
                                                <span>Enhance companion (1-5 marks)</span>
                                            </div>
                                        </div>

                                        {localQuarryMarks === 5 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Ultimate Ready</div>
                                                    <div className="passive-desc">
                                                        {specUltimate} - Spend all 5 marks
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}

                            {huntressHoverSection === 'spec' && (() => {
                                const companionType = huntressSpec === 'bladestorm' ? 'War Owl' : huntressSpec === 'beastmaster' ? 'Dire Wolf' : 'Shadow Panther';
                                const companionSpecial = huntressSpec === 'bladestorm' ? 'Aerial Strike' : huntressSpec === 'beastmaster' ? 'Pack Tactics' : 'Stealth Pounce';
                                const specName = huntressSpec === 'bladestorm' ? 'Bladestorm' : huntressSpec === 'beastmaster' ? 'Beastmaster' : 'Shadowdancer';

                                return (
                                    <>
                                        <div className="tooltip-header">{companionType}</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>HP:</strong> {companionHP}/{companionMaxHP}
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Special:</strong> {companionSpecial} (3 marks)
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">{specName} Traits</div>
                                            <div className="passive-desc">
                                                {huntressSpec === 'bladestorm' && 'Glaive chains to nearby enemies. +1 chain per 2 marks spent.'}
                                                {huntressSpec === 'beastmaster' && 'Companion has +50% HP. Companion attacks twice per command.'}
                                                {huntressSpec === 'shadowdancer' && '+2d6 damage from stealth. Companion can stealth.'}
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Companion Features</div>
                                            <div className="passive-desc">
                                                Generates marks on hit. Telepathic bond (100ft). Shares your initiative.
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Inscriptor Runes & Inscriptions Tooltip */}
                    {finalConfig.visual?.type === 'runes-inscriptions' && inscriptorHoverSection && (
                        <div>
                            {inscriptorHoverSection === 'runes' && (() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[inscriptorSpec] || specs.enchanter;
                                const specName = currentSpec.name;
                                const maxRunes = currentSpec.maxRunes;

                                return (
                                    <>
                                        <div className="tooltip-header">Runes</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {localRunes}/{maxRunes} runes
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Style:</strong> {specName}
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Rune Management</div>
                                            <div className="level-management">
                                                <strong>Place:</strong>
                                                <span>3 mana per rune (1 action, 1 min)</span>
                                                <strong>Activate:</strong>
                                                <span>3+ runes form zone</span>
                                            </div>
                                        </div>

                                        {inscriptorSpec === 'glyphweaver' && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Volatile Runes</div>
                                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                        Auto-detonate after 30s (+3d8 damage)
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}

                            {inscriptorHoverSection === 'inscriptions' && (() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[inscriptorSpec] || specs.enchanter;
                                const specName = currentSpec.name;
                                const maxInscriptions = currentSpec.maxInscriptions;

                                return (
                                    <>
                                        <div className="tooltip-header">Inscriptions: {localInscriptions}/{maxInscriptions} {specName.toUpperCase()}</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {localInscriptions}/{maxInscriptions} inscriptions
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Inscription Management</div>
                                            <div className="level-management">
                                                <strong>Generate:</strong>
                                                <span>At combat start, choose slots{inscriptorSpec === 'enchanter' ? ' (lasts day)' : ' (lasts combat)'}</span>
                                                <strong>Use:</strong>
                                                <span>Enhance equipment{inscriptorSpec === 'enchanter' ? ' (double effect)' : ''}</span>
                                            </div>
                                        </div>

                                        {inscriptorSpec === 'enchanter' && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label" style={{ color: '#FFD700' }}>Master Enchanter</div>
                                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                        All 6 slots. Double bonuses. Can inscribe allies (1 item).
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
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
                                                <strong>Store:</strong>
                                                <span>Ritual transfer 10 HP (1 hour), +10 HP per rest</span>
                                                <strong>Resurrect:</strong>
                                                <span>{lichborneSpec === 'phylactery_guardian' ? '8 HP' : '10 HP'} cost, once per combat</span>
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">{specName}</div>
                                            <div className="passive-desc">
                                                {lichborneSpec === 'frostbound_tyrant' && 'Freeze effects last +1d4 rounds. Frozen enemies take +1d6 damage.'}
                                                {lichborneSpec === 'spectral_reaper' && 'Frost spells deal +1d6 necrotic damage. Enemies killed have 1/6 chance to rise as spectral minions (1d4 rounds).'}
                                                {lichborneSpec === 'phylactery_guardian' && 'Phylactery stores 75 HP. Resurrection costs 8 HP, revives at 15 HP.'}
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
                                            <span>New → Waxing → Full → Waning</span>
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
                        <div>
                            {(() => {
                                const rageValue = localRage;
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

                    {/* Chaos Weaver Tooltips */}
                    {finalConfig.visual?.type === 'mayhem-modifiers' && chaosWeaverHoverSection && (
                        <div>
                            {chaosWeaverHoverSection === 'modifiers' && (
                                <>
                                    <div className="tooltip-header">Mayhem Modifiers</div>

                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {localModifiers}/20 modifiers
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <strong>Each modifier:</strong> ±1 to chaos table results
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Modifier Management</div>
                                        <div className="level-management">
                                            <strong>Generate:</strong>
                                            <span>Chaotic spells (1d4-2d4 per spell)</span>
                                            <strong>Spend:</strong>
                                            <span>Adjust chaos table results (±1 each)</span>
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
    const isFateWeaver = modifiedConfig.visual?.type === 'threads-of-destiny';
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
                ref={resourceBarWrapperRef}
                className={`class-resource-wrapper ${isGMMode ? 'clickable' : ''}`}
                onMouseEnter={!isArcanoneer && !isBerserker && !isBladedancer && !isChaosWeaver && !isChronarch && !isDeathcaller && !isDreadnaught && !isExorcist && !isFalseProphet && !isFateWeaver && !isGambler && !isHuntress && !isInscriptor && !isLichborne && !isLunarch && !isMartyr && !isMinstrel && !isOracle && !isPlaguebearer && !isPrimalist && !isPyrofiend && !isSpellguard && !isTitan && !isWarden && !isWitchDoctor ? handleMouseEnter : undefined}
                onMouseLeave={!isArcanoneer && !isBerserker && !isBladedancer && !isChaosWeaver && !isChronarch && !isDeathcaller && !isDreadnaught && !isExorcist && !isFalseProphet && !isFateWeaver && !isGambler && !isHuntress && !isInscriptor && !isLichborne && !isLunarch && !isMartyr && !isMinstrel && !isOracle && !isPlaguebearer && !isPrimalist && !isPyrofiend && !isSpellguard && !isTitan && !isWarden && !isWitchDoctor ? handleMouseLeave : undefined}
                onMouseMove={!isArcanoneer && !isBerserker && !isBladedancer && !isChaosWeaver && !isChronarch && !isDeathcaller && !isDreadnaught && !isExorcist && !isFalseProphet && !isFateWeaver && !isGambler && !isHuntress && !isInscriptor && !isLichborne && !isLunarch && !isMartyr && !isMinstrel && !isOracle && !isPlaguebearer && !isPrimalist && !isWarden && !isWitchDoctor ? handleMouseMove : undefined}
                onClick={handleClick}
                style={{ cursor: isGMMode ? 'pointer' : 'default' }}
            >
                {renderResourceDisplay()}
                {!isArcanoneer && !isMartyr && renderTooltip()}
                {isArcanoneer && renderArcanoneerRollTooltip()}
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


