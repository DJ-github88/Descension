import React from 'react';

const FIELD_ICONS = {
    size: 'fas fa-expand-arrows-alt',
    speed: 'fas fa-running',
    lifespan: 'fas fa-hourglass-half',
    languages: 'fas fa-language',
    height: 'fas fa-ruler-vertical',
    weight: 'fas fa-weight-hanging',
    build: 'fas fa-user',
    alignment: 'fas fa-balance-scale',
    difficulty: 'fas fa-signal',
    primary: 'fas fa-crosshairs',
    role: 'fas fa-shield-alt',
    'hit die': 'fas fa-heart',
    'primary ability': 'fas fa-fist-raised',
    proficiency: 'fas fa-tools',
    source: 'fas fa-scroll',
    trait: 'fas fa-feather-alt',
    bonus: 'fas fa-gem',
};

const OverviewTab = ({
    description,
    flavorText,
    metaBadges = [],
    culturalBackground,
    basicInfo,
    subrace
}) => {
    const hasSubrace = subrace && (subrace.name || subrace.description || subrace.culturalBackground);

    return (
        <div className="selection-tab overview-tab">
            {flavorText && (
                <div className="overview-flavor">
                    <div className="flavor-decorator">
                        <i className="fas fa-quote-left"></i>
                    </div>
                    <p className="flavor-text">{flavorText}</p>
                </div>
            )}

            {description && !flavorText && (
                <div className="overview-description">
                    <p>{description}</p>
                </div>
            )}

            {metaBadges.length > 0 && (
                <div className="overview-meta-row">
                    {metaBadges.map((badge, index) => (
                        <span key={index} className="meta-badge">
                            <span className="meta-label">{badge.label}</span>
                            <span className="meta-value">{badge.value}</span>
                        </span>
                    ))}
                </div>
            )}

            {hasSubrace && (
                <div className="overview-subrace-panel">
                    <div className="overview-subrace-header">
                        <div className="overview-subrace-icon">
                            <i className="fas fa-dna"></i>
                        </div>
                        <div className="overview-subrace-title-block">
                            <span className="overview-subrace-label">Selected Subrace</span>
                            <h5 className="overview-subrace-name">{subrace.name}</h5>
                        </div>
                    </div>
                    {subrace.description && (
                        <p className="overview-subrace-description">{subrace.description}</p>
                    )}
                    {subrace.culturalBackground && (
                        <div className="overview-subrace-lore">
                            <span className="overview-subrace-lore-label">
                                <i className="fas fa-scroll"></i> Heritage
                            </span>
                            <p className="overview-subrace-lore-text">{subrace.culturalBackground}</p>
                        </div>
                    )}
                </div>
            )}

            {basicInfo && (
                <div className="overview-section">
                    <h5 className="section-title">
                        <i className="fas fa-info-circle"></i> Basic Information
                    </h5>
                    <div className="basic-info-grid">
                        {Object.entries(basicInfo).map(([key, value]) => (
                            <div key={key} className="basic-info-card">
                                <div className="basic-info-card-icon">
                                    <i className={FIELD_ICONS[key.toLowerCase()] || 'fas fa-info'}></i>
                                </div>
                                <div className="basic-info-card-content">
                                    <span className="basic-info-label">{key}</span>
                                    <span className="basic-info-value">{value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {culturalBackground && (
                <div className="overview-section overview-section-cultural">
                    <h5 className="section-title">
                        <i className="fas fa-book"></i> Cultural Background
                    </h5>
                    <div className="cultural-background-body">
                        <p className="cultural-background-text">{culturalBackground}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;
