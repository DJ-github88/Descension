import { parseDiceString, calculateDiceAverage } from './diceUtils';

/**
 * Calculate total damage for a spell
 * @param {Object} spell - Spell data
 * @param {number} casterLevel - Level of the caster
 * @param {Object} attributes - Caster's attributes
 * @returns {Object} Calculated damage details
 */
export const calculateSpellDamage = (spell, casterLevel = 1, attributes = {}) => {
    const base = parseDiceString(spell.damage?.base || '0');
    if (!base) return { min: 0, max: 0, average: 0 };

    // Calculate attribute scaling
    const scaling = spell.damage?.scaling || {};
    const attributeBonus = Math.floor(
        (attributes[scaling.attribute] || 0) * (scaling.ratio || 0)
    );

    // Calculate level scaling
    const levelScale = Math.floor((casterLevel - 1) * (spell.damage?.levelScaling || 0));

    const min = (base.count * 1) + base.modifier + attributeBonus + levelScale;
    const max = (base.count * base.sides) + base.modifier + attributeBonus + levelScale;
    const average = calculateDiceAverage(base) + attributeBonus + levelScale;

    return { min, max, average };
};

/**
 * Get duration in rounds for a spell effect
 * @param {Object} effect - Effect data
 * @param {number} casterLevel - Level of the caster
 * @returns {number} Duration in rounds
 */
export const getEffectDuration = (effect, casterLevel = 1) => {
    const base = effect.duration || 0;
    const levelScale = (casterLevel - 1) * (effect.durationScaling || 0);
    return Math.floor(base + levelScale);
};

/**
 * Calculate effect value with scaling
 * @param {Object} effect - Effect data
 * @param {number} casterLevel - Level of the caster
 * @param {Object} attributes - Caster's attributes
 * @returns {number} Calculated effect value
 */
export const calculateEffectValue = (effect, casterLevel = 1, attributes = {}) => {
    const base = effect.value || 0;
    
    // Attribute scaling
    const attrBonus = Math.floor(
        (attributes[effect.scaling?.attribute] || 0) * (effect.scaling?.ratio || 0)
    );
    
    // Level scaling
    const levelScale = Math.floor((casterLevel - 1) * (effect.levelScaling || 0));
    
    return base + attrBonus + levelScale;
};

/**
 * Get effect description with calculated values
 * @param {Object} effect - Effect data
 * @param {number} value - Calculated effect value
 * @returns {string} Formatted effect description
 */
export const getEffectDescription = (effect, value) => {
    const description = effect.description || '';
    return description.replace('{value}', value);
};

/**
 * Check if a spell can be cast (resources, cooldown, etc)
 * @param {Object} spell - Spell data
 * @param {Object} caster - Caster data
 * @returns {Object} Cast check result
 */
export const canCastSpell = (spell, caster) => {
    const results = {
        canCast: true,
        reasons: []
    };

    // Check resources
    if (spell.cost?.value > (caster.resources?.[spell.cost.type] || 0)) {
        results.canCast = false;
        results.reasons.push(`Insufficient ${spell.cost.type}`);
    }

    // Check cooldown
    if (spell.cooldown > 0 && caster.cooldowns?.[spell.id] > 0) {
        results.canCast = false;
        results.reasons.push('Spell is on cooldown');
    }

    // Check requirements
    for (const req of (spell.requirements || [])) {
        if (!caster.meetsRequirement?.(req)) {
            results.canCast = false;
            results.reasons.push(`Missing requirement: ${req}`);
        }
    }

    return results;
};

/**
 * Apply spell effects to a target
 * @param {Object} spell - Spell data
 * @param {Object} caster - Caster data
 * @param {Object} target - Target data
 * @returns {Object} Effect application results
 */
export const applySpellEffects = (spell, caster, target) => {
    const results = {
        damage: 0,
        healing: 0,
        effects: []
    };

    // Apply damage
    if (spell.damage) {
        const dmg = calculateSpellDamage(spell, caster.level, caster.attributes);
        results.damage = dmg.average;
    }

    // Apply healing
    if (spell.healing) {
        const heal = calculateSpellDamage(spell, caster.level, caster.attributes);
        results.healing = heal.average;
    }

    // Apply effects
    for (const effect of (spell.effects || [])) {
        const value = calculateEffectValue(effect, caster.level, caster.attributes);
        const duration = getEffectDuration(effect, caster.level);
        
        results.effects.push({
            type: effect.type,
            value,
            duration
        });
    }

    return results;
};
