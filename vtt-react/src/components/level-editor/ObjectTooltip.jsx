import React from 'react';
import { OBJECT_TYPES, WALL_TYPES } from '../../store/levelEditorStore';
import './styles/TileTooltip.css';

const ObjectTooltip = ({ 
    object, 
    objectType, 
    mouseX, 
    mouseY, 
    visible 
}) => {
    if (!visible || !object || !objectType) {
        return null;
    }

    // Calculate tooltip position to keep it on screen
    const tooltipStyle = {
        left: mouseX + 15,
        top: mouseY - 10,
        transform: mouseX > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
    };

    // Get object state information
    const currentState = object.state || objectType.states?.[0] || 'default';
    const hasStates = objectType.states && objectType.states.length > 1;

    // Get object description based on type and state
    const getObjectDescription = () => {
        const baseDescription = objectType.description || `A ${objectType.name.toLowerCase()}`;
        
        if (hasStates) {
            switch (objectType.id) {
                case 'door':
                    return currentState === 'open' 
                        ? 'An open doorway allowing passage'
                        : 'A closed door blocking passage';
                default:
                    return `${baseDescription} (${currentState})`;
            }
        }
        
        return baseDescription;
    };

    // Get interaction hints
    const getInteractionHint = () => {
        if (hasStates) {
            switch (objectType.id) {
                case 'door':
                    return currentState === 'open' ? 'Click to close' : 'Click to open';
                default:
                    return 'Click to change state';
            }
        }
        return null;
    };

    return (
        <div className="tile-tooltip unified-tooltip-style" style={tooltipStyle}>
            <div className="tooltip-content">
                {/* Object name */}
                <div className="tooltip-item">
                    <strong>{objectType.name}</strong>
                </div>

                {/* Object state if applicable */}
                {hasStates && (
                    <div className="tooltip-item">
                        State: {currentState}
                    </div>
                )}

                {/* Object description */}
                <div className="tooltip-item">
                    {getObjectDescription()}
                </div>

                {/* Interaction hint */}
                {getInteractionHint() && (
                    <div className="tooltip-item" style={{ 
                        fontStyle: 'italic', 
                        color: '#666',
                        fontSize: '11px' 
                    }}>
                        {getInteractionHint()}
                    </div>
                )}

                {/* Object properties */}
                {objectType.properties && Object.keys(objectType.properties).length > 0 && (
                    <div className="tooltip-item">
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                            {Object.entries(objectType.properties).map(([key, value]) => (
                                <div key={key}>
                                    {key}: {value}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObjectTooltip;
