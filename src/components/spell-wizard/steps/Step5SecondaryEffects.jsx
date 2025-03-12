import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { SpellPreview, StepNavigation, DiceCalculator } from '../common';

// Utility types with detailed descriptions
const UTILITY_TYPES = [
  { 
    id: 'movement', 
    name: 'Movement', 
    description: 'Affects movement or positioning', 
    icon: 'ability_rogue_sprint',
    color: 'var(--primary-300)',
    details: 'Movement spells let characters traverse environments in new ways or manipulate the position of others.',
    examples: ['Teleportation', 'Flight', 'Levitation', 'Wall walking', 'Speed boost']
  },
  { 
    id: 'vision', 
    name: 'Vision/Detection', 
    description: 'Provides special sight or detection abilities', 
    icon: 'spell_shadow_eyeofthedarkmoon',
    color: 'var(--damage-arcane)',
    details: 'Detection spells reveal hidden things, from invisible creatures to magical auras or traps.',
    examples: ['See invisible', 'Detect magic', 'Darkvision', 'True sight', 'Detect traps']
  },
  { 
    id: 'illusion', 
    name: 'Illusion', 
    description: 'Creates visual or sensory deceptions', 
    icon: 'spell_shadow_improvedvampiricembrace',
    color: 'var(--damage-shadow)',
    details: 'Illusion spells deceive the senses, creating false images, sounds, or other sensory effects.',
    examples: ['Invisibility', 'Mirror image', 'Disguise', 'Phantom sound', 'Illusory terrain']
  },
  { 
    id: 'conjuration', 
    name: 'Conjuration', 
    description: 'Creates objects or creatures', 
    icon: 'spell_arcane_portaldalaran',
    color: 'var(--damage-arcane)',
    details: 'Conjuration spells bring creatures or objects into existence, either by creating or summoning them.',
    examples: ['Summon familiar', 'Create water', 'Conjure weapon', 'Portal creation', 'Magical shelter']
  },
  { 
    id: 'transformation', 
    name: 'Transformation', 
    description: 'Changes form or properties', 
    icon: 'spell_nature_wispsplode',
    color: 'var(--damage-nature)',
    details: 'Transformation spells alter the physical form or fundamental properties of creatures or objects.',
    examples: ['Polymorph', 'Gaseous form', 'Stone to flesh', 'Enlarge/reduce', 'Elemental transformation']
  },
  { 
    id: 'enchantment', 
    name: 'Enchantment', 
    description: 'Imbues objects with magical properties', 
    icon: 'spell_holy_harmundeadaura',
    color: 'var(--damage-holy)',
    details: 'Enchantment spells imbue objects or creatures with magical properties or influence minds.',
    examples: ['Magic weapon', 'Charm person', 'Lock enhancement', 'Object animation', 'Mind control']
  },
  { 
    id: 'divination', 
    name: 'Divination', 
    description: 'Provides information or knowledge', 
    icon: 'spell_holy_mindvision',
    color: 'var(--primary-light)',
    details: 'Divination spells reveal information, from distant locations to possible futures or hidden knowledge.',
    examples: ['Scrying', 'Identify', 'Detect thoughts', 'Locate object', 'Commune with higher powers']
  },
  { 
    id: 'environmental', 
    name: 'Environmental', 
    description: 'Affects or manipulates the environment', 
    icon: 'spell_nature_earthquake',
    color: 'var(--damage-nature)',
    details: 'Environmental spells manipulate the natural world, from weather to terrain or natural hazards.',
    examples: ['Control weather', 'Wall of stone', 'Create water', 'Modify terrain', 'Extinguish flames']
  },
  { 
    id: 'teleportation', 
    name: 'Teleportation', 
    description: 'Moves targets instantly between locations', 
    icon: 'spell_arcane_blink',
    color: 'var(--damage-arcane)',
    details: 'Teleportation spells instantly transport creatures or objects from one location to another.',
    examples: ['Teleport', 'Dimension door', 'Blink', 'Misty step', 'Portal creation']
  },
  { 
    id: 'protection', 
    name: 'Protection', 
    description: 'Creates barriers or wards against damage or effects', 
    icon: 'spell_holy_powerwordbarrier',
    color: 'var(--damage-holy)',
    details: 'Protection spells create barriers, wards, or other defenses against harm or intrusion.',
    examples: ['Magic circle', 'Shield', 'Antimagic field', 'Ward against creatures', 'Alarm']
  },
  { 
    id: 'summoning', 
    name: 'Summoning', 
    description: 'Calls creatures or entities to aid you', 
    icon: 'spell_shadow_summoninfernal',
    color: 'var(--damage-shadow)',
    details: 'Summoning spells call creatures or entities from other planes or locations to serve the caster.',
    examples: ['Summon elemental', 'Call animal companion', 'Conjure fey', 'Spirit guardians', 'Planar ally']
  },
  { 
    id: 'communication', 
    name: 'Communication', 
    description: 'Enables or enhances communication abilities', 
    icon: 'spell_holy_silence',
    color: 'var(--damage-holy)',
    details: 'Communication spells facilitate understanding or exchange of information between creatures.',
    examples: ['Telepathy', 'Comprehend languages', 'Animal messenger', 'Sending', 'Tongues']
  }
];

