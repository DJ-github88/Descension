/**
 * Spell Balance Calculator Module
 * 
 * A comprehensive system for evaluating and balancing spell power,
 * providing metrics, comparisons, and recommendations for adjustments.
 * 
 * This module integrates with all other spell systems to provide
 * complete balance calculations for all spell types.
 */

import { 
  DAMAGE_TYPES, 
  EFFECT_TYPES,
  TARGETING_TYPES,
  DURATION_TYPES,
  COMBAT_STAT_MODIFIERS,
  POSITIVE_STATUS_EFFECTS,
  NEGATIVE_STATUS_EFFECTS,
  UTILITY_EFFECT_TYPES,
  AOE_SHAPES,
  CRITICAL_EFFECT_MODIFIERS,
  ABSORPTION_SHIELD_TYPES,
  REFLECTION_DAMAGE_TYPES,
  getAverageRoll
} from '../../data/enhancedEffectSystemData';

// =======================================================================
// SPELL POWER METRICS
// =======================================================================

/**
 * Metrics for evaluating damage spells
 */
export const DAMAGE_METRICS = {
  dps: {
    id: 'dps',
    name: 'DPS',
    description: 'Damage Per Second',
    weight: 1.0,
    targetBaseline: (level) => level * 1.5,
    calculate: (spell, context) => {
      // Get base damage
      const damageTotal = getSpellDamage(spell);
      
      // Calculate cooldown in seconds
      const cooldownTime = getCooldownTimeInSeconds(spell);
      
      // Calculate DPS
      return damageTotal / cooldownTime;
    }
  },
  
  burstDamage: {
    id: 'burstDamage',
    name: 'Burst Damage',
    description: 'Maximum damage in a short time window',
    weight: 0.8,
    targetBaseline: (level) => level * 3,
    calculate: (spell, context) => {
      // Get base damage
      const damageTotal = getSpellDamage(spell);
      
      // Account for critical chance and multiplier
      const criticalChance = spell.criticalChance || context.defaultCritChance || 0.05;
      const criticalMultiplier = spell.criticalMultiplier || context.defaultCritMultiplier || 2.0;
      
      // Calculate average damage with crits
      const avgDamage = damageTotal * (1 + (criticalChance * (criticalMultiplier - 1)));
      
      // For burst, we also consider the cast time
      const castTime = spell.castTime || 0;
      if (castTime > 2) {
        // Penalize long cast times for burst metric
        return avgDamage * (1 - (castTime - 2) * 0.1);
      }
      
      return avgDamage;
    }
  },
  
  sustainedDamage: {
    id: 'sustainedDamage',
    name: 'Sustained Damage',
    description: 'Damage output over prolonged combat',
    weight: 0.7,
    targetBaseline: (level) => level * 10,
    calculate: (spell, context) => {
      // Get base damage per cast
      const damageTotal = getSpellDamage(spell);
      
      // Calculate cooldown in seconds
      const cooldownTime = getCooldownTimeInSeconds(spell);
      
      // Calculate resource efficiency
      const resourceCost = getSpellResourceCost(spell);
      const resourcePerSec = resourceCost / cooldownTime;
      
      // Standard combat duration (30 seconds)
      const combatDuration = context.combatDuration || 30;
      
      // Calculate how many times the spell can be cast
      let totalCasts = Math.floor(combatDuration / cooldownTime);
      
      // Adjust for resource constraints
      const availableResource = context.availableResource || (resourceCost * totalCasts);
      totalCasts = Math.min(totalCasts, Math.floor(availableResource / resourceCost));
      
      // Calculate total damage
      return damageTotal * totalCasts;
    }
  },
  
  areaEfficiency: {
    id: 'areaEfficiency',
    name: 'Area Efficiency',
    description: 'Efficiency of damage across multiple targets',
    weight: 0.6,
    targetBaseline: (level) => level * 2,
    calculate: (spell, context) => {
      // If not an area spell, return 0
      if (!isAreaEffect(spell)) {
        return 0;
      }
      
      // Get base damage
      const damageTotal = getSpellDamage(spell);
      
      // Calculate the expected number of targets
      const expectedTargets = getExpectedTargets(spell, context);
      
      // Calculate the per-target falloff (if any)
      const falloff = spell.aoeFalloff || 0;
      
      // Calculate effective damage across all targets
      let totalDamage = 0;
      for (let i = 0; i < expectedTargets; i++) {
        totalDamage += damageTotal * Math.pow(1 - falloff, i);
      }
      
      return totalDamage / expectedTargets;
    }
  },
  
  penetration: {
    id: 'penetration',
    name: 'Penetration',
    description: 'Effectiveness against resistant targets',
    weight: 0.4,
    targetBaseline: (level) => level * 0.5,
    calculate: (spell, context) => {
      // Check for penetration value
      const penetration = spell.penetration || 0;
      
      // Consider damage type
      const damageType = spell.damageType || 'physical';
      
      // Get resistances for typical targets
      const standardResistance = context.standardResistance || 30;
      
      // Calculate damage after resistance
      const damageReduction = Math.max(0, standardResistance - penetration) / 100;
      
      return 1 - damageReduction;
    }
  }
};

/**
 * Metrics for evaluating healing spells
 */
export const HEALING_METRICS = {
  hps: {
    id: 'hps',
    name: 'HPS',
    description: 'Healing Per Second',
    weight: 1.0,
    targetBaseline: (level) => level * 1.8,
    calculate: (spell, context) => {
      // Get base healing
      const healingTotal = getSpellHealing(spell);
      
      // Calculate cooldown in seconds
      const cooldownTime = getCooldownTimeInSeconds(spell);
      
      // Calculate HPS
      return healingTotal / cooldownTime;
    }
  },
  
  burstHealing: {
    id: 'burstHealing',
    name: 'Burst Healing',
    description: 'Maximum healing in a short time window',
    weight: 0.9,
    targetBaseline: (level) => level * 3.5,
    calculate: (spell, context) => {
      // Get base healing
      const healingTotal = getSpellHealing(spell);
      
      // Account for critical chance and multiplier
      const criticalChance = spell.criticalChance || context.defaultCritChance || 0.05;
      const criticalMultiplier = spell.criticalMultiplier || context.defaultCritMultiplier || 1.5;
      
      // Calculate average healing with crits
      const avgHealing = healingTotal * (1 + (criticalChance * (criticalMultiplier - 1)));
      
      // For burst, we also consider the cast time
      const castTime = spell.castTime || 0;
      if (castTime > 1.5) {
        // Penalize long cast times for burst metric
        return avgHealing * (1 - (castTime - 1.5) * 0.15);
      }
      
      return avgHealing;
    }
  },
  
  sustainedHealing: {
    id: 'sustainedHealing',
    name: 'Sustained Healing',
    description: 'Healing output over prolonged combat',
    weight: 0.8,
    targetBaseline: (level) => level * 12,
    calculate: (spell, context) => {
      // Get base healing per cast
      const healingTotal = getSpellHealing(spell);
      
      // Calculate cooldown in seconds
      const cooldownTime = getCooldownTimeInSeconds(spell);
      
      // Calculate resource efficiency
      const resourceCost = getSpellResourceCost(spell);
      const resourcePerSec = resourceCost / cooldownTime;
      
      // Standard combat duration (30 seconds)
      const combatDuration = context.combatDuration || 30;
      
      // Calculate how many times the spell can be cast
      let totalCasts = Math.floor(combatDuration / cooldownTime);
      
      // Adjust for resource constraints
      const availableResource = context.availableResource || (resourceCost * totalCasts);
      totalCasts = Math.min(totalCasts, Math.floor(availableResource / resourceCost));
      
      // Calculate total healing
      return healingTotal * totalCasts;
    }
  },
  
  overhealing: {
    id: 'overhealing',
    name: 'Overhealing Risk',
    description: 'Risk of excess healing being wasted',
    weight: 0.3,
    targetBaseline: (level) => 0.2,
    calculate: (spell, context) => {
      // Get base healing
      const healingTotal = getSpellHealing(spell);
      
      // Estimate target health percentages
      const targetHealthPercent = context.targetHealthPercent || 0.7;
      const targetMaxHealth = context.targetMaxHealth || (healingTotal * 3);
      
      // Calculate the current health deficit
      const healthDeficit = targetMaxHealth * (1 - targetHealthPercent);
      
      // Calculate the risk of overhealing
      if (healingTotal <= healthDeficit) {
        return 0; // No risk of overhealing
      }
      
      return (healingTotal - healthDeficit) / healingTotal;
    }
  },
  
  groupEfficiency: {
    id: 'groupEfficiency',
    name: 'Group Efficiency',
    description: 'Efficiency of healing across multiple targets',
    weight: 0.6,
    targetBaseline: (level) => level * 1.2,
    calculate: (spell, context) => {
      // If not a group heal, return 0
      if (!isGroupHealing(spell)) {
        return 0;
      }
      
      // Get base healing
      const healingTotal = getSpellHealing(spell);
      
      // Calculate the expected number of targets
      const expectedTargets = getExpectedTargets(spell, context);
      
      // Calculate the per-target falloff (if any)
      const falloff = spell.healFalloff || 0;
      
      // Calculate effective healing across all targets
      let totalHealing = 0;
      for (let i = 0; i < expectedTargets; i++) {
        totalHealing += healingTotal * Math.pow(1 - falloff, i);
      }
      
      return totalHealing / expectedTargets;
    }
  }
};

/**
 * Metrics for evaluating control spells
 */
export const CONTROL_METRICS = {
  controlDuration: {
    id: 'controlDuration',
    name: 'Control Duration',
    description: 'Duration of control effects',
    weight: 0.8,
    targetBaseline: (level) => 2 + (level * 0.1),
    calculate: (spell, context) => {
      // If not a control spell, return 0
      if (!isControlSpell(spell)) {
        return 0;
      }
      
      // Get control duration
      const duration = getSpellDuration(spell);
      
      // Convert to seconds
      return durationToSeconds(duration);
    }
  },
  
  controlStrength: {
    id: 'controlStrength',
    name: 'Control Strength',
    description: 'Potency of control effects',
    weight: 1.0,
    targetBaseline: (level) => 5 + (level * 0.2),
    calculate: (spell, context) => {
      // If not a control spell, return 0
      if (!isControlSpell(spell)) {
        return 0;
      }
      
      // Base control rating
      let controlRating = 5;
      
      // Adjust based on control type
      const controlType = getControlType(spell);
      switch (controlType) {
        case 'stun':
          controlRating = 10;
          break;
        case 'root':
          controlRating = 7;
          break;
        case 'silence':
          controlRating = 8;
          break;
        case 'slow':
          controlRating = 4 + (spell.slowAmount || 30) / 10;
          break;
        case 'fear':
          controlRating = 9;
          break;
        case 'knockback':
          controlRating = 6;
          break;
        case 'disarm':
          controlRating = 7;
          break;
        default:
          controlRating = 5;
      }
      
      // Adjust for control break conditions
      if (spell.breaksOnDamage) {
        controlRating *= 0.7;
      }
      
      // Adjust for diminishing returns
      if (spell.diminishingReturns) {
        controlRating *= 0.9;
      }
      
      return controlRating;
    }
  },
  
  controlReliability: {
    id: 'controlReliability',
    name: 'Control Reliability',
    description: 'Likelihood of control effects applying successfully',
    weight: 0.7,
    targetBaseline: (level) => 0.7 + (level * 0.01),
    calculate: (spell, context) => {
      // If not a control spell, return 0
      if (!isControlSpell(spell)) {
        return 0;
      }
      
      // Base hit chance
      let hitChance = spell.hitChance || 0.9;
      
      // Control save DC
      const saveDC = spell.saveDC || 10 + Math.floor(context.casterLevel / 2);
      
      // Average target save bonus
      const saveBonus = context.targetSaveBonus || Math.floor(context.targetLevel / 3);
      
      // Calculate control resistance chance
      const resistChance = Math.min(0.95, Math.max(0.05, (10 + saveBonus) / (saveDC + 10)));
      
      // Overall reliability
      return hitChance * (1 - resistChance);
    }
  },
  
  areaControl: {
    id: 'areaControl',
    name: 'Area Control',
    description: 'Effectiveness of control across multiple targets',
    weight: 0.6,
    targetBaseline: (level) => level * 0.3,
    calculate: (spell, context) => {
      // If not a control spell or not an area effect, return 0
      if (!isControlSpell(spell) || !isAreaEffect(spell)) {
        return 0;
      }
      
      // Get base control rating
      const controlRating = CONTROL_METRICS.controlStrength.calculate(spell, context);
      
      // Calculate the expected number of targets
      const expectedTargets = getExpectedTargets(spell, context);
      
      // Calculate effective control across all targets
      return controlRating * expectedTargets;
    }
  },
  
  versatility: {
    id: 'versatility',
    name: 'Control Versatility',
    description: 'Versatility of control applications',
    weight: 0.4,
    targetBaseline: (level) => 2 + (level * 0.05),
    calculate: (spell, context) => {
      // If not a control spell, return 0
      if (!isControlSpell(spell)) {
        return 0;
      }
      
      // Base versatility rating
      let versatility = 1;
      
      // Check for additional effects
      if (spell.additionalEffects && Array.isArray(spell.additionalEffects)) {
        versatility += spell.additionalEffects.length * 0.5;
      }
      
      // Check for utility options
      if (spell.utilityOptions && Array.isArray(spell.utilityOptions)) {
        versatility += spell.utilityOptions.length * 0.3;
      }
      
      // Check for conditional effects
      if (spell.conditionalEffects && Object.keys(spell.conditionalEffects).length > 0) {
        versatility += Object.keys(spell.conditionalEffects).length * 0.4;
      }
      
      return versatility;
    }
  }
};

/**
 * Metrics for evaluating utility spells
 */
