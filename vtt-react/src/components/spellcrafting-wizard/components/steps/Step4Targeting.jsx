import React, { useState, useEffect, useRef } from 'react';
import {
  useSpellWizardState,
  useSpellWizardDispatch,
  actionCreators,
  validateStepCompletion
} from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
// TargetingGrid component removed
import TagBasedTargeting from '../targeting/TagBasedTargeting';

import '../../styles/Step4Targeting.css';
import '../../styles/effects/unified-effects.css';
import {
  TARGETING_TYPES as ALL_TARGETING_TYPES,
  AOE_SHAPES,
  getTargetingTypeById,
  getAoeShapeById,
  calculateAoeArea,
  getMaxTargets,
  isMultiTarget
} from '../../core/data/targetingTypes';
import {
  FaProjectDiagram,
  FaRandom,
  FaSearchLocation,
  FaBomb,
  FaFireAlt,
  FaRecycle,
  FaSnowflake,
  FaWind,
  FaShareAlt
} from 'react-icons/fa';


// Filter out targeting types that are redundant with AOE shapes or selection methods
const TARGETING_TYPES = [
  ...ALL_TARGETING_TYPES.filter(type =>
    !['cone', 'line', 'self', 'smart', 'nearest'].includes(type.id)
  ),
  // Add self-centered as a targeting type
  {
    id: 'self_centered',
    name: 'Self-Centered',
    description: 'Effect emanates from the caster',
    icon: 'spell_arcane_blast',
    actionPointModifier: 0
  }
];

// Targeting restrictions options
const TARGET_RESTRICTIONS = [
  { id: 'any', name: 'Any Target', icon: 'spell_shadow_possession', description: 'Can target any valid entity' },
  { id: 'ally', name: 'Allies', icon: 'spell_holy_prayerofspirit', description: 'Can target friendly characters' },
  { id: 'enemy', name: 'Enemies', icon: 'ability_rogue_findweakness', description: 'Can target hostile characters' },
  { id: 'self', name: 'Self', icon: 'spell_holy_innerfire', description: 'Can target the caster' },
  { id: 'creature', name: 'Creatures', icon: 'inv_misc_head_dragon_01', description: 'Can target living beings' },
  { id: 'object', name: 'Objects', icon: 'inv_misc_drum_01', description: 'Can target inanimate objects' },
  { id: 'undead', name: 'Undead', icon: 'spell_shadow_shadetruesight', description: 'Can target undead entities' },
  { id: 'construct', name: 'Constructs', icon: 'inv_misc_pocketwatch_01', description: 'Can target constructed entities' },
  { id: 'location', name: 'Location', icon: 'spell_nature_wispsplode', description: 'Targets a location rather than an entity' },
  { id: 'friendly_player', name: 'Friendly Players', icon: 'spell_holy_devotionaura', description: 'Can target friendly player characters' },
  { id: 'friendly_npc', name: 'Friendly NPCs', icon: 'spell_holy_sealofwisdom', description: 'Can target friendly non-player characters' },
  { id: 'hostile_player', name: 'Hostile Players', icon: 'ability_warrior_challange', description: 'Can target hostile player characters' },
  { id: 'hostile_npc', name: 'Hostile NPCs', icon: 'ability_creature_cursed_04', description: 'Can target hostile non-player characters' },
  { id: 'elemental', name: 'Elementals', icon: 'spell_fire_elemental_totem', description: 'Can target elemental entities' },
  { id: 'demon', name: 'Demons', icon: 'spell_shadow_summonfelhunter', description: 'Can target demonic entities' },
  { id: 'beast', name: 'Beasts', icon: 'ability_hunter_pet_bear', description: 'Can target beast entities' }
];

// Target selection methods
const TARGET_SELECTION_METHODS = [
  { id: 'manual', name: 'Manual Selection', description: 'Manually select targets during casting', icon: 'ability_hunter_snipershot' },
  { id: 'nearest', name: 'Nearest Target', description: 'Automatically targets the nearest valid target', icon: 'ability_hunter_markedfordeath' },
  { id: 'farthest', name: 'Farthest Target', description: 'Automatically targets the farthest valid target in range', icon: 'ability_hunter_longshots' },
  { id: 'random', name: 'Random Target', description: 'Selects a random valid target in range', icon: 'ability_rogue_blindingpowder' },
  { id: 'lowest_health', name: 'Lowest Health', description: 'Targets the valid target with the lowest health', icon: 'inv_misc_bandage_15' },
  { id: 'highest_health', name: 'Highest Health', description: 'Targets the valid target with the highest health', icon: 'spell_holy_sealofsacrifice' }
];

// Range type options
const RANGE_TYPES = [
  { id: 'touch', name: 'Touch', description: 'Must touch the target', distance: 5, icon: 'spell_holy_blessingofstrength' },
  { id: 'ranged', name: 'Ranged', description: 'Can target at a specific range', distance: 30, icon: 'ability_hunter_mastermarksman' },
  { id: 'sight', name: 'Sight', description: 'Can target anything you can see', distance: 60, icon: 'spell_holy_sealofsalvation' },
  { id: 'unlimited', name: 'Unlimited', description: 'No range limit', distance: -1, icon: 'spell_arcane_mindmastery' }
];

// Propagation methods
const PROPAGATION_METHODS = [
  {
    id: 'none',
    name: 'No Propagation',
    icon: 'inv_misc_gem_pearl_03',
    description: 'The spell only affects its primary target(s) and does not propagate further.',
    effects: ['Predictable targeting', 'No additional targets']
  },
  {
    id: 'chain',
    name: 'Chain Effect',
    icon: 'spell_frost_chainofdamnation',
    description: 'The spell automatically jumps from one target to another in sequence.',
    effects: ['Each jump does reduced effect', 'Controllable max number of targets', 'Predictable path']
  },
  {
    id: 'bounce',
    name: 'Bounce Effect',
    icon: 'spell_arcane_arcane04',
    description: 'The spell bounces unpredictably between multiple targets in range.',
    effects: ['Unpredictable targeting', 'Each bounce can hit the same target', 'Good for crowded areas']
  },
  {
    id: 'seeking',
    name: 'Seeking Effect',
    icon: 'ability_hunter_markedshot',
    description: 'The spell actively searches for valid targets within range.',
    effects: ['Ignores obstacles', 'Prioritizes certain target types', 'Can find hidden targets']
  },
  {
    id: 'explosion',
    name: 'Explosion on Impact',
    icon: 'spell_fire_fireball02',
    description: 'The spell creates a secondary explosion when it hits its target.',
    effects: ['Secondary AoE damage', 'Affects surrounding targets', 'Good for clustered enemies']
  },
  {
    id: 'spreading',
    name: 'Spreading Effect',
    icon: 'spell_fire_fire',
    description: 'The spell effect gradually spreads to adjacent targets or areas over time.',
    effects: ['Covers increasing area', 'Delayed full effect', 'Good for zoning and control']
  },
  {
    id: 'forking',
    name: 'Forking Paths',
    icon: 'spell_arcane_blast',
    description: 'The spell splits into multiple projectiles that can hit different targets.',
    effects: ['Multiple simultaneous targets', 'Reduced effect per fork', 'Good for crowd damage']
  }
];

// Propagation behaviors
const PROPAGATION_BEHAVIORS = {
  'chain': [
    { id: 'nearest', name: 'Nearest Target', description: 'Chains to the closest eligible target', icon: 'ability_hunter_markedshot' },
    { id: 'farthest', name: 'Farthest Target', description: 'Chains to the farthest eligible target within range', icon: 'ability_hunter_longshots' },
    { id: 'random', name: 'Random Target', description: 'Chains to a random eligible target within range', icon: 'ability_rogueblind' },
    { id: 'lowest_health', name: 'Lowest Health', description: 'Chains to the eligible target with the lowest health', icon: 'inv_misc_bandage_15' },
    { id: 'highest_health', name: 'Highest Health', description: 'Chains to the eligible target with the highest health', icon: 'inv_shield_04' }
  ],
  'bounce': [
    { id: 'random', name: 'Random Bounce', description: 'Bounces in unpredictable patterns', icon: 'spell_nature_wispsplode' },
    { id: 'nearest', name: 'Proximity Bounce', description: 'Tends to bounce to nearby targets', icon: 'spell_arcane_blink' },
    { id: 'ricocheting', name: 'Ricocheting', description: 'Can bounce off walls and objects', icon: 'ability_warrior_riposte' },
    { id: 'accelerating', name: 'Accelerating', description: 'Each bounce is faster and more powerful', icon: 'spell_magic_lesserinvisibilty' },
    { id: 'decelerating', name: 'Decelerating', description: 'Each bounce is slower and less powerful', icon: 'spell_arcane_arcane04' }
  ],
  'seeking': [
    { id: 'aggressive', name: 'Aggressive Seeking', description: 'Actively hunts down the strongest eligible targets', icon: 'ability_hunter_snipershot' },
    { id: 'opportunistic', name: 'Opportunistic', description: 'Targets the most vulnerable eligible targets', icon: 'ability_rogue_findweakness' },
    { id: 'thorough', name: 'Thorough', description: 'Seeks out all eligible targets methodically', icon: 'inv_misc_spyglass_02' },
    { id: 'prioritized', name: 'Prioritized', description: 'Follows a strict targeting priority order', icon: 'inv_misc_book_11' },
    { id: 'intelligent', name: 'Intelligent', description: 'Dynamically adjusts targeting based on battlefield conditions', icon: 'spell_arcane_mindmastery' }
  ],
  'explosion': [
    { id: 'standard', name: 'Standard Explosion', description: 'Simple explosion with equal effect in all directions', icon: 'spell_fire_flamebolt' },
    { id: 'shaped', name: 'Shaped Charge', description: 'Explosion is directed in a specific pattern', icon: 'spell_fire_selfdestruct' },
    { id: 'delayed', name: 'Delayed Explosion', description: 'Explosion occurs after a short delay', icon: 'spell_fire_fireball02' },
    { id: 'chain_reaction', name: 'Chain Reaction', description: 'Can trigger secondary explosions', icon: 'spell_fire_burnout' },
    { id: 'elemental', name: 'Elemental Burst', description: 'Explosion includes elemental effects', icon: 'spell_fire_volcano' }
  ],
  'spreading': [
    { id: 'contagion', name: 'Contagion', description: 'Spreads like a disease from one target to adjacent targets', icon: 'spell_shadow_plaguecloud' },
    { id: 'expanding', name: 'Expanding', description: 'Gradually expands outward in all directions', icon: 'spell_shadow_shadowfury' },
    { id: 'creeping', name: 'Creeping', description: 'Slowly moves across surfaces and around obstacles', icon: 'spell_shadow_curseofmannoroth' },
    { id: 'pulsing', name: 'Pulsing', description: 'Emits periodic pulses that apply effects', icon: 'spell_arcane_blast' },
    { id: 'consuming', name: 'Consuming', description: 'Grows stronger as it spreads and consumes resources', icon: 'spell_shadow_burningspirit' }
  ],
  'forking': [
    { id: 'equal', name: 'Equal Split', description: 'Splits into equal forks with equal power', icon: 'spell_arcane_arcanetorrent' },
    { id: 'random', name: 'Random Split', description: 'Splits in random directions with varying power', icon: 'spell_arcane_starfire' },
    { id: 'targeted', name: 'Targeted Split', description: 'Forks seek out specific types of targets', icon: 'ability_hunter_disruptingshot' },
    { id: 'cascading', name: 'Cascading Split', description: 'Each fork can split again into smaller forks', icon: 'spell_arcane_blast' },
    { id: 'converging', name: 'Converging', description: 'Forks eventually converge on a single point', icon: 'spell_arcane_focusedpower' }
  ]
};

// Grid constants for visualization
const GRID_SIZE = 20; // Size of each grid cell in pixels
const GRID_CELLS = 21; // Number of cells in each direction (should be odd to have a center)
const CENTER_CELL = Math.floor(GRID_CELLS / 2); // Center cell index

