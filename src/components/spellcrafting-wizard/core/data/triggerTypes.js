const TARGETING_TYPES = [
  {
    id: 'single',
    name: 'Single Target',
    description: 'Affects one specific target',
    icon: 'ability_hunter_snipershot',
    actionPointModifier: 0,
    tooltip: 'Focus your spell\'s energy on a single target for maximum effect'
  },
  {
    id: 'multi',
    name: 'Multiple Targets',
    description: 'Affects several individually selected targets',
    icon: 'spell_frost_chainofdamnation',
    actionPointModifier: 1,
    tooltip: 'Split your spell\'s energy between multiple targets you choose'
  },
  {
    id: 'area',
    name: 'Area of Effect',
    description: 'Affects all targets within a defined area',
    icon: 'spell_fire_flamestrike',
    actionPointModifier: 1,
    tooltip: 'Create a magical effect that impacts everything in a specific area'
  },
  {
    id: 'chain',
    name: 'Chain Effect',
    description: 'Effect jumps from one target to nearby targets',
    icon: 'spell_frost_chainheal',
    actionPointModifier: 2,
    tooltip: 'Your spell chains from one target to others within proximity'
  },
  {
    id: 'cone',
    name: 'Cone',
    description: 'Affects targets in a cone-shaped area',
    icon: 'spell_fire_flamegeyser',
    actionPointModifier: 1,
    tooltip: 'Project your spell in a widening cone from your position'
  },
  {
    id: 'line',
    name: 'Line',
    description: 'Affects targets in a line',
    icon: 'spell_arcane_starfire',
    actionPointModifier: 1,
    tooltip: 'Your spell strikes in a straight line, affecting all in its path'
  },
  {
    id: 'self',
    name: 'Self',
    description: 'Only affects the caster',
    icon: 'spell_holy_powerwordshield',
    actionPointModifier: -1,
    tooltip: 'Channel the spell\'s energy into yourself'
  },
  {
    id: 'smart',
    name: 'Smart Targeting',
    description: 'Automatically selects targets based on parameters',
    icon: 'spell_holy_divineillumination',
    actionPointModifier: 2,
    tooltip: 'Your spell intelligently chooses optimal targets based on the situation'
  }
];

const AOE_SHAPES = [
  {
    id: 'circle',
    name: 'Circle',
    description: 'Affects all targets within a circular area',
    icon: 'spell_holy_circleofrenewal',
    defaultRadius: 20,
    parameterType: 'radius',
    tooltip: 'Creates a perfectly circular area of magical effect'
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Affects all targets within a square area',
    icon: 'inv_misc_gem_diamond_02',
    defaultSize: 15,
    parameterType: 'sideLength',
    tooltip: 'Forms a square-shaped area of effect with equal sides'
  },
  {
    id: 'cone',
    name: 'Cone',
    description: 'Affects targets in a cone-shaped area extending from the caster',
    icon: 'inv_throwingaxe_03',
    defaultRange: 15,
    defaultAngle: 90,
    parameterType: 'rangeAngle',
    tooltip: 'Projects a cone of magical energy that widens as it extends'
  },
  {
    id: 'line',
    name: 'Line',
    description: 'Affects targets in a straight line from the caster',
    icon: 'inv_weapon_bow_07',
    defaultLength: 30,
    defaultWidth: 5,
    parameterType: 'lengthWidth',
    tooltip: 'Creates a straight line of magical effect extending from you'
  },
  {
    id: 'cube',
    name: 'Cube',
    description: 'Affects all targets within a three-dimensional cube',
    icon: 'inv_misc_gem_diamond_01',
    defaultSize: 15,
    parameterType: 'sideLength',
    tooltip: 'Forms a magical cube that affects everything inside it'
  },
  {
    id: 'sphere',
    name: 'Sphere',
    description: 'Affects all targets within a three-dimensional sphere',
    icon: 'inv_misc_orb_01',
    defaultRadius: 20,
    parameterType: 'radius',
    tooltip: 'Creates a perfect sphere of magical energy'
  },
  {
    id: 'cylinder',
    name: 'Cylinder',
    description: 'Affects all targets within a cylinder',
    icon: 'spell_holy_circleofrenewal',
    defaultRadius: 10,
    defaultHeight: 20,
    parameterType: 'radiusHeight',
    tooltip: 'Forms a cylindrical column of magical effect'
  },
  {
    id: 'wall',
    name: 'Wall',
    description: 'Creates a wall-shaped effect',
    icon: 'spell_holy_powerwordbarrier',
    defaultLength: 30,
    defaultHeight: 10,
    defaultWidth: 5,
    parameterType: 'lengthHeightWidth',
    tooltip: 'Conjures a magical barrier or wall of energy'
  }
];