// Movement sub-types
const MOVEMENT_SUBTYPES = [
  { id: 'teleport', name: 'Teleportation', icon: 'spell_arcane_blink', description: 'Instantly move from one location to another' },
  { id: 'fly', name: 'Flight', icon: 'ability_mount_flyingcarpet', description: 'Grant the ability to fly through the air' },
  { id: 'speed', name: 'Speed Enhancement', icon: 'ability_rogue_sprint', description: 'Increase movement speed significantly' },
  { id: 'phasing', name: 'Phasing', icon: 'spell_arcane_portalironforge', description: 'Move through solid objects temporarily' },
  { id: 'levitation', name: 'Levitation', icon: 'spell_nature_levitate', description: 'Float above the ground' },
  { id: 'burrow', name: 'Burrowing', icon: 'inv_misc_head_dwarf_01', description: 'Move through earth and stone' },
  { id: 'water_walking', name: 'Water Walking', icon: 'spell_frost_summonwaterelemental', description: 'Walk on liquid surfaces' },
  { id: 'pull', name: 'Pull/Push', icon: 'ability_warrior_charge', description: 'Move targets toward or away from a point' },
];

// Vision/Detection sub-types
const VISION_SUBTYPES = [
  { id: 'darkvision', name: 'Darkvision', icon: 'ability_racial_darkvision', description: 'See in darkness as if it were dim light' },
  { id: 'truesight', name: 'Truesight', icon: 'spell_holy_mindvision', description: 'See through illusions, invisibility, and into the Ethereal Plane' },
  { id: 'see_invisible', name: 'See Invisibility', icon: 'spell_arcane_clairvoyance', description: 'Perceive invisible creatures and objects' },
  { id: 'detect_magic', name: 'Detect Magic', icon: 'spell_holy_magicalsentry', description: 'Sense the presence and nature of magical auras' },
  { id: 'detect_evil', name: 'Detect Evil/Good', icon: 'spell_holy_blessingofstrength', description: 'Sense the presence of specific alignments or creature types' },
  { id: 'detect_thoughts', name: 'Detect Thoughts', icon: 'spell_shadow_mindrot', description: 'Sense and read surface thoughts of nearby creatures' },
  { id: 'detect_traps', name: 'Detect Traps/Hazards', icon: 'ability_rogue_findweakness', description: 'Identify the presence and location of traps or natural hazards' },
  { id: 'aura_sight', name: 'Aura Sight', icon: 'spell_holy_powerwordshield', description: 'See magical auras and energy signatures' },
];

// Illusion sub-types
const ILLUSION_SUBTYPES = [
  { id: 'invisibility', name: 'Invisibility', icon: 'ability_vanish', description: 'Render targets unseen to normal vision' },
  { id: 'disguise', name: 'Disguise/Alter Appearance', icon: 'ability_rogue_disguise', description: 'Change appearance to look like another creature' },
  { id: 'mirror_image', name: 'Mirror Image/Duplicates', icon: 'spell_magic_lesserinvisibility', description: 'Create illusory duplicates of yourself' },
  { id: 'phantasm', name: 'Phantasmal Construct', icon: 'spell_shadow_blackplague', description: 'Create an illusion that appears real until interacted with' },
  { id: 'silent_image', name: 'Silent Image', icon: 'spell_shadow_teleport', description: 'Create a purely visual illusion' },
  { id: 'major_image', name: 'Major Image', icon: 'ability_hunter_displacement', description: 'Create an illusion with visual, auditory, and other sensory components' },
  { id: 'illusory_terrain', name: 'Illusory Terrain', icon: 'spell_nature_stoneclawtotem', description: 'Disguise an area to look like a different type of terrain' },
  { id: 'mirage', name: 'Mirage', icon: 'spell_nature_sleep', description: 'Create a realistic but complex illusion that can fool multiple senses' },
];

// Conjuration sub-types
const CONJURATION_SUBTYPES = [
  { id: 'create_object', name: 'Create Object', icon: 'inv_misc_enggizmos_19', description: 'Manifest a non-magical item from nothing' },
  { id: 'create_food', name: 'Create Food/Water', icon: 'inv_misc_food_15', description: 'Manifest nourishment' },
  { id: 'create_shelter', name: 'Create Shelter', icon: 'ability_vehicle_siegeenginecannon', description: 'Conjure a temporary dwelling or shelter' },
  { id: 'create_weapon', name: 'Create Weapon/Armor', icon: 'inv_sword_76', description: 'Manifest magical armaments' },
  { id: 'create_trap', name: 'Create Trap', icon: 'ability_hunter_traplauncher', description: 'Conjure a magical trap or hazard' },
  { id: 'create_light', name: 'Create Light', icon: 'spell_holy_flashheal', description: 'Manifest illumination in an area' },
  { id: 'create_barrier', name: 'Create Barrier', icon: 'spell_nature_stoneclawtotem', description: 'Manifest a wall or physical barrier' },
  { id: 'create_portal', name: 'Create Portal', icon: 'spell_arcane_portalshattrath', description: 'Open a gateway between locations' },
];

