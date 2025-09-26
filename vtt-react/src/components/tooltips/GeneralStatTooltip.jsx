import React from 'react';

const getStatDescription = (stat) => {
    const descriptions = {
        // Core Resources
        'Health': {
            title: 'Health Points',
            color: '#ff4444',
            effects: [
                'Your character\'s life force and physical condition',
                'When reduced to 0, your character becomes unconscious',
                'Restored through rest, healing spells, or potions',
                'Maximum health increases with Constitution'
            ]
        },
        'Mana': {
            title: 'Mana Points',
            color: '#4444ff',
            effects: [
                'Magical energy used to cast spells',
                'Required for most magical abilities',
                'Restored through rest or mana potions',
                'Maximum mana increases with Intelligence and Spirit'
            ]
        },
        'Action Points': {
            title: 'Action Points',
            color: '#ffd100',
            effects: [
                'Points used to perform actions in combat',
                'Regenerated each turn based on initiative roll',
                'Used for movement, attacks, and special abilities',
                'Higher initiative rolls grant more action points'
            ]
        },
        // Spell Damage Types
        'Cold Damage': {
            title: 'Cold Damage',
            color: '#3CE7FF',
            effects: [
                'Freezing damage that can slow targets',
                'Common spells: Cone of Cold, Ice Storm',
                'Can extinguish flames and freeze liquids',
                'Effective in cold environments'
            ]
        },
        'Fire Damage': {
            title: 'Fire Damage',
            color: '#FF4400',
            effects: [
                'Burning damage that ignites objects',
                'Common spells: Fireball, Fire Bolt',
                'Can light torches and melt ice',
                'Extra effective in dry environments'
            ]
        },
        'Fire Power': {
            title: 'Fire Spell Power',
            color: '#FF4500',
            effects: [
                'Increases damage of fire-based spells',
                'Affects spells like Fireball, Flame Strike, and Burning Hands',
                'Based on Intelligence and magical equipment',
                'Higher power means more devastating fire magic'
            ]
        },
        'Cold Power': {
            title: 'Cold Spell Power',
            color: '#3CE7FF',
            effects: [
                'Increases damage of cold-based spells',
                'Affects spells like Ice Storm, Cone of Cold, and Frost Bolt',
                'Based on Intelligence and magical equipment',
                'Higher power means more devastating ice magic'
            ]
        },
        'Lightning Power': {
            title: 'Lightning Spell Power',
            color: '#FFD700',
            effects: [
                'Increases damage of lightning-based spells',
                'Affects spells like Lightning Bolt, Chain Lightning, and Shock',
                'Based on Intelligence and magical equipment',
                'Higher power means more devastating electrical magic'
            ]
        },
        'Poison Power': {
            title: 'Poison Spell Power',
            color: '#9ACD32',
            effects: [
                'Increases damage of poison-based spells',
                'Affects spells like Poison Cloud, Toxic Bolt, and Venomous Strike',
                'Based on Intelligence and magical equipment',
                'Higher power means more potent toxins'
            ]
        },
        'Necrotic Power': {
            title: 'Necrotic Spell Power',
            color: '#8B008B',
            effects: [
                'Increases damage of necrotic-based spells',
                'Affects spells like Drain Life, Death Coil, and Wither',
                'Based on Intelligence and magical equipment',
                'Higher power means more devastating death magic'
            ]
        },
        'Radiant Power': {
            title: 'Radiant Spell Power',
            color: '#FFD700',
            effects: [
                'Increases damage of radiant-based spells',
                'Affects spells like Sacred Flame, Divine Light, and Holy Bolt',
                'Based on Intelligence and magical equipment',
                'Higher power means more powerful divine magic'
            ]
        },
        'Psychic Power': {
            title: 'Psychic Spell Power',
            color: '#FF69B4',
            effects: [
                'Increases damage of psychic-based spells',
                'Affects spells like Mind Blast, Psychic Lance, and Mental Crush',
                'Based on Intelligence and magical equipment',
                'Higher power means more devastating mental attacks'
            ]
        },
        'Force Power': {
            title: 'Force Spell Power',
            color: '#4169E1',
            effects: [
                'Increases damage of force-based spells',
                'Affects spells like Magic Missile, Force Bolt, and Telekinetic Strike',
                'Based on Intelligence and magical equipment',
                'Higher power means more powerful pure magical force'
            ]
        },
        'Acid Power': {
            title: 'Acid Spell Power',
            color: '#32CD32',
            effects: [
                'Increases damage of acid-based spells',
                'Affects spells like Acid Splash, Vitriolic Sphere, and Acid Arrow',
                'Based on Intelligence and magical equipment',
                'Higher power means more corrosive and destructive acid magic'
            ]
        },
        'Thunder Power': {
            title: 'Thunder Spell Power',
            color: '#4169E1',
            effects: [
                'Increases damage of thunder-based spells',
                'Affects spells like Thunderwave, Shatter, and Thunder Step',
                'Based on Intelligence and magical equipment',
                'Higher power means more devastating sonic and concussive magic'
            ]
        },
        'Lightning Damage': {
            title: 'Lightning Damage',
            color: '#FFE93B',
            effects: [
                'Electrical damage that arcs between targets',
                'Common spells: Lightning Bolt, Chain Lightning',
                'Can short out electrical devices',
                'Extra effective against metal armor'
            ]
        },
        'Acid Damage': {
            title: 'Acid Damage',
            color: '#A5FF91',
            effects: [
                'Corrosive damage that melts materials',
                'Common spells: Acid Splash, Vitriolic Sphere',
                'Can destroy objects and equipment',
                'Effective against armored targets'
            ]
        },
        'Force Damage': {
            title: 'Force Damage',
            color: '#FF8AFF',
            effects: [
                'Pure magical energy damage',
                'Common spells: Magic Missile, Spiritual Weapon',
                'Affects incorporeal creatures normally',
                'Very few creatures resist this damage'
            ]
        },
        'Necrotic Damage': {
            title: 'Necrotic Damage',
            color: '#8C48FF',
            effects: [
                'Death energy that withers matter',
                'Common spells: Chill Touch, Circle of Death',
                'Can prevent healing',
                'Extra effective against living creatures'
            ]
        },
        'Radiant Damage': {
            title: 'Radiant Damage',
            color: '#FFE680',
            effects: [
                'Divine light that sears undead',
                'Common spells: Sacred Flame, Sunbeam',
                'Can dispel darkness',
                'Extra effective against undead and fiends'
            ]
        },
        'Poison Damage': {
            title: 'Poison Damage',
            color: '#A5FF91',
            effects: [
                'Toxic damage that sickens targets',
                'Common spells: Poison Spray, Cloudkill',
                'Can cause the poisoned condition',
                'Many creatures have resistance'
            ]
        },
        'Psychic Damage': {
            title: 'Psychic Damage',
            color: '#FF8AFF',
            effects: [
                'Mental damage that assaults the mind',
                'Common spells: Vicious Mockery, Mind Sliver',
                'Bypasses physical defenses',
                'Constructs often immune'
            ]
        },
        'Thunder Damage': {
            title: 'Thunder Damage',
            color: '#C0C0C0',
            effects: [
                'Concussive damage from sound waves',
                'Common spells: Thunderwave, Shatter',
                'Can be heard from far away',
                'Extra effective against brittle objects'
            ]
        },
        // Physical Damage Types
        'Piercing Damage': {
            title: 'Piercing Damage',
            color: '#8B4513',
            effects: [
                'Damage from piercing weapons and ranged attacks',
                'Base: Agility ÷ 2 + Equipment bonuses',
                'Effective against lightly armored targets',
                'Common weapons: daggers, rapiers, arrows, crossbow bolts'
            ]
        },
        'Bludgeoning Damage': {
            title: 'Bludgeoning Damage',
            color: '#8B4513',
            effects: [
                'Damage from blunt melee weapons',
                'Base: Strength ÷ 2 + Equipment bonuses',
                'Effective against skeletons and constructs',
                'Common weapons: maces, hammers, clubs, flails'
            ]
        },
        'Slashing Damage': {
            title: 'Slashing Damage',
            color: '#8B4513',
            effects: [
                'Damage from edged melee weapons',
                'Base: Strength ÷ 2 + Equipment bonuses',
                'Effective against unarmored targets',
                'Common weapons: swords, axes, scimitars, claws'
            ]
        },
        // Other Stats
        'Spell Power': {
            title: 'Spell Power',
            color: '#69CCF0',
            effects: [
                'Increases magical damage and healing',
                'Adds to spell damage rolls',
                'Different schools gain additional bonuses'
            ]
        },
        // Individual Spell Power Types (matching store names)
        'Fire Spell Power': {
            title: 'Fire Spell Power',
            color: '#FF4400',
            effects: [
                'Increases damage of Fire spells',
                'Adds to Fire spell damage rolls',
                'Enhances burning effects and heat-based magic'
            ]
        },
        'Cold Spell Power': {
            title: 'Cold Spell Power',
            color: '#3CE7FF',
            effects: [
                'Increases damage of Cold spells',
                'Adds to Cold spell damage rolls',
                'Enhances freezing effects and ice-based magic'
            ]
        },
        'Lightning Spell Power': {
            title: 'Lightning Spell Power',
            color: '#FFFF00',
            effects: [
                'Increases damage of Lightning spells',
                'Adds to Lightning spell damage rolls',
                'Enhances electrical effects and storm magic'
            ]
        },

        'Force Spell Power': {
            title: 'Force Spell Power',
            color: '#FF8AFF',
            effects: [
                'Increases damage of Force spells',
                'Adds to Force spell damage rolls',
                'Enhances pure magic and arcane force effects'
            ]
        },
        'Necrotic Spell Power': {
            title: 'Necrotic Spell Power',
            color: '#8C48FF',
            effects: [
                'Increases damage of Necrotic spells',
                'Adds to Necrotic spell damage rolls',
                'Enhances death magic and life-draining effects'
            ]
        },
        'Radiant Spell Power': {
            title: 'Radiant Spell Power',
            color: '#FFE680',
            effects: [
                'Increases damage of Radiant spells',
                'Adds to Radiant spell damage rolls',
                'Enhances divine magic and holy light effects'
            ]
        },
        'Poison Spell Power': {
            title: 'Poison Spell Power',
            color: '#00FF00',
            effects: [
                'Increases damage of Poison spells',
                'Adds to Poison spell damage rolls',
                'Enhances toxic effects and venomous magic'
            ]
        },
        'Psychic Spell Power': {
            title: 'Psychic Spell Power',
            color: '#FF69B4',
            effects: [
                'Increases damage of Psychic spells',
                'Adds to Psychic spell damage rolls',
                'Enhances mental magic and mind effects'
            ]
        },

        'Melee Power': {
            title: 'Melee Power',
            color: '#FF4D4D',
            effects: [
                'Increases physical damage with melee weapons',
                'Adds to melee attack rolls',
                'Improves combat maneuvers'
            ]
        },
        'Ranged Power': {
            title: 'Ranged Power',
            color: '#AAD372',
            effects: [
                'Increases physical damage with ranged weapons',
                'Adds to ranged attack rolls',
                'Improves shot accuracy'
            ]
        },
        'Initiative': {
            title: 'Initiative',
            color: '#AAD372',
            effects: [
                'Determines turn order in combat',
                'Adds to initiative rolls',
                'Higher values act earlier in combat'
            ]
        },
        'Movement Speed': {
            title: 'Movement Speed',
            color: '#AAD372',
            effects: [
                'Base movement per turn',
                'Affected by armor and encumbrance',
                'Modified by terrain and conditions'
            ]
        },
        'Vision Range': {
            title: 'Vision Range',
            color: '#AAD372',
            effects: [
                'How far you can see in normal light conditions',
                'Determines perception range for spotting enemies',
                'Affected by lighting and environmental conditions',
                'Base vision for most characters is 120 feet'
            ]
        },
        'Darkvision': {
            title: 'Darkvision',
            color: '#9370DB',
            effects: [
                'Ability to see in complete darkness',
                'Allows normal vision in dark environments',
                'Common racial trait for dwarves, elves, and other races',
                'Typically ranges from 60 to 120 feet',
                'Does not work in magical darkness'
            ]
        },
        'Swim Speed': {
            title: 'Swim Speed',
            color: '#AAD372',
            effects: [
                'How fast you can swim through water.',
                'Without swim speed, you must spend extra movement to swim.'
            ]
        },
        'Armor': {
            title: 'Armor',
            color: '#C0C0C0',
            effects: [
                'Reduces physical damage taken',
                'Base: Agility ÷ 2',
                'Enhanced by armor equipment',
                'Higher values provide better protection'
            ]
        },
        'Dodge': {
            title: 'Dodge',
            color: '#AAD372',
            effects: [
                'Chance to completely avoid attacks',
                'Base: Agility ÷ 3',
                'Each point gives 1% dodge chance',
                'Works against physical and some magical attacks'
            ]
        },
        'Armor Class': {
            title: 'Armor',
            color: '#FFF',
            effects: [
                'Determines difficulty to be hit',
                'Enemy must roll higher than armor to hit',
                'Some attacks may target different defenses'
            ]
        },
        'Max Health': {
            title: 'Maximum Health',
            color: '#FF7D0A',
            effects: [
                'Your total health pool',
                'Increased by Constitution modifier',
                'Death saves at 0 HP'
            ]
        },
        'Max Mana': {
            title: 'Maximum Mana',
            color: '#69CCF0',
            effects: [
                'Your total mana pool',
                'Increased by Intelligence modifier',
                'Required for casting spells'
            ]
        },
        'Health Regeneration': {
            title: 'Health Regeneration',
            color: '#FF7D0A',
            effects: [
                'Health restored each round',
                'Active in and out of combat',
                'Doubled during short rests'
            ]
        },
        'Mana Regeneration': {
            title: 'Mana Regeneration',
            color: '#69CCF0',
            effects: [
                'Mana restored each round',
                'Increased during short rests',
                'Affected by Spirit modifier'
            ]
        },
        'Healing Received': {
            title: 'Healing Received',
            color: '#FFFFFF',
            effects: [
                'Bonus to healing received',
                'Applies to all healing sources',
                'Stacks with healing modifiers'
            ]
        },
        'Healing Power': {
            title: 'Healing Power',
            color: '#FFFFFF',
            effects: [
                'Increases healing done by spells',
                'Adds to healing spell rolls',
                'Affected by Spirit modifier'
            ]
        },
        'Carrying Capacity': {
            title: 'Carrying Capacity',
            color: '#FF4D4D',
            effects: [
                'Base: 5x5 inventory grid',
                'Encumbered: -10ft movement',
                'Heavily Encumbered: -20ft, disadvantage on checks'
            ]
        },
        'Resistances': {
            title: 'Resistances',
            color: '#69CCF0',
            effects: [
                'Reduces incoming damage from specific damage types',
                'Higher resistances mean better survival against elemental threats',
                'Can be improved through gear and special abilities'
            ]
        },
        'Passive Perception': {
            title: 'Passive Perception',
            color: '#FFD700',
            effects: [
                'Your awareness of surroundings without actively looking',
                'Used to notice hidden enemies, traps, and secrets',
                'Calculated as 10 + Spirit modifier',
                'Higher values detect threats more easily'
            ]
        },
        'Ranged Damage': {
            title: 'Ranged Damage',
            color: '#228B22',
            effects: [
                'Damage with ranged weapons like bows and crossbows',
                'Base: Agility ÷ 2 + Equipment bonuses',
                'Effective at long distances',
                'Common weapons: bows, crossbows, throwing weapons'
            ]
        },
        'Climb Speed': {
            title: 'Climb Speed',
            color: '#8B4513',
            effects: [
                'How fast you can climb walls and surfaces',
                'Without climb speed, climbing costs extra movement',
                'Useful for scaling obstacles and reaching high places'
            ]
        },
    };

    return descriptions[stat];
};

