import React, { useState } from 'react';
import useCharacterStore from '../../store/characterStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import { SKILL_CATEGORIES, SKILL_DEFINITIONS, SKILL_RANKS } from '../../constants/skillDefinitions';
import { SKILL_QUESTS } from '../../constants/skillQuests';
import { ROLLABLE_TABLES } from '../../constants/rollableTables';
import { calculateStatModifier } from '../../utils/characterUtils';
import { showSkillRollNotification } from '../../utils/skillRollNotification';

import '../../styles/skills.css';
import '../../styles/skill-roll-notification.css';

export default function Skills() {
    // Use inspection context if available, otherwise use regular character store
    const inspectionData = useInspectionCharacter();
    const characterStore = useCharacterStore();

    // Choose data source based on whether we're in inspection mode
    const dataSource = inspectionData || characterStore;

    const {
        stats,
        equipmentBonuses,
        skillProgress = {},
        skillRanks = {},
        updateSkillProgress
    } = dataSource;

    const [selectedSkill, setSelectedSkill] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDie, setSelectedDie] = useState('d20'); // Default to d20 (hardest)
    const [collapsedCategories, setCollapsedCategories] = useState({}); // Track which categories are collapsed

    // Get all skills grouped by category for sidebar
    const skillsByCategory = Object.entries(SKILL_DEFINITIONS).reduce((acc, [skillId, skill]) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push({ id: skillId, ...skill });
        return acc;
    }, {});

    // Search functionality - searches through skills and quests
    const searchResults = searchQuery.trim() ? Object.entries(SKILL_DEFINITIONS).filter(([skillId, skill]) => {
        const query = searchQuery.toLowerCase();

        // Search in skill name and description
        if (skill.name.toLowerCase().includes(query) || skill.description.toLowerCase().includes(query)) {
            return true;
        }

        // Search in quest names and descriptions
        const quests = SKILL_QUESTS[skillId] || [];
        return quests.some(quest =>
            quest.name.toLowerCase().includes(query) ||
            quest.description.toLowerCase().includes(query) ||
            (quest.unlocks && quest.unlocks.some(unlock => unlock.toLowerCase().includes(query)))
        );
    }).map(([skillId, skill]) => ({ id: skillId, ...skill })) : [];

    // Get skill rank from character data (set during character creation)
    // Fall back to quest-based progression if no rank is set
    const getSkillRank = (skillId) => {
        // First check if there's a rank from character creation
        if (skillRanks && skillRanks[skillId]) {
            const rankKey = skillRanks[skillId];
            return { key: rankKey, ...SKILL_RANKS[rankKey] };
        }

        // Fall back to quest-based progression
        const progress = skillProgress[skillId] || { completedQuests: [] };
        const completedCount = progress.completedQuests.length;

        for (const [rankKey, rankData] of Object.entries(SKILL_RANKS).reverse()) {
            if (completedCount >= rankData.questsRequired) {
                return { key: rankKey, ...rankData };
            }
        }
        return { key: 'UNTRAINED', ...SKILL_RANKS.UNTRAINED };
    };

    // Get available quests for a skill
    const getAvailableQuests = (skillId) => {
        const skillQuests = SKILL_QUESTS[skillId] || [];
        const progress = skillProgress[skillId] || { completedQuests: [] };
        const currentRank = getSkillRank(skillId);

        return skillQuests.filter(quest => {
            const isCompleted = progress.completedQuests.includes(quest.id);
            const rankIndex = Object.keys(SKILL_RANKS).indexOf(quest.rank);
            const currentRankIndex = Object.keys(SKILL_RANKS).indexOf(currentRank.key);

            // Show completed quests and quests for current rank or lower
            return isCompleted || rankIndex <= currentRankIndex + 1;
        });
    };

    // Toggle quest completion
    const toggleQuest = (skillId, questId) => {
        const progress = skillProgress[skillId] || { completedQuests: [] };
        const isCompleted = progress.completedQuests.includes(questId);

        const newCompletedQuests = isCompleted
            ? progress.completedQuests.filter(id => id !== questId)
            : [...progress.completedQuests, questId];

        updateSkillProgress(skillId, {
            ...progress,
            completedQuests: newCompletedQuests
        });
    };

    // Get current rollable table for skill based on rank and selected die
    const getCurrentRollableTable = (skill, skillId) => {
        const rank = getSkillRank(skillId);
        if (skill.rollableTables) {
            // Check if this skill uses the new multi-dimensional table structure
            const rankTables = skill.rollableTables[rank.key] || skill.rollableTables.UNTRAINED;
            if (typeof rankTables === 'object' && rankTables[selectedDie]) {
                // New structure: proficiency × die type
                const tableId = rankTables[selectedDie];
                // Verify the table exists in ROLLABLE_TABLES
                if (!ROLLABLE_TABLES[tableId]) {
                    console.error(`Table not found: ${tableId} for skill ${skillId}, rank ${rank.key}, die ${selectedDie}`);
                    return null;
                }
                return tableId;
            }
            // Old structure: just proficiency level
            return rankTables;
        }
        return skill.rollableTable; // Fallback for old format
    };

    // Roll on a skill table
    const rollSkillTable = (skill, skillId) => {
        const tableId = getCurrentRollableTable(skill, skillId);
        const table = ROLLABLE_TABLES[tableId];
        if (!table) return;

        // Get the die size from selectedDie (e.g., 'd20' -> 20)
        const dieSize = parseInt(selectedDie.substring(1));
        const roll = Math.floor(Math.random() * dieSize) + 1;
        const result = table.table.find(entry =>
            roll >= entry.roll[0] && roll <= entry.roll[1]
        );

        if (result) {
            // Show beautiful notification instead of ugly alert
            console.log(`Rolled ${roll}: ${result.result}`);
            showSkillRollNotification(roll, result, skill.name);
        }
    };

    // Calculate skill modifier
    const getSkillModifier = (skill) => {
        const primaryMod = calculateStatModifier(stats[skill.primaryStat] + (equipmentBonuses[skill.primaryStat] || 0));
        const secondaryMod = calculateStatModifier(stats[skill.secondaryStat] + (equipmentBonuses[skill.secondaryStat] || 0));
        const rank = getSkillRank(Object.keys(SKILL_DEFINITIONS).find(key => SKILL_DEFINITIONS[key] === skill));
        const rankBonus = Object.keys(SKILL_RANKS).indexOf(rank.key);

        return primaryMod + Math.floor(secondaryMod / 2) + rankBonus;
    };

    // Render skill detail view (right side)
    const renderSkillDetail = () => {
        if (!selectedSkill) {
            return (
                <div className="no-skill-selected">
                    <i className="fas fa-hand-pointer" style={{ fontSize: '48px', color: '#8b7355', marginBottom: '20px' }}></i>
                    <p>Select a skill from the list to view details</p>
                </div>
            );
        }

        const skill = SKILL_DEFINITIONS[selectedSkill];
        const rank = getSkillRank(selectedSkill);
        const modifier = getSkillModifier(skill);
        const quests = getAvailableQuests(selectedSkill);
        const completedQuests = skillProgress[selectedSkill]?.completedQuests || [];

        return (
            <div className="skill-detail-view">
                <div className="skill-detail-header">
                    <img src={skill.icon} alt={skill.name} className="skill-detail-icon" />
                    <div className="skill-detail-title-section">
                        <h2 className="skill-detail-name" style={{ color: rank.color }}>
                            {skill.name}
                        </h2>
                        <p className="skill-detail-description">{skill.description}</p>
                        <div className="skill-detail-stats">
                            <span className="skill-rank">{rank.name}</span>
                            <span className="skill-modifier">+{modifier}</span>
                            <span className="skill-progress">
                                {completedQuests.length}/{quests.length} Quests
                            </span>
                        </div>
                    </div>
                    {(skill.rollableTable || skill.rollableTables) && (
                        <button
                            className="roll-table-btn"
                            onClick={() => rollSkillTable(skill, selectedSkill)}
                        >
                            <i className="fas fa-dice"></i> Roll
                        </button>
                    )}
                </div>

                <div className="quest-section">
                    <h3>Available Quests</h3>
                    <div className="quest-list">
                        {quests.map(quest => {
                            const isCompleted = completedQuests.includes(quest.id);
                            return (
                                <div
                                    key={quest.id}
                                    className={`quest-item ${isCompleted ? 'completed' : ''}`}
                                    onClick={() => toggleQuest(selectedSkill, quest.id)}
                                >
                                    <img src={quest.icon} alt={quest.name} className="quest-icon" />
                                    <div className="quest-info">
                                        <h5 className="quest-name">{quest.name}</h5>
                                        <p className="quest-description">{quest.description}</p>
                                        {quest.unlocks && quest.unlocks.length > 0 && (
                                            <div className="quest-unlocks">
                                                <strong>Unlocks:</strong> {quest.unlocks.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="quest-status">
                                        {isCompleted ? '✓' : '○'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {(() => {
                    // Check if this skill uses the new multi-dimensional table structure
                    const rankTables = skill.rollableTables?.[rank.key] || skill.rollableTables?.UNTRAINED;
                    const hasMultiDieTables = rankTables && typeof rankTables === 'object' && rankTables.d4;

                    const currentTableId = getCurrentRollableTable(skill, selectedSkill);
                    const currentTable = currentTableId ? ROLLABLE_TABLES[currentTableId] : null;

                    return currentTable && (
                        <div className="table-section">
                            {hasMultiDieTables && (
                                <div className="die-selector-section">
                                    <h4>Difficulty (Die Type)</h4>
                                    <div className="die-selector-strip">
                                        {['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map(die => (
                                            <div
                                                key={die}
                                                className={`die-selector-icon ${selectedDie === die ? 'selected' : ''}`}
                                                onClick={() => setSelectedDie(die)}
                                                title={`${die.toUpperCase()} - ${
                                                    die === 'd4' ? 'Very Easy' :
                                                    die === 'd6' ? 'Easy' :
                                                    die === 'd8' ? 'Moderate' :
                                                    die === 'd10' ? 'Challenging' :
                                                    die === 'd12' ? 'Difficult' :
                                                    'Very Difficult'
                                                }`}
                                            >
                                                <span className="die-number">{die.substring(1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <h3>Rollable Table ({rank.name}): {currentTable.name}</h3>
                            <p>{currentTable.description}</p>
                            <div className="table-entries">
                                {currentTable.table.map((entry, index) => (
                                    <div key={index} className={`table-entry ${entry.type}`}>
                                        <span className="roll-range">
                                            {entry.roll[0] === entry.roll[1]
                                                ? entry.roll[0]
                                                : `${entry.roll[0]}-${entry.roll[1]}`}
                                        </span>
                                        <span className="roll-result">{entry.result}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
    };

    // Toggle category collapse state
    const toggleCategory = (categoryName) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    return (
        <div className="skills-container">
            <div className="skills-sidebar">
                <div className="skills-search-container">
                    <input
                        type="text"
                        className="skills-search-input"
                        placeholder="Search skills and quests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <i
                            className="fas fa-times skills-search-clear"
                            onClick={() => setSearchQuery('')}
                        ></i>
                    )}
                </div>

                {searchQuery.trim() ? (
                    // Show search results
                    <div className="skill-search-results">
                        <div className="skill-category-header">
                            <i className="fas fa-search skill-category-icon-fa"></i>
                            <span className="skill-category-name">Search Results ({searchResults.length})</span>
                        </div>
                        <div className="skill-list">
                            {searchResults.length > 0 ? searchResults.map(skill => {
                                const rank = getSkillRank(skill.id);
                                const quests = getAvailableQuests(skill.id);
                                const completedQuests = skillProgress[skill.id]?.completedQuests || [];
                                const isSelected = selectedSkill === skill.id;

                                return (
                                    <div
                                        key={skill.id}
                                        className={`skill-list-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedSkill(skill.id);
                                            setSearchQuery(''); // Clear search after selection
                                        }}
                                    >
                                        <div className="skill-list-name" style={{ color: rank.color }}>
                                            {skill.name} <span className="skill-rank-label">({rank.name})</span>
                                        </div>
                                        <div className="skill-list-progress">
                                            {completedQuests.length}/{quests.length}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="no-search-results">
                                    <i className="fas fa-search" style={{ fontSize: '24px', color: '#8b7355', marginBottom: '10px' }}></i>
                                    <p>No skills or quests found</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Show normal category view
                    Object.entries(skillsByCategory).map(([categoryName, skills]) => {
                        const categoryData = Object.values(SKILL_CATEGORIES).find(cat => cat.name === categoryName);
                        const isCollapsed = collapsedCategories[categoryName];

                        return (
                            <div key={categoryName} className="skill-category-section">
                                <div
                                    className="skill-category-header"
                                    onClick={() => toggleCategory(categoryName)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={categoryData?.icon} alt="" className="skill-category-icon" />
                                    <span className="skill-category-name">{categoryName}</span>
                                    <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'} category-toggle-icon`}></i>
                                </div>
                                {!isCollapsed && (
                                    <div className="skill-list">
                                        {skills.map(skill => {
                                            const rank = getSkillRank(skill.id);
                                            const quests = getAvailableQuests(skill.id);
                                            const completedQuests = skillProgress[skill.id]?.completedQuests || [];
                                            const isSelected = selectedSkill === skill.id;

                                            return (
                                                <div
                                                    key={skill.id}
                                                    className={`skill-list-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => setSelectedSkill(skill.id)}
                                                >
                                                    <div className="skill-list-name" style={{ color: rank.color }}>
                                                        {skill.name} <span className="skill-rank-label">({rank.name})</span>
                                                    </div>
                                                    <div className="skill-list-progress">
                                                        {completedQuests.length}/{quests.length}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="skills-content">
                {renderSkillDetail()}
            </div>
        </div>
    );
}