export const UTILITY_METRICS = {
  versatility: {
    id: 'versatility',
    name: 'Versatility',
    description: 'Range of different applications and use cases',
    weight: 1.0,
    targetBaseline: (level) => 3 + (level * 0.1),
    calculate: (spell, context) => {
      // Base versatility rating
      let versatility = 1;
      
      // Check for utility categories
      const utilityType = getUtilityType(spell);
      switch (utilityType) {
        case 'movement':
          versatility += 3;
          break;
        case 'divination':
          versatility += 4;
          break;
        case 'illusion':
          versatility += 3.5;
          break;
        case 'conjuration':
          versatility += 2.5;
          break;
        case 'environment':
          versatility += 3;
          break;
        case 'enchantment':
          versatility += 2;
          break;
        case 'transformation':
          versatility += 2.5;
          break;
        default:
          versatility += 1;
      }
      
      // Check for additional options
      if (spell.utilityOptions && Array.isArray(spell.utilityOptions)) {
        versatility += spell.utilityOptions.length;
      }
      
      // Check for environmental bonuses
      if (spell.environmentalBonuses && Object.keys(spell.environmentalBonuses).length > 0) {
        versatility += Object.keys(spell.environmentalBonuses).length * 0.3;
      }
      
      return versatility;
    }
  },
  
  uniqueValue: {
    id: 'uniqueValue',
    name: 'Unique Value',
    description: 'Value of unique utility functionality',
    weight: 0.9,
    targetBaseline: (level) => 2 + (level * 0.07),
    calculate: (spell, context) => {
      // Base uniqueness rating
      let uniqueness = 1;
      
      // Check for rarity of effect
      if (spell.effectRarity === 'common') uniqueness += 0;
      else if (spell.effectRarity === 'uncommon') uniqueness += 1;
      else if (spell.effectRarity === 'rare') uniqueness += 2;
      else if (spell.effectRarity === 'very_rare') uniqueness += 3;
      else if (spell.effectRarity === 'unique') uniqueness += 4;
      else uniqueness += 0.5;
      
      // Check for irreplaceability
      if (spell.hasAlternatives === false) uniqueness += 2;
      
      // Check for category-specific bonuses
      const utilityType = getUtilityType(spell);
      if (utilityType === 'divination' || utilityType === 'illusion') {
        uniqueness += 1;
      }
      
      return uniqueness;
    }
  },
  
  frequencyOfUse: {
    id: 'frequencyOfUse',
    name: 'Frequency of Use',
    description: 'How frequently the utility is likely to be useful',
    weight: 0.7,
    targetBaseline: (level) => 5,
    calculate: (spell, context) => {
      // Base frequency rating
      let frequency = 3;
      
      // Check for context dependency
      if (spell.contextDependent) {
        frequency -= 2;
      }
      
      // Check for niche applications
      if (spell.nicheApplication) {
        frequency -= 1;
      }
      
      // Check for broad applications
      if (spell.broadApplication) {
        frequency += 2;
      }
      
      // Check for constant use
      if (spell.constantlyUseful) {
        frequency += 3;
      }
      
      // Adjust based on utility type
      const utilityType = getUtilityType(spell);
      switch (utilityType) {
        case 'movement':
          frequency += 2;
          break;
        case 'divination':
          frequency += 1;
          break;
        case 'conjuration':
          frequency += 0.5;
          break;
        default:
          break;
      }
      
      return Math.max(1, frequency);
    }
  },
  
  outOfCombatValue: {
    id: 'outOfCombatValue',
    name: 'Out of Combat Value',
    description: 'Value in non-combat situations',
    weight: 0.5,
    targetBaseline: (level) => 5,
    calculate: (spell, context) => {
      // Base out-of-combat value
      let value = 3;
      
      // Check for explicit non-combat rating
      if (spell.nonCombatRating !== undefined) {
        return spell.nonCombatRating;
      }
      
      // Check for utility type
      const utilityType = getUtilityType(spell);
      switch (utilityType) {
        case 'divination':
          value += 3;
          break;
        case 'illusion':
          value += 2;
          break;
        case 'movement':
          value += 2;
          break;
        case 'conjuration':
          value += 1;
          break;
        case 'enchantment':
          value += 2;
          break;
        case 'transformation':
          value += 1;
          break;
        default:
          break;
      }
      
      // Check for social impact
      if (spell.socialImpact) {
        value += 2;
      }
      
      // Check for exploration impact
      if (spell.explorationImpact) {
        value += 2;
      }
      
      return value;
    }
  },
  
  duration: {
    id: 'duration',
    name: 'Utility Duration',
    description: 'Duration of utility effects',
    weight: 0.6,
    targetBaseline: (level) => 30 + (level * 3),
    calculate: (spell, context) => {
      // Get utility duration
      const duration = getSpellDuration(spell);
      
      // Convert to seconds
      return durationToSeconds(duration);
    }
  }
};

/**
 * Metrics for evaluating mobility spells
 */
export const MOBILITY_METRICS = {
  distance: {
    id: 'distance',
    name: 'Distance',
    description: 'Distance covered by mobility effect',
    weight: 1.0,
    targetBaseline: (level) => 20 + (level * 2),
    calculate: (spell, context) => {
      // If not a mobility spell, return 0
      if (!isMobilitySpell(spell)) {
        return 0;
      }
      
      // Get movement distance
      let distance = spell.movementDistance || 0;
      
      // Check for teleport
      if (spell.isTeleportion) {
        distance = spell.teleportDistance || 30;
      }
      
      // Check for speed buff
      if (spell.speedMultiplier) {
        const baseSpeed = context.baseSpeed || 30;
        const duration = durationToSeconds(getSpellDuration(spell));
        distance = baseSpeed * (spell.speedMultiplier - 1) * duration / 6; // Assuming 6 seconds per round
      }
      
      return distance;
    }
  },
  
  freedomOfMovement: {
    id: 'freedomOfMovement',
    name: 'Freedom of Movement',
    description: 'Ability to bypass obstacles and restrictions',
    weight: 0.8,
    targetBaseline: (level) => 3 + (level * 0.1),
    calculate: (spell, context) => {
      // If not a mobility spell, return 0
      if (!isMobilitySpell(spell)) {
        return 0;
      }
      
      // Base rating
      let rating = 1;
      
      // Check movement type
      if (spell.movementType === 'teleport') rating += 5;
      else if (spell.movementType === 'flight') rating += 4;
      else if (spell.movementType === 'phasing') rating += 5;
      else if (spell.movementType === 'blink') rating += 3;
      else if (spell.movementType === 'speed') rating += 1;
      else if (spell.movementType === 'jump') rating += 2;
      else if (spell.movementType === 'climb') rating += 2;
      else if (spell.movementType === 'swim') rating += 2;
      
      // Check for obstacle bypass
      if (spell.bypassesObstacles) rating += 2;
      if (spell.bypassesHazards) rating += 1;
      if (spell.bypassesEnemies) rating += 2;
      
      return rating;
    }
  },
  
  reliability: {
    id: 'reliability',
    name: 'Mobility Reliability',
    description: 'Reliability of mobility effect',
    weight: 0.6,
    targetBaseline: (level) => 0.8 + (level * 0.01),
    calculate: (spell, context) => {
      // If not a mobility spell, return 0
      if (!isMobilitySpell(spell)) {
        return 0;
      }
      
      // Base reliability
      let reliability = 0.9;
      
      // Check for chance-based effects
      if (spell.successChance) {
        reliability = spell.successChance;
      }
      
      // Check for blockable effects
      if (spell.canBeBlocked) {
        reliability *= 0.8;
      }
      
      // Check for counterable effects
      if (spell.canBeCountered) {
        reliability *= 0.9;
      }
      
      // Check for line of sight requirements
      if (spell.requiresLineOfSight) {
        reliability *= 0.9;
      }
      
      return reliability;
    }
  },
  
  escapePotential: {
    id: 'escapePotential',
    name: 'Escape Potential',
    description: 'Effectiveness as an escape mechanism',
    weight: 0.7,
    targetBaseline: (level) => 3 + (level * 0.1),
    calculate: (spell, context) => {
      // If not a mobility spell, return 0
      if (!isMobilitySpell(spell)) {
        return 0;
      }
      
      // Base rating
      let rating = 1;
      
      // Check cast time (instant is better for escapes)
      const castTime = spell.castTime || 0;
      rating *= Math.max(0.5, 1 - (castTime * 0.3));
      
      // Check if it breaks crowd control
      if (spell.breaksControl) rating += 3;
      
      // Check movement type for escape value
      if (spell.movementType === 'teleport') rating += 4;
      else if (spell.movementType === 'blink') rating += 3;
      else if (spell.movementType === 'speed') rating += 2;
      else if (spell.movementType === 'phasing') rating += 4;
      
      // Check for damage immunity during travel
      if (spell.damageImmunityDuringTravel) rating += 2;
      
      // Check for crowd control immunity after use
      if (spell.controlImmunityAfterUse) rating += 2;
      
      return rating;
    }
  },
  
  groupMobility: {
    id: 'groupMobility',
    name: 'Group Mobility',
    description: 'Ability to move multiple allies',
    weight: 0.4,
    targetBaseline: (level) => 1 + (level * 0.05),
    calculate: (spell, context) => {
      // If not a mobility spell, return 0
      if (!isMobilitySpell(spell)) {
        return 0;
      }
      
      // Check if it affects multiple targets
      if (!spell.affectsMultipleTargets && !spell.affectsGroup) {
        return 0;
      }
      
      // Count targets
      let targets = spell.targetCount || 1;
      if (spell.affectsGroup) {
        targets = context.groupSize || 4;
      }
      
      // Adjust rating for effectiveness
      const effectivenessMultiplier = 
        (spell.movementType === 'teleport') ? 1.0 :
        (spell.movementType === 'speed') ? 0.7 :
        0.8;
      
      return targets * effectivenessMultiplier;
    }
  }
};

/**
 * Metrics for evaluating defensive spells
 */
export const DEFENSE_METRICS = {
  damageReduction: {
    id: 'damageReduction',
    name: 'Damage Reduction',
    description: 'Amount of damage prevented',
    weight: 1.0,
    targetBaseline: (level) => level * 3,
    calculate: (spell, context) => {
      // If not a defensive spell, return 0
      if (!isDefensiveSpell(spell)) {
        return 0;
      }
      
      // Get damage reduction
      let reduction = 0;
      
      // Check for absorption shield
      if (spell.absorptionAmount) {
        reduction = spell.absorptionAmount;
      }
      
      // Check for damage reduction percentage
      if (spell.damageReductionPercent) {
        const expectedDamage = context.expectedDamage || (context.targetLevel * 5);
        reduction += expectedDamage * (spell.damageReductionPercent / 100);
      }
      
      // Check for flat damage reduction
      if (spell.flatDamageReduction) {
        const expectedHits = context.expectedHits || 3;
        reduction += spell.flatDamageReduction * expectedHits;
      }
      
      return reduction;
    }
  },
  
  defensive_duration: {
    id: 'defensive_duration',
    name: 'Defensive Duration',
    description: 'Duration of defensive effect',
    weight: 0.8,
    targetBaseline: (level) => 6 + (level * 0.5),
    calculate: (spell, context) => {
      // If not a defensive spell, return 0
      if (!isDefensiveSpell(spell)) {
        return 0;
      }
      
      // Get duration
      const duration = getSpellDuration(spell);
      
      // Convert to seconds
      return durationToSeconds(duration);
    }
  },
  
  mitigation_reliability: {
    id: 'mitigation_reliability',
    name: 'Mitigation Reliability',
    description: 'Reliability of damage mitigation',
    weight: 0.7,
    targetBaseline: (level) => 0.8 + (level * 0.01),
    calculate: (spell, context) => {
      // If not a defensive spell, return 0
      if (!isDefensiveSpell(spell)) {
        return 0;
      }
      
      // Base reliability
      let reliability = 0.9;
      
      // Check if it can be dispelled
      if (spell.canBeDispelled) {
        reliability *= 0.9;
      }
      
      // Check if it has limitations
      if (spell.damageTypeLimitation) {
        reliability *= 0.7;
      }
      
      // Check for guaranteed protection
      if (spell.guaranteedProtection) {
        reliability = 1.0;
      }
      
      return reliability;
    }
  },
  
  avoidance: {
    id: 'avoidance',
    name: 'Avoidance',
    description: 'Ability to avoid damage entirely',
    weight: 0.6,
    targetBaseline: (level) => 0.2 + (level * 0.01),
    calculate: (spell, context) => {
      // If not a defensive spell, return 0
      if (!isDefensiveSpell(spell)) {
        return 0;
      }
      
      // Check for avoidance chance
      if (spell.avoidanceChance) {
        return spell.avoidanceChance;
      }
      
      // Check for immunity
      if (spell.immunity) {
        return 1.0;
      }
      
      // Default avoidance value
      return 0;
    }
  },
  
  countermeasures: {
    id: 'countermeasures',
    name: 'Countermeasures',
    description: 'Ability to counter enemy actions',
    weight: 0.5,
    targetBaseline: (level) => 2 + (level * 0.1),
    calculate: (spell, context) => {
      // If not a defensive spell, return 0
      if (!isDefensiveSpell(spell)) {
        return 0;
      }
      
      // Base rating
      let rating = 0;
      
      // Check for reflection
      if (spell.reflectsEffects) rating += 4;
      
      // Check for interruption
      if (spell.interruptsEffects) rating += 3;
      
      // Check for dispel
      if (spell.dispelsEffects) rating += 3;
      
      // Check for immunity generation
      if (spell.grantsImmunity) rating += 3;
      
      // Check for retaliation
      if (spell.counterattacks) rating += 2;
      
      return rating;
    }
  }
};

/**
 * Combined spell power metrics for comprehensive evaluation
 */
export const SPELL_POWER_METRICS = {
  damage: DAMAGE_METRICS,
  healing: HEALING_METRICS,
  control: CONTROL_METRICS,
  utility: UTILITY_METRICS,
  mobility: MOBILITY_METRICS,
  defense: DEFENSE_METRICS
};

// =======================================================================
// RESOURCE EFFICIENCY CALCULATORS
// =======================================================================

/**
 * Resource efficiency calculators
 */
export const RESOURCE_EFFICIENCY_CALCULATORS = {
  /**
   * Calculate damage per resource point
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {number} Damage per resource point
   */
  calculateDamagePerPoint: (spell, context = {}) => {
    // Get total damage
    const totalDamage = getSpellDamage(spell);
    
    // Get resource cost
    const resourceCost = getSpellResourceCost(spell);
    
    // If no cost, return zero to avoid division by zero
    if (resourceCost === 0) {
      return 0;
    }
    
    return totalDamage / resourceCost;
  },
  
  /**
   * Calculate healing per resource point
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {number} Healing per resource point
   */
  calculateHealingPerPoint: (spell, context = {}) => {
    // Get total healing
    const totalHealing = getSpellHealing(spell);
    
    // Get resource cost
    const resourceCost = getSpellResourceCost(spell);
    
    // If no cost, return zero to avoid division by zero
    if (resourceCost === 0) {
      return 0;
    }
    
    return totalHealing / resourceCost;
  },
  
  /**
   * Calculate control effect per resource point
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {number} Control value per resource point
   */
  calculateControlPerPoint: (spell, context = {}) => {
    // If not a control spell, return 0
    if (!isControlSpell(spell)) {
      return 0;
    }
    
    // Get control rating
    const controlRating = CONTROL_METRICS.controlStrength.calculate(spell, context);
    
    // Get control duration in seconds
    const controlDuration = durationToSeconds(getSpellDuration(spell));
    
    // Calculate control value (rating * duration)
    const controlValue = controlRating * controlDuration;
    
    // Get resource cost
    const resourceCost = getSpellResourceCost(spell);
    
    // If no cost, return zero to avoid division by zero
    if (resourceCost === 0) {
      return 0;
    }
    
    return controlValue / resourceCost;
  },
  
  /**
   * Calculate utility value per resource point
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {number} Utility value per resource point
   */
  calculateUtilityPerPoint: (spell, context = {}) => {
    // Get utility rating
    const versatilityRating = UTILITY_METRICS.versatility.calculate(spell, context);
    const uniqueValueRating = UTILITY_METRICS.uniqueValue.calculate(spell, context);
    const frequencyRating = UTILITY_METRICS.frequencyOfUse.calculate(spell, context);
    
    // Calculate combined utility value
    const utilityValue = (versatilityRating * 0.4) + (uniqueValueRating * 0.4) + (frequencyRating * 0.2);
    
    // Get resource cost
    const resourceCost = getSpellResourceCost(spell);
    
    // If no cost, return zero to avoid division by zero
    if (resourceCost === 0) {
      return 0;
    }
    
    return utilityValue / resourceCost;
  },
  
  /**
   * Calculate overall cost efficiency of a spell
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {Object} Detailed cost efficiency analysis
   */
  calculateCostEfficiency: (spell, context = {}) => {
    // Determine spell type
    const spellType = getSpellPrimaryType(spell);
    
    // Calculate specific efficiency based on spell type
    let primaryEfficiency = 0;
    let primaryType = '';
    
    switch (spellType) {
      case 'damage':
        primaryEfficiency = RESOURCE_EFFICIENCY_CALCULATORS.calculateDamagePerPoint(spell, context);
        primaryType = 'damage';
        break;
      case 'healing':
        primaryEfficiency = RESOURCE_EFFICIENCY_CALCULATORS.calculateHealingPerPoint(spell, context);
        primaryType = 'healing';
        break;
      case 'control':
        primaryEfficiency = RESOURCE_EFFICIENCY_CALCULATORS.calculateControlPerPoint(spell, context);
        primaryType = 'control';
        break;
      case 'utility':
      case 'mobility':
        primaryEfficiency = RESOURCE_EFFICIENCY_CALCULATORS.calculateUtilityPerPoint(spell, context);
        primaryType = 'utility';
        break;
      default:
        primaryEfficiency = 1;
        primaryType = 'unknown';
    }
    
    // Calculate cooldown efficiency
    const cooldownEfficiency = calculateCooldownEfficiency(spell, context);
    
    // Calculate cast time efficiency
    const castTimeEfficiency = calculateCastTimeEfficiency(spell, context);
    
    // Calculate overall efficiency score
    const overallEfficiency = (primaryEfficiency * 0.6) + (cooldownEfficiency * 0.2) + (castTimeEfficiency * 0.2);
    
    return {
      overallEfficiency,
      primaryEfficiency,
      primaryType,
      cooldownEfficiency,
      castTimeEfficiency,
      resourceCost: getSpellResourceCost(spell),
      resourceType: getSpellResourceType(spell)
    };
  }
};

