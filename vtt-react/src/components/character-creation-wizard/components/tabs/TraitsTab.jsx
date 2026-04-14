/**
 * TraitsTab - Displays traits and abilities for selections
 * 
 * Used by Race and Discipline selections
 */

import React from 'react';
import UnifiedSpellCard from '../../../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { getIconUrl } from '../../../../utils/assetManager';
import { isPassiveStatModifier } from '../../../../utils/raceDisciplineSpellUtils';

const getPassiveSummary = (trait = {}) => {
    const parts = [];
    
    if (trait.description) {
        const firstSentence = trait.description.split(/[.!?]+/)[0].trim();
        if (firstSentence) parts.push(firstSentence + '.');
    }

    let conditionText = '';
    if (trait.triggerConfig?.global?.compoundTriggers) {
        const healthTrigger = trait.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
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
        let mag;
        if (mod.magnitudeType === 'dice' && mod.formula) {
            mag = mod.formula;
        } else if (mod.magnitudeType === 'percentage') {
            mag = `${mod.magnitude}%`;
        } else {
            mag = `${mod.magnitude > 0 ? '+' : ''}${mod.magnitude}`;
        }
        return `${stat} ${mag}`;
    };

    const statMods = [];
    const otherEffects = [];

    if (trait.buffConfig?.effects) {
        trait.buffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    if (trait.debuffConfig?.effects) {
        trait.debuffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    if (trait.healingConfig) {
        const { formula = 'healing', hotTickInterval, hotDuration, durationType } = trait.healingConfig;
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

    if (statMods.length > 0) {
        const modText = statMods.join(', ');
        parts.push(conditionText ? `${modText} ${conditionText}` : modText);
    }

    if (otherEffects.length > 0) {
        parts.push(otherEffects.join(', '));
    }

    return parts.length ? parts.join(' ') : 'No description available';
};

const TraitsTab = ({
    traits = [],
    title = "Traits & Abilities"
}) => {
    if (!traits || traits.length === 0) {
        return (
            <div className="selection-tab traits-tab">
                <div className="no-data-message">
                    <i className="fas fa-dna"></i>
                    <p>No traits available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="selection-tab traits-tab">
            <h5 className="section-title">
                <i className="fas fa-dna"></i> {title}
            </h5>
            <div className="traits-list">
                {traits.map((trait) => {
                    if (isPassiveStatModifier(trait)) {
                        return (
                            <div key={trait.id} className="passive-summary-item">
                                <div className="passive-summary-icon-wrapper">
                                    <img
                                        src={getIconUrl(trait.icon || 'Utility/Utility', 'abilities')}
                                        alt={trait.name}
                                        className="passive-summary-icon"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                        }}
                                    />
                                </div>
                                <div className="passive-summary-details">
                                    <div className="passive-summary-name">{trait.name}</div>
                                    <div className="passive-summary-description">{getPassiveSummary(trait)}</div>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={trait.id} className="active-trait-card">
                            <UnifiedSpellCard
                                spell={trait}
                                variant="wizard"
                                showActions={false}
                                showDescription={true}
                                showStats={true}
                                showTags={true}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TraitsTab;
