import React, { useState, useEffect } from 'react';


// Reactive trigger categories
const REACTIVE_TRIGGER_CATEGORIES = [
  { 
    id: 'health', 
    name: 'Health-Based', 
    icon: 'inv_potion_167',
    triggers: [
      { id: 'low_health', name: 'Low Health', description: 'Activates when your health falls below a threshold', icon: 'ability_warrior_bloodcraze' },
      { id: 'ally_low_health', name: 'Ally Low Health', description: 'Activates when an ally\'s health falls below a threshold', icon: 'spell_holy_sealofsacrifice' },
      { id: 'full_health', name: 'Full Health', description: 'Activates when you reach full health', icon: 'spell_holy_renew' },
      { id: 'health_change', name: 'Health Change', description: 'Activates when health changes by a significant amount', icon: 'spell_holy_flashheal' }
    ] 
  },
  { 
    id: 'damage', 
    name: 'Damage-Based', 
    icon: 'ability_warrior_bloodfrenzy',
    triggers: [
      { id: 'damage_taken', name: 'Damage Taken', description: 'Activates when you take damage', icon: 'ability_warrior_trauma' },
      { id: 'specific_damage_type', name: 'Specific Damage Type', description: 'Activates when you take a specific type of damage', icon: 'spell_fire_flameshock' },
      { id: 'critical_hit', name: 'Critical Hit', description: 'Activates when you land a critical hit', icon: 'ability_criticalstrike' },
      { id: 'lethal_damage', name: 'Lethal Damage', description: 'Activates when you would take lethal damage', icon: 'ability_deathwing_bloodcorruption_death' }
    ] 
  },
  { 
    id: 'movement', 
    name: 'Movement-Based', 
    icon: 'spell_frost_windwalkon',
    triggers: [
      { id: 'enemy_approach', name: 'Enemy Approach', description: 'Activates when enemies enter within a certain range', icon: 'ability_hunter_snipershot' },
      { id: 'dodge', name: 'Dodge', description: 'Activates when you successfully dodge an attack', icon: 'ability_rogue_feint' },
      { id: 'movement_impaired', name: 'Movement Impaired', description: 'Activates when your movement is impaired', icon: 'spell_frost_frostshock' },
      { id: 'falling', name: 'Falling', description: 'Activates when you start falling', icon: 'spell_shadow_featherfall' }
    ] 
  },
  { 
    id: 'combat', 
    name: 'Combat-Based', 
    icon: 'ability_warrior_challange',
    triggers: [
      { id: 'combat_start', name: 'Combat Start', description: 'Activates when entering combat', icon: 'ability_warrior_charge' },
      { id: 'surrounded', name: 'Surrounded', description: 'Activates when surrounded by multiple enemies', icon: 'ability_whirlwind' },
      { id: 'ally_death', name: 'Ally Death', description: 'Activates when an ally dies', icon: 'spell_holy_resurrection' },
      { id: 'enemy_cast', name: 'Enemy Cast', description: 'Activates when an enemy begins casting a spell', icon: 'spell_magic_polymorphchicken' }
    ] 
  },
  { 
    id: 'resource', 
    name: 'Resource-Based', 
    icon: 'spell_arcane_arcane03',
    triggers: [
      { id: 'resource_full', name: 'Resource Full', description: 'Activates when a resource reaches maximum', icon: 'spell_arcane_arcane04' },
      { id: 'resource_empty', name: 'Resource Empty', description: 'Activates when a resource is depleted', icon: 'spell_shadow_lifedrain' },
      { id: 'resource_threshold', name: 'Resource Threshold', description: 'Activates when a resource crosses a threshold', icon: 'spell_arcane_focusedpower' },
      { id: 'overcapped', name: 'Overcapped', description: 'Activates when a resource would exceed maximum', icon: 'spell_nature_elementalabsorption' }
    ] 
  },
  { 
    id: 'status', 
    name: 'Status-Based', 
    icon: 'spell_holy_sealofsacrifice',
    triggers: [
      { id: 'status_effect', name: 'Status Effect', description: 'Activates when affected by a specific status', icon: 'spell_shadow_antishadow' },
      { id: 'cleansed', name: 'Cleansed', description: 'Activates when a negative effect is removed', icon: 'spell_holy_removecurse' },
      { id: 'buff_applied', name: 'Buff Applied', description: 'Activates when a specific buff is applied', icon: 'spell_holy_powerwordshield' },
      { id: 'buff_expired', name: 'Buff Expired', description: 'Activates when a buff expires', icon: 'spell_holy_fanaticism' }
    ] 
  },
  {
    id: 'ally',
    name: 'Ally-Based',
    icon: 'spell_holy_prayerofspirit',
    triggers: [
      { id: 'ally_death', name: 'Ally Death', description: 'Activates when an ally dies within range', icon: 'spell_holy_ancestralspirit' },
      { id: 'ally_cc', name: 'Ally Crowd Controlled', description: 'Activates when an ally is stunned, feared, etc.', icon: 'spell_nature_polymorph' },
      { id: 'ally_casting', name: 'Ally Casting', description: 'Activates when an ally casts a specific spell type', icon: 'spell_holy_holybolt' },
      { id: 'ally_damaged', name: 'Ally Critical Health', description: 'Activates when an ally drops below critical health', icon: 'spell_holy_flashheal' }
    ]
  },
  {
    id: 'environment',
    name: 'Environment-Based',
    icon: 'spell_nature_earthquake',
    triggers: [
      { id: 'terrain_type', name: 'Terrain Type', description: 'Activates when on a specific terrain (water, fire, etc.)', icon: 'spell_frost_summonwaterelemental' },
      { id: 'weather_effect', name: 'Weather Effect', description: 'Activates during specific weather conditions', icon: 'spell_frost_stormearth' },
      { id: 'darkness', name: 'Darkness', description: 'Activates in low-light or darkness', icon: 'spell_shadow_shadowfury' },
      { id: 'elevation', name: 'Elevation', description: 'Activates when at high or low elevation', icon: 'spell_nature_earthquake' }
    ]
  }
];

// Channel interruption conditions
const CHANNEL_INTERRUPTION_CONDITIONS = [
  { id: 'damage', name: 'Taking Damage', description: 'Channel is interrupted when taking any damage', icon: 'ability_warrior_bloodfrenzy' },
  { id: 'movement', name: 'Movement', description: 'Channel is interrupted when moving', icon: 'spell_frost_windwalkon' },
  { id: 'cc', name: 'Crowd Control', description: 'Channel is interrupted when stunned, silenced, etc.', icon: 'spell_shadow_mindrot' },
  { id: 'los', name: 'Line of Sight', description: 'Channel is interrupted when losing line of sight to target', icon: 'ability_eyeoftheowl' },
  { id: 'range', name: 'Range', description: 'Channel is interrupted when target moves out of range', icon: 'ability_hunter_snipershot' },
  { id: 'specific_damage', name: 'Specific Damage Type', description: 'Channel is interrupted when taking a specific type of damage', icon: 'spell_fire_fire' }
];