// =======================================================================
// COMPARATIVE BALANCE FUNCTIONS
// =======================================================================

/**
 * Functions for comparative spell balance evaluation
 */
export const COMPARATIVE_BALANCE = {
  /**
   * Compare a spell against a baseline standard
   * @param {Object} spell - The spell to evaluate
   * @param {Object} baselineSpell - The baseline spell to compare against
   * @param {Object} context - Evaluation context
   * @returns {Object} Comparison results
   */
  compareWithBaseline: (spell, baselineSpell, context = {}) => {
    // Determine relevant metrics based on spell type
    const spellType = getSpellPrimaryType(spell);
    const baselineType = getSpellPrimaryType(baselineSpell);
    
    // If types don't match, warn about comparison
    const typeMismatch = spellType !== baselineType;
    
    // Get metrics for the spell type
    const metrics = getMetricsForSpellType(spellType);
    
    // Compare each metric
    const metricComparisons = {};
    let totalRatio = 0;
    let validMetricCount = 0;
    
    for (const [metricId, metric] of Object.entries(metrics)) {
      // Calculate values for both spells
      const spellValue = metric.calculate(spell, context);
      const baselineValue = metric.calculate(baselineSpell, context);
      
      // Skip metrics that return 0 for both spells
      if (spellValue === 0 && baselineValue === 0) {
        metricComparisons[metricId] = {
          spellValue,
          baselineValue,
          ratio: 1, // neutral
          difference: 0,
          percentDifference: 0
        };
        continue;
      }
      
      // Calculate ratio (capped to prevent extreme outliers)
      let ratio = 1; // default neutral value
      
      if (baselineValue !== 0) {
        ratio = spellValue / baselineValue;
      } else if (spellValue !== 0) {
        ratio = 2; // arbitrary value when baseline is 0 but spell has value
      }
      
      // Cap ratio to prevent extreme outliers
      ratio = Math.max(0.1, Math.min(10, ratio));
      
      const difference = spellValue - baselineValue;
      const percentDifference = baselineValue !== 0 ? 
        ((spellValue - baselineValue) / baselineValue) * 100 : 0;
      
      metricComparisons[metricId] = {
        spellValue,
        baselineValue,
        ratio,
        difference,
        percentDifference
      };
      
      // Add to totals for weighted average
      totalRatio += ratio * metric.weight;
      validMetricCount += metric.weight;
    }
    
    // Calculate overall comparative score
    const overallRatio = validMetricCount > 0 ? totalRatio / validMetricCount : 1;
    
    // Interpret the overall ratio
    const interpretation = interpretPowerRatio(overallRatio);
    
    return {
      spellType,
      baselineType,
      typeMismatch,
      metricComparisons,
      overallRatio,
      interpretation,
      balanceAdjustmentNeeded: Math.abs(overallRatio - 1) > 0.2
    };
  },
  
  /**
   * Compare a spell against level-appropriate power tier
   * @param {Object} spell - The spell to evaluate
   * @param {number} tierLevel - The power tier level
   * @param {Object} context - Evaluation context
   * @returns {Object} Comparison results
   */
  compareWithTier: (spell, tierLevel, context = {}) => {
    // If tierLevel isn't provided, use spell's level
    const level = tierLevel || spell.level || 1;
    
    // Determine relevant metrics based on spell type
    const spellType = getSpellPrimaryType(spell);
    
    // Get metrics for the spell type
    const metrics = getMetricsForSpellType(spellType);
    
    // Compare each metric against tier baseline
    const metricComparisons = {};
    let totalRatio = 0;
    let validMetricCount = 0;
    
    for (const [metricId, metric] of Object.entries(metrics)) {
      // Calculate value for spell
      const spellValue = metric.calculate(spell, context);
      
      // Calculate baseline for this tier level
      const baselineValue = metric.targetBaseline(level);
      
      // Skip metrics that return 0 for the spell
      if (spellValue === 0) {
        metricComparisons[metricId] = {
          spellValue,
          baselineValue,
          ratio: 0, // clearly below baseline
          difference: -baselineValue,
          percentDifference: -100
        };
        continue;
      }
      
      // Calculate ratio (capped to prevent extreme outliers)
      const ratio = Math.max(0.1, Math.min(10, spellValue / baselineValue));
      
      const difference = spellValue - baselineValue;
      const percentDifference = ((spellValue - baselineValue) / baselineValue) * 100;
      
      metricComparisons[metricId] = {
        spellValue,
        baselineValue,
        ratio,
        difference,
        percentDifference
      };
      
      // Add to totals for weighted average
      totalRatio += ratio * metric.weight;
      validMetricCount += metric.weight;
    }
    
    // Calculate overall comparative score
    const overallRatio = validMetricCount > 0 ? totalRatio / validMetricCount : 0;
    
    // Interpret the overall ratio
    const interpretation = interpretPowerRatio(overallRatio);
    
    // Generate tier information
    const tierInfo = {
      level,
      name: getTierName(level),
      expectedPower: level * 5, // Arbitrary formula for expected power
      actualPower: level * 5 * overallRatio
    };
    
    return {
      spellType,
      metricComparisons,
      overallRatio,
      interpretation,
      tierInfo,
      balanceAdjustmentNeeded: Math.abs(overallRatio - 1) > 0.2
    };
  },
  
  /**
   * Find spells similar to the given spell for comparison
   * @param {Object} spell - The spell to compare
   * @param {Array} spellLibrary - Array of spells to search
   * @param {Object} context - Evaluation context
   * @returns {Array} Similar spells with similarity scores
   */
  findSimilarSpells: (spell, spellLibrary, context = {}) => {
    // Extract key characteristics for comparison
    const spellType = getSpellPrimaryType(spell);
    const spellLevel = spell.level || 1;
    const damageType = spell.damageType || '';
    const targetingType = spell.targetingType || 'single';
    const duration = getSpellDuration(spell);
    const cooldown = spell.cooldown || {};
    const resourceType = getSpellResourceType(spell);
    
    // Calculate similarity scores for each spell in the library
    const similarSpells = spellLibrary
      .filter(s => s.id !== spell.id) // Exclude the same spell
      .map(s => {
        // Calculate similarity score components
        const typeMatch = getSpellPrimaryType(s) === spellType ? 1 : 0;
        const levelMatch = Math.max(0, 1 - Math.abs(s.level - spellLevel) / 10);
        const damageTypeMatch = s.damageType === damageType ? 1 : 0;
        const targetingMatch = s.targetingType === targetingType ? 1 : 0;
        const durationMatch = areDurationsSimilar(getSpellDuration(s), duration) ? 1 : 0;
        const cooldownMatch = areCooldownsSimilar(s.cooldown, cooldown) ? 1 : 0;
        const resourceMatch = getSpellResourceType(s) === resourceType ? 1 : 0;
        
        // Calculate weighted similarity score
        const similarityScore =
          (typeMatch * 3) +
          (levelMatch * 2) +
          (damageTypeMatch * 1) +
          (targetingMatch * 1.5) +
          (durationMatch * 1) +
          (cooldownMatch * 1.5) +
          (resourceMatch * 1);
        
        // Normalize to 0-1 range
        const normalizedScore = similarityScore / 11;
        
        return {
          spell: s,
          similarityScore: normalizedScore,
          matchDetails: {
            typeMatch,
            levelMatch,
            damageTypeMatch,
            targetingMatch,
            durationMatch,
            cooldownMatch,
            resourceMatch
          }
        };
      })
      .filter(s => s.similarityScore > 0.6) // Only include reasonably similar spells
      .sort((a, b) => b.similarityScore - a.similarityScore); // Sort by similarity
    
    return similarSpells.slice(0, 5); // Return top 5 most similar spells
  },
  
  /**
   * Calculate power percentile compared to other spells
   * @param {Object} spell - The spell to evaluate
   * @param {Array} spellLibrary - Array of spells to compare against
   * @param {Object} context - Evaluation context
   * @returns {Object} Percentile information
   */
  calculatePowerPercentile: (spell, spellLibrary, context = {}) => {
    // Determine spell type
    const spellType = getSpellPrimaryType(spell);
    
    // Find spells of the same primary type
    const sameTypeSpells = spellLibrary.filter(s => 
      getSpellPrimaryType(s) === spellType &&
      Math.abs(s.level - spell.level) <= 2 // Compare with spells of similar level
    );
    
    // If no similar spells found, return null
    if (sameTypeSpells.length === 0) {
      return {
        percentile: 50, // Default to middle
        comparedSpells: 0,
        spellType,
        level: spell.level,
        interpretation: "Insufficient data for percentile calculation"
      };
    }
    
    // Calculate power scores for all spells
    const powerScores = sameTypeSpells.map(s => {
      return {
        spell: s,
        powerScore: calculateOverallPowerScore(s, context)
      };
    });
    
    // Calculate power score for the target spell
    const spellPowerScore = calculateOverallPowerScore(spell, context);
    
    // Sort power scores
    powerScores.sort((a, b) => a.powerScore - b.powerScore);
    
    // Find where the target spell ranks
    let rank = 0;
    for (let i = 0; i < powerScores.length; i++) {
      if (spellPowerScore <= powerScores[i].powerScore) {
        rank = i;
        break;
      }
    }
    
    // If spell is stronger than all others, put at end
    if (rank === 0 && spellPowerScore > powerScores[0].powerScore) {
      rank = powerScores.length;
    }
    
    // Calculate percentile
    const percentile = Math.round((rank / powerScores.length) * 100);
    
    // Determine nearby spells for reference
    const spellIndex = powerScores.findIndex(s => s.spell.id === spell.id);
    
    // Get spells just above and below in power
    const nearbySpells = {
      stronger: spellIndex > 0 ? [powerScores[spellIndex - 1].spell] : [],
      weaker: spellIndex < powerScores.length - 1 ? [powerScores[spellIndex + 1].spell] : []
    };
    
    // Interpret the percentile
    const interpretation = interpretPercentile(percentile);
    
    return {
      percentile,
      comparedSpells: powerScores.length,
      spellType,
      level: spell.level,
      powerScore: spellPowerScore,
      averagePowerScore: powerScores.reduce((sum, s) => sum + s.powerScore, 0) / powerScores.length,
      nearbySpells,
      interpretation
    };
  },
  
  /**
   * Identify outlier spells in terms of power
   * @param {Array} spellLibrary - Array of spells to analyze
   * @param {Object} context - Evaluation context
   * @returns {Object} Identified outliers
   */
  identifyOutliers: (spellLibrary, context = {}) => {
    // Group spells by level and type
    const spellGroups = {};
    
    spellLibrary.forEach(spell => {
      const level = spell.level || 1;
      const type = getSpellPrimaryType(spell);
      const key = `${level}_${type}`;
      
      if (!spellGroups[key]) {
        spellGroups[key] = [];
      }
      
      spellGroups[key].push(spell);
    });
    
    // Find outliers within each group
    const outliers = {
      overpowered: [],
      underpowered: []
    };
    
    for (const [key, spells] of Object.entries(spellGroups)) {
      // Skip groups with too few spells for meaningful comparison
      if (spells.length < 3) continue;
      
      // Calculate power scores for all spells in group
      const powerScores = spells.map(spell => ({
        spell,
        powerScore: calculateOverallPowerScore(spell, context)
      }));
      
      // Calculate mean and standard deviation
      const scores = powerScores.map(p => p.powerScore);
      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      
      const squareDiffs = scores.map(score => Math.pow(score - mean, 2));
      const variance = squareDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
      const stdDev = Math.sqrt(variance);
      
      // Identify outliers (>2 standard deviations from mean)
      powerScores.forEach(({ spell, powerScore }) => {
        const zScore = (powerScore - mean) / stdDev;
        
        if (zScore > 2) {
          outliers.overpowered.push({
            spell,
            powerScore,
            zScore,
            groupMean: mean,
            deviation: (powerScore - mean) / mean * 100
          });
        } else if (zScore < -2) {
          outliers.underpowered.push({
            spell,
            powerScore,
            zScore,
            groupMean: mean,
            deviation: (powerScore - mean) / mean * 100
          });
        }
      });
    }
    
    // Sort outliers by deviation magnitude
    outliers.overpowered.sort((a, b) => b.deviation - a.deviation);
    outliers.underpowered.sort((a, b) => a.deviation - b.deviation);
    
    return outliers;
  }
};

// =======================================================================
// POWER ADJUSTMENT RECOMMENDATIONS
// =======================================================================

/**
 * Functions for recommending balance adjustments
 */
