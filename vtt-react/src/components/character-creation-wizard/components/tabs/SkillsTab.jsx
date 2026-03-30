/**
 * SkillsTab - Displays skill and tool proficiencies
 * 
 * Used by Background selection
 */

import React from 'react';

const SkillsTab = ({
    skillProficiencies = [],
    toolProficiencies = [],
    languages = 0,
    languageList = []
}) => {
    const hasContent = skillProficiencies.length > 0 || 
                       toolProficiencies.length > 0 || 
                       languages > 0;

    if (!hasContent) {
        return (
            <div className="selection-tab skills-tab">
                <div className="no-data-message">
                    <i className="fas fa-brain"></i>
                    <p>No skill proficiencies available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="selection-tab skills-tab">
            {skillProficiencies.length > 0 && (
                <div className="skills-section">
                    <h5 className="section-title">
                        <i className="fas fa-brain"></i> Skill Proficiencies
                    </h5>
                    <div className="skill-tags">
                        {skillProficiencies.map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {toolProficiencies.length > 0 && (
                <div className="skills-section">
                    <h5 className="section-title">
                        <i className="fas fa-tools"></i> Tool Proficiencies
                    </h5>
                    <div className="tool-tags">
                        {toolProficiencies.map((tool, index) => (
                            <span key={index} className="tool-tag">{tool}</span>
                        ))}
                    </div>
                </div>
            )}

            {languages > 0 && (
                <div className="skills-section">
                    <h5 className="section-title">
                        <i className="fas fa-language"></i> Languages
                    </h5>
                    <div className="language-info">
                        <span className="language-count">
                            +{languages} additional language{languages > 1 ? 's' : ''}
                        </span>
                        {languageList.length > 0 && (
                            <div className="language-list">
                                {languageList.map((lang, index) => (
                                    <span key={index} className="language-tag">{lang}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillsTab;
