import React, { useState, useEffect, useRef } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { StepNavigation } from '../common';
import '../styles/spell-wizard.css';

// Constants for status effects categorized by game system
const STATUS_EFFECTS = {
  // D&D 5e Core Conditions
  DND: {
    blinded: {
      id: 'blinded',
      name: 'Blinded',
      description: 'Target can\'t see and automatically fails ability checks that require sight',
      icon: 'ability_racial_darkvision',
      color: '#8B4513',
      severity: 'major',
      type: 'debuff',
      game: 'dnd'
    },
    charmed: {
      id: 'charmed',
      name: 'Charmed',
      description: 'Target can\'t attack the charmer and the charmer has advantage on social interactions',
      icon: 'spell_shadow_charm',
      color: '#FF69B4',
      severity: 'major',
      type: 'debuff',
      game: 'dnd'
    },
    frightened: {
      id: 'frightened',
      name: 'Frightened',
      description: 'Target has disadvantage on ability checks and attack rolls while source of fear is visible',
      icon: 'spell_shadow_possession',
      color: '#800080',
      severity: 'major',
      type: 'debuff',
      game: 'dnd'
    },
    paralyzed: {
      id: 'paralyzed',
      name: 'Paralyzed',
      description: 'Target is incapacitated, can\'t move or speak, and fails Strength and Dexterity saving throws',
      icon: 'spell_nature_slowingtotem',
      color: '#4682B4',
      severity: 'extreme',
      type: 'debuff',
      game: 'dnd'
    },
    poisoned: {
      id: 'poisoned',
      name: 'Poisoned',
      description: 'Target has disadvantage on attack rolls and ability checks',
      icon: 'ability_rogue_deadlypoison',
      color: '#32CD32',
      severity: 'moderate',
      type: 'debuff',
      game: 'dnd'
    },
    stunned: {
      id: 'stunned',
      name: 'Stunned',
      description: 'Target is incapacitated, can\'t move, and fails Strength and Dexterity saving throws',
      icon: 'ability_monk_cracklingjadelightning',
      color: '#FFD700',
      severity: 'extreme',
      type: 'debuff',
      game: 'dnd'
    },
    unconscious: {
      id: 'unconscious',
      name: 'Unconscious',
      description: 'Target is incapacitated, unaware of surroundings, and drops everything',
      icon: 'spell_shadow_painspike',
      color: '#2F4F4F',
      severity: 'extreme',
      type: 'debuff',
      game: 'dnd'
    },
  },
  
  // Pathfinder 2e Specific Conditions
  PATHFINDER: {
    clumsy: {
      id: 'clumsy',
      name: 'Clumsy',
      description: 'Target takes a status penalty to Dexterity-based checks and DCs',
      icon: 'ability_rogue_trip',
      color: '#CD853F',
      severity: 'minor',
      type: 'debuff',
      game: 'pathfinder'
    },
    confused: {
      id: 'confused',
      name: 'Confused',
      description: 'Target behaves randomly each turn, potentially attacking allies',
      icon: 'spell_shadow_unholyfrenzy',
      color: '#9370DB',
      severity: 'major',
      type: 'debuff',
      game: 'pathfinder'
    },
    doomed: {
      id: 'doomed',
      name: 'Doomed',
      description: 'Target\'s dying value when reduced to 0 HP increases by the doomed value',
      icon: 'spell_shadow_soulleech_3',
      color: '#8B0000',
      severity: 'major',
      type: 'debuff',
      game: 'pathfinder'
    },
    enfeebled: {
      id: 'enfeebled',
      name: 'Enfeebled',
      description: 'Target takes a status penalty to Strength-based checks and DCs',
      icon: 'spell_shadow_curseofweakness',
      color: '#A0522D',
      severity: 'moderate',
      type: 'debuff',
      game: 'pathfinder'
    },
    slowed: {
      id: 'slowed',
      name: 'Slowed',
      description: 'Target loses actions each turn based on the slowed value',
      icon: 'spell_frost_arcticwinds',
      color: '#1E90FF',
      severity: 'moderate',
      type: 'debuff',
      game: 'pathfinder'
    },
    quickened: {
      id: 'quickened',
      name: 'Quickened',
      description: 'Target gains one additional action each turn that can only be used for specific activities',
      icon: 'spell_nature_haste',
      color: '#FFD700',
      severity: 'major',
      type: 'buff',
      game: 'pathfinder'
    },
    sickened: {
      id: 'sickened',
      name: 'Sickened',
      description: 'Target takes a penalty to all checks and DCs and cannot willingly ingest anything',
      icon: 'ability_creature_disease_01',
      color: '#ADFF2F',
      severity: 'moderate',
      type: 'debuff',
      game: 'pathfinder'
    },
  },
  
  // WoW MMO Style Effects
  WOW: {
    bleeding: {
      id: 'bleeding',
      name: 'Bleeding',
      description: 'Target takes physical damage over time that cannot be resisted',
      icon: 'ability_warrior_bloodfrenzy',
      color: '#B22222',
      severity: 'moderate',
      type: 'debuff',
      game: 'wow'
    },
    curse: {
      id: 'curse',
      name: 'Curse',
      description: 'Target suffers a magical affliction that requires special removal',
      icon: 'spell_shadow_curseofsargeras',
      color: '#800080',
      severity: 'moderate',
      type: 'debuff',
      game: 'wow'
    },
    silence: {
      id: 'silence',
      name: 'Silence',
      description: 'Target cannot cast spells for the duration',
      icon: 'spell_shadow_impphaseshift',
      color: '#483D8B',
      severity: 'major',
      type: 'debuff',
      game: 'wow'
    },
    root: {
      id: 'root',
      name: 'Root',
      description: 'Target cannot move but can still take other actions',
      icon: 'spell_nature_stranglevines',
      color: '#006400',
      severity: 'moderate',
      type: 'debuff',
      game: 'wow'
    },
    haste: {
      id: 'haste',
      name: 'Haste',
      description: 'Target\'s attack and casting speed is increased',
      icon: 'spell_nature_bloodlust',
      color: '#FFD700',
      severity: 'major',
      type: 'buff',
      game: 'wow'
    },
    fortitude: {
      id: 'fortitude',
      name: 'Fortitude',
      description: 'Target\'s maximum health is increased',
      icon: 'spell_holy_devotionaura',
      color: '#CD5C5C',
      severity: 'moderate',
      type: 'buff',
      game: 'wow'
    },
    shield: {
      id: 'shield',
      name: 'Arcane Shield',
      description: 'Target absorbs a certain amount of damage before being affected',
      icon: 'spell_holy_powerwordshield',
      color: '#4169E1',
      severity: 'major',
      type: 'buff',
      game: 'wow'
    },
  },
  
  // Common Buffs Across Games
  BUFFS: {
    regeneration: {
      id: 'regeneration',
      name: 'Regeneration',
      description: 'Target regains health over time',
      icon: 'spell_nature_rejuvenation',
      color: '#32CD32',
      severity: 'moderate',
      type: 'buff',
      game: 'common'
    },
    strength: {
      id: 'strength',
      name: 'Strength',
      description: 'Target\'s physical damage and carrying capacity are increased',
      icon: 'spell_nature_strength',
      color: '#B22222',
      severity: 'moderate',
      type: 'buff',
      game: 'common'
    },
    resistance: {
      id: 'resistance',
      name: 'Elemental Resistance',
      description: 'Target has resistance to a certain elemental damage type',
      icon: 'spell_fire_sealoffire',
      color: '#DAA520',
      severity: 'moderate',
      type: 'buff',
      game: 'common'
    },
    invisibility: {
      id: 'invisibility',
      name: 'Invisibility',
      description: 'Target cannot be seen by normal sight',
      icon: 'ability_vanish',
      color: '#87CEEB',
      severity: 'major',
      type: 'buff',
      game: 'common'
    },
    swiftness: {
      id: 'swiftness',
      name: 'Swiftness',
      description: 'Target\'s movement speed is increased',
      icon: 'ability_rogue_sprint',
      color: '#1E90FF',
      severity: 'moderate',
      type: 'buff',
      game: 'common'
    },
  },
  
  // Movement and Control Effects
  MOVEMENT: {
    prone: {
      id: 'prone',
      name: 'Prone',
      description: 'Target is lying on the ground and has disadvantages in combat',
      icon: 'ability_monk_paralysis',
      color: '#8B4513',
      severity: 'minor',
      type: 'debuff',
      game: 'dnd'
    },
    restrained: {
      id: 'restrained',
      name: 'Restrained',
      description: 'Target\'s speed is 0, attack rolls against it have advantage, and it has disadvantage on attacks',
      icon: 'ability_druid_balanceofjustice',
      color: '#2F4F4F',
      severity: 'major',
      type: 'debuff',
      game: 'dnd'
    },
    grappled: {
      id: 'grappled',
      name: 'Grappled',
      description: 'Target\'s speed is 0 and it cannot benefit from bonuses to speed',
      icon: 'ability_warrior_bullrush',
      color: '#A52A2A',
      severity: 'moderate',
      type: 'debuff',
      game: 'dnd'
    },
    levitate: {
      id: 'levitate',
      name: 'Levitate',
      description: 'Target floats in the air and is immune to ground effects',
      icon: 'spell_nature_levitate',
      color: '#9370DB',
      severity: 'moderate',
      type: 'buff',
      game: 'common'
    },
    flying: {
      id: 'flying',
      name: 'Flying',
      description: 'Target has a flying speed and can move in three dimensions',
      icon: 'ability_druid_flightform',
      color: '#87CEEB',
      severity: 'major',
      type: 'buff',
      game: 'common'
    },
    pushed: {
      id: 'pushed',
      name: 'Pushed',
      description: 'Target is moved away from the source in a straight line',
      icon: 'ability_monk_cracklingjadelightning',
      color: '#4682B4',
      severity: 'minor',
      type: 'debuff',
      game: 'common'
    },
    pulled: {
      id: 'pulled',
      name: 'Pulled',
      description: 'Target is moved toward the source in a straight line',
      icon: 'ability_warrior_charge',
      color: '#8B4513',
      severity: 'minor',
      type: 'debuff',
      game: 'common'
    },
  },
  
  // Elemental Damage Over Time Effects
  DAMAGE_OVER_TIME: {
    burning: {
      id: 'burning',
      name: 'Burning',
      description: 'Target takes fire damage over time',
      icon: 'spell_fire_immolation',
      color: '#FF4500',
      severity: 'moderate',
      type: 'debuff',
      game: 'common'
    },
    frost: {
      id: 'frost',
      name: 'Frost',
      description: 'Target takes cold damage over time and is slowed',
      icon: 'spell_frost_chillingblast',
      color: '#00BFFF',
      severity: 'moderate',
      type: 'debuff',
      game: 'common'
    },
    shock: {
      id: 'shock',
      name: 'Shock',
      description: 'Target takes lightning damage over time and has reduced casting speed',
      icon: 'spell_nature_lightningshield',
      color: '#FFD700',
      severity: 'moderate',
      type: 'debuff',
      game: 'common'
    },
    acid: {
      id: 'acid',
      name: 'Acid',
      description: 'Target takes acid damage over time that reduces armor',
      icon: 'spell_nature_acid_01',
      color: '#32CD32',
      severity: 'moderate',
      type: 'debuff',
      game: 'common'
    },
    necrotic: {
      id: 'necrotic',
      name: 'Necrotic',
      description: 'Target takes necrotic damage over time and has reduced healing',
      icon: 'spell_deathknight_necroticplague',
      color: '#800080',
      severity: 'major',
      type: 'debuff',
      game: 'common'
    },
  }
};