export const POWER_ADJUSTMENT_RECOMMENDATIONS = {
  /**
   * Suggest adjustments to spell cost for balance
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {Object} Cost adjustment recommendations
   */
  suggestCostAdjustments: (spell, context = {}) => {
    // Compare spell against appropriate tier
    const tierComparison = COMPARATIVE_BALANCE.compareWithTier(spell, spell.level, context);
    
    // If balance is already good, no adjustments needed
    if (!tierComparison.balanceAdjustmentNeeded) {
      return {
        adjustmentNeeded: false,
        currentCost: getSpellResourceCost(spell),
        resourceType: getSpellResourceType(spell),
        suggestions: ["No cost adjustments needed - spell is well-balanced"]
      };
    }
    
    // Calculate resource efficiency
    const efficiency = RESOURCE_EFFICIENCY_CALCULATORS.calculateCostEfficiency(spell, context);
    
    // Determine direction and magnitude of adjustment
    const isOverpowered = tierComparison.overallRatio > 1.2;
    const isUnderpowered = tierComparison.overallRatio < 0.8;
    
    // Current resource cost
    const currentCost = getSpellResourceCost(spell);
    const resourceType = getSpellResourceType(spell);
    
    // Generate suggestions
    const suggestions = [];
    let adjustedCost = currentCost;
    
    if (isOverpowered) {
      // Calculate percentage to increase cost
      const overpowerFactor = tierComparison.overallRatio - 1;
      const costIncreaseFactor = Math.min(0.5, overpowerFactor);
      
      // Calculate new cost
      adjustedCost = Math.ceil(currentCost * (1 + costIncreaseFactor));
      
      suggestions.push(`Increase ${resourceType} cost from ${currentCost} to ${adjustedCost}`);
      
      // If significantly overpowered, suggest secondary cost
      if (tierComparison.overallRatio > 1.5) {
        suggestions.push(`Add a secondary resource cost or cooldown`);
      }
      
      // If extremely overpowered, suggest cast time
      if (tierComparison.overallRatio > 2) {
        suggestions.push(`Increase cast time to balance high power`);
      }
    } else if (isUnderpowered) {
      // Calculate percentage to decrease cost
      const underpowerFactor = 1 - tierComparison.overallRatio;
      const costDecreaseFactor = Math.min(0.4, underpowerFactor);
      
      // Calculate new cost, ensuring minimum of 1
      adjustedCost = Math.max(1, Math.floor(currentCost * (1 - costDecreaseFactor)));
      
      suggestions.push(`Decrease ${resourceType} cost from ${currentCost} to ${adjustedCost}`);
      
      // If significantly underpowered, suggest removing secondary costs
      if (tierComparison.overallRatio < 0.5 && spell.secondaryResourceCost) {
        suggestions.push(`Remove secondary resource cost`);
      }
    }
    
    return {
      adjustmentNeeded: true,
      currentCost,
      suggestedCost: adjustedCost,
      resourceType,
      powerRatio: tierComparison.overallRatio,
      isOverpowered,
      isUnderpowered,
      suggestions
    };
  },
  
  /**
   * Suggest adjustments to spell effects for balance
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {Object} Effect adjustment recommendations
   */
  suggestEffectAdjustments: (spell, context = {}) => {
    // Compare spell against appropriate tier
    const tierComparison = COMPARATIVE_BALANCE.compareWithTier(spell, spell.level, context);
    
    // If balance is already good, no adjustments needed
    if (!tierComparison.balanceAdjustmentNeeded) {
      return {
        adjustmentNeeded: false,
        suggestions: ["No effect adjustments needed - spell is well-balanced"]
      };
    }
    
    // Determine direction and magnitude of adjustment
    const isOverpowered = tierComparison.overallRatio > 1.2;
    const isUnderpowered = tierComparison.overallRatio < 0.8;
    
    // Determine spell type for specific adjustments
    const spellType = getSpellPrimaryType(spell);
    
    // Generate suggestions
    const suggestions = [];
    const effectAdjustments = {};
    
    if (isOverpowered) {
      const reductionFactor = Math.min(0.3, tierComparison.overallRatio - 1);
      
      switch (spellType) {
        case 'damage':
          const currentDamage = getSpellDamage(spell);
          const adjustedDamage = Math.floor(currentDamage * (1 - reductionFactor));
          
          suggestions.push(`Reduce damage from ${currentDamage} to ${adjustedDamage}`);
          effectAdjustments.damage = {
            current: currentDamage,
            suggested: adjustedDamage
          };
          break;
          
        case 'healing':
          const currentHealing = getSpellHealing(spell);
          const adjustedHealing = Math.floor(currentHealing * (1 - reductionFactor));
          
          suggestions.push(`Reduce healing from ${currentHealing} to ${adjustedHealing}`);
          effectAdjustments.healing = {
            current: currentHealing,
            suggested: adjustedHealing
          };
          break;
          
        case 'control':
          const currentDuration = getSpellDuration(spell);
          const durationInSeconds = durationToSeconds(currentDuration);
          const adjustedSeconds = Math.floor(durationInSeconds * (1 - reductionFactor));
          
          suggestions.push(`Reduce control duration by ${Math.round(reductionFactor * 100)}%`);
          effectAdjustments.duration = {
            current: formatDuration(currentDuration.type, currentDuration.amount),
            suggested: formatDuration('seconds', adjustedSeconds)
          };
          break;
          
        case 'utility':
        case 'mobility':
          suggestions.push(`Reduce effect power by ${Math.round(reductionFactor * 100)}%`);
          suggestions.push(`Add limitations or conditions to spell usage`);
          break;
          
        case 'defense':
          const currentReduction = spell.damageReductionPercent || 0;
          const adjustedReduction = Math.floor(currentReduction * (1 - reductionFactor));
          
          suggestions.push(`Reduce defensive strength by ${Math.round(reductionFactor * 100)}%`);
          effectAdjustments.damageReduction = {
            current: currentReduction,
            suggested: adjustedReduction
          };
          break;
      }
      
      // For all overpowered spells, suggest adding limitations
      suggestions.push(`Consider adding a weakness or counter-condition`);
      
    } else if (isUnderpowered) {
      const increaseFactor = Math.min(0.4, 1 - tierComparison.overallRatio);
      
      switch (spellType) {
        case 'damage':
          const currentDamage = getSpellDamage(spell);
          const adjustedDamage = Math.ceil(currentDamage * (1 + increaseFactor));
          
          suggestions.push(`Increase damage from ${currentDamage} to ${adjustedDamage}`);
          effectAdjustments.damage = {
            current: currentDamage,
            suggested: adjustedDamage
          };
          break;
          
        case 'healing':
          const currentHealing = getSpellHealing(spell);
          const adjustedHealing = Math.ceil(currentHealing * (1 + increaseFactor));
          
          suggestions.push(`Increase healing from ${currentHealing} to ${adjustedHealing}`);
          effectAdjustments.healing = {
            current: currentHealing,
            suggested: adjustedHealing
          };
          break;
          
        case 'control':
          const currentDuration = getSpellDuration(spell);
          const durationInSeconds = durationToSeconds(currentDuration);
          const adjustedSeconds = Math.ceil(durationInSeconds * (1 + increaseFactor));
          
          suggestions.push(`Increase control duration by ${Math.round(increaseFactor * 100)}%`);
          effectAdjustments.duration = {
            current: formatDuration(currentDuration.type, currentDuration.amount),
            suggested: formatDuration('seconds', adjustedSeconds)
          };
          break;
          
        case 'utility':
        case 'mobility':
          suggestions.push(`Increase effect power by ${Math.round(increaseFactor * 100)}%`);
          suggestions.push(`Add secondary beneficial effects`);
          break;
          
        case 'defense':
          const currentReduction = spell.damageReductionPercent || 0;
          const adjustedReduction = Math.ceil(currentReduction * (1 + increaseFactor));
          
          suggestions.push(`Increase defensive strength by ${Math.round(increaseFactor * 100)}%`);
          effectAdjustments.damageReduction = {
            current: currentReduction,
            suggested: adjustedReduction
          };
          break;
      }
      
      // For all underpowered spells, suggest adding benefits
      suggestions.push(`Consider adding a secondary benefit or effect`);
    }
    
    return {
      adjustmentNeeded: true,
      spellType,
      powerRatio: tierComparison.overallRatio,
      isOverpowered,
      isUnderpowered,
      effectAdjustments,
      suggestions
    };
  },
  
  /**
   * Suggest limitations to add for balance
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {Object} Limitation recommendations
   */
  suggestLimitationAdditions: (spell, context = {}) => {
    // Compare spell against appropriate tier
    const tierComparison = COMPARATIVE_BALANCE.compareWithTier(spell, spell.level, context);
    
    // If spell is underpowered, no limitations needed
    if (tierComparison.overallRatio < 1) {
      return {
        needsLimitations: false,
        powerRatio: tierComparison.overallRatio,
        suggestions: ["No limitations needed - spell is not overpowered"]
      };
    }
    
    // Determine spell type for specific limitations
    const spellType = getSpellPrimaryType(spell);
    
    // Generate suggested limitations based on spell type and power level
    const suggestions = [];
    
    // Determine limitation severity based on power ratio
    const minorLimitation = tierComparison.overallRatio > 1.1;
    const moderateLimitation = tierComparison.overallRatio > 1.3;
    const majorLimitation = tierComparison.overallRatio > 1.5;
    
    // Add appropriate limitations based on spell type
    switch (spellType) {
      case 'damage':
        if (majorLimitation) {
          suggestions.push("Add significant cast time or channel requirement");
          suggestions.push("Make damage conditional on target state (e.g., more damage to slowed targets)");
          suggestions.push("Split damage between initial hit and damage over time");
        }
        
        if (moderateLimitation) {
          suggestions.push("Add damage falloff for secondary targets");
          suggestions.push("Require positioning condition (e.g., behind target)");
          suggestions.push("Add self-damage component or health cost");
        }
        
        if (minorLimitation) {
          suggestions.push("Add minor secondary resource cost");
          suggestions.push("Reduce critical hit chance or multiplier");
          suggestions.push("Add short cooldown between casts");
        }
        break;
        
      case 'healing':
        if (majorLimitation) {
          suggestions.push("Add significant cast time or channel requirement");
          suggestions.push("Add healing delay or healing over time component");
          suggestions.push("Make full healing conditional on target state");
        }
        
        if (moderateLimitation) {
          suggestions.push("Add healing falloff for secondary targets");
          suggestions.push("Make spell interruptible while casting");
          suggestions.push("Add positioning requirement (e.g., line of sight)");
        }
        
        if (minorLimitation) {
          suggestions.push("Add minor secondary resource cost");
          suggestions.push("Add short cooldown between casts");
          suggestions.push("Reduce effectiveness on repeated casting");
        }
        break;
        
      case 'control':
        if (majorLimitation) {
          suggestions.push("Add 'breaks on damage' condition");
          suggestions.push("Make control resistable or reducible by target");
          suggestions.push("Add diminishing returns on repeated use");
        }
        
        if (moderateLimitation) {
          suggestions.push("Reduce control effect against certain enemy types");
          suggestions.push("Make control partial rather than complete");
          suggestions.push("Add positioning requirement");
        }
        
        if (minorLimitation) {
          suggestions.push("Add cast time or telegraph");
          suggestions.push("Reduce duration slightly");
          suggestions.push("Add immunity period after effect ends");
        }
        break;
        
      case 'utility':
        if (majorLimitation) {
          suggestions.push("Add significant preparation or ritual time");
          suggestions.push("Make effect have limited uses per day/rest");
          suggestions.push("Add material component cost");
        }
        
        if (moderateLimitation) {
          suggestions.push("Add concentration requirement to maintain");
          suggestions.push("Add environmental or situational requirements");
          suggestions.push("Make effect dispellable or counterable");
        }
        
        if (minorLimitation) {
          suggestions.push("Reduce duration or area of effect");
          suggestions.push("Add minor secondary resource cost");
          suggestions.push("Make effect less reliable in certain conditions");
        }
        break;
        
      case 'mobility':
        if (majorLimitation) {
          suggestions.push("Add significant cooldown after use");
          suggestions.push("Make destination restricted (e.g., must see it)");
          suggestions.push("Add vulnerability period after movement");
        }
        
        if (moderateLimitation) {
          suggestions.push("Reduce distance or speed multiplier");
          suggestions.push("Add momentum effect (can't stop immediately)");
          suggestions.push("Make movement interruptible");
        }
        
        if (minorLimitation) {
          suggestions.push("Add minor charge-up time");
          suggestions.push("Add minor secondary resource cost");
          suggestions.push("Prevent immediate reuse");
        }
        break;
        
      case 'defense':
        if (majorLimitation) {
          suggestions.push("Make defense specific to certain damage types");
          suggestions.push("Add concentration requirement to maintain");
          suggestions.push("Make defense breakable under certain conditions");
        }
        
        if (moderateLimitation) {
          suggestions.push("Reduce mobility while defense is active");
          suggestions.push("Make defense decay over time");
          suggestions.push("Add positioning requirement");
        }
        
        if (minorLimitation) {
          suggestions.push("Reduce duration slightly");
          suggestions.push("Add minor secondary resource cost");
          suggestions.push("Prevent stacking with similar effects");
        }
        break;
    }
    
    // Filter out duplicate suggestions
    const uniqueSuggestions = [...new Set(suggestions)];
    
    return {
      needsLimitations: uniqueSuggestions.length > 0,
      powerRatio: tierComparison.overallRatio,
      limitationSeverity: majorLimitation ? "major" : 
                          moderateLimitation ? "moderate" : 
                          minorLimitation ? "minor" : "none",
      spellType,
      suggestions: uniqueSuggestions
    };
  },
  
  /**
   * Suggest cooldown adjustments for balance
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {Object} Cooldown adjustment recommendations
   */
  suggestCooldownAdjustments: (spell, context = {}) => {
    // Compare spell against appropriate tier
    const tierComparison = COMPARATIVE_BALANCE.compareWithTier(spell, spell.level, context);
    
    // Get current cooldown
    const currentCooldown = spell.cooldown || {};
    const cooldownType = currentCooldown.type || 'none';
    const cooldownValue = currentCooldown.value || 0;
    
    // If balance is good, no adjustments needed
    if (!tierComparison.balanceAdjustmentNeeded) {
      return {
        adjustmentNeeded: false,
        currentCooldown: {
          type: cooldownType,
          value: cooldownValue
        },
        suggestions: ["No cooldown adjustments needed - spell is well-balanced"]
      };
    }
    
    // Determine direction and magnitude of adjustment
    const isOverpowered = tierComparison.overallRatio > 1.2;
    const isUnderpowered = tierComparison.overallRatio < 0.8;
    
    // Generate suggestions
    const suggestions = [];
    let adjustedCooldown = { ...currentCooldown };
    
    if (isOverpowered) {
      if (cooldownType === 'none') {
        // Suggest adding a cooldown
        const suggestedValue = Math.ceil(tierComparison.overallRatio * 2);
        adjustedCooldown = {
          type: 'turn_based',
          value: suggestedValue
        };
        
        suggestions.push(`Add a turn-based cooldown of ${suggestedValue} turns`);
      } else {
        // Increase existing cooldown
        const increaseFactor = Math.min(0.5, tierComparison.overallRatio - 1);
        let newValue;
        
        if (cooldownType === 'turn_based' || cooldownType === 'charge_based') {
          newValue = Math.ceil(cooldownValue * (1 + increaseFactor));
        } else if (cooldownType === 'real_time') {
          newValue = Math.ceil(cooldownValue * (1 + increaseFactor));
        } else {
          newValue = cooldownValue + 1;
        }
        
        adjustedCooldown.value = newValue;
        suggestions.push(`Increase ${formatCooldownType(cooldownType)} cooldown from ${cooldownValue} to ${newValue}`);
      }
      
      // For extremely powerful spells, suggest resource restrictions
      if (tierComparison.overallRatio > 1.8) {
        suggestions.push("Add resource limitations or per-day use restrictions");
      }
      
    } else if (isUnderpowered) {
      if (cooldownType === 'none') {
        // Already has no cooldown, suggest other improvements
        suggestions.push("No cooldown reduction possible - consider improving effects instead");
      } else {
        // Decrease existing cooldown
        const decreaseFactor = Math.min(0.4, 1 - tierComparison.overallRatio);
        let newValue;
        
        if (cooldownType === 'turn_based' || cooldownType === 'charge_based') {
          newValue = Math.max(1, Math.floor(cooldownValue * (1 - decreaseFactor)));
        } else if (cooldownType === 'real_time') {
          newValue = Math.max(1, Math.floor(cooldownValue * (1 - decreaseFactor)));
        } else {
          newValue = Math.max(1, cooldownValue - 1);
        }
        
        // If cooldown would be reduced to 1, suggest removing it
        if (newValue <= 1 && cooldownType === 'turn_based') {
          adjustedCooldown = { type: 'none', value: 0 };
          suggestions.push(`Remove cooldown entirely`);
        } else {
          adjustedCooldown.value = newValue;
          suggestions.push(`Decrease ${formatCooldownType(cooldownType)} cooldown from ${cooldownValue} to ${newValue}`);
        }
      }
      
      // For extremely weak spells with significant cooldowns, suggest changing cooldown type
      if (tierComparison.overallRatio < 0.5 && 
          (cooldownType === 'long_rest' || cooldownType === 'short_rest')) {
        suggestions.push("Consider changing to a less restrictive cooldown type");
      }
    }
    
    return {
      adjustmentNeeded: true,
      currentCooldown: {
        type: cooldownType,
        value: cooldownValue
      },
      suggestedCooldown: adjustedCooldown,
      powerRatio: tierComparison.overallRatio,
      isOverpowered,
      isUnderpowered,
      suggestions
    };
  },
  
  /**
   * Generate a comprehensive balance analysis and recommendations
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {Object} Complete balance analysis
   */
  generateBalanceReport: (spell, context = {}) => {
    // Get all adjustment recommendations
    const costAdjustments = POWER_ADJUSTMENT_RECOMMENDATIONS.suggestCostAdjustments(spell, context);
    const effectAdjustments = POWER_ADJUSTMENT_RECOMMENDATIONS.suggestEffectAdjustments(spell, context);
    const limitationSuggestions = POWER_ADJUSTMENT_RECOMMENDATIONS.suggestLimitationAdditions(spell, context);
    const cooldownAdjustments = POWER_ADJUSTMENT_RECOMMENDATIONS.suggestCooldownAdjustments(spell, context);
    
    // Get tier comparison for overall power assessment
    const tierComparison = COMPARATIVE_BALANCE.compareWithTier(spell, spell.level, context);
    
    // Calculate resource efficiency
    const efficiency = RESOURCE_EFFICIENCY_CALCULATORS.calculateCostEfficiency(spell, context);
    
    // Determine spell type
    const spellType = getSpellPrimaryType(spell);
    
    // Generate summary analysis
    const powerRatio = tierComparison.overallRatio;
    const balanceStatus = powerRatio > 1.2 ? "Overpowered" :
                          powerRatio < 0.8 ? "Underpowered" :
                          "Well-balanced";
    
    // Determine primary adjustment recommendation
    let primaryRecommendation = "No adjustments needed - spell is well-balanced";
    
    if (powerRatio > 1.2) {
      // Overpowered spell
      if (powerRatio > 1.5) {
        // Significantly overpowered - recommend multiple adjustments
        primaryRecommendation = "Significantly overpowered - needs multiple balance adjustments";
      } else {
        // Moderately overpowered - choose best adjustment method
        if (efficiency.primaryEfficiency > 1.3) {
          primaryRecommendation = "Increase resource cost to balance power";
        } else if (!spell.cooldown || spell.cooldown.type === 'none') {
          primaryRecommendation = "Add cooldown to balance power";
        } else {
          primaryRecommendation = "Reduce effect strength to balance power";
        }
      }
    } else if (powerRatio < 0.8) {
      // Underpowered spell
      if (powerRatio < 0.5) {
        // Significantly underpowered - recommend multiple adjustments
        primaryRecommendation = "Significantly underpowered - needs multiple balance adjustments";
      } else {
        // Moderately underpowered - choose best adjustment method
        if (efficiency.primaryEfficiency < 0.7) {
          primaryRecommendation = "Decrease resource cost to balance power";
        } else if (spell.cooldown && spell.cooldown.type !== 'none') {
          primaryRecommendation = "Reduce cooldown to balance power";
        } else {
          primaryRecommendation = "Increase effect strength to balance power";
        }
      }
    }
    
    // Compile all suggestions
    const allSuggestions = [
      ...(costAdjustments.adjustmentNeeded ? costAdjustments.suggestions : []),
      ...(effectAdjustments.adjustmentNeeded ? effectAdjustments.suggestions : []),
      ...(limitationSuggestions.needsLimitations ? limitationSuggestions.suggestions : []),
      ...(cooldownAdjustments.adjustmentNeeded ? cooldownAdjustments.suggestions : [])
    ];
    
    // Create prioritized recommendations (limit to top 5)
    const prioritizedSuggestions = [...new Set(allSuggestions)].slice(0, 5);
    
    return {
      spellName: spell.name,
      spellLevel: spell.level,
      spellType,
      balanceStatus,
      powerRatio,
      resourceEfficiency: efficiency,
      primaryRecommendation,
      prioritizedSuggestions,
      detailedAdjustments: {
        cost: costAdjustments,
        effect: effectAdjustments,
        limitations: limitationSuggestions,
        cooldown: cooldownAdjustments
      },
      metrics: tierComparison.metricComparisons
    };
  }
};