// Enhanced with visualization data
const TARGETING_VISUALIZATION = {
  gridSize: 5, // 5 feet per grid square
  defaultGridCells: 21, // A 21x21 grid (to ensure a center point)
  centerPoint: { x: 10, y: 10 }, // Center point of the grid
  colors: {
      caster: '#0074e0', // Primary blue
      casterBorder: '#005bb1', // Darker blue
      range: 'rgba(58, 158, 255, 0.3)', // Light blue with opacity
      rangeBorder: 'rgba(58, 158, 255, 0.7)', // Light blue border with opacity
      target: '#e9a639', // Warning/gold color
      targetBorder: '#d68910', // Darker gold
      aoe: {
          circle: 'rgba(231, 76, 60, 0.3)', // Red with opacity
          circleBorder: 'rgba(231, 76, 60, 0.7)',
          square: 'rgba(52, 152, 219, 0.3)', // Blue with opacity
          squareBorder: 'rgba(52, 152, 219, 0.7)',
          cone: 'rgba(155, 89, 182, 0.3)', // Purple with opacity
          coneBorder: 'rgba(155, 89, 182, 0.7)',
          line: 'rgba(46, 204, 113, 0.3)', // Green with opacity
          lineBorder: 'rgba(46, 204, 113, 0.7)',
          cube: 'rgba(241, 196, 15, 0.3)', // Yellow with opacity
          cubeBorder: 'rgba(241, 196, 15, 0.7)',
          sphere: 'rgba(230, 126, 34, 0.3)', // Orange with opacity
          sphereBorder: 'rgba(230, 126, 34, 0.7)',
          cylinder: 'rgba(142, 68, 173, 0.3)', // Dark purple with opacity
          cylinderBorder: 'rgba(142, 68, 173, 0.7)',
          wall: 'rgba(52, 73, 94, 0.3)', // Dark blue with opacity
          wallBorder: 'rgba(52, 73, 94, 0.7)',
      }
  },
  drawFunctions: {
      // Functions will be implemented in the component for canvas drawing
  }
};

const getTargetingTypeById = (id) => {
  return TARGETING_TYPES.find(targetingType => targetingType.id === id) || null;
};

const getAoeShapeById = (id) => {
  return AOE_SHAPES.find(aoeShape => aoeShape.id === id) || null;
};

const getTargetingActionPointModifier = (id) => {
  const targetingType = getTargetingTypeById(id);
  return targetingType ? targetingType.actionPointModifier : 0;
};

const isMultiTarget = (id) => {
  return ['multi', 'area', 'chain', 'cone', 'line'].includes(id);
};

const calculateAoeArea = (shapeId, parameters = {}) => {
  const shape = getAoeShapeById(shapeId);
  if (!shape) return { area: 0, affectedSquares: 0 };

  let area = 0;
  let affectedSquares = 0;
  const gridSize = parameters.gridSize || 5; // Assume 5-foot grid by default

  switch (shapeId) {
      case 'circle':
          const radius = parameters.radius || shape.defaultRadius;
          area = Math.PI * radius * radius;
          // Approximate number of 5-foot squares in a circle
          affectedSquares = Math.ceil(area / (gridSize * gridSize));
          return { area, affectedSquares, radius };

      case 'square':
          const size = parameters.size || shape.defaultSize;
          area = size * size;
          affectedSquares = Math.ceil(area / (gridSize * gridSize));
          return { area, affectedSquares, size };

      case 'cone':
          const range = parameters.range || shape.defaultRange;
          const angle = parameters.angle || shape.defaultAngle;
          // Area of a sector = (angle/360) * π * r²
          area = (angle / 360) * Math.PI * range * range;
          affectedSquares = Math.ceil(area / (gridSize * gridSize));
          return { area, affectedSquares, range, angle };

      case 'line':
          const length = parameters.length || shape.defaultLength;
          const width = parameters.width || shape.defaultWidth;
          area = length * width;
          affectedSquares = Math.ceil(area / (gridSize * gridSize));
          return { area, affectedSquares, length, width };

      case 'cube':
          const cubeSize = parameters.size || shape.defaultSize;
          area = cubeSize * cubeSize * cubeSize; // Actually volume
          affectedSquares = Math.ceil((cubeSize * cubeSize) / (gridSize * gridSize)) * Math.ceil(cubeSize / gridSize);
          return { area, affectedSquares, size: cubeSize };

      case 'sphere':
          const sphereRadius = parameters.radius || shape.defaultRadius;
          area = (4/3) * Math.PI * sphereRadius * sphereRadius * sphereRadius; // Actually volume
          // Approximation of 3D grid cells
          affectedSquares = Math.ceil((4/3) * Math.PI * Math.pow(sphereRadius / gridSize, 3));
          return { area, affectedSquares, radius: sphereRadius };

      case 'cylinder':
          const cylinderRadius = parameters.radius || shape.defaultRadius;
          const height = parameters.height || shape.defaultHeight;
          area = Math.PI * cylinderRadius * cylinderRadius * height; // Actually volume
          affectedSquares = Math.ceil(Math.PI * Math.pow(cylinderRadius / gridSize, 2) * Math.ceil(height / gridSize));
          return { area, affectedSquares, radius: cylinderRadius, height };

      case 'wall':
          const wallLength = parameters.length || shape.defaultLength;
          const wallHeight = parameters.height || shape.defaultHeight;
          const wallWidth = parameters.width || shape.defaultWidth;
          area = wallLength * wallHeight * wallWidth; // Actually volume
          affectedSquares = Math.ceil((wallLength * wallHeight) / (gridSize * gridSize)) * Math.ceil(wallWidth / gridSize);
          return { area, affectedSquares, length: wallLength, height: wallHeight, width: wallWidth };

      default:
          return { area: 0, affectedSquares: 0 };
  }
};

