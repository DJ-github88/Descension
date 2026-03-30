import React from 'react';
import useCraftingStore, { PROFESSIONS, SKILL_LEVELS } from '../../store/craftingStore';
import { getIconUrl } from '../../utils/assetManager';

function ProfessionSelection({ onProfessionSelect, selectedProfession }) {
    const { professionLevels, getProfessionLevel } = useCraftingStore();

    const getSkillLevelName = (level) => {
        const skillLevel = Object.values(SKILL_LEVELS).find(skill => skill.level === level);
        return skillLevel ? skillLevel.name : 'Unknown';
    };

    const getSkillLevelColor = (level) => {
        if (level === 0) return '#9d9d9d'; // Gray for untrained
        if (level <= 2) return '#ffffff'; // White for novice/apprentice
        if (level <= 4) return '#1eff00'; // Green for journeyman/expert
        if (level <= 6) return '#0070dd'; // Blue for adept/master
        if (level <= 8) return '#a335ee'; // Purple for grandmaster/legendary
        return '#ff8000'; // Orange for mythic
    };

    return (
        <div className="profession-selection">
            <div className="profession-selection-header">
                <h2>Choose Your Craft</h2>
                <p>Select a profession to begin crafting. Each profession offers unique recipes and rewards.</p>
            </div>
            
            <div className="profession-grid">
                {Object.values(PROFESSIONS).map(profession => {
                    const currentLevel = (typeof getProfessionLevel === 'function')
                        ? getProfessionLevel(profession.id)
                        : (professionLevels?.[profession.id] ?? SKILL_LEVELS.UNTRAINED.level);
                    const skillLevelName = getSkillLevelName(currentLevel);
                    const skillColor = getSkillLevelColor(currentLevel);
                    const isImplemented = profession.implemented;
                    
                    return (
                        <div 
                            key={profession.id}
                            className={`profession-card ${!isImplemented ? 'not-implemented' : ''} ${selectedProfession === profession.id ? 'selected' : ''}`}
                            data-profession={profession.id}
                            onClick={() => isImplemented && onProfessionSelect(profession.id)}
                        >
                            <div className="profession-icon">
                                <img 
                                    src={getIconUrl(profession.icon, 'items')}
                                    alt={profession.name}
                                    onError={(e) => {
                                        e.target.src = getIconUrl('inv_misc_questionmark', 'items');
                                    }}
                                />
                                {!isImplemented && (
                                    <div className="coming-soon-overlay">
                                        <span>Coming Soon</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="profession-info">
                                <h3 className="profession-name">{profession.name}</h3>
                                <p className="profession-description">{profession.description}</p>
                                
                                <div className="profession-skill">
                                    <span 
                                        className="skill-level"
                                        style={{ color: skillColor }}
                                    >
                                        {skillLevelName}
                                    </span>
                                    {currentLevel > 0 && (
                                        <span className="skill-bonus">
                                            (+{currentLevel} bonus)
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {isImplemented && (
                                <div className="profession-action">
                                    <button className="wow-button profession-select-btn">
                                        {currentLevel > 0 ? 'Continue Crafting' : 'Start Learning'}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            <div className="profession-selection-footer">
                <div className="skill-level-legend">
                    <h4>Skill Levels</h4>
                    <div className="legend-items">
                        {Object.values(SKILL_LEVELS).map(skill => (
                            <div key={skill.level} className="legend-item">
                                <span 
                                    className="legend-color"
                                    style={{ backgroundColor: getSkillLevelColor(skill.level) }}
                                ></span>
                                <span className="legend-name">{skill.name}</span>
                                <span className="legend-bonus">+{skill.bonus}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfessionSelection;
