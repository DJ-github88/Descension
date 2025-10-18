/**
 * Step 5: Path Selection
 *
 * Choose from 9 character paths (Mystic, Zealot, Trickster, etc.)
 * Then select a specialization (sub-path) and choose 1 ability
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
    const [selectedSubPath, setSelectedSubPath] = useState(state.characterData.subPath);
    const [selectedAbilities, setSelectedAbilities] = useState(state.characterData.selectedAbilities || []);
    const [viewingAbility, setViewingAbility] = useState(null);

    const paths = Object.values(ENHANCED_PATHS);
    const { validationErrors } = state;

    // Get selected path data
    const pathData = selectedPath ? ENHANCED_PATHS[selectedPath] : null;
    const subPathData = selectedSubPath && pathData
        ? pathData.subPaths[selectedSubPath]
        : null;

    const handlePathSelect = (pathId) => {
        setSelectedPath(pathId);
        setSelectedSubPath(''); // Reset sub-path when path changes
        setSelectedAbilities([]); // Reset ability selection
        setViewingAbility(null); // Reset viewing
        dispatch(wizardActionCreators.setPath(pathId));
    };

    const handleSubPathSelect = (subPathId) => {
        setSelectedSubPath(subPathId);
        setSelectedAbilities([]); // Reset ability selection when sub-path changes
        setViewingAbility(null); // Reset viewing
        dispatch(wizardActionCreators.setSubPath(subPathId));

        // Auto-select first ability for viewing
        const subPath = pathData?.subPaths[subPathId];
        if (subPath?.abilities?.length > 0) {
            setViewingAbility(subPath.abilities[0].id);
        }
    };

    const handleAbilityToggle = (abilityId) => {
        const newAbilities = selectedAbilities.includes(abilityId)
            ? [] // Remove if already selected (only 1 allowed)
            : [abilityId]; // Select this one (replace any previous selection)

        setSelectedAbilities(newAbilities);
        dispatch(wizardActionCreators.setSelectedAbilities(newAbilities));
    };

    const handleAbilityView = (abilityId) => {
        setViewingAbility(abilityId);
    };

    // Get icon URL helper
    const getIconUrl = (iconId) => {
        if (!iconId) return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
        return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
    };

    return (
        <div className="wizard-step-content">
            {/* Step 1: Path Selection */}
            <div className="path-selection-section">
                <h3 className="step-title">
                    Select a Path
                </h3>
                <div className="background-grid">
                    {paths.map(path => (
                        <div
                            key={path.id}
                            className={`background-card ${selectedPath === path.id ? 'selected' : ''}`}
                            onClick={() => handlePathSelect(path.id)}
                        >
                            <div className="background-card-icon">
                                <i className={path.icon}></i>
                            </div>
                            <h4 className="background-card-name">{path.name}</h4>
                            <p className="background-card-description">{path.description}</p>
                            <div className="background-card-info">
                                <span className="info-badge">
                                    <i className="fas fa-users"></i>
                                    {Object.keys(path.subPaths).length} Specializations
                                </span>
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

            {/* Step 2: Sub-Path Selection */}
            {pathData && (
                <div className="subpath-selection-section">
                    <h3 className="step-title">
                        Select a Specialization
                    </h3>

                    {/* Overview Section */}
                    <div className="background-overview">
                    <h4>Overview</h4>
                    <p>{pathData.overview}</p>
                </div>

                {/* Path-Level Mechanical Benefits */}
                {pathData.mechanicalBenefits && (
                    <div className="mechanical-benefits">
                        <h4>{pathData.name} Path Passive Abilities</h4>
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

                {/* Sub-Path Cards */}
                <div className="sub-background-grid">
                    {Object.entries(pathData.subPaths).map(([subPathId, subPath]) => (
                        <div
                            key={subPathId}
                            className={`sub-background-card ${selectedSubPath === subPathId ? 'selected' : ''}`}
                            onClick={() => handleSubPathSelect(subPathId)}
                        >
                            <div className="sub-background-icon">
                                <i className={subPath.icon}></i>
                            </div>
                            <h4 className="sub-background-name">{subPath.name}</h4>
                            <p className="sub-background-description">{subPath.description}</p>
                            <div className="sub-background-theme">
                                <strong>Theme:</strong> {subPath.theme}
                            </div>
                            <div className="sub-background-abilities-count">
                                {subPath.abilities.length} abilities available
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subpath-Specific Mechanical Benefits - Show for selected subpath */}
                {selectedSubPath && pathData.subPaths[selectedSubPath]?.mechanicalBenefits && (
                    <div className="mechanical-benefits">
                        <h4>{pathData.subPaths[selectedSubPath].name} Specialization Passive Abilities</h4>
                        <div className="benefits-grid">
                            {pathData.subPaths[selectedSubPath].mechanicalBenefits.map((benefit, index) => (
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

                {validationErrors.subPath && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        {validationErrors.subPath}
                    </div>
                )}
            </div>
            )}

            {/* Step 3: Ability Selection - Icon Grid + Detail View */}
            {subPathData && (
                <div className="ability-selection-section">
                    <h3 className="step-title">
                        Choose Your Ability
                    </h3>

                    <div className="ability-selection-info">
                    <p>Select 1 ability from the {subPathData.name} specialization pool. Click an ability to view details.</p>
                    <div className="selection-counter">
                        Your Selection ({selectedAbilities.length}/1)
                    </div>
                </div>

                {/* Ability Icon Grid */}
                <div className="ability-icon-grid">
                    {subPathData.abilities.map(ability => {
                        const isSelected = selectedAbilities.includes(ability.id);
                        const isViewing = viewingAbility === ability.id;

                        return (
                            <div
                                key={ability.id}
                                className={`ability-icon-card ${isSelected ? 'selected' : ''} ${isViewing ? 'viewing' : ''}`}
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
                                {isSelected && (
                                    <div className="ability-icon-selected-badge">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Ability Detail View */}
                {viewingAbility && (
                    <div className="ability-detail-view">
                        <div className="ability-detail-header">
                            <h4>Ability Details</h4>
                            <div className="ability-detail-actions">
                                {selectedAbilities.includes(viewingAbility) ? (
                                    <button
                                        className="ability-deselect-button"
                                        onClick={() => handleAbilityToggle(viewingAbility)}
                                    >
                                        <i className="fas fa-times-circle"></i> Deselect
                                    </button>
                                ) : (
                                    <button
                                        className="ability-select-button"
                                        onClick={() => handleAbilityToggle(viewingAbility)}
                                        disabled={selectedAbilities.length >= 1}
                                    >
                                        <i className="fas fa-check-circle"></i> Select Ability
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="ability-detail-card">
                            <UnifiedSpellCard
                                spell={subPathData.abilities.find(a => a.id === viewingAbility)}
                                variant="wizard"
                                showDescription={true}
                                showStats={true}
                                showTags={true}
                                showActions={false}
                            />
                        </div>
                    </div>
                )}

                {validationErrors.abilities && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        {validationErrors.abilities}
                    </div>
                )}
            </div>
            )}

            {/* Empty States */}
            {!selectedPath && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a path above to view specializations and details</p>
                </div>
            )}

            {selectedPath && !selectedSubPath && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a specialization to view available abilities</p>
                </div>
            )}
        </div>
    );
};

export default Step5PathSelection;

