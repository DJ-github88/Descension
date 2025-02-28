import React, { useState } from 'react';
import useCharacterStore from '../../store/characterStore';
import { SKILL_DEFINITIONS, SKILL_CATEGORIES } from '../../constants/skillDefinitions';
import { SKILL_ACHIEVEMENTS, LEVEL_REQUIREMENTS } from '../../constants/achievementDefinitions';
import { calculateStatModifier } from '../../utils/characterUtils';
import SkillAchievements from './SkillAchievements';
import '../../styles/skills.css';

export default function Skills() {
    const { 
        stats, 
        equipmentBonuses,
        setSkillLevel,
        completedAchievements = {}
    } = useCharacterStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES.COMBAT.name);
    const [expandedSkill, setExpandedSkill] = useState(null);

    const calculateTotalExperience = (skillId) => {
        const achievements = completedAchievements[skillId] || [];
        return achievements.reduce((total, achievementId) => {
            const achievement = SKILL_ACHIEVEMENTS[skillId]?.find(a => a.id === achievementId);
            return total + (achievement?.points || 0);
        }, 0);
    };

    const getSkillLevelInfo = (skillId) => {
        const totalPoints = calculateTotalExperience(skillId);
        
        // Find current level and next level
        let currentLevel = 0;
        let nextLevel = 1;
        
        for (const [level, req] of Object.entries(LEVEL_REQUIREMENTS)) {
            if (totalPoints >= req.points) {
                currentLevel = parseInt(level);
                nextLevel = parseInt(level) + 1;
            }
        }

        const currentLevelReq = LEVEL_REQUIREMENTS[currentLevel];
        const nextLevelReq = LEVEL_REQUIREMENTS[nextLevel];

        // If at max level, show 100% progress
        if (!nextLevelReq) {
            return {
                name: currentLevelReq.name,
                color: currentLevelReq.color,
                progress: 100,
                totalPoints,
                currentPoints: totalPoints,
                nextLevelPoints: totalPoints
            };
        }

        // Calculate progress to next level
        const pointsIntoLevel = totalPoints - currentLevelReq.points;
        const pointsNeededForNext = nextLevelReq.points - currentLevelReq.points;
        const progress = (pointsIntoLevel / pointsNeededForNext) * 100;

        return {
            name: currentLevelReq.name,
            color: currentLevelReq.color,
            progress,
            totalPoints,
            currentPoints: pointsIntoLevel,
            nextLevelPoints: pointsNeededForNext
        };
    };

    const handleAchievementToggle = (skillId, achievementId) => {
        const currentAchievements = completedAchievements[skillId] || [];
        const newAchievements = currentAchievements.includes(achievementId)
            ? currentAchievements.filter(id => id !== achievementId)
            : [...currentAchievements, achievementId];
        
        // Update completed achievements
        useCharacterStore.setState(state => ({
            ...state,
            completedAchievements: {
                ...state.completedAchievements,
                [skillId]: newAchievements
            }
        }));
        
        // Update skill level based on achievements
        const newLevel = getSkillLevelInfo(skillId);
        setSkillLevel(skillId, newLevel.name);
    };

    const renderSkillRow = (skillId, definition) => {
        const levelInfo = getSkillLevelInfo(skillId);
        const modifier = calculateStatModifier(stats[definition.stat]);
        const isExpanded = expandedSkill === skillId;

        return (
            <div className={`skill-row ${isExpanded ? 'expanded' : ''}`} key={skillId}>
                <div className="skill-header" onClick={() => setExpandedSkill(isExpanded ? null : skillId)}>
                    <div className="expand-icon">
                        {isExpanded ? '▼' : '▶'}
                    </div>
                    <img 
                        src={definition.icon} 
                        alt={definition.name} 
                        className="skill-icon"
                    />
                    <div className="skill-info">
                        <div className="skill-name" style={{ color: levelInfo.color }}>
                            {definition.name}
                        </div>
                        <div className="skill-description">{definition.description}</div>
                    </div>
                    
                    <div className="skill-stat-container">
                        <div className="skill-stat">{definition.stat}</div>
                        <div className={`skill-modifier ${modifier < 0 ? 'negative' : ''}`}>
                            {modifier >= 0 ? `+${modifier}` : modifier}
                        </div>
                    </div>

                    <div className="skill-progress">
                        <div 
                            className="skill-progress-bar"
                            style={{ width: `${levelInfo.progress}%` }}
                        />
                        <div className="skill-progress-text">
                            {levelInfo.currentPoints}/{levelInfo.nextLevelPoints} Experience
                        </div>
                    </div>
                </div>
                {isExpanded && (
                    <div className="skill-achievements-wrapper">
                        <SkillAchievements
                            skillId={skillId}
                            completedAchievements={completedAchievements[skillId] || []}
                            onAchievementToggle={(achievementId) => handleAchievementToggle(skillId, achievementId)}
                        />
                    </div>
                )}
            </div>
        );
    };

    const filteredSkills = Object.entries(SKILL_DEFINITIONS)
        .filter(([_, definition]) => definition.category === activeCategory)
        .filter(([_, definition]) => 
            !searchTerm || 
            definition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            definition.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="skills-container">
            <div className="skills-header">
                <div className="skills-tabs">
                    {Object.values(SKILL_CATEGORIES).map(category => (
                        <button
                            key={category.name}
                            className={`skill-tab ${activeCategory === category.name ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.name)}
                        >
                            <img src={category.icon} alt="" className="skill-tab-icon" />
                            {category.name}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    className="skill-search"
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="skills-content">
                {filteredSkills.map(([skillId, definition]) => renderSkillRow(skillId, definition))}
            </div>
        </div>
    );
}
