/**
 * cadenceToSpell — adapts a Minstrel cadence entry
 * (from MINSTREL_DATA.cadenceMatrix.entries) into the spell-shaped
 * object that UnifiedSpellCard / SpellTooltip expect.
 *
 * Direct counterpart to ../arcanoneer/formulationToSpell.js. The cadence
 * entries use a different field naming convention than the spell data
 * model (see SPELL_DATA_REFERENCE.md). This adapter bridges that gap so
 * cadences can render through the existing spell-card UI with no further
 * work — same UX as the Arcanoneer's formulation chips.
 *
 * Each cadence's `notes` map (e.g. { I: 2, IV: 1, V: 1 }) is exposed both
 * as the resource cost (so the spellcard header shows the consumed notes)
 * and as `_cadenceNotes` for any custom rendering.
 */

const PRIMARY_EFFECT_TO_EFFECT_TYPES = {
    damage:   ['damage'],
    control:  ['control'],
    barrier:  ['buff'],
    shield:   ['buff'],
    buff:     ['buff'],
    healing:  ['healing'],
    utility:  ['utility'],
};

const SECONDARY_EFFECT_TO_TEXT = {
    guaranteed_crit:  'Target\'s next attack is a guaranteed critical hit',
    disoriented:      '-2 attacks & saves',
    dot:              'Damage over time',
    haste:            '+20 ft speed',
    shield:           'Absorb shield',
    damage_reduction: '-4 damage taken',
    advantage:        'Advantage on attacks',
    crit_chance:      '+2 crit chance',
    paralyze:         'Paralyzed',
    save_bonus:       '+2 to all saves',
};

/**
 * @param {object} entry   A cadenceMatrix.entries item.
 * @param {object} matrix  The parent cadenceMatrix (for baseManaCost, baseRange).
 * @returns {object}       A normalized-ish spell object for UnifiedSpellCard.
 */
