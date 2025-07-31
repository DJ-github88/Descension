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
    },
    bludgeoning: {
        name: 'Bludgeoning Resistance',
        description: 'Reduces damage from blunt weapons, clubs, hammers, and crushing attacks.',
        color: '#8B4513',
        effects: [
            'Take half damage from bludgeoning sources',
            'Advantage vs. crushing effects',
            'Better resistance to blunt trauma'
        ]
    },
    piercing: {
        name: 'Piercing Resistance',
        description: 'Reduces damage from arrows, spears, daggers, and stabbing attacks.',
        color: '#C0C0C0',
        effects: [
            'Take half damage from piercing sources',
            'Advantage vs. puncturing effects',
            'Better resistance to penetrating wounds'
        ]
    },
    slashing: {
        name: 'Slashing Resistance',
        description: 'Reduces damage from swords, axes, claws, and cutting attacks.',
        color: '#DC143C',
        effects: [
            'Take half damage from slashing sources',
            'Advantage vs. cutting effects',
            'Better resistance to lacerating wounds'
        ]
    }
};

export default function ResistanceTooltip({ type, level, value, damageType }) {
    // Handle both old and new parameter formats
    const resistanceType = type || damageType?.toLowerCase();
    const resistanceLevel = level || 'normal';

    if (!resistanceType || !RESISTANCE_INFO[resistanceType]) {
        return null;
    }

    const info = RESISTANCE_INFO[resistanceType];

    // Get level-specific information
    const getLevelInfo = (level) => {
        switch (level?.toLowerCase()) {
            case 'immune':
                return {
                    name: 'Immune',
                    description: 'Takes no damage from this type',
                    multiplier: '0%',
                    color: '#4CAF50'
                };
            case 'resistant':
                return {
                    name: 'Resistant',
                    description: 'Takes half damage from this type',
                    multiplier: '50%',
                    color: '#2196F3'
                };
            case 'exposed':
                return {
                    name: 'Exposed',
                    description: 'Takes increased damage from this type',
                    multiplier: '150%',
                    color: '#FF9800'
                };
            case 'vulnerable':
                return {
                    name: 'Vulnerable',
                    description: 'Takes double damage from this type',
                    multiplier: '200%',
                    color: '#F44336'
                };
            default:
                return {
                    name: 'Normal',
                    description: 'Takes normal damage from this type',
                    multiplier: '100%',
                    color: '#9E9E9E'
                };
        }
    };

    const levelInfo = getLevelInfo(resistanceLevel);

    return (
        <>
            <div className="equipment-slot-name">
                {info.name} - {levelInfo.name}
            </div>
            <div className="equipment-slot-description">
                Damage Taken: {levelInfo.multiplier} • {levelInfo.description}
            </div>
            <div className="equipment-slot-description">
                {info.description}
            </div>
            {resistanceLevel !== 'normal' && info.effects.map((effect, index) => (
                <div key={index} className="equipment-slot-description">
                    • {effect}
                </div>
            ))}
        </>
    );
}
