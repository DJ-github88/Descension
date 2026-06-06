/**
 * Step 2: Skills & Languages (Step 7 Internally)
 *
 * Choose skills and languages for your character in a split-pane, interactive layout.
 */

import React, { useState, useEffect } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getBackgroundData } from '../../../data/backgroundData';
import { getRaceData, getSubraceData } from '../../../data/raceData';
import { getPathData } from '../../../data/pathData';
import { SKILL_DEFINITIONS, SKILL_RANKS } from '../../../constants/skillDefinitions';
import { SKILL_QUESTS } from '../../../constants/skillQuests';
import { ROLLABLE_TABLES } from '../../../constants/rollableTables';
import { isSkillProficient } from '../../../data/skillAbilitiesData';
import {
    calculateTotalSkillPoints,
    calculatePointsSpent,
    getNextRank,
    getPreviousRank,
    getUpgradeCost,
    getDowngradeRefund
} from '../../../constants/skillPointSystem';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import { useUnifiedTooltip } from '../../common/useUnifiedTooltip';
import { getIconUrl } from '../../../utils/assetManager';

import '../styles/Step7SkillsLanguages.css';

// Mapping from D&D 5e skill names to custom skill IDs
const DND_TO_CUSTOM_SKILL_MAP = {
    'Acrobatics': 'acrobatics',
    'Animal Handling': 'animalHandling',
    'Arcana': 'arcana',
    'Athletics': 'athletics',
    'Deception': 'deception',
    'History': 'history',
    'Insight': 'insight',
    'Intimidation': 'intimidation',
    'Investigation': 'investigation',
    'Medicine': 'medicine',
    'Nature': 'nature',
    'Perception': 'perception',
    'Performance': 'performance',
    'Persuasion': 'persuasion',
    'Religion': 'religion',
    'Sleight of Hand': 'sleightOfHand',
    'Stealth': 'stealth',
    'Survival': 'survival'
};

// Map expertise rank keys to die sizes for standard skills
const mapRankToDie = (rankKey) => {
    const mapping = {
        UNTRAINED: 'd4',
        NOVICE: 'd6',
        TRAINED: 'd8',
        APPRENTICE: 'd10',
        ADEPT: 'd12',
        EXPERT: 'd20',
        MASTER: 'd20'
    };
    return mapping[rankKey] || 'd4';
};


// All available skills from SKILL_DEFINITIONS
const ALL_SKILLS = Object.entries(SKILL_DEFINITIONS).map(([skillId, skillData]) => ({
    id: skillId,
    name: skillData.name,
    icon: skillData.icon,
    description: skillData.description,
    category: skillData.category,
    primaryStat: skillData.primaryStat,
    secondaryStat: skillData.secondaryStat
}));

// All available languages
const COMMON_LANGUAGES = [
    { name: 'Common', icon: 'fa-users', category: 'standard', description: 'The universal trade language spoken by most civilized races across the realm.' },
    { name: 'Dwarvish', icon: 'fa-hammer', category: 'standard', description: 'The guttural language of dwarves, filled with hard consonants and stone references.' },
    { name: 'Elvish', icon: 'fa-tree', category: 'standard', description: 'A fluid, melodic language spoken by elves, known for its beauty and complexity.' },
    { name: 'Giant', icon: 'fa-mountain', category: 'standard', description: 'The booming language of giants and their kin, simple but powerful.' },
    { name: 'Gnomish', icon: 'fa-gears', category: 'standard', description: 'A technical language full of compound words, reflecting gnomish love of detail.' },
    { name: 'Goblin', icon: 'fa-spider', category: 'standard', description: 'A harsh, grating language spoken by goblins and related creatures.' },
    { name: 'Halfling', icon: 'fa-house', category: 'standard', description: 'A warm, friendly language reflecting halfling community values.' },

    { name: 'Abyssal', icon: 'fa-fire', category: 'exotic', description: 'The chaotic language of demons, filled with harsh, corruptive sounds.' },
    { name: 'Celestial', icon: 'fa-sun', category: 'exotic', description: 'The harmonious language of angels and celestial beings, carrying divine authority.' },
    { name: 'Draconic', icon: 'fa-dragon', category: 'exotic', description: 'The ancient, precise language of dragons, used in magical incantations.' },
    { name: 'Deep Speech', icon: 'fa-brain', category: 'exotic', description: 'The alien language of aberrations, incomprehensible to most mortal minds.' },
    { name: 'Infernal', icon: 'fa-fire-flame-curved', category: 'exotic', description: 'The structured, binding language of devils, used in dark contracts.' },
    { name: 'Primordial', icon: 'fa-wind', category: 'exotic', description: 'The ancient language of elementals, encompassing all elemental dialects.' },
    { name: 'Sylvan', icon: 'fa-seedling', category: 'exotic', description: 'The whimsical, ever-changing language of fey creatures and nature spirits.' },
    { name: 'Undercommon', icon: 'fa-dungeon', category: 'exotic', description: 'The trade language of the Underdark, spoken by subterranean races.' },

    { name: 'Old Nord', icon: 'fa-mountain', category: 'racial', description: 'The ancestral language of the Skald people, filled with tales of ice and endurance.' },
    { name: 'Corvid', icon: 'fa-crow', category: 'racial', description: 'The mysterious language of the Corvani, incorporating clicks and whistles.' },
    { name: 'Terran', icon: 'fa-gem', category: 'racial', description: 'The slow, grinding language of earth elementals and stone-touched races.' },
    { name: 'Ethereal', icon: 'fa-ghost', category: 'racial', description: 'The whispered language of spirits and the Veilborn, barely audible.' },
    { name: 'Changeling', icon: 'fa-masks-theater', category: 'racial', description: 'The secretive language of changelings, designed to convey hidden meanings.' },
    { name: 'Druidic', icon: 'fa-leaf', category: 'racial', description: 'The secret code language of druids, forbidden to non-druids.' },
    { name: 'Ignan', icon: 'fa-fire', category: 'racial', description: 'The crackling, volatile language of fire elementals and flame-touched beings.' },
    { name: 'Beast Speech', icon: 'fa-paw', category: 'racial', description: 'The primal tongue that allows communication with animals.' },
    { name: 'Necril', icon: 'fa-skull', category: 'racial', description: 'The cold, lifeless tongue of the undead, used in necromantic rituals.' },
    { name: 'Orcish', icon: 'fa-axe-battle', category: 'racial', description: 'The aggressive, direct war-tongue of orcs, used for battle commands.' },

    { name: 'Elemental', icon: 'fa-wind', category: 'elemental', description: 'The general language of elementals, bridging all elemental planes.' },
    { name: 'Primal', icon: 'fa-leaf-oak', category: 'elemental', description: 'The raw language of nature, understood by wild and ancient beings.' },
    { name: 'Auran', icon: 'fa-cloud', category: 'elemental', description: 'The light, airy language of sky-dwelling and wind elementals.' },
    { name: 'Aquan', icon: 'fa-water', category: 'elemental', description: 'The fluid, flowing language of water elementals and sea-folk.' },

    { name: 'Thieves\' Cant', icon: 'fa-mask', category: 'special', description: 'A secret code jargon used by rogues to communicate covertly in public.' },
    { name: 'Sign Language', icon: 'fa-hands', category: 'special', description: 'A universal gestural language allowing silent communication.' },
    { name: 'All Ancient Languages', icon: 'fa-scroll', category: 'special', description: 'Comprehensive knowledge of dead and ancient tongues, granted to scholars.' }
];

