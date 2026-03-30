import React from 'react';

const getConditionDescription = (condition) => {
    const descriptions = {
        fear: {
            title: 'Fear',
            effects: [
                'You are frightened. You have disadvantage on ability checks and attack rolls while the source of your fear is within line of sight.',
                'You can\'t willingly move closer to the source of your fear.'
            ]
        },
        charm: {
            title: 'Charm',
            effects: [
                'A charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects.',
                'The charmer has advantage on any ability check to interact socially with the creature.'
            ]
        },
        stun: {
            title: 'Stun',
            effects: [
                'A stunned creature is incapacitated, can\'t move, and can speak only falteringly.',
                'The creature automatically fails Strength and Dexterity saving throws.',
                'Attack rolls against the creature have advantage.'
            ]
        },
        paralyze: {
            title: 'Paralyze',
            effects: [
                'A paralyzed creature is incapacitated and can\'t move or speak.',
                'The creature automatically fails Strength and Agility saving throws.',
                'Attack rolls against the creature have advantage.',
                'Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.'
            ]
        },
        poison: {
            title: 'Poison',
            effects: [
                'A poisoned creature has disadvantage on attack rolls and ability checks.'
            ]
        },
        disease: {
            title: 'Disease',
            effects: [
                'A diseased creature suffers ongoing effects based on the specific disease.',
                'Diseases can cause ability score reduction, ongoing damage, or other debilitating effects.'
            ]
        },
        sleep: {
            title: 'Sleep',
            effects: [
                'A sleeping creature is unconscious.',
                'The creature wakes up if it takes damage, or if someone uses an action to shake or slap it awake.'
            ]
        },
        petrify: {
            title: 'Petrify',
            effects: [
                'A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone).',
                'The creature\'s weight increases by a factor of ten, and it ceases aging.'
            ]
        },
        blinded: {
            title: 'Blinded',
            effects: [
                'A blinded creature can\'t see and automatically fails any ability check that requires sight.',
                'Attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage.'
            ]
        },
        deafened: {
            title: 'Deafened',
            effects: [
                'A deafened creature can\'t hear and automatically fails any ability check that requires hearing.'
            ]
        },
        prone: {
            title: 'Prone',
            effects: [
                'A prone creature\'s only movement option is to crawl, unless it stands up and thereby ends the condition.',
                'The creature has disadvantage on attack rolls.',
                'An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.'
            ]
        },
        restrained: {
            title: 'Restrained',
            effects: [
                'A restrained creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed.',
                'Attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage.',
                'The creature has disadvantage on Dexterity saving throws.'
            ]
        },
        grappled: {
            title: 'Grappled',
            effects: [
                'A grappled creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed.',
                'The condition ends if the grappler is incapacitated.',
                'The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect.'
            ]
        },
        exhaustion: {
            title: 'Exhaustion',
            effects: [
                'Exhaustion is measured in six levels. Each level applies cumulative penalties:',
                'Level 1: Disadvantage on ability checks.',
                'Level 2: Speed halved.',
                'Level 3: Disadvantage on attack rolls and saving throws.',
                'Level 4: Hit point maximum halved.',
                'Level 5: Speed reduced to 0.',
                'Level 6: Death.'
            ]
        },
        frightened: {
            title: 'Frightened',
            effects: [
                'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.',
                'The creature can\'t willingly move closer to the source of its fear.'
            ]
        },
        confused: {
            title: 'Confused',
            effects: [
                'Target can\'t take reactions and must roll a d10 at the start of each of its turns to determine its behavior for that turn.',
                '1: The creature uses all its movement to move in a random direction.',
                '2-6: The creature doesn\'t move or take actions this turn.',
                '7-8: The creature uses its action to make a melee attack against a randomly determined creature within its reach.',
                '9-10: The creature can act and move normally.'
            ]
        },
        incapacitated: {
            title: 'Incapacitated',
            effects: [
                'An incapacitated creature can\'t take actions or reactions.'
            ]
        },
        unconscious: {
            title: 'Unconscious',
            effects: [
                'An unconscious creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.',
                'The creature drops whatever it\'s holding and falls prone.',
                'The creature automatically fails Strength and Dexterity saving throws.',
                'Attack rolls against the creature have advantage.',
                'Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.'
            ]
        }
    };

    return descriptions[condition.toLowerCase()];
};

const ConditionTooltip = ({ condition, hasResistance, equipmentModifier, sources = [] }) => {
    const info = getConditionDescription(condition);
    const conditionName = condition.charAt(0).toUpperCase() + condition.slice(1);

    // Build calculation breakdown showing sources
    const buildCalculationBreakdown = () => {
        if (!sources || sources.length === 0) {
            return null;
        }

        const parts = [];
        parts.push('Base: Normal');
        
        sources.forEach(source => {
            const modifierMap = {
                'immune': 'Immune',
                'double_advantage': 'Double Advantage',
                'advantage': 'Advantage',
                'double_disadvantage': 'Double Disadvantage',
                'disadvantage': 'Disadvantage'
            };
            const modifierText = modifierMap[source.modifier] || source.modifier;
            parts.push(`${modifierText} from ${source.name}${source.condition || ''}`);
        });
        
        // Add final result
        if (equipmentModifier) {
            const modifierMap = {
                'immune': 'Immune',
                'double_advantage': 'Double Advantage',
                'advantage': 'Advantage',
                'double_disadvantage': 'Double Disadvantage',
                'disadvantage': 'Disadvantage'
            };
            parts.push(`= ${modifierMap[equipmentModifier.modifier] || equipmentModifier.modifier}`);
        } else if (hasResistance) {
            parts.push('= Advantage');
        } else {
            parts.push('= Normal');
        }
        
        return parts.join('\n');
    };

    const calculationBreakdown = buildCalculationBreakdown();

    return (
        <>
            <div className="equipment-slot-name">
                {info?.title || conditionName}
            </div>
            {info?.effects?.map((effect, index) => (
                <div key={index} className="equipment-slot-description">
                    • {effect}
                </div>
            ))}
            {(hasResistance || equipmentModifier) && (
                <div className="equipment-slot-description" style={{ 
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid #8b7355',
                    color: equipmentModifier?.modifier === 'immune' ? '#2e7d32' :
                           equipmentModifier?.modifier === 'double_advantage' ? '#1b5e20' :
                           equipmentModifier?.modifier === 'advantage' ? '#4caf50' :
                           equipmentModifier?.modifier === 'double_disadvantage' ? '#c62828' :
                           equipmentModifier?.modifier === 'disadvantage' ? '#f44336' :
                           '#228B22',
                    fontWeight: 'bold'
                }}>
                    {equipmentModifier?.modifier === 'immune' && '✓ Immune to this condition'}
                    {equipmentModifier?.modifier === 'double_advantage' && '✓ Double advantage on saves against this condition'}
                    {equipmentModifier?.modifier === 'advantage' && '✓ Advantage on saves against this condition'}
                    {equipmentModifier?.modifier === 'double_disadvantage' && '✗ Double disadvantage on saves against this condition'}
                    {equipmentModifier?.modifier === 'disadvantage' && '✗ Disadvantage on saves against this condition'}
                    {!equipmentModifier && hasResistance && '✓ You have advantage on saves against this condition'}
                </div>
            )}
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
};

export default ConditionTooltip;