const getMaxTargets = (targetingTypeId, aoeShapeId, parameters = {}) => {
  const targetingType = getTargetingTypeById(targetingTypeId);
  if (!targetingType) return 0;

  switch (targetingTypeId) {
      case 'single':
          return 1;

      case 'self':
          return 1;

      case 'multi':
          return parameters.maxTargets || 3; // Default to 3 if not specified

      case 'chain':
          return parameters.chainCount || 3; // Default to 3 if not specified

      case 'area':
          if (!aoeShapeId) return "variable";

          // For area effects, target count depends on creature density
          const areaCalc = calculateAoeArea(aoeShapeId, parameters);
          const avgCreaturesPerSquare = parameters.creatureDensity || 0.2; // Default to 1 creature per 5 squares

          return Math.max(1, Math.ceil(areaCalc.affectedSquares * avgCreaturesPerSquare));

      case 'cone':
      case 'line':
          // Similar to area but with different defaults
          const shapeCalc = calculateAoeArea(targetingTypeId, parameters);
          const linearDensity = parameters.creatureDensity || 0.33; // Default to 1 creature per 3 squares for linear effects

          return Math.max(1, Math.ceil(shapeCalc.affectedSquares * linearDensity));

      case 'smart':
          return parameters.maxTargets || "variable"; // Smart targeting could have various limits

      default:
          return 0;
  }
};

// New function to convert feet to grid units
const feetToGrid = (feet, gridSize = 5) => {
  return feet / gridSize;
};

// New function to calculate distance between two points in grid units
const gridDistance = (point1, point2, gridSize = 5) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy) * gridSize; // Convert back to feet
};

// New function to check if a point is within an AOE shape
const isPointInAoe = (point, targetPoint, shapeId, parameters = {}, gridSize = 5) => {
  const shape = getAoeShapeById(shapeId);
  if (!shape) return false;

  switch (shapeId) {
      case 'circle': {
          const radius = feetToGrid(parameters.radius || shape.defaultRadius, gridSize);
          const dx = point.x - targetPoint.x;
          const dy = point.y - targetPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance <= radius;
      }

      case 'square': {
          const halfSize = feetToGrid(parameters.size || shape.defaultSize, gridSize) / 2;
          return Math.abs(point.x - targetPoint.x) <= halfSize &&
                 Math.abs(point.y - targetPoint.y) <= halfSize;
      }

      case 'cone': {
          // Calculate direction from caster to target
          const centerPoint = TARGETING_VISUALIZATION.centerPoint;
          const range = feetToGrid(parameters.range || shape.defaultRange, gridSize);
          const halfAngle = (parameters.angle || shape.defaultAngle) / 2 * (Math.PI / 180);

          // Calculate angle from target to point
          const dx1 = targetPoint.x - centerPoint.x;
          const dy1 = targetPoint.y - centerPoint.y;
          const targetAngle = Math.atan2(dy1, dx1);

          // Calculate angle from center to point
          const dx2 = point.x - centerPoint.x;
          const dy2 = point.y - centerPoint.y;
          const pointAngle = Math.atan2(dy2, dx2);

          // Calculate angular difference
          let angleDiff = Math.abs(pointAngle - targetAngle);
          if (angleDiff > Math.PI) {
              angleDiff = 2 * Math.PI - angleDiff;
          }

          // Calculate distance from center
          const pointDistance = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          return angleDiff <= halfAngle && pointDistance <= range;
      }

      case 'line': {
          const length = feetToGrid(parameters.length || shape.defaultLength, gridSize);
          const width = feetToGrid(parameters.width || shape.defaultWidth, gridSize);

          // Calculate direction from caster to target
          const centerPoint = TARGETING_VISUALIZATION.centerPoint;
          const dx = targetPoint.x - centerPoint.x;
          const dy = targetPoint.y - centerPoint.y;
          const angle = Math.atan2(dy, dx);

          // Rotate point to align with the line
          const rotatedX = (point.x - centerPoint.x) * Math.cos(-angle) -
                          (point.y - centerPoint.y) * Math.sin(-angle);
          const rotatedY = (point.x - centerPoint.x) * Math.sin(-angle) +
                          (point.y - centerPoint.y) * Math.cos(-angle);

          return rotatedX >= 0 && rotatedX <= length &&
                 Math.abs(rotatedY) <= width / 2;
      }

      default:
          return false;
  }
};

