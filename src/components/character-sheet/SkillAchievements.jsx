import React from 'react';
import { SKILL_ACHIEVEMENTS, ACHIEVEMENT_DISPLAY } from '../../constants/achievementDefinitions';
import '../../styles/skill-achievements.css';

export default function SkillAchievements({ skillId, completedAchievements, onAchievementToggle }) {
    const achievements = SKILL_ACHIEVEMENTS[skillId] || [];

    if (achievements.length === 0) {
        return (
            <div className="skill-achievements-container">
                <div className="no-achievements">
                    No achievements available for this skill yet.
                </div>
            </div>
        );
    }

    const renderAchievement = (achievement) => {
        const isCompleted = completedAchievements.includes(achievement.id);
        
        return (
            <div 
                key={achievement.id}
                className={`achievement-item ${isCompleted ? 'completed' : ''}`}
                style={{
                    backgroundColor: ACHIEVEMENT_DISPLAY.backgroundColor,
                    borderColor: isCompleted ? 
                        ACHIEVEMENT_DISPLAY.completedColor : 
                        ACHIEVEMENT_DISPLAY.borderColor
                }}
            >
                <div className="achievement-header">
                    <div className="achievement-icon-container">
                        <img 
                            src={achievement.icon} 
                            alt={achievement.name}
                            className="achievement-icon"
                        />
                        {isCompleted && (
                            <div className="achievement-complete-overlay">
                                <span>✓</span>
                            </div>
                        )}
                    </div>
                    <div className="achievement-title">
                        <h4>{achievement.name}</h4>
                        <div className="achievement-points">{achievement.points} Experience Points</div>
                    </div>
                    <label className="achievement-checkbox">
                        <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => onAchievementToggle(achievement.id)}
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>
                <p className="achievement-description">
                    {achievement.description}
                </p>
            </div>
        );
    };

    return (
        <div className="skill-achievements-container">
            <div className="achievements-tree">
                {achievements.map((achievement) => renderAchievement(achievement))}
            </div>
        </div>
    );
}