// Advanced behaviors for spells
const ADVANCED_BEHAVIORS = [
  { 
    id: 'interact_environment', 
    name: 'Environmental Interaction', 
    description: 'Spell interacts with terrain or environment',
    examples: ['Fire spell spreads in dry areas', 'Ice spell creates slippery surfaces', 'Lightning is enhanced in water'] 
  },
  { 
    id: 'combo_potential', 
    name: 'Combo Potential', 
    description: 'Spell can be combined with other abilities for enhanced effects',
    examples: ['Fireball explodes when hitting a grease spell', 'Lightning does bonus damage to wet targets', 'Physical damage increased against frozen enemies'] 
  },
  { 
    id: 'conditional_effect', 
    name: 'Conditional Effects', 
    description: 'Spell has different effects based on conditions',
    examples: ['Does more damage to low-health targets', 'Changes element based on time of day', 'Different effect based on enemy type'] 
  },
  { 
    id: 'resource_interaction', 
    name: 'Resource Interaction', 
    description: 'Spell interacts uniquely with resource systems',
    examples: ['Costs less when at low health', 'Generates extra resources on critical hits', 'Converts one resource type to another'] 
  },
  { 
    id: 'stance_interaction', 
    name: 'Stance/Form Interaction', 
    description: 'Spell behaves differently based on character stance or form',
    examples: ['Different effect in Bear Form', 'Enhanced while in Defensive Stance', 'Changed properties in Stealth'] 
  },
  { 
    id: 'charge_system', 
    name: 'Charge System', 
    description: 'Spell uses a charge-based system for casting',
    examples: ['Stores up to 3 charges', 'Charge regenerates every 10 seconds', 'All charges can be used in succession'] 
  },
  { 
    id: 'transformation_effect', 
    name: 'Transformation Mechanics', 
    description: 'Spell transforms the caster or target in meaningful ways',
    examples: ['Temporarily become ethereal', 'Transform into a beast with new abilities', 'Shrink in size to access new areas'] 
  },
  { 
    id: 'dynamic_scaling', 
    name: 'Dynamic Scaling', 
    description: 'Spell scales in unusual or dynamic ways',
    examples: ['More powerful at night', 'Scales with enemies in the area', 'Weakens as your health decreases'] 
  },
  { 
    id: 'terrain_modification', 
    name: 'Terrain Modification', 
    description: 'Spell permanently or temporarily changes the environment',
    examples: ['Create walls of ice', 'Burn away obstacles', 'Create traversable platforms'] 
  }
];

// Helper functions for status effects
const getAllStatusEffects = () => {
  let allEffects = {};
  Object.values(STATUS_EFFECTS).forEach(category => {
    allEffects = { ...allEffects, ...category };
  });
  return allEffects;
};