// Extended info for displaying targeting types with descriptions
const getTargetingTypeDetails = (id) => {
  const targetingType = getTargetingTypeById(id);
  if (!targetingType) return null;

  return {
      ...targetingType,
      examples: getTargetingTypeExamples(id),
      visualizationTips: getTargetingVisualizationTips(id)
  };
};

const getTargetingTypeExamples = (id) => {
  switch (id) {
      case 'single':
          return [
              "Fireball: A concentrated ball of fire shot at a specific target",
              "Frostbolt: A chilling bolt of ice that slows and damages one foe",
              "Healing Touch: A direct healing spell focusing on a single ally"
          ];
      case 'multi':
          return [
              "Magic Missile: Multiple arcane bolts that can target different foes",
              "Healing Word: Quick healing magic that can be directed at up to 3 allies",
              "Hunter's Mark: Mark multiple targets for increased damage"
          ];
      case 'area':
          return [
              "Flamestrike: A column of fire that damages all in the target area",
              "Healing Rain: Healing energy rains down on all allies in an area",
              "Blizzard: Frozen shards fall in an area, damaging and slowing enemies"
          ];
      case 'chain':
          return [
              "Chain Lightning: Electricity jumps from one target to nearby ones",
              "Chain Heal: Healing energy that bounces between injured allies",
              "Corruption Spread: Dark magic that spreads between proximate foes"
          ];
      case 'cone':
          return [
              "Dragon's Breath: A cone of flame that damages all in its path",
              "Frost Nova: A cone of freezing energy that immobilizes enemies",
              "Cleansing Wave: Healing energy projected in a widening cone"
          ];
      case 'line':
          return [
              "Lightning Bolt: A straight line of electricity damaging all in its path",
              "Piercing Shot: An arrow that can hit multiple targets in a line",
              "Wall of Frost: Create a line of ice that slows enemies crossing it"
          ];
      case 'self':
          return [
              "Arcane Intellect: Enhance your magical abilities",
              "Shield of Faith: Surround yourself with protective energy",
              "Blink: Teleport yourself a short distance"
          ];
      case 'smart':
          return [
              "Circle of Healing: Automatically heals the most injured allies",
              "Chain Lightning (Smart): Seeks optimal targets for maximum chain effect",
              "Magic Missiles (Homing): Missiles automatically find vulnerable targets"
          ];
      default:
          return [];
  }
};

const getTargetingVisualizationTips = (id) => {
  switch (id) {
      case 'single':
          return "Click anywhere within range to select your single target.";
      case 'multi':
          return "For multiple targets, you would select each target individually within range.";
      case 'area':
          return "Place the area of effect anywhere within range. All targets inside the area will be affected.";
      case 'chain':
          return "Select the primary target. The spell will chain to nearby secondary targets automatically.";
      case 'cone':
          return "The cone extends from your position in the direction you cast it, affecting all in its arc.";
      case 'line':
          return "The line extends from your position through your target point, affecting all in its path.";
      case 'self':
          return "This spell only affects you at your current position.";
      case 'smart':
          return "This spell will intelligently select targets based on the parameters you set.";
      default:
          return "";
  }
};

const PROXIMITY_TRIGGERS = [
  {
    id: 'enter_range',
    name: 'Enter Range',
    description: 'Triggers when a creature enters within a certain range of the target',
    parameters: [{ name: 'range', type: 'number', unit: 'feet', default: 30 }],
    entitiesAffected: ['allies', 'enemies', 'self'],
    icon: 'spell_mage_flameorb',
  },
  {
    id: 'exit_range',
    name: 'Exit Range',
    description: 'Triggers when a creature leaves a certain range of the target',
    parameters: [{ name: 'range', type: 'number', unit: 'feet', default: 30 }],
    entitiesAffected: ['allies', 'enemies', 'self'],
    icon: 'ability_fixated_state_red',
  },
  {
    id: 'line_of_sight',
    name: 'Line of Sight',
    description: 'Triggers when a creature enters or exits line of sight',
    parameters: [{ name: 'state', type: 'select', options: ['enter', 'exit'], default: 'enter' }],
    entitiesAffected: ['allies', 'enemies'],
    icon: 'ability_hunter_snipershot',
  },
  {
    id: 'proximity_to_terrain',
    name: 'Proximity to Terrain',
    description: 'Triggers when near a specific type of terrain',
    parameters: [
      { name: 'terrain', type: 'select', options: ['water', 'fire', 'forest', 'mountain', 'darkness'], default: 'water' },
      { name: 'range', type: 'number', unit: 'feet', default: 10 }
    ],
    entitiesAffected: ['self'],
    icon: 'spell_frost_summonwaterelemental',
  }
];

