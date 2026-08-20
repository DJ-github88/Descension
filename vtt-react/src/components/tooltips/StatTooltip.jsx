import React from 'react';
import { calculateStatModifier } from '../../utils/characterUtils';

const getStatDescription = (stat, value) => {
    const modifier = Math.floor((value - 10) / 2);

    // Calculate inventory grid size based on strength
    const baseRows = 5;
    const additionalRows = Math.max(0, modifier);
    const totalRows = baseRows + additionalRows;

    const descriptions = {
        strength: {
            title: "Strength",
            color: "#FF4D4D",
            effects: [
                `Increases Smashing damage by ${modifier * 2}`,
                `Contributes ${modifier} to Slicing damage (combined with Agility)`,
                `Inventory Space: ${totalRows}x15 (Base 5x15)`,
                "Yellow Grid: Encumbered (-10ft movement)",
                "Red Grid: Overencumbered (-20ft movement, disadvantage on checks)"
            ]
        },
        agility: {
            title: "Agility",
            color: "#AAD372",
            effects: [
                `Increases Stabbing damage by ${modifier * 2}`,
                `Contributes ${modifier} to Slicing damage (combined with Strength)`,
                `Grants +${modifier} Initiative`
            ]
        },
        intelligence: {
            title: "Intelligence",
            color: "#69CCF0",
            effects: [
                `Increases maximum Mana by ${value * 5}`,
                `Enhances Spell Power by ${modifier * 2}`,
                `+${Math.floor(modifier / 2)} bonus Mana regeneration (adds to Spirit base)`,
                "Affects all schools of magic:",
                { spellSchools: [
                    { name: "Ember", color: "#D4380D" },
                    { name: "Rime", color: "#2C5F7C" },
                    { name: "Storm", color: "#8B7328" },
                    { name: "Arcane", color: "#5B3A8C" },
                    { name: "Primal", color: "#2D5A1E" },
                    { name: "Blight", color: "#3D1F4E" },
                    { name: "Wyrd", color: "#7A2040" },
                    { name: "Sacred", color: "#DAA520" }
                ]}
            ]
        },
        spirit: {
            title: "Spirit",
            color: "#FFFFFF",
            effects: [
                `+${modifier * 2} base Health and Mana regeneration (Con adds to HP, Int adds to MP)`,
                `Improves Healing Power by ${modifier * 2}`,
                "No Spirit means no regen or healing bonus"
            ]
        },
        constitution: {
            title: "Constitution",
            color: "#FF7D0A",
            effects: [
                `Increases maximum Health by ${value * 5}`,
                `+${Math.floor(modifier / 2)} bonus Health regeneration (adds to Spirit base)`
            ]
        },
        charisma: {
            title: "Charisma",
            color: "#9482C9",
            effects: [
                `Enhances social interactions`,
                `Improves certain magical abilities`,
                `+${modifier} to Persuasion checks`
            ]
        },
        'hit chance': {
            title: 'Hit Chance',
            color: '#FFD100',
            description: 'Your base accuracy with weapons and spells.',
            effects: [
                'Affects your ability to hit targets with attacks',
                'Higher hit chance reduces the likelihood of missing',
                'Some enemies may have abilities that reduce your hit chance'
            ]
        },
        'vision range': {
            title: 'Vision Range',
            color: '#FFFFFF',
            description: 'How far you can see in normal conditions.',
            effects: [
                'Determines your line of sight for targeting',
                'Affects your ability to spot hidden enemies',
                'May be reduced in darkness or adverse conditions',
                'Some abilities may temporarily increase your vision range'
            ]
        }
    };

    return descriptions[stat.toLowerCase()];
};

const StatTooltip = ({ stat, value, components }) => {
    const info = getStatDescription(stat, value);
    if (!info) return null;

    // Build calculation breakdown
    const buildCalculationBreakdown = () => {
        if (!components) return null;

        const parts = [];
        const {
            base = 10,
            racial = 0,
            racialName = 'racial',
            levelUp = 0,
            equipment = 0,
            talents = 0,
            buffs = 0,
            debuffs = 0,
            conditions = 0,
            exhaustion = 0,
            encumbrance = 0,
            encumbranceDescription = ''
        } = components;

        // Base score
        parts.push(`${Math.round(base)} (base)`);

        // Racial bonus
        if (racial !== 0) {
            parts.push(`${racial > 0 ? '+' : ''}${Math.round(racial)} (${racialName || 'racial'})`);
        }

        // Level up bonus
        if (levelUp !== 0) {
            parts.push(`${levelUp > 0 ? '+' : ''}${Math.round(levelUp)} (level up)`);
        }

        // Equipment bonus
        if (equipment !== 0) {
            parts.push(`${equipment > 0 ? '+' : ''}${Math.round(equipment)} (equipment)`);
        }

        // Talents
        if (talents !== 0) {
            parts.push(`${talents > 0 ? '+' : ''}${Math.round(talents)} (talents)`);
        }

        // Buffs
        if (buffs !== 0) {
            parts.push(`${buffs > 0 ? '+' : ''}${Math.round(buffs)} (buffs)`);
        }

        // Debuffs
        if (debuffs !== 0) {
            parts.push(`${debuffs > 0 ? '+' : ''}${Math.round(debuffs)} (debuffs)`);
        }

        // Conditions
        if (conditions !== 0) {
            parts.push(`${conditions > 0 ? '+' : ''}${Math.round(conditions)} (conditions)`);
        }

        // Encumbrance
        if (encumbrance !== 0) {
            parts.push(`${encumbrance > 0 ? '+' : ''}${Math.round(encumbrance)} (${encumbranceDescription || 'encumbrance'})`);
        }

        // Exhaustion
        if (exhaustion !== 0) {
            parts.push(`${exhaustion > 0 ? '+' : ''}${Math.round(exhaustion)} (exhaustion)`);
        }

        const total = Math.round(value ?? (base + racial + levelUp + equipment + talents + buffs + debuffs + conditions + encumbrance + exhaustion));
        return `${parts.join(' ')} = ${total}`;
    };

    const hasModifiers = components && (
        components.racial !== 0 ||
        components.levelUp !== 0 ||
        components.equipment !== 0 ||
        components.talents !== 0 ||
        components.buffs !== 0 ||
        components.debuffs !== 0 ||
        components.conditions !== 0 ||
        components.encumbrance !== 0 ||
        components.exhaustion !== 0
    );

    return (
        <>
            <div className="equipment-slot-name">
                {info.title}
            </div>
            {info.description && (
                <div className="equipment-slot-description">
                    {info.description}
                </div>
            )}
            <div className="equipment-slot-description">
                Current Value: {Math.round(value)} • Modifier: {calculateStatModifier(value)}
            </div>
            {components && (
                <div className="equipment-slot-description" style={{ color: '#7a3b2e', fontWeight: 600 }}>
                    <strong>Calculation:</strong> {buildCalculationBreakdown()}
                </div>
            )}
            {info.effects.map((effect, index) => (
                typeof effect === 'string' ? (
                    <div key={index} className="equipment-slot-description">
                        • {effect}
                    </div>
                ) : effect.spellSchools ? (
                    <div key={index} className="equipment-slot-description">
                        Spell Schools: {effect.spellSchools.map(school => school.name).join(', ')}
                    </div>
                ) : null
            ))}
        </>
    );
};

export default StatTooltip;
