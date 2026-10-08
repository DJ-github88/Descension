/**

 * Step 1: Core Character Draft (Hero Draft)

 * 

 * Combines Name, Gender, Heritage (Race/Subrace), Calling (Class),

 * Background, Point-Buy Stats, Starting Spells, and Portrait/Icon.

 * Uses slide-out drawers for stats and spells, and existing popup for appearance.

 */



import React, { useState, useEffect, useMemo } from 'react';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import ClassAcquisitionEditor from '../components/ClassAcquisitionEditor';
import { getCharacterHeritageOptions, getCharacterClassAccess, validateCharacterClassAccess } from '../../../utils/characterClassAccess';
import { getClassNativeHeritageIds, HERITAGE_TRADITIONS } from '../../../data/classHeritageRegistry';

import { RACE_DATA, applyRacialModifiers, getRaceData, getHeritageIllustrations, getHeritageImage } from '../../../data/raceData';
import { BACKGROUND_DATA, BACKGROUND_FLAVOR_TEXT } from '../../../data/backgroundData';


import { getCustomIconUrl, getAbilityIconUrl } from '../../../utils/assetManager';

import { getRandomCharacterName } from '../../../utils/nameGenerator';

import CharacterAppearanceModal from '../components/CharacterAppearanceModal';

import ClassIcon from '../../common/ClassIcon';

import UnifiedTooltip from '../../common/UnifiedTooltip';

import { useUnifiedTooltip } from '../../common/useUnifiedTooltip';

import { uploadAsset } from '../../../services/firebase/uploadService';
import useAuthStore from '../../../store/authStore';

import useCustomLineageStore from '../../../store/customLineageStore';



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

    getTotalBonusPoints,

    isClassCompatible

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
import { CRUSADER_DATA } from '../../../data/classes/crusaderData';
import { DEEPLING_MYRATHIL_APEX_DATA, DEEPLING_MYRATHIL_ANIMIST_DATA, DEEPLING_MYRATHIL_AUGUR_DATA } from '../../../data/classes/index';
import { withClassHeritageMetadata } from '../../../data/classHeritageRegistry';





import UnifiedSpellCard from '../../spellcrafting-wizard/components/common/UnifiedSpellCard';
import '../styles/Step1CoreDraft.css';



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

    return getCustomIconUrl('Arcane/Abstract Rune', 'abilities');

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

      // mapSpellIcon already returns a fully-resolved URL — do not wrap it again
      return mappedIcon;

    }

    return getAbilityIconUrl(iconId);

  }

  return getCustomIconUrl('Arcane/Abstract Rune', 'abilities');

};



const CLASS_DATA_MAP = Object.fromEntries(Object.entries({

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

    'Augur': AUGUR_DATA,

    'Crusader': CRUSADER_DATA,

    'Nereid Myrathil Apex': DEEPLING_MYRATHIL_APEX_DATA,

    'Nereid Myrathil Animist': DEEPLING_MYRATHIL_ANIMIST_DATA,

    'Nereid Myrathil Augur': DEEPLING_MYRATHIL_AUGUR_DATA

}).map(([name, data]) => [name, withClassHeritageMetadata(name, data)]));



// Subgroup classifications for the 21 base classes. Legacy heritage aliases
// remain in the lookup map above, not as extra class-selection choices.

const CLASS_GROUPS = {

    MARTIALS: ['Berserker', 'Shaper', 'Spellguard', 'Warden', 'Apex', 'Animist'],

    CASTERS: ['Arcanoneer', 'Harbinger', 'Chronarch', 'Revenant', 'Animist', 'Toxicologist'],

    ZEALOTS: ['Inquisitor', 'False Prophet', 'Lunarch', 'Martyr', 'Crusader'],

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



// Class access comes from the registry plus this character's acquisition/state.



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

    // Hard blocks: never selectable (mirror class hardBlocks behaviour)
    if (hardBlocks && (hardBlocks.includes(raceId) || hardBlocks.includes(subraceId))) {
        return { selectable: false, narrativeUnlock: false };
    }

    // Unrestricted background: open to everyone
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

    // Disallowed but soft: selectable with DM-approval flag
    if (narrativeUnlock) {
        return { selectable: true, narrativeUnlock: true };
    }

    // Strictly locked
    return { selectable: false, narrativeUnlock: false };
};

const getClassSummary = (classInfo) => {
    if (!classInfo) return '';
    const raw = classInfo.summary || classInfo.overview?.summary || classInfo.overview?.description || classInfo.description || '';
    const clean = raw.replace(/<[^>]+>/g, '').trim();
    const firstSentence = clean.split(/(?<=[.!?])\s+/)[0] || clean;
    return firstSentence.length > 150 ? firstSentence.slice(0, 147) + '...' : firstSentence;
};

const getBackgroundSummary = (bg) => {
    if (!bg) return '';
    if (BACKGROUND_FLAVOR_TEXT && BACKGROUND_FLAVOR_TEXT[bg.id]) {
        return BACKGROUND_FLAVOR_TEXT[bg.id];
    }
    if (bg.shortDescription) return bg.shortDescription;
    if (bg.description) {
        const clean = bg.description.replace(/<[^>]+>/g, '').trim();
        const firstSentence = clean.split(/(?<=[.!?])\s+/)[0] || clean;
        return firstSentence.length > 140 ? firstSentence.slice(0, 137) + '...' : firstSentence;
    }
    return '';
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

    maskWarden: 'fas fa-theater-masks',

    vaultScholar: 'fas fa-cogs',

    herdGuardian: 'fas fa-horse',

    starboundScholar: 'fas fa-star',

    deepCurrentGuide: 'fas fa-water',

    fogReader: 'fas fa-map',

    chasmDelver: 'fas fa-dungeon',

    brineTrader: 'fas fa-sack-dollar',

    keepWarden: 'fas fa-bell',

    spanBuilder: 'fas fa-helmet-safety',

    contractClerk: 'fas fa-file-signature',

    obligationBroker: 'fas fa-handshake',

    arbitrator: 'fas fa-gavel',

    greymarkArchivist: 'fas fa-scroll',

    privateer: 'fas fa-ship',

    nameless: 'fas fa-user-secret',

    cryptKeeper: 'fas fa-skull',

    zenithCartographer: 'fas fa-compass',
    craterVanguard: 'fas fa-meteor',
    clockworkHorologist: 'fas fa-clock',
    vitriolProspector: 'fas fa-flask',
    peatTender: 'fas fa-seedling',
    petrifiedMason: 'fas fa-monument',
    scriptureHerald: 'fas fa-scroll',
    quietTraded: 'fas fa-eye-slash',
    trenchListener: 'fas fa-water',
    saltHingeEnvoy: 'fas fa-anchor',
    cataractScout: 'fas fa-route',
    vaultTender: 'fas fa-mountain',
    ashDuneSkimmer: 'fas fa-wind',
    sanctuarySeneschal: 'fas fa-shield-virus',
    nullSaltHunter: 'fas fa-skull-crossbones',
    steppeSinger: 'fas fa-horse-head',
    glacierHarpooner: 'fas fa-icicles',
    canopyWeaver: 'fas fa-spa',
    briarSentinel: 'fas fa-tree'

};



const getSubraceImage = (subraceId, raceId) => {
    return getHeritageImage(raceId, subraceId);
};

const formatDescriptionText = (text) => {

    if (!text) return '';

    let formatted = text

        .replace(/\s*-\s*/g, ' - ')

        .replace(/\s*--\s*/g, ' - ')

        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

        .replace(/\*(.*?)\*/g, '<em>$1</em>')

        .replace(/\n/g, '<br />');

        

    return <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(formatted) }} />;

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



// Section header for the three rites of Step 1. The numeral carries real
// information: Heritage gates which Callings and Origins are native.
const activateOnKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.currentTarget.click();
    }
};