const STATUS_TRIGGERS = [
  {
    id: 'status_applied',
    name: 'Status Applied',
    description: 'Triggers when a status effect is applied',
    parameters: [{ name: 'status', type: 'string', default: 'any' }],
    entitiesAffected: ['allies', 'enemies', 'self'],
    icon: 'spell_holy_sealofsacrifice',
  },
  {
    id: 'status_removed',
    name: 'Status Removed',
    description: 'Triggers when a status effect is removed',
    parameters: [{ name: 'status', type: 'string', default: 'any' }],
    entitiesAffected: ['allies', 'enemies', 'self'],
    icon: 'spell_holy_removecurse',
  },
  {
    id: 'health_threshold',
    name: 'Health Threshold',
    description: 'Triggers when health falls below or rises above a threshold',
    parameters: [
      { name: 'threshold', type: 'number', unit: '%', default: 50 },
      { name: 'condition', type: 'select', options: ['below', 'above'], default: 'below' }
    ],
    entitiesAffected: ['allies', 'enemies', 'self'],
    icon: 'spell_holy_sealofsacrifice',
  },
  {
    id: 'stun_break',
    name: 'Stun Break',
    description: 'Triggers when recovering from a stun effect',
    parameters: [],
    entitiesAffected: ['self', 'allies'],
    icon: 'ability_paladin_blindinglight',
  }
];

const COMBAT_TRIGGERS = [
  {
    id: 'damage_taken',
    name: 'Damage Taken',
    description: 'Triggers when damage is taken',
    parameters: [
      { name: 'damage_type', type: 'select', options: ['any', 'physical', 'magical', 'fire', 'frost', 'arcane', 'nature', 'shadow', 'holy'], default: 'any' },
      { name: 'min_damage', type: 'number', default: 0 },
      { name: 'target_entity', type: 'select', options: ['self', 'target', 'ally', 'any'], default: 'self', label: 'Entity Taking Damage' }
    ],
    entitiesAffected: ['self', 'allies', 'target', 'any'],
    icon: 'ability_warrior_bloodbath',
  },
  {
    id: 'damage_dealt',
    name: 'Damage Dealt',
    description: 'Triggers when dealing damage to a target',
    parameters: [
      { name: 'damage_type', type: 'select', options: ['any', 'physical', 'magical', 'fire', 'frost', 'arcane', 'nature', 'shadow', 'holy'], default: 'any' },
      { name: 'min_damage', type: 'number', default: 0 },
      { name: 'source_entity', type: 'select', options: ['self', 'ally', 'any'], default: 'self', label: 'Entity Dealing Damage' }
    ],
    entitiesAffected: ['self', 'allies', 'any'],
    icon: 'ability_warrior_savageblow',
  },
  {
    id: 'critical_hit',
    name: 'Critical Hit',
    description: 'Triggers on a critical hit',
    parameters: [
      { name: 'attack_type', type: 'select', options: ['any', 'melee', 'spell'], default: 'any' }
    ],
    entitiesAffected: ['self'],
    icon: 'ability_backstab',
  },
  {
    id: 'dodge',
    name: 'Dodge',
    description: 'Triggers when an attack is dodged',
    parameters: [],
    entitiesAffected: ['self'],
    icon: 'ability_rogue_feint',
  },
  {
    id: 'parry',
    name: 'Parry',
    description: 'Triggers when an attack is parried',
    parameters: [],
    entitiesAffected: ['self'],
    icon: 'ability_parry',
  },
  {
    id: 'block',
    name: 'Block',
    description: 'Triggers when an attack is blocked',
    parameters: [],
    entitiesAffected: ['self'],
    icon: 'inv_shield_05',
  },
  {
    id: 'attack_miss',
    name: 'Attack Miss',
    description: 'Triggers when an attack misses',
    parameters: [],
    entitiesAffected: ['self'],
    icon: 'ability_hunter_mastermarksman',
  }
];

const RESOURCE_TRIGGERS = [
  {
    id: 'mana_threshold',
    name: 'Mana Threshold',
    description: 'Triggers when mana falls below or rises above a threshold',
    parameters: [
      { name: 'threshold', type: 'number', unit: '%', default: 30 },
      { name: 'condition', type: 'select', options: ['below', 'above'], default: 'below' }
    ],
    entitiesAffected: ['self'],
    icon: 'spell_frost_wizardmark',
  },
  {
    id: 'resource_spent',
    name: 'Resource Spent',
    description: 'Triggers when spending a resource',
    parameters: [
      { name: 'resource', type: 'select', options: ['mana', 'rage', 'energy', 'focus', 'runic_power'], default: 'mana' },
      { name: 'amount', type: 'number', default: 0 }
    ],
    entitiesAffected: ['self'],
    icon: 'inv_misc_gem_sapphire_02',
  },
  {
    id: 'resource_gained',
    name: 'Resource Gained',
    description: 'Triggers when gaining a resource',
    parameters: [
      { name: 'resource', type: 'select', options: ['mana', 'rage', 'energy', 'focus', 'runic_power'], default: 'mana' },
      { name: 'amount', type: 'number', default: 0 }
    ],
    entitiesAffected: ['self'],
    icon: 'inv_misc_gem_emerald_01',
  },
  {
    id: 'combo_points',
    name: 'Combo Points',
    description: 'Triggers when combo points reach a threshold',
    parameters: [
      { name: 'points', type: 'number', default: 5 }
    ],
    entitiesAffected: ['self'],
    icon: 'ability_rogue_eviscerate',
  }
];

