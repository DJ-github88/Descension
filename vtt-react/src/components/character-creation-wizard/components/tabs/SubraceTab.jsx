/**
 * SubraceTab - Displays selected subrace details with mini-cards for switching
 * 
 * Used by Race selection
 */

import React from 'react';

const SubraceTab = ({
    subraces = [],
    selectedSubraceId = null,
    onSelectSubrace,
    raceName = ''
}) => {
    if (!subraces || subraces.length === 0) {
        return (
            <div className="selection-tab subrace-tab">
                <div className="no-data-message">
                    <i className="fas fa-users"></i>
                    <p>No subraces available</p>
                </div>
            </div>
        );
    }

    const selectedSubrace = subraces.find(s => s.id === selectedSubraceId) || subraces[0];
    const otherSubraces = subraces.filter(s => s.id !== selectedSubrace.id);

    const hasStatModifiers = selectedSubrace.statModifiers && Object.keys(selectedSubrace.statModifiers).length > 0;
    const hasTraits = selectedSubrace.traits && selectedSubrace.traits.length > 0;

    return (
        <div className="selection-tab subrace-tab">
            <div className="subrace-detail-card">
                <div className="subrace-detail-header">
                    <div className="subrace-detail-icon">
                        <i className="fas fa-dna"></i>
                    </div>
                    <div className="subrace-detail-title-row">
                        <h4 className="subrace-detail-name">{selectedSubrace.name}</h4>
                        <span className="subrace-detail-badge">{raceName} Subrace</span>
                    </div>
                </div>

                <div className="subrace-detail-description">
                    <p>{selectedSubrace.description}</p>
                </div>

                {hasStatModifiers && (
                    <div className="subrace-detail-section">
                        <h5 className="section-title">
                            <i className="fas fa-chart-bar"></i>
                            Stat Modifiers
                        </h5>
                        <div className="subrace-stat-modifiers">
                            {Object.entries(selectedSubrace.statModifiers).map(([stat, modifier]) => (
                                modifier !== 0 && (
                                    <div 
                                        key={stat} 
                                        className={`subrace-stat-mod ${modifier >= 0 ? 'positive' : 'negative'}`}
                                    >
                                        <span className="stat-name">{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                                        <span className="stat-value">{modifier >= 0 ? '+' : ''}{modifier}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}

                {hasTraits && (
                    <div className="subrace-detail-section">
                        <h5 className="section-title">
                            <i className="fas fa-star"></i>
                            Racial Traits
                        </h5>
                        <div className="subrace-traits-list">
                            {selectedSubrace.traits.map((trait, index) => (
                                <div key={index} className="subrace-trait-item">
                                    <div className="trait-icon">
                                        <i className="fas fa-chevron-right"></i>
                                    </div>
                                    <div className="trait-content">
                                        <span className="trait-name">{trait.name}</span>
                                        {trait.description && (
                                            <span className="trait-description">{trait.description}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {otherSubraces.length > 0 && (
                <div className="subrace-switcher">
                    <h5 className="section-title">
                        <i className="fas fa-exchange-alt"></i>
                        Other {raceName} Subraces
                    </h5>
                    <div className="subrace-mini-cards">
                        {otherSubraces.map((subrace) => (
                            <div
                                key={subrace.id}
                                className="subrace-mini-card"
                                onClick={() => onSelectSubrace(subrace)}
                            >
                                <div className="mini-card-header">
                                    <i className="fas fa-user"></i>
                                    <span className="mini-card-name">{subrace.name}</span>
                                </div>
                                <div className="mini-card-stats">
                                    {subrace.statModifiers && Object.entries(subrace.statModifiers).slice(0, 3).map(([stat, modifier]) => (
                                        modifier !== 0 && (
                                            <span 
                                                key={stat}
                                                className={`mini-stat ${modifier >= 0 ? 'pos' : 'neg'}`}
                                            >
                                                {stat.slice(0, 3)}: {modifier >= 0 ? '+' : ''}{modifier}
                                            </span>
                                        )
                                    ))}
                                </div>
                                <button className="mini-card-switch-btn">
                                    <i className="fas fa-exchange-alt"></i> Switch
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubraceTab;