const normalizeClassId = (name) => String(name || '').replace(/\s*\(.*?\)\s*$/, '').toLowerCase().replace(/[\s_-]+/g, '');

const isClassThematicToBg = (clsName, bgId) => {
    if (!bgId) return true;
    const bg = BACKGROUND_DATA[bgId];
    if (!bg) return true;
    const norm = normalizeClassId(clsName);
    // 1. Direct classHook
    if (bg.classHooks?.some(h => normalizeClassId(h.classId) === norm)) return true;
    // 2. Direct tensionPairing
    if (bg.tensionPairings?.some(t => normalizeClassId(t.classId) === norm)) return true;
    // 3. Classes native to any of the background's allowed subraces
    const allowed = bg.restrictions?.allowedSubraces || [];
    if (allowed.length > 0) {
        return allowed.some(sid => {
            const tradition = HERITAGE_TRADITIONS[sid];
            return tradition?.classes?.some(c => normalizeClassId(c) === norm);
        });
    }
    return true;
};

const isBgThematicToClass = (bg, className) => {
    if (!className) return true;
    const norm = normalizeClassId(className);
    // 1. Direct classHook
    if (bg.classHooks?.some(h => normalizeClassId(h.classId) === norm)) return true;
    // 2. Direct tensionPairing
    if (bg.tensionPairings?.some(t => normalizeClassId(t.classId) === norm)) return true;
    // 3. Overlap between background allowed subraces and class native subraces
    const classSubraces = getClassNativeHeritageIds(className);
    const bgSubraces = bg.restrictions?.allowedSubraces || [];
    if (bgSubraces.length === 0) return true;
    return bgSubraces.some(sid => classSubraces.includes(sid));
};

const RiteHeader = ({ numeral, title, hint, value, pendingText = 'Unchosen', onClear, required }) => (
    <header className={`draft-rite-header ${value ? 'is-set' : ''} ${required ? 'is-required' : ''}`}>
        <span className="draft-rite-numeral" aria-hidden="true">{numeral}</span>
        <div className="draft-rite-titles">
            <h3 className="section-headline">{title}</h3>
            <span className="draft-rite-hint">{hint}</span>
        </div>
        <div className="draft-rite-status-group">
            <span className="draft-rite-status" title={value || pendingText}>
                {value ? (<><i className="fas fa-check" aria-hidden="true"></i>{value}</>) : pendingText}
            </span>
            {value && onClear && (
                <button
                    type="button"
                    className="draft-rite-clear-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                    }}
                    title={`Clear ${title} selection`}
                    aria-label={`Clear ${title} selection`}
                >
                    <i className="fas fa-times"></i>
                </button>
            )}
        </div>
    </header>
);

