import React, { useState } from 'react';
import { SKILL_DEFINITIONS, SKILL_CATEGORIES, SKILL_RANKS } from '../../constants/skillDefinitions';
import { SKILL_QUESTS } from '../../constants/skillQuests';
import { ROLLABLE_TABLES } from '../../constants/rollableTables';
import './BackgroundSelector.css';

const SkillsDisplay = () => {
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDie, setSelectedDie] = useState('d20'); // Default to d20 (hardest)

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
                <div className="skill-categories-view">
                    <div className="skills-explanation-box">
                        <h3><i className="fas fa-book"></i> How Skills Work</h3>
                        <div className="skills-explanation-content">
                            <div className="skill-explain-section">
                                <h4>Making Skill Checks</h4>
                                <p>Your GM determines difficulty and tells you which die to roll (d4 for very easy up to d20 for very difficult). Add your <strong>primary</strong> and <strong>secondary</strong> ability modifiers plus your rank bonus to the roll.</p>
                            </div>
                            <div className="skill-explain-section">
                                <h4>Ranks & Quests</h4>
                                <p>Skills have seven ranks: <strong>Untrained → Novice → Trained → Apprentice → Adept → Expert → Master</strong>. Complete skill quests during gameplay to advance ranks and unlock better rollable table outcomes.</p>
                            </div>
                            <div className="skill-explain-section">
                                <h4>Critical Results</h4>
                                <p>Rolling <strong>maximum</strong> (e.g., 20 on d20) = critical success with exceptional results. Rolling <strong>minimum</strong> (1) = critical failure with complications. Check rollable tables for all possible outcomes.</p>
                            </div>
                        </div>
                    </div>

                    <div className="skill-categories-simple">
                        {Object.entries(skillsByCategory).map(([categoryName, skills]) => {
                            const categoryData = getCategoryData(categoryName);
                            return (
                                <div
                                    key={categoryName}
                                    className="skill-category-simple-card"
                                    onClick={() => handleCategoryClick(categoryName)}
                                >
                                    <div className="skill-category-simple-header">
                                        <h3>{categoryName}</h3>
                                        <span className="skill-count-badge">{skills.length} skills</span>
                                    </div>
                                    <p className="skill-category-simple-desc">
                                        {categoryData?.description || 'Skills in this category'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
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
                <div className="skill-list-view">
                    <button className="back-button" onClick={handleBackClick}>
                        <i className="fas fa-arrow-left"></i> Back to Categories
                    </button>

                    <div className="category-header-compact">
                        <h2>{selectedCategory}</h2>
                        <p>{categoryData?.description || 'Skills in this category'}</p>
                    </div>

                    <div className="skills-compact-grid">
                        {categorySkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="skill-compact-card"
                                onClick={() => handleSkillClick(skill)}
                            >
                                <div className="skill-compact-header">
                                    <h4>{skill.name}</h4>
                                    <div className="skill-compact-stats">
                                        <span className="stat-badge primary" title="Primary Stat">
                                            <i className="fas fa-star"></i> {skill.primaryStat?.toUpperCase() || 'N/A'}
                                        </span>
                                        {skill.secondaryStat && (
                                            <span className="stat-badge secondary" title="Secondary Stat">
                                                <i className="fas fa-plus"></i> {skill.secondaryStat.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="skill-compact-description">{skill.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Step 3: Show selected skill details
    if (selectedSkill) {
        // Get quests for this skill
        const skillQuests = SKILL_QUESTS[selectedSkill.id] || [];
        const startingQuests = skillQuests.filter(q => q.rank === 'NOVICE' || q.rank === 'APPRENTICE').slice(0, 3);

        // Check if this skill uses the new multi-dimensional table structure
        const rankTables = selectedSkill.rollableTables?.UNTRAINED || selectedSkill.rollableTables?.NOVICE;
        const hasMultiDieTables = rankTables && typeof rankTables === 'object' && rankTables.d4;

        // Get rollable table for this skill
        let rollableTableKey;
        if (hasMultiDieTables) {
            // New structure: use selected die
            rollableTableKey = rankTables[selectedDie];
        } else {
            // Old structure: just use the rank table
            rollableTableKey = selectedSkill.rollableTables?.UNTRAINED || selectedSkill.rollableTables?.NOVICE || selectedSkill.rollableTable;
        }
        const rollableTable = rollableTableKey ? ROLLABLE_TABLES[rollableTableKey] : null;

        return (
            <div className="background-selector">
                <button className="back-button" onClick={handleBackClick}>
                    <i className="fas fa-arrow-left"></i> Back to {selectedCategory}
                </button>

                <div className="skill-detail-view">
                    {/* Simple Clean Header */}
                    <div className="skill-simple-header">
                        <div className="skill-name-line">
                            <h2>{selectedSkill.name}</h2>
                            <span className="skill-category-label">{selectedSkill.category}</span>
                        </div>
                        <p className="skill-desc-line">{selectedSkill.description}</p>
                        <div className="skill-stats-line">
                            <span className="stat-label">
                                <i className="fas fa-star"></i> Primary: <strong>{selectedSkill.primaryStat?.toUpperCase() || 'N/A'}</strong>
                            </span>
                            {selectedSkill.secondaryStat && (
                                <span className="stat-label">
                                    <i className="fas fa-plus"></i> Secondary: <strong>{selectedSkill.secondaryStat.toUpperCase()}</strong>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Rollable Table Examples */}
                    {rollableTable && (
                        <div className="benefits-section">
                            <h4><i className="fas fa-dice-d20"></i> Example Roll Outcomes: {rollableTable.name}</h4>
                            <p style={{ marginBottom: '14px', color: '#2c1810', fontSize: '15px', fontWeight: '500', lineHeight: '1.6' }}>
                                {rollableTable.description}
                            </p>

                            {/* Die Selector for multi-die skills */}
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

                            <div className="table-preview-entries">
                                {rollableTable.table.map((entry, index) => (
                                    <div key={index} className={`table-preview-entry ${entry.type}`}>
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
                    )}

                    {/* Starting Quests */}
                    {startingQuests.length > 0 && (
                        <div className="benefits-section">
                            <h4><i className="fas fa-tasks"></i> Example Starting Quests</h4>
                            <p style={{ marginBottom: '14px', color: '#2c1810', fontSize: '15px', fontWeight: '500', lineHeight: '1.6' }}>
                                Complete quests during gameplay to unlock higher skill ranks and better outcomes!
                            </p>
                            <div className="quest-preview-list">
                                {startingQuests.map(quest => (
                                    <div key={quest.id} className="quest-preview-item">
                                        <img src={quest.icon} alt={quest.name} className="quest-preview-icon" />
                                        <div className="quest-preview-info">
                                            <strong>{quest.name}</strong>
                                            <p>{quest.description}</p>
                                            {quest.unlocks && quest.unlocks.length > 0 && (
                                                <div className="quest-unlocks">
                                                    <i className="fas fa-unlock"></i> {quest.unlocks.join(', ')}
                                                </div>
                                            )}
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