// Transformation sub-types
const TRANSFORMATION_SUBTYPES = [
  { id: 'polymorph', name: 'Polymorph', icon: 'spell_nature_polymorph', description: 'Transform a creature into another form, usually an animal' },
  { id: 'enlarge', name: 'Enlarge/Reduce', icon: 'spell_nature_strength', description: 'Change the size of a creature or object' },
  { id: 'gaseous', name: 'Gaseous Form', icon: 'spell_nature_cyclone', description: 'Transform into a cloud of mist' },
  { id: 'stone', name: 'Stone/Metal Transformation', icon: 'inv_stone_15', description: 'Change material composition' },
  { id: 'elemental', name: 'Elemental Transformation', icon: 'spell_fire_elemental_totem', description: 'Take on properties of elemental beings' },
  { id: 'plant', name: 'Plant Transformation', icon: 'ability_druid_flourish', description: 'Take on properties of plant life' },
  { id: 'spectral', name: 'Spectral Form', icon: 'spell_holy_divineillumination', description: 'Become partially incorporeal' },
  { id: 'shapeshift', name: 'Shapeshift', icon: 'ability_druid_catform', description: 'Transform into specific alternate forms' },
];

// Environment sub-types
const ENVIRONMENT_SUBTYPES = [
  { id: 'weather', name: 'Weather Control', icon: 'spell_frost_icestorm', description: 'Manipulate or create weather phenomena' },
  { id: 'terrain', name: 'Terrain Manipulation', icon: 'spell_nature_earthquake', description: 'Reshape the land or environment' },
  { id: 'plants', name: 'Plant Growth/Control', icon: 'spell_nature_naturetouchgrow', description: 'Accelerate or control plant life' },
  { id: 'water', name: 'Water Manipulation', icon: 'spell_frost_summonwaterelemental', description: 'Control existing water or create it' },
  { id: 'earth', name: 'Earth Manipulation', icon: 'spell_nature_earthquake', description: 'Shape stone and earth' },
  { id: 'fire', name: 'Fire Control', icon: 'spell_fire_flameshock', description: 'Control existing flames or fire sources' },
  { id: 'air', name: 'Air/Wind Control', icon: 'spell_nature_cyclone', description: 'Manipulate air currents and wind' },
  { id: 'temperature', name: 'Temperature Control', icon: 'spell_fire_selfdestruct', description: 'Raise or lower the ambient temperature' },
];

// Protection sub-types
const PROTECTION_SUBTYPES = [
  { id: 'shield', name: 'Magical Shield', icon: 'spell_holy_powerwordshield', description: 'Create a barrier that absorbs damage' },
  { id: 'ward', name: 'Ward', icon: 'spell_holy_flashheal', description: 'Protective enchantment against specific threats' },
  { id: 'circle', name: 'Magic Circle', icon: 'spell_holy_sealofsacrifice', description: 'Create a protective area that blocks specific entities' },
  { id: 'antimagic', name: 'Antimagic Field', icon: 'spell_nature_wispsplode', description: 'Create a zone where magic is suppressed' },
  { id: 'resistance', name: 'Elemental Resistance', icon: 'spell_fire_sealoffire', description: 'Grant protection against specific damage types' },
  { id: 'sanctuary', name: 'Sanctuary', icon: 'spell_holy_blessingofprotection', description: 'Create an area where violence is prevented' },
  { id: 'alarm', name: 'Alarm/Alert', icon: 'ability_warrior_warcry', description: 'Set a magical alarm to detect intruders' },
  { id: 'abjuration', name: 'Abjuration Barrier', icon: 'ability_mage_moltenarmor', description: 'Powerful multi-purpose protective barrier' },
];

// Communication sub-types
const COMMUNICATION_SUBTYPES = [
  { id: 'telepathy', name: 'Telepathy', icon: 'spell_arcane_mindmastery', description: "Communicate thoughts directly to others' minds" },
  { id: 'comprehend', name: 'Comprehend Languages', icon: 'spell_holy_innerfire', description: 'Understand all spoken and written languages' },
  { id: 'animal_speech', name: 'Speak with Animals', icon: 'ability_hunter_beastcall', description: 'Communicate with beasts and animals' },
  { id: 'plant_speech', name: 'Speak with Plants', icon: 'ability_druid_flourish', description: 'Communicate with plant life' },
  { id: 'dead_speech', name: 'Speak with Dead', icon: 'spell_shadow_raisedead', description: 'Question the spirits of the deceased' },
  { id: 'sending', name: 'Message Sending', icon: 'spell_holy_silence', description: 'Send messages across vast distances' },
  { id: 'tongues', name: 'Tongues', icon: 'spell_holy_silence', description: 'Speak and be understood in any language' },
  { id: 'commune', name: 'Commune', icon: 'spell_holy_prayerofspirit', description: 'Ask questions of extraplanar entities or deities' },
];

