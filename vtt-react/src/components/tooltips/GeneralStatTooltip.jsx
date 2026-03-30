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
        'Frost Damage': {
            title: 'Frost Damage',
            color: '#87CEEB',
            effects: [
                'Freezing damage that can slow targets',
                'Common spells: Cone of Cold, Ice Storm, Frost Bolt',
                'Can extinguish flames and freeze liquids',
                'Effective in cold environments',
                'Frost damage creates difficult terrain and can immobilize enemies'
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
        'Frost Power': {
            title: 'Frost Spell Power',
            color: '#87CEEB',
            effects: [
                'Increases damage of frost-based spells',
                'Affects spells like Ice Storm, Cone of Cold, Frost Bolt, and Freezing Ray',
                'Based on Intelligence and magical equipment',
                'Higher power means more devastating frost magic',
                'Frost spells can slow enemies and freeze liquids'
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
        'Arcane Power': {
            title: 'Arcane Spell Power',
            color: '#9370DB',
            effects: [
                'Increases damage of arcane-based spells',
                'Affects spells like Arcane Blast, Magic Missile, and Arcane Barrage',
                'Based on Intelligence and magical equipment',
                'Higher power means more devastating pure magical energy',
                'Arcane magic manipulates the fundamental forces of reality'
            ]
        },
        'Nature Power': {
            title: 'Nature Spell Power',
            color: '#228B22',
            effects: [
                'Increases damage of nature-based spells',
                'Affects spells like Entangle, Call Lightning, and Thorn Whip',
                'Based on Intelligence and magical equipment',
                'Higher power means more powerful primal and natural magic',
                'Nature magic draws from the living world and elemental forces'
            ]
        },
        'Void Power': {
            title: 'Void Spell Power',
            color: '#1a1a2e',
            effects: [
                'Increases damage of void-based spells',
                'Affects spells like Void Bolt, Abyssal Strike, and Consuming Darkness',
                'Based on Intelligence and Spirit with magical equipment',
                'Higher power means more devastating void magic',
                'Void magic represents the absence of existence and consuming forces'
            ]
        },
        'Chaos Power': {
            title: 'Chaos Spell Power',
            color: '#ec4899',
            effects: [
                'Increases damage of chaos-based spells',
                'Affects spells with unpredictable magical energy that defies categorization',
                'Based on Intelligence and Spirit with magical equipment',
                'Higher power means more devastating and unpredictable chaos magic'
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
        'Arcane Damage': {
            title: 'Arcane Damage',
            color: '#9370DB',
            effects: [
                'Pure magical energy from arcane sources',
                'Common spells: Arcane Blast, Magic Missile, Arcane Barrage',
                'Manipulates the fundamental forces of reality',
                'Few creatures have natural resistance to arcane magic'
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
        'Nature Damage': {
            title: 'Nature Damage',
            color: '#228B22',
            effects: [
                'Primal energy from the living world',
                'Common spells: Entangle, Call Lightning, Thorn Whip',
                'Draws power from natural forces and elemental nature',
                'Effective against constructs and corrupted beings'
            ]
        },
        'Void Damage': {
            title: 'Void Damage',
            color: '#1a1a2e',
            effects: [
                'The absence of existence, consuming all it touches',
                'Common spells: Void Bolt, Abyssal Strike, Consuming Darkness',
                'Represents nothingness and consuming forces',
                'Extra effective against light-aligned creatures'
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
        'Frost Spell Power': {
            title: 'Frost Spell Power',
            color: '#87CEEB',
            effects: [
                'Increases damage of Frost spells',
                'Adds to Frost spell damage rolls',
                'Enhances freezing effects and ice-based magic',
                'Frost spells can slow enemies and create difficult terrain'
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
        'Arcane Spell Power': {
            title: 'Arcane Spell Power',
            color: '#9370DB',
            effects: [
                'Increases damage of Arcane spells',
                'Adds to Arcane spell damage rolls',
                'Enhances pure magical energy and reality manipulation',
                'Arcane magic is the foundation of all spellcasting'
            ]
        },
        'Chaos Spell Power': {
            title: 'Chaos Spell Power',
            color: '#ec4899',
            effects: [
                'Increases damage of Chaos spells',
                'Adds to Chaos spell damage rolls',
                'Enhances unpredictable magic and random effects',
                'Chaos magic defies categorization and creates wild effects'
            ]
        },
        'Nature Spell Power': {
            title: 'Nature Spell Power',
            color: '#228B22',
            effects: [
                'Increases damage of Nature spells',
                'Adds to Nature spell damage rolls',
                'Enhances primal magic and natural forces',
                'Nature magic draws power from the living world'
            ]
        },
        'Void Spell Power': {
            title: 'Void Spell Power',
            color: '#1a1a2e',
            effects: [
                'Increases damage of Void spells',
                'Adds to Void spell damage rolls',
                'Enhances consuming forces and the absence of existence',
                'Void magic represents nothingness and consuming darkness'
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
                'Higher values provide better protection',
                'Used to calculate Passive DR (Armor ÷ 10)',
                'At 0 Armor, you have no passive damage reduction'
            ]
        },
        'Dodge': {
            title: 'Dodge Rating',
            color: '#AAD372',
            effects: [
                'Every 15 Agility gives you 1 Dodge Rating',
                'Applies to any attack against you',
                'Each point adds 1 to the miss range on attack dice',
                'Example: 1 Dodge Rating vs d6 means 1-2 miss, 3-6 hit (6 still crits)',
                'Can\'t dodge crits - the highest roll always hits',
                'Use the Dodge reaction to add +1 Dodge Rating for 1 round',
                'At 0 Dodge Rating, only the lowest roll misses (e.g., d6: 1 misses, 2-6 hit)'
            ]
        },
        'Dodge Rating': {
            title: 'Dodge Rating',
            color: '#AAD372',
            effects: [
                'Every 15 Agility gives you 1 Dodge Rating',
                'Applies to any attack against you',
                'Each point adds 1 to the miss range on attack dice',
                'Example: 1 Dodge Rating vs d6 means 1-2 miss, 3-6 hit (6 still crits)',
                'Can\'t dodge crits - the highest roll always hits',
                'Use the Dodge reaction to add +1 Dodge Rating for 1 round',
                'At 0 Dodge Rating, only the lowest roll misses (e.g., d6: 1 misses, 2-6 hit)'
            ]
        },
        'Passive DR': {
            title: 'Passive Damage Reduction',
            color: '#8B7355',
            effects: [
                'Automatic damage reduction from your Armor',
                'Base: Armor ÷ 10 (rounded down)',
                'Reduces all incoming physical damage automatically',
                'Works passively - no action required',
                'Stacks with active Defend action for even more protection',
                'At 0 Passive DR, you take full damage from attacks'
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

const GeneralStatTooltip = ({ stat, value, baseValue, equipmentBonus, encumbranceEffect, encumbranceDescription, buffEffect, debuffEffect, conditionEffect, description, sources = [] }) => {
    const info = getStatDescription(stat);

    // Build calculation breakdown for derived stats
    const buildCalculationBreakdown = () => {
        if (baseValue === undefined || value === undefined || typeof value !== 'number') return null;

        const parts = [];
        // Handle equipment bonus - can be a number or an object with detailed breakdown (for armor)
        let equipmentValue = 0;
        let equipmentBreakdown = null;

        if (equipmentBonus !== undefined && equipmentBonus !== null) {
            if (typeof equipmentBonus === 'object' && (equipmentBonus.directArmor !== undefined || equipmentBonus.fromAgility !== undefined)) {
                // Detailed breakdown for armor
                equipmentValue = (equipmentBonus.directArmor || 0) + (equipmentBonus.fromAgility || 0);
                equipmentBreakdown = equipmentBonus;
            } else if (typeof equipmentBonus === 'number') {
                // Simple number value
                equipmentValue = equipmentBonus;
            }
        } else {
            // If no explicit equipment bonus is provided, calculate it by subtracting all other effects
            // from the final value: final_value - base_value - encumbrance_effect - buff_effect - debuff_effect
            const totalOtherEffects = (encumbranceEffect || 0) + (buffEffect || 0) + (debuffEffect || 0);
            equipmentValue = (value || 0) - (baseValue || 0) - totalOtherEffects;
        }

        // For armor, show detailed breakdown
        if (stat.toLowerCase() === 'armor' && equipmentBreakdown && equipmentBreakdown.fromAgility !== undefined) {
            // Show base armor (racial + base agility modifier)
            // Note: baseValue already includes racial + base agility modifier
            parts.push(`${Math.round(baseValue)} (base)`);
            
            // Show direct armor from equipment
            if (equipmentBreakdown.directArmor !== undefined && equipmentBreakdown.directArmor !== 0) {
                parts.push(`+${Math.round(equipmentBreakdown.directArmor)} (equipment)`);
            }
            
            // Show armor from equipment agility modifier (the difference from equipment agility)
            // This is the additional armor from equipment agility bonuses beyond base agility
            if (equipmentBreakdown.fromAgility !== undefined && equipmentBreakdown.fromAgility !== 0) {
                parts.push(`${equipmentBreakdown.fromAgility > 0 ? '+' : ''}${Math.round(equipmentBreakdown.fromAgility)} (Agility)`);
            }
            
            // Note: The actual calculation in calculateDerivedStats uses totalAgility for the modifier,
            // which means the baseArmor already includes equipment agility. But for display, we split it.
            // If there's still a discrepancy, it might be from buffs/debuffs/conditions that we're tracking separately.
        } else {
            // For other stats, show base value
            parts.push(`${Math.round(baseValue)} (base)`);

            // Add equipment breakdown if available
            if (equipmentBreakdown) {
                // Always show direct armor if it exists (even if 0, to be clear)
                if (equipmentBreakdown.directArmor !== undefined && equipmentBreakdown.directArmor !== 0) {
                    parts.push(`+${Math.round(equipmentBreakdown.directArmor)} (equipment armor)`);
                }
                // Show armor from agility equipment bonuses if any
                if (equipmentBreakdown.fromAgility !== undefined && equipmentBreakdown.fromAgility > 0) {
                    parts.push(`+${Math.round(equipmentBreakdown.fromAgility)} (from Agility equipment)`);
                }
            } else if (equipmentValue !== 0) {
                // Simple equipment bonus display
                parts.push(`${equipmentValue > 0 ? '+' : ''}${Math.round(equipmentValue)} (equipment)`);
            }
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

        // Add condition effects if provided and non-zero
        if (conditionEffect !== undefined && conditionEffect !== 0) {
            parts.push(`${conditionEffect > 0 ? '+' : ''}${Math.round(conditionEffect)} (condition)`);
        }

        // Calculate the total from the components
        // For armor with detailed breakdown, use baseValue (which includes racial + base agility modifier)
        let calculatedBase = baseValue;
        let calculatedEquipment = equipmentValue;
        
        // Track passive source contributions (these are already included in the final value)
        let passiveContribution = 0;
        if (sources && sources.length > 0) {
            sources.forEach(source => {
                // Extract numeric value from source.value (could be "+10%" or "+10" or just a number)
                const valueStr = String(source.value);
                let numericValue = 0;
                if (valueStr.includes('%')) {
                    // Percentage-based: calculate percentage of base value
                    const percentMatch = valueStr.match(/([+-]?\d+)/);
                    if (percentMatch) {
                        const percent = parseFloat(percentMatch[1]);
                        numericValue = Math.round(baseValue * (percent / 100));
                    }
                } else {
                    // Flat value
                    const numMatch = valueStr.match(/([+-]?\d+)/);
                    if (numMatch) {
                        numericValue = parseFloat(numMatch[1]);
                    }
                }
                passiveContribution += numericValue;
                parts.push(`${numericValue > 0 ? '+' : ''}${Math.round(numericValue)} (${source.name}${source.condition || ''})`);
            });
        }
        
        if (stat.toLowerCase() === 'armor' && equipmentBreakdown) {
            // For armor, the actual calculation in calculateDerivedStats is:
            // baseArmor = racial + agilityModifier(totalAgility) where totalAgility = base + equipment
            // armor = baseArmor + equipmentBonuses.armor
            // 
            // But we're showing it as:
            // base = racial + baseAgilityModifier (from base agility only)
            // equipment = directArmor + equipmentAgilityModifier (difference from equipment agility)
            //
            // The key: baseValue already includes baseAgilityModifier, and equipmentBreakdown.fromAgility
            // is the equipment portion. So:
            // Our calculation: baseValue + directArmor + equipmentAgilityModifier
            // Actual calculation: (racial + totalAgilityModifier) + directArmor
            // Where totalAgilityModifier = baseAgilityModifier + equipmentAgilityModifier
            //
            // These should match! If they don't, there's a bug in our breakdown calculation.
            calculatedEquipment = (equipmentBreakdown.directArmor || 0) + (equipmentBreakdown.fromAgility || 0);
        }
        
        const calculatedTotal = Math.round(calculatedBase) +
                     Math.round(calculatedEquipment) +
                     Math.round(encumbranceEffect || 0) +
                     Math.round(buffEffect || 0) +
                     Math.round(debuffEffect || 0) +
                     Math.round(conditionEffect || 0) +
                     Math.round(passiveContribution);
        
        const actualValue = Math.round(value);
        
        // Only show the calculation total if it matches the actual value
        // Otherwise, just show the breakdown parts without the "= X" to avoid showing incorrect math
        if (Math.abs(calculatedTotal - actualValue) < 0.01) {
            return `${parts.join(' ')} = ${actualValue}`;
        } else {
            // If there's a mismatch, just show the parts without the total
            // The actual value is shown separately in "Current Value" above
            return parts.join(' ');
        }
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
