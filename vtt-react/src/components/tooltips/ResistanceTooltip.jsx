import React from 'react';

const RESISTANCE_INFO = {
    frost: {
        name: 'Frost Resistance',
        description: 'Reduces damage from frost spells, blizzards, and freezing effects.',
        color: '#87CEEB',
        effects: [
            'Take half damage from frost sources',
            'Advantage vs. frost-based effects',
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
    arcane: {
        name: 'Arcane Resistance',
        description: 'Reduces damage from arcane magic, spell energy, and magical forces.',
        color: '#9370DB',
        effects: [
            'Take half damage from arcane sources',
            'Advantage vs. arcane-based effects',
            'Better resistance to pure magical energy'
        ]
    },
    nature: {
        name: 'Nature Resistance',
        description: 'Reduces damage from natural forces, primal magic, and elemental nature.',
        color: '#228B22',
        effects: [
            'Take half damage from nature sources',
            'Advantage vs. nature-based effects',
            'Better harmony with natural forces'
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
    chaos: {
        name: 'Chaos Resistance',
        description: 'Reduces damage from chaotic magic, wild energy, and unpredictable forces.',
        color: '#ec4899',
        effects: [
            'Take half damage from chaos sources',
            'Advantage vs. chaos-based effects',
            'Better resistance to unpredictable magic'
        ]
    },
    void: {
        name: 'Void Resistance',
        description: 'Reduces damage from void energy, the absence of existence, and consuming forces.',
        color: '#1a1a2e',
        effects: [
            'Take half damage from void sources',
            'Advantage vs. void-based effects',
            'Better resistance to nothingness and void magic'
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

export default function ResistanceTooltip({ type, level, value, damageType, resistanceData, sources = [] }) {
    // Handle both old and new parameter formats
    const resistanceType = type || damageType?.toLowerCase();
    
    // Handle new numeric level system or legacy string system
    // If resistanceData is provided (object with level and multiplier), use that
    // Otherwise, use the level prop directly
    let resistanceLevel = level;
    let multiplier = 1.0;
    
    if (resistanceData && typeof resistanceData === 'object') {
        resistanceLevel = resistanceData.level;
        multiplier = resistanceData.multiplier || 1.0;
    } else if (typeof level === 'object' && level !== null) {
        // Level might be an object with level and multiplier properties
        resistanceLevel = level.level;
        multiplier = level.multiplier || 1.0;
    } else if (typeof level === 'number') {
        // Numeric level - convert to appropriate string for backward compatibility
        resistanceLevel = level;
        // Estimate multiplier from level if not provided
        if (level === 0) {
            multiplier = 0.0;
        } else if (level === 50) {
            multiplier = 0.5;
        } else if (level === 75) {
            multiplier = 0.75;
        } else if (level === 100) {
            multiplier = 1.0;
        } else if (level === 150) {
            multiplier = 1.5;
        } else if (level === 200) {
            multiplier = 2.0;
        } else {
            multiplier = level / 100;
        }
    } else {
        // Legacy string system
        resistanceLevel = level || 'normal';
    }

    if (!resistanceType || !RESISTANCE_INFO[resistanceType]) {
        return null;
    }

    const info = RESISTANCE_INFO[resistanceType];

    // Get level-specific information - handles both numeric and string levels
    const getLevelInfo = (level, multiplierValue) => {
        // Handle numeric levels
        if (typeof level === 'number') {
            if (level === 0 || multiplierValue === 0) {
                return {
                    name: 'Immune',
                    description: 'Takes no damage from this type',
                    multiplier: '0%',
                    color: '#4CAF50'
                };
            } else if (level === 50 || (multiplierValue > 0 && multiplierValue < 1.0 && multiplierValue <= 0.5)) {
                return {
                    name: 'Resistant',
                    description: 'Takes half damage from this type',
                    multiplier: `${Math.round(multiplierValue * 100)}%`,
                    color: '#2196F3'
                };
            } else if (level === 75 || (multiplierValue > 0.5 && multiplierValue < 1.0)) {
                return {
                    name: 'Guarded',
                    description: 'Takes reduced damage from this type',
                    multiplier: `${Math.round(multiplierValue * 100)}%`,
                    color: '#8BC34A'
                };
            } else if (level === 150 || (multiplierValue > 1.0 && multiplierValue < 2.0)) {
                return {
                    name: 'Exposed',
                    description: `Takes ${Math.round((multiplierValue - 1) * 100)}% more damage (${Math.round(multiplierValue * 100)}% total)`,
                    multiplier: `${Math.round(multiplierValue * 100)}%`,
                    color: '#FF9800'
                };
            } else if (level === 200 || multiplierValue >= 2.0) {
                return {
                    name: 'Vulnerable',
                    description: `Takes double damage (${Math.round(multiplierValue * 100)}% total)`,
                    multiplier: `${Math.round(multiplierValue * 100)}%`,
                    color: '#F44336'
                };
            } else {
                return {
                    name: 'Normal',
                    description: 'Takes normal damage from this type',
                    multiplier: `${Math.round(multiplierValue * 100)}%`,
                    color: '#9E9E9E'
                };
            }
        }
        
        // Handle legacy string levels
        const levelStr = typeof level === 'string' ? level.toLowerCase() : String(level).toLowerCase();
        switch (levelStr) {
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
                    description: 'Takes 50% more damage (150% total)',
                    multiplier: '150%',
                    color: '#FF9800'
                };
            case 'vulnerable':
                return {
                    name: 'Vulnerable',
                    description: 'Takes double damage (200% total)',
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

    const levelInfo = getLevelInfo(resistanceLevel, multiplier);

    // Get level-specific description and effects - handles both numeric and string levels
    const getLevelSpecificContent = (damageType, level, multiplierValue) => {
        const typeName = damageType.charAt(0).toUpperCase() + damageType.slice(1);
        
        // Handle numeric levels
        if (typeof level === 'number') {
            if (level === 0 || multiplierValue === 0) {
                return {
                    description: `Completely immune to ${damageType} damage and effects.`,
                    effects: [
                        `Takes no damage from ${damageType} sources`,
                        `Immune to ${damageType}-based effects`,
                        `Complete protection from ${damageType} attacks`
                    ]
                };
            } else if (level === 50 || (multiplierValue > 0 && multiplierValue < 1.0 && multiplierValue <= 0.5)) {
                return {
                    description: `Reduces damage from ${damageType} spells, attacks, and effects.`,
                    effects: [
                        `Take half damage from ${damageType} sources`,
                        `Advantage vs. ${damageType}-based effects`,
                        `Better resistance to ${damageType} attacks`
                    ]
                };
            } else if (level === 75 || (multiplierValue > 0.5 && multiplierValue < 1.0)) {
                return {
                    description: `Reduces damage from ${damageType} spells, attacks, and effects.`,
                    effects: [
                        `Take ${Math.round(multiplierValue * 100)}% damage from ${damageType} sources`,
                        `Advantage vs. ${damageType}-based effects`,
                        `Better resistance to ${damageType} attacks`
                    ]
                };
            } else if (level === 150 || (multiplierValue > 1.0 && multiplierValue < 2.0)) {
                return {
                    description: `Takes ${Math.round((multiplierValue - 1) * 100)}% more damage from ${damageType} spells, attacks, and effects (${Math.round(multiplierValue * 100)}% total).`,
                    effects: [
                        `Take ${Math.round(multiplierValue * 100)}% damage from ${damageType} sources (${Math.round((multiplierValue - 1) * 100)}% more than normal)`,
                        `Disadvantage vs. ${damageType}-based effects`,
                        `More vulnerable to ${damageType} attacks`
                    ]
                };
            } else if (level === 200 || multiplierValue >= 2.0) {
                return {
                    description: `Takes double damage from ${damageType} spells, attacks, and effects (${Math.round(multiplierValue * 100)}% total).`,
                    effects: [
                        `Take ${Math.round(multiplierValue * 100)}% damage from ${damageType} sources (double normal damage)`,
                        `Severe disadvantage vs. ${damageType}-based effects`,
                        `Highly vulnerable to ${damageType} attacks`
                    ]
                };
            }
        }
        
        // Handle legacy string levels
        const levelStr = typeof level === 'string' ? level.toLowerCase() : String(level).toLowerCase();
        switch (levelStr) {
            case 'immune':
                return {
                    description: `Completely immune to ${damageType} damage and effects.`,
                    effects: [
                        `Takes no damage from ${damageType} sources`,
                        `Immune to ${damageType}-based effects`,
                        `Complete protection from ${damageType} attacks`
                    ]
                };
            case 'resistant':
                return {
                    description: `Reduces damage from ${damageType} spells, attacks, and effects.`,
                    effects: [
                        `Take half damage from ${damageType} sources`,
                        `Advantage vs. ${damageType}-based effects`,
                        `Better resistance to ${damageType} attacks`
                    ]
                };
            case 'exposed':
                return {
                    description: `Takes 50% more damage from ${damageType} spells, attacks, and effects (150% total).`,
                    effects: [
                        `Take 150% damage from ${damageType} sources (50% more than normal)`,
                        `Disadvantage vs. ${damageType}-based effects`,
                        `More vulnerable to ${damageType} attacks`
                    ]
                };
            case 'vulnerable':
                return {
                    description: `Takes double damage from ${damageType} spells, attacks, and effects (200% total).`,
                    effects: [
                        `Take 200% damage from ${damageType} sources (double normal damage)`,
                        `Severe disadvantage vs. ${damageType}-based effects`,
                        `Highly vulnerable to ${damageType} attacks`
                    ]
                };
            default:
                return {
                    description: info.description,
                    effects: info.effects
                };
        }
    };

    const levelContent = getLevelSpecificContent(resistanceType, resistanceLevel, multiplier);

    // Build calculation breakdown showing sources
    const buildCalculationBreakdown = () => {
        if (!sources || sources.length === 0) {
            // If no sources and it's normal, don't show calculation
            if (typeof resistanceLevel === 'number' && resistanceLevel === 100) {
                return null;
            }
            // If it's not normal but no sources, show base
            return 'Base: Normal (100% damage)';
        }

        const parts = [];
        
        // Start with base
        parts.push('Base: Normal (100% damage)');
        
        // Check if there's an immunity source
        const hasImmunity = sources.some(source => source.type === 'immunity');
        
        // Track total flat reduction
        let totalFlatReduction = 0;
        
        // Add each source
        sources.forEach(source => {
            if (source.type === 'immunity') {
                parts.push(`Complete immunity from ${source.name}${source.condition || ''}`);
            } else if (source.type === 'flat_reduction') {
                const flatValue = typeof source.value === 'number' ? source.value : source.value;
                totalFlatReduction += flatValue;
                parts.push(`-${flatValue} flat damage reduction from ${source.name}${source.condition || ''}`);
            } else if (source.type === 'resistance') {
                const percent = typeof source.value === 'number' ? source.value : source.value;
                parts.push(`${percent > 0 ? '+' : ''}${percent}% resistance from ${source.name}${source.condition || ''}`);
            } else if (source.type === 'vulnerability') {
                const percent = typeof source.value === 'number' ? source.value : source.value;
                parts.push(`${percent > 0 ? '+' : ''}${percent}% vulnerability from ${source.name}${source.condition || ''}`);
            } else {
                parts.push(`${source.value} from ${source.name}${source.condition || ''}`);
            }
        });
        
        // Add final result
        if (totalFlatReduction > 0) {
            // If there's flat reduction, show it as "Normal (100% Damage) - {totalFlatReduction}"
            parts.push(`= Normal (100% Damage) - ${totalFlatReduction}`);
        } else {
            // Otherwise show percentage-based result
            const finalMultiplier = (multiplier !== undefined && multiplier !== null) ? multiplier : 1.0;
            const finalPercent = hasImmunity || finalMultiplier === 0 || resistanceLevel === 0 ? 0 : Math.round(finalMultiplier * 100);
            parts.push(`= ${finalPercent}% damage taken`);
        }
        
        return parts.join('\n');
    };

    const calculationBreakdown = buildCalculationBreakdown();

    return (
        <>
            <div className="equipment-slot-name">
                {info.name} - {levelInfo.name}
            </div>
            <div className="equipment-slot-description">
                Damage Taken: {levelInfo.multiplier} • {levelInfo.description}
            </div>
            <div className="equipment-slot-description">
                {levelContent.description}
            </div>
            {((typeof resistanceLevel === 'number' && resistanceLevel !== 100) || 
              (typeof resistanceLevel === 'string' && resistanceLevel !== 'normal')) && 
             levelContent.effects && levelContent.effects.map((effect, index) => (
                <div key={index} className="equipment-slot-description">
                    • {effect}
                </div>
            ))}
            {calculationBreakdown && (
                <div className="equipment-slot-description" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <strong>Calculation:</strong>
                    <div style={{ marginTop: '4px', whiteSpace: 'pre-line', fontSize: '0.9em', lineHeight: '1.4' }}>
                        {calculationBreakdown}
                    </div>
                </div>
            )}
        </>
    );
}
