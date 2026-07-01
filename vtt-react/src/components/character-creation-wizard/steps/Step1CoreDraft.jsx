/**

 * Step 1: Core Character Draft (Hero Draft)

 * 

 * Combines Name, Gender, Heritage (Race/Subrace), Calling (Class),

 * Background, Point-Buy Stats, Starting Spells, and Portrait/Icon.

 * Uses slide-out drawers for stats and spells, and existing popup for appearance.

 */



import React, { useState, useEffect, useMemo } from 'react';

import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';

import { RACE_DATA, getRacialBaseStats, getRacialSavingThrowModifiers, applyRacialModifiers } from '../../../data/raceData';

import { BACKGROUND_DATA } from '../../../data/backgroundData';

import { formatCurrency } from '../../../data/startingCurrencyData';

import { getCustomIconUrl, getAbilityIconUrl } from '../../../utils/assetManager';

import { getRandomCharacterName } from '../../../utils/nameGenerator';

import CharacterAppearanceModal from '../components/CharacterAppearanceModal';

import ClassIcon from '../../common/ClassIcon';

import UnifiedTooltip from '../../common/UnifiedTooltip';

import { useUnifiedTooltip } from '../../common/useUnifiedTooltip';



// Point buy utilities

import {

    ABILITY_SCORES,

    POINT_BUY_CONFIG,

    increaseStat,

    decreaseStat,

    canIncreaseStat,

    canDecreaseStat,

    calculateAvailablePoints,

    getStatBreakdown,

    getStatPointCost,

    getTotalBonusPoints

} from '../../../utils/pointBuySystem';



// Spell Selection utilities

import { ARCANONEER_DATA } from '../../../data/classes/arcanoneerData';

import { BERSERKER_DATA } from '../../../data/classes/berserkerData';

import { SHAPER_DATA } from '../../../data/classes/shaperData';

import { HARBINGER_DATA } from '../../../data/classes/harbingerData';

import { CHRONARCH_DATA } from '../../../data/classes/chronarchData';

import { INQUISITOR_DATA } from '../../../data/classes/inquisitorData';

import { FALSE_PROPHET_DATA } from '../../../data/classes/falseProphetData';

import { GAMBIT_DATA } from '../../../data/classes/gambitData';

import { APEX_DATA } from '../../../data/classes/apexData';

import { ANIMIST_DATA } from '../../../data/classes/animistData';

// 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
import { REVENANT_DATA } from '../../../data/classes/revenantData';

import { LUNARCH_DATA } from '../../../data/classes/lunarchData';

import { MARTYR_DATA } from '../../../data/classes/martyrData';

import { MINSTREL_DATA } from '../../../data/classes/minstrelData';

import { PLAGUEBRINGER_DATA } from '../../../data/classes/plaguebringerData';

import { PYROFIEND_DATA } from '../../../data/classes/pyrofiendData';

import { SPELLGUARD_DATA } from '../../../data/classes/spellguardData';

import { TOXICOLOGIST_DATA } from '../../../data/classes/toxicologistData';

import { WARDEN_DATA } from '../../../data/classes/wardenData';

import { AUGUR_DATA } from '../../../data/classes/augurData';





import UnifiedSpellCard from '../../spellcrafting-wizard/components/common/UnifiedSpellCard';



// Helper function to map WoW icon IDs to local ability icons for spells

const mapSpellIcon = (wowIconId) => {

  const iconMapping = {

    // Combat/Attack icons

    'ability_meleedamage': 'General/Combat Downward Strike',

    'ability_warrior_savageblow': 'General/Combat Downward Strike',

    'ability_warrior_charge': 'General/Combat Downward Strike',

    'ability_warrior_revenge': 'General/Combat Downward Strike',

    'ability_warrior_cleave': 'General/Combat Downward Strike',

    'ability_warrior_riposte': 'Utility/Parry',

    'ability_warrior_shieldbash': 'Utility/Shield',

    'ability_rogue_evasion': 'Utility/Speed Dash',

    'ability_rogue_feint': 'Utility/Parry',

    'ability_rogue_sprint': 'Utility/Speed Dash',

    'ability_rogue_tricksofthetrade': 'Utility/Speed Dash',

    'ability_stealth': 'Utility/Hide',

    'ability_hunter_snipershot': 'Utility/Target Crosshair',

    'ability_hunter_markedshot': 'Utility/Target Crosshair',

    'ability_hunter_markedfordeath': 'Utility/Target Crosshair',

    

    // Defensive icons

    'inv_shield_05': 'Utility/Shield',

    'inv_shield_04': 'Utility/Shield',

    'ability_warrior_defensivestance': 'Utility/Shield',

    'spell_holy_powerwordshield': 'Utility/Shield',

    'spell_holy_devotionaura': 'Radiant/Divine Blessing',

    

    // Healing/Support icons

    'spell_holy_greaterheal': 'Healing/Golden Heart',

    'spell_holy_heal02': 'Healing/Golden Heart',

    'spell_holy_flashheal': 'Healing/Golden Heart',

    'spell_holy_renew': 'Healing/Renewal',

    

    // Utility icons

    'spell_arcane_portaldalaran': 'Utility/Utility',

    'spell_arcane_teleportundercity': 'Utility/Utility',

    'spell_arcane_arcanetorrent': 'Arcane/Arcane Blast',

    'inv_misc_questionmark': 'Utility/Utility',

    'inv_misc_book_07': 'Utility/Utility',

    'inv_misc_bag_08': 'Utility/Utility',

    

    // Magic/Damage icons

    'spell_fire_fireball02': 'Fire/Swirling Fireball',

    'spell_fire_flamebolt': 'Fire/Flame Burst',

    'spell_frost_frostbolt02': 'Frost/Frozen in Ice',

    'spell_arcane_blast': 'Arcane/Magical Sword',

    'spell_shadow_shadowbolt': 'Shadow/Shadow Darkness',

    'spell_holy_holysmite': 'Radiant/Divine Blessing',

    'spell_nature_lightning': 'Lightning/Lightning Bolt',

    

    // Control icons

    'spell_frost_chainsofice': 'Frost/Frozen in Ice',

    'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',

    

    // Buff icons

    'spell_holy_divineillumination': 'Radiant/Divine Blessing',

    'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',

    

    // Summoning icons

    'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',

    'spell_shadow_summoninfernal': 'Utility/Summon Minion',

    

    // Transformation icons

    'ability_druid_catform': 'Utility/Utility',

    

    // Trap icons

    'spell_fire_selfdestruct': 'Utility/Explosive Detonation',

    

    // Nature icons

    'spell_nature_naturetouchgrow': 'Nature/Gnarled Roots',

    'spell_nature_naturesblessing': 'Nature/Growth',

    

    // Shadow icons

    'spell_shadow_charm': 'Utility/Glowing Hooded Figure',

    

    // Wild magic icons

    'spell_arcane_arcane04': 'Arcane/Magical Sword'

  };

  

  return iconMapping[wowIconId] || null;

};



// Helper function to get spell icon URL using local ability icons

const getSpellIconUrl = (iconId) => {

  if (!iconId) {

    return getCustomIconUrl('Utility/Utility', 'abilities');

  }

  if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {

    return iconId;

  }

  if (iconId.includes('/') && !iconId.startsWith('http')) {

    return getCustomIconUrl(iconId, 'abilities');

  }

  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {

    const mappedIcon = mapSpellIcon(iconId);

    if (mappedIcon) {

      return getCustomIconUrl(mappedIcon, 'abilities');

    }

    return getAbilityIconUrl(iconId);

  }

  return getCustomIconUrl('Utility/Utility', 'abilities');

};



const CLASS_DATA_MAP = {

    'Arcanoneer': ARCANONEER_DATA,

    'Berserker': BERSERKER_DATA,

    'Shaper': SHAPER_DATA,

    'Harbinger': HARBINGER_DATA,

    'Chronarch': CHRONARCH_DATA,

    'Inquisitor': INQUISITOR_DATA,

    // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
    'Revenant': REVENANT_DATA,

    // 'Exorcist' removed (merged into Inquisitor with Covenbane)

    'False Prophet': FALSE_PROPHET_DATA,

    'Gambit': GAMBIT_DATA,

    // 'Formbender' removed (merged into Shaper)

    'Apex': APEX_DATA,

    'Animist': ANIMIST_DATA,

    'Lunarch': LUNARCH_DATA,

    'Martyr': MARTYR_DATA,

    'Minstrel': MINSTREL_DATA,

    'Plaguebringer': PLAGUEBRINGER_DATA,

    'Pyrofiend': PYROFIEND_DATA,

    'Spellguard': SPELLGUARD_DATA,

    'Toxicologist': TOXICOLOGIST_DATA,

    'Warden': WARDEN_DATA,

    'Augur': AUGUR_DATA

};



// Subgroup classifications for all 30 TTRPG classes

const CLASS_GROUPS = {

    MARTIALS: ['Berserker', 'Shaper', 'Spellguard', 'Warden', 'Apex', 'Animist'],

    CASTERS: ['Arcanoneer', 'Harbinger', 'Chronarch', 'Revenant', 'Animist', 'Toxicologist'],

    ZEALOTS: ['Inquisitor', 'False Prophet', 'Lunarch', 'Martyr'],

    SPECIALISTS: ['Minstrel', 'Plaguebringer', 'Pyrofiend', 'Animist', 'Augur', 'Gambit']

};



const getLevel1SpellIds = (classData) => {

    if (!classData) return [];

    if (classData.spellPools && classData.spellPools[1]) return classData.spellPools[1];
    const spellSource = classData.spells || classData.exampleSpells;



    if (spellSource && Array.isArray(spellSource)) {



        return spellSource.filter(spell => spell.level === 1).map(spell => spell.id);
    }

    return [];

};



