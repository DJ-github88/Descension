/**
 * FeaturesTab - Displays class features or background features
 * 
 * Used by Class and Background selections
 */

import React from 'react';

const FeaturesTab = ({
    features = [],
    title = "Features"
}) => {
    if (!features || features.length === 0) {
        return (
            <div className="selection-tab features-tab">
                <div className="no-data-message">
                    <i className="fas fa-star"></i>
                    <p>No features available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="selection-tab features-tab">
            <h5 className="section-title">
                <i className="fas fa-star"></i> {title}
            </h5>
            <div className="features-list">
                {features.map((feature, index) => (
                    <div key={index} className="feature-bullet">
                        <i className="fas fa-chevron-right"></i>
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesTab;
