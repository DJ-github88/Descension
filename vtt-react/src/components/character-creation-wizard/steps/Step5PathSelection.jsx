/**
 * Step 5: Discipline Selection
 *
 * Choose from 9 character disciplines (Mystic, Zealot, Trickster, etc.)
 */

import React, { useState, useMemo } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { ENHANCED_PATHS } from '../../../data/enhancedPathData';
import { calculateStartingCurrency, formatCurrency } from '../../../data/startingCurrencyData';
import { getBackgroundData } from '../../../data/backgroundData';
import { UnifiedSpellCard } from '../../spellcrafting-wizard/components/common';
import { useSpellLibrary, useSpellLibraryDispatch } from '../../spellcrafting-wizard/context/SpellLibraryContext';
import { getDisciplineSpells, addSpellsToLibrary, selectRandomSpells, removeSpellsByCategory, normalizeDisciplineAbility } from '../../../utils/raceDisciplineSpellUtils';
import { getIconUrl } from '../../../utils/assetManager';
import '../../spellcrafting-wizard/styles/pathfinder/main.css';
import '../../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import '../../rules/BackgroundSelector.css';

// Derive concise passive summaries: 1 line flavor text, then game mechanics
const getPassiveSummary = (benefit = {}) => {
    const parts = [];

    // Extract first sentence of description as flavor text
    if (benefit.description) {
        const firstSentence = benefit.description.split(/[.!?]+/)[0].trim();
        if (firstSentence) parts.push(firstSentence + '.');
    }

    // Extract condition from triggerConfig if present
    let conditionText = '';
    if (benefit.triggerConfig?.global?.compoundTriggers) {
        const healthTrigger = benefit.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
        if (healthTrigger?.parameters) {
            const percentage = healthTrigger.parameters.percentage;
            const comparison = healthTrigger.parameters.comparison;
            if (percentage && comparison) {
                if (comparison === 'less_than' || comparison === 'below') {
                    conditionText = `when below ${percentage}% HP`;
                } else if (comparison === 'greater_than' || comparison === 'above') {
                    conditionText = `when above ${percentage}% HP`;
                }
            }
        }
    }

    const formatStatMod = (mod = {}) => {
        const stat = (mod.stat || 'stat').replace(/_/g, ' ');
        const mag = mod.magnitudeType === 'percentage'
            ? `${mod.magnitude}%`
            : `${mod.magnitude > 0 ? '+' : ''}${mod.magnitude}`;
        return `${stat} ${mag}`;
    };

    // Group stat modifiers together
    const statMods = [];
    const otherEffects = [];

    // Process buff effects
    if (benefit.buffConfig?.effects) {
        benefit.buffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    // Process debuff effects
    if (benefit.debuffConfig?.effects) {
        benefit.debuffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    // Add healing config
    if (benefit.healingConfig) {
        const { formula = 'healing', hotTickInterval, hotDuration, durationType } = benefit.healingConfig;
        const intervalText = hotTickInterval
            ? ` every ${hotTickInterval} round${hotTickInterval > 1 ? 's' : ''}`
            : '';
        const durationText = hotDuration
            ? ` while ${hotDuration}`
            : durationType === 'permanent'
                ? ' continuously'
                : '';
        parts.push(`Regenerates ${formula}${intervalText}${durationText}`.trim() + '.');
    }

    // Add stat modifiers (grouped together)
    if (statMods.length > 0) {
        const modText = statMods.join(', ');
        parts.push(conditionText ? `${modText} ${conditionText}` : modText);
    }

    // Add other effects
    if (otherEffects.length > 0) {
        parts.push(otherEffects.join(', '));
    }

    return parts.length ? parts.join(' ') : 'No description available';
};

const Step5PathSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const spellLibraryDispatch = useSpellLibraryDispatch();
    const spellLibrary = useSpellLibrary();

    const [selectedPath, setSelectedPath] = useState(state.characterData.path);
    const [selectedAbility, setSelectedAbility] = useState(state.characterData.selectedAbility);
    const [viewingAbility, setViewingAbility] = useState(null);

    const paths = Object.values(ENHANCED_PATHS);
    const { validationErrors } = state;

    // Get selected path data
    const pathData = selectedPath ? ENHANCED_PATHS[selectedPath] : null;

    const handlePathSelect = (pathId) => {
        // Remove old discipline spells first
        removeSpellsByCategory(spellLibraryDispatch, 'Discipline Abilities', spellLibrary.spells);

        setSelectedPath(pathId);
        setSelectedAbility(null); // Reset selected ability when changing paths
        setViewingAbility(null);
        dispatch(wizardActionCreators.setPath(pathId));
        dispatch(wizardActionCreators.setSelectedAbility(null)); // Clear selected ability in state

        // Add discipline spells to spell library
        const disciplineSpells = getDisciplineSpells(pathId);
        if (disciplineSpells.length > 0) {
            // For character creation, select random spells if there are choices
            // Paths typically have 1 PASSIVE, 1 REACTION, 1 ACTION - select 1 of each
            const choices = { passive: 1, reaction: 1, action: 1 };
            const selectedSpells = selectRandomSpells(disciplineSpells, choices);
            addSpellsToLibrary(spellLibraryDispatch, selectedSpells, 'Discipline Abilities');
        }
    };

    const handleAbilitySelect = (abilityId) => {
        const newSelectedAbility = selectedAbility === abilityId ? null : abilityId;
        setSelectedAbility(newSelectedAbility);
        setViewingAbility(newSelectedAbility); // Automatically show spell card when selecting
        dispatch(wizardActionCreators.setSelectedAbility(newSelectedAbility));
    };

    const handleAbilityView = (abilityId) => {
        setViewingAbility(abilityId);
    };

    // Get icon URL helper
    const getIconUrl = (iconId) => {
        if (!iconId) return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
        return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
    };

    // Get all abilities from the discipline (should be exactly 3) and normalize them
    const disciplineAbilities = useMemo(
        () => (pathData?.abilities || []).map(normalizeDisciplineAbility),
        [pathData]
    );

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
                                        <p className="benefit-description">{getPassiveSummary(benefit)}</p>
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
                                <p>Choose 1 ability from the {pathData.name} discipline. Click an ability to select it and view its spell card details.</p>
                                {selectedAbility && (
                                    <p className="selected-ability-notice">
                                        <i className="fas fa-check-circle"></i>
                                        Selected: <strong>{disciplineAbilities.find(a => a.id === selectedAbility)?.name}</strong>
                                    </p>
                                )}
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
                                    const isSelected = selectedAbility === ability.id;

                                    return (
                                        <div
                                            key={ability.id}
                                            className={`ability-icon-card ${isViewing ? 'viewing' : ''} ${isSelected ? 'selected' : ''}`}
                                            onClick={() => {
                                                if (isSelected && isViewing) {
                                                    // If already selected and viewing, deselect it
                                                    handleAbilitySelect(ability.id); // This will deselect and close viewing
                                                } else {
                                                    // Select this ability (will also start viewing)
                                                    handleAbilitySelect(ability.id);
                                                }
                                            }}
                                            title={`${ability.name}${isSelected ? ' (Selected)' : ''}`}
                                        >
                                            <div className="ability-icon-image">
                                                <img
                                                    src={getIconUrl(ability.icon, 'abilities')}
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
                                    {(() => {
                                        const ability = disciplineAbilities.find(a => a.id === viewingAbility);
                                        if (!ability) return null;

                                        const isPassive = ability.spellType === 'PASSIVE' && (!ability.resourceCost || ability.resourceCost.actionPoints === 0);

                                        if (isPassive) {
                                            const description = getPassiveSummary(ability);
                                            const icon = ability.icon || 'spell_holy_devotion';
                                            return (
                                                <div className="passive-summary-item">
                                                    <div className="passive-summary-icon-wrapper">
                                                        <img
                                                            src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`}
                                                            alt={ability.name}
                                                            className="passive-summary-icon"
                                                            onError={(e) => e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'}
                                                        />
                                                    </div>
                                                    <div className="passive-summary-details">
                                                        <div className="passive-summary-name">{ability.name}</div>
                                                        <div className="passive-summary-description">{description}</div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        const displayAbility = { ...ability, description: ability.description || getPassiveSummary(ability) };
                                        return (
                                            <UnifiedSpellCard
                                                spell={displayAbility}
                                                variant="wizard"
                                                showDescription={true}
                                                showStats={true}
                                                showTags={true}
                                                showActions={false}
                                            />
                                        );
                                    })()}
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