const ALLOWED_CLASSES_BY_RACE = {

    myrathil: ['Shaper', 'Spellguard', 'Chronarch', 'Animist', 'Lunarch', 'Minstrel', 'Augur'],

    briaran: ['Apex', 'Animist', 'Shaper', 'Lunarch', 'Warden'],

    groven: ['Martyr (Ironclad)', 'Warden', 'Animist', 'Martyr', 'Augur'],

    emberth: ['Berserker', 'Warden', 'Harbinger', 'Martyr', 'Pyrofiend'],

    vreken: ['Shaper', 'Apex', 'Revenant', 'Toxicologist', 'False Prophet', 'Plaguebringer', 'Gambit', 'Inquisitor'],

    neth: ['Martyr (Ironclad)', 'Revenant', 'Harbinger', 'Plaguebringer'],

    astril: ['Spellguard', 'Chronarch', 'Lunarch', 'Inquisitor', 'Augur'],

    fexrick: ['Berserker', 'Animist', 'Shaper', 'Martyr', 'Warden'],

    human: ['Berserker', 'Shaper', 'Martyr (Ironclad)', 'Warden', 'Spellguard', 'Arcanoneer', 'Inquisitor', 'Martyr', 'Minstrel']

};



const ALLOWED_CLASSES_BY_SUBRACE = {

    // Myrathil

    breaker_myrathil: ['Shaper', 'Minstrel', 'Augur', 'Spellguard', 'Chronarch', 'Lunarch'],

    deep_myrathil: ['Chronarch', 'Augur', 'Animist', 'Spellguard', 'Lunarch', 'Shaper'],

    river_myrathil: ['Shaper', 'Animist', 'Lunarch', 'Minstrel', 'Augur', 'Chronarch'],

    // Briaran

    unshorn_briaran: ['Animist', 'Shaper', 'Apex', 'Warden'],

    smoothskinned_briaran: ['Apex', 'Lunarch', 'Animist', 'Shaper', 'Warden'],

    // Emberth

    korr_emberth: ['Berserker', 'Warden', 'Pyrofiend', 'Harbinger', 'Martyr'],

    thrask_emberth: ['Berserker', 'Harbinger', 'Martyr', 'Warden', 'Pyrofiend'],

    // Fexrick

    kethrin_fexric: ['Animist', 'Shaper', 'Berserker', 'Martyr'],

    drall_fexric: ['Berserker', 'Martyr', 'Animist', 'Shaper'],

    // Groven

    morgh_groven: ['Martyr (Ironclad)', 'Martyr', 'Augur', 'Warden', 'Animist'],

    ithran_groven: ['Warden', 'Animist', 'Augur', 'Martyr (Ironclad)', 'Martyr'],

    // Mimir

    maskborne_mimir: ['Arcanoneer', 'Toxicologist', 'Gambit', 'Chronarch', 'Harbinger', 'Augur'],

    mistwoven_mimir: ['Chronarch', 'Augur', 'Gambit', 'Arcanoneer', 'Harbinger', 'Toxicologist'],

    unwoven_mimir: ['Martyr (Ironclad)', 'Harbinger', 'Augur', 'Chronarch', 'Toxicologist', 'Gambit', 'Arcanoneer'],

    // Neth

    velun_neth: ['Revenant', 'Harbinger', 'Martyr (Ironclad)', 'Plaguebringer'],

    kessen_neth: ['Martyr (Ironclad)', 'Plaguebringer', 'Harbinger', 'Revenant'],

    drun_neth: ['Martyr (Ironclad)', 'Revenant', 'Harbinger', 'Plaguebringer'],

    // Astril

    sylen_astril: ['Chronarch', 'Augur', 'Gambit', 'Lunarch', 'Spellguard', 'Inquisitor'],

    muren_astril: ['Spellguard', 'Inquisitor', 'Augur', 'Chronarch', 'Gambit', 'Lunarch'],

    // Vreken

    clean_vreken: ['Shaper', 'Apex', 'Gambit', 'Toxicologist', 'False Prophet', 'Inquisitor'],

    marked_vreken: ['Revenant', 'Toxicologist', 'False Prophet', 'Plaguebringer', 'Inquisitor', 'Gambit', 'Shaper'],

    // Human

    thalren_human: ['Berserker', 'Martyr (Ironclad)', 'Warden', 'Martyr', 'Minstrel', 'Inquisitor'],

    skald_human: ['Berserker', 'Minstrel', 'Martyr', 'Warden', 'Shaper'],

    tessen_human: ['Spellguard', 'Arcanoneer', 'Harbinger', 'Inquisitor', 'Martyr (Ironclad)'],

    solvarn_human: ['Inquisitor', 'Martyr', 'Spellguard', 'Warden', 'Arcanoneer'],

    merryn_human: ['Shaper', 'Gambit', 'Minstrel', 'Warden', 'Harbinger'],

    ordan_human: ['Warden', 'Shaper', 'Gambit', 'Martyr', 'Minstrel'],

    morren_human: ['Shaper', 'Harbinger', 'Gambit', 'Arcanoneer', 'Spellguard']

};



// Check hard heritage restrictions

const isClassCompatible = (className, raceId, subraceId) => {

    if (!raceId) return true;

    if (!subraceId) {

        // Fallback to parent race allowed classes if subrace not yet chosen

        const allowedForRace = ALLOWED_CLASSES_BY_RACE[raceId];

        return allowedForRace ? allowedForRace.includes(className) : false;

    }

    const allowed = ALLOWED_CLASSES_BY_SUBRACE[subraceId];

    return allowed ? allowed.includes(className) : false;

};



const getClassRestrictionMessage = (className) => {

    if (className === 'Inquisitor') return 'Inquisitor requires Marked Vreken heritage or Frostwood Reach heritage.';

    if (className === 'Lunarch') return 'Lunarch requires Briaran heritage.';

    return '';

};



/**
 * Check whether a background is selectable for the given race/subrace.
 * Mirrors isClassCompatible, but with a softer "narrativeUnlock" path:
 *   - unrestricted backgrounds (no allowedSubraces)          -> selectable, normal
 *   - subrace explicitly allowed                              -> selectable, normal
 *   - subrace NOT allowed, narrativeUnlock: true             -> selectable, narrative (DM approval)
 *   - subrace NOT allowed, narrativeUnlock absent/false      -> NOT selectable (hidden)
 *   - race or subrace in hardBlocks                           -> NOT selectable (hidden)
 * Returns { selectable: bool, narrativeUnlock: bool }.
 */
const isBackgroundCompatible = (bg, raceId, subraceId) => {
    if (!bg || !bg.restrictions) return { selectable: true, narrativeUnlock: false };

    const { allowedSubraces = [], hardBlocks, narrativeUnlock } = bg.restrictions;

    // Hard blocks — never selectable (mirror class hardBlocks behaviour)
    if (hardBlocks && (hardBlocks.includes(raceId) || hardBlocks.includes(subraceId))) {
        return { selectable: false, narrativeUnlock: false };
    }

    // Unrestricted background — open to everyone
    if (!allowedSubraces || allowedSubraces.length === 0) {
        return { selectable: true, narrativeUnlock: false };
    }

    // Explicitly allowed
    if (subraceId && allowedSubraces.includes(subraceId)) {
        return { selectable: true, narrativeUnlock: false };
    }

    // Race-level fallback: if no subrace chosen yet, allow when ANY of that race's
    // subraces are listed (so the grid isn't empty before subrace selection).
    if (!subraceId && raceId) {
        const racePrefix = raceId + '_';
        const raceRepresented = allowedSubraces.some((sid) => sid.startsWith(racePrefix));
        if (raceRepresented) return { selectable: true, narrativeUnlock: false };
    }

    // Disallowed but soft — selectable with DM-approval flag
    if (narrativeUnlock) {
        return { selectable: true, narrativeUnlock: true };
    }

    // Strictly locked
    return { selectable: false, narrativeUnlock: false };
};



const getBackgroundRestrictionMessage = (bg) => {

    if (!bg || !bg.restrictions || !bg.restrictions.justification) return '';

    return bg.restrictions.justification;

};



const BACKGROUND_ICONS = {

    acolyte: 'fas fa-pray',

    criminal: 'fas fa-mask',

    folkHero: 'fas fa-trophy',

    noble: 'fas fa-crown',

    sage: 'fas fa-book',

    soldier: 'fas fa-shield-alt',

    charlatan: 'fas fa-dice',

    entertainer: 'fas fa-music',

    guildArtisan: 'fas fa-tools',

    hermit: 'fas fa-tree',

    outlander: 'fas fa-compass',

    sailor: 'fas fa-anchor',

    merchant: 'fas fa-coins',

    urchin: 'fas fa-street-view',

    scholar: 'fas fa-feather-alt'

};



// Mythrill-native backgrounds (backgroundData.js). Falls back to fa-compass elsewhere.

const BACKGROUND_ICONS_MYTHRILL = {

    emberspirePilgrim: 'fas fa-sun',

    shyrRunner: 'fas fa-running',

    ledgerKeeper: 'fas fa-book',

    bloodlineHeir: 'fas fa-crown',

    synodAcademic: 'fas fa-star',

    sumpsVeteran: 'fas fa-shield-alt',

    debtNegotiator: 'fas fa-balance-scale',

    frostChanter: 'fas fa-music',

    forgeWright: 'fas fa-hammer',

    hushSurvivor: 'fas fa-biohazard',

    peakTracker: 'fas fa-mountain',

    merrowSailor: 'fas fa-anchor',

    gloomwayTrader: 'fas fa-coins',

    shantyRat: 'fas fa-mask',

    monolithHunter: 'fas fa-monument',

    groveWarden: 'fas fa-leaf',

    maskWarden: 'fas fa-theater-masks'

};