export function cadenceToSpell(entry, matrix = {}) {
    if (!entry) return null;

    const school = (entry.damageTypes && entry.damageTypes[0]) || 'storm';
    const effectTypes = PRIMARY_EFFECT_TO_EFFECT_TYPES[entry.primaryEffect] || ['buff'];

    // Targeting translation — Minstrel cadences target allies, enemies, or areas.
    let targetingType = 'single';
    let targetRestrictions = [];
    if (entry.targetType === 'area' || entry.targetType === 'aoe') targetingType = 'area';
    else if (entry.targetType === 'single_ally') { targetingType = 'single'; targetRestrictions = ['ally']; }
    else if (entry.targetType === 'self') { targetingType = 'self'; }
    else if (entry.targetType === 'cone') targetingType = 'cone';

    const description = [
        entry.effectDescription,
        entry.flavorText ? `\n\n_"${entry.flavorText}"_` : '',
        entry.tacticalUse ? `\n\n**Tactical Use:** ${entry.tacticalUse}` : '',
    ].filter(Boolean).join('');

    // Damage config (only when the cadence deals damage)
    const damageConfig = (effectTypes.includes('damage') || entry.secondaryEffect === 'dot') ? {
        formula: '3d6 + spirit',
        damageTypes: entry.damageTypes || ['storm'],
        resolution: 'DICE',
        ...(entry.secondaryEffect === 'dot' ? { secondaryEffect: 'dot' } : {}),
    } : undefined;

    // Buff cadences (Perfect / Plagal / Phrygian / Neapolitan)
    const buffConfig = effectTypes.includes('buff') ? {
        buffType: 'enhancement',
        effects: [{
            id: entry.id + '_buff',
            name: entry.name,
            description: entry.effectDescription || '',
        }],
        durationType: 'rounds',
        durationValue: 2,
    } : undefined;

    // Control cadences (Deceptive / Tritone Substitution)
    const controlConfig = effectTypes.includes('control') ? {
        controlType: entry.secondaryEffect === 'paralyze' ? 'incapacitate' : 'zone',
        effects: [{
            id: entry.id + '_ctrl',
            name: entry.name,
            description: entry.effectDescription || '',
        }],
        // DC is encoded in the description text; surface a parse-friendly version.
        savingThrow: entry.secondaryEffect === 'paralyze'
            ? { saveAttribute: 'spirit', saveDifficulty: 18 }
            : { saveAttribute: 'spirit', saveDifficulty: 15 },
    } : undefined;

    // Healing cadences (Authentic / Picardy Third) — note Minstrel CANNOT self-heal.
    const healingConfig = effectTypes.includes('healing') ? {
        healingType: 'restore',
        formula: entry.id === 'picardy_third' ? '6d6 + spirit' : '4d6 + spirit',
        cannotSelfHeal: true,
        effects: [{
            id: entry.id + '_heal',
            name: entry.name,
            description: entry.effectDescription || '',
        }],
    } : undefined;

    // Barrier cadence (Half Cadence)
    const barrierConfig = entry.primaryEffect === 'barrier' ? {
        barrierType: 'shield',
        formula: '2d6 + spirit',
        durationType: 'rounds',
        durationValue: 2,
        effects: [{
            id: entry.id + '_barrier',
            name: entry.name,
            description: entry.effectDescription || '',
        }],
    } : undefined;

    return {
        id: entry.id,
        name: entry.name,
        description,
        level: 1,
        spellType: 'ACTION',
        icon: `Arcane/${school}`,
        rarity: 'common',

        typeConfig: {
            school,
            icon: `Arcane/${school}`,
            tags: [...(entry.damageTypes || []), 'cadence', 'minstrel'],
            castTime: 1,
            castTimeType: 'IMMEDIATE',
        },

        // Show the chord sequence as the epithet/subtitle where supported.
        subtitle: `${entry.epithet} — ${entry.sequence}`,

        effectTypes,

        damageConfig,
        buffConfig,
        controlConfig,
        healingConfig,
        barrierConfig,

        targetingConfig: {
            targetingType,
            rangeType: 'ranged',
            rangeDistance: entry.range ?? matrix.baseRange ?? 60,
            targetRestrictions,
            aoeShape: entry.aoeShape,
            aoeParameters: entry.aoeParameters,
        },

        resourceCost: (() => {
            const mana = matrix.baseManaCost || 16;
            // Build per-note resource entries so the spellcard header shows each
            // consumed note as a separate line (e.g. "Tonic (I) ×2").
            const noteTypes = [];
            const noteValues = {};
            for (const [numeral, cnt] of Object.entries(entry.notes || {})) {
                const typeName = `note_${numeral}`;
                noteTypes.push(typeName);
                noteValues[typeName] = cnt;
            }
            return {
                actionPoints: 1,
                mana,
                components: ['verbal', 'somatic'],
                verbalText: '(a resonant chord)',
                somaticText: 'Play the progression on your instrument',
                resourceTypes: ['mana', 'actionPoints', ...noteTypes],
                resourceValues: { mana, actionPoints: 1, ...noteValues },
            };
        })(),

        cooldownConfig: {
            cooldownType: 'turn_based',
            cooldownValue: 0,
        },

        durationConfig: (() => {
            if (entry.targetType === 'area') return { durationType: 'rounds', durationValue: 2, durationUnit: 'rounds' };
            if (effectTypes.includes('buff') || effectTypes.includes('healing')) return { durationType: 'rounds', durationValue: 2, durationUnit: 'rounds' };
            return { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
        })(),

        tags: [
            ...(entry.damageTypes || []),
            'minstrel',
            'cadence',
            ...(effectTypes.includes('healing') ? ['healing'] : []),
            ...(effectTypes.includes('control') ? ['control'] : []),
        ],

        secondaryEffectText: SECONDARY_EFFECT_TO_TEXT[entry.secondaryEffect],

        // Carry original note map for any custom rendering.
        _cadenceNotes: entry.notes,
        _cadenceSequence: entry.sequence,
        _isCadence: true,
    };
}
