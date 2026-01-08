
const TARGETING_TYPES = [
    {
      id: 'single',
      name: 'Single Target',
      description: 'Affects one specific target',
      icon: 'ability_hunter_snipershot',
      actionPointModifier: 0
    },
    {
      id: 'multi',
      name: 'Multiple Targets',
      description: 'Affects several individually selected targets',
      icon: 'spell_frost_chainofdamnation',
      actionPointModifier: 1
    },
    {
      id: 'area',
      name: 'Area of Effect',
      description: 'Affects all targets within a defined area',
      icon: 'spell_fire_flamestrike',
      actionPointModifier: 1
    },
    {
      id: 'chain',
      name: 'Chain Effect',
      description: 'Effect jumps from one target to nearby targets',
      icon: 'spell_frost_chainheal',
      actionPointModifier: 2
    },
    {
      id: 'cone',
      name: 'Cone',
      description: 'Affects targets in a cone-shaped area',
      icon: 'spell_fire_flamegeyser',
      actionPointModifier: 1
    },
    {
      id: 'line',
      name: 'Line',
      description: 'Affects targets in a line',
      icon: 'spell_arcane_starfire',
      actionPointModifier: 1
    },
    {
      id: 'self',
      name: 'Self',
      description: 'Only affects the caster',
      icon: 'spell_holy_powerwordshield',
      actionPointModifier: -1
    },
    {
      id: 'smart',
      name: 'Smart Targeting',
      description: 'Automatically selects targets based on parameters',
      icon: 'spell_holy_divineillumination',
      actionPointModifier: 2
    },
    {
      id: 'nearest',
      name: 'Nearest Target',
      description: 'Automatically targets the nearest valid target',
      icon: 'ability_hunter_markedfordeath',
      actionPointModifier: 0
    }
];

const AOE_SHAPES = [
    {
      id: 'none',
      name: 'None',
      description: 'No area of effect - single point impact',
      icon: 'inv_misc_questionmark',
      parameterType: 'none'
    },
    {
      id: 'circle',
      name: 'Circle',
      description: 'Affects all targets within a circular area',
      icon: 'spell_holy_circleofrenewal',
      defaultRadius: 20,
      parameterType: 'radius'
    },
    {
      id: 'square',
      name: 'Square',
      description: 'Affects all targets within a square area',
      icon: 'inv_misc_gem_diamond_02',
      defaultSize: 15,
      parameterType: 'sideLength'
    },
    {
      id: 'cone',
      name: 'Cone',
      description: 'Affects targets in a cone-shaped area extending from the caster',
      icon: 'inv_throwingaxe_03',
      defaultRange: 15,
      defaultAngle: 90,
      parameterType: 'rangeAngle'
    },
    {
      id: 'line',
      name: 'Line',
      description: 'Affects targets in a straight line from the caster',
      icon: 'inv_weapon_bow_07',
      defaultLength: 30,
      defaultWidth: 5,
      parameterType: 'lengthWidth'
    },
    {
      id: 'cube',
      name: 'Cube',
      description: 'Affects all targets within a three-dimensional cube',
      icon: 'inv_misc_gem_diamond_01',
      defaultSize: 15,
      parameterType: 'sideLength'
    },
    {
      id: 'sphere',
      name: 'Sphere',
      description: 'Affects all targets within a three-dimensional sphere',
      icon: 'inv_misc_orb_01',
      defaultRadius: 20,
      parameterType: 'radius'
    },
    {
      id: 'cylinder',
      name: 'Cylinder',
      description: 'Affects all targets within a cylinder',
      icon: 'spell_holy_circleofrenewal',
      defaultRadius: 10,
      defaultHeight: 20,
      parameterType: 'radiusHeight'
    },
    {
      id: 'wall',
      name: 'Wall',
      description: 'Creates a wall-shaped effect',
      icon: 'spell_holy_powerwordbarrier',
      defaultLength: 30,
      defaultHeight: 10,
      defaultWidth: 5,
      parameterType: 'lengthHeightWidth'
    },
    {
      id: 'trail',
      name: 'Movement Trail',
      description: 'Creates a trail of effects along a movement path',
      icon: 'spell_nature_wispsplode',
      defaultWidth: 5,
      defaultDuration: 10,
      parameterType: 'widthDuration'
    }
];


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

const isAutoTarget = (id) => {
    return ['nearest', 'smart'].includes(id);
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

        case 'trail':
            const trailWidth = parameters.width || shape.defaultWidth;
            const trailDuration = parameters.duration || shape.defaultDuration;
            const trailLength = parameters.length || 30; // Estimated average movement distance
            area = trailLength * trailWidth; // 2D area covered by the trail
            affectedSquares = Math.ceil(area / (gridSize * gridSize));
            return { area, affectedSquares, width: trailWidth, duration: trailDuration, length: trailLength };

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

        case 'nearest':
            return 1; // Nearest target always selects exactly one target

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

        case 'trail':
            // For trails, target count depends on the length of the movement path
            const trailWidth = parameters.width || 5;
            const trailLength = parameters.length || 30; // Estimated average movement distance
            const trailArea = trailLength * trailWidth;
            const standardGridSize = 5; // Standard grid size in feet
            const trailSquares = Math.ceil(trailArea / (standardGridSize * standardGridSize));
            const trailDensity = parameters.creatureDensity || 0.15; // Lower density than area effects

            return Math.max(1, Math.ceil(trailSquares * trailDensity));

        default:
            return 0;
    }
};

export {
    TARGETING_TYPES,
    AOE_SHAPES,
    getTargetingTypeById,
    getAoeShapeById,
    getTargetingActionPointModifier,
    isMultiTarget,
    isAutoTarget,
    calculateAoeArea,
    getMaxTargets
};