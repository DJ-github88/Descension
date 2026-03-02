/**
 * AbilitiesTab - Displays discipline abilities
 * 
 * Used by Discipline selection
 */

import React, { useState, useMemo } from 'react';
import { UnifiedSpellCard } from '../../../spellcrafting-wizard/components/common';
import { normalizeDisciplineAbility } from '../../../../utils/raceDisciplineSpellUtils';

const getPassiveSummary = (ability = {}) => {
    const parts = [];

    if (ability.description) {
        const firstSentence = ability.description.split(/[.!?]+/)[0].trim();
        if (firstSentence) parts.push(firstSentence + '.');
    }

    return parts.length ? parts.join(' ') : 'No description available';
};

const getAbilityIconUrl = (iconId) => {
    if (!iconId) return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};

const AbilitiesTab = ({
    abilities = [],
    selectedAbilityId = null,
    onSelectAbility,
    title = "Discipline Abilities"
}) => {
    const [viewingAbilityId, setViewingAbilityId] = useState(null);

    const normalizedAbilities = useMemo(
        () => (abilities || []).map(normalizeDisciplineAbility),
        [abilities]
    );

    if (!normalizedAbilities || normalizedAbilities.length === 0) {
        return (
            <div className="selection-tab abilities-tab">
                <div className="no-data-message">
                    <i className="fas fa-magic"></i>
                    <p>No abilities available</p>
                </div>
            </div>
        );
    }

    const handleAbilityClick = (ability) => {
        setViewingAbilityId(ability.id);
        if (onSelectAbility) {
            onSelectAbility(ability.id);
        }
    };

    const viewingAbility = normalizedAbilities.find(a => a.id === viewingAbilityId);

    return (
        <div className="selection-tab abilities-tab">
            <h5 className="section-title">
                <i className="fas fa-magic"></i> {title}
                <span className="ability-count-badge">({normalizedAbilities.length})</span>
            </h5>
            
            {selectedAbilityId && (
                <p className="selected-ability-hint">
                    Selected: <strong>{
                        normalizedAbilities.find(a => a.id === selectedAbilityId)?.name || 'None'
                    }</strong>
                </p>
            )}

            <div className="ability-icon-grid">
                {normalizedAbilities.map(ability => {
                    const isViewing = viewingAbilityId === ability.id;
                    const isSelected = selectedAbilityId === ability.id;

                    return (
                        <div
                            key={ability.id}
                            className={`ability-icon-card ${isViewing ? 'viewing' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleAbilityClick(ability)}
                            title={`${ability.name}${isSelected ? ' (Selected)' : ''}`}
                        >
                            <div className="ability-icon-image">
                                <img
                                    src={getAbilityIconUrl(ability.icon)}
                                    alt={ability.name}
                                    onError={(e) => e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'}
                                />
                            </div>
                            <div className="ability-icon-name">{ability.name}</div>
                        </div>
                    );
                })}
            </div>

            {viewingAbility && (
                <div className="ability-detail-section">
                    <div className="ability-detail-header">
                        <h4>Ability Details</h4>
                    </div>
                    <div className="ability-detail-card">
                        {(() => {
                            const isPassive = viewingAbility.spellType === 'PASSIVE' && 
                                              (!viewingAbility.resourceCost || viewingAbility.resourceCost.actionPoints === 0);

                            if (isPassive) {
                                const description = getPassiveSummary(viewingAbility);
                                const icon = viewingAbility.icon || 'spell_holy_devotion';
                                return (
                                    <div className="passive-summary-item">
                                        <div className="passive-summary-icon-wrapper">
                                            <img
                                                src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`}
                                                alt={viewingAbility.name}
                                                className="passive-summary-icon"
                                                onError={(e) => e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'}
                                            />
                                        </div>
                                        <div className="passive-summary-details">
                                            <div className="passive-summary-name">{viewingAbility.name}</div>
                                            <div className="passive-summary-description">{description}</div>
                                        </div>
                                    </div>
                                );
                            }

                            const displayAbility = { 
                                ...viewingAbility, 
                                description: viewingAbility.description || getPassiveSummary(viewingAbility) 
                            };
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
    );
};

export default AbilitiesTab;