const TURN_BASED_TRIGGERS = [
  {
    id: 'turn_start',
    name: 'Turn Start',
    description: 'Triggers at the start of a turn',
    parameters: [],
    entitiesAffected: ['self', 'allies', 'enemies'],
    icon: 'spell_holy_borrowedtime',
  },
  {
    id: 'turn_end',
    name: 'Turn End',
    description: 'Triggers at the end of a turn',
    parameters: [],
    entitiesAffected: ['self', 'allies', 'enemies'],
    icon: 'spell_holy_revivetime',
  },
  {
    id: 'round_start',
    name: 'Round Start',
    description: 'Triggers at the start of a combat round',
    parameters: [],
    entitiesAffected: ['global'],
    icon: 'achievement_bg_returnxflags_def_wsg',
  },
  {
    id: 'round_end',
    name: 'Round End',
    description: 'Triggers at the end of a combat round',
    parameters: [],
    entitiesAffected: ['global'],
    icon: 'achievement_bg_captureflag_eos',
  },
  {
    id: 'nth_turn',
    name: 'Nth Turn',
    description: 'Triggers on a specific turn number',
    parameters: [
      { name: 'turn', type: 'number', default: 3 }
    ],
    entitiesAffected: ['self'],
    icon: 'spell_shadow_demoniccircleteleport',
  }
];

const MOVEMENT_TRIGGERS = [
  {
    id: 'movement_start',
    name: 'Movement Start',
    description: 'Triggers when movement begins',
    parameters: [],
    entitiesAffected: ['self', 'allies', 'enemies'],
    icon: 'ability_hunter_runningshot',
  },
  {
    id: 'movement_stop',
    name: 'Movement Stop',
    description: 'Triggers when movement ends',
    parameters: [],
    entitiesAffected: ['self', 'allies', 'enemies'],
    icon: 'spell_frost_icyveins',
  },
  {
    id: 'jump',
    name: 'Jump',
    description: 'Triggers when jumping',
    parameters: [],
    entitiesAffected: ['self'],
    icon: 'ability_rogue_sprint',
  },
  {
    id: 'fall_damage',
    name: 'Fall Damage',
    description: 'Triggers when taking fall damage',
    parameters: [],
    entitiesAffected: ['self', 'allies', 'enemies'],
    icon: 'spell_shadow_twistedfaith',
  },
  {
    id: 'distance_traveled',
    name: 'Distance Traveled',
    description: 'Triggers after traveling a specific distance',
    parameters: [
      { name: 'distance', type: 'number', unit: 'feet', default: 30 }
    ],
    entitiesAffected: ['self'],
    icon: 'ability_monk_roll',
  }
];

const SPELL_BASED_TRIGGERS = [
  {
    id: 'spell_cast',
    name: 'Spell Cast',
    description: 'Triggers when a spell is cast',
    parameters: [
      { name: 'spell_type', type: 'select', options: ['any', 'damage', 'healing', 'buff', 'debuff', 'utility'], default: 'any' }
    ],
    entitiesAffected: ['self', 'allies', 'enemies'],
    icon: 'spell_holy_holysmite',
  },
  {
    id: 'spell_reflected',
    name: 'Spell Reflected',
    description: 'Triggers when a spell is reflected',
    parameters: [],
    entitiesAffected: ['self'],
    icon: 'ability_warrior_shieldreflection',
  },
  {
    id: 'spell_interrupted',
    name: 'Spell Interrupted',
    description: 'Triggers when a spell is interrupted',
    parameters: [],
    entitiesAffected: ['self', 'allies', 'enemies'],
    icon: 'ability_kick',
  },
  {
    id: 'counterspell',
    name: 'Counterspell',
    description: 'Triggers when a spell is countered',
    parameters: [],
    entitiesAffected: ['self', 'allies', 'enemies'],
    icon: 'spell_frost_iceshock',
  },
  {
    id: 'dispel',
    name: 'Dispel',
    description: 'Triggers when a buff or debuff is dispelled',
    parameters: [
      { name: 'effect_type', type: 'select', options: ['any', 'buff', 'debuff'], default: 'any' }
    ],
    entitiesAffected: ['self', 'allies', 'enemies'],
    icon: 'spell_holy_dispelmagic',
  }
];