const Step7SkillsLanguages = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const { characterData } = state;

    const [activeTab, setActiveTab] = useState('skills'); // 'skills' or 'languages'
    const [skillFilter, setSkillFilter] = useState('standard'); // 'standard' or 'advanced'
    const [expandedCategory, setExpandedCategory] = useState('Combat Mastery');
    const [inspectedSkillId, setInspectedSkillId] = useState(null);

    const [selectedSkills, setSelectedSkills] = useState(characterData.selectedSkills || []);
    const [selectedLanguages, setSelectedLanguages] = useState(characterData.selectedLanguages || []);
    const [skillRanks, setSkillRanks] = useState(characterData.skillRanks || {});

    // Calculate skill points
    const totalSkillPoints = calculateTotalSkillPoints(characterData);
    const pointsSpent = calculatePointsSpent(skillRanks);
    const availablePoints = totalSkillPoints - pointsSpent;

    // Tooltip system
    const {
        tooltipState,
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove
    } = useUnifiedTooltip();

    // Fetch previous selections
    const backgroundData = characterData.background ? getBackgroundData(characterData.background) : null;
    const raceData = characterData.race ? getRaceData(characterData.race) : null;
    const subraceData = characterData.race && characterData.subrace
        ? getSubraceData(characterData.race, characterData.subrace)
        : null;
    const pathData = characterData.path ? getPathData(characterData.path) : null;

    const racialLanguages = React.useMemo(() => subraceData?.languages || [], [subraceData]);

    const backgroundSkills = React.useMemo(() => {
        const dndSkills = backgroundData?.skillProficiencies || [];
        return dndSkills.map(dndSkill => DND_TO_CUSTOM_SKILL_MAP[dndSkill]).filter(Boolean);
    }, [backgroundData]);

    const pathSkills = React.useMemo(() => {
        const dndSkills = pathData?.skillProficiencies || [];
        return dndSkills.map(dndSkill => DND_TO_CUSTOM_SKILL_MAP[dndSkill]).filter(Boolean);
    }, [pathData]);

    const grantedSkills = React.useMemo(() =>
        [...new Set([...backgroundSkills, ...pathSkills])],
        [backgroundSkills, pathSkills]
    );

    const classSkillCount = 1; 
    const languageCount = (backgroundData?.languages || 0) + (pathData?.languages || 0);

    // Sync state to Context
    useEffect(() => {
        dispatch(wizardActionCreators.setSkills(selectedSkills));
    }, [selectedSkills, dispatch]);

    useEffect(() => {
        const allLanguages = [...new Set([...racialLanguages, ...selectedLanguages])];
        dispatch(wizardActionCreators.setLanguages(allLanguages));
    }, [selectedLanguages, racialLanguages, dispatch]);

    useEffect(() => {
        dispatch(wizardActionCreators.setSkillRanks(skillRanks));
    }, [skillRanks, dispatch]);

    // Initialize skill ranks
    useEffect(() => {
        const updatedRanks = { ...skillRanks };
        let hasChanges = false;

        grantedSkills.forEach(skillId => {
            if (!updatedRanks[skillId]) {
                updatedRanks[skillId] = 'NOVICE';
                hasChanges = true;
            }
        });

        Object.keys(SKILL_DEFINITIONS).forEach(skillId => {
            if (!updatedRanks[skillId]) {
                updatedRanks[skillId] = 'UNTRAINED';
                hasChanges = true;
            }
        });

        if (hasChanges) {
            setSkillRanks(updatedRanks);
        }
    }, [grantedSkills]);

    // Auto-inspect first skill on mount
    useEffect(() => {
        if (!inspectedSkillId) {
            const defaultId = grantedSkills[0] || selectedSkills[0] || ALL_SKILLS[0]?.id;
            if (defaultId) {
                setInspectedSkillId(defaultId);
            }
        }
    }, [grantedSkills, selectedSkills, inspectedSkillId]);

    // Handlers
    const handleSkillToggle = (skillId) => {
        if (selectedSkills.includes(skillId)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skillId));
            // Reset downgraded ranks if deselected and was untrained
            if (!isSkillGranted(skillId)) {
                setSkillRanks(prev => ({ ...prev, [skillId]: 'UNTRAINED' }));
            }
        } else {
            if (selectedSkills.length < classSkillCount) {
                setSelectedSkills([...selectedSkills, skillId]);
                // Set default rank of class skill to novice
                setSkillRanks(prev => ({
                    ...prev,
                    [skillId]: prev[skillId] === 'UNTRAINED' ? 'NOVICE' : prev[skillId]
                }));
            }
        }
    };

    const handleLanguageToggle = (languageName) => {
        if (selectedLanguages.includes(languageName)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== languageName));
        } else {
            if (selectedLanguages.length < languageCount) {
                setSelectedLanguages([...selectedLanguages, languageName]);
            }
        }
    };

    const handleSkillUpgrade = (skillId) => {
        const currentRank = skillRanks[skillId] || 'UNTRAINED';
        const nextRank = getNextRank(currentRank);
        const cost = getUpgradeCost(currentRank);

        if (nextRank && availablePoints >= cost) {
            setSkillRanks({
                ...skillRanks,
                [skillId]: nextRank
            });
        }
    };

    const handleSkillDowngrade = (skillId) => {
        const currentRank = skillRanks[skillId] || 'UNTRAINED';
        const prevRank = getPreviousRank(currentRank);
        const isGranted = grantedSkills.includes(skillId);

        // Don't allow downgrading granted skills below NOVICE
        if (prevRank && (!isGranted || prevRank !== 'UNTRAINED')) {
            setSkillRanks({
                ...skillRanks,
                [skillId]: prevRank
            });
        }
    };

    const isSkillGranted = (skillId) => grantedSkills.includes(skillId);
    const isSkillDisabled = (skillId) => {
        return isSkillGranted(skillId) || (!selectedSkills.includes(skillId) && selectedSkills.length >= classSkillCount);
    };

    const isLanguageDisabled = (languageName) => {
        return racialLanguages.includes(languageName) ||
            (!selectedLanguages.includes(languageName) && selectedLanguages.length >= languageCount);
    };

    const getSkillRankData = (skillId) => {
        const rankKey = skillRanks[skillId] || 'UNTRAINED';
        return { key: rankKey, ...SKILL_RANKS[rankKey] };
    };

    const getAvailableQuests = (skillId) => {
        const skillQuests = SKILL_QUESTS[skillId] || [];
        const currentRank = getSkillRankData(skillId);

        return skillQuests.filter(quest => {
            const rankIndex = Object.keys(SKILL_RANKS).indexOf(quest.rank);
            const currentRankIndex = Object.keys(SKILL_RANKS).indexOf(currentRank.key);
            // Show quests up to current rank index + 1
            return rankIndex <= currentRankIndex + 1;
        }).slice(0, 3);
    };

    const getCurrentRollableTable = (skillId) => {
        const skill = SKILL_DEFINITIONS[skillId];
        if (!skill) return null;

        const rank = getSkillRankData(skillId);
        if (skill.rollableTables) {
            const rankTables = skill.rollableTables[rank.key] || skill.rollableTables.UNTRAINED;
            if (typeof rankTables === 'object' && rankTables.d20) {
                return ROLLABLE_TABLES[rankTables.d20];
            } else if (typeof rankTables === 'string') {
                return ROLLABLE_TABLES[rankTables];
            }
        } else if (skill.rollableTable) {
            return ROLLABLE_TABLES[skill.rollableTable];
        }
        return null;
    };

    // Filtered skills - no longer filtered, all skills are visible
    const filteredSkills = ALL_SKILLS;

    // Grouping calculations
    const SKILLS_BY_CATEGORY = React.useMemo(() => {
        const grouped = {
            'Combat Mastery': [],
            'Exploration & Survival': [],
            'Social & Influence': [],
            'Arcane Studies': []
        };
        filteredSkills.forEach(skill => {
            const cat = skill.category || 'Arcane Studies';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(skill);
        });
        return grouped;
    }, [filteredSkills]);

    const LANGUAGES_BY_CATEGORY = React.useMemo(() => {
        const grouped = {
            standard: { name: 'Standard Languages', icon: 'fa-globe', list: [] },
            exotic: { name: 'Exotic & Planar Languages', icon: 'fa-sun', list: [] },
            racial: { name: 'Ancestral & Racial Languages', icon: 'fa-dna', list: [] },
            elemental: { name: 'Elemental Tongues', icon: 'fa-wind', list: [] },
            special: { name: 'Specialized & Coded Jargon', icon: 'fa-mask', list: [] }
        };
        COMMON_LANGUAGES.forEach(lang => {
            const cat = lang.category || 'standard';
            if (grouped[cat]) {
                grouped[cat].list.push(lang);
            }
        });
        return grouped;
    }, []);

    // Helper to get outcome quality classes
    const getOutcomeClass = (rollRange) => {
        const avg = (rollRange[0] + rollRange[1]) / 2;
        if (avg >= 18) return 'critical-success';
        if (avg >= 11) return 'success';
        if (avg >= 6) return 'partial';
        return 'failure';
    };

    // Setup active skill details
    const activeSkill = inspectedSkillId ? SKILL_DEFINITIONS[inspectedSkillId] : null;
    const activeSkillQuests = inspectedSkillId ? getAvailableQuests(inspectedSkillId) : [];
    const activeSkillTable = inspectedSkillId ? getCurrentRollableTable(inspectedSkillId) : null;
    const activeSkillRank = inspectedSkillId ? getSkillRankData(inspectedSkillId) : null;

    const currentRankKey = inspectedSkillId ? (skillRanks[inspectedSkillId] || 'UNTRAINED') : 'UNTRAINED';
    const isInspectedGranted = inspectedSkillId ? isSkillGranted(inspectedSkillId) : false;
    const isInspectedSelected = inspectedSkillId ? selectedSkills.includes(inspectedSkillId) : false;

    const nextRank = getNextRank(currentRankKey);
    const prevRank = getPreviousRank(currentRankKey);
    const upgradeCost = getUpgradeCost(currentRankKey);
    const downgradeRefund = getDowngradeRefund(currentRankKey);
    const canUpgrade = nextRank && (availablePoints >= upgradeCost);
    const canDowngrade = prevRank && currentRankKey !== 'UNTRAINED' && (!isInspectedGranted || prevRank !== 'UNTRAINED');

    return (
        <div className="wizard-step-content">
            <div className="skills-languages-layout">
                
                {/* Left Selection Column */}
                <div className="selection-pane-left">
                    <div className="pane-tabs-navigation">
                        <button
                            type="button"
                            className={`pane-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                            onClick={() => setActiveTab('skills')}
                        >
                            <i className="fas fa-cogs"></i> Skills
                            <span className="badge-count">{selectedSkills.length} / {classSkillCount}</span>
                        </button>
                        <button
                            type="button"
                            className={`pane-tab-btn ${activeTab === 'languages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('languages')}
                        >
                            <i className="fas fa-language"></i> Languages
                            {languageCount > 0 && <span className="badge-count">{selectedLanguages.length} / {languageCount}</span>}
                        </button>
                    </div>

                    <div className="pane-scrollable-content">
                        {activeTab === 'skills' ? (
                            <>
                                {/* Available Points Banner */}
                                <div className="step-summary-banner" 
                                     onMouseEnter={handleMouseEnter(`Base points: 10 + Intelligence Modifier Bonus + Race/Background bonuses. Granted skills start at Novice level for free.`, 'Skill Points Breakdown', 'fas fa-info-circle')}
                                     onMouseLeave={handleMouseLeave}
                                     onMouseMove={handleMouseMove}>
                                    <div className="summary-banner-points">
                                        <i className="fas fa-coins"></i> Training Points Available: 
                                        <span className="points-pill">{availablePoints} / {totalSkillPoints}</span>
                                    </div>
                                    <div className="summary-banner-choices">
                                        Class Specializations: <span>{selectedSkills.length} / {classSkillCount}</span>
                                    </div>
                                </div>

                                {/* Skill Category Lists (Accordion) */}
                                {Object.entries(SKILLS_BY_CATEGORY).map(([categoryName, skills]) => {
                                    if (skills.length === 0) return null;

                                    const categorySlug = categoryName.toLowerCase().split(' ')[0];
                                    const categoryIcons = {
                                        combat: 'fa-shield-halved',
                                        exploration: 'fa-compass',
                                        social: 'fa-comments',
                                        arcane: 'fa-wand-magic-sparkles'
                                    };
                                    const isExpanded = expandedCategory === categoryName;

                                    return (
                                        <div key={categoryName} className={`skill-category-group ${categorySlug} ${isExpanded ? 'expanded' : ''}`}>
                                            <div
                                                className="skill-category-header"
                                                onClick={() => setExpandedCategory(isExpanded ? null : categoryName)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className={`fas ${categoryIcons[categorySlug] || 'fa-star'}`}></i>
                                                <span>{categoryName}</span>
                                                <span className="category-skill-count">{skills.length} skills</span>
                                                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} category-chevron`}></i>
                                            </div>
                                            {isExpanded && (
                                                <div className="category-skills-grid">
                                                    {skills.map(skill => {
                                                        const isGranted = isSkillGranted(skill.id);
                                                        const isSelected = selectedSkills.includes(skill.id);
                                                        const isDisabled = isSkillDisabled(skill.id);
                                                        const isInspected = inspectedSkillId === skill.id;
                                                        const rankData = getSkillRankData(skill.id);
                                                        const isProf = isSkillProficient(skill.id, skillRanks);

                                                        return (
                                                            <div
                                                                key={skill.id}
                                                                className={`premium-skill-card ${isInspected ? 'active-inspected' : ''} ${isGranted ? 'granted-skill' : ''} ${isSelected ? 'selected-skill' : ''} ${isDisabled && !isSelected && !isGranted ? 'disabled' : ''}`}
                                                                onClick={(e) => {
                                                                    setInspectedSkillId(skill.id);
                                                                    const isCheckIconClick = e.target.closest('.selection-indicator');
                                                                    if (isCheckIconClick || isInspected) {
                                                                        if (!isGranted && !isDisabled) {
                                                                            handleSkillToggle(skill.id);
                                                                        }
                                                                    }
                                                                }}
                                                                onMouseEnter={handleMouseEnter(skill.description, skill.name)}
                                                                onMouseLeave={handleMouseLeave}
                                                                onMouseMove={handleMouseMove}
                                                            >
                                                                <div className="skill-card-icon-container">
                                                                    <img src={getIconUrl(skill.icon, 'abilities')} alt={skill.name} className="skill-card-icon" />
                                                                </div>
                                                                <div className="skill-card-info">
                                                                    <span className="skill-card-name">{skill.name}</span>
                                                                    <span className="skill-card-rank" style={{ color: rankData.color }}>
                                                                        {rankData.name}
                                                                    </span>
                                                                </div>
                                                                {isProf && <span className="proficient-tag" title="Proficient">Proficient</span>}
                                                                <div className="selection-indicator">
                                                                    {(isSelected || isGranted) ? <i className="fas fa-check"></i> : null}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            /* Languages Tab */
                            <div className="languages-tab-container">
                                {/* Racial Languages (Granted automatically) */}
                                {racialLanguages.length > 0 && (
                                    <div className="language-pane-group">
                                        <h4 className="language-pane-header">
                                            <i className="fas fa-dna"></i> Native Ancestral Tongues
                                        </h4>
                                        <div className="languages-masonry-grid">
                                            {racialLanguages.map(langName => {
                                                const langData = COMMON_LANGUAGES.find(l => l.name === langName);
                                                return (
                                                    <div
                                                        key={langName}
                                                        className="premium-language-card granted"
                                                        onMouseEnter={handleMouseEnter(langData?.description || 'Your character knows this native racial tongue.', langName, `fas ${langData?.icon || 'fa-language'}`)}
                                                        onMouseLeave={handleMouseLeave}
                                                        onMouseMove={handleMouseMove}
                                                    >
                                                        <div className="lang-icon-circle">
                                                            <i className={`fas ${langData?.icon || 'fa-language'}`}></i>
                                                        </div>
                                                        <span className="lang-name">{langName}</span>
                                                        <span className="lang-status-badge">Racial</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Selectable Languages by Category */}
                                {Object.entries(LANGUAGES_BY_CATEGORY).map(([catKey, catData]) => {
                                    if (catData.list.length === 0) return null;

                                    return (
                                        <div key={catKey} className="language-pane-group">
                                            <h4 className="language-pane-header">
                                                <i className={`fas ${catData.icon}`}></i> {catData.name}
                                            </h4>
                                            <div className="languages-masonry-grid">
                                                {catData.list.map(language => {
                                                    const isSelected = selectedLanguages.includes(language.name);
                                                    const isRacial = racialLanguages.includes(language.name);
                                                    const isDisabled = isLanguageDisabled(language.name);

                                                    return (
                                                        <div
                                                            key={language.name}
                                                            className={`premium-language-card ${isSelected ? 'selected' : ''} ${isRacial ? 'granted' : ''} ${isDisabled && !isSelected && !isRacial ? 'disabled' : ''}`}
                                                            onClick={() => !isRacial && !isDisabled && handleLanguageToggle(language.name)}
                                                            onMouseEnter={handleMouseEnter(language.description, language.name, `fas ${language.icon}`)}
                                                            onMouseLeave={handleMouseLeave}
                                                            onMouseMove={handleMouseMove}
                                                        >
                                                            <div className="lang-icon-circle">
                                                                <i className={`fas ${language.icon}`}></i>
                                                            </div>
                                                            <span className="lang-name">{language.name}</span>
                                                            {isSelected && <span className="lang-status-badge">Learned</span>}
                                                            {isRacial && <span className="lang-status-badge">Racial</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Interactive Inspector Panel */}
                <div className="inspector-pane-right">
                    {activeSkill ? (
                        <div className="skill-grimoire-inspector">
                            {/* Grimoire Header */}
                            <div className="grimoire-header">
                                <div className="grimoire-icon-wrapper">
                                    <img src={getIconUrl(activeSkill.icon, 'abilities')} alt={activeSkill.name} className="grimoire-large-icon" />
                                </div>
                                <div className="grimoire-details">
                                    <h3>
                                        {activeSkill.name}
                                        <span className={`grimoire-category-badge ${activeSkill.category.toLowerCase().split(' ')[0]}`}>
                                            {activeSkill.category}
                                        </span>
                                    </h3>
                                    <div className="grimoire-attributes">
                                        {activeSkill.primaryStat && (
                                            <span className="grimoire-attribute-pill" title={`Primary Stat: ${activeSkill.primaryStat}`}>
                                                <i className="fas fa-dumbbell"></i> {activeSkill.primaryStat}
                                                {characterData.finalStats?.[activeSkill.primaryStat] && ` (${characterData.finalStats[activeSkill.primaryStat]})`}
                                            </span>
                                        )}
                                        {activeSkill.secondaryStat && (
                                            <span className="grimoire-attribute-pill" title={`Secondary Stat: ${activeSkill.secondaryStat}`}>
                                                <i className="fas fa-shield"></i> {activeSkill.secondaryStat}
                                                {characterData.finalStats?.[activeSkill.secondaryStat] && ` (${characterData.finalStats[activeSkill.secondaryStat]})`}
                                            </span>
                                        )}
                                        {isInspectedGranted && (
                                            <span className="grimoire-attribute-pill" style={{ color: '#4a7c59', background: 'rgba(74, 124, 89, 0.12)' }}>
                                                <i className="fas fa-gift"></i> Granted by Heritage
                                            </span>
                                        )}
                                        {isInspectedSelected && (
                                            <span className="grimoire-attribute-pill" style={{ color: '#d4af37', background: 'rgba(212, 175, 55, 0.12)' }}>
                                                <i className="fas fa-check-circle"></i> Class Specialization
                                            </span>
                                        )}
                                    </div>
                                    <p className="grimoire-description">{activeSkill.description}</p>
                                </div>
                            </div>

                            {/* Training Controls */}
                            <div className="grimoire-training-section">
                                <h4 className="grimoire-training-title">
                                    <span>{skillFilter === 'standard' ? 'Skill Die' : 'Expertise Level'}</span>
                                    <span className="current-rank-label" style={{ color: activeSkillRank.color }}>
                                        {skillFilter === 'standard' ? `${mapRankToDie(currentRankKey).toUpperCase()} (${activeSkillRank.name})` : activeSkillRank.name} (Bonus: +{activeSkillRank.statBonus})
                                    </span>
                                </h4>

                                <div className="training-controls-row">
                                    <button
                                        type="button"
                                        className="training-btn downgrade"
                                        disabled={!canDowngrade}
                                        onClick={() => handleSkillDowngrade(inspectedSkillId)}
                                        title={canDowngrade ? `Downgrade rank (refund ${downgradeRefund} points)` : 'Cannot downgrade rank'}
                                    >
                                        <i className="fas fa-minus"></i>
                                    </button>

                                    <div className="grimoire-pip-bar">
                                        <div className="grimoire-pips-container">
                                            {Object.keys(SKILL_RANKS).map((rank, idx) => {
                                                const isActive = Object.keys(SKILL_RANKS).indexOf(currentRankKey) >= idx;
                                                const rColor = SKILL_RANKS[rank].color;
                                                return (
                                                    <div
                                                        key={rank}
                                                        className={`grimoire-pip ${isActive ? 'active' : ''}`}
                                                        style={{ '--pip-color': rColor }}
                                                        title={skillFilter === 'standard' ? `${mapRankToDie(rank).toUpperCase()} (${SKILL_RANKS[rank].name})` : SKILL_RANKS[rank].name}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="training-btn upgrade"
                                        disabled={!canUpgrade}
                                        onClick={() => handleSkillUpgrade(inspectedSkillId)}
                                        title={canUpgrade ? `Upgrade rank (costs ${upgradeCost} points)` : nextRank ? 'Not enough points' : 'Maximum rank reached'}
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>

                                <div className="grimoire-training-info">
                                    {nextRank ? (
                                        <span className="cost-tag">
                                            Next Rank: <strong>{skillFilter === 'standard' ? mapRankToDie(nextRank).toUpperCase() : SKILL_RANKS[nextRank].name}</strong> (Upgrade Cost: {upgradeCost} pts)
                                        </span>
                                    ) : (
                                        <span className="max-tag">
                                            <i className="fas fa-crown"></i> Master Expertise Reached
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Starting Quests */}
                            {skillFilter !== 'standard' && (
                                <div className="grimoire-quests-section">
                                    <h4 className="grimoire-section-title">
                                        <i className="fas fa-scroll"></i> Active & Unlocking Quests
                                    </h4>
                                    {activeSkillQuests.length > 0 ? (
                                        <div className="grimoire-quests-list">
                                            {activeSkillQuests.map(quest => (
                                                <div key={quest.id} className="grimoire-quest-card">
                                                    <img src={getIconUrl(quest.icon, 'abilities')} alt={quest.name} className="grimoire-quest-icon" />
                                                    <div className="grimoire-quest-details">
                                                        <strong>{quest.name}</strong>
                                                        <p>{quest.description}</p>
                                                        <span className="quest-badge" style={{ color: SKILL_RANKS[quest.rank]?.color }}>
                                                            {SKILL_RANKS[quest.rank]?.name} Quest
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-quests-message">
                                            <i className="fas fa-circle-info"></i>
                                            <p>No quests found for this rank. Continue training to unlock milestones!</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Outcomes Roll Table */}
                            {skillFilter !== 'standard' && (
                                <div className="grimoire-outcomes-section">
                                    <h4 className="grimoire-section-title">
                                        <i className="fas fa-dice-d20"></i> Roll Outcomes Preview ({activeSkillRank.name})
                                    </h4>
                                    {activeSkillTable ? (
                                        <div className="grimoire-outcomes-table">
                                            <div className="outcomes-table-header">
                                                <span>Roll Range</span>
                                                <span>Outcome Result</span>
                                            </div>
                                            {activeSkillTable.table.slice(0, 8).map((entry, index) => {
                                                const outcomeClass = getOutcomeClass(entry.roll);
                                                return (
                                                    <div key={index} className={`outcomes-table-row ${outcomeClass}`}>
                                                        <span className="roll-value">
                                                            {entry.roll[0] === entry.roll[1] ? entry.roll[0] : `${entry.roll[0]}-${entry.roll[1]}`}
                                                        </span>
                                                        <span className="outcome-result">{entry.result}</span>
                                                    </div>
                                                );
                                            })}
                                            {activeSkillTable.table.length > 8 && (
                                                <div className="outcomes-table-row" style={{ fontStyle: 'italic', color: '#8b7355', display: 'block', textAlign: 'center' }}>
                                                    ... and {activeSkillTable.table.length - 8} more outcomes
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="no-quests-message">
                                            <i className="fas fa-triangle-exclamation"></i>
                                            <p>Roll table is currently being forged. Standard d20 rules apply.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Rules Reference Section */}
                            <div className="grimoire-rules-section">
                                <div className="grimoire-rules-toggle">
                                    <button
                                        type="button"
                                        className={`rules-toggle-btn ${skillFilter === 'standard' ? 'active' : ''}`}
                                        onClick={() => setSkillFilter('standard')}
                                    >
                                        <i className="fas fa-scroll"></i> Standard Rules
                                    </button>
                                    <button
                                        type="button"
                                        className={`rules-toggle-btn ${skillFilter === 'advanced' ? 'active' : ''}`}
                                        onClick={() => setSkillFilter('advanced')}
                                    >
                                        <i className="fas fa-wand-magic-sparkles"></i> Advanced Rules
                                    </button>
                                </div>

                                {skillFilter === 'standard' ? (
                                    <div className="rules-content-block">
                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-magic"></i> The Core Idea</h5>
                                            <p>Every skill is represented by a single die size, written directly on your character sheet: <strong>4</strong> for a d4, <strong>6</strong> for a d6, <strong>8</strong> for a d8, and so on.</p>
                                            <ul>
                                                <li><strong>d4 Baseline</strong>: All characters start with a d4 (written as "4") in all skills. Baseline attempt is always possible.</li>
                                                <li><strong>Organic Upgrades</strong>: Successful learning or extraordinary actions trigger dynamic upgrades awarded by the GM.</li>
                                                <li><strong>Conversation Driven</strong>: Set your die size manually under your sheet as your character grows.</li>
                                            </ul>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-crosshairs"></i> Difficulty Classes (DCs)</h5>
                                            <p>Instead of assigned difficulty dice, roll against fixed target numbers:</p>
                                            <div className="dc-ref-grid">
                                                <div className="dc-ref-row"><span>DC 2</span><strong>Trivial</strong><span>Climbing a ladder, lighting campfire</span></div>
                                                <div className="dc-ref-row"><span>DC 4</span><strong>Easy</strong><span>Picking a rusty lock, tracking in mud</span></div>
                                                <div className="dc-ref-row"><span>DC 6</span><strong>Moderate</strong><span>Climbing a knotted rope, deceiving guards</span></div>
                                                <div className="dc-ref-row"><span>DC 8</span><strong>Challenging</strong><span>Scaling wall handholds, disarming traps</span></div>
                                                <div className="dc-ref-row"><span>DC 10</span><strong>Hard</strong><span>Climbing steep mountains, field surgery</span></div>
                                                <div className="dc-ref-row"><span>DC 12+</span><strong>Legendary</strong><span>Tasks bordering on the impossible</span></div>
                                            </div>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-bolt"></i> Exploding Dice</h5>
                                            <p>Rolling the maximum value is <strong>not</strong> an automatic critical success. Instead, the die <strong>explodes</strong> — roll it again and add the results together! Multiple explosions can stack infinitely, making even legendary DCs reachable by standard dice.</p>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-sync-alt"></i> Switching Systems</h5>
                                            <p>Switch between the full Mythrill Trial Ladder and the Skill System at any time under your character sheet. Rank maps directly to die sizes (Trained = d8, Expert = d20).</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rules-content-block">
                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-cogs"></i> How Skills Work</h5>
                                            <p>A Mythrill veteran does not swing blindly and hope. <strong>Skills</strong> represent accumulated mastery — trained capabilities that separate a seasoned adventurer from a desperate farmhand.</p>
                                            <ul>
                                                <li>Each skill is tied to a <strong>primary and secondary attribute</strong>.</li>
                                                <li>The GM assigns a <strong>Difficulty Die</strong> — from a d4 for trivial tasks to a d20 for near-impossible ones.</li>
                                                <li>If your primary or secondary attribute modifier reaches <strong>+5 or higher</strong>, your mastery steps the difficulty die down by one size.</li>
                                            </ul>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-layer-group"></i> Skill Ranks &amp; Progression</h5>
                                            <p>Skills advance through seven ranks:</p>
                                            <div className="dc-ref-grid">
                                                <div className="dc-ref-row"><span style={{color:'#6b6b6b'}}>Untrained</span><span>d4</span><span>Baseline — no bonus</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#8b7355'}}>Novice</span><span>d6</span><span>+1 to checks, 1 quest</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#4a7c59'}}>Trained</span><span>d8</span><span>+2 to checks, 3 quests</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#5d8a6b'}}>Apprentice</span><span>d10</span><span>+3 to checks, 6 quests</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#2563eb'}}>Adept</span><span>d12</span><span>+4 to checks, 9 quests</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#7a3b2e'}}>Expert</span><span>d20</span><span>+5 to checks, 11 quests</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#9d4edd'}}>Master</span><span>d20</span><span>+6 to checks, 12 quests</span></div>
                                            </div>
                                            <p style={{marginTop:'8px', fontSize:'0.85rem'}}><strong>Skill Quests</strong> are narrative milestones that unlock as you use abilities in the world. Completing them advances your rank and opens new proficient ability options.</p>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-dice-d20"></i> Critical Success &amp; Failure</h5>
                                            <p>Rolling the <strong>maximum value</strong> on your difficulty die is a <strong>Critical Success</strong> — the task is accomplished beyond expectation, often with a tangible bonus or narrative windfall.</p>
                                            <p>Rolling a <strong>1</strong> is always a <strong>Critical Failure</strong> regardless of rank — complications arise, and the GM determines how badly the moment turns.</p>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-sync-alt"></i> Switching Systems</h5>
                                            <p>Switch between the full Mythrill Trial Ladder and the Skill System at any time under your character sheet. Rank maps directly to die sizes (Trained = d8, Expert = d20).</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="skill-grimoire-inspector">
                            <div className="grimoire-empty-state">
                                <i className="fas fa-compass empty-icon"></i>
                                <h3>Inspect a Skill</h3>
                                <p>Select any skill from the left list to inspect its attributes, quests, and roll outcome previews.</p>
                            </div>

                            {/* Rules Reference Section (shown even when no skill selected) */}
                            <div className="grimoire-rules-section">
                                <div className="grimoire-rules-toggle">
                                    <button
                                        type="button"
                                        className={`rules-toggle-btn ${skillFilter === 'standard' ? 'active' : ''}`}
                                        onClick={() => setSkillFilter('standard')}
                                    >
                                        <i className="fas fa-scroll"></i> Standard Rules
                                    </button>
                                    <button
                                        type="button"
                                        className={`rules-toggle-btn ${skillFilter === 'advanced' ? 'active' : ''}`}
                                        onClick={() => setSkillFilter('advanced')}
                                    >
                                        <i className="fas fa-wand-magic-sparkles"></i> Advanced Rules
                                    </button>
                                </div>

                                {skillFilter === 'standard' ? (
                                    <div className="rules-content-block">
                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-magic"></i> The Core Idea</h5>
                                            <p>Every skill is represented by a single die size, written directly on your character sheet: <strong>4</strong> for a d4, <strong>6</strong> for a d6, <strong>8</strong> for a d8, and so on.</p>
                                            <ul>
                                                <li><strong>d4 Baseline</strong>: All characters start with a d4 (written as "4") in all skills. Baseline attempt is always possible.</li>
                                                <li><strong>Organic Upgrades</strong>: Successful learning or extraordinary actions trigger dynamic upgrades awarded by the GM.</li>
                                                <li><strong>Conversation Driven</strong>: Set your die size manually under your sheet as your character grows.</li>
                                            </ul>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-crosshairs"></i> Difficulty Classes (DCs)</h5>
                                            <p>Instead of assigned difficulty dice, roll against fixed target numbers:</p>
                                            <div className="dc-ref-grid">
                                                <div className="dc-ref-row"><span>DC 2</span><strong>Trivial</strong><span>Climbing a ladder, lighting campfire</span></div>
                                                <div className="dc-ref-row"><span>DC 4</span><strong>Easy</strong><span>Picking a rusty lock, tracking in mud</span></div>
                                                <div className="dc-ref-row"><span>DC 6</span><strong>Moderate</strong><span>Climbing a knotted rope, deceiving guards</span></div>
                                                <div className="dc-ref-row"><span>DC 8</span><strong>Challenging</strong><span>Scaling wall handholds, disarming traps</span></div>
                                                <div className="dc-ref-row"><span>DC 10</span><strong>Hard</strong><span>Climbing steep mountains, field surgery</span></div>
                                                <div className="dc-ref-row"><span>DC 12+</span><strong>Legendary</strong><span>Tasks bordering on the impossible</span></div>
                                            </div>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-bolt"></i> Exploding Dice</h5>
                                            <p>Rolling the maximum value is <strong>not</strong> an automatic critical success. Instead, the die <strong>explodes</strong> — roll it again and add the results together! Multiple explosions can stack infinitely, making even legendary DCs reachable by standard dice.</p>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-sync-alt"></i> Switching Systems</h5>
                                            <p>Switch between the full Mythrill Trial Ladder and the Skill System at any time under your character sheet. Rank maps directly to die sizes (Trained = d8, Expert = d20).</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rules-content-block">
                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-cogs"></i> How Skills Work</h5>
                                            <p>A Mythrill veteran does not swing blindly and hope. <strong>Skills</strong> represent accumulated mastery — trained capabilities that separate a seasoned adventurer from a desperate farmhand.</p>
                                            <ul>
                                                <li>Each skill is tied to a <strong>primary and secondary attribute</strong>.</li>
                                                <li>The GM assigns a <strong>Difficulty Die</strong> — from a d4 for trivial tasks to a d20 for near-impossible ones.</li>
                                                <li>If your primary or secondary attribute modifier reaches <strong>+5 or higher</strong>, your mastery steps the difficulty die down by one size.</li>
                                            </ul>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-layer-group"></i> Skill Ranks &amp; Progression</h5>
                                            <p>Skills advance through seven ranks:</p>
                                            <div className="dc-ref-grid">
                                                <div className="dc-ref-row"><span style={{color:'#6b6b6b'}}>Untrained</span><span>d4</span><span>Baseline — no bonus</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#8b7355'}}>Novice</span><span>d6</span><span>+1 to checks, 1 quest</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#4a7c59'}}>Trained</span><span>d8</span><span>+2 to checks, 3 quests</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#5d8a6b'}}>Apprentice</span><span>d10</span><span>+3 to checks, 6 quests</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#2563eb'}}>Adept</span><span>d12</span><span>+4 to checks, 9 quests</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#7a3b2e'}}>Expert</span><span>d20</span><span>+5 to checks, 11 quests</span></div>
                                                <div className="dc-ref-row"><span style={{color:'#9d4edd'}}>Master</span><span>d20</span><span>+6 to checks, 12 quests</span></div>
                                            </div>
                                            <p style={{marginTop:'8px', fontSize:'0.85rem'}}><strong>Skill Quests</strong> are narrative milestones that unlock as you use abilities in the world. Completing them advances your rank and opens new proficient ability options.</p>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-dice-d20"></i> Critical Success &amp; Failure</h5>
                                            <p>Rolling the <strong>maximum value</strong> on your difficulty die is a <strong>Critical Success</strong> — the task is accomplished beyond expectation, often with a tangible bonus or narrative windfall.</p>
                                            <p>Rolling a <strong>1</strong> is always a <strong>Critical Failure</strong> regardless of rank — complications arise, and the GM determines how badly the moment turns.</p>
                                        </div>

                                        <div className="rules-subsection">
                                            <h5><i className="fas fa-sync-alt"></i> Switching Systems</h5>
                                            <p>Switch between the full Mythrill Trial Ladder and the Skill System at any time under your character sheet. Rank maps directly to die sizes (Trained = d8, Expert = d20).</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Unified Tooltip */}
            <UnifiedTooltip
                content={tooltipState.content}
                title={tooltipState.title}
                icon={tooltipState.icon}
                isVisible={tooltipState.isVisible}
                position={tooltipState.position}
                variant={tooltipState.variant}
                delay={200}
            />
        </div>
    );
};

export default Step7SkillsLanguages;