const GeneralStatTooltip = ({ stat, value, baseValue, equipmentBonus, encumbranceEffect, encumbranceDescription, buffEffect, debuffEffect, description }) => {
    const info = getStatDescription(stat);

    // Build calculation breakdown for derived stats
    const buildCalculationBreakdown = () => {
        if (baseValue === undefined || value === undefined || typeof value !== 'number') return null;

        const parts = [];
        // Use explicit equipment bonus if provided, otherwise calculate it properly
        // Don't include encumbrance effects in equipment calculation
        let equipmentValue = equipmentBonus || 0;

        // If no explicit equipment bonus is provided and we have encumbrance effects,
        // calculate equipment as: final_value - base_value - encumbrance_effect
        if (!equipmentBonus && encumbranceEffect !== undefined) {
            equipmentValue = (value || 0) - (baseValue || 0) - (encumbranceEffect || 0);
        } else if (!equipmentBonus && encumbranceEffect === undefined) {
            // Fallback to old behavior if no encumbrance info
            equipmentValue = (value || 0) - (baseValue || 0);
        }

        // Always show base
        parts.push(`${Math.round(baseValue)} (base)`);

        // Add equipment if non-zero
        if (equipmentValue !== 0) {
            parts.push(`${equipmentValue > 0 ? '+' : ''}${Math.round(equipmentValue)} (equipment)`);
        }

        // Add encumbrance if provided and non-zero
        if (encumbranceEffect !== undefined && encumbranceEffect !== 0) {
            parts.push(`${encumbranceEffect > 0 ? '+' : ''}${Math.round(encumbranceEffect)} (encumbrance)`);
        }

        // Add buffs if provided and non-zero
        if (buffEffect !== undefined && buffEffect !== 0) {
            parts.push(`${buffEffect > 0 ? '+' : ''}${Math.round(buffEffect)} (buffs)`);
        }

        // Add debuffs if provided and non-zero
        if (debuffEffect !== undefined && debuffEffect !== 0) {
            parts.push(`${debuffEffect > 0 ? '+' : ''}${Math.round(debuffEffect)} (debuffs)`);
        }

        // Calculate the total from the components
        const total = Math.round(baseValue) +
                     Math.round(equipmentValue) +
                     Math.round(encumbranceEffect || 0) +
                     Math.round(buffEffect || 0) +
                     Math.round(debuffEffect || 0);

        return `${parts.join(' ')} = ${total}`;
    };

    return (
        <>
            <div className="equipment-slot-name">
                {info?.title || stat}
            </div>
            {value !== undefined && (
                <div className="equipment-slot-description">
                    Current Value: {typeof value === 'string' ? value : Math.round(value)}
                </div>
            )}
            {description && (
                <div className="equipment-slot-description">
                    {description}
                </div>
            )}
            {info?.effects?.map((effect, index) => (
                <div key={index} className="equipment-slot-description">
                    • {effect}
                </div>
            ))}
            {baseValue !== undefined && value !== undefined && typeof value === 'number' && (
                <div className="equipment-slot-description">
                    <strong>Calculation:</strong> {buildCalculationBreakdown()}
                </div>
            )}
        </>
    );
};

export default GeneralStatTooltip;
