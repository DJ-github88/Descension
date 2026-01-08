/**
 * Utility Types Module
 * 
 * Defines utility effect types, parameters, and utility functions
 * for non-combat spell effects.
 */

/**
 * Utility effect types for non-combat spell effects
 */
export const UTILITY_EFFECT_TYPES = [
    {
      id: 'movement',
      name: 'Movement',
      description: 'Affects movement capabilities of targets or the caster',
      icon: 'ability_rogue_sprint',
      actionPointCost: 2,
      subtypes: [
        {
          id: 'teleport',
          name: 'Teleport',
          description: 'Instantly move to a new location without traversing the intervening space',
          icon: 'spell_arcane_blink',
          parameters: ['distance', 'needsLineOfSight', 'takesOthers', 'otherTargets']
        },
        {
          id: 'flight',
          name: 'Flight',
          description: 'Grant the ability to fly through the air, ignoring ground-based obstacles',
          icon: 'ability_mount_flyingcarpet',
          parameters: ['flightSpeed', 'maxAltitude', 'flightType']
        },
        {
          id: 'speed',
          name: 'Speed Boost',
          description: 'Dramatically increase movement speed for rapid traversal',
          icon: 'ability_rogue_sprint',
          parameters: ['speedMultiplier', 'duration', 'affectsActionPoints']
        },
        {
          id: 'phasing',
          name: 'Phasing',
          description: 'Shift partially out of reality, allowing passage through solid objects',
          icon: 'spell_arcane_portalironforge',
          parameters: ['phasingDuration', 'canAttack', 'visibility']
        },
        {
          id: 'wallWalking',
          name: 'Wall Walking',
          description: 'Walk on vertical surfaces and ceilings',
          icon: 'ability_rogue_quickrecovery',
          parameters: ['duration', 'climbSpeed', 'canHang']
        }
      ]
    },
    {
      id: 'control',
      name: 'Control',
      description: 'Manipulates the battlefield by restricting or directing movement',
      icon: 'spell_frost_chainsofice',
      actionPointCost: 3,
      subtypes: [
        {
          id: 'pull',
          name: 'Pull',
          description: 'Force targets to move toward a specific location using magical force',
          icon: 'ability_druid_typhoon',
          parameters: ['pullDistance', 'allowSave', 'saveType', 'pullDealsDamage', 'pullDamage']
        },
        {
          id: 'push',
          name: 'Push',
          description: 'Forcefully move targets away from a central point or line',
          icon: 'ability_warrior_charge',
          parameters: ['pushDistance', 'allowSave', 'saveType', 'pushDealsDamage', 'pushDamage']
        },
        {
          id: 'barrier',
          name: 'Barrier',
          description: 'Create an impassable wall or dome that blocks movement and possibly attacks',
          icon: 'spell_holy_powerwordbarrier',
          parameters: ['barrierType', 'barrierSize', 'barrierMaterial', 'barrierHP', 'barrierDealsDamage', 'barrierDamage']
        },
        {
          id: 'gravity',
          name: 'Gravity Manipulation',
          description: 'Alter local gravity to impede movement or cause levitation',
          icon: 'spell_arcane_blast',
          parameters: ['gravityMultiplier', 'affectedArea', 'duration', 'damageOnFall']
        }
      ]
    },
    {
      id: 'environment',
      name: 'Environment',
      description: 'Alters the physical environment for tactical advantage',
      icon: 'spell_nature_earthquake',
      actionPointCost: 2,
      subtypes: [
        {
          id: 'terrain',
          name: 'Terrain Modification',
          description: 'Change the physical landscape by creating difficult terrain, pits, or elevated platforms',
          icon: 'spell_nature_earthquake',
          parameters: ['terrainType', 'areaShape', 'areaSize', 'heightDepth', 'duration']
        },
        {
          id: 'hazard',
          name: 'Hazard Creation',
          description: 'Create environmental hazards like fire, ice, acid pools, or electrical fields',
          icon: 'spell_fire_soulburn',
          parameters: ['hazardType', 'areaShape', 'areaSize', 'hazardDamage', 'hazardPersistent', 'hazardDuration']
        },
        {
          id: 'light',
          name: 'Light/Darkness',
          description: 'Manipulate ambient lighting to create illumination or magical darkness',
          icon: 'spell_holy_mindsooth',
          parameters: ['lightType', 'intensity', 'radius', 'duration', 'moves']
        },
        {
          id: 'weather',
          name: 'Weather Manipulation',
          description: 'Create localized weather effects like fog, rain, wind, or supernatural storms',
          icon: 'spell_frost_icestorm',
          parameters: ['weatherType', 'intensity', 'radius', 'duration', 'damaging']
        }
      ]
    },
    {
      id: 'illusion',
      name: 'Illusion',
      description: 'Creates deceptive sensory effects to mislead or distract',
      icon: 'spell_shadow_psychicscream',
      actionPointCost: 2,
      subtypes: [
        {
          id: 'visual',
          name: 'Visual Illusion',
          description: 'Create false visual images that can range from simple objects to complex scenes',
          icon: 'spell_shadow_mindtwisting',
          parameters: ['illusionType', 'complexity', 'size', 'movement', 'interactivity']
        },
        {
          id: 'sound',
          name: 'Sound Illusion',
          description: 'Generate illusory sounds from whispers to thunderous explosions',
          icon: 'spell_holy_excorcism',
          parameters: ['soundType', 'volume', 'complexity', 'duration', 'direction']
        },
        {
          id: 'complex',
          name: 'Complex Illusion',
          description: 'Create fully interactive illusions that affect multiple senses simultaneously',
          icon: 'spell_shadow_demoniccircleteleport',
          parameters: ['illusionComplexity', 'sensesCovered', 'interactive', 'believability', 'duration']
        },
        {
          id: 'disguise',
          name: 'Disguise/Mimicry',
          description: 'Alter appearance to mimic another creature or object convincingly',
          icon: 'ability_rogue_disguise',
          parameters: ['disguiseType', 'quality', 'duration', 'detectDC', 'voiceChange']
        }
      ]
    },
    {
      id: 'transformation',
      name: 'Transformation',
      description: 'Changes physical form or properties of targets',
      icon: 'spell_nature_elementalshields',
      actionPointCost: 3,
      subtypes: [
        {
          id: 'animal',
          name: 'Animal Form',
          description: 'Transform target into an animal with corresponding abilities and limitations',
          icon: 'ability_druid_catform',
          parameters: ['animalType', 'size', 'abilities', 'mentalCapacity', 'duration']
        },
        {
          id: 'element',
          name: 'Elemental Transformation',
          description: 'Convert physical form partially or wholly into elemental material like fire, stone, or water',
          icon: 'spell_fire_elemental_totem',
          parameters: ['elementType', 'transformPercent', 'elementalAbilities', 'vulnerabilities', 'duration']
        },
        {
          id: 'size',
          name: 'Size Alteration',
          description: 'Dramatically increase or decrease the size of the target',
          icon: 'spell_nature_wispsplode',
          parameters: ['sizeMultiplier', 'statChanges', 'massChange', 'duration', 'maxSize']
        },
        {
          id: 'object',
          name: 'Object Transformation',
          description: 'Transform target into an inanimate object temporarily',
          icon: 'inv_misc_statue_07',
          parameters: ['objectType', 'size', 'awareness', 'vulnerability', 'duration']
        },
        {
          id: 'phaseshift',
          name: 'Phase Shift',
          description: 'Shift target partially into another plane of existence',
          icon: 'spell_arcane_portalshattrath',
          parameters: ['phaseType', 'corporeality', 'visibility', 'interactivity', 'duration']
        }
      ]
    },
    {
      id: 'divination',
      name: 'Divination',
      description: 'Reveals hidden information or predicts future events',
      icon: 'spell_holy_mindvision',
      actionPointCost: 2,
      subtypes: [
        {
          id: 'detection',
          name: 'Detection',
          description: 'Sense the presence and location of specific entities, objects, or magical effects',
          icon: 'spell_holy_mindvision',
          parameters: ['detectionType', 'range', 'detail', 'duration', 'throughObstacles']
        },
        {
          id: 'scrying',
          name: 'Scrying',
          description: 'View distant locations or subjects remotely',
          icon: 'spell_shadow_demoniccirclesummon',
          parameters: ['scryRange', 'accuracy', 'sensorType', 'detection', 'duration']
        },
        {
          id: 'identification',
          name: 'Identification',
          description: 'Determine properties, history, or nature of objects, creatures, or magical effects',
          icon: 'spell_holy_dispelmagic',
          parameters: ['idComplexity', 'revealCurses', 'revealHistory', 'accuracy', 'detailLevel']
        },
        {
          id: 'prediction',
          name: 'Prediction',
          description: 'Glimpse possible future events or outcomes',
          icon: 'spell_holy_sealofjustice',
          parameters: ['predictionRange', 'accuracy', 'detail', 'alternatives', 'predictionWindow']
        },
        {
          id: 'truesight',
          name: 'Truesight',
          description: 'See through illusions, invisibility, and into other planes',
          icon: 'spell_shadow_detectinvisibility',
          parameters: ['truesightRange', 'planarVision', 'detectMagic', 'revealDisguises', 'duration']
        }
      ]
    },
    {
      id: 'conjuration',
      name: 'Conjuration',
      description: 'Summons creatures, objects, or materials from elsewhere',
      icon: 'spell_shadow_summoninfernal',
      actionPointCost: 4,
      subtypes: [
        {
          id: 'creature',
          name: 'Creature Summoning',
          description: 'Summon creatures to aid you in battle or perform tasks',
          icon: 'spell_shadow_summonvoidwalker',
          parameters: ['creatureType', 'creatureLevel', 'controlType', 'duration', 'number']
        },
        {
          id: 'object',
          name: 'Object Conjuration',
          description: 'Create non-magical items temporarily or permanently',
          icon: 'inv_misc_enggizmos_19',
          parameters: ['objectType', 'objectSize', 'complexity', 'permanence', 'quality']
        },
        {
          id: 'element',
          name: 'Elemental Conjuration',
          description: 'Create raw elemental materials like fire, water, or stone',
          icon: 'spell_fire_volcano',
          parameters: ['elementType', 'quantity', 'duration', 'intensity', 'control']
        },
        {
          id: 'portal',
          name: 'Portal Creation',
          description: 'Create gateways between locations or planes',
          icon: 'spell_arcane_portaldalaran',
          parameters: ['portalRange', 'destination', 'size', 'stability', 'duration']
        }
      ]
    },
    {
      id: 'enchantment',
      name: 'Enchantment',
      description: 'Imbues objects or creatures with magical properties',
      icon: 'spell_holy_greaterblessingofkings',
      actionPointCost: 3,
      subtypes: [
        {
          id: 'weapon',
          name: 'Weapon Enchantment',
          description: 'Grant magical properties to weapons',
          icon: 'inv_sword_04',
          parameters: ['enchantmentType', 'power', 'duration', 'charges', 'specialEffect']
        },
        {
          id: 'armor',
          name: 'Armor Enchantment',
          description: 'Grant magical properties to armor or clothing',
          icon: 'inv_chest_plate_raidpaladin_i_01',
          parameters: ['enchantmentType', 'power', 'duration', 'charges', 'specialEffect']
        },
        {
          id: 'item',
          name: 'Item Enchantment',
          description: 'Grant magical properties to ordinary items',
          icon: 'inv_jewelcrafting_gem_14',
          parameters: ['enchantmentType', 'power', 'duration', 'charges', 'specialEffect']
        },
        {
          id: 'sentience',
          name: 'Sentience Granting',
          description: 'Grant temporary awareness and intelligence to inanimate objects',
          icon: 'inv_misc_book_17',
          parameters: ['intelligence', 'personality', 'abilities', 'loyalty', 'duration']
        }
      ]
    }
  ];
  
  /**
   * Special utility parameters that define behavior of utility effects
   */
  export const UTILITY_PARAMETERS = {
    // Teleportation parameters
    teleport: {
      distance: { min: 5, max: 500, default: 30, unit: 'feet' },
      needsLineOfSight: { type: 'boolean', default: true, actionPointModifier: -1 },
      takesOthers: { type: 'boolean', default: false, actionPointModifier: 1 },
      otherTargets: { min: 1, max: 10, default: 1 }
    },
    
    // Flight parameters
    flight: {
      flightSpeed: { min: 5, max: 120, default: 30, unit: 'feet' },
      maxAltitude: { min: 5, max: 1000, default: 100, unit: 'feet' },
      flightType: { 
        options: ['winged', 'levitation', 'rocket', 'magical'],
        default: 'winged'
      }
    },
    
    // Barrier parameters
    barrier: {
      barrierType: { 
        options: ['wall', 'dome', 'cube', 'sphere'], 
        default: 'wall' 
      },
      barrierSize: { min: 5, max: 60, default: 15, unit: 'feet' },
      barrierMaterial: { 
        options: ['force', 'fire', 'ice', 'earth', 'water', 'necrotic'], 
        default: 'force' 
      },
      barrierHP: { min: 5, max: 200, default: 30 },
      barrierDealsDamage: { type: 'boolean', default: false, actionPointModifier: 1 },
      barrierDamage: { type: 'dice', default: '1d6' }
    },
    
    // Illusion parameters
    illusion: {
      illusionType: { 
        options: ['creature', 'object', 'scene', 'effect'], 
        default: 'object' 
      },
      complexity: { min: 1, max: 10, default: 5 },
      size: { min: 1, max: 60, default: 5, unit: 'feet' },
      movement: { type: 'boolean', default: false, actionPointModifier: 1 },
      interactivity: { min: 0, max: 10, default: 0, actionPointModifier: 0.5 },
      sensesCovered: { 
        options: ['sight', 'sound', 'smell', 'touch', 'taste', 'all'], 
        default: 'sight',
        multiple: true
      },
      believability: { min: 1, max: 20, default: 10 }
    },
    
    // Detection parameters
    detection: {
      detectionType: {
        options: ['magic', 'traps', 'enemies', 'undead', 'extraplanar', 'treasures', 'creatures'],
        default: 'magic'
      },
      range: { min: 10, max: 500, default: 60, unit: 'feet' },
      detail: { min: 1, max: 10, default: 5 },
      throughObstacles: { type: 'boolean', default: false, actionPointModifier: 2 }
    },
    
    // Transformation parameters
    transformation: {
      animalType: {
        options: ['wolf', 'bear', 'bird', 'fish', 'insect', 'reptile', 'custom'],
        default: 'wolf'
      },
      size: {
        options: ['tiny', 'small', 'medium', 'large', 'huge'],
        default: 'medium'
      },
      sizeMultiplier: { min: 0.1, max: 5, default: 1, unit: 'factor' },
      elementType: {
        options: ['fire', 'water', 'earth', 'air', 'shadow', 'light'],
        default: 'earth'
      },
      transformPercent: { min: 10, max: 100, default: 50, unit: 'percent' },
      duration: { min: 1, max: 60, default: 10, unit: 'minutes' }
    },
    
    // Weather parameters
    weather: {
      weatherType: {
        options: ['fog', 'rain', 'snow', 'wind', 'storm', 'heat', 'cold'],
        default: 'fog'
      },
      intensity: { min: 1, max: 10, default: 5 },
      radius: { min: 10, max: 1000, default: 100, unit: 'feet' },
      damaging: { type: 'boolean', default: false, actionPointModifier: 2 }
    },
    
    // Portal parameters
    portal: {
      portalRange: { min: 10, max: 10000, default: 100, unit: 'feet' },
      size: { min: 1, max: 20, default: 5, unit: 'feet' },
      stability: { min: 1, max: 10, default: 5 },
      planar: { type: 'boolean', default: false, actionPointModifier: 3 }
    },
    
    // Enchantment parameters
    enchantment: {
      enchantmentType: {
        options: ['fire', 'frost', 'lightning', 'holy', 'shadow', 'nature', 'arcane'],
        default: 'fire'
      },
      power: { min: 1, max: 10, default: 3 },
      duration: { min: 1, max: 60, default: 10, unit: 'minutes' },
      charges: { min: 1, max: 50, default: 10 }
    }
  };
  
  /**
   * Utility effect categories for organization
   */
  export const UTILITY_CATEGORIES = [
    {
      id: 'movement',
      name: 'Movement',
      description: 'Effects that enhance or alter movement capabilities',
      types: ['teleport', 'flight', 'speed', 'phasing', 'wallWalking'],
      priority: 'mobility and positioning',
      tooltip: 'Best for: Traversal, escape, and accessing difficult areas'
    },
    {
      id: 'perception',
      name: 'Perception',
      description: 'Effects that enhance senses or reveal information',
      types: ['detection', 'scrying', 'identification', 'truesight'],
      priority: 'information gathering',
      tooltip: 'Best for: Scouting, detecting hidden threats, and gathering intelligence'
    },
    {
      id: 'concealment',
      name: 'Concealment',
      description: 'Effects that hide or disguise',
      types: ['illusion', 'disguise', 'phaseshift'],
      priority: 'stealth and deception',
      tooltip: 'Best for: Stealth operations, infiltration, and misdirection'
    },
    {
      id: 'creation',
      name: 'Creation',
      description: 'Effects that create or summon things',
      types: ['conjuration', 'barrier', 'hazard', 'element'],
      priority: 'manifesting resources',
      tooltip: 'Best for: Producing needed materials or creatures'
    },
    {
      id: 'alteration',
      name: 'Alteration',
      description: 'Effects that change existing things',
      types: ['transformation', 'terrain', 'enchantment', 'size'],
      priority: 'modifying reality',
      tooltip: 'Best for: Adapting to situations by changing existing elements'
    },
    {
      id: 'control',
      name: 'Control',
      description: 'Effects that manipulate forces or creatures',
      types: ['weather', 'gravity', 'push', 'pull'],
      priority: 'battlefield control',
      tooltip: 'Best for: Dictating battlefield conditions and positioning'
    }
  ];
  
  /**
   * Utility optimization suggestions based on environment
   */
  export const ENVIRONMENT_OPTIMIZATIONS = {
    dungeon: {
      recommended: ['teleport', 'flight', 'detection', 'truesight', 'light', 'barrier'],
      description: 'Confined spaces with potential traps and hidden secrets',
      priority: 'detection and mobility'
    },
    wilderness: {
      recommended: ['flight', 'weather', 'terrain', 'animal', 'scrying', 'light'],
      description: 'Open areas with natural hazards and terrain challenges',
      priority: 'travel and survival'
    },
    urban: {
      recommended: ['disguise', 'illusion', 'detection', 'teleport', 'barrier', 'enchantment'],
      description: 'Populated areas where subtlety may be required',
      priority: 'stealth and social interaction'
    },
    planar: {
      recommended: ['portal', 'phaseshift', 'truesight', 'elemental', 'barrier'],
      description: 'Alien environments with unique physical laws',
      priority: 'protection and adaptation'
    },
    underwater: {
      recommended: ['water breathing', 'water control', 'transformation', 'light', 'detection'],
      description: 'Challenging aquatic environments',
      priority: 'survival and adaptation'
    },
    aerial: {
      recommended: ['flight', 'weather', 'wind control', 'feather fall', 'levitation'],
      description: 'Open skies and aerial challenges',
      priority: 'mobility and stability'
    }
  };
  
  /**
   * Find a utility effect type by ID
   * @param {string} id - The ID of the utility effect type to find
   * @returns {Object|null} The utility effect type object or null if not found
   */
  export function findUtilityTypeById(id) {
    return UTILITY_EFFECT_TYPES.find(type => type.id === id) || null;
  }
  
  /**
   * Find a specific utility subtype
   * @param {string} typeId - The ID of the utility effect type 
   * @param {string} subtypeId - The ID of the subtype to find
   * @returns {Object|null} The utility subtype object or null if not found
   */
  export function findUtilitySubtype(typeId, subtypeId) {
    const type = findUtilityTypeById(typeId);
    if (!type) return null;
    
    return type.subtypes.find(subtype => subtype.id === subtypeId) || null;
  }
  
  /**
   * Find parameter definition for a utility effect
   * @param {string} paramName - The name of the parameter
   * @param {string} context - The context (usually utility subtype ID)
   * @returns {Object|null} The parameter definition or null if not found
   */
  export function findParameterDefinition(paramName, context) {
    // Check for specific context parameters
    if (context && UTILITY_PARAMETERS[context] && UTILITY_PARAMETERS[context][paramName]) {
      return UTILITY_PARAMETERS[context][paramName];
    }
    
    // Check general parameters that apply to multiple contexts
    for (const [contextKey, contextParams] of Object.entries(UTILITY_PARAMETERS)) {
      if (contextParams[paramName]) {
        return contextParams[paramName];
      }
    }
    
    return null;
  }
  
  /**
   * Get all utility subtypes in a specific category
   * @param {string} categoryId - The ID of the category to filter by
   * @returns {Array} Array of utility subtypes in the category
   */
  export function getUtilityTypesByCategory(categoryId) {
    const category = UTILITY_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    const subtypes = [];
    
    UTILITY_EFFECT_TYPES.forEach(type => {
      type.subtypes.forEach(subtype => {
        if (category.types.includes(subtype.id)) {
          subtypes.push({
            ...subtype,
            parentType: type.id,
            parentName: type.name
          });
        }
      });
    });
    
    return subtypes;
  }
  
  /**
   * Get recommended utility effects for an environment
   * @param {string} environment - The environment type
   * @returns {Array} Array of recommended utility effects
   */
  export function getRecommendedUtilities(environment) {
    const optimization = ENVIRONMENT_OPTIMIZATIONS[environment];
    if (!optimization) return [];
    
    const recommended = [];
    
    optimization.recommended.forEach(typeId => {
      // Look for this type in main types
      const mainType = findUtilityTypeById(typeId);
      if (mainType) {
        recommended.push({
          id: mainType.id,
          name: mainType.name,
          description: mainType.description,
          type: 'main',
          icon: mainType.icon
        });
        return;
      }
      
      // Look for this type in subtypes
      for (const type of UTILITY_EFFECT_TYPES) {
        const subtype = type.subtypes.find(sub => sub.id === typeId);
        if (subtype) {
          recommended.push({
            id: subtype.id,
            name: subtype.name,
            description: subtype.description,
            type: 'subtype',
            parentType: type.id,
            parentName: type.name,
            icon: subtype.icon
          });
          return;
        }
      }
    });
    
    return recommended;
  }
  
  /**
   * Validate utility effect parameters
   * @param {Object} params - The parameters to validate
   * @param {string} typeId - The utility effect type ID
   * @param {string} subtypeId - The utility effect subtype ID
   * @returns {Object} Validation result with isValid and errors
   */
  export function validateUtilityParameters(params, typeId, subtypeId) {
    const subtype = findUtilitySubtype(typeId, subtypeId);
    if (!subtype) {
      return { 
        isValid: false, 
        errors: { base: 'Invalid utility type or subtype' }
      };
    }
    
    const errors = {};
    
    // Check each required parameter
    for (const paramName of subtype.parameters) {
      // Get parameter definition
      const paramDef = findParameterDefinition(paramName, subtypeId) || 
                       findParameterDefinition(paramName, typeId);
      
      if (!paramDef) continue; // Skip if no definition found
      
      const value = params[paramName];
      
      // Check if required parameter is missing
      if (value === undefined || value === null || value === '') {
        errors[paramName] = `${formatParamName(paramName)} is required`;
        continue;
      }
      
      // Validate based on parameter type
      if (paramDef.type === 'boolean') {
        // Boolean values are always valid
        continue;
      }
      
      if (paramDef.options) {
        // Check if value is in allowed options
        if (!paramDef.multiple && !paramDef.options.includes(value)) {
          errors[paramName] = `${formatParamName(paramName)} must be one of: ${paramDef.options.join(', ')}`;
        } else if (paramDef.multiple && Array.isArray(value)) {
          // Check if all values in array are allowed options
          const invalidValues = value.filter(v => !paramDef.options.includes(v));
          if (invalidValues.length > 0) {
            errors[paramName] = `Invalid options for ${formatParamName(paramName)}: ${invalidValues.join(', ')}`;
          }
        }
        continue;
      }
      
      if (paramDef.min !== undefined && paramDef.max !== undefined) {
        // Check numeric range
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          errors[paramName] = `${formatParamName(paramName)} must be a number`;
        } else if (numValue < paramDef.min || numValue > paramDef.max) {
          errors[paramName] = `${formatParamName(paramName)} must be between ${paramDef.min} and ${paramDef.max}`;
        }
        continue;
      }
      
      if (paramDef.type === 'dice') {
        // Validate dice notation
        if (!isDiceNotationValid(value)) {
          errors[paramName] = `${formatParamName(paramName)} must be valid dice notation (e.g. 2d6)`;
        }
        continue;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  /**
   * Calculate the action point cost for a utility effect
   * @param {string} typeId - The utility effect type ID
   * @param {string} subtypeId - The utility effect subtype ID
   * @param {Object} params - The effect parameters
   * @returns {number} The calculated action point cost
   */
  export function calculateUtilityActionPointCost(typeId, subtypeId, params) {
    const type = findUtilityTypeById(typeId);
    if (!type) return 1;
    
    let cost = type.actionPointCost || 1;
    
    // Add AP modifiers from parameters
    if (params) {
      Object.entries(params).forEach(([paramName, value]) => {
        const paramDef = findParameterDefinition(paramName, subtypeId) || 
                         findParameterDefinition(paramName, typeId);
        
        if (paramDef && paramDef.actionPointModifier) {
          if (paramDef.type === 'boolean') {
            // For boolean parameters, apply modifier if true
            if (value === true) {
              cost += paramDef.actionPointModifier;
            }
          } else {
            // For non-boolean parameters, apply modifier based on value
            cost += paramDef.actionPointModifier;
          }
        }
      });
    }
    
    // Apply subtype-specific modifiers
    const subtype = findUtilitySubtype(typeId, subtypeId);
    if (subtype && subtype.actionPointModifier) {
      cost += subtype.actionPointModifier;
    }
    
    // Ensure minimum cost of 1
    return Math.max(1, cost);
  }
  
  /**
   * Generate a description for a utility effect based on its parameters
   * @param {string} typeId - The utility effect type ID
   * @param {string} subtypeId - The utility effect subtype ID
   * @param {Object} params - The effect parameters
   * @returns {string} A description of the effect
   */
  export function generateUtilityDescription(typeId, subtypeId, params) {
    const type = findUtilityTypeById(typeId);
    const subtype = findUtilitySubtype(typeId, subtypeId);
    
    if (!type || !subtype) {
      return 'Unknown utility effect';
    }
    
    let description = subtype.description;
    
    // Add parameter-specific details
    if (params) {
      // Add distance/range information
      if (params.distance) {
        description += ` up to ${params.distance} feet`;
      } else if (params.range) {
        description += ` with a range of ${params.range} feet`;
      }
      
      // Add size information
      if (params.size) {
        description += `, affecting an area ${params.size} feet across`;
      } else if (params.radius) {
        description += ` within a ${params.radius}-foot radius`;
      }
      
      // Add duration information
      if (params.duration) {
        description += `, lasting for ${params.duration} ${params.duration === 1 ? 'minute' : 'minutes'}`;
      }
      
      // Add specific parameter details based on utility subtype
      switch (subtypeId) {
        case 'teleport':
          if (params.needsLineOfSight === false) {
            description += ' without requiring line of sight';
          }
          if (params.takesOthers === true) {
            description += `, allowing you to bring up to ${params.otherTargets || 1} other ${params.otherTargets === 1 ? 'creature' : 'creatures'} with you`;
          }
          break;
          
        case 'flight':
          if (params.flightSpeed) {
            description += ` at a speed of ${params.flightSpeed} feet per round`;
          }
          if (params.flightType) {
            description += ` using ${params.flightType} flight`;
          }
          break;
          
        case 'barrier':
          if (params.barrierType && params.barrierMaterial) {
            description += `, creating a ${params.barrierMaterial} ${params.barrierType}`;
          }
          if (params.barrierHP) {
            description += ` with ${params.barrierHP} hit points`;
          }
          if (params.barrierDealsDamage === true) {
            description += ` that deals damage to creatures touching it`;
          }
          break;
          
        case 'illusion':
        case 'visual':
        case 'complex':
          if (params.complexity) {
            const complexityDesc = params.complexity <= 3 ? 'simple' : 
                                 params.complexity <= 6 ? 'moderate' : 
                                 params.complexity <= 8 ? 'complex' : 'extremely detailed';
            description += ` with ${complexityDesc} detail`;
          }
          if (params.interactivity > 0) {
            description += ` that can respond to interaction`;
          }
          break;
          
        case 'animal':
          if (params.animalType) {
            description += `, taking the form of a ${params.size || 'medium'}-sized ${params.animalType}`;
          }
          break;
          
        case 'detection':
          if (params.detectionType) {
            description += `, sensing the presence of ${params.detectionType}`;
          }
          if (params.throughObstacles === true) {
            description += ` even through solid barriers`;
          }
          break;
      }
    }
    
    return description;
  }
  
  /**
   * Format parameter name for display
   * @param {string} name - The parameter name
   * @returns {string} Formatted parameter name
   */
  function formatParamName(name) {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  }
  
  /**
   * Validate dice notation
   * @param {string} notation - The dice notation to validate
   * @returns {boolean} Whether the notation is valid
   */
  function isDiceNotationValid(notation) {
    // Simple regex to check dice notation (e.g., 2d6, 1d20+5)
    return /^\d+d\d+(?:\s*[-+]\s*\d+)?$/.test(notation);
  }
  
  /**
   * Determine the optimal utility type for a given situation
   * @param {Object} situation - The situation details
   * @returns {Object} The recommended utility effect
   */
  export function getOptimalUtilityEffect(situation) {
    const { 
      environment = 'dungeon',
      task = 'exploration',
      priority = 'versatility',
      danger = 'low',
      complexity = 'medium'
    } = situation;
    
    // Get environment-specific recommendations
    const environmentalRecommendations = getRecommendedUtilities(environment);
    
    // Determine priority based on task
    let taskPriority;
    switch (task) {
      case 'combat':
        taskPriority = danger === 'high' ? 'survival' : 'battlefield control';
        break;
      case 'exploration':
        taskPriority = 'information gathering';
        break;
      case 'stealth':
        taskPriority = 'concealment';
        break;
      case 'social':
        taskPriority = 'perception';
        break;
      case 'travel':
        taskPriority = 'movement';
        break;
      default:
        taskPriority = 'versatility';
    }
    
    // Find the best category based on priority
    let bestCategory;
    for (const category of UTILITY_CATEGORIES) {
      if (category.priority.includes(taskPriority)) {
        bestCategory = category;
        break;
      }
    }
    
    // Determine complexity rating
    const complexityRating = complexity === 'high' ? 3 : complexity === 'medium' ? 2 : 1;
    
    // Find the best effect within the category
    let bestEffect = null;
    
    if (bestCategory) {
      const categoryEffects = getUtilityTypesByCategory(bestCategory.id);
      
      // Filter by environmental recommendations if available
      const environmentallyRecommended = categoryEffects.filter(effect => 
        environmentalRecommendations.some(rec => rec.id === effect.id)
      );
      
      // Use environmentally recommended effects if available, otherwise use all category effects
      const effectPool = environmentallyRecommended.length > 0 ? 
        environmentallyRecommended : categoryEffects;
      
      // Find the effect that best matches the complexity rating
      bestEffect = effectPool.reduce((best, current) => {
        // Estimate effect complexity based on parameter count and type
        const effect = findUtilitySubtype(current.parentType, current.id);
        if (!effect) return best;
        
        const paramCount = effect.parameters.length;
        const effectComplexity = paramCount > 4 ? 3 : paramCount > 2 ? 2 : 1;
        
        // The effect with complexity closest to desired complexity is best
        const currentDiff = Math.abs(effectComplexity - complexityRating);
        const bestDiff = best ? Math.abs(best.complexity - complexityRating) : Infinity;
        
        if (currentDiff < bestDiff) {
          return { 
            ...current, 
            complexity: effectComplexity,
            parameters: effect.parameters
          };
        }
        return best;
      }, null);
    }
    
    // If no effect found in best category, pick from environmental recommendations
    if (!bestEffect && environmentalRecommendations.length > 0) {
      const recommendation = environmentalRecommendations[0];
      
      if (recommendation.type === 'subtype') {
        const effect = findUtilitySubtype(recommendation.parentType, recommendation.id);
        if (effect) {
          bestEffect = {
            ...recommendation,
            parameters: effect.parameters,
            complexity: effect.parameters.length > 4 ? 3 : effect.parameters.length > 2 ? 2 : 1
          };
        }
      }
    }
    
    // If still no effect found, return a generic recommendation
    if (!bestEffect) {
      return {
        recommendation: 'detection',
        parentType: 'divination',
        reason: 'Versatile utility effect good in most situations',
        parameters: ['detectionType', 'range', 'detail', 'duration']
      };
    }
    
    return {
      recommendation: bestEffect.id,
      parentType: bestEffect.parentType,
      reason: `Optimal for ${taskPriority} in ${environment} environments`,
      parameters: bestEffect.parameters
    };
  }