// Summoning sub-types
const SUMMONING_SUBTYPES = [
  { id: 'familiar', name: 'Familiar', icon: 'spell_shadow_blackfetid', description: 'Summon a small magical companion' },
  { id: 'elemental', name: 'Elemental', icon: 'spell_fire_elemental_totem', description: 'Call forth an elemental being' },
  { id: 'animal', name: 'Animal Companion', icon: 'ability_hunter_pet_wolf', description: 'Summon a loyal animal ally' },
  { id: 'undead', name: 'Undead Servant', icon: 'spell_shadow_animatedead', description: 'Raise or summon undead creatures' },
  { id: 'celestial', name: 'Celestial Being', icon: 'ability_priest_angelicfeather', description: 'Summon a being from the upper planes' },
  { id: 'fiend', name: 'Fiendish Entity', icon: 'spell_shadow_summoninfernal', description: 'Summon a being from the lower planes' },
  { id: 'fey', name: 'Fey Creature', icon: 'spell_nature_wispheal', description: 'Call a creature from the Feywild' },
  { id: 'construct', name: 'Magical Construct', icon: 'inv_misc_enggizmos_19', description: 'Create and animate a magical construct' },
];

// Enchantment sub-types
const ENCHANTMENT_SUBTYPES = [
  { id: 'charm', name: 'Charm/Friendship', icon: 'spell_shadow_charm', description: 'Magically induce friendly feelings' },
  { id: 'compulsion', name: 'Compulsion', icon: 'spell_shadow_mindrot', description: 'Force a target to follow commands' },
  { id: 'fear', name: 'Fear', icon: 'spell_shadow_possession', description: 'Induce magical terror' },
  { id: 'confusion', name: 'Confusion', icon: 'spell_shadow_mindtwisting', description: 'Scramble a target\'s thoughts and actions' },
  { id: 'sleep', name: 'Sleep', icon: 'spell_nature_sleep', description: 'Force targets into magical slumber' },
  { id: 'heroism', name: 'Heroism/Courage', icon: 'ability_warrior_battleshout', description: 'Bolster confidence and bravery' },
  { id: 'object_animation', name: 'Object Animation', icon: 'inv_sword_64', description: 'Bring inanimate objects to life' },
  { id: 'suggestion', name: 'Suggestion', icon: 'spell_holy_mindsooth', description: 'Plant a compelling idea in a target\'s mind' },
];

// Divination sub-types
const DIVINATION_SUBTYPES = [
  { id: 'scrying', name: 'Scrying', icon: 'spell_arcane_clairvoyance', description: 'View distant locations or persons' },
  { id: 'identify', name: 'Identify Magic', icon: 'spell_holy_magicalsentry', description: 'Determine the properties of magical items' },
  { id: 'find_object', name: 'Locate Object', icon: 'inv_misc_gem_pearl_06', description: 'Sense the direction of a known item' },
  { id: 'find_creature', name: 'Locate Creature', icon: 'ability_tracking', description: 'Sense the direction of a specific being' },
  { id: 'foresight', name: 'Foresight/Augury', icon: 'spell_holy_serendipity', description: 'Glimpse possible futures' },
  { id: 'legend_lore', name: 'Legend Lore', icon: 'inv_misc_book_09', description: 'Gain knowledge of legendary people, places, or things' },
  { id: 'true_seeing', name: 'True Seeing', icon: 'spell_holy_mindvision', description: 'See things as they truly are' },
  { id: 'find_path', name: 'Find Path', icon: 'ability_hunter_pathfinding', description: 'Discover the shortest path to a location' },
];

// Map utility types to their subtypes
const SUBTYPE_MAP = {
  movement: MOVEMENT_SUBTYPES,
  vision: VISION_SUBTYPES,
  illusion: ILLUSION_SUBTYPES,
  conjuration: CONJURATION_SUBTYPES,
  transformation: TRANSFORMATION_SUBTYPES,
  environmental: ENVIRONMENT_SUBTYPES,
  protection: PROTECTION_SUBTYPES,
  communication: COMMUNICATION_SUBTYPES,
  summoning: SUMMONING_SUBTYPES,
  enchantment: ENCHANTMENT_SUBTYPES,
  divination: DIVINATION_SUBTYPES,
  teleportation: MOVEMENT_SUBTYPES.filter(subtype => ['teleport', 'phasing'].includes(subtype.id)),
};

// Duration options
const DURATION_OPTIONS = [
  { id: 'instant', name: 'Instantaneous', description: 'Effect happens once with no ongoing duration' },
  { id: 'rounds', name: 'Combat Rounds', description: 'Lasts for a specific number of combat rounds (typically 6 seconds each)' },
  { id: 'minutes', name: 'Minutes', description: 'Lasts for a specific number of minutes' },
  { id: 'hours', name: 'Hours', description: 'Lasts for a specific number of hours' },
  { id: 'days', name: 'Days', description: 'Lasts for a specific number of days' },
  { id: 'permanent', name: 'Permanent', description: 'Effect is permanent until dispelled' },
  { id: 'concentration', name: 'Concentration', description: 'Lasts as long as you maintain concentration (up to a maximum time)' },
];

