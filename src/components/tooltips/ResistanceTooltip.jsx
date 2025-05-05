import React from 'react';

const RESISTANCE_INFO = {
    cold: {
        name: 'Cold Resistance',
        description: 'Reduces damage from cold spells, blizzards, and freezing effects.',
        color: '#3CE7FF',
        effects: [
            'Take half damage from cold sources',
            'Advantage vs. cold-based effects',
            'Better survival in freezing environments'
        ]
    },
    fire: {
        name: 'Fire Resistance',
        description: 'Reduces damage from fire spells, dragon breath, and burning effects.',
        color: '#FF4400',
        effects: [
            'Take half damage from fire sources',
            'Advantage vs. fire-based effects',
            'Better survival in hot environments'
        ]
    },
    lightning: {
        name: 'Lightning Resistance',
        description: 'Reduces damage from electrical spells, storms, and shocking effects.',
        color: '#FFE93B',
        effects: [
            'Take half damage from lightning sources',
            'Advantage vs. lightning-based effects',
            'Less affected by electrical hazards'
        ]
    },
    acid: {
        name: 'Acid Resistance',
        description: 'Reduces damage from corrosive attacks, dissolving effects, and chemical burns.',
        color: '#A5FF91',
        effects: [
            'Take half damage from acid sources',
            'Advantage vs. acid-based effects',
            'Equipment less likely to corrode'
        ]
    },
    force: {
        name: 'Force Resistance',
        description: 'Reduces damage from pure magical energy and arcane forces.',
        color: '#FF8AFF',
        effects: [
            'Take half damage from force sources',
            'Advantage vs. force-based effects',
            'Rare and valuable protection'
        ]
    },
    necrotic: {
        name: 'Necrotic Resistance',
        description: 'Reduces damage from death magic, life drain, and undead attacks.',
        color: '#8C48FF',
        effects: [
            'Take half damage from necrotic sources',
            'Advantage vs. life-draining effects',
            'Better resistance to death magic'
        ]
    },
    radiant: {
        name: 'Radiant Resistance',
        description: 'Reduces damage from holy magic, divine energy, and celestial powers.',
        color: '#FFE680',
        effects: [
            'Take half damage from radiant sources',
            'Advantage vs. divine-based effects',
            'Better resistance to holy magic'
        ]
    },
    poison: {
        name: 'Poison Resistance',
        description: 'Reduces damage from toxins, venoms, and poisonous effects.',
        color: '#A5FF91',
        effects: [
            'Take half damage from poison sources',
            'Advantage vs. poison effects',
            'Better resistance to toxins'
        ]
    },
    psychic: {
        name: 'Psychic Resistance',
        description: 'Reduces damage from mental attacks, telepathy, and mind-affecting powers.',
        color: '#FF8AFF',
        effects: [
            'Take half damage from psychic sources',
            'Advantage vs. mind-affecting effects',
            'Better mental fortitude'
        ]
    },
    thunder: {
        name: 'Thunder Resistance',
        description: 'Reduces damage from sonic attacks, concussive blasts, and thunderous effects.',
        color: '#C0C0C0',
        effects: [
            'Take half damage from thunder sources',
            'Advantage vs. sound-based effects',
            'Less affected by sonic booms'
        ]
    }
};

export default function ResistanceTooltip({ type, value }) {
    if (!type || !RESISTANCE_INFO[type]) {
        return null;
    }

    const info = RESISTANCE_INFO[type];

    return (
        <div className="resistance-tooltip">
            <div className="tooltip-header" style={{ color: info.color }}>
                {info.name}
            </div>
            <div className="tooltip-value">
                Current Resistance: {value}%
            </div>
            <div className="tooltip-description">
                {info.description}
            </div>
            <div className="tooltip-effects">
                {info.effects.map((effect, index) => (
                    <div key={index} className="tooltip-effect">
                        • {effect}
                    </div>
                ))}
            </div>
            <div className="tooltip-note">
                Each point of resistance reduces incoming damage of this type by 1%.
            </div>
        </div>
    );
}