// =======================================================================
// BALANCE VISUALIZATION DATA GENERATORS
// =======================================================================

/**
 * Functions for generating data for balance visualizations
 */
export const BALANCE_VISUALIZATION_DATA = {
  /**
   * Generate data for radar chart of power aspects
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {Object} Radar chart data
   */
  generatePowerRadarData: (spell, context = {}) => {
    // Determine spell type
    const spellType = getSpellPrimaryType(spell);
    
    // Get metrics for the spell type
    const metrics = getMetricsForSpellType(spellType);
    
    // Calculate values for each metric
    const dataPoints = [];
    
    for (const [metricId, metric] of Object.entries(metrics)) {
      // Calculate value for spell
      const value = metric.calculate(spell, context);
      
      // Calculate baseline for this tier level
      const baselineValue = metric.targetBaseline(spell.level || 1);
      
      // Calculate ratio
      const ratio = baselineValue > 0 ? value / baselineValue : 0;
      
      // Add data point
      dataPoints.push({
        axis: metric.name,
        value: Math.max(0, Math.min(2, ratio)), // Normalize to 0-2 range
        rawValue: value,
        baseline: baselineValue
      });
    }
    
    return {
      chart: "radar",
      title: `Power Analysis: ${spell.name} (Level ${spell.level})`,
      data: dataPoints,
      maxValue: 2, // Max ratio shown on radar
      spellType,
      interpretation: interpretRadarData(dataPoints)
    };
  },
  
  /**
   * Generate data for resource efficiency curve
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {Object} Efficiency curve data
   */
  generateEfficiencyCurveData: (spell, context = {}) => {
    // Get base spell efficiency
    const baseEfficiency = RESOURCE_EFFICIENCY_CALCULATORS.calculateCostEfficiency(spell, context);
    
    // Generate data points for different resource costs
    const dataPoints = [];
    const originalCost = getSpellResourceCost(spell);
    
    // Calculate efficiency at different cost levels
    for (let costMultiplier = 0.5; costMultiplier <= 1.5; costMultiplier += 0.1) {
      const adjustedCost = Math.max(1, Math.round(originalCost * costMultiplier));
      
      // Clone spell with adjusted cost
      const adjustedSpell = {
        ...spell,
        resourceCost: adjustedCost
      };
      
      // Calculate efficiency
      const efficiency = RESOURCE_EFFICIENCY_CALCULATORS.calculateCostEfficiency(adjustedSpell, context);
      
      dataPoints.push({
        cost: adjustedCost,
        efficiency: efficiency.primaryEfficiency,
        costMultiplier,
        optimal: Math.abs(costMultiplier - 1) < 0.05 // Is this close to the original cost?
      });
    }
    
    // Find optimal cost
    const sortedByEfficiency = [...dataPoints].sort((a, b) => b.efficiency - a.efficiency);
    const optimalCostPoint = sortedByEfficiency[0];
    
    return {
      chart: "line",
      title: `Resource Efficiency: ${spell.name}`,
      data: dataPoints,
      xAxis: "cost",
      yAxis: "efficiency",
      spellType: getSpellPrimaryType(spell),
      currentCost: originalCost,
      currentEfficiency: baseEfficiency.primaryEfficiency,
      optimalCost: optimalCostPoint.cost,
      optimalEfficiency: optimalCostPoint.efficiency,
      resourceType: getSpellResourceType(spell)
    };
  },
  
  /**
   * Generate data for power scaling with level
   * @param {Object} spell - The spell to evaluate
   * @param {Object} context - Evaluation context
   * @returns {Object} Scaling curve data
   */
  generateScalingCurveData: (spell, context = {}) => {
    // Base level of the spell
    const baseLevel = spell.level || 1;
    
    // Generate data points for different levels
    const dataPoints = [];
    
    // Calculate power at different levels
    for (let level = baseLevel; level <= baseLevel + 10; level += 1) {
      // Create level-adjusted context
      const levelContext = {
        ...context,
        casterLevel: level,
        targetLevel: level
      };
      
      // Calculate power score
      const powerScore = calculateOverallPowerScore(spell, levelContext);
      
      // Compare against level baseline
      const tierComparison = COMPARATIVE_BALANCE.compareWithTier(spell, level, levelContext);
      
      dataPoints.push({
        level,
        powerScore,
        powerRatio: tierComparison.overallRatio,
        balanced: Math.abs(tierComparison.overallRatio - 1) <= 0.2
      });
    }
    
    // Analyze scaling trends
    const firstPoint = dataPoints[0];
    const lastPoint = dataPoints[dataPoints.length - 1];
    const scalingRatio = lastPoint.powerRatio / firstPoint.powerRatio;
    
    let scalingTrend;
    if (scalingRatio > 1.2) {
      scalingTrend = "Becomes more powerful at higher levels";
    } else if (scalingRatio < 0.8) {
      scalingTrend = "Becomes less effective at higher levels";
    } else {
      scalingTrend = "Scales appropriately with level";
    }
    
    return {
      chart: "line",
      title: `Level Scaling: ${spell.name}`,
      data: dataPoints,
      xAxis: "level",
      yAxis: "powerRatio",
      spellType: getSpellPrimaryType(spell),
      baseLevel,
      scalingTrend,
      scalingRatio
    };
  },
  
  /**
   * Generate data for comparison visualization
   * @param {Object} spell - The spell to evaluate
   * @param {Array} otherSpells - Other spells to compare against
   * @param {Object} context - Evaluation context
   * @returns {Object} Comparison visualization data
   */
  generateComparisonGraphData: (spell, otherSpells, context = {}) => {
    // Determine spell type
    const spellType = getSpellPrimaryType(spell);
    
    // Calculate power score for the main spell
    const mainSpellScore = calculateOverallPowerScore(spell, context);
    
    // Filter other spells to same type and similar level
    const comparableSpells = otherSpells.filter(s => 
      getSpellPrimaryType(s) === spellType &&
      Math.abs((s.level || 1) - (spell.level || 1)) <= 2
    );
    
    // Calculate power scores for comparable spells
    const comparisonData = comparableSpells.map(s => {
      const powerScore = calculateOverallPowerScore(s, context);
      return {
        name: s.name,
        level: s.level || 1,
        powerScore,
        isReference: s.id === spell.id,
        relativePower: powerScore / mainSpellScore
      };
    });
    
    // Sort by power score
    comparisonData.sort((a, b) => b.powerScore - a.powerScore);
    
    // Calculate percentile
    let percentile = 0;
    for (let i = 0; i < comparisonData.length; i++) {
      if (comparisonData[i].isReference) {
        percentile = 100 - Math.round((i / comparisonData.length) * 100);
        break;
      }
    }
    
    // Calculate comparison statistics
    const scoreValues = comparisonData.map(d => d.powerScore);
    const averageScore = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length;
    const maxScore = Math.max(...scoreValues);
    const minScore = Math.min(...scoreValues);
    
    return {
      chart: "bar",
      title: `Spell Comparison: ${spell.name} vs. Similar Spells`,
      data: comparisonData,
      xAxis: "name",
      yAxis: "powerScore",
      spellType,
      spellLevel: spell.level || 1,
      percentile,
      stats: {
        average: averageScore,
        max: maxScore,
        min: minScore,
        count: comparisonData.length
      },
      interpretation: interpretPercentile(percentile)
    };
  }
};

// =======================================================================
// SPECIALIZED BALANCE CALCULATORS
// =======================================================================

/**
 * Calculate efficiency of area of effect spells
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {Object} AoE efficiency analysis
 */
export function calculateAoEEfficiency(spell, context = {}) {
  // If not an area effect, return null
  if (!isAreaEffect(spell)) {
    return {
      isAreaEffect: false,
      message: "Spell is not an area effect"
    };
  }
  
  // Determine spell type
  const spellType = getSpellPrimaryType(spell);
  
  // Calculate expected targets
  const expectedTargets = getExpectedTargets(spell, context);
  
  // Calculate area size
  const areaInfo = getAreaInfo(spell);
  
  // Calculate efficiency based on spell type
  let primaryValue = 0;
  let valuePerTarget = 0;
  let totalValue = 0;
  let valueDescription = "";
  
  switch (spellType) {
    case 'damage':
      primaryValue = getSpellDamage(spell);
      valueDescription = "damage";
      break;
    case 'healing':
      primaryValue = getSpellHealing(spell);
      valueDescription = "healing";
      break;
    case 'control':
      primaryValue = CONTROL_METRICS.controlStrength.calculate(spell, context);
      valueDescription = "control power";
      break;
    case 'utility':
      primaryValue = UTILITY_METRICS.versatility.calculate(spell, context);
      valueDescription = "utility value";
      break;
    default:
      primaryValue = 1;
      valueDescription = "effect value";
  }
  
  // Calculate falloff effect if present
  const falloff = spell.aoeFalloff || 0;
  
  // Calculate value for each expected target
  totalValue = 0;
  
  for (let i = 0; i < expectedTargets; i++) {
    // Apply falloff for secondary targets
    valuePerTarget = primaryValue * Math.pow(1 - falloff, i);
    totalValue += valuePerTarget;
  }
  
  // Calculate resource efficiency
  const resourceCost = getSpellResourceCost(spell);
  const valuePerResource = totalValue / resourceCost;
  
  // Calculate efficiency vs. single target
  const singleTargetEfficiency = primaryValue / resourceCost;
  const efficiencyMultiplier = valuePerResource / singleTargetEfficiency;
  
  // Determine if AoE is worth it
  const isEfficient = efficiencyMultiplier > 1;
  
  // Calculate ideal target count for efficiency
  let idealTargets = 1;
  while (primaryValue * (1 + Math.pow(1 - falloff, idealTargets)) / resourceCost <= 
         valuePerResource) {
    idealTargets++;
  }
  
  return {
    isAreaEffect: true,
    areaType: areaInfo.type,
    areaSize: areaInfo.size,
    spellType,
    expectedTargets,
    primaryValue,
    totalValue,
    valueDescription,
    falloff,
    efficiencyMultiplier,
    valuePerResource,
    singleTargetEfficiency,
    isEfficient,
    idealTargets,
    breakEvenTargets: Math.ceil(1 / (1 - falloff)),
    interpretation: `This ${spellType} spell is ${isEfficient ? 'more' : 'less'} efficient as an AoE than single-target, reaching optimal efficiency at ${idealTargets} targets.`
  };
}

/**
 * Calculate efficiency of damage-over-time spells
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {Object} DoT efficiency analysis
 */
export function calculateDotEfficiency(spell, context = {}) {
  // Check if spell has DoT component
  if (!hasDamageOverTime(spell)) {
    return {
      hasDot: false,
      message: "Spell does not have damage over time component"
    };
  }
  
  // Calculate initial damage
  const initialDamage = spell.initialDamage || 0;
  
  // Calculate DoT parameters
  const tickDamage = spell.tickDamage || 0;
  const tickCount = spell.tickCount || 0;
  const tickInterval = spell.tickInterval || 1; // seconds between ticks
  
  // Calculate total damage
  const totalDoTDamage = tickDamage * tickCount;
  const totalDamage = initialDamage + totalDoTDamage;
  
  // Calculate duration
  const dotDuration = tickInterval * tickCount;
  
  // Calculate DPS
  const averageDPS = totalDamage / dotDuration;
  
  // Calculate resource efficiency
  const resourceCost = getSpellResourceCost(spell);
  const damagePerResource = totalDamage / resourceCost;
  
  // Calculate efficiency vs. direct damage
  // Use average direct damage spell of same level for comparison
  const expectedDirectDamage = (spell.level || 1) * 5; // Arbitrary baseline
  const directDamageEfficiency = expectedDirectDamage / resourceCost;
  const efficiencyMultiplier = damagePerResource / directDamageEfficiency;
  
  // DoT completion probability
  const dotCompletionProbability = calculateDotCompletionProbability(spell, context);
  
  // Adjusted efficiency considering probability of full completion
  const adjustedEfficiency = damagePerResource * dotCompletionProbability;
  
  // Calculate break-even point (how many ticks needed for DoT to outvalue direct damage)
  const breakEvenTicks = Math.ceil(
    (expectedDirectDamage - initialDamage) / tickDamage
  );
  
  return {
    hasDot: true,
    initialDamage,
    tickDamage,
    tickCount,
    tickInterval,
    totalDoTDamage,
    totalDamage,
    dotDuration,
    dotPercentageOfTotal: (totalDoTDamage / totalDamage) * 100,
    averageDPS,
    damagePerResource,
    efficiencyMultiplier,
    dotCompletionProbability,
    adjustedEfficiency,
    breakEvenTicks,
    isEfficient: adjustedEfficiency > directDamageEfficiency,
    interpretation: `This DoT spell ${adjustedEfficiency > directDamageEfficiency ? 'is' : 'is not'} efficient compared to direct damage, requiring ${breakEvenTicks} of ${tickCount} ticks to break even.`
  };
}

