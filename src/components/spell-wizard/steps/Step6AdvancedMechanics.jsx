import React from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import '../styles/Pages/ComboPowerMechanics.css';
import {SpellPreview } from '../common';

// Define the substeps
const SUBSTEPS = [
  { id: 'enable', name: 'Enable' },
  { id: 'role', name: 'Role' },
  { id: 'maxPoints', name: 'Points' },
  { id: 'generator', name: 'Generator' },
  { id: 'finisher', name: 'Finisher' },
  { id: 'visual', name: 'Visual' },
  { id: 'summary', name: 'Summary' }
];

// Combo point generation options - updated for TTRPG round-based system
const COMBO_GENERATION = [
  {
    id: 'basic_attack',
    name: 'Basic Attack',
    description: 'Generate combo points with basic attacks',
    details: 'Each basic attack generates 1 combo point. Critical hits generate an additional combo point.',
    icon: 'ability_rogue_slicedice',
    color: '#ff5722',
    colorRgb: '255, 87, 34',
    examples: ['Quick Strike', 'Jab', 'Sinister Strike']
  },
  {
    id: 'dot_tick',
    name: 'DoT Effects',
    description: 'Generate combo points from damage over time effects',
    details: 'Each round your damage-over-time effect deals damage, you have a chance to generate a combo point.',
    icon: 'ability_rogue_rupture',
    color: '#9c27b0',
    colorRgb: '156, 39, 176',
    examples: ['Rupture', 'Garrote', 'Rend']
  },
  {
    id: 'special_ability',
    name: 'Special Abilities',
    description: 'Specific abilities that generate combo points',
    details: 'Certain special abilities are designed to quickly generate multiple combo points at once.',
    icon: 'ability_rogue_eviscerate',
    color: '#f44336',
    colorRgb: '244, 67, 54',
    examples: ['Mutilate', 'Backstab', 'Shadowstrike']
  },
  {
    id: 'defensive',
    name: 'Defensive Actions',
    description: 'Generate points when using defensive abilities',
    details: 'Taking defensive actions such as dodging, parrying, or using certain defensive abilities generate combo points.',
    icon: 'ability_warrior_defensivestance',
    color: '#2196f3',
    colorRgb: '33, 150, 243',
    examples: ['Riposte', 'Evasion', 'Parry']
  },
  {
    id: 'resource_spend',
    name: 'Resource Spending',
    description: 'Gain combo points when spending other resources',
    details: 'Spending primary resources like mana or energy has a chance to generate combo points.',
    icon: 'spell_arcane_arcane03',
    color: '#4caf50',
    colorRgb: '76, 175, 80',
    examples: ['Energized Attack', 'Mana Tap', 'Soul Harvest']
  },
  {
    id: 'positional',
    name: 'Positional Requirements',
    description: 'Generate points when attacking from specific positions',
    details: 'Attacking from advantageous positions (behind, flanking) generates additional combo points.',
    icon: 'achievement_femalegoblinhead',
    color: '#ff9800',
    colorRgb: '255, 152, 0',
    examples: ['Backstab', 'Ambush', 'Flank Attack']
  }
];

// Finisher effects that consume combo points
const FINISHER_EFFECTS = [
  {
    id: 'damage_finisher',
    name: 'Damage Finisher',
    description: 'Deal increasing damage based on combo points',
    details: 'Consumes all combo points to deal damage that scales with the number of points spent.',
    icon: 'ability_rogue_eviscerate',
    color: '#e91e63',
    colorRgb: '233, 30, 99',
    scaling: 'Damage increases by 50% per combo point',
    examples: ['Eviscerate', 'Envenom', 'Kill Shot']
  },
  {
    id: 'dot_finisher',
    name: 'DoT Finisher',
    description: 'Apply a powerful DoT effect scaled by combo points',
    details: 'Applies a damage-over-time effect with duration and potency based on combo points spent.',
    icon: 'spell_shadow_rupture',
    color: '#9c27b0',
    colorRgb: '156, 39, 176',
    scaling: 'Duration increases by 2 rounds per combo point',
    examples: ['Rupture', 'Deadly Poison', 'Rend']
  },
  {
    id: 'aoe_finisher',
    name: 'AoE Finisher',
    description: 'Deal area damage scaled by combo points',
    details: 'Unleashes an area-of-effect attack with damage and radius scaling with combo points.',
    icon: 'spell_shadow_shadowfury',
    color: '#673ab7',
    colorRgb: '103, 58, 183',
    scaling: 'Radius increases by 2 yards and damage by 30% per combo point',
    examples: ['Fan of Knives', 'Death from Above', 'Blade Flurry']
  },
  {
    id: 'heal_finisher',
    name: 'Healing Finisher',
    description: 'Heal yourself based on combo points',
    details: 'Converts combo points into healing, either as direct healing or a HoT effect.',
    icon: 'ability_rogue_recuperate',
    color: '#4caf50',
    colorRgb: '76, 175, 80',
    scaling: 'Healing increases by 25% per combo point',
    examples: ['Recuperate', 'Second Wind', 'Victory Rush']
  },
  {
    id: 'buff_finisher',
    name: 'Buff Finisher',
    description: 'Apply a buff scaled by combo points',
    details: 'Applies a powerful self-buff with duration and potency scaled by combo points.',
    icon: 'ability_rogue_sliceanddice',
    color: '#2196f3',
    colorRgb: '33, 150, 243',
    scaling: 'Duration increases by 2 rounds and effect potency by 10% per combo point',
    examples: ['Slice and Dice', 'Adrenaline Rush', 'Enrage']
  },
  {
    id: 'debuff_finisher',
    name: 'Debuff Finisher',
    description: 'Apply a debuff scaled by combo points',
    details: 'Applies a debuff to the target with effect and duration based on combo points.',
    icon: 'ability_warrior_bloodbath',
    color: '#ff5722',
    colorRgb: '255, 87, 34',
    scaling: 'Duration increases by 1 round and effect potency by 15% per combo point',
    examples: ['Kidney Shot', 'Deep Wound', 'Expose Armor']
  },
  {
    id: 'resource_finisher',
    name: 'Resource Generator',
    description: 'Convert combo points to another resource',
    details: 'Consumes combo points to regenerate another resource like mana, energy, or health.',
    icon: 'spell_arcane_arcane04',
    color: '#00bcd4',
    colorRgb: '0, 188, 212',
    scaling: 'Resource gain increases by 20% per combo point',
    examples: ['Preparation', 'Adrenaline Rush', 'Second Wind']
  }
];

