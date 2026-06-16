/**
 * formulationToSpell — adapts an Arcanoneer Building Block formulation
 * (from ARCANONEER_DATA.combinationMatrix.entries) into the spell-shaped
 * object that UnifiedSpellCard / SpellTooltip expect.
 *
 * The combination matrix entries use a different field naming convention
 * than the spell data model (see SPELL_DATA_REFERENCE.md). This adapter
 * bridges that gap so formulations can render through the existing
 * spell-card UI with no further work.
 */

const PRIMARY_EFFECT_TO_EFFECT_TYPES = {
    damage:   ['damage'],
    control:  ['control'],
    barrier:  ['buff'],
    shield:   ['buff'],
    cleanse:  ['purification'],
    buff:     ['buff'],
    utility:  ['utility'],
    random:   ['utility'],   // chaos/wyrd combos — rendered with rollable table
    healing:  ['healing'],
};

/**
 * @param {object} entry  A combinationMatrix.entries item.
 * @param {object} matrix The parent combinationMatrix (for baseManaCost, baseDamageFormula, baseRange).
 * @returns {object}      A normalized-ish spell object for UnifiedSpellCard.
 */
export function formulationToSpell(entry, matrix = {}) {
    if (!entry) return null;

    const school = (entry.damageTypes && entry.damageTypes[0]) || 'arcane';
    const effectTypes = PRIMARY_EFFECT_TO_EFFECT_TYPES[entry.primaryEffect] || ['damage'];
    const isWyrd = !!entry.isChaosCombo;

    // Targeting translation
    let targetingType = 'single';
    let targetRestrictions = [];
    if (entry.targetType === 'area' || entry.targetType === 'aoe') targetingType = 'area';
    else if (entry.targetType === 'single_ally') { targetingType = 'single'; targetRestrictions = ['ally']; }
    else if (entry.targetType === 'self') { targetingType = 'self'; }
    else if (entry.targetType === 'cone') targetingType = 'cone';

    const description = [
        entry.effectDescription,
        entry.flavorText ? `\n\n"${entry.flavorText}"` : '',
    ].filter(Boolean).join('');

    // Damage config (only when the formulation deals damage)
    const damageConfig = (effectTypes.includes('damage') || entry.damageTypes?.length > 0) ? {
        formula: matrix.baseDamageFormula || '1d8 + intelligence/4',
        damageTypes: entry.damageTypes || [],
        resolution: 'DICE',
        ...(entry.secondaryEffect ? { secondaryEffect: entry.secondaryEffect } : {}),
    } : undefined;

    // Buff/barrier config
    const buffConfig = effectTypes.includes('buff') ? {
        buffType: entry.primaryEffect === 'barrier' ? 'shield' : 'enhancement',
        effects: [{
            id: entry.id + '_buff',
            name: entry.name,
            description: entry.effectDescription || '',
        }],
        durationType: 'rounds',
        durationValue: 2,
    } : undefined;

    // Control config
    const controlConfig = effectTypes.includes('control') ? {
        controlType: 'zone',
        effects: [{
            id: entry.id + '_ctrl',
            name: entry.name,
            description: entry.effectDescription || '',
        }],
        savingThrow: entry.secondaryEffect === 'stun' ? { saveAttribute: 'constitution', saveDifficulty: 15 } : undefined,
    } : undefined;

    // Purification (cleanse)
    const purificationConfig = effectTypes.includes('purification') ? {
        purificationType: 'cleanse',
        effects: [{
            id: entry.id + '_cleanse',
            name: 'Cleanse',
            description: entry.effectDescription || '',
        }],
    } : undefined;

    // Wyrd/chaos combos → rollable table
    const rollableTable = (isWyrd && entry.randomEffects && entry.randomEffects.length > 0) ? {
        title: 'Wyrd Effects Table (d20)',
        diceSize: 20,
        entries: entry.randomEffects.map((re, i) => ({
            dieMin: i * Math.max(1, Math.floor(20 / entry.randomEffects.length)) + 1,
            dieMax: (i + 1) * Math.max(1, Math.floor(20 / entry.randomEffects.length)),
            name: re.name,
            description: re.description,
            damageTypes: re.damageTypes,
        })),
    } : undefined;

    return {
        id: entry.id,
        name: entry.name,
        description,
        level: 1,
        spellType: 'ACTION',
        icon: `Arcane/${school}`,
        rarity: isWyrd ? 'rare' : 'common',

        typeConfig: {
            school,
            icon: `Arcane/${school}`,
            tags: [...(entry.damageTypes || []), ...(isWyrd ? ['wyrd'] : [])],
            castTime: 1,
            castTimeType: 'IMMEDIATE',
        },

        effectTypes,

        damageConfig,
        buffConfig,
        controlConfig,
        purificationConfig,

        targetingConfig: {
            targetingType,
            rangeType: 'ranged',
            rangeDistance: entry.range ?? matrix.baseRange ?? 60,
            targetRestrictions,
            aoeShape: entry.aoeShape,
            aoeParameters: entry.aoeParameters,
        },

        resourceCost: (() => {
            const mana = matrix.baseManaCost || 5;
            // Build per-element sphere resource entries so the spellcard header shows
            // each required element as a separate resource (e.g. "Ember Sphere ×2").
            const sphereTypes = [];
            const sphereValues = {};
            const elemCounts = {};
            for (const el of entry.elements) {
                elemCounts[el] = (elemCounts[el] || 0) + 1;
            }
            for (const [el, cnt] of Object.entries(elemCounts)) {
                const typeName = `${el}_sphere`;
                sphereTypes.push(typeName);
                sphereValues[typeName] = cnt;
            }
            return {
                actionPoints: 1,
                mana,
                components: ['somatic'],
                resourceTypes: ['mana', 'actionPoints', ...sphereTypes],
                resourceValues: { mana, actionPoints: 1, ...sphereValues },
            };
        })(),

        cooldownConfig: {
            cooldownType: 'turn_based',
            cooldownValue: 0,
        },

        durationConfig: {
            durationType: entry.targetType === 'area' ? 'rounds' : 'instant',
            durationValue: entry.targetType === 'area' ? 2 : 0,
            durationUnit: 'rounds',
        },

        tags: [
            ...(entry.damageTypes || []),
            'arcanoneer',
            'formulation',
            ...(isWyrd ? ['wyrd', 'chaos'] : []),
        ],

        rollableTable,

        // Carry original elements info for any custom rendering.
        _arcanoneerElements: entry.elements,
        _isFormulation: true,
    };
}