const getSubraceImage = (subraceId, raceId) => {

    const mapping = {

        // Myrathil

        breaker_myrathil: 'breakersborn_illustration.png',

        deep_myrathil: 'deepborn_illustration.png',

        river_myrathil: 'riverfed_illustration.png',

        // Briaran

        unshorn_briaran: 'unshorn_illustration.png',

        smoothskinned_briaran: 'smoothskinned_illustration.png',

        // Emberth

        korr_emberth: 'korr_illustration.png',

        thrask_emberth: 'thrask_illustration.png',

        // Fexrick

        kethrin_fexric: 'kethrin_illustration.png',

        drall_fexric: 'drall_illustration.png',

        // Groven

        morgh_groven: 'morgh_illustration.png',

        ithran_groven: 'ithran_illustration.png',

        // Mimir

        maskborne_mimir: 'maskborne_illustration.png',

        mistwoven_mimir: 'mistwoven_illustration.png',

        unwoven_mimir: 'unwoven_illustration.png',

        // Neth

        velun_neth: 'velun_illustration.png',

        kessen_neth: 'kessen_illustration.png',

        drun_neth: 'drun_illustration.png',

        // Astril

        sylen_astril: 'sylen_illustration.png',

        muren_astril: 'muren_illustration.png',

        // Vreken

        clean_vreken: 'clean_illustration.png',

        marked_vreken: 'marked_illustration.png',

        // Human

        thalren_human: 'thalren_illustration.png',

        skald_human: 'skald_illustration.png',

        tessen_human: 'tessen_illustration.png',

        solvarn_human: 'solvarn_illustration.png',

        merryn_human: 'merryn_illustration.png',

        ordan_human: 'ordan_illustration.png',

        morren_human: 'morren_illustration.png'

    };

    

    if (subraceId && mapping[subraceId]) {

        return `/assets/images/races/${mapping[subraceId]}`;

    }

    

    if (raceId) {

        const cleanRaceId = raceId === 'fexrick' ? 'fexric' : raceId.toLowerCase();

        return `/assets/images/races/${cleanRaceId}_illustration.png`;

    }

    return null;

};



const formatDescriptionText = (text) => {

    if (!text) return '';

    let formatted = text

        .replace(/\s*—\s*/g, ' - ')

        .replace(/\s*--\s*/g, ' - ')

        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

        .replace(/\*(.*?)\*/g, '<em>$1</em>')

        .replace(/\n/g, '<br />');

        

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;

};



const truncateForTooltip = (text, maxSentences = 2) => {

    if (!text) return '';

    const plain = text.replace(/\*\*/g, '').replace(/\*/g, '');

    const sentences = plain.match(/[^.!?]+[.!?]+/g) || [plain];

    if (sentences.length <= maxSentences) return text;

    let length = 0;

    let end = 0;

    for (let i = 0; i < maxSentences; i++) {

        length += sentences[i].length;

    }

    let count = 0;

    for (let i = 0; i < text.length; i++) {

        if (text[i] !== '*' && text[i] !== '\n') count++;

        if (count >= length) { end = i + 1; break; }

    }

    return text.substring(0, end).trim() + '...';

};



