import React, { useState } from 'react';
import { SKILL_DEFINITIONS, SKILL_CATEGORIES, SKILL_RANKS } from '../../constants/skillDefinitions';
import { SKILL_QUESTS } from '../../constants/skillQuests';
import { ROLLABLE_TABLES } from '../../constants/rollableTables';
import './BackgroundSelector.css';

const SkillsDisplay = () => {
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Group skills by category
    const skillsByCategory = Object.entries(SKILL_DEFINITIONS).reduce((acc, [skillId, skillData]) => {
        const category = skillData.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ id: skillId, ...skillData });
        return acc;
    }, {});

    // Get category data
    const getCategoryData = (categoryName) => {
        return Object.values(SKILL_CATEGORIES).find(cat => cat.name === categoryName);
    };

    const handleSkillClick = (skill) => {
        setSelectedSkill(skill);
        setSelectedCategory(null);
    };

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        setSelectedSkill(null);
    };

    const handleBackClick = () => {
        if (selectedSkill) {
            setSelectedSkill(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
        }
    };

    // Step 1: Show all categories
    if (!selectedCategory && !selectedSkill) {
        return (
            <div className="background-selector">
                <div className="step-description">
                    <p>Skills represent your character's training and expertise in various areas. Each skill is tied to a primary and secondary ability score, and your proficiency in a skill adds your proficiency bonus to related checks.</p>
                </div>

                <div className="background-grid">
                    {Object.entries(skillsByCategory).map(([categoryName, skills]) => {
                        const categoryData = getCategoryData(categoryName);
                        return (
                            <div
                                key={categoryName}
                                className="background-card"
                                onClick={() => handleCategoryClick(categoryName)}
                            >
                                <div className="background-card-header">
                                    <h3>{categoryName}</h3>
                                </div>
                                <p className="background-description">
                                    {categoryData?.description || 'Skills in this category'}
                                </p>
                                <div className="info-badges">
                                    <span className="info-badge">
                                        <i className="fas fa-cogs"></i> {skills.length} Skills
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Step 2: Show skills in selected category
    if (selectedCategory && !selectedSkill) {
        const categorySkills = skillsByCategory[selectedCategory];
        const categoryData = getCategoryData(selectedCategory);

        return (
            <div className="background-selector">
                <button className="back-button" onClick={handleBackClick}>
                    <i className="fas fa-arrow-left"></i> Back to Categories
                </button>

                <div className="background-overview">
                    <h2>{selectedCategory}</h2>
                    <p>{categoryData?.description || 'Skills in this category'}</p>
                </div>

                <div className="background-grid">
                    {categorySkills.map((skill) => (
                        <div
                            key={skill.id}
                            className="background-card"
                            onClick={() => handleSkillClick(skill)}
                        >
                            <div className="background-card-header">
                                <h3>{skill.name}</h3>
                            </div>
                            <p className="background-description">{skill.description}</p>
                            <div className="info-badges">
                                <span className="info-badge">
                                    <i className="fas fa-dumbbell"></i> {skill.primaryStat?.toUpperCase() || 'N/A'}
                                </span>
                                {skill.secondaryStat && (
                                    <span className="info-badge">
                                        <i className="fas fa-plus"></i> {skill.secondaryStat.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Step 3: Show selected skill details
    if (selectedSkill) {
        // Get quests for this skill
        const skillQuests = SKILL_QUESTS[selectedSkill.id] || [];
        const startingQuests = skillQuests.filter(q => q.rank === 'NOVICE' || q.rank === 'APPRENTICE').slice(0, 3);

        // Get rollable table for this skill (UNTRAINED or NOVICE level)
        const rollableTableKey = selectedSkill.rollableTables?.UNTRAINED || selectedSkill.rollableTables?.NOVICE || selectedSkill.rollableTable;
        const rollableTable = rollableTableKey ? ROLLABLE_TABLES[rollableTableKey] : null;

        return (
            <div className="background-selector">
                <button className="back-button" onClick={handleBackClick}>
                    <i className="fas fa-arrow-left"></i> Back to {selectedCategory}
                </button>

                <div className="background-detail-view">
                    {/* Header */}
                    <div className="background-overview">
                        <h2>{selectedSkill.name}</h2>
                        <p>{selectedSkill.description}</p>
                    </div>

                    {/* Ability Scores */}
                    <div className="benefits-section">
                        <h4>Associated Ability Scores</h4>
                        <div className="benefits-grid">
                            <div className="benefit-card">
                                <div className="benefit-icon">
                                    <i className="fas fa-star"></i>
                                </div>
                                <div className="benefit-content">
                                    <h5 className="benefit-name">Primary: {selectedSkill.primaryStat?.toUpperCase() || 'None'}</h5>
                                    <p className="benefit-description">Main ability score for this skill</p>
                                </div>
                            </div>
                            {selectedSkill.secondaryStat && (
                                <div className="benefit-card">
                                    <div className="benefit-icon">
                                        <i className="fas fa-plus"></i>
                                    </div>
                                    <div className="benefit-content">
                                        <h5 className="benefit-name">Secondary: {selectedSkill.secondaryStat.toUpperCase()}</h5>
                                        <p className="benefit-description">Additional ability score that can apply</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="benefits-section">
                        <h4>Skill Category</h4>
                        <div className="feature-card">
                            <div className="feature-header">
                                <div className="feature-icon">
                                    <i className="fas fa-folder"></i>
                                </div>
                                <h5 className="feature-name">{selectedSkill.category}</h5>
                            </div>
                            <p className="feature-description">
                                {getCategoryData(selectedSkill.category)?.description || 'Part of this skill category'}
                            </p>
                        </div>
                    </div>

                    {/* Rollable Table Examples */}
                    {rollableTable && (
                        <div className="benefits-section">
                            <h4><i className="fas fa-dice-d20"></i> Example Roll Outcomes: {rollableTable.name}</h4>
                            <p style={{ marginBottom: '12px', color: '#5d4a37', fontSize: '14px' }}>
                                {rollableTable.description}
                            </p>
                            <div className="table-preview-entries">
                                {rollableTable.table.map((entry, index) => (
                                    <div key={index} className={`table-preview-entry ${entry.type}`}>
                                        <span className="roll-range">
                                            {entry.roll[0]}-{entry.roll[1]}
                                        </span>
                                        <span className="roll-result">{entry.result}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Starting Quests */}
                    {startingQuests.length > 0 && (
                        <div className="benefits-section">
                            <h4><i className="fas fa-tasks"></i> Example Starting Quests</h4>
                            <p style={{ marginBottom: '12px', color: '#5d4a37', fontSize: '14px' }}>
                                Complete quests during gameplay to unlock higher skill ranks and better outcomes!
                            </p>
                            <div className="quest-preview-list">
                                {startingQuests.map(quest => (
                                    <div key={quest.id} className="quest-preview-item">
                                        <img src={quest.icon} alt={quest.name} className="quest-preview-icon" />
                                        <div className="quest-preview-info">
                                            <strong>{quest.name}</strong>
                                            <p>{quest.description}</p>
                                            <div className="quest-unlocks">
                                                <i className="fas fa-unlock"></i> {quest.unlocks.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Usage Examples */}
                    <div className="benefits-section">
                        <h4>Common Uses</h4>
                        <ul className="equipment-items">
                            <li><i className="fas fa-check"></i> Make ability checks when attempting tasks related to this skill</li>
                            <li><i className="fas fa-check"></i> Add your proficiency bonus if you're proficient in this skill</li>
                            <li><i className="fas fa-check"></i> Use the primary ability score modifier for most checks</li>
                            <li><i className="fas fa-check"></i> GM may allow secondary ability score in specific situations</li>
                        </ul>
                    </div>

                    {/* How to Gain Proficiency */}
                    <div className="benefits-section">
                        <h4>Gaining Proficiency</h4>
                        <ul className="equipment-items">
                            <li><i className="fas fa-check"></i> Choose during character creation (2 skills from your class list)</li>
                            <li><i className="fas fa-check"></i> Gain from your background (automatically granted)</li>
                            <li><i className="fas fa-check"></i> Gain from your path/specialization (automatically granted)</li>
                            <li><i className="fas fa-check"></i> Gain from racial traits (some races grant specific skills)</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default SkillsDisplay;