const CLASS_SPECIFIC_TRIGGERS = [
  // Warrior
  {
    id: 'execute_range',
    name: 'Execute Range',
    description: 'Triggers when target falls below execute range',
    parameters: [
      { name: 'health_percent', type: 'number', unit: '%', default: 20 }
    ],
    entitiesAffected: ['enemies'],
    class: 'warrior',
    icon: 'ability_warrior_execute',
  },
  // Paladin
  {
    id: 'divine_shield',
    name: 'Divine Shield',
    description: 'Triggers when Divine Shield is activated or expires',
    parameters: [
      { name: 'trigger_on', type: 'select', options: ['activation', 'expiration'], default: 'activation' }
    ],
    entitiesAffected: ['self'],
    class: 'paladin',
    icon: 'spell_holy_divineshield',
  },
  // Mage
  {
    id: 'arcane_charges',
    name: 'Arcane Charges',
    description: 'Triggers when reaching a specific number of Arcane Charges',
    parameters: [
      { name: 'charges', type: 'number', default: 4 }
    ],
    entitiesAffected: ['self'],
    class: 'mage',
    icon: 'spell_arcane_arcane01',
  },
  // Rogue
  {
    id: 'stealth_break',
    name: 'Stealth Break',
    description: 'Triggers when stealth is broken',
    parameters: [],
    entitiesAffected: ['self'],
    class: 'rogue',
    icon: 'ability_stealth',
  },
  // Priest
  {
    id: 'shadow_form',
    name: 'Shadow Form',
    description: 'Triggers when entering or leaving Shadow Form',
    parameters: [
      { name: 'state', type: 'select', options: ['enter', 'leave'], default: 'enter' }
    ],
    entitiesAffected: ['self'],
    class: 'priest',
    icon: 'spell_shadow_shadowform',
  },
  // Hunter
  {
    id: 'pet_status',
    name: 'Pet Status',
    description: 'Triggers on pet status changes',
    parameters: [
      { name: 'status', type: 'select', options: ['summoned', 'dismissed', 'died'], default: 'died' }
    ],
    entitiesAffected: ['pets'],
    class: 'hunter',
    icon: 'ability_hunter_beastcall',
  },
  // Warlock
  {
    id: 'soul_shard',
    name: 'Soul Shard',
    description: 'Triggers when gaining or spending Soul Shards',
    parameters: [
      { name: 'action', type: 'select', options: ['gain', 'spend'], default: 'gain' },
      { name: 'count', type: 'number', default: 1 }
    ],
    entitiesAffected: ['self'],
    class: 'warlock',
    icon: 'inv_misc_gem_amethyst_02',
  },
  // Druid
  {
    id: 'shapeshift',
    name: 'Shapeshift',
    description: 'Triggers when shapeshifting',
    parameters: [
      { name: 'form', type: 'select', options: ['any', 'bear', 'cat', 'travel', 'moonkin', 'tree'], default: 'any' }
    ],
    entitiesAffected: ['self'],
    class: 'druid',
    icon: 'ability_druid_catform',
  }
];

const TRIGGER_CATEGORIES = [
  {
    id: 'proximity',
    name: 'Proximity',
    description: 'Triggers based on spatial relationships',
    triggers: PROXIMITY_TRIGGERS,
    icon: 'ability_hunter_markedfordeath'
  },
  {
    id: 'status',
    name: 'Status Effects',
    description: 'Triggers related to status effects and conditions',
    triggers: STATUS_TRIGGERS,
    icon: 'spell_holy_wordfortitude'
  },
  {
    id: 'combat',
    name: 'Combat',
    description: 'Triggers related to combat actions',
    triggers: COMBAT_TRIGGERS,
    icon: 'ability_warrior_challange'
  },
  {
    id: 'resource',
    name: 'Resources',
    description: 'Triggers based on resource management',
    triggers: RESOURCE_TRIGGERS,
    icon: 'inv_misc_gem_pearl_03'
  },
  {
    id: 'turn_based',
    name: 'Turn Based',
    description: 'Triggers on specific turns or rounds',
    triggers: TURN_BASED_TRIGGERS,
    icon: 'ability_warrior_decisivestrike'
  },
  {
    id: 'movement',
    name: 'Movement',
    description: 'Triggers related to character movement',
    triggers: MOVEMENT_TRIGGERS,
    icon: 'ability_rogue_sprint'
  },
  {
    id: 'spell_based',
    name: 'Spell Based',
    description: 'Triggers based on spell interactions',
    triggers: SPELL_BASED_TRIGGERS,
    icon: 'spell_holy_holybolt'
  },
  {
    id: 'class_specific',
    name: 'Class Specific',
    description: 'Class-specific triggers',
    triggers: CLASS_SPECIFIC_TRIGGERS,
    icon: 'achievement_character_nightelf_male'
  }
];