// Scaling options
const SCALING_OPTIONS = [
  { id: 'none', name: 'No Scaling', description: 'Effect remains the same at all levels' },
  { id: 'range', name: 'Range Scaling', description: 'Distance/area of effect increases at higher levels' },
  { id: 'duration', name: 'Duration Scaling', description: 'Effect lasts longer at higher levels' },
  { id: 'targets', name: 'Additional Targets', description: 'Can affect more targets at higher levels' },
  { id: 'potency', name: 'Potency Scaling', description: 'Effect becomes more powerful at higher levels' },
  { id: 'versatility', name: 'Versatility Scaling', description: 'Gain additional options or effects at higher levels' },
];

// Component options
const COMPONENT_OPTIONS = [
  { id: 'verbal', name: 'Verbal', description: 'Requires spoken incantations' },
  { id: 'somatic', name: 'Somatic', description: 'Requires specific hand gestures' },
  { id: 'material', name: 'Material', description: 'Requires physical components or a focus' },
];

// Limitations options
const LIMITATION_OPTIONS = [
  { id: 'concentration', name: 'Concentration Required', description: 'You must maintain concentration to sustain the effect' },
  { id: 'line_of_sight', name: 'Line of Sight Required', description: 'You must be able to see the target' },
  { id: 'no_hostile', name: 'No Hostile Actions', description: 'Effect ends if you perform hostile actions' },
  { id: 'limited_uses', name: 'Limited Uses', description: 'Can only be used a certain number of times before resting' },
  { id: 'costly_components', name: 'Costly Components', description: 'Requires expensive material components' },
  { id: 'specific_conditions', name: 'Specific Conditions', description: 'Only works under certain conditions (time, place, etc.)' },
  { id: 'saving_throw', name: 'Allows Saving Throw', description: 'Target gets a chance to resist or reduce the effect' },
];

// Environmental interaction options
const ENVIRONMENT_INTERACTION_OPTIONS = [
  { id: 'enhanced_water', name: 'Enhanced Near Water', description: 'Spell is more powerful when used near bodies of water' },
  { id: 'enhanced_darkness', name: 'Enhanced in Darkness', description: 'Spell is more effective in areas of darkness' },
  { id: 'enhanced_natural', name: 'Enhanced in Natural Settings', description: 'More powerful in natural environments vs. urban settings' },
  { id: 'enhanced_underground', name: 'Enhanced Underground', description: 'More effective when underground' },
  { id: 'hindered_water', name: 'Hindered by Water', description: 'Less effective or nullified when in contact with water' },
  { id: 'hindered_sunlight', name: 'Hindered by Sunlight', description: 'Less effective in direct sunlight' },
  { id: 'hindered_iron', name: 'Hindered by Iron', description: 'Effect weakened by presence of iron' },
  { id: 'consumes_materials', name: 'Consumes Materials', description: 'Spell consumes environmental elements (plants, water, etc.)' },
];

