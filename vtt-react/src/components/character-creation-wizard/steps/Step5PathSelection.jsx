/**
 * Step 5: Path Selection
 *
 * Choose from 9 character paths (Mystic, Zealot, Trickster, etc.)
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getAllPaths, getPathData } from '../../../data/pathData';
import { getEquipmentPreview } from '../../../data/startingEquipmentData';

const Step5PathSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedPath, setSelectedPath] = useState(state.characterData.path);
    const [hoveredPath, setHoveredPath] = useState(null);

    const paths = getAllPaths() || [];
    const { validationErrors } = state;

    // Handle path selection
    const handlePathSelect = (pathId) => {
        setSelectedPath(pathId);
        dispatch(wizardActionCreators.setPath(pathId));
    };

    // Get path for preview (hovered or selected)
    const getPreviewPath = () => {
        const previewId = hoveredPath || selectedPath;
        return previewId ? getPathData(previewId) : null;
    };

    const previewPath = getPreviewPath();

    return (
        <div className="wizard-step-content">
            <div className="step-body">
                <div className="background-selection-layout">
                    {/* Left side - Path grid */}
                    <div className="background-grid-container">
                        <div className="background-grid">
                            {paths.map((path) => (
                                <div
                                    key={path.id}
                                    className={`background-card ${selectedPath === path.id ? 'selected' : ''}`}
                                    onClick={() => handlePathSelect(path.id)}
                                    onMouseEnter={() => setHoveredPath(path.id)}
                                    onMouseLeave={() => setHoveredPath(null)}
                                >
                                    <div className="background-icon">
                                        <i className={path.icon}></i>
                                    </div>
                                    <div className="background-info">
                                        <h3 className="background-name">{path.name}</h3>
                                        <p className="background-summary">
                                            {path.description.substring(0, 80)}...
                                        </p>
                                    </div>
                                    <div className="background-benefits">
                                        <div className="benefit-item">
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+{path.startingPoints} Points</span>
                                        </div>
                                        <div className="benefit-item">
                                            <i className="fas fa-cogs"></i>
                                            <span>{path.skillProficiencies.length} Skills</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {validationErrors.path && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-triangle"></i>
                                {validationErrors.path}
                            </div>
                        )}
                    </div>

                    {/* Right side - Path preview */}
                    <div className="background-preview">
                        {previewPath ? (
                            <div className="preview-card">
                                <div className="preview-header">
                                    <div className="preview-icon">
                                        <i className={previewPath.icon}></i>
                                    </div>
                                    <div className="preview-title-section">
                                        <h2 className="preview-title">{previewPath.name}</h2>
                                        <p className="preview-subtitle">Character Path</p>
                                    </div>
                                </div>

                                <div className="preview-content">
                                    <div className="preview-section">
                                        <h4>Description</h4>
                                        <p className="preview-description">
                                            {previewPath.description}
                                        </p>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Skill Proficiencies</h4>
                                        <div className="skill-list">
                                            {previewPath.skillProficiencies.map((skill, index) => (
                                                <span key={index} className="skill-tag">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {previewPath.toolProficiencies && (
                                        <div className="preview-section">
                                            <h4>Tool Proficiencies</h4>
                                            <div className="tool-list">
                                                {previewPath.toolProficiencies.map((tool, index) => (
                                                    <span key={index} className="tool-tag">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {previewPath.languages > 0 && (
                                        <div className="preview-section">
                                            <h4>Languages</h4>
                                            <p className="language-info">
                                                Choose {previewPath.languages} additional language{previewPath.languages > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    )}

                                    {previewPath.startingEquipment && (
                                        <div className="preview-section">
                                            <h4>Starting Equipment</h4>
                                            <ul className="equipment-list">
                                                {previewPath.startingEquipment.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="preview-section">
                                        <h4>Special Feature</h4>
                                        <div className="feature-info">
                                            <h5 className="feature-name">{previewPath.feature.name}</h5>
                                            <p className="feature-description">
                                                {previewPath.feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Point Allocation Bonus</h4>
                                        <div className="points-bonus">
                                            <i className="fas fa-star"></i>
                                            <span>
                                                +{previewPath.startingPoints} extra point{previewPath.startingPoints !== 1 ? 's' : ''} for stat allocation
                                            </span>
                                        </div>
                                    </div>

                                    {/* Starting Equipment Preview */}
                                    {(() => {
                                        const pathEquipment = getEquipmentPreview('path', previewPath.id);

                                        if (pathEquipment.count > 0) {
                                            return (
                                                <div className="preview-section">
                                                    <h4>
                                                        <i className="fas fa-shopping-bag"></i> Starting Equipment
                                                    </h4>
                                                    <p className="equipment-preview-text">
                                                        Unlocks <strong>{pathEquipment.count}</strong> path-specific item{pathEquipment.count !== 1 ? 's' : ''} for purchase
                                                    </p>
                                                    {pathEquipment.examples.length > 0 && (
                                                        <div className="equipment-examples">
                                                            <span className="examples-label">Examples:</span>
                                                            <span className="examples-list">
                                                                {pathEquipment.examples.join(', ')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <i className="fas fa-route"></i>
                                <h3>Select a Path</h3>
                                <p>Hover over or select a path to see its details and benefits.</p>
                            </div>
                        )}
                    </div>
                </div>


                </div>
            </div>
    );
};

export default Step5PathSelection;

