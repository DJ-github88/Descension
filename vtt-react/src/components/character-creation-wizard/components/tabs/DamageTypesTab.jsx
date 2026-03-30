/**
 * DamageTypesTab - Displays damage types for classes
 * 
 * Used by Class selection
 */

import React from 'react';

const DamageTypesTab = ({
    damageTypes = []
}) => {
    if (!damageTypes || damageTypes.length === 0) {
        return (
            <div className="selection-tab damage-types-tab">
                <div className="no-data-message">
                    <i className="fas fa-fire"></i>
                    <p>No damage types available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="selection-tab damage-types-tab">
            <h5 className="section-title">
                <i className="fas fa-magic"></i> Damage Types
            </h5>
            <div className="damage-type-tags">
                {damageTypes.map((type, index) => (
                    <span 
                        key={index} 
                        className={`damage-type-tag damage-type-${type.toLowerCase()}`}
                    >
                        {type}
                    </span>
                ))}
            </div>
            <p className="damage-types-hint">
                This class primarily deals damage of these types. Consider enemy resistances when choosing your class.
            </p>
        </div>
    );
};

export default DamageTypesTab;