/**
 * Calculate value of crowd control effects
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {Object} Crowd control value analysis
 */
export function calculateCrowdControlValue(spell, context = {}) {
  // Check if spell has crowd control component
  if (!isControlSpell(spell)) {
    return {
      hasCrowdControl: false,
      message: "Spell does not have crowd control component"
    };
  }
  
  // Determine control type
  const controlType = getControlType(spell);
  
  // Calculate control strength
  const controlStrength = CONTROL_METRICS.controlStrength.calculate(spell, context);
  
  // Calculate control duration
  const controlDuration = CONTROL_METRICS.controlDuration.calculate(spell, context);
  
  // Calculate control reliability
  const controlReliability = CONTROL_METRICS.controlReliability.calculate(spell, context);
  
  // Calculate area control if applicable
  const areaControl = isAreaEffect(spell) ? 
    CONTROL_METRICS.areaControl.calculate(spell, context) : 0;
  
  // Calculate total control value
  const baseControlValue = controlStrength * controlDuration * controlReliability;
  const totalControlValue = areaControl > 0 ? 
    baseControlValue * getExpectedTargets(spell, context) : baseControlValue;
  
  // Calculate resource efficiency
  const resourceCost = getSpellResourceCost(spell);
  const controlPerResource = totalControlValue / resourceCost;
  
  // Check for diminishing returns
  const hasDiminishingReturns = spell.diminishingReturns || false;
  
  // Calculate effective value with diminishing returns
  const effectiveControlValue = hasDiminishingReturns ? 
    calculateDiminishedControlValue(totalControlValue, context) : totalControlValue;
  
  // Calculate counter interaction
  const counterInteraction = {
    breakOnDamage: spell.breaksOnDamage || false,
    immunityInteraction: spell.immunityInteraction || "blocked",
    resistanceImpact: spell.resistanceImpact || "reduced"
  };
  
  // Calculate tactical value
  const tacticalValue = calculateTacticalControlValue(spell, controlType, context);
  
  return {
    hasCrowdControl: true,
    controlType,
    controlStrength,
    controlDuration,
    controlReliability,
    isAreaControl: areaControl > 0,
    expectedTargets: isAreaEffect(spell) ? getExpectedTargets(spell, context) : 1,
    baseControlValue,
    totalControlValue,
    controlPerResource,
    hasDiminishingReturns,
    effectiveControlValue,
    counterInteraction,
    tacticalValue,
    tier: determineCrowdControlTier(effectiveControlValue),
    interpretation: `This ${controlType} effect provides ${determineCrowdControlTier(effectiveControlValue)} crowd control with ${controlReliability.toFixed(2) * 100}% reliability for ${controlDuration.toFixed(1)} seconds.`
  };
}

/**
 * Calculate value of buff effects
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {Object} Buff value analysis
 */
export function calculateBuffValue(spell, context = {}) {
  // Check if spell has buff component
  if (!isBuffSpell(spell)) {
    return {
      hasBuff: false,
      message: "Spell does not have buff component"
    };
  }
  
  // Determine buff type
  const buffTypes = getBuffTypes(spell);
  
  // Calculate buff values for each type
  const buffValues = {};
  let totalBuffValue = 0;
  
  buffTypes.forEach(buffType => {
    const buffEffectType = findBuffEffectById(buffType);
    
    if (buffEffectType) {
      // Calculate base value
      const baseValue = calculateBuffTypeValue(buffType, spell, context);
      
      // Calculate duration factor
      const duration = getSpellDuration(spell);
      const durationSeconds = durationToSeconds(duration);
      const durationFactor = Math.min(3, Math.log10(durationSeconds + 1) + 1);
      
      // Calculate number of targets
      const targetCount = getExpectedTargets(spell, context);
      
      // Calculate target value factor
      const targetFactor = Math.min(3, Math.log10(targetCount + 1) + 1);
      
      // Calculate total value for this buff type
      const buffValue = baseValue * durationFactor * targetFactor;
      
      // Add to total value
      totalBuffValue += buffValue;
      
      // Record values
      buffValues[buffType] = {
        baseValue,
        durationFactor,
        targetCount,
        targetFactor,
        buffValue
      };
    }
  });
  
  // Calculate resource efficiency
  const resourceCost = getSpellResourceCost(spell);
  const buffPerResource = totalBuffValue / resourceCost;
  
  // Calculate stacking potential
  const stackingPotential = calculateBuffStackingPotential(spell, context);
  
  // Calculate synergy value
  const synergyValue = calculateBuffSynergyValue(spell, context);
  
  // Calculate scaling value
  const scalingValue = calculateBuffScalingValue(spell, context);
  
  return {
    hasBuff: true,
    buffTypes,
    individualBuffValues: buffValues,
    totalBuffValue,
    buffPerResource,
    stackingPotential,
    synergyValue,
    scalingValue,
    targetCount: getExpectedTargets(spell, context),
    duration: durationToSeconds(getSpellDuration(spell)),
    tier: determineBuffTier(totalBuffValue),
    interpretation: `This buff provides ${determineBuffTier(totalBuffValue)} enhancement with ${Object.keys(buffValues).length} effect types and ${synergyValue.toFixed(1)} synergy value.`
  };
}

/**
 * Calculate value of reaction abilities
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {Object} Reaction value analysis
 */
export function calculateReactionValue(spell, context = {}) {
  // Check if spell is a reaction ability
  if (!isReactionSpell(spell)) {
    return {
      isReaction: false,
      message: "Spell is not a reaction ability"
    };
  }
  
  // Determine reaction trigger
  const triggerType = spell.triggerType || "unspecified";
  const triggerCondition = spell.triggerCondition || "unspecified";
  
  // Calculate trigger reliability
  const triggerReliability = calculateTriggerReliability(triggerType, triggerCondition, context);
  
  // Calculate reaction power
  const reactionPower = calculateReactionPower(spell, context);
  
  // Calculate opportunity cost
  const opportunityCost = calculateReactionOpportunityCost(spell, context);
  
  // Calculate reaction speed value
  const reactionSpeed = calculateReactionSpeed(spell, context);
  
  // Calculate reaction timing value
  const timingValue = calculateReactionTimingValue(spell, context);
  
  // Calculate total reaction value
  const totalReactionValue = 
    reactionPower * 
    triggerReliability * 
    reactionSpeed *
    timingValue / 
    (opportunityCost + 0.5);
  
  // Calculate resource efficiency
  const resourceCost = getSpellResourceCost(spell);
  const reactionPerResource = totalReactionValue / resourceCost;
  
  // Calculate comparative value vs. proactive spell
  const proactiveAlternativeValue = calculateProactiveAlternativeValue(spell, context);
  const relativeValue = totalReactionValue / proactiveAlternativeValue;
  
  return {
    isReaction: true,
    triggerType,
    triggerCondition,
    triggerReliability,
    reactionPower,
    opportunityCost,
    reactionSpeed,
    timingValue,
    totalReactionValue,
    reactionPerResource,
    proactiveAlternativeValue,
    relativeValue,
    tier: determineReactionTier(totalReactionValue),
    interpretation: `This ${triggerType} reaction provides ${determineReactionTier(totalReactionValue)} value with ${(triggerReliability * 100).toFixed(0)}% trigger reliability.`
  };
}

/**
 * Calculate value of abilities in combo systems
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {Object} Combo value analysis
 */
export function calculateComboValue(spell, context = {}) {
  // Check if spell has combo interactions
  const comboRole = getComboRole(spell);
  
  if (comboRole === "none") {
    return {
      hasComboValue: false,
      message: "Spell does not participate in combo systems"
    };
  }
  
  // Determine combo type
  const comboType = spell.comboType || "unspecified";
  
  // Calculate base value
  const baseValue = calculateSpellBaseValue(spell, context);
  
  // Calculate combo multiplier
  const comboMultiplier = calculateComboMultiplier(spell, comboRole, context);
  
  // Calculate position value
  const positionValue = calculateComboPositionValue(spell, comboRole, context);
  
  // Calculate setup/payoff value
  const setupPayoffValue = calculateComboSetupPayoffValue(spell, comboRole, context);
  
  // Calculate flexibility value
  const flexibilityValue = calculateComboFlexibilityValue(spell, context);
  
  // Calculate reliability
  const comboReliability = calculateComboReliability(spell, context);
  
  // Calculate total combo value
  const totalComboValue = 
    baseValue * 
    comboMultiplier * 
    positionValue * 
    setupPayoffValue * 
    flexibilityValue *
    comboReliability;
  
  // Calculate resource efficiency
  const resourceCost = getSpellResourceCost(spell);
  const comboPerResource = totalComboValue / resourceCost;
  
  // Calculate standalone value
  const standaloneValue = calculateStandaloneValue(spell, context);
  const comboAdvantage = totalComboValue / standaloneValue;
  
  return {
    hasComboValue: true,
    comboRole,
    comboType,
    baseValue,
    comboMultiplier,
    positionValue,
    setupPayoffValue,
    flexibilityValue,
    comboReliability,
    totalComboValue,
    comboPerResource,
    standaloneValue,
    comboAdvantage,
    tier: determineComboTier(totalComboValue),
    interpretation: `This ${comboRole} spell provides ${determineComboTier(totalComboValue)} value in ${comboType} combos with ${comboMultiplier.toFixed(2)}x multiplier.`
  };
}

// =======================================================================
// HELPER FUNCTIONS
// =======================================================================

/**
 * Format a duration object into a readable string
 * @param {Object} duration - Duration object
 * @returns {string} Formatted duration string
 */
function formatDuration(duration) {
  if (!duration) return 'Instant';
  
  if (duration.type === 'instant') return 'Instant';
  if (duration.type === 'concentration') return `Concentration (up to ${duration.value || 1} ${duration.unit || 'minute'}s)`;
  if (duration.type === 'permanent') return 'Permanent';
  
  return `${duration.value || 1} ${duration.unit || 'round'}${duration.value !== 1 ? 's' : ''}`;
}

/**
 * Find a buff effect by its ID
 * @param {string} id - Buff effect ID
 * @returns {Object} Buff effect object
 */
function findBuffEffectById(id) {
  if (!id) return null;
  
  // Search in positive status effects first
  const positiveEffect = POSITIVE_STATUS_EFFECTS.find(effect => effect.id === id);
  if (positiveEffect) return positiveEffect;
  
  // Then search in combat stat modifiers
  const statModifier = COMBAT_STAT_MODIFIERS.find(mod => mod.id === id);
  if (statModifier) return statModifier;
  
  // Return a default object if not found
  return { id, name: id, description: 'Unknown effect' };
}

/**
 * Check if a spell is a group healing spell
 * @param {Object} spell - The spell to evaluate
 * @returns {boolean} Whether it's a group healing spell
 */
function isGroupHealing(spell) {
  if (!spell || !spell.targetingConfig) return false;
  
  // Check if the targeting type is for multiple targets or area
  const targetingType = spell.targetingConfig.targetingType;
  return (targetingType === 'multi' || targetingType === 'aoe') && 
         spell.healingConfig && 
         spell.healingConfig.diceNotation;
}

/**
 * Get metrics relevant to a specific spell type
 * @param {string} spellType - Type of spell
 * @returns {Object} Relevant metrics
 */
function getMetricsForSpellType(spellType) {
  switch (spellType) {
    case 'damage':
      return DAMAGE_METRICS;
    case 'healing':
      return HEALING_METRICS;
    case 'control':
      return CONTROL_METRICS;
    case 'utility':
      return UTILITY_METRICS;
    case 'mobility':
      return MOBILITY_METRICS;
    case 'defense':
      return DEFENSE_METRICS;
    default:
      return DAMAGE_METRICS;
  }
}

/**
 * Get the primary type of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {string} Primary spell type
 */
function getSpellPrimaryType(spell) {
  // Check explicit type
  if (spell.primaryType) {
    return spell.primaryType;
  }
  
  // Determine by effects
  if (spell.damageAmount || spell.damageType) {
    return 'damage';
  }
  
  if (spell.healingAmount || spell.healingType) {
    return 'healing';
  }
  
  if (isControlSpell(spell)) {
    return 'control';
  }
  
  if (isMobilitySpell(spell)) {
    return 'mobility';
  }
  
  if (isDefensiveSpell(spell)) {
    return 'defense';
  }
  
  // Default to utility
  return 'utility';
}

/**
 * Check if a spell is a control spell
 * @param {Object} spell - The spell to evaluate
 * @returns {boolean} Whether it's a control spell
 */
function isControlSpell(spell) {
  return spell.controlType || 
         spell.controlEffect || 
         spell.controlDuration || 
         (spell.effectTypes && spell.effectTypes.includes('control'));
}

/**
 * Check if a spell is a mobility spell
 * @param {Object} spell - The spell to evaluate
 * @returns {boolean} Whether it's a mobility spell
 */
function isMobilitySpell(spell) {
  return spell.movementType || 
         spell.teleportDistance || 
         spell.speedMultiplier || 
         spell.movementDistance ||
         (spell.effectTypes && spell.effectTypes.includes('mobility'));
}

/**
 * Check if a spell is a defensive spell
 * @param {Object} spell - The spell to evaluate
 * @returns {boolean} Whether it's a defensive spell
 */
function isDefensiveSpell(spell) {
  return spell.absorptionAmount || 
         spell.damageReductionPercent || 
         spell.flatDamageReduction ||
         (spell.effectTypes && spell.effectTypes.includes('defense'));
}

/**
 * Check if a spell is a buff spell
 * @param {Object} spell - The spell to evaluate
 * @returns {boolean} Whether it's a buff spell
 */
function isBuffSpell(spell) {
  return spell.buffTypes || 
         spell.buffEffect || 
         (spell.effectTypes && spell.effectTypes.includes('buff'));
}

/**
 * Check if a spell is a reaction spell
 * @param {Object} spell - The spell to evaluate
 * @returns {boolean} Whether it's a reaction spell
 */
function isReactionSpell(spell) {
  return spell.isReaction || 
         spell.triggerType || 
         spell.triggerCondition ||
         (spell.effectTypes && spell.effectTypes.includes('reaction'));
}

/**
 * Get the buff types of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {Array} Buff types
 */
function getBuffTypes(spell) {
  if (spell.buffTypes) {
    return Array.isArray(spell.buffTypes) ? spell.buffTypes : [spell.buffTypes];
  }
  
  return [];
}

/**
 * Get the control type of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {string} Control type
 */
function getControlType(spell) {
  return spell.controlType || 'unspecified';
}

/**
 * Get the utility type of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {string} Utility type
 */
function getUtilityType(spell) {
  return spell.utilityType || 'unspecified';
}

/**
 * Get the combo role of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {string} Combo role
 */
function getComboRole(spell) {
  return spell.comboRole || 
         (spell.comboPoint ? "builder" : 
          spell.comboConsumer ? "spender" : 
          spell.comboSetup ? "setup" : 
          spell.comboFinisher ? "finisher" : "none");
}

/**
 * Check if a spell has damage over time component
 * @param {Object} spell - The spell to evaluate
 * @returns {boolean} Whether it has DoT
 */
function hasDamageOverTime(spell) {
  return spell.tickDamage || 
         spell.tickCount || 
         spell.damageOverTime ||
         (spell.effectTypes && spell.effectTypes.includes('dot'));
}

