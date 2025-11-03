/**
 * Step 5: Discipline Selection
 *
 * Choose from 9 character disciplines (Mystic, Zealot, Trickster, etc.)
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { ENHANCED_PATHS } from '../../../data/enhancedPathData';
import { UnifiedSpellCard } from '../../spellcrafting-wizard/components/common';
import '../../spellcrafting-wizard/styles/pathfinder/main.css';
import '../../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import '../../rules/BackgroundSelector.css';

const Step5PathSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();

    const [selectedPath, setSelectedPath] = useState(state.characterData.path);
    const [viewingAbility, setViewingAbility] = useState(null);

    const paths = Object.values(ENHANCED_PATHS);
    const { validationErrors } = state;

    // Get selected path data
    const pathData = selectedPath ? ENHANCED_PATHS[selectedPath] : null;

    const handlePathSelect = (pathId) => {
        setSelectedPath(pathId);
        setViewingAbility(null);
        dispatch(wizardActionCreators.setPath(pathId));
    };

    const handleAbilityView = (abilityId) => {
        setViewingAbility(abilityId);
    };

    // Get icon URL helper
    const getIconUrl = (iconId) => {
        if (!iconId) return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
        return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
    };

    // Get all abilities from the discipline (should be exactly 3)
    const disciplineAbilities = pathData?.abilities || [];

    return (
        <div className="wizard-step-content">
            {/* Discipline Selection */}
            <div className="path-selection-section">
                <h3 className="step-title">
                    Select a Discipline
                </h3>
                <div className="background-grid">
                    {paths.map(path => (
                        <div
                            key={path.id}
                            className={`background-card ${selectedPath === path.id ? 'selected' : ''}`}
                            onClick={() => handlePathSelect(path.id)}
                        >
                            <div className="background-card-header-section">
                                <div className="background-card-title-section">
                                    <h4 className="background-card-name">{path.name}</h4>
                                    <p className="background-card-description">{path.description}</p>
                                </div>
                            </div>
                            {path.overview && (
                                <div className="background-card-overview-section">
                                    <div className="background-card-overview-divider"></div>
                                    <p className="background-card-overview">{path.overview}</p>
                                </div>
                            )}
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

            {/* Discipline Details and Abilities */}
            {pathData && (
                <div className="discipline-details-section">
                    {/* Overview Section */}
                    {pathData.overview && (
                        <div className="background-overview">
                            <h4>Overview</h4>
                            <p>{pathData.overview}</p>
                        </div>
                    )}

                    {/* Discipline-Level Mechanical Benefits */}
                    {pathData.mechanicalBenefits && (
                        <div className="mechanical-benefits">
                            <h4>{pathData.name} Discipline Passive Abilities</h4>
                            <div className="benefits-grid">
                                {pathData.mechanicalBenefits.map((benefit, index) => (
                                    <div key={index} className="benefit-card">
                                        <div className="benefit-header">
                                            <span className="benefit-name">{benefit.name}</span>
                                            <span className="benefit-type" data-type={benefit.type}>
                                                {benefit.type}
                                            </span>
                                        </div>
                                        <p className="benefit-description">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Discipline Abilities */}
                    <div className="ability-selection-section">
                        <h3 className="step-title">
                            {pathData.name} Discipline Abilities
                            {disciplineAbilities.length > 0 && (
                                <span className="ability-count-badge">({disciplineAbilities.length})</span>
                            )}
                        </h3>

                        {disciplineAbilities.length > 0 ? (
                            <div className="ability-selection-info">
                                <p>These are the abilities granted by the {pathData.name} discipline. Click an ability to view details.</p>
                            </div>
                        ) : (
                            <div className="ability-selection-info">
                                <p className="no-abilities-message">This discipline does not have abilities yet.</p>
                            </div>
                        )}

                        {/* Ability Icon Grid */}
                        {disciplineAbilities.length > 0 && (
                            <div className="ability-icon-grid">
                                {disciplineAbilities.map(ability => {
                                    const isViewing = viewingAbility === ability.id;

                                    return (
                                        <div
                                            key={ability.id}
                                            className={`ability-icon-card ${isViewing ? 'viewing' : ''}`}
                                            onClick={() => handleAbilityView(ability.id)}
                                            title={ability.name}
                                        >
                                            <div className="ability-icon-image">
                                                <img
                                                    src={getIconUrl(ability.icon)}
                                                    alt={ability.name}
                                                />
                                            </div>
                                            <div className="ability-icon-name">{ability.name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Ability Detail View */}
                        {viewingAbility && (
                                <div className="ability-detail-view">
                                    <div className="ability-detail-header">
                                        <h4>Ability Details</h4>
                                    </div>

                                    <div className="ability-detail-card">
                                        <UnifiedSpellCard
                                            spell={disciplineAbilities.find(a => a.id === viewingAbility)}
                                            variant="wizard"
                                            showDescription={true}
                                            showStats={true}
                                            showTags={true}
                                            showActions={false}
                                        />
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!selectedPath && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a discipline above to view details and abilities</p>
                </div>
            )}
        </div>
    );
};

export default Step5PathSelection;
