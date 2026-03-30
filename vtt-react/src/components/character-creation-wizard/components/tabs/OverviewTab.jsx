/**
 * OverviewTab - Displays overview information for selections
 * 
 * Used by Race, Class, Background, and Discipline selections
 */

import React from 'react';

const OverviewTab = ({
    description,
    flavorText,
    metaBadges = [],
    culturalBackground,
    basicInfo
}) => {
    return (
        <div className="selection-tab overview-tab">
            {flavorText && (
                <div className="overview-flavor">
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

            {culturalBackground && (
                <div className="overview-section">
                    <h5 className="section-title">
                        <i className="fas fa-book"></i> Cultural Background
                    </h5>
                    <p className="cultural-background-text">{culturalBackground}</p>
                </div>
            )}

            {basicInfo && (
                <div className="overview-section">
                    <h5 className="section-title">
                        <i className="fas fa-info-circle"></i> Basic Information
                    </h5>
                    <div className="basic-info-grid">
                        {Object.entries(basicInfo).map(([key, value]) => (
                            <div key={key} className="basic-info-item">
                                <span className="info-label">{key}:</span>
                                <span className="info-value">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;
