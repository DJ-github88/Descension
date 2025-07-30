import React, { useState, useEffect } from 'react';
import { PROFESSIONAL_OBJECTS } from '../objects/ObjectSystem';
import { WOW_ICON_BASE_URL } from '../../item-generation/wowIcons';
import './styles/ObjectTools.css';

const ObjectTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedObjectType, setSelectedObjectType] = useState('gmNotes');
    const [objectRotation, setObjectRotation] = useState(0);
    const [objectScale, setObjectScale] = useState(1);

    // Object categories for organization
    const objectCategories = {
        gm: {
            name: 'GM Tools',
            icon: 'inv_misc_note_02',
            objects: ['gmNotes']
        }
    };

    // Tool configurations
    const objectTools = [
        {
            id: 'object_place',
            name: 'Place Object',
            icon: 'inv_misc_bag_08',
            description: 'Place objects on the grid'
        },
        {
            id: 'object_select',
            name: 'Select Object',
            icon: 'ability_hunter_markedfordeath',
            description: 'Select and manipulate objects'
        },
        {
            id: 'object_rotate',
            name: 'Rotate Object',
            icon: 'ability_warrior_cleave',
            description: 'Rotate selected objects'
        },
        {
            id: 'object_scale',
            name: 'Scale Object',
            icon: 'spell_nature_polymorph',
            description: 'Scale selected objects'
        },
        {
            id: 'object_delete',
            name: 'Delete Object',
            icon: 'ability_warrior_sunder',
            description: 'Remove objects from the grid'
        }
    ];

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);

        // Auto-select GM Notes when Place Object is selected (since it's the only object)
        if (toolId === 'object_place') {
            const availableObjects = Object.keys(PROFESSIONAL_OBJECTS);
            if (availableObjects.length === 1) {
                setSelectedObjectType(availableObjects[0]);
                onSettingsChange({
                    selectedObjectType: availableObjects[0],
                    objectRotation,
                    objectScale
                });
                return;
            }
        }

        updateSettings();
    };

    const handleObjectSelect = (objectId) => {
        setSelectedObjectType(objectId);
        // Pass the new value directly since state updates are async
        onSettingsChange({
            selectedObjectType: objectId,
            objectRotation,
            objectScale
        });
    };

    const handleRotationChange = (rotation) => {
        setObjectRotation(rotation);
        // Pass the new value directly since state updates are async
        onSettingsChange({
            selectedObjectType,
            objectRotation: rotation,
            objectScale
        });
    };

    const handleScaleChange = (scale) => {
        setObjectScale(scale);
        // Pass the new value directly since state updates are async
        onSettingsChange({
            selectedObjectType,
            objectRotation,
            objectScale: scale
        });
    };

    const updateSettings = () => {
        onSettingsChange({
            selectedObjectType,
            objectRotation,
            objectScale
        });
    };

    // Initialize settings on mount
    useEffect(() => {
        onSettingsChange({
            selectedObjectType,
            objectRotation,
            objectScale
        });
    }, []); // Only run on mount

    return (
        <div className="object-tools">
            {/* Quick Action Tools */}
            <div className="tool-section">
                <h4>Quick Actions</h4>
                <div className="quick-actions">
                    <button
                        className={`action-btn primary ${selectedTool === 'object_place' ? 'active' : ''}`}
                        onClick={() => handleToolSelect('object_place')}
                        title="Place objects on the grid"
                    >
                        Place Object
                    </button>
                    <button
                        className={`action-btn ${selectedTool === 'object_select' ? 'active' : ''}`}
                        onClick={() => handleToolSelect('object_select')}
                        title="Select and manipulate objects"
                    >
                        Select
                    </button>
                    <button
                        className={`action-btn danger ${selectedTool === 'object_delete' ? 'active' : ''}`}
                        onClick={() => handleToolSelect('object_delete')}
                        title="Remove objects from the grid"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Object Selection */}
            {selectedTool === 'object_place' && (
                <div className="tool-section">
                    <h4>Select Object to Place</h4>
                    <div className="objects-list">
                        {Object.entries(PROFESSIONAL_OBJECTS).map(([objectId, obj]) => (
                            <div
                                key={objectId}
                                className={`object-card ${selectedObjectType === objectId ? 'selected' : ''}`}
                                onClick={() => handleObjectSelect(objectId)}
                            >
                                <div className="object-card-content">
                                    <img
                                        src={`${WOW_ICON_BASE_URL}${obj.icon}.jpg`}
                                        alt={obj.name}
                                        className="object-card-icon"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${WOW_ICON_BASE_URL}inv_misc_questionmark.jpg`;
                                        }}
                                    />
                                    <div className="object-card-info">
                                        <h5 className="object-card-name">{obj.name}</h5>
                                        <p className="object-card-description">{obj.description}</p>
                                        {obj.gmOnly && (
                                            <span className="gm-only-badge">GM Only</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}






        </div>
    );
};

export default ObjectTools;
