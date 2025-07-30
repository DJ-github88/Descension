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
                `Increases Melee Power by ${modifier * 2}`,
                `Inventory Space: ${totalRows}x15 (Base 5x15)`,
                "Yellow Grid: Encumbered (-10ft movement)",
                "Red Grid: Overencumbered (-20ft movement, disadvantage on checks)"
            ]
        },
        agility: {
            title: "Agility",
            color: "#AAD372",
            effects: [
                `Increases Ranged Power by ${modifier * 2}`,
                `Increases Armor by ${modifier}`,
                `Grants +${modifier} Initiative`
            ]
        },
        intelligence: {
            title: "Intelligence",
            color: "#69CCF0",
            effects: [
                `Increases maximum Mana by ${value * 5}`,
                `Enhances Spell Power by ${modifier * 2}`,
                "Affects all schools of magic:",
                { spellSchools: [
                    { name: "Frost", color: "#3CE7FF" },
                    { name: "Fire", color: "#FF4400" },
                    { name: "Arcane", color: "#FF8AFF" },
                    { name: "Shadow", color: "#8C48FF" },
                    { name: "Holy", color: "#FFE680" },
                    { name: "Nature", color: "#A5FF91" }
                ]}
            ]
        },
        spirit: {
            title: "Spirit",
            color: "#FFFFFF",
            effects: [
                `+${modifier} Health regeneration per round`,
                `+${modifier * 0.5} Mana regeneration per round`,
                `Improves Healing Power by ${modifier * 2}`
            ]
        },
        constitution: {
            title: "Constitution",
            color: "#FF7D0A",
            effects: [
                `Increases maximum Health by ${value * 5}`,
                `+${modifier * 0.5} Health regeneration per round`,
                `Improves resistance to physical effects`
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
        const { base, equipment, encumbrance, buffs, debuffs } = components;

        // Always show base
        parts.push(`${Math.round(base)} (base)`);

        // Add equipment if non-zero
        if (equipment !== 0) {
            parts.push(`${equipment > 0 ? '+' : ''}${Math.round(equipment)} (equipment)`);
        }

        // Add encumbrance if non-zero
        if (encumbrance !== 0) {
            parts.push(`${encumbrance > 0 ? '+' : ''}${Math.round(encumbrance)} (encumbrance)`);
        }

        // Add buffs if non-zero
        if (buffs !== 0) {
            parts.push(`${buffs > 0 ? '+' : ''}${Math.round(buffs)} (buffs)`);
        }

        // Add debuffs if non-zero
        if (debuffs !== 0) {
            parts.push(`${debuffs > 0 ? '+' : ''}${Math.round(debuffs)} (debuffs)`);
        }

        const total = base + equipment + encumbrance + buffs + debuffs;
        return `${parts.join(' ')} = ${Math.round(total)}`;
    };

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
            {components && (components.equipment !== 0 || components.encumbrance !== 0 || components.buffs !== 0 || components.debuffs !== 0) && (
                <div className="equipment-slot-description">
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
