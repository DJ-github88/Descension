import React from 'react';

const StepTooltip = ({ name, icon, description }) => {
    return (
        <div className="wow-progress-tooltip">
            <div className="tooltip-header">
                <img 
                    src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`}
                    alt={name}
                    className="tooltip-icon"
                />
                <span className="tooltip-title">{name}</span>
            </div>
            <div className="tooltip-description">
                {description}
            </div>
        </div>
    );
};

export default StepTooltip;