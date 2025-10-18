/**
 * Step 4: Background Selection
 *
 * Choose from standard D&D backgrounds (Acolyte, Sage, Soldier, etc.)
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { getAllBackgrounds, getBackgroundData } from '../../../data/backgroundData';
import { getEquipmentPreview } from '../../../data/startingEquipmentData';
import { getBackgroundAbilities } from '../../../data/backgroundAbilities';

const Step4BackgroundSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedBackground, setSelectedBackground] = useState(state.characterData.background);
    const [hoveredBackground, setHoveredBackground] = useState(null);

    const backgrounds = getAllBackgrounds() || [];
    const { validationErrors } = state;

    // Handle background selection
    const handleBackgroundSelect = (backgroundId) => {
        setSelectedBackground(backgroundId);
        dispatch(wizardActionCreators.setBackground(backgroundId));
    };

    // Get background for preview (hovered or selected)
    const getPreviewBackground = () => {
        const previewId = hoveredBackground || selectedBackground;
        return previewId ? getBackgroundData(previewId) : null;
    };

    const previewBackground = getPreviewBackground();

    return (
        <div className="wizard-step-content">
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
                                        <i className="fas fa-book"></i>
                                    </div>
                                    <div className="background-info">
                                        <h3 className="background-name">{background.name}</h3>
                                        <p className="background-summary">
                                            {background.description.substring(0, 80)}...
                                        </p>
                                    </div>
                                    <div className="background-benefits">
                                        <div className="benefit-item">
                                            <i className="fas fa-cogs"></i>
                                            <span>{background.skillProficiencies?.length || 0} Skills</span>
                                        </div>
                                        {background.languages > 0 && (
                                            <div className="benefit-item">
                                                <i className="fas fa-language"></i>
                                                <span>{background.languages} Language{background.languages > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                        {background.toolProficiencies && background.toolProficiencies.length > 0 && (
                                            <div className="benefit-item">
                                                <i className="fas fa-tools"></i>
                                                <span>{background.toolProficiencies.length} Tool{background.toolProficiencies.length > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
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
                                        <i className="fas fa-book"></i>
                                    </div>
                                    <div className="preview-title-section">
                                        <h2 className="preview-title">{previewBackground.name}</h2>
                                        <p className="preview-subtitle">Character Background</p>
                                    </div>
                                </div>

                                <div className="preview-content">
                                    <div className="preview-section">
                                        <h4>Description</h4>
                                        <p className="background-description">
                                            {previewBackground.description}
                                        </p>
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

                                    {previewBackground.toolProficiencies && previewBackground.toolProficiencies.length > 0 && (
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

                                    {previewBackground.equipment && previewBackground.equipment.length > 0 && (
                                        <div className="preview-section">
                                            <h4>Starting Equipment</h4>
                                            <ul className="equipment-list">
                                                {previewBackground.equipment.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="preview-section">
                                        <h4>Special Feature</h4>
                                        <div className="feature-info">
                                            <h5 className="feature-name">{previewBackground.feature.name}</h5>
                                            <p className="feature-description">
                                                {previewBackground.feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Background Abilities */}
                                    {(() => {
                                        const abilities = getBackgroundAbilities(previewBackground.id);
                                        if (abilities && abilities.length > 0) {
                                            return (
                                                <div className="preview-section">
                                                    <h4>Background Abilities</h4>
                                                    <div className="abilities-list">
                                                        {abilities.map((ability, index) => (
                                                            <div key={index} className="ability-item">
                                                                <div className="ability-header">
                                                                    <h5 className="ability-name">{ability.name}</h5>
                                                                    <div className="ability-meta">
                                                                        <span className={`ability-type ${ability.type.toLowerCase()}`}>
                                                                            {ability.type}
                                                                        </span>
                                                                        <span className="ability-usage">{ability.usage}</span>
                                                                    </div>
                                                                </div>
                                                                <p className="ability-description">
                                                                    {ability.description}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    {/* Starting Equipment Preview */}
                                    {(() => {
                                        const backgroundEquipment = getEquipmentPreview('background', previewBackground.id);

                                        if (backgroundEquipment.count > 0) {
                                            return (
                                                <div className="preview-section">
                                                    <h4>
                                                        <i className="fas fa-shopping-bag"></i> Starting Equipment
                                                    </h4>
                                                    <p className="equipment-preview-text">
                                                        Unlocks <strong>{backgroundEquipment.count}</strong> background-specific item{backgroundEquipment.count !== 1 ? 's' : ''} for purchase
                                                    </p>
                                                    {backgroundEquipment.examples.length > 0 && (
                                                        <div className="equipment-examples">
                                                            <span className="examples-label">Examples:</span>
                                                            <span className="examples-list">
                                                                {backgroundEquipment.examples.join(', ')}
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
                                <i className="fas fa-book"></i>
                                <h3>Select a Background</h3>
                                <p>Hover over or select a background to see its details and benefits.</p>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
};

export default Step4BackgroundSelection;
