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
    // Spell Damage Types (Mythrill canonical)
    'Ember Damage': {
      title: 'Ember Damage',
      color: '#D4380D',
      effects: [
        'Scorching heat and flame that ignites and sears',
        'Channels destructive fire and divine light',
        'Can light torches, melt ice, and ignite objects',
        'Extra effective in dry environments'
      ]
    },
    'Rime Damage': {
      title: 'Rime Damage',
      color: '#2C5F7C',
      effects: [
        'Freezing cold and glaciation that slows targets',
        'Can freeze liquids and extinguish flames',
        'Effective in cold environments',
        'Rime damage creates difficult terrain and can immobilize enemies'
      ]
    },
    'Storm Damage': {
      title: 'Storm Damage',
      color: '#8B7328',
      effects: [
        'Lightning, thunder, and concussive force that arcs between targets',
        'Can shatter and stun with deafening thunder',
        'Extra effective against metal armor'
      ]
    },
    'Blight Damage': {
      title: 'Blight Damage',
      color: '#3D1F4E',
      effects: [
        'Necrotic decay and corruption that withers matter',
        'Can prevent healing and weaken life force',
        'Extra effective against living creatures'
      ]
    },
    'Wyrd Damage': {
      title: 'Wyrd Damage',
      color: '#7A2040',
      effects: [
        'Chaotic and psychic energy that warps minds and reality',
        'Bypasses physical defenses',
        'Constructs often immune'
      ]
    },
    'Divine Damage': {
      title: 'Divine Damage',
      color: '#DAA520',
      effects: [
        'Sacred radiance and celestial power that sears the unholy',
        'Can dispel darkness and ward evil',
        'Extra effective against undead and fiends'
      ]
    },
    'Primal Damage': {
      title: 'Primal Damage',
      color: '#2D5A1E',
      effects: [
        'Natural energy and living growth from the wild',
        'Draws power from natural forces and elemental nature',
        'Effective against constructs and corrupted beings'
      ]
    },
    'Arcane Damage': {
      title: 'Arcane Damage',
      color: '#5B3A8C',
      effects: [
        'Pure magical energy from arcane sources',
        'Manipulates the fundamental forces of reality',
        'Few creatures have natural resistance to arcane magic'
      ]
    },
    // Spell Power Types (Mythrill canonical)
    'Ember Power': {
      title: 'Ember Spell Power',
      color: '#D4380D',
      effects: [
        'Increases damage of Ember spells',
        'Channels scorching heat, flame, and destructive fire',
        'Based on Intelligence and magical equipment',
        'Higher power means more devastating ember magic'
      ]
    },
    'Rime Power': {
      title: 'Rime Spell Power',
      color: '#2C5F7C',
      effects: [
        'Increases damage of Rime spells',
        'Channels freezing cold, frost, and glaciation',
        'Based on Intelligence and magical equipment',
        'Higher power means more devastating rime magic',
        'Rime spells can slow enemies and freeze liquids'
      ]
    },
    'Storm Power': {
      title: 'Storm Spell Power',
      color: '#8B7328',
      effects: [
        'Increases damage of Storm spells',
        'Channels lightning, thunder, and concussive force',
        'Based on Intelligence and magical equipment',
        'Higher power means more devastating storm magic'
      ]
    },
    'Primal Power': {
      title: 'Primal Spell Power',
      color: '#2D5A1E',
      effects: [
        'Increases damage of Primal spells',
        'Channels natural energy and living forces',
        'Based on Intelligence and magical equipment',
        'Higher power means more powerful primal magic',
        'Primal magic draws from the living world and elemental forces'
      ]
    },
    'Blight Power': {
      title: 'Blight Spell Power',
      color: '#3D1F4E',
      effects: [
        'Increases damage of Blight spells',
        'Channels necrotic decay, corruption, and withering',
        'Based on Intelligence and magical equipment',
        'Higher power means more devastating blight magic'
      ]
    },
    'Wyrd Power': {
      title: 'Wyrd Spell Power',
      color: '#7A2040',
      effects: [
        'Increases damage of Wyrd spells',
        'Channels chaotic and psychic energy that warps reality',
        'Based on Intelligence and magical equipment',
        'Higher power means more devastating wyrd magic'
      ]
    },
    'Sacred Power': {
      title: 'Sacred Spell Power',
      color: '#DAA520',
      effects: [
        'Increases damage of Sacred spells',
        'Channels sacred radiance and celestial power',
        'Based on Intelligence and magical equipment',
        'Higher power means more powerful sacred magic'
      ]
    },
    'Arcane Power': {
      title: 'Arcane Spell Power',
      color: '#5B3A8C',
      effects: [
        'Increases damage of Arcane spells',
        'Channels pure magical energy and spell force',
        'Based on Intelligence and magical equipment',
        'Higher power means more devastating arcane magic',
        'Arcane magic manipulates the fundamental forces of reality'
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
    // Individual Spell Power Types (Mythrill canonical)
    'Ember Spell Power': {
      title: 'Ember Spell Power',
      color: '#D4380D',
      effects: [
        'Increases damage of Ember spells',
        'Adds to Ember spell damage rolls',
        'Enhances burning effects and heat-based magic'
      ]
    },
    'Rime Spell Power': {
      title: 'Rime Spell Power',
      color: '#2C5F7C',
      effects: [
        'Increases damage of Rime spells',
        'Adds to Rime spell damage rolls',
        'Enhances freezing effects and glaciation magic',
        'Rime spells can slow enemies and create difficult terrain'
      ]
    },
    'Storm Spell Power': {
      title: 'Storm Spell Power',
      color: '#8B7328',
      effects: [
        'Increases damage of Storm spells',
        'Adds to Storm spell damage rolls',
        'Enhances lightning, thunder, and concussive effects'
      ]
    },
    'Primal Spell Power': {
      title: 'Primal Spell Power',
      color: '#2D5A1E',
      effects: [
        'Increases damage of Primal spells',
        'Adds to Primal spell damage rolls',
        'Enhances natural forces and living energy',
        'Primal magic draws power from the living world'
      ]
    },
    'Blight Spell Power': {
      title: 'Blight Spell Power',
      color: '#3D1F4E',
      effects: [
        'Increases damage of Blight spells',
        'Adds to Blight spell damage rolls',
        'Enhances decay, corruption, and life-draining effects'
      ]
    },
    'Wyrd Spell Power': {
      title: 'Wyrd Spell Power',
      color: '#7A2040',
      effects: [
        'Increases damage of Wyrd spells',
        'Adds to Wyrd spell damage rolls',
        'Enhances chaotic and psychic magic effects'
      ]
    },
    'Divine Spell Power': {
      title: 'Divine Spell Power',
      color: '#DAA520',
      effects: [
        'Increases damage of Divine spells',
        'Adds to Divine spell damage rolls',
        'Enhances sacred radiance and celestial power'
      ]
    },
    'Arcane Spell Power': {
      title: 'Arcane Spell Power',
      color: '#5B3A8C',
      effects: [
        'Increases damage of Arcane spells',
        'Adds to Arcane spell damage rolls',
        'Enhances pure magical energy and reality manipulation',
        'Arcane magic is the foundation of all spellcasting'
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
        'usually ranges from 60 to 120 feet',
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

const GeneralStatTooltip = ({ stat, value, displayValue, baseValue, equipmentBonus, encumbranceEffect, encumbranceDescription, buffEffect, debuffEffect, conditionEffect, description, sources = [] }) => {
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

      // For other stats, show base value
      parts.push(`${Math.round(baseValue)} (base)`);

      // Add equipment breakdown if available
      if (equipmentBreakdown) {
        if (equipmentBreakdown.directArmor !== undefined && equipmentBreakdown.directArmor !== 0) {
          parts.push(`+${Math.round(equipmentBreakdown.directArmor)} (equipment armor)`);
        }
        if (equipmentBreakdown.fromAgility !== undefined && equipmentBreakdown.fromAgility > 0) {
          parts.push(`+${Math.round(equipmentBreakdown.fromAgility)} (from Agility equipment)`);
        }
      } else if (equipmentValue !== 0) {
        // Simple equipment bonus display
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
      {value !== undefined && !displayValue && (
        <div className="equipment-slot-description">
          Current Value: {typeof value === 'string' ? value : Math.round(value)}
        </div>
      )}
      {displayValue && (
        <div className="equipment-slot-description">
          Current: {displayValue}
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
