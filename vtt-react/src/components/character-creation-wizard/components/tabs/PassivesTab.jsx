/**
 * PassivesTab - Displays passive abilities for disciplines
 * 
 * Used by Discipline selection
 */

import React from 'react';
import { getIconUrl } from '../../../../utils/assetManager';

const getPassiveSummary = (benefit = {}) => {
    const parts = [];

    if (benefit.description) {
        const firstSentence = benefit.description.split(/[.!?]+/)[0].trim();
        if (firstSentence) parts.push(firstSentence + '.');
    }

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

    if (benefit.buffConfig?.effects) {
        benefit.buffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    if (benefit.debuffConfig?.effects) {
        benefit.debuffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

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

    if (statMods.length > 0) {
        const modText = statMods.join(', ');
        parts.push(conditionText ? `${modText} ${conditionText}` : modText);
    }

    if (otherEffects.length > 0) {
        parts.push(otherEffects.join(', '));
    }

    return parts.length ? parts.join(' ') : 'No description available';
};

const PassivesTab = ({
    passives = [],
    title = "Passive Abilities"
}) => {
    if (!passives || passives.length === 0) {
        return (
            <div className="selection-tab passives-tab">
                <div className="no-data-message">
                    <i className="fas fa-shield-alt"></i>
                    <p>No passive abilities available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="selection-tab passives-tab">
            <h5 className="section-title">
                <i className="fas fa-shield-alt"></i> {title}
            </h5>
            <div className="benefits-grid">
                {passives.map((benefit, index) => (
                    <div key={index} className="benefit-card">
                        <div className="benefit-header">
                            <span className="benefit-name">{benefit.name}</span>
                            {benefit.type && (
                                <span className="benefit-type" data-type={benefit.type}>
                                    {benefit.type}
                                </span>
                            )}
                        </div>
                        <p className="benefit-description">{getPassiveSummary(benefit)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PassivesTab;