/**
 * Check if a spell is an area effect
 * @param {Object} spell - The spell to evaluate
 * @returns {boolean} Whether it's an area effect
 */
function isAreaEffect(spell) {
  return spell.targetingType === 'area' || 
         spell.areaOfEffect || 
         spell.radius ||
         spell.targetingType === 'cone' ||
         spell.targetingType === 'line';
}

/**
 * Get information about an area effect
 * @param {Object} spell - The spell to evaluate
 * @returns {Object} Area information
 */
function getAreaInfo(spell) {
  if (!isAreaEffect(spell)) {
    return { type: 'none', size: 0 };
  }
  
  if (spell.areaShape) {
    return {
      type: spell.areaShape,
      size: spell.areaSize || spell.radius || 10
    };
  }
  
  if (spell.radius) {
    return {
      type: 'circle',
      size: spell.radius
    };
  }
  
  if (spell.targetingType === 'cone') {
    return {
      type: 'cone',
      size: spell.coneLength || 15,
      angle: spell.coneAngle || 90
    };
  }
  
  if (spell.targetingType === 'line') {
    return {
      type: 'line',
      size: spell.lineLength || 30,
      width: spell.lineWidth || 5
    };
  }
  
  return {
    type: 'circle',
    size: 10
  };
}

/**
 * Get the expected number of targets for an area effect
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Expected number of targets
 */
function getExpectedTargets(spell, context = {}) {
  // If not an area effect, return 1
  if (!isAreaEffect(spell) && spell.targetingType !== 'multi') {
    return 1;
  }
  
  // If explicitly specified, use that
  if (spell.expectedTargets) {
    return spell.expectedTargets;
  }
  
  // Calculate from area and context
  const areaInfo = getAreaInfo(spell);
  
  // Default creature density
  const creatureDensity = context.creatureDensity || 0.01; // creatures per square foot
  
  // Calculate area
  let area = 0;
  
  switch (areaInfo.type) {
    case 'circle':
      area = Math.PI * Math.pow(areaInfo.size, 2);
      break;
    case 'cone':
      // Approximate cone area
      area = (Math.PI * Math.pow(areaInfo.size, 2) * (areaInfo.angle / 360));
      break;
    case 'line':
      area = areaInfo.size * (areaInfo.width || 5);
      break;
    case 'square':
    case 'cube':
      area = Math.pow(areaInfo.size, 2);
      break;
    default:
      // Default to circle
      area = Math.PI * Math.pow(10, 2);
  }
  
  // Calculate expected targets
  const rawTargets = area * creatureDensity;
  const adjustedTargets = Math.max(1, rawTargets);
  
  // Cap at reasonable amount
  return Math.min(10, Math.ceil(adjustedTargets));
}

/**
 * Get the total damage of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {number} Total damage
 */
function getSpellDamage(spell) {
  let totalDamage = 0;
  
  // Direct damage
  if (spell.damageAmount) {
    totalDamage += spell.damageAmount;
  }
  
  // Initial damage for DoT
  if (spell.initialDamage) {
    totalDamage += spell.initialDamage;
  }
  
  // Damage over time
  if (spell.tickDamage && spell.tickCount) {
    totalDamage += spell.tickDamage * spell.tickCount;
  }
  
  // Additional damage effects
  if (spell.additionalDamage) {
    totalDamage += spell.additionalDamage;
  }
  
  // If no damage found but spell is damage type, use level-based calculation
  if (totalDamage === 0 && getSpellPrimaryType(spell) === 'damage') {
    totalDamage = (spell.level || 1) * 5; // Arbitrary baseline
  }
  
  return totalDamage;
}

/**
 * Get the total healing of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {number} Total healing
 */
function getSpellHealing(spell) {
  let totalHealing = 0;
  
  // Direct healing
  if (spell.healingAmount) {
    totalHealing += spell.healingAmount;
  }
  
  // Initial healing for HoT
  if (spell.initialHealing) {
    totalHealing += spell.initialHealing;
  }
  
  // Healing over time
  if (spell.tickHealing && spell.tickCount) {
    totalHealing += spell.tickHealing * spell.tickCount;
  }
  
  // Additional healing effects
  if (spell.additionalHealing) {
    totalHealing += spell.additionalHealing;
  }
  
  // If no healing found but spell is healing type, use level-based calculation
  if (totalHealing === 0 && getSpellPrimaryType(spell) === 'healing') {
    totalHealing = (spell.level || 1) * 7; // Arbitrary baseline, slightly higher than damage
  }
  
  return totalHealing;
}

/**
 * Get the duration of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {Object} Duration object
 */
function getSpellDuration(spell) {
  if (spell.duration) {
    return spell.duration;
  }
  
  // If no duration specified, determine based on spell type
  const spellType = getSpellPrimaryType(spell);
  
  switch (spellType) {
    case 'damage':
      return { type: 'instant', amount: 0 };
    case 'healing':
      if (hasDamageOverTime(spell)) {
        return { type: 'rounds', amount: spell.tickCount || 3 };
      } else {
        return { type: 'instant', amount: 0 };
      }
    case 'control':
      return { type: 'rounds', amount: 2 };
    case 'utility':
      return { type: 'minutes', amount: 10 };
    case 'mobility':
      return { type: 'rounds', amount: 1 };
    case 'defense':
      return { type: 'rounds', amount: 3 };
    default:
      return { type: 'rounds', amount: 1 };
  }
}

/**
 * Convert duration to seconds
 * @param {Object} duration - Duration object
 * @returns {number} Duration in seconds
 */
function durationToSeconds(duration) {
  if (!duration) {
    return 0;
  }
  
  const type = duration.type || 'instant';
  const amount = duration.amount || 0;
  
  switch (type) {
    case 'instant':
      return 0;
    case 'rounds':
      return amount * 6; // 6 seconds per round
    case 'turns':
      return amount * 6; // 6 seconds per turn
    case 'minutes':
      return amount * 60;
    case 'hours':
      return amount * 3600;
    case 'concentration':
      return amount * 60; // Assume concentration duration in minutes
    case 'permanent':
      return 3600 * 24; // Use 24 hours as a cap for permanent effects
    default:
      return amount;
  }
}

/**
 * Get the cooldown time in seconds
 * @param {Object} spell - The spell to evaluate
 * @returns {number} Cooldown time in seconds
 */
function getCooldownTimeInSeconds(spell) {
  const cooldown = spell.cooldown || {};
  const cooldownType = cooldown.type || 'none';
  const cooldownValue = cooldown.value || 0;
  
  if (cooldownType === 'none') {
    return 6; // Default to 6 seconds (1 round) if no cooldown
  }
  
  switch (cooldownType) {
    case 'turn_based':
      return cooldownValue * 6; // 6 seconds per turn
    case 'short_rest':
      return 3600; // 1 hour
    case 'long_rest':
      return 28800; // 8 hours
    case 'real_time':
      return cooldownValue; // Already in seconds
    case 'charge_based':
      return cooldownValue * 6; // Approximation
    case 'encounter':
      return 300; // Approximation (5 minutes)
    default:
      return 6; // Default to 6 seconds
  }
}

/**
 * Get the resource cost of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {number} Resource cost
 */
function getSpellResourceCost(spell) {
  if (spell.resourceCost) {
    return spell.resourceCost;
  }
  
  // Default to level-based cost if not specified
  return Math.max(1, spell.level || 1);
}

/**
 * Get the resource type of a spell
 * @param {Object} spell - The spell to evaluate
 * @returns {string} Resource type
 */
function getSpellResourceType(spell) {
  return spell.resourceType || 'actionPoints';
}

/**
 * Calculate cooldown efficiency
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Cooldown efficiency
 */
function calculateCooldownEfficiency(spell, context = {}) {
  const cooldownTime = getCooldownTimeInSeconds(spell);
  
  // Benchmark cooldown is level * 6 seconds
  const benchmarkCooldown = (spell.level || 1) * 6;
  
  // Calculate efficiency (higher is better)
  if (cooldownTime === 0) {
    return 2; // No cooldown is very efficient
  }
  
  return benchmarkCooldown / cooldownTime;
}

/**
 * Calculate cast time efficiency
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Cast time efficiency
 */
function calculateCastTimeEfficiency(spell, context = {}) {
  const castTime = spell.castTime || 0;
  
  // Efficiency decreases with cast time
  return 1 / (1 + castTime * 0.5);
}

/**
 * Calculate overall power score
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Power score
 */
function calculateOverallPowerScore(spell, context = {}) {
  // Determine spell type
  const spellType = getSpellPrimaryType(spell);
  
  // Get metrics for the spell type
  const metrics = getMetricsForSpellType(spellType);
  
  // Calculate weighted average of metrics
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [metricId, metric] of Object.entries(metrics)) {
    // Calculate value for spell
    const value = metric.calculate(spell, context);
    
    // Calculate baseline for this tier level
    const baselineValue = metric.targetBaseline(spell.level || 1);
    
    // Calculate normalized score
    const normalizedScore = baselineValue > 0 ? 
      Math.min(2, value / baselineValue) : 0;
    
    // Add to weighted total
    totalScore += normalizedScore * metric.weight;
    totalWeight += metric.weight;
  }
  
  // Calculate final score
  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

/**
 * Check if two durations are similar
 * @param {Object} durationA - First duration
 * @param {Object} durationB - Second duration
 * @returns {boolean} Whether durations are similar
 */
function areDurationsSimilar(durationA, durationB) {
  // Convert both to seconds
  const secondsA = durationToSeconds(durationA);
  const secondsB = durationToSeconds(durationB);
  
  // Check if they're within 50% of each other
  return Math.abs(secondsA - secondsB) / Math.max(secondsA, secondsB) <= 0.5;
}

/**
 * Check if two cooldowns are similar
 * @param {Object} cooldownA - First cooldown
 * @param {Object} cooldownB - Second cooldown
 * @returns {boolean} Whether cooldowns are similar
 */
function areCooldownsSimilar(cooldownA, cooldownB) {
  // If types are different, they're not similar
  if (cooldownA?.type !== cooldownB?.type) {
    return false;
  }
  
  // If no cooldowns, they're similar
  if (!cooldownA?.type && !cooldownB?.type) {
    return true;
  }
  
  // Compare values
  const valueA = cooldownA?.value || 0;
  const valueB = cooldownB?.value || 0;
  
  // Check if they're within 50% of each other
  return Math.abs(valueA - valueB) / Math.max(valueA, valueB) <= 0.5;
}

/**
 * Interpret power ratio
 * @param {number} ratio - Power ratio
 * @returns {string} Interpretation
 */
function interpretPowerRatio(ratio) {
  if (ratio >= 1.5) return "Significantly overpowered";
  if (ratio >= 1.2) return "Somewhat overpowered";
  if (ratio <= 0.5) return "Significantly underpowered";
  if (ratio <= 0.8) return "Somewhat underpowered";
  return "Well-balanced";
}

/**
 * Interpret percentile ranking
 * @param {number} percentile - Percentile
 * @returns {string} Interpretation
 */
function interpretPercentile(percentile) {
  if (percentile >= 90) return "Top tier - among the most powerful options";
  if (percentile >= 75) return "Strong - above average power";
  if (percentile >= 40 && percentile <= 60) return "Balanced - average power level";
  if (percentile <= 25) return "Weak - below average power";
  if (percentile <= 10) return "Bottom tier - among the weakest options";
  return "Average power level";
}

/**
 * Interpret radar chart data
 * @param {Array} dataPoints - Radar chart data points
 * @returns {string} Interpretation
 */
function interpretRadarData(dataPoints) {
  // Find strongest and weakest aspects
  const sorted = [...dataPoints].sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  
  // Calculate average value
  const average = dataPoints.reduce((sum, point) => sum + point.value, 0) / dataPoints.length;
  
  // Generate interpretation
  let interpretation = "";
  
  if (average >= 1.2) {
    interpretation = "Overall above-average power with ";
  } else if (average <= 0.8) {
    interpretation = "Overall below-average power with ";
  } else {
    interpretation = "Balanced power profile with ";
  }
  
  interpretation += `strongest aspect in ${strongest.axis} (${(strongest.value * 100).toFixed(0)}% of baseline) `;
  interpretation += `and weakest in ${weakest.axis} (${(weakest.value * 100).toFixed(0)}% of baseline).`;
  
  return interpretation;
}

/**
 * Format cooldown type for display
 * @param {string} cooldownType - Cooldown type
 * @returns {string} Formatted cooldown type
 */
function formatCooldownType(cooldownType) {
  switch (cooldownType) {
    case 'turn_based':
      return 'turn-based';
    case 'short_rest':
      return 'short rest';
    case 'long_rest':
      return 'long rest';
    case 'real_time':
      return 'real-time';
    case 'charge_based':
      return 'charge';
    case 'encounter':
      return 'encounter';
    default:
      return cooldownType;
  }
}

/**
 * Get tier name based on level
 * @param {number} level - Spell level
 * @returns {string} Tier name
 */
function getTierName(level) {
  if (level <= 3) return "Apprentice";
  if (level <= 6) return "Adept";
  if (level <= 9) return "Expert";
  if (level <= 12) return "Master";
  return "Archmage";
}

/**
 * Calculate buff stacking potential
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Stacking potential
 */
function calculateBuffStackingPotential(spell, context = {}) {
  // Default to moderate stacking potential
  let stackingPotential = 1.0;
  
  // Check for explicit stacking data
  if (spell.stackingPotential !== undefined) {
    return spell.stackingPotential;
  }
  
  // Check for buff types that typically stack well
  const buffTypes = getBuffTypes(spell);
  
  for (const buffType of buffTypes) {
    if (buffType === 'statBuff' || buffType === 'damageIncrease') {
      stackingPotential += 0.3;
    } else if (buffType === 'auraEffect' || buffType === 'statusEffectBuff') {
      stackingPotential += 0.2;
    }
  }
  
  return Math.min(2.0, stackingPotential);
}

/**
 * Calculate buff synergy value
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Synergy value
 */
function calculateBuffSynergyValue(spell, context = {}) {
  // Default to moderate synergy value
  let synergyValue = 1.0;
  
  // Check for explicit synergy data
  if (spell.synergyValue !== undefined) {
    return spell.synergyValue;
  }
  
  // Check for buff types that typically have good synergies
  const buffTypes = getBuffTypes(spell);
  
  for (const buffType of buffTypes) {
    if (buffType === 'criticalEnhancement' || buffType === 'specialAbility') {
      synergyValue += 0.4;
    } else if (buffType === 'damageIncrease' || buffType === 'resourceRegen') {
      synergyValue += 0.3;
    }
  }
  
  return Math.min(2.0, synergyValue);
}

/**
 * Calculate buff scaling value
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Scaling value
 */
function calculateBuffScalingValue(spell, context = {}) {
  // Default to moderate scaling value
  let scalingValue = 1.0;
  
  // Check for explicit scaling data
  if (spell.scalingValue !== undefined) {
    return spell.scalingValue;
  }
  
  // Check for percentage-based buffs (scale better)
  if (spell.isPercentageBuff) {
    scalingValue += 0.5;
  }
  
  // Check for level scaling
  if (spell.scalesWithLevel) {
    scalingValue += 0.3;
  }
  
  return Math.min(2.0, scalingValue);
}

/**
 * Determine the buff tier
 * @param {number} buffValue - Buff value
 * @returns {string} Buff tier
 */
function determineBuffTier(buffValue) {
  if (buffValue >= 15) return "exceptional";
  if (buffValue >= 10) return "powerful";
  if (buffValue >= 5) return "solid";
  if (buffValue >= 3) return "modest";
  return "minor";
}

/**
 * Calculate DoT completion probability
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Completion probability
 */
