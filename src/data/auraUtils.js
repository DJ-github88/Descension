/**
 * Utility functions for aura range and effect calculations
 */

// Aura target types
export const AURA_TARGETS = {
    ALLIES: 'allies',
    ENEMIES: 'enemies',
    ALL: 'all',
    SELF: 'self',
    PARTY: 'party',
    RAID: 'raid'
  };
  
  // Aura shape types
  export const AURA_SHAPES = {
    CIRCLE: 'circle',
    CONE: 'cone',
    SQUARE: 'square',
    TOTEM: 'totem',    // Stationary at a point
    PERSONAL: 'personal', // Follows the caster
    PULSING: 'pulsing'  // Expands and contracts
  };
  
  // Aura effect types
  export const AURA_EFFECT_TYPES = {
    BUFF: 'buff',      // Applies positive effects to targets
    DEBUFF: 'debuff',  // Applies negative effects to targets
    DAMAGE: 'damage',  // Deals damage to targets
    HEALING: 'healing', // Heals targets
    CONTROL: 'control', // Controls or restricts targets
    VISUAL: 'visual'   // Only visual effects, no gameplay impact
  };
  
  /**
   * Generate a unique ID for an aura
   * @returns {string} Unique aura ID
   */
  export const generateAuraId = () => {
    return `aura_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };
  
  /**
   * Create a new aura effect
   * @param {string} name - Name of the aura
   * @param {Object} options - Aura options
   * @returns {Object} Aura object
   */
  export const createAura = (name, options = {}) => {
    return {
      id: options.id || generateAuraId(),
      name: name || 'Unnamed Aura',
      effect: options.effect || '',
      range: options.range || 10,
      shape: options.shape || AURA_SHAPES.CIRCLE,
      target: options.target || AURA_TARGETS.ALLIES,
      effectType: options.effectType || AURA_EFFECT_TYPES.BUFF,
      duration: options.duration || 0, // 0 = permanent or until dispelled
      tickRate: options.tickRate || 0, // How often the aura applies its effect (0 = constant)
      value: options.value || 0,       // Magnitude of the effect
      stacks: options.stacks || false, // Whether the aura can stack
      maxStacks: options.maxStacks || 1, // Maximum stacks if stacking
      icon: options.icon || null,
      visual: options.visual || null,
      sound: options.sound || null,
      attachToSource: options.attachToSource !== false, // Whether aura moves with source
      conditions: options.conditions || [], // Conditions for the aura to affect targets
      origin: null, // Position/entity the aura is anchored to, set when applied
      affectedEntities: [] // Entities currently affected, populated when applied
    };
  };
  
  /**
   * Check if a target is valid for an aura based on target type
   * @param {Object} aura - The aura being checked
   * @param {Object} source - The source of the aura
   * @param {Object} target - The potential target
   * @returns {boolean} True if the target is valid for this aura
   */
  export const isValidAuraTarget = (aura, source, target) => {
    if (!aura || !target) return false;
    
    // Handle relationship-based targeting
    switch (aura.target) {
      case AURA_TARGETS.SELF:
        return source && target.id === source.id;
        
      case AURA_TARGETS.ALLIES:
        return source && target.faction === source.faction;
        
      case AURA_TARGETS.ENEMIES:
        return source && target.faction !== source.faction;
        
      case AURA_TARGETS.ALL:
        return true;
        
      case AURA_TARGETS.PARTY:
        return source && source.party && target.party === source.party;
        
      case AURA_TARGETS.RAID:
        return source && source.raid && target.raid === source.raid;
        
      default:
        return false;
    }
  };
  
  /**
   * Check if an entity is in range of an aura
   * @param {Object} aura - The aura to check
   * @param {Object} entity - The entity to check
   * @returns {boolean} True if the entity is in range
   */
  export const isInAuraRange = (aura, entity) => {
    if (!aura || !entity || !aura.origin) return false;
    
    // Get positions
    const originPos = aura.attachToSource ? 
      (aura.origin.position || { x: 0, y: 0, z: 0 }) : 
      aura.origin.position || aura.origin;
      
    const targetPos = entity.position || { x: 0, y: 0, z: 0 };
    
    // Calculate distance
    const distance = calculateDistance3D(originPos, targetPos);
    
    // Check shape-specific range logic
    switch (aura.shape) {
      case AURA_SHAPES.CIRCLE:
        return distance <= aura.range;
        
      case AURA_SHAPES.SQUARE:
        // For square, use the maximum of x/y distance
        const deltaX = Math.abs(targetPos.x - originPos.x);
        const deltaY = Math.abs(targetPos.y - originPos.y);
        return Math.max(deltaX, deltaY) <= aura.range;
        
      case AURA_SHAPES.CONE:
        // Check if in cone based on distance and angle
        if (distance > aura.range) return false;
        
        // Calculate angle to target
        const angleToTarget = Math.atan2(
          targetPos.y - originPos.y,
          targetPos.x - originPos.x
        );
        
        // Get source facing angle (assumed to be in aura.origin.facing, in radians)
        const sourceFacing = aura.origin.facing || 0;
        
        // Get angle difference, normalize to [-π, π]
        let angleDiff = angleToTarget - sourceFacing;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        // Check if within cone angle (default 90 degrees = π/2 radians)
        const coneHalfAngle = (aura.coneAngle || Math.PI / 2) / 2;
        return Math.abs(angleDiff) <= coneHalfAngle;
        
      case AURA_SHAPES.TOTEM:
        return distance <= aura.range;
        
      case AURA_SHAPES.PERSONAL:
        // Personal auras always affect the source
        return entity.id === aura.origin.id;
        
      case AURA_SHAPES.PULSING:
        // For pulsing, calculate current radius based on time
        const now = Date.now();
        const elapsed = now - (aura.startTime || now);
        const cycleTime = aura.pulseRate || 2000; // Default 2 second cycle
        const pulseFactor = Math.abs(Math.sin(elapsed / cycleTime * Math.PI));
        const currentRadius = aura.range * pulseFactor;
        return distance <= currentRadius;
        
      default:
        return distance <= aura.range;
    }
  };
  
  /**
   * Calculate 3D distance between two points
   * @param {Object} pos1 - First position {x, y, z}
   * @param {Object} pos2 - Second position {x, y, z}
   * @returns {number} Distance between points
   */
  export const calculateDistance3D = (pos1, pos2) => {
    const dx = (pos2.x || 0) - (pos1.x || 0);
    const dy = (pos2.y || 0) - (pos1.y || 0);
    const dz = (pos2.z || 0) - (pos1.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };
  
  /**
   * Apply aura to eligible targets in range
   * @param {Object} aura - The aura being applied
   * @param {Object} source - The source of the aura
   * @param {Array} potentialTargets - All potential targets in the area
   * @returns {Object} Updated aura with affected entities
   */
  export const applyAuraToTargets = (aura, source, potentialTargets = []) => {
    if (!aura || !source) return aura;
    
    // Set aura origin
    const updatedAura = {
      ...aura,
      origin: source,
      startTime: aura.startTime || Date.now(),
      affectedEntities: []
    };
    
    // Find all valid targets in range
    potentialTargets.forEach(target => {
      if (isValidAuraTarget(updatedAura, source, target) && isInAuraRange(updatedAura, target)) {
        // Add to affected entities
        updatedAura.affectedEntities.push({
          id: target.id,
          entity: target,
          appliedAt: Date.now(),
          stacks: 1
        });
        
        // Apply initial effect to target (for implementation in game systems)
        // This would usually update the target's active effects/stats
      }
    });
    
    return updatedAura;
  };
  
  /**
   * Update aura affected targets based on movement or other changes
   * @param {Object} aura - The aura to update
   * @param {Array} potentialTargets - All potential targets in the area
   * @returns {Object} Updated aura with current affected entities
   */
  export const updateAuraTargets = (aura, potentialTargets = []) => {
    if (!aura || !aura.origin) return aura;
    
    const now = Date.now();
    const source = aura.origin;
    const updatedAura = { ...aura };
    
    // Create a new affected entities array
    updatedAura.affectedEntities = updatedAura.affectedEntities.filter(affected => {
      // Find the current entity
      const target = potentialTargets.find(t => t.id === affected.id);
      
      // Remove if entity no longer exists or is no longer in range or is no longer a valid target
      if (!target || !isValidAuraTarget(updatedAura, source, target) || !isInAuraRange(updatedAura, target)) {
        // Remove aura effect from target (for implementation in game systems)
        return false;
      }
      
      return true;
    });
    
    // Check for new entities in range
    potentialTargets.forEach(target => {
      // Skip if already affected
      if (updatedAura.affectedEntities.some(affected => affected.id === target.id)) {
        return;
      }
      
      // Add if now in range and a valid target
      if (isValidAuraTarget(updatedAura, source, target) && isInAuraRange(updatedAura, target)) {
        updatedAura.affectedEntities.push({
          id: target.id,
          entity: target,
          appliedAt: now,
          stacks: 1
        });
        
        // Apply effect to target (for implementation in game systems)
      }
    });
    
    return updatedAura;
  };
  
  /**
   * Process aura tick effects
   * @param {Object} aura - The aura to process
   * @returns {Object} Updated aura and effects to apply
   */
  export const processAuraTick = (aura) => {
    if (!aura || !aura.tickRate || aura.tickRate <= 0) {
      return { aura, effects: [] };
    }
    
    const now = Date.now();
    const updatedAura = { ...aura };
    const effects = [];
    
    // Check if it's time for a tick
    if (!updatedAura.lastTickTime || (now - updatedAura.lastTickTime) >= (updatedAura.tickRate * 1000)) {
      // Process tick for each affected entity
      updatedAura.affectedEntities.forEach(affected => {
        effects.push({
          targetId: affected.id,
          target: affected.entity,
          effect: updatedAura.effect,
          value: updatedAura.value,
          type: updatedAura.effectType
        });
      });
      
      // Update last tick time
      updatedAura.lastTickTime = now;
    }
    
    return { aura: updatedAura, effects };
  };
  
  /**
   * Remove an aura
   * @param {Object} aura - The aura to remove
   * @returns {Array} Effects to apply when aura is removed
   */
  export const removeAura = (aura) => {
    if (!aura) return [];
    
    const removalEffects = [];
    
    // Process removal for each affected entity
    aura.affectedEntities.forEach(affected => {
      removalEffects.push({
        targetId: affected.id,
        target: affected.entity,
        effect: `Remove ${aura.name}`,
        type: 'remove'
      });
    });
    
    return removalEffects;
  };
  
  /**
   * Generate a description for an aura
   * @param {Object} aura - The aura to describe
   * @returns {string} Human-readable description
   */
  export const generateAuraDescription = (aura) => {
    if (!aura) return '';
    
    // Build the description
    let description = `${aura.name}: ${aura.effect}`;
    
    // Add range
    description += ` (${aura.range} ft radius)`;
    
    // Add target type
    const targetDescriptions = {
      [AURA_TARGETS.ALLIES]: 'Affects allies',
      [AURA_TARGETS.ENEMIES]: 'Affects enemies',
      [AURA_TARGETS.ALL]: 'Affects everyone',
      [AURA_TARGETS.SELF]: 'Affects self only',
      [AURA_TARGETS.PARTY]: 'Affects party members',
      [AURA_TARGETS.RAID]: 'Affects raid members'
    };
    
    if (targetDescriptions[aura.target]) {
      description += `. ${targetDescriptions[aura.target]}.`;
    }
    
    // Add info about ticks if applicable
    if (aura.tickRate > 0) {
      description += ` Effect applies every ${aura.tickRate} ${aura.tickRate === 1 ? 'second' : 'seconds'}.`;
    }
    
    // Add duration if not permanent
    if (aura.duration > 0) {
      description += ` Lasts ${aura.duration} ${aura.duration === 1 ? 'second' : 'seconds'}.`;
    }
    
    return description;
  };
  
  /**
   * Check if an aura can stack on a target
   * @param {Object} aura - The aura to check
   * @param {Object} target - The target entity
   * @returns {boolean} True if aura can stack
   */
  export const canAuraStack = (aura, target) => {
    if (!aura || !target || !aura.stacks) return false;
    
    // Find the target's current stacks
    const targetAffection = aura.affectedEntities.find(affected => affected.id === target.id);
    if (!targetAffection) return true; // Not affected yet, so can "stack" (apply)
    
    // Check if below max stacks
    return targetAffection.stacks < aura.maxStacks;
  };
  
  /**
   * Add a stack to an aura on a target
   * @param {Object} aura - The aura to update
   * @param {Object} target - The target to add a stack to
   * @returns {Object} Updated aura
   */
  export const addAuraStack = (aura, target) => {
    if (!aura || !target || !aura.stacks) return aura;
    
    const updatedAura = { ...aura };
    const targetIndex = updatedAura.affectedEntities.findIndex(affected => affected.id === target.id);
    
    // Target not found or at max stacks
    if (targetIndex === -1) return updatedAura;
    
    // Get current affection
    const targetAffection = { ...updatedAura.affectedEntities[targetIndex] };
    
    // Check if at max stacks
    if (targetAffection.stacks >= updatedAura.maxStacks) return updatedAura;
    
    // Add stack
    targetAffection.stacks += 1;
    targetAffection.lastStackedAt = Date.now();
    
    // Update in array
    updatedAura.affectedEntities[targetIndex] = targetAffection;
    
    return updatedAura;
  };
  
  /**
   * Calculate the effective value of an aura for a target based on stacks
   * @param {Object} aura - The aura to calculate for
   * @param {Object} target - The target entity
   * @returns {number} Effective value
   */
  export const calculateAuraEffectiveValue = (aura, target) => {
    if (!aura || !target) return 0;
    
    // Get base value
    let value = aura.value || 0;
    
    // Find the target's current affection
    const targetAffection = aura.affectedEntities.find(affected => affected.id === target.id);
    if (!targetAffection) return 0; // Not affected
    
    // If stacking, multiply by stacks
    if (aura.stacks && targetAffection.stacks > 1) {
      value *= targetAffection.stacks;
    }
    
    return value;
  };
  
  /**
   * Find entities within an aura's area of effect
   * @param {Object} aura - The aura to check
   * @param {Array} entities - All entities to check
   * @returns {Array} Entities within the aura
   */
  export const findEntitiesInAura = (aura, entities = []) => {
    if (!aura || !aura.origin || !entities.length) return [];
    
    return entities.filter(entity => 
      isValidAuraTarget(aura, aura.origin, entity) && 
      isInAuraRange(aura, entity)
    );
  };
  
  /**
   * Validate an aura for completeness and consistency
   * @param {Object} aura - The aura to validate
   * @returns {Object} Validation result with status and errors
   */
  export const validateAura = (aura) => {
    const errors = [];
    
    if (!aura) {
      return { valid: false, errors: ['No aura provided'] };
    }
    
    // Check required fields
    if (!aura.name || aura.name.trim() === '') {
      errors.push('Aura name is required');
    }
    
    if (!aura.effect || aura.effect.trim() === '') {
      errors.push('Aura effect description is required');
    }
    
    // Validate shape
    if (!aura.shape) {
      errors.push('Aura shape is required');
    } else if (!Object.values(AURA_SHAPES).includes(aura.shape)) {
      errors.push(`Invalid aura shape: ${aura.shape}`);
    }
    
    // Validate target type
    if (!aura.target) {
      errors.push('Aura target type is required');
    } else if (!Object.values(AURA_TARGETS).includes(aura.target)) {
      errors.push(`Invalid aura target type: ${aura.target}`);
    }
    
    // Validate numeric fields
    if (typeof aura.range !== 'number' || aura.range <= 0) {
      errors.push('Aura range must be a positive number');
    }
    
    if (aura.duration !== undefined && (typeof aura.duration !== 'number' || aura.duration < 0)) {
      errors.push('Aura duration must be a non-negative number');
    }
    
    if (aura.tickRate !== undefined && (typeof aura.tickRate !== 'number' || aura.tickRate < 0)) {
      errors.push('Aura tick rate must be a non-negative number');
    }
    
    // Validate stacking
    if (aura.stacks) {
      if (typeof aura.maxStacks !== 'number' || aura.maxStacks <= 0) {
        errors.push('Aura max stacks must be a positive number');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Create a visual representation of an aura's shape
   * @param {Object} aura - The aura to visualize
   * @returns {Object} Visual representation data
   */
  export const createAuraVisualization = (aura) => {
    if (!aura) return null;
    
    // Basic visualization data
    const visualization = {
      type: aura.shape,
      radius: aura.range,
      position: aura.origin ? (aura.origin.position || { x: 0, y: 0, z: 0 }) : { x: 0, y: 0, z: 0 }
    };
    
    // Add shape-specific properties
    switch (aura.shape) {
      case AURA_SHAPES.CONE:
        visualization.angle = aura.coneAngle || Math.PI / 2; // Default 90 degrees
        visualization.facing = aura.origin ? (aura.origin.facing || 0) : 0;
        break;
        
      case AURA_SHAPES.SQUARE:
        visualization.width = aura.range * 2;
        visualization.height = aura.range * 2;
        break;
        
      case AURA_SHAPES.PULSING:
        visualization.minRadius = 0;
        visualization.maxRadius = aura.range;
        visualization.pulseRate = aura.pulseRate || 2000; // Default 2 second cycle
        break;
    }
    
    // Add color based on effect type
    const colorMap = {
      [AURA_EFFECT_TYPES.BUFF]: '#4CAF50',     // Green
      [AURA_EFFECT_TYPES.DEBUFF]: '#F44336',   // Red
      [AURA_EFFECT_TYPES.DAMAGE]: '#FF9800',   // Orange
      [AURA_EFFECT_TYPES.HEALING]: '#2196F3',  // Blue
      [AURA_EFFECT_TYPES.CONTROL]: '#9C27B0',  // Purple
      [AURA_EFFECT_TYPES.VISUAL]: '#FFEB3B'    // Yellow
    };
    
    visualization.color = colorMap[aura.effectType] || '#9E9E9E'; // Grey default
    
    // Add opacity
    visualization.opacity = 0.3;
    
    return visualization;
  };