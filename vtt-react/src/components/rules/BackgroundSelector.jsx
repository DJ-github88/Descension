import React, { useState, useMemo } from 'react';
import { ENHANCED_PATHS } from '../../data/enhancedPathData';
import { UnifiedSpellCard } from '../spellcrafting-wizard/components/common';
import { normalizeDisciplineAbility } from '../../utils/raceDisciplineSpellUtils';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../spellcrafting-wizard/styles/pathfinder/components/cards.css';
import './BackgroundSelector.css';

// Derive tangible passive summaries (append derived mechanics to existing text)
const getPassiveSummary = (benefit = {}) => {
    const parts = [];
    if (benefit.description) parts.push(benefit.description);

    const formatStatMod = (mod = {}) => {
        const stat = (mod.stat || 'stat').replace(/_/g, ' ');
        const mag = mod.magnitudeType === 'percentage'
            ? `${mod.magnitude}%`
            : `${mod.magnitude > 0 ? '+' : ''}${mod.magnitude}`;
        return `${stat} ${mag}`;
    };

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

    const buffDesc = benefit.buffConfig?.effects
        ?.map(e => e.description || (e.statModifier && formatStatMod(e.statModifier)))
        ?.filter(Boolean)
        ?.join('. ');
    if (buffDesc) parts.push(buffDesc);

    const debuffDesc = benefit.debuffConfig?.effects
        ?.map(e => e.description || (e.statModifier && formatStatMod(e.statModifier)) || e.statusEffect?.type)
        ?.filter(Boolean)
        ?.join('. ');
    if (debuffDesc) parts.push(debuffDesc);

    return parts.length ? parts.join(' ') : 'No description available';
};

const BackgroundSelector = () => {
    const [selectedPath, setSelectedPath] = useState(null);
    const [viewingAbility, setViewingAbility] = useState(null);

    // Get all paths as array
    const paths = Object.values(ENHANCED_PATHS);

    // Get selected path data
    const pathData = selectedPath ? ENHANCED_PATHS[selectedPath] : null;
    
    // Get all abilities from the discipline (should be exactly 3) and normalize
    const disciplineAbilities = useMemo(
        () => (pathData?.abilities || []).map(normalizeDisciplineAbility),
        [pathData]
    );

    const handlePathSelect = (pathId) => {
        setSelectedPath(pathId);
        setViewingAbility(null);
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
        <div className="background-selector-container">
            {/* Step 1: Discipline Selection */}
            <div className="background-selection-step">
                <h3 className="step-title">
                    <span className="step-number">1</span>
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
            </div>

            {/* Step 2: Discipline Details */}
            {pathData && (
                <div className="discipline-details-step">
                    <h3 className="step-title">
                        <span className="step-number">2</span>
                        {pathData.name} Discipline Details
                    </h3>

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
                        <h4 className="section-title">
                            {pathData.name} Discipline Abilities
                            {disciplineAbilities.length > 0 && (
                                <span className="ability-count-badge">({disciplineAbilities.length})</span>
                            )}
                        </h4>

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

export default BackgroundSelector;