function calculateDotCompletionProbability(spell, context = {}) {
  // Default base probability
  let baseProbability = 0.8;
  
  // Adjust based on context
  if (context.combatType === 'boss') {
    baseProbability = 0.9; // Boss fights tend to last longer
  } else if (context.combatType === 'aoe') {
    baseProbability = 0.7; // AoE combats often involve more movement
  }
  
  // Adjust based on duration
  const tickCount = spell.tickCount || 3;
  if (tickCount <= 2) {
    baseProbability += 0.1; // Short DoTs more likely to complete
  } else if (tickCount >= 6) {
    baseProbability -= 0.2; // Long DoTs less likely to complete fully
  }
  
  // Adjust for dispellable effects
  if (spell.isDispellable !== false) {
    baseProbability -= 0.1;
  }
  
  // Adjust for cleansable effects
  if (spell.isCleanable !== false) {
    baseProbability -= 0.05;
  }
  
  // Ensure probability is within bounds
  return Math.max(0.3, Math.min(1.0, baseProbability));
}

/**
 * Calculate diminished control value with diminishing returns
 * @param {number} baseValue - Base control value
 * @param {Object} context - Evaluation context
 * @returns {number} Diminished value
 */
function calculateDiminishedControlValue(baseValue, context = {}) {
  // Default diminishing returns formula reduces to 50% after 3 applications
  const diminishingFactor = context.diminishingFactor || 0.7;
  const applicationCount = context.applicationCount || 1;
  
  // Calculate diminished value
  return baseValue * Math.pow(diminishingFactor, applicationCount - 1);
}

/**
 * Calculate tactical control value
 * @param {Object} spell - The spell to evaluate
 * @param {string} controlType - Control type
 * @param {Object} context - Evaluation context
 * @returns {number} Tactical value
 */
function calculateTacticalControlValue(spell, controlType, context = {}) {
  // Base tactical value
  let tacticalValue = 1.0;
  
  // Adjust based on control type
  switch (controlType) {
    case 'stun':
      tacticalValue = 2.0;
      break;
    case 'root':
      tacticalValue = 1.5;
      break;
    case 'silence':
      tacticalValue = 1.8;
      break;
    case 'slow':
      tacticalValue = 1.2;
      break;
    case 'fear':
      tacticalValue = 1.7;
      break;
    case 'knockback':
      tacticalValue = 1.4;
      break;
    case 'disarm':
      tacticalValue = 1.6;
      break;
    default:
      tacticalValue = 1.0;
  }
  
  // Adjust based on combat context
  if (context.needsControl) {
    tacticalValue *= 1.5;
  }
  
  // Adjust based on target type
  if (context.targetType === 'caster' && (controlType === 'silence' || controlType === 'interrupt')) {
    tacticalValue *= 1.3;
  } else if (context.targetType === 'melee' && (controlType === 'root' || controlType === 'slow')) {
    tacticalValue *= 1.3;
  }
  
  return tacticalValue;
}

/**
 * Determine crowd control tier
 * @param {number} controlValue - Control value
 * @returns {string} Control tier
 */
function determineCrowdControlTier(controlValue) {
  if (controlValue >= 20) return "premium";
  if (controlValue >= 15) return "strong";
  if (controlValue >= 10) return "solid";
  if (controlValue >= 5) return "basic";
  return "minimal";
}

/**
 * Calculate trigger reliability
 * @param {string} triggerType - Trigger type
 * @param {string} triggerCondition - Trigger condition
 * @param {Object} context - Evaluation context
 * @returns {number} Trigger reliability
 */
function calculateTriggerReliability(triggerType, triggerCondition, context = {}) {
  // Base reliability depends on trigger type
  let reliability = 0.7; // Default moderate reliability
  
  switch (triggerType) {
    case 'damage':
      reliability = 0.9; // Very reliable in combat
      break;
    case 'criticalHit':
      reliability = 0.2; // Less reliable
      break;
    case 'statusEffect':
      reliability = 0.6; // Moderately reliable
      break;
    case 'healthThreshold':
      reliability = 0.8; // Fairly reliable
      break;
    case 'enemyAction':
      reliability = 0.5; // Depends on enemy
      break;
    case 'allyAction':
      reliability = 0.6; // Depends on coordination
      break;
    default:
      reliability = 0.7;
  }
  
  // Adjust based on context
  if (context.combatType === 'boss' && triggerType === 'damage') {
    reliability += 0.1; // More likely to take damage in boss fights
  }
  
  // Adjust for specific conditions
  if (triggerCondition && triggerCondition.includes('rare')) {
    reliability *= 0.5;
  } else if (triggerCondition && triggerCondition.includes('common')) {
    reliability *= 1.5;
  }
  
  // Ensure within bounds
  return Math.max(0.1, Math.min(1.0, reliability));
}

/**
 * Calculate reaction power
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Reaction power
 */
function calculateReactionPower(spell, context = {}) {
  // Base power is determined by spell type
  const spellType = getSpellPrimaryType(spell);
  
  switch (spellType) {
    case 'damage':
      return getSpellDamage(spell) * 1.2; // Reactions get 20% bonus
    case 'healing':
      return getSpellHealing(spell) * 1.2;
    case 'control':
      return CONTROL_METRICS.controlStrength.calculate(spell, context) * 1.2;
    case 'defense':
      const absorption = spell.absorptionAmount || 0;
      const reduction = (spell.damageReductionPercent || 0) * 0.2;
      return absorption + reduction * 10;
    default:
      return (spell.level || 1) * 3;
  }
}

/**
 * Calculate reaction opportunity cost
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Opportunity cost
 */
function calculateReactionOpportunityCost(spell, context = {}) {
  // Base opportunity cost
  let opportunityCost = 1.0;
  
  // If spell has explicit opportunity cost, use that
  if (spell.opportunityCost !== undefined) {
    return spell.opportunityCost;
  }
  
  // Resource cost increases opportunity cost
  const resourceCost = getSpellResourceCost(spell);
  opportunityCost += resourceCost * 0.1;
  
  // Cooldown increases opportunity cost
  const cooldown = spell.cooldown || {};
  if (cooldown.type === 'short_rest' || cooldown.type === 'long_rest') {
    opportunityCost += 0.5;
  } else if (cooldown.type === 'turn_based' && cooldown.value > 3) {
    opportunityCost += 0.3;
  }
  
  // Limited uses increases opportunity cost
  if (spell.limitedUses) {
    opportunityCost += 0.4;
  }
  
  return opportunityCost;
}

/**
 * Calculate reaction speed value
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Speed value
 */
function calculateReactionSpeed(spell, context = {}) {
  // Default moderate speed value
  let speedValue = 1.0;
  
  // Adjust based on trigger speed
  if (spell.triggerSpeed === 'instant') {
    speedValue = 1.5;
  } else if (spell.triggerSpeed === 'delayed') {
    speedValue = 0.7;
  }
  
  // Cast time reduces speed value
  const castTime = spell.castTime || 0;
  speedValue *= Math.max(0.5, 1 - (castTime * 0.3));
  
  return speedValue;
}

/**
 * Calculate reaction timing value
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Timing value
 */
function calculateReactionTimingValue(spell, context = {}) {
  // Default moderate timing value
  let timingValue = 1.0;
  
  // Adjust based on trigger timing
  if (spell.preemptive) {
    timingValue = 1.3; // Preemptive reactions are valuable
  } else if (spell.triggerTiming === 'after effect') {
    timingValue = 0.8; // After-effect reactions less valuable
  }
  
  // Adjust based on mitigation type
  if (spell.preventsDamage) {
    timingValue *= 1.2; // Preventing > mitigating
  }
  
  return timingValue;
}

/**
 * Calculate proactive alternative value
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Proactive value
 */
function calculateProactiveAlternativeValue(spell, context = {}) {
  // Calculate base value
  const baseValue = calculateSpellBaseValue(spell, context);
  
  // Proactive spells typically 20% more efficient than reactive
  return baseValue * 1.2;
}

/**
 * Calculate spell base value
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Base value
 */
function calculateSpellBaseValue(spell, context = {}) {
  const spellType = getSpellPrimaryType(spell);
  
  switch (spellType) {
    case 'damage':
      return getSpellDamage(spell);
    case 'healing':
      return getSpellHealing(spell);
    case 'control':
      return CONTROL_METRICS.controlStrength.calculate(spell, context) * 
             CONTROL_METRICS.controlDuration.calculate(spell, context);
    case 'utility':
      return UTILITY_METRICS.versatility.calculate(spell, context) * 3;
    case 'mobility':
      return MOBILITY_METRICS.distance.calculate(spell, context) * 0.2;
    case 'defense':
      return DEFENSE_METRICS.damageReduction.calculate(spell, context) * 0.3;
    default:
      return (spell.level || 1) * 3;
  }
}

/**
 * Calculate combo multiplier
 * @param {Object} spell - The spell to evaluate
 * @param {string} comboRole - Combo role
 * @param {Object} context - Evaluation context
 * @returns {number} Combo multiplier
 */
function calculateComboMultiplier(spell, comboRole, context = {}) {
  // Base multiplier by role
  let multiplier = 1.0;
  
  switch (comboRole) {
    case 'builder':
      multiplier = 0.8; // Builders typically weaker individually
      break;
    case 'spender':
      multiplier = 1.2; // Spenders typically stronger
      break;
    case 'setup':
      multiplier = 0.7; // Setup moves weaker individually
      break;
    case 'finisher':
      multiplier = 1.5; // Finishers strongest individually
      break;
    default:
      multiplier = 1.0;
  }
  
  // Adjust by combo point capacity
  const maxComboPoints = spell.maxComboPoints || context.maxComboPoints || 5;
  if (comboRole === 'spender' || comboRole === 'finisher') {
    multiplier *= Math.sqrt(maxComboPoints) / Math.sqrt(5); // Scale by sqrt of max points
  }
  
  return multiplier;
}

/**
 * Calculate combo position value
 * @param {Object} spell - The spell to evaluate
 * @param {string} comboRole - Combo role
 * @param {Object} context - Evaluation context
 * @returns {number} Position value
 */
function calculateComboPositionValue(spell, comboRole, context = {}) {
  // Base value by role
  let positionValue = 1.0;
  
  switch (comboRole) {
    case 'builder':
      // Builders better early
      positionValue = context.inCombatPhase === 'early' ? 1.3 : 0.9;
      break;
    case 'spender':
      // Spenders consistent
      positionValue = 1.1;
      break;
    case 'setup':
      // Setup better early/mid
      positionValue = context.inCombatPhase === 'late' ? 0.8 : 1.2;
      break;
    case 'finisher':
      // Finishers better late
      positionValue = context.inCombatPhase === 'late' ? 1.4 : 1.0;
      break;
    default:
      positionValue = 1.0;
  }
  
  return positionValue;
}

/**
 * Calculate combo setup/payoff value
 * @param {Object} spell - The spell to evaluate
 * @param {string} comboRole - Combo role
 * @param {Object} context - Evaluation context
 * @returns {number} Setup/payoff value
 */
function calculateComboSetupPayoffValue(spell, comboRole, context = {}) {
  // Different calculation based on role
  switch (comboRole) {
    case 'builder':
    case 'setup':
      // How many combo points generated or how strong the setup
      const pointsGenerated = spell.comboPointsGenerated || 1;
      const setupStrength = spell.setupStrength || 1;
      return Math.max(pointsGenerated, setupStrength);
      
    case 'spender':
    case 'finisher':
      // Scaling with combo points
      const pointScaling = spell.comboPointScaling || 1.0;
      return 1.0 + (pointScaling - 1.0) * 2;
      
    default:
      return 1.0;
  }
}

/**
 * Calculate combo flexibility value
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Flexibility value
 */
function calculateComboFlexibilityValue(spell, context = {}) {
  // Base flexibility
  let flexibility = 1.0;
  
  // Adjust for explicit flexibility
  if (spell.comboFlexibility !== undefined) {
    return spell.comboFlexibility;
  }
  
  // Adjust for standalone value
  if (spell.standaloneEfficiency) {
    flexibility += spell.standaloneEfficiency;
  }
  
  // Adjust for alternative uses
  if (spell.alternativeUses) {
    flexibility += 0.2 * spell.alternativeUses.length;
  }
  
  // Adjust for resources
  const resourceCost = getSpellResourceCost(spell);
  if (resourceCost <= 1) {
    flexibility += 0.2; // Low-cost spells more flexible
  }
  
  return Math.min(2.0, flexibility);
}

/**
 * Calculate combo reliability
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Reliability
 */
function calculateComboReliability(spell, context = {}) {
  // Base reliability
  let reliability = 0.9;
  
  // Adjust for explicit reliability
  if (spell.comboReliability !== undefined) {
    return spell.comboReliability;
  }
  
  // Adjust for hit chance
  const hitChance = spell.hitChance || 0.9;
  reliability *= hitChance;
  
  // Adjust for conditional requirements
  if (spell.conditionalRequirements) {
    reliability *= 0.8;
  }
  
  // Adjust for timing requirements
  if (spell.strictTimingRequired) {
    reliability *= 0.8;
  }
  
  return Math.max(0.5, reliability);
}

/**
 * Calculate standalone value outside of combos
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Standalone value
 */
function calculateStandaloneValue(spell, context = {}) {
  // Base value calculation
  const baseValue = calculateSpellBaseValue(spell, context);
  
  // Adjust based on combo role
  const comboRole = getComboRole(spell);
  
  switch (comboRole) {
    case 'builder':
      return baseValue * 0.8;
    case 'spender':
      return baseValue * 0.7;
    case 'setup':
      return baseValue * 0.6;
    case 'finisher':
      return baseValue * 0.5;
    default:
      return baseValue;
  }
}

/**
 * Determine combo tier
 * @param {number} comboValue - Combo value
 * @returns {string} Combo tier
 */
function determineComboTier(comboValue) {
  if (comboValue >= 20) return "exceptional";
  if (comboValue >= 15) return "powerful";
  if (comboValue >= 10) return "solid";
  if (comboValue >= 5) return "decent";
  return "minimal";
}

/**
 * Determine reaction tier
 * @param {number} reactionValue - Reaction value
 * @returns {string} Reaction tier
 */
function determineReactionTier(reactionValue) {
  if (reactionValue >= 25) return "exceptional";
  if (reactionValue >= 18) return "powerful";
  if (reactionValue >= 12) return "solid";
  if (reactionValue >= 7) return "decent";
  return "minimal";
}

/**
 * Calculate buff type value
 * @param {string} buffType - Buff type
 * @param {Object} spell - The spell to evaluate
 * @param {Object} context - Evaluation context
 * @returns {number} Buff type value
 */
function calculateBuffTypeValue(buffType, spell, context = {}) {
  // Get buff effect type
  const buffEffectType = findBuffEffectById(buffType);
  
  if (!buffEffectType) {
    return 1.0; // Default moderate value
  }
  
  // Different calculations based on buff type
  switch (buffType) {
    case 'statBuff':
      // Value based on stat increase amount
      const statAmount = spell.statAmount || 2;
      return statAmount * 0.5;
      
    case 'damageIncrease':
      // Value based on damage increase percentage
      const damageIncreasePercent = spell.damageIncreasePercent || 10;
      return damageIncreasePercent * 0.1;
      
    case 'resourceRegen':
      // Value based on regeneration amount
      const regenAmount = spell.regenAmount || 5;
      return regenAmount * 0.2;
      
    case 'movementBuff':
      // Value based on speed increase
      const speedIncrease = spell.speedIncrease || 30;
      return speedIncrease * 0.03;
      
    case 'statusEffectBuff':
      // Value based on status effect potency
      const statusPotency = spell.statusPotency || 2;
      return statusPotency;
      
    default:
      // Default value based on spell level
      return (spell.level || 1) * 0.5;
  }
}