const TRIGGER_OPERATORS = [
  {
    id: 'equals',
    name: 'Equals',
    symbol: '=',
    description: 'The value equals exactly'
  },
  {
    id: 'not_equals',
    name: 'Not Equals',
    symbol: '≠',
    description: 'The value does not equal'
  },
  {
    id: 'greater_than',
    name: 'Greater Than',
    symbol: '>',
    description: 'The value is greater than'
  },
  {
    id: 'less_than',
    name: 'Less Than',
    symbol: '<',
    description: 'The value is less than'
  },
  {
    id: 'greater_than_or_equal',
    name: 'Greater Than or Equal',
    symbol: '≥',
    description: 'The value is greater than or equal to'
  },
  {
    id: 'less_than_or_equal',
    name: 'Less Than or Equal',
    symbol: '≤',
    description: 'The value is less than or equal to'
  },
  {
    id: 'contains',
    name: 'Contains',
    symbol: '∋',
    description: 'The value contains'
  },
  {
    id: 'not_contains',
    name: 'Does Not Contain',
    symbol: '∌',
    description: 'The value does not contain'
  }
];

const TriggerUtils = {
  // Gets all triggers from all categories
  getAllTriggers: () => {
    let allTriggers = [];
    TRIGGER_CATEGORIES.forEach(category => {
      allTriggers = [...allTriggers, ...category.triggers];
    });
    return allTriggers;
  },

  // Find a trigger by ID
  getTriggerById: (triggerId) => {
    const allTriggers = TriggerUtils.getAllTriggers();
    return allTriggers.find(trigger => trigger.id === triggerId);
  },

  // Get triggers by category ID
  getTriggersByCategory: (categoryId) => {
    const category = TRIGGER_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.triggers : [];
  },

  // Get category for a trigger
  getCategoryForTrigger: (triggerId) => {
    return TRIGGER_CATEGORIES.find(category =>
      category.triggers.some(trigger => trigger.id === triggerId)
    );
  },

  // Get available entities that can be affected by a trigger
  getAffectedEntitiesForTrigger: (triggerId) => {
    const trigger = TriggerUtils.getTriggerById(triggerId);
    return trigger ? trigger.entitiesAffected : [];
  },

  // Get operator by ID
  getOperatorById: (operatorId) => {
    return TRIGGER_OPERATORS.find(op => op.id === operatorId);
  },

  // Check if a trigger is available for a specific class
  isTriggerAvailableForClass: (triggerId, characterClass) => {
    const trigger = TriggerUtils.getTriggerById(triggerId);
    if (!trigger) return false;
    if (!trigger.class) return true; // Available to all classes
    return trigger.class === characterClass;
  },

  // Generate display text for a trigger condition
  getConditionDisplayText: (condition) => {
    if (!condition) return '';

    const trigger = TriggerUtils.getTriggerById(condition.triggerId);
    const operator = TriggerUtils.getOperatorById(condition.operator);

    if (!trigger) return 'Invalid trigger';

    let text = `When ${trigger.name}`;

    if (condition.targetEntity) {
      text += ` on ${condition.targetEntity}`;
    }

    if (condition.parameterValues && Object.keys(condition.parameterValues).length > 0) {
      if (operator) {
        text += ` ${operator.symbol} `;
      }

      // Format parameter values
      const paramTexts = [];
      Object.entries(condition.parameterValues).forEach(([key, value]) => {
        const param = trigger.parameters?.find(p => p.name === key);
        if (param) {
          let valueText = value;
          if (param.type === 'select' && param.options) {
            // Format select options nicely
            valueText = value.replace(/_/g, ' ');
          }
          if (param.unit) {
            valueText += ` ${param.unit}`;
          }
          paramTexts.push(`${key.replace(/_/g, ' ')}: ${valueText}`);
        }
      });

      if (paramTexts.length > 0) {
        text += paramTexts.join(', ');
      }
    }

    return text;
  }
};

export {
  TARGETING_TYPES,
  AOE_SHAPES,
  TARGETING_VISUALIZATION,
  getTargetingTypeById,
  getAoeShapeById,
  getTargetingActionPointModifier,
  isMultiTarget,
  calculateAoeArea,
  getMaxTargets,
  feetToGrid,
  gridDistance,
  isPointInAoe,
  getTargetingTypeDetails,
  PROXIMITY_TRIGGERS,
  STATUS_TRIGGERS,
  COMBAT_TRIGGERS,
  RESOURCE_TRIGGERS,
  TURN_BASED_TRIGGERS,
  MOVEMENT_TRIGGERS,
  SPELL_BASED_TRIGGERS,
  CLASS_SPECIFIC_TRIGGERS,
  TRIGGER_CATEGORIES,
  TRIGGER_OPERATORS,
  TriggerUtils
};