const getStatusEffectsByType = (type) => {
  const allEffects = getAllStatusEffects();
  return Object.values(allEffects).filter(effect => effect.type === type);
};

const getStatusEffectsByCategory = (category) => {
  return Object.values(STATUS_EFFECTS[category] || {});
};

// Format trigger chance for display
const formatProcChance = (chance) => {
  if (chance >= 100) return "Always triggers";
  if (chance <= 0) return "Never triggers";
  
  if (chance === 50) return "Triggers 50% of the time (1 in 2 chance)";
  if (chance === 25) return "Triggers 25% of the time (1 in 4 chance)";
  if (chance === 20) return "Triggers 20% of the time (1 in 5 chance)";
  if (chance === 10) return "Triggers 10% of the time (1 in 10 chance)";
  
  return `Triggers ${chance}% of the time`;
};

const Step5SecondaryEffects = () => {
  const { 
    spellData, 
    updateSpellData, 
    setStepValidation,
    nextStep,
    prevStep
  } = useSpellWizardStore();
  
  // Local state for effect selections
  const [selectedBuffs, setSelectedBuffs] = useState(spellData.buffs || []);
  const [selectedDebuffs, setSelectedDebuffs] = useState(spellData.debuffs || []);
  const [selectedMovementEffects, setSelectedMovementEffects] = useState(spellData.movementEffects || []);
  const [selectedDamageOverTime, setSelectedDamageOverTime] = useState(spellData.damageOverTime || []);
  const [onHitTriggers, setOnHitTriggers] = useState(spellData.onHitTriggers || []);
  const [onDamageTriggers, setOnDamageTriggers] = useState(spellData.onDamageTriggers || []);
  const [auraEffects, setAuraEffects] = useState(spellData.auraEffects || []);
  const [selectedAdvancedBehaviors, setSelectedAdvancedBehaviors] = useState(spellData.advancedBehaviors || []);
  
  // UI State
  const [activeEffectTab, setActiveEffectTab] = useState('buffs');
  const [activeCategory, setActiveCategory] = useState('BUFFS');
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showAuraModal, setShowAuraModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({ title: '', description: '', examples: [] });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [currentEditingTrigger, setCurrentEditingTrigger] = useState(null);
  const [currentEditingAura, setCurrentEditingAura] = useState(null);
  const [triggerType, setTriggerType] = useState('onHit');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Refs
  const tooltipRef = useRef(null);
  
  // Form state for trigger/aura editor
  const [triggerEffect, setTriggerEffect] = useState('');
  const [triggerChance, setTriggerChance] = useState(100);
  const [triggerDuration, setTriggerDuration] = useState(1);
  const [auraName, setAuraName] = useState('');
  const [auraEffect, setAuraEffect] = useState('');
  const [auraRange, setAuraRange] = useState(10);
  const [auraTarget, setAuraTarget] = useState('enemies'); // 'enemies', 'allies', 'all'
  
  // Get all status effects
  const allEffects = getAllStatusEffects();
  const buffEffects = getStatusEffectsByType('buff');
  const debuffEffects = getStatusEffectsByType('debuff');
  
  // Validation always valid for this step (optional step)
  const [isValid, setIsValid] = useState(true);
  useEffect(() => {
    setStepValidation(4, true);
    setIsValid(true); // This step is always valid since effects are optional
  }, [setStepValidation]);
  
  // Update spell data with current selections
  useEffect(() => {
    updateSpellData({
      buffs: selectedBuffs,
      debuffs: selectedDebuffs,
      movementEffects: selectedMovementEffects,
      damageOverTime: selectedDamageOverTime,
      onHitTriggers: onHitTriggers,
      onDamageTriggers: onDamageTriggers,
      auraEffects: auraEffects,
      advancedBehaviors: selectedAdvancedBehaviors
    });
  }, [
    selectedBuffs, 
    selectedDebuffs,
    selectedMovementEffects,
    selectedDamageOverTime,
    onHitTriggers, 
    onDamageTriggers, 
    auraEffects,
    selectedAdvancedBehaviors,
    updateSpellData
  ]);
  
  // Handle tooltip display
  const handleMouseEnter = (e, title, description, examples = []) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipContent({ title, description, examples });
    setTooltipPosition({
      x: rect.right + 15,
      y: rect.top + (rect.height / 2)
    });
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  // Reset trigger modal when opened
  useEffect(() => {
    if (showTriggerModal && !currentEditingTrigger) {
      setTriggerEffect('');
      setTriggerChance(100);
      setTriggerDuration(1);
    }
  }, [showTriggerModal, currentEditingTrigger]);
  
  // Reset aura modal when opened
  useEffect(() => {
    if (showAuraModal && !currentEditingAura) {
      setAuraName('');
      setAuraEffect('');
      setAuraRange(10);
      setAuraTarget('enemies');
    }
  }, [showAuraModal, currentEditingAura]);
  
  // Load current editing trigger data
  useEffect(() => {
    if (currentEditingTrigger) {
      setTriggerEffect(currentEditingTrigger.effect);
      setTriggerChance(currentEditingTrigger.chance);
      setTriggerDuration(currentEditingTrigger.duration);
    }
  }, [currentEditingTrigger]);
  
  // Load current editing aura data
  useEffect(() => {
    if (currentEditingAura) {
      setAuraName(currentEditingAura.name);
      setAuraEffect(currentEditingAura.effect);
      setAuraRange(currentEditingAura.range);
      setAuraTarget(currentEditingAura.target);
    }
  }, [currentEditingAura]);
  
  // Toggle buff selection
  const toggleBuff = (buffId) => {
    setSelectedBuffs(prev => {
      if (prev.includes(buffId)) {
        return prev.filter(id => id !== buffId);
      } else {
        return [...prev, buffId];
      }
    });
  };
  
  // Toggle debuff selection
  const toggleDebuff = (debuffId) => {
    setSelectedDebuffs(prev => {
      if (prev.includes(debuffId)) {
        return prev.filter(id => id !== debuffId);
      } else {
        return [...prev, debuffId];
      }
    });
  };
  
  // Toggle movement effect selection
  const toggleMovementEffect = (effectId) => {
    setSelectedMovementEffects(prev => {
      if (prev.includes(effectId)) {
        return prev.filter(id => id !== effectId);
      } else {
        return [...prev, effectId];
      }
    });
  };
  
  // Toggle damage over time effect selection
  const toggleDamageOverTime = (effectId) => {
    setSelectedDamageOverTime(prev => {
      if (prev.includes(effectId)) {
        return prev.filter(id => id !== effectId);
      } else {
        return [...prev, effectId];
      }
    });
  };
  
  // Toggle advanced behavior
  const toggleAdvancedBehavior = (behaviorId) => {
    setSelectedAdvancedBehaviors(prev => {
      if (prev.includes(behaviorId)) {
        return prev.filter(id => id !== behaviorId);
      } else {
        return [...prev, behaviorId];
      }
    });
  };
  
  // Open trigger modal to add new trigger
  const openAddTriggerModal = (type) => {
    setTriggerType(type);
    setCurrentEditingTrigger(null);
    setShowTriggerModal(true);
  };
  
  // Open trigger modal to edit existing trigger
  const openEditTriggerModal = (trigger, type) => {
    setTriggerType(type);
    setCurrentEditingTrigger(trigger);
    setShowTriggerModal(true);
  };
  
  // Save trigger
  const saveTrigger = () => {
    if (!triggerEffect) return;
    
    const newTrigger = {
      id: currentEditingTrigger?.id || Date.now().toString(),
      effect: triggerEffect,
      chance: triggerChance,
      duration: triggerDuration
    };
    
    if (triggerType === 'onHit') {
      if (currentEditingTrigger) {
        // Update existing trigger
        setOnHitTriggers(prev => 
          prev.map(trigger => trigger.id === newTrigger.id ? newTrigger : trigger)
        );
      } else {
        // Add new trigger
        setOnHitTriggers(prev => [...prev, newTrigger]);
      }
    } else if (triggerType === 'onDamage') {
      if (currentEditingTrigger) {
        // Update existing trigger
        setOnDamageTriggers(prev => 
          prev.map(trigger => trigger.id === newTrigger.id ? newTrigger : trigger)
        );
      } else {
        // Add new trigger
        setOnDamageTriggers(prev => [...prev, newTrigger]);
      }
    }
    
    // Close modal
    setShowTriggerModal(false);
  };
  
  // Delete trigger
  const deleteTrigger = (triggerId, type) => {
    if (type === 'onHit') {
      setOnHitTriggers(prev => prev.filter(trigger => trigger.id !== triggerId));
    } else if (type === 'onDamage') {
      setOnDamageTriggers(prev => prev.filter(trigger => trigger.id !== triggerId));
    }
  };
  
  // Open aura modal to add new aura
  const openAddAuraModal = () => {
    setCurrentEditingAura(null);
    setShowAuraModal(true);
  };
  
  // Open aura modal to edit existing aura
  const openEditAuraModal = (aura) => {
    setCurrentEditingAura(aura);
    setShowAuraModal(true);
  };
  
  // Save aura
  const saveAura = () => {
    if (!auraName || !auraEffect) return;
    
    const newAura = {
      id: currentEditingAura?.id || Date.now().toString(),
      name: auraName,
      effect: auraEffect,
      range: auraRange,
      target: auraTarget
    };
    
    if (currentEditingAura) {
      // Update existing aura
      setAuraEffects(prev => 
        prev.map(aura => aura.id === newAura.id ? newAura : aura)
      );
    } else {
      // Add new aura
      setAuraEffects(prev => [...prev, newAura]);
    }
    
    // Close modal
    setShowAuraModal(false);
  };
  
  // Delete aura
  const deleteAura = (auraId) => {
    setAuraEffects(prev => prev.filter(aura => aura.id !== auraId));
  };
  
  // Handle trigger chance input
  const handleTriggerChanceChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setTriggerChance(value);
    }
  };
  
  // Handle trigger duration input
  const handleTriggerDurationChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTriggerDuration(value);
    }
  };
  
  // Handle aura range input
  const handleAuraRangeChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAuraRange(value);
    }
  };
  
  // Filter effects by search term
  const filterEffectsBySearchTerm = (effects) => {
    if (!searchTerm) return effects;
    
    const term = searchTerm.toLowerCase();
    return effects.filter(effect => 
      effect.name.toLowerCase().includes(term) || 
      effect.description.toLowerCase().includes(term) ||
      (effect.game && effect.game.toLowerCase().includes(term))
    );
  };
  
  // Show suggested effects based on spell category and damage types
  const getSuggestedEffects = (effectType) => {
    const suggestions = [];
    
    // Add category-based suggestions
    if (spellData.category) {
      if (effectType === 'buff') {
        if (spellData.category === 'buff' || spellData.category === 'healing') {
          suggestions.push('regeneration', 'haste', 'shield', 'fortitude');
        }
      } else if (effectType === 'debuff') {
        if (spellData.category === 'debuff' || spellData.category === 'damage') {
          suggestions.push('slowed', 'weakness', 'vulnerable', 'sickened');
        }
      }
    }
    
    // Add damage type-based suggestions
    if (spellData.damageTypes) {
      if (effectType === 'debuff') {
        if (spellData.damageTypes.includes('fire')) {
          suggestions.push('burning');
        }
        if (spellData.damageTypes.includes('frost') || spellData.damageTypes.includes('cold')) {
          suggestions.push('frost', 'slowed');
        }
        if (spellData.damageTypes.includes('poison')) {
          suggestions.push('poisoned');
        }
        if (spellData.damageTypes.includes('shadow') || spellData.damageTypes.includes('necrotic')) {
          suggestions.push('necrotic', 'frightened');
        }
        if (spellData.damageTypes.includes('lightning') || spellData.damageTypes.includes('thunder')) {
          suggestions.push('shock', 'stunned');
        }
        if (spellData.damageTypes.includes('acid')) {
          suggestions.push('acid');
        }
      }
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
  };
  
  // Get suggested buffs and debuffs
  const suggestedBuffs = getSuggestedEffects('buff');
  const suggestedDebuffs = getSuggestedEffects('debuff');
  
  // Render categories for current active tab
  const renderCategoryTabs = () => {
    let categories = [];
    
    if (activeEffectTab === 'buffs') {
      categories = [
        { id: 'BUFFS', name: 'Common Buffs' },
        { id: 'WOW', name: 'WoW-style' },
        { id: 'PATHFINDER', name: 'Pathfinder' }
      ];
    } else if (activeEffectTab === 'debuffs') {
      categories = [
        { id: 'DND', name: 'D&D 5e' },
        { id: 'PATHFINDER', name: 'Pathfinder' },
        { id: 'WOW', name: 'WoW-style' }
      ];
    } else if (activeEffectTab === 'movement') {
      categories = [
        { id: 'MOVEMENT', name: 'Movement Effects' }
      ];
    } else if (activeEffectTab === 'dot') {
      categories = [
        { id: 'DAMAGE_OVER_TIME', name: 'Damage Over Time' }
      ];
    }
    
    return (
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="secondary-effects-step">
      <div className="section">
        <h4 className="section-title">Secondary Effects</h4>
        <p className="section-description">
          Add buffs, debuffs, movement effects, damage over time, triggers, or aura effects to your spell.
        </p>
        
        <div className="effects-tabs">
          <button 
            className={`effect-tab ${activeEffectTab === 'buffs' ? 'active' : ''}`}
            onClick={() => {
              setActiveEffectTab('buffs');
              setActiveCategory('BUFFS');
              setSearchTerm('');
            }}
          >
            Buffs
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'debuffs' ? 'active' : ''}`}
            onClick={() => {
              setActiveEffectTab('debuffs');
              setActiveCategory('DND');
              setSearchTerm('');
            }}
          >
            Debuffs
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'movement' ? 'active' : ''}`}
            onClick={() => {
              setActiveEffectTab('movement');
              setActiveCategory('MOVEMENT');
              setSearchTerm('');
            }}
          >
            Movement
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'dot' ? 'active' : ''}`}
            onClick={() => {
              setActiveEffectTab('dot');
              setActiveCategory('DAMAGE_OVER_TIME');
              setSearchTerm('');
            }}
          >
            DoT
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'triggers' ? 'active' : ''}`}
            onClick={() => {
              setActiveEffectTab('triggers');
              setSearchTerm('');
            }}
          >
            Triggers
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'auras' ? 'active' : ''}`}
            onClick={() => {
              setActiveEffectTab('auras');
              setSearchTerm('');
            }}
          >
            Auras
          </button>
          <button 
            className={`effect-tab ${activeEffectTab === 'advanced' ? 'active' : ''}`}
            onClick={() => {
              setActiveEffectTab('advanced');
              setSearchTerm('');
            }}
          >
            Advanced
          </button>
        </div>
        
        <div className="effects-content">
          {/* Search Bar (displayed for Buffs, Debuffs, Movement, DoT tabs) */}
          {['buffs', 'debuffs', 'movement', 'dot'].includes(activeEffectTab) && (
            <div className="search-container">
              <input 
                type="text"
                className="effect-search"
                placeholder={`Search ${activeEffectTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {renderCategoryTabs()}
            </div>
          )}
          
          {/* Buffs Tab */}
          {activeEffectTab === 'buffs' && (
            <div className="buffs-tab">
              {suggestedBuffs.length > 0 && (
                <div className="suggested-effects">
                  <h5>Suggested Buffs:</h5>
                  <div className="effect-tags">
                    {suggestedBuffs.map(buffId => {
                      const buff = allEffects[buffId];
                      if (!buff) return null;
                      
                      return (
                        <div 
                          key={buffId}
                          className={`effect-tag ${selectedBuffs.includes(buffId) ? 'selected' : ''}`}
                          onClick={() => toggleBuff(buffId)}
                          style={{ backgroundColor: buff.color + '40' }}
                          onMouseEnter={(e) => handleMouseEnter(e, buff.name, buff.description)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {buff.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="effects-grid">
                {filterEffectsBySearchTerm(getStatusEffectsByCategory(activeCategory)).map(buff => {
                  if (buff.type !== 'buff') return null;
                  
                  return (
                    <div 
                      key={buff.id}
                      className={`effect-option ${selectedBuffs.includes(buff.id) ? 'selected' : ''}`}
                      onClick={() => toggleBuff(buff.id)}
                      style={{ 
                        '--effect-color': buff.color,
                        borderColor: selectedBuffs.includes(buff.id) ? buff.color : 'transparent'
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, buff.name, buff.description)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="effect-icon">
                        <img 
                          src={`https://wow.zamimg.com/images/wow/icons/large/${buff.icon || 'inv_misc_questionmark'}.jpg`}
                          alt={buff.name}
                          onError={(e) => {
                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                          }}
                        />
                      </div>
                      <div className="effect-info">
                        <div className="effect-name" style={{ color: buff.color }}>{buff.name}</div>
                        <div className="effect-description">{buff.description}</div>
                        {buff.game && buff.game !== 'common' && (
                          <div className="effect-source">
                            {buff.game === 'dnd' ? 'D&D 5e' : 
                             buff.game === 'pathfinder' ? 'Pathfinder' : 
                             buff.game === 'wow' ? 'WoW-style' : buff.game}
                          </div>
                        )}
                      </div>
                      <div className="effect-severity" data-severity={buff.severity || 'moderate'}>
                        {buff.severity}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedBuffs.length === 0 && (
                <div className="empty-selection-message">
                  No buffs selected. Click on buffs above to add them to your spell.
                </div>
              )}
              
              {selectedBuffs.length > 0 && (
                <div className="selected-effects">
                  <h5>Selected Buffs:</h5>
                  <div className="selected-list">
                    {selectedBuffs.map(buffId => {
                      const buff = allEffects[buffId];
                      if (!buff) return null;
                      
                      return (
                        <div key={buffId} className="selected-item">
                          <img 
                            src={`https://wow.zamimg.com/images/wow/icons/small/${buff.icon || 'inv_misc_questionmark'}.jpg`}
                            alt={buff.name}
                            className="effect-icon-small"
                            onError={(e) => {
                              e.target.src = 'https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg';
                            }}
                          />
                          <span style={{ color: buff.color }}>{buff.name}</span>
                          <button 
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBuff(buffId);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Debuffs Tab */}
          {activeEffectTab === 'debuffs' && (
            <div className="debuffs-tab">
              {suggestedDebuffs.length > 0 && (
                <div className="suggested-effects">
                  <h5>Suggested Debuffs:</h5>
                  <div className="effect-tags">
                    {suggestedDebuffs.map(debuffId => {
                      const debuff = allEffects[debuffId];
                      if (!debuff) return null;
                      
                      return (
                        <div 
                          key={debuffId}
                          className={`effect-tag ${selectedDebuffs.includes(debuffId) ? 'selected' : ''}`}
                          onClick={() => toggleDebuff(debuffId)}
                          style={{ backgroundColor: debuff.color + '40' }}
                          onMouseEnter={(e) => handleMouseEnter(e, debuff.name, debuff.description)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {debuff.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="effects-grid">
                {filterEffectsBySearchTerm(getStatusEffectsByCategory(activeCategory)).map(debuff => {
                  if (debuff.type !== 'debuff') return null;
                  
                  return (
                    <div 
                      key={debuff.id}
                      className={`effect-option ${selectedDebuffs.includes(debuff.id) ? 'selected' : ''}`}
                      onClick={() => toggleDebuff(debuff.id)}
                      style={{ 
                        '--effect-color': debuff.color,
                        borderColor: selectedDebuffs.includes(debuff.id) ? debuff.color : 'transparent'
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, debuff.name, debuff.description)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="effect-icon">
                        <img 
                          src={`https://wow.zamimg.com/images/wow/icons/large/${debuff.icon || 'inv_misc_questionmark'}.jpg`}
                          alt={debuff.name}
                          onError={(e) => {
                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                          }}
                        />
                      </div>
                      <div className="effect-info">
                        <div className="effect-name" style={{ color: debuff.color }}>{debuff.name}</div>
                        <div className="effect-description">{debuff.description}</div>
                        {debuff.game && debuff.game !== 'common' && (
                          <div className="effect-source">
                            {debuff.game === 'dnd' ? 'D&D 5e' : 
                             debuff.game === 'pathfinder' ? 'Pathfinder' : 
                             debuff.game === 'wow' ? 'WoW-style' : debuff.game}
                          </div>
                        )}
                      </div>
                      <div className="effect-severity" data-severity={debuff.severity || 'moderate'}>
                        {debuff.severity}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedDebuffs.length === 0 && (
                <div className="empty-selection-message">
                  No debuffs selected. Click on debuffs above to add them to your spell.
                </div>
              )}
              
              {selectedDebuffs.length > 0 && (
                <div className="selected-effects">
                  <h5>Selected Debuffs:</h5>
                  <div className="selected-list">
                    {selectedDebuffs.map(debuffId => {
                      const debuff = allEffects[debuffId];
                      if (!debuff) return null;
                      
                      return (
                        <div key={debuffId} className="selected-item">
                          <img 
                            src={`https://wow.zamimg.com/images/wow/icons/small/${debuff.icon || 'inv_misc_questionmark'}.jpg`}
                            alt={debuff.name}
                            className="effect-icon-small"
                            onError={(e) => {
                              e.target.src = 'https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg';
                            }}
                          />
                          <span style={{ color: debuff.color }}>{debuff.name}</span>
                          <button 
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDebuff(debuffId);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Movement Effects Tab */}
          {activeEffectTab === 'movement' && (
            <div className="movement-tab">
              <p className="tab-description">
                Select movement effects that this spell applies to targets.
              </p>
              
              <div className="effects-grid">
                {filterEffectsBySearchTerm(getStatusEffectsByCategory('MOVEMENT')).map(effect => (
                  <div 
                    key={effect.id}
                    className={`effect-option ${selectedMovementEffects.includes(effect.id) ? 'selected' : ''}`}
                    onClick={() => toggleMovementEffect(effect.id)}
                    style={{ 
                      '--effect-color': effect.color,
                      borderColor: selectedMovementEffects.includes(effect.id) ? effect.color : 'transparent'
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, effect.name, effect.description)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="effect-icon">
                      <img 
                        src={`https://wow.zamimg.com/images/wow/icons/large/${effect.icon || 'inv_misc_questionmark'}.jpg`}
                        alt={effect.name}
                        onError={(e) => {
                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                      />
                    </div>
                    <div className="effect-info">
                      <div className="effect-name" style={{ color: effect.color }}>{effect.name}</div>
                      <div className="effect-description">{effect.description}</div>
                      {effect.game && effect.game !== 'common' && (
                        <div className="effect-source">
                          {effect.game === 'dnd' ? 'D&D 5e' : 
                           effect.game === 'pathfinder' ? 'Pathfinder' : 
                           effect.game === 'wow' ? 'WoW-style' : effect.game}
                        </div>
                      )}
                    </div>
                    <div className="effect-severity" data-severity={effect.severity || 'moderate'}>
                      {effect.severity}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedMovementEffects.length === 0 && (
                <div className="empty-selection-message">
                  No movement effects selected. Click on effects above to add them to your spell.
                </div>
              )}
              
              {selectedMovementEffects.length > 0 && (
                <div className="selected-effects">
                  <h5>Selected Movement Effects:</h5>
                  <div className="selected-list">
                    {selectedMovementEffects.map(effectId => {
                      const effect = allEffects[effectId];
                      if (!effect) return null;
                      
                      return (
                        <div key={effectId} className="selected-item">
                          <img 
                            src={`https://wow.zamimg.com/images/wow/icons/small/${effect.icon || 'inv_misc_questionmark'}.jpg`}
                            alt={effect.name}
                            className="effect-icon-small"
                            onError={(e) => {
                              e.target.src = 'https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg';
                            }}
                          />
                          <span style={{ color: effect.color }}>{effect.name}</span>
                          <button 
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMovementEffect(effectId);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Damage Over Time Tab */}
          {activeEffectTab === 'dot' && (
            <div className="dot-tab">
              <p className="tab-description">
                Select damage over time effects that this spell applies to targets.
              </p>
              
              <div className="effects-grid">
                {filterEffectsBySearchTerm(getStatusEffectsByCategory('DAMAGE_OVER_TIME')).map(effect => (
                  <div 
                    key={effect.id}
                    className={`effect-option ${selectedDamageOverTime.includes(effect.id) ? 'selected' : ''}`}
                    onClick={() => toggleDamageOverTime(effect.id)}
                    style={{ 
                      '--effect-color': effect.color,
                      borderColor: selectedDamageOverTime.includes(effect.id) ? effect.color : 'transparent'
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, effect.name, effect.description)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="effect-icon">
                      <img 
                        src={`https://wow.zamimg.com/images/wow/icons/large/${effect.icon || 'inv_misc_questionmark'}.jpg`}
                        alt={effect.name}
                        onError={(e) => {
                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                      />
                    </div>
                    <div className="effect-info">
                      <div className="effect-name" style={{ color: effect.color }}>{effect.name}</div>
                      <div className="effect-description">{effect.description}</div>
                    </div>
                    <div className="effect-severity" data-severity={effect.severity || 'moderate'}>
                      {effect.severity}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedDamageOverTime.length === 0 && (
                <div className="empty-selection-message">
                  No damage over time effects selected. Click on effects above to add them to your spell.
                </div>
              )}
              
              {selectedDamageOverTime.length > 0 && (
                <div className="selected-effects">
                  <h5>Selected Damage Over Time Effects:</h5>
                  <div className="selected-list">
                    {selectedDamageOverTime.map(effectId => {
                      const effect = allEffects[effectId];
                      if (!effect) return null;
                      
                      return (
                        <div key={effectId} className="selected-item">
                          <img 
                            src={`https://wow.zamimg.com/images/wow/icons/small/${effect.icon || 'inv_misc_questionmark'}.jpg`}
                            alt={effect.name}
                            className="effect-icon-small"
                            onError={(e) => {
                              e.target.src = 'https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg';
                            }}
                          />
                          <span style={{ color: effect.color }}>{effect.name}</span>
                          <button 
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDamageOverTime(effectId);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Triggers Tab */}
          {activeEffectTab === 'triggers' && (
            <div className="triggers-tab">
              <p className="tab-description">
                Add effects that trigger when specific conditions are met.
              </p>
              
              <div className="triggers-sections">
                <div className="trigger-section">
                  <h5>On-Hit Triggers</h5>
                  <p>These effects have a chance to trigger when the spell hits its target.</p>
                  
                  <button 
                    className="add-trigger-btn"
                    onClick={() => openAddTriggerModal('onHit')}
                  >
                    + Add On-Hit Effect
                  </button>
                  
                  {onHitTriggers.length > 0 ? (
                    <div className="trigger-list">
                      {onHitTriggers.map(trigger => (
                        <div key={trigger.id} className="trigger-item">
                          <div className="trigger-details">
                            <div className="trigger-header">
                              {trigger.chance < 100 ? (
                                <span className="trigger-chance">
                                  {trigger.chance}% chance:
                                </span>
                              ) : (
                                <span className="trigger-always">
                                  Always:
                                </span>
                              )}
                            </div>
                            <div className="trigger-effect">{trigger.effect}</div>
                            {trigger.duration > 0 && (
                              <div className="trigger-duration">
                                Lasts {trigger.duration} {trigger.duration === 1 ? 'round' : 'rounds'}
                              </div>
                            )}
                          </div>
                          <div className="trigger-actions">
                            <button 
                              className="edit-btn"
                              onClick={() => openEditTriggerModal(trigger, 'onHit')}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteTrigger(trigger.id, 'onHit')}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-triggers">
                      No on-hit triggers added.
                    </div>
                  )}
                </div>
                
                <div className="trigger-section">
                  <h5>On-Damage Triggers</h5>
                  <p>These effects have a chance to trigger when the target takes damage.</p>
                  
                  <button 
                    className="add-trigger-btn"
                    onClick={() => openAddTriggerModal('onDamage')}
                  >
                    + Add On-Damage Effect
                  </button>
                  
                  {onDamageTriggers.length > 0 ? (
                    <div className="trigger-list">
                      {onDamageTriggers.map(trigger => (
                        <div key={trigger.id} className="trigger-item">
                          <div className="trigger-details">
                            <div className="trigger-header">
                              {trigger.chance < 100 ? (
                                <span className="trigger-chance">
                                  {trigger.chance}% chance:
                                </span>
                              ) : (
                                <span className="trigger-always">
                                  Always:
                                </span>
                              )}
                            </div>
                            <div className="trigger-effect">{trigger.effect}</div>
                            {trigger.duration > 0 && (
                              <div className="trigger-duration">
                                Lasts {trigger.duration} {trigger.duration === 1 ? 'round' : 'rounds'}
                              </div>
                            )}
                          </div>
                          <div className="trigger-actions">
                            <button 
                              className="edit-btn"
                              onClick={() => openEditTriggerModal(trigger, 'onDamage')}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteTrigger(trigger.id, 'onDamage')}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-triggers">
                      No on-damage triggers added.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Auras Tab */}
          {activeEffectTab === 'auras' && (
            <div className="auras-tab">
              <p className="tab-description">
                Create aura effects that affect an area around the target.
              </p>
              
              <button 
                className="add-aura-btn"
                onClick={openAddAuraModal}
              >
                + Add Aura Effect
              </button>
              
              {auraEffects.length > 0 ? (
                <div className="aura-list">
                  {auraEffects.map(aura => (
                    <div key={aura.id} className="aura-item">
                      <div className="aura-details">
                        <div className="aura-name">{aura.name}</div>
                        <div className="aura-effect">{aura.effect}</div>
                        <div className="aura-properties">
                          <span className="aura-range">Range: {aura.range} ft</span>
                          <span className="aura-target">
                            Affects: {aura.target === 'all' ? 'All creatures' : 
                                      aura.target === 'allies' ? 'Allies only' : 
                                      'Enemies only'}
                          </span>
                        </div>
                      </div>
                      <div className="aura-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => openEditAuraModal(aura)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteAura(aura.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-auras">
                  No aura effects added.
                </div>
              )}
            </div>
          )}
          
          {/* Advanced Behaviors Tab */}
          {activeEffectTab === 'advanced' && (
            <div className="advanced-tab">
              <p className="tab-description">
                Add complex behaviors and special interactions to your spell.
              </p>
              
              <div className="behaviors-container">
                {ADVANCED_BEHAVIORS.map(behavior => (
                  <div 
                    key={behavior.id}
                    className={`behavior-option ${selectedAdvancedBehaviors.includes(behavior.id) ? 'selected' : ''}`}
                    onClick={() => toggleAdvancedBehavior(behavior.id)}
                    onMouseEnter={(e) => handleMouseEnter(e, behavior.name, behavior.description, behavior.examples)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="behavior-name">{behavior.name}</div>
                    <div className="behavior-description">{behavior.description}</div>
                    <div className="behavior-examples">
                      <span>Examples: </span>
                      {behavior.examples.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Trigger Modal */}
      {showTriggerModal && (
        <div className="modal-overlay" onClick={() => setShowTriggerModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentEditingTrigger ? 'Edit Trigger' : 'Add Trigger'}</h3>
              <button className="close-modal-btn" onClick={() => setShowTriggerModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Trigger Type:</label>
                <div className="trigger-type-display">
                  {triggerType === 'onHit' ? 'On-Hit Trigger' : 'On-Damage Trigger'}
                </div>
              </div>
              
              <div className="form-group">
                <label>Effect Description:</label>
                <textarea 
                  value={triggerEffect}
                  onChange={(e) => setTriggerEffect(e.target.value)}
                  placeholder="Describe the effect (e.g., 'Target is stunned')"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Trigger Chance:</label>
                <div className="chance-input">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={triggerChance}
                    onChange={handleTriggerChanceChange}
                  />
                  <span className="unit">%</span>
                </div>
                {triggerChance < 100 && (
                  <div className="chance-explanation">
                    {formatProcChance(triggerChance)}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Effect Duration (rounds):</label>
                <input
                  type="number"
                  min="0"
                  value={triggerDuration}
                  onChange={handleTriggerDurationChange}
                />
                <div className="duration-hint">
                  0 = instantaneous effect
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowTriggerModal(false)}>Cancel</button>
              <button 
                className="save-btn"
                onClick={saveTrigger}
                disabled={!triggerEffect}
              >
                {currentEditingTrigger ? 'Update' : 'Add'} Trigger
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Aura Modal */}
      {showAuraModal && (
        <div className="modal-overlay" onClick={() => setShowAuraModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentEditingAura ? 'Edit Aura' : 'Add Aura'}</h3>
              <button className="close-modal-btn" onClick={() => setShowAuraModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Aura Name:</label>
                <input 
                  type="text"
                  value={auraName}
                  onChange={(e) => setAuraName(e.target.value)}
                  placeholder="Name of the aura (e.g., 'Aura of Might')"
                />
              </div>
              
              <div className="form-group">
                <label>Aura Effect:</label>
                <textarea 
                  value={auraEffect}
                  onChange={(e) => setAuraEffect(e.target.value)}
                  placeholder="Describe the effect (e.g., 'Allies gain +2 to attack rolls')"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Aura Range (feet):</label>
                <input
                  type="number"
                  min="1"
                  value={auraRange}
                  onChange={handleAuraRangeChange}
                />
              </div>
              
              <div className="form-group">
                <label>Affects:</label>
                <div className="aura-target-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="auraTarget"
                      value="enemies"
                      checked={auraTarget === 'enemies'}
                      onChange={() => setAuraTarget('enemies')}
                    />
                    Enemies Only
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="auraTarget"
                      value="allies"
                      checked={auraTarget === 'allies'}
                      onChange={() => setAuraTarget('allies')}
                    />
                    Allies Only
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="auraTarget"
                      value="all"
                      checked={auraTarget === 'all'}
                      onChange={() => setAuraTarget('all')}
                    />
                    All Creatures
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAuraModal(false)}>Cancel</button>
              <button 
                className="save-btn"
                onClick={saveAura}
                disabled={!auraName || !auraEffect}
              >
                {currentEditingAura ? 'Update' : 'Add'} Aura
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="spell-tooltip"
          ref={tooltipRef}
          style={{
            top: tooltipPosition.y,
            left: tooltipPosition.x
          }}
        >
          <div className="tooltip-header">
            <div className="tooltip-title">{tooltipContent.title}</div>
          </div>
          <div className="tooltip-description">{tooltipContent.description}</div>
          {tooltipContent.examples && tooltipContent.examples.length > 0 && (
            <div className="tooltip-examples">
              <span className="examples-label">Examples: </span>
              {tooltipContent.examples.join(', ')}
            </div>
          )}
        </div>
      )}
      
      {/* Advanced Behavior Details Panel */}
      {selectedAdvancedBehaviors.length > 0 && (
        <div className="section">
          <h4 className="section-title">Selected Advanced Behaviors</h4>
          <p className="section-description">
            You've selected the following special behaviors for your spell:
          </p>
          
          <div className="selected-behaviors-list">
            {selectedAdvancedBehaviors.map(behaviorId => {
              const behavior = ADVANCED_BEHAVIORS.find(b => b.id === behaviorId);
              if (!behavior) return null;
              
              return (
                <div key={behaviorId} className="selected-behavior">
                  <h5>{behavior.name}</h5>
                  <p>{behavior.description}</p>
                  <div className="behavior-examples">
                    <span>Examples: </span>
                    {behavior.examples.join(', ')}
                  </div>
                  <button 
                    className="remove-behavior-btn"
                    onClick={() => toggleAdvancedBehavior(behaviorId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Effect Summary */}
      {(selectedBuffs.length > 0 || selectedDebuffs.length > 0 || 
        selectedMovementEffects.length > 0 || selectedDamageOverTime.length > 0 || 
        onHitTriggers.length > 0 || onDamageTriggers.length > 0 || 
        auraEffects.length > 0) && (
        <div className="section">
          <h4 className="section-title">Secondary Effects Summary</h4>
          <div className="effects-summary">
            {selectedBuffs.length > 0 && (
              <div className="summary-category">
                <h5>Buffs:</h5>
                <div className="summary-tags">
                  {selectedBuffs.map(buffId => {
                    const buff = allEffects[buffId];
                    if (!buff) return null;
                    return (
                      <span key={buffId} className="summary-tag" style={{ borderColor: buff.color }}>
                        {buff.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {selectedDebuffs.length > 0 && (
              <div className="summary-category">
                <h5>Debuffs:</h5>
                <div className="summary-tags">
                  {selectedDebuffs.map(debuffId => {
                    const debuff = allEffects[debuffId];
                    if (!debuff) return null;
                    return (
                      <span key={debuffId} className="summary-tag" style={{ borderColor: debuff.color }}>
                        {debuff.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {selectedMovementEffects.length > 0 && (
              <div className="summary-category">
                <h5>Movement Effects:</h5>
                <div className="summary-tags">
                  {selectedMovementEffects.map(effectId => {
                    const effect = allEffects[effectId];
                    if (!effect) return null;
                    return (
                      <span key={effectId} className="summary-tag" style={{ borderColor: effect.color }}>
                        {effect.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {selectedDamageOverTime.length > 0 && (
              <div className="summary-category">
                <h5>Damage Over Time:</h5>
                <div className="summary-tags">
                  {selectedDamageOverTime.map(effectId => {
                    const effect = allEffects[effectId];
                    if (!effect) return null;
                    return (
                      <span key={effectId} className="summary-tag" style={{ borderColor: effect.color }}>
                        {effect.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {(onHitTriggers.length > 0 || onDamageTriggers.length > 0) && (
              <div className="summary-category">
                <h5>Triggers:</h5>
                <div className="summary-triggers">
                  {onHitTriggers.map(trigger => (
                    <span key={trigger.id} className="summary-trigger">
                      On Hit: {trigger.effect} ({trigger.chance}%)
                    </span>
                  ))}
                  {onDamageTriggers.map(trigger => (
                    <span key={trigger.id} className="summary-trigger">
                      On Damage: {trigger.effect} ({trigger.chance}%)
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {auraEffects.length > 0 && (
              <div className="summary-category">
                <h5>Auras:</h5>
                <div className="summary-auras">
                  {auraEffects.map(aura => (
                    <span key={aura.id} className="summary-aura">
                      {aura.name} ({aura.range}ft): {aura.effect}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Suggestions Based on Spell Type */}
      <div className="section effect-suggestions">
        <h4 className="section-title">Effect Recommendations</h4>
        <p className="section-description">
          Based on your spell's type and properties, here are some recommended combinations:
        </p>
        
        <div className="recommendation-cards">
          {/* Damage Spell Recommendations */}
          {spellData.category === 'damage' && (
            <div className="recommendation-card">
              <h5>For Damage Spells:</h5>
              <ul>
                <li>
                  <strong>Direct Damage:</strong> Add a short debuff like "Weakened" to reduce enemy effectiveness
                </li>
                <li>
                  <strong>AoE Damage:</strong> Consider "Terrain Modification" to leave damaging areas
                </li>
                <li>
                  <strong>Single Target:</strong> Pair with "Conditional Effects" to deal extra damage to low health targets
                </li>
              </ul>
            </div>
          )}
          
          {/* Healing Spell Recommendations */}
          {spellData.category === 'healing' && (
            <div className="recommendation-card">
              <h5>For Healing Spells:</h5>
              <ul>
                <li>
                  <strong>Direct Healing:</strong> Add a short protective buff to increase effectiveness
                </li>
                <li>
                  <strong>Over Time:</strong> Consider adding "Aura" effects to heal nearby allies
                </li>
                <li>
                  <strong>Reactive Healing:</strong> Use "On-Damage Triggers" to provide automatic responses
                </li>
              </ul>
            </div>
          )}
          
          {/* Control Spell Recommendations */}
          {spellData.category === 'debuff' && (
            <div className="recommendation-card">
              <h5>For Control Spells:</h5>
              <ul>
                <li>
                  <strong>Movement Impairment:</strong> Combine "Slowed" with "Terrain Modification"
                </li>
                <li>
                  <strong>Crowd Control:</strong> Use "Conditional Effects" to extend duration on key targets
                </li>
                <li>
                  <strong>Debilitating Effects:</strong> Add "Combo Potential" to enhance other party members' abilities
                </li>
              </ul>
            </div>
          )}
          
          {/* Utility Spell Recommendations */}
          {spellData.category === 'utility' && (
            <div className="recommendation-card">
              <h5>For Utility Spells:</h5>
              <ul>
                <li>
                  <strong>Movement Spells:</strong> Add "Environmental Interaction" for more tactical options
                </li>
                <li>
                  <strong>Protection Spells:</strong> Consider "Dynamic Scaling" based on target stats
                </li>
                <li>
                  <strong>Transformation Spells:</strong> Use "Terrain Modification" to create passage ways
                </li>
              </ul>
            </div>
          )}
          
          {/* Buff Spell Recommendations */}
          {spellData.category === 'buff' && (
            <div className="recommendation-card">
              <h5>For Buff Spells:</h5>
              <ul>
                <li>
                  <strong>Stat Buffs:</strong> Add "Aura Effects" to extend benefits to allies
                </li>
                <li>
                  <strong>Protection Buffs:</strong> Use "On-Damage Triggers" for reactive defenses
                </li>
                <li>
                  <strong>Empowerment:</strong> Consider "Resource Interaction" to generate resources over time
                </li>
              </ul>
            </div>
          )}
          
          {/* General Recommendations */}
          <div className="recommendation-card">
            <h5>General Tips:</h5>
            <ul>
              <li>
                <strong>Game System Mixing:</strong> Combine effects from different systems for unique spells
              </li>
              <li>
                <strong>Thematic Consistency:</strong> Choose effects that match your spell's theme
              </li>
              <li>
                <strong>Complexity Balance:</strong> Limit to 2-3 major effects for clarity
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <StepNavigation 
        currentStep={4} 
        totalSteps={8} 
        onNext={nextStep} 
        onPrev={prevStep} 
        isNextEnabled={isValid}
      />
    </div>
  );
};

export default Step5SecondaryEffects;