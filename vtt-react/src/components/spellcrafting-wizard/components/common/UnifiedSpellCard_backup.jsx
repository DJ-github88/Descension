import React from 'react';
import PropTypes from 'prop-types';
import { formatFormulaToPlainEnglish } from './SpellCardUtils';
import '../../../../styles/item-tooltip.css';

/**
 * TRUE Unified Spell Card Component
 * Consolidates ALL spell card implementations with consistent Pathfinder styling
 * Handles: SpellbookWindow, Library, Collections, Wizard, Selection - EVERYTHING
 */
const UnifiedSpellCard = ({
  spell,
  variant = 'spellbook', // 'spellbook', 'library', 'collection', 'wizard', 'compact', 'preview'
  showActions = false,
  showDescription = true,
  showStats = true,
  showTags = true,
  onEdit = null,
  onDelete = null,
  onDuplicate = null,
  onSelect = null,
  onClick = null,
  onContextMenu = null,
  isSelected = false,
  isDraggable = false,
  className = '',
  rollableTableData = null,
  categories = [],
  ...props
}) => {
  // ===== COMPREHENSIVE HELPER FUNCTIONS =====

  // Format resource names properly (convert snake_case to proper names)
  const formatResourceName = (resourceType) => {
    if (!resourceType) return '';

    // Handle specific resource types with proper names
    const resourceNameMap = {
      'action_points': 'Action Points',
      'astral_power': 'Astral Power',
      'runic_power': 'Runic Power',
      'soul_power': 'Soul Power',
      'arcane_power': 'Arcane Power',
      'combo_points': 'Combo Points',
      'soul_shards': 'Soul Shards',
      'holy_power': 'Holy Power',
      'health': 'Health',
      'mana': 'Mana',
      'inferno': 'Inferno',
      'rage': 'Rage',
      'energy': 'Energy',
      'focus': 'Focus',
      'chi': 'Chi'
    };

    // Return mapped name if available, otherwise convert snake_case to Title Case
    return resourceNameMap[resourceType] || resourceType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Enhanced formula cleaning function that properly formats resource names
  const cleanFormula = (formula) => {
    if (!formula || typeof formula !== 'string') return '';

    let cleanedFormula = formula
      .replace(/\s*\+\s*/g, ' + ')
      .replace(/\s*\-\s*/g, ' - ')
      .replace(/\s*\*\s*/g, ' * ')
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/\s+/g, ' ')
      .trim();

    // Replace specific resource variable names with proper formatting
    const resourceVariableMap = {
      'action_points': 'Action Points',
      'astral_power': 'Astral Power',
      'runic_power': 'Runic Power',
      'soul_power': 'Soul Power',
      'arcane_power': 'Arcane Power',
      'combo_points': 'Combo Points',
      'soul_shards': 'Soul Shards',
      'holy_power': 'Holy Power',
      'max_health': 'Max Health',
      'current_health': 'Current Health',
      'max_mana': 'Max Mana',
      'current_mana': 'Current Mana',
      'max_action_points': 'Max Action Points',
      'current_action_points': 'Current Action Points',
      'health_regen': 'Health Regen',
      'mana_regen': 'Mana Regen'
    };

    // Replace resource variables in the formula
    Object.entries(resourceVariableMap).forEach(([variable, properName]) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'gi');
      cleanedFormula = cleanedFormula.replace(regex, properName);
    });

    // Handle remaining underscores for any missed variables
    cleanedFormula = cleanedFormula.replace(/_/g, ' ');

    // Handle camelCase conversion
    cleanedFormula = cleanedFormula.replace(/([a-z])([A-Z])/g, '$1 $2');

    return cleanedFormula;
  };

  // Debug logging for resolution method changes (commented out to avoid browser issues)
  // if (spell?.name && spell?.resolution) {
  //   console.log('UnifiedSpellCard - Resolution Method:', {
  //     spellName: spell.name,
  //     resolution: spell.resolution,
  //     cardConfig: spell.cardConfig,
  //     coinConfig: spell.coinConfig,
  //     damageConfig: spell.damageConfig,
  //     chanceOnHitConfig: spell.chanceOnHitConfig || spell.damageConfig?.chanceOnHitConfig,
  //     criticalConfig: spell.criticalConfig || spell.damageConfig?.criticalConfig
  //   });
  // }

  const getRarityClass = () => {
    const rarityMap = {
      'common': 'rarity-common',
      'uncommon': 'rarity-uncommon',
      'rare': 'rarity-rare',
      'epic': 'rarity-epic',
      'legendary': 'rarity-legendary'
    };
    return rarityMap[spell?.rarity] || 'rarity-common';
  };

  const getSpellSchoolClass = () => {
    const schoolMap = {
      'fire': 'spell-fire',
      'frost': 'spell-frost',
      'ice': 'spell-frost',
      'cold': 'spell-frost',
      'arcane': 'spell-arcane',
      'force': 'spell-arcane',
      'nature': 'spell-nature',
      'shadow': 'spell-shadow',
      'necrotic': 'spell-shadow',
      'holy': 'spell-holy',
      'radiant': 'spell-holy',
      'lightning': 'spell-lightning',
      'thunder': 'spell-lightning',
      'electric': 'spell-lightning',
      'physical': 'spell-physical'
    };
    const school = spell?.school || spell?.damageTypes?.[0] || spell?.elementType || 'arcane';
    return schoolMap[school.toLowerCase()] || 'spell-arcane';
  };

  const getBorderColor = () => {
    const rarityColors = {
      'common': '#9d9d9d',
      'uncommon': '#1eff00',
      'rare': '#0070dd',
      'epic': '#a335ee',
      'legendary': '#ff8000'
    };
    return rarityColors[spell?.rarity] || '#9d9d9d';
  };

  const getSpellIcon = () => {
    return spell?.icon || 'inv_misc_questionmark';
  };

  // ===== RESISTANCE HELPER FUNCTIONS =====

  const extractDamageTypeFromResistanceName = (resistanceName) => {
    if (!resistanceName) return 'damage';

    const name = resistanceName.toLowerCase();
    if (name.includes('fire')) return 'fire';
    if (name.includes('cold') || name.includes('frost') || name.includes('ice')) return 'cold';
    if (name.includes('lightning') || name.includes('electric')) return 'lightning';
    if (name.includes('acid')) return 'acid';
    if (name.includes('poison')) return 'poison';
    if (name.includes('necrotic') || name.includes('death')) return 'necrotic';
    if (name.includes('radiant') || name.includes('holy')) return 'radiant';
    if (name.includes('psychic') || name.includes('mental')) return 'psychic';
    if (name.includes('thunder') || name.includes('sonic')) return 'thunder';
    if (name.includes('force')) return 'force';
    if (name.includes('slashing')) return 'slashing';
    if (name.includes('piercing')) return 'piercing';
    if (name.includes('bludgeoning')) return 'bludgeoning';
    if (name.includes('physical')) return 'physical';
    if (name.includes('all')) return 'all damage';

    return 'damage';
  };

  const getThematicResistanceDescription = (resistanceLevel, damageType) => {
    const thematicDescriptions = {
      vampiric: {
        fire: 'Flame Feast (heals for 200% of fire damage taken)',
        cold: 'Frost Drain (heals for 200% of cold damage taken)',
        lightning: 'Storm Siphon (heals for 200% of lightning damage taken)',
        acid: 'Corrosive Feed (heals for 200% of acid damage taken)',
        poison: 'Toxin Feast (heals for 200% of poison damage taken)',
        necrotic: 'Death Feast (heals for 200% of necrotic damage taken)',
        radiant: 'Light Drain (heals for 200% of radiant damage taken)',
        psychic: 'Mind Feast (heals for 200% of psychic damage taken)',
        thunder: 'Sound Drain (heals for 200% of thunder damage taken)',
        force: 'Energy Feast (heals for 200% of force damage taken)',
        physical: 'Blood Feast (heals for 200% of physical damage taken)',
        slashing: 'Wound Feast (heals for 200% of slashing damage taken)',
        piercing: 'Pierce Drain (heals for 200% of piercing damage taken)',
        bludgeoning: 'Impact Feed (heals for 200% of bludgeoning damage taken)',
        'all damage': 'Life Feast (heals for 200% of all damage taken)',
        damage: 'Vampiric (heals for 200% of damage taken)'
      },
      absorbing: {
        fire: 'Flame Absorb (heals for 100% of fire damage taken)',
        cold: 'Frost Absorb (heals for 100% of cold damage taken)',
        lightning: 'Storm Absorb (heals for 100% of lightning damage taken)',
        acid: 'Acid Absorb (heals for 100% of acid damage taken)',
        poison: 'Toxin Absorb (heals for 100% of poison damage taken)',
        necrotic: 'Death Absorb (heals for 100% of necrotic damage taken)',
        radiant: 'Light Absorb (heals for 100% of radiant damage taken)',
        psychic: 'Mind Absorb (heals for 100% of psychic damage taken)',
        thunder: 'Sound Absorb (heals for 100% of thunder damage taken)',
        force: 'Force Absorb (heals for 100% of force damage taken)',
        physical: 'Impact Absorb (heals for 100% of physical damage taken)',
        slashing: 'Cut Absorb (heals for 100% of slashing damage taken)',
        piercing: 'Pierce Absorb (heals for 100% of piercing damage taken)',
        bludgeoning: 'Crush Absorb (heals for 100% of bludgeoning damage taken)',
        'all damage': 'Full Absorb (heals for 100% of all damage taken)',
        damage: 'Absorbing (heals for 100% of damage taken)'
      },
      draining: {
        fire: 'Flame Sap (heals for 50% of fire damage taken)',
        cold: 'Frost Sap (heals for 50% of cold damage taken)',
        lightning: 'Storm Sap (heals for 50% of lightning damage taken)',
        acid: 'Acid Sap (heals for 50% of acid damage taken)',
        poison: 'Toxin Sap (heals for 50% of poison damage taken)',
        necrotic: 'Death Sap (heals for 50% of necrotic damage taken)',
        radiant: 'Light Sap (heals for 50% of radiant damage taken)',
        psychic: 'Mind Sap (heals for 50% of psychic damage taken)',
        thunder: 'Sound Sap (heals for 50% of thunder damage taken)',
        force: 'Force Sap (heals for 50% of force damage taken)',
        physical: 'Vigor Sap (heals for 50% of physical damage taken)',
        slashing: 'Cut Sap (heals for 50% of slashing damage taken)',
        piercing: 'Pierce Sap (heals for 50% of piercing damage taken)',
        bludgeoning: 'Crush Sap (heals for 50% of bludgeoning damage taken)',
        'all damage': 'Life Sap (heals for 50% of all damage taken)',
        damage: 'Draining (heals for 50% of damage taken)'
      },
      siphoning: {
        fire: 'Flame Siphon (heals for 25% of fire damage taken)',
        cold: 'Frost Siphon (heals for 25% of cold damage taken)',
        lightning: 'Storm Siphon (heals for 25% of lightning damage taken)',
        acid: 'Acid Siphon (heals for 25% of acid damage taken)',
        poison: 'Toxin Siphon (heals for 25% of poison damage taken)',
        necrotic: 'Death Siphon (heals for 25% of necrotic damage taken)',
        radiant: 'Light Siphon (heals for 25% of radiant damage taken)',
        psychic: 'Mind Siphon (heals for 25% of psychic damage taken)',
        thunder: 'Sound Siphon (heals for 25% of thunder damage taken)',
        force: 'Force Siphon (heals for 25% of force damage taken)',
        physical: 'Blood Siphon (heals for 25% of physical damage taken)',
        slashing: 'Cut Siphon (heals for 25% of slashing damage taken)',
        piercing: 'Pierce Siphon (heals for 25% of piercing damage taken)',
        bludgeoning: 'Crush Siphon (heals for 25% of bludgeoning damage taken)',
        'all damage': 'Life Siphon (heals for 25% of all damage taken)',
        damage: 'Siphoning (heals for 25% of damage taken)'
      },
      immune: {
        fire: 'Flame Immunity (takes no fire damage)',
        cold: 'Frost Immunity (takes no cold damage)',
        lightning: 'Storm Immunity (takes no lightning damage)',
        acid: 'Acid Immunity (takes no acid damage)',
        poison: 'Toxin Immunity (takes no poison damage)',
        necrotic: 'Death Immunity (takes no necrotic damage)',
        radiant: 'Light Immunity (takes no radiant damage)',
        psychic: 'Mind Immunity (takes no psychic damage)',
        thunder: 'Sound Immunity (takes no thunder damage)',
        force: 'Force Immunity (takes no force damage)',
        physical: 'Physical Immunity (takes no physical damage)',
        slashing: 'Cut Immunity (takes no slashing damage)',
        piercing: 'Pierce Immunity (takes no piercing damage)',
        bludgeoning: 'Crush Immunity (takes no bludgeoning damage)',
        'all damage': 'Full Immunity (takes no damage)',
        damage: 'Immune (takes no damage)'
      },
      resistant: {
        fire: 'Flame Ward (takes half fire damage)',
        cold: 'Frost Ward (takes half cold damage)',
        lightning: 'Storm Ward (takes half lightning damage)',
        acid: 'Acid Ward (takes half acid damage)',
        poison: 'Toxin Ward (takes half poison damage)',
        necrotic: 'Death Ward (takes half necrotic damage)',
        radiant: 'Light Ward (takes half radiant damage)',
        psychic: 'Mind Ward (takes half psychic damage)',
        thunder: 'Sound Ward (takes half thunder damage)',
        force: 'Force Ward (takes half force damage)',
        physical: 'Iron Skin (takes half physical damage)',
        slashing: 'Cut Ward (takes half slashing damage)',
        piercing: 'Pierce Ward (takes half piercing damage)',
        bludgeoning: 'Crush Ward (takes half bludgeoning damage)',
        'all damage': 'Full Ward (takes half damage)',
        damage: 'Resistant (takes half damage)'
      },
      guarded: {
        fire: 'Flame Guard (takes 75% fire damage)',
        cold: 'Frost Guard (takes 75% cold damage)',
        lightning: 'Storm Guard (takes 75% lightning damage)',
        acid: 'Acid Guard (takes 75% acid damage)',
        poison: 'Toxin Guard (takes 75% poison damage)',
        necrotic: 'Death Guard (takes 75% necrotic damage)',
        radiant: 'Light Guard (takes 75% radiant damage)',
        psychic: 'Mind Guard (takes 75% psychic damage)',
        thunder: 'Sound Guard (takes 75% thunder damage)',
        force: 'Force Guard (takes 75% force damage)',
        physical: 'Steel Skin (takes 75% physical damage)',
        slashing: 'Cut Guard (takes 75% slashing damage)',
        piercing: 'Pierce Guard (takes 75% piercing damage)',
        bludgeoning: 'Crush Guard (takes 75% bludgeoning damage)',
        'all damage': 'Full Guard (takes 75% damage)',
        damage: 'Guarded (takes 75% damage)'
      },
      slight_reduction: {
        fire: 'Flame Reduction (reduces fire resistance by 25%)',
        cold: 'Frost Reduction (reduces cold resistance by 25%)',
        lightning: 'Storm Reduction (reduces lightning resistance by 25%)',
        acid: 'Acid Reduction (reduces acid resistance by 25%)',
        poison: 'Toxin Reduction (reduces poison resistance by 25%)',
        necrotic: 'Death Reduction (reduces necrotic resistance by 25%)',
        radiant: 'Light Reduction (reduces radiant resistance by 25%)',
        psychic: 'Mind Reduction (reduces psychic resistance by 25%)',
        thunder: 'Sound Reduction (reduces thunder resistance by 25%)',
        force: 'Force Reduction (reduces force resistance by 25%)',
        physical: 'Armor Breach (reduces physical resistance by 25%)',
        slashing: 'Cut Breach (reduces slashing resistance by 25%)',
        piercing: 'Pierce Breach (reduces piercing resistance by 25%)',
        bludgeoning: 'Crush Breach (reduces bludgeoning resistance by 25%)',
        'all damage': 'Resistance Breach (reduces all resistances by 25%)',
        damage: 'Slight Reduction (reduces resistance by 25%)'
      },
      nullified: {
        fire: 'Flame Nullification (removes all fire resistance)',
        cold: 'Frost Nullification (removes all cold resistance)',
        lightning: 'Storm Nullification (removes all lightning resistance)',
        acid: 'Acid Nullification (removes all acid resistance)',
        poison: 'Toxin Nullification (removes all poison resistance)',
        necrotic: 'Death Nullification (removes all necrotic resistance)',
        radiant: 'Light Nullification (removes all radiant resistance)',
        psychic: 'Mind Nullification (removes all psychic resistance)',
        thunder: 'Sound Nullification (removes all thunder resistance)',
        force: 'Force Nullification (removes all force resistance)',
        physical: 'Armor Nullification (removes all physical resistance)',
        slashing: 'Cut Nullification (removes all slashing resistance)',
        piercing: 'Pierce Nullification (removes all piercing resistance)',
        bludgeoning: 'Crush Nullification (removes all bludgeoning resistance)',
        'all damage': 'Full Nullification (removes all resistances)',
        damage: 'Nullified (removes all resistance)'
      },
      susceptible: {
        fire: 'Flame Weakness (takes 125% fire damage)',
        cold: 'Frost Weakness (takes 125% cold damage)',
        lightning: 'Storm Weakness (takes 125% lightning damage)',
        acid: 'Acid Weakness (takes 125% acid damage)',
        poison: 'Toxin Weakness (takes 125% poison damage)',
        necrotic: 'Death Weakness (takes 125% necrotic damage)',
        radiant: 'Light Weakness (takes 125% radiant damage)',
        psychic: 'Mind Weakness (takes 125% psychic damage)',
        thunder: 'Sound Weakness (takes 125% thunder damage)',
        force: 'Force Weakness (takes 125% force damage)',
        physical: 'Soft Skin (takes 125% physical damage)',
        slashing: 'Cut Weakness (takes 125% slashing damage)',
        piercing: 'Pierce Weakness (takes 125% piercing damage)',
        bludgeoning: 'Crush Weakness (takes 125% bludgeoning damage)',
        'all damage': 'Full Weakness (takes 125% damage)',
        damage: 'Susceptible (takes 125% damage)'
      },
      exposed: {
        fire: 'Flame Exposure (takes 150% fire damage)',
        cold: 'Frost Exposure (takes 150% cold damage)',
        lightning: 'Storm Exposure (takes 150% lightning damage)',
        acid: 'Acid Exposure (takes 150% acid damage)',
        poison: 'Toxin Exposure (takes 150% poison damage)',
        necrotic: 'Death Exposure (takes 150% necrotic damage)',
        radiant: 'Light Exposure (takes 150% radiant damage)',
        psychic: 'Mind Exposure (takes 150% psychic damage)',
        thunder: 'Sound Exposure (takes 150% thunder damage)',
        force: 'Force Exposure (takes 150% force damage)',
        physical: 'Tender Flesh (takes 150% physical damage)',
        slashing: 'Cut Exposure (takes 150% slashing damage)',
        piercing: 'Pierce Exposure (takes 150% piercing damage)',
        bludgeoning: 'Crush Exposure (takes 150% bludgeoning damage)',
        'all damage': 'Full Exposure (takes 150% damage)',
        damage: 'Exposed (takes 150% damage)'
      },
      vulnerable: {
        fire: 'Flame Curse (takes double fire damage)',
        cold: 'Frost Curse (takes double cold damage)',
        lightning: 'Storm Curse (takes double lightning damage)',
        acid: 'Acid Curse (takes double acid damage)',
        poison: 'Toxin Curse (takes double poison damage)',
        necrotic: 'Death Curse (takes double necrotic damage)',
        radiant: 'Light Curse (takes double radiant damage)',
        psychic: 'Mind Curse (takes double psychic damage)',
        thunder: 'Sound Curse (takes double thunder damage)',
        force: 'Force Curse (takes double force damage)',
        physical: 'Brittle Bones (takes double physical damage)',
        slashing: 'Cut Curse (takes double slashing damage)',
        piercing: 'Pierce Curse (takes double piercing damage)',
        bludgeoning: 'Crush Curse (takes double bludgeoning damage)',
        'all damage': 'Full Curse (takes double damage)',
        damage: 'Vulnerable (takes double damage)'
      }
    };

    return thematicDescriptions[resistanceLevel]?.[damageType] ||
           thematicDescriptions[resistanceLevel]?.damage ||
           resistanceLevel;
  };

  // ===== COMPREHENSIVE FORMATTING FUNCTIONS =====

  const formatCastTime = () => {
    if (!spell) return 'Instant';

    // Handle different casting time formats
    if (spell.actionType === 'channeled') return 'Channeled';
    if (spell.spellType === 'CHANNELED') return 'Channeled';
    if (spell.spellType === 'REACTION') return 'Reaction';
    if (spell.spellType === 'PASSIVE') return 'Passive';
    if (spell.spellType === 'TRAP') return 'Trap';
    if (spell.spellType === 'STATE') return 'State';
    if (spell.spellType === 'ZONE') return 'Zone';

    // Get cast time from typeConfig
    const castTime = spell.castTime ||
                    spell.castingTime ||
                    (spell.castingConfig && spell.castingConfig.castTime) ||
                    (spell.typeConfig && spell.typeConfig.castTime);

    if (castTime && castTime > 0) {
      const timeType = spell.typeConfig?.castTimeType || 'IMMEDIATE';
      if (timeType === 'IMMEDIATE') {
        return castTime === 1 ? '1 Turn' : `${castTime} Turns`;
      } else {
        return `${castTime} Turn${castTime > 1 ? 's' : ''} (${timeType.replace(/_/g, ' ').toLowerCase()})`;
      }
    }

    return 'Instant';
  };

  const formatRange = () => {
    if (!spell) return 'Self';

    // Handle different range formats
    if (spell.targetingMode === 'self') return 'Self';
    if (spell.targetingConfig?.targetingType === 'self') return 'Self';

    const range = spell.range ||
                  (spell.targetingConfig && spell.targetingConfig.range) ||
                  (spell.targetingConfig && spell.targetingConfig.rangeDistance) ||
                  'Touch';

    if (typeof range === 'number') return `${range} ft`;
    return range;
  };

  const formatDuration = () => {
    if (!spell) return 'Instant';

    // Handle different duration formats
    if (spell.durationType === 'instant') return 'Instant';
    if (spell.durationType === 'permanent') {
      const dispellable = spell.canBeDispelled ? ' (Dispellable)' : '';
      return `Permanent${dispellable}`;
    }

    // Handle type-specific durations
    if (spell.spellType === 'CHANNELED' && spell.typeConfig) {
      const maxDuration = spell.typeConfig.maxChannelDuration || 3;
      const unit = spell.typeConfig.durationUnit || 'TURNS';
      return `Up to ${maxDuration} ${unit.toLowerCase()}`;
    }

    if (spell.spellType === 'ZONE' && spell.typeConfig) {
      const zoneDuration = spell.typeConfig.zoneDuration || 60;
      const unit = spell.typeConfig.zoneDurationUnit || 'seconds';
      return `${zoneDuration} ${unit}`;
    }

    const duration = spell.duration ||
                     (spell.durationConfig && spell.durationConfig.duration) ||
                     (spell.typeConfig && spell.typeConfig.duration) ||
                     'Instant';

    return duration;
  };

  // Format type-specific configuration as subtle bullet points
  const formatTypeSpecificBullets = () => {
    if (!spell || !spell.typeConfig) return [];

    const bullets = [];
    const typeConfig = spell.typeConfig;

    switch (spell.spellType) {
      case 'CHANNELED':
        // Add duration as first bullet point for channeled spells
        const maxDuration = typeConfig.maxChannelDuration || 3;
        const unit = typeConfig.durationUnit || 'TURNS';
        bullets.push(`Up to ${maxDuration} ${unit.toLowerCase()}`);

        // Show concentration DC (including base DC 10)
        if (typeConfig.concentrationDC !== undefined) {
          bullets.push(`DC ${typeConfig.concentrationDC} ${typeConfig.dcType || 'Spirit'}`);
        }

        // Show tick frequency (including end of turn)
        if (typeConfig.tickFrequency) {
          bullets.push(`${typeConfig.tickFrequency.replace(/_/g, ' ').toLowerCase()}`);
        }

        if (typeConfig.breakEffect && typeConfig.breakEffect !== 'none') {
          bullets.push(`break: ${typeConfig.breakEffect}`);
        }
        break;

      case 'REACTION':
        // Show availability (default to "always available")
        const availability = typeConfig.availabilityType && typeConfig.availabilityType !== 'ALWAYS'
          ? typeConfig.availabilityType.replace(/_/g, ' ').toLowerCase()
          : 'always available';
        bullets.push(availability);

        // Show uses per turn if limited
        if (typeConfig.limitUsesPerTurn && typeConfig.usesPerTurn) {
          bullets.push(`${typeConfig.usesPerTurn}/turn`);
        }

        // Show reaction window if not immediate
        if (typeConfig.reactionWindow && typeConfig.reactionWindow !== 'immediate') {
          bullets.push(`${typeConfig.reactionWindow} window`);
        }

        // Show cooldown (format 0 as "no cooldown")
        if (typeConfig.cooldownAfterTrigger !== undefined) {
          if (typeConfig.cooldownAfterTrigger === 0) {
            bullets.push('no cooldown');
          } else {
            const unit = typeConfig.cooldownUnit || 'seconds';
            bullets.push(`${typeConfig.cooldownAfterTrigger} ${unit} cooldown`);
          }
        }

        // Show max triggers (format -1 as "unlimited triggers", 1 as "single use")
        if (typeConfig.maxTriggers !== undefined) {
          if (typeConfig.maxTriggers === -1) {
            bullets.push('unlimited triggers');
          } else if (typeConfig.maxTriggers === 1) {
            bullets.push('single use');
          } else if (typeConfig.maxTriggers > 1) {
            bullets.push(`max ${typeConfig.maxTriggers} triggers`);
          }
        }
        break;

      case 'TRAP':
        // Check both typeConfig and trapConfig for trap properties
        const trapConfig = spell.trapConfig || {};

        // Show placement time if more than 1 turn
        const placementTime = typeConfig.placementTime || trapConfig.placementTime;
        if (placementTime && placementTime > 1) {
          bullets.push(`${placementTime} turns to place`);
        }

        // Show visibility (default to "visible to all")
        const visibility = typeConfig.visibility || trapConfig.visibility || 'visible';
        if (visibility === 'hidden') {
          bullets.push('hidden');
        } else if (visibility === 'magical') {
          bullets.push('magical aura');
        } else {
          bullets.push('visible to all');
        }

        // Show cooldown (format 0 as "no cooldown")
        const cooldown = typeConfig.cooldownAfterTrigger !== undefined ? typeConfig.cooldownAfterTrigger : trapConfig.resetTime;
        if (cooldown !== undefined) {
          if (cooldown === 0) {
            bullets.push('no cooldown');
          } else {
            const unit = typeConfig.cooldownUnit || trapConfig.cooldownUnit || 'seconds';
            bullets.push(`${cooldown} ${unit} cooldown`);
          }
        }

        // Show max triggers (format -1 as "unlimited triggers", 1 as "single use")
        const maxTriggers = typeConfig.maxTriggers !== undefined ? typeConfig.maxTriggers : trapConfig.maxTriggers;
        if (maxTriggers !== undefined) {
          if (maxTriggers === -1) {
            bullets.push('unlimited triggers');
          } else if (maxTriggers === 1) {
            bullets.push('single use');
          } else if (maxTriggers > 1) {
            bullets.push(`max ${maxTriggers} triggers`);
          }
        }
        break;

      case 'ZONE':
        // Show zone duration
        if (typeConfig.zoneDuration) {
          const unit = typeConfig.zoneDurationUnit || 'seconds';
          bullets.push(`${typeConfig.zoneDuration} ${unit}`);
        }

        if (typeConfig.leaveTrail) {
          bullets.push('leaves trail');
          if (typeConfig.trailDuration) {
            bullets.push(`trail: ${typeConfig.trailDuration} ${typeConfig.trailDurationUnit || 'rounds'}`);
          }
        }
        break;

      case 'STATE':
        // Show visibility (default to "visible to all")
        const stateVisibility = typeConfig.stateVisibility || 'visible';
        if (stateVisibility === 'hidden') {
          bullets.push('hidden');
        } else if (stateVisibility === 'magical') {
          bullets.push('magical aura');
        } else {
          bullets.push('visible to all');
        }

        // Show cooldown (format 0 as "no cooldown")
        if (typeConfig.cooldownAfterTrigger !== undefined) {
          if (typeConfig.cooldownAfterTrigger === 0) {
            bullets.push('no cooldown');
          } else {
            const unit = typeConfig.cooldownUnit || 'seconds';
            bullets.push(`${typeConfig.cooldownAfterTrigger} ${unit} cooldown`);
          }
        }

        // Show max triggers (format -1 as "unlimited triggers", 1 as "single use")
        if (typeConfig.maxTriggers !== undefined) {
          if (typeConfig.maxTriggers === -1) {
            bullets.push('unlimited triggers');
          } else if (typeConfig.maxTriggers === 1) {
            bullets.push('single use');
          } else if (typeConfig.maxTriggers > 1) {
            bullets.push(`max ${typeConfig.maxTriggers} triggers`);
          }
        }
        break;

      case 'PASSIVE':
        if (typeConfig.toggleable) {
          bullets.push('toggleable');
        }
        break;

      case 'ACTION':
        const actionBullets = [];

        // Show cast time type if not immediate (fix underscore formatting)
        if (typeConfig.castTimeType && typeConfig.castTimeType !== 'IMMEDIATE') {
          actionBullets.push(typeConfig.castTimeType.replace(/_/g, ' ').toLowerCase());
        }

        // Removed interruptible and castingVisibility as requested
        // Removed partialEffectOnInterrupt as requested

        bullets.push(...actionBullets);
        break;
    }

    return bullets;
  };

  const formatResourceCosts = () => {
    if (!spell) return null;

    const resources = [];

    // Check for resource config (wizard format)
    if (spell.resourceConfig) {
      const { resourceType = 'Mana', resourceAmount = 0 } = spell.resourceConfig;
      if (resourceAmount > 0) {
        resources.push({
          type: resourceType.toLowerCase().replace(/\s+/g, '-'),
          amount: resourceAmount,
          name: resourceType
        });
      }
    }

    // Check for legacy resource costs (spellbook format)
    if (spell.resourceCost) {
      Object.entries(spell.resourceCost).forEach(([type, amount]) => {
        if (amount > 0) {
          resources.push({
            type: type.toLowerCase().replace(/\s+/g, '-'),
            amount: amount,
            name: type.charAt(0).toUpperCase() + type.slice(1)
          });
        }
      });
    }

    // Check for simple mana cost
    if (spell.manaCost && spell.manaCost > 0) {
      resources.push({
        type: 'mana',
        amount: spell.manaCost,
        name: 'Mana'
      });
    }

    if (resources.length === 0) return null;

    return (
      <div className="pf-spell-resources">
        {resources.map((resource, index) => (
          <div key={index} className={`pf-resource-cost ${resource.type}`}>
            <div className="pf-resource-icon"></div>
            <span className="pf-resource-amount">{resource.amount}</span>
          </div>
        ))}
      </div>
    );
  };

  // ===== CHANCE ON HIT FORMATTING =====
  const formatChanceOnHit = () => {
    const chanceConfig = spell.damageConfig?.chanceOnHitConfig || spell.healingConfig?.chanceOnHitConfig || spell.chanceOnHitConfig;
    if (!chanceConfig?.enabled) return null;

    const { procType, procChance, diceThreshold, cardProcRule, coinProcRule, coinCount,
            spellEffect, useRollableTable, procSuit, customEffects } = chanceConfig;

    let procText = '';
    let effectText = '';

    // Determine what effect happens
    if (useRollableTable) {
      effectText = 'triggers rollable table';
    } else if (spellEffect) {
      // Try to get spell name from library or use ID
      effectText = `casts ${spellEffect}`;
    } else if (customEffects && customEffects.length > 0) {
      // Format custom effects (like burning, stun, knockback, etc.)
      const formattedEffects = customEffects.map(effect => {
        return effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }).join(', ');
      effectText = formattedEffects;
    } else {
      effectText = 'triggers effect';
    }

    // Format based on resolution type
    switch (procType) {
      case 'dice':
        procText = `Roll d20: ${diceThreshold}+ (${procChance}%) ${effectText}`;
        break;
      case 'cards':
        let cardRule = '';
        let cardChance = '';

        if (cardProcRule === 'face_cards') {
          cardRule = 'Face Cards (J,Q,K)';
          cardChance = '23%';
        } else if (cardProcRule === 'aces') {
          cardRule = 'Aces';
          cardChance = '8%';
        } else if (cardProcRule === 'specific_suit') {
          cardRule = `${procSuit?.charAt(0).toUpperCase() + procSuit?.slice(1) || 'Hearts'} suit`;
          cardChance = '25%';
        } else if (cardProcRule === 'red_cards') {
          cardRule = 'Red Cards';
          cardChance = '50%';
        } else if (cardProcRule === 'black_cards') {
          cardRule = 'Black Cards';
          cardChance = '50%';
        } else if (cardProcRule === 'pairs') {
          cardRule = 'Pairs';
          cardChance = '6%';
        } else {
          cardRule = cardProcRule.replace('_', ' ');
          cardChance = '25%';
        }

        procText = `Draw card: ${cardRule} (${cardChance}) ${effectText}`;
        break;
      case 'coins':
        let coinRule = '';
        let coinChance = '';

        if (coinProcRule === 'all_heads') {
          coinRule = 'All Heads';
          coinChance = (Math.pow(0.5, coinCount) * 100).toFixed(1) + '%';
        } else if (coinProcRule === 'all_tails') {
          coinRule = 'All Tails';
          coinChance = (Math.pow(0.5, coinCount) * 100).toFixed(1) + '%';
        } else if (coinProcRule === 'sequence') {
          coinRule = 'Specific Sequence';
          coinChance = (Math.pow(0.5, coinCount) * 100).toFixed(1) + '%';
        } else if (coinProcRule === 'pattern') {
          coinRule = 'Pattern Match';
          coinChance = '25%';
        } else {
          coinRule = coinProcRule.replace('_', ' ');
          coinChance = '50%';
        }

        procText = `Flip ${coinCount} coins: ${coinRule} (${coinChance}) ${effectText}`;
        break;
      default:
        procText = `${procChance}% chance ${effectText}`;
    }

    return procText;
  };

  // ===== CRITICAL HIT FORMATTING =====
  const formatCriticalHit = () => {
    const critConfig = spell.damageConfig?.criticalConfig || spell.healingConfig?.criticalConfig || spell.criticalConfig;
    if (!critConfig?.enabled) return null;

    if (critConfig.critOnlyEffect) {
      // Include special effects in effect-only mode
      const effects = critConfig.critEffects || [];
      if (effects.length > 0) {
        const effectNames = effects.map(effect => {
          // Format effect names nicely
          return effect.charAt(0).toUpperCase() + effect.slice(1);
        }).join(', ');
        return `Effect only: ${effectNames}`;
      }
      return 'Effect only on critical hit';
    }

    const { critType, critMultiplier, extraDice, cardCritRule, coinCritRule, coinCount,
            cardCritResolution, coinCritResolution, extraCardDraw, extraCoinFlips,
            explodingDice, explodingDiceType, critEffects } = critConfig;

    let critText = '';

    // Format based on resolution type
    if (critType === 'cards') {
      const rule = cardCritRule === 'face_cards' ? 'Face Cards (J,Q,K)' :
                   cardCritRule === 'aces' ? 'Aces' :
                   cardCritRule === 'specific_suit' ? 'Specific Suit' :
                   cardCritRule === 'red_cards' ? 'Red Cards' :
                   cardCritRule === 'black_cards' ? 'Black Cards' : 'Face Cards';

      if (cardCritResolution === 'draw_add') {
        critText = `${rule}: ${critMultiplier}x damage + draw ${extraCardDraw} extra cards`;
      } else if (cardCritResolution === 'multiply_value') {
        critText = `${rule}: multiply card values by ${critMultiplier}`;
      } else {
        critText = `${rule}: ${critMultiplier}x damage`;
      }

      if (extraDice) {
        critText += ` + ${extraDice}`;
      }
    } else if (critType === 'coins') {
      const rule = coinCritRule === 'all_heads' ? 'All Heads' :
                   coinCritRule === 'all_tails' ? 'All Tails' :
                   coinCritRule === 'sequence' ? 'Specific Sequence' :
                   coinCritRule === 'majority' ? 'Majority' : 'All Heads';

      if (coinCritResolution === 'flip_add') {
        critText = `${rule} (${coinCount} coins): ${critMultiplier}x damage + flip ${extraCoinFlips} extra coins`;
      } else if (coinCritResolution === 'multiply_value') {
        critText = `${rule} (${coinCount} coins): multiply heads by ${critMultiplier}`;
      } else {
        critText = `${rule} (${coinCount} coins): ${critMultiplier}x damage`;
      }

      if (extraDice) {
        critText += ` + ${extraDice}`;
      }
    } else {
      // Dice-based critical
      critText = `Max roll: ${critMultiplier}x damage`;
      if (extraDice) {
        critText += ` + ${extraDice}`;
      }
    }

    // Add exploding dice information if enabled
    if (explodingDice) {
      const explodingText = explodingDiceType === 'reroll_add' ? 'exploding dice' :
                           explodingDiceType === 'double_value' ? 'double max values' :
                           explodingDiceType === 'add_max' ? 'add max on max' : 'exploding';
      critText += ` (${explodingText})`;
    }

    // Add special effects if any are selected
    if (critEffects && critEffects.length > 0) {
      const effectNames = critEffects.map(effect => {
        // Format effect names nicely
        return effect.charAt(0).toUpperCase() + effect.slice(1);
      }).join(', ');
      critText += ` + ${effectNames}`;
    }

    return critText;
  };

  // ===== SAVING THROW FORMATTING =====
  const formatSavingThrow = () => {
    const saveConfig = spell.damageConfig?.savingThrowConfig || spell.savingThrowConfig;
    if (!saveConfig?.enabled) return null;

    const saveType = (saveConfig.savingThrowType || 'agility').charAt(0).toUpperCase() +
                     (saveConfig.savingThrowType || 'agility').slice(1);
    const dc = saveConfig.difficultyClass || 15;

    let effectText = '';
    if (saveConfig.partialEffect) {
      const formula = saveConfig.partialEffectFormula || 'damage/2';
      effectText = ` (${formula} on save)`;
    } else {
      effectText = ' (negated on save)';
    }

    return `DC ${dc} ${saveType}${effectText}`;
  };

  const formatDamage = () => {
    if (!spell || !spell.damageConfig) return null;

    // Debug logging for external preview (commented out to avoid browser issues)
    // if (variant === 'wizard') {
    //   console.log('UnifiedSpellCard formatDamage:', {
    //     spellName: spell.name,
    //     resolution: spell.resolution,
    //     cardConfig: spell.cardConfig,
    //     coinConfig: spell.coinConfig,
    //     damageConfig: spell.damageConfig,
    //     effectTypes: spell.effectTypes,
    //     tags: spell.tags
    //   });
    // }



    let damageText = '';
    let dotText = '';

    // Check if this is a pure DoT spell (no instant damage)
    const isPureDoT = spell.damageConfig?.damageType === 'dot' && !spell.damageConfig?.hasDotEffect;

    // Only show instant damage if it's NOT a pure DoT spell
    if (!isPureDoT) {
      // Handle card/coin resolution display - always show for CARDS/COINS resolution
      if (spell.resolution === 'CARDS') {
          const cardConfig = spell.cardConfig || spell.damageConfig?.cardConfig;
          // Always show the draw count, even if it's the default (consistent with ExternalLivePreview)
          const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
          const formula = cardConfig?.formula || spell.damageConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3';
          // Just clean up spacing and formatting, don't convert to readable text
          const cleanedFormula = cleanFormula(formula);
          damageText = `Draw ${drawCount} cards: ${cleanedFormula}`;
      } else if (spell.resolution === 'COINS') {
          const coinConfig = spell.coinConfig || spell.damageConfig?.coinConfig;
          // Always show the flip count, even if it's the default (consistent with ExternalLivePreview)
          const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
          const formula = coinConfig?.formula || spell.damageConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2';
          // Just clean up spacing and formatting, don't convert to readable text
          const cleanedFormula = cleanFormula(formula);
          damageText = `Flip ${flipCount} coins: ${cleanedFormula}`;
      } else if (spell.resolution === 'DICE' && (spell.diceConfig?.formula || spell.damageConfig?.formula)) {
          const formula = spell.diceConfig?.formula || spell.damageConfig?.formula || '1d6 + intelligence';
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = cleanFormula(formula);
      } else if (spell.damageConfig?.formula) {
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = cleanFormula(spell.damageConfig.formula);
      } else if (spell.primaryDamage?.dice) {
          const dice = spell.primaryDamage.dice;
          const flat = spell.primaryDamage.flat > 0 ? ` + ${spell.primaryDamage.flat}` : '';
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = cleanFormula(`${dice}${flat}`);
      }
    }

    // Handle DoT (Damage over Time)
    if (spell.damageConfig?.hasDotEffect || spell.damageConfig?.damageType === 'dot') {
      const duration = spell.damageConfig?.dotConfig?.duration || 3;
      const tickFrequency = spell.damageConfig?.dotConfig?.tickFrequency || 'round';

      // Format duration text
      const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

      // Check if this is progressive DoT
      const isProgressiveDot = spell.damageConfig?.dotConfig?.isProgressiveDot &&
                               spell.damageConfig?.dotConfig?.progressiveStages?.length > 0;

      if (isProgressiveDot) {
        // Format progressive DoT stages showing all formulas with arrows
        const stages = spell.damageConfig.dotConfig.progressiveStages;

        // Check if using card/coin resolution for progressive DoT
        const cardConfig = spell.cardConfig;
        const coinConfig = spell.coinConfig;

        if (stages.length === 1) {
          // Single stage - just show the formula with special effect if present
          const stage = stages[0];
          const cleanedFormula = cleanFormula(stage.formula);
          const effectText = stage.spellEffect ? ` (${stage.spellEffect})` : '';

          // Add card/coin info if applicable
          if (spell.resolution === 'CARDS' && cardConfig) {
            const drawCount = cardConfig.drawCount || 3;
            dotText = `Draw ${drawCount} cards: ${cleanedFormula}${effectText} per ${tickFrequency} for ${durationText}`;
          } else if (spell.resolution === 'COINS' && coinConfig) {
            const flipCount = coinConfig.flipCount || 4;
            dotText = `Flip ${flipCount} coins: ${cleanedFormula}${effectText} per ${tickFrequency} for ${durationText}`;
          } else {
            dotText = `${cleanedFormula}${effectText} per ${tickFrequency} for ${durationText}`;
          }
        } else {
          // Multiple stages - show all formulas with arrows and special effects
          const formulas = stages.map(stage => {
            const cleanedFormula = cleanFormula(stage.formula);

            // Add special effect if present
            if (stage.spellEffect) {
              return `${cleanedFormula} (${stage.spellEffect})`;
            }
            return cleanedFormula;
          });

          // Add card/coin info if applicable
          if (spell.resolution === 'CARDS' && cardConfig) {
            const drawCount = cardConfig.drawCount || 3;
            dotText = `Draw ${drawCount} cards: ${formulas.join(' → ')} over ${durationText}`;
          } else if (spell.resolution === 'COINS' && coinConfig) {
            const flipCount = coinConfig.flipCount || 4;
            dotText = `Flip ${flipCount} coins: ${formulas.join(' → ')} over ${durationText}`;
          } else {
            dotText = `${formulas.join(' → ')} over ${durationText}`;
          }
        }
      } else if (spell.resolution === 'CARDS') {
        // Use dotConfig cardConfig if available, otherwise fall back to main cardConfig
        const cardConfig = spell.damageConfig?.dotConfig?.cardConfig || spell.cardConfig;
        const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
        const formula = cardConfig?.formula || 'CARD_VALUE/2 + intelligence/3';
        const cleanedFormula = cleanFormula(formula);
        dotText = `Draw ${drawCount} cards: ${cleanedFormula} per ${tickFrequency} for ${durationText}`;
      } else if (spell.resolution === 'COINS') {
        // Use dotConfig coinConfig if available, otherwise fall back to main coinConfig
        const coinConfig = spell.damageConfig?.dotConfig?.coinConfig || spell.coinConfig;
        const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
        const formula = coinConfig?.formula || 'HEADS_COUNT * 2 + intelligence/3';
        const cleanedFormula = cleanFormula(formula);
        dotText = `Flip ${flipCount} coins: ${cleanedFormula} per ${tickFrequency} for ${durationText}`;
      } else {
        // Standard dice-based DoT
        const dotFormula = spell.damageConfig?.dotConfig?.dotFormula || spell.damageConfig?.formula || '1d4 + intelligence/2';
        const cleanedDotFormula = cleanFormula(dotFormula);
        dotText = `${cleanedDotFormula} per ${tickFrequency} for ${durationText}`;
      }
    }





    // Combine damage and DoT text intelligently
    let finalText = null;

    // Legacy damage + DoT combination logic for backwards compatibility
    if (damageText && dotText) {
      // Check if both use the same resolution method to avoid redundancy
      const bothUseCards = spell.resolution === 'CARDS' && damageText.includes('Draw') && dotText.includes('Draw');
      const bothUseCoins = spell.resolution === 'COINS' && damageText.includes('Flip') && dotText.includes('Flip');
      const bothUseDice = spell.resolution === 'DICE' || (!bothUseCards && !bothUseCoins);

      if (bothUseCards) {
        // Extract formulas from both instant and DoT
        const instantMatch = damageText.match(/Draw (\d+) cards: (.+)/);
        const dotMatch = dotText.match(/Draw (\d+) cards: (.+?) per .+ for (.+)/);

        if (instantMatch && dotMatch) {
          const [, instantCardCount, instantFormula] = instantMatch;
          const [, dotCardCount, dotFormula, durationText] = dotMatch;

          // Check if formulas are the same
          if (instantFormula.trim() === dotFormula.trim() && instantCardCount === dotCardCount) {
            finalText = `Draw ${instantCardCount} cards: ${instantFormula} (instant + DoT for ${durationText})`;
          } else {
            // Different formulas, show both clearly on separate lines
            finalText = {
              instant: `Draw ${instantCardCount} cards: ${instantFormula}`,
              dot: `Draw ${dotCardCount} cards: ${dotFormula} per round for ${durationText}`
            };
          }
        } else {
          finalText = { combined: `${damageText}. Then ${dotText}` };
        }
      } else if (bothUseCoins) {
        // Extract formulas from both instant and DoT
        const instantMatch = damageText.match(/Flip (\d+) coins: (.+)/);
        const dotMatch = dotText.match(/Flip (\d+) coins: (.+?) per .+ for (.+)/);

        if (instantMatch && dotMatch) {
          const [, instantCoinCount, instantFormula] = instantMatch;
          const [, dotCoinCount, dotFormula, durationText] = dotMatch;

          // Check if formulas are the same
          if (instantFormula.trim() === dotFormula.trim() && instantCoinCount === dotCoinCount) {
            finalText = `Flip ${instantCoinCount} coins: ${instantFormula} (instant + DoT for ${durationText})`;
          } else {
            // Different formulas, show both clearly on separate lines
            finalText = {
              instant: `Flip ${instantCoinCount} coins: ${instantFormula}`,
              dot: `Flip ${dotCoinCount} coins: ${dotFormula} per round for ${durationText}`
            };
          }
        } else {
          finalText = { combined: `${damageText}. Then ${dotText}` };
        }
      } else {
        // Different resolution methods or dice-based, show both on separate lines
        finalText = {
          instant: damageText,
          dot: dotText
        };
      }
    } else if (damageText) {
      finalText = damageText;
    } else if (dotText) {
      finalText = dotText;
    }

    // Return the formatted text - handle both string and object formats
    if (typeof finalText === 'object' && finalText !== null) {
      if (finalText.combined) {
        return finalText.combined;
      } else if (finalText.instant && finalText.dot) {
        return { instant: finalText.instant, dot: finalText.dot };
      }
    }

    // Debug logging for final result (commented out to avoid browser issues)
    // if (variant === 'wizard') {
    //   console.log('UnifiedSpellCard Final Damage Text:', {
    //     damageText,
    //     dotText,
    //     finalText,
    //     resolution: spell.resolution,
    //     cardConfig: spell.cardConfig,
    //     coinConfig: spell.coinConfig
    //   });
    // }

    // Return the final text (string case)
    return finalText;



    return finalText;
  };

  const formatHealing = () => {
    if (!spell) return null;

    // Use the main cleanFormula function defined above



    // Check for healingConfig-based healing first (new system)
    if (spell.healingConfig) {
      const healingType = spell.healingConfig.healingType;

      // Handle different healing types
      if (healingType === 'direct') {
        // Direct healing - check resolution method
        if (spell.resolution === 'CARDS' && spell.healingConfig.cardConfig?.formula) {
          const cardConfig = spell.healingConfig.cardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          return `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)}`;
        } else if (spell.resolution === 'COINS' && spell.healingConfig.coinConfig?.formula) {
          const coinConfig = spell.healingConfig.coinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          return `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)}`;
        } else if (spell.healingConfig.formula) {
          // Dice-based direct healing
          return cleanFormula(spell.healingConfig.formula);
        }
      } else if (healingType === 'hot') {
        // HoT healing - check resolution method
        if (spell.resolution === 'CARDS' && spell.healingConfig.hotCardConfig?.formula) {
          const cardConfig = spell.healingConfig.hotCardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          const duration = spell.healingConfig.hotDuration || 3;
          const tickFrequency = spell.healingConfig.hotTickType || 'round';
          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

          // Check if progressive HoT is enabled
          if (spell.healingConfig.isProgressiveHot && spell.healingConfig.hotProgressiveStages?.length > 0) {
            const unitLabel = tickFrequency === 'round' ? 'Round' :
                             tickFrequency === 'turn' ? 'Turn' :
                             tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

            const progressiveText = spell.healingConfig.hotProgressiveStages
              .map(stage => `${unitLabel} ${stage.turn}: Draw ${drawCount} cards: ${cleanFormula(stage.formula)}`)
              .join(' → ');

            return progressiveText;
          } else {
            return `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)} per ${tickFrequency} for ${durationText}`;
          }
        } else if (spell.resolution === 'COINS' && spell.healingConfig.hotCoinConfig?.formula) {
          const coinConfig = spell.healingConfig.hotCoinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          const duration = spell.healingConfig.hotDuration || 3;
          const tickFrequency = spell.healingConfig.hotTickType || 'round';
          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

          // Check if progressive HoT is enabled
          if (spell.healingConfig.isProgressiveHot && spell.healingConfig.hotProgressiveStages?.length > 0) {
            const unitLabel = tickFrequency === 'round' ? 'Round' :
                             tickFrequency === 'turn' ? 'Turn' :
                             tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

            const progressiveText = spell.healingConfig.hotProgressiveStages
              .map(stage => `${unitLabel} ${stage.turn}: Flip ${flipCount} coins: ${cleanFormula(stage.formula)}`)
              .join(' → ');

            return progressiveText;
          } else {
            return `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)} per ${tickFrequency} for ${durationText}`;
          }
        } else if (spell.healingConfig.hotFormula) {
          const duration = spell.healingConfig.hotDuration || 3;
          const tickFrequency = spell.healingConfig.hotTickType || 'round';
          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

          // Check if progressive HoT is enabled
          if (spell.healingConfig.isProgressiveHot && spell.healingConfig.hotProgressiveStages?.length > 0) {
            const unitLabel = tickFrequency === 'round' ? 'Round' :
                             tickFrequency === 'turn' ? 'Turn' :
                             tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

            const progressiveText = spell.healingConfig.hotProgressiveStages
              .map(stage => `${unitLabel} ${stage.turn}: ${cleanFormula(stage.formula)}`)
              .join(' → ');

            return progressiveText;
          } else {
            return `${cleanFormula(spell.healingConfig.hotFormula)} per ${tickFrequency} for ${durationText}`;
          }
        }
      } else if (healingType === 'shield') {
        // Shield healing - check resolution method
        const shieldDuration = spell.healingConfig.shieldDuration || 3;
        const damageTypes = spell.healingConfig.shieldDamageTypes || 'all';
        const overflow = spell.healingConfig.shieldOverflow || 'dissipate';
        const breakBehavior = spell.healingConfig.shieldBreakBehavior || 'fade';

        let baseDescription = '';

        // Handle different resolution types for shield
        if (spell.resolution === 'CARDS' && spell.healingConfig.shieldCardConfig?.formula) {
          const cardConfig = spell.healingConfig.shieldCardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          baseDescription = `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)} absorption`;
        } else if (spell.resolution === 'COINS' && spell.healingConfig.shieldCoinConfig?.formula) {
          const coinConfig = spell.healingConfig.shieldCoinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          baseDescription = `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)} absorption`;
        } else if (spell.healingConfig.shieldFormula) {
          baseDescription = `${cleanFormula(spell.healingConfig.shieldFormula)} absorption`;
        }

        if (baseDescription) {
          // Add duration
          baseDescription += ` for ${shieldDuration} round${shieldDuration !== 1 ? 's' : ''}`;

          // Build bullet points for shield properties
          const shieldBullets = [];

          // Add damage type if not all types
          if (damageTypes !== 'all') {
            const typeText = damageTypes === 'physical' ? 'Physical' :
                            damageTypes === 'magical' ? 'Magical' :
                            damageTypes === 'fire' ? 'Fire' :
                            damageTypes === 'cold' ? 'Cold' :
                            damageTypes === 'lightning' ? 'Lightning' :
                            damageTypes === 'acid' ? 'Acid' :
                            damageTypes === 'poison' ? 'Poison' :
                            damageTypes === 'necrotic' ? 'Necrotic' :
                            damageTypes === 'radiant' ? 'Radiant' :
                            damageTypes === 'force' ? 'Force' :
                            damageTypes.charAt(0).toUpperCase() + damageTypes.slice(1);
            shieldBullets.push(`${typeText} only`);
          }

          // Add overflow behavior if not default
          if (overflow === 'convert_to_healing') {
            shieldBullets.push('Excess → Healing');
          }

          // Add break behavior if not default
          if (breakBehavior === 'shatter') {
            shieldBullets.push('Shatters');
          } else if (breakBehavior === 'fade') {
            shieldBullets.push('Fades');
          }

          // Return the description and bullets as an object so we can handle them separately
          return {
            description: baseDescription,
            bullets: shieldBullets
          };
        }
      }
    }

    // Fallback to legacy healing system
    if (spell.healing) {
      // Check if healing uses card or coin resolution (legacy)
      if (spell.resolution === 'CARDS' && (spell.healingCardConfig?.formula || spell.healingConfig?.cardConfig?.formula)) {
        const cardConfig = spell.healingCardConfig || spell.healingConfig?.cardConfig;
        const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
        const formula = cardConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3';
        const cleanedFormula = cleanFormula(formula);
        return `Draw ${drawCount} cards: ${cleanedFormula}`;
      } else if (spell.resolution === 'COINS' && (spell.healingCoinConfig?.formula || spell.healingConfig?.coinConfig?.formula)) {
        const coinConfig = spell.healingCoinConfig || spell.healingConfig?.coinConfig;
        const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
        const formula = coinConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2';
        const cleanedFormula = cleanFormula(formula);
        return `Flip ${flipCount} coins: ${cleanedFormula}`;
      } else {
        // Standard dice-based healing (legacy)
        const dice = spell.healing.dice || '';
        const flat = spell.healing.flat > 0 ? ` + ${spell.healing.flat}` : '';
        const healingFormula = `${dice}${flat}`;
        return cleanFormula(healingFormula);
      }
    }

    return null;
  };

  const formatCombinedHealing = () => {
    if (!spell?.healingConfig) return null;

    // Use the main cleanFormula function defined above

    const effects = [];

    // Check for additional HoT effect
    if (spell.healingConfig.hasHotEffect && spell.healingConfig.hotFormula) {
      const duration = spell.healingConfig.hotDuration || 3;
      const tickFrequency = spell.healingConfig.hotTickType || 'round';
      const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;
      effects.push(`${cleanFormula(spell.healingConfig.hotFormula)} per ${tickFrequency} for ${durationText}`);
    }

    // Check for additional shield effect
    if (spell.healingConfig.hasShieldEffect && spell.healingConfig.shieldFormula) {
      const shieldDuration = spell.healingConfig.shieldDuration || 3;
      const damageTypes = spell.healingConfig.shieldDamageTypes || 'all';

      let shieldText = `${cleanFormula(spell.healingConfig.shieldFormula)} absorption for ${shieldDuration} round${shieldDuration !== 1 ? 's' : ''}`;

      // Add damage type absorption if not all types
      if (damageTypes !== 'all') {
        const typeText = damageTypes === 'physical' ? 'physical damage' :
                        damageTypes === 'magical' ? 'magical damage' :
                        damageTypes === 'fire' ? 'fire damage' :
                        damageTypes === 'cold' ? 'cold damage' :
                        damageTypes === 'lightning' ? 'lightning damage' :
                        damageTypes === 'acid' ? 'acid damage' :
                        damageTypes === 'poison' ? 'poison damage' :
                        damageTypes === 'necrotic' ? 'necrotic damage' :
                        damageTypes === 'radiant' ? 'radiant damage' :
                        damageTypes === 'force' ? 'force damage' :
                        damageTypes;
        shieldText += ` (${typeText} only)`;
      }

      effects.push(shieldText);
    }

    return effects.length > 0 ? effects.join('. ') : null;
  };



  const getDamageTypes = () => {
    if (!spell) return [];

    // Use a Set to automatically handle duplicates
    const damageTypesSet = new Set();

    // Priority order: damageTypes array first, then other sources
    if (spell.damageTypes && Array.isArray(spell.damageTypes) && spell.damageTypes.length > 0) {
      spell.damageTypes.forEach(type => {
        if (type && type.trim()) {
          damageTypesSet.add(type.toLowerCase().trim());
        }
      });
    }

    // Only add elementType if we don't have explicit damage types
    // NEVER use school as damage type - schools and damage types are completely separate
    if (damageTypesSet.size === 0) {
      // Only use elementType if it's explicitly set, different from school, and not a magic school
      if (spell.elementType && spell.elementType.trim()) {
        const elementType = spell.elementType.toLowerCase().trim();
        const school = (spell.school || '').toLowerCase().trim();
        const magicSchools = ['arcane', 'divine', 'primal', 'occult', 'evocation', 'necromancy', 'enchantment', 'illusion', 'transmutation', 'conjuration', 'abjuration', 'divination'];

        // Only add if it's not the same as school and not a magic school
        if (elementType !== school && !magicSchools.includes(elementType)) {
          damageTypesSet.add(elementType);
        }
      }

      // Only use damageConfig elementType if it's explicitly set and not a magic school
      if (spell.damageConfig?.elementType && spell.damageConfig.elementType.trim()) {
        const elementType = spell.damageConfig.elementType.toLowerCase().trim();
        const magicSchools = ['arcane', 'divine', 'primal', 'occult', 'evocation', 'necromancy', 'enchantment', 'illusion', 'transmutation', 'conjuration', 'abjuration', 'divination'];

        if (!magicSchools.includes(elementType)) {
          damageTypesSet.add(elementType);
        }
      }
    }

    // Valid damage types (normalize cold/ice/frost to just 'cold')
    const validDamageTypes = ['fire', 'cold', 'lightning', 'thunder', 'electric',
                             'poison', 'acid', 'necrotic', 'shadow', 'radiant', 'holy',
                             'arcane', 'force', 'physical', 'slashing', 'piercing', 'bludgeoning',
                             'nature', 'void', 'psychic'];

    // Normalize similar types
    const normalizedTypes = Array.from(damageTypesSet).map(type => {
      if (type === 'ice' || type === 'frost') return 'cold';
      if (type === 'electric') return 'lightning';
      return type;
    });

    // Filter valid types and remove duplicates again after normalization
    const finalTypes = [...new Set(normalizedTypes)]
      .filter(type => validDamageTypes.includes(type))
      .slice(0, 2); // Limit to 2 damage types for cleaner display

    return finalTypes;
  };

  const getSpellTags = () => {
    if (!spell) return [];

    const tags = [];

    // Add spell tags (only explicit tags, not auto-generated ones)
    if (spell.tags && Array.isArray(spell.tags)) {
      tags.push(...spell.tags);
    }

    // Add effect types as tags, but filter out unwanted ones
    if (spell.effectTypes && Array.isArray(spell.effectTypes)) {
      const filteredEffectTypes = spell.effectTypes.filter(effectType => {
        // Filter out effect types that shouldn't be shown as tags
        const unwantedEffects = ['debuff']; // Add more here if needed
        return !unwantedEffects.includes(effectType.toLowerCase());
      });
      tags.push(...filteredEffectTypes);
    }

    return [...new Set(tags)].slice(0, 6); // Limit tags for space
  };

  // ===== BUFF/DEBUFF FORMATTING FUNCTIONS =====

  const formatBuffEffects = () => {
    if (!spell?.buffConfig) return null;

    const { buffConfig } = spell;
    const effects = [];

    // Format stat modifiers with special handling for resistance and absorption
    if (buffConfig.statModifiers && buffConfig.statModifiers.length > 0) {
      const regularStats = [];
      const resistanceStats = [];
      const absorptionStats = [];

      buffConfig.statModifiers.forEach(stat => {
        // Check if this is a resistance stat with special scaling
        const isResistanceStat = stat.name && stat.name.toLowerCase().includes('resistance');
        const isAbsorptionStat = stat.name && stat.name.toLowerCase().includes('absorption');

        if (isResistanceStat && stat.magnitudeType === 'percentage') {
          // Handle resistance percentage values with thematic descriptions
          const percentage = stat.magnitude;
          const damageType = extractDamageTypeFromResistanceName(stat.name);

          let resistanceDescription = '';
          if (percentage === -200) {
            resistanceDescription = getThematicResistanceDescription('vampiric', damageType);
          } else if (percentage === -100) {
            resistanceDescription = getThematicResistanceDescription('absorbing', damageType);
          } else if (percentage === -50) {
            resistanceDescription = getThematicResistanceDescription('draining', damageType);
          } else if (percentage === -25) {
            resistanceDescription = getThematicResistanceDescription('siphoning', damageType);
          } else if (percentage === 0) {
            resistanceDescription = getThematicResistanceDescription('immune', damageType);
          } else if (percentage === 25) {
            resistanceDescription = getThematicResistanceDescription('slight_reduction', damageType);
          } else if (percentage === 50) {
            resistanceDescription = getThematicResistanceDescription('resistant', damageType);
          } else if (percentage === 75) {
            resistanceDescription = getThematicResistanceDescription('guarded', damageType);
          } else if (percentage === 100) {
            resistanceDescription = getThematicResistanceDescription('nullified', damageType);
          } else if (percentage === 125) {
            resistanceDescription = getThematicResistanceDescription('susceptible', damageType);
          } else if (percentage === 150) {
            resistanceDescription = getThematicResistanceDescription('exposed', damageType);
          } else if (percentage === 200) {
            resistanceDescription = getThematicResistanceDescription('vulnerable', damageType);
          } else {
            // Fallback to percentage display
            const sign = percentage >= 0 ? '+' : '';
            resistanceDescription = `${sign}${percentage}% resistance`;
          }

          resistanceStats.push({
            name: stat.name,
            description: resistanceDescription
          });
        } else if (isAbsorptionStat) {
          // Handle absorption values
          const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
          const damageTypeText = damageType && damageType !== 'damage' && damageType !== 'all damage' ? damageType : 'all';

          let absorptionDescription = '';
          if (typeof stat.magnitude === 'string') {
            // It's a dice formula
            if (damageTypeText === 'all') {
              absorptionDescription = `Reduce each damage hit by ${stat.magnitude}`;
            } else {
              absorptionDescription = `Reduce each ${damageTypeText} damage hit by ${stat.magnitude}`;
            }
          } else {
            // Handle flat absorption values - shield pool that depletes
            if (damageTypeText === 'all') {
              absorptionDescription = `${stat.magnitude} point damage shield (depletes when consumed)`;
            } else {
              absorptionDescription = `${stat.magnitude} point ${damageTypeText} damage shield (depletes when consumed)`;
            }
          }

          absorptionStats.push({
            name: stat.name,
            description: absorptionDescription
          });
        } else {
          // Regular stat modifiers
          const magnitude = stat.magnitude || 0;
          const sign = magnitude >= 0 ? '+' : '';
          const displayValue = stat.magnitudeType === 'percentage'
            ? `${sign}${magnitude}%`
            : `${sign}${magnitude}`;
          regularStats.push(`${stat.name}: ${displayValue} bonus`);
        }
      });

      // Add regular stats as one group
      if (regularStats.length > 0) {
        effects.push({
          name: 'Stat Modifiers',
          mechanicsText: regularStats.join(', ')
        });
      }

      // Add resistance stats as separate effects
      resistanceStats.forEach(resistance => {
        effects.push({
          name: resistance.name,
          description: resistance.description
        });
      });

      // Add absorption stats as separate effects
      absorptionStats.forEach(absorption => {
        effects.push({
          name: absorption.name,
          description: absorption.description
        });
      });
    }

    // Format status effects
    if (buffConfig.statusEffects && buffConfig.statusEffects.length > 0) {
      buffConfig.statusEffects.forEach(effect => {
        let effectName = effect.name || effect.id || 'Status Effect';
        effectName = effectName.charAt(0).toUpperCase() + effectName.slice(1);

        let mechanicsText = '';
        const mechanicsParts = [];

        // Add level information
        if (effect.level && effect.level !== 'moderate') {
          const levelMap = {
            'minor': 'Minor',
            'major': 'Major',
            'severe': 'Severe',
            'extreme': 'Extreme'
          };
          const levelDisplay = levelMap[effect.level] || effect.level;
          effectName = `${levelDisplay} ${effectName}`;
        }

        // Add save information if applicable
        if (effect.saveType && effect.saveType !== 'none') {
          let saveText = `${effect.saveType.charAt(0).toUpperCase() + effect.saveType.slice(1)} save`;
          if (effect.saveDC) {
            saveText += ` DC ${effect.saveDC}`;
          }
          mechanicsParts.push(saveText);
        }

        // Add duration if specified
        if (effect.duration && effect.duration !== 'default') {
          mechanicsParts.push(`${effect.duration} duration`);
        }

        mechanicsText = mechanicsParts.join(', ');

        effects.push({
          name: effectName,
          description: effect.description || '',
          mechanicsText: mechanicsText
        });
      });
    }

    return effects.length > 0 ? effects : null;
  };







  const formatPurificationEffects = () => {
    if (!spell?.purificationConfig) return null;

    const { purificationConfig } = spell;
    const effects = [];

    // Handle different purification types
    if (purificationConfig.purificationType === 'dispel') {
      // Format dispel effects - only show if there are selected effects
      if (purificationConfig.selectedEffects && purificationConfig.selectedEffects.length > 0) {
        // Filter effects to only show those that match the current purification type
        const dispelEffects = purificationConfig.selectedEffects.filter(effect =>
          !effect.purificationType || effect.purificationType === 'dispel'
        );

        dispelEffects.forEach(effect => {
          const effectName = effect.name || 'Unknown Effect';
          let effectDescription = effect.description || '';

          // Add specific effect types if available
          if (effect.specificEffectTypes && effect.specificEffectTypes.length > 0) {
            const specificTypes = effect.specificEffectTypes.join(', ');
            effectDescription += effectDescription ? ` (${specificTypes})` : `Targets: ${specificTypes}`;
          }

          // Add custom effects count if specified
          let mechanicsText = '';
          if (effect.customEffects && effect.customEffects > 1) {
            mechanicsText = `Removes up to ${effect.customEffects} effects`;
          }

          effects.push({
            name: effectName,
            description: effectDescription,
            mechanicsText: mechanicsText
          });
        });
      }
    } else if (purificationConfig.purificationType === 'resurrection') {
      // Format resurrection effects
      if (purificationConfig.selectedEffects && purificationConfig.selectedEffects.length > 0) {
        // Filter effects to only show those that match the current purification type
        const resurrectionEffects = purificationConfig.selectedEffects.filter(effect =>
          !effect.purificationType || effect.purificationType === 'resurrection'
        );

        resurrectionEffects.forEach(effect => {
          const resolution = effect.resolution || purificationConfig.resolution || 'DICE';
          const formula = effect.resurrectionFormula || purificationConfig.resurrectionFormula || '2d8 + SPI';

          let resolutionText = '';
          switch (resolution) {
            case 'CARDS':
              resolutionText = 'Draw cards';
              break;
            case 'COINS':
              resolutionText = 'Flip coins';
              break;
            case 'DICE':
            default:
              resolutionText = 'Roll dice';
              break;
          }

          effects.push({
            name: effect.name || 'Resurrection',
            description: resolutionText,
            mechanicsText: `${cleanFormula(formula)} health restored`
          });
        });
      } else {
        // Show default resurrection effect if no specific effects are selected
        const resolution = purificationConfig.resolution || 'DICE';
        const formula = purificationConfig.resurrectionFormula || '2d8 + SPI';

        let resolutionText = '';
        switch (resolution) {
          case 'CARDS':
            resolutionText = 'Draw cards';
            break;
          case 'COINS':
            resolutionText = 'Flip coins';
            break;
          case 'DICE':
          default:
            resolutionText = 'Roll dice';
            break;
        }

        effects.push({
          name: 'Resurrection',
          description: resolutionText,
          mechanicsText: `${cleanFormula(formula)} health restored`
        });
      }
    }

    return effects.length > 0 ? effects : null;
  };

  const formatDebuffEffects = () => {
    if (!spell?.debuffConfig) return null;

    const { debuffConfig } = spell;
    const effects = [];

    // Format stat modifiers with special handling for resistance and absorption
    const statModifiers = debuffConfig.statPenalties || debuffConfig.statModifiers || [];
    if (statModifiers.length > 0) {
      const regularStats = [];
      const resistanceStats = [];
      const absorptionStats = [];

      statModifiers.forEach(stat => {
        // Check if this is a resistance stat with special scaling
        const isResistanceStat = stat.name && stat.name.toLowerCase().includes('resistance');
        const isAbsorptionStat = stat.name && stat.name.toLowerCase().includes('absorption');

        if (isResistanceStat && stat.magnitudeType === 'percentage') {
          // Handle resistance percentage values with thematic descriptions
          const percentage = stat.magnitude;
          const damageType = extractDamageTypeFromResistanceName(stat.name);

          let resistanceDescription = '';
          if (percentage === -200) {
            resistanceDescription = getThematicResistanceDescription('vampiric', damageType);
          } else if (percentage === -100) {
            resistanceDescription = getThematicResistanceDescription('absorbing', damageType);
          } else if (percentage === -50) {
            resistanceDescription = getThematicResistanceDescription('draining', damageType);
          } else if (percentage === -25) {
            resistanceDescription = getThematicResistanceDescription('siphoning', damageType);
          } else if (percentage === 0) {
            resistanceDescription = getThematicResistanceDescription('immune', damageType);
          } else if (percentage === 25) {
            resistanceDescription = getThematicResistanceDescription('slight_reduction', damageType);
          } else if (percentage === 50) {
            resistanceDescription = getThematicResistanceDescription('resistant', damageType);
          } else if (percentage === 75) {
            resistanceDescription = getThematicResistanceDescription('guarded', damageType);
          } else if (percentage === 100) {
            resistanceDescription = getThematicResistanceDescription('nullified', damageType);
          } else if (percentage === 125) {
            resistanceDescription = getThematicResistanceDescription('susceptible', damageType);
          } else if (percentage === 150) {
            resistanceDescription = getThematicResistanceDescription('exposed', damageType);
          } else if (percentage === 200) {
            resistanceDescription = getThematicResistanceDescription('vulnerable', damageType);
          } else {
            // Fallback to percentage display
            const sign = percentage >= 0 ? '+' : '';
            resistanceDescription = `${sign}${percentage}% resistance`;
          }

          resistanceStats.push({
            name: stat.name,
            description: resistanceDescription
          });
        } else if (isAbsorptionStat) {
          // Handle absorption values
          const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
          const damageTypeText = damageType && damageType !== 'damage' && damageType !== 'all damage' ? damageType : 'all';

          let absorptionDescription = '';
          if (typeof stat.magnitude === 'string') {
            // It's a dice formula
            absorptionDescription = `Reduces ${stat.magnitude} absorption`;
            if (damageTypeText !== 'all') {
              absorptionDescription += ` (${damageTypeText} only)`;
            }
          } else {
            // Handle flat absorption reduction
            absorptionDescription = `Reduces ${Math.abs(stat.magnitude)} point absorption`;
            if (damageTypeText !== 'all') {
              absorptionDescription += ` (${damageTypeText} only)`;
            }
          }

          absorptionStats.push({
            name: stat.name,
            description: absorptionDescription
          });
        } else {
          // Regular stat modifiers
          const magnitude = stat.magnitude || 0;
          const sign = magnitude >= 0 ? '+' : '';
          const displayValue = stat.magnitudeType === 'percentage'
            ? `${sign}${magnitude}%`
            : `${sign}${magnitude}`;
          regularStats.push(`${stat.name}: ${displayValue} penalty`);
        }
      });

      // Add regular stats as one group
      if (regularStats.length > 0) {
        effects.push({
          name: 'Stat Penalties',
          mechanicsText: regularStats.join(', ')
        });
      }

      // Add resistance stats as separate effects
      resistanceStats.forEach(resistance => {
        effects.push({
          name: resistance.name,
          description: resistance.description
        });
      });

      // Add absorption stats as separate effects
      absorptionStats.forEach(absorption => {
        effects.push({
          name: absorption.name,
          description: absorption.description
        });
      });
    }

    // Helper function to get default save type for status effects
    const getDefaultSaveType = (effectId) => {
      const defaultSaves = {
        'charmed': 'wisdom',
        'frightened': 'wisdom',
        'fear': 'wisdom',

        'blinded': 'constitution',
        'blind': 'constitution',
        'paralyzed': 'constitution',
        'poisoned': 'constitution',
        'restrained': 'strength',
        'silenced': 'constitution',

        'weakened': 'constitution',
        'confused': 'wisdom',
        'diseased': 'constitution',
        'bleeding': 'constitution',
        'cursed': 'wisdom'
      };
      return defaultSaves[effectId] || 'constitution';
    };

    // Format status effects
    if (debuffConfig.statusEffects && debuffConfig.statusEffects.length > 0) {
      debuffConfig.statusEffects.forEach(effect => {
        let effectName = effect.name || effect.id || 'Status Effect';
        effectName = effectName.charAt(0).toUpperCase() + effectName.slice(1);

        let mechanicsText = '';
        const mechanicsParts = [];

        // Add level information
        if (effect.level && effect.level !== 'moderate') {
          const levelMap = {
            'minor': 'Minor',
            'major': 'Major',
            'severe': 'Severe',
            'extreme': 'Extreme'
          };
          const levelDisplay = levelMap[effect.level] || effect.level;
          effectName = `${levelDisplay} ${effectName}`;
        }

        // Add save information if applicable
        if (effect.saveType && effect.saveType !== 'none') {
          let saveText = `${effect.saveType.charAt(0).toUpperCase() + effect.saveType.slice(1)} save`;
          if (effect.saveDC) {
            saveText += ` DC ${effect.saveDC}`;
          }
          mechanicsParts.push(saveText);
        }

        // Add duration if specified
        if (effect.duration && effect.duration !== 'default') {
          mechanicsParts.push(`${effect.duration} duration`);
        }

        mechanicsText = mechanicsParts.join(', ');

        effects.push({
          name: effectName,
          description: effect.description || '',
          mechanicsText: mechanicsText
        });
      });
    }

    return effects.length > 0 ? effects : null;
  };

  // ===== EVENT HANDLERS =====

  const handleClick = (e) => {
    if (onClick) onClick(spell.id || spell);
    if (onSelect) onSelect(spell);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e);
    }
  };

  const handleDragStart = (e) => {
    if (isDraggable) {
      // Format spell data for action bar compatibility
      const spellData = {
        id: spell.id,
        name: spell.name,
        icon: spell.icon || 'spell_holy_holybolt',
        cooldown: spell.cooldown || 0,
        level: spell.level || 1,
        spellType: spell.spellType || 'ACTION'
      };
      e.dataTransfer.setData('application/json', JSON.stringify(spellData));
      e.dataTransfer.effectAllowed = 'copy';
      console.log('Dragging spell from UnifiedSpellCard backup:', spellData);
    }
  };

  // ===== MAIN RENDER FUNCTION =====

  const renderSpellCard = () => (
    <div
      className={`unified-spell-card ${variant} ${getRarityClass()} ${getSpellSchoolClass()} ${isSelected ? 'selected' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onContextMenu={onContextMenu}
      onDragStart={handleDragStart}
      draggable={isDraggable}
      tabIndex={0}
      style={style}
    >
      {/* Spell content will be rendered here */}
      <div className="spell-card-content">
        {/* This is where the spell card content would go */}
        <div className="spell-name">{spell?.name || 'Unnamed Spell'}</div>
      </div>
    </div>
  );

  // Return the unified spell card
  return renderSpellCard();
};

UnifiedSpellCard.propTypes = {
  spell: PropTypes.object.isRequired,
  variant: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  onContextMenu: PropTypes.func,
  isDraggable: PropTypes.bool,
  isSelected: PropTypes.bool
};

export default UnifiedSpellCard;

  // ===== MAIN RENDER FUNCTION =====

  const renderSpellCard = () => (
    <div
      className={`unified-spell-card ${variant} ${getRarityClass()} ${getSpellSchoolClass()} ${isSelected ? 'selected' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onContextMenu={onContextMenu}
      onDragStart={handleDragStart}
      draggable={isDraggable}
      tabIndex={onClick || onSelect ? "0" : undefined}
      role={onClick || onSelect ? "button" : undefined}
      aria-selected={isSelected}
      style={{
        border: `2px solid ${getBorderColor()}`,
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.5), 0 0 10px ${getBorderColor()}40`
      }}
      {...props}
    >
      {/* Card Gloss Effect */}
      <div className="spell-card-gloss"></div>

      {/* Category Indicators (for library/collection variants) */}
      {(variant === 'library' || variant === 'collection') && categories && categories.length > 0 && (
        <div className="spell-card-categories">
          {categories.slice(0, 3).map((category, index) => (
            <div
              key={index}
              className="spell-card-category-indicator"
              style={{ backgroundColor: category.color || '#3b82f6' }}
            />
          ))}
        </div>
      )}

      {/* Card Header */}
      <div className="unified-spell-card-header">
        {/* Header Main Row - Icon, Name, Resource Cost */}
        <div className="unified-spell-header-main">
          <div className="unified-spell-icon-container">
            <img
              src={`https://wow.zamimg.com/images/wow/icons/large/${getSpellIcon()}.jpg`}
              alt={spell?.name || 'Spell'}
              className="unified-spell-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
              }}
            />

            {/* Spell Type Badge (for spellbook variant only) */}
            {variant === 'spellbook' && (
              <div className="spell-type-badge">
                {spell?.spellType || 'ACTION'}
              </div>
            )}
          </div>

          <div className="unified-spell-info">
            <h3 className="unified-spell-name">{spell?.name || 'Unnamed Spell'}</h3>

            {/* Meta information varies by variant */}
            <div className="unified-spell-meta">
              {variant === 'spellbook' && (
                <>
                  <span className="spell-cast-time">{formatCastTime()}</span>
                  <span className="spell-range">{formatRange()}</span>
                </>
              )}

            </div>
          </div>

          {/* Resource Cost - Only show for spellbook variant */}
          {variant === 'spellbook' && (
            <div className="unified-spell-cost">
              {formatResourceCosts()}
            </div>
          )}
        </div>

        {/* Header Details Row - Action Type, Range, Damage Types */}
        {(variant === 'library' || variant === 'wizard' || variant === 'collection') && (
          <div className="unified-spell-header-details">
            {/* Main badges row - action type, range, damage types on same line */}
            <div className="unified-spell-badges-row">
              {/* Action Type Badge - simplified without bullets */}
              <div className={`pf-action-type-badge ${(spell?.spellType || 'action').toLowerCase()}`}>
                <div className="pf-action-type-content">
                  <span className="pf-action-type-name">{spell?.spellType || 'Action'}</span>
                </div>
              </div>

              {/* Range Badge */}
              <div className="pf-range-badge">
                <div className="pf-range-icon"></div>
                <span>{formatRange()}</span>
              </div>

              {/* Damage Types */}
              {getDamageTypes().length > 0 && (
                <div className="pf-damage-types">
                  {getDamageTypes().map((damageType, index) => (
                    <div key={index} className={`pf-damage-type-badge ${damageType.toLowerCase()}`}>
                      <div className="pf-damage-type-icon"></div>
                      <span className="pf-damage-type-text">{damageType}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bullet points row - appears below the badges */}
            {formatTypeSpecificBullets().length > 0 && (
              <div className="unified-spell-bullets-row">
                {formatTypeSpecificBullets().map((bullet, index) => (
                  <span key={index} className="unified-spell-bullet">• {bullet}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>



      {/* Card Body */}
      {showDescription && (
        <div className="unified-spell-card-body">
          {/* Description */}
          {spell?.description && (
            <div className="item-description">
              "{spell.description}"
            </div>
          )}

          {/* Stats (varies by variant) */}
          {showStats && (
            <div className="unified-spell-stats">
              {/* Damage Display - Only show if damage is actually configured */}
              {(() => {
                // Check if there's actual damage configuration (not healing)
                const hasPrimaryDamage = spell?.primaryDamage?.dice && spell.primaryDamage.dice !== '6d6';
                const hasDamageFormula = spell?.damageConfig?.formula && spell.damageConfig.formula.trim();
                // Only check for card/coin damage if there's actual damage config AND damage effect type
                const hasCardDamage = spell?.resolution === 'CARDS' && spell?.cardConfig && spell?.damageConfig && spell?.effectTypes?.includes('damage');
                const hasCoinDamage = spell?.resolution === 'COINS' && spell?.coinConfig && spell?.damageConfig && spell?.effectTypes?.includes('damage');
                const hasDiceDamage = spell?.resolution === 'DICE' && spell?.diceConfig?.formula && spell.diceConfig.formula.trim() && spell?.damageConfig && spell?.effectTypes?.includes('damage');
                const hasDamageEffect = spell?.effectTypes?.includes('damage');

                return hasPrimaryDamage || hasDamageFormula || hasCardDamage || hasCoinDamage || hasDiceDamage || hasDamageEffect;
              })() && (
                <div className="damage-effects">
                  <div className="damage-effects-section">
                    <div className="damage-header">
                      <span className="damage-label">DAMAGE</span>
                    </div>
                    <div className="damage-separator"></div>
                    {(() => {
                      const damageData = spell?.damageConfig;
                      if (!damageData) return null;

                      const effects = [];

                      // Main instant damage effect
                      const damageResult = formatDamage();
                      if (damageResult) {
                        if (typeof damageResult === 'object' && damageResult.instant && damageResult.dot) {
                          // Instant damage
                          effects.push({
                            name: 'Instant Damage',
                            description: 'Roll dice',
                            mechanicsText: damageResult.instant
                          });

                          // DoT damage
                          effects.push({
                            name: 'Damage Over Time',
                            description: `Per round for ${damageData?.dotConfig?.duration || 3} rounds`,
                            mechanicsText: damageResult.dot
                          });
                        } else {
                          // Single damage effect
                          const isDotOnly = damageData?.damageType === 'dot' && !damageData?.hasDotEffect;
                          effects.push({
                            name: isDotOnly ? 'Damage Over Time' : 'Instant Damage',
                            description: isDotOnly ? `Per round for ${damageData?.dotConfig?.duration || 3} rounds` : 'Roll dice',
                            mechanicsText: damageResult
                          });
                        }
                      }

                      // Add saving throw info
                      if (damageData?.savingThrowConfig?.enabled) {
                        const saveInfo = formatSavingThrow();
                        if (saveInfo) {
                          effects.push({
                            name: 'Saving Throw',
                            description: saveInfo,
                            mechanicsText: damageData.savingThrowConfig.partialEffect ? 'Half damage on save' : 'Negated on save'
                          });
                        }
                      }

                      // Add critical hit info
                      if (damageData?.criticalConfig?.enabled) {
                        const critInfo = formatCriticalHit();
                        if (critInfo) {
                          effects.push({
                            name: 'Critical Hit',
                            description: critInfo,
                            mechanicsText: 'Enhanced damage on critical'
                          });
                        }
                      }

                      // Add chance on hit info
                      if (damageData?.chanceOnHitConfig?.enabled) {
                        const chanceInfo = formatChanceOnHit();
                        if (chanceInfo) {
                          effects.push({
                            name: 'Chance Effect',
                            description: chanceInfo,
                            mechanicsText: 'Additional effect on trigger'
                          });
                        }
                      }

                      return effects.length > 0 ? (
                        <div className="damage-formula-line">
                          <div className="damage-effects-list">
                            {effects.map((effect, index) => (
                              <div key={`damage-${index}`} className="damage-effect-item">
                                <div className="damage-effect">
                                  <span className="damage-effect-name">
                                    {effect.name}
                                  </span>
                                  {effect.description && effect.description !== effect.name && (
                                    <span className="damage-effect-description">
                                      {" - "}{effect.description}
                                    </span>
                                  )}
                                </div>
                                {effect.mechanicsText && (
                                  <div className="damage-effect-details">
                                    <div className="damage-effect-mechanics">
                                      {effect.mechanicsText}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="damage-formula-line">
                          <span className="damage-formula-value">Configure damage effects in the spellcrafting wizard</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}



              {/* Healing Display - Only show if healing is actually configured */}
              {(() => {
                // Check if there's actual healing configuration (more specific check)
                const hasDirectHealingFormula = spell?.healingConfig?.healingType === 'direct' && (
                  (spell.resolution === 'CARDS' && spell.healingConfig?.cardConfig?.formula) ||
                  (spell.resolution === 'COINS' && spell.healingConfig?.coinConfig?.formula) ||
                  (spell.resolution === 'DICE' && spell.healingConfig?.formula)
                );

                const hasHotHealingFormula = spell?.healingConfig?.healingType === 'hot' && (
                  (spell.resolution === 'CARDS' && spell.healingConfig?.hotCardConfig?.formula) ||
                  (spell.resolution === 'COINS' && spell.healingConfig?.hotCoinConfig?.formula) ||
                  (spell.resolution === 'DICE' && spell.healingConfig?.hotFormula)
                );

                const hasShieldHealingFormula = spell?.healingConfig?.healingType === 'shield' && (
                  (spell.resolution === 'CARDS' && spell.healingConfig?.shieldCardConfig?.formula) ||
                  (spell.resolution === 'COINS' && spell.healingConfig?.shieldCoinConfig?.formula) ||
                  (spell.resolution === 'DICE' && spell.healingConfig?.shieldFormula)
                );

                const hasLegacyHealing = spell?.healing && (spell.healing.dice || spell.healing.flat > 0);
                const hasHealingEffect = spell?.effectTypes?.includes('healing');

                return hasDirectHealingFormula || hasHotHealingFormula || hasShieldHealingFormula || hasLegacyHealing || hasHealingEffect;
              })() && (
                <div className="healing-effects">
                  <div className="healing-effects-section">
                    <div className="healing-header">
                      <span className="healing-label">HEALING</span>
                      <span className="healing-type">
                        {spell?.healingConfig?.healingType === 'hot' ? 'Over Time' :
                         spell?.healingConfig?.healingType === 'shield' ? 'Shield' : 'Hit Points'}
                      </span>
                    </div>
                    <div className="healing-separator"></div>
                    {(() => {
                      const healingData = spell?.healingConfig;
                      if (!healingData) return null;

                      const effects = [];

                      // Main healing effect
                      const healingResult = formatHealing();
                      if (healingResult) {
                        if (typeof healingResult === 'object' && healingResult.description) {
                          // Shield healing
                          effects.push({
                            name: 'Shield Absorption',
                            description: 'Absorbs damage',
                            mechanicsText: healingResult.description
                          });

                          // Add shield properties as separate effects
                          if (healingResult.bullets && healingResult.bullets.length > 0) {
                            healingResult.bullets.forEach((bullet, index) => {
                              effects.push({
                                name: `  └ Shield Property`,
                                description: bullet,
                                mechanicsText: 'Special shield behavior'
                              });
                            });
                          }
                        } else {
                          // Regular healing
                          const healingType = healingData.healingType;
                          effects.push({
                            name: healingType === 'hot' ? 'Healing Over Time' :
                                  healingType === 'shield' ? 'Shield Absorption' : 'Instant Healing',
                            description: healingType === 'hot' ? `Per round for ${healingData.hotDuration || 3} rounds` : 'Roll dice',
                            mechanicsText: healingResult
                          });
                        }
                      }

                      // Add HoT effect if it's an additional effect
                      if (healingData.hasHotEffect && healingData.hotFormula && healingData.healingType !== 'hot') {
                        const duration = healingData.hotDuration || 3;
                        effects.push({
                          name: 'Healing Over Time',
                          description: `Per round for ${duration} rounds`,
                          mechanicsText: `${cleanFormula(healingData.hotFormula)} hit points restored`
                        });
                      }

                      // Add shield effect if it's an additional effect
                      if (healingData.hasShieldEffect && healingData.shieldFormula && healingData.healingType !== 'shield') {
                        const duration = healingData.shieldDuration || 3;
                        effects.push({
                          name: 'Shield Absorption',
                          description: `For ${duration} rounds`,
                          mechanicsText: `${cleanFormula(healingData.shieldFormula)} absorption`
                        });
                      }

                      // Add critical healing info
                      if (healingData?.criticalConfig?.enabled) {
                        const critInfo = formatCriticalHit();
                        if (critInfo) {
                          effects.push({
                            name: 'Critical Healing',
                            description: critInfo,
                            mechanicsText: 'Enhanced healing on critical'
                          });
                        }
                      }

                      // Add chance on heal info
                      if (healingData?.chanceOnHitConfig?.enabled) {
                        const chanceInfo = formatChanceOnHit();
                        if (chanceInfo) {
                          effects.push({
                            name: 'Chance Effect',
                            description: chanceInfo,
                            mechanicsText: 'Additional effect on trigger'
                          });
                        }
                      }

                      return effects.length > 0 ? (
                        <div className="healing-formula-line">
                          <div className="healing-effects-list">
                            {effects.map((effect, index) => (
                              <div key={`healing-${index}`} className="healing-effect-item">
                                <div className="healing-effect">
                                  <span className="healing-effect-name">
                                    {effect.name}
                                  </span>
                                  {effect.description && effect.description !== effect.name && (
                                    <span className="healing-effect-description">
                                      {" - "}{effect.description}
                                    </span>
                                  )}
                                </div>
                                {effect.mechanicsText && (
                                  <div className="healing-effect-details">
                                    <div className="healing-effect-mechanics">
                                      {effect.mechanicsText}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="healing-formula-line">
                          <span className="healing-formula-value">Configure healing effects in the spellcrafting wizard</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}



              {/* Duration (if not instant) - exclude CHANNELED and ZONE since they're shown in bullets */}
              {(spell?.durationType && spell.durationType !== 'instant') &&
               (!spell?.spellType || !['CHANNELED', 'ZONE'].includes(spell.spellType)) ? (
                <div className="unified-spell-stat">
                  <span className="unified-stat-label">Duration:</span>
                  <span className="unified-stat-value">
                    {formatDuration()}
                  </span>
                </div>
              ) : null}

              {/* Buff Effects Section */}
              {(() => {
                const buffEffects = formatBuffEffects();
                const hasBuffType = spell?.effectTypes?.includes('buff');
                const hasBuffConfig = spell?.buffConfig;
                const hasAnyBuffConfiguration = hasBuffConfig && (
                  spell.buffConfig.statModifiers?.length > 0 ||
                  spell.buffConfig.statusEffects?.length > 0 ||
                  spell.buffConfig.duration ||
                  spell.buffConfig.durationType
                );

                return (hasBuffType || hasAnyBuffConfiguration) && (
                  <div className="unified-spell-stat buff-effects">
                    <div className="buff-effects-section">
                      <div className="buff-header">
                        <span className="buff-label">BUFF</span>
                        <span className="buff-type">Enhancement</span>
                        {(() => {
                          // Calculate duration text for buff header
                          let durationText = '';
                          if (spell?.buffConfig?.durationType) {
                            const buffConfig = spell.buffConfig;
                            switch (buffConfig.durationType) {
                              case 'turns':
                                durationText = `${buffConfig.durationValue || 3} turns`;
                                break;
                              case 'rounds':
                                durationText = `${buffConfig.durationValue || 3} rounds`;
                                break;
                              case 'time':
                                if (buffConfig.durationValue && buffConfig.durationUnit) {
                                  durationText = `${buffConfig.durationValue} ${buffConfig.durationUnit}`;
                                }
                                break;
                              case 'rest':
                                if (buffConfig.restType === 'short') {
                                  durationText = 'Until short rest';
                                } else if (buffConfig.restType === 'long') {
                                  durationText = 'Until long rest';
                                }
                                break;
                              case 'permanent':
                                durationText = 'Permanent';
                                break;
                            }
                          }

                          // Add concentration requirement to duration text if applicable
                          if (durationText && spell?.buffConfig?.concentrationRequired) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return durationText && (
                            <span className="buff-duration">{durationText}</span>
                          );
                        })()}
                      </div>
                      <div className="buff-formula-container">
                        {(() => {
                          const buffEffects = formatBuffEffects();

                          return buffEffects && buffEffects.length > 0 ? (
                            <div className="buff-formula-line">
                              <div className="buff-effects-list">
                                {buffEffects.map((effect, index) => (
                                  <div key={`buff-${index}`} className="buff-effect-item">
                                    <div className="buff-effect">
                                      <span className="buff-effect-name">{effect.name || effect}</span>
                                      {effect.description && effect.description !== effect.name && (
                                        <span className="buff-effect-description"> - {effect.description}</span>
                                      )}
                                    </div>
                                    {effect.mechanicsText && (
                                      <div className="buff-effect-details">
                                        <div className="buff-effect-mechanics">{effect.mechanicsText}</div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="buff-formula-line">
                              <span className="buff-formula-value">Configure buff effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* Debuff Effects Section */}
              {(() => {
                const debuffEffects = formatDebuffEffects();
                const hasDebuffType = spell?.effectTypes?.includes('debuff');
                const hasDebuffConfig = spell?.debuffConfig;
                const hasAnyDebuffConfiguration = hasDebuffConfig && (
                  spell.debuffConfig.statPenalties?.length > 0 ||
                  spell.debuffConfig.statModifiers?.length > 0 ||
                  spell.debuffConfig.statusEffects?.length > 0 ||
                  spell.debuffConfig.duration ||
                  spell.debuffConfig.durationType
                );

                return (hasDebuffType || hasAnyDebuffConfiguration) && (
                  <div className="unified-spell-stat debuff-effects">
                    <div className="debuff-effects-section">
                      <div className="debuff-header">
                        <span className="debuff-label">DEBUFF</span>
                        <span className="debuff-type">Penalty</span>
                        {(() => {
                          // Calculate duration text for debuff header
                          let durationText = '';
                          if (spell?.debuffConfig?.durationType) {
                            const debuffConfig = spell.debuffConfig;
                            switch (debuffConfig.durationType) {
                              case 'turns':
                                durationText = `${debuffConfig.durationValue || 3} turns`;
                                break;
                              case 'rounds':
                                durationText = `${debuffConfig.durationValue || 3} rounds`;
                                break;
                              case 'time':
                                if (debuffConfig.durationValue && debuffConfig.durationUnit) {
                                  durationText = `${debuffConfig.durationValue} ${debuffConfig.durationUnit}`;
                                }
                                break;
                              case 'rest':
                                if (debuffConfig.restType === 'short') {
                                  durationText = 'Until short rest';
                                } else if (debuffConfig.restType === 'long') {
                                  durationText = 'Until long rest';
                                }
                                break;
                              case 'permanent':
                                durationText = 'Permanent';
                                break;
                            }
                          }

                          // Add concentration requirement to duration text if applicable
                          if (durationText && spell?.debuffConfig?.concentrationRequired) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return durationText && (
                            <span className="debuff-duration">{durationText}</span>
                          );
                        })()}
                      </div>
                      <div className="debuff-separator"></div>
                      <div className="debuff-formula-container">
                        {(() => {
                          const effects = [];
                          const { debuffConfig } = spell;

                          // Format stat penalties/modifiers - group by type
                          const statModifiers = debuffConfig?.statPenalties || debuffConfig?.statModifiers || [];
                          if (statModifiers.length > 0) {
                            const regularStats = [];
                            const resistanceStats = [];
                            const absorptionStats = [];

                            statModifiers.forEach(stat => {
                              // Check if this is a resistance stat with special scaling
                              const isResistanceStat = stat.name && stat.name.toLowerCase().includes('resistance');
                              const isAbsorptionStat = stat.name && stat.name.toLowerCase().includes('absorption');

                              let statDisplay = {
                                name: stat.name || 'Stat Penalty',
                                value: '',
                                class: ''
                              };

                              if (typeof stat.magnitude === 'string') {
                                // It's a dice formula - could be absorption or regular stat
                                if (isAbsorptionStat) {
                                  const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
                                  statDisplay.value = `Reduces ${stat.magnitude} absorption`;
                                  if (damageType && damageType !== 'damage' && damageType !== 'all damage') {
                                    statDisplay.value += ` (${damageType} only)`;
                                  }
                                  statDisplay.class = 'absorption-formula';
                                } else {
                                  statDisplay.value = `${stat.magnitude} penalty`;
                                  statDisplay.class = 'formula';
                                }
                              } else if (isAbsorptionStat) {
                                // Handle flat absorption reduction
                                const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
                                statDisplay.value = `Reduces ${Math.abs(stat.magnitude)} point absorption`;
                                if (damageType && damageType !== 'damage' && damageType !== 'all damage') {
                                  statDisplay.value += ` (${damageType} only)`;
                                }
                                statDisplay.class = 'absorption-flat';
                              } else if (isResistanceStat && stat.magnitudeType === 'percentage') {
                                // Handle resistance percentage values with thematic descriptions
                                const percentage = stat.magnitude;
                                const damageType = extractDamageTypeFromResistanceName(stat.name);

                                if (percentage === -200) {
                                  statDisplay.value = getThematicResistanceDescription('vampiric', damageType);
                                  statDisplay.class = 'vampiric';
                                } else if (percentage === -100) {
                                  statDisplay.value = getThematicResistanceDescription('absorbing', damageType);
                                  statDisplay.class = 'absorbing';
                                } else if (percentage === -50) {
                                  statDisplay.value = getThematicResistanceDescription('draining', damageType);
                                  statDisplay.class = 'draining';
                                } else if (percentage === -25) {
                                  statDisplay.value = getThematicResistanceDescription('siphoning', damageType);
                                  statDisplay.class = 'siphoning';
                                } else if (percentage === 0) {
                                  statDisplay.value = getThematicResistanceDescription('immune', damageType);
                                  statDisplay.class = 'immune';
                                } else if (percentage === 25) {
                                  statDisplay.value = getThematicResistanceDescription('slight_reduction', damageType);
                                  statDisplay.class = 'slight_reduction';
                                } else if (percentage === 50) {
                                  statDisplay.value = getThematicResistanceDescription('resistant', damageType);
                                  statDisplay.class = 'resistant';
                                } else if (percentage === 75) {
                                  statDisplay.value = getThematicResistanceDescription('guarded', damageType);
                                  statDisplay.class = 'guarded';
                                } else if (percentage === 100) {
                                  statDisplay.value = getThematicResistanceDescription('nullified', damageType);
                                  statDisplay.class = 'nullified';
                                } else if (percentage === 125) {
                                  statDisplay.value = getThematicResistanceDescription('susceptible', damageType);
                                  statDisplay.class = 'susceptible';
                                } else if (percentage === 150) {
                                  statDisplay.value = getThematicResistanceDescription('exposed', damageType);
                                  statDisplay.class = 'exposed';
                                } else if (percentage === 200) {
                                  statDisplay.value = getThematicResistanceDescription('vulnerable', damageType);
                                  statDisplay.class = 'vulnerable';
                                } else {
                                  // Fallback to percentage display
                                  const sign = percentage >= 0 ? '+' : '';
                                  statDisplay.value = `${sign}${percentage}% resistance`;
                                  statDisplay.class = 'percentage';
                                }
                              } else {
                                // Standard number or percentage display
                                const magnitude = stat.magnitude || 0;
                                const sign = magnitude >= 0 ? '+' : '';
                                const displayValue = stat.magnitudeType === 'percentage'
                                  ? `${sign}${magnitude}%`
                                  : `${sign}${magnitude}`;
                                statDisplay.value = `${displayValue} penalty`;
                                statDisplay.class = 'regular';
                              }

                              // Group stats by type
                              if (isResistanceStat) {
                                resistanceStats.push(statDisplay);
                              } else if (isAbsorptionStat) {
                                absorptionStats.push(statDisplay);
                              } else {
                                regularStats.push(statDisplay);
                              }
                            });

                            // Add grouped stat effects
                            if (regularStats.length > 0) {
                              effects.push({
                                name: 'Stat Penalties',
                                description: '',
                                mechanicsText: '',
                                type: 'stats',
                                data: regularStats
                              });
                            }

                            if (resistanceStats.length > 0) {
                              effects.push({
                                name: 'Resistance Penalties',
                                description: '',
                                mechanicsText: '',
                                type: 'resistance',
                                data: resistanceStats
                              });
                            }

                            if (absorptionStats.length > 0) {
                              effects.push({
                                name: 'Absorption Penalties',
                                description: '',
                                mechanicsText: '',
                                type: 'absorption',
                                data: absorptionStats
                              });
                            }
                          }

                          // Format status effects
                          if (debuffConfig?.statusEffects && debuffConfig.statusEffects.length > 0) {
                            debuffConfig.statusEffects.forEach(effect => {
                              let effectName = effect.name || effect.id || 'Status Effect';
                              effectName = effectName.charAt(0).toUpperCase() + effectName.slice(1);

                              let description = effect.description || '';
                              let mechanicsText = '';

                              // Add level information
                              if (effect.level && effect.level !== 'moderate') {
                                const levelMap = {
                                  'minor': 'Minor',
                                  'major': 'Major',
                                  'severe': 'Severe',
                                  'extreme': 'Extreme'
                                };
                                const levelDisplay = levelMap[effect.level] || effect.level;
                                effectName = `${levelDisplay} ${effectName}`;
                              }

                              // Build mechanics text with save information and other details
                              const mechanicsParts = [];

                              // Add save information if applicable
                              if (effect.saveType && effect.saveType !== 'none') {
                                let saveText = `${effect.saveType.charAt(0).toUpperCase() + effect.saveType.slice(1)} save`;
                                if (effect.saveDC) {
                                  saveText += ` DC ${effect.saveDC}`;
                                }
                                mechanicsParts.push(saveText);
                              }

                              // Add duration if specified
                              if (effect.duration && effect.duration !== 'default') {
                                mechanicsParts.push(`${effect.duration} duration`);
                              }

                              // Add stacking information if applicable
                              if (effect.stacks) {
                                mechanicsParts.push(`Stacks up to ${effect.stacks}`);
                              }

                              mechanicsText = mechanicsParts.join(', ');

                              effects.push({
                                name: effectName,
                                description: description,
                                mechanicsText: mechanicsText
                              });
                            });
                          }

                          return effects.length > 0 ? (
                            <div className="debuff-formula-line">
                              <div className="debuff-effects-list">
                                {effects.map((effect, index) => {
                                  if (effect.type === 'stats' || effect.type === 'resistance' || effect.type === 'absorption') {
                                    return (
                                      <div key={`debuff-${index}`} className="debuff-effect-item">
                                        <div className="debuff-effect">
                                          <span className="debuff-effect-name">{effect.name}</span>
                                        </div>
                                        <div className="debuff-effect-details">
                                          <div className="debuff-effect-mechanics">
                                            {effect.data.map((stat, statIndex) => (
                                              <span key={`stat-${statIndex}`} className="debuff-stat-text">
                                                {stat.name}: {stat.value}
                                              </span>
                                            )).reduce((prev, curr, index) => index === 0 ? [curr] : [...prev, ', ', curr], [])}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div key={`debuff-${index}`} className="debuff-effect-item">
                                        <div className="debuff-effect">
                                          <span className="debuff-effect-name">{effect.name}</span>
                                          {effect.description && effect.description !== effect.name && (
                                            <span className="debuff-effect-description"> - {effect.description}</span>
                                          )}
                                        </div>
                                        {effect.mechanicsText && (
                                          <div className="debuff-effect-details">
                                            <div className="debuff-effect-mechanics">{effect.mechanicsText}</div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="debuff-formula-line">
                              <span className="debuff-formula-value">Configure debuff effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Utility Effects Section */}
              {(() => {
                const hasUtilityType = spell?.effectTypes?.includes('utility');
                const hasUtilityConfig = spell?.utilityConfig;
                const hasSelectedEffects = spell?.utilityConfig?.selectedEffects?.length > 0;
                const hasAnyUtilityConfiguration = hasUtilityConfig && (
                  hasSelectedEffects ||
                  spell.utilityConfig.duration ||
                  spell.utilityConfig.utilityType
                );

                return (hasUtilityType || hasAnyUtilityConfiguration) && (
                  <div className="unified-spell-stat utility-effects">
                    <div className="utility-effects-section">
                      <div className="utility-header">
                        <span className="utility-label">UTILITY</span>
                        <span className="utility-type">
                          {spell.utilityConfig?.utilityType ?
                            spell.utilityConfig.utilityType.charAt(0).toUpperCase() + spell.utilityConfig.utilityType.slice(1) :
                            'Movement'}
                        </span>
                        {(() => {
                          const duration = spell.utilityConfig?.duration;
                          const durationUnit = spell.utilityConfig?.durationUnit || 'minutes';
                          let durationText = '';

                          if (duration && duration > 0) {
                            durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;
                          }

                          // Add concentration if required
                          if (durationText && spell?.utilityConfig?.concentration) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return durationText && (
                            <span className="utility-duration">{durationText}</span>
                          );
                        })()}
                      </div>
                      <div className="utility-separator"></div>
                      <div className="utility-formula-container">
                        {(() => {
                          const effects = [];
                          const { utilityConfig } = spell;

                          // Format selected utility effects
                          if (utilityConfig?.selectedEffects && utilityConfig.selectedEffects.length > 0) {
                            utilityConfig.selectedEffects.forEach(effect => {
                              const effectName = effect.customName || effect.name || 'Utility Effect';
                              let description = effect.description || '';
                              let mechanicsText = '';

                              // Use custom description if available
                              if (effect.customDescription && effect.customDescription.trim() !== '') {
                                description = effect.customDescription;
                              }

                              // Add potency information if available
                              if (effect.potency && effect.potency !== 'moderate') {
                                const potencyMap = {
                                  'minor': 'Minor',
                                  'major': 'Major',
                                  'extreme': 'Extreme',
                                  'legendary': 'Legendary'
                                };
                                const potencyDisplay = potencyMap[effect.potency] || effect.potency;
                                mechanicsText = `${potencyDisplay} effect`;
                              }

                              effects.push({
                                name: effectName,
                                description: description,
                                mechanicsText: mechanicsText
                              });
                            });
                          }

                          return effects.length > 0 ? (
                            <div className="utility-formula-line">
                              <div className="utility-effects-list">
                                {effects.map((effect, index) => (
                                  <div key={`utility-${index}`} className="utility-effect-item">
                                    <div className="utility-effect">
                                      <span className="utility-effect-name">{effect.name}</span>
                                      {effect.description && effect.description !== effect.name && (
                                        <span className="utility-effect-description"> - {effect.description}</span>
                                      )}
                                    </div>
                                    {effect.mechanicsText && (
                                      <div className="utility-effect-details">
                                        <div className="utility-effect-mechanics">{effect.mechanicsText}</div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="utility-formula-line">
                              <span className="utility-formula-value">Configure utility effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Control Effects Section */}
              {(() => {
                const hasControlType = spell?.effectTypes?.includes('control');
                const hasControlConfig = spell?.controlConfig;
                const hasSelectedEffects = spell?.controlConfig?.effects?.length > 0;
                const hasAnyControlConfiguration = hasControlConfig && (
                  spell.controlConfig.duration !== null ||
                  spell.controlConfig.durationUnit !== 'rounds' ||
                  spell.controlConfig.savingThrow !== null ||
                  spell.controlConfig.savingThrowType !== 'strength' ||
                  spell.controlConfig.difficultyClass !== 15 ||
                  spell.controlConfig.concentration ||
                  spell.controlConfig.controlType ||
                  hasSelectedEffects
                );

                return (hasControlType || hasAnyControlConfiguration) && (
                  <div className="unified-spell-stat control-effects">
                    <div className="control-effects-section">
                      <div className="control-header">
                        <span className="control-label">Control</span>
                        {(() => {
                          // Check if instant effect is enabled
                          if (spell.controlConfig?.instant) {
                            return <span className="control-duration">Instant</span>;
                          }

                          const duration = spell.controlConfig?.duration;
                          const durationUnit = spell.controlConfig?.durationUnit || 'rounds';
                          let durationText = '';

                          if (duration && duration > 0) {
                            durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;
                          }

                          // Add concentration if required
                          if (durationText && spell?.controlConfig?.concentration) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return durationText && (
                            <span className="control-duration">{durationText}</span>
                          );
                        })()}
                      </div>
                      <div className="control-formula-container">
                        {(() => {
                          const effects = [];
                          const { controlConfig } = spell;

                          if (controlConfig.effects && Array.isArray(controlConfig.effects)) {
                            controlConfig.effects.forEach(effect => {
                              if (effect && effect.name) {
                                // Use custom name if available, otherwise use the effect name
                                const effectName = effect.config?.customName || effect.name;
                                const effectDescription = effect.config?.customDescription || effect.description;

                                // Build thematic flavor text for the effect
                                let flavorText = '';
                                let mechanicsText = '';

                                if (effect.controlType === 'forced_movement') {
                                  const distance = effect.config?.distance || 10;
                                  const movementType = effect.config?.movementType || 'push';
                                  const movementFlavor = effect.config?.movementFlavor || 'force';

                                  // Build a coherent sentence combining flavor and mechanics
                                  if (movementFlavor !== 'force') {
                                    const flavorMap = {
                                      'wind': 'Powerful winds carry the target',
                                      'gravity': 'Gravitational forces pull the target',
                                      'telekinetic': 'Invisible telekinetic force moves the target',
                                      'spectral': 'Spectral hands grasp and move the target'
                                    };
                                    const baseFlavorText = flavorMap[movementFlavor] || 'Magical force moves the target';

                                    // Add distance and direction to create a fluid sentence
                                    const directionMap = {
                                      'push': 'away from the caster',
                                      'pull': 'toward the caster',
                                      'slide': 'in any direction',
                                      'teleport': 'to a new location'
                                    };
                                    const direction = directionMap[movementType] || 'away from the caster';

                                    flavorText = `${baseFlavorText} ${distance} feet ${direction}`;
                                  } else {
                                    // Default magical force text
                                    const directionMap = {
                                      'push': 'away from the caster',
                                      'pull': 'toward the caster',
                                      'slide': 'in any direction',
                                      'teleport': 'to a new location'
                                    };
                                    const direction = directionMap[movementType] || 'away from the caster';
                                    flavorText = `Magical force moves the target ${distance} feet ${direction}`;
                                  }
                                } else if (effect.controlType === 'battlefield_control') {
                                  if (effect.config?.areaSize) {
                                    mechanicsText = `${effect.config.areaSize} foot`;
                                    if (effect.config?.areaShape && effect.config.areaShape !== 'circle') {
                                      const shapeMap = {
                                        'square': 'square area',
                                        'line': 'line',
                                        'cone': 'cone'
                                      };
                                      mechanicsText += ` ${shapeMap[effect.config.areaShape] || 'area'}`;
                                    } else {
                                      mechanicsText += ' radius';
                                    }
                                  }
                                } else if (effect.controlType === 'mental_control') {
                                  if (effect.config?.controlLevel) {
                                    const levelMap = {
                                      'suggestion': 'Plants a suggestion in the target\'s mind',
                                      'compulsion': 'Compels the target to act',
                                      'domination': 'Dominates the target\'s will',
                                      'possession': 'Possesses the target\'s body'
                                    };
                                    mechanicsText = levelMap[effect.config.controlLevel] || '';
                                  }

                                  if (effect.config?.mentalApproach && effect.config.mentalApproach !== 'subtle') {
                                    const approachMap = {
                                      'overwhelming': 'with overwhelming mental pressure',
                                      'seductive': 'through seductive whispers',
                                      'terrifying': 'using terrifying mental commands'
                                    };
                                    flavorText = approachMap[effect.config.mentalApproach] || '';
                                  }
                                } else if (effect.controlType === 'restraint') {
                                  if (effect.config?.restraintType && effect.config.restraintType !== 'physical') {
                                    const restraintTypeMap = {
                                      'magical': 'Magical bonds hold the target in place',
                                      'environmental': 'Environmental forces restrain the target',
                                      'paralysis': 'Paralyzing energy freezes the target'
                                    };
                                    flavorText = restraintTypeMap[effect.config.restraintType] || '';
                                  }
                                  // Note: DC is handled by main control configuration, not individual effects
                                } else if (effect.controlType === 'incapacitation') {
                                  if (effect.config?.durationType && effect.config.durationType !== 'temporary') {
                                    const durationTypeMap = {
                                      'instant': 'Effect occurs instantly',
                                      'concentration': 'Requires caster\'s concentration',
                                      'permanent': 'Effect lasts until dispelled'
                                    };
                                    mechanicsText = durationTypeMap[effect.config.durationType] || '';
                                  }
                                  if (effect.config?.recoveryMethod && effect.config.recoveryMethod !== 'automatic') {
                                    const recoveryMap = {
                                      'save_each_turn': 'Target may save each turn to recover',
                                      'damage_breaks': 'Taking damage breaks the effect',
                                      'action_required': 'Requires an action to break free'
                                    };
                                    if (mechanicsText) {
                                      mechanicsText += '; ' + (recoveryMap[effect.config.recoveryMethod] || '');
                                    } else {
                                      mechanicsText = recoveryMap[effect.config.recoveryMethod] || '';
                                    }
                                  }
                                }

                                effects.push({
                                  name: effectName,
                                  description: effectDescription,
                                  flavorText: flavorText,
                                  mechanicsText: mechanicsText,
                                  instant: spell.controlConfig?.instant || false, // Check main control config for instant
                                  strength: effect.config?.strength || 'moderate'
                                });
                              }
                            });
                          }

                          return effects.length > 0 ? (
                            <div className="control-formula-line">
                              <div className="control-effects-list">
                                {effects.map((effect, index) => (
                                  <div key={`control-${index}`} className="control-effect-item">
                                    <div className="control-effect">
                                      <span className="control-effect-name">{effect.name}</span>
                                      {effect.description && effect.description !== effect.name && (
                                        <span className="control-effect-description"> - {effect.description}</span>
                                      )}
                                    </div>
                                    {(effect.flavorText || effect.mechanicsText) && (
                                      <div className="control-effect-details">
                                        {effect.flavorText && (
                                          <div className="control-effect-flavor">{effect.flavorText}</div>
                                        )}
                                        {effect.mechanicsText && !effect.flavorText && (
                                          <div className="control-effect-mechanics">{effect.mechanicsText}</div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="control-formula-line">
                              <span className="control-formula-value">Configure control effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>


                      {/* Properties section (saving throws, etc.) - Show whenever control config has these properties */}
                      {(() => {
                        console.log('Spell card control config:', spell.controlConfig);
                        console.log('Saving throw value:', spell.controlConfig?.savingThrow);
                        console.log('Saving throw type:', spell.controlConfig?.savingThrowType);
                        return (spell.controlConfig?.difficultyClass || spell.controlConfig?.savingThrow !== null);
                      })() && (
                        <div className="control-properties">
                          {spell.controlConfig?.savingThrow !== null && (
                            <span className="control-property">
                              <span className="control-property-text">
                                {(() => {
                                  const abilityMap = {
                                    'strength': 'STR',
                                    'agility': 'AGI',
                                    'constitution': 'CON',
                                    'intelligence': 'INT',
                                    'spirit': 'SPI',
                                    'charisma': 'CHA'
                                  };
                                  // Always use savingThrowType for display (this is what gets updated by the dropdown)
                                  const saveType = spell.controlConfig.savingThrowType || 'strength';
                                  return abilityMap[saveType] || saveType.toUpperCase();
                                })()} save
                              </span>
                            </span>
                          )}
                          {spell.controlConfig?.difficultyClass && (
                            <span className="control-property">
                              <span className="control-property-text">DC {spell.controlConfig.difficultyClass}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Summoning Effects Section */}
              {(() => {
                const hasSummoningType = spell?.effectTypes?.includes('summoning');
                // Check both summoningConfig (library format) and summonConfig (wizard format)
                const summoningData = spell?.summoningConfig || spell?.summonConfig;
                const hasSummoningConfig = !!summoningData;
                const hasSelectedCreatures = summoningData?.creatures?.length > 0;
                const hasAnySummoningConfiguration = hasSummoningConfig && (
                  summoningData.duration !== null ||
                  summoningData.durationUnit !== 'minutes' ||
                  summoningData.concentration ||
                  summoningData.controlType ||
                  summoningData.quantity > 1 ||
                  hasSelectedCreatures
                );



                return (hasSummoningType || hasAnySummoningConfiguration) && (
                  <div className="unified-spell-stat summoning-effects">
                    <div className="summoning-effects-section">
                      <div className="summoning-header">
                        <span className="summoning-label">Summoning</span>
                        {(() => {
                          const creatures = summoningData?.creatures || [];

                          // If no creatures, show global settings
                          if (creatures.length === 0) {
                            if (!summoningData?.hasDuration) {
                              return <span className="summoning-duration">Permanent</span>;
                            }
                            const duration = summoningData?.duration || 10;
                            const durationUnit = summoningData?.durationUnit || 'minutes';
                            let durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;
                            if (summoningData?.concentration) {
                              durationText = `${durationText} (Concentration)`;
                            }
                            return <span className="summoning-duration">{durationText}</span>;
                          }

                          // For multiple creatures, just show a generic label
                          return <span className="summoning-duration">Multiple Creatures</span>;
                        })()}
                      </div>
                      <div className="summoning-content">
                        {(() => {
                          const creatures = summoningData?.creatures || [];

                          if (creatures.length === 0) {
                            return (
                              <div className="summoning-placeholder">
                                <span className="summoning-placeholder-text">No creatures selected</span>
                              </div>
                            );
                          }

                          return (
                            <div className="summoning-creatures-list">
                              {creatures.map((creature, index) => (
                                <div key={`summon-${index}`} className="summoning-creature-item">
                                  <div className="summoning-creature-header">
                                    <div className="summoning-creature-icon">
                                      <img
                                        src={`https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon || 'inv_misc_questionmark'}.jpg`}
                                        alt={creature.name}
                                        onError={(e) => {
                                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                        }}
                                      />
                                    </div>
                                    <div className="summoning-creature-info">
                                      <div className="summoning-creature-name">{creature.name}</div>
                                      <div className="summoning-creature-type">
                                        {creature.size} {creature.type}
                                        {creature.config?.quantity > 1 && (
                                          <span className="summoning-quantity"> × {creature.config.quantity}</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="summoning-creature-meta">
                                      {(() => {
                                        const controlType = creature.config?.controlType || summoningData?.controlType;
                                        const controlRange = creature.config?.controlRange !== undefined
                                          ? creature.config.controlRange
                                          : summoningData?.controlRange;

                                        const formatControlType = (type) => {
                                          const typeMap = {
                                            'verbal': 'Verbal',
                                            'mental': 'Mental',
                                            'empathic': 'Empathic',
                                            'autonomous': 'Autonomous'
                                          };
                                          return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
                                        };

                                        const formatControlRange = (range) => {
                                          if (range === 0) return 'Unlimited';
                                          return `${range} ft`;
                                        };

                                        const formatDuration = () => {
                                          const config = creature.config;
                                          if (!config?.hasDuration) return 'Permanent';

                                          const duration = config?.duration || 10;
                                          const durationUnit = config?.durationUnit || 'minutes';
                                          let durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;

                                          if (config?.concentration) {
                                            durationText = `${durationText} (C)`;
                                          }

                                          return durationText;
                                        };

                                        return (
                                          <div className="summoning-creature-control-info">
                                            {controlType && (
                                              <div className="creature-control-line">
                                                {formatControlType(controlType)}
                                                {controlRange !== undefined && (
                                                  <span> ({formatControlRange(controlRange)})</span>
                                                )}
                                              </div>
                                            )}
                                            <div className="creature-duration-line">
                                              {formatDuration()}
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                  <div className="summoning-creature-stats">
                                    <div className="summoning-stat-group">
                                      <span className="summoning-stat-label">HP:</span>
                                      <span className="summoning-stat-value">{creature.stats?.maxHp || creature.stats?.hp || 'Unknown'}</span>
                                    </div>
                                    <div className="summoning-stat-group">
                                      <span className="summoning-stat-label">AC:</span>
                                      <span className="summoning-stat-value">{creature.stats?.armorClass || creature.stats?.armor || 'Unknown'}</span>
                                    </div>
                                    <div className="summoning-stat-group">
                                      <span className="summoning-stat-label">Speed:</span>
                                      <span className="summoning-stat-value">{creature.stats?.speed || '30'} ft</span>
                                    </div>
                                  </div>
                                  {creature.description && (
                                    <div className="summoning-creature-description">
                                      {creature.description.length > 100
                                        ? `${creature.description.substring(0, 100)}...`
                                        : creature.description}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })()}


                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Transformation Effects Section */}
              {(() => {
                const hasTransformationType = spell?.effectTypes?.includes('transformation');
                // Check both transformationConfig (library format) and transformConfig (wizard format)
                const transformationData = spell?.transformationConfig || spell?.transformConfig;
                const hasTransformationConfig = !!transformationData;
                const hasSelectedCreature = transformationData?.selectedCreature || transformationData?.formId;

                // Show transformation effects if transformation type is selected OR if there's transformation config
                return (hasTransformationType || hasTransformationConfig) && (
                  <div className="unified-spell-stat transformation-effects">
                    <div className="transformation-effects-section">
                      <div className="transformation-header">
                        <span className="transformation-label">Transformation</span>
                        {(() => {
                          const creature = transformationData?.selectedCreature;
                          const targetType = transformationData?.targetType || 'self';
                          const duration = transformationData?.duration || 10;
                          const durationUnit = transformationData?.durationUnit || 'minutes';

                          // Format target type for display
                          const targetText = targetType === 'self' ? 'Self' :
                                           targetType === 'willing' ? 'Willing Target' :
                                           'Unwilling Target';

                          // Format duration
                          let durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;
                          if (transformationData?.concentration) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return (
                            <div className="transformation-meta">
                              <span className="transformation-target">{targetText}</span>
                              <span className="transformation-duration">{durationText}</span>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="transformation-content">
                        {(() => {
                          const creature = transformationData?.selectedCreature;

                          if (!creature) {
                            return (
                              <div className="transformation-placeholder">
                                <span className="transformation-placeholder-text">No transformation target selected</span>
                              </div>
                            );
                          }

                          return (
                            <div className="transformation-creature-item">
                              <div className="transformation-creature-header">
                                <div className="transformation-creature-icon">
                                  <img
                                    src={`https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon || 'inv_misc_questionmark'}.jpg`}
                                    alt={creature.name}
                                    onError={(e) => {
                                      e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                    }}
                                  />
                                </div>
                                <div className="transformation-creature-info">
                                  <div className="transformation-creature-name">{creature.name}</div>
                                  <div className="transformation-creature-type">
                                    {creature.size} {creature.type}
                                  </div>
                                </div>
                                <div className="transformation-creature-meta">
                                  {(() => {
                                    const targetType = transformationData?.targetType || 'self';
                                    const saveType = transformationData?.saveType;
                                    const difficultyClass = transformationData?.difficultyClass || 15;

                                    if (targetType === 'unwilling' && saveType) {
                                      // Map save type abbreviations to full names
                                      const saveTypeMap = {
                                        'con': 'Constitution',
                                        'str': 'Strength',
                                        'agi': 'Agility',
                                        'int': 'Intelligence',
                                        'spirit': 'Spirit',
                                        'cha': 'Charisma'
                                      };
                                      const saveTypeText = saveTypeMap[saveType] || saveType.charAt(0).toUpperCase() + saveType.slice(1);
                                      return (
                                        <div className="transformation-save-info">
                                          <span className="transformation-save-type">DC {difficultyClass} {saveTypeText}</span>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                              </div>
                              <div className="transformation-creature-stats">
                                <div className="transformation-stat-group">
                                  <span className="transformation-stat-label">HP:</span>
                                  <span className="transformation-stat-value">{creature.stats?.maxHp || creature.stats?.hp || 'Unknown'}</span>
                                </div>
                                <div className="transformation-stat-group">
                                  <span className="transformation-stat-label">AC:</span>
                                  <span className="transformation-stat-value">{creature.stats?.armorClass || creature.stats?.armor || 'Unknown'}</span>
                                </div>
                                <div className="transformation-stat-group">
                                  <span className="transformation-stat-label">Speed:</span>
                                  <span className="transformation-stat-value">{creature.stats?.speed || '30'} ft</span>
                                </div>
                              </div>
                              {creature.description && (
                                <div className="transformation-creature-description">
                                  {creature.description.length > 100
                                    ? `${creature.description.substring(0, 100)}...`
                                    : creature.description}
                                </div>
                              )}
                              {/* Granted Abilities */}
                              {transformationData?.grantedAbilities?.length > 0 && (
                                <div className="transformation-abilities">
                                  <div className="transformation-abilities-label">Granted Abilities:</div>
                                  <div className="transformation-abilities-list">
                                    {transformationData.grantedAbilities.map((ability, index) => (
                                      <span key={index} className="transformation-ability">
                                        {ability.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Purification Effects Section */}
              {(() => {
                const hasPurificationType = spell?.effectTypes?.includes('purification');
                const purificationData = spell?.purificationConfig;
                const hasPurificationConfig = !!purificationData;
                const hasSelectedEffects = purificationData?.selectedEffects?.length > 0;
                const hasAnyPurificationConfiguration = hasPurificationConfig && (
                  purificationData.purificationType ||
                  purificationData.resolution ||
                  purificationData.resurrectionFormula ||
                  hasSelectedEffects
                );



                return (hasPurificationType || hasAnyPurificationConfiguration) && (
                  <div className="unified-spell-stat purification-effects">
                    <div className="purification-effects-section">
                      <div className="purification-header">
                        <span className="purification-label">
                          {purificationData?.purificationType === 'resurrection' ? 'Resurrection' : 'Purification'}
                        </span>
                        <span className="purification-type">
                          {purificationData?.purificationType === 'dispel' ? 'Dispel' :
                           purificationData?.purificationType === 'resurrection' ? 'Revival' : 'Cleanse'}
                        </span>
                      </div>
                      <div className="purification-formula-container">
                        {(() => {
                          const purificationEffects = formatPurificationEffects();

                          return purificationEffects && purificationEffects.length > 0 ? (
                            <div className="purification-formula-line">
                              <div className="purification-effects-list">
                                {purificationEffects.map((effect, index) => (
                                  <div key={`purification-${index}`} className="purification-effect-item">
                                    <div className="purification-effect">
                                      <span className="purification-effect-name">{effect.name}</span>
                                      {effect.description && effect.description !== effect.name && (
                                        <span className="purification-effect-description"> - {effect.description}</span>
                                      )}
                                    </div>
                                    {effect.mechanicsText && (
                                      <div className="purification-effect-details">
                                        <div className="purification-effect-mechanics">{effect.mechanicsText}</div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="purification-formula-line">
                              <span className="purification-formula-value">Configure purification effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Restoration Effects */}
              {(() => {
                const restorationData = spell?.restorationConfig;
                const hasRestorationConfig = !!restorationData;
                const hasResourceType = restorationData?.resourceType;
                const hasFormula = restorationData?.formula;
                const hasOverTime = restorationData?.isOverTime;

                // Show restoration effects if there's any restoration configuration
                return (hasRestorationConfig && (hasResourceType || hasFormula)) && (
                  <div className="unified-spell-stat restoration-effects">
                    <div className="restoration-effects-section">
                      <div className="restoration-header">
                        <span className="restoration-label">RESTORATION</span>
                        <span className="restoration-type">
                          {restorationData?.resourceType ?
                            formatResourceName(restorationData.resourceType) :
                            'Resource'}
                        </span>
                      </div>
                      <div className="restoration-separator"></div>
                      <div className="restoration-formula-container">
                        {(() => {
                          const effects = [];

                          // Main restoration effect (only if instant restoration is enabled)
                          const hasInstantRestoration = restorationData.duration === 'instant' || !restorationData.duration;
                          if (hasFormula && hasInstantRestoration) {
                            const formula = restorationData.formula;
                            const resolution = restorationData.resolution || 'DICE';

                            let resolutionText = '';
                            switch (resolution) {
                              case 'CARDS':
                                resolutionText = 'Draw cards';
                                break;
                              case 'COINS':
                                resolutionText = 'Flip coins';
                                break;
                              case 'DICE':
                              default:
                                resolutionText = 'Roll dice';
                                break;
                            }

                            const instantEffect = {
                              name: 'Instant Restoration',
                              description: resolutionText,
                              mechanicsText: `${cleanFormula(formula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored`
                            };
                            effects.push(instantEffect);
                          }

                          // Check if custom formula per stage is enabled (this can work independently)
                          const hasCustomFormula = restorationData.isProgressiveOverTime;

                          // Over time restoration effect OR progressive stages
                          if ((hasOverTime && restorationData.overTimeFormula) || hasCustomFormula) {
                            const overTimeFormula = restorationData.overTimeFormula;
                            const duration = restorationData.overTimeDuration || 3;
                            const frequency = restorationData.tickFrequency || 'round';

                            // Build description based on application timing and trigger type
                            let description = '';
                            let mechanicsText = `${cleanFormula(overTimeFormula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored`;

                            // Show application timing and trigger type details
                            const applicationTiming = restorationData.tickFrequency || 'round'; // 'round' or 'turn'
                            const triggerType = restorationData.application || 'start'; // 'start' or 'end'
                            const overTimeTriggerType = restorationData.overTimeTriggerType || 'periodic'; // 'periodic' or 'trigger'

                            // Format application timing
                            let timingText = '';
                            if (overTimeTriggerType === 'periodic') {
                              if (applicationTiming === 'round') {
                                timingText = triggerType === 'start' ? 'Start of Round' : 'End of Round';
                              } else if (applicationTiming === 'turn') {
                                timingText = triggerType === 'start' ? 'Start of Turn' : 'End of Turn';
                              }
                            } else if (overTimeTriggerType === 'trigger') {
                              timingText = 'Trigger-Based';
                            }

                            // Always show the main restoration over time effect first
                            if (overTimeTriggerType === 'periodic') {
                              description = `${timingText} for ${duration} ${frequency}s`;
                            } else if (overTimeTriggerType === 'trigger') {
                              description = `Trigger-Based for ${duration} ${frequency}s`;
                            } else {
                              description = `Every ${frequency} for ${duration} ${frequency}s`;
                            }

                            // Show main restoration over time effect
                            const mainEffectName = hasCustomFormula ? 'Restoration Over Time (Progressive)' : 'Restoration Over Time';
                            const mainMechanicsText = hasCustomFormula ?
                              `${cleanFormula(overTimeFormula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored (see stages below)` :
                              `${cleanFormula(overTimeFormula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored`;

                            effects.push({
                              name: mainEffectName,
                              description: description,
                              mechanicsText: mainMechanicsText
                            });

                            // If custom formula is enabled, also show individual stages
                            if (hasCustomFormula && restorationData.overTimeProgressiveStages?.length > 0) {
                              // Show detailed stage info
                              const stages = restorationData.overTimeProgressiveStages;

                              // Create separate effect entries for each stage
                              stages.forEach((stage, index) => {
                                const stageNumber = stage.triggerAt || (index + 1);
                                const stageFormula = stage.formula || overTimeFormula || '1d4 + INT/2';
                                const stageDescription = stage.description || '';

                                let stageName = `  └ Stage ${stageNumber} (${frequency} ${stageNumber})`;
                                let stageDesc = `${timingText}`;

                                if (stageDescription) {
                                  stageDesc += ` - ${stageDescription}`;
                                }

                                const effectToAdd = {
                                  name: stageName,
                                  description: stageDesc,
                                  mechanicsText: `${cleanFormula(stageFormula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored`,
                                  isStage: true // Flag to identify stage effects for special styling
                                };

                                effects.push(effectToAdd);
                              });
                            } else if (hasCustomFormula) {
                              // Progressive is enabled but no stages configured yet - show placeholder
                              effects.push({
                                name: `  └ Configure Stages`,
                                description: `Add stages in the spellcrafting wizard`,
                                mechanicsText: `Custom formulas per stage`,
                                isStage: true
                              });
                            }
                          }

                          return effects.length > 0 ? (
                            <div className="restoration-formula-line">
                              <div className="restoration-effects-list">
                                {effects.map((effect, index) => (
                                    <div key={`restoration-${index}`} className="restoration-effect-item">
                                      <div className="restoration-effect">
                                        <span className={effect.isStage ? "restoration-stage-name" : "restoration-effect-name"}>
                                          {effect.name}
                                        </span>
                                        {effect.description && effect.description !== effect.name && (
                                          <span className={effect.isStage ? "restoration-stage-description" : "restoration-effect-description"}>
                                            {" - "}{effect.description}
                                          </span>
                                        )}
                                      </div>
                                      {effect.mechanicsText && (
                                        <div className="restoration-effect-details">
                                          <div className={effect.isStage ? "restoration-stage-mechanics" : "restoration-effect-mechanics"}>
                                            {effect.mechanicsText}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="restoration-formula-line">
                              <span className="restoration-formula-value">Configure restoration effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
          )}
        </div>
      )}

      {/* Tags (at bottom of card) */}
      {(() => {
        const tags = getSpellTags();
        const shouldShowTags = (variant === 'spellbook' || variant === 'wizard') && showTags;

        return shouldShowTags && tags.length > 0 && (
          <div className="unified-spell-tags">
            {tags.map((tag, index) => (
              <span key={index} className="unified-spell-tag">
                {tag}
              </span>
            ))}
          </div>
        );
      })()}

      {/* Card Actions */}
      {showActions && (
        <div className="unified-spell-card-actions">
          {onDuplicate && (
            <button
              className="spell-action-button duplicate-button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(spell);
              }}
              title="Duplicate spell"
            >
              <i className="fas fa-copy"></i>
            </button>
          )}
          {onEdit && (
            <button
              className="spell-action-button edit-button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(spell);
              }}
              title="Edit spell"
            >
              <i className="fas fa-edit"></i>
            </button>
          )}
          {onDelete && (
            <button
              className="spell-action-button delete-button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(spell);
              }}
              title="Delete spell"
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );

  // Return the unified spell card
  return renderSpellCard();
};

UnifiedSpellCard.propTypes = {
  spell: PropTypes.object.isRequired,
  variant: PropTypes.oneOf(['spellbook', 'library', 'collection', 'wizard', 'compact', 'preview']),
  showActions: PropTypes.bool,
  showDescription: PropTypes.bool,
  showStats: PropTypes.bool,
  showTags: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  onSelect: PropTypes.func,
  onClick: PropTypes.func,
  onContextMenu: PropTypes.func,
  isSelected: PropTypes.bool,
  isDraggable: PropTypes.bool,
  className: PropTypes.string,
  rollableTableData: PropTypes.object,
  categories: PropTypes.array
};



export default UnifiedSpellCard;
