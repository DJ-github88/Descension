/**
 * Step 2: Skills & Languages (Step 7 Internally)
 *
 * Choose skills and languages for your character in a split-pane, interactive layout.
 */

import React, { useState, useEffect } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getBackgroundData } from '../../../data/backgroundData';
import { getRacialLanguages } from '../../../data/raceData';
import { LANGUAGES, normalizeLanguageName } from '../../../data/languages';
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
import { WEAPON_TYPE_META } from '../../../constants/weaponTypeMeta';
import {
    WEAPON_MASTERY_SKILL_ID,
    getLegacySharedWeaponRank,
    getStoredWeaponRank,
    trainedWeaponTypes,
    withWeaponRank
} from '../../../utils/weaponProficiency';
import { pointBuyText } from '../../../constants/skillProgressionCopy';
import SkillRulesReference from '../components/SkillRulesReference';

import '../styles/Step7SkillsLanguages.css';
import '../../../styles/skillProficiency.css';

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

// All available languages (imported from shared data module)
const COMMON_LANGUAGES = LANGUAGES;

const Step7SkillsLanguages = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const { characterData } = state;

    const [activeTab, setActiveTab] = useState('skills'); // 'skills' or 'languages'
    const [skillFilter, setSkillFilter] = useState('standard'); // 'standard' or 'advanced'
    const [expandedCategory, setExpandedCategory] = useState('Combat Mastery');
    const [inspectedSkillId, setInspectedSkillId] = useState(null);
    const [mobilePanel, setMobilePanel] = useState('selections');

    const [selectedSkills, setSelectedSkills] = useState(characterData.selectedSkills || []);
    const [selectedLanguages, setSelectedLanguages] = useState(() =>
        [...new Set((characterData.selectedLanguages || []).map(normalizeLanguageName))]
    );
    const [skillRanks, setSkillRanks] = useState(characterData.skillRanks || {});

    // P11: Weapon Mastery is ranked and bought per weapon type.
    const [wizardWeaponType, setWizardWeaponType] = useState(() =>
        trainedWeaponTypes(characterData.skillRanks || {})[0]?.weaponType || 'sword');
    const isEditingCharacter = !!state.originalCalling;

    // Calculate skill points (existing configured budget and costs)
    const totalSkillPoints = calculateTotalSkillPoints(characterData);
    const pointsSpent = calculatePointsSpent(skillRanks);
    const availablePoints = totalSkillPoints - pointsSpent;
    const overBudgetBy = Math.max(0, -availablePoints);
    const novicePrice = getUpgradeCost('UNTRAINED');

    // Rank of a skill as bought here; Weapon Mastery reads the picked weapon type.
    const rankKeyFor = (skillId, ranks = skillRanks) => (skillId === WEAPON_MASTERY_SKILL_ID
        ? getStoredWeaponRank(ranks, wizardWeaponType) || 'UNTRAINED'
        : ranks[skillId] || 'UNTRAINED');
    const withRank = (ranks, skillId, rankKey) => (skillId === WEAPON_MASTERY_SKILL_ID
        ? withWeaponRank(ranks, wizardWeaponType, rankKey)
        : { ...ranks, [skillId]: rankKey });
    // Editing an existing character: the starting budget is informational only.
    const canAffordSelection = (skillId) => isEditingCharacter || rankKeyFor(skillId) !== 'UNTRAINED' || availablePoints >= novicePrice;
    const legacyWeaponRank = getLegacySharedWeaponRank(skillRanks);
    const weaponSummary = () => {
        const trained = trainedWeaponTypes(skillRanks);
        if (!trained.length) return SKILL_RANKS.UNTRAINED.name;
        if (trained.length === 1) return `${WEAPON_TYPE_META[trained[0].weaponType].label}: ${SKILL_RANKS[trained[0].rank].name}`;
        return `${trained.length} weapon types trained`;
    };

    // Tooltip system
    const {
        tooltipState,
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove
    } = useUnifiedTooltip();

    // Fetch previous selections
    const backgroundData = characterData.background ? getBackgroundData(characterData.background) : null;
    const racialLanguages = React.useMemo(
        () => getRacialLanguages(characterData.race, characterData.subrace),
        [characterData.race, characterData.subrace]
    );

    const backgroundSkills = React.useMemo(() => {
        const dndSkills = backgroundData?.skillProficiencies || [];
        return dndSkills.map(dndSkill => DND_TO_CUSTOM_SKILL_MAP[dndSkill]).filter(Boolean);
    }, [backgroundData]);

    const grantedSkills = React.useMemo(() =>
        [...new Set([...backgroundSkills])],
        [backgroundSkills]
    );

    const classSkillCount = 1; 
    const languageCount = (backgroundData?.languages || 0);

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
            // P11: no shared Weapon Mastery entry; weapon ranks are per weapon type.
            if (skillId === WEAPON_MASTERY_SKILL_ID) return;
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
            // Reset downgraded ranks if deselected and was untrained.
            // P11: Weapon Mastery ranks are per weapon and stay; lower them individually.
            if (!isSkillGranted(skillId) && skillId !== WEAPON_MASTERY_SKILL_ID) {
                setSkillRanks(prev => ({ ...prev, [skillId]: 'UNTRAINED' }));
            }
        } else {
            // P11: the class skill starts at Novice, paid from the same points.
            if (selectedSkills.length < classSkillCount && canAffordSelection(skillId)) {
                setSelectedSkills([...selectedSkills, skillId]);
                // Set default rank of class skill to novice
                setSkillRanks(prev => (rankKeyFor(skillId, prev) === 'UNTRAINED'
                    ? withRank(prev, skillId, 'NOVICE') || prev
                    : prev));
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
        const currentRank = rankKeyFor(skillId);
        const nextRank = getNextRank(currentRank);
        const cost = getUpgradeCost(currentRank);

        if (nextRank && availablePoints >= cost) {
            const next = withRank(skillRanks, skillId, nextRank);
            if (next) setSkillRanks(next);
        }
    };

    const handleSkillDowngrade = (skillId) => {
        const currentRank = rankKeyFor(skillId);
        const prevRank = getPreviousRank(currentRank);
        const isGranted = grantedSkills.includes(skillId);

        // Don't allow downgrading granted skills below NOVICE
        if (prevRank && (!isGranted || prevRank !== 'UNTRAINED')) {
            const next = withRank(skillRanks, skillId, prevRank);
            if (next) setSkillRanks(next);
        }
    };

    const isSkillGranted = (skillId) => grantedSkills.includes(skillId);
    const isSkillDisabled = (skillId) => {
        return isSkillGranted(skillId) || (!selectedSkills.includes(skillId)
            && (selectedSkills.length >= classSkillCount || !canAffordSelection(skillId)));
    };
    const selectionBlockedByBudget = (skillId) => !isSkillGranted(skillId) && !selectedSkills.includes(skillId)
        && selectedSkills.length < classSkillCount && !canAffordSelection(skillId);

    const isLanguageDisabled = (languageName) => {
        return racialLanguages.includes(languageName) ||
            (!selectedLanguages.includes(languageName) && selectedLanguages.length >= languageCount);
    };

    const getSkillRankData = (skillId) => {
        const rankKey = rankKeyFor(skillId);
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
            standard: { name: 'Trade Tongues', icon: 'fa-globe', list: [] },
            exotic: { name: 'Exotic & Planar Languages', icon: 'fa-sun', list: [] },
            racial: { name: 'Ancestral & Racial Languages', icon: 'fa-dna', list: [] },
            elemental: { name: 'Elemental Tongues', icon: 'fa-wind', list: [] },
            special: { name: 'Specialized & Coded Jargon', icon: 'fa-mask', list: [] }
        };
        COMMON_LANGUAGES.forEach(lang => {
            if (lang.pickable === false) return;
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

    const currentRankKey = inspectedSkillId ? rankKeyFor(inspectedSkillId) : 'UNTRAINED';
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
            <div className="skills-languages-layout" data-mobile-panel={mobilePanel}>

                {/* Mobile Section Tabs */}
                <div className="mobile-section-tabs-bar">
                    <button
                        type="button"
                        className={`mobile-section-tab ${mobilePanel === 'selections' ? 'active' : ''}`}
                        onClick={() => setMobilePanel('selections')}
                    >
                        <i className="fas fa-cogs"></i> {activeTab === 'skills' ? 'Skills' : 'Languages'}
                    </button>
                    <button
                        type="button"
                        className={`mobile-section-tab ${mobilePanel === 'details' ? 'active' : ''}`}
                        onClick={() => setMobilePanel('details')}
                        disabled={!activeSkill && activeTab === 'skills'}
                    >
                        <i className="fas fa-book-open"></i> Details
                    </button>
                </div>

                {/* Left Selection Column */}
                <div className="selection-pane-left" data-mobile-panel="selections">
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
                                     onMouseEnter={handleMouseEnter(pointBuyText(), 'Skill Points Breakdown', 'fas fa-info-circle')}
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
                                {overBudgetBy > 0 && (isEditingCharacter ? (
                                    <p className="skill-budget-note" role="note" data-testid="skill-budget-note">
                                        This character's ranks total {pointsSpent} points, above the {totalSkillPoints}-point starting budget. That is expected after training and story; nothing is changed or blocked.
                                    </p>
                                ) : (
                                    <p className="skill-budget-warning" role="alert" data-testid="skill-budget-warning">
                                        Over budget by {overBudgetBy} point{overBudgetBy === 1 ? '' : 's'}. Lower a rank to finish this character.
                                    </p>
                                ))}

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
                                                        const isWeaponSkill = skill.id === WEAPON_MASTERY_SKILL_ID;
                                                        const isProf = isWeaponSkill ? trainedWeaponTypes(skillRanks).length > 0 : isSkillProficient(skill.id, skillRanks);
                                                        const budgetBlocked = selectionBlockedByBudget(skill.id);

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
                                                                        {isWeaponSkill ? weaponSummary() : rankData.name}
                                                                    </span>
                                                                    {budgetBlocked && (
                                                                        <span className="skill-card-reason" data-testid={`budget-reason-${skill.id}`}>
                                                                            Needs {novicePrice} point{novicePrice === 1 ? '' : 's'} to select
                                                                        </span>
                                                                    )}
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
                                                        <div className="lang-info">
                                                            <span className="lang-name">{langName}</span>
                                                            {langData?.script && (
                                                                <span className="lang-subline"><i className="fas fa-feather-alt"></i> {langData.script}</span>
                                                            )}
                                                            {langData?.nativeSpeakers?.length > 0 && (
                                                                <span className="lang-subline"><i className="fas fa-users"></i> {langData.nativeSpeakers.join(' · ')}</span>
                                                            )}
                                                        </div>
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
                                                            <div className="lang-info">
                                                                <span className="lang-name">{language.name}</span>
                                                                {language.script && (
                                                                    <span className="lang-subline"><i className="fas fa-feather-alt"></i> {language.script}</span>
                                                                )}
                                                                {language.nativeSpeakers?.length > 0 && (
                                                                    <span className="lang-subline"><i className="fas fa-users"></i> {language.nativeSpeakers.join(' · ')}</span>
                                                                )}
                                                            </div>
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
                <div className="inspector-pane-right" data-mobile-panel="details">
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
                                            <span className="grimoire-attribute-pill" style={{ color: '#663c32', background: 'rgba(102, 60, 50, 0.12)' }}>
                                                <i className="fas fa-check-circle"></i> Class Specialization
                                            </span>
                                        )}
                                    </div>
                                    <p className="grimoire-description">{activeSkill.description}</p>
                                </div>
                            </div>

                            {inspectedSkillId === WEAPON_MASTERY_SKILL_ID && (
                                <div className="grimoire-weapon-picker" data-testid="wizard-weapon-picker">
                                    <label htmlFor="wizard-weapon-type">Weapon type</label>
                                    <select
                                        id="wizard-weapon-type"
                                        value={wizardWeaponType}
                                        onChange={(e) => setWizardWeaponType(e.target.value)}
                                    >
                                        {Object.entries(WEAPON_TYPE_META).map(([weaponKey, meta]) => (
                                            <option key={weaponKey} value={weaponKey}>
                                                {meta.label}: {SKILL_RANKS[getStoredWeaponRank(skillRanks, weaponKey) || 'UNTRAINED'].name}
                                            </option>
                                        ))}
                                    </select>
                                    <p>Each weapon type is ranked and bought separately.</p>
                                    {legacyWeaponRank && (
                                        <p className="legacy-weapon-rank-note">
                                            This character also has an earlier shared Weapon Mastery rank ({SKILL_RANKS[legacyWeaponRank].name}). It is kept unchanged; assign it to weapons on the character sheet.
                                        </p>
                                    )}
                                </div>
                            )}
                            {/* Training Controls */}
                            <div className="grimoire-training-section">
                                <h4 className="grimoire-training-title">
                                    <span>{skillFilter === 'standard' ? 'Skill Die' : 'Expertise Level'}</span>
                                    <span className="current-rank-label" style={{ color: activeSkillRank.color }}>
                                        {inspectedSkillId === WEAPON_MASTERY_SKILL_ID ? `${WEAPON_TYPE_META[wizardWeaponType]?.label || 'Weapon'}: ` : ''}{skillFilter === 'standard' ? `${mapRankToDie(currentRankKey).toUpperCase()} (${activeSkillRank.name})` : `${activeSkillRank.name} (${mapRankToDie(currentRankKey)})`}
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
                                            <p>No authored outcome table for this rank yet. The GM rules.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Rules Reference Section */}
                            <SkillRulesReference skillFilter={skillFilter} setSkillFilter={setSkillFilter} />
                        </div>
                    ) : (
                        <div className="skill-grimoire-inspector">
                            <div className="grimoire-empty-state">
                                <i className="fas fa-compass empty-icon"></i>
                                <h3>Inspect a Skill</h3>
                                <p>Select any skill from the left list to inspect its attributes, quests, and roll outcome previews.</p>
                            </div>

                            {/* Rules Reference Section (shown even when no skill selected) */}
                            <SkillRulesReference skillFilter={skillFilter} setSkillFilter={setSkillFilter} />
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
