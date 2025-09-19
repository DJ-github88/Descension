/**
 * Step 4: Background Selection
 * 
 * Choose from 9 custom backgrounds with unique benefits and features
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getAllCustomBackgrounds, getCustomBackgroundData } from '../../../data/customBackgroundData';

const Step4BackgroundSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedBackground, setSelectedBackground] = useState(state.characterData.background);
    const [hoveredBackground, setHoveredBackground] = useState(null);

    const backgrounds = getAllCustomBackgrounds();
    const { validationErrors } = state;

    // Handle background selection
    const handleBackgroundSelect = (backgroundId) => {
        setSelectedBackground(backgroundId);
        dispatch(wizardActionCreators.setBackground(backgroundId));
    };

    // Get background for preview (hovered or selected)
    const getPreviewBackground = () => {
        const previewId = hoveredBackground || selectedBackground;
        return previewId ? getCustomBackgroundData(previewId) : null;
    };

    const previewBackground = getPreviewBackground();

    return (
        <div className="wizard-step-content">
            <div className="step-body">
                <div className="background-selection-layout">
                    {/* Left side - Background grid */}
                    <div className="background-grid-container">
                        <div className="background-grid">
                            {backgrounds.map((background) => (
                                <div
                                    key={background.id}
                                    className={`background-card ${selectedBackground === background.id ? 'selected' : ''}`}
                                    onClick={() => handleBackgroundSelect(background.id)}
                                    onMouseEnter={() => setHoveredBackground(background.id)}
                                    onMouseLeave={() => setHoveredBackground(null)}
                                >
                                    <div className="background-icon">
                                        <i className={background.icon}></i>
                                    </div>
                                    <div className="background-info">
                                        <h3 className="background-name">{background.name}</h3>
                                        <p className="background-summary">
                                            {background.description.substring(0, 80)}...
                                        </p>
                                    </div>
                                    <div className="background-benefits">
                                        <div className="benefit-item">
                                            <i className="fas fa-plus-circle"></i>
                                            <span>+{background.startingPoints} Points</span>
                                        </div>
                                        <div className="benefit-item">
                                            <i className="fas fa-cogs"></i>
                                            <span>{background.skillProficiencies.length} Skills</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {validationErrors.background && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-triangle"></i>
                                {validationErrors.background}
                            </div>
                        )}
                    </div>

                    {/* Right side - Background preview */}
                    <div className="background-preview">
                        {previewBackground ? (
                            <div className="preview-card">
                                <div className="preview-header">
                                    <div className="preview-icon">
                                        <i className={previewBackground.icon}></i>
                                    </div>
                                    <h3 className="preview-title">{previewBackground.name}</h3>
                                </div>

                                <div className="preview-content">
                                    <div className="preview-section">
                                        <h4>Description</h4>
                                        <p className="background-description">
                                            {previewBackground.description}
                                        </p>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Stat Modifiers</h4>
                                        <div className="stat-modifiers">
                                            {Object.entries(previewBackground.statModifiers).map(([stat, modifier]) => (
                                                <div key={stat} className={`stat-modifier ${modifier >= 0 ? 'positive' : 'negative'}`}>
                                                    <span className="stat-name">{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                                                    <span className="stat-value">
                                                        {modifier >= 0 ? '+' : ''}{modifier}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Skill Proficiencies</h4>
                                        <div className="skill-list">
                                            {previewBackground.skillProficiencies.map((skill, index) => (
                                                <span key={index} className="skill-tag">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {previewBackground.toolProficiencies && (
                                        <div className="preview-section">
                                            <h4>Tool Proficiencies</h4>
                                            <div className="tool-list">
                                                {previewBackground.toolProficiencies.map((tool, index) => (
                                                    <span key={index} className="tool-tag">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {previewBackground.languages > 0 && (
                                        <div className="preview-section">
                                            <h4>Languages</h4>
                                            <p className="language-info">
                                                Choose {previewBackground.languages} additional language{previewBackground.languages > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    )}

                                    <div className="preview-section">
                                        <h4>Starting Equipment</h4>
                                        <ul className="equipment-list">
                                            {previewBackground.startingEquipment.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Special Feature</h4>
                                        <div className="feature-info">
                                            <h5 className="feature-name">{previewBackground.feature.name}</h5>
                                            <p className="feature-description">
                                                {previewBackground.feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Point Allocation Bonus</h4>
                                        <div className="points-bonus">
                                            <i className="fas fa-star"></i>
                                            <span>
                                                +{previewBackground.startingPoints} extra point{previewBackground.startingPoints !== 1 ? 's' : ''} for stat allocation
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <i className="fas fa-book"></i>
                                <h3>Select a Background</h3>
                                <p>Hover over or select a background to see its details and benefits.</p>
                            </div>
                        )}
                    </div>
                </div>


                </div>
            </div>
    );
};

export default Step4BackgroundSelection;