// Special conditions for combo point generation
const COMBO_CONDITIONS = [
  {
    id: 'critical_strike',
    name: 'Critical Strike',
    description: 'Generate additional combo points on critical hits',
    icon: 'ability_rogue_unfairadvantage',
    value: 1
  },
  {
    id: 'streak',
    name: 'Attack Streak',
    description: 'Consecutive attacks have increasing chance to generate extra combo points',
    icon: 'ability_fixated_state_red',
    value: 10
  },
  {
    id: 'proc_chance',
    name: 'Proc Chance',
    description: 'Chance to generate additional combo points on any hit',
    icon: 'spell_holy_borrowedtime',
    value: 15
  },
  {
    id: 'resource_threshold',
    name: 'Resource Threshold',
    description: 'Generate extra combo points when above resource threshold',
    icon: 'spell_arcane_arcane03',
    value: 70
  },
  {
    id: 'positional_bonus',
    name: 'Positional Bonus',
    description: 'Generate more combo points when attacking from behind or flank',
    icon: 'inv_spark_shard_orange',
    value: 1
  },
  {
    id: 'low_health',
    name: 'Target Low Health',
    description: 'Generate additional combo points when target is below health threshold',
    icon: 'ability_warrior_bloodfrenzy',
    value: 25
  }
];

// Combo points display themes
const COMBO_VISUALS = [
  {
    id: 'rogue',
    name: 'Rogue Style',
    description: 'Classic combo point indicators shown above your character',
    theme: 'var(--damage-physical)',
    activeColor: '#f44336',
    emptyColor: '#424242',
    glowColor: 'rgba(244, 67, 54, 0.5)',
    shape: 'circle'
  },
  {
    id: 'druid',
    name: 'Druid Style',
    description: 'Paw-like indicators shown as energy symbols',
    theme: 'var(--damage-nature)',
    activeColor: '#4caf50',
    emptyColor: '#2e4835',
    glowColor: 'rgba(76, 175, 80, 0.5)',
    shape: 'paw'
  },
  {
    id: 'mage',
    name: 'Arcane Style',
    description: 'Magical runes that glow with accumulated power',
    theme: 'var(--damage-arcane)',
    activeColor: '#9c27b0',
    emptyColor: '#47246f',
    glowColor: 'rgba(156, 39, 176, 0.5)',
    shape: 'rune'
  },
  {
    id: 'monk',
    name: 'Chi Style',
    description: 'Flowing energy points displayed as chi orbs',
    theme: 'var(--primary-500)',
    activeColor: '#00bcd4',
    emptyColor: '#0e5e6a',
    glowColor: 'rgba(0, 188, 212, 0.5)',
    shape: 'orb'
  },
  {
    id: 'paladin',
    name: 'Holy Power',
    description: 'Divine energy symbols shown as holy indicators',
    theme: 'var(--damage-holy)',
    activeColor: '#ffeb3b',
    emptyColor: '#635f35',
    glowColor: 'rgba(255, 235, 59, 0.5)',
    shape: 'diamond'
  },
  {
    id: 'warlock',
    name: 'Soul Shards',
    description: 'Dark energy fragments shown as soul indicators',
    theme: 'var(--damage-shadow)',
    activeColor: '#673ab7',
    emptyColor: '#312258',
    glowColor: 'rgba(103, 58, 183, 0.5)',
    shape: 'shard'
  }
];