const Step1CoreDraft = () => {

    const state = useCharacterWizardState();

    const dispatch = useCharacterWizardDispatch();



    const { characterData, validationErrors } = state;

    const { baseStats, race, subrace, background, name, gender } = characterData;



    const selectedRace = race ? RACE_DATA[race] : null;

    const selectedSubrace = selectedRace && subrace ? Object.values(selectedRace.subraces).find(sr => sr.id === subrace) : null;



    // Popups & Drawers State

    const [showAppearanceModal, setShowAppearanceModal] = useState(false);

    const [showStatsDrawer, setShowStatsDrawer] = useState(false);

    const [showJustificationModal, setShowJustificationModal] = useState(false);

    const [justificationTarget, setJustificationTarget] = useState(null); // { type: 'class' | 'background', name: string, id: string }

    const [customJustification, setCustomJustification] = useState('');



    const handleConfirmJustification = (justificationText) => {

        if (!justificationTarget) return;



        // Append to backstory

        const oldBackstory = characterData.lore?.backstory || '';

        const prefix = `[Narrative Unlock Justification - ${justificationTarget.type === 'class' ? 'Class' : 'Background'} (${justificationTarget.name})]: ${justificationText}\n\n`;

        const newBackstory = prefix + oldBackstory;



        dispatch(wizardActionCreators.updateLore({

            ...characterData.lore,

            backstory: newBackstory

        }));



        // Set the choice

        if (justificationTarget.type === 'class') {

            dispatch(wizardActionCreators.setClass(justificationTarget.id));

            setActiveGrimoireTab('calling');

            setFocusedSection('class');

            dispatch(wizardActionCreators.setStartingSpells([]));

        } else if (justificationTarget.type === 'background') {

            dispatch(wizardActionCreators.setBackground(justificationTarget.id));

            setActiveGrimoireTab('origin');

            setFocusedSection('background');

        }



        // Close modal

        setShowJustificationModal(false);

        setJustificationTarget(null);

        setCustomJustification('');

    };

    

    // Unified Tooltip hook

    const {

        tooltipState,

        handleMouseEnter,

        handleMouseLeave,

        handleMouseMove

    } = useUnifiedTooltip();

    const [showSpellsDrawer, setShowSpellsDrawer] = useState(false);

    const [focusedSection, setFocusedSection] = useState('race'); // 'race', 'class', 'background'

    const [expandedRace, setExpandedRace] = useState(race || 'myrathil');

    const [activeRaceSelection, setActiveRaceSelection] = useState(race || null);

    const [activeGrimoireTab, setActiveGrimoireTab] = useState('heritage');

    const [mobilePanel, setMobilePanel] = useState('selections');



    // Codex Accordion Expanded States

    const [expandedCodexSections, setExpandedCodexSections] = useState({

        race: true,

        class: true,

        background: true

    });



    const toggleCodexSection = (section) => {

        setExpandedCodexSections(prev => ({

            ...prev,

            [section]: !prev[section]

        }));

    };



    // Appearance State Fallbacks

    const [imagePreview, setImagePreview] = useState(null);

    const [imageTransformations, setImageTransformations] = useState({

        scale: 1.2, rotation: 0, positionX: 0, positionY: 0

    });



    // Recalculate Point Buy variables

    const bonusPoints = getTotalBonusPoints(characterData);

    const racialModifiers = race && subrace ? applyRacialModifiers({}, race, subrace) : {};

    const availablePoints = calculateAvailablePoints(baseStats, bonusPoints);

    const totalPoints = POINT_BUY_CONFIG.BASE_POINT_POOL + bonusPoints.total;

    const statBreakdown = getStatBreakdown(baseStats, racialModifiers, {});



    // Recalculate Starting Spells variables

    const selectedSpells = characterData.class_spells?.known_spells || [];

    const level1SpellPool = useMemo(() => {

        const characterClass = characterData.class;

        if (!characterClass || !CLASS_DATA_MAP[characterClass]) return [];



        const classData = CLASS_DATA_MAP[characterClass];

        const level1SpellIds = getLevel1SpellIds(classData);

        const allSpells = classData.spells || classData.exampleSpells || [];



        return allSpells

            .filter(spell => level1SpellIds.includes(spell.id))

            .map(spell => ({

                ...spell,

                infernoRequired: spell.specialMechanics?.infernoLevel?.required,

                infernoAscend: spell.specialMechanics?.infernoLevel?.ascendBy,

                infernoDescend: spell.specialMechanics?.infernoLevel?.descendBy,

                musicalCombo: spell.specialMechanics?.musicalCombo,

                timeShardGenerate: spell.specialMechanics?.timeShards?.generated,

                timeShardCost: spell.specialMechanics?.temporalFlux?.shardCost,

                temporalStrainGain: spell.specialMechanics?.temporalFlux?.strainGained,

                temporalStrainReduce: spell.specialMechanics?.temporalFlux?.strainReduced,

                mayhemGenerate: spell.resourceFormulas?.mayhem_generate,

                mayhemCost: spell.resourceValues?.mayhem_spend || spell.resourceValues?.mayhem_cost,

                devotionRequired: spell.specialMechanics?.devotionLevel?.required,

                devotionCost: spell.specialMechanics?.devotionLevel?.cost || spell.specialMechanics?.devotionLevel?.amplifiedCost,

                devotionGain: spell.specialMechanics?.devotionLevel?.gain

            }));

    }, [characterData.class]);



    const [viewingSpellId, setViewingSpellId] = useState(level1SpellPool[0]?.id || null);

    const currentSpell = level1SpellPool.find(s => s.id === viewingSpellId) || level1SpellPool[0] || null;



    // Reset Incompatible Class on Race/Subrace Change

    useEffect(() => {

        // Soft-gate: Do not automatically reset incompatible classes on race/subrace change

        // Players can keep their custom narrative combinations

        if (characterData.class && race) {

            // Keep selection

        }

    }, [race, subrace, characterData.class, dispatch]);



    // Reset Incompatible Background on Race/Subrace Change

    useEffect(() => {

        // Soft-gate: Do not automatically reset incompatible backgrounds on race/subrace change

        if (characterData.background && race) {

            // Keep selection

        }

    }, [race, subrace, characterData.background, dispatch]);



    // Name / Gender Handlers

    const handleNameChange = (e) => {

        dispatch(wizardActionCreators.updateBasicInfo({ name: e.target.value }));

    };



    const handleRandomName = () => {

        dispatch(wizardActionCreators.updateBasicInfo({ name: getRandomCharacterName(race) }));

    };



    const handleGenderChange = (selectedGender) => {

        dispatch(wizardActionCreators.updateBasicInfo({ gender: selectedGender }));

    };



    // Race Handlers

    const getRaceList = () => {

        return Object.entries(RACE_DATA).map(([raceId, raceData]) => ({

            id: raceId,

            name: raceData.name,

            description: raceData.description,

            essence: raceData.essence || raceData.name,

            cardFlavor: raceData.cardFlavor,

            icon: getRaceIcon(raceData.name),

            subraces: Object.entries(raceData.subraces).map(([subraceKey, subraceData]) => ({

                id: subraceData.id,

                name: subraceData.name,

                description: subraceData.description,

                tooltipSummary: subraceData.tooltipSummary,

                statModifiers: subraceData.statModifiers

            }))

        }));

    };



    const getRaceIcon = (raceName) => {

        const icons = {

            'Myrathil': 'fas fa-water',

            'Mimir': 'fas fa-mask',

            'Briaran': 'fas fa-leaf',

            'Groven': 'fas fa-shield-alt',

            'Emberth': 'fas fa-fire',

            'Vreken': 'fas fa-eye',

            'Neth': 'fas fa-scroll',

            'Astril': 'fas fa-star',

            'Fexrick': 'fas fa-cog',

            'Human': 'fas fa-user'

        };

        return icons[raceName] || 'fas fa-user';

    };



    const handleRaceClick = (raceId) => {

        setExpandedRace(expandedRace === raceId ? null : raceId);

        setFocusedSection('race');

    };



    const handleSubraceSelect = (raceId, subraceId) => {

        dispatch(wizardActionCreators.setRace(raceId));

        dispatch(wizardActionCreators.setSubrace(subraceId));

        setActiveGrimoireTab('heritage');

        setFocusedSection('class');

    };



    // Class Handlers

    const handleClassClick = (className) => {

        if (isClassCompatible(className, race, subrace)) {

            dispatch(wizardActionCreators.setClass(className));

            setActiveGrimoireTab('calling');

            setFocusedSection('class');

            // Clear current spells if class changes

            dispatch(wizardActionCreators.setStartingSpells([]));

        } else {

            setJustificationTarget({ type: 'class', name: className, id: className });

            setShowJustificationModal(true);

        }

    };



    // Background Handlers

    const handleBackgroundChange = (bgId) => {

        const bg = BACKGROUND_DATA[bgId];

        const { selectable, narrativeUnlock } = isBackgroundCompatible(bg, race, subrace);

        const isCompatible = selectable && !narrativeUnlock;

        if (isCompatible) {

            dispatch(wizardActionCreators.setBackground(bgId));

            setActiveGrimoireTab('origin');

            setFocusedSection('background');

        } else {

            setJustificationTarget({ type: 'background', name: bg.name, id: bgId });

            setShowJustificationModal(true);

        }

    };



    // Appearance Handlers

    const handleImageUpload = (e) => {

        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {

            const reader = new FileReader();

            reader.onload = (event) => {

                setImagePreview(event.target.result);

                dispatch(wizardActionCreators.updateBasicInfo({

                    characterImage: event.target.result,

                    imageTransformations: { scale: 1.5, rotation: 0, positionX: 0, positionY: 0 }

                }));

            };

            reader.readAsDataURL(file);

        }

    };



    const handleRemoveImage = () => {

        setImagePreview(null);

        dispatch(wizardActionCreators.updateBasicInfo({ characterImage: null, imageTransformations: null }));

    };



    const handleApplyTransformations = (transforms) => {

        setImageTransformations(transforms);

        dispatch(wizardActionCreators.updateBasicInfo({ imageTransformations: transforms }));

    };



    // Stat Increase/Decrease Handlers

    const handleIncreaseStat = (statId) => {

        if (canIncreaseStat(baseStats, statId, bonusPoints)) {

            const newStats = increaseStat(baseStats, statId, bonusPoints);

            dispatch(wizardActionCreators.updateBaseStats(newStats));

        }

    };



    const handleDecreaseStat = (statId) => {

        if (canDecreaseStat(baseStats, statId)) {

            const newStats = decreaseStat(baseStats, statId);

            dispatch(wizardActionCreators.updateBaseStats(newStats));

        }

    };



    // Spell Selection Handlers

    const handleSpellToggle = (spellId) => {

        let newSelection;

        if (selectedSpells.includes(spellId)) {

            newSelection = selectedSpells.filter(id => id !== spellId);

        } else {

            if (selectedSpells.length >= 3) return;

            newSelection = [...selectedSpells, spellId];

        }

        dispatch(wizardActionCreators.setStartingSpells(newSelection));

    };



    // Helpers

    const getSelectedRaceData = () => Object.values(RACE_DATA).find(r => r.id === race) || null;

    const getSelectedClassData = () => CLASS_DATA_MAP[characterData.class] || null;



    const getImageStyle = () => {

        const transforms = characterData.imageTransformations || imageTransformations;

        const iconScale = characterData.iconScale || 1;

        const iconOffsetX = characterData.iconOffsetX || 0;

        const iconOffsetY = characterData.iconOffsetY || 0;

        return {

            transform: `scale(${transforms.scale * iconScale}) rotate(${transforms.rotation}deg) translate(${transforms.positionX + iconOffsetX}px, ${transforms.positionY + iconOffsetY}px)`

        };

    };



    return (

        <div className="core-draft-step-layout">

            {/* Mobile Section Tabs - only visible on phone screens */}

            <div className="mobile-section-tabs-bar">

                <button

                    type="button"

                    className={`mobile-section-tab ${mobilePanel === 'selections' ? 'active' : ''}`}

                    onClick={() => setMobilePanel('selections')}

                >

                    <i className="fas fa-list"></i> Selections

                </button>

                <button

                    type="button"

                    className={`mobile-section-tab ${mobilePanel === 'character' ? 'active' : ''}`}

                    onClick={() => setMobilePanel('character')}

                >

                    <i className="fas fa-id-card"></i> Character

                </button>

                <button

                    type="button"

                    className={`mobile-section-tab ${mobilePanel === 'codex' ? 'active' : ''}`}

                    onClick={() => setMobilePanel('codex')}

                    disabled={!race && !characterData.class}

                >

                    <i className="fas fa-book"></i> Lore

                </button>

            </div>



            {/* Main Selection Area - Flanked by Canvas and Codex */}

            <div className="core-draft-panels-container" data-mobile-panel={mobilePanel}>

                

                {/* 1. SELECTORS COLUMN (LEFT PAGE) */}

                <div className="core-draft-column selection-panel-left scroll-themed" data-mobile-panel="selections">

                    

                    {/* Character Heritage (Race / Subrace) */}

                    <div className="core-draft-section">

                        <h3 className="section-headline">

                            <i className="fas fa-users"></i> Select Heritage (Race)

                        </h3>

                        {validationErrors.race && <span className="section-error-msg">{validationErrors.race}</span>}

                        {validationErrors.subrace && <span className="section-error-msg">{validationErrors.subrace}</span>}

                        

                        {!activeRaceSelection ? (

                            <div className="race-buttons-grid">

                                {getRaceList().map((raceObj) => {

                                    const isSelectedRace = race === raceObj.id;

                                    const raceTooltipContent = (

                                        <div className="race-tooltip-content" style={{ fontFamily: "'Crimson Text', serif", fontSize: '0.9rem', maxWidth: '240px' }}>

                                            {raceObj.essence && (

                                                <div style={{ color: '#7a5a35', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>

                                                    {raceObj.essence}

                                                </div>

                                            )}

                                            <p style={{ margin: 0, color: '#2e1e0f', lineHeight: '1.4' }}>

                                                {raceObj.cardFlavor}

                                            </p>

                                        </div>

                                    );

                                    return (

                                        <div

                                            key={raceObj.id}

                                            className={`race-button-token ${isSelectedRace ? 'selected' : ''}`}

                                            onClick={() => {

                                                setActiveRaceSelection(raceObj.id);

                                                if (raceObj.id !== race) {

                                                    dispatch(wizardActionCreators.setRace(raceObj.id));

                                                    dispatch(wizardActionCreators.setSubrace(''));

                                                }

                                                setActiveGrimoireTab('heritage');

                                                setFocusedSection('race');

                                            }}

                                            onMouseEnter={handleMouseEnter(raceTooltipContent, { title: raceObj.name })}

                                            onMouseLeave={handleMouseLeave}

                                            onMouseMove={handleMouseMove}

                                        >

                                            <i className={`${raceObj.icon} race-token-icon`}></i>

                                            <span className="race-token-label">{raceObj.name}</span>

                                        </div>

                                    );

                                })}

                            </div>

                        ) : (

                            <div className="subrace-selection-container">

                                <div className="subrace-back-row">

                                    <button

                                        type="button"

                                        className="subrace-back-btn"

                                        onClick={() => setActiveRaceSelection(null)}

                                    >

                                        <i className="fas fa-chevron-left"></i> Back to Races

                                    </button>

                                    <span className="subrace-parent-label">

                                        {RACE_DATA[activeRaceSelection]?.name}

                                    </span>

                                </div>

                                <div className="subrace-buttons-grid">

                                    {(RACE_DATA[activeRaceSelection]?.subraces ? Object.values(RACE_DATA[activeRaceSelection].subraces) : []).map((subObj) => {

                                        const isSelectedSubrace = subrace === subObj.id;

                                        const subraceTooltipContent = (

                                            <div className="subrace-tooltip-content" style={{ fontFamily: "'Crimson Text', serif", fontSize: '0.9rem', maxWidth: '240px' }}>

                                                {subObj.statModifiers && (

                                                    <div style={{ color: '#7a5a35', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>

                                                        {Object.entries(subObj.statModifiers)

                                                            .filter(([_, mod]) => mod !== 0)

                                                            .map(([st, md]) => `${st.slice(0, 3).toUpperCase()}${md >= 0 ? '+' : ''}${md}`)

                                                            .join(', ')}

                                                    </div>

                                                )}

                                                <p style={{ margin: 0, color: '#2e1e0f', lineHeight: '1.4' }}>

                                                    {subObj.tooltipSummary}

                                                </p>

                                            </div>

                                        );

                                        return (

                                            <div

                                                key={subObj.id}

                                                className={`subrace-button-token ${isSelectedSubrace ? 'selected' : ''}`}

                                                onClick={() => handleSubraceSelect(activeRaceSelection, subObj.id)}

                                                onMouseEnter={handleMouseEnter(subraceTooltipContent, { title: subObj.name })}

                                                onMouseLeave={handleMouseLeave}

                                                onMouseMove={handleMouseMove}

                                            >

                                                <span className="subrace-token-title">{subObj.name}</span>

                                                {subObj.statModifiers && (

                                                    <span className="subrace-token-mods">

                                                        ({Object.entries(subObj.statModifiers)

                                                            .filter(([_, mod]) => mod !== 0)

                                                            .map(([st, md]) => `${st.slice(0, 3).toUpperCase()}${md >= 0 ? '+' : ''}${md}`)

                                                            .join(', ')})

                                                    </span>

                                                )}

                                            </div>

                                        );

                                    })}

                                </div>

                            </div>

                        )}

                    </div>



                    {/* Calling Section (Class Grid) */}

                    <div className="core-draft-section class-grid-section">

                        <h3 className="section-headline">

                            <i className="fas fa-shield-alt"></i> Select Class

                        </h3>

                        {validationErrors.class && <span className="section-error-msg">{validationErrors.class}</span>}

                        

                        <div className="class-grid-wrapper">

                            {(() => {
                                const allClassNames = Array.from(new Set(Object.values(CLASS_GROUPS).flat()));
                                const compatibleClasses = allClassNames.filter((clsName) => isClassCompatible(clsName, race, subrace));
                                const restrictedClasses = allClassNames.filter((clsName) => !isClassCompatible(clsName, race, subrace));

                                const renderClassToken = (clsName) => {
                                    const classInfo = CLASS_DATA_MAP[clsName];
                                    const isSelectedClass = characterData.class === clsName;
                                    const isCompatible = isClassCompatible(clsName, race, subrace);

                                    const tooltipContent = (
                                        <div className="class-tooltip-content" style={{ fontFamily: "'Crimson Text', serif", fontSize: '0.9rem' }}>
                                            {classInfo?.overview?.theme && (
                                                <div className="class-tooltip-theme" style={{ color: '#7a5a35', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                    Theme: {classInfo.overview.theme}
                                                </div>
                                            )}
                                            {classInfo?.role && (
                                                <div className="class-tooltip-role" style={{ color: '#5a3d1d', fontStyle: 'italic', fontSize: '0.8rem', marginBottom: '8px' }}>
                                                    Role: {classInfo.role}
                                                </div>
                                            )}
                                            <p className="class-tooltip-description" style={{ margin: 0, color: '#2e1e0f', lineHeight: '1.4' }}>
                                                {formatDescriptionText(classInfo?.overview?.description || classInfo?.description || '')}
                                            </p>
                                        </div>
                                    );

                                    return (
                                        <div 
                                            key={clsName} 
                                            className={`class-icon-token ${isSelectedClass ? 'selected' : ''} ${!isCompatible ? 'narrative-unlock' : ''}`}
                                            onClick={() => handleClassClick(clsName)}
                                            onMouseEnter={handleMouseEnter(tooltipContent, { title: !isCompatible ? `${clsName} (Narrative Unlock)` : clsName })}
                                            onMouseLeave={handleMouseLeave}
                                            onMouseMove={handleMouseMove}
                                            style={!isCompatible ? { borderStyle: 'dashed', borderColor: '#d4af37' } : undefined}
                                        >
                                            <ClassIcon 
                                                src={classInfo?.imageIcon || `/assets/icons/classes/${clsName.toLowerCase().replace(' ', '_')}.png`} 
                                                alt={clsName} 
                                                size="medium" 
                                                className="class-pixel-icon-token" 
                                                dataClass={clsName} 
                                            />
                                        </div>
                                    );
                                };

                                return (
                                    <>
                                        <h4 className="categorized-section-title">Lore-Fitting Callings</h4>
                                        <div className="class-icons-grid">
                                            {compatibleClasses.map(renderClassToken)}
                                        </div>

                                        {restrictedClasses.length > 0 && (
                                            <>
                                                <h4 className="categorized-section-title restricted-title">Requires GM Approval / Narrative Reason</h4>
                                                <div className="class-icons-grid restricted-grid">
                                                    {restrictedClasses.map(renderClassToken)}
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}

                        </div>

                    </div>

                    {(() => {
                        const classData = CLASS_DATA_MAP[characterData.class];
                        const variant = classData?.subraceVariants?.[characterData.subrace];
                        if (!variant) return null;
                        return (
                            <div className="subrace-variant-flavor-card" style={{
                                marginTop: '16px',
                                padding: '16px 20px',
                                background: 'linear-gradient(135deg, #faf6eb 0%, #f5eedb 100%)',
                                border: '1px solid #c4a882',
                                borderLeft: '4px solid #b08a4a',
                                borderRadius: '6px',
                                fontFamily: "'Crimson Text', serif"
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                    <i className="fas fa-scroll" style={{ color: '#b08a4a', fontSize: '1.1rem' }}></i>
                                    <h5 style={{ margin: 0, color: '#5a3d1d', fontSize: '1.15rem', fontWeight: 'bold' }}>{variant.subraceName} {characterData.class} — {variant.title}</h5>
                                </div>
                                <p style={{ margin: '0 0 12px', color: '#2e1e0f', lineHeight: '1.6', fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: formatDescriptionText(variant.reframe) }} />
                                {variant.signatureAbility && (
                                    <div style={{ marginBottom: '10px', padding: '10px 14px', background: 'rgba(176,138,74,0.08)', borderRadius: '4px', borderLeft: '3px solid #b08a4a' }}>
                                        <div style={{ fontWeight: 'bold', color: '#7a5a35', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            <i className="fas fa-bolt" style={{ marginRight: '4px' }}></i>{variant.signatureAbility.name}
                                        </div>
                                        <p style={{ margin: 0, color: '#3e2e1f', fontSize: '0.9rem', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: formatDescriptionText(variant.signatureAbility.description) }} />
                                    </div>
                                )}
                                {variant.currentCrisisAngle && (
                                    <div style={{ marginBottom: '10px', padding: '10px 14px', background: 'rgba(139,0,0,0.05)', borderRadius: '4px', borderLeft: '3px solid #8b0000' }}>
                                        <div style={{ fontWeight: 'bold', color: '#8b0000', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            <i className="fas fa-exclamation-circle" style={{ marginRight: '4px' }}></i>Current Crisis
                                        </div>
                                        <p style={{ margin: 0, color: '#3e2e1f', fontSize: '0.9rem', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: formatDescriptionText(variant.currentCrisisAngle) }} />
                                    </div>
                                )}
                                {variant.signatureQuote && (
                                    <div style={{ padding: '10px 14px', background: 'rgba(90,61,29,0.06)', borderRadius: '4px', fontStyle: 'italic' }}>
                                        <p style={{ margin: '0 0 4px', color: '#5a3d1d', fontSize: '0.9rem', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: formatDescriptionText(variant.signatureQuote.text) }} />
                                        <span style={{ color: '#8a7a5a', fontSize: '0.8rem' }}>— {variant.signatureQuote.speaker}, {variant.signatureQuote.context}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })()}



                    {/* Origins (Background Buttons Grid) */}

                    <div className="core-draft-section">

                        <h3 className="section-headline">

                            <i className="fas fa-book-open"></i> Character Origins (Background)

                        </h3>

                        {validationErrors.background && <span className="section-error-msg">{validationErrors.background}</span>}

                        

                        <div className="background-buttons-wrapper">

                            {(() => {
                                const allBackgrounds = Object.values(BACKGROUND_DATA);
                                const compatibleBackgrounds = allBackgrounds.filter((bg) => {
                                    const { selectable, narrativeUnlock } = isBackgroundCompatible(bg, race, subrace);
                                    return selectable && !narrativeUnlock;
                                });
                                const restrictedBackgrounds = allBackgrounds.filter((bg) => {
                                    const { selectable, narrativeUnlock } = isBackgroundCompatible(bg, race, subrace);
                                    return !(selectable && !narrativeUnlock);
                                });

                                const renderBackgroundToken = (bg) => {
                                    const { selectable, narrativeUnlock } = isBackgroundCompatible(bg, race, subrace);
                                    const isCompatible = selectable && !narrativeUnlock;
                                    const requiresUnlock = !isCompatible;

                                    const bgTooltipContent = (
                                        <div className="bg-tooltip-content" style={{ fontFamily: "'Crimson Text', serif", fontSize: '0.9rem', maxWidth: '240px' }}>
                                            {bg.feature?.name && (
                                                <div style={{ color: '#7a5a35', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                    Feature: {bg.feature.name}
                                                </div>
                                            )}
                                            <p style={{ margin: 0, color: '#2e1e0f', lineHeight: '1.4' }}>
                                                {bg.description}
                                            </p>
                                            {requiresUnlock && bg.restrictions?.justification && (
                                                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #b08a4a', color: '#8a5a00', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '4px' }}></i>
                                                    Narrative Unlock — requires DM approval. {bg.restrictions.justification}
                                                </div>
                                            )}
                                        </div>
                                    );

                                    return (
                                        <div
                                            key={bg.id}
                                            className={`background-button-token ${background === bg.id ? 'selected' : ''} ${requiresUnlock ? 'narrative-unlock' : ''}`}
                                            onClick={() => handleBackgroundChange(bg.id)}
                                            onMouseEnter={handleMouseEnter(bgTooltipContent, { title: requiresUnlock ? `${bg.name} (Narrative Unlock)` : bg.name })}
                                            onMouseLeave={handleMouseLeave}
                                            onMouseMove={handleMouseMove}
                                        >
                                            <i className={`${BACKGROUND_ICONS[bg.id] || BACKGROUND_ICONS_MYTHRILL[bg.id] || 'fas fa-compass'} background-token-icon`}></i>
                                            <span className="background-token-label">{bg.name}</span>
                                        </div>
                                    );
                                };

                                return (
                                    <>
                                        <h4 className="categorized-section-title">Lore-Fitting Origins</h4>
                                        <div className="background-buttons-grid">
                                            {compatibleBackgrounds.map(renderBackgroundToken)}
                                        </div>

                                        {restrictedBackgrounds.length > 0 && (
                                            <>
                                                <h4 className="categorized-section-title restricted-title">Requires GM Approval / Narrative Reason</h4>
                                                <div className="background-buttons-grid restricted-grid">
                                                    {restrictedBackgrounds.map(renderBackgroundToken)}
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}

                        </div>

                    </div>



                </div>



                {/* 2. PERSISTENT CANVAS COLUMN (CENTER DISPLAY) */}

                <div 

                    className="core-draft-column canvas-panel-center"

                    data-mobile-panel="character"

                    style={{

                        '--center-backdrop': characterData.iconBackgroundImage 

                            ? `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.45)), url(/assets/Backgrounds/${encodeURIComponent(characterData.iconBackgroundImage)})`

                            : 'rgba(255, 255, 255, 0.15)'

                    }}

                >

                    <div className="canvas-frame-gothic">

                        <div className="canvas-portrait-area">

                            <div 

                                className="portrait-avatar-wrapper"

                                onClick={() => setShowAppearanceModal(true)}

                                style={{

                                    backgroundColor: characterData.iconBackgroundColor,

                                    borderColor: characterData.iconBorderColor,

                                    backgroundImage: characterData.iconBackgroundImage ? `url(/assets/Backgrounds/${encodeURIComponent(characterData.iconBackgroundImage)})` : 'none',

                                    backgroundSize: characterData.iconBackgroundImage ? `${(characterData.iconBackgroundScale || 2.5) * 100}%` : 'cover',

                                    backgroundPosition: characterData.iconBackgroundImage ? `calc(50% + ${characterData.iconBackgroundOffsetX || 0}px) calc(50% + ${characterData.iconBackgroundOffsetY || 0}px)` : 'center',

                                    backgroundRepeat: 'no-repeat'

                                }}

                            >

                                {(characterData.characterImage || imagePreview) ? (

                                    <img 

                                        src={characterData.characterImage || imagePreview} 

                                        alt="Avatar" 

                                        style={getImageStyle()} 

                                    />

                                ) : characterData.characterIcon ? (

                                    <img 

                                        src={getCustomIconUrl(characterData.characterIcon, 'creatures')} 

                                        alt="Icon" 

                                        style={{

                                            transform: `scale(${characterData.iconScale || 1}) translate(${characterData.iconOffsetX || 0}px, ${characterData.iconOffsetY || 0}px)`,

                                            borderRadius: '50%'

                                        }}

                                        onError={(e) => { e.target.onerror = null; e.target.src = getCustomIconUrl('Human/Icon1', 'creatures'); }}

                                    />

                                ) : (

                                    <div className="avatar-placeholder-silhouette">

                                        <i className="fas fa-user-plus"></i>

                                        <span>Customize Visuals</span>

                                    </div>

                                )}

                                <div className="avatar-hover-layer"><i className="fas fa-edit"></i> Edit Appearance</div>

                            </div>

                        </div>



                        {/* Name & Gender Fields inside Center Canvas */}

                        <div className="canvas-basic-fields">

                            <div className="interactive-name-input-block">

                                <input 

                                    type="text" 

                                    value={name} 

                                    onChange={handleNameChange} 

                                    placeholder="Enter Hero Name"

                                    className={`interactive-name-input ${validationErrors.name ? 'error' : ''}`}

                                />

                                <button type="button" className="dice-randomizer-btn" onClick={handleRandomName} title="Random Name">

                                    <i className="fas fa-dice"></i>

                                </button>

                            </div>

                            {validationErrors.name && <span className="canvas-error-label">{validationErrors.name}</span>}



                            <div className="gothic-gender-toggles">

                                {['male', 'female', 'other'].map((g) => (

                                    <button 

                                        key={g} 

                                        type="button" 

                                        className={`gender-toggle-btn ${gender === g ? 'active' : ''}`}

                                        onClick={() => handleGenderChange(g)}

                                    >

                                        <i className={g === 'male' ? 'fas fa-mars' : g === 'female' ? 'fas fa-venus' : 'fas fa-genderless'}></i>

                                        <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>

                                    </button>

                                ))}

                            </div>

                        </div>



                        {/* Drawer Launchers */}

                        <div className="canvas-drawer-launchers">

                            <button 

                                type="button" 

                                className={`launcher-trigger-btn ${validationErrors.stats ? 'warning' : ''}`}

                                onClick={() => setShowStatsDrawer(true)}

                            >

                                <i className="fas fa-chart-bar"></i>

                                <span>Ability Scores ({availablePoints} pts left)</span>

                            </button>

                            

                            <button 

                                type="button" 

                                className={`launcher-trigger-btn ${validationErrors.spells ? 'warning' : ''}`}

                                onClick={() => setShowSpellsDrawer(true)}

                                disabled={!characterData.class}

                                title={!characterData.class ? 'Select a class first' : 'Choose Spells'}

                            >

                                <i className="fas fa-magic"></i>

                                <span>Starting Spells ({selectedSpells.length}/3 selected)</span>

                            </button>

                        </div>

                    </div>

                </div>



                {/* 3. CONTEXTUAL CODEX COLUMN (RIGHT PAGE) */}

                <div className="core-draft-column codex-panel-right" data-mobile-panel="codex">

                    <div className="grimoire-book-container">

                        {/* Bookmark Tabs docked on the left */}

                        <div className="grimoire-tabs">

                            <button 

                                type="button" 

                                className={`grimoire-tab-button ${activeGrimoireTab === 'heritage' ? 'active' : ''}`}

                                onClick={() => setActiveGrimoireTab('heritage')}

                                title="Heritage Lore"

                            >

                                <i className={selectedRace ? getRaceIcon(selectedRace.name) : "fas fa-scroll"}></i>

                            </button>

                            <button 

                                type="button" 

                                className={`grimoire-tab-button ${activeGrimoireTab === 'calling' ? 'active' : ''}`}

                                onClick={() => setActiveGrimoireTab('calling')}

                                title="Class Lore"

                                disabled={!characterData.class}

                            >

                                {characterData.class ? (

                                    <ClassIcon 

                                        src={CLASS_DATA_MAP[characterData.class]?.imageIcon || `/assets/icons/classes/${characterData.class.toLowerCase().replace(' ', '_')}.png`}

                                        alt={characterData.class}

                                        size="tiny"

                                        className="grimoire-tab-pixel-icon"

                                    />

                                ) : (

                                    <i className="fas fa-shield-alt"></i>

                                )}

                            </button>

                            <button 

                                type="button" 

                                className={`grimoire-tab-button ${activeGrimoireTab === 'origin' ? 'active' : ''}`}

                                onClick={() => setActiveGrimoireTab('origin')}

                                title="Origin Lore"

                                disabled={!background}

                            >

                                <i className={BACKGROUND_ICONS[background] || 'fas fa-compass'}></i>

                            </button>

                        </div>



                        {/* Parchment Page */}

                        <div className="grimoire-page scroll-themed">

                            {activeGrimoireTab === 'heritage' && (

                                <>

                                    <div className="grimoire-header">

                                        <h2 className="grimoire-title">

                                            <i className={selectedRace ? getRaceIcon(selectedRace.name) : "fas fa-scroll"}></i> Heritage

                                        </h2>

                                        <span className="grimoire-subtitle">

                                            {selectedSubrace && selectedRace ? `${selectedSubrace.name} ${selectedRace.name}` : selectedRace ? selectedRace.name : 'None Selected'}

                                        </span>

                                    </div>

                                    

                                    {selectedRace ? (

                                        <>

                                            <div className="grimoire-heritage-showcase">

                                                <div className="grimoire-heritage-icon-wrapper">

                                                    <img 

                                                        src={getSubraceImage(selectedSubrace?.id, selectedRace.id)}

                                                        alt={selectedSubrace ? selectedSubrace.name : selectedRace.name}

                                                        className="grimoire-large-heritage-icon"

                                                        onError={(e) => {

                                                            e.target.onerror = null;

                                                            e.target.src = '/assets/images/races/human_illustration.png';

                                                        }}

                                                    />

                                                </div>

                                            </div>

                                            <p className="grimoire-flavor-quote">"{selectedRace.cardFlavor}"</p>

                                            <div className="grimoire-markdown-body" dangerouslySetInnerHTML={{ __html: selectedRace.overview }} />

                                            

                                            <h4 className="grimoire-section-header">Base Attributes</h4>

                                            <table className="grimoire-stats-table">

                                                <thead>

                                                    <tr>

                                                        <th>Attribute</th>

                                                        <th>Detail</th>

                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    <tr>

                                                        <td><strong>Lifespan</strong></td>

                                                        <td>{selectedRace.baseTraits?.lifespan}</td>

                                                    </tr>

                                                    <tr>

                                                        <td><strong>Size</strong></td>

                                                        <td>{selectedRace.baseTraits?.size} ({selectedRace.baseTraits?.height})</td>

                                                    </tr>

                                                    <tr>

                                                        <td><strong>Base Speed</strong></td>

                                                        <td>{selectedRace.baseTraits?.baseSpeed} ft</td>

                                                    </tr>

                                                    <tr>

                                                        <td><strong>Vision Range</strong></td>

                                                        <td>{selectedRace.baseTraits?.visionRange || selectedRace.baseTraits?.darkvision || 60} ft</td>

                                                    </tr>

                                                </tbody>

                                            </table>



                                            {/* Subrace Specific Details & Traits */}

                                            {selectedSubrace && (

                                                <>

                                                    <h4 className="grimoire-section-header">{selectedSubrace.name} Details</h4>

                                                    <div className="grimoire-markdown-body">

                                                        <p>{selectedSubrace.description}</p>

                                                    </div>

                                                    

                                                    {selectedSubrace.traits && selectedSubrace.traits.length > 0 && (

                                                        <>

                                                            <h4 className="grimoire-section-header">Racial Traits</h4>

                                                            <div className="grimoire-traits-list">

                                                                {selectedSubrace.traits.map(trait => (

                                                                    <div key={trait.id} className="grimoire-trait-card">

                                                                        <div className="grimoire-trait-header">

                                                                            <div className="grimoire-trait-icon">

                                                                                <i className={trait.icon ? (trait.icon.startsWith('fa') ? trait.icon : 'fas fa-star') : 'fas fa-star'}></i>

                                                                            </div>

                                                                            <span className="grimoire-trait-title">{trait.name}</span>

                                                                        </div>

                                                                        <span className="grimoire-trait-desc">{trait.description}</span>

                                                                    </div>

                                                                ))}

                                                            </div>

                                                        </>

                                                    )}

                                                </>

                                            )}

                                        </>

                                    ) : (

                                        <p className="codex-placeholder-text">Select a Heritage on the left to reveal its lore.</p>

                                    )}

                                </>

                            )}



                            {activeGrimoireTab === 'calling' && (

                                <>

                                    <div className="grimoire-header">

                                        <h2 className="grimoire-title">

                                            {characterData.class ? (

                                                <ClassIcon 

                                                    src={CLASS_DATA_MAP[characterData.class]?.imageIcon || `/assets/icons/classes/${characterData.class.toLowerCase().replace(' ', '_')}.png`}

                                                    alt={characterData.class}

                                                    size="small"

                                                    className="grimoire-header-pixel-icon"

                                                />

                                            ) : (

                                                <i className="fas fa-shield-alt"></i>

                                            )} Class

                                        </h2>

                                        <span className="grimoire-subtitle">

                                            {characterData.class ? CLASS_DATA_MAP[characterData.class]?.name || characterData.class : 'None Selected'}

                                        </span>

                                    </div>

                                    

                                    {getSelectedClassData() ? (

                                        <>

                                            <div className="grimoire-class-showcase">

                                                <div className="grimoire-class-icon-wrapper">

                                                    <ClassIcon 

                                                        src={CLASS_DATA_MAP[characterData.class]?.imageIcon || `/assets/icons/classes/${characterData.class.toLowerCase().replace(' ', '_')}.png`}

                                                        alt={characterData.class}

                                                        size="large"

                                                        className="grimoire-large-class-icon"

                                                        dataClass={characterData.class}

                                                    />

                                                </div>

                                            </div>

                                            <h3 className="grimoire-subtitle" style={{ fontSize: '1rem', color: '#2e1e0f' }}>

                                                Theme: {getSelectedClassData().overview?.theme || 'Specialist'}

                                            </h3>

                                            <div className="grimoire-markdown-body">

                                                <p>{formatDescriptionText(getSelectedClassData().overview?.description || getSelectedClassData().description || '')}</p>

                                            </div>

                                            

                                            <h4 className="grimoire-section-header">Order Arts</h4>

                                            <table className="grimoire-stats-table">

                                                <thead>

                                                    <tr>

                                                        <th>Feature</th>

                                                        <th>Detail</th>

                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    <tr>

                                                        <td><strong>Role</strong></td>

                                                        <td>{getSelectedClassData().role || 'Versatile'}</td>

                                                    </tr>

                                                    <tr>

                                                        <td><strong>Primary Resource</strong></td>

                                                        <td>{getSelectedClassData().resourceSystem?.title || 'Class Energy'}</td>

                                                    </tr>

                                                    {getSelectedClassData().hitDice && (

                                                        <tr>

                                                            <td><strong>Hit Dice</strong></td>

                                                            <td>{getSelectedClassData().hitDice}</td>

                                                        </tr>

                                                    )}

                                                </tbody>

                                            </table>



                                            {/* Selected Spells */}

                                            {selectedSpells.length > 0 && (

                                                <>

                                                    <h4 className="grimoire-section-header">Starting Spells</h4>

                                                    <div className="grimoire-traits-list">

                                                        {selectedSpells.map(spellId => {

                                                            const spell = level1SpellPool.find(s => s.id === spellId);

                                                            if (!spell) return null;

                                                            return (

                                                                <div key={spellId} className="grimoire-spell-item">

                                                                    <img 

                                                                        src={getSpellIconUrl(spell.icon)} 

                                                                        alt={spell.name}

                                                                        className="grimoire-spell-icon"

                                                                        onError={(e) => {

                                                                            e.target.onerror = null;

                                                                            e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');

                                                                        }}

                                                                    />

                                                                    <div className="grimoire-spell-info">

                                                                        <span className="grimoire-spell-name">{spell.name}</span>

                                                                        <span className="grimoire-spell-desc">{spell.description || spell.flavorText}</span>

                                                                    </div>

                                                                </div>

                                                            );

                                                        })}

                                                    </div>

                                                </>

                                            )}

                                        </>

                                    ) : (

                                        <p className="codex-placeholder-text">Select a Calling on the left to reveal its features.</p>

                                    )}

                                </>

                            )}



                            {activeGrimoireTab === 'origin' && (

                                <>

                                    <div className="grimoire-header">

                                        <h2 className="grimoire-title">

                                            <i className={BACKGROUND_ICONS[background] || 'fas fa-book-open'}></i> Origin

                                        </h2>

                                        <span className="grimoire-subtitle">

                                            {BACKGROUND_DATA[background] ? BACKGROUND_DATA[background].name : 'None Selected'}

                                        </span>

                                    </div>

                                    

                                    {BACKGROUND_DATA[background] ? (

                                        <>

                                            <div className="grimoire-markdown-body">

                                                <p>{BACKGROUND_DATA[background].description}</p>

                                            </div>

                                            

                                            <h4 className="grimoire-section-header">Origin Benefits</h4>

                                            

                                            {BACKGROUND_DATA[background].skillProficiencies && BACKGROUND_DATA[background].skillProficiencies.length > 0 && (

                                                <>

                                                    <div className="grimoire-subtitle" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Skill Proficiencies</div>

                                                    <div className="grimoire-badge-container">

                                                        {BACKGROUND_DATA[background].skillProficiencies.map(skill => (

                                                            <span key={skill} className="grimoire-badge">{skill}</span>

                                                        ))}

                                                    </div>

                                                </>

                                            )}



                                            <table className="grimoire-stats-table" style={{ marginTop: '0.75rem' }}>

                                                <tbody>

                                                    {BACKGROUND_DATA[background].languages !== undefined && (

                                                        <tr>

                                                            <td><strong>Additional Languages</strong></td>

                                                            <td>{BACKGROUND_DATA[background].languages}</td>

                                                        </tr>

                                                    )}

                                                    {BACKGROUND_DATA[background].feature && (

                                                        <tr>

                                                            <td>

                                                                <strong>Feature: {BACKGROUND_DATA[background].feature.name}</strong>

                                                            </td>

                                                            <td>{BACKGROUND_DATA[background].feature.description}</td>

                                                        </tr>

                                                    )}

                                                </tbody>

                                            </table>



                                            {BACKGROUND_DATA[background].equipment && BACKGROUND_DATA[background].equipment.length > 0 && (

                                                <>

                                                    <h4 className="grimoire-section-header">Starting Gear</h4>

                                                    <ul className="codex-attributes-list" style={{ paddingLeft: '1.2rem', margin: '0.4rem 0' }}>

                                                        {BACKGROUND_DATA[background].equipment.map((item, idx) => (

                                                            <li key={idx} style={{ color: '#4e361d', fontSize: '0.85rem' }}>{item}</li>

                                                        ))}

                                                    </ul>

                                                </>

                                            )}

                                        </>

                                    ) : (

                                        <p className="codex-placeholder-text">Select a Background on the left to reveal its benefits.</p>

                                    )}

                                </>

                            )}

                        </div>

                    </div>

                </div>



            </div>



            {/* A. POINT-BUY SLIDER DRAWER */}

            {showStatsDrawer && (

                <div className="grimoire-drawer-overlay" onClick={() => setShowStatsDrawer(false)}>

                    <div className="grimoire-drawer-body drawer-right dark-parchment-theme" onClick={(e) => e.stopPropagation()}>

                        <div className="drawer-header">

                            <h2><i className="fas fa-chart-bar"></i> Ability Score Allocation</h2>

                            <button type="button" className="drawer-close-btn" onClick={() => setShowStatsDrawer(false)}>✕</button>

                        </div>

                        

                        <div className="drawer-content scroll-themed">

                            <div className="point-pool-status-panel">

                                <div className="remaining-points-counter">

                                    <span className="points-count-val">{availablePoints}</span>

                                    <span className="points-count-lbl">points remaining</span>

                                </div>

                                <div className="points-bar-progress">

                                    <div 

                                        className="points-bar-fill" 

                                        style={{ width: `${Math.min(100, ((totalPoints - availablePoints) / totalPoints) * 100)}%` }} 

                                    />

                                </div>

                                <div className="pool-bonuses-row">

                                    <span>Base: {POINT_BUY_CONFIG.BASE_POINT_POOL}</span>

                                    {bonusPoints.race > 0 && <span className="mod-pill">+Race: {bonusPoints.race}</span>}

                                    {bonusPoints.background > 0 && <span className="mod-pill">+Origin: {bonusPoints.background}</span>}

                                    {bonusPoints.loreClass > 0 && <span className="mod-pill lore-bonus">+Lore Calling: {bonusPoints.loreClass}</span>}

                                    {bonusPoints.loreBackground > 0 && <span className="mod-pill lore-bonus">+Lore Origin: {bonusPoints.loreBackground}</span>}

                                </div>

                            </div>



                            <div className="ability-sliders-list">

                                {ABILITY_SCORES.map((ability) => {

                                    const breakdown = statBreakdown[ability.id];

                                    const canInc = canIncreaseStat(baseStats, ability.id, bonusPoints);

                                    const canDec = canDecreaseStat(baseStats, ability.id);

                                    const currentBase = baseStats[ability.id] || POINT_BUY_CONFIG.BASE_STAT_VALUE;

                                    const nextCost = currentBase < POINT_BUY_CONFIG.MAX_STAT_VALUE

                                        ? getStatPointCost(currentBase + 1) - getStatPointCost(currentBase)

                                        : 0;



                                    return (

                                        <div key={ability.id} className="ability-slider-row">

                                            <div className="ability-info-meta">

                                                <div className="name-group">

                                                    <i className={ability.icon}></i>

                                                    <strong>{ability.name}</strong>

                                                </div>

                                                <span className="ability-desc">{ability.description}</span>

                                            </div>



                                            <div className="ability-controls-action">

                                                <button 

                                                    type="button" 

                                                    className="stat-adjust-btn dec" 

                                                    disabled={!canDec} 

                                                    onClick={() => handleDecreaseStat(ability.id)}

                                                >

                                                    <i className="fas fa-minus"></i>

                                                </button>

                                                

                                                <div className="stat-score-bubbles">

                                                    <span className="score-main">{breakdown.final}</span>

                                                    <span className="score-mod">({breakdown.modifier >= 0 ? '+' : ''}{breakdown.modifier})</span>

                                                </div>



                                                <button 

                                                    type="button" 

                                                    className="stat-adjust-btn inc" 

                                                    disabled={!canInc} 

                                                    onClick={() => handleIncreaseStat(ability.id)}

                                                >

                                                    <i className="fas fa-plus"></i>

                                                </button>

                                            </div>

                                            

                                            <div className="ability-breakdown-subtext">

                                                <span>Base: {breakdown.base}</span>

                                                {breakdown.racial !== 0 && <span className="racial-text">Racial: {breakdown.racial >= 0 ? '+' : ''}{breakdown.racial}</span>}

                                                {canInc && <span className="cost-text">Next: {nextCost}pt{nextCost !== 1 ? 's' : ''}</span>}

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>



                        <div className="drawer-footer">

                            <button 

                                type="button" 

                                className="grimoire-action-confirm-btn" 

                                onClick={() => setShowStatsDrawer(false)}

                            >

                                <i className="fas fa-check"></i> Save Scores

                            </button>

                        </div>

                    </div>

                </div>

            )}



            {/* B. SPELLBOOK STARTING SPELLS DRAWER */}

            {showSpellsDrawer && (

                <div className="grimoire-drawer-overlay" onClick={() => setShowSpellsDrawer(false)}>

                    <div className="grimoire-drawer-body drawer-right dark-parchment-theme spellbook-drawer-width" onClick={(e) => e.stopPropagation()}>

                        <div className="drawer-header">

                            <h2><i className="fas fa-magic"></i> Level 1 Starting Spells</h2>

                            <span className="spell-drawer-count">{selectedSpells.length} / 3 selected</span>

                            <button type="button" className="drawer-close-btn" onClick={() => setShowSpellsDrawer(false)}>✕</button>

                        </div>



                        <div className="drawer-content spellbook-drawer-split scroll-themed">

                            {/* Left Spell List Grid */}

                            <div className="spellbook-spell-list-side">

                                {level1SpellPool.length === 0 ? (

                                    <div className="no-spells-fallback">

                                        <p>No level 1 spells found for the class {characterData.class}.</p>

                                    </div>

                                ) : (

                                    <div className="spellbook-icon-grid">

                                        {level1SpellPool.map((spell) => {

                                            const isSelected = selectedSpells.includes(spell.id);

                                            const isViewing = viewingSpellId === spell.id;



                                            return (

                                                <div 

                                                    key={spell.id}

                                                    className={`spellbook-icon-card ${isSelected ? 'selected' : ''} ${isViewing ? 'viewing' : ''}`}

                                                    onClick={() => setViewingSpellId(spell.id)}

                                                >

                                                    <div className="spell-icon-container">

                                                        <img 

                                                            src={getSpellIconUrl(spell.icon)} 

                                                            alt={spell.name}

                                                            onError={(e) => {

                                                                e.target.onerror = null;

                                                                e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');

                                                            }}

                                                        />

                                                        {isSelected && <div className="checkmark"><i className="fas fa-check-circle"></i></div>}

                                                    </div>

                                                    <span className="spell-name-lbl">{spell.name}</span>

                                                </div>

                                            );

                                        })}

                                    </div>

                                )}

                            </div>



                            {/* Right Spell Detail Panel */}

                            <div className="spellbook-spell-detail-side">

                                {currentSpell ? (

                                    <div className="spell-detail-card-scroll">

                                        <UnifiedSpellCard

                                            spell={currentSpell}

                                            variant="wizard"

                                            showActions={false}

                                            showDescription={true}

                                            showStats={true}

                                            showTags={true}

                                        />

                                        <div className="spellbook-select-action-btn-row">

                                            <button

                                                type="button"

                                                className={`spellbook-selection-toggle-btn ${selectedSpells.includes(currentSpell.id) ? 'selected' : ''}`}

                                                onClick={() => handleSpellToggle(currentSpell.id)}

                                                disabled={!selectedSpells.includes(currentSpell.id) && selectedSpells.length >= 3}

                                            >

                                                {selectedSpells.includes(currentSpell.id) ? (

                                                    <><i className="fas fa-check-circle"></i> Selected</>

                                                ) : (

                                                    <><i className="fas fa-plus-circle"></i> Add to Spells</>

                                                )}

                                            </button>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="no-spell-detail-placeholder">

                                        <i className="fas fa-hand-pointer"></i>

                                        <p>Select a spell from the grid to view details</p>

                                    </div>

                                )}

                            </div>

                        </div>



                        <div className="drawer-footer">

                            <button 

                                type="button" 

                                className="grimoire-action-confirm-btn" 

                                onClick={() => setShowSpellsDrawer(false)}

                                disabled={selectedSpells.length !== 3}

                            >

                                <i className="fas fa-check"></i> Confirm Spells (Need 3)

                            </button>

                        </div>

                    </div>

                </div>

            )}



            {/* C. VISUAL APPEARANCE CUSTOMIZER MODAL */}

            <CharacterAppearanceModal

                isOpen={showAppearanceModal}

                onClose={() => setShowAppearanceModal(false)}

                characterData={characterData}

                onUpdate={(updates) => dispatch(wizardActionCreators.updateBasicInfo(updates))}

                imagePreview={characterData.characterImage || imagePreview}

                onImageUpload={handleImageUpload}

                onRemoveImage={handleRemoveImage}

                imageTransformations={characterData.imageTransformations || imageTransformations}

                onApplyTransformations={handleApplyTransformations}

            />



            {/* Narrative Justification Modal */}

            {showJustificationModal && (

                <div className="justification-modal-overlay" style={{

                    position: 'fixed',

                    top: 0,

                    left: 0,

                    right: 0,

                    bottom: 0,

                    backgroundColor: 'rgba(0, 0, 0, 0.75)',

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'center',

                    zIndex: 99999,

                    fontFamily: "'Crimson Text', serif"

                }}>

                    <div className="justification-modal-content" style={{

                        background: '#faf6eb',

                        border: '2px solid #b08a4a',

                        borderRadius: '8px',

                        padding: '2rem',

                        maxWidth: '550px',

                        width: '90%',

                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',

                        color: '#2e1e0f'

                    }}>

                        <h3 style={{

                            marginTop: 0,

                            color: '#5a3d1d',

                            borderBottom: '1px solid #b08a4a',

                            paddingBottom: '0.5rem',

                            fontSize: '1.5rem',

                            display: 'flex',

                            alignItems: 'center',

                            gap: '8px'

                        }}>

                            <i className="fas fa-exclamation-triangle" style={{ color: '#d4af37' }}></i>

                            Narrative Unlock Required

                        </h3>

                        <p style={{ fontSize: '1.05rem', lineHeight: '1.5', margin: '1rem 0' }}>

                            The combination of <strong>{race ? race.charAt(0).toUpperCase() + race.slice(1) : 'your heritage'}</strong> and the <strong>{justificationTarget?.name}</strong> calling/origin is highly unusual or physically constrained in Mythrill's history.

                        </p>

                        <p style={{ fontSize: '0.95rem', color: '#654321', fontStyle: 'italic', marginBottom: '1.5rem' }}>

                            How did your character break through this boundary? Choose a justification to record in your backstory:

                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

                            {[

                                { id: 'Outcast Training', title: 'Outcast Training', text: 'You studied in secret under an outcast master who operated outside the official guilds or regional checkpoints.' },

                                { id: 'Alchemical Accident', title: 'Alchemical Accident', text: 'An alchemical experiment gone wrong or exposure to Wyrd energy altered your natural biology.' },

                                { id: 'Fateful Encounter', title: 'Fateful Encounter', text: 'A chance meeting with a traveler from another region opened up a path normally denied to your people.' },

                                { id: 'Forgotten Lineage', title: 'Forgotten Lineage', text: 'Your bloodline carries the memory of an older era before the noble houses signed their compacts.' }

                            ].map(opt => (

                                <button

                                    key={opt.id}

                                    onClick={() => {

                                        handleConfirmJustification(opt.title + ': ' + opt.text);

                                    }}

                                    style={{

                                        background: '#faf6eb',

                                        border: '1px solid #c4a882',

                                        borderRadius: '4px',

                                        padding: '0.75rem',

                                        textAlign: 'left',

                                        cursor: 'pointer',

                                        transition: 'all 0.2s',

                                        fontFamily: 'inherit'

                                    }}

                                    onMouseEnter={(e) => {

                                        e.currentTarget.style.borderColor = '#5a3d1d';

                                        e.currentTarget.style.background = '#f5eedb';

                                    }}

                                    onMouseLeave={(e) => {

                                        e.currentTarget.style.borderColor = '#c4a882';

                                        e.currentTarget.style.background = '#faf6eb';

                                    }}

                                >

                                    <strong style={{ display: 'block', color: '#5a3d1d', marginBottom: '2px' }}>{opt.title}</strong>

                                    <span style={{ fontSize: '0.85rem', color: '#4e3629' }}>{opt.text}</span>

                                </button>

                            ))}

                        </div>

                        

                        <div style={{ marginBottom: '1.5rem' }}>

                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#5a3d1d' }}>

                                Or write a custom justification:

                            </label>

                            <textarea

                                value={customJustification}

                                onChange={(e) => setCustomJustification(e.target.value)}

                                placeholder="Describe how your character bypassed this restriction..."

                                style={{

                                    width: '100%',

                                    height: '70px',

                                    padding: '0.5rem',

                                    border: '1px solid #c4a882',

                                    borderRadius: '4px',

                                    background: '#fff',

                                    fontFamily: 'inherit',

                                    fontSize: '0.9rem',

                                    boxSizing: 'border-box'

                                }}

                            />

                        </div>

                        

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>

                            <button

                                onClick={() => {

                                    setShowJustificationModal(false);

                                    setJustificationTarget(null);

                                    setCustomJustification('');

                                }}

                                style={{

                                    background: 'transparent',

                                    border: 'none',

                                    color: '#8b0000',

                                    cursor: 'pointer',

                                    padding: '0.5rem 1rem',

                                    fontSize: '0.95rem',

                                    fontWeight: 'bold'

                                }}

                            >

                                Cancel

                            </button>

                            <button

                                onClick={() => {

                                    if (customJustification.trim()) {

                                        handleConfirmJustification('Custom Justification: ' + customJustification.trim());

                                    }

                                }}

                                disabled={!customJustification.trim()}

                                style={{

                                    background: '#5a3d1d',

                                    color: '#faf6eb',

                                    border: 'none',

                                    borderRadius: '4px',

                                    padding: '0.5rem 1.5rem',

                                    cursor: customJustification.trim() ? 'pointer' : 'not-allowed',

                                    fontSize: '0.95rem',

                                    fontWeight: 'bold',

                                    opacity: customJustification.trim() ? 1 : 0.5

                                }}

                            >

                                Confirm custom

                            </button>

                        </div>

                    </div>

                </div>

            )}



            {/* Unified Tooltip System */}

            <UnifiedTooltip {...tooltipState} />

        </div>

    );

};



export default Step1CoreDraft;
