import React from 'react';

const getStatDescription = (stat, value) => {
    const modifier = Math.floor((value - 10) / 2);
    const descriptions = {
        strength: {
            title: "Strength",
            color: "#FF4D4D",
            effects: [
                `Increases Melee Power by ${modifier * 2}`,
                `Inventory Space: 5x15 (Base 5x5)`,
                "Yellow Grid: Encumbered (-10ft movement)",
                "Red Grid: Overencumbered (-20ft movement, disadvantage on checks)"
            ]
        },
        agility: {
            title: "Agility",
            color: "#AAD372",
            effects: [
                `Increases Ranged Power by ${modifier * 2}`,
                `Improves Critical Strike chance by ${modifier}%`,
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

const StatTooltip = ({ stat, value }) => {
    const info = getStatDescription(stat, value);
    if (!info) return null;

    return (
        <div className="stat-tooltip">
            <div className="tooltip-header" style={{ color: info.color }}>
                {info.title}
            </div>
            {info.description && (
                <div className="tooltip-description">
                    {info.description}
                </div>
            )}
            <div className="tooltip-effects">
                {info.effects.map((effect, index) => (
                    typeof effect === 'string' ? (
                        <div key={index} className="tooltip-effect">
                            {effect}
                        </div>
                    ) : effect.spellSchools ? (
                        <div key={index} className="spell-schools">
                            {effect.spellSchools.map((school, i) => (
                                <span key={i} style={{ color: school.color }}>
                                    {school.name}{i < effect.spellSchools.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    ) : null
                ))}
            </div>
        </div>
    );
};

export default StatTooltip;