// Animation styles for combo abilities
const COMBO_ANIMATIONS = [
  {
    id: 'fade_in',
    name: 'Fade In',
    description: 'Points fade in with a smooth transition',
    timing: '0.3s ease-in'
  },
  {
    id: 'scale_up',
    name: 'Scale Up',
    description: 'Points grow in size when activated',
    timing: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Points pulse with energy when activated',
    timing: '0.5s ease-in-out'
  },
  {
    id: 'flip',
    name: 'Flip',
    description: 'Points flip in 3D space when activated',
    timing: '0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955)'
  },
  {
    id: 'glow',
    name: 'Glow',
    description: 'Points glow with increasing intensity',
    timing: '0.3s ease'
  },
  {
    id: 'bounce',
    name: 'Bounce',
    description: 'Points bounce up when activated',
    timing: '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
];

// Build-up mechanics that lead to enhanced finishers
const BUILDUP_MECHANICS = [
  {
    id: 'momentum',
    name: 'Momentum',
    description: 'Consecutive uses increase in power',
    details: 'Using the same generator repeatedly builds momentum, increasing the power of your finisher.',
    icon: 'ability_rogue_quickrecovery',
    color: '#2196f3',
    colorRgb: '33, 150, 243',
    scaling: 'Each consecutive use adds 8% to finisher effectiveness'
  },
  {
    id: 'vulnerability',
    name: 'Vulnerability',
    description: 'Attacks create vulnerability for finishers',
    details: 'Your generator abilities create a vulnerability state that enhances the next finisher.',
    icon: 'ability_warrior_trauma',
    color: '#f44336',
    colorRgb: '244, 67, 54',
    scaling: 'Vulnerability increases finisher damage by 5% per stack'
  },
  {
    id: 'execution',
    name: 'Execution Window',
    description: 'Finishers more powerful at certain health thresholds',
    details: 'Your finishers deal significantly more damage to targets below a health threshold.',
    icon: 'ability_warrior_bloodbath',
    color: '#e91e63',
    colorRgb: '233, 30, 99',
    scaling: 'Damage increases by 20% against targets below 25% health'
  },
  {
    id: 'crescendo',
    name: 'Crescendo',
    description: 'Time-sensitive build-up requiring proper pacing',
    details: 'Maintaining a steady rhythm of attacks builds a crescendo that empowers your finisher, but delay too long and it resets.',
    icon: 'spell_holy_divineillumination',
    color: '#ffc107',
    colorRgb: '255, 193, 7',
    scaling: 'Power increases by 5% every round up to 30%, then decays'
  },
  {
    id: 'tactical_prep',
    name: 'Tactical Preparation',
    description: 'Special abilities that enhance the next finisher',
    details: 'Use specific preparation abilities before your finisher to enhance its effects.',
    icon: 'ability_rogue_masterofsubtlety',
    color: '#9c27b0',
    colorRgb: '156, 39, 176',
    scaling: 'Prepared finishers deal 25% more damage or have 40% longer duration'
  }
];

// Maximum combo points settings
const MAX_COMBO_OPTIONS = [
  { id: 3, name: '3 Points', description: 'Classic 3-point system, quicker rotations' },
  { id: 4, name: '4 Points', description: 'Balanced system with moderate build-up' },
  { id: 5, name: '5 Points', description: 'Standard 5-point system, strategic build-up' },
  { id: 6, name: '6 Points', description: 'Extended system with longer build-up phases' },
  { id: 8, name: '8 Points', description: 'Advanced system with powerful finishers' }
];

// Reusable UI Components
const SectionHeader = ({ icon, title, description }) => (
  <>
    <h4 className="section-title">
      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${icon}.jpg`} alt="" className="section-icon" />
      {title}
    </h4>
    {description && <p className="section-description">{description}</p>}
  </>
);

const ComboPoint = ({ active, shapeClass, animStyle, activeColor, emptyColor, glowColor, animTiming, size = 'normal' }) => {
  const sizeClass = size === 'small' ? 'combo-point-preview' : 
                   size === 'live' ? 'combo-point-live' : 'combo-point';
  
  return (
    <div 
      className={`${sizeClass} ${shapeClass} ${animStyle} ${active ? 'active' : ''}`}
      style={{
        '--active-color': activeColor,
        '--empty-color': emptyColor,
        '--glow-color': glowColor,
        '--animation-timing': animTiming,
        backgroundColor: active ? activeColor : emptyColor
      }}
    />
  );
};

const ComboPointsDisplay = ({ count, max, shapeClass, animStyle, activeColor, emptyColor, glowColor, animTiming, size }) => (
  <div className="combo-points-visual">
    {Array.from({ length: max }).map((_, index) => (
      <ComboPoint 
        key={index}
        active={index < count}
        shapeClass={shapeClass}
        animStyle={animStyle}
        activeColor={activeColor}
        emptyColor={emptyColor}
        glowColor={glowColor}
        animTiming={animTiming}
        size={size}
      />
    ))}
  </div>
);

const AnimationPreview = ({ animationType, activeColor, glowColor, animTiming }) => (
  <div className={`animation-preview combo-animation-preview-${animationType}`}>
    <div 
      className="demo-combo-point"
      style={{ 
        '--animation-timing': animTiming,
        '--primary-color': activeColor,
        '--primary-glow': glowColor,
        animationName: `demo-${animationType}`,
        animationDuration: '1.5s',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
        animationTimingFunction: animTiming.split(' ')[1] || 'ease'
      }}
    />
  </div>
);

const Step6AdvancedMechanics = () => {
  const { 
    spellData, 
    updateSpellData, 
    setStepValidation,
    nextStep,
    prevStep
  } = useSpellWizardStore();
  
  // Local state
  const [isComboSystem, setIsComboSystem] = React.useState(spellData.isComboSystem || false);
  const [maxComboPoints, setMaxComboPoints] = React.useState(spellData.maxComboPoints || 5);
  const [comboGenerator, setComboGenerator] = React.useState(spellData.comboGenerator || []);
  const [comboFinisher, setComboFinisher] = React.useState(spellData.comboFinisher || '');
  const [comboConditions, setComboConditions] = React.useState(spellData.comboConditions || []);
  const [comboVisualStyle, setComboVisualStyle] = React.useState(spellData.comboVisualStyle || 'rogue');
  const [comboAnimation, setComboAnimation] = React.useState(spellData.comboAnimation || 'scale_up');
  const [buildupMechanic, setBuildupMechanic] = React.useState(spellData.buildupMechanic || '');
  const [comboRole, setComboRole] = React.useState(spellData.comboRole || '');
  const [currentSubstep, setCurrentSubstep] = React.useState('enable');
  
  // Demo combo points state
  const [demoComboPoints, setDemoComboPoints] = React.useState(0);
  const [comboPreviewActive, setComboPreviewActive] = React.useState(false);
  const [useFinisher, setUseFinisher] = React.useState(false);
  const [autoDemo, setAutoDemo] = React.useState(false);
  
  // Refs for animation
  const comboContainerRef = React.useRef(null);
  const finisherRef = React.useRef(null);
  const demoInterval = React.useRef(null);
  
  // Initialize from spell data
  React.useEffect(() => {
    if (spellData.isComboSystem !== undefined) {
      setIsComboSystem(spellData.isComboSystem);
    }
    
    if (spellData.maxComboPoints) {
      setMaxComboPoints(spellData.maxComboPoints);
    }
    
    if (spellData.comboGenerator) {
      setComboGenerator(spellData.comboGenerator);
    }
    
    if (spellData.comboFinisher) {
      setComboFinisher(spellData.comboFinisher);
    }
    
    if (spellData.comboConditions) {
      setComboConditions(spellData.comboConditions);
    }
    
    if (spellData.comboVisualStyle) {
      setComboVisualStyle(spellData.comboVisualStyle);
    }
    
    if (spellData.comboAnimation) {
      setComboAnimation(spellData.comboAnimation);
    }
    
    if (spellData.buildupMechanic) {
      setBuildupMechanic(spellData.buildupMechanic);
    }
    
    if (spellData.comboRole) {
      setComboRole(spellData.comboRole);
    }
  }, [spellData]);
  
  // Handle auto demo if active
  React.useEffect(() => {
    if (autoDemo) {
      demoInterval.current = setInterval(() => {
        setDemoComboPoints(prev => {
          if (prev < maxComboPoints) {
            return prev + 1;
          } else {
            // Flash finisher and reset
            setUseFinisher(true);
            
            setTimeout(() => {
              setUseFinisher(false);
              setDemoComboPoints(0);
            }, 800);
            return prev;
          }
        });
      }, 1200);
    } else {
      if (demoInterval.current) {
        clearInterval(demoInterval.current);
      }
    }
    
    return () => {
      if (demoInterval.current) {
        clearInterval(demoInterval.current);
      }
    };
  }, [autoDemo, maxComboPoints]);
  
  // Update spell data when form changes
  React.useEffect(() => {
    updateSpellData({
      isComboSystem,
      maxComboPoints,
      comboGenerator,
      comboFinisher,
      comboConditions,
      comboVisualStyle,
      comboAnimation,
      buildupMechanic,
      comboRole
    });
    
    // Valid if combo system is enabled and required fields are filled
    const isValid = !isComboSystem || (
      comboRole && ((comboRole === 'generator' && comboGenerator.length > 0) || 
                    (comboRole === 'finisher' && comboFinisher) || 
                    (comboRole === 'hybrid' && comboGenerator.length > 0 && comboFinisher))
    );
    
    setStepValidation(5, isValid);
  }, [
    isComboSystem,
    maxComboPoints,
    comboGenerator,
    comboFinisher,
    comboConditions,
    comboVisualStyle,
    comboAnimation,
    buildupMechanic,
    comboRole,
    updateSpellData,
    setStepValidation
  ]);
  
  // Toggle combo system
  const toggleComboSystem = () => {
    setIsComboSystem(!isComboSystem);
    if (!isComboSystem) {
      setCurrentSubstep('role');
    }
  };
  
  // Handle combo generator selection
  const toggleComboGenerator = (generatorId) => {
    setComboGenerator(prev => {
      if (prev.includes(generatorId)) {
        return prev.filter(id => id !== generatorId);
      } else {
        return [...prev, generatorId];
      }
    });
  };
  
  // Handle combo condition selection
  const toggleComboCondition = (conditionId) => {
    setComboConditions(prev => {
      if (prev.find(c => c.id === conditionId)) {
        return prev.filter(c => c.id !== conditionId);
      } else {
        const condition = COMBO_CONDITIONS.find(c => c.id === conditionId);
        return [...prev, { id: conditionId, value: condition.value }];
      }
    });
  };
  
  // Update condition value
  const updateConditionValue = (conditionId, value) => {
    setComboConditions(prev => {
      return prev.map(c => {
        if (c.id === conditionId) {
          return { ...c, value };
        }
        return c;
      });
    });
  };
  
  // Demo functions for combo points
  const incrementComboPoint = () => {
    if (demoComboPoints < maxComboPoints) {
      setDemoComboPoints(prev => Math.min(prev + 1, maxComboPoints));
    }
  };
  
  const spendComboPoints = () => {
    if (demoComboPoints > 0) {
      setUseFinisher(true);
      
      // Apply finisher animation
      if (finisherRef.current) {
        finisherRef.current.classList.add('active-finisher');
        
        setTimeout(() => {
          finisherRef.current.classList.remove('active-finisher');
          setDemoComboPoints(0);
          setUseFinisher(false);
        }, 1000);
      }
    }
  };
  
  // Start combo preview
  const startComboPreview = () => {
    setComboPreviewActive(true);
    setDemoComboPoints(0);
    setAutoDemo(true);
  };
  
  // Stop combo preview
  const stopComboPreview = () => {
    setComboPreviewActive(false);
    setDemoComboPoints(0);
    setAutoDemo(false);
  };
  
  // Get visual styling for combo points
  const getComboVisualStyle = () => {
    const style = COMBO_VISUALS.find(v => v.id === comboVisualStyle) || COMBO_VISUALS[0];
    const animation = COMBO_ANIMATIONS.find(a => a.id === comboAnimation) || COMBO_ANIMATIONS[1];
    
    return {
      activeColor: style.activeColor,
      emptyColor: style.emptyColor,
      glowColor: style.glowColor,
      shapeClass: `combo-shape-${style.shape}`,
      animStyle: `combo-animation-${animation.id}`,
      animTiming: animation.timing
    };
  };
  
  // Get finisher details
  const getFinisherDetails = () => {
    return FINISHER_EFFECTS.find(f => f.id === comboFinisher);
  };
  
  // Get buildup details
  const getBuildupDetails = () => {
    return BUILDUP_MECHANICS.find(b => b.id === buildupMechanic);
  };
  
  // Format condition value display
  const formatConditionValue = (condition) => {
    const isCritOrPositional = condition.id === 'critical_strike' || condition.id === 'positional_bonus';
    return `${condition.value}${isCritOrPositional ? ' points' : '%'}`;
  };
  
  // Navigation between substeps
  const goToNextSubstep = () => {
    const currentIndex = SUBSTEPS.findIndex(step => step.id === currentSubstep);
    
    // Skip substeps based on role
    if (currentSubstep === 'role' && comboRole === 'finisher') {
      setCurrentSubstep('finisher');
    } else if (currentSubstep === 'generator' && comboRole === 'generator') {
      setCurrentSubstep('visual');
    } else if (currentIndex < SUBSTEPS.length - 1) {
      setCurrentSubstep(SUBSTEPS[currentIndex + 1].id);
    }
  };
  
  const goToPrevSubstep = () => {
    const currentIndex = SUBSTEPS.findIndex(step => step.id === currentSubstep);
    
    // Skip substeps based on role
    if (currentSubstep === 'visual' && comboRole === 'generator') {
      setCurrentSubstep('generator');
    } else if (currentSubstep === 'finisher' && comboRole === 'finisher') {
      setCurrentSubstep('role');
    } else if (currentIndex > 0) {
      setCurrentSubstep(SUBSTEPS[currentIndex - 1].id);
    }
  };
  
  const goToSubstep = (substep) => {
    setCurrentSubstep(substep);
  };
  
  // Check if we can proceed to next substep
  const canProceedToNext = () => {
    if (currentSubstep === 'enable' && !isComboSystem) {
      return true; // Can skip all other steps if combo system is disabled
    }
    
    if (currentSubstep === 'role') {
      return !!comboRole;
    }
    
    if (currentSubstep === 'generator') {
      return comboGenerator.length > 0;
    }
    
    if (currentSubstep === 'finisher') {
      return !!comboFinisher;
    }
    
    return true; // All other substeps can proceed
  };
  
  // Spell type helpers
  const getSpellTypeName = (typeId) => {
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
  
  // Render ComboPointsPreview component
  const renderComboPointsPreview = (subtitle, showControls = false) => {
    const visualStyle = getComboVisualStyle();
    
    return (
      <div className="combo-points-preview">
        {subtitle && <h5 className="subsection-title">{subtitle}</h5>}
        
        <div className="combo-preview-container">
          {showControls && (
            <div className="combo-controls">
              <button 
                className="combo-button generator"
                onClick={incrementComboPoint}
                disabled={demoComboPoints >= maxComboPoints || useFinisher || autoDemo}
              >
                Generate Point
              </button>
              
              <div 
                className="combo-points-container"
                ref={comboContainerRef}
              >
                <ComboPointsDisplay 
                  count={demoComboPoints}
                  max={maxComboPoints}
                  {...visualStyle}
                />
              </div>
              
              <button 
                className="combo-button finisher"
                onClick={spendComboPoints}
                disabled={demoComboPoints === 0 || useFinisher || autoDemo}
                ref={finisherRef}
              >
                Use Finisher ({demoComboPoints})
              </button>
            </div>
          )}
          
          {!showControls && (
            <div className="live-combo-display">
              <ComboPointsDisplay 
                count={demoComboPoints}
                max={maxComboPoints}
                {...visualStyle}
                size="live"
              />
              
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                {!autoDemo ? (
                  <button 
                    className="start-demo-button"
                    onClick={startComboPreview}
                  >
                    Start Auto Demo
                  </button>
                ) : (
                  <button 
                    className="stop-demo-button"
                    onClick={stopComboPreview}
                  >
                    Stop Demo
                  </button>
                )}
              </div>
            </div>
          )}
          
          {comboFinisher && (
            <div className="finisher-effectiveness" style={{ marginTop: '16px' }}>
              <h6>Finisher Effectiveness</h6>
              <div className="effectiveness-bar">
                <div 
                  className="effectiveness-fill"
                  style={{ width: `${(demoComboPoints / maxComboPoints) * 100}%` }}
                />
              </div>
              <div className="effectiveness-labels">
                <span>Weak</span>
                <span>Medium</span>
                <span>Strong</span>
                <span>Powerful</span>
                <span>Maximum</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render the current substep content
  const renderSubstepContent = () => {
    const visualStyle = getComboVisualStyle();
    
    switch (currentSubstep) {
      case 'enable':
        return (
          <div className="substep">
            <div className="section">
              <SectionHeader 
                icon="ability_rogue_slicedice" 
                title="Combo Point System"
                description="Combo point systems allow abilities to generate points that accumulate and are spent on powerful finisher abilities, creating tactical combat rotations."
              />
              
              <div className="combo-system-toggle">
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    checked={isComboSystem}
                    onChange={toggleComboSystem}
                  />
                  <span className="toggle-switch"></span>
                  <span className="toggle-label">Enable Combo Point System</span>
                </label>
                <p className="toggle-description">
                  Enabling this system will convert your spell into either a combo point generator or a finisher ability that uses round-based mechanics for tabletop RPGs.
                </p>
              </div>
              
              {isComboSystem && (
                <div className="combo-points-preview">
                  <h5 className="subsection-title">Combo Points Preview</h5>
                  
                  <div className="combo-preview-container">
                    <AnimationPreview 
                      animationType={comboAnimation}
                      activeColor={visualStyle.activeColor}
                      glowColor={visualStyle.glowColor}
                      animTiming={visualStyle.animTiming}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'role':
        return (
          <div className="substep">
            <div className="section">
              <SectionHeader 
                icon="ability_rogue_slicedice" 
                title="Spell's Role in Combo System"
                description="Choose whether this spell will generate combo points, spend them as a finisher, or both."
              />
              
              <div className="spell-type-options">
                <div 
                  className={`spell-type-option ${comboRole === 'generator' ? 'selected' : ''}`}
                  onClick={() => setComboRole('generator')}
                >
                  <div className="spell-type-icon">
                    <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_sinistercalling.jpg" alt="Generator" />
                  </div>
                  <div className="spell-type-info">
                    <div className="spell-type-name">Generator</div>
                    <div className="spell-type-description">This spell generates combo points for finishers</div>
                  </div>
                </div>
                
                <div 
                  className={`spell-type-option ${comboRole === 'finisher' ? 'selected' : ''}`}
                  onClick={() => setComboRole('finisher')}
                >
                  <div className="spell-type-icon">
                    <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_eviscerate.jpg" alt="Finisher" />
                  </div>
                  <div className="spell-type-info">
                    <div className="spell-type-name">Finisher</div>
                    <div className="spell-type-description">This spell consumes combo points for enhanced effects</div>
                  </div>
                </div>
                
                <div 
                  className={`spell-type-option ${comboRole === 'hybrid' ? 'selected' : ''}`}
                  onClick={() => setComboRole('hybrid')}
                >
                  <div className="spell-type-icon">
                    <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_shadowdance.jpg" alt="Hybrid" />
                  </div>
                  <div className="spell-type-info">
                    <div className="spell-type-name">Hybrid</div>
                    <div className="spell-type-description">This spell both generates and spends combo points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'maxPoints':
        return (
          <div className="substep">
            <div className="section">
              <SectionHeader 
                icon="ability_rogue_slicedice" 
                title="Maximum Combo Points"
                description="Select the maximum number of combo points your system can accumulate. More points allow for greater buildup and more powerful finishers."
              />
              
              <div className="combo-max-options">
                {MAX_COMBO_OPTIONS.map(option => (
                  <div
                    key={option.id}
                    className={`combo-max-option ${maxComboPoints === option.id ? 'selected' : ''}`}
                    onClick={() => setMaxComboPoints(option.id)}
                  >
                    <div className="combo-max-value">{option.id}</div>
                    <div className="combo-max-name">{option.name}</div>
                    <div className="combo-max-description">{option.description}</div>
                  </div>
                ))}
              </div>
              
              {renderComboPointsPreview("Points Preview", true)}
            </div>
          </div>
        );
        
      case 'generator':
        return (
          <div className="substep">
            <div className="section">
              <SectionHeader 
                icon="ability_rogue_sinistercalling" 
                title="Combo Point Generation"
                description="Select how your spell will generate combo points. You can choose multiple generation methods."
              />
              
              <div className="combo-generator-grid">
                {COMBO_GENERATION.map(generator => (
                  <div
                    key={generator.id}
                    className={`combo-generator-card ${comboGenerator.includes(generator.id) ? 'selected' : ''}`}
                    onClick={() => toggleComboGenerator(generator.id)}
                    style={{ 
                      '--card-accent-color': generator.color, 
                      '--card-accent-color-rgb': generator.colorRgb 
                    }}
                  >
                    <div className="combo-generator-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${generator.icon}.jpg`} alt={generator.name} />
                    </div>
                    <div className="combo-generator-content">
                      <h6 className="combo-generator-name">{generator.name}</h6>
                      <p className="combo-generator-description">{generator.description}</p>
                      
                      {comboGenerator.includes(generator.id) && (
                        <div className="combo-generator-details">
                          <p>{generator.details}</p>
                          <div className="combo-examples">
                            Examples: {generator.examples.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {comboGenerator.includes(generator.id) && (
                      <div className="selected-indicator">
                        <span>Selected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <h5 className="subsection-title">Special Conditions (Optional)</h5>
                <p className="section-description">
                  Add special conditions that modify how your spell generates combo points.
                </p>
                
                <div className="combo-generator-grid">
                  {COMBO_CONDITIONS.map(condition => {
                    const isSelected = comboConditions.some(c => c.id === condition.id);
                    const selectedCondition = comboConditions.find(c => c.id === condition.id);
                    
                    return (
                      <div
                        key={condition.id}
                        className={`combo-condition-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleComboCondition(condition.id)}
                      >
                        <div className="combo-condition-icon">
                          <img src={`https://wow.zamimg.com/images/wow/icons/medium/${condition.icon}.jpg`} alt={condition.name} />
                        </div>
                        <div className="combo-condition-content">
                          <h6 className="combo-condition-name">{condition.name}</h6>
                          <p className="combo-condition-description">{condition.description}</p>
                          
                          {isSelected && (
                            <div className="combo-condition-value">
                              <label>Value:</label>
                              <input 
                                type="number" 
                                min="1"
                                max="100"
                                value={selectedCondition.value}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updateConditionValue(
                                  condition.id, 
                                  Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                                )}
                              />
                              <span className="unit">
                                {condition.id === 'critical_strike' || condition.id === 'positional_bonus' ? 
                                  'points' : '%'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {isSelected && (
                          <div className="selected-indicator">
                            <span>Selected</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'finisher':
        return (
          <div className="substep">
            <div className="section">
              <SectionHeader 
                icon="ability_rogue_eviscerate" 
                title="Combo Point Finisher"
                description="Select the effect that will consume your accumulated combo points. The power of the finisher scales with the number of points spent."
              />
              
              <div className="combo-generator-grid">
                {FINISHER_EFFECTS.map(finisher => (
                  <div
                    key={finisher.id}
                    className={`combo-finisher-card ${comboFinisher === finisher.id ? 'selected' : ''}`}
                    onClick={() => setComboFinisher(finisher.id)}
                    style={{ 
                      '--card-accent-color': finisher.color, 
                      '--card-accent-color-rgb': finisher.colorRgb 
                    }}
                  >
                    <div className="combo-finisher-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${finisher.icon}.jpg`} alt={finisher.name} />
                    </div>
                    <div className="combo-finisher-content">
                      <h6 className="combo-finisher-name">{finisher.name}</h6>
                      <p className="combo-finisher-description">{finisher.description}</p>
                      
                      {comboFinisher === finisher.id && (
                        <div className="combo-finisher-details">
                          <p>{finisher.details}</p>
                          <div className="combo-scaling">
                            <span className="scaling-label">Scaling:</span> {finisher.scaling}
                          </div>
                          <div className="combo-examples">
                            Examples: {finisher.examples.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {comboFinisher === finisher.id && (
                      <div className="selected-indicator">
                        <span>Selected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <h5 className="subsection-title">Build-up Mechanics (Optional)</h5>
                <p className="section-description">
                  Add an additional tactical layer that enhances your finisher's effectiveness through careful build-up.
                </p>
                
                <div className="combo-generator-grid">
                  {BUILDUP_MECHANICS.map(mechanic => (
                    <div
                      key={mechanic.id}
                      className={`buildup-mechanic-card ${buildupMechanic === mechanic.id ? 'selected' : ''}`}
                      onClick={() => setBuildupMechanic(mechanic.id)}
                      style={{ 
                        '--card-accent-color': mechanic.color, 
                        '--card-accent-color-rgb': mechanic.colorRgb 
                      }}
                    >
                      <div className="buildup-mechanic-icon">
                        <img src={`https://wow.zamimg.com/images/wow/icons/medium/${mechanic.icon}.jpg`} alt={mechanic.name} />
                      </div>
                      <div className="buildup-mechanic-content">
                        <h6 className="buildup-mechanic-name">{mechanic.name}</h6>
                        <p className="buildup-mechanic-description">{mechanic.description}</p>
                        
                        {buildupMechanic === mechanic.id && (
                          <div className="buildup-mechanic-details">
                            <p>{mechanic.details}</p>
                            <div className="combo-scaling">
                              <span className="scaling-label">Scaling:</span> {mechanic.scaling}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {buildupMechanic === mechanic.id && (
                        <div className="selected-indicator">
                          <span>Selected</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {comboFinisher && (
                  <div className="finisher-effectiveness" style={{ marginTop: '24px' }}>
                    <h6>Finisher Effectiveness</h6>
                    <div className="effectiveness-bar">
                      <div 
                        className="effectiveness-fill"
                        style={{ width: `${(demoComboPoints / maxComboPoints) * 100}%` }}
                      />
                    </div>
                    <div className="effectiveness-labels">
                      <span>Weak</span>
                      <span>Medium</span>
                      <span>Strong</span>
                      <span>Powerful</span>
                      <span>Maximum</span>
                    </div>
                    
                    <div className="finisher-formula">
                      <span className="formula-label">Effect:</span>
                      <span className="formula-value">
                        Base Effect + ({demoComboPoints} × Combo Point Multiplier)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'visual':
        return (
          <div className="substep">
            <div className="section">
              <SectionHeader 
                icon="inv_misc_gem_pearl_06" 
                title="Visual Style"
                description="Choose how your combo points will be displayed visually to the player."
              />
              
              <div className="combo-visual-grid">
                {COMBO_VISUALS.map(visual => (
                  <div
                    key={visual.id}
                    className={`combo-visual-card ${comboVisualStyle === visual.id ? 'selected' : ''}`}
                    onClick={() => setComboVisualStyle(visual.id)}
                  >
                    <div className="visual-preview"
                      style={{ 
                        '--active-color': visual.activeColor, 
                        '--empty-color': visual.emptyColor,
                        '--glow-color': visual.glowColor
                      }}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <ComboPoint 
                          key={index}
                          active={index < 3}
                          shapeClass={`combo-shape-${visual.shape}`}
                          activeColor={visual.activeColor}
                          emptyColor={visual.emptyColor}
                          glowColor={visual.glowColor}
                          size="small"
                        />
                      ))}
                    </div>
                    <div className="combo-visual-content">
                      <h6 className="combo-visual-name">{visual.name}</h6>
                      <p className="combo-visual-description">{visual.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <h5 className="subsection-title">Animation Style</h5>
                <p className="section-description">
                  Choose how your combo points animate when gained or spent.
                </p>
                
                <div className="combo-animation-grid">
                  {COMBO_ANIMATIONS.map(animation => (
                    <div
                      key={animation.id}
                      className={`combo-animation-card ${comboAnimation === animation.id ? 'selected' : ''}`}
                      onClick={() => setComboAnimation(animation.id)}
                    >
                      <AnimationPreview 
                        animationType={animation.id}
                        activeColor={visualStyle.activeColor}
                        glowColor={visualStyle.glowColor}
                        animTiming={animation.timing}
                      />
                      <div className="combo-animation-content">
                        <h6 className="combo-animation-name">{animation.name}</h6>
                        <p className="combo-animation-description">{animation.description}</p>
                        <div className="animation-timing">Timing: {animation.timing}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {renderComboPointsPreview("Live Demo")}
              </div>
            </div>
          </div>
        );
        
      case 'summary':
        return (
          <div className="substep">
            <div className="section">
              <SectionHeader 
                icon="ability_rogue_slicedice" 
                title="Combo System Summary"
                description="Review your combo point system configuration."
              />
              
              <div className="combo-system-summary">                
                <div className="summary-content">
                  <div className="summary-row">
                    <span className="summary-label">System Type:</span>
                    <span className="summary-value">Combo Point System with {maxComboPoints} maximum points</span>
                  </div>
                  
                  <div className="summary-row">
                    <span className="summary-label">Spell's Role:</span>
                    <span className="summary-value">
                      {comboRole === 'generator' ? 'Combo Point Generator' : 
                       comboRole === 'finisher' ? 'Combo Point Finisher' : 
                       comboRole === 'hybrid' ? 'Hybrid (Generator & Finisher)' : 'Not specified'}
                    </span>
                  </div>
                  
                  {(comboRole === 'generator' || comboRole === 'hybrid') && comboGenerator.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Generation Method:</span>
                      <span className="summary-value">
                        {comboGenerator.map(id => COMBO_GENERATION.find(g => g.id === id)?.name).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {comboConditions.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Special Conditions:</span>
                      <span className="summary-value">
                        {comboConditions.map(condition => {
                          const conditionData = COMBO_CONDITIONS.find(c => c.id === condition.id);
                          return `${conditionData?.name} (${formatConditionValue(condition)})`;
                        }).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {(comboRole === 'finisher' || comboRole === 'hybrid') && comboFinisher && (
                    <div className="summary-row">
                      <span className="summary-label">Finisher Type:</span>
                      <span className="summary-value">
                        {FINISHER_EFFECTS.find(f => f.id === comboFinisher)?.name}
                      </span>
                    </div>
                  )}
                  
                  {buildupMechanic && (
                    <div className="summary-row">
                      <span className="summary-label">Build-up Mechanic:</span>
                      <span className="summary-value">
                        {BUILDUP_MECHANICS.find(b => b.id === buildupMechanic)?.name}
                      </span>
                    </div>
                  )}
                  
                  <div className="summary-row">
                    <span className="summary-label">Visual Style:</span>
                    <span className="summary-value">
                      {COMBO_VISUALS.find(v => v.id === comboVisualStyle)?.name} with {COMBO_ANIMATIONS.find(a => a.id === comboAnimation)?.name} animation
                    </span>
                  </div>
                  
                  <div className="summary-row">
                    <span className="summary-label">Round-Based:</span>
                    <span className="summary-value">
                      This system uses TTRPG round-based mechanics instead of real-time seconds
                    </span>
                  </div>
                </div>
              </div>
              
              {renderComboPointsPreview("Final Preview", true)}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render side panel preview 
  const renderSidePanel = () => {
    const visualStyle = getComboVisualStyle();
    
    return (
      <div className="wizard-side-panel">
        <div className="spell-preview-container">

          
          {isComboSystem ? (
            <div className="combo-preview-panel">
              <h5>Combo System Preview</h5>
              
              {(comboRole === 'generator' || comboRole === 'hybrid') && comboGenerator.length > 0 && (
                <div className="combo-generation-methods">
                  <h6>Generation Methods:</h6>
                  <ul>
                    {comboGenerator.map(id => {
                      const generator = COMBO_GENERATION.find(g => g.id === id);
                      return (
                        <li key={id}>
                          <strong>{generator?.name}:</strong> {generator?.description}
                        </li>
                      );
                    })}
                  </ul>
                  
                  {comboConditions.length > 0 && (
                    <div className="combo-conditions-preview">
                      <h6>Special Conditions:</h6>
                      <ul>
                        {comboConditions.map(condition => {
                          const conditionData = COMBO_CONDITIONS.find(c => c.id === condition.id);
                          return (
                            <li key={condition.id}>
                              <strong>{conditionData?.name}:</strong> {conditionData?.description} ({formatConditionValue(condition)})
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {(comboRole === 'finisher' || comboRole === 'hybrid') && comboFinisher && (
                <div className="finisher-details-preview">
                  <h6>Finisher Type: {getFinisherDetails()?.name}</h6>
                  <p>{getFinisherDetails()?.details}</p>
                  <div className="finisher-scaling-preview">
                    <strong>Scaling:</strong> {getFinisherDetails()?.scaling}
                  </div>
                  
                  {buildupMechanic && (
                    <div className="buildup-preview">
                      <h6>Build-up Mechanic: {getBuildupDetails()?.name}</h6>
                      <p>{getBuildupDetails()?.details}</p>
                      <div className="buildup-scaling-preview">
                        <strong>Scaling:</strong> {getBuildupDetails()?.scaling}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="live-combo-display">
                <ComboPointsDisplay 
                  count={demoComboPoints}
                  max={maxComboPoints}
                  {...visualStyle}
                  size="live"
                />
                
                <div className="round-based-note" style={{ 
                  textAlign: 'center', 
                  marginTop: '10px', 
                  fontSize: '13px', 
                  color: 'var(--text-secondary)', 
                  fontStyle: 'italic' 
                }}>
                  Combo points can last multiple combat rounds
                </div>
              </div>
            </div>
          ) : (
            <div className="no-combo-message">
              <p>Combo Point System is disabled. Enable it to configure advanced combo mechanics for your spell.</p>
            </div>
          )}
          
          <div className="spell-description">
            {spellData.description || 'No description provided.'}
          </div>
          
          {spellData.flavorText && (
            <div className="spell-flavor">
              {spellData.flavorText}
            </div>
          )}
        </div>
        
        <div className="wizard-side-panel">
        <h4 className="preview-title"></h4>
        <SpellPreview spellData={spellData} />
      </div>
      </div>
    );
  };
  
  // Render step navigation
  const renderStepNavigation = () => {
    // Skip certain substeps based on role
    const filteredSubsteps = SUBSTEPS.filter(step => {
      if (!isComboSystem && step.id !== 'enable') return false;
      if (step.id === 'generator' && comboRole === 'finisher') return false;
      if (step.id === 'finisher' && comboRole === 'generator') return false;
      return true;
    });
    
    const currentIndex = filteredSubsteps.findIndex(s => s.id === currentSubstep);
    
    return (
      <div className="substep-navigation">
        <button 
          className="nav-button prev-button"
          onClick={currentSubstep === 'enable' ? prevStep : goToPrevSubstep}
        >
          <img 
            src="https://wow.zamimg.com/images/wow/icons/small/spell_holy_borrowedtime.jpg" 
            alt="Previous"
            className="nav-icon"
          />
          {currentSubstep === 'enable' ? 'Previous Step' : 'Back'}
        </button>
        
        <button 
          className="nav-button next-button"
          onClick={currentSubstep === 'summary' ? nextStep : goToNextSubstep}
          disabled={!canProceedToNext()}
        >
          {currentSubstep === 'summary' ? 'Next Step' : 'Continue'}
          <img 
            src="https://wow.zamimg.com/images/wow/icons/small/ability_hunter_pathfinding.jpg" 
            alt="Next"
            className="nav-icon"
          />
        </button>
      </div>
    );
  };
  
  // Render substep progress indicators
  const renderSubstepProgress = () => {
    return (
      <div className="substep-progress">
        <div className="substep-indicators">
          {SUBSTEPS.map((step, index) => {
            // Skip based on role
            if ((step.id === 'generator' && comboRole === 'finisher') ||
                (step.id === 'finisher' && comboRole === 'generator')) {
              return null;
            }
            
            // Skip all substeps after "enable" if combo system is disabled
            if (!isComboSystem && step.id !== 'enable') {
              return null;
            }
            
            const currentIndex = SUBSTEPS.findIndex(s => s.id === currentSubstep);
            const isActive = step.id === currentSubstep;
            const isCompleted = SUBSTEPS.findIndex(s => s.id === step.id) < currentIndex;
            
            return (
              <div
                key={step.id}
                className={`substep-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => isCompleted || isActive ? goToSubstep(step.id) : null}
              >
                {!isCompleted ? index + 1 : ''}
              </div>
            );
          })}
        </div>
        <div className="substep-labels">
          {SUBSTEPS.map((step) => {
            // Skip based on role
            if ((step.id === 'generator' && comboRole === 'finisher') ||
                (step.id === 'finisher' && comboRole === 'generator')) {
              return null;
            }
            
            // Skip all substeps after "enable" if combo system is disabled
            if (!isComboSystem && step.id !== 'enable') {
              return null;
            }
            
            const isActive = step.id === currentSubstep;
            
            return (
              <div
                key={step.id}
                className={`substep-label ${isActive ? 'active' : ''}`}
              >
                {step.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="advanced-mechanics-step">
          {renderSubstepProgress()}
          {renderSubstepContent()}
          {renderStepNavigation()}
        </div>
      </div>
      {renderSidePanel()}
    </div>
  );
};

export default Step6AdvancedMechanics;