const Step1CoreDraft = () => {

    const user = useAuthStore(state => state.user);

    const customLineages = useCustomLineageStore(state => state.lineages);

    const state = useCharacterWizardState();

    const dispatch = useCharacterWizardDispatch();



    const { characterData, validationErrors } = state;

    const { baseStats, race, subrace, background, name, gender } = characterData;

    const [nameTouched, setNameTouched] = useState(false);



    const selectedRace = race ? getRaceData(race) : null;

    const selectedSubrace = selectedRace && subrace ? Object.values(selectedRace.subraces).find(sr => sr.id === subrace) : null;



    // Popups & Drawers State

    const [showAppearanceModal, setShowAppearanceModal] = useState(false);

    const [showStatsDrawer, setShowStatsDrawer] = useState(false);

    const [showJustificationModal, setShowJustificationModal] = useState(false);

    const [justificationTarget, setJustificationTarget] = useState(null); // { type: 'class' | 'background', name: string, id: string }

    const [customJustification, setCustomJustification] = useState('');



    const handleConfirmJustification = (justificationText) => {

        if (!justificationTarget || justificationTarget.type !== 'background') return;



        // Append to backstory

        const oldBackstory = characterData.lore?.backstory || '';

        const prefix = `[Narrative Unlock Justification - ${justificationTarget.type === 'class' ? 'Class' : 'Background'} (${justificationTarget.name})]: ${justificationText}\n\n`;

        const newBackstory = prefix + oldBackstory;



        dispatch(wizardActionCreators.updateLore({

            ...characterData.lore,

            backstory: newBackstory

        }));



        // Set the choice

        if (justificationTarget.type === 'background') {

            dispatch(wizardActionCreators.setBackground(justificationTarget.id));

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

    const [showRestrictedClasses, setShowRestrictedClasses] = useState(false);
    const [showRestrictedRaces, setShowRestrictedRaces] = useState(false);
    const [showRestrictedBackgrounds, setShowRestrictedBackgrounds] = useState(false);

    const [showSpellsDrawer, setShowSpellsDrawer] = useState(false);

    const [focusedSection, setFocusedSection] = useState('race'); // 'race', 'class', 'background'

    const [expandedRace, setExpandedRace] = useState(race || 'myrathil');

    const [activeRaceSelection, setActiveRaceSelection] = useState(race || null);

    // Lore sections now displayed on a single scrollable page (no tab switching)

    const [lightboxImage, setLightboxImage] = useState(null);

    const [heritageIllIndex, setHeritageIllIndex] = useState(0);

    useEffect(() => {
        setHeritageIllIndex(0);
    }, [race, subrace]);

    const heritageIllustrations = useMemo(() => {
        return getHeritageIllustrations(selectedRace?.id, selectedSubrace?.id);
    }, [selectedRace?.id, selectedSubrace?.id]);

    const currentHeritageIll = heritageIllustrations[heritageIllIndex] || heritageIllustrations[0] || {
        src: getHeritageImage(selectedRace?.id, selectedSubrace?.id),
        caption: selectedSubrace?.name || selectedRace?.name || ''
    };

    const [mobilePanel, setMobilePanel] = useState('selections');

    const [classIllIndex, setClassIllIndex] = useState(0);

    const classIllustrations = useMemo(() => {
        const clsData = CLASS_DATA_MAP[characterData.class];
        if (!clsData) return [];
        // Most classes keep the race gallery on overview.illustrations; Minstrel,
        // Plaguebringer, Pyrofiend and Spellguard keep it at the data top level.
        const gallery = (clsData.overview?.illustrations?.length ? clsData.overview.illustrations : null)
            || (Array.isArray(clsData.illustrations) && clsData.illustrations.length > 0 ? clsData.illustrations : null);
        if (gallery) {
            return gallery.map(ill => ({
                src: ill.url,
                caption: ill.caption,
                subraceId: ill.subraceId
            }));
        }
        const single = clsData.overview?.illustration || clsData.illustration;
        if (single) {
            return [{
                src: single,
                caption: clsData.overview?.illustrationCaption || clsData.illustrationCaption || clsData.name
            }];
        }
        return [];
    }, [characterData.class]);

    useEffect(() => {
        if (classIllustrations.length === 0) {
            setClassIllIndex(0);
            return;
        }
        if (selectedSubrace) {
            const subraceMatch = classIllustrations.findIndex(ill => ill.subraceId === selectedSubrace.id);
            if (subraceMatch >= 0) {
                setClassIllIndex(subraceMatch);
                return;
            }
        }
        if (selectedRace) {
            // No subrace-specific portrait: fall back to any portrait native to the
            // chosen race so the codex still shows a race x class illustration.
            const raceMatch = classIllustrations.findIndex(
                ill => HERITAGE_TRADITIONS[ill.subraceId]?.raceId === selectedRace.id
            );
            if (raceMatch >= 0) {
                setClassIllIndex(raceMatch);
                return;
            }
        }
        setClassIllIndex(0);
    }, [characterData.class, selectedRace?.id, selectedSubrace?.id, classIllustrations]);

    const currentClassIll = classIllustrations[classIllIndex] || classIllustrations[0] || null;



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



        const rawFiltered = allSpells.filter(spell => level1SpellIds.includes(spell.id));
        const uniqueSpells = [];
        const seenSpellKeys = new Set();
        rawFiltered.forEach(spell => {
            const key = spell.id || spell.name;
            if (!seenSpellKeys.has(key)) {
                seenSpellKeys.add(key);
                uniqueSpells.push(spell);
            }
        });

        return uniqueSpells.map(spell => ({
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
        setNameTouched(true);
        dispatch(wizardActionCreators.updateBasicInfo({ name: e.target.value }));
    };



    const handleRandomName = () => {
        setNameTouched(true);
        dispatch(wizardActionCreators.updateBasicInfo({ name: getRandomCharacterName(race) }));
    };



    const handleGenderChange = (selectedGender) => {

        dispatch(wizardActionCreators.updateBasicInfo({ gender: selectedGender }));

    };



    // Race Handlers

    const getRaceList = () => {
        const canonRaces = Object.entries(RACE_DATA).map(([raceId, raceData]) => ({
            id: raceId,
            name: raceData.name,
            description: raceData.description,
            essence: raceData.essence || raceData.name,
            cardFlavor: raceData.cardFlavor,
            icon: getRaceIcon(raceData.name),
            isCustom: false,
            subraces: Object.entries(raceData.subraces || {}).map(([subraceKey, subraceData]) => ({
                id: subraceData.id,
                name: subraceData.name,
                description: subraceData.description,
                tooltipSummary: subraceData.tooltipSummary,
                statModifiers: subraceData.statModifiers,
                crest: subraceData.crest || null
            }))
        }));

        // Custom lineages authored in the Custom Lineage Wizard surface here
        // so they can actually be chosen during hero creation.
        const customRaces = customLineages.map((l) => {
            const adapted = getRaceData(l.id) || l;
            return {
                id: l.id,
                name: l.name,
                description: l.description || l.visualDescription || '',
                essence: l.essence || l.name,
                cardFlavor: l.cardFlavor || l.essence,
                icon: 'fas fa-dna',
                isCustom: true,
                subraces: Object.entries(adapted.subraces || {}).map(([subraceKey, subraceData]) => ({
                    id: subraceData.id,
                    name: subraceData.name,
                    description: subraceData.description,
                    tooltipSummary: subraceData.tooltipSummary,
                    statModifiers: subraceData.statModifiers,
                    crest: subraceData.crest || null
                }))
            };
        });

        return [...canonRaces, ...customRaces];
    };



    const getRaceIcon = (raceName) => {

        const icons = {

            'Myrathil': 'fas fa-water',

            'Mimir': 'fas fa-mask',

            'Florae': 'fas fa-leaf',

            'Groven': 'fas fa-shield-alt',

            'Solari': 'fas fa-fire',

            'Mycellan': 'fas fa-eye',

            'Athien': 'fas fa-scroll',

            'Astril': 'fas fa-star',

            'Fex': 'fas fa-cog',

            'Human': 'fas fa-user'

        };

        return icons[raceName] || 'fas fa-user';

    };



    const heritageNarrowing = useMemo(() => {
        const selectedClass = characterData.class;
        const selectedBg = background;
        const bgData = BACKGROUND_DATA[selectedBg];

        if (!selectedClass && !selectedBg) {
            return { isNarrowed: false, nativeRaceIds: new Set(), nativeSubraceIds: new Set(), reason: null };
        }

        const classSubraces = selectedClass ? getClassNativeHeritageIds(selectedClass) : null;
        const bgSubraces = (selectedBg && bgData?.restrictions?.allowedSubraces?.length > 0)
            ? bgData.restrictions.allowedSubraces
            : null;

        let targetSubraces = null;
        let reason = '';

        if (classSubraces && bgSubraces) {
            const intersection = classSubraces.filter(id => bgSubraces.includes(id));
            if (intersection.length > 0) {
                targetSubraces = intersection;
                reason = `Native to ${selectedClass} & ${bgData.name}`;
            } else {
                targetSubraces = Array.from(new Set([...classSubraces, ...bgSubraces]));
                reason = `Thematic to ${selectedClass} or ${bgData.name}`;
            }
        } else if (classSubraces) {
            targetSubraces = classSubraces;
            reason = `Native tradition for ${selectedClass}`;
        } else if (bgSubraces) {
            targetSubraces = bgSubraces;
            reason = `Homelands of the ${bgData.name}`;
        }

        if (!targetSubraces || targetSubraces.length === 0) {
            return { isNarrowed: false, nativeRaceIds: new Set(), nativeSubraceIds: new Set(), reason: null };
        }

        const nativeSubraceIds = new Set(targetSubraces);
        const nativeRaceIds = new Set();
        const raceList = getRaceList();
        raceList.forEach(r => {
            const subraces = Array.isArray(r.subraces) ? r.subraces : [];
            if (subraces.some(s => nativeSubraceIds.has(s.id))) {
                nativeRaceIds.add(r.id);
            }
        });

        return {
            isNarrowed: true,
            nativeRaceIds,
            nativeSubraceIds,
            reason
        };
    }, [characterData.class, background, customLineages]);

    const handleRaceClick = (raceId) => {

        setExpandedRace(expandedRace === raceId ? null : raceId);

        setFocusedSection('race');

    };



    const handleSubraceSelect = (raceId, subraceId) => {
        if (subrace === subraceId) {
            dispatch(wizardActionCreators.setSubrace(''));
            return;
        }

        dispatch(wizardActionCreators.setRace(raceId));

        dispatch(wizardActionCreators.setSubrace(subraceId));

        setFocusedSection('class');

    };



    // Class Handlers

    // Bring a codex section into view when a selection is made, so the race x
    // class artwork (or heritage/origin lore) is actually shown, not off-screen.
    const scrollCodexTo = (sectionId) => {
        const el = typeof document !== 'undefined' ? document.getElementById(sectionId) : null;
        if (el && el.offsetParent !== null && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleClassClick = (className) => {
        if (characterData.class === className) {
            dispatch(wizardActionCreators.setClass(''));
            dispatch(wizardActionCreators.setStartingSpells([]));
            return;
        }
        // A draft may explore an exceptional path; final validation requires
        // evidence and compatible state rather than a backstory approval.
        dispatch(wizardActionCreators.setClass(className));
        setFocusedSection('class');
        if (characterData.class !== className) dispatch(wizardActionCreators.setStartingSpells([]));
        window.setTimeout(() => scrollCodexTo('grimoire-calling'), 80);
    };

    const isCharacterClassCompatible = className => isClassCompatible(className, race, subrace,
        getCharacterHeritageOptions(characterData, className));



    // Background Handlers

    const handleBackgroundChange = (bgId) => {
        if (background === bgId) {
            dispatch(wizardActionCreators.setBackground(''));
            return;
        }

        const bg = BACKGROUND_DATA[bgId];

        const { selectable, narrativeUnlock } = isBackgroundCompatible(bg, race, subrace);

        const isCompatible = !race || (selectable && !narrativeUnlock);

        if (isCompatible) {

            dispatch(wizardActionCreators.setBackground(bgId));

            setFocusedSection('background');

        } else {

            setJustificationTarget({ type: 'background', name: bg.name, id: bgId });

            setShowJustificationModal(true);

        }

    };



    // Appearance Handlers

    const handleImageUpload = async (e) => {

        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {

            try {

                const currentUserId = user?.uid || (user?.isGuest ? 'guest' : null);

                const result = await uploadAsset(currentUserId, file, 'portraits', { profile: 'PORTRAIT' });

                if (result.success && result.url) {

                    setImagePreview(result.url);

                    dispatch(wizardActionCreators.updateBasicInfo({

                        characterImage: result.url,

                        imageTransformations: { scale: 1.5, rotation: 0, positionX: 0, positionY: 0 }

                    }));

                }

            } catch (err) {

                console.error('Failed to process character portrait:', err);

            }

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

    const getSelectedRaceData = () => getRaceData(race) || null;

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

                        <RiteHeader
                            numeral="I"
                            title="Heritage"
                            hint={
                                heritageNarrowing.isNarrowed && !selectedSubrace
                                    ? `Filtered: ${heritageNarrowing.reason}`
                                    : "Blood and homeland · race"
                            }
                            value={selectedSubrace && selectedRace ? `${selectedSubrace.name} ${selectedRace.name}` : selectedRace ? selectedRace.name : null}
                            pendingText={selectedRace ? 'Pick a lineage' : 'Unchosen'}
                            required={!!(validationErrors.race || validationErrors.subrace)}
                            onClear={selectedRace || selectedSubrace ? () => {
                                dispatch(wizardActionCreators.setRace(''));
                                dispatch(wizardActionCreators.setSubrace(''));
                                setActiveRaceSelection(null);
                            } : null}
                        />

                        

                        {!activeRaceSelection ? (() => {
                            const allRaces = getRaceList();
                            const isNarrowed = heritageNarrowing.isNarrowed;
                            const nativeRaces = isNarrowed
                                ? allRaces.filter(r => heritageNarrowing.nativeRaceIds.has(r.id))
                                : allRaces;
                            const otherRaces = isNarrowed
                                ? allRaces.filter(r => !heritageNarrowing.nativeRaceIds.has(r.id))
                                : [];
                            const isCurrentRaceInOther = race && otherRaces.some(r => r.id === race);

                            const renderRaceToken = (raceObj, isNonNative) => {
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
                                        {isNonNative && (
                                            <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #b08a4a', color: '#8a5a00', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                                <i className="fas fa-exclamation-triangle" style={{ marginRight: '4px' }}></i>
                                                Non-native lineage for selected path
                                            </div>
                                        )}
                                    </div>
                                );

                                return (
                                    <div
                                        key={raceObj.id}
                                        className={`race-button-token ${isSelectedRace ? 'selected' : ''} ${isNonNative ? 'narrative-unlock' : ''}`}
                                        role="button"
                                        tabIndex={0}
                                        aria-pressed={isSelectedRace}
                                        onKeyDown={activateOnKey}
                                        onClick={() => {
                                            setActiveRaceSelection(raceObj.id);
                                            if (raceObj.id !== race) {
                                                dispatch(wizardActionCreators.setRace(raceObj.id));
                                                dispatch(wizardActionCreators.setSubrace(''));
                                            }
                                            setFocusedSection('race');
                                        }}
                                        onMouseEnter={handleMouseEnter(raceTooltipContent, { title: isNonNative ? `${raceObj.name} (Other Homeland)` : raceObj.name })}
                                        onMouseLeave={handleMouseLeave}
                                        onMouseMove={handleMouseMove}
                                        style={isNonNative ? { borderStyle: 'dashed', borderColor: '#d4af37' } : undefined}
                                    >
                                        <span className="race-token-sigil" aria-hidden="true"><i className={`${raceObj.icon} race-token-icon`}></i></span>
                                        <span className="race-token-text">
                                            <span className="race-token-label">{raceObj.name}</span>
                                            {raceObj.essence && raceObj.essence !== raceObj.name && (
                                                <span className="race-token-essence">{raceObj.essence}</span>
                                            )}
                                        </span>
                                    </div>
                                );
                            };

                            return (
                                <>
                                    {isNarrowed && (
                                        <h4 className="categorized-section-title">Native Homelands &amp; Lineages</h4>
                                    )}
                                    <div className="race-buttons-grid">
                                        {nativeRaces.map(r => renderRaceToken(r, false))}
                                    </div>

                                    {otherRaces.length > 0 && (
                                        <div className="restricted-toggle-container">
                                            <button
                                                type="button"
                                                className={`restricted-toggle-button ${showRestrictedRaces ? 'open' : ''} ${isCurrentRaceInOther ? 'has-selected' : ''}`}
                                                onClick={() => setShowRestrictedRaces(prev => !prev)}
                                                aria-expanded={showRestrictedRaces}
                                            >
                                                <div className="restricted-toggle-left">
                                                    <i className={`fas fa-chevron-${showRestrictedRaces ? 'down' : 'right'} toggle-chevron`}></i>
                                                    <span className="restricted-toggle-label">
                                                        Other Homelands (Rare / Narrative Exceptions)
                                                    </span>
                                                    <span className="restricted-count-badge">{otherRaces.length}</span>
                                                </div>
                                                {isCurrentRaceInOther && (
                                                    <span className="restricted-selected-indicator">
                                                        <i className="fas fa-check-circle"></i> Selected: {getRaceData(race)?.name || race}
                                                    </span>
                                                )}
                                            </button>
                                            {showRestrictedRaces && (
                                                <div className="race-buttons-grid restricted-grid toggleable-restricted-content">
                                                    {otherRaces.map(r => renderRaceToken(r, true))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            );
                        })() : (

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

                                        {getRaceData(activeRaceSelection)?.name}

                                    </span>

                                </div>

                                <div className="subrace-buttons-grid">

                                    {(getRaceData(activeRaceSelection)?.subraces ? Object.values(getRaceData(activeRaceSelection).subraces) : []).map((subObj) => {

                                        const isSelectedSubrace = subrace === subObj.id;
                                        const isNativeLineage = !heritageNarrowing.isNarrowed || heritageNarrowing.nativeSubraceIds.has(subObj.id);

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

                                                {heritageNarrowing.isNarrowed && (
                                                    <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #b08a4a', color: isNativeLineage ? '#15803d' : '#8a5a00', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                                        <i className={`fas fa-${isNativeLineage ? 'check-circle' : 'info-circle'}`} style={{ marginRight: '4px' }}></i>
                                                        {isNativeLineage ? (heritageNarrowing.reason || 'Native Lineage') : 'Rare / Non-native path for chosen calling or background'}
                                                    </div>
                                                )}

                                            </div>

                                        );

                                        return (

                                            <div

                                                key={subObj.id}

                                                className={`subrace-button-token ${isSelectedSubrace ? 'selected' : ''} ${!isNativeLineage ? 'narrative-unlock' : ''}`}

                                                role="button"

                                                tabIndex={0}

                                                aria-pressed={isSelectedSubrace}

                                                onKeyDown={activateOnKey}

                                                onClick={() => handleSubraceSelect(activeRaceSelection, subObj.id)}

                                                onMouseEnter={handleMouseEnter(subraceTooltipContent, { title: !isNativeLineage ? `${subObj.name} (Sourced Lineage)` : subObj.name })}

                                                onMouseLeave={handleMouseLeave}

                                                onMouseMove={handleMouseMove}

                                                style={!isNativeLineage ? { borderStyle: 'dashed', borderColor: '#d4af37' } : undefined}

                                            >

                                                <div className="subrace-token-title-wrapper">
                                                    {subObj.crest && (
                                                        <img src={subObj.crest} alt="" className="subrace-token-crest-img" />
                                                    )}
                                                    <span className="subrace-token-title">{subObj.name}</span>
                                                </div>

                                                {heritageNarrowing.isNarrowed && (
                                                    isNativeLineage
                                                        ? <span className="subrace-native-badge">Native</span>
                                                        : <span className="subrace-rare-badge">Sourced</span>
                                                )}

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

                        <RiteHeader
                            numeral="II"
                            title="Calling"
                            hint={!race && background ? `Thematic to ${BACKGROUND_DATA[background]?.name || 'Origin'}` : "The path you walk · class"}
                            value={characterData.class || null}
                            required={!!validationErrors.class}
                            onClear={characterData.class ? () => {
                                dispatch(wizardActionCreators.setClass(''));
                                dispatch(wizardActionCreators.setStartingSpells([]));
                            } : null}
                        />

                        {characterData.class && validationErrors.class && <span className="section-error-msg">{validationErrors.class}</span>}

                        

                        <div className="class-grid-wrapper">

                            {(() => {
                                // Classes that are exclusive to a single subrace (narrativeUnlock: false)
                                // are hidden entirely for incompatible heritage combinations.
                                const isExclusiveClassMismatch = (clsName) => {
                                    const classInfo = CLASS_DATA_MAP[clsName];
                                    if (classInfo?.restrictions?.narrativeUnlock !== false) return false;
                                    return !isCharacterClassCompatible(clsName);
                                };
                                const allClassNames = Array.from(new Set(Object.values(CLASS_GROUPS).flat()))
                                    .filter((clsName) => !isExclusiveClassMismatch(clsName));
                                const isClassThematic = (clsName) => {
                                    if (race) {
                                        return isCharacterClassCompatible(clsName);
                                    }
                                    if (background) {
                                        return isClassThematicToBg(clsName, background);
                                    }
                                    return true;
                                };

                                const compatibleClasses = allClassNames.filter((clsName) => isClassThematic(clsName));
                                const restrictedClasses = allClassNames.filter((clsName) => !isClassThematic(clsName));
                                const isCurrentClassRestricted = restrictedClasses.includes(characterData.class);

                                const renderClassToken = (clsName) => {
                                    const classInfo = CLASS_DATA_MAP[clsName];
                                    const isSelectedClass = characterData.class === clsName;
                                    const isCompatible = isClassThematic(clsName);
                                    const classAccess = getCharacterClassAccess(characterData, clsName);

                                    const tooltipContent = (
                                        <div className="class-tooltip-content" style={{ fontFamily: "'Crimson Text', serif", fontSize: '0.9rem', maxWidth: '240px' }}>
                                            {classInfo?.overview?.theme && (
                                                <div className="class-tooltip-theme" style={{ color: '#7a5a35', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '3px' }}>
                                                    Theme: {classInfo.overview.theme}
                                                </div>
                                            )}
                                            {classInfo?.role && (
                                                <div className="class-tooltip-role" style={{ color: '#5a3d1d', fontStyle: 'italic', fontSize: '0.8rem', marginBottom: '6px' }}>
                                                    Role: {classInfo.role}
                                                </div>
                                            )}
                                            <p className="class-tooltip-description" style={{ margin: 0, color: '#2e1e0f', lineHeight: '1.4' }}>
                                                {getClassSummary(classInfo)}
                                            </p>
                                            {!isCompatible && (
                                                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #b08a4a', color: '#8a5a00', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '4px' }}></i>
                                                    {race ? (classAccess.reason || 'Sourced acquisition required') : 'Non-thematic to selected origin'}
                                                </div>
                                            )}
                                        </div>
                                    );

                                    return (
                                        <div 
                                            key={clsName} 
                                            className={`class-icon-token ${isSelectedClass ? 'selected' : ''} ${!isCompatible ? 'narrative-unlock' : ''}`}
                                            role="button"
                                            tabIndex={0}
                                            aria-pressed={isSelectedClass}
                                            aria-label={clsName}
                                            onKeyDown={activateOnKey}
                                            onClick={() => handleClassClick(clsName)}
                                            onMouseEnter={handleMouseEnter(tooltipContent, { title: !isCompatible ? (race ? `${clsName} (Acquisition / State Required)` : `${clsName} (Other Calling)`) : clsName })}
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

                                const callingSectionTitle = race
                                    ? "Native & Qualified Callings"
                                    : background
                                        ? `Thematic Callings (${BACKGROUND_DATA[background]?.name || 'Origin'})`
                                        : "All Callings";

                                const otherCallingsLabel = race
                                    ? "Other Callings (Acquisition / State Required)"
                                    : "Other Callings (Non-Thematic to Origin)";

                                return (
                                    <>
                                        <h4 className="categorized-section-title">{callingSectionTitle}</h4>
                                        <div className="class-icons-grid">
                                            {compatibleClasses.map(renderClassToken)}
                                        </div>

                                        {restrictedClasses.length > 0 && (
                                            <div className="restricted-toggle-container">
                                                <button
                                                    type="button"
                                                    className={`restricted-toggle-button ${showRestrictedClasses ? 'open' : ''} ${isCurrentClassRestricted ? 'has-selected' : ''}`}
                                                    onClick={() => setShowRestrictedClasses(prev => !prev)}
                                                    aria-expanded={showRestrictedClasses}
                                                >
                                                    <div className="restricted-toggle-left">
                                                        <i className={`fas fa-chevron-${showRestrictedClasses ? 'down' : 'right'} toggle-chevron`}></i>
                                                        <span className="restricted-toggle-label">
                                                            {otherCallingsLabel}
                                                        </span>
                                                        <span className="restricted-count-badge">{restrictedClasses.length}</span>
                                                    </div>
                                                    {isCurrentClassRestricted && (
                                                        <span className="restricted-selected-indicator">
                                                            <i className="fas fa-check-circle"></i> Selected: {characterData.class}
                                                        </span>
                                                    )}
                                                </button>
                                                {showRestrictedClasses && (
                                                    <div className="class-icons-grid restricted-grid toggleable-restricted-content">
                                                        {restrictedClasses.map(renderClassToken)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                        </div>

                    </div>

                    <ClassAcquisitionEditor characterData={characterData}
                        onChange={patch => dispatch(wizardActionCreators.updateBasicInfo(patch))}
                        warnings={validateCharacterClassAccess(characterData, state.originalCalling).warnings} />

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
                                    <h5 style={{ margin: 0, color: '#5a3d1d', fontSize: '1.15rem', fontWeight: 'bold' }}>{variant.subraceName} {characterData.class}: {variant.title}</h5>
                                </div>
                                <p style={{ margin: '0 0 12px', color: '#2e1e0f', lineHeight: '1.6', fontSize: '0.95rem' }}>{formatDescriptionText(variant.reframe)}</p>
                                {variant.signatureAbility && (
                                    <div style={{ marginBottom: '10px', padding: '10px 14px', background: 'rgba(176,138,74,0.08)', borderRadius: '4px', borderLeft: '3px solid #b08a4a' }}>
                                        <div style={{ fontWeight: 'bold', color: '#7a5a35', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            <i className="fas fa-bolt" style={{ marginRight: '4px' }}></i>{variant.signatureAbility.name}
                                        </div>
                                        <p style={{ margin: 0, color: '#3e2e1f', fontSize: '0.9rem', lineHeight: '1.5' }}>{formatDescriptionText(variant.signatureAbility.description)}</p>
                                    </div>
                                )}
                                {variant.currentCrisisAngle && (
                                    <div style={{ marginBottom: '10px', padding: '10px 14px', background: 'rgba(139,0,0,0.05)', borderRadius: '4px', borderLeft: '3px solid #8b0000' }}>
                                        <div style={{ fontWeight: 'bold', color: '#8b0000', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            <i className="fas fa-exclamation-circle" style={{ marginRight: '4px' }}></i>Current Crisis
                                        </div>
                                        <p style={{ margin: 0, color: '#3e2e1f', fontSize: '0.9rem', lineHeight: '1.5' }}>{formatDescriptionText(variant.currentCrisisAngle)}</p>
                                    </div>
                                )}
                                {variant.signatureQuote && (
                                    <div style={{ padding: '10px 14px', background: 'rgba(90,61,29,0.06)', borderRadius: '4px', fontStyle: 'italic' }}>
                                        <p style={{ margin: '0 0 4px', color: '#5a3d1d', fontSize: '0.9rem', lineHeight: '1.5' }}>{formatDescriptionText(variant.signatureQuote.text)}</p>
                                        <span style={{ color: '#8a7a5a', fontSize: '0.8rem' }}>- {variant.signatureQuote.speaker}, {variant.signatureQuote.context}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })()}



                    {/* Origins (Background Buttons Grid) */}

                    <div className="core-draft-section">

                        <RiteHeader
                            numeral="III"
                            title="Origin"
                            hint={!race && characterData.class ? `Thematic to ${characterData.class}` : "Who you were before · background"}
                            value={BACKGROUND_DATA[background]?.name || null}
                            required={!!validationErrors.background}
                            onClear={background ? () => {
                                dispatch(wizardActionCreators.setBackground(''));
                            } : null}
                        />

                        

                        <div className="background-buttons-wrapper">

                            {(() => {
                                const allBackgrounds = Object.values(BACKGROUND_DATA);
                                const isThematicBg = (bg) => {
                                    if (race) {
                                        const { selectable, narrativeUnlock } = isBackgroundCompatible(bg, race, subrace);
                                        return selectable && !narrativeUnlock;
                                    }
                                    if (characterData.class) {
                                        return isBgThematicToClass(bg, characterData.class);
                                    }
                                    return true;
                                };

                                const compatibleBackgrounds = allBackgrounds.filter(isThematicBg);
                                const restrictedBackgrounds = allBackgrounds.filter(bg => !isThematicBg(bg));
                                const isCurrentBackgroundRestricted = restrictedBackgrounds.some(bg => bg.id === background);

                                const renderBackgroundToken = (bg) => {
                                    const isThematic = isThematicBg(bg);
                                    const requiresUnlock = !isThematic;

                                    const bgTooltipContent = (
                                        <div className="bg-tooltip-content" style={{ fontFamily: "'Crimson Text', serif", fontSize: '0.9rem', maxWidth: '240px' }}>
                                            {bg.feature?.name && (
                                                <div style={{ color: '#7a5a35', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                    Feature: {bg.feature.name}
                                                </div>
                                            )}
                                            <p style={{ margin: 0, color: '#2e1e0f', lineHeight: '1.4' }}>
                                                {getBackgroundSummary(bg)}
                                            </p>
                                            {requiresUnlock && (
                                                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #b08a4a', color: '#8a5a00', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '4px' }}></i>
                                                    {race ? 'Narrative Unlock: Requires GM approval' : 'Non-thematic to selected calling'}
                                                </div>
                                            )}
                                        </div>
                                    );

                                    return (
                                        <div
                                            key={bg.id}
                                            className={`background-button-token ${background === bg.id ? 'selected' : ''} ${requiresUnlock ? 'narrative-unlock' : ''}`}
                                            role="button"
                                            tabIndex={0}
                                            aria-pressed={background === bg.id}
                                            onKeyDown={activateOnKey}
                                            onClick={() => handleBackgroundChange(bg.id)}
                                            onMouseEnter={handleMouseEnter(bgTooltipContent, { title: requiresUnlock ? (race ? `${bg.name} (Narrative Unlock)` : `${bg.name} (Other Origin)`) : bg.name })}
                                            onMouseLeave={handleMouseLeave}
                                            onMouseMove={handleMouseMove}
                                        >
                                            <i className={`${BACKGROUND_ICONS[bg.id] || BACKGROUND_ICONS_MYTHRILL[bg.id] || 'fas fa-compass'} background-token-icon`}></i>
                                            <span className="background-token-label">{bg.name}</span>
                                        </div>
                                    );
                                };

                                const originSectionTitle = race
                                    ? "Lore-Fitting Origins"
                                    : characterData.class
                                        ? `Thematic Origins (${characterData.class})`
                                        : "All Origins";

                                const otherOriginsLabel = race
                                    ? "Non-Native Origins (Requires GM Approval)"
                                    : "Other Origins (Non-Thematic to Calling)";

                                return (
                                    <>
                                        <h4 className="categorized-section-title">{originSectionTitle}</h4>
                                        <div className="background-buttons-grid">
                                            {compatibleBackgrounds.map(renderBackgroundToken)}
                                        </div>

                                        {restrictedBackgrounds.length > 0 && (
                                            <div className="restricted-toggle-container">
                                                <button
                                                    type="button"
                                                    className={`restricted-toggle-button ${showRestrictedBackgrounds ? 'open' : ''} ${isCurrentBackgroundRestricted ? 'has-selected' : ''}`}
                                                    onClick={() => setShowRestrictedBackgrounds(prev => !prev)}
                                                    aria-expanded={showRestrictedBackgrounds}
                                                >
                                                    <div className="restricted-toggle-left">
                                                        <i className={`fas fa-chevron-${showRestrictedBackgrounds ? 'down' : 'right'} toggle-chevron`}></i>
                                                        <span className="restricted-toggle-label">
                                                            {otherOriginsLabel}
                                                        </span>
                                                        <span className="restricted-count-badge">{restrictedBackgrounds.length}</span>
                                                    </div>
                                                    {isCurrentBackgroundRestricted && (
                                                        <span className="restricted-selected-indicator">
                                                            <i className="fas fa-check-circle"></i> Selected: {BACKGROUND_DATA[background]?.name || background}
                                                        </span>
                                                    )}
                                                </button>
                                                {showRestrictedBackgrounds && (
                                                    <div className="background-buttons-grid restricted-grid toggleable-restricted-content">
                                                        {restrictedBackgrounds.map(renderBackgroundToken)}
                                                    </div>
                                                )}
                                            </div>
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

                            : 'radial-gradient(ellipse at 50% 42%, rgba(253, 248, 239, 0.9) 0%, rgba(232, 219, 190, 0.55) 55%, rgba(153, 126, 85, 0.32) 100%)'

                    }}

                >

                    <div className="canvas-frame-gothic">

                        <div className="canvas-portrait-area mode-2d">
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
                                        <i className="fas fa-feather-alt" aria-hidden="true"></i>
                                        <span>Choose a likeness</span>
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

                                    placeholder="Name your hero"

                                    aria-label="Hero name"

                                    maxLength={50}

                                    onBlur={() => { if (name && name.trim().length > 0) setNameTouched(true); }}

                                    className={`interactive-name-input ${nameTouched && validationErrors.name ? 'error' : ''}`}

                                />

                                <button type="button" className="dice-randomizer-btn" onClick={handleRandomName} title="Roll a name" aria-label="Roll a random name">

                                    <i className="fas fa-dice"></i>

                                </button>

                            </div>

                            {nameTouched && validationErrors.name && <span className="canvas-error-label">{validationErrors.name}</span>}



                            <div className="gothic-gender-toggles">

                                {['male', 'female', 'other'].map((g) => (

                                    <button 

                                        key={g} 

                                        type="button" 

                                        className={`gender-toggle-btn ${gender === g ? 'active' : ''}`}

                                        aria-pressed={gender === g}

                                        onClick={() => handleGenderChange(g)}

                                    >

                                        <i className={g === 'male' ? 'fas fa-mars' : g === 'female' ? 'fas fa-venus' : 'fas fa-genderless'}></i>

                                        <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>

                                    </button>

                                ))}

                            </div>

                        </div>



                        {/* Hero dossier: live record of the three rites, then the drawers */}
                        <div className="draft-dossier">
                            <dl className="draft-dossier-rites">
                                <div className={`draft-dossier-row ${selectedSubrace ? 'is-set' : ''}`}>
                                    <dt>Heritage</dt>
                                    <dd>{selectedSubrace && selectedRace ? `${selectedSubrace.name} ${selectedRace.name}` : selectedRace ? `${selectedRace.name}, no lineage` : 'Unchosen'}</dd>
                                </div>
                                <div className={`draft-dossier-row ${characterData.class ? 'is-set' : ''}`}>
                                    <dt>Calling</dt>
                                    <dd>{characterData.class || 'Unchosen'}</dd>
                                </div>
                                <div className={`draft-dossier-row ${background ? 'is-set' : ''}`}>
                                    <dt>Origin</dt>
                                    <dd>{BACKGROUND_DATA[background]?.name || 'Unchosen'}</dd>
                                </div>
                            </dl>

                            <div className="canvas-drawer-launchers">
                                <button
                                    type="button"
                                    className={`launcher-trigger-btn ${validationErrors.stats ? 'warning' : ''} ${availablePoints === 0 ? 'is-complete' : ''}`}
                                    onClick={() => setShowStatsDrawer(true)}
                                >
                                    <i className="fas fa-chart-bar" aria-hidden="true"></i>
                                    <span className="launcher-label">Ability Scores</span>
                                    <span className="launcher-value">{availablePoints === 0 ? 'All points spent' : `${availablePoints} points to spend`}</span>
                                    <i className="fas fa-chevron-right launcher-chevron" aria-hidden="true"></i>
                                </button>

                                <button
                                    type="button"
                                    className={`launcher-trigger-btn ${validationErrors.spells ? 'warning' : ''} ${selectedSpells.length === 3 ? 'is-complete' : ''}`}
                                    onClick={() => setShowSpellsDrawer(true)}
                                    disabled={!characterData.class}
                                    title={!characterData.class ? 'Choose a calling first' : 'Choose starting spells'}
                                >
                                    <i className="fas fa-magic" aria-hidden="true"></i>
                                    <span className="launcher-label">Starting Spells</span>
                                    <span className="launcher-value">{!characterData.class ? 'Choose a calling first' : `${selectedSpells.length} of 3 chosen`}</span>
                                    <i className="fas fa-chevron-right launcher-chevron" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>

                    </div>

                </div>



                {/* 3. CONTEXTUAL CODEX COLUMN (RIGHT PAGE) */}

                <div className="core-draft-column codex-panel-right" data-mobile-panel="codex">

                    <div className="grimoire-book-container">

                        {/* Lore section nav dots (floating on right edge) */}

                        <div className="grimoire-section-nav">

                            <button 

                                type="button"

                                className={`grimoire-nav-dot ${selectedRace ? 'available' : ''}`} 

                                title="Jump to Heritage"

                                onClick={() => document.getElementById('grimoire-heritage')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}

                            >

                                <i className={selectedRace ? getRaceIcon(selectedRace.name) : "fas fa-scroll"}></i>

                            </button>

                            <button 

                                type="button"

                                className={`grimoire-nav-dot ${characterData.class ? 'available' : ''}`} 

                                title="Jump to Calling"

                                onClick={() => document.getElementById('grimoire-calling')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}

                            >

                                {characterData.class ? (

                                    <ClassIcon 

                                        src={CLASS_DATA_MAP[characterData.class]?.imageIcon || `/assets/icons/classes/${characterData.class.toLowerCase().replace(' ', '_')}.png`}

                                        alt={characterData.class}

                                        size="tiny"

                                        className="grimoire-dot-pixel-icon"

                                    />

                                ) : (

                                    <i className="fas fa-shield-alt"></i>

                                )}

                            </button>

                            <button 

                                type="button"

                                className={`grimoire-nav-dot ${background ? 'available' : ''}`} 

                                title="Jump to Origin"

                                onClick={() => document.getElementById('grimoire-origin')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}

                            >

                                <i className={BACKGROUND_ICONS[background] || 'fas fa-compass'}></i>

                            </button>

                        </div>

                        {/* Parchment Page */}

                        <div className="grimoire-page scroll-themed">

                            {/* Heritage Section */}

                            {selectedRace ? (

                                <div id="grimoire-heritage" className="grimoire-section grimoire-section-heritage">

                                    <div className="grimoire-header">

                                        <h2 className="grimoire-title">

                                            {selectedSubrace?.crest ? (
                                                <img
                                                    src={selectedSubrace.crest}
                                                    alt=""
                                                    className="grimoire-header-crest"
                                                    title={`${selectedSubrace.name} crest`}
                                                />
                                            ) : (
                                                <i className={selectedRace ? getRaceIcon(selectedRace.name) : "fas fa-scroll"}></i>
                                            )} Heritage

                                        </h2>

                                        <span className="grimoire-subtitle">

                                            {selectedSubrace && selectedRace ? `${selectedSubrace.name} ${selectedRace.name}` : selectedRace ? selectedRace.name : 'None Selected'}

                                        </span>

                                    </div>

                                    

                                    <div className="grimoire-heritage-showcase">
                                        <div
                                            className="grimoire-heritage-icon-wrapper"
                                            onClick={() => setLightboxImage(currentHeritageIll.src)}
                                            title="Click to zoom race illustration"
                                        >
                                            <img 
                                                src={currentHeritageIll.src}
                                                alt={currentHeritageIll.caption || (selectedSubrace ? selectedSubrace.name : selectedRace.name)}
                                                className="grimoire-large-heritage-icon grimoire-zoomable"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/assets/images/races/human_thalren_city_greymark.jpg';
                                                }}
                                            />
                                            <div className="grimoire-art-zoom-hint">
                                                <i className="fas fa-search-plus"></i>
                                            </div>
                                        </div>

                                        {heritageIllustrations.length > 1 && (
                                            <div className="grimoire-heritage-nav-row">
                                                <button
                                                    type="button"
                                                    className="grimoire-carousel-arrow-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setHeritageIllIndex(prev => (prev > 0 ? prev - 1 : heritageIllustrations.length - 1));
                                                    }}
                                                    title="Previous illustration"
                                                >
                                                    <i className="fas fa-chevron-left"></i>
                                                </button>
                                                <span className="grimoire-carousel-pills">
                                                    {heritageIllustrations.map((_, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`grimoire-carousel-pill ${idx === heritageIllIndex ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setHeritageIllIndex(idx);
                                                            }}
                                                            title={`View illustration ${idx + 1}: ${heritageIllustrations[idx]?.caption || ''}`}
                                                        />
                                                    ))}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="grimoire-carousel-arrow-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setHeritageIllIndex(prev => (prev < heritageIllustrations.length - 1 ? prev + 1 : 0));
                                                    }}
                                                    title="Next illustration"
                                                >
                                                    <i className="fas fa-chevron-right"></i>
                                                </button>
                                            </div>
                                        )}

                                        {currentHeritageIll.caption && (
                                            <div className="grimoire-heritage-caption-tag" title={currentHeritageIll.caption}>
                                                <i className="fas fa-feather-alt"></i> {currentHeritageIll.caption}
                                            </div>
                                        )}
                                    </div>

                                    <p className="grimoire-flavor-quote">"{selectedRace.cardFlavor}"</p>

                                    {selectedSubrace && (

                                        <>

                                            <h4 className="grimoire-section-header">
                                                {selectedSubrace.crest && (
                                                    <img src={selectedSubrace.crest} alt="" className="grimoire-crest-thumbnail" />
                                                )}
                                                {selectedSubrace.name}
                                            </h4>

                                            <div className="grimoire-markdown-body">

                                                <p>{selectedSubrace.description}</p>

                                            </div>

                                        </>

                                    )}

                                    {(selectedSubrace?.visualDescription || selectedRace.visualDescription) && (

                                        <>

                                            <h4 className="grimoire-section-header">Appearance</h4>

                                            <div className="grimoire-markdown-body">

                                                <p>{selectedSubrace?.visualDescription || selectedRace.visualDescription}</p>

                                            </div>

                                        </>

                                    )}

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

                                                <td>{Object.assign({}, selectedRace.baseTraits, selectedSubrace?.baseTraits || {}).lifespan}</td>

                                            </tr>

                                            <tr>

                                                <td><strong>Size</strong></td>

                                                <td>{(() => { const t = Object.assign({}, selectedRace.baseTraits, selectedSubrace?.baseTraits || {}); return `${t.size} (${t.height})`; })()}</td>

                                            </tr>

                                            <tr>

                                                <td><strong>Base Speed</strong></td>

                                                <td>{Object.assign({}, selectedRace.baseTraits, selectedSubrace?.baseTraits || {}).baseSpeed} ft</td>

                                            </tr>

                                            <tr>

                                                <td><strong>Vision Range</strong></td>

                                                <td>{(() => { const t = Object.assign({}, selectedRace.baseTraits, selectedSubrace?.baseTraits || {}); return t.visionRange || t.darkvision || 60; })()} ft</td>

                                            </tr>

                                        </tbody>

                                    </table>

                                    {selectedSubrace && selectedSubrace.traits && selectedSubrace.traits.length > 0 && (

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

                                </div>

                            ) : (

                                <div id="grimoire-heritage" className="grimoire-section grimoire-section-heritage grimoire-empty-section">

                                    <div className="grimoire-header">

                                        <h2 className="grimoire-title">

                                            <i className="fas fa-scroll"></i> Heritage

                                        </h2>

                                    </div>

                                    <div className="grimoire-empty-state-card">
                                        <div className="grimoire-watermark-icon"><i className="fas fa-feather-alt"></i></div>
                                        <h4 className="codex-placeholder-headline">The Annals of Heritage</h4>
                                        <p className="codex-placeholder-text">Choose a Heritage on the left to inscribe its ancient bloodline, traits, and physical form into this chronicle.</p>
                                    </div>

                                </div>

                            )}



                            {/* Calling Section */}

                            {characterData.class ? (

                                <div id="grimoire-calling" className="grimoire-section grimoire-section-calling">

                                    <div className="grimoire-section-divider"></div>

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

                                            {characterData.class ? CLASS_DATA_MAP[characterData.class]?.variantName || CLASS_DATA_MAP[characterData.class]?.name || characterData.class : 'None Selected'}

                                        </span>

                                    </div>

                                    

                                    {getSelectedClassData() ? (

                                        <>

                                            <div className="grimoire-class-showcase">
                                                {currentClassIll ? (
                                                    <>
                                                        <div
                                                            className="grimoire-class-art-frame"
                                                            onClick={() => setLightboxImage(currentClassIll.src)}
                                                            title="Click to zoom class illustration"
                                                        >
                                                            <img 
                                                                src={currentClassIll.src}
                                                                alt={currentClassIll.caption || characterData.class}
                                                                className="grimoire-class-art-image grimoire-zoomable"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = CLASS_DATA_MAP[characterData.class]?.imageIcon || `/assets/icons/classes/${characterData.class.toLowerCase().replace(' ', '_')}.png`;
                                                                }}
                                                            />
                                                            <div className="grimoire-art-zoom-hint">
                                                                <i className="fas fa-search-plus"></i>
                                                            </div>
                                                        </div>

                                                        {classIllustrations.length > 1 && (
                                                            <div className="grimoire-heritage-nav-row">
                                                                <button
                                                                    type="button"
                                                                    className="grimoire-carousel-arrow-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setClassIllIndex(prev => (prev > 0 ? prev - 1 : classIllustrations.length - 1));
                                                                    }}
                                                                    title="Previous illustration"
                                                                >
                                                                    <i className="fas fa-chevron-left"></i>
                                                                </button>
                                                                <span className="grimoire-carousel-pills">
                                                                    {classIllustrations.map((_, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className={`grimoire-carousel-pill ${idx === classIllIndex ? 'active' : ''}`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setClassIllIndex(idx);
                                                                            }}
                                                                            title={`View illustration ${idx + 1}: ${classIllustrations[idx]?.caption || ''}`}
                                                                        />
                                                                    ))}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="grimoire-carousel-arrow-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setClassIllIndex(prev => (prev < classIllustrations.length - 1 ? prev + 1 : 0));
                                                                    }}
                                                                    title="Next illustration"
                                                                >
                                                                    <i className="fas fa-chevron-right"></i>
                                                                </button>
                                                            </div>
                                                        )}

                                                        {currentClassIll.caption && (
                                                            <div className="grimoire-heritage-caption-tag" title={currentClassIll.caption}>
                                                                <i className="fas fa-feather-alt"></i> {currentClassIll.caption}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="grimoire-class-icon-wrapper">
                                                        <ClassIcon 
                                                            src={CLASS_DATA_MAP[characterData.class]?.imageIcon || `/assets/icons/classes/${characterData.class.toLowerCase().replace(' ', '_')}.png`}
                                                            alt={characterData.class}
                                                            size="large"
                                                            className="grimoire-large-class-icon grimoire-zoomable"
                                                            dataClass={characterData.class}
                                                            onClick={() => setLightboxImage(CLASS_DATA_MAP[characterData.class]?.imageIcon || `/assets/icons/classes/${characterData.class.toLowerCase().replace(' ', '_')}.png`)}
                                                        />
                                                    </div>
                                                )}
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

                                    ) : null}

                                </div>

                            ) : (

                                <div id="grimoire-calling" className="grimoire-section grimoire-section-calling grimoire-empty-section">

                                    <div className="grimoire-section-divider"></div>

                                    <div className="grimoire-header">

                                        <h2 className="grimoire-title">

                                            <i className="fas fa-shield-alt"></i> Class

                                        </h2>

                                    </div>

                                    <div className="grimoire-empty-state-card">
                                        <div className="grimoire-watermark-icon"><i className="fas fa-shield-alt"></i></div>
                                        <h4 className="codex-placeholder-headline">Order Arts &amp; Disciplines</h4>
                                        <p className="codex-placeholder-text">Select a Calling to reveal combat arts, primary resources, order paths, and starting spells.</p>
                                    </div>

                                </div>

                            )}



                            {/* Origin Section */}

                            {background ? (

                                <div id="grimoire-origin" className="grimoire-section grimoire-section-origin">

                                    <div className="grimoire-section-divider"></div>

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

                                                {subrace && BACKGROUND_DATA[background].subraceFlavor && BACKGROUND_DATA[background].subraceFlavor[subrace] && (
                                                    <p className="grimoire-flavor-line" style={{ fontStyle: 'italic', marginTop: '0.5rem', color: '#6b4f33' }}>
                                                        <strong>{selectedSubrace?.name || subrace}:</strong> {BACKGROUND_DATA[background].subraceFlavor[subrace]}
                                                    </p>
                                                )}

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

                                    ) : null}

                                </div>

                            ) : (

                                <div id="grimoire-origin" className="grimoire-section grimoire-section-origin grimoire-empty-section">

                                    <div className="grimoire-section-divider"></div>

                                    <div className="grimoire-header">

                                        <h2 className="grimoire-title">

                                            <i className="fas fa-compass"></i> Origin

                                        </h2>

                                    </div>

                                    <div className="grimoire-empty-state-card">
                                        <div className="grimoire-watermark-icon"><i className="fas fa-compass"></i></div>
                                        <h4 className="codex-placeholder-headline">Past Deeds &amp; Provenance</h4>
                                        <p className="codex-placeholder-text">Choose an Origin to uncover the trade, guild, or survival oath your hero swore before answering the call.</p>
                                    </div>

                                </div>

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

                            A Rare Path

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

            {/* Image Lightbox */}

            {lightboxImage && (

                <div className="grimoire-lightbox-overlay" onClick={() => setLightboxImage(null)}>

                    <div className="grimoire-lightbox-content" onClick={(e) => e.stopPropagation()}>

                        <button type="button" className="grimoire-lightbox-close" onClick={() => setLightboxImage(null)}>

                            <i className="fas fa-times"></i>

                        </button>

                        <img src={lightboxImage} alt="Enlarged view" className="grimoire-lightbox-img" />

                    </div>

                </div>

            )}

        </div>

    );

};



export default Step1CoreDraft;