const Step5UtilityEffects = () => {
  const { spellData, updateSpellData, setStepValidation, nextStep, prevStep } = useSpellWizardStore();
  
  // Local state for utility configuration
  const [utilityType, setUtilityType] = useState(spellData.utilityType || '');
  const [selectedSubtypes, setSelectedSubtypes] = useState(spellData.utilitySubtypes || []);
  const [utilityDescription, setUtilityDescription] = useState(spellData.utilityDescription || '');
  const [duration, setDuration] = useState(spellData.utilityDuration || 'instant');
  const [durationValue, setDurationValue] = useState(spellData.utilityDurationValue || 1);
  const [scaling, setScaling] = useState(spellData.utilityScaling || 'none');
  const [selectedComponents, setSelectedComponents] = useState(spellData.utilityComponents || ['verbal', 'somatic']);
  const [selectedLimitations, setSelectedLimitations] = useState(spellData.utilityLimitations || []);
  const [environmentInteractions, setEnvironmentInteractions] = useState(spellData.environmentInteractions || []);
  const [customMaterialComponent, setCustomMaterialComponent] = useState(spellData.customMaterialComponent || '');
  const [specialRequirements, setSpecialRequirements] = useState(spellData.specialRequirements || '');
  
  // UI state
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'advanced', 'components', 'interactions'
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Validation
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  
  // Effect to validate and update spell data
  useEffect(() => {
    let validationResult = { valid: true, message: '' };
    
    // Basic validation
    if (!utilityType) {
      validationResult = { valid: false, message: 'Please select a utility type' };
    } else if (selectedSubtypes.length === 0) {
      validationResult = { valid: false, message: 'Please select at least one subtype' };
    } else if (!utilityDescription) {
      validationResult = { valid: false, message: 'Please provide a description of the utility effect' };
    }
    
    // Components validation
    if (selectedComponents.includes('material') && !customMaterialComponent) {
      validationResult = { valid: false, message: 'Please specify material components or focus' };
    }
    
    // Update validation state
    setIsValid(validationResult.valid);
    setValidationMessage(validationResult.message);
    setStepValidation(4, validationResult.valid);
    
    // Update spell data
    updateSpellData({
      utilityType,
      utilitySubtypes: selectedSubtypes,
      utilityDescription,
      utilityDuration: duration,
      utilityDurationValue: durationValue,
      utilityScaling: scaling,
      utilityComponents: selectedComponents,
      utilityLimitations: selectedLimitations,
      environmentInteractions,
      customMaterialComponent,
      specialRequirements
    });
  }, [
    utilityType,
    selectedSubtypes,
    utilityDescription,
    duration,
    durationValue,
    scaling,
    selectedComponents,
    selectedLimitations,
    environmentInteractions,
    customMaterialComponent,
    specialRequirements,
    updateSpellData,
    setStepValidation
  ]);
  
  // Handle utility type selection
  const handleUtilityTypeSelection = (type) => {
    setUtilityType(type);
    // Reset subtypes when changing the main type
    setSelectedSubtypes([]);
  };
  
  // Handle subtype selection
  const toggleSubtype = (subtypeId) => {
    setSelectedSubtypes(prev => {
      if (prev.includes(subtypeId)) {
        return prev.filter(id => id !== subtypeId);
      } else {
        return [...prev, subtypeId];
      }
    });
  };
  
  // Handle component selection
  const toggleComponent = (componentId) => {
    setSelectedComponents(prev => {
      if (prev.includes(componentId)) {
        return prev.filter(id => id !== componentId);
      } else {
        return [...prev, componentId];
      }
    });
  };
  
  // Handle limitation selection
  const toggleLimitation = (limitationId) => {
    setSelectedLimitations(prev => {
      if (prev.includes(limitationId)) {
        return prev.filter(id => id !== limitationId);
      } else {
        return [...prev, limitationId];
      }
    });
  };
  
  // Handle environmental interaction selection
  const toggleEnvironmentInteraction = (interactionId) => {
    setEnvironmentInteractions(prev => {
      if (prev.includes(interactionId)) {
        return prev.filter(id => id !== interactionId);
      } else {
        return [...prev, interactionId];
      }
    });
  };
  
  // Handle tooltip display
  const handleMouseEnter = (e, content) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipContent(content);
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top + rect.height / 2
    });
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  // Get current subtypes based on selected utility type
  const getCurrentSubtypes = () => {
    return SUBTYPE_MAP[utilityType] || [];
  };
  
  // Get the name of a subtype by ID
  const getSubtypeName = (subtypeId) => {
    const allSubtypes = [].concat(...Object.values(SUBTYPE_MAP));
    const subtype = allSubtypes.find(s => s.id === subtypeId);
    return subtype ? subtype.name : subtypeId;
  };
  
  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="wizard-step" id="utility-effects-step">
          {/* Main utility type selection */}
          <div className="section">
            <h4 className="section-title">
              <img 
                src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_gear_08.jpg" 
                alt="" 
                className="section-icon" 
              />
              Utility Effect Type
            </h4>
            <p className="section-description">
              Select the primary utility function of your spell. This defines how your spell interacts with the world in ways other than damage or healing.
            </p>
            
            <div className="spell-type-options">
              {UTILITY_TYPES.map(type => (
                <div 
                  key={type.id}
                  className={`spell-type-option ${utilityType === type.id ? 'selected' : ''}`}
                  onClick={() => handleUtilityTypeSelection(type.id)}
                  onMouseEnter={(e) => handleMouseEnter(e, type.details)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="spell-type-icon">
                    <img 
                      src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} 
                      alt={type.name}
                      onError={(e) => {
                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                      }}
                    />
                  </div>
                  <div className="spell-type-info">
                    <div className="spell-type-name" style={{ color: type.color }}>
                      {type.name}
                    </div>
                    <div className="spell-type-description">{type.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tabs for configuration sections */}
          {utilityType && (
            <div className="section">
              <div className="configuration-tabs">
                <button 
                  className={`configuration-tab ${activeTab === 'basic' ? 'active' : ''}`}
                  onClick={() => setActiveTab('basic')}
                >
                  Basic Configuration
                </button>
                <button 
                  className={`configuration-tab ${activeTab === 'advanced' ? 'active' : ''}`}
                  onClick={() => setActiveTab('advanced')}
                >
                  Advanced Options
                </button>
                <button 
                  className={`configuration-tab ${activeTab === 'components' ? 'active' : ''}`}
                  onClick={() => setActiveTab('components')}
                >
                  Components & Requirements
                </button>
                <button 
                  className={`configuration-tab ${activeTab === 'interactions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('interactions')}
                >
                  Environmental Interactions
                </button>
              </div>
              
              {/* Basic Configuration Tab */}
              {activeTab === 'basic' && (
                <div className="configuration-content">
                  <h5 className="subsection-title">Specific Effect Type</h5>
                  <p className="section-description">
                    Select the specific effect(s) your {UTILITY_TYPES.find(t => t.id === utilityType)?.name.toLowerCase()} spell provides:
                  </p>
                  
                  <div className="effect-type-grid">
                    {getCurrentSubtypes().map(subtype => (
                      <div 
                        key={subtype.id}
                        className={`effect-type-item ${selectedSubtypes.includes(subtype.id) ? 'selected' : ''}`}
                        onClick={() => toggleSubtype(subtype.id)}
                        style={{ 
                          '--effect-color': UTILITY_TYPES.find(t => t.id === utilityType)?.color || 'var(--primary-color)',
                          '--effect-color-rgb': '61, 184, 255'
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, subtype.description)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="effect-type-icon">
                          <img 
                            src={`https://wow.zamimg.com/images/wow/icons/medium/${subtype.icon}.jpg`}
                            alt={subtype.name}
                            onError={(e) => {
                              e.target.src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                            }}
                          />
                        </div>
                        <div className="effect-type-name">
                          {subtype.name}
                        </div>
                        
                        {selectedSubtypes.includes(subtype.id) && (
                          <div className="selection-indicator"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <h5 className="subsection-title" style={{ marginTop: '24px' }}>Effect Description</h5>
                  <p className="section-description">
                    Describe how your utility spell works in detail:
                  </p>
                  
                  <textarea
                    className="spell-description-input"
                    value={utilityDescription}
                    onChange={(e) => setUtilityDescription(e.target.value)}
                    placeholder="Describe your utility spell's effect here..."
                    rows={5}
                  />
                  
                  <h5 className="subsection-title" style={{ marginTop: '24px' }}>Duration</h5>
                  <p className="section-description">
                    How long does the effect last?
                  </p>
                  
                  <div className="cast-options-grid">
                    {DURATION_OPTIONS.map(option => (
                      <div 
                        key={option.id}
                        className={`cast-option ${duration === option.id ? 'selected' : ''}`}
                        onClick={() => setDuration(option.id)}
                      >
                        <div className="cast-option-info">
                          <div className="cast-option-name">
                            {option.name}
                          </div>
                          <div className="cast-option-description">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Duration value input - shown for duration types that need a value */}
                  {['rounds', 'minutes', 'hours', 'days', 'concentration'].includes(duration) && (
                    <div className="duration-value-input" style={{ marginTop: '16px' }}>
                      <label>Duration Value:</label>
                      <div className="number-input-wrapper">
                        <button 
                          className="decrease-btn"
                          onClick={() => setDurationValue(Math.max(1, durationValue - 1))}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={durationValue}
                          onChange={(e) => setDurationValue(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button 
                          className="increase-btn"
                          onClick={() => setDurationValue(durationValue + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="duration-unit">{duration}</span>
                      
                      <p className="input-description">
                        How long the effect will last.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Advanced Options Tab */}
              {activeTab === 'advanced' && (
                <div className="configuration-content">
                  <h5 className="subsection-title">Scaling</h5>
                  <p className="section-description">
                    How does this spell improve when cast at higher levels?
                  </p>
                  
                  <div className="cast-options-grid">
                    {SCALING_OPTIONS.map(option => (
                      <div 
                        key={option.id}
                        className={`cast-option ${scaling === option.id ? 'selected' : ''}`}
                        onClick={() => setScaling(option.id)}
                      >
                        <div className="cast-option-info">
                          <div className="cast-option-name">
                            {option.name}
                          </div>
                          <div className="cast-option-description">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h5 className="subsection-title" style={{ marginTop: '24px' }}>Limitations & Restrictions</h5>
                  <p className="section-description">
                    Select any limitations that apply to this utility spell:
                  </p>
                  
                  <div className="effect-type-grid">
                    {LIMITATION_OPTIONS.map(limitation => (
                      <div 
                        key={limitation.id}
                        className={`effect-type-item ${selectedLimitations.includes(limitation.id) ? 'selected' : ''}`}
                        onClick={() => toggleLimitation(limitation.id)}
                        style={{ 
                          '--effect-color': 'var(--damage-fire)',
                          '--effect-color-rgb': '255, 68, 0'
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, limitation.description)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="effect-type-name">
                          {limitation.name}
                        </div>
                        
                        {selectedLimitations.includes(limitation.id) && (
                          <div className="selection-indicator"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <h5 className="subsection-title" style={{ marginTop: '24px' }}>Special Requirements</h5>
                  <p className="section-description">
                    Describe any special requirements or limitations not listed above:
                  </p>
                  
                  <textarea
                    className="spell-description-input"
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="E.g., 'Only works at night', 'Requires a clear line of sight to the stars', etc."
                    rows={3}
                  />
                </div>
              )}
              
              {/* Components Tab */}
              {activeTab === 'components' && (
                <div className="configuration-content">
                  <h5 className="subsection-title">Spell Components</h5>
                  <p className="section-description">
                    Select which components are required to cast this spell:
                  </p>
                  
                  <div className="components-selection">
                    {COMPONENT_OPTIONS.map(component => (
                      <label key={component.id} className="component-checkbox custom-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedComponents.includes(component.id)}
                          onChange={() => toggleComponent(component.id)}
                        />
                        <span className="checkmark"></span>
                        <span className="checkbox-label">
                          {component.name}
                          <span className="component-description"> - {component.description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  
                  {/* Material component input (conditionally rendered) */}
                  {selectedComponents.includes('material') && (
                    <div className="material-component-input" style={{ marginTop: '16px' }}>
                      <h6 className="subsection-title">Material Components</h6>
                      <p className="section-description">
                        Specify the materials required to cast this spell:
                      </p>
                      
                      <textarea
                        className="spell-description-input"
                        value={customMaterialComponent}
                        onChange={(e) => setCustomMaterialComponent(e.target.value)}
                        placeholder="E.g., 'A pinch of sand, a drop of water, and a silver mirror worth at least 10 gold pieces'"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Environmental Interactions Tab */}
              {activeTab === 'interactions' && (
                <div className="configuration-content">
                  <h5 className="subsection-title">Environmental Interactions</h5>
                  <p className="section-description">
                    Select how this spell interacts with different environmental conditions:
                  </p>
                  
                  <div className="effect-type-grid">
                    {ENVIRONMENT_INTERACTION_OPTIONS.map(interaction => (
                      <div 
                        key={interaction.id}
                        className={`effect-type-item ${environmentInteractions.includes(interaction.id) ? 'selected' : ''}`}
                        onClick={() => toggleEnvironmentInteraction(interaction.id)}
                        style={{ 
                          '--effect-color': 'var(--damage-nature)',
                          '--effect-color-rgb': '68, 255, 68'
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, interaction.description)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="effect-type-name">
                          {interaction.name}
                        </div>
                        
                        {environmentInteractions.includes(interaction.id) && (
                          <div className="selection-indicator"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Selected Utility Effects Summary */}
          {selectedSubtypes.length > 0 && (
            <div className="section">
              <h4 className="section-title">Utility Effects Summary</h4>
              <div className="selected-effects">
                <h5>Selected Effects:</h5>
                <div className="selected-list">
                  {selectedSubtypes.map(subtypeId => {
                    const subtypeName = getSubtypeName(subtypeId);
                    return (
                      <div key={subtypeId} className="selected-item">
                        <span>{subtypeName}</span>
                        <button 
                          className="remove-btn"
                          onClick={() => toggleSubtype(subtypeId)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="utility-summary">
                <div className="summary-row">
                  <span className="summary-label">Primary Type:</span>
                  <span className="summary-value">
                    {UTILITY_TYPES.find(t => t.id === utilityType)?.name || 'None'}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span className="summary-label">Duration:</span>
                  <span className="summary-value">
                    {DURATION_OPTIONS.find(d => d.id === duration)?.name || 'Instantaneous'}
                    {['rounds', 'minutes', 'hours', 'days', 'concentration'].includes(duration) && 
                     ` (${durationValue} ${duration})`}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span className="summary-label">Scaling:</span>
                  <span className="summary-value">
                    {SCALING_OPTIONS.find(s => s.id === scaling)?.name || 'No Scaling'}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span className="summary-label">Components:</span>
                  <span className="summary-value">
                    {selectedComponents.map(c => 
                      COMPONENT_OPTIONS.find(comp => comp.id === c)?.name
                    ).join(', ')}
                  </span>
                </div>
                
                {selectedLimitations.length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Limitations:</span>
                    <span className="summary-value">
                      {selectedLimitations.map(l => 
                        LIMITATION_OPTIONS.find(lim => lim.id === l)?.name
                      ).join(', ')}
                    </span>
                  </div>
                )}
                
                {environmentInteractions.length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Environmental:</span>
                    <span className="summary-value">
                      {environmentInteractions.map(e => 
                        ENVIRONMENT_INTERACTION_OPTIONS.find(env => env.id === e)?.name
                      ).join(', ')}
                    </span>
                  </div>
                )}
                
                {selectedComponents.includes('material') && customMaterialComponent && (
                  <div className="summary-row">
                    <span className="summary-label">Materials:</span>
                    <span className="summary-value">
                      {customMaterialComponent}
                    </span>
                  </div>
                )}
                
                {specialRequirements && (
                  <div className="summary-row">
                    <span className="summary-label">Special Requirements:</span>
                    <span className="summary-value">
                      {specialRequirements}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Validation Message */}
          {!isValid && (
            <div className="validation-message">
              {validationMessage}
            </div>
          )}
          
          {/* Navigation Buttons */}
          <StepNavigation 
            currentStep={4} 
            isNextEnabled={isValid}
            onPrev={prevStep}
            onNext={nextStep}
          />
        </div>
      </div>
      
      {/* Side Preview Panel */}
      <div className="wizard-side-panel">
        <h4 className="preview-title"></h4>
        <SpellPreview spellData={spellData} />
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="spell-tooltip" 
          style={{
            position: 'fixed',
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`,
            transform: 'translateY(-50%)',
            zIndex: 9999
          }}
        >
          <div className="tooltip-description">{tooltipContent}</div>
        </div>
      )}
    </div>
  );
};

// Helper Functions

// Get class name from class ID
const getClassName = (classId) => {
  if (!classId) return '';
  
  const classMap = {
    'pyrofiend': 'Pyrofiend',
    'gambler': 'Gambler',
    'fateweaver': 'Fate Weaver',
    'stormbringer': 'Stormbringer',
    'berserker': 'Berserker',
    'shadowdancer': 'Shadowdancer',
    'elementalist': 'Elementalist'
  };
  
  return classMap[classId] || classId;
};

// Get spell type name from type ID
const getSpellTypeName = (typeId) => {
  if (!typeId) return '';
  
  const typeMap = {
    'active': 'Active Ability',
    'passive': 'Passive Ability',
    'aura': 'Aura',
    'ultimate': 'Ultimate Ability',
    'reaction': 'Reaction',
    'ritual': 'Ritual'
  };
  
  return typeMap[typeId] || typeId;
};

export default Step5UtilityEffects;