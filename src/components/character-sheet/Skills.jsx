import React, { useState } from 'react';
import useCharacterStore from '../../store/characterStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import { SKILL_CATEGORIES, SKILL_DEFINITIONS, SKILL_RANKS } from '../../constants/skillDefinitions';
import { SKILL_QUESTS } from '../../constants/skillQuests';
import { ROLLABLE_TABLES } from '../../constants/rollableTables';
import { calculateStatModifier } from '../../utils/characterUtils';

import '../../styles/skills.css';

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
        updateSkillProgress
    } = dataSource;

    const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES.COMBAT.name);
    const [selectedSkill, setSelectedSkill] = useState(null);

    // Get skills for the active category
    const categorySkills = Object.entries(SKILL_DEFINITIONS).filter(
        ([_, skill]) => skill.category === activeCategory
    );

    // Calculate skill rank based on completed quests
    const getSkillRank = (skillId) => {
        const progress = skillProgress[skillId] || { completedQuests: [] };
        const completedCount = progress.completedQuests.length;

        for (const [rankKey, rankData] of Object.entries(SKILL_RANKS).reverse()) {
            if (completedCount >= rankData.questsRequired) {
                return { key: rankKey, ...rankData };
            }
        }
        return { key: 'NOVICE', ...SKILL_RANKS.NOVICE };
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

    // Get current rollable table for skill based on rank
    const getCurrentRollableTable = (skill, skillId) => {
        const rank = getSkillRank(skillId);
        if (skill.rollableTables) {
            return skill.rollableTables[rank.key] || skill.rollableTables.UNTRAINED;
        }
        return skill.rollableTable; // Fallback for old format
    };

    // Roll on a skill table
    const rollSkillTable = (skill, skillId) => {
        const tableId = getCurrentRollableTable(skill, skillId);
        const table = ROLLABLE_TABLES[tableId];
        if (!table) return;

        const roll = Math.floor(Math.random() * 20) + 1;
        const result = table.table.find(entry =>
            roll >= entry.roll[0] && roll <= entry.roll[1]
        );

        if (result) {
            // You could show this in a modal or notification
            console.log(`Rolled ${roll}: ${result.result}`);
            alert(`Rolled ${roll}: ${result.result}`);
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

    const renderSkillCard = (skillId, skill) => {
        const rank = getSkillRank(skillId);
        const modifier = getSkillModifier(skill);
        const quests = getAvailableQuests(skillId);
        const completedQuests = skillProgress[skillId]?.completedQuests || [];
        const isSelected = selectedSkill === skillId;

        return (
            <div
                key={skillId}
                className={`skill-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedSkill(isSelected ? null : skillId)}
            >
                <div className="skill-header">
                    <img src={skill.icon} alt={skill.name} className="skill-icon" />
                    <div className="skill-info">
                        <h3 className="skill-name" style={{ color: rank.color }}>
                            {skill.name}
                        </h3>
                        <p className="skill-description">{skill.description}</p>
                        <div className="skill-stats">
                            <span className="skill-rank">{rank.name}</span>
                            <span className="skill-modifier">+{modifier}</span>
                            <span className="skill-progress">
                                {completedQuests.length}/{quests.length} Quests
                            </span>
                        </div>
                    </div>
                    <div className="skill-actions">
                        {(skill.rollableTable || skill.rollableTables) && (
                            <button
                                className="roll-table-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    rollSkillTable(skill, skillId);
                                }}
                            >
                                🎲 Roll
                            </button>
                        )}
                    </div>
                </div>

                {isSelected && (
                    <div className="skill-details">
                        <div className="quest-section">
                            <h4>Available Quests</h4>
                            <div className="quest-list">
                                {quests.map(quest => {
                                    const isCompleted = completedQuests.includes(quest.id);
                                    return (
                                        <div
                                            key={quest.id}
                                            className={`quest-item ${isCompleted ? 'completed' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleQuest(skillId, quest.id);
                                            }}
                                        >
                                            <img src={quest.icon} alt={quest.name} className="quest-icon" />
                                            <div className="quest-info">
                                                <h5 className="quest-name">{quest.name}</h5>
                                                <p className="quest-description">{quest.description}</p>
                                                <div className="quest-unlocks">
                                                    <strong>Unlocks:</strong> {quest.unlocks.join(', ')}
                                                </div>
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
                            const currentTableId = getCurrentRollableTable(skill, skillId);
                            const currentTable = ROLLABLE_TABLES[currentTableId];
                            const rank = getSkillRank(skillId);

                            return currentTable && (
                                <div className="table-section">
                                    <h4>Rollable Table ({rank.name}): {currentTable.name}</h4>
                                    <p>{currentTable.description}</p>
                                    <div className="table-entries">
                                        {currentTable.table.map((entry, index) => (
                                            <div key={index} className={`table-entry ${entry.type}`}>
                                                <span className="roll-range">
                                                    {entry.roll[0]}-{entry.roll[1]}
                                                </span>
                                                <span className="roll-result">{entry.result}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="skills-container">
            <div className="skills-navigation">
                {Object.values(SKILL_CATEGORIES).map(category => (
                    <button
                        key={category.name}
                        className={`skills-nav-button ${activeCategory === category.name ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.name)}
                    >
                        <img src={category.icon} alt="" className="skills-nav-icon" />
                        <span className="skills-nav-text">{category.name}</span>
                    </button>
                ))}
            </div>

            <div className="skills-content">
                <div className="skills-section-header">
                    <img
                        src={SKILL_CATEGORIES[Object.keys(SKILL_CATEGORIES).find(key =>
                            SKILL_CATEGORIES[key].name === activeCategory
                        )].icon}
                        alt=""
                        className="skills-section-icon"
                    />
                    <h2 className="skills-section-title">{activeCategory}</h2>
                </div>

                <div className="skills-grid">
                    {categorySkills.map(([skillId, skill]) => renderSkillCard(skillId, skill))}
                </div>
            </div>
        </div>
    );
}