// Channel maintenance requirements
const CHANNEL_REQUIREMENTS = [
  { id: 'stationary', name: 'Remain Stationary', description: 'Must remain stationary while channeling', icon: 'spell_magic_lesserinvisibilty' },
  { id: 'line_of_sight', name: 'Maintain Line of Sight', description: 'Must maintain line of sight to target', icon: 'ability_hunter_snipershot' },
  { id: 'concentration', name: 'Concentration', description: 'Requires full concentration (can\'t take other actions)', icon: 'spell_arcane_mindmastery' },
  { id: 'per_round_cost', name: 'Per-Round Resource Cost', description: 'Consumes resources each round of channeling', icon: 'inv_elemental_mote_mana' },
  { id: 'sacrifice', name: 'Sacrifice', description: 'Requires ongoing sacrifice (health, an item, etc.)', icon: 'spell_shadow_sacrificialshield' },
  { id: 'verbal', name: 'Verbal Component', description: 'Must continuously speak while channeling', icon: 'spell_holy_silence' }
];

// Enhanced Channel termination effects with area options
const CHANNEL_TERMINATION_EFFECTS = [
  { id: 'exhaustion', name: 'Exhaustion', description: 'Become exhausted when channel ends (penalty to next action)', icon: 'spell_shadow_demonicfortitude', hasAreaEffect: false },
  { id: 'explosion', name: 'Explosive Release', description: 'Energy explodes outward when channel ends (AoE effect)', icon: 'spell_fire_selfdestruct', hasAreaEffect: true },
  { id: 'lingering', name: 'Lingering Effect', description: 'Effect lingers for a short duration after channel ends', icon: 'spell_arcane_arcane03', hasAreaEffect: false },
  { id: 'cooldown', name: 'Extended Cooldown', description: 'Longer cooldown based on channel duration', icon: 'inv_misc_pocketwatch_01', hasAreaEffect: false },
  { id: 'stored_power', name: 'Stored Power', description: 'Store power based on channel duration for later use', icon: 'spell_mage_overpowered', hasAreaEffect: false },
  { id: 'damage_pulse', name: 'Damage Pulse', description: 'Release a pulse of damage around you when channel ends', icon: 'spell_fire_firebolt02', hasAreaEffect: true },
  { id: 'healing_burst', name: 'Healing Burst', description: 'Release a burst of healing around you when channel ends', icon: 'spell_holy_holybolt', hasAreaEffect: true },
  { id: 'slow_field', name: 'Slow Field', description: 'Create a field that slows enemies when channel ends', icon: 'spell_frost_freezingbreath', hasAreaEffect: true },
  { id: 'none', name: 'No Special Effect', description: 'Channel simply ends with no additional effects', icon: 'spell_holy_fanaticism', hasAreaEffect: false }
];

// Enhanced Channel interruption effects with area options
const CHANNEL_INTERRUPTION_EFFECTS = [
  { id: 'backlash', name: 'Backlash', description: 'Take damage or a negative effect when interrupted', icon: 'spell_fire_meteorstorm', hasAreaEffect: false },
  { id: 'partial_effect', name: 'Partial Effect', description: 'Gain a reduced version of the effect based on channeling time', icon: 'spell_mage_runeofpower', hasAreaEffect: false },
  { id: 'refund', name: 'Resource Refund', description: 'Regain a portion of the resource cost when interrupted', icon: 'inv_elemental_mote_mana', hasAreaEffect: false },
  { id: 'cooldown_reduction', name: 'Reduced Cooldown', description: 'The ability cooldown is reduced if interrupted', icon: 'ability_mage_timewarp', hasAreaEffect: false },
  { id: 'stagger', name: 'Stagger', description: 'Become unable to cast for a short period when interrupted', icon: 'spell_nature_timestop', hasAreaEffect: false },
  { id: 'damage_burst', name: 'Damage Burst', description: 'Release a burst of damage around you when interrupted', icon: 'spell_fire_flameshock', hasAreaEffect: true },
  { id: 'knockback', name: 'Knockback', description: 'Knock back nearby enemies when interrupted', icon: 'ability_druid_typhoon', hasAreaEffect: true },
  { id: 'stun_pulse', name: 'Stun Pulse', description: 'Briefly stun nearby enemies when interrupted', icon: 'spell_frost_stun', hasAreaEffect: true },
  { id: 'none', name: 'No Special Effect', description: 'No additional effect when interrupted', icon: 'ability_pvp_neutralization', hasAreaEffect: false }
];

// Cast time options for active abilities
const CAST_TIME_OPTIONS = [
  { id: 'instant', name: 'Instant', description: 'Cast immediately with no preparation time', icon: 'spell_nature_wizardmark' },
  { id: 'standard', name: 'Standard Action', description: 'Takes a standard action to cast', icon: 'spell_holy_flashheal' },
  { id: 'fullround', name: 'Full Round', description: 'Takes a full round to cast', icon: 'spell_holy_divinespirit' },
  { id: 'multi-round', name: 'Multiple Rounds', description: 'Takes multiple rounds to cast', icon: 'spell_holy_healingaura' }
];

// Passive ability activation options
const PASSIVE_ACTIVATION_OPTIONS = [
  { id: 'always_active', name: 'Always Active', description: 'Ability is always in effect without any activation required', icon: 'spell_holy_devotionaura' },
  { id: 'toggleable', name: 'Toggleable', description: 'Can be turned on and off at will (free action)', icon: 'spell_holy_heroism' },
  { id: 'conditional', name: 'Conditional', description: 'Automatically activates under specific conditions', icon: 'spell_frost_coldhearted' },
  { id: 'stance', name: 'Stance/Form', description: 'Active only while in a specific stance or form', icon: 'ability_druid_bearform' }
];

// Passive ability conditions (for conditional activation)
const PASSIVE_CONDITIONS = [
  { id: 'health_threshold', name: 'Health Threshold', description: 'Activates at specific health percentage', icon: 'inv_potion_167' },
  { id: 'combat_only', name: 'Combat Only', description: 'Only active while in combat', icon: 'ability_warrior_challange' },
  { id: 'resource_level', name: 'Resource Level', description: 'Activates at specific resource levels', icon: 'spell_shadow_lifedrain' },
  { id: 'environment', name: 'Environmental', description: 'Activates in specific environments (darkness, underwater, etc.)', icon: 'spell_nature_earthquake' },
  { id: 'ally_proximity', name: 'Ally Proximity', description: 'Activates when allies are nearby', icon: 'spell_holy_prayerofhealing' },
  { id: 'enemy_proximity', name: 'Enemy Proximity', description: 'Activates when enemies are nearby', icon: 'ability_rogue_ambush' }
];

// Reaction frequency options
const REACTION_FREQUENCY_OPTIONS = [
  { id: 'once_per_round', name: 'Once Per Round', description: 'Can only trigger once each combat round', icon: 'inv_misc_pocketwatch_01' },
  { id: 'once_per_turn', name: 'Once Per Turn', description: 'Can only trigger once during your turn', icon: 'spell_holy_borrowedtime' },
  { id: 'multiple_per_round', name: 'Multiple Per Round', description: 'Can trigger multiple times in a single round', icon: 'ability_hunter_rapidkilling' },
  { id: 'once_per_source', name: 'Once Per Source', description: 'Can trigger once per triggering source/entity', icon: 'ability_hunter_snipershot' }
];

// Area effect types for channel termination/interruption effects
const AREA_EFFECT_TYPES = [
  { id: 'damage', name: 'Damage', description: 'Deals damage to enemies in the area', icon: 'spell_fire_flamebolt' },
  { id: 'healing', name: 'Healing', description: 'Heals allies in the area', icon: 'spell_holy_holyboltsplash' },
  { id: 'slow', name: 'Slow', description: 'Reduces movement speed of enemies in the area', icon: 'spell_frost_freezingbreath' },
  { id: 'stun', name: 'Stun', description: 'Briefly stuns enemies in the area', icon: 'spell_frost_stun' },
  { id: 'knockback', name: 'Knockback', description: 'Pushes enemies away from the center', icon: 'ability_druid_typhoon' },
  { id: 'pull', name: 'Pull', description: 'Pulls enemies toward the center', icon: 'spell_magic_polymorphchicken' }
];

// Damage types for specific damage triggers
const DAMAGE_TYPES = [
  'Physical', 'Fire', 'Cold', 'Lightning', 'Acid', 'Poison', 
  'Necrotic', 'Radiant', 'Force', 'Psychic', 'Thunder'
];

// Status effects for status-based triggers
const STATUS_EFFECTS = [
  'Stunned', 'Charmed', 'Frightened', 'Paralyzed', 'Poisoned', 
  'Slowed', 'Burning', 'Bleeding', 'Confused', 'Weakened'
];

// Environment types for environment-based triggers
const ENVIRONMENT_TYPES = [
  'Water', 'Fire', 'Forest', 'Desert', 'Underground', 
  'Mountain', 'Arctic', 'Urban', 'Ethereal', 'Planar'
];

// Weather conditions for weather-based triggers
const WEATHER_CONDITIONS = [
  'Rain', 'Storm', 'Fog', 'Snow', 'Extreme Heat', 
  'Extreme Cold', 'Wind', 'Clear Skies', 'Magical Weather', 'Elemental Weather'
];

const SpellTypeSpecificSettings = ({ 
  spellType, 
  spellData, 
  onUpdate 
}) => {
  // States for active abilities
  const [castTime, setCastTime] = useState(spellData.castTime || 'instant');
  const [castTimeValue, setCastTimeValue] = useState(spellData.castTimeValue || 1);
  const [requiresConcentration, setRequiresConcentration] = useState(spellData.requiresConcentration || false);

  // States for reactive abilities
  const [reactiveTriggerCategory, setReactiveTriggerCategory] = useState(spellData.reactiveTriggerCategory || '');
  const [reactiveTrigger, setReactiveTrigger] = useState(spellData.reactiveTrigger || '');
  const [customTriggerDescription, setCustomTriggerDescription] = useState(spellData.customTriggerDescription || '');
  const [triggerThreshold, setTriggerThreshold] = useState(spellData.triggerThreshold || 30);
  const [triggerRadius, setTriggerRadius] = useState(spellData.triggerRadius || 15);
  const [triggerDamageType, setTriggerDamageType] = useState(spellData.triggerDamageType || '');
  const [triggerEnemyCount, setTriggerEnemyCount] = useState(spellData.triggerEnemyCount || 3);
  const [triggerResourceType, setTriggerResourceType] = useState(spellData.triggerResourceType || '');
  const [triggerStatusEffect, setTriggerStatusEffect] = useState(spellData.triggerStatusEffect || '');
  const [triggerEnvironmentType, setTriggerEnvironmentType] = useState(spellData.triggerEnvironmentType || '');
  const [triggerWeatherCondition, setTriggerWeatherCondition] = useState(spellData.triggerWeatherCondition || '');
  const [triggerDeadAllyRange, setTriggerDeadAllyRange] = useState(spellData.triggerDeadAllyRange || 30);
  
  // State for reaction frequency (keeping this one)
  const [reactionFrequency, setReactionFrequency] = useState(spellData.reactionFrequency || 'once_per_round');
  
  // States for channeled abilities
  const [channelMaxRounds, setChannelMaxRounds] = useState(spellData.channelMaxRounds || 3);
  const [channelInterruptions, setChannelInterruptions] = useState(spellData.channelInterruptions || ['damage', 'cc']);
  const [channelRequirements, setChannelRequirements] = useState(spellData.channelRequirements || ['concentration']);
  const [channelTerminationEffect, setChannelTerminationEffect] = useState(spellData.channelTerminationEffect || 'none');
  const [channelInterruptionEffect, setChannelInterruptionEffect] = useState(spellData.channelInterruptionEffect || 'none');
  const [damageThresholdToBreak, setDamageThresholdToBreak] = useState(spellData.damageThresholdToBreak || 10);
  const [channelPerRoundCost, setChannelPerRoundCost] = useState(spellData.channelPerRoundCost || false);
  
  // New states for enhanced channel effects
  const [terminationAreaEffectType, setTerminationAreaEffectType] = useState(spellData.terminationAreaEffectType || 'damage');
  const [terminationAreaRadius, setTerminationAreaRadius] = useState(spellData.terminationAreaRadius || 15);
  const [terminationEffectPower, setTerminationEffectPower] = useState(spellData.terminationEffectPower || 5);
  
  const [interruptionAreaEffectType, setInterruptionAreaEffectType] = useState(spellData.interruptionAreaEffectType || 'damage');
  const [interruptionAreaRadius, setInterruptionAreaRadius] = useState(spellData.interruptionAreaRadius || 10);
  const [interruptionEffectPower, setInterruptionEffectPower] = useState(spellData.interruptionEffectPower || 3);
  
  // States for passive abilities
  const [passiveActivationType, setPassiveActivationType] = useState(spellData.passiveActivationType || 'always_active');
  const [passiveCondition, setPassiveCondition] = useState(spellData.passiveCondition || '');
  const [passiveHealthThreshold, setPassiveHealthThreshold] = useState(spellData.passiveHealthThreshold || 50);
  const [passiveResourceLevel, setPassiveResourceLevel] = useState(spellData.passiveResourceLevel || 30);
  const [passiveProximityRange, setPassiveProximityRange] = useState(spellData.passiveProximityRange || 20);

  // Update parent component when values change
  useEffect(() => {
    let updatedData = {};
    
    // Add values based on spell type
    if (spellType === 'active') {
      updatedData = {
        castTime,
        castTimeValue,
        requiresConcentration
      };
    } else if (spellType === 'reaction') {
      updatedData = {
        reactiveTriggerCategory,
        reactiveTrigger,
        customTriggerDescription,
        triggerThreshold,
        triggerRadius,
        triggerDamageType,
        triggerEnemyCount,
        triggerResourceType,
        triggerStatusEffect,
        triggerEnvironmentType,
        triggerWeatherCondition,
        triggerDeadAllyRange,
        reactionFrequency,
        requiresConcentration
      };
    } else if (spellType === 'channeled') {
      updatedData = {
        channelMaxRounds,
        channelInterruptions,
        channelRequirements,
        channelTerminationEffect,
        channelInterruptionEffect,
        damageThresholdToBreak,
        channelPerRoundCost,
        terminationAreaEffectType,
        terminationAreaRadius,
        terminationEffectPower,
        interruptionAreaEffectType,
        interruptionAreaRadius,
        interruptionEffectPower
      };
    } else if (spellType === 'passive') {
      updatedData = {
        passiveActivationType,
        passiveCondition,
        passiveHealthThreshold,
        passiveResourceLevel,
        passiveProximityRange,
        requiresConcentration
      };
    }
    
    onUpdate(updatedData);
  }, [
    spellType,
    // Active settings
    castTime,
    castTimeValue,
    requiresConcentration,
    
    // Reactive settings
    reactiveTriggerCategory,
    reactiveTrigger,
    customTriggerDescription,
    triggerThreshold,
    triggerRadius,
    triggerDamageType,
    triggerEnemyCount,
    triggerResourceType,
    triggerStatusEffect,
    triggerEnvironmentType,
    triggerWeatherCondition,
    triggerDeadAllyRange,
    reactionFrequency,
    
    // Channeled settings
    channelMaxRounds,
    channelInterruptions,
    channelRequirements,
    channelTerminationEffect,
    channelInterruptionEffect,
    damageThresholdToBreak,
    channelPerRoundCost,
    terminationAreaEffectType,
    terminationAreaRadius,
    terminationEffectPower,
    interruptionAreaEffectType,
    interruptionAreaRadius,
    interruptionEffectPower,
    
    // Passive settings
    passiveActivationType,
    passiveCondition,
    passiveHealthThreshold,
    passiveResourceLevel,
    passiveProximityRange,
    
    // Function reference
    onUpdate
  ]);

  // Handle trigger category selection
  const handleTriggerCategorySelect = (categoryId) => {
    setReactiveTriggerCategory(categoryId);
    setReactiveTrigger(''); // Reset the specific trigger when changing categories
  };
  
  // Handle trigger selection
  const handleTriggerSelect = (triggerId) => {
    setReactiveTrigger(triggerId);
  };
  
  // Toggle interrupt condition for channeled spells
  const toggleInterruptCondition = (conditionId) => {
    setChannelInterruptions(prev => {
      if (prev.includes(conditionId)) {
        return prev.filter(id => id !== conditionId);
      } else {
        return [...prev, conditionId];
      }
    });
  };
  
  // Toggle channel requirement
  const toggleChannelRequirement = (requirementId) => {
    setChannelRequirements(prev => {
      if (prev.includes(requirementId)) {
        return prev.filter(id => id !== requirementId);
      } else {
        return [...prev, requirementId];
      }
    });
  };

  // Render content based on spell type
  const renderContent = () => {
    switch (spellType) {
      case 'active':
        return renderActiveConfig();
      case 'passive':
        return renderPassiveConfig();
      case 'channeled':
        return renderChanneledConfig();
      case 'reaction':
        return renderReactiveConfig();
      default:
        return <div>Select a spell type</div>;
    }
  };

  // Active spell configuration section
  const renderActiveConfig = () => {
    return (
      <div className="section spell-type-specific-section">
        <h5 className="section-title">
          <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_greaterheal.jpg" alt="" className="section-icon" />
          Active Ability Configuration
        </h5>
        <p className="section-description">
          Active abilities are cast directly and require an action to use.
        </p>
        
        <div className="cast-time-section">
          <h6 className="subsection-title">Cast Time</h6>
          <div className="cast-time-options card-grid">
            {CAST_TIME_OPTIONS.map(option => (
              <div 
                key={option.id}
                className={`cast-option ${castTime === option.id ? 'selected' : ''}`}
                onClick={() => setCastTime(option.id)}
              >
                <div className="option-icon">
                  <img src={`https://wow.zamimg.com/images/wow/icons/medium/${option.icon}.jpg`} alt={option.name} />
                </div>
                <div className="option-info">
                  <span className="option-name">{option.name}</span>
                  <span className="option-description">{option.description}</span>
                </div>
              </div>
            ))}
          </div>
          
          {castTime === 'multi-round' && (
            <div className="channel-duration" style={{marginTop: '15px'}}>
              <div className="channel-input-container">
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={castTimeValue}
                  onChange={(e) => setCastTimeValue(parseInt(e.target.value) || 2)}
                  className="channel-input"
                />
                <span className="rounds-label">rounds</span>
              </div>
              <p className="input-description">
                Number of rounds it takes to complete casting this spell. During this time, you are vulnerable and the spell can be interrupted.
              </p>
            </div>
          )}
        </div>
        
        <div className="targeting-disruption-section" style={{marginTop: '20px'}}>
          <h6 className="subsection-title">Targeting and Disruption</h6>
          <div className="checkbox-container">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={requiresConcentration}
                onChange={() => setRequiresConcentration(!requiresConcentration)}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">Requires Concentration</span>
            </label>
          </div>
          <p className="input-description">
            If this ability requires concentration, it can be disrupted if you take damage or cast another concentration spell.
          </p>
        </div>
      </div>
    );
  };

  // Passive ability configuration section
  const renderPassiveConfig = () => {
    return (
      <div className="section spell-type-specific-section">
        <h5 className="section-title">
          <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_devotionaura.jpg" alt="" className="section-icon" />
          Passive Ability Configuration
        </h5>
        <p className="section-description">
          Passive abilities provide ongoing benefits without requiring activation.
        </p>
        
        <div className="passive-activation-section">
          <h6 className="subsection-title">Activation Type</h6>
          <div className="card-grid">
            {PASSIVE_ACTIVATION_OPTIONS.map(option => (
              <div 
                key={option.id}
                className={`cast-option ${passiveActivationType === option.id ? 'selected' : ''}`}
                onClick={() => setPassiveActivationType(option.id)}
              >
                <div className="cast-option-icon">
                  <img src={`https://wow.zamimg.com/images/wow/icons/medium/${option.icon}.jpg`} alt={option.name} />
                </div>
                <div className="cast-option-info">
                  <div className="cast-option-name">{option.name}</div>
                  <div className="cast-option-description">{option.description}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Conditional activation parameters */}
          {passiveActivationType === 'conditional' && (
            <div className="passive-conditions" style={{marginTop: '20px'}}>
              <h6 className="subsection-title">Activation Conditions</h6>
              <div className="card-grid">
                {PASSIVE_CONDITIONS.map(condition => (
                  <div 
                    key={condition.id}
                    className={`cast-option ${passiveCondition === condition.id ? 'selected' : ''}`}
                    onClick={() => setPassiveCondition(condition.id)}
                  >
                    <div className="cast-option-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${condition.icon}.jpg`} alt={condition.name} />
                    </div>
                    <div className="cast-option-info">
                      <div className="cast-option-name">{condition.name}</div>
                      <div className="cast-option-description">{condition.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Condition-specific parameters */}
              {passiveCondition === 'health_threshold' && (
                <div className="parameter-input aoe-size" style={{marginTop: '15px'}}>
                  <label>Health Threshold (%)</label>
                  <div className="size-input-container">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={passiveHealthThreshold}
                      onChange={(e) => setPassiveHealthThreshold(parseInt(e.target.value))}
                      className="size-slider"
                      style={{
                        "--progress": `${passiveHealthThreshold}%`
                      }}
                    />
                    <div className="size-value">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={passiveHealthThreshold}
                        onChange={(e) => setPassiveHealthThreshold(parseInt(e.target.value) || 1)}
                        className="size-input"
                      />
                      <span className="size-unit">%</span>
                    </div>
                  </div>
                  <p className="input-description">
                    This ability activates when your health is below this percentage.
                  </p>
                </div>
              )}
              
              {passiveCondition === 'resource_level' && (
                <div className="parameter-input aoe-size" style={{marginTop: '15px'}}>
                  <label>Resource Level (%)</label>
                  <div className="size-input-container">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={passiveResourceLevel}
                      onChange={(e) => setPassiveResourceLevel(parseInt(e.target.value))}
                      className="size-slider"
                      style={{
                        "--progress": `${passiveResourceLevel}%`
                      }}
                    />
                    <div className="size-value">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={passiveResourceLevel}
                        onChange={(e) => setPassiveResourceLevel(parseInt(e.target.value) || 1)}
                        className="size-input"
                      />
                      <span className="size-unit">%</span>
                    </div>
                  </div>
                  <p className="input-description">
                    This ability activates when your primary resource is above or below this percentage.
                  </p>
                </div>
              )}
              
              {(passiveCondition === 'ally_proximity' || passiveCondition === 'enemy_proximity') && (
                <div className="parameter-input aoe-size" style={{marginTop: '15px'}}>
                  <label>Proximity Range (ft)</label>
                  <div className="size-input-container">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={passiveProximityRange}
                      onChange={(e) => setPassiveProximityRange(parseInt(e.target.value))}
                      className="size-slider"
                      style={{
                        "--progress": `${(passiveProximityRange - 5) / (60 - 5) * 100}%`
                      }}
                    />
                    <div className="size-value">
                      <input
                        type="number"
                        min="5"
                        max="60"
                        step="5"
                        value={passiveProximityRange}
                        onChange={(e) => setPassiveProximityRange(parseInt(e.target.value) || 5)}
                        className="size-input"
                      />
                      <span className="size-unit">ft</span>
                    </div>
                  </div>
                  <p className="input-description">
                    This ability activates when {passiveCondition === 'ally_proximity' ? 'allies' : 'enemies'} are within this distance.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="passive-range-section" style={{marginTop: '20px'}}>
          <h6 className="subsection-title">Passive Effect Options</h6>
          <div className="checkbox-container">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={requiresConcentration}
                onChange={() => setRequiresConcentration(!requiresConcentration)}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">Requires Concentration</span>
            </label>
          </div>
          <p className="input-description">
            Some passive abilities require concentration to maintain their effects. 
            These can be disrupted if you take damage or cast another concentration spell.
          </p>
        </div>
      </div>
    );
  };

  // Channeled ability configuration section
  const renderChanneledConfig = () => {
    return (
      <div className="section spell-type-specific-section">
        <h5 className="section-title">
          <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_arcane_mindmastery.jpg" alt="" className="section-icon" />
          Channeled Ability Configuration
        </h5>
        <p className="section-description">
          Channeled abilities maintain their effect over multiple rounds as long as you continue to channel.
        </p>
        
        <div className="section">
          <h5 className="subsection-title">Channel Duration (in rounds)</h5>
          <div className="channel-duration">
            <div className="channel-input-container">
              <input
                type="number"
                min="1"
                max="10"
                value={channelMaxRounds}
                onChange={(e) => setChannelMaxRounds(parseInt(e.target.value) || 1)}
                className="channel-input"
              />
              <span className="rounds-label">rounds</span>
            </div>
            <p className="input-description">
              Maximum number of rounds you can channel this ability. 
              Longer channels are more powerful but leave you vulnerable.
            </p>
          </div>
        </div>
        
        <div className="channeling-options-container">
          <div className="section channel-requirements-section">
            <h5 className="subsection-title">Channel Requirements</h5>
            <p className="section-description">
              Select what conditions must be maintained to continue channeling.
            </p>
            
            <div className="card-grid requirement-grid">
              {CHANNEL_REQUIREMENTS.map(req => (
                <div 
                  key={req.id}
                  className={`effect-type-item ${channelRequirements.includes(req.id) ? 'selected' : ''}`}
                  onClick={() => toggleChannelRequirement(req.id)}
                >
                  <div className="effect-type-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${req.icon}.jpg`} alt={req.name} />
                  </div>
                  <div className="effect-type-name">{req.name}</div>
                  
                  {channelRequirements.includes(req.id) && (
                    <div className="selection-indicator"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Per-round cost configuration */}
            {channelRequirements.includes('per_round_cost') && (
              <div className="channel-per-round-cost" style={{marginTop: '15px'}}>
                <div className="checkbox-container">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={channelPerRoundCost}
                      onChange={() => setChannelPerRoundCost(!channelPerRoundCost)}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-label">Pay resource cost each round</span>
                  </label>
                </div>
                <p className="input-description">
                  If checked, you must pay the resource cost each round to maintain the channel.
                  Otherwise, you only pay once when you begin channeling.
                </p>
              </div>
            )}
          </div>
          
          <div className="section channel-interruption-section">
            <h5 className="subsection-title">Interruption Conditions</h5>
            <p className="section-description">
              Select what conditions will interrupt your channeling.
            </p>
            
            <div className="card-grid interruption-grid">
              {CHANNEL_INTERRUPTION_CONDITIONS.map(condition => (
                <div 
                  key={condition.id}
                  className={`effect-type-item ${channelInterruptions.includes(condition.id) ? 'selected' : ''}`}
                  onClick={() => toggleInterruptCondition(condition.id)}
                >
                  <div className="effect-type-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${condition.icon}.jpg`} alt={condition.name} />
                  </div>
                  <div className="effect-type-name">{condition.name}</div>
                  
                  {channelInterruptions.includes(condition.id) && (
                    <div className="selection-indicator"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Damage threshold for interruption */}
            {channelInterruptions.includes('damage') && (
              <div className="damage-threshold" style={{marginTop: '15px'}}>
                <h6 className="subsection-title">Damage Threshold to Break Channel</h6>
                <div className="channel-input-container">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={damageThresholdToBreak}
                    onChange={(e) => setDamageThresholdToBreak(parseInt(e.target.value) || 1)}
                    className="channel-input"
                  />
                  <span className="rounds-label">damage</span>
                </div>
                <p className="input-description">
                  Amount of damage that must be taken in a single hit to break your concentration.
                  Higher values make your channel more resilient to damage.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="channeling-outcomes-container">
          <div className="section channel-termination-section">
            <h5 className="subsection-title">Channel Completion Effect</h5>
            <p className="section-description">
              What happens when your channel completes successfully.
            </p>
            
            <div className="card-grid">
              {CHANNEL_TERMINATION_EFFECTS.map(effect => (
                <div 
                  key={effect.id}
                  className={`cast-option ${channelTerminationEffect === effect.id ? 'selected' : ''}`}
                  onClick={() => setChannelTerminationEffect(effect.id)}
                  style={{position: 'relative'}}
                >
                  <div className="cast-option-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${effect.icon}.jpg`} alt={effect.name} />
                  </div>
                  <div className="cast-option-info">
                    <div className="cast-option-name">{effect.name}</div>
                    <div className="cast-option-description">{effect.description}</div>
                  </div>
                  {effect.hasAreaEffect && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: '#f8d64e',
                        color: '#000',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      AoE
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Area effect configuration for termination effect */}
            {channelTerminationEffect && CHANNEL_TERMINATION_EFFECTS.find(e => e.id === channelTerminationEffect)?.hasAreaEffect && (
              <div className="area-effect-config" style={{marginTop: '20px', border: '1px solid #3a3a3a', borderRadius: '5px', padding: '15px', backgroundColor: '#252525'}}>
                <h6 className="subsection-title">Area Effect Configuration</h6>
                
                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Effect Type</label>
                  <div className="card-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px'}}>
                    {AREA_EFFECT_TYPES.map(type => (
                      <div 
                        key={type.id}
                        className={`effect-type-item ${terminationAreaEffectType === type.id ? 'selected' : ''}`}
                        onClick={() => setTerminationAreaEffectType(type.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '10px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          backgroundColor: terminationAreaEffectType === type.id ? '#3e586e' : '#2a2a2a',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{marginBottom: '5px'}}>
                          <img 
                            src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} 
                            alt={type.name} 
                            style={{width: '30px', height: '30px', borderRadius: '4px'}}
                          />
                        </div>
                        <div style={{fontSize: '12px', textAlign: 'center'}}>{type.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Effect Radius (ft)</label>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={terminationAreaRadius}
                      onChange={(e) => setTerminationAreaRadius(parseInt(e.target.value))}
                      style={{flex: '1'}}
                    />
                    <div style={{display: 'flex', alignItems: 'center', minWidth: '80px'}}>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        step="5"
                        value={terminationAreaRadius}
                        onChange={(e) => setTerminationAreaRadius(parseInt(e.target.value) || 5)}
                        style={{width: '50px', textAlign: 'center', padding: '5px'}}
                      />
                      <span style={{marginLeft: '5px'}}>ft</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Effect Power</label>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={terminationEffectPower}
                      onChange={(e) => setTerminationEffectPower(parseInt(e.target.value))}
                      style={{flex: '1'}}
                    />
                    <div style={{minWidth: '30px', textAlign: 'center'}}>{terminationEffectPower}</div>
                  </div>
                  <p style={{fontSize: '12px', marginTop: '5px', color: '#aaa'}}>
                    {terminationAreaEffectType === 'damage' && 'Higher values increase damage dealt to enemies in the area.'}
                    {terminationAreaEffectType === 'healing' && 'Higher values increase healing provided to allies in the area.'}
                    {terminationAreaEffectType === 'slow' && 'Higher values increase the movement speed reduction and/or duration.'}
                    {terminationAreaEffectType === 'stun' && 'Higher values increase the stun duration.'}
                    {terminationAreaEffectType === 'knockback' && 'Higher values increase the knockback distance.'}
                    {terminationAreaEffectType === 'pull' && 'Higher values increase the pull strength and range.'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="section channel-interruption-effects-section">
            <h5 className="subsection-title">Channel Interruption Effect</h5>
            <p className="section-description">
              What happens if your channel is interrupted before completion.
            </p>
            
            <div className="card-grid">
              {CHANNEL_INTERRUPTION_EFFECTS.map(effect => (
                <div 
                  key={effect.id}
                  className={`cast-option ${channelInterruptionEffect === effect.id ? 'selected' : ''}`}
                  onClick={() => setChannelInterruptionEffect(effect.id)}
                  style={{position: 'relative'}}
                >
                  <div className="cast-option-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${effect.icon}.jpg`} alt={effect.name} />
                  </div>
                  <div className="cast-option-info">
                    <div className="cast-option-name">{effect.name}</div>
                    <div className="cast-option-description">{effect.description}</div>
                  </div>
                  {effect.hasAreaEffect && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: '#f8d64e',
                        color: '#000',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      AoE
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Area effect configuration for interruption effect */}
            {channelInterruptionEffect && CHANNEL_INTERRUPTION_EFFECTS.find(e => e.id === channelInterruptionEffect)?.hasAreaEffect && (
              <div className="area-effect-config" style={{marginTop: '20px', border: '1px solid #3a3a3a', borderRadius: '5px', padding: '15px', backgroundColor: '#252525'}}>
                <h6 className="subsection-title">Interruption Area Effect</h6>
                
                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Effect Type</label>
                  <div className="card-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px'}}>
                    {AREA_EFFECT_TYPES.map(type => (
                      <div 
                        key={type.id}
                        className={`effect-type-item ${interruptionAreaEffectType === type.id ? 'selected' : ''}`}
                        onClick={() => setInterruptionAreaEffectType(type.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '10px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          backgroundColor: interruptionAreaEffectType === type.id ? '#6e3e3e' : '#2a2a2a',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{marginBottom: '5px'}}>
                          <img 
                            src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} 
                            alt={type.name} 
                            style={{width: '30px', height: '30px', borderRadius: '4px'}}
                          />
                        </div>
                        <div style={{fontSize: '12px', textAlign: 'center'}}>{type.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Effect Radius (ft)</label>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="5"
                      value={interruptionAreaRadius}
                      onChange={(e) => setInterruptionAreaRadius(parseInt(e.target.value))}
                      style={{flex: '1'}}
                    />
                    <div style={{display: 'flex', alignItems: 'center', minWidth: '80px'}}>
                      <input
                        type="number"
                        min="5"
                        max="30"
                        step="5"
                        value={interruptionAreaRadius}
                        onChange={(e) => setInterruptionAreaRadius(parseInt(e.target.value) || 5)}
                        style={{width: '50px', textAlign: 'center', padding: '5px'}}
                      />
                      <span style={{marginLeft: '5px'}}>ft</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Effect Power</label>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={interruptionEffectPower}
                      onChange={(e) => setInterruptionEffectPower(parseInt(e.target.value))}
                      style={{flex: '1'}}
                    />
                    <div style={{minWidth: '30px', textAlign: 'center'}}>{interruptionEffectPower}</div>
                  </div>
                  <p style={{fontSize: '12px', marginTop: '5px', color: '#aaa'}}>
                    {interruptionAreaEffectType === 'damage' && 'Higher values increase damage dealt to enemies in the area.'}
                    {interruptionAreaEffectType === 'healing' && 'Higher values increase healing provided to allies in the area.'}
                    {interruptionAreaEffectType === 'slow' && 'Higher values increase the movement speed reduction and/or duration.'}
                    {interruptionAreaEffectType === 'stun' && 'Higher values increase the stun duration.'}
                    {interruptionAreaEffectType === 'knockback' && 'Higher values increase the knockback distance.'}
                    {interruptionAreaEffectType === 'pull' && 'Higher values increase the pull strength and range.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Reactive ability configuration section
  const renderReactiveConfig = () => {
    return (
      <div className="section spell-type-specific-section">
        <h5 className="section-title">
          <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_revenge.jpg" alt="" className="section-icon" />
          Reactive Ability Configuration
        </h5>
        <p className="section-description">
          Reactive abilities activate automatically when specific conditions are met, allowing your character 
          to respond to battlefield situations even when it's not your turn.
        </p>
        
        <div className="reactive-settings-container">
          <div className="reactive-trigger-settings">
            {/* Trigger Category Selection */}
            <div className="section">
              <h5 className="subsection-title">Trigger Category</h5>
              <div className="trigger-categories card-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))'}}>
                {REACTIVE_TRIGGER_CATEGORIES.map(category => (
                  <div 
                    key={category.id}
                    className={`trigger-category ${reactiveTriggerCategory === category.id ? 'selected' : ''}`}
                    onClick={() => handleTriggerCategorySelect(category.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '15px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      backgroundColor: reactiveTriggerCategory === category.id ? '#3e586e' : '#2a2a2a',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{marginBottom: '8px'}}>
                      <img 
                        src={`https://wow.zamimg.com/images/wow/icons/medium/${category.icon}.jpg`} 
                        alt={category.name} 
                        style={{width: '40px', height: '40px', borderRadius: '4px'}}
                      />
                    </div>
                    <div style={{textAlign: 'center', fontSize: '14px', fontWeight: reactiveTriggerCategory === category.id ? 'bold' : 'normal'}}>
                      {category.name}
                    </div>
                  </div>
                ))}
                
                <div 
                  className={`trigger-category ${reactiveTriggerCategory === 'custom' ? 'selected' : ''}`}
                  onClick={() => {
                    handleTriggerCategorySelect('custom');
                    handleTriggerSelect('custom');
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '15px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor: reactiveTriggerCategory === 'custom' ? '#3e586e' : '#2a2a2a',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{marginBottom: '8px'}}>
                    <img 
                      src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg" 
                      alt="Custom" 
                      style={{width: '40px', height: '40px', borderRadius: '4px'}}
                    />
                  </div>
                  <div style={{textAlign: 'center', fontSize: '14px', fontWeight: reactiveTriggerCategory === 'custom' ? 'bold' : 'normal'}}>
                    Custom Trigger
                  </div>
                </div>
              </div>
            </div>
            
            {/* Specific Trigger Selection with Grid Layout */}
            {reactiveTriggerCategory && reactiveTriggerCategory !== 'custom' && (
              <div className="section" style={{marginTop: '20px'}}>
                <h5 className="subsection-title">Specific Trigger</h5>
                <div className="triggers-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '15px',
                  marginTop: '10px'
                }}>
                  {REACTIVE_TRIGGER_CATEGORIES
                    .find(cat => cat.id === reactiveTriggerCategory)
                    ?.triggers.map(trigger => (
                    <div 
                      key={trigger.id}
                      className={`trigger-option ${reactiveTrigger === trigger.id ? 'selected' : ''}`}
                      onClick={() => handleTriggerSelect(trigger.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        backgroundColor: reactiveTrigger === trigger.id ? '#3e586e' : '#2a2a2a',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{marginRight: '12px'}}>
                        <img 
                          src={`https://wow.zamimg.com/images/wow/icons/medium/${trigger.icon}.jpg`} 
                          alt={trigger.name} 
                          style={{width: '32px', height: '32px', borderRadius: '4px'}}
                        />
                      </div>
                      <div>
                        <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '3px'}}>{trigger.name}</div>
                        <div style={{fontSize: '12px', color: '#aaa'}}>{trigger.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Custom Trigger */}
            {reactiveTriggerCategory === 'custom' && (
              <div className="custom-trigger" style={{marginTop: '20px'}}>
                <h6 className="subsection-title">Custom Trigger Description</h6>
                <textarea
                  value={customTriggerDescription}
                  onChange={(e) => setCustomTriggerDescription(e.target.value)}
                  placeholder="Describe your custom trigger condition..."
                  className="spell-description-input"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#1a1a1a',
                    color: '#eee',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
                <p className="input-description" style={{fontSize: '12px', color: '#aaa', marginTop: '5px'}}>
                  Be specific about what condition triggers this spell. The Game Master will use this description to determine when your reactive ability activates.
                </p>
              </div>
            )}
          </div>
          
          <div className="reaction-mechanics-settings" style={{marginTop: '20px'}}>
            {/* Reaction Frequency Setting */}
            <div className="section">
              <h5 className="subsection-title">Reaction Frequency</h5>
              <div className="card-grid">
                {REACTION_FREQUENCY_OPTIONS.map(option => (
                  <div 
                    key={option.id}
                    className={`cast-option ${reactionFrequency === option.id ? 'selected' : ''}`}
                    onClick={() => setReactionFrequency(option.id)}
                    style={{
                      display: 'flex',
                      padding: '12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      backgroundColor: reactionFrequency === option.id ? '#3e586e' : '#2a2a2a',
                      border: reactionFrequency === option.id ? '1px solid #5e88ae' : '1px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{marginRight: '12px'}}>
                      <img 
                        src={`https://wow.zamimg.com/images/wow/icons/medium/${option.icon}.jpg`} 
                        alt={option.name} 
                        style={{width: '32px', height: '32px', borderRadius: '4px'}}
                      />
                    </div>
                    <div>
                      <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '3px'}}>{option.name}</div>
                      <div style={{fontSize: '12px', color: '#aaa'}}>{option.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional trigger parameters based on the selected trigger */}
        {reactiveTrigger && reactiveTriggerCategory !== 'custom' && (
          <div className="trigger-parameters" style={{marginTop: '20px', padding: '15px', backgroundColor: '#252525', borderRadius: '5px'}}>
            <h6 className="subsection-title">Trigger Parameters</h6>
            
            {/* Health threshold parameters */}
            {(reactiveTrigger === 'low_health' || reactiveTrigger === 'ally_low_health') && (
              <div className="parameter-input" style={{marginTop: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Health Threshold (%)</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={triggerThreshold}
                    onChange={(e) => setTriggerThreshold(parseInt(e.target.value))}
                    style={{flex: '1'}}
                  />
                  <div style={{display: 'flex', alignItems: 'center', minWidth: '80px'}}>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={triggerThreshold}
                      onChange={(e) => setTriggerThreshold(parseInt(e.target.value) || 1)}
                      style={{width: '50px', textAlign: 'center', padding: '5px'}}
                    />
                    <span style={{marginLeft: '5px'}}>%</span>
                  </div>
                </div>
                <p style={{fontSize: '12px', marginTop: '5px', color: '#aaa'}}>
                  This ability activates when health falls below this percentage.
                </p>
              </div>
            )}
            
            {/* Area radius parameters */}
            {(reactiveTrigger === 'enemy_approach' || reactiveTrigger === 'ally_death') && (
              <div className="parameter-input" style={{marginTop: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
                  {reactiveTrigger === 'enemy_approach' ? 'Detection Radius' : 'Ally Death Detection Range'} (ft)
                </label>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={reactiveTrigger === 'ally_death' ? triggerDeadAllyRange : triggerRadius}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (reactiveTrigger === 'ally_death') {
                        setTriggerDeadAllyRange(val);
                      } else {
                        setTriggerRadius(val);
                      }
                    }}
                    style={{flex: '1'}}
                  />
                  <div style={{display: 'flex', alignItems: 'center', minWidth: '80px'}}>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      step="5"
                      value={reactiveTrigger === 'ally_death' ? triggerDeadAllyRange : triggerRadius}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 5;
                        if (reactiveTrigger === 'ally_death') {
                          setTriggerDeadAllyRange(val);
                        } else {
                          setTriggerRadius(val);
                        }
                      }}
                      style={{width: '50px', textAlign: 'center', padding: '5px'}}
                    />
                    <span style={{marginLeft: '5px'}}>ft</span>
                  </div>
                </div>
                <p style={{fontSize: '12px', marginTop: '5px', color: '#aaa'}}>
                  {reactiveTrigger === 'enemy_approach' 
                    ? 'This ability activates when enemies enter within this distance of you.' 
                    : 'This ability activates when an ally dies within this distance of you.'}
                </p>
              </div>
            )}
            
            {/* Damage type parameters */}
            {reactiveTrigger === 'specific_damage_type' && (
              <div className="parameter-input" style={{marginTop: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Damage Type</label>
                <div className="card-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px'}}>
                  {DAMAGE_TYPES.map(type => (
                    <div 
                      key={type}
                      className={`damage-type-option ${triggerDamageType === type ? 'selected' : ''}`}
                      onClick={() => setTriggerDamageType(type)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: triggerDamageType === type ? '#3e586e' : '#2a2a2a',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
                <p style={{fontSize: '12px', marginTop: '10px', color: '#aaa'}}>
                  This ability activates when you take damage of this specific type.
                </p>
              </div>
            )}
            
            {/* Enemy count parameters */}
            {reactiveTrigger === 'surrounded' && (
              <div className="parameter-input" style={{marginTop: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Enemy Count</label>
                <div style={{display: 'flex', alignItems: 'center', maxWidth: '200px'}}>
                  <button 
                    style={{
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#444',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                    onClick={() => setTriggerEnemyCount(Math.max(2, triggerEnemyCount - 1))}
                  >−</button>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={triggerEnemyCount}
                    onChange={(e) => setTriggerEnemyCount(parseInt(e.target.value) || 2)}
                    style={{
                      margin: '0 10px',
                      width: '60px',
                      textAlign: 'center',
                      padding: '5px',
                      backgroundColor: '#1a1a1a',
                      color: '#eee',
                      border: '1px solid #444',
                      borderRadius: '4px'
                    }}
                  />
                  <button 
                    style={{
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#444',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                    onClick={() => setTriggerEnemyCount(Math.min(10, triggerEnemyCount + 1))}
                  >+</button>
                </div>
                <p style={{fontSize: '12px', marginTop: '10px', color: '#aaa'}}>
                  This ability activates when this many or more enemies are within 10 feet of you.
                </p>
              </div>
            )}
            
            {/* Resource selection for resource-based triggers */}
            {(reactiveTrigger === 'resource_full' || reactiveTrigger === 'resource_empty' || reactiveTrigger === 'resource_threshold' || reactiveTrigger === 'overcapped') && (
              <div className="parameter-input" style={{marginTop: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Resource Type</label>
                <select
                  value={triggerResourceType}
                  onChange={(e) => setTriggerResourceType(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '8px 12px',
                    backgroundColor: '#1a1a1a',
                    color: '#eee',
                    border: '1px solid #444',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select Resource</option>
                  <option value="Mana">Mana</option>
                  <option value="Health">Health</option>
                  <option value="Rage">Rage</option>
                  <option value="Energy">Energy</option>
                  <option value="Focus">Focus</option>
                  <option value="Fury">Fury</option>
                  <option value="Spirit">Spirit</option>
                </select>
                <p style={{fontSize: '12px', marginTop: '5px', color: '#aaa'}}>
                  This ability activates based on this resource's state.
                </p>
              </div>
            )}
            
            {/* Status effect parameters */}
            {(reactiveTrigger === 'status_effect' || reactiveTrigger === 'buff_applied' || reactiveTrigger === 'buff_expired') && (
              <div className="parameter-input" style={{marginTop: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Status Effect</label>
                <div className="card-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px'}}>
                  {STATUS_EFFECTS.map(effect => (
                    <div 
                      key={effect}
                      className={`status-effect-option ${triggerStatusEffect === effect ? 'selected' : ''}`}
                      onClick={() => setTriggerStatusEffect(effect)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: triggerStatusEffect === effect ? '#3e586e' : '#2a2a2a',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {effect}
                    </div>
                  ))}
                  <div 
                    className={`status-effect-option ${triggerStatusEffect === 'custom' ? 'selected' : ''}`}
                    onClick={() => setTriggerStatusEffect('custom')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: triggerStatusEffect === 'custom' ? '#3e586e' : '#2a2a2a',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Custom
                  </div>
                </div>
                
                {triggerStatusEffect === 'custom' && (
                  <div style={{marginTop: '12px'}}>
                    <input
                      type="text"
                      value={customTriggerDescription}
                      onChange={(e) => setCustomTriggerDescription(e.target.value)}
                      placeholder="Describe the custom status effect..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#1a1a1a',
                        color: '#eee',
                        border: '1px solid #444',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}
                <p style={{fontSize: '12px', marginTop: '10px', color: '#aaa'}}>
                  This ability activates in relation to this status effect.
                </p>
              </div>
            )}
            
            {/* Environment type parameters */}
            {reactiveTrigger === 'terrain_type' && (
              <div className="parameter-input" style={{marginTop: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Terrain Type</label>
                <div className="card-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px'}}>
                  {ENVIRONMENT_TYPES.map(type => (
                    <div 
                      key={type}
                      className={`environment-type-option ${triggerEnvironmentType === type ? 'selected' : ''}`}
                      onClick={() => setTriggerEnvironmentType(type)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: triggerEnvironmentType === type ? '#3e586e' : '#2a2a2a',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {type}
                    </div>
                  ))}
                  <div 
                    className={`environment-type-option ${triggerEnvironmentType === 'custom' ? 'selected' : ''}`}
                    onClick={() => setTriggerEnvironmentType('custom')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: triggerEnvironmentType === 'custom' ? '#3e586e' : '#2a2a2a',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Custom
                  </div>
                </div>
                
                {triggerEnvironmentType === 'custom' && (
                  <div style={{marginTop: '12px'}}>
                    <input
                      type="text"
                      value={customTriggerDescription}
                      onChange={(e) => setCustomTriggerDescription(e.target.value)}
                      placeholder="Describe the custom terrain..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#1a1a1a',
                        color: '#eee',
                        border: '1px solid #444',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}
                <p style={{fontSize: '12px', marginTop: '10px', color: '#aaa'}}>
                  This ability activates when on this specific type of terrain.
                </p>
              </div>
            )}
            
            {/* Weather condition parameters */}
            {reactiveTrigger === 'weather_effect' && (
              <div className="parameter-input" style={{marginTop: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Weather Condition</label>
                <div className="card-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px'}}>
                  {WEATHER_CONDITIONS.map(condition => (
                    <div 
                      key={condition}
                      className={`weather-condition-option ${triggerWeatherCondition === condition ? 'selected' : ''}`}
                      onClick={() => setTriggerWeatherCondition(condition)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: triggerWeatherCondition === condition ? '#3e586e' : '#2a2a2a',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {condition}
                    </div>
                  ))}
                  <div 
                    className={`weather-condition-option ${triggerWeatherCondition === 'custom' ? 'selected' : ''}`}
                    onClick={() => setTriggerWeatherCondition('custom')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: triggerWeatherCondition === 'custom' ? '#3e586e' : '#2a2a2a',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Custom
                  </div>
                </div>
                
                {triggerWeatherCondition === 'custom' && (
                  <div style={{marginTop: '12px'}}>
                    <input
                      type="text"
                      value={customTriggerDescription}
                      onChange={(e) => setCustomTriggerDescription(e.target.value)}
                      placeholder="Describe the custom weather condition..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#1a1a1a',
                        color: '#eee',
                        border: '1px solid #444',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}
                <p style={{fontSize: '12px', marginTop: '10px', color: '#aaa'}}>
                  This ability activates during this specific weather condition.
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="section" style={{marginTop: '20px'}}>
          <h5 className="subsection-title">Additional Reactive Settings</h5>
          <div className="checkbox-container">
            <label className="custom-checkbox" style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
              <input
                type="checkbox"
                checked={requiresConcentration}
                onChange={() => setRequiresConcentration(!requiresConcentration)}
                style={{marginRight: '8px'}}
              />
              <span style={{position: 'relative', display: 'inline-block', width: '18px', height: '18px', backgroundColor: requiresConcentration ? '#3e586e' : '#2a2a2a', borderRadius: '3px', marginRight: '8px'}}>
                {requiresConcentration && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    left: '6px',
                    width: '6px',
                    height: '10px',
                    borderRight: '2px solid white',
                    borderBottom: '2px solid white',
                    transform: 'rotate(45deg)'
                  }}></span>
                )}
              </span>
              <span>Requires Concentration Once Activated</span>
            </label>
          </div>
          <p style={{fontSize: '12px', marginTop: '5px', color: '#aaa'}}>
            If checked, this reactive ability requires concentration once it activates.
            This means it could be disrupted if you take damage after it triggers.
          </p>
        </div>
      </div>
    );
  };
  
  // Main render method
  return (
    <div className="spell-type-specific-settings">
      {renderContent()}
    </div>
  );
};

export default SpellTypeSpecificSettings;