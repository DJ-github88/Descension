/**
 * Utility functions for handling status effects and their applications
 */

/**
 * Effect categories and their associated properties
 */
const EFFECT_CATEGORIES = {
    BUFF: 'buff',
    DEBUFF: 'debuff',
    CROWD_CONTROL: 'crowd_control',
    DAMAGE_OVER_TIME: 'dot',
    HEALING_OVER_TIME: 'hot',
    UTILITY: 'utility'
  };
  
  /**
   * Mapping of effect types to their categories
   */
  const EFFECT_TYPE_MAP = {
    // Buffs
    'strengthen': EFFECT_CATEGORIES.BUFF,
    'haste': EFFECT_CATEGORIES.BUFF,
    'shield': EFFECT_CATEGORIES.BUFF,
    'regeneration': EFFECT_CATEGORIES.BUFF,
    'invisibility': EFFECT_CATEGORIES.BUFF,
    'stealth': EFFECT_CATEGORIES.BUFF,
    'reflect': EFFECT_CATEGORIES.BUFF,
    'absorb': EFFECT_CATEGORIES.BUFF,
    
    // Debuffs
    'weaken': EFFECT_CATEGORIES.DEBUFF,
    'slow': EFFECT_CATEGORIES.DEBUFF,
    'vulnerability': EFFECT_CATEGORIES.DEBUFF,
    'disarm': EFFECT_CATEGORIES.DEBUFF,
    'silence': EFFECT_CATEGORIES.DEBUFF,
    
    // Crowd Control
    'stun': EFFECT_CATEGORIES.CROWD_CONTROL,
    'root': EFFECT_CATEGORIES.CROWD_CONTROL,
    'fear': EFFECT_CATEGORIES.CROWD_CONTROL,
    'sleep': EFFECT_CATEGORIES.CROWD_CONTROL,
    'charm': EFFECT_CATEGORIES.CROWD_CONTROL,
    'confuse': EFFECT_CATEGORIES.CROWD_CONTROL,
    'knockback': EFFECT_CATEGORIES.CROWD_CONTROL,
    'pull': EFFECT_CATEGORIES.CROWD_CONTROL,
    
    // DoTs
    'bleed': EFFECT_CATEGORIES.DAMAGE_OVER_TIME,
    'poison': EFFECT_CATEGORIES.DAMAGE_OVER_TIME,
    'burning': EFFECT_CATEGORIES.DAMAGE_OVER_TIME,
    'disease': EFFECT_CATEGORIES.DAMAGE_OVER_TIME,
    'decay': EFFECT_CATEGORIES.DAMAGE_OVER_TIME,
    
    // HoTs
    'rejuvenation': EFFECT_CATEGORIES.HEALING_OVER_TIME,
    'mend': EFFECT_CATEGORIES.HEALING_OVER_TIME,
    'restoration': EFFECT_CATEGORIES.HEALING_OVER_TIME,
    
    // Utility
    'detection': EFFECT_CATEGORIES.UTILITY,
    'waterbreathing': EFFECT_CATEGORIES.UTILITY,
    'waterwalking': EFFECT_CATEGORIES.UTILITY,
    'featherfall': EFFECT_CATEGORIES.UTILITY
  };
  
  /**
   * Get the category of an effect by its type
   * @param {string} effectType - The effect type id
   * @returns {string} The effect category
   */
  export const getEffectCategory = (effectType) => {
    return EFFECT_TYPE_MAP[effectType] || 'unknown';
  };
  
  /**
   * Check if effects are of opposing types (e.g. buff vs debuff)
   * @param {string} effectType1 - First effect type
   * @param {string} effectType2 - Second effect type
   * @returns {boolean} True if effects are opposing
   */
  export const areEffectsOpposing = (effectType1, effectType2) => {
    const category1 = getEffectCategory(effectType1);
    const category2 = getEffectCategory(effectType2);
    
    // Basic opposition check
    if (
      (category1 === EFFECT_CATEGORIES.BUFF && category2 === EFFECT_CATEGORIES.DEBUFF) ||
      (category1 === EFFECT_CATEGORIES.DEBUFF && category2 === EFFECT_CATEGORIES.BUFF)
    ) {
      return true;
    }
    
    // More specific oppositions can be added here
    const oppositions = {
      'haste': ['slow'],
      'strengthen': ['weaken'],
      'invisibility': ['detection'],
      'stealth': ['detection']
    };
    
    return (oppositions[effectType1] && oppositions[effectType1].includes(effectType2)) ||
           (oppositions[effectType2] && oppositions[effectType2].includes(effectType1));
  };
  
  /**
   * Get effects that are incompatible with a given effect
   * @param {string} effectType - The effect type to check against
   * @returns {Array} Array of incompatible effect types
   */
  export const getIncompatibleEffects = (effectType) => {
    // Some effects can't be applied with others
    const incompatibilities = {
      'stun': ['silence', 'disarm', 'root', 'fear', 'sleep', 'charm'], // Stun overrides these
      'sleep': ['stun', 'root', 'fear', 'silence'], // Sleep can't coexist with these
      'invisibility': ['stealth'], // Can't be invisible and stealthed
      'fear': ['charm', 'confuse', 'sleep'] // Can't be feared and charmed/confused/asleep
    };
    
    return incompatibilities[effectType] || [];
  };
  
  /**
   * Check if an effect can be stacked with itself
   * @param {string} effectType - The effect type
   * @returns {boolean} True if the effect can stack
   */
  export const canEffectStack = (effectType) => {
    // Effects that can have multiple stacks
    const stackableEffects = [
      'poison',
      'bleed',
      'burning',
      'strengthen',
      'weaken',
      'vulnerability'
    ];
    
    return stackableEffects.includes(effectType);
  };
  
  /**
   * Get the maximum stack count for an effect
   * @param {string} effectType - The effect type
   * @returns {number} Maximum stack count (0 = no limit)
   */
  export const getMaxStackCount = (effectType) => {
    const stackLimits = {
      'poison': 5,
      'bleed': 3,
      'burning': 3,
      'strengthen': 5,
      'weaken': 5,
      'vulnerability': 3
    };
    
    return stackLimits[effectType] || 1;
  };
  
  /**
   * Check if an effect breaks on damage
   * @param {string} effectType - The effect type
   * @returns {boolean} True if the effect breaks on damage
   */
  export const doesEffectBreakOnDamage = (effectType) => {
    const breaksOnDamage = [
      'sleep',
      'charm',
      'stealth',
      'invisibility'
    ];
    
    return breaksOnDamage.includes(effectType);
  };
  
  /**
   * Generate a description for an effect
   * @param {object} effect - The effect object with type, duration, etc.
   * @returns {string} Description of the effect
   */
  export const generateEffectDescription = (effect) => {
    if (!effect || !effect.type) return '';
    
    const effectDescriptions = {
      // Buffs
      'strengthen': () => `Increases strength by ${effect.value || 5}.`,
      'haste': () => `Increases attack and casting speed by ${effect.value || 10}%.`,
      'shield': () => `Absorbs up to ${effect.value || 100} damage.`,
      'regeneration': () => `Restores ${effect.value || 5}% of maximum health every 5 seconds.`,
      'invisibility': () => `Makes the target invisible to enemies. Breaks on dealing damage.`,
      'stealth': () => `Makes the target harder to detect. Breaks on dealing damage.`,
      'reflect': () => `Reflects ${effect.value || 20}% of spell damage back to the caster.`,
      'absorb': () => `Absorbs the next ${effect.value || 1} harmful spell${effect.value > 1 ? 's' : ''}.`,
      
      // Debuffs
      'weaken': () => `Reduces strength by ${effect.value || 5}.`,
      'slow': () => `Reduces movement speed by ${effect.value || 30}%.`,
      'vulnerability': () => `Increases damage taken by ${effect.value || 15}%.`,
      'disarm': () => `Prevents the use of weapons.`,
      'silence': () => `Prevents the casting of spells.`,
      
      // Crowd Control
      'stun': () => `Prevents all actions.`,
      'root': () => `Prevents movement.`,
      'fear': () => `Causes the target to flee uncontrollably.`,
      'sleep': () => `Renders the target unconscious. Breaks on damage.`,
      'charm': () => `The target fights for you. Breaks on damage.`,
      'confuse': () => `The target attacks random targets.`,
      'knockback': () => `Knocks the target back ${effect.value || 10} feet.`,
      'pull': () => `Pulls the target toward the caster by ${effect.value || 10} feet.`,
      
      // DoTs
      'bleed': () => `Deals ${effect.value || 5} physical damage every second.`,
      'poison': () => `Deals ${effect.value || 5} poison damage every 3 seconds and reduces healing received by ${effect.secondaryValue || 20}%.`,
      'burning': () => `Deals ${effect.value || 8} fire damage every 2 seconds.`,
      'disease': () => `Deals ${effect.value || 3} disease damage every 3 seconds and reduces max health by ${effect.secondaryValue || 10}%.`,
      'decay': () => `Deals ${effect.value || 4} shadow damage every 2 seconds, increasing over time.`,
      
      // HoTs
      'rejuvenation': () => `Restores ${effect.value || 8} health every 2 seconds.`,
      'mend': () => `Restores ${effect.value || 15} health every 3 seconds.`,
      'restoration': () => `Restores ${effect.value || 5} health every second, increasing over time.`,
      
      // Utility
      'detection': () => `Reveals invisible and stealthed targets.`,
      'waterbreathing': () => `Allows breathing underwater.`,
      'waterwalking': () => `Allows walking on water.`,
      'featherfall': () => `Reduces falling damage by ${effect.value || 90}%.`
    };
    
    const descriptionFunction = effectDescriptions[effect.type];
    if (!descriptionFunction) return `Applies ${effect.type} effect.`;
    
    let description = descriptionFunction();
    
    // Add duration if applicable
    if (effect.duration) {
      description += ` Lasts ${effect.duration} ${effect.duration === 1 ? 'second' : 'seconds'}.`;
    }
    
    return description;
  };
  
  /**
   * Get the appropriate icon path for an effect
   * @param {string} effectType - The effect type
   * @returns {string} Path to the effect icon
   */
  export const getEffectIcon = (effectType) => {
    // These would be paths to your actual icons
    const iconPaths = {
      // Buffs
      'strengthen': '/icons/effects/strengthen.png',
      'haste': '/icons/effects/haste.png',
      'shield': '/icons/effects/shield.png',
      'regeneration': '/icons/effects/regeneration.png',
      'invisibility': '/icons/effects/invisibility.png',
      'stealth': '/icons/effects/stealth.png',
      'reflect': '/icons/effects/reflect.png',
      'absorb': '/icons/effects/absorb.png',
      
      // Debuffs
      'weaken': '/icons/effects/weaken.png',
      'slow': '/icons/effects/slow.png',
      'vulnerability': '/icons/effects/vulnerability.png',
      'disarm': '/icons/effects/disarm.png',
      'silence': '/icons/effects/silence.png',
      
      // Crowd Control
      'stun': '/icons/effects/stun.png',
      'root': '/icons/effects/root.png',
      'fear': '/icons/effects/fear.png',
      'sleep': '/icons/effects/sleep.png',
      'charm': '/icons/effects/charm.png',
      'confuse': '/icons/effects/confuse.png',
      'knockback': '/icons/effects/knockback.png',
      'pull': '/icons/effects/pull.png',
      
      // DoTs
      'bleed': '/icons/effects/bleed.png',
      'poison': '/icons/effects/poison.png',
      'burning': '/icons/effects/burning.png',
      'disease': '/icons/effects/disease.png',
      'decay': '/icons/effects/decay.png',
      
      // HoTs
      'rejuvenation': '/icons/effects/rejuvenation.png',
      'mend': '/icons/effects/mend.png',
      'restoration': '/icons/effects/restoration.png',
      
      // Utility
      'detection': '/icons/effects/detection.png',
      'waterbreathing': '/icons/effects/waterbreathing.png',
      'waterwalking': '/icons/effects/waterwalking.png',
      'featherfall': '/icons/effects/featherfall.png'
    };
    
    // Return default icon if not found
    return iconPaths[effectType] || '/icons/effects/default.png';
  };
  
  /**
   * Get appropriate color for an effect
   * @param {string} effectType - The effect type
   * @returns {string} Hex color code
   */
  export const getEffectColor = (effectType) => {
    const category = getEffectCategory(effectType);
    
    // Base colors by category
    const categoryColors = {
      [EFFECT_CATEGORIES.BUFF]: '#4CAF50',       // Green
      [EFFECT_CATEGORIES.DEBUFF]: '#F44336',     // Red
      [EFFECT_CATEGORIES.CROWD_CONTROL]: '#9C27B0', // Purple
      [EFFECT_CATEGORIES.DAMAGE_OVER_TIME]: '#FF9800', // Orange
      [EFFECT_CATEGORIES.HEALING_OVER_TIME]: '#2196F3', // Blue
      [EFFECT_CATEGORIES.UTILITY]: '#FFEB3B'     // Yellow
    };
    
    // Specific colors for certain effects
    const specificColors = {
      'burning': '#FF5722',  // Deep orange
      'poison': '#8BC34A',   // Light green
      'bleed': '#B71C1C',    // Dark red
      'stun': '#7B1FA2',     // Purple
      'fear': '#6A1B9A',     // Deep purple
      'haste': '#00BCD4',    // Cyan
      'sleep': '#3F51B5',    // Indigo
      'invisibility': '#80DEEA', // Light blue
      'detection': '#FFECB3'  // Light amber
    };
    
    return specificColors[effectType] || categoryColors[category] || '#9E9E9E'; // Grey default
  };
  
  /**
   * Check if an effect grants immunity to another effect
   * @param {string} effectType - The effect to check for immunity
   * @param {Array} existingEffects - Currently applied effects
   * @returns {boolean} True if immune
   */
  export const isImmuneToEffect = (effectType, existingEffects = []) => {
    // Immunity map: what effects grant immunity to what
    const immunityMap = {
      'shield': ['knockback', 'pull'],
      'stun': ['sleep', 'fear', 'charm', 'confuse'],
      'waterbreathing': ['drowning']
    };
    
    // Check if any existing effects grant immunity
    for (const existing of existingEffects) {
      const immunities = immunityMap[existing.type] || [];
      if (immunities.includes(effectType)) {
        return true;
      }
    }
    
    return false;
  };
  
  /**
   * Determine if applying an effect would replace or merge with existing effects
   * @param {object} newEffect - The effect being applied
   * @param {Array} existingEffects - Currently applied effects
   * @returns {object} How the effect should be applied
   */
  export const determineEffectApplication = (newEffect, existingEffects = []) => {
    // Find matching effects
    const matchingEffects = existingEffects.filter(e => e.type === newEffect.type);
    
    // No existing effect of this type
    if (matchingEffects.length === 0) {
      return { action: 'add', effect: newEffect };
    }
    
    // If effect doesn't stack, replace if more powerful or longer duration
    if (!canEffectStack(newEffect.type)) {
      const existing = matchingEffects[0];
      
      // Replace if new effect is stronger or has longer duration
      if (
        (newEffect.value && existing.value && newEffect.value > existing.value) ||
        (newEffect.duration && existing.duration && newEffect.duration > existing.duration)
      ) {
        return { action: 'replace', effect: newEffect, replaceId: existing.id };
      }
      
      // If new effect is weaker, ignore it
      return { action: 'ignore' };
    }
    
    // Effect can stack, but check max stacks
    const maxStacks = getMaxStackCount(newEffect.type);
    if (matchingEffects.length >= maxStacks) {
      // Find the weakest or shortest duration to replace
      let weakestIndex = 0;
      let weakestValue = Infinity;
      let shortestDuration = Infinity;
      
      matchingEffects.forEach((effect, index) => {
        if (effect.value && effect.value < weakestValue) {
          weakestValue = effect.value;
          weakestIndex = index;
        }
        
        if (effect.duration && effect.duration < shortestDuration) {
          shortestDuration = effect.duration;
          // Only update index if value wasn't smaller
          if (effect.value >= weakestValue) {
            weakestIndex = index;
          }
        }
      });
      
      return { 
        action: 'replace', 
        effect: newEffect, 
        replaceId: matchingEffects[weakestIndex].id 
      };
    }
    
    // Can add another stack
    return { action: 'add', effect: newEffect };
  };
  
  /**
   * Apply effect modifiers based on target resistances and other factors
   * @param {object} effect - The effect to modify
   * @param {object} target - The target receiving the effect
   * @param {object} source - The source applying the effect
   * @returns {object} The modified effect
   */
  export const applyEffectModifiers = (effect, target, source) => {
    if (!effect || !target) return effect;
    
    const modifiedEffect = { ...effect };
    
    // Apply resistance if target has it
    if (target.resistances && target.resistances[effect.type]) {
      const resistanceValue = target.resistances[effect.type];
      
      // Reduce duration
      if (modifiedEffect.duration) {
        modifiedEffect.duration = Math.max(1, Math.floor(modifiedEffect.duration * (1 - resistanceValue / 100)));
      }
      
      // Reduce value
      if (modifiedEffect.value) {
        modifiedEffect.value = Math.max(1, Math.floor(modifiedEffect.value * (1 - resistanceValue / 100)));
      }
    }
    
    // Apply source's effect power modifiers
    if (source && source.effectPowerBonus) {
      // Increase duration
      if (modifiedEffect.duration && source.effectPowerBonus.duration) {
        modifiedEffect.duration = Math.floor(modifiedEffect.duration * (1 + source.effectPowerBonus.duration / 100));
      }
      
      // Increase value
      if (modifiedEffect.value && source.effectPowerBonus.value) {
        modifiedEffect.value = Math.floor(modifiedEffect.value * (1 + source.effectPowerBonus.value / 100));
      }
    }
    
    return modifiedEffect;
  };
  
  /**
   * Get status effects by type
   * @param {string} categoryType - Effect category type
   * @returns {Array} Array of matching effect objects
   */
  export const getStatusEffectsByType = (categoryType) => {
    // If no category specified, return all effects
    if (!categoryType) {
      return Object.keys(EFFECT_TYPE_MAP).map(type => ({
        id: type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        description: generateEffectDescription({ type }),
        category: getEffectCategory(type),
        color: getEffectColor(type),
        icon: getEffectIcon(type)
      }));
    }
    
    // Filter by category
    return Object.keys(EFFECT_TYPE_MAP)
      .filter(type => getEffectCategory(type) === categoryType)
      .map(type => ({
        id: type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        description: generateEffectDescription({ type }),
        category: categoryType,
        color: getEffectColor(type),
        icon: getEffectIcon(type)
      }));
  };
  
  /**
   * Get all available status effects
   * @returns {Array} Array of all effect objects
   */
  export const getAllStatusEffects = () => {
    return getStatusEffectsByType();
  };
  
  /**
   * Calculate the tick interval for a DoT or HoT effect
   * @param {string} effectType - The effect type
   * @returns {number} Tick interval in seconds
   */
  export const getEffectTickInterval = (effectType) => {
    const intervals = {
      // DoTs
      'bleed': 1,
      'poison': 3,
      'burning': 2,
      'disease': 3,
      'decay': 2,
      
      // HoTs
      'rejuvenation': 2,
      'mend': 3,
      'restoration': 1,
      
      // Other periodic effects
      'regeneration': 5
    };
    
    return intervals[effectType] || 1; // Default to 1 second
  };
  
  /**
   * Determine if an effect gives the target a gameplay disadvantage
   * Used for deciding PvP trinket eligibility, etc.
   * @param {string} effectType - The effect type
   * @returns {boolean} True if the effect is considered a disadvantage
   */
  export const isDisadvantageEffect = (effectType) => {
    const disadvantageTypes = [
      // Crowd control
      'stun', 'root', 'fear', 'sleep', 'charm', 'confuse',
      
      // Movement impairment
      'slow', 'knockback', 'pull',
      
      // Action restriction
      'silence', 'disarm',
      
      // Stat debuffs
      'weaken', 'vulnerability'
    ];
    
    return disadvantageTypes.includes(effectType);
  };
