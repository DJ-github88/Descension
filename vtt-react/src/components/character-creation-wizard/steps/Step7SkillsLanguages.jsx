/**
 * Step 7: Skills & Languages
 *
 * Choose skills and languages for your character
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
import SkillRankUpgrade from '../components/SkillRankUpgrade';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import { useUnifiedTooltip } from '../../common/useUnifiedTooltip';
import { getIconUrl } from '../../../utils/assetManager';

// Mapping from D&D 5e skill names (used in backgrounds) to custom skill IDs
// Now maps directly to D&D skill IDs since we have all 18 D&D skills
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

// Get all available skills from SKILL_DEFINITIONS
// Convert the skill definitions object into an array for display
const ALL_SKILLS = Object.entries(SKILL_DEFINITIONS).map(([skillId, skillData]) => ({
    id: skillId,
    name: skillData.name,
    icon: skillData.icon,
    description: skillData.description,
    category: skillData.category
}));

// All available languages (expanded to include race-specific and thematic languages)
const COMMON_LANGUAGES = [
    // Standard Common Languages
    { name: 'Common', icon: 'fa-users', category: 'standard', description: 'The universal trade language spoken by most civilized races across the realm.' },
    { name: 'Dwarvish', icon: 'fa-hammer', category: 'standard', description: 'The guttural language of dwarves, filled with hard consonants and references to stone and metal.' },
    { name: 'Elvish', icon: 'fa-tree', category: 'standard', description: 'A fluid, melodic language spoken by elves, known for its beauty and complexity.' },
    { name: 'Giant', icon: 'fa-mountain', category: 'standard', description: 'The booming language of giants and their kin, simple but powerful in expression.' },
    { name: 'Gnomish', icon: 'fa-gears', category: 'standard', description: 'A technical language full of compound words, reflecting gnomish love of invention and detail.' },
    { name: 'Goblin', icon: 'fa-spider', category: 'standard', description: 'A harsh, grating language spoken by goblins and related creatures.' },
    { name: 'Halfling', icon: 'fa-house', category: 'standard', description: 'A warm, friendly language that reflects the halfling love of comfort and community.' },

    // Exotic/Planar Languages
    { name: 'Abyssal', icon: 'fa-fire', category: 'exotic', description: 'The chaotic language of demons, filled with harsh sounds that seem to corrupt the air itself.' },
    { name: 'Celestial', icon: 'fa-sun', category: 'exotic', description: 'The harmonious language of angels and celestial beings, carrying divine authority.' },
    { name: 'Draconic', icon: 'fa-dragon', category: 'exotic', description: 'The ancient language of dragons, powerful and precise, used in many magical incantations.' },
    { name: 'Deep Speech', icon: 'fa-brain', category: 'exotic', description: 'The alien language of aberrations and mind flayers, incomprehensible to most mortal minds.' },
    { name: 'Infernal', icon: 'fa-fire-flame-curved', category: 'exotic', description: 'The lawful language of devils, structured and binding, often used in contracts and pacts.' },
    { name: 'Primordial', icon: 'fa-wind', category: 'exotic', description: 'The ancient language of elementals, encompassing all elemental dialects.' },
    { name: 'Sylvan', icon: 'fa-seedling', category: 'exotic', description: 'The language of fey creatures and nature spirits, whimsical and ever-changing.' },
    { name: 'Undercommon', icon: 'fa-dungeon', category: 'exotic', description: 'The trade language of the Underdark, spoken by drow, duergar, and other subterranean races.' },

    // Race-Specific Languages
    { name: 'Old Nord', icon: 'fa-mountain', category: 'racial', description: 'The ancestral language of the Nordmark people, filled with tales of ice and honor.' },
    { name: 'Corvid', icon: 'fa-crow', category: 'racial', description: 'The mysterious language of the Corvani, incorporating clicks and whistles like bird calls.' },
    { name: 'Terran', icon: 'fa-gem', category: 'racial', description: 'The language of earth elementals and stone-touched races, slow and grinding like shifting rock.' },
    { name: 'Ethereal', icon: 'fa-ghost', category: 'racial', description: 'The whispered language of spirits and the Veilborn, barely audible to mortal ears.' },
    { name: 'Changeling', icon: 'fa-masks-theater', category: 'racial', description: 'The secretive language of changelings, designed to convey hidden meanings and identities.' },
    { name: 'Druidic', icon: 'fa-leaf', category: 'racial', description: 'The secret language of druids, forbidden to non-druids, used to leave hidden messages in nature.' },
    { name: 'Ignan', icon: 'fa-fire', category: 'racial', description: 'The crackling language of fire elementals and flame-touched beings, hot and volatile.' },
    { name: 'Beast Speech', icon: 'fa-paw', category: 'racial', description: 'The primal language that allows communication with animals and beasts.' },
    { name: 'Necril', icon: 'fa-skull', category: 'racial', description: 'The dark language of the undead, cold and lifeless, used in necromantic rituals.' },
    { name: 'Orcish', icon: 'fa-axe-battle', category: 'racial', description: 'The war-tongue of orcs, aggressive and direct, perfect for battle commands and tribal communication.' },

    // Elemental Languages
    { name: 'Elemental', icon: 'fa-wind', category: 'elemental', description: 'The general language of all elementals, bridging the four elemental planes.' },
    { name: 'Primal', icon: 'fa-leaf-oak', category: 'elemental', description: 'The raw language of nature itself, understood by primal beings and wild creatures.' },
    { name: 'Auran', icon: 'fa-cloud', category: 'elemental', description: 'The airy language of air elementals and sky-dwelling creatures, light and breezy.' },
    { name: 'Aquan', icon: 'fa-water', category: 'elemental', description: 'The flowing language of water elementals, fluid and ever-changing like the tides.' },

    // Special Languages
    { name: 'Thieves\' Cant', icon: 'fa-mask', category: 'special', description: 'A secret code language used by criminals and rogues to communicate covertly in public.' },
    { name: 'Sign Language', icon: 'fa-hands', category: 'special', description: 'A universal gestural language allowing silent communication across language barriers.' },
    { name: 'All Ancient Languages', icon: 'fa-scroll', category: 'special', description: 'Comprehensive knowledge of all dead and ancient languages, granted only to eternal scholars.' }
];

const Step7SkillsLanguages = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const { characterData } = state;

    const [selectedSkills, setSelectedSkills] = useState(characterData.selectedSkills || []);
    const [selectedLanguages, setSelectedLanguages] = useState(characterData.selectedLanguages || []);
    const [skillRanks, setSkillRanks] = useState(characterData.skillRanks || {});
    const [expandedSkills, setExpandedSkills] = useState(new Set());

    // Calculate skill points
    const totalSkillPoints = calculateTotalSkillPoints(characterData);
    const pointsSpent = calculatePointsSpent(skillRanks);
    const availablePoints = totalSkillPoints - pointsSpent;

    // Use unified tooltip system
    const {
        tooltipState,
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove
    } = useUnifiedTooltip();

    // Get data from previous selections
    const backgroundData = characterData.background ? getBackgroundData(characterData.background) : null;
    const raceData = characterData.race ? getRaceData(characterData.race) : null;
    const subraceData = characterData.race && characterData.subrace
        ? getSubraceData(characterData.race, characterData.subrace)
        : null;
    const pathData = characterData.path ? getPathData(characterData.path) : null;

    // Get racial languages (automatically granted)
    const racialLanguages = React.useMemo(() => subraceData?.languages || [], [subraceData]);

    // Calculate how many skills and languages the character can choose
    // Convert D&D skill names from background to custom skill IDs
    const backgroundSkills = React.useMemo(() => {
        const dndSkills = backgroundData?.skillProficiencies || [];
        return dndSkills
            .map(dndSkill => DND_TO_CUSTOM_SKILL_MAP[dndSkill])
            .filter(Boolean);
    }, [backgroundData]);

    // Convert D&D skill names from path to custom skill IDs
    const pathSkills = React.useMemo(() => {
        const dndSkills = pathData?.skillProficiencies || [];
        return dndSkills
            .map(dndSkill => DND_TO_CUSTOM_SKILL_MAP[dndSkill])
            .filter(Boolean);
    }, [pathData]);

    // Combine background and path skills as automatically granted
    const grantedSkills = React.useMemo(() =>
        [...new Set([...backgroundSkills, ...pathSkills])],
        [backgroundSkills, pathSkills]
    );

    const classSkillCount = 1; // Reduced to balance skill proficiencies - characters get 1 skill choice
    const languageCount = (backgroundData?.languages || 0) + (pathData?.languages || 0);

    // Update context when selections change
    useEffect(() => {
        dispatch(wizardActionCreators.setSkills(selectedSkills));
    }, [selectedSkills, dispatch]);

    useEffect(() => {
        // Combine racial languages (automatic) with selected languages (chosen)
        const allLanguages = [...new Set([...racialLanguages, ...selectedLanguages])];
        dispatch(wizardActionCreators.setLanguages(allLanguages));
    }, [selectedLanguages, racialLanguages, dispatch]);

    useEffect(() => {
        dispatch(wizardActionCreators.setSkillRanks(skillRanks));
    }, [skillRanks, dispatch]);

    // Initialize skill ranks for granted skills
    useEffect(() => {
        const updatedRanks = { ...skillRanks };
        let hasChanges = false;

        // Set granted skills to at least NOVICE if not already set
        grantedSkills.forEach(skillId => {
            if (!updatedRanks[skillId]) {
                updatedRanks[skillId] = 'NOVICE';
                hasChanges = true;
            }
        });

        // Initialize all other skills to UNTRAINED if not set
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

    const handleSkillToggle = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            if (selectedSkills.length < classSkillCount) {
                setSelectedSkills([...selectedSkills, skill]);
            }
        }
    };

    const handleLanguageToggle = (language) => {
        if (selectedLanguages.includes(language)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== language));
        } else {
            if (selectedLanguages.length < languageCount) {
                setSelectedLanguages([...selectedLanguages, language]);
            }
        }
    };

    // Skill rank upgrade/downgrade handlers
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

    const isSkillGranted = (skill) => grantedSkills.includes(skill);
    const isSkillDisabled = (skill) => {
        return isSkillGranted(skill) || (!selectedSkills.includes(skill) && selectedSkills.length >= classSkillCount);
    };

    const isLanguageDisabled = (language) => {
        // Disable if it's a racial language or if selection limit is reached
        return racialLanguages.includes(language) ||
            (!selectedLanguages.includes(language) && selectedLanguages.length >= languageCount);
    };

    // Get skill rank from state
    const getSkillRank = (skillId) => {
        const rankKey = skillRanks[skillId] || 'UNTRAINED';
        return { key: rankKey, ...SKILL_RANKS[rankKey] };
    };

    // Check if a skill is proficient (NOVICE or higher)
    const isProficient = (skillId) => {
        return isSkillProficient(skillId, skillRanks);
    };

    // Get available quests for a skill
    const getAvailableQuests = (skillId) => {
        const skillQuests = SKILL_QUESTS[skillId] || [];
        const currentRank = getSkillRank(skillId);

        // Show quests for NOVICE rank (first few quests)
        return skillQuests.filter(quest => {
            const rankIndex = Object.keys(SKILL_RANKS).indexOf(quest.rank);
            const currentRankIndex = Object.keys(SKILL_RANKS).indexOf(currentRank.key);
            return rankIndex <= currentRankIndex + 1;
        }).slice(0, 3); // Show first 3 quests
    };

    // Toggle skill expansion
    const toggleSkillExpansion = (skillId) => {
        setExpandedSkills(prev => {
            const newSet = new Set(prev);
            if (newSet.has(skillId)) {
                newSet.delete(skillId);
            } else {
                newSet.add(skillId);
            }
            return newSet;
        });
    };

    // Get current rollable table for skill
    const getCurrentRollableTable = (skillId) => {
        const skill = SKILL_DEFINITIONS[skillId];
        if (!skill) return null;

        const rank = getSkillRank(skillId);
        if (skill.rollableTables) {
            // Handle multi-dimensional table structure (rank -> die type -> tableId)
            const rankTables = skill.rollableTables[rank.key] || skill.rollableTables.UNTRAINED;
            if (typeof rankTables === 'object' && rankTables.d20) {
                // Use d20 table as default for character creation preview
                const tableId = rankTables.d20;
                return ROLLABLE_TABLES[tableId];
            } else if (typeof rankTables === 'string') {
                // Handle old single table structure
                return ROLLABLE_TABLES[rankTables];
            }
        } else if (skill.rollableTable) {
            return ROLLABLE_TABLES[skill.rollableTable];
        }
        return null;
    };

    return (
        <div className="wizard-step-content">
            <div className="skills-languages-container">
                {/* Skills Section */}
                <div className="selection-section">
                    <div className="section-header">
                        <h3><i className="fas fa-cogs"></i> Skill Proficiencies</h3>
                        <div className="selection-info">
                            <span className={selectedSkills.length === classSkillCount ? 'complete' : 'incomplete'}>
                                {selectedSkills.length} / {classSkillCount} Selected
                            </span>
                        </div>
                    </div>

                    {grantedSkills.length > 0 && (
                        <div className="granted-info">
                            <i className="fas fa-gift"></i> Granted Skills: <strong>
                                {grantedSkills.map(skillId => SKILL_DEFINITIONS[skillId]?.name || skillId).join(', ')}
                            </strong>
                            {backgroundSkills.length > 0 && pathSkills.length > 0 && (
                                <span className="source-breakdown">
                                    ({backgroundSkills.length} from background, {pathSkills.length} from path)
                                </span>
                            )}
                        </div>
                    )}

                    <div className="button-grid">
                        {ALL_SKILLS.map((skill) => {
                            const isGranted = isSkillGranted(skill.id);
                            const isSelected = selectedSkills.includes(skill.id);
                            const isDisabled = isSkillDisabled(skill.id);

                            return (
                                <button
                                    key={skill.id}
                                    type="button"
                                    className={`selection-button ${isSelected ? 'selected' : ''} ${isGranted ? 'granted' : ''} ${isDisabled ? 'disabled' : ''} ${isProficient(skill.id) ? 'proficient' : ''}`}
                                    onClick={() => !isGranted && !isDisabled && handleSkillToggle(skill.id)}
                                    onMouseEnter={handleMouseEnter(skill.description)}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseMove={handleMouseMove}
                                    disabled={isDisabled && !isSelected && !isGranted}
                                >
                                    <img src={getIconUrl(skill.icon, 'abilities')} alt={skill.name} className="skill-icon" />
                                    <span>{skill.name}</span>
                                    {(isSelected || isGranted) && <i className="fas fa-check check-icon"></i>}
                                    {isProficient(skill.id) && <span className="proficient-tag" title="Proficient - Unlocks skill-based abilities">Proficient</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Languages Section */}
                <div className="selection-section">
                    <div className="section-header">
                        <h3><i className="fas fa-language"></i> Languages</h3>
                        {languageCount > 0 && (
                            <div className="selection-info">
                                <span className={selectedLanguages.length === languageCount ? 'complete' : 'incomplete'}>
                                    {selectedLanguages.length} / {languageCount} Selected
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Racial Languages */}
                    {racialLanguages.length > 0 && (
                        <div className="granted-section">
                            <div className="granted-header">
                                <i className="fas fa-star"></i> Racial Languages
                            </div>
                            <div className="background-grid">
                                {racialLanguages.map((language) => {
                                    const langData = COMMON_LANGUAGES.find(l => l.name === language);
                                    return (
                                        <div
                                            key={language}
                                            className="background-card granted selected"
                                            title={langData?.description || 'A racial language.'}
                                        >
                                            <div className="background-card-header-section">
                                                <div className="language-icon">
                                                    <i className={`fas ${langData?.icon || 'fa-language'}`}></i>
                                                </div>
                                                <div className="background-card-title-section">
                                                    <h4 className="background-card-name" style={{ marginTop: 0 }}>{language}</h4>
                                                    <p className="background-card-description">{langData?.description}</p>
                                                </div>
                                            </div>
                                            <div className="language-compact-badge">
                                                <i className="fas fa-star"></i>
                                                <span>Racial</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Additional Languages */}
                    {languageCount > 0 && (
                        <div className="selectable-section">
                            <div className="selectable-header">
                                <i className="fas fa-book"></i> Additional Languages ({selectedLanguages.length} / {languageCount} from background & path)
                            </div>
                            <div className="background-grid">
                                {COMMON_LANGUAGES.map((language) => {
                                    const isSelected = selectedLanguages.includes(language.name);
                                    const isRacial = racialLanguages.includes(language.name);
                                    const isDisabled = isLanguageDisabled(language.name);

                                    return (
                                        <div
                                            key={language.name}
                                            className={`background-card ${isSelected || isRacial ? 'selected' : ''} ${isRacial ? 'granted' : ''} ${isDisabled && !isSelected && !isRacial ? 'disabled' : ''}`}
                                            onClick={() => !isRacial && !isDisabled && handleLanguageToggle(language.name)}
                                        >
                                            <div className="background-card-header-section">
                                                <div className="language-icon">
                                                    <i className={`fas ${language.icon}`}></i>
                                                </div>
                                                <div className="background-card-title-section">
                                                    <h4 className="background-card-name" style={{ marginTop: 0 }}>{language.name}</h4>
                                                    <p className="background-card-description">{language.description}</p>
                                                </div>
                                            </div>
                                            {(isSelected || isRacial) && (
                                                <div className="language-compact-badge">
                                                    <i className={`fas ${isRacial ? 'fa-star' : 'fa-check'}`}></i>
                                                    <span>{isRacial ? 'Racial' : 'Selected'}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Skill Point Allocation Section */}
                <div className="selection-section skill-points-section">
                    <div className="section-header">
                        <h3><i className="fas fa-chart-line"></i> Skill Rank Allocation</h3>
                        <div className="skill-points-display">
                            <span className={`points-available ${availablePoints === 0 ? 'complete' : availablePoints < 0 ? 'over-budget' : 'incomplete'}`}>
                                <i className="fas fa-coins"></i> {availablePoints} / {totalSkillPoints} Points Available
                            </span>
                        </div>
                    </div>

                    <div className="skill-points-info">
                        <p>
                            <i className="fas fa-info-circle"></i> Spend skill points to increase your proficiency in skills.
                            Each upgrade costs more than the last. Granted skills start at <strong>Novice</strong> rank.
                        </p>
                        <div className="points-breakdown">
                            <span><strong>Base Points:</strong> 15</span>
                            {characterData.finalStats?.intelligence > 10 && (
                                <span><strong>Intelligence Bonus:</strong> +{Math.floor((characterData.finalStats.intelligence - 10) / 2) * 2}</span>
                            )}
                            {characterData.background && (
                                <span><strong>Background:</strong> {characterData.background}</span>
                            )}
                            {characterData.race && (
                                <span><strong>Race:</strong> {characterData.race}</span>
                            )}
                        </div>
                    </div>

                    <div className="skill-ranks-list">
                        {/* Show granted skills first */}
                        {grantedSkills.length > 0 && (
                            <>
                                <h4 className="skill-group-header"><i className="fas fa-gift"></i> Granted Skills</h4>
                                {grantedSkills.map(skillId => {
                                    const skill = SKILL_DEFINITIONS[skillId];
                                    if (!skill) return null;

                                    return (
                                        <SkillRankUpgrade
                                            key={skillId}
                                            skill={skill}
                                            currentRank={skillRanks[skillId] || 'NOVICE'}
                                            onUpgrade={() => handleSkillUpgrade(skillId)}
                                            onDowngrade={() => handleSkillDowngrade(skillId)}
                                            availablePoints={availablePoints}
                                            isGranted={true}
                                        />
                                    );
                                })}
                            </>
                        )}

                        {/* Show selected skills */}
                        {selectedSkills.length > 0 && (
                            <>
                                <h4 className="skill-group-header"><i className="fas fa-check-circle"></i> Selected Skills</h4>
                                {selectedSkills.map(skillId => {
                                    const skill = SKILL_DEFINITIONS[skillId];
                                    if (!skill || grantedSkills.includes(skillId)) return null;

                                    return (
                                        <SkillRankUpgrade
                                            key={skillId}
                                            skill={skill}
                                            currentRank={skillRanks[skillId] || 'UNTRAINED'}
                                            onUpgrade={() => handleSkillUpgrade(skillId)}
                                            onDowngrade={() => handleSkillDowngrade(skillId)}
                                            availablePoints={availablePoints}
                                            isGranted={false}
                                        />
                                    );
                                })}
                            </>
                        )}

                        {/* Show other skills that have been upgraded */}
                        {Object.keys(skillRanks).filter(skillId =>
                            !grantedSkills.includes(skillId) &&
                            !selectedSkills.includes(skillId) &&
                            skillRanks[skillId] !== 'UNTRAINED'
                        ).length > 0 && (
                                <>
                                    <h4 className="skill-group-header"><i className="fas fa-star"></i> Other Upgraded Skills</h4>
                                    {Object.keys(skillRanks)
                                        .filter(skillId =>
                                            !grantedSkills.includes(skillId) &&
                                            !selectedSkills.includes(skillId) &&
                                            skillRanks[skillId] !== 'UNTRAINED'
                                        )
                                        .map(skillId => {
                                            const skill = SKILL_DEFINITIONS[skillId];
                                            if (!skill) return null;

                                            return (
                                                <SkillRankUpgrade
                                                    key={skillId}
                                                    skill={skill}
                                                    currentRank={skillRanks[skillId]}
                                                    onUpgrade={() => handleSkillUpgrade(skillId)}
                                                    onDowngrade={() => handleSkillDowngrade(skillId)}
                                                    availablePoints={availablePoints}
                                                    isGranted={false}
                                                />
                                            );
                                        })}
                                </>
                            )}

                        {grantedSkills.length === 0 && selectedSkills.length === 0 && (
                            <div className="no-skills-message">
                                <i className="fas fa-arrow-up"></i>
                                <p>Select skills above to allocate skill points</p>
                            </div>
                        )}
                    </div>
                </div>



                {/* Skill Details - Quests and Rollable Tables */}
                {(selectedSkills.length > 0 || grantedSkills.length > 0) && (
                    <div className="selection-section skill-details-section">
                        <div className="section-header">
                            <h3><i className="fas fa-scroll"></i> Skills Preview</h3>
                            <p className="section-description">
                                Below are the quests and rollable tables for your granted and selected skills.
                                Complete quests during gameplay to unlock higher skill ranks and better outcomes!
                            </p>
                        </div>

                        {/* Show granted skills first */}
                        {grantedSkills.map((skillId) => {
                            // Get skill definition
                            const skill = SKILL_DEFINITIONS[skillId];
                            if (!skill) return null;

                            const quests = getAvailableQuests(skillId);
                            const rollableTable = getCurrentRollableTable(skillId);
                            const rank = getSkillRank(skillId);

                            const isExpanded = expandedSkills.has(skillId);

                            return (
                                <div key={skillId} className="skill-detail-card granted-skill-card">
                                    <div className="skill-detail-header collapsible" onClick={() => toggleSkillExpansion(skillId)}>
                                        <img src={getIconUrl(skill.icon, 'abilities')} alt={skill.name} className="skill-detail-icon" />
                                        <div className="skill-detail-info">
                                            <h4>{skill.name} <span className="granted-badge">Granted</span></h4>
                                            <p>{skill.description}</p>
                                            <span className="skill-rank-badge" style={{ color: rank.color }}>
                                                {rank.name}
                                            </span>
                                        </div>
                                        <div className={`skill-toggle-icon ${isExpanded ? 'expanded' : ''}`}>
                                            <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="skill-expanded-content">
                                            {quests.length > 0 ? (
                                                <div className="quest-preview-section">
                                                    <h5><i className="fas fa-tasks"></i> Starting Quests</h5>
                                                    <div className="quest-preview-list">
                                                        {quests.map(quest => (
                                                            <div key={quest.id} className="quest-preview-item">
                                                                <img src={quest.icon} alt={quest.name} className="quest-preview-icon" />
                                                                <div className="quest-preview-info">
                                                                    <strong>{quest.name}</strong>
                                                                    <p>{quest.description}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="quest-preview-section">
                                                    <h5><i className="fas fa-tasks"></i> Starting Quests</h5>
                                                    <div className="no-quests-message">
                                                        <i className="fas fa-info-circle"></i>
                                                        <p>Quests for this skill are still being developed. Check back later!</p>
                                                    </div>
                                                </div>
                                            )}

                                            {rollableTable ? (
                                                <div className="table-preview-section">
                                                    <h5><i className="fas fa-dice-d20"></i> Rollable Table: {rollableTable.name}</h5>
                                                    <p className="table-description">{rollableTable.description}</p>
                                                    <div className="table-preview-entries">
                                                        {rollableTable.table.slice(0, 8).map((entry, index) => (
                                                            <div key={index} className={`table-preview-entry ${entry.type}`}>
                                                                <span className="roll-range">
                                                                    {entry.roll[0] === entry.roll[1]
                                                                        ? entry.roll[0]
                                                                        : `${entry.roll[0]}-${entry.roll[1]}`}
                                                                </span>
                                                                <span className="roll-result">{entry.result}</span>
                                                            </div>
                                                        ))}
                                                        {rollableTable.table.length > 8 && (
                                                            <div className="table-preview-more">
                                                                ... and {rollableTable.table.length - 8} more outcomes
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="table-preview-section">
                                                    <h5><i className="fas fa-dice-d20"></i> Rollable Table</h5>
                                                    <div className="no-quests-message">
                                                        <i className="fas fa-info-circle"></i>
                                                        <p>Rollable table for this skill is still being developed. Check back later!</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Show selected skills */}
                        {selectedSkills.map((skillId) => {
                            // Get skill definition
                            const skill = SKILL_DEFINITIONS[skillId];
                            if (!skill) return null;

                            const quests = getAvailableQuests(skillId);
                            const rollableTable = getCurrentRollableTable(skillId);
                            const rank = getSkillRank(skillId);
                            const isExpanded = expandedSkills.has(skillId);

                            return (
                                <div key={skillId} className="skill-detail-card">
                                    <div className="skill-detail-header collapsible" onClick={() => toggleSkillExpansion(skillId)}>
                                        <img src={getIconUrl(skill.icon, 'abilities')} alt={skill.name} className="skill-detail-icon" />
                                        <div className="skill-detail-info">
                                            <h4>{skill.name}</h4>
                                            <p>{skill.description}</p>
                                            <span className="skill-rank-badge" style={{ color: rank.color }}>
                                                {rank.name}
                                            </span>
                                        </div>
                                        <div className={`skill-toggle-icon ${isExpanded ? 'expanded' : ''}`}>
                                            <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="skill-expanded-content">
                                            {quests.length > 0 ? (
                                                <div className="quest-preview-section">
                                                    <h5><i className="fas fa-tasks"></i> Starting Quests</h5>
                                                    <div className="quest-preview-list">
                                                        {quests.map(quest => (
                                                            <div key={quest.id} className="quest-preview-item">
                                                                <img src={quest.icon} alt={quest.name} className="quest-preview-icon" />
                                                                <div className="quest-preview-info">
                                                                    <strong>{quest.name}</strong>
                                                                    <p>{quest.description}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="quest-preview-section">
                                                    <h5><i className="fas fa-tasks"></i> Starting Quests</h5>
                                                    <div className="no-quests-message">
                                                        <i className="fas fa-info-circle"></i>
                                                        <p>Quests for this skill are still being developed. Check back later!</p>
                                                    </div>
                                                </div>
                                            )}

                                            {rollableTable ? (
                                                <div className="table-preview-section">
                                                    <h5><i className="fas fa-dice-d20"></i> Rollable Table: {rollableTable.name}</h5>
                                                    <p className="table-description">{rollableTable.description}</p>
                                                    <div className="table-preview-entries">
                                                        {rollableTable.table.slice(0, 8).map((entry, index) => (
                                                            <div key={index} className={`table-preview-entry ${entry.type}`}>
                                                                <span className="roll-range">
                                                                    {entry.roll[0] === entry.roll[1]
                                                                        ? entry.roll[0]
                                                                        : `${entry.roll[0]}-${entry.roll[1]}`}
                                                                </span>
                                                                <span className="roll-result">{entry.result}</span>
                                                            </div>
                                                        ))}
                                                        {rollableTable.table.length > 8 && (
                                                            <div className="table-preview-more">
                                                                ... and {rollableTable.table.length - 8} more outcomes
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="table-preview-section">
                                                    <h5><i className="fas fa-dice-d20"></i> Rollable Table</h5>
                                                    <div className="no-quests-message">
                                                        <i className="fas fa-info-circle"></i>
                                                        <p>Rollable table for this skill is still being developed. Check back later!</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Languages Preview Section */}
                {(racialLanguages.length > 0 || selectedLanguages.length > 0) && (
                    <div className="selection-section language-preview-section">
                        <div className="section-header">
                            <h3><i className="fas fa-comments"></i> Languages Summary</h3>
                            <p className="section-description">
                                Your character knows the following languages.
                            </p>
                        </div>

                        <div className="language-summary-grid">
                            {/* Racial Languages */}
                            {racialLanguages.length > 0 && (
                                <div className="language-category">
                                    <h4><i className="fas fa-star"></i> Racial Languages</h4>
                                    <div className="language-list">
                                        {racialLanguages.map(lang => {
                                            const langData = COMMON_LANGUAGES.find(l => l.name === lang);
                                            return (
                                                <div key={lang} className="language-item racial">
                                                    <i className={`fas ${langData?.icon || 'fa-language'}`}></i>
                                                    <span className="language-name">{lang}</span>
                                                    <span className="language-source">Racial</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Selected Languages */}
                            {selectedLanguages.length > 0 && (
                                <div className="language-category">
                                    <h4><i className="fas fa-book"></i> Additional Languages</h4>
                                    <div className="language-list">
                                        {selectedLanguages.map(lang => {
                                            const langData = COMMON_LANGUAGES.find(l => l.name === lang);
                                            return (
                                                <div key={lang} className="language-item selected">
                                                    <i className={`fas ${langData?.icon || 'fa-language'}`}></i>
                                                    <span className="language-name">{lang}</span>
                                                    <span className="language-source">Learned</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
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