const Step4Targeting = ({ onNext, onPrevious, stepNumber, totalSteps }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const canvasRef = useRef(null);

  // Initialize Pathfinder tooltips


  // Get existing targeting configuration
  const { targetingConfig, spellType, effectTypes, propagation } = state;

  // Local state to track form values - Targeting
  const [targetingType, setTargetingType] = useState(targetingConfig.targetingType || '');
  const [targetRestrictions, setTargetRestrictions] = useState(targetingConfig.targetRestrictions || ['any']);
  const [maxTargets, setMaxTargets] = useState(targetingConfig.maxTargets || 3);
  const [selectionMethod, setSelectionMethod] = useState(targetingConfig.selectionMethod || 'manual');
  const [targetSelectionMethod, setTargetSelectionMethod] = useState(targetingConfig.targetSelectionMethod || 'manual');
  const [aoeShape, setAoeShape] = useState(targetingConfig.aoeShape || 'circle');
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [aoeParameters, setAoeParameters] = useState(targetingConfig.aoeParameters || {
    radius: 20,
    size: 15,
    range: 15,
    angle: 90,
    length: 30,
    width: 5,
    height: 20
  });
  const [rangeType, setRangeType] = useState(targetingConfig.rangeType || 'touch');
  const [rangeDistance, setRangeDistance] = useState(targetingConfig.rangeDistance || 30);
  const [errors, setErrors] = useState({});
  const [hoveredCell, setHoveredCell] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null);
  const [centerCellX, setCenterCellX] = useState(Math.floor(GRID_CELLS / 2));
  const [centerCellY, setCenterCellY] = useState(Math.floor(GRID_CELLS / 2));

  // Store previous positions for the trail
  const [trailPositions, setTrailPositions] = useState([]);

  // Movement behavior for zone spells and trails
  const [movementBehavior, setMovementBehavior] = useState(targetingConfig.movementBehavior || 'static');

  // Check if we're configuring a zone spell
  const isZoneSpell = spellType === 'ZONE';

  // For debugging
  useEffect(() => {
    console.log("State typeConfig:", state.typeConfig);
    console.log("Leave Trail enabled:", state.typeConfig?.leaveTrail);
  }, [state.typeConfig]);

  // Local state to track form values - Propagation
  const [selectedPropagation, setSelectedPropagation] = useState(propagation?.method || 'none');
  const [selectedBehavior, setSelectedBehavior] = useState(propagation?.behavior || '');
  const [propagationCount, setPropagationCount] = useState(propagation?.parameters?.count || 3);
  const [propagationRange, setPropagationRange] = useState(propagation?.parameters?.range || 20);
  const [propagationDecay, setPropagationDecay] = useState(propagation?.parameters?.decay || 20);
  const [secondaryRadius, setSecondaryRadius] = useState(propagation?.parameters?.secondaryRadius || 10);
  const [spreadRate, setSpreadRate] = useState(propagation?.parameters?.spreadRate || 5);
  const [forkCount, setForkCount] = useState(propagation?.parameters?.forkCount || 3);

  // Propagation visualization
  const [dummyTargets, setDummyTargets] = useState([]);
  const [animationActive, setAnimationActive] = useState(false);
  const [animationTimer, setAnimationTimer] = useState(null);

  // Filter out targeting types that don't make sense for the current spell type
  const availableTargetingTypes = TARGETING_TYPES.filter(type => {
    // For passive spells, only self targeting makes sense
    if (spellType === 'PASSIVE' && type.id !== 'self') {
      return false;
    }

    // For reactive spells, consider the trigger type
    if (spellType === 'REACTION') {
      // Add more specific logic based on trigger types if needed
      return true;
    }

    return true;
  });

  // When targeting type changes, set appropriate defaults
  useEffect(() => {
    if (targetingType === 'self') {
      setTargetRestrictions(['self']);
      setSelectedPropagation('none'); // Self-targeting spells cannot propagate
    } else if (targetingType === 'area') {
      // Default to circle for area effects if not already set
      if (!aoeShape) {
        setAoeShape('circle');
        setAoeParameters({
          ...aoeParameters,
          radius: 20
        });
      }
    }
  }, [targetingType, aoeShape]);

  // Automatically set target position for self-centered spells
  useEffect(() => {
    if (rangeType === 'self_centered' && targetingType === 'area') {
      const initialPosition = { x: centerCellX, y: centerCellY };
      setTargetPosition(initialPosition);

      // Initialize the trail with the starting position if leaveTrail is enabled
      if (state.typeConfig?.leaveTrail) {
        console.log("Initializing trail with starting position:", initialPosition);
        setTrailPositions([{ ...initialPosition }]);
      }
    } else if (state.typeConfig?.leaveTrail && targetPosition) {
      // For other targeting types, initialize the trail with the current target position
      console.log("Initializing trail with current target position:", targetPosition);
      setTrailPositions([{ ...targetPosition }]);
    }
  }, [rangeType, targetingType, centerCellX, centerCellY, state.typeConfig?.leaveTrail, targetPosition]);

  // Calculate area stats when area parameters change
  const areaStats = targetingType === 'area' && aoeShape
    ? calculateAoeArea(aoeShape, aoeParameters)
    : null;

  // Calculate maximum targets based on configuration
  const estimatedTargets = targetingType && (targetingType !== 'single' && targetingType !== 'self')
    ? getMaxTargets(
        targetingType,
        targetingType === 'area' ? aoeShape : null,
        targetingType === 'area' ? aoeParameters : { maxTargets }
      )
    : 1;

  // Validate the targeting configuration
  useEffect(() => {
    const newErrors = {};

    if (!targetingType) {
      newErrors.targetingType = 'Please select a targeting type';
    }

    if (targetingType === 'multi' && (!maxTargets || maxTargets < 1)) {
      newErrors.maxTargets = 'Please specify a valid number of targets';
    }

    if (targetingType === 'area' && !aoeShape) {
      newErrors.aoeShape = 'Please select an area shape';
    }

    if (rangeType === 'ranged' && (!rangeDistance || rangeDistance <= 0)) {
      newErrors.rangeDistance = 'Please specify a valid range distance';
    }

    if (selectedPropagation !== 'none' && !selectedBehavior) {
      newErrors.propagationBehavior = 'Please select a propagation behavior';
    }

    setErrors(newErrors);
  }, [targetingType, maxTargets, aoeShape, rangeType, rangeDistance, selectedPropagation, selectedBehavior]);

  // Handle form submission
  const handleSubmit = () => {
    // Validation
    const newErrors = {};

    if (!targetingType) {
      newErrors.targetingType = 'Please select a targeting type';
    }

    if (targetingType === 'area' && !aoeShape) {
      newErrors.aoeShape = 'Please select an AoE shape';
    }

    if (!rangeType) {
      newErrors.rangeType = 'Please select a range type';
    }

    if (rangeType === 'ranged' && (!rangeDistance || rangeDistance <= 0)) {
      newErrors.rangeDistance = 'Please enter a valid range distance';
    }

    if (selectedPropagation !== 'none' && !selectedBehavior) {
      newErrors.propagationBehavior = 'Please select a propagation behavior';
    }

    if (Object.keys(newErrors).length === 0) {
      // Form is valid, save configuration
      const config = {
        targetingType,
        targetRestrictions,
        maxTargets: targetingType === 'multi' ? maxTargets : 1,
        // Use the selected method for both single and multi-target spells
        selectionMethod: (targetingType === 'multi' || targetingType === 'single') ? selectionMethod : 'manual',
        // Also save targetSelectionMethod for consistency
        targetSelectionMethod: targetSelectionMethod,
        aoeShape: targetingType === 'area' ? aoeShape : '',
        aoeParameters: targetingType === 'area' ? aoeParameters : {},
        rangeType,
        rangeDistance: rangeType === 'ranged' ? rangeDistance :
                      rangeType === 'touch' ? 5 :
                      rangeType === 'sight' ? 60 :
                      rangeType === 'self_centered' ? 0 : -1
      };

      // Dispatch action to update the targeting configuration
      dispatch(actionCreators.updateTargetingConfig(config));

      // Also update the propagation configuration
      const propagationConfig = {
        method: selectedPropagation,
        behavior: selectedBehavior,
        parameters: {
          count: propagationCount,
          range: propagationRange,
          decay: propagationDecay,
          secondaryRadius: secondaryRadius,
          spreadRate: spreadRate,
          forkCount: forkCount
        }
      };

      dispatch(actionCreators.updatePropagation(propagationConfig));

      // If we're in unified mode, make sure all effects use the spell's targeting
      if (state.targetingMode === 'unified') {
        // Nothing to do, all effects will use the spell's targeting
      } else {
        // Make sure all effect types have targeting tags
        const DEFAULT_TAGS = {
          damage: ['enemy'],
          healing: ['ally', 'self'],
          buff: ['ally', 'self'],
          debuff: ['enemy'],
          control: ['enemy'],
          utility: ['any']
        };

        // Initialize targeting tags for any effect types that don't have them yet
        const newTargetingTags = {};

        effectTypes.forEach(effectType => {
          if (!state.targetingTags[effectType]) {
            newTargetingTags[effectType] = {
              targetRestrictions: DEFAULT_TAGS[effectType] || ['any']
            };
          }
        });

        if (Object.keys(newTargetingTags).length > 0) {
          dispatch(actionCreators.updateTargetingTags(newTargetingTags));
        }
      }

      // Move to the next step
      onNext();
    } else {
      setErrors(newErrors);
    }
  };

  // Update a specific AoE parameter
  const updateAoeParameter = (paramName, value) => {
    setAoeParameters(prev => {
      const updatedParams = {
        ...prev,
        [paramName]: value
      };

      // Update the global state immediately
      const config = {
        ...targetingConfig,
        aoeParameters: updatedParams
      };
      dispatch(actionCreators.updateTargetingConfig(config));

      return updatedParams;
    });
  };

  // Helper function to get effect icons
  const getEffectIconUrl = (effectType) => {
    // Map effect types to WoW icon IDs
    const effectIcons = {
      'damage': 'spell_fire_flameshock',
      'healing': 'spell_holy_flashheal',
      'buff': 'spell_holy_blessingofprotection',
      'debuff': 'spell_shadow_curseofsargeras',
      'control': 'spell_frost_chainsofice',
      'utility': 'spell_arcane_portaldalaran',
      'summon': 'spell_shadow_summoninfernal',
      'transform': 'spell_nature_polymorph',
      'purification': 'spell_holy_dispelmagic',
      'restoration': 'spell_holy_renew'
    };

    return `https://wow.zamimg.com/images/wow/icons/large/${effectIcons[effectType] || 'inv_misc_questionmark'}.jpg`;
  };

  // Helper function to calculate distance between two points
  const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return 0;
    // Grid cells are 5ft each
    const distX = Math.abs(point1.x - point2.x) * 5;
    const distY = Math.abs(point1.y - point2.y) * 5;
    return Math.round(Math.sqrt(distX * distX + distY * distY));
  };

  // Helper function to determine effect strength at a cell
  const getEffectStrength = (cell) => {
    if (!cell) return 'None';
    if (!targetPosition) return 'Full';

    // Check if this is the direct target
    if (cell.x === targetPosition.x && cell.y === targetPosition.y) {
      return 'Full (100%)';
    }

    // For area effects, calculate based on distance from target
    if (targetingType === 'area' && aoeShape) {
      const distance = calculateDistance(targetPosition, cell);

      // Different shapes have different effect strength calculations
      if (aoeShape === 'circle' || aoeShape === 'sphere') {
        const radius = (aoeParameters.radius || 20);
        if (distance <= radius) {
          return 'Full (100%)';
        }
      } else if (aoeShape === 'square' || aoeShape === 'cube') {
        const size = (aoeParameters.size || 15) / 2;
        const distX = Math.abs(targetPosition.x - cell.x) * 5;
        const distY = Math.abs(targetPosition.y - cell.y) * 5;
        if (distX <= size && distY <= size) {
          return 'Full (100%)';
        }
      }
      // Add other shape calculations as needed
    }

    // For propagation effects
    if (dummyTargets.some(t => t.x === cell.x && t.y === cell.y)) {
      const target = dummyTargets.find(t => t.x === cell.x && t.y === cell.y);
      if (target.damageModifier) {
        return `${Math.round(target.damageModifier * 100)}%`;
      }
      return 'Partial';
    }

    return 'None';
  };

  // Animation frame reference
  const animationRef = useRef(null);
  const [animationTime, setAnimationTime] = useState(0);

  // Animation loop for dynamic effects
  useEffect(() => {
    // Always start the animation if leaveTrail is enabled, regardless of other conditions
    const shouldAnimate = state.typeConfig?.leaveTrail ||
                         ((isZoneSpell || targetingType === 'self_centered') && movementBehavior !== 'static');

    if (shouldAnimate) {
      // Start animation loop - OPTIMIZED for performance
      let lastTime = 0;
      let lastUpdate = 0;
      const ANIMATION_THROTTLE = 50; // 20fps instead of 60fps

      const animate = (time) => {
        if (lastTime === 0) lastTime = time;

        // Throttle animation updates for better performance
        if (time - lastUpdate < ANIMATION_THROTTLE) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        const deltaTime = time - lastTime;
        lastTime = time;
        lastUpdate = time;

        // Update animation time (used for animated effects)
        setAnimationTime(prevTime => prevTime + deltaTime / 1000);

        // Continue animation loop
        animationRef.current = requestAnimationFrame(animate);
      };

      // Start animation
      animationRef.current = requestAnimationFrame(animate);

      // Cleanup
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isZoneSpell, targetingType, movementBehavior, state.typeConfig?.leaveTrail]);

  // Force canvas redraw when trail positions change
  useEffect(() => {
    // This effect ensures the canvas is redrawn when trail positions are updated
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Just trigger a redraw by accessing the context
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Log trail positions for debugging
    if (trailPositions.length > 0) {
      console.log("Trail positions updated:", trailPositions);
    }
  }, [trailPositions]);

  // Draw the targeting visualization on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellSize = GRID_SIZE;
    const width = GRID_CELLS * cellSize;
    const height = GRID_CELLS * cellSize;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.beginPath();
    ctx.strokeStyle = '#3d4455'; // var(--wizard-border)

    // Vertical lines
    for (let i = 0; i <= GRID_CELLS; i++) {
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
    }

    // Horizontal lines
    for (let i = 0; i <= GRID_CELLS; i++) {
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
    }

    ctx.stroke();

    // Draw the caster position
    const centerX = centerCellX * cellSize + cellSize / 2;
    const centerY = centerCellY * cellSize + cellSize / 2;

    // Draw caster circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, cellSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#0074e0'; // var(--wizard-primary)
    ctx.fill();
    ctx.strokeStyle = '#005bb1'; // var(--wizard-primary-dark)
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add caster icon
    ctx.fillStyle = '#ffffff'; // var(--wizard-text-bright)
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C', centerX, centerY);

    // We've moved the trail indicator to the target position instead of the caster

    // Draw movement behavior indicator for zone spells or trails
    if ((isZoneSpell || (targetingType === 'self_centered' && (aoeShape === 'trail' || state.typeConfig?.leaveTrail))) &&
        movementBehavior && movementBehavior !== 'static') {
      // Draw a visual indicator of the movement behavior
      ctx.font = '10px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';

      if (movementBehavior === 'follows_caster') {
        // Draw a dotted line connecting the caster to the zone/trail
        if (targetPosition) {
          const targetX = targetPosition.x * cellSize + cellSize / 2;
          const targetY = targetPosition.y * cellSize + cellSize / 2;

          // Animated dotted line
          const dashOffset = (animationTime * 15) % 12; // Animate the dash pattern
          ctx.beginPath();
          ctx.setLineDash([3, 3]);
          ctx.lineDashOffset = -dashOffset; // Negative to make it move toward the target
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(targetX, targetY);
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)'; // Gold with opacity
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);

          // Add trail indicator if leaveTrail is enabled - now on the target position
          if (state.typeConfig?.leaveTrail) {
            // Draw a glow around the target to indicate trail effect is enabled
            ctx.beginPath();
            ctx.arc(targetX, targetY, cellSize / 2 + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)';
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Add a small trail indicator text
            ctx.fillStyle = 'rgba(46, 204, 113, 1)';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('TRAIL', targetX, targetY - cellSize / 2 - 10);

            // Add trail duration text
            ctx.font = '9px Arial';
            ctx.fillText(`${state.typeConfig?.trailDuration || 3} ${state.typeConfig?.trailDurationUnit || 'rounds'}`, targetX, targetY - cellSize / 2 - 22);
          }

          // Draw a small label
          const midX = (centerX + targetX) / 2;
          const midY = (centerY + targetY) / 2;
          ctx.fillText('Follows', midX, midY - 10);

          // Draw small animated arrows along the path to indicate direction
          const distance = Math.sqrt(Math.pow(targetX - centerX, 2) + Math.pow(targetY - centerY, 2));
          const numArrows = Math.floor(distance / 30);
          if (numArrows > 0) {
            const arrowSpacing = distance / numArrows;
            const angle = Math.atan2(targetY - centerY, targetX - centerX);

            for (let i = 0; i < numArrows; i++) {
              // Calculate position with animation offset
              const offset = (animationTime * 20) % arrowSpacing;
              const pos = i * arrowSpacing + offset;
              if (pos >= distance) continue;

              const arrowX = centerX + Math.cos(angle) * pos;
              const arrowY = centerY + Math.sin(angle) * pos;

              // Draw arrow
              ctx.save();
              ctx.translate(arrowX, arrowY);
              ctx.rotate(angle);

              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(-5, -3);
              ctx.lineTo(-5, 3);
              ctx.closePath();

              ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
              ctx.fill();

              ctx.restore();
            }
          }
        }
      } else if (movementBehavior === 'movable') {
        // Draw a movable indicator
        if (targetPosition) {
          const targetX = targetPosition.x * cellSize + cellSize / 2;
          const targetY = targetPosition.y * cellSize + cellSize / 2;

          // Draw a small handle/grip icon with pulsing effect
          const pulseSize = 1 + 0.2 * Math.sin(animationTime * 3); // Pulsing effect

          ctx.beginPath();
          ctx.arc(targetX, targetY - cellSize/2, cellSize/6 * pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw a small label
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Movable', targetX, targetY - cellSize/2 - 10);
        }
      }
    }

    // Draw range indicator based on range type
    if (rangeType && targetingType !== 'self') {
      let distance = rangeType === 'ranged' ? rangeDistance :
                    rangeType === 'touch' ? 5 :
                    rangeType === 'sight' ? 60 :
                    rangeType === 'self_centered' ? 0 : 100;

      // Convert distance in feet to grid cells (5ft per cell)
      const gridDistance = distance / 5;

      if (rangeType !== 'unlimited') {
        // For self-centered, we don't draw a range circle, but we highlight the caster
        if (rangeType === 'self_centered') {
          // Highlight the caster with a pulsing glow
          ctx.beginPath();
          ctx.arc(centerX, centerY, cellSize * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 215, 0, 0.3)'; // Gold with opacity
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Add a second outer glow
          ctx.beginPath();
          ctx.arc(centerX, centerY, cellSize * 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Draw range circle for other range types
          ctx.beginPath();
          ctx.arc(centerX, centerY, gridDistance * cellSize, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(58, 158, 255, 0.5)'; // var(--wizard-primary-light) with opacity
          ctx.lineWidth = 2;
          ctx.stroke();

          // Fill range area with translucent color
          ctx.fillStyle = 'rgba(0, 116, 224, 0.1)'; // var(--wizard-primary) with opacity
          ctx.fill();
        }
      }
    }

    // Draw target position and AOE if applicable
    if (targetPosition && targetingType !== 'self') {
      const targetX = targetPosition.x * cellSize + cellSize / 2;
      const targetY = targetPosition.y * cellSize + cellSize / 2;

      // Draw target indicator
      ctx.beginPath();
      ctx.arc(targetX, targetY, cellSize / 3, 0, Math.PI * 2);
      ctx.fillStyle = '#e9a639'; // var(--wizard-warning)
      ctx.fill();
      ctx.strokeStyle = '#d68910';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw area of effect if targeting type is area
      if (targetingType === 'area' && aoeShape) {
        drawAoeShape(ctx, targetX, targetY, aoeShape, aoeParameters);
      }

      // Draw line from caster to target
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = 'rgba(233, 166, 57, 0.6)'; // var(--wizard-warning) with opacity
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw propagation effect if enabled
      if (selectedPropagation !== 'none' && dummyTargets.length > 0) {
        drawPropagationEffect(ctx, targetX, targetY, centerX, centerY);
      }
    }

    // Draw hovered cell if available and in range
    if (hoveredCell && rangeType && targetingType !== 'self') {
      const hoverX = hoveredCell.x * cellSize;
      const hoverY = hoveredCell.y * cellSize;

      // Check if hovered cell is in range
      const distX = (hoveredCell.x - centerCellX) * 5; // Convert to feet
      const distY = (hoveredCell.y - centerCellY) * 5; // Convert to feet
      const distance = Math.sqrt(distX * distX + distY * distY);

      const maxDistance = rangeType === 'ranged' ? rangeDistance :
                          rangeType === 'touch' ? 5 :
                          rangeType === 'sight' ? 60 :
                          rangeType === 'self_centered' ? 0 : Infinity;

      if (distance <= maxDistance) {
        // Highlight hovered cell
        ctx.fillStyle = 'rgba(58, 158, 255, 0.3)'; // var(--wizard-primary-light) with opacity
        ctx.fillRect(hoverX, hoverY, cellSize, cellSize);
      }
    }

  }, [targetingType, rangeType, rangeDistance, aoeShape, aoeParameters, hoveredCell, targetPosition, dummyTargets, selectedPropagation, centerCellX, centerCellY, movementBehavior, isZoneSpell, state.typeConfig?.leaveTrail, animationTime, trailPositions]);

  // Draw propagation effect on the canvas
  const drawPropagationEffect = (ctx, targetX, targetY, centerX, centerY) => {
    switch(selectedPropagation) {
      case 'chain':
        // Draw chain effect
        dummyTargets.forEach((target, index) => {
          const dummyX = target.x * GRID_SIZE + GRID_SIZE / 2;
          const dummyY = target.y * GRID_SIZE + GRID_SIZE / 2;

          // Draw dummy target
          ctx.beginPath();
          ctx.arc(dummyX, dummyY, GRID_SIZE / 4, 0, Math.PI * 2);
          ctx.fillStyle = target.active ? 'rgba(0, 116, 224, 0.8)' : 'rgba(41, 128, 185, 0.5)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(41, 128, 185, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Draw small number on the dummy target
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((index + 1).toString(), dummyX, dummyY);

          // Draw chain line from primary target to first dummy, then between dummies
          ctx.beginPath();
          if (index === 0) {
            ctx.moveTo(targetX, targetY);
          } else {
            const prevDummyX = dummyTargets[index - 1].x * GRID_SIZE + GRID_SIZE / 2;
            const prevDummyY = dummyTargets[index - 1].y * GRID_SIZE + GRID_SIZE / 2;
            ctx.moveTo(prevDummyX, prevDummyY);
          }
          ctx.lineTo(dummyX, dummyY);

          // Create lightning effect with zigzag line
          const lineLength = Math.sqrt(Math.pow(dummyX - (index === 0 ? targetX : dummyTargets[index - 1].x * GRID_SIZE + GRID_SIZE / 2), 2) +
                                     Math.pow(dummyY - (index === 0 ? targetY : dummyTargets[index - 1].y * GRID_SIZE + GRID_SIZE / 2), 2));
          const segments = Math.floor(lineLength / 10);

          if (segments > 1) {
            ctx.beginPath();
            const startX = index === 0 ? targetX : dummyTargets[index - 1].x * GRID_SIZE + GRID_SIZE / 2;
            const startY = index === 0 ? targetY : dummyTargets[index - 1].y * GRID_SIZE + GRID_SIZE / 2;

            ctx.moveTo(startX, startY);

            for (let s = 1; s < segments; s++) {
              const ratio = s / segments;
              const zigzagOffset = (Math.random() - 0.5) * 5; // Random offset for zigzag effect
              const pointX = startX + (dummyX - startX) * ratio + zigzagOffset;
              const pointY = startY + (dummyY - startY) * ratio + zigzagOffset;
              ctx.lineTo(pointX, pointY);
            }

            ctx.lineTo(dummyX, dummyY);

            // Gradient line style for lightning effect
            const gradient = ctx.createLinearGradient(startX, startY, dummyX, dummyY);
            gradient.addColorStop(0, 'rgba(41, 128, 185, 0.9)');
            gradient.addColorStop(0.5, 'rgba(133, 193, 233, 0.9)');
            gradient.addColorStop(1, 'rgba(41, 128, 185, 0.9)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([2, 2]); // Dashed line for electric effect
            ctx.stroke();
            ctx.setLineDash([]); // Reset line style
          } else {
            ctx.strokeStyle = 'rgba(41, 128, 185, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
        break;

      case 'bounce':
        // Draw bounce effect with arcing paths
        dummyTargets.forEach((target, index) => {
          const bounceX = target.x * GRID_SIZE + GRID_SIZE / 2;
          const bounceY = target.y * GRID_SIZE + GRID_SIZE / 2;

          // Draw bounce target
          ctx.beginPath();
          ctx.arc(bounceX, bounceY, GRID_SIZE / 4, 0, Math.PI * 2);
          ctx.fillStyle = target.active ? 'rgba(46, 204, 113, 0.8)' : 'rgba(46, 204, 113, 0.5)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(46, 204, 113, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Draw small bounce number on the target
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((index + 1).toString(), bounceX, bounceY);

          // Draw bouncing arc path
          const prevX = index === 0 ? targetX : dummyTargets[index - 1].x * GRID_SIZE + GRID_SIZE / 2;
          const prevY = index === 0 ? targetY : dummyTargets[index - 1].y * GRID_SIZE + GRID_SIZE / 2;

          // Create arc between points
          ctx.beginPath();

          // Calculate midpoint and draw a curved line
          const midX = (prevX + bounceX) / 2;
          const midY = (prevY + bounceY) / 2;

          // Calculate control point for quadratic curve (higher arc for bounce effect)
          const controlPointOffset = GRID_SIZE * 2.5;
          const dx = bounceX - prevX;
          const dy = bounceY - prevY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Make the arc height proportional to distance
          const arcHeight = Math.min(dist * 0.5, controlPointOffset);

          // Perpendicular direction for control point
          const perpX = -dy / dist;
          const perpY = dx / dist;

          const controlX = midX + perpX * arcHeight;
          const controlY = midY + perpY * arcHeight;

          // Draw the curve
          ctx.moveTo(prevX, prevY);
          ctx.quadraticCurveTo(controlX, controlY, bounceX, bounceY);

          // Style the arc
          ctx.strokeStyle = target.active ? 'rgba(46, 204, 113, 0.9)' : 'rgba(46, 204, 113, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Add bounce dots along the arc
          const bounceDots = 5;
          for (let d = 1; d <= bounceDots; d++) {
            const t = d / (bounceDots + 1);
            // Quadratic bezier formula
            const dotX = Math.pow(1-t, 2) * prevX + 2 * (1-t) * t * controlX + Math.pow(t, 2) * bounceX;
            const dotY = Math.pow(1-t, 2) * prevY + 2 * (1-t) * t * controlY + Math.pow(t, 2) * bounceY;

            ctx.beginPath();
            ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(46, 204, 113, 0.8)';
            ctx.fill();
          }
        });
        break;

      case 'seeking':
        // Draw a "radar" pulse from center (caster)
        const maxRadius = 40 / 5 * GRID_SIZE; // 40 feet search radius
        const numPulses = 3;

        for (let p = 0; p < numPulses; p++) {
          // Calculate pulse radius based on time
          const pulseProgress = (Date.now() / 1000 + p * 0.33) % 1;
          const pulseRadius = pulseProgress * maxRadius;

          ctx.beginPath();
          ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(155, 89, 182, ${1 - pulseProgress})`; // Purple with fading opacity
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw seeking targets
        dummyTargets.forEach((target, index) => {
          const seekX = target.x * GRID_SIZE + GRID_SIZE / 2;
          const seekY = target.y * GRID_SIZE + GRID_SIZE / 2;

          // Draw seek target
          ctx.beginPath();
          ctx.arc(seekX, seekY, GRID_SIZE / 4, 0, Math.PI * 2);
          ctx.fillStyle = target.active ? 'rgba(155, 89, 182, 0.8)' : 'rgba(155, 89, 182, 0.5)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(155, 89, 182, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Draw small number
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((index + 1).toString(), seekX, seekY);

          // Draw seeking path with dotted line
          ctx.beginPath();
          ctx.moveTo(targetX, targetY);
          ctx.lineTo(seekX, seekY);
          ctx.strokeStyle = target.active ? 'rgba(155, 89, 182, 0.9)' : 'rgba(155, 89, 182, 0.4)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]); // Dotted line
          ctx.stroke();
          ctx.setLineDash([]); // Reset line style

          // Add animated arrow that moves along the path
          if (target.active) {
            const arrowProgress = (Date.now() / 1000 + index * 0.2) % 1;
            const t = arrowProgress;
            const arrowX = targetX + (seekX - targetX) * t;
            const arrowY = targetY + (seekY - targetY) * t;

            // Calculate angle
            const angle = Math.atan2(seekY - targetY, seekX - targetX);

            // Draw arrow
            ctx.save();
            ctx.translate(arrowX, arrowY);
            ctx.rotate(angle);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-5, -3);
            ctx.lineTo(-5, 3);
            ctx.closePath();

            ctx.fillStyle = 'rgba(155, 89, 182, 1.0)';
            ctx.fill();

            ctx.restore();
          }
        });
        break;

      case 'explosion':
        // Draw explosion radius
        ctx.beginPath();
        ctx.arc(targetX, targetY, secondaryRadius / 5 * GRID_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(231, 76, 60, 0.2)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw explosion particles
        dummyTargets.forEach(target => {
          const particleX = target.x * GRID_SIZE + GRID_SIZE / 2;
          const particleY = target.y * GRID_SIZE + GRID_SIZE / 2;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particleX, particleY, GRID_SIZE / 6, 0, Math.PI * 2);
          ctx.fillStyle = target.active ? 'rgba(231, 76, 60, 0.8)' : 'rgba(231, 76, 60, 0.4)';
          ctx.fill();

          // Draw line from explosion center
          if (target.active) {
            ctx.beginPath();
            ctx.moveTo(targetX, targetY);
            ctx.lineTo(particleX, particleY);
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
        break;

      case 'spreading':
        // Draw spreading effect as expanding circles
        if (dummyTargets.length > 0) {
          // Group targets by ring
          const ringGroups = {};
          dummyTargets.forEach(target => {
            const ring = target.ring || 1;
            if (!ringGroups[ring]) ringGroups[ring] = [];
            ringGroups[ring].push(target);
          });

          // Draw rings
          Object.keys(ringGroups).forEach(ring => {
            const ringRadius = (ring * spreadRate) / 5 * GRID_SIZE;

            // Draw ring circle
            ctx.beginPath();
            ctx.arc(targetX, targetY, ringRadius, 0, Math.PI * 2);

            // Color based on active state
            let isRingActive = ringGroups[ring].some(t => t.active);
            ctx.strokeStyle = isRingActive ? 'rgba(46, 204, 113, 0.8)' : 'rgba(46, 204, 113, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw individual targets in the ring
            ringGroups[ring].forEach(target => {
              const spreadX = target.x * GRID_SIZE + GRID_SIZE / 2;
              const spreadY = target.y * GRID_SIZE + GRID_SIZE / 2;

              ctx.beginPath();
              ctx.arc(spreadX, spreadY, GRID_SIZE / 6, 0, Math.PI * 2);
              ctx.fillStyle = target.active ? 'rgba(46, 204, 113, 0.8)' : 'rgba(46, 204, 113, 0.3)';
              ctx.fill();
            });
          });
        }
        break;

      case 'forking':
        // Draw forking effect
        if (dummyTargets.length > 0) {
          // Group targets by fork
          const forkGroups = {};
          dummyTargets.forEach(target => {
            const fork = target.fork || 0;
            if (!forkGroups[fork]) forkGroups[fork] = [];
            forkGroups[fork].push(target);
          });

          // Draw each fork's path
          Object.keys(forkGroups).forEach(fork => {
            const forkTargets = forkGroups[fork];
            if (forkTargets.length === 0) return;

            // Sort targets by distance from origin
            forkTargets.sort((a, b) => {
              const distA = calculateDistance({x: targetPosition.x, y: targetPosition.y}, a);
              const distB = calculateDistance({x: targetPosition.x, y: targetPosition.y}, b);
              return distA - distB;
            });

            // Draw fork path
            ctx.beginPath();
            ctx.moveTo(targetX, targetY);

            forkTargets.forEach(target => {
              const forkX = target.x * GRID_SIZE + GRID_SIZE / 2;
              const forkY = target.y * GRID_SIZE + GRID_SIZE / 2;
              ctx.lineTo(forkX, forkY);

              // Draw target point
              ctx.beginPath();
              ctx.arc(forkX, forkY, GRID_SIZE / 6, 0, Math.PI * 2);
              ctx.fillStyle = target.active ? 'rgba(41, 128, 185, 0.8)' : 'rgba(41, 128, 185, 0.4)';
              ctx.fill();
            });

            // Draw fork line
            ctx.beginPath();
            ctx.moveTo(targetX, targetY);

            forkTargets.forEach((target, idx) => {
              const forkX = target.x * GRID_SIZE + GRID_SIZE / 2;
              const forkY = target.y * GRID_SIZE + GRID_SIZE / 2;

              if (idx === 0) {
                ctx.lineTo(forkX, forkY);
              } else {
                const prevX = forkTargets[idx-1].x * GRID_SIZE + GRID_SIZE / 2;
                const prevY = forkTargets[idx-1].y * GRID_SIZE + GRID_SIZE / 2;
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(forkX, forkY);
              }
            });

            let isActive = forkTargets.some(t => t.active);
            ctx.strokeStyle = isActive ? 'rgba(41, 128, 185, 0.8)' : 'rgba(41, 128, 185, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });
        }
        break;
    }
  };

  // Helper function to draw AOE shapes
  const drawAoeShape = (ctx, x, y, shape, parameters) => {
    const cellSize = GRID_SIZE;

    switch (shape) {
      case 'circle': {
        const radius = (parameters.radius || 20) / 5 * cellSize; // Convert feet to grid units

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(231, 76, 60, 0.3)'; // Red with opacity
        ctx.fill();
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add radius dimension text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${parameters.radius || 20}ft radius`, x, y + radius + 15);
        break;
      }

      case 'square': {
        const size = (parameters.size || 15) / 5 * cellSize; // Convert feet to grid units
        const halfSize = size / 2;

        ctx.beginPath();
        ctx.rect(x - halfSize, y - halfSize, size, size);
        ctx.fillStyle = 'rgba(52, 152, 219, 0.3)'; // Blue with opacity
        ctx.fill();
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add dimension text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${parameters.size || 15}ft side`, x, y + halfSize + 15);
        break;
      }

      case 'cone': {
        const range = (parameters.range || 15) / 5 * cellSize; // Convert feet to grid units
        const angle = (parameters.angle || 90) * Math.PI / 180; // Convert to radians

        // Get direction angle (default to pointing upward if not specified)
        const directionAngle = parameters.direction !== undefined
          ? parameters.direction * Math.PI / 180
          : -Math.PI / 2; // Default upward

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, range, directionAngle - angle / 2, directionAngle + angle / 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(155, 89, 182, 0.3)'; // Purple with opacity
        ctx.fill();
        ctx.strokeStyle = 'rgba(155, 89, 182, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw direction indicator
        const indicatorLength = range * 0.3;
        const midAngle = directionAngle;
        const indicatorX = x + Math.cos(midAngle) * indicatorLength;
        const indicatorY = y + Math.sin(midAngle) * indicatorLength;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(indicatorX, indicatorY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(indicatorX, indicatorY);
        ctx.lineTo(
          indicatorX - Math.cos(midAngle - Math.PI/6) * 10,
          indicatorY - Math.sin(midAngle - Math.PI/6) * 10
        );
        ctx.lineTo(
          indicatorX - Math.cos(midAngle + Math.PI/6) * 10,
          indicatorY - Math.sin(midAngle + Math.PI/6) * 10
        );
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Add dimension text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${parameters.range || 15}ft range, ${parameters.angle || 90}°`,
          x + Math.cos(midAngle) * (range/2),
          y + Math.sin(midAngle) * (range/2) - 15);
        break;
      }

      case 'trail': {
        const width = (parameters.width || 5) / 5 * cellSize; // Convert feet to grid units

        // Draw a trail from the caster position to the current position
        const centerX = centerCellX * cellSize + cellSize / 2;
        const centerY = centerCellY * cellSize + cellSize / 2;

        // Create a gradient for the trail
        const gradient = ctx.createLinearGradient(centerX, centerY, x, y);
        gradient.addColorStop(0, 'rgba(46, 204, 113, 0.7)'); // Green at start
        gradient.addColorStop(1, 'rgba(46, 204, 113, 0.3)'); // Faded at end

        // Calculate the angle between caster and target
        const angle = Math.atan2(y - centerY, x - centerX);

        // Calculate the perpendicular direction for width
        const perpX = Math.sin(angle);
        const perpY = -Math.cos(angle);

        // Calculate the four corners of the trail rectangle
        const halfWidth = width / 2;

        // Draw the trail as a path
        ctx.beginPath();
        ctx.moveTo(centerX + perpX * halfWidth, centerY + perpY * halfWidth);
        ctx.lineTo(centerX - perpX * halfWidth, centerY - perpY * halfWidth);
        ctx.lineTo(x - perpX * halfWidth, y - perpY * halfWidth);
        ctx.lineTo(x + perpX * halfWidth, y + perpY * halfWidth);
        ctx.closePath();

        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fill();

        // Stroke the outline
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the trail if leaveTrail is enabled
        if (state.typeConfig?.leaveTrail && trailPositions.length > 0) {
          console.log("Drawing trail with positions:", trailPositions);

          // Draw connecting dotted line between trail positions
          if (trailPositions.length > 1) {
            ctx.beginPath();
            ctx.setLineDash([5, 3]); // Create dotted line effect

            // Start from the first position
            const startX = trailPositions[0].x * cellSize + cellSize / 2;
            const startY = trailPositions[0].y * cellSize + cellSize / 2;
            ctx.moveTo(startX, startY);

            // Connect all positions
            for (let i = 1; i < trailPositions.length; i++) {
              const nextX = trailPositions[i].x * cellSize + cellSize / 2;
              const nextY = trailPositions[i].y * cellSize + cellSize / 2;
              ctx.lineTo(nextX, nextY);
            }

            // Style and draw the path
            ctx.strokeStyle = 'rgba(65, 105, 225, 0.7)'; // Royal blue for the path
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
          }

          // Draw static afterimages at each previous position of the AOE
          trailPositions.forEach((point, index) => {
            const pointX = point.x * cellSize + cellSize / 2;
            const pointY = point.y * cellSize + cellSize / 2;

            // Create a fading effect based on how old the point is
            // Newer points are more opaque, older points are more transparent
            const age = trailPositions.length - index;
            const opacity = Math.max(0.4, 1 - (age * 0.05)); // Increased minimum opacity for better visibility

            // Draw a blue outline around the afterimage to make it stand out
            if (aoeShape === 'circle') {
              // Use the width parameter if it exists, otherwise use the radius
              const radius = (aoeParameters.width ? (aoeParameters.width / 5 * cellSize) : (aoeParameters.radius || 20) / 5 * cellSize);

              // Draw a faded circle with blue border
              ctx.beginPath();
              ctx.arc(pointX, pointY, radius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(65, 105, 225, ${opacity * 0.25})`; // Blue with fading opacity
              ctx.fill();

              // Add a glowing border
              ctx.shadowColor = 'rgba(65, 105, 225, 0.8)';
              ctx.shadowBlur = 10;
              ctx.strokeStyle = `rgba(65, 105, 225, ${opacity * 0.8})`;
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.shadowBlur = 0;
            } else if (aoeShape === 'square') {
              // Use the width parameter if it exists, otherwise use the size
              const size = (aoeParameters.width ? (aoeParameters.width / 5 * cellSize * 2) : (aoeParameters.size || 15) / 5 * cellSize);
              const halfSize = size / 2;

              // Draw a faded square with blue border
              ctx.beginPath();
              ctx.rect(pointX - halfSize, pointY - halfSize, size, size);
              ctx.fillStyle = `rgba(65, 105, 225, ${opacity * 0.25})`; // Blue with fading opacity
              ctx.fill();

              // Add a glowing border
              ctx.shadowColor = 'rgba(65, 105, 225, 0.8)';
              ctx.shadowBlur = 10;
              ctx.strokeStyle = `rgba(65, 105, 225, ${opacity * 0.8})`;
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.shadowBlur = 0;
            } else {
              // For other shapes, draw a generic trail marker with enhanced visibility
              const trailSize = (aoeParameters.width || 5) / 5 * cellSize * 2; // Use the width parameter from aoeParameters and double it for visibility

              // Draw a faded circle with blue border
              ctx.beginPath();
              ctx.arc(pointX, pointY, trailSize / 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(65, 105, 225, ${opacity * 0.25})`; // Blue with fading opacity
              ctx.fill();

              // Add a glowing border
              ctx.shadowColor = 'rgba(65, 105, 225, 0.8)';
              ctx.shadowBlur = 10;
              ctx.strokeStyle = `rgba(65, 105, 225, ${opacity * 0.8})`;
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }

            // Add enhanced glittering particles to make it look magical
            const numParticles = 8; // Increased number of particles
            for (let i = 0; i < numParticles; i++) {
              // Random position within the area
              // Use width parameter for all shapes if available
              const particleRadius = aoeParameters.width ?
                (aoeParameters.width / 5 * cellSize * 0.8) :
                (aoeShape === 'circle') ?
                  (aoeParameters.radius || 20) / 5 * cellSize * 0.8 :
                  (aoeShape === 'square') ?
                    (aoeParameters.size || 15) / 5 * cellSize * 0.4 :
                    cellSize * 0.4;

              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * particleRadius;
              const particleX = pointX + Math.cos(angle) * distance;
              const particleY = pointY + Math.sin(angle) * distance;

              // Pulsing effect with animation time and offset
              const pulseOffset = index * 0.3 + i * 0.2;
              const pulseSize = 1 + 0.5 * Math.sin((animationTime * 4) + pulseOffset); // Enhanced pulsing

              // Draw the particle with a stronger glow effect
              ctx.beginPath();
              ctx.arc(particleX, particleY, 2.5 * pulseSize, 0, Math.PI * 2); // Larger particle

              // Use different colors for particles to create a sparkling effect
              const particleColors = [
                `rgba(135, 206, 250, ${opacity * 0.9})`, // Light sky blue
                `rgba(30, 144, 255, ${opacity * 0.9})`, // Dodger blue
                `rgba(0, 191, 255, ${opacity * 0.9})`, // Deep sky blue
                `rgba(100, 149, 237, ${opacity * 0.9})`, // Cornflower blue
              ];

              ctx.fillStyle = particleColors[i % particleColors.length];
              ctx.fill();

              // Add stronger glow
              ctx.shadowColor = 'rgba(135, 206, 250, 0.8)';
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(particleX, particleY, 5 * pulseSize, 0, Math.PI * 2); // Larger glow
              ctx.fillStyle = `rgba(135, 206, 250, ${opacity * 0.6})`; // Higher opacity glow
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }); // Close the trailPositions.forEach from the static afterimages
        }

        // Add movement behavior indicator
        if (movementBehavior && movementBehavior !== 'static') {
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const midX = (centerX + x) / 2;
          const midY = (centerY + y) / 2;

          ctx.fillText(`${movementBehavior === 'follows_caster' ? 'Follows Caster' : 'Movable'}`,
                      midX, midY - 15);
        }

        // Add dimension text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${parameters.width || 5}ft width`, x, y + 15);
        break;
      }

      case 'line': {
        const length = (parameters.length || 30) / 5 * cellSize; // Convert feet to grid units
        const width = (parameters.width || 5) / 5 * cellSize; // Convert feet to grid units

        // Calculate direction from caster to target or use provided direction
        const centerX = centerCellX * cellSize + cellSize / 2;
        const centerY = centerCellY * cellSize + cellSize / 2;
        let angle;

        if (parameters.direction !== undefined) {
          angle = parameters.direction * Math.PI / 180;
        } else {
          angle = Math.atan2(y - centerY, x - centerX);
        }

        // Calculate endpoints of the line
        const halfWidth = width / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.rect(0, -halfWidth, length, width);
        ctx.fillStyle = 'rgba(46, 204, 113, 0.3)'; // Green with opacity
        ctx.fill();
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw direction arrow
        ctx.beginPath();
        ctx.moveTo(length/2, 0);
        ctx.lineTo(length/2 + 10, -5);
        ctx.lineTo(length/2 + 10, 5);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Add dimension text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${parameters.length || 30}ft × ${parameters.width || 5}ft`, length/2, -halfWidth - 10);

        ctx.restore();
        break;
      }

      case 'cube': {
        const size = (parameters.size || 15) / 5 * cellSize; // Convert feet to grid units
        const halfSize = size / 2;

        // Draw the base square
        ctx.beginPath();
        ctx.rect(x - halfSize, y - halfSize, size, size);
        ctx.fillStyle = 'rgba(241, 196, 15, 0.3)'; // Yellow with opacity
        ctx.fill();
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw 3D perspective lines
        const perspectiveOffset = size * 0.2;
        ctx.beginPath();

        // Top-left corner
        ctx.moveTo(x - halfSize, y - halfSize);
        ctx.lineTo(x - halfSize + perspectiveOffset, y - halfSize - perspectiveOffset);

        // Top-right corner
        ctx.moveTo(x + halfSize, y - halfSize);
        ctx.lineTo(x + halfSize + perspectiveOffset, y - halfSize - perspectiveOffset);

        // Bottom-right corner
        ctx.moveTo(x + halfSize, y + halfSize);
        ctx.lineTo(x + halfSize + perspectiveOffset, y + halfSize - perspectiveOffset);

        // Bottom-left corner
        ctx.moveTo(x - halfSize, y + halfSize);
        ctx.lineTo(x - halfSize + perspectiveOffset, y + halfSize - perspectiveOffset);

        // Draw the top face
        ctx.moveTo(x - halfSize + perspectiveOffset, y - halfSize - perspectiveOffset);
        ctx.lineTo(x + halfSize + perspectiveOffset, y - halfSize - perspectiveOffset);
        ctx.lineTo(x + halfSize + perspectiveOffset, y + halfSize - perspectiveOffset);
        ctx.lineTo(x - halfSize + perspectiveOffset, y + halfSize - perspectiveOffset);
        ctx.lineTo(x - halfSize + perspectiveOffset, y - halfSize - perspectiveOffset);

        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = 'rgba(241, 196, 15, 0.5)';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.9)';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Add dimension text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${parameters.size || 15}ft cube`, x, y + halfSize + 15);
        break;
      }

      case 'sphere': {
        const radius = (parameters.radius || 20) / 5 * cellSize; // Convert feet to grid units

        // Draw the main circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(41, 128, 185, 0.3)'; // Blue with opacity
        ctx.fill();
        ctx.strokeStyle = 'rgba(41, 128, 185, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw inner circle to create 3D effect
        ctx.beginPath();
        ctx.ellipse(x, y, radius * 0.7, radius * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(41, 128, 185, 0.5)';
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = 'rgba(41, 128, 185, 0.5)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(41, 128, 185, 0.9)';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Add dimension text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${parameters.radius || 20}ft radius sphere`, x, y + radius + 15);
        break;
      }

      case 'cylinder': {
        const radius = (parameters.radius || 10) / 5 * cellSize; // Convert feet to grid units
        const height = parameters.height || 20; // Height in feet

        // Draw the base circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(142, 68, 173, 0.3)'; // Purple with opacity
        ctx.fill();
        ctx.strokeStyle = 'rgba(142, 68, 173, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw top ellipse for 3D effect
        ctx.beginPath();
        ctx.ellipse(x, y - radius * 0.2, radius, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(142, 68, 173, 0.7)';
        ctx.stroke();

        // Connect base to top
        ctx.beginPath();
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x - radius, y - radius * 0.2);
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + radius, y - radius * 0.2);
        ctx.strokeStyle = 'rgba(142, 68, 173, 0.5)';
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = 'rgba(142, 68, 173, 0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(142, 68, 173, 0.9)';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Add dimension text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${parameters.radius || 10}ft × ${height}ft`, x, y + radius + 15);
        break;
      }

      case 'wall': {
        const length = (parameters.length || 30) / 5 * cellSize; // Convert feet to grid units
        const width = (parameters.width || 5) / 5 * cellSize; // Convert feet to grid units
        const height = parameters.height || 10; // Height in feet

        // Calculate direction from caster to target or use provided direction
        const centerX = centerCellX * cellSize + cellSize / 2;
        const centerY = centerCellY * cellSize + cellSize / 2;
        let angle;

        if (parameters.direction !== undefined) {
          angle = parameters.direction * Math.PI / 180;
        } else {
          angle = Math.atan2(y - centerY, x - centerX);
        }

        // Calculate endpoints of the wall
        const halfWidth = width / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Draw the base rectangle
        ctx.beginPath();
        ctx.rect(-length/2, -halfWidth, length, width);
        ctx.fillStyle = 'rgba(230, 126, 34, 0.3)'; // Orange with opacity
        ctx.fill();
        ctx.strokeStyle = 'rgba(230, 126, 34, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3D perspective - top of the wall
        const heightVisual = width * 0.5; // Visual representation of height

        ctx.beginPath();
        // Bottom-left to top-left
        ctx.moveTo(-length/2, -halfWidth);
        ctx.lineTo(-length/2, -halfWidth - heightVisual);

        // Top-left to top-right
        ctx.lineTo(length/2, -halfWidth - heightVisual);

        // Top-right to bottom-right
        ctx.lineTo(length/2, -halfWidth);

        // Draw the top face
        ctx.moveTo(-length/2, -halfWidth - heightVisual);
        ctx.lineTo(-length/2, -halfWidth - heightVisual);
        ctx.lineTo(length/2, -halfWidth - heightVisual);
        ctx.lineTo(length/2, halfWidth - heightVisual);
        ctx.lineTo(-length/2, halfWidth - heightVisual);
        ctx.lineTo(-length/2, -halfWidth - heightVisual);

        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = 'rgba(230, 126, 34, 0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.rect(-length/2, -halfWidth, length, width);
        ctx.strokeStyle = 'rgba(230, 126, 34, 0.9)';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Add dimension text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${parameters.length || 30}ft × ${parameters.width || 5}ft × ${height}ft`, 0, halfWidth + 15);

        ctx.restore();
        break;
      }

      default:
        break;
    }
  };

  // Handle canvas mouse events for interactivity
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor(((e.clientX - rect.left) * scaleX) / GRID_SIZE);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / GRID_SIZE);

    // Ensure x and y are within bounds
    if (x >= 0 && x < GRID_CELLS && y >= 0 && y < GRID_CELLS) {
      setHoveredCell({ x, y });
    } else {
      setHoveredCell(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredCell(null);
  };

  const handleCanvasClick = () => {
    if (targetingType !== 'self') {
      // For self-centered spells, the target is always the caster
      if (rangeType === 'self_centered') {
        setTargetPosition({ x: centerCellX, y: centerCellY });
        return;
      }

      // For other range types, check if the click is within range
      if (hoveredCell) {
        const distX = (hoveredCell.x - centerCellX) * 5; // Convert to feet
        const distY = (hoveredCell.y - centerCellY) * 5; // Convert to feet
        const distance = Math.sqrt(distX * distX + distY * distY);

        const maxDistance = rangeType === 'ranged' ? rangeDistance :
                            rangeType === 'touch' ? 5 :
                            rangeType === 'sight' ? 60 :
                            rangeType === 'self_centered' ? 0 : Infinity;

        if (distance <= maxDistance) {
          setTargetPosition(hoveredCell);
        }
      }
    }
  };

  // Generate propagation dummy targets for visualization
  useEffect(() => {
    if (targetPosition && selectedPropagation !== 'none') {
      const newDummyTargets = [];
      const gridSize = GRID_CELLS;
      const centerX = targetPosition.x;
      const centerY = targetPosition.y;

      // Set up dummy targets based on propagation method
      switch (selectedPropagation) {
        case 'chain': {
          for (let i = 0; i < propagationCount; i++) {
            // Create a semi-predictable chain pattern
            const angle = (i * 45) % 360 * Math.PI / 180;
            const distance = (i + 1) * 3;
            const x = Math.floor(centerX + Math.cos(angle) * distance);
            const y = Math.floor(centerY + Math.sin(angle) * distance);

            // Ensure within bounds
            const boundedX = Math.max(0, Math.min(gridSize - 1, x));
            const boundedY = Math.max(0, Math.min(gridSize - 1, y));

            newDummyTargets.push({
              x: boundedX,
              y: boundedY,
              active: false,
              damageModifier: Math.max(0.2, 1 - (i * 0.2))
            });
          }
          break;
        }

        case 'bounce': {
          for (let i = 0; i < propagationCount; i++) {
            // Create a random bounce pattern
            const angle = Math.random() * 360 * Math.PI / 180;
            const distance = 2 + Math.random() * 4;

            let x, y;
            if (i === 0) {
              // First bounce is semi-predictable
              x = centerX + Math.round(Math.cos(angle) * distance);
              y = centerY + Math.round(Math.sin(angle) * distance);
            } else {
              // Subsequent bounces based on previous position
              const prevX = newDummyTargets[i - 1].x;
              const prevY = newDummyTargets[i - 1].y;
              const bounceAngle = Math.random() * 360 * Math.PI / 180;
              x = prevX + Math.round(Math.cos(bounceAngle) * distance);
              y = prevY + Math.round(Math.sin(bounceAngle) * distance);
            }

            // Ensure within bounds
            const boundedX = Math.max(0, Math.min(gridSize - 1, x));
            const boundedY = Math.max(0, Math.min(gridSize - 1, y));

            newDummyTargets.push({
              x: boundedX,
              y: boundedY,
              active: false,
              damageModifier: Math.max(0.2, 1 - (i * 0.15))
            });
          }
          break;
        }

        case 'seeking': {
          // Create "smart" seeking pattern that looks for corners/edges
          for (let i = 0; i < propagationCount; i++) {
            // Random angle, but spread out
            const angle = (i * (360 / propagationCount) + Math.random() * 30) * Math.PI / 180;
            const distance = 5 + Math.random() * 7;
            const x = centerX + Math.round(Math.cos(angle) * distance);
            const y = centerY + Math.round(Math.sin(angle) * distance);

            // Ensure within bounds
            const boundedX = Math.max(0, Math.min(gridSize - 1, x));
            const boundedY = Math.max(0, Math.min(gridSize - 1, y));

            newDummyTargets.push({
              x: boundedX,
              y: boundedY,
              active: false,
              damageModifier: 0.8,
              type: ['ally', 'enemy', 'creature', 'object'][Math.floor(Math.random() * 4)]
            });
          }
          break;
        }

        case 'explosion': {
          // Create a circular pattern for explosion
          const radius = secondaryRadius / 5; // Convert feet to grid cells

          // Create a circular pattern
          for (let angle = 0; angle < 360; angle += 45) {
            const radian = angle * Math.PI / 180;
            const x = centerX + Math.round(Math.cos(radian) * radius);
            const y = centerY + Math.round(Math.sin(radian) * radius);

            // Ensure within bounds
            const boundedX = Math.max(0, Math.min(gridSize - 1, x));
            const boundedY = Math.max(0, Math.min(gridSize - 1, y));

            newDummyTargets.push({
              x: boundedX,
              y: boundedY,
              active: false,
              damageModifier: 0.7
            });
          }
          break;
        }

        case 'spreading': {
          // Create a spreading pattern
          for (let ring = 1; ring <= 3; ring++) {
            for (let angle = 0; angle < 360; angle += 60 / ring) {
              const radian = angle * Math.PI / 180;
              const distance = ring * spreadRate / 5;
              const x = centerX + Math.round(Math.cos(radian) * distance);
              const y = centerY + Math.round(Math.sin(radian) * distance);

              // Ensure within bounds
              const boundedX = Math.max(0, Math.min(gridSize - 1, x));
              const boundedY = Math.max(0, Math.min(gridSize - 1, y));

              newDummyTargets.push({
                x: boundedX,
                y: boundedY,
                active: false,
                damageModifier: Math.max(0.3, 1 - (ring * 0.2)),
                ring: ring
              });
            }
          }
          break;
        }

        case 'forking': {
          // Create a forking pattern
          for (let fork = 0; fork < forkCount; fork++) {
            const baseAngle = (fork * (360 / forkCount)) * Math.PI / 180;

            // Each fork creates 2-3 points along its path
            for (let i = 1; i <= 3; i++) {
              const angle = baseAngle + (Math.random() * 20 - 10) * Math.PI / 180; // Small variation
              const distance = i * 2.5;
              const x = centerX + Math.round(Math.cos(angle) * distance);
              const y = centerY + Math.round(Math.sin(angle) * distance);

              // Ensure within bounds
              const boundedX = Math.max(0, Math.min(gridSize - 1, x));
              const boundedY = Math.max(0, Math.min(gridSize - 1, y));

              newDummyTargets.push({
                x: boundedX,
                y: boundedY,
                active: false,
                damageModifier: Math.max(0.4, 1 - (i * 0.2)),
                fork: fork
              });
            }
          }
          break;
        }
      }

      setDummyTargets(newDummyTargets);
    } else {
      setDummyTargets([]);
    }
  }, [targetPosition, selectedPropagation, propagationCount, secondaryRadius, spreadRate, forkCount]);

  // Start animation when the preview button is clicked
  const startAnimation = () => {
    if (animationActive) {
      // If animation is already running, stop it
      stopAnimation();
      return;
    }

    setAnimationActive(true);

    // Reset active state of all targets
    setDummyTargets(prev => prev.map(target => ({ ...target, active: false })));

    // Animation logic depends on propagation method
    let currentIndex = 0;

    if (selectedPropagation === 'spreading') {
      // For spreading, we animate by rings
      let currentRing = 1;

      const intervalId = setInterval(() => {
        if (currentRing > 3) {
          clearInterval(intervalId);
          setAnimationActive(false);
          return;
        }

        setDummyTargets(prev => prev.map(target => {
          if (target.ring === currentRing) {
            return { ...target, active: true };
          }
          return target;
        }));

        currentRing++;
      }, 400);

      setAnimationTimer(intervalId);
    } else if (selectedPropagation === 'forking') {
      // For forking, animate each fork simultaneously
      const totalForks = forkCount;
      let forksProgress = new Array(totalForks).fill(0);

      const intervalId = setInterval(() => {
        // Check if all forks have completed their animation
        if (forksProgress.every(progress => progress >= 3)) {
          clearInterval(intervalId);
          setAnimationActive(false);
          return;
        }

        // Update each fork's progress
        setDummyTargets(prev => {
          const updated = [...prev];

          for (let fork = 0; fork < totalForks; fork++) {
            // Only update if this fork's animation isn't complete
            if (forksProgress[fork] < 3) {
              // Find targets for this fork at the current progress level
              const targetsToActivate = updated
                .filter(target => target.fork === fork && !target.active)
                .sort((a, b) => {
                  // Calculate distance from source to determine activation order
                  // Calculate distance from source to determine activation order
                  const distA = Math.sqrt(Math.pow(a.x - targetPosition.x, 2) + Math.pow(a.y - targetPosition.y, 2));
                  const distB = Math.sqrt(Math.pow(b.x - targetPosition.x, 2) + Math.pow(b.y - targetPosition.y, 2));
                  return distA - distB;
                });

              // Activate the next target in this fork's path
              if (targetsToActivate.length > 0) {
                const targetIndex = updated.findIndex(t =>
                  t.x === targetsToActivate[0].x && t.y === targetsToActivate[0].y
                );
                if (targetIndex !== -1) {
                  updated[targetIndex].active = true;
                }
              }

              forksProgress[fork]++;
            }
          }

          return updated;
        });
      }, 300);

      setAnimationTimer(intervalId);
    } else {
      // For chain, bounce, seeking, explosion
      const intervalId = setInterval(() => {
        if (currentIndex >= dummyTargets.length) {
          clearInterval(intervalId);
          setAnimationActive(false);
          return;
        }

        setDummyTargets(prev => {
          const updated = [...prev];
          if (currentIndex < updated.length) {
            updated[currentIndex].active = true;
          }
          return updated;
        });

        currentIndex++;
      }, 300);

      setAnimationTimer(intervalId);
    }
  };

  // Stop animation and reset targets
  const stopAnimation = () => {
    if (animationTimer) {
      clearInterval(animationTimer);
      setAnimationTimer(null);
    }
    setAnimationActive(false);
  };

  // Function for handleGridClick - redirect to handleCanvasClick
  const handleGridClick = () => {
    handleCanvasClick();
  };

  // Function to describe the targeting setup in plain language
  const getTargetingDescription = () => {
    if (!targetingType) return '';

    const targetingTypeObj = getTargetingTypeById(targetingType) || TARGETING_TYPES.find(t => t.id === targetingType);
    const rangeTypeObj = RANGE_TYPES.find(r => r.id === rangeType);

    if (!targetingTypeObj) return 'Select a targeting type to continue.';

    let description = `This spell ${targetingType === 'self' ? 'targets only the caster' : 'is a ' + targetingTypeObj.name.toLowerCase() + ' spell'}`;

    if (targetingType !== 'self') {
      // Add range info
      if (targetingType === 'self_centered' || rangeType === 'self_centered') {
        description += ` that emanates from the caster`;
      } else if (rangeTypeObj) {
        description += ` with ${rangeTypeObj.name.toLowerCase()} range`;
        if (rangeType === 'ranged') {
          description += ` (${rangeDistance} feet)`;
        }
      }

      // Add target restrictions
      if (targetRestrictions.length > 0) {
        const restrictionNames = targetRestrictions.map(id => {
          const restrictionObj = TARGET_RESTRICTIONS.find(r => r.id === id);
          return restrictionObj ? restrictionObj.name.toLowerCase() : '';
        }).filter(name => name !== '');

        if (restrictionNames.length === 1) {
          description += ` that can target ${restrictionNames[0]}`;
        } else if (restrictionNames.length > 1) {
          const lastRestriction = restrictionNames.pop();
          description += ` that can target ${restrictionNames.join(', ')} and ${lastRestriction}`;
        }
      }

      // Add AOE info if applicable
      if (targetingType === 'area' && aoeShape) {
        const shapeObj = getAoeShapeById(aoeShape);
        if (shapeObj) {
          description += `. It affects targets in a ${shapeObj.name.toLowerCase()}`;
        }

        if (aoeShape === 'circle') {
          description += ` with a ${aoeParameters.radius || 20}-foot radius`;
        } else if (aoeShape === 'square') {
          description += ` with ${aoeParameters.size || 15}-foot sides`;
        } else if (aoeShape === 'cone') {
          description += ` with a ${aoeParameters.range || 15}-foot range and ${aoeParameters.angle || 90}-degree angle`;
        } else if (aoeShape === 'line') {
          description += ` that is ${aoeParameters.length || 30} feet long and ${aoeParameters.width || 5} feet wide`;
        } else if (aoeShape === 'cube') {
          description += ` with ${aoeParameters.size || 15}-foot sides`;
        } else if (aoeShape === 'sphere') {
          description += ` with a ${aoeParameters.radius || 20}-foot radius`;
        } else if (aoeShape === 'cylinder') {
          description += ` with a ${aoeParameters.radius || 10}-foot radius and ${aoeParameters.height || 20}-foot height`;
        } else if (aoeShape === 'wall') {
          description += ` that is ${aoeParameters.length || 30} feet long, ${aoeParameters.width || 5} feet wide, and ${aoeParameters.height || 10} feet high`;
        }
      }

      // Add multi-target info if applicable
      if (targetingType === 'multi') {
        description += ` affecting up to ${maxTargets} targets`;
      }
    }

    // Add propagation info if applicable
    if (selectedPropagation !== 'none') {
      const propagationObj = PROPAGATION_METHODS.find(m => m.id === selectedPropagation);
      const behaviorObj = selectedPropagation !== 'none' && selectedBehavior && PROPAGATION_BEHAVIORS[selectedPropagation] ?
        PROPAGATION_BEHAVIORS[selectedPropagation].find(b => b.id === selectedBehavior) : null;

      if (propagationObj) {
        description += `. After hitting, the spell ${propagationObj.description.toLowerCase()}`;

        if (behaviorObj) {
          description += ` It uses ${behaviorObj.name.toLowerCase()} targeting behavior.`;
        }
      }
    }

    // Add period at the end if not already there
    if (!description.endsWith('.')) {
      description += '.';
    }

    return description;
  };

  // Check if the current configuration is valid
  const isStepCompleted = validateStepCompletion(4, state);
  const disableNext = Object.keys(errors).length > 0;

  // Get helpful hints based on current spell configuration
  const getHints = () => {
    const hints = [
      'Targeting affects spell complexity and resource costs',
      'Area of Effect spells can hit multiple targets but may have reduced effectiveness',
    ];

    if (targetingType === 'area') {
      hints.push('Larger areas may dilute spell effects but affect more targets');
    }

    if (effectTypes.includes('damage') && targetingType === 'area') {
      hints.push('Consider lower damage for area effects to maintain balance');
    }

    if (selectedPropagation !== 'none') {
      hints.push('Propagation effects increase spell complexity but can greatly enhance effectiveness in certain situations');

      if (selectedPropagation === 'chain') {
        hints.push('Chain effects are excellent for controlled multi-target damage with predictable behavior');
      } else if (selectedPropagation === 'bounce') {
        hints.push('Bounce effects are great for crowded areas but can be unpredictable');
      } else if (selectedPropagation === 'explosion') {
        hints.push('Explosion effects create secondary AoE impacts, ideal for clustered targets');
      }
    }

    return hints;
  };

  return (
    <WizardStep
      title="Targeting & Propagation"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={isStepCompleted}
      isActive={true}
      onNext={handleSubmit}
      onPrevious={onPrevious}
      disableNext={disableNext}
      hints={getHints()}
    >
      <div className="targeting-container">
        {/* Targeting Mode Selection - MOVED TO TOP */}
        <div className="targeting-section">
          <h3 className="targeting-section-title">Targeting Mode</h3>
          <div className="targeting-mode-selector">
            <div className="targeting-mode-options">
              <div
                className={`targeting-mode-option ${state.targetingMode === 'unified' ? 'selected' : ''}`}
                onClick={() => {
                  dispatch(actionCreators.setTargetingMode('unified'));
                  setSelectedEffect(null);
                }}
              >
                <div className="targeting-mode-icon">
                  <img
                    src={`https://wow.zamimg.com/images/wow/icons/large/spell_arcane_portaldalaran.jpg`}
                    alt="Unified Targeting"
                  />
                </div>
                <div className="targeting-mode-content">
                  <h4>Unified Targeting</h4>
                  <p>All effects use the same targeting configuration</p>
                </div>
              </div>

              <div
                className={`targeting-mode-option ${state.targetingMode === 'effect' ? 'selected' : ''}`}
                onClick={() => {
                  dispatch(actionCreators.setTargetingMode('effect'));
                  // Select the first effect by default
                  if (state.effectTypes && state.effectTypes.length > 0) {
                    setSelectedEffect(state.effectTypes[0]);
                  }
                }}
                disabled={!state.effectTypes || state.effectTypes.length === 0}
              >
                <div className="targeting-mode-icon">
                  <img
                    src={`https://wow.zamimg.com/images/wow/icons/large/ability_hunter_snipershot.jpg`}
                    alt="Effect-Specific Targeting"
                  />
                </div>
                <div className="targeting-mode-content">
                  <h4>Effect-Specific Targeting</h4>
                  <p>Configure different targets for each effect type</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Effect Selection (only shown in effect-specific mode) */}
        {state.targetingMode === 'effect' && (
          <div className="targeting-section">
            <h3 className="targeting-section-title">Select Effect</h3>
            <p className="targeting-section-description">Choose which effect to configure targeting for</p>

            <div className="effect-selector">
              {(state.effectTypes || []).map(effectType => (
                <div
                  key={effectType}
                  className={`effect-selector-item ${selectedEffect === effectType ? 'selected' : ''}`}
                  onClick={() => setSelectedEffect(effectType)}
                >
                  <div className="effect-selector-icon">
                    <img
                      src={getEffectIconUrl(effectType)}
                      alt={effectType}
                      className="effect-icon"
                    />
                  </div>
                  <div className="effect-selector-name">
                    {effectType.charAt(0).toUpperCase() + effectType.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Targeting Type Selection */}
        <div className="targeting-section">
          <h3 className="targeting-section-title">
            {state.targetingMode === 'effect' && selectedEffect ?
              `${selectedEffect.charAt(0).toUpperCase() + selectedEffect.slice(1)} Targeting Type` :
              'Targeting Type'}
          </h3>
          <div className="targeting-options">
            {availableTargetingTypes.map(type => {
              // Determine if this type is selected based on the current mode
              let isSelected = false;
              if (state.targetingMode === 'unified') {
                isSelected = targetingType === type.id;
              } else if (selectedEffect && state.effectTargeting && state.effectTargeting[selectedEffect]) {
                isSelected = state.effectTargeting[selectedEffect].targetingType === type.id;
              }

              return (
                <div
                  key={type.id}
                  className={`targeting-option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    if (state.targetingMode === 'unified') {
                      // Update unified targeting
                      setTargetingType(type.id);
                      // Update the global state immediately
                      const config = {
                        ...targetingConfig,
                        targetingType: type.id,
                        maxTargets: type.id === 'multi' ? maxTargets : 1,
                        // Use the selected method for both single and multi-target spells
                        selectionMethod: (type.id === 'multi' || type.id === 'single') ? selectionMethod : 'manual',
                        aoeShape: (type.id === 'area' || type.id === 'trail') ? aoeShape : '',
                        aoeParameters: (type.id === 'area' || type.id === 'trail') ? aoeParameters : {},
                        movementBehavior: (type.id === 'area' || type.id === 'trail') ? movementBehavior : 'static',
                        targetSelectionMethod: (type.id === 'area' || type.id === 'trail') ? 'manual' : targetSelectionMethod
                      };
                      dispatch(actionCreators.updateTargetingConfig(config));
                    } else if (selectedEffect) {
                      // Update effect-specific targeting
                      const effectConfig = {
                        targetingType: type.id,
                        maxTargets: type.id === 'multi' ? maxTargets : 1,
                        // Use the selected method for both single and multi-target spells
                        selectionMethod: (type.id === 'multi' || type.id === 'single') ? selectionMethod : 'manual',
                        aoeShape: (type.id === 'area' || type.id === 'trail') ? aoeShape : '',
                        aoeParameters: (type.id === 'area' || type.id === 'trail') ? aoeParameters : {},
                        movementBehavior: (type.id === 'area' || type.id === 'trail') ? movementBehavior : 'static',
                        targetRestrictions: (selectedEffect && state.effectTargeting && state.effectTargeting[selectedEffect] && state.effectTargeting[selectedEffect].targetRestrictions) || ['enemies'],
                        targetSelectionMethod: (selectedEffect && state.effectTargeting && state.effectTargeting[selectedEffect] && state.effectTargeting[selectedEffect].targetSelectionMethod) || 'manual'
                      };

                      dispatch(actionCreators.updateEffectTargeting(selectedEffect, effectConfig));
                    }
                  }}
                >
                  <div className="targeting-option-header">
                    <div className="targeting-option-icon">
                      <img
                        src={`https://wow.zamimg.com/images/wow/icons/large/${type.icon}.jpg`}
                        alt={type.name}
                      />
                    </div>
                    <div className="targeting-option-name">{type.name}</div>
                  </div>
                  <div className="targeting-option-description">{type.description}</div>
                </div>
              );
            })}
          </div>
          {errors.targetingType && (
            <div className="spell-wizard-error">{errors.targetingType}</div>
          )}
        </div>

        {/* Target Selection Method */}
        {targetingType !== 'area' && targetingType !== 'trail' && targetingType !== 'self' && targetingType !== 'self_centered' && (
          <div className="targeting-section">
            <h3 className="targeting-section-title">
              {state.targetingMode === 'effect' && selectedEffect ?
                `${selectedEffect.charAt(0).toUpperCase() + selectedEffect.slice(1)} Selection Method` :
                'Target Selection Method'}
            </h3>
            <p className="targeting-section-description">How targets are selected when the spell is cast</p>
            <div className="targeting-options">
              {TARGET_SELECTION_METHODS.map(method => {
                // Determine if this method is selected based on the current mode
                let isSelected = false;
                if (state.targetingMode === 'unified') {
                  isSelected = targetSelectionMethod === method.id;
                } else if (selectedEffect && state.effectTargeting && state.effectTargeting[selectedEffect]) {
                  isSelected = state.effectTargeting[selectedEffect].targetSelectionMethod === method.id;
                }

                return (
                  <div
                    key={method.id}
                    className={`targeting-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      if (state.targetingMode === 'unified') {
                        // Update unified targeting
                        setTargetSelectionMethod(method.id);
                        // Also update selectionMethod for consistency and backward compatibility
                        setSelectionMethod(method.id);
                        // Update the global state immediately
                        const config = {
                          ...targetingConfig,
                          targetSelectionMethod: method.id,
                          selectionMethod: method.id // Set both properties
                        };
                        dispatch(actionCreators.updateTargetingConfig(config));
                      } else if (selectedEffect) {
                        // Update effect-specific targeting
                        const currentConfig = state.effectTargeting[selectedEffect] || {};
                        const effectConfig = {
                          ...currentConfig,
                          targetSelectionMethod: method.id,
                          selectionMethod: method.id // Set both properties
                        };
                        dispatch(actionCreators.updateEffectTargeting(selectedEffect, effectConfig));
                      }
                    }}
                  >
                    <div className="targeting-option-header">
                      <img
                        src={`https://wow.zamimg.com/images/wow/icons/large/${method.icon}.jpg`}
                        alt={method.name}
                        className="targeting-option-icon"
                      />
                      <div className="targeting-option-name">{method.name}</div>
                    </div>
                    <div className="targeting-option-description">{method.description}</div>
                    {isSelected && (
                      <div className="targeting-option-selected-indicator">
                        <span className="selected-checkmark">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {targetingType && (
          <div className="targeting-configuration">
            <div className="targeting-row">
              {/* Range Configuration */}
              <div className="targeting-column">
                <div className="targeting-section">
                  <h3 className="targeting-section-title">Range Configuration</h3>
                  <div className="targeting-options">
                    {/* Only show range types if not self-centered */}
                    {targetingType === 'self_centered' ? (
                      <div className="targeting-info-box">
                        <p>Self-centered effects always originate from the caster and do not require range selection.</p>
                      </div>
                    ) : (
                      RANGE_TYPES.map(type => (
                      <div
                        key={type.id}
                        className={`targeting-option-card ${rangeType === type.id ? 'selected' : ''}`}
                        onClick={() => {
                          setRangeType(type.id);
                          // Update the global state immediately
                          const config = {
                            ...targetingConfig,
                            rangeType: type.id,
                            rangeDistance: type.id === 'ranged' ? rangeDistance :
                                          type.id === 'touch' ? 5 :
                                          type.id === 'sight' ? 60 : -1
                          };
                          dispatch(actionCreators.updateTargetingConfig(config));
                        }}
                      >
                        <div className="targeting-option-header">
                          <img
                            src={`https://wow.zamimg.com/images/wow/icons/large/${type.icon}.jpg`}
                            alt={type.name}
                            className="targeting-option-icon"
                          />
                          <div className="targeting-option-name">{type.name}</div>
                        </div>
                        <div className="targeting-option-description">{type.description}</div>
                      </div>
                    )))
                    }
                  </div>

                  {rangeType === 'ranged' && (
                    <div className="targeting-params">
                      <label className="param-label">Range Distance (feet)</label>
                      <div className="range-slider">
                        <input
                          type="range"
                          min={5}
                          max={120}
                          step={5}
                          value={rangeDistance}
                          onChange={e => {
                            const newValue = Number(e.target.value);
                            setRangeDistance(newValue);
                            // Update the global state immediately
                            const config = {
                              ...targetingConfig,
                              rangeDistance: newValue
                            };
                            dispatch(actionCreators.updateTargetingConfig(config));
                          }}
                          className="param-input"
                        />
                        <span className="range-value">{rangeDistance} ft</span>
                      </div>
                      {errors.rangeDistance && (
                        <div className="spell-wizard-error">{errors.rangeDistance}</div>
                      )}
                    </div>
                  )}
                </div>



                {/* Target Restrictions */}
                {targetingType !== 'self' && (
                  <div className="targeting-section">
                    <h3 className="targeting-section-title">Target Restrictions</h3>
                    <p className="targeting-section-description">Select one or more target types that this spell can affect</p>
                    <div className="targeting-options">
                      {TARGET_RESTRICTIONS.filter(r =>
                        !(targetingType === 'self' && r.id !== 'self')
                      ).map(restriction => (
                        <div
                          key={restriction.id}
                          className={`targeting-option-card ${targetRestrictions.includes(restriction.id) ? 'selected' : ''}`}
                          onClick={() => {
                            // Toggle the restriction in the array
                            let newRestrictions;
                            if (targetRestrictions.includes(restriction.id)) {
                              // Don't allow removing the last restriction
                              if (targetRestrictions.length === 1) return;
                              newRestrictions = targetRestrictions.filter(id => id !== restriction.id);
                            } else {
                              // If 'any' is being added, clear all others
                              if (restriction.id === 'any') {
                                newRestrictions = ['any'];
                              } else {
                                // If adding a specific restriction, remove 'any'
                                newRestrictions = targetRestrictions.filter(id => id !== 'any');
                                newRestrictions.push(restriction.id);
                              }
                            }

                            setTargetRestrictions(newRestrictions);

                            // Update the global state immediately
                            const config = {
                              ...targetingConfig,
                              targetRestrictions: newRestrictions
                            };
                            dispatch(actionCreators.updateTargetingConfig(config));
                          }}
                        >
                          <div className="targeting-option-header">
                            <img
                              src={`https://wow.zamimg.com/images/wow/icons/large/${restriction.icon}.jpg`}
                              alt={restriction.name}
                              className="targeting-option-icon"
                            />
                            <div className="targeting-option-name">{restriction.name}</div>
                          </div>
                          <div className="targeting-option-description">{restriction.description}</div>
                          {targetRestrictions.includes(restriction.id) && (
                            <div className="targeting-option-selected-indicator">
                              <span className="selected-checkmark">✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="targeting-selected-summary">
                      <strong>Selected Targets:</strong> {targetRestrictions.map(id => {
                        const restriction = TARGET_RESTRICTIONS.find(r => r.id === id);
                        return restriction ? restriction.name : '';
                      }).join(', ')}
                    </div>
                  </div>
                )}

                {/* Multi-Target Configuration */}
                {targetingType === 'multi' && (
                  <div className="targeting-section">
                    <h3 className="targeting-section-title">Multiple Target Configuration</h3>
                    <div className="targeting-params">
                      <label className="param-label">Maximum Number of Targets</label>
                      <div className="range-slider">
                        <input
                          type="range"
                          min={2}
                          max={10}
                          value={maxTargets}
                          onChange={e => setMaxTargets(Number(e.target.value))}
                          className="param-input"
                        />
                        <span className="range-value">{maxTargets}</span>
                      </div>
                      {errors.maxTargets && (
                        <div className="spell-wizard-error">{errors.maxTargets}</div>
                      )}
                    </div>


                  </div>
                )}
              </div>

              {/* Area of Effect Configuration */}
              <div className="targeting-column">
                {(targetingType === 'area' || targetingType === 'self_centered') && (
                  <div className="targeting-section">
                    <h3 className="targeting-section-title">Area of Effect Configuration</h3>
                    <div className="targeting-options">
                      {AOE_SHAPES
                        .filter(shape => {
                          // Only show trail shape for self-centered targeting
                          if (shape.id === 'trail' && targetingType !== 'self_centered') {
                            return false;
                          }
                          return true;
                        })
                        .map(shape => (
                        <div
                          key={shape.id}
                          className={`targeting-option-card ${aoeShape === shape.id ? 'selected' : ''}`}
                          onClick={() => {
                            setAoeShape(shape.id);
                            // Update the global state immediately
                            const config = {
                              ...targetingConfig,
                              aoeShape: shape.id,
                              aoeParameters: {
                                ...aoeParameters
                              }
                            };
                            dispatch(actionCreators.updateTargetingConfig(config));
                          }}
                        >
                          <div className="targeting-option-header">
                            <img
                              src={`https://wow.zamimg.com/images/wow/icons/large/${shape.icon}.jpg`}
                              alt={shape.name}
                              className="targeting-option-icon"
                            />
                            <div className="targeting-option-name">{shape.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.aoeShape && (
                      <div className="spell-wizard-error">{errors.aoeShape}</div>
                    )}

                    {aoeShape && (
                      <div className="targeting-params">
                        <h4 className="params-title">Shape Parameters</h4>
                        {aoeShape === 'circle' && (
                          <div className="param-group">
                            <label className="param-label">Radius (feet)</label>
                            <div className="range-slider">
                              <input
                                type="range"
                                min={5}
                                max={60}
                                step={5}
                                value={aoeParameters.radius || 20}
                                onChange={e => updateAoeParameter('radius', Number(e.target.value))}
                                className="param-input"
                              />
                              <span className="range-value">{aoeParameters.radius || 20} ft</span>
                            </div>
                          </div>
                        )}

                        {aoeShape === 'square' && (
                          <div className="param-group">
                            <label className="param-label">Side Length (feet)</label>
                            <div className="range-slider">
                              <input
                                type="range"
                                min={5}
                                max={60}
                                step={5}
                                value={aoeParameters.size || 15}
                                onChange={e => updateAoeParameter('size', Number(e.target.value))}
                                className="param-input"
                              />
                              <span className="range-value">{aoeParameters.size || 15} ft</span>
                            </div>
                          </div>
                        )}

                        {aoeShape === 'cone' && (
                          <>
                            <div className="param-group">
                              <label className="param-label">Range (feet)</label>
                              <div className="range-slider">
                                <input
                                  type="range"
                                  min={5}
                                  max={60}
                                  step={5}
                                  value={aoeParameters.range || 15}
                                  onChange={e => updateAoeParameter('range', Number(e.target.value))}
                                  className="param-input"
                                />
                                <span className="range-value">{aoeParameters.range || 15} ft</span>
                              </div>
                            </div>
                            <div className="param-group">
                              <label className="param-label">Angle (degrees)</label>
                              <div className="range-slider">
                                <input
                                  type="range"
                                  min={15}
                                  max={180}
                                  step={15}
                                  value={aoeParameters.angle || 90}
                                  onChange={e => updateAoeParameter('angle', Number(e.target.value))}
                                  className="param-input"
                                />
                                <span className="range-value">{aoeParameters.angle || 90}°</span>
                              </div>
                            </div>
                          </>
                        )}

                        {aoeShape === 'line' && (
                          <>
                            <div className="param-group">
                              <label className="param-label">Length (feet)</label>
                              <div className="range-slider">
                                <input
                                  type="range"
                                  min={5}
                                  max={120}
                                  step={5}
                                  value={aoeParameters.length || 30}
                                  onChange={e => updateAoeParameter('length', Number(e.target.value))}
                                  className="param-input"
                                />
                                <span className="range-value">{aoeParameters.length || 30} ft</span>
                              </div>
                            </div>
                            <div className="param-group">
                              <label className="param-label">Width (feet)</label>
                              <div className="range-slider">
                                <input
                                  type="range"
                                  min={5}
                                  max={20}
                                  step={5}
                                  value={aoeParameters.width || 5}
                                  onChange={e => updateAoeParameter('width', Number(e.target.value))}
                                  className="param-input"
                                />
                                <span className="range-value">{aoeParameters.width || 5} ft</span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Show trail width for trail shape or when leaveTrail is enabled */}
                        {(aoeShape === 'trail' || (isZoneSpell && state.typeConfig?.leaveTrail)) && (
                          <>
                            <div className="param-group">
                              <label className="param-label">Trail Width (feet)</label>
                              <div className="range-slider">
                                <input
                                  type="range"
                                  min={5}
                                  max={20}
                                  step={5}
                                  value={aoeParameters.width || 5}
                                  onChange={e => updateAoeParameter('width', Number(e.target.value))}
                                  className="param-input"
                                />
                                <span className="range-value">{aoeParameters.width || 5} ft</span>
                              </div>
                            </div>
                            <div className="param-group">
                              <div className="spell-wizard-info-box">
                                <p>The trail duration is configured in the Spell Type step.</p>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Movement behavior for zone spells and any shape with leaveTrail enabled */}
                        {(isZoneSpell || (targetingType === 'self_centered' && (aoeShape === 'trail' || state.typeConfig?.leaveTrail))) && (
                          <>
                            {/* Trail Status Indicator */}
                            {state.typeConfig?.leaveTrail && (
                              <div className="param-group trail-enabled-indicator">
                                <div className="spell-wizard-info-box" style={{
                                  backgroundColor: 'rgba(46, 204, 113, 0.1)',
                                  borderLeft: '3px solid #2ecc71',
                                  padding: '8px 12px',
                                  marginBottom: '10px'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{
                                      color: '#2ecc71',
                                      marginRight: '8px',
                                      fontSize: '16px'
                                    }}>✓</span>
                                    <span>Trail Effect Enabled</span>
                                  </div>
                                  <p style={{ fontSize: '11px', margin: '5px 0 0 0' }}>
                                    This spell will leave a trail of effects as it moves. Each trail segment remains active for {state.typeConfig?.trailDuration || 3} {state.typeConfig?.trailDurationUnit || 'rounds'}. Use the directional controls to test the trail visualization.
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="param-group">
                              <label className="param-label">Movement Behavior</label>
                              <select
                                className="param-select"
                                value={movementBehavior}
                                onChange={e => {
                                  setMovementBehavior(e.target.value);
                                  // Update the global state immediately
                                  const config = {
                                    ...targetingConfig,
                                    movementBehavior: e.target.value
                                  };
                                  dispatch(actionCreators.updateTargetingConfig(config));
                                }}
                              >
                                <option value="static">Static (stays in place)</option>
                                <option value="follows_caster">Follows Caster</option>
                                <option value="movable">Movable (as an action)</option>
                              </select>
                              <small className="param-help-text">
                                How the {(targetingType === 'self_centered' && (aoeShape === 'trail' || state.typeConfig?.leaveTrail)) ? 'trail' : 'zone'} moves during its duration
                              </small>
                            </div>
                          </>
                        )}

                        {/* Add other shape parameters as needed */}
                      </div>
                    )}

                    {areaStats && (
                      <div className="targeting-info-box">
                        <h4>Area of Effect Statistics</h4>
                        <ul>
                          <li>Area: {Math.round(areaStats.area)} square feet</li>
                          <li>Affected Grid Squares: ~{areaStats.affectedSquares}</li>
                          <li>Estimated Maximum Targets: {estimatedTargets === 'variable' ? 'Variable' : estimatedTargets}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Propagation Configuration */}
                <div className="targeting-section propagation-section">
                  <h3 className="targeting-section-title propagation-section-title">Propagation Method</h3>
                  <div className="propagation-methods">
                    {PROPAGATION_METHODS.map(method => (
                      <div
                        key={method.id}
                        className={`propagation-card ${selectedPropagation === method.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedPropagation(method.id);
                          // Reset behavior when changing method
                          const newBehavior = method.id !== selectedPropagation ? '' : selectedBehavior;
                          if (method.id !== selectedPropagation) {
                            setSelectedBehavior('');
                          }

                          // Update the global state immediately
                          const propagationConfig = {
                            method: method.id,
                            behavior: newBehavior,
                            parameters: {
                              count: propagationCount,
                              range: propagationRange,
                              decay: propagationDecay,
                              secondaryRadius: secondaryRadius,
                              spreadRate: spreadRate,
                              forkCount: forkCount
                            }
                          };

                          dispatch(actionCreators.updatePropagation(propagationConfig));
                        }}
                      >
                        <div className="propagation-card-header">
                          <img
                            src={`https://wow.zamimg.com/images/wow/icons/large/${method.icon}.jpg`}
                            alt={method.name}
                            className="propagation-card-icon"
                          />
                        </div>
                        <div className="propagation-card-title">{method.name}</div>
                        <div className="propagation-card-description">{method.description}</div>
                        <ul className="propagation-card-benefits">
                          {method.effects.map((effect, idx) => (
                            <li key={idx}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {selectedPropagation !== 'none' && (
                    <div className="propagation-behavior">
                      <h4 className="params-title">Propagation Behavior</h4>
                      <div className="targeting-options">
                        {PROPAGATION_BEHAVIORS[selectedPropagation].map(behavior => (
                          <div
                            key={behavior.id}
                            className={`targeting-option-card ${selectedBehavior === behavior.id ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedBehavior(behavior.id);

                              // Update the global state immediately
                              const propagationConfig = {
                                method: selectedPropagation,
                                behavior: behavior.id,
                                parameters: {
                                  count: propagationCount,
                                  range: propagationRange,
                                  decay: propagationDecay,
                                  secondaryRadius: secondaryRadius,
                                  spreadRate: spreadRate,
                                  forkCount: forkCount
                                }
                              };

                              dispatch(actionCreators.updatePropagation(propagationConfig));
                            }}
                          >
                            <div className="targeting-option-header">
                              <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${behavior.icon}.jpg`}
                                alt={behavior.name}
                                className="targeting-option-icon"
                              />
                              <div className="targeting-option-name">{behavior.name}</div>
                            </div>
                            <div className="targeting-option-description">{behavior.description}</div>
                          </div>
                        ))}
                      </div>
                      {errors.propagationBehavior && (
                        <div className="spell-wizard-error">{errors.propagationBehavior}</div>
                      )}
                    </div>
                  )}

                  {selectedPropagation !== 'none' && selectedBehavior && (
                    <div className="propagation-params">
                      <h4 className="params-title">Propagation Parameters</h4>

                      {/* Shared parameters */}
                      {(selectedPropagation === 'chain' || selectedPropagation === 'bounce') && (
                        <>
                          <div className="param-group">
                            <label className="param-label">Number of Additional Targets</label>
                            <div className="range-slider">
                              <input
                                type="range"
                                min={1}
                                max={10}
                                value={propagationCount}
                                onChange={e => {
                                  const newCount = Number(e.target.value);
                                  setPropagationCount(newCount);

                                  // Update global state immediately
                                  const propagationConfig = {
                                    method: selectedPropagation,
                                    behavior: selectedBehavior,
                                    parameters: {
                                      count: newCount,
                                      range: propagationRange,
                                      decay: propagationDecay,
                                      secondaryRadius: secondaryRadius,
                                      spreadRate: spreadRate,
                                      forkCount: forkCount
                                    }
                                  };
                                  dispatch(actionCreators.updatePropagation(propagationConfig));
                                }}
                                className="param-input"
                              />
                              <span className="range-value">{propagationCount}</span>
                            </div>
                          </div>
                          <div className="param-group">
                            <label className="param-label">Maximum Range (feet)</label>
                            <div className="range-slider">
                              <input
                                type="range"
                                min={5}
                                max={60}
                                step={5}
                                value={propagationRange}
                                onChange={e => {
                                  const newRange = Number(e.target.value);
                                  setPropagationRange(newRange);

                                  // Update global state immediately
                                  const propagationConfig = {
                                    method: selectedPropagation,
                                    behavior: selectedBehavior,
                                    parameters: {
                                      count: propagationCount,
                                      range: newRange,
                                      decay: propagationDecay,
                                      secondaryRadius: secondaryRadius,
                                      spreadRate: spreadRate,
                                      forkCount: forkCount
                                    }
                                  };
                                  dispatch(actionCreators.updatePropagation(propagationConfig));
                                }}
                                className="param-input"
                              />
                              <span className="range-value">{propagationRange} ft</span>
                            </div>
                          </div>
                          <div className="param-group">
                            <label className="param-label">Effect Decay (%)</label>
                            <div className="range-slider">
                              <input
                                type="range"
                                min={0}
                                max={50}
                                step={5}
                                value={propagationDecay}
                                onChange={e => {
                                  const newDecay = Number(e.target.value);
                                  setPropagationDecay(newDecay);

                                  // Update global state immediately
                                  const propagationConfig = {
                                    method: selectedPropagation,
                                    behavior: selectedBehavior,
                                    parameters: {
                                      count: propagationCount,
                                      range: propagationRange,
                                      decay: newDecay,
                                      secondaryRadius: secondaryRadius,
                                      spreadRate: spreadRate,
                                      forkCount: forkCount
                                    }
                                  };
                                  dispatch(actionCreators.updatePropagation(propagationConfig));
                                }}
                                className="param-input"
                              />
                              <span className="range-value">{propagationDecay}%</span>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedPropagation === 'seeking' && (
                        <div className="param-group">
                          <label className="param-label">Seeking Range (feet)</label>
                          <div className="range-slider">
                            <input
                              type="range"
                              min={5}
                              max={60}
                              step={5}
                              value={propagationRange}
                              onChange={e => {
                                const newRange = Number(e.target.value);
                                setPropagationRange(newRange);

                                // Update global state immediately
                                const propagationConfig = {
                                  method: selectedPropagation,
                                  behavior: selectedBehavior,
                                  parameters: {
                                    count: propagationCount,
                                    range: newRange,
                                    decay: propagationDecay,
                                    secondaryRadius: secondaryRadius,
                                    spreadRate: spreadRate,
                                    forkCount: forkCount
                                  }
                                };
                                dispatch(actionCreators.updatePropagation(propagationConfig));
                              }}
                              className="param-input"
                            />
                            <span className="range-value">{propagationRange} ft</span>
                          </div>
                        </div>
                      )}

                      {selectedPropagation === 'explosion' && (
                        <div className="param-group">
                          <label className="param-label">Explosion Radius (feet)</label>
                          <div className="range-slider">
                            <input
                              type="range"
                              min={5}
                              max={30}
                              step={5}
                              value={secondaryRadius}
                              onChange={e => {
                                const newRadius = Number(e.target.value);
                                setSecondaryRadius(newRadius);

                                // Update global state immediately
                                const propagationConfig = {
                                  method: selectedPropagation,
                                  behavior: selectedBehavior,
                                  parameters: {
                                    count: propagationCount,
                                    range: propagationRange,
                                    decay: propagationDecay,
                                    secondaryRadius: newRadius,
                                    spreadRate: spreadRate,
                                    forkCount: forkCount
                                  }
                                };
                                dispatch(actionCreators.updatePropagation(propagationConfig));
                              }}
                              className="param-input"
                            />
                            <span className="range-value">{secondaryRadius} ft</span>
                          </div>
                        </div>
                      )}

                      {selectedPropagation === 'spreading' && (
                        <div className="param-group">
                          <label className="param-label">Spread Rate (feet/second)</label>
                          <div className="range-slider">
                            <input
                              type="range"
                              min={1}
                              max={10}
                              value={spreadRate}
                              onChange={e => {
                                const newRate = Number(e.target.value);
                                setSpreadRate(newRate);

                                // Update global state immediately
                                const propagationConfig = {
                                  method: selectedPropagation,
                                  behavior: selectedBehavior,
                                  parameters: {
                                    count: propagationCount,
                                    range: propagationRange,
                                    decay: propagationDecay,
                                    secondaryRadius: secondaryRadius,
                                    spreadRate: newRate,
                                    forkCount: forkCount
                                  }
                                };
                                dispatch(actionCreators.updatePropagation(propagationConfig));
                              }}
                              className="param-input"
                            />
                            <span className="range-value">{spreadRate} ft/s</span>
                          </div>
                        </div>
                      )}

                      {selectedPropagation === 'forking' && (
                        <div className="param-group">
                          <label className="param-label">Number of Forks</label>
                          <div className="range-slider">
                            <input
                              type="range"
                              min={1}
                              max={6}
                              value={forkCount}
                              onChange={e => {
                                const newForkCount = Number(e.target.value);
                                setForkCount(newForkCount);

                                // Update global state immediately
                                const propagationConfig = {
                                  method: selectedPropagation,
                                  behavior: selectedBehavior,
                                  parameters: {
                                    count: propagationCount,
                                    range: propagationRange,
                                    decay: propagationDecay,
                                    secondaryRadius: secondaryRadius,
                                    spreadRate: spreadRate,
                                    forkCount: newForkCount
                                  }
                                };
                                dispatch(actionCreators.updatePropagation(propagationConfig));
                              }}
                              className="param-input"
                            />
                            <span className="range-value">{forkCount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Targeting Visualization */}
            <div className="targeting-section">
              <h3 className="targeting-section-title">Targeting Visualization</h3>
              <div className="targeting-grid-container">
                <div className="targeting-grid-header">
                  <div className="targeting-grid-title">
                    {(getTargetingTypeById(targetingType) || TARGETING_TYPES.find(t => t.id === targetingType))?.name || 'Custom'} Targeting
                  </div>
                  {selectedPropagation !== 'none' && targetPosition && (
                    <div className="preview-controls">
                      <button
                        className="wow-button preview-button"
                        onClick={startAnimation}
                      >
                        {animationActive ? 'Stop Animation' : 'Preview Propagation'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="targeting-grid-wrapper">
                  <canvas
                    ref={canvasRef}
                    className="targeting-canvas"
                    onMouseMove={handleCanvasMouseMove}
                    onMouseLeave={handleCanvasMouseLeave}
                    onClick={handleCanvasClick}
                  />
                  {hoveredCell && (
                    <div className="targeting-grid-info">
                      Position: ({hoveredCell.x}, {hoveredCell.y}) |
                      {rangeType !== 'unlimited' && ` Distance: ${calculateDistance({x: centerCellX, y: centerCellY}, hoveredCell)} ft |`}
                      {' '}Effect: {getEffectStrength(hoveredCell)}
                    </div>
                  )}

                  {/* Directional Controls for Caster Position */}
                  <div className="caster-direction-controls">
                    <div className="caster-controls-label">Move Caster Position</div>
                    <button
                      className="direction-button up-arrow"
                      onClick={() => {
                        // Move caster up (decrease y by 1)
                        const newY = Math.max(0, centerCellY - 1);

                        // If leaveTrail is enabled and we have a target position, record the current position
                        if (state.typeConfig?.leaveTrail && targetPosition) {
                          console.log("Adding current target position to trail:", targetPosition);
                          // Limit trail positions to prevent performance issues (keep last 10 positions)
                          setTrailPositions(prev => {
                            const newPositions = [...prev, { ...targetPosition }];
                            return newPositions.length > 10 ? newPositions.slice(-10) : newPositions;
                          });
                        }

                        // Update caster position
                        setCenterCellY(newY);

                        // If movement behavior is 'follows_caster', update target position too
                        if (movementBehavior === 'follows_caster' && targetPosition) {
                          // Calculate the offset between target and caster
                          const offsetX = targetPosition.x - centerCellX;
                          const offsetY = targetPosition.y - centerCellY;

                          // Apply the same offset to the new caster position
                          const newTargetPosition = {
                            x: centerCellX + offsetX,
                            y: newY + offsetY
                          };

                          // Update target position
                          setTargetPosition(newTargetPosition);
                        }
                      }}
                      title="Move caster up"
                    >
                      ↑
                    </button>

                    <div className="horizontal-arrows">
                      <button
                        className="direction-button left-arrow"
                        onClick={() => {
                          // Move caster left (decrease x by 1)
                          const newX = Math.max(0, centerCellX - 1);

                          // If leaveTrail is enabled and we have a target position, record the current position
                          if (state.typeConfig?.leaveTrail && targetPosition) {
                            console.log("Adding current target position to trail:", targetPosition);
                            // Limit trail positions to prevent performance issues (keep last 10 positions)
                            setTrailPositions(prev => {
                              const newPositions = [...prev, { ...targetPosition }];
                              return newPositions.length > 10 ? newPositions.slice(-10) : newPositions;
                            });
                          }

                          // Update caster position
                          setCenterCellX(newX);

                          // If movement behavior is 'follows_caster', update target position too
                          if (movementBehavior === 'follows_caster' && targetPosition) {
                            // Calculate the offset between target and caster
                            const offsetX = targetPosition.x - centerCellX;
                            const offsetY = targetPosition.y - centerCellY;

                            // Apply the same offset to the new caster position
                            const newTargetPosition = {
                              x: newX + offsetX,
                              y: centerCellY + offsetY
                            };

                            // Update target position
                            setTargetPosition(newTargetPosition);
                          }
                        }}
                        title="Move caster left"
                      >
                        ←
                      </button>

                      <button
                        className="direction-button reset-button"
                        onClick={() => {
                          // Reset caster position to center
                          const center = Math.floor(GRID_CELLS / 2);

                          // Clear trail positions when resetting
                          setTrailPositions([]);

                          setCenterCellX(center);
                          setCenterCellY(center);

                          // If movement behavior is 'follows_caster', reset target position too
                          if (movementBehavior === 'follows_caster' && targetPosition) {
                            // Calculate the offset between target and caster
                            const offsetX = targetPosition.x - centerCellX;
                            const offsetY = targetPosition.y - centerCellY;

                            // Apply the same offset to the new caster position
                            const newTargetPosition = {
                              x: center + offsetX,
                              y: center + offsetY
                            };

                            // Update target position
                            setTargetPosition(newTargetPosition);

                            // If leaveTrail is enabled, initialize the trail with the new position
                            if (state.typeConfig?.leaveTrail) {
                              console.log("Initializing trail after reset:", newTargetPosition);
                              // Start with the new position in the trail
                              setTrailPositions([{ ...newTargetPosition }]);
                            }
                          } else if (state.typeConfig?.leaveTrail && targetPosition) {
                            // For other movement types, initialize the trail with the current target position
                            console.log("Initializing trail with current target after reset:", targetPosition);
                            setTrailPositions([{ ...targetPosition }]);
                          }
                        }}
                        title="Reset caster position"
                      >
                        ⟲
                      </button>

                      <button
                        className="direction-button right-arrow"
                        onClick={() => {
                          // Move caster right (increase x by 1)
                          const newX = Math.min(GRID_CELLS - 1, centerCellX + 1);

                          // If leaveTrail is enabled and we have a target position, record the current position
                          if (state.typeConfig?.leaveTrail && targetPosition) {
                            console.log("Adding current target position to trail:", targetPosition);
                            // Limit trail positions to prevent performance issues (keep last 10 positions)
                            setTrailPositions(prev => {
                              const newPositions = [...prev, { ...targetPosition }];
                              return newPositions.length > 10 ? newPositions.slice(-10) : newPositions;
                            });
                          }

                          // Update caster position
                          setCenterCellX(newX);

                          // If movement behavior is 'follows_caster', update target position too
                          if (movementBehavior === 'follows_caster' && targetPosition) {
                            // Calculate the offset between target and caster
                            const offsetX = targetPosition.x - centerCellX;
                            const offsetY = targetPosition.y - centerCellY;

                            // Apply the same offset to the new caster position
                            const newTargetPosition = {
                              x: newX + offsetX,
                              y: centerCellY + offsetY
                            };

                            // Update target position
                            setTargetPosition(newTargetPosition);
                          }
                        }}
                        title="Move caster right"
                      >
                        →
                      </button>
                    </div>

                    <button
                      className="direction-button down-arrow"
                      onClick={() => {
                        // Move caster down (increase y by 1)
                        const newY = Math.min(GRID_CELLS - 1, centerCellY + 1);

                        // If leaveTrail is enabled and we have a target position, record the current position
                        if (state.typeConfig?.leaveTrail && targetPosition) {
                          console.log("Adding current target position to trail:", targetPosition);
                          // Limit trail positions to prevent performance issues (keep last 10 positions)
                          setTrailPositions(prev => {
                            const newPositions = [...prev, { ...targetPosition }];
                            return newPositions.length > 10 ? newPositions.slice(-10) : newPositions;
                          });
                        }

                        // Update caster position
                        setCenterCellY(newY);

                        // If movement behavior is 'follows_caster', update target position too
                        if (movementBehavior === 'follows_caster' && targetPosition) {
                          // Calculate the offset between target and caster
                          const offsetX = targetPosition.x - centerCellX;
                          const offsetY = targetPosition.y - centerCellY;

                          // Apply the same offset to the new caster position
                          const newTargetPosition = {
                            x: centerCellX + offsetX,
                            y: newY + offsetY
                          };

                          // Update target position
                          setTargetPosition(newTargetPosition);
                        }
                      }}
                      title="Move caster down"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>
              <div className="spell-wizard-targeting-description">
                {getTargetingDescription()}
              </div>

              <div className="targeting-legend">
                <div className="legend-item">
                  <div className="legend-color legend-caster"></div>
                  <span>Caster</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-range"></div>
                  <span>Range Limit</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-target"></div>
                  <span>Target</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-aoe"></div>
                  <span>Area of Effect</span>
                </div>
                {state.typeConfig?.leaveTrail && (
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: 'rgba(65, 105, 225, 0.6)' }}></div>
                    <span>Trail</span>
                  </div>
                )}
              </div>
            </div>

            {/* Resource Cost Implications */}
            <div className="targeting-section">
              <h3 className="targeting-section-title">Resource Implications</h3>
              <div className="targeting-info-box">
                <p>
                  Your targeting choices affect the resource cost and complexity of your spell:
                </p>
                <ul>
                  <li>
                    <strong>Targeting Type:</strong> {(getTargetingTypeById(targetingType) || TARGETING_TYPES.find(t => t.id === targetingType))?.name || 'None'}
                    {(getTargetingTypeById(targetingType) || TARGETING_TYPES.find(t => t.id === targetingType)) &&
                      ` (${(getTargetingTypeById(targetingType) || TARGETING_TYPES.find(t => t.id === targetingType)).actionPointModifier > 0 ? '+' : ''}${(getTargetingTypeById(targetingType) || TARGETING_TYPES.find(t => t.id === targetingType)).actionPointModifier} AP)`
                    }
                  </li>
                  {targetingType === 'area' && aoeShape && (
                    <li>
                      <strong>Area Type:</strong> {getAoeShapeById(aoeShape)?.name || 'None'}
                    </li>
                  )}
                  {selectedPropagation !== 'none' && (
                    <li>
                      <strong>Propagation:</strong> {PROPAGATION_METHODS.find(m => m.id === selectedPropagation)?.name || 'None'} (+2 AP)
                    </li>
                  )}
                  <li>
                    <strong>Total AP Modifier:</strong> {
                      ((getTargetingTypeById(targetingType) || TARGETING_TYPES.find(t => t.id === targetingType))?.actionPointModifier || 0) +
                      (selectedPropagation !== 'none' ? 2 : 0)
                    }
                  </li>
                </ul>
              </div>
            </div>


          </div>
        )}
      </div>

      {/* Make the spell wizard state available to the TargetingGrid component */}

      <style jsx>{`
        .duration-config {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .duration-value {
          flex: 0 0 120px;
        }

        .duration-value input {
          width: 100%;
          text-align: center;
          font-size: 14px;
          padding: 8px 12px;
        }

        .duration-unit {
          flex: 1;
        }

        /* Styling for the trail legend item */
        .legend-item:last-child .legend-color {
          position: relative;
          overflow: hidden;
        }

        .legend-item:last-child .legend-color::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg,
            rgba(135, 206, 250, 0.6) 25%,
            rgba(30, 144, 255, 0.6) 50%,
            rgba(0, 191, 255, 0.6) 75%,
            rgba(100, 149, 237, 0.6) 100%);
          animation: shimmer 2s infinite linear;
        }

        @keyframes shimmer {
          0% {
            background-position: -100px 0;
          }
          100% {
            background-position: 100px 0;
          }
        }
      `}</style>
    </WizardStep>
  );
};

export default Step4